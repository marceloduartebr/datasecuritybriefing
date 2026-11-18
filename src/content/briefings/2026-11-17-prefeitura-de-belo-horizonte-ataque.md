---
title: "Belo Horizonte confirma ataque ao sistema de guias e manda reemitir cobranças de dois dias"
description: "Guias emitidas entre 14 e 16 de novembro não devem ser pagas; a prefeitura enviou aos bancos a lista dos documentos afetados."
pubDate: 2026-11-17T21:42:00-03:00
sourceName: "CNN Brasil"
sourceUrl: "https://www.cnnbrasil.com.br/nacional/sudeste/mg/prefeitura-de-bh-confirma-ataque-cibernetico-a-sistema-de-emissao-de-guias/"
cover: "https://covers.duarte.top/covers/stg-20261117-prefeitura-de-belo-horizonte-ataque-2034.jpg"
tipo: incidente
tags: ["ataque-cibernetico", "setor-publico", "pix", "integridade", "brasil"]
pais: br
---

**Em uma linha:** quando o ataque atinge a integridade de documentos de cobrança, a resposta depende de saber exatamente quais registros saíram do sistema durante a janela do incidente.

## O que aconteceu
Em 16 de novembro de 2026, a Prefeitura de Belo Horizonte confirmou que o sistema municipal de emissão de guias de pagamento foi alvo de um ataque cibernético. Guias geradas entre a madrugada de sábado (14) e a manhã de segunda-feira (16) não devem ser pagas; o contribuinte deve emitir nova guia pelo Portal de Serviços ou pelo aplicativo BH SIM. Os vencimentos foram prorrogados para quinta-feira (19). Segundo a prefeitura, pagamentos por código de barras e débito automático não foram afetados. Quem pagou via Pix deve conferir se o beneficiário é o Município de Belo Horizonte e, se não for, procurar o banco e pedir o Mecanismo Especial de Devolução (MED). A polícia foi acionada e as instituições financeiras receberam a lista das guias afetadas. O serviço foi restabelecido. A prefeitura não divulgou o número de guias ou contribuintes atingidos.

## Por que importa
Guias de tributo carregam nome, documento e dados de pagamento do contribuinte e circulam fora do sistema que as gerou. Um ataque à integridade desse fluxo transforma um serviço público confiável em vetor de fraude, e o efeito continua depois que o sistema volta ao ar.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Comprometimento do sistema de emissão de guias | Confirmado pela prefeitura em 16/11 | Alta |
| Pagamento via Pix a beneficiário indevido | Prefeitura orienta conferência do beneficiário e uso do MED | Alta |
| Escala de contribuintes afetados | Não divulgada | Indeterminada |

## O que fazer nesta semana
1. Mapear todos os sistemas que geram documentos de cobrança (boleto, Pix, fatura) e confirmar que cada emissão fica registrada com horário, destinatário e dado de pagamento — dono: arquitetura de dados.
2. Definir o procedimento para gerar, em horas, a lista de documentos emitidos em uma janela de incidente e enviá-la a bancos e clientes — dono: resposta a incidentes com jurídico.
3. Sinal de que funcionou: um teste de mesa em que a lista de uma janela de 48 horas sai completa em menos de um dia.