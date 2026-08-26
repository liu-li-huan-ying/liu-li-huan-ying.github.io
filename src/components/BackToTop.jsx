import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpIcon } from './Icons'

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const max = el.scrollHeight - el.clientHeight
      setProgress(max > 0 ? Math.min(el.scrollTop / max, 1) : 0)
      setVisible(window.scrollY > 600)
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
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={`Back to top — ${Math.round(progress * 100)}% read`}
          data-cursor-label="TOP"
          className="glass fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full text-neon-cyan shadow-lg shadow-neon-violet/20 transition-shadow hover:shadow-[0_0_24px_rgba(34,211,238,0.4)] lg:bottom-16 lg:left-6 lg:right-auto"
        >
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
            <defs>
              <linearGradient id="ring-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#22d3ee" />
                <stop offset="0.5" stopColor="#818cf8" />
                <stop offset="1" stopColor="#e879f9" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            <circle
              cx="24"
              cy="24"
              r={RADIUS}
              fill="none"
              stroke="url(#ring-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 0.1s linear' }}
            />
          </svg>
          <ArrowUpIcon className="relative h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
