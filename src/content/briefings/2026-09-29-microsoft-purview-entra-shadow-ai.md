---
title: "Microsoft: Purview e Entra bloqueiam dado sensível a caminho da shadow AI"
description: "GA de classificação Purview no Entra Global Secure Access para tráfego humano e agêntico on-behalf-of — o arquivo para antes de chegar à IA não sancionada."
pubDate: 2026-09-29T10:14:00-03:00
sourceName: "Microsoft Security Blog"
sourceUrl: "https://www.microsoft.com/en-us/security/blog/2026/09/24/whats-new-in-microsoft-security-september-2026/"
cover: "https://covers.duarte.top/covers/20260925-microsoft-purview-entra-shadow-ai.jpg"
tipo: noticia
tags: ["dspm", "shadow-ai", "microsoft", "purview", "aispm"]
notionUrl: "https://www.notion.so/3e617411747381ebb181ee5824c2ac20"
---

Em uma linha: o controle de rede passa a enxergar o agente, não só o clique do analista.

## O que aconteceu

Em 24 de setembro de 2026 a Microsoft anunciou disponibilidade geral de proteção de dado em movimento com Purview e Entra Global Secure Access. Classificação e políticas do Purview são aplicadas na camada de rede a ações humanas e a tráfego agêntico on-behalf-of. Exemplo oficial: upload de documento sensível a ferramenta de IA não sancionada pode ser interrompido antes de sair.

## Por que importa

Fecha um buraco que DSPM clássico não cobre sozinho: o dado em trânsito para destino não inventariado. Continua dependente de classificação boa e de lista de destinos. Na LATAM, o valor é evidência — bloqueio registrado — não o logo do fabricante.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Upload a IA não sancionada | GA Purview+Entra GSA | Alta |
| Tráfego OBO de agente | mesmo anúncio | Alta |
| Classificação fraca | premissa do controle | Média |

## O que fazer nesta semana

1. Conferir se a classificação cobre o dado que de fato vai para IA.
2. Listar destinos de IA aprovados e o que deve ser bloqueado na borda.
3. Sinal de que funcionou: log de bloqueio de um teste controlado, com agente e com usuário.
