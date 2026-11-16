import { ErroApi, agoraIso, nz } from './http.js';

const SEVERIDADES = ['info', 'aviso', 'erro', 'critico'];
const ETAPAS = ['curadoria', 'avaliacao', 'capa', 'aprovacao', 'blog', 'linkedin', 'x', 'job', 'carga', 'api'];

const UPSERT = `
INSERT INTO issues (fingerprint, source, check_name, kind, severity, stage, post_id, publication_id,
                    job_run_id, agent, summary, detail, suggested_action, first_seen_at, last_seen_at)
VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?14)
ON CONFLICT(fingerprint) WHERE status IN ('aberto','em_correcao') DO UPDATE SET
  occurrences = occurrences + 1,
  last_seen_at = excluded.last_seen_at,
  severity = excluded.severity,
  summary = excluded.summary,
  detail = COALESCE(excluded.detail, detail)
RETURNING id, occurrences, status`;

/**
 * Registra (ou incrementa) uma pendência vinda da API ou de um agente.
 * Uma pendência ignorada não é reaberta pelo mesmo fingerprint.
 */
export async function registrar(db, p) {
  if (!SEVERIDADES.includes(p.severity)) throw new ErroApi(422, 'dado_invalido', 'severity inválida');
  if (!ETAPAS.includes(p.stage)) throw new ErroApi(422, 'dado_invalido', 'stage inválido');
  if (!p.fingerprint || !p.kind || !p.summary) throw new ErroApi(422, 'campo_obrigatorio', 'fingerprint, kind e summary são obrigatórios');
  const ignorada = await db
    .prepare(`SELECT id FROM issues WHERE fingerprint = ?1 AND status = 'ignorado' LIMIT 1`)
    .bind(p.fingerprint)
    .first();
  if (ignorada) return { id: ignorada.id, status: 'ignorado', ignorada: true };
  return db
    .prepare(UPSERT)
    .bind(
      String(p.fingerprint).slice(0, 300),
      p.source,
      nz(p.check_name),
      String(p.kind).slice(0, 80),
      p.severity,
      p.stage,
      nz(p.post_id),
      nz(p.publication_id),
      nz(p.job_run_id),
      nz(p.agent),
      String(p.summary).slice(0, 500),
      p.detail == null ? null : (typeof p.detail === 'string' ? p.detail : JSON.stringify(p.detail)).slice(0, 8000),
      nz(p.suggested_action),
      agoraIso()
    )
    .first();
}

/** Escrita recusada pela API → pendência (source = api). Nunca derruba a resposta original. */
export async function registrarRecusa(db, { erro, rota, sessao, corpo, postId = null }) {
  try {
    const alvo = erro.extra && erro.extra.chave ? erro.extra.chave : postId != null ? `post:${postId}` : rota;
    const r = await registrar(db, {
      fingerprint: `api:${erro.codigo}:${alvo}`.slice(0, 300),
      source: 'api',
      kind: `recusa_${erro.codigo}`,
      severity: erro.status >= 500 ? 'erro' : 'aviso',
      stage: etapaDaRota(rota),
      post_id: postId,
      agent: sessao ? sessao.ator : null,
      summary: `${rota}: ${erro.message}`,
      detail: { codigo: erro.codigo, extra: erro.extra || null, corpo: resumirCorpo(corpo) },
      suggested_action: acaoSugerida(erro.codigo)
    });
    return r ? r.id : null;
  } catch {
    return null;
  }
}

function etapaDaRota(rota) {
  if (rota.startsWith('POST /posts') && !rota.includes('/status')) return 'curadoria';
  if (rota.includes('/status')) return 'aprovacao';
  if (rota.includes('/publicacoes')) return 'blog';
  if (rota.includes('/jobs')) return 'job';
  return 'api';
}

function acaoSugerida(codigo) {
  return (
    {
      assunto_ja_coberto: 'Não inserir de novo; se houver fato novo, enviar como follow_up_of do item existente',
      assunto_descartado: 'Assunto já descartado; só reenviar como follow_up_of com fato novo',
      slug_em_uso: 'Gerar outro slug',
      sem_chave: 'Informar os CVEs do item ou uma URL específica da matéria',
      sem_capa: 'Rodar dsb-covers antes de publicar no blog',
      blog_nao_publicado: 'Publicar o blog PT antes do canal derivado',
      transicao_invalida: 'Conferir o status atual do item antes de mudar',
      capa_fora_do_host: 'Subir a capa para covers.duarte.top',
      publicacao_ja_reservada: 'Outro job já reservou ou concluiu esta publicação; não repetir'
    }[codigo] || 'Conferir os dados enviados e repetir a operação'
  );
}

function resumirCorpo(corpo) {
  if (!corpo || typeof corpo !== 'object') return null;
  const out = {};
  for (const [k, v] of Object.entries(corpo)) out[k] = typeof v === 'string' && v.length > 300 ? `${v.slice(0, 300)}… (${v.length} car.)` : v;
  return out;
}

const FILTROS = { status: 'status', severity: 'severity', stage: 'stage', source: 'source', kind: 'kind', post_id: 'post_id' };

export async function listar(db, params) {
  const where = [];
  const binds = [];
  for (const [p, col] of Object.entries(FILTROS)) {
    const v = params.get(p);
    if (v == null || v === '') continue;
    const valores = v.split(',').map((x) => x.trim()).filter(Boolean).slice(0, 10);
    where.push(`${col} IN (${valores.map(() => '?').join(',')})`);
    binds.push(...valores.map((x) => (col === 'post_id' ? Number(x) : x)));
  }
  if (!params.get('status')) where.push(`status IN ('aberto','em_correcao')`);
  const limite = Math.min(Math.max(Number(params.get('limite')) || 100, 1), 500);
  const sql = `SELECT * FROM issues ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY CASE severity WHEN 'critico' THEN 0 WHEN 'erro' THEN 1 WHEN 'aviso' THEN 2 ELSE 3 END, last_seen_at DESC
    LIMIT ${limite}`;
  const r = await db.prepare(sql).bind(...binds).all();
  return r.results || [];
}

export async function resumo(db) {
  const r = await db
    .prepare(
      `SELECT stage, severity, COUNT(*) AS n FROM issues WHERE status IN ('aberto','em_correcao')
       GROUP BY stage, severity ORDER BY stage, severity`
    )
    .all();
  return r.results || [];
}

const FINAIS = ['resolvido', 'ignorado'];

/** Tratamento manual: em_correcao, resolvido ou ignorado (os dois últimos exigem nota). */
export async function atualizar(db, id, corpo, sessao) {
  const para = corpo.status;
  if (!['aberto', 'em_correcao', 'resolvido', 'ignorado'].includes(para)) throw new ErroApi(422, 'dado_invalido', 'status inválido');
  const nota = typeof corpo.resolution === 'string' ? corpo.resolution.trim().slice(0, 1000) : '';
  if (FINAIS.includes(para) && !nota) throw new ErroApi(422, 'nota_obrigatoria', 'Resolver ou ignorar exige uma nota (resolution)');
  const atual = await db.prepare('SELECT * FROM issues WHERE id = ?1').bind(id).first();
  if (!atual) throw new ErroApi(404, 'nao_encontrado', 'Pendência não encontrada');
  if (FINAIS.includes(atual.status)) throw new ErroApi(409, 'pendencia_fechada', `Pendência já está ${atual.status}`);
  const r = await db
    .prepare(
      `UPDATE issues SET status = ?2,
         resolved_at = CASE WHEN ?2 IN ('resolvido','ignorado') THEN ?3 ELSE NULL END,
         resolved_by = CASE WHEN ?2 IN ('resolvido','ignorado') THEN ?4 ELSE NULL END,
         resolution  = CASE WHEN ?2 IN ('resolvido','ignorado') THEN ?5 ELSE resolution END
       WHERE id = ?1 AND status = ?6 RETURNING *`
    )
    .bind(id, para, agoraIso(), sessao.ator, nota || null, atual.status)
    .first();
  if (!r) throw new ErroApi(409, 'conflito', 'A pendência mudou enquanto era atualizada; releia');
  return r;
}

export async function marcarNotificadas(db, ids) {
  const lista = (Array.isArray(ids) ? ids : []).map(Number).filter(Number.isInteger).slice(0, 200);
  if (!lista.length) return 0;
  const r = await db
    .prepare(`UPDATE issues SET notified_at = ?1 WHERE id IN (${lista.map((_, i) => `?${i + 2}`).join(',')}) AND notified_at IS NULL`)
    .bind(agoraIso(), ...lista)
    .run();
  return (r.meta && r.meta.changes) || 0;
}

const VIEW_OK = /^v_hc_[a-z_]+$/;

/**
 * Varredura: abre/atualiza o que as verificações encontram e fecha sozinho o que deixou de ocorrer.
 * Só fecha pendências das verificações que rodaram sem erro nesta varredura.
 */
export async function varrer(db) {
  const inicio = agoraIso();
  const checks = (await db.prepare('SELECT name, view_name FROM health_checks WHERE enabled = 1 ORDER BY name').all()).results || [];
  const out = { inicio, verificacoes: 0, abertas_ou_vistas: 0, fechadas: 0, falhas: [] };
  for (const c of checks) {
    if (!VIEW_OK.test(c.view_name)) {
      out.falhas.push({ check: c.name, erro: 'view_name inválido' });
      continue;
    }
    try {
      const ins = await db
        .prepare(
          `INSERT INTO issues (fingerprint, source, check_name, kind, severity, stage, post_id, publication_id,
                               summary, suggested_action, first_seen_at, last_seen_at)
           SELECT h.fingerprint, 'health', ?1, h.kind, h.severity, h.stage, h.post_id, h.publication_id,
                  h.summary, h.suggested_action, ?2, ?2
           FROM ${c.view_name} h
           WHERE NOT EXISTS (SELECT 1 FROM issues i WHERE i.fingerprint = h.fingerprint AND i.status = 'ignorado')
           ON CONFLICT(fingerprint) WHERE status IN ('aberto','em_correcao') DO UPDATE SET
             occurrences = occurrences + 1, last_seen_at = excluded.last_seen_at,
             severity = excluded.severity, summary = excluded.summary`
        )
        .bind(c.name, inicio)
        .run();
      const fec = await db
        .prepare(
          `UPDATE issues SET status = 'resolvido', resolved_at = ?2, resolved_by = 'auto',
                  resolution = 'Condição deixou de ocorrer'
           WHERE source = 'health' AND check_name = ?1 AND status IN ('aberto','em_correcao') AND last_seen_at < ?2`
        )
        .bind(c.name, inicio)
        .run();
      out.verificacoes++;
      out.abertas_ou_vistas += (ins.meta && ins.meta.changes) || 0;
      out.fechadas += (fec.meta && fec.meta.changes) || 0;
    } catch (e) {
      out.falhas.push({ check: c.name, erro: String((e && e.message) || e).slice(0, 200) });
    }
  }
  return out;
}
