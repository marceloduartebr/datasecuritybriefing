-- DSB · 0007 — publishing plan (flow control per type and round), edited in DSB Admin (Flow tab).
-- One row holds the current plan as JSON; every change is kept in publish_plan_log.
-- The publish rounds ask GET /plan/round?round=… which posts to take; the skills carry no fixed numbers.

CREATE TABLE publish_plan (
  id          INTEGER PRIMARY KEY CHECK (id = 1),
  plan        TEXT NOT NULL,                      -- JSON, validated by the API (src/plan.js)
  updated_by  TEXT NOT NULL,
  updated_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

CREATE TABLE publish_plan_log (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  plan        TEXT NOT NULL,
  changed_by  TEXT NOT NULL,
  note        TEXT,
  changed_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- Starting plan (2026-11-20, from approvals since 2 Nov: incidents ~1.9, vulnerabilities ~1.1, news ~0.9 per business day).
INSERT INTO publish_plan (id, plan, updated_by) VALUES (1, '{"rounds":{"blog_morning":{"caps":{"incident":2,"vulnerability":1,"news":1},"total":4,"reserve":{"incident":0,"vulnerability":0,"news":0}},"blog_afternoon":{"caps":{"incident":1,"vulnerability":1,"news":1},"total":3,"reserve":{"incident":2,"vulnerability":2,"news":2}},"linkedin_morning":{"total":3},"linkedin_afternoon":{"total":3}},"burst":{"on":false,"until":null,"types":["incident"],"factor":2,"freshest_first":true},"stale_business_days":{"incident":3,"vulnerability":3,"news":7}}', 'migration 0007');
INSERT INTO publish_plan_log (plan, changed_by, note) SELECT plan, updated_by, 'starting plan' FROM publish_plan;
