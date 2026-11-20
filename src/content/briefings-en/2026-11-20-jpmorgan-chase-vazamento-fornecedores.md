---
title: "Chase, Visa and Mastercard confirm customer data leak through suppliers"
description: "Marketing data held by third parties exposed customers of three financial giants, and none of them said which suppliers were hit."
pubDate: 2026-11-20T12:51:00-03:00
sourceName: "The Register"
sourceUrl: "https://theregister.com/security/2026/11/19/chase-visa-mastercard-confirm-third-party-cyberattacks-that-may-have-exposed-customers-info/5311175"
cover: "https://covers.duarte.top/covers/20261120-jpmorgan-chase-vazamento-fornecedores-0813.jpg"
tipo: incidente
tags: ["vazamento", "terceiros", "servicos-financeiros", "estados-unidos"]
pais: us
---

**In one line:** the most exposed customer data is not always in the core system; it is in the copy marketing handed to a supplier.

## What happened
On November 19, 2026, JPMorgan Chase, Visa and Mastercard confirmed they are investigating incidents at third-party providers that may involve customer information. The extortion group n0n had listed the three companies on its leak site on November 16. Chase said the attackers accessed marketing data held by suppliers, which may include customer names and email addresses, and that the case is unrelated to the week's outages. Visa attributed the incident to a provider in Asia-Pacific and said no payment data, such as card numbers, was affected. Mastercard spoke of a limited number of email addresses from a subset of cardholders enrolled in a benefits program. According to a Reuters analysis, the files linked to the bank contain more than 16,000 customer email addresses, some with phone numbers and ZIP codes. None of the companies named the suppliers, said when the access took place or detailed what was taken.

## Why it matters
Marketing databases leave the perimeter often: agencies, campaign platforms and engagement tools receive copies of customer data with weaker controls than those of the main system. Names, email addresses and campaign history of high-income customers are raw material for targeted phishing. And without knowing which fields were with which supplier, the company cannot size the impact or notify accurately.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Marketing supplier with a copy of the customer base | Confirmation by Chase, Visa and Mastercard | High |
| Targeted phishing against exposed customers | Emails, phone numbers and campaign data in the published files | Medium |
| Unknown scope (suppliers and dates not disclosed) | None of the companies gave details | Medium |

## What to do this week
1. List every marketing and engagement supplier that receives customer data and the fields sent to each one — owner: privacy/DPO with marketing.
2. Review those suppliers' contracts and access: retention, copies, deletion at the end of the campaign and notification duties — owner: procurement and security.
3. Sign that it worked: for any supplier on the list, the company can say within hours which customers and which fields it holds.
