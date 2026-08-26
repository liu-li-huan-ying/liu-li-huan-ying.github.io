import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const LOG = [
  { p: 2, t: '$ ./boot --portfolio', c: 'text-slate-300' },
  { p: 20, t: '[ ok ] loading modules ..........', c: 'text-slate-500' },
  { p: 40, t: '[ ok ] compiling shaders ........', c: 'text-slate-500' },
  { p: 60, t: '[ ok ] warming up gpu ...........', c: 'text-slate-500' },
  { p: 80, t: '[ ok ] connecting github ........', c: 'text-slate-500' },
  { p: 97, t: 'ready. launching experience.', c: 'text-emerald-300' },
]

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const start = performance.now()
    let raf

    const step = (now) => {
      const t = Math.min((now - start) / 1700, 1)
      const eased = 1 - Math.pow(1 - t, 2)
      setProgress(Math.floor(eased * 100))
      if (t < 1) {
        raf = requestAnimationFrame(step)
      } else if (!done.current) {
        done.current = true
        setTimeout(onComplete, 200)
      }
    }

    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
    }
  }, [onComplete])

  return (
    <motion.div
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-night"
    >
      <div className="glass w-[min(92vw,540px)] rounded-2xl p-8">
        <div className="flex items-center gap-1.5 border-b border-white/10 pb-4">
          <span className="h-3 w-3 rounded-full bg-red-400/90" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
          <span className="ml-3 font-mono text-xs text-slate-500">system — boot</span>
          <span className="ml-auto font-mono text-sm text-neon-cyan">{progress}%</span>
        </div>

        <div className="mt-5 h-36 font-mono text-sm leading-6">
          {LOG.filter((line) => progress >= line.p).map((line) => (
            <p key={line.t} className={line.c}>
              {line.t}
            </p>
          ))}
          <span className="inline-block h-4 w-2 animate-blink bg-neon-cyan align-middle" />
        </div>

        <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
