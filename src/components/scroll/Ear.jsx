/* 右侧书耳：鱼尾指位置，书耳标篇次。闲置隐身，滚动或靠近才现身
   —— 由 design-proposal/index.html 的标记转写，结构与类名未改。
   替代原先的 ScrollProgress。 */
export default function Ear() {
  return (
    <>
      <nav id="ear" aria-label="篇次">
        <span className="ear-spine" aria-hidden="true">
          <i id="earFill"></i>
          <span className="ear-fish" id="earFish"></span>
        </span>
        <ul className="ear-tabs" id="earTabs">
          <li><a href="#material" data-sec="material"><span className="ear-ord">壹</span><span className="ear-name">琉璃</span></a></li>
          <li><a href="#work" data-sec="work"><span className="ear-ord">貳</span><span className="ear-name">作品</span></a></li>
          <li><a href="#about" data-sec="about"><span className="ear-ord">叁</span><span className="ear-name">自述</span></a></li>
          <li><a href="#writing" data-sec="writing"><span className="ear-ord">肆</span><span className="ear-name">手记</span></a></li>
          <li><a href="#contact" data-sec="contact"><span className="ear-ord">伍</span><span className="ear-name">落款</span></a></li>
        </ul>
      </nav>
    </>
  )
}
