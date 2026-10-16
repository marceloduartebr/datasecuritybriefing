---
title: "Edge — Ivanti Connect Secure in KEV with pre-auth bypass"
description: "CISA added CVE-2026-104935 to KEV; confirmed exploitation in Connect Secure allows RCE without login."
pubDate: 2026-10-16T10:29:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/13/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261014-ivanti-connect-secure-kev.jpg"
tipo: vulnerabilidades
tags: ["vulnerabilidades", "kev", "ivanti", "edge", "vpn"]
pais: us
notionUrl: "https://www.notion.so/3f9174117473816d89bafe2250a88f99"
---

In one line: CVE-2026-104935 in KEV allows authentication bypass and command execution without login on Ivanti Connect Secure; federal deadline 16/10.

## What happened

On October 13, 2026, CISA added CVE-2026-104935 to the Known Exploited Vulnerabilities catalog. The flaw is authentication bypass by spoofing in Ivanti Connect Secure, allowing pre-authentication RCE. Affects versions 25.1.1.1 and earlier, 25.1.2.2 and earlier, and 22.8R2.4 and earlier. Ivanti confirms limited exploitation. Volexity reported a chain of three zero-days starting October 3 for root on an updated appliance, with credential theft and exfiltration. BOD deadline for FCEB: October 16. ICT may not detect because commands run in memory.

## Why it matters

VPN edge with bypass is perimeter access without credentials. Patch policy exists; evidence of compromise requires memory forensics, not just the integrity tool.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Active exploitation | Confirmed by Ivanti and CISA KEV | High |
| Pre-auth RCE | CVE description and advisory | High |
| Detection by ICT | Limited (commands in memory) | Medium |

## What to do this week

1. Inventory Connect Secure, version and exposure — networking.
2. Apply patch or isolate until fixed; plan forensics if exposed — SOC.
3. Signal: no affected appliance without patch or without evidence of non-compromise.
