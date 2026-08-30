import { useEffect, useState } from 'react'
import { useLang } from '../i18n/use-lang'
import { CalendarIcon, EyeIcon, FolderIcon } from './Icons'
import FadeIn from './FadeIn'

const ABACUS_NS = 'liu-li-huan-ying'
const ABACUS_KEY = 'portfolio-visits'
const LOCAL_KEY = 'pf-visits'

function bumpLocal() {
  try {
    const next = (Number.parseInt(localStorage.getItem(LOCAL_KEY), 10) || 0) + 1
    localStorage.setItem(LOCAL_KEY, String(next))
    return next
  } catch (err) {
    void err
    return null
  }
}

export default function StatsBar() {
  const { lang } = useLang()
  const [visits, setVisits] = useState(null)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`https://abacus.jasoncameron.dev/hit/${ABACUS_NS}/${ABACUS_KEY}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error('abacus unavailable')
        const data = await res.json()
        if (!cancelled && Number.isFinite(data?.value)) {
          setVisits(data.value)
        } else {
          throw new Error('bad payload')
        }
      } catch {
        if (cancelled) return
        const local = bumpLocal()
        if (local !== null) setVisits(local)
        else if (!cancelled) setVisits(null)
      }
    }, 1000)

    return () => {
      cancelled = true
      clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  const visitText =
    visits === null
      ? lang === 'zh'
        ? '访客计数加载中…'
        : 'counting visitors…'
      : lang === 'zh'
        ? `您是第 ${visits} 位访客`
        : `You are visitor #${visits}`

  const items = [
    { key: 'time', icon: CalendarIcon, text: timeText },
    { key: 'posts', icon: FolderIcon, text: postText },
    { key: 'visits', icon: EyeIcon, text: visitText },
  ]

  return (
    <FadeIn className="mx-auto max-w-4xl px-6 pb-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {items.map(({ key, icon: Icon, text }) => (
          <div
            key={key}
            className="glass flex items-center justify-center gap-3 rounded-xl px-5 py-4 transition-colors hover:border-neon-violet/30"
          >
            <Icon className="h-5 w-5 shrink-0 text-neon-cyan" />
            <span className="font-mono text-xs leading-relaxed text-slate-300 sm:text-sm">{text}</span>
          </div>
        ))}
      </div>
    </FadeIn>
  )
}
