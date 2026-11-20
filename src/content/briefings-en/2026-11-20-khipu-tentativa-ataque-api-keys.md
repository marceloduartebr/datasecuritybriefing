---
title: "Khipu confirms an attack attempt and asks merchants to renew possibly exposed API keys"
description: "The Chilean fintech said it detected and contained an attempted cyberattack on November 16, with no leak of personal data, and asked merchants to renew API keys that may have been exposed."
pubDate: 2026-11-20T17:10:00-03:00
sourceName: "La Tercera"
sourceUrl: "https://www.latercera.com/pulso/noticia/fintech-khipu-reporta-ciberataque-y-pide-a-comercios-cambiar-claves/"
cover: "https://covers.duarte.top/covers/20261120-khipu-tentativa-ataque-api-keys-0813.jpg"
tipo: incidente
tags: ["ciberseguranca", "pagamentos", "chile", "cadeiadesuprimentos", "apikeys"]
pais: cl
---

In one line: Khipu said it contained an attempted cyberattack on November 16, reported the case to ANCI, stated that no personal data was leaked and asked merchants to renew API keys that may have been exposed.

## What happened

On November 18, 2026 La Tercera published the content of a statement from Chilean instant-payments fintech Khipu. The company said that on Monday (November 16) it detected and contained an attempted cyberattack against its services. As a precaution, it asked merchants whose API keys may have been exposed to renew them within a deadline.

According to the statement, the episode caused no financial loss and no leak of personal data or information. Khipu said it immediately reported the incident to the National Cybersecurity Agency (ANCI) and remains in contact with the authority. The company explained that it did not immediately rotate all merchant API keys because those keys can only be used to create payment requests for legitimately enabled merchants, and said the attacker's effort did not achieve its goals.

The company said it rotated “all of our secrets” (internal credentials) and replaced about 150 services the operation depends on, without going offline “for even a minute”. It did not say how many merchants were notified, what deadline was given or how the attacker obtained initial access. It also said the attacker failed in the attempt to obtain money.

## Why it matters

A merchant API key is not customer registration data, but it is an operational shortcut: it can create charges within the perimeter of already enabled merchants. Khipu describes containment, internal rotation and no leak of personal data, and still asks for the renewal of keys that may have been exposed. Without the number of merchants notified, the scope of that exposure remains internal.

## Risk reading

| Vector | Public evidence | Severity |
| --- | --- | --- |
| Attack attempt detected and contained on 11/16 | Khipu statement, reported by La Tercera | High |
| Merchant API keys possibly exposed | Official renewal request, deadline not disclosed | High |
| Personal data leak and financial loss | Company says it did not happen | Medium |
| Rotation of internal secrets and about 150 services | Khipu statement | Medium |
| Report to ANCI | Khipu statement | Medium |

## What to do this week

1. Treasury and payments: check whether the company or any merchant in the group uses Khipu and, if so, rotate the API keys and review payment requests created since November 16. Owner: payments / treasury.
2. Security and third parties: record the incident in the payment vendor inventory and ask for evidence of the scope (which keys, what deadline, what initial access). Owner: information security / third-party management.
3. Fraud monitoring: watch for unusual charges in the name of enabled merchants until key rotation is complete. Owner: anti-fraud / operations.
