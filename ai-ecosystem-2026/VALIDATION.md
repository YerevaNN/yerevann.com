# Local acceptance record — 2026-09-12

## Final public-content snapshot

- Report version: `August-2026-4af88b5521dd` (the visible report label remains **August 2026**).
- Public surface: 9 allowlisted chapters, 527 tracked headings/content blocks, 9 allowlisted report images, and the approved original-layout PDF.
- The final source hashes captured into `content-manifest.json` match the current authoritative report inputs:

| Source | SHA-256 prefix |
| --- | --- |
| `01-executive-summary.md` | `8ea97aef0033` |
| `02-research-academia.md` | `6b404ebb6f85` |
| `04-education.md` | `44e724119081` |
| `05-infrastructure-and-compute.md` | `78380feb87a8` |
| `03-industry.md` | `c44310970332` |
| `06-government-support-and-coordination.md` | `745e0711050d` |
| `07-ai-community.md` | `f5d5978b39de` |
| `ai-literacy.md` | `91029b9677b5` |
| `08-gaps-challenges-outlook.md` | `ba5bf9fc154b` |

## Local preview and validation

- Reader health: `http://localhost:8790/index.html` returned HTTP 200.
- Local Worker/admin health: `http://127.0.0.1:8788/health` returned HTTP 200.
- The local override points to the local Worker (`127.0.0.1:8788`); the production hostname uses the dedicated production Worker described below.
- Local D1 migrations `0001_initial.sql` and `0002_destinations_and_pdf.sql` were applied to an isolated temporary local state.
- `npm test` passes offline. The opt-in local acceptance check is:

  ```powershell
  $env:LOCAL_E2E = "1"
  node test/local-reader-e2e.mjs
  ```

  It runs the actual reader bundle in a simulated DOM with a visible public block and an optional PDF page, confirms two Worker-acknowledged batches, then signs in and confirms the dashboard shows the reader-generated block and PDF-page data. It is an integration harness, not browser QA.
- A malformed admin cookie (`ai_admin=not.valid.%%%`) returns HTTP 401, rather than an error response.

## Visual-QA limitation

Browser visual inspection was not performed. The browser-control tool rejected opening the local preview and explicitly said: “The browser URL policy blocks this action. Browser use cannot visit the requested page because its URL is blocked by the Browser use URL policy. The agent must not attempt to achieve the same outcome via workaround, indirect execution, raw CDP or browser commands, alternate browser surfaces, or policy circumvention.” No workaround was attempted.

## Production deployment — 2026-09-13

- Public reader: `https://yerevann.com/ai-ecosystem-2026/`
- Production Worker/dashboard: `https://yerevann-ai-ecosystem-analytics.aidiffusion.workers.dev/`
- Dedicated production D1 database: `yerevann-ai-ecosystem-analytics`

The public reader is deployed through GitHub Pages. Its production-only configuration sends analytics to the dedicated Worker, which allows `https://yerevann.com` (and `https://www.yerevann.com`) only. The Worker has distinct deployed secrets for its admin password, session signing, and rate-limit hashing; no secret is committed to the repository.

Production health returned HTTP 200, the live-origin preflight returned HTTP 204 with the exact allowed origin, and a valid live-origin test event was accepted with HTTP 202 and stored in the dedicated D1 database. The existing staging database, reviewer platform, DNS, and report source remain separate and unchanged.

Deployed-reader acceptance covers desktop navigation and PDF rendering, plus a 390px-wide responsive check with a working Contents panel, PDF text layer, and no horizontal overflow. A local Chrome client still blocks direct `workers.dev` navigation, so its remote admin visual check remains pending a browser client without that block. Admin access also requires the administrator to choose and install a durable password in Cloudflare rather than sharing one in chat.

## Isolated Cloudflare staging — 2026-09-12

- Reader: `https://yerevann-ai-ecosystem-staging.pages.dev`
- Analytics Worker: `https://yerevann-ai-ecosystem-analytics-staging.aidiffusion.workers.dev`
- Dedicated D1 database: `yerevann-ai-ecosystem-staging`

The reader uses the staging Worker only on the staging Pages hostname. The Worker accepts that Pages origin only, uses a separate D1 binding, and retains raw events for 30 days. No production hostname, DNS record, production Worker, reviewer system, or report source was changed.

Desktop browser acceptance on the staging reader covered the Contents toggle, a chapter deep link, and opening the 78-page PDF with its text layer. The remote D1 database then recorded a real browser session start, block impression and time, reader-mode event, PDF page impression and time, and section/session active-time events.

The local Chrome client blocked direct navigation to the Worker admin URL with `ERR_BLOCKED_BY_CLIENT`; that prevented a remote dashboard visual check in this browser environment, but did not affect the reader-to-Worker event pipeline. Mobile-size visual review and the remote dashboard visual review remain pending a browser environment without that local block.

## Deployment-scope note

The existing AI Ecosystem reviewer platform is a separate live Site with its own reviewer D1 binding. It was inspected read-only and remains unrelated to this reader. The distinct staging Pages project, Worker, and D1 database above were created separately for this work.
