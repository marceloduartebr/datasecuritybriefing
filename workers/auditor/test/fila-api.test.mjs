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
  assert.equal(n.sweep.checks, 14);
  const kinds = n.issues.map((i) => i.kind).sort();
  assert.deepEqual(kinds, ['missing_cover', 'rejected_subject_already_covered']);

  const r = { notion: { ...n, semCapa: n.semCapa.map((c) => ({ ...c, severidade: 'problema' })) }, slot: 'view' };
  const problems = calcularProblemas(r);
  assert.ok(problems.some((p) => /^Issue #\d+ \(cover\): Approved without a cover/.test(p)), problems.join(' | '));
  assert.deepEqual(calcularAlertas(r), ['1 open warning issue(s) in dsb-api']);

  const html = renderPainel({ ...r, em: new Date().toISOString(), ok: false, problemas: problems, alertas: [], flags: {} }, { ambiente: 'stg' });
  assert.match(html, /Issues \(dsb-api-stg\)/);
  assert.match(html, /D1 queue \(dsb-api-stg\)/);
  assert.match(html, /Queue \(D1 · STG\)/);
  const prod = renderPainel({ ...r, em: new Date().toISOString(), ok: false, problemas: problems, alertas: [], flags: {} });
  assert.match(prod, /Issues \(dsb-api\)/);
  assert.match(prod, /Queue \(D1\)/);
  assert.doesNotMatch(prod, /dsb-api-stg|STG/);
});

test('API down or not configured is reported, not thrown', async () => {
  assert.equal((await checarFilaApi({ DATA_SOURCE: 'api' }, hoje, checarCapa)).erro, 'api_not_configured');
  const env = { DATA_SOURCE: 'api', INTERNAL_TOKEN: 'wrong-token-wrong-token-wrong', API: { fetch: (r) => handle(r, { DB: createD1(), INTERNAL_TOKEN: T }) } };
  const n = await checarFilaApi(env, hoje, checarCapa);
  assert.equal(n.ok, false);
  assert.match(n.erro, /unauthorized/);
});

test('STG panel shows the STG badge in the title and the header; production does not', () => {
  const r = { em: new Date().toISOString(), ok: true, problemas: [], alertas: [], flags: {} };
  const stg = renderPainel(r, { ambiente: 'stg' });
  assert.match(stg, /<title>DSB Auditor STG — panel<\/title>/);
  assert.match(stg, /<b class="stg">STG<\/b> D1 via dsb-api-stg · DSB Auditor/);
  const prod = renderPainel(r);
  assert.match(prod, /<title>DSB Auditor — panel<\/title>/);
  assert.doesNotMatch(prod, /class="stg"/);
  assert.match(renderPainel(null, { ambiente: 'stg' }), /<title>DSB Auditor STG<\/title>/);
});

test('Panel: English interface (content kept) and an issue filter, on STG and in production', () => {
  const r = {
    em: new Date().toISOString(), dataBrt: '2026-11-16', horaBrt: '19:47', slot: 'view', ok: false, flags: {},
    blog: { total: 1, itens: [{ slug: '2026-11-16-x', paginas: { pt: 200, es: 404, en: 200 }, capa: { ok: false, motivo: 'http_404' } }] },
    github: { ok: true, commits: [1] }, push: { ok: true },
    notion: { ativo: true, ok: true, fonte: 'api', novosHoje: { total: 2, aindaNovo: 1 }, aprovadosPorTipo: {}, fila: { total: 3 },
      semCapa: [{ id: '3', topic: 'Vazamento na Prefeitura', motivo: 'sem capa', severidade: 'alerta' }], publicadosHoje: 1, publicadosSemUrn: [],
      issues: [{ id: 7, severity: 'error', stage: 'cover', summary: 'Approved without a cover' }, { id: 8, severity: 'warning', stage: 'load', summary: 'Slug repeated' }] }
  };
  r.problemas = calcularProblemas(r);
  r.alertas = calcularAlertas(r);
  const en = renderPainel(r, { ambiente: 'stg' });
  for (const s of ['<h1>Audit panel</h1>', '<h2>Checks</h2>', '<h2>Problems</h2>', '<h2>Missing covers</h2>', '2 added today', '1 still new', 'Queue: no cover (waiting for the cover round)', '<html lang="en">'])
    assert.ok(en.includes(s), s);
  for (const s of ['Painel de auditoria', 'Checagens', 'adicionados hoje', 'Nenhum', 'última execução']) assert.ok(!en.includes(s), s);
  assert.ok(en.includes('Vazamento na Prefeitura'), 'content stays as written');
  assert.match(en, /<select data-f="sev">.*<option value="error">error \(1\)<\/option>/s);
  assert.match(en, /<select data-f="stage">.*<option value="cover">cover \(1\)<\/option>.*<option value="load">load \(1\)<\/option>/s);
  assert.match(en, /<li data-sev="warning" data-stage="load">/);
  const prod = renderPainel(r);
  assert.ok(prod.includes('<h1>Audit panel</h1>') && prod.includes('<html lang="en">') && !prod.includes('Painel de auditoria'));
});

// --- STG panel: resolve or ignore an issue with a note ---
import { tratar } from '../src/index.js';

const b64u = (buf) => Buffer.from(buf).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
async function accessJwt(team, aud, email) {
  const { privateKey, publicKey } = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const jwk = { ...(await crypto.subtle.exportKey('jwk', publicKey)), kid: 'k1', alg: 'RS256' };
  const h = b64u(JSON.stringify({ alg: 'RS256', kid: 'k1' }));
  const p = b64u(JSON.stringify({ iss: team, aud: [aud], email, exp: Math.floor(Date.now() / 1000) + 600 }));
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, new TextEncoder().encode(`${h}.${p}`));
  return { jwt: `${h}.${p}.${b64u(Buffer.from(sig))}`, jwk };
}

test('STG panel: issues get a resolve form; POST resolves with a note as the Access user; origin and note are enforced', async () => {
  const { env: base, call } = setup();
  await call('POST', '/posts', { topic: 'Dup', type: 'incident', source_url: 'https://e.com/a' });
  await call('POST', '/posts', { topic: 'Dup 2', type: 'incident', source_url: 'https://e.com/a?utm_source=x' }); // rejected → issue
  const open = (await call('GET', '/issues?status=open')).items;
  assert.equal(open.length, 1);
  const id = open[0].id;

  const html = renderPainel({ em: new Date().toISOString(), ok: true, problemas: [], alertas: [], flags: {}, notion: { ativo: true, ok: true, fonte: 'api', issues: open } }, { ambiente: 'stg' });
  assert.match(html, /<details class="resolver"><summary>Resolve…<\/summary><form method="post" action="\/panel"/);
  assert.match(html, /<textarea name="resolution" required/);

  const team = 'https://team.cloudflareaccess.com', aud = 'aud-stg';
  const { jwt, jwk } = await accessJwt(team, aud, 'marcelo@example.com');
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (u) => (String(u).startsWith(team) ? new Response(JSON.stringify({ keys: [jwk] })) : realFetch(u));
  try {
    const env = { ...base, ACCESS_TEAM: team, ACCESS_AUD: aud };
    const post = (body, headers = {}) => tratar(new Request('https://dsba-stg.duarte.top/panel', {
      method: 'POST', body: new URLSearchParams(body).toString(),
      headers: { 'content-type': 'application/x-www-form-urlencoded', Origin: 'https://dsba-stg.duarte.top', 'Cf-Access-Jwt-Assertion': jwt, ...headers }
    }), env);

    assert.equal((await tratar(new Request('https://dsba-stg.duarte.top/panel', { method: 'POST', body: 'acao=issue', headers: { 'content-type': 'application/x-www-form-urlencoded', Origin: 'https://dsba-stg.duarte.top' } }), env)).status, 401);
    assert.equal((await post({ acao: 'issue', id, status: 'resolved', resolution: 'x' }, { Origin: 'https://evil.example' })).status, 403);

    let r = await post({ acao: 'issue', id, status: 'resolved', resolution: '' });
    assert.equal(r.status, 303);
    assert.match(decodeURIComponent(r.headers.get('Location').replace(/\+/g, ' ')), /err=Could not update the issue: a note is required/);

    r = await post({ acao: 'issue', id, status: 'resolved', resolution: 'Test rejection from the STG walkthrough' });
    assert.equal(r.status, 303);
    assert.match(decodeURIComponent(r.headers.get('Location').replace(/\+/g, ' ')), /\/panel\?run=1&ok=Issue #\d+ resolved with your note\.#issues/);
    const done = (await call('GET', `/issues?status=resolved`)).items.find((i) => i.id === id);
    assert.equal(done.resolution, 'Test rejection from the STG walkthrough');
    assert.equal(done.resolved_by, 'panel:marcelo@example.com');
  } finally {
    globalThis.fetch = realFetch;
  }
  // production on Notion (no DATA_SOURCE=api): POST /panel stays 405 (resolving needs the API)
  assert.equal((await tratar(new Request('https://dsb-auditor.duarte.top/panel', { method: 'POST' }), {})).status, 405);
});

test('URLs are English everywhere: /panel and ?tab=views&window=; old /painel links redirect', async () => {
  const stg = { DATA_SOURCE: 'api', AMBIENTE: 'stg' };
  let r = await tratar(new Request('https://dsba-stg.duarte.top/painel?aba=leituras&janela=24h&sev=error'), stg);
  assert.equal(r.status, 301);
  assert.equal(r.headers.get('Location'), '/panel?tab=views&window=24h&sev=error');
  r = await tratar(new Request('https://dsba-stg.duarte.top/painel'), stg);
  assert.equal(r.headers.get('Location'), '/panel');
  const html = renderPainel({ em: new Date().toISOString(), ok: true, problemas: [], alertas: [], flags: {} }, { ambiente: 'stg' });
  assert.ok(html.includes('href="/panel"') && html.includes('href="/panel?tab=views"') && html.includes('>Views</a>'), 'English links and tab');
  assert.ok(!html.includes('/painel') && !html.includes('aba=') && !html.includes('Readership'));
  const prod = renderPainel({ em: new Date().toISOString(), ok: true, problemas: [], alertas: [], flags: {} });
  assert.ok(prod.includes('href="/panel?tab=views"') && prod.includes('>Views</a>') && !prod.includes('/painel'));
  r = await tratar(new Request('https://dsb-auditor.duarte.top/painel?aba=leituras'), {});
  assert.equal(r.status, 301);
  assert.equal(r.headers.get('Location'), '/panel?tab=views');
  assert.equal((await tratar(new Request('https://dsb-auditor.duarte.top/panel?tab=views'), {})).status, 404); // no auth configured → 404
});
