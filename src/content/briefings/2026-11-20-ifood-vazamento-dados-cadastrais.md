---
title: "iFood confirma acesso não autorizado a dados cadastrais de clientes, entregadores e parceiros"
description: "Em 14 de novembro o iFood identificou e conteve um acesso não autorizado a sistemas. O comunicado de 19 de novembro detalha o impacto por perfil e não informa o número de afetados."
pubDate: 2026-11-20T08:50:00-03:00
sourceName: "iFood"
sourceUrl: "https://institucional.ifood.com.br/releases/vazamento-de-dados"
cover: "https://covers.duarte.top/covers/20261120-ifood-vazamento-dados-cadastrais-0813.jpg"
tipo: incidente
tags: ["ciberseguranca", "protecaodedados", "lgpd", "ifood", "vazamentodedados"]
pais: br
---

Em uma linha: o iFood confirmou ter contido, em 14 de novembro, um acesso não autorizado a cadastros, com impacto diferente para clientes, parceiros e entregadores, e ainda não divulgou o total de afetados.

## O que aconteceu

Em 19 de novembro de 2026 o iFood publicou o "Comunicado de Vazamento de Dados Cadastrais". A empresa afirma que, no dia 14, identificou e conteve um acesso não autorizado a alguns de seus sistemas. Senhas, cartões de crédito e outros meios de pagamento, saldos, extratos bancários e informações biométricas não foram acessados, segundo o comunicado. Até a publicação, a empresa diz não ter identificado evidências de divulgação ou uso indevido das informações acessadas. Os serviços seguem operando normalmente.

O impacto varia conforme o público, de acordo com o iFood:

- Clientes e usuários do iFood Benefícios: apenas o número de telefone, sem nome, CPF, e-mail, endereço ou outro dado associado.
- Representantes de restaurantes e outros parceiros: telefone cadastrado e/ou CPF.
- Entregadores: alguns dados cadastrais que podem incluir nome, e-mail, telefone, CPF e, em alguns casos, agência e conta de repasse. A empresa afirma que não houve vazamento de endereço e que nem todos foram afetados da mesma forma. Quem teve dados acessados deve receber um e-mail com o detalhamento.

O iFood notificou a Agência Nacional de Proteção de Dados (ANPD) e informa que colabora com a autoridade. A apuração e o monitoramento continuam. A empresa não informou o número de pessoas atingidas nem o método usado no acesso.

## Por que importa

O comunicado já distingue o que foi lido em cada tipo de cadastro, o que indica algum recorte do incidente, mas o total de titulares e o intervalo em que o acesso permaneceu aberto não foram publicados. Telefone de cliente, mesmo sem nome associado no recorte oficial, é dado suficiente para tentativas de engenharia social em nome da plataforma. CPF de representante e dados de conta de repasse de entregador aumentam a superfície de golpe. Notificar a ANPD e avisar por e-mail não substitui um inventário público do alcance.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
| --- | --- | --- |
| Acesso não autorizado a sistemas internos em 14/11 | Comunicado oficial do iFood de 19/11 | Alta |
| Telefone de clientes e usuários do iFood Benefícios | Recorte oficial, sem nome, CPF, e-mail ou endereço associados | Média |
| Telefone e/ou CPF de representantes de parceiros | Comunicado oficial | Alta |
| Dados cadastrais e, em alguns casos, agência e conta de repasse de entregadores | Comunicado oficial; sem endereço, saldos ou extratos | Alta |
| Quantidade de afetados e vetor de acesso | Não divulgados até o comunicado | Alta |

## O que fazer nesta semana

1. Times de privacidade e segurança: conferir se há relação contratual, integração ou cadastro de colaboradores ou entregadores com o iFood e registrar o incidente no inventário de terceiros, com o recorte oficial por perfil. Dono: DPO / segurança da informação.
2. Atendimento e prevenção a fraudes: orientar equipes e públicos expostos a tratar como legítimos apenas os canais oficiais listados pelo iFood e a recusar pedidos de senha, código ou pagamento feitos por telefone, SMS ou e-mail. Dono: atendimento / antifraude.
3. Gestão de identidade e acessos: revisar quais parceiros e aplicações internas leem telefone, CPF e dados de pagamento ou repasse, e se há registro de quem acessou o quê entre 14 e 19 de novembro. Dono: identidade e acessos / dados.
