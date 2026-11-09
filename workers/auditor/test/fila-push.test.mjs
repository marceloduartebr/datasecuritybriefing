import test from 'node:test';
import assert from 'node:assert/strict';
import { dispararFilaPush } from '../src/fila-push.js';
import worker from '../src/index.js';

test('dispararFilaPush: sem binding ou sem token não faz nada', async () => {
  assert.deepEqual(await dispararFilaPush({}), { pulado: 'sem_binding' });
  assert.deepEqual(await dispararFilaPush({ FILA: { fetch: async () => { throw new Error('não'); } } }), { pulado: 'sem_binding' });
});

test('dispararFilaPush: POST interno com o token; erro vira log', async () => {
  let pedido;
  const env = { FILA_INTERNO_TOKEN: 'segredo', FILA: { fetch: async (u, i) => { pedido = { u, i }; return new Response('{"ok":true}'); } } };
  assert.deepEqual(await dispararFilaPush(env), { status: 200 });
  assert.equal(pedido.u, 'https://dsb-fila/interno/checar-novos');
  assert.equal(pedido.i.method, 'POST');
  assert.equal(pedido.i.headers['x-interno-token'], 'segredo');
  assert.deepEqual(await dispararFilaPush({ ...env, FILA: { fetch: async () => { throw new Error('rede'); } } }), { erro: true });
});

test('scheduled: tick fora de slot dispara só a fila, sem auditoria/KV', async () => {
  const esperas = [];
  let chamadas = 0;
  const env = { FILA_INTERNO_TOKEN: 't', FILA: { fetch: async () => { chamadas++; return new Response('{}'); } } };
  // 2026-11-10 11:15 UTC = 08:15 BRT (tick sem slot)
  await worker.scheduled({ scheduledTime: Date.parse('2026-11-10T11:15:00Z') }, env, { waitUntil: (p) => esperas.push(p) });
  await Promise.all(esperas);
  assert.equal(esperas.length, 1);
  assert.equal(chamadas, 1);
});
