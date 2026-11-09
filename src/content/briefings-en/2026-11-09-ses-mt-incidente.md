---
title: "SES-MT suffers new hacker attack and suspends systems; Várzea Grande stops issuing sanitary licenses"
description: "The preventive shutdown of state health systems stopped municipal services, and the official note does not say whether data was leaked."
pubDate: 2026-11-09T10:21:00-03:00
sourceName: "SES-MT"
sourceUrl: "https://www.saude.mt.gov.br/noticia/12507/ses-trabalha-para-restabelecer-sistemas-apos-novo-ataque-hacker"
cover: "https://covers.duarte.top/covers/20261109-ses-mt-incidente.jpg"
tipo: incidente
pais: br
tags: ["ataque", "saude", "setor-publico", "brasil"]
notionUrl: "https://www.notion.so/411174117473812ea7a3ec2e17525c1b"
---

In one line: The new attack on the Mato Grosso Health Secretariat shows that a state system shut down for containment brings down municipal services, and that knowing what stopped is not the same as knowing which data left.

## What happened

On November 2, 2026, SES-MT reported that it detected a new hacker attack on November 1 and suspended unit systems as a containment measure, maintaining regulation and care. On November 6, the sanitary surveillance of Várzea Grande temporarily suspended services, including the issuance of sanitary licenses, because the state sanitary surveillance system (SVS) remained offline, according to Estadão Mato Grosso. The secretariat's note does not inform whether there was access or data leakage.

## Why it matters

State health systems concentrate sensitive personal data and are a dependency for municipalities. The preventive shutdown is the right decision to contain an attack, but it exposes dependencies that are rarely in the response plan. And without an inventory of the data each system processes, communication to the ANPD and data subjects depends on an answer the organization does not yet have.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Unavailability of state health systems | SES-MT note of November 2 | High |
| Effect on municipal services (sanitary licenses) | Estadão Mato Grosso, November 6 | Medium |
| Access or leakage of health data | Not informed by the secretariat | Undetermined |

## What to do this week

1. Map which own services depend on third-party systems or other entities and what to do if they are shut down — owner: business continuity.
2. Confirm the inventory of sensitive personal data by system, to answer within hours which records were in an affected environment — owner: DPO / data governance.
3. Signal that it worked: in an exercise, the team lists in less than a day the data and data subjects affected by a randomly chosen system.