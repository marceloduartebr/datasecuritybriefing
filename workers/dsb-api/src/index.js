import { ApiError, json, readBody } from './http.js';
import { authenticate } from './auth.js';
import { getPost, listPosts, checkDedup, createPost, addKeys, editPost, changeStatus, reorder, channelQueue } from './posts.js';
import { claim, complete } from './publications.js';
import { list, summary, update, record, recordRejection, markNotified, sweep } from './issues.js';
import { startJob, finishJob } from './jobs.js';
import { listCompetitors } from './competitors.js';

/**
 * Routes (all require authentication except /health; see auth.js):
 *  GET   /health
 *  GET   /dedup?url=…&cve=CVE-…&related=…&story_key=…  read-only dedup check (match exact | story_recent; warnings)
 *  GET   /competitors[?text=…]             BigID competitor list and editorial rule
 *  GET   /posts?status=&type=&since=&limit=
 *  POST  /posts                            creates a new post (dedup by key; follow_up_of, related_urls, story_key)
 *  GET   /posts/:id
 *  PATCH /posts/:id                        edits allowed fields
 *  POST  /posts/:id/status                 {to, notes, reason, star}; to=removed only via the internal token
 *  POST  /posts/:id/keys                   {cves, url, urls, story_key} → {id, keys} (append-only)
 *  POST  /posts/reorder                    {status, ids}
 *  GET   /queue/:channel                   blog | linkedin | x | translations | removals (pending takedowns)
 *  POST  /publications                     claim {post_id, channel, lang}
 *  POST  /publications/:id/result          {status: published|failed|skipped, url, error, external_id, body, published_at}
 *                                          on a removal_pending row: {status: removed|removal_failed, error}
 *  GET   /issues?status=&severity=&stage=&source=&kind=&post_id=&limit=
 *  GET   /issues/summary
 *  POST  /issues                           agent report {fingerprint, kind, severity, stage, summary, …}
 *  PATCH /issues/:id                       {status, resolution}
 *  POST  /issues/notified                  {ids}
 *  POST  /sweep                            runs the health checks
 *  POST  /jobs                             {job} → id
 *  PATCH /jobs/:id                         {status: ok|error|skipped, notes, items_read, items_written} (+ sweep)
 *
 * Every rejected write becomes an issue (source = api) and the response carries its id in "issue".
 */
export async function handle(request, env) {
  const url = new URL(request.url);
  const method = request.method;
  const parts = url.pathname.replace(/\/+$/, '').split('/').filter(Boolean);
  const route = `${method} /${parts.map((p) => (/^\d+$/.test(p) ? ':id' : p)).join('/')}`;

  if (route === 'GET /health') return json({ ok: true, service: 'dsb-api' });

  const session = await authenticate(request, env);
  if (!session.ok) return json({ ok: false, error: session.error }, session.status);

  const db = env.DB;
  if (!db) return json({ ok: false, error: 'no_database' }, 503);

  let body = null;
  const postId = parts[0] === 'posts' && /^\d+$/.test(parts[1] || '') ? Number(parts[1]) : null;
  try {
    if (method === 'POST' || method === 'PATCH') body = await readBody(request);
    const id = parts[1] && /^\d+$/.test(parts[1]) ? Number(parts[1]) : null;
    const result = await dispatch({ route, db, url, body, id, session });
    return json({ ok: true, ...result.body }, result.status || 200);
  } catch (e) {
    if (e instanceof ApiError) {
      let issue = null;
      if (method !== 'GET' && e.status !== 404) {
        const pid = postId ?? (await postOfRequest(db, parts, body));
        issue = await recordRejection(db, { error: e, route, session, body, postId: pid });
      }
      return json({ ok: false, error: e.code, message: e.message, ...e.extra, issue }, e.status);
    }
    const msg = String((e && e.message) || e).slice(0, 300);
    const issue = await recordRejection(db, { error: new ApiError(500, 'internal_error', msg), route, session, body, postId: postId ?? (await postOfRequest(db, parts, body)) });
    console.log(JSON.stringify({ event: 'internal_error', route, msg }));
    return json({ ok: false, error: 'internal_error', message: msg, issue }, 500);
  }
}

/** The post a rejected write was about, so its issue groups per post (X-11): /posts/:id from the URL, a claim's
 *  body.post_id, or the post of /publications/:id. Never throws. */
async function postOfRequest(db, parts, body) {
  try {
    const n = body && Number(body.post_id);
    if (Number.isInteger(n) && n > 0) return n;
    if (parts[0] === 'publications' && /^\d+$/.test(parts[1] || '')) {
      const r = await db.prepare('SELECT post_id FROM publications WHERE id = ?1').bind(Number(parts[1])).first();
      return r ? r.post_id : null;
    }
  } catch {
    /* fall through */
  }
  return null;
}

async function dispatch({ route, db, url, body, id, session }) {
  const q = url.searchParams;
  switch (route) {
    case 'GET /dedup':
      return { body: await checkDedup(db, { sourceUrl: q.get('url'), cves: q.getAll('cve'), related: q.getAll('related'), storyKey: q.get('story_key') }) };
    case 'GET /competitors':
      return { body: await listCompetitors(db, q) };
    case 'GET /posts':
      return { body: { items: await listPosts(db, q) } };
    case 'POST /posts':
      return { body: { post: await createPost(db, body, session) }, status: 201 };
    case 'POST /posts/reorder':
      return { body: await reorder(db, body, session) };
    case 'GET /posts/:id':
      return { body: { post: await getPost(db, id) } };
    case 'PATCH /posts/:id':
      return { body: { post: await editPost(db, id, body, session) } };
    case 'POST /posts/:id/status':
      return { body: { post: await changeStatus(db, id, body, session) } };
    case 'POST /posts/:id/keys':
      return { body: { post: await addKeys(db, id, body) } };
    case 'GET /queue/blog':
    case 'GET /queue/linkedin':
    case 'GET /queue/x':
    case 'GET /queue/translations':
    case 'GET /queue/removals':
      return { body: { items: await channelQueue(db, route.split('/').pop(), q.get('limit')) } };
    case 'POST /publications':
      return { body: { publication: await claim(db, body, session) }, status: 201 };
    case 'POST /publications/:id/result':
      return { body: await complete(db, id, body, session) };
    case 'GET /issues':
      return { body: { items: await list(db, q) } };
    case 'GET /issues/summary':
      return { body: { summary: await summary(db) } };
    case 'POST /issues':
      return {
        body: {
          issue: await record(db, {
            ...body,
            source: 'agent',
            check_name: null,
            agent: session.actor,
            fingerprint: body && body.fingerprint ? `agent:${body.fingerprint}` : null
          })
        },
        status: 201
      };
    case 'PATCH /issues/:id':
      return { body: { issue: await update(db, id, body, session) } };
    case 'POST /issues/notified':
      return { body: { marked: await markNotified(db, body.ids) } };
    case 'POST /sweep':
      return { body: { sweep: await sweep(db) } };
    case 'POST /jobs':
      return { body: { job: await startJob(db, body, session) }, status: 201 };
    case 'PATCH /jobs/:id': {
      const job = await finishJob(db, id, body);
      const s = await sweep(db).catch((e) => ({ error: String(e.message || e).slice(0, 200) }));
      return { body: { job, sweep: s } };
    }
    default:
      throw new ApiError(404, 'not_found', `Unknown route: ${route}`);
  }
}

export default {
  fetch(request, env) {
    return handle(request, env);
  }
};
