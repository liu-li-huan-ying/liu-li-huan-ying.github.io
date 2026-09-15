import { profile } from '../../data/profile'
import { SPECIMENS } from './specimens'

/* 贰 · 作品
   每条来自 profile.projects —— 只在有解剖图（specimen）的项目上露面，
   序号、左右交替、取舍块都按顺序自动排，加项目不用动这里。
   解剖图本体在 specimens.jsx。
   文案里的「取舍」是这一卷的重点：技术栈谁都会列，选择丢掉了什么才是自己的。 */
const NUM = ['一', '二', '三', '四', '五', '六', '七', '八']

const featured = profile.projects.filter((p) => p.specimen && SPECIMENS[p.specimen])

export default function Works() {
  return (
    <>
      <section id="work">
        <div className="wrap">
          <div className="sec-head rv">
            <div className="slip"><span className="slip-num">贰</span><span className="slip-line"></span><span className="slip-name">作品</span></div>
            <div className="sec-title-wrap">
              <span className="label">Selected Work</span>
              <h2 className="d-l"><span className="mask"><span className="ch" style={{ '--i': "0" }}>{NUM[featured.length - 1]}件自己会用的东西</span></span></h2>
            </div>
          </div>

          {featured.map((p, i) => (
            <article className={'work rv' + (i % 2 ? ' flip' : '')} key={p.id}>
              <div className="work-info">
                <div className="work-top">
                  <span className="work-num">{NUM[i]}</span>
                  <h3 className="work-title">
                    {p.title}
                    {p.latin ? (
                      <span className="lat" style={{ fontSize: ".58em", color: "var(--ink-3)" }}> {p.latin}</span>
                    ) : null}
                  </h3>
                </div>
                <p className="work-role">{p.role} · {p.year} · {p.kind}</p>
                <p className="work-desc">{p.desc}</p>
                <div className="tradeoff">
                  <b>取舍</b>
                  <p>{p.tradeoff}</p>
                </div>
                <div className="tags">
                  {p.tags.map((t) => <span className="tag" key={t}>{t}</span>)}
                </div>
              </div>

              <div className="work-visual">
                <div className="specimen">{SPECIMENS[p.specimen]}</div>
              </div>
            </article>
          ))}

          {/* 卷上排不下全部：件数多于此处的都收在作品目录里 */}
          {profile.projects.length > featured.length ? (
            <a className="backlink" href="#/projects" style={{ marginTop: 'clamp(26px,3.8vh,42px)', marginBottom: 0 }}>
              全部 {profile.projects.length} 件作品
              <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
            </a>
          ) : null}
        </div>
      </section>
    </>
  )
}
