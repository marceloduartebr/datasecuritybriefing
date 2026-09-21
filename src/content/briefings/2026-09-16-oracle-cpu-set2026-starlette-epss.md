---
title: "Oracle CPU 15/09 e o aviso Starlette: CVSS ≠ risco"
description: "Oracle Critical Patch Update 15/09 (OAM/WebLogic/Hyperion) e Starlette CVE-2026-48710 CVSS 6.5 com EPSS 0,36 — CVSS não é prioridade."
pubDate: 2026-09-16T10:21:00-03:00
sourceName: "Oracle CPU / FIRST EPSS"
sourceUrl: "https://www.oracle.com/security-alerts/"
cover: "https://covers.duarte.top/covers/20260916-vuln-patch.jpg"
pais: us
tipo: vulnerabilidades
tags: ["oracle", "cpu", "starlette", "epss", "cvss", "priorizacao"]
notionUrl: "https://www.notion.so/3dd17411747381f98cd5f5c14dc0f4a9"
---

Em uma linha: CPU Oracle de 15/09 exige ciclo de patch; Starlette CVE-2026-48710 mostra EPSS alto com CVSS "só" 6.5.

## O que aconteceu

Em 15/09/2026 a Oracle publicou o Critical Patch Update cobrindo, entre outros, Oracle Access Manager, WebLogic e Hyperion. Em paralelo, CVE-2026-48710 (Starlette) aparece com CVSS 6.5 e EPSS ~0,36 (leitura 15/09) — probabilidade de exploração elevada para um score "médio".

## Por que importa

Times que ordenam só por CVSS ≥ 9 atrasam o que o EPSS e o KEV já sinalizam. WebLogic/OAM no BR ainda sustentam ERP e identidade. Starlette sob frameworks FastAPI amplia a lição para o stack Python moderno.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Oracle CPU 15/09 (OAM/WebLogic/Hyperion) | Boletim Critical Patch Update | Alta (contexto) |
| Starlette CVE-2026-48710 | CVSS 6.5, EPSS ~0,36 em 15/09 | Alta (probabilidade) |
| Priorização só por CVSS | Viés operacional conhecido | Processo |

## O que fazer nesta semana

1. Abrir mudança para CPU Oracle 15/09 nos produtos em produção — dono: plataforma.
2. Incluir EPSS/KEV no critério de SLA de patch (não só CVSS) — dono: vuln mgmt.
3. Sinal de que funcionou: backlog mostra CVE-2026-48710 priorizada apesar do 6.5, e CPU Oracle com janela marcada.
