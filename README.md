# 琉璃幻影 · Glazed Mirage

[![Deploy to GitHub Pages](https://github.com/liu-li-huan-ying/liu-li-huan-ying.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/liu-li-huan-ying/liu-li-huan-ying.github.io/actions/workflows/deploy.yml)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![无 UI 框架](https://img.shields.io/badge/UI-手写_CSS-A33A2A)

> 形制是手卷：**引首 → 画心 → 拖尾**。宣纸为地，墨为文，青瓷为色，朱砂为印。
> 开卷时满纸冰裂，随你的滚动由外圈向中心一段段合上——破镜重圆。**进度由你搓**：
> 滚多少合多少，随时能停在半裂半合，往回也能裂回去。

**🔗 [liu-li-huan-ying.github.io](https://liu-li-huan-ying.github.io)**

---

## 形制 · 这一版在做什么

不是又一套「暗色渐变 + 玻璃卡片」。这一版把页面当作一轴手卷来排：

| 语汇 | 落在哪 |
| --- | --- |
| **五卷** | 引首（题名）/ 壹 · 琉璃（材质）/ 贰 · 作品 / 叁 · 自述 / 肆 · 手记 / 伍 · 落款 |
| **书耳** | 右侧竖排卷次，兼作阅读进度；鱼尾随滚动下移 |
| **冰裂** | 开卷裂满，滚动愈合（canvas 上按 Voronoi 开片，逐段重绘） |
| **洇墨** | 纸 / 墨两套地色，切换时新色从按钮位置洇开（SVG 湍流位移遮罩 + View Transition） |
| **钤印** | 篆书字形**现场组装**：不用字体、不用图片，白文/朱文两种刻法 |
| **落款** | 干支年号按当年实时推算（`[data-gz]`），未跑脚本时停在丙午 |
| **牌记** | 卷尾交代姓名、年月、地点，如古籍刻本的牌子 |

## ✨ 各处怎么实现的

| 模块 | 说明 |
| --- | --- |
| 🖋 **手卷排版** | 版心 / 天头地脚 / 乌丝栏（界格当 12 栏栅格用）全在 CSS 令牌里，纸墨两套只在 `:root` 与暗色块各定义一次，不写死颜色 |
| 📜 **整屏吸附（首页）** | 首页每卷占满一整屏（100svh），滚动改为一屏一跳而非连续下拉：一次滚轮 / 一滑 / 一按方向键直接落到上一或下一整屏。滚动逻辑在 `lib/deckNav.js`，版式在 `scroll.css` 的 `html.deck-mode` 块；整屏重排保证单屏内容不被截断，过矮视口（≤640px 高）退回普通滚动，绝不用裁切换整屏。**导航按「站」走而非按屏**：引首占两站（0 裂满 / 1 合上），其后六屏为 2..7，因此往下 / 往上是同一条路的两向，整条路可逆 |
| 🎞 **翻屏＝卷轴转场** | 跳屏不自己平滑滚，而是复用换篇转场 `lib/rollTransition.js`（View Transition + `#rollRod` 木轴）—— 点导航 / 目次与整屏跳是同一段「手卷滚过一格」，观感不分叉 |
| ❄️ **冰裂与愈合（破镜重圆）** | `lib/crackle.js`：按 Voronoi 开片切出裂纹细胞，`heal` 由 0 → 1 逐段合上（由外向内圆拢）。引首（首屏）的愈合**由人用手感搓、随时可停半途**：不是放一段自动动画，而是把滚轮 / 方向键 / 触摸的位移直接折算成愈合增量（`deckNav.advanceIntro`）——滚多少合多少、松手就定格在半裂半合，往回搓则裂回去。**合上之后还有一段「空白容错滚程」**：继续搓只走这段空白、屏不动、愈合保持合上、浮现的话留着，把这段走完才卷轴翻到「壹 · 琉璃」；且单次手势封顶（`MAX_STEP`），猛滚也得过好几下，不用小心翼翼算力度。从后面回来引首仍是合上态，再往回搓先退出空白带、再裂回最初（整条路可逆）。合上后浮现的那句话（`#healCap`）随进度渐显（约 0.78→1 淡入），合上后留住人看。非 deck（普通滚动）下愈合同样由滚动行程驱动、一样可停在半途。`prefers-reduced-motion` 下愈合不可见、引首只占一站，直接跳到愈合态、跳屏瞬移 |
| 🖌 **洇墨换地色** | `lib/theme.js`：优先 View Transition + `feDisplacementMap` 遮罩；缺能力时退回 clip-path 圆形硬边的降级路径 |
| 🪧 **篆书钤印** | `lib/sealGlyphs.js` 是《说文》小篆字形的**编译产物**（一个字可含多个部件，各带平移与横向压缩），`lib/seals.js` 现场组装成白文/朱文印 |
| 🖱 **毛笔光标** | `lib/cursor.js`：随动笔锋与落墨点，触屏与降低动效偏好下自动关掉 |
| 🔒 **联系方式混淆** | QQ / 微信号以 XOR + Base64 密文存在 `data-copy` 上，点击那一刻才在内存里解出并写入剪贴板 |
| 📄 **子页面** | 手写 hash 路由：作品目录 / 作品详情 / 手记目录 / 手记正文 / 关于 / 404，GitHub Pages 上零配置可用。顶栏分两层——「作品目录 / 手记目录 / 关于」是站级页面，五个篇次是卷内锚点；窄屏收进「目次」面板 |
| 🔤 **字体** | 不连 Google Fonts：按站点实际用字子集化后自托管，可变字体一个文件顶四个字重，见下 |
| 📊 **GitHub 数据块** | 贡献热力图（青瓷深浅表示当天提交量）+ 仓库星标，读 `api.github.com` 与 `github-contributions-api`，拿不到就整块不显示 |

### 子页用的是同一套语汇

子页不另起炉灶，卷首与卷尾各由一个共用件拼出来，作品 / 手记 / 关于三处目录页与两处详情页都走它们：

| 件 | 长什么样 |
| --- | --- |
| `components/PageHead.jsx` | **卷首题识**：竖排题签（篇次 + 卷名）、英文小题、大标题、提要；行末一颗**干支朱印**，底下压一道**双线界格**、界格正中一枚**鱼尾** |
| `components/PageFoot.jsx` | **收卷牌记**：卷次 + 篇目 + 篆书钤印 + 岁次干支 + 地点，如古籍刻本卷末的牌子 |

三条容易踩的坑，改子页前先看一眼：

- **顶栏样式收在 `.site-head` 上，别再用裸 `header` 选择器。** 原规则是 `header{position:fixed;…}`，
  正文里只要写一个语义化的 `<header>`（写详情页时很自然会写）就会被当成固定顶栏 ——
  标题直接飞到视口顶端，还平白多出一条盖住页面的栏。现在固定顶栏全挂在 `.site-head`。
- **手记正文的行长只有一处来源。** 宽屏（≥1180px）是 `.article-cols` 两栏：第一栏 `68ch` 就是正文行长，
  第二栏是篇内目次，整对居中；`.prose` 在栅格里**不再叠自己的 `max-width`**。旧版第一栏是 `1fr`（≈870px）
  而正文只占 563px，正栏与目次之间空出 300~370px 的死区，右侧那条目次看着像别的栏目的东西。
- **篇内锚点的 id 由渲染管线给，不在组件里补。** 补是补不住的：`dangerouslySetInnerHTML`
  会把事后补上的属性一并冲掉（实测补完 2ms 后就被冲掉）。点目次只滚动、不改 hash —— 改 hash 路由会以为要换页。

## 📁 结构

```
src/
├── styles/
│   ├── fonts.css    # 生成物：自托管字体的 @font-face（勿手改，见「字体」一节）
│   ├── scroll.css   # 设计系统本体：令牌 + 版心 + 书耳 + 印章 + 各卷版式
│   └── site.css     # 站点自有：子页版式、markdown 正文、代码高亮配色、打印
├── components/
│   ├── scroll/      # 手卷的固定层与各卷（Chrome / Masthead / Ear / Toc / Intro /
│   │                #    Material / Works / SelfNote / Writing / Closing / Colophon）
│   │                #    specimens.jsx 是四张手绘 SVG 解剖图
│   ├── PageHead.jsx # 子页共用的卷首题识（题签 + 篇次 + 干支朱印 + 双线界格 + 鱼尾）
│   ├── PageFoot.jsx # 子页共用的收卷牌记
│   ├── GitHubStats.jsx / GitHubHeatmap.jsx
│   └── BackToTop.jsx / ErrorBoundary.jsx / Analytics.jsx
├── lib/             # 运行时模块：cursor / theme / contacts / toc / roll / rollTransition /
│                    #   seals / reveal / count / crackle / scrollDrive / deckNav
│                    #   deckNav 只在首页（html.deck-mode）拦截滚动做整屏跳；
│                    #   引首占两站（裂/合）故整条导航可逆；转场本体在 rollTransition（roll 与 deckNav 共用同一份卷轴转场）
├── pages/           # Home / ProjectList / ProjectDetail / BlogList / BlogPost /
│                    #   AboutPage / NotFound
├── data/profile.js  # 唯一内容源：作品、自述、技能、近况、经历、文章清单
└── content/posts/   # 手记正文（Markdown）
```

**一条约定：观感全在 `styles/scroll.css` 与 `components/scroll/`。**
`lib/` 里的模块只负责行为（滚动、换色、钤印、扫描 DOM），不写样式、不产生文案。

## 📂 本地运行

```bash
git clone https://github.com/liu-li-huan-ying/liu-li-huan-ying.github.io.git
cd liu-li-huan-ying.github.io
npm install
npm run dev      # 开发调试
npm run build    # 生产构建 → dist/（顺带生成 rss.xml）
npm run lint     # oxlint
npm run test     # vitest
```

## ✍️ 写一篇手记

```bash
npm run newpost -- mmap-notes "内存映射笔记"
```

会在 `src/content/posts/` 生成 `YYYY-MM-DD-mmap-notes.md`，填好 push 即上线（列表页与 RSS 都在构建期生成）。

```md
---
title: 文章标题
date: 2026-08-26        # YYYY-MM-DD，决定排序
tags: Go, 存储          # 逗号分隔
summary: 一句话摘要     # 只用在列表页与 RSS
readTime: 7             # 可选，缺省按字数估算（中文 400 字/分钟）
---
正文支持 GFM：标题、列表、引用、围栏代码块、链接、图片。
代码高亮按需加载（只带 go / bash / javascript / xml 四种）。
篇内目次读的就是 `h2` / `h3`：`sec-N` 的 id 在渲染时由 `data/mdPosts.js` 就地编好，
**别在前端事后补**（`dangerouslySetInnerHTML` 会把它冲掉）。
```

**改内容**：作品、自述、技能、近况、指标、经历都在 `src/data/profile.js`——首页各卷与子页面读的是同一份，不在组件里重抄文案。
加一件作品：在 `projects` 里补一条；要在首页作品卷露面，把 `specimen` 填成 `components/scroll/specimens.jsx` 里那张解剖图的键（解剖图本身要自己画一段 SVG）。

**改观感**：改 `styles/scroll.css`。类名与选择器是照着设计稿定的，别在组件里另写一套颜色。

## 🎨 重新生成图标

```bash
node scripts/make-favicon.mjs          # 用篆书「璃」生成白文印 favicon
node scripts/make-favicon.mjs 影       # 换一个字
```

favicon 与站内钤印共用 `src/lib/sealGlyphs.js` 那套字形，所以两者长得一样。

## 🔤 字体

**不连 Google Fonts。** 中日韩字体在那边只能按固定分片下发：首页会拉 23 个 80KB 上下的
woff2（合计 1.66MB）外加一张 121KB、含 429 条 `@font-face` 的样式表，每片到达都触发一次
全文重排——实测 Style & Layout 5 秒、LCP 13 秒，Lighthouse 性能分因此掉到 0.52。

现在按站点**实际用字**（扫 `src/` 得到 1195 字）子集化后自托管：

```bash
npm run build:fonts     # → public/fonts/*.woff2 + src/styles/fonts.css（都是提交进仓库的产物）
```

两条原则，都是从 Lighthouse 的失败里换来的：

- **可变字体，一个文件顶掉所有字重。** 300/400/600/900 四个静态实例各存一份完整轮廓，合计
  854KB；保留 `wght` 轴只存一份轮廓加变化量，同样的字只要 407KB。文件少了还有个隐藏收益：
  字体到达只触发**一次**重排，不是四次。
- **分两片，靠 `font-family` 回退而不是 `unicode-range`。** 主片 = 首页要用到的 829 字
  （含手记的 YAML 头，标题/摘要/标签要显示在列表页上）；Ext 片 = 只在手记正文里出现的 366 字。
  两片用两个 family 名、都不写 `unicode-range`——浏览器先在主片找字，找不到才去 Ext 取，
  首页因此一个字都不缺、Ext 压根不会被请求。（逐字列举上千字的 `unicode-range` 要近 5KB，
  塞进渲染阻塞的主 CSS 里，省下的字体字节还不够抵它。）

首页实际下载：中文主片 + 西文两片 = **515KB**；打开手记时才会多取 Ext 那 204KB。

`index.html` 里**刻意不 preload**：实测 preload 会让这条高优先级请求去抢渲染阻塞的 CSS/JS 的
带宽，Lighthouse 模拟 1.6Mbps 下 FCP 反而从 2.3s 涨到 8.6s。

其余细节：

- 源字体是可变字体（Noto Serif SC 22.6MB + Cormorant Garamond 两份），子集化时保留轴；
  下过一次就缓存在 `.fontcache/`（已 gitignore），平常构建和 CI 都不需要跑。
- 依赖 `python` + `fonttools` + `brotli`：`pip install fonttools brotli`，
  解释器不对就设 `FONTS_PYTHON=/path/to/python`。
- **改了内容、加了生僻字之后要重跑**。漏掉的字不会报错，只是那一个字退到系统衬线（逐字回退）。

## ☁️ 部署

推送到 `main` 即自动构建发布（GitHub Actions → GitHub Pages）；Actions 里先跑 lint 与测试，再 build。

---

## 🧹 清理与审计（2026-09-14）

上一阶段（自托管子集化字体 + 通过 Lighthouse CI）落地后，做了一次仓库与机器上的遗留清理，
并从**美学 / 功能 / 实用性**三角度通读审计。

### 临时与过时遗留清理

- **`.fontcache/`**：上一版改走可变字体后不再需要的 5 个 `@wght*` 静态实例缓存（约 46M）已删除，
  从 69.6M 降到 24M，只保留源可变字体（Noto Serif SC / Cormorant Garamond 的 VF）
  与 `axes-report.json` / `jobs.json`。
- **机器临时目录**：扫描到的 `D:/tmp`（echarts，别的项目）、`D:/tmp-shot`（github-profile，别的项目）、
  `design-proposal/manor-3d`（正在活跃修改）均**非本项目产生或正在使用，未擅删**。
- **`D:/tmp-lh/`**：本机独立安装的 Lighthouse 环境（176M），与 CI 同配置可复用，保留。

### 审计结论（优化空间）

整体完成度很高：设计语言统一（纸 / 墨 / 青瓷 / 朱砂 / 琥珀 + 手卷形制 + 篆书钤印 + 冰裂愈合），
可访问性已修到满分。以下按优先级列仍可打磨处：

| 层级 | 严重度 | 位置 | 问题 / 优化空间 | 结论 |
| --- | --- | --- | --- | --- |
| 实用性 | 低 | `public/projects/*.jpg` | 配图偏大：yujian 2.0M、phantom-video 1.9M、lucent 1.1M | **已在第二轮重压**（见下），4 张合计 3.6M → 0.81M |
| 美学 | 低 | `data/profile.js` Lucent | `latin:'新标签页'` 是中文，却以意大利体西文字号渲染，读起来冗余、字重错位 | **已改为 `'New Tab'`**（与 `YuJian`/`BeiBei` 同套「罗马化副名」语义） |
| 实用性 | 低 | `styles/scroll.css` `:root` | `--sky`/`--moon`/`--dai`/`--celadon-lt` 四个颜色令牌定义后全站零引用 | **已删除**，避免令牌膨胀 |
| 功能 | 提示 | `components/scroll/Intro.jsx` 元信息「在写」 | 取前 3 个有解剖图的项目名拼成（玉笺·GojiDB·Lucent），与 `profile.now`「在写 LSM 续篇」语义不完全一致 | 若想严格对应，可改读 `profile.now` 对应项；目前算可接受的产品化表达 |
| 美学 | 提示 | `styles/scroll.css` 注释 | 书耳注释写「六篇」，实际耳签只有 5 条（引首无签），属旧结构遗留措辞 | 顺手把注释改成「五卷」即可，无功能影响 |
| 美学 | 提示 | 首屏 `glaze-panel` 釉面 | ≤960px 时 `opacity:.55`、≤700px 时 `.5`，墨地（近黑）上可能偏灰发闷 | 可给釉面在墨地主题下单独提一点对比，属可选项 |
| 功能 | 中 | `lib/scrollDrive.js` | `healLocked` 声明后从未置真，真正的守卫是 `deckOwnsHeal` | **已删**（留着的死变量会误导后来者以为还有一层开关） |

> 第二轮（同日）修掉了 5 处交互缺陷并补齐子页观感，见下一节。

---

## 🩹 第二轮：缺陷修复与子页打磨（2026-09-14）

### 交互缺陷

| 位置 | 症状 | 真因 | 修法 |
| --- | --- | --- | --- |
| `pages/ProjectList.jsx` | 按签条筛选，heading 报「1 件 / 2 件」，卡片区却空白 | 筛选后是**新挂载**的 `.rv` 节点，而 `initReveal` 只在换路由时跑一遍，新节点从没进过 IntersectionObserver，永远停在 `opacity:0` | `lib/reveal.js` 加一个常驻 MutationObserver，后来挂上来的 `.rv` 也观察 |
| `pages/BlogPost.jsx` | 点右侧篇内目次不跳 | 目次链到 `#sec-0`，可标题上根本没有 `sec-0`：`useEffect` 补完 id 之后 **2ms**，同一段 HTML 又被 `dangerouslySetInnerHTML` 写了一遍，id 全被冲掉 | id 改在渲染管线（`data/mdPosts.js`）里就地编号，随字符串一起出去；`BlogPost` 只读不补 |
| `components/GitHubHeatmap.jsx` | 「当前连续」恒为 0（上方图表明明连着好几天） | 接口返回的是**整年** 365 天：末条 `2026-12-31`，其中 108 个未来日期 count 全 0。从数组末尾往回数，第一格就是 0 → 立刻 break | 先跳过未来日期，再从今天往回数（今天没提交则从昨天起），即 GitHub 口径 |
| `lib/deckNav.js` | 首页翻屏太灵：一次轻扫连跳好几屏 | 每条 `abs(deltaY) ≥ 8` 的 wheel 都直接 `goToStage`，而触控板一次轻扫连发十几条事件；锁只在 View Transition 期间有效，VT 一完（1.1s）下一条接着跳 | 翻屏改成**攒够 `WHEEL_TRIGGER` 才动**、**一次跳屏后 `WHEEL_COOL` 冷却**吞掉惯性尾巴、**手势静默 `WHEEL_IDLE` 清零**；引首愈合仍按原始增量「滚多少合多少」 |
| `styles/scroll.css` | 翻屏收尾时顶栏闪两下 | 同一场手势触发两次跳屏，每场转场都把顶栏淡出淡入一次 | 与上一条同源；另把 `vt-hide-nav` 的挂/摘时序对齐到 VT 快照回调（脚本挂上后新快照里的顶栏即不可见，摘掉后由 CSS transition 淡回） |

### 观感

- **子页补上卷首与卷尾**：新增 `PageHead` / `PageFoot` 共用件，作品 / 手记 / 关于的目录页与详情页统一走它们。
- **作品详情改双栏**：解剖图与「取舍 / 要点」并置；正文自己仍守 68ch，让出来的宽度交给批注栏，不再把右半边空着。
- **GitHub 热力图**：加题签栏（三点 + 仓库名 + 岁次）、月份标签改成与格子同宽的弹性槽位、图例 少/多 → 疏/密；
  格子改为 `flex:1` 等分 + `aspect-ratio:1`，**填满整个框并随宽度放缩**
  （旧版固定 11px 格 + `overflow-x:auto`，宽屏只占左边一截、窄屏横向滚动）。
- **手记正文栏位**：正栏由 `1fr`（≈870px）改为 `68ch`，消灭正栏与目次之间 300~370px 的死区（细节见上文「子页」三条）。

### 资产重压

| 文件 | 改前 | 改后 |
| --- | --- | --- |
| `public/projects/yujian.jpg` | 1.96 MB | **0.20 MB**（−90%，尺寸不变 1456×816） |
| `public/projects/lucent-newtab.jpg` | 1.08 MB | **0.21 MB**（1920×1080 → 1600×900） |
| `public/projects/gojidb.jpg` | 0.25 MB | **0.15 MB**（尺寸不变） |
| `public/projects/phantom-video.jpg` | 1.88 MB | **0.22 MB**（4096×2304 → 1600×900） |

> ⚠️ **更正上一轮的一处误判**：当时记「`yujian.jpg` 是 32753×65015、21 亿像素的解码地雷」是**读错了** ——
> 那是临时脚本解析 JPEG 的 SOF 段解析错了，用 Pillow 复核实际是 **1456×816**。
> 所以这几张**并不构成解码地雷**；又因为四件作品都填了 `specimen`，它们在列表页与详情页
> **根本不会被请求**（列表与详情都优先用解剖图，配图只作兜底），单纯压在部署包里占体积。
> 想真正清干净，可以考虑把这三张兜底图移出仓库；目前保留，只压到 Web 尺度。

### 验证方式

一律用无头 Edge + CDP 真跑页面，不靠「看着还行」：

- **响应式溢出体检**：5 条路由 × 5 档宽度（1440 / 1024 / 820 / 640 / 390），量 `scrollWidth - clientWidth`，
  全部为 0（`pre` 内部的横向滚动是它自己的 `overflow-x:auto`，不算溢出）。
- **翻屏**：在页面内合成精确时序的 wheel 事件（CDP 往返 100~250ms/条，从外面喂不出触控板的 16ms 流），
  确认轻扫 = 恰好一整屏、猛扫不会连翻两屏。
- **篇内目次**：点目次后量到标题进入视口（`y=770`），且 hash 未被改动。
- **栏位**：同趟里既量几何又截图，保证数字与图描述同一次渲染 —— 早前「3.6MB 地雷」的教训就是只信了数字。

---

© 2026 [琉璃幻影 · Liu-Li-Huan-Ying](https://github.com/liu-li-huan-ying)
