---
title: From College Project to Open Source
date: 2026-03-06
tags: Open Source, Career
summary: How a coursework idea became GojiDB: scoping it down, writing the docs first and surviving your first public issue.
readTime: 4
---

GojiDB started as a scaled-down course assignment: build any storage system with a durability guarantee. The first working version was ugly but complete — and completeness turned out to be the whole trick.

## Rules that actually held up

- Cut scope until only the LSM core remained; TTL came months later
- Write the readme and a quickstart before polishing internals
- Add benchmarks early — they became the project's best documentation
- Treat the first public issue as a gift, not an attack

> Open source is not publishing code. It is publishing a place where other people can think with you.
