import { ApiError, nowIso, nz, constraintError } from './http.js';
import { validateNewPost, postKeys, normalizeUrl, validateCves, validateCover, validateRelatedUrls, validateStoryKey, storyRoot, isGenericUrl, EDITABLE, TRANSITIONS, STATUSES, TYPES } from './rules.js';

export async function getPost(db, id, { full = true } = {}) {
  const p = await db.prepare('SELECT * FROM posts WHERE id = ?1').bind(id).first();
  if (!p) throw new ApiError(404, 'not_found', 'Post not found');
  if (!full) return p;
  const [keys, pubs] = await Promise.all([
    db.prepare('SELECT key, kind FROM post_keys WHERE post_id = ?1 ORDER BY key').bind(id).all(),
    db.prepare('SELECT * FROM publications WHERE post_id = ?1 ORDER BY channel, lang').bind(id).all()
  ]);
  return { ...p, keys: keys.results || [], publications: pubs.results || [] };
}

export async function listPosts(db, params) {
  const where = [];
  const binds = [];
  const status = params.get('status');
  if (status) {
    const v = status.split(',').filter((s) => STATUSES.includes(s));
    if (v.length) {
      where.push(`p.status IN (${v.map(() => '?').join(',')})`);
      binds.push(...v);
    }
  }
  const type = params.get('type');
  if (type && TYPES.includes(type)) {
    where.push('p.type = ?');
    binds.push(type);
  }
  const since = params.get('since');
  if (since && !Number.isNaN(Date.parse(since))) {
    where.push('julianday(p.added_at) >= julianday(?)');
    binds.push(since);
  }
  const limit = Math.min(Math.max(Number(params.get('limit')) || 100, 1), 500);
  const r = await db
    .prepare(
      `SELECT v.*, p.source_url, p.source_name, p.added_by, p.added_at, p.approved_at, p.follow_up_of,
              p.image_source, p.post_text, p.approval_notes, p.discard_reason, p.removal_reason, p.removed_at,
              (SELECT b.published_at FROM publications b
                WHERE b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'published') AS blog_published_at
       FROM v_post_channels v JOIN posts p ON p.id = v.id
       ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
       ORDER BY CASE p.status WHEN 'approved' THEN 0 WHEN 'new' THEN 1 WHEN 'published' THEN 2 ELSE 3 END,
                CASE p.priority WHEN 'high' THEN 0 ELSE 1 END, p.item_order, p.added_at
       LIMIT ${limit}`
    )
    .bind(...binds)
    .all();
  return r.results || [];
}

/** Root of a follow-up chain (collisions inside the same story are accepted). */
async function rootOf(db, id) {
  let current = id;
  for (let i = 0; i < 20; i++) {
    const r = await db.prepare('SELECT follow_up_of FROM posts WHERE id = ?1').bind(current).first();
    if (!r) return null;
    if (r.follow_up_of == null) return current;
    current = r.follow_up_of;
  }
  return current;
}

/** All subject keys of a post: CVEs, the source URL (unless generic), related outlet URLs and the story key. */
async function allKeys(db, { sourceUrl, cves, relatedUrls = [], storyKey = null }) {
  const { keys, generic } = await postKeys(db, { sourceUrl, cves });
  for (const u of relatedUrls) {
    if (u !== sourceUrl && !(await isGenericUrl(db, u))) keys.push({ key: `url:${u}`, kind: 'url' });
  }
  if (storyKey) keys.push({ key: `story:${storyKey}`, kind: 'story' });
  const seen = new Set();
  return { keys: keys.filter((k) => !seen.has(k.key) && seen.add(k.key)), generic };
}

/** Read-only dedup check: returns the keys the post would have and the collisions.
 *  match: exact (same key) or story_recent (same story root and event, another month, added in the last 10 days). */
export async function checkDedup(db, { sourceUrl, cves, related = [], storyKey = null }) {
  const url = normalizeUrl(sourceUrl);
  const list = validateCves(cves);
  const story = validateStoryKey(storyKey);
  const { keys, generic } = await allKeys(db, { sourceUrl: url, cves: list, relatedUrls: validateRelatedUrls(related), storyKey: story });
  const collisions = await collisionsOf(db, keys);
  const warnings = generic && !list.length ? ['generic_url_needs_cve'] : [];
  return { source_url: url, generic_url: generic, keys, collisions, free: collisions.length === 0, warnings };
}

async function collisionsOf(db, keys) {
  if (!keys.length) return [];
  const r = await db
    .prepare(
      `SELECT k.key, p.id, p.topic, p.status, p.type, p.item_order, p.discard_reason, p.added_at, 'exact' AS match
       FROM post_keys k JOIN posts p ON p.id = k.post_id
       WHERE k.key IN (${keys.map((_, i) => `?${i + 1}`).join(',')})`
    )
    .bind(...keys.map((c) => c.key))
    .all();
  const out = r.results || [];
  for (const s of keys.filter((k) => k.kind === 'story')) {
    const root = `story:${storyRoot(s.key.slice('story:'.length))}-`;
    const near = await db
      .prepare(
        `SELECT k.key, p.id, p.topic, p.status, p.type, p.item_order, p.discard_reason, p.added_at, 'story_recent' AS match
         FROM post_keys k JOIN posts p ON p.id = k.post_id
         WHERE k.kind = 'story' AND k.key <> ?1 AND substr(k.key, 1, length(?2)) = ?2
           AND length(k.key) = length(?2) + 7 AND julianday('now') - julianday(p.added_at) <= 10`
      )
      .bind(s.key, root)
      .all();
    for (const c of near.results || []) if (!out.some((o) => o.id === c.id && o.key === c.key)) out.push(c);
  }
  return out;
}

export async function createPost(db, body, session) {
  const d = validateNewPost(body, session);
  const { keys } = await allKeys(db, { sourceUrl: d.source_url, cves: d.cves, relatedUrls: d.related_urls, storyKey: d.story_key });
  if (!keys.length) {
    throw new ApiError(422, 'missing_key', 'Generic source without a CVE: send the CVEs, a specific URL or a story_key', { source_url: d.source_url });
  }

  let targetRoot = null;
  if (d.follow_up_of != null) {
    if (!Number.isInteger(d.follow_up_of)) throw new ApiError(422, 'invalid_value', 'follow_up_of must be a numeric id');
    targetRoot = await rootOf(db, d.follow_up_of);
    if (targetRoot == null) throw new ApiError(422, 'invalid_reference', 'follow_up_of points to a missing post');
  }

  const collisions = await collisionsOf(db, keys);
  const shared = new Set();
  const blocking = [];
  for (const c of collisions) {
    if (targetRoot != null && (await rootOf(db, c.id)) === targetRoot) shared.add(c.key);
    else blocking.push(c);
  }
  if (blocking.length) {
    const onlyDiscarded = blocking.every((c) => c.status === 'discarded');
    const c = blocking[0];
    throw new ApiError(
      409,
      onlyDiscarded ? 'subject_discarded' : 'subject_already_covered',
      onlyDiscarded
        ? `Subject discarded in #${c.id} (${c.discard_reason || 'no reason recorded'}); it can only come back as follow_up_of with a new fact`
        : `Subject already covered by #${c.id} (${c.status}): ${c.topic}`,
      { key: c.key, collisions: blocking }
    );
  }

  const order = await db.prepare(`SELECT IFNULL(MAX(item_order), 0) + 1 AS n FROM posts WHERE status = 'new'`).first();
  let post;
  try {
    post = await db
      .prepare(
        `INSERT INTO posts (notion_id, topic, type, country, priority, item_order, source_name, source_url, slug,
                            briefing_md, post_text, image_source, image_url, added_by, added_at, follow_up_of)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16) RETURNING *`
      )
      .bind(
        d.notion_id, d.topic, d.type, d.country, d.priority, order.n, d.source_name, d.source_url, d.slug,
        d.briefing_md, d.post_text, d.image_source, d.image_url, d.added_by, d.added_at, d.follow_up_of
      )
      .first();
  } catch (e) {
    throw constraintError(e) || e;
  }

  const fresh = keys.filter((c) => !shared.has(c.key));
  const stmts = fresh.map((c) => db.prepare('INSERT INTO post_keys (key, post_id, kind) VALUES (?1, ?2, ?3)').bind(c.key, post.id, c.kind));
  stmts.push(
    db
      .prepare('INSERT INTO post_events (post_id, from_status, to_status, actor, notes) VALUES (?1, NULL, ?2, ?3, ?4)')
      .bind(post.id, 'new', session.actor, d.follow_up_of != null ? `follow-up of #${d.follow_up_of}` : null)
  );
  try {
    await db.batch(stmts);
  } catch (e) {
    // Another post took the key meanwhile: undo the insert so no post is left without keys.
    await db.prepare('DELETE FROM posts WHERE id = ?1').bind(post.id).run();
    throw constraintError(e) || e;
  }
  return { ...post, keys: fresh, keys_shared_with_follow_up: [...shared] };
}

/** POST /posts/:id/keys {cves, url, urls, story_key}: adds keys (append-only). Answers the post id and all its keys. */
export async function addKeys(db, id, body) {
  const p = await getPost(db, id, { full: false });
  const cves = validateCves(body.cves);
  const keys = cves.map((c) => ({ key: `cve:${c}`, kind: 'cve' }));
  const urls = validateRelatedUrls([...(body.url ? [body.url] : []), ...(Array.isArray(body.urls) ? body.urls : [])]);
  for (const url of urls) {
    const { keys: k } = await postKeys(db, { sourceUrl: url, cves: [] });
    keys.push(...k);
  }
  const story = validateStoryKey(body.story_key);
  if (story) keys.push({ key: `story:${story}`, kind: 'story' });
  if (!keys.length) throw new ApiError(422, 'missing_key', 'Send cves, a specific url (or urls) or a story_key');
  const root = await rootOf(db, p.id);
  const collisions = [];
  for (const c of await collisionsOf(db, keys)) {
    if (c.id !== p.id && (await rootOf(db, c.id)) !== root) collisions.push(c);
  }
  if (collisions.length) throw new ApiError(409, 'subject_already_covered', `Key already belongs to #${collisions[0].id}`, { key: collisions[0].key, collisions });
  try {
    await db.batch(keys.map((c) => db.prepare('INSERT OR IGNORE INTO post_keys (key, post_id, kind) VALUES (?1, ?2, ?3)').bind(c.key, p.id, c.kind)));
  } catch (e) {
    throw constraintError(e) || e;
  }
  const all = await db.prepare('SELECT key, kind FROM post_keys WHERE post_id = ?1 ORDER BY key').bind(p.id).all();
  return { id: p.id, keys: all.results || [] };
}

export async function editPost(db, id, body, session) {
  const current = await getPost(db, id, { full: false });
  for (const forbidden of ['status', 'source_url', 'id', 'notion_id', 'added_by', 'follow_up_of']) {
    if (forbidden in body) throw new ApiError(422, 'field_not_editable', `${forbidden} cannot be changed by an edit`);
  }
  const sets = [];
  const binds = [];
  for (const [field, validate] of Object.entries(EDITABLE)) {
    if (!(field in body)) continue;
    sets.push(`${field} = ?`);
    binds.push(validate(body[field]));
  }
  if ('image_source' in body || 'image_url' in body) {
    const cover = validateCover(
      'image_source' in body ? body.image_source : current.image_source,
      'image_url' in body ? body.image_url : current.image_url
    );
    sets.push('image_source = ?', 'image_url = ?');
    binds.push(cover.image_source, cover.image_url);
  }
  if (!sets.length) throw new ApiError(422, 'nothing_to_change', 'No editable field sent');
  try {
    await db.batch([
      db.prepare(`UPDATE posts SET ${sets.join(', ')} WHERE id = ?`).bind(...binds, id),
      db
        .prepare('INSERT INTO post_events (post_id, from_status, to_status, actor, notes) VALUES (?1, ?2, ?2, ?3, ?4)')
        .bind(id, current.status, session.actor, `edit: ${Object.keys(body).join(', ').slice(0, 200)}`)
    ]);
  } catch (e) {
    throw constraintError(e) || e;
  }
  return getPost(db, id);
}

/** Manual status change. approved sets approved_at; discarded requires a reason; published never goes through here. */
export async function changeStatus(db, id, body, session) {
  const current = await getPost(db, id, { full: false });
  const to = body.to;
  if (!STATUSES.includes(to)) throw new ApiError(422, 'invalid_value', `to must be one of: ${STATUSES.join(', ')}`);
  if (to === 'published') {
    throw new ApiError(422, 'invalid_transition', 'published is set by the PT blog publication (POST /publications/:id/result)');
  }
  if (!TRANSITIONS[current.status].includes(to)) {
    throw new ApiError(409, 'invalid_transition', `Cannot go from ${current.status} to ${to}`, { current_status: current.status });
  }
  const notes = typeof body.notes === 'string' ? body.notes.trim().slice(0, 1000) : null;
  const reason = typeof body.reason === 'string' ? body.reason.trim().slice(0, 500) : '';
  if (to === 'removed') return removePost(db, current, reason, session);
  if (to === 'discarded' && !reason) throw new ApiError(422, 'reason_required', 'Discarding requires a reason');
  const now = nowIso();
  const newOrder =
    to === 'approved'
      ? (await db.prepare(`SELECT IFNULL(MAX(item_order), 0) + 1 AS n FROM posts WHERE status = 'approved'`).first()).n
      : current.item_order;
  const [upd] = await db.batch([
    db
      .prepare(
        `UPDATE posts SET status = ?2,
           approved_at    = CASE WHEN ?2 = 'approved' THEN ?3 ELSE approved_at END,
           approval_notes = CASE WHEN ?2 = 'approved' THEN COALESCE(?4, approval_notes) ELSE approval_notes END,
           discard_reason = CASE WHEN ?2 = 'discarded' THEN ?5 ELSE discard_reason END,
           priority       = CASE WHEN ?2 = 'approved' AND ?7 = 1 THEN 'high' ELSE priority END,
           item_order     = ?8
         WHERE id = ?1 AND status = ?6`
      )
      .bind(id, to, now, nz(notes), nz(reason || null), current.status, body.star ? 1 : 0, nz(newOrder)),
    db
      .prepare(
        `INSERT INTO post_events (post_id, from_status, to_status, actor, notes)
         SELECT ?1, ?2, ?3, ?4, ?5 WHERE changes() > 0`
      )
      .bind(id, current.status, to, session.actor, nz(reason || notes))
  ]);
  if (!upd.meta || !upd.meta.changes) throw new ApiError(409, 'conflict', 'The post changed while it was being updated; read it again', { current_status: current.status });
  return getPost(db, id);
}

/**
 * Pulls a published post back. Only the user (queue app, internal token) can do it and it needs a reason.
 * Every channel row still published becomes removal_pending; the takedown confirms each one
 * (POST /publications/:id/result {status: removed}). Dedup keys stay, so the subject is not curated again.
 */
async function removePost(db, current, reason, session) {
  if (session.agent !== 'user') {
    throw new ApiError(403, 'removal_not_allowed', 'Only the queue app can remove a published post; report it as an issue instead');
  }
  if (!reason) throw new ApiError(422, 'reason_required', 'Removing requires a reason');
  const now = nowIso();
  const [upd] = await db.batch([
    db
      .prepare(`UPDATE posts SET status = 'removed', removed_at = ?2, removal_reason = ?3 WHERE id = ?1 AND status = 'published'`)
      .bind(current.id, now, reason),
    db
      .prepare(`UPDATE publications SET status = 'removal_pending', attempts = 0, last_error = NULL, agent = ?2
                WHERE post_id = ?1 AND status = 'published' AND (SELECT status FROM posts WHERE id = ?1) = 'removed'`)
      .bind(current.id, session.actor),
    db
      .prepare(
        `INSERT INTO post_events (post_id, from_status, to_status, actor, notes)
         SELECT ?1, 'published', 'removed', ?2, ?3 WHERE (SELECT status FROM posts WHERE id = ?1) = 'removed'`
      )
      .bind(current.id, session.actor, reason)
  ]);
  if (!upd.meta || !upd.meta.changes) throw new ApiError(409, 'conflict', 'The post changed while it was being removed; read it again', { current_status: current.status });
  return getPost(db, current.id);
}

/** Reorders the posts of one status (new or approved) in the order of the ids sent: 1..n. */
export async function reorder(db, body, session) {
  const status = body.status;
  if (!['new', 'approved'].includes(status)) throw new ApiError(422, 'invalid_value', 'status must be new or approved');
  const ids = Array.isArray(body.ids) ? body.ids.map(Number) : [];
  if (!ids.length || ids.some((n) => !Number.isInteger(n)) || new Set(ids).size !== ids.length) {
    throw new ApiError(422, 'invalid_value', 'ids must be a list of distinct ids');
  }
  const currentIds = (await db.prepare('SELECT id FROM posts WHERE status = ?1').bind(status).all()).results.map((r) => r.id);
  const missing = currentIds.filter((id) => !ids.includes(id));
  const unknown = ids.filter((id) => !currentIds.includes(id));
  if (missing.length || unknown.length) {
    throw new ApiError(409, 'stale_list', 'The list does not match the current posts of this status; read the queue again', { missing, unknown });
  }
  await db.batch([
    ...ids.map((id, i) => db.prepare('UPDATE posts SET item_order = ?1 WHERE id = ?2 AND status = ?3').bind(i + 1, id, status)),
    db
      .prepare(`INSERT INTO post_events (post_id, from_status, to_status, actor, notes) VALUES (?1, ?2, ?2, ?3, 'reorder')`)
      .bind(ids[0], status, session.actor)
  ]);
  return { status, order: ids };
}

/** Channel queue: what each job should publish now. */
export async function channelQueue(db, channel, limit = 20) {
  const lim = Math.min(Math.max(Number(limit) || 20, 1), 100);
  if (channel === 'blog') {
    const r = await db
      .prepare(
        `SELECT p.* FROM posts p
         WHERE p.status = 'approved'
           AND NOT EXISTS (SELECT 1 FROM publications b WHERE b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt')
         ORDER BY CASE p.priority WHEN 'high' THEN 0 ELSE 1 END, p.item_order, p.added_at
         LIMIT ${lim}`
      )
      .all();
    return (r.results || []).map((p) => ({ ...p, ready: p.image_source !== 'none', blocker: p.image_source === 'none' ? 'missing_cover' : null }));
  }
  if (channel === 'linkedin' || channel === 'x') {
    const r = await db
      .prepare(
        `SELECT p.*, b.url AS blog_url, b.published_at AS blog_published_at FROM posts p
         JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'published'
         WHERE NOT EXISTS (SELECT 1 FROM publications c WHERE c.post_id = p.id AND c.channel = ?1)
         ORDER BY b.published_at
         LIMIT ${lim}`
      )
      .bind(channel)
      .all();
    return r.results || [];
  }
  if (channel === 'translations') {
    const r = await db
      .prepare(
        `SELECT p.id, p.topic, p.slug, b.url AS blog_url,
                (SELECT status FROM publications t WHERE t.post_id = p.id AND t.channel = 'blog' AND t.lang = 'es') AS es,
                (SELECT status FROM publications t WHERE t.post_id = p.id AND t.channel = 'blog' AND t.lang = 'en') AS en
         FROM posts p
         JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'published'
         WHERE (SELECT COUNT(*) FROM publications t WHERE t.post_id = p.id AND t.channel = 'blog' AND t.lang IN ('es','en')) < 2
         ORDER BY b.published_at LIMIT ${lim}`
      )
      .all();
    return r.results || [];
  }
  if (channel === 'removals') {
    const r = await db
      .prepare(
        `SELECT pub.id AS publication_id, pub.post_id, pub.channel, pub.lang, pub.url, pub.external_id, pub.attempts,
                pub.last_error, p.topic, p.slug, p.removal_reason, p.removed_at
         FROM publications pub JOIN posts p ON p.id = pub.post_id
         WHERE pub.status = 'removal_pending'
         ORDER BY p.removed_at, pub.post_id, CASE pub.channel WHEN 'blog' THEN 0 WHEN 'linkedin' THEN 1 ELSE 2 END, pub.lang
         LIMIT ${lim}`
      )
      .all();
    return r.results || [];
  }
  throw new ApiError(404, 'not_found', 'Unknown channel (blog, linkedin, x, translations, removals)');
}
