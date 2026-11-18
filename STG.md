# STG branch

STG blog for the DSB STG tests (dsb-api-stg), at https://dsb-stg.duarte.top (Worker `dsb-stg`, Workers Builds on this branch,
`wrangler deploy --env stg` from this branch). The old preview alias still builds:
https://stg-datasecuritybriefing.marceloduarte.workers.dev

- Never merged into `main`. The `dsb-stg-publish` skill commits dry-run briefings here only.
- STG-only commit: noindex meta, `robots.txt` Disallow all, STG banner, push API returns 404.
- Rebased on `origin/main` before each blog run so the preview matches the live site's code.
