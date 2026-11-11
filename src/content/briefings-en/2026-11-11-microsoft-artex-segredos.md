---
title: "Microsoft: attackers use agentic framework to find secrets on GitHub and exfiltrate data from Azure Key Vault"
description: "In one case, the chain from exposed credential to exfiltration took five minutes, too fast for any human reaction."
pubDate: 2026-11-11T10:22:00-03:00
sourceName: "Microsoft Threat Intelligence"
sourceUrl: "https://www.microsoft.com/en-us/security/blog/2026/11/05/threat-actors-use-agentic-ai-tooling-to-find-and-abuse-exposed-secrets/"
cover: "https://covers.duarte.top/covers/20261109-microsoft-artex-segredos.jpg"
tipo: noticia
pais: us
tags: ["identidade-nao-humana", "ia", "segredos", "nuvem"]
notionUrl: "https://www.notion.so/411174117473819992b1ca5da2b06a8a"
---

In one line: With offensive agents automating from secret discovery to exfiltration, defense must sit in the inventory of non-human identities, not in reaction time.

## What happened

On November 5, 2026, Microsoft Threat Intelligence reported that threat actors use the agentic framework ARTEX to find and abuse exposed secrets. According to the company, scanning for secrets on GitHub has been occurring since August, and since October 28 sign-ins of service principals with stolen credentials have been observed. In one case, the agent went from the GitHub scan to exfiltration of data from Azure Key Vault in five minutes. The publication does not name victims.

## Why it matters

Non-human identities, such as service principals, usually have broad permissions and little review. When the attacker chains discovery, authentication, and exfiltration automatically, the window between exposure and loss disappears. Effective control becomes preventive: do not expose secrets and limit what each identity can reach.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Secrets exposed in GitHub repositories | Microsoft Threat Intelligence, November 5 | High |
| Sign-ins of service principals with stolen credentials since 28/10 | Microsoft Threat Intelligence | High |
| Key Vault exfiltration in five minutes | Case described by Microsoft | High |

## What to do this week

1. Inventory service principals with access to Key Vault and sensitive data, and remove unused permissions — owner: identity / cloud.
2. Rotate secrets found in repositories and enable anomalous sign-in alerts for non-human identities — owner: SOC.
3. Signal that it worked: each service principal has an owner, documented least privilege, and periodic review.
