import { ApiError } from './http.js';

export const STATUSES = ['new', 'approved', 'published', 'discarded', 'removed'];
export const TYPES = ['incident', 'news', 'vulnerability'];
export const COUNTRIES = ['BR', 'MX', 'AR', 'CL', 'PE', 'PY', 'UY', 'CO', 'US', 'EU', 'LATAM', 'Global'];
export const PRIORITIES = ['normal', 'high'];
export const IMAGE_SOURCES = ['og', 'generated', 'none'];
export const CHANNELS = ['blog', 'linkedin', 'x'];
export const LANGS = ['pt', 'es', 'en'];
export const ADDED_BY = ['user', 'research', 'grok', 'claude'];
export const COVERS_PREFIX = 'https://covers.duarte.top/covers/';

/**
 * Manual status transitions. "published" is only set by the PT blog publication (see publications.js).
 * "removed" pulls a published post back: only the user (internal token, i.e. the queue app) can set it, it requires
 * a reason, and every published channel row becomes removal_pending until the takedown is confirmed. Terminal.
 */
export const TRANSITIONS = {
  new: ['approved', 'discarded'],
  approved: ['new', 'discarded'],
  discarded: ['new'],
  published: ['removed'],
  removed: []
};

const TRACKING_PARAMS = /^(utm_.*|fbclid|gclid|mc_cid|mc_eid|ref|ref_src|igshid|si|s)$/i;

/** Canonical URL: http(s), lowercase host, no fragment, no tracking params, sorted params, no trailing slash. */
export function normalizeUrl(raw, field = 'source_url') {
  if (typeof raw !== 'string' || !raw.trim()) throw new ApiError(422, 'invalid_url', `${field} is required`);
  let u;
  try {
    u = new URL(raw.trim());
  } catch {
    throw new ApiError(422, 'invalid_url', `${field} is not a valid URL`);
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') throw new ApiError(422, 'invalid_url', `${field} must be http(s)`);
  u.hash = '';
  u.hostname = u.hostname.toLowerCase();
  const keep = [...u.searchParams.entries()].filter(([k]) => !TRACKING_PARAMS.test(k)).sort(([a], [b]) => a.localeCompare(b));
  u.search = '';
  for (const [k, v] of keep) u.searchParams.append(k, v);
  if (u.pathname.length > 1) u.pathname = u.pathname.replace(/\/+$/, '') || '/';
  return u.toString();
}

export function extractCves(...texts) {
  const out = new Set();
  for (const t of texts) {
    if (typeof t !== 'string') continue;
    for (const m of t.matchAll(/CVE-\d{4}-\d{4,7}/gi)) out.add(m[0].toUpperCase());
  }
  return [...out];
}

export function validateCves(list) {
  if (list == null) return [];
  if (!Array.isArray(list)) throw new ApiError(422, 'invalid_cves', 'cves must be a list');
  const out = new Set();
  for (const c of list) {
    const v = String(c || '').trim().toUpperCase();
    if (!/^CVE-\d{4}-\d{4,7}$/.test(v)) throw new ApiError(422, 'invalid_cves', `Invalid CVE: ${String(c).slice(0, 40)}`);
    out.add(v);
  }
  return [...out];
}

export async function isGenericUrl(db, url) {
  const r = await db
    .prepare(
      `SELECT 1 AS g FROM ignored_url_patterns
       WHERE substr(?1, 1, length(prefix)) = prefix AND (contains IS NULL OR instr(?1, contains) > 0) LIMIT 1`
    )
    .bind(url)
    .first();
  return !!r;
}

/** Subject keys of a post: each CVE plus the normalized URL (unless it is generic). */
export async function postKeys(db, { sourceUrl, cves }) {
  const keys = cves.map((c) => ({ key: `cve:${c}`, kind: 'cve' }));
  const generic = await isGenericUrl(db, sourceUrl);
  if (!generic) keys.push({ key: `url:${sourceUrl}`, kind: 'url' });
  return { keys, generic };
}

const text = (v, max, field, required = false) => {
  if (v == null || v === '') {
    if (required) throw new ApiError(422, 'field_required', `${field} is required`);
    return null;
  }
  if (typeof v !== 'string') throw new ApiError(422, 'invalid_value', `${field} must be text`);
  const t = v.trim();
  if (required && !t) throw new ApiError(422, 'field_required', `${field} is required`);
  if (t.length > max) throw new ApiError(422, 'invalid_value', `${field} is longer than ${max} characters`);
  return t || null;
};

const oneOf = (v, list, field, required = false, fallback = null) => {
  if (v == null || v === '') {
    if (required && fallback == null) throw new ApiError(422, 'field_required', `${field} is required`);
    return fallback;
  }
  if (!list.includes(v)) throw new ApiError(422, 'invalid_value', `${field} must be one of: ${list.join(', ')}`);
  return v;
};

export function validateSlug(v) {
  const s = text(v, 120, 'slug');
  if (s && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s)) throw new ApiError(422, 'invalid_slug', 'slug must be kebab-case ASCII');
  return s;
}

export function validateCover(imageSource, imageUrl) {
  const src = oneOf(imageSource, IMAGE_SOURCES, 'image_source', false, 'none');
  const url = text(imageUrl, 400, 'image_url');
  if (src === 'none' && url) throw new ApiError(422, 'cover_inconsistent', 'image_source=none does not accept image_url');
  if (src !== 'none' && !url) throw new ApiError(422, 'cover_inconsistent', `image_source=${src} requires image_url`);
  if (url && !url.startsWith(COVERS_PREFIX)) throw new ApiError(422, 'cover_host_invalid', `image_url must start with ${COVERS_PREFIX}`);
  return { image_source: src, image_url: url };
}

const isoOrNull = (v, field) => {
  if (v == null || v === '') return null;
  if (typeof v !== 'string' || Number.isNaN(Date.parse(v))) throw new ApiError(422, 'invalid_date', `${field} must be an ISO date`);
  return v;
};

/** Validates a create body. added_by comes from the token (agents) or the body (apps/user). */
export function validateNewPost(b, session) {
  const addedBy = session.agent === 'user' ? oneOf(b.added_by, ADDED_BY, 'added_by', false, 'user') : session.agent;
  return {
    topic: text(b.topic, 300, 'topic', true),
    type: oneOf(b.type, TYPES, 'type', true),
    country: oneOf(b.country, COUNTRIES, 'country'),
    priority: oneOf(b.priority, PRIORITIES, 'priority', false, 'normal'),
    source_name: text(b.source_name, 200, 'source_name'),
    source_url: normalizeUrl(b.source_url),
    slug: validateSlug(b.slug),
    briefing_md: text(b.briefing_md, 60000, 'briefing_md'),
    post_text: text(b.post_text, 3000, 'post_text'),
    ...validateCover(b.image_source, b.image_url),
    added_by: addedBy,
    added_at: isoOrNull(b.added_at, 'added_at') || new Date().toISOString(),
    follow_up_of: b.follow_up_of == null ? null : Number(b.follow_up_of),
    notion_id: text(b.notion_id, 40, 'notion_id'),
    cves: validateCves(b.cves)
  };
}

/** Fields editable after creation (status and source_url are excluded). */
export const EDITABLE = {
  topic: (v) => text(v, 300, 'topic', true),
  country: (v) => oneOf(v, COUNTRIES, 'country'),
  type: (v) => oneOf(v, TYPES, 'type', true),
  priority: (v) => oneOf(v, PRIORITIES, 'priority', true),
  item_order: (v) => {
    if (v == null) return null;
    const n = Number(v);
    if (!Number.isFinite(n)) throw new ApiError(422, 'invalid_value', 'item_order must be a number');
    return n;
  },
  source_name: (v) => text(v, 200, 'source_name'),
  slug: validateSlug,
  briefing_md: (v) => text(v, 60000, 'briefing_md'),
  post_text: (v) => text(v, 3000, 'post_text')
};
