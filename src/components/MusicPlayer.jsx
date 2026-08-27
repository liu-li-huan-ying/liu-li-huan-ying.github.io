import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY = 'pf-music'
const SRC = '/music/music.mp3'

function loadMuted() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'muted'
  } catch {
    return false
  }
}

function saveMuted(v) {
  try {
    localStorage.setItem(STORAGE_KEY, v ? 'muted' : 'playing')
  } catch {
    // silent
  }
}

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const [muted, setMuted] = useState(loadMuted)
  const [volume, setVolume] = useState(() => {
    try {
      return Number(localStorage.getItem('pf-music-vol')) || 0.35
    } catch {
      return 0.35
    }
  })
  const [showVol, setShowVol] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = new Audio()
    el.src = SRC
    el.loop = true
    el.preload = 'auto'
    el.volume = volume
    audioRef.current = el

    const onReady = () => setReady(true)
    el.addEventListener('canplaythrough', onReady, { once: true })

    return () => {
      el.pause()
      el.src = ''
      audioRef.current = null
    }
    // volume intentionally excluded — el is created once; volume is synced separately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const play = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    el.play().catch(() => {})
  }, [])

  useEffect(() => {
    if (ready && !muted) {
      const handler = () => {
        play()
        window.removeEventListener('pointerdown', handler)
        window.removeEventListener('keydown', handler)
      }
      window.addEventListener('pointerdown', handler, { once: true })
      window.addEventListener('keydown', handler, { once: true })
      return () => {
        window.removeEventListener('pointerdown', handler)
        window.removeEventListener('keydown', handler)
      }
    }
    if (muted) audioRef.current?.pause()
  }, [ready, muted, play])

  useEffect(() => {
    const el = audioRef.current
    if (el) el.volume = volume
    try {
      localStorage.setItem('pf-music-vol', String(volume))
    } catch {
      // silent
    }
  }, [volume])

  const toggle = () => {
    const next = !muted
    setMuted(next)
    saveMuted(next)
  }

  return (
    <div
      className="fixed bottom-6 left-6 z-50 lg:bottom-16 lg:left-auto lg:right-auto"
      onMouseEnter={() => setShowVol(true)}
      onMouseLeave={() => setShowVol(false)}
    >
      <AnimatePresence>
        {showVol && ready && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="glass absolute bottom-full left-0 mb-3 flex items-center gap-3 rounded-xl px-4 py-2.5"
          >
            <span className="font-mono text-[10px] text-slate-500">VOL</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/10 accent-neon-cyan
                [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-cyan
                [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              aria-label="Volume"
            />
            <span className="font-mono text-[10px] text-slate-500">{Math.round(volume * 100)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={toggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        data-cursor-label={muted ? 'UNMUTE' : 'MUTE'}
        className={`glass flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-shadow ${
          muted
            ? 'text-slate-500 shadow-none'
            : 'text-neon-cyan shadow-neon-violet/20 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)]'
        }`}
        aria-label={muted ? 'Unmute background music' : 'Mute background music'}
      >
        {muted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 010 14.14" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
          </svg>
        )}
      </motion.button>
    </div>
  )
}
