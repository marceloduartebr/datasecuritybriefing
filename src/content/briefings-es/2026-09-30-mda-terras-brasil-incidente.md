---
title: "MDA comunica incidente en la Plataforma Terras do Brasil"
description: "Acceso indebido vía API de un módulo legado el 18 y 19 de septiembre; ANPD notificada el 25. El volumen sigue en investigación."
pubDate: 2026-09-30T10:12:00-03:00
sourceName: "MDA"
sourceUrl: "https://www.gov.br/mda/pt-br/noticias/2026/09/nota-de-esclarecimento-1"
cover: "https://covers.duarte.top/covers/20260930-mda-terras-brasil-incidente.jpg"
tipo: incidente
tags: ["vazamento", "governo", "brasil", "lgpd"]
pais: br
notionUrl: "https://www.notion.so/3eb17411747381a1a590d3ab2f6c6a00"
---

**En una línea:** Un sistema legado con credencial válida expuso el cadastro de la Plataforma Terras do Brasil; la autoridad fue avisada cuatro días después de la identificación.

## Qué ocurrió

El MDA identificó el 22/09/2026 un acceso indebido a un módulo legado integrado a la Plataforma Terras do Brasil. Una credencial obtenida de forma irregular hizo peticiones a la API el 18 y 19/09. Campos visibles: CPF, nombre, filiación, nacimiento, sexo, situación registral, dirección y DDD. Contención el 21/09; comunicación a la ANPD el 25/09. La extensión sigue en investigación.

## Por qué importa

La integración legado-plataforma sin inventario de acceso convierte un token válido en consulta masiva. Notificar al titular exige un mapa registro a registro: el ministerio aún no publicó el número.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| API legado + credencial robada | Nota oficial MDA | Alta |
| Cadastro con dirección y filiación | Campos listados en la nota | Alta |
| Volumen de titulares | No divulgado | Indeterminada |

## Qué hacer esta semana

1. Inventariar APIs de sistemas legado que leen el cadastro vivo — dueño: seguridad + TI.
2. Revisar logs de consulta por credencial en las ventanas 18–22/09 — dueño: SOC.
3. Señal: lista de registros alcanzados lista para una eventual notificación.
