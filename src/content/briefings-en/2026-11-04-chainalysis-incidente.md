---
title: "Chainalysis confirms access to user data by attacker using agentic techniques"
description: "The incident started with names and emails and reached password hashes and live tokens for all users; Brazilian authorities use the platform."
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

> **Updated on 6 November 2026.** The original version of this briefing reflected the 30 October statement, which mentioned only non-sensitive data. On 4 November Chainalysis said that names, usernames, password hashes and live tokens for all users were exposed. The text below was revised with the company's updates.

**In one line:** What started as "names and emails" became password hashes and live tokens for all Chainalysis users, with products and login offline; Brazilian authorities rely on the tool.

## What happened

On 30 October 2026 Chainalysis published that it detected unauthorized access to internal systems and tools by an external actor using offensive agentic techniques. That statement mentioned only non-sensitive data (IDs, names, emails and role labels) and said there was no evidence of access to credentials or session tokens. On 2 November the company took Reactor and Data Solutions offline as a precaution.

On 4 November the picture changed. In the morning, the company reported an on-path attack that exposed passwords for a subset of customers and locked the affected accounts. That night, it said that names, usernames, password hashes and live tokens for all Chainalysis users were exposed, and took KYT, the other address screening products and the login page offline. The company says it has no evidence that investigations data was accessed or attribution data manipulated. On 6 November it began restoring KYT and Address Screening in phases, requiring trusted IPs, password resets and API key rotation; Reactor and Data Solutions remained offline.

Brazilian Public Prosecutors’ offices (RJ, SP, BA, SC and others) hold licenses and training on the platform.

## Why it matters

The first version of an incident is rarely the final one. In six days, the scope moved from customer contact data to credentials for the whole user base, and "no evidence of access to tokens" was replaced by exposed live tokens. Anyone who made decisions based on the first statement needs to revisit them. An investigation tool used by a public authority carries the identity and access of the investigators and operators themselves.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Password hashes and live tokens for all users | Company update of 4 November | High |
| KYT, address screening, Reactor and login unavailable | Updates of 2, 4 and 6 November | High |
| Impact on Brazilian authorities | Documented use by MPs | Indeterminate |

## What to do this week

1. Reset passwords and rotate API keys for every Chainalysis account, and revoke integrations that use those tokens — owner: identity team.
2. Check whether the same password was used in other systems and force a change wherever it was reused — owner: security.
3. Review decisions and controls based on the 30 October statement and follow the company's next updates — owner: CS / compliance.
