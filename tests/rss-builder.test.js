import { describe, expect, it } from 'vitest'
import { buildRss, escapeXml } from '../scripts/rss-builder.mjs'

const channel = {
  title: '琉璃幻影 · Glazed Mirage',
  description: 'Full stack developer blog.',
  language: 'zh-CN',
}

const items = [
  { slug: 'post-a', title: 'A & B <comparison>', date: '2026-01-01', summary: 'first' },
  { slug: 'post-b', title: 'Second', date: '2026-02-15', summary: 'second' },
]

describe('escapeXml', () => {
  it('escapes xml special characters', () => {
    expect(escapeXml('a & b < c > d "e" \'f\'')).toBe(
      'a &amp; b &lt; c &gt; d &quot;e&quot; &apos;f&apos;'
    )
  })
})

describe('buildRss', () => {
  const xml = buildRss(items, 'https://example.com', channel)

  it('emits an rss 2.0 document with channel meta', () => {
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain('<title>琉璃幻影 · Glazed Mirage</title>')
    expect(xml).toContain('<language>zh-CN</language>')
    expect(xml).toContain('https://example.com/rss.xml')
  })

  it('renders one item per post with hash-route links and escaped text', () => {
    expect(xml.match(/<item>/g)?.length).toBe(2)
    expect(xml).toContain('https://example.com/#/blog/post-a')
    expect(xml).toContain('A &amp; B &lt;comparison&gt;')
    expect(xml).not.toContain('<comparison>')
  })

  it('converts dates to RFC-822 pubDate', () => {
    expect(xml).toContain('Thu, 01 Jan 2026')
  })
})
