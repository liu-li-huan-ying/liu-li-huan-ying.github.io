import { getRollTransition } from './rollTransition.js'
/* ══════════════════════════════════════════════════════════════
   整屏吸附导航（首页 deck-mode）
   滚轮 / 方向键 / 空格 / PageUp·Down / 触摸滑动 → 前进或后退「一站」。
   只在 <html class="deck-mode"> 下生效（即首页路由），子页面不受影响。

   翻屏复用换篇转场 rollTransition（View Transition + 木轴），与点导航是同一段
   「手卷滚过一格」——观感不分叉。

   引首（首屏）愈合进度**由人搓、可停半途**：不是放一段自动动画，而是把滚轮 /
   方向键 / 触摸的位移直接换算成愈合增量——滚多少、合多少，松手就定格在半裂半合，
   往回搓就裂回去。引首因此占「两站」：0 裂满 / 1 合上。在非 deck（普通滚动）下，
   愈合本来就由滚动行程驱动、同样可停在半途，这里只是把 deck 的整屏跳也接成同一种手感。
   —— 直到裂满愈合（heal≈1）后，再往前一格才卷轴翻到「壹 · 琉璃」；往回搓则裂回最初。
   ══════════════════════════════════════════════════════════════ */
var LAST_STAGE = 7              /* 引首占 0(裂)/1(合)，其后 2..7 依次是六屏 */
var HEAL_STEP = 0.2             /* 键盘每按一下、折合的愈合增量（约 5 下搓满） */
var WHEEL_DIV = 600             /* 滚轮 deltaY 折算系数：约 5 个刻度搓满 */
var TOUCH_DIV = 320             /* 触摸拖动像素折算系数 */

export function initDeckNav(drive){
  var root = document.documentElement
  var roll = getRollTransition()
  var reduce = roll.reduce
  var lock = false

  /* 首页七屏的 id 顺序，必须与 DOM 顺序一致 */
  var SECTIONS = ['top', 'material', 'work', 'about', 'writing', 'contact', 'colophon']

  function list(){
    var out = []
    for (var i = 0; i < SECTIONS.length; i++){
      var el = document.getElementById(SECTIONS[i])
      if (el) out.push(el)
    }
    return out
  }

  /* 按滚动位置反推当前落在第几屏（0..6） */
  function sectionAt(els){
    var y = window.pageYOffset || root.scrollTop || 0
    var idx = 0
    for (var i = 0; i < els.length; i++){
      var top = els[i].getBoundingClientRect().top + y
      if (top - 4 <= y) idx = i
    }
    return idx
  }

  /* 当前「站」。引首是裂是合由愈合进度定 —— 所以往回滚时它会自然退回 0。
     reduced-motion 下愈合不可见，引首只占一站，不留一个空手势 */
  function stageAt(els){
    var si = sectionAt(els)
    if (reduce) return si
    /* 引首占两站：裂=0 / 合=1；其余屏 2..7（= 屏序 + 1） */
    if (si === 0) return (drive && drive.getHeal() >= 0.999) ? 1 : 0
    return si + 1
  }
  function sectionOfStage(st){
    if (reduce) return st
    return st <= 1 ? 0 : st - 1
  }
  function lastStage(){ return reduce ? SECTIONS.length - 1 : LAST_STAGE }

  /* 引首愈合进度：把一次手势的位移量折算成愈合增量并定格，**不播放动画**。
     滚多少合多少、松手就停在半裂半合；往回搓就裂回去。deck 下 scrollDrive 不碰
     引首愈合（deckOwnsHeal），所以这里 setHeal 是唯一的进度来源 */
  function scrub(amount){
    if (!drive) return
    var next = drive.getHeal() + amount
    next = next < 0 ? 0 : (next > 1 ? 1 : next)
    drive.setHeal(next)
  }
  /* 引首是否已「合上」：合上后才放行进屏，再往前一格翻屏 */
  function introFull(){ return !drive || drive.getHeal() >= 0.999 }

  function canNav(){ return !lock && !roll.isBusy() && guard() }

  function goToStage(st){
    if (lock || roll.isBusy() || !guard()) return
    var els = list()
    if (!els.length) return
    st = Math.max(0, Math.min(st, lastStage()))
    var cur = stageAt(els)
    if (st === cur) return
    lock = true
    function done(){ lock = false }

    /* 其余一律卷轴翻屏。落到引首时在 VT 新快照前**同步**定住愈合状态，
       这样落定的那一帧就对（异步等滚动事件会让它先定格成旧状态再突兀跳变） */
    var opts = {}
    if (st <= 1 && drive) opts.onEnter = function(){ drive.setHeal(st) }
    Promise.resolve(roll.go(els[sectionOfStage(st)], opts).finished).then(done, done)
  }

  function guard(){
    if (!root.classList.contains('deck-mode')) return false
    if (document.body.classList.contains('toc-open')) return false
    /* 与 CSS 的 @media (max-height:640px) 兜底保持一致：过矮视口已退回普通滚动，
       deckNav 不能再拦截，否则整屏跳会落到非对齐的位置 */
    if (window.innerHeight <= 640) return false
    return true
  }

  function onWheel(e){
    if (!guard()) return
    if (Math.abs(e.deltaY) < 8) return
    if (!canNav()){ e.preventDefault(); return }   /* 转场中：吞掉手势 */
    e.preventDefault()                       /* 吞掉原生连续滚动，只留整屏跳 */
    if (!reduce){
      var els = list()
      /* 还在引首（section 0）：裂满→合上是可搓的进度，没合上不翻屏；回搓则裂回 */
      if (sectionAt(els) === 0){
        if (e.deltaY > 0){
          if (introFull()) goToStage(2)          /* 已合上 → 翻到壹 */
          else scrub(e.deltaY / WHEEL_DIV)        /* 往前搓一点 */
        } else {
          if (drive && drive.getHeal() <= 0.001) return   /* 已裂满，无前屏 */
          scrub(e.deltaY / WHEEL_DIV)                      /* 往后裂回去 */
        }
        return
      }
    }
    goToStage(stageAt(list()) + (e.deltaY > 0 ? 1 : -1))
  }

  function onKey(e){
    if (!guard()) return
    var k = e.key
    var forward = (k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Spacebar')
    var backward = (k === 'ArrowUp' || k === 'PageUp')
    if (!forward && !backward && k !== 'Home' && k !== 'End') return
    if (!canNav()) return
    /* 焦点在链接/按钮上时，空格是「激活」不是翻屏 —— 让给浏览器 */
    var t = e.target
    if ((k === ' ' || k === 'Spacebar') && t && t.closest &&
        t.closest('a,button,input,textarea,select,summary,[contenteditable]')) return
    e.preventDefault()
    var els = list()
    if (forward){
      if (!reduce && sectionAt(els) === 0){
        if (introFull()) goToStage(2)
        else scrub(HEAL_STEP)
        return
      }
      goToStage(stageAt(els) + 1)
    } else if (backward){
      if (!reduce && sectionAt(els) === 0){
        if (drive && drive.getHeal() <= 0.001) return
        scrub(-HEAL_STEP)
        return
      }
      goToStage(stageAt(els) - 1)
    } else if (k === 'Home'){ goToStage(0) }
    else if (k === 'End'){ goToStage(lastStage()) }
  }

  var touchY = 0
  function onTouchStart(e){ touchY = e.touches[0].clientY }
  function onTouchEnd(e){
    if (!guard()) return
    var ty = (e.changedTouches && e.changedTouches[0].clientY) || touchY
    var dy = touchY - ty                              /* 上滑（dy>0）→ 前进 */
    if (Math.abs(dy) < 42) return
    if (!canNav()) return
    if (!reduce){
      var els = list()
      if (sectionAt(els) === 0){
        if (dy > 0){
          if (introFull()) goToStage(2)
          else scrub(dy / TOUCH_DIV)
        } else {
          if (drive && drive.getHeal() <= 0.001) return
          scrub(dy / TOUCH_DIV)
        }
        return
      }
    }
    goToStage(stageAt(list()) + (dy > 0 ? 1 : -1))
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKey)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })

  /* reduced-motion：愈合不可见，直接把引首定在「已合上」，
     那句「裂过，然后合上。」照样给到，只是没有动画 */
  if (reduce && drive) drive.setHeal(1)
}
