---
title: "CPR da Dinamarca: 8,8 milhões via acesso de terceiro"
description: "Terceiros abusaram da consulta legítima de uma empresa ao registro civil e alcançaram nome, endereço e número de 8,8 milhões de pessoas."
pubDate: 2026-10-08T10:17:00-03:00
sourceName: "Ministério da Digitalização da Dinamarca"
sourceUrl: "https://via.ritzau.dk/pressemeddelelse/15205753/omfattende-uautoriseret-adgang-til-borgeres-cpr-oplysninger"
cover: "https://covers.duarte.top/covers/20261007-cpr-dinamarca-terceiro.jpg"
tipo: incidente
pais: eu
tags: ["gdpr", "terceiro", "registro-civil", "europa"]
notionUrl: "https://www.notion.so/3f2174117473812aa9a6e1807024e69a"
---

Em uma linha: acesso legítimo de terceiro, sem alarme de volume, expôs o número de identificação de 8,8 milhões de pessoas.

## O que aconteceu

Em 5 de outubro de 2026, a administração do Det Centrale Personregister informou acesso não autorizado a nome, endereço e número CPR de cerca de 8,8 milhões de registrados (vivos, emigrados e falecidos). O abuso usou o acesso legal de uma empresa dinamarquesa. A administração cortou esse acesso, avisou o Datatilsynet e a polícia investiga. Proteção de nome e endereço ficou de fora do recorte. O comportamento anômalo em setembro foi notado na noite de 2 de outubro. Em 6 de outubro, o ministério atribuiu a descoberta a uma fatura anormalmente alta e disse que não havia alarme automático para aquele tipo de consulta. A empresa não foi nomeada.

## Por que importa

Contrato vigente não é evidência de uso. O dado de identificação nacional não se troca, e a trilha de volume por credencial é o que separa consulta operacional de extração.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Terceiro com acesso legal | Consulta abusada; acesso cortado | Alta |
| Identificador nacional | Cerca de 8,8 milhões de números CPR | Alta |
| Detecção | Fatura alta; sem alarme automático do método usado | Alta |

## O que fazer nesta semana

1. Dono de terceiros lista credenciais com consulta a identificador nacional.
2. Segurança confere se há alerta de volume fora do padrão, não só vencimento de contrato.
3. Sinal: um terceiro com pico de consulta gera ticket antes da fatura.
