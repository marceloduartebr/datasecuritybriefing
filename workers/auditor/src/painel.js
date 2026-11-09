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

/** HTML do painel a partir do estado já gravado (sem rede extra). */
export function renderPainel(ultimo, { ultimoAlerta = null } = {}) {
  if (!ultimo) {
    return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>DSB Auditor</title>
<link rel="icon" href="${SITE}/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" sizes="180x180" href="${SITE}/icon-180.png?v=2">
<style>${CSS}</style></head><body><main><h1>DSB Auditor</h1><p class="muted">Ainda não houve execução.</p></main></body></html>`;
  }
  const statusGeral = ultimo.ok ? '<span class="ok">Tudo certo</span>' : `<span class="bad">${(ultimo.problemas || []).length} problema(s)</span>`;
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>DSB Auditor — painel</title>
<link rel="icon" href="${SITE}/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" sizes="180x180" href="${SITE}/icon-180.png?v=2">
<style>${CSS}</style>
</head>
<body>
<main>
  <header>
    <h1>DSB Auditor</h1>
    <p class="sub">Status da última checagem · horários em Brasília (BRT)</p>
  </header>

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

  <section class="card">
    <h2>Fila (Notion)</h2>
    ${contagensFila(ultimo)}
  </section>

  <section class="card">
    <h2>Flags</h2>
    ${flagsHtml(ultimo)}
  </section>

  <section class="card">
    <h2>Último alerta enviado</h2>
    ${alertaHtml(ultimoAlerta, ultimo)}
  </section>

  <footer class="muted">Somente leitura · não dispara checagens nem pushes · subrequests da última execução: ${esc(ultimo.subrequests?.usadas ?? '—')}/${esc(ultimo.subrequests?.orcamento ?? '—')}</footer>
</main>
</body>
</html>`;
}

const CSS = `
:root { color-scheme: light dark; --bg:#0b1220; --card:#121a2b; --fg:#e8eefc; --muted:#9aa8c3; --ok:#3dd68c; --bad:#ff6b6b; --line:#243049; --accent:#6ea8fe; }
@media (prefers-color-scheme: light) {
  :root { --bg:#f4f7fb; --card:#fff; --fg:#142033; --muted:#5b6b86; --ok:#0a7a43; --bad:#c62828; --line:#d7e0ef; --accent:#1d4ed8; }
}
* { box-sizing: border-box; }
body { margin:0; font: 15px/1.45 system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background: var(--bg); color: var(--fg); }
main { max-width: 820px; margin: 0 auto; padding: 1.25rem 1rem 2.5rem; }
header { margin-bottom: 1rem; }
h1 { font-size: 1.35rem; margin: 0 0 .25rem; }
h2 { font-size: 1rem; margin: 0 0 .75rem; }
.sub, .muted { color: var(--muted); }
.mono { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: .85rem; }
.card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 1rem 1.1rem; margin: .85rem 0; }
.destaque .row { display:flex; justify-content:space-between; gap:1rem; align-items:flex-start; flex-wrap:wrap; }
.label { font-size:.75rem; text-transform:uppercase; letter-spacing:.04em; color:var(--muted); }
.valor { font-size:1.05rem; margin:.15rem 0; }
.status { font-size:1.05rem; font-weight:600; }
table { width:100%; border-collapse: collapse; font-size: .92rem; }
th, td { text-align:left; padding: .45rem .35rem; border-bottom: 1px solid var(--line); vertical-align: top; }
th { color: var(--muted); font-weight: 600; font-size: .75rem; text-transform: uppercase; letter-spacing: .03em; }
.det { color: var(--muted); word-break: break-word; }
.ok { color: var(--ok); font-weight: 600; }
.bad { color: var(--bad); font-weight: 600; }
.na { color: var(--muted); }
.lista { margin: .25rem 0 0; padding-left: 1.1rem; }
.lista li { margin: .2rem 0; }
.tag { display:inline-block; font-size:.7rem; padding:.05rem .35rem; border-radius:999px; border:1px solid var(--line); color:var(--muted); margin-right:.25rem; }
.flags strong { color: var(--accent); }
footer { margin-top: 1.25rem; font-size: .8rem; }
@media (max-width: 560px) {
  th:nth-child(3), td.det { display:none; }
  main { padding: 1rem .75rem 2rem; }
}
`;
