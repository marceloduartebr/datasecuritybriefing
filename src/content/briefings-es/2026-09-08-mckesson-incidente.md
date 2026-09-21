---
title: "McKesson: incidente en apps de terceros y alegación de ~284 millones de registros"
description: "La distribuidora confirma acceso a aplicaciones de terceros; ShinyHunters habla de un volumen bruto de líneas de paciente en Salesforce/Snowflake."
pubDate: 2026-09-08T10:35:00-03:00
sourceName: "BleepingComputer / McKesson"
sourceUrl: "https://www.bleepingcomputer.com/news/security/mckesson-discloses-breach-after-shinyhunters-claims-patient-data-theft/"
cover: "https://covers.duarte.top/covers/20260830-mckesson-incidente.jpg"
tipo: incidente
tags: ["vazamento", "saude", "terceiros", "dspm", "lgpd"]
notionUrl: "https://www.notion.so/3cc17411747381da9750c43849ca10be"
---

**En una línea:** Detectar el acceso en una app de tercero es una cosa; mapear, registro a registro, lo que salió de un tenant que no es el sistema oficial de la operación es otra.

## Qué ocurrió

El 28 de agosto de 2026 McKesson — una de las mayores distribuidoras de medicamentos e insumos hospitalarios de EE. UU. — comunicó un incidente descubierto el 25/08: acceso no autorizado a aplicaciones de terceros y extracción de datos. Al día siguiente actualizó que el recorte confirmado hasta entonces estaba en un subconjunto de clientes de las unidades Oncology & Multispecialty y Medical-Surgical.

El grupo ShinyHunters afirma haber llevado cerca de 1 TB en cuatro días (21 a 25/08) de entornos Salesforce y Snowflake y habla de aproximadamente 284 millones de registros relacionados con pacientes — nombres, fechas de nacimiento, SSN, historial, medicación, alergia, consultas. El propio grupo dijo a BleepingComputer que el número es un conteo bruto de líneas, no de individuos únicos, y que aún no cerró el inventario. McKesson no confirmó el volumen ni los sistemas nombrados; el 8-K dice que, en la fecha del filing, el incidente no se clasificó como material.

## Por qué importa

El punto no es el tamaño del número alegado. Es el intervalo entre detectar el acceso y saber, registro a registro, lo que salió de una aplicación que no es el sistema oficial de la operación. Cuando el dato clínico vive en la nube de un tercero, la política de la controladora no sustituye el mapa técnico de lo que ese tenant realmente guarda.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Acceso a apps de terceros | Confirmado por McKesson (8-K) | Alta |
| Volumen ~284 millones de líneas | Alegación ShinyHunters; la empresa no confirma | Indeterminada |
| Datos clínicos en Salesforce/Snowflake | Alegación del grupo; no confirmada | Indeterminada |

## Qué hacer esta semana

1. Listar bases de paciente — propias y de proveedor — que un token de SSO válido consigue ver — dueño: seguridad / privacidad.
2. Exigir inventario técnico del tenant de cada SaaS clínico (objeto, campo, retención) — dueño: AppSec / cloud.
3. Señal de que funcionó: mapa titular a titular listo para notificación, sin depender del conteo bruto de líneas del leak site.
