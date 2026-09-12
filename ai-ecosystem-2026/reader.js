(() => {
  const config = window.READER_CONFIG || {}, endpoint = (config.analyticsEndpoint || "").replace(/\/$/, "");
  const reportVersion = config.reportVersion || "August-2026", sessionKey = "yerevann-ai-ecosystem-session", queueKey = "yerevann-ai-ecosystem-events";
  const sid = sessionStorage.getItem(sessionKey) || crypto.randomUUID(); sessionStorage.setItem(sessionKey, sid);
  const device = innerWidth < 700 ? "mobile" : innerWidth < 1024 ? "tablet" : "desktop";
  const campaign = Object.fromEntries(["utm_source","utm_medium","utm_campaign"].map(k => [k, new URLSearchParams(location.search).get(k)]).filter(([,v]) => v && v.length <= 80));
  const referrerHost = (() => { try { return document.referrer ? new URL(document.referrer).hostname.slice(0, 200) : ""; } catch { return ""; } })();
  const maxQueue = 128, maxAttempts = 4, heartbeat = 25_000, idleAfter = 60_000;
  let queued = (() => { try { const value = JSON.parse(sessionStorage.getItem(queueKey) || "[]"); return Array.isArray(value) ? value.slice(-maxQueue) : []; } catch { return []; } })();
  let lastActivity = Date.now(), lastTick = Date.now(), lastFlush = 0, lastSection = "", pdfMode = false, flushing = false;
  const blocks = new Map(), pdfPages = new Map(), sectionDeltas = new Map(), pageDeltas = new Map();
  let sessionDelta = 0;
  const saveQueue = () => { try { sessionStorage.setItem(queueKey, JSON.stringify(queued)); } catch {} };
  const add = (event_type, extra = {}) => { queued.push({event_id: crypto.randomUUID(), event_type, report_version: reportVersion, session_id: sid, device, referrer_host: referrerHost, campaign, occurred_at: Date.now(), attempts: 0, ...extra}); if (queued.length > maxQueue) queued = queued.slice(-maxQueue); saveQueue(); };
  const active = () => !document.hidden && Date.now() - lastActivity <= idleAfter;
  const resetQualification = () => { const now = Date.now(); for (const state of blocks.values()) state.qualifiedAt = state.visible && active() ? now : 0; for (const state of pdfPages.values()) state.qualifiedAt = state.visible && pdfMode && active() ? now : 0; };
  const activity = () => { const wasIdle = Date.now() - lastActivity > idleAfter; lastActivity = Date.now(); if (wasIdle) resetQualification(); };
  ["pointerdown","keydown","scroll","touchstart"].forEach(name => addEventListener(name, activity, {passive:true}));

  async function flush(urgent = false) {
    if (!endpoint || !queued.length || flushing) return;
    flushing = true;
    // Beacon gives no server acknowledgement. Keep its IDs in sessionStorage so
    // a resumed tab can retry idempotently; fetch removes only accepted batches.
    while (queued.length) {
      const batch = queued.slice(0, 32);
      if (urgent && navigator.sendBeacon) { try { navigator.sendBeacon(`${endpoint}/v1/events`, new Blob([JSON.stringify({events: batch})], {type:"application/json"})); } catch {} }
      try {
      const response = await fetch(`${endpoint}/v1/events`, {method:"POST", credentials:"omit", keepalive:urgent, headers:{"content-type":"application/json"}, body:JSON.stringify({events:batch})});
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const accepted = await response.json().catch(() => ({}));
      if (accepted.accepted !== batch.length) throw new Error("partial acknowledgement");
        const ids = new Set(batch.map(e => e.event_id)); queued = queued.filter(e => !ids.has(e.event_id)); saveQueue();
      } catch { const ids = new Set(batch.map(e => e.event_id)); queued = window.ReaderTrackerCore.retryQueue(queued, ids, maxAttempts); saveQueue(); break; }
    }
    flushing = false;
  }
  function sectionFor(el) { return el.closest(".chapter")?.dataset.chapterId || ""; }
  const requiredRatio = rect => window.ReaderTrackerCore.requiredRatio(rect, innerHeight);
  function tick(force = false) {
    const now = Date.now(), delta = Math.max(0, now - lastTick); lastTick = now;
    const isActive = active(), sections = new Set();
    for (const [el, state] of blocks) {
      if (state.visible && isActive) { sections.add(sectionFor(el)); if (!state.qualifiedAt) state.qualifiedAt = now; if (!state.impressed && now - state.qualifiedAt >= 2000) { state.impressed = true; add("block_impression", {block_id:el.dataset.blockId, section_id:sectionFor(el)}); } }
      else state.qualifiedAt = 0;
    }
    // Accumulate interval unions; one bounded event per heartbeat prevents a
    // healthy reader from outpacing its own batch drain rate.
    const pdfVisible = pdfMode && [...pdfPages.values()].some(state => state.visible);
    if (isActive && (sections.size || pdfVisible) && delta) { sessionDelta += delta; for (const section_id of sections) sectionDeltas.set(section_id, (sectionDeltas.get(section_id) || 0) + delta); for (const [el,state] of blocks) if (state.visible) state.delta=(state.delta||0)+delta; }
    for (const [page, state] of pdfPages) {
      if (state.visible && isActive && pdfMode) { if (!state.qualifiedAt) state.qualifiedAt = now; if (!state.impressed && now-state.qualifiedAt >= 2000) { state.impressed=true; add("pdf_page_impression", {page_number:page}); } if (delta) pageDeltas.set(page,(pageDeltas.get(page)||0)+delta); }
      else state.qualifiedAt = 0;
    }
    if (force || now-lastFlush >= heartbeat) { if(sessionDelta){add("session_active_time",{visible_ms:Math.min(sessionDelta,30_000)});sessionDelta=0;} for(const [section_id,visible_ms] of sectionDeltas){add("section_active_time",{section_id,visible_ms:Math.min(visible_ms,30_000)});}sectionDeltas.clear();for(const [el,state] of blocks)if(state.delta){add("block_time",{block_id:el.dataset.blockId,section_id:sectionFor(el),visible_ms:Math.min(state.delta,30_000)});state.delta=0;}for(const [page_number,visible_ms] of pageDeltas){add("pdf_page_time",{page_number,visible_ms:Math.min(visible_ms,30_000)});}pageDeltas.clear();lastFlush=now;flush(force); }
  }
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    const state = blocks.get(entry.target) || {visible:false,qualifiedAt:0,impressed:false};
    const visible = entry.isIntersecting && entry.intersectionRatio >= requiredRatio(entry.boundingClientRect);
    state.qualifiedAt=window.ReaderTrackerCore.qualificationStart({wasVisible:state.visible,visible,wasActive:active(),active:active(),qualifiedAt:state.qualifiedAt},Date.now());
    state.visible=visible; blocks.set(entry.target,state);
  }), {threshold:[0,.05,.1,.15,.2,.25,.3,.35,.4,.45,.5,.6,.75,1]});
  document.querySelectorAll(".reading-block").forEach(el => observer.observe(el));
  setInterval(() => tick(), 500);
  document.addEventListener("visibilitychange", () => { if (document.hidden) { tick(true); resetQualification(); } else { lastTick=Date.now(); resetQualification(); } });
  addEventListener("pagehide", () => { tick(true); if (lastSection) add("last_section", {section_id:lastSection}); flush(true); });

  const sectionObserver = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) lastSection=e.target.dataset.sectionId || sectionFor(e.target); }), {rootMargin:"-15% 0px -65%"});
  document.querySelectorAll(".section-heading").forEach(el => sectionObserver.observe(el));
  document.querySelectorAll("[data-external-link]").forEach(el => el.addEventListener("click", () => { let destination=""; try { const u=new URL(el.href); destination=(u.hostname+u.pathname).slice(0,180); } catch {} add("external_click", {block_id:el.closest("[data-block-id]")?.dataset.blockId || "", section_id:sectionFor(el), destination}); }));
  document.addEventListener("click", event => { const el=event.target.closest(".linkLayer a[data-external-link]"); if (!el) return; let destination=""; try { const u=new URL(el.href); destination=(u.hostname+u.pathname).slice(0,180); } catch {} add("external_click", {page_number:Number(el.closest(".pdf-page-wrap")?.dataset.page || 0), destination}); });
  const contents=document.querySelector(".contents"), contentsToggle=document.querySelector("#contents-toggle");
  contentsToggle.addEventListener("click",()=>{const open=contents.classList.toggle("is-open");contentsToggle.setAttribute("aria-expanded",String(open));});
  document.querySelectorAll(".contents nav a").forEach(el=>el.addEventListener("click",()=>{add("contents_nav",{section_id:el.getAttribute("href").slice(1)});contents.classList.remove("is-open");contentsToggle.setAttribute("aria-expanded","false");}));

  let pdf, pdfBundle, page=1, scale=1, pdfLoading, renderEpoch=0, renderTasks=[];
  const panel=document.querySelector("#pdf-panel"),viewer=document.querySelector("#pdf-viewer"),pageLabel=document.querySelector("#pdf-page"),error=document.querySelector("#pdf-error");
  const pdfObserver=new IntersectionObserver(entries=>entries.forEach(e=>{const p=Number(e.target.dataset.page);const state=pdfPages.get(p)||{visible:false,qualifiedAt:0,impressed:false};const visible=e.isIntersecting && e.intersectionRatio>=requiredRatio(e.boundingClientRect);if(state.visible&&!visible)state.qualifiedAt=0;if(!state.visible&&visible)state.qualifiedAt=pdfMode&&active()?Date.now():0;state.visible=visible;pdfPages.set(p,state);}),{threshold:[0,.05,.1,.15,.2,.25,.3,.35,.4,.45,.5,.6,.75,1]});
  async function loadPdf(){if(pdfBundle)return pdfBundle;pdfLoading ||= (config.pdfLoader?config.pdfLoader():import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs").then(async lib=>{lib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";return {lib,doc:await lib.getDocument("AI-Ecosystem-in-Armenia-August-2026.pdf").promise};}));pdfBundle=await pdfLoading;return pdfBundle;}
  async function layers(lib,pdfPage,viewport,wrap){const textLayer=document.createElement("div");textLayer.className="textLayer";textLayer.style.width=`${viewport.width}px`;textLayer.style.height=`${viewport.height}px`;wrap.append(textLayer);const layer=new lib.TextLayer({textContentSource:pdfPage.streamTextContent(),container:textLayer,viewport});await layer.render();const links=document.createElement("div");links.className="linkLayer";for(const a of await pdfPage.getAnnotations()){if(!a.url||!a.rect)continue;const [x1,y1,x2,y2]=viewport.convertToViewportRectangle(a.rect);const link=document.createElement("a");link.href=a.url;link.target="_blank";link.rel="noopener noreferrer";link.dataset.externalLink="";link.style.left=`${Math.min(x1,x2)}px`;link.style.top=`${Math.min(y1,y2)}px`;link.style.width=`${Math.abs(x2-x1)}px`;link.style.height=`${Math.abs(y2-y1)}px`;links.append(link);}wrap.append(links);}
  async function renderPdf(){const epoch=++renderEpoch;for(const task of renderTasks)task.cancel();renderTasks=[];try{const loaded=await loadPdf();if(epoch!==renderEpoch)return;pdf=loaded.doc;page=Math.max(1,Math.min(page,pdf.numPages));viewer.replaceChildren();pdfPages.clear();for(const number of [page-1,page,page+1].filter(n=>n>=1&&n<=pdf.numPages)){const p=await pdf.getPage(number);if(epoch!==renderEpoch)return;const viewport=p.getViewport({scale}),wrap=document.createElement("div");wrap.className="pdf-page-wrap";wrap.dataset.page=number;const canvas=document.createElement("canvas");canvas.className="pdf-page-canvas";canvas.width=viewport.width;canvas.height=viewport.height;wrap.append(canvas);viewer.append(wrap);pdfObserver.observe(wrap);const task=p.render({canvasContext:canvas.getContext("2d"),viewport});renderTasks.push(task);await task.promise;if(epoch!==renderEpoch)return;await layers(loaded.lib,p,viewport,wrap);if(epoch!==renderEpoch)return;}viewer.querySelector(`[data-page="${page}"]`)?.scrollIntoView({block:"start"});pageLabel.textContent=`Page ${page} of ${pdf.numPages}`;error.hidden=true;}catch(e){if(e?.name!=="RenderingCancelledException"){error.hidden=false;pageLabel.textContent="PDF unavailable";}}}
  const openPdf=async()=>{pdfMode=true;panel.hidden=false;add("reader_mode",{mode:"pdf"});await renderPdf();};
  const changePdfPage=async delta=>{page+=delta;await renderPdf();};
  if(config.testHooks) config.testHooks({tick,flush,emit:add,openPdf,changePdfPage,setZoom:async value=>{scale=value;await renderPdf();},closePdf:()=>{pdfMode=false;pdfPages.clear();},queue:()=>queued.map(e=>({...e})),pdfState:()=>({page,scale,bundle:Boolean(pdfBundle)})});
  document.querySelector("#pdf-toggle").addEventListener("click",async()=>{pdfMode=true;panel.hidden=false;panel.scrollIntoView();add("reader_mode",{mode:"pdf"});await renderPdf();});document.querySelector("#pdf-close").addEventListener("click",()=>{pdfMode=false;panel.hidden=true;pdfPages.clear();add("reader_mode",{mode:"html"});});document.querySelector("#pdf-prev").addEventListener("click",()=>{page--;renderPdf();});document.querySelector("#pdf-next").addEventListener("click",()=>{page++;renderPdf();});document.querySelector("#pdf-zoom").addEventListener("change",e=>{scale=Number(e.target.value);renderPdf();});
  add("session_start",{mode:"html"}); if(!config.testHooks) flush();
})();
