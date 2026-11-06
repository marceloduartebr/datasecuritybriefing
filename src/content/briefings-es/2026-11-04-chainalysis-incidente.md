---
title: "Chainalysis confirma acceso a datos de usuarios por atacante con técnicas agénticas"
description: "El incidente empezó con nombres y correos y llegó a hashes de contraseña y tokens activos de todos los usuarios; autoridades brasileñas usan la plataforma."
pubDate: 2026-11-04T18:18:00-03:00
sourceName: "Chainalysis"
sourceUrl: "https://www.chainalysis.com/blog/security-incident-october-30/"
cover: "https://covers.duarte.top/covers/20261104-chainalysis-incidente.jpg"
tipo: incidente
tags: ["vazamento", "ia", "brasil", "cripto"]
pais: br
slug: chainalysis-incidente
notionUrl: "https://www.notion.so/40e17411747381958c4ed9a234cc3579"
---

> **Actualizado el 6 de noviembre de 2026.** La versión original de este briefing reflejaba el comunicado del 30 de octubre, que hablaba solo de datos no sensibles. El 4 de noviembre Chainalysis informó que se expusieron nombres, nombres de usuario, hashes de contraseña y tokens activos de todos los usuarios. El texto fue revisado con las actualizaciones de la empresa.

**En una línea:** Lo que empezó como "nombres y correos" pasó a ser hashes de contraseña y tokens activos de todos los usuarios de Chainalysis, con productos y login fuera de línea; autoridades brasileñas dependen de la herramienta.

## Qué ocurrió

El 30 de octubre de 2026 Chainalysis publicó que detectó acceso no autorizado a sistemas y herramientas internas por un actor externo usando técnicas agénticas ofensivas. En ese comunicado, la empresa mencionaba solo datos no sensibles (IDs, nombres, correos y etiquetas de rol) y decía no tener evidencia de acceso a credenciales ni a tokens de sesión. El 2 de noviembre retiró Reactor y Data Solutions de operación por precaución.

El 4 de noviembre el panorama cambió. Por la mañana, la empresa informó un ataque on-path que expuso contraseñas de una parte de los clientes y bloqueó las cuentas afectadas. Por la noche, informó que se expusieron nombres, nombres de usuario, hashes de contraseña y tokens activos de todos los usuarios de Chainalysis, y desconectó KYT, los demás productos de screening de direcciones y la página de login. La empresa dice no tener evidencia de acceso a datos de investigación ni de manipulación de datos de atribución. El 6 de noviembre empezó a restablecer KYT y Address Screening por fases, exigiendo IPs de confianza, cambio de contraseña y rotación de claves de API; Reactor y Data Solutions seguían fuera de línea.

Ministerios Públicos brasileños (RJ, SP, BA, SC y otros) poseen licencias y entrenamientos en la plataforma.

## Por qué importa

La primera versión de un incidente rara vez es la final. En seis días, el alcance pasó de datos de contacto de clientes a credenciales de toda la base, y el mensaje "no hay evidencia de acceso a tokens" fue reemplazado por tokens activos expuestos. Quien tomó decisiones con base en el primer comunicado necesita revisarlas. Una herramienta de investigación usada por autoridad pública lleva la identidad y el acceso de los propios investigadores y operadores.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Hashes de contraseña y tokens activos de todos los usuarios | Actualización de la empresa del 4 de noviembre | Alta |
| Indisponibilidad de KYT, screening de direcciones, Reactor y login | Actualizaciones del 2, 4 y 6 de noviembre | Alta |
| Impacto en autoridades brasileñas | Uso documentado por MPs | Indeterminada |

## Qué hacer esta semana

1. Cambiar las contraseñas y rotar las claves de API de todas las cuentas en Chainalysis, y revocar integraciones que usen esos tokens — responsable: equipo de identidad.
2. Verificar si la misma contraseña se usaba en otros sistemas y forzar el cambio donde haya reutilización — responsable: seguridad.
3. Revisar decisiones y controles tomados con base en el comunicado del 30 de octubre y seguir las próximas actualizaciones de la empresa — responsable: CS / compliance.
