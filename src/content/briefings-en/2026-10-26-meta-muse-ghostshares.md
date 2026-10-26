---
title: "Meta suspends Muse sharing after GhostShares exposed conversations via passive DNS"
description: "Claroc enumerated more than 6,800 Muse agent links from Meta via passive DNS; internal documents and personal data were accessible without the original link. Meta suspended the feature."
pubDate: 2026-10-26T10:23:00-03:00
sourceName: "Claroc"
sourceUrl: "https://blog.claroc.io/ghostshares-muse-passive-dns/"
cover: "https://covers.duarte.top/covers/20261020-meta-muse-ghostshares.jpg"
tipo: incidente
tags: ["ia", "privacidade", "meta", "ghostshares", "dns"]
pais: us
notionUrl: "https://www.notion.so/3ff17411747381638b44f886b386a2bb"
---

In one line: Meta Muse sharing links were enumerable via passive DNS because the conversation title went into the subdomain.

## What happened

In October 2026, Claroc researchers identified that Meta's Muse AI agent generated conversation sharing links in the format title-id.cf.metaaiusercontent.com. A single query to commercial passive DNS services returned more than 6,800 hostnames. Samples opened without login contained internal financial documents, loan applications, vacation calendars and notes preparing for a confidential executive search. The flaw (GhostShares) was reported in Meta's bug bounty on October 8. On October 20, after press contact, Meta temporarily suspended the feature.

## Why it matters

“Anyone with the link” ceases to be a control when the hostname is publicly enumerable. AI agents that materialize conversations into web pages introduce a new exposure vector: the session title becomes infrastructure metadata. Without an inventory of what has already been published, detection and response depend on external research.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Enumeration of shares via passive DNS | >6,800 hostnames in one query; samples with sensitive data | High |
| Unauthenticated access to “anyone with the link” pages | Most samples opened in anonymous mode | High |
| Meta's response | Feature suspended after press coverage | Medium |

## What to do this week

1. Map which AI agents in the organization generate links or pages from conversations and whether the title or metadata enters the hostname or public URL — owner: security / product team.
2. Review the policy for sharing agent outputs: require authentication, short expiration and absence of sensitive data in the public identifier — owner: data governance.
3. Check whether already published shares or artifacts can be enumerated by DNS, Certificate Transparency or public indexes — sign it worked: updated inventory and no hostname with a sensitive title.