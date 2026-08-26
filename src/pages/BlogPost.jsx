import { useLang } from '../i18n/use-lang'
import { ui } from '../i18n/ui'
import { goSection } from '../hooks/useHashRoute'

function Block({ block }) {
  switch (block.t) {
    case 'h2':
      return <h2 className="mt-12 text-xl font-bold text-white md:text-2xl">{block.text}</h2>
    case 'quote':
      return (
        <blockquote className="border-l-2 border-neon-violet/60 pl-5 italic leading-8 text-slate-400">
          {block.text}
        </blockquote>
      )
    case 'code':
      return (
        <pre className="glass overflow-x-auto rounded-xl p-5 font-mono text-sm leading-6 text-slate-300">
          <code>{block.text}</code>
        </pre>
      )
    case 'list':
      return (
        <ul className="list-disc space-y-2 pl-6 leading-8 text-slate-400 marker:text-neon-violet">
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )
    default:
      return <p className="leading-8 text-slate-400">{block.text}</p>
  }
}

export default function BlogPost({ post, index, posts }) {
  const { lang } = useLang()
  const t = ui[lang].post

  const newer = index > 0 ? posts[index - 1] : null
  const older = index < posts.length - 1 ? posts[index + 1] : null

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-32">
      <button
        type="button"
        onClick={() => goSection('blog')}
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
        </div>
        <h1 className="mt-6 text-3xl font-bold leading-tight text-white md:text-5xl">{post.title}</h1>
      </header>

      <div className="mt-12 space-y-6">
        {post.content.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>

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
