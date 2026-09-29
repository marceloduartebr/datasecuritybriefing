---
title: "FBI: ShinyHunters alega invasão via Oracle PeopleSoft; FBI investiga sem confirmar"
description: "O grupo diz ter roubado dados de quase todos os agentes e candidatos pelo portal FBIJobs.gov; o FBI confirma a investigação, mas diz que o ponto de invasão, terceiro ou ambiente próprio, ainda não foi determinado."
pubDate: 2026-09-29T10:12:00-03:00
sourceName: "Cybersecurity Dive"
sourceUrl: "https://www.cybersecuritydive.com/news/fbi-hack-shinyhunters-jobs-portal/831175/"
cover: "https://covers.duarte.top/covers/20260925-fbi-shinyhunters.jpg"
tipo: incidente
tags: ["incidente", "alegacao", "risco-de-terceiros", "oracle-peoplesoft", "estados-unidos"]
notionUrl: "https://www.notion.so/3e6174117473812491f1c2c1a23d4361"
---

Em uma linha: o ShinyHunters alega ter invadido o portal de vagas do FBI por uma falha no Oracle PeopleSoft e roubado dados de agentes e candidatos; o FBI investiga, mas não confirmou a invasão nem determinou se a origem foi um terceiro ou o próprio ambiente.

## O que aconteceu

Confirmado pelo FBI. Em nota na quarta-feira (23/09/2026), o FBI disse estar ciente de um grupo cibercriminoso que alega ter comprometido o portal FBIJobs.gov, com suposto impacto em dados pessoais (PII) de funcionários. Segundo a agência, o ponto de invasão ainda não foi determinado, se em um terceiro ou no ambiente do FBI, e a investigação ocorre em conjunto com os fornecedores que dão suporte ao portal para mitigar o risco. O portal está fora do ar, com um aviso de indisponibilidade.

Alegado pelo ShinyHunters, sem confirmação do FBI. Em seu site de vazamentos, o grupo afirmou ter "dados muito sensíveis de quase TODOS os agentes do FBI" e de quem se candidatou a uma vaga, e listou serviços que diz ter atingido: Criminal Justice (CJ), RH, Medlink e outros. Ao 404 Media, o grupo disse ter entrado no portal por uma zero-day no Oracle PeopleSoft, plataforma de RH. O ShinyHunters diz que o ataque foi retaliação às descrições feitas pelo FBI em um boletim de maio e exigiu que a agência corrija ou remova os trechos.

Verificação parcial por terceiros. O 404 Media confirmou que uma amostra fornecida pelo grupo incluía informações pessoais sensíveis de agentes. Não está claro se a falha explorada é uma zero-day ou uma vulnerabilidade já divulgada, como a que a Oracle revelou em junho depois de o ShinyHunters explorá-la. A Oracle não respondeu ao pedido de comentário.

## Por que importa

Mesmo sem confirmação, o caso expõe um ponto real: o próprio FBI admite não saber ainda se a origem foi um fornecedor ou o ambiente interno. Portais de RH e de recrutamento costumam ser operados por terceiros e concentram dados pessoais de alto valor, o que os torna perímetro de fato.

O segundo ponto é a incerteza sobre a falha. Se for a vulnerabilidade divulgada em junho, a lição é de gestão de patch, não de zero-day. Cynthia Kaiser, ex-dirigente de cibersegurança do FBI, alerta para o risco de uso por atores estrangeiros e de dano físico a agentes, e lembra que a lista de um vazamento de 2016 ainda circula na dark web.

## Leitura de risco

| Dimensão | Avaliação |
|---|---|
| Confirmado pelo FBI | Investigação aberta; ponto de invasão (terceiro ou FBI) não determinado; portal fora do ar |
| Alegado pelo grupo | Dados de quase todos os agentes e candidatos; acesso a CJ, RH e Medlink; zero-day no Oracle PeopleSoft |
| Verificação independente | 404 Media confirmou dados sensíveis de agentes em uma amostra; alcance total não verificado |
| Vetor inicial | Incerto: zero-day alegada ou falha divulgada pela Oracle em junho |
| Dados potencialmente expostos | Dados pessoais de funcionários e candidatos, segundo a alegação |
| Risco residual | Alto, se confirmado: dados de agentes permitem assédio, perseguição e coleta de inteligência |

## O que fazer nesta semana

1. Liste os portais de RH e recrutamento operados por terceiros, com os dados que cada um guarda, e confirme em contrato quem entrega logs e em quanto tempo durante um incidente.
2. Inventarie as instâncias de Oracle PeopleSoft expostas à internet e confirme a aplicação das correções divulgadas pela Oracle, incluindo a de junho.
3. Sinal de que funcionou: diante de uma alegação de vazamento, você consegue dizer em horas, e não em dias, se a origem é um fornecedor ou o seu próprio ambiente.
