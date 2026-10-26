---
title: "Meta suspende compartilhamento do Muse após GhostShares exporem conversas via DNS passivo"
description: "Claroc enumerou mais de 6.800 links do agente Muse da Meta via DNS passivo; documentos internos e dados pessoais estavam acessíveis sem o link original. Meta suspendeu o recurso."
pubDate: 2026-10-26T10:23:00-03:00
sourceName: "Claroc"
sourceUrl: "https://blog.claroc.io/ghostshares-muse-passive-dns/"
cover: "https://covers.duarte.top/covers/20261020-meta-muse-ghostshares.jpg"
tipo: incidente
tags: ["ia", "privacidade", "meta", "ghostshares", "dns"]
pais: us
notionUrl: "https://www.notion.so/3ff17411747381638b44f886b386a2bb"
---

Em uma linha: Links de compartilhamento do Muse da Meta eram enumeráveis por DNS passivo porque o título da conversa ia para o subdomínio.

## O que aconteceu

Em outubro de 2026, pesquisadores da Claroc identificaram que o agente de IA Muse (Meta) gerava links de compartilhamento de conversas no formato título-id.cf.metaaiusercontent.com. Uma única consulta a serviços comerciais de DNS passivo retornou mais de 6.800 hostnames. Amostras abertas sem login continham documentos financeiros internos, pedidos de empréstimo, calendários de férias e notas de preparação para executive search confidencial. A falha (GhostShares) foi reportada no bug bounty da Meta em 8 de outubro. Em 20 de outubro, após contato da imprensa, a Meta suspendeu temporariamente o recurso.

## Por que importa

“Qualquer um com o link” deixa de ser controle quando o hostname é publicamente enumerável. Agentes de IA que materializam conversas em páginas web introduzem um vetor novo de exposição: o título da sessão vira metadado de infraestrutura. Sem inventário do que já foi publicado, a detecção e a resposta ficam dependentes de pesquisa externa.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Enumeração de shares via DNS passivo | >6.800 hostnames em uma consulta; amostras com dados sensíveis | Alta |
| Acesso sem autenticação a páginas “com o link” | Maioria das amostras abriu em modo anônimo | Alta |
| Resposta da Meta | Suspensão do recurso após cobertura de imprensa | Média |

## O que fazer nesta semana

1. Mapear quais agentes de IA na organização geram links ou páginas a partir de conversas e se o título ou metadados entram no hostname ou URL pública — dono: time de segurança / produto.
2. Revisar política de compartilhamento de saídas de agentes: exigir autenticação, expiração curta e ausência de dados sensíveis no identificador público — dono: governança de dados.
3. Verificar se já existem shares ou artefatos publicados que possam ser enumerados por DNS, Certificate Transparency ou índices públicos — sinal de que funcionou: inventário atualizado e nenhum hostname com título sensível.