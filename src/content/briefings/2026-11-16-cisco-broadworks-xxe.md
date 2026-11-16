---
title: "Cisco BroadWorks: XXE sem autenticação entra no KEV"
description: "CVE-2026-20320 permite leitura de configuração sem login; CISA adicionou ao KEV em 10/11 e Malbear Labs ligou a campanha com agente de IA."
pubDate: 2026-11-16T18:18:00-03:00
sourceName: "SecurityWeek"
sourceUrl: "https://www.securityweek.com/threat-actors-exploit-openwave-cisco-broadworks-vulnerabilities/"
cover: "https://covers.duarte.top/covers/20261112-cisco-broadworks-xxe.jpg"
tipo: vulnerabilidades
tags: ["cve", "kev", "cisco", "xxe", "identidade-nao-humana"]
pais: us
notionUrl: "https://www.notion.so/41617411747381e5bb5eea0fc10141e5"
---

**Em uma linha:** XXE sem autenticação no Cisco BroadWorks entrou no KEV e já foi usado por agente de IA contra telecom europeu.

## O que aconteceu

Em 10 de novembro de 2026 a CISA adicionou o CVE-2026-20320 ao catálogo KEV. A falha, no parser OCI do Cisco BroadWorks, permite que um atacante remoto sem autenticação leia informações de configuração sensíveis via XML externo. O patch (RI.2026.07) saiu em agosto. Malbear Labs publicou em 8 de novembro detalhes de uma campanha em que um agente de IA (DeepSeek Flash jailbroken) explorou a falha por mais de duas semanas contra um provedor de telecom europeu e 13 organizações hospedadas, extraindo chaves privadas, credenciais e dados de billing.

## Por que importa

O intervalo entre patch e exploração ativa revela que o inventário de versões e a exposição da interface de provisionamento não são automáticos. Um agente autônomo que adapta tática reduz a janela de detecção humana.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| XXE sem autenticação na OCI-P | CISA KEV, CVSS 7.5, porta 2208 | Alta |
| Agente de IA com chaves privadas | Malbear Labs, 13 orgs | Alta |
| Patch de agosto ainda explorado | Cisco advisory vs. KEV 10/11 | Média |

## O que fazer nesta semana

1. Inventariar instâncias BroadWorks e confirmar versão ≥ RI.2026.07 — time de rede/voz.
2. Restringir acesso à OCI-P (porta 2208) a redes de gestão — time de firewall.
3. Revisar logs de XML anômalo e chaves extraídas — SOC.
