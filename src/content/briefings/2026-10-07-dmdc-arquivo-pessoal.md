---
title: "DMDC: nove meses de acesso a arquivo militar sem criptografia"
description: "O centro de pessoal do Pentágono avisou titulares em setembro sobre acesso indevido descoberto em julho, com PII sem criptografia."
pubDate: 2026-10-07T10:18:00-03:00
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/pentagon-personnel-agency-data-breach-impacts-3-million-people/"
cover: "https://covers.duarte.top/covers/20261001-dmdc-arquivo-pessoal.jpg"
tipo: incidente
tags: ["incidente", "estados-unidos", "pessoal", "arquivo"]
pais: us
notionUrl: "https://www.notion.so/3ec1741174738144a1c9eb02a32831c5"
---

Em uma linha: o arquivo de pessoal ficou acessível por cerca de nove meses e a carta não diz qual ficha foi lida.

## O que aconteceu

A SecurityWeek repercutiu em 29 de setembro de 2026 o aviso do Defense Manpower Data Center. A carta de 18 de setembro diz que, em 16 de julho de 2026, uma vulnerabilidade em sistema de compartilhamento de arquivos permitiu acesso indevido. Entre outubro de 2025 e a descoberta, poucos usuários não autorizados acessaram arquivos com PII sem criptografia: Seguro Social, nome, data de nascimento, contato, dados demográficos e especialidade ocupacional, conforme o titular. O produto não foi nomeado. O DMDC diz não ter indício de uso indevido. Um oficial disse à CNN que o alcance seria 2,76 milhões de pessoas vivas e 294 mil falecidas — cifra fora da carta.

## Por que importa

Fechar a vulnerabilidade não responde o que foi lido. Sem trilha de arquivo, a notificação fica genérica e o risco de fraude permanece indeterminado.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Compartilhamento de arquivo sem criptografia | Carta do DMDC, 18/09 | Alta |
| Janela de acesso | Outubro de 2025 a 16/07/2026 | Alta |
| Volume de titulares | 2,76 mi vivas e 294 mil falecidas, via CNN, não na carta | Média |
| Uso indevido | DMDC diz não ter indício | Indeterminada |

## O que fazer nesta semana

1. Inventariar compartilhamentos com PII de pessoal e se o arquivo está cifrado — RH e infra.
2. Exigir log de leitura por arquivo, não só data de patch — segurança.
3. Sinal: um acesso fora do perfil gera lista de arquivos e titulares em até 24 horas.
