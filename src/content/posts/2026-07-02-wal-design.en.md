---
title: WAL Design for Embedded KV Stores
date: 2026-07-02
tags: Go, Durability
summary: Crash safety without sacrificing throughput: record formats, fsync strategies and recovery replay for a hand-written WAL.
readTime: 6
---

A write-ahead log is the difference between "my database lost your data" and "my database restarted". Before any mutation touches the memtable, it must be durable somewhere recoverable. Designing that somewhere well is mostly about three decisions.

## Decision one: what counts as durable

- fsync per write: bulletproof, brutally slow — only for money
- Group commit: batch many writes behind one fsync — the default choice
- OS flush only: fast, loses a window of writes on power loss — fine for caches

## Decision two: the record format

```text
| len(4B) | crc32(4B) | type(1B) | key | value |
```

A length prefix lets you skip torn tails, a CRC catches partial writes, and a type byte distinguishes puts from deletions during replay. Recovery is then just: read records until CRC fails, truncate there, rebuild the memtable.

> Torn writes are not an edge case. On real disks they are Tuesday.
