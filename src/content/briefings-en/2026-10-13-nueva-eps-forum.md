---
title: "Nueva EPS activates response after health records offer"
description: "The insurer did not confirm the leak of 11.2 million members, but already opened a protocol after the forum offer."
pubDate: 2026-10-13T10:17:00-03:00
sourceName: "El Colombiano"
sourceUrl: "https://www.elcolombiano.com/colombia/hackers-tienen-datos-de-112-millones-de-afiliados-de-nueva-eps-esto-es-lo-que-se-sabe-KG42009120"
cover: "https://covers.duarte.top/covers/20261008-nueva-eps-forum.jpg"
tipo: incidente
pais: co
tags: ["saude", "colombia", "vazamento", "incidente"]
notionUrl: "https://www.notion.so/3f3174117473815188fbc13c178bd780"
---

In one line: the forum number is not confirmed; the fact is the health insurer opening a response without, as of the note, finding unauthorized access.

## What happened

On 4 October 2026 a forum announcement offered what the author describes as 11,239,741 Nueva EPS member records, in 34 files. El Colombiano, in a 6 October piece, reported a sample with contact, ethnic identity, exams and habits, with fields compatible with the Health Promotion and Maintenance Route. Nueva EPS said it learned of a third party's claim, activated the response protocol and assembled a team of technology, cybersecurity and data protection. Until the statement, there was no evidence of unauthorized access. The company did not confirm exfiltration or the volume.

## Why it matters

Health data cannot be swapped. A leak site is not confirmation. The interval between the offer and technical evidence is what governance needs to measure.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Forum offer | Author claims 11,239,741 records; company does not confirm | Indeterminate |
| Health sample | Portal analyzed 30 lines; fields match sanitary route | Medium |
| Access to systems | Nueva EPS says checks found no unauthorized access | Indeterminate |

## What to do this week

1. Separate forum claim from access evidence — incident response.
2. Test whether the sample schema still exists in production — data and security.
3. Sign it worked: sample origin classified and data subjects not notified in the dark.
