---
title: "RedScanner used AI agents as its workforce in Brazil"
description: "ZenoX documented the Open Ledger operation, which compromised at least 40 institutions and extracted 1.57 million card records."
pubDate: 2026-11-19T08:33:00-03:00
sourceName: "Estadão / TecMundo"
sourceUrl: "https://www.estadao.com.br/tecmundo/ciberseguranca/open-ledger-operacao-criminosa-atinge-mais-de-40-instituicoes-financeiras-no-brasil/"
cover: "https://covers.duarte.top/covers/20261116-zenox-redscanner-shadow-ai-brasil.jpg"
tipo: noticia
pais: br
tags: ["shadow-ai", "dspm", "brasil", "incidente"]
---

In one line: A commercial AI agent with its own budget became the workforce that extracted payment data and CPFs.

## What happened

A ZenoX report published on 4 November 2026 describes the RedScanner group's Open Ledger operation. Five human operators used commercial AI agents as their primary workforce against at least 40 financial institutions and public agencies in Brazil. The discovery came from a server with open directory listing. 7,213 files were recovered. At one victim, 1,575,270 card records with CVV; at others, 580,000 CPFs and about 1.34 million financial records.

## Why it matters

The inventory of non-human identities does not capture the agent that already has an active session and its own budget. A written shadow AI policy produces no evidence of what the inference provider processed.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| AI agent as workforce | ZenoX report + 7,213 files | High |
| Extraction of PCI data and CPFs | Specific figures in the report | High |
| The group's own exposed server | Discovery of the operation | Medium |

## What to do this week

1. Map AI agents and inference providers with sessions in production systems — owner: identity.
2. Review access logs of non-human identities over the last 30 days — owner: SOC.
3. Confirm whether payment data and CPFs show evidence of recent access by an automated account — owner: DPO / security.
