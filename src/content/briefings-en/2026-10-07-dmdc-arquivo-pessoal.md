---
title: "DMDC: nine months of access to an unencrypted military personnel file"
description: "The Pentagon personnel center notified people in September of unauthorized access found in July, with unencrypted PII."
pubDate: 2026-10-07T10:18:00-03:00
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/pentagon-personnel-agency-data-breach-impacts-3-million-people/"
cover: "https://covers.duarte.top/covers/20261001-dmdc-arquivo-pessoal.jpg"
tipo: incidente
tags: ["incidente", "estados-unidos", "pessoal", "arquivo"]
pais: us
notionUrl: "https://www.notion.so/3ec1741174738144a1c9eb02a32831c5"
---

In one line: the personnel file was reachable for about nine months and the letter does not say which record was read.

## What happened

SecurityWeek reported on 29 September 2026 the Defense Manpower Data Center notice. The 18 September letter says that on 16 July 2026 a vulnerability in a file-sharing system allowed unauthorized access. Between October 2025 and the discovery, a small number of unauthorized users accessed files with unencrypted PII: Social Security number, name, date of birth, contact details, demographic data and military occupational specialty, depending on the person. The product was not named. DMDC says it has no indication of misuse. An official told CNN the reach would be 2.76 million living people and 294,000 deceased — a figure not in the letter.

## Why it matters

Closing the vulnerability does not answer what was read. Without a file trail, the notice stays generic and fraud risk remains undetermined.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Unencrypted file share | DMDC letter, 18 Sep | High |
| Access window | October 2025 to 16 Jul 2026 | High |
| Number of people | 2.76 million living and 294,000 deceased, via CNN, not in the letter | Medium |
| Misuse | DMDC says it has no indication | Undetermined |

## What to do this week

1. Inventory shares that hold personnel PII and whether the file is encrypted — HR and infrastructure.
2. Require a read log per file, not only the patch date — security.
3. Signal: an out-of-profile access produces a file and subject list within 24 hours.
