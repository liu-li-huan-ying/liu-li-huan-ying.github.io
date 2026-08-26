import { useEffect, useRef } from 'react'
import 'highlight.js/styles/github-dark.css'
import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { navigate } from '../hooks/useHashRoute'

export default function BlogPost({ post, index, posts }) {
  const { lang } = useLang()
  const t = ui[lang].post
  const bodyRef = useRef(null)

  useEffect(() => {
    const container = bodyRef.current
    if (!container) return undefined

    let cancelled = false
    async function highlight() {
      try {
        const [{ default: hljs }, go, bash, javascript, xml] = await Promise.all([
          import('highlight.js/lib/core'),
          import('highlight.js/lib/languages/go'),
          import('highlight.js/lib/languages/bash'),
          import('highlight.js/lib/languages/javascript'),
          import('highlight.js/lib/languages/xml'),
        ])
        if (cancelled) return
        hljs.registerLanguage('go', go)
        hljs.registerLanguage('bash', bash)
        hljs.registerLanguage('javascript', javascript)
        hljs.registerLanguage('xml', xml)
        container.querySelectorAll('pre code:not([data-hl])').forEach((code) => {
          hljs.highlightElement(code)
          code.dataset.hl = '1'
        })
      } catch (err) {
        void err
      }
    }

    highlight()
    return () => {
      cancelled = true
    }
  }, [post.html])

  const newer = index > 0 ? posts[index - 1] : null
  const older = index < posts.length - 1 ? posts[index + 1] : null

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <button
        type="button"
        onClick={() => navigate('/blog')}
        data-cursor-label="BACK"
        className="font-mono text-sm text-neon-cyan transition-colors hover:text-white"
      >
        ← {t.back}
      </button>

      <header className="mt-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-slate-500">
          <time>{post.date}</time>
          <span>·</span>
          <span>
            {post.readTime} {t.read}
          </span>
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-neon-violet/20 bg-neon-violet/10 px-2.5 py-1 text-neon-violet"
            >
              {tag}
            </span>
          ))}
          {post.originalLang && (
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-amber-300">
              原文 · {post.originalLang}
            </span>
          )}
        </div>
        <h1 className="mt-6 text-3xl font-bold leading-tight text-white md:text-5xl">{post.title}</h1>
      </header>

      <div ref={bodyRef} className="md-body mt-12" dangerouslySetInnerHTML={{ __html: post.html }} />

      <nav className="mt-16 flex items-center justify-between gap-4 border-t border-white/10 pt-8 font-mono text-sm">
        {newer ? (
          <a href={`#/blog/${newer.slug}`} className="text-slate-400 transition-colors hover:text-neon-cyan">
            {t.newer}
          </a>
        ) : (
          <span />
        )}
        {older ? (
          <a href={`#/blog/${older.slug}`} className="text-slate-400 transition-colors hover:text-neon-cyan">
            {t.older}
          </a>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}
