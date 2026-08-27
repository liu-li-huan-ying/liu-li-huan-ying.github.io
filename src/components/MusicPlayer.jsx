import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'pf-music'
const POS_KEY = 'pf-music-pos'
const SRC = '/music/music.mp3'
const RADIUS = 20
const CIRC = 2 * Math.PI * RADIUS

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

function loadPos() {
  try {
    const raw = localStorage.getItem(POS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function savePos(pos) {
  try {
    localStorage.setItem(POS_KEY, JSON.stringify(pos))
  } catch {
    // silent
  }
}

export default function MusicPlayer() {
  const audioRef = useRef(null)
  const btnRef = useRef(null)
  const dragRef = useRef({ dragging: false, sx: 0, sy: 0, ox: 0, oy: 0, moved: false })

  const [muted, setMuted] = useState(loadMuted)
  const [volume, setVolume] = useState(() => {
    try {
      return Number(localStorage.getItem('pf-music-vol')) || 0.35
    } catch {
      return 0.35
    }
  })
  const [ready, setReady] = useState(false)
  const [pos, setPos] = useState(() => loadPos() ?? { x: 24, y: 100 })
  const [showTip, setShowTip] = useState(false)
  const tipTimer = useRef(null)

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const play = useCallback(() => {
    audioRef.current?.play().catch(() => {})
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
    if (audioRef.current) audioRef.current.volume = volume
    try {
      localStorage.setItem('pf-music-vol', String(volume))
    } catch {
      // silent
    }
  }, [volume])

  const flashTip = useCallback((text) => {
    setShowTip(text)
    clearTimeout(tipTimer.current)
    tipTimer.current = setTimeout(() => setShowTip(false), 900)
  }, [])

  const toggle = useCallback(() => {
    const next = !muted
    setMuted(next)
    saveMuted(next)
    flashTip(next ? 'MUTED' : 'PLAYING')
  }, [muted, flashTip])

  const onWheel = useCallback(
    (e) => {
      e.preventDefault()
      setVolume((prev) => {
        const delta = e.deltaY > 0 ? -0.05 : 0.05
        const next = Math.min(1, Math.max(0, +(prev + delta).toFixed(2)))
        flashTip(`${Math.round(next * 100)}%`)
        return next
      })
    },
    [flashTip],
  )

  useEffect(() => {
    const el = btnRef.current
    if (!el) return undefined
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onWheel])

  const onPointerDown = useCallback(
    (e) => {
      if (e.button !== 0) return
      const d = dragRef.current
      d.dragging = true
      d.moved = false
      d.sx = e.clientX
      d.sy = e.clientY
      d.ox = pos.x
      d.oy = pos.y
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [pos],
  )

  const onPointerMove = useCallback((e) => {
    const d = dragRef.current
    if (!d.dragging) return
    const dx = e.clientX - d.sx
    const dy = e.clientY - d.sy
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true
    if (!d.moved) return
    const nx = Math.max(0, Math.min(window.innerWidth - 52, d.ox + dx))
    const ny = Math.max(0, Math.min(window.innerHeight - 52, d.oy + dy))
    setPos({ x: nx, y: ny })
  }, [])

  const onPointerUp = useCallback(() => {
    const d = dragRef.current
    d.dragging = false
    if (d.moved) {
      setPos((p) => {
        savePos(p)
        return p
      })
    }
  }, [])

  const handleClick = useCallback(() => {
    if (dragRef.current.moved) return
    toggle()
  }, [toggle])

  const offset = (1 - volume) * CIRC

  return (
    <div
      className="fixed z-50 select-none"
      style={{ left: pos.x, top: pos.y, touchAction: 'none' }}
    >
      {showTip && (
        <div className="glass pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 font-mono text-[10px] text-neon-cyan">
          {showTip}
        </div>
      )}

      <button
        ref={btnRef}
        type="button"
        onClick={handleClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        data-cursor-label="DRAG"
        className={`glass relative flex h-11 w-11 cursor-grab items-center justify-center rounded-full shadow-lg transition-shadow active:cursor-grabbing ${
          muted
            ? 'text-slate-500 shadow-none'
            : 'text-neon-cyan shadow-neon-violet/20 hover:shadow-[0_0_24px_rgba(34,211,238,0.35)]'
        }`}
        aria-label={muted ? 'Unmute background music' : 'Mute background music'}
      >
        <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="24"
            cy="24"
            r={RADIUS}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="2"
          />
          <circle
            cx="24"
            cy="24"
            r={RADIUS}
            fill="none"
            stroke={muted ? 'rgba(255,255,255,0.1)' : 'url(#music-grad)'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={CIRC}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.12s linear' }}
          />
          <defs>
            <linearGradient id="music-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#22d3ee" />
              <stop offset="1" stopColor="#818cf8" />
            </linearGradient>
          </defs>
        </svg>

        {muted ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="relative h-5 w-5">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="relative h-5 w-5">
            <path d="M11 5L6 9H2v6h4l5 4V5z" />
            <path d="M19.07 4.93a10 10 0 010 14.14" />
            <path d="M15.54 8.46a5 5 0 010 7.07" />
          </svg>
        )}
      </button>
    </div>
  )
}
