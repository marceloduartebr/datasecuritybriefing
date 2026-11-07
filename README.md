# Data Security Briefing

Blog estático (Astro) do arquivo de mercado. Fila LinkedIn continua no Notion — este repo só publica briefings.

## Cloudflare Pages

- Framework preset: Astro
- Build: `npm run build`
- Output: `dist`
- Branch: `main`

## Web Push agendado

O envio que roda hoje continua no bot: `scripts/push/apos-publicar.mjs`. O Worker em `workers/push-agenda/` está preparado e **desligado** (sem cron, sem envio). Corte, simulação e rollback: `workers/push-agenda/RUNBOOK.md`.
