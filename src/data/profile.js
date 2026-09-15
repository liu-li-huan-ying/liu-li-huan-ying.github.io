import { posts } from './mdPosts'

/* 站点内容源 —— 唯一一份。
   首页各卷（作品 / 自述 / 手记 / 落款）与子页面都读这里，不在组件里重抄一遍文案。
   加一个项目：在 projects 里补一条；要在首页作品卷露面，把 specimen 填成
   specimens.jsx 里那张解剖图的键。 */
export const profile = {
  name: '琉璃幻影',
  latinName: 'Glazed Mirage',
  tagline: '数据科学与大数据技术专业背景。用 Electron 做桌面应用，用原生 JS 做浏览器扩展，用 Go 做存储引擎。',
  email: 'luchang0829@163.com',
  location: '北京',
  school: '中国地质大学（武汉）',
  status: '开放合作',

  socials: [
    { label: 'GitHub', note: '源码', url: 'https://github.com/liu-li-huan-ying' },
    { label: 'QQ', note: '点击复制', enc: 'VFxRVFBfUVVeWg==' },
    { label: '微信', note: '点击复制', enc: 'EAEEHh4KAwsQ' },
  ],

  about: [
    '我学的是数据科学与大数据技术，但真正花时间的地方在「东西做出来之后好不好用」。玉笺的材质是纸墨与玻璃，所见即所得；每一版都在删东西，因为加容易，删难。',
    '另一条线是把东西真的落到人手上。GojiDB 让我保持对存储与并发的敏感；背呗则把我按在数据上——几千条词表里缺例句、繁简混杂，只能写脚本补齐再逐条抽查。都是有限的资源里做取舍，只是被限制的东西不同。',
  ],

  skills: [
    ['JavaScript / TypeScript', '日常'],
    ['React / Vue 3', '前端'],
    ['Electron', '桌面'],
    ['Go', '系统'],
    ['React Native / Expo', '移动'],
    ['Node.js / Python', '工具'],
    ['CSS / 设计系统', '材质'],
  ],

  now: [
    ['在做', '玉笺的窑色皮肤与编辑保真度；GojiDB 补 TTL 与压缩策略的测试。'],
    ['在读', '《置身事内》，读书笔记已发在手记里。技术书之外也读点别的。'],
    ['在写', 'LSM-Tree 与 WAL 那几篇的续篇——写下来才知道自己哪里没想清楚。'],
  ],

  /* 指标口径见 SelfNote 末段。发布前请照仓库 bench/ 的真实配置复核一遍 */
  figures: [
    { value: 4, unit: '件', label: '长期维护的开源项目' },
    { value: 120, prefix: '', unit: 'K+ ops/s', label: 'GojiDB 写入吞吐（YCSB）' },
    { value: 50, prefix: '<', unit: 'MB', label: '百万 KV 场景内存占用' },
    { value: 5, unit: '套', label: '玉笺的传统窑色皮肤' },
  ],

  projects: [
    {
      id: 'yujian',
      title: '玉笺',
      latin: 'YuJian',
      kind: '桌面端',
      role: '独立开发者',
      year: '2026',
      specimen: 'yujian',
      image: '/projects/yujian.jpg',
      desc: '本地优先的 Markdown 写作工具。文件夹即笔记库，文档是普通 .md。',
      tradeoff:
        '用富文本内核换取所见即所得，代价是文档会被自己的 schema 悄悄改写。我的选择是把 schema 压到最小，对未编辑的文档做逐字节原样写回——宁可少一些花哨的节点类型，也不让用户的文件在保存时被动过。',
      tags: ['Electron', 'Vue 3', 'Milkdown', 'TypeScript'],
      github: 'https://github.com/liu-li-huan-ying/yujian',
      live: '',
      detail: {
        body: [
          '玉笺（yù jiān，「玉制的信笺」）是一款本地优先的 Markdown 写作工具：文件夹即笔记库，文档是普通的 .md 文件，数据永远可读、可 Git、可迁移。编辑器内核基于 Milkdown Crepe，Markdown 是一等公民，未编辑的文档保存时一字不改写回原文。',
          '视觉上以「玉质」为核心材质语言——框架层温润玉质、浮层玻璃透亮、内容层纯净实色，并提供五套中国传统窑色皮肤（青瓷 / 天青 / 月白 / 黛 / 琥珀）与深 / 浅 / 跟随系统三档明暗。玻璃材质系统统一所有浮层面板。',
        ],
        highlights: [
          '所见即所得 + 源码模式切换，Markdown 往返保真',
          '五套窑色皮肤 + 玻璃材质系统（backdrop-filter）',
          'Mermaid 图表、KaTeX 公式、代码高亮、PDF / HTML 导出',
        ],
      },
    },
    {
      id: 'gojidb',
      title: 'GojiDB',
      latin: '',
      kind: '存储引擎',
      role: '独立开发者',
      year: '2025',
      specimen: 'gojidb',
      image: '/projects/gojidb.jpg',
      desc: '从零实现的类 RocksDB 轻量引擎。LSM-Tree 分层压缩，WAL 崩溃恢复。',
      tradeoff:
        '分层压缩能把读放大压下来，但写入路径被拉长了：一次写要穿过 WAL、MemTable，再等后台协程把 SSTable 合并下去。我选择牺牲一点单次写延迟，换更稳定的尾延迟——嵌入式场景里，最坏情况比平均值重要。',
      tags: ['Go', 'LSM-Tree', 'WAL', 'TTL'],
      github: 'https://github.com/liu-li-huan-ying/gojidb',
      live: '',
      detail: {
        body: [
          '为解决嵌入式场景下的高性能 KV 存储需求，从零实现了一个类 RocksDB 的轻量引擎。核心难点在于 LSM-Tree 的层级压缩策略与 WAL 崩溃恢复机制，需要兼顾写入吞吐与读放大。',
          '通过分层 SSTable、布隆过滤器与后台压缩协程，换到稳定的写入性能与可控的内存占用，并以 YCSB 基准验证高并发下的表现。',
        ],
        highlights: [
          '写入吞吐 > 120K ops/s（YCSB 基准）',
          'WAL 崩溃恢复，数据零丢失',
          '内存占用 < 50MB（100 万 KV 场景）',
        ],
      },
    },
    {
      id: 'lucent-newtab',
      title: 'Lucent',
      latin: 'New Tab',
      kind: '浏览器扩展',
      role: '独立开发者',
      year: '2026',
      specimen: 'lucent',
      image: '/projects/lucent-newtab.jpg',
      desc: '零框架零依赖的新标签页扩展。环境音由 Web Audio 现场合成，包体内无音频文件。',
      tradeoff:
        '不上框架，意味着所有状态同步都要手写：卡片拖拽、设置持久化、跨区域排序，没有响应式系统可以依赖。换来的是两百 KB 以内的包体和秒开——一个每次开新标签页都要看的东西，启动速度就是它的全部体验。',
      tags: ['HTML', 'CSS', 'JavaScript', 'Web Audio'],
      github: 'https://github.com/liu-li-huan-ying/lucent-newtab',
      live: '',
      detail: {
        body: [
          'Lucent 是一个零框架、零依赖的浏览器新标签页扩展——纯 HTML、CSS、JavaScript。Unsplash 与必应每日壁纸加液态玻璃蒙版、12 个可切换搜索引擎，以及完全由 Web Audio API 合成的环境音（雨声、咖啡馆、海浪、篝火）。',
          '设计上用 `.veil` 压暗蒙版，确保白字在亮图上依然清晰。卡片可跨区域拖拽排序，设置持久化到 localStorage，支持 JSON 导出与导入备份。',
        ],
        highlights: [
          'Web Audio 合成环境音（包体内无音频文件）',
          'Unsplash + 必应每日壁纸，按天缓存',
          'MV3 Chrome / Edge 扩展，GitHub Actions 自动发版',
        ],
      },
    },
    {
      id: 'beibei',
      title: '背呗',
      latin: 'BeiBei',
      kind: '移动应用',
      role: '独立开发者',
      year: '2026',
      specimen: 'beibei',
      image: '',
      desc: 'React Native + Expo 背单词应用。词表与例句全部落在设备上，断网可用。',
      tradeoff:
        '真正花时间的不是界面，是数据。原始词库里有的例句缺中文、有的整条是繁体，我写脚本把缺失的中英例句补齐、把繁体统一转成简体，再逐条抽查。复习节奏也没引第三方记忆库——自己写一套间隔重复，宁可朴素但可解释，也不要一个我调不动的黑箱。',
      tags: ['React Native', 'Expo', 'TypeScript', '本地优先'],
      github: '',
      live: '',
      detail: {
        body: [
          '面向 Android 的背单词应用，React Native + Expo 实现。词表、例句、进度全部落在设备本地，不联网也能用，所以没有账号体系，也没有订阅。',
          '复习节奏自己写：每个词一条记忆强度曲线，按作答情况决定下一次什么时候出现，间隔逐次拉长。算法朴素，但每一步都能解释给我自己听。',
        ],
        highlights: [
          '词库与进度全本地，离线可用',
          '自研间隔重复，复习点由作答决定',
          '词表清洗：补全缺失例句，繁体统一转简体',
        ],
      },
    },
    {
      id: 'phantom-video',
      title: 'Phantom Video',
      latin: '',
      kind: '桌面端',
      role: '独立开发者',
      year: '2026',
      specimen: '',
      image: '/projects/phantom-video.jpg',
      desc: 'Windows 视频播放器。libmpv 解码内核 + D3D11VA 零拷贝硬解，UI 全自绘。',
      tradeoff:
        '用现成 UI 框架能省掉大部分工作，但播放器窗口本身就是内容——框架的窗口模型会把它框成一个普通的应用窗口。所以界面每一个像素都自己画在 Win32 之上，代价是拖拽、缩放、全屏这些交互全都要从零写。',
      tags: ['C++17', 'Win32', 'libmpv', 'D3D11VA', 'SDL2'],
      github: 'https://github.com/liu-li-huan-ying/phantom-video',
      live: '',
      detail: {
        body: [
          '做这个播放器，是因为市面上的产品要么臃肿，要么 UI 停留在十年前。架构上做了干净的分层：libmpv 负责封装解析与解码，而界面的每一个像素都由自己的代码在 Win32 之上绘制。',
          '最难啃的是渲染管线。解码帧不经过 CPU 内存拷贝，而是由 D3D11VA 直接输出到 GPU 表面并合成上屏——零拷贝路径让 4K 播放依然轻快。UI 层基于 SDL2 的 UpdateLayeredWindow 实现逐像素透明，窗口形状完全自由。',
        ],
        highlights: [
          'D3D11VA 零拷贝硬件解码，4K 播放流畅轻快',
          'SDL2 ULW 逐像素透明异形窗口，UI 完全自绘',
          '纯 C++17 / Win32 实现，零第三方 UI 框架依赖',
        ],
      },
    },
  ],

  experience: [
    {
      period: '2022 — 2026',
      role: '数据科学与大数据技术 · 本科',
      company: '中国地质大学（武汉）',
      desc: '主修数据结构、数据库系统、分布式计算与大数据处理。',
    },
  ],

  posts,
}

export const githubProfileUrl = 'https://github.com/liu-li-huan-ying'
