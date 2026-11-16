import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handle } from '../src/index.js';
import { createD1 } from './d1-sqlite.mjs';
import { normalizeUrl } from '../src/rules.js';

const TOKENS = {
  INTERNAL_TOKEN: 'internal-000000000000000000000000',
  TOKEN_GROK: 'grok-00000000000000000000000000000',
  TOKEN_CLAUDE: 'claude-0000000000000000000000000000'
};

function setup() {
  const env = { DB: createD1(), ...TOKENS };
  const call = async (method, path, body, { token = TOKENS.TOKEN_CLAUDE, internal = false } = {}) => {
    const headers = { 'content-type': 'application/json' };
    if (internal) {
      headers['x-internal-token'] = TOKENS.INTERNAL_TOKEN;
      headers['x-actor'] = 'marcelo@app';
    } else if (token) headers.Authorization = `Bearer ${token}`;
    const res = await handle(
      new Request(`https://dsb-api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined }),
      env
    );
    return { status: res.status, body: await res.json() };
  };
  return { env, call };
}

const COVER = 'https://covers.duarte.top/covers/20261116-test.jpg';
const base = (extra = {}) => ({
  topic: 'Test incident',
  type: 'incident',
  country: 'BR',
  source_name: 'Source',
  source_url: 'https://example.com.br/news/1',
  slug: 'test-incident',
  briefing_md: '# body',
  post_text: 'post text',
  ...extra
});

test('normalizeUrl strips tracking, fragment and trailing slash', () => {
  assert.equal(normalizeUrl('https://Example.com/a/b/?utm_source=x&b=2&a=1#top'), 'https://example.com/a/b?a=1&b=2');
  assert.equal(normalizeUrl('https://example.com/'), 'https://example.com/');
});

test('auth: health is open, other routes need a token; no secrets = 503', async () => {
  const { call, env } = setup();
  assert.equal((await call('GET', '/health', null, { token: null })).status, 200);
  assert.equal((await call('GET', '/posts', null, { token: 'wrong-wrong-wrong-wrong-wrong' })).status, 401);
  assert.equal((await call('GET', '/posts', null, { token: null })).status, 401);
  for (const k of Object.keys(TOKENS)) delete env[k];
  assert.equal((await call('GET', '/posts')).status, 503);
});

test('create: added_by comes from the token; order; URL key; UTM duplicate is 409 + issue', async () => {
  const { call } = setup();
  const r = await call('POST', '/posts', base({ added_by: 'user' }), { token: TOKENS.TOKEN_GROK });
  assert.equal(r.status, 201, JSON.stringify(r.body));
  assert.equal(r.body.post.added_by, 'grok');
  assert.equal(r.body.post.status, 'new');
  assert.equal(r.body.post.item_order, 1);
  assert.deepEqual(r.body.post.keys.map((c) => c.key), ['url:https://example.com.br/news/1']);

  const dup = await call('POST', '/posts', base({ slug: 'other', source_url: 'https://example.com.br/news/1/?utm_source=x' }));
  assert.equal(dup.status, 409);
  assert.equal(dup.body.error, 'subject_already_covered');
  assert.ok(dup.body.issue, 'a rejection must become an issue');
  const iss = await call('GET', '/issues?source=api');
  assert.equal(iss.body.items[0].kind, 'rejected_subject_already_covered');
  assert.equal(iss.body.items[0].agent, 'claude');
  assert.equal(iss.body.items[0].stage, 'curation');

  const dup2 = await call('POST', '/posts', base({ slug: 'other2', source_url: 'https://example.com.br/news/1#x' }));
  assert.equal(dup2.body.issue, dup.body.issue, 'the same rejection increments the same issue');
});

test('generic CISA source: rejected without CVE; distinct CVEs create two posts', async () => {
  const { call } = setup();
  const kev = 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog';
  const none = await call('POST', '/posts', base({ type: 'vulnerability', source_url: kev, slug: 'kev-a' }));
  assert.equal(none.status, 422);
  assert.equal(none.body.error, 'missing_key');
  const a = await call('POST', '/posts', base({ type: 'vulnerability', source_url: kev, slug: 'kev-a', cves: ['CVE-2026-11111'] }));
  const b = await call('POST', '/posts', base({ type: 'vulnerability', source_url: kev, slug: 'kev-b', cves: ['cve-2026-22222'] }));
  assert.equal(a.status, 201);
  assert.equal(b.status, 201);
  assert.deepEqual(b.body.post.keys.map((c) => c.key), ['cve:CVE-2026-22222']);
  const rep = await call('POST', '/posts', base({ type: 'vulnerability', source_url: kev, slug: 'kev-c', cves: ['CVE-2026-11111'] }));
  assert.equal(rep.status, 409);
  const alert = 'https://www.cisa.gov/news-events/alerts/2026/10/20/cisa-adds-six-known-exploited-vulnerabilities-catalog';
  const d = await call('GET', `/dedup?url=${encodeURIComponent(alert)}&cve=CVE-2026-22222`);
  assert.equal(d.body.generic_url, true);
  assert.equal(d.body.free, false);
});

test('follow-up: the same URL only enters as a continuation', async () => {
  const { call } = setup();
  const orig = await call('POST', '/posts', base({ slug: 'hospital-a' }));
  const plain = await call('POST', '/posts', base({ slug: 'hospital-b' }));
  assert.equal(plain.status, 409);
  const fu = await call('POST', '/posts', base({ slug: 'hospital-b', follow_up_of: orig.body.post.id }));
  assert.equal(fu.status, 201, JSON.stringify(fu.body));
  assert.deepEqual(fu.body.post.keys_shared_with_follow_up, ['url:https://example.com.br/news/1']);
  const third = await call('POST', '/posts', base({ slug: 'hospital-c', follow_up_of: fu.body.post.id }));
  assert.equal(third.status, 201, 'a follow-up chain shares its root');
});

test('discard requires a reason; a discarded subject only comes back as follow-up', async () => {
  const { call } = setup();
  const it = await call('POST', '/posts', base());
  const id = it.body.post.id;
  const noReason = await call('POST', `/posts/${id}/status`, { to: 'discarded' });
  assert.equal(noReason.status, 422);
  assert.equal(noReason.body.error, 'reason_required');
  const disc = await call('POST', `/posts/${id}/status`, { to: 'discarded', reason: 'off the editorial line' }, { internal: true });
  assert.equal(disc.body.post.status, 'discarded');
  const again = await call('POST', '/posts', base({ slug: 'test-2' }));
  assert.equal(again.status, 409);
  assert.equal(again.body.error, 'subject_discarded');
  assert.match(again.body.message, /off the editorial line/);
});

test('blog-first flow: cover, single claim, published by the blog, derived channels and retry', async () => {
  const { call } = setup();
  const it = await call('POST', '/posts', base());
  const id = it.body.post.id;

  assert.equal((await call('POST', `/posts/${id}/status`, { to: 'published' })).body.error, 'invalid_transition');
  const ap = await call('POST', `/posts/${id}/status`, { to: 'approved', notes: 'ok', star: true }, { internal: true });
  assert.equal(ap.body.post.status, 'approved');
  assert.equal(ap.body.post.priority, 'high');
  assert.ok(ap.body.post.approved_at);

  const noCover = await call('POST', '/publications', { post_id: id, channel: 'blog' });
  assert.equal(noCover.body.error, 'missing_cover');
  assert.equal((await call('PATCH', `/posts/${id}`, { image_source: 'og', image_url: 'https://raw.githubusercontent.com/x.jpg' })).body.error, 'cover_host_invalid');
  await call('PATCH', `/posts/${id}`, { image_source: 'generated', image_url: COVER });

  assert.equal((await call('POST', '/publications', { post_id: id, channel: 'linkedin' })).body.error, 'blog_not_published');
  const blogQueue = await call('GET', '/queue/blog');
  assert.equal(blogQueue.body.items[0].ready, true);

  const res = await call('POST', '/publications', { post_id: id, channel: 'blog' }, { token: TOKENS.TOKEN_GROK });
  assert.equal(res.status, 201);
  const other = await call('POST', '/publications', { post_id: id, channel: 'blog' });
  assert.equal(other.body.error, 'publication_already_claimed', 'a second agent cannot publish the same post');

  const done = await call('POST', `/publications/${res.body.publication.id}/result`, { status: 'published', url: 'https://dsb.duarte.top/briefings/2026-11-16-test-incident' });
  assert.equal(done.body.post_published, true);
  assert.equal((await call('GET', `/posts/${id}`)).body.post.status, 'published');

  assert.equal((await call('GET', '/queue/translations')).body.items.length, 1);
  const liQueue = await call('GET', '/queue/linkedin');
  assert.equal(liQueue.body.items.length, 1);
  const li = await call('POST', '/publications', { post_id: id, channel: 'linkedin' });
  const fail = await call('POST', `/publications/${li.body.publication.id}/result`, { status: 'failed', error: 'HTTP 429 Composio' });
  assert.equal(fail.body.publication.attempts, 1);
  const retry = await call('POST', '/publications', { post_id: id, channel: 'linkedin' });
  assert.equal(retry.body.publication.retry, true);
  const ok = await call('POST', `/publications/${li.body.publication.id}/result`, { status: 'published', url: 'https://www.linkedin.com/feed/update/urn:li:share:1', external_id: 'urn:li:share:1' });
  assert.equal(ok.body.publication.status, 'published');
  assert.equal((await call('GET', '/queue/linkedin')).body.items.length, 0);
  assert.equal((await call('GET', '/queue/x')).body.items.length, 1);
});

test('sweep opens, increments and auto-resolves; ignored stays closed; job error becomes an issue', async () => {
  const { call } = setup();
  const it = await call('POST', '/posts', base());
  const id = it.body.post.id;
  await call('POST', `/posts/${id}/status`, { to: 'approved' });

  await call('POST', '/sweep', {});
  let p = await call('GET', '/issues?stage=cover');
  assert.equal(p.body.items.length, 1);
  assert.equal(p.body.items[0].fingerprint, `missing_cover:${id}`);

  await call('POST', '/sweep', {});
  p = await call('GET', '/issues?stage=cover');
  assert.equal(p.body.items[0].occurrences, 2);

  await call('PATCH', `/posts/${id}`, { image_source: 'og', image_url: COVER });
  await call('POST', '/sweep', {});
  assert.equal((await call('GET', '/issues?stage=cover')).body.items.length, 0);
  const closed = await call('GET', '/issues?stage=cover&status=resolved');
  assert.equal(closed.body.items[0].resolved_by, 'auto');

  const job = await call('POST', '/jobs', { job: 'linkedin-publish-10h' });
  assert.equal((await call('PATCH', `/jobs/${job.body.job.id}`, { status: 'error' })).status, 422, 'error requires notes');
  const end = await call('PATCH', `/jobs/${job.body.job.id}`, { status: 'error', notes: 'Composio is down' });
  assert.equal(end.body.job.status, 'error');
  const rej = await call('GET', '/issues?stage=job&source=api');
  assert.equal(rej.body.items[0].kind, 'rejected_field_required', 'the attempt without notes was recorded too');
  const hj = await call('GET', '/issues?stage=job&source=health');
  assert.equal(hj.body.items.length, 1);

  const ign = await call('PATCH', `/issues/${hj.body.items[0].id}`, { status: 'ignored' });
  assert.equal(ign.body.error, 'note_required');
  await call('PATCH', `/issues/${hj.body.items[0].id}`, { status: 'ignored', resolution: 'known instability' }, { internal: true });
  await call('POST', '/sweep', {});
  assert.equal((await call('GET', '/issues?stage=job&source=health')).body.items.length, 0, 'an ignored issue does not reopen');
});

test('agent report, summary and single notification', async () => {
  const { call } = setup();
  const r = await call('POST', '/issues', { fingerprint: 'x-session', kind: 'session_expired', severity: 'critical', stage: 'x', summary: '@DSBriefing session dropped' });
  assert.equal(r.status, 201);
  const s = await call('GET', '/issues/summary');
  assert.deepEqual(s.body.summary, [{ stage: 'x', severity: 'critical', n: 1 }]);
  assert.equal((await call('POST', '/issues/notified', { ids: [r.body.issue.id] })).body.marked, 1);
  assert.equal((await call('POST', '/issues/notified', { ids: [r.body.issue.id] })).body.marked, 0);
});

test('reorder requires the full, current list', async () => {
  const { call } = setup();
  const a = (await call('POST', '/posts', base({ slug: 'a', source_url: 'https://e.com/a' }))).body.post.id;
  const b = (await call('POST', '/posts', base({ slug: 'b', source_url: 'https://e.com/b' }))).body.post.id;
  assert.equal((await call('POST', '/posts/reorder', { status: 'new', ids: [b] })).body.error, 'stale_list');
  const ok = await call('POST', '/posts/reorder', { status: 'new', ids: [b, a] }, { internal: true });
  assert.equal(ok.status, 200);
  const order = (await call('GET', '/posts?status=new')).body.items.map((i) => i.id);
  assert.deepEqual(order, [b, a]);
});

test('competitors: list with rule and aliases; text match by name and alias, not substrings', async () => {
  const { call } = setup();
  const r = await call('GET', '/competitors');
  assert.equal(r.status, 200);
  assert.ok(r.body.rule.blocked);
  const sec = r.body.competitors.find((c) => c.name === 'Securiti');
  assert.deepEqual(sec.aliases, ['Securiti.ai', 'Veeam Securiti']);
  const m = await call('GET', `/competitors?text=${encodeURIComponent('Veeam Securiti and Amazon Macie announce; Cyberhavens is fake; keep in mind; MIND raises; dig into Dig Security')}`);
  assert.deepEqual(m.body.matches.map((x) => x.name).sort(), ['Amazon Macie', 'Dig Security', 'MIND', 'Securiti']);
});

test('input errors: invalid JSON, unknown route, invalid slug, invalid type', async () => {
  const { env, call } = setup();
  const res = await handle(
    new Request('https://dsb-api/posts', { method: 'POST', headers: { Authorization: `Bearer ${TOKENS.TOKEN_CLAUDE}` }, body: '{x' }),
    env
  );
  assert.equal(res.status, 400);
  assert.equal((await call('GET', '/nothing')).status, 404);
  assert.equal((await call('POST', '/posts', base({ slug: 'With Accent é' }))).body.error, 'invalid_slug');
  assert.equal((await call('POST', '/posts', base({ type: 'Incidente' }))).body.error, 'invalid_value');
});
