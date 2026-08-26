import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { buildRss } from './scripts/rss-builder.mjs'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const postsDir = path.resolve(rootDir, 'src/content/posts')
const SITE_URL = 'https://liu-li-huan-ying.github.io'

function collectPosts() {
  return readdirSync(postsDir)
    .filter((f) => f.endsWith('.md') && !f.endsWith('.en.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '')
      const src = readFileSync(path.join(postsDir, file), 'utf8')
      const fmMatch = src.match(/^---\r?\n([\s\S]*?)\r?\n---/)
      const meta = {}
      if (fmMatch) {
        for (const line of fmMatch[1].split(/\r?\n/)) {
          const idx = line.indexOf(':')
          if (idx === -1) continue
          meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
        }
      }
      return {
        slug,
        title: meta.title ?? slug,
        date: String(meta.date ?? '').slice(0, 10),
        summary: meta.summary ?? '',
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date))
}

function rssPlugin() {
  return {
    name: 'rss-generator',
    apply: 'build',
    closeBundle() {
      try {
        const xml = buildRss(collectPosts(), SITE_URL, {
          title: '琉璃幻影 · Glazed Mirage',
          description:
            'Full stack developer blog — Go, React, distributed systems and storage engines.',
          language: 'zh-CN',
        })
        writeFileSync(path.resolve(rootDir, 'dist/rss.xml'), xml)
        console.log('  dist/rss.xml generated')
      } catch (err) {
        console.warn('rss generation skipped:', err.message)
      }
    },
  }
}

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [react(), tailwindcss(), rssPlugin()],
})
