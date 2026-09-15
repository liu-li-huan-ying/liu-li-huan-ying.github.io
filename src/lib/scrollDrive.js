import { setCrackleHeal } from './crackle.js'
/* ══════════════════════════════════════════════════════════════
   4 · 滚动驱动：阅读进度 + 裂缝愈合 + 提示淡出
   全部合进一个 rAF，滚动监听 passive
   ══════════════════════════════════════════════════════════════ */
export function initScrollDrive(){
  /* 引首这一组节点随首页挂载/卸载而整批换掉（React key={route}）——
     别在 init 时缓存旧引用，每次 measure 重新取，否则换页回来进度条就不动了 */
  var bar, hero, fill, cap, healBox
  var doc = document.documentElement
  var ticking = false

  /* ── 右侧书耳 ── */
  var ear = document.getElementById('ear')
  var earFill = document.getElementById('earFill')
  var earFish = document.getElementById('earFish')
  var earLinks = ear ? [].slice.call(ear.querySelectorAll('a[data-sec]')) : []
  var earHide = null, live = false, lastWake = 0, lastSection = -2

  /* 布局量全部缓存。原来每帧读 getBoundingClientRect() 和 scrollHeight，
     等于每帧强制一次同步布局，滚动时会明显掉帧 */
  var heroTop = 0, heroRange = 0, maxScroll = 1
  var lastP = -1, lastH = -1, lastEarP = -1
  var secTops = []
  /* 越过这条线就算翻到这一篇。轴的起点也从同一条线起算，
     否则鱼尾按全页比例走、签条从「壹」开始，两者永远差一段，对不上 */
  var EAR_LINE = 90
  var spineFrom = 0

  function measure(){
    var y = window.pageYOffset || doc.scrollTop
    bar = document.getElementById('progress')
    hero = document.querySelector('.hero')
    fill = document.getElementById('healFill')
    cap = document.getElementById('healCap')
    healBox = document.getElementById('heal')
    /* innerHeight 直接用，避免 scrollHeight 触发额外布局 */
    maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight)
    if (hero){
      heroTop = hero.getBoundingClientRect().top + y
      heroRange = hero.offsetHeight - window.innerHeight
    }
    if (earLinks.length){
      secTops.length = 0
      for (var i = 0; i < earLinks.length; i++){
        var el = document.getElementById(earLinks[i].getAttribute('data-sec'))
        secTops.push(el ? el.getBoundingClientRect().top + y : 0)
      }
      /* 卷次表按篇幅分段：某篇在轴上占多长，就是它在滚动行程里占多长。
         轴从「壹」起算 —— 引首本来就没有签条，把首屏那两百来 vh 也塞进轴里，
         六个签条会被挤成一撮，鱼尾也会一直飘在签条前面 */
      spineFrom = Math.max(0, secTops[0] - EAR_LINE)
      var spineRange = Math.max(1, maxScroll - spineFrom)
      for (var m = 0; m < earLinks.length; m++){
        /* flex-grow 只要比值，所以直接拿像素当数值用，不必归一化 */
        var from = Math.max(0, secTops[m] - EAR_LINE) - spineFrom
        var to = m + 1 < secTops.length
          ? Math.max(0, secTops[m + 1] - EAR_LINE) - spineFrom
          : spineRange
        var li = earLinks[m].parentNode
        if (li && li.style) li.style.setProperty('--el', Math.max(1, to - from).toFixed(1))
      }
    }
  }

  /* 现身 / 隐身：滚动或指针靠近就亮，闲置 1.6 秒收回页边 */
  function sleep(){
    live = false
    if (ear) ear.classList.remove('live')
    earHide = null
  }
  function wake(){
    if (!ear) return
    if (!live){ live = true; ear.classList.add('live') }
    var now = Date.now()
    if (now - lastWake < 220) return    /* 滚动中不必每个事件都重建定时器 */
    lastWake = now
    if (earHide) clearTimeout(earHide)
    earHide = setTimeout(sleep, 1600)
  }
  if (ear){
    /* 指针停在上面时不能收回，否则刚想点它就没了 */
    ear.addEventListener('mouseenter', function(){
      if (earHide) clearTimeout(earHide)
      earHide = null
      if (!live){ live = true; ear.classList.add('live') }
    })
    ear.addEventListener('mouseleave', function(){
      if (earHide) clearTimeout(earHide)
      earHide = setTimeout(sleep, 700)
    })
  }

  /* 愈合的统一落点：canvas + 进度条 + 「裂过，然后合上」标签，只在这一处写。
     浮现的话随愈合进度**渐显**（约 0.78→1 淡入），于是半途也看得见、合上后留住人看 */
  function renderHeal(h){
    if (Math.abs(h - lastH) <= 0.0012) return
    setCrackleHeal(h)
    if (fill) fill.style.transform = 'scaleX(' + h.toFixed(4) + ')'
    if (cap){
      var o = (h - 0.78) / 0.22
      o = o < 0 ? 0 : (o > 1 ? 1 : o)
      cap.style.opacity = o.toFixed(3)
      cap.classList.toggle('on', h > 0.78)
    }
    lastH = h
  }

  function frame(){
    var y = window.pageYOffset || doc.scrollTop

    /* 阅读进度 */
    var p = y / maxScroll
    p = p < 0 ? 0 : (p > 1 ? 1 : p)
    if (bar && Math.abs(p - lastP) > 0.0008){
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')'
      lastP = p
    }
    /* 书耳上的进度：与签条同一把尺子，从「壹」量到文末 */
    if (earFill){
      var pe = (y - spineFrom) / Math.max(1, maxScroll - spineFrom)
      pe = pe < 0 ? 0 : (pe > 1 ? 1 : pe)
      if (Math.abs(pe - lastEarP) > 0.0008){
        earFill.style.setProperty('--p', pe.toFixed(4))
        if (earFish) earFish.style.setProperty('--fish', (pe * 100).toFixed(2) + '%')
        lastEarP = pe
      }
    }

    /* 当前篇次：最后一个已越过顶栏的章节。位置全部来自缓存，不查 DOM */
    if (earLinks.length){
      var line = y + EAR_LINE
      var cur = -1
      for (var s = 0; s < secTops.length; s++){
        if (secTops[s] <= line) cur = s
      }
      if (cur !== lastSection){
        if (lastSection >= 0 && earLinks[lastSection]){
          earLinks[lastSection].removeAttribute('aria-current')
        }
        if (cur >= 0) earLinks[cur].setAttribute('aria-current', 'true')
        lastSection = cur
      }
    }

    /* 裂缝愈合：在引首的滚动行程里完成，提前 18% 收尾好让人看清合上的样子。
       首屏没撑出滚动行程时（矮屏摊平 / 降级），退回「0.62 屏」的虚拟行程 ——
       否则要么拿接近 0 的除数算出跳飞的值，要么直接跳到已合上，动画就白做了。

       ⚠️ deck 下引首愈合由 deckNav 全权驱动（可逆转：往下愈合 / 往上回裂），
       这里不参与 —— 否则整屏停在卷首（y=0）会被算成 h=0，把已合上的又打回裂满。
       deck-mode 类只在与 deck 版面相称的视口挂上（见 App.jsx 的 matchMedia），
       所以认类就够了，不必再判一次高度 —— 判据只有那一处，别在这儿复制一份 */
    var deckOwnsHeal = doc.classList.contains('deck-mode')
    if (hero && !deckOwnsHeal){
      var h = 1
      var range = heroRange > 60 ? heroRange : window.innerHeight * 0.62
      if (range > 0){
        var raw = (y - heroTop) / range
        raw = raw < 0 ? 0 : (raw > 1 ? 1 : raw)
        h = raw / 0.82
        if (h > 1) h = 1
        if (healBox){
          healBox.style.opacity =
            String(Math.max(0, 1 - Math.max(0, raw - 0.9) / 0.1))
        }
      }
      renderHeal(h)
    }
    ticking = false
  }

  function onScroll(){
    wake()
    if (!ticking){ ticking = true; requestAnimationFrame(frame) }
  }

  /* 字体加载、图片落位、转屏、缩放都会改高度 —— 用 ResizeObserver 统一接住，
     比监听 load + 各种定时器可靠 */
  if ('ResizeObserver' in window){
    new ResizeObserver(function(){ measure(); onScroll() }).observe(document.body)
  }
  window.addEventListener('resize', function(){ measure(); onScroll() }, { passive: true })
  window.addEventListener('orientationchange', function(){ measure(); onScroll() }, { passive: true })
  window.addEventListener('scroll', onScroll, { passive: true })

  measure()
  frame()

  /* 换页后 DOM 整个换了，缓存的布局量全部作废（scrollHeight 也变了）。
     重挂监听会重复计一遍，所以留这个 refresh 给外面在换页后调。
     setHeal / getHeal 供 deckNav 搓引首「破镜重圆」的进度：同步定住某一愈合度、读当前进度 */
  return {
    refresh: function(){ measure(); onScroll() },
    setHeal: function(h){
      renderHeal(h < 0 ? 0 : (h > 1 ? 1 : h))
    },
    getHeal: function(){ return lastH < 0 ? 0 : lastH }
  }
}
