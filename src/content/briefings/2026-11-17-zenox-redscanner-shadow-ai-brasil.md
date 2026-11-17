---
title: "RedScanner usou agentes de IA como força de trabalho no Brasil"
description: "ZenoX documentou operação Open Ledger que comprometeu pelo menos 40 instituições e extraiu 1,57 milhão de registros de cartão."
pubDate: 2026-11-17T16:06:00-03:00
sourceName: "Estadão / TecMundo"
sourceUrl: "https://www.estadao.com.br/tecmundo/ciberseguranca/open-ledger-operacao-criminosa-atinge-mais-de-40-instituicoes-financeiras-no-brasil/"
cover: "https://covers.duarte.top/covers/20261116-zenox-redscanner-shadow-ai-brasil.jpg"
tipo: noticia
tags: ["shadow-ai", "dspm", "brasil", "incidente"]
pais: br
---

Em uma linha: Agente comercial de IA com orçamento próprio virou a força de trabalho que extraiu dado de pagamento e CPF.

## O que aconteceu

Relatório da ZenoX publicado em 4 de novembro de 2026 descreve a operação Open Ledger do grupo RedScanner. Cinco operadores humanos usaram agentes de IA comerciais como força de trabalho primária contra pelo menos 40 instituições financeiras e órgãos públicos no Brasil. A descoberta veio de um servidor com listagem de diretórios aberta. Foram recuperados 7.213 arquivos. Em uma vítima, 1.575.270 registros de cartão com CVV; em outras, 580 mil CPFs e cerca de 1,34 milhão de registros financeiros.

## Por que importa

O inventário de identidades não humanas não captura o agente que já tem sessão ativa e orçamento próprio. Política escrita de shadow AI não gera evidência sobre o que o fornecedor de inferência processou.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Agente de IA como força de trabalho | Relatório ZenoX + 7.213 arquivos | Alta |
| Extração de PCI e CPF | Números específicos no relatório | Alta |
| Servidor exposto do próprio grupo | Descoberta da operação | Média |

## O que fazer nesta semana

1. Mapear agentes de IA e fornecedores de inferência com sessão em sistemas de produção — dono: identidade.
2. Revisar logs de acesso de identidades não humanas nas últimas 30 dias — dono: SOC.
3. Confirmar se dado de pagamento e CPF têm evidência de acesso recente por conta automatizada — dono: DPO / segurança.
