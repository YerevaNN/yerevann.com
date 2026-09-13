const text = new TextEncoder();
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const eventTypes = new Set(["session_start", "block_impression", "block_time", "session_active_time", "section_active_time", "last_section", "contents_nav", "external_click", "reader_mode", "pdf_page_impression", "pdf_page_time"]);
let manifestCache = {until: 0, ids: new Set(), chapterIds: new Set(), versions: new Set()};

const b64url = bytes => btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
const unb64url = value => Uint8Array.from(atob(value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4)), char => char.charCodeAt(0));
async function hmac(value, secret) { const key = await crypto.subtle.importKey("raw", text.encode(secret), {name: "HMAC", hash: "SHA-256"}, false, ["sign"]); return new Uint8Array(await crypto.subtle.sign("HMAC", key, text.encode(value))); }
async function digest(value) { return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", text.encode(value)))).map(n => n.toString(16).padStart(2, "0")).join(""); }
function same(a, b) { if (a.length !== b.length) return false; let out = 0; for (let i = 0; i < a.length; i++) out |= a[i] ^ b[i]; return out === 0; }
function json(body, status = 200, extra = {}) { return new Response(JSON.stringify(body), {status, headers: {"content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...extra}}); }
function allowedOrigin(request, env) { const origin = request.headers.get("Origin") || ""; return (env.ALLOWED_ORIGINS || "").split(",").map(x => x.trim()).includes(origin) ? origin : ""; }
function cors(request, env) { const origin = allowedOrigin(request, env); return origin ? {"access-control-allow-origin": origin, "access-control-allow-methods": "POST, GET, OPTIONS", "access-control-allow-headers": "content-type", "vary": "Origin"} : {}; }
function cookie(request, name) { return request.headers.get("Cookie")?.split(";").map(x => x.trim()).find(x => x.startsWith(`${name}=`))?.slice(name.length + 1) || ""; }
function filters(url) { const clamp = v => (v || "").slice(0, 80); return {from: /^\d{4}-\d\d-\d\d$/.test(url.searchParams.get("from") || "") ? `${url.searchParams.get("from")}T00:00:00Z` : new Date(Date.now() - 30 * 864e5).toISOString(), to: /^\d{4}-\d\d-\d\d$/.test(url.searchParams.get("to") || "") ? `${url.searchParams.get("to")}T23:59:59Z` : new Date().toISOString(), version: clamp(url.searchParams.get("version")), device: ["mobile", "tablet", "desktop"].includes(url.searchParams.get("device")) ? url.searchParams.get("device") : "", campaign: clamp(url.searchParams.get("campaign"))}; }
function scope(filter) { const where = ["server_received_at >= ?", "server_received_at <= ?"], args = [Date.parse(filter.from), Date.parse(filter.to)]; if (filter.version) {where.push("report_version = ?"); args.push(filter.version);} if (filter.device) {where.push("device = ?"); args.push(filter.device);} if (filter.campaign) {where.push("campaign_name = ?"); args.push(filter.campaign);} return {where: where.join(" AND "), args}; }

async function getManifest(env) {
  if (manifestCache.until > Date.now()) return manifestCache;
  const response = await fetch(env.MANIFEST_URL, {cf: {cacheTtl: 300, cacheEverything: true}});
  if (!response.ok) throw new Error("Manifest unavailable");
  const data = await response.json();
  manifestCache = {until: Date.now() + 300_000, ids: new Set((data.blocks || []).map(item => item.id)), chapterIds: new Set((data.chapters || []).map(item => item.id)), versions: new Set([data.report_version])};
  return manifestCache;
}
function campaignValue(event, key) { const value = event.campaign?.[key] || ""; return typeof value === "string" && value.length <= 80 && /^[\w .:+-]*$/.test(value) ? value : ""; }
function validEvent(event, manifest) {
  if (!event || typeof event !== "object" || !uuid.test(event.event_id || "") || !uuid.test(event.session_id || "") || !eventTypes.has(event.event_type) || !manifest.versions.has(event.report_version)) return false;
  if (!["mobile", "tablet", "desktop"].includes(event.device)) return false;
  if (event.block_id && !manifest.ids.has(event.block_id)) return false;
  if (event.section_id && !manifest.ids.has(event.section_id) && !manifest.chapterIds.has(event.section_id)) return false;
  if (event.visible_ms != null && (!Number.isInteger(event.visible_ms) || event.visible_ms < 0 || event.visible_ms > 120_000)) return false;
  if (event.destination && (typeof event.destination !== "string" || event.destination.length > 180 || /[?#]/.test(event.destination))) return false;
  if (["pdf_page_impression", "pdf_page_time"].includes(event.event_type) && (!Number.isInteger(event.page_number) || event.page_number < 1 || event.page_number > 1000)) return false;
  if (["block_impression", "block_time"].includes(event.event_type) && !event.block_id) return false;
  if (event.event_type === "section_active_time" && !event.section_id) return false;
  return true;
}
async function rateLimit(request, env) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const minute = Math.floor(Date.now() / 60_000) * 60_000;
  const bucket = (await digest(`${env.RATE_LIMIT_SECRET}:${ip}:${minute}`)).slice(0, 40);
  await env.ANALYTICS_DB.prepare("INSERT INTO rate_windows(bucket, window_start, count) VALUES (?, ?, 1) ON CONFLICT(bucket, window_start) DO UPDATE SET count = count + 1").bind(bucket, minute).run();
  const row = await env.ANALYTICS_DB.prepare("SELECT count FROM rate_windows WHERE bucket = ? AND window_start = ?").bind(bucket, minute).first();
  return row.count <= 120;
}
async function authenticate(request, env) {
  const token = cookie(request, "ai_admin"); if (!token) return false;
  const [head, body, sig] = token.split("."); if (!head || !body || !sig) return false;
  try { const expected = await hmac(`${head}.${body}`, env.ADMIN_SESSION_SECRET); if (!same(expected, unb64url(sig))) return false; const claims = JSON.parse(new TextDecoder().decode(unb64url(body))); return claims.a === "admin" && Number.isInteger(claims.exp) && claims.exp > Date.now(); } catch { return false; }
}
async function login(request, env) {
  const requestOrigin = request.headers.get("Origin") || "";
  const origin = allowedOrigin(request, env);
  const sameWorkerOrigin = requestOrigin === new URL(request.url).origin;
  if (!origin && !sameWorkerOrigin) return json({error: "Origin not allowed"}, 403);
  if (!(await rateLimit(request, env))) return json({error: "Rate limit exceeded"}, 429, cors(request, env));
  let input; try { input = await request.json(); } catch { return json({error: "Invalid JSON"}, 400); }
  if (typeof input.password !== "string" || input.password.length > 512) return json({error: "Invalid credentials"}, 401);
  const supplied = await hmac(input.password, env.ADMIN_PASSWORD), expected = await hmac(env.ADMIN_PASSWORD, env.ADMIN_PASSWORD);
  if (!same(supplied, expected)) return json({error: "Invalid credentials"}, 401);
  const head = b64url(text.encode(JSON.stringify({alg: "HS256", typ: "JWT"}))), body = b64url(text.encode(JSON.stringify({a: "admin", exp: Date.now() + 12 * 3600_000}))), signature = b64url(await hmac(`${head}.${body}`, env.ADMIN_SESSION_SECRET));
  return json({ok: true}, 200, {...cors(request, env), "set-cookie": `ai_admin=${head}.${body}.${signature}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=43200`});
}
async function ingest(request, env) {
  const origin = allowedOrigin(request, env); if (!origin) return json({error: "Origin not allowed"}, 403);
  if (!(await rateLimit(request, env))) return json({error: "Rate limit exceeded"}, 429, cors(request, env));
  const length = Number(request.headers.get("content-length") || 0); if (length > 65_536) return json({error: "Payload too large"}, 413, cors(request, env));
  let payload; try { payload = await request.json(); } catch { return json({error: "Invalid JSON"}, 400, cors(request, env)); }
  if (!Array.isArray(payload.events) || payload.events.length < 1 || payload.events.length > 32) return json({error: "Invalid event batch"}, 400, cors(request, env));
  let manifest; try { manifest = await getManifest(env); } catch { return json({error: "Analytics validation unavailable"}, 503, cors(request, env)); }
  if (!payload.events.every(e => validEvent(e, manifest))) return json({error: "Invalid event"}, 400, cors(request, env));
  const now = Date.now();
  const statements = payload.events.map(e => env.ANALYTICS_DB.prepare("INSERT OR IGNORE INTO analytics_events(event_id,report_version,session_id,event_type,block_id,section_id,page_number,destination,visible_ms,device,referrer_host,campaign_source,campaign_medium,campaign_name,occurred_at,server_received_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(e.event_id,e.report_version,e.session_id,e.event_type,e.block_id || "",e.section_id || "",e.page_number || 0,e.destination || "",e.visible_ms || 0,e.device,(e.referrer_host || "").slice(0,200),campaignValue(e,"utm_source"),campaignValue(e,"utm_medium"),campaignValue(e,"utm_campaign"),Math.max(now - 86_400_000, Math.min(now + 300_000, Number(e.occurred_at) || now)),now));
  await env.ANALYTICS_DB.batch(statements);
  return json({accepted: payload.events.length}, 202, cors(request, env));
}
function median(values) { if (!values.length) return 0; values.sort((a,b) => a-b); const n = Math.floor(values.length / 2); return values.length % 2 ? values[n] : Math.round((values[n-1] + values[n]) / 2); }
async function dashboard(request, env) {
  if (!(await authenticate(request, env))) return json({error: "Authentication required"}, 401, cors(request, env));
  const filter = filters(new URL(request.url)), s = scope(filter), suffix = s.where ? ` WHERE ${s.where}` : "";
  const totals = await env.ANALYTICS_DB.prepare(`SELECT COUNT(DISTINCT session_id) sessions, COUNT(*) events, COUNT(DISTINCT CASE WHEN event_type='block_impression' THEN session_id END) reached FROM analytics_events${suffix}`).bind(...s.args).first();
  const engaged = await env.ANALYTICS_DB.prepare(`SELECT COUNT(*) count FROM (SELECT session_id FROM analytics_events${suffix} GROUP BY session_id HAVING SUM(CASE WHEN event_type='session_active_time' THEN visible_ms ELSE 0 END) >= 30000)`).bind(...s.args).first();
  const sectionRows = await env.ANALYTICS_DB.prepare(`SELECT COALESCE(section_id, block_id) section_id, COUNT(DISTINCT session_id) sessions, COUNT(DISTINCT CASE WHEN event_type='block_impression' THEN session_id END) impressions, SUM(CASE WHEN event_type='section_active_time' THEN visible_ms ELSE 0 END) visible_ms FROM analytics_events${suffix} AND (event_type IN ('block_impression','section_active_time')) GROUP BY COALESCE(section_id, block_id) ORDER BY sessions DESC LIMIT 200`).bind(...s.args).all();
  const perSession = await env.ANALYTICS_DB.prepare(`SELECT section_id, session_id, SUM(visible_ms) visible_ms FROM analytics_events${suffix} AND event_type='section_active_time' GROUP BY section_id, session_id`).bind(...s.args).all();
  const valuesBySection = new Map(); for (const row of perSession.results) { const arr = valuesBySection.get(row.section_id) || []; arr.push(row.visible_ms); valuesBySection.set(row.section_id, arr); }
  const sections = sectionRows.results.map(row => ({...row, median_visible_ms: median(valuesBySection.get(row.section_id) || [])}));
  const last = await env.ANALYTICS_DB.prepare(`SELECT section_id, COUNT(DISTINCT session_id) sessions FROM analytics_events${suffix} AND event_type='last_section' GROUP BY section_id ORDER BY sessions DESC LIMIT 100`).bind(...s.args).all();
  const links = await env.ANALYTICS_DB.prepare(`SELECT destination, COUNT(*) clicks FROM analytics_events${suffix} AND event_type='external_click' GROUP BY destination ORDER BY clicks DESC LIMIT 100`).bind(...s.args).all();
  const pdfPages = await env.ANALYTICS_DB.prepare(`SELECT page_number, COUNT(DISTINCT CASE WHEN event_type='pdf_page_impression' THEN session_id END) impressions, SUM(CASE WHEN event_type='pdf_page_time' THEN visible_ms ELSE 0 END) visible_ms FROM analytics_events${suffix} AND event_type IN ('pdf_page_impression','pdf_page_time') GROUP BY page_number ORDER BY page_number LIMIT 1000`).bind(...s.args).all();
  const blockRows = await env.ANALYTICS_DB.prepare(`SELECT block_id, section_id, COUNT(DISTINCT CASE WHEN event_type='block_impression' THEN session_id END) impressions, SUM(CASE WHEN event_type='block_time' THEN visible_ms ELSE 0 END) visible_ms FROM analytics_events${suffix} AND event_type IN ('block_impression','block_time') AND block_id != '' GROUP BY block_id, section_id ORDER BY impressions DESC, visible_ms DESC LIMIT 200`).bind(...s.args).all();
  return json({filter, definition: {engaged_session: "A session with at least 30 seconds of accepted, non-overlapping active-session time.", visible_time: "Estimated active, visible time; it is not proof of reading. Session and section time use interval unions, not sums of simultaneously visible blocks."}, totals: {...totals, engaged_sessions: engaged.count}, sections, blocks: blockRows.results, last_observed_sections: last.results, external_link_clicks: links.results, pdf_pages: pdfPages.results}, 200, cors(request, env));
}
export default { async fetch(request, env) { const url = new URL(request.url); if (request.method === "OPTIONS") return new Response(null, {status: 204, headers: cors(request, env)}); if (url.pathname === "/health") return json({ok: true}); if (url.pathname === "/v1/events" && request.method === "POST") return ingest(request, env); if (url.pathname === "/admin/login" && request.method === "POST") return login(request, env); if (url.pathname === "/admin/logout" && request.method === "POST") return json({ok: true},200,{...cors(request,env),"set-cookie":"ai_admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"}); if (url.pathname === "/admin/dashboard" && request.method === "GET") return dashboard(request, env); if (env.ASSETS) return env.ASSETS.fetch(request); return json({error: "Not found"}, 404, cors(request, env)); }, async scheduled(_, env) { const cutoff = Date.now() - Number(env.RAW_RETENTION_DAYS || 90) * 864e5; await env.ANALYTICS_DB.batch([env.ANALYTICS_DB.prepare("DELETE FROM analytics_events WHERE server_received_at < ?").bind(cutoff), env.ANALYTICS_DB.prepare("DELETE FROM rate_windows WHERE window_start < ?").bind(Date.now() - 2 * 864e5)]); } };
export {validEvent, median, scope};
