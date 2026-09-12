import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

class Element {
  constructor() { this.dataset={}; this.style={}; this.classList={toggle:()=>false,remove:()=>{}}; this.hidden=false; this.textContent=""; }
  addEventListener() {} append() {} appendChild() {} replaceChildren() {} scrollIntoView() {} setAttribute() {} getAttribute(){return "#chapter-01";} closest(){return null;} querySelector(){return new Element();} getContext(){return {};}
}
function readerHarness({endpoint="", fail=false}={}) {
  let counter=0, hooks, pageCalls=0, textLayers=0; const sent=[]; const store=new Map(), elements=new Map();
  const get = key => elements.get(key) || (elements.set(key,new Element()),elements.get(key));
  const page = {getViewport:({scale})=>({width:100*scale,height:200*scale,convertToViewportRectangle:r=>r}),render:()=>({promise:Promise.resolve(),cancel(){}}),streamTextContent:()=>({}),getAnnotations:async()=>[]};
  const bundle={lib:{TextLayer:class{constructor(){textLayers++;} async render(){}}},doc:{numPages:3,getPage:async()=>{pageCalls++;return page;}}};
  const context=vm.createContext({URL,URLSearchParams,Blob,Promise,JSON,Math,Date,TextEncoder,location:{search:""},window:{READER_CONFIG:{analyticsEndpoint:endpoint,testHooks:h=>hooks=h,pdfLoader:async()=>bundle}},document:{hidden:false,referrer:"",querySelector:get,querySelectorAll:()=>[],createElement:()=>new Element(),addEventListener(){}},sessionStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},crypto:{randomUUID:()=>`00000000-0000-4000-8000-${String(++counter).padStart(12,"0")}`},innerWidth:390,innerHeight:700,navigator:{sendBeacon:()=>true},IntersectionObserver:class{constructor(){}observe(){}},addEventListener(){},setInterval(){},fetch:async(_url,opts)=>{sent.push(JSON.parse(opts.body).events);if(fail)throw new Error("offline");return {ok:true,json:async()=>({accepted:JSON.parse(opts.body).events.length})};}});
  vm.runInContext(fs.readFileSync(new URL("../../tracking-core.js",import.meta.url),"utf8"),context); vm.runInContext("window.ReaderTrackerCore=globalThis.ReaderTrackerCore",context); context.window.createReportPdfViewer=()=>({open(){},close(){},goTo(){},setZoom(){},state:()=>({page:1})}); vm.runInContext(fs.readFileSync(new URL("../../reader.js",import.meta.url),"utf8"),context);
  return {hooks,sent,stats:()=>({pageCalls,textLayers})};
}
test("actual reader orchestration drains more than 32 events in acknowledged batches", async()=>{
  const h=readerHarness({endpoint:"https://analytics.test"}); await Promise.resolve(); for(let i=0;i<100;i++)h.hooks.emit("contents_nav",{section_id:"01"}); await h.hooks.flush();
  assert.ok(h.sent.length>=4); assert.ok(h.sent.every(batch=>batch.length<=32)); assert.equal(h.hooks.queue().length,0);
});
test("actual reader orchestration keeps failed event ids for retry", async()=>{
  const h=readerHarness({endpoint:"https://analytics.test",fail:true}); await Promise.resolve(); h.hooks.emit("contents_nav",{section_id:"01"}); const before=h.hooks.queue().at(-1).event_id; await h.hooks.flush(); const retried=h.hooks.queue().find(e=>e.event_id===before); assert.equal(retried.event_id,before); assert.equal(retried.attempts,1);
});
