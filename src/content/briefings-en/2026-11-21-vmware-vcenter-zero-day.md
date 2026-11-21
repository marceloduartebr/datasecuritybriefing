---
title: "vCenter zero-day: two months of administrator access before the patch"
description: "A flaw exploited since September gives full control of vCenter and raises the question of which data lives in each VM."
pubDate: 2026-11-21T12:46:00-03:00
sourceName: "BleepingComputer"
sourceUrl: "https://www.bleepingcomputer.com/news/security/vmware-patches-vcenter-zero-day-exploited-in-attacks-since-september/"
cover: "https://covers.duarte.top/covers/20261121-vmware-vcenter-zero-day-0810.jpg"
tipo: vulnerabilidades
tags: ["vmware", "vcenter", "kev", "zero-day", "virtualizacao"]
pais: global
---

**In one line:** whoever controls vCenter reaches the data of every VM without passing through any application control, and this flaw was exploited for more than two months before the patch.

## What happened
On 19 November 2026, Broadcom published VMSA-2026-0009 with the fix for CVE-2026-123890, an authentication bypass in the VMware Directory Service of vCenter Server. With network access and no credentials, the attacker obtains a session authenticated as administrator@vsphere.local. VMware, as CNA, assigned a CVSS 3.1 score of 9.8 (critical). Broadcom treats the update as an emergency and says there is no official workaround.

Mandiant and the Google Threat Intelligence Group report exploitation since early September 2026 by a suspected China-linked espionage group tracked as Armory Castle (formerly UNC5221). The chain started on BeyondTrust Remote Support appliances, moved through internal Linux systems and reached vCenter, where the administrator session allows running commands and retrieving files, including the directory service's data.mdb, according to Mandiant. On 20 November, CISA added the flaw to the KEV catalog, with a 23 November deadline for federal agencies.

## Why it matters
vCenter sits beneath every application. With administrator privilege on it, virtual disks, snapshots and machine copies are reachable without touching the login, MFA or logs of the applications that hold personal, financial or health data. An intrusion that began in September forces an answer to which data was in each VM of the cluster, not just whether the server was patched.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Authentication bypass in vCenter (CVE-2026-123890) | Broadcom advisory, CISA KEV on 20/11 | Critical |
| Zero-day exploitation since September | Mandiant and GTIG report | High |
| Lateral movement from remote access (BeyondTrust) | Chain described by Mandiant | High |
| Access to VM disks and snapshots with regulated data | Inference from the privilege obtained | High |

## What to do this week
1. Apply VMSA-2026-0009 to vCenter and SDDC Manager, and restrict network access to vCenter to management networks. Owner: infrastructure and virtualization team.
2. Cross-reference this vCenter's VM inventory with the inventory of personal and regulated data, to know what would be exposed if there was access since September. Owner: data security and privacy (DPO).
3. Sign that it worked: for each cluster there is a list of VMs with sensitive data, and the hunt for the indicators in the Mandiant report has been logged, with or without findings.
