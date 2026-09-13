/* 壹 · 琉璃（材质）
   「琉璃幻影」这个名字与玉笺的窑色皮肤是同一批颜色，这一卷把材料摊开：
   五个色（宣纸 / 墨 / 青瓷 / 朱砂 / 琥珀）+ 五件东西（纤维 / 界格 / 冰裂 / 印 / 墨韵）。
   色值写在卡片上，是为了以后改配色时有据可依 —— 与 scroll.css 里的令牌一一对应。 */
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
              <p className="lead sec-sub">
                「琉璃幻影」这个名字里本来就带着釉。加上玉笺——<b>笺就是笺纸</b>，
                一个在纸上写字的工具——手边的材料是现成的：<b>纸、墨、瓷、印</b>。
                纸墨承担九成，彩色只留青瓷一种，红只留给印。
              </p>
            </div>
          </div>

          <div className="glaze-grid">
            <article className="glaze rv" style={{ '--d': "0" }}>
              <div className="glaze-swatch" style={{ '--g1': "#F7F3EA", '--g2': "#EAE4D6", '--g3': "#D8D0BE" }}></div>
              <div className="glaze-meta">
                <span className="glaze-name">宣纸</span>
                <span className="glaze-py">Xuan Zhi</span>
                <span className="glaze-hex">#EDE8DD</span>
                <p className="glaze-note">微暖的纸色，带纤维纹理。长时间盯着看不刺眼。</p>
                <div className="glaze-use">地色 · 页面基底</div>
              </div>
            </article>

            <article className="glaze rv" style={{ '--d': "60" }}>
              <div className="glaze-swatch" style={{ '--g1': "#4A463E", '--g2': "#2A2721", '--g3': "#141210" }}></div>
              <div className="glaze-meta">
                <span className="glaze-name">墨</span>
                <span className="glaze-py">Mo</span>
                <span className="glaze-hex">#1C1A16</span>
                <p className="glaze-note">偏暖的墨。纯黑压在纸色上会显脏、显硬。</p>
                <div className="glaze-use">文字 · 正文与标题</div>
              </div>
            </article>

            <article className="glaze rv" style={{ '--d': "120" }}>
              <div className="glaze-swatch" style={{ '--g1': "#B7CDBB", '--g2': "#6F9A7E", '--g3': "#3F6B52" }}></div>
              <div className="glaze-meta">
                <span className="glaze-name">青瓷</span>
                <span className="glaze-py">Qing Ci</span>
                <span className="glaze-hex">#567F68</span>
                <p className="glaze-note">越窑的温润青灰。整页唯一的彩色，用在细线、序号与链接。</p>
                <div className="glaze-use">主色 · 唯一的彩色</div>
              </div>
            </article>

            <article className="glaze rv" style={{ '--d': "180" }}>
              <div className="glaze-swatch" style={{ '--g1': "#CE6E58", '--g2': "#A33A2A", '--g3': "#6E2318" }}></div>
              <div className="glaze-meta">
                <span className="glaze-name">朱砂</span>
                <span className="glaze-py">Zhu Sha</span>
                <span className="glaze-hex">#A33A2A</span>
                <p className="glaze-note">印章本来就是红的。整页只有这一处红。</p>
                <div className="glaze-use">印记 · 仅用于印</div>
              </div>
            </article>

            <article className="glaze rv" style={{ '--d': "240" }}>
              <div className="glaze-swatch" style={{ '--g1': "#E5C48A", '--g2': "#A9782A", '--g3': "#6F4E15" }}></div>
              <div className="glaze-meta">
                <span className="glaze-name">琥珀</span>
                <span className="glaze-py">Hu Po</span>
                <span className="glaze-hex">#A9782A</span>
                <p className="glaze-note">用来标「正在发生」：状态点，以及裂缝合上的那一瞬。</p>
                <div className="glaze-use">点缀 · 仅状态与愈合</div>
              </div>
            </article>
          </div>

          <div className="origin rv">
            <p className="small">
              玉笺的五套窑色皮肤（青瓷 / 天青 / 月白 / 黛 / 琥珀）用的是同一批颜色。
              先有纸墨，再有的这些色。
            </p>
          </div>

          {/* 材质板 */}
          <div className="material">
            <div className="sec-title-wrap rv" style={{ marginBottom: "clamp(26px,4vh,42px)" }}>
              <span className="label">Materials</span>
              <h3 className="d-m">除颜色之外的五件东西</h3>
            </div>
            <div className="mat-row">
              <div className="mat rv">
                <div className="mat-stage"><span className="m-fiber"></span></div>
                <div>
                  <div className="mat-name">宣纸纤维<em>Xuan Paper</em></div>
                  <p className="mat-desc">一层各向异性的噪点，横向拉伸成纤维。纯色块不至于像塑料。</p>
                </div>
              </div>
              <div className="mat rv" style={{ '--d': "70" }}>
                <div className="mat-stage"><div className="m-ulan"><i></i><i></i><i></i><i></i><i></i></div></div>
                <div>
                  <div className="mat-name">乌丝栏<em>Ruled Columns</em></div>
                  <p className="mat-desc">传统界纸画的竖线，古时用来分栏。这里当界格，给版面立秩序。</p>
                </div>
              </div>
              <div className="mat rv" style={{ '--d': "140" }}>
                <div className="mat-stage">
                  <canvas className="m-crack" id="crackleMat" aria-hidden="true"></canvas>
                </div>
                <div>
                  <div className="mat-name">冰裂<em>Crackle</em></div>
                  <p className="mat-desc">哥窑开片的纹路，程序生成：先裂粗铁线，再在每块釉片里裂出细金丝。这里只裂不合。</p>
                </div>
              </div>
              <div className="mat rv" style={{ '--d': "210" }}>
                <div className="mat-stage">
                  <div className="m-seal">
                    <span className="seal-slot" style={{ '--w': "58px", '--tilt': ".7deg" }} data-seal="琉璃幻影|2|2|zhu" aria-hidden="true"></span>
                    <span className="seal-slot" style={{ '--w': "34px", '--tilt': "-1.8deg" }} data-seal-year aria-hidden="true"></span>
                  </div>
                </div>
                <div>
                  <div className="mat-name">印<em>Seal</em></div>
                  <p className="mat-desc">唯一的图形标识。字形取自小篆，朱文姓名章配白文年号章，年号随干支自动换。</p>
                </div>
              </div>
              <div className="mat rv" style={{ '--d': "280" }}>
                <div className="mat-stage"><span className="m-wash"></span></div>
                <div>
                  <div className="mat-name">墨韵<em>Ink Wash</em></div>
                  <p className="mat-desc">一摊洇开的水墨。需要柔和的过渡时用它，比渐变更像纸上的东西。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  )
}
