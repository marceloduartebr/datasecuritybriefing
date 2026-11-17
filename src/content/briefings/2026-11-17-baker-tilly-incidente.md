---
title: "Baker Tilly notifica vazamento de SSNs em plataforma de fornecedor"
description: "Dados de clientes e dependentes saíram do ambiente de um terceiro; a empresa ainda não divulgou o total de afetados."
pubDate: 2026-11-17T15:50:00-03:00
sourceName: "SC Media"
sourceUrl: "https://www.scworld.com/brief/baker-tilly-data-breach-exposes-client-information"
cover: "https://covers.duarte.top/covers/20261116-baker-tilly-incidente.jpg"
tipo: incidente
tags: ["vazamento", "terceiros", "eua"]
pais: us
---

Em uma linha: o dado saiu do fornecedor, mas a conta de saber quem foi atingido continua sendo da Baker Tilly.

## O que aconteceu
A Baker Tilly Advisory Group, firma de contabilidade e consultoria dos EUA (receita anual de US$ 6,8 bilhões), está notificando clientes e dependentes sobre um vazamento descoberto em 6 de setembro de 2026. Um agente não autorizado acessou dados guardados numa plataforma operada por um prestador de serviço terceiro, cujo nome não foi divulgado. Foram expostos nome completo, endereço e número do Social Security. O registro no Procurador-Geral do Texas indica 10.456 pessoas só naquele estado; há avisos também na Califórnia e na Carolina do Sul. O total não foi divulgado. A empresa afirma que o incidente ocorreu no ambiente do terceiro, não na sua rede, contratou especialistas, avisou a polícia e oferece 24 meses de monitoramento via Experian. Não há relato de uso indevido nem reivindicação de grupo de ransomware. A notícia é da SC Media (12/11), com base na BleepingComputer; o aviso oficial não foi relido para este briefing.

## Por que importa
Firmas de contabilidade concentram identificadores fiscais de clientes e de seus dependentes. Quando esses dados ficam numa plataforma de terceiro, o incidente acontece fora do perímetro, mas a obrigação de notificar e de dimensionar o alcance continua com quem coletou o dado.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Plataforma de terceiro | Acesso não autorizado no ambiente do fornecedor | Alta |
| Identificador fiscal (SSN) | Nome, endereço e SSN expostos, inclusive de dependentes | Alta |
| Alcance indefinido | Total não divulgado; notificações por estado | Média |

## O que fazer nesta semana
1. Listar os fornecedores que armazenam dados pessoais de clientes e quais campos cada um recebe — dono: privacidade/DPO.
2. Confirmar em contrato prazo de aviso de incidente e direito de obter a lista de registros afetados — dono: jurídico e compras.
3. Sinal de que funcionou: para qualquer fornecedor, responder em horas quantos titulares e quais campos estão no ambiente dele.
