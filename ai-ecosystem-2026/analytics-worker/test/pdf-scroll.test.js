import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function harness(){
 const elements=new Map();let loads=0;
 class Element{
  constructor(name=''){this.name=name;this.dataset={};this.attrs={};this.children=[];this.style={setProperty(){}};this.classList={add(){},remove(){}};this.handlers={};this.scrollTop=0;this.clientWidth=390;this.hidden=false;this.value='fit';}
  addEventListener(n,f){this.handlers[n]=f;} append(...items){for(const i of items){i.parent=this;this.children.push(i);}} replaceChildren(...items){this.children=[];this.append(...items);}
  setAttribute(k,v){this.attrs[k]=v;} removeAttribute(k){delete this.attrs[k];} focus(){document.activeElement=this;} getContext(){return {};}
  querySelectorAll(selector){return this.children.flatMap(c=>[...(selector==='canvas'&&c.name==='canvas'?[c]:[]),...c.querySelectorAll(selector)]);}
  getBoundingClientRect(){if(this.name==='#pdf-viewer')return{top:100,bottom:700,left:0,right:390,width:390,height:600};if(this.dataset.page){const i=this.parent.children.indexOf(this),height=parseFloat(this.style.height),width=parseFloat(this.style.width),top=116-this.parent.scrollTop+this.parent.children.slice(0,i).reduce((s,c)=>s+parseFloat(c.style.height)+16,0);return{top,bottom:top+height,left:16,right:16+width,width,height};}return{top:0,bottom:0,left:0,right:0,width:0,height:0};}
 }
 const get=k=>elements.get(k)||(elements.set(k,new Element(k)),elements.get(k));
 const document={body:new Element('body'),activeElement:null,querySelector:get,createElement:n=>new Element(n)};
 const page={getViewport:({scale})=>({width:600*scale,height:840*scale,convertToViewportRectangle:r=>r}),render:()=>({promise:Promise.resolve(),cancel(){}}),streamTextContent:()=>({}),getAnnotations:async()=>[]};
 const bundle={lib:{TextLayer:class{async render(){}}},doc:{numPages:78,getPage:async()=>page}};
 const window={scrollY:123,scrollTo(){},addEventListener(){}};
 const context=vm.createContext({window,document,Math,Promise,devicePixelRatio:2,setTimeout,clearTimeout,requestAnimationFrame:f=>{f();return 1;},cancelAnimationFrame(){}});
 vm.runInContext(fs.readFileSync(new URL('../../pdf-viewer.js',import.meta.url),'utf8'),context);
 const viewer=window.createReportPdfViewer({config:{pdfLoader:async()=>{loads++;return bundle;}},onMode(){},onVisibility(){},onLink(){}});
 return{viewer,elements,loads:()=>loads,settle:async()=>{for(let i=0;i<80;i++)await Promise.resolve();}};
}
test('scrolling past first three pages loads following pages with bounded canvases',async()=>{
 const h=harness();await h.viewer.open();await h.settle();const scroll=h.elements.get('#pdf-viewer');assert.equal(scroll.children.length,78);
 scroll.scrollTop=5000;scroll.handlers.scroll();await h.settle();assert.ok(h.viewer.state().page>3);assert.ok(h.viewer.state().rendered<=4);assert.equal(h.elements.get('#pdf-next').disabled,false);
});
test('next, zoom, last page, close and reopen preserve slots and cached document',async()=>{
 const h=harness();await h.viewer.open();await h.settle();const first=h.elements.get('#pdf-viewer').children[0];
 await h.viewer.goTo(2);await h.settle();assert.equal(h.viewer.state().page,2);assert.equal(h.elements.get('#pdf-viewer').children[0],first);
 await h.viewer.setZoom(1.5);await h.settle();assert.equal(h.viewer.state().page,2);
 await h.viewer.goTo(78);await h.settle();assert.equal(h.viewer.state().page,78);assert.equal(h.elements.get('#pdf-next').disabled,true);
 h.viewer.close();await h.viewer.open();await h.settle();assert.equal(h.loads(),1);assert.equal(h.viewer.state().page,78);
});
