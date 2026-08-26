import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

const DOT = 6
const RING = 34

export default function CustomCursor() {
  const [enabled] = useState(() => window.matchMedia('(pointer: fine)').matches)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [visible, setVisible] = useState(false)
  const [label, setLabel] = useState(null)

  const dotX = useMotionValue(-100)
  const dotY = useMotionValue(-100)
  const ringXRaw = useMotionValue(-117)
  const ringYRaw = useMotionValue(-117)
  const auraXRaw = useMotionValue(-140)
  const auraYRaw = useMotionValue(-140)

  const ringX = useSpring(ringXRaw, { stiffness: 320, damping: 26, mass: 0.5 })
  const ringY = useSpring(ringYRaw, { stiffness: 320, damping: 26, mass: 0.5 })
  const auraX = useSpring(auraXRaw, { stiffness: 70, damping: 18, mass: 0.9 })
  const auraY = useSpring(auraYRaw, { stiffness: 70, damping: 18, mass: 0.9 })

  useEffect(() => {
    if (!enabled) return undefined

    const onMove = (e) => {
      dotX.set(e.clientX - DOT / 2)
      dotY.set(e.clientY - DOT / 2)
      ringXRaw.set(e.clientX - RING / 2)
      ringYRaw.set(e.clientY - RING / 2)
      auraXRaw.set(e.clientX - 40)
      auraYRaw.set(e.clientY - 40)
      setVisible(true)
    }
    const onOver = (e) => {
      const labelled = e.target.closest('[data-cursor-label]')
      setLabel(labelled ? labelled.dataset.cursorLabel : null)
      setHovering(
        Boolean(
          e.target.closest('a, button, input, textarea, [role="button"], [role="link"], [data-cursor-hover]')
        )
      )
    }
    const onDown = () => setPressed(true)
    const onUp = () => setPressed(false)
    const onLeaveDoc = () => setVisible(false)
    const onEnterDoc = () => setVisible(true)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.documentElement.addEventListener('mouseleave', onLeaveDoc)
    document.documentElement.addEventListener('mouseenter', onEnterDoc)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeaveDoc)
      document.documentElement.removeEventListener('mouseenter', onEnterDoc)
    }
  }, [enabled, dotX, dotY, ringXRaw, ringYRaw, auraXRaw, auraYRaw])

  if (!enabled) return null

  const ringSize = label ? 92 : hovering ? 54 : RING

  return (
    <>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[93]"
        style={{ x: auraX, y: auraY }}
        animate={{ opacity: visible && !pressed ? 1 : 0 }}
        transition={{ duration: 0.25 }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div
            className="h-20 w-20 rounded-full bg-gradient-to-br from-neon-cyan/30 via-neon-violet/30 to-neon-pink/30 blur-lg"
            style={{
              transform: `scale(${hovering || label ? 1.7 : 1})`,
              transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[94]"
        style={{ x: ringX, y: ringY }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="relative flex items-center justify-center rounded-full border backdrop-blur-[2px]"
            animate={{
              width: ringSize,
              height: ringSize,
              scale: pressed ? 0.82 : 1,
              backgroundColor:
                hovering || label ? 'rgba(129,140,248,0.10)' : 'rgba(129,140,248,0)',
              borderColor: hovering || label ? 'rgba(34,211,238,0.65)' : 'rgba(129,140,248,0.45)',
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <span
              className={`absolute -inset-[3px] rounded-full border-2 border-transparent animate-spin ${
                hovering || label ? 'border-t-neon-cyan opacity-100' : 'opacity-0'
              }`}
              style={{ animationDuration: '1.8s', transition: 'opacity 0.25s' }}
            />
            {label && (
              <span className="select-none font-mono text-[10px] font-semibold tracking-[0.22em] text-neon-cyan">
                {label}
              </span>
            )}
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[95]"
        style={{ x: dotX, y: dotY }}
        animate={{ opacity: visible && !label ? 1 : 0 }}
        transition={{ duration: 0.15 }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_2px_rgba(34,211,238,0.75)]" />
        </div>
      </motion.div>
    </>
  )
}
