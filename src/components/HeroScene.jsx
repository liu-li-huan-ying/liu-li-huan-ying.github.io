import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useLang } from '../i18n/use-lang'

const COUNT = 2600

const PLANET_QUOTES = {
  en: [
    'You found the planet ✦',
    'Gravity = curiosity',
    'GojiDB awaits below ↓',
    'Keep building, keep exploring',
    'Powered by Three.js & caffeine',
  ],
  zh: [
    '你发现了这颗星球 ✦',
    '引力 = 好奇心',
    'GojiDB 在下面等你 ↓',
    '持续构建，持续探索',
    '由 Three.js 与咖啡因驱动',
  ],
}

function buildSphereData() {
  const positions = new Float32Array(COUNT * 3)
  const colors = new Float32Array(COUNT * 3)
  const c1 = new THREE.Color('#22d3ee')
  const c2 = new THREE.Color('#e879f9')
  const tmp = new THREE.Color()

  for (let i = 0; i < COUNT; i += 1) {
    const r = 2.2 + Math.random() * 0.18
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)

    tmp.copy(c1).lerp(c2, Math.random())
    colors[i * 3] = tmp.r
    colors[i * 3 + 1] = tmp.g
    colors[i * 3 + 2] = tmp.b
  }

  return { positions, colors }
}

const SPHERE_DATA = buildSphereData()

function ParticleSphere() {
  const ref = useRef(null)

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.08
    ref.current.rotation.x += delta * 0.03
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[SPHERE_DATA.positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[SPHERE_DATA.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function CoreShape() {
  const ref = useRef(null)

  useFrame((_, delta) => {
    ref.current.rotation.y -= delta * 0.14
    ref.current.rotation.z += delta * 0.05
  })

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.35, 8]} />
      <MeshDistortMaterial color="#818cf8" wireframe distort={0.34} speed={1.8} roughness={0.35} metalness={0.1} />
    </mesh>
  )
}

function Rig({ children }) {
  const ref = useRef(null)
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      target.current.x = e.clientX / window.innerWidth - 0.5
      target.current.y = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame(() => {
    ref.current.rotation.y += (target.current.x * 0.7 - ref.current.rotation.y) * 0.045
    ref.current.rotation.x += (target.current.y * 0.45 - ref.current.rotation.x) * 0.045
  })

  return <group ref={ref}>{children}</group>
}

export default function HeroScene() {
  const wrapRef = useRef(null)
  const [active, setActive] = useState(true)
  const [isDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches)
  const [bubble, setBubble] = useState(null)
  const { lang } = useLang()
  const quotes = PLANET_QUOTES[lang]

  useEffect(() => {
    if (!bubble) return undefined
    const timer = setTimeout(() => setBubble(null), 2400)
    return () => clearTimeout(timer)
  }, [bubble])

  const onPlanetClick = (e) => {
    const x = e.clientX ?? e.nativeEvent?.clientX ?? window.innerWidth / 2
    const y = e.clientY ?? e.nativeEvent?.clientY ?? window.innerHeight / 3
    const quote = quotes[Math.floor(Math.random() * quotes.length)]
    setBubble({ text: quote, x, y, key: Date.now() })
    window.dispatchEvent(new CustomEvent('planet-burst', { detail: { x, y } }))
  }

  useEffect(() => {
    const el = wrapRef.current
    if (!el || !isDesktop) return undefined
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      threshold: 0,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [isDesktop])

  if (!isDesktop) return null

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="absolute inset-0 opacity-40 lg:opacity-100"
    >
      <Canvas
        camera={{ position: [1.6, 0.2, 5], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
        frameloop={active ? 'always' : 'never'}
      >
        <Rig>
          <group
            position={[0.6, 0.1, 0]}
            onClick={onPlanetClick}
            onPointerDown={onPlanetClick}
          >
            <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.9}>
              <CoreShape />
            </Float>
            <ParticleSphere />
            <mesh onClick={onPlanetClick} onPointerDown={onPlanetClick}>
              <sphereGeometry args={[2.05, 16, 16]} />
              <meshBasicMaterial transparent opacity={0} depthWrite={false} />
            </mesh>
            <Sparkles count={90} scale={[6.5, 4.5, 2.5]} size={2.2} speed={0.35} color="#22d3ee" opacity={0.6} />
          </group>
        </Rig>
      </Canvas>

      <AnimatePresence>
        {bubble && (
          <motion.div
            key={bubble.key}
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 320, damping: 24 }}
            style={{ left: bubble.x, top: bubble.y - 20 }}
            className="glass pointer-events-none fixed z-[75] -translate-x-1/2 -translate-y-full rounded-xl px-4 py-2 font-mono text-xs text-neon-cyan"
          >
            {bubble.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
