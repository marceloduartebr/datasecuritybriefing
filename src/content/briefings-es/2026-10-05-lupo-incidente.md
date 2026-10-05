---
title: "Lupo confirma acceso indebido a CPF y datos de pedido"
description: "El comunicado del 2 de octubre lista CPF, dirección y factura, notifica a la ANPD y no informa cuántos titulares fueron alcanzados."
pubDate: 2026-10-05T10:17:00-03:00
sourceName: "Lupo S.A."
sourceUrl: "https://www.lsport.com.br/pages/comunicado-de-incidente-de-seguranca"
cover: "https://covers.duarte.top/covers/20261005-lupo-incidente.jpg"
tags: ["lgpd", "incidente", "varejo", "brasil"]
tipo: incidente
pais: br
notionUrl: "https://www.notion.so/3f017411747381b2aefeef6b028b02ba"
---

En una línea: Lupo confirmó acceso indebido a CPF y datos de pedido y notificó a la ANPD, sin publicar el número de titulares.

## Qué ocurrió

El 2 de octubre de 2026 Lupo S.A. publicó un comunicado (página actualizada en la misma fecha). La empresa dice que, el 23 de septiembre, confirmó accesos no autorizados. Las categorías posiblemente alcanzadas son nombre y CPF, dirección completa, e-mail, teléfono y datos de compra (número de pedido, lugar de entrega, valor, fecha y datos de la factura). Hubo notificación formal a la ANPD, aislamiento de sistemas, cancelación de credenciales y MFA obligatorio. El texto no informa la cantidad de titulares.

## Por qué importa

La comunicación lista categorías, no el mapa registro a registro. Sin ese recorte, el aviso al titular queda genérico y la estafa que cita un pedido real se vuelve más creíble. Un MFA posterior no evidencia lo que ya salió.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Confidencialidad de CPF y pedido | Comunicado de la empresa, 02/10/2026 | Alta |
| Volumen de titulares | No publicado | Indeterminada |
| Uso indebido | La empresa alerta sobre estafas; no confirma uso | Indeterminada |
| Notificación a la ANPD | Declarada en el comunicado | Media |

## Qué hacer esta semana

1. Inventariar sistemas de pedido que guardan CPF junto con la factura — dueño de e-commerce y privacidad.
2. Comprobar si el log de acceso permite recorte por titular, no solo por categoría — dueño de seguridad.
3. Señal: el canal de incidente puede decir cuántos CPF leyó un acceso, sin esperar el comunicado público.
