import { ErroApi, agoraIso, nz, erroDeRestricao } from './http.js';
import { validarNovoPost, chavesDoItem, normalizarUrl, validarCves, validarCapa, EDITAVEIS, TRANSICOES, STATUS, TIPOS } from './regras.js';

export async function obterPost(db, id, { completo = true } = {}) {
  const p = await db.prepare('SELECT * FROM posts WHERE id = ?1').bind(id).first();
  if (!p) throw new ErroApi(404, 'nao_encontrado', 'Item não encontrado');
  if (!completo) return p;
  const [chaves, pubs] = await Promise.all([
    db.prepare('SELECT key, kind FROM post_keys WHERE post_id = ?1 ORDER BY key').bind(id).all(),
    db.prepare('SELECT * FROM publications WHERE post_id = ?1 ORDER BY channel, lang').bind(id).all()
  ]);
  return { ...p, chaves: chaves.results || [], publicacoes: pubs.results || [] };
}

export async function listarPosts(db, params) {
  const where = [];
  const binds = [];
  const status = params.get('status');
  if (status) {
    const v = status.split(',').filter((s) => STATUS.includes(s));
    if (v.length) {
      where.push(`p.status IN (${v.map(() => '?').join(',')})`);
      binds.push(...v);
    }
  }
  const tipo = params.get('tipo');
  if (tipo && TIPOS.includes(tipo)) {
    where.push('p.tipo = ?');
    binds.push(tipo);
  }
  const desde = params.get('desde');
  if (desde && !Number.isNaN(Date.parse(desde))) {
    where.push('julianday(p.added_at) >= julianday(?)');
    binds.push(desde);
  }
  const limite = Math.min(Math.max(Number(params.get('limite')) || 100, 1), 500);
  const r = await db
    .prepare(
      `SELECT v.* , p.source_url, p.source_name, p.added_by, p.added_at, p.approved_at, p.follow_up_of
       FROM v_post_channels v JOIN posts p ON p.id = v.id
       ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
       ORDER BY CASE p.status WHEN 'Aprovado' THEN 0 WHEN 'Novo' THEN 1 WHEN 'Publicado' THEN 2 ELSE 3 END,
                CASE p.priority WHEN 'Alta' THEN 0 ELSE 1 END, p.item_order, p.added_at
       LIMIT ${limite}`
    )
    .bind(...binds)
    .all();
  return r.results || [];
}

/** Raiz de uma cadeia de follow-ups (para aceitar colisões dentro da mesma história). */
async function raiz(db, id) {
  let atual = id;
  for (let i = 0; i < 20; i++) {
    const r = await db.prepare('SELECT follow_up_of FROM posts WHERE id = ?1').bind(atual).first();
    if (!r) return null;
    if (r.follow_up_of == null) return atual;
    atual = r.follow_up_of;
  }
  return atual;
}

/**
 * Consulta de dedup sem escrever nada. Devolve as chaves que o item teria e as colisões.
 */
export async function verificarDedup(db, { sourceUrl, cves }) {
  const url = normalizarUrl(sourceUrl);
  const lista = validarCves(cves);
  const { chaves, generica } = await chavesDoItem(db, { sourceUrl: url, cves: lista });
  const colisoes = await colisoesDe(db, chaves);
  return { source_url: url, url_generica: generica, chaves, colisoes, livre: colisoes.length === 0 };
}

async function colisoesDe(db, chaves) {
  if (!chaves.length) return [];
  const r = await db
    .prepare(
      `SELECT k.key, p.id, p.topic, p.status, p.tipo, p.item_order, p.discard_reason, p.added_at
       FROM post_keys k JOIN posts p ON p.id = k.post_id
       WHERE k.key IN (${chaves.map((_, i) => `?${i + 1}`).join(',')})`
    )
    .bind(...chaves.map((c) => c.key))
    .all();
  return r.results || [];
}

export async function criarPost(db, corpo, sessao) {
  const d = validarNovoPost(corpo, sessao);
  const { chaves } = await chavesDoItem(db, { sourceUrl: d.source_url, cves: d.cves });
  if (!chaves.length) {
    throw new ErroApi(422, 'sem_chave', 'Fonte genérica sem CVE: informe os CVEs ou uma URL específica', { source_url: d.source_url });
  }

  let raizAlvo = null;
  if (d.follow_up_of != null) {
    if (!Number.isInteger(d.follow_up_of)) throw new ErroApi(422, 'dado_invalido', 'follow_up_of deve ser id numérico');
    raizAlvo = await raiz(db, d.follow_up_of);
    if (raizAlvo == null) throw new ErroApi(422, 'referencia_invalida', 'follow_up_of aponta para item inexistente');
  }

  const colisoes = await colisoesDe(db, chaves);
  const aceitas = new Set();
  const bloqueios = [];
  for (const c of colisoes) {
    if (raizAlvo != null && (await raiz(db, c.id)) === raizAlvo) aceitas.add(c.key);
    else bloqueios.push(c);
  }
  if (bloqueios.length) {
    const soDescartados = bloqueios.every((c) => c.status === 'Descartado');
    const c = bloqueios[0];
    throw new ErroApi(
      409,
      soDescartados ? 'assunto_descartado' : 'assunto_ja_coberto',
      soDescartados
        ? `Assunto descartado em #${c.id} (${c.discard_reason || 'sem motivo registrado'}); só entra como follow_up_of com fato novo`
        : `Assunto já coberto por #${c.id} (${c.status}): ${c.topic}`,
      { chave: c.key, colisoes: bloqueios }
    );
  }

  const ordem = await db.prepare(`SELECT IFNULL(MAX(item_order), 0) + 1 AS n FROM posts WHERE status = 'Novo'`).first();
  let post;
  try {
    post = await db
      .prepare(
        `INSERT INTO posts (notion_id, topic, tipo, pais, priority, item_order, source_name, source_url, slug,
                            briefing_md, post_text, image_source, image_url, added_by, added_at, follow_up_of)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16) RETURNING *`
      )
      .bind(
        d.notion_id, d.topic, d.tipo, d.pais, d.priority, ordem.n, d.source_name, d.source_url, d.slug,
        d.briefing_md, d.post_text, d.image_source, d.image_url, d.added_by, d.added_at, d.follow_up_of
      )
      .first();
  } catch (e) {
    throw erroDeRestricao(e) || e;
  }

  const novas = chaves.filter((c) => !aceitas.has(c.key));
  const stmts = novas.map((c) => db.prepare('INSERT INTO post_keys (key, post_id, kind) VALUES (?1, ?2, ?3)').bind(c.key, post.id, c.kind));
  stmts.push(
    db
      .prepare('INSERT INTO post_events (post_id, from_status, to_status, actor, notes) VALUES (?1, NULL, ?2, ?3, ?4)')
      .bind(post.id, 'Novo', sessao.ator, d.follow_up_of != null ? `follow-up de #${d.follow_up_of}` : null)
  );
  try {
    await db.batch(stmts);
  } catch (e) {
    // Outro item levou a chave no meio do caminho: desfaz o insert para não deixar item sem chave.
    await db.prepare('DELETE FROM posts WHERE id = ?1').bind(post.id).run();
    throw erroDeRestricao(e) || e;
  }
  return { ...post, chaves: novas, chaves_compartilhadas_com_follow_up: [...aceitas] };
}

export async function adicionarChaves(db, id, corpo, sessao) {
  const p = await obterPost(db, id, { completo: false });
  const cves = validarCves(corpo.cves);
  const chaves = cves.map((c) => ({ key: `cve:${c}`, kind: 'cve' }));
  if (corpo.url) {
    const url = normalizarUrl(corpo.url, 'url');
    const { chaves: ch } = await chavesDoItem(db, { sourceUrl: url, cves: [] });
    chaves.push(...ch);
  }
  if (!chaves.length) throw new ErroApi(422, 'sem_chave', 'Informe cves ou uma url específica');
  const colisoes = (await colisoesDe(db, chaves)).filter((c) => c.id !== p.id);
  if (colisoes.length) throw new ErroApi(409, 'assunto_ja_coberto', `Chave já pertence a #${colisoes[0].id}`, { chave: colisoes[0].key, colisoes });
  try {
    await db.batch(chaves.map((c) => db.prepare('INSERT OR IGNORE INTO post_keys (key, post_id, kind) VALUES (?1, ?2, ?3)').bind(c.key, p.id, c.kind)));
  } catch (e) {
    throw erroDeRestricao(e) || e;
  }
  return obterPost(db, id);
}

export async function editarPost(db, id, corpo, sessao) {
  const atual = await obterPost(db, id, { completo: false });
  const sets = [];
  const binds = [];
  for (const [campo, validar] of Object.entries(EDITAVEIS)) {
    if (!(campo in corpo)) continue;
    sets.push(`${campo} = ?`);
    binds.push(validar(corpo[campo]));
  }
  if ('image_source' in corpo || 'image_url' in corpo) {
    const capa = validarCapa(
      'image_source' in corpo ? corpo.image_source : atual.image_source,
      'image_url' in corpo ? corpo.image_url : atual.image_url
    );
    sets.push('image_source = ?', 'image_url = ?');
    binds.push(capa.image_source, capa.image_url);
  }
  for (const proibido of ['status', 'source_url', 'id', 'notion_id', 'added_by', 'follow_up_of']) {
    if (proibido in corpo) throw new ErroApi(422, 'campo_nao_editavel', `${proibido} não se altera por edição`);
  }
  if (!sets.length) throw new ErroApi(422, 'nada_a_alterar', 'Nenhum campo editável enviado');
  try {
    await db.batch([
      db.prepare(`UPDATE posts SET ${sets.join(', ')} WHERE id = ?`).bind(...binds, id),
      db
        .prepare('INSERT INTO post_events (post_id, from_status, to_status, actor, notes) VALUES (?1, ?2, ?2, ?3, ?4)')
        .bind(id, atual.status, sessao.ator, `edição: ${Object.keys(corpo).join(', ').slice(0, 200)}`)
    ]);
  } catch (e) {
    throw erroDeRestricao(e) || e;
  }
  return obterPost(db, id);
}

/** Mudança manual de status. Aprovado grava approved_at; Descartado exige motivo; Publicado não passa por aqui. */
export async function mudarStatus(db, id, corpo, sessao) {
  const atual = await obterPost(db, id, { completo: false });
  const para = corpo.para;
  if (!STATUS.includes(para)) throw new ErroApi(422, 'dado_invalido', 'para deve ser um status válido');
  if (para === 'Publicado') {
    throw new ErroApi(422, 'transicao_invalida', 'Publicado é definido pela publicação do blog PT (POST /publicacoes/:id/resultado)');
  }
  if (!TRANSICOES[atual.status].includes(para)) {
    throw new ErroApi(409, 'transicao_invalida', `Não é possível ir de ${atual.status} para ${para}`, { status_atual: atual.status });
  }
  const notas = typeof corpo.notas === 'string' ? corpo.notas.trim().slice(0, 1000) : null;
  const motivo = typeof corpo.motivo === 'string' ? corpo.motivo.trim().slice(0, 500) : '';
  if (para === 'Descartado' && !motivo) throw new ErroApi(422, 'motivo_obrigatorio', 'Descartar exige motivo');
  const agora = agoraIso();
  const novaOrdem =
    para === 'Aprovado'
      ? (await db.prepare(`SELECT IFNULL(MAX(item_order), 0) + 1 AS n FROM posts WHERE status = 'Aprovado'`).first()).n
      : atual.item_order;
  const [upd] = await db.batch([
    db
      .prepare(
        `UPDATE posts SET status = ?2,
           approved_at    = CASE WHEN ?2 = 'Aprovado' THEN ?3 ELSE approved_at END,
           approval_notes = CASE WHEN ?2 = 'Aprovado' THEN COALESCE(?4, approval_notes) ELSE approval_notes END,
           discard_reason = CASE WHEN ?2 = 'Descartado' THEN ?5 ELSE discard_reason END,
           priority       = CASE WHEN ?2 = 'Aprovado' AND ?7 = 1 THEN 'Alta' ELSE priority END,
           item_order     = ?8
         WHERE id = ?1 AND status = ?6`
      )
      .bind(id, para, agora, nz(notas), nz(motivo || null), atual.status, corpo.estrela ? 1 : 0, nz(novaOrdem)),
    db
      .prepare(
        `INSERT INTO post_events (post_id, from_status, to_status, actor, notes)
         SELECT ?1, ?2, ?3, ?4, ?5 WHERE changes() > 0`
      )
      .bind(id, atual.status, para, sessao.ator, nz(motivo || notas))
  ]);
  if (!upd.meta || !upd.meta.changes) throw new ErroApi(409, 'conflito', 'O item mudou enquanto era atualizado; releia', { status_atual: atual.status });
  return obterPost(db, id);
}

/** Reordena os itens de um status (Novo ou Aprovado) na ordem dos ids enviados: 1..n. */
export async function reordenar(db, corpo, sessao) {
  const status = corpo.status;
  if (!['Novo', 'Aprovado'].includes(status)) throw new ErroApi(422, 'dado_invalido', 'status deve ser Novo ou Aprovado');
  const ids = Array.isArray(corpo.ids) ? corpo.ids.map(Number) : [];
  if (!ids.length || ids.some((n) => !Number.isInteger(n)) || new Set(ids).size !== ids.length) {
    throw new ErroApi(422, 'dado_invalido', 'ids deve ser lista de ids distintos');
  }
  const atuais = (await db.prepare('SELECT id FROM posts WHERE status = ?1').bind(status).all()).results.map((r) => r.id);
  const faltando = atuais.filter((id) => !ids.includes(id));
  const estranhos = ids.filter((id) => !atuais.includes(id));
  if (faltando.length || estranhos.length) {
    throw new ErroApi(409, 'lista_desatualizada', 'A lista não corresponde aos itens atuais do status; releia a fila', { faltando, estranhos });
  }
  await db.batch([
    ...ids.map((id, i) => db.prepare('UPDATE posts SET item_order = ?1 WHERE id = ?2 AND status = ?3').bind(i + 1, id, status)),
    db
      .prepare(`INSERT INTO post_events (post_id, from_status, to_status, actor, notes) VALUES (?1, ?2, ?2, ?3, 'reordenação')`)
      .bind(ids[0], status, sessao.ator)
  ]);
  return { status, ordem: ids };
}

/** Fila do canal: o que cada job deve publicar agora. */
export async function filaDoCanal(db, canal, limite = 20) {
  const lim = Math.min(Math.max(Number(limite) || 20, 1), 100);
  if (canal === 'blog') {
    const r = await db
      .prepare(
        `SELECT p.* FROM posts p
         WHERE p.status = 'Aprovado'
           AND NOT EXISTS (SELECT 1 FROM publications b WHERE b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt')
         ORDER BY CASE p.priority WHEN 'Alta' THEN 0 ELSE 1 END, p.item_order, p.added_at
         LIMIT ${lim}`
      )
      .all();
    return (r.results || []).map((p) => ({ ...p, pronto: p.image_source !== 'none', bloqueio: p.image_source === 'none' ? 'sem_capa' : null }));
  }
  if (canal === 'linkedin' || canal === 'x') {
    const r = await db
      .prepare(
        `SELECT p.*, b.url AS blog_url, b.published_at AS blog_published_at FROM posts p
         JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'publicado'
         WHERE NOT EXISTS (SELECT 1 FROM publications c WHERE c.post_id = p.id AND c.channel = ?1)
         ORDER BY b.published_at
         LIMIT ${lim}`
      )
      .bind(canal)
      .all();
    return r.results || [];
  }
  if (canal === 'traducoes') {
    const r = await db
      .prepare(
        `SELECT p.id, p.topic, p.slug, b.url AS blog_url,
                (SELECT status FROM publications t WHERE t.post_id = p.id AND t.channel = 'blog' AND t.lang = 'es') AS es,
                (SELECT status FROM publications t WHERE t.post_id = p.id AND t.channel = 'blog' AND t.lang = 'en') AS en
         FROM posts p
         JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'publicado'
         WHERE (SELECT COUNT(*) FROM publications t WHERE t.post_id = p.id AND t.channel = 'blog' AND t.lang IN ('es','en')) < 2
         ORDER BY b.published_at LIMIT ${lim}`
      )
      .all();
    return r.results || [];
  }
  throw new ErroApi(404, 'nao_encontrado', 'Canal desconhecido (blog, linkedin, x, traducoes)');
}
