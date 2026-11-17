---
title: "Baker Tilly notifies of SSN leak on a vendor's platform"
description: "Client and dependent data left a third party's environment; the firm has not disclosed how many people were affected."
pubDate: 2026-11-17T15:50:00-03:00
sourceName: "SC Media"
sourceUrl: "https://www.scworld.com/brief/baker-tilly-data-breach-exposes-client-information"
cover: "https://covers.duarte.top/covers/20261116-baker-tilly-incidente.jpg"
tipo: incidente
tags: ["vazamento", "terceiros", "eua"]
pais: us
---

In one line: the data left the vendor, but working out who was affected is still Baker Tilly's job.

## What happened
Baker Tilly Advisory Group, a US accounting and advisory firm (US$ 6.8 billion in annual revenue), is notifying clients and dependents of a breach discovered on September 6, 2026. An unauthorized actor accessed data stored on a platform run by an undisclosed third-party service provider. Full names, addresses and Social Security numbers were exposed. The filing with the Texas Attorney General lists 10,456 people in that state alone; there are notices in California and South Carolina as well. The total was not disclosed. The firm says the incident happened in the third party's environment, not on its own network; it hired experts, notified law enforcement and offers 24 months of monitoring through Experian. There are no reports of misuse and no ransomware group has claimed it. The news is from SC Media (Nov 12), based on BleepingComputer; the official notice was not reread for this briefing.

## Why it matters
Accounting firms hold the tax identifiers of clients and their dependents. When that data sits on a third party's platform, the incident happens outside the perimeter, but the duty to notify and to size the impact stays with whoever collected the data.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Third-party platform | Unauthorized access in the vendor's environment | High |
| Tax identifier (SSN) | Name, address and SSN exposed, including dependents | High |
| Unknown scope | Total not disclosed; notifications by state | Medium |

## What to do this week
1. List the vendors that store client personal data and which fields each one receives — owner: privacy/DPO.
2. Confirm in the contract the incident notice period and the right to get the list of affected records — owner: legal and procurement.
3. Sign that it worked: for any vendor, answer within hours how many data subjects and which fields are in its environment.
