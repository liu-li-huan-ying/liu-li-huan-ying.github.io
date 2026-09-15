import { redrawCrackles } from './crackle.js'
/* 位移滤镜的基准幅度（视口 px）。**唯一来源**：Chrome.jsx 的滤镜用它渲染初始 scale，
   这里的几何计算（R = (Dmax − disp) / 0.70）也用它把「白核 + 位移」恰好卡在最远角上。
   两处若走散，墨团要么早到角上（末段无内容可爬）、要么永远够不到。 */
export const INK_DISP = { ink: 62, soft: 34 }

/* 径向渐变里「纯白核心」半径占 R 的比例。**唯一来源**：
   Chrome.jsx 的 inkGrad / inkGradSoft 的**第二个停点**用它，这里的 R 也用它反推。
   两边必须同一个数，否则白核够不到最远角 —— 实测过：浅色渐变的白核只到 60%，
   而 R 却按 0.70 反推，于是 s=1 时白核半径只有 1252px、离最远角差 243px；
   转场收场、遮罩被摘掉的那一刻，左下角会**突然提亮 20.87（10.5%）**。
   （量法：同一坐标在「遮罩仍在」与「收场后」两帧上取 5×5 均值，对照点残差 0.00。） */
export const INK_CORE = 0.72

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

  /* 总时长只从 --ink-dur 读 —— CSS 的转场组时长读的是同一个变量，两处不会走散。
     ⚠️ 不能直接 parseFloat：浏览器会把 500ms 规范化成 `.5s` 再吐回来，
     parseFloat 得 0.5，整段动画一帧就跑完（实测踩过：s 在 165ms 已经到 1）。
     所以先认单位。 */
  var DUR = (function(){
    var raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--ink-dur').trim()
    var n = parseFloat(raw)
    if (!(n > 0)) return 500
    return /ms\s*$/.test(raw) ? n : n * 1000
  })()

  /* 逐帧把 #inkBlot 从按钮位置放大。三段：落墨 → 洇开 → 爬行。

     500ms 里要还看得出「洇」而不是「闪」，靠三件事（这是这段动效的全部诀窍）：

     ① **先给那只墨滴留够被看见的时间。** 落墨段占 100ms（s 0.02→0.12 的一小团）。
        眼睛要先锁定「这儿落了一滴」，才谈得上「它摊开了」。原先落墨只占 6%
        —— 2400ms 时是 144ms，够；压到 500ms 就只剩 30ms（约 2 帧），等于没有，
        于是第一帧就已经是几百像素的大团，读起来只能是「闪」。
     ② **末段近乎匀速（1.25t−0.25t²，终点速度仍有 0.75）。** 用 easeOutQuart 那类，
        末段速度趋零，最后 1/4 时间几乎不覆盖任何面积，整段在 400ms 就「演完」了，
        多出的 100ms 是白等；匀速爬行则每一帧都在推进，到最后一帧仍可见。
     ③ **前缘的碎有下限。** 位移滤镜挂在 #inkBlot 的缩放里，幅度会跟着 s 一起缩 ——
        s 很小时墨点圆得发假。给个下限（DISP_FLOOR），刚落纸的墨滴本来就是碎的一小团。
        实际做法是每帧回写滤镜的 scale=amp/s，抵消掉外层缩放。

     每帧只改 transform 与一个滤镜属性，不新建对象，
     渐变与湍流都复用 defs 里的那一份。 */
  var bleedRAF = 0, bleedCancelled = false
  var DISP_FLOOR = 14          /* 前缘碎度的下限（视口 px）——只在 s < 14/disp 时才起作用 */
  function bleed(cx, cy, toInk){
    var g = document.getElementById('inkBlot')
    var rect = document.getElementById('inkRect')
    var map = document.getElementById(toInk ? 'inkDispMap' : 'inkDispMapSoft')
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
    var disp = toInk ? INK_DISP.ink : INK_DISP.soft
    /* feDisplacementMap 的位移是 scale × (通道值 − 0.5)，通道落在 [0,1]，
       所以每个像素被**向内或向外抽最多 disp/2**，不是 disp（早先按 disp 扣，多扣了一倍）。
       白核半径要在**最坏情况**下也盖住最远角：被往外抽得最狠的那一像素仍须落在
       白核里，即 CORE × R = Dmax + disp/2。这样 s=1 时角上是确切的白，
       不会留一块「收场瞬间才跳亮」的残影（浅色版曾因此差 243px、跳亮 10.5%）。
       两条渐变共用同一个 INK_CORE，所以两个方向的覆盖进度一致；
       「墨→纸更柔」的差别交给渐变中段停点与 INK_DISP.soft 更小的碎度去表达。 */
    var R = (Dmax + disp / 2) / INK_CORE
    if (!(R > 0)) R = Dmax / INK_CORE
    rect.setAttribute('x', cx - R)
    rect.setAttribute('y', cy - R)
    rect.setAttribute('width', 2 * R)
    rect.setAttribute('height', 2 * R)
    rect.setAttribute('fill', toInk ? 'url(#inkGrad)' : 'url(#inkGradSoft)')
    rect.setAttribute('filter', toInk ? 'url(#inkDisp)' : 'url(#inkDispSoft)')
    /* 每次换随机种子，避免每次都是同一团形状 */
    var turb = document.getElementById(toInk ? 'inkTurb' : 'inkTurbSoft')
    if (turb) turb.setAttribute('seed', String((Math.random() * 1000) | 0))

    /* 种子取好之后再落第一笔：**必须在 startViewTransition 之前同步写好初值**。
       遮罩一挂上就开始生效，若这一刻 #inkBlot 还没有 transform，它会按原始尺寸
       （整屏那么大）渲染一帧 —— 那一帧就是「整屏啪一下切过去」，正是要避免的「闪」。
       所以先同步把 s 定在起点，rAF 只负责往后推。 */
    function place(sc){
      g.setAttribute('transform',
        'translate(' + cx + ' ' + cy + ') scale(' + sc +
        ') translate(' + (-cx) + ' ' + (-cy) + ')')
      if (map){
        var amp = disp * sc
        if (amp < DISP_FLOOR){
          /* 只有碎度触及下限时才回写 —— 其余时候滤镜本来就等于基准值，
             不必每帧多写一个属性去作废滤镜缓存 */
          map.setAttribute('scale', String(DISP_FLOOR / sc))
        } else if (map.getAttribute('scale') !== String(disp)){
          map.setAttribute('scale', String(disp))
        }
      }
    }
    var S0 = 0.02
    place(S0)

    var start = null
    function frame(ts){
      if (bleedCancelled) return   // 转场已结束，绝不回头再写 transform
      if (start === null) start = ts
      var p = Math.min(1, (ts - start) / DUR)
      var s
      if (p < 0.20){           // 落墨 100ms：墨滴先只洇开一小圈湿痕，让人看清「落在哪」
        var t0 = p / 0.20
        s = S0 + (0.12 - S0) * (t0 * t0)
      } else if (p < 0.50){    // 洇开 150ms：快速摊到近七成
        var t1 = (p - 0.20) / 0.30, e1 = 1 - Math.pow(1 - t1, 3)
        s = 0.12 + (0.68 - 0.12) * e1
      } else {                 // 爬行 250ms：近乎匀速，到最后一帧仍在推进
        var t2 = (p - 0.50) / 0.50
        s = 0.68 + (1 - 0.68) * (1.25 * t2 - 0.25 * t2 * t2)
      }
      place(s)
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
    /* 位移幅度也要还原 —— 落墨段会把 scale 顶到几百（靠外层缩放抵消），
       留着的话下次换地色的第一帧前缘会碎得过了头 */
    ;['inkDispMap', 'inkDispMapSoft'].forEach(function(id){
      var m = document.getElementById(id)
      if (m) m.setAttribute('scale', id === 'inkDispMap' ? String(INK_DISP.ink) : String(INK_DISP.soft))
    })
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
