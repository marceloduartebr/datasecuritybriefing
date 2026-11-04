---
title: "Edge — Ivanti Connect Secure, zero-day chain exploited in the KEV"
description: "CISA added two Ivanti Connect Secure CVEs to the KEV on October 30; the chain delivers unauthenticated root on appliances that appeared patched."
pubDate: 2026-11-04T10:17:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/30/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261102-ivanti-connect-secure-kev.jpg"
tipo: vulnerabilidades
tags: ["edge", "ivanti", "kev", "vpn"]
pais: us
notionUrl: "https://www.notion.so/40c1741174738185a2dce93b0bc1b654"
---

In one line: Two Ivanti Connect Secure zero-days entered the KEV; the chain with the October bypass delivers root without authentication.

## What happened

On October 30, 2026, CISA added CVE-2026-111357 and CVE-2026-118527 to the Known Exploited Vulnerabilities catalog. CVE-2026-111357 (CVSS 7.0) allows privilege escalation to root in the dsinvoked broker that improperly trusts DSCache configuration data. CVE-2026-118527 allows file upload to a known location. Both chain with CVE-2026-104935, already in the KEV since October 13. Volexity documented actor UTA0576 exploiting the chain since at least October 3 on appliances running the version that fixed the bypass. Fixes arrived on October 29 (25.1.1.3 and 22.8R2.6). Federal deadline: November 2 for the first and November 13 for the second. Commands run in memory and logs are tampered; Ivanti's integrity tool may not detect them.

## Why it matters

An updated remote-access perimeter is still a blind spot. The partial October patch closed the main path but left the escalation open. Root on the gateway becomes an inventory of domain credentials.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Zero-day chain on VPN | CISA KEV + Volexity | High |
| Post-exploitation detection | Commands in memory, tampered logs | High |
| Domain credential exposure | Reported use of LAPS/BitLocker | High |

## What to do this week

1. Inventory exact versions of Ivanti Connect Secure and apply 25.1.1.3 or 22.8R2.6 — owner: infrastructure team.
2. Perform memory and network forensic triage, not only Integrity Checker — owner: SOC.
3. Confirm the gateway inventory is current and that there are no EOL appliances (22.8 ends Jan 2027) without a plan.