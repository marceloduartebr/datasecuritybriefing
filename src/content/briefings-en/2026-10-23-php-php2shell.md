---
title: "Perimeter — PHP, pre-auth RCE in php2shell"
description: "Two critical unauthenticated RCE flaws in PHP were fixed on 21 October 2026; Chilean CSIRT and ColCERT called for immediate updates."
pubDate: 2026-10-23T10:26:00-03:00
sourceName: "PHP.net"
sourceUrl: "https://www.php.net/archive/2026.php#2026-10-21-5"
cover: "https://covers.duarte.top/covers/20261022-php-php2shell.jpg"
tipo: vulnerabilidades
tags: ["vulnerabilidades", "php", "rce", "latam"]
pais: latam
notionUrl: "https://www.notion.so/4011741174738134a465ced20e210024"
---

In one line: Two critical unauthenticated RCE flaws in the PHP runtime were fixed on 21 October; the update is the only complete mitigation.

## What happened

On 21 October 2026 the PHP project released versions 8.5.12, 8.4.27, 8.3.36 and 8.2.35 fixing CVE-2026-109618 (memory corruption on OOM) and CVE-2026-109619 (stale global state / use-after-free). Both have CVSS 9.2 and allow unauthenticated remote code execution. Risk is highest under Apache mod_php, where an unauthenticated request can trigger the attack before application code runs. Chile's National CSIRT (AVC26-00740) and ColCERT issued alerts the same day. PoCs circulated. Versions 8.1 and earlier no longer receive project updates.

## Why it matters

The web application perimeter includes the runtime. Without a production PHP version inventory, patch policy produces no evidence. Latin American CSIRT alerts show the fact has already reached the region.

## Risk reading

| Vector | Public evidence | Severity |
|---|---|---|
| Pre-auth RCE in the runtime | CSIRT CL/CO alerts + PoCs | High |
| mod_php exposure | Demonstrated by the project | High |
| EOL versions | 8.1 and earlier without official update | Medium |

## What to do this week

1. Inventory exposed PHP instances — infra owner.
2. Confirm version and apply 8.2.35+ or higher supported — application owner.
3. Signal: no internet-facing server on a vulnerable version after 48h.