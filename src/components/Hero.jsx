import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'
import { ArrowRightIcon, ChevronDownIcon, MapPinIcon } from './Icons'
import SocialLinks from './SocialLinks'
import Magnetic from './Magnetic'
import StatusBadge from './StatusBadge'

const HeroScene = lazy(() => import('./HeroScene'))

const ROLES_BY_LANG = { en: profile.en.roles, zh: profile.zh.roles }

const K = 'text-neon-pink'
const V = 'text-neon-cyan'
const S = 'text-emerald-300'
const P = 'text-slate-500'
const T = 'text-slate-400'
const N = 'text-neon-violet'
const seg = (t, c) => ({ t, c })

function useCodeLines(name, focusText) {
  return [
    [seg('const ', K), seg('developer', V), seg(' = {', P)],
    [seg('  name: ', T), seg(`'${name}'`, S), seg(',', P)],
    [seg('  focus: ', T), seg(`'${focusText}'`, S), seg(',', P)],
    [
      seg('  stack: [', T),
      seg("'Go'", S),
      seg(', ', P),
      seg("'React'", S),
      seg(', ', P),
      seg("'Node'", S),
      seg('],', P),
    ],
    [seg('  base: ', T), seg("'Beijing'", S), seg(',', P)],
    [seg('  coffee: ', T), seg('Infinity', N), seg(',', P)],
    [seg('  shipping: ', T), seg('GojiDB', V), seg(',', P)],
    [seg('}', P)],
  ]
}

function useTypewriter(words, speed = 75, pause = 1600) {
  const [text, setText] = useState('')

  useEffect(() => {
    let word = 0
    let char = 0
    let deleting = false
    let timer

    const tick = () => {
      const current = words[word]
      if (!deleting) {
        char += 1
        setText(current.slice(0, char))
        if (char === current.length) {
          deleting = true
          timer = setTimeout(tick, pause)
          return
        }
        timer = setTimeout(tick, speed)
      } else {
        char -= 1
        setText(current.slice(0, char))
        if (char === 0) {
          deleting = false
          word = (word + 1) % words.length
        }
        timer = setTimeout(tick, speed / 2)
      }
    }

    tick()
    return () => clearTimeout(timer)
  }, [words, speed, pause])

  return text
}

export default function Hero() {
  const { lang } = useLang()
  const t = ui[lang].hero
  const data = profile[lang]
  const roles = ROLES_BY_LANG[lang]
  const typed = useTypewriter(roles)
  const codeLines = useCodeLines(data.name, lang === 'zh' ? '全栈与分布式系统' : 'fullstack & systems')
  const [show3D] = useState(() => window.matchMedia('(min-width: 1024px)').matches)

  const sectionRef = useRef(null)
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [10, -10]), { stiffness: 120, damping: 18 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 120, damping: 18 })

  const onMouseMove = (e) => {
    const rect = sectionRef.current.getBoundingClientRect()
    mx.set((e.clientX - rect.left) / rect.width)
    my.set((e.clientY - rect.top) / rect.height)
  }

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    window.history.replaceState(null, '', `#${id}`)
  }

  return (
    <section
      id="top"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative flex min-h-screen items-center overflow-hidden pt-24"
    >
      {show3D && (
        <Suspense fallback={null}>
          <HeroScene />
        </Suspense>
      )}

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-16 px-6 pb-28 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <StatusBadge />

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl xl:text-6xl"
          >
            <span className="block">{t.greeting}</span>
            <span className="mt-2 block">
              <span className="text-gradient">{data.name}</span>
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-5 flex h-9 items-center font-mono text-xl text-slate-300 sm:text-2xl"
          >
            <span className="mr-3 text-neon-pink">&gt;</span>
            <span>{typed}</span>
            <span className="ml-1 inline-block h-6 w-[10px] animate-blink bg-neon-cyan" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 max-w-xl leading-relaxed text-slate-400"
          >
            {data.tagline}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.38 }}
            className="mt-4 flex items-center gap-1.5 font-mono text-xs text-slate-500"
          >
            <MapPinIcon className="h-3.5 w-3.5 text-neon-violet" />
            {data.location}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Magnetic>
              <a
                href="#projects"
                data-cursor-label="GO"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('projects')
                }}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink px-6 py-3 font-semibold text-night transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(129,140,248,0.45)]"
              >
                {t.viewWork}
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                data-cursor-label="HI"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('contact')
                }}
                className="glass inline-block rounded-xl px-6 py-3 font-semibold text-slate-200 transition-all hover:border-neon-cyan/40 hover:text-white"
              >
                {t.getInTouch}
              </a>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-10"
          >
            <SocialLinks />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          className="relative hidden lg:block"
        >
          <div className="absolute -inset-8 rounded-full bg-gradient-to-tr from-neon-cyan/20 via-neon-violet/20 to-neon-pink/20 blur-3xl" />

          <div className="glass relative animate-float rounded-2xl shadow-2xl shadow-neon-violet/10">
            <div className="flex items-center gap-1.5 border-b border-white/10 px-5 py-3.5">
              <span className="h-3 w-3 rounded-full bg-red-400/90" />
              <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
              <span className="ml-3 font-mono text-xs text-slate-500">developer.js</span>
            </div>
            <pre className="overflow-x-auto p-6 font-mono text-sm leading-7 text-slate-300">
              <code>
                {codeLines.map((segments, i) => (
                  <div key={i}>
                    {segments.map((seg, j) => (
                      <span key={j} className={seg.c}>
                        {seg.t}
                      </span>
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          </div>

          <div className="glass absolute -right-4 -top-5 animate-float-slow rounded-lg px-3 py-2 font-mono text-xs text-neon-cyan">
            ⚛ React 19
          </div>
          <div
            className="glass absolute -bottom-5 -left-6 animate-float rounded-lg px-3 py-2 font-mono text-xs text-neon-pink"
            style={{ animationDelay: '-3s' }}
          >
            ✦ Design Systems
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#about"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        onClick={(e) => {
          e.preventDefault()
          scrollToSection('about')
        }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-slate-500 transition-colors hover:text-neon-cyan"
      >
        <ChevronDownIcon className="h-6 w-6 animate-bounce" />
      </motion.a>
    </section>
  )
}
