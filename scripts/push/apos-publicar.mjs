#!/usr/bin/env node
/**
 * Depois do lote do blog: acha briefings do dia no ar (RSS), envia push uma vez por slug.
 *   node scripts/push/apos-publicar.mjs [--simular] [--data AAAA-MM-DD]
 * Lê tipo/pais do frontmatter em src/content/briefings/<slug>.md
 * Dedupe: ~/.config/dsb/push-enviados.json
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const simular = args.includes('--simular');
const iData = args.indexOf('--data');
const TZ = 'America/Sao_Paulo';
const TIPOS_OK = new Set(['noticia', 'vulnerabilidades', 'incidente']);

function hojeSP() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

const data = iData >= 0 ? args[iData + 1] : hojeSP();
const SITE = 'https://dsb.duarte.top';
const STATE = join(homedir(), '.config/dsb/push-enviados.json');
const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

function loadState() {
  try {
    return JSON.parse(readFileSync(STATE, 'utf8'));
  } catch {
    return { enviados: {} };
  }
}
function saveState(st) {
  mkdirSync(dirname(STATE), { recursive: true });
  writeFileSync(STATE, JSON.stringify(st, null, 2) + '\n', { mode: 0o600 });
}

async function headOk(url) {
  const r = await fetch(url, {
    method: 'HEAD',
    redirect: 'follow',
    headers: { 'User-Agent': 'DSB-Push/1.0' },
  });
  return r.ok;
}

function stripTags(s) {
  return s.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').trim();
}

function metaDoSlug(slug) {
  const path = join(root, 'src/content/briefings', `${slug}.md`);
  if (!existsSync(path)) {
    console.warn('sem frontmatter local:', path);
    return {};
  }
  const raw = readFileSync(path, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const fm = m[1];
  const tipoM = fm.match(/^tipo:\s*['"]?([a-z]+)['"]?\s*$/m);
  const paisM = fm.match(/^pais:\s*['"]?([a-z]+)['"]?\s*$/m);
  const tipo = tipoM && TIPOS_OK.has(tipoM[1]) ? tipoM[1] : undefined;
  const pais = paisM ? paisM[1] : undefined;
  return { tipo, pais };
}

async function itensDoDia() {
  const r = await fetch(`${SITE}/rss.xml`, {
    headers: { 'User-Agent': 'DSB-Push/1.0' },
  });
  if (!r.ok) throw new Error('rss HTTP ' + r.status);
  const xml = await r.text();
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml))) {
    const block = m[1];
    const titulo = stripTags(
      (block.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || '',
    );
    const link = stripTags(
      (block.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || '',
    );
    if (!titulo || !link) continue;
    let path;
    try {
      path = new URL(link).pathname.replace(/\/$/, '') || '/';
    } catch {
      continue;
    }
    const slugMatch = path.match(/\/briefings\/(\d{4}-\d{2}-\d{2}-.+)$/);
    if (!slugMatch) continue;
    const slug = slugMatch[1];
    if (!slug.startsWith(data)) continue;
    items.push({ titulo, path: `/briefings/${slug}`, slug });
  }
  return items;
}

const st = loadState();
const itens = await itensDoDia();
const novos = itens.filter((it) => !st.enviados[it.slug]);
console.log(
  `RSS ${data}: ${itens.length} no ar · ${novos.length} sem push ainda`,
);
if (!novos.length) process.exit(0);

const enviados = [];
for (const it of novos) {
  const urlAbs = SITE + it.path;
  const ok = await headOk(urlAbs);
  if (!ok) {
    console.warn('ainda não no ar:', it.path);
    continue;
  }
  const meta = metaDoSlug(it.slug);
  const tituloPorTipo = {
    noticia: 'Nova Notícia',
    incidente: 'Novo Incidente',
    vulnerabilidades: 'Nova Vulnerabilidade',
  };
  const tituloPush = (meta.tipo && tituloPorTipo[meta.tipo]) || 'Novo briefing no DSB';
  const cmdArgs = [
    join(root, 'scripts/push/enviar.mjs'),
    '--titulo',
    tituloPush,
    '--texto',
    it.titulo,
    '--url',
    it.path,
    '--topico',
    'edicao',
    '--tag',
    it.slug,
  ];
  if (meta.tipo) cmdArgs.push('--tipo', meta.tipo);
  if (meta.pais) cmdArgs.push('--pais', meta.pais);
  if (simular) cmdArgs.push('--simular');
  console.log(
    simular ? '[simular]' : '[enviar]',
    it.slug,
    meta.tipo || '-',
    meta.pais || '-',
  );
  try {
    execFileSync(process.execPath, cmdArgs, { stdio: 'inherit', cwd: root });
    if (!simular) {
      st.enviados[it.slug] = new Date().toISOString();
      enviados.push({ ...it, ...meta });
    }
  } catch (e) {
    console.error('falhou push', it.slug, e.message);
  }
}
if (!simular && enviados.length) saveState(st);
console.log(
  JSON.stringify({
    data,
    enviados: enviados.map((e) => ({
      slug: e.slug,
      path: e.path,
      tipo: e.tipo || null,
      pais: e.pais || null,
    })),
  }),
);
