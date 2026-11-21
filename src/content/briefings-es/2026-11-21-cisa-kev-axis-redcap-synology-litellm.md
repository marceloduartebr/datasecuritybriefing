---
title: "CISA añade al KEV fallas explotadas en Apache Axis, REDCap, Synology DSM y LiteLLM"
description: "El 18 de noviembre de 2026 la CISA incluyó cuatro CVE en el catálogo KEV, con evidencia de explotación activa; tres de ellas tienen plazo el 21 de noviembre y exigen triaje forense."
pubDate: 2026-11-21T08:50:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261118-kev-axis-redcap-synology-litellm-1759.jpg"
tipo: vulnerabilidades
tags: ["cisa", "kev", "axis", "redcap"]
pais: global
---

En una línea: cuatro fallas con explotación activa entran en el KEV el mismo día, y en tres de ellas el plazo federal es el 21 de noviembre, con triaje forense.

## Qué ocurrió

El 18 de noviembre de 2026 la CISA añadió cuatro vulnerabilidades al catálogo KEV, con base en evidencia de explotación activa. La CVE-2026-90436, en Apache Axis 1.x hasta la versión 1.4, permite instanciar clases a partir de un SOAP Fault sin autenticación; el aviso del proyecto en oss-security, del 6 de noviembre, le asigna CVSS 9.8 y recomienda migrar a Axis 2/Java o aplicar un parche puntual, porque Axis 1 está fuera de soporte y no debería recibir un release correctivo. La CVE-2026-90817, en REDCap a partir de la 13.3.0, permite ejecución remota de código sin autenticación si el atacante conoce un hash válido de encuesta pública; Tenable registra CVSS 9.8, y el registro de la CVE indica corrección en las versiones 16.0.49 LTS, 17.3.10 LTS y 17.4.4 Standard. La CVE-2024-10441, en Synology DiskStation Manager, es una ejecución remota de código en el daemon de plugins, con CVSS 9.8 en el aviso Synology-SA-24:20; las correcciones incluyen DSM 7.2.2-72806-1, 7.2.1-69057-6, 7.2-64570-4 y 7.1.1-42962-7, además de BeeStation OS 1.1-65374. La CVE-2026-40217, en BerriAI LiteLLM, entra en la misma alerta, con plazo el 2 de diciembre y sin triaje forense obligatorio. Para Axis, REDCap y Synology, el plazo para las agencias federales estadounidenses es el 21 de noviembre, con triaje forense exigido por la BOD 26-04.

## Por qué importa

Axis heredado, bases de investigación de REDCap, NAS de Synology y el gateway de IA de LiteLLM suelen quedar fuera del inventario que el equipo revisa a diario. Una política de parches no prueba que esos productos se hayan encontrado y corregido.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| RCE sin autenticación en Axis 1.x (EOL) | CISA KEV y aviso oss-security, CVSS 9.8 | Crítica |
| RCE en REDCap vía encuesta pública | CISA KEV, CVSS 9.8 en Tenable | Crítica |
| RCE en Synology DSM | CISA KEV y Synology-SA-24:20, CVSS 9.8 | Crítica |

## Qué hacer esta semana

1. Inventariar instancias de Apache Axis 1.x, REDCap, Synology DSM/BeeStation y LiteLLM expuestas o usadas en producción (responsable: gestión de vulnerabilidades / equipo de activos).
2. Aplicar las correcciones o la migración recomendada y, en los tres casos con triaje forense, verificar si hubo explotación antes del parche (responsable: CISO / respuesta a incidentes).
3. Tratar Axis 1.x aún en uso como excepción formal, con plazo de salida, porque no habrá release oficial (responsable: arquitectura / dueño de la aplicación).
