---
title: "Invasão na Fireworks AI expõe transcrições de chats do Notion AI"
description: "Fornecedor de inferência com compromisso de retenção zero tinha conversas de clientes, inclusive com chaves de API coladas."
pubDate: 2026-11-17T15:52:00-03:00
sourceName: "Notion"
sourceUrl: "https://www.notion.com/security/advisories/security-incident-involving-a-third-party-ai-vendor"
cover: "https://covers.duarte.top/covers/20261116-notion-fireworks-incidente.jpg"
tipo: incidente
tags: ["aispm", "shadow-ai", "terceiros", "vazamento"]
pais: us
---

Em uma linha: o contrato dizia retenção zero, mas o conteúdo dos prompts estava no ambiente do fornecedor de IA quando ele foi invadido.

## O que aconteceu
O Notion publicou em 12/11/2026 (boletim atualizado) que a invasão na Fireworks AI, fornecedora de inferência que o Notion usava para o recurso Insights e para servir modelos open-weight, expôs transcrições de chats do Notion AI. Linha do tempo do Notion: em 2/11 a Fireworks avisou de acesso a um conjunto de dados que parecia só sintético; em 3/11 o Notion cortou a conexão; em 4/11 apagou todos os seus dados no sistema da Fireworks; em 6/11 a Fireworks avisou de possível acesso a dados de clientes; em 8/11 confirmou o conjunto afetado; em 9/11 o Notion avisou os clientes atingidos. As transcrições eram do dataset do Insights e, para a maioria dos workspaces, não atribuíveis (sem autor nem workspace, sem resultados de ferramentas). O impacto é de menos de 1% dos workspaces. Em 11/11 o Notion revogou chaves de API do Notion encontradas nas mensagens e em 12/11 avisou os emissores de chaves de terceiros achadas nelas. O Insights foi desligado e o Notion deixou de usar a Fireworks. Segundo a BleepingComputer (11/11), a Fireworks confirmou que um atacante entrou no seu ambiente de desenvolvimento por um provedor de nuvem terceiro em 23/10, levando metadados, dados de cobrança, pesos de modelos e datasets de alguns clientes; é a segunda invasão da Fireworks (a primeira, no início de outubro, expôs variáveis de ambiente com chaves e tokens). O Notion afirma que não houve invasão dos próprios sistemas e que a Fireworks tinha compromisso contratual de retenção zero. O boletim não foi relido para este briefing; os dados vêm da leitura registrada pelo radar.

## Por que importa
Fornecedores de inferência recebem o conteúdo bruto dos prompts, e usuários colam ali segredos e dados de negócio. Um compromisso contratual de retenção não substitui a verificação do que de fato ficou armazenado do outro lado.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Fornecedor de IA invadido | Acesso ao ambiente de desenvolvimento da Fireworks via provedor de nuvem terceiro | Alta |
| Segredos em prompts | Chaves de API encontradas nas transcrições e revogadas | Alta |
| Retenção além do contrato | Dataset do Insights presente apesar do compromisso de retenção zero | Média |

## O que fazer nesta semana
1. Listar os fornecedores de IA e de inferência que recebem prompts da empresa, direta ou indiretamente via SaaS — dono: segurança e privacidade.
2. Procurar e rotacionar segredos colados em ferramentas de IA, começando por chaves de API — dono: times de engenharia.
3. Sinal de que funcionou: para cada fornecedor de IA, há registro de que dados ele recebe e evidência de retenção, não só a cláusula.
