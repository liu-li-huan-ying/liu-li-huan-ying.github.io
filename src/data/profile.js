import { postsFor } from './mdPosts'

const postsEn = postsFor('en')
const postsZh = postsFor('zh')

export const profile = {
  en: {
    name: 'Glazed Mirage',
    roles: ['Full Stack Developer', 'AI Application Explorer', 'Open Source Enthusiast'],
    tagline:
      'Data Science & Big Data Technology graduate. I enjoy turning ideas into scalable systems, exploring the intersection of frontend engineering and distributed systems.',
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
      'Hello! I come from a Data Science and Big Data Technology background, and I love turning ideas into runnable, scalable systems. Most of my recent work lives at the intersection of frontend engineering and distributed systems — building interfaces on one end and storage engines on the other.',
      'GojiDB, my hand-written LSM-Tree based KV store, is where I spend most of my open-source energy these days. Away from the keyboard I am usually reading papers on storage engines or exploring how AI applications can be engineered properly.',
    ],
    features: [
      { icon: 'code', title: 'Full Stack', desc: 'From React UIs to Go storage engines' },
      { icon: 'sparkles', title: 'Systems Thinking', desc: 'LSM-Trees, WAL and distributed design' },
      { icon: 'zap', title: 'Performance', desc: 'Benchmark-driven, measured always' },
      { icon: 'rocket', title: 'Open Source', desc: 'Building in public, shipping often' },
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'Python', 'Go', 'C', 'C++'],
    projects: [
      {
        id: 'phantom-video',
        letter: 'P',
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
    roles: ['全栈开发者', 'AI 应用探索者', '开源爱好者'],
    tagline:
      '数据科学与大数据技术专业背景，热爱用代码把想法变成可运行、可扩展的系统。在前端与分布式系统之间寻找优雅的工程解法。',
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
      '你好！我来自数据科学与大数据技术专业，热爱用代码把想法变成可运行、可扩展的系统。近期的工作大多发生在前端工程与分布式系统的交界处——一端打磨界面，另一端打磨存储引擎。',
      '手写的 LSM-Tree 键值数据库 GojiDB 是我目前投入最多开源精力的项目。离开键盘的时候，我通常在读存储引擎相关的论文，或者琢磨 AI 应用该如何被正确地工程化。',
    ],
    features: [
      { icon: 'code', title: '全栈能力', desc: '从 React 界面到 Go 存储引擎' },
      { icon: 'sparkles', title: '系统思维', desc: 'LSM-Tree、WAL 与分布式设计' },
      { icon: 'zap', title: '性能至上', desc: '基准驱动，用数据说话' },
      { icon: 'rocket', title: '拥抱开源', desc: '公开构建，持续交付' },
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Vue', 'Node.js', 'Python', 'Go', 'C', 'C++'],
    projects: [
      {
        id: 'phantom-video',
        letter: 'P',
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
