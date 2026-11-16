---
title: "Barracuda ESG y productos relacionados entran en el KEV con explotación confirmada"
description: "CISA agrega CVE-2026-116606 y CVE-2026-111560 al KEV el 10/11; Barracuda confirmó explotación en un pequeño número de organizaciones."
pubDate: 2026-11-16T10:29:00-03:00
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/recently-patched-barracuda-vulnerabilities-exploited-in-attacks/"
cover: "https://covers.duarte.top/covers/20261111-barracuda-esg-kev.jpg"
tipo: vulnerabilidades
tags: ["vulnerabilidades", "perimetro", "kev", "barracuda"]
pais: us
notionUrl: "https://www.notion.so/415174117473816f8173ee395f41b214"
---

En una línea: Dos CVEs de Barracuda (bypass en ESG e inyección de comandos) entran en el KEV con plazo federal de 3 días y explotación ya confirmada.

## Qué ocurrió

CISA agregó el 10/11/2026 los CVE-2026-116606 (auth bypass ESG, CVSS 9.3) y CVE-2026-111560 (command injection en ESG/ADC/WAF/etc., CVSS 8.6) al KEV. Barracuda corrigió el 2/11 y confirmó el 9/11 explotación en un pequeño número de organizaciones. El encadenamiento permite root si la Admin UI es alcanzable.

## Por qué importa

La superficie de administración expuesta transforma el parche en carrera. El plazo corto del BOD refleja evidencia de explotación activa, no solo potencial.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Auth bypass ESG | KEV + confirmación Barracuda | Alta |
| Command injection | KEV + productos múltiples | Alta |
| Admin UI expuesta | Requisito de explotación | Alta |

## Qué hacer esta semana

1. Inventariar appliances Barracuda (ESG, ADC, WAF, etc.) y confirmar parche BNSF-40425/40430 o equivalente — dueño: infraestructura.
2. Restringir acceso a la Admin UI a redes internas confiables — dueño: red.
3. Verificar logs de acceso a la interfaz administrativa en los últimos 14 días — dueño: SOC.
