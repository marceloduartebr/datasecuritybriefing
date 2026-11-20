import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handle } from '../src/index.js';
import { createD1 } from './d1-sqlite.mjs';
import { businessDaysSince, validatePlan, effective } from '../src/plan.js';

const TOKENS = { INTERNAL_TOKEN: 'internal-000000000000000000000000', TOKEN_GROK: 'grok-00000000000000000000000000000', TOKEN_CLAUDE: 'claude-0000000000000000000000000000' };
const COVER = 'https://covers.duarte.top/covers/20261120-test.jpg';
// Friday 20 Nov 2026, 08:00 BRT
const NOW = '2026-11-20T11:00:00Z';

function setup() {
  const env = { DB: createD1(), ...TOKENS };
  const call = async (method, path, body, { internal = false } = {}) => {
    const headers = { 'content-type': 'application/json' };
    if (internal) Object.assign(headers, { 'x-internal-token': TOKENS.INTERNAL_TOKEN, 'x-actor': 'marcelo@app' });
    else headers.Authorization = `Bearer ${TOKENS.TOKEN_CLAUDE}`;
    const res = await handle(new Request(`https://dsb-api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined }), env);
    return { status: res.status, body: await res.json() };
  };
  let n = 0;
  const post = async (type, addedAt, { cover = true, approve = true } = {}) => {
    n++;
    const r = await call('POST', '/posts', {
      topic: `${type} ${n}`, type, country: 'BR', source_name: 'S', source_url: `https://e.com/${type}/${n}`, slug: `s-${n}`,
      briefing_md: '# b', post_text: 't', ...(cover ? { image_source: 'generated', image_url: COVER } : {})
    });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    const id = r.body.post.id;
    await env.DB.prepare('UPDATE posts SET added_at = ?1 WHERE id = ?2').bind(addedAt, id).run();
    if (approve) await call('POST', `/posts/${id}/status`, { to: 'approved' }, { internal: true });
    return id;
  };
  return { env, call, post };
}
const ids = (items) => items.map((p) => p.id);

test('business days: weekends skipped, counted in Brasília time', () => {
  assert.equal(businessDaysSince('2026-11-19T12:00:00Z', Date.parse(NOW)), 1); // Thu → Fri
  assert.equal(businessDaysSince('2026-11-16T12:00:00Z', Date.parse(NOW)), 4); // Mon → Fri
  assert.equal(businessDaysSince('2026-11-13T12:00:00Z', Date.parse('2026-11-16T12:00:00Z')), 1); // Fri → Mon
  assert.equal(businessDaysSince('2026-11-20T02:30:00Z', Date.parse(NOW)), 1, '23:30 BRT on Thursday is Thursday');
});

test('plan: starting plan from the migration; only DSB Admin changes it; every change is logged', async () => {
  const { call } = setup();
  const g = await call('GET', '/plan');
  assert.equal(g.body.plan.rounds.blog_morning.caps.incident, 2);
  assert.equal(g.body.plan.rounds.blog_afternoon.reserve.incident, 2);
  assert.equal(g.body.plan.stale_business_days.news, 7);
  assert.equal(g.body.log.length, 1);
  const plan = structuredClone(g.body.plan);
  plan.rounds.blog_morning.caps.incident = 3;
  assert.equal((await call('PATCH', '/plan', { plan })).body.error, 'plan_admin_only', 'agents cannot change the plan');
  const ok = await call('PATCH', '/plan', { plan, note: 'more incidents' }, { internal: true });
  assert.equal(ok.status, 200, JSON.stringify(ok.body));
  assert.equal(ok.body.plan.rounds.blog_morning.caps.incident, 3);
  assert.equal(ok.body.updated_by, 'marcelo@app');
  assert.equal(ok.body.log[0].note, 'more incidents');
  plan.rounds.blog_morning.caps.incident = 11;
  assert.equal((await call('PATCH', '/plan', { plan }, { internal: true })).body.error, 'invalid_plan');
  plan.rounds.blog_morning.caps.incident = 2;
  plan.burst = { on: true, until: '2020-01-01T00:00:00Z', types: ['incident'], factor: 2 };
  assert.match((await call('PATCH', '/plan', { plan }, { internal: true })).body.message, /future/);
});

test('blog morning: caps per type in queue order; a post without a cover is held and the next one taken', async () => {
  const { call, post } = setup();
  const i1 = await post('incident', '2026-11-19T10:00:00Z');
  const i2 = await post('incident', '2026-11-19T11:00:00Z', { cover: false });
  const i3 = await post('incident', '2026-11-19T12:00:00Z');
  const i4 = await post('incident', '2026-11-19T13:00:00Z');
  const v1 = await post('vulnerability', '2026-11-19T10:00:00Z');
  const n1 = await post('news', '2026-11-19T10:00:00Z');
  const r = (await call('GET', `/plan/round?round=blog_morning&at=${NOW}`)).body;
  assert.deepEqual(ids(r.items), [i1, i3, v1, n1]);
  assert.deepEqual(r.held.map((h) => [h.id, h.reason]), [[i2, 'no_cover'], [i4, 'cap']]);
  assert.equal(r.effective.total, 4);
});

test('blog afternoon: only past the reserve; stale posts leave the flow; high priority goes first', async () => {
  const { call, post } = setup();
  const old = await post('incident', '2026-11-16T10:00:00Z'); // 4 business days → stale
  const a = await post('incident', '2026-11-19T10:00:00Z');
  const b = await post('incident', '2026-11-19T11:00:00Z');
  const c = await post('incident', '2026-11-19T12:00:00Z');
  const v = await post('vulnerability', '2026-11-19T10:00:00Z'); // 1 waiting, reserve 2 → held
  let r = (await call('GET', `/plan/round?round=blog_afternoon&at=${NOW}`)).body;
  assert.deepEqual(ids(r.items), [a], 'incidents: 3 waiting, reserve 2 → 1');
  assert.deepEqual(ids(r.stale), [old]);
  assert.deepEqual(r.held.find((h) => h.id === v).reason, 'reserve');
  assert.deepEqual((await call('GET', '/plan/stale')).body.items.map((p) => p.id).includes(old), true);
  // Publish now: the stale post comes back first, outside the caps
  assert.equal((await call('POST', '/plan/publish-now', { post_id: old })).body.error, 'plan_admin_only');
  assert.equal((await call('POST', '/plan/publish-now', { post_id: old }, { internal: true })).body.priority, 'high');
  r = (await call('GET', `/plan/round?round=blog_afternoon&at=${NOW}`)).body;
  assert.deepEqual(ids(r.items), [old, a]);
  assert.deepEqual(r.stale, []);
  void b; void c;
});

test('burst: caps x factor, reserve 0, freshest first for burst types; it ends by itself', async () => {
  const { call, post } = setup();
  const list = [];
  for (let h = 10; h < 16; h++) list.push(await post('incident', `2026-11-19T${h}:00:00Z`));
  const n1 = await post('news', '2026-11-19T10:00:00Z');
  const plan = (await call('GET', '/plan')).body.plan;
  plan.burst = { on: true, until: '2026-11-22T23:59:00-03:00', types: ['incident'], factor: 2, freshest_first: true };
  const saved = await call('PATCH', '/plan', { plan }, { internal: true });
  assert.equal(saved.status, 200, JSON.stringify(saved.body));
  let r = (await call('GET', `/plan/round?round=blog_morning&at=${NOW}`)).body;
  assert.equal(r.effective.burst_active, true);
  assert.equal(r.effective.caps.incident, 4);
  assert.deepEqual(ids(r.items), [list[5], list[4], list[3], list[2], n1], 'four freshest incidents, then news');
  r = (await call('GET', `/plan/round?round=blog_afternoon&at=${NOW}`)).body;
  assert.equal(r.effective.reserve.incident, 0);
  assert.equal(r.items.filter((p) => p.type === 'incident').length, 2);
  // after the end date the normal plan applies again
  r = (await call('GET', '/plan/round?round=blog_morning&at=2026-11-23T11:00:00Z')).body;
  assert.equal(r.effective.burst_active, false);
  assert.equal(r.effective.caps.incident, 2);
});

test('linkedin: blog-published posts without a LinkedIn row, oldest article first, up to the round total', async () => {
  const { call, post } = setup();
  const done = [];
  for (let i = 0; i < 4; i++) {
    const id = await post('incident', '2026-11-19T10:00:00Z');
    const c = await call('POST', '/publications', { post_id: id, channel: 'blog', lang: 'pt' });
    await call('POST', `/publications/${c.body.publication.id}/result`, { status: 'published', url: `https://dsb.duarte.top/briefings/x-${i}`, published_at: `2026-11-20T0${i}:00:00Z` });
    done.push(id);
  }
  const r = (await call('GET', '/plan/round?round=linkedin_morning')).body;
  assert.deepEqual(ids(r.items), done.slice(0, 3));
  assert.deepEqual(r.held.map((h) => [h.id, h.reason]), [[done[3], 'total']]);
  assert.equal((await call('GET', '/plan/round?round=nope')).body.error, 'invalid_round');
});

test('effective(): burst totals grow with the extra cap and stay within 10', () => {
  const p = validatePlan({
    rounds: { blog_morning: { caps: { incident: 4, vulnerability: 3, news: 1 }, total: 8, reserve: {} }, blog_afternoon: { caps: { incident: 1, vulnerability: 1, news: 1 }, total: 3, reserve: {} }, linkedin_morning: { total: 3 }, linkedin_afternoon: { total: 3 } },
    burst: { on: true, until: '2026-11-21T00:00:00Z', types: ['incident', 'vulnerability'], factor: 3 },
    stale_business_days: { incident: 3, vulnerability: 3, news: 7 }
  }, Date.parse(NOW));
  const e = effective(p, Date.parse(NOW));
  assert.equal(e.rounds.blog_morning.caps.incident, 10);
  assert.equal(e.rounds.blog_morning.total, 10);
});
