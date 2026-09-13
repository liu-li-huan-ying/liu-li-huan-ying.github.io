/* 冰裂 · 破镜重圆 —— 可复用工厂（由设计稿原样抽出）。
   设计稿里两个实例是在脚本解析时直接建的（#crackle 引首大画心 / #crackleMat 材质板小样），
   但正式工程里这两块画布随首页挂载/卸载，所以这里改成显式 init/dispose。 */
export function createCrackle(cv, opt){
  if (!cv || !cv.getContext) return null
  opt = opt || {}
  var ctx = cv.getContext('2d')
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  var W = 0, H = 0, dpr = 1
  var cells = [], iron = [], gold = []   /* 釉片全集 + 按代分流，渲染免每帧重分 */

  /* 两代结构：先裂粗主网（铁线），再在每块粗胞元内裂细网（金丝）。
     这正是哥窑「金丝铁线」——粗黑线与细金线各成一代，
     不是旧版那种同一张网的线宽渐变 */
  var IRON = { w:1.1, a:0.52 }    /* 铁线：粗主网络，略沉；随釉色（--crack）深浅 */
  var GOLD = { w:0.55, a:0.30 }   /* 金丝：细网，暖金更跳脱，比旧 .18 显 */
  var AMBER = '178,130,55'        /* 琥珀：金丝与愈合同系暖色，不随主题翻转 */

  /* 愈合高光分三档，按「愈合进度 p」渐隐 —— 刚合上时最亮，快合拢时淡去 */
  var HEAL_LV = [
    { ph:0.34, a:0.40 }, { ph:0.67, a:0.22 }, { ph:1.01, a:0.10 }
  ]

  /* --crack 只在启动、resize、换主题时读 —— 每帧 getComputedStyle 会强制样式重算 */
  var rgb = '74,115,88'
  var glowGrad = null, GLOW_R = 1

  var SEED = opt.seed === undefined ? 20260826 : opt.seed
  var seed = SEED
  function rnd(){ seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296 }

  /* 每载入一次的微小扰动（仅未固定种子时生效）：让首屏冰裂每次刷新都有点不一样，
     但整体器形稳定——只挪动若干节点、改写细网，不做整体重排。
     固定种子的材质板小样 → wobble 恒为 0，永远是同一块标本 */
  var loadWobble = opt.seed === undefined ? ((Math.random() * 4294967296) >>> 0) : 0
  function makeWobble(){ var s = loadWobble || 1
    return function(){ s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 } }

  /* ── 真实冰裂：抖动网格撒点 + Voronoi 胞元 ──
     釉层冷却收缩时随机形核、扩展、相遇，三叉交角天然趋于 120°，
     形成 T 型接头与凸多边形胞元；整张网不存在任何「发源地」或径向对称。
     用零依赖的多源距离场（带噪声扰动）代替 d3-delaunay，
     免得运行时再吃一次网络依赖的亏 */

  /* 低频噪声：先撒一张粗噪声格再双线性插值到全栅格。
     直接给每像素独立噪声会让边界锯齿化，平滑噪声才能让边界像釉面般蠕虫状弯曲 */
  function makeNoise(cols, rows){
    var cw = Math.max(2, (cols / 8) | 0), ch = Math.max(2, (rows / 8) | 0)
    var c = []
    for (var i = 0; i <= cw; i++){ c[i] = []; for (var j = 0; j <= ch; j++) c[i][j] = rnd() * 2 - 1 }
    var f = new Float32Array(cols * rows)
    for (var y = 0; y < rows; y++){
      var fy = y / rows * ch, jy = fy | 0, ty = fy - jy; if (jy >= ch) jy = ch - 1
      for (var x = 0; x < cols; x++){
        var fx = x / cols * cw, jx = fx | 0, tx = fx - jx; if (jx >= cw) jx = cw - 1
        var a = c[jx][jy], b = c[jx+1][jy], d = c[jx][jy+1], e = c[jx+1][jy+1]
        var top = a + (b - a) * tx, bot = d + (e - d) * tx
        f[y*cols+x] = top + (bot - top) * ty
      }
    }
    return f
  }

  /* 抖动网格撒点：把画布按 G×G 单元铺开，每单元中心加 ≤0.85 格距的抖动。
     抖动打破规则格点带来的方形残留；向画布外多铺 pad 格，
     让边缘胞元被自然裁切而不是停在矩形边上 */
  function jitteredSeeds(cols, rows, count, pad, wr){
    var G = Math.ceil(Math.sqrt(count)), res = []
    var cw = (cols + 2*pad) / G, ch = (rows + 2*pad) / G
    for (var i = 0; i < G; i++) for (var j = 0; j < G; j++){
      var jx = (rnd()-0.5) * 0.85, jy = (rnd()-0.5) * 0.85
      if (wr){ jx += (wr()-0.5) * 0.5; jy += (wr()-0.5) * 0.5 }  /* 每载入微挪节点，格心仍稳 */
      res.push([ (i + 0.5 + jx) * cw - pad,
                 (j + 0.5 + jy) * ch - pad ])
    }
    return res
  }

  /* 多源距离场：每像素归属最近种子；到种子的距离平方上加噪声，
     边界便不再是笔直的垂直平分线，而呈蜿蜒的釉裂纹路 */
  function assignField(cols, rows, seeds, noise, nAmp){
    var owner = new Int32Array(cols * rows), n = seeds.length
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++){
      var best = 1e18, bi = 0
      for (var s = 0; s < n; s++){
        var dx = x - seeds[s][0], dy = y - seeds[s][1]
        var d = dx*dx + dy*dy + noise[y*cols+x] * nAmp
        if (d < best){ best = d; bi = s }
      }
      owner[y*cols+x] = bi
    }
    return owner
  }

  /* Lloyd 松弛：把种子反复挪到各自胞元的质心，让胞元大小趋于均匀。
     这一步是「每段裂纹都是一长条」的关键——不松弛时，靠得过近的两个种子
     会夹出一片碎小胞元（一小节一小节），离得远的又拉出一条长直边（一长条） */
  function lloyd(seeds, cols, rows, noise, nAmp, iters){
    var n = seeds.length
    for (var it = 0; it < iters; it++){
      var owner = assignField(cols, rows, seeds, noise, nAmp)
      var sx = new Float64Array(n), sy = new Float64Array(n), cnt = new Int32Array(n)
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++){
        var id = owner[y*cols+x]
        sx[id] += x; sy[id] += y; cnt[id]++
      }
      for (var i = 0; i < n; i++){
        if (cnt[i] < 4) continue
        var nx = sx[i]/cnt[i], ny = sy[i]/cnt[i]
        /* 只挪画布内的种子；外圈 pad 种子留在原处，免得被裁切后的质心拽到边上 */
        if (nx > 0.5 && nx < cols - 0.5 && ny > 0.5 && ny < rows - 0.5) seeds[i] = [nx, ny]
      }
    }
    return seeds
  }

  /* 细种子版的 Lloyd 松弛：归属用 assignFieldFine（只在同一粗胞元内比最近），
     于是每颗细种子只会在自家粗胞元内挪动 —— 凸多边形的质心必落在多边形内，
     不会越界跑到隔壁。松弛让细胞元大小均匀，细纹才是一根根长线而非长短参差 */
  function lloydFine(fine, owner1, cols, rows, noise, nAmp, iters){
    var n = fine.length
    for (var it = 0; it < iters; it++){
      var owner = assignFieldFine(cols, rows, fine, owner1, noise, nAmp)
      var sx = new Float64Array(n), sy = new Float64Array(n), cnt = new Int32Array(n)
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++){
        var id = owner[y*cols+x]
        if (id < 0) continue
        sx[id] += x; sy[id] += y; cnt[id]++
      }
      for (var i = 0; i < n; i++){
        if (cnt[i] < 3) continue
        fine[i][0] = sx[i]/cnt[i]; fine[i][1] = sy[i]/cnt[i]
      }
    }
    return fine
  }

  /* Douglas–Peucker 抽稀：把像素级的锯齿折线压成「少而准」的顶点，
     裂纹才是干净的长线，而不是一串小珠子。flat 为 [x0,y0,x1,y1,...] */
  function simplify(flat, eps){
    var n = flat.length / 2
    if (n < 4) return flat
    var keep = new Uint8Array(n), e2 = eps * eps
    keep[0] = 1; keep[n-1] = 1
    var stack = [0, n-1]
    while (stack.length){
      var b = stack.pop(), a = stack.pop()
      var ax = flat[a*2], ay = flat[a*2+1], bx = flat[b*2], by = flat[b*2+1]
      var dx = bx - ax, dy = by - ay, dd = dx*dx + dy*dy
      var far = -1, fmax = 0
      for (var i = a + 1; i < b; i++){
        var px = flat[i*2], py = flat[i*2+1], d
        if (dd === 0){ d = (px-ax)*(px-ax) + (py-ay)*(py-ay) }
        else {
          var t = ((px-ax)*dx + (py-ay)*dy) / dd
          if (t < 0) t = 0; else if (t > 1) t = 1
          var qx = ax + t*dx, qy = ay + t*dy
          d = (px-qx)*(px-qx) + (py-qy)*(py-qy)
        }
        if (d > fmax){ fmax = d; far = i }
      }
      if (fmax > e2 && far > a){ keep[far] = 1; stack.push(a, far, far, b) }
    }
    var out = []
    for (var k = 0; k < n; k++) if (keep[k]) out.push(flat[k*2], flat[k*2+1])
    return out
  }

  /* 细网距离场：像素只与「同属一个粗胞元」的细种子比较，
     于是细纹被粗边切割，乖乖待在每块粗胞元内部 */
  function assignFieldFine(cols, rows, fine, owner1, noise, nAmp){
    var owner = new Int32Array(cols * rows)
    var groups = {}
    for (var i = 0; i < fine.length; i++){
      var c1 = fine[i][2]; (groups[c1] || (groups[c1] = [])).push(i)
    }
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++){
      var grp = groups[owner1[y*cols+x]] || []
      var best = 1e18, bi = -1
      for (var g = 0; g < grp.length; g++){
        var s = grp[g], dx = x - fine[s][0], dy = y - fine[s][1]
        var d = dx*dx + dy*dy + noise[y*cols+x] * nAmp
        if (d < best){ best = d; bi = s }
      }
      owner[y*cols+x] = bi
    }
    return owner
  }

  /* 把距离场还原成一片片釉元：每个 seed 的边界像素按相对质心的极角排序，
     连成一条闭合折线。Voronoi 胞元本是凸多边形，极角排序能精确还原顶点顺序，
     于是「每片釉元 = 一条闭合 path」，愈合时整片作为一个单位。
     边界像素不足的 seed 仍保留占位（质心取种子本身），以稳住索引对齐 */
  function extractCells(cols, rows, owner, seeds, kind, scaleX, scaleY){
    var out = [], n = seeds.length, bnd = []
    for (var s = 0; s < n; s++) bnd[s] = []
    /* 边界取「跨界中点」而非各自拥有的像素：只向 右、下 两向探测，每条跨界只记一次；
       同一个中点同时登记给两侧胞元 —— 相邻胞元因此共用同一组顶点，
       两笔描线完全重合，不会一分为二。这一步是消除「双线 / 重影」的关键：
       若各画各的边界像素，A 在 x=k、B 在 x=k+1，天生错开一格，必然重影。 */
    for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++){
      var id = owner[y*cols+x]
      if (id < 0) continue
      if (x + 1 < cols){
        var rId = owner[y*cols+x+1]
        if (rId !== id){
          bnd[id].push([x + 0.5, y]); if (rId >= 0) bnd[rId].push([x + 0.5, y])
        }
      }
      if (y + 1 < rows){
        var dId = owner[(y+1)*cols+x]
        if (dId !== id){
          bnd[id].push([x, y + 0.5]); if (dId >= 0) bnd[dId].push([x, y + 0.5])
        }
      }
    }
    for (var s2 = 0; s2 < n; s2++){
      var bp = bnd[s2]
      if (bp.length < 4){
        out.push({ kind: kind, pts: [], L: 0,
                   cx: seeds[s2][0]*scaleX, cy: seeds[s2][1]*scaleY })
        continue
      }
      var mx = 0, my = 0
      for (var k = 0; k < bp.length; k++){ mx += bp[k][0]; my += bp[k][1] }
      mx /= bp.length; my /= bp.length
      bp.sort(function(p, q){
        return Math.atan2(p[1]-my, p[0]-mx) - Math.atan2(q[1]-my, q[0]-mx)
      })
      var raw = [], ccx = 0, ccy = 0
      for (var m = 0; m < bp.length; m++){
        var px = bp[m][0]*scaleX, py = bp[m][1]*scaleY
        raw.push(px, py); ccx += px; ccy += py
      }
      ccx /= bp.length; ccy /= bp.length
      /* 抽稀：把像素台阶磨掉，留下少而准的顶点 → 干净的直长边。
         细网（kind=1）胞元小，阈值收窄些，免得被抽成三角形 */
      var pts = simplify(raw, kind ? 1.1 : 1.8), L = 0
      for (var q = 2; q < pts.length; q += 2){
        L += Math.hypot(pts[q] - pts[q-2], pts[q+1] - pts[q-1])
      }
      if (pts.length >= 4){   /* 闭合段也计入周长 */
        L += Math.hypot(pts[0] - pts[pts.length-2], pts[1] - pts[pts.length-1])
      }
      out.push({ kind: kind, pts: pts, L: L, cx: ccx, cy: ccy })
    }
    return out
  }

  /* 一条釉元的闭合 path（pts 为扁平 [x0,y0,x1,y1,...]） */
  function strokeCellPath(c){
    var p = c.pts
    if (p.length < 6) return
    ctx.moveTo(p[0], p[1])
    for (var i = 2; i < p.length; i += 2) ctx.lineTo(p[i], p[i+1])
    ctx.closePath()
  }

  function build(){
    seed = SEED                                /* 每次重建都回到同一颗种子 → 缩放/换主题后纹样稳定 */
    var wr = makeWobble()                       /* 每载入一次的微小扰动（固定种子时为 0） */
    cells = []; iron = []; gold = []
    var cx = W * 0.5, cy = H * 0.5
    var cols = Math.max(8, Math.round(W / 2))   /* 1/2 分辨率：控耗时，坐标再放大回画布 */
    var rows = Math.max(8, Math.round(H / 2))
    var pad = 2                                /* 向外多铺一格，边缘胞元才被自然裁切 */
    var scaleX = W / cols, scaleY = H / rows
    var noise = makeNoise(cols, rows)

    /* 第一代：粗主网络（铁线）。材质板小样用更少的种子，免得胞元过密看不清 */
    var coarse = jitteredSeeds(cols, rows, opt.coarse || 42, pad, wr)
    /* Lloyd 松弛三迭代：种子挪到胞元质心，胞元大小趋于均匀。
       这是「每段裂纹都是一长条、不再夹出碎小节」的关键一步 */
    coarse = lloyd(coarse, cols, rows, noise, 55, 3)
    var owner1 = assignField(cols, rows, coarse, noise, 55)
    var coarseCells = extractCells(cols, rows, owner1, coarse, 0, scaleX, scaleY)

    /* 第二代：在每块粗胞元内撒 3~8 个细种子，裂出细网（金丝）。
       撒点按「胞元自身半径」铺开，而不是挤在质心小圆里 —— 若只挤在中心，
       细网会从中心呈扇形放射，拉出细长楔形细胞元，长短参差（就是那些碎小节） */
    var fine = []
    for (var ci = 0; ci < coarseCells.length; ci++){
      var cc = coarseCells[ci], k = (opt.fineMin || 3) + ((rnd() * (opt.fineSpan || 6)) | 0)
      if (wr){ k += (wr() < 0.5 ? 0 : 1); if (k > 8) k = 8 }   /* 细网密度每载入略变 */
      var sgx = cc.cx / scaleX, sgy = cc.cy / scaleY
      var cellR = 2                       /* 该粗胞元的外接半径（场坐标），据此铺满胞元 */
      for (var q = 0; q < cc.pts.length; q += 2){
        var rdx = cc.pts[q] / scaleX - sgx, rdy = cc.pts[q+1] / scaleY - sgy
        var rr = Math.sqrt(rdx*rdx + rdy*rdy)
        if (rr > cellR) cellR = rr
      }
      for (var m = 0; m < k; m++){
        var fxw = wr ? (wr()-0.5) * 0.35 : 0, fyw = wr ? (wr()-0.5) * 0.35 : 0
        fine.push([ sgx + (rnd()-0.5) * 1.1 * cellR + fxw,
                    sgy + (rnd()-0.5) * 1.1 * cellR + fyw, ci ])
      }
    }
    /* 细种子同样松弛：归属按「同一粗胞元内最近」判，凸胞元的质心必在胞元内，
       细种子只在自家胞元里挪动 → 细胞元大小均匀，细纹才是一根根长线 */
    fine = lloydFine(fine, owner1, cols, rows, noise, 55, 3)
    var owner2 = assignFieldFine(cols, rows, fine, owner1, noise, 55)
    var fineCells = extractCells(cols, rows, owner2, fine, 1, scaleX, scaleY)

    cells = coarseCells.concat(fineCells)

    /* 愈合次序：按质心到画布中心的距离归一 —— 外圈先合、内圈最后合（破镜由外向内圆拢） */
    var maxD = -1, minD = 1e9
    for (var i = 0; i < cells.length; i++){
      var d = Math.hypot(cells[i].cx - cx, cells[i].cy - cy)
      if (d > maxD) maxD = d; if (d < minD) minD = d
    }
    for (var j = 0; j < cells.length; j++){
      var t = (maxD - Math.hypot(cells[j].cx - cx, cells[j].cy - cy)) / (maxD - minD)
      cells[j].t = t < 0 ? 0 : (t > 1 ? 1 : t)
      if (cells[j].kind) gold.push(cells[j]); else iron.push(cells[j])
    }
  }

  var HEAL_BAND = 0.075   /* 单段缝合的过渡带宽 */
  var heal = 0
  var visible = true
  var panel = opt.live ? document.getElementById('panel') : null   /* 只有引首那块会收拢 */

  function readInk(){
    var v = getComputedStyle(document.documentElement)
      .getPropertyValue('--crack')
    rgb = (v && v.trim()) || '74,115,88'
  }

  /* 渐变只用建一次，强度靠 globalAlpha 调 —— 每帧建渐变会持续产生垃圾 */
  function buildGradients(){
    var cx = W / 2, cy = H / 2
    GLOW_R = Math.max(W, H) * 0.62
    glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, GLOW_R)
    glowGrad.addColorStop(0, 'rgba(' + rgb + ',1)')
    glowGrad.addColorStop(1, 'rgba(' + rgb + ',0)')
  }

  /* 渲染：裁进圆里，按「釉片」为单位愈合 —— 完全开裂的成代批量描边，
     正在合上的那几片整片描琥珀并用 dash 只画部分周长，已合上的直接跳过 */
  function draw(h){
    ctx.clearRect(0, 0, W, H)
    var cx = W / 2, cy = H / 2
    var i, c, local, p

    /* 釉面：越合越亮，像被擦净。强度全靠 globalAlpha，画完复位 */
    if (glowGrad){
      ctx.globalAlpha = 0.04 + 0.07 * h   /* 釉光更润 */
      ctx.fillStyle = glowGrad
      ctx.beginPath(); ctx.arc(cx, cy, GLOW_R, 0, Math.PI * 2); ctx.fill()
      ctx.globalAlpha = 1
    }

    /* 裁圆：面板在视觉上是浮在首屏右侧的一块圆釉，矩形边不得外露 */
    var R = Math.min(W, H) * 0.5 * 0.99
    ctx.save()
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip()

    ctx.setLineDash([])
    /* 完全开裂的釉片：铁线、金丝各一批，每代一次 beginPath / stroke */
    ctx.beginPath()
    for (i = 0; i < iron.length; i++){
      c = iron[i]
      if (c.pts.length >= 6 && (c.t - h) / HEAL_BAND >= 1) strokeCellPath(c)
    }
    ctx.strokeStyle = 'rgba(' + rgb + ',' + IRON.a + ')'
    ctx.lineWidth = IRON.w; ctx.stroke()

    ctx.beginPath()
    for (i = 0; i < gold.length; i++){
      c = gold[i]
      if (c.pts.length >= 6 && (c.t - h) / HEAL_BAND >= 1) strokeCellPath(c)
    }
    /* 金丝走暖琥珀，与铁线（主题青瓷）分色 —— 读得出「金丝铁线」两代 */
    ctx.strokeStyle = 'rgba(' + AMBER + ',' + GOLD.a + ')'
    ctx.lineWidth = GOLD.w; ctx.stroke()

    /* 正在合上的釉片：整片描琥珀，dash 只画 (1-p) 比例周长 → 裂纹由一端收拢 */
    for (i = 0; i < cells.length; i++){
      c = cells[i]
      if (c.pts.length < 6) continue
      local = (c.t - h) / HEAL_BAND
      if (local >= 1 || local <= 0) continue    /* 已画根 或 已合上 */
      p = 1 - local                            /* 愈合进度 0→1 */
      var aa = 0.10
      for (var k = 0; k < HEAL_LV.length; k++){
        if (p <= HEAL_LV[k].ph){ aa = HEAL_LV[k].a; break }
      }
      ctx.setLineDash([ (1 - p) * c.L, c.L * 4 ])
      ctx.strokeStyle = 'rgba(' + AMBER + ',' + aa + ')'   /* 愈合琥珀：与金丝同系暖色，不随主题翻转 */
      ctx.lineWidth = c.kind ? GOLD.w : IRON.w
      ctx.beginPath(); strokeCellPath(c); ctx.stroke()
      ctx.setLineDash([])
    }

    ctx.restore()
  }

  function resize(){
    /* 这是一张线条图，1.5 倍像素密度已经足够，比 2 倍省掉约 44% 的像素填充 */
    dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    var r = cv.getBoundingClientRect()
    W = Math.max(1, Math.round(r.width))
    H = Math.max(1, Math.round(r.height))
    cv.width = W * dpr; cv.height = H * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    readInk()
    build()
    buildGradients()
    draw(heal)
  }

  /* 视口外不画，回到视口补一帧。只有滚动驱动的引首需要 */
  if (opt.live && 'IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      es.forEach(function(e){
        var was = visible
        visible = e.isIntersecting
        if (!was && visible) draw(heal)     /* 回到视口补一帧 */
      })
    }, { threshold: 0 }).observe(cv)
  }

  /* 尺寸一变就重建：canvas 的位图尺寸不跟 CSS 走，不重建会糊或被拉伸。
     合并进一帧，免得连续 resize 反复重算距离场 */
  var rsPending = false
  function scheduleResize(){
    if (rsPending) return
    rsPending = true
    requestAnimationFrame(function(){ rsPending = false; resize() })
  }
  if ('ResizeObserver' in window) new ResizeObserver(scheduleResize).observe(cv)
  else window.addEventListener('resize', scheduleResize, { passive: true })

  /* 引首由滚动驱动愈合；材质板小样静态裂满，reduced-motion 也不把它抬到合上 */
  heal = (reduce && !opt.static) ? 1 : 0
  resize()

  return {
    resize: scheduleResize,
    /* 0 = 裂满，1 = 完整 */
    set: function(h){
      if (reduce) h = 1
      if (Math.abs(h - heal) < 0.0015) return
      heal = h
      if (visible) draw(heal)
      /* 越接近合上，整块釉略微收拢，像碎片归位 */
      if (panel) panel.style.transform =
        'translateY(-50%) scale(' + (1.014 - 0.014 * h).toFixed(4) + ')'
    },
    redraw: function(){ readInk(); buildGradients(); if (visible) draw(heal) }
  }
}
/* ── 站点侧接线 ───────────────────────────────────────────────── */
let live = []          /* 当前首页上的两个实例 */
let liveBig = null     /* 引首那块大的：由滚动驱动愈合，材质板小样不参与 */
let observers = []     /* 工厂内部自建的观察器：用包一层的方式收上来，好在卸载时断开 */

export function initCrackle(host) {
  disposeCrackle()
  const root = host || document
  const RO = window.ResizeObserver
  const IO = window.IntersectionObserver
  try {
    /* 工厂内部自建观察器且没有 dispose，这里临时包一层把它们收进 observers */
    if (RO) window.ResizeObserver = function (cb) { const o = new RO(cb); observers.push(o); return o }
    if (IO) window.IntersectionObserver = function (cb, o2) { const o = new IO(cb, o2); observers.push(o); return o }
    const big = createCrackle(root.querySelector('#crackle'), { live: true })
    const mat = createCrackle(root.querySelector('#crackleMat'),
      { live: false, static: true, coarse: 12, fineMin: 2, fineSpan: 3, seed: 20260913 })
    live = [big, mat].filter(Boolean)
    liveBig = big
  } finally {
    if (RO) window.ResizeObserver = RO
    if (IO) window.IntersectionObserver = IO
  }
  return disposeCrackle
}

export function disposeCrackle() {
  live = []
  liveBig = null
  observers.forEach((o) => o.disconnect && o.disconnect())
  observers = []
}

/* 引首愈合进度：0 = 裂满，1 = 完整。没有实例时静默——首页之外的页面照常滚动 */
export function setCrackleHeal(h) {
  if (liveBig) liveBig.set(h)
}

export function redrawCrackles() {
  live.forEach((c) => c.redraw && c.redraw())
}
