# The AI Ecosystem in Armenia web edition

The PDF opens in a full-window reader with a fixed toolbar and continuous, lazy-rendered pages. Scrolling loads the next pages; page navigation preserves all page positions and evicts distant canvases. Fit-width is the default on phones.

Executive-summary cards, infrastructure cards and education-program rows now render directly from the complete Markdown table cells. Education uses the PDF builder's admissions parser and scales pie area to the applicant pool; descriptions, admission caveats and citations remain visible. Do not substitute shortened hand-maintained program lists. `tools/test_visual_content.py` checks these cells and links survive conversion.

`tools/build_reader.py` is the only content pipeline for this static reader. It accepts the current report-materials directory and publishes an explicit allowlist of nine report chapters plus nine approved report photographs. It never recursively copies the fundraising repository.

From WSL, rebuild the checked-in public snapshot with:

```sh
cd '/mnt/c/Users/hrant/.codex/worktrees/a3ce/YerevaNN website'
python3 ai-ecosystem-2026/tools/build_reader.py \
  --source '/home/hrant/YerevaNN-fundraising/materials/ai-ecosystem-armenia' \
  --output ai-ecosystem-2026 --base-path /ai-ecosystem-2026 \
  --pdf '/home/hrant/YerevaNN-fundraising/output/pdf/DRAFT-The-AI-Ecosystem-in-Armenia.pdf'
```

The generated `content-manifest.json` separates the report version (`August-2026`) from the build timestamp, records source hashes, and defines every chapter, heading, and tracked semantic block. The build fails on missing approved assets or local/non-public Markdown links.

The public reader remains fully usable when analytics is unavailable. To enable analytics, set `window.READER_CONFIG.analyticsEndpoint` in [`reader-config.js`](reader-config.js) to the deployed Cloudflare Worker origin, for example `https://report-analytics.example.workers.dev`. That deployment setting is deliberately outside the generated page, so a report refresh cannot erase it. Deploy the Worker in [`analytics-worker`](analytics-worker/README.md) first; it validates event IDs against this manifest.

Measurement: a session is an anonymous browser-tab session, not a verified person. A block impression needs two continuous seconds of meaningful visibility in an active tab. Visible time pauses when the tab is hidden, the block is not visible, or the reader is idle for 60 seconds. Metrics are estimates, and blocked requests, crashes, and beacons that do not arrive create undercounts. Raw events are retained for 90 days; aggregated counts are retained longer.

The reader keeps at most 128 unsent events in tab-scoped storage and retries a failed batch at most four times with the original event IDs. Events leave the queue only after the Worker acknowledges the whole batch. A page-hide beacon is best-effort and cannot prove server acceptance, so its events remain available for an idempotent retry if the same tab resumes; events beyond the bounded queue or retry limit may be lost rather than creating a permanent offline log.
