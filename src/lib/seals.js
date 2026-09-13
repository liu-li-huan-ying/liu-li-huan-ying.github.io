import { SEAL_GLYPHS } from './sealGlyphs.js'
/* ══════════════════════════════════════════════════════════════
   篆书印
   印面由《说文解字》小篆字形现场组装，不靠字体、不靠图片。
     · 朱文（阳刻）：白地红字，细边框
     · 白文（阴刻）：红地白字，字形从印地里挖掉，笔画加粗成「满白」
   一个字可能由多个部件构成（如「璃」＝ 玉 + 离），每个部件带自己的
   平移与横向压缩 —— 小篆的偏旁本就要写得窄长，不能等比放大充数。
   ══════════════════════════════════════════════════════════════ */
export function initSeals(){
  var G = SEAL_GLYPHS || {};
  var seq = 0;

  /* 一个字格：交给嵌套 svg 去等比缩放并居中，比手工算比例可靠得多 */
  function cell(ch, x, y, w, h, attrs){
    var g = G[ch];
    if (!g) return '';
    var d = g.map(function(p){
      return '<path d="' + p[0] + '"' + (p[1] ? ' transform="' + p[1] + '"' : '') + '/>';
    }).join('');
    return '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
      '" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid meet"' + attrs + '>' + d + '</svg>';
  }

  /* 版式按 (列, 行) 走：2 列或 2 行就出长条印 */
  function build(chars, cols, rows, kind){
    var W = cols === 2 ? 680 : 400, H = rows === 2 ? 680 : 400;
    var cw = W / cols, chh = H / rows;
    var grid = '', i = 0, r, c;
    /* 白文笔画要加粗，否则红地上一片细线，压不住 */
    var attrs = kind === 'bai'
      ? ' fill="#000" stroke="#000" stroke-width="15" stroke-linejoin="round"'
      : ' fill="currentColor" stroke="currentColor" stroke-width="6" stroke-linejoin="round"';
    /* 印序：先右列、后左列，列内自上而下 —— 传统印章就是竖排右起。
       按行列读会得到「琉 璃 / 幻 影」，四字姓名印那样排是错的。
       单行一列（引首、年号）两种排法一致，都是自上而下 */
    for (c = cols - 1; c >= 0; c--)
      for (r = 0; r < rows; r++)
        grid += cell(chars.charAt(i++), c * cw, r * chh, cw, chh, attrs);

    var B = 16, S = kind === 'bai' ? 10 : 8, iw = W - 2 * B, ih = H - 2 * B;
    var box = '<rect x="' + B + '" y="' + B + '" width="' + iw + '" height="' + ih + '"';
    var inner;
    if (kind === 'bai'){
      var id = 'sm' + (++seq);
      inner = '<mask id="' + id + '"><rect width="' + W + '" height="' + H +
          '" fill="#fff"/><g>' + grid + '</g></mask>' +
        box + ' fill="currentColor" mask="url(#' + id + ')"/>' +
        box + ' fill="none" stroke="currentColor" stroke-width="' + S + '"/>';
    } else {
      inner = grid + box + ' fill="none" stroke="currentColor" stroke-width="' + S + '"/>';
    }
    return '<svg class="seal" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true">' +
      '<g filter="url(#seal-carve)">' + inner + '</g></svg>';
  }

  /* 干支：公元 4 年为甲子年，六十甲子一轮回 */
  function ganZhi(y){
    var gan = '甲乙丙丁戊己庚辛壬癸', zhi = '子丑寅卯辰巳午未申酉戌亥';
    var i = ((y - 4) % 60 + 60) % 60;
    return gan.charAt(i % 10) + zhi.charAt(i % 12);
  }

  function mount(){
    var gz = ganZhi(new Date().getFullYear());
    var slots = document.querySelectorAll('[data-seal],[data-seal-year]');
    for (var i = 0; i < slots.length; i++){
      var el = slots[i];
      var spec = el.getAttribute('data-seal') ||
        (el.hasAttribute('data-seal-year') ? gz + '|1|2|bai' : '');
      if (!spec) continue;
      var f = spec.split('|');
      el.innerHTML = build(f[0], +f[1] || 1, +f[2] || 1, f[3] || 'zhu');
      /* 小印换轻档滤镜：30px 上下的印经不起大位移，会糊 */
      var svg = el.firstChild, g = svg && svg.firstChild;
      if (g && el.offsetWidth < 42) g.setAttribute('filter', 'url(#seal-carve-sm)');
    }
    /* 年号只在这一处推算：落款、目次、牌记都挂 [data-gz]，各取同一个干支 */
    var ys = document.querySelectorAll('[data-gz]');
    for (var k = 0; k < ys.length; k++) ys[k].textContent = gz;
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
}
