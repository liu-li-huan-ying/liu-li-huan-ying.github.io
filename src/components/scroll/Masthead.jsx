import { useHashRoute } from '../../hooks/useHashRoute'

/* 卷首题签（顶栏）
   固定的玻璃纸页头：一枚小印、站名、卷外目录、五个篇次、窄屏的目次开关、纸墨地色开关。
   分两层：左边「作品目录 / 手记目录 / 关于」是站级页面（hash 路由 #/…），
   右边五个篇次是手卷里的卷（页内锚点 #…）；从子页点篇次只改 hash，
   由外壳补一次滚动，落在那一卷上。
   顶部那道细线是阅读进度（scrollDrive.js 驱动）。 */
const PAGES = [
  { href: '#/projects', label: '作品目录', match: /^\/projects(\/|$)/ },
  { href: '#/blog', label: '手记目录', match: /^\/blog(\/|$)/ },
  { href: '#/about', label: '关于', match: /^\/about$/ },
]

export default function Masthead() {
  const route = useHashRoute()

  return (
    <>
      <header>
        <nav className="nav">
          <span className="seal-slot" style={{ '--w': "34px", '--tilt': "-1.2deg" }} data-seal="璃|1|1|zhu" aria-hidden="true"></span>
          <span className="wordmark">琉璃幻影</span>
          <div className="navpages">
            {PAGES.map((p) => (
              <a
                key={p.href}
                href={p.href}
                aria-current={p.match.test(route) ? 'page' : undefined}
              >
                {p.label}
              </a>
            ))}
          </div>
          <div className="navlinks">
            <a href="#material">琉璃</a>
            <a href="#work">作品</a>
            <a href="#about">自述</a>
            <a href="#writing">手记</a>
            <a href="#contact">落款</a>
          </div>
          <button type="button" className="toc-btn" id="tocBtn"
            aria-expanded="false" aria-controls="toc" aria-label="打开目次">目次</button>
          <div className="tswitch" role="group" aria-label="切换地色">
            <button type="button" data-theme-btn="paper" aria-pressed="true">纸</button>
            <button type="button" data-theme-btn="ink" aria-pressed="false">墨</button>
          </div>
        </nav>
        <div id="progress" aria-hidden="true"></div>
      </header>
    </>
  )
}
