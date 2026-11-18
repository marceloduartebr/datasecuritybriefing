---
title: "Banco do Brasil notifica clientes após acesso não autorizado com credencial válida"
description: "O BB identificou em 12 de novembro o uso indevido de uma credencial válida e avisou clientes sobre exposição de nome, CPF, e-mail, agência e, em alguns casos, número da conta."
pubDate: 2026-11-18T18:10:00-03:00
sourceName: "g1"
sourceUrl: "https://g1.globo.com/tecnologia/noticia/2026/11/18/banco-do-brasil-dados.ghtml"
cover: "https://covers.duarte.top/covers/20261118-bb-credencial-valida-1759.jpg"
tipo: incidente
pais: br
tags: ["banco-do-brasil", "credencial-valida", "lgpd", "vazamento"]
---

Em uma linha: o banco afirma que não houve invasão aos sistemas, mas uma credencial válida foi o bastante para alcançar dados cadastrais de clientes.

## O que aconteceu

Em 18 de novembro de 2026 o Banco do Brasil informou, em comunicado a clientes e em nota à imprensa, que identificou em 12 de novembro um acesso não autorizado a dados pessoais. Segundo o g1 e o Valor Econômico, os dados expostos podem incluir nome, CPF, endereço de e-mail, número da agência e, em alguns casos, número da conta. O banco afirmou que não houve invasão aos seus sistemas, nem exposição de senhas, tokens ou códigos de segurança, e que não foram identificadas transações financeiras decorrentes do incidente. As apurações, segundo o comunicado, indicam uso indevido, por terceiros, de uma credencial válida, já revogada. O Valor registrou que o banco não revela o número de usuários afetados e que o aviso foi enviado a uma parte da base de clientes. A instituição disse ter acionado protocolos de segurança e as comunicações previstas na LGPD, e apontou o risco principal de golpes, phishing e engenharia social.

## Por que importa

A linha “não houve invasão” descreve o perímetro, não o alcance do dado. Uma credencial válida não dispara o alarme de invasão e ainda assim lê cadastro. Sem um número público de afetados, o aviso existe, mas o inventário do que foi lido permanece interno.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Uso indevido de credencial válida | Comunicado do BB citado pelo g1 e pelo Valor | Alta |
| Exposição de CPF, e-mail, agência e, em alguns casos, conta | Comunicado aos clientes, em 18/11 | Alta |
| Número de afetados não informado | Valor Econômico, 18/11 | Média |

## O que fazer nesta semana

1. Revisar quais credenciais de funcionários, parceiros e sistemas lêem cadastro de clientes e revogar as que não tiverem dono e necessidade atuais (responsável: CISO).
2. Conferir se há registro de qual volume e tipo de dado cada credencial acessou entre a detecção e a revogação (responsável: time de segurança de dados).
3. Preparar orientação objetiva aos clientes sobre phishing, com canal oficial de denúncia, sem pedir senha ou código (responsável: DPO / atendimento).
