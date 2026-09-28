---
title: "Supply chain: GitLab, Artifactory y Magento en el KEV"
description: "KEV set/2026: CVE-2026-85706 GitLab path traversal unauth CVSS 10; CVE-2026-82329 (+42016/42018) Artifactory; Magento CVE-2026-75650."
pubDate: 2026-09-28T10:16:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-supply-chain.jpg"
tipo: vulnerabilidades
tags: ["kev", "gitlab", "artifactory", "magento", "supply-chain"]
notionUrl: "https://www.notion.so/3dd174117473812a9771c001a17634a8"
---

**En una línea:** SCM, repositorio de artefactos y e-commerce entran en el KEV — supply chain de código y tienda.

## Qué ocurrió

En el KEV de septiembre/2026: CVE-2026-85706 (GitLab path traversal no autenticado, CVSS 10); CVE-2026-82329 con compañeras CVE-2026-42016 y CVE-2026-42018 (JFrog Artifactory); CVE-2026-75650 (Magento/Adobe Commerce).

## Por qué importa

GitLab y Artifactory son la puerta del pipeline CI/CD. Path traversal unauth en SCM filtra secreto y código. Magento concentra PII y tarjeta en el retail BR — explotación KEV se convierte en incidente LGPD en horas.

## Lectura de riesgo

| Vector | Evidencia pública | Gravedad |
|---|---|---|
| GitLab path traversal | CVE-2026-85706 CVSS 10, KEV | Crítica |
| JFrog Artifactory | CVE-2026-82329, CVE-2026-42016, CVE-2026-42018, KEV | Crítica |
| Magento/Adobe Commerce | CVE-2026-75650, KEV | Alta |

## Qué hacer esta semana

1. Inventariar GitLab self-managed y Artifactory con versión — dueño: plataforma.
2. Confirmar Magento/Adobe Commerce y ventana de parche — dueño: e-commerce.
3. Señal de que funcionó: cada instancia listada tiene ticket de remediación KEV con evidencia de versión.
