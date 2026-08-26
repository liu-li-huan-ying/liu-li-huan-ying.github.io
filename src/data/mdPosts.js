const rawFiles = import.meta.glob('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
})

function parseFrontmatter(src) {
  const match = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { meta: {}, body: src }

  const meta = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':')
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (key === 'tags') {
      value = value.split(/[,，]/).map((s) => s.trim()).filter(Boolean)
    }
    meta[key] = value
  }
  return { meta, body: match[2] }
}

function estimateReadTime(markdown) {
  const textLength = markdown.replace(/[#>*`\-[\]()]/g, '').length
  return Math.max(1, Math.round(textLength / 400))
}

function basename(filePath) {
  return filePath.split('/').pop().replace(/\.md$/, '')
}

const bySlug = {}

for (const [filePath, source] of Object.entries(rawFiles)) {
  const base = basename(filePath)
  const lang = base.endsWith('.en') ? 'en' : 'zh'
  const slug = lang === 'en' ? base.slice(0, -3) : base

  const { meta, body } = parseFrontmatter(source)

  const entry = {
    slug,
    lang,
    date: String(meta.date ?? '').slice(0, 10),
    title: meta.title ?? slug,
    summary: meta.summary ?? '',
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    readTime: Number(meta.readTime) || estimateReadTime(body),
    markdown: body,
  }

  bySlug[slug] = bySlug[slug] || {}
  bySlug[slug][lang] = entry
}

export const groupedPosts = Object.values(bySlug).sort((a, b) => {
  const dateA = a.zh?.date ?? a.en?.date ?? ''
  const dateB = b.zh?.date ?? b.en?.date ?? ''
  return dateB.localeCompare(dateA)
})

export function postsFor(lang) {
  return groupedPosts
    .map((group) => {
      const entry = group[lang] ?? group.zh ?? group.en
      if (!entry) return null
      const isFallback = !group[lang]
      return { ...entry, originalLang: isFallback ? entry.lang : null }
    })
    .filter(Boolean)
}

export async function renderMarkdown(markdown) {
  const { marked } = await import('marked')
  marked.setOptions({ gfm: true, breaks: true })
  return marked.parse(markdown)
}
