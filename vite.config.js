import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const postsDir = path.resolve(rootDir, 'src/content/posts')
const SITE_URL = 'https://liu-li-huan-ying.github.io'

function escapeXml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function parseFrontmatter(src) {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: '' }
  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
  }
  return { meta, body: match[2] }
}

function generateRss() {
  const items = readdirSync(postsDir)
    .filter((f) => f.endsWith('.md') && !f.endsWith('.en.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '')
      const { meta } = parseFrontmatter(readFileSync(path.join(postsDir, file), 'utf8'))
      return {
        slug,
        title: meta.title ?? slug,
        date: String(meta.date ?? '').slice(0, 10),
        summary: meta.summary ?? '',
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  const rssItems = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${SITE_URL}/#/blog/${item.slug}</link>
      <guid isPermaLink="false">${item.slug}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${escapeXml(item.summary)}</description>
    </item>`
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>琉璃幻影 · Glazed Mirage</title>
    <link>${SITE_URL}</link>
    <description>Full stack developer blog — Go, React, distributed systems and storage engines.</description>
    <language>zh-CN</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${rssItems}
  </channel>
</rss>
`
}

function rssPlugin() {
  return {
    name: 'rss-generator',
    apply: 'build',
    closeBundle() {
      try {
        writeFileSync(path.resolve(rootDir, 'dist/rss.xml'), generateRss())
        console.log('  dist/rss.xml generated')
      } catch (err) {
        console.warn('rss generation skipped:', err.message)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), rssPlugin()],
})
