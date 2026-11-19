---
title: "Belo Horizonte city hall confirms attack on its tax slip system and asks residents to reissue payment slips"
description: "Two days of tax payment slips under suspicion; the city sent banks the list of affected documents but still does not say how many there are."
pubDate: 2026-11-19T08:33:00-03:00
sourceName: "Diário do Comércio"
sourceUrl: "https://diariodocomercio.com.br/economia/pbh-ataque-hacker/"
cover: "https://covers.duarte.top/covers/20261119-prefeitura-belo-horizonte-ataque-0803.jpg"
tipo: incidente
pais: br
tags: ["ataque-cibernetico", "setor-publico", "pix", "brasil"]
---

**In one line:** when the attacker tampers with the billing document, the question stops being "did it leak?" and becomes "which records went out altered, and to whom?".

## What happened
On 16 November 2026, the Belo Horizonte city hall confirmed that its system for issuing tax payment slips suffered a cyberattack, after initially reporting only a malfunction. Slips issued between early Saturday (14th) and Monday morning (16th) must not be paid and have to be reissued through the Services Portal or the BH SIM app. Pix payments may have been affected: if the recipient is not the Municipality, taxpayers should contact their bank and request the Special Refund Mechanism (MED). Barcode payments and direct debit were not affected. The city called the police, sent financial institutions the list of affected slips and extended the due date to 19 November. The system has been restored.

## Why it matters
The attack hit the integrity of an official billing document, not just the confidentiality of data. The response was only possible because the city could bound the time window and identify the slips issued within it. There is still no count of affected slips and no information on exposure of personal data.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Tampered slips with Pix | City guidance on a different recipient and MED | High |
| Exposure of taxpayer data | Not reported so far | To be confirmed |
| Initial communication as a "malfunction" | Attack confirmed the same day | Medium |

## What to do this week
1. Map which systems generate payment documents for customers and which personal data go into them — owner: data architecture.
2. Ensure an audit trail that can list, by time window, every document issued and its recipient — owner: security and IT.
3. Sign it worked: in an exercise, the team produces in under an hour the list of records issued in a 48-hour window.
