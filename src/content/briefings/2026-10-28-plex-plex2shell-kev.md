---
title: "Edge — Plex Media Server, cadeia Plex2Shell explorada no KEV"
description: "CISA adiciona quatro CVEs do Plex Media Server ao KEV; a cadeia Plex2Shell permite RCE sem autenticação e já é explorada."
pubDate: 2026-10-28T10:16:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/20/cisa-adds-six-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261023-plex-plex2shell-kev.jpg"
tipo: vulnerabilidades
tags: ["vulnerabilidades", "kev", "plex", "edge"]
pais: us
notionUrl: "https://www.notion.so/40217411747381d1ac7eec5815c57d00"
---

Em uma linha: Quatro falhas no Plex Media Server formam a cadeia Plex2Shell e entraram no KEV da CISA em 20 de outubro com exploração ativa confirmada.

## O que aconteceu

Em 20 de outubro de 2026 a CISA incluiu no catálogo Known Exploited Vulnerabilities os CVEs CVE-2026-96652, CVE-2026-96654, CVE-2026-96655 e CVE-2026-96656, que afetam o Plex Media Server antes da build 1.43.3.10861. A cadeia permite a um atacante remoto sem autenticação executar código. O fabricante confirmou exploração ativa e disseminada após PoC público em 16 de outubro. Prazos de remediação federal: 23 de outubro e 3 de novembro, conforme o CVE.

## Por que importa

Instâncias expostas de servidores de mídia frequentemente ficam fora do inventário de perímetro e de patch. A cadeia mostra que um componente “periférico” pode virar ponto de entrada e de persistência (miner e proxy).

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| RCE sem autenticação via cadeia Plex2Shell | KEV + confirmação do fabricante e honeypots | Alta |
| Instâncias internet-facing desatualizadas | Exploração observada dias após PoC | Alta |
| Uso para miner e proxy | Relatos de pesquisadores e Plex | Média |

## O que fazer nesta semana

1. Inventariar servidores Plex (incluindo NAS e home lab expostos) e confirmar versão ≥ 1.43.3.10861 — operações / segurança.
2. Isolar ou desligar instâncias não atualizáveis e revisar logs de processos anômalos — SOC.
3. Incluir o produto no ciclo de patch de edge / dispositivos não tradicionais — vulnerabilidades.
