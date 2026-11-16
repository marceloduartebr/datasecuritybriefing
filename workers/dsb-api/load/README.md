# Notion → D1 full load

Used during the test phase (dsb-staging) and repeated at cutover. Idempotent: deletes the data and rewrites it with stable ids.

1. Export the Notion queue to `notion.json` (list of rows with the columns of collection `d69d8348-…`, including Post Text and Briefing MD).
2. `python3 transform.py notion.json` → `load.json`. Notion values (Status, Tipo, Priority, Added By) are mapped to the English enums; an unknown value stops the load. Every special case becomes an issue with `stage=load`.
3. `CF_D1=<token with D1 Edit> python3 write.py` → writes and prints the reconciliation by status and channel.
4. Run `POST /sweep` on dsb-api.

`notion.json`, `load.json` and the X files hold queue content: do not commit them.

## X backfill

5. Collect the @DSBriefing timeline into `x_timeline.json` (see `x_match.py`).
6. `python3 x_match.py` → `x_match.json` (tweet ↔ briefing by the link card title).
7. `CF_D1=… python3 write_x.py` → X published with the tweet URL; blog articles before 2026-10-28 become X skipped; the rest stays in the X queue. Re-enables the `x_overdue` check.

## Nightly STG sync

`.github/workflows/stg-sync.yml` repeats steps 1–4 every night at 23:23 BRT (and on demand with "Run workflow"):
`export_notion.py` (Notion REST, read-only, ~2 requests) → `transform.py` → `write.py` (`JOB_NAME=notion-stg-sync`). The sweep runs when the STG auditor panel opens (GitHub runners get 403 from Cloudflare's bot protection).

- X publications survive the reload: `write.py` saves them by PT blog article URL (falling back to the Notion page id) and restores them on the reloaded posts. `write_x.py` resolves posts from the database the same way. New X posts after the backfill still need `x_match.py` + `write_x.py`.
- Anything created only on STG (test posts, issues, job runs) is replaced by the Notion state on each run.
- Repository secrets: `STG_NOTION_TOKEN`, `STG_D1_TOKEN`.
- The schedule only runs from the default branch, so the workflow file lives on `main`; it checks out this branch for the scripts and `main` for the blog content.
