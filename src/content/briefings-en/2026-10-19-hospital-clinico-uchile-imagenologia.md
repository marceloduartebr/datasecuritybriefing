---
title: "Hospital Clínico U. Chile confirms cyberattack on imaging platform after ANCI alert"
description: "ANCI notified on September 20; the hospital filed a criminal complaint on September 30 for access to exams and patient data in the RIS PACS."
pubDate: 2026-10-19T10:16:00-03:00
sourceName: "T13"
sourceUrl: "https://www.t13.cl/noticia/nacional/hospital-clinico-chile-querella-tras-ciberataque-filtracion-informacion-confidencial-30-9-2026"
cover: "https://covers.duarte.top/covers/20261013-hospital-clinico-uchile-imagenologia.jpg"
tipo: incidente
tags: ["incidente", "saude", "chile", "ciberseguranca"]
pais: cl
notionUrl: "https://www.notion.so/3f717411747381cb98c3f2f0c55944ea"
---

In one line: External forum alert exposed exam data from the Hospital Clínico of the University of Chile; the institution confirmed and filed a criminal complaint.

## What happened

On September 20, 2026 the National Cybersecurity Agency (ANCI) notified the University of Chile about a forum post (“Red Clinica Chile 120 GB”) attributed to the hospital. The administrator confirmed the data belonged to patients. Access reached the RIS PACS of the Imaging Service. Fields included RUT, name, date of birth, exams and results. On September 30 the hospital filed a criminal complaint for illicit access and receipt of data. Full scope still undetermined.

## Why it matters

Detection came from an external authority. The interval between the alert and mapping what was reached defines what the organization can notify with evidence, not estimate. In healthcare, exam results cannot be changed.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Access to imaging platform | Complaint and administrator confirmation | High |
| Forum publication | ANCI alert on 120 GB announcement | High |
| Full scope | Still undetermined by the hospital | Undetermined |

## What to do this week

1. Map imaging and PACS systems with external or third-party access — operations owner.
2. Test whether the inventory can identify touched fields in under 72 hours after external alert — incidents owner.
3. Signal it worked: scope report with technical evidence, not just a statement.
