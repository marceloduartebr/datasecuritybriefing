import { autorizarAdmin } from './auth.js';
import { logEvento } from './log.js';
import { normalizarIsolado } from './logica.js';
import { autorizarAlerta, enviarAlerta, validarAlerta } from './alerta.js';

const LIMITE = 262144;

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

async function lerCorpo(request) {
  const declarado = Number(request.headers.get('Content-Length') || 0);
  if (declarado > LIMITE) return { erro: 'corpo_grande', status: 413 };
  const texto = await request.text();
  if (texto.length > LIMITE) return { erro: 'corpo_grande', status: 413 };
  if (!texto.length) return { corpo: {} };
  try {
    const corpo = JSON.parse(texto);
    if (!corpo || typeof corpo !== 'object' || Array.isArray(corpo)) return { erro: 'corpo', status: 400 };
    return { corpo };
  } catch {
    return { erro: 'json', status: 400 };
  }
}

export async function tratarPedido(request, env, agenda, deps = {}) {
  const path = new URL(request.url).pathname.replace(/\/$/, '') || '/';
  if (request.method === 'GET' && path === '/health') {
    return json({ ok: true, servico: 'dsb-push-agenda' });
  }
  if (!path.startsWith('/admin/')) return json({ ok: false, erro: 'nao_encontrado' }, 404);

  // Alerta operacional: token próprio (ALERTA_TOKEN), só allowlist fixa do Marcelo. ADMIN_TOKEN não vale aqui.
  if (path === '/admin/alerta') {
    if (request.method !== 'POST') return json({ ok: false, erro: 'metodo' }, 405);
    const authA = await autorizarAlerta(request, env);
    if (!authA.ok) {
      logEvento('alerta', { resultado: authA.status === 503 ? 'nao_configurado' : 'negado' });
      return json({ ok: false, erro: authA.erro }, authA.status);
    }
    const lidoA = await lerCorpo(request);
    if (lidoA.erro) return json({ ok: false, erro: lidoA.erro }, lidoA.status);
    const v = validarAlerta(lidoA.corpo);
    if (v.erro) return json({ ok: false, erro: v.erro }, 400);
    try {
      return json(await (deps.enviarAlerta || enviarAlerta)(env, v.payload));
    } catch {
      return json({ ok: false, erro: 'interno' }, 500);
    }
  }

  const auth = await autorizarAdmin(request, env);
  if (!auth.ok) {
    logEvento('admin', { resultado: auth.status === 503 ? 'nao_configurado' : 'negado' });
    return json({ ok: false, erro: auth.erro }, auth.status);
  }

  try {
    if (request.method === 'GET' && path === '/admin/status') {
      return json({ ok: true, ...(await agenda.status()) });
    }
    if (request.method !== 'POST') return json({ ok: false, erro: 'metodo' }, 405);

    const lido = await lerCorpo(request);
    if (lido.erro) return json({ ok: false, erro: lido.erro }, lido.status);

    if (path === '/admin/tick') {
      const isolado = normalizarIsolado(lido.corpo.somente, lido.corpo.slug);
      if (isolado.erro) return json({ ok: false, erro: isolado.erro, enviou: false }, 400);
      // Só 'evento' altera a origem; qualquer outro valor (ou ausência) permanece 'admin'.
      const pedido = { origem: lido.corpo.origem === 'evento' ? 'evento' : 'admin' };
      if (isolado.chaves) {
        pedido.somente = isolado.chaves;
        pedido.slug = isolado.slug;
      }
      return json(await agenda.tick(pedido));
    }
    if (path === '/admin/medir') {
      const r = await agenda.medir(lido.corpo);
      return json(r, 200);
    }
    if (path === '/admin/simular') return json({ ok: true, ...(await agenda.simular(lido.corpo)) });
    if (path === '/admin/importar') {
      const r = await agenda.importar(lido.corpo);
      return json(r, r.ok ? 200 : 400);
    }
    if (path === '/admin/envio') {
      const r = await agenda.definirEnvio(lido.corpo.ligado);
      return json(r, r.ok ? 200 : 400);
    }
    if (path === '/admin/fanout') {
      const r = await agenda.definirFanout(lido.corpo.ligado);
      return json(r, r.ok ? 200 : 400);
    }
    return json({ ok: false, erro: 'nao_encontrado' }, 404);
  } catch {
    logEvento('admin', { resultado: 'erro' });
    return json({ ok: false, erro: 'interno' }, 500);
  }
}
