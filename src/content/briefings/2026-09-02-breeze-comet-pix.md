---
title: "BREEZE COMET opera Pix, STR e boleto por dentro das empresas brasileiras"
description: "GTIG e Mandiant descrevem ator financeiro que entra em bancos, processadoras e fintechs no Brasil para emitir ordens no trilho de pagamento — não para roubar cadastro."
pubDate: 2026-09-02T10:12:00-03:00
sourceName: "Google Cloud / GTIG / Mandiant"
sourceUrl: "https://cloud.google.com/blog/topics/threat-intelligence/financially-motivated-threat-actor-breeze-comet-targets-brazil/"
cover: "https://raw.githubusercontent.com/marceloduartebr/dsb-covers/main/covers/20260901-breeze-comet-pix.jpg"
tipo: incidente
tags: ["fraude", "pix", "brasil", "identidade", "dspm"]
notionUrl: "https://www.notion.so/3ce17411747381db8b17d6e852ed4972"
---

**Em uma linha:** o alvo não é o PII do cliente; é a identidade capaz de assinar um Pix, um STR ou uma remessa.

## O que aconteceu

Na terça (1/09/2026), o Google Threat Intelligence Group e a Mandiant descreveram o BREEZE COMET — ator financeiramente motivado que, desde 2024, compromete bancos, processadoras, varejo e fintechs no Brasil para operar o trilho de pagamento por dentro.

O recorte não é o cadastro do titular. São organizações com permissão de transacionar: Pix, STR e boleto. Em pelo menos um caso o grupo chegou à Rede Nacional do Sistema Financeiro e, em 24 a 48 horas, disparou duas ondas com centenas de ordens fraudulentas. O Google confirma ao menos um golpe na casa das dezenas de milhares de dólares.

O caminho público raramente começa no malware. Começa em engenharia social (ligação se passando por suporte de TI), site comprometido servindo instalador ou acesso remoto “para resolver um chamado”. Só depois entra o kit próprio e a busca no diretório por termos de remessa, CNAB e webhook de Pix. Modelo de linguagem acelera o script; não inventa o golpe.

## Por que importa

Quem mapeia só dado pessoal e esquece certificado, conta de serviço e fila de remessa descobre o incidente pelo extrato. O ativo que saiu não estava no inventário de PII. Estava na identidade com poder de emitir ordem.

Inventário de titular não substitui inventário de quem — humano ou máquina — consegue assinar uma transferência.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Acesso inicial por engenharia social / remoto | Descrito por GTIG/Mandiant | Alta |
| Emissão de Pix/STR/boleto a partir de identidade interna | Confirmado em pelo menos um caso (RNSF, duas ondas) | Alta |
| Uso de LLM no script do golpe | Citado como acelerador, não como origem | Média |

## O que fazer nesta semana

1. Listar identidades (humanas e de serviço) com permissão de emitir Pix, STR ou remessa CNAB — dono: tesouraria + IAM.
2. Marcar contas órfãs, compartilhadas ou sem dono claro nessa lista e suspender até evidência de necessidade — dono: IAM.
3. Sinal de que funcionou: qualquer ordem atípica no trilho aponta para uma identidade nomeada, não para “o sistema de pagamento”.
