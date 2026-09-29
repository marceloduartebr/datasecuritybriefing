---
title: "Microsoft: Purview y Entra bloquean dato sensible camino a la shadow AI"
description: "GA de clasificación Purview en Entra Global Secure Access para tráfico humano y agéntico on-behalf-of — el archivo se detiene antes de llegar a la IA no sancionada."
pubDate: 2026-09-29T10:14:00-03:00
sourceName: "Microsoft Security Blog"
sourceUrl: "https://www.microsoft.com/en-us/security/blog/2026/09/24/whats-new-in-microsoft-security-september-2026/"
cover: "https://covers.duarte.top/covers/20260925-microsoft-purview-entra-shadow-ai.jpg"
tipo: noticia
tags: ["dspm", "shadow-ai", "microsoft", "purview", "aispm"]
notionUrl: "https://www.notion.so/3e617411747381ebb181ee5824c2ac20"
---

En una línea: el control de red pasa a ver el agente, no solo el clic del analista.

## Qué ocurrió

El 24 de septiembre de 2026 Microsoft anunció disponibilidad general de protección de dato en movimiento con Purview y Entra Global Secure Access. Clasificación y políticas de Purview se aplican en la capa de red a acciones humanas y a tráfico agéntico on-behalf-of. Ejemplo oficial: la carga de un documento sensible a una herramienta de IA no sancionada puede interrumpirse antes de salir.

## Por qué importa

Cierra un agujero que el DSPM clásico no cubre solo: el dato en tránsito hacia un destino no inventariado. Sigue dependiendo de buena clasificación y de lista de destinos. En LATAM, el valor es evidencia — bloqueo registrado — no el logo del fabricante.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Carga a IA no sancionada | GA Purview+Entra GSA | Alta |
| Tráfico OBO de agente | mismo anuncio | Alta |
| Clasificación débil | premisa del control | Media |

## Qué hacer esta semana

1. Verificar si la clasificación cubre el dato que de hecho va a IA.
2. Listar destinos de IA aprobados y lo que debe bloquearse en el borde.
3. Señal de que funcionó: log de bloqueo de una prueba controlada, con agente y con usuario.
