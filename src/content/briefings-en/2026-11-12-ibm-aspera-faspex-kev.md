---
title: "IBM Aspera Faspex: authorization bypass that grants admin enters KEV"
description: "Exploited flaw grants full privilege on a platform that stores files exchanged between companies."
pubDate: 2026-11-12T10:20:00-03:00
sourceName: "IBM"
sourceUrl: "https://www.ibm.com/support/pages/node/7295921"
cover: "https://covers.duarte.top/covers/20261110-ibm-aspera-faspex-kev.jpg"
tipo: vulnerabilidades
pais: us
tags: ["kev", "ibm", "transferencia-de-arquivos", "retencao", "perimetro"]
notionUrl: "https://www.notion.so/41317411747381958fe3c44e63c0cc2d"
---

In one line: admin on a file transfer platform is access to the data history that no one cleaned.

## What happened

CISA added CVE-2026-123218 for IBM Aspera Faspex to the KEV on 09/11/2026, based on evidence of active exploitation. IBM's bulletin of 07/11/2026 states that Faspex 5 allows a user to create a specific message to bypass authorization and obtain full administrator privileges (CWE-863). Affects 5.0.0 to 5.0.19; fix in 5.0.19 PL1 (Linux), no workaround. CVSS 9.8 per IBM; EPSS 0.4% on 09/11.

## Why it matters

File transfer platforms accumulate contracts, database extracts and partner data. The damage from an unauthorized admin is proportional to what was retained.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Authorization bypass to admin | KEV 09/11/2026; IBM bulletin | Critical |
| Data retained on the platform | Depends on retention policy | High |

## What to do this week

1. Update to 5.0.19 PL1 — owner: infrastructure.
2. Review admin accounts and access logs since disclosure — owner: SOC.
3. Signal it worked: corrected version in production and retention policy applied to old packages.
