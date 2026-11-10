---
title: "TJMA confirma saída de dados pessoais e bancários de servidores e ex-servidores"
description: "Tribunal levou 25 dias para comunicar o incidente e ainda não diz quantas pessoas foram afetadas, com registros desde 2010 no mesmo ambiente."
pubDate: 2026-11-10T10:18:00-03:00
sourceName: "Tribunal de Justiça do Maranhão (TJMA)"
sourceUrl: "https://www.tjma.jus.br/midia/tj/noticia/523759/comunicado-de-incidente-de-seguranca"
cover: "https://covers.duarte.top/covers/20261110-tjma-incidente.jpg"
tipo: incidente
pais: br
tags: ["vazamento", "setor-publico", "lgpd", "retencao", "brasil"]
notionUrl: "https://www.notion.so/41317411747381948299cda0ef2a88eb"
---

Em uma linha: quando dado bancário, filiação e credencial de acesso de ex-servidores de 2010 estão no mesmo ambiente dos sistemas ativos, o incidente vira um problema de retenção, não só de perímetro.

## O que aconteceu
Em comunicado de 07/11/2026, o TJMA informou que identificou em 13/10/2026 um incidente cibernético no ambiente dos sistemas SISRH, SCO, E-POP e E-SIG, com transferência externa de arquivos contendo bases de dados. Segundo o tribunal, foram afetados dados de servidores e ex-servidores (registros desde 2010): nome, matrícula, CPF e identidade, data de nascimento, endereço, telefone, e-mail, filiação, PIS/PASEP, informações bancárias e funcionais e informações de acesso e autenticação. O TJMA diz que a investigação não confirmou dados sensíveis, isolou o servidor, preservou evidências, acionou a polícia e a empresa responsável pelos sistemas e está comunicando os titulares. Não informou o número de afetados nem o autor. Um post em leak site atribui o caso ao Rhysida, mas o vincula a um tribunal de Minas Gerais; não há confirmação.

## Por que importa
O conjunto de campos permite fraude bancária, abertura de contas e phishing dirigido a servidores. A presença de credenciais de acesso amplia o risco para outros sistemas se houver reutilização de senha. E a profundidade histórica (2010) indica bases antigas sem descarte ou segregação.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Exfiltração de bases de RH | Comunicado do TJMA | Alta |
| Credenciais de acesso vazadas | Comunicado do TJMA | Alta |
| Retenção de ex-servidores desde 2010 | Comunicado do TJMA | Média |
| Atribuição a Rhysida | Leak site, não confirmado | Indefinida |

## O que fazer nesta semana
1. Mapear onde estão dados bancários e de identificação de ex-funcionários e qual a base legal para mantê-los — DPO e RH.
2. Forçar troca de credenciais dos sistemas de RH e checar reutilização em outros serviços — TI/IAM.
3. Sinal de que funcionou: conseguir responder, por sistema, quantos titulares e quais campos estão expostos em caso de incidente.

Nota de apuração: fonte não relida nesta etapa; fatos conforme registro do radar DSB em 09/11/2026.