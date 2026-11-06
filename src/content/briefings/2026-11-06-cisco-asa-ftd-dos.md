---
title: "CVE-2026-76418: Cisco ASA/FTD com DoS no SSL VPN entra no KEV"
description: "CISA adicionou em 29 de outubro falha que permite a atacante não autenticado reiniciar dispositivos Cisco Secure Firewall com VPN SSL."
pubDate: 2026-11-06T10:18:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/29/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261103-cisco-asa-ftd-dos.jpg"
tipo: vulnerabilidades
tags: ["cve", "cisco", "edge", "kev"]
pais: us
notionUrl: "https://www.notion.so/40d174117473816cbb5ac6f31f0c027b"
---

Em uma linha: Falha no SSL VPN do Cisco ASA e FTD permite DoS não autenticado e entrou no KEV em 29 de outubro.

## O que aconteceu

Em 29 de outubro de 2026 a CISA adicionou o CVE-2026-76418 ao catálogo KEV. A vulnerabilidade no Remote Access SSL VPN do Cisco Secure Firewall ASA e FTD permite que um atacante não autenticado force o reinício do dispositivo. CVSS 8.6. A Cisco publicou correções no dia 28 de outubro; não há workaround. Prazo federal americano: 1º de novembro de 2026.

## Por que importa

Dispositivos de perímetro com VPN exposta concentram o acesso remoto. Um DoS explorado no KEV interrompe operações antes mesmo de qualquer movimento lateral. A prioridade deixa de ser calendário de patch e passa a ser verificação imediata de versão e evidência de comprometimento anterior.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| DoS não autenticado em SSL VPN | CISA KEV + advisory Cisco | Alta |
| Exploração ativa | Adição ao KEV em 29/10 | Alta |
| Workaround | Nenhum | Alta |

## O que fazer nesta semana

1. Inventariar ASA e FTD com SSL VPN exposto — dono: redes / segurança.
2. Aplicar as versões corrigidas da Cisco — dono: operações.
3. Verificar logs de reinícios anômalos antes do patch — dono: SOC.
