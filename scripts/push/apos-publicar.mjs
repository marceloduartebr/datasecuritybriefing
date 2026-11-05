#!/usr/bin/env node
/**
 * Depois do lote do blog: acha briefings do dia no ar (RSS), envia push uma vez por slug.
 *   node scripts/push/apos-publicar.mjs [--simular] [--data AAAA-MM-DD]
 * Dedupe: ~/.config/dsb/push-enviados.json
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const simular = args.includes('--simular');
const iData = args.indexOf('--data');
const TZ = 'America/Sao_Paulo';

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
  const cmdArgs = [
    join(root, 'scripts/push/enviar.mjs'),
    '--titulo',
    'Novo briefing no DSB',
    '--texto',
    it.titulo,
    '--url',
    it.path,
    '--topico',
    'edicao',
    '--tag',
    it.slug,
  ];
  if (simular) cmdArgs.push('--simular');
  console.log(simular ? '[simular]' : '[enviar]', it.slug);
  try {
    execFileSync(process.execPath, cmdArgs, { stdio: 'inherit', cwd: root });
    if (!simular) {
      st.enviados[it.slug] = new Date().toISOString();
      enviados.push(it);
    }
  } catch (e) {
    console.error('falhou push', it.slug, e.message);
  }
}
if (!simular && enviados.length) saveState(st);
console.log(
  JSON.stringify({
    data,
    enviados: enviados.map((e) => ({ slug: e.slug, path: e.path })),
  }),
);
