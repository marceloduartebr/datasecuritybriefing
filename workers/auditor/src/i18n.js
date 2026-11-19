// English for the panel in every environment (Marcelo, 2026-11-17: Queue and Audit in English).
// Applied to the rendered HTML: the panel's own phrases only, anchored on markup where a word could also appear
// in content (post topics stay as written). Longer phrases come first.
const PHRASES = [
  // STG URLs are English: /panel, ?tab=views, &window= (old /painel links redirect)
  ['href="/painel?aba=leituras&amp;janela=', 'href="/panel?tab=views&amp;window='],
  ['href="/painel?aba=leituras"', 'href="/panel?tab=views"'],
  ['href="/painel"', 'href="/panel"'],
  ['action="/painel"', 'action="/panel"'],
  // structure and navigation
  ['<html lang="pt-BR">', '<html lang="en">'],
  ['aria-label="Seções do painel"', 'aria-label="Panel sections"'],
  ['>Auditoria</a>', '>Audit</a>'],
  ['>Leituras</a>', '>Views</a>'],
  ['aria-label="Alternar tema claro/escuro"', 'aria-label="Toggle light/dark theme"'],
  ['title="Tema"', 'title="Theme"'],
  ['aria-label="DSB Auditor — painel"', 'aria-label="DSB Auditor — panel"'],
  ['DSB Auditor STG — painel', 'DSB Auditor STG — panel'],
  ['DSB Auditor STG — leituras', 'DSB Auditor STG — views'],
  ['DSB Auditor — painel', 'DSB Auditor — panel'],
  ['DSB Auditor — leituras', 'DSB Auditor — views'],
  ['Auditoria · DSB Auditor', 'Audit · DSB Auditor'],
  ['<h1>Painel de auditoria</h1>', '<h1>Audit panel</h1>'],
  ['Status da última checagem · horários em Brasília (BRT)', 'Status of the last check · times in Brasília (BRT)'],
  ['Ainda não houve execução.', 'No run yet.'],
  ['>Última execução<', '>Last run<'],
  [' (gravado)<', ' (recorded)<'],
  ['>Tudo certo<', '>All good<'],
  [/>(\d+) problema\(s\)</g, '>$1 problem(s)<'],
  [/>(\d+) alerta\(s\)</g, '>$1 alert(s)<'],
  // section headings
  ['<h2>Checagens</h2>', '<h2>Checks</h2>'],
  ['<th>Item</th><th>Estado</th><th>Detalhe</th>', '<th>Item</th><th>State</th><th>Detail</th>'],
  ['<h2>Problemas</h2>', '<h2>Problems</h2>'],
  ['<h2>Alertas</h2>', '<h2>Alerts</h2>'],
  ['<h2>Capas faltando</h2>', '<h2>Missing covers</h2>'],
  ['<h2>Fila (D1 · STG)</h2>', '<h2>Queue (D1 · STG)</h2>'],
  ['<h2>Fila (D1)</h2>', '<h2>Queue (D1)</h2>'],
  ['<h2>Fila (Notion)</h2>', '<h2>Queue (Notion)</h2>'],
  ['Notion (fila)', 'Notion (queue)'],
  ['<h2>Último alerta enviado</h2>', '<h2>Last alert sent</h2>'],
  // state badges
  ['<span class="warn">Alerta</span>', '<span class="warn">Alert</span>'],
  ['<span class="bad">Problema</span>', '<span class="bad">Problem</span>'],
  // check rows (label cells)
  ['<td>Blog (catálogo)</td>', '<td>Blog (catalog)</td>'],
  ['<td>Capas (blog)</td>', '<td>Covers (blog)</td>'],
  ['<td>Capas (escudo sem quadrado)</td>', '<td>Covers (shield without dark square)</td>'],
  ['<td>Push evento (Action)</td>', '<td>Push event (Action)</td>'],
  ['<td>Notion (fila)</td>', '<td>Notion (queue)</td>'],
  // check details
  [/(\d+) briefing\(s\) hoje/g, '$1 briefing(s) today'],
  ['>todas ok<', '>all ok<'],
  [/(\d+) checada\(s\)/g, '$1 checked'],
  [/ · (\d+) na próxima rodada/g, ' · $1 in the next round'],
  [/(\d+) recentes/g, '$1 recent'],
  ['; aviso: ', '; warning: '],
  ['>sem dado nesta execução<', '>no data in this run<'],
  ['>desligado<', '>off<'],
  [/(\d+) adicionados hoje/g, '$1 added today'],
  [/(\d+) ainda Novo/g, '$1 still new'],
  [/(\d+) sem capa \((\d+) alerta, (\d+) problema\)/g, '$1 without cover ($2 alert, $3 problem)'],
  [/(\d+) sem capa/g, '$1 without cover'],
  [/(\d+) publicados/g, '$1 published'],
  [/(\d+) sem URN/g, '$1 without URN'],
  // problems and alerts (alertas.js)
  ['Blog: catálogo indisponível', 'Blog: catalog unavailable'],
  ['Push: dsb-push-agenda sem /health', 'Push: dsb-push-agenda without /health'],
  ['Action push-evento falhou', 'Action push-evento failed'],
  ['Capa: quadrado escuro atrás do escudo — ', 'Cover: dark square behind the shield — '],
  ['Fila: sem capa (aguarda a rodada de capas) — ', 'Queue: no cover (waiting for the cover round) — '],
  ['Fila: sem capa — ', 'Queue: no cover — '],
  ['LinkedIn: Publicado sem URN — ', 'LinkedIn: published without URN — '],
  ['Curadoria: nenhum item adicionado hoje até 07:50', 'Curation: nothing added today by 07:50'],
  ['Nenhum problema na última execução.', 'No problems in the last run.'],
  ['Nenhum alerta na última execução.', 'No alerts in the last run.'],
  ['Item sem capa vira problema só depois das 08:15 de dia útil, se já estava na fila antes da rodada das 08:00.',
    'A post without a cover becomes a problem only after 08:15 on a weekday, if it was already queued before the 08:00 round.'],
  // missing covers
  ['Nenhuma capa faltando.', 'No missing covers.'],
  [/<p>(\d+) item\(ns\)/g, '<p>$1 item(s)'],
  [' (lista truncada)', ' (list truncated)'],
  ['<span class="tag">fila</span>', '<span class="tag">queue</span>'],
  [' — sem capa<', ' — no cover<'],
  [' — sem capa ', ' — no cover '],
  [/(\d{4}-\d{2}-\d{2}-[a-z0-9-]+) capa/g, '$1 cover'],
  // ranking tags (views tab) and the "no type" bucket
  ['<span class="tag">Notícia</span>', '<span class="tag">News</span>'],
  ['<span class="tag">Incidente</span>', '<span class="tag">Incident</span>'],
  ['<span class="tag">Vulnerabilidades</span>', '<span class="tag">Vulnerabilities</span>'],
  ['>Sem tipo<', '>No type<'],
  // cover reason codes (queue list and blog problems)
  [/ — (sem_capa|sem capa)(?=[\s<])/g, ' — no cover'],
  [/ — host_invalido(?=[\s<])/g, ' — cover not on covers.duarte.top'],
  [/ — http(?=[\s<])/g, ' — cover URL does not answer 200'],
  ['<span class="tag">fila</span>', '<span class="tag">queue</span>'],
  [/ cover (falhou|sem_capa|host_invalido|http)\b/g, (_, c) => ` cover ${{ falhou: 'failed', sem_capa: 'missing', host_invalido: 'not on covers.duarte.top', http: 'does not answer 200' }[c]}`],
  // settings box
  ['<li>ALERTAS: ', '<li>Alerts: '],
  ['<li>ALERTA_OK_DIARIO: ', '<li>Daily all-clear alert: '],
  ['<li>NOTION: ', '<li>Notion: '],
  // last alert: titles and reason codes
  [/DSB: (\d+) problema\(s\) às (\d{2}:\d{2})/g, 'DSB: $1 problem(s) at $2'],
  ['DSB: tudo certo hoje', 'DSB: all clear today'],
  [/(motivo: |reason: |Última execução: |Last run: |Enviado nesta execução \(|Sent in this run \()(alertas_off|sem_problemas|sem_binding|sem_token|repetido|rede|problema|ok_diario)\b/g,
    (_, pre, c) => pre + { alertas_off: 'alerts off', sem_problemas: 'no problems', sem_binding: 'push binding missing', sem_token: 'alert token missing', repetido: 'same alert already sent today', rede: 'network error', problema: 'problems', ok_diario: 'daily all-clear' }[c]],
  // queue counts
  ['Notion desligado.', 'Notion off.'],
  ['<li>Adicionados hoje: ', '<li>Added today: '],
  [' (ainda Novo: ', ' (still new: '],
  ['<li>Fila checada: ', '<li>Queue checked: '],
  [' (truncada)', ' (truncated)'],
  ['<li>Publicados hoje: ', '<li>Published today: '],
  ['<li>Aprovados por tipo:', '<li>Approved by type:'],
  // last alert
  ['Nenhum alerta enviado ainda hoje. Última execução: ', 'No alert sent today yet. Last run: '],
  ['Enviado nesta execução', 'Sent in this run'],
  [' · motivo: ', ' · reason: '],
  // footer
  ['Somente leitura · não dispara checagens nem pushes · subrequests da última execução: ',
    'Read-only · does not trigger checks or pushes · subrequests in the last run: '],
  // pull to refresh (installed app)
  ["'Atualizando…'", "'Refreshing…'"],
  ["'Solte para atualizar'", "'Release to refresh'"],
  ["'Puxe para atualizar'", "'Pull to refresh'"],
  // views tab
  ['<h1>Leituras do blog</h1>', '<h1>Blog views</h1>'],
  ['dsb.duarte.top · Cloudflare Web Analytics · horários em Brasília (BRT)', 'dsb.duarte.top · Cloudflare Web Analytics · times in Brasília (BRT)'],
  ['aria-label="Janela"', 'aria-label="Window"'],
  ['>Páginas vistas<', '>Page views<'],
  ['>Visitas<', '>Visits<'],
  ['>Leituras de briefings<', '>Briefing views<'],
  ['>Briefings lidos<', '>Briefings viewed<'],
  ['<h2>Mais lidos · últimas 24 horas</h2>', '<h2>Most viewed · last 24 hours</h2>'],
  ['<h2>Mais lidos · últimos 7 dias</h2>', '<h2>Most viewed · last 7 days</h2>'],
  ['<h2>Mais lidos · últimos 30 dias</h2>', '<h2>Most viewed · last 30 days</h2>'],
  ['Nenhuma leitura de briefing nesta janela.', 'No briefing views in this window.'],
  ['<h2>Por tipo</h2>', '<h2>By type</h2>'],
  ['<h2>Por idioma</h2>', '<h2>By language</h2>'],
  ['<h2>Por origem</h2>', '<h2>By source</h2>'],
  ['<span>Notícia</span>', '<span>News</span>'],
  ['<span>Incidente</span>', '<span>Incident</span>'],
  ['<span>Vulnerabilidades</span>', '<span>Vulnerabilities</span>'],
  ['<span>Direto</span>', '<span>Direct</span>'],
  ['<span>Outros</span>', '<span>Other</span>'],
  ['<span>Navegação no blog</span>', '<span>Within the blog</span>'],
  ['>Outros: ', '>Other: '],
  ['Token de Analytics ausente (CF_ANALYTICS_TOKEN / CF_ACCOUNT_ID).', 'Analytics token missing (CF_ANALYTICS_TOKEN / CF_ACCOUNT_ID).'],
  ['Não foi possível ler o Web Analytics: ', 'Could not read Web Analytics: '],
  ['<strong>Estimativa.</strong> Dados do Cloudflare Web Analytics com amostragem (quanto maior a janela, mais amostrado); sem bots. Ranking soma PT/ES/EN do mesmo briefing; tipo, idioma e origem contam só leituras de briefings. Atualizado ',
    '<strong>Estimate.</strong> Cloudflare Web Analytics data with sampling (the larger the window, the more sampled); no bots. The ranking adds up PT/ES/EN of the same briefing; type, language and source count briefing views only. Updated '],
  [' (cache de até 30 min)', ' (cached up to 30 min)'],
  [' · última tentativa falhou: ', ' · last attempt failed: ']
];

export function toEnglish(html) {
  let out = String(html);
  for (const [from, to] of PHRASES) out = typeof from === 'string' ? out.split(from).join(to) : out.replace(from, to);
  return out;
}

/** English codes for the JSON errors the panel and its endpoints return. */
export const ERRO_EN = { nao_autorizado: 'unauthorized', nao_configurado: 'not_configured', nao_encontrado: 'not_found', origem: 'origin_not_allowed', formato: 'unsupported_format', grande: 'too_large', metodo: 'method_not_allowed', sem_execucao: 'no_run_yet' };

