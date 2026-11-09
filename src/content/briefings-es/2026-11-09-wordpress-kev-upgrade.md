---
title: "CISA coloca en el KEV falla de RCE no autenticado en el upgrade de WordPress Core"
description: "CVE-2026-119977 permite ejecución de código durante la ventana de upgrade por rutas de staging predecibles; plazo federal 6 de noviembre."
pubDate: 2026-11-09T10:25:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/03/cisa-adds-one-known-exploited-vulnerability-catalog"
cover: "https://covers.duarte.top/covers/20261104-wordpress-kev-upgrade.jpg"
tipo: vulnerabilidades
tags: ["wordpress", "kev", "rce", "patch"]
pais: us
notionUrl: "https://www.notion.so/40e1741174738180bee6ef3979973365"
---

En una línea: WordPress Core 4.7–7.1.3 tiene RCE no autenticado en la ventana de upgrade; CISA lo añadió al KEV el 3 de noviembre con plazo del 6 de noviembre.

## Qué ocurrió

El 3 de noviembre de 2026 la CISA añadió el CVE-2026-119977 al catálogo KEV. La vulnerabilidad es un TOCTOU en el proceso de upgrade completo: los archivos se colocan en rutas de staging predecibles y accesibles por web. Un atacante no autenticado que gane la carrera ejecuta código. CVSS 8.1 (High). Afecta de 4.7 a 7.1.3. Corrección confirmada en 7.1.4; backports en progreso. Plazo federal 6 de noviembre; se requiere triage forense.

## Por qué importa

La ventana de mantenimiento se convierte en vector. Los sitios WordPress son perímetro común en empresas y organismos de la región. El auto-update ayuda, pero el control es saber si la instancia aún está en la versión vulnerable y si el proceso de staging fue limpiado.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| RCE no autenticado en la ventana de upgrade | CISA KEV + NVD | Alta |
| Rutas de staging predecibles | Descripción del CVE | Alta |
| Explotación confirmada | Adición al KEV | Alta |

## Qué hacer esta semana

1. Inventariar instancias WordPress y versiones — responsable: equipo de aplicación / DevOps.
2. Actualizar a 7.1.4 o aplicar el backport correspondiente — responsable: responsable de la plataforma.
3. Verificar logs de upgrade y accesos a wp-content/upgrade en los últimos días — responsable: SOC.