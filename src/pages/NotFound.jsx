import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { navigate } from '../hooks/useHashRoute'

const ROUTE_MAP = {
  '/': '/',
  '/about': '/about',
  '/blog': '/blog',
  '/projects': '/projects',
  about: '/about',
  blog: '/blog',
  projects: '/projects',
  '~': '/',
  home: '/',
}

export default function NotFound() {
  const { lang } = useLang()
  const t = ui[lang]?.notFound
  const term = t?.term

  const [bootLines, setBootLines] = useState([])
  const [bootDone, setBootDone] = useState(false)
  const [output, setOutput] = useState([])
  const [input, setInput] = useState('')
  const [cmdHistory, setCmdHistory] = useState([])
  const setHistoryIdx = useState(-1)[1]
  const [glitch, setGlitch] = useState(false)
  const [showHome, setShowHome] = useState(false)
  const inputRef = useRef(null)
  const termRef = useRef(null)

  // Boot sequence
  useEffect(() => {
    if (!term?.boot) return
    const boot = term.boot
    const bootLen = boot.length
    let i = 0
    let cancelled = false
    const interval = setInterval(() => {
      if (cancelled) return
      if (i < bootLen) {
        const currentLine = boot[i]
        i++
        if (currentLine != null) {
          setBootLines((prev) => [...prev, currentLine])
        }
      } else {
        clearInterval(interval)
        setBootDone(true)
      }
    }, 400)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [term])

  // Auto-scroll to bottom
  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight
    }
  }, [output, bootLines])

  // Focus input on boot done
  useEffect(() => {
    if (bootDone) inputRef.current?.focus()
  }, [bootDone])

  const triggerGlitch = useCallback(() => {
    setGlitch(true)
    setTimeout(() => setGlitch(false), 600)
  }, [])

  const addOutput = useCallback((lines) => {
    setOutput((prev) => [...prev, ...lines])
  }, [])

  const handleCommand = useCallback(
    (raw) => {
      const trimmed = raw.trim()
      const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/)

      setCmdHistory((prev) => [...prev, trimmed])
      setHistoryIdx(-1)
      addOutput([{ type: 'input', text: `${term.prompt}$ ${trimmed}` }])

      if (!cmd) return

      switch (cmd) {
        case 'help':
          addOutput([{ type: 'info', text: term.help }, ...term.helpList.map((l) => ({ type: 'info', text: l }))])
          break
        case 'ls':
          addOutput([
            { type: 'info', text: 'Available routes:' },
            ...term.routes.map((r) => ({ type: 'route', text: `  ${r}` })),
          ])
          break
        case 'cd': {
          const target = args[0] || '~'
          const path = ROUTE_MAP[target]
          if (path) {
            addOutput([{ type: 'success', text: term.navigating(path) }])
            setTimeout(() => navigate(path), 600)
          } else {
            triggerGlitch()
            addOutput([{ type: 'error', text: `cd: no such route: ${target}` }])
          }
          break
        }
        case 'whoami':
          addOutput([{ type: 'success', text: term.whoami }])
          break
        case 'date':
          addOutput([{ type: 'success', text: `${term.datePrefix} ${new Date().toLocaleString()}` }])
          break
        case 'ping': {
          const ms = (Math.random() * 0.1 + 0.02).toFixed(3)
          addOutput(term.pingLines(ms).map((l) => ({ type: 'info', text: l })))
          break
        }
        case 'clear':
          setOutput([])
          break
        case 'exit':
          addOutput([{ type: 'success', text: term.exit }])
          setShowHome(true)
          break
        case 'sudo':
          triggerGlitch()
          addOutput([{ type: 'error', text: term.sudo }])
          break
        case 'matrix':
          addOutput([{ type: 'info', text: 'Activating Matrix mode...' }])
          window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', ctrlKey: true, shiftKey: true }))
          break
        default:
          triggerGlitch()
          addOutput([{ type: 'error', text: term.notFound(trimmed) }])
      }
    },
    [term, addOutput, triggerGlitch, setHistoryIdx]
  )

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleCommand(input)
      setInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHistoryIdx((prev) => {
        const next = prev + 1
        if (next < cmdHistory.length) {
          setInput(cmdHistory[cmdHistory.length - 1 - next])
          return next
        }
        return prev
      })
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHistoryIdx((prev) => {
        const next = prev - 1
        if (next >= 0) {
          setInput(cmdHistory[cmdHistory.length - 1 - next])
          return next
        }
        setInput('')
        return -1
      })
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setOutput([])
    }
  }

  if (!t || !term) return null

  return (
    <section className="relative flex min-h-[80vh] items-center justify-center px-4 py-20">
      {/* Glitch overlay */}
      <AnimatePresence>
        {glitch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-50"
          >
            <div className="absolute inset-0 animate-glitch-1 bg-neon-cyan/5" />
            <div className="absolute inset-0 animate-glitch-2 bg-neon-pink/5" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Terminal */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="terminal relative w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0f]/90 shadow-2xl backdrop-blur-xl"
      >
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-red-500/80" />
          <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <span className="h-3 w-3 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-[11px] text-slate-500">
            {term.prompt} — bash — 80×24
          </span>
        </div>

        {/* Terminal body */}
        <div
          ref={termRef}
          className="terminal-body h-[60vh] overflow-y-auto p-5 font-mono text-sm leading-relaxed"
          onClick={() => inputRef.current?.focus()}
        >
          {/* CRT scanlines */}
          <div className="pointer-events-none absolute inset-0 z-10 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0px, transparent 1px, transparent 2px)',
            backgroundSize: '100% 3px',
          }} />

          {/* Glitch 404 text */}
          <div className="relative mb-4">
            <p className="glitch text-gradient font-display text-5xl font-bold md:text-7xl" data-text={t.code}>
              {t.code}
            </p>
          </div>

          {/* Boot sequence */}
          {bootLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={`mb-0.5 ${
                line.startsWith('ERROR')
                  ? 'text-red-400'
                  : line.includes('help')
                    ? 'text-neon-cyan'
                    : 'text-green-400'
              }`}
            >
              {line.startsWith('ERROR') ? '✖ ' : '▸ '}{line}
            </motion.div>
          ))}

          {/* Output lines */}
          {output.map((line, i) => (
            <div
              key={`out-${i}`}
              className={`mb-0.5 ${
                line.type === 'error'
                  ? 'text-red-400'
                  : line.type === 'success'
                    ? 'text-green-400'
                    : line.type === 'route'
                      ? 'text-neon-cyan hover:underline cursor-pointer'
                      : line.type === 'input'
                        ? 'text-white'
                        : 'text-slate-400'
              }`}
            >
              {line.type === 'input' ? (
                <>
                  <span className="text-neon-cyan">{line.text.split('$')[0]}$</span>
                  <span className="text-white">{line.text.split('$')[1]}</span>
                </>
              ) : (
                line.text
              )}
            </div>
          ))}

          {/* Input line */}
          {bootDone && (
            <div className="flex items-center">
              <span className="mr-2 text-neon-cyan">{term.prompt}$</span>
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full border-none bg-transparent font-mono text-sm text-white caret-neon-cyan outline-none"
                  spellCheck="false"
                  autoComplete="off"
                  aria-label="Terminal input"
                />
                <span className="pointer-events-none absolute left-0 top-0 -translate-y-px animate-blink font-mono text-sm text-neon-cyan opacity-0">
                  {'_'.repeat(input.length + 1)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Home button (shown after "exit") */}
        <AnimatePresence>
          {showHome && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-t border-white/10 bg-white/[0.02] px-5 py-4"
            >
              <a
                href="#/"
                data-cursor-label="HOME"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink px-5 py-2.5 font-semibold text-night transition-all hover:scale-[1.03] hover:shadow-[0_0_24px_rgba(129,140,248,0.4)]"
              >
                ← {t.home}
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  )
}
