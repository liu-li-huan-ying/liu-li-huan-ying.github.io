export function initContacts(){
  var KEY = 'gm'

  function reveal(enc){
    try{
      var raw = atob(enc), out = ''
      for (var i = 0; i < raw.length; i++){
        out += String.fromCharCode(raw.charCodeAt(i) ^ KEY.charCodeAt(i % KEY.length))
      }
      return out
    }catch{ return '' }
  }

  function write(text){
    if (navigator.clipboard && navigator.clipboard.writeText){
      return navigator.clipboard.writeText(text)
    }
    /* 非安全上下文（如 file:// 直接打开）没有 clipboard API：
       退回临时 textarea + execCommand，功能不缺 */
    return new Promise(function(res, rej){
      var t = document.createElement('textarea')
      t.value = text; t.setAttribute('readonly', '')
      t.style.cssText = 'position:fixed;top:-1000px;left:0;opacity:0'
      document.body.appendChild(t)
      t.select()
      var ok = false
      try{ ok = document.execCommand('copy') }catch{}
      document.body.removeChild(t)
      if (ok) res(); else rej(new Error('copy failed'))
    })
  }

  document.addEventListener('click', function(e){
    var el = (e.target && e.target.closest) ? e.target.closest('.copy[data-copy]') : null
    if (!el) return
    e.preventDefault()
    var text = reveal(el.getAttribute('data-copy'))
    if (!text) return
    write(text).then(function(){
      var sp = el.querySelector('span')
      if (!sp) return
      if (el.__lmLabel === undefined) el.__lmLabel = sp.textContent
      el.classList.add('done')
      sp.textContent = '已复制'
      clearTimeout(el.__lmT)
      el.__lmT = setTimeout(function(){
        el.classList.remove('done')
        sp.textContent = el.__lmLabel
      }, 1500)
    }, function(){})
  })
}
