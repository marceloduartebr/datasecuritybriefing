---
title: "IBM Aspera Faspex: bypass de autorização que dá admin entra no KEV"
description: "Falha explorada dá privilégio total numa plataforma que guarda arquivos trocados entre empresas."
pubDate: 2026-11-12T10:20:00-03:00
sourceName: "IBM"
sourceUrl: "https://www.ibm.com/support/pages/node/7295921"
cover: "https://covers.duarte.top/covers/20261110-ibm-aspera-faspex-kev.jpg"
tipo: vulnerabilidades
pais: us
tags: ["kev", "ibm", "transferencia-de-arquivos", "retencao", "perimetro"]
notionUrl: "https://www.notion.so/41317411747381958fe3c44e63c0cc2d"
---

Em uma linha: admin numa plataforma de transferência de arquivos é acesso ao histórico de dados que ninguém limpou.

## O que aconteceu

A CISA incluiu em 09/11/2026 o CVE-2026-123218 do IBM Aspera Faspex no KEV, com base em evidência de exploração ativa. O boletim da IBM de 07/11/2026 diz que o Faspex 5 permite que um usuário crie uma mensagem específica para contornar a autorização e obter privilégios totais de administrador (CWE-863). Afeta 5.0.0 a 5.0.19; correção no 5.0.19 PL1 (Linux), sem workaround. CVSS 9,8 segundo a IBM; EPSS 0,4% em 09/11.

## Por que importa

Plataformas de transferência de arquivos acumulam contratos, extrações de bases e dados de parceiros. O dano de um admin indevido é proporcional ao que ficou retido.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Bypass de autorização para admin | KEV 09/11/2026; boletim IBM | Crítica |
| Dados retidos na plataforma | Depende da política de retenção | Alta |

## O que fazer nesta semana

1. Atualizar para 5.0.19 PL1 — dono: infraestrutura.
2. Revisar contas admin e logs de acesso desde a divulgação — dono: SOC.
3. Sinal de que funcionou: versão corrigida em produção e política de retenção aplicada aos pacotes antigos.
