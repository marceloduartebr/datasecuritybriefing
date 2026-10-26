---
title: "ConnectWise: credencial de Cloud Backup abre tenants Microsoft 365"
description: "Una identidad de vendor comprometida permitió sign-ins en 162 tenants M365 el 15 de octubre de 2026."
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/connectwise-suspends-cloud-services-in-response-to-cyberattack/"
tipo: incidente
tags: ["incidente", "supply-chain", "microsoft-365", "msp", "eua"]
pais: us
pubDate: 2026-10-26T18:19:00-03:00
cover: "https://covers.duarte.top/covers/20261020-connectwise-cloud-backup.jpg"
slug: connectwise-cloud-backup
---

En una línea: Credencial del ConnectWise Cloud Backup usada para acceder a 162 tenants Microsoft 365.

## Qué ocurrió

El 15 de octubre de 2026 Huntress detectó autenticaciones de la identidad del ConnectWise Cloud Backup en 162 tenants Microsoft 365 desde la IP 144.172.64.128. La credencial era client assertion en el tenant del vendor. El mismo día la app Cloud Management se elevó a Global Administrator en un tenant y plantó client secrets. ConnectWise suspendió los servicios el 17 y 18 de octubre. Sin evidencia de acceso a datos de backup.

## Por qué importa

App de tercero con consentimiento amplio (incluido Directory.ReadWrite.All) funciona como puerta de supply chain. MFA de usuario no cubre service principal. Persistencia vía client secret sobrevive a la revocación de la app original.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| Credencial de vendor compartida | Sign-ins confirmados en 162 tenants | Alta |
| Elevación y backdoor | Global Admin + client secrets en tenant | Alta |
| Datos de backup | Sin indicación de acceso | Indeterminada |

## Qué hacer esta semana

1. Revisar consentimientos de apps ConnectWise y similares en Entra ID — equipo de identidad.
2. Buscar client secrets nuevos y roles elevados desde 15/10 — SOC.
3. Confirmar que ningún token emitido antes de la revocación permanece válido — equipo de nube.