import test from 'node:test';
import assert from 'node:assert/strict';
import { postDoCaminho, origemDoReferer, mapaCatalogo, agregar, obterLeituras, consultarLeituras, filtroJanela, CHAVE_CACHE } from '../src/leituras.js';
import { renderLeituras } from '../src/painel.js';

function kv(inicial = {}) {
  const m = new Map(Object.entries(inicial));
  return { m, async get(k, t) { const v = m.get(k); return v == null ? null : t === 'json' ? JSON.parse(v) : v; }, async put(k, v) { m.set(k, v); } };
}
const CAT = { itens: [
  { slug: '2026-11-03-argentina-ia-saude-crowdstrike', titulo: 'Argentina IA', tipo: 'incidente' },
  { slug: '2026-11-05-cve-x', titulo: 'CVE X', tipo: 'vulnerabilidades' },
  { slug: '2026-11-06-anpd', titulo: 'ANPD', tipo: 'noticia' },
] };

test('postDoCaminho: PT/ES/EN, com e sem barra; ignora outras páginas', () => {
  assert.deepEqual(postDoCaminho('/briefings/abc-1/'), { slug: 'abc-1', idioma: 'PT' });
  assert.deepEqual(postDoCaminho('/es/briefings/abc-1'), { slug: 'abc-1', idioma: 'ES' });
  assert.deepEqual(postDoCaminho('/en/briefings/abc-1/'), { slug: 'abc-1', idioma: 'EN' });
  for (const p of ['/', '/briefings/', '/es/', '/notificacoes/', '/briefings/a/b', '/fr/briefings/x']) assert.equal(postDoCaminho(p), null, p);
});

test('origemDoReferer: LinkedIn, X, Google, direto, blog e outros', () => {
  assert.equal(origemDoReferer('www.linkedin.com'), 'LinkedIn');
  assert.equal(origemDoReferer('lnkd.in'), 'LinkedIn');
  assert.equal(origemDoReferer('t.co'), 'X');
  assert.equal(origemDoReferer('x.com'), 'X');
  assert.equal(origemDoReferer('www.google.com.br'), 'Google');
  assert.equal(origemDoReferer(''), 'Direto');
  assert.equal(origemDoReferer('dsb.duarte.top'), 'Navegação no blog');
  assert.equal(origemDoReferer('m.facebook.com'), 'Outros');
  assert.equal(origemDoReferer('notgoogle.evil'), 'Outros');
  assert.equal(origemDoReferer('com.linkedin.android'), 'LinkedIn');
  assert.equal(origemDoReferer('com.twitter.android'), 'X');
  assert.equal(origemDoReferer('com.google.android.googlequicksearchbox'), 'Google');
  assert.equal(origemDoReferer('linkedin.com.evil.example'), 'Outros');
});

test('agregar: junta PT/ES/EN e a URL sem data do mesmo post, com título e tipo do catálogo', () => {
  const g = (path, ref, count) => ({ count, dimensions: { requestPath: path, refererHost: ref } });
  const r = agregar([
    g('/briefings/argentina-ia-saude-crowdstrike/', '', 10),
    g('/es/briefings/argentina-ia-saude-crowdstrike', 'lnkd.in', 5),
    g('/en/briefings/2026-11-03-argentina-ia-saude-crowdstrike/', 'www.google.com', 3),
    g('/briefings/2026-11-05-cve-x/', 'm.facebook.com', 4),
    g('/briefings/2026-11-06-anpd/', 'dsb.duarte.top', 1),
    g('/', '', 50),
  ], mapaCatalogo(CAT), { count: 80, visits: 40 });
  assert.equal(r.paginas, 80); assert.equal(r.visitas, 40); assert.equal(r.leiturasPosts, 23); assert.equal(r.totalPosts, 3);
  assert.deepEqual(r.ranking[0], { slug: '2026-11-03-argentina-ia-saude-crowdstrike', titulo: 'Argentina IA', tipo: 'Incidente', leituras: 18, idiomas: { PT: 10, ES: 5, EN: 3 } });
  assert.deepEqual(r.porTipo, { Incidente: 18, Vulnerabilidades: 4, 'Notícia': 1 });
  assert.deepEqual(r.porIdioma, { PT: 15, ES: 5, EN: 3 });
  assert.deepEqual(r.porOrigem, { LinkedIn: 5, X: 0, Google: 3, Direto: 10, Outros: 4, 'Navegação no blog': 1 });
  assert.deepEqual(r.outrosHosts, [['facebook.com', 4]]);
});

test('filtroJanela: host do blog, sem bots, intervalo em UTC', () => {
  const f = filtroJanela(new Date('2026-11-09T23:00:00Z'), 7);
  assert.deepEqual(f.AND, [{ datetime_geq: '2026-11-02T23:00:00Z' }, { datetime_leq: '2026-11-09T23:00:00Z' }, { requestHost: 'dsb.duarte.top' }, { bot: 0 }]);
});

test('consultarLeituras: sem token não chama a rede; com token monta 1 GraphQL + catálogo', async () => {
  let chamadas = [];
  const fetchFn = async (u, i) => {
    chamadas.push(u);
    if (u.includes('graphql')) {
      assert.match(i.headers.Authorization, /^Bearer tok$/);
      const grupos = [{ count: 3, dimensions: { requestPath: '/briefings/2026-11-06-anpd/', refererHost: '' } }];
      const t = [{ count: 9, sum: { visits: 4 } }];
      return new Response(JSON.stringify({ data: { viewer: { accounts: [{ t24: t, g24: grupos, t7: t, g7: grupos, t30: t, g30: grupos }] } } }));
    }
    return new Response(JSON.stringify(CAT));
  };
  assert.deepEqual(await consultarLeituras({}, { fetchFn }), { ok: false, erro: 'sem_token' });
  assert.equal(chamadas.length, 0);
  const r = await consultarLeituras({ CF_ANALYTICS_TOKEN: 'tok', CF_ACCOUNT_ID: 'acc' }, { fetchFn, agora: new Date('2026-11-09T23:00:00Z') });
  assert.equal(chamadas.length, 2);
  assert.equal(r.ok, true);
  assert.equal(r.janelas['7d'].ranking[0].titulo, 'ANPD');
  assert.equal(r.janelas['30d'].paginas, 9);
});

test('obterLeituras: usa cache de 30 min; renova depois; falha devolve cache antigo', async () => {
  const agora = new Date('2026-11-09T23:00:00Z');
  const velho = { ok: true, geradoEm: '2026-11-09T22:50:00Z', janelas: { '7d': { ranking: [] } } };
  const env = { DSB_AUDITOR: kv({ [CHAVE_CACHE]: JSON.stringify(velho) }), CF_ANALYTICS_TOKEN: 't', CF_ACCOUNT_ID: 'a' };
  let n = 0;
  const falha = async () => { n++; return new Response('x', { status: 500 }); };
  const r1 = await obterLeituras(env, { agora, fetchFn: falha });
  assert.equal(r1.doCache, true); assert.equal(n, 0);
  const r2 = await obterLeituras(env, { agora: new Date('2026-11-09T23:30:00Z'), fetchFn: falha });
  assert.equal(r2.doCache, true); assert.match(r2.aviso, /graphql_http_500/); assert.ok(n > 0);
});

test('renderLeituras: ranking, quebras, aviso de estimativa e janela; erro de token', () => {
  const j = agregar([{ count: 5, dimensions: { requestPath: '/briefings/2026-11-06-anpd/', refererHost: 't.co' } }], mapaCatalogo(CAT));
  const html = renderLeituras({ ok: true, geradoEm: '2026-11-09T23:00:00Z', janelas: { '24h': j, '7d': j, '30d': j } }, { janela: '30d' });
  assert.match(html, /Mais lidos · últimos 30 dias/);
  assert.match(html, /ANPD/);
  assert.match(html, /Por tipo.*Notícia.*Incidente.*Vulnerabilidades/s);
  assert.match(html, /Por idioma/);
  assert.match(html, /Por origem.*LinkedIn.*X.*Google.*Direto.*Outros/s);
  assert.match(html, /Estimativa\./);
  assert.match(html, /amostragem/);
  assert.match(html, /href="\/painel\?aba=leituras&amp;janela=30d" class="on"/);
  assert.match(html, /class="on" aria-current="page">Leituras/);
  assert.match(renderLeituras({ ok: false, erro: 'sem_token' }), /Token de Analytics ausente/);
});

test('rota /painel?aba=leituras: exige auth; com bearer usa o cache do KV sem rede', async () => {
  const { tratar } = await import('../src/index.js');
  const cache = { ok: true, geradoEm: new Date().toISOString(), janelas: { '24h': agregar([]), '7d': agregar([{ count: 2, dimensions: { requestPath: '/briefings/x-y/', refererHost: '' } }]), '30d': agregar([]) } };
  const env = { DSB_AUDITOR: kv({ [CHAVE_CACHE]: JSON.stringify(cache) }), AUDITOR_TOKEN: 'z'.repeat(40) };
  assert.equal((await tratar(new Request('https://a/painel?aba=leituras'), env)).status, 404);
  const prev = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error('sem rede no teste'); };
  try {
    const r = await tratar(new Request('https://a/painel?aba=leituras', { headers: { Authorization: `Bearer ${'z'.repeat(40)}` } }), env);
    assert.equal(r.status, 200);
    const body = await r.text();
    assert.match(body, /Leituras do blog/);
    assert.match(body, /x-y/);
  } finally {
    globalThis.fetch = prev;
  }
});
