---
title: "FreeSWITCH: code injection via SIP MESSAGE enters the KEV"
description: "CISA added CVE-2026-116779 on November 9. A SIP message can execute system commands on FreeSWITCH up to 1.11.2."
pubDate: 2026-11-13T10:20:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/09/cisa-adds-four-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261110-freeswitch-kev.jpg"
tipo: vulnerabilidades
tags: ["voip", "kev", "cve", "freeswitch", "eua"]
pais: us
notionUrl: "https://www.notion.so/41417411747381bd95b4dd90e1b6ef9b"
---

In one line: FreeSWITCH softswitch up to 1.11.2 executes a system command from a SIP MESSAGE.

## What happened

On November 9, 2026, CISA included CVE-2026-116779 in the KEV. The flaw, documented in SignalWire advisory GHSA-mg63-h38w-8p9p, allows a peer that delivers a SIP MESSAGE to a profile to select the chat proto “api” and run switch_api_execute. Result: execution of FreeSWITCH API commands and operating system sinks with the process privileges. Affects versions ≤ 1.11.2; the default enables inbound chat. Exploitation observed in the wild. Fix in 1.11.3 closes the route by default (enable-chat-api-proto off).

## Why it matters

Voice edge and softswitch are still treated as “just telephony”. The protocol parser decides what to execute before any application control. Inventory of exposed SIP surface and of FreeSWITCH/Asterisk versions is a precondition to know whether the access policy has technical evidence.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| SIP MESSAGE to proto api | Advisory + KEV 09/11 | High |
| Default profile with inbound chat | SignalWire documentation | High |
| Execution with process privilege | GHSA and NVD | High |

## What to do this week

1. Inventory FreeSWITCH ≤ 1.11.2 with SIP profile accessible from outside — owner: network/voice.
2. Update to 1.11.3 or disable enable-chat where not needed — owner: platform.
3. Review logs of suspicious SIP MESSAGE and of API execution in the period before the patch — owner: SOC.
