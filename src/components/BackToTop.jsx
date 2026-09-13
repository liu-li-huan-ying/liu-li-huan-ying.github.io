import { useEffect, useState } from 'react'
import { ArrowUpIcon } from './Icons'

/* 回到顶部
   滚过一屏半才现身，平时不占页面右下角。
   手卷在右中有书耳，这里靠下，两者不打架（窄屏由 CSS 让位）。 */
const SHOW_AFTER = 1.4

export default function BackToTop() {
  const [on, setOn] = useState(false)

  useEffect(() => {
    const check = () => setOn((window.pageYOffset || 0) > window.innerHeight * SHOW_AFTER)
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check, { passive: true })
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  return (
    <button
      type="button"
      className={on ? 'totop on' : 'totop'}
      aria-label="回到顶部"
      onClick={() => window.scrollTo({ top: 0 })}
    >
      <ArrowUpIcon />
    </button>
  )
}
