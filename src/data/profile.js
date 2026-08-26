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
    skills: [
      'JavaScript',
      'TypeScript',
      'React',
      'Vue',
      'Node.js',
      'Python',
      'Go',
      'C',
      'C++',
    ],
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
        github: 'https://github.com/liu-li-huan-ying/GojiDB',
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
    posts: [
      {
        slug: 'lsm-tree',
        date: '2026-08-15',
        title: 'Understanding LSM-Tree in Go',
        summary:
          'The write-optimized storage structure behind RocksDB and GojiDB — memtables, SSTables and the compaction dance explained by building one.',
        tags: ['Go', 'Storage'],
        readTime: 7,
        content: [
          {
            t: 'p',
            text: 'B-trees optimize reads; LSM-Trees optimize writes. That single trade-off explains most modern KV stores. Instead of writing in place, an LSM-Tree appends everything to an in-memory table and periodically flushes it to disk as immutable files.',
          },
          { t: 'h2', text: 'The write path' },
          {
            t: 'p',
            text: 'A write hits the WAL first, then the memtable. When the memtable fills up, it freezes into an SSTable — a sorted string table — and a fresh memtable takes over. Reads check the memtable, then SSTables from newest to oldest, with a Bloom filter per file skipping the ones that cannot possibly contain your key.',
          },
          {
            t: 'code',
            lang: 'go',
            text: 'func (db *DB) Put(key, value []byte) error {\n    if err := db.wal.Append(key, value); err != nil {\n        return err\n    }\n    return db.memtable.Set(key, value)\n}',
          },
          { t: 'h2', text: 'Compaction: paying debt down' },
          {
            t: 'list',
            items: [
              'Size-tiered: merge similarly-sized tables — great write bursts, worse space amplification',
              'Leveled: each level is 10x the previous, overlapping runs merged downward — predictable reads, more write amplification',
              'GojiDB uses leveled compaction with per-level Bloom filters to keep read amplification bounded',
            ],
          },
          {
            t: 'quote',
            text: 'Every storage engine is a bet on which cost your workload can afford: write amplification, read amplification, or space.',
          },
        ],
      },
      {
        slug: 'wal-design',
        date: '2026-07-02',
        title: 'WAL Design for Embedded KV Stores',
        summary:
          'Crash safety without sacrificing throughput: record formats, fsync strategies and recovery replay for a hand-written WAL.',
        tags: ['Go', 'Durability'],
        readTime: 6,
        content: [
          {
            t: 'p',
            text: 'A write-ahead log is the difference between "my database lost your data" and "my database restarted". Before any mutation touches the memtable, it must be durable somewhere recoverable. Designing that somewhere well is mostly about three decisions.',
          },
          { t: 'h2', text: 'Decision one: what counts as durable' },
          {
            t: 'list',
            items: [
              'fsync per write: bulletproof, brutally slow — only for money',
              'Group commit: batch many writes behind one fsync — the default choice',
              'OS flush only: fast, loses a window of writes on power loss — fine for caches',
            ],
          },
          {
            t: 'h2', text: 'Decision two: the record format' },
          {
            t: 'code',
            lang: 'text',
            text: '| len(4B) | crc32(4B) | type(1B) | key | value |',
          },
          {
            t: 'p',
            text: 'A length prefix lets you skip torn tails, a CRC catches partial writes, and a type byte distinguishes puts from deletions during replay. Recovery is then just: read records until CRC fails, truncate there, rebuild the memtable.',
          },
          {
            t: 'quote',
            text: 'Torn writes are not an edge case. On real disks they are Tuesday.',
          },
        ],
      },
      {
        slug: 'go-benchmark',
        date: '2026-05-18',
        title: 'Benchmarking Go Databases Honestly',
        summary:
          'YCSB workloads, benchstat and the lies your own benchmark tells you when you are not careful.',
        tags: ['Go', 'Performance'],
        readTime: 5,
        content: [
          {
            t: 'p',
            text: 'Every database README quotes heroic numbers. Few explain the machine, the workload distribution, or whether GC pauses were counted. An honest benchmark is mostly about removing the ways you might fool yourself.',
          },
          { t: 'h2', text: 'Start from YCSB, not from vibes' },
          {
            t: 'list',
            items: [
              'Workload A: 50/50 read/write — the classic mixed OLTP shape',
              'Workload B: 95/5 read-heavy — closer to most production caches',
              'Workload F: read-modify-write — exposes lock contention early',
            ],
          },
          {
            t: 'code',
            lang: 'bash',
            text: 'go test -bench=BenchmarkPut -benchtime=10s -count=10 .\nbenchstat old.txt new.txt',
          },
          {
            t: 'p',
            text: 'Run each benchmark at least ten times and compare distributions with benchstat, never eyeball single runs. Pin goroutine counts, log GC metrics alongside throughput, and always report the hardware — a number without a machine spec is marketing, not measurement.',
          },
        ],
      },
      {
        slug: 'open-source-journey',
        date: '2026-03-06',
        title: 'From College Project to Open Source',
        summary:
          'How a coursework idea became GojiDB: scoping it down, writing the docs first and surviving your first public issue.',
        tags: ['Open Source', 'Career'],
        readTime: 4,
        content: [
          {
            t: 'p',
            text: 'GojiDB started as a scaled-down course assignment: build any storage system with a durability guarantee. The first working version was ugly but complete — and completeness turned out to be the whole trick.',
          },
          { t: 'h2', text: 'What made it survivable' },
          {
            t: 'list',
            items: [
              'Cut scope until only the LSM core remained; TTL came months later',
              'Write the readme and a quickstart before polishing internals',
              'Add benchmarks early — they became the project\'s best documentation',
              'Treat the first public issue as a gift, not an attack',
            ],
          },
          {
            t: 'quote',
            text: 'Open source is not publishing code. It is publishing a place where other people can think with you.',
          },
        ],
      },
    ],
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
        github: 'https://github.com/liu-li-huan-ying/GojiDB',
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
    posts: [
      {
        slug: 'lsm-tree',
        date: '2026-08-15',
        title: '用 Go 理解 LSM-Tree',
        summary: 'RocksDB 与 GojiDB 背后的写优化存储结构——通过亲手实现一个来讲透内存表、SSTable 与压缩机制。',
        tags: ['Go', '存储'],
        readTime: 7,
        content: [
          {
            t: 'p',
            text: 'B 树为读优化，LSM-Tree 为写优化——这一个取舍几乎解释了所有现代 KV 数据库的存在形态。LSM-Tree 不做原地写入，而是把所有变更先追加进内存表，再周期性地刷成磁盘上的不可变文件。',
          },
          { t: 'h2', text: '写入路径' },
          {
            t: 'p',
            text: '一次写入先落 WAL，再进内存表。内存表写满后冻结为一个 SSTable（有序字符串表），新的内存表接棒。读取则依次查内存表和由新到旧的 SSTable，每个文件配备布隆过滤器，快速排除"绝不可能包含该键"的文件。',
          },
          {
            t: 'code',
            lang: 'go',
            text: 'func (db *DB) Put(key, value []byte) error {\n    if err := db.wal.Append(key, value); err != nil {\n        return err\n    }\n    return db.memtable.Set(key, value)\n}',
          },
          { t: 'h2', text: '压缩：偿还欠下的债' },
          {
            t: 'list',
            items: [
              '大小分层：合并尺寸相近的表——写突发友好，空间放大较重',
              '分层合并（Leveled）：每层是上一层的 10 倍、向下归并——读放大可控，写放大更高',
              'GojiDB 采用 Leveled 压缩 + 每层布隆过滤器，把读放大限制在常数级',
            ],
          },
          {
            t: 'quote',
            text: '每一个存储引擎都是在下注：赌你的负载承受得起写放大、读放大还是空间放大。',
          },
        ],
      },
      {
        slug: 'wal-design',
        date: '2026-07-02',
        title: '嵌入式 KV 存储的 WAL 设计',
        summary: '不牺牲吞吐的崩溃安全：记录格式、fsync 策略与恢复重放，手写一个 WAL 的完整思考。',
        tags: ['Go', '可靠性'],
        readTime: 6,
        content: [
          {
            t: 'p',
            text: 'WAL 是「数据库弄丢了你的数据」和「数据库只是重启了一次」之间的那道墙。任何变更触碰内存表之前，必须先在某个可恢复的地方落地。把这个地方设计好，本质上就是三个决策。',
          },
          { t: 'h2', text: '决策一：什么才算持久化成功' },
          {
            t: 'list',
            items: [
              '每次写入都 fsync：绝对可靠但极慢——只属于金融场景',
              '组提交：多个写入共享一次 fsync——默认的正确选择',
              '只交给操作系统刷盘：快，断电丢一个窗口的数据——缓存类场景可接受',
            ],
          },
          { t: 'h2', text: '决策二：记录格式' },
          {
            t: 'code',
            lang: 'text',
            text: '| 长度(4B) | CRC32(4B) | 类型(1B) | key | value |',
          },
          {
            t: 'p',
            text: '长度前缀让你能跳过残缺的尾部；CRC 校验捕获半截写入；类型字节在重放时区分 put 和 delete。于是恢复过程变得朴素：逐条读到 CRC 失败为止，在那里截断文件，重建内存表，完事。',
          },
          {
            t: 'quote',
            text: '撕裂写不是边界情况。在真实的磁盘上，它就是每个普通的星期二。',
          },
        ],
      },
      {
        slug: 'go-benchmark',
        date: '2026-05-18',
        title: '诚实地给 Go 数据库做基准测试',
        summary: 'YCSB 负载模型、benchstat 对比实验，以及你自己的基准测试是如何骗过你的。',
        tags: ['Go', '性能'],
        readTime: 5,
        content: [
          {
            t: 'p',
            text: '每个数据库的 README 都写着英雄数字，却很少说明测试机器、负载分布、GC 停顿算没算进吞吐。一份诚实的基准测试，核心工作是穷尽"自己骗自己"的可能性。',
          },
          { t: 'h2', text: '从 YCSB 开始，而不是凭感觉' },
          {
            t: 'list',
            items: [
              '负载 A：读写各半——经典的混合 OLTP 形态',
              '负载 B：读占 95%——更接近大多数生产缓存的真实压力',
              '负载 F：读-改-写——最早暴露锁竞争问题',
            ],
          },
          {
            t: 'code',
            lang: 'bash',
            text: 'go test -bench=BenchmarkPut -benchtime=10s -count=10 .\nbenchstat old.txt new.txt',
          },
          {
            t: 'p',
            text: '每组基准至少跑十次，用 benchstat 比较分布，永远不要肉眼对比单次结果。固定协程数、把 GC 指标与吞吐一起记录，并且永远附上硬件规格——没有机器型号的数字是广告，不是测量。',
          },
        ],
      },
      {
        slug: 'open-source-journey',
        date: '2026-03-06',
        title: '从课程项目到开源项目',
        summary: '一个课程作业如何长成 GojiDB：砍需求、先写文档，以及挺过第一个公开 issue。',
        tags: ['开源', '职业'],
        readTime: 4,
        content: [
          {
            t: 'p',
            text: 'GojiDB 最初是一个缩小版的课程作业：做一个带持久化保证的存储系统。第一版能跑的代码很丑，但它完整——而"完整"恰恰是全部秘诀所在。',
          },
          { t: 'h2', text: '让它活下来的几件事' },
          {
            t: 'list',
            items: [
              '把范围砍到只剩 LSM 内核；TTL 是几个月后才加的',
              '在打磨内部实现之前，先写好 README 和快速上手',
              '尽早加基准测试——它们后来成了项目最好的文档',
              '把第一个公开 issue 当作礼物，而不是攻击',
            ],
          },
          {
            t: 'quote',
            text: '开源不是发布代码，而是发布一个能让别人和你一起思考的地方。',
          },
        ],
      },
    ],
  },
}

export const navLinks = [{ id: 'about' }, { id: 'projects' }, { id: 'experience' }, { id: 'blog' }, { id: 'contact' }]

export const githubProfileUrl = 'https://github.com/liu-li-huan-ying'
