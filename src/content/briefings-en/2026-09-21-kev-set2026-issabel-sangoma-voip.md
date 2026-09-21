---
title: "Brazil VoIP: Issabel JWT and Sangoma Switchvox land in KEV"
description: "KEV Sep 2026: Issabel CVE-2026-89026 (hardcoded JWT) and Sangoma Switchvox CVE-2026-9586 — Brazil VoIP angle."
pubDate: 2026-09-21T10:54:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-voip.jpg"
tipo: vulnerabilidades
tags: ["kev", "issabel", "sangoma", "voip", "brasil", "jwt"]
notionUrl: "https://www.notion.so/3dd174117473814a9e3efc17a3cc4fe4"
---

In one line: Issabel PBX with a hardcoded JWT and Switchvox enter KEV — VoIP is still a critical surface in Brazil.

## What happened

In the September 2026 KEV: CVE-2026-89026 (Issabel — hardcoded JWT) and CVE-2026-9586 (Sangoma Switchvox), both with known exploitation according to CISA.

## Why it matters

Issabel (an Asterisk/Elastix fork) is common in Brazilian SMEs and call centers. A hardcoded JWT means a session can be forged without the user’s credential. Switchvox concentrates the SIP trunk and recording — compromise becomes toll fraud and audio leakage (personal data under LGPD).

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Issabel hardcoded JWT | CVE-2026-89026, KEV | Critical |
| Sangoma Switchvox | CVE-2026-9586, KEV | High |
| SIP/admin exposure | Weak inventory outside the DC | High |

## What to do this week

1. List Issabel/Switchvox PBX systems (version, admin/SIP exposure) — owner: telecom / network.
2. Apply the vendor patch and rotate secrets/JWT — owner: operations.
3. Signal it worked: no KEV PBX lacks evidence of a fix, and admin is off the open internet.
