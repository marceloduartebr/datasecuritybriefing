---
title: "Optimizely confirma injeção de JavaScript malicioso em projetos de clientes do Web Experimentation"
description: "Uma falha no cadastro permitiu inserir um skimmer de cartão e um trocador de carteiras cripto em sites de 178 organizações por cerca de 16 horas."
pubDate: 2026-11-19T17:10:00-03:00
sourceName: "Optimizely"
sourceUrl: "https://status.optimizely.com/incidents/ftw0fh9wx43z"
cover: "https://covers.duarte.top/covers/20261119-optimizely-injecao-javascript-1035.jpg"
tipo: incidente
pais: global
tags: ["cadeia-de-suprimentos", "skimmer", "pagamentos", "javascript"]
---

**Em uma linha:** a tag de marketing tinha permissão de escrever código na página de pagamento, e foi por ela que o ataque entrou.

## O que aconteceu
A Optimizely confirmou em sua página de status que, em 16/11, um terceiro não autorizado explorou uma falha no fluxo de cadastro do Web Experimentation para se passar por usuários em contas-alvo e inserir JavaScript malicioso em projetos de clientes. A empresa diz que detectou a atividade no mesmo dia, fechou a falha em até três horas, removeu o código de todos os projetos e que não houve vazamento de credenciais. O impacto ficou em menos de 5% dos clientes, só no Web Experimentation. Segundo a análise de Scott Helme (Report URI), detalhada pela StepSecurity em 17/11, o código apareceu em 188 de 1.611 snippets verificados, ligados a 178 organizações; bancos e financeiras foram o maior grupo (32). O payload trocava endereços de carteiras de cripto, capturava números de cartão em formulários de checkout e enviava capturas de tela e cookies. Na maioria dos sites, a exposição durou cerca de 16 horas.

## Por que importa
O código malicioso foi servido pela CDN legítima do fornecedor, com o certificado dele, dentro de um snippet que a empresa cliente já tinha aprovado. Nenhum controle de perímetro da empresa vítima viu nada diferente.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Falha no cadastro do fornecedor permitiu escrever em projetos de clientes | Página de status da Optimizely | Alta |
| Skimmer de cartão em formulários de checkout | Análise de Report URI e StepSecurity | Alta |
| Tag de terceiro com acesso ao que o cliente digita | 178 organizações, 32 do setor financeiro | Alta |

## O que fazer nesta semana
1. Revisar o campo Project JavaScript de todos os projetos do Optimizely Web e os logs desde 16/11 — time de web e segurança.
2. Tirar tags de terceiros das páginas de checkout e usar campos de pagamento hospedados pelo provedor em iframe — dono do e-commerce.
3. Sinal de que funcionou: a lista de scripts que rodam no checkout cabe numa página e cada um tem dono.
