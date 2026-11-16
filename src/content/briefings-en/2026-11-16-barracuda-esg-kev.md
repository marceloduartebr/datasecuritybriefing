---
title: "Barracuda ESG and related products enter KEV with confirmed exploitation"
description: "CISA adds CVE-2026-116606 and CVE-2026-111560 to the KEV on 10/11; Barracuda confirmed exploitation in a small number of organizations."
pubDate: 2026-11-16T10:29:00-03:00
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/recently-patched-barracuda-vulnerabilities-exploited-in-attacks/"
cover: "https://covers.duarte.top/covers/20261111-barracuda-esg-kev.jpg"
tipo: vulnerabilidades
tags: ["vulnerabilidades", "perimetro", "kev", "barracuda"]
pais: us
notionUrl: "https://www.notion.so/415174117473816f8173ee395f41b214"
---

In one line: Two Barracuda CVEs (ESG bypass and command injection) enter the KEV with a 3-day federal deadline and already confirmed exploitation.

## What happened

CISA added on 10/11/2026 the CVE-2026-116606 (ESG auth bypass, CVSS 9.3) and CVE-2026-111560 (command injection in ESG/ADC/WAF/etc., CVSS 8.6) to the KEV. Barracuda patched on 2/11 and confirmed on 9/11 exploitation in a small number of organizations. Chaining allows root if Admin UI is reachable.

## Why it matters

Exposed administrative surface turns patching into a race. The short BOD deadline reflects evidence of active exploitation, not just potential.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| ESG auth bypass | KEV + Barracuda confirmation | High |
| Command injection | KEV + multiple products | High |
| Exposed Admin UI | Exploitation requirement | High |

## What to do this week

1. Inventory Barracuda appliances (ESG, ADC, WAF, etc.) and confirm patch BNSF-40425/40430 or equivalent — owner: infrastructure.
2. Restrict Admin UI access to trusted internal networks — owner: network.
3. Check administrative interface access logs for the last 14 days — owner: SOC.
