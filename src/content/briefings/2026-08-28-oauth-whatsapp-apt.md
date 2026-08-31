---
title: "Zero senhas quebradas: OAuth e vinculação de WhatsApp na espionagem russa"
description: "GTIG aponta UNC6293 (ligado ao APT29), UNC7005 e UNC5976 usando login verdadeiro do Google/Microsoft e sequestro de dispositivo WhatsApp."
pubDate: 2026-08-28T18:10:00-03:00
sourceName: "The Hacker News / Google Threat Intelligence Group"
sourceUrl: "https://thehackernews.com/2026/08/suspected-russian-hackers-abuse-google.html"
cover: "https://raw.githubusercontent.com/marceloduartebr/dsb-covers/main/covers/20260828-oauth-whatsapp-apt.jpg"
tags: ["identidade", "oauth", "espionagem"]
notionUrl: "https://www.notion.so/3c717411747381cfbde6e58e7b80cf55"
---

**Em uma linha:** a tela de login era genuína; o token é que mudou de dono.

## O que aconteceu

O Google Threat Intelligence Group descreve três clusters ligados à Rússia — UNC6293 (associado ao APT29/Cozy Bear), UNC7005 e UNC5976 — sequestrando contas em governo, defesa, aeroespacial, academia e think tanks na Europa e nos EUA. A tática usa o fluxo real de “Fazer login com o Google” ou Microsoft e redireciona a um projeto de nuvem malicioso que captura o token. Outra variante abusa da vinculação de dispositivos do WhatsApp.

Não há senha quebrada nem exploit de dia zero no relato.

## Por que importa

Token válido abre as mesmas portas do usuário real. Controle de acesso ≠ visibilidade sobre o dado que aquele token lê.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| OAuth consent fraud | GTIG / THN | Alta |
| Vinculação de dispositivo WhatsApp | GTIG / THN | Alta |

## O que fazer nesta semana

1. Revisar apps OAuth concedidos (Google Workspace / Entra) e revogar o que não tiver dono — identidade.
2. Tratar “dispositivo vinculado” de mensageiro como controle de acesso, não como detalhe de TI.
3. Sinal de que funcionou: dá para listar o que um token de um diretor alcança.
