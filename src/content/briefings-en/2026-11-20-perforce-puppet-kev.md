---
title: "Supply chain — Perforce Puppet Enterprise enters KEV with RCE via report deserialization"
description: "On 11/17 CISA added CVE-2026-115731, which allows code execution on the Puppet server from any signed agent certificate."
pubDate: 2026-11-20T12:52:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/17/cisa-adds-one-known-exploited-vulnerability-catalog"
cover: "https://covers.duarte.top/covers/20261118-perforce-puppet-kev.jpg"
tipo: vulnerabilidades
tags: ["cve", "kev", "supply-chain", "puppet", "eua"]
pais: us
---

In one line: A signed agent certificate is enough to run code on the server that signs trust for the whole fleet.

## What happened

On November 17, 2026 CISA added CVE-2026-115731 (deserialization of untrusted data in Puppet report processing) to the KEV catalog. The flaw lets a client with any certificate signed by the Puppet CA submit a malicious report and run code on the server with the service user's privileges. The patch was released on November 3; exploitation was flagged on November 4. If the CA autosigns without strong verification, the vector becomes unauthenticated.

## Why it matters

Configuration management tools hold the key that defines what each system receives. Compromising the Puppet server does not stop at the host itself: the attacker can issue certificates and change what will be delivered in the next cycle. The agent certificate inventory and the autosign policy are surface controls, not just patch controls.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| RCE via signed report | KEV + Perforce advisory + SecurityWeek | High |
| Autosign without verification | CNA / CISA description | High if enabled |
| CA compromise | Perforce advisory | High |

## What to do this week

1. Inventory Puppet Servers and versions (Enterprise and Core) — owner: platform.
2. Confirm whether autosign is disabled or uses strong verification — owner: identity/infra.
3. Apply patches 2026.0.1 / 2025.12.1 / 2023.8.13 or equivalents and restart the service — owner: platform.
