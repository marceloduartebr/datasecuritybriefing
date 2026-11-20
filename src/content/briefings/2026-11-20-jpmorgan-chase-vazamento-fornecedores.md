---
title: "Chase, Visa e Mastercard confirmam vazamento de dados de clientes por fornecedores"
description: "Dados de marketing guardados por terceiros expuseram clientes de três gigantes financeiras, e nenhuma delas disse quais fornecedores foram atingidos."
pubDate: 2026-11-20T12:51:00-03:00
sourceName: "The Register"
sourceUrl: "https://theregister.com/security/2026/11/19/chase-visa-mastercard-confirm-third-party-cyberattacks-that-may-have-exposed-customers-info/5311175"
cover: "https://covers.duarte.top/covers/20261120-jpmorgan-chase-vazamento-fornecedores-0813.jpg"
tipo: incidente
tags: ["vazamento", "terceiros", "servicos-financeiros", "estados-unidos"]
pais: us
---

**Em uma linha:** o dado de cliente mais exposto nem sempre está no core; está na cópia que o marketing entregou a um fornecedor.

## O que aconteceu
Em 19 de novembro de 2026, JPMorgan Chase, Visa e Mastercard confirmaram que investigam incidentes em prestadores terceiros que podem envolver informações de clientes. O grupo de extorsão n0n havia publicado as três empresas em seu site de vazamentos em 16 de novembro. O Chase disse que os atacantes acessaram dados de marketing mantidos por fornecedores, que podem incluir nomes e e-mails de clientes, e que o caso não tem relação com as instabilidades da semana. A Visa atribuiu o incidente a um prestador na Ásia-Pacífico e afirmou que nenhum dado de pagamento, como número de cartão, foi afetado. A Mastercard falou em um número limitado de e-mails de um subconjunto de portadores inscritos em um programa de benefícios. Segundo análise da Reuters, os arquivos ligados ao banco trazem mais de 16 mil e-mails de clientes, alguns com telefone e CEP. Nenhuma das empresas nomeou os fornecedores, disse quando os acessos ocorreram ou detalhou o que foi levado.

## Por que importa
Bases de marketing saem do perímetro com frequência: agências, plataformas de campanha e ferramentas de engajamento recebem cópias de dados de clientes com controles mais fracos que os do sistema principal. Nome, e-mail e histórico de campanhas de clientes de alta renda são matéria-prima de phishing direcionado. E, sem saber quais campos estavam com qual fornecedor, a empresa não consegue dimensionar nem notificar com precisão.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Fornecedor de marketing com cópia da base de clientes | Confirmação de Chase, Visa e Mastercard | Alta |
| Phishing direcionado a clientes expostos | E-mails, telefones e dados de campanha nos arquivos publicados | Média |
| Escopo desconhecido (fornecedores e datas não divulgados) | Nenhuma das empresas detalhou | Média |

## O que fazer nesta semana
1. Listar todos os fornecedores de marketing e engajamento que recebem dados de clientes e os campos enviados a cada um — dono: privacidade/DPO com marketing.
2. Revisar contratos e acessos desses fornecedores: retenção, cópias, exclusão ao fim da campanha e obrigação de notificar — dono: compras e segurança.
3. Sinal de que funcionou: para qualquer fornecedor da lista, a empresa responde em horas quais clientes e quais campos estão com ele.
