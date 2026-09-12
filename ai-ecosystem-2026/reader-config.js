// Deployment configuration. This file is intentionally not overwritten by the
// report rebuild, so a content refresh cannot silently disable analytics.
// Set this to the dedicated deployed Worker origin only after staging is ready.
window.READER_CONFIG = {
  analyticsEndpoint: ""
};

// The checked-in preview is intentionally isolated from production. The local
// Worker only accepts the local static-reader origin configured in its dev run.
if (["127.0.0.1", "localhost"].includes(location.hostname)) {
  window.READER_CONFIG.analyticsEndpoint = "http://127.0.0.1:8788";
}

if (["yerevann.com", "www.yerevann.com"].includes(location.hostname)) {
  window.READER_CONFIG.analyticsEndpoint = "https://yerevann-ai-ecosystem-analytics.aidiffusion.workers.dev";
}

if (location.hostname === "yerevann-ai-ecosystem-staging.pages.dev") {
  window.READER_CONFIG.analyticsEndpoint = "https://yerevann-ai-ecosystem-analytics-staging.aidiffusion.workers.dev";
}
