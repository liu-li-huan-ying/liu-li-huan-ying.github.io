import { useEffect, useState } from 'react'

/* 全站就一条 hash 约定，别在别处再解析一次：
   #/projects、#/blog、#/projects/:id、#/blog/:slug、#/about 是站级页面（路由）；
   #work、#material 这种只是首页某卷的页内锚点，parse 出来的仍是 '/'。
   所以写链接时看清前缀带不带斜杠 —— 带了才是换页。
   另有一条例外见下面 onChange：锚点若指向本页已有的元件，路由一律不动。 */
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
    const onChange = () => {
      /* 不以 #/ 开头的是篇内锚点（首页的 #work，或手记正文的 #sec-3）。
         若该元件此刻就在 DOM 里，说明是本页内部的跳转，路由不该动 ——
         否则手记正文的篇内目次一点就把人踢回卷首。首页自身的卷锚点
         （#work 这类）在本页也命中，路由本来也就是 '/'，绕过去无碍。 */
      const raw = window.location.hash
      if (raw && !raw.startsWith('#/')) {
        const frag = raw.slice(1)
        if (frag && document.getElementById(frag)) return
      }
      setRoute(parse())
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}
