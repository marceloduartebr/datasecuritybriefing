---
title: "Fireworks AI breach exposes Notion AI chat transcripts"
description: "An inference vendor with a zero-retention commitment held customer conversations, including pasted API keys."
pubDate: 2026-11-17T15:52:00-03:00
sourceName: "Notion"
sourceUrl: "https://www.notion.com/security/advisories/security-incident-involving-a-third-party-ai-vendor"
cover: "https://covers.duarte.top/covers/20261116-notion-fireworks-incidente.jpg"
tipo: incidente
tags: ["aispm", "shadow-ai", "terceiros", "vazamento"]
pais: us
---

In one line: the contract said zero retention, but the prompt content was in the AI vendor's environment when it was breached.

## What happened
Notion published on 11/12/2026 (updated bulletin) that the breach at Fireworks AI, the inference vendor Notion used for its Insights feature and to serve open-weight models, exposed Notion AI chat transcripts. Notion's timeline: on 11/2 Fireworks reported access to a dataset that appeared to be synthetic only; on 11/3 Notion cut the connection; on 11/4 it deleted all its data in Fireworks' system; on 11/6 Fireworks reported possible access to customer data; on 11/8 it confirmed the affected set; on 11/9 Notion notified affected customers. The transcripts came from the Insights dataset and, for most workspaces, were not attributable (no author or workspace, no tool results). Fewer than 1% of workspaces were affected. On 11/11 Notion revoked Notion API keys found in the messages, and on 11/12 it notified the issuers of third-party keys found in them. Insights was turned off and Notion stopped using Fireworks. According to BleepingComputer (11/11), Fireworks confirmed that an attacker entered its development environment through a third-party cloud provider on 10/23, taking metadata, billing data, model weights and some customers' datasets; it is Fireworks' second breach (the first, in early October, exposed environment variables with keys and tokens). Notion says its own systems were not breached and that Fireworks had a contractual zero-retention commitment. The bulletin was not reread for this briefing; the data comes from the reading recorded by the radar.

## Why it matters
Inference vendors receive the raw content of prompts, and users paste secrets and business data into them. A contractual retention commitment does not replace checking what was actually stored on the other side.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| AI vendor breached | Access to Fireworks' development environment through a third-party cloud provider | High |
| Secrets in prompts | API keys found in the transcripts and revoked | High |
| Retention beyond the contract | Insights dataset present despite the zero-retention commitment | Medium |

## What to do this week
1. List the AI and inference vendors that receive the company's prompts, directly or indirectly through SaaS — owner: security and privacy.
2. Find and rotate secrets pasted into AI tools, starting with API keys — owner: engineering teams.
3. Sign that it worked: for each AI vendor, there is a record of what data it receives and evidence of retention, not just the clause.
