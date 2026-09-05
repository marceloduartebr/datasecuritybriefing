---
title: "ClarityCheck: 9 milhões de imagens faciais em banco sem senha nem criptografia"
description: "Pesquisador achou 450 GB da plataforma de identificação de chamadas, com fotos de adultos, adolescentes e crianças coletadas da web."
pubDate: 2026-09-04T10:02:00-03:00
sourceName: "Cybernews"
sourceUrl: "https://cybernews.com/privacy/claritycheck-leak-are-you-indexed/"
cover: "https://raw.githubusercontent.com/marceloduartebr/dsb-covers/main/covers/20260902-claritycheck-biometricos.jpg"
tipo: incidente
tags: ["vazamento", "biometricos", "privacidade", "dspm", "criancas"]
notionUrl: "https://www.notion.so/3c717411747381fa8667c20124b12d57"
---

**Em uma linha:** Nove milhões de rostos, inclusive de menores, em um banco de 450 GB sem autenticação — a empresa chamou isso de URL não indexada.

## O que aconteceu

Em 21 de agosto de 2026, o pesquisador independente Jeremiah Fowler localizou um banco de dados de 450 GB associado à ClarityCheck, plataforma usada para identificar chamadas desconhecidas e pesquisar pessoas online. Dentro dele havia mais de 9 milhões de imagens faciais, incluindo fotos de adolescentes e crianças coletadas de redes sociais e sites de relacionamento, sem senha e sem criptografia.

A empresa negou que os dados estivessem “publicamente expostos”, alegando que o acesso dependia de uma URL não indexada. O pesquisador contestou o argumento ao demonstrar que não havia autenticação.

## Por que importa

Segurança por obscuridade confunde “difícil de encontrar” com “protegido”. Sem controle de acesso, um pesquisador — ou um atacante — fecha essa distância em minutos.

Dado biométrico não se troca como senha. Quando o conjunto inclui menores, a gravidade sobe: o risco não é só o vazamento de hoje, é o que essas imagens podem alimentar depois, de reconhecimento facial não autorizado a fraude de identidade.

O roteiro é conhecido. Quase nunca é a empresa decidindo deixar o banco aberto. É a empresa que não sabia que aquele banco existia daquele jeito, sem controle de acesso, há meses.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Banco biométrico sem autenticação | Relato do pesquisador + volume 450 GB | Alta |
| Imagens de menores | Citadas na reportagem | Alta |
| “URL não indexada” como controle | Contestado; sem auth observada | Alta |

## O que fazer nesta semana

1. Inventariar bases com biometria ou foto de pessoa e o controle de acesso real de cada uma — dono: segurança / dados.
2. Verificar exposição pública (bucket, índice, URL “secreta”) — dono: AppSec / cloud.
3. Sinal de que funcionou: lista das bases biométricas com auth obrigatória e sem objeto público.
