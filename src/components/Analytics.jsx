import { useEffect } from 'react'
import { useHashRoute } from '../hooks/useHashRoute'
import { ANALYTICS } from '../utils/analytics-config'

let injected = false

function injectBaidu(id) {
  window._hmt = window._hmt || []
  const hm = document.createElement('script')
  hm.async = true
  hm.src = `https://hm.baidu.com/hm.js?${id}`
  document.head.appendChild(hm)
}

function injectClarity(id) {
  ;(function (c, l, a, r, i, t, y) {
    c[a] =
      c[a] ||
      function () {
        ;(c[a].q = c[a].q || []).push(arguments)
      }
    t = l.createElement(r)
    t.async = true
    t.src = 'https://www.clarity.ms/tag/' + i
    y = l.getElementsByTagName(r)[0]
    y.parentNode.insertBefore(t, y)
  })(window, document, 'clarity', 'script', id)
}

function injectGoatcounter(site) {
  const s = document.createElement('script')
  s.async = true
  s.dataset.goatcounter = `https://${site}.goatcounter.com/count`
  s.src = '//gc.zgo.at/count.js'
  document.head.appendChild(s)
}

function injectAll() {
  if (injected) return
  injected = true
  if (ANALYTICS.baiduId) injectBaidu(ANALYTICS.baiduId)
  if (ANALYTICS.clarityId) injectClarity(ANALYTICS.clarityId)
  if (ANALYTICS.goatcounterSite) injectGoatcounter(ANALYTICS.goatcounterSite)
}

export default function Analytics() {
  const route = useHashRoute()

  useEffect(() => {
    const onInteraction = () => {
      injectAll()
      window.removeEventListener('pointerdown', onInteraction)
      window.removeEventListener('keydown', onInteraction)
    }
    window.addEventListener('pointerdown', onInteraction, { once: true })
    window.addEventListener('keydown', onInteraction, { once: true })
    return () => {
      window.removeEventListener('pointerdown', onInteraction)
      window.removeEventListener('keydown', onInteraction)
    }
  }, [])

  useEffect(() => {
    if (!route.startsWith('/') || !injected) return
    const path = `/${route}`
    if (ANALYTICS.baiduId && window._hmt) {
      window._hmt.push(['_trackPageview', path])
    }
    if (ANALYTICS.goatcounterSite && window.goatcounter) {
      window.goatcounter.count({ path })
    }
  }, [route])

  return null
}
