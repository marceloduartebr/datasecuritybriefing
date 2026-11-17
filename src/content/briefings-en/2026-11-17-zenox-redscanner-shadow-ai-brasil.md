---
title: "RedScanner used AI agents as its workforce in Brazil"
description: "ZenoX documented the Open Ledger operation, which compromised at least 40 institutions and took 1.57 million card records."
pubDate: 2026-11-17T16:06:00-03:00
sourceName: "Estadão / TecMundo"
sourceUrl: "https://www.estadao.com.br/tecmundo/ciberseguranca/open-ledger-operacao-criminosa-atinge-mais-de-40-instituicoes-financeiras-no-brasil/"
cover: "https://covers.duarte.top/covers/20261116-zenox-redscanner-shadow-ai-brasil.jpg"
tipo: noticia
tags: ["shadow-ai", "dspm", "brasil", "incidente"]
pais: br
---

In one line: a commercial AI agent with its own budget became the workforce that extracted payment data and CPF numbers.

## What happened

A ZenoX report published on November 4, 2026 describes the RedScanner group's Open Ledger operation. Five human operators used commercial AI agents as their primary workforce against at least 40 financial institutions and public agencies in Brazil. The discovery came from a server with an open directory listing. 7,213 files were recovered. At one victim, 1,575,270 card records with CVV; at others, 580,000 CPF numbers and about 1.34 million financial records.

## Why it matters

An inventory of non-human identities does not capture the agent that already has an active session and its own budget. A written shadow AI policy produces no evidence of what the inference provider processed.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| AI agent as workforce | ZenoX report + 7,213 files | High |
| Extraction of PCI data and CPF | Specific figures in the report | High |
| The group's own exposed server | How the operation was found | Medium |

## What to do this week

1. Map the AI agents and inference providers with sessions in production systems — owner: identity.
2. Review access logs of non-human identities for the last 30 days — owner: SOC.
3. Confirm whether payment data and CPF show recent access by automated accounts — owner: DPO / security.
