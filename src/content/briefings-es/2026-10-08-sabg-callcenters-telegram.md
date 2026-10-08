---
title: "SABG investiga oferta de 12,9 millones de registros de call centers"
description: "Telegram del 22/09 con bases atribuidas a call centers; muestra de 13 mil líneas cita bancos y retail. La marca en el archivo no prueba un breach."
pubDate: 2026-10-08T10:16:00-03:00
sourceName: "SABG"
sourceUrl: "https://www.gob.mx/buengobierno/prensa/buen-gobierno-investiga-presunta-venta-de-mas-de-12-9-millones-de-registros-con-datos-personales"
cover: "https://covers.duarte.top/covers/20260930-sabg-callcenters-telegram.jpg"
tipo: incidente
tags: ["vazamento", "mexico", "terceiros", "call-center"]
pais: mx
notionUrl: "https://www.notion.so/3eb17411747381e6b600eeabf8dec4b4"
---

En una línea: la SABG encontró en Telegram una oferta de 12,9 millones de registros atribuidos a call centers y abrió investigación sin confirmar breach en las marcas citadas.

## Qué ocurrió

Comunicado 113, 24/09/2026. Una publicación en Telegram del 22/09 ofrecía bases de call centers con nombre, contacto, fecha de nacimiento, RFC, domicilio y datos bancarios. Muestra: 13 mil registros / 13 bases. Los nombres comerciales de la muestra incluyen Amazon, Amex, Afirme, Banamex, BanBajío, BBVA, Banorte, Banregio, HSBC, Inbursa, INVEX, Liverpool, Sam’s Club, Santander, Scotiabank, Sears, Suburbia, Banco Walmart, Credomatic, IXE, Sanborns, C&A y Soriana. Hecho distinto del caso Aeroméxico (15 millones, 18/09).

## Por qué importa

La cadena de atención telefónica replica el cadastro del cliente. Sin evidencia de origen, la investigación recae en el procesador, y el responsable aún necesita mapear qué podía exportar el tercero.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Oferta en mensajería | Comunicado SABG | Alta |
| Dato bancario + RFC | Descripción de la oferta | Alta |
| Atribución a las marcas | No confirmada por la autoridad | Indeterminada |

## Qué hacer esta semana

1. Pedir al procesador de contact center el log de exportación 01–22/09 — dueño: DPO + compras.
2. Confrontar la muestra pública (cuando exista) con el hash de bases internas — dueño: seguridad.
3. Señal: lista de procesadores con acceso a RFC/dato bancario actualizada.
