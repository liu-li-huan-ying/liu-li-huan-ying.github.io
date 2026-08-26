import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? Math.min(el.scrollTop / max, 1) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px]">
      <div
        className="h-full origin-left bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink shadow-[0_0_12px_rgba(129,140,248,0.7)]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  )
}
