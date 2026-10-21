---
title: "Smart Sampa: credentials exposed for 11 months gave access to 58 thousand cameras in SP"
description: "Public repository with Smart Sampa logins and passwords allowed improper access to more than 58 thousand cameras, including schools and hospitals, for about 11 months."
pubDate: 2026-10-21T10:17:00-03:00
sourceName: "Canaltech"
sourceUrl: "https://canaltech.com.br/mercado/falha-no-smart-sampa-expos-acesso-a-58-mil-cameras-de-sp-por-quase-um-ano/"
cover: "https://covers.duarte.top/covers/20261020-smart-sampa-cameras.jpg"
tipo: incidente
tags: ["vazamento", "vigilancia", "brasil", "credenciais", "governanca"]
pais: br
notionUrl: "https://www.notion.so/3ff17411747381ea9422efcda2753045"
---

In one line: Credentials of public surveillance system remained exposed for 11 months and allowed access to 58 thousand cameras in São Paulo.

## What happened

On October 20, 2026 UOL reported that confidential data of Smart Sampa (São Paulo City Hall) was in a public repository for about 11 months. It included 181 logins/passwords, data of more than 6 thousand agents and access instructions. The report accessed live images from more than 58 thousand cameras in streets, schools, daycare centers, hospitals and UPAs. The City Hall attributed it to a removed GCM server, denied systemic failure, removed the repository and adopted 2FA. The SP Public Prosecutor's Office opened an investigation. Operation contract of R$ 588 million with Consórcio Smart City SP / Sentinelx.

## Why it matters

Leaked credential of a public monitoring system is evidence of absence of inventory and real-time access control. Policy and contract do not replace visibility over who can still enter cameras of sensitive locations. Subsequent 2FA does not cover the exposure period nor the risks of insertion of false data in facial recognition pointed out by specialists.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Credential exposure | Public repository for ~11 months with 181 logins | High |
| Access to sensitive cameras | Schools, daycare centers, hospitals, UPAs viewed | High |
| Absence of 2FA | Access tested without two-factor authentication | Medium |
| Risk of false data | Interfaces with possible insertion of facial recognition records | Undetermined |

## What to do this week

1. Map all repositories, folders and tickets with credentials of monitoring systems or privileged access — owner: Security / IT.
2. Audit active third-party accounts and servers with access to cameras or surveillance platforms — owner: Access Control.
3. Confirm that critical systems have credential inventory with periodic review under 90 days and exposure alert — signal: report of unused accounts or with old password.
