import { ApiError, nowIso, nz, constraintError } from './http.js';
import { CHANNELS, LANGS } from './rules.js';
import { getPost } from './posts.js';

async function blogPt(db, postId) {
  return db
    .prepare(`SELECT * FROM publications WHERE post_id = ?1 AND channel = 'blog' AND lang = 'pt'`)
    .bind(postId)
    .first();
}

/**
 * Claims a publication before posting to the channel (status pending).
 * UNIQUE (post, channel, lang) guarantees two agents never publish the same post.
 * Preconditions:
 *  - blog/pt: post approved, with cover, briefing and slug;
 *  - blog/es|en, linkedin, x: PT blog article already published.
 * A failed row can be claimed again.
 */
export async function claim(db, body, session) {
  const postId = Number(body.post_id);
  if (!Number.isInteger(postId)) throw new ApiError(422, 'field_required', 'post_id is required');
  const channel = body.channel;
  const lang = body.lang || 'pt';
  if (!CHANNELS.includes(channel)) throw new ApiError(422, 'invalid_value', `channel must be one of: ${CHANNELS.join(', ')}`);
  if (!LANGS.includes(lang)) throw new ApiError(422, 'invalid_value', `lang must be one of: ${LANGS.join(', ')}`);
  if (channel !== 'blog' && lang !== 'pt') throw new ApiError(422, 'invalid_value', 'LinkedIn and X only have lang pt');

  const post = await getPost(db, postId, { full: false });
  if (channel === 'blog' && lang === 'pt') {
    if (post.status !== 'approved') throw new ApiError(409, 'not_approved', `Post is ${post.status}; the blog only publishes approved posts`, { current_status: post.status });
    if (post.image_source === 'none' || !post.image_url) throw new ApiError(409, 'missing_cover', 'Post has no cover on covers.duarte.top');
    if (!post.briefing_md) throw new ApiError(409, 'missing_briefing', 'Post has no briefing_md');
    if (!post.slug) throw new ApiError(409, 'missing_slug', 'Post has no slug');
  } else {
    const pt = await blogPt(db, postId);
    if (!pt || pt.status !== 'published') throw new ApiError(409, 'blog_not_published', 'The PT blog article is not published yet for this post');
  }

  const existing = await db
    .prepare('SELECT * FROM publications WHERE post_id = ?1 AND channel = ?2 AND lang = ?3')
    .bind(postId, channel, lang)
    .first();
  if (existing) {
    if (existing.status !== 'failed') {
      throw new ApiError(409, 'publication_already_claimed', `Publication ${channel}/${lang} is already ${existing.status}`, {
        key: `pub:${postId}:${channel}:${lang}`,
        publication: existing
      });
    }
    const r = await db
      .prepare(`UPDATE publications SET status = 'pending', agent = ?2 WHERE id = ?1 AND status = 'failed' RETURNING *`)
      .bind(existing.id, session.actor)
      .first();
    if (!r) throw new ApiError(409, 'publication_already_claimed', 'Another job just claimed this publication');
    return { ...r, retry: true };
  }
  try {
    return await db
      .prepare(`INSERT INTO publications (post_id, channel, lang, status, agent) VALUES (?1, ?2, ?3, 'pending', ?4) RETURNING *`)
      .bind(postId, channel, lang, session.actor)
      .first();
  } catch (e) {
    throw constraintError(e) || e;
  }
}

/**
 * Completes a claimed publication: published (with URL), failed (with error) or skipped (with reason in error).
 * blog/pt published → the post becomes published.
 */
export async function complete(db, id, body, session) {
  const pub = await db.prepare('SELECT * FROM publications WHERE id = ?1').bind(id).first();
  if (!pub) throw new ApiError(404, 'not_found', 'Publication not found');
  if (pub.status !== 'pending') throw new ApiError(409, 'publication_not_pending', `Publication is ${pub.status}; only pending can be completed`);
  const status = body.status;
  if (!['published', 'failed', 'skipped'].includes(status)) throw new ApiError(422, 'invalid_value', 'status must be published, failed or skipped');

  const text = (v, max) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null);
  const url = text(body.url, 500);
  const error = text(body.error, 2000);
  if (status === 'published' && !url) throw new ApiError(422, 'field_required', 'published requires url');
  if (status === 'published' && url && !/^https:\/\//.test(url)) throw new ApiError(422, 'invalid_url', 'url must be https');
  if (status !== 'published' && !error) throw new ApiError(422, 'field_required', `${status} requires error (the reason)`);
  let publishedAt = null;
  if (status === 'published') {
    publishedAt = body.published_at && !Number.isNaN(Date.parse(body.published_at)) ? body.published_at : nowIso();
  }

  const stmts = [
    db
      .prepare(
        `UPDATE publications SET status = ?2, url = COALESCE(?3, url), external_id = COALESCE(?4, external_id),
           body = COALESCE(?5, body), published_at = ?6,
           attempts = attempts + CASE WHEN ?2 = 'failed' THEN 1 ELSE 0 END,
           last_error = CASE WHEN ?2 = 'published' THEN NULL ELSE ?7 END,
           agent = ?8
         WHERE id = ?1 AND status = 'pending'`
      )
      .bind(id, status, url, text(body.external_id, 200), text(body.body, 10000), nz(publishedAt), error, session.actor)
  ];
  const publishesPost = status === 'published' && pub.channel === 'blog' && pub.lang === 'pt';
  if (publishesPost) {
    stmts.push(
      db.prepare(`UPDATE posts SET status = 'published' WHERE id = ?1 AND status = 'approved'`).bind(pub.post_id),
      db
        .prepare(
          `INSERT INTO post_events (post_id, from_status, to_status, actor, notes)
           SELECT ?1, 'approved', 'published', ?2, ?3 WHERE changes() > 0`
        )
        .bind(pub.post_id, session.actor, url)
    );
  }
  let res;
  try {
    res = await db.batch(stmts);
  } catch (e) {
    throw constraintError(e) || e;
  }
  if (!res[0].meta || !res[0].meta.changes) throw new ApiError(409, 'conflict', 'The publication changed while it was being completed; read it again');
  const updated = await db.prepare('SELECT * FROM publications WHERE id = ?1').bind(id).first();
  return { publication: updated, post_published: publishesPost && !!(res[1].meta && res[1].meta.changes) };
}
