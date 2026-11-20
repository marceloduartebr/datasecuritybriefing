---
title: "European Commission confirms attack using an AI tool that halted HR systems for more than 10 days"
description: "Payroll and medical reimbursements were offline, and the Commission says it sees no evidence of a broad data breach, which is still under investigation."
pubDate: 2026-11-20T12:50:00-03:00
sourceName: "The Record"
sourceUrl: "https://therecord.media/european-commission-confirms-cyberattack-using-ai"
cover: "https://covers.duarte.top/covers/20261120-comissao-europeia-ataque-0813.jpg"
tipo: incidente
tags: ["ataque", "inteligencia-artificial", "setor-publico", "europa"]
pais: eu
---

**In one line:** "no evidence of a broad breach" is only worth as much as the data inventory that allows it to be verified.

## What happened
On November 19, 2026, the European Commission confirmed that it had been targeted, the previous month, by a cyber campaign involving a publicly available artificial intelligence tool. Spokesperson Thomas Regnier called the case an "AI-generated cyber campaign" and said the first signs were detected on October 22. The attack disrupted staff systems such as payroll, leave requests, medical reimbursements and translation services for more than 10 days. The Commission took services offline as a precaution, notified affected people, is checking other systems and is working with CERT-EU and the European Data Protection Supervisor (EDPS). According to Regnier, there is no evidence of a broad breach of staff data and no knowledge of a ransom demand; the investigation remains open. It is the third cyber incident disclosed by the Commission in 2026, after cases involving Ivanti in January and its cloud infrastructure in March.

## Why it matters
HR systems hold data that cannot be changed once exposed: bank details, health information tied to reimbursements, dependents. Attacks supported by AI tools shorten the time between initial access and data collection. In that scenario, the ability to state what was or was not accessed depends on knowing in advance where that data is and who reads it.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Automated intrusion with an AI tool | Confirmation by the European Commission | High |
| Unavailability of staff systems | More than 10 days without payroll, leave and reimbursements | High |
| Exposure of staff data | No evidence of a broad breach; investigation open | Medium |

## What to do this week
1. Map where HR data lives (payroll, health, dependents, bank details), including copies at suppliers — owner: HR with privacy/DPO.
2. Ensure access logs for those repositories with enough retention to reconstruct an incident spanning weeks — owner: security.
3. Sign that it worked: in an exercise, the team can say which records a compromised user could read.
