/**
 * Estado do envio em SQLite (Durable Object em produção, node:sqlite nos testes).
 * Artigo só fica `concluido` quando a descoberta terminou e não há entrega pendente
 * nem esgotada. `enviado` não volta para a fila. 404/410 não são retentados.
 */
import { dataBrasilia } from '../../../src/lib/push-catalogo.mjs';
import {
  INTERVALO_CATALOGO_MS,
  JANELA_ATRASO_MS,
  LOTE_ENVIO,
  LOTE_KV,
  LOCK_MS,
  MAX_TENTATIVAS,
  STALE_ENVIO_MS,
  TOPICO,
} from './constantes.js';
import { atrasoMs } from './entrega.js';
import { inscricaoCompativel } from './filtros.js';
import { payloadPush } from './titulos.js';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function criarSchema(db) {
  db.exec(`CREATE TABLE IF NOT EXISTS meta (
    chave TEXT PRIMARY KEY,
    valor TEXT NOT NULL
  )`);
  db.exec(`CREATE TABLE IF NOT EXISTS artigos (
    slug TEXT PRIMARY KEY,
    titulo TEXT NOT NULL,
    url TEXT NOT NULL,
    data TEXT NOT NULL,
    tipo TEXT,
    pais TEXT,
    publicado_em TEXT NOT NULL,
    status TEXT NOT NULL,
    no_ar INTEGER NOT NULL DEFAULT 0,
    atualizado TEXT NOT NULL
  )`);
  db.exec(`CREATE TABLE IF NOT EXISTS entregas (
    slug TEXT NOT NULL,
    inscrito TEXT NOT NULL,
    status TEXT NOT NULL,
    tentativas INTEGER NOT NULL DEFAULT 0,
    proxima TEXT,
    http_status INTEGER,
    atualizado TEXT NOT NULL,
    PRIMARY KEY (slug, inscrito)
  )`);
}

export function lerMeta(db, chave) {
  const rows = db.exec(`SELECT valor FROM meta WHERE chave = ?`, [chave]);
  return rows.length ? rows[0].valor : null;
}

export function gravarMeta(db, chave, valor) {
  db.exec(
    `INSERT INTO meta (chave, valor) VALUES (?, ?)
     ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor`,
    [chave, valor],
  );
}

function apagarMeta(db, chave) {
  db.exec(`DELETE FROM meta WHERE chave = ?`, [chave]);
}

function artigo(db, slug) {
  const rows = db.exec(`SELECT * FROM artigos WHERE slug = ?`, [slug]);
  return rows[0] || null;
}

function slugValido(slug) {
  return typeof slug === 'string' && slug.length <= 160 && SLUG.test(slug);
}

function iso(data) {
  return (data instanceof Date ? data : new Date(data)).toISOString();
}

function adquirirLock(db, dono, lockMs) {
  const ate = lerMeta(db, 'lock_ate');
  const atual = lerMeta(db, 'lock_dono');
  if (ate && atual && atual !== dono && Date.parse(ate) > Date.now()) return false;
  gravarMeta(db, 'lock_dono', dono);
  gravarMeta(db, 'lock_ate', new Date(Date.now() + lockMs).toISOString());
  return true;
}

function renovarLock(db, dono, lockMs) {
  if (lerMeta(db, 'lock_dono') !== dono) return false;
  gravarMeta(db, 'lock_ate', new Date(Date.now() + lockMs).toISOString());
  return true;
}

function soltarLock(db, dono) {
  if (lerMeta(db, 'lock_dono') !== dono) return;
  apagarMeta(db, 'lock_dono');
  apagarMeta(db, 'lock_ate');
}

function garantirArtigo(db, item, status, agoraIso, noAr) {
  const row = artigo(db, item.slug);
  const flag = noAr ? 1 : row ? row.no_ar : 0;
  if (!row) {
    db.exec(
      `INSERT INTO artigos (slug, titulo, url, data, tipo, pais, publicado_em, status, no_ar, atualizado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        item.slug,
        item.titulo,
        item.url,
        item.data,
        item.tipo ?? null,
        item.pais ?? null,
        item.publicadoEm,
        status,
        flag,
        agoraIso,
      ],
    );
    return;
  }
  if (row.status === 'concluido' || row.status === 'ignorado') return;
  db.exec(
    `UPDATE artigos
     SET titulo = ?, url = ?, data = ?, tipo = ?, pais = ?, publicado_em = ?, status = ?, no_ar = ?, atualizado = ?
     WHERE slug = ?`,
    [
      item.titulo,
      item.url,
      item.data,
      item.tipo ?? null,
      item.pais ?? null,
      item.publicadoEm,
      status,
      flag,
      agoraIso,
      item.slug,
    ],
  );
}

function contagens(db, slug) {
  const rows = db.exec(
    `SELECT status, COUNT(*) AS n FROM entregas WHERE slug = ? GROUP BY status`,
    [slug],
  );
  const mapa = {};
  for (const row of rows) mapa[row.status] = Number(row.n);
  return mapa;
}

function recalcular(db, slug, agoraIso) {
  const row = artigo(db, slug);
  if (!row || row.status === 'ignorado' || row.status === 'aguardando') return row && row.status;
  const descoberta = lerMeta(db, `descoberta:${slug}`) === 'completa';
  const c = contagens(db, slug);
  const pendente = (c.pendente || 0) + (c.enviando || 0);
  let status;
  if (!descoberta || pendente > 0) status = 'pendente';
  else if ((c.esgotado || 0) > 0) status = 'parcial';
  else status = 'concluido';
  db.exec(`UPDATE artigos SET status = ?, atualizado = ? WHERE slug = ?`, [status, agoraIso, slug]);
  return status;
}

function itemDoArtigo(row) {
  const item = {
    slug: row.slug,
    titulo: row.titulo,
    url: row.url,
    data: row.data,
    publicadoEm: row.publicado_em,
  };
  if (row.tipo) item.tipo = row.tipo;
  if (row.pais) item.pais = row.pais;
  return item;
}

function envioLigado(db, opts) {
  const operacional = lerMeta(db, 'envio') === 'on';
  const segredo = opts.pushEnvio === true || opts.pushEnvio === 'on';
  return operacional && segredo;
}

function proximoEspera(db, agoraMs, dentroJanela, intervalo, esperaCatalogo) {
  const agoraIso = new Date(agoraMs).toISOString();
  const devidos = db.exec(
    `SELECT COUNT(*) AS n FROM entregas
     WHERE status = 'pendente' AND (proxima IS NULL OR proxima <= ?)`,
    [agoraIso],
  );
  if (Number(devidos[0].n) > 0) return { continuar: true, esperarMs: 1000 };

  const incompletos = db.exec(
    `SELECT slug FROM artigos WHERE no_ar = 1 AND status NOT IN ('concluido', 'ignorado', 'parcial')`,
  );
  for (const row of incompletos) {
    if (lerMeta(db, `descoberta:${row.slug}`) !== 'completa') {
      return { continuar: true, esperarMs: 1000 };
    }
  }

  let espera = null;
  const futuros = db.exec(
    `SELECT proxima FROM entregas WHERE status = 'pendente' AND proxima > ? ORDER BY proxima LIMIT 1`,
    [agoraIso],
  );
  if (futuros.length) espera = Math.max(1000, Date.parse(futuros[0].proxima) - agoraMs);

  if (dentroJanela && esperaCatalogo) {
    const w = intervalo;
    espera = espera === null ? w : Math.min(espera, w);
  }
  const aguardando = db.exec(`SELECT COUNT(*) AS n FROM artigos WHERE status = 'aguardando'`);
  if (Number(aguardando[0].n) > 0 && dentroJanela) {
    espera = espera === null ? intervalo : Math.min(espera, intervalo);
  }
  if (espera === null) return { continuar: false, esperarMs: 0 };
  return { continuar: true, esperarMs: Math.min(espera, 15 * 60 * 1000) };
}

export function definirEnvio(db, ligado) {
  if (typeof ligado !== 'boolean') return { ok: false, erro: 'ligado_booleano' };
  gravarMeta(db, 'envio', ligado ? 'on' : 'off');
  return { ok: true, envio: ligado ? 'on' : 'off' };
}

export function importarHistorico(db, corpo, agora) {
  if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) return { ok: false, erro: 'corpo' };
  const agoraIso = iso(agora);
  const mapa = {};
  if (corpo.enviados !== undefined) {
    if (!corpo.enviados || typeof corpo.enviados !== 'object' || Array.isArray(corpo.enviados)) {
      return { ok: false, erro: 'enviados' };
    }
    for (const [slug, quando] of Object.entries(corpo.enviados)) {
      if (!slugValido(slug)) return { ok: false, erro: 'slug' };
      if (typeof quando !== 'string' || Number.isNaN(Date.parse(quando))) return { ok: false, erro: 'data' };
      mapa[slug] = new Date(quando).toISOString();
    }
  }
  if (corpo.slugs !== undefined) {
    if (!Array.isArray(corpo.slugs)) return { ok: false, erro: 'slugs' };
    for (const slug of corpo.slugs) {
      if (!slugValido(slug)) return { ok: false, erro: 'slug' };
      if (!mapa[slug]) mapa[slug] = agoraIso;
    }
  }
  let cutoffNovo = null;
  if (corpo.cutoff !== undefined) {
    if (typeof corpo.cutoff !== 'string' || Number.isNaN(Date.parse(corpo.cutoff))) {
      return { ok: false, erro: 'cutoff' };
    }
    cutoffNovo = new Date(corpo.cutoff).toISOString();
    const atual = lerMeta(db, 'cutoff');
    if (atual && Date.parse(cutoffNovo) < Date.parse(atual)) return { ok: false, erro: 'cutoff_retrocede' };
  }

  const conflitos = [];
  let concluidos = 0;
  let ja = 0;
  for (const [slug, quando] of Object.entries(mapa)) {
    const row = artigo(db, slug);
    const nEnt = row
      ? Number(db.exec(`SELECT COUNT(*) AS n FROM entregas WHERE slug = ?`, [slug])[0].n)
      : 0;
    if (row && row.status !== 'concluido' && nEnt > 0) {
      conflitos.push(slug);
      continue;
    }
    if (row && (row.status === 'pendente' || row.status === 'parcial') && nEnt === 0) {
      conflitos.push(slug);
      continue;
    }
    if (row?.status === 'concluido') {
      ja += 1;
      continue;
    }
    const prefixo = slug.slice(0, 10);
    const data = /^\d{4}-\d{2}-\d{2}$/.test(prefixo) ? prefixo : '1970-01-01';
    if (!row) {
      db.exec(
        `INSERT INTO artigos (slug, titulo, url, data, tipo, pais, publicado_em, status, no_ar, atualizado)
         VALUES (?, '(histórico)', ?, ?, NULL, NULL, ?, 'concluido', 0, ?)`,
        [slug, `/briefings/${slug}`, data, quando, agoraIso],
      );
    } else {
      db.exec(
        `UPDATE artigos SET status = 'concluido', atualizado = ? WHERE slug = ?`,
        [agoraIso, slug],
      );
    }
    gravarMeta(db, `descoberta:${slug}`, 'completa');
    concluidos += 1;
  }
  if (cutoffNovo) gravarMeta(db, 'cutoff', cutoffNovo);
  return {
    ok: true,
    concluidos,
    ja_concluidos: ja,
    conflitos,
    cutoff: lerMeta(db, 'cutoff'),
  };
}

export function lerStatus(db, extra = {}) {
  const artigos = db.exec(`SELECT slug, status, data, atualizado FROM artigos ORDER BY data, slug`);
  const grupos = db.exec(`SELECT slug, status, COUNT(*) AS n FROM entregas GROUP BY slug, status`);
  const porSlug = {};
  for (const row of grupos) {
    if (!porSlug[row.slug]) porSlug[row.slug] = {};
    porSlug[row.slug][row.status] = Number(row.n);
  }
  return {
    envio: lerMeta(db, 'envio') === 'on' ? 'on' : 'off',
    pushEnvio: extra.pushEnvio ? 'on' : 'off',
    cutoff: lerMeta(db, 'cutoff'),
    janelaAte: lerMeta(db, 'janela_ate'),
    artigos: artigos.map((row) => ({
      slug: row.slug,
      status: row.status,
      data: row.data,
      atualizado: row.atualizado,
      entregas: porSlug[row.slug] || {},
    })),
  };
}

export function simularPlano({ catalogo, inscritos, agora, cutoff, envio, pushEnvio }) {
  const agoraData = agora instanceof Date ? agora : new Date(agora);
  const hoje = dataBrasilia(agoraData);
  const itens = Array.isArray(catalogo) ? catalogo : (catalogo && catalogo.itens) || [];
  const candidatos = [];
  const ignorados = [];
  let foraDoDia = 0;
  for (const item of itens) {
    if (item.data !== hoje) {
      foraDoDia += 1;
      continue;
    }
    if (Date.parse(item.publicadoEm) > agoraData.getTime()) {
      ignorados.push({ slug: item.slug, motivo: 'futuro' });
      continue;
    }
    if (cutoff && Date.parse(item.publicadoEm) < Date.parse(cutoff)) {
      ignorados.push({ slug: item.slug, motivo: 'antes_do_cutoff' });
      continue;
    }
    const destinatarios = (inscritos || []).filter(
      (s) => s && !s.ilegivel && inscricaoCompativel(s, { tipo: item.tipo, pais: item.pais, topico: TOPICO }),
    ).length;
    candidatos.push({
      slug: item.slug,
      titulo: payloadPush(item).titulo,
      texto: item.titulo,
      url: item.url,
      tag: item.slug,
      tipo: item.tipo ?? null,
      pais: item.pais ?? null,
      destinatarios,
    });
  }
  const ligado = envio === true || envio === 'on';
  const push = pushEnvio === true || pushEnvio === 'on';
  return {
    hoje,
    envio: ligado ? 'on' : 'off',
    pushEnvio: push ? 'on' : 'off',
    cutoff: cutoff || null,
    enviaria: Boolean(ligado && push && cutoff && candidatos.some((c) => c.destinatarios > 0)),
    candidatos,
    ignorados,
    foraDoDia,
  };
}

export async function executarTick(db, opts) {
  const agora = opts.agora instanceof Date ? opts.agora : new Date(opts.agora || Date.now());
  const agoraMs = agora.getTime();
  const agoraIso = agora.toISOString();
  const pushOn = opts.pushEnvio === true || opts.pushEnvio === 'on';
  const operacional = lerMeta(db, 'envio') === 'on';
  if (!pushOn || !operacional) {
    return {
      ok: true,
      enviou: false,
      motivo: 'desligado',
      envio: operacional ? 'on' : 'off',
      pushEnvio: pushOn ? 'on' : 'off',
      continuar: false,
    };
  }
  const cutoff = lerMeta(db, 'cutoff');
  if (!cutoff) return { ok: true, enviou: false, motivo: 'sem_cutoff', continuar: false };
  if (opts.vapidDisponivel && !(await opts.vapidDisponivel())) {
    return { ok: true, enviou: false, motivo: 'sem_vapid', continuar: false };
  }

  const dono = opts.dono || crypto.randomUUID();
  const lockMs = opts.lockMs ?? LOCK_MS;
  if (!adquirirLock(db, dono, lockMs)) {
    return { ok: true, enviou: false, motivo: 'ocupado', continuar: false, tocarAlarme: false };
  }

  const loteEnvio = opts.loteEnvio ?? LOTE_ENVIO;
  const loteKv = opts.loteKv ?? LOTE_KV;
  const intervalo = opts.intervaloCatalogoMs ?? INTERVALO_CATALOGO_MS;
  const maxTentativas = opts.maxTentativas ?? MAX_TENTATIVAS;
  let enviados = 0;
  let expirados = 0;
  let transientes = 0;
  let esgotados = 0;
  let ilegivel = 0;

  try {
    if (opts.origem === 'cron' && opts.programado) {
      const base = Date.parse(opts.programado);
      if (!Number.isNaN(base)) {
        const ate = new Date(base + (opts.janelaMs ?? JANELA_ATRASO_MS)).toISOString();
        const atual = lerMeta(db, 'janela_ate');
        if (!atual || Date.parse(ate) > Date.parse(atual)) gravarMeta(db, 'janela_ate', ate);
      }
    }
    const janelaAte = lerMeta(db, 'janela_ate');
    const dentroJanela = Boolean(janelaAte && agoraMs <= Date.parse(janelaAte));

    const limiteStale = new Date(agoraMs - (opts.staleMs ?? STALE_ENVIO_MS)).toISOString();
    db.exec(
      `UPDATE entregas SET status = 'pendente', atualizado = ?
       WHERE status = 'enviando' AND atualizado < ?`,
      [agoraIso, limiteStale],
    );

    let cat;
    try {
      cat = await opts.catalogo();
    } catch {
      cat = { erro: 'rede' };
    }
    // Catálogo fora do ar não cancela entrega já descoberta: o payload sai da linha do artigo.
    let catalogoFalhou = false;
    if (!cat || cat.erro || !Array.isArray(cat.itens)) {
      catalogoFalhou = true;
      cat = { itens: [] };
    }

    const hoje = dataBrasilia(agora);
    const doDia = cat.itens.filter((it) => it.data === hoje);
    const prontos = doDia.filter((it) => Date.parse(it.publicadoEm) <= agoraMs);

    let heads = 0;
    for (const item of prontos) {
      if (!envioLigado(db, opts)) break;
      const row = artigo(db, item.slug);
      if (row && (row.status === 'concluido' || row.status === 'ignorado')) continue;
      if (Date.parse(item.publicadoEm) < Date.parse(cutoff)) {
        garantirArtigo(db, item, 'ignorado', agoraIso, false);
        continue;
      }
      if (row?.no_ar) continue;
      if (heads >= 4) break;
      heads += 1;
      let noAr = false;
      try {
        noAr = await opts.confirmarNoAr(item.url);
      } catch {
        noAr = false;
      }
      garantirArtigo(db, item, noAr ? 'pendente' : 'aguardando', agoraIso, noAr);
    }

    const alvo = prontos.find((it) => {
      const row = artigo(db, it.slug);
      return (
        row &&
        row.no_ar &&
        row.status !== 'concluido' &&
        row.status !== 'ignorado' &&
        lerMeta(db, `descoberta:${it.slug}`) !== 'completa'
      );
    });
    if (alvo && envioLigado(db, opts)) {
      const cursor = lerMeta(db, `cursor:${alvo.slug}`) || undefined;
      let pagina;
      try {
        pagina = await opts.pagina({ cursor, limite: loteKv });
      } catch {
        pagina = null;
      }
      if (pagina) {
        for (const ch of pagina.chaves || []) {
          if (ch.ilegivel) {
            ilegivel += 1;
            continue;
          }
          if (!inscricaoCompativel(ch, { tipo: alvo.tipo, pais: alvo.pais, topico: TOPICO })) continue;
          db.exec(
            `INSERT INTO entregas (slug, inscrito, status, tentativas, proxima, http_status, atualizado)
             VALUES (?, ?, 'pendente', 0, NULL, NULL, ?)
             ON CONFLICT(slug, inscrito) DO NOTHING`,
            [alvo.slug, ch.inscrito, agoraIso],
          );
        }
        if (pagina.completo) {
          gravarMeta(db, `descoberta:${alvo.slug}`, 'completa');
          apagarMeta(db, `cursor:${alvo.slug}`);
        } else if (pagina.cursor) {
          gravarMeta(db, `cursor:${alvo.slug}`, pagina.cursor);
        }
        recalcular(db, alvo.slug, agoraIso);
      }
    }

    const fila = db.exec(
      `SELECT slug, inscrito, tentativas FROM entregas
       WHERE status = 'pendente' AND (proxima IS NULL OR proxima <= ?)
       ORDER BY slug, inscrito
       LIMIT ?`,
      [agoraIso, loteEnvio],
    );
    const tocados = new Set();
    for (const ent of fila) {
      if (!envioLigado(db, opts)) break;
      if (!renovarLock(db, dono, lockMs)) {
        return { ok: true, enviou: enviados > 0, motivo: 'lock_perdido', continuar: true, esperarMs: 1000 };
      }
      db.exec(
        `UPDATE entregas SET status = 'enviando', atualizado = ?
         WHERE slug = ? AND inscrito = ? AND status = 'pendente'`,
        [agoraIso, ent.slug, ent.inscrito],
      );
      const row = artigo(db, ent.slug);
      const doCatalogo = cat.itens.find((it) => it.slug === ent.slug);
      const payload = payloadPush(doCatalogo || itemDoArtigo(row));
      let resultado;
      try {
        resultado = await opts.enviar(ent.inscrito, payload);
      } catch {
        resultado = { classe: 'transiente' };
      }
      tocados.add(ent.slug);
      const tentativas = Number(ent.tentativas) + 1;
      if (resultado && resultado.classe === 'ok') {
        db.exec(
          `UPDATE entregas SET status = 'enviado', tentativas = ?, proxima = NULL, http_status = ?, atualizado = ?
           WHERE slug = ? AND inscrito = ?`,
          [tentativas, resultado.status ?? 201, agoraIso, ent.slug, ent.inscrito],
        );
        enviados += 1;
      } else if (resultado && resultado.classe === 'expirado') {
        try {
          await opts.apagar(ent.inscrito);
        } catch {
          /* a inscrição expira no estado mesmo se o delete falhar; o próximo tick não reenvia */
        }
        db.exec(
          `UPDATE entregas SET status = 'expirado', tentativas = ?, proxima = NULL, http_status = ?, atualizado = ?
           WHERE slug = ? AND inscrito = ?`,
          [tentativas, resultado.status ?? null, agoraIso, ent.slug, ent.inscrito],
        );
        expirados += 1;
      } else if (resultado && resultado.classe === 'permanente') {
        db.exec(
          `UPDATE entregas SET status = 'esgotado', tentativas = ?, proxima = NULL, http_status = ?, atualizado = ?
           WHERE slug = ? AND inscrito = ?`,
          [tentativas, resultado.status ?? null, agoraIso, ent.slug, ent.inscrito],
        );
        esgotados += 1;
      } else if (tentativas >= maxTentativas) {
        db.exec(
          `UPDATE entregas SET status = 'esgotado', tentativas = ?, proxima = NULL, http_status = ?, atualizado = ?
           WHERE slug = ? AND inscrito = ?`,
          [tentativas, resultado && resultado.status ? resultado.status : null, agoraIso, ent.slug, ent.inscrito],
        );
        esgotados += 1;
      } else {
        const ms = atrasoMs(tentativas, {
          status: resultado && resultado.status,
          retryAfterSeg: resultado && resultado.retryAfterSeg,
        });
        const proxima = new Date(agoraMs + ms).toISOString();
        db.exec(
          `UPDATE entregas SET status = 'pendente', tentativas = ?, proxima = ?, http_status = ?, atualizado = ?
           WHERE slug = ? AND inscrito = ?`,
          [tentativas, proxima, resultado && resultado.status ? resultado.status : null, agoraIso, ent.slug, ent.inscrito],
        );
        transientes += 1;
      }
    }
    for (const slug of tocados) recalcular(db, slug, agoraIso);

    const futuroNoDia = doDia.some((it) => Date.parse(it.publicadoEm) > agoraMs);
    const esperaCatalogo = doDia.length === 0 || (prontos.length === 0 && futuroNoDia);
    let esperaExtra = null;
    if (dentroJanela && futuroNoDia) {
      for (const it of doDia) {
        const em = Date.parse(it.publicadoEm);
        if (em > agoraMs) {
          const d = em - agoraMs + 1000;
          esperaExtra = esperaExtra === null ? d : Math.min(esperaExtra, d);
        }
      }
    }
    const espera = proximoEspera(db, agoraMs, dentroJanela, intervalo, esperaCatalogo);
    if (esperaExtra !== null && (espera.esperarMs === 0 || esperaExtra < espera.esperarMs || !espera.continuar)) {
      if (!db.exec(`SELECT slug FROM artigos WHERE no_ar = 1 AND status = 'pendente'`).length) {
        espera.continuar = true;
        espera.esperarMs = Math.min(esperaExtra, 15 * 60 * 1000);
      }
    }
    let continuar = espera.continuar;
    let esperarMs = espera.esperarMs;
    if (catalogoFalhou && dentroJanela) {
      continuar = true;
      esperarMs = esperarMs && esperarMs < intervalo ? esperarMs : intervalo;
    }
    return {
      ok: true,
      enviou: enviados > 0,
      motivo: catalogoFalhou && enviados === 0 && expirados === 0 ? 'catalogo_indisponivel' : 'tick',
      enviados,
      expirados,
      transientes,
      esgotados,
      ilegivel,
      continuar,
      esperarMs,
    };
  } finally {
    soltarLock(db, dono);
  }
}
