import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { analisarQuadrado, mediasLumaTopo, checarQuadrados } from '../src/quadrado.js';
import { calcularProblemas } from '../src/alertas.js';
import { alvosQuadrado } from '../src/auditoria.js';
import { capaValida } from '../src/checagens.js';
import { lerFrontmatter } from '../../../src/lib/push-catalogo.mjs';
import { lerTexto, criarRede } from '../src/rede.js';
import { renderPainel } from '../src/painel.js';

// Prefixos reais das capas (o 1º scan DC fica no começo do JPEG progressivo).
const fx = (n) => new Uint8Array(readFileSync(new URL(`./fixtures/${n}`, import.meta.url)));

test('quadrado: capa afetada (20261106-anpd-balanco-seis-anos) dá positivo', () => {
  const r = analisarQuadrado(fx('capa-quadrado-anpd.jpg.part'));
  assert.equal(r.positivo, true);
  assert.ok(r.dentro.media >= 9 && r.dentro.media <= 14, JSON.stringify(r));
  assert.ok(r.foraEsq.media - r.dentro.media >= 4);
});

test('quadrado: capas boas 1200×630 (workos, ses-mt, xcaret baseline) dão negativo', () => {
  for (const n of ['capa-ok-workos.jpg.part', 'capa-ok-ses-mt.jpg.part', 'capa-baseline-xcaret.jpg.part']) {
    const r = analisarQuadrado(fx(n));
    assert.equal(r.positivo, false, n);
    assert.equal(r.pulado, undefined, `${n} deveria ter sido medida`);
  }
});

test('quadrado: outras dimensões e formatos são pulados (sem falso positivo)', () => {
  assert.deepEqual(analisarQuadrado(fx('capa-1920.jpg.part')), { positivo: false, pulado: 'dimensao_1920x1080' });
  assert.deepEqual(analisarQuadrado(fx('capa-1200x627.jpg.part')), { positivo: false, pulado: 'dimensao_1200x627' });
  assert.equal(analisarQuadrado(new Uint8Array([0x89, 0x50, 0x4e, 0x47])).pulado, 'nao_jpeg');
  assert.equal(analisarQuadrado(fx('capa-quadrado-anpd.jpg.part').subarray(0, 900)).positivo, false);
});

test('quadrado: médias DC batem com os pixels (fundo do logo ≈ 11–13)', () => {
  const r = mediasLumaTopo(fx('capa-quadrado-anpd.jpg.part'));
  assert.equal(r.largura, 1200);
  const y = (bx, by) => r.y[by * r.blocosX + bx];
  assert.ok(Math.abs(y(6, 8) - 12) <= 3, String(y(6, 8)));
  assert.ok(y(20, 8) > 20, String(y(20, 8)));
});

function kvMem() {
  const m = new Map();
  return { m, async get(k, t) { const v = m.get(k); return v == null ? null : (t === 'json' ? JSON.parse(v) : v); }, async put(k, v, o) { m.set(k, v); m.set(`ttl:${k}`, String(o && o.expirationTtl)); } };
}

const U_RUIM = 'https://covers.duarte.top/covers/20261106-anpd-balanco-seis-anos.jpg';
const U_BOA = 'https://covers.duarte.top/covers/20261105-workos-incidente.jpg';
const U_REC = 'https://covers.duarte.top/covers/20261109-ses-mt-incidente.jpg';

function fetchFake(chamadas) {
  return async (url, init = {}) => {
    chamadas.push({ url, range: init.headers && init.headers.Range });
    if (url === U_RUIM) return new Response(fx('capa-quadrado-anpd.jpg.part'), { status: 206 });
    if (url === U_BOA) return new Response(fx('capa-ok-workos.jpg.part'), { status: 206 });
    if (url === U_REC) return new Response(fx('capa-ok-ses-mt.jpg.part'), { status: 206 });
    if (url.endsWith('2026-11-08-recente.md')) return new Response(`---\ncover: "${U_REC}"\n---\ntexto`);
    return new Response('x', { status: 404 });
  };
}
const deps = { capaValida, lerFrontmatter, lerTexto };

test('checarQuadrados: baixa com Range, acusa só a afetada, cacheia por URL e respeita o teto', async () => {
  const kv = kvMem();
  const chamadas = [];
  const rede = criarRede(fetchFake(chamadas), 45);
  const alvos = [
    { url: U_RUIM, origem: 'fila', id: 'abc', topic: 'ANPD balanço' },
    { url: U_BOA, origem: 'blog', slug: '2026-11-09-workos' },
    { origem: 'blog', slug: '2026-11-08-recente', mdUrl: 'https://raw.githubusercontent.com/x/main/src/content/briefings/2026-11-08-recente.md' },
  ];
  const r = await checarQuadrados(rede, kv, alvos, deps, { teto: 3 });
  assert.equal(r.positivas.length, 1);
  assert.equal(r.positivas[0].id, 'abc');
  assert.equal(r.novas, 2);
  assert.equal(r.pendentes, 1); // 3ª operação foi o frontmatter (capa do slug vai ao cache); a capa fica para a próxima
  assert.ok(chamadas.filter((c) => c.url.startsWith('https://covers')).every((c) => c.range === 'bytes=0-65535'));
  assert.equal(kv.m.get(`ttl:quadrado:v1:${U_RUIM}`), String(6 * 3600)); // positivo é reavaliado
  assert.equal(kv.m.get(`ttl:quadrado:v1:${U_BOA}`), String(2 * 86400));

  // 2ª rodada: as duas primeiras vêm do cache; sobra orçamento para a recente.
  chamadas.length = 0;
  const r2 = await checarQuadrados(criarRede(fetchFake(chamadas), 45), kv, alvos, deps, { teto: 3 });
  assert.equal(r2.doCache, 2);
  assert.equal(r2.checadas, 3);
  assert.equal(r2.pendentes, 0);
  assert.equal(r2.positivas.length, 1);
  assert.deepEqual(chamadas.map((c) => c.url.split('/').pop()), ['20261109-ses-mt-incidente.jpg']); // frontmatter veio do cache
});

test('checarQuadrados: sem folga no orçamento de subrequests não baixa nada', async () => {
  const chamadas = [];
  const rede = criarRede(fetchFake(chamadas), 45);
  rede.estado.usadas = 43;
  const r = await checarQuadrados(rede, kvMem(), [{ url: U_RUIM, origem: 'fila', id: 'a' }], deps);
  assert.equal(chamadas.length, 0);
  assert.equal(r.pendentes, 1);
  assert.equal(r.positivas.length, 0);
});

test('checarQuadrados: erro HTTP não vai para o cache', async () => {
  const kv = kvMem();
  const rede = criarRede(async () => new Response('x', { status: 500 }), 45);
  const r = await checarQuadrados(rede, kv, [{ url: U_BOA, origem: 'blog', slug: 's' }], deps);
  assert.equal(r.puladas, 1);
  assert.equal(kv.m.size, 0);
});

test('alvosQuadrado: fila → blog de hoje → últimos 3 dias (sem repetir hoje)', () => {
  const blog = { itens: [] };
  Object.defineProperty(blog, 'catalogo', { value: [
    { slug: '2026-11-09-hoje' }, { slug: '2026-11-08-ontem' }, { slug: '2026-11-07-anteontem' }, { slug: '2026-11-06-velho' },
  ], enumerable: false });
  const vistas = [{ url: U_BOA, origem: 'blog', slug: '2026-11-09-hoje' }, { url: U_RUIM, origem: 'fila', id: 'f' }];
  const a = alvosQuadrado(vistas, blog, '2026-11-09');
  assert.deepEqual(a.map((x) => x.id || x.slug), ['f', '2026-11-09-hoje', '2026-11-08-ontem', '2026-11-07-anteontem']);
  assert.match(a[2].mdUrl, /briefings\/2026-11-08-ontem\.md$/);
  assert.equal(JSON.stringify(blog), '{"itens":[]}'); // catálogo não vaza para o /status
});

test('quadrado: vira problema no alerta e linha no painel', () => {
  const r = {
    em: '2026-11-09T12:00:00Z', slot: '09:50', horaBrt: '09:50', ok: false,
    blog: { ok: true, total: 0, itens: [] }, github: { ok: true, commits: [] }, push: { ok: true, health: 200 }, notion: { ativo: false },
    quadrado: { ativo: true, checadas: 2, doCache: 0, novas: 2, puladas: 0, pendentes: 0, positivas: [
      { origem: 'blog', slug: '2026-11-09-anpd-balanco-seis-anos', url: U_RUIM },
      { origem: 'fila', id: 'x', topic: 'Item da fila', url: U_RUIM },
    ] },
  };
  const p = calcularProblemas(r);
  assert.ok(p.includes('Capa: quadrado escuro atrás do escudo — 2026-11-09-anpd-balanco-seis-anos'));
  assert.ok(p.includes('Capa: quadrado escuro atrás do escudo — Item da fila'));
  r.problemas = p;
  const html = renderPainel(r, {});
  assert.match(html, /Capas \(escudo sem quadrado\)/);
  assert.match(html, /2026-11-09-anpd-balanco-seis-anos/);
  // Sem a chave (execuções antigas no KV): painel não quebra nem mostra a linha.
  delete r.quadrado;
  assert.doesNotMatch(renderPainel(r, {}), /escudo sem quadrado/);
});

test('checarQuadrados: ETag do HEAD entra na chave (capa regerada no mesmo URL é reavaliada)', async () => {
  const kv = kvMem();
  const chamadas = [];
  await checarQuadrados(criarRede(fetchFake(chamadas), 45), kv, [{ url: U_RUIM, versao: '"v1"', origem: 'fila', id: 'a' }], deps);
  assert.ok(kv.m.has(`quadrado:v1:${U_RUIM}#"v1"`));
  const r = await checarQuadrados(criarRede(fetchFake(chamadas), 45), kv, [{ url: U_RUIM, versao: '"v2"', origem: 'fila', id: 'a' }], deps);
  assert.equal(r.novas, 1);
  assert.equal(chamadas.length, 2);
});

test('checarQuadrados: JPEG baseline (mais caro de CPU) encerra as leituras novas da rodada', async () => {
  const chamadas = [];
  const f = async (url, init) => { chamadas.push(url); return new Response(url.includes('base') ? fx('capa-baseline-xcaret.jpg.part') : fx('capa-quadrado-anpd.jpg.part'), { status: 206 }); };
  const r = await checarQuadrados(criarRede(f, 45), kvMem(), [
    { url: 'https://covers.duarte.top/covers/base.jpg', origem: 'fila', id: 'b' },
    { url: U_RUIM, origem: 'fila', id: 'a' },
  ], deps);
  assert.equal(chamadas.length, 1);
  assert.equal(r.pendentes, 1);
});
