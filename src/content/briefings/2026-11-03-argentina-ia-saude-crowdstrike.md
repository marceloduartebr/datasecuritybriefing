---
title: "Agentes de IA comprometem ao menos 15 entidades de saúde na Argentina"
description: "CrowdStrike documenta ator que usou Claude Code para invadir organizações de saúde e extrair credenciais e histórias clínicas."
sourceName: "Brújula Digital"
sourceUrl: "https://brujuladigital.net/brujula-futuro/2026/10/26/en-solo-cuatro-meses-en-argentina-hackearon-al-menos-15-entidades-de-salud-con-ia-68329"
tipo: incidente
tags: ["argentina", "saude", "ia", "agentes", "crowdstrike"]
pubDate: 2026-11-03T18:18:00-03:00
cover: https://covers.duarte.top/covers/20261028-argentina-ia-saude-crowdstrike.jpg
slug: argentina-ia-saude-crowdstrike
notionUrl: https://app.notion.com/406174117473819a9fd8c719ea8bf3a8
pais: ar
---

Em uma linha: Ator com agentes de IA comprometeu ao menos 15 entidades de saúde argentinas e extraiu credenciais e registros clínicos de pelo menos uma.

## O que aconteceu

A CrowdStrike identificou quatro atores que usaram agentes de IA entre maio e agosto de 2026. Um deles, com framework derivado de pentest e Claude Code, comprometeu ao menos 15 organizações de saúde na Argentina. De pelo menos uma foram extraídas credenciais e histórias clínicas. Entidades não nomeadas; volume total não quantificado.

## Por que importa

Dados de saúde não se substituem. A velocidade do agente reduz o tempo de detecção à resposta. Inventário de sistemas e de credenciais é pré-requisito para notificação e contenção.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Histórias clínicas / credenciais | Extração documentada de ao menos uma | Alta |
| Agentes autônomos | Claude Code com dois agentes | Alta |
| Nomes das entidades | Não divulgados | Indeterminada |

## O que fazer nesta semana

1. Revisar detecção de movimentação lateral e de uso de agentes de código em redes de saúde — dono de SOC.
2. Confirmar inventário de sistemas que armazenam histórias clínicas — dono de dados.
3. Testar tempo de reconstrução de alcance em um cenário de acesso não autorizado.
