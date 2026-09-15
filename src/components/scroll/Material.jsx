/* 壹 · 琉璃（材质）
   「琉璃幻影」这个名字与玉笺的窑色皮肤是同一批颜色，这一卷把材料摊开：
   五个色（宣纸 / 墨 / 青瓷 / 朱砂 / 琥珀）+ 三件东西（界格 / 冰裂 / 印）。
   色值写在卡片上，是为了以后改配色时有据可依 —— 与 scroll.css 里的令牌一一对应。
   卡片只留「名字 / 拼音 / 色值 / 用途」四项：用途是可核对的，解释不是。 */
export default function Material() {
  return (
    <>
      <section id="material">
        <div className="wrap">
          <div className="sec-head rv">
            <div className="slip"><span className="slip-num">壹</span><span className="slip-line"></span><span className="slip-name">琉璃</span></div>
            <div className="sec-title-wrap">
              <span className="label">Materials</span>
              <h2 className="d-l"><span className="mask"><span className="ch" style={{ '--i': "0" }}>名字先给了我材质</span></span></h2>
            </div>
          </div>

          <div className="glaze-grid">
            <article className="glaze rv" style={{ '--d': "0" }}>
              <div className="glaze-swatch" style={{ '--g1': "#F7F3EA", '--g2': "#EAE4D6", '--g3': "#D8D0BE" }}></div>
              <div className="glaze-meta">
                <span className="glaze-name">宣纸</span>
                <span className="glaze-py">Xuan Zhi</span>
                <span className="glaze-hex">#EDE8DD</span>
                <div className="glaze-use">地色 · 页面基底</div>
              </div>
            </article>

            <article className="glaze rv" style={{ '--d': "60" }}>
              <div className="glaze-swatch" style={{ '--g1': "#4A463E", '--g2': "#2A2721", '--g3': "#141210" }}></div>
              <div className="glaze-meta">
                <span className="glaze-name">墨</span>
                <span className="glaze-py">Mo</span>
                <span className="glaze-hex">#1C1A16</span>
                <div className="glaze-use">文字 · 正文与标题</div>
              </div>
            </article>

            <article className="glaze rv" style={{ '--d': "120" }}>
              <div className="glaze-swatch" style={{ '--g1': "#B7CDBB", '--g2': "#6F9A7E", '--g3': "#3F6B52" }}></div>
              <div className="glaze-meta">
                <span className="glaze-name">青瓷</span>
                <span className="glaze-py">Qing Ci</span>
                <span className="glaze-hex">#4C6E5A</span>
                <div className="glaze-use">主色 · 唯一的彩色</div>
              </div>
            </article>

            <article className="glaze rv" style={{ '--d': "180" }}>
              <div className="glaze-swatch" style={{ '--g1': "#CE6E58", '--g2': "#A33A2A", '--g3': "#6E2318" }}></div>
              <div className="glaze-meta">
                <span className="glaze-name">朱砂</span>
                <span className="glaze-py">Zhu Sha</span>
                <span className="glaze-hex">#A33A2A</span>
                <div className="glaze-use">印记 · 仅用于印</div>
              </div>
            </article>

            <article className="glaze rv" style={{ '--d': "240" }}>
              <div className="glaze-swatch" style={{ '--g1': "#E5C48A", '--g2': "#A9782A", '--g3': "#6F4E15" }}></div>
              <div className="glaze-meta">
                <span className="glaze-name">琥珀</span>
                <span className="glaze-py">Hu Po</span>
                <span className="glaze-hex">#A9782A</span>
                <div className="glaze-use">点缀 · 仅状态与愈合</div>
              </div>
            </article>
          </div>

          {/* 材质板：只留三件能说明「这东西怎么做的」的 —— 界格是版面骨架，
              冰裂是名字的具身，印是唯一的图形标识。纤维与墨韵只是氛围，撤了。 */}
          <div className="material">
            <div className="sec-title-wrap rv" style={{ marginBottom: "clamp(26px,4vh,42px)" }}>
              <span className="label">Materials</span>
              <h3 className="d-m">除颜色之外的三件东西</h3>
            </div>
            <div className="mat-row">
              <div className="mat rv">
                <div className="mat-stage"><div className="m-ulan"><i></i><i></i><i></i><i></i><i></i></div></div>
                <div>
                  <div className="mat-name">乌丝栏<em>Ruled Columns</em></div>
                  <p className="mat-desc">界纸的竖线，古时用来分栏。</p>
                </div>
              </div>
              <div className="mat rv" style={{ '--d': "70" }}>
                <div className="mat-stage">
                  <canvas className="m-crack" id="crackleMat" aria-hidden="true"></canvas>
                </div>
                <div>
                  <div className="mat-name">冰裂<em>Crackle</em></div>
                  <p className="mat-desc">哥窑开片，程序生成。这里只裂不合。</p>
                </div>
              </div>
              <div className="mat rv" style={{ '--d': "140" }}>
                <div className="mat-stage">
                  <div className="m-seal">
                    <span className="seal-slot" style={{ '--w': "58px", '--tilt': ".7deg" }} data-seal="琉璃幻影|2|2|zhu" aria-hidden="true"></span>
                    <span className="seal-slot" style={{ '--w': "34px", '--tilt': "-1.8deg" }} data-seal-year aria-hidden="true"></span>
                  </div>
                </div>
                <div>
                  <div className="mat-name">印<em>Seal</em></div>
                  <p className="mat-desc">小篆字形。朱文姓名章配白文年号章。</p>
                </div>
              </div>
            </div>
          </div>

          {/* 卷末不留解释，留一条能点开的证据 */}
          <a className="backlink rv" href="https://github.com/liu-li-huan-ying/yujian" target="_blank" rel="noreferrer"
             style={{ marginTop: 'clamp(26px,3.8vh,42px)', marginBottom: 0 }}>
            玉笺 · 窑色皮肤
            <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true"><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
          </a>
        </div>
      </section>

    </>
  )
}
