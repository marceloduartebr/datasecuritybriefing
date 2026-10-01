---
title: "Hospital Clínico da U. de Chile: a ANCI viu o exame antes do hospital"
description: "Querela em Santiago depois que a ANCI apontou 120 GB de exames de imagenologia num fórum. O alcance ainda não está fechado."
pubDate: 2026-10-01T10:12:00-03:00
sourceName: "T13"
sourceUrl: "https://www.t13.cl/noticia/nacional/hospital-clinico-chile-querella-tras-ciberataque-filtracion-informacion-confidencial-30-9-2026"
cover: "https://covers.duarte.top/covers/20261001-hospital-clinico-uchile-imagem.jpg"
tipo: incidente
pais: cl
tags: ["vazamento", "saude", "chile", "terceiro"]
notionUrl: "https://www.notion.so/3ec174117473816d8b73ef6be335a29f"
---

Em uma linha: o hospital só confirmou o vazamento de exames depois que a ANCI apontou o fórum.

## O que aconteceu

Em 30 de setembro de 2026, o T13 noticiou a querela do Hospital Clínico da Universidade de Chile no 3º Juizado de Garantia de Santiago, por acesso ilícito e receptação de dados informáticos. A ação descreve invasão do Serviço de Imagenologia na plataforma RIS/PACS. A ANCI avisou a universidade em 20 de setembro sobre a publicação “Red Clinica Chile 120 GB”. A amostra conferida pelo administrador bateu com pacientes do hospital: RUT, nome, sexo, idade, data de nascimento, data e hora do exame, modalidade, médico solicitante e resultados. O alcance total não foi fechado. A conta comprometida foi desabilitada e a consulta externa foi suspensa. O fornecedor citado é a AGFA.

## Por que importa

O sistema de imagem ficou fora do radar interno. A primeira evidência pública veio da autoridade, não do monitoramento do hospital. Contrato com o fornecedor não prova quais exames saíram.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Conta de serviço no RIS/PACS | Querela e desativação da conta | Alta |
| Publicação em fórum | Alerta da ANCI em 20/09; amostra confirmada pelo hospital | Alta |
| Terceiro (AGFA) | Hospital acionou o fornecedor para contenção | Média |
| Alcance total | Ainda não determinado na querela | Indeterminada |

## O que fazer nesta semana

1. Listar contas de serviço do RIS/PACS e quem as usa — operação de imagem.
2. Cruzar log de exportação de exame com o inventário de titulares — segurança e privacidade.
3. Sinal: cada exportação fora do horário tem dono e volume, sem depender de alerta externo.
