---
title: "Belo Horizonte confirma ataque al sistema de boletas de pago y ordena reemitir cobros de dos días"
description: "Las boletas emitidas entre el 14 y el 16 de noviembre no deben pagarse; la alcaldía envió a los bancos la lista de los documentos afectados."
pubDate: 2026-11-17T21:42:00-03:00
sourceName: "CNN Brasil"
sourceUrl: "https://www.cnnbrasil.com.br/nacional/sudeste/mg/prefeitura-de-bh-confirma-ataque-cibernetico-a-sistema-de-emissao-de-guias/"
cover: "https://covers.duarte.top/covers/stg-20261117-prefeitura-de-belo-horizonte-ataque-2034.jpg"
tipo: incidente
tags: ["ataque-cibernetico", "setor-publico", "pix", "integridade", "brasil"]
pais: br
---

**En una línea:** cuando el ataque afecta la integridad de documentos de cobro, la respuesta depende de saber exactamente qué registros salieron del sistema durante la ventana del incidente.

## Qué ocurrió
El 16 de noviembre de 2026, la Alcaldía de Belo Horizonte confirmó que el sistema municipal de emisión de boletas de pago fue blanco de un ataque cibernético. Las boletas generadas entre la madrugada del sábado (14) y la mañana del lunes (16) no deben pagarse; el contribuyente debe emitir una nueva boleta por el Portal de Servicios o por la aplicación BH SIM. Los vencimientos se prorrogaron hasta el jueves (19). Según la alcaldía, los pagos por código de barras y débito automático no se vieron afectados. Quien pagó vía Pix debe verificar si el beneficiario es el Municipio de Belo Horizonte y, si no lo es, acudir al banco y solicitar el Mecanismo Especial de Devolución (MED). Se dio aviso a la policía y las instituciones financieras recibieron la lista de las boletas afectadas. El servicio fue restablecido. La alcaldía no divulgó el número de boletas ni de contribuyentes afectados.

## Por qué importa
Las boletas de tributos contienen nombre, documento y datos de pago del contribuyente y circulan fuera del sistema que las generó. Un ataque a la integridad de ese flujo convierte un servicio público confiable en un vector de fraude, y el efecto continúa después de que el sistema vuelve a estar en línea.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Compromiso del sistema de emisión de boletas | Confirmado por la alcaldía el 16/11 | Alta |
| Pago vía Pix a un beneficiario indebido | La alcaldía orienta verificar el beneficiario y usar el MED | Alta |
| Escala de contribuyentes afectados | No divulgada | Indeterminada |

## Qué hacer esta semana
1. Mapear todos los sistemas que generan documentos de cobro (boleta, Pix, factura) y confirmar que cada emisión queda registrada con horario, destinatario y dato de pago — responsable: arquitectura de datos.
2. Definir el procedimiento para generar, en horas, la lista de documentos emitidos en una ventana de incidente y enviarla a bancos y clientes — responsable: respuesta a incidentes junto con el área jurídica.
3. Señal de que funcionó: un ejercicio de mesa en el que la lista de una ventana de 48 horas sale completa en menos de un día.
