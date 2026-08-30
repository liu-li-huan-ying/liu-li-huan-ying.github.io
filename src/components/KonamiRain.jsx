import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>[]{}=+*'

function MatrixCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const FONT = 16

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()

    let columns = Math.floor(canvas.width / FONT)
    let drops = Array.from({ length: columns }, () => Math.random() * (canvas.height / FONT))

    let raf = 0
    let last = 0

    const draw = (ts) => {
      raf = requestAnimationFrame(draw)
      if (ts - last < 40) return
      last = ts

      ctx.fillStyle = 'rgba(4, 1, 15, 0.12)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${FONT}px monospace`

      drops.forEach((y, i) => {
        const char = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        ctx.fillStyle = Math.random() < 0.06 ? '#e879f9' : '#34d399'
        ctx.fillText(char, i * FONT, y * FONT)

        if (y * FONT > canvas.height && Math.random() > 0.975) drops[i] = 0
        else drops[i] = y + 1
      })
    }

    raf = requestAnimationFrame(draw)
    window.addEventListener('resize', resize)
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        return
      }
      raf = requestAnimationFrame(draw)
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80]" />
}

const SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

export default function KonamiRain() {
  const [mode, setMode] = useState(null)
  const bufferRef = useRef([])

  useEffect(() => {
    const toggle = () => setMode((m) => (m === 'on' ? 'off' : 'on'))
    window.addEventListener('portfolio:matrix', toggle)

    const onKeyDown = (e) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey) return
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      const buf = [...bufferRef.current, key].slice(-SEQUENCE.length)
      bufferRef.current = buf
      if (buf.length === SEQUENCE.length && SEQUENCE.every((k, i) => k === buf[i])) {
        bufferRef.current = []
        toggle()
      }
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('portfolio:matrix', toggle)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    if (mode !== 'on') return undefined
    const stop = setTimeout(() => setMode('off'), 9000)
    return () => clearTimeout(stop)
  }, [mode])

  useEffect(() => {
    if (mode !== 'on') return undefined
    const clear = setTimeout(() => setMode(null), 2400)
    return () => clearTimeout(clear)
  }, [mode])

  return (
    <>
      {mode === 'on' && <MatrixCanvas />}
      <AnimatePresence>
        {mode && (
          <motion.p
            key={mode}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass fixed left-1/2 top-24 z-[85] -translate-x-1/2 rounded-full px-6 py-2.5 font-mono text-xs tracking-[0.35em] text-emerald-300"
          >
            {mode === 'on' ? 'HACKER MODE ACTIVATED' : 'HACKER MODE DEACTIVATED'}
          </motion.p>
        )}
      </AnimatePresence>
    </>
  )
}
