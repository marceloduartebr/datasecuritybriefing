---
title: "KEV Sep/2026: ScreenConnect and N-able on the MSP radar"
description: "CISA KEV Sep/2026 includes CVE-2026-84869 (ScreenConnect) and CVE-2026-86218 (N-able N-central) — MSP/RMM angle in Brazil."
pubDate: 2026-09-23T10:28:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-msp.jpg"
tipo: vulnerabilidades
tags: ["kev", "msp", "rmm", "screenconnect", "n-able"]
notionUrl: "https://www.notion.so/3dd17411747381049fcbfe5e3528317d"
pais: br
---

In one line: MSP remote access and RMM enter the KEV; the support channel becomes an exploitation surface.

## What happened

In the September/2026 KEV catch-up (catalog updated 14/09), CVE-2026-84869 (ConnectWise ScreenConnect) and CVE-2026-86218 (N-able N-central) appear, both with known exploitation according to CISA.

## Why it matters

In Brazil, MSPs concentrate dozens of clients in one console. Compromising the RMM inherits credentials, sessions and scripts — without a new phishing email. Service contracts rarely require evidence of a KEV patch within 48–72h.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| ScreenConnect | CVE-2026-84869, KEV | Critical |
| N-able N-central | CVE-2026-86218, KEV | Critical |
| MSP→client chain | Legitimate remote session post-exploit | High |

## What to do this week

1. Ask the MSP for evidence of version and patch for the KEV CVEs — owner: vendor management.
2. Restrict RMM console exposure (VPN/IP allowlist) — owner: network.
3. Signal that it worked: there is a written record of ScreenConnect/N-central version and remediation date aligned to the KEV.
