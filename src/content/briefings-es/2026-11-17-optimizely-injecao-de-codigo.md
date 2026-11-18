---
title: "Script de Optimizely sirve malware a visitantes de 178 organizaciones en un solo día"
description: "Código inyectado en proyectos de Optimizely Web capturó tarjetas y cambió billeteras de cripto en sitios de Zoom, HSBC e IKEA; todavía nadie sabe cómo el atacante obtuvo acceso."
pubDate: 2026-11-17T21:44:00-03:00
sourceName: "Report URI"
sourceUrl: "https://blog.report-uri.com/worlds-largest-brands-infected-with-malware-via-optimizely/"
cover: "https://covers.duarte.top/covers/stg-20261117-optimizely-injecao-de-codigo-2034.jpg"
tipo: incidente
tags: ["supply-chain", "javascript", "skimming", "terceiros", "estados-unidos"]
pais: us
---

**En una línea:** el script de un tercero se ejecuta con acceso a todo lo que el cliente escribe, y casi nunca está en el inventario de datos.

## Qué ocurrió
El 16 de noviembre de 2026, se sirvió código malicioso a visitantes de 178 organizaciones (188 fragmentos infectados) a través de Optimizely Web, según Report URI. El atacante escribió código en el "Project JavaScript" de proyectos de clientes; la CDN de Optimizely entregó el contenido recibido, sin envenenamiento de caché. La primera inyección se observó a las 04:21 UTC; se agregó un skimmer de tarjetas a las 13:43 UTC; la limpieza de todos los archivos concluyó a las 23:11 UTC. El código cambiaba direcciones de billeteras de cripto, capturaba número, vencimiento y CVV de tarjetas en formularios del propio sitio, enviaba cookies no HttpOnly y capturas de pantalla a un servidor del atacante y redirigía iPhones con versiones antiguas de iOS a los kits Coruna y DarkSword. Entre las marcas listadas están Zoom, BBC, CNN, Salesforce, IKEA, Equifax, Air France-KLM y HSBC (incluido el sitio de México), además de dominios de Betsson en Argentina y Colombia. Las billeteras del atacante recibieron cerca de US$ 7 mil. Report URI afirma no saber cómo el atacante obtuvo acceso de escritura a proyectos de clientes sin relación entre sí; Optimizely reconoció el incidente en su página de estado.

## Por qué importa
Los formularios de pago y registro son el punto donde nace el dato personal. Un script de terceros cargado en esa página tiene el mismo alcance que el código de la propia empresa, cambia en cualquier momento y escapa de los controles aplicados a bases de datos y aplicaciones SaaS.

## Lectura de riesgo
| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Inyección en script de terceros (Optimizely Web projectJS) | Cronología y lista de 178 organizaciones publicadas por Report URI | Crítica |
| Captura de tarjetas y cookies en el navegador | Payload analizado por Report URI | Alta |
| Explotación de iOS desactualizado | Kits Coruna y DarkSword identificados en el payload | Alta |
| Vector de acceso al proveedor | Desconocido | Indeterminada |

## Qué hacer esta semana
1. Listar todos los scripts de terceros cargados en las páginas de inicio de sesión, registro y pago, y quién puede modificar cada uno — responsable: ingeniería web con seguridad de aplicaciones.
2. Activar Content Security Policy, al menos en modo report-only, en esas páginas y monitorear cambios en el código servido por terceros — responsable: seguridad de aplicaciones.
3. Señal de que funcionó: un cambio inesperado en un script de terceros genera una alerta en minutos, no en horas.
