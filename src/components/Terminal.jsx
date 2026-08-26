import { useEffect, useMemo, useRef, useState } from 'react'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'
import { reveal } from '../utils/secret'

const seg = (t, c = 'text-slate-400') => ({ t, c })
const promptSegs = [seg('➜  ~ ', 'text-emerald-400')]

export default function Terminal() {
  const { lang } = useLang()
  const tt = ui[lang].term
  const d = profile[lang]
  const slug = d.name.toLowerCase().replace(/\s+/g, '-')

  const bootLines = useMemo(() => {
    const cmd = (cmdText) => ({ type: 'cmd', segs: [...promptSegs, seg(cmdText, 'text-slate-100')] })
    const out = (...segs) => ({ type: 'out', segs })
    return [
      out(seg(`${tt.welcome} `, 'text-slate-400'), seg(`${slug}@dev`, 'text-neon-cyan')),
      out(
        seg(`${tt.typeLead} `, 'text-slate-500'),
        seg(tt.typeKey, 'text-emerald-300'),
        seg(` ${tt.typeTail}`, 'text-slate-500')
      ),
      cmd('whoami'),
      out(seg('>> ', 'text-slate-600'), seg(d.name, 'text-white'), seg(` — ${d.roles[0]}`, 'text-slate-400')),
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
          { type: 'out', segs: [seg(tt.helpTitle, 'text-slate-200')] },
          ...['help', 'whoami', 'about', 'skills', 'projects', 'contact', 'clear'].map((cmd) => ({
            type: 'out',
            segs: [seg(`  ${cmd.padEnd(10)}`, 'text-neon-violet'), seg(tt.desc[cmd], 'text-slate-500')],
          })),
        ]
      case 'whoami':
        return [
          {
            type: 'out',
            segs: [seg('>> ', 'text-slate-600'), seg(d.name, 'text-white'), seg(` — ${d.roles[0]}`, 'text-slate-400')],
          },
        ]
      case 'about':
        return d.about.map((p) => ({ type: 'out', segs: [seg(`>> ${p}`)] }))
      case 'skills':
        return [{ type: 'out', segs: [seg('>> ', 'text-slate-600'), seg(d.skills.join(' · '), 'text-slate-300')] }]
      case 'projects':
        return d.projects.map((p, i) => ({
          type: 'out',
          segs: [seg(`>> ${i + 1}. ${p.title} `, 'text-slate-300'), seg(`# ${p.tags.join(', ')}`, 'text-slate-600')],
        }))
      case 'contact':
        return [
          { type: 'out', segs: [seg('>> email: ', 'text-slate-500'), seg(d.email, 'text-neon-cyan')] },
          ...d.socials.map((s) => ({
            type: 'out',
            segs: [seg(`>> ${s.label.toLowerCase()}: `, 'text-slate-500'), seg(s.enc ? reveal(s.enc) : s.url, 'text-neon-cyan')],
          })),
        ]
      case 'clear':
        return null
      case 'sudo':
        return [{ type: 'out', segs: [seg(tt.sudo, 'text-red-400/90')] }]
      case 'exit':
        return [{ type: 'out', segs: [seg(tt.exit, 'text-slate-500')] }]
      default:
        return [
          {
            type: 'out',
            segs: [seg(`${tt.nfPre} ${name} `, 'text-red-400/90'), seg(tt.nfTail, 'text-slate-500')],
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
    setDynamic((prev) => [...prev, { type: 'cmd', segs: [...promptSegs, seg(cmd || ' ', 'text-slate-100')] }, ...result])
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
      className="overflow-hidden rounded-2xl border border-white/10 bg-panel/80 shadow-2xl shadow-neon-violet/10 backdrop-blur-xl"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
        <span className="h-3 w-3 rounded-full bg-red-400/90" />
        <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
        <span className="ml-3 font-mono text-xs text-slate-500">{slug}@dev — zsh</span>
        <span className="ml-auto hidden font-mono text-[10px] text-slate-600 sm:block">{tt.interactive}</span>
      </div>

      <div ref={scrollRef} className="max-h-[340px] space-y-1 overflow-y-auto p-6 font-mono text-sm leading-7">
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
            className="min-w-0 flex-1 border-none bg-transparent font-mono text-sm text-slate-100 caret-cyan-400 outline-none placeholder:text-slate-600"
          />
        </div>
      </div>
    </div>
  )
}
