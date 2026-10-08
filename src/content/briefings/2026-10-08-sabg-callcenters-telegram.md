---
title: "SABG investiga oferta de 12,9 milhões de registros de call centers"
description: "Telegram de 22/09 com bases atribuídas a call centers; amostra de 13 mil linhas cita bancos e varejo. Marca no arquivo não é prova de breach."
pubDate: 2026-10-08T10:16:00-03:00
sourceName: "SABG"
sourceUrl: "https://www.gob.mx/buengobierno/prensa/buen-gobierno-investiga-presunta-venta-de-mas-de-12-9-millones-de-registros-con-datos-personales"
cover: "https://covers.duarte.top/covers/20260930-sabg-callcenters-telegram.jpg"
tipo: incidente
tags: ["vazamento", "mexico", "terceiros", "call-center"]
pais: mx
notionUrl: "https://www.notion.so/3eb17411747381e6b600eeabf8dec4b4"
---

Em uma linha: A SABG achou no Telegram uma oferta de 12,9 milhões de registros atribuídos a call centers e abriu investigação sem confirmar breach nas marcas citadas.

## O que aconteceu

Comunicado 113, 24/09/2026. Publicação no Telegram em 22/09 oferecia bases de call centers com nome, contato, nascimento, RFC, domicilio e dados bancários. Amostra: 13 mil registros / 13 bases. Nomes comerciais na amostra incluem Amazon, Amex, Afirme, Banamex, BanBajío, BBVA, Banorte, Banregio, HSBC, Inbursa, INVEX, Liverpool, Sam’s Club, Santander, Scotiabank, Sears, Suburbia, Banco Walmart, Credomatic, IXE, Sanborns, C&A e Soriana. Fato distinto do caso Aeroméxico (15 milhões, 18/09).

## Por que importa

A cadeia de atendimento telefônico replica o cadastro do cliente. Sem evidência de origem, a investigação cai no processador — e o controlador ainda precisa mapear o que o terceiro podia exportar.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Oferta em messaging | Comunicado SABG | Alta |
| Dado bancário + RFC | Descrição da oferta | Alta |
| Atribuição às marcas | Não confirmada pela autoridade | Indeterminada |

## O que fazer nesta semana

1. Pedir ao processador de contact center log de exportação 01–22/09 — dono: DPO + compras.
2. Confrontar amostra pública (quando houver) com hash de bases internas — dono: segurança.
3. Sinal: lista de processadores com acesso a RFC/dado bancário atualizada.
