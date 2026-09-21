---
title: "TheHatman: 3.64 million Azure records without a zero-day"
description: "Password spray and MFA fatigue. Fortune 500 firms are named; some of them call the data old or low-sensitivity."
pubDate: 2026-08-26T08:42:00-03:00
sourceName: "BleepingComputer"
cover: "https://covers.duarte.top/covers/20260826-azure-thehatman.jpg"
sourceUrl: "https://www.bleepingcomputer.com/news/security/hacker-claims-36-million-azure-account-records-stolen-from-major-companies/"
tags: ["vazamento", "azure", "identidade"]
notionUrl: "https://www.notion.so/3c717411747381379cabce5730d4212e"
---

In one line: the method is not sophisticated; the reach of the token is.

## What happened

Since 31 July the actor “TheHatman” has advertised stolen databases from Microsoft Azure tenants. Coverage names McDonald's, Vodafone, TCS, HCL Technologies, Kyndryl and Gap Inc., adding up to more than 3.6 million employee records — names, emails, job titles, phone numbers and corporate IDs. The described vector is password spray combined with MFA fatigue. Some of the named companies said the data would be old or of low sensitivity.

A sale claim is not a victim statement.

## Why it matters

There was no zero-day. There was persistence until someone approved an MFA push on autopilot. “We have MFA” is not the same sentence as “we know what that access reaches”.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Password spray + MFA fatigue | BleepingComputer coverage | High |
| Claimed volume | 3.64 million / Fortune 500 named | High |
| Corporate confirmation | Partial / contested | Undetermined |

## What to do this week

1. Review the MFA push-count policy and password-spray alerts in Entra/Azure AD — owner: identity.
2. For each app in the tenant, document the data a user token can read.
3. Signal it worked: a compromised access produces a list of systems and data types, not a “we are investigating”.
