import { autorizarAdmin } from './auth.js';
import { logEvento } from './log.js';

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

export async function tratarPedido(request, env, agenda) {
  const path = new URL(request.url).pathname.replace(/\/$/, '') || '/';
  if (request.method === 'GET' && path === '/health') {
    return json({ ok: true, servico: 'dsb-push-agenda' });
  }
  if (!path.startsWith('/admin/')) return json({ ok: false, erro: 'nao_encontrado' }, 404);

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

    if (path === '/admin/tick') return json(await agenda.tick({ origem: 'admin' }));

    const lido = await lerCorpo(request);
    if (lido.erro) return json({ ok: false, erro: lido.erro }, lido.status);

    if (path === '/admin/simular') return json({ ok: true, ...(await agenda.simular(lido.corpo)) });
    if (path === '/admin/importar') {
      const r = await agenda.importar(lido.corpo);
      return json(r, r.ok ? 200 : 400);
    }
    if (path === '/admin/envio') {
      const r = await agenda.definirEnvio(lido.corpo.ligado);
      return json(r, r.ok ? 200 : 400);
    }
    return json({ ok: false, erro: 'nao_encontrado' }, 404);
  } catch {
    logEvento('admin', { resultado: 'erro' });
    return json({ ok: false, erro: 'interno' }, 500);
  }
}
