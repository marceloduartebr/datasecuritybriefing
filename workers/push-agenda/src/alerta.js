import { tokensIguais } from './auth.js';
import { enviarParaInscrito } from './rede.js';
import { logEvento } from './log.js';

/**
 * Alerta operacional em texto livre, SÓ para as inscrições do Marcelo.
 * Allowlist fixa no código, por prefixo do hash sub:<64 hex>; cada prefixo precisa casar com
 * exatamente 1 chave do KV. Nunca faz fan-out, nunca aceita destino vindo do pedido,
 * nunca apaga inscrição (expirada só é relatada), não toca no dedupe dos briefings.
 */
export const ALERTA_PREFIXOS = Object.freeze(['568add3d', 'd48327b1']);
export const ALERTA_TAG = 'dsb-auditor';
const SITE = 'https://dsb.duarte.top';
const CAMPOS = new Set(['titulo', 'texto', 'url']);

export async function autorizarAlerta(request, env) {
  const esperado = env && env.ALERTA_TOKEN;
  if (typeof esperado !== 'string' || esperado.length < 24) return { ok: false, status: 503, erro: 'alerta_nao_configurado' };
  const m = /^Bearer\s+(\S+)$/.exec(request.headers.get('Authorization') || '');
  if (!m || !(await tokensIguais(m[1], esperado))) return { ok: false, status: 401, erro: 'nao_autorizado' };
  return { ok: true };
}

function limpo(s, max) {
  if (typeof s !== 'string') return null;
  const t = s.replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, '').trim();
  if (!t || t.length > max) return null;
  return t;
}

/** Valida o corpo. Qualquer campo extra (destino, somente, inscritos…) é recusado. */
export function validarAlerta(corpo) {
  if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) return { erro: 'corpo' };
  for (const k of Object.keys(corpo)) if (!CAMPOS.has(k)) return { erro: 'campo_nao_permitido' };
  const titulo = limpo(corpo.titulo, 80);
  const texto = limpo(corpo.texto, 400);
  if (!titulo) return { erro: 'titulo' };
  if (!texto) return { erro: 'texto' };
  let url = `${SITE}/`;
  if (corpo.url !== undefined) {
    try {
      const u = new URL(String(corpo.url), SITE);
      if (u.origin !== SITE) return { erro: 'url' };
      url = u.toString();
    } catch {
      return { erro: 'url' };
    }
  }
  return { payload: { titulo, texto, url, tag: ALERTA_TAG } };
}

export function mascarar(chave) {
  return `sub:${String(chave).slice(4, 12)}…`;
}

/** Resolve a allowlist no KV: 1 list por prefixo (limit 2 para detectar ambiguidade). */
export async function resolverAllowlist(kv) {
  const out = [];
  for (const p of ALERTA_PREFIXOS) {
    const page = await kv.list({ prefix: `sub:${p}`, limit: 2 });
    const nomes = (page.keys || []).map((k) => k.name).filter((n) => /^sub:[0-9a-f]{64}$/.test(n));
    if (nomes.length === 1) out.push({ prefixo: p, chave: nomes[0] });
    else out.push({ prefixo: p, chave: null, erro: nomes.length ? 'ambiguo' : 'ausente' });
  }
  return out;
}

export async function enviarAlerta(env, payload, { fetchImpl = fetch, agora = new Date(), enviar = enviarParaInscrito } = {}) {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) return { ok: false, erro: 'vapid_ausente', destinos: [] };
  const alvos = await resolverAllowlist(env.DSB_PUSH);
  const destinos = [];
  for (const a of alvos) {
    if (!a.chave) {
      destinos.push({ destino: `sub:${a.prefixo}…`, classe: 'nao_enviado', motivo: a.erro });
      continue;
    }
    const bruto = await env.DSB_PUSH.get(a.chave);
    let registro = null;
    try {
      registro = typeof bruto === 'string' ? JSON.parse(bruto) : null;
    } catch {
      registro = null;
    }
    if (!registro || !registro.endpoint) {
      destinos.push({ destino: mascarar(a.chave), classe: 'nao_enviado', motivo: 'ilegivel' });
      continue;
    }
    let r;
    try {
      r = await enviar({
        registro,
        payload,
        vapid: {
          publicKey: env.VAPID_PUBLIC_KEY,
          privateKey: env.VAPID_PRIVATE_KEY,
          subject: env.VAPID_SUBJECT || 'https://dsb.duarte.top/sobre',
        },
        agora,
        fetchImpl,
      });
    } catch {
      r = { classe: 'transiente' };
    }
    destinos.push({ destino: mascarar(a.chave), classe: r.classe, status: r.status ?? null });
  }
  const enviados = destinos.filter((d) => d.classe === 'ok').length;
  logEvento('alerta', { enviados, total: destinos.length });
  return { ok: enviados > 0, enviados, destinos };
}
