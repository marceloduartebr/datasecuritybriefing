import assert from 'node:assert/strict';
import test from 'node:test';
import { baixarCatalogo, confirmarNoAr, postarPush } from '../src/rede.js';

test('timeout de push não vira sucesso', async () => {
  const r = await postarPush(
    { url: 'https://example.invalid/push', headers: {}, body: new Uint8Array([1]) },
    (_url, init) =>
      new Promise((_resolve, reject) => {
        const abortar = () => {
          const erro = new Error('timeout');
          erro.name = 'TimeoutError';
          reject(erro);
        };
        if (init.signal.aborted) abortar();
        else init.signal.addEventListener('abort', abortar, { once: true });
      }),
    50,
  );
  assert.equal(r.classe, 'timeout');
});

test('HEAD e catálogo recusam o que não é o site', async () => {
  assert.equal(await confirmarNoAr(async () => ({ ok: true }), 'https://evil.example/briefings/x'), false);
  assert.equal(
    await confirmarNoAr(async (url) => {
      assert.equal(url, 'https://dsb.duarte.top/briefings/2026-11-07-alfa');
      return { ok: true };
    }, '/briefings/2026-11-07-alfa'),
    true,
  );
  const cat = await baixarCatalogo(async () => ({
    ok: true,
    json: async () => ({
      itens: [
        {
          slug: '2026-11-07-alfa',
          titulo: 'A',
          url: '/briefings/2026-11-07-alfa',
          data: '2026-11-07',
          publicadoEm: '2026-11-07T13:00:00.000Z',
          endpoint: 'https://fcm.googleapis.com/segredo',
        },
      ],
    }),
  }), 'https://dsb.duarte.top/push/catalogo.json');
  assert.equal(cat.itens.length, 1);
  assert.equal(JSON.stringify(cat).includes('fcm'), false);
});

test('falha de rede no catálogo não estoura', async () => {
  const cat = await baixarCatalogo(async () => {
    throw new Error('https://fcm.googleapis.com/segredo');
  }, 'https://dsb.duarte.top/push/catalogo.json');
  assert.equal(cat.erro, 'rede');
  assert.equal(JSON.stringify(cat).includes('fcm'), false);
});
