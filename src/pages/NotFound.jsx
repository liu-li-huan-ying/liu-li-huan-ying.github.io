/* 404 · 此卷不在
   原来这里是台可交互的终端模拟器（敲 ls / cd 找路）。纸墨这一套里它没有位置：
   手卷翻开找不到那一页，最好是安静地说清楚，再把路指出来。
   静态反而更像书的错页 —— 不放动画。 */
export default function NotFound() {
  return (
    <section className="page">
      <div className="wrap">
        <div className="missing">
          <div className="missing-code" aria-hidden="true">404</div>
          <h1 className="missing-title">此卷不在</h1>
          <p className="small">
            这一页要么搬了地方，要么从来没写过。路引在下面。
          </p>
          <div className="missing-links">
            <a className="backlink" href="#/" style={{ marginBottom: 0 }}>
              <svg width="15" height="9" viewBox="0 0 15 9" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true" style={{ transform: 'scaleX(-1)' }}><path d="M0 4.5h13M9.4 1 13 4.5 9.4 8"/></svg>
              回卷首
            </a>
            <a className="backlink" href="#/projects" style={{ marginBottom: 0 }}>作品</a>
            <a className="backlink" href="#/blog" style={{ marginBottom: 0 }}>手记</a>
            <a className="backlink" href="#/about" style={{ marginBottom: 0 }}>关于</a>
          </div>
        </div>
      </div>
    </section>
  )
}
