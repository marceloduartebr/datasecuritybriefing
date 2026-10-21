---
title: "Cisco Secure Email Gateway: path traversal pre-auth en KEV"
description: "CISA añadió CVE-2026-76519 el 14 de octubre; explotación activa confirmada; plazo federal 17 de octubre."
pubDate: 2026-10-21T10:17:00-03:00
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/cisco-warns-of-exploited-secure-email-gateway-vulnerability/"
cover: "https://covers.duarte.top/covers/20261015-cisco-secure-email-kev.jpg"
tipo: vulnerabilidades
tags: ["kev", "cisco", "edge", "cve"]
pais: us
notionUrl: "https://www.notion.so/3fa17411747381a0b0dbf368eb497f01"
---

En una línea: CVE-2026-76519 en Cisco Secure Email Gateway permite escritura de archivo y RCE root sin login cuando File Reputation está activo.

## Qué ocurrió

El 14 de octubre de 2026 la CISA incluyó el CVE-2026-76519 en el KEV. Path traversal relativo permite a un atacante remoto no autenticado escribir archivos y ejecutar comandos como root. Condición: File Reputation (AMP) habilitado y Content Scanner Tools < 25.3.0.5525. Cisco confirmó explotación en octubre. Parche el 14 de septiembre (AsyncOS 15.5.5-014 / 16.5.0-780). Plazo FCEB: 17 de octubre.

## Por qué importa

El mismo componente que inspecciona el adjunto se convierte en el vector. Sin inventario de versión del scanner y exposición del appliance, el plazo de tres días ya puede haber sido superado.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Path traversal pre-auth | CISA KEV + Cisco | Alta |
| RCE root | Confirmado | Alta |
| File Reputation activo | Condición de explotación | Alta |

## Qué hacer esta semana

1. Inventariar Secure Email Gateway con File Reputation activo y versión del Content Scanner — SOC/Infra.
2. Aplicar AsyncOS 15.5.5-014 o 16.5.0-780 o superior — Operaciones.
3. Confirmar ausencia de explotación en logs de adjuntos — IR.
