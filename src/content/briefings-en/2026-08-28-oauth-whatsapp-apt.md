---
title: "Zero passwords cracked: OAuth and WhatsApp linking in Russian espionage"
description: "GTIG points to UNC6293 (linked to APT29), UNC7005 and UNC5976 using a genuine Google/Microsoft login and WhatsApp device hijack."
pubDate: 2026-08-28T18:10:00-03:00
sourceName: "The Hacker News / Google Threat Intelligence Group"
sourceUrl: "https://thehackernews.com/2026/08/suspected-russian-hackers-abuse-google.html"
cover: "https://covers.duarte.top/covers/20260828-oauth-whatsapp-apt.jpg"
tags: ["identidade", "oauth", "espionagem"]
notionUrl: "https://www.notion.so/3c717411747381cfbde6e58e7b80cf55"
---

In one line: the login screen was genuine; the token changed owner.

## What happened

Google Threat Intelligence Group describes three Russia-linked clusters — UNC6293 (associated with APT29/Cozy Bear), UNC7005 and UNC5976 — hijacking accounts in government, defence, aerospace, academia and think tanks in Europe and the United States. The tactic uses the real “Sign in with Google” or Microsoft flow and redirects to a malicious cloud project that captures the token. Another variant abuses WhatsApp device linking.

The account does not describe a cracked password or a zero-day exploit.

## Why it matters

A valid token opens the same doors as the real user. Access control ≠ visibility over the data that token reads.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| OAuth consent fraud | GTIG / THN | High |
| WhatsApp device linking | GTIG / THN | High |

## What to do this week

1. Review granted OAuth apps (Google Workspace / Entra) and revoke those without an owner — identity.
2. Treat a messenger “linked device” as an access control, not as an IT detail.
3. Signal it worked: you can list what a director’s token reaches.
