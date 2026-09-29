---
title: "KEV set/2026: Cisco FMC e Citrix NetScaler no perímetro"
description: "CISA adiciona CVE-2026-20079 (Cisco FMC/SCC auth bypass CVSS 10) e CVE-2026-19490 (Citrix NetScaler AAA 9.8) ao KEV em set/2026."
pubDate: 2026-09-29T10:14:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-perimetro.jpg"
tipo: vulnerabilidades
tags: ["kev", "cisco", "citrix", "perimetro", "auth-bypass"]
notionUrl: "https://www.notion.so/3dd1741174738165b5e4f7546e58b8c4"
---

Em uma linha: gerenciamento de firewall e AAA de NetScaler entram no KEV com CVSS crítico e exploração conhecida.

## O que aconteceu

Em 9/09/2026 a CISA incluiu no Known Exploited Vulnerabilities Catalog a CVE-2026-20079 (Cisco Secure Firewall Management Center / Security Cloud Control — bypass de autenticação, CVSS 10, EPSS ~0,76) e a CVE-2026-19490 (Citrix NetScaler AAA, CVSS 9.8). Ambas afetam superfície de perímetro e autenticação remota com exploração confirmada.

## Por que importa

Console de política e portal AAA são atalhos para identidade e regra de tráfego. Bypass autenticado no gerenciador não deixa rastro de "login falho". No Brasil, FMC/SCC e NetScaler concentram acesso de parceiros e MSP — inventário incompleto atrasa o patch obrigatório do BOD/KEV.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Cisco FMC/SCC auth bypass | CVE-2026-20079 CVSS 10, KEV 2026-09-09, EPSS ~0,76 | Crítica |
| Citrix NetScaler AAA | CVE-2026-19490 CVSS 9.8, KEV | Crítica |
| Inventário de console/AAA | Superfície típica de MSP e datacenter BR | Alta |

## O que fazer nesta semana

1. Listar instâncias FMC/SCC e NetScaler AAA com versão e exposição — dono: rede / perímetro.
2. Aplicar correção vendor e validar acesso admin pós-patch — dono: operações.
3. Sinal de que funcionou: nenhuma console de política ou AAA listada no KEV fica sem evidência de patch ou mitigação documentada.
