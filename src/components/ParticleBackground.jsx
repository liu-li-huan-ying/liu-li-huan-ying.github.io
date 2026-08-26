import { useEffect, useRef } from 'react'

export default function ParticleBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let raf = 0
    let particles = []
    const mouse = { x: -9999, y: -9999 }

    const init = () => {
      const count = Math.min(110, Math.floor((window.innerWidth * window.innerHeight) / 14000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.4,
        tw: Math.random() * Math.PI * 2,
        ts: Math.random() * 0.02 + 0.005,
      }))
    }

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      init()
    }

    const draw = () => {
      const now = performance.now()
      while (bursts.length && now - bursts[0].start > 700) bursts.shift()

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      for (const p of particles) {
        p.tw += p.ts
        p.x += p.vx
        p.y += p.vy

        if (p.x < -20) p.x = window.innerWidth + 20
        if (p.x > window.innerWidth + 20) p.x = -20
        if (p.y < -20) p.y = window.innerHeight + 20
        if (p.y > window.innerHeight + 20) p.y = -20

        let glow = 0
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const md = Math.hypot(dx, dy)
        if (md < 150 && md > 0.01) {
          glow = (1 - md / 150) * 0.35
          p.x += (dx / md) * 0.6
          p.y += (dy / md) * 0.6
        }

        for (const burst of bursts) {
          const bx = p.x - burst.x
          const by = p.y - burst.y
          const bd = Math.hypot(bx, by)
          if (bd < 260 && bd > 0.01) {
            const age = (now - burst.start) / 700
            const force = (1 - bd / 260) * (1 - age) * 4
            p.x += (bx / bd) * force
            p.y += (by / bd) * force
            glow += (1 - age) * 0.5
          }
        }

        const alpha = 0.25 + Math.abs(Math.sin(p.tw)) * 0.45 + glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(165, 180, 252, ${alpha})`
        ctx.fill()
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]
          const b = particles[j]
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(129, 140, 248, ${(1 - dist / 120) * 0.14})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
    }

    let running = false
    const bursts = []

    const startLoop = () => {
      if (reduced || running || document.hidden) return
      running = true
      raf = requestAnimationFrame(loop)
    }

    const stopLoop = () => {
      running = false
      cancelAnimationFrame(raf)
    }

    const loop = () => {
      draw()
      if (running) raf = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    const onVisibility = () => {
      if (document.hidden) stopLoop()
      else startLoop()
    }

    const onPlanetBurst = (e) => {
      bursts.push({ x: e.detail.x, y: e.detail.y, start: performance.now() })
      if (reduced || !running) startLoop()
    }

    resize()
    if (reduced) {
      draw()
    } else {
      startLoop()
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)
    window.addEventListener('planet-burst', onPlanetBurst)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      stopLoop()
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseout', onLeave)
    window.removeEventListener('planet-burst', onPlanetBurst)
    document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-70"
    />
  )
}
