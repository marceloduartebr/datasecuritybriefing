import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tratar } from '../src/index.js';
import { criarD1 } from './d1-sqlite.mjs';
import { normalizarUrl } from '../src/regras.js';

const TOKENS = {
  INTERNO_TOKEN: 'interno-000000000000000000000000',
  TOKEN_GROK: 'grok-00000000000000000000000000000',
  TOKEN_CLAUDE: 'claude-0000000000000000000000000000'
};

function ambiente() {
  const env = { DB: criarD1(), ...TOKENS };
  const chamar = async (metodo, caminho, corpo, { token = TOKENS.TOKEN_CLAUDE, interno = false } = {}) => {
    const headers = { 'content-type': 'application/json' };
    if (interno) {
      headers['x-interno-token'] = TOKENS.INTERNO_TOKEN;
      headers['x-ator'] = 'marcelo@app';
    } else if (token) headers.Authorization = `Bearer ${token}`;
    const res = await tratar(
      new Request(`https://dsb-api${caminho}`, { method: metodo, headers, body: corpo ? JSON.stringify(corpo) : undefined }),
      env
    );
    return { status: res.status, corpo: await res.json() };
  };
  return { env, chamar };
}

const CAPA = 'https://covers.duarte.top/covers/20261116-teste.jpg';
const base = (extra = {}) => ({
  topic: 'Incidente teste',
  tipo: 'Incidente',
  pais: 'BR',
  source_name: 'Fonte',
  source_url: 'https://exemplo.com.br/noticia/1',
  slug: 'teste-incidente',
  briefing_md: '# corpo',
  post_text: 'texto do post',
  ...extra
});

test('normalizarUrl tira rastreio, fragmento e barra final', () => {
  assert.equal(normalizarUrl('https://Exemplo.com/a/b/?utm_source=x&b=2&a=1#topo'), 'https://exemplo.com/a/b?a=1&b=2');
  assert.equal(normalizarUrl('https://exemplo.com/'), 'https://exemplo.com/');
});

test('autenticação: health aberto, demais rotas exigem token; sem secrets = 503', async () => {
  const { chamar, env } = ambiente();
  assert.equal((await chamar('GET', '/health', null, { token: null })).status, 200);
  assert.equal((await chamar('GET', '/posts', null, { token: 'errado-errado-errado-errado' })).status, 401);
  assert.equal((await chamar('GET', '/posts', null, { token: null })).status, 401);
  for (const k of Object.keys(TOKENS)) delete env[k];
  assert.equal((await chamar('GET', '/posts')).status, 503);
});

test('criar: added_by vem do token; ordem; chave de URL; duplicata com UTM vira 409 + pendência', async () => {
  const { chamar } = ambiente();
  const r = await chamar('POST', '/posts', base({ added_by: 'user' }), { token: TOKENS.TOKEN_GROK });
  assert.equal(r.status, 201, JSON.stringify(r.corpo));
  assert.equal(r.corpo.item.added_by, 'Grok_Assistant');
  assert.equal(r.corpo.item.item_order, 1);
  assert.deepEqual(r.corpo.item.chaves.map((c) => c.key), ['url:https://exemplo.com.br/noticia/1']);

  const dup = await chamar('POST', '/posts', base({ slug: 'outro', source_url: 'https://exemplo.com.br/noticia/1/?utm_source=x' }));
  assert.equal(dup.status, 409);
  assert.equal(dup.corpo.erro, 'assunto_ja_coberto');
  assert.ok(dup.corpo.pendencia, 'recusa deve virar pendência');
  const pend = await chamar('GET', '/pendencias?source=api');
  assert.equal(pend.corpo.itens[0].kind, 'recusa_assunto_ja_coberto');
  assert.equal(pend.corpo.itens[0].agent, 'Claude_Assistant');

  const dup2 = await chamar('POST', '/posts', base({ slug: 'outro2', source_url: 'https://exemplo.com.br/noticia/1#x' }));
  assert.equal(dup2.corpo.pendencia, dup.corpo.pendencia, 'mesma recusa incrementa a mesma pendência');
});

test('fonte genérica da CISA: sem CVE é recusada; com CVEs distintos entram dois itens', async () => {
  const { chamar } = ambiente();
  const kev = 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog';
  const sem = await chamar('POST', '/posts', base({ tipo: 'Vulnerabilidades', source_url: kev, slug: 'kev-a' }));
  assert.equal(sem.status, 422);
  assert.equal(sem.corpo.erro, 'sem_chave');
  const a = await chamar('POST', '/posts', base({ tipo: 'Vulnerabilidades', source_url: kev, slug: 'kev-a', cves: ['CVE-2026-11111'] }));
  const b = await chamar('POST', '/posts', base({ tipo: 'Vulnerabilidades', source_url: kev, slug: 'kev-b', cves: ['cve-2026-22222'] }));
  assert.equal(a.status, 201);
  assert.equal(b.status, 201);
  assert.deepEqual(b.corpo.item.chaves.map((c) => c.key), ['cve:CVE-2026-22222']);
  const rep = await chamar('POST', '/posts', base({ tipo: 'Vulnerabilidades', source_url: kev, slug: 'kev-c', cves: ['CVE-2026-11111'] }));
  assert.equal(rep.status, 409);
  const alerta = 'https://www.cisa.gov/news-events/alerts/2026/10/20/cisa-adds-six-known-exploited-vulnerabilities-catalog';
  const d = await chamar('GET', `/dedup?url=${encodeURIComponent(alerta)}&cve=CVE-2026-22222`);
  assert.equal(d.corpo.url_generica, true);
  assert.equal(d.corpo.livre, false);
});

test('follow-up: mesma URL entra só como continuação; sem follow_up_of é recusada', async () => {
  const { chamar } = ambiente();
  const orig = await chamar('POST', '/posts', base({ slug: 'hospital-a' }));
  const sem = await chamar('POST', '/posts', base({ slug: 'hospital-b' }));
  assert.equal(sem.status, 409);
  const com = await chamar('POST', '/posts', base({ slug: 'hospital-b', follow_up_of: orig.corpo.item.id }));
  assert.equal(com.status, 201, JSON.stringify(com.corpo));
  assert.deepEqual(com.corpo.item.chaves_compartilhadas_com_follow_up, ['url:https://exemplo.com.br/noticia/1']);
  const terceiro = await chamar('POST', '/posts', base({ slug: 'hospital-c', follow_up_of: com.corpo.item.id }));
  assert.equal(terceiro.status, 201, 'cadeia de follow-ups compartilha a raiz');
});

test('descarte exige motivo; assunto descartado só volta como follow-up', async () => {
  const { chamar } = ambiente();
  const it = await chamar('POST', '/posts', base());
  const id = it.corpo.item.id;
  const semMotivo = await chamar('POST', `/posts/${id}/status`, { para: 'Descartado' });
  assert.equal(semMotivo.status, 422);
  const desc = await chamar('POST', `/posts/${id}/status`, { para: 'Descartado', motivo: 'fora da linha' }, { interno: true });
  assert.equal(desc.corpo.item.status, 'Descartado');
  const de_novo = await chamar('POST', '/posts', base({ slug: 'teste-2' }));
  assert.equal(de_novo.status, 409);
  assert.equal(de_novo.corpo.erro, 'assunto_descartado');
  assert.match(de_novo.corpo.mensagem, /fora da linha/);
});

test('fluxo blog-first: capa, reserva única, Publicado pelo blog, canais derivados e nova tentativa', async () => {
  const { chamar } = ambiente();
  const it = await chamar('POST', '/posts', base());
  const id = it.corpo.item.id;

  assert.equal((await chamar('POST', `/posts/${id}/status`, { para: 'Publicado' })).corpo.erro, 'transicao_invalida');
  const ap = await chamar('POST', `/posts/${id}/status`, { para: 'Aprovado', notas: 'ok' }, { interno: true });
  assert.equal(ap.corpo.item.status, 'Aprovado');
  assert.ok(ap.corpo.item.approved_at);

  const semCapa = await chamar('POST', '/publicacoes', { post_id: id, canal: 'blog' });
  assert.equal(semCapa.corpo.erro, 'sem_capa');
  assert.equal((await chamar('PATCH', `/posts/${id}`, { image_source: 'og', image_url: 'https://raw.githubusercontent.com/x.jpg' })).corpo.erro, 'capa_fora_do_host');
  await chamar('PATCH', `/posts/${id}`, { image_source: 'generated', image_url: CAPA });

  assert.equal((await chamar('POST', '/publicacoes', { post_id: id, canal: 'linkedin' })).corpo.erro, 'blog_nao_publicado');
  const filaBlog = await chamar('GET', '/fila/blog');
  assert.equal(filaBlog.corpo.itens[0].pronto, true);

  const res = await chamar('POST', '/publicacoes', { post_id: id, canal: 'blog' }, { token: TOKENS.TOKEN_GROK });
  assert.equal(res.status, 201);
  const outra = await chamar('POST', '/publicacoes', { post_id: id, canal: 'blog' });
  assert.equal(outra.corpo.erro, 'publicacao_ja_reservada', 'o segundo agente não publica o mesmo item');

  const fim = await chamar('POST', `/publicacoes/${res.corpo.publicacao.id}/resultado`, { status: 'publicado', url: 'https://dsb.duarte.top/briefings/2026-11-16-teste-incidente' });
  assert.equal(fim.corpo.item_publicado, true);
  assert.equal((await chamar('GET', `/posts/${id}`)).corpo.item.status, 'Publicado');

  const filaLi = await chamar('GET', '/fila/linkedin');
  assert.equal(filaLi.corpo.itens.length, 1);
  const li = await chamar('POST', '/publicacoes', { post_id: id, canal: 'linkedin' });
  const falha = await chamar('POST', `/publicacoes/${li.corpo.publicacao.id}/resultado`, { status: 'falhou', erro: 'HTTP 429 Composio' });
  assert.equal(falha.corpo.publicacao.attempts, 1);
  const de_novo = await chamar('POST', '/publicacoes', { post_id: id, canal: 'linkedin' });
  assert.equal(de_novo.corpo.publicacao.retomada, true);
  const ok = await chamar('POST', `/publicacoes/${li.corpo.publicacao.id}/resultado`, { status: 'publicado', url: 'https://www.linkedin.com/feed/update/urn:li:share:1', external_id: 'urn:li:share:1' });
  assert.equal(ok.corpo.publicacao.status, 'publicado');
  assert.equal((await chamar('GET', '/fila/linkedin')).corpo.itens.length, 0);
  assert.equal((await chamar('GET', '/fila/x')).corpo.itens.length, 1);
});

test('varredura abre, incrementa e fecha sozinha; ignorada não volta; job com erro vira pendência', async () => {
  const { chamar } = ambiente();
  const it = await chamar('POST', '/posts', base());
  const id = it.corpo.item.id;
  await chamar('POST', `/posts/${id}/status`, { para: 'Aprovado' });

  await chamar('POST', '/varrer', {});
  let p = await chamar('GET', '/pendencias?stage=capa');
  assert.equal(p.corpo.itens.length, 1);
  assert.equal(p.corpo.itens[0].fingerprint, `capa_ausente:${id}`);

  await chamar('POST', '/varrer', {});
  p = await chamar('GET', '/pendencias?stage=capa');
  assert.equal(p.corpo.itens[0].occurrences, 2);

  await chamar('PATCH', `/posts/${id}`, { image_source: 'og', image_url: CAPA });
  await chamar('POST', '/varrer', {});
  assert.equal((await chamar('GET', '/pendencias?stage=capa')).corpo.itens.length, 0);
  const fechada = await chamar('GET', '/pendencias?stage=capa&status=resolvido');
  assert.equal(fechada.corpo.itens[0].resolved_by, 'auto');

  const job = await chamar('POST', '/jobs', { job: 'linkedin-publish-10h' });
  assert.equal((await chamar('PATCH', `/jobs/${job.corpo.job.id}`, { status: 'error' })).status, 422, 'erro exige notes');
  const fim = await chamar('PATCH', `/jobs/${job.corpo.job.id}`, { status: 'error', notes: 'Composio fora do ar' });
  assert.equal(fim.corpo.job.status, 'error');
  const recusa = await chamar('GET', '/pendencias?stage=job&source=api');
  assert.equal(recusa.corpo.itens[0].kind, 'recusa_campo_obrigatorio', 'a tentativa sem notes também ficou registrada');
  const pj = await chamar('GET', '/pendencias?stage=job&source=health');
  assert.equal(pj.corpo.itens.length, 1);

  const ign = await chamar('PATCH', `/pendencias/${pj.corpo.itens[0].id}`, { status: 'ignorado' });
  assert.equal(ign.corpo.erro, 'nota_obrigatoria');
  await chamar('PATCH', `/pendencias/${pj.corpo.itens[0].id}`, { status: 'ignorado', resolution: 'instabilidade conhecida' }, { interno: true });
  await chamar('POST', '/varrer', {});
  assert.equal((await chamar('GET', '/pendencias?stage=job&source=health')).corpo.itens.length, 0, 'ignorada não reabre');
});

test('relato de agente, resumo e notificação única', async () => {
  const { chamar } = ambiente();
  const r = await chamar('POST', '/pendencias', { fingerprint: 'x-sessao', kind: 'sessao_expirada', severity: 'critico', stage: 'x', summary: 'Sessão da @DSBriefing caiu' });
  assert.equal(r.status, 201);
  const res = await chamar('GET', '/pendencias/resumo');
  assert.deepEqual(res.corpo.resumo, [{ stage: 'x', severity: 'critico', n: 1 }]);
  assert.equal((await chamar('POST', '/pendencias/notificadas', { ids: [r.corpo.pendencia.id] })).corpo.marcadas, 1);
  assert.equal((await chamar('POST', '/pendencias/notificadas', { ids: [r.corpo.pendencia.id] })).corpo.marcadas, 0);
});

test('reordenar exige a lista completa e atual', async () => {
  const { chamar } = ambiente();
  const a = (await chamar('POST', '/posts', base({ slug: 'a', source_url: 'https://e.com/a' }))).corpo.item.id;
  const b = (await chamar('POST', '/posts', base({ slug: 'b', source_url: 'https://e.com/b' }))).corpo.item.id;
  assert.equal((await chamar('POST', '/posts/reordenar', { status: 'Novo', ids: [b] })).corpo.erro, 'lista_desatualizada');
  const ok = await chamar('POST', '/posts/reordenar', { status: 'Novo', ids: [b, a] }, { interno: true });
  assert.equal(ok.status, 200);
  const lista = (await chamar('GET', '/posts?status=Novo')).corpo.itens.map((i) => i.id);
  assert.deepEqual(lista, [b, a]);
});

test('erros de entrada: JSON inválido, rota inexistente, slug inválido', async () => {
  const { env } = ambiente();
  const res = await tratar(
    new Request('https://dsb-api/posts', { method: 'POST', headers: { Authorization: `Bearer ${TOKENS.TOKEN_CLAUDE}` }, body: '{x' }),
    env
  );
  assert.equal(res.status, 400);
  const { chamar } = ambiente();
  assert.equal((await chamar('GET', '/nada')).status, 404);
  assert.equal((await chamar('POST', '/posts', base({ slug: 'Com Acento é' }))).corpo.erro, 'slug_invalido');
});
