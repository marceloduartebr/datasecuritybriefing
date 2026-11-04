---
title: "Edge — Ivanti Connect Secure, cadena de zero-days explotada en el KEV"
description: "CISA añadió dos CVEs de Ivanti Connect Secure al KEV el 30 de octubre; la cadena da root no autenticado en appliances que parecían actualizados."
pubDate: 2026-11-04T10:17:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/30/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261102-ivanti-connect-secure-kev.jpg"
tipo: vulnerabilidades
tags: ["edge", "ivanti", "kev", "vpn"]
pais: us
notionUrl: "https://www.notion.so/40c1741174738185a2dce93b0bc1b654"
---

En una línea: Dos zero-days de Ivanti Connect Secure entraron en el KEV; la cadena con el bypass de octubre entrega root sin autenticación.

## Qué ocurrió

El 30 de octubre de 2026 la CISA incluyó CVE-2026-111357 y CVE-2026-118527 en el catálogo de vulnerabilidades explotadas. El CVE-2026-111357 (CVSS 7.0) permite escalada a root en el broker dsinvoked que confía indebidamente en datos de configuración del DSCache. El CVE-2026-118527 permite upload de archivo en ubicación conocida. Ambos se encadenan con el CVE-2026-104935, ya en el KEV desde el 13 de octubre. Volexity documentó al actor UTA0576 explotando la cadena desde al menos el 3 de octubre en appliances que estaban en la versión que corregía el bypass. Las correcciones llegaron el 29 de octubre (25.1.1.3 y 22.8R2.6). Plazo federal: 2 de noviembre para el primero y 13 de noviembre para el segundo. Los comandos corren en memoria y los logs son adulterados; la herramienta de integridad de Ivanti puede no verlos.

## Por qué importa

El perímetro de acceso remoto actualizado sigue siendo punto ciego. El parche parcial de octubre cerró el camino principal, pero dejó la escalada abierta. Root en el gateway se convierte en inventario de credenciales de dominio.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Cadena de zero-days en VPN | CISA KEV + Volexity | Alta |
| Detección post-explotación | Comandos en memoria, logs adulterados | Alta |
| Exposición de credenciales de dominio | Uso reportado de LAPS/BitLocker | Alta |

## Qué hacer esta semana

1. Inventariar versiones exactas de Ivanti Connect Secure y aplicar 25.1.1.3 o 22.8R2.6 — dueño: equipo de infraestructura.
2. Hacer triaje forense de memoria y red, no solo Integrity Checker — dueño: SOC.
3. Confirmar que el inventario de gateways está actualizado y que no hay appliances EOL (22.8 termina en ene/2027) sin plan.