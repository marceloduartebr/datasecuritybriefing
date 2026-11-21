---
title: "SBC Medical Group confirma roubo de dados de 1,6 milhão de clientes no Japão"
description: "A administradora de clínicas listada na Nasdaq informou que um terceiro extraiu dados de clientes, incluindo senhas, de um sistema web da subsidiária japonesa em 16 de novembro."
pubDate: 2026-11-21T08:50:00-03:00
sourceName: "SBC Medical Group"
sourceUrl: "https://ir.sbc-holdings.com/sbc-medical-group-reports-cybersecurity-incidents-in-japan/"
cover: "https://covers.duarte.top/covers/20261121-sbc-medical-group-vazamento-0810.jpg"
tipo: incidente
tags: ["sbc-medical", "saude", "vazamento", "retencao", "japao"]
pais: global
---

Em uma linha: o comunicado traz o mapa por categoria e período que toda notificação deveria ter, e revela dados guardados desde 2010.

## O que aconteceu

A SBC Medical Group Holdings (Nasdaq: SBC) informou em 18 de novembro de 2026 que, em 16 de novembro, houve acesso não autorizado a bancos de dados de um sistema web gerido pela SBC Medical Group, Ltd., sua subsidiária japonesa, e que um terceiro acessou e extraiu informações de clientes. O método de intrusão e o escopo completo seguem em investigação. A empresa também registrou o caso na SEC em formulário 8-K.

Segundo o comunicado, foram obtidos dados básicos de 1.624.000 pessoas (nomes, sexo, telefones, e-mails, senhas, endereços, datas de nascimento, números de cartão de paciente, IDs de membro e respostas de pesquisas, total ou parcialmente), referentes ao período de 2010 a 2023; 255.416 pedidos de reserva; 217.769 formulários de contato; 4.513 registros de monitoramento de tratamento; e 15.007 avaliações. Cerca de 20 mil registros de contas de funcionários (nomes, IDs e senhas) também foram obtidos e, para 459 funcionários, dados bancários e previdenciários. A empresa diz não ter confirmado aquisição de prontuários eletrônicos. Separadamente, também em 16 de novembro, foi notificada de acesso não autorizado a contas de administradores de clínicas na plataforma de agendamento de terceiros Tribeau.

## Por que importa

O comunicado mostra o que uma notificação precisa: categorias, tipos de dados, número de pessoas e período. Ao mesmo tempo, expõe o custo da retenção: registros de mais de uma década num sistema de site ampliaram o alcance do incidente.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
| --- | --- | --- |
| Retenção prolongada de dados de clientes | Dados básicos de 2010 a 2023 extraídos | Alta |
| Senhas de clientes e funcionários | Senhas de clientes e cerca de 20 mil contas de funcionários obtidas | Alta |
| Plataforma de agendamento de terceiro | Acesso indevido a contas de administradores na Tribeau | Média |

## O que fazer nesta semana

1. Listar sistemas web que guardam dados de clientes com mais de cinco anos e aplicar a política de retenção (dono: Governança de Dados).
2. Verificar se as tabelas de senhas usam hash forte e forçar troca onde não usarem (dono: Engenharia).
3. Testar se a empresa consegue gerar, por base de dados, o mapa de categorias, quantidade de titulares e período (dono: DPO).
