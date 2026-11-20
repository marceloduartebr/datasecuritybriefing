/** GET /metrics?weeks=8 — read-only throughput for the admin Metrics tab (X-16). Weeks start on Monday, BRT. */

const WEEK = (col) => `date(${col}, '-3 hours', 'weekday 0', '-6 days')`;

function median(list) {
  if (!list.length) return null;
  const s = [...list].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return Math.round((s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2) * 10) / 10;
}

export async function metrics(db, q) {
  const weeks = Math.min(Math.max(Number(q.get('weeks')) || 8, 1), 26);
  const since = `date('now', '-3 hours', 'weekday 0', '-6 days', '-${(weeks - 1) * 7} days')`;
  const rows = async (sql) => (await db.prepare(sql).all()).results || [];

  const [curated, published, closed, covers, timings, queue] = await Promise.all([
    // A post written from a link Marcelo sent for review counts as his, whoever wrote it.
    rows(`SELECT ${WEEK('p.added_at')} AS week,
                 CASE WHEN EXISTS (SELECT 1 FROM intake_requests r WHERE r.post_id = p.id AND r.status = 'done'
                                   AND r.requested_by NOT IN ('grok','claude')) THEN 'user' ELSE p.added_by END AS added_by,
                 COUNT(*) AS n FROM posts p
          WHERE ${WEEK('p.added_at')} >= ${since} GROUP BY 1, 2`),
    rows(`SELECT ${WEEK('published_at')} AS week, channel, COUNT(*) AS n FROM publications
          WHERE status IN ('published','removal_pending','removed') AND published_at IS NOT NULL
            AND (channel <> 'blog' OR lang = 'pt') AND ${WEEK('published_at')} >= ${since} GROUP BY 1, 2`),
    rows(`SELECT ${WEEK('at')} AS week, to_status, COUNT(*) AS n FROM post_events
          WHERE to_status IN ('discarded','removed') AND ${WEEK('at')} >= ${since} GROUP BY 1, 2`),
    rows(`SELECT ${WEEK('added_at')} AS week, image_source, COUNT(*) AS n FROM posts
          WHERE image_source <> 'none' AND ${WEEK('added_at')} >= ${since} GROUP BY 1, 2`),
    rows(`SELECT ${WEEK('b.published_at')} AS week,
                 (julianday(p.approved_at) - julianday(p.added_at)) * 24 AS to_approve,
                 (julianday(b.published_at) - julianday(p.approved_at)) * 24 AS to_blog
          FROM posts p JOIN publications b ON b.post_id = p.id AND b.channel = 'blog' AND b.lang = 'pt'
          WHERE b.published_at IS NOT NULL AND p.approved_at IS NOT NULL AND ${WEEK('b.published_at')} >= ${since}`),
    rows(`SELECT status, type, COUNT(*) AS n FROM posts WHERE status IN ('new','approved') GROUP BY 1, 2`)
  ]);

  const out = new Map();
  const wk = (w) => {
    if (!out.has(w)) {
      out.set(w, {
        week: w,
        curated: { total: 0, grok: 0, claude: 0, user: 0, research: 0 },
        published: { blog: 0, linkedin: 0, x: 0 },
        discarded: 0,
        removed: 0,
        covers: { og: 0, generated: 0 },
        hours_to_approve_median: null,
        hours_approve_to_blog_median: null
      });
    }
    return out.get(w);
  };
  for (const r of curated) { const w = wk(r.week); w.curated[r.added_by] = (w.curated[r.added_by] || 0) + r.n; w.curated.total += r.n; }
  for (const r of published) wk(r.week).published[r.channel] = r.n;
  for (const r of closed) wk(r.week)[r.to_status] = r.n;
  for (const r of covers) wk(r.week).covers[r.image_source] = r.n;
  const byWeek = new Map();
  for (const r of timings) {
    if (!byWeek.has(r.week)) byWeek.set(r.week, { a: [], b: [] });
    if (r.to_approve >= 0) byWeek.get(r.week).a.push(r.to_approve);
    if (r.to_blog >= 0) byWeek.get(r.week).b.push(r.to_blog);
  }
  for (const [w, t] of byWeek) {
    const x = wk(w);
    x.hours_to_approve_median = median(t.a);
    x.hours_approve_to_blog_median = median(t.b);
  }

  const backlog = { new: { total: 0 }, approved: { total: 0 } };
  for (const r of queue) { backlog[r.status][r.type] = r.n; backlog[r.status].total += r.n; }

  return { weeks: [...out.values()].sort((a, b) => (a.week < b.week ? 1 : -1)), backlog, generated_at: new Date().toISOString() };
}
