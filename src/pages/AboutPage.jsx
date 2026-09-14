import GitHubHeatmap from '../components/GitHubHeatmap'
import PageHead from '../components/PageHead'
import PageFoot from '../components/PageFoot'
import { githubProfileUrl, profile } from '../data/profile'

/* 关于 · 卷外
   手卷上放的是摘要，这一页是完整的那一份：自述全文、技术栈、近况、指标、经历。
   正文数据全在 profile.js —— 首页「叁 · 自述」与本页读的是同一份，不重抄。
   GitHub 数据块也挂在这里：热力图要够宽才读得清，卷上放不下。 */
const USERNAME = githubProfileUrl.split('/').pop()

export default function AboutPage() {
  return (
    <section className="page">
      <div className="wrap">
        <a className="backlink" href="#/">
          <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
          回卷首
        </a>

        <div className="page-head">
          <PageHead
            num="外"
            name="关于"
            latin="About"
            title="把审美当作工程约束"
            sub={profile.tagline}
          />
        </div>

        <div className="about-grid">
          <div className="about-body rv">
            {profile.about.map((paragraph, i) => (
              <p className={i === 0 ? 'dropcap' : undefined} key={paragraph.slice(0, 12)}>{paragraph}</p>
            ))}
            <p>
              {profile.school} · {profile.location}。
              <span className="seal-slot" style={{ '--w': '19px', verticalAlign: '-4px', marginLeft: '9px', '--tilt': '-1.6deg' }} data-seal="幻影|1|1|bai" aria-hidden="true"></span>
            </p>
          </div>

          <div className="rv" style={{ '--d': '100' }}>
            <h3 className="label" style={{ marginBottom: '18px' }}>技术栈</h3>
            <ul className="skill-list">
              {profile.skills.map(([name, note]) => (
                <li key={name}>{name} <span>{note}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <GitHubHeatmap username={USERNAME} year={new Date().getFullYear()} />

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

        <div className="timeline rv">
          {profile.experience.map((e) => (
            <div className="tl-item" key={e.period}>
              <div className="tl-period">{e.period}</div>
              <div>
                <div className="tl-role">{e.role}</div>
                <p className="tl-desc">{e.company}。{e.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="proj-links rv">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={githubProfileUrl} target="_blank" rel="noreferrer">GitHub @{USERNAME}</a>
          <a href="#/projects">全部作品
            <svg viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
          </a>
          <a href="#/blog">全部手记
            <svg viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
          </a>
        </div>

        <PageFoot
          num="外"
          name="关于"
          note="以上是卷外的那一份。卷上的「叁 · 自述」只放了摘要，全文都在这里了。"
        />
      </div>
    </section>
  )
}
