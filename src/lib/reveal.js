/* ══════════════════════════════════════════════════════════════
   2 · 入场编排
   无观察器 → 全显；有观察器 → 视口内同步显示；兜底定时，绝不留白屏
   ══════════════════════════════════════════════════════════════ */
var SEL = '.rv, .mat, .sec-head, .glaze, .seal-slot'
var io = null
var watcher = null
var fallback = 0
var waiting = []
var seen = new WeakSet()

function show(el){ el.classList.add('in') }

function inView(el){
  var vh = window.innerHeight || document.documentElement.clientHeight
  return el.getBoundingClientRect().top < vh * 0.94
}

function ensureIO(){
  if (io) return io
  io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){ show(en.target); io.unobserve(en.target) }
    })
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })
  return io
}

/* 逐字揭示：section 标题原先把整句塞进一个 .ch，--i 恒为 0，
   于是只有首屏「琉璃幻影」四字是真逐字。这里在入场之前，把纯中日韩的整句 .ch
   就地拆成逐字 span（以原 --i 为起点递增），文档里「每字 +95ms」才对所有标题成立。
   含空格/拉丁的（如 Glazed Mirage）不拆——空格会塌成 0 宽。 */
function splitMasks(root){
  var masks = root.querySelectorAll('.mask')
  for (var mi = 0; mi < masks.length; mi++){
    var kids = [].slice.call(masks[mi].children)
    for (var kj = 0; kj < kids.length; kj++){
      var el = kids[kj]
      if (!el.classList || !el.classList.contains('ch')) continue
      var txt = el.textContent
      if (txt.length < 2 || !/^[\u3400-\u9fff\u3007·]+$/.test(txt)) continue
      var base = parseInt(el.style.getPropertyValue('--i') || '0', 10) || 0
      var frag = ''
      for (var k = 0; k < txt.length; k++)
        frag += '<span class="ch" style="--i:' + (base + k) + '">' + txt.charAt(k) + '</span>'
      el.outerHTML = frag
    }
  }
}

function collect(root){
  var out = []
  var hits = root.querySelectorAll(SEL)
  for (var i = 0; i < hits.length; i++) out.push(hits[i])
  if (root.nodeType === 1 && root.matches(SEL) && out.indexOf(root) === -1) out.push(root)
  return out
}

/* 把一批元素接进入场编排：已在视口内的立刻显形，其余的交给观察器；
   兜底定时器一并续上 —— 观察器怎么抖，都不留 opacity:0 的空白 */
function enroll(items){
  var fresh = []
  for (var i = 0; i < items.length; i++){
    var el = items[i]
    if (seen.has(el) || el.classList.contains('in')) continue
    seen.add(el)
    fresh.push(el)
  }
  if (!fresh.length) return

  if (!('IntersectionObserver' in window)){
    for (var m = 0; m < fresh.length; m++) show(fresh[m])
    return
  }

  var obs = ensureIO()
  for (var j = 0; j < fresh.length; j++){
    if (inView(fresh[j])) show(fresh[j])
    else { obs.observe(fresh[j]); waiting.push(fresh[j]) }
  }
  clearTimeout(fallback)
  fallback = setTimeout(function(){
    for (var n = 0; n < waiting.length; n++) if (waiting[n].isConnected) show(waiting[n])
    waiting.length = 0
  }, 1600)
}

export function initReveal(){
  splitMasks(document)
  enroll(collect(document))

  /* 换页之外，React 自己还会往 DOM 里挂新节点 —— 作品目录按签条筛选后重建的卡片
     就是。那些 .rv 从没被观察过，会永远停在 opacity:0：标题写着「1 件」，
     下面却是一片空白。装一次 MutationObserver 守着，新来的照样走同一套入场 */
  if (watcher || !('MutationObserver' in window)) return
  watcher = new MutationObserver(function(records){
    var fresh = []
    for (var i = 0; i < records.length; i++){
      var added = records[i].addedNodes
      for (var j = 0; j < added.length; j++){
        var n = added[j]
        if (n.nodeType !== 1) continue
        /* 正文（markdown 渲染）一次进来上千个节点，且里面没有 .rv，整支跳过 */
        if (n.closest && n.closest('.prose')) continue
        splitMasks(n)
        var got = collect(n)
        for (var k = 0; k < got.length; k++) if (fresh.indexOf(got[k]) === -1) fresh.push(got[k])
      }
    }
    if (fresh.length) enroll(fresh)
  })
  watcher.observe(document.body, { childList: true, subtree: true })
}
