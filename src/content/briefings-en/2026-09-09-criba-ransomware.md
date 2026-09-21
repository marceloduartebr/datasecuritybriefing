---
title: "Ransomware at CRIBA: Argentine-Uruguayan builder on DragonForce’s leak site"
description: "On 24 August DragonForce listed CRIBA on a leak site. The company has not commented; employee credentials were already circulating in infostealer bases."
pubDate: 2026-09-09T10:30:00-03:00
sourceName: "Ransomware.live / HudsonRock"
sourceUrl: "https://ransomware.live/id/Q3JpYmFAZHJhZ29uZm9yY2U="
cover: "https://covers.duarte.top/covers/20260830-criba-ransomware.jpg"
tipo: incidente
tags: ["vazamento", "ransomware", "argentina", "uruguai", "infostealer"]
notionUrl: "https://www.notion.so/3c8174117473817fac62f2605910a63a"
---

In one line: the leak-site listing arrived after employee credentials were already for sale — the signal existed before the ransomware.

## What happened

On 24 August 2026 the DragonForce group put CRIBA — one of Argentina’s largest builders, also operating in Uruguay — on its leak site. The claim speaks of financial documents, customer data and operational information on projects in both countries. By this briefing the company had not commented publicly on scope or exfiltration.

Infostealer intelligence (HudsonRock) points to credentials of at least two CRIBA employees circulating before the attack, plus dozens of accounts associated with the firm. A leak site is not a victim confirmation.

## Why it matters

Construction rarely enters the data conversation. A builder that grows country by country tends to scatter contracts, finance and customer files across local systems, each with its own level of protection. The surface grows without anyone having designed it.

The pattern that repeats is not the lack of antivirus: it is not seeing employee credentials already compromised months before the ransomware phase.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Exfiltration | Only a leak-site claim | Undetermined |
| Pre-attack credentials | Infostealer (HudsonRock) | Medium |
| AR/UY operation | Two countries, no statement | Undetermined |

## What to do this week

1. Cross corporate accounts with infostealer bases before treating the ransomware as an isolated event — owner: SecOps.
2. Map where contracts, finance and customer data sit in each country — owner: data owner / DPO.
3. Signal it worked: within hours, list which identities had already leaked and in which systems they still authenticate.
