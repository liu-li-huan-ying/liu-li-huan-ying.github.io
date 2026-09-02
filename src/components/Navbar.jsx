import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { navLinks, profile } from '../data/profile'
import { goSection, navigate } from '../hooks/useHashRoute'
import { CloseIcon, MenuIcon } from './Icons'
import LangToggle from './LangToggle'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const t = ui[lang].nav
  const name = profile[lang].name

  useEffect(() => {
    const onHashChange = () => setOpen(false)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const ulRef = useRef(null)
  const linkRefs = useRef([])
  const [hoveredIdx, setHoveredIdx] = useState(-1)
  const [barStyle, setBarStyle] = useState({ x: 0, width: 0, opacity: 0 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onNavClick = (e, id) => {
    e.preventDefault()
    setOpen(false)
    if (id === 'projects' || id === 'blog' || id === 'about') {
      navigate(`/${id}`)
    } else {
      goSection(id)
    }
  }

  const handleUlMouseMove = useCallback((e) => {
    const links = linkRefs.current
    if (!links.length) return

    let closestIdx = 0
    let closestDist = Infinity

    links.forEach((el, i) => {
      if (!el) return
      const rect = el.getBoundingClientRect()
      const center = rect.left + rect.width / 2
      const dist = Math.abs(e.clientX - center)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    })

    const target = links[closestIdx]
    if (!target) return
    const ulRect = ulRef.current.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()

    setHoveredIdx(closestIdx)
    setBarStyle({
      x: targetRect.left - ulRect.left,
      width: targetRect.width,
      opacity: 1,
    })
  }, [])

  const handleUlMouseLeave = useCallback(() => {
    setHoveredIdx(-1)
    setBarStyle((prev) => ({ ...prev, opacity: 0 }))
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open ? 'glass border-x-0 border-t-0' : 'border border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="#/" className="font-mono text-lg font-semibold text-white">
          {'<'}
          <span className="text-gradient">{name}</span>
          {' />'}
        </a>

        <ul
          ref={ulRef}
          onMouseMove={handleUlMouseMove}
          onMouseLeave={handleUlMouseLeave}
          className="relative hidden items-center gap-7 md:flex"
        >
          {/* Scanning highlight bar */}
          <motion.div
            className="pointer-events-none absolute bottom-[-6px] h-[2px] rounded-full"
            animate={{
              x: barStyle.x,
              width: barStyle.width,
              opacity: barStyle.opacity,
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 30, mass: 0.6 }}
            style={{
              background: 'linear-gradient(90deg, #22d3ee, #818cf8)',
              boxShadow: '0 0 12px rgba(34,211,238,0.5), 0 0 24px rgba(129,140,248,0.3)',
            }}
          >
            {/* Scanning light sweep */}
            <span className="scan-light absolute inset-0 rounded-full" />
          </motion.div>

          {navLinks.map((link, i) => (
            <li key={link.id}>
              <a
                ref={(el) => { linkRefs.current[i] = el }}
                href={`#${link.id}`}
                onClick={(e) => onNavClick(e, link.id)}
                className={`text-sm transition-colors ${
                  hoveredIdx === i ? 'text-white' : 'text-slate-300'
                }`}
              >
                <span className={`mr-1 font-mono text-xs transition-colors ${
                  hoveredIdx === i ? 'text-neon-cyan' : 'text-neon-violet'
                }`}>0{i + 1}.</span>
                {t[link.id]}
              </a>
            </li>
          ))}
          <li>
            <LangToggle />
          </li>
          <li>
            <a
              href={profile.en.socials[0].url}
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-neon-violet/40 px-4 py-1.5 font-mono text-sm text-neon-violet transition-all hover:bg-neon-violet/10 hover:border-neon-violet/60"
            >
              {t.github}
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-3 md:hidden">
          <LangToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="text-slate-200 transition-colors hover:text-white"
          >
            {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-white/5 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.li
                key={link.id}
                initial={{ x: -24, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.05 * i }}
              >
                <a
                  href={`#${link.id}`}
                  onClick={(e) => onNavClick(e, link.id)}
                  className="block px-6 py-4 font-mono text-sm text-slate-200 transition-colors hover:bg-white/[0.06] active:bg-white/[0.1]"
                >
                  <span className="mr-2 text-neon-violet">0{i + 1}.</span>
                  {t[link.id]}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}
