import { ErroApi, agoraIso, nz } from './http.js';

export async function iniciarJob(db, corpo, sessao) {
  const job = typeof corpo.job === 'string' ? corpo.job.trim().slice(0, 80) : '';
  if (!/^[a-z0-9][a-z0-9:_-]*$/i.test(job)) throw new ErroApi(422, 'dado_invalido', 'job deve ser um nome curto (ex.: blog-publish-11h)');
  return db
    .prepare(`INSERT INTO job_runs (job, agent, status) VALUES (?1, ?2, 'running') RETURNING *`)
    .bind(job, sessao.ator)
    .first();
}

/** Fecha o registro do job: ok, error ou skipped. error exige notes. */
export async function finalizarJob(db, id, corpo) {
  const status = corpo.status;
  if (!['ok', 'error', 'skipped'].includes(status)) throw new ErroApi(422, 'dado_invalido', 'status deve ser ok, error ou skipped');
  const notes = typeof corpo.notes === 'string' ? corpo.notes.trim().slice(0, 2000) : null;
  if (status === 'error' && !notes) throw new ErroApi(422, 'campo_obrigatorio', 'error exige notes com o motivo');
  const num = (v) => (v == null ? null : Number.isFinite(Number(v)) ? Math.trunc(Number(v)) : null);
  const r = await db
    .prepare(
      `UPDATE job_runs SET status = ?2, finished_at = ?3, items_read = ?4, items_written = ?5, notes = ?6
       WHERE id = ?1 AND status = 'running' RETURNING *`
    )
    .bind(id, status, agoraIso(), nz(num(corpo.items_read)), nz(num(corpo.items_written)), nz(notes))
    .first();
  if (!r) {
    const existe = await db.prepare('SELECT status FROM job_runs WHERE id = ?1').bind(id).first();
    if (!existe) throw new ErroApi(404, 'nao_encontrado', 'Job não encontrado');
    throw new ErroApi(409, 'job_ja_finalizado', `Job já está ${existe.status}`);
  }
  return r;
}
