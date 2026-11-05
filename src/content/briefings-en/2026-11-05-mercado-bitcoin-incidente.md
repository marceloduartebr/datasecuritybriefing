---
title: "Mercado Bitcoin loses US$ 40 million and rules out a data leak within hours"
description: "An attack on the exchange's hot wallets drained at least US$ 40 million; the denial of a leak came before the vector was disclosed."
pubDate: 2026-11-05T18:18:00-03:00
sourceName: "Bloomberg Línea"
sourceUrl: "https://www.bloomberglinea.com.br/crypto/mercado-bitcoin-sofre-ataque-hacker-de-us-40-mi-mas-descarta-perdas-para-clientes/"
cover: "https://covers.duarte.top/covers/20261104-mercado-bitcoin-incidente.jpg"
tipo: incidente
tags: ["criptoativos", "incidente", "lgpd", "brasil", "resposta-a-incidentes"]
pais: br
notionUrl: "https://www.notion.so/40e1741174738149b03ee21dcfbb59aa"
---

**In one line:** saying there was no leak is only evidence when the company knows which data were within reach of the attacker's credentials.

## What happened

In the early hours of November 2, 2026, Mercado Bitcoin identified a security incident in one of its systems. According to Bloomberg Línea, the target was the exchange's hot wallets; Hypernative estimated the outflow at at least US$ 40 million (about R$ 217 million). Deposits and withdrawals were suspended as a precaution. The exchange stated that it contained the incident, that it will absorb the loss without harm to customers, and that there was no data leak. The technical vector was not disclosed. The case occurred four days after the attack on Binance.

## Why it matters

Crypto exchanges concentrate high-value, hard-to-replace data: identity documents, verification selfies (KYC), bank details and transaction history. The denial of a leak was issued before the origin of the incident was explained publicly. Notification to the ANPD requires data categories and the number of data subjects, which presupposes a map between compromised systems, credentials and personal databases.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Compromise of hot wallets | Bloomberg Línea; Hypernative estimate | High |
| Exposure of KYC data | Denied by the company; vector not disclosed | To be confirmed |
| Operational disruption | Deposits and withdrawals suspended | Medium |

## What to do this week

1. Map which personal databases (KYC, biometrics, bank details) are reachable from the service accounts that operate wallets and settlement systems — owner: CISO with DPO.
2. Rehearse the "was there a leak?" response within a 24-hour window, using the actual inventory of data and accesses — owner: incident response team.
3. Signal that it worked: the company can list, for each compromised system in the drill, the data categories and the volume of data subjects within the attacker's reach.
