import { getRollTransition } from './rollTransition.js'
/* ══════════════════════════════════════════════════════════════
   3.5 · 换篇转场：点导航 / 目次 / 书耳，手卷滚过一格
   只在真的换了一篇时才开场；差几像素的不算，别为一次微调铺张。
   不支持或用户要求少动，就原样退回浏览器的锚点滚动。
   转场本体在 rollTransition.js —— 首页整屏吸附（deckNav）复用同一份。
   ══════════════════════════════════════════════════════════════ */
export function initRoll(){
  var c = getRollTransition()
  if (!document.startViewTransition || c.reduce) return

  document.addEventListener('click', function(e){
    if (e.defaultPrevented || e.button !== 0) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    var a = e.target && e.target.closest ? e.target.closest('a[href^="#"]') : null
    if (!a) return
    var id = a.getAttribute('href').slice(1)
    var el = id && document.getElementById(id)
    if (!el) return

    var y = c.targetY(el)
    e.preventDefault()
    if (c.isBusy() || Math.abs(y - c.curY()) < 24){ c.jump(y); return }
    var run = function(){
      c.go(el)
      /* 地址栏还是要跟得上，但不能让浏览器再自己滚一次 */
      if (history.pushState) history.pushState(null, '', '#' + id)
    }
    /* 从窄屏目次里点的：先让目次收起来再开场，
       不然旧快照里还盖着一层目次，一开场就凭空消失 */
    if (document.body.classList.contains('toc-open')) setTimeout(run, 300)
    else run()
  }, false)

  /* 后退键回到某个篇次：老老实实跳过去，不再开场转场 */
  window.addEventListener('popstate', function(){
    var id = (location.hash || '').slice(1)
    var el = id && document.getElementById(id)
    if (el) c.jump(c.targetY(el))
  })
}
