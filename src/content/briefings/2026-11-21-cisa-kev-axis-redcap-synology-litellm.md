---
title: "CISA adiciona ao KEV falhas exploradas em Apache Axis, REDCap, Synology DSM e LiteLLM"
description: "Em 18 de novembro de 2026 a CISA incluiu quatro CVEs no catálogo KEV, com evidência de exploração ativa; três delas têm prazo de 21 de novembro e exigem triagem forense."
pubDate: 2026-11-21T08:50:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261118-kev-axis-redcap-synology-litellm-1759.jpg"
tipo: vulnerabilidades
tags: ["cisa", "kev", "axis", "redcap"]
pais: global
---

Em uma linha: quatro falhas com exploração ativa entram no KEV no mesmo dia, e em três delas o prazo federal é 21 de novembro, com triagem forense.

## O que aconteceu

Em 18 de novembro de 2026 a CISA adicionou quatro vulnerabilidades ao catálogo KEV, com base em evidência de exploração ativa. O CVE-2026-90436, no Apache Axis 1.x até a versão 1.4, permite instanciar classes a partir de um SOAP Fault sem autenticação; o aviso do projeto no oss-security, de 6 de novembro, atribui CVSS 9.8 e recomenda migrar para o Axis 2/Java ou aplicar um patch pontual, porque o Axis 1 está fora de suporte e não deve receber um release corretivo. O CVE-2026-90817, no REDCap a partir da 13.3.0, permite execução remota de código sem autenticação se o atacante conhecer um hash válido de pesquisa pública; o Tenable registra CVSS 9.8, e o registro da CVE aponta correção nas versões 16.0.49 LTS, 17.3.10 LTS e 17.4.4 Standard. O CVE-2024-10441, no Synology DiskStation Manager, é uma execução remota de código no daemon de plugin, com CVSS 9.8 no aviso Synology-SA-24:20; as correções incluem DSM 7.2.2-72806-1, 7.2.1-69057-6, 7.2-64570-4 e 7.1.1-42962-7, além do BeeStation OS 1.1-65374. O CVE-2026-40217, no BerriAI LiteLLM, entra no mesmo alerta, com prazo em 2 de dezembro e sem triagem forense obrigatória. Para Axis, REDCap e Synology, o prazo às agências federais americanas é 21 de novembro, com triagem forense exigida pela BOD 26-04.

## Por que importa

Axis legado, bases de pesquisa do REDCap, NAS da Synology e gateway de IA do LiteLLM costumam ficar fora do inventário que a equipe olha todo dia. Política de patch não prova que esses produtos foram encontrados e corrigidos.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| RCE sem autenticação no Axis 1.x (EOL) | CISA KEV e aviso oss-security, CVSS 9.8 | Crítica |
| RCE no REDCap via pesquisa pública | CISA KEV, CVSS 9.8 no Tenable | Crítica |
| RCE no Synology DSM | CISA KEV e Synology-SA-24:20, CVSS 9.8 | Crítica |

## O que fazer nesta semana

1. Inventariar instâncias de Apache Axis 1.x, REDCap, Synology DSM/BeeStation e LiteLLM expostas ou usadas em produção (responsável: gestão de vulnerabilidades / time de ativos).
2. Aplicar as correções ou a migração recomendada e, nos três casos com triagem forense, verificar se houve exploração antes do patch (responsável: CISO / resposta a incidentes).
3. Tratar Axis 1.x ainda em uso como exceção formal, com prazo para saída, porque não haverá release oficial (responsável: arquitetura / dono da aplicação).
