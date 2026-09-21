---
title: "ClarityCheck: 9 million face images in a database with no password and no encryption"
description: "A researcher found 450 GB from the caller-ID platform, with photos of adults, teenagers and children collected from the web."
pubDate: 2026-09-04T10:02:00-03:00
sourceName: "Cybernews"
sourceUrl: "https://cybernews.com/privacy/claritycheck-leak-are-you-indexed/"
cover: "https://covers.duarte.top/covers/20260902-claritycheck-biometricos.jpg"
tipo: incidente
tags: ["vazamento", "biometricos", "privacidade", "dspm", "criancas"]
notionUrl: "https://www.notion.so/3c717411747381fa8667c20124b12d57"
---

In one line: Nine million faces, including minors, in a 450 GB database with no authentication — the company called that an unindexed URL.

## What happened

On 21 August 2026 independent researcher Jeremiah Fowler located a 450 GB database associated with ClarityCheck, a platform used to identify unknown calls and look people up online. Inside it were more than 9 million face images, including photos of teenagers and children collected from social networks and dating sites, with no password and no encryption.

The company denied that the data was “publicly exposed”, arguing that access depended on an unindexed URL. The researcher challenged that by showing there was no authentication.

## Why it matters

Security by obscurity confuses “hard to find” with “protected”. Without access control, a researcher — or an attacker — closes that distance in minutes.

Biometric data is not swapped like a password. When the set includes minors, severity rises: the risk is not only today’s leak, it is what those images can feed later, from unauthorised facial recognition to identity fraud.

The script is familiar. Almost never is it the company deciding to leave the database open. It is the company that did not know that database existed in that state, without access control, for months.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Biometric database without authentication | Researcher’s report + 450 GB volume | High |
| Images of minors | Cited in the story | High |
| “Unindexed URL” as a control | Contested; no auth observed | High |

## What to do this week

1. Inventory bases with biometrics or a person’s photo and the real access control of each one — owner: security / data.
2. Check public exposure (bucket, index, “secret” URL) — owner: AppSec / cloud.
3. Signal it worked: a list of biometric bases with mandatory auth and no public object.
