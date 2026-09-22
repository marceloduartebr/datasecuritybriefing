---
title: "Edge BR: MikroTik, Fortinet and SonicWall in the September KEV"
description: "KEV Sep/2026: MikroTik CVE-2026-86060/67277, Fortinet CVE-2025-25249 and SonicWall SMA1000 CVE-2026-83548/83549 — BR edge."
pubDate: 2026-09-22T10:43:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-edge.jpg"
tipo: vulnerabilidades
tags: ["kev", "mikrotik", "fortinet", "sonicwall", "edge", "brasil"]
notionUrl: "https://www.notion.so/3dd174117473812db535c53989507de6"
pais: br
---

In one line: three edge families widely present in Brazil enter (or reappear) in the September KEV.

## What happened

The September/2026 KEV lists MikroTik CVE-2026-86060 and CVE-2026-67277; Fortinet CVE-2025-25249; SonicWall SMA1000 CVE-2026-83548 and CVE-2026-83549 — all with known exploitation according to CISA (catalog 14/09/2026).

## Why it matters

Branches, ISPs and home VPN in Brazil run these platforms outside the DC patch cycle. Incomplete inventory delays BOD/KEV response. A 2025 CVE still in the 2026 KEV reinforces the point: CVSS and ID year do not measure current exposure.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| MikroTik RouterOS | CVE-2026-86060, CVE-2026-67277, KEV | Critical |
| Fortinet | CVE-2025-25249, KEV | Critical |
| SonicWall SMA1000 | CVE-2026-83548, CVE-2026-83549, KEV | Critical |

## What to do this week

1. Cross CMDB/NetBox with MikroTik, Fortinet and SonicWall — owner: network.
2. Prioritize patch/mitigation of the KEV CVEs above — owner: operations.
3. Signal that it worked: every edge appliance has version and a remediation ticket linked to the KEV.
