---
title: "ConnectWise: credencial de Cloud Backup abre tenants Microsoft 365"
description: "Uma identidade de vendor comprometida permitiu sign-ins em 162 tenants M365 em 15 de outubro de 2026."
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/connectwise-suspends-cloud-services-in-response-to-cyberattack/"
tipo: incidente
tags: ["incidente", "supply-chain", "microsoft-365", "msp", "eua"]
pais: us
pubDate: 2026-10-26T18:19:00-03:00
cover: "https://covers.duarte.top/covers/20261020-connectwise-cloud-backup.jpg"
---

Em uma linha: Credencial do ConnectWise Cloud Backup usada para acessar 162 tenants Microsoft 365.

## O que aconteceu

Em 15 de outubro de 2026 a Huntress detectou autenticações da identidade do ConnectWise Cloud Backup em 162 tenants Microsoft 365 a partir do IP 144.172.64.128. A credencial era client assertion no tenant do vendor. No mesmo dia o app Cloud Management se elevou a Global Administrator em um tenant e plantou client secrets. A ConnectWise suspendeu os serviços em 17 e 18 de outubro. Sem evidência de acesso a dados de backup.

## Por que importa

App de terceiro com consentimento amplo (incluindo Directory.ReadWrite.All) funciona como porta de supply chain. MFA de usuário não cobre service principal. Persistência via client secret sobrevive à revogação do app original.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Credencial de vendor compartilhada | Sign-ins confirmados em 162 tenants | Alta |
| Elevação e backdoor | Global Admin + client secrets em tenant | Alta |
| Dados de backup | Sem indicação de acesso | Indeterminada |

## O que fazer nesta semana

1. Revisar consentimentos de apps ConnectWise e similares no Entra ID — time de identidade.
2. Procurar client secrets novos e roles elevados desde 15/10 — SOC.
3. Confirmar que nenhum token emitido antes da revogação permanece válido — time de nuvem.