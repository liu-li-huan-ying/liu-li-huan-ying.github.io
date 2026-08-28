import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const postsDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/content/posts'
)

function findTargetFile(arg, force) {
  if (!arg) {
    let candidates = readdirSync(postsDir)
      .filter((f) => f.endsWith('.md') && !f.endsWith('.en.md'))
    if (!force) {
      candidates = candidates.filter((f) => !existsSync(path.join(postsDir, f.replace(/\.md$/, '.en.md'))))
    }
    candidates.sort()
    return candidates.length ? candidates[candidates.length - 1] : null
  }
  if (existsSync(path.join(postsDir, arg))) return arg
  if (existsSync(path.join(postsDir, `${arg}.md`))) return `${arg}.md`
  const fuzzy = readdirSync(postsDir).find(
    (f) => f.endsWith('.md') && !f.endsWith('.en.md') && f.includes(arg)
  )
  return fuzzy ?? null
}

function splitChunks(text, max = 450) {
  if (text.length <= max) return [text]
  const parts = []
  let buffer = ''
  for (const segment of text.split(/(?<=[。！？；!?;.;])/)) {
    if ((buffer + segment).length > max && buffer) {
      parts.push(buffer)
      buffer = segment
    } else {
      buffer += segment
    }
  }
  if (buffer) parts.push(buffer)
  return parts
}

async function translateViaMyMemory(text) {
  const translatedParts = []
  for (const chunk of splitChunks(text)) {
    const url =
      'https://api.mymemory.translated.net/get?langpair=zh-CN|en-GB&de=luchang0829@163.com&q=' +
      encodeURIComponent(chunk)
    let res
    try {
      res = await fetch(url, { signal: AbortSignal.timeout(20000) })
    } catch (err) {
      throw new Error(`network error: ${err.message}`)
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = await res.json()
    const translated = json?.responseData?.translatedText ?? ''
    if (!translated || translated.includes('MYMEMORY WARNING')) {
      throw new Error('quota exceeded or invalid response')
    }
    translatedParts.push(translated)
  }
  return translatedParts.join(' ')
}

async function translateViaGoogleFetch(text) {
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh&tl=en&dt=t&q=' +
    encodeURIComponent(text)
  let res
  try {
    res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(20000),
    })
  } catch (err) {
    throw new Error(`network error: ${err.message}`)
  }
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const payload = await res.text()
  const json = JSON.parse(payload)
  const joined = (json?.[0] ?? []).map((seg) => seg?.[0] ?? '').join('')
  if (!joined.trim()) throw new Error('empty translation')
  return joined
}

function translateViaCurl(url, proxy) {
  const proxyFlag = proxy ? `-x ${proxy} ` : ''
  const raw = execSync(`curl -s --max-time 25 ${proxyFlag}"${url}"`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  })
  if (!raw.trim()) throw new Error('empty response')
  return raw
}

function detectProxy() {
  const fromEnv = process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY
  if (fromEnv) return fromEnv
  const candidates = ['http://127.0.0.1:7897', 'http://127.0.0.1:7890', 'http://127.0.0.1:10809']
  for (const candidate of candidates) {
    try {
      execSync(`curl -s --max-time 4 -x ${candidate} "https://www.gstatic.com/generate_204" -o NUL`, {
        stdio: 'ignore',
      })
      console.log(`  using local proxy: ${candidate}`)
      return candidate
    } catch {
      // probe next
    }
  }
  return null
}

let cachedProxy

async function translateViaGoogleCurl(text) {
  cachedProxy ??= detectProxy()
  const url =
    'https://translate.googleapis.com/translate_a/single?client=gtx&sl=zh&tl=en&dt=t&q=' +
    encodeURIComponent(text)
  let payload = null
  if (cachedProxy) {
    try {
      payload = translateViaCurl(url, cachedProxy)
    } catch {
      payload = null
    }
  }
  if (!payload) payload = translateViaCurl(url, null)
  const json = JSON.parse(payload)
  const joined = (json?.[0] ?? []).map((seg) => seg?.[0] ?? '').join('')
  if (!joined.trim()) throw new Error('empty translation')
  return joined
}

async function translateText(text) {
  const trimmed = text.trim()
  if (!trimmed) return text

  const errors = []

  try {
    return await translateViaMyMemory(trimmed)
  } catch (err) {
    errors.push(`MyMemory: ${err.message}`)
  }

  try {
    return await translateViaGoogleFetch(trimmed)
  } catch (err) {
    errors.push(`Google(fetch): ${err.message}`)
    try {
      return await translateViaGoogleCurl(trimmed)
    } catch (err2) {
      errors.push(`Google(curl): ${err2.message}`)
    }
  }

  console.warn(`  ! all translation routes failed for: "${trimmed.slice(0, 40)}..."`)
  errors.forEach((e) => console.warn(`    - ${e}`))
  return trimmed
}

const sourceArg = process.argv[2]
const force = process.argv.includes('--force')
const target = findTargetFile(sourceArg, force)

if (!target) {
  console.error(
    sourceArg
      ? `no matching zh post found for "${sourceArg}"`
      : 'every zh post already has an .en.md version. Nothing to do.\n  tip: use --force to re-translate existing .en.md files.'
  )
  process.exit(1)
}

const enName = target.replace(/\.md$/, '.en.md')
if (!force && existsSync(path.join(postsDir, enName))) {
  console.error(`${enName} already exists. Use --force to overwrite.`)
  process.exit(1)
}

console.log(`translating: ${target}`)
const source = readFileSync(path.join(postsDir, target), 'utf8').replace(/^\uFEFF/, '')

const fmMatch = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
if (!fmMatch) {
  console.error('no frontmatter found, aborting')
  process.exit(1)
}

const metaLines = fmMatch[1].split(/\r?\n/)
const meta = {}
for (const line of metaLines) {
  const idx = line.indexOf(':')
  if (idx !== -1) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
}

const outMeta = []
for (const line of metaLines) {
  const idx = line.indexOf(':')
  if (idx === -1) {
    outMeta.push(line)
    continue
  }
  const key = line.slice(0, idx).trim()
  const value = line.slice(idx + 1).trim()
  if (key === 'readTime') continue
  if (key === 'tags') {
    const tags = value.split(/[,，]/).map((t) => t.trim()).filter(Boolean)
    const translated = []
    for (const tag of tags) translated.push(await translateText(tag))
    outMeta.push(`tags: ${translated.join(', ')}`)
    continue
  }
  if (key === 'title' || key === 'summary') {
    outMeta.push(`${key}: ${await translateText(value)}`)
    continue
  }
  outMeta.push(line)
}

const bodyLines = fmMatch[2].split(/\r?\n/)
const outBody = []
let inCode = false
let translatedLines = 0
let translatedChars = 0

for (const line of bodyLines) {
  if (/^\s*```/.test(line)) {
    inCode = !inCode
    outBody.push(line)
    continue
  }
  if (inCode) {
    outBody.push(line)
    continue
  }
  if (!line.trim()) {
    outBody.push('')
    continue
  }

  const heading = line.match(/^(\s*#{1,6}\s+)(.*)$/)
  if (heading) {
    const result = heading[1] + (await translateText(heading[2]))
    outBody.push(result)
    translatedLines++
    translatedChars += heading[2].length
    continue
  }

  const listItem = line.match(/^(\s*(?:>|[-*+]|\d+\.)\s+)(.*)$/)
  if (listItem) {
    const result = listItem[1] + (await translateText(listItem[2]))
    outBody.push(result)
    translatedLines++
    translatedChars += listItem[2].length
    continue
  }

  outBody.push(await translateText(line))
  translatedLines++
  translatedChars += line.length
}

const enContent = `---\n${outMeta.join('\n')}\n---\n\n${outBody.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`

writeFileSync(path.join(postsDir, enName), enContent)

console.log(`created: src/content/posts/${enName}`)
console.log(`summary: ${translatedLines} lines, ~${translatedChars} chars translated`)
console.log('note: machine translation draft — code blocks untouched, please proof-read.')
