---
title: "TheHatman: 3,64 millones de registros Azure sin zero-day"
description: "Password spray y fatiga de MFA. Se citan empresas Fortune 500; parte de ellas clasifica los datos como antiguos o poco sensibles."
pubDate: 2026-08-26T08:42:00-03:00
sourceName: "BleepingComputer"
cover: "https://covers.duarte.top/covers/20260826-azure-thehatman.jpg"
sourceUrl: "https://www.bleepingcomputer.com/news/security/hacker-claims-36-million-azure-account-records-stolen-from-major-companies/"
tags: ["vazamento", "azure", "identidade"]
notionUrl: "https://www.notion.so/3c717411747381379cabce5730d4212e"
---

**En una línea:** el método no es sofisticado; el alcance del token sí lo es.

## Qué ocurrió

Desde el 31 de julio, el agente “TheHatman” anuncia la venta de bases hurtadas de tenants Microsoft Azure. La cobertura cita McDonald's, Vodafone, TCS, HCL Technologies, Kyndryl y Gap Inc., sumando más de 3,6 millones de registros de empleados — nombres, correos, cargos, teléfonos e IDs corporativos. El vector descrito es password spray combinado con fatiga de MFA. Parte de las empresas citadas afirmó que los datos serían antiguos o poco sensibles.

Una reivindicación de venta no es un dictamen de la víctima.

## Por qué importa

No hubo zero-day. Hubo persistencia hasta que alguien aprobó un push de MFA en piloto automático. “Tenemos MFA” no es la misma frase que “sabemos qué alcanza ese acceso”.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Password spray + fatiga de MFA | Cobertura BleepingComputer | Alta |
| Volumen reivindicado | 3,64 millones / Fortune 500 citadas | Alta |
| Confirmación corporativa | Parcial / contestación | Indeterminada |

## Qué hacer esta semana

1. Revisar la política de número de pushes de MFA y alertas de password spray en Entra/Azure AD — dueño: identidad.
2. Para cada app en el tenant, documentar el dato que un token de usuario lee.
3. Señal de que funcionó: un acceso comprometido genera lista de sistemas y tipos de dato, no un “estamos investigando”.
