---
title: "Apple Pointer Authentication bypass enters the KEV"
description: "CISA added CVE-2024-27834 to the KEV catalog on 4 November; Apple’s fix is from May 2024."
pubDate: 2026-11-10T10:21:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261106-apple-pac-bypass-kev.jpg"
tipo: vulnerabilidades
tags: ["kev", "apple", "cve", "identidade"]
pais: us
notionUrl: "https://www.notion.so/410174117473815fbff2ef664db51879"
---

In one line: 2024 flaw in Apple’s WebKit enters the KEV with a federal deadline of 18 November.

## What happened

On 4 November 2026 CISA listed CVE-2024-27834. The flaw allows Pointer Authentication bypass for an attacker who already has arbitrary read and write. Fixed in May 2024. CVSS 5.5. Federal deadline 18 November.

## Why it matters

The KEV confirms exploitation. The existence of the patch does not prove that the user’s device has already received it.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Confirmed exploitation | Addition to the KEV on 4/11 | High |
| Patch window | Fix from May 2024 | Medium |

## What to do this week

1. Inventory Apple devices outside the fixed versions — owner: endpoint / MDM.
2. Confirm that the update policy produces evidence, not just a declaration — owner: security.
3. Signal: zero managed devices still vulnerable to the CVE.