---
title: "Ransomware at ICN: encrypted systems are not the same as stolen data"
description: "The state-linked yard that builds the Navy’s submarines had email, files and databases encrypted on 9 August. More than two weeks later the public still does not know whether there was exfiltration."
pubDate: 2026-08-29T16:47:00-03:00
sourceName: "Jornal Atual"
sourceUrl: "https://jornalatual.com.br/ataque-cibernetico-icn"
cover: "https://covers.duarte.top/covers/20260829-icn-ransomware.jpg"
tags: ["vazamento", "ransomware", "brasil", "infraestrutura-critica"]
notionUrl: "https://www.notion.so/3c81741174738152a21be80d0628ec3d"
---

In one line: ICN confirmed encrypted systems; it did not confirm that any data left.

## What happened

In the early hours of 9 August 2026, Itaguaí Construções Navais — the joint venture of the Submarine Development Programme (Prosub), in partnership with Naval Group — had email servers, internal systems, file storage and databases encrypted. The institutional site went offline.

Days later the LockBit group claimed authorship on a leak site. By the publication of this briefing, ICN had not publicly confirmed exfiltration nor impact on the schedule of the conventional submarines or the nuclear submarine. The company said it had mobilised IT and specialist firms to investigate and restore systems.

A leak-site claim is not a victim confirmation.

## Why it matters

Encrypting a file blocks access. Exfiltrating a file means the copy is already outside your control, ransom paid or not. The press and, often, the company itself treat the two as synonyms.

In defence, energy and infrastructure the pattern repeats: relatively strong physical and network control; little visibility over where the sensitive data sat *inside* the systems that ended up encrypted. Without that map, “there is no evidence of exfiltration” is hope, not a finding.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Availability (encrypted systems) | Confirmed by the company / coverage | High |
| Exfiltration | Only a leak-site claim | Undetermined |
| Impact on Prosub | Not confirmed | Undetermined |

## What to do this week

1. Split in the playbook the questions “are the systems back?” and “what lived there and did anything leave?” — owner: SecOps + data owner.
2. Demand inventory evidence (system, data type, volume) *before* signing a “no evidence of a leak” statement — owner: DPO / legal.
3. Signal it worked: within hours, list the repositories hit and the data they held.
