/* Continuous, virtualized PDF reading. Page positions survive canvas eviction. */
window.createReportPdfViewer = function ({config, onMode, onVisibility, onLink}) {
  const panel = document.querySelector('#pdf-panel');
  const scroller = document.querySelector('#pdf-viewer');
  const label = document.querySelector('#pdf-page');
  const error = document.querySelector('#pdf-error');
  const prev = document.querySelector('#pdf-prev'), next = document.querySelector('#pdf-next');
  const zoom = document.querySelector('#pdf-zoom');
  let bundle, loading, opened = false, current = 1, generation = 0, running = false;
  let savedScroll = 0, opener, resizeTimer;
  const pages = [], wanted = new Set();
  let renderTask;
  async function load() {
    if (bundle) return bundle;
    if (!loading) loading = (config.pdfLoader ? config.pdfLoader() : import('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs').then(async lib => {
      lib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs';
      return {lib, doc: await lib.getDocument('AI-Ecosystem-in-Armenia-August-2026.pdf').promise};
    })).catch(e => { loading = null; throw e; });
    bundle = await loading;
    return bundle;
  }
  function controls() {
    label.textContent = bundle ? `Page ${current} of ${bundle.doc.numPages}` : 'Loading PDF…';
    prev.disabled = current <= 1; next.disabled = !bundle || current >= bundle.doc.numPages;
  }
  function pageScale(record) {
    const fit = Math.max(120, scroller.clientWidth - 32) / record.base.width;
    return zoom.value === 'fit' ? Math.min(fit, 1.6) : Number(zoom.value);
  }
  function layout() {
    for (const record of pages) {
      record.scale = pageScale(record);
      record.el.style.width = `${record.base.width * record.scale}px`;
      record.el.style.height = `${record.base.height * record.scale}px`;
      record.el.style.setProperty('--scale-factor', record.scale);
    }
  }
  async function render(record, epoch) {
    const p = await bundle.doc.getPage(record.number);
    if (!opened || epoch !== generation) return;
    const viewport = p.getViewport({scale:record.scale});
    const layer = document.createElement('div'); layer.className = 'pdf-page-content';
    const canvas = document.createElement('canvas'); canvas.className = 'pdf-page-canvas';
    const pixelRatio = Math.min(devicePixelRatio || 1, 2, Math.sqrt(4_000_000 / (viewport.width * viewport.height)));
    canvas.width = Math.ceil(viewport.width * pixelRatio); canvas.height = Math.ceil(viewport.height * pixelRatio);
    canvas.style.width = `${viewport.width}px`; canvas.style.height = `${viewport.height}px`;
    layer.append(canvas);
    renderTask = p.render({canvasContext:canvas.getContext('2d'), viewport, transform:[pixelRatio,0,0,pixelRatio,0,0]});
    await renderTask.promise; renderTask = null;
    if (!opened || epoch !== generation) { canvas.width = canvas.height = 0; return; }
    const text = document.createElement('div'); text.className = 'textLayer'; layer.append(text);
    const textTask = new bundle.lib.TextLayer({textContentSource:p.streamTextContent(),container:text,viewport});
    await textTask.render();
    const links = document.createElement('div'); links.className = 'linkLayer'; layer.append(links);
    for (const annotation of await p.getAnnotations()) {
      if (!annotation.rect || (!annotation.url && !annotation.dest)) continue;
      const rect = viewport.convertToViewportRectangle(annotation.rect);
      const a = document.createElement('a');
      Object.assign(a.style,{left:`${Math.min(rect[0],rect[2])}px`,top:`${Math.min(rect[1],rect[3])}px`,width:`${Math.abs(rect[2]-rect[0])}px`,height:`${Math.abs(rect[3]-rect[1])}px`});
      if (annotation.url) {
        if (!/^https?:|^mailto:/i.test(annotation.url)) continue;
        a.href = annotation.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
        a.setAttribute('aria-label', `Open reference: ${annotation.url}`);
        a.addEventListener('click', () => onLink(record.number, annotation.url));
      } else {
        a.href = '#'; a.setAttribute('aria-label','Go to referenced page');
        a.addEventListener('click', async e => {
          e.preventDefault();
          const dest = typeof annotation.dest === 'string' ? await bundle.doc.getDestination(annotation.dest) : annotation.dest;
          if (dest) await goTo(typeof dest[0] === 'number' ? dest[0]+1 : (await bundle.doc.getPageIndex(dest[0]))+1);
        });
      }
      links.append(a);
    }
    if (!opened || epoch !== generation) {canvas.width=canvas.height=0;return;}
    record.el.replaceChildren(layer); record.rendered = true;
    record.el.setAttribute('aria-busy','false');
  }
  function evict(record) {
    record.el.querySelectorAll('canvas').forEach(c=>{c.width=0;c.height=0;});
    record.el.replaceChildren(); record.rendered=false; record.el.setAttribute('aria-busy','true');
  }
  async function pump() {
    if (running || !opened) return;
    running = true;
    try {
      while (opened) {
        const record = pages.filter(p=>wanted.has(p.number) && !p.rendered && p.failed !== generation).sort((a,b)=>Math.abs(a.number-current)-Math.abs(b.number-current))[0];
        if (!record) break;
        const epoch=generation;
        try { await render(record,epoch); }
        catch(e) { if(e.name !== 'RenderingCancelledException') {record.failed=epoch; error.hidden=false;} }
      }
    } finally { running=false; }
  }
  function measure() {
    if (!opened || !pages.length) return;
    const root=scroller.getBoundingClientRect();
    let best=0, selected=current;
    const visible=[];
    for(const record of pages) {
      const rect=record.el.getBoundingClientRect();
      const height=Math.max(0,Math.min(rect.bottom,root.bottom)-Math.max(rect.top,root.top));
      const width=Math.max(0,Math.min(rect.right,root.right)-Math.max(rect.left,root.left));
      const area=height*width;
      if(area>best){best=area;selected=record.number;}
      const qualifies=height>=Math.min(rect.height,root.height)*.5 && width>=Math.min(rect.width,root.width)*.5;
      onVisibility(record.number,qualifies);
      if(area>0) visible.push(record.number);
    }
    current=selected; controls(); wanted.clear();
    for(const n of visible) for(let k=Math.max(1,n-1);k<=Math.min(pages.length,n+1);k++)wanted.add(k);
    for(const record of pages)if(record.rendered && !wanted.has(record.number))evict(record);
    pump();
  }
  let frame;
  scroller.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(measure);},{passive:true});
  async function initialize() {
    if(pages.length)return;
    const first=await bundle.doc.getPage(1), base=first.getViewport({scale:1});
    for(let number=1;number<=bundle.doc.numPages;number++) {
      const el=document.createElement('div'); el.className='pdf-page-wrap';el.dataset.page=number;
      el.setAttribute('role','region');el.setAttribute('aria-label',`PDF page ${number}`);el.setAttribute('aria-busy','true');
      scroller.append(el);pages.push({number,el,base,rendered:false});
    }
    layout();
  }
  async function goTo(number) {
    if(!bundle)return;
    current=Math.max(1,Math.min(number,pages.length));
    const target=pages[current-1].el;
    scroller.scrollTop += target.getBoundingClientRect().top-scroller.getBoundingClientRect().top-16;
    controls();measure();
  }
  async function open() {
    opener=document.activeElement;savedScroll=window.scrollY;opened=true;
    panel.hidden=false;document.body.classList.add('pdf-open');
    document.querySelector('.reader-shell').setAttribute('inert','');
    document.querySelector('.site-header').setAttribute('inert','');
    onMode(true);document.querySelector('#pdf-close').focus();controls();
    try { await load();await initialize();error.hidden=true;await goTo(current); }
    catch(e){error.hidden=false;label.textContent='PDF unavailable';}
  }
  function close() {
    generation++;opened=false;renderTask?.cancel();panel.hidden=true;
    document.body.classList.remove('pdf-open');
    document.querySelector('.reader-shell').removeAttribute('inert');document.querySelector('.site-header').removeAttribute('inert');
    for(const record of pages){onVisibility(record.number,false);evict(record);}
    onMode(false);window.scrollTo({top:savedScroll,behavior:'instant'});opener?.focus({preventScroll:true});
  }
  async function resize() {
    if(!opened)return;generation++;renderTask?.cancel();
    for(const record of pages)evict(record);layout();await goTo(current);
  }
  document.querySelector('#pdf-toggle').addEventListener('click',open);
  document.querySelector('#pdf-close').addEventListener('click',close);
  prev.addEventListener('click',()=>goTo(current-1));next.addEventListener('click',()=>goTo(current+1));
  zoom.addEventListener('change',resize);
  window.addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(resize,150);});
  panel.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();close();}
    if(e.key==='Tab'){
      const controls=[...panel.querySelectorAll('button:not(:disabled),select,a[href]')];
      if(e.shiftKey&&document.activeElement===controls[0]){e.preventDefault();controls.at(-1)?.focus();}
      else if(!e.shiftKey&&document.activeElement===controls.at(-1)){e.preventDefault();controls[0]?.focus();}
    }
  });
  return {open,close,goTo,setZoom:async value=>{zoom.value=String(value);await resize();},state:()=>({page:current,bundle:Boolean(bundle),pages:pages.length,rendered:pages.filter(p=>p.rendered).length})};
};
