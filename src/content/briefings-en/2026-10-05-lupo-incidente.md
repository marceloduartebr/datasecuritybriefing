---
title: "Lupo confirms unauthorized access to CPF and order data"
description: "The 2 October notice lists CPF, address and invoice data, reports the incident to ANPD, and does not state how many data subjects were reached."
pubDate: 2026-10-05T10:17:00-03:00
sourceName: "Lupo S.A."
sourceUrl: "https://www.lsport.com.br/pages/comunicado-de-incidente-de-seguranca"
cover: "https://covers.duarte.top/covers/20261005-lupo-incidente.jpg"
tags: ["lgpd", "incidente", "varejo", "brasil"]
tipo: incidente
pais: br
notionUrl: "https://www.notion.so/3f017411747381b2aefeef6b028b02ba"
---

In one line: Lupo confirmed unauthorized access to CPF and order data and notified ANPD, without publishing the number of data subjects.

## What happened

On 2 October 2026 Lupo S.A. published a notice (page updated the same day). The company says that on 23 September it confirmed unauthorized access. Categories possibly reached are name and CPF, full address, email, phone and purchase data (order number, delivery location, amount, date and invoice data). It reported a formal notice to ANPD, system isolation, credential revocation and mandatory MFA. The text does not state how many data subjects were affected.

## Why it matters

The notice lists categories, not a record-by-record map. Without that cut, the notice to the data subject stays generic and a scam that cites a real order becomes more credible. Later MFA does not show what already left.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Confidentiality of CPF and order | Company notice, 02/10/2026 | High |
| Volume of data subjects | Not published | Undetermined |
| Misuse | Company warns of scams; does not confirm misuse | Undetermined |
| Notice to ANPD | Stated in the notice | Medium |

## What to do this week

1. Inventory order systems that store CPF together with the invoice — e-commerce and privacy owner.
2. Check whether the access log can cut by data subject, not only by category — security owner.
3. Signal: the incident channel can say how many CPFs one access read, without waiting for the public notice.
