/* ══════════════════════════════════════════════════════════════
   2 · 入场编排
   无观察器 → 全显；有观察器 → 视口内同步显示；兜底定时，绝不留白屏
   ══════════════════════════════════════════════════════════════ */
export function initReveal(){
  /* 逐字揭示：section 标题原先把整句塞进一个 .ch，--i 恒为 0，
     于是只有首屏「琉璃幻影」四字是真逐字。这里在入场观察器启动**之前**，
     把纯中日韩的整句 .ch 就地拆成逐字 span（以原 --i 为起点递增），
     文档里「每字 +95ms」才对所有标题成立。
     含空格/拉丁的（如 Glazed Mirage）不拆——空格会塌成 0 宽。 */
  var masks = document.querySelectorAll('.mask');
  for (var mi = 0; mi < masks.length; mi++){
    var kids = [].slice.call(masks[mi].children);
    for (var kj = 0; kj < kids.length; kj++){
      var el = kids[kj];
      if (!el.classList || !el.classList.contains('ch')) continue;
      var txt = el.textContent;
      if (txt.length < 2 || !/^[\u3400-\u9fff\u3007·]+$/.test(txt)) continue;
      var base = parseInt(el.style.getPropertyValue('--i') || '0', 10) || 0;
      var frag = '';
      for (var k = 0; k < txt.length; k++)
        frag += '<span class="ch" style="--i:' + (base + k) + '">' + txt.charAt(k) + '</span>';
      el.outerHTML = frag;
    }
  }

  var all = document.querySelectorAll('.rv, .mat, .sec-head, .glaze, .seal-slot')
  var items = []
  for (var i = 0; i < all.length; i++){
    if (items.indexOf(all[i]) === -1) items.push(all[i])
  }
  if (!items.length) return

  function show(el){ el.classList.add('in') }

  if (!('IntersectionObserver' in window)){
    for (var m = 0; m < items.length; m++) show(items[m])
    return
  }

  var vh = window.innerHeight || document.documentElement.clientHeight
  items.forEach(function(el){
    if (el.getBoundingClientRect().top < vh * 0.94) show(el)
  })

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){ show(en.target); io.unobserve(en.target) }
    })
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

  items.forEach(function(el){ if (!el.classList.contains('in')) io.observe(el) })

  setTimeout(function(){ items.forEach(show) }, 1600)
}
