---
title: "Outlook: exploited flaw that leaks NTLMv2 hash enters KEV"
description: "CISA added CVE-2026-124194 on November 10. A message file makes Outlook connect to an attacker-controlled server without the external content warning."
pubDate: 2026-11-11T10:20:00-03:00
sourceName: "Microsoft (MSRC) e CISA"
sourceUrl: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-124194"
cover: "https://covers.duarte.top/covers/20261111-outlook-ntlm-kev.jpg"
tipo: vulnerabilidades
pais: us
tags: ["kev", "cve", "microsoft", "outlook", "ntlm", "identidade"]
notionUrl: "https://www.notion.so/41417411747381909665ddff9c3c22bc"
---

In one line: opening a message file in Outlook is enough to hand the user's NTLMv2 hash to an attacker-controlled server.

## What happened

In the November 10, 2026 Patch Tuesday, Microsoft fixed CVE-2026-124194, a spoofing flaw in Outlook marked as "Exploitation Detected" — the only exploited zero-day among the month's 1,094 CVEs. According to MSRC, an unauthenticated attacker sends a specially crafted message file and convinces the user to open it; Outlook then connects to a network location controlled by the attacker without displaying the external content warning, exposing the user's NTLMv2 hash, which can be used to authenticate as them. The Preview Pane is not a vector; user interaction is required. Moderate severity, CVSS 3.1 6.5. Affects Microsoft 365 Apps for Enterprise, Office LTSC 2021 and Office LTSC 2024; the fix comes in the Office update, not the Windows cumulative. The same day, CISA added the flaw to the KEV.

## Why it matters

A 6.5 score is misleading. What leaves is not just any data, it is a credential: with the NTLMv2 hash, the attacker can crack it offline or impersonate the user on services that still accept NTLM, and from there reach email, files, and internal databases. Phishing with an attachment remains the door, and the control that fails is the warning the user should see.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Malicious message file opened in Outlook | MSRC, Exploitation Detected | High |
| NTLMv2 hash leak and use for authentication | MSRC | High |
| Fix only in the Office update | MSRC / Office notes | Medium |

## What to do this week

1. Apply the security update for Microsoft 365 Apps and Office LTSC 2021/2024 — owner: endpoint/IT. The Windows cumulative does not fix it.
2. Block outbound NTLM to the internet (SMB/WebDAV) and advance NTLM restriction where possible — owner: identity/network.
3. Signal that it worked: no SMB or WebDAV connections from workstations to external IPs in the logs after the patch.
