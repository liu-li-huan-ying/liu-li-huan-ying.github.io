# 琉璃幻影 · Glazed Mirage

[![Deploy to GitHub Pages](https://github.com/liu-li-huan-ying/liu-li-huan-ying.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/liu-li-huan-ying/liu-li-huan-ying.github.io/actions/workflows/deploy.yml)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![无 UI 框架](https://img.shields.io/badge/UI-手写_CSS-A33A2A)

> 形制是手卷：**引首 → 画心 → 拖尾**。宣纸为地，墨为文，青瓷为色，朱砂为印。
> 开卷时满纸冰裂，随滚动由外圈向中心一段段合上——破镜重圆。

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
| ❄️ **冰裂与愈合** | `lib/crackle.js`：按 Voronoi 开片切出裂纹细胞，滚动进度驱动 `heal` 由 0 → 1，逐段合上；`prefers-reduced-motion` 下直接跳到愈合态 |
| 🖌 **洇墨换地色** | `lib/theme.js`：优先 View Transition + `feDisplacementMap` 遮罩；缺能力时退回 clip-path 圆形硬边的降级路径 |
| 🪧 **篆书钤印** | `lib/sealGlyphs.js` 是《说文》小篆字形的**编译产物**（一个字可含多个部件，各带平移与横向压缩），`lib/seals.js` 现场组装成白文/朱文印 |
| 🖱 **毛笔光标** | `lib/cursor.js`：随动笔锋与落墨点，触屏与降低动效偏好下自动关掉 |
| 🔒 **联系方式混淆** | QQ / 微信号以 XOR + Base64 密文存在 `data-copy` 上，点击那一刻才在内存里解出并写入剪贴板 |
| 📄 **子页面** | 手写 hash 路由：作品目录 / 作品详情 / 手记目录 / 手记正文 / 关于 / 404，GitHub Pages 上零配置可用。顶栏分两层——「作品目录 / 手记目录 / 关于」是站级页面，五个篇次是卷内锚点；窄屏收进「目次」面板 |
| 🔤 **字体** | 不连 Google Fonts：按站点实际用字子集化后自托管，可变字体一个文件顶四个字重，见下 |
| 📊 **GitHub 数据块** | 贡献热力图（青瓷深浅表示当天提交量）+ 仓库星标，读 `api.github.com` 与 `github-contributions-api`，拿不到就整块不显示 |

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
│   ├── GitHubStats.jsx / GitHubHeatmap.jsx
│   └── BackToTop.jsx / ErrorBoundary.jsx / Analytics.jsx
├── lib/             # 运行时模块：cursor / theme / contacts / toc / roll /
│                    #   seals / reveal / count / crackle / scrollDrive
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

© 2026 [琉璃幻影 · Liu-Li-Huan-Ying](https://github.com/liu-li-huan-ying)
