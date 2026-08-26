import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function TiltCard({ children, max = 9, className = '' }) {
  const ref = useRef(null)
  const rotateXRaw = useMotionValue(0)
  const rotateYRaw = useMotionValue(0)
  const rotateX = useSpring(rotateXRaw, { stiffness: 220, damping: 20 })
  const rotateY = useSpring(rotateYRaw, { stiffness: 220, damping: 20 })
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  const onMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    rotateYRaw.set((px - 0.5) * max * 2)
    rotateXRaw.set(-(py - 0.5) * max * 2)
    setGlare({ x: px * 100, y: py * 100, opacity: 1 })
  }

  const reset = () => {
    rotateXRaw.set(0)
    rotateYRaw.set(0)
    setGlare((g) => ({ ...g, opacity: 0 }))
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(165,180,252,0.18), transparent 55%)`,
          opacity: glare.opacity,
          transition: 'opacity 0.3s',
        }}
      />
    </motion.div>
  )
}
