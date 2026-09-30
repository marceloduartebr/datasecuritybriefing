---
title: "MDA comunica incidente na Plataforma Terras do Brasil"
description: "Acesso indevido via API de módulo legado em 18 e 19 de setembro; ANPD avisada em 25. Volume ainda em apuração."
pubDate: 2026-09-30T10:12:00-03:00
sourceName: "MDA"
sourceUrl: "https://www.gov.br/mda/pt-br/noticias/2026/09/nota-de-esclarecimento-1"
cover: "https://covers.duarte.top/covers/20260930-mda-terras-brasil-incidente.jpg"
tipo: incidente
tags: ["vazamento", "governo", "brasil", "lgpd"]
pais: br
notionUrl: "https://www.notion.so/3eb17411747381a1a590d3ab2f6c6a00"
---

**Em uma linha:** Sistema legado com credencial válida expôs cadastro da Plataforma Terras do Brasil; a autoridade foi avisada quatro dias depois da identificação.

## O que aconteceu

O MDA identificou em 22/09/2026 acesso indevido a módulo legado integrado à Plataforma Terras do Brasil. Uma credencial obtida irregularmente fez requisições à API em 18 e 19/09. Campos visíveis: CPF, nome, filiação, nascimento, sexo, situação cadastral, endereço e DDD. Contencão em 21/09; comunicação à ANPD em 25/09. Extensão ainda sob apuração.

## Por que importa

Integração legado-plataforma sem inventário de acesso transforma token válido em consulta em massa. Notificar o titular exige mapa registro a registro — o ministério ainda não publicou o número.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| API legado + credencial roubada | Nota oficial MDA | Alta |
| Cadastro com endereço e filiação | Campos listados na nota | Alta |
| Volume de titulares | Não divulgado | Indeterminada |

## O que fazer nesta semana

1. Inventariar APIs de sistemas legado que leem cadastro vivo — dono: segurança + TI.
2. Revisar logs de consulta por credencial nas janelas 18–22/09 — dono: SOC.
3. Sinal: lista de registros alcançados pronta para eventual notificação.
