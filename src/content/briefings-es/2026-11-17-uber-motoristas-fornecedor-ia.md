---
title: "Uber es la tercera víctima conocida de la intrusión en el proveedor de IA Fireworks"
description: "Las credenciales de un proveedor abrieron la cuenta de Uber en ese proveedor y expusieron datos de 149 mil conductores."
pubDate: 2026-11-17T16:07:00-03:00
sourceName: "BleepingComputer"
sourceUrl: "https://www.bleepingcomputer.com/news/security/uber-notifies-drivers-of-data-breach-affecting-nearly-150-000-people/"
cover: "https://covers.duarte.top/covers/stg-20261117-uber-motoristas-fornecedor-ia-0840.jpg"
tipo: incidente
tags: ["vazamento", "terceiros", "inteligencia-artificial", "uber"]
pais: us
---

**En una línea:** integrar datos con una plataforma de IA de terceros traslada el control a las credenciales de quien opera esa plataforma.

## Qué ocurrió

Uber empezó el 10 de noviembre de 2026 a notificar a conductores sobre una filtración que afectó a 149.346 personas, según el registro ante la Fiscalía General de Maine. Un atacante comprometió credenciales internas de un proveedor de servicios y las usó para acceder a la cuenta de Uber en ese proveedor. Quedaron expuestos nombres, números de licencia de conducir, fechas de nacimiento y direcciones.

El proveedor avisó a Uber el 9 de octubre. La empresa cortó las conexiones de datos con el proveedor y concluyó el 13 de octubre que hubo acceso a datos vinculados a él. Uber no nombró al proveedor; BleepingComputer, citando a TechCrunch, identifica a Fireworks, empresa de infraestructura de IA. Fireworks atribuyó el ataque a un grupo con motivación financiera vinculado a ataques de LLMjacking; el mismo incidente afectó a Cursor y a Notion.

## Por qué importa

Es el mismo incidente que llevó a Notion a confirmar la exposición de transcripciones de Notion AI. Tres empresas conocidas fueron afectadas por una sola credencial comprometida en un proveedor de IA. Los datos expuestos de los conductores son permanentes: el número de licencia y la fecha de nacimiento no se cambian como una contraseña.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Credenciales internas del proveedor | El atacante usó credenciales del proveedor para entrar en la cuenta de Uber | Alta |
| Datos de identificación permanentes | Licencia, fecha de nacimiento y dirección expuestas | Alta |
| Concentración en un proveedor de IA | El mismo incidente afectó a Uber, Cursor y Notion | Alta |

## Qué hacer esta semana

1. Listar las integraciones con plataformas de IA de terceros y qué conjuntos de datos personales alcanza cada una — responsable: arquitectura y encargado de datos.
2. Reducir el alcance de cada integración al mínimo necesario y exigir al proveedor evidencia de control de acceso a las cuentas de clientes — responsable: gestión de terceros.
3. Señal de que funcionó: ante el aviso de un proveedor, la empresa sabe en horas qué datos estaban conectados a él.
