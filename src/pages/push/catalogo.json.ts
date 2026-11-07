import { FUSO, gerarCatalogo } from '../../lib/push-catalogo.mjs';

export const prerender = true;

// O endpoint compilado não enxerga src/ no disco. O glob entra no bundle na hora do build.
const brutos = import.meta.glob('../../content/briefings/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/** JSON estático. O Worker do site não intercepta este caminho (só /api/push/*). */
export function GET() {
  const arquivos = Object.entries(brutos).map(([caminho, markdown]) => ({
    slug: caminho.split('/').pop()!.replace(/\.md$/, ''),
    markdown,
  }));
  const agora = new Date();
  const { itens } = gerarCatalogo(arquivos, agora);
  return new Response(
    JSON.stringify({
      versao: 1,
      fuso: FUSO,
      geradoEm: agora.toISOString(),
      itens,
    }),
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
      },
    },
  );
}
