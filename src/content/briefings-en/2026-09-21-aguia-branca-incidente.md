---
title: "Águia Branca: ticket-site incident reaches 7,883 data subjects"
description: "The company confirmed the incident on 6 Sep 2026, notified ANPD and the people affected, but did not list the data categories."
pubDate: 2026-09-21T10:53:00-03:00
sourceName: "Estadão / TecMundo"
sourceUrl: "https://www.estadao.com.br/tecmundo/ciberseguranca/viacao-aguia-branca-sofre-ataque-cibernetico-que-afetou-quase-8-mil-clientes/"
cover: "https://covers.duarte.top/covers/20260921-aguia-branca-incidente.jpg"
tipo: incidente
tags: ["vazamento", "lgpd", "anpd", "brasil", "transporte"]
notionUrl: "https://www.notion.so/3e2174117473815ab2a7cbdefe85f655"
---

In one line: Águia Branca admitted an incident in its ticket e-commerce, with 7,883 data subjects potentially reached and notice to ANPD, without saying which fields left.

## What happened

In a press note (A Gazeta on 16 Sep and Estadão/TecMundo on 18 Sep 2026), Viação Águia Branca confirmed a cybersecurity incident on the official ticket-sales sites, identified on 6 Sep 2026. The company says the app and Zap Passagens were not hit, that tickets already issued and travel data remain valid, and that 7,883 customers who bought on the website had data potentially compromised. Data subjects were notified individually; ANPD received the Security Incident Communication. The attack origin and the data categories were not disclosed in the public statement.

## Why it matters

Notifying the data subject and the authority is the rite in ANPD Resolution CD/ANPD No. 15/2024. Without a map of categories — identity, ID document, payment, itinerary — the notice does not guide useful vigilance and governance cannot prove what the web channel actually processed.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Ticket-sales websites | Confirmed by the company | High |
| App and Zap Passagens | Company says not hit | Undetermined |
| Data categories | Not described in the statement | Undetermined |
| Notice to ANPD and data subjects | Stated by the company | Medium |

## What to do this week

1. Inventory what the ticket e-commerce (or equivalent) stores — owner: DPO + security.
2. Rehearse the 72-hour cut: volume, categories, notice channel — owner: DPO.
3. Signal it worked: field list and legal basis ready for a CIS, without relying on a “limited subset”.
