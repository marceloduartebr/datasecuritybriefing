---
title: "Edge — Plex Media Server, cadena Plex2Shell explotada en el KEV"
description: "CISA añade cuatro CVEs de Plex Media Server al KEV; la cadena Plex2Shell permite RCE sin autenticación y ya está explotada."
pubDate: 2026-10-28T10:16:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/20/cisa-adds-six-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261023-plex-plex2shell-kev.jpg"
tipo: vulnerabilidades
tags: ["vulnerabilidades", "kev", "plex", "edge"]
pais: us
notionUrl: "https://www.notion.so/40217411747381d1ac7eec5815c57d00"
---

En una línea: Cuatro fallos en Plex Media Server forman la cadena Plex2Shell y entraron en el KEV de CISA el 20 de octubre con explotación activa confirmada.

## Qué ocurrió

El 20 de octubre de 2026 la CISA incluyó en el catálogo Known Exploited Vulnerabilities los CVEs CVE-2026-96652, CVE-2026-96654, CVE-2026-96655 y CVE-2026-96656, que afectan a Plex Media Server antes de la build 1.43.3.10861. La cadena permite a un atacante remoto sin autenticación ejecutar código. El fabricante confirmó explotación activa y difundida tras PoC público el 16 de octubre. Plazos de remediación federal: 23 de octubre y 3 de noviembre, según el CVE.

## Por qué importa

Las instancias expuestas de servidores de medios a menudo quedan fuera del inventario de perímetro y de parche. La cadena muestra que un componente “periférico” puede convertirse en punto de entrada y de persistencia (miner y proxy).

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| RCE sin autenticación vía cadena Plex2Shell | KEV + confirmación del fabricante y honeypots | Alta |
| Instancias internet-facing desactualizadas | Explotación observada días después del PoC | Alta |
| Uso para miner y proxy | Reportes de investigadores y Plex | Media |

## Qué hacer esta semana

1. Inventariar servidores Plex (incluyendo NAS y home lab expuestos) y confirmar versión ≥ 1.43.3.10861 — operaciones / seguridad.
2. Aislar o apagar instancias no actualizables y revisar logs de procesos anómalos — SOC.
3. Incluir el producto en el ciclo de parche de edge / dispositivos no tradicionales — vulnerabilidades.
