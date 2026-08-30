import { useEffect, useMemo, useState } from 'react'

const LEVEL_COLORS = [
  'rgba(148, 163, 184, 0.08)',
  'rgba(34, 211, 238, 0.28)',
  'rgba(56, 189, 248, 0.55)',
  'rgba(129, 140, 248, 0.85)',
  'rgba(232, 121, 249, 1)',
]

function computeStats(contributions) {
  let total = 0
  let activeDays = 0
  let longest = 0
  let run = 0

  for (const c of contributions) {
    total += c.count
    if (c.count > 0) {
      activeDays += 1
      run += 1
      longest = Math.max(longest, run)
    } else {
      run = 0
    }
  }

  let current = 0
  for (let i = contributions.length - 1; i >= 0; i -= 1) {
    if (contributions[i].count > 0) current += 1
    else break
  }

  return { total, activeDays, longest, current }
}

const WEEKDAY_SET = new Set([1, 3, 5])

export default function GitHubHeatmap({ username, year = new Date().getFullYear(), labels }) {
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=${year}`,
          { signal: controller.signal }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!cancelled && Array.isArray(json?.contributions) && json.contributions.length) {
          setData(json)
        } else if (!cancelled) {
          setFailed(true)
        }
      } catch {
        if (!cancelled) setFailed(true)
      }
    }, 1200)

    return () => {
      cancelled = true
      clearTimeout(timeout)
      controller.abort()
    }
  }, [username, year])

  const weeks = useMemo(() => {
    if (!data) return []
    const [y, m, d] = data.contributions[0].date.split('-').map(Number)
    const offset = new Date(Date.UTC(y, m - 1, d)).getDay()
    const padded = [...Array(offset).fill(null), ...data.contributions]
    const columns = []
    for (let i = 0; i < padded.length; i += 7) columns.push(padded.slice(i, i + 7))
    return columns
  }, [data])

  const monthMarks = useMemo(() => {
    if (!weeks.length) return []
    const marks = {}
    weeks.forEach((week, colIndex) => {
      for (const cell of week) {
        if (!cell) continue
        const month = Number(cell.date.slice(5, 7))
        if (!(month in marks)) marks[month] = colIndex
        break
      }
    })
    return Object.entries(marks).map(([month, col]) => ({ month: Number(month), col }))
  }, [weeks])

  if (failed) return null

  const stats = data ? computeStats(data.contributions) : null

  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-white">{labels.heatmapTitle}</h3>
        {stats ? (
          <span className="font-mono text-xs text-neon-cyan">
            {stats.total} {labels.heatmapSub}
          </span>
        ) : (
          <span className="font-mono text-xs text-slate-500">loading…</span>
        )}
      </div>

      {!data ? (
        <div className="flex gap-[3px] overflow-hidden py-1" style={{ height: '112px' }}>
          {[...Array(53)].map((_, i) => (
            <div key={i} className="flex flex-col gap-[3px]">
              {[...Array(7)].map((__, j) => (
                <div
                  key={j}
                  className="h-[11px] w-[11px] animate-pulse rounded-[2px] bg-white/[0.03]"
                  style={{ animationDelay: `${((i * 7 + j) % 20) * 60}ms` }}
                />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto pb-2">
            <div className="inline-block min-w-full">
              <div className="relative mb-1 h-4">
                {monthMarks.map(({ month, col }) => (
                  <span
                    key={month}
                    className="absolute font-mono text-[9px] uppercase tracking-wider text-slate-500"
                    style={{ left: `${28 + col * 14}px` }}
                  >
                    {(labels.months ?? [])[month - 1] ?? month}
                  </span>
                ))}
              </div>
              <div className="flex gap-[3px]">
                <div className="mr-1 flex w-6 shrink-0 flex-col gap-[3px]">
                  {[...Array(7)].map((_, i) => (
                    <span key={i} className="h-[11px] font-mono text-[8px] leading-[11px] text-slate-600">
                      {WEEKDAY_SET.has(i) ? (labels.weekdayShort ?? [])[i] ?? '' : ''}
                    </span>
                  ))}
                </div>
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px]">
                    {week.map((cell, di) =>
                      cell ? (
                        <div
                          key={cell.date}
                          title={`${cell.count} contributions · ${cell.date}`}
                          className="h-[11px] w-[11px] rounded-[2px] transition-transform hover:scale-125"
                          style={{
                            background: LEVEL_COLORS[cell.level],
                            boxShadow: cell.level === 4 ? '0 0 6px rgba(232,121,249,0.6)' : 'none',
                          }}
                        />
                      ) : (
                        <div key={`pad-${wi}-${di}`} className="h-[11px] w-[11px]" />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/5 pt-4">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4">
              {[
                { label: labels.stats?.total ?? 'Total', value: stats.total },
                { label: labels.stats?.active ?? 'Active days', value: stats.activeDays },
                { label: labels.stats?.longest ?? 'Longest streak', value: stats.longest },
                { label: labels.stats?.current ?? 'Current streak', value: stats.current },
              ].map((item) => (
                <div key={item.label}>
                  <p className="font-display text-xl font-bold text-white">{item.value}</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="hidden items-center gap-1.5 font-mono text-[10px] text-slate-500 sm:flex">
              {labels.less ?? 'Less'}
              {LEVEL_COLORS.map((color) => (
                <span key={color} className="h-[10px] w-[10px] rounded-[2px]" style={{ background: color }} />
              ))}
              {labels.more ?? 'More'}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
