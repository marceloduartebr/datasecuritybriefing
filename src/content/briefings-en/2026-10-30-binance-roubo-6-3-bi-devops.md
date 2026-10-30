---
title: "Binance: US$ 6.3 billion stolen starting from a DevOps laptop"
description: "The largest crypto theft on record began with a compromised engineering endpoint that reached a withdrawal service container."
pubDate: 2026-10-30T13:27:00-03:00
sourceName: "Binance / BleepingComputer"
sourceUrl: "https://www.binance.com/en/support/announcement/detail/c5a8729a97ac486d963784d96c5642d7"
cover: "https://covers.duarte.top/covers/20261030-binance-roubo-6-3-bi-devops.jpg"
tipo: incidente
pais: global
tags: ["binance", "cripto", "devops", "endpoint", "coreia-do-norte"]
notionUrl: "https://www.notion.so/40917411747381cba74fea4c1cf09fd0"
---

In one line: an engineer's laptop became access to a container able to submit withdrawals — and US$ 6.3 billion left in about 20 minutes.

## What happened

On 29 October 2026 an attacker moved about US$ 6.3 billion out of Binance (TRM Labs estimates US$ 6.36 billion across ten blockchains, most of it in ~20 minutes starting at 20:05 UTC). It is the largest crypto theft ever recorded, roughly four times Bybit's (US$ 1.5 billion, Feb 2025). According to Binance, the initial investigation points to the compromised laptop of a DevOps engineer, which gave access to a service container used to submit unauthorized withdrawals; "additional intrusion points" were found afterwards. The company says there is no evidence that wallet private keys were leaked.

About US$ 3 billion was frozen on-chain (Tether ~US$ 971 million, Circle ~US$ 823 million). Withdrawals are suspended, expected to resume in ~45 hours; deposits are normal. Binance will cover all losses with the SAFU fund and its own resources and promises a post-mortem and updated Proof of Reserves. Co-CEO Richard Teng said it was not "a one-click action" and that no one is being blamed individually. The attribution to the North Korean group TraderTraitor (Lazarus/APT38) comes from TRM Labs, with high confidence — not from Binance.

## Why it matters

No key was leaked: the attacker used the withdrawal infrastructure itself. The weak link was the endpoint of someone who administers production. In any fintech, bank or instant-payment system, the same path — engineering laptop → service credential → internal money-movement API — exists and rarely has value limits or dual approval.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Compromised DevOps endpoint | Binance announcement | High |
| Service container with withdrawal power | Unauthorized withdrawals submitted via service | High |
| Attribution to North Korea | TRM Labs (third party), not the victim | Undetermined |

## What to do this week

1. Map which internal services can move money and which laptops reach those services — security + platform.
2. Require value limits, velocity limits and out-of-band approval on money-movement APIs — product + risk.
3. Review EDR, privileged access and engineering sessions into production — SOC.
