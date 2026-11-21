---
title: "Renfe widens the scope of the September attack: DNI, passwords and travel history"
description: "Almost two months after saying the attack mainly hit names and emails, Renfe warns customers that DNI/NIE numbers, passwords and travel data may have been stolen."
pubDate: 2026-11-21T08:50:00-03:00
sourceName: "elDiario.es"
sourceUrl: "https://www.eldiario.es/tecnologia/renfe-urge-clientes-cambiar-contrasenas-ciberataque-pudo-robar-dnis-e-historial-viajes_1_13680581.html"
cover: "https://covers.duarte.top/covers/20261121-renfe-vazamento-dni-senhas-0810.jpg"
tipo: incidente
tags: ["renfe", "espanha", "vazamento", "senhas", "terceiros"]
pais: eu
---

In one line: the first notice spoke of names and emails; the second, almost two months later, includes identity documents, passwords and journeys.

## What happened

According to elDiario.es, Spanish rail operator Renfe emailed customers affected by the September 24 cyberattack on November 20, 2026. The company says DNI or NIE numbers, login passwords and information on tickets bought and trips taken may have been stolen, and asks customers to change their password as soon as possible, including on other services where the same password is used.

On September 25, Renfe had acknowledged the intrusion and said the access appeared to affect limited user information, mainly names and email addresses, with no evidence of access to DNI numbers. Now the company says passwords were protected with cryptographic techniques but admits that weak passwords can be cracked by brute force. Renfe attributes the origin of the attack to previously compromised Adif servers that were interconnected with its systems, says the alleged perpetrator was arrested by the Guardia Civil in October, and that it notified the Spanish Data Protection Agency. The company declined to tell elDiario.es the total number of affected customers.

## Why it matters

The case shows the gap between containing an attack and knowing what it reached. Travel history, as Renfe itself acknowledges, makes it possible to infer movements and behavior profiles. And the entry point was an interconnected environment belonging to another organization, Adif.

## Risk reading

| Vector | Public evidence | Severity |
| --- | --- | --- |
| Interconnection with a compromised third-party environment | Origin attributed to Adif servers linked to Renfe systems | High |
| Scope underestimated in the first notice | September: names and emails; November: DNI/NIE, passwords and trips | High |
| Password reuse | Renfe asks for changes on other services too | Medium |

## What to do this week

1. Inventory where the company stores customer identity documents, passwords and usage histories, by system (owner: Data Governance).
2. Review connections to partner and third-party systems and the data reachable through them (owner: Information Security).
3. Define in the incident response plan a process to confirm scope by data category before the first external notice (owner: DPO and Legal).
