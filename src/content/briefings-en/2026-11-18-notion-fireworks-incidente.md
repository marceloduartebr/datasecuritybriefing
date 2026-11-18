---
title: "Fireworks AI breach exposes Notion AI chat transcripts"
description: "An inference vendor with a zero-retention commitment held customer conversations, including pasted API keys."
pubDate: 2026-11-18T16:56:00-03:00
sourceName: "Notion"
sourceUrl: "https://www.notion.com/security/advisories/security-incident-involving-a-third-party-ai-vendor"
cover: "https://covers.duarte.top/covers/20261116-notion-fireworks-incidente.jpg"
tipo: incidente
pais: us
tags: ["aispm", "shadow-ai", "terceiros", "vazamento"]
---

In one line: the contract said zero retention, but prompt content was sitting in the AI vendor's environment when it was breached.

## What happened
Notion published on 12/11/2026 (updated bulletin) that the breach at Fireworks AI, the inference vendor Notion used for its Insights feature and to serve open-weight models, exposed Notion AI chat transcripts. Notion's timeline: on 2/11 Fireworks reported access to a dataset that appeared to be synthetic only; on 3/11 Notion cut the connection; on 4/11 it deleted all its data in Fireworks' system; on 6/11 Fireworks reported possible access to customer data; on 8/11 it confirmed the affected set; on 9/11 Notion notified the affected customers. The transcripts came from the Insights dataset and, for most workspaces, were not attributable (no author or workspace, no tool results). The impact covers less than 1% of workspaces. On 11/11 Notion revoked Notion API keys found in the messages and on 12/11 notified the issuers of third-party keys found in them. Insights was switched off and Notion stopped using Fireworks. According to BleepingComputer (11/11), Fireworks confirmed that an attacker entered its development environment through a third-party cloud provider on 23/10, taking metadata, billing data, model weights and some customers' datasets; it is Fireworks' second breach (the first, in early October, exposed environment variables with keys and tokens). Notion states that its own systems were not breached and that Fireworks had a contractual zero-retention commitment. The bulletin was not reread for this briefing; the data comes from the reading recorded by the radar.

## Why it matters
Inference vendors receive the raw content of prompts, and users paste secrets and business data into them. A contractual retention commitment is no substitute for verifying what was actually stored on the other side.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| AI vendor breached | Access to Fireworks' development environment via a third-party cloud provider | High |
| Secrets in prompts | API keys found in the transcripts and revoked | High |
| Retention beyond the contract | Insights dataset present despite the zero-retention commitment | Medium |

## What to do this week
1. List the AI and inference vendors that receive the company's prompts, directly or indirectly via SaaS — owner: security and privacy.
2. Search for and rotate secrets pasted into AI tools, starting with API keys — owner: engineering teams.
3. Sign it worked: for each AI vendor, there is a record of what data it receives and evidence of retention, not just the clause.
