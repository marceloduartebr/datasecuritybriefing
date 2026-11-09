import { readFile, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import { assertBriefingPages, briefingRedirects, renderBriefingRedirects } from './src/lib/briefing-redirects.ts';

const root = fileURLToPath(new URL('.', import.meta.url));

// Id do build: commit do Workers Builds, senão git local, senão horário. Vai para
// sw.js (muda os bytes a cada deploy), /version.json e <meta name="dsb-build">.
function idDoBuild() {
  if (process.env.DSB_BUILD_ID) return process.env.DSB_BUILD_ID;
  let sha = process.env.WORKERS_CI_COMMIT_SHA || '';
  if (!sha) {
    try {
      sha = execSync('git rev-parse HEAD', { cwd: root, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch {
      /* sem git */
    }
  }
  const id = (sha ? sha.slice(0, 12) : 'b') + '-' + Date.now().toString(36);
  process.env.DSB_BUILD_ID = id;
  return id;
}
const BUILD_ID = idDoBuild();

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
          const swPath = path.join(fileURLToPath(dir), 'sw.js');
          const sw = await readFile(swPath, 'utf8');
          if (!sw.includes('__DSB_BUILD__')) throw new Error('sw.js sem __DSB_BUILD__');
          await writeFile(swPath, sw.replaceAll('__DSB_BUILD__', BUILD_ID));
          await writeFile(path.join(fileURLToPath(dir), 'version.json'), JSON.stringify({ build: BUILD_ID }) + '\n');
        },
      },
    },
  ],
});
