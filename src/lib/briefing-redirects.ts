import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { briefingEntryId } from './briefing-id';

const SEGMENT = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;

/**
 * As rotas de /es e /en usam o id da coleção em português (`listBriefings`).
 * Um `slug` publicado no PT existiu, portanto, nos três prefixos.
 */
const COLLECTIONS = [
  { dir: 'src/content/briefings', prefixes: ['', '/es', '/en'] },
  { dir: 'src/content/briefings-es', prefixes: ['/es'] },
  { dir: 'src/content/briefings-en', prefixes: ['/en'] },
] as const;

export type BriefingRedirect = {
  source: string;
  target: string;
};

export function normalizePathname(pathname: string): string {
  let value = pathname.trim();
  if (!value.startsWith('/')) value = `/${value}`;
  value = value.replace(/\/index\.html$/, '');
  if (value.length > 1) value = value.replace(/\/+$/, '');
  return value;
}

function readFrontmatterSlug(filePath: string): string | undefined {
  const raw = readFileSync(filePath, 'utf8');
  const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return undefined;
  for (const line of fm[1].split(/\r?\n/)) {
    const slugLine = line.match(/^\s*slug:(.*)$/);
    if (!slugLine) continue;
    const rest = slugLine[1].trim();
    if (rest === '') continue;
    if (
      rest === '|' ||
      rest === '>' ||
      rest.startsWith('|') ||
      rest.startsWith('>') ||
      rest.startsWith('[') ||
      rest.startsWith('{') ||
      rest.startsWith('&') ||
      rest.startsWith('*') ||
      rest.includes('\\')
    ) {
      throw new Error(`Sintaxe de slug não suportada em ${filePath}: ${line}`);
    }
    let value = rest;
    if (
      (value.startsWith('"') && value.endsWith('"') && value.length >= 2) ||
      (value.startsWith("'") && value.endsWith("'") && value.length >= 2)
    ) {
      value = value.slice(1, -1);
    }
    if (!value) return undefined;
    return value;
  }
  return undefined;
}

function markdownFiles(dir: string): string[] {
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .sort();
}

export function briefingRedirects(rootDir: string): BriefingRedirect[] {
  const ptDir = path.join(rootDir, 'src/content/briefings');
  const published = new Set(markdownFiles(ptDir).map((name) => briefingEntryId(name)));
  const canonical = new Set<string>();
  for (const id of published) {
    for (const prefix of ['', '/es', '/en']) canonical.add(`${prefix}/briefings/${id}`);
  }

  const rules = new Map<string, string>();
  const add = (source: string, target: string, from: string) => {
    const bare = source.replace(/\/$/, '');
    if (bare === target) return;
    if (canonical.has(bare)) {
      throw new Error(`Redirect ${source} cobriria a URL de um arquivo (${from}).`);
    }
    const prev = rules.get(source);
    if (prev && prev !== target) {
      throw new Error(`Redirect conflitante para ${source}: ${prev} vs ${target} (${from}).`);
    }
    rules.set(source, target);
  };

  for (const collection of COLLECTIONS) {
    const dir = path.join(rootDir, collection.dir);
    for (const name of markdownFiles(dir)) {
      const id = briefingEntryId(name);
      if (!published.has(id)) continue;
      const filePath = path.join(dir, name);
      const slug = readFrontmatterSlug(filePath);
      if (!slug || slug === id) continue;
      if (!SEGMENT.test(slug)) {
        throw new Error(`Slug inseguro para redirect em ${filePath}: "${slug}".`);
      }
      for (const prefix of collection.prefixes) {
        const target = `${prefix}/briefings/${id}`;
        const source = `${prefix}/briefings/${slug}`;
        add(source, target, filePath);
        add(`${source}/`, target, filePath);
      }
    }
  }

  return [...rules.entries()]
    .sort(([a], [b]) => {
      const aBare = a.replace(/\/$/, '');
      const bBare = b.replace(/\/$/, '');
      if (aBare !== bBare) return aBare < bBare ? -1 : 1;
      return a.endsWith('/') === b.endsWith('/') ? 0 : a.endsWith('/') ? 1 : -1;
    })
    .map(([source, target]) => ({ source, target }));
}

export function renderBriefingRedirects(rules: BriefingRedirect[]): string {
  const lines = [
    '# Gerado no build. URLs antigas com slug do frontmatter redirecionam 301 para o nome do arquivo.',
    ...rules.map((rule) => `${rule.source} ${rule.target} 301`),
    '',
  ];
  return lines.join('\n');
}

export function assertBriefingPages(pathnames: string[], rules: BriefingRedirect[]) {
  const pages = new Set(pathnames.map(normalizePathname));
  const sources = new Set(rules.map((rule) => rule.source.replace(/\/$/, '')));
  const targets = new Set(rules.map((rule) => rule.target));
  for (const target of targets) {
    if (!pages.has(target)) {
      throw new Error(`Página do arquivo não foi gerada: ${target}`);
    }
  }
  for (const source of sources) {
    if (pages.has(source)) {
      throw new Error(`A URL antiga do slug ainda é uma página: ${source}`);
    }
  }
}
