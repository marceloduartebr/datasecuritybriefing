---
title: "Apiiro acha 2.539 segredos expostos no GitHub por arquivo de permissões de agente de código"
description: "Uma opção de conveniência de um agente de código grava credenciais em arquivo que acaba no repositório, e ninguém decidiu publicá-las."
pubDate: 2026-11-11T18:18:00-03:00
sourceName: "Apiiro"
sourceUrl: "https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again"
cover: "https://covers.duarte.top/covers/20261109-apiiro-claude-code-segredos.jpg"
tipo: noticia
pais: us
tags: ["shadow-ai", "identidade-nao-humana", "segredos", "devsecops"]
notionUrl: "https://www.notion.so/411174117473815aba41c705a2625861"
---

Em uma linha: Agentes de código criam artefatos com credenciais fora de qualquer inventário; a pesquisa da Apiiro dá a escala do problema.

## O que aconteceu

Em 5 de novembro de 2026, a Apiiro (pesquisa de vendor) publicou que a opção "don't ask again" do Claude Code grava o comando aprovado, incluindo senhas ou tokens presentes nele, no arquivo .claude/settings.local.json. Quando o arquivo é versionado, o segredo vai para o repositório. A empresa afirma ter encontrado 2.539 segredos reais em 1.994 repositórios públicos, de 63 organizações, e que uma delas confirmou que a chave estava ativa. A The Hacker News repercutiu o estudo em 7 de novembro.

## Por que importa

O risco não está só no código que o agente escreve, mas nos arquivos de configuração, logs e caches que ele cria. Esses artefatos ficam fora dos controles tradicionais de dados sensíveis e de segredos, e chegam a repositórios públicos sem decisão consciente de ninguém.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Credenciais gravadas em arquivo de permissões do agente | Pesquisa da Apiiro, 5 de novembro | Alta |
| Chave exposta confirmada como ativa | Pesquisa da Apiiro | Alta |
| Escala em repositórios públicos (63 organizações) | Pesquisa da Apiiro; The Hacker News | Média |

## O que fazer nesta semana

1. Varrer repositórios em busca de arquivos de configuração de agentes de código e incluí-los no .gitignore — dono: engenharia de plataforma.
2. Rotacionar qualquer credencial encontrada nesses arquivos e ativar varredura de segredos no pipeline — dono: AppSec.
3. Sinal de que funcionou: a varredura de segredos passa a cobrir os diretórios criados por agentes de IA, sem achados novos por duas semanas.
