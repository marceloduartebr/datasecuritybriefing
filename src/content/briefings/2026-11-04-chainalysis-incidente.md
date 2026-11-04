---
title: "Chainalysis confirma acesso a dados de usuários por atacante com técnicas agênticas"
description: "Empresa de análise de blockchain divulgou incidente em que dados de identidade de clientes foram acessados; autoridades brasileiras usam a plataforma."
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

**Em uma linha:** Atacante com técnicas agênticas acessou nomes, e-mails e rótulos de usuários da Chainalysis; a empresa tirou produtos offline e autoridades brasileiras dependem da ferramenta.

## O que aconteceu

Em 30 de outubro de 2026 a Chainalysis publicou que detectou acesso não autorizado a sistemas e ferramentas internas por ator externo usando técnicas agênticas ofensivas. Foram acessados IDs, nomes completos, e-mails e rótulos de papel de usuários provisionados. Não há evidência, até o momento, de acesso a conteúdo de investigação, senhas, MFA ou tokens. Em 2 de novembro a empresa retirou Reactor e Data Solutions de operação por precaução. Ministérios Públicos brasileiros (RJ, SP, BA, SC e outros) possuem licenças e treinamentos na plataforma.

## Por que importa

Quando o atacante usa agente de IA, a pergunta deixa de ser apenas “quem entrou” e passa a ser “o que o agente alcançou e em qual inventário de usuários”. Ferramenta de investigação usada por autoridade pública carrega dado de identidade dos próprios investigadores e operadores.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Acesso a dados de identidade de usuários | Comunicado da empresa | Alta |
| Produtos de análise offline | Atualização de 2 de novembro | Média |
| Impacto em autoridades brasileiras | Uso documentado por MPs | Indeterminada |

## O que fazer nesta semana

1. Inventariar contas e licenças em plataformas de investigação e análise de terceiros — dono: CS / compliance.
2. Revisar logs de acesso e reset de senha nas contas provisionadas — dono: time de identidade.
3. Confirmar se a organização recebeu o detalhamento de registros acessados prometido pela empresa.
