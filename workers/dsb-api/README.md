# dsb-api

Data Security Briefing queue rules on Cloudflare D1. After cutover it is the only write path to the queue: agents (Grok, Claude), the management app (`dsb-fila`) and the audit app (`dsb-auditor`) all go through it.

## Access

- Domain `dsb-api.duarte.top`, used by the agents only. Without a valid token, 401; without secrets configured, 503.
- No cron of its own (the account is at the cron limit of the free plan).
- Apps: Service Binding with header `x-internal-token` (secret `INTERNAL_TOKEN`) and `x-actor` (Access e-mail or app name).
- Agents: `Authorization: Bearer` with `TOKEN_GROK` or `TOKEN_CLAUDE`. The actor and `added_by` (`grok` / `claude`) come from the token, not the body.

## Rules enforced by the database and the API

| Rule | Where |
|---|---|
| Subject dedup: each CVE and the normalized source URL become unique keys | `post_keys` + `POST /posts` |
| Generic URLs (KEV catalog, "CISA adds" alerts) never become keys and require a CVE | `ignored_url_patterns` |
| A continuation of a subject only enters with `follow_up_of` (same chain) | `POST /posts` |
| A discarded subject only comes back as a follow-up; discarding requires a reason | `POST /posts/:id/status` |
| `published` is only set by the PT blog publication | `POST /publications/:id/result` |
| PT blog requires an approved post with a cover on `covers.duarte.top`, a briefing and a slug | `POST /publications` |
| LinkedIn, X and translations require the PT blog article to be published | `POST /publications` |
| One publication per post, channel and language (two agents never publish the same post) | `UNIQUE` on `publications` |
| BigID competitors: single list and editorial rule read by every agent | `competitors` + `GET /competitors` |
| Pulling a published post back (`removed`): only the queue app (internal token), with a reason; every live channel becomes `removal_pending` until the takedown confirms it; a removed post is never published again and keeps its dedup keys | `POST /posts/:id/status`, `GET /queue/removals`, `POST /publications/:id/result` |

## Values

- Post `status`: `new`, `approved`, `published`, `discarded`, `removed`. `type`: `incident`, `news`, `vulnerability`. `priority`: `normal`, `high`.
- Publication `status`: `pending`, `published`, `failed`, `skipped`, `removal_pending`, `removed`. `channel`: `blog`, `linkedin`, `x`. `lang`: `pt`, `es`, `en`.
- Issue `status`: `open`, `in_progress`, `resolved`, `ignored`. `severity`: `info`, `warning`, `error`, `critical`.

## Issues

No problem stays a bare error in a response:

- **API rejections** become issues (`source = api`) with the payload sent, the agent and a suggested action. The response carries the id in `issue`. The same rejection repeated only increments `occurrences`.
- **Health checks** (`health_checks` + `v_hc_*` views) run on `POST /sweep`, triggered by the `dsb-auditor` cron and at the end of each job (`PATCH /jobs/:id`). What stops happening is resolved automatically.
- **Agent reports** come in through `POST /issues`.
- Closing manually (`resolved` or `ignored`) requires a note. An ignored issue does not reopen.

## Routes

See the comment at the top of `src/index.js`.

## Typical job flow

```
POST /jobs {job}                                   → id
GET  /queue/blog                                   → posts ready to publish
POST /publications {post_id, channel, lang}        → claim (409 if another job took it)
… publish on the channel …
POST /publications/:id/result {status, url | error}
PATCH /jobs/:id {status, items_read, items_written, notes}   → closes the job and sweeps
```

## Database

- Test phase: binding `DB` → `dsb-staging`. At cutover, switch it to the production database.
- `migrations/`: `0001_schema.sql` (posts, keys, publications, events, jobs), `0002_issues.sql` (issues and health checks), `0003_competitors.sql`. On `dsb-staging` they were applied through the D1 API on 2026-11-16; on a new database, apply them with `npx wrangler d1 migrations apply <database> --remote`.
- D1 limits long `LIKE` patterns and compound `SELECT`s with many terms, so generic URLs use `substr`/`instr` and each check is its own view.
- Full Notion load and X backfill: see `load/README.md`.

## Tests

`npm test` at the repository root (or `node --test workers/dsb-api/test/*.test.mjs`). The tests run the whole API on SQLite (`node:sqlite`) with the real migrations.

## Deploy

```
cd workers/dsb-api
npx wrangler secret put INTERNAL_TOKEN
npx wrangler secret put TOKEN_GROK
npx wrangler secret put TOKEN_CLAUDE
npx wrangler deploy
```

## Removal (takedown)

1. The queue app sets `removed` with the reason (`POST /posts/:id/status {to: removed, reason}`, internal token only; agents get `removal_not_allowed` and report a `removal_suggested` issue instead).
2. Every channel row still `published` becomes `removal_pending` (`GET /queue/removals`).
3. The takedown records each channel: `POST /publications/:id/result {status: removed}` or `{status: removal_failed, error}`.
4. The `removal_pending` health check raises an issue for a channel still live after 1 h or after a failed attempt.

On STG the queue app runs the takedown as a dry run (nothing is deleted, the note says so). The live executors (blog commit of the PT/ES/EN files, LinkedIn through Composio, X by hand in the browser) are connected at cutover.
