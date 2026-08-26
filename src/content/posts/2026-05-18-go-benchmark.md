---
title: 诚实地给 Go 数据库做基准测试
date: 2026-05-18
tags: Go, 性能
summary: YCSB 负载模型、benchstat 对比实验，以及你自己的基准测试是如何骗过你的。
---

每个数据库的 README 都写着英雄数字，却很少说明测试机器、负载分布、GC 停顿算没算进吞吐。一份诚实的基准测试，核心工作是穷尽"自己骗自己"的可能性。

## 从 YCSB 开始，而不是凭感觉

- 负载 A：读写各半——经典的混合 OLTP 形态
- 负载 B：读占 95%——更接近大多数生产缓存的真实压力
- 负载 F：读-改-写——最早暴露锁竞争问题

```bash
go test -bench=BenchmarkPut -benchtime=10s -count=10 .
benchstat old.txt new.txt
```

每组基准至少跑十次，用 benchstat 比较分布，永远不要肉眼对比单次结果。固定协程数、把 GC 指标与吞吐一起记录，并且永远附上硬件规格——没有机器型号的数字是广告，不是测量。
