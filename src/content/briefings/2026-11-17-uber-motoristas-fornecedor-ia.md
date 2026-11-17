---
title: "Uber é a terceira vítima conhecida da invasão no fornecedor de IA Fireworks"
description: "Credenciais de um prestador abriram a conta da Uber no fornecedor e expuseram dados de 149 mil motoristas."
pubDate: 2026-11-17T16:07:00-03:00
sourceName: "BleepingComputer"
sourceUrl: "https://www.bleepingcomputer.com/news/security/uber-notifies-drivers-of-data-breach-affecting-nearly-150-000-people/"
cover: "https://covers.duarte.top/covers/stg-20261117-uber-motoristas-fornecedor-ia-0840.jpg"
tipo: incidente
tags: ["vazamento", "terceiros", "inteligencia-artificial", "uber"]
pais: us
---

**Em uma linha:** integrar dados a uma plataforma de IA de terceiros transfere o controle para as credenciais de quem opera essa plataforma.

## O que aconteceu

A Uber começou a notificar motoristas em 10 de novembro de 2026 sobre um vazamento que atingiu 149.346 pessoas, segundo registro na Procuradoria-Geral do Maine. Um invasor comprometeu credenciais internas de um prestador de serviços e as usou para acessar a conta da Uber nesse prestador. Foram expostos nomes, números de carteira de motorista, datas de nascimento e endereços.

O prestador avisou a Uber em 9 de outubro. A empresa cortou as conexões de dados com o fornecedor e concluiu, em 13 de outubro, que houve acesso a dados ligados a ele. A Uber não nomeou o prestador; o BleepingComputer, citando o TechCrunch, identifica a Fireworks, empresa de infraestrutura de IA. A Fireworks atribuiu o ataque a um grupo com motivação financeira ligado a ataques de LLMjacking; o mesmo incidente atingiu Cursor e Notion.

## Por que importa

É o mesmo incidente que levou o Notion a confirmar exposição de transcrições do Notion AI. Três empresas conhecidas foram atingidas por uma única credencial comprometida num fornecedor de IA. Os dados expostos dos motoristas são permanentes: número de carteira de motorista e data de nascimento não podem ser trocados como uma senha.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Credenciais internas do fornecedor | Invasor usou credenciais do prestador para entrar na conta da Uber | Alta |
| Dados permanentes de identificação | CNH, data de nascimento e endereço expostos | Alta |
| Concentração em fornecedor de IA | Mesmo incidente atingiu Uber, Cursor e Notion | Alta |

## O que fazer nesta semana

1. Listar as integrações com plataformas de IA de terceiros e quais conjuntos de dados pessoais cada uma alcança — dono: arquitetura e encarregado de dados.
2. Reduzir o escopo de cada integração ao mínimo necessário e exigir do fornecedor evidência de controle de acesso às contas de clientes — dono: gestão de terceiros.
3. Sinal de que funcionou: diante do aviso de um fornecedor, a empresa sabe em horas quais dados estavam conectados a ele.
