import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const start = performance.now()
    let raf

    const step = (now) => {
      const t = Math.min((now - start) / 1400, 1)
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
      exit={{ opacity: 0, filter: 'blur(6px)' }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-night"
    >
      <div className="flex w-48 flex-col items-center gap-4">
        <p className="font-mono text-sm tracking-widest text-slate-400">Glazed Mirage</p>
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
