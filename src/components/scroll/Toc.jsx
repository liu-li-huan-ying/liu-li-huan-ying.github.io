/* 窄屏目次
   只在首页出现（≥821px 交给右侧的书耳）。开合与滚动锁由 toc.js 接管。 */
export default function Toc() {
  return (
    <>
      <div className="toc" id="toc" data-open="false">
        <div className="wrap">
          <ul className="toc-list">
            <li><a href="#material"><span className="toc-num">壹</span>琉璃<span className="toc-lat">Materials</span></a></li>
            <li><a href="#work"><span className="toc-num">贰</span>作品<span className="toc-lat">Work</span></a></li>
            <li><a href="#about"><span className="toc-num">叁</span>自述<span className="toc-lat">About</span></a></li>
            <li><a href="#writing"><span className="toc-num">肆</span>手记<span className="toc-lat">Writing</span></a></li>
            <li><a href="#contact"><span className="toc-num">伍</span>落款<span className="toc-lat">Colophon</span></a></li>
          </ul>
          <p className="toc-foot small">琉璃幻影 · 纸与釉 · <span data-gz>丙午</span></p>
        </div>
      </div>
    </>
  )
}
