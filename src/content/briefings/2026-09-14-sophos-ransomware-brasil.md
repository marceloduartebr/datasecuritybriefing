---
title: "Sophos: resgate mediano no Brasil sobe 63% e chega a US$ 640 mil"
description: "Pedido mediano de ransomware no Brasil atinge US$ 640 mil em 2025; pagamento cai para 45% e 74% dos casos passam por identidade."
pubDate: 2026-09-14T10:20:00-03:00
sourceName: "Estadão / Sophos"
sourceUrl: "https://www.estadao.com.br/tecmundo/ciberseguranca/resgates-ransomware-sobem-no-brasil/"
cover: "https://covers.duarte.top/covers/20260909-sophos-ransomware-brasil.jpg"
pais: br
tipo: noticia
tags: ["ransomware", "identidade", "brasil", "backup"]
notionUrl: "https://www.notion.so/3d617411747381ce9c4dca448de9d24a"
---

Em uma linha: o pedido mediano sobe, o pagamento cai, e o vetor deixa de ser falha técnica para ser credencial.

## O que aconteceu

Em 9/09/2026 o Estadão publicou recorte do relatório anual da Sophos sobre ransomware no Brasil (dados de 2025). O valor mediano exigido chegou a US$ 640 mil (cerca de R$ 3,27 milhões), alta de 63%. O Brasil liderou o ranking global de invasões iniciadas por e-mail (37% dos casos). Exploração de falhas técnicas caiu de 44% para 24%. Em 74% das organizações atingidas o golpe teve ligação com identidade e roubo de credencial. A parcela que pagou o resgate recuou de 66% para 45%. 85% das vítimas recorreram a backup para recuperar arquivos, contra 73% no levantamento anterior.

## Por que importa

Backup isolado não é o mesmo que plano de continuidade testado. Dupla extorsão continua pressionando pelo dado, não só pela indisponibilidade. O nexo local é inventário de identidade — conta de serviço, token de backup e admin do diretório — e evidência de restauração, não só política escrita.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Identidade / credencial | 74% dos atingidos ligaram o golpe a esse vetor (Sophos / Estadão) | Alta |
| E-mail malicioso | Brasil em 1º no ranking global; 37% dos casos | Alta |
| Falha técnica | Recuo de 44% para 24% | Média |
| Continuidade / backup | 85% restauraram por cópia; maturidade (isolamento, teste, RTO) não medida | Indeterminada |

## O que fazer nesta semana

1. Mapear contas de serviço e credenciais de backup fora do mesmo diretório de produção — dono: identidade / IAM.
2. Rodar um teste de restauração de ponta a ponta com RTO anotado — dono: continuidade.
3. Sinal de que funcionou: o time consegue dizer, sem abrir ticket, qual credencial abre o backup e se ela sobrevive a um comprometimento do AD.
