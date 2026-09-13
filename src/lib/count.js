/* ══════════════════════════════════════════════════════════════
   5 · 数字滚动（进入视口触发一次）
   ══════════════════════════════════════════════════════════════ */
export function initCount(){
  var nodes = [].slice.call(document.querySelectorAll('[data-count]'))
  if (!nodes.length) return
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function run(el){
    var to = parseFloat(el.dataset.count) || 0
    if (reduce){ el.textContent = String(to); return }
    var t0 = 0
    function step(ts){
      if (!t0) t0 = ts
      var p = Math.min(1, (ts - t0) / 1400)
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }

  if (!('IntersectionObserver' in window)){
    nodes.forEach(run); return
  }
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){
      if (e.isIntersecting){ run(e.target); io.unobserve(e.target) }
    })
  }, { threshold: 0.5 })
  nodes.forEach(function(n){ io.observe(n) })
}
