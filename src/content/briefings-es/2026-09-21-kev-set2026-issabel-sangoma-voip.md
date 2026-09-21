---
title: "VoIP BR: Issabel JWT y Sangoma Switchvox en el KEV"
description: "KEV sep/2026: Issabel CVE-2026-89026 (JWT hardcoded) y Sangoma Switchvox CVE-2026-9586 — ángulo VoIP Brasil."
pubDate: 2026-09-21T10:54:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-voip.jpg"
tipo: vulnerabilidades
tags: ["kev", "issabel", "sangoma", "voip", "brasil", "jwt"]
notionUrl: "https://www.notion.so/3dd174117473814a9e3efc17a3cc4fe4"
---

En una línea: el PBX Issabel con JWT hardcoded y Switchvox entran al KEV — VoIP sigue siendo superficie crítica en Brasil.

## Qué ocurrió

En el KEV de septiembre/2026: CVE-2026-89026 (Issabel — JWT hardcoded) y CVE-2026-9586 (Sangoma Switchvox), ambas con explotación conocida según CISA.

## Por qué importa

Issabel (fork de Asterisk/Elastix) es común en pymes y call centers brasileños. Un JWT hardcoded permite forjar sesión sin la credencial del usuario. Switchvox concentra tronco SIP y grabación — el compromiso se vuelve fraude de toll y filtración de audio (dato personal bajo la LGPD).

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Issabel JWT hardcoded | CVE-2026-89026, KEV | Crítica |
| Sangoma Switchvox | CVE-2026-9586, KEV | Alta |
| Exposición SIP/admin | Inventario débil fuera del DC | Alta |

## Qué hacer esta semana

1. Listar PBX Issabel/Switchvox (versión, exposición admin/SIP) — dueño: telecom / red.
2. Aplicar parche del vendor y rotar secretos/JWT — dueño: operaciones.
3. Señal de que funcionó: ningún PBX del KEV queda sin evidencia de corrección y el admin fuera de internet abierta.
