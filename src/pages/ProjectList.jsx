import { useState } from 'react'
import { profile } from '../data/profile'
import { SPECIMENS } from '../components/scroll/specimens'
import PageHead from '../components/PageHead'
import PageFoot from '../components/PageFoot'
import GitHubStats from '../components/GitHubStats'
import { ExternalIcon, GitHubIcon } from '../components/Icons'
import { repoSlug } from '../utils/github'

/* 作品 · 目录
   行版式与首页「贰 · 作品」同一套 .work：左边文字、右边标本框，
   交替左右只是把 .flip 加上。视觉用解剖图 —— 目录里放剖面，
   一眼能认出「这东西怎么跑的」，与首页是同一套语汇。
   profile 里的 cover 图只作兜底（不是界面截图，且有的尺寸大到会拖垮浏览器），
   没有解剖图时才拿它顶。两样都没有就留字，不出现空框。 */
const NUM = ['一', '二', '三', '四', '五', '六', '七', '八']
const ALL = '全部'

export default function ProjectList() {
  const projects = profile.projects

  /* 按「形态」筛，不用技术栈：形态是四个封闭值（桌面端 / 存储引擎 / …），
     技术栈标签会越加越多，做筛选器只会变成一排读不完的签条 */
  const kinds = [...new Set(projects.map((p) => p.kind))]
  const [kind, setKind] = useState(ALL)
  const shown = kind === ALL ? projects : projects.filter((p) => p.kind === kind)

  return (
    <section className="page">
      <div className="wrap">
        <a className="backlink" href="#/">
          <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
          回卷首
        </a>

        <div className="page-head">
          <PageHead
            num="贰"
            name="作品"
            latin="Selected Work"
            title={shown.length === projects.length ? `共 ${projects.length} 件` : `${shown.length} 件`}
            sub="横跨界面、系统、图形三层。"
          />
        </div>

        <div className="chips rv">
          {[ALL, ...kinds].map((k) => (
            <button
              type="button"
              className="chip"
              key={k}
              aria-pressed={kind === k}
              onClick={() => setKind(k)}
            >
              {k}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <p className="small" style={{ marginTop: 'clamp(34px,5vh,56px)' }}>这一类下暂时没有作品。</p>
        ) : (
          shown.map((p) => {
            const slug = repoSlug(p.github || '')
            const i = projects.indexOf(p)

            return (
              <article className={'work rv' + (i % 2 ? ' flip' : '')} key={p.id}>
                <div className="work-info">
                  <div className="work-top">
                    <span className="work-num">{NUM[i]}</span>
                    <h3 className="work-title">
                      <a href={`#/projects/${p.id}`}>
                        {p.title}
                        {p.latin ? <span className="lat" style={{ fontSize: '.58em', color: 'var(--ink-3)' }}> {p.latin}</span> : null}
                      </a>
                    </h3>
                  </div>
                  <p className="work-role">{p.role} · {p.year} · {p.kind}</p>
                  <p className="work-desc">{p.desc}</p>

                  {slug ? <div className="row-stats"><GitHubStats repo={slug} /></div> : null}

                  <div className="tags">
                    {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                  </div>

                  <div className="proj-links">
                    <a href={`#/projects/${p.id}`}>看详情</a>
                    {p.github ? <a href={p.github} target="_blank" rel="noreferrer"><GitHubIcon /> 源码</a> : null}
                    {p.live ? <a href={p.live} target="_blank" rel="noreferrer"><ExternalIcon /> 演示</a> : null}
                  </div>
                </div>

                <div className="work-visual">
                  <a className="specimen" href={`#/projects/${p.id}`} aria-label={`${p.title} 详情`}>
                    {/* 解剖图优先（自带一条 sp-bar）；没有才退回配图；都没有就留字 */}
                    {SPECIMENS[p.specimen] ? (
                      SPECIMENS[p.specimen]
                    ) : p.image ? (
                      <>
                        <div className="sp-bar"><i></i><i></i><i></i><span>{p.id} — {p.year}</span></div>
                        <span className="sp-blank">{p.title}</span>
                        {/* 图挂了就把自己藏掉，露出底下的字，不留一块空框 */}
                        <img
                          className="sp-img"
                          src={p.image}
                          alt={`${p.title} 配图`}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                      </>
                    ) : (
                      <>
                        <div className="sp-bar"><i></i><i></i><i></i><span>{p.id} — {p.year}</span></div>
                        <span className="sp-blank">{p.title}</span>
                      </>
                    )}
                  </a>
                </div>
              </article>
            )
          })
        )}

        <PageFoot
          num="贰"
          name="作品"
          note={`本卷共 ${projects.length} 件，按形态分作 ${kinds.length} 类。每一件都留了源码与演示的入口，点进去是它自己的那一页。`}
        />
      </div>
    </section>
  )
}
