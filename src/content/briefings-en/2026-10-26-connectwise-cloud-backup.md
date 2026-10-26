---
title: "ConnectWise: Cloud Backup credential opens Microsoft 365 tenants"
description: "A compromised vendor identity allowed sign-ins to 162 M365 tenants on October 15, 2026."
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/connectwise-suspends-cloud-services-in-response-to-cyberattack/"
tipo: incidente
tags: ["incidente", "supply-chain", "microsoft-365", "msp", "eua"]
pais: us
pubDate: 2026-10-26T18:19:00-03:00
cover: "https://covers.duarte.top/covers/20261020-connectwise-cloud-backup.jpg"
slug: connectwise-cloud-backup
---

In one line: ConnectWise Cloud Backup credential used to access 162 Microsoft 365 tenants.

## What happened

On October 15, 2026 Huntress detected authentications of the ConnectWise Cloud Backup identity in 162 Microsoft 365 tenants from IP 144.172.64.128. The credential was a client assertion in the vendor's tenant. The same day the Cloud Management app elevated itself to Global Administrator in one tenant and planted client secrets. ConnectWise suspended the services on October 17 and 18. No evidence of access to backup data.

## Why it matters

Third-party app with broad consent (including Directory.ReadWrite.All) acts as a supply-chain door. User MFA does not cover the service principal. Persistence via client secret survives revocation of the original app.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Shared vendor credential | Confirmed sign-ins in 162 tenants | High |
| Elevation and backdoor | Global Admin + client secrets in tenant | High |
| Backup data | No indication of access | Undetermined |

## What to do this week

1. Review consents of ConnectWise and similar apps in Entra ID — identity team.
2. Look for new client secrets and elevated roles since 10/15 — SOC.
3. Confirm that no token issued before revocation remains valid — cloud team.