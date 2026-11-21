---
title: "Zero-day no vCenter: dois meses de acesso de administrador antes do patch"
description: "Falha explorada desde setembro dá controle total do vCenter e coloca na mesa a pergunta sobre quais dados vivem em cada VM."
pubDate: 2026-11-21T12:46:00-03:00
sourceName: "BleepingComputer"
sourceUrl: "https://www.bleepingcomputer.com/news/security/vmware-patches-vcenter-zero-day-exploited-in-attacks-since-september/"
cover: "https://covers.duarte.top/covers/20261121-vmware-vcenter-zero-day-0810.jpg"
tipo: vulnerabilidades
tags: ["vmware", "vcenter", "kev", "zero-day", "virtualizacao"]
pais: global
---

**Em uma linha:** quem controla o vCenter alcança os dados de todas as VMs sem passar por nenhum controle da aplicação, e esta falha foi explorada por mais de dois meses antes do patch.

## O que aconteceu
Em 19 de novembro de 2026, a Broadcom publicou o VMSA-2026-0009 com a correção da CVE-2026-123890, um bypass de autenticação no VMware Directory Service do vCenter Server. Com acesso de rede e sem credencial, o atacante obtém uma sessão autenticada como administrator@vsphere.local. A VMware, como CNA, atribuiu CVSS 3.1 de 9.8 (crítico). A Broadcom trata a atualização como emergencial e informa que não há workaround oficial.

A Mandiant e o Google Threat Intelligence Group relatam exploração desde o início de setembro de 2026 por um grupo suspeito de espionagem ligado à China, rastreado como Armory Castle (antes UNC5221). A cadeia começou em appliances BeyondTrust Remote Support, passou por sistemas Linux internos e chegou ao vCenter, onde a sessão de administrador permite executar comandos e obter arquivos, incluindo o data.mdb do serviço de diretório, segundo a Mandiant. Em 20 de novembro, a CISA incluiu a falha no catálogo KEV, com prazo de 23 de novembro para as agências federais.

## Por que importa
O vCenter fica abaixo de todas as aplicações. Com privilégio de administrador nele, discos virtuais, snapshots e cópias de máquinas ficam acessíveis sem tocar no login, no MFA ou nos logs das aplicações que guardam dados pessoais, financeiros ou de saúde. Uma intrusão que começou em setembro obriga a responder quais dados estavam em cada VM do cluster, e não apenas se o servidor foi corrigido.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Bypass de autenticação no vCenter (CVE-2026-123890) | Advisory da Broadcom, KEV da CISA em 20/11 | Crítica |
| Exploração como zero-day desde setembro | Relatório da Mandiant e do GTIG | Alta |
| Movimento lateral a partir de acesso remoto (BeyondTrust) | Cadeia descrita pela Mandiant | Alta |
| Acesso a discos e snapshots de VMs com dados regulados | Inferência a partir do privilégio obtido | Alta |

## O que fazer nesta semana
1. Aplicar o VMSA-2026-0009 no vCenter e no SDDC Manager, e restringir o acesso de rede ao vCenter a redes de gestão. Dono: time de infraestrutura e virtualização.
2. Cruzar o inventário de VMs desse vCenter com o inventário de dados pessoais e regulados, para saber o que estaria exposto se houve acesso desde setembro. Dono: segurança de dados e privacidade (DPO).
3. Sinal de que funcionou: para cada cluster, existe uma lista das VMs com dados sensíveis e a caça por indicadores do relatório da Mandiant foi registrada, com ou sem achados.
