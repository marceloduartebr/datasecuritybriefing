---
title: "About 40 Irish credit unions affected by a breach at provider Wellington IT"
description: "Minister Robert Troy confirmed that provider Wellington IT delayed notice of an October incident that exposed payee data at about 40 credit unions."
pubDate: 2026-11-20T08:50:00-03:00
sourceName: "RTÉ"
sourceUrl: "https://www.rte.ie/news/2026/1118/1599690-credit-union-data-breach"
cover: "https://covers.duarte.top/covers/20261118-wellington-it-credit-unions-1759.jpg"
tipo: incidente
tags: ["irlanda", "terceiros", "credit-union", "vazamento"]
pais: eu
---

In one line: the attack was in October, many credit unions were only told now, and the data exposed is who members pay.

## What happened

On November 18, 2026 RTÉ reported that Minister of State Robert Troy confirmed Wellington IT, a provider based in Northern Ireland, as the third party involved in a security incident that hit about 40 credit unions, roughly a quarter of the institutions in the country. The minister said the incident happened in October and that many credit unions were only informed recently, which he called unacceptable; he asked to meet the company to explain the delay. According to RTÉ, Wellington IT processes member account data, and the unauthorized access reached information on saved payees: names, IBAN, BIC, account numbers, sort codes, addresses and payment references. The impact concerns those who use the online service. The minister said that, so far, there has been no financial loss for the credit unions or their members. The Irish League of Credit Unions, which represents 148 of the roughly 172 institutions, said it understands the vulnerability has been closed and that accounts and balances were not compromised. Ireland's Data Protection Commission told RTÉ it has received “numerous” breach notifications and is assessing the case as a priority. The report also mentions a potential impact on hundreds of thousands of members.

## Why it matters

The delay between the incident and the notice to the credit unions is the window in which members were not warned, while payee data was already with a breached third party. Without a record-by-record map, no one yet knows the exact scope.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Incident at an IT provider with access to payment data | Minister Troy's confirmation to RTÉ, 11/18 | High |
| Exposure of IBAN, BIC and payee data | RTÉ report and credit union communications | High |
| Delay in notifying the institutions | Minister's statement that the delay is not acceptable | High |

## What to do this week

1. List the providers that process payee data, IBAN and payment history, with the date of their last incident notice (owner: DPO / vendor management).
2. Require evidence from logs that shows which records were read, not just confirmation that the flaw was closed (owner: CISO).
3. Prepare a customer notice on the risk of social engineering using payee data, without assuming that “balance intact” closes the case (owner: customer service / compliance).
