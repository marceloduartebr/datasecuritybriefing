---
title: "CyberCartel uses AI to coordinate attacks on financial targets in LATAM"
description: "Straiker describes the CARLIY0S system and inventory with fintech credentials and CLABE numbers linked to SPEI."
pubDate: 2026-11-03T10:14:00-03:00
sourceName: "El Economista"
sourceUrl: "https://www.eleconomista.com.mx/tecnologia/cybercartel-utilizo-ia-atacar-400-objetivos-financieros-america-latina-20261026-840515.html"
cover: "https://covers.duarte.top/covers/20261027-cybercartel-ia-financeiro-latam.jpg"
tipo: incidente
tags: ["cybercartel", "ia", "spei", "fraude", "mexico"]
notionUrl: "https://www.notion.so/4061741174738186b932db5b3c958311"
---

In one line: Group uses AI model orchestration and already held credentials and keys that could facilitate SPEI operations.

## What happened

Straiker documented CyberCartel and the CARLIY0S system, built on an open framework, which coordinated attacks on more than 400 financial targets in Latin America. A September 24 inventory contained 2,911 emails, 903 CLABE numbers and 43 credentials from a fintech. There is no confirmation of successful intrusion on all targets nor direct attribution to the eight incidents reported to Banxico/CNBV in the first half of 2026.

## Why it matters

Application credentials and transfer account numbers reduce response time. Governance needs to see non-human identities and the payment flow, not just the malware.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Fintech credentials / CLABE | Straiker inventory | High |
| AI model orchestration | CARLIY0S documented | High |
| Confirmed intrusions | Not quantified | Indeterminate |

## What to do this week

1. Inventory application keys and CLABE accounts with transfer access — payments owner.
2. Review monitoring of non-human identities and SPEI abuse signals — SOC owner.
3. Correlate with recent threat reports without assuming automatic attribution.