---
title: "ClarityCheck: 9 millones de imágenes faciales en una base sin contraseña ni cifrado"
description: "Un investigador halló 450 GB de la plataforma de identificación de llamadas, con fotos de adultos, adolescentes y niños recolectadas de la web."
pubDate: 2026-09-04T10:02:00-03:00
sourceName: "Cybernews"
sourceUrl: "https://cybernews.com/privacy/claritycheck-leak-are-you-indexed/"
cover: "https://covers.duarte.top/covers/20260902-claritycheck-biometricos.jpg"
tipo: incidente
tags: ["vazamento", "biometricos", "privacidade", "dspm", "criancas"]
notionUrl: "https://www.notion.so/3c717411747381fa8667c20124b12d57"
---

**En una línea:** Nueve millones de rostros, inclusive de menores, en una base de 450 GB sin autenticación — la empresa llamó a eso una URL no indexada.

## Qué ocurrió

El 21 de agosto de 2026, el investigador independiente Jeremiah Fowler localizó una base de datos de 450 GB asociada a ClarityCheck, plataforma usada para identificar llamadas desconocidas y buscar personas en línea. Dentro había más de 9 millones de imágenes faciales, incluyendo fotos de adolescentes y niños recolectadas de redes sociales y sitios de citas, sin contraseña y sin cifrado.

La empresa negó que los datos estuvieran “expuestos públicamente”, alegando que el acceso dependía de una URL no indexada. El investigador contestó el argumento al demostrar que no había autenticación.

## Por qué importa

La seguridad por oscuridad confunde “difícil de encontrar” con “protegido”. Sin control de acceso, un investigador — o un atacante — cierra esa distancia en minutos.

El dato biométrico no se cambia como una contraseña. Cuando el conjunto incluye menores, la gravedad sube: el riesgo no es solo la filtración de hoy, es lo que esas imágenes pueden alimentar después, del reconocimiento facial no autorizado al fraude de identidad.

El guión es conocido. Casi nunca es la empresa decidiendo dejar la base abierta. Es la empresa que no sabía que aquella base existía de ese modo, sin control de acceso, desde hace meses.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Base biométrica sin autenticación | Relato del investigador + volumen 450 GB | Alta |
| Imágenes de menores | Citadas en la cobertura | Alta |
| “URL no indexada” como control | Contestado; sin auth observada | Alta |

## Qué hacer esta semana

1. Inventariar bases con biometría o foto de persona y el control de acceso real de cada una — dueño: seguridad / datos.
2. Verificar exposición pública (bucket, índice, URL “secreta”) — dueño: AppSec / cloud.
3. Señal de que funcionó: lista de las bases biométricas con auth obligatoria y sin objeto público.
