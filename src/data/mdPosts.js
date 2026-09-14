import DOMPurify from 'dompurify'
import { parseFrontmatter } from '../utils/frontmatter'

/* 手记（博客）正文源：src/content/posts/*.md，构建期整包读入。
   文件名去掉 .md 就是 slug（`2026-08-15-lsm-tree` → 日期在前，便于排序看）。
   加一篇：在 content/posts 里放一个 .md，frontmatter 写 date / title / summary / tags。 */
const rawFiles = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

/* 中文按 400 字/分钟估读时；frontmatter 里写了 readTime 就用写的 */
function estimateReadTime(markdown) {
  const textLength = markdown.replace(/[#>*`\-[\]()]/g, '').length
  return Math.max(1, Math.round(textLength / 400))
}

export const posts = Object.entries(rawFiles)
  .map(([filePath, source]) => {
    const slug = filePath.split('/').pop().replace(/\.md$/, '')
    const { meta, body } = parseFrontmatter(source)
    return {
      slug,
      date: String(meta.date ?? '').slice(0, 10),
      title: meta.title ?? slug,
      summary: meta.summary ?? '',
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      readTime: Number(meta.readTime) || estimateReadTime(body),
      markdown: body,
    }
  })
  .sort((a, b) => b.date.localeCompare(a.date))

export async function renderMarkdown(markdown) {
  const { marked } = await import('marked')
  marked.setOptions({ gfm: true, breaks: true })
  const clean = DOMPurify.sanitize(marked.parse(markdown), { ADD_TAGS: ['iframe'] })

  /* 篇内目次要有锚点，id 就必须**跟着正文一起落进这段 HTML**。
     不能事后用副作用往 DOM 上补 —— 实测补完 id 后 2ms 内 React 又把同一段
     innerHTML 写了一遍（StrictMode 下 renderMarkdown 会被跑两次），补上的 id
     全被冲掉：目次的 href 还在、getElementById 却是 null，点了毫无反应。
     在这里就地编号，字符串里带着 id 出去，之后写多少遍都在。 */
  const tpl = document.createElement('template')
  tpl.innerHTML = clean
  tpl.content.querySelectorAll('h2, h3').forEach((h, i) => {
    h.id = `sec-${i}`
  })
  return tpl.innerHTML
}
