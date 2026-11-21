---
title: "SBC Medical Group confirma el robo de datos de 1,6 millones de clientes en Japón"
description: "La administradora de clínicas que cotiza en Nasdaq informó que un tercero extrajo datos de clientes, incluidas contraseñas, de un sistema web de su filial japonesa el 16 de noviembre."
pubDate: 2026-11-21T08:50:00-03:00
sourceName: "SBC Medical Group"
sourceUrl: "https://ir.sbc-holdings.com/sbc-medical-group-reports-cybersecurity-incidents-in-japan/"
cover: "https://covers.duarte.top/covers/20261121-sbc-medical-group-vazamento-0810.jpg"
tipo: incidente
tags: ["sbc-medical", "saude", "vazamento", "retencao", "japao"]
pais: global
---

En una línea: el comunicado trae el mapa por categoría y período que toda notificación debería tener, y revela datos guardados desde 2010.

## Qué ocurrió

SBC Medical Group Holdings (Nasdaq: SBC) informó el 18 de noviembre de 2026 que, el 16 de noviembre, hubo acceso no autorizado a bases de datos de un sistema web gestionado por SBC Medical Group, Ltd., su filial japonesa, y que un tercero accedió a información de clientes y la extrajo. El método de intrusión y el alcance completo siguen bajo investigación. La empresa también registró el caso ante la SEC en un formulario 8-K.

Según el comunicado, se obtuvieron datos básicos de 1.624.000 personas (nombres, sexo, teléfonos, correos electrónicos, contraseñas, direcciones, fechas de nacimiento, números de tarjeta de paciente, ID de miembro y respuestas a encuestas, total o parcialmente), correspondientes al período de 2010 a 2023; 255.416 solicitudes de reserva; 217.769 formularios de contacto; 4.513 registros de seguimiento de tratamiento; y 15.007 reseñas. También se obtuvieron unos 20.000 registros de cuentas de empleados (nombres, ID y contraseñas) y, para 459 empleados, datos bancarios y de seguridad social. La empresa dice no haber confirmado la obtención de historias clínicas electrónicas. Por separado, también el 16 de noviembre, fue notificada de accesos no autorizados a cuentas de administradores de clínicas en la plataforma de reservas de terceros Tribeau.

## Por qué importa

El comunicado muestra lo que necesita una notificación: categorías, tipos de datos, número de personas y período. Al mismo tiempo, expone el costo de la retención: registros de más de una década en un sistema de sitio web ampliaron el alcance del incidente.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
| --- | --- | --- |
| Retención prolongada de datos de clientes | Datos básicos de 2010 a 2023 extraídos | Alta |
| Contraseñas de clientes y empleados | Contraseñas de clientes y unas 20.000 cuentas de empleados obtenidas | Alta |
| Plataforma de reservas de un tercero | Acceso indebido a cuentas de administradores en Tribeau | Media |

## Qué hacer esta semana

1. Listar los sistemas web que guardan datos de clientes de más de cinco años y aplicar la política de retención (responsable: Gobierno de Datos).
2. Verificar si las tablas de contraseñas usan hash robusto y forzar el cambio donde no lo hagan (responsable: Ingeniería).
3. Probar si la empresa puede generar, por base de datos, el mapa de categorías, cantidad de titulares y período (responsable: DPO).
