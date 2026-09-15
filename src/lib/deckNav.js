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
   —— 合上之后还有一段「空白容错滚程」：继续搓只走这段空白、屏不动、愈合保持合上、
   浮现的话留着，把这段走完才卷轴翻到「壹 · 琉璃」；且单次手势封顶，猛滚也得过好几下，
   不用小心翼翼算力度。往回搓则先退出空白带、再裂回最初。
   ══════════════════════════════════════════════════════════════ */
var LAST_STAGE = 7              /* 引首占 0(裂)/1(合)，其后 2..7 依次是六屏 */
var HEAL_STEP = 0.2             /* 键盘每按一下、折合的愈合增量（约 5 下搓满） */
var WHEEL_DIV = 300             /* 滚轮 deltaY 折算系数：约 2–3 个刻度搓满（原 600，要滚 5 次才合上） */
var TOUCH_DIV = 220             /* 触摸拖动像素折算系数 */
var INTRO_BUFFER = 0.1         /* 合上后到翻屏之间的容错滚程（原 0.6，白白的 3 格空白） */
var MAX_STEP = 0.5             /* 单次手势最多推进的虚拟进度，仍封顶以免一次猛滚直接跳过愈合 */
var HEAL_RANGE = 1 + INTRO_BUFFER
/* 触控板一次轻扫会连发十几条 wheel 事件（每条 deltaY 只有几像素），
   鼠标一格却是上百。所以翻屏不能「一条事件跳一屏」。 */
var WHEEL_TRIGGER = 60         /* 累计到这个量才算一次「明确的手势」 */
var WHEEL_IDLE = 130           /* 这么久没有新事件，就认为手势结束 */

export function initDeckNav(drive){
  var root = document.documentElement
  var roll = getRollTransition()
  var reduce = roll.reduce
  var lock = false
  var wheelAcc = 0               /* 当前手势累计的滚动量 */
  var wheelIdle = 0              /* 「手势结束」的定时器 */
  var wheelHeld = false          /* 本场手势已经翻过一屏了，余波不再翻 */

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

  /* 引首虚拟进度 v：0=裂满 … 1=合上 … 1+INTRO_BUFFER=翻屏阈值。
     0..1 是愈合（滚多少合多少、可停半途），1..1+INTRO_BUFFER 是「合上后到翻屏之间的
     空白容错滚程」——合上后继续搓只走这段空白、屏不动，给出段落感，也容错（不至于
     一不小心多滚一下就直接翻过去）。v 全程由手势累加，单次手势封顶 MAX_STEP，
     所以再猛的滚动也得搓好几下才过得去，不用小心翼翼算力度。 */
  var v = reduce ? 1 : 0
  function advanceIntro(step){
    if (!drive){ if (step > 0) goToStage(2); return }
    if (step > MAX_STEP) step = MAX_STEP
    else if (step < -MAX_STEP) step = -MAX_STEP
    v += step
    if (v < 0) v = 0
    if (v > HEAL_RANGE) v = HEAL_RANGE
    drive.setHeal(v > 1 ? 1 : v)       /* 1 之后愈合不再变，只耗空白滚程 */
    if (v >= HEAL_RANGE - 1e-6){ v = 1; goToStage(2) }
  }

  function canNav(){ return !lock && !roll.isBusy() && guard() }

  function goToStage(st){
    if (lock || roll.isBusy() || !guard()) return
    var els = list()
    if (!els.length) return
    st = Math.max(0, Math.min(st, lastStage()))
    var cur = stageAt(els)
    if (st === cur) return
    lock = true
    wheelHeld = true                    /* 一场手势只翻一屏，触控板惯性的余波全归这场 */
    function done(){ lock = false }

    /* 其余一律卷轴翻屏。落到引首时在 VT 新快照前**同步**定住愈合状态，
       这样落定的那一帧就对（异步等滚动事件会让它先定格成旧状态再突兀跳变） */
    var opts = {}
    if (st <= 1 && drive) opts.onEnter = function(){ drive.setHeal(st); v = st }
    Promise.resolve(roll.go(els[sectionOfStage(st)], opts).finished).then(done, done)
  }

  /* 「这个视口算不算装得下」由 App.jsx 的 matchMedia 决定，判据只有那一处 ——
     这里只认类，不再重复判高度；重复判据才是分叉的开始 */
  function guard(){
    if (!root.classList.contains('deck-mode')) return false
    if (document.body.classList.contains('toc-open')) return false
    return true
  }

  function onWheel(e){
    if (!guard()) return
    var dy = e.deltaY
    if (!dy) return
    e.preventDefault()                       /* 吞掉原生连续滚动，只留整屏跳 */

    /* 每来一条事件就把「手势结束」的定时器往后推；一旦静了 130ms 以上，
       就算这场手势完了，累计量与封条一起清零。
       —— 触控板一次轻扫会连发十几条 wheel（每条 deltaY 只有几像素），
       鼠标一格却是上百；凭单条事件翻屏的话，一次轻扫能连翻好几屏。
       所以这里按「一场连续的手势最多翻一屏」来算：够量才动，动过就封，
       封到手势停为止。惯性的长尾巴也一并被这场手势吸收掉。 */
    clearTimeout(wheelIdle)
    wheelIdle = setTimeout(function(){ wheelAcc = 0; wheelHeld = false }, WHEEL_IDLE)

    if (wheelHeld) return
    if (!canNav()) return
    var els = list()
    if (!reduce && sectionAt(els) === 0){
      /* 引首：愈合是「滚多少合多少」，按原始增量走，不吃下面的累积阈值 */
      advanceIntro(dy / WHEEL_DIV)
      wheelAcc = 0
      return
    }
    wheelAcc += dy
    if (Math.abs(wheelAcc) < WHEEL_TRIGGER) return
    var dir = wheelAcc > 0 ? 1 : -1
    wheelAcc = 0
    goToStage(stageAt(els) + dir)
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
      if (!reduce && sectionAt(els) === 0){ advanceIntro(HEAL_STEP); return }
      goToStage(stageAt(els) + 1)
    } else if (backward){
      if (!reduce && sectionAt(els) === 0){ advanceIntro(-HEAL_STEP); return }
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
        advanceIntro(dy / TOUCH_DIV)
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
