---
title: "Edge — Plex Media Server, Plex2Shell chain exploited in KEV"
description: "CISA adds four Plex Media Server CVEs to KEV; the Plex2Shell chain allows unauthenticated RCE and is already exploited."
pubDate: 2026-10-28T10:16:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/20/cisa-adds-six-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261023-plex-plex2shell-kev.jpg"
tipo: vulnerabilidades
tags: ["vulnerabilidades", "kev", "plex", "edge"]
pais: us
notionUrl: "https://www.notion.so/40217411747381d1ac7eec5815c57d00"
---

In one line: Four flaws in Plex Media Server form the Plex2Shell chain and entered the CISA KEV on October 20 with confirmed active exploitation.

## What happened

On October 20, 2026, CISA included in the Known Exploited Vulnerabilities catalog the CVEs CVE-2026-96652, CVE-2026-96654, CVE-2026-96655 and CVE-2026-96656, which affect Plex Media Server before build 1.43.3.10861. The chain allows a remote unauthenticated attacker to execute code. The manufacturer confirmed active and widespread exploitation after a public PoC on October 16. Federal remediation deadlines: October 23 and November 3, depending on the CVE.

## Why it matters

Exposed media-server instances frequently fall outside perimeter and patch inventory. The chain shows that a “peripheral” component can become an entry and persistence point (miner and proxy).

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Unauthenticated RCE via Plex2Shell chain | KEV + manufacturer confirmation and honeypots | High |
| Outdated internet-facing instances | Exploitation observed days after PoC | High |
| Use for miner and proxy | Reports from researchers and Plex | Medium |

## What to do this week

1. Inventory Plex servers (including exposed NAS and home lab) and confirm version ≥ 1.43.3.10861 — operations / security.
2. Isolate or shut down non-updatable instances and review logs for anomalous processes — SOC.
3. Include the product in the edge / non-traditional device patch cycle — vulnerabilities.
