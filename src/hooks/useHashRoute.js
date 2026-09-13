import { useEffect, useState } from 'react'

/* 全站就一条 hash 约定，别在别处再解析一次：
   #/projects、#/blog、#/projects/:id、#/blog/:slug、#/about 是站级页面（路由）；
   #work、#material 这种只是首页某卷的页内锚点，parse 出来的仍是 '/'。
   所以写链接时看清前缀带不带斜杠 —— 带了才是换页。 */
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
