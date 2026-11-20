---
title: "Supply chain — Perforce Puppet Enterprise entra no KEV com RCE por deserialização de relatório"
description: "CISA adicionou em 17/11 o CVE-2026-115731, que permite execução de código no servidor Puppet a partir de qualquer certificado de agente assinado."
pubDate: 2026-11-20T12:52:00-03:00
sourceName: "CISA"
sourceUrl: "https://www.cisa.gov/news-events/alerts/2026/11/17/cisa-adds-one-known-exploited-vulnerability-catalog"
cover: "https://covers.duarte.top/covers/20261118-perforce-puppet-kev.jpg"
tipo: vulnerabilidades
tags: ["cve", "kev", "supply-chain", "puppet", "eua"]
pais: us
---

Em uma linha: Um certificado de agente assinado basta para executar código no servidor que assina confiança para toda a frota.

## O que aconteceu

Em 17 de novembro de 2026 a CISA incluiu o CVE-2026-115731 (deserialização de dados não confiáveis no processamento de relatórios do Puppet) no catálogo KEV. A falha permite que um cliente com qualquer certificado assinado pela CA do Puppet envie um relatório malicioso e execute código no servidor com privilégios do usuário de serviço. O patch foi liberado em 3 de novembro; a exploração foi sinalizada em 4 de novembro. Se a CA fizer autosign sem verificação forte, o vetor se torna não autenticado.

## Por que importa

Ferramentas de configuração management carregam a chave que define o que cada sistema recebe. Comprometer o servidor Puppet não para no próprio host: o atacante pode emitir certificados e alterar o que será entregue no próximo ciclo. Inventário de certificados de agente e política de autosign são controles de superfície, não só de patch.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| RCE via relatório assinado | KEV + aviso Perforce + SecurityWeek | Alta |
| Autosign sem verificação | Descrição do CNA / CISA | Alta se habilitado |
| Compromisso da CA | Aviso Perforce | Alta |

## O que fazer nesta semana

1. Inventariar Puppet Servers e versões (Enterprise e Core) — dono: plataforma.
2. Confirmar se autosign está desabilitado ou com verificação forte — dono: identidade/infra.
3. Aplicar patches 2026.0.1 / 2025.12.1 / 2023.8.13 ou equivalentes e reiniciar o serviço — dono: plataforma.
