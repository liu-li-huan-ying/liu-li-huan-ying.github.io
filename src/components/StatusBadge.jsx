import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/use-lang'

const DAY_START_HOUR = 9
const DAY_END_HOUR = 18

const STATUS_MAP = {
  working: {
    zh: '工作中',
    en: 'Working',
    box: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
    dot: 'bg-emerald-400',
  },
  slacking: {
    zh: '摸鱼中',
    en: 'Slacking off',
    box: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
    dot: 'bg-amber-400',
  },
  overtime: {
    zh: '加班中',
    en: 'Overtime',
    box: 'border-red-400/30 bg-red-400/10 text-red-300',
    dot: 'bg-red-400',
  },
  resting: {
    zh: '休息中',
    en: 'Resting',
    box: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
    dot: 'bg-violet-400',
  },
  sleeping: {
    zh: '睡觉中',
    en: 'Sleeping',
    box: 'border-slate-500/30 bg-slate-500/10 text-slate-400',
    dot: 'bg-slate-400',
  },
}

function isDaytime(date) {
  const hour = date.getHours()
  return hour >= DAY_START_HOUR && hour < DAY_END_HOUR
}

function fallbackIsHoliday(date) {
  const weekday = date.getDay()
  return weekday === 0 || weekday === 6
}

function pickStatus(isHoliday, daytime) {
  if (isHoliday) return daytime ? 'resting' : 'sleeping'
  if (daytime) return Math.random() < 0.5 ? 'working' : 'slacking'
  return Math.random() < 0.5 ? 'overtime' : 'sleeping'
}

function pad2(n) {
  return String(n).padStart(2, '0')
}

function getForcedStatus() {
  const value = new URLSearchParams(window.location.search).get('status')
  return value && STATUS_MAP[value] ? value : null
}

export default function StatusBadge() {
  const { lang } = useLang()
  const [statusKey, setStatusKey] = useState(() => getForcedStatus() ?? pickStatus(fallbackIsHoliday(new Date()), isDaytime(new Date())))

  useEffect(() => {
    if (getForcedStatus()) return undefined

    let cancelled = false
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 2500)

    const now = new Date()
    const datePath = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`

    async function refine() {
      try {
        const res = await fetch(`https://timor.tech/api/holiday/info/${datePath}`, {
          signal: controller.signal,
        })
        if (!res.ok) throw new Error('holiday api unavailable')
        const json = await res.json()
        const type = json?.type?.type
        if (!cancelled && [0, 1, 2, 3].includes(type)) {
          const holiday = type === 1 || type === 2
          setStatusKey(pickStatus(holiday, isDaytime(new Date())))
        }
      } catch {
        // fallback heuristic already applied
      }
    }

    refine()

    return () => {
      cancelled = true
      clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  const status = STATUS_MAP[statusKey]
  const label = lang === 'zh' ? status.zh : status.en

  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-xs transition-colors duration-500 ${status.box}`}
      title={lang === 'zh' ? '根据节假日与时间实时变化' : 'Changes with holidays and time of day'}
    >
      <span className="relative flex h-2 w-2">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${status.dot}`} />
        <span className={`relative inline-flex h-2 w-2 rounded-full ${status.dot}`} />
      </span>
      {label}
    </motion.p>
  )
}
