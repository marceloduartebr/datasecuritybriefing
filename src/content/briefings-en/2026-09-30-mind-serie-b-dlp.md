---
title: "MIND raises $72M for AI-agent DLP"
description: "Crosspoint-led Series B takes total funding to $112M and bets on real-time DLP across email, endpoint, GenAI and SaaS."
pubDate: 2026-09-30T10:13:00-03:00
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/mind-secures-72-million-for-ai-powered-dlp/"
cover: "https://covers.duarte.top/covers/20260926-mind-serie-b-dlp.jpg"
tipo: noticia
tags: ["dlp", "mind", "funding", "genai", "agentes-de-ia"]
pais: us
notionUrl: "https://www.notion.so/3e717411747381b5a06bd7e042c4f8ca"
---

**In one line:** capital is betting that AI agents will run the DLP queue, and buyers need a way to audit those decisions.

## What happened

On 17 September 2026 Seattle DLP startup MIND announced a $72 million Series B led by Crosspoint Capital Partners, with YL Ventures and Paladin Capital Group. Total funding reaches $112 million; the company left stealth in 2024. According to MIND, the platform detects and blocks exfiltration in real time across email, endpoint, GenAI and SaaS, classifies data by content and context, and uses AI agents to investigate events, tune policies and close incidents. Proceeds go to product, enterprise expansion, partnerships and hiring.

## Why it matters

GenAI became an egress channel, and rule-based DLP does not keep up. Automation attacks a real pain (false positives and a backlog nobody clears) but shifts accountability: an agent decision needs a trail and human review.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Leak via prompt or upload to GenAI | thesis of the round | High |
| Automated DLP decision without audit | vendor claim about agents | Medium |
| Unvalidated efficacy | no public independent test | Undetermined |

## What to do this week

1. Map whether current DLP sees prompts and uploads to AI assistants.
2. Define how automated DLP decisions would be reviewed — owner: security + DPO.
3. Signal it worked: every auto-closed incident has a human-reviewed sample.
