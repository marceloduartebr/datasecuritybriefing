import { ApiError, nowIso, nz } from './http.js';
import { normalizeUrl } from './rules.js';
import { checkDedup } from './posts.js';

/** Ad hoc curation requests (X-23): open → claimed → done (post_id) | refused (reason). */

const STATUSES = ['open', 'claimed', 'done', 'refused'];
const STALE_CLAIM_DAYS = 2 / 24; // a claim older than 2 h can be taken again (the run died)

const note = (v, field, max) => {
  if (v == null || v === '') return null;
  if (typeof v !== 'string') throw new ApiError(422, 'invalid_value', `${field} must be text`);
  const t = v.trim();
  if (t.length > max) throw new ApiError(422, 'invalid_value', `${field} is longer than ${max} characters`);
  return t || null;
};

/** POST /intake/requests {url, note}. A link already covered by a post is answered at once (409), not queued. */
export async function createRequest(db, body, session) {
  const url = normalizeUrl(body && body.url, 'url');
  const n = note(body && body.note, 'note', 1000);
  const dedup = await checkDedup(db, { sourceUrl: url, cves: [] });
  if (!dedup.free) {
    const c = dedup.collisions[0];
    throw new ApiError(409, c.status === 'discarded' ? 'subject_discarded' : 'subject_already_covered',
      `Link already covered by #${c.id} (${c.status}): ${c.topic}`, { collisions: dedup.collisions });
  }
  const live = await db.prepare(`SELECT id, status FROM intake_requests WHERE url = ?1 AND status IN ('open','claimed')`).bind(url).first();
  if (live) throw new ApiError(409, 'intake_already_open', `Link already waiting as request #${live.id} (${live.status})`, { request_id: live.id });
  return db
    .prepare(`INSERT INTO intake_requests (url, note, requested_by) VALUES (?1, ?2, ?3) RETURNING *`)
    .bind(url, nz(n), session.actor)
    .first();
}

/** GET /intake/requests?status=open,claimed&limit= (default: open and claimed, oldest first). */
export async function listRequests(db, q) {
  const wanted = (q.get('status') || 'open,claimed').split(',').filter((s) => STATUSES.includes(s));
  const list = wanted.length ? wanted : ['open', 'claimed'];
  const limit = Math.min(Math.max(Number(q.get('limit')) || 50, 1), 200);
  const r = await db
    .prepare(`SELECT * FROM intake_requests WHERE status IN (${list.map((_, i) => `?${i + 1}`).join(',')})
              ORDER BY created_at LIMIT ${limit}`)
    .bind(...list)
    .all();
  return r.results || [];
}

/** POST /intake/requests/:id/claim — first come; a claim older than 2 h is taken over (retry: true). */
export async function claimRequest(db, id, session) {
  const before = await db.prepare('SELECT * FROM intake_requests WHERE id = ?1').bind(id).first();
  if (!before) throw new ApiError(404, 'not_found', 'Request not found');
  const now = nowIso();
  const r = await db
    .prepare(
      `UPDATE intake_requests SET status = 'claimed', claimed_by = ?2, claimed_at = ?3, updated_at = ?3
       WHERE id = ?1 AND (status = 'open' OR (status = 'claimed' AND julianday(?3) - julianday(claimed_at) > ${STALE_CLAIM_DAYS}))
       RETURNING *`
    )
    .bind(id, session.actor, now)
    .first();
  if (!r) throw new ApiError(409, 'intake_not_open', `Request #${id} is ${before.status}${before.claimed_by ? ` (${before.claimed_by})` : ''}`, { current_status: before.status });
  return { ...r, retry: before.status === 'claimed' };
}

/** POST /intake/requests/:id/result {status: done, post_id} | {status: refused, reason}. Only the claimer closes it. */
export async function finishRequest(db, id, body, session) {
  const row = await db.prepare('SELECT * FROM intake_requests WHERE id = ?1').bind(id).first();
  if (!row) throw new ApiError(404, 'not_found', 'Request not found');
  if (row.status !== 'claimed') throw new ApiError(409, 'intake_not_claimed', `Request #${id} is ${row.status}; claim it first`, { current_status: row.status });
  if (row.claimed_by !== session.actor) throw new ApiError(409, 'intake_claimed_by_other', `Request #${id} is claimed by ${row.claimed_by}`);
  const status = body && body.status;
  const reason = note(body && body.reason, 'reason', 1000);
  let postId = null;
  if (status === 'done') {
    postId = Number(body.post_id);
    if (!Number.isInteger(postId) || postId <= 0) throw new ApiError(422, 'field_required', 'done requires post_id');
    const p = await db.prepare('SELECT id FROM posts WHERE id = ?1').bind(postId).first();
    if (!p) throw new ApiError(422, 'invalid_reference', `post_id ${postId} does not exist`);
  } else if (status === 'refused') {
    if (!reason) throw new ApiError(422, 'field_required', 'refused requires a reason');
  } else {
    throw new ApiError(422, 'invalid_value', 'status must be done or refused');
  }
  return db
    .prepare(`UPDATE intake_requests SET status = ?2, post_id = ?3, reason = ?4, updated_at = ?5 WHERE id = ?1 RETURNING *`)
    .bind(id, status, nz(postId), nz(reason), nowIso())
    .first();
}
