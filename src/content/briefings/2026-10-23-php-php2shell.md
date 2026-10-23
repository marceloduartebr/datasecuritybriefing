---
title: "Perímetro — PHP, RCE pré-auth no php2shell"
description: "Duas falhas críticas de RCE sem autenticação no PHP foram corrigidas em 21 de outubro de 2026; CSIRT chileno e ColCERT pediram update imediato."
pubDate: 2026-10-23T10:26:00-03:00
sourceName: "PHP.net"
sourceUrl: "https://www.php.net/archive/2026.php#2026-10-21-5"
cover: "https://covers.duarte.top/covers/20261022-php-php2shell.jpg"
tipo: vulnerabilidades
tags: ["vulnerabilidades", "php", "rce", "latam"]
pais: latam
notionUrl: "https://www.notion.so/4011741174738134a465ced20e210024"
---

Em uma linha: Duas falhas críticas de RCE sem autenticação no runtime PHP foram corrigidas em 21 de outubro; o update é a única mitigação completa.

## O que aconteceu

Em 21 de outubro de 2026 o projeto PHP liberou as versões 8.5.12, 8.4.27, 8.3.36 e 8.2.35 corrigindo CVE-2026-109618 (corrupção de memória em OOM) e CVE-2026-109619 (estado global obsoleto / use-after-free). Ambas têm CVSS 9.2 e permitem execução remota de código sem autenticação. O risco é mais alto em Apache mod_php, onde um request não autenticado pode disparar o ataque antes do código da aplicação. CSIRT Nacional do Chile (AVC26-00740) e ColCERT emitiram alertas no mesmo dia. PoCs circularam. Versões 8.1 e anteriores não recebem mais updates do projeto.

## Por que importa

O perímetro de aplicação web inclui o runtime. Sem inventário de versão de PHP em produção, a política de patch não gera evidência. Alertas de CSIRT latino-americanos mostram que o fato já chegou à região.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| RCE pré-auth no runtime | Alertas CSIRT CL/CO + PoCs | Alta |
| Exposição mod_php | Demonstrado pelo projeto | Alta |
| Versões EOL | 8.1 e anteriores sem update oficial | Média |

## O que fazer nesta semana

1. Inventariar instâncias PHP expostas — dono da infra.
2. Confirmar versão e aplicar 8.2.35+ ou superior suportado — dono da aplicação.
3. Sinal: nenhum servidor internet-facing em versão vulnerável após 48h.