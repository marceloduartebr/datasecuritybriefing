---
title: "AI agents compromise at least 15 health entities in Argentina"
description: "CrowdStrike documents an actor who used Claude Code to breach health organizations and extract credentials and clinical records."
sourceName: "Brújula Digital"
sourceUrl: "https://brujuladigital.net/brujula-futuro/2026/10/26/en-solo-cuatro-meses-en-argentina-hackearon-al-menos-15-entidades-de-salud-con-ia-68329"
tipo: incidente
tags: ["argentina", "saude", "ia", "agentes", "crowdstrike"]
pubDate: 2026-11-03T18:18:00-03:00
cover: https://covers.duarte.top/covers/20261028-argentina-ia-saude-crowdstrike.jpg
slug: argentina-ia-saude-crowdstrike
notionUrl: https://app.notion.com/406174117473819a9fd8c719ea8bf3a8
pais: ar
---

In one line: An actor using AI agents compromised at least 15 Argentine health entities and extracted credentials and clinical records from at least one.

## What happened

CrowdStrike identified four actors who used AI agents between May and August 2026. One of them, with a pentest-derived framework and Claude Code, compromised at least 15 health organizations in Argentina. From at least one, credentials and clinical histories were extracted. Entities unnamed; total volume not quantified.

## Why it matters

Health data cannot be replaced. The speed of the agent shortens the time from detection to response. An inventory of systems and credentials is a prerequisite for notification and containment.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Clinical records / credentials | Extraction documented from at least one | High |
| Autonomous agents | Claude Code with two agents | High |
| Entity names | Not disclosed | Undetermined |

## What to do this week

1. Review detection of lateral movement and use of code agents in health networks — SOC owner.
2. Confirm inventory of systems storing clinical records — data owner.
3. Test time to reconstruct reach in an unauthorized access scenario.
