---
title: "GPUStack: bypass de autenticação em servidor de modelos de IA entra no KEV"
description: "Confiança indevida na origem loopback dá admin sem senha a quem alcança o servidor de inferência."
pubDate: 2026-11-12T18:21:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/09/cisa-adds-four-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261110-gpustack-kev.jpg"
tipo: vulnerabilidades
pais: us
tags: ["kev", "aispm", "shadow-ai", "infraestrutura-de-ia", "autenticacao"]
notionUrl: "https://www.notion.so/413174117473812a9404fd439922bc8c"
---

**Em uma linha:** servidores de inferência fora do inventário são shadow AI com acesso de admin exposto.

## O que aconteceu
A CISA incluiu em 09/11/2026 o CVE-2026-102895 do GPUStack (gerenciador de clusters de GPU para servir modelos de IA) no KEV. A falha é um bypass de autenticação via origem loopback confiável (peer TCP de proxy reverso ou cabeçalho X-GPUStack-Real-IP), que concede admin sem autenticação. CVSS 9,8 segundo fontes secundárias (NVD não consultado); EPSS 0,3%. O advisory do fabricante não foi lido.

## Por que importa
Clusters de inferência concentram modelos, dados de fine-tuning, prompts e chaves de API. Costumam ser montados por times de dados, fora do inventário de segurança.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Bypass de autenticação por cabeçalho/proxy | KEV 09/11/2026 | Crítica |
| Dados e chaves no cluster de IA | Depende do uso | Alta |

## O que fazer nesta semana
1. Localizar instâncias de GPUStack e aplicar a correção do fabricante — dono: plataforma de dados/ML.
2. Bloquear o cabeçalho X-GPUStack-Real-IP vindo de fora no proxy reverso — dono: infraestrutura.
3. Sinal de que funcionou: inventário de servidores de modelos com dono e dados acessíveis mapeados.

> Nota de apuração: a fonte não foi relida nesta etapa de avaliação; os fatos seguem o registro do radar DSB.
