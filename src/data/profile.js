import { postsFor } from './mdPosts'

const postsEn = postsFor('en')
const postsZh = postsFor('zh')

export const profile = {
  en: {
    name: 'Glazed Mirage',
    roles: ['Full Stack Developer', 'UI Craftsperson', 'Open Source Enthusiast'],
    tagline:
      'Data Science & Big Data Technology graduate. I build desktop apps with Electron, browser extensions with vanilla JS, and storage engines with Go — always chasing that sweet spot between aesthetics and engineering.',
    email: 'luchang0829@163.com',
    location: 'Beijing, China',
    status: 'Working',
    socials: [
      { label: 'GitHub', url: 'https://github.com/liu-li-huan-ying' },
      { label: 'QQ', enc: 'VFxRVFBfUVVeWg==' },
      { label: 'WeChat', enc: 'EAEEHh4KAwsQ' },
      { label: 'Email', url: 'mailto:luchang0829@163.com' },
    ],
    about: [
      'Hello! I come from a Data Science and Big Data Technology background, and I love turning ideas into runnable, scalable systems. My recent work spans desktop apps, browser extensions, and storage engines — building polished UIs on one end and low-level systems on the other.',
      'YuJian (玉笺), my cross-platform Markdown editor built with Electron + Vue 3 + Milkdown, is where I pour most of my frontend energy — five Chinese kiln-color themes, glass material design, and WYSIWYG editing. GojiDB, a hand-written LSM-Tree KV store, keeps my systems side sharp. Lucent, a glass-themed browser new tab extension, rounds out the trio.',
    ],
    features: [
      { icon: 'code', title: 'Full Stack', desc: 'From Electron desktop apps to Go storage engines' },
      { icon: 'sparkles', title: 'UI Craft', desc: 'Glass materials, kiln-color themes, pixel-perfect detail' },
      { icon: 'zap', title: 'Performance', desc: 'Benchmark-driven, zero-copy pipelines, measured always' },
      { icon: 'rocket', title: 'Open Source', desc: 'Building in public, shipping often' },
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Electron', 'Node.js', 'Python', 'Go', 'C++', 'CSS'],
    projects: [
      {
        id: 'yujian',
        letter: '玉',
        image: '/projects/yujian.jpg',
        title: 'YuJian',
        desc: 'Cross-platform Markdown editor: Electron + Vue 3 + Milkdown, five Chinese kiln-color themes with glass material design.',
        tags: ['Electron', 'Vue 3', 'Milkdown', 'TypeScript', 'CSS'],
        github: 'https://github.com/liu-li-huan-ying/yujian',
        live: '',
        gradient: ['#22d3ee', '#34d399'],
        detail: {
          role: 'Solo Developer',
          year: '2026',
          body: [
            'YuJian (玉笺, "jade letter") is a local-first Markdown writing tool: folders are vaults, documents are plain .md files, data is always readable, Git-friendly, and portable. The editor kernel is built on Milkdown Crepe — Markdown is a first-class citizen, and untouched documents are saved byte-for-byte.',
            'Visually, YuJian uses a "jade" material language — warm jade framework layers, translucent glass overlays, and clean solid content layers. Five traditional Chinese kiln-color themes (Celadon / Sky Blue / Moon White / Indigo / Amber) with dark/light/system modes. The glass material system unifies all floating panels with backdrop-filter.',
          ],
          highlights: [
            'WYSIWYG + source mode toggle, Markdown round-trip fidelity',
            '5 kiln-color themes with glass material system (backdrop-filter)',
            'Mermaid charts, KaTeX math, code syntax highlighting, PDF/HTML export',
          ],
        },
      },
      {
        id: 'lucent-newtab',
        letter: 'L',
        image: '/projects/lucent-newtab.jpg',
        title: 'Lucent',
        desc: 'Glass-themed browser new tab: real photo wallpapers, ambient sounds, weather, todos — pure HTML/CSS/JS, zero dependencies.',
        tags: ['HTML', 'CSS', 'JavaScript', 'Browser Extension', 'Web Audio'],
        github: 'https://github.com/liu-li-huan-ying/lucent-newtab',
        live: '',
        gradient: ['#818cf8', '#e879f9'],
        detail: {
          role: 'Solo Developer',
          year: '2026',
          body: [
            'Lucent is a browser new tab extension built with zero frameworks and zero dependencies — pure HTML, CSS, and JavaScript. It features real photo wallpapers from Unsplash with a liquid glass overlay, 12 switchable search engines, and ambient sounds (rain, café, ocean waves, campfire) generated entirely via Web Audio API.',
            'The design uses a `.veil` darkening mask to ensure white text remains readable on bright wallpapers. Cards are freely draggable across zones, and all settings persist in localStorage with JSON export/import backup.',
          ],
          highlights: [
            'Web Audio synthesized ambient sounds (no audio files)',
            'Unsplash + Bing daily wallpapers with per-day caching',
            'MV3 Chrome/Edge extension with GitHub Actions auto-release',
          ],
        },
      },
      {
        id: 'phantom-video',
        letter: 'P',
        image: '/projects/phantom-video.jpg',
        title: 'Phantom Video',
        desc: 'A hand-built Windows video player: libmpv core with D3D11VA zero-copy hardware decoding and a fully self-drawn SDL2 transparent UI.',
        tags: ['C++17', 'Win32', 'libmpv', 'D3D11VA', 'SDL2'],
        github: 'https://github.com/liu-li-huan-ying/phantom-video',
        live: '',
        gradient: ['#8b5cf6', '#ec4899'],
        detail: {
          role: 'Solo Developer',
          year: '2026',
          body: [
            'Built because existing players were either bloated or looked a decade old. The architecture separates concerns cleanly: libmpv handles demuxing and decoding while every pixel of the interface is drawn by my own code on top of Win32.',
            'The hardest part was the render pipeline. Instead of letting decoded frames travel through CPU memory, D3D11VA outputs directly to GPU surfaces that are composited straight to the screen — a zero-copy path that keeps 4K playback light. The UI layer uses SDL2 with UpdateLayeredWindow for per-pixel transparency, so the window itself can be any shape.',
          ],
          highlights: [
            'D3D11VA zero-copy hardware decoding, smooth 4K playback',
            'Per-pixel alpha transparent UI via SDL2 UpdateLayeredWindow',
            'Pure C++17 / Win32, no third-party UI framework',
          ],
        },
      },
      {
        id: 'gojidb',
        letter: 'G',
        image: '/projects/gojidb.jpg',
        title: 'GojiDB',
        desc: 'A high-performance, lightweight KV store based on LSM-Tree with WAL and TTL support.',
        tags: ['Go', 'LSM-Tree', 'WAL', 'TTL', 'Benchmark'],
        github: 'https://github.com/liu-li-huan-ying/gojidb',
        live: '',
        gradient: ['#22d3ee', '#6366f1'],
        detail: {
          role: 'Solo Developer',
          year: '2025',
          body: [
            'Built to solve high-performance KV storage needs in embedded scenarios, GojiDB is a lightweight RocksDB-like engine implemented from scratch. The core challenges were LSM-Tree tiered compaction strategies and WAL crash recovery — balancing write throughput against read amplification.',
            'By introducing tiered SSTables, Bloom filters and background compaction goroutines, the system achieves stable write performance with controlled memory usage, validated through benchmarks under high concurrency.',
          ],
          highlights: [
            'Write throughput > 120K ops/s (YCSB benchmark)',
            'WAL crash recovery with zero data loss',
            'Memory footprint < 50MB with 1M key-value pairs',
          ],
        },
      },
    ],
    experience: [
      {
        period: '2022 — 2026',
        role: 'B.Sc. in Data Science & Big Data Technology',
        company: 'China University of Geosciences (Wuhan)',
        desc: 'Graduated. Core coursework: data structures, database systems, distributed computing and large-scale data processing.',
      },
    ],
    posts: postsEn,
  },

  zh: {
    name: '琉璃幻影',
    roles: ['全栈开发者', 'UI 工匠', '开源爱好者'],
    tagline:
      '数据科学与大数据技术专业背景。用 Electron 做桌面应用，用原生 JS 做浏览器扩展，用 Go 做存储引擎——始终在美学与工程之间寻找最佳平衡点。',
    email: 'luchang0829@163.com',
    location: '北京，中国',
    status: '工作中',
    socials: [
      { label: 'GitHub', url: 'https://github.com/liu-li-huan-ying' },
      { label: 'QQ', enc: 'VFxRVFBfUVVeWg==' },
      { label: 'WeChat', enc: 'EAEEHh4KAwsQ' },
      { label: 'Email', url: 'mailto:luchang0829@163.com' },
    ],
    about: [
      '你好！我来自数据科学与大数据技术专业，热爱用代码把想法变成可运行、可扩展的系统。近期的工作横跨桌面应用、浏览器扩展与存储引擎——一端打磨精致的界面，另一端打磨底层系统。',
      '玉笺（YuJian）是我投入最多前端精力的跨平台 Markdown 编辑器，基于 Electron + Vue 3 + Milkdown，五套中国传统窑色皮肤加玻璃材质设计。手写的 LSM-Tree 键值数据库 GojiDB 保持系统侧的敏锐。Lucent 轻玻璃新标签页扩展则完成了三件套的拼图。',
    ],
    features: [
      { icon: 'code', title: '全栈能力', desc: '从 Electron 桌面应用到 Go 存储引擎' },
      { icon: 'sparkles', title: 'UI 工匠', desc: '玻璃材质、窑色皮肤、像素级细节' },
      { icon: 'zap', title: '性能至上', desc: '基准驱动、零拷贝管线、用数据说话' },
      { icon: 'rocket', title: '拥抱开源', desc: '公开构建，持续交付' },
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Electron', 'Node.js', 'Python', 'Go', 'C++', 'CSS'],
    projects: [
      {
        id: 'yujian',
        letter: '玉',
        image: '/projects/yujian.jpg',
        title: '玉笺',
        desc: '跨平台 Markdown 编辑器：Electron + Vue 3 + Milkdown，五套中国传统窑色皮肤与玻璃材质设计。',
        tags: ['Electron', 'Vue 3', 'Milkdown', 'TypeScript', 'CSS'],
        github: 'https://github.com/liu-li-huan-ying/yujian',
        live: '',
        gradient: ['#22d3ee', '#34d399'],
        detail: {
          role: '独立开发者',
          year: '2026',
          body: [
            '玉笺（yù jiān，"玉制的信笺"）是一款本地优先的 Markdown 写作工具：文件夹即笔记库，文档是普通的 .md 文件，数据永远可读、可 Git、可迁移。编辑器内核基于 Milkdown Crepe，Markdown 是一等公民，未编辑的文档保存时一字不改写回原文。',
            '视觉上，玉笺以「玉质」为核心材质语言——框架层温润玉质、浮层玻璃透亮、内容层纯净实色，并提供五套中国传统窑色皮肤（青瓷 / 天青 / 月白 / 黛 / 琥珀）与深 / 浅 / 跟随系统三档明暗。玻璃材质系统统一所有浮层面板。',
          ],
          highlights: [
            '所见即所得 + 源码模式切换，Markdown 往返保真',
            '五套窑色皮肤 + 玻璃材质系统（backdrop-filter）',
            'Mermaid 图表、KaTeX 公式、代码高亮、PDF/HTML 导出',
          ],
        },
      },
      {
        id: 'lucent-newtab',
        letter: 'L',
        image: '/projects/lucent-newtab.jpg',
        title: 'Lucent',
        desc: '轻玻璃浏览器新标签页：真实照片壁纸、环境音、天气、待办——纯 HTML/CSS/JS，零依赖。',
        tags: ['HTML', 'CSS', 'JavaScript', '浏览器扩展', 'Web Audio'],
        github: 'https://github.com/liu-li-huan-ying/lucent-newtab',
        live: '',
        gradient: ['#818cf8', '#e879f9'],
        detail: {
          role: '独立开发者',
          year: '2026',
          body: [
            'Lucent 是一个零框架、零依赖的浏览器新标签页扩展——纯 HTML、CSS、JavaScript。特性包括 Unsplash 真实照片壁纸加液态玻璃蒙版、12 个可切换搜索引擎、以及完全通过 Web Audio API 合成的环境音（雨声、咖啡馆、海浪、篝火）。',
            '设计上使用 `.veil` 压暗蒙版确保白字在亮图上依然清晰。卡片可跨区域自由拖拽排序，所有设置持久化到 localStorage，支持 JSON 导出/导入备份。',
          ],
          highlights: [
            'Web Audio 合成环境音（无音频文件）',
            'Unsplash + 必应每日壁纸，按天缓存',
            'MV3 Chrome/Edge 扩展，GitHub Actions 自动发版',
          ],
        },
      },
      {
        id: 'phantom-video',
        letter: 'P',
        image: '/projects/phantom-video.jpg',
        title: 'Phantom Video',
        desc: '自研 Windows 视频播放器：libmpv 解码内核 + D3D11VA 零拷贝硬解，SDL2 逐像素透明 UI 全部自绘。',
        tags: ['C++17', 'Win32', 'libmpv', 'D3D11VA', 'SDL2'],
        github: 'https://github.com/liu-li-huan-ying/phantom-video',
        live: '',
        gradient: ['#8b5cf6', '#ec4899'],
        detail: {
          role: '独立开发者',
          year: '2026',
          body: [
            '做这个播放器，是因为市面上的产品要么臃肿要么 UI 停留在十年前。架构上做了干净的分层：libmpv 负责封装解析与解码，而界面的每一个像素都由自己的代码在 Win32 之上绘制。',
            '最难啃的是渲染管线。解码帧不经过 CPU 内存拷贝，而是由 D3D11VA 直接输出到 GPU 表面并合成上屏——零拷贝路径让 4K 播放依然轻快。UI 层基于 SDL2 的 UpdateLayeredWindow 实现逐像素透明，窗口形状完全自由。',
          ],
          highlights: [
            'D3D11VA 零拷贝硬件解码，4K 播放流畅轻快',
            'SDL2 ULW 逐像素透明异形窗口，UI 完全自绘',
            '纯 C++17 / Win32 实现，零第三方 UI 框架依赖',
          ],
        },
      },
      {
        id: 'gojidb',
        letter: 'G',
        image: '/projects/gojidb.jpg',
        title: 'GojiDB',
        desc: '基于 LSM-Tree 的高性能轻量级 KV 数据库，支持 WAL 与 TTL。',
        tags: ['Go', 'LSM-Tree', 'WAL', 'TTL', 'Benchmark'],
        github: 'https://github.com/liu-li-huan-ying/gojidb',
        live: '',
        gradient: ['#22d3ee', '#6366f1'],
        detail: {
          role: '独立开发者',
          year: '2025',
          body: [
            '为解决嵌入式场景下高性能 KV 存储需求，从零实现了一个类 RocksDB 的轻量引擎。核心难点在于 LSM-Tree 的层级压缩策略与 WAL 崩溃恢复机制，需要兼顾写入吞吐与读放大问题。',
            '通过引入分层 SSTable、布隆过滤器与后台压缩协程，实现了稳定的写入性能与可控的内存占用，并通过 Benchmark 验证了其在高并发场景下的稳定性。',
          ],
          highlights: [
            '写入吞吐 > 120K ops/s（YCSB 基准）',
            '支持 WAL 崩溃恢复，数据零丢失',
            '内存占用 < 50MB（100 万 KV 场景）',
          ],
        },
      },
    ],
    experience: [
      {
        period: '2022 — 2026',
        role: '数据科学与大数据技术 · 本科',
        company: '中国地质大学（武汉）',
        desc: '已毕业，主修数据结构、数据库系统、分布式计算与大数据处理。',
      },
    ],
    posts: postsZh,
  },
}

export const navLinks = [{ id: 'about' }, { id: 'projects' }, { id: 'experience' }, { id: 'blog' }, { id: 'contact' }]

export const githubProfileUrl = 'https://github.com/liu-li-huan-ying'
