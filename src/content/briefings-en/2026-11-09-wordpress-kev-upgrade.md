---
title: "CISA adds unauthenticated RCE in WordPress Core upgrade to KEV"
description: "CVE-2026-119977 allows code execution during the upgrade window via predictable staging paths; federal deadline November 6."
pubDate: 2026-11-09T10:25:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/03/cisa-adds-one-known-exploited-vulnerability-catalog"
cover: "https://covers.duarte.top/covers/20261104-wordpress-kev-upgrade.jpg"
tipo: vulnerabilidades
tags: ["wordpress", "kev", "rce", "patch"]
pais: us
notionUrl: "https://www.notion.so/40e1741174738180bee6ef3979973365"
---

In one line: WordPress Core 4.7–7.1.3 has unauthenticated RCE in the upgrade window; CISA added it to the KEV on November 3 with a November 6 deadline.

## What happened

On November 3, 2026, CISA added CVE-2026-119977 to the KEV catalog. The vulnerability is a TOCTOU in the full upgrade process: files are placed in predictable, web-accessible staging paths. An unauthenticated attacker who wins the race executes code. CVSS 8.1 (High). Affects 4.7 to 7.1.3. Fix confirmed in 7.1.4; backports in progress. Federal deadline November 6; forensic triage required.

## Why it matters

The maintenance window becomes a vector. WordPress sites are a common perimeter in companies and agencies in the region. Auto-update helps, but the control is knowing whether the instance is still on the vulnerable version and whether the staging process was cleaned.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Unauthenticated RCE in the upgrade window | CISA KEV + NVD | High |
| Predictable staging paths | CVE description | High |
| Confirmed exploitation | Addition to KEV | High |

## What to do this week

1. Inventory WordPress instances and versions — owner: application / DevOps team.
2. Update to 7.1.4 or apply the corresponding backport — owner: platform owner.
3. Check upgrade logs and accesses to wp-content/upgrade in recent days — owner: SOC.