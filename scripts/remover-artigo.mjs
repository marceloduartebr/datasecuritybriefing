#!/usr/bin/env node
/**
 * Remove um briefing do blog em PT/ES/EN. Dry-run por padrão: só lista o que faria.
 *   node scripts/remover-artigo.mjs <slug>             # dry-run
 *   node scripts/remover-artigo.mjs <slug> --aplicar   # apaga os arquivos no working tree (sem commit, sem push)
 * Depois de --aplicar: revisar `git status`, commitar e dar push (Workers Builds publica; o push-evento
 * não reenvia nada porque o slug some do catálogo). Este script NÃO mexe no Notion, LinkedIn nem X:
 * ele só imprime os passos manuais (Status Descartado, nota em Publish Notes, apagar post pelo URN).
 */
import { existsSync, readFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lerFrontmatter } from '../src/lib/push-catalogo.mjs';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PASTAS = { pt: 'briefings', es: 'briefings-es', en: 'briefings-en' };
const URLS = { pt: '/briefings/', es: '/es/briefings/', en: '/en/briefings/' };
const SLUG = /^\d{4}-\d{2}-\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function planejar(slug, raiz = RAIZ) {
  if (!SLUG.test(slug || '')) return { erro: 'slug_invalido' };
  const arquivos = [];
  let notionUrl = null;
  let cover = null;
  for (const [lang, pasta] of Object.entries(PASTAS)) {
    for (const ext of ['.md', '.mdx']) {
      const rel = path.join('src', 'content', pasta, slug + ext);
      const abs = path.join(raiz, rel);
      if (existsSync(abs)) {
        arquivos.push({ lang, rel, abs, url: `https://dsb.duarte.top${URLS[lang]}${slug}/` });
        const fm = lerFrontmatter(readFileSync(abs, 'utf8')) || {};
        notionUrl = notionUrl || fm.notionUrl || null;
        cover = cover || fm.cover || null;
      }
    }
  }
  if (!arquivos.length) return { erro: 'nao_encontrado' };
  return { slug, arquivos, notionUrl, cover, faltando: Object.keys(PASTAS).filter((l) => !arquivos.some((a) => a.lang === l)) };
}

export function aplicar(plano) {
  for (const a of plano.arquivos) unlinkSync(a.abs);
  return plano.arquivos.length;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [slug, ...resto] = process.argv.slice(2);
  const plano = planejar(slug);
  if (plano.erro) {
    console.error(`erro: ${plano.erro}${plano.erro === 'slug_invalido' ? ' (esperado AAAA-MM-DD-slug)' : ''}`);
    process.exit(2);
  }
  const vaiAplicar = resto.includes('--aplicar');
  console.log(`${vaiAplicar ? 'REMOVENDO' : 'DRY-RUN'}: ${plano.slug}`);
  for (const a of plano.arquivos) console.log(`  ${a.lang}: ${a.rel}  (${a.url})`);
  if (plano.faltando.length) console.log(`  aviso: não existe em ${plano.faltando.join(', ')}`);
  if (vaiAplicar) {
    console.log(`  ${aplicar(plano)} arquivo(s) apagado(s). Próximo: git add -A src/content && git commit -m "remove: ${plano.slug} (PT/ES/EN)" && git push`);
  } else {
    console.log('  Nada foi apagado. Rode com --aplicar para remover.');
  }
  console.log('Passos manuais (fora deste script, com confirmação):');
  console.log(`  - Notion: Status = Descartado + nota em Publish Notes${plano.notionUrl ? ` (${plano.notionUrl})` : ''}; manter Blog URL para o job não republicar.`);
  console.log('  - LinkedIn: apagar o post pelo URN guardado em Publish Notes (se houver).');
  console.log('  - Conferir 404 nas 3 URLs depois do deploy.');
}
