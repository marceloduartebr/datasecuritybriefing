---
title: "Identidade e IA: Entra, Copilot Studio, LiteLLM e n8n"
description: "KEV set/2026: Entra CVE-2026-62916, Copilot Studio CVE-2026-80098, LiteLLM CVE-2026-59822, n8n CVE-2026-85165 — identidade e automação."
pubDate: 2026-09-16T10:22:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-identidade-ia.jpg"
tipo: vulnerabilidades
tags: ["kev", "entra", "copilot", "litellm", "n8n", "identidade", "ia"]
notionUrl: "https://www.notion.so/3dd17411747381e8ad03fde557d7eed6"
---

Em uma linha: IdP cloud, studio de agentes e orquestradores de IA/automação entram no KEV.

## O que aconteceu

No KEV de setembro/2026: CVE-2026-62916 (Microsoft Entra), CVE-2026-80098 (Copilot Studio), CVE-2026-59822 (LiteLLM) e CVE-2026-85165 (n8n), com exploração conhecida segundo a CISA.

## Por que importa

Entra é a raiz de sessão. Copilot Studio e LiteLLM concentram chave de modelo e conector. n8n self-hosted no BR muitas vezes roda com webhook público e secret em plain text — exploração KEV vira automação maliciosa com credencial corporativa.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Microsoft Entra | CVE-2026-62916, KEV | Crítica |
| Copilot Studio | CVE-2026-80098, KEV | Alta |
| LiteLLM | CVE-2026-59822, KEV | Alta |
| n8n | CVE-2026-85165, KEV | Alta |

## O que fazer nesta semana

1. Confirmar aplicação do advisory Entra/Copilot no tenant — dono: identidade.
2. Inventariar LiteLLM e n8n (versão, exposição, secrets) — dono: plataforma / automação.
3. Sinal de que funcionou: nenhum orquestrador de IA/automação fica sem versão e restrição de rede documentadas.
