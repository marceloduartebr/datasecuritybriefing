---
title: "Edge — VMware ESX logging insuficiente no KEV (CVE-2026-41709)"
description: "CISA adicionou CVE-2026-41709 ao KEV; Warp Panda usou a falha de logging como zero-day em alvos americanos."
pubDate: 2026-11-02T10:17:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/10/28/cisa-adds-two-known-exploited-vulnerabilities-catalog"
cover: "https://covers.duarte.top/covers/20261029-edge-vmware-esx-kev.jpg"
tipo: vulnerabilidades
tags: ["cve", "kev", "vmware", "edge"]
pais: us
notionUrl: "https://www.notion.so/408174117473813ebb08eee4aa94726d"
---

**Em uma linha:** Logging insuficiente no ESX permite operações admin sem rastro e já foi usado como zero-day por ator de nexo chinês.

## O que aconteceu

Em 28 de outubro de 2026 a CISA incluiu o CVE-2026-41709 no catálogo KEV. A vulnerabilidade, de CVSS 2.7, permite que um atacante com privilégio administrativo no Broadcom VMware ESX execute determinadas operações sem que elas sejam registradas. A CrowdStrike documentou o uso como zero-day pelo grupo Warp Panda em intrusões a organizações dos EUA, incluindo o setor jurídico, para apagar ou reduzir a trilha de auditoria. O acesso inicial costuma ocorrer por dispositivos de borda; o pivô é o vCenter. Patches existem desde o advisory de 29 de julho. Prazo federal de remediação: 11 de novembro de 2026.

## Por que importa

A falha não dá acesso inicial; ela remove a evidência do que o acesso privilegiado fez. Em ambientes onde o log do hipervisor é a principal fonte forense, a ausência de registro transforma política de acesso em suposição.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Logging insuficiente (CVE-2026-41709) | KEV 28/10; zero-day Warp Panda em alvos US | Alta |
| Acesso admin residual | Operações sem rastro no ESX | Alta |
| Cadeia com borda | Entrada por edge devices + pivô vCenter | Alta |

## O que fazer nesta semana

1. Verificar versão de todos os hosts ESX/ESXi, Cloud Foundation e vSphere Foundation contra as builds corrigidas (ESXi-9.1.0.0-25370933, ESXi-9.0.2.0100-25595025, ESXi80U3j-25429389 ou superiores) — dono: virtualização.
2. Revisar logs de administração do vCenter e ESX dos últimos 90 dias em busca de lacunas inexplicáveis e validar integridade da trilha — dono: detecção / forense.
3. Sinal de que funcionou: inventário de hosts desatualizados zerado e alerta de cobertura de log no hipervisor ativo.
