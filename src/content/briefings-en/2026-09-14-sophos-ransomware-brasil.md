---
title: "Sophos: median ransom in Brazil rises 63% and hits US$ 640 thousand"
description: "Median ransomware demand in Brazil reaches US$ 640 thousand in 2025; payment falls to 45% and 74% of cases go through identity."
pubDate: 2026-09-14T10:20:00-03:00
sourceName: "Estadão / Sophos"
sourceUrl: "https://www.estadao.com.br/tecmundo/ciberseguranca/resgates-ransomware-sobem-no-brasil/"
cover: "https://covers.duarte.top/covers/20260909-sophos-ransomware-brasil.jpg"
tipo: noticia
tags: ["ransomware", "identidade", "brasil", "backup"]
notionUrl: "https://www.notion.so/3d617411747381ce9c4dca448de9d24a"
---

In one line: the median demand rises, payment falls, and the vector stops being a technical flaw and becomes a credential.

## What happened

On 9 Sep 2026 Estadão published a cut of Sophos’s annual ransomware report on Brazil (2025 data). The median demand reached US$ 640 thousand (about R$ 3.27 million), up 63%. Brazil led the global ranking of email-initiated intrusions (37% of cases). Exploitation of technical flaws fell from 44% to 24%. In 74% of the organisations hit the scam was linked to identity and credential theft. The share that paid the ransom dropped from 66% to 45%. 85% of victims used backup to recover files, against 73% in the previous survey.

## Why it matters

An isolated backup is not the same as a tested continuity plan. Double extortion still presses for the data, not only for downtime. The local nexus is an identity inventory — service account, backup token and directory admin — and restoration evidence, not only a written policy.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Identity / credential | 74% of those hit linked the scam to this vector (Sophos / Estadão) | High |
| Malicious email | Brazil 1st in the global ranking; 37% of cases | High |
| Technical flaw | Drop from 44% to 24% | Medium |
| Continuity / backup | 85% restored from a copy; maturity (isolation, test, RTO) not measured | Undetermined |

## What to do this week

1. Map service accounts and backup credentials outside the same production directory — owner: identity / IAM.
2. Run an end-to-end restore test with a recorded RTO — owner: continuity.
3. Signal it worked: the team can say, without opening a ticket, which credential opens the backup and whether it survives an AD compromise.
