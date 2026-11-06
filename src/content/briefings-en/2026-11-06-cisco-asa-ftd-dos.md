---
title: "CVE-2026-76418: Cisco ASA/FTD with SSL VPN DoS enters KEV"
description: "CISA added on October 29 a flaw that allows an unauthenticated attacker to restart Cisco Secure Firewall devices with SSL VPN."
pubDate: 2026-11-06T10:18:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/29/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261103-cisco-asa-ftd-dos.jpg"
tipo: vulnerabilidades
tags: ["cve", "cisco", "edge", "kev"]
pais: us
notionUrl: "https://www.notion.so/40d174117473816cbb5ac6f31f0c027b"
---

In one line: Flaw in Cisco ASA and FTD SSL VPN allows unauthenticated DoS and entered KEV on October 29.

## What happened

On October 29, 2026, CISA added CVE-2026-76418 to the KEV catalog. The vulnerability in the Remote Access SSL VPN of Cisco Secure Firewall ASA and FTD allows an unauthenticated attacker to force a device restart. CVSS 8.6. Cisco published fixes on October 28; there is no workaround. U.S. federal deadline: November 1, 2026.

## Why it matters

Perimeter devices with exposed VPN concentrate remote access. A DoS exploited in the KEV disrupts operations before any lateral movement. Priority shifts from patch calendar to immediate version verification and evidence of prior compromise.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Unauthenticated DoS in SSL VPN | CISA KEV + Cisco advisory | High |
| Active exploitation | Addition to KEV on 29/10 | High |
| Workaround | None | High |

## What to do this week

1. Inventory ASA and FTD with exposed SSL VPN — owner: networks / security.
2. Apply Cisco corrected versions — owner: operations.
3. Check logs for anomalous restarts before the patch — owner: SOC.
