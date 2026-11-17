---
title: "Maileva: 22 milhões de destinatários expostos por um operador de correspondência"
description: "A subsidiária da La Poste levou dois meses para confirmar o volume de um roubo de nomes e endereços feito em setembro."
pubDate: 2026-11-17T16:08:00-03:00
sourceName: "Euronews"
sourceUrl: "https://fr.euronews.com/2026/11/15/cyberattaque-sur-maileva-filiale-de-la-poste-22-millions-de-personnes-touchees-par-des-vol"
cover: "https://covers.duarte.top/covers/stg-20261117-maileva-la-poste-vazamento-0840.jpg"
tipo: incidente
tags: ["vazamento", "gdpr", "terceiros", "franca"]
pais: eu
---

**Em uma linha:** quem terceiriza o envio de correspondências terceiriza também a guarda dos dados dos destinatários, e a resposta a um incidente passa a depender do operador.

## O que aconteceu

A Maileva, subsidiária da Docaposte, do grupo La Poste, sofreu um ciberataque em meados de setembro de 2026. A empresa imprime e envia correspondências de clientes corporativos, como contracheques, cartas registradas e faturas. Em 14 de novembro, a La Poste confirmou à AFP que nomes, sobrenomes e endereços postais de cerca de 22 milhões de pessoas foram roubados, segundo a Euronews. Dados bancários não teriam sido atingidos.

A Maileva informou ter notificado a CNIL e registrado queixa; uma investigação judicial está em andamento. Segundo o site Cyberattaque.org, citado pela Euronews, estão entre os afetados destinatários de empresas de habitação social, de laboratórios de análises clínicas do grupo Inovie e pacientes do Hôpital Foch, por meio de um subcontratado.

## Por que importa

Os titulares não tinham relação direta com a Maileva: o dado chegou ao operador por meio de hospitais, laboratórios e outras empresas. Para cada um desses controladores, a pergunta sobre quem precisa ser avisado depende de informação que está com o prestador. O intervalo de dois meses entre o ataque e a confirmação do volume mostra o custo dessa dependência.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Base de rastreamento no operador | Terceiro acessou base de rastreamento de correspondências | Alta |
| Cadeia de subcontratação | Pacientes de hospital atingidos via subcontratado | Alta |
| Uso dos dados para phishing | Nomes e endereços de 22 milhões de pessoas | Média |

## O que fazer nesta semana

1. Mapear os operadores que recebem dados pessoais de clientes, com finalidade e prazo de retenção de cada um — dono: encarregado de dados.
2. Incluir nos contratos com esses operadores prazos de aviso e o fornecimento da lista de titulares afetados em caso de incidente — dono: jurídico e gestão de terceiros.
3. Sinal de que funcionou: diante do incidente de um operador, a empresa sabe no mesmo dia quais clientes tiveram dados enviados a ele.
