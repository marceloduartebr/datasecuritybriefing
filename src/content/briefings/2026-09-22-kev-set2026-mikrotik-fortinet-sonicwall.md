---
title: "Edge BR: MikroTik, Fortinet e SonicWall no KEV de setembro"
description: "KEV set/2026: MikroTik CVE-2026-86060/67277, Fortinet CVE-2025-25249 e SonicWall SMA1000 CVE-2026-83548/83549 — borda BR."
pubDate: 2026-09-22T10:43:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-edge.jpg"
tipo: vulnerabilidades
tags: ["kev", "mikrotik", "fortinet", "sonicwall", "edge", "brasil"]
notionUrl: "https://www.notion.so/3dd174117473812db535c53989507de6"
pais: br
---

Em uma linha: três famílias de edge muito presentes no Brasil entram (ou reaparecem) no KEV de setembro.

## O que aconteceu

No KEV de setembro/2026 constam MikroTik CVE-2026-86060 e CVE-2026-67277; Fortinet CVE-2025-25249; SonicWall SMA1000 CVE-2026-83548 e CVE-2026-83549 — todas com exploração conhecida segundo a CISA (catálogo 14/09/2026).

## Por que importa

Filiais, ISPs e VPN doméstica no Brasil usam essas plataformas fora do ciclo de patch do DC. Inventário incompleto atrasa BOD/KEV. CVE de 2025 ainda no KEV de 2026 reforça: CVSS e ano do ID não medem exposição atual.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| MikroTik RouterOS | CVE-2026-86060, CVE-2026-67277, KEV | Crítica |
| Fortinet | CVE-2025-25249, KEV | Crítica |
| SonicWall SMA1000 | CVE-2026-83548, CVE-2026-83549, KEV | Crítica |

## O que fazer nesta semana

1. Cruzar CMDB/NetBox com MikroTik, Fortinet e SonicWall — dono: rede.
2. Priorizar patch/mitigação das CVEs KEV acima — dono: operações.
3. Sinal de que funcionou: cada appliance de borda tem versão e ticket de remediação linkado ao KEV.
