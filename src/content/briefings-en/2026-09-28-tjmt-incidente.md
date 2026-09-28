---
title: "TJMT: attack takes down the PJe and exposes user credentials"
description: "An unauthorized document template insertion opened the gap; encrypted logins and passwords were accessed and procedural deadlines were suspended from September 23 to 25."
pubDate: 2026-09-28T10:14:00-03:00
sourceName: "Convergência Digital"
sourceUrl: "https://convergenciadigital.com.br/seguranca/no-tribunal-do-mato-grosso-hackers-usam-brecha-para-acessar-logins-e-senhas-criptografadas-dos-usuarios/"
cover: "https://covers.duarte.top/covers/20260925-tjmt-incidente.jpg"
tipo: incidente
tags: ["incidente", "credenciais", "poder judiciario", "brasil", "continuidade"]
notionUrl: "https://www.notion.so/3e6174117473810a9f3cd611b0384003"
---

**In one line:** an unauthorized document template inserted on Sunday opened the gap that took down the Mato Grosso Court of Justice systems and exposed encrypted user logins and passwords.

## What happened

According to the TJMT Information Technology Coordination (CTI), the unauthorized insertion of a document template into the system on Sunday afternoon (20/09/2026) opened a gap in the structure. Attackers exploited that flaw, accessed the network and took services down on Monday (21). The Court took the main institutional systems offline, including the Electronic Judicial Process (PJe).

In a note published on Wednesday (23), the TJMT confirmed that encrypted user logins and passwords were accessed. So far, the Court states, there is no evidence of access to other personal data of staff and judges, to judicial decisions or to the backups. All passwords are being reset and sensitive access has been restricted, with support from specialized partners.

TJMT/PRES Ordinance of 22/9/2026 suspended office hours on the 23rd for testing and validation and kept only internal office hours on the 24th and 25th, with public service under on-call arrangements. Procedural deadlines are suspended from September 23 to 25, hearings and sessions will be rescheduled, and filing and case consultation remain unavailable. Criminal enforcement continues normally through SEEU, which was not affected. Systems will return gradually after testing.

## Why it matters

By the Court’s own account, the entry point was content inserted without authorization into the system. Document templates, macros and models often fall outside change management — and that is exactly why they become entry points.

The second point is the credential. An accessed encrypted password is still an exposed credential: the risk depends on the algorithm, the salt and how quickly resets happen. For a court, downtime has a direct cost on deadlines, hearings and access to justice, which makes continuity as important as confidentiality.

## Risk reading

| Dimension | Assessment |
|---|---|
| Initial vector | Unauthorized document template insertion into the system (Sunday, 20/09) |
| Exposed data | Encrypted network user logins and passwords |
| Personal data, decisions and backups | No evidence of access so far, according to the TJMT |
| Operational impact | High: PJe and systems offline, deadlines suspended 23–25/09 |
| Containment | Reset of all passwords and restriction of sensitive access |
| Residual risk | Medium: credential reuse and gradual return still under test |

## What to do this week

1. Put document templates, macros and models under change management: defined owner, review before production and a record of who inserted what and when.
2. Review password storage (algorithm and salt), require MFA for network access and set alerts for out-of-pattern logins after any mass reset.
3. Signal that it worked: a template insertion outside business hours or without approval triggers an alert the same day, and you can list which critical services keep running if the main network goes down.
