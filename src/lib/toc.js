/* ══════════════════════════════════════════════════════════════
   6 · 窄屏目次
   开：锁住背后的滚动；关：点链接 / 按 Esc / 转成宽屏
   ══════════════════════════════════════════════════════════════ */
export function initToc(){
  var btn = document.getElementById('tocBtn')
  var toc = document.getElementById('toc')
  if (!btn || !toc) return

  function isOpen(){ return toc.getAttribute('data-open') === 'true' }

  function set(open){
    toc.setAttribute('data-open', String(open))
    btn.setAttribute('aria-expanded', String(open))
    btn.setAttribute('aria-label', open ? '关闭目次' : '打开目次')
    document.body.classList.toggle('toc-open', open)
  }

  btn.addEventListener('click', function(){ set(!isOpen()) })

  /* 点了条目就收起，锚点滚动交给浏览器 */
  toc.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a') : null
    if (a) set(false)
  })

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && isOpen()){ set(false); btn.focus() }
  })

  var mq = window.matchMedia('(min-width:821px)')
  function onChange(){ if (mq.matches && isOpen()) set(false) }
  if (mq.addEventListener) mq.addEventListener('change', onChange)
  else if (mq.addListener) mq.addListener(onChange)
}
