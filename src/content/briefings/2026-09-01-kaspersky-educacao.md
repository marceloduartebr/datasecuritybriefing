---
title: "Ransomware em 60% dos ataques a escolas e universidades privadas"
description: "Kaspersky, jan/2025–jun/2026. São Paulo concentra 60% dos casos; contenção em horas, forense em 9,6. O dado que mora na rede é de menor."
pubDate: 2026-09-01T10:19:00-03:00
sourceName: "Kaspersky"
cover: "https://raw.githubusercontent.com/marceloduartebr/dsb-covers/main/covers/20260828-kaspersky-educacao.jpg"
sourceUrl: "https://www.kaspersky.com.br/about/press-releases/raio-x-da-ciberseguranca-na-educacao-ransomware-e-a-principal-ameaca-e-representa-60-dos-ataques-ao-setor"
tags: ["ransomware", "educacao", "lgpd", "brasil"]
notionUrl: "https://www.notion.so/3ca174117473815babfbc90f619db86d"
---

**Em uma linha:** escola caiu não é a mesma coisa que saber qual cadastro de aluno saiu.

## O que aconteceu

Em 25 de agosto de 2026 a Kaspersky publicou o raio-x de cibersegurança na educação: de janeiro de 2025 a junho de 2026, ransomware respondeu por 60% dos ciberataques a escolas e universidades privadas no Brasil. São Paulo concentrou 60% dos incidentes do levantamento; Rio de Janeiro e Pernambuco, 20% cada. Vetores mais citados: conta legítima com senha reutilizada ou compartilhada, sistema desatualizado exposto na internet, acesso interno indevido e programa de remoto mal usado. Contenção inicial em minutos ou poucas horas; investigação, forense e recuperação, em média, 9,6 horas. No recorte da empresa, rede pública aparece mais em escalada de privilégio e acesso interno; a privada, no ransomware com motivação financeira.

## Por que importa

O percentual esconde o tipo de dado. Escola guarda CPF, endereço e contato de aluno e responsável. Quando isso vaza, o próximo passo raramente é só aula interrompida: é phishing de mensalidade e troca de chip. Público e privado sofrem dinâmicas diferentes; a lacuna é a mesma — mapa de onde está o cadastro da criança e quem ainda acessa depois que a conta de um colaborador caiu.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Ransomware no setor privado | 60% dos ataques no recorte Kaspersky | Alta |
| Conta legítima / senha reutilizada | Mesmo relatório | Alta |
| Dado de menor no cadastro escolar | Inferência operacional do tipo de base | Alta |

## O que fazer nesta semana

1. Listar sistemas com cadastro de aluno e responsável e quem tem conta ativa — dono: TI + secretaria.
2. Tratar conta de colaborador comprometida como incidente de dado de menor, não só de disponibilidade.
3. Sinal de que funcionou: em horas, quais bases de alunos aquele acesso alcançava.
