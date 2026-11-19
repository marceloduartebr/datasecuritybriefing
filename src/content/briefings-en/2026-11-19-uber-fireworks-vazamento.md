---
title: "Uber notifies 149,000 drivers: the alert in place did not see the AI vendor's legitimate credential"
description: "Driver's license data left through the Fireworks AI breach, and Uber's alerts did not fire because the access used the vendor's own credentials."
pubDate: 2026-11-19T08:33:00-03:00
sourceName: "TechCrunch"
sourceUrl: "https://techcrunch.com/2026/11/16/uber-confirms-hackers-stole-thousands-of-drivers-license-information-in-data-breach/"
cover: "https://covers.duarte.top/covers/20261118-uber-fireworks-vazamento-1645.jpg"
tipo: incidente
pais: us
tags: ["vazamento", "terceiros", "inteligencia-artificial", "estados-unidos"]
---

**In one line:** the weak link was neither Uber nor its monitoring: it was the volume of personal data sitting with an AI inference provider.

## What happened
Uber is notifying 149,346 people, according to a filing with the Oregon attorney general, about the theft of names, addresses, dates of birth and driver's license numbers in the breach of Fireworks AI, an AI model inference provider. According to TechCrunch (story published on 13/11 and updated on 16/11), Fireworks told Uber on 9/10 that attackers stole internal credentials used to access the data. A filing in Iowa mentions images of the licenses and the text extracted from them. Notifications were also filed in California, Illinois, Massachusetts, Rhode Island, South Carolina, Texas and Vermont. Uber said it had alerts for unauthorized access to the Fireworks environment, but none fired, because the access used the vendor's internal credentials. Notion and Cursor confirmed data taken in the same attack.

## Why it matters
The case continues the Fireworks incident already reported by Notion. Now with another kind of data: an identity document, which cannot be changed like a password. And with an operational detail: the monitoring existed and did not help, because the session looked legitimate.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Vendor's internal credentials stolen | Fireworks told Uber on 9/10 | High |
| Identity data at an inference provider | Images and numbers of driver's licenses | High |
| Monitoring blind to access with a valid credential | "No alert fired", according to Uber | Medium |

## What to do this week
1. List which AI vendors receive personal data, of what kind and with what retention — DPO and data architecture.
2. Remove from AI flows the fields not needed for the use case (documents, ID numbers) — product owner and engineering.
3. Sign it worked: for each AI vendor, the company answers within minutes which personal records are there today.
