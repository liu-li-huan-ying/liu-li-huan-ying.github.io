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
  return DOMPurify.sanitize(marked.parse(markdown), { ADD_TAGS: ['iframe'] })
}
