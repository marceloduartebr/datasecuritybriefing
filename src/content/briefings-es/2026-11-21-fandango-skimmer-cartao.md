---
title: "Fandango confirma un skimmer en el checkout que capturó datos de tarjetas"
description: "El código estuvo activo cuatro días; entender quién se vio afectado llevó semanas."
pubDate: 2026-11-21T08:50:00-03:00
sourceName: "BleepingComputer"
sourceUrl: "https://www.bleepingcomputer.com/news/security/fandango-says-hackers-stole-payment-card-details-from-checkout-pages/"
cover: "https://covers.duarte.top/covers/20261119-fandango-skimmer-cartao-0803.jpg"
tipo: incidente
tags: ["skimming", "cartao-de-credito", "ecommerce", "estados-unidos"]
pais: us
---

**En una línea:** en los ataques de skimming, el tiempo de detección importa menos que el tiempo para vincular la ventana del ataque con cada cliente afectado.

## Qué ocurrió
Fandango Media empezó a notificar a sus clientes que un código de skimming inyectado en la página de checkout de su sitio oficial interceptó datos de pago entre el 8 y el 11 de octubre de 2026. La notificación, divulgada por BleepingComputer el 16 de noviembre, enumera número de tarjeta, CVV, fecha de vencimiento, código postal de facturación y correo electrónico. La empresa dice que no se expusieron nombres, documentos de identidad ni números de Social Security. Fandango concluyó el 30 de octubre que los datos de clientes podían haberse visto afectados, corrigió la página con apoyo de especialistas externos, no divulgó el número de afectados y ofrece dos años de monitoreo de crédito e identidad.

## Por qué importa
Los datos completos de tarjeta, incluido el CVV, permiten fraude inmediato en compras en línea. El intervalo entre la ventana del ataque y la notificación muestra que el cuello de botella fue delimitar quién estaba expuesto.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Código inyectado en el checkout | Notificación de Fandango | Alta |
| Exposición de tarjeta con CVV | Lista de datos en la notificación | Alta |
| Número de afectados no divulgado | Sin respuesta de la empresa | Media |

## Qué hacer esta semana
1. Inventariar todos los scripts cargados en las páginas de pago y monitorear cambios — responsable: seguridad de aplicaciones.
2. Garantizar que sea posible listar, por ventana de tiempo, las transacciones y los clientes que pasaron por el checkout — responsable: ingeniería de pagos.
3. Señal de que funcionó: un cambio en un script de pago genera una alerta el mismo día y la lista de clientes de la ventana sale en horas.
