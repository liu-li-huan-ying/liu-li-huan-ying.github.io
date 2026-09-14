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

  /* 「当前连续」不能从数组末尾往回数：接口给的是**整年**（含未来日期），
     未来那几天 count 恒为 0，从末条 12-31 起数第一格就断，永远得 0 ——
     图上明明连着好几天，底下却写「0 天」。
     先去到今天，再从今天往回数；今天还没提交不算断（这一天没过完），
     从昨天接着算，与 GitHub 自己的口径一致。 */
  const now = new Date()
  const todayKey = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')
  let i = contributions.length - 1
  while (i >= 0 && contributions[i].date > todayKey) i -= 1
  if (i >= 0 && contributions[i].date === todayKey && contributions[i].count === 0) i -= 1
  let current = 0
  while (i >= 0 && contributions[i].count > 0) {
    current += 1
    i -= 1
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

  /* 月份标签按「第几周」落进等宽的槽里（与格子列一一对应，随屏宽一起收放）。
     窄屏槽窄到「10月11月」会挤在一起，这时改成隔月标一个。 */
  const [coarse, setCoarse] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 600px)')
    const on = () => setCoarse(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const monthByCol = useMemo(() => new Map(monthMarks.map((m) => [m.col, m.month])), [monthMarks])

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
        <div className="gh-frame">
          <div className="gh-bar">
            <i></i><i></i><i></i>
            <span className="gh-bar-name">提交录</span>
            <span className="gh-bar-gz">岁次 <span data-gz>丙午</span></span>
          </div>
          <div className="gh-inner">
          <div className="gh-months" aria-hidden="true">
            {/* 空格占位 = 左侧星期栏；其余 53 个槽与下面的 53 列等宽对齐，
                格距一改、屏宽一变，标签自动跟着走，不再写死像素 */}
            <span className="gh-mspace" />
            {[...Array(53)].map((_, wi) => {
              const m = monthByCol.get(wi)
              const label = m && (!coarse || m % 2 === 1) ? MONTHS[m - 1] : ''
              return <span className="gh-mcol" key={wi}>{label}</span>
            })}
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
                      <i key={j} className="gh-cell lv0" />
                    ))}
                  </div>
                ))}
          </div>
          </div>
        </div>
      </div>

      <div className="gh-legend">
        疏
        <i className="gh-cell lv0" /><i className="gh-cell lv1" /><i className="gh-cell lv2" />
        <i className="gh-cell lv3" /><i className="gh-cell lv4" />
        密
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
