import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { navLinks, profile } from '../data/profile'
import { reveal } from '../utils/secret'
import { goSection, navigate } from '../hooks/useHashRoute'

export default function CommandPalette() {
  const { lang, toggle } = useLang()
  const pal = ui[lang].pal
  const nav = ui[lang].nav
  const email = profile[lang].email

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const actions = {
    scrollTo: (id) => goSection(id),
    copyEmail: () => {
      navigator.clipboard?.writeText(email).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    },
    openLink: (url) => window.open(url, '_blank', 'noopener'),
    goTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    toggleMatrix: () => window.dispatchEvent(new Event('portfolio:matrix')),
    toggleLang: toggle,
  }

  const items = [
    ...navLinks.map((link) => ({
      id: link.id,
      label: `${pal.go} ${nav[link.id]}`,
      hint: link.id === 'projects' || link.id === 'blog' ? 'page' : 'section',
      keywords: nav[link.id],
      run: () =>
        link.id === 'projects' || link.id === 'blog' || link.id === 'about'
          ? navigate(`/${link.id}`)
          : actions.scrollTo(link.id),
    })),
    { id: 'email', label: pal.copyEmail, hint: 'action', keywords: 'mail contact email', run: actions.copyEmail },
    { id: 'top', label: pal.top, hint: 'action', keywords: 'scroll home top', run: actions.goTop },
    {
      id: 'lang',
      label: lang === 'zh' ? 'Switch to English' : '切换到中文',
      hint: 'action',
      keywords: 'language i18n 语言',
      run: actions.toggleLang,
    },
    ...profile[lang].socials.map((s) =>
      s.enc
        ? {
            id: `${s.label.toLowerCase()}-copy`,
            label: `${pal.copy} ${s.label} ID`,
            hint: 'action',
            keywords: `${s.label} copy contact`,
            run: () => {
              navigator.clipboard?.writeText(reveal(s.enc)).catch(() => {})
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            },
          }
        : {
            id: s.label.toLowerCase(),
            label: `${pal.open} ${s.label}`,
            hint: 'link',
            keywords: `${s.label} social`,
            run: () => window.open(s.url, '_blank', 'noopener'),
          }
    ),
    {
      id: 'matrix',
      label: pal.matrix,
      hint: 'easter egg',
      keywords: 'konami hacker fun matrix',
      run: actions.toggleMatrix,
    },
  ]

  const q = query.trim().toLowerCase()
  const visible = items.filter((it) => !q || `${it.label} ${it.keywords}`.toLowerCase().includes(q))
  const currentActive = Math.min(active, Math.max(0, visible.length - 1))

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => {
          if (v) setQuery('')
          return !v
        })
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return undefined
    document.body.style.overflow = 'hidden'
    inputRef.current?.focus()
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const close = () => {
    setOpen(false)
    setQuery('')
  }

  const exec = (item) => {
    if (!item) return
    close()
    item.run()
  }

  const onQueryChange = (e) => {
    setQuery(e.target.value)
    setActive(0)
    listRef.current?.scrollTo?.({ top: 0 })
  }

  const onInputKeyDown = (e) => {
    if (e.key === 'Escape') {
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => {
        const next = Math.min(a + 1, visible.length - 1)
        listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' })
        return next
      })
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => {
        const next = Math.max(a - 1, 0)
        listRef.current?.children[next]?.scrollIntoView({ block: 'nearest' })
        return next
      })
    } else if (e.key === 'Enter') {
      exec(visible[currentActive])
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="glass fixed bottom-6 left-6 z-[56] hidden items-center gap-2 rounded-lg px-3.5 py-2 font-mono text-xs text-slate-400 transition-colors hover:border-neon-violet/40 hover:text-white md:flex"
      >
        <span className="text-neon-violet">⌘</span> {pal.menu}
        <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5">Ctrl K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[90] flex justify-center bg-night/70 px-4 pt-[16vh] backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0, y: -14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="glass h-fit w-[min(100%,560px)] overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                <span className="font-mono text-neon-violet">&gt;_</span>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={onQueryChange}
                  onKeyDown={onInputKeyDown}
                  placeholder={pal.placeholder}
                  spellCheck="false"
                  autoComplete="off"
                  aria-label="Command palette search"
                  className="w-full border-none bg-transparent font-mono text-sm text-slate-100 caret-cyan-400 outline-none placeholder:text-slate-600"
                />
                <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
                  esc
                </kbd>
              </div>

              <div ref={listRef} className="max-h-[320px] overflow-y-auto py-2">
                {visible.length === 0 && (
                  <p className="px-5 py-6 text-center font-mono text-sm text-slate-500">{pal.noResults}</p>
                )}
                {visible.map((item, i) => (
                  <button
                    type="button"
                    key={item.id}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => exec(item)}
                    className={`flex w-full items-center justify-between px-5 py-3 text-left font-mono text-sm transition-colors ${
                      i === currentActive ? 'bg-neon-violet/15 text-white' : 'text-slate-300'
                    }`}
                  >
                    <span>
                      <span className={`mr-3 ${i === currentActive ? 'text-neon-cyan' : 'text-slate-600'}`}>›</span>
                      {item.label}
                    </span>
                    <span className="text-xs text-slate-500">{item.hint}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 border-t border-white/10 px-5 py-2.5 font-mono text-xs text-slate-500">
                <span>{pal.navigate}</span>
                <span>{pal.select}</span>
                <span>{pal.close}</span>
                {copied && <span className="ml-auto text-emerald-300">{pal.copied}</span>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
