export function parseFrontmatter(src) {
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
