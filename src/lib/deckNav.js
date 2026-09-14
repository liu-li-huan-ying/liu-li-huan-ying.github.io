/* ══════════════════════════════════════════════════════════════
   整屏吸附导航（首页 deck-mode）
   滚轮 / 方向键 / 空格 / PageUp·Down / 触摸滑动 → 跳到上一或下一整屏。
   只在 <html class="deck-mode"> 下生效（即首页路由），子页面不受影响。
   与 scroll-snap 配合：跳转时临时关掉 snap，让平滑滚动演完，落定后再恢复，
   避免被 mandatory 的磁吸提前拽停。尊重 reduced-motion（瞬移、不加锁）。
   ══════════════════════════════════════════════════════════════ */
export function initDeckNav(){
  var root = document.documentElement
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* 首页六屏的 id 顺序，必须与 DOM 顺序一致 */
  var SECTIONS = ['top', 'material', 'work', 'about', 'writing', 'contact', 'colophon']
  var lock = false

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

  function go(i, els){
    els = els || list()
    i = Math.max(0, Math.min(i, els.length - 1))
    var el = els[i]
    if (!el) return
    if (reduce){
      el.scrollIntoView({ behavior: 'auto', block: 'start' })
      return
    }
    /* 临时关 snap，平滑滚动才不会被磁吸打断 */
    var prev = root.style.scrollSnapType
    root.style.scrollSnapType = 'none'
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.clearTimeout(go._t)
    go._t = window.setTimeout(function(){ root.style.scrollSnapType = prev }, 760)
  }

  function guard(){
    if (!root.classList.contains('deck-mode')) return false
    if (document.body.classList.contains('toc-open')) return false
    return true
  }

  function lockThen(fn){
    if (lock) return
    lock = true
    fn()
    window.setTimeout(function(){ lock = false }, reduce ? 120 : 820)
  }

  function onWheel(e){
    if (!guard()) return
    if (Math.abs(e.deltaY) < 8) return
    e.preventDefault()                       /* 吞掉原生连续滚动，只留整屏跳 */
    var els = list()
    var idx = currentIndex(els)
    var next = idx + (e.deltaY > 0 ? 1 : -1)
    if (next < 0 || next >= els.length) return
    lockThen(function(){ go(next, els) })
  }

  function onKey(e){
    if (!guard()) return
    var els = list()
    var idx = currentIndex(els)
    var k = e.key
    if (k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Spacebar'){
      if (idx >= els.length - 1) return
      e.preventDefault(); lockThen(function(){ go(idx + 1, els) })
    } else if (k === 'ArrowUp' || k === 'PageUp'){
      if (idx <= 0) return
      e.preventDefault(); lockThen(function(){ go(idx - 1, els) })
    } else if (k === 'Home'){ e.preventDefault(); go(0, els) }
    else if (k === 'End'){ e.preventDefault(); go(els.length - 1, els) }
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
    var next = idx + (dy > 0 ? 1 : -1)       /* 上滑（dy>0）→ 下一屏 */
    if (next < 0 || next >= els.length) return
    lockThen(function(){ go(next, els) })
  }

  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('keydown', onKey)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
}
