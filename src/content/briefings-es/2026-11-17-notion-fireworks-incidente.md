---
title: "Intrusión en Fireworks AI expone transcripciones de chats de Notion AI"
description: "Un proveedor de inferencia con compromiso de retención cero tenía conversaciones de clientes, incluso con claves de API pegadas."
pubDate: 2026-11-17T15:52:00-03:00
sourceName: "Notion"
sourceUrl: "https://www.notion.com/security/advisories/security-incident-involving-a-third-party-ai-vendor"
cover: "https://covers.duarte.top/covers/20261116-notion-fireworks-incidente.jpg"
tipo: incidente
tags: ["aispm", "shadow-ai", "terceiros", "vazamento"]
pais: us
---

En una línea: el contrato decía retención cero, pero el contenido de los prompts estaba en el entorno del proveedor de IA cuando lo invadieron.

## Qué ocurrió
Notion publicó el 12/11/2026 (boletín actualizado) que la intrusión en Fireworks AI, proveedor de inferencia que Notion usaba para la función Insights y para servir modelos open-weight, expuso transcripciones de chats de Notion AI. Cronología de Notion: el 2/11 Fireworks avisó de un acceso a un conjunto de datos que parecía solo sintético; el 3/11 Notion cortó la conexión; el 4/11 borró todos sus datos en el sistema de Fireworks; el 6/11 Fireworks avisó de un posible acceso a datos de clientes; el 8/11 confirmó el conjunto afectado; el 9/11 Notion avisó a los clientes afectados. Las transcripciones eran del dataset de Insights y, para la mayoría de los workspaces, no atribuibles (sin autor ni workspace, sin resultados de herramientas). El impacto es de menos del 1% de los workspaces. El 11/11 Notion revocó las claves de API de Notion encontradas en los mensajes y el 12/11 avisó a los emisores de claves de terceros halladas en ellos. Insights fue desactivado y Notion dejó de usar Fireworks. Según BleepingComputer (11/11), Fireworks confirmó que un atacante entró en su entorno de desarrollo a través de un proveedor de nube externo el 23/10, llevándose metadatos, datos de facturación, pesos de modelos y datasets de algunos clientes; es la segunda intrusión en Fireworks (la primera, a comienzos de octubre, expuso variables de entorno con claves y tokens). Notion afirma que no hubo intrusión en sus propios sistemas y que Fireworks tenía un compromiso contractual de retención cero. El boletín no se releyó para este briefing; los datos provienen de la lectura registrada por el radar.

## Por qué importa
Los proveedores de inferencia reciben el contenido bruto de los prompts, y los usuarios pegan ahí secretos y datos del negocio. Un compromiso contractual de retención no reemplaza la verificación de lo que de hecho quedó almacenado del otro lado.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Proveedor de IA invadido | Acceso al entorno de desarrollo de Fireworks a través de un proveedor de nube externo | Alta |
| Secretos en prompts | Claves de API encontradas en las transcripciones y revocadas | Alta |
| Retención más allá del contrato | Dataset de Insights presente pese al compromiso de retención cero | Media |

## Qué hacer esta semana
1. Listar los proveedores de IA y de inferencia que reciben prompts de la empresa, directamente o de forma indirecta vía SaaS — responsable: seguridad y privacidad.
2. Buscar y rotar secretos pegados en herramientas de IA, empezando por claves de API — responsable: equipos de ingeniería.
3. Señal de que funcionó: para cada proveedor de IA, hay registro de qué datos recibe y evidencia de retención, no solo la cláusula.
