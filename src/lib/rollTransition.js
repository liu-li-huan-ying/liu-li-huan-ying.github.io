import { redrawCrackles } from './crackle.js'
/* ══════════════════════════════════════════════════════════════
   换篇转场（卷轴）· 共享控制器
   点导航 / 目次 / 书耳，以及首页整屏吸附（deck）的跳屏，都走这里 ——
   同一次「手卷滚过一格」（View Transition + #rollRod），行为与观感不分叉。
   ══════════════════════════════════════════════════════════════ */
var ctrl = null

export function getRollTransition(){
  if (ctrl) return ctrl

  var root = document.documentElement
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var busy = false

  /* 轴在 body 末尾 —— VT 的各 group 按「对应元素的 DOM 次序」叠放，
     排在 <main> 之前会被整页快照压住。代价是这段脚本解析时它还没出现，
     所以不能在初始化时取，得等到真要开场那一刻再查。 */
  function rodEl(){ return document.getElementById('rollRod') }
  function curY(){ return window.pageYOffset || root.scrollTop || 0 }
  function canVT(){ return !reduce && !!document.startViewTransition }

  /* 落点和浏览器默认锚点一致：减去 scroll-margin-top，别顶到导航底下 */
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

  /* opts.onEnter 在 VT 的「新快照」生成之前跑（就在快照回调里），
     用来同步改 DOM 状态 —— 必须同步：异步等滚动事件回调，
     新快照会先定格在旧状态，再突兀地跳变 */
  function go(el, opts){
    opts = opts || {}
    var rod = rodEl()
    var y = targetY(el)

    function after(){
      redrawCrackles()
      if (opts.onEnter) opts.onEnter()
    }

    if (!canVT()){
      jump(y)
      after()
      return { finished: Promise.resolve(), animated: false }
    }

    var back = y < curY() - 1
    busy = true
    root.classList.toggle('vt-back', back)
    root.classList.add('vt-roll')
    var t = document.startViewTransition(function(){
      if (rod) rod.classList.add('on')
      jump(y)
      after()
    })
    var done = function(){
      if (rod) rod.classList.remove('on')
      root.classList.remove('vt-roll', 'vt-back')
      busy = false
    }
    t.finished.then(done, done)
    return { finished: t.finished, animated: true }
  }

  ctrl = {
    go: go,
    jump: jump,
    targetY: targetY,
    curY: curY,
    isBusy: function(){ return busy },
    reduce: reduce
  }
  return ctrl
}
