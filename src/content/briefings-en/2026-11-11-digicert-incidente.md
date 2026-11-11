---
title: "DigiCert: account without MFA read customer archive for six days and confirmation took four months"
description: "An internal system was exposed to the internet after a 2025 migration; the account was seen in June, but data access was only confirmed in October."
pubDate: 2026-11-11T10:24:00-03:00
sourceName: "Mozilla Bugzilla (relatório da DigiCert)"
sourceUrl: "https://bugzilla.mozilla.org/show_bug.cgi?id=2084460"
cover: "https://covers.duarte.top/covers/20261109-digicert-incidente.jpg"
tipo: incidente
pais: us
tags: ["vazamento", "mfa", "documentos-de-identidade", "autoridade-certificadora", "eua"]
notionUrl: "https://www.notion.so/4121741174738115b0aaf1f2c1e15c36"
---

In one line: DigiCert saw the unauthorized account in June and closed access in July, but only in October discovered that customer data, including identity documents, had been read.

## What happened

In the report published on Mozilla Bugzilla (bug 2084460), DigiCert states that, in an infrastructure migration on February 4, 2025, an internal business system left a VPN-restricted segment and became accessible from the internet. A self-registration feature of the account manager, intended for another use, allowed creating accounts that did not go through the MFA required for other access and that, by default, had read-only profile. One of those accounts accessed archived data between June 27 and July 2, 2026.

The team noticed external accounts in June and released the authorization fix on July 2, but treated the case as account creation. On October 12 the company began to suspect data access and, on October 19, confirmed access to part of the archive. The data are mostly commercial contacts (name, email, phone and address); in a small portion of accounts, they include documents submitted for validation, such as driver's license, passport or utility bill. According to DigiCert, the account could not write records, approve validations or issue certificates, and CA, CertCentral and DigiCert ONE were not affected. The company says it contacted affected customers and informed the police, but did not disclose how many people were impacted, even after requests from Bugzilla participants.

## Why it matters

The incident shows three intervals that usually go unnoticed: the time a system remains exposed after a migration, the time between seeing an anomalous account and understanding what it read, and the time until notifying those whose document was exposed. In all of them, what was missing was not access control, but visibility into the data stored in the system.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Exposure after migration | System left VPN segment on 04/02/2025 | High |
| Self-registration without MFA | Unassigned accounts read the archive | High |
| Identity document in business archive | Minority of accounts, no number disclosed | High |
| Delay in impact analysis | Account seen in June, access confirmed 19/10 | Medium |

## What to do this week

1. List systems moved off-network in the last 24 months and check whether any became accessible from the internet — owner: infrastructure.
2. Inventory where copies of customer identity documents are stored and set a retention period — owner: privacy and data governance.
3. Signal that it worked: for any anomalous account, the team can say in hours, not months, which records it could read.
