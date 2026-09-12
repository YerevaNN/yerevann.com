# Private engagement analytics Worker

This is a dedicated Cloudflare Worker and D1 database for the public report. It does not share a Worker, database, binding, or credentials with the reviewer portal.

## What it stores

`analytics_events` accepts only a small set of anonymous reader events. A session ID is a random value stored in `sessionStorage`, so it represents a browser tab rather than a person. The Worker never writes raw IP addresses; the request IP is only used in memory to derive a one-way, per-minute rate-limit token that is deleted within two days. Raw event records are deleted after 90 days by the scheduled Worker; aggregate dashboard queries intentionally use only the retained event data, so the dashboard does not pretend to have permanent exact raw-event history.

The Worker validates report versions and block IDs by fetching the generated public `content-manifest.json`. It rejects arbitrary IDs, malformed/oversized batches, unapproved origins, excessive visible-time deltas, duplicate event IDs, and duplicate block impressions for the same tab session/report version/block.

## Staging or production setup

1. In a separate Cloudflare account/project area from the reviewer portal, create D1 and insert the returned ID in `wrangler.toml`:

   ```sh
   cd ai-ecosystem-2026/analytics-worker
   npx wrangler d1 create yerevann-ai-ecosystem-analytics
   npx wrangler d1 migrations apply yerevann-ai-ecosystem-analytics --remote
   ```

2. Set `ALLOWED_ORIGINS` and `MANIFEST_URL` to the exact reader origin and manifest URL for the environment. For a staging preview, use only the staging origin. Do not add a wildcard. The dashboard is served from the Worker origin, so its same-origin login does not need a cross-origin cookie exception.

3. Set three distinct secrets; do not put any of them in this repository or in the static dashboard:

   ```sh
   npx wrangler secret put ADMIN_PASSWORD
   npx wrangler secret put ADMIN_SESSION_SECRET
   npx wrangler secret put RATE_LIMIT_SECRET
   ```

4. Deploy the Worker, then set the returned Worker origin in the public reader configuration:

   - `ai-ecosystem-2026/reader-config.js`: `window.READER_CONFIG.analyticsEndpoint`
   The Worker serves the authenticated dashboard itself from its root (`https://your-worker.example/`), including its CSS and JavaScript assets. This keeps the `SameSite=Strict` administrator cookie same-origin. The checked-in static copy remains useful for development or for an intentionally configured same-site custom-host deployment, but should not be used with a `workers.dev` cross-site cookie flow.

5. Validate before public release:

   ```sh
   curl -i -X POST "$WORKER/v1/events" -H 'content-type: application/json' --data '{"events":[]}'
   curl -i "$WORKER/admin/dashboard"
   ```

   The first should be a validation failure and the second `401` without a signed session. Send a test event with an ID from the deployed manifest, then repeat the exact batch: only the first insert should affect the dashboard. Remove isolated QA data before launch or use a separate staging D1 database.

## Dashboard metrics

- **Sessions:** distinct anonymous tab session IDs with accepted events in the selected period.
- **Engaged sessions:** sessions with at least 30 seconds of accepted, bounded block-visible-time deltas.
- **Section reach:** distinct sessions with an accepted block impression in that section.
- **Median visible time:** for each section, the median of session-level visible-time totals. It is an estimate of active visibility, not proof of reading and not a claim that concurrently visible blocks can be summed as reading time.
- **Last observed section:** the latest section recorded before a delivered page-hide beacon; it is an estimate, not a precise exit event.

`npm test` covers the core ID, duration, session, median, and filter semantics. Use `npx wrangler dev --local` with local secrets for end-to-end D1 testing; that is the appropriate place to submit deliberate duplicate/oversized/disallowed-origin test requests before deployment.
