---
title: "Edge — VMware ESX insufficient logging in KEV (CVE-2026-41709)"
description: "CISA added CVE-2026-41709 to the KEV; Warp Panda used the logging flaw as a zero-day against US targets."
pubDate: 2026-11-02T10:17:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/28/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261029-edge-vmware-esx-kev.jpg"
tipo: vulnerabilidades
tags: ["cve", "kev", "vmware", "edge"]
pais: us
notionUrl: "https://www.notion.so/408174117473813ebb08eee4aa94726d"
---

**In one line:** Insufficient logging on ESX allows admin operations without a trail and has already been used as a zero-day by a China-nexus actor.

## What happened

On 28 October 2026 CISA added CVE-2026-41709 to the KEV catalog. The vulnerability, CVSS 2.7, allows an attacker with administrative privilege on Broadcom VMware ESX to perform certain operations without them being logged. CrowdStrike documented use as a zero-day by the Warp Panda group in intrusions against US organizations, including the legal sector, to erase or reduce the audit trail. Initial access typically occurs via edge devices; the pivot is vCenter. Patches have existed since the 29 July advisory. Federal remediation deadline: 11 November 2026.

## Why it matters

The flaw does not grant initial access; it removes the evidence of what privileged access did. In environments where the hypervisor log is the primary forensic source, the absence of records turns access policy into assumption.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Insufficient logging (CVE-2026-41709) | KEV 28/10; zero-day Warp Panda against US targets | High |
| Residual admin access | Operations without trail on ESX | High |
| Edge chain | Entry via edge devices + vCenter pivot | High |

## What to do this week

1. Check version of all ESX/ESXi, Cloud Foundation and vSphere Foundation hosts against the fixed builds (ESXi-9.1.0.0-25370933, ESXi-9.0.2.0100-25595025, ESXi80U3j-25429389 or higher) — owner: virtualization.
2. Review vCenter and ESX admin logs from the last 90 days for unexplained gaps and validate trail integrity — owner: detection / forensics.
3. Signal it worked: inventory of outdated hosts at zero and hypervisor log-coverage alert active.
