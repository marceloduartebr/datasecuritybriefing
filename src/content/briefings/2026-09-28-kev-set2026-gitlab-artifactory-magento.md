---
title: "Supply chain: GitLab, Artifactory e Magento no KEV"
description: "KEV set/2026: CVE-2026-85706 GitLab path traversal unauth CVSS 10; CVE-2026-82329 (+42016/42018) Artifactory; Magento CVE-2026-75650."
pubDate: 2026-09-28T10:16:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-supply-chain.jpg"
tipo: vulnerabilidades
tags: ["kev", "gitlab", "artifactory", "magento", "supply-chain"]
notionUrl: "https://www.notion.so/3dd174117473812a9771c001a17634a8"
---

**Em uma linha:** SCM, repositório de artefatos e e-commerce entram no KEV — supply chain de código e loja.

## O que aconteceu

No KEV de setembro/2026: CVE-2026-85706 (GitLab path traversal não autenticado, CVSS 10); CVE-2026-82329 com companheiras CVE-2026-42016 e CVE-2026-42018 (JFrog Artifactory); CVE-2026-75650 (Magento/Adobe Commerce).

## Por que importa

GitLab e Artifactory são a porta do pipeline CI/CD. Path traversal unauth em SCM vaza segredo e código. Magento concentra PII e cartão no varejo BR — exploração KEV vira incidente LGPD em horas.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| GitLab path traversal | CVE-2026-85706 CVSS 10, KEV | Crítica |
| JFrog Artifactory | CVE-2026-82329, CVE-2026-42016, CVE-2026-42018, KEV | Crítica |
| Magento/Adobe Commerce | CVE-2026-75650, KEV | Alta |

## O que fazer nesta semana

1. Inventariar GitLab self-managed e Artifactory com versão — dono: plataforma.
2. Confirmar Magento/Adobe Commerce e janela de patch — dono: e-commerce.
3. Sinal de que funcionou: cada instância listada tem ticket de remediação KEV com evidência de versão.
