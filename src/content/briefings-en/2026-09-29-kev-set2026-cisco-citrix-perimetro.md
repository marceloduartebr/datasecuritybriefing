---
title: "KEV Sep/2026: Cisco FMC and Citrix NetScaler on the perimeter"
description: "CISA adds CVE-2026-20079 (Cisco FMC/SCC auth bypass CVSS 10) and CVE-2026-19490 (Citrix NetScaler AAA 9.8) to the KEV in Sep/2026."
pubDate: 2026-09-29T10:14:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-perimetro.jpg"
tipo: vulnerabilidades
tags: ["kev", "cisco", "citrix", "perimeter", "auth-bypass"]
notionUrl: "https://www.notion.so/3dd1741174738165b5e4f7546e58b8c4"
---

In one line: firewall management and NetScaler AAA enter the KEV with critical CVSS and known exploitation.

## What happened

On 9/09/2026 CISA added to the Known Exploited Vulnerabilities Catalog CVE-2026-20079 (Cisco Secure Firewall Management Center / Security Cloud Control — authentication bypass, CVSS 10, EPSS ~0.76) and CVE-2026-19490 (Citrix NetScaler AAA, CVSS 9.8). Both affect perimeter surface and remote authentication with confirmed exploitation.

## Why it matters

Policy console and AAA portal are shortcuts to identity and traffic rules. Authenticated bypass on the manager leaves no "failed login" trail. In Brazil, FMC/SCC and NetScaler concentrate partner and MSP access — incomplete inventory delays the mandatory BOD/KEV patch.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Cisco FMC/SCC auth bypass | CVE-2026-20079 CVSS 10, KEV 2026-09-09, EPSS ~0.76 | Critical |
| Citrix NetScaler AAA | CVE-2026-19490 CVSS 9.8, KEV | Critical |
| Console/AAA inventory | Typical MSP and BR datacenter surface | High |

## What to do this week

1. List FMC/SCC and NetScaler AAA instances with version and exposure — owner: network / perimeter.
2. Apply vendor fix and validate admin access post-patch — owner: operations.
3. Signal that it worked: no policy console or AAA listed in the KEV remains without documented patch or mitigation evidence.
