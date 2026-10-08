---
title: "CPR de Dinamarca: 8,8 millones vía acceso de un tercero"
description: "Terceros abusaron de la consulta legítima de una empresa al registro civil y alcanzaron nombre, dirección y número de 8,8 millones de personas."
pubDate: 2026-10-08T10:17:00-03:00
sourceName: "Ministério da Digitalização da Dinamarca"
sourceUrl: "https://via.ritzau.dk/pressemeddelelse/15205753/omfattende-uautoriseret-adgang-til-borgeres-cpr-oplysninger"
cover: "https://covers.duarte.top/covers/20261007-cpr-dinamarca-terceiro.jpg"
tipo: incidente
pais: eu
tags: ["gdpr", "terceiro", "registro-civil", "europa"]
notionUrl: "https://www.notion.so/3f2174117473812aa9a6e1807024e69a"
---

En una línea: el acceso legítimo de un tercero, sin alarma de volumen, expuso el número de identificación de 8,8 millones de personas.

## Qué ocurrió

El 5 de octubre de 2026, la administración del Det Centrale Personregister informó acceso no autorizado a nombre, dirección y número CPR de cerca de 8,8 millones de registrados (vivos, emigrados y fallecidos). El abuso usó el acceso legal de una empresa danesa. La administración cortó ese acceso, avisó al Datatilsynet y la policía investiga. La protección de nombre y dirección quedó fuera del recorte. El comportamiento anómalo de septiembre se notó la noche del 2 de octubre. El 6 de octubre, el ministerio atribuyó el hallazgo a una factura anormalmente alta y dijo que no había alarma automática para ese tipo de consulta. La empresa no fue nombrada.

## Por qué importa

Un contrato vigente no es evidencia de uso. El identificador nacional no se cambia, y la traza de volumen por credencial es lo que separa la consulta operativa de la extracción.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Tercero con acceso legal | Consulta abusada; acceso cortado | Alta |
| Identificador nacional | Cerca de 8,8 millones de números CPR | Alta |
| Detección | Factura alta; sin alarma automática del método usado | Alta |

## Qué hacer esta semana

1. El dueño de terceros lista credenciales con consulta a identificador nacional.
2. Seguridad comprueba si hay alerta de volumen fuera de patrón, no solo vencimiento de contrato.
3. Señal: un tercero con pico de consulta genera ticket antes de la factura.
