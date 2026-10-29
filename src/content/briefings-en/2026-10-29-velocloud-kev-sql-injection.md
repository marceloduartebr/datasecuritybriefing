---
title: "CVE-2026-114625 in the KEV: SQL injection in Arista VeloCloud Orchestrator"
description: "CISA adds exploited SQL injection flaw in SD-WAN orchestrator; third for the product in the catalog in 2026."
pubDate: 2026-10-29T10:22:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/23/cisa-adds-one-known-exploited-vulnerability-catalog"
cover: "https://covers.duarte.top/covers/20261028-velocloud-kev-sql-injection.jpg"
tipo: vulnerabilidades
tags: ["kev", "velocloud", "edge", "cve-2026-114625", "cisa"]
notionUrl: "https://www.notion.so/406174117473818fb91ce96808fe456c"
---

**In one line:** SQL injection in VeloCloud Orchestrator enters the KEV with a three-day federal deadline and is the third flaw of the product in the catalog this year.

## What happened

On 23 October 2026 CISA added CVE-2026-114625 to the KEV. The vulnerability is SQL injection in on-premise versions of the Arista VeloCloud Orchestrator (CVSS 9.9) that allows access to privileged internal functionality. Federal remediation deadline: 26 October. Exploitation requires a minimal authenticated session. Fixes in 5.2.3.18, 6.1.3.10 and 6.4.2.12.

## Why it matters

An edge orchestrator concentrates management of multiple sites. The third addition to the KEV in the year raises the priority of inventory and of patch verification on on-premise instances.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Exploited SQL injection | KEV + Arista confirmation | High |
| Access to privileged functionality | CVSS 9.9 | High |
| Minimal session sufficient | Enterprise Read Only | Medium |

## What to do this week

1. Inventory on-premise instances of the VeloCloud Orchestrator — network/edge owner.
2. Apply the fixed versions and confirm remediation — vulnerability owner.
3. Review logs of authenticated sessions on the portal in the period before the patch.
