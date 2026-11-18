---
title: "Banco do Brasil notifies customers after unauthorized access with a valid credential"
description: "BB identified on 12 November the misuse of a valid credential and warned customers about exposure of name, CPF, email, branch and, in some cases, account number."
pubDate: 2026-11-18T18:10:00-03:00
sourceName: "g1"
sourceUrl: "https://g1.globo.com/tecnologia/noticia/2026/11/18/banco-do-brasil-dados.ghtml"
cover: "https://covers.duarte.top/covers/20261118-bb-credencial-valida-1759.jpg"
tipo: incidente
pais: br
tags: ["banco-do-brasil", "credencial-valida", "lgpd", "vazamento"]
---

In one line: the bank says its systems were not breached, but a valid credential was enough to reach customer registration data.

## What happened

On 18 November 2026, Banco do Brasil said, in a notice to customers and a press statement, that on 12 November it identified unauthorized access to personal data. According to g1 and Valor Econômico, the exposed data may include name, CPF (Brazilian taxpayer ID), email address, branch number and, in some cases, account number. The bank said there was no intrusion into its systems, no exposure of passwords, tokens or security codes, and that no financial transactions resulting from the incident were identified. The investigation, according to the notice, points to misuse by third parties of a valid credential, which has since been revoked. Valor noted that the bank does not disclose the number of affected users and that the notice went to part of its customer base. The bank said it activated security protocols and the notifications required by the LGPD, and named scams, phishing and social engineering as the main risk.

## Why it matters

The line “there was no intrusion” describes the perimeter, not the reach of the data. A valid credential does not trigger the intrusion alarm and still reads customer records. Without a public count of those affected, the notice exists, but the inventory of what was read stays internal.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Misuse of a valid credential | BB notice cited by g1 and Valor | High |
| Exposure of CPF, email, branch and, in some cases, account | Notice to customers, 18 Nov | High |
| Number of affected not disclosed | Valor Econômico, 18 Nov | Medium |

## What to do this week

1. Review which employee, partner and system credentials read customer records and revoke those without a current owner and need (owner: CISO).
2. Check whether there is a record of the volume and type of data each credential accessed between detection and revocation (owner: data security team).
3. Prepare clear guidance for customers on phishing, with an official reporting channel, never asking for a password or code (owner: DPO / customer service).
