---
title: "3corações: acceso no autorizado en el e-commerce Mercafé"
description: "El DPO de 3corações avisó a clientes de Mercafé sobre acceso a nombre, CPF, teléfono y pedido entre el 17 y el 25 de septiembre."
pubDate: 2026-10-13T10:52:00-03:00
sourceName: "Grupo 3corações (comunicado do DPO)"
sourceUrl: "https://view.m.mercafe.com.br/?vawpToken=2D34GUOZOJJU5GHNNKSD5WQQMQ.100224"
cover: "https://covers.duarte.top/covers/20261013-3coracoes-incidente.jpg"
tipo: incidente
pais: br
tags: ["incidente", "ecommerce", "lgpd", "phishing"]
notionUrl: "https://www.notion.so/3f817411747381049fbfdbc08b1ff945"
---

En una línea: 3corações comunicó a clientes de Mercafé sobre acceso no autorizado a nombre, CPF, teléfono y pedido, y ya observa phishing en nombre de la marca.

## Qué ocurrió

El encargado de datos del Grupo 3corações, Felipe Holanda Ribeiro, envió comunicado individual a clientes del e-commerce Mercafé. El texto describe acceso no autorizado al ambiente de la tienda, operado en proveedor de nube de terceros, por solicitudes anómalas entre el 17 y el 25 de septiembre de 2026. La empresa dice que el incidente quedó restringido a ese ambiente.

Los datos que pueden haber sido accedidos son nombre completo, CPF, teléfono celular y detalles y estado del pedido. El comunicado afirma que contraseñas, tarjeta de crédito y otras informaciones financieras no fueron expuestas. No informa el número de titulares ni registra, en el texto al cliente, la comunicación a la ANPD.

La contención descrita: inactivación de la clave de acceso comprometida el 25 de septiembre, bloqueo de URLs maliciosas y contratación de empresa de inteligencia para barrido e investigación. El DPO alerta sobre campañas activas de phishing por SMS que simulan promociones de la marca. Contacto: privacidade@3coracoes.com.br. Hasta el 13 de octubre no hay cobertura en la prensa.

## Por qué importa

El riesgo inmediato es el par CPF + teléfono + pedido, no la tarjeta. Eso alimenta fraude registral e ingeniería social, y la propia empresa ya observa SMS en nombre de la marca. El ambiente es de tercero en nube: la evidencia útil es la clave comprometida y el alcance del proveedor, no solo la narrativa de contención.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Acceso a nombre, CPF, teléfono y pedido | Comunicado del DPO | Alta |
| Contraseña, tarjeta, dato financiero | Empresa afirma que no fueron expuestos | Baja, según el controlador |
| Phishing en nombre de la marca | DPO relata campañas activas por SMS | Alta |
| Volumen de titulares | No informado | Indeterminada |
| Comunicación a la ANPD | No consta en el texto al cliente | Indeterminada |

## Qué hacer esta semana

1. Tratar SMS y WhatsApp en nombre de 3corações como canal de golpe, no como soporte.
2. Pedir, si es titular, qué exactamente fue accedido y si la ANPD fue comunicada.
3. Registrar que la fuente es el comunicado del controlador, aún sin cobertura independiente.
