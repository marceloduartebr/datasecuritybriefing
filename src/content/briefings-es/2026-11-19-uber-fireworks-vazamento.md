---
title: "Uber notifica a 149 mil conductores: la alerta activada no vio la credencial legítima del proveedor de IA"
description: "Datos de licencias de conducir salieron por la intrusión en Fireworks AI, y las alertas de Uber no se dispararon porque el acceso usó credenciales del propio proveedor."
pubDate: 2026-11-19T08:33:00-03:00
sourceName: "TechCrunch"
sourceUrl: "https://techcrunch.com/2026/11/16/uber-confirms-hackers-stole-thousands-of-drivers-license-information-in-data-breach/"
cover: "https://covers.duarte.top/covers/20261118-uber-fireworks-vazamento-1645.jpg"
tipo: incidente
pais: us
tags: ["vazamento", "terceiros", "inteligencia-artificial", "estados-unidos"]
---

**En una línea:** el eslabón débil no fue Uber ni el monitoreo: fue el volumen de datos personales que estaba en un proveedor de inferencia de IA.

## Qué ocurrió
Uber está notificando a 149.346 personas, según el registro enviado al fiscal general de Oregón, sobre el robo de nombres, direcciones, fechas de nacimiento y números de licencia de conducir en la intrusión en Fireworks AI, proveedora de inferencia de modelos de IA. Según TechCrunch (reportaje publicado el 13/11 y actualizado el 16/11), Fireworks avisó a Uber el 9/10 de que los atacantes robaron credenciales internas usadas para acceder a los datos. Un registro en Iowa menciona imágenes de las licencias y el texto extraído de ellas. También hubo notificaciones en California, Illinois, Massachusetts, Rhode Island, Carolina del Sur, Texas y Vermont. Uber dijo que tenía alertas para accesos no autorizados al entorno de Fireworks, pero que ninguna se disparó, porque el acceso usó credenciales internas del proveedor. Notion y Cursor confirmaron datos sustraídos en el mismo ataque.

## Por qué importa
El caso es la continuación del incidente de Fireworks ya reportado por Notion. Ahora con otro tipo de dato: un documento de identidad, que no se cambia como una contraseña. Y con un detalle operativo: el monitoreo existía y no sirvió, porque la sesión parecía legítima.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Credenciales internas del proveedor robadas | Fireworks avisó a Uber el 9/10 | Alta |
| Datos de identidad en proveedor de inferencia | Imágenes y números de licencias de conducir | Alta |
| Monitoreo ciego ante acceso con credencial válida | "Ninguna alerta se disparó", según Uber | Media |

## Qué hacer esta semana
1. Listar qué proveedores de IA reciben datos personales, de qué tipo y con qué retención — DPO y arquitectura de datos.
2. Quitar de los flujos de IA los campos que no son necesarios para el caso de uso (documentos, números de identificación) — responsable del producto e ingeniería.
3. Señal de que funcionó: para cada proveedor de IA, la empresa responde en minutos qué registros personales están allí hoy.
