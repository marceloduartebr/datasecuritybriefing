---
title: "Supply chain: GitLab, Artifactory and Magento in the KEV"
description: "KEV Sep/2026: CVE-2026-85706 GitLab unauth path traversal CVSS 10; CVE-2026-82329 (+42016/42018) Artifactory; Magento CVE-2026-75650."
pubDate: 2026-09-28T10:16:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-supply-chain.jpg"
tipo: vulnerabilidades
tags: ["kev", "gitlab", "artifactory", "magento", "supply-chain"]
notionUrl: "https://www.notion.so/3dd174117473812a9771c001a17634a8"
---

**In one line:** SCM, artifact repository and e-commerce enter the KEV — code and store supply chain.

## What happened

In the September/2026 KEV: CVE-2026-85706 (GitLab unauthenticated path traversal, CVSS 10); CVE-2026-82329 with companions CVE-2026-42016 and CVE-2026-42018 (JFrog Artifactory); CVE-2026-75650 (Magento/Adobe Commerce).

## Why it matters

GitLab and Artifactory are the door to the CI/CD pipeline. Unauth path traversal in SCM leaks secrets and code. Magento concentrates PII and card data in Brazilian retail — KEV exploitation becomes an LGPD incident within hours.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| GitLab path traversal | CVE-2026-85706 CVSS 10, KEV | Critical |
| JFrog Artifactory | CVE-2026-82329, CVE-2026-42016, CVE-2026-42018, KEV | Critical |
| Magento/Adobe Commerce | CVE-2026-75650, KEV | High |

## What to do this week

1. Inventory self-managed GitLab and Artifactory with version — owner: platform.
2. Confirm Magento/Adobe Commerce and patch window — owner: e-commerce.
3. Signal that it worked: each listed instance has a KEV remediation ticket with version evidence.
