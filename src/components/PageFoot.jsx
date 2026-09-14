/* 子页 · 篇末牌记
   古书卷末的「牌记」是带围框的题识，记刊刻者与年月 —— 版权页的祖宗。
   子页原先读完就断，直接掉进全站地头（Colophon）。这里补一块本卷自己的牌记收住：
   四周双边（外一圈、内退三像素再一圈，与页脚 .foot 同一形制），
   记卷次、本卷数目与干支，末了钤一枚姓名印。 */
export default function PageFoot({ num, name, note }) {
  return (
    <div className="pfoot rv">
      <div className="pfoot-box">
        <div className="pfoot-main">
          <span className="pfoot-tag">{num} · {name}</span>
          {note ? <p className="pfoot-note">{note}</p> : null}
          <p className="pfoot-date small">岁次 <span data-gz>丙午</span> · 琉璃幻影</p>
        </div>
        <span className="seal-slot pfoot-seal" style={{ '--w': '42px', '--tilt': '-1.3deg' }} data-seal="琉璃幻影|2|2|zhu" aria-hidden="true"></span>
      </div>
    </div>
  )
}
