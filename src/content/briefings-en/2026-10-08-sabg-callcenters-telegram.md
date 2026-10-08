---
title: "SABG investigates offer of 12.9 million call-center records"
description: "A 22 September Telegram post offered call-center bases; a 13,000-line sample names banks and retailers. A brand in the file is not proof of a breach."
pubDate: 2026-10-08T10:16:00-03:00
sourceName: "SABG"
sourceUrl: "https://www.gob.mx/buengobierno/prensa/buen-gobierno-investiga-presunta-venta-de-mas-de-12-9-millones-de-registros-con-datos-personales"
cover: "https://covers.duarte.top/covers/20260930-sabg-callcenters-telegram.jpg"
tipo: incidente
tags: ["vazamento", "mexico", "terceiros", "call-center"]
pais: mx
notionUrl: "https://www.notion.so/3eb17411747381e6b600eeabf8dec4b4"
---

In one line: SABG found a Telegram offer of 12.9 million records attributed to call centers and opened an investigation without confirming a breach at the named brands.

## What happened

Communiqué 113, 24 September 2026. A 22 September Telegram post offered call-center bases with name, contact, date of birth, RFC, address and bank data. Sample: 13,000 records across 13 bases. Commercial names in the sample include Amazon, Amex, Afirme, Banamex, BanBajío, BBVA, Banorte, Banregio, HSBC, Inbursa, INVEX, Liverpool, Sam’s Club, Santander, Scotiabank, Sears, Suburbia, Banco Walmart, Credomatic, IXE, Sanborns, C&A and Soriana. Distinct from the Aeroméxico case (15 million, 18 September).

## Why it matters

The phone-service chain copies the customer record. Without evidence of origin, the investigation lands on the processor — and the controller still has to map what that third party could export.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Offer on messaging | SABG communiqué | High |
| Bank data + RFC | Description of the offer | High |
| Attribution to brands | Not confirmed by the authority | Undetermined |

## What to do this week

1. Ask the contact-center processor for the 1–22 September export log — owner: DPO + procurement.
2. Match any public sample, when one exists, against hashes of internal bases — owner: security.
3. Signal: the list of processors with access to RFC or bank data is updated.
