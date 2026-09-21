---
title: "Trezor and ShipMonk: contracted deletion, data still at the third party"
description: "Another 67 thousand US customers exposed at a 3PL that had confirmed in writing it had wiped the base."
pubDate: 2026-09-07T10:20:00-03:00
sourceName: "The Hacker News / Trezor"
sourceUrl: "https://thehackernews.com/2026/09/trezor-says-shipmonk-breach-exposed.html"
cover: "https://covers.duarte.top/covers/20260905-trezor-shipmonk.jpg"
tipo: incidente
tags: ["terceiros", "vazamento", "retencao", "lgpd"]
notionUrl: "https://www.notion.so/3d217411747381389197fc11639edb4a"
---

In one line: the contract and the deletion email do not replace evidence that the record left the logistics operator’s disk.

## What happened

On 5 September 2026 Trezor disclosed that logistics operator ShipMonk, after unauthorised access reported on 10 August, exposed data of another 67 thousand customers in the United States — name, email, phone, delivery address and order number, on orders from November 2019 to August 2021. The volume adds to the 13,689 already disclosed the month before. Trezor says it asked in writing for deletion throughout the relationship and received confirmation; the data remained in the third party’s systems. The hardware wallets were not compromised. The link to ShinyHunters is Holborn’s attribution, not a victim statement.

## Why it matters

The case is retention at a third party, not a cracked password. In Latin America the pattern repeats at 3PLs, CRMs and processors: a 90-day SLA on paper, an address base still queryable years later. Without a record-by-record inventory, the notice to ANPD and the data subject becomes a guess.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Retention past the deadline at the 3PL | Written deletion confirmation vs base still at ShipMonk | High |
| Delivery + contact data | Name, email, phone, address, 2019-2021 order | High |
| Actor attribution | Holborn cites ShinyHunters; Trezor does not confirm the group | Undetermined |

## What to do this week

1. List 3PLs, CRMs and processors with an expired deletion deadline — owner: privacy + procurement.
2. Demand technical evidence of deletion (log, hash, excerpt), not only a compliance email — owner: security.
3. Signal it worked: zero third-party bases with an order date older than the current SLA.
