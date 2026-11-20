---
title: "iFood confirms unauthorized access to registration data of customers, couriers and partners"
description: "On November 14 iFood identified and contained unauthorized access to its systems. The November 19 notice details the impact by profile and does not state the number of people affected."
pubDate: 2026-11-20T08:50:00-03:00
sourceName: "iFood"
sourceUrl: "https://institucional.ifood.com.br/releases/vazamento-de-dados"
cover: "https://covers.duarte.top/covers/20261120-ifood-vazamento-dados-cadastrais-0813.jpg"
tipo: incidente
tags: ["ciberseguranca", "protecaodedados", "lgpd", "ifood", "vazamentodedados"]
pais: br
---

In one line: iFood confirmed it contained, on November 14, unauthorized access to registration records, with different impact for customers, partners and couriers, and has not yet disclosed the total number affected.

## What happened

On November 19, 2026 iFood published its "Registration Data Leak Notice". The company says that on the 14th it identified and contained unauthorized access to some of its systems. According to the notice, passwords, credit cards and other payment methods, balances, bank statements and biometric information were not accessed. As of publication, the company says it has found no evidence that the accessed information was disclosed or misused. Services continue to operate normally.

The impact varies by audience, according to iFood:

- Customers and iFood Benefícios users: only the phone number, with no name, CPF, email, address or other associated data.
- Restaurant representatives and other partners: registered phone number and/or CPF.
- Couriers: some registration data that may include name, email, phone, CPF and, in some cases, the branch and account used for payouts. The company says no addresses were leaked and that not everyone was affected in the same way. Those whose data was accessed should receive an email with the details.

iFood notified Brazil's National Data Protection Authority (ANPD) and says it is cooperating with the authority. The investigation and monitoring continue. The company did not disclose the number of people affected or the method used to gain access.

## Why it matters

The notice already distinguishes what was read in each type of record, which suggests some scoping of the incident, but the total number of data subjects and the window during which the access remained open have not been published. A customer's phone number, even without an associated name in the official scope, is enough for social engineering attempts in the platform's name. Representatives' CPF numbers and couriers' payout account data widen the fraud surface. Notifying the ANPD and warning by email is no substitute for a public inventory of the scope.

## Risk reading

| Vector | Public evidence | Severity |
| --- | --- | --- |
| Unauthorized access to internal systems on 11/14 | Official iFood notice of 11/19 | High |
| Phone numbers of customers and iFood Benefícios users | Official scope, with no associated name, CPF, email or address | Medium |
| Phone number and/or CPF of partner representatives | Official notice | High |
| Registration data and, in some cases, payout branch and account of couriers | Official notice; no address, balances or statements | High |
| Number affected and access vector | Not disclosed as of the notice | High |

## What to do this week

1. Privacy and security teams: check whether there is a contractual relationship, integration or registration of employees or couriers with iFood and log the incident in the third-party inventory, with the official scope by profile. Owner: DPO / information security.
2. Customer service and fraud prevention: instruct teams and exposed audiences to treat only the official channels listed by iFood as legitimate and to refuse requests for passwords, codes or payments made by phone, SMS or email. Owner: customer service / anti-fraud.
3. Identity and access management: review which partners and internal applications read phone numbers, CPF and payment or payout data, and whether there is a record of who accessed what between November 14 and 19. Owner: identity and access / data.
