---
title: "Ticketmaster notifies Brazilian customers of exposure via third-party tool"
description: "Company confirms exposure of CPF and 2025 purchase data; investigation completed in September; notification on October 14."
pubDate: 2026-10-15T10:15:00-03:00
sourceName: "Canaltech"
sourceUrl: "https://canaltech.com.br/seguranca/vazamento-expoe-dados-de-contas-da-ticketmaster-no-brasil/"
cover: "https://covers.duarte.top/covers/20261015-ticketmaster-incidente.jpg"
tipo: incidente
tags: ["vazamento", "terceiro", "brasil", "lgpd"]
pais: br
notionUrl: "https://www.notion.so/3fa17411747381e185c8fed4221d7a21"
---

**In one line:** Ticketmaster exposed CPF and purchase data of 2025 customers due to a flaw in a third-party analytics tool.

## What happened

On October 14, 2026, Ticketmaster Brasil notified affected customers. The origin was a temporary vulnerability in a third-party data analytics tool. Exposed data for those who purchased in 2025 include name, CPF, phone, email, address, and purchase details with the last four digits of the card. Passwords and full card numbers were not. Investigation with external specialists completed in September. Sales system not affected.

## Why it matters

A third party with a copy of operational data creates a surface that the primary system's controls do not cover. The time between access and the inventory of what was reached defines the quality of the notification.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Third-party tool | Confirmed by the company | High |
| CPF and purchase history | Listed in the notice | High |
| Sales system | Not affected | Low |

## What to do this week

1. Map analytics/marketing tools that receive CPF or order data — DPO/Security.
2. Require evidence of isolation and retention — Legal/Vendors.
3. Confirm that notification to data subjects is documented — Compliance.
