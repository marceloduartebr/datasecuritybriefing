---
title: "DMDC: nueve meses de acceso a un archivo militar sin cifrado"
description: "El centro de personal del Pentágono avisó a titulares en septiembre de un acceso indebido descubierto en julio, con PII sin cifrado."
pubDate: 2026-10-07T10:18:00-03:00
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/pentagon-personnel-agency-data-breach-impacts-3-million-people/"
cover: "https://covers.duarte.top/covers/20261001-dmdc-arquivo-pessoal.jpg"
tipo: incidente
tags: ["incidente", "estados-unidos", "pessoal", "arquivo"]
pais: us
notionUrl: "https://www.notion.so/3ec1741174738144a1c9eb02a32831c5"
---

En una línea: el archivo de personal estuvo accesible unos nueve meses y la carta no dice qué ficha se leyó.

## Qué ocurrió

SecurityWeek reprodujo el 29 de septiembre de 2026 el aviso del Defense Manpower Data Center. La carta del 18 de septiembre dice que, el 16 de julio de 2026, una vulnerabilidad en un sistema de compartición de archivos permitió acceso indebido. Entre octubre de 2025 y el hallazgo, pocos usuarios no autorizados accedieron a archivos con PII sin cifrado: Seguro Social, nombre, fecha de nacimiento, contacto, datos demográficos y especialidad ocupacional, según el titular. El producto no fue nombrado. El DMDC dice no tener indicio de uso indebido. Un oficial dijo a CNN que el alcance sería 2,76 millones de personas vivas y 294 mil fallecidas — cifra fuera de la carta.

## Por qué importa

Cerrar la vulnerabilidad no responde qué se leyó. Sin rastro de archivo, la notificación queda genérica y el riesgo de fraude permanece indeterminado.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Compartición de archivo sin cifrado | Carta del DMDC, 18/09 | Alta |
| Ventana de acceso | Octubre de 2025 al 16/07/2026 | Alta |
| Volumen de titulares | 2,76 mi vivas y 294 mil fallecidas, vía CNN, no en la carta | Media |
| Uso indebido | DMDC dice no tener indicio | Indeterminada |

## Qué hacer esta semana

1. Inventariar comparticiones con PII de personal y si el archivo está cifrado — RR. HH. e infra.
2. Exigir log de lectura por archivo, no solo la fecha del parche — seguridad.
3. Señal: un acceso fuera de perfil genera lista de archivos y titulares en hasta 24 horas.
