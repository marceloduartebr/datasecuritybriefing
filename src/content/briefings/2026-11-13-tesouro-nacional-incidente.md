---
title: "Tesouro Nacional confirma acesso não autorizado a 30 mil cadastros e 4 mil chaves Pix"
description: "Acesso detectado em 4 de novembro expôs nomes, CPFs e e-mails do e-Serviços e chaves Pix de beneficiários de pagamentos federais; comunicado em 12/11, sem impacto financeiro."
pubDate: 2026-11-13T10:18:00-03:00
sourceName: "Agência Brasil"
sourceUrl: "https://agenciabrasil.ebc.com.br/geral/noticia/2026-11/tesouro-nacional-identifica-vazamento-de-dados-de-30-mil-cadastros"
cover: "https://covers.duarte.top/covers/20261113-tesouro-nacional-incidente.jpg"
tipo: incidente
tags: ["vazamento", "governo", "pix", "lgpd", "brasil"]
pais: br
notionUrl: "https://www.notion.so/41717411747381989141d24de162b050"
---

Em uma linha: O Tesouro Nacional detectou acesso não autorizado a 30 mil cadastros e 4 mil chaves Pix de beneficiários de pagamentos federais e só comunicou publicamente oito dias depois.

## O que aconteceu

Em 4 de novembro de 2026 a Secretaria do Tesouro Nacional identificou acesso não autorizado a dados pessoais em seu ambiente tecnológico. O caso foi comunicado publicamente na noite de 12 de novembro. Foram acessados nomes, CPFs e endereços de e-mail de aproximadamente 30 mil usuários do portal e-Serviços. Uma base de consultas analíticas internas também foi atingida, expondo cerca de 4 mil chaves Pix de beneficiários de pagamentos do governo federal e dados relacionados às transações. O órgão notificou a ANPD e o CTIR Gov. Não houve impacto financeiro e nenhum sistema estruturante foi comprometido. Contenção ocorreu via mecanismos de monitoramento; investigação técnica sobre origem e extensão está em andamento.

## Por que importa

O intervalo entre detecção e comunicação pública mostra o tempo necessário para confirmar o fato, conter e começar a inventariar o que saiu. Notificar titular e autoridade com precisão exige mapa registro a registro: quais identidades, de quais bases, com qual sobreposição. Uma chave Pix de beneficiário de pagamento federal não é dado cadastral genérico — ela vincula a pessoa a uma transferência já realizada. Sem esse inventário, a resposta fica no nível da política e não chega à evidência de quem precisa ser alertado.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Acesso a base de cadastros (e-Serviços) | ~30 mil nomes, CPFs e e-mails | Alta |
| Acesso a base analítica com chaves Pix | ~4 mil chaves e dados de pagamentos federais | Alta |
| Tempo de comunicação pública | 8 dias após detecção | Média |
| Impacto financeiro / sistemas estruturantes | Negado pelo órgão | Indeterminada |

## O que fazer nesta semana

1. Confirmar se o inventário de dados pessoais e de chaves de pagamento cobre as bases de portal de serviços e de consultas analíticas internas — DPO / time de dados.
2. Testar o tempo entre detecção de acesso anômalo e a lista de identidades alcançadas — SOC / resposta a incidentes.
3. Validar se o processo de notificação à ANPD e aos titulares tem o mapa registro a registro pronto em menos de 48 horas — Governança.
