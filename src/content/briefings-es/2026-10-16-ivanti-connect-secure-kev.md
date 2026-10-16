---
title: "Edge — Ivanti Connect Secure en el KEV con bypass pre-autenticación"
description: "CISA añadió CVE-2026-104935 al KEV; explotación confirmada en Connect Secure permite RCE sin login."
pubDate: 2026-10-16T10:29:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/13/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261014-ivanti-connect-secure-kev.jpg"
tipo: vulnerabilidades
tags: ["vulnerabilidades", "kev", "ivanti", "edge", "vpn"]
pais: us
notionUrl: "https://www.notion.so/3f9174117473816d89bafe2250a88f99"
---

En una línea: CVE-2026-104935 en el KEV permite bypass de autenticación y ejecución de comandos sin login en Ivanti Connect Secure; plazo federal 16/10.

## Qué ocurrió

El 13 de octubre de 2026 la CISA incluyó el CVE-2026-104935 en el catálogo de vulnerabilidades explotadas. La falla es authentication bypass by spoofing en Ivanti Connect Secure, permitiendo RCE pre-autenticación. Afecta versiones 25.1.1.1 y anteriores, 25.1.2.2 y anteriores y 22.8R2.4 y anteriores. Ivanti confirma explotación limitada. Volexity reportó cadena de tres zero-days desde el 3/10 para root en appliance actualizado, con robo de credenciales y exfiltración. Plazo BOD para FCEB: 16 de octubre. ICT puede no detectar porque los comandos se ejecutan en memoria.

## Por qué importa

Borde de VPN con bypass es acceso al perímetro sin credencial. La política de parche existe; la evidencia de compromiso exige forense de memoria, no solo la herramienta de integridad.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Explotación activa | Confirmada por Ivanti y CISA KEV | Alta |
| RCE pre-auth | Descripción del CVE y advisory | Alta |
| Detección por ICT | Limitada (comandos en memoria) | Media |

## Qué hacer esta semana

1. Inventariar Connect Secure, versión y exposición — redes.
2. Aplicar parche o aislar hasta corrección; planear forense si expuesto — SOC.
3. Señal: ningún appliance afectado sin parche o sin evidencia de no-compromiso.
