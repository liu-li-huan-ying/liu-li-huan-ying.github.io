import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const contentDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/content/posts'
)

const slug = process.argv[2]
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error('Usage: npm run newpost -- <slug> ["Title"]')
  console.error('  slug: lowercase letters, numbers and dashes. e.g. my-new-post')
  process.exit(1)
}

const title = process.argv[3] || slug
const today = new Date()
const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
  today.getDate()
).padStart(2, '0')}`

const zhFile = path.join(contentDir, `${date}-${slug}.md`)
const enFile = path.join(contentDir, `${date}-${slug}.en.md`)

const zhTemplate = `---
title: TODO 标题
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

> TODO 收尾金句。
`

const enTemplate = `---
title: ${title}
date: ${date}
tags: tag-one, tag-two
summary: TODO one-sentence summary.
readTime: 5
---

TODO opening paragraph — what is this about and why should anyone care.

## TODO section heading

TODO body. Markdown fully supported.

> TODO a closing thought.
`

writeFileSync(zhFile, zhTemplate)
writeFileSync(enFile, enTemplate)

console.log(`created: src/content/posts/${date}-${slug}.md       (中文，主版本)`)
console.log(`created: src/content/posts/${date}-${slug}.en.md    (英文，可选)`)
console.log('next: fill frontmatter + body in either file (or both), then push.')
