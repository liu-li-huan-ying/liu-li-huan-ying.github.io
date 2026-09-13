import { writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

/* 建一篇新手记。
   用法： npm run newpost -- my-new-post "文章标题"
   文件名 = YYYY-MM-DD-<slug>.md，日期写在最前，按文件名排就能看出新旧。
   正文与 frontmatter 的约定见 README。 */

const contentDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/content/posts'
)

const slug = process.argv[2]

if (!slug) {
  console.error('用法: npm run newpost -- <slug> ["标题"]')
  console.error('  slug: 字母、数字、连字符或汉字。')
  console.error('  例:   npm run newpost -- mmap-notes "内存映射笔记"')
  process.exit(1)
}

const title = process.argv[3] || slug
const today = new Date()
const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
  today.getDate()
).padStart(2, '0')}`

const file = path.join(contentDir, `${date}-${slug}.md`)

if (existsSync(file)) {
  console.error(`已存在: ${date}-${slug}.md`)
  process.exit(1)
}

const template = `---
title: ${title}
date: ${date}
tags: 标签一, 标签二
summary: TODO 一句话摘要。
---

TODO 开篇段落——写什么、为什么值得读。

## TODO 小节标题

TODO 正文。支持 **加粗**、*斜体*、列表和代码块：

\`\`\`go
fmt.Println("hello")
\`\`\`

> TODO 收尾的话。
`

writeFileSync(file, template)
console.log(`created: src/content/posts/${date}-${slug}.md`)
console.log('写完 push 即上线（列表页与 RSS 都在构建期生成）。')
