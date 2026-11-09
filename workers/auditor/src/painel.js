import { capasFaltando } from './auditoria.js';
import { emBrasilia } from './horario.js';
import { SITE } from './constantes.js';

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function fmtIsoBrt(iso) {
  if (!iso) return '—';
  try {
    const b = emBrasilia(new Date(iso));
    return `${b.data} ${b.hhmm} BRT`;
  } catch {
    return String(iso);
  }
}

function badge(ok, labelOk = 'OK', labelBad = 'Problema') {
  if (ok === true) return `<span class="ok">${esc(labelOk)}</span>`;
  if (ok === false) return `<span class="bad">${esc(labelBad)}</span>`;
  return `<span class="na">—</span>`;
}

function linha(nome, ok, detalhe) {
  return `<tr><td>${esc(nome)}</td><td>${badge(ok)}</td><td class="det">${esc(detalhe || '')}</td></tr>`;
}

function checagens(r) {
  const rows = [];
  const blog = r.blog || {};
  if (blog.ok === false) {
    rows.push(linha('Blog (catálogo)', false, blog.erro || `HTTP ${blog.status || '?'}`));
  } else {
    const itens = blog.itens || [];
    let pt = true, es = true, en = true, capas = true;
    const falhas = [];
    for (const i of itens) {
      if (i.paginas?.pt !== 200) { pt = false; falhas.push(`${i.slug} PT ${i.paginas?.pt}`); }
      if (i.paginas?.es !== 200) { es = false; falhas.push(`${i.slug} ES ${i.paginas?.es}`); }
      if (i.paginas?.en !== 200) { en = false; falhas.push(`${i.slug} EN ${i.paginas?.en}`); }
      if (!i.capa?.ok) { capas = false; falhas.push(`${i.slug} capa`); }
    }
    const resumo = `${blog.total ?? 0} briefing(s) hoje`;
    rows.push(linha('Blog PT', pt, resumo));
    rows.push(linha('Blog ES', es, pt && es && en ? resumo : falhas.filter((f) => f.includes(' ES ')).join('; ') || resumo));
    rows.push(linha('Blog EN', en, pt && es && en ? resumo : falhas.filter((f) => f.includes(' EN ')).join('; ') || resumo));
    rows.push(linha('Capas (blog)', capas, capas ? 'todas ok' : falhas.filter((f) => f.includes('capa')).join('; ')));
  }

  const gh = r.github || {};
  rows.push(linha(
    'Commits',
    gh.ok !== false && !!(gh.commits && gh.commits.length),
    gh.ok === false
      ? (gh.erro || 'falhou')
      : `${(gh.commits || []).length} recentes` + (gh.fonte ? ` (${gh.fonte})` : '') + (gh.erro ? `; aviso: ${gh.erro}` : ''),
  ));
  const pe = gh.pushEvento;
  if (pe == null) {
    rows.push(linha('Push evento (Action)', null, 'sem dado nesta execução'));
  } else {
    const okPe = pe.conclusao === 'success' || pe.status === 'completed' && pe.conclusao !== 'failure';
    rows.push(linha('Push evento (Action)', pe.conclusao !== 'failure', `${pe.conclusao || pe.status || '?'}${pe.sha ? ` @ ${pe.sha}` : ''}`));
  }

  const push = r.push || {};
  rows.push(linha('Push /health', !!push.ok, push.ok ? `HTTP ${push.health || 200}` : (push.erro || `HTTP ${push.health || '?'}`)));

  const n = r.notion || {};
  if (!n.ativo) {
    rows.push(linha('Notion (fila)', null, 'desligado'));
  } else if (!n.ok) {
    rows.push(linha('Notion (fila)', false, n.erro || 'erro'));
  } else {
    const det = [
      `${n.novosHoje?.total ?? 0} adicionados hoje`,
      `${n.novosHoje?.aindaNovo ?? 0} ainda Novo`,
      `${(n.semCapa || []).length} sem capa`,
      `${n.publicadosHoje ?? 0} publicados`,
      `${(n.publicadosSemUrn || []).length} sem URN`,
    ].join(' · ');
    const okN = (n.semCapa || []).length === 0 && (n.publicadosSemUrn || []).length === 0;
    rows.push(linha('Notion (fila)', okN, det));
  }
  return rows.join('\n');
}

function contagensFila(r) {
  const n = r.notion || {};
  if (!n.ativo) return '<p class="muted">Notion desligado.</p>';
  if (!n.ok) return `<p class="bad">Notion: ${esc(n.erro || 'erro')}</p>`;
  const tipos = n.aprovadosPorTipo || {};
  const tipoLinhas = Object.keys(tipos).sort().map((t) => `<li><strong>${esc(t)}</strong>: ${tipos[t]}</li>`).join('') || '<li>—</li>';
  return `<ul class="lista">
    <li>Adicionados hoje: <strong>${n.novosHoje?.total ?? 0}</strong> (ainda Novo: ${n.novosHoje?.aindaNovo ?? 0})</li>
    <li>Fila checada: <strong>${n.fila?.total ?? 0}</strong>${n.fila?.truncado ? ' (truncada)' : ''}</li>
    <li>Publicados hoje: <strong>${n.publicadosHoje ?? 0}</strong></li>
    <li>Aprovados por tipo:<ul>${tipoLinhas}</ul></li>
  </ul>`;
}

function listaCapas(r) {
  const cf = capasFaltando(r);
  if (!cf.ok) return '<p class="muted">Sem execução.</p>';
  if (!cf.total) return '<p class="ok">Nenhuma capa faltando.</p>';
  const itens = (cf.itens || []).map((i) => {
    if (i.origem === 'fila') return `<li><span class="tag">fila</span> ${esc(i.topic || i.id)} — ${esc(i.motivo || 'sem capa')}</li>`;
    return `<li><span class="tag">blog</span> ${esc(i.slug)} — ${esc(i.motivo || 'sem capa')}</li>`;
  }).join('');
  return `<p>${cf.total} item(ns)${cf.truncado ? ' (lista truncada)' : ''}:</p><ul class="lista">${itens}</ul>`;
}

function flagsHtml(r) {
  const f = r.flags || {};
  return `<ul class="lista flags">
    <li>ALERTAS: <strong>${esc(f.alertas || 'off')}</strong></li>
    <li>ALERTA_OK_DIARIO: <strong>${esc(f.okDiario || 'off')}</strong></li>
    <li>NOTION: <strong>${esc(f.notion || 'off')}</strong></li>
  </ul>`;
}

function alertaHtml(ultimoAlerta, r) {
  if (ultimoAlerta && (ultimoAlerta.titulo || ultimoAlerta.sig)) {
    const quando = ultimoAlerta.em ? fmtIsoBrt(ultimoAlerta.em) : (ultimoAlerta.data || '—');
    const motivo = ultimoAlerta.tipo || ultimoAlerta.motivo || (ultimoAlerta.titulo?.includes('tudo certo') ? 'ok_diario' : 'problema');
    const titulo = ultimoAlerta.titulo || (ultimoAlerta.sig ? String(ultimoAlerta.sig).split('|')[0] : '—');
    return `<p><strong>${esc(titulo)}</strong></p>
      <p class="muted">${esc(quando)} · motivo: ${esc(motivo)}${ultimoAlerta.slot ? ` · slot ${esc(ultimoAlerta.slot)}` : ''}</p>`;
  }
  const a = r.alerta || {};
  if (a.enviado) {
    return `<p class="ok">Enviado nesta execução (${esc(a.motivo || 'ok')}).</p>`;
  }
  return `<p class="muted">Nenhum alerta enviado ainda hoje. Última execução: ${esc(a.motivo || '—')}.</p>`;
}

function problemasHtml(r) {
  const p = r.problemas || [];
  if (!p.length) return '<p class="ok">Nenhum problema na última execução.</p>';
  return `<ul class="lista">${p.map((x) => `<li class="bad">${esc(x)}</li>`).join('')}</ul>`;
}


const FONTES = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,600;8..60,700&display=swap">';

const IC_LUA = '<svg class="i-lua" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
const IC_SOL = '<svg class="i-sol" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

/** <head> com identidade DSB (mesma do blog e da DSB Queue): fontes, tema claro/escuro; ícone próprio do painel (escudo + lupa) em /pwa/dsba/. */
function cabeca(titulo) {
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow">
<title>${esc(titulo)}</title>
<script>try{var t=localStorage.getItem('dsb-auditor-tema');if(t==='claro'||t==='escuro')document.documentElement.dataset.tema=t;}catch(e){}</script>
<meta name="theme-color" content="#0b0e13" media="(prefers-color-scheme: dark)"><meta name="theme-color" content="#f6f4ef" media="(prefers-color-scheme: light)">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<link rel="icon" href="/pwa/dsba/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/pwa/dsba/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" sizes="180x180" href="/pwa/dsba/apple-touch-icon.png">
${FONTES}
<style>${CSS}</style>
</head>
<body>
<header class="topo"><div class="container">
<a class="brand" href="/painel" aria-label="DSB Auditor — painel"><img class="mark" src="${SITE}/brand-mark-128.png" width="38" height="38" alt="" decoding="async"><span class="txt"><span class="wm">Data Security Briefing</span><small>Auditoria · DSB Auditor</small></span></a>
<button type="button" class="btn-icone" id="tema" aria-label="Alternar tema claro/escuro" title="Tema">${IC_LUA}${IC_SOL}</button>
</div></header>`;
}

const RODAPE_JS = `<script>(function(){var b=document.getElementById('tema');if(!b)return;b.addEventListener('click',function(){var r=document.documentElement;var a=r.dataset.tema||(matchMedia('(prefers-color-scheme: light)').matches?'claro':'escuro');var n=a==='claro'?'escuro':'claro';r.dataset.tema=n;try{localStorage.setItem('dsb-auditor-tema',n);}catch(e){}});})();</script>`;

function abas(atual) {
  const item = (id, href, rotulo) => `<a href="${href}"${atual === id ? ' class="on" aria-current="page"' : ''}>${rotulo}</a>`;
  return `<nav class="abas" aria-label="Seções do painel">${item('auditoria', '/painel', 'Auditoria')}${item('leituras', '/painel?aba=leituras', 'Leituras')}</nav>`;
}

const ROTULO_JANELA = { '24h': 'últimas 24 horas', '7d': 'últimos 7 dias', '30d': 'últimos 30 dias' };
const fmtN = (n) => (Number(n) || 0).toLocaleString('pt-BR');

function barras(obj, ordem, total) {
  const chaves = ordem || Object.keys(obj).sort((a, b) => obj[b] - obj[a]);
  const soma = total || chaves.reduce((t, k) => t + (obj[k] || 0), 0);
  return `<ul class="barras">${chaves.map((k) => {
    const v = obj[k] || 0;
    const pct = soma ? Math.round((v / soma) * 100) : 0;
    return `<li><div class="b-topo"><span>${esc(k)}</span><span class="b-n">${fmtN(v)} <small>${pct}%</small></span></div><div class="b-trilho"><div class="b-barra" style="width:${pct}%"></div></div></li>`;
  }).join('')}</ul>`;
}

/** Aba "Leituras": analytics do blog (Cloudflare Web Analytics), já agregado e em cache. */
export function renderLeituras(dados, { janela = '7d' } = {}) {
  const jan = ROTULO_JANELA[janela] ? janela : '7d';
  const seg = Object.keys(ROTULO_JANELA).map((k) => `<a href="/painel?aba=leituras&amp;janela=${k}"${k === jan ? ' class="on" aria-current="true"' : ''}>${k}</a>`).join('');
  let corpo;
  if (!dados || !dados.ok) {
    const erro = dados && dados.erro === 'sem_token' ? 'Token de Analytics ausente (CF_ANALYTICS_TOKEN / CF_ACCOUNT_ID).' : `Não foi possível ler o Web Analytics: ${dados && dados.erro || 'erro'}.`;
    corpo = `<section class="card"><p class="bad">${esc(erro)}</p></section>`;
  } else {
    const j = dados.janelas[jan] || {};
    const quando = fmtIsoBrt(dados.geradoEm);
    const ranking = (j.ranking || []).length
      ? `<ol class="ranking">${j.ranking.map((p) => `<li><div class="r-txt"><a href="${SITE}/briefings/${esc(p.slug)}/" target="_blank" rel="noopener">${esc(p.titulo)}</a><div class="r-meta"><span class="tag">${esc(p.tipo)}</span><span>PT ${fmtN(p.idiomas.PT)} · ES ${fmtN(p.idiomas.ES)} · EN ${fmtN(p.idiomas.EN)}</span></div></div><div class="r-n">${fmtN(p.leituras)}</div></li>`).join('')}</ol>`
      : '<p class="muted">Nenhuma leitura de briefing nesta janela.</p>';
    const tipos = { 'Notícia': 0, Incidente: 0, Vulnerabilidades: 0, ...(j.porTipo || {}) };
    const ordemTipos = ['Notícia', 'Incidente', 'Vulnerabilidades', ...Object.keys(tipos).filter((k) => !['Notícia', 'Incidente', 'Vulnerabilidades'].includes(k))];
    const outros = (j.outrosHosts || []).length ? `<p class="muted nota">Outros: ${j.outrosHosts.map(([h, n]) => `${esc(h)} (${fmtN(n)})`).join(', ')}</p>` : '';
    corpo = `
  <section class="card destaque">
    <div class="kpis">
      <div><div class="label">Páginas vistas</div><div class="kpi">${fmtN(j.paginas)}</div></div>
      <div><div class="label">Visitas</div><div class="kpi">${j.visitas == null ? '—' : fmtN(j.visitas)}</div></div>
      <div><div class="label">Leituras de briefings</div><div class="kpi">${fmtN(j.leiturasPosts)}</div></div>
      <div><div class="label">Briefings lidos</div><div class="kpi">${fmtN(j.totalPosts)}</div></div>
    </div>
  </section>

  <section class="card">
    <h2>Mais lidos · ${esc(ROTULO_JANELA[jan])}</h2>
    ${ranking}
  </section>

  <div class="grade grade3">
  <section class="card"><h2>Por tipo</h2>${barras(tipos, ordemTipos)}</section>
  <section class="card"><h2>Por idioma</h2>${barras(j.porIdioma || {}, ['PT', 'ES', 'EN'])}</section>
  <section class="card"><h2>Por origem</h2>${barras(j.porOrigem || {}, ['LinkedIn', 'X', 'Google', 'Direto', 'Outros', 'Navegação no blog'])}${outros}</section>
  </div>

  <p class="aviso"><strong>Estimativa.</strong> Dados do Cloudflare Web Analytics com amostragem (quanto maior a janela, mais amostrado); sem bots. Ranking soma PT/ES/EN do mesmo briefing; tipo, idioma e origem contam só leituras de briefings. Atualizado ${esc(quando)}${dados.doCache ? ' (cache de até 30 min)' : ''}${dados.aviso ? ` · última tentativa falhou: ${esc(dados.aviso)}` : ''}.</p>`;
  }
  return `${cabeca('DSB Auditor — leituras')}
<main>
  ${abas('leituras')}
  <div class="titulo">
    <h1>Leituras do blog</h1>
    <p class="sub">dsb.duarte.top · Cloudflare Web Analytics · horários em Brasília (BRT)</p>
  </div>
  <nav class="seg" aria-label="Janela">${seg}</nav>
  ${corpo}
</main>
${RODAPE_JS}
</body>
</html>`;
}

/** HTML do painel a partir do estado já gravado (sem rede extra). */
export function renderPainel(ultimo, { ultimoAlerta = null } = {}) {
  if (!ultimo) {
    return `${cabeca('DSB Auditor')}
<main>${abas('auditoria')}<div class="titulo"><h1>Painel de auditoria</h1></div><section class="card"><p class="muted">Ainda não houve execução.</p></section></main>
${RODAPE_JS}</body></html>`;
  }
  const statusGeral = ultimo.ok ? '<span class="pill ok">Tudo certo</span>' : `<span class="pill bad">${(ultimo.problemas || []).length} problema(s)</span>`;
  return `${cabeca('DSB Auditor — painel')}
<main>
  ${abas('auditoria')}
  <div class="titulo">
    <h1>Painel de auditoria</h1>
    <p class="sub">Status da última checagem · horários em Brasília (BRT)</p>
  </div>

  <section class="card destaque">
    <div class="row">
      <div>
        <div class="label">Última execução</div>
        <div class="valor">slot <strong>${esc(ultimo.slot)}</strong> · ${esc(ultimo.dataBrt || '')} ${esc(ultimo.horaBrt || '')} BRT</div>
        <div class="muted mono">${esc(fmtIsoBrt(ultimo.em))} (gravado)</div>
      </div>
      <div class="status">${statusGeral}</div>
    </div>
  </section>

  <section class="card">
    <h2>Checagens</h2>
    <table>
      <thead><tr><th>Item</th><th>Estado</th><th>Detalhe</th></tr></thead>
      <tbody>
        ${checagens(ultimo)}
      </tbody>
    </table>
  </section>

  <section class="card">
    <h2>Problemas</h2>
    ${problemasHtml(ultimo)}
  </section>

  <section class="card">
    <h2>Capas faltando</h2>
    ${listaCapas(ultimo)}
  </section>

  <div class="grade">
  <section class="card">
    <h2>Fila (Notion)</h2>
    ${contagensFila(ultimo)}
  </section>

  <section class="card">
    <h2>Flags</h2>
    ${flagsHtml(ultimo)}
  </section>
  </div>

  <section class="card">
    <h2>Último alerta enviado</h2>
    ${alertaHtml(ultimoAlerta, ultimo)}
  </section>

  <footer class="muted">Somente leitura · não dispara checagens nem pushes · subrequests da última execução: ${esc(ultimo.subrequests?.usadas ?? '—')}/${esc(ultimo.subrequests?.orcamento ?? '—')}</footer>
</main>
${RODAPE_JS}
</body>
</html>`;
}

const CSS = `
:root{color-scheme:dark;--bg:#0b0e13;--bg2:#10141b;--card:#171c25;--border:#2a3140;--bs:#232a36;--fg:#eef1f6;--muted:#9aa3b2;--faint:#6b7382;--gold:#d4a054;--gold-dim:#3a2e1a;--ok:#7dcca3;--ok-dim:#173226;--bad:#e59a9a;--bad-dim:#2a1818;--glow:rgba(212,160,84,.08)}
:root[data-tema="claro"]{color-scheme:light;--bg:#f6f4ef;--bg2:#efece5;--card:#ffffff;--border:#ddd8cc;--bs:#e7e3da;--fg:#1a1f29;--muted:#545c6b;--faint:#7a8191;--gold:#9a6a1f;--gold-dim:#f4ead8;--ok:#1f7a4f;--ok-dim:#e2f3ea;--bad:#b23b3b;--bad-dim:#f8e6e6;--glow:rgba(154,106,31,.07)}
@media (prefers-color-scheme:light){:root:not([data-tema="escuro"]){color-scheme:light;--bg:#f6f4ef;--bg2:#efece5;--card:#ffffff;--border:#ddd8cc;--bs:#e7e3da;--fg:#1a1f29;--muted:#545c6b;--faint:#7a8191;--gold:#9a6a1f;--gold-dim:#f4ead8;--ok:#1f7a4f;--ok-dim:#e2f3ea;--bad:#b23b3b;--bad-dim:#f8e6e6;--glow:rgba(154,106,31,.07)}}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;-webkit-font-smoothing:antialiased}
body{margin:0;min-height:100dvh;padding:0 env(safe-area-inset-right,0px) 0 env(safe-area-inset-left,0px);font:15px/1.5 "IBM Plex Sans",ui-sans-serif,system-ui,-apple-system,sans-serif;background:radial-gradient(1200px 420px at 12% -10%,var(--glow),transparent 55%),linear-gradient(180deg,var(--bg) 0%,var(--bg2) 100%);color:var(--fg)}
.topo{position:sticky;top:0;z-index:20;background:var(--bg);border-bottom:1px solid var(--border);padding-top:env(safe-area-inset-top,0px)}
.topo .container{max-width:860px;margin:0 auto;padding:0 20px;display:flex;justify-content:space-between;align-items:center;gap:1rem;min-height:3.9rem}
.brand{display:flex;align-items:center;gap:10px;min-width:0;color:inherit;text-decoration:none}
.brand img.mark{width:38px;height:38px;flex-shrink:0;object-fit:contain;display:block;background:transparent}
.brand .txt{min-width:0}
.brand .wm{display:block;font:700 17px/1.1 "Source Serif 4",Georgia,serif;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.brand small{display:block;margin-top:3px;font-size:12px;color:var(--muted);white-space:nowrap}
.btn-icone{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:2.4rem;height:2.4rem;padding:0;border:1px solid var(--border);border-radius:999px;background:var(--card);color:var(--fg);cursor:pointer}
.btn-icone:hover{color:var(--gold);border-color:var(--gold)}
.btn-icone svg{display:block;width:1.15rem;height:1.15rem;shape-rendering:geometricPrecision}
.btn-icone,.brand{-webkit-appearance:none;appearance:none;-webkit-tap-highlight-color:transparent;box-shadow:none;filter:none}
.btn-icone .i-sol{display:none}:root[data-tema="claro"] .btn-icone .i-sol{display:block}:root[data-tema="claro"] .btn-icone .i-lua{display:none}
@media (prefers-color-scheme:light){:root:not([data-tema="escuro"]) .btn-icone .i-sol{display:block}:root:not([data-tema="escuro"]) .btn-icone .i-lua{display:none}}
a:focus-visible,button:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
main{max-width:860px;margin:0 auto;padding:22px 20px max(2.5rem,calc(env(safe-area-inset-bottom,0px) + 1.5rem))}
.titulo{margin:0 0 14px}
h1{font:700 clamp(24px,5vw,32px)/1.15 "Source Serif 4",Georgia,serif;margin:0 0 6px;letter-spacing:-.01em}
h2{margin:0 0 12px;font:600 11px "IBM Plex Mono",ui-monospace,monospace;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
.sub,.muted{color:var(--muted)}
.sub{margin:0;font-size:13px}
.mono{font-family:"IBM Plex Mono",ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12.5px}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:16px 18px;margin:12px 0}
.destaque{border-color:var(--gold);box-shadow:inset 3px 0 0 var(--gold)}
.destaque .row{display:flex;justify-content:space-between;gap:1rem;align-items:center;flex-wrap:wrap}
.label{font:600 10.5px "IBM Plex Mono",ui-monospace,monospace;text-transform:uppercase;letter-spacing:.12em;color:var(--faint)}
.valor{font:600 19px/1.3 "Source Serif 4",Georgia,serif;margin:4px 0}
.status{font-size:14px}
.pill{display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:999px;font-weight:600}
.pill.ok{background:var(--ok-dim);color:var(--ok)}.pill.bad{background:var(--bad-dim);color:var(--bad)}
.pill::before{content:"";width:7px;height:7px;border-radius:50%;background:currentColor}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{text-align:left;padding:9px 6px;border-bottom:1px solid var(--bs);vertical-align:top}
tr:last-child td{border-bottom:0}
th{color:var(--faint);font:600 10.5px "IBM Plex Mono",ui-monospace,monospace;text-transform:uppercase;letter-spacing:.1em}
td:first-child{font-weight:500}
.det{color:var(--muted);word-break:break-word}
.ok{color:var(--ok);font-weight:600}
.bad{color:var(--bad);font-weight:600}
.na{color:var(--faint)}
.lista{margin:4px 0 0;padding-left:1.1rem}
.lista li{margin:4px 0}
.lista li::marker{color:var(--gold)}
.tag{display:inline-block;font:600 10.5px "IBM Plex Mono",ui-monospace,monospace;padding:2px 8px;border-radius:999px;background:var(--gold-dim);color:var(--gold);margin-right:4px;text-transform:uppercase;letter-spacing:.06em}
.flags strong{color:var(--gold)}
.grade{display:grid;grid-template-columns:1fr 1fr;gap:0 12px}
footer{margin-top:20px;font-size:12px;color:var(--faint)}
@media (max-width:640px){
  .grade{display:block}
  .topo .container,main{padding-left:14px;padding-right:14px}
  .brand .wm{font-size:15px}
  thead{display:none}
  tbody tr{display:grid;grid-template-columns:1fr auto;gap:2px 10px;padding:10px 0;border-bottom:1px solid var(--bs)}
  tbody tr:last-child{border-bottom:0}
  tbody td{padding:0;border:0}
  tbody td.det{grid-column:1 / -1;font-size:13px}
}
.abas{display:flex;gap:4px;margin:0 0 16px;border-bottom:1px solid var(--border)}
.abas a{padding:10px 14px;margin-bottom:-1px;border-bottom:2px solid transparent;color:var(--muted);text-decoration:none;font-weight:600;font-size:14px}
.abas a:hover{color:var(--fg)}.abas a.on{color:var(--gold);border-bottom-color:var(--gold)}
.seg{display:inline-flex;gap:2px;padding:3px;margin:0 0 4px;border:1px solid var(--border);border-radius:999px;background:var(--card)}
.seg a{padding:6px 14px;border-radius:999px;color:var(--muted);text-decoration:none;font:600 12.5px "IBM Plex Mono",ui-monospace,monospace}
.seg a.on{background:var(--gold-dim);color:var(--gold)}
.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}
.kpi{font:700 26px/1.1 "Source Serif 4",Georgia,serif;margin-top:4px}
.ranking{margin:0;padding:0;list-style:none;counter-reset:r}
.ranking li{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-bottom:1px solid var(--bs);counter-increment:r}
.ranking li:last-child{border-bottom:0}
.ranking li::before{content:counter(r);flex:0 0 1.6rem;font:700 18px/1.3 "Source Serif 4",Georgia,serif;color:var(--gold)}
.r-txt{flex:1;min-width:0}.r-txt a{color:var(--fg);text-decoration:none;font-weight:600;line-height:1.35}.r-txt a:hover{color:var(--gold)}
.r-meta{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center;margin-top:5px;font-size:12px;color:var(--faint)}
.r-n{font:700 18px/1.3 "IBM Plex Mono",ui-monospace,monospace;color:var(--fg);font-variant-numeric:tabular-nums}
.barras{margin:0;padding:0;list-style:none}.barras li{margin:0 0 10px}
.b-topo{display:flex;justify-content:space-between;gap:8px;font-size:13.5px}.b-n{font-variant-numeric:tabular-nums;font-weight:600}.b-n small{color:var(--faint);font-weight:500}
.b-trilho{height:6px;margin-top:5px;border-radius:999px;background:var(--bs);overflow:hidden}.b-barra{height:100%;border-radius:999px;background:var(--gold)}
.grade3{grid-template-columns:repeat(3,1fr)}
.nota{font-size:12px;margin:6px 0 0}
.aviso{margin:14px 0 0;padding:12px 14px;border:1px dashed var(--border);border-radius:12px;font-size:12.5px;color:var(--muted)}
.aviso strong{color:var(--gold)}
@media (max-width:860px){.grade3{grid-template-columns:1fr 1fr}}
@media (max-width:640px){.kpis{grid-template-columns:1fr 1fr}.kpi{font-size:22px}.grade3{display:block}}
`;
