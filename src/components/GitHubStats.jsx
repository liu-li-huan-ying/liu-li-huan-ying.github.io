import { useEffect, useState } from 'react'
import { ForkIcon, StarIcon } from './Icons'

/* 仓库的星标 / fork / 主语言
   走 api.github.com，按 sessionStorage 缓存一层（同一次访问里不重复请求）。
   拿不到就整块不显示 —— 一个「加载失败」的占位比没有更难看。 */
export default function GitHubStats({ repo }) {
  const [stats, setStats] = useState(() => {
    try {
      const cached = sessionStorage.getItem(`gh-repo:${repo}`)
      if (cached) return JSON.parse(cached)
    } catch (err) {
      void err
    }
    return null
  })
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (stats) return undefined

    let cancelled = false
    const controller = new AbortController()
    /* 延后一点再发：列表页会同时挂好几个，等首屏稳下来，免得和关键资源抢带宽 */
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`, {
          signal: controller.signal,
          headers: { Accept: 'application/vnd.github+json' },
        })
        if (!res.ok) throw new Error('rate limited or not found')
        const json = await res.json()
        const data = {
          stars: json.stargazers_count ?? 0,
          forks: json.forks_count ?? 0,
          language: json.language ?? '',
        }
        if (cancelled) return
        try {
          sessionStorage.setItem(`gh-repo:${repo}`, JSON.stringify(data))
        } catch (err) {
          void err
        }
        setStats(data)
      } catch {
        if (!cancelled) setFailed(true)
      }
    }, 1500)

    return () => {
      cancelled = true
      clearTimeout(timeout)
      controller.abort()
    }
  }, [repo, stats])

  if (!stats) {
    if (failed) return null
    return (
      <div className="gh-skel" aria-hidden="true">
        <i /><i />
      </div>
    )
  }

  return (
    <div className="gh-inline">
      <span className="star"><StarIcon /> {stats.stars}</span>
      <span><ForkIcon /> {stats.forks}</span>
      {stats.language ? <span>{stats.language}</span> : null}
    </div>
  )
}
