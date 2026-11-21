---
title: "Fandango confirma skimmer no checkout que capturou dados de cartão"
description: "O código ficou ativo por quatro dias; entender quem foi afetado levou semanas."
pubDate: 2026-11-21T08:50:00-03:00
sourceName: "BleepingComputer"
sourceUrl: "https://www.bleepingcomputer.com/news/security/fandango-says-hackers-stole-payment-card-details-from-checkout-pages/"
cover: "https://covers.duarte.top/covers/20261119-fandango-skimmer-cartao-0803.jpg"
tipo: incidente
tags: ["skimming", "cartao-de-credito", "ecommerce", "estados-unidos"]
pais: us
---

**Em uma linha:** em ataques de skimming, o tempo de detecção importa menos do que o tempo para ligar a janela do ataque a cada cliente afetado.

## O que aconteceu
A Fandango Media começou a notificar clientes de que um código de skimming injetado na página de checkout do seu site oficial interceptou dados de pagamento entre 8 e 11 de outubro de 2026. A notificação, divulgada pela BleepingComputer em 16 de novembro, lista número do cartão, CVV, data de validade, CEP de cobrança e e-mail. A empresa diz que nomes, documentos de identidade e números de Social Security não foram expostos. A Fandango concluiu em 30 de outubro que dados de clientes podiam ter sido afetados, corrigiu a página com apoio de especialistas externos, não divulgou o número de afetados e oferece dois anos de monitoramento de crédito e identidade.

## Por que importa
Dados completos de cartão, incluindo CVV, permitem fraude imediata em compras online. O intervalo entre a janela do ataque e a notificação mostra que o gargalo foi delimitar quem estava exposto.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Código injetado no checkout | Notificação da Fandango | Alta |
| Exposição de cartão com CVV | Lista de dados na notificação | Alta |
| Número de afetados não divulgado | Sem resposta da empresa | Média |

## O que fazer nesta semana
1. Inventariar todos os scripts carregados nas páginas de pagamento e monitorar mudanças — dono: segurança de aplicações.
2. Garantir que seja possível listar, por janela de tempo, as transações e os clientes que passaram pelo checkout — dono: engenharia de pagamentos.
3. Sinal de que funcionou: alteração em script de pagamento gera alerta no mesmo dia e a lista de clientes da janela sai em horas.
