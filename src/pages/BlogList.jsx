import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { profile } from '../data/profile'
import { ArrowRightIcon } from '../components/Icons'
import FadeIn from '../components/FadeIn'
import SectionHeader from '../components/SectionHeader'
import Magnetic from '../components/Magnetic'

const POST_GRADIENTS = [
  ['#22d3ee', '#818cf8'],
  ['#e879f9', '#f97316'],
  ['#34d399', '#22d3ee'],
  ['#f472b6', '#818cf8'],
]

function SearchIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.5" y2="16.5" />
    </svg>
  )
}

export default function BlogList() {
  const { lang } = useLang()
  const s = ui[lang].sec.blog
  const bl = ui[lang].blist
  const posts = profile[lang].posts

  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(bl.all)
  const inputRef = useRef(null)

  const tagPool = useMemo(() => {
    const set = new Set()
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)))
    return [...set]
  }, [posts])

  const q = query.trim().toLowerCase()
  const filtered = posts.filter((post) => {
    const tagOk = activeTag === bl.all || post.tags.includes(activeTag)
    const text = `${post.title} ${post.summary} ${post.tags.join(' ')}`.toLowerCase()
    return tagOk && (!q || text.includes(q))
  })

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement) && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const chips = [bl.all, ...tagPool]
  const monthsEn = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']
  const pristine = q === '' && activeTag === bl.all

  return (
    <section className="relative mx-auto max-w-4xl px-6 pb-24 pt-32">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 z-0 select-none font-display text-[9rem] font-bold leading-none text-white/[0.03] md:text-[14rem]"
      >
        {s.index}
      </span>

      <div className="relative z-10">
        <SectionHeader index={s.index} eyebrow={bl.eyebrow} title={bl.title} />
      </div>

      <FadeIn className="relative z-10 mb-10 flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {chips.map((chip) => (
            <Magnetic key={chip} strength={0.25}>
              <button
                type="button"
                onClick={() => setActiveTag(chip)}
                data-cursor-label="FILTER"
                className={`rounded-full border px-4 py-1.5 font-mono text-xs transition-all ${
                  activeTag === chip
                    ? 'border-neon-cyan/60 bg-neon-cyan/15 text-white shadow-[0_0_16px_rgba(34,211,238,0.35)]'
                    : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-neon-cyan/40 hover:text-white'
                }`}
              >
                {chip}
              </button>
            </Magnetic>
          ))}

          <div className="glass relative ml-auto w-full max-w-xs rounded-lg">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={bl.search}
              spellCheck="false"
              aria-label={bl.search}
              className="w-full border-none bg-transparent py-2.5 pl-9 pr-14 font-mono text-sm text-slate-100 caret-cyan-400 outline-none placeholder:text-slate-600"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
              /
            </kbd>
          </div>
        </div>

        <p className="font-mono text-xs text-slate-500">
          {filtered.length} / {posts.length} · {bl.pressSlash}
        </p>
      </FadeIn>

      {pristine && filtered[0] && (
        <FadeIn className="relative z-10 mb-6">
          <a
            href={`#/blog/${filtered[0].slug}`}
            data-cursor-label="READ"
            className="group relative block overflow-hidden rounded-2xl border border-white/10"
          >
            <div
              className="relative h-52 md:h-64"
              style={{
                background: `linear-gradient(135deg, ${POST_GRADIENTS[0][0]}, ${POST_GRADIENTS[0][1]})`,
              }}
            >
              <div className="absolute inset-0 bg-night/55 transition-opacity duration-300 group-hover:opacity-30" />
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <span className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur-sm">
                  ★ Featured · {filtered[0].tags.join(' / ')}
                </span>
                <h3 className="text-2xl font-bold text-white md:text-3xl">{filtered[0].title}</h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-200/80">
                  {filtered[0].summary}
                </p>
              </div>
            </div>
          </a>
        </FadeIn>
      )}

      {filtered.length === 0 ? (
        <FadeIn className="py-20 text-center">
          <p className="font-mono text-sm text-slate-500">{bl.empty}</p>
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setActiveTag(bl.all)
            }}
            className="mt-6 rounded-lg border border-neon-cyan/40 px-5 py-2 font-mono text-xs text-neon-cyan transition-colors hover:bg-neon-cyan/10"
          >
            {bl.clear}
          </button>
        </FadeIn>
      ) : (
        <div className="relative z-10 space-y-4">
          {filtered.slice(pristine ? 1 : 0).map((post, i) => {
            const gradient = POST_GRADIENTS[posts.indexOf(post) % POST_GRADIENTS.length]
            const [y, m, d] = post.date.split('-')
            const monthLabel = lang === 'zh' ? `${Number(m)} 月` : monthsEn[Number(m) - 1]
            return (
              <FadeIn key={post.slug} delay={i * 0.06}>
                <motion.a
                  href={`#/blog/${post.slug}`}
                  data-cursor-label="READ"
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="group glass flex gap-6 overflow-hidden rounded-xl p-5 transition-colors hover:border-neon-cyan/30"
                >
                  <div className="relative hidden w-16 shrink-0 flex-col items-center justify-center sm:flex">
                    <span className="font-display text-3xl font-bold text-white">{Number(d)}</span>
                    <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      {monthLabel} '{y.slice(2)}
                    </span>
                    <span
                      className="absolute left-0 top-1 h-[calc(100%-8px)] w-1 rounded-full"
                      style={{ background: `linear-gradient(180deg, ${gradient[0]}, ${gradient[1]})` }}
                    />
                  </div>

                  <div className="hidden w-px self-stretch bg-gradient-to-b from-transparent via-white/15 to-transparent sm:block" />

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-100 transition-colors group-hover:text-neon-cyan md:text-xl">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">{post.summary}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <time className="font-mono text-xs text-slate-500">{post.date}</time>
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-xs text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                      <span className="ml-auto inline-flex items-center gap-2 font-mono text-xs text-slate-500">
                        {post.readTime} {ui[lang].post.read}
                        <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:text-neon-cyan" />
                      </span>
                    </div>
                  </div>
                </motion.a>
              </FadeIn>
            )
          })}
        </div>
      )}
    </section>
  )
}
