---
title: "Microsoft: Purview and Entra block sensitive data on the path to shadow AI"
description: "GA of Purview classification on Entra Global Secure Access for human and agentic on-behalf-of traffic — the file stops before reaching unsanctioned AI."
pubDate: 2026-09-29T10:14:00-03:00
sourceName: "Microsoft Security Blog"
sourceUrl: "https://www.microsoft.com/en-us/security/blog/2026/09/24/whats-new-in-microsoft-security-september-2026/"
cover: "https://covers.duarte.top/covers/20260925-microsoft-purview-entra-shadow-ai.jpg"
tipo: noticia
tags: ["dspm", "shadow-ai", "microsoft", "purview", "aispm"]
notionUrl: "https://www.notion.so/3e617411747381ebb181ee5824c2ac20"
---

In one line: network control now sees the agent, not only the analyst's click.

## What happened

On 24 September 2026 Microsoft announced general availability of in-motion data protection with Purview and Entra Global Secure Access. Purview classification and policies are applied at the network layer to human actions and to agentic on-behalf-of traffic. Official example: upload of a sensitive document to an unsanctioned AI tool can be stopped before it leaves.

## Why it matters

Closes a gap that classic DSPM does not cover alone: data in transit to an uninventoried destination. Still depends on solid classification and a destination list. In LATAM, the value is evidence — a recorded block — not the vendor logo.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Upload to unsanctioned AI | GA Purview+Entra GSA | High |
| Agent OBO traffic | same announcement | High |
| Weak classification | control premise | Medium |

## What to do this week

1. Check whether classification covers the data that actually goes to AI.
2. List approved AI destinations and what must be blocked at the edge.
3. Signal that it worked: block log from a controlled test, with agent and with user.
