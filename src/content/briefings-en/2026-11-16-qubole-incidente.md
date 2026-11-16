---
title: "Trusted AWS account from Qubole becomes a door to customer secrets and data"
description: "An attacker assumed forgotten integration roles for 12 days and took secrets and entire S3 buckets."
pubDate: 2026-11-16T10:25:00-03:00
sourceName: "The Register"
sourceUrl: "https://www.theregister.com/security/2026/11/09/attackers-backdoor-trusted-aws-integrations-to-steal-secrets/5308553"
cover: "https://covers.duarte.top/covers/20261110-qubole-incidente.jpg"
tipo: incidente
pais: us
tags: ["terceiros", "aws", "segredos", "identidade-nao-humana", "s3"]
notionUrl: "https://www.notion.so/413174117473816ebb9bee60b47e34b6"
---

In one line: a trust relationship between accounts that no one deactivated gave the attacker the same reach the vendor had.

## What happened
According to an investigation published on 09/11/2026 by Wiz, with Mandiant, and reported by The Register, an actor used IAM credentials from an AWS account associated with Qubole between 14 and 26/10/2026 to assume the integration roles created by customers. All AssumeRole calls had External ID and succeeded; many roles were no longer in use, but the trust policy remained active. The actor enumerated resources, read secrets in Lambda environment variables, Secrets Manager and SSM Parameter Store, validated with TruffleHog AWS keys, Entra ID service principal secrets and Okta OAuth credentials, and downloaded data from S3, in some cases entire buckets. There was a separate campaign from 8 to 11/10 with customer integration keys. The number of affected organizations was not disclosed ("multiple"), there is no attribution, and Qubole and AWS did not respond to The Register.

## Why it matters
Third-party access outlives the actual use of the integration. When the vendor is compromised, the attacker's reach is the reach the role granted, including secrets that open other systems (Entra ID, Okta).

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Cross-account vendor role | Successful AssumeRole with External ID | High |
| Secrets in Lambda/SSM/Secrets Manager | Reading and validation of keys | High |
| S3 exfiltration | Download of entire buckets in some cases | High |

## What to do this week
1. Review CloudTrail since 01/10 for AssumeRole coming from account 805246085872 — owner: cloud security team.
2. Remove unused integration roles and rotate secrets reachable by them — owner: platform/IAM.
3. Signal it worked: inventory of third-party roles with owner, purpose and reachable data, with no orphan role.

> Investigation note: the source was not reread at this evaluation stage; the facts follow the DSB radar record.
