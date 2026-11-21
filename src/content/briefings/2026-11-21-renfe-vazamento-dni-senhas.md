---
title: "Renfe amplia o alcance do ataque de setembro: DNI, senhas e histórico de viagens"
description: "Quase dois meses após dizer que o ataque atingiu principalmente nomes e e-mails, a Renfe avisa clientes que DNI/NIE, senhas e dados de viagens podem ter sido roubados."
pubDate: 2026-11-21T08:50:00-03:00
sourceName: "elDiario.es"
sourceUrl: "https://www.eldiario.es/tecnologia/renfe-urge-clientes-cambiar-contrasenas-ciberataque-pudo-robar-dnis-e-historial-viajes_1_13680581.html"
cover: "https://covers.duarte.top/covers/20261121-renfe-vazamento-dni-senhas-0810.jpg"
tipo: incidente
tags: ["renfe", "espanha", "vazamento", "senhas", "terceiros"]
pais: eu
---

Em uma linha: a primeira comunicação falava em nomes e e-mails; a segunda, quase dois meses depois, inclui documentos de identidade, senhas e deslocamentos.

## O que aconteceu

Segundo o elDiario.es, a operadora ferroviária espanhola Renfe enviou em 20 de novembro de 2026 um e-mail aos clientes afetados pelo ciberataque sofrido em 24 de setembro. A empresa informa que podem ter sido roubados números de DNI ou NIE, senhas de acesso e informações sobre bilhetes adquiridos e viagens realizadas, e pede a troca de senha o quanto antes, também em outros serviços onde a mesma senha seja usada.

Em 25 de setembro, a Renfe havia reconhecido a intrusão e dito que o acesso parecia afetar informação limitada de usuários, principalmente nomes e endereços de e-mail, sem evidências de acesso a DNI. Agora, a empresa diz que as senhas estavam protegidas por técnicas criptográficas, mas admite que senhas fracas podem ser quebradas por força bruta. A Renfe atribui a origem do ataque a servidores da Adif previamente comprometidos que mantinham interconexão com seus sistemas, afirma que o suposto autor foi detido pela Guarda Civil em outubro e que notificou a Agência Espanhola de Proteção de Dados. A empresa se recusou a informar ao elDiario.es o número total de clientes afetados.

## Por que importa

O caso mostra a distância entre conter um ataque e saber o que ele alcançou. O histórico de viagens, como a própria Renfe reconhece, permite inferir deslocamentos e perfis de comportamento. E a porta de entrada foi um ambiente interligado de outra organização, a Adif.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
| --- | --- | --- |
| Interconexão com ambiente de terceiro comprometido | Origem atribuída a servidores da Adif ligados aos sistemas da Renfe | Alta |
| Escopo subestimado na primeira comunicação | Setembro: nomes e e-mails; novembro: DNI/NIE, senhas e viagens | Alta |
| Reutilização de senhas | Renfe pede troca também em outros serviços | Média |

## O que fazer nesta semana

1. Inventariar onde a empresa guarda documentos de identidade, senhas e históricos de uso de clientes, por sistema (dono: Governança de Dados).
2. Revisar conexões com sistemas de parceiros e terceiros e os dados acessíveis por elas (dono: Segurança da Informação).
3. Definir no plano de resposta a incidentes um processo para confirmar o escopo por categoria de dado antes da primeira comunicação externa (dono: DPO e Jurídico).
