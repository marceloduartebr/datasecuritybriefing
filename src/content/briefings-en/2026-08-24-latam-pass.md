---
title: "LATAM Pass: 21 days between detecting the breach and speaking in public"
description: "LATAM identified the loyalty-program incident on 29 Jul and only disclosed it on 19 Aug. Names, addresses and partial card data for part of the 54 million members."
pubDate: 2026-08-24T12:00:00-03:00
sourceName: "Rio Times"
cover: "https://covers.duarte.top/covers/20260824-latam-pass.jpg"
sourceUrl: "https://www.riotimesonline.com/latam-data-breach-exposed-names-addresses-and-card-details/"
tags: ["vazamento", "lgpd", "anpd", "latam"]
notionUrl: "https://www.notion.so/3c7174117473819fa228f6028da8a7e8"
---

**In one line:** the interval that matters is not the leak — it is the time until you know what left.

## What happened

LATAM internally identified the LATAM Pass data leak on 29 July and disclosed the incident on 19 August: 21 days. Names, addresses and partial card data of a subset of the program’s 54 million members were exposed. ANPD was notified. Financial data sit among the authority’s enforcement priorities for 2026-2027.

## Why it matters

Without a data map — what, where, who can access — incident response becomes a blind sprint. Governance does not prevent 100% of incidents; it shortens the time between “something happened” and “we know exactly what happened”.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| PII + partial card data | Statement / coverage | High |
| 21-day delay in disclosure | Dates 29 Jul and 19 Aug | High |
| ANPD attention | Reported notification | Medium |

## What to do this week

1. Measure your own detect → inventory → disclose interval — owner: DPO + SecOps.
2. Split financial data and registry data in the runbook, with a named owner.
3. Signal it worked: answer in minutes which loyalty-program bases exist and who reads them.
