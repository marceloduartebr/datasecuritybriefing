---
title: "Khipu confirma un intento de ataque y pide a los comercios renovar API keys posiblemente expuestas"
description: "La fintech chilena afirmó haber detectado y controlado, el 16 de noviembre, un intento de ataque informático, sin fuga de datos personales, y pidió a los comercios renovar las API keys que pudieron quedar expuestas."
pubDate: 2026-11-20T17:10:00-03:00
sourceName: "La Tercera"
sourceUrl: "https://www.latercera.com/pulso/noticia/fintech-khipu-reporta-ciberataque-y-pide-a-comercios-cambiar-claves/"
cover: "https://covers.duarte.top/covers/20261120-khipu-tentativa-ataque-api-keys-0813.jpg"
tipo: incidente
tags: ["ciberseguranca", "pagamentos", "chile", "cadeiadesuprimentos", "apikeys"]
pais: cl
---

En una línea: Khipu dijo haber contenido, el 16 de noviembre, un intento de ataque informático, reportó el caso a la ANCI, afirmó que no hubo fuga de datos personales y pidió a los comercios renovar las API keys que pudieron haber quedado expuestas.

## Qué ocurrió

El 18 de noviembre de 2026 La Tercera publicó el contenido de un comunicado de la fintech chilena de pagos instantáneos Khipu. La empresa afirmó que, el lunes (16 de noviembre), detectó y controló un intento de ataque informático contra sus servicios. Como medida preventiva, pidió a los comercios cuyas API keys pudieron quedar expuestas que las renueven dentro de un plazo.

Según el comunicado, el episodio no provocó daño patrimonial ni fuga de datos personales o de información. Khipu dijo haber reportado el incidente de inmediato a la Agencia Nacional de Ciberseguridad (ANCI) y mantenerse en contacto con la autoridad. La compañía justificó no rotar de inmediato todas las API keys de los comercios porque, con esas claves, solo es posible crear solicitudes de pago para comercios legítimamente habilitados, y afirmó que el esfuerzo del atacante no alcanzó sus objetivos.

La empresa declaró haber rotado “todos nuestros secretos” (credenciales internas) y reemplazado cerca de 150 servicios de los que depende la operación, sin quedar fuera de servicio “ni un minuto”. No precisó cuántos comercios fueron notificados, cuál es el plazo otorgado ni de qué manera el atacante obtuvo el acceso inicial. También afirmó que el atacante fracasó en su intento de obtener dinero.

## Por qué importa

Una API key de comercio no es un dato de registro de clientes, pero sí un atajo operativo: sirve para crear cobros dentro del perímetro de los comercios ya habilitados. Khipu describe contención, rotación interna y ausencia de fuga de datos personales, y aun así pide la renovación de las claves que pudieron quedar expuestas. Sin el número de comercios avisados, el alcance de ese recorte sigue siendo interno.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
| --- | --- | --- |
| Intento de ataque detectado y controlado el 16/11 | Comunicado de Khipu, informado por La Tercera | Alta |
| API keys de comercios posiblemente expuestas | Solicitud oficial de renovación, plazo no divulgado | Alta |
| Fuga de datos personales y daño patrimonial | La empresa afirma que no ocurrió | Media |
| Rotación de secretos internos y cerca de 150 servicios | Comunicado de Khipu | Media |
| Comunicación a la ANCI | Comunicado de Khipu | Media |

## Qué hacer esta semana

1. Tesorería y pagos: verificar si la empresa o algún comercio del grupo usa Khipu y, en caso afirmativo, rotar las API keys y revisar las solicitudes de pago creadas a partir del 16 de noviembre. Responsable: pagos / tesorería.
2. Seguridad y terceros: registrar el incidente en el inventario de proveedores de pago y pedir evidencia del alcance (qué claves, qué plazo, qué acceso inicial). Responsable: seguridad de la información / gestión de terceros.
3. Monitoreo de fraude: seguir los cobros atípicos a nombre de comercios habilitados hasta que concluya la rotación de las claves. Responsable: antifraude / operaciones.
