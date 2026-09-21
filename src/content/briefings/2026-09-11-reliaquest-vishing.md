---
title: "ReliaQuest contém vishing da ShinyHunters com controles de confiança de dispositivo"
description: "Engenharia social por telefone abriu o painel de identidade de um colaborador — e parou ali, graças a device trust."
pubDate: 2026-09-11T10:36:00-03:00
sourceName: "The Register"
sourceUrl: "https://www.theregister.com/cyber-crime/2026/08/24/shinyhunters-and-reliaquest-trade-blows-over-claimed-breach/529170"
cover: "https://covers.duarte.top/covers/20260830-reliaquest-vishing.jpg"
pais: us
tipo: incidente
tags: ["vishing", "identidade", "mfa", "shinyhunters", "device-trust"]
notionUrl: "https://www.notion.so/3c71741174738130aa29eb888ea2d403"
---

**Em uma linha:** Engenharia social por telefone abriu o painel de identidade de um colaborador — e parou ali, graças a controles de confiança de dispositivo.

## O que aconteceu

Em 22 de agosto de 2026, o grupo de extorsão ShinyHunters registrou domínios parecidos com o nome da ReliaQuest, montou uma página falsa de login SSO e ligou para funcionários se passando pelo time interno de segurança. Um colaborador digitou a senha e aprovou a notificação de MFA. O invasor conseguiu, por alguns minutos, acesso somente leitura ao painel Okta daquela identidade. Nenhum sistema ou aplicação da empresa foi alcançado e nenhum dado de cliente foi tocado: os controles de confiança de dispositivo bloquearam qualquer avanço, a sessão foi encerrada e as credenciais trocadas. Ainda assim, o ShinyHunters listou a ReliaQuest como vítima em seu site de vazamentos — o que a empresa contesta publicamente.

## Por que importa

A diferença crítica não está no ataque em si. Engenharia social por telefone continua sendo uma das táticas mais simples e eficazes, inclusive contra quem trabalha com segurança todos os dias. A diferença está entre "um funcionário caiu no golpe" e "a empresa foi comprometida". Essas duas coisas quase nunca são a mesma coisa, mas viram manchete como se fossem.

Medir maturidade de segurança pela quantidade de camadas de autenticação — e não pela clareza sobre o que cada camada realmente protege — continua sendo um erro comum. MFA aprovado não deveria significar acesso irrestrito; deveria significar acesso a exatamente aquilo que aquela identidade precisa, nada além.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Vishing + página SSO falsa | Confirmado pela ReliaQuest e pela cobertura do The Register | Alta (vetor de entrada) |
| Acesso ao painel Okta (somente leitura) | Confirmado; duração de minutos | Média |
| Movimento lateral / dados de clientes | Bloqueado por device trust; nenhum dado tocado | Contida |
| Listação em leak site | Publicada pelo grupo; contestada pela vítima | Indeterminada (reputacional) |

## O que fazer nesta semana

1. Revisar se MFA aprovado concede apenas o mínimo necessário para aquela identidade — dono: identidade/IAM.
2. Testar se controles de confiança de dispositivo (device trust / conditional access) realmente impedem avanço a partir de sessão comprometida — dono: segurança de endpoint + IAM.
3. Treinar o time a tratar ligação "do próprio SOC" como suspeita até confirmação por canal secundário — dono: conscientização.
4. Sinal de que funcionou: incidente similar termina na mesma tela, sem acesso a sistemas ou dados.
