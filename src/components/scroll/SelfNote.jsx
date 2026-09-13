import { profile } from '../../data/profile'

/* 叁 · 自述
   正文 / 技术栈 / 近况 / 数字 / 学历 全部来自 profile —— 与子页面的「关于」同一份。
   数字用 data-count 触发一次滚动计数（count.js 接管），前后缀（如 <）留在标记里。 */
export default function SelfNote() {
  return (
    <>
      <section id="about">
        <div className="wrap">
          <div className="sec-head rv">
            <div className="slip"><span className="slip-num">叁</span><span className="slip-line"></span><span className="slip-name">自述</span></div>
            <div className="sec-title-wrap">
              <span className="label">About</span>
              <h2 className="d-l"><span className="mask"><span className="ch" style={{ '--i': "0" }}>把审美当作工程约束</span></span></h2>
            </div>
          </div>

          <div className="about-grid">
            <div className="about-body rv">
              {profile.about.map((paragraph, i) => (
                <p className={i === 0 ? 'dropcap' : undefined} key={paragraph.slice(0, 12)}>{paragraph}</p>
              ))}
            </div>

            <div className="rv" style={{ '--d': "100" }}>
              <h3 className="label" style={{ marginBottom: "18px" }}>技术栈</h3>
              <ul className="skill-list">
                {profile.skills.map(([name, note]) => (
                  <li key={name}>{name} <span>{note}</span></li>
                ))}
              </ul>
            </div>
          </div>

          {/* 近况：手卷上的小字注 */}
          <div className="now rv">
            <h3 className="label">近况 · Now</h3>
            <ul className="now-list">
              {profile.now.map(([k, text]) => (
                <li key={k}>
                  <span className="now-k">{k}</span>
                  <p>{text}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="figures rv">
            {profile.figures.map((f) => (
              <div className="figure" key={f.label}>
                <b className="tnum">
                  {f.prefix || null}<span data-count={f.value}>0</span><i>{f.unit}</i>
                </b>
                <span>{f.label}</span>
              </div>
            ))}
          </div>

          <p className="fig-note rv">
            <b>指标口径</b>　数字出自 GojiDB 自带的 YCSB 基准与百万 KV 载入测试，
            脚本与原始输出随仓库 <code>bench/</code> 一并提供，可自行复现。
          </p>

          {/* 手卷上只留摘要：完整的那一份（经历、GitHub 提交）在卷外的「关于」页 */}
          <a className="backlink rv" href="#/about" style={{ marginTop: 'clamp(24px,3.6vh,38px)', marginBottom: 0 }}>
            完整的一份 · 关于
            <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
          </a>
        </div>
      </section>
    </>
  )
}
