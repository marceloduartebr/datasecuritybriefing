---
title: "Trezor e ShipMonk: exclusão contratada, dado ainda no terceiro"
description: "Mais 67 mil clientes EUA expostos num 3PL que havia confirmado por escrito ter apagado a base."
pubDate: 2026-09-07T10:20:00-03:00
sourceName: "The Hacker News / Trezor"
sourceUrl: "https://thehackernews.com/2026/09/trezor-says-shipmonk-breach-exposed.html"
cover: "https://covers.duarte.top/covers/20260905-trezor-shipmonk.jpg"
tipo: incidente
tags: ["terceiros", "vazamento", "retencao", "lgpd"]
notionUrl: "https://www.notion.so/3d217411747381389197fc11639edb4a"
---

Em uma linha: o contrato e o e-mail de exclusão não substituem evidência de que o registro saiu do disco do operador logístico.

## O que aconteceu

Em 5 de setembro de 2026 a Trezor divulgou que o operador logístico ShipMonk, após acesso não autorizado informado em 10 de agosto, expõe dados de mais 67 mil clientes nos Estados Unidos — nome, e-mail, telefone, endereço de entrega e número de pedido, em pedidos de novembro de 2019 a agosto de 2021. O volume se soma aos 13.689 já divulgados no mês anterior. A Trezor diz que pediu a exclusão por escrito ao longo da relação e recebeu confirmação; o dado permanecia nos sistemas do terceiro. As carteiras hardware não foram comprometidas. A ligação com ShinyHunters é atribuição da Holborn, não comunicado da vítima.

## Por que importa

O caso é de retenção em terceiro, não de senha quebrada. Na América Latina o padrão se repete em 3PL, CRM e processadora: SLA de 90 dias no papel, base de endereço ainda consultável anos depois. Sem inventário registro a registro, a notificação à ANPD e ao titular vira chute.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Retenção além do prazo no 3PL | Confirmação escrita de exclusão vs base ainda no ShipMonk | Alta |
| Dados de entrega + contato | Nome, e-mail, telefone, endereço, pedido 2019-2021 | Alta |
| Atribuição do ator | Holborn cita ShinyHunters; Trezor não confirma o grupo | Indeterminada |

## O que fazer nesta semana

1. Listar 3PLs, CRMs e processadoras com prazo de exclusão vencido — dono: privacidade + compras.
2. Exigir evidência técnica de exclusão (log, hash, recorte), não só e-mail de conformidade — dono: segurança.
3. Sinal de que funcionou: zero base do terceiro com data de pedido anterior ao SLA vigente.
