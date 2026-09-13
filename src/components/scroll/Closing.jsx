import { profile } from '../../data/profile'

/* 伍 · 落款
   邮箱与三个联系方式都来自 profile.socials：
   有 url 的写成链接，只有 enc 的写成可复制按钮 —— 号以 XOR+Base64 密文存在
   data-copy 上，明文不进源码也不进 DOM 文本，点击那一刻才在内存里解（contacts.js）。
   干支年号由 [data-gz] 自动填（seals.js），无脚本时停在丙午。 */
export default function Closing() {
  return (
    <>
      <section id="contact">
        <div className="wrap">
          <div className="sec-head rv">
            <div className="slip"><span className="slip-num">伍</span><span className="slip-line"></span><span className="slip-name">落款</span></div>
            <div className="sec-title-wrap">
              <span className="label">Colophon</span>
              <h2 className="d-l"><span className="mask"><span className="ch" style={{ '--i': "0" }}>有想法就写信</span></span></h2>
              <p className="lead sec-sub">合作、提问，或者只是聊聊某个实现该怎么做——邮件我都会看。</p>
            </div>
          </div>

          <a className="colo-mail rv" href={`mailto:${profile.email}`}>{profile.email}</a>

          <div className="socials rv" style={{ '--d': "80" }}>
            {profile.socials.map((s) =>
              // 复制按钮的 aria-label 必须把可见文本整个包含进去：
              // note（账号）也看得见，漏了它无障碍会判「可访问名不含可见文本」
              s.url ? (
                <a key={s.label} href={s.url} target="_blank" rel="noopener">
                  {s.label} <span>{s.note}</span>
                </a>
              ) : (
                <button key={s.label} type="button" className="copy" data-copy={s.enc} aria-label={`复制${s.label} ${s.note}`}>
                  {s.label} <span>{s.note}</span>
                </button>
              ),
            )}
          </div>

          <div className="sign rv" style={{ '--d': "140" }}>
            <div className="sign-txt">
              <div className="sign-name">{profile.name}</div>
              <div className="sign-date"><span data-gz>丙午</span> · {profile.location}</div>
            </div>
            {/* 一朱一白：朱文姓名章压角，白文年号章随干支自动换年 */}
            <div className="sign-seals">
              <span className="seal-slot" style={{ '--w': "52px", '--tilt': ".8deg" }} data-seal="琉璃幻影|2|2|zhu" aria-hidden="true"></span>
              <span className="seal-slot" style={{ '--w': "31px", '--tilt': "-2.1deg" }} data-seal-year aria-hidden="true"></span>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
