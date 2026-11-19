---
title: "PBH confirma ataque ao sistema de guias e pede reemissão de boletos"
description: "Dois dias de guias de tributos sob suspeita; a prefeitura mandou aos bancos a lista dos documentos afetados, mas ainda não diz quantos são."
pubDate: 2026-11-19T08:33:00-03:00
sourceName: "Diário do Comércio"
sourceUrl: "https://diariodocomercio.com.br/economia/pbh-ataque-hacker/"
cover: "https://covers.duarte.top/covers/20261119-prefeitura-belo-horizonte-ataque-0803.jpg"
tipo: incidente
pais: br
tags: ["ataque-cibernetico", "setor-publico", "pix", "brasil"]
---

**Em uma linha:** quando o atacante mexe no documento de cobrança, a pergunta deixa de ser "vazou?" e passa a ser "quais registros saíram adulterados e para quem?".

## O que aconteceu
Em 16 de novembro de 2026, a Prefeitura de Belo Horizonte confirmou que o sistema de emissão de guias de pagamento de tributos sofreu um ataque cibernético, depois de informar inicialmente apenas uma falha. Guias emitidas entre a madrugada de sábado (14) e a manhã de segunda-feira (16) não devem ser pagas e precisam ser reemitidas pelo Portal de Serviços ou pelo app BH SIM. Pagamentos por Pix podem ter sido afetados: se o recebedor não for o Município, o contribuinte deve acionar o banco e pedir o Mecanismo Especial de Devolução (MED). Código de barras e débito automático não foram afetados. A PBH acionou a polícia, enviou às instituições financeiras a lista das guias afetadas e prorrogou o vencimento para 19 de novembro. O sistema foi restabelecido.

## Por que importa
O ataque atingiu a integridade de um documento oficial de cobrança, não apenas a confidencialidade de dados. A resposta só foi possível porque a prefeitura conseguiu delimitar a janela e identificar as guias emitidas nela. Ainda não há número de guias afetadas nem informação sobre exposição de dados pessoais.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Adulteração de guias com Pix | Orientação da PBH sobre recebedor diferente e MED | Alta |
| Exposição de dados de contribuintes | Não informada até o momento | A confirmar |
| Comunicação inicial como "falha" | Confirmação do ataque no mesmo dia | Média |

## O que fazer nesta semana
1. Mapear quais sistemas geram documentos de pagamento para clientes e quais dados pessoais entram neles — dono: arquitetura de dados.
2. Garantir trilha de auditoria que permita listar, por janela de tempo, cada documento emitido e seu destinatário — dono: segurança e TI.
3. Sinal de que funcionou: em um exercício, a equipe produz em menos de uma hora a lista de registros emitidos em uma janela de 48 horas.