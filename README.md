# 琉璃幻影 · Glazed Mirage — Developer Portfolio

[![Deploy to GitHub Pages](https://github.com/liu-li-huan-ying/liu-li-huan-ying.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/liu-li-huan-ying/liu-li-huan-ying.github.io/actions/workflows/deploy.yml)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r18-ffffff?logo=threedotjs&logoColor=white)

> 一个不满足于"能看就行"的个人主页 —— 手写 WebGL 着色器、可交互终端、Live2D 看板娘与中英双语子页面，全部零 UI 模板、从零手搓。
>
> A personal homepage that refuses to be "good enough" — hand-written WebGL shaders, an explorable terminal, a Live2D companion and bilingual sub-pages. No UI templates, everything built from scratch.

**🔗 在线访问 · Live: [https://liu-li-huan-ying.github.io](https://liu-li-huan-ying.github.io)**

---

## ✨ 亮点 Highlights

| 模块 Feature | 说明 Description |
| --- | --- |
| 🌌 **WebGL 极光 Aurora** | 手写 GLSL 片元着色器（fbm 噪声），流动极光跟随鼠标；移动端自动降级为静态帧 Hand-written GLSL fragment shader with fbm noise; degrades to a static frame on mobile |
| 🪐 **3D 粒子星球 Particle Planet** | Three.js 渲染 2600+ 渐变粒子球体 + 扭曲线框核心，鼠标视差旋转，独立 chunk 懒加载 Three.js scene with 2600+ gradient particles, wireframe core and mouse-follow rotation, lazy-loaded |
| 💻 **可交互终端 Interactive Terminal** | `help` / `whoami` / `skills` / `projects` / `contact` 全部可用，支持历史记录（↑↓）与口型同步彩蛋 Fully working commands, command history via arrow keys |
| ⌨️ **命令面板 Command Palette** | `Ctrl/⌘ + K` 模糊搜索：跳转区块、复制邮箱、切换语言、触发彩蛋 Fuzzy-search navigation, clipboard actions, easter eggs |
| 🎏 **看板娘 Live2D Companion** | l2d-widget 驱动，视线跟踪鼠标、打字机气泡口型同步、随机换装 Eye-tracking, lip-synced tips and model shuffling |
| 🌍 **双语 i18n 中/EN** | 零依赖 Context 方案：全站文案、文章、项目详情双语文案化，一键切换 Dependency-free i18n covering every string, including blog articles |
| 📄 **子页面 Sub-pages** | 手写 hash 路由：博客详情页、项目详情页、404 页，GitHub Pages 零配置可用 Hand-rolled hash router — no 404 hacks needed on GitHub Pages |
| 🔒 **联系方式混淆 Contact Obfuscation** | QQ/微信号 XOR+Base64 密文存储，点击复制瞬间才在内存解码 IDs stored obfuscated, decoded in-memory only on click |

## 🚀 技术栈 Tech Stack

React 19 · Vite 8 · Tailwind CSS 4 · Framer Motion 13 · Three.js (React Three Fiber) · WebGL/GLSL · l2d-widget · oxlint

## 📂 本地运行 Getting Started

```bash
git clone https://github.com/liu-li-huan-ying/liu-li-huan-ying.github.io.git
cd liu-li-huan-ying.github.io
npm install
npm run dev      # 开发调试 http://localhost:5173
npm run build    # 生产构建 → dist/
npm run lint     # oxlint 检查
```

## 📁 结构 Structure

```
src/
├── components/    # 全部 UI 组件 All UI components
├── pages/         # 路由页面 Routed pages (Home / BlogPost / ProjectDetail / NotFound)
├── data/          # profile.js — 单一数据源 Single source of content (bilingual)
├── i18n/          # 语言上下文与字典 Language context & dictionaries
└── hooks/         # hash 路由等工具 Hash router & helpers
```

## ☁️ 部署 Deployment

推送到 `main` 分支即自动构建发布（GitHub Actions → GitHub Pages）。
Every push to `main` triggers an automatic build & deploy via GitHub Actions.

## ✍️ 写文章 Adding Posts

文章是 `src/content/posts/` 下的 **Markdown 文件**，放进去即自动收录（按日期倒序、双语自动配对）。

最快方式：

```bash
npm run newpost -- my-new-post "我的新文章"
```

会生成中文主文件 `YYYY-MM-DD-my-new-post.md` 和可选英文骨架 `*.en.md`，填好内容 push 即上线。

Frontmatter 参考：

```md
---
title: 文章标题
date: 2026-08-26        # YYYY-MM-DD，决定排序
tags: Go, 存储          # 逗号分隔
summary: 一句话摘要     # 列表页展示
readTime: 7             # 可选，缺省按字数自动估算
---
正文支持 GFM Markdown：标题、列表、引用、围栏代码块、链接、图片。
```

- 英文版文件命名为 `<同名>.en.md`；没有英文版时英文界面自动回退中文并标注「原文」
- 正文渲染为 `.md-body` 排版（标题/列表/引用/代码块均已适配暗色主题）

### 🌐 自动翻译英文版

懒得手写英文？对着中文稿一键生成 `.en.md` 初稿：

```bash
npm run translate -- my-new-post        # 指定文章（slug 或文件名片段）
npm run translate                       # 不带参数 = 自动挑选最新一篇缺英文版的
```

- 调用 Google 翻译接口，**代码块原样跳过**、标题/列表逐行保留格式
- 需要能访问谷歌的网络：脚本会自动探测本地代理（7897/7890/10809），或设置 `HTTPS_PROXY` 环境变量
- 机器翻译仅为初稿，建议推送前润色；网络不通时会保留中文原文并给出警告

---

© 2026 [琉璃幻影 · Liu-Li-Huan-Ying](https://github.com/liu-li-huan-ying) · Built with React and too much curiosity
