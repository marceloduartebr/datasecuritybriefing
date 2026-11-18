---
title: "Banco do Brasil notifica a clientes tras un acceso no autorizado con credencial válida"
description: "BB identificó el 12 de noviembre el uso indebido de una credencial válida y avisó a clientes sobre la exposición de nombre, CPF, correo electrónico, agencia y, en algunos casos, número de cuenta."
pubDate: 2026-11-18T18:10:00-03:00
sourceName: "g1"
sourceUrl: "https://g1.globo.com/tecnologia/noticia/2026/11/18/banco-do-brasil-dados.ghtml"
cover: "https://covers.duarte.top/covers/20261118-bb-credencial-valida-1759.jpg"
tipo: incidente
pais: br
tags: ["banco-do-brasil", "credencial-valida", "lgpd", "vazamento"]
---

En una línea: el banco afirma que no hubo intrusión en sus sistemas, pero una credencial válida bastó para alcanzar datos de registro de clientes.

## Qué ocurrió

El 18 de noviembre de 2026, Banco do Brasil informó, en un comunicado a clientes y en una nota a la prensa, que identificó el 12 de noviembre un acceso no autorizado a datos personales. Según g1 y Valor Econômico, los datos expuestos pueden incluir nombre, CPF, dirección de correo electrónico, número de agencia y, en algunos casos, número de cuenta. El banco afirmó que no hubo intrusión en sus sistemas, ni exposición de contraseñas, tokens o códigos de seguridad, y que no se identificaron transacciones financieras derivadas del incidente. Las investigaciones, según el comunicado, indican el uso indebido, por parte de terceros, de una credencial válida, ya revocada. Valor registró que el banco no revela el número de usuarios afectados y que el aviso se envió a una parte de la base de clientes. La institución dijo haber activado protocolos de seguridad y las comunicaciones previstas en la LGPD, y señaló como riesgo principal los fraudes, el phishing y la ingeniería social.

## Por qué importa

La frase “no hubo intrusión” describe el perímetro, no el alcance del dato. Una credencial válida no dispara la alarma de intrusión y aun así lee el registro. Sin un número público de afectados, el aviso existe, pero el inventario de lo que se leyó sigue siendo interno.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Uso indebido de credencial válida | Comunicado de BB citado por g1 y Valor | Alta |
| Exposición de CPF, correo, agencia y, en algunos casos, cuenta | Comunicado a los clientes, 18/11 | Alta |
| Número de afectados no informado | Valor Econômico, 18/11 | Media |

## Qué hacer esta semana

1. Revisar qué credenciales de empleados, socios y sistemas leen el registro de clientes y revocar las que no tengan dueño y necesidad actuales (responsable: CISO).
2. Verificar si existe registro de qué volumen y tipo de dato accedió cada credencial entre la detección y la revocación (responsable: equipo de seguridad de datos).
3. Preparar una orientación clara a los clientes sobre phishing, con un canal oficial de denuncia, sin pedir contraseña ni código (responsable: DPO / atención al cliente).
