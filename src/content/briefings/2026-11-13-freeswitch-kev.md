---
title: "FreeSWITCH: code injection via SIP MESSAGE entra no KEV"
description: "CISA adicionou o CVE-2026-116779 em 9 de novembro. Uma mensagem SIP pode executar comandos de sistema no FreeSWITCH até 1.11.2."
pubDate: 2026-11-13T10:20:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/09/cisa-adds-four-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261110-freeswitch-kev.jpg"
tipo: vulnerabilidades
tags: ["voip", "kev", "cve", "freeswitch", "eua"]
pais: us
notionUrl: "https://www.notion.so/41417411747381bd95b4dd90e1b6ef9b"
---

Em uma linha: Softswitch FreeSWITCH até 1.11.2 executa comando de sistema a partir de uma SIP MESSAGE.

## O que aconteceu

Em 9 de novembro de 2026 a CISA incluiu o CVE-2026-116779 no KEV. A falha, documentada no advisory GHSA-mg63-h38w-8p9p da SignalWire, permite que um peer que entrega uma SIP MESSAGE a um perfil selecione o chat proto “api” e rode switch_api_execute. Resultado: execução de comandos da API do FreeSWITCH e de sinks de sistema operacional com os privilégios do processo. Afeta versões ≤ 1.11.2; o padrão habilita chat inbound. Exploração observada no wild. Correção em 1.11.3 fecha a rota por padrão (enable-chat-api-proto off).

## Por que importa

Borda de voz e softswitch ainda são tratados como “só telefonia”. O parser de protocolo decide o que executar antes de qualquer controle de aplicação. Inventário de superfície SIP exposta e de versões de FreeSWITCH/Asterisk é pré-condição para saber se a política de acesso tem evidência técnica.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| SIP MESSAGE para proto api | Advisory + KEV 09/11 | Alta |
| Perfil padrão com chat inbound | Documentação SignalWire | Alta |
| Execução com privilégio do processo | GHSA e NVD | Alta |

## O que fazer nesta semana

1. Inventariar FreeSWITCH ≤ 1.11.2 com perfil SIP acessível de fora — dono: rede/voz.
2. Atualizar para 1.11.3 ou desabilitar enable-chat onde não for necessário — dono: plataforma.
3. Revisar logs de SIP MESSAGE suspeitos e de execução de API no período anterior ao patch — dono: SOC.
