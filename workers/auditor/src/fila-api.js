// STG source of the queue checks (DATA_SOURCE = "api"): reads dsb-api-stg through the Service Binding API
// (headers x-internal-token = INTERNAL_TOKEN, x-actor = dsb-auditor-stg) instead of Notion.
// It runs POST /sweep first, so the issues shown are current, and returns the same shape as checarNotion
// plus `issues` (open issues from the API). Never writes posts or publications.
import { TETO_CAPAS_FILA } from './constantes.js';

export const usesApi = (env) => String((env && env.DATA_SOURCE) || '') === 'api';

async function api(env, method, path) {
  const res = await env.API.fetch(
    new Request(`https://dsb-api${path}`, {
      method,
      headers: { 'x-internal-token': String(env.INTERNAL_TOKEN || ''), 'x-actor': 'dsb-auditor-stg', 'content-type': 'application/json' },
      body: method === 'POST' ? '{}' : undefined
    })
  );
  let j = null;
  try {
    j = await res.json();
  } catch {
    /* not JSON */
  }
  if (!res.ok || !j || !j.ok) throw new Error(`dsb-api ${method} ${path}: ${(j && (j.error || j.message)) || `HTTP ${res.status}`}`);
  return j;
}

/** Start of the BRT day (UTC-3) for a YYYY-MM-DD date. */
export const startOfBrtDay = (hoje) => `${hoje}T03:00:00.000Z`;

export async function checarFilaApi(env, hoje, checarCapa) {
  if (!env.API || String(env.INTERNAL_TOKEN || '').length < 24) return { ativo: true, fonte: 'api', ok: false, erro: 'api_not_configured' };
  let sweep, posts, issues;
  try {
    sweep = (await api(env, 'POST', '/sweep')).sweep;
    posts = (await api(env, 'GET', '/posts?limit=500')).items || [];
    issues = (await api(env, 'GET', '/issues?limit=200')).items || [];
  } catch (e) {
    return { ativo: true, fonte: 'api', ok: false, erro: String((e && e.message) || e).slice(0, 200) };
  }
  const since = startOfBrtDay(hoje);
  const at = (v) => (v ? new Date(v).toISOString() : '');
  const today = posts.filter((p) => at(p.added_at) >= since);
  const live = posts.filter((p) => p.status === 'new' || p.status === 'approved');
  const byType = {};
  for (const p of live) if (p.status === 'approved') byType[p.type || 'no_type'] = (byType[p.type || 'no_type'] || 0) + 1;
  const target = live.slice(0, TETO_CAPAS_FILA);
  const semCapa = [];
  for (const p of target) {
    const r = await checarCapa(p.image_url, { origem: 'fila', id: String(p.id), topic: p.topic });
    if (!r.ok) semCapa.push({ id: String(p.id), topic: p.topic, status: p.status, imageUrl: p.image_url, motivo: r.motivo, http: r.status, entrouEm: p.added_at });
  }
  return {
    ativo: true,
    fonte: 'api',
    ok: true,
    novosHoje: {
      total: today.length,
      aindaNovo: today.filter((p) => p.status === 'new').length,
      itens: today.map((p) => ({ id: String(p.id), topic: p.topic, tipo: p.type, status: p.status }))
    },
    aprovadosPorTipo: byType,
    fila: { total: live.length, capasChecadas: target.length, truncado: live.length > target.length },
    semCapa,
    publicadosHoje: posts.filter((p) => at(p.blog_published_at) >= since).length,
    // LinkedIn after the blog is a health check in dsb-api (linkedin_overdue), so it shows up in `issues`.
    publicadosSemUrn: [],
    sweep,
    issues: issues.map((i) => ({
      id: i.id, severity: i.severity, stage: i.stage, source: i.source, kind: i.kind, post_id: i.post_id,
      summary: i.summary, suggested_action: i.suggested_action, occurrences: i.occurrences, last_seen_at: i.last_seen_at
    }))
  };
}

/** Resolves or ignores one issue in dsb-api-stg with a note; the actor is the panel user's Access email. */
export async function resolveIssue(env, id, status, resolution, email) {
  if (!env.API || String(env.INTERNAL_TOKEN || '').length < 24) throw new Error('dsb-api is not configured in this Worker');
  if (!/^\d{1,9}$/.test(String(id))) throw new Error('invalid issue id');
  if (!['resolved', 'ignored'].includes(status)) throw new Error('outcome must be resolved or ignored');
  const note = String(resolution || '').trim();
  if (!note) throw new Error('a note is required');
  const res = await env.API.fetch(
    new Request(`https://dsb-api/issues/${id}`, {
      method: 'PATCH',
      headers: { 'x-internal-token': String(env.INTERNAL_TOKEN || ''), 'x-actor': `panel:${email || 'unknown'}`, 'content-type': 'application/json' },
      body: JSON.stringify({ status, resolution: note.slice(0, 1000) })
    })
  );
  let j = null;
  try {
    j = await res.json();
  } catch {
    /* not JSON */
  }
  if (!res.ok || !j || !j.ok) throw new Error((j && (j.message || j.error)) || `dsb-api answered ${res.status}`);
  return j.issue || null;
}
