import path from 'node:path';

const ENTRY_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Id da URL: nome do arquivo, sem extensão. Ignora `slug` no frontmatter. */
export function briefingEntryId(entry: string): string {
  const base = path.posix.basename(entry.replaceAll('\\', '/'));
  const ext = path.posix.extname(base);
  if (ext !== '.md' && ext !== '.mdx') {
    throw new Error(`O id do briefing tem de vir do nome do arquivo, recebido "${entry}".`);
  }
  const id = base.slice(0, -ext.length);
  if (!ENTRY_ID.test(id)) {
    throw new Error(`Nome de arquivo inválido para URL: "${entry}".`);
  }
  return id;
}
