---
title: "SBC Medical Group confirms theft of data on 1.6 million customers in Japan"
description: "The Nasdaq-listed clinic operator said a third party extracted customer data, including passwords, from a web system of its Japanese subsidiary on November 16."
pubDate: 2026-11-21T08:50:00-03:00
sourceName: "SBC Medical Group"
sourceUrl: "https://ir.sbc-holdings.com/sbc-medical-group-reports-cybersecurity-incidents-in-japan/"
cover: "https://covers.duarte.top/covers/20261121-sbc-medical-group-vazamento-0810.jpg"
tipo: incidente
tags: ["sbc-medical", "saude", "vazamento", "retencao", "japao"]
pais: global
---

In one line: the statement carries the map by category and period that every notification should have, and reveals data kept since 2010.

## What happened

SBC Medical Group Holdings (Nasdaq: SBC) reported on November 18, 2026 that on November 16 there was unauthorized access to databases of a web system run by SBC Medical Group, Ltd., its Japanese subsidiary, and that a third party accessed and extracted customer information. The intrusion method and full scope are still under investigation. The company also filed the case with the SEC on a Form 8-K.

According to the statement, basic data on 1,624,000 people (names, sex, phone numbers, email addresses, passwords, addresses, dates of birth, patient card numbers, member IDs and survey answers, in whole or in part) covering 2010 to 2023 was obtained, along with 255,416 booking requests, 217,769 contact forms, 4,513 treatment monitoring records and 15,007 reviews. About 20,000 employee account records (names, IDs and passwords) were also obtained and, for 459 employees, bank and pension details. The company says it has not confirmed that electronic medical records were taken. Separately, also on November 16, it was notified of unauthorized access to clinic administrator accounts on the third-party booking platform Tribeau.

## Why it matters

The statement shows what a notification needs: categories, data types, number of people and period. At the same time, it exposes the cost of retention: more than a decade of records in a website system widened the reach of the incident.

## Risk reading

| Vector | Public evidence | Severity |
| --- | --- | --- |
| Prolonged retention of customer data | Basic data from 2010 to 2023 extracted | High |
| Customer and employee passwords | Customer passwords and about 20,000 employee accounts obtained | High |
| Third-party booking platform | Improper access to administrator accounts on Tribeau | Medium |

## What to do this week

1. List web systems that hold customer data older than five years and apply the retention policy (owner: Data Governance).
2. Check whether password tables use strong hashing and force resets where they do not (owner: Engineering).
3. Test whether the company can produce, per database, the map of categories, number of data subjects and period (owner: DPO).
