---
title: "UnrealIRCd no KEV: qualquer usuário pode comandar a rede"
description: "CISA adicionou CVE-2026-114713 ao KEV em 13/11. Falha no labeled-response permite injeção de comandos S2S com autoridade de servidor."
pubDate: 2026-11-18T18:10:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/13/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261116-unrealircd-kev-command-injection.jpg"
tipo: vulnerabilidades
pais: us
tags: ["cve", "kev", "unrealircd", "perimetro"]
---

Em uma linha: Confiança entre servidores linked vira o vetor quando o conteúdo da tag não é sanitizado.

## O que aconteceu

Em 13 de novembro de 2026 a CISA incluiu o CVE-2026-114713 no catálogo KEV. A falha está no módulo labeled-response do UnrealIRCd 6.0.0 até antes de 6.2.7.1. Qualquer usuário em uma rede com dois ou mais servidores interligados pode injetar newlines na tag IRCv3 "label" e fazer com que comandos servidor-a-servidor sejam executados com autoridade de servidor. O projeto classificou a falha como a mais crítica em 15 anos. Correção na 6.2.7.1 ou hot-patch bundle-20261107. Prazo CISA: 16 de novembro.

## Por que importa

O ponto cego é a confiança implícita no tráfego entre nós. A política de patch não gera evidência de que o hot-patch rodou em todos os servidores da malha.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Injeção S2S via tag label | KEV + advisory do vendor | Alta |
| Exploração ativa | CISA SSVC: active | Alta |
| Hot-patch disponível | Vendor | Média (depende de aplicação) |

## O que fazer nesta semana

1. Inventariar instâncias UnrealIRCd 6.x com servidores linked — dono: infra de comunicação.
2. Aplicar hot-patch ou upgrade e confirmar rehash em todos os nós — dono: ops.
3. Verificar se o spamfilter workaround foi aplicado enquanto o patch não chega — dono: segurança.
