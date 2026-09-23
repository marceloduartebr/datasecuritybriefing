---
title: "KEV set/2026: ScreenConnect e N-able no radar MSP"
description: "CISA KEV set/2026 inclui CVE-2026-84869 (ScreenConnect) e CVE-2026-86218 (N-able N-central) — ângulo MSP/RMM no Brasil."
pubDate: 2026-09-23T10:28:00-03:00
sourceName: "CISA KEV"
sourceUrl: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20260916-vuln-msp.jpg"
tipo: vulnerabilidades
tags: ["kev", "msp", "rmm", "screenconnect", "n-able"]
notionUrl: "https://www.notion.so/3dd17411747381049fcbfe5e3528317d"
pais: br
---

Em uma linha: RMM e acesso remoto de MSP entram no KEV; o canal de suporte vira superfície de exploração.

## O que aconteceu

No catch-up KEV de setembro/2026 (catálogo atualizado em 14/09), constam CVE-2026-84869 (ConnectWise ScreenConnect) e CVE-2026-86218 (N-able N-central), ambas com exploração conhecida segundo a CISA.

## Por que importa

No Brasil, MSPs concentram dezenas de clientes em um console. Compromisso do RMM herda credencial, sessão e script — sem novo e-mail de phishing. Contratos de serviço raramente exigem evidência de patch KEV em 48–72h.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| ScreenConnect | CVE-2026-84869, KEV | Crítica |
| N-able N-central | CVE-2026-86218, KEV | Crítica |
| Cadeia MSP→cliente | Sessão remota legítima pós-exploit | Alta |

## O que fazer nesta semana

1. Pedir ao MSP evidência de versão e patch das CVEs KEV — dono: gestão de fornecedores.
2. Restringir exposição do console RMM (VPN/IP allowlist) — dono: rede.
3. Sinal de que funcionou: há registro escrito de versão ScreenConnect/N-central e data de correção alinhada ao KEV.
