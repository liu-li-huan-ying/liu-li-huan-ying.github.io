import { describe, expect, it } from 'vitest'
import { parseFrontmatter } from '../src/utils/frontmatter'

describe('parseFrontmatter', () => {
  it('extracts scalar fields and body', () => {
    const src = `---
title: Hello World
date: 2026-08-26
summary: A tiny post.
---

Body starts here.
`
    const { meta, body } = parseFrontmatter(src)
    expect(meta.title).toBe('Hello World')
    expect(meta.date).toBe('2026-08-26')
    expect(meta.summary).toBe('A tiny post.')
    expect(body.trim()).toBe('Body starts here.')
  })

  it('splits tags on both ascii and fullwidth commas', () => {
    const src = `---
tags: Go, 存储，性能
---

body
`
    expect(parseFrontmatter(src).meta.tags).toEqual(['Go', '存储', '性能'])
  })

  it('returns empty meta when frontmatter is missing', () => {
    const src = 'just a body, no fence'
    const { meta, body } = parseFrontmatter(src)
    expect(meta).toEqual({})
    expect(body).toBe(src)
  })

  it('preserves multi-line bodies intact', () => {
    const src = `---
title: t
---

line one

## heading

line two
`
    const { body } = parseFrontmatter(src)
    expect(body).toContain('line one')
    expect(body).toContain('## heading')
    expect(body).toContain('line two')
  })
})
