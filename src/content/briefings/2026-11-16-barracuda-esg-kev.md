---
title: "Barracuda ESG e produtos relacionados entram no KEV com exploração confirmada"
description: "CISA adiciona CVE-2026-116606 e CVE-2026-111560 ao KEV em 10/11; Barracuda confirmou exploração em pequeno número de organizações."
pubDate: 2026-11-16T10:29:00-03:00
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/recently-patched-barracuda-vulnerabilities-exploited-in-attacks/"
cover: "https://covers.duarte.top/covers/20261111-barracuda-esg-kev.jpg"
tipo: vulnerabilidades
tags: ["vulnerabilidades", "perimetro", "kev", "barracuda"]
pais: us
notionUrl: "https://www.notion.so/415174117473816f8173ee395f41b214"
---

Em uma linha: Dois CVEs da Barracuda (bypass no ESG e command injection) entram no KEV com prazo federal de 3 dias e exploração já confirmada.

## O que aconteceu

CISA adicionou em 10/11/2026 os CVE-2026-116606 (auth bypass ESG, CVSS 9.3) e CVE-2026-111560 (command injection em ESG/ADC/WAF/etc., CVSS 8.6) ao KEV. Barracuda corrigiu em 2/11 e confirmou em 9/11 exploração em pequeno número de organizações. Encadeamento permite root se Admin UI alcançável.

## Por que importa

Superfície de administração exposta transforma patch em corrida. Prazo curto do BOD reflete evidência de exploração ativa, não apenas potencial.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Auth bypass ESG | KEV + confirmação Barracuda | Alta |
| Command injection | KEV + produtos múltiplos | Alta |
| Admin UI exposta | Requisito de exploração | Alta |

## O que fazer nesta semana

1. Inventariar appliances Barracuda (ESG, ADC, WAF, etc.) e confirmar patch BNSF-40425/40430 ou equivalente — dono: infraestrutura.
2. Restringir acesso à Admin UI a redes internas confiáveis — dono: rede.
3. Verificar logs de acesso à interface administrativa nos últimos 14 dias — dono: SOC.
