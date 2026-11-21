---
title: "CISA adds exploited flaws in Apache Axis, REDCap, Synology DSM and LiteLLM to KEV"
description: "On November 18, 2026 CISA added four CVEs to the KEV catalog based on evidence of active exploitation; three of them are due November 21 and require forensic triage."
pubDate: 2026-11-21T08:50:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/18/cisa-adds-four-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261118-kev-axis-redcap-synology-litellm-1759.jpg"
tipo: vulnerabilidades
tags: ["cisa", "kev", "axis", "redcap"]
pais: global
---

In one line: four actively exploited flaws enter KEV on the same day, and for three of them the federal deadline is November 21, with forensic triage.

## What happened

On November 18, 2026 CISA added four vulnerabilities to the KEV catalog based on evidence of active exploitation. CVE-2026-90436, in Apache Axis 1.x up to version 1.4, allows classes to be instantiated from a SOAP Fault without authentication; the project's oss-security advisory of November 6 assigns CVSS 9.8 and recommends migrating to Axis 2/Java or applying a targeted patch, because Axis 1 is out of support and is not expected to get a fix release. CVE-2026-90817, in REDCap from 13.3.0, allows unauthenticated remote code execution if the attacker knows a valid public survey hash; Tenable lists CVSS 9.8, and the CVE record points to fixes in versions 16.0.49 LTS, 17.3.10 LTS and 17.4.4 Standard. CVE-2024-10441, in Synology DiskStation Manager, is remote code execution in the plugin daemon, with CVSS 9.8 in advisory Synology-SA-24:20; fixes include DSM 7.2.2-72806-1, 7.2.1-69057-6, 7.2-64570-4 and 7.1.1-42962-7, plus BeeStation OS 1.1-65374. CVE-2026-40217, in BerriAI LiteLLM, is in the same alert, due December 2 and without mandatory forensic triage. For Axis, REDCap and Synology, the deadline for US federal agencies is November 21, with forensic triage required by BOD 26-04.

## Why it matters

Legacy Axis, REDCap research databases, Synology NAS and the LiteLLM AI gateway tend to sit outside the inventory the team looks at every day. A patch policy does not prove these products were found and fixed.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Unauthenticated RCE in Axis 1.x (EOL) | CISA KEV and oss-security advisory, CVSS 9.8 | Critical |
| RCE in REDCap via public survey | CISA KEV, CVSS 9.8 at Tenable | Critical |
| RCE in Synology DSM | CISA KEV and Synology-SA-24:20, CVSS 9.8 | Critical |

## What to do this week

1. Inventory Apache Axis 1.x, REDCap, Synology DSM/BeeStation and LiteLLM instances exposed or used in production (owner: vulnerability management / asset team).
2. Apply the fixes or recommended migration and, in the three cases with forensic triage, check whether exploitation happened before the patch (owner: CISO / incident response).
3. Treat Axis 1.x still in use as a formal exception with an exit date, because there will be no official release (owner: architecture / application owner).
