import { ApiError } from './http.js';

/**
 * Publishing plan (flow control), edited in DSB Admin's Flow tab.
 *
 * The plan says, per round, how many posts of each type may go out (caps), how many approved posts of a type to
 * keep waiting (reserve), the round's total, a time-boxed burst mode, and when an unpublished approved post is
 * "going stale" (business days since it was curated). The publish rounds ask GET /plan/round?round=… and publish
 * exactly the items it returns; the skills carry no fixed numbers.
 */

export const TYPES = ['incident', 'vulnerability', 'news'];
export const BLOG_ROUNDS = ['blog_morning', 'blog_midday', 'blog_afternoon'];
/** When the midday round runs: only while burst is on (default), every day, or never. */
export const MIDDAY_RUNS = ['burst', 'always', 'off'];
const DEFAULT_MIDDAY = { caps: { incident: 1, vulnerability: 1, news: 0 }, reserve: { incident: 0, vulnerability: 0, news: 0 }, total: 2, runs: 'burst' };
export const LINKEDIN_ROUNDS = ['linkedin_morning', 'linkedin_afternoon'];
const ROUNDS = [...BLOG_ROUNDS, ...LINKEDIN_ROUNDS];
const BRT_OFFSET_MS = -3 * 3600 * 1000;
const MAX_BURST_DAYS = 14;

const intIn = (v, lo, hi) => Number.isInteger(v) && v >= lo && v <= hi;

/** Validates a plan and returns a clean copy (only known keys). Throws 422 invalid_plan with the first problem. */
export function validatePlan(p, now = Date.now()) {
  const bad = (msg) => {
    throw new ApiError(422, 'invalid_plan', msg);
  };
  if (!p || typeof p !== 'object') bad('plan must be an object');
  const out = { rounds: {}, burst: {}, stale_business_days: {} };
  for (const r of ROUNDS) {
    const src = (p.rounds || {})[r] || (r === 'blog_midday' ? DEFAULT_MIDDAY : null);
    if (!src) bad(`rounds.${r} is missing`);
    if (!intIn(src.total, 0, 10)) bad(`rounds.${r}.total must be a whole number from 0 to 10`);
    const round = { total: src.total };
    if (BLOG_ROUNDS.includes(r)) {
      round.caps = {};
      round.reserve = {};
      for (const t of TYPES) {
        const c = (src.caps || {})[t];
        const k = (src.reserve || {})[t] ?? 0;
        if (!intIn(c, 0, 10)) bad(`rounds.${r}.caps.${t} must be a whole number from 0 to 10`);
        if (!intIn(k, 0, 10)) bad(`rounds.${r}.reserve.${t} must be a whole number from 0 to 10`);
        round.caps[t] = c;
        round.reserve[t] = k;
      }
    }
    if (r === 'blog_midday') {
      const runs = src.runs ?? 'burst';
      if (!MIDDAY_RUNS.includes(runs)) bad(`rounds.blog_midday.runs must be one of ${MIDDAY_RUNS.join(', ')}`);
      round.runs = runs;
    }
    out.rounds[r] = round;
  }
  const b = p.burst || {};
  const types = Array.isArray(b.types) ? [...new Set(b.types)] : [];
  if (types.some((t) => !TYPES.includes(t))) bad(`burst.types must be among ${TYPES.join(', ')}`);
  const factor = b.factor ?? 2;
  if (!intIn(factor, 1, 3)) bad('burst.factor must be 1, 2 or 3');
  let until = null;
  if (b.on) {
    if (!types.length) bad('burst needs at least one type');
    until = burstDay(b.until);
    if (!until) bad('burst.until must be a date (YYYY-MM-DD)');
    const today = brtDateString(now);
    if (until < today) bad('burst.until must be today or later');
    if (Date.parse(`${until}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`) > MAX_BURST_DAYS * 86400000) bad(`burst.until must be within ${MAX_BURST_DAYS} days`);
  }
  out.burst = { on: Boolean(b.on), until, types: types.length ? types : ['incident'], factor, freshest_first: b.freshest_first !== false };
  for (const t of TYPES) {
    const d = (p.stale_business_days || {})[t];
    if (!intIn(d, 1, 30)) bad(`stale_business_days.${t} must be a whole number from 1 to 30`);
    out.stale_business_days[t] = d;
  }
  return out;
}

/** Burst end as a Brasília calendar date: 'YYYY-MM-DD' as given, or an older ISO date-time read as its BRT date. */
export function burstDay(v) {
  const s = String(v || '').trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return Number.isFinite(Date.parse(`${s}T00:00:00Z`)) ? s : null;
  const t = Date.parse(s);
  return Number.isFinite(t) ? brtDateString(t) : null;
}

/** 'YYYY-MM-DD' of `ms` in Brasília time. */
export function brtDateString(ms) {
  return new Date(ms + BRT_OFFSET_MS).toISOString().slice(0, 10);
}

/** Older stored plans: add the midday round (default, runs only during burst) and read the burst end as a date. */
function normalize(plan) {
  const p = { ...plan, rounds: { ...plan.rounds } };
  if (!p.rounds.blog_midday) p.rounds.blog_midday = structuredClone(DEFAULT_MIDDAY);
  if (p.burst) p.burst = { ...p.burst, until: p.burst.until ? burstDay(p.burst.until) : null };
  return p;
}

export async function readPlan(db) {
  const r = await db.prepare('SELECT plan, updated_by, updated_at FROM publish_plan WHERE id = 1').first();
  if (!r) throw new ApiError(503, 'no_plan', 'The publishing plan is missing (migration 0007)');
  return { plan: normalize(JSON.parse(r.plan)), updated_by: r.updated_by, updated_at: r.updated_at };
}

export async function getPlan(db, now = Date.now()) {
  const cur = await readPlan(db);
  const log = await db.prepare('SELECT id, changed_by, note, changed_at FROM publish_plan_log ORDER BY id DESC LIMIT 10').all();
  return { ...cur, effective: effective(cur.plan, now), log: log.results || [] };
}

/** PATCH /plan {plan, note}: only DSB Admin (the internal token) can change the plan. */
export async function savePlan(db, body, session, now = Date.now()) {
  if (session.via !== 'internal') throw new ApiError(403, 'plan_admin_only', 'Only DSB Admin can change the publishing plan');
  const plan = validatePlan(body && body.plan, now);
  const text = JSON.stringify(plan);
  const note = body && body.note ? String(body.note).slice(0, 200) : null;
  await db.batch([
    db.prepare("UPDATE publish_plan SET plan = ?1, updated_by = ?2, updated_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = 1").bind(text, session.actor),
    db.prepare('INSERT INTO publish_plan_log (plan, changed_by, note) VALUES (?1, ?2, ?3)').bind(text, session.actor, note)
  ]);
  return getPlan(db, now);
}

/** Caps and reserves in force at `now`: burst (while on, through the end of its `until` day in Brasília) multiplies
 *  the caps of its types and drops their reserve to 0. */
export function effective(plan, now = Date.now()) {
  const b = plan.burst || {};
  const day = b.until ? burstDay(b.until) : null;
  const active = Boolean(b.on && day && brtDateString(now) <= day);
  const rounds = {};
  for (const [name, r] of Object.entries(plan.rounds)) {
    const e = { total: r.total };
    if (r.runs) e.runs = r.runs;
    if (r.caps) {
      e.caps = { ...r.caps };
      e.reserve = { ...r.reserve };
      if (active) {
        for (const t of b.types) {
          e.caps[t] = Math.min(r.caps[t] * b.factor, 10);
          e.reserve[t] = 0;
        }
        const extra = b.types.reduce((s, t) => s + (e.caps[t] - r.caps[t]), 0);
        e.total = Math.min(r.total + extra, 10);
      }
    }
    rounds[name] = e;
  }
  return { burst_active: active, burst_until: active ? day : null, burst_types: active ? b.types : [], freshest_first: active && b.freshest_first, rounds };
}

/** Calendar date in Brasília time (YYYY-MM-DD as a UTC midnight timestamp). */
function brtDay(ms) {
  const d = new Date(ms + BRT_OFFSET_MS);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

/** Business days (Mon–Fri) after the day of `fromIso` up to and including today, in Brasília time. */
export function businessDaysSince(fromIso, now = Date.now()) {
  const start = Date.parse(fromIso);
  if (!Number.isFinite(start)) return 0;
  let n = 0;
  for (let d = brtDay(start) + 86400000; d <= brtDay(now); d += 86400000) {
    const wd = new Date(d).getUTCDay();
    if (wd !== 0 && wd !== 6) n++;
  }
  return n;
}

async function approvedWaiting(db) {
  const r = await db
    .prepare(
      `SELECT p.id, p.topic, p.type, p.country, p.priority, p.item_order, p.added_at, p.approved_at, p.image_source
       FROM posts p
       WHERE p.status = 'approved'
         AND NOT EXISTS (SELECT 1 FROM publications b WHERE b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt')
       ORDER BY CASE p.priority WHEN 'high' THEN 0 ELSE 1 END, p.item_order, p.added_at`
    )
    .all();
  return r.results || [];
}

const brief = (p, extra = {}) => ({ id: p.id, type: p.type, topic: p.topic, country: p.country, priority: p.priority, added_at: p.added_at, ...extra });

/** Approved posts with no blog article yet, older than the plan's business-day limit (high priority excepted). */
export async function staleList(db, plan, now = Date.now()) {
  const out = [];
  for (const p of await approvedWaiting(db)) {
    const age = businessDaysSince(p.added_at, now);
    if (p.priority !== 'high' && age >= plan.stale_business_days[p.type]) out.push(brief(p, { business_days: age }));
  }
  return out;
}

/**
 * GET /plan/round?round=blog_morning|blog_midday|blog_afternoon|linkedin_morning|linkedin_afternoon
 * → {round, effective, items: [...to publish, in order], held: [{…, reason}], stale: [...]}
 * Blog: high priority first (outside the type caps and the stale rule), then per type the first posts in queue
 * order (freshest event first for burst types when the plan says so), up to the cap and only while more than the
 * reserve stay waiting; a post without a cover is held and the next of its type is taken; the round total cuts last.
 * LinkedIn: the blog-published posts with no LinkedIn row, oldest article first, up to the round total.
 */
export async function planRound(db, round, now = Date.now()) {
  if (!ROUNDS.includes(round)) throw new ApiError(422, 'invalid_round', `round must be one of ${ROUNDS.join(', ')}`);
  const { plan } = await readPlan(db);
  if (LINKEDIN_ROUNDS.includes(round)) return pickRound(plan, round, { linkedin: await blogPublishedNoLinkedin(db) }, now);
  return pickRound(plan, round, { waiting: await approvedWaiting(db) }, now);
}

async function blogPublishedNoLinkedin(db) {
  const r = await db
    .prepare(
      `SELECT p.id, p.topic, p.type, p.country, p.priority, p.added_at, b.url AS blog_url, b.published_at AS blog_published_at
       FROM posts p
       JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt' AND b.status = 'published'
       WHERE NOT EXISTS (SELECT 1 FROM publications c WHERE c.post_id = p.id AND c.channel = 'linkedin')
       ORDER BY b.published_at`
    )
    .all();
  return r.results || [];
}

/** One round against the given lists (no database access), as GET /plan/round answers it. */
function pickRound(plan, round, { waiting = [], linkedin = [] }, now) {
  const eff = effective(plan, now);
  const rule = eff.rounds[round];
  const base = { round, effective: { burst_active: eff.burst_active, burst_until: eff.burst_until, ...rule } };

  if (LINKEDIN_ROUNDS.includes(round)) {
    return {
      ...base,
      items: linkedin.slice(0, rule.total).map((p) => brief(p, { blog_url: p.blog_url || null, ...(p.why ? { why: p.why } : {}) })),
      held: linkedin.slice(rule.total).map((p) => brief(p, { reason: 'total' })),
      stale: []
    };
  }

  if (round === 'blog_midday') {
    const runs = rule.runs || 'burst';
    if (runs === 'off' || (runs === 'burst' && !eff.burst_active)) {
      return { ...base, items: [], held: [], stale: [], inactive: runs === 'off' ? 'The midday round is off in the plan' : 'The midday round runs only during burst mode' };
    }
  }
  const items = [];
  const held = [];
  const stale = [];
  const byType = Object.fromEntries(TYPES.map((t) => [t, []]));
  for (const p of waiting) {
    const age = businessDaysSince(p.added_at, now);
    if (p.priority === 'high') {
      if (p.image_source === 'none') held.push(brief(p, { reason: 'no_cover' }));
      else items.push(brief(p, { why: 'high priority' }));
    } else if (age >= plan.stale_business_days[p.type]) {
      stale.push(brief(p, { business_days: age }));
    } else if (byType[p.type]) byType[p.type].push(p);
  }
  for (const t of TYPES) {
    let list = byType[t];
    if (eff.freshest_first && eff.burst_types.includes(t)) list = [...list].sort((a, b) => String(b.added_at).localeCompare(String(a.added_at)));
    const room = Math.max(0, Math.min(rule.caps[t], list.length - rule.reserve[t]));
    let taken = 0;
    for (const p of list) {
      if (taken >= room) held.push(brief(p, { reason: list.length - taken <= rule.reserve[t] ? 'reserve' : 'cap' }));
      else if (p.image_source === 'none') held.push(brief(p, { reason: 'no_cover' }));
      else {
        items.push(brief(p, { why: `${t} ${taken + 1}/${rule.caps[t]}` }));
        taken++;
      }
    }
  }
  // Final order: high priority, then burst types (in their pick order), then the rest in queue order; the round
  // total cuts last.
  const pos = new Map(waiting.map((p, i) => [p.id, i]));
  const high = items.filter((p) => p.priority === 'high');
  const burst = items.filter((p) => p.priority !== 'high' && eff.burst_types.includes(p.type));
  const rest = items.filter((p) => p.priority !== 'high' && !eff.burst_types.includes(p.type)).sort((a, b) => pos.get(a.id) - pos.get(b.id));
  const all = [...high, ...burst, ...rest];
  const out = all.slice(0, rule.total);
  for (const p of all.slice(rule.total)) held.push({ ...p, why: undefined, reason: 'total' });
  return { ...base, items: out, held, stale };
}

/** Scheduled time of each round, Brasília (the scheduled tasks). */
export const ROUND_TIMES = { blog_morning: '08:30', linkedin_morning: '09:00', blog_midday: '12:30', blog_afternoon: '17:00', linkedin_afternoon: '17:30' };

/** The next run of every round after `now`, in time order (one each). */
export function nextRuns(now = Date.now()) {
  const out = [];
  for (const [round, hm] of Object.entries(ROUND_TIMES)) {
    const [h, m] = hm.split(':').map(Number);
    let at = brtDay(now) + (h * 60 + m) * 60000 - BRT_OFFSET_MS;
    if (at <= now) at += 86400000;
    out.push({ round, at });
  }
  return out.sort((a, b) => a.at - b.at);
}

/**
 * GET /plan/upcoming → {rounds: [{round, at, items, held, stale, …}]}: the next run of every round, worked out in
 * time order. A post an earlier round takes is not offered again; a blog pick becomes a LinkedIn candidate for the
 * LinkedIn rounds after it (newest article last). Burst and stale ages are taken at each round's own time.
 */
export async function planUpcoming(db, now = Date.now()) {
  const { plan } = await readPlan(db);
  let waiting = await approvedWaiting(db);
  let linkedin = await blogPublishedNoLinkedin(db);
  const rounds = [];
  for (const { round, at } of nextRuns(now)) {
    const r = pickRound(plan, round, { waiting, linkedin }, at);
    const taken = new Set(r.items.map((p) => p.id));
    if (LINKEDIN_ROUNDS.includes(round)) linkedin = linkedin.filter((p) => !taken.has(p.id));
    else {
      linkedin = [...linkedin, ...waiting.filter((p) => taken.has(p.id)).map((p) => ({ ...p, blog_url: null, why: `after ${round}` }))];
      waiting = waiting.filter((p) => !taken.has(p.id));
    }
    rounds.push({ ...r, at: new Date(at).toISOString() });
  }
  return { rounds, generated_at: new Date(now).toISOString() };
}

export async function publishNow(db, body, session) {
  if (session.via !== 'internal') throw new ApiError(403, 'plan_admin_only', 'Only DSB Admin can mark a post to publish now');
  const id = Number(body && body.post_id);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(422, 'invalid_post_id', 'post_id is required');
  const p = await db.prepare('SELECT id, status FROM posts WHERE id = ?1').bind(id).first();
  if (!p) throw new ApiError(404, 'not_found', `Post ${id} not found`);
  if (p.status !== 'approved') throw new ApiError(409, 'not_approved', `Post ${id} is ${p.status}, not approved`);
  await db.prepare("UPDATE posts SET priority = 'high' WHERE id = ?1").bind(id).run();
  return { post_id: id, priority: 'high' };
}
