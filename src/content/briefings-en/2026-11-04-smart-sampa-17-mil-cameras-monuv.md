---
title: "Smart Sampa: new cloud provider flaw exposes 17,000 contracted cameras in SP"
description: "Links to about 17,000 contracted cameras hosted on Monuv opened without login for roughly five days; City Hall cites a leaked confidential spreadsheet and opened an investigation."
pubDate: 2026-11-04T10:16:00-03:00
sourceName: "UOL"
sourceUrl: "https://noticias.uol.com.br/colunas/artur-rodrigues/2026/11/03/nova-falha-no-smart-sampa-permite-acesso-a-17-mil-cameras-conveniadas.htm"
cover: "https://covers.duarte.top/covers/20261104-smart-sampa-17-mil-cameras-monuv.jpg"
tipo: incidente
tags: ["vazamento", "vigilancia", "brasil", "terceiros", "nuvem", "governanca"]
pais: br
notionUrl: "https://www.notion.so/40d1741174738166b948c1c12d65d381"
---

In one line: Two weeks after the 58,000-camera case, links to 17,000 contracted Smart Sampa cameras became accessible without login on the Monuv provider.

## What happened

On November 3, 2026, UOL reported that about 17,000 cameras contracted to Smart Sampa, hosted on the Monuv cloud provider, could be accessed without authentication for approximately five days, including streets of authorities such as Alexandre de Moraes, Michel Temer and FHC. Folha independently confirmed by opening streams. The Municipal Secretariat of Urban Security (SMSU) confirmed the list of links is genuine, stated that a confidential spreadsheet was leaked, and opened an investigation. The reporting maintains that the links opened without login. The case is distinct from the October 20 episode (credentials in a public repository, 58,000 cameras).

Additional sources: Folha, O Globo, Veja SP.

## Why it matters

Both versions converge on the central point: access to the cameras depended on the link remaining secret. Leaked spreadsheet or open link, a URL without authentication at the cloud provider is non-existent access control. Two incidents in two weeks indicate a third-party governance failure, not an isolated error.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Unauthenticated access | Links opened without login for ~5 days (UOL, Folha) | High |
| Exposure of sensitive locations | Streets of authorities viewed | High |
| Third-party (cloud) risk | Cameras hosted on Monuv | High |
| Inventory leak | City Hall confirms confidential spreadsheet leaked | Medium |

## What to do this week

1. Inventory systems hosted at third parties that grant access via direct URL or token-in-link — owner: Security / IT.
2. Require cloud providers to enforce mandatory authentication and expiration of streaming links — owner: Third-Party Management.
3. Check whether spreadsheets with access links or credentials circulate outside a vault — signal: files with access URLs in shared folders.