---
title: "Ransomware na CRIBA: construtora argentina-uruguaia no leak site da DragonForce"
description: "Em 24 de agosto a DragonForce listou a CRIBA em site de vazamentos. A empresa ainda não se pronunciou; credenciais de funcionários já circulavam em bases de infostealer."
pubDate: 2026-09-09T10:30:00-03:00
sourceName: "Ransomware.live / HudsonRock"
sourceUrl: "https://ransomware.live/id/Q3JpYmFAZHJhZ29uZm9yY2U="
cover: "https://covers.duarte.top/covers/20260830-criba-ransomware.jpg"
pais: ar
tipo: incidente
tags: ["vazamento", "ransomware", "argentina", "uruguai", "infostealer"]
notionUrl: "https://www.notion.so/3c8174117473817fac62f2605910a63a"
---

**Em uma linha:** a listagem no leak site chegou depois de credenciais de funcionários já estarem à venda — o sinal existia antes do ransomware.

## O que aconteceu

Em 24 de agosto de 2026, o grupo DragonForce incluiu a CRIBA — uma das maiores construtoras da Argentina, com operação também no Uruguai — em seu site de vazamentos. A reivindicação fala em documentos financeiros, dados de clientes e informações operacionais de projetos nos dois países. Até este briefing, a empresa não se pronunciou publicamente sobre alcance nem exfiltração.

Inteligência de infostealers (HudsonRock) aponta credenciais de ao menos dois funcionários da CRIBA circulando antes do ataque, além de dezenas de contas associadas à empresa. Leak site não é confirmação da vítima.

## Por que importa

Construção civil raramente entra na conversa de dados. Uma construtora que cresce país a país costuma espalhar contratos, financeiro e cadastro de cliente em sistemas locais, cada um com o próprio nível de proteção. A superfície aumenta sem que alguém tenha desenhado isso.

O padrão que se repete não é a falta de antivírus: é não ver credenciais de funcionário já comprometidas meses antes da fase de ransomware.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Exfiltração | Só reivindicação em leak site | Indeterminada |
| Credenciais pré-ataque | Infostealer (HudsonRock) | Média |
| Operação AR/UY | Dois países, sem pronunciamento | Indeterminada |

## O que fazer nesta semana

1. Cruzar contas corporativas com bases de infostealer antes de tratar o ransomware como evento isolado — dono: SecOps.
2. Mapear onde contrato, financeiro e dado de cliente ficam em cada país — dono: dono do dado / DPO.
3. Sinal de que funcionou: listar, em horas, quais identidades já tinham vazado e em quais sistemas elas ainda autenticam.
