import { ErroApi, json, lerCorpo } from './http.js';
import { autenticar } from './auth.js';
import { obterPost, listarPosts, verificarDedup, criarPost, adicionarChaves, editarPost, mudarStatus, reordenar, filaDoCanal } from './posts.js';
import { reservar, concluir } from './publicacoes.js';
import { listar, resumo, atualizar, registrar, registrarRecusa, marcarNotificadas, varrer } from './pendencias.js';
import { iniciarJob, finalizarJob } from './jobs.js';

/**
 * Rotas (todas exigem autenticação; ver auth.js):
 *  GET  /health
 *  GET  /dedup?url=…&cve=CVE-…            consulta sem escrever
 *  GET  /posts?status=&tipo=&desde=&limite=
 *  POST /posts                             cria item Novo (dedup por chave; follow_up_of)
 *  GET  /posts/:id
 *  PATCH /posts/:id                        edita campos permitidos
 *  POST /posts/:id/status                  {para, notas, motivo, estrela}
 *  POST /posts/:id/chaves                  {cves, url} — corrige "sem chave"
 *  POST /posts/reordenar                   {status, ids}
 *  GET  /fila/:canal                       blog | linkedin | x | traducoes
 *  POST /publicacoes                       reserva {post_id, canal, idioma}
 *  POST /publicacoes/:id/resultado         {status: publicado|falhou|pulado, url, erro, external_id, body, published_at}
 *  GET  /pendencias?status=&severity=&stage=&source=&post_id=&limite=
 *  GET  /pendencias/resumo
 *  POST /pendencias                        relato de agente {fingerprint, kind, severity, stage, summary, …}
 *  PATCH /pendencias/:id                   {status, resolution}
 *  POST /pendencias/notificadas            {ids}
 *  POST /varrer                            roda as verificações de saúde
 *  POST /jobs                              {job} → id
 *  PATCH /jobs/:id                         {status: ok|error|skipped, notes, items_read, items_written} (+ varredura)
 *
 * Toda escrita recusada vira pendência (source = api) e a resposta traz o número dela em "pendencia".
 */
export async function tratar(request, env) {
  const url = new URL(request.url);
  const metodo = request.method;
  const partes = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const rota = `${metodo} /${partes.map((p) => (/^\d+$/.test(p) ? ':id' : p)).join('/')}`;

  if (metodo === 'GET' && rota === 'GET /health') return json({ ok: true, servico: 'dsb-api' });

  const sessao = await autenticar(request, env);
  if (!sessao.ok) return json({ ok: false, erro: sessao.erro }, sessao.status);

  const db = env.DB;
  if (!db) return json({ ok: false, erro: 'sem_banco' }, 503);

  let corpo = null;
  try {
    if (metodo === 'POST' || metodo === 'PATCH') corpo = await lerCorpo(request);
    const id = partes[1] && /^\d+$/.test(partes[1]) ? Number(partes[1]) : null;
    const resultado = await despachar({ rota, db, url, corpo, id, sessao });
    return json({ ok: true, ...resultado.corpo }, resultado.status || 200);
  } catch (e) {
    if (e instanceof ErroApi) {
      let pendencia = null;
      if (metodo !== 'GET' && e.status !== 404) {
        pendencia = await registrarRecusa(db, { erro: e, rota, sessao, corpo, postId: partes[0] === 'posts' && /^\d+$/.test(partes[1] || '') ? Number(partes[1]) : null });
      }
      return json({ ok: false, erro: e.codigo, mensagem: e.message, ...e.extra, pendencia }, e.status);
    }
    const msg = String((e && e.message) || e).slice(0, 300);
    const pendencia = await registrarRecusa(db, {
      erro: new ErroApi(500, 'erro_interno', msg),
      rota,
      sessao,
      corpo
    });
    console.log(JSON.stringify({ evento: 'erro_interno', rota, msg }));
    return json({ ok: false, erro: 'erro_interno', mensagem: msg, pendencia }, 500);
  }
}

async function despachar({ rota, db, url, corpo, id, sessao }) {
  const q = url.searchParams;
  switch (rota) {
    case 'GET /dedup':
      return { corpo: await verificarDedup(db, { sourceUrl: q.get('url'), cves: q.getAll('cve') }) };
    case 'GET /posts':
      return { corpo: { itens: await listarPosts(db, q) } };
    case 'POST /posts':
      return { corpo: { item: await criarPost(db, corpo, sessao) }, status: 201 };
    case 'POST /posts/reordenar':
      return { corpo: await reordenar(db, corpo, sessao) };
    case 'GET /posts/:id':
      return { corpo: { item: await obterPost(db, id) } };
    case 'PATCH /posts/:id':
      return { corpo: { item: await editarPost(db, id, corpo, sessao) } };
    case 'POST /posts/:id/status':
      return { corpo: { item: await mudarStatus(db, id, corpo, sessao) } };
    case 'POST /posts/:id/chaves':
      return { corpo: { item: await adicionarChaves(db, id, corpo, sessao) } };
    case 'GET /fila/blog':
    case 'GET /fila/linkedin':
    case 'GET /fila/x':
    case 'GET /fila/traducoes':
      return { corpo: { itens: await filaDoCanal(db, rota.split('/').pop(), q.get('limite')) } };
    case 'POST /publicacoes':
      return { corpo: { publicacao: await reservar(db, corpo, sessao) }, status: 201 };
    case 'POST /publicacoes/:id/resultado':
      return { corpo: await concluir(db, id, corpo, sessao) };
    case 'GET /pendencias':
      return { corpo: { itens: await listar(db, q) } };
    case 'GET /pendencias/resumo':
      return { corpo: { resumo: await resumo(db) } };
    case 'POST /pendencias':
      return {
        corpo: {
          pendencia: await registrar(db, {
            ...corpo,
            source: 'agente',
            check_name: null,
            agent: sessao.ator,
            fingerprint: corpo && corpo.fingerprint ? `agente:${corpo.fingerprint}` : null
          })
        },
        status: 201
      };
    case 'PATCH /pendencias/:id':
      return { corpo: { pendencia: await atualizar(db, id, corpo, sessao) } };
    case 'POST /pendencias/notificadas':
      return { corpo: { marcadas: await marcarNotificadas(db, corpo.ids) } };
    case 'POST /varrer':
      return { corpo: { varredura: await varrer(db) } };
    case 'POST /jobs':
      return { corpo: { job: await iniciarJob(db, corpo, sessao) }, status: 201 };
    case 'PATCH /jobs/:id': {
      const job = await finalizarJob(db, id, corpo);
      const varredura = await varrer(db).catch((e) => ({ erro: String(e.message || e).slice(0, 200) }));
      return { corpo: { job, varredura } };
    }
    default:
      throw new ErroApi(404, 'nao_encontrado', `Rota inexistente: ${rota}`);
  }
}

export default {
  fetch(request, env) {
    return tratar(request, env);
  }
};
