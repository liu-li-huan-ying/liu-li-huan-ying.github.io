import { useEffect, useState } from 'react'
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
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const onNavClick = (e, id) => {
    e.preventDefault()
    setOpen(false)
    if (id === 'projects' || id === 'blog') {
      navigate(`/${id}`)
    } else {
      goSection(id)
    }
  }

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

        <ul className="hidden items-center gap-7 md:flex">
          {navLinks.map((link, i) => (
            <li key={link.id}>
              <a
                href={`#${link.id}`}
                onClick={(e) => onNavClick(e, link.id)}
                className="text-sm text-slate-300 transition-colors hover:text-white"
              >
                <span className="mr-1 font-mono text-xs text-neon-violet">0{i + 1}.</span>
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
              className="rounded-lg border border-neon-violet/40 px-4 py-1.5 font-mono text-sm text-neon-violet transition-all hover:bg-neon-violet/10 hover:shadow-[0_0_20px_rgba(129,140,248,0.3)]"
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
                  className="block px-6 py-4 font-mono text-sm text-slate-200"
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
