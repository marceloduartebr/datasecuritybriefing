---
title: "Banco Central registra 99 incidentes cibernéticos no SFN até setembro"
description: "99 casos até setembro, 73% fraudes; terceiros, certificados e APIs no centro dos eventos."
pubDate: 2026-10-29T10:21:00-03:00
sourceName: "Banco Central"
sourceUrl: "https://www.bcb.gov.br/content/publicacoes/ref/202610/RELESTAB202610-refPub.pdf"
cover: "https://covers.duarte.top/covers/20261029-banco-central-incidentes-sfn.jpg"
tipo: noticia
tags: ["ciberseguranca", "sistema-financeiro", "brasil", "terceiros"]
pais: br
notionUrl: "https://www.notion.so/40817411747381c89bc3ce6cac4333da"
---

**Em uma linha:** O SFN já superou o total de 2025 em incidentes cibernéticos, com fraudes dominando e controles de terceiros ainda incompletos.

## O que aconteceu

O Relatório de Estabilidade Financeira do Banco Central, divulgado em 27 de outubro de 2026, registra 99 incidentes cibernéticos comunicados até setembro, contra 76 em todo 2025. As fraudes respondem por 73% dos casos. Criminosos usaram acesso a fornecedores, certificados digitais não desativados após mudança de conexão, senhas de contas privilegiadas e APIs para gerar transações com aparência legítima. Em levantamento com 1.365 instituições, apenas 42% avaliam periodicamente o risco de cada fornecedor.

## Por que importa

Acesso residual de terceiro e credencial válida continuam mais eficazes do que exploit de zero-day. A política de gestão de terceiros existe; a evidência de revogação e de controle de API é o que falta na maioria dos ambientes.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Terceiro / certificado residual | Chaves obtidas em fornecedor; certificado não revogado | Alta |
| Credencial privilegiada | Senhas de funcionários e prestadores via phishing | Alta |
| API sem autorização | Ordens de transferência fora do fluxo normal | Alta |
| Avaliação de fornecedor | 42% revisam risco periodicamente | Média |

## O que fazer nesta semana

1. Inventariar certificados e chaves de acesso a sistemas de pagamento e APIs críticas — dono: operações / IAM.
2. Confirmar que todo fornecedor com acesso privilegiado tem avaliação de risco atualizada e que credenciais são revogadas no mesmo dia da mudança — dono: risco de terceiros.
3. Sinal de que funcionou: relatório de certificados ativos sem justificativa de uso e lista de APIs sem controle de autorização zerada ou com plano datado.
