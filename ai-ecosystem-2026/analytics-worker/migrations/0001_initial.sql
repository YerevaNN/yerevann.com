CREATE TABLE IF NOT EXISTS analytics_events (
  event_id TEXT PRIMARY KEY,
  report_version TEXT NOT NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  block_id TEXT,
  section_id TEXT,
  visible_ms INTEGER NOT NULL DEFAULT 0,
  device TEXT NOT NULL,
  referrer_host TEXT NOT NULL DEFAULT '',
  campaign_source TEXT NOT NULL DEFAULT '',
  campaign_medium TEXT NOT NULL DEFAULT '',
  campaign_name TEXT NOT NULL DEFAULT '',
  occurred_at INTEGER NOT NULL,
  server_received_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS events_received_idx ON analytics_events(server_received_at);
CREATE INDEX IF NOT EXISTS events_version_type_idx ON analytics_events(report_version, event_type, server_received_at);
CREATE INDEX IF NOT EXISTS events_section_idx ON analytics_events(section_id, server_received_at);
CREATE INDEX IF NOT EXISTS events_session_idx ON analytics_events(session_id, server_received_at);
CREATE UNIQUE INDEX IF NOT EXISTS unique_block_impression_per_session
  ON analytics_events(session_id, report_version, block_id)
  WHERE event_type = 'block_impression';

-- A short-lived, one-way token is used only to apply a pragmatic per-origin
-- rate limit. It is not an IP address and is cleaned up nightly.
CREATE TABLE IF NOT EXISTS rate_windows (
  bucket TEXT NOT NULL,
  window_start INTEGER NOT NULL,
  count INTEGER NOT NULL,
  PRIMARY KEY(bucket, window_start)
);
