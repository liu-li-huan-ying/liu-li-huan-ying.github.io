import { getRollTransition } from './rollTransition.js'
/* ══════════════════════════════════════════════════════════════
   整屏吸附导航（首页 deck-mode）
   滚轮 / 方向键 / 空格 / PageUp·Down / 触摸滑动 → 跳到上一或下一整屏。
   只在 <html class="deck-mode"> 下生效（即首页路由），子页面不受影响。

   翻屏不自己滚，而是复用换篇转场 rollTransition（View Transition + 木轴），
   与点导航 / 目次是同一段「手卷滚过一格」——观感不分叉。

   引首（首屏）分两段走：往下第一滚只播「破镜重圆」（冰裂愈合 0→1）并停在引首，
   让人看清愈合、读完合上后浮现的那句话；已合上之后再滚，才卷轴翻到「壹 · 琉璃」。
   回到卷首时把冰裂重置为裂满，可再看一次。
   ══════════════════════════════════════════════════════════════ */
var HEAL_MS = 1200

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

  /* 用滚动位置反推当前落在哪一屏 */
  function currentIndex(els){
    var y = window.pageYOffset || root.scrollTop || 0
    var idx = 0
    for (var i = 0; i < els.length; i++){
      var top = els[i].getBoundingClientRect().top + y
      if (top - 4 <= y) idx = i
    }
    return idx
  }

  function goTo(i){
    if (lock || roll.isBusy()) return
    var els = list()
    i = Math.max(0, Math.min(i, els.length - 1))
    var from = currentIndex(els)
    if (i === from) return

    /* 引首（首屏）往下一格分两段 ——
       第一滚只播「破镜重圆」、停在引首，愈合后浮现的那句话才留得住给人欣赏；
       已合上之后再滚，才卷轴翻到下一屏。 */
    if (i === from + 1 && from === 0 && drive && !reduce && drive.getHeal() < 0.999){
      lock = true
      drive.animateHeal(1, HEAL_MS, function(){ lock = false })
      return
    }

    lock = true
    function done(){ lock = false }
    var opts = {}
    /* 落到卷首：把冰裂重置为裂满，好再看一次破镜重圆（可重播） */
    if (i === 0 && drive) opts.onEnter = function(){ drive.resetHeal() }
    Promise.resolve(roll.go(els[i], opts).finished).then(done, done)
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
    e.preventDefault()                       /* 吞掉原生连续滚动，只留整屏跳 */
    var els = list()
    goTo(currentIndex(els) + (e.deltaY > 0 ? 1 : -1))
  }

  function onKey(e){
    if (!guard()) return
    var els = list()
    var idx = currentIndex(els)
    var k = e.key
    if (k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Spacebar'){
      if (idx >= els.length - 1) return
      e.preventDefault(); goTo(idx + 1)
    } else if (k === 'ArrowUp' || k === 'PageUp'){
      if (idx <= 0) return
      e.preventDefault(); goTo(idx - 1)
    } else if (k === 'Home'){ e.preventDefault(); goTo(0) }
    else if (k === 'End'){ e.preventDefault(); goTo(els.length - 1) }
  }

  var touchY = 0
  function onTouchStart(e){ touchY = e.touches[0].clientY }
  function onTouchEnd(e){
    if (!guard()) return
    var ty = (e.changedTouches && e.changedTouches[0].clientY) || touchY
    var dy = touchY - ty
    if (Math.abs(dy) < 42) return
    var els = list()
    var idx = currentIndex(els)
    goTo(idx + (dy > 0 ? 1 : -1))           /* 上滑（dy>0）→ 下一屏 */
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKey)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
}
