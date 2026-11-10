---
title: "Apple Pointer Authentication bypass entra no KEV"
description: "CISA adicionou o CVE-2024-27834 ao catálogo KEV em 4 de novembro; correção da Apple é de maio de 2024."
pubDate: 2026-11-10T10:21:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261106-apple-pac-bypass-kev.jpg"
tipo: vulnerabilidades
tags: ["kev", "apple", "cve", "identidade"]
pais: us
notionUrl: "https://www.notion.so/410174117473815fbff2ef664db51879"
---

Em uma linha: falha de 2024 no WebKit da Apple entra no KEV com prazo federal de 18 de novembro.

## O que aconteceu

Em 4 de novembro de 2026 a CISA listou o CVE-2024-27834. A falha permite bypass de Pointer Authentication a quem já tenha leitura e escrita arbitrária. Corrigida em maio de 2024. CVSS 5.5. Prazo federal 18 de novembro.

## Por que importa

O KEV confirma exploração. A existência do patch não prova que o dispositivo do usuário já o recebeu.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Exploração confirmada | Adição ao KEV em 4/11 | Alta |
| Janela de patch | Correção de maio de 2024 | Média |

## O que fazer nesta semana

1. Inventariar dispositivos Apple fora das versões corrigidas — dono: endpoint / MDM.
2. Confirmar que a política de atualização gera evidência, não só declaração — dono: segurança.
3. Sinal: zero dispositivos gerenciados ainda vulneráveis ao CVE.