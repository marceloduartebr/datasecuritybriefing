import { ApiError, nowIso, nz } from './http.js';

const SEVERITIES = ['info', 'warning', 'error', 'critical'];
const STAGES = ['curation', 'review', 'cover', 'approval', 'blog', 'linkedin', 'x', 'job', 'load', 'api'];
const OPEN = `('open','in_progress')`;

const UPSERT = `
INSERT INTO issues (fingerprint, source, check_name, kind, severity, stage, post_id, publication_id,
                    job_run_id, agent, summary, detail, suggested_action, first_seen_at, last_seen_at)
VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?14)
ON CONFLICT(fingerprint) WHERE status IN ${OPEN} DO UPDATE SET
  occurrences = occurrences + 1,
  last_seen_at = excluded.last_seen_at,
  severity = excluded.severity,
  summary = excluded.summary,
  detail = COALESCE(excluded.detail, detail)
RETURNING id, occurrences, status`;

/**
 * Records (or increments) an issue reported by the API or by an agent.
 * An ignored issue is not reopened by the same fingerprint.
 */
export async function record(db, p) {
  if (!SEVERITIES.includes(p.severity)) throw new ApiError(422, 'invalid_value', `severity must be one of: ${SEVERITIES.join(', ')}`);
  if (!STAGES.includes(p.stage)) throw new ApiError(422, 'invalid_value', `stage must be one of: ${STAGES.join(', ')}`);
  if (!p.fingerprint || !p.kind || !p.summary) throw new ApiError(422, 'field_required', 'fingerprint, kind and summary are required');
  const ignored = await db
    .prepare(`SELECT id FROM issues WHERE fingerprint = ?1 AND status = 'ignored' LIMIT 1`)
    .bind(p.fingerprint)
    .first();
  if (ignored) return { id: ignored.id, status: 'ignored', ignored: true };
  return db
    .prepare(UPSERT)
    .bind(
      String(p.fingerprint).slice(0, 300),
      p.source,
      nz(p.check_name),
      String(p.kind).slice(0, 80),
      p.severity,
      p.stage,
      nz(p.post_id),
      nz(p.publication_id),
      nz(p.job_run_id),
      nz(p.agent),
      String(p.summary).slice(0, 500),
      p.detail == null ? null : (typeof p.detail === 'string' ? p.detail : JSON.stringify(p.detail)).slice(0, 8000),
      nz(p.suggested_action),
      nowIso()
    )
    .first();
}

/** A write rejected by the API becomes an issue (source = api). Never breaks the original response. */
export async function recordRejection(db, { error, route, session, body, postId = null }) {
  try {
    const target = error.extra && error.extra.key ? error.extra.key : postId != null ? `post:${postId}` : route;
    const r = await record(db, {
      fingerprint: `api:${error.code}:${target}`.slice(0, 300),
      source: 'api',
      kind: `rejected_${error.code}`,
      severity: error.status >= 500 ? 'error' : 'warning',
      stage: stageOfRoute(route),
      post_id: postId,
      agent: session ? session.actor : null,
      summary: `${route}: ${error.message}`,
      detail: { code: error.code, extra: error.extra || null, body: summarizeBody(body) },
      suggested_action: suggestedAction(error.code)
    });
    return r ? r.id : null;
  } catch {
    return null;
  }
}

function stageOfRoute(route) {
  if (route.includes('/status')) return 'approval';
  if (route.startsWith('POST /posts')) return 'curation';
  if (route.includes('/publications')) return 'blog';
  if (route.includes('/jobs')) return 'job';
  return 'api';
}

function suggestedAction(code) {
  return (
    {
      subject_already_covered: 'Do not insert it again; if there is a new fact, send it as follow_up_of the existing post',
      subject_discarded: 'Subject already discarded; only resend it as follow_up_of with a new fact',
      slug_taken: 'Generate another slug',
      missing_key: 'Send the CVEs of the post or a specific article URL',
      missing_cover: 'Run dsb-covers before publishing to the blog',
      blog_not_published: 'Publish the PT blog article before the derived channel',
      invalid_transition: 'Check the current status of the post before changing it',
      cover_host_invalid: 'Upload the cover to covers.duarte.top',
      publication_already_claimed: 'Another job already claimed or completed this publication; do not repeat it',
      removal_not_allowed: 'Only the queue app removes published posts; report the post as an issue (kind removal_suggested)',
      post_removed: 'The post was removed; do not publish it on any channel'
    }[code] || 'Check the data sent and retry the operation'
  );
}

function summarizeBody(body) {
  if (!body || typeof body !== 'object') return null;
  const out = {};
  for (const [k, v] of Object.entries(body)) out[k] = typeof v === 'string' && v.length > 300 ? `${v.slice(0, 300)}… (${v.length} chars)` : v;
  return out;
}

const FILTERS = ['status', 'severity', 'stage', 'source', 'kind', 'post_id'];

export async function list(db, params) {
  const where = [];
  const binds = [];
  for (const col of FILTERS) {
    const v = params.get(col);
    if (v == null || v === '') continue;
    const values = v.split(',').map((x) => x.trim()).filter(Boolean).slice(0, 10);
    where.push(`${col} IN (${values.map(() => '?').join(',')})`);
    binds.push(...values.map((x) => (col === 'post_id' ? Number(x) : x)));
  }
  if (!params.get('status')) where.push(`status IN ${OPEN}`);
  const limit = Math.min(Math.max(Number(params.get('limit')) || 100, 1), 500);
  const sql = `SELECT * FROM issues ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY CASE severity WHEN 'critical' THEN 0 WHEN 'error' THEN 1 WHEN 'warning' THEN 2 ELSE 3 END, last_seen_at DESC
    LIMIT ${limit}`;
  const r = await db.prepare(sql).bind(...binds).all();
  return r.results || [];
}

export async function summary(db) {
  const r = await db
    .prepare(
      `SELECT stage, severity, COUNT(*) AS n FROM issues WHERE status IN ${OPEN}
       GROUP BY stage, severity ORDER BY stage, severity`
    )
    .all();
  return r.results || [];
}

const FINAL = ['resolved', 'ignored'];

/** Manual handling: in_progress, resolved or ignored (the last two require a note). */
export async function update(db, id, body, session) {
  const to = body.status;
  if (!['open', 'in_progress', 'resolved', 'ignored'].includes(to)) throw new ApiError(422, 'invalid_value', 'status must be open, in_progress, resolved or ignored');
  const note = typeof body.resolution === 'string' ? body.resolution.trim().slice(0, 1000) : '';
  if (FINAL.includes(to) && !note) throw new ApiError(422, 'note_required', 'Resolving or ignoring requires a note (resolution)');
  const current = await db.prepare('SELECT * FROM issues WHERE id = ?1').bind(id).first();
  if (!current) throw new ApiError(404, 'not_found', 'Issue not found');
  if (FINAL.includes(current.status)) throw new ApiError(409, 'issue_closed', `Issue is already ${current.status}`);
  const r = await db
    .prepare(
      `UPDATE issues SET status = ?2,
         resolved_at = CASE WHEN ?2 IN ('resolved','ignored') THEN ?3 ELSE NULL END,
         resolved_by = CASE WHEN ?2 IN ('resolved','ignored') THEN ?4 ELSE NULL END,
         resolution  = CASE WHEN ?2 IN ('resolved','ignored') THEN ?5 ELSE resolution END
       WHERE id = ?1 AND status = ?6 RETURNING *`
    )
    .bind(id, to, nowIso(), session.actor, note || null, current.status)
    .first();
  if (!r) throw new ApiError(409, 'conflict', 'The issue changed while it was being updated; read it again');
  return r;
}

export async function markNotified(db, ids) {
  const items = (Array.isArray(ids) ? ids : []).map(Number).filter(Number.isInteger).slice(0, 200);
  if (!items.length) return 0;
  const r = await db
    .prepare(`UPDATE issues SET notified_at = ?1 WHERE id IN (${items.map((_, i) => `?${i + 2}`).join(',')}) AND notified_at IS NULL`)
    .bind(nowIso(), ...items)
    .run();
  return (r.meta && r.meta.changes) || 0;
}

const VIEW_OK = /^v_hc_[a-z_]+$/;

/**
 * Sweep: opens/updates what the checks find and closes what stopped happening.
 * Only closes issues of checks that ran without error in this sweep.
 */
export async function sweep(db) {
  const started = nowIso();
  const checks = (await db.prepare('SELECT name, view_name FROM health_checks WHERE enabled = 1 ORDER BY name').all()).results || [];
  const out = { started_at: started, checks: 0, opened_or_seen: 0, resolved: 0, failures: [] };
  for (const c of checks) {
    if (!VIEW_OK.test(c.view_name)) {
      out.failures.push({ check: c.name, error: 'invalid view_name' });
      continue;
    }
    try {
      const ins = await db
        .prepare(
          `INSERT INTO issues (fingerprint, source, check_name, kind, severity, stage, post_id, publication_id,
                               summary, suggested_action, first_seen_at, last_seen_at)
           SELECT h.fingerprint, 'health', ?1, h.kind, h.severity, h.stage, h.post_id, h.publication_id,
                  h.summary, h.suggested_action, ?2, ?2
           FROM ${c.view_name} h
           WHERE NOT EXISTS (SELECT 1 FROM issues i WHERE i.fingerprint = h.fingerprint AND i.status = 'ignored')
           ON CONFLICT(fingerprint) WHERE status IN ${OPEN} DO UPDATE SET
             occurrences = occurrences + 1, last_seen_at = excluded.last_seen_at,
             severity = excluded.severity, summary = excluded.summary`
        )
        .bind(c.name, started)
        .run();
      const fix = await db
        .prepare(
          `UPDATE issues SET status = 'resolved', resolved_at = ?2, resolved_by = 'auto',
                  resolution = 'Condition no longer occurs'
           WHERE source = 'health' AND check_name = ?1 AND status IN ${OPEN} AND last_seen_at < ?2`
        )
        .bind(c.name, started)
        .run();
      out.checks++;
      out.opened_or_seen += (ins.meta && ins.meta.changes) || 0;
      out.resolved += (fix.meta && fix.meta.changes) || 0;
    } catch (e) {
      out.failures.push({ check: c.name, error: String((e && e.message) || e).slice(0, 200) });
    }
  }
  return out;
}
