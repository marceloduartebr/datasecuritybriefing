---
title: "UnrealIRCd in KEV: any user can command the network"
description: "CISA added CVE-2026-114713 to KEV on 11/13. A flaw in labeled-response lets users inject S2S commands with server authority."
pubDate: 2026-11-17T16:05:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/13/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261116-unrealircd-kev-command-injection.jpg"
tipo: vulnerabilidades
tags: ["cve", "kev", "unrealircd", "perimetro"]
---

In one line: trust between linked servers becomes the attack vector when the tag content is not sanitized.

## What happened

On November 13, 2026 CISA added CVE-2026-114713 to the KEV catalog. The flaw is in the labeled-response module of UnrealIRCd 6.0.0 up to before 6.2.7.1. Any user on a network with two or more linked servers can inject newlines into the IRCv3 "label" tag and have server-to-server commands executed with server authority. The project rated it its most critical flaw in 15 years. Fixed in 6.2.7.1 or with hot-patch bundle-20261107. CISA deadline: November 16.

## Why it matters

The blind spot is the implicit trust in traffic between nodes. A patch policy produces no evidence that the hot-patch ran on every server in the mesh.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| S2S injection via the label tag | KEV + vendor advisory | High |
| Active exploitation | CISA SSVC: active | High |
| Hot-patch available | Vendor | Medium (depends on rollout) |

## What to do this week

1. Inventory UnrealIRCd 6.x instances with linked servers — owner: communications infrastructure.
2. Apply the hot-patch or upgrade and confirm the rehash on every node — owner: ops.
3. Check that the spamfilter workaround is in place until the patch lands — owner: security.
