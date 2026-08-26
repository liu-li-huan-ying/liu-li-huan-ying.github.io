const KEY = 'gm'

export function reveal(encoded) {
  try {
    const raw = atob(encoded)
    let out = ''
    for (let i = 0; i < raw.length; i += 1) {
      out += String.fromCharCode(raw.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length))
    }
    return out
  } catch (err) {
    void err
    return ''
  }
}
