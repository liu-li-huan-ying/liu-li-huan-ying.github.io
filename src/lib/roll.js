import { redrawCrackles } from './crackle.js'
/* ══════════════════════════════════════════════════════════════
   3.5 · 换篇转场：点导航 / 目次 / 书耳，手卷滚过一格
   只在真的换了一篇时才开场；差几像素的不算，别为一次微调铺张。
   不支持或用户要求少动，就原样退回浏览器的锚点滚动
   ══════════════════════════════════════════════════════════════ */
export function initRoll(){
  var root = document.documentElement
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce || !document.startViewTransition) return

  /* 轴在 body 末尾 —— VT 的各个 group 按「对应元素的 DOM 次序」叠放，
     排在 <main> 之前会被整页快照压住。代价是这段脚本解析时它还没出现，
     所以不能在初始化时取，得等到真要开场那一刻再查。 */
  function rodEl(){ return document.getElementById('rollRod') }

  var busy = false

  function curY(){ return window.pageYOffset || root.scrollTop || 0 }

  /* 落点和浏览器默认锚点保持一致：减去 scroll-margin-top，别顶到导航底下 */
  function targetY(el){
    var mt = parseFloat(getComputedStyle(el).scrollMarginTop) || 0
    var y = el.getBoundingClientRect().top + curY() - mt
    return Math.max(0, Math.min(y, root.scrollHeight - window.innerHeight))
  }

  /* 转场期间必须关掉平滑滚动：否则动画还没跑完，页面已经在自己偷偷滚了，
     新快照截到的是半路，落点会差一截 */
  function jump(y){
    var prev = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    window.scrollTo(0, y)
    root.style.scrollBehavior = prev
  }

  function run(el, id){
    var rod = rodEl()
    var y = targetY(el)
    var back = y < curY()
    busy = true
    root.classList.toggle('vt-back', back)
    root.classList.add('vt-roll')
    var t = document.startViewTransition(function(){
      if (rod) rod.classList.add('on')
      jump(y)
      redrawCrackles()
    })
    var done = function(){
      if (rod) rod.classList.remove('on')
      root.classList.remove('vt-roll', 'vt-back')
      busy = false
    }
    t.finished.then(done, done)
    /* 地址栏还是要跟得上，但不能让浏览器再自己滚一次 */
    if (history.pushState) history.pushState(null, '', '#' + id)
  }

  document.addEventListener('click', function(e){
    if (e.defaultPrevented || e.button !== 0) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null
    if (!a) return
    var id = a.getAttribute('href').slice(1)
    var el = id && document.getElementById(id)
    if (!el) return

    var y = targetY(el)
    e.preventDefault()
    if (busy || Math.abs(y - curY()) < 24){ jump(y); return }
    /* 从窄屏目次里点的：先让目次收起来再开场，
       不然旧快照里还盖着一层目次，一开场就凭空消失 */
    if (document.body.classList.contains('toc-open')) setTimeout(function(){ run(el, id) }, 300)
    else run(el, id)
  }, false)

  /* 后退键回到某个篇次：老老实实跳过去，不再开场转场 */
  window.addEventListener('popstate', function(){
    var id = (location.hash || '').slice(1)
    var el = id && document.getElementById(id)
    if (el) jump(targetY(el))
  })
}
