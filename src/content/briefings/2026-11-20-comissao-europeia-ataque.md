---
title: "Comissão Europeia confirma ataque com ferramenta de IA que parou sistemas de RH por mais de 10 dias"
description: "Folha de pagamento e reembolsos médicos ficaram fora do ar, e a Comissão diz não ver evidência de vazamento amplo, ainda sob investigação."
pubDate: 2026-11-20T12:50:00-03:00
sourceName: "The Record"
sourceUrl: "https://therecord.media/european-commission-confirms-cyberattack-using-ai"
cover: "https://covers.duarte.top/covers/20261120-comissao-europeia-ataque-0813.jpg"
tipo: incidente
tags: ["ataque", "inteligencia-artificial", "setor-publico", "europa"]
pais: eu
---

**Em uma linha:** "não há evidência de vazamento amplo" só vale tanto quanto o inventário de dados que permite verificá-lo.

## O que aconteceu
Em 19 de novembro de 2026, a Comissão Europeia confirmou ter sido alvo, no mês anterior, de uma campanha cibernética que envolveu uma ferramenta de inteligência artificial disponível publicamente. O porta-voz Thomas Regnier chamou o caso de "campanha cibernética gerada por IA" e disse que os primeiros sinais foram detectados em 22 de outubro. O ataque interrompeu por mais de 10 dias sistemas de pessoal, como folha de pagamento, pedidos de férias, reembolsos médicos e serviços de tradução. A Comissão tirou serviços do ar por precaução, notificou pessoas afetadas, verifica outros sistemas e trabalha com o CERT-EU e a Autoridade Europeia para a Proteção de Dados (EDPS). Segundo Regnier, não há evidência de violação ampla de dados de funcionários nem conhecimento de pedido de resgate; a investigação segue aberta. É o terceiro incidente cibernético divulgado pela Comissão em 2026, depois de casos envolvendo Ivanti em janeiro e a infraestrutura de nuvem em março.

## Por que importa
Sistemas de RH reúnem dados que não se trocam depois de expostos: dados bancários, informações de saúde ligadas a reembolsos, dependentes. Ataques apoiados por ferramentas de IA reduzem o tempo entre o acesso inicial e a coleta de dados. Nesse cenário, a capacidade de afirmar o que foi ou não acessado depende de saber previamente onde esses dados estão e quem os lê.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Intrusão automatizada com ferramenta de IA | Confirmação da Comissão Europeia | Alta |
| Indisponibilidade de sistemas de pessoal | Mais de 10 dias sem folha, férias e reembolsos | Alta |
| Exposição de dados de funcionários | Sem evidência de violação ampla; investigação aberta | Média |

## O que fazer nesta semana
1. Mapear onde estão os dados de RH (folha, saúde, dependentes, dados bancários), incluindo cópias em fornecedores — dono: RH com privacidade/DPO.
2. Garantir logs de acesso a esses repositórios com retenção suficiente para reconstruir um incidente de semanas — dono: segurança.
3. Sinal de que funcionou: a equipe consegue dizer, em um exercício, quais registros um usuário comprometido poderia ler.
