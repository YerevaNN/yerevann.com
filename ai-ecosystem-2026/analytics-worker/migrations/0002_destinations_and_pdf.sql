ALTER TABLE analytics_events ADD COLUMN page_number INTEGER NOT NULL DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN destination TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS events_pdf_page_idx ON analytics_events(page_number, server_received_at);
CREATE INDEX IF NOT EXISTS events_destination_idx ON analytics_events(destination, server_received_at);
