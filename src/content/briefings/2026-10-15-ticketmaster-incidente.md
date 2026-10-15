---
title: "Ticketmaster notifica clientes no Brasil sobre exposição via ferramenta de terceiro"
description: "Empresa confirma exposição de CPF e dados de compra de 2025; investigação concluída em setembro; notificação em 14 de outubro."
pubDate: 2026-10-15T10:15:00-03:00
sourceName: "Canaltech"
sourceUrl: "https://canaltech.com.br/seguranca/vazamento-expoe-dados-de-contas-da-ticketmaster-no-brasil/"
cover: "https://covers.duarte.top/covers/20261015-ticketmaster-incidente.jpg"
tipo: incidente
tags: ["vazamento", "terceiro", "brasil", "lgpd"]
pais: br
notionUrl: "https://www.notion.so/3fa17411747381e185c8fed4221d7a21"
---

**Em uma linha:** Ticketmaster expôs CPF e dados de compra de clientes de 2025 por falha em ferramenta de análise de terceiro.

## O que aconteceu

Em 14 de outubro de 2026 a Ticketmaster Brasil notificou clientes afetados. A origem foi vulnerabilidade temporária em ferramenta terceirizada de análise de dados. Dados expostos de quem comprou em 2025 incluem nome, CPF, telefone, e-mail, endereço e detalhes de compra com últimos quatro dígitos do cartão. Senhas e cartão completo não. Investigação com especialistas externos concluída em setembro. Sistema de venda não afetado.

## Por que importa

Terceiro com cópia do dado operacional cria superfície que o controle do sistema principal não cobre. Tempo entre o acesso e o inventário do que foi alcançado define a qualidade da notificação.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Ferramenta de terceiro | Confirmado pela empresa | Alta |
| CPF e histórico de compra | Listados no comunicado | Alta |
| Sistema de venda | Não afetado | Baixa |

## O que fazer nesta semana

1. Mapear ferramentas de análise/marketing que recebem CPF ou dados de pedido — DPO/Segurança.
2. Exigir evidência de isolamento e retenção — Jurídico/Fornecedores.
3. Confirmar se a notificação aos titulares está documentada — Compliance.
