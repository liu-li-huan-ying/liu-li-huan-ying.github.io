import { profile } from '../../data/profile'

/* 引首（首屏）
   粘住的整屏：左侧题名与自述，右侧一块圆形釉面（冰裂由滚动驱动愈合，见 crackle.js），
   底部「裂—合」是愈合进度的刻度。四栏元信息来自 profile。 */
export default function Intro() {
  const making = profile.projects
    .filter((p) => p.specimen)
    .slice(0, 3)
    .map((p) => p.title)
    .join(' · ')

  return (
    <>
      {/* ══════════ 引首 ══════════ */}
      <section className="hero" id="top">
        <div className="hero-sticky">
          <div className="glaze-wash" aria-hidden="true"></div>
          <div className="glaze-panel" id="panel"><canvas id="crackle" aria-hidden="true"></canvas></div>

          <div className="wrap hero-inner">
            <div className="hero-eyebrow rv">
              <span className="dash"></span>
              <span className="label">{profile.location} · 数据科学与大数据技术</span>
            </div>

            <h1 className="hero-title-row rv">
              <span className="hero-name d-xl">
                <span className="mask"><span className="ch" style={{ '--i': "0" }}>琉</span><span className="ch" style={{ '--i': "1" }}>璃</span><span className="ch" style={{ '--i': "2" }}>幻</span><span className="ch" style={{ '--i': "3" }}>影</span></span>
                <span className="mask lat-mask"><span className="ch lat-sub" style={{ '--i': "5" }}>{profile.latinName}</span></span>
              </span>
              <span className="seal-slot" style={{ '--w': "31px", '--tilt': "1.7deg" }} data-seal="引首|1|2|zhu" aria-hidden="true"></span>
            </h1>

            <p className="hero-stmt rv" style={{ '--d': "180" }}>
              我做的多数是自己想用的东西：一个本地优先的写作工具，一个从零写的存储引擎，
              一个受不了年年续订阅、索性自己写的背单词应用。
              它们都由我一个人从界面做到存储。
            </p>

            <dl className="meta rv" style={{ '--d': "280" }}>
              <div>
                <dt className="label">现居</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt className="label">在写</dt>
                <dd>{making}</dd>
              </div>
              <div>
                <dt className="label">状态</dt>
                <dd><span className="status"><span className="dot"></span>{profile.status}</span></dd>
              </div>
              <div>
                <dt className="label">学历</dt>
                <dd>{profile.school} · {profile.experience[0].period.replace(/\s—\s/, '—')}</dd>
              </div>
            </dl>

            <div className="hero-cta rv" style={{ '--d': "360" }}>
              <a className="ulink" href="#work">看作品
                <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
              </a>
              <a className="ulink" href="#contact">写信
                <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
              </a>
            </div>
          </div>

          <div className="heal" id="heal" aria-hidden="true">
            <span className="h-a">裂</span>
            <span className="heal-line"><i id="healFill"></i></span>
            <span className="h-b">合</span>
          </div>

          <div className="heal-cap" id="healCap" aria-live="polite">
            <b>裂过，然后合上。</b>
            <span>玉笺的每一版都是这么来的。</span>
          </div>
        </div>
      </section>

    </>
  )
}
