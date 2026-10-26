---
title: "Meta suspende el uso compartido de Muse tras GhostShares exponer conversaciones vía DNS pasivo"
description: "Claroc enumeró más de 6.800 enlaces del agente Muse de Meta vía DNS pasivo; documentos internos y datos personales eran accesibles sin el enlace original. Meta suspendió la función."
pubDate: 2026-10-26T10:23:00-03:00
sourceName: "Claroc"
sourceUrl: "https://blog.claroc.io/ghostshares-muse-passive-dns/"
cover: "https://covers.duarte.top/covers/20261020-meta-muse-ghostshares.jpg"
tipo: incidente
tags: ["ia", "privacidade", "meta", "ghostshares", "dns"]
pais: us
notionUrl: "https://www.notion.so/3ff17411747381638b44f886b386a2bb"
---

En una línea: Los enlaces de uso compartido de Muse de Meta eran enumerables por DNS pasivo porque el título de la conversación iba al subdominio.

## Qué ocurrió

En octubre de 2026, investigadores de Claroc identificaron que el agente de IA Muse (Meta) generaba enlaces de uso compartido de conversaciones en el formato título-id.cf.metaaiusercontent.com. Una sola consulta a servicios comerciales de DNS pasivo devolvió más de 6.800 hostnames. Muestras abiertas sin inicio de sesión contenían documentos financieros internos, solicitudes de préstamo, calendarios de vacaciones y notas de preparación para una búsqueda ejecutiva confidencial. La falla (GhostShares) fue reportada en el bug bounty de Meta el 8 de octubre. El 20 de octubre, tras contacto de la prensa, Meta suspendió temporalmente la función.

## Por qué importa

“Cualquiera con el enlace” deja de ser control cuando el hostname es públicamente enumerable. Agentes de IA que materializan conversaciones en páginas web introducen un nuevo vector de exposición: el título de la sesión se convierte en metadato de infraestructura. Sin inventario de lo ya publicado, la detección y la respuesta dependen de investigación externa.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Enumeración de shares vía DNS pasivo | >6.800 hostnames en una consulta; muestras con datos sensibles | Alta |
| Acceso sin autenticación a páginas “con el enlace” | La mayoría de las muestras abrió en modo anónimo | Alta |
| Respuesta de Meta | Suspensión de la función tras cobertura de prensa | Media |

## Qué hacer esta semana

1. Mapear qué agentes de IA en la organización generan enlaces o páginas a partir de conversaciones y si el título o metadatos entran en el hostname o URL pública — dueño: equipo de seguridad / producto.
2. Revisar la política de uso compartido de salidas de agentes: exigir autenticación, expiración corta y ausencia de datos sensibles en el identificador público — dueño: gobernanza de datos.
3. Verificar si ya existen shares o artefactos publicados que puedan ser enumerados por DNS, Certificate Transparency o índices públicos — señal de que funcionó: inventario actualizado y ningún hostname con título sensible.