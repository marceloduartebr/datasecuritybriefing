---
title: "Chainalysis confirma acesso a dados de usuários por atacante com técnicas agênticas"
description: "O incidente começou com nomes e e-mails e chegou a hashes de senha e tokens ativos de todos os usuários; autoridades brasileiras usam a plataforma."
pubDate: 2026-11-04T18:18:00-03:00
sourceName: "Chainalysis"
sourceUrl: "https://www.chainalysis.com/blog/security-incident-october-30/"
cover: "https://covers.duarte.top/covers/20261104-chainalysis-incidente.jpg"
tipo: incidente
tags: ["vazamento", "ia", "brasil", "cripto"]
pais: br
slug: chainalysis-incidente
notionUrl: "https://www.notion.so/40e17411747381958c4ed9a234cc3579"
---

> **Atualizado em 6 de novembro de 2026.** A versão original deste briefing refletia o comunicado de 30 de outubro, que falava apenas em dados não sensíveis. Em 4 de novembro a Chainalysis informou que nomes, nomes de usuário, hashes de senha e tokens ativos de todos os usuários foram expostos. O texto abaixo foi revisto com as atualizações da empresa.

**Em uma linha:** O que começou como "nomes e e-mails" virou hashes de senha e tokens ativos de todos os usuários da Chainalysis, com produtos e login fora do ar; autoridades brasileiras dependem da ferramenta.

## O que aconteceu

Em 30 de outubro de 2026 a Chainalysis publicou que detectou acesso não autorizado a sistemas e ferramentas internas por ator externo usando técnicas agênticas ofensivas. Naquele comunicado, a empresa citava apenas dados não sensíveis (IDs, nomes, e-mails e rótulos de papel) e dizia não ter evidência de acesso a credenciais ou tokens de sessão. Em 2 de novembro retirou o Reactor e o Data Solutions de operação por precaução.

Em 4 de novembro o quadro mudou. Pela manhã, a empresa relatou um ataque on-path que expôs senhas de parte dos clientes e bloqueou as contas afetadas. À noite, informou que nomes, nomes de usuário, hashes de senha e tokens ativos de todos os usuários da Chainalysis foram expostos, e tirou do ar o KYT, os demais produtos de triagem de endereços e a página de login. A empresa diz não ter evidência de acesso a dados de investigação nem de manipulação de dados de atribuição. Em 6 de novembro começou a restabelecer o KYT e o Address Screening em fases, exigindo IPs confiáveis, troca de senha e rotação de chaves de API; Reactor e Data Solutions seguiam fora do ar.

Ministérios Públicos brasileiros (RJ, SP, BA, SC e outros) possuem licenças e treinamentos na plataforma.

## Por que importa

A primeira versão de um incidente raramente é a final. Em seis dias, o escopo passou de dados de contato de clientes para credenciais de toda a base, e a mensagem "não há evidência de acesso a tokens" foi substituída por tokens ativos expostos. Quem tomou decisões com base no primeiro comunicado precisa revisá-las. Ferramenta de investigação usada por autoridade pública carrega a identidade e o acesso dos próprios investigadores e operadores.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Hashes de senha e tokens ativos de todos os usuários | Atualização da empresa de 4 de novembro | Alta |
| Indisponibilidade de KYT, triagem de endereços, Reactor e login | Atualizações de 2, 4 e 6 de novembro | Alta |
| Impacto em autoridades brasileiras | Uso documentado por MPs | Indeterminada |

## O que fazer nesta semana

1. Trocar as senhas e rotacionar as chaves de API de todas as contas na Chainalysis, e revogar integrações que usem esses tokens — dono: time de identidade.
2. Verificar se a mesma senha era usada em outros sistemas e forçar a troca onde houver reuso — dono: segurança.
3. Revisar decisões e controles tomados com base no comunicado de 30 de outubro e acompanhar as próximas atualizações da empresa — dono: CS / compliance.
