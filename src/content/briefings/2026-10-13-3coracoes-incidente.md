---
title: "3corações: acesso não autorizado no e-commerce Mercafé"
description: "O DPO da 3corações avisou clientes do Mercafé sobre acesso a nome, CPF, telefone e pedido entre 17 e 25 de setembro."
pubDate: 2026-10-13T10:52:00-03:00
sourceName: "Grupo 3corações (comunicado do DPO)"
sourceUrl: "https://view.m.mercafe.com.br/?vawpToken=2D34GUOZOJJU5GHNNKSD5WQQMQ.100224"
cover: "https://covers.duarte.top/covers/20261013-3coracoes-incidente.jpg"
tipo: incidente
pais: br
tags: ["incidente", "ecommerce", "lgpd", "phishing"]
notionUrl: "https://www.notion.so/3f817411747381049fbfdbc08b1ff945"
---

Em uma linha: a 3corações comunicou clientes do Mercafé sobre acesso não autorizado a nome, CPF, telefone e pedido, e já vê phishing em nome da marca.

## O que aconteceu

O encarregado de dados do Grupo 3corações, Felipe Holanda Ribeiro, enviou comunicado individual a clientes do e-commerce Mercafé. O texto descreve acesso não autorizado ao ambiente da loja, operado em provedor de nuvem terceirizado, por requisições anômalas entre 17 e 25 de setembro de 2026. A empresa diz que o incidente ficou restrito a esse ambiente.

Os dados que podem ter sido acessados são nome completo, CPF, telefone celular e detalhes e status do pedido. O comunicado afirma que senhas, cartão de crédito e outras informações financeiras não foram expostos. Não informa o número de titulares nem registra, no texto ao cliente, a comunicação à ANPD.

A contenção descrita: inativação da chave de acesso comprometida em 25 de setembro, bloqueio de URLs maliciosas e contratação de empresa de inteligência para varredura e investigação. O DPO alerta para campanhas ativas de phishing por SMS que simulam promoções da marca. Contato: privacidade@3coracoes.com.br. Até 13 de outubro não há cobertura na imprensa.

## Por que importa

O risco imediato é o par CPF + telefone + pedido, não o cartão. Isso alimenta fraude cadastral e engenharia social, e a própria empresa já observa SMS em nome da marca. O ambiente é de terceiro em nuvem: a evidência útil é a chave comprometida e o escopo do provedor, não só a narrativa de contenção.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Acesso a nome, CPF, telefone e pedido | Comunicado do DPO | Alta |
| Senha, cartão, dado financeiro | Empresa afirma que não foram expostos | Baixa, segundo o controlador |
| Phishing em nome da marca | DPO relata campanhas ativas por SMS | Alta |
| Volume de titulares | Não informado | Indeterminada |
| Comunicação à ANPD | Não consta no texto ao cliente | Indeterminada |

## O que fazer nesta semana

1. Tratar SMS e WhatsApp em nome da 3corações como canal de golpe, não como suporte.
2. Pedir, se for titular, o que exatamente foi acessado e se a ANPD foi comunicada.
3. Registrar que a fonte é o comunicado do controlador, ainda sem cobertura independente.
