import test from "node:test";
import assert from "node:assert/strict";
import {median, scope, validEvent} from "../src/index.js";

const manifest = {versions: new Set(["August-2026"]), ids: new Set(["01-block-001", "01-section-principal-findings"]), chapterIds: new Set(["01"])};
const base = {event_id: "b6c7a1a2-80ee-4f19-a7ae-2ef3f70e816d", session_id: "781610ec-95cc-43ae-a2f3-2a0d9645b3cf", event_type: "block_impression", report_version: "August-2026", block_id: "01-block-001", section_id: "01", device: "mobile", visible_ms: 0};
test("accepts a bounded, allowlisted event", () => assert.equal(validEvent(base, manifest), true));
test("rejects arbitrary content identifiers", () => assert.equal(validEvent({...base, block_id: "private-review-note"}, manifest), false));
test("rejects excessive visible time and malformed session IDs", () => { assert.equal(validEvent({...base, visible_ms: 30001}, manifest), false); assert.equal(validEvent({...base, session_id: "not-a-session"}, manifest), false); });
test("accepts union-time and bounded PDF events without a content block", () => { assert.equal(validEvent({...base, event_type: "session_active_time", block_id: "", visible_ms: 500}, manifest), true); assert.equal(validEvent({...base, event_type: "pdf_page_time", block_id: "", page_number: 4, visible_ms: 500}, manifest), true); assert.equal(validEvent({...base, event_type: "pdf_page_time", block_id: "", page_number: 0, visible_ms: 500}, manifest), false); });
test("rejects destinations with query strings", () => assert.equal(validEvent({...base, event_type: "external_click", block_id: "", destination: "example.org/paper?token=x"}, manifest), false));
test("requires allowlisted IDs for semantic time events", () => {
  assert.equal(validEvent({...base, event_type: "block_time", block_id: "", visible_ms: 10}, manifest), false);
  assert.equal(validEvent({...base, event_type: "section_active_time", block_id: "", section_id: "", visible_ms: 10}, manifest), false);
  assert.equal(validEvent({...base, event_type: "section_active_time", block_id: "", section_id: "99", visible_ms: 10}, manifest), false);
  assert.equal(validEvent({...base, event_type: "section_active_time", block_id: "", section_id: "01", visible_ms: 10}, manifest), true);
});
test("median uses session-level values", () => { assert.equal(median([1000, 5000, 9000]), 5000); assert.equal(median([1000, 5000]), 3000); });
test("scoped queries parameterize date and allowed filters", () => { const result = scope({from: "2026-08-01T00:00:00Z", to: "2026-08-31T23:59:59Z", version: "August-2026", device: "mobile", campaign: "launch"}); assert.match(result.where, /report_version = \?/); assert.equal(result.args.length, 5); });
