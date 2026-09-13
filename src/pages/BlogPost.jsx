import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'
import { renderMarkdown } from '../data/mdPosts'

/* 手记 · 正文
   正文是 markdown（content/posts/*.md），marked 渲染 + DOMPurify 消毒，
   代码高亮按需加载（只带 go / bash / js / xml 四种，够了就不加）。
   宽屏右侧挂篇内目次，滚到哪一节哪一节亮。
   篇内锚点自己接管：改 hash 会让路由以为要换页，所以只滚不动 hash。 */
const day = (d) => (d || '').replace(/-/g, '.')

export default function BlogPost({ post }) {
  const bodyRef = useRef(null)
  const [html, setHtml] = useState('')
  const [toc, setToc] = useState([])
  const [activeId, setActiveId] = useState('')

  const index = profile.posts.findIndex((p) => p.slug === post.slug)
  const newer = index > 0 ? profile.posts[index - 1] : null
  const older = index >= 0 && index < profile.posts.length - 1 ? profile.posts[index + 1] : null

  useEffect(() => {
    let cancelled = false
    renderMarkdown(post.markdown).then((rendered) => {
      if (!cancelled) setHtml(rendered)
    })
    return () => {
      cancelled = true
    }
  }, [post])

  useEffect(() => {
    if (!html) return undefined
    const container = bodyRef.current
    if (!container) return undefined

    const headings = [...container.querySelectorAll('h2, h3')]
    headings.forEach((heading, i) => {
      heading.id = `sec-${i}`
    })
    setToc(headings.map((h) => ({ id: h.id, text: h.textContent, level: h.tagName.toLowerCase() })))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-96px 0px -60% 0px' }
    )
    headings.forEach((h) => observer.observe(h))

    let cancelled = false
    async function highlight() {
      try {
        /* 语言模块是 ESM，函数在 default 上 —— 拿到的是命名空间对象，
           不能直接塞给 registerLanguage（那样只会得到一句「不是函数」） */
        const [{ default: hljs }, ...langs] = await Promise.all([
          import('highlight.js/lib/core'),
          import('highlight.js/lib/languages/go'),
          import('highlight.js/lib/languages/bash'),
          import('highlight.js/lib/languages/javascript'),
          import('highlight.js/lib/languages/xml'),
        ])
        if (cancelled) return
        const names = ['go', 'bash', 'javascript', 'xml']
        langs.forEach((mod, i) => {
          const def = typeof mod === 'function' ? mod : mod.default
          if (typeof def === 'function') hljs.registerLanguage(names[i], def)
        })
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
      observer.disconnect()
    }
  }, [html])

  return (
    <section className="page">
      <div className="wrap">
        <div className="article-cols">
          <article className="article">
            <a className="backlink" href="#/blog">
              <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
              全部手记
            </a>

            {/* 用 div 不用 header：样式表里的 header 是固定顶栏（position:fixed），
                正文里套一个 <header> 会被它按顶栏处理，标题直接飞到视口顶端 */}
            <div className="article-head">
              <div className="article-meta">
                <time dateTime={post.date}>{day(post.date)}</time>
                <span>·</span>
                <span>{post.readTime} 分钟</span>
                {post.tags.length ? <span>·</span> : null}
                {post.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <h1 className="article-title">{post.title}</h1>
            </div>

            <div ref={bodyRef} className="prose" dangerouslySetInnerHTML={{ __html: html }} />

            <nav className="pager" aria-label="上下篇">
              {older ? (
                <a href={`#/blog/${older.slug}`}>
                  <small>早一些</small>
                  {older.title}
                </a>
              ) : (
                <span />
              )}
              {newer ? (
                <a className="next" href={`#/blog/${newer.slug}`}>
                  <small>晚一些</small>
                  {newer.title}
                </a>
              ) : (
                <span />
              )}
            </nav>
          </article>

          {toc.length > 0 && (
            <aside className="sidenote">
              <nav aria-label="篇内目次">
                {toc.map((item) => (
                  <a
                    key={item.id}
                    className={item.level === 'h3' ? 'h3' : undefined}
                    href={`#${item.id}`}
                    aria-current={activeId === item.id ? 'true' : undefined}
                    onClick={(e) => {
                      /* 只滚，不改 hash —— 改了路由就以为要换页 */
                      e.preventDefault()
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }}
                  >
                    {item.text}
                  </a>
                ))}
              </nav>
            </aside>
          )}
        </div>
      </div>
    </section>
  )
}
