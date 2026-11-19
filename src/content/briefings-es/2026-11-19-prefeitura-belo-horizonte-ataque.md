---
title: "La Alcaldía de Belo Horizonte confirma un ataque al sistema de guías y pide reemitir boletos"
description: "Dos días de guías de tributos bajo sospecha; la alcaldía envió a los bancos la lista de documentos afectados, pero aún no dice cuántos son."
pubDate: 2026-11-19T08:33:00-03:00
sourceName: "Diário do Comércio"
sourceUrl: "https://diariodocomercio.com.br/economia/pbh-ataque-hacker/"
cover: "https://covers.duarte.top/covers/20261119-prefeitura-belo-horizonte-ataque-0803.jpg"
tipo: incidente
pais: br
tags: ["ataque-cibernetico", "setor-publico", "pix", "brasil"]
---

**En una línea:** cuando el atacante altera el documento de cobro, la pregunta deja de ser "¿se filtró?" y pasa a ser "¿qué registros salieron adulterados y para quién?".

## Qué ocurrió
El 16 de noviembre de 2026, la Alcaldía de Belo Horizonte confirmó que el sistema de emisión de guías de pago de tributos sufrió un ciberataque, después de haber informado inicialmente solo una falla. Las guías emitidas entre la madrugada del sábado (14) y la mañana del lunes (16) no deben pagarse y deben reemitirse por el Portal de Servicios o por la app BH SIM. Los pagos por Pix pueden haberse visto afectados: si el receptor no es el Municipio, el contribuyente debe contactar a su banco y solicitar el Mecanismo Especial de Devolución (MED). El código de barras y el débito automático no se vieron afectados. La alcaldía acudió a la policía, envió a las instituciones financieras la lista de las guías afectadas y prorrogó el vencimiento hasta el 19 de noviembre. El sistema fue restablecido.

## Por qué importa
El ataque afectó la integridad de un documento oficial de cobro, no solo la confidencialidad de los datos. La respuesta solo fue posible porque la alcaldía pudo delimitar la ventana e identificar las guías emitidas en ella. Aún no hay cifra de guías afectadas ni información sobre exposición de datos personales.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Adulteración de guías con Pix | Orientación de la alcaldía sobre receptor distinto y MED | Alta |
| Exposición de datos de contribuyentes | No informada hasta el momento | Por confirmar |
| Comunicación inicial como "falla" | Confirmación del ataque el mismo día | Media |

## Qué hacer esta semana
1. Mapear qué sistemas generan documentos de pago para clientes y qué datos personales incluyen — responsable: arquitectura de datos.
2. Garantizar una pista de auditoría que permita listar, por ventana de tiempo, cada documento emitido y su destinatario — responsable: seguridad y TI.
3. Señal de que funcionó: en un ejercicio, el equipo produce en menos de una hora la lista de registros emitidos en una ventana de 48 horas.
