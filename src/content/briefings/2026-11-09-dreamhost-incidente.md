---
title: "DreamHost: falha no File Manager expôs credenciais de FTP por semanas"
description: "Credenciais de FTP e SFTP ficaram expostas de agosto a 23 de outubro, e o cliente herda a tarefa de descobrir o que havia atrás delas."
pubDate: 2026-11-09T10:24:00-03:00
sourceName: "BleepingComputer"
sourceUrl: "https://www.bleepingcomputer.com/news/security/dreamhost-confirms-data-breach-exposed-ftp-logins-and-webmail-sessions/"
cover: "https://covers.duarte.top/covers/20261104-dreamhost-incidente.jpg"
tipo: incidente
pais: us
tags: ["vazamento", "credenciais", "terceiros", "hospedagem", "eua"]
notionUrl: "https://www.notion.so/40e17411747381efb7ccca9c3f543346"
---

Em uma linha: trocar a senha encerra o acesso, mas não responde o que saiu durante a janela.

## O que aconteceu
Em 4 de novembro de 2026, o BleepingComputer informou que a DreamHost confirmou uma violação no File Manager, seu gerenciador de arquivos web. Um atacante explorou uma falha no software e obteve usuários e senhas de FTP/SFTP de quem fez login na ferramenta entre aproximadamente agosto de 2026 e 23 de outubro. Informações de sessão do webmail, incluindo credenciais, podem ter sido expostas para um número limitado de usuários. A DreamHost encerrou sessões ativas, invalidou senhas e tirou os servidores do File Manager do ar. A empresa não informou ao veículo quantas contas foram afetadas.

## Por que importa
Uma credencial de FTP dá acesso de leitura e escrita ao site do cliente: código, arquivos de configuração com senhas de banco, backups e exportações esquecidas no servidor. A recomendação de revisar os arquivos em busca de alterações pressupõe que o cliente saiba o que estava armazenado ali, o que raramente acontece.

## Leitura de risco
| Vetor | Evidência pública | Gravidade |
|---|---|---|
| Roubo de credenciais FTP/SFTP | Confirmado pela DreamHost (BleepingComputer) | Alta |
| Exposição de sessões de webmail | Possível, para número limitado de usuários | Média |
| Adulteração ou exfiltração de arquivos de sites | Não confirmada; depende de cada cliente | A confirmar |

## O que fazer nesta semana
1. Inventariar os arquivos hospedados em provedores externos, com atenção a backups, exportações e arquivos de configuração com segredos — dono: time de aplicações web.
2. Revisar regras de encaminhamento e filtros de webmail e rotacionar segredos encontrados em arquivos de configuração — dono: TI e segurança.
3. Sinal de que funcionou: para cada credencial de terceiro, existe uma lista dos dados pessoais e segredos acessíveis por ela.