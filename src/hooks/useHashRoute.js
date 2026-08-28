import { useEffect, useState } from 'react'

function parse() {
  const raw = window.location.hash
  if (!raw.startsWith('#/')) return '/'
  try {
    return decodeURIComponent(raw.slice(1)) || '/'
  } catch {
    return raw.slice(1) || '/'
  }
}

export function useHashRoute() {
  const [route, setRoute] = useState(parse)

  useEffect(() => {
    const onChange = () => setRoute(parse())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

export function navigate(path) {
  const target = `#${path}`
  if (window.location.hash === target) return
  window.history.pushState(null, '', target)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

export function goSection(id) {
  if (!window.location.hash.startsWith('#/')) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    window.history.replaceState(null, '', `#${id}`)
    return
  }
  navigate('/')
  setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, 80)
}
