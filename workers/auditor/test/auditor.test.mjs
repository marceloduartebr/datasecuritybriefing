import assert from 'node:assert/strict';
import test from 'node:test';
import { slotDoTick, emBrasilia } from '../src/horario.js';
import { capaValida, urlsIdiomas, resumirPagina, commitsDoAtom, checarPush } from '../src/checagens.js';
import { calcularProblemas, enviarAlertas, montarAlerta } from '../src/alertas.js';
import { capasFaltando, rodarAuditoria } from '../src/auditoria.js';
import { tratar } from '../src/index.js';
import { criarRede } from '../src/rede.js';
import { renderPainel } from '../src/painel.js';
import { autorizarPainel } from '../src/auth.js';
import { validarAccessJwt, _resetJwksCache } from '../src/access.js';

const TOKEN = 'x'.repeat(40);
const PUSH_OK = { fetch: async () => new Response(JSON.stringify({ ok: true, servico: 'dsb-push-agenda' }), { status: 200 }) };

function kvMem() {
  const m = new Map();
  return {
    m,
    async get(k, t) { const v = m.get(k); return v == null ? null : t === 'json' ? JSON.parse(v) : v; },
    async put(k, v) { m.set(k, v); },
  };
}

function resp(status, body, isText) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => (isText ? body : JSON.stringify(body)),
  };
}

const HOJE = '2026-11-09';
const AGORA = new Date('2026-11-09T14:15:00Z'); // 11:15 BRT

function fakeFetch({ capaStatus = 200, esStatus = 200, notion = null, calls = [] } = {}) {
  return async (url, init = {}) => {
    calls.push({ url: String(url), method: init.method || 'GET', auth: !!(init.headers && init.headers.Authorization) });
    const u = String(url);
    if (u.endsWith('/push/catalogo.json')) {
      return resp(200, { itens: [
        { slug: `${HOJE}-alfa`, titulo: 'Alfa', url: `/briefings/${HOJE}-alfa`, data: HOJE, publicadoEm: '2026-11-09T13:00:00Z', tipo: 'noticia' },
        { slug: '2026-11-06-velho', titulo: 'Velho', url: '/briefings/2026-11-06-velho', data: '2026-11-06', publicadoEm: '2026-11-06T13:00:00Z' },
      ] });
    }
    if (u.includes('raw.githubusercontent.com')) return resp(200, '---\ntitle: "Alfa"\ncover: "https://covers.duarte.top/covers/x.jpg"\n---\n', true);
    if (u.startsWith('https://covers.duarte.top/')) return resp(capaStatus, '');
    if (u.includes('/es/briefings/')) return resp(esStatus, '');
    if (u.startsWith('https://dsb.duarte.top/')) return resp(200, '');
    if (u.includes('/commits?')) return resp(200, [{ sha: 'abcdef123', commit: { message: 'msg\nmais', committer: { date: '2026-11-09T14:00:00Z' } } }]);
    if (u.includes('/actions/workflows/')) return resp(200, { workflow_runs: [{ status: 'completed', conclusion: 'success', head_sha: 'abcdef1', created_at: 'x' }] });
    if (u.endsWith('/health')) return resp(200, { ok: true });
    if (u.startsWith('https://api.notion.com/')) return notion ? notion(JSON.parse(init.body)) : resp(500, {});
    return resp(404, {});
  };
}

test('slots: só os 6 horários em dias úteis', () => {
  assert.equal(slotDoTick(Date.parse('2026-11-09T11:30:00Z')), '08:30');
  assert.equal(slotDoTick(Date.parse('2026-11-09T12:50:00Z')), '09:50');
  assert.equal(slotDoTick(Date.parse('2026-11-09T22:15:00Z')), '19:15');
  assert.equal(slotDoTick(Date.parse('2026-11-09T11:15:00Z')), null);
  assert.equal(slotDoTick(Date.parse('2026-11-14T13:15:00Z')), null); // sábado
  assert.equal(emBrasilia(Date.parse('2026-11-10T01:00:00Z')).data, '2026-11-09');
});

test('capa válida só em covers.duarte.top/covers', () => {
  assert.equal(capaValida('https://covers.duarte.top/covers/a-b.jpg'), true);
  assert.equal(capaValida('http://covers.duarte.top/covers/a.jpg'), false);
  assert.equal(capaValida('https://evil.example/covers/a.jpg'), false);
  assert.equal(capaValida(''), false);
  assert.deepEqual(urlsIdiomas('s').en, 'https://dsb.duarte.top/en/briefings/s/');
});

const R_PROB = { problemas: ['Blog: x capa http'], slot: '11:15', horaBrt: '11:15', dataBrt: HOJE, blog: { total: 1 } };

test('alertas off por padrão: não chama o binding mesmo com problemas', async () => {
  let chamou = false;
  const svc = { fetch: async () => { chamou = true; return new Response('{}'); } };
  const r = await enviarAlertas({ PUSH_AGENDA: svc, ALERTA_TOKEN: 't' }, R_PROB);
  assert.equal(r.motivo, 'alertas_off');
  assert.equal(chamou, false);
});

test('alertas on: POST /admin/alerta com ALERTA_TOKEN, sem destino no corpo; não repete no mesmo dia', async () => {
  const pedidos = [];
  const svc = { fetch: async (url, init) => { pedidos.push([String(url), init]); return new Response(JSON.stringify({ ok: true, enviados: 2, destinos: [{ destino: 'sub:568add3d…', classe: 'ok' }] }), { status: 200 }); } };
  const kv = kvMem();
  const env = { ALERTAS: 'on', PUSH_AGENDA: svc, ALERTA_TOKEN: 'tok', DSB_AUDITOR: kv };
  const r = await enviarAlertas(env, R_PROB);
  assert.equal(r.enviado, true);
  assert.equal(pedidos[0][0], 'https://dsb-push-agenda/admin/alerta');
  assert.equal(pedidos[0][1].headers.Authorization, 'Bearer tok');
  const corpo = JSON.parse(pedidos[0][1].body);
  assert.deepEqual(Object.keys(corpo).sort(), ['texto', 'titulo']);
  const r2 = await enviarAlertas(env, { ...R_PROB, slot: '18:15', horaBrt: '18:15' });
  assert.equal(r2.motivo, 'repetido');
  assert.equal(pedidos.length, 1);
});

test('montarAlerta: problema vira alerta; OK diário só às 19:15 com ALERTA_OK_DIARIO=on', () => {
  assert.match(montarAlerta(R_PROB).titulo, /1 problema/);
  const ok = { problemas: [], slot: '19:15', horaBrt: '19:15', blog: { total: 3 } };
  assert.equal(montarAlerta(ok), null);
  assert.equal(montarAlerta(ok, { ALERTA_OK_DIARIO: 'on' }).titulo, 'DSB: tudo certo hoje');
  assert.equal(montarAlerta({ ...ok, slot: '18:15' }, { ALERTA_OK_DIARIO: 'on' }), null);
});

test('auditoria sem Notion: grava ultimo/historico e não chama Notion nem envia', async () => {
  const kv = kvMem();
  const calls = [];
  const r = await rodarAuditoria({ DSB_AUDITOR: kv, PUSH_AGENDA: PUSH_OK }, { agora: AGORA, slot: '11:15', fetchImpl: fakeFetch({ calls }) });
  assert.equal(r.ok, true);
  assert.equal(r.blog.total, 1);
  assert.equal(r.blog.itens[0].capa.ok, true);
  assert.equal(r.notion.ativo, false);
  assert.equal(r.alerta.motivo, 'alertas_off');
  assert.ok(!calls.some((c) => c.url.includes('notion.com')));
  assert.ok(!calls.some((c) => c.method === 'POST'));
  assert.ok(r.subrequests.usadas <= 45);
  assert.ok(kv.m.has('ultimo') && kv.m.has('historico'));
});

test('problemas: capa 404 e ES 404 aparecem; capas-faltando lista o blog', async () => {
  const kv = kvMem();
  const r = await rodarAuditoria({ DSB_AUDITOR: kv }, { agora: AGORA, fetchImpl: fakeFetch({ capaStatus: 404, esStatus: 404 }) });
  assert.equal(r.ok, false);
  assert.ok(r.problemas.some((p) => p.includes('ES 404')));
  assert.ok(r.problemas.some((p) => p.includes('capa http')));
  const cf = capasFaltando(r);
  assert.equal(cf.total, 1);
  assert.equal(cf.itens[0].origem, 'blog');
});

test('Notion on: Novo do dia, Aprovado sem capa, Publicado sem URN', async () => {
  const pagina = (id, topic, status, extra = {}) => ({ id, properties: {
    Topic: { title: [{ plain_text: topic }] }, Status: { select: { name: status } }, Tipo: { select: { name: 'Notícia' } }, ...extra,
  } });
  const notion = (body) => {
    const s = JSON.stringify(body);
    if (s.includes('Added At')) return resp(200, { results: [pagina('n1', 'Novo 1', 'Novo')] });
    if (s.includes('Published At')) return resp(200, { results: [
      pagina('p1', 'Pub com URN', 'Publicado', { 'Publish Notes': { rich_text: [{ plain_text: 'urn:li:share:1' }] } }),
      pagina('p2', 'Pub sem URN', 'Publicado', { 'Publish Notes': { rich_text: [] } }),
      pagina('p3', 'Pub só no blog', 'Publicado', { 'Publish Notes': { rich_text: [{ plain_text: 'Somente blog' }] } }),
    ] });
    return resp(200, { results: [
      pagina('a1', 'Aprovado ok', 'Aprovado', { 'Image URL': { url: 'https://covers.duarte.top/covers/x.jpg' } }),
      pagina('a2', 'Aprovado sem capa', 'Aprovado', { 'Image URL': { url: null } }),
    ] });
  };
  const kv = kvMem();
  const calls = [];
  const r = await rodarAuditoria({ DSB_AUDITOR: kv, PUSH_AGENDA: PUSH_OK, NOTION: 'on', NOTION_TOKEN: 'secret-notion' }, { agora: AGORA, fetchImpl: fakeFetch({ notion, calls }) });
  assert.equal(r.notion.ok, true);
  assert.equal(r.notion.novosHoje.total, 1);
  assert.equal(r.notion.novosHoje.aindaNovo, 1);
  assert.deepEqual(r.notion.semCapa.map((x) => x.id), ['a2']);
  assert.deepEqual(r.notion.publicadosSemUrn.map((x) => x.id), ['p2']);
  assert.equal(r.notion.aprovadosPorTipo['Notícia'], 2);
  assert.ok(!JSON.stringify(r).includes('secret-notion'));
  const notionCalls = calls.filter((c) => c.url.includes('notion.com'));
  assert.equal(notionCalls.length, 3);
  assert.ok(notionCalls.every((c) => c.method === 'POST' && c.url.includes('/query'))); // só consultas
  const cf = capasFaltando(r);
  assert.ok(cf.itens.some((i) => i.origem === 'fila' && i.id === 'a2'));
});

test('Notion on sem token: erro claro, sem chamada', async () => {
  const calls = [];
  const r = await rodarAuditoria({ DSB_AUDITOR: kvMem(), NOTION: 'on' }, { agora: AGORA, fetchImpl: fakeFetch({ calls }) });
  assert.equal(r.notion.erro, 'sem_token');
  assert.ok(!calls.some((c) => c.url.includes('notion.com')));
});

test('orçamento de subrequests nunca passa do teto', async () => {
  const rede = criarRede(async () => resp(200, {}), 3);
  for (let i = 0; i < 5; i++) await rede.pedir('https://x');
  assert.equal(rede.estado.usadas, 3);
  assert.equal(rede.estado.estourou, true);
});

test('HTTP: health público; status exige bearer; sem secret = 503', async () => {
  const kv = kvMem();
  const env = { DSB_AUDITOR: kv, AUDITOR_TOKEN: TOKEN, PUSH_AGENDA: PUSH_OK };
  let r = await tratar(new Request('https://a/health'), env);
  assert.equal(r.status, 200);
  r = await tratar(new Request('https://a/status'), env);
  assert.equal(r.status, 401);
  r = await tratar(new Request('https://a/status', { headers: { Authorization: 'Bearer errado' } }), env);
  assert.equal(r.status, 401);
  r = await tratar(new Request('https://a/status', { headers: { Authorization: `Bearer ${TOKEN}` } }), { DSB_AUDITOR: kv });
  assert.equal(r.status, 503);
  r = await tratar(new Request('https://a/status', { headers: { Authorization: `Bearer ${TOKEN}` } }), env);
  assert.equal(r.status, 404); // sem execução ainda
  r = await tratar(new Request('https://a/rodar', { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` } }), env, null, { agora: AGORA, fetchImpl: fakeFetch() });
  assert.equal(r.status, 200);
  r = await tratar(new Request('https://a/status', { headers: { Authorization: `Bearer ${TOKEN}` } }), env);
  const j = await r.json();
  assert.equal(j.slot, 'manual');
  assert.equal(j.historico.length, 1);
  r = await tratar(new Request('https://a/capas-faltando', { headers: { Authorization: `Bearer ${TOKEN}` } }), env);
  assert.equal((await r.json()).total, 0);
  r = await tratar(new Request('https://a/status', { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` } }), env);
  assert.equal(r.status, 405);
});

test('resumirPagina: marcador Somente blog (sem URN) não conta como Publicado sem URN', () => {
  const pg = (n) => resumirPagina({ id: 'x', properties: { 'Publish Notes': { rich_text: [{ plain_text: n }] } } });
  for (const n of ['Somente blog', 'publicado: SOMENTE BLOG | old', 'somente-blog', 'Somente  blog — sem LinkedIn']) {
    const p = pg(n);
    assert.equal(p.somenteBlog, true, n);
    assert.equal(p.temUrn, false, n);
  }
  for (const n of ['', 'blog somente', 'somenteblog', 'LinkedIn falhou']) assert.equal(pg(n).somenteBlog, false, n);
});

test('resumirPagina detecta URN', () => {
  const p = resumirPagina({ id: 'a-b', properties: { 'Publish Notes': { rich_text: [{ plain_text: 'x urn:li:share:9' }] } } });
  assert.equal(p.id, 'ab');
  assert.equal(p.temUrn, true);
});

test('calcularProblemas: curadoria vazia às 08:30', () => {
  const p = calcularProblemas({ slot: '08:30', blog: { itens: [] }, push: { ok: true }, notion: { ativo: true, ok: true, semCapa: [], publicadosSemUrn: [], novosHoje: { total: 0 } } });
  assert.ok(p.some((x) => x.includes('Curadoria')));
});

test('GitHub API 403 cai no feed Atom', async () => {
  const xml = '<feed><entry><id>tag:github.com,2008:Grit::Commit/03b8f3dd240092852a92ec50ab81a4a3bf5ec369</id><title>\n docs: a &amp; b\n</title><updated>2026-11-09T18:02:09Z</updated></entry></feed>';
  assert.deepEqual(commitsDoAtom(xml), [{ sha: '03b8f3d', mensagem: 'docs: a & b', em: '2026-11-09T18:02:09Z' }]);
  const base = fakeFetch();
  const f = async (url, init) => {
    const u = String(url);
    if (u.includes('api.github.com')) return resp(403, {});
    if (u.endsWith('main.atom')) return resp(200, xml, true);
    return base(url, init);
  };
  const r = await rodarAuditoria({ DSB_AUDITOR: kvMem(), PUSH_AGENDA: PUSH_OK }, { agora: AGORA, fetchImpl: f });
  assert.equal(r.github.ok, true);
  assert.equal(r.github.fonte, 'atom');
  assert.equal(r.github.commits[0].sha, '03b8f3d');
});

test('push: sem binding vira problema; binding só recebe GET /health sem token', async () => {
  assert.equal((await checarPush({})).erro, 'sem_binding');
  const vistos = [];
  const svc = { fetch: async (url, init) => { vistos.push([String(url), init]); return new Response('{"ok":true}', { status: 200 }); } };
  const r = await checarPush({ PUSH_AGENDA: svc });
  assert.equal(r.ok, true);
  assert.deepEqual(vistos.map((v) => v[0]), ['https://dsb-push-agenda/health']);
});

function b64url(buf) {
  const b = Buffer.from(buf).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  return b;
}

async function parRsa() {
  const { privateKey, publicKey } = await crypto.subtle.generateKey(
    { name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' },
    true,
    ['sign', 'verify'],
  );
  const jwk = await crypto.subtle.exportKey('jwk', publicKey);
  jwk.kid = 'test-kid';
  jwk.alg = 'RS256';
  jwk.use = 'sig';
  return { privateKey, jwk };
}

async function assinarJwt(privateKey, header, payload) {
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(payload));
  const data = new TextEncoder().encode(`${h}.${p}`);
  const sig = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, data);
  return `${h}.${p}.${b64url(Buffer.from(sig))}`;
}

test('painel: sem auth e sem ACCESS_* → 404; health intacto; bearer → 200 HTML', async () => {
  const kv = kvMem();
  await kv.put('ultimo', JSON.stringify({
    versao: 1, em: '2026-11-09T18:42:03.029Z', dataBrt: HOJE, horaBrt: '15:42', slot: 'manual',
    ok: true, problemas: [],
    flags: { alertas: 'on', okDiario: 'on', notion: 'on' },
    blog: { ok: true, total: 1, itens: [{ slug: `${HOJE}-x`, paginas: { pt: 200, es: 200, en: 200 }, capa: { ok: true } }] },
    github: { ok: true, commits: [{ sha: 'abc', mensagem: 'm', em: 'x' }], pushEvento: null },
    push: { ok: true, health: 200 },
    notion: { ativo: true, ok: true, novosHoje: { total: 0, aindaNovo: 0 }, semCapa: [], publicadosSemUrn: [], publicadosHoje: 0, aprovadosPorTipo: {}, fila: { total: 0 } },
    alerta: { enviado: false, motivo: 'sem_problemas' },
    subrequests: { usadas: 10, orcamento: 45 },
  }));
  const env = { DSB_AUDITOR: kv, AUDITOR_TOKEN: TOKEN };
  let r = await tratar(new Request('https://a/painel'), env);
  assert.equal(r.status, 404);
  r = await tratar(new Request('https://a/health'), env);
  assert.equal(r.status, 200);
  assert.equal((await r.json()).servico, 'dsb-auditor');
  r = await tratar(new Request('https://a/painel', { headers: { Authorization: `Bearer ${TOKEN}` } }), env);
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type'), /text\/html/);
  const body = await r.text();
  assert.match(body, /DSB Auditor/);
  assert.match(body, /15:42/);
  assert.match(body, /ALERTAS/);
  assert.match(body, /Tudo certo/);
  assert.match(body, /rel="icon"[^>]*href="https:\/\/dsb\.duarte\.top\/favicon\.svg"/);
  assert.match(body, /rel="apple-touch-icon"[^>]*href="https:\/\/dsb\.duarte\.top\/icon-180\.png\?v=2"/);
  // favicon.ico fora do Access: 302 para o ícone do blog
  r = await tratar(new Request('https://a/favicon.ico'), env);
  assert.equal(r.status, 302);
  assert.equal(r.headers.get('Location'), 'https://dsb.duarte.top/favicon.svg');
  // não aceita token em query
  r = await tratar(new Request(`https://a/painel?token=${TOKEN}`), env);
  assert.equal(r.status, 404);
});

test('painel: ACCESS configurado exige JWT ou bearer', async () => {
  const kv = kvMem();
  await kv.put('ultimo', JSON.stringify({
    versao: 1, em: '2026-11-09T18:00:00Z', dataBrt: HOJE, horaBrt: '15:00', slot: 'manual',
    ok: false, problemas: ['Blog: x'],
    flags: { alertas: 'on', okDiario: 'on', notion: 'on' },
    blog: { ok: true, total: 0, itens: [] }, github: { ok: true, commits: [] }, push: { ok: true },
    notion: { ativo: false }, alerta: { enviado: true, motivo: 'ok' }, subrequests: {},
  }));
  const env = { DSB_AUDITOR: kv, AUDITOR_TOKEN: TOKEN, ACCESS_TEAM: 'https://exemplo.cloudflareaccess.com', ACCESS_AUD: 'aud-teste' };
  let r = await tratar(new Request('https://a/painel'), env);
  assert.equal(r.status, 401);
  r = await tratar(new Request('https://a/painel', { headers: { Authorization: `Bearer ${TOKEN}` } }), env);
  assert.equal(r.status, 200);
  assert.match(await r.text(), /problema/);
});

test('validarAccessJwt: assina e verifica com JWKS falso', async () => {
  _resetJwksCache();
  const { privateKey, jwk } = await parRsa();
  const team = 'https://exemplo.cloudflareaccess.com';
  const aud = 'aud-xyz';
  const now = Math.floor(Date.now() / 1000);
  const token = await assinarJwt(privateKey, { alg: 'RS256', kid: 'test-kid' }, {
    iss: team, aud, exp: now + 3600, email: 'marcelo@duarte.top',
  });
  const payload = await validarAccessJwt(token, team, aud, {
    fetchJwks: async () => [jwk],
    agoraSec: now,
  });
  assert.equal(payload.email, 'marcelo@duarte.top');
  await assert.rejects(() => validarAccessJwt(token, team, 'outro-aud', { fetchJwks: async () => [jwk], agoraSec: now }));
  await assert.rejects(() => validarAccessJwt(token, team, aud, { fetchJwks: async () => [jwk], agoraSec: now + 10_000 }));
});

test('autorizarPainel: JWT Access válido libera sem bearer', async () => {
  _resetJwksCache();
  const { privateKey, jwk } = await parRsa();
  const team = 'https://exemplo.cloudflareaccess.com';
  const aud = 'aud-xyz';
  const now = Math.floor(Date.now() / 1000);
  const token = await assinarJwt(privateKey, { alg: 'RS256', kid: 'test-kid' }, { iss: team, aud, exp: now + 3600 });
  const env = { AUDITOR_TOKEN: TOKEN, ACCESS_TEAM: team, ACCESS_AUD: aud };
  let r = await autorizarPainel(new Request('https://a/painel', { headers: { 'Cf-Access-Jwt-Assertion': 'a.b.c' } }), env);
  assert.equal(r.ok, false);
  assert.equal(r.status, 401);
  const prev = globalThis.fetch;
  globalThis.fetch = async (url) => {
    assert.match(String(url), /cdn-cgi\/access\/certs$/);
    return new Response(JSON.stringify({ keys: [jwk] }), { status: 200 });
  };
  try {
    r = await autorizarPainel(new Request('https://a/painel', { headers: { 'Cf-Access-Jwt-Assertion': token } }), env);
    assert.equal(r.ok, true);
    assert.equal(r.via, 'access');
  } finally {
    globalThis.fetch = prev;
    _resetJwksCache();
  }
});

test('renderPainel: lista capas e flags em português', () => {
  const html = renderPainel({
    em: '2026-11-09T21:15:00Z', dataBrt: HOJE, horaBrt: '18:15', slot: '18:15', ok: false,
    problemas: ['Fila: sem capa — Foo'],
    flags: { alertas: 'on', okDiario: 'on', notion: 'on' },
    blog: { ok: true, total: 1, itens: [{ slug: 's', paginas: { pt: 200, es: 404, en: 200 }, capa: { ok: false, motivo: 'http 404' } }] },
    github: { ok: true, commits: [{ sha: '1' }], pushEvento: { conclusao: 'success', sha: '1' } },
    push: { ok: true, health: 200 },
    notion: { ativo: true, ok: true, novosHoje: { total: 2, aindaNovo: 1 }, semCapa: [{ id: 'a', topic: 'Foo', motivo: 'ausente' }], publicadosSemUrn: [], publicadosHoje: 1, aprovadosPorTipo: { Notícia: 3 }, fila: { total: 5 } },
    alerta: { enviado: false, motivo: 'repetido' },
    subrequests: { usadas: 20, orcamento: 45 },
  }, { ultimoAlerta: { data: HOJE, em: '2026-11-09T18:00:00Z', titulo: 'DSB: 1 problema(s) às 15:00', tipo: 'problema', slot: 'manual' } });
  assert.match(html, /Capas faltando/);
  assert.match(html, /Foo/);
  assert.match(html, /ALERTAS/);
  assert.match(html, /Último alerta/);
  assert.match(html, /problema/);
  assert.match(html, /Blog ES/);
  assert.match(html, /https:\/\/dsb\.duarte\.top\/favicon\.svg/);
  assert.match(html, /https:\/\/dsb\.duarte\.top\/icon-180\.png\?v=2/);
});

test('renderPainel: vazio ainda inclui favicon do blog', () => {
  const html = renderPainel(null);
  assert.match(html, /Ainda não houve execução/);
  assert.match(html, /rel="icon"[^>]*href="https:\/\/dsb\.duarte\.top\/favicon\.svg"/);
  assert.match(html, /apple-touch-icon[^>]*href="https:\/\/dsb\.duarte\.top\/icon-180\.png\?v=2"/);
});

test('renderPainel: identidade DSB (logo, serifada, dourado, tema claro/escuro) sem camada fixa sobre o topo', () => {
  const html = renderPainel({ em: '2026-11-09T22:15:00Z', dataBrt: HOJE, horaBrt: '19:15', slot: '19:15', ok: true, problemas: [], flags: {} });
  assert.match(html, /https:\/\/dsb\.duarte\.top\/brand-mark-128\.png/);
  assert.match(html, /Source Serif 4/);
  assert.match(html, /--gold:#d4a054/);
  assert.match(html, /:root\[data-tema="claro"\]/);
  assert.match(html, /id="tema"/);
  assert.match(html, /apple-mobile-web-app-status-bar-style" content="black"/);
  assert.doesNotMatch(html, /position:fixed|backdrop-filter\s*:|black-translucent/);
  assert.match(html, /Tudo certo/);
  assert.match(renderPainel(null), /class="topo"/);
});
