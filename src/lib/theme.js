import { redrawCrackles } from './crackle.js'
/* ══════════════════════════════════════════════════════════════
   3 · 地色切换（纸 / 墨，从按钮位置洇开）
   默认是「洇墨」：用 SVG 湍流位移遮罩把新地色从按钮位置渗出来；
   不支持遮罩的浏览器回退到 clip-path 圆形硬边（ink-wipe 关键帧）。
   ══════════════════════════════════════════════════════════════ */
export function initTheme(){
  var root = document.documentElement
  var btns = [].slice.call(document.querySelectorAll('[data-theme-btn]'))
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function apply(v){
    root.setAttribute('data-theme', v)
    btns.forEach(function(b){
      b.setAttribute('aria-pressed', String(b.dataset.themeBtn === v))
    })
    try { localStorage.setItem('lm-ground', v) } catch {}
  }

  /* 特性检测：不靠 @supports 猜，而是真去查遮罩属性与滤镜节点是否齐活。
     缺 startViewTransition 或 CSS 遮罩不支持，或 DOM 里没有 ink-mask /
     feDisplacementMap，就走 clip-path 降级，绝不强行上洇墨。 */
  function inkOk(){
    if (!('startViewTransition' in document)) return false
    if (!window.CSS || !CSS.supports) return false
    var maskProp = CSS.supports('mask', 'url("#ink-mask")') ||
                   CSS.supports('-webkit-mask', 'url("#ink-mask")')
    if (!maskProp) return false
    return !!(document.getElementById('ink-mask') &&
              document.getElementById('inkDisp') &&
              document.getElementById('inkBlot'))
  }
  var INK = inkOk()

  /* 逐帧把 #inkBlot 从按钮位置放大，s 走两段式：前 40% 快速摊到 .7，
     后 60% 缓慢爬满到 1。开头快（墨滴落下）、末段爬行（急剧减速），
     与假想的「墨在生宣上渗开」一致。每帧只改 transform，不新建对象，
     渐变与滤镜都复用 defs 里的那一份。 */
  var bleedRAF = 0, bleedCancelled = false
  function bleed(cx, cy, toInk){
    var g = document.getElementById('inkBlot')
    var rect = document.getElementById('inkRect')
    if (!g || !rect) return
    bleedCancelled = false
    var vw = window.innerWidth, vh = window.innerHeight
    // 取按钮到四个视口角的最大距离：让径向渐变的「实白核心(≈72%)」恰好在
    // s=1 时抵达最远那个角。若把 R 设成盖满整屏的定值（如 1.6×对角线），
    // 会在 s≈0.7 就把整屏洇满，末段「爬行」无内容可爬，视觉上像瞬间切换。
    var Dmax = 0, corners = [[0, 0], [vw, 0], [0, vh], [vw, vh]]
    for (var ci = 0; ci < 4; ci++) {
      var d = Math.sqrt((cx - corners[ci][0]) * (cx - corners[ci][0]) +
                        (cy - corners[ci][1]) * (cy - corners[ci][1]))
      if (d > Dmax) Dmax = d
    }
    var disp = toInk ? 62 : 34     // 与下方滤镜位移幅度一致
    // 位移滤镜会把「白核→黑」的过渡边界向外推最多 disp 像素，
    // 若不扣除，墨团会比几何计算早很多抵达最远角，末段「爬行」看不见。
    // 故 R 按 (Dmax - disp) 取，让「白核半径 + 位移」恰好在 s=1 时够到最远角。
    var R = (Dmax - disp) / 0.70
    if (!(R > 0)) R = Dmax / 0.70
    rect.setAttribute('x', cx - R)
    rect.setAttribute('y', cy - R)
    rect.setAttribute('width', 2 * R)
    rect.setAttribute('height', 2 * R)
    rect.setAttribute('fill', toInk ? 'url(#inkGrad)' : 'url(#inkGradSoft)')
    rect.setAttribute('filter', toInk ? 'url(#inkDisp)' : 'url(#inkDispSoft)')
    /* 每次换随机种子，避免每次都是同一团形状 */
    var turb = document.getElementById(toInk ? 'inkTurb' : 'inkTurbSoft')
    if (turb) turb.setAttribute('seed', String((Math.random() * 1000) | 0))

    var DUR = 2400, start = null
    function frame(ts){
      if (bleedCancelled) return   // 转场已结束，绝不回头再写 transform
      if (start === null) start = ts
      var p = Math.min(1, (ts - start) / DUR)
      var s
      /* 三段式，像真的一滴墨落在纸上：先落墨、再洇开、最后爬行。
         全程 2.4s —— 原来 1.8s 又是开头猛冲，湿痕还没看清就铺满了 */
      if (p < 0.06){           // 落墨：墨滴先几乎不动，在纸面洇开一小圈湿痕
        var t0 = p / 0.06
        s = 0.001 + (0.03 - 0.001) * (t0 * t0)
      } else if (p < 0.38){    // 洇开：快速摊到七成
        var t1 = (p - 0.06) / 0.32, e1 = 1 - Math.pow(1 - t1, 3)
        s = 0.03 + (0.7 - 0.03) * e1
      } else {                 // 爬行：越到边上越慢，一路湿痕爬到最远的角
        var t2 = (p - 0.38) / 0.62, e2 = 1 - Math.pow(1 - t2, 4)
        s = 0.7 + (1 - 0.7) * e2
      }
      g.setAttribute('transform',
        'translate(' + cx + ' ' + cy + ') scale(' + s +
        ') translate(' + (-cx) + ' ' + (-cy) + ')')
      if (p < 1) bleedRAF = requestAnimationFrame(frame)
    }
    bleedRAF = requestAnimationFrame(frame)
  }

  function cleanInk(){
    bleedCancelled = true                 // 先停帧循环，避免末帧回头写 transform
    if (bleedRAF) cancelAnimationFrame(bleedRAF)
    root.classList.remove('vt-theme', 'vt-ink', 'vt-theme-back')
    var g = document.getElementById('inkBlot')
    if (g) g.removeAttribute('transform') // 复位，不能留 mask 残留
  }

  try {
    var saved = localStorage.getItem('lm-ground')
    if (saved === 'paper' || saved === 'ink') apply(saved)
  } catch {}

  btns.forEach(function(b){
    b.addEventListener('click', function(){
      var v = b.dataset.themeBtn
      if (v === root.getAttribute('data-theme')) return
      if (!reduce && document.startViewTransition && INK){
        var r = b.getBoundingClientRect()
        var cx = r.left + r.width / 2
        var cy = r.top + r.height / 2
        root.style.setProperty('--vt-x', cx + 'px')
        root.style.setProperty('--vt-y', cy + 'px')
        /* vt-theme 把揭示限定在地色切换；vt-ink 启用 SVG 遮罩路径；
           vt-theme-back 标方向：墨→纸（变浅）位移减半、渐变更柔 */
        var toInk = (v === 'ink')
        root.classList.add('vt-theme', 'vt-ink')
        if (!toInk) root.classList.add('vt-theme-back')
        bleed(cx, cy, toInk)
        var t = document.startViewTransition(function(){
          apply(v)
          redrawCrackles()
        })
        t.finished.then(cleanInk, cleanInk)
      } else if (!reduce && document.startViewTransition){
        /* 降级：clip-path 圆形硬边展开（保留旧 ink-wipe 关键帧） */
        var rb = b.getBoundingClientRect()
        root.style.setProperty('--vt-x', (rb.left + rb.width / 2) + 'px')
        root.style.setProperty('--vt-y', (rb.top + rb.height / 2) + 'px')
        root.classList.add('vt-theme')
        var tf = document.startViewTransition(function(){
          apply(v)
          redrawCrackles()
        })
        tf.finished.then(function(){
          root.classList.remove('vt-theme')
        }, function(){
          root.classList.remove('vt-theme')
        })
      } else {
        /* reduced-motion 或都不支持：直接瞬时切换，不开遮罩 */
        apply(v)
        redrawCrackles()
      }
    })
  })
}
