# dsb-auditor

Worker de auditoria do DSB, **só leitura**. Substituirá as rotinas de aviso do Grok Bot
(Curadoria 8:30, Check fila 9:50, LinkedIn 10:15/18:15, Blog 11:15/19:15) depois de 1 semana em paralelo.
Nunca publica, nunca grava no Notion, nunca faz fan-out de push.

- URL: `https://dsb-auditor.marceloduarte.workers.dev` (domínio: `https://dsb-auditor.duarte.top`)
- Cron (1 trigger): `15,30,50 11-22 * * 1-5` UTC. O código só roda em 08:30, 09:50, 10:15, 11:15, 18:15 e 19:15 (Brasília); os outros ticks saem sem rede.
- KV próprio: `DSB_AUDITOR` (`ultimo`, `historico` com as 30 últimas). 2 gravações por execução.
- Service Binding `PUSH_AGENDA` → `dsb-push-agenda`, só `GET /health` (e `/admin/status` se `PUSH_ADMIN_TOKEN` existir).

## Endpoints

| Método | Caminho | Auth | O que faz |
|---|---|---|---|
| GET | `/health` | pública | `{ok:true}` |
| GET | `/painel` | Cloudflare Access JWT **ou** Bearer | HTML do status (só lê KV; não dispara rede/push). Sem Access e sem bearer → **404** |
| GET | `/status` | Bearer `AUDITOR_TOKEN` | última execução + histórico |
| GET | `/capas-faltando` | Bearer | itens da fila (Novo/Aprovado) e briefings de hoje sem capa válida |
| POST | `/rodar` | Bearer | roda a auditoria agora (sem alerta se `ALERTAS=off`) |

## Checagens

- Blog: catálogo `/push/catalogo.json`, briefings com prefixo de hoje (até 5): HEAD 200 em PT/ES/EN (`/…/briefings/<slug>/`) e capa do frontmatter (GitHub raw) com HEAD 200 em `covers.duarte.top/covers/`.
- GitHub: últimos 5 commits de `main` (API; se 403, feed Atom público) e última execução do `push-evento`.
- Push: `dsb-push-agenda` `/health`.
- Notion (`NOTION=on`, secret `NOTION_TOKEN`, integração "DSB Auditor", API `2025-09-03`, data source `d69d8348-…`): itens adicionados hoje, Novo/Aprovado com capa inválida ou sem HEAD 200 (até 12), Publicado hoje sem `urn:li:` em Publish Notes. Só consultas `POST /query`.

Orçamento: ≤ 45 subrequests externas por execução (Free = 50).

## Chaves

- `ALERTAS` (var): `on` (ligado em 09/11/2026). Com `on`, uma execução com problemas chama `POST /admin/alerta` do `dsb-push-agenda` pelo Service Binding, com o secret `ALERTA_TOKEN`. Os destinos não saem do auditor: a allowlist (2 inscrições do Marcelo) fica fixa no `dsb-push-agenda`. O mesmo conjunto de problemas não se repete no mesmo dia (KV `alerta:ultimo`). `ALERTA_OK_DIARIO=on` manda um "tudo certo" às 19:15 (só nesse slot; no máx. 1×/dia pela mesma chave KV).
- `NOTION` (var): `on`/`off`.
- Secrets: `AUDITOR_TOKEN`, `NOTION_TOKEN`, `ALERTA_TOKEN`; opcionais `GITHUB_TOKEN`, `PUSH_ADMIN_TOKEN`.

## Operar

```sh
cd workers/auditor
npx wrangler@4 deploy                 # publica (mantém o cron)
npx wrangler@4 tail dsb-auditor       # logs
node --test test/                     # testes
```

Desligar tudo: tirar `triggers.crons` (lista vazia remove o cron no deploy) ou `npx wrangler delete dsb-auditor`.

## Painel (`/painel`)

HTML mobile-friendly em português, horários em Brasília. Lê só o KV (`ultimo` + `alerta:ultimo`); **não** refaz checagens nem manda push.

**Proteção (antes do Cloudflare Access):** a página responde **404** sem autenticação. Com Bearer `AUDITOR_TOKEN` (header `Authorization`, nunca query/cookie) libera para checagens internas.

**Com Access:** vars `ACCESS_TEAM` (`https://<time>.cloudflareaccess.com`) e `ACCESS_AUD` (AUD tag do app). O Worker valida o header `Cf-Access-Jwt-Assertion` contra o JWKS do time. Bearer continua válido.

App self-hosted Zero Trust no path `/painel` dos hostnames `dsb-auditor.marceloduarte.workers.dev` e `dsb-auditor.duarte.top` (time `royal-lake-6796`). Login por One-time PIN. Não cobrir o host inteiro — `/health`, `/status`, `/capas-faltando` e `/rodar` precisam ficar públicos para o cron e as checagens da box.
