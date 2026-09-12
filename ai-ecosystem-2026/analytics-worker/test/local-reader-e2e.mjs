// Opt-in local acceptance test. It drives the actual reader bundle against a
// running local Worker; it is intentionally separate from the offline suite.
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

if (process.env.LOCAL_E2E !== "1") process.exit(0);

const readerRoot = new URL("../../", import.meta.url);
const worker = "http://127.0.0.1:8788";
const manifest = await (await fetch("http://127.0.0.1:8790/content-manifest.json")).json();
let clock = 100, sequence = 0, hooks, accepted = 0;
const observers = [], storage = new Map();
class Element {
  constructor(kind = "control") { this.kind = kind; this.dataset = {}; this.style = {}; this.hidden = false; this.textContent = ""; this.classList = {toggle: () => false, remove() {}}; }
  addEventListener() {} append() {} replaceChildren() {} scrollIntoView() {} setAttribute() {}
  getAttribute() { return "#chapter-01"; } getContext() { return {}; } querySelector() { return new Element(); }
  closest(selector) { if (selector === ".chapter" && this.kind === "block") return chapter; if (selector === "[data-block-id]" && this.kind === "block") return this; return null; }
}
const fakePdfPage = {getViewport: ({scale}) => ({width: 100 * scale, height: 200 * scale, convertToViewportRectangle: rect => rect}), render: () => ({promise: Promise.resolve(), cancel() {}}), streamTextContent: () => ({}), getAnnotations: async () => []};
const fakePdf = {lib: {TextLayer: class { async render() {} }}, doc: {numPages: 1, getPage: async () => fakePdfPage}};
const chapter = new Element("chapter"); chapter.dataset.chapterId = manifest.chapters[0].id;
const block = new Element("block"); block.dataset.blockId = manifest.blocks.find(item => item.chapter_id === chapter.dataset.chapterId).id;
const nativeFetch = fetch;
const context = vm.createContext({
  URL, URLSearchParams, Blob, Promise, JSON, Math, TextEncoder,
  Date: {now: () => clock}, innerWidth: 390, innerHeight: 700,
  location: {search: ""},
  window: {READER_CONFIG: {analyticsEndpoint: worker, reportVersion: manifest.report_version, pdfLoader: async () => fakePdf, testHooks: value => { hooks = value; }}},
  document: {hidden: false, referrer: "", querySelector: () => new Element(), querySelectorAll: selector => selector === ".reading-block" ? [block] : [], createElement: () => new Element(), addEventListener() {}},
  sessionStorage: {getItem: key => storage.get(key) || null, setItem: (key, value) => storage.set(key, value)},
  crypto: {randomUUID: () => `10000000-0000-4000-8000-${String(++sequence).padStart(12, "0")}`},
  navigator: {sendBeacon: () => false}, addEventListener() {}, setInterval() {},
  IntersectionObserver: class { constructor(callback) { this.callback = callback; this.targets = []; observers.push(this); } observe(target) { this.targets.push(target); } },
  fetch: async (url, options) => { const response = await nativeFetch(url, {...options, headers: {...options.headers, Origin: "http://localhost:8790"}}); if (response.ok) accepted += 1; return response; }
});
vm.runInContext(fs.readFileSync(new URL("tracking-core.js", readerRoot), "utf8"), context);
vm.runInContext("window.ReaderTrackerCore=globalThis.ReaderTrackerCore", context);
vm.runInContext(fs.readFileSync(new URL("reader.js", readerRoot), "utf8"), context);
observers[0].callback([{target: block, isIntersecting: true, intersectionRatio: 1, boundingClientRect: {height: 250}}]);
clock = 2_250; hooks.tick();
clock = 2_650; hooks.tick(true); await new Promise(resolve => setTimeout(resolve, 100)); await hooks.flush();
assert.ok(accepted >= 1, "reader events were acknowledged by the Worker");
await hooks.openPdf();
observers.at(-1).callback([{target: observers.at(-1).targets[0], isIntersecting: true, intersectionRatio: 1, boundingClientRect: {height: 250}}]);
clock = 4_800; hooks.tick();
clock = 5_200; hooks.tick(true); await new Promise(resolve => setTimeout(resolve, 100)); await hooks.flush();
const login = await nativeFetch(`${worker}/admin/login`, {method: "POST", headers: {Origin: worker, "content-type": "application/json"}, body: JSON.stringify({password: "local-test-password"})});
assert.equal(login.status, 200);
const dashboard = await nativeFetch(`${worker}/admin/dashboard?version=${encodeURIComponent(manifest.report_version)}`, {headers: {Origin: worker, Cookie: login.headers.get("set-cookie").split(";")[0]}});
assert.equal(dashboard.status, 200);
const data = await dashboard.json();
assert.ok(data.blocks.some(row => row.block_id === block.dataset.blockId && row.impressions >= 1), "dashboard exposes reader-generated block record");
assert.ok(data.pdf_pages.some(row => row.page_number === 1 && row.visible_ms >= 1), "PDF-only visibility contributes active-session telemetry");
console.log(`reader→Worker accepted ${accepted} batch(es); dashboard contains ${block.dataset.blockId}`);
