---
title: "RedScanner usó agentes de IA como fuerza de trabajo en Brasil"
description: "ZenoX documentó la operación Open Ledger, que comprometió al menos 40 instituciones y extrajo 1,57 millones de registros de tarjetas."
pubDate: 2026-11-17T16:06:00-03:00
sourceName: "Estadão / TecMundo"
sourceUrl: "https://www.estadao.com.br/tecmundo/ciberseguranca/open-ledger-operacao-criminosa-atinge-mais-de-40-instituicoes-financeiras-no-brasil/"
cover: "https://covers.duarte.top/covers/20261116-zenox-redscanner-shadow-ai-brasil.jpg"
tipo: noticia
tags: ["shadow-ai", "dspm", "brasil", "incidente"]
pais: br
---

En una línea: un agente comercial de IA con presupuesto propio se convirtió en la fuerza de trabajo que extrajo datos de pago y CPF.

## Qué ocurrió

Un informe de ZenoX publicado el 4 de noviembre de 2026 describe la operación Open Ledger del grupo RedScanner. Cinco operadores humanos usaron agentes de IA comerciales como fuerza de trabajo principal contra al menos 40 instituciones financieras y organismos públicos en Brasil. El hallazgo provino de un servidor con el listado de directorios abierto. Se recuperaron 7.213 archivos. En una víctima, 1.575.270 registros de tarjetas con CVV; en otras, 580 mil CPF y cerca de 1,34 millones de registros financieros.

## Por qué importa

El inventario de identidades no humanas no captura al agente que ya tiene una sesión activa y presupuesto propio. Una política escrita sobre shadow AI no genera evidencia de lo que procesó el proveedor de inferencia.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Agente de IA como fuerza de trabajo | Informe de ZenoX + 7.213 archivos | Alta |
| Extracción de datos PCI y CPF | Cifras específicas en el informe | Alta |
| Servidor expuesto del propio grupo | Descubrimiento de la operación | Media |

## Qué hacer esta semana

1. Mapear los agentes de IA y los proveedores de inferencia con sesión en sistemas de producción — responsable: identidad.
2. Revisar los registros de acceso de identidades no humanas de los últimos 30 días — responsable: SOC.
3. Confirmar si los datos de pago y CPF tienen evidencia de acceso reciente por cuentas automatizadas — responsable: DPO / seguridad.
