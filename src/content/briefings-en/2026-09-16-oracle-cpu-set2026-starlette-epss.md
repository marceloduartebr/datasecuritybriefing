---
title: "Oracle CPU 15 Sep and the Starlette warning: CVSS ≠ risk"
description: "Oracle Critical Patch Update 15 Sep (OAM/WebLogic/Hyperion) and Starlette CVE-2026-48710 CVSS 6.5 with EPSS 0.36 — CVSS is not priority."
pubDate: 2026-09-16T10:21:00-03:00
sourceName: "Oracle CPU / FIRST EPSS"
sourceUrl: "https://www.oracle.com/security-alerts/"
cover: "https://covers.duarte.top/covers/20260916-vuln-patch.jpg"
tipo: vulnerabilidades
tags: ["oracle", "cpu", "starlette", "epss", "cvss", "priorizacao"]
notionUrl: "https://www.notion.so/3dd17411747381f98cd5f5c14dc0f4a9"
---

In one line: the 15 Sep Oracle CPU demands a patch cycle; Starlette CVE-2026-48710 shows high EPSS with a CVSS of “only” 6.5.

## What happened

On 15 Sep 2026 Oracle published the Critical Patch Update covering, among others, Oracle Access Manager, WebLogic and Hyperion. In parallel, CVE-2026-48710 (Starlette) appears with CVSS 6.5 and EPSS ~0.36 (reading 15 Sep) — elevated exploitation probability for a “medium” score.

## Why it matters

Teams that sort only by CVSS ≥ 9 delay what EPSS and the KEV already flag. WebLogic/OAM in Brazil still underpin ERP and identity. Starlette under FastAPI frameworks extends the lesson to the modern Python stack.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Oracle CPU 15 Sep (OAM/WebLogic/Hyperion) | Critical Patch Update bulletin | High (context) |
| Starlette CVE-2026-48710 | CVSS 6.5, EPSS ~0.36 on 15 Sep | High (probability) |
| Prioritisation by CVSS only | Known operational bias | Process |

## What to do this week

1. Open a change for the 15 Sep Oracle CPU on products in production — owner: platform.
2. Include EPSS/KEV in the patch SLA criterion (not only CVSS) — owner: vuln mgmt.
3. Signal it worked: the backlog shows CVE-2026-48710 prioritised despite the 6.5, and the Oracle CPU with a booked window.
