import { useEffect, useMemo, useRef, useState } from 'react'
import { profile } from '../data/profile'
import PageHead from '../components/PageHead'
import PageFoot from '../components/PageFoot'

/* 手记 · 目录
   标签签条 + 一条搜索线；按 / 聚焦搜索（和多数站点一致的习惯）。
   条目沿用首页手记的 .post 行版式，中栏多一句摘要。 */
const ALL = '全部'

const day = (d) => (d || '').replace(/-/g, '.')

export default function BlogList() {
  const posts = profile.posts

  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState(ALL)
  const inputRef = useRef(null)

  const tagPool = useMemo(() => {
    const set = new Set()
    posts.forEach((p) => p.tags.forEach((t) => set.add(t)))
    return [...set]
  }, [posts])

  const q = query.trim().toLowerCase()
  const filtered = posts.filter((post) => {
    const tagOk = activeTag === ALL || post.tags.includes(activeTag)
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

  return (
    <section className="page">
      <div className="wrap">
        <a className="backlink" href="#/">
          <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
          回卷首
        </a>

        <div className="page-head">
          <PageHead
            num="肆"
            name="手记"
            latin="Writing"
            title={filtered.length === posts.length ? `全部${posts.length}篇` : `${filtered.length}篇`}
            sub="存储、性能，以及一些与代码无关的书。"
          />
        </div>

        <div className="chips rv">
          {[ALL, ...tagPool].map((chip) => (
            <button
              type="button"
              className="chip"
              key={chip}
              aria-pressed={activeTag === chip}
              onClick={() => setActiveTag(chip)}
            >
              {chip}
            </button>
          ))}
          <div className="search">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜题目、摘要、标签"
              spellCheck="false"
              aria-label="搜索手记"
            />
            <kbd>/</kbd>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="small" style={{ marginTop: 'clamp(34px,5vh,56px)' }}>
            没有匹配的篇目。
            <button
              type="button"
              className="chip"
              style={{ marginLeft: '12px' }}
              onClick={() => { setQuery(''); setActiveTag(ALL) }}
            >
              清除条件
            </button>
          </p>
        ) : (
          <div className="posts" style={{ marginTop: 'clamp(30px,4.6vh,50px)' }}>
            {filtered.map((post) => (
              <a className="post" href={`#/blog/${post.slug}`} key={post.slug}>
                <span className="post-date">{day(post.date)}</span>
                <span className="post-mid">
                  <span className="post-title">{post.title}</span>
                  <span className="post-sum">{post.summary}</span>
                </span>
                <span className="post-tags">
                  {post.tags.join(' · ')}
                  <em> · {post.readTime} 分钟</em>
                </span>
              </a>
            ))}
          </div>
        )}

        <PageFoot
          num="肆"
          name="手记"
          note={`本卷共 ${posts.length} 篇。写存储与性能，也写几本与代码无关的书 —— 长的那几篇挂了篇内目次，可以挑着读。`}
        />
      </div>
    </section>
  )
}
