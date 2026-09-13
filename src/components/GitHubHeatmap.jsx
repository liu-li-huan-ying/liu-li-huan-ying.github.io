import { useEffect, useMemo, useState } from 'react'

/* GitHub 贡献热力图
   数据来自 github-contributions-api（CSP 里已放行）。
   格子用青瓷的深浅表示当天提交量 —— 不引第二种彩色，纸墨两套地色都自洽。
   横轴按周分列，左侧标一/三/五，上方标月份。拿不到数据就整块不显示。 */
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
const WEEKDAY_SET = new Set([1, 3, 5])
const WEEKDAY_LABEL = ['', '一', '', '三', '', '五', '']

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

export default function GitHubHeatmap({ username, year = new Date().getFullYear() }) {
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
    <div className="gh rv">
      <div className="sec-title-wrap">
        <span className="label">GitHub</span>
        <h3 className="d-m">这一年提交了多少</h3>
        <p className="lead sec-sub">
          {stats ? <>共 {stats.total} 次提交。</> : <>读一下今年的提交记录……</>}
        </p>
      </div>

      <div className="gh-heat">
        <div className="gh-inner">
          <div className="gh-months">
            {/* 起点 = 星期栏宽度(16) + 间距(6)；每列 11 + 3 */}
            {monthMarks.map(({ month, col }) => (
              <span key={month} style={{ left: `${22 + col * 14}px` }}>{MONTHS[month - 1]}</span>
            ))}
          </div>
          <div className="gh-grid">
            <div className="gh-weekdays">
              {[...Array(7)].map((_, i) => (
                <span key={i}>{WEEKDAY_SET.has(i) ? WEEKDAY_LABEL[i] : ''}</span>
              ))}
            </div>
            {weeks.length
              ? weeks.map((week, wi) => (
                  <div className="gh-col" key={wi}>
                    {week.map((cell, di) =>
                      cell ? (
                        <i
                          key={cell.date}
                          className={`gh-cell lv${cell.level}`}
                          title={`${cell.count} 次提交 · ${cell.date}`}
                        />
                      ) : (
                        <i key={`pad-${wi}-${di}`} className="gh-cell lv0 blank" />
                      )
                    )}
                  </div>
                ))
              : [...Array(53)].map((_, i) => (
                  <div className="gh-col" key={i}>
                    {[...Array(7)].map((__, j) => (
                      <i
                        key={j}
                        className="gh-cell lv0"
                        style={{ animationDelay: `${((i * 7 + j) % 20) * 60}ms` }}
                      />
                    ))}
                  </div>
                ))}
          </div>
        </div>
      </div>

      <div className="gh-legend">
        少
        <i className="gh-cell lv0" /><i className="gh-cell lv1" /><i className="gh-cell lv2" />
        <i className="gh-cell lv3" /><i className="gh-cell lv4" />
        多
      </div>

      {stats ? (
        <div className="gh-stats" style={{ marginTop: 'clamp(22px,3.4vh,32px)' }}>
          {[
            ['今年提交', stats.total],
            ['有提交的天数', stats.activeDays],
            ['最长连续', stats.longest],
            ['当前连续', stats.current],
          ].map(([label, value]) => (
            <div className="gh-stat" key={label}>
              <b className="tnum">{value}</b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
