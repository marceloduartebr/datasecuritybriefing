---
title: "Binance: US$ 6,3 bi roubados a partir de um laptop de DevOps"
description: "Maior roubo de cripto já registrado começou por um endpoint de engenharia comprometido que alcançou um container de serviço de saques."
pubDate: 2026-10-30T13:27:00-03:00
sourceName: "Binance / BleepingComputer"
sourceUrl: "https://www.binance.com/en/support/announcement/detail/c5a8729a97ac486d963784d96c5642d7"
cover: "https://covers.duarte.top/covers/20261030-binance-roubo-6-3-bi-devops.jpg"
tipo: incidente
pais: global
tags: ["binance", "cripto", "devops", "endpoint", "coreia-do-norte"]
notionUrl: "https://www.notion.so/40917411747381cba74fea4c1cf09fd0"
---

Em uma linha: um laptop de engenheiro virou acesso a um container capaz de submeter saques — e US$ 6,3 bilhões saíram em cerca de 20 minutos.

## O que aconteceu

Em 29 de outubro de 2026 um atacante movimentou cerca de US$ 6,3 bilhões da Binance (a TRM Labs estima US$ 6,36 bi em dez blockchains, a maior parte em ~20 minutos a partir das 20h05 UTC). É o maior roubo de cripto já registrado, cerca de quatro vezes o da Bybit (US$ 1,5 bi, fev/2025). Segundo a Binance, a investigação inicial aponta para o laptop comprometido de um engenheiro de DevOps, que deu acesso a um container de serviço usado para submeter saques não autorizados; depois foram encontrados "pontos adicionais de invasão". A empresa diz não haver evidência de vazamento de chaves privadas de carteiras.

Cerca de US$ 3 bi foram congelados on-chain (Tether ~US$ 971 mi, Circle ~US$ 823 mi). Saques suspensos com retorno previsto em ~45 horas; depósitos normais. A Binance cobrirá todas as perdas com o fundo SAFU e recursos próprios e promete post-mortem e Proof of Reserves atualizado. O co-CEO Richard Teng disse que não foi "uma ação de um clique" e que ninguém está sendo culpado individualmente. A atribuição ao grupo norte-coreano TraderTraitor (Lazarus/APT38) é da TRM Labs, com alta confiança — não da Binance.

## Por que importa

Não houve chave vazada: o atacante usou a própria infraestrutura de saques. O elo fraco foi o endpoint de quem administra produção. Em qualquer fintech, banco ou PIX, o mesmo caminho — laptop de engenharia → credencial de serviço → API interna de movimentação — existe e raramente tem limite de valor ou aprovação dupla.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Endpoint de DevOps comprometido | Comunicado da Binance | Alta |
| Container de serviço com poder de saque | Saques não autorizados submetidos via serviço | Alta |
| Atribuição à Coreia do Norte | TRM Labs (terceiro), não a vítima | Indeterminada |

## O que fazer nesta semana

1. Mapear quais serviços internos podem mover dinheiro e quais laptops alcançam esses serviços — segurança + plataforma.
2. Exigir limite de valor, velocidade e aprovação fora de banda em APIs de movimentação — produto + risco.
3. Revisar EDR, acesso privilegiado e sessões de engenharia para produção — SOC.
