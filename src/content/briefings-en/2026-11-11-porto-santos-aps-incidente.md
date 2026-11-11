---
title: "Port of Santos: APS confirms cyberattack and still does not know if data was accessed"
description: "Port authority systems have been unavailable since November 6; operations continue under contingency and ANPD is reviewing the incident notification."
pubDate: 2026-11-11T10:17:00-03:00
sourceName: "Autoridade Portuária de Santos (APS), nota oficial via g1"
sourceUrl: "https://g1.globo.com/sp/santos-regiao/porto-mar/noticia/2026/11/10/porto-de-santos-confirma-ataque-cibernetico-nos-sistemas-mas-nao-sabe-se-dados-foram-acessados.ghtml"
cover: "https://covers.duarte.top/covers/20261111-porto-santos-aps-incidente.jpg"
tipo: incidente
pais: br
tags: ["ataque", "infraestrutura-critica", "portos", "setor-publico", "brasil"]
notionUrl: "https://www.notion.so/41417411747381748dace6a82c554312"
---

In one line: Latin America's largest port confirmed a cyberattack four days after losing its systems and still cannot say whether data left.

## What happened

On November 10, 2026, the Santos Port Authority (APS) confirmed in a statement that its systems became unavailable after a cyberattack. According to APS, the outage began on the morning of November 6, when a power failure affected the servers, and hit the website, internal systems, and services used by customers and users. Internet and telephony returned on November 9; the website and internal systems remained offline. APS says it has not yet been possible to determine the scope of the attack or whether data was accessed, that port operations continue without risk of stoppage, and that it adopted contingency measures, with reinforcement of the Port Guard and use of Porto Sem Papel. Cesportos raised the port protection level from I to II. The Federal Police in Santos said it had been informed, but without documentation or an open inquiry as of the report. ANPD stated that it is reviewing the documentation sent by APS.

## Why it matters

A port authority holds records of people, vehicles, companies, and cargo that control physical access to critical infrastructure. When the system goes down, access control becomes manual, and the regulatory question — which personal data was on the affected servers — depends on an inventory that must exist before the incident. The notification to ANPD has already been made without APS knowing whether data was accessed.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Unavailability of APS systems and website | APS note of 10/11 | High |
| Physical access control under contingency | Cesportos ordinance (level II) | Medium |
| Access or exfiltration of data | Not determined by APS | Undetermined |

## What to do this week

1. Map which physical access records (people, vehicles, credentials) are in own systems and which in third parties, and how to operate without them — owner: physical security and continuity.
2. Have the inventory of personal data by server or system, to respond to ANPD with scope and data subjects instead of "we still don't know" — owner: DPO / data governance.
3. Signal that it worked: in an exercise, the team identifies in less than a day which personal data was on a randomly chosen server.

Source note: the APS website is offline; the facts come from the official APS note reproduced by g1 on 10/11/2026.
