---
title: "Outlook: falha explorada que vaza hash NTLMv2 entra no KEV"
description: "CISA adicionou o CVE-2026-124194 em 10 de novembro. Um arquivo de mensagem faz o Outlook se conectar a um servidor do atacante sem o aviso de conteúdo externo."
pubDate: 2026-11-11T10:20:00-03:00
sourceName: "Microsoft (MSRC) e CISA"
sourceUrl: "https://msrc.microsoft.com/update-guide/vulnerability/CVE-2026-124194"
cover: "https://covers.duarte.top/covers/20261111-outlook-ntlm-kev.jpg"
tipo: vulnerabilidades
pais: us
tags: ["kev", "cve", "microsoft", "outlook", "ntlm", "identidade"]
notionUrl: "https://www.notion.so/41417411747381909665ddff9c3c22bc"
---

Em uma linha: abrir um arquivo de mensagem no Outlook basta para entregar o hash NTLMv2 do usuário a um servidor do atacante.

## O que aconteceu

No Patch Tuesday de 10 de novembro de 2026, a Microsoft corrigiu o CVE-2026-124194, falha de spoofing no Outlook marcada como "Exploitation Detected" — o único zero-day explorado entre os 1.094 CVEs do mês. Segundo o MSRC, um atacante não autenticado envia um arquivo de mensagem especialmente criado e convence o usuário a abri-lo; o Outlook então se conecta a um local de rede controlado pelo atacante sem exibir o aviso de conteúdo externo, expondo o hash NTLMv2 do usuário, que pode ser usado para se autenticar como ele. O Painel de Visualização não é vetor; é preciso interação do usuário. Severidade Moderada, CVSS 3.1 6,5. Afeta Microsoft 365 Apps for Enterprise, Office LTSC 2021 e Office LTSC 2024; a correção vem na atualização do Office, não no cumulativo do Windows. No mesmo dia, a CISA incluiu a falha no KEV.

## Por que importa

Nota 6,5 engana. O que sai não é um dado qualquer, é uma credencial: com o hash NTLMv2, o atacante pode quebrá-lo offline ou se passar pelo usuário em serviços que ainda aceitam NTLM, e a partir daí chegar a e-mail, arquivos e bases internas. Phishing com anexo continua sendo a porta, e o controle que falha é o aviso que o usuário deveria ver.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Arquivo de mensagem malicioso aberto no Outlook | MSRC, Exploitation Detected | Alta |
| Vazamento do hash NTLMv2 e uso para autenticação | MSRC | Alta |
| Correção só na atualização do Office | MSRC / notas do Office | Média |

## O que fazer nesta semana

1. Aplicar a atualização de segurança do Microsoft 365 Apps e do Office LTSC 2021/2024 — dono: endpoint/TI. O cumulativo do Windows não corrige.
2. Bloquear NTLM de saída para a internet (SMB/WebDAV) e avançar na restrição de NTLM onde for possível — dono: identidade/rede.
3. Sinal de que funcionou: não há conexões SMB ou WebDAV de estações para IPs externos nos logs depois do patch.
