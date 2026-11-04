import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { assertBriefingPages, briefingRedirects, renderBriefingRedirects } from './src/lib/briefing-redirects.ts';

const root = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  site: 'https://dsb.duarte.top',
  trailingSlash: 'never',
  integrations: [
    {
      name: 'briefing-slug-redirects',
      hooks: {
        // Workers static assets e Cloudflare Pages aplicam 301 a partir de dist/_redirects.
        // O redirect do Astro, em site estático, só emite meta refresh.
        'astro:build:done': async ({ dir, pages }) => {
          const rules = briefingRedirects(root);
          assertBriefingPages(
            pages.map((page) => page.pathname),
            rules,
          );
          await writeFile(path.join(fileURLToPath(dir), '_redirects'), renderBriefingRedirects(rules));
        },
      },
    },
  ],
});
