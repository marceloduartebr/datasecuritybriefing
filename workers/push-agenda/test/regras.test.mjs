import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { autorizarAdmin } from '../src/auth.js';
import { atrasoMs, classificarResposta } from '../src/entrega.js';
import { combinaRegiao, combinaTipo, inscricaoCompativel } from '../src/filtros.js';
import { listarTodasChaves, vistaInscricao } from '../src/kv-lista.js';
import { logEvento } from '../src/log.js';
import { CRON_DOCUMENTADO } from '../src/constantes.js';
import { tituloPush } from '../src/titulos.js';

const aqui = path.dirname(fileURLToPath(import.meta.url));

test('títulos por tipo e fallback', () => {
  assert.equal(tituloPush('noticia'), 'Nova Notícia');
  assert.equal(tituloPush('incidente'), 'Novo Incidente');
  assert.equal(tituloPush('vulnerabilidades'), 'Nova Vulnerabilidade');
  assert.equal(tituloPush(undefined), 'Novo briefing no DSB');
  assert.equal(tituloPush('outro'), 'Novo briefing no DSB');
  assert.equal(tituloPush(''), 'Novo briefing no DSB');
});

test('filtro de tipo: omissão, vazio, legado e metadado ausente no artigo', () => {
  assert.equal(combinaTipo({}, 'incidente'), true);
  assert.equal(combinaTipo({ tipos: [] }, 'incidente'), false);
  assert.equal(combinaTipo({ tipos: ['noticia'] }, 'noticia'), true);
  assert.equal(combinaTipo({ tipos: ['noticia'] }, 'incidente'), false);
  assert.equal(combinaTipo({ tipos: ['noticia'] }, undefined), true);
});

test('filtro de região, inclusive LATAM e país desconhecido preservado', () => {
  assert.equal(combinaRegiao({}, 'br'), true);
  assert.equal(combinaRegiao({ regioes: [] }, 'br'), false);
  assert.equal(combinaRegiao({ regioes: ['br'] }, 'br'), true);
  assert.equal(combinaRegiao({ regioes: ['br'] }, 'mx'), false);
  assert.equal(combinaRegiao({ regioes: ['mx'] }, 'mx'), true);
  for (const pais of ['ar', 'cl', 'pe', 'py', 'uy', 'co', 'latam']) {
    assert.equal(combinaRegiao({ regioes: ['latam'] }, pais), true, pais);
  }
  assert.equal(combinaRegiao({ regioes: ['latam'] }, 'br'), false);
  assert.equal(combinaRegiao({ regioes: ['us'] }, 'us'), true);
  assert.equal(combinaRegiao({ regioes: ['eu'] }, 'eu'), true);
  assert.equal(combinaRegiao({ regioes: ['global'] }, 'global'), true);
  assert.equal(combinaRegiao({ regioes: ['br'] }, undefined), true);
  assert.equal(combinaRegiao({ regioes: ['br', 'mx'] }, 'nao-existe'), false);
});

test('tópico edicao é exigido; inscrição antiga sem topicos não entra', () => {
  const base = { tipos: ['incidente'], regioes: ['br'] };
  assert.equal(
    inscricaoCompativel({ ...base, topicos: ['edicao'] }, { tipo: 'incidente', pais: 'br', topico: 'edicao' }),
    true,
  );
  assert.equal(
    inscricaoCompativel(base, { tipo: 'incidente', pais: 'br', topico: 'edicao' }),
    false,
  );
  assert.equal(
    inscricaoCompativel({ topicos: [] }, { tipo: 'incidente', pais: 'br', topico: 'edicao' }),
    false,
  );
});

test('classificação 404/410/429/5xx/timeout e backoff', () => {
  assert.equal(classificarResposta({ status: 201 }).classe, 'ok');
  assert.equal(classificarResposta({ status: 404 }).classe, 'expirado');
  assert.equal(classificarResposta({ status: 410 }).classe, 'expirado');
  assert.equal(classificarResposta({ status: 429, retryAfter: '90' }).retryAfterSeg, 90);
  assert.equal(classificarResposta({ status: 503 }).classe, 'transiente');
  assert.equal(classificarResposta({ erro: 'timeout' }).classe, 'timeout');
  assert.equal(classificarResposta({ erro: 'rede' }).classe, 'transiente');
  assert.equal(classificarResposta({ status: 400 }).classe, 'permanente');
  assert.equal(atrasoMs(1, { status: 503 }), 30_000);
  assert.equal(atrasoMs(1, { status: 429, retryAfterSeg: 120 }), 120_000);
  assert.equal(atrasoMs(5, { status: 500 }), 900_000);
  assert.equal(atrasoMs(1, { retryAfterSeg: 3600 }), 15 * 60 * 1000);
});

test('vista de inscrição não carrega endpoint nem chaves', () => {
  const vista = vistaInscricao(
    'sub:' + 'ab'.repeat(32),
    JSON.stringify({
      endpoint: 'https://fcm.googleapis.com/fcm/send/segredo',
      keys: { p256dh: 'aaa', auth: 'bbb' },
      topicos: ['edicao'],
      tipos: ['noticia'],
      regioes: ['br'],
    }),
  );
  assert.deepEqual(Object.keys(vista).sort(), ['inscrito', 'regioes', 'tipos', 'topicos']);
  assert.equal(JSON.stringify(vista).includes('fcm'), false);
  assert.equal(vistaInscricao('sub:x', '{').ilegivel, true);
});

test('paginação de KV percorre o cursor até list_complete', async () => {
  const nomes = Array.from({ length: 25 }, (_, i) => `sub:${String(i).padStart(4, '0')}`);
  const kv = {
    async list({ cursor, limit }) {
      const start = cursor ? Number(cursor) : 0;
      const fatia = nomes.slice(start, start + Math.min(limit, 10));
      const next = start + fatia.length;
      const list_complete = next >= nomes.length;
      return {
        keys: fatia.map((name) => ({ name })),
        list_complete,
        cursor: list_complete ? undefined : String(next),
      };
    },
  };
  assert.deepEqual(await listarTodasChaves(kv, 'sub:'), nomes);
});

test('admin sem token configurado não abre, e comparação não usa o valor no corpo', async () => {
  const env = {};
  const sem = await autorizarAdmin(new Request('https://agenda.test/admin/status'), env);
  assert.equal(sem.status, 503);
  const token = 'token-de-teste-somente-local';
  const ruim = await autorizarAdmin(
    new Request('https://agenda.test/admin/status', { headers: { Authorization: 'Bearer outro-token-xxxx' } }),
    { ADMIN_TOKEN: token },
  );
  assert.equal(ruim.status, 401);
  const bom = await autorizarAdmin(
    new Request('https://agenda.test/admin/status', { headers: { Authorization: `Bearer ${token}` } }),
    { ADMIN_TOKEN: token },
  );
  assert.equal(bom.ok, true);
  const curto = await autorizarAdmin(
    new Request('https://agenda.test/admin/status', { headers: { Authorization: 'Bearer 1234567890123456' } }),
    { ADMIN_TOKEN: 'curto' },
  );
  assert.equal(curto.status, 503);
});

test('log estruturado descarta endpoint, chave e token', () => {
  const linhas = [];
  const original = console.log;
  console.log = (linha) => linhas.push(linha);
  try {
    logEvento('tick', {
      motivo: 'tick',
      enviados: 1,
      endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/segredo',
      inscrito: 'sub:' + 'cd'.repeat(32),
      detalhe: 'Bearer abcdefghijklmnop',
      Authorization: 'vapid t=segredo',
    });
  } finally {
    console.log = original;
  }
  const texto = linhas.join('\n');
  assert.equal(texto.includes('mozilla'), false);
  assert.equal(texto.includes('sub:'), false);
  assert.equal(texto.includes('Bearer'), false);
  assert.equal(texto.includes('vapid'), false);
  assert.equal(texto.includes('"enviados":1'), true);
});

function jsonc(arquivo) {
  const texto = readFileSync(arquivo, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
  return JSON.parse(texto);
}

test('config do agendador fica desligada e não reutiliza recurso do site além do KV existente', () => {
  const agenda = jsonc(path.join(aqui, '../wrangler.jsonc'));
  const site = jsonc(path.join(aqui, '../../../wrangler.jsonc'));
  assert.equal(agenda.name, 'dsb-push-agenda');
  assert.equal(agenda.triggers, undefined);
  assert.equal(CRON_DOCUMENTADO, '25 14,22 * * 1-5');
  assert.equal(JSON.stringify(agenda).includes('PUSH_ENVIO'), false);
  assert.equal(JSON.stringify(agenda).includes('crons'), false);
  assert.equal(agenda.observability.traces.enabled, false);
  assert.equal(agenda.kv_namespaces.length, 1);
  assert.equal(agenda.kv_namespaces[0].binding, 'DSB_PUSH');
  assert.equal(agenda.kv_namespaces[0].id, site.kv_namespaces[0].id);
  assert.equal(site.main, 'worker/index.js');
  assert.equal(site.triggers, undefined);
  assert.equal(agenda.durable_objects.bindings[0].class_name, 'AgendaPush');
  assert.deepEqual(agenda.migrations[0].new_sqlite_classes, ['AgendaPush']);
  assert.equal(JSON.stringify(agenda).includes('BEGIN'), false);
});
