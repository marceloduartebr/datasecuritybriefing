---
title: "Identity and AI: Entra, Copilot Studio, LiteLLM and n8n"
description: "KEV Sep/2026: Entra CVE-2026-62916, Copilot Studio CVE-2026-80098, LiteLLM CVE-2026-59822, n8n CVE-2026-85165 — identity and automation."
pubDate: 2026-09-16T10:22:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-identidade-ia.jpg"
tipo: vulnerabilidades
tags: ["kev", "entra", "copilot", "litellm", "n8n", "identidade", "ia"]
notionUrl: "https://www.notion.so/3dd17411747381e8ad03fde557d7eed6"
---

In one line: Cloud IdP, agent studio and AI/automation orchestrators enter the KEV.

## What happened

In the September 2026 KEV: CVE-2026-62916 (Microsoft Entra), CVE-2026-80098 (Copilot Studio), CVE-2026-59822 (LiteLLM) and CVE-2026-85165 (n8n), with known exploitation according to CISA.

## Why it matters

Entra is the session root. Copilot Studio and LiteLLM concentrate model keys and connectors. Self-hosted n8n in Brazil often runs with a public webhook and a secret in plain text — a KEV exploit becomes malicious automation with a corporate credential.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Microsoft Entra | CVE-2026-62916, KEV | Critical |
| Copilot Studio | CVE-2026-80098, KEV | High |
| LiteLLM | CVE-2026-59822, KEV | High |
| n8n | CVE-2026-85165, KEV | High |

## What to do this week

1. Confirm application of the Entra/Copilot advisory on the tenant — owner: identity.
2. Inventory LiteLLM and n8n (version, exposure, secrets) — owner: platform / automation.
3. Signal it worked: no AI/automation orchestrator remains without a documented version and network restriction.
