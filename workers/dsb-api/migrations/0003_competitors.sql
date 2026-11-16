-- DSB · 0003 — single list of BigID competitors (decision of 2026-11-16)
-- Hard editorial rule, read by every agent through GET /competitors:
--   * block: funding, M&A where the competitor buys or is bought, product launches or GA, awards,
--     analyst rankings, partnerships/integrations/marketplace, customer contracts, executive hires,
--     and research or reports published by the competitor itself (even with new data);
--   * still allowed, in a neutral tone: incidents, breaches, flaws, CVE/KEV, enforcement or sanctions
--     that affect the competitor or its customers;
--   * platform_module rows are diversified platforms: only what promotes the module that competes
--     with BigID is blocked; security advisories and threat intelligence about real attacks may be sources.
--   * When in doubt whether a company competes, treat it as a competitor.

CREATE TABLE competitors (
  name       TEXT PRIMARY KEY,
  kind       TEXT NOT NULL CHECK (kind IN ('vendor','platform_module')),
  aliases    TEXT,                            -- comma-separated other names; all-caps names match case-sensitively
  notes      TEXT,
  active     INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0,1)),
  added_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

INSERT INTO competitors (name, kind, aliases, notes) VALUES
  ('Cyera', 'vendor', NULL, NULL),
  ('Varonis', 'vendor', NULL, NULL),
  ('Securiti', 'vendor', 'Securiti.ai,Veeam Securiti', NULL),
  ('OneTrust', 'vendor', NULL, NULL),
  ('Sentra', 'vendor', NULL, NULL),
  ('Concentric AI', 'vendor', 'Concentric', NULL),
  ('Netwrix', 'vendor', NULL, NULL),
  ('Spirion', 'vendor', NULL, NULL),
  ('Immuta', 'vendor', NULL, NULL),
  ('Privacera', 'vendor', NULL, NULL),
  ('Symmetry Systems', 'vendor', NULL, NULL),
  ('Bedrock Security', 'vendor', NULL, NULL),
  ('Teleskope', 'vendor', NULL, NULL),
  ('Theom', 'vendor', NULL, NULL),
  ('Normalyze', 'vendor', NULL, NULL),
  ('Laminar', 'vendor', 'Rubrik Laminar', NULL),
  ('Dig Security', 'vendor', NULL, 'Acquired by Palo Alto Networks'),
  ('Nightfall', 'vendor', 'Nightfall AI', NULL),
  ('Harmonic', 'vendor', 'Harmonic Security', NULL),
  ('Lasso', 'vendor', 'Lasso Security', NULL),
  ('Prompt Security', 'vendor', NULL, NULL),
  ('Aim Security', 'vendor', NULL, NULL),
  ('Zenity', 'vendor', NULL, NULL),
  ('Noma', 'vendor', 'Noma Security', NULL),
  ('TrustArc', 'vendor', NULL, NULL),
  ('Transcend', 'vendor', NULL, NULL),
  ('Ketch', 'vendor', NULL, NULL),
  ('DataGrail', 'vendor', NULL, NULL),
  ('Osano', 'vendor', NULL, NULL),
  ('Collibra', 'vendor', NULL, NULL),
  ('Alation', 'vendor', NULL, NULL),
  ('Atlan', 'vendor', NULL, NULL),
  ('Informatica', 'vendor', NULL, NULL),
  ('MIND', 'vendor', 'MIND Security', NULL),
  ('Bonfy', 'vendor', 'Bonfy.AI', NULL),
  ('Soveren', 'vendor', NULL, NULL),
  ('Cyberhaven', 'vendor', NULL, NULL),
  ('Microsoft Purview', 'platform_module', 'Purview', 'Microsoft'),
  ('Amazon Macie', 'platform_module', 'Macie', 'AWS'),
  ('Google Sensitive Data Protection', 'platform_module', 'Google Cloud DLP', 'Google'),
  ('Palo Alto Networks DSPM', 'platform_module', NULL, 'Palo Alto Networks'),
  ('Rubrik DSPM', 'platform_module', NULL, 'Rubrik'),
  ('Proofpoint DSPM', 'platform_module', NULL, 'Proofpoint'),
  ('Zscaler DSPM', 'platform_module', NULL, 'Zscaler'),
  ('Forcepoint DSPM', 'platform_module', 'Forcepoint DLP', 'Forcepoint'),
  ('Wiz DSPM', 'platform_module', 'Wiz data security', 'Wiz'),
  ('CrowdStrike DSPM', 'platform_module', 'CrowdStrike Falcon Data Protection', 'CrowdStrike'),
  ('Tenable DSPM', 'platform_module', NULL, 'Tenable');
