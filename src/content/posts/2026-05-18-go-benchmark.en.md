---
title: Benchmarking Go Databases Honestly
date: 2026-05-18
tags: Go, Performance
summary: YCSB workloads, benchstat and the lies your own benchmark tells you when you are not careful.
readTime: 5
---

Every database README quotes heroic numbers. Few explain the machine, the workload distribution, or whether GC pauses were counted. An honest benchmark is mostly about removing the ways you might fool yourself.

## Start from YCSB, not from vibes

- Workload A: 50/50 read/write — the classic mixed OLTP shape
- Workload B: 95/5 read-heavy — closer to most production caches
- Workload F: read-modify-write — exposes lock contention early

```bash
go test -bench=BenchmarkPut -benchtime=10s -count=10 .
benchstat old.txt new.txt
```

Run each benchmark at least ten times and compare distributions with benchstat, never eyeball single runs. Pin goroutine counts, log GC metrics alongside throughput, and always report the hardware — a number without a machine spec is marketing, not measurement.
