---
title: "TheHatman: 3,64 milhões de registros Azure sem zero-day"
description: "Password spray e fadiga de MFA. Empresas Fortune 500 citadas; parte delas classifica os dados como antigos ou pouco sensíveis."
pubDate: 2026-08-26T08:42:00-03:00
sourceName: "BleepingComputer"
cover: "https://raw.githubusercontent.com/marceloduartebr/dsb-covers/main/covers/20260826-azure-thehatman.jpg"
sourceUrl: "https://www.bleepingcomputer.com/news/security/hacker-claims-36-million-azure-account-records-stolen-from-major-companies/"
tags: ["vazamento", "azure", "identidade"]
notionUrl: "https://www.notion.so/3c717411747381379cabce5730d4212e"
---

**Em uma linha:** o método não é sofisticado; o alcance do token é que é.

## O que aconteceu

Desde 31 de julho, o agente “TheHatman” anuncia a venda de bases furtadas de tenants Microsoft Azure. A cobertura cita McDonald's, Vodafone, TCS, HCL Technologies, Kyndryl e Gap Inc., somando mais de 3,6 milhões de registros de funcionários — nomes, e-mails, cargos, telefones e IDs corporativos. O vetor descrito é password spray combinado com fadiga de MFA. Parte das empresas citadas afirmou que os dados seriam antigos ou pouco sensíveis.

Reivindicação de venda não é laudo da vítima.

## Por que importa

Não houve zero-day. Houve persistência até alguém aprovar um push de MFA no piloto automático. “Temos MFA” não é a mesma frase que “sabemos o que esse acesso alcança”.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Password spray + fadiga de MFA | Cobertura BleepingComputer | Alta |
| Volume reivindicado | 3,64 milhões / Fortune 500 citadas | Alta |
| Confirmação corporativa | Parcial / contestação | Indeterminada |

## O que fazer nesta semana

1. Revisar política de número de pushes de MFA e alertas de password spray no Entra/Azure AD — dono: identidade.
2. Para cada app no tenant, documentar o dado que um token de usuário lê.
3. Sinal de que funcionou: um acesso comprometido gera lista de sistemas e tipos de dado, não um “estamos apurando”.
