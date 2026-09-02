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
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-surface)]"
    >
      <div className="flex w-48 flex-col items-center gap-4">
        <p className="font-display text-xl text-[var(--color-text-primary)]">琉璃幻影</p>
        <div className="h-px w-full overflow-hidden bg-[var(--color-border)]">
          <div
            className="h-full bg-[var(--color-accent)] transition-[width] duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </motion.div>
  )
}
