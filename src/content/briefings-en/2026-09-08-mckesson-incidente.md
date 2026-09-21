---
title: "McKesson: incident in third-party apps and a claim of ~284 million records"
description: "The distributor confirms access to third-party applications; ShinyHunters speaks of a raw volume of patient rows in Salesforce/Snowflake."
pubDate: 2026-09-08T10:35:00-03:00
sourceName: "BleepingComputer / McKesson"
sourceUrl: "https://www.bleepingcomputer.com/news/security/mckesson-discloses-breach-after-shinyhunters-claims-patient-data-theft/"
cover: "https://covers.duarte.top/covers/20260830-mckesson-incidente.jpg"
tipo: incidente
tags: ["vazamento", "saude", "terceiros", "dspm", "lgpd"]
notionUrl: "https://www.notion.so/3cc17411747381da9750c43849ca10be"
---

In one line: Detecting access in a third-party app is one thing; mapping, record by record, what left a tenant that is not the official operations system is another.

## What happened

On 28 August 2026 McKesson — one of the largest distributors of medicines and hospital supplies in the US — reported an incident discovered on 25 Aug: unauthorised access to third-party applications and data extraction. The next day it updated that the confirmed cut so far was a subset of customers of the Oncology & Multispecialty and Medical-Surgical units.

The ShinyHunters group claims to have taken about 1 TB in four days (21 to 25 Aug) from Salesforce and Snowflake environments and speaks of approximately 284 million patient-related records — names, dates of birth, SSN, medical record, medication, allergy, appointments. The group itself told BleepingComputer the number is a raw row count, not unique individuals, and that it has not yet closed the inventory. McKesson did not confirm the volume or the named systems; the 8-K says that, as of the filing date, the incident was not classified as material.

## Why it matters

The point is not the size of the alleged number. It is the gap between detecting the access and knowing, record by record, what left an application that is not the official operations system. When clinical data lives in a third-party cloud, the controller’s policy does not replace the technical map of what that tenant actually holds.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Access to third-party apps | Confirmed by McKesson (8-K) | High |
| Volume ~284 million rows | ShinyHunters claim; company does not confirm | Undetermined |
| Clinical data in Salesforce/Snowflake | Group claim; not confirmed | Undetermined |

## What to do this week

1. List patient bases — own and vendor — that a valid SSO token can see — owner: security / privacy.
2. Demand a technical inventory of each clinical SaaS tenant (object, field, retention) — owner: AppSec / cloud.
3. Signal it worked: a subject-by-subject map ready for notice, without relying on a raw row count from the leak site.
