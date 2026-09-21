---
title: "VoIP BR: Issabel JWT e Sangoma Switchvox no KEV"
description: "KEV set/2026: Issabel CVE-2026-89026 (JWT hardcoded) e Sangoma Switchvox CVE-2026-9586 — ângulo VoIP Brasil."
pubDate: 2026-09-21T10:54:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-voip.jpg"
tipo: vulnerabilidades
tags: ["kev", "issabel", "sangoma", "voip", "brasil", "jwt"]
notionUrl: "https://www.notion.so/3dd174117473814a9e3efc17a3cc4fe4"
---

Em uma linha: PBX Issabel com JWT hardcoded e Switchvox entram no KEV — VoIP ainda é superfície crítica no BR.

## O que aconteceu

No KEV de setembro/2026: CVE-2026-89026 (Issabel — JWT hardcoded) e CVE-2026-9586 (Sangoma Switchvox), ambas com exploração conhecida segundo a CISA.

## Por que importa

Issabel (fork Asterisk/Elastix) é comum em PMEs e call centers brasileiros. JWT hardcoded significa sessão forjável sem credencial do usuário. Switchvox concentra tronco SIP e gravação — compromisso vira fraude de toll e vazamento de áudio (dado pessoal sob LGPD).

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Issabel JWT hardcoded | CVE-2026-89026, KEV | Crítica |
| Sangoma Switchvox | CVE-2026-9586, KEV | Alta |
| Exposição SIP/admin | Inventário fraco fora do DC | Alta |

## O que fazer nesta semana

1. Listar PBX Issabel/Switchvox (versão, exposição admin/SIP) — dono: telecom / rede.
2. Aplicar patch vendor e rotacionar segredos/JWT — dono: operações.
3. Sinal de que funcionou: nenhum PBX KEV fica sem evidência de correção e admin fora da internet aberta.