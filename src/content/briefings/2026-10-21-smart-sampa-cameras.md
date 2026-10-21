---
title: "Smart Sampa: credenciais expostas por 11 meses deram acesso a 58 mil câmeras em SP"
description: "Repositório público com logins e senhas do Smart Sampa permitiu acesso indevido a mais de 58 mil câmeras, incluindo escolas e hospitais, por cerca de 11 meses."
pubDate: 2026-10-21T10:17:00-03:00
sourceName: "Canaltech"
sourceUrl: "https://canaltech.com.br/mercado/falha-no-smart-sampa-expos-acesso-a-58-mil-cameras-de-sp-por-quase-um-ano/"
cover: "https://covers.duarte.top/covers/20261020-smart-sampa-cameras.jpg"
tipo: incidente
tags: ["vazamento", "vigilancia", "brasil", "credenciais", "governanca"]
pais: br
notionUrl: "https://www.notion.so/3ff17411747381ea9422efcda2753045"
---

Em uma linha: Credenciais de sistema de vigilância pública ficaram expostas por 11 meses e permitiram acesso a 58 mil câmeras em São Paulo.

## O que aconteceu

Em 20 de outubro de 2026 o UOL reportou que dados sigilosos do Smart Sampa (Prefeitura de São Paulo) estavam em repositório público há cerca de 11 meses. Incluíam 181 logins/senhas, dados de mais de 6 mil agentes e instruções de acesso. A reportagem acessou imagens ao vivo de mais de 58 mil câmeras em ruas, escolas, creches, hospitais e UPAs. A Prefeitura atribuiu a um servidor afastado da GCM, negou falha sistêmica, retirou o repositório e adotou 2FA. O MP-SP abriu investigação. Contrato de operação de R$ 588 milhões com Consórcio Smart City SP / Sentinelx.

## Por que importa

Credencial vazada de sistema de monitoramento público é evidência de ausência de inventário e de controle de acesso em tempo real. Política e contrato não substituem visibilidade sobre quem ainda pode entrar em câmeras de locais sensíveis. 2FA posterior não cobre o período de exposição nem os riscos de inserção de dados falsos em reconhecimento facial apontados por especialistas.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Exposição de credenciais | Repositório público por ~11 meses com 181 logins | Alta |
| Acesso a câmeras sensíveis | Escolas, creches, hospitais, UPAs visualizados | Alta |
| Ausência de 2FA | Acesso testado sem autenticação em duas etapas | Média |
| Risco de dados falsos | Interfaces com possível inserção de registros de reconhecimento facial | Indeterminada |

## O que fazer nesta semana

1. Mapear todos os repositórios, pastas e tickets com credenciais de sistemas de monitoramento ou acesso privilegiado — dono: Segurança / TI.
2. Auditar contas ativas de terceiros e servidores com acesso a câmeras ou plataformas de vigilância — dono: Controle de Acesso.
3. Confirmar que sistemas críticos têm inventário de credenciais com revisão periódica inferior a 90 dias e alerta de exposição — sinal: relatório de contas sem uso ou com senha antiga.
