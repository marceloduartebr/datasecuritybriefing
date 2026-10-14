---
title: "Legacy perimeter returns to the KEV in the Integrity Tech campaign"
description: "CISA, FBI and partners mark ProFTPD, BIND and Struts as exploited on 10/8; the mirrored federal deadline is 10/11."
pubDate: 2026-10-14T10:15:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/cybersecurity-advisories/aa26-281a"
cover: "https://covers.duarte.top/covers/20261009-integrity-tech-kev-perimetro.jpg"
tipo: vulnerabilidades
tags: ["kev", "perimetro", "cisa", "integridade"]
pais: us
notionUrl: "https://www.notion.so/3f4174117473813d8ef9cde7bbc14676"
---

In one line: the campaign enabled by Integrity Tech puts 2015–2016 edge services back on the KEV, with a short federal deadline.

## What happened

On October 8, 2026, CISA, FBI, NSA and partners published the joint advisory AA26-281A. The text attributes to actors linked to the Chinese government, enabled by Integrity Technology Group, the combined use of automated scanning, botnet and manual exploitation against U.S. critical infrastructure (government, manufacturing, healthcare and information technology) and organizations in North America, Southeast Asia and Africa. The evidence came from FBI investigations.

The appendix marks with an asterisk five CVEs newly added to the KEV: CVE-2015-3306 (ProFTPD), CVE-2015-5477 (ISC BIND), CVE-2016-3081 (Apache Struts), CVE-2021-3199 (ONLYOFFICE Docs) and CVE-2023-22894 (Strapi). Catalog mirrors record the addition on 10/8 and the federal deadline on 10/11. Shellshock, Pulse Connect Secure and GitLab appear as already-known exploitation, without the new-addition asterisk.

## Why it matters

A patch policy with permanent exception is not evidence that the service left the edge. The attacker in this campaign scans what still responds.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Exposed ProFTPD 1.3.5 (CVE-2015-3306) | KEV addition asterisk in AA26-281A | High |
| Struts with Dynamic Method Invocation (CVE-2016-3081) | Same appendix; command injection | High |
| Old BIND (CVE-2015-5477) | KEV addition; denial of service | Medium |
| ONLYOFFICE / Strapi | CVE-2021-3199 and CVE-2023-22894 in the same batch | Medium |

## What to do this week

1. Inventory ProFTPD, BIND, Struts, ONLYOFFICE and Strapi still reachable from outside — perimeter owner.
2. Disable what has no owner or apply the fix before 10/11 — application owner.
3. Signal that it worked: the external scan no longer returns those services in the appendix versions.
