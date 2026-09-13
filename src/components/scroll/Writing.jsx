import { profile } from '../../data/profile'

/* 肆 · 手记
   条目来自 profile.posts（content/posts 里的 .md），按日期倒序取前五篇；
   每一条都真跳到 #/blog/<slug>，不再是点了没反应的空锚点。
   全部手记的入口在末尾。 */
const LATEST = 5

const day = (d) => (d || '').replace(/-/g, '.')

export default function Writing() {
  const posts = profile.posts.slice(0, LATEST)

  return (
    <>
      <section id="writing">
        <div className="wrap">
          <div className="sec-head rv">
            <div className="slip"><span className="slip-num">肆</span><span className="slip-line"></span><span className="slip-name">手记</span></div>
            <div className="sec-title-wrap">
              <span className="label">Writing</span>
              <h2 className="d-l"><span className="mask"><span className="ch" style={{ '--i': "0" }}>想清楚才写得出来</span></span></h2>
              <p className="lead sec-sub">
                存储、性能、以及一些与代码无关的书。写下来才算真的想清楚了。
              </p>
            </div>
          </div>

          <div className="posts rv">
            {posts.map((p) => (
              <a className="post" href={`#/blog/${p.slug}`} key={p.slug}>
                <span className="post-date">{day(p.date)}</span>
                <span className="post-title">{p.title}</span>
                <span className="post-tags">{p.tags[0] || '手记'}</span>
              </a>
            ))}
          </div>

          {profile.posts.length > LATEST ? (
            <a className="backlink" href="#/blog" style={{ marginTop: 'clamp(22px,3.4vh,34px)', marginBottom: 0 }}>
              全部 {profile.posts.length} 篇手记
              <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
            </a>
          ) : null}
        </div>
      </section>
    </>
  )
}
