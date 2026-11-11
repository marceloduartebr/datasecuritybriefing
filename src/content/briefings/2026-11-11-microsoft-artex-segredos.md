---
title: "Microsoft: atacantes usam framework agêntico para achar segredos no GitHub e exfiltrar dados do Azure Key Vault"
description: "Em um caso, a cadeia da credencial exposta até a exfiltração levou cinco minutos, rápido demais para qualquer reação humana."
pubDate: 2026-11-11T10:22:00-03:00
sourceName: "Microsoft Threat Intelligence"
sourceUrl: "https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/"
cover: "https://covers.duarte.top/covers/20261109-microsoft-artex-segredos.jpg"
tipo: noticia
pais: us
tags: ["identidade-nao-humana", "ia", "segredos", "nuvem"]
notionUrl: "https://www.notion.so/411174117473819992b1ca5da2b06a8a"
---

Em uma linha: Com agentes ofensivos automatizando da descoberta do segredo à exfiltração, a defesa precisa estar no inventário de identidades não humanas, não no tempo de reação.

## O que aconteceu

Em 5 de novembro de 2026, a Microsoft Threat Intelligence relatou que atores de ameaça usam o framework agêntico ARTEX para encontrar e abusar de segredos expostos. Segundo a empresa, a varredura de segredos no GitHub ocorre desde agosto, e desde 28 de outubro foram observados sign-ins de service principals com credenciais roubadas. Em um caso, o agente foi da varredura no GitHub à exfiltração de dados do Azure Key Vault em cinco minutos. A publicação não nomeia vítimas.

## Por que importa

Identidades não humanas, como service principals, costumam ter permissões amplas e pouca revisão. Quando o atacante encadeia descoberta, autenticação e exfiltração de forma automática, a janela entre exposição e perda some. O controle eficaz passa a ser preventivo: não expor segredos e limitar o que cada identidade alcança.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Segredos expostos em repositórios GitHub | Microsoft Threat Intelligence, 5 de novembro | Alta |
| Sign-ins de service principals com credenciais roubadas desde 28/10 | Microsoft Threat Intelligence | Alta |
| Exfiltração do Key Vault em cinco minutos | Caso descrito pela Microsoft | Alta |

## O que fazer nesta semana

1. Inventariar service principals com acesso a Key Vault e a dados sensíveis, e remover permissões sem uso — dono: identidade / cloud.
2. Rotacionar segredos encontrados em repositórios e ativar alertas de sign-in anômalo para identidades não humanas — dono: SOC.
3. Sinal de que funcionou: cada service principal tem dono, escopo mínimo documentado e revisão periódica.
