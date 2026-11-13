---
title: "Tesoro Nacional confirma acceso no autorizado a 30 mil registros y 4 mil claves Pix"
description: "Acceso detectado el 4 de noviembre expuso nombres, CPFs y correos del e-Serviços y claves Pix de beneficiarios de pagos federales; comunicado el 12/11, sin impacto financiero."
pubDate: 2026-11-13T10:18:00-03:00
sourceName: "Agência Brasil"
sourceUrl: "https://agenciabrasil.ebc.com.br/geral/noticia/2026-11/tesouro-nacional-identifica-vazamento-de-dados-de-30-mil-cadastros"
cover: "https://covers.duarte.top/covers/20261113-tesouro-nacional-incidente.jpg"
tipo: incidente
tags: ["vazamento", "governo", "pix", "lgpd", "brasil"]
pais: br
notionUrl: "https://www.notion.so/41717411747381989141d24de162b050"
---

En una línea: El Tesoro Nacional detectó acceso no autorizado a 30 mil registros y 4 mil claves Pix de beneficiarios de pagos federales y solo comunicó públicamente ocho días después.

## Qué ocurrió

El 4 de noviembre de 2026 la Secretaría del Tesoro Nacional identificó acceso no autorizado a datos personales en su entorno tecnológico. El caso fue comunicado públicamente la noche del 12 de noviembre. Se accedieron nombres, CPFs y direcciones de correo de aproximadamente 30 mil usuarios del portal e-Serviços. Una base de consultas analíticas internas también fue afectada, exponiendo cerca de 4 mil claves Pix de beneficiarios de pagos del gobierno federal y datos relacionados con las transacciones. El órgano notificó a la ANPD y al CTIR Gov. No hubo impacto financiero y ningún sistema estructurante fue comprometido. La contención ocurrió mediante mecanismos de monitoreo; la investigación técnica sobre origen y extensión está en curso.

## Por qué importa

El intervalo entre detección y comunicación pública muestra el tiempo necesario para confirmar el hecho, contener y comenzar a inventariar lo que salió. Notificar al titular y a la autoridad con precisión exige mapa registro a registro: qué identidades, de qué bases, con qué solapamiento. Una clave Pix de beneficiario de pago federal no es un dato cadastral genérico: vincula a la persona a una transferencia ya realizada. Sin ese inventario, la respuesta queda en el nivel de la política y no llega a la evidencia de quién necesita ser alertado.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Acceso a base de registros (e-Serviços) | ~30 mil nombres, CPFs y correos | Alta |
| Acceso a base analítica con claves Pix | ~4 mil claves y datos de pagos federales | Alta |
| Tiempo de comunicación pública | 8 días después de la detección | Media |
| Impacto financiero / sistemas estructurantes | Negado por el órgano | Indeterminada |

## Qué hacer esta semana

1. Confirmar si el inventario de datos personales y de claves de pago cubre las bases del portal de servicios y de consultas analíticas internas — DPO / equipo de datos.
2. Probar el tiempo entre detección de acceso anómalo y la lista de identidades alcanzadas — SOC / respuesta a incidentes.
3. Validar si el proceso de notificación a la ANPD y a los titulares tiene el mapa registro a registro listo en menos de 48 horas — Gobernanza.
