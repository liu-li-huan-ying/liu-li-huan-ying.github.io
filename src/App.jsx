import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import { LangProvider } from './i18n/lang-provider'
import { useLang } from './i18n/use-lang'
import { useHashRoute } from './hooks/useHashRoute'
import { profile } from './data/profile'
import Preloader from './components/Preloader'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BlogList from './pages/BlogList'
import BlogPost from './pages/BlogPost'
import ProjectList from './pages/ProjectList'
import ProjectDetail from './pages/ProjectDetail'
import AboutPage from './pages/AboutPage'
import NotFound from './pages/NotFound'
import Footer from './components/Footer'
import BackToTop from './components/BackToTop'
import ScrollProgress from './components/ScrollProgress'
import CommandPalette from './components/CommandPalette'
import KonamiRain from './components/KonamiRain'
import Analytics from './components/Analytics'

const DEFAULT_TITLE = '琉璃幻影 · Glazed Mirage'

function usePageTitle(route) {
  const { lang } = useLang()
  const data = profile[lang]

  useEffect(() => {
    const blogMatch = route.match(/^\/blog\/(.+)$/)
    const projMatch = route.match(/^\/projects\/(.+)$/)

    if (blogMatch) {
      const post = data.posts.find((p) => p.slug === blogMatch[1])
      document.title = post ? `${post.title} · ${data.name}` : DEFAULT_TITLE
    } else if (projMatch) {
      const project = data.projects.find((p) => p.id === projMatch[1])
      document.title = project ? `${project.title} · ${data.name}` : DEFAULT_TITLE
    } else if (route === '/about') {
      document.title = `${data.name} — About`
    } else {
      document.title = DEFAULT_TITLE
    }
  }, [route, data])
}

function RoutedView() {
  const route = useHashRoute()
  const { lang } = useLang()
  const data = profile[lang]

  usePageTitle(route)

  useEffect(() => {
    if (route !== '/') window.scrollTo({ top: 0 })
  }, [route])

  let view
  const blogMatch = route.match(/^\/blog\/(.+)$/)
  const projMatch = route.match(/^\/projects\/(.+)$/)

  if (route === '/') {
    view = <Home />
  } else if (route === '/projects') {
    view = <ProjectList />
  } else if (route === '/blog') {
    view = <BlogList />
  } else if (route === '/about') {
    view = <AboutPage />
  } else if (blogMatch) {
    const index = data.posts.findIndex((p) => p.slug === blogMatch[1])
    view =
      index >= 0 ? (
        <BlogPost post={data.posts[index]} index={index} posts={data.posts} />
      ) : (
        <NotFound />
      )
  } else if (projMatch) {
    const index = data.projects.findIndex((p) => p.id === projMatch[1])
    view =
      index >= 0 ? (
        <ProjectDetail project={data.projects[index]} index={index} projects={data.projects} />
      ) : (
        <NotFound />
      )
  } else {
    view = <NotFound />
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={`${lang}:${route}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative z-10"
      >
        {view}
        <Footer />
      </motion.main>
    </AnimatePresence>
  )
}

function Shell() {
  const [booted, setBooted] = useState(() => {
    try {
      return sessionStorage.getItem('pf-booted') === '1'
    } catch (err) {
      void err
      return false
    }
  })

  const markBooted = useCallback(() => {
    try {
      sessionStorage.setItem('pf-booted', '1')
    } catch (err) {
      void err
    }
    setBooted(true)
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[var(--color-surface)]">
      <ErrorBoundary>
        {booted && (
          <>
            <Navbar />
            <RoutedView />
            <BackToTop />
            <ScrollProgress />
            <CommandPalette />
            <KonamiRain />
            <Analytics />
          </>
        )}
      </ErrorBoundary>

      <AnimatePresence>{!booted && <Preloader onComplete={markBooted} />}</AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
      <MotionConfig reducedMotion="user">
        <Shell />
      </MotionConfig>
    </LangProvider>
  )
}
