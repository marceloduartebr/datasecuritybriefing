---
title: "Script da Optimizely serve malware a visitantes de 178 organizações em um único dia"
description: "Código injetado em projetos da Optimizely Web capturou cartões e trocou carteiras de cripto em sites de Zoom, HSBC e IKEA; ninguém sabe ainda como o atacante ganhou acesso."
pubDate: 2026-11-17T21:44:00-03:00
sourceName: "Report URI"
sourceUrl: "https://blog.report-uri.com/worlds-largest-brands-infected-with-malware-via-optimizely/"
cover: "https://covers.duarte.top/covers/stg-20261117-optimizely-injecao-de-codigo-2034.jpg"
tipo: incidente
tags: ["supply-chain", "javascript", "skimming", "terceiros", "estados-unidos"]
pais: us
---

**Em uma linha:** o script de um terceiro roda com acesso a tudo o que o cliente digita, e quase nunca está no inventário de dados.

## O que aconteceu
Em 16 de novembro de 2026, código malicioso foi servido a visitantes de 178 organizações (188 trechos infectados) por meio da Optimizely Web, segundo a Report URI. O atacante escreveu código no "Project JavaScript" de projetos de clientes; a CDN da Optimizely entregou o conteúdo recebido, sem envenenamento de cache. A primeira injeção foi observada às 04h21 UTC; um skimmer de cartões foi adicionado às 13h43 UTC; a limpeza de todos os arquivos foi concluída às 23h11 UTC. O código trocava endereços de carteiras de cripto, capturava número, validade e CVV de cartões em formulários do próprio site, enviava cookies não HttpOnly e capturas de tela a um servidor do atacante e direcionava iPhones com versões antigas do iOS aos kits Coruna e DarkSword. Entre as marcas listadas estão Zoom, BBC, CNN, Salesforce, IKEA, Equifax, Air France-KLM e HSBC (inclusive o site do México), além de domínios da Betsson na Argentina e na Colômbia. As carteiras do atacante receberam cerca de US$ 7 mil. A Report URI afirma não saber como o atacante obteve acesso de escrita a projetos de clientes sem relação entre si; a Optimizely reconheceu o incidente em sua página de status.

## Por que importa
Formulários de pagamento e cadastro são o ponto em que o dado pessoal nasce. Um script de terceiro carregado nessa página tem o mesmo alcance que o código da própria empresa, muda a qualquer momento e escapa dos controles aplicados a bancos de dados e aplicações SaaS.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Injeção em script de terceiro (Optimizely Web projectJS) | Linha do tempo e lista de 178 organizações publicadas pela Report URI | Crítica |
| Captura de cartões e cookies no navegador | Payload analisado pela Report URI | Alta |
| Exploração de iOS desatualizado | Kits Coruna e DarkSword identificados no payload | Alta |
| Vetor de acesso ao fornecedor | Desconhecido | Indeterminada |

## O que fazer nesta semana
1. Listar todos os scripts de terceiros carregados nas páginas de login, cadastro e pagamento e quem pode alterar cada um — dono: engenharia web com segurança de aplicações.
2. Ativar Content Security Policy, ao menos em modo report-only, nessas páginas e monitorar mudanças no código servido por terceiros — dono: segurança de aplicações.
3. Sinal de que funcionou: uma alteração inesperada em script de terceiro gera alerta em minutos, não em horas.