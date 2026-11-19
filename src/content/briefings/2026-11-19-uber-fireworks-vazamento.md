---
title: "Uber notifica 149 mil motoristas: alerta ligado não viu credencial legítima do fornecedor de IA"
description: "Dados de carteira de motorista saíram pela invasão da Fireworks AI, e os alertas da Uber não dispararam porque o acesso usou credenciais do próprio fornecedor."
pubDate: 2026-11-19T08:33:00-03:00
sourceName: "TechCrunch"
sourceUrl: "https://techcrunch.com/2026/11/16/uber-confirms-hackers-stole-thousands-of-drivers-license-information-in-data-breach/"
cover: "https://covers.duarte.top/covers/20261118-uber-fireworks-vazamento-1645.jpg"
tipo: incidente
pais: us
tags: ["vazamento", "terceiros", "inteligencia-artificial", "estados-unidos"]
---

**Em uma linha:** o elo fraco não foi a Uber nem o monitoramento: foi o volume de dados pessoais que estava num provedor de inferência de IA.

## O que aconteceu
A Uber está notificando 149.346 pessoas, conforme registro enviado ao procurador-geral do Oregon, sobre o roubo de nomes, endereços, datas de nascimento e números de carteira de motorista na invasão da Fireworks AI, provedora de inferência de modelos de IA. Segundo o TechCrunch (reportagem publicada em 13/11 e atualizada em 16/11), a Fireworks avisou a Uber em 9/10 de que invasores roubaram credenciais internas usadas para acessar os dados. Um registro em Iowa menciona imagens das carteiras e o texto extraído delas. Houve notificações também na Califórnia, em Illinois, Massachusetts, Rhode Island, Carolina do Sul, Texas e Vermont. A Uber disse que tinha alertas para acesso não autorizado ao ambiente da Fireworks, mas que nenhum disparou, porque o acesso usou credenciais internas do fornecedor. Notion e Cursor confirmaram dados levados no mesmo ataque.

## Por que importa
O caso é a continuação do incidente da Fireworks já relatado pelo Notion. Agora com outro tipo de dado: documento de identidade, que não se troca como uma senha. E com um detalhe operacional: o monitoramento existia e não serviu, porque a sessão parecia legítima.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Credenciais internas do fornecedor roubadas | Fireworks avisou a Uber em 9/10 | Alta |
| Dados de identidade em provedor de inferência | Imagens e números de carteira de motorista | Alta |
| Monitoramento cego a acesso com credencial válida | "Nenhum alerta disparou", segundo a Uber | Média |

## O que fazer nesta semana
1. Listar quais fornecedores de IA recebem dados pessoais, de que tipo e com qual retenção — DPO e arquitetura de dados.
2. Remover dos fluxos de IA os campos que não são necessários para o caso de uso (documentos, números de identificação) — dono do produto e engenharia.
3. Sinal de que funcionou: para cada fornecedor de IA, a empresa responde em minutos quais registros pessoais estão lá hoje.