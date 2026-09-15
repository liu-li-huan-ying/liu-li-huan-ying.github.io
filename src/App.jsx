import { useEffect, useRef } from 'react'
import { useHashRoute } from './hooks/useHashRoute'
import { profile } from './data/profile'

import Chrome from './components/scroll/Chrome'
import Masthead from './components/scroll/Masthead'
import Toc from './components/scroll/Toc'
import Ear from './components/scroll/Ear'
import Colophon from './components/scroll/Colophon'
import RollRod from './components/scroll/RollRod'

import Home from './pages/Home'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'
import ProjectList from './pages/ProjectList'
import ProjectDetail from './pages/ProjectDetail'
import AboutPage from './pages/AboutPage'
import NotFound from './pages/NotFound'
import ErrorBoundary from './components/ErrorBoundary'
import Analytics from './components/Analytics'
import BackToTop from './components/BackToTop'

/* ── 运行时模块 ──
   文档级事件委托的（光标、联系方式、目次、换篇、换地色）挂一次就够；
   扫 DOM 的（钤印、逐字揭示、数字、冰裂）每次换页都要重来 */
import { initCursor } from './lib/cursor'
import { initTheme } from './lib/theme'
import { initContacts } from './lib/contacts'
import { initToc } from './lib/toc'
import { initRoll } from './lib/roll'
import { initDeckNav } from './lib/deckNav'
import { initSeals } from './lib/seals'
import { initReveal } from './lib/reveal'
import { initCount } from './lib/count'
import { initScrollDrive } from './lib/scrollDrive'
import { initCrackle, disposeCrackle } from './lib/crackle'

/* 文档级事件委托只挂一次。
   这些模块都在 document 上做委托，而 StrictMode 在开发环境会把 effect 跑两遍
   （挂载 → 卸载 → 挂载）：挂两遍就有两个处理器，换地色最怕这个 ——
   两次 startViewTransition 会互相掐断，后一次起身时把前一次的 finished 提前结掉，
   观感就是「直接跳色、没有洇墨」。滚动驱动同理，它自己挂 window 监听，
   挂两遍等于每次滚动算两遍 */
let shellBooted = false

const DEFAULT_TITLE = '琉璃幻影 · Glazed Mirage — 全栈开发者'

function usePageTitle(route) {
  useEffect(() => {
    const blogMatch = route.match(/^\/blog\/(.+)$/)
    const projMatch = route.match(/^\/projects\/(.+)$/)

    if (blogMatch) {
      const post = profile.posts.find((p) => p.slug === blogMatch[1])
      document.title = post ? `${post.title} · ${profile.name}` : DEFAULT_TITLE
    } else if (projMatch) {
      const project = profile.projects.find((p) => p.id === projMatch[1])
      document.title = project ? `${project.title} · ${profile.name}` : DEFAULT_TITLE
    } else if (route === '/about') {
      document.title = `关于 · ${profile.name}`
    } else if (route === '/blog') {
      document.title = `手记 · ${profile.name}`
    } else if (route === '/projects') {
      document.title = `作品 · ${profile.name}`
    } else {
      document.title = DEFAULT_TITLE
    }
  }, [route])
}

function Routed() {
  const route = useHashRoute()
  const isHome = route === '/'

  usePageTitle(route)

  /* 文档级：只挂一次。
     滚动驱动（阅读进度 / 书耳 / 裂痕愈合）也在这里起，它自己挂 window 监听，
     不能每次换页重挂 —— 留着返回的 refresh 供换页后重新量一次布局 */
  const drive = useRef(null)
  useEffect(() => {
    if (shellBooted) return
    shellBooted = true
    initCursor()
    initTheme()
    initContacts()
    initToc()
    initRoll()
    drive.current = initScrollDrive()
    /* deckNav 需要 drive 来在引首把「破镜重圆」当动画播一次，故在其后接线 */
    initDeckNav(drive.current)
  }, [])

  /* 扫 DOM 的模块：每次换页重扫一遍。React 已经提交完 DOM，量到的是真实尺寸 */
  useEffect(() => {
    initSeals()
    initCount()
    initReveal()
    initCrackle()
    if (drive.current) drive.current.refresh()
    return () => disposeCrackle()
  }, [route])

  /* 从子页点「作品」这类篇内锚点回来时，浏览器只改了 hash、不会自己滚 ——
     补一次，落在该篇上，而不是回到卷首 */
  useEffect(() => {
    const m = window.location.hash.match(/^#([A-Za-z][\w-]*)$/)
    if (!m) return
    document.getElementById(m[1])?.scrollIntoView()
  }, [route])

  /* 首页 deck 模式：整屏吸附 + 滚轮跳屏。
     deck-mode 类是**唯一判据** —— CSS、deckNav.guard()、scrollDrive 都只认这个类，
     所以「什么视口算装得下」只在这里定义一次，别在三处各写一份。

     两个条件缺一不可：
     · 高 ≥641px —— 更矮的视口一屏根本装不下，摊平随流（否则要裁内容）；
     · 宽 ≥821px —— 窄屏（手机）下作品卷是「四件作品」，一屏无论如何装不下；
       而且那里本来就已经换成目次导航，两栏排版是给桌面写的。
     以前只判了高度，手机竖屏（390×844）被误判成 deck：作品卷 / 自述卷
     各被裁掉 100px 上下，卡片互相压住、标题看不见。

     挂上 change 监听而不是进页面时判一次 —— 转屏 / 拖窗口跨过断点要跟着变。 */
  useEffect(() => {
    const mq = window.matchMedia('(min-width:821px) and (min-height:641px)')
    const sync = () =>
      document.documentElement.classList.toggle('deck-mode', isHome && mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [isHome])

  /* 进首页顺手滚回卷首，避免从子页（保留的滚动位置）回来落在半屏 */
  useEffect(() => {
    if (isHome) window.scrollTo(0, 0)
  }, [isHome])

  const blogMatch = route.match(/^\/blog\/(.+)$/)
  const projMatch = route.match(/^\/projects\/(.+)$/)

  let view
  if (isHome) {
    view = <Home />
  } else if (route === '/projects') {
    view = <ProjectList />
  } else if (route === '/blog') {
    view = <BlogList />
  } else if (route === '/about') {
    view = <AboutPage />
  } else if (blogMatch) {
    const post = profile.posts.find((p) => p.slug === blogMatch[1])
    view = post ? <BlogPost post={post} /> : <NotFound />
  } else if (projMatch) {
    const project = profile.projects.find((p) => p.id === projMatch[1])
    view = project ? <ProjectDetail project={project} /> : <NotFound />
  } else {
    view = <NotFound />
  }

  return (
    <>
      {/* 目次每一页都挂：窄屏下顶栏的篇次与目录都是收起的，它是唯一能换页的入口。
          书耳跟随首页各卷的滚动进度，只有首页有意义 */}
      <Toc />
      {isHome && <Ear />}
      <main id="main" key={route}>
        {view}
      </main>
      <Colophon />
      <RollRod />
      <BackToTop />
    </>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <Chrome />
      <Masthead />
      <Routed />
      <Analytics />
    </ErrorBoundary>
  )
}
