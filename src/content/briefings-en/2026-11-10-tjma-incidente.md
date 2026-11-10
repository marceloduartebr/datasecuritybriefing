---
title: "TJMA confirms personal and bank data of servers and former servers left the environment"
description: "The court took 25 days to communicate the incident and still does not say how many people were affected, with records since 2010 in the same environment."
pubDate: 2026-11-10T10:18:00-03:00
sourceName: "Tribunal de Justiça do Maranhão (TJMA)"
sourceUrl: "https://www.tjma.jus.br/midia/tj/noticia/523759/comunicado-de-incidente-de-seguranca"
cover: "https://covers.duarte.top/covers/20261110-tjma-incidente.jpg"
tipo: incidente
pais: br
tags: ["vazamento", "setor-publico", "lgpd", "retencao", "brasil"]
notionUrl: "https://www.notion.so/41317411747381948299cda0ef2a88eb"
---

In one line: when bank data, affiliation and access credentials of former servers from 2010 are in the same environment as active systems, the incident becomes a retention problem, not just a perimeter one.

## What happened
In a statement of 07/11/2026, the TJMA reported that it identified on 13/10/2026 a cyber incident in the environment of the SISRH, SCO, E-POP and E-SIG systems, with external transfer of files containing databases. According to the court, data of servers and former servers (records since 2010) were affected: name, registration, CPF and identity, date of birth, address, telephone, email, affiliation, PIS/PASEP, bank and functional information and access and authentication information. The TJMA says the investigation did not confirm sensitive data, isolated the server, preserved evidence, notified the police and the company responsible for the systems and is notifying the data subjects. It did not report the number of affected persons or the author. A post on a leak site attributes the case to Rhysida, but links it to a court in Minas Gerais; there is no confirmation.

## Why it matters
The set of fields enables bank fraud, account opening and targeted phishing against servers. The presence of access credentials increases the risk for other systems if there is password reuse. And the historical depth (2010) indicates old bases without disposal or segregation.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Exfiltration of HR bases | TJMA statement | High |
| Leaked access credentials | TJMA statement | High |
| Retention of former servers since 2010 | TJMA statement | Medium |
| Attribution to Rhysida | Leak site, not confirmed | Undefined |

## What to do this week
1. Map where bank and identification data of former employees are and what the legal basis is for keeping them — DPO and HR.
2. Force credential rotation on HR systems and check reuse on other services — IT/IAM.
3. Signal that it worked: being able to answer, per system, how many data subjects and which fields are exposed in case of incident.

Investigation note: source not re-read at this stage; facts according to DSB radar record on 09/11/2026.