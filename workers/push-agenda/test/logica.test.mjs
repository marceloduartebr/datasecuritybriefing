import assert from 'node:assert/strict';
import test from 'node:test';
import { executarTick, gravarMeta, importarHistorico, lerStatus, simularPlano } from '../src/logica.js';
import { banco, chaveTeste, inscrito, item, ligar, paginador } from './util-banco.mjs';

function base(db, extra = {}) {
  ligar(db);
  const chamadas = [];
  const apagados = [];
  const opts = {
    agora: new Date('2026-11-07T15:00:00.000Z'),
    origem: 'admin',
    pushEnvio: 'on',
    catalogo: async () => ({ itens: [item()] }),
    confirmarNoAr: async () => true,
    pagina: paginador([inscrito('sub:aaa')]),
    apagar: async (id) => {
      apagados.push(id);
    },
    enviar: async (id, payload) => {
      chamadas.push({ id, payload });
      return { classe: 'ok', status: 201 };
    },
    ...extra,
  };
  return { opts, chamadas, apagados };
}

async function esgotar(db, opts, limite = 20) {
  const saidas = [];
  for (let i = 0; i < limite; i++) {
    const r = await executarTick(db, opts);
    saidas.push(r);
    if (r.motivo !== 'tick' || !r.continuar) break;
  }
  return saidas;
}

test('envio desligado não grava artigo nem chama o push', async () => {
  const db = banco();
  const { opts, chamadas } = base(db);
  opts.pushEnvio = 'off';
  const r = await executarTick(db, opts);
  assert.equal(r.motivo, 'desligado');
  assert.equal(chamadas.length, 0);
  assert.equal(lerStatus(db).artigos.length, 0);

  db.exec(`DELETE FROM meta WHERE chave = 'envio'`);
  opts.pushEnvio = 'on';
  const soMeta = await executarTick(db, opts);
  assert.equal(soMeta.motivo, 'desligado');
  assert.equal(chamadas.length, 0);
});

test('sem cutoff não dispara o passado', async () => {
  const db = banco();
  const { opts, chamadas } = base(db);
  db.exec(`DELETE FROM meta WHERE chave = 'cutoff'`);
  const r = await executarTick(db, opts);
  assert.equal(r.motivo, 'sem_cutoff');
  assert.equal(chamadas.length, 0);
});

test('sem VAPID não envia', async () => {
  const db = banco();
  const { opts, chamadas } = base(db, { vapidDisponivel: async () => false });
  const r = await executarTick(db, opts);
  assert.equal(r.motivo, 'sem_vapid');
  assert.equal(chamadas.length, 0);
});

test('título, filtro e uma entrega só para quem combina', async () => {
  const db = banco();
  const pessoas = [
    inscrito('sub:ok'),
    inscrito('sub:noticia', { tipos: ['noticia'] }),
    inscrito('sub:vazio', { tipos: [] }),
    inscrito('sub:sem-regiao', { regioes: [] }),
    inscrito('sub:legado', { tipos: undefined, regioes: undefined }),
    inscrito('sub:sem-topico', { topicos: undefined }),
    inscrito('sub:latam', { regioes: ['latam'] }),
  ];
  const { opts, chamadas } = base(db, { pagina: paginador(pessoas) });
  await esgotar(db, opts);
  const ids = chamadas.map((c) => c.id).sort();
  assert.deepEqual(ids, ['sub:legado', 'sub:ok']);
  assert.equal(chamadas[0].payload.titulo, 'Novo Incidente');
  assert.equal(chamadas[0].payload.texto, 'Título do dia');
  assert.equal(chamadas[0].payload.url, '/briefings/2026-11-07-alfa');
  assert.equal(chamadas[0].payload.tag, '2026-11-07-alfa');
  assert.equal(lerStatus(db).artigos[0].status, 'concluido');
});

test('metadado ausente no artigo não restringe; vazio na inscrição restringe', async () => {
  const db = banco();
  const pessoas = [
    inscrito('sub:so-noticia', { tipos: ['noticia'], regioes: ['mx'] }),
    inscrito('sub:vazio', { tipos: [], regioes: ['br'] }),
  ];
  const artigo = item({ tipo: undefined, pais: undefined });
  delete artigo.tipo;
  delete artigo.pais;
  const { opts, chamadas } = base(db, {
    catalogo: async () => ({ itens: [artigo] }),
    pagina: paginador(pessoas),
  });
  await esgotar(db, opts);
  assert.deepEqual(chamadas.map((c) => c.id), ['sub:so-noticia']);
  assert.equal(chamadas[0].payload.titulo, 'Novo briefing no DSB');
});

test('região LATAM recebe país ar e não recebe br', async () => {
  const db = banco();
  const { opts, chamadas } = base(db, {
    catalogo: async () => ({ itens: [item({ pais: 'ar', tipo: 'noticia' })] }),
    pagina: paginador([
      inscrito('sub:latam', { tipos: ['noticia'], regioes: ['latam'] }),
      inscrito('sub:br', { tipos: ['noticia'], regioes: ['br'] }),
    ]),
  });
  await esgotar(db, opts);
  assert.deepEqual(chamadas.map((c) => c.id), ['sub:latam']);
  assert.equal(chamadas[0].payload.titulo, 'Nova Notícia');
});

test('paginação do KV e lote não reenviam quem já teve sucesso', async () => {
  const db = banco();
  const pessoas = Array.from({ length: 25 }, (_, i) => inscrito(`sub:${String(i).padStart(2, '0')}`));
  const { opts, chamadas } = base(db, {
    pagina: paginador(pessoas),
    loteKv: 10,
    loteEnvio: 8,
  });
  const saidas = await esgotar(db, opts, 30);
  assert.equal(chamadas.length, 25);
  assert.equal(new Set(chamadas.map((c) => c.id)).size, 25);
  assert.equal(lerStatus(db).artigos[0].status, 'concluido');
  assert.equal(saidas.at(-1).continuar, false);
  chamadas.length = 0;
  await executarTick(db, opts);
  assert.equal(chamadas.length, 0);
});

test('falha parcial não conclui o artigo e a retomada pula quem já recebeu', async () => {
  const db = banco();
  let fase = 'falha';
  const { opts, chamadas } = base(db, {
    pagina: paginador([inscrito('sub:a'), inscrito('sub:b')]),
    enviar: async (id, payload) => {
      chamadas.push({ id, payload });
      if (id === 'sub:a' && fase === 'falha') return { classe: 'transiente', status: 503 };
      return { classe: 'ok', status: 201 };
    },
  });
  const primeiro = await executarTick(db, opts);
  assert.equal(primeiro.transientes, 1);
  assert.equal(primeiro.enviados, 1);
  assert.equal(lerStatus(db).artigos[0].status, 'pendente');
  fase = 'ok';
  chamadas.length = 0;
  const cedo = await executarTick(db, { ...opts, agora: new Date('2026-11-07T15:00:10.000Z') });
  assert.equal(cedo.enviados || 0, 0);
  assert.equal(chamadas.length, 0);
  const depois = await executarTick(db, { ...opts, agora: new Date('2026-11-07T15:01:00.000Z') });
  assert.equal(depois.enviados, 1);
  assert.deepEqual(chamadas.map((c) => c.id), ['sub:a']);
  assert.equal(lerStatus(db).artigos[0].status, 'concluido');
});

test('404 e 410 removem a inscrição e não tentam de novo', async () => {
  for (const status of [404, 410]) {
    const db = banco();
    const { opts, chamadas, apagados } = base(db, {
      enviar: async () => ({ classe: 'expirado', status }),
    });
    await esgotar(db, opts);
    assert.deepEqual(apagados, ['sub:aaa']);
    assert.equal(lerStatus(db).artigos[0].status, 'concluido');
    chamadas.length = 0;
    await executarTick(db, opts);
    assert.equal(chamadas.length, 0);
  }
});

test('429 honra Retry-After e 5xx/timeout retomam sem marcar enviado', async () => {
  const db = banco();
  const vistos = [];
  let n = 0;
  const { opts } = base(db, {
    enviar: async (id) => {
      vistos.push(id);
      n += 1;
      if (n === 1) return { classe: 'transiente', status: 429, retryAfterSeg: 120 };
      if (n === 2) return { classe: 'timeout' };
      return { classe: 'ok', status: 201 };
    },
  });
  await executarTick(db, opts);
  assert.equal(lerStatus(db).artigos[0].status, 'pendente');
  const meio = await executarTick(db, { ...opts, agora: new Date('2026-11-07T15:01:30.000Z') });
  assert.equal(meio.enviados || 0, 0);
  assert.equal(vistos.length, 1);
  await executarTick(db, { ...opts, agora: new Date('2026-11-07T15:02:30.000Z') });
  assert.equal(lerStatus(db).artigos[0].status, 'pendente');
  await executarTick(db, { ...opts, agora: new Date('2026-11-07T15:03:30.000Z') });
  assert.equal(vistos.length, 3);
  assert.equal(lerStatus(db).artigos[0].status, 'concluido');
});

test('tentativas esgotadas deixam o artigo parcial, não concluído', async () => {
  const db = banco();
  let n = 0;
  const { opts } = base(db, {
    maxTentativas: 2,
    enviar: async () => {
      n += 1;
      return { classe: 'transiente', status: 500 };
    },
  });
  await executarTick(db, opts);
  await executarTick(db, { ...opts, agora: new Date('2026-11-07T15:01:00.000Z') });
  assert.equal(n, 2);
  assert.equal(lerStatus(db).artigos[0].status, 'parcial');
  await executarTick(db, { ...opts, agora: new Date('2026-11-07T16:00:00.000Z') });
  assert.equal(n, 2);
});

test('concorrência: o segundo tick não pega a fila de quem já está enviando', async () => {
  const db = banco();
  const { opts } = base(db);
  let segundo;
  opts.enviar = async () => {
    if (!segundo) {
      segundo = executarTick(db, {
        ...opts,
        dono: 'outro',
        enviar: async () => {
          throw new Error('reenviou');
        },
      });
      const r = await segundo;
      assert.equal(r.motivo, 'ocupado');
    }
    return { classe: 'ok', status: 201 };
  };
  const r = await executarTick(db, opts);
  assert.equal(r.enviados, 1);
  assert.equal(lerStatus(db).artigos[0].status, 'concluido');
});

test('envio interrompido em enviando volta para a fila depois do prazo e pode duplicar', async () => {
  const db = banco();
  ligar(db);
  db.exec(
    `INSERT INTO artigos (slug, titulo, url, data, tipo, pais, publicado_em, status, no_ar, atualizado)
     VALUES ('2026-11-07-alfa', 'Título do dia', '/briefings/2026-11-07-alfa', '2026-11-07', 'incidente', 'br', '2026-11-07T13:00:00.000Z', 'pendente', 1, '2026-11-07T14:00:00.000Z')`,
  );
  db.exec(
    `INSERT INTO entregas (slug, inscrito, status, tentativas, proxima, http_status, atualizado)
     VALUES ('2026-11-07-alfa', 'sub:aaa', 'enviando', 1, NULL, NULL, '2026-11-07T14:00:00.000Z')`,
  );
  db.exec(
    `INSERT INTO meta (chave, valor) VALUES ('descoberta:2026-11-07-alfa', 'completa')`,
  );
  const chamadas = [];
  const r = await executarTick(db, {
    agora: new Date('2026-11-07T15:00:00.000Z'),
    pushEnvio: 'on',
    catalogo: async () => ({ itens: [item()] }),
    confirmarNoAr: async () => true,
    pagina: paginador([]),
    apagar: async () => {},
    enviar: async (id) => {
      chamadas.push(id);
      return { classe: 'ok', status: 201 };
    },
  });
  assert.equal(r.enviados, 1);
  assert.deepEqual(chamadas, ['sub:aaa']);
});

test('HEAD fora do ar não conclui; janela de atraso do build reconsulta e depois para', async () => {
  const db = banco();
  const { opts, chamadas } = base(db, {
    origem: 'cron',
    programado: '2026-11-07T14:25:00.000Z',
    agora: new Date('2026-11-07T14:25:00.000Z'),
    confirmarNoAr: async () => false,
  });
  const r = await executarTick(db, opts);
  assert.equal(chamadas.length, 0);
  assert.equal(lerStatus(db).artigos[0].status, 'aguardando');
  assert.equal(r.continuar, true);

  const vazio = banco();
  const atrasado = base(vazio, {
    origem: 'cron',
    programado: '2026-11-07T14:25:00.000Z',
    agora: new Date('2026-11-07T14:25:00.000Z'),
    catalogo: async () => ({ itens: [] }),
  });
  const a = await executarTick(vazio, atrasado.opts);
  assert.equal(a.motivo, 'tick');
  assert.equal(a.continuar, true);
  assert.equal(a.esperarMs, 5 * 60 * 1000);
  const fora = await executarTick(vazio, {
    ...atrasado.opts,
    origem: 'alarme',
    agora: new Date('2026-11-07T14:50:00.000Z'),
  });
  assert.equal(fora.continuar, false);

  const rede = banco();
  const { opts: optsRede } = base(rede, {
    origem: 'cron',
    programado: '2026-11-07T14:25:00.000Z',
    agora: new Date('2026-11-07T14:25:00.000Z'),
    catalogo: async () => ({ erro: 'rede' }),
  });
  const c = await executarTick(rede, optsRede);
  assert.equal(c.motivo, 'catalogo_indisponivel');
  assert.equal(c.continuar, true);
  assert.equal(lerStatus(rede).artigos.length, 0);
});

test('catálogo indisponível ainda entrega quem já estava na fila', async () => {
  const db = banco();
  ligar(db);
  db.exec(
    `INSERT INTO artigos (slug, titulo, url, data, tipo, pais, publicado_em, status, no_ar, atualizado)
     VALUES ('2026-11-07-alfa', 'Título do dia', '/briefings/2026-11-07-alfa', '2026-11-07', 'incidente', 'br', '2026-11-07T13:00:00.000Z', 'pendente', 1, '2026-11-07T14:00:00.000Z')`,
  );
  db.exec(
    `INSERT INTO entregas (slug, inscrito, status, tentativas, proxima, http_status, atualizado)
     VALUES ('2026-11-07-alfa', 'sub:aaa', 'pendente', 0, NULL, NULL, '2026-11-07T14:00:00.000Z')`,
  );
  db.exec(`INSERT INTO meta (chave, valor) VALUES ('descoberta:2026-11-07-alfa', 'completa')`);
  const chamadas = [];
  const r = await executarTick(db, {
    agora: new Date('2026-11-07T15:00:00.000Z'),
    pushEnvio: 'on',
    catalogo: async () => ({ erro: 'rede' }),
    confirmarNoAr: async () => false,
    pagina: paginador([]),
    apagar: async () => {},
    enviar: async (_id, payload) => {
      chamadas.push(payload);
      return { classe: 'ok', status: 201 };
    },
  });
  assert.equal(r.enviados, 1);
  assert.equal(chamadas[0].titulo, 'Novo Incidente');
  assert.equal(chamadas[0].tag, '2026-11-07-alfa');
  assert.equal(lerStatus(db).artigos[0].status, 'concluido');
});

test('publicação futura no mesmo dia não sai antes da hora', async () => {
  const db = banco();
  const { opts, chamadas } = base(db, {
    origem: 'cron',
    programado: '2026-11-07T14:25:00.000Z',
    agora: new Date('2026-11-07T14:25:00.000Z'),
    catalogo: async () => ({
      itens: [item({ publicadoEm: '2026-11-07T14:40:00.000Z' })],
    }),
  });
  const cedo = await executarTick(db, opts);
  assert.equal(chamadas.length, 0);
  assert.equal(cedo.continuar, true);
  const naHora = await executarTick(db, {
    ...opts,
    origem: 'alarme',
    agora: new Date('2026-11-07T14:41:00.000Z'),
  });
  assert.equal(naHora.enviados, 1);
});

test('origem evento abre janela de 20 min; admin não abre', async () => {
  const dbEvento = banco();
  const agora = new Date('2026-11-07T16:00:00.000Z');
  const { opts: optsEvento, chamadas: cEvento } = base(dbEvento, {
    origem: 'evento',
    agora,
    catalogo: async () => ({ itens: [] }),
  });
  const rEvento = await executarTick(dbEvento, optsEvento);
  assert.equal(cEvento.length, 0);
  assert.equal(rEvento.continuar, true);
  assert.equal(rEvento.esperarMs, 5 * 60 * 1000);
  assert.equal(lerStatus(dbEvento).janelaAte, '2026-11-07T16:20:00.000Z');

  const dbAdmin = banco();
  const { opts: optsAdmin, chamadas: cAdmin } = base(dbAdmin, {
    origem: 'admin',
    agora,
    catalogo: async () => ({ itens: [] }),
  });
  const rAdmin = await executarTick(dbAdmin, optsAdmin);
  assert.equal(cAdmin.length, 0);
  assert.equal(rAdmin.continuar, false);
  assert.equal(lerStatus(dbAdmin).janelaAte, null);
});

test('cutoff ignora o que já passou e a importação é idempotente', async () => {
  const db = banco();
  const agora = new Date('2026-11-07T15:00:00.000Z');
  const primeiro = importarHistorico(
    db,
    {
      enviados: { '2026-11-06-velho': '2026-11-06T15:00:00.000Z' },
      cutoff: '2026-11-07T14:00:00.000Z',
    },
    agora,
  );
  assert.equal(primeiro.ok, true);
  assert.equal(primeiro.concluidos, 1);
  const segundo = importarHistorico(
    db,
    { enviados: { '2026-11-06-velho': '2026-11-06T15:00:00.000Z' }, cutoff: '2026-11-07T14:00:00.000Z' },
    agora,
  );
  assert.equal(segundo.ja_concluidos, 1);
  assert.equal(segundo.concluidos, 0);
  const retro = importarHistorico(db, { cutoff: '2026-11-01T00:00:00.000Z' }, agora);
  assert.equal(retro.erro, 'cutoff_retrocede');
  assert.equal(lerStatus(db).cutoff, '2026-11-07T14:00:00.000Z');

  gravarMeta(db, 'envio', 'on');
  gravarMeta(db, 'fanout', 'on');
  const chamadas = [];
  await executarTick(db, {
    agora,
    pushEnvio: 'on',
    catalogo: async () => ({
      itens: [
        item({ slug: '2026-11-06-velho', url: '/briefings/2026-11-06-velho', data: '2026-11-06', publicadoEm: '2026-11-06T15:00:00.000Z' }),
        item({ publicadoEm: '2026-11-07T13:00:00.000Z' }),
        item({
          slug: '2026-11-07-novo',
          url: '/briefings/2026-11-07-novo',
          titulo: 'Depois do corte',
          publicadoEm: '2026-11-07T14:30:00.000Z',
        }),
      ],
    }),
    confirmarNoAr: async () => true,
    pagina: paginador([inscrito('sub:aaa')]),
    apagar: async () => {},
    enviar: async (id, payload) => {
      chamadas.push(payload.tag);
      return { classe: 'ok', status: 201 };
    },
  });
  assert.deepEqual(chamadas, ['2026-11-07-novo']);
  const status = lerStatus(db);
  assert.equal(status.artigos.find((a) => a.slug === '2026-11-07-alfa').status, 'ignorado');
  assert.equal(status.artigos.find((a) => a.slug === '2026-11-06-velho').status, 'concluido');
});

test('importação não reabre entrega parcial em andamento', async () => {
  const db = banco();
  ligar(db);
  db.exec(
    `INSERT INTO artigos (slug, titulo, url, data, tipo, pais, publicado_em, status, no_ar, atualizado)
     VALUES ('2026-11-07-alfa', 'Título', '/briefings/2026-11-07-alfa', '2026-11-07', NULL, NULL, '2026-11-07T13:00:00.000Z', 'parcial', 1, '2026-11-07T15:00:00.000Z')`,
  );
  db.exec(
    `INSERT INTO entregas (slug, inscrito, status, tentativas, proxima, http_status, atualizado)
     VALUES ('2026-11-07-alfa', 'sub:aaa', 'esgotado', 5, NULL, 500, '2026-11-07T15:00:00.000Z')`,
  );
  const r = importarHistorico(
    db,
    { enviados: { '2026-11-07-alfa': '2026-11-07T15:00:00.000Z' } },
    new Date('2026-11-07T16:00:00.000Z'),
  );
  assert.deepEqual(r.conflitos, ['2026-11-07-alfa']);
  assert.equal(lerStatus(db).artigos[0].status, 'parcial');
});

test('simulação lista o plano e não grava nem envia', async () => {
  const db = banco();
  const plano = simularPlano({
    catalogo: { itens: [item(), item({ slug: '2026-11-06-x', url: '/briefings/2026-11-06-x', data: '2026-11-06', publicadoEm: '2026-11-06T12:00:00.000Z' })] },
    inscritos: [inscrito('sub:ok'), inscrito('sub:vazio', { tipos: [] }), { inscrito: 'sub:ruim', ilegivel: true }],
    agora: new Date('2026-11-07T15:00:00.000Z'),
    cutoff: '2026-11-07T00:00:00.000Z',
    envio: 'off',
    pushEnvio: 'off',
  });
  assert.equal(plano.enviaria, false);
  assert.equal(plano.candidatos.length, 1);
  assert.equal(plano.candidatos[0].destinatarios, 1);
  assert.equal(plano.candidatos[0].titulo, 'Novo Incidente');
  assert.equal(plano.foraDoDia, 1);
  assert.equal(JSON.stringify(plano).includes('sub:'), false);
  assert.equal(lerStatus(db).artigos.length, 0);
});

test('fan-out desligado não envia nem com as outras travas abertas', async () => {
  const db = banco();
  const { opts, chamadas } = base(db);
  db.exec(`DELETE FROM meta WHERE chave = 'fanout'`);
  const r = await executarTick(db, opts);
  assert.equal(r.motivo, 'fanout_desligado');
  assert.equal(chamadas.length, 0);
  assert.equal(lerStatus(db).artigos.length, 0);
});

test('teste isolado envia só a chave pedida e não conclui o artigo para o resto', async () => {
  const db = banco();
  ligar(db);
  db.exec(`DELETE FROM meta WHERE chave = 'fanout'`);
  const alvo = chaveTeste(1);
  const outro = chaveTeste(2);
  let listou = false;
  const chamadas = [];
  const r = await executarTick(db, {
    agora: new Date('2026-11-07T15:00:00.000Z'),
    pushEnvio: 'on',
    somente: [alvo],
    slug: '2026-11-07-alfa',
    catalogo: async () => ({ itens: [item()] }),
    confirmarNoAr: async () => true,
    pagina: async () => {
      listou = true;
      return { chaves: [inscrito(alvo), inscrito(outro)], completo: true, cursor: '' };
    },
    carregar: async (chaves) => chaves.map((id) => inscrito(id)),
    apagar: async () => {},
    enviar: async (id, payload) => {
      chamadas.push({ id, tag: payload.tag });
      return { classe: 'ok', status: 201 };
    },
  });
  assert.equal(r.motivo, 'teste_isolado');
  assert.equal(r.enviados, 1);
  assert.deepEqual(chamadas.map((c) => c.id), [alvo]);
  assert.equal(listou, false);
  assert.equal(lerStatus(db).artigos[0].status, 'pendente');
  assert.equal(lerStatus(db).fanout, 'off');
});

test('slug de amanhã não sai hoje mesmo se o pubDate já caiu em Brasília', async () => {
  const db = banco();
  const { opts, chamadas } = base(db, {
    agora: new Date('2026-11-08T02:00:00.000Z'),
    catalogo: async () => ({
      itens: [
        item({
          slug: '2026-11-08-cedo',
          url: '/briefings/2026-11-08-cedo',
          data: '2026-11-07',
          publicadoEm: '2026-11-08T01:30:00.000Z',
        }),
      ],
    }),
  });
  const r = await executarTick(db, opts);
  assert.equal(chamadas.length, 0);
  assert.equal(r.continuar, false);
});

test('artigo de outro dia não é escolhido', async () => {
  const db = banco();
  const { opts, chamadas } = base(db, {
    catalogo: async () => ({
      itens: [item({ slug: '2026-11-06-x', url: '/briefings/2026-11-06-x', data: '2026-11-06', publicadoEm: '2026-11-06T12:00:00.000Z' })],
    }),
  });
  const r = await executarTick(db, opts);
  assert.equal(chamadas.length, 0);
  assert.equal(r.continuar, false);
});
