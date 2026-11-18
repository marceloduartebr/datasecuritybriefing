---
title: "Belo Horizonte confirms attack on its payment slip system and orders two days of bills reissued"
description: "Slips issued between November 14 and 16 should not be paid; the city sent banks the list of affected documents."
pubDate: 2026-11-17T21:42:00-03:00
sourceName: "CNN Brasil"
sourceUrl: "https://www.cnnbrasil.com.br/nacional/sudeste/mg/prefeitura-de-bh-confirma-ataque-cibernetico-a-sistema-de-emissao-de-guias/"
cover: "https://covers.duarte.top/covers/stg-20261117-prefeitura-de-belo-horizonte-ataque-2034.jpg"
tipo: incidente
tags: ["ataque-cibernetico", "setor-publico", "pix", "integridade", "brasil"]
pais: br
---

**In one line:** when an attack hits the integrity of billing documents, the response depends on knowing exactly which records left the system during the incident window.

## What happened
On November 16, 2026, the City of Belo Horizonte confirmed that its municipal payment slip issuing system was the target of a cyberattack. Slips generated between early Saturday (14th) and Monday morning (16th) should not be paid; taxpayers must issue a new slip through the Services Portal or the BH SIM app. Due dates were extended to Thursday (19th). According to the city, payments by barcode and direct debit were not affected. Anyone who paid via Pix should check whether the payee is the Municipality of Belo Horizonte and, if not, contact their bank and request the Special Refund Mechanism (MED). The police were notified and financial institutions received the list of affected slips. The service has been restored. The city did not disclose how many slips or taxpayers were affected.

## Why it matters
Tax payment slips carry the taxpayer's name, ID number and payment data, and they circulate outside the system that generated them. An attack on the integrity of that flow turns a trusted public service into a fraud vector, and the effect lasts after the system is back online.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Compromise of the slip issuing system | Confirmed by the city on 11/16 | High |
| Pix payment to the wrong payee | City advises checking the payee and using MED | High |
| Number of affected taxpayers | Not disclosed | Undetermined |

## What to do this week
1. Map every system that generates billing documents (boleto, Pix, invoice) and confirm each issuance is logged with time, recipient and payment data — owner: data architecture.
2. Define the procedure to produce, within hours, the list of documents issued during an incident window and send it to banks and customers — owner: incident response with legal.
3. Sign that it worked: a tabletop exercise in which the list for a 48-hour window comes out complete in less than a day.
