---
title: "Bypass de Pointer Authentication de Apple entra en el KEV"
description: "CISA añadió el CVE-2024-27834 al catálogo KEV el 4 de noviembre; la corrección de Apple es de mayo de 2024."
pubDate: 2026-11-10T10:21:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261106-apple-pac-bypass-kev.jpg"
tipo: vulnerabilidades
tags: ["kev", "apple", "cve", "identidade"]
pais: us
notionUrl: "https://www.notion.so/410174117473815fbff2ef664db51879"
---

En una línea: fallo de 2024 en el WebKit de Apple entra en el KEV con plazo federal del 18 de noviembre.

## Qué ocurrió

El 4 de noviembre de 2026 la CISA listó el CVE-2024-27834. El fallo permite bypass de Pointer Authentication a quien ya tenga lectura y escritura arbitraria. Corregido en mayo de 2024. CVSS 5.5. Plazo federal 18 de noviembre.

## Por qué importa

El KEV confirma explotación. La existencia del parche no prueba que el dispositivo del usuario ya lo haya recibido.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Explotación confirmada | Adición al KEV el 4/11 | Alta |
| Ventana de parche | Corrección de mayo de 2024 | Media |

## Qué hacer esta semana

1. Inventariar dispositivos Apple fuera de las versiones corregidas — dueño: endpoint / MDM.
2. Confirmar que la política de actualización genera evidencia, no solo declaración — dueño: seguridad.
3. Señal: cero dispositivos gestionados aún vulnerables al CVE.