---
title: "CVE-2026-114625 no KEV: SQL injection no Arista VeloCloud Orchestrator"
description: "CISA adiciona falha de injeção de SQL explorada em orquestrador SD-WAN; terceira do produto no catálogo em 2026."
pubDate: 2026-10-29T10:22:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/23/cisa-adds-one-known-exploited-vulnerability-catalog"
cover: "https://covers.duarte.top/covers/20261028-velocloud-kev-sql-injection.jpg"
tipo: vulnerabilidades
tags: ["kev", "velocloud", "edge", "cve-2026-114625", "cisa"]
notionUrl: "https://www.notion.so/406174117473818fb91ce96808fe456c"
---

**Em uma linha:** SQL injection no VeloCloud Orchestrator entra no KEV com prazo federal de três dias e é a terceira falha do produto no catálogo este ano.

## O que aconteceu

Em 23 de outubro de 2026 a CISA adicionou o CVE-2026-114625 ao KEV. A vulnerabilidade é injeção de SQL em versões on-premise do Arista VeloCloud Orchestrator (CVSS 9.9) que permite acesso a funcionalidade interna privilegiada. Prazo de remediação federal: 26 de outubro. Exploração requer sessão autenticada mínima. Correções em 5.2.3.18, 6.1.3.10 e 6.4.2.12.

## Por que importa

Orquestrador de edge concentra gestão de múltiplos sites. Terceira adição ao KEV no ano eleva a prioridade de inventário e de verificação de patch em instâncias on-premise.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| SQL injection explorada | KEV + confirmação Arista | Alta |
| Acesso a funcionalidade privilegiada | CVSS 9.9 | Alta |
| Sessão mínima suficiente | Enterprise Read Only | Média |

## O que fazer nesta semana

1. Inventariar instâncias on-premise do VeloCloud Orchestrator — dono de rede/edge.
2. Aplicar as versões corrigidas e confirmar remediação — dono de vulnerabilidades.
3. Revisar logs de sessões autenticadas no portal no período anterior ao patch.
