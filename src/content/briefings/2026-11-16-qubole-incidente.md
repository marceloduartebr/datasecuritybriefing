---
title: "Conta AWS confiável da Qubole vira porta para segredos e dados de clientes"
description: "Atacante assumiu roles de integração esquecidas por 12 dias e levou segredos e buckets inteiros do S3."
pubDate: 2026-11-16T10:25:00-03:00
sourceName: "The Register"
sourceUrl: "https://www.theregister.com/security/2026/11/09/attackers-backdoor-trusted-aws-integrations-to-steal-secrets/5308553"
cover: "https://covers.duarte.top/covers/20261110-qubole-incidente.jpg"
tipo: incidente
pais: us
tags: ["terceiros", "aws", "segredos", "identidade-nao-humana", "s3"]
notionUrl: "https://www.notion.so/413174117473816ebb9bee60b47e34b6"
---

Em uma linha: uma relação de confiança entre contas que ninguém desativou deu ao atacante o mesmo alcance que o fornecedor tinha.

## O que aconteceu
Segundo investigação publicada em 09/11/2026 pela Wiz, com a Mandiant, e repercutida pelo The Register, um ator usou credenciais IAM de uma conta AWS associada à Qubole entre 14 e 26/10/2026 para assumir as roles de integração criadas por clientes. Todas as chamadas AssumeRole tinham External ID e tiveram sucesso; muitas roles já não estavam em uso, mas a política de confiança seguia ativa. O ator enumerou recursos, leu segredos em variáveis de ambiente do Lambda, Secrets Manager e SSM Parameter Store, validou com TruffleHog chaves AWS, segredos de service principals do Entra ID e credenciais OAuth do Okta, e baixou dados do S3, em alguns casos buckets inteiros. Houve uma campanha separada de 8 a 11/10 com chaves de clientes da integração. O número de organizações afetadas não foi divulgado ("múltiplas"), não há atribuição, e Qubole e AWS não responderam ao The Register.

## Por que importa
O acesso de terceiro sobrevive ao uso real da integração. Quando o fornecedor é comprometido, o alcance do atacante é o alcance que a role concedia, incluindo segredos que abrem outros sistemas (Entra ID, Okta).

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Role cross-account de fornecedor | AssumeRole bem-sucedido com External ID | Alta |
| Segredos em Lambda/SSM/Secrets Manager | Leitura e validação de chaves | Alta |
| Exfiltração de S3 | Download de buckets inteiros em alguns casos | Alta |

## O que fazer nesta semana
1. Revisar o CloudTrail desde 01/10 por AssumeRole vindo da conta 805246085872 — dono: time de cloud security.
2. Remover roles de integração sem uso e rotacionar segredos alcançáveis por elas — dono: plataforma/IAM.
3. Sinal de que funcionou: inventário de roles de terceiros com dono, finalidade e dados alcançados, sem role órfã.

> Nota de apuração: a fonte não foi relida nesta etapa de avaliação; os fatos seguem o registro do radar DSB.
