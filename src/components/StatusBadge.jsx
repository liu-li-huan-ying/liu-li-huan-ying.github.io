import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/use-lang'

const DAY_START_HOUR = 9
const DAY_END_HOUR = 18

const STATUS_MAP = {
  working: {
    zh: '工作中',
    en: 'Working',
    dot: 'bg-emerald-400',
    text: 'text-emerald-400',
  },
  slacking: {
    zh: '摸鱼中',
    en: 'Slacking off',
    dot: 'bg-amber-400',
    text: 'text-amber-400',
  },
  overtime: {
    zh: '加班中',
    en: 'Overtime',
    dot: 'bg-red-400',
    text: 'text-red-400',
  },
  resting: {
    zh: '休息中',
    en: 'Resting',
    dot: 'bg-violet-400',
    text: 'text-violet-400',
  },
  sleeping: {
    zh: '睡觉中',
    en: 'Sleeping',
    dot: 'bg-[var(--color-text-muted)]',
    text: 'text-[var(--color-text-muted)]',
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`inline-flex items-center gap-2 text-xs ${status.text}`}
      title={lang === 'zh' ? '根据节假日与时间实时变化' : 'Changes with holidays and time of day'}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-40 ${status.dot}`} />
        <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${status.dot}`} />
      </span>
      {label}
    </motion.p>
  )
}
