import { writeFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const contentDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../src/content/posts'
)

const slug = process.argv[2]
const noTranslate = process.argv.includes('--no-translate')

if (!slug) {
  console.error('Usage: npm run newpost -- <slug> ["Title"] [--no-translate]')
  console.error('  slug: letters, numbers, dashes, or Chinese characters.')
  console.error('  e.g. npm run newpost -- my-new-post "My New Post"')
  console.error('  e.g. npm run newpost -- 读书笔记 "Reading Notes"')
  process.exit(1)
}

const title = process.argv[3] || slug
const today = new Date()
const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
  today.getDate()
).padStart(2, '0')}`

const zhFile = path.join(contentDir, `${date}-${slug}.md`)
const enFile = path.join(contentDir, `${date}-${slug}.en.md`)

if (existsSync(zhFile)) {
  console.error(`Error: ${date}-${slug}.md already exists.`)
  process.exit(1)
}

const zhTemplate = `---
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
console.log(`created: src/content/posts/${date}-${slug}.md       (中文，主版本)`)

if (!noTranslate) {
  writeFileSync(enFile, enTemplate)
  console.log(`created: src/content/posts/${date}-${slug}.en.md    (英文占位)`)

  console.log('\ntranslating to English...')
  try {
    execSync(`node scripts/translate-post.mjs "${date}-${slug}.md"`, {
      stdio: 'inherit',
      cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
    })
    console.log('translation complete!')
  } catch (err) {
    console.warn(`\nwarning: auto-translation failed (${err.message}).`)
    console.warn(`  run manually: npm run translate -- ${date}-${slug}.md`)
    console.warn(`  or edit ${date}-${slug}.en.md directly.`)
  }
} else {
  console.log(`created: src/content/posts/${date}-${slug}.en.md    (英文，跳过翻译)`)
}

console.log('\nnext: fill frontmatter + body in the zh file, then push.')
