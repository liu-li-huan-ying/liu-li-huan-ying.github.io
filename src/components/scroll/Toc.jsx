/* 目次
   窄屏的站点索引（≥821px 交给顶栏的篇次 + 右侧书耳）。
   两段：上面是手卷里的五卷（页内锚点），下面「卷外目录」是三个站级页面（hash 路由）。
   开合与滚动锁由 toc.js 接管。
   任何一页都挂着它 —— 子页面上顶栏的篇次/目录在窄屏是收起的，
   这时目次就是唯一能横向换页的入口，不能只在首页有。 */
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

          <p className="toc-out-head label">卷外目录</p>
          <ul className="toc-list toc-out">
            <li><a href="#/projects">全部作品<span className="toc-lat">Work</span></a></li>
            <li><a href="#/blog">全部手记<span className="toc-lat">Writing</span></a></li>
            <li><a href="#/about">关于<span className="toc-lat">About</span></a></li>
          </ul>

          <p className="toc-foot small">琉璃幻影 · 纸与釉 · <span data-gz>丙午</span></p>
        </div>
      </div>
    </>
  )
}
