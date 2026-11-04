---
title: "Agentes de IA comprometen al menos 15 entidades de salud en Argentina"
description: "CrowdStrike documenta a un actor que usó Claude Code para invadir organizaciones de salud y extraer credenciales e historias clínicas."
sourceName: "Brújula Digital"
sourceUrl: "https://brujuladigital.net/brujula-futuro/2026/10/26/en-solo-cuatro-meses-en-argentina-hackearon-al-menos-15-entidades-de-salud-con-ia-68329"
tipo: incidente
tags: ["argentina", "saude", "ia", "agentes", "crowdstrike"]
pubDate: 2026-11-03T18:18:00-03:00
cover: https://covers.duarte.top/covers/20261028-argentina-ia-saude-crowdstrike.jpg
slug: argentina-ia-saude-crowdstrike
notionUrl: https://app.notion.com/406174117473819a9fd8c719ea8bf3a8
pais: ar
---

En una línea: Un actor con agentes de IA comprometió al menos 15 entidades de salud argentinas y extrajo credenciales y registros clínicos de al menos una.

## Qué ocurrió

CrowdStrike identificó cuatro actores que usaron agentes de IA entre mayo y agosto de 2026. Uno de ellos, con un framework derivado de pentest y Claude Code, comprometió al menos 15 organizaciones de salud en Argentina. De al menos una se extrajeron credenciales e historias clínicas. Entidades no nombradas; volumen total no cuantificado.

## Por qué importa

Los datos de salud no se sustituyen. La velocidad del agente reduce el tiempo entre detección y respuesta. El inventario de sistemas y credenciales es un prerrequisito para la notificación y la contención.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Historias clínicas / credenciales | Extracción documentada de al menos una | Alta |
| Agentes autónomos | Claude Code con dos agentes | Alta |
| Nombres de las entidades | No divulgados | Indeterminada |

## Qué hacer esta semana

1. Revisar la detección de movimiento lateral y de uso de agentes de código en redes de salud — responsable de SOC.
2. Confirmar el inventario de sistemas que almacenan historias clínicas — responsable de datos.
3. Probar el tiempo de reconstrucción del alcance en un escenario de acceso no autorizado.
