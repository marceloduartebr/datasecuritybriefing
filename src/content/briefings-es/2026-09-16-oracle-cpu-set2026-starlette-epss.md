---
title: "Oracle CPU 15/09 y el aviso Starlette: CVSS ≠ riesgo"
description: "Oracle Critical Patch Update 15/09 (OAM/WebLogic/Hyperion) y Starlette CVE-2026-48710 CVSS 6.5 con EPSS 0,36 — CVSS no es prioridad."
pubDate: 2026-09-16T10:21:00-03:00
sourceName: "Oracle CPU / FIRST EPSS"
sourceUrl: "https://www.oracle.com/security-alerts/"
cover: "https://covers.duarte.top/covers/20260916-vuln-patch.jpg"
tipo: vulnerabilidades
tags: ["oracle", "cpu", "starlette", "epss", "cvss", "priorizacao"]
notionUrl: "https://www.notion.so/3dd17411747381f98cd5f5c14dc0f4a9"
---

En una línea: la CPU Oracle del 15/09 exige ciclo de parche; Starlette CVE-2026-48710 muestra EPSS alto con un CVSS de “solo” 6.5.

## Qué ocurrió

El 15/09/2026 Oracle publicó el Critical Patch Update cubriendo, entre otros, Oracle Access Manager, WebLogic e Hyperion. En paralelo, CVE-2026-48710 (Starlette) aparece con CVSS 6.5 y EPSS ~0,36 (lectura 15/09) — probabilidad de explotación elevada para un score “medio”.

## Por qué importa

Los equipos que ordenan solo por CVSS ≥ 9 atrasan lo que el EPSS y el KEV ya señalan. WebLogic/OAM en Brasil aún sostienen ERP e identidad. Starlette bajo frameworks FastAPI amplía la lección al stack Python moderno.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Oracle CPU 15/09 (OAM/WebLogic/Hyperion) | Boletín Critical Patch Update | Alta (contexto) |
| Starlette CVE-2026-48710 | CVSS 6.5, EPSS ~0,36 el 15/09 | Alta (probabilidad) |
| Priorización solo por CVSS | Sesgo operacional conocido | Proceso |

## Qué hacer esta semana

1. Abrir el cambio para la CPU Oracle 15/09 en los productos en producción — dueño: plataforma.
2. Incluir EPSS/KEV en el criterio de SLA de parche (no solo CVSS) — dueño: vuln mgmt.
3. Señal de que funcionó: el backlog muestra CVE-2026-48710 priorizada pese al 6.5, y la CPU Oracle con ventana marcada.
