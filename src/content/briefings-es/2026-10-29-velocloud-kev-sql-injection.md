---
title: "CVE-2026-114625 en el KEV: SQL injection en Arista VeloCloud Orchestrator"
description: "CISA añade fallo de inyección de SQL explotado en orquestador SD-WAN; tercera del producto en el catálogo en 2026."
pubDate: 2026-10-29T10:22:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/23/cisa-adds-one-known-exploited-vulnerability-catalog"
cover: "https://covers.duarte.top/covers/20261028-velocloud-kev-sql-injection.jpg"
tipo: vulnerabilidades
tags: ["kev", "velocloud", "edge", "cve-2026-114625", "cisa"]
notionUrl: "https://www.notion.so/406174117473818fb91ce96808fe456c"
---

**En una línea:** SQL injection en VeloCloud Orchestrator entra al KEV con plazo federal de tres días y es la tercera falla del producto en el catálogo este año.

## Qué ocurrió

El 23 de octubre de 2026 la CISA añadió el CVE-2026-114625 al KEV. La vulnerabilidad es inyección de SQL en versiones on-premise del Arista VeloCloud Orchestrator (CVSS 9.9) que permite acceso a funcionalidad interna privilegiada. Plazo de remediación federal: 26 de octubre. La explotación requiere sesión autenticada mínima. Correcciones en 5.2.3.18, 6.1.3.10 y 6.4.2.12.

## Por qué importa

El orquestador de edge concentra la gestión de múltiples sitios. La tercera adición al KEV en el año eleva la prioridad de inventario y de verificación de parche en instancias on-premise.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| SQL injection explotada | KEV + confirmación Arista | Alta |
| Acceso a funcionalidad privilegiada | CVSS 9.9 | Alta |
| Sesión mínima suficiente | Enterprise Read Only | Media |

## Qué hacer esta semana

1. Inventariar instancias on-premise del VeloCloud Orchestrator — dueño de red/edge.
2. Aplicar las versiones corregidas y confirmar remediación — dueño de vulnerabilidades.
3. Revisar logs de sesiones autenticadas en el portal en el período anterior al parche.
