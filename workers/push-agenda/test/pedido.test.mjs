import assert from 'node:assert/strict';
import test from 'node:test';
import { tratarPedido } from '../src/pedido.js';

const TOKEN = 'token-de-teste-com-32-bytes-ok!!';

function pedido(path, opts = {}) {
  return new Request(`https://agenda.test${path}`, opts);
}

test('health não revela estado e admin sem token fica fechado', async () => {
  const health = await tratarPedido(pedido('/health'), {}, {});
  assert.equal(health.status, 200);
  const corpo = await health.json();
  assert.deepEqual(Object.keys(corpo).sort(), ['ok', 'servico']);
  const fechado = await tratarPedido(pedido('/admin/status'), {}, {});
  assert.equal(fechado.status, 503);
  const ruim = await tratarPedido(
    pedido('/admin/tick', { method: 'POST', headers: { Authorization: 'Bearer nao-e-o-token-de-teste' } }),
    { ADMIN_TOKEN: TOKEN },
    { tick: async () => ({ ok: true, enviou: true }) },
  );
  assert.equal(ruim.status, 401);
});

test('simular autenticado não ecoa inscrição nem dispara envio', async () => {
  let ticks = 0;
  const res = await tratarPedido(
    pedido('/admin/simular', {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        catalogo: {
          itens: [
            {
              slug: '2026-11-07-alfa',
              titulo: 'A',
              url: '/briefings/2026-11-07-alfa',
              data: '2026-11-07',
              publicadoEm: '2026-11-07T13:00:00.000Z',
            },
          ],
        },
        endpoint: 'https://fcm.googleapis.com/fcm/send/segredo',
      }),
    }),
    { ADMIN_TOKEN: TOKEN },
    {
      simular: async () => {
        return {
          enviaria: false,
          candidatos: [{ slug: '2026-11-07-alfa', destinatarios: 2, titulo: 'Novo briefing no DSB' }],
        };
      },
      tick: async () => {
        ticks += 1;
        return { ok: true };
      },
    },
  );
  assert.equal(res.status, 200);
  const json = await res.json();
  assert.equal(json.enviaria, false);
  assert.equal(ticks, 0);
  assert.equal(JSON.stringify(json).includes('fcm'), false);
});

test('envio só aceita booleano e tick admin não recebe relógio do cliente', async () => {
  let visto;
  const env = { ADMIN_TOKEN: TOKEN };
  const ruim = await tratarPedido(
    pedido('/admin/envio', {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ligado: 'on' }),
    }),
    env,
    { definirEnvio: async (ligado) => ({ ok: typeof ligado === 'boolean', envio: ligado }) },
  );
  assert.equal(ruim.status, 400);
  const tick = await tratarPedido(
    pedido('/admin/tick', { method: 'POST', headers: { Authorization: `Bearer ${TOKEN}` } }),
    env,
    {
      tick: async (pedidoTick) => {
        visto = pedidoTick;
        return { ok: true, motivo: 'desligado', enviou: false };
      },
    },
  );
  assert.equal(tick.status, 200);
  assert.deepEqual(visto, { origem: 'admin' });
});
