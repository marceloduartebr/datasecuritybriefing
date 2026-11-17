---
title: "Uber is the third known victim of the breach at AI vendor Fireworks"
description: "A vendor's credentials opened Uber's account at that vendor and exposed data on 149,000 drivers."
pubDate: 2026-11-17T16:07:00-03:00
sourceName: "BleepingComputer"
sourceUrl: "https://www.bleepingcomputer.com/news/security/uber-notifies-drivers-of-data-breach-affecting-nearly-150-000-people/"
cover: "https://covers.duarte.top/covers/stg-20261117-uber-motoristas-fornecedor-ia-0840.jpg"
tipo: incidente
tags: ["vazamento", "terceiros", "inteligencia-artificial", "uber"]
pais: us
---

**In one line:** connecting data to a third-party AI platform hands control to the credentials of whoever runs that platform.

## What happened

On November 10, 2026 Uber began notifying drivers of a breach affecting 149,346 people, according to a filing with the Maine Attorney General. An attacker compromised a service provider's internal credentials and used them to access Uber's account at that provider. Names, driver's license numbers, dates of birth and addresses were exposed.

The provider alerted Uber on October 9. The company cut its data connections to the vendor and concluded on October 13 that data linked to it had been accessed. Uber did not name the provider; BleepingComputer, citing TechCrunch, identifies it as Fireworks, an AI infrastructure company. Fireworks attributed the attack to a financially motivated group tied to LLMjacking attacks; the same incident hit Cursor and Notion.

## Why it matters

It is the same incident that led Notion to confirm the exposure of Notion AI transcripts. Three known companies were hit through a single compromised credential at one AI vendor. The drivers' exposed data is permanent: a license number and a date of birth cannot be changed like a password.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Vendor's internal credentials | Attacker used the provider's credentials to enter Uber's account | High |
| Permanent identity data | License, date of birth and address exposed | High |
| Concentration in one AI vendor | The same incident hit Uber, Cursor and Notion | High |

## What to do this week

1. List integrations with third-party AI platforms and which personal data sets each one reaches — owner: architecture and data protection officer.
2. Cut each integration's scope to the minimum and require the vendor to show access controls over customer accounts — owner: third-party management.
3. Sign that it worked: when a vendor reports an incident, the company knows within hours which data was connected to it.
