---
title: "KEV set/2026: Cisco FMC y Citrix NetScaler en el perímetro"
description: "CISA añade CVE-2026-20079 (Cisco FMC/SCC auth bypass CVSS 10) y CVE-2026-19490 (Citrix NetScaler AAA 9.8) al KEV en set/2026."
pubDate: 2026-09-29T10:14:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-perimetro.jpg"
tipo: vulnerabilidades
tags: ["kev", "cisco", "citrix", "perimetro", "auth-bypass"]
notionUrl: "https://www.notion.so/3dd1741174738165b5e4f7546e58b8c4"
---

En una línea: gestión de firewall y AAA de NetScaler entran al KEV con CVSS crítico y explotación conocida.

## Qué ocurrió

El 9/09/2026 la CISA incluyó en el Known Exploited Vulnerabilities Catalog la CVE-2026-20079 (Cisco Secure Firewall Management Center / Security Cloud Control — bypass de autenticación, CVSS 10, EPSS ~0,76) y la CVE-2026-19490 (Citrix NetScaler AAA, CVSS 9.8). Ambas afectan superficie de perímetro y autenticación remota con explotación confirmada.

## Por qué importa

Consola de política y portal AAA son atajos a identidad y regla de tráfico. Bypass autenticado en el gestor no deja rastro de "login fallido". En Brasil, FMC/SCC y NetScaler concentran acceso de partners y MSP — inventario incompleto retrasa el parche obligatorio del BOD/KEV.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Cisco FMC/SCC auth bypass | CVE-2026-20079 CVSS 10, KEV 2026-09-09, EPSS ~0,76 | Crítica |
| Citrix NetScaler AAA | CVE-2026-19490 CVSS 9.8, KEV | Crítica |
| Inventario de consola/AAA | Superficie típica de MSP y datacenter BR | Alta |

## Qué hacer esta semana

1. Listar instancias FMC/SCC y NetScaler AAA con versión y exposición — dueño: red / perímetro.
2. Aplicar corrección del vendor y validar acceso admin post-parche — dueño: operaciones.
3. Señal de que funcionó: ninguna consola de política o AAA listada en el KEV queda sin evidencia de parche o mitigación documentada.
