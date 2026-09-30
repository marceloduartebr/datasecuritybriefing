---
title: "MDA reports incident on Brazil Land Platform"
description: "Unauthorized access via a legacy-module API on 18–19 September; ANPD notified on the 25th. Volume still under investigation."
pubDate: 2026-09-30T10:12:00-03:00
sourceName: "MDA"
sourceUrl: "https://www.gov.br/mda/pt-br/noticias/2026/09/nota-de-esclarecimento-1"
cover: "https://covers.duarte.top/covers/20260930-mda-terras-brasil-incidente.jpg"
tipo: incidente
tags: ["vazamento", "governo", "brasil", "lgpd"]
pais: br
notionUrl: "https://www.notion.so/3eb17411747381a1a590d3ab2f6c6a00"
---

**In one line:** A legacy system with a valid credential exposed the Brazil Land Platform registry; the authority was notified four days after identification.

## What happened

MDA identified on 22 September 2026 unauthorized access to a legacy module integrated with the Brazil Land Platform. A credential obtained irregularly made API requests on 18 and 19 September. Visible fields included CPF, name, mother's name, date of birth, sex, registration status, address and area code. Containment on 21 September; ANPD notified on 25 September. Scope is still under investigation.

## Why it matters

A legacy-to-platform integration without an access inventory turns a valid token into bulk lookup. Notifying data subjects requires a record-by-record map — the ministry has not published a count.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Legacy API + stolen credential | Official MDA note | High |
| Registry with address and filiation | Fields listed in the note | High |
| Volume of data subjects | Not disclosed | Undetermined |

## What to do this week

1. Inventory legacy APIs that read the live registry — owner: security + IT.
2. Review query logs by credential for 18–22 September — owner: SOC.
3. Signal: a list of reached records ready for possible notification.
