/* ══════════════════════════════════════════════════════════════
   7 · 器物反馈
   语言统一于「纸与釉」：触碰釉面起涟漪（青瓷细环 + 琥珀内环）、
   换地色时先起一笔小墨点再交由洇墨（theme.js，500ms）、点到印章落款则钤印。
   克制优先——涟漪只认真正的可交互对象，墨点只给换地色，钤印只给印。
   全部只动 transform / opacity；位置只用 clientX/Y，绝不读布局。
   光标不在这里：指针是用户从系统借来的能力，原样交还。
   ══════════════════════════════════════════════════════════════ */
export function initCursor(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
    /* 不再把整块 .hero 算作热区：首屏任意空白处一点就起涟漪，
       等于到处都响 —— 到处都响和到处都不响，信息量一样是零 */
    if (el.closest('a[href], button, .ulink, .work, .glaze')) return 'ripple'
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

  /* 光标一律交给系统：指针是用户从操作系统借来的能力，
     夺走它再画一个，等于让用户用作者的手感替代自己的手感。
     涟漪 / 墨点 / 钤印三套反馈保留 —— 反馈是"回应"，光标是"能力"，两者不是一回事。 */
}
