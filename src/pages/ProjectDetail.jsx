import { profile } from '../data/profile'
import { SPECIMENS } from '../components/scroll/specimens'
import PageFoot from '../components/PageFoot'
import GitHubStats from '../components/GitHubStats'
import { ExternalIcon, GitHubIcon } from '../components/Icons'
import { repoSlug } from '../utils/github'

/* 作品 · 详情
   承首页「贰 · 作品」那一条的写法：先说是什么，再说丢掉了什么。
   视觉用解剖图（这东西怎么跑的），没有解剖图的才退回配图。
   正文与要点用 .prose / .hl-list —— 与手记正文同一套版式，读起来是一本书。 */
const NUM = ['一', '二', '三', '四', '五', '六', '七', '八']

export default function ProjectDetail({ project }) {
  const p = project
  const all = profile.projects
  const i = all.indexOf(p)
  const prev = i > 0 ? all[i - 1] : null
  const next = i < all.length - 1 ? all[i + 1] : null
  const slug = repoSlug(p.github || '')
  const body = p.detail && p.detail.body ? p.detail.body : []
  const highlights = p.detail && p.detail.highlights ? p.detail.highlights : []

  return (
    <article className="page">
      <div className="wrap">
        <div className="article article-wide">
          <a className="backlink" href="#/projects">
            <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
            全部作品
          </a>

          <div className="article-head">
            <div className="article-meta">
              <span>{NUM[i]}</span>
              <span>{p.kind}</span>
              <span>{p.role}</span>
              <span>{p.year}</span>
            </div>
            <h1 className="article-title">
              {p.title}
              {p.latin ? <span className="lat" style={{ fontSize: '.56em', color: 'var(--ink-3)' }}> {p.latin}</span> : null}
            </h1>
            <p className="lead" style={{ marginTop: '20px' }}>{p.desc}</p>

            {slug ? <div className="row-stats"><GitHubStats repo={slug} /></div> : null}

            <div className="tags">
              {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
            </div>
          </div>

          <div className="art-rule" aria-hidden="true"><span className="phead-fish"></span></div>

          {/* 解剖图与「取舍 / 要点」并置：图占左，批注占右 ——
              原先图只铺到一半宽，右半边空着，重心全歪在左侧 */}
          <div className="detail-pair">
            <div className="specimen">
              {SPECIMENS[p.specimen] ? (
                SPECIMENS[p.specimen]
              ) : p.image ? (
                <>
                  <div className="sp-bar"><i></i><i></i><i></i><span>{p.id} — {p.year}</span></div>
                  <span className="sp-blank">{p.title}</span>
                  <img className="sp-img" src={p.image} alt={`${p.title} 配图`} decoding="async"
                    onError={(e) => { e.currentTarget.style.display = 'none' }} />
                </>
              ) : (
                <>
                  <div className="sp-bar"><i></i><i></i><i></i><span>{p.id} — {p.year}</span></div>
                  <span className="sp-blank">{p.title}</span>
                </>
              )}
            </div>

            <div className="detail-side">
              {p.tradeoff ? (
                <div className="tradeoff">
                  <b>取舍</b>
                  <p>{p.tradeoff}</p>
                </div>
              ) : null}

              {highlights.length > 0 ? (
                <>
                  <h2 className="d-m">要点</h2>
                  <ul className="hl-list">
                    {highlights.map((h) => <li key={h}>{h}</li>)}
                  </ul>
                </>
              ) : null}
            </div>
          </div>

          {body.length > 0 ? (
            <div className="prose" style={{ marginTop: 'clamp(34px,5vh,58px)' }}>
              {body.map((para) => <p key={para}>{para}</p>)}
            </div>
          ) : null}

          <div className="proj-links">
            {p.github ? <a href={p.github} target="_blank" rel="noreferrer"><GitHubIcon /> 源码仓库</a> : null}
            {p.live ? <a href={p.live} target="_blank" rel="noreferrer"><ExternalIcon /> 在线演示</a> : null}
            <a href="#contact">聊聊这个项目
              <svg viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
            </a>
          </div>

          <nav className="pager">
            {prev ? (
              <a href={`#/projects/${prev.id}`}>
                <small>上一件</small>
                {prev.title}
              </a>
            ) : <span />}
            {next ? (
              <a className="next" href={`#/projects/${next.id}`}>
                <small>下一件</small>
                {next.title}
              </a>
            ) : <span />}
          </nav>

          <PageFoot
            num={NUM[i]}
            name={p.title}
            note={`${p.role} · ${p.year} · ${p.kind}。`}
          />
        </div>
      </div>
    </article>
  )
}
