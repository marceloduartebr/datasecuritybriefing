---
title: "Smart Sampa: nova falha em provedora de nuvem expõe 17 mil câmeras conveniadas em SP"
description: "Links de cerca de 17 mil câmeras conveniadas hospedadas na Monuv abriam sem login por cerca de cinco dias; Prefeitura fala em planilha sigilosa vazada e abriu investigação."
pubDate: 2026-11-04T10:16:00-03:00
sourceName: "UOL"
sourceUrl: "https://noticias.uol.com.br/colunas/artur-rodrigues/2026/11/03/nova-falha-no-smart-sampa-permite-acesso-a-17-mil-cameras-conveniadas.htm"
cover: "https://covers.duarte.top/covers/20261104-smart-sampa-17-mil-cameras-monuv.jpg"
tipo: incidente
tags: ["vazamento", "vigilancia", "brasil", "terceiros", "nuvem", "governanca"]
pais: br
notionUrl: "https://www.notion.so/40d1741174738166b948c1c12d65d381"
---

Em uma linha: Duas semanas após o caso das 58 mil câmeras, links de 17 mil câmeras conveniadas do Smart Sampa ficaram acessíveis sem login na provedora Monuv.

## O que aconteceu

Em 3 de novembro de 2026 o UOL reportou que cerca de 17 mil câmeras conveniadas ao Smart Sampa, hospedadas na provedora de nuvem Monuv, puderam ser acessadas sem autenticação por aproximadamente cinco dias, incluindo ruas de autoridades como Alexandre de Moraes, Michel Temer e FHC. A Folha confirmou de forma independente, abrindo transmissões. A Secretaria Municipal de Segurança Urbana (SMSU) confirmou que a lista de links é verdadeira, afirma que houve vazamento de uma planilha sigilosa e abriu investigação. A reportagem sustenta que os links abriam sem login. O caso é distinto do episódio de 20/10 (credenciais em repositório público, 58 mil câmeras).

Fontes adicionais: Folha, O Globo, Veja SP.

## Por que importa

As duas versões convergem no ponto central: o acesso às câmeras dependia de o link permanecer secreto. Planilha vazada ou link aberto, URL sem autenticação no fornecedor de nuvem é controle de acesso inexistente. Dois incidentes em duas semanas indicam falha de governança sobre terceiros, não um erro isolado.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Acesso sem autenticação | Links abriam sem login por ~5 dias (UOL, Folha) | Alta |
| Exposição de locais sensíveis | Ruas de autoridades visualizadas | Alta |
| Risco de terceiro (nuvem) | Câmeras hospedadas na Monuv | Alta |
| Vazamento de inventário | Prefeitura confirma planilha sigilosa vazada | Média |

## O que fazer nesta semana

1. Inventariar sistemas hospedados em terceiros que liberam acesso por URL direta ou token em link — dono: Segurança / TI.
2. Exigir dos fornecedores de nuvem autenticação obrigatória e expiração de links de streaming — dono: Gestão de Terceiros.
3. Verificar se planilhas com links ou credenciais de acesso circulam fora de cofre — sinal: arquivos com URLs de acesso em pastas compartilhadas.