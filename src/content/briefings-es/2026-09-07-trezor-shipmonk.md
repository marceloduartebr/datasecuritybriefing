---
title: "Trezor y ShipMonk: exclusión contratada, dato aún en el tercero"
description: "Otros 67 mil clientes de EE. UU. expuestos en un 3PL que había confirmado por escrito haber borrado la base."
pubDate: 2026-09-07T10:20:00-03:00
sourceName: "The Hacker News / Trezor"
sourceUrl: "https://thehackernews.com/2026/09/trezor-says-shipmonk-breach-exposed.html"
cover: "https://covers.duarte.top/covers/20260905-trezor-shipmonk.jpg"
tipo: incidente
tags: ["terceiros", "vazamento", "retencao", "lgpd"]
notionUrl: "https://www.notion.so/3d217411747381389197fc11639edb4a"
---

En una línea: el contrato y el correo de exclusión no sustituyen evidencia de que el registro salió del disco del operador logístico.

## Qué ocurrió

El 5 de septiembre de 2026 Trezor divulgó que el operador logístico ShipMonk, tras un acceso no autorizado informado el 10 de agosto, expone datos de otros 67 mil clientes en Estados Unidos — nombre, correo, teléfono, dirección de entrega y número de pedido, en pedidos de noviembre de 2019 a agosto de 2021. El volumen se suma a los 13.689 ya divulgados el mes anterior. Trezor dice que pidió la exclusión por escrito a lo largo de la relación y recibió confirmación; el dato permanecía en los sistemas del tercero. Las billeteras hardware no fueron comprometidas. El vínculo con ShinyHunters es atribución de Holborn, no un comunicado de la víctima.

## Por qué importa

El caso es de retención en tercero, no de contraseña rota. En América Latina el patrón se repite en 3PL, CRM y procesadora: SLA de 90 días en el papel, base de dirección aún consultable años después. Sin inventario registro a registro, la notificación a la ANPD y al titular se vuelve un palo de ciego.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Retención más allá del plazo en el 3PL | Confirmación escrita de exclusión vs base aún en ShipMonk | Alta |
| Datos de entrega + contacto | Nombre, correo, teléfono, dirección, pedido 2019-2021 | Alta |
| Atribución del actor | Holborn cita a ShinyHunters; Trezor no confirma el grupo | Indeterminada |

## Qué hacer esta semana

1. Listar 3PLs, CRMs y procesadoras con plazo de exclusión vencido — dueño: privacidad + compras.
2. Exigir evidencia técnica de exclusión (log, hash, recorte), no solo un correo de conformidad — dueño: seguridad.
3. Señal de que funcionó: cero bases del tercero con fecha de pedido anterior al SLA vigente.
