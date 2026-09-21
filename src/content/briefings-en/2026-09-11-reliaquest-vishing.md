---
title: "ReliaQuest contains ShinyHunters vishing with device-trust controls"
description: "Phone social engineering opened one employee’s identity panel — and stopped there, thanks to device trust."
pubDate: 2026-09-11T10:36:00-03:00
sourceName: "The Register"
sourceUrl: "https://www.theregister.com/cyber-crime/2026/08/24/shinyhunters-and-reliaquest-trade-blows-over-claimed-breach/529170"
cover: "https://covers.duarte.top/covers/20260830-reliaquest-vishing.jpg"
tipo: incidente
tags: ["vishing", "identidade", "mfa", "shinyhunters", "device-trust"]
notionUrl: "https://www.notion.so/3c71741174738130aa29eb888ea2d403"
---

In one line: Phone social engineering opened one employee’s identity panel — and stopped there, thanks to device-trust controls.

## What happened

On 22 August 2026 the extortion group ShinyHunters registered domains similar to ReliaQuest’s name, stood up a fake SSO login page and called staff posing as the internal security team. One employee typed the password and approved the MFA prompt. For a few minutes the attacker obtained read-only access to that identity’s Okta panel. No company system or application was reached and no customer data was touched: device-trust controls blocked any further move, the session was ended and the credentials were rotated. Even so, ShinyHunters listed ReliaQuest as a victim on its leak site — which the company publicly disputes.

## Why it matters

The critical difference is not the attack itself. Phone social engineering remains one of the simplest and most effective tactics, including against people who work in security every day. The difference is between “an employee fell for the scam” and “the company was compromised”. Those two things are almost never the same, but they become a headline as if they were.

Measuring security maturity by the number of authentication layers — and not by clarity about what each layer actually protects — remains a common error. An approved MFA should not mean unrestricted access; it should mean access to exactly what that identity needs, nothing more.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Vishing + fake SSO page | Confirmed by ReliaQuest and The Register coverage | High (entry vector) |
| Access to the Okta panel (read-only) | Confirmed; minutes long | Medium |
| Lateral movement / customer data | Blocked by device trust; no data touched | Contained |
| Leak-site listing | Published by the group; disputed by the victim | Undetermined (reputational) |

## What to do this week

1. Review whether approved MFA grants only the minimum that identity needs — owner: identity/IAM.
2. Test whether device-trust / conditional-access controls really stop progress from a compromised session — owner: endpoint security + IAM.
3. Train the team to treat a call “from our own SOC” as suspect until confirmed on a second channel — owner: awareness.
4. Signal it worked: a similar incident ends on the same screen, with no access to systems or data.
