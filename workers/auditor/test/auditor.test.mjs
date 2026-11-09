import assert from 'node:assert/strict';
import test from 'node:test';
import { slotDoTick, emBrasilia } from '../src/horario.js';
import { capaValida, urlsIdiomas, resumirPagina, commitsDoAtom, checarPush } from '../src/checagens.js';
import { calcularProblemas, enviarAlertas, filtrarAllowlist } from '../src/alertas.js';
import { capasFaltando, rodarAuditoria } from '../src/auditoria.js';
import { tratar } from '../src/index.js';
import { criarRede } from '../src/rede.js';

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

test('allowlist recusa qualquer inscrição fora dos 2 prefixos', () => {
  const ok = `sub:568add3d${'0'.repeat(56)}`;
  const fora = `sub:ffffffff${'0'.repeat(56)}`;
  assert.deepEqual(filtrarAllowlist([ok, fora, 'lixo']), [ok]);
});

test('alertas off por padrão, mesmo com problemas', async () => {
  const r = await enviarAlertas({}, ['x']);
  assert.equal(r.enviado, false);
  assert.equal(r.motivo, 'alertas_off');
  const on = await enviarAlertas({ ALERTAS: 'on', ALERTA_SUBS: `sub:568add3d${'1'.repeat(56)}` }, ['x']);
  assert.equal(on.enviado, false); // endpoint dedicado ainda não existe
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
