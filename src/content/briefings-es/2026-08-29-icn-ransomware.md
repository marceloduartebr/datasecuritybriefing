---
title: "Ransomware en ICN: sistemas cifrados no son lo mismo que datos robados"
description: "La estatal que construye los submarinos de la Marina tuvo correo, archivos y bases cifrados el 9 de agosto. Más de dos semanas después, el público aún no sabe si hubo exfiltración."
pubDate: 2026-08-29T16:47:00-03:00
sourceName: "Jornal Atual"
sourceUrl: "https://jornalatual.com.br/ataque-cibernetico-icn"
cover: "https://covers.duarte.top/covers/20260829-icn-ransomware.jpg"
tags: ["vazamento", "ransomware", "brasil", "infraestrutura-critica"]
notionUrl: "https://www.notion.so/3c81741174738152a21be80d0628ec3d"
---

**En una línea:** ICN confirmó sistemas cifrados; no confirmó si algún dato salió.

## Qué ocurrió

En la madrugada del 9 de agosto de 2026, Itaguaí Construções Navais — joint venture del Programa de Desarrollo de Submarinos (Prosub), en sociedad con Naval Group — tuvo servidores de correo, sistemas internos, almacenamiento de archivos y bases de datos cifrados. El sitio institucional salió del aire.

Días después, el grupo LockBit reivindicó la autoría en un sitio de filtraciones. Hasta la publicación de este briefing, ICN no confirmó públicamente exfiltración ni impacto en el cronograma de los submarinos convencionales o del submarino nuclear. La empresa dijo haber movilizado TI y firmas especializadas para investigar y restaurar sistemas.

Una reivindicación en leak site no es confirmación de la víctima.

## Por qué importa

Cifrar un archivo impide el acceso. Exfiltrar un archivo significa que la copia ya está fuera de su control, se pague rescate o no. La prensa y, con frecuencia, la propia empresa tratan las dos cosas como sinónimo.

En defensa, energía e infraestructura el patrón se repite: control físico y de red relativamente fuerte; poca visibilidad sobre dónde estaba el dato sensible *dentro* de los sistemas que acabaron cifrados. Sin ese mapa, “no hay evidencia de exfiltración” es esperanza, no constancia.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Disponibilidad (sistemas cifrados) | Confirmado por la empresa / cobertura | Alta |
| Exfiltración | Solo reivindicación en leak site | Indeterminada |
| Impacto en el Prosub | No confirmado | Indeterminada |

## Qué hacer esta semana

1. Separar en el playbook las preguntas “¿volvieron los sistemas?” y “¿qué había ahí y si algo salió?” — dueño: SecOps + dueño del dato.
2. Exigir evidencia de inventario (sistema, tipo de dato, volumen) *antes* de firmar un comunicado de “sin evidencia de filtración” — dueño: DPO / jurídico.
3. Señal de que funcionó: listar, en horas, los repositorios alcanzados y el dato que guardaban.
