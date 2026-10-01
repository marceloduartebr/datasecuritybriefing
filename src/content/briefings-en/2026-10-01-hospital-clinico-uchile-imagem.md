---
title: "Hospital Clínico at the University of Chile: ANCI saw the exam before the hospital"
description: "A criminal complaint in Santiago after ANCI flagged 120 GB of imaging exams on a forum. The full scope is still open."
pubDate: 2026-10-01T10:12:00-03:00
sourceName: "T13"
sourceUrl: "https://www.t13.cl/noticia/nacional/hospital-clinico-chile-querella-tras-ciberataque-filtracion-informacion-confidencial-30-9-2026"
cover: "https://covers.duarte.top/covers/20261001-hospital-clinico-uchile-imagem.jpg"
tipo: incidente
pais: cl
tags: ["vazamento", "saude", "chile", "terceiro"]
notionUrl: "https://www.notion.so/3ec174117473816d8b73ef6be335a29f"
---

In one line: the hospital only confirmed the exam leak after ANCI pointed to the forum.

## What happened

On 30 September 2026, T13 reported that Hospital Clínico de la Universidad de Chile filed a criminal complaint in Santiago's 3rd Guarantee Court for unlawful access and receiving computer data. The filing describes an intrusion into the Imaging Service on the RIS/PACS platform. ANCI notified the university on 20 September about the post "Red Clinica Chile 120 GB". The sample checked by the administrator matched hospital patients: RUT, name, sex, age, date of birth, exam date and time, modality, requesting physician, and results. The full scope was not closed. The compromised account was disabled and external access was suspended. The vendor named is AGFA.

## Why it matters

The imaging system sat outside internal monitoring. The first public evidence came from the authority, not from the hospital's own detection. A vendor contract does not prove which exams left.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Service account on RIS/PACS | Complaint and account disablement | High |
| Forum post | ANCI alert on 20 Sep; sample confirmed by the hospital | High |
| Third party (AGFA) | Hospital engaged the vendor for containment | Medium |
| Full scope | Not yet determined in the complaint | Undetermined |

## What to do this week

1. List RIS/PACS service accounts and who uses them — imaging operations.
2. Match exam-export logs to the data-subject inventory — security and privacy.
3. Signal: every off-hours export has an owner and a volume, without waiting for an external alert.
