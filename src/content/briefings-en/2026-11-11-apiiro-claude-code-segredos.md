---
title: "Apiiro finds 2,539 secrets exposed on GitHub via coding agent permissions file"
description: "A convenience option in a coding agent writes credentials into a file that ends up in the repository, and no one decided to publish them."
pubDate: 2026-11-11T18:18:00-03:00
sourceName: "Apiiro"
sourceUrl: "https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again"
cover: "https://covers.duarte.top/covers/20261109-apiiro-claude-code-segredos.jpg"
tipo: noticia
pais: us
tags: ["shadow-ai", "identidade-nao-humana", "segredos", "devsecops"]
notionUrl: "https://www.notion.so/411174117473815aba41c705a2625861"
---

In one line: Coding agents create artifacts with credentials outside any inventory; Apiiro's research gives the scale of the problem.

## What happened

On November 5, 2026, Apiiro (vendor research) published that Claude Code's "don't ask again" option records the approved command, including any passwords or tokens in it, into the .claude/settings.local.json file. When the file is versioned, the secret goes into the repository. The company claims to have found 2,539 real secrets in 1,994 public repositories, from 63 organizations, and that one of them confirmed the exposed key was active. The Hacker News covered the study on November 7.

## Why it matters

The risk is not only in the code the agent writes, but in the configuration files, logs, and caches it creates. These artifacts stay outside traditional sensitive-data and secrets controls and reach public repositories without anyone consciously deciding to publish them.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Credentials written into agent permissions file | Apiiro research, November 5 | High |
| Exposed key confirmed as active | Apiiro research | High |
| Scale across public repositories (63 organizations) | Apiiro research; The Hacker News | Medium |

## What to do this week

1. Scan repositories for coding-agent configuration files and add them to .gitignore — owner: platform engineering.
2. Rotate any credentials found in those files and enable secrets scanning in the pipeline — owner: AppSec.
3. Signal it worked: secrets scanning now covers directories created by AI agents, with no new findings for two weeks.
