---
title: "Cisco Secure Email Gateway: pre-auth path traversal in KEV"
description: "CISA added CVE-2026-76519 on October 14; active exploitation confirmed; federal deadline October 17."
pubDate: 2026-10-21T10:17:00-03:00
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/cisco-warns-of-exploited-secure-email-gateway-vulnerability/"
cover: "https://covers.duarte.top/covers/20261015-cisco-secure-email-kev.jpg"
tipo: vulnerabilidades
tags: ["kev", "cisco", "edge", "cve"]
pais: us
notionUrl: "https://www.notion.so/3fa17411747381a0b0dbf368eb497f01"
---

In one line: CVE-2026-76519 on Cisco Secure Email Gateway allows file write and root RCE without login when File Reputation is active.

## What happened

On October 14, 2026 CISA added CVE-2026-76519 to the KEV. Relative path traversal allows an unauthenticated remote attacker to write files and execute commands as root. Condition: File Reputation (AMP) enabled and Content Scanner Tools < 25.3.0.5525. Cisco confirmed exploitation in October. Patch on September 14 (AsyncOS 15.5.5-014 / 16.5.0-780). FCEB deadline: October 17.

## Why it matters

The same component that inspects attachments becomes the vector. Without inventory of scanner version and appliance exposure, the three-day deadline may already have passed.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Pre-auth path traversal | CISA KEV + Cisco | High |
| Root RCE | Confirmed | High |
| Active File Reputation | Exploitation condition | High |

## What to do this week

1. Inventory Secure Email Gateway with active File Reputation and Content Scanner version — SOC/Infra.
2. Apply AsyncOS 15.5.5-014 or 16.5.0-780 or higher — Operations.
3. Confirm absence of exploitation in attachment logs — IR.
