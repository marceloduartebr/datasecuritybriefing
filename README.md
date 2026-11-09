# Data Security Briefing

Blog estático (Astro) do arquivo de mercado. Fila LinkedIn continua no Notion — este repo só publica briefings.

## Deploy (Cloudflare Workers Builds)

O site é o Worker **`datasecuritybriefing`** (Astro → `dist` + `worker/index.js` para `/api/push/*`), implantado por **Cloudflare Workers Builds** ligado ao GitHub — **não** é Cloudflare Pages clássico.

- Build: `npm run build`
- Output: `dist` (assets do Worker)
- Branch: `main`
- Domínio: `https://dsb.duarte.top`

Cada push em `main` dispara o check **Workers Builds: datasecuritybriefing**.

## Web Push

Envio em produção no Worker **`dsb-push-agenda`** (`workers/push-agenda/`).

- **Disparo por evento (principal):** workflow `.github/workflows/push-evento.yml` após o deploy, se a variável do repo `EVENTO_PUSH` for `on`.
- **Fallback:** cron do Worker nos dias úteis às 11:25 e 19:25 em `America/Sao_Paulo` (UTC `25 14,22 * * 1-5`).
- Dedupe **por destinatário** no Durable Object; a rotina antiga do box (`push-dsb-novas-publica-es` / `scripts/push/apos-publicar.mjs`) permanece **pausada** e não deve ser religada sem reconciliar dedupe.

Operação, travas, teste isolado e rollback: `workers/push-agenda/RUNBOOK.md`.
