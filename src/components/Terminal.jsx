import { useEffect, useMemo, useRef, useState } from 'react'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'
import { reveal } from '../utils/secret'

const seg = (t, c = 'text-[var(--color-text-muted)]') => ({ t, c })
const promptSegs = [seg('➜  ~ ', 'text-[var(--color-accent)]')]

export default function Terminal() {
  const { lang } = useLang()
  const tt = ui[lang].term
  const d = profile[lang]
  const slug = d.name.toLowerCase().replace(/\s+/g, '-')

  const bootLines = useMemo(() => {
    const cmd = (cmdText) => ({ type: 'cmd', segs: [...promptSegs, seg(cmdText, 'text-[var(--color-text-primary)]')] })
    const out = (...segs) => ({ type: 'out', segs })
    return [
      out(seg(`${tt.welcome} `, 'text-[var(--color-text-muted)]'), seg(`${slug}@dev`, 'text-[var(--color-accent)]')),
      out(
        seg(`${tt.typeLead} `, 'text-[var(--color-text-muted)]'),
        seg(tt.typeKey, 'text-emerald-400'),
        seg(` ${tt.typeTail}`, 'text-[var(--color-text-muted)]')
      ),
      cmd('whoami'),
      out(seg('>> ', 'text-[var(--color-text-muted)]'), seg(d.name, 'text-[var(--color-text-primary)]'), seg(` — ${d.roles[0]}`, 'text-[var(--color-text-secondary)]')),
      cmd('cat passions.txt'),
      out(seg(`>> ${tt.passions}`)),
      cmd('uptime'),
      out(seg(`>> ${tt.uptime}`)),
    ]
  }, [tt, slug, d])

  const resolve = (raw) => {
    const name = raw.trim().split(/\s+/)[0]?.toLowerCase() ?? ''
    switch (name) {
      case '':
        return []
      case 'help':
        return [
          { type: 'out', segs: [seg(tt.helpTitle, 'text-[var(--color-text-secondary)]')] },
          ...['help', 'whoami', 'about', 'skills', 'projects', 'contact', 'clear'].map((cmd) => ({
            type: 'out',
            segs: [seg(`  ${cmd.padEnd(10)}`, 'text-[var(--color-accent)]'), seg(tt.desc[cmd], 'text-[var(--color-text-muted)]')],
          })),
        ]
      case 'whoami':
        return [
          {
            type: 'out',
            segs: [seg('>> ', 'text-[var(--color-text-muted)]'), seg(d.name, 'text-[var(--color-text-primary)]'), seg(` — ${d.roles[0]}`, 'text-[var(--color-text-secondary)]')],
          },
        ]
      case 'about':
        return d.about.map((p) => ({ type: 'out', segs: [seg(`>> ${p}`)] }))
      case 'skills':
        return [{ type: 'out', segs: [seg('>> ', 'text-[var(--color-text-muted)]'), seg(d.skills.join(' · '), 'text-[var(--color-text-secondary)]')] }]
      case 'projects':
        return d.projects.map((p, i) => ({
          type: 'out',
          segs: [seg(`>> ${i + 1}. ${p.title} `, 'text-[var(--color-text-secondary)]'), seg(`# ${p.tags.join(', ')}`, 'text-[var(--color-text-muted)]')],
        }))
      case 'contact':
        return [
          { type: 'out', segs: [seg('>> email: ', 'text-[var(--color-text-muted)]'), seg(d.email, 'text-[var(--color-accent)]')] },
          ...d.socials.map((s) => ({
            type: 'out',
            segs: [seg(`>> ${s.label.toLowerCase()}: `, 'text-[var(--color-text-muted)]'), seg(s.enc ? reveal(s.enc) : s.url, 'text-[var(--color-accent)]')],
          })),
        ]
      case 'clear':
        return null
      case 'sudo':
        return [{ type: 'out', segs: [seg(tt.sudo, 'text-red-400')] }]
      case 'exit':
        return [{ type: 'out', segs: [seg(tt.exit, 'text-[var(--color-text-muted)]')] }]
      default:
        return [
          {
            type: 'out',
            segs: [seg(`${tt.nfPre} ${name} `, 'text-red-400'), seg(tt.nfTail, 'text-[var(--color-text-muted)]')],
          },
        ]
    }
  }

  const [dynamic, setDynamic] = useState([])
  const [value, setValue] = useState('')
  const historyRef = useRef([])
  const histIdxRef = useRef(-1)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [dynamic])

  const run = () => {
    const cmd = value.trim()
    setValue('')
    histIdxRef.current = -1
    if (cmd) historyRef.current = [...historyRef.current, cmd]
    const result = resolve(cmd)
    if (result === null) {
      setDynamic([])
      return
    }
    setDynamic((prev) => [...prev, { type: 'cmd', segs: [...promptSegs, seg(cmd || ' ', 'text-[var(--color-text-primary)]')] }, ...result])
  }

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      run()
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const h = historyRef.current
      if (!h.length) return
      histIdxRef.current = histIdxRef.current < 0 ? h.length - 1 : Math.max(0, histIdxRef.current - 1)
      setValue(h[histIdxRef.current])
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const h = historyRef.current
      if (!h.length || histIdxRef.current < 0) return
      histIdxRef.current += 1
      if (histIdxRef.current >= h.length) {
        histIdxRef.current = -1
        setValue('')
      } else {
        setValue(h[histIdxRef.current])
      }
    }
  }

  const allLines = [...bootLines, ...dynamic]

  return (
    <div
      className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-raised)]"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-[var(--color-border)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span className="ml-2 text-xs text-[var(--color-text-muted)]">{slug}@dev — zsh</span>
      </div>

      <div ref={scrollRef} className="max-h-[340px] space-y-1 overflow-y-auto p-5 font-mono text-sm leading-7">
        {allLines.map((line, i) => (
          <div key={`${i}-${line.type}`} className="min-h-[1.75rem] break-words">
            {line.segs.map((s, j) => (
              <span key={j} className={s.c}>
                {s.t}
              </span>
            ))}
          </div>
        ))}

        <div className="flex min-h-[1.75rem] items-center gap-0.5">
          {promptSegs.map((s, j) => (
            <span key={j} className={s.c}>
              {s.t}
            </span>
          ))}
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck="false"
            autoComplete="off"
            aria-label="terminal input"
            placeholder={tt.placeholder}
            className="min-w-0 flex-1 border-none bg-transparent font-mono text-sm text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)]"
          />
        </div>
      </div>
    </div>
  )
}
