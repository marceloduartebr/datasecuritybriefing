---
title: "Ransomware na ICN: sistemas cifrados não são a mesma coisa que dados roubados"
description: "A estatal que constrói os submarinos da Marinha teve e-mail, arquivos e bancos cifrados em 9 de agosto. Mais de duas semanas depois, o público ainda não sabe se houve exfiltração."
pubDate: 2026-08-29T16:47:00-03:00
sourceName: "Jornal Atual"
sourceUrl: "https://jornalatual.com.br/ataque-cibernetico-icn"
cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Submarino_Riachuelo_%28S40%29_%2852816921064%29_%28cropped%29.jpg/1280px-Submarino_Riachuelo_%28S40%29_%2852816921064%29_%28cropped%29.jpg"
tags: ["vazamento", "ransomware", "brasil", "infraestrutura-critica"]
notionUrl: "https://www.notion.so/3c81741174738152a21be80d0628ec3d"
---

**Em uma linha:** a ICN confirmou sistemas cifrados; não confirmou se algum dado saiu.

## O que aconteceu

Na madrugada de 9 de agosto de 2026, a Itaguaí Construções Navais — joint venture do Programa de Desenvolvimento de Submarinos (Prosub), em parceria com a Naval Group — teve servidores de e-mail, sistemas internos, armazenamento de arquivos e bancos de dados cifrados. O site institucional saiu do ar.

Dias depois, o grupo LockBit reivindicou a autoria em site de vazamentos. Até a publicação deste briefing, a ICN não confirmou publicamente exfiltração nem impacto no cronograma dos submarinos convencionais ou do submarino nuclear. A empresa disse ter mobilizado TI e firmas especializadas para investigar e restaurar sistemas.

Reivindicação em leak site não é confirmação da vítima.

## Por que importa

Cifrar um arquivo impede o acesso. Exfiltrar um arquivo significa que a cópia já está fora do seu controle, pague-se resgate ou não. Imprensa e, com frequência, a própria empresa tratam as duas coisas como sinônimo.

Em defesa, energia e infraestrutura o padrão se repete: controle físico e de rede relativamente forte; pouca visibilidade sobre onde o dado sensível estava *dentro* dos sistemas que acabaram cifrados. Sem esse mapa, “não há evidência de exfiltração” é esperança, não constatação.

## Leitura de risco

| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Disponibilidade (sistemas cifrados) | Confirmado pela empresa / cobertura | Alta |
| Exfiltração | Só reivindicação em leak site | Indeterminada |
| Impacto no Prosub | Não confirmado | Indeterminada |

## O que fazer nesta semana

1. Separar no playbook as perguntas “os sistemas voltaram?” e “o que existia ali e se algo saiu?” — dono: SecOps + dono do dado.
2. Exigir evidência de inventário (sistema, tipo de dado, volume) *antes* de assinar comunicado de “sem evidência de vazamento” — dono: DPO / jurídico.
3. Sinal de que funcionou: conseguir listar, em horas, os repositórios atingidos e o dado que eles guardavam.
