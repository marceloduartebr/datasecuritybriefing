// STG auditor source: checarFilaApi reads the real dsb-api code (SQLite) through a fake Service Binding.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handle } from '../../dsb-api/src/index.js';
import { createD1 } from '../../dsb-api/test/d1-sqlite.mjs';
import { checarFilaApi, usesApi, startOfBrtDay } from '../src/fila-api.js';
import { calcularProblemas, calcularAlertas } from '../src/alertas.js';
import { renderPainel } from '../src/painel.js';

const T = 'internal-000000000000000000000000';

function setup() {
  const apiEnv = { DB: createD1(), INTERNAL_TOKEN: T };
  const call = async (method, path, body) =>
    (await handle(new Request(`https://x${path}`, { method, headers: { 'x-internal-token': T, 'x-actor': 'test', 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }), apiEnv)).json();
  const env = { DATA_SOURCE: 'api', INTERNAL_TOKEN: T, API: { fetch: (r) => handle(r, apiEnv) } };
  return { env, call };
}

const checarCapa = async (url) => (url && url.startsWith('https://covers.duarte.top/covers/') ? { ok: true } : { ok: false, motivo: 'sem_capa' });
const hoje = new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10);

test('usesApi and BRT day start', () => {
  assert.equal(usesApi({ DATA_SOURCE: 'api' }), true);
  assert.equal(usesApi({}), false);
  assert.equal(startOfBrtDay('2026-11-16'), '2026-11-16T03:00:00.000Z');
});

test('queue counts, missing cover and open issues come from dsb-api after a sweep', async () => {
  const { env, call } = setup();
  const a = (await call('POST', '/posts', { topic: 'Leak A', type: 'incident', source_url: 'https://e.com/a' })).post;
  await call('POST', '/posts', { topic: 'Leak B', type: 'news', source_url: 'https://e.com/b', image_source: 'og', image_url: 'https://covers.duarte.top/covers/b.jpg' });
  await call('POST', `/posts/${a.id}/status`, { to: 'approved' });
  await call('POST', '/posts', { topic: 'Dup', type: 'incident', source_url: 'https://e.com/a?utm_source=x' }); // rejected → api issue

  const n = await checarFilaApi(env, hoje, checarCapa);
  assert.equal(n.ok, true, n.erro);
  assert.equal(n.fonte, 'api');
  assert.equal(n.novosHoje.total, 2);
  assert.equal(n.novosHoje.aindaNovo, 1);
  assert.deepEqual(n.aprovadosPorTipo, { incident: 1 });
  assert.deepEqual(n.semCapa.map((c) => c.topic), ['Leak A']);
  assert.equal(n.sweep.checks, 13);
  const kinds = n.issues.map((i) => i.kind).sort();
  assert.deepEqual(kinds, ['missing_cover', 'rejected_subject_already_covered']);

  const r = { notion: { ...n, semCapa: n.semCapa.map((c) => ({ ...c, severidade: 'problema' })) }, slot: 'view' };
  const problems = calcularProblemas(r);
  assert.ok(problems.some((p) => /^Issue #\d+ \(cover\): Approved without a cover/.test(p)), problems.join(' | '));
  assert.deepEqual(calcularAlertas(r), ['1 open warning issue(s) in dsb-api']);

  const html = renderPainel({ ...r, em: new Date().toISOString(), ok: false, problemas: problems, alertas: [], flags: {} });
  assert.match(html, /Issues \(dsb-api-stg\)/);
  assert.match(html, /D1 queue \(dsb-api-stg\)/);
  assert.match(html, /Fila \(D1 · STG\)/);
});

test('API down or not configured is reported, not thrown', async () => {
  assert.equal((await checarFilaApi({ DATA_SOURCE: 'api' }, hoje, checarCapa)).erro, 'api_not_configured');
  const env = { DATA_SOURCE: 'api', INTERNAL_TOKEN: 'wrong-token-wrong-token-wrong', API: { fetch: (r) => handle(r, { DB: createD1(), INTERNAL_TOKEN: T }) } };
  const n = await checarFilaApi(env, hoje, checarCapa);
  assert.equal(n.ok, false);
  assert.match(n.erro, /unauthorized/);
});
