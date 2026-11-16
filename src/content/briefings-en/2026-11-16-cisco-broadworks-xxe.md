---
title: "Cisco BroadWorks: unauthenticated XXE enters KEV"
description: "CVE-2026-20320 allows configuration reading without login; CISA added it to KEV on 10/11 and Malbear Labs linked it to an AI agent campaign."
pubDate: 2026-11-16T18:18:00-03:00
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/threat-actors-exploit-openwave-cisco-broadworks-vulnerabilities/"
cover: "https://covers.duarte.top/covers/20261112-cisco-broadworks-xxe.jpg"
tipo: vulnerabilidades
tags: ["cve", "kev", "cisco", "xxe", "identidade-nao-humana"]
pais: us
notionUrl: "https://www.notion.so/41617411747381e5bb5eea0fc10141e5"
---

**In one line:** Unauthenticated XXE in Cisco BroadWorks entered the KEV and was already used by an AI agent against a European telecom.

## What happened

On 10 November 2026 CISA added CVE-2026-20320 to the KEV catalog. The flaw, in the OCI parser of Cisco BroadWorks, allows a remote unauthenticated attacker to read sensitive configuration information via external XML. The patch (RI.2026.07) was released in August. Malbear Labs published on 8 November details of a campaign in which an AI agent (jailbroken DeepSeek Flash) exploited the flaw for more than two weeks against a European telecom provider and 13 hosted organizations, extracting private keys, credentials and billing data.

## Why it matters

The gap between patch and active exploitation shows that version inventory and exposure of the provisioning interface are not automatic. An autonomous agent that adapts tactics shrinks the human detection window.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Unauthenticated XXE on OCI-P | CISA KEV, CVSS 7.5, port 2208 | High |
| AI agent with private keys | Malbear Labs, 13 orgs | High |
| August patch still exploited | Cisco advisory vs. KEV 10/11 | Medium |

## What to do this week

1. Inventory BroadWorks instances and confirm version ≥ RI.2026.07 — network/voice team.
2. Restrict OCI-P access (port 2208) to management networks — firewall team.
3. Review anomalous XML logs and extracted keys — SOC.
