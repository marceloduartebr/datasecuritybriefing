---
title: "SSHole: bypass de senha no OpenSSH em Linux com musl entra no KEV"
description: "Em certas configurações, qualquer senha longa é aceita; a exploração já foi vista e a CISA incluiu a falha no KEV."
pubDate: 2026-11-11T18:20:00-03:00
sourceName: "NVD (NIST)"
sourceUrl: "https://nvd.nist.gov/vuln/detail/CVE-2026-123158"
cover: "https://covers.duarte.top/covers/20261110-openssh-sshole-kev.jpg"
tipo: vulnerabilidades
pais: us
tags: ["kev", "openssh", "containers", "alpine", "autenticacao"]
notionUrl: "https://www.notion.so/41317411747381d597ded18fec4f3b22"
---

Em uma linha: o SSH esquecido em imagens de contêiner virou porta de entrada com exploração ativa.

## O que aconteceu
A CISA incluiu em 09/11/2026 o CVE-2026-123158 no catálogo KEV. Segundo o NVD, o sshd do OpenSSH antes de 10.6p2, em Linux com musl libc e sem PAM (caso do Alpine Linux), não tem a proteção contra um bypass de autenticação por senha: em certas configurações de contas, qualquer senha entre 256 e 1.024 caracteres é aceita. Há provas de conceito públicas e a imprensa relatou tentativas de exploração em honeypots entre 05 e 06/11. Correção: OpenSSH 10.6p2 e pacotes do Alpine. CVSS 8,1 (CNA MITRE; NVD ainda sem nota); EPSS 1,0% em 09/11.

## Por que importa
Alpine é base comum de contêineres. Um sshd ativo numa imagem pouco revisada pode dar acesso a volumes e segredos de produção.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| sshd com senha em Alpine/musl sem PAM | KEV 09/11/2026; PoCs públicas | Alta |
| Contêiner com volume de dados | Depende da configuração | Média a alta |

## O que fazer nesta semana
1. Atualizar para OpenSSH 10.6p2 ou pacote corrigido do Alpine — dono: plataforma/infra.
2. Varrer imagens e registries por sshd ativo e desativar autenticação por senha — dono: DevSecOps.
3. Sinal de que funcionou: zero imagens Alpine com sshd por senha exposto, e lista dos dados montados nas que mantêm SSH.

> Nota de apuração: a fonte não foi relida nesta etapa de avaliação; os fatos seguem o registro do radar DSB.
