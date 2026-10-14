---
title: "Perímetro antigo volta ao KEV na campanha da Integrity Tech"
description: "CISA, FBI e parceiros marcam ProFTPD, BIND e Struts como explorados em 8/10; o prazo federal espelhado é 11/10."
pubDate: 2026-10-14T10:15:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa26-281a"
cover: "https://covers.duarte.top/covers/20261009-integrity-tech-kev-perimetro.jpg"
tipo: vulnerabilidades
tags: ["kev", "perimetro", "cisa", "integridade"]
pais: us
notionUrl: "https://www.notion.so/3f4174117473813d8ef9cde7bbc14676"
---

Em uma linha: a campanha habilitada pela Integrity Tech recoloca serviços de borda de 2015–2016 no KEV, com prazo federal curto.

## O que aconteceu

Em 8 de outubro de 2026, CISA, FBI, NSA e parceiros publicaram o aviso conjunto AA26-281A. O texto atribui a atores ligados ao governo chinês, habilitados pela Integrity Technology Group, o uso combinado de varredura automatizada, botnet e exploração manual contra infraestrutura crítica dos EUA (governo, manufatura, saúde e tecnologia da informação) e organizações na América do Norte, no Sudeste Asiático e na África. A evidência veio de investigações do FBI.

O apêndice marca com asterisco cinco CVEs recém-incluídos no KEV: CVE-2015-3306 (ProFTPD), CVE-2015-5477 (ISC BIND), CVE-2016-3081 (Apache Struts), CVE-2021-3199 (ONLYOFFICE Docs) e CVE-2023-22894 (Strapi). Espelhos do catálogo registram inclusão em 8/10 e prazo federal em 11/10. Shellshock, Pulse Connect Secure e GitLab aparecem como exploração já conhecida, sem o asterisco de inclusão nova.

## Por que importa

Política de patch com exceção permanente não é evidência de que o serviço saiu da borda. O atacante desta campanha varre o que ainda responde.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| ProFTPD 1.3.5 exposto (CVE-2015-3306) | Asterisco de inclusão no KEV no AA26-281A | Alta |
| Struts com Dynamic Method Invocation (CVE-2016-3081) | Mesmo apêndice; injeção de comando | Alta |
| BIND antigo (CVE-2015-5477) | Inclusão no KEV; negação de serviço | Média |
| ONLYOFFICE / Strapi | CVE-2021-3199 e CVE-2023-22894 no mesmo lote | Média |

## O que fazer nesta semana

1. Inventariar ProFTPD, BIND, Struts, ONLYOFFICE e Strapi ainda alcançáveis de fora — dono de perímetro.
2. Desligar o que não tem dono ou aplicar o corretivo antes de 11/10 — dono da aplicação.
3. Sinal de que funcionou: o scan externo não devolve mais esses serviços nas versões do apêndice.
