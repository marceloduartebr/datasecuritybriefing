---
title: "National Treasury confirms unauthorized access to 30 thousand records and 4 thousand Pix keys"
description: "Access detected on November 4 exposed names, CPFs and emails from e-Serviços and Pix keys of federal payment beneficiaries; announced on 12/11, no financial impact."
pubDate: 2026-11-13T10:18:00-03:00
sourceName: "Agência Brasil"
sourceUrl: "https://agenciabrasil.ebc.com.br/geral/noticia/2026-11/tesouro-nacional-identifica-vazamento-de-dados-de-30-mil-cadastros"
cover: "https://covers.duarte.top/covers/20261113-tesouro-nacional-incidente.jpg"
tipo: incidente
tags: ["vazamento", "governo", "pix", "lgpd", "brasil"]
pais: br
notionUrl: "https://www.notion.so/41717411747381989141d24de162b050"
---

In one line: The National Treasury detected unauthorized access to 30 thousand records and 4 thousand Pix keys of federal payment beneficiaries and only publicly announced it eight days later.

## What happened

On November 4, 2026, the National Treasury Secretariat identified unauthorized access to personal data in its technological environment. The case was publicly announced on the night of November 12. Names, CPFs and email addresses of approximately 30 thousand users of the e-Serviços portal were accessed. An internal analytical query base was also reached, exposing about 4 thousand Pix keys of federal government payment beneficiaries and data related to the transactions. The agency notified ANPD and CTIR Gov. There was no financial impact and no structuring system was compromised. Containment occurred via monitoring mechanisms; technical investigation into origin and extent is ongoing.

## Why it matters

The interval between detection and public communication shows the time needed to confirm the fact, contain it and begin inventorying what left. Notifying the data subject and the authority with precision requires a record-by-record map: which identities, from which bases, with what overlap. A Pix key of a federal payment beneficiary is not a generic registration data point — it links the person to a transfer already made. Without that inventory, the response stays at the policy level and does not reach the evidence of who needs to be alerted.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Access to registration base (e-Serviços) | ~30 thousand names, CPFs and emails | High |
| Access to analytical base with Pix keys | ~4 thousand keys and federal payment data | High |
| Public communication time | 8 days after detection | Medium |
| Financial impact / structuring systems | Denied by the agency | Undetermined |

## What to do this week

1. Confirm whether the personal data and payment key inventory covers the service portal bases and internal analytical query bases — DPO / data team.
2. Test the time between detection of anomalous access and the list of reached identities — SOC / incident response.
3. Validate whether the ANPD and data subject notification process has the record-by-record map ready in less than 48 hours — Governance.
