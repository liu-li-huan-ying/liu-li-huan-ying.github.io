import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'
import { ChevronDownIcon } from './Icons'
import StatusBadge from './StatusBadge'

export default function Hero() {
  const { lang } = useLang()
  const t = ui[lang].hero
  const data = profile[lang]

  const [time, setTime] = useState('')
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString(lang === 'zh' ? 'zh-CN' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      )
    }
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [lang])

  return (
    <section className="relative flex min-h-screen flex-col justify-between px-6 py-12 sm:px-12 md:px-20">
      {/* Top bar */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <span className="mono-label">{time}</span>
        <StatusBadge />
      </motion.header>

      {/* Main content */}
      <div className="flex flex-1 items-center">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mono-label mb-6"
          >
            {t.greeting}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="editorial-heading text-5xl sm:text-7xl md:text-8xl lg:text-9xl"
          >
            {data.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 max-w-xl"
          >
            <p className="text-lg leading-relaxed text-[var(--color-text-secondary)] sm:text-xl">
              {data.tagline}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="mt-12 flex items-center gap-6"
          >
            <a
              href="#projects"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="group inline-flex items-center gap-3 text-[var(--color-text-primary)] transition-colors hover:text-[var(--color-accent)]"
            >
              <span className="text-sm">{t.viewWork}</span>
              <ChevronDownIcon className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
            </a>
            <span className="text-[var(--color-border)]">|</span>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-text-primary)]"
            >
              {t.getInTouch}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom — location */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="flex items-center justify-between text-xs text-[var(--color-text-muted)]"
      >
        <span>{data.location}</span>
        <span className="mono-label">{data.roles[0]}</span>
      </motion.footer>
    </section>
  )
}
