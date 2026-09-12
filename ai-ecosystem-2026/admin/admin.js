(() => {
  const endpoint = (window.ANALYTICS_ADMIN_ENDPOINT || "").replace(/\/$/, "");
  const $ = selector => document.querySelector(selector);
  const escape = value => String(value ?? "").replace(/[&<>\"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  let latest;
  // The report revision is generated from the source hashes. Keep it an
  // explicit dashboard filter without exposing session-level records.
  const versionLabel = document.createElement("label");
  versionLabel.textContent = "Report version ";
  const versionInput = document.createElement("input");
  versionInput.name = "version";
  versionInput.maxLength = 80;
  versionInput.placeholder = "All versions";
  versionLabel.append(versionInput);
  document.querySelector("#filters").insertBefore(versionLabel, document.querySelector("#filters label:nth-child(3)"));
  const pdfCard = document.createElement("div");
  pdfCard.className = "card";
  pdfCard.innerHTML = "<h2>Original-layout PDF pages</h2><ul id=\"pdf-pages\"></ul>";
  document.querySelector(".split").append(pdfCard);
  const blockCard = document.createElement("section");
  blockCard.className = "card";
  blockCard.innerHTML = "<h2>Block detail</h2><p>Top individual report blocks by impressions and estimated visible time.</p><ul id=\"block-detail\"></ul>";
  document.querySelector("#dashboard").append(blockCard);
  const query = () => new URLSearchParams(new FormData($("#filters"))).toString();
  async function request(path, options = {}) { const response = await fetch(`${endpoint}${path}`, {credentials:"include", ...options, headers:{"content-type":"application/json", ...(options.headers || {})}}); const body = await response.json().catch(() => ({})); if (!response.ok) throw Object.assign(new Error(body.error || "Request failed"), {status: response.status}); return body; }
  function list(target, rows, key, label) { $(target).innerHTML = rows.length ? rows.map(row => `<li><strong>${escape(row[key] || "Unspecified")}</strong>: ${escape(row[label])}</li>`).join("") : "<li>No data in this range.</li>"; }
  function render(data) { latest = data; $("#metrics").innerHTML = [["Sessions",data.totals.sessions],["Engaged sessions",data.totals.engaged_sessions],["Block-reached sessions",data.totals.reached],["Accepted events",data.totals.events]].map(([label,value]) => `<article class="metric"><strong>${Number(value || 0).toLocaleString()}</strong><span>${label}</span></article>`).join(""); $("#sections").innerHTML = data.sections.length ? data.sections.map(row => `<tr><td>${escape(row.section_id || "Unspecified")}</td><td>${Number(row.sessions).toLocaleString()}</td><td>${Number(row.impressions).toLocaleString()}</td><td>${Math.round(row.median_visible_ms/1000)} sec</td></tr>`).join("") : "<tr><td colspan=4>No accepted data in this range.</td></tr>"; list("#last", data.last_observed_sections, "section_id", "sessions"); list("#clicks", data.external_link_clicks, "destination", "clicks"); list("#pdf-pages", data.pdf_pages.map(row=>({...row,page_number:`Page ${row.page_number}: ${Math.round(row.visible_ms/1000)} sec`})), "page_number", "impressions"); list("#block-detail", data.blocks.map(row=>({...row,block_id:`${row.block_id} · ${Math.round(row.visible_ms/1000)} sec`})), "block_id", "impressions"); $("#definition").textContent = `${data.definition.engaged_session} ${data.definition.visible_time}`; $("#status").textContent = "Updated."; }
  async function load() { try { $("#status").textContent = "Loading…"; render(await request(`/admin/dashboard?${query()}`)); $("#login").hidden = true; $("#dashboard").hidden = false; } catch (error) { if (error.status === 401) { $("#login").hidden = false; $("#dashboard").hidden = true; } else $("#status").textContent = error.message; } }
  $("#login-form").addEventListener("submit", async event => { event.preventDefault(); try { await request("/admin/login", {method:"POST", body:JSON.stringify({password:new FormData(event.currentTarget).get("password")})}); $("#login-error").hidden=true; event.currentTarget.reset(); load(); } catch (error) { $("#login-error").textContent=error.message; $("#login-error").hidden=false; } });
  $("#filters").addEventListener("submit", event => { event.preventDefault(); load(); });
  $("#logout").addEventListener("click", async () => { await request("/admin/logout", {method:"POST", body:"{}"}); $("#dashboard").hidden=true; $("#login").hidden=false; });
  $("#csv").addEventListener("click", () => { if (!latest) return; const lines = [["section_id","sessions","impressions","median_visible_seconds"], ...latest.sections.map(r => [r.section_id,r.sessions,r.impressions,Math.round(r.median_visible_ms/1000)])].map(row => row.map(cell => `"${String(cell ?? "").replaceAll('"','""')}"`).join(",")); const link=document.createElement("a"); link.href=URL.createObjectURL(new Blob([lines.join("\n")],{type:"text/csv"})); link.download="ai-ecosystem-section-engagement.csv"; link.click(); URL.revokeObjectURL(link.href); });
  const now = new Date(), past = new Date(Date.now()-30*864e5); $("[name=to]").value=now.toISOString().slice(0,10); $("[name=from]").value=past.toISOString().slice(0,10); load();
})();
