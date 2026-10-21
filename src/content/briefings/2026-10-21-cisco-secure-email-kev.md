---
title: "Cisco Secure Email Gateway: path traversal pré-auth no KEV"
description: "CISA adicionou CVE-2026-76519 em 14 de outubro; exploração ativa confirmada; prazo federal 17 de outubro."
pubDate: 2026-10-21T10:17:00-03:00
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/cisco-warns-of-exploited-secure-email-gateway-vulnerability/"
cover: "https://covers.duarte.top/covers/20261015-cisco-secure-email-kev.jpg"
tipo: vulnerabilidades
tags: ["kev", "cisco", "edge", "cve"]
pais: us
notionUrl: "https://www.notion.so/3fa17411747381a0b0dbf368eb497f01"
---

Em uma linha: CVE-2026-76519 no Cisco Secure Email Gateway permite escrita de arquivo e RCE root sem login quando File Reputation está ativo.

## O que aconteceu

Em 14 de outubro de 2026 a CISA incluiu o CVE-2026-76519 no KEV. Path traversal relativo permite atacante remoto não autenticado escrever arquivos e executar comandos como root. Condição: File Reputation (AMP) habilitado e Content Scanner Tools < 25.3.0.5525. Cisco confirmou exploração em outubro. Patch em 14 de setembro (AsyncOS 15.5.5-014 / 16.5.0-780). Prazo FCEB: 17 de outubro.

## Por que importa

O mesmo componente que inspeciona anexo vira o vetor. Sem inventário de versão do scanner e exposição do appliance, o prazo de três dias já pode ter sido ultrapassado.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Path traversal pré-auth | CISA KEV + Cisco | Alta |
| RCE root | Confirmado | Alta |
| File Reputation ativo | Condição de exploração | Alta |

## O que fazer nesta semana

1. Inventariar Secure Email Gateway com File Reputation ativo e versão do Content Scanner — SOC/Infra.
2. Aplicar AsyncOS 15.5.5-014 ou 16.5.0-780 ou superior — Operações.
3. Confirmar ausência de exploração em logs de anexo — IR.
