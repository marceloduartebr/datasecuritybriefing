---
title: "Denmark CPR: 8.8 million via a third party's access"
description: "Third parties abused a company's legitimate lookup on the civil register and reached name, address and ID number for 8.8 million people."
pubDate: 2026-10-08T10:17:00-03:00
sourceName: "Ministério da Digitalização da Dinamarca"
sourceUrl: "https://via.ritzau.dk/pressemeddelelse/15205753/omfattende-uautoriseret-adgang-til-borgeres-cpr-oplysninger"
cover: "https://covers.duarte.top/covers/20261007-cpr-dinamarca-terceiro.jpg"
tipo: incidente
pais: eu
tags: ["gdpr", "terceiro", "registro-civil", "europa"]
notionUrl: "https://www.notion.so/3f2174117473812aa9a6e1807024e69a"
---

In one line: a third party's legitimate access, with no volume alarm, exposed the identification number of 8.8 million people.

## What happened

On 5 October 2026, the administration of Det Centrale Personregister reported unauthorized access to name, address and CPR number for about 8.8 million registered people (living, emigrated and deceased). The abuse used the legal access of a Danish company. The administration cut that access, notified Datatilsynet and the police are investigating. Name-and-address protection was outside this cut. Anomalous September behaviour was noticed on the night of 2 October. On 6 October, the ministry attributed the discovery to an abnormally high invoice and said there was no automatic alarm for that kind of query. The company was not named.

## Why it matters

A live contract is not evidence of use. A national identifier cannot be changed, and a volume trail per credential is what separates operational lookup from extraction.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Third party with legal access | Query abused; access cut | High |
| National identifier | About 8.8 million CPR numbers | High |
| Detection | High invoice; no automatic alarm for the method used | High |

## What to do this week

1. The third-party owner lists credentials that can query a national identifier.
2. Security checks for a volume alert outside the pattern, not only contract expiry.
3. Signal: a third party with a query spike opens a ticket before the invoice.
