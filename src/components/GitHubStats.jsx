import { useEffect, useState } from 'react'
import { ForkIcon, StarIcon } from './Icons'

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

  useEffect(() => {
    if (stats) return undefined

    let cancelled = false
    const controller = new AbortController()
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
        // silently hide stats when rate limited or offline
      }
    }, 1500)

    return () => {
      cancelled = true
      clearTimeout(timeout)
      controller.abort()
    }
  }, [repo, stats])

  if (!stats) {
    return (
      <div className="flex gap-3 font-mono text-[11px]">
        <div className="h-3.5 w-10 animate-pulse rounded bg-white/5" />
        <div className="h-3.5 w-10 animate-pulse rounded bg-white/5" />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-slate-400">
      <span className="inline-flex items-center gap-1">
        <StarIcon className="h-3.5 w-3.5 text-neon-cyan" />
        {stats.stars}
      </span>
      <span className="inline-flex items-center gap-1">
        <ForkIcon className="h-3.5 w-3.5 text-neon-violet" />
        {stats.forks}
      </span>
      {stats.language && <span className="text-slate-500">{stats.language}</span>}
    </div>
  )
}
