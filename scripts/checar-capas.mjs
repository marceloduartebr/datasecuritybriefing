#!/usr/bin/env node
/**
 * Guarda de capa (sem rede): todo briefing PT/ES/EN precisa de `cover` em
 * https://covers.duarte.top/covers/<arquivo>.(jpg|jpeg|png|webp).
 * Roda no GitHub Actions (workflow capas.yml) e em `npm test`. Não participa do
 * build do Workers Builds, então nunca bloqueia o deploy: só deixa o check vermelho.
 * Paridade PT/ES/EN ausente é aviso, não falha.
 * Uso: node scripts/checar-capas.mjs [--json]
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerFrontmatter } from '../src/lib/push-catalogo.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const PASTAS = ['briefings', 'briefings-es', 'briefings-en'];

export function capaValida(url) {
  if (typeof url !== 'string' || !url) return false;
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && u.hostname === 'covers.duarte.top' && /^\/covers\/[A-Za-z0-9._-]+\.(jpe?g|png|webp)$/i.test(u.pathname);
  } catch {
    return false;
  }
}

export function checar(raiz = RAIZ) {
  const erros = [];
  const avisos = [];
  const porPasta = {};
  for (const pasta of PASTAS) {
    const dir = path.join(raiz, 'src', 'content', pasta);
    const arquivos = readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
    porPasta[pasta] = new Set(arquivos);
    for (const f of arquivos) {
      const fm = lerFrontmatter(readFileSync(path.join(dir, f), 'utf8'));
      if (!fm) erros.push(`${pasta}/${f}: sem frontmatter`);
      else if (!fm.cover) erros.push(`${pasta}/${f}: sem cover`);
      else if (!capaValida(fm.cover)) erros.push(`${pasta}/${f}: cover fora de covers.duarte.top/covers (${fm.cover})`);
    }
  }
  for (const f of porPasta.briefings) {
    for (const outra of ['briefings-es', 'briefings-en']) {
      if (!porPasta[outra].has(f)) avisos.push(`${f}: falta em ${outra}`);
    }
  }
  return { erros, avisos, total: PASTAS.reduce((n, p) => n + porPasta[p].size, 0) };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const r = checar();
  if (process.argv.includes('--json')) console.log(JSON.stringify(r, null, 2));
  else {
    for (const a of r.avisos) console.log(`aviso: ${a}`);
    for (const e of r.erros) console.log(`ERRO: ${e}`);
    console.log(`${r.total} arquivos, ${r.erros.length} erro(s), ${r.avisos.length} aviso(s)`);
  }
  process.exit(r.erros.length ? 1 : 0);
}
