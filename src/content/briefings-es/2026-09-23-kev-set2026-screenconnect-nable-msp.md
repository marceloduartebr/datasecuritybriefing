---
title: "KEV set/2026: ScreenConnect y N-able en el radar MSP"
description: "CISA KEV set/2026 incluye CVE-2026-84869 (ScreenConnect) y CVE-2026-86218 (N-able N-central) — ángulo MSP/RMM en Brasil."
pubDate: 2026-09-23T10:28:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-msp.jpg"
tipo: vulnerabilidades
tags: ["kev", "msp", "rmm", "screenconnect", "n-able"]
notionUrl: "https://www.notion.so/3dd17411747381049fcbfe5e3528317d"
pais: br
---

En una línea: RMM y acceso remoto de MSP entran en el KEV; el canal de soporte se vuelve superficie de explotación.

## Qué ocurrió

En el catch-up KEV de septiembre/2026 (catálogo actualizado el 14/09), constan CVE-2026-84869 (ConnectWise ScreenConnect) y CVE-2026-86218 (N-able N-central), ambas con explotación conocida según la CISA.

## Por qué importa

En Brasil, los MSPs concentran decenas de clientes en una consola. El compromiso del RMM hereda credencial, sesión y script — sin un nuevo correo de phishing. Los contratos de servicio rara vez exigen evidencia de parche KEV en 48–72h.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| ScreenConnect | CVE-2026-84869, KEV | Crítica |
| N-able N-central | CVE-2026-86218, KEV | Crítica |
| Cadena MSP→cliente | Sesión remota legítima post-exploit | Alta |

## Qué hacer esta semana

1. Pedir al MSP evidencia de versión y parche de las CVEs KEV — dueño: gestión de proveedores.
2. Restringir la exposición de la consola RMM (VPN/IP allowlist) — dueño: red.
3. Señal de que funcionó: hay registro escrito de versión ScreenConnect/N-central y fecha de corrección alineada al KEV.
