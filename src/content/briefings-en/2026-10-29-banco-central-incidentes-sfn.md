---
title: "Central Bank records 99 cyber incidents in the SFN through September"
description: "99 cases through September, 73% fraud; third parties, certificates and APIs at the center of the events."
pubDate: 2026-10-29T10:21:00-03:00
sourceName: "Banco Central"
sourceUrl: "https://www.bcb.gov.br/content/publicacoes/ref/202610/RELESTAB202610-refPub.pdf"
cover: "https://covers.duarte.top/covers/20261029-banco-central-incidentes-sfn.jpg"
tipo: noticia
tags: ["ciberseguranca", "sistema-financeiro", "brasil", "terceiros"]
pais: br
notionUrl: "https://www.notion.so/40817411747381c89bc3ce6cac4333da"
---

**In one line:** The SFN has already surpassed the 2025 total in cyber incidents, with fraud dominating and third-party controls still incomplete.

## What happened

The Central Bank's Financial Stability Report, released on 27 October 2026, records 99 cyber incidents reported through September, versus 76 for all of 2025. Fraud accounts for 73% of the cases. Criminals used access to suppliers, digital certificates not deactivated after a connection change, passwords of privileged accounts and APIs to generate transactions that looked legitimate. In a survey of 1,365 institutions, only 42% periodically assess the risk of each supplier.

## Why it matters

Residual third-party access and a valid credential remain more effective than a zero-day exploit. The third-party management policy exists; evidence of revocation and of API control is what is missing in most environments.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Third party / residual certificate | Keys obtained from a supplier; certificate not revoked | High |
| Privileged credential | Employee and contractor passwords via phishing | High |
| API without authorization | Transfer orders outside the normal flow | High |
| Supplier assessment | 42% review risk periodically | Medium |

## What to do this week

1. Inventory certificates and access keys to payment systems and critical APIs — owner: operations / IAM.
2. Confirm that every supplier with privileged access has an up-to-date risk assessment and that credentials are revoked the same day the access changes — owner: third-party risk.
3. Sign that it worked: report of active certificates without justification of use and list of APIs without authorization control at zero or with a dated plan.
