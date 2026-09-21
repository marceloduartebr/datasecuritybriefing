---
title: "BREEZE COMET runs Pix, STR and boleto from inside Brazilian firms"
description: "GTIG and Mandiant describe a financial actor that enters banks, processors and fintechs in Brazil to issue payment-rail orders — not to steal the customer file."
pubDate: 2026-09-02T10:12:00-03:00
sourceName: "Google Cloud / GTIG / Mandiant"
sourceUrl: "https://cloud.google.com/blog/topics/threat-intelligence/financially-motivated-threat-actor-breeze-comet-targets-brazil/"
cover: "https://covers.duarte.top/covers/20260901-breeze-comet-pix.jpg"
tipo: incidente
tags: ["fraude", "pix", "brasil", "identidade", "dspm"]
notionUrl: "https://www.notion.so/3ce17411747381db8b17d6e852ed4972"
---

In one line: the target is not the customer’s PII; it is the identity that can sign a Pix, an STR or a remittance.

## What happened

On Tuesday (1 Sep 2026), Google Threat Intelligence Group and Mandiant described BREEZE COMET — a financially motivated actor that, since 2024, has compromised banks, processors, retail and fintechs in Brazil to operate the payment rail from inside.

The cut is not the account-holder file. It is organisations with permission to transact: Pix, STR and boleto. In at least one case the group reached the National Financial System Network and, within 24 to 48 hours, fired two waves with hundreds of fraudulent orders. Google confirms at least one hit in the tens of thousands of dollars.

The public path rarely starts with malware. It starts with social engineering (a call posing as IT support), a compromised site serving an installer, or remote access “to resolve a ticket”. Only then comes the group’s own kit and a directory search for remittance terms, CNAB and Pix webhooks. A language model speeds up the script; it does not invent the scam.

## Why it matters

Whoever maps only personal data and forgets certificates, service accounts and remittance queues discovers the incident on the statement. The asset that left was not in the PII inventory. It was in the identity with power to issue an order.

An account-holder inventory does not replace an inventory of who — human or machine — can sign a transfer.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Initial access via social engineering / remote | Described by GTIG/Mandiant | High |
| Pix/STR/boleto issued from an internal identity | Confirmed in at least one case (RNSF, two waves) | High |
| LLM used in the scam script | Cited as an accelerator, not as the origin | Medium |

## What to do this week

1. List identities (human and service) with permission to issue Pix, STR or CNAB remittance — owner: treasury + IAM.
2. Flag orphan, shared or ownerless accounts on that list and suspend until need is evidenced — owner: IAM.
3. Signal it worked: any unusual order on the rail points to a named identity, not to “the payment system”.
