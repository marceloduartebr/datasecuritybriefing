---
title: "Edge — Ivanti Connect Secure, cadeia de zero-days explorada no KEV"
description: "CISA adicionou dois CVEs do Ivanti Connect Secure ao KEV em 30 de outubro; a cadeia dá root não autenticado em appliances que pareciam atualizados."
pubDate: 2026-11-04T10:17:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/30/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261102-ivanti-connect-secure-kev.jpg"
tipo: vulnerabilidades
tags: ["edge", "ivanti", "kev", "vpn"]
pais: us
notionUrl: "https://www.notion.so/40c1741174738185a2dce93b0bc1b654"
---

Em uma linha: Dois zero-days do Ivanti Connect Secure entraram no KEV; a cadeia com o bypass de outubro entrega root sem autenticação.

## O que aconteceu

Em 30 de outubro de 2026 a CISA incluiu CVE-2026-111357 e CVE-2026-118527 no catálogo de vulnerabilidades exploradas. O CVE-2026-111357 (CVSS 7.0) permite escalação a root no broker dsinvoked que confia indevidamente em dados de configuração do DSCache. O CVE-2026-118527 permite upload de arquivo em local conhecido. Ambos se encadeiam com o CVE-2026-104935, já no KEV desde 13 de outubro. A Volexity documentou o ator UTA0576 explorando a cadeia desde pelo menos 3 de outubro em appliances que estavam na versão que corrigia o bypass. Correções chegaram em 29 de outubro (25.1.1.3 e 22.8R2.6). Prazo federal: 2 de novembro para o primeiro e 13 de novembro para o segundo. Comandos rodam em memória e logs são adulterados; a ferramenta de integridade da Ivanti pode não ver.

## Por que importa

O perímetro de acesso remoto atualizado ainda é ponto cego. O patch parcial de outubro fechou o caminho principal, mas deixou a escalação aberta. Root no gateway vira inventário de credenciais de domínio.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Cadeia de zero-days em VPN | CISA KEV + Volexity | Alta |
| Detecção pós-exploração | Comandos em memória, logs adulterados | Alta |
| Exposição de credenciais de domínio | Uso reportado de LAPS/BitLocker | Alta |

## O que fazer nesta semana

1. Inventariar versões exatas de Ivanti Connect Secure e aplicar 25.1.1.3 ou 22.8R2.6 — dono: time de infraestrutura.
2. Fazer triagem forense de memória e rede, não só Integrity Checker — dono: SOC.
3. Confirmar que o inventário de gateways está atualizado e que não há appliances EOL (22.8 encerra em jan/2027) sem plano.