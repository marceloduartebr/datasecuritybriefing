import assert from 'node:assert/strict';
import test from 'node:test';
import { ALERTA_PREFIXOS, enviarAlerta, resolverAllowlist, validarAlerta } from '../src/alerta.js';
import { tratarPedido } from '../src/pedido.js';

const A = `sub:568add3d${'a'.repeat(56)}`;
const B = `sub:d48327b1${'b'.repeat(56)}`;
const OUTRO = `sub:ffffffff${'c'.repeat(56)}`;
const TOKEN_A = 'alerta-'.padEnd(40, 'z');
const TOKEN_ADMIN = 'admin-'.padEnd(40, 'y');

function kv(chaves) {
  const m = new Map(chaves.map((k) => [k, JSON.stringify({ endpoint: `https://push.example/${k.slice(4, 8)}`, keys: { p256dh: 'x', auth: 'y' } })]));
  const ops = { list: 0, get: 0, put: 0, delete: 0 };
  return {
    m, ops,
    async list({ prefix, limit }) { ops.list++; return { keys: [...m.keys()].filter((k) => k.startsWith(prefix)).slice(0, limit).map((name) => ({ name })), list_complete: true }; },
    async get(k) { ops.get++; return m.get(k) ?? null; },
    async put() { ops.put++; throw new Error('proibido'); },
    async delete() { ops.delete++; throw new Error('proibido'); },
  };
}
const env = (k) => ({ DSB_PUSH: k, VAPID_PUBLIC_KEY: 'pub', VAPID_PRIVATE_KEY: 'priv', ALERTA_TOKEN: TOKEN_A, ADMIN_TOKEN: TOKEN_ADMIN });
const req = (corpo, token = TOKEN_A, method = 'POST') => new Request('https://w/admin/alerta', {
  method, headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: method === 'POST' ? JSON.stringify(corpo) : undefined,
});

test('allowlist fixa tem exatamente os 2 prefixos do Marcelo', () => {
  assert.deepEqual([...ALERTA_PREFIXOS], ['568add3d', 'd48327b1']);
  assert.throws(() => ALERTA_PREFIXOS.push('ffffffff'));
});

test('validação: título/texto obrigatórios, url só do site, campos extras recusados', () => {
  assert.equal(validarAlerta({ titulo: 'T', texto: 'x' }).payload.url, 'https://dsb.duarte.top/');
  assert.equal(validarAlerta({ titulo: 'T', texto: 'x', url: '/briefings/a/' }).payload.url, 'https://dsb.duarte.top/briefings/a/');
  assert.equal(validarAlerta({ titulo: 'T', texto: 'x', url: 'https://evil.example/' }).erro, 'url');
  assert.equal(validarAlerta({ titulo: 'T', texto: 'x', somente: [OUTRO] }).erro, 'campo_nao_permitido');
  assert.equal(validarAlerta({ titulo: 'T', texto: 'x', destinos: [OUTRO] }).erro, 'campo_nao_permitido');
  assert.equal(validarAlerta({ titulo: '', texto: 'x' }).erro, 'titulo');
  assert.equal(validarAlerta({ titulo: 'T', texto: 'y'.repeat(401) }).erro, 'texto');
  assert.equal(validarAlerta({ titulo: 'T', texto: 'x' }).payload.tag, 'dsb-auditor');
});

test('envia só para as 2 inscrições, nunca para outras, sem gravar nem apagar no KV', async () => {
  const k = kv([A, B, OUTRO]);
  const enviados = [];
  const r = await enviarAlerta(env(k), { titulo: 'T', texto: 'x' }, {
    enviar: async ({ registro }) => { enviados.push(registro.endpoint); return { classe: 'ok', status: 201 }; },
  });
  assert.equal(r.enviados, 2);
  assert.deepEqual(enviados.sort(), ['https://push.example/568a', 'https://push.example/d483']);
  assert.deepEqual(r.destinos.map((d) => d.destino), ['sub:568add3d…', 'sub:d48327b1…']);
  assert.ok(!JSON.stringify(r).includes('aaaa'));
  assert.equal(k.ops.put, 0);
  assert.equal(k.ops.delete, 0);
});

test('prefixo ausente ou ambíguo não envia; expirado é só relatado', async () => {
  const k = kv([A, `sub:d48327b1${'1'.repeat(56)}`, `sub:d48327b1${'2'.repeat(56)}`]);
  const r = await enviarAlerta(env(k), { titulo: 'T', texto: 'x' }, { enviar: async () => ({ classe: 'expirado', status: 410 }) });
  assert.deepEqual(r.destinos.map((d) => [d.destino, d.classe]), [['sub:568add3d…', 'expirado'], ['sub:d48327b1…', 'nao_enviado']]);
  assert.equal(r.destinos[1].motivo, 'ambiguo');
  assert.equal(k.ops.delete, 0);
  const vazio = await resolverAllowlist(kv([]));
  assert.ok(vazio.every((x) => x.erro === 'ausente'));
});

test('rota: ALERTA_TOKEN obrigatório; ADMIN_TOKEN não serve; sem secret = 503; só POST', async () => {
  const k = kv([A, B]);
  const deps = { enviarAlerta: async () => ({ ok: true, enviados: 2, destinos: [] }) };
  assert.equal((await tratarPedido(req({ titulo: 'T', texto: 'x' }, TOKEN_ADMIN), env(k), {}, deps)).status, 401);
  assert.equal((await tratarPedido(req({ titulo: 'T', texto: 'x' }, 'errado'), env(k), {}, deps)).status, 401);
  assert.equal((await tratarPedido(req({ titulo: 'T', texto: 'x' }), { ...env(k), ALERTA_TOKEN: undefined }, {}, deps)).status, 503);
  assert.equal((await tratarPedido(req(null, TOKEN_A, 'GET'), env(k), {}, deps)).status, 405);
  assert.equal((await tratarPedido(req({ titulo: 'T', texto: 'x', somente: [A] }), env(k), {}, deps)).status, 400);
  const ok = await tratarPedido(req({ titulo: 'T', texto: 'x' }), env(k), {}, deps);
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).enviados, 2);
});

test('ALERTA_TOKEN não abre rotas admin', async () => {
  const r = await tratarPedido(new Request('https://w/admin/status', { headers: { Authorization: `Bearer ${TOKEN_A}` } }), env(kv([])), { status: async () => ({}) });
  assert.equal(r.status, 401);
});
