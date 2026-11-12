---
title: "GPUStack: authentication bypass in AI model server enters KEV"
description: "Undue trust in the loopback origin gives admin without password to whoever reaches the inference server."
pubDate: 2026-11-12T18:21:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/09/cisa-adds-four-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261110-gpustack-kev.jpg"
tipo: vulnerabilidades
pais: us
tags: ["kev", "aispm", "shadow-ai", "infraestrutura-de-ia", "autenticacao"]
notionUrl: "https://www.notion.so/413174117473812a9404fd439922bc8c"
---

**In one line:** inference servers outside the inventory are shadow AI with exposed admin access.

## What happened
CISA included on 09/11/2026 the CVE-2026-102895 of GPUStack (GPU cluster manager for serving AI models) in the KEV. The flaw is an authentication bypass via trusted loopback origin (TCP peer of reverse proxy or X-GPUStack-Real-IP header), which grants admin without authentication. CVSS 9.8 according to secondary sources (NVD not consulted); EPSS 0.3%. The manufacturer's advisory was not read.

## Why it matters
Inference clusters concentrate models, fine-tuning data, prompts and API keys. They are usually set up by data teams, outside the security inventory.

## Risk reading
| Vector | Public evidence | Severity |
|---|---|---|
| Authentication bypass via header/proxy | KEV 09/11/2026 | Critical |
| Data and keys in the AI cluster | Depends on usage | High |

## What to do this week
1. Locate GPUStack instances and apply the manufacturer's fix — owner: data/ML platform.
2. Block the X-GPUStack-Real-IP header coming from outside on the reverse proxy — owner: infrastructure.
3. Sign that it worked: inventory of model servers with owner and accessible data mapped.

> Investigation note: the source was not reread at this evaluation stage; the facts follow the DSB radar record.
