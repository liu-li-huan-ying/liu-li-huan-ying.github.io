/* ══════════════════════════════════════════════════════════════
   7 · 器物反馈 & 自绘光标
   语言统一于「纸与釉」：触碰釉面起涟漪（青瓷细环 + 琥珀内环）、
   换地色时先起一笔小墨点再交由 1.8s 大洇、点到印章落款则钤印。
   克制优先——涟漪铺满，墨点只给换地色，钤印只给印。
   全部只动 transform / opacity；位置只用 clientX/Y，绝不读布局。
   ══════════════════════════════════════════════════════════════ */
export function initCursor(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  var root = document.documentElement

  /* ── 反馈层 ── */
  var fx = document.createElement('div')
  fx.id = 'fx'; fx.setAttribute('aria-hidden', 'true')
  document.body.appendChild(fx)

  /* 对象池：每类预建、循环复用，免得连点时常建常删，制造 GC 抖动 */
  var POOLS = {}, POOL_MAX = 12
  function take(type){
    var pool = POOLS[type] || (POOLS[type] = [])
    for (var i = 0; i < pool.length; i++){
      if (!pool[i].classList.contains('on')) return pool[i]
    }
    var n = document.createElement('i')
    n.className = 'fb fb-' + type
    n.addEventListener('animationend', function(){ n.classList.remove('on') })
    fx.appendChild(n); pool.push(n)
    if (pool.length > POOL_MAX) fx.removeChild(pool.shift())
    return n
  }

  /* 语义分流：印章 > 换地色 > 通用可交互 / 釉面 */
  function pick(el){
    if (!el || !el.closest) return null
    var ex = el.closest('[data-fb]')
    if (ex) return ex.getAttribute('data-fb')
    if (el.closest('.seal-slot')) return 'seal'
    if (el.closest('[data-theme-btn]')) return 'ink'
    if (el.closest('a[href], button, .ulink, .work, .glaze, .hero')) return 'ripple'
    return null
  }
  /* 导航 / 目次 / 书耳里的链接点击频繁，涟漪调小调淡 */
  function dim(el){
    return (el.closest && el.closest('.nav, .toc, #ear')) ? ' dim' : ''
  }

  function spawn(type, x, y, el){
    if (reduce) type = 'flash'
    var n = take(type)
    n.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)'
    n.className = 'fb fb-' + type +
      (type === 'ripple' && el && el.closest ? dim(el) : '')
    void n.offsetWidth                 /* 强制一次重排，让动画可重放 */
    n.classList.add('on')
  }

  document.addEventListener('pointerdown', function(e){
    if (e.button) return                              /* 只认左键 / 触控 */
    if (root.classList.contains('vt-theme')) return    /* 换地色的大洇进行中，不叠小洇 */
    var type = pick(e.target)
    if (type) spawn(type, e.clientX, e.clientY, e.target)
  }, true)

  /* ── 自绘光标：仅精确指针设备；触摸 / 无 JS / reduced-motion 一律原生 ── */
  if (!fine || reduce) return
  root.classList.add('cursor-on')
  var cur = document.createElement('div')
  cur.id = 'cursor'; cur.setAttribute('aria-hidden', 'true')
  cur.innerHTML = '<i class="cur-ring"></i><i class="cur-dot"></i>'
  document.body.appendChild(cur)

  var HOT = 'a[href], button, .ulink, .work, .glaze, .seal-slot, [data-theme-btn], [data-fb]'
  var shown = false
  document.addEventListener('pointermove', function(e){
    cur.style.transform = 'translate3d(' + e.clientX + 'px,' + e.clientY + 'px,0)'
    if (!shown){ shown = true; cur.style.opacity = '1' }
    var hot = (e.target && e.target.closest) ? e.target.closest(HOT) : null
    cur.classList.toggle('hot', !!hot)
  }, { passive: true })
  document.addEventListener('pointerdown', function(){ cur.classList.add('down') }, true)
  document.addEventListener('pointerup', function(){ cur.classList.remove('down') }, true)
  /* 指针移出窗口就藏起来，别钉在屏幕边缘 */
  document.addEventListener('mouseout', function(e){
    if (!e.relatedTarget && !e.toElement){ cur.style.opacity = '0'; shown = false }
  })
  document.addEventListener('mouseover', function(){
    if (!shown){ shown = true; cur.style.opacity = '1' }
  })
}
