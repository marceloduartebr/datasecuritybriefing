---
title: "Perímetro — PHP, RCE pre-auth en php2shell"
description: "Dos fallas críticas de RCE sin autenticación en PHP fueron corregidas el 21 de octubre de 2026; CSIRT chileno y ColCERT pidieron actualización inmediata."
pubDate: 2026-10-23T10:26:00-03:00
sourceName: "PHP.net"
sourceUrl: "https://www.php.net/archive/2026.php#2026-10-21-5"
cover: "https://covers.duarte.top/covers/20261022-php-php2shell.jpg"
tipo: vulnerabilidades
tags: ["vulnerabilidades", "php", "rce", "latam"]
pais: latam
notionUrl: "https://www.notion.so/4011741174738134a465ced20e210024"
---

En una línea: Dos fallas críticas de RCE sin autenticación en el runtime PHP fueron corregidas el 21 de octubre; la actualización es la única mitigación completa.

## Qué ocurrió

El 21 de octubre de 2026 el proyecto PHP liberó las versiones 8.5.12, 8.4.27, 8.3.36 y 8.2.35 corrigiendo CVE-2026-109618 (corrupción de memoria en OOM) y CVE-2026-109619 (estado global obsoleto / use-after-free). Ambas tienen CVSS 9.2 y permiten ejecución remota de código sin autenticación. El riesgo es más alto en Apache mod_php, donde una solicitud no autenticada puede disparar el ataque antes del código de la aplicación. CSIRT Nacional de Chile (AVC26-00740) y ColCERT emitieron alertas el mismo día. PoCs circularon. Las versiones 8.1 y anteriores ya no reciben actualizaciones del proyecto.

## Por qué importa

El perímetro de aplicación web incluye el runtime. Sin inventario de versión de PHP en producción, la política de parche no genera evidencia. Alertas de CSIRT latinoamericanos muestran que el hecho ya llegó a la región.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| RCE pre-auth en el runtime | Alertas CSIRT CL/CO + PoCs | Alta |
| Exposición mod_php | Demostrado por el proyecto | Alta |
| Versiones EOL | 8.1 y anteriores sin update oficial | Media |

## Qué hacer esta semana

1. Inventariar instancias PHP expuestas — dueño de la infra.
2. Confirmar versión y aplicar 8.2.35+ o superior soportado — dueño de la aplicación.
3. Señal: ningún servidor internet-facing en versión vulnerable después de 48h.