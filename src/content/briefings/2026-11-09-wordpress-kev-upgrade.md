---
title: "CISA coloca no KEV falha de RCE não autenticado no upgrade do WordPress Core"
description: "CVE-2026-119977 permite execução de código durante a janela de upgrade por caminhos de staging previsíveis; prazo federal 6 de novembro."
pubDate: 2026-11-09T10:25:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/03/cisa-adds-one-known-exploited-vulnerability-catalog"
cover: "https://covers.duarte.top/covers/20261104-wordpress-kev-upgrade.jpg"
tipo: vulnerabilidades
tags: ["wordpress", "kev", "rce", "patch"]
pais: us
notionUrl: "https://www.notion.so/40e1741174738180bee6ef3979973365"
---

Em uma linha: WordPress Core 4.7–7.1.3 tem RCE não autenticado na janela de upgrade; CISA adicionou ao KEV em 3 de novembro com prazo de 6 de novembro.

## O que aconteceu

Em 3 de novembro de 2026 a CISA adicionou o CVE-2026-119977 ao catálogo KEV. A vulnerabilidade é um TOCTOU no processo de upgrade completo: arquivos são colocados em caminhos de staging previsíveis e web-acessíveis. Atacante não autenticado que vence a corrida executa código. CVSS 8.1 (High). Afeta 4.7 a 7.1.3. Correção confirmada em 7.1.4; backports em progresso. Prazo federal 6 de novembro; triage forense requerida.

## Por que importa

A janela de manutenção vira vetor. Sites WordPress são perímetro comum em empresas e órgãos da região. Auto-update ajuda, mas o controle é saber se a instância ainda está na versão vulnerável e se o processo de staging foi limpo.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| RCE não autenticado na janela de upgrade | CISA KEV + NVD | Alta |
| Caminhos de staging previsíveis | Descrição do CVE | Alta |
| Exploração confirmada | Adição ao KEV | Alta |

## O que fazer nesta semana

1. Inventariar instâncias WordPress e versões — dono: time de aplicação / DevOps.
2. Atualizar para 7.1.4 ou aplicar o backport correspondente — dono: responsável pela plataforma.
3. Verificar logs de upgrade e acessos a wp-content/upgrade nos últimos dias — dono: SOC.