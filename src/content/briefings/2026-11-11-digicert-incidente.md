---
title: "DigiCert: conta sem MFA leu arquivo de clientes por seis dias e a confirmação levou quatro meses"
description: "Um sistema interno ficou exposto à internet desde uma migração em 2025; a conta foi vista em junho, mas o acesso aos dados só foi confirmado em outubro."
pubDate: 2026-11-11T10:24:00-03:00
sourceName: "Mozilla Bugzilla (relatório da DigiCert)"
sourceUrl: "https://bugzilla.mozilla.org/show_bug.cgi?id=2084460"
cover: "https://covers.duarte.top/covers/20261109-digicert-incidente.jpg"
tipo: incidente
pais: us
tags: ["vazamento", "mfa", "documentos-de-identidade", "autoridade-certificadora", "eua"]
notionUrl: "https://www.notion.so/4121741174738115b0aaf1f2c1e15c36"
---

Em uma linha: a DigiCert viu a conta indevida em junho e fechou o acesso em julho, mas só em outubro descobriu que dados de clientes, incluindo documentos de identidade, tinham sido lidos.

## O que aconteceu

No relatório publicado no Bugzilla da Mozilla (bug 2084460), a DigiCert informa que, numa migração de infraestrutura em 4 de fevereiro de 2025, um sistema interno de negócios saiu de um segmento restrito por VPN e ficou acessível pela internet. Um recurso de autorregistro do gerenciador de contas, pensado para outro uso, permitia criar contas que não passavam pela MFA exigida nos demais acessos e que, por padrão, tinham perfil somente leitura. Uma dessas contas acessou dados arquivados entre 27 de junho e 2 de julho de 2026.

A equipe notou contas externas em junho e liberou a correção de autorização em 2 de julho, mas tratou o caso como criação de conta. Em 12 de outubro a empresa passou a suspeitar de acesso aos dados e, em 19 de outubro, confirmou o acesso a parte do arquivo. Os dados são, na maioria, contatos comerciais (nome, e-mail, telefone e endereço); numa pequena parte das contas, incluem documentos enviados para validação, como carteira de motorista, passaporte ou conta de consumo. Segundo a DigiCert, a conta não podia gravar registros, aprovar validações nem emitir certificados, e CA, CertCentral e DigiCert ONE não foram afetados. A empresa diz ter contatado os clientes afetados e informado a polícia, mas não divulgou quantas pessoas foram atingidas, mesmo após pedido de participantes do Bugzilla.

## Por que importa

O incidente mostra três intervalos que costumam passar despercebidos: o tempo em que um sistema fica exposto depois de uma migração, o tempo entre ver uma conta anômala e entender o que ela leu, e o tempo até avisar quem teve o documento exposto. Em todos, o que faltou não foi controle de acesso, e sim visibilidade sobre o dado guardado no sistema.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Exposição após migração | Sistema saiu do segmento VPN em 04/02/2025 | Alta |
| Autorregistro sem MFA | Contas não atribuídas liam o arquivo | Alta |
| Documento de identidade em arquivo de negócios | Minoria das contas, sem número divulgado | Alta |
| Atraso na análise de impacto | Conta vista em junho, acesso confirmado em 19/10 | Média |

## O que fazer nesta semana

1. Listar os sistemas movidos de rede nos últimos 24 meses e verificar se algum ficou acessível pela internet — dono: infraestrutura.
2. Inventariar onde ficam cópias de documentos de identidade de clientes e definir prazo de retenção — dono: privacidade e governança de dados.
3. Sinal de que funcionou: para qualquer conta anômala, a equipe consegue dizer em horas, e não em meses, quais registros ela podia ler.
