---
title: "Optimizely confirms malicious JavaScript injection into Web Experimentation customer projects"
description: "A flaw in the sign-up flow let attackers insert a card skimmer and a crypto wallet swapper into the sites of 178 organizations for about 16 hours."
pubDate: 2026-11-19T17:10:00-03:00
sourceName: "Optimizely"
sourceUrl: "https://status.optimizely.com/incidents/ftw0fh9wx43z"
cover: "https://covers.duarte.top/covers/20261119-optimizely-injecao-javascript-1035.jpg"
tipo: incidente
pais: global
tags: ["cadeia-de-suprimentos", "skimmer", "pagamentos", "javascript"]
---

**In one line:** the marketing tag had permission to write code on the payment page, and that is how the attack got in.

## What happened
Optimizely confirmed on its status page that, on 11/16, an unauthorized third party exploited a flaw in the Web Experimentation sign-up flow to impersonate users in targeted accounts and insert malicious JavaScript into customer projects. The company says it detected the activity the same day, closed the flaw within three hours, removed the code from all projects and that no credentials were leaked. The impact was limited to fewer than 5% of customers, only in Web Experimentation. According to the analysis by Scott Helme (Report URI), detailed by StepSecurity on 11/17, the code appeared in 188 of 1,611 snippets checked, tied to 178 organizations; banks and financial firms were the largest group (32). The payload swapped crypto wallet addresses, captured card numbers in checkout forms and sent out screenshots and cookies. On most sites, the exposure lasted about 16 hours.

## Why it matters
The malicious code was served by the vendor's legitimate CDN, with its certificate, inside a snippet the customer company had already approved. None of the victim company's perimeter controls saw anything different.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Flaw in the vendor's sign-up flow allowed writing to customer projects | Optimizely status page | High |
| Card skimmer in checkout forms | Report URI and StepSecurity analysis | High |
| Third-party tag with access to what the customer types | 178 organizations, 32 in the financial sector | High |

## What to do this week
1. Review the Project JavaScript field of every Optimizely Web project and the logs since 11/16 — web and security team.
2. Remove third-party tags from checkout pages and use payment fields hosted by the provider in an iframe — e-commerce owner.
3. Sign that it worked: the list of scripts running on checkout fits on one page and each one has an owner.
