/* 子页 · 卷首题识
   首页以「引首」开篇；子页原先只有一行 .sec-head —— 题签、标题、引子挨完就再无别物，
   读起来像一张没排完的网页。这里把卷首按古书的「版框题识」补齐：
   题签（卷次）· 拉丁小字 · 篇题 · 引子 · 一枚干支朱印。
   末尾压一道双线界格，界格正中落一枚鱼尾 —— 鱼尾是版心对折的基准记号，
   首页的书耳用它指位置，这里用它标「卷首到此收住，正文起」。
   形态沿用 .sec-head / .slip 那一套，只补不尽之处，不另立一套语汇。 */
export default function PageHead({ num, name, latin, title, sub }) {
  return (
    <header className="sec-head phead rv">
      <div className="slip">
        <span className="slip-num">{num}</span>
        <span className="slip-line"></span>
        <span className="slip-name">{name}</span>
      </div>

      <div className="sec-title-wrap">
        <span className="label">{latin}</span>
        <h1 className="d-l"><span className="mask"><span className="ch">{title}</span></span></h1>
        <div className="phead-foot">
          {sub ? <p className="lead sec-sub">{sub}</p> : <span />}
          {/* 干支朱印：与首页引首、落款用的是同一枚年号印 */}
          <span className="seal-slot phead-seal" style={{ '--w': '30px', '--tilt': '1.5deg' }} data-seal-year aria-hidden="true"></span>
        </div>
      </div>

      <div className="phead-rule" aria-hidden="true"><span className="phead-fish"></span></div>
    </header>
  )
}
