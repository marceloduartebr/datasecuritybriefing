---
title: "Edge BR: MikroTik, Fortinet y SonicWall en el KEV de septiembre"
description: "KEV set/2026: MikroTik CVE-2026-86060/67277, Fortinet CVE-2025-25249 y SonicWall SMA1000 CVE-2026-83548/83549 — borde BR."
pubDate: 2026-09-22T10:43:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-edge.jpg"
tipo: vulnerabilidades
tags: ["kev", "mikrotik", "fortinet", "sonicwall", "edge", "brasil"]
notionUrl: "https://www.notion.so/3dd174117473812db535c53989507de6"
pais: br
---

En una línea: tres familias de edge muy presentes en Brasil entran (o reaparecen) en el KEV de septiembre.

## Qué ocurrió

En el KEV de septiembre/2026 constan MikroTik CVE-2026-86060 y CVE-2026-67277; Fortinet CVE-2025-25249; SonicWall SMA1000 CVE-2026-83548 y CVE-2026-83549 — todas con explotación conocida según la CISA (catálogo 14/09/2026).

## Por qué importa

Filiales, ISPs y VPN doméstica en Brasil usan estas plataformas fuera del ciclo de parches del DC. Inventario incompleto retrasa BOD/KEV. Un CVE de 2025 aún en el KEV de 2026 refuerza: CVSS y año del ID no miden la exposición actual.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| MikroTik RouterOS | CVE-2026-86060, CVE-2026-67277, KEV | Crítica |
| Fortinet | CVE-2025-25249, KEV | Crítica |
| SonicWall SMA1000 | CVE-2026-83548, CVE-2026-83549, KEV | Crítica |

## Qué hacer esta semana

1. Cruzar CMDB/NetBox con MikroTik, Fortinet y SonicWall — dueño: red.
2. Priorizar parche/mitigación de las CVEs KEV anteriores — dueño: operaciones.
3. Señal de que funcionó: cada appliance de borde tiene versión y ticket de remediación vinculado al KEV.
