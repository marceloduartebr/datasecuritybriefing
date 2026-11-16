---
title: "Garante fines Wind Tre €1.7 million for security failures"
description: "Over 365 thousand customers affected; 41 thousand with payment data. Failures in certificates, APIs and social engineering in stores."
pubDate: 2026-11-16T18:18:00-03:00
sourceName: "European Data Protection Board"
sourceUrl: "https://www.edpb.europa.eu/news/italian-dpa-fines-wind-tre-eur-17-million-for-data-security-failures-affecting-over-365-000_en"
cover: "https://covers.duarte.top/covers/20261112-garante-multa-wind-tre-17m-365k.jpg"
tipo: noticia
tags: ["gdpr", "multa", "italia", "seguranca", "certificados"]
pais: eu
notionUrl: "https://www.notion.so/41617411747381448b25f9754b66640c"
---

**In one line:** Italian Garante fines Wind Tre €1.7 million for security failures that exposed data of more than 365 thousand customers, including payment data.

## What happened

The EDPB published on 10 November 2026 the Garante (Italian DPA) decision of 14 May 2026. Wind Tre was fined €1,715,600 for violations of Articles 5(1)(f) and 32 GDPR. More than 365 thousand customers were affected; for 41,359 the incident included payment method data. The authority identified inadequate management of digital certificates and keys, weak API controls and unauthorized access via social engineering at points of sale.

## Why it matters

The gap between documented policy and effective control of certificates and physical access in retail is what turns a technical incident into a sanction.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Certificate and key management | Garante decision, >365k affected | High |
| Social engineering in stores | Unauthorized access confirmed | Medium |
| APIs with weak controls | Data extraction | Medium |

## What to do this week

1. Audit storage and rotation of certificates and private keys — identity team.
2. Review access controls on retail-exposed APIs — application team.
3. Train and monitor social engineering attempts at physical points — fraud team.
