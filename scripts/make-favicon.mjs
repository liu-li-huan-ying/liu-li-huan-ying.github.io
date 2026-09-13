#!/usr/bin/env node
/* 生成 public/favicon.svg —— 白文（阴刻）篆书印。
   字号取自 src/lib/sealGlyphs.js 里那套《说文》小篆字形，
   与页面上的钤印是同一份数据，所以 favicon 和站内印章长得一样。
   改字形数据后重跑： node scripts/make-favicon.mjs
   用法： node scripts/make-favicon.mjs [字] [输出路径] */
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { SEAL_GLYPHS } from '../src/lib/sealGlyphs.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const ch = process.argv[2] || '璃'
const out = process.argv[3] || path.join(root, 'public/favicon.svg')

const glyph = SEAL_GLYPHS[ch]
if (!glyph) {
  console.error(`字形数据里没有「${ch}」。可用：${Object.keys(SEAL_GLYPHS).join(' ')}`)
  process.exit(1)
}

/* 印地朱砂、字口宣纸 —— 与站点令牌同一对颜色，缩到 16px 也分得开 */
const CINNABAR = '#A33A2A'
const PAPER = '#EDE8DD'

/* 白文要「满白」：细笔画在红地上压不住，得加粗 */
const strokes = glyph
  .map(([d, transform]) => `<path d="${d}"${transform ? ` transform="${transform}"` : ''}/>`)
  .join('')

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="64" height="64">
  <rect width="400" height="400" rx="26" fill="${CINNABAR}"/>
  <g fill="${PAPER}" stroke="${PAPER}" stroke-width="15" stroke-linejoin="round">${strokes}</g>
</svg>
`

writeFileSync(out, svg)
console.log(`written ${path.relative(root, out)} (${ch}, 白文)`)
