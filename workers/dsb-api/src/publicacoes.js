import { ErroApi, agoraIso, nz, erroDeRestricao } from './http.js';
import { CANAIS, IDIOMAS } from './regras.js';
import { obterPost } from './posts.js';

async function blogPt(db, postId) {
  return db
    .prepare(`SELECT * FROM publications WHERE post_id = ?1 AND channel = 'blog' AND lang = 'pt'`)
    .bind(postId)
    .first();
}

/**
 * Reserva a publicação antes de publicar no canal (status pendente).
 * O UNIQUE (post, canal, idioma) garante que dois agentes não publicam o mesmo item.
 * Pré-condições:
 *  - blog/pt: item Aprovado e com capa;
 *  - blog/es|en, linkedin, x: blog PT já publicado.
 * Uma linha em "falhou" pode ser reservada de novo.
 */
export async function reservar(db, corpo, sessao) {
  const postId = Number(corpo.post_id);
  if (!Number.isInteger(postId)) throw new ErroApi(422, 'dado_invalido', 'post_id obrigatório');
  const canal = corpo.canal;
  const idioma = corpo.idioma || 'pt';
  if (!CANAIS.includes(canal)) throw new ErroApi(422, 'dado_invalido', `canal deve ser um de: ${CANAIS.join(', ')}`);
  if (!IDIOMAS.includes(idioma)) throw new ErroApi(422, 'dado_invalido', `idioma deve ser um de: ${IDIOMAS.join(', ')}`);
  if (canal !== 'blog' && idioma !== 'pt') throw new ErroApi(422, 'dado_invalido', 'LinkedIn e X só têm idioma pt');

  const post = await obterPost(db, postId, { completo: false });
  if (canal === 'blog' && idioma === 'pt') {
    if (post.status !== 'Aprovado') throw new ErroApi(409, 'nao_aprovado', `Item está ${post.status}; o blog só publica Aprovado`, { status_atual: post.status });
    if (post.image_source === 'none' || !post.image_url) throw new ErroApi(409, 'sem_capa', 'Item sem capa em covers.duarte.top');
    if (!post.briefing_md) throw new ErroApi(409, 'sem_briefing', 'Item sem briefing_md');
    if (!post.slug) throw new ErroApi(409, 'sem_slug', 'Item sem slug');
  } else {
    const pt = await blogPt(db, postId);
    if (!pt || pt.status !== 'publicado') throw new ErroApi(409, 'blog_nao_publicado', 'O blog PT ainda não foi publicado para este item');
  }

  const existente = await db
    .prepare('SELECT * FROM publications WHERE post_id = ?1 AND channel = ?2 AND lang = ?3')
    .bind(postId, canal, idioma)
    .first();
  if (existente) {
    if (existente.status !== 'falhou') {
      throw new ErroApi(409, 'publicacao_ja_reservada', `Publicação ${canal}/${idioma} já está ${existente.status}`, {
        chave: `pub:${postId}:${canal}:${idioma}`,
        publicacao: existente
      });
    }
    const r = await db
      .prepare(`UPDATE publications SET status = 'pendente', agent = ?2 WHERE id = ?1 AND status = 'falhou' RETURNING *`)
      .bind(existente.id, sessao.ator)
      .first();
    if (!r) throw new ErroApi(409, 'publicacao_ja_reservada', 'Outro job reservou esta publicação agora');
    return { ...r, retomada: true };
  }
  try {
    return await db
      .prepare(`INSERT INTO publications (post_id, channel, lang, status, agent) VALUES (?1, ?2, ?3, 'pendente', ?4) RETURNING *`)
      .bind(postId, canal, idioma, sessao.ator)
      .first();
  } catch (e) {
    throw erroDeRestricao(e) || e;
  }
}

/**
 * Conclui uma publicação reservada: publicado (com URL), falhou (com erro) ou pulado (com motivo).
 * blog/pt publicado → o item passa a Publicado.
 */
export async function concluir(db, id, corpo, sessao) {
  const pub = await db.prepare('SELECT * FROM publications WHERE id = ?1').bind(id).first();
  if (!pub) throw new ErroApi(404, 'nao_encontrado', 'Publicação não encontrada');
  if (pub.status !== 'pendente') throw new ErroApi(409, 'publicacao_nao_pendente', `Publicação está ${pub.status}; só pendente pode ser concluída`);
  const status = corpo.status;
  if (!['publicado', 'falhou', 'pulado'].includes(status)) throw new ErroApi(422, 'dado_invalido', 'status deve ser publicado, falhou ou pulado');

  const texto = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
  const url = texto(corpo.url, 500);
  const erro = texto(corpo.erro, 2000);
  if (status === 'publicado' && !url) throw new ErroApi(422, 'campo_obrigatorio', 'publicado exige url');
  if (status === 'publicado' && url && !/^https:\/\//.test(url)) throw new ErroApi(422, 'url_invalida', 'url deve ser https');
  if (status !== 'publicado' && !erro) throw new ErroApi(422, 'campo_obrigatorio', `${status} exige erro (motivo)`);
  let publicadoEm = null;
  if (status === 'publicado') {
    publicadoEm = corpo.published_at && !Number.isNaN(Date.parse(corpo.published_at)) ? corpo.published_at : agoraIso();
  }

  const stmts = [
    db
      .prepare(
        `UPDATE publications SET status = ?2, url = COALESCE(?3, url), external_id = COALESCE(?4, external_id),
           body = COALESCE(?5, body), published_at = ?6,
           attempts = attempts + CASE WHEN ?2 = 'falhou' THEN 1 ELSE 0 END,
           last_error = CASE WHEN ?2 = 'publicado' THEN NULL ELSE ?7 END,
           agent = ?8
         WHERE id = ?1 AND status = 'pendente'`
      )
      .bind(id, status, url, texto(corpo.external_id, 200), texto(corpo.body, 10000), nz(publicadoEm), erro, sessao.ator)
  ];
  const viraPublicado = status === 'publicado' && pub.channel === 'blog' && pub.lang === 'pt';
  if (viraPublicado) {
    stmts.push(
      db.prepare(`UPDATE posts SET status = 'Publicado' WHERE id = ?1 AND status = 'Aprovado'`).bind(pub.post_id),
      db
        .prepare(
          `INSERT INTO post_events (post_id, from_status, to_status, actor, notes)
           SELECT ?1, 'Aprovado', 'Publicado', ?2, ?3 WHERE changes() > 0`
        )
        .bind(pub.post_id, sessao.ator, url)
    );
  }
  let res;
  try {
    res = await db.batch(stmts);
  } catch (e) {
    throw erroDeRestricao(e) || e;
  }
  if (!res[0].meta || !res[0].meta.changes) throw new ErroApi(409, 'conflito', 'A publicação mudou enquanto era concluída; releia');
  const atualizada = await db.prepare('SELECT * FROM publications WHERE id = ?1').bind(id).first();
  return { publicacao: atualizada, item_publicado: viraPublicado && !!(res[1].meta && res[1].meta.changes) };
}
