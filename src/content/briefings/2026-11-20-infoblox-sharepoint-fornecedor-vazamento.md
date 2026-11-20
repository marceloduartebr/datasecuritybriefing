---
title: "Infoblox confirma que fornecedor de migração acessou SharePoint e levou dados de clientes e de funcionários"
description: "A empresa investiga acesso não autorizado, via fornecedor de migração com permissão no SharePoint, a snapshots de configuração de clientes e a dados financeiros e SSNs de funcionários."
pubDate: 2026-11-20T08:55:00-03:00
sourceName: "The Register"
sourceUrl: "https://www.theregister.com/security/2026/11/16/infoblox-customer-and-staff-data-exposed-in-sharepoint-breach/5310280"
cover: "https://covers.duarte.top/covers/20261118-infoblox-sharepoint-fornecedor-1759.jpg"
tipo: incidente
tags: ["infoblox", "terceiros", "sharepoint", "vazamento"]
pais: us
---

Em uma linha: o snapshot que existe para recuperar a rede também serve para copiá-la, quando um fornecedor de migração já tem acesso ao SharePoint.

## O que aconteceu

Em 16 de novembro de 2026 o The Register informou, com confirmação de um porta-voz da Infoblox, que a empresa investiga um acesso não autorizado a informações da companhia por meio de um fornecedor terceiro de migração de dados comprometido. Segundo fontes da reportagem, esse fornecedor tinha acesso confiável ao SharePoint da Infoblox, e os invasores usaram as contas dele para exfiltrar dados dali. Entre os dados de clientes estavam informações de configuração de algumas implantações do NIOS, incluindo snapshots de DNS, DHCP, bases do Grid e logs de relatórios, usados para recuperar o appliance ou o grid em caso de falha. Um e-mail do CEO Scott Harrell aos funcionários, visto pelo The Register, descreve ainda o roubo de dados de empregados: informações financeiras como depósito direto, contato, data de nascimento e números de Social Security de funcionários e dependentes. A empresa afirmou ter acionado a resposta a incidentes, contratado especialistas externos e enviado notificações. Disse também não haver indício de envolvimento de produtos, serviços em nuvem, atualizações de software ou processos de build. Não informou quantos clientes e funcionários foram afetados. Funcionários receberam um bônus de 100 dólares para gerenciador de senhas e dois anos de monitoramento de crédito.

## Por que importa

A cópia de recuperação da rede é, na prática, um inventário exportável da rede. O acesso confiável de um fornecedor de migração transforma o SharePoint em atalho para dados de clientes e de pessoas.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Fornecedor de migração com acesso ao SharePoint | Porta-voz da Infoblox ao The Register, 16/11 | Alta |
| Snapshots de DNS, DHCP e Grid de clientes | Fontes da reportagem do The Register | Alta |
| SSN, depósito direto e dados de dependentes | E-mail do CEO citado pelo The Register | Crítica |

## O que fazer nesta semana

1. Mapear quais fornecedores de migração, backup e implantação têm acesso a snapshots de configuração ou a repositórios como SharePoint (responsável: CISO / gestão de fornecedores).
2. Restringir o escopo desses acessos ao mínimo e ligar alerta para exportação ou download em massa (responsável: time de segurança de dados).
3. Verificar se dados de funcionários e dependentes (SSN, pagamento, contato) estão no mesmo repositório que os snapshots de cliente e separar o que não precisa coexistir (responsável: DPO / RH).
