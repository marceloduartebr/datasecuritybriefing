---
title: "Optimizely confirma inyección de JavaScript malicioso en proyectos de clientes de Web Experimentation"
description: "Una falla en el registro permitió insertar un skimmer de tarjetas y un intercambiador de billeteras cripto en sitios de 178 organizaciones durante cerca de 16 horas."
pubDate: 2026-11-19T17:10:00-03:00
sourceName: "Optimizely"
sourceUrl: "https://status.optimizely.com/incidents/ftw0fh9wx43z"
cover: "https://covers.duarte.top/covers/20261119-optimizely-injecao-javascript-1035.jpg"
tipo: incidente
pais: global
tags: ["cadeia-de-suprimentos", "skimmer", "pagamentos", "javascript"]
---

**En una línea:** la etiqueta de marketing tenía permiso para escribir código en la página de pago, y fue por ahí que entró el ataque.

## Qué ocurrió
Optimizely confirmó en su página de estado que, el 16/11, un tercero no autorizado explotó una falla en el flujo de registro de Web Experimentation para hacerse pasar por usuarios en cuentas objetivo e insertar JavaScript malicioso en proyectos de clientes. La empresa dice que detectó la actividad el mismo día, cerró la falla en un plazo de tres horas, eliminó el código de todos los proyectos y que no hubo filtración de credenciales. El impacto quedó en menos del 5% de los clientes, solo en Web Experimentation. Según el análisis de Scott Helme (Report URI), detallado por StepSecurity el 17/11, el código apareció en 188 de 1.611 snippets verificados, vinculados a 178 organizaciones; bancos y financieras fueron el grupo más grande (32). El payload intercambiaba direcciones de billeteras cripto, capturaba números de tarjeta en formularios de checkout y enviaba capturas de pantalla y cookies. En la mayoría de los sitios, la exposición duró cerca de 16 horas.

## Por qué importa
El código malicioso fue servido por la CDN legítima del proveedor, con su certificado, dentro de un snippet que la empresa cliente ya había aprobado. Ningún control de perímetro de la empresa víctima vio nada diferente.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Falla en el registro del proveedor permitió escribir en proyectos de clientes | Página de estado de Optimizely | Alta |
| Skimmer de tarjetas en formularios de checkout | Análisis de Report URI y StepSecurity | Alta |
| Etiqueta de terceros con acceso a lo que el cliente escribe | 178 organizaciones, 32 del sector financiero | Alta |

## Qué hacer esta semana
1. Revisar el campo Project JavaScript de todos los proyectos de Optimizely Web y los logs desde el 16/11 — equipo web y de seguridad.
2. Quitar las etiquetas de terceros de las páginas de checkout y usar campos de pago alojados por el proveedor en iframe — responsable del e-commerce.
3. Señal de que funcionó: la lista de scripts que se ejecutan en el checkout cabe en una página y cada uno tiene dueño.
