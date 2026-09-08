---
title: "McKesson: incidente em apps de terceiros e alegação de ~284 milhões de registros"
description: "Distribuidora confirma acesso a aplicações de terceiros; ShinyHunters fala em volume bruto de linhas de paciente em Salesforce/Snowflake."
pubDate: 2026-09-08T10:35:00-03:00
sourceName: "BleepingComputer / McKesson"
sourceUrl: "https://www.bleepingcomputer.com/news/security/mckesson-discloses-breach-after-shinyhunters-claims-patient-data-theft/"
cover: "https://raw.githubusercontent.com/marceloduartebr/dsb-covers/main/covers/20260830-mckesson-incidente.jpg"
tipo: incidente
tags: ["vazamento", "saude", "terceiros", "dspm", "lgpd"]
notionUrl: "https://www.notion.so/3cc17411747381da9750c43849ca10be"
---

**Em uma linha:** Detectar o acesso em app de terceiro é uma coisa; mapear, registro a registro, o que saiu de um tenant que não é o sistema oficial da operação é outra.

## O que aconteceu

Em 28 de agosto de 2026 a McKesson — uma das maiores distribuidoras de medicamentos e insumos hospitalares dos EUA — comunicou incidente descoberto em 25/08: acesso não autorizado a aplicações de terceiros e extração de dados. No dia seguinte atualizou que o recorte confirmado até então estava em um subconjunto de clientes das unidades Oncology & Multispecialty e Medical-Surgical.

O grupo ShinyHunters afirma ter levado cerca de 1 TB em quatro dias (21 a 25/08) de ambientes Salesforce e Snowflake e fala em aproximadamente 284 milhões de registros relacionados a pacientes — nomes, datas de nascimento, SSN, prontuário, medicação, alergia, consultas. O próprio grupo disse à BleepingComputer que o número é contagem bruta de linhas, não de indivíduos únicos, e que ainda não fechou o inventário. A McKesson não confirmou o volume nem os sistemas nomeados; o 8-K diz que, na data do filing, o incidente não foi classificado como material.

## Por que importa

O ponto não é o tamanho do número alegado. É o intervalo entre detectar o acesso e saber, registro a registro, o que saiu de um aplicativo que não é o sistema oficial da operação. Quando o dado clínico mora em nuvem de terceiro, a política da controladora não substitui o mapa técnico do que aquele tenant realmente guarda.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Acesso a apps de terceiros | Confirmado pela McKesson (8-K) | Alta |
| Volume ~284 milhões de linhas | Alegação ShinyHunters; empresa não confirma | Indeterminada |
| Dados clínicos em Salesforce/Snowflake | Alegação do grupo; não confirmada | Indeterminada |

## O que fazer nesta semana

1. Listar bases de paciente — próprias e de fornecedor — que um token de SSO válido consegue enxergar — dono: segurança / privacidade.
2. Exigir inventário técnico do tenant de cada SaaS clínico (objeto, campo, retenção) — dono: AppSec / cloud.
3. Sinal de que funcionou: mapa titular a titular pronto para notificação, sem depender de contagem bruta de linhas do leak site.
