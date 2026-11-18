---
title: "Optimizely script serves malware to visitors of 178 organizations in a single day"
description: "Code injected into Optimizely Web projects captured cards and swapped crypto wallets on Zoom, HSBC and IKEA sites; no one yet knows how the attacker got access."
pubDate: 2026-11-17T21:44:00-03:00
sourceName: "Report URI"
sourceUrl: "https://blog.report-uri.com/worlds-largest-brands-infected-with-malware-via-optimizely/"
cover: "https://covers.duarte.top/covers/stg-20261117-optimizely-injecao-de-codigo-2034.jpg"
tipo: incidente
tags: ["supply-chain", "javascript", "skimming", "terceiros", "estados-unidos"]
pais: us
---

**In one line:** a third-party script runs with access to everything the customer types, and it is almost never in the data inventory.

## What happened
On November 16, 2026, malicious code was served to visitors of 178 organizations (188 infected snippets) through Optimizely Web, according to Report URI. The attacker wrote code into the "Project JavaScript" of customer projects; Optimizely's CDN delivered the content it received, with no cache poisoning. The first injection was observed at 04:21 UTC; a card skimmer was added at 13:43 UTC; cleanup of all files was completed at 23:11 UTC. The code swapped crypto wallet addresses, captured card number, expiry date and CVV from the sites' own forms, sent non-HttpOnly cookies and screenshots to an attacker server, and redirected iPhones on old iOS versions to the Coruna and DarkSword kits. Brands on the list include Zoom, BBC, CNN, Salesforce, IKEA, Equifax, Air France-KLM and HSBC (including its Mexico site), plus Betsson domains in Argentina and Colombia. The attacker's wallets received about US$ 7,000. Report URI says it does not know how the attacker obtained write access to unrelated customer projects; Optimizely acknowledged the incident on its status page.

## Why it matters
Payment and sign-up forms are where personal data is born. A third-party script loaded on that page has the same reach as the company's own code, can change at any moment and escapes the controls applied to databases and SaaS applications.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Injection into a third-party script (Optimizely Web projectJS) | Timeline and list of 178 organizations published by Report URI | Critical |
| Card and cookie capture in the browser | Payload analyzed by Report URI | High |
| Exploitation of outdated iOS | Coruna and DarkSword kits identified in the payload | High |
| Access vector into the vendor | Unknown | Undetermined |

## What to do this week
1. List every third-party script loaded on login, sign-up and payment pages, and who can change each one — owner: web engineering with application security.
2. Turn on Content Security Policy, at least in report-only mode, on those pages and monitor changes to code served by third parties — owner: application security.
3. Sign that it worked: an unexpected change to a third-party script triggers an alert in minutes, not hours.
