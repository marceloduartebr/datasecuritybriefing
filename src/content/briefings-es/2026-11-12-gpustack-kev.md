---
title: "GPUStack: bypass de autenticación en servidor de modelos de IA entra en el KEV"
description: "Confianza indebida en el origen loopback da admin sin contraseña a quien alcanza el servidor de inferencia."
pubDate: 2026-11-12T18:21:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/09/cisa-adds-four-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261110-gpustack-kev.jpg"
tipo: vulnerabilidades
pais: us
tags: ["kev", "aispm", "shadow-ai", "infraestrutura-de-ia", "autenticacao"]
notionUrl: "https://www.notion.so/413174117473812a9404fd439922bc8c"
---

**En una línea:** servidores de inferencia fuera del inventario son shadow AI con acceso de admin expuesto.

## Qué ocurrió
La CISA incluyó el 09/11/2026 el CVE-2026-102895 de GPUStack (gestor de clústeres de GPU para servir modelos de IA) en el KEV. La falla es un bypass de autenticación vía origen loopback confiable (peer TCP de proxy reverso o encabezado X-GPUStack-Real-IP), que concede admin sin autenticación. CVSS 9,8 según fuentes secundarias (NVD no consultado); EPSS 0,3%. El advisory del fabricante no fue leído.

## Por qué importa
Los clústeres de inferencia concentran modelos, datos de fine-tuning, prompts y claves de API. Suelen ser montados por equipos de datos, fuera del inventario de seguridad.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Bypass de autenticación por encabezado/proxy | KEV 09/11/2026 | Crítica |
| Datos y claves en el clúster de IA | Depende del uso | Alta |

## Qué hacer esta semana
1. Localizar instancias de GPUStack y aplicar la corrección del fabricante — dueño: plataforma de datos/ML.
2. Bloquear el encabezado X-GPUStack-Real-IP viniendo de afuera en el proxy reverso — dueño: infraestructura.
3. Señal de que funcionó: inventario de servidores de modelos con dueño y datos accesibles mapeados.

> Nota de investigación: la fuente no fue releída en esta etapa de evaluación; los hechos siguen el registro del radar DSB.
