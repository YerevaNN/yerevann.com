import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const context = vm.createContext({globalThis:{}});
vm.runInContext(fs.readFileSync(new URL("../../tracking-core.js", import.meta.url), "utf8"), context);
const core = context.globalThis.ReaderTrackerCore;
test("tall blocks use a viewport-relative threshold", () => {
  assert.equal(core.requiredRatio({height:400}, 800), .5);
  assert.equal(core.requiredRatio({height:4000}, 800), .1);
});
test("hidden or idle periods reset the continuous two-second qualification", () => {
  assert.equal(core.qualificationStart({wasVisible:true,visible:true,wasActive:true,active:false,qualifiedAt:100}, 1500), 0);
  assert.equal(core.qualificationStart({wasVisible:true,visible:true,wasActive:false,active:true,qualifiedAt:0}, 1600), 1600);
});
test("failed delivery preserves ids and bounded retries", () => {
  const queue=[{event_id:"a",attempts:0},{event_id:"b",attempts:3}];
  const next=core.retryQueue(queue,new Set(["a","b"]),4);
  assert.deepEqual(JSON.parse(JSON.stringify(next)),[{event_id:"a",attempts:1}]);
});
