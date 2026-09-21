---
title: "Identidad e IA: Entra, Copilot Studio, LiteLLM y n8n"
description: "KEV sep/2026: Entra CVE-2026-62916, Copilot Studio CVE-2026-80098, LiteLLM CVE-2026-59822, n8n CVE-2026-85165 — identidad y automatización."
pubDate: 2026-09-16T10:22:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-identidade-ia.jpg"
tipo: vulnerabilidades
tags: ["kev", "entra", "copilot", "litellm", "n8n", "identidade", "ia"]
notionUrl: "https://www.notion.so/3dd17411747381e8ad03fde557d7eed6"
---

En una línea: el IdP en la nube, el studio de agentes y los orquestadores de IA/automatización entran al KEV.

## Qué ocurrió

En el KEV de septiembre/2026: CVE-2026-62916 (Microsoft Entra), CVE-2026-80098 (Copilot Studio), CVE-2026-59822 (LiteLLM) y CVE-2026-85165 (n8n), con explotación conocida según CISA.

## Por qué importa

Entra es la raíz de sesión. Copilot Studio y LiteLLM concentran clave de modelo y conector. n8n self-hosted en Brasil muchas veces corre con webhook público y secreto en texto plano — una explotación KEV se vuelve automatización maliciosa con credencial corporativa.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Microsoft Entra | CVE-2026-62916, KEV | Crítica |
| Copilot Studio | CVE-2026-80098, KEV | Alta |
| LiteLLM | CVE-2026-59822, KEV | Alta |
| n8n | CVE-2026-85165, KEV | Alta |

## Qué hacer esta semana

1. Confirmar la aplicación del advisory Entra/Copilot en el tenant — dueño: identidad.
2. Inventariar LiteLLM y n8n (versión, exposición, secretos) — dueño: plataforma / automatización.
3. Señal de que funcionó: ningún orquestador de IA/automatización queda sin versión y restricción de red documentadas.
