---
title: "SSHole: password bypass in OpenSSH on Linux with musl enters KEV"
description: "In certain configurations, any long password is accepted; exploitation has already been seen and CISA added the flaw to the KEV."
pubDate: 2026-11-11T18:20:00-03:00
sourceName: "NVD (NIST)"
sourceUrl: "https://nvd.nist.gov/vuln/detail/CVE-2026-123158"
cover: "https://covers.duarte.top/covers/20261110-openssh-sshole-kev.jpg"
tipo: vulnerabilidades
pais: us
tags: ["kev", "openssh", "containers", "alpine", "autenticacao"]
notionUrl: "https://www.notion.so/41317411747381d597ded18fec4f3b22"
---

In one line: forgotten SSH in container images became an entry point with active exploitation.

## What happened
On 09/11/2026 CISA added CVE-2026-123158 to the KEV catalog. According to the NVD, OpenSSH sshd before 10.6p2 on Linux with musl libc and without PAM (the case of Alpine Linux) lacks protection against a password authentication bypass: in certain account configurations, any password between 256 and 1,024 characters is accepted. Public proofs of concept exist and the press reported exploitation attempts in honeypots between 05 and 06/11. Fix: OpenSSH 10.6p2 and Alpine packages. CVSS 8.1 (CNA MITRE; NVD still without score); EPSS 1.0% on 09/11.

## Why it matters
Alpine is a common container base. An active sshd in a lightly reviewed image can give access to production volumes and secrets.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| sshd with password on Alpine/musl without PAM | KEV 09/11/2026; public PoCs | High |
| Container with data volume | Depends on configuration | Medium to high |

## What to do this week
1. Update to OpenSSH 10.6p2 or the fixed Alpine package — owner: platform/infra.
2. Scan images and registries for active sshd and disable password authentication — owner: DevSecOps.
3. Signal it worked: zero Alpine images with password sshd exposed, and a list of data mounted in those that keep SSH.

> Verification note: the source was not re-read at this evaluation stage; the facts follow the DSB radar record.
