-- DSB · 0006 — ad hoc curation requests (X-23).
-- Marcelo (queue app), Grok or Claude drop a link with a note; the next Claude or Grok intake run claims it,
-- reviews the link and either writes the post (done + post_id) or refuses it with the reason.
-- open → claimed → done | refused. A claim older than 2 h can be claimed again (the run died).

CREATE TABLE intake_requests (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  url            TEXT NOT NULL,                       -- normalized like a source_url
  note           TEXT,
  requested_by   TEXT NOT NULL,                       -- grok | claude | Access e-mail / app name
  status         TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','claimed','done','refused')),
  claimed_by     TEXT,
  claimed_at     TEXT,
  post_id        INTEGER REFERENCES posts(id) ON DELETE SET NULL,
  reason         TEXT,                                -- refusal reason (or a note on done)
  created_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at     TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  CHECK (status <> 'done' OR post_id IS NOT NULL),
  CHECK (status <> 'refused' OR reason IS NOT NULL)
);
CREATE INDEX ix_intake_status ON intake_requests(status, created_at);
-- One live request per URL: the same link cannot be queued twice while it waits.
CREATE UNIQUE INDEX ux_intake_open_url ON intake_requests(url) WHERE status IN ('open','claimed');

-- Health check: a request nobody took within a day (no intake run picked it up).
CREATE VIEW v_hc_intake_waiting AS
SELECT 'intake_waiting:' || r.id AS fingerprint, 'intake_waiting' AS kind, 'warning' AS severity,
       'curation' AS stage, NULL AS post_id, NULL AS publication_id,
       'Ad hoc link waiting more than 24 h: ' || r.url AS summary,
       'The next Claude or Grok intake run should review it; check that the intake jobs run' AS suggested_action
FROM intake_requests r
WHERE (r.status = 'open' AND julianday('now') - julianday(r.created_at) > 1)
   OR (r.status = 'claimed' AND julianday('now') - julianday(r.claimed_at) > 1);

INSERT INTO health_checks(name, view_name, description) VALUES
  ('intake_waiting', 'v_hc_intake_waiting', 'Ad hoc link not reviewed within 24 h');
