---
title: "Chainalysis confirms access to user data by attacker using agentic techniques"
description: "Blockchain analytics firm disclosed an incident in which client identity data was accessed; Brazilian authorities use the platform."
pubDate: 2026-11-04T18:18:00-03:00
sourceName: "Chainalysis"
sourceUrl: "https://www.chainalysis.com/blog/security-incident-october-30/"
cover: "https://covers.duarte.top/covers/20261104-chainalysis-incidente.jpg"
tipo: incidente
tags: ["vazamento", "ia", "brasil", "cripto"]
pais: br
slug: chainalysis-incidente
notionUrl: "https://www.notion.so/40e17411747381958c4ed9a234cc3579"
---

**In one line:** An attacker using agentic techniques accessed names, emails and role labels of Chainalysis users; the company took products offline and Brazilian authorities rely on the tool.

## What happened

On 30 October 2026 Chainalysis published that it detected unauthorized access to internal systems and tools by an external actor using offensive agentic techniques. IDs, full names, emails and organizational role labels of provisioned users were accessed. There is no evidence so far of access to investigation content, passwords, MFA or tokens. On 2 November the company took Reactor and Data Solutions offline as a precaution. Brazilian Public Prosecutors’ offices (RJ, SP, BA, SC and others) hold licenses and training on the platform.

## Why it matters

When the attacker uses an AI agent, the question is no longer only “who got in” but “what the agent reached and on which user inventory”. An investigation tool used by a public authority carries identity data of the investigators and operators themselves.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Access to user identity data | Company statement | High |
| Analytics products offline | 2 November update | Medium |
| Impact on Brazilian authorities | Documented use by MPs | Indeterminate |

## What to do this week

1. Inventory accounts and licenses on third-party investigation and analytics platforms — owner: CS / compliance.
2. Review access logs and password resets on provisioned accounts — owner: identity team.
3. Confirm whether the organization received the detail of accessed records promised by the company.
