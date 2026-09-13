/**
 * 自托管字体构建：把站点用到的字子集化成 woff2，输出 public/fonts/ 与 src/styles/fonts.css
 *
 *   npm run build:fonts
 *
 * 为什么要自托管：Google Fonts 对中日韩字体只能按固定分片（unicode-range）下发，
 * 首页会拉 20+ 个 80KB 左右的分片、外加 120KB 全是 @font-face 的样式表。
 * 每次分片到达都会触发一次全文重排 —— 实测 Style & Layout 5 秒、LCP 13 秒。
 *
 * 两条原则，都是从 Lighthouse 的失败里换来的：
 *
 * 一、可变字体，一个文件顶掉所有字重。
 *   300 / 400 / 600 / 900 四个静态实例各存一份完整轮廓，合计 854KB；
 *   保留 wght 轴只存一份轮廓加变化量，同样的字只要 407KB。
 *   文件少了还有一个隐藏收益：字体到达只触发一次重排，不是四次。
 *
 * 二、分两片，靠 font-family 回退而不是 unicode-range。
 *   主片 = 首页要用的字（含手记的 YAML 头：标题、摘要、标签都会显示在列表页上）；
 *   Ext 片 = 只在手记正文里出现的字。
 *   两片用两个 family 名、都不写 unicode-range —— 浏览器先在主片找字，
 *   找不到才去 Ext 取，于是首页一个字都不缺、Ext 压根不会被请求。
 *   （逐字列举上千字的 unicode-range 要近 5KB，塞进渲染阻塞的主 CSS 里，
 *     省下的字体字节还不够抵它，所以不用。）
 *
 * 需要 python + fonttools + brotli（见 README「字体」一节）。
 * 产物已提交进仓库，平常构建与 CI 不需要跑这个脚本。
 * 改了站点文案或手记内容之后要重跑，否则新字会退到系统字体。
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CACHE = path.join(ROOT, '.fontcache')
const OUT_FONTS = path.join(ROOT, 'public', 'fonts')
const OUT_CSS = path.join(ROOT, 'src', 'styles', 'fonts.css')

// 源字体：都是可变字体，实例化出需要的字重，省得下四份 20MB+ 的静态字体
const SOURCES = {
  noto: {
    url: 'https://raw.githubusercontent.com/notofonts/noto-cjk/main/Serif/Variable/OTF/Subset/NotoSerifSC-VF.otf',
    file: 'NotoSerifSC-VF.otf',
  },
  cormorant: {
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf',
    file: 'CormorantGaramond-VF.ttf',
  },
  cormorantItalic: {
    url: 'https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond-Italic%5Bwght%5D.ttf',
    file: 'CormorantGaramond-Italic-VF.ttf',
  },
}

/* 分档不是「首屏 / 其余」，是「首页用字 / 手记正文用字」——
   手记正文独占三百多个汉字，是字表的大头，而首页（引首、四件作品、自述、
   手记标题、落款）根本用不到它们。拆开之后首页只取主片，读手记时才多取 Ext。
   注意正文的定义是 md 的**主体**：YAML 头里的 title / tags / summary 会显示在
   首页与列表页上，得跟首页一起走，否则首页缺字会反过来把 Ext 也拽下来。 */
const POST_BODY_DIR = 'src/content/posts'

const TEXT_EXT = new Set(['.js', '.jsx', '.json', '.md', '.mdx', '.css'])

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(p, out)
    else if (TEXT_EXT.has(path.extname(entry.name).toLowerCase())) out.push(p)
  }
  return out
}

/** 代码注释里的中文字永远不会被渲染，别把它们算进字表 */
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/[^\n]*/g, '$1')
}

function countInto(counts, text) {
  for (const ch of stripComments(text)) {
    counts.set(ch, (counts.get(ch) || 0) + 1)
  }
  return counts
}

function charsFrom(files, extra = '') {
  const counts = new Map()
  for (const file of files) countInto(counts, fs.readFileSync(file, 'utf8'))
  return countInto(counts, extra)
}

/** 手记 md 顶部的 YAML 头（title / tags / summary）——列表页与首页都要显示这些字 */
function frontmatterOf(file) {
  const text = fs.readFileSync(file, 'utf8')
  if (!text.startsWith('---')) return ''
  const end = text.indexOf('\n---', 3)
  return end === -1 ? text : text.slice(0, end)
}

/** 只保留真正参与渲染的字符：丢掉控制符 */
function renderable(map) {
  const kept = new Map()
  for (const [ch, n] of map) {
    const cp = ch.codePointAt(0)
    if (cp < 0x20 || cp === 0x7f) continue
    kept.set(ch, n)
  }
  return kept
}

function toText(map) {
  return [...map.keys()].sort((a, b) => a.codePointAt(0) - b.codePointAt(0)).join('')
}

/** 压缩成 U+4E00,U+4E01-4E03 这种写法，别把 CSS 撑成几万行 */
function toUnicodeRange(text) {
  const points = [...new Set([...text].map((c) => c.codePointAt(0)))].sort((a, b) => a - b)
  if (!points.length) return ''
  const parts = []
  let start = points[0]
  let prev = points[0]
  for (let i = 1; i <= points.length; i++) {
    const cp = points[i]
    if (cp === prev + 1) {
      prev = cp
      continue
    }
    const a = start.toString(16).toUpperCase()
    const b = prev.toString(16).toUpperCase()
    parts.push(start === prev ? `U+${a}` : `U+${a}-${b}`)
    start = cp
    prev = cp
  }
  return parts.join(',')
}

async function ensureSource(name) {
  const { url, file } = SOURCES[name]
  const dest = path.join(CACHE, file)
  if (fs.existsSync(dest) && fs.statSync(dest).size > 100 * 1024) return dest
  fs.mkdirSync(CACHE, { recursive: true })
  process.stdout.write(`下载源字体 ${file}（约 20MB，慢网络下要十几分钟）… `)
  // 只下一次，之后一直用 .fontcache —— 别再给这 20MB 设短超时
  const res = await fetch(url, { signal: AbortSignal.timeout(45 * 60 * 1000) })
  if (!res.ok) throw new Error(`下载失败 ${res.status} ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  fs.writeFileSync(dest, buf)
  console.log(`${(buf.length / 1024 / 1024).toFixed(1)} MB`)
  return dest
}

/** 挑一个真装了 fonttools 的解释器：环境变量 > PATH 上的 python > 本机托管环境 */
function pythonBin() {
  const candidates = [
    process.env.FONTS_PYTHON,
    'python',
    'python3',
    'C:/Users/31697/.workbuddy/binaries/python/envs/fonts/Scripts/python.exe',
  ].filter(Boolean)
  for (const bin of candidates) {
    try {
      execFileSync(bin, ['-c', 'import fontTools, brotli'], { stdio: 'ignore' })
      return bin
    } catch {
      /* 换下一个 */
    }
  }
  throw new Error(
    '找不到装了 fonttools + brotli 的 python。装一个后重试：\n' +
      '  pip install fonttools brotli\n' +
      '或指定解释器：FONTS_PYTHON=/path/to/python npm run build:fonts'
  )
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

function fontBytes(name) {
  const p = path.join(OUT_FONTS, name)
  return fs.existsSync(p) ? fs.statSync(p).size : 0
}

async function main() {
  const files = walk(path.join(ROOT, 'src'))
  const all = renderable(charsFrom(files))
  // home：手记正文之外所有地方出现过的字 —— 首页要用的字全在这里面
  const postsPrefix = path.join(ROOT, POST_BODY_DIR).split(path.sep).join('/')
  const isPost = (f) => f.split(path.sep).join('/').startsWith(postsPrefix)
  // md 的 YAML 头不算正文：标题、摘要、标签要显示在首页与列表页上，跟着首页一起走，
  // 否则首页会缺字、反过来把正文那片也拽下来，分档就白做了
  const frontmatter = files.filter(isPost).map(frontmatterOf).join('\n')
  const homeSeed = renderable(charsFrom(files.filter((f) => !isPost(f)), frontmatter))
  // more：只在手记正文里出现的字
  const more = new Map()
  const home = new Map()
  for (const [ch, n] of all) {
    if (homeSeed.has(ch)) home.set(ch, n)
    else more.set(ch, n)
  }
  const homeText = toText(home)
  const moreText = toText(more)
  // 西文那一套：ASCII + 站内出现的通用符号，全给（拉丁字重小，不值得再分档）
  const latinText = toText(new Map([...all].filter(([ch]) => ch.codePointAt(0) < 0x2e80)))
  console.log(
    `字表：首页 ${home.size} 字 / 手记独有 ${more.size} 字 / 西文 ${[...latinText].length} 字`
  )

  const [noto, cormorant, cormorantItalic] = await Promise.all([
    ensureSource('noto'),
    ensureSource('cormorant'),
    ensureSource('cormorantItalic'),
  ])

  // 主片只装首页要用的字，手记独有的字单独一片。
  // 两片用两个 family 名、都不写 unicode-range，靠 font-family 的回退顺序取用：
  // 浏览器先在 'Noto Serif SC' 里找字，找不到才去 'Noto Serif SC Ext' 取 ——
  // 于是首页一个字都不缺，Ext 那片压根不会被请求。
  // （不用 unicode-range 分档，是因为逐字列举一千来字要近 5 KB，
  //   全塞进渲染阻塞的主 CSS 里，省下的字体字节还不够抵它。）
  const jobs = [
    // 不实例化：保留 wght 轴，一个文件顶掉 300/400/600/900 四个静态字重
    { source: noto, out: path.join(OUT_FONTS, 'noto-serif-sc.woff2'), text: homeText },
    { source: noto, out: path.join(OUT_FONTS, 'noto-serif-sc-ext.woff2'), text: moreText },
    { source: cormorant, out: path.join(OUT_FONTS, 'cormorant-garamond.woff2'), text: latinText },
    { source: cormorantItalic, out: path.join(OUT_FONTS, 'cormorant-garamond-italic.woff2'), text: latinText },
  ]

  // public/fonts 里只有本脚本的产物，先清干净 —— 换过分片方案时旧片会赖着不走，
  // 既占体积又让下面的统计数字失真
  fs.mkdirSync(OUT_FONTS, { recursive: true })
  for (const f of fs.readdirSync(OUT_FONTS)) {
    if (f.endsWith('.woff2')) fs.rmSync(path.join(OUT_FONTS, f))
  }
  const spec = path.join(CACHE, 'jobs.json')
  fs.writeFileSync(spec, JSON.stringify({ cacheDir: CACHE, jobs }), 'utf8')

  console.log('子集化：')
  execFileSync(pythonBin(), [path.join(ROOT, 'scripts', 'subset_fonts.py'), spec], {
    stdio: 'inherit',
  })

  // ── 生成 fonts.css ──
  // 可变字体一条 @font-face 就能覆盖一整个字重区间，写 font-weight:200 900。
  // 中文那片刻意不写 unicode-range：逐字列举一千来字要 5 KB，而这已经是全站字表，
  // 没有「只下一部分」的必要，留着只是让渲染阻塞的 CSS 白白变胖。
  const report = JSON.parse(fs.readFileSync(path.join(CACHE, 'axes-report.json'), 'utf8'))
  const rangeOf = (name) => {
    const r = report[path.join(OUT_FONTS, name)]
    if (!r) throw new Error(`拿不到 ${name} 的 wght 轴范围，子集化那步是不是没保留可变轴？`)
    return r.join(' ')
  }

  const css = ['/* 生成物，勿手改 —— 由 scripts/build-fonts.mjs 生成（npm run build:fonts） */']
  const face = (family, style, weight, file, range) =>
    `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};` +
    `font-display:swap;src:url(/fonts/${file}) format('woff2')` +
    (range ? `;unicode-range:${range}` : '') +
    '}'

  css.push(face('Noto Serif SC', 'normal', rangeOf('noto-serif-sc.woff2'), 'noto-serif-sc.woff2'))
  css.push(
    face('Noto Serif SC Ext', 'normal', rangeOf('noto-serif-sc-ext.woff2'), 'noto-serif-sc-ext.woff2')
  )
  const latinRange = toUnicodeRange(latinText)
  css.push(
    face(
      'Cormorant Garamond',
      'normal',
      rangeOf('cormorant-garamond.woff2'),
      'cormorant-garamond.woff2',
      latinRange
    )
  )
  css.push(
    face(
      'Cormorant Garamond',
      'italic',
      rangeOf('cormorant-garamond-italic.woff2'),
      'cormorant-garamond-italic.woff2',
      latinRange
    )
  )
  fs.writeFileSync(OUT_CSS, css.join('\n') + '\n', 'utf8')

  const allTotal = fs
    .readdirSync(OUT_FONTS)
    .filter((f) => f.endsWith('.woff2'))
    .reduce((s, f) => s + fontBytes(f), 0)
  console.log(`写好 ${path.relative(ROOT, OUT_CSS)}`)
  console.log(
    `首页要下 ${kb(fontBytes('noto-serif-sc.woff2') + fontBytes('cormorant-garamond.woff2') + fontBytes('cormorant-garamond-italic.woff2'))}` +
      `（中文主片 + 西文两片），手记独有的 ${kb(fontBytes('noto-serif-sc-ext.woff2'))} 要到打开手记才取；` +
      `全部合计 ${kb(allTotal)}`
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
