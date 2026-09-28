---
title: "TJMT: ataque derruba o PJe e expõe credenciais de usuários"
description: "Inserção indevida de um modelo de documento abriu a brecha; logins e senhas criptografadas foram acessados e os prazos ficaram suspensos de 23 a 25 de setembro."
pubDate: 2026-09-28T10:14:00-03:00
sourceName: "Convergência Digital"
sourceUrl: "https://convergenciadigital.com.br/seguranca/no-tribunal-do-mato-grosso-hackers-usam-brecha-para-acessar-logins-e-senhas-criptografadas-dos-usuarios/"
cover: "https://covers.duarte.top/covers/20260925-tjmt-incidente.jpg"
tipo: incidente
tags: ["incidente", "credenciais", "poder judiciario", "brasil", "continuidade"]
notionUrl: "https://www.notion.so/3e6174117473810a9f3cd611b0384003"
---

**Em uma linha:** um modelo de documento inserido indevidamente no domingo abriu a brecha que derrubou os sistemas do Tribunal de Justiça de Mato Grosso e expôs logins e senhas criptografadas de usuários.

## O que aconteceu

Segundo a Coordenadoria de Tecnologia da Informação (CTI) do TJMT, a inserção indevida de um modelo de documento no sistema, na tarde de domingo (20/09/2026), abriu uma brecha na estrutura. Os invasores exploraram essa falha, acessaram a rede e derrubaram os serviços na segunda-feira (21). O Tribunal tirou do ar os principais sistemas institucionais, incluindo o Processo Judicial Eletrônico (PJe).

Em nota publicada na quarta-feira (23), o TJMT confirmou que logins e senhas criptografadas de usuários foram acessados. Até o momento, afirma o Tribunal, não há evidências de acesso a outros dados pessoais de servidores e magistrados, a decisões judiciais ou aos backups. Todas as senhas estão sendo redefinidas e os acessos sensíveis foram restringidos, com apoio de parceiros especializados.

A Portaria TJMT/PRES de 22/9/2026 suspendeu o expediente no dia 23 para testes e homologação e manteve apenas expediente interno nos dias 24 e 25, com atendimento ao público em regime de plantão. Os prazos processuais estão suspensos de 23 a 25 de setembro, audiências e sessões serão redesignadas, e peticionamento e consulta processual seguem indisponíveis. A execução penal funciona normalmente pelo SEEU, que não foi afetado. Os sistemas voltarão de forma gradual, após testes.

## Por que importa

Pelo relato do próprio Tribunal, a porta de entrada foi um conteúdo inserido indevidamente no sistema. Modelos de documento, macros e templates costumam passar por fora da gestão de mudanças, e é exatamente por isso que viram porta de entrada.

O segundo ponto é a credencial. Senha criptografada acessada continua sendo credencial exposta: o risco depende do algoritmo, do sal e da velocidade da redefinição. Para um tribunal, a indisponibilidade tem custo direto sobre prazos, audiências e acesso à Justiça, o que torna a continuidade tão importante quanto a confidencialidade.

## Leitura de risco

| Dimensão | Avaliação |
|---|---|
| Vetor inicial | Inserção indevida de modelo de documento no sistema (domingo, 20/09) |
| Dados expostos | Logins e senhas criptografadas de usuários da rede |
| Dados pessoais, decisões e backups | Sem evidência de acesso até o momento, segundo o TJMT |
| Impacto operacional | Alto: PJe e sistemas fora do ar, prazos suspensos de 23 a 25/09 |
| Contenção | Redefinição de todas as senhas e restrição de acessos sensíveis |
| Risco residual | Médio: reuso de credenciais e retorno gradual ainda em teste |

## O que fazer nesta semana

1. Coloque modelos de documento, macros e templates sob gestão de mudanças: dono definido, revisão antes da produção e registro de quem inseriu o quê e quando.
2. Revise o armazenamento de senhas (algoritmo e sal), exija MFA nos acessos à rede e configure alerta para login fora do padrão após qualquer redefinição em massa.
3. Sinal de que funcionou: uma inserção de template fora do horário ou sem aprovação gera alerta no mesmo dia, e você sabe listar quais serviços críticos continuam operando se a rede principal cair.
