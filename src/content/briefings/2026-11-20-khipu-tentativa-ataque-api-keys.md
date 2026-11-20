---
title: "Khipu confirma tentativa de ataque e pede que comércios renovem API keys possivelmente expostas"
description: "A fintech chilena afirmou ter detectado e controlado, em 16 de novembro, um intento de ataque informático, sem fuga de dados pessoais, e pediu a comércios que renovem API keys que puderam ficar expostas."
pubDate: 2026-11-20T17:10:00-03:00
sourceName: "La Tercera"
sourceUrl: "https://www.latercera.com/pulso/noticia/fintech-khipu-reporta-ciberataque-y-pide-a-comercios-cambiar-claves/"
cover: "https://covers.duarte.top/covers/20261120-khipu-tentativa-ataque-api-keys-0813.jpg"
tipo: incidente
tags: ["ciberseguranca", "pagamentos", "chile", "cadeiadesuprimentos", "apikeys"]
pais: cl
---

Em uma linha: a Khipu disse ter contido, em 16 de novembro, um intento de ataque informático, reportou o caso à ANCI, afirmou que não houve fuga de dados pessoais e pediu que comércios renovem API keys que puderam ter sido expostas.

## O que aconteceu

Em 18 de novembro de 2026 a La Tercera publicou o teor de um comunicado da fintech chilena de pagamentos instantâneos Khipu. A empresa afirmou que, na segunda-feira (16 de novembro), detectou e controlou um intento de ataque informático contra seus serviços. Como medida preventiva, pediu aos comércios cujas API keys puderam ficar expostas que as renovem dentro de um prazo.

Segundo o comunicado, o episódio não provocou dano patrimonial nem fuga de dados pessoais ou de informação. A Khipu disse ter reportado o incidente de imediato à Agencia Nacional de Ciberseguridad (ANCI) e permanecer em contato com a autoridade. A companhia justificou não rotacionar imediatamente todas as API keys de comércios porque, com essas chaves, só é possível criar solicitações de pagamento para comércios legitimamente habilitados, e afirmou que o esforço do atacante não atingiu seus objetivos.

A empresa declarou ter rotacionado “todos os nossos segredos” (credenciais internas) e substituído cerca de 150 serviços dos quais depende a operação, sem ficar fora do ar “nem um minuto”. Não precisou quantos comércios foram notificados, qual é o prazo concedido nem de que maneira o atacante obteve o acesso inicial. Também afirmou que o atacante fracassou na tentativa de obter dinheiro.

## Por que importa

Uma API key de comércio não é um dado cadastral de cliente, mas é um atalho operacional: serve para criar cobranças no perímetro dos comércios já habilitados. A Khipu descreve contenção, rotação interna e ausência de fuga de dados pessoais, e ainda assim pede a renovação das chaves que puderam ter sido expostas. Sem o número de comércios avisados, o alcance desse recorte permanece interno.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
| --- | --- | --- |
| Intento de ataque detectado e controlado em 16/11 | Comunicado da Khipu, relatado pela La Tercera | Alta |
| API keys de comércios possivelmente expostas | Pedido oficial de renovação, prazo não divulgado | Alta |
| Fuga de dados pessoais e dano patrimonial | Empresa afirma que não ocorreu | Média |
| Rotação de segredos internos e cerca de 150 serviços | Comunicado da Khipu | Média |
| Comunicação à ANCI | Comunicado da Khipu | Média |

## O que fazer nesta semana

1. Tesouraria e pagamentos: verificar se a empresa ou algum comércio do grupo usa Khipu e, em caso afirmativo, rotacionar as API keys e revisar as solicitações de pagamento criadas a partir de 16 de novembro. Dono: pagamentos / tesouraria.
2. Segurança e terceiros: registrar o incidente no inventário de fornecedores de pagamento e pedir evidência do recorte (quais chaves, qual prazo, qual acesso inicial). Dono: segurança da informação / gestão de terceiros.
3. Monitoração de fraude: acompanhar cobranças atípicas em nome de comércios habilitados até a rotação das chaves ser concluída. Dono: antifraude / operações.