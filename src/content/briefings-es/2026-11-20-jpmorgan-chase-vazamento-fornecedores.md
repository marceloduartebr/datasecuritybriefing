---
title: "Chase, Visa y Mastercard confirman filtración de datos de clientes a través de proveedores"
description: "Datos de marketing guardados por terceros expusieron a clientes de tres gigantes financieros, y ninguno de ellos dijo qué proveedores fueron afectados."
pubDate: 2026-11-20T12:51:00-03:00
sourceName: "The Register"
sourceUrl: "https://theregister.com/security/2026/11/19/chase-visa-mastercard-confirm-third-party-cyberattacks-that-may-have-exposed-customers-info/5311175"
cover: "https://covers.duarte.top/covers/20261120-jpmorgan-chase-vazamento-fornecedores-0813.jpg"
tipo: incidente
tags: ["vazamento", "terceiros", "servicos-financeiros", "estados-unidos"]
pais: us
---

**En una línea:** el dato de cliente más expuesto no siempre está en el core; está en la copia que marketing entregó a un proveedor.

## Qué ocurrió
El 19 de noviembre de 2026, JPMorgan Chase, Visa y Mastercard confirmaron que investigan incidentes en proveedores externos que pueden involucrar información de clientes. El grupo de extorsión n0n había publicado a las tres empresas en su sitio de filtraciones el 16 de noviembre. Chase dijo que los atacantes accedieron a datos de marketing mantenidos por proveedores, que pueden incluir nombres y correos electrónicos de clientes, y que el caso no tiene relación con las inestabilidades de la semana. Visa atribuyó el incidente a un proveedor en Asia-Pacífico y afirmó que ningún dato de pago, como el número de tarjeta, fue afectado. Mastercard habló de un número limitado de correos electrónicos de un subconjunto de titulares inscritos en un programa de beneficios. Según un análisis de Reuters, los archivos vinculados al banco contienen más de 16 mil correos electrónicos de clientes, algunos con teléfono y código postal. Ninguna de las empresas nombró a los proveedores, dijo cuándo ocurrieron los accesos ni detalló qué se llevaron.

## Por qué importa
Las bases de marketing salen del perímetro con frecuencia: agencias, plataformas de campañas y herramientas de engagement reciben copias de datos de clientes con controles más débiles que los del sistema principal. Nombre, correo electrónico e historial de campañas de clientes de altos ingresos son materia prima para phishing dirigido. Y, sin saber qué campos estaban con qué proveedor, la empresa no puede dimensionar ni notificar con precisión.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Proveedor de marketing con copia de la base de clientes | Confirmación de Chase, Visa y Mastercard | Alta |
| Phishing dirigido a clientes expuestos | Correos, teléfonos y datos de campañas en los archivos publicados | Media |
| Alcance desconocido (proveedores y fechas no divulgados) | Ninguna de las empresas dio detalles | Media |

## Qué hacer esta semana
1. Listar todos los proveedores de marketing y engagement que reciben datos de clientes y los campos enviados a cada uno — responsable: privacidad/DPO con marketing.
2. Revisar contratos y accesos de esos proveedores: retención, copias, eliminación al final de la campaña y obligación de notificar — responsable: compras y seguridad.
3. Señal de que funcionó: para cualquier proveedor de la lista, la empresa responde en horas qué clientes y qué campos tiene.
