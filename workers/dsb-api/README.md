# dsb-api

Regras da fila do Data Security Briefing sobre o Cloudflare D1. Depois do cutover, é o único caminho de escrita na fila: agentes (Grok, Claude), o app de gestão (`dsb-fila`) e o app de auditoria (`dsb-auditor`) passam por aqui.

## Acesso

- Sem rota pública e sem cron próprio (a conta está no limite de crons do plano free).
- Apps: Service Binding com header `x-interno-token` (secret `INTERNO_TOKEN`) e `x-ator` (e-mail do Access ou nome do app).
- Agentes: `Authorization: Bearer` com `TOKEN_GROK` ou `TOKEN_CLAUDE`. O ator e o `added_by` vêm do token, não do corpo.
- Sem nenhum secret configurado, tudo responde 503.

## Regras que o banco e a API garantem

| Regra | Onde |
|---|---|
| Dedup por assunto: cada CVE e a URL normalizada da fonte viram chaves únicas | `post_keys` + `POST /posts` |
| URLs genéricas (catálogo KEV, alertas "CISA adds") não viram chave; exigem CVE | `ignored_url_patterns` |
| Continuação de um assunto só com `follow_up_of` (mesma cadeia) | `POST /posts` |
| Assunto descartado só volta como follow-up; descarte exige motivo | `POST /posts/:id/status` |
| `Publicado` só nasce da publicação do blog PT | `POST /publicacoes/:id/resultado` |
| Blog PT exige item Aprovado com capa em `covers.duarte.top`, briefing e slug | `POST /publicacoes` |
| LinkedIn, X e traduções exigem blog PT publicado | `POST /publicacoes` |
| Uma publicação por item, canal e idioma (dois agentes não publicam o mesmo item) | `UNIQUE` em `publications` |

## Pendências

Nenhum problema fica só como erro na resposta:

- **Recusas da API** viram pendência (`source = api`) com o corpo enviado, o agente e a ação sugerida. A resposta traz o número em `pendencia`. A mesma recusa repetida só incrementa `occurrences`.
- **Verificações de saúde** (`health_checks` + views `v_hc_*`) rodam em `POST /varrer`, disparado pelo cron do `dsb-auditor` e ao fim de cada job (`PATCH /jobs/:id`). O que deixa de ocorrer fecha sozinho.
- **Relatos de agentes** entram por `POST /pendencias`.
- Fechar manualmente (`resolvido` ou `ignorado`) exige nota. Ignorada não reabre.

## Rotas

Ver o comentário no topo de `src/index.js`.

## Fluxo típico de um job

```
POST /jobs {job}                              → id
GET  /fila/blog                               → itens prontos
POST /publicacoes {post_id, canal, idioma}    → reserva (409 se outro job já pegou)
… publica no canal …
POST /publicacoes/:id/resultado {status, url | erro}
PATCH /jobs/:id {status, items_read, items_written, notes}   → fecha o job e varre
```

## Banco

- Fase de testes: binding `DB` → `dsb-staging`. No cutover, trocar para a base de produção.
- `migrations/` tem o schema v2 e as pendências. Na `dsb-staging` elas foram aplicadas à mão em 16/11/2026; numa base nova, aplicar com `npx wrangler d1 migrations apply <base> --remote`.
- O D1 limita padrões `LIKE` longos e `UNION` com muitos termos: por isso as URLs genéricas usam `substr`/`instr` e cada verificação é uma view própria.

## Testes

`npm test` na raiz do repositório (ou `node --test workers/dsb-api/test/*.test.mjs`). Os testes rodam a API inteira sobre SQLite (`node:sqlite`) com as migrations reais.

## Deploy

```
cd workers/dsb-api
npx wrangler secret put INTERNO_TOKEN
npx wrangler secret put TOKEN_GROK
npx wrangler secret put TOKEN_CLAUDE
npx wrangler deploy
```
