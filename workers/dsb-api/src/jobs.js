import { ApiError, nowIso, nz } from './http.js';

export async function startJob(db, body, session) {
  const job = typeof body.job === 'string' ? body.job.trim().slice(0, 80) : '';
  if (!/^[a-z0-9][a-z0-9:_-]*$/i.test(job)) throw new ApiError(422, 'invalid_value', 'job must be a short name (e.g. blog-publish-11h)');
  return db
    .prepare(`INSERT INTO job_runs (job, agent, status) VALUES (?1, ?2, 'running') RETURNING *`)
    .bind(job, session.actor)
    .first();
}

/** Closes a job run as ok, error or skipped. error requires notes. */
export async function finishJob(db, id, body) {
  const status = body.status;
  if (!['ok', 'error', 'skipped'].includes(status)) throw new ApiError(422, 'invalid_value', 'status must be ok, error or skipped');
  const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 2000) : null;
  if (status === 'error' && !notes) throw new ApiError(422, 'field_required', 'error requires notes with the reason');
  const num = (v) => (v == null ? null : Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : null);
  const r = await db
    .prepare(
      `UPDATE job_runs SET status = ?2, finished_at = ?3, items_read = ?4, items_written = ?5, notes = ?6
       WHERE id = ?1 AND status = 'running' RETURNING *`
    )
    .bind(id, status, nowIso(), nz(num(body.items_read)), nz(num(body.items_written)), nz(notes))
    .first();
  if (!r) {
    const row = await db.prepare('SELECT status FROM job_runs WHERE id = ?1').bind(id).first();
    if (!row) throw new ApiError(404, 'not_found', 'Job not found');
    throw new ApiError(409, 'job_already_finished', `Job is already ${row.status}`);
  }
  return r;
}
