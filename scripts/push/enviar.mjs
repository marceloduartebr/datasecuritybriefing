#!/usr/bin/env node
/**
 * Envia Web Push para inscritos do DSB.
 *   node scripts/push/enviar.mjs --titulo "..." --texto "..." --url /briefings/... [--topico edicao] [--tag slug] [--tipo incidente] [--pais br] [--simular]
 * Inscrições: KV DSB_PUSH (chaves sub:<sha256>), via wrangler --remote.
 * VAPID: ~/.config/dsb/vapid.json (privada NUNCA no repositório).
 * 404/410 → remove do KV. --simular não envia nem remove.
 * tipos/regioes omitidos no KV = todos; arrays vazios = nenhum.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import webpush from 'web-push';

const KV_ID = '1467af16ba4f4d3db8f3c6dd292f2d0b';
const TIPOS_OK = new Set(['noticia', 'vulnerabilidades', 'incidente']);
const REG = {
  br: ['br'],
  mx: ['mx'],
  latam: ['ar', 'cl', 'pe', 'py', 'uy', 'co', 'latam'],
  us: ['us'],
  eu: ['eu'],
  global: ['global'],
};

const args = process.argv.slice(2);
const arg = (n, d) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : d;
};
const simular = args.includes('--simular');
const titulo = arg('titulo', 'Data Security Briefing');
const texto = arg('texto', '');
const url = arg('url', '/');
const topico = arg('topico');
const tag = arg('tag');
const tipoRaw = arg('tipo');
const paisRaw = arg('pais');
const tipo =
  tipoRaw && TIPOS_OK.has(tipoRaw) ? tipoRaw : tipoRaw ? null : undefined;
const pais = paisRaw || undefined;
if (!texto) {
  console.error('Use --texto "..." (e --titulo, --url).');
  process.exit(2);
}
if (tipoRaw && tipo === null) {
  console.warn('tipo ignorado (inválido):', tipoRaw);
}

const wr = (...a) =>
  execFileSync(
    'npx',
    ['wrangler', 'kv', ...a, '--namespace-id', KV_ID, '--remote'],
    { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
  );
const json = (s) => JSON.parse(s.slice(s.search(/[\[{]/)));

function matchTipo(s) {
  if (!Array.isArray(s.tipos)) return true; // omitido = todos
  if (!s.tipos.length) return false;
  if (!tipo) return true; // briefing sem tipo válido: não restringe
  return s.tipos.includes(tipo);
}

function matchRegiao(s) {
  if (!Array.isArray(s.regioes)) return true; // omitido = todas
  if (!s.regioes.length) return false;
  if (!pais) return true; // briefing sem país: não restringe
  return s.regioes.some((r) => (REG[r] || []).includes(pais));
}

const chaves = json(wr('key', 'list', '--prefix', 'sub:')).map((k) => k.name);
const subs = [];
for (const k of chaves) {
  try {
    subs.push({ k, s: json(wr('key', 'get', k)) });
  } catch {
    console.warn('ilegível:', k);
  }
}
const alvo = subs.filter(({ s }) => {
  if (topico && !(s.topicos || []).includes(topico)) return false;
  if (!matchTipo(s)) return false;
  if (!matchRegiao(s)) return false;
  return true;
});
const payload = JSON.stringify({
  titulo,
  texto,
  url,
  ...(tag ? { tag } : {}),
});
console.log(
  `${alvo.length} inscrição(ões) de ${subs.length}` +
    `${topico ? ` (tópico ${topico})` : ''}` +
    `${tipo ? ` · tipo ${tipo}` : ''}` +
    `${pais ? ` · país ${pais}` : ''}. Payload: ${payload}`,
);
if (simular) {
  for (const { k, s } of alvo)
    console.log('[simular]', k.slice(0, 16), new URL(s.endpoint).hostname);
  process.exit(0);
}

const v = JSON.parse(
  readFileSync(`${homedir()}/.config/dsb/vapid.json`, 'utf8'),
);
webpush.setVapidDetails(
  v.subject || 'https://dsb.duarte.top/sobre',
  v.publicKey,
  v.privateKey,
);
let ok = 0,
  rem = 0,
  err = 0;
for (const { k, s } of alvo) {
  try {
    await webpush.sendNotification(
      { endpoint: s.endpoint, keys: s.keys },
      payload,
      { TTL: 6 * 3600, urgency: 'normal' },
    );
    ok++;
  } catch (e) {
    if (e.statusCode === 404 || e.statusCode === 410) {
      wr('key', 'delete', k);
      rem++;
    } else {
      err++;
      console.warn('falhou', k.slice(0, 16), e.statusCode || e.message);
    }
  }
}
console.log(`Enviadas: ${ok} · removidas (404/410): ${rem} · erros: ${err}`);
