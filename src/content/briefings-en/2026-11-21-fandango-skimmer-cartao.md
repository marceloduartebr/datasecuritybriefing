---
title: "Fandango confirms checkout skimmer that captured card data"
description: "The code was active for four days; working out who was affected took weeks."
pubDate: 2026-11-21T08:50:00-03:00
sourceName: "BleepingComputer"
sourceUrl: "https://www.bleepingcomputer.com/news/security/fandango-says-hackers-stole-payment-card-details-from-checkout-pages/"
cover: "https://covers.duarte.top/covers/20261119-fandango-skimmer-cartao-0803.jpg"
tipo: incidente
tags: ["skimming", "cartao-de-credito", "ecommerce", "estados-unidos"]
pais: us
---

**In one line:** in skimming attacks, detection time matters less than the time it takes to link the attack window to each affected customer.

## What happened
Fandango Media has begun notifying customers that skimming code injected into the checkout page of its official website intercepted payment data between October 8 and 11, 2026. The notice, reported by BleepingComputer on November 16, lists card number, CVV, expiration date, billing ZIP code and email address. The company says names, identity documents and Social Security numbers were not exposed. Fandango concluded on October 30 that customer data might have been affected, fixed the page with help from outside experts, has not disclosed the number of people affected and is offering two years of credit and identity monitoring.

## Why it matters
Complete card data, including the CVV, enables immediate fraud in online purchases. The gap between the attack window and the notice shows the bottleneck was pinning down who was exposed.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Code injected into checkout | Fandango notice | High |
| Card exposure with CVV | Data list in the notice | High |
| Number affected not disclosed | No answer from the company | Medium |

## What to do this week
1. Inventory every script loaded on payment pages and monitor changes — owner: application security.
2. Make sure the transactions and customers that went through checkout can be listed by time window — owner: payments engineering.
3. Sign that it worked: a change to a payment script raises an alert the same day and the list of customers in the window comes out within hours.
