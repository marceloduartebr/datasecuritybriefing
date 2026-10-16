---
title: "Edge — Ivanti Connect Secure no KEV com bypass pré-autenticação"
description: "CISA adicionou CVE-2026-104935 ao KEV; exploração confirmada em Connect Secure permite RCE sem login."
pubDate: 2026-10-16T10:29:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/13/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261014-ivanti-connect-secure-kev.jpg"
tipo: vulnerabilidades
tags: ["vulnerabilidades", "kev", "ivanti", "edge", "vpn"]
pais: us
notionUrl: "https://www.notion.so/3f9174117473816d89bafe2250a88f99"
---

Em uma linha: CVE-2026-104935 no KEV permite bypass de autenticação e execução de comandos sem login no Ivanti Connect Secure; prazo federal 16/10.

## O que aconteceu

Em 13 de outubro de 2026 a CISA incluiu o CVE-2026-104935 no catálogo de vulnerabilidades exploradas. A falha é authentication bypass by spoofing no Ivanti Connect Secure, permitindo RCE pré-autenticação. Afeta versões 25.1.1.1 e anteriores, 25.1.2.2 e anteriores e 22.8R2.4 e anteriores. Ivanti confirma exploração limitada. Volexity reportou cadeia de três zero-days a partir de 3/10 para root em appliance atualizado, com roubo de credenciais e exfiltração. Prazo BOD para FCEB: 16 de outubro. ICT pode não detectar porque comandos executam em memória.

## Por que importa

Borda de VPN com bypass é acesso ao perímetro sem credencial. Política de patch existe; evidência de comprometimento exige forense de memória, não só ferramenta de integridade.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Exploração ativa | Confirmada por Ivanti e CISA KEV | Alta |
| RCE pré-auth | Descrição do CVE e advisory | Alta |
| Detecção por ICT | Limitada (comandos em memória) | Média |

## O que fazer nesta semana

1. Inventariar Connect Secure, versão e exposição — redes.
2. Aplicar patch ou isolar até correção; planejar forense se exposto — SOC.
3. Sinal: nenhum appliance afetado sem patch ou sem evidência de não-comprometimento.
