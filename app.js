/* Discipleship Pathway: app logic. Content lives in data.js. */
(() => {
const $ = s => document.querySelector(s);
const view = $("#view"), titleEl = $("#title"), backBtn = $("#back");
const TOTAL = STEPS.reduce((n, s) => n + s.doIt.length, 0);

let done = {};
try { done = JSON.parse(localStorage.getItem("dp-done") || "{}"); } catch (e) {}
const save = () => { try { localStorage.setItem("dp-done", JSON.stringify(done)); } catch (e) {} };
const stepDone = s => s.doIt.filter((_, i) => done[s.id + "-" + i]).length;
const allDone = () => STEPS.reduce((n, s) => n + stepDone(s), 0);

const bible = { q: "", step: 0, era: -1, open: {} };
const chev = `<svg class="chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>`;

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 1800);
}

/* ---------- Screens ---------- */
function stepsScreen() {
  const n = allDone(), pct = Math.round(n / TOTAL * 100);
  return { title: "Discipleship Pathway", tab: "steps", html: `
    <div class="hello"><h2>Make disciples, one step at a time</h2>
      <p>Six simple steps from the commands of Scripture. Tap a step to begin.</p></div>
    <div class="card progress">
      <div class="ring" style="--p:${pct}"><span>${pct}%</span></div>
      <div><b>This week</b><div class="muted">${n} of ${TOTAL} actions done</div></div>
    </div>
    <div class="tiles">${STEPS.map(s => `
      <a class="tile s${s.id}" href="#/step/${s.id}">
        <div class="n">${s.id}</div><b>${s.name}</b><small>${s.short}</small>
        <div class="bar"><i style="width:${stepDone(s) / s.doIt.length * 100}%"></i></div>
      </a>`).join("")}</div>
    <div class="card" style="margin-top:12px">
      <p class="verse">“Go therefore and make disciples of all nations…”<span class="ref">Matthew 28:19</span></p>
    </div>` };
}

function stepScreen(id) {
  const s = STEPS[id - 1]; if (!s) return stepsScreen();
  const tools = TOOLS.map((t, i) => ({ ...t, i })).filter(t => t.s === s.id);
  const related = CMDS.filter(c => c[2] === s.id).length;
  return { title: `Step ${s.id}: ${s.name}`, tab: "steps", back: "#/steps", html: `
    <div class="s${s.id}">
      <div class="hero"><div class="n">Step ${s.id} of 6</div><h2>${s.name}</h2><p>${s.q}</p></div>
      <div class="card"><p class="label">Key verses</p>
        ${s.verses.map(v => `<p class="verse">${v[1]}<span class="ref">${v[0]} ESV</span></p>`).join("")}</div>
      <div class="card"><p class="label">The commands</p>
        <ul class="dots">${s.commands.map(c => `<li>${c}</li>`).join("")}</ul></div>
      <div class="card"><p class="label">This week, I will…</p>
        ${s.doIt.map((d, i) => { const k = s.id + "-" + i;
          return `<label class="check"><input type="checkbox" data-k="${k}" ${done[k] ? "checked" : ""}><span>${d}</span></label>`; }).join("")}</div>
      <p class="label" style="margin-top:18px">Use this tool</p>
      ${tools.map(t => `<a class="rowbtn" href="#/tool/${t.i}"><span class="dot"></span>
        <span class="txt"><b>${t.t}</b><small>${t.r}</small></span>${chev}</a>`).join("")}
      <button class="rowbtn" data-related="${s.id}"><span class="dot"></span>
        <span class="txt"><b>See all ${related} passages</b><small>Every command for this step</small></span>${chev}</button>
      <div class="pager">
        ${s.id > 1 ? `<a href="#/step/${s.id - 1}">← ${STEPS[s.id - 2].name}</a>` : ""}
        ${s.id < 6 ? `<a class="next" href="#/step/${s.id + 1}">${STEPS[s.id].name} →</a>` : `<a class="next" href="#/meet">Start meeting →</a>`}
      </div>
    </div>` };
}

function bibleScreen() {
  return { title: "Every Command", tab: "bible", html: `
    <div class="search">
      <input id="q" type="search" placeholder="Search a word or reference" value="${bible.q.replace(/"/g, "&quot;")}" aria-label="Search">
      <div class="chips" id="stepChips">
        <button class="chip ${bible.step ? "" : "on"}" data-step="0">All steps</button>
        ${STEPS.map(s => `<button class="chip s${s.id} ${bible.step === s.id ? "on" : ""}" data-step="${s.id}">${s.id} · ${s.name}</button>`).join("")}
      </div>
      <div class="chips" id="eraChips">
        <button class="chip ${bible.era < 0 ? "on" : ""}" data-era="-1">Whole Bible</button>
        ${ERAS.map((e, i) => `<button class="chip ${bible.era === i ? "on" : ""}" data-era="${i}">${e}</button>`).join("")}
      </div>
    </div>
    <div class="count" id="count"></div>
    <div id="list"></div>` , after: renderList };
}

function renderList() {
  const q = bible.q.trim().toLowerCase();
  const rows = CMDS.map((c, i) => [c[0], c[1], c[2], c[3], c[4], c[5], !!c[6], i]).filter(c =>
    (!bible.step || c[2] === bible.step) && (bible.era < 0 || c[1] === bible.era) &&
    (!q || (c[0] + " " + c[3] + " " + c[4] + " " + c[5]).toLowerCase().includes(q)));
  $("#count").textContent = `${rows.length} of ${CMDS.length} passages · tap to open`;
  let html = "", era = -1;
  rows.forEach(c => {
    if (c[1] !== era) { era = c[1]; html += `<div class="era">${ERAS[era]}</div>`; }
    const st = STEPS[c[2] - 1], idx = c[7];
    html += `<button class="cmd s${c[2]} ${bible.open[idx] ? "open" : ""}" data-i="${idx}" aria-expanded="${!!bible.open[idx]}">
      <div class="cmd-top"><span><b>${c[3]}</b><div class="r">${c[0]}</div></span>
        <span>${c[6] ? '<span class="tag pattern">Pattern</span>' : ""}<span class="tag">${st.id} · ${st.name}</span></span></div>
      <div class="more"><p class="verse">${c[4]}</p><div class="obey"><b>Obey it:</b> ${c[5]}</div></div>
    </button>`;
  });
  $("#list").innerHTML = html || `<p class="muted">No passages match. Try another word.</p>`;
}

function toolsScreen() {
  return { title: "Simple Tools", tab: "tools", html: `
    <div class="hello"><h2>Simple tools</h2><p>Simple practices taken straight from Scripture.</p></div>
    ${TOOLS.map((t, i) => `<a class="rowbtn s${t.s}" href="#/tool/${i}"><span class="dot"></span>
      <span class="txt"><b>${t.t}</b><small>Step ${t.s} · ${STEPS[t.s - 1].name}</small></span>${chev}</a>`).join("")}` };
}

function toolScreen(i) {
  const t = TOOLS[i]; if (!t) return toolsScreen();
  const st = STEPS[t.s - 1];
  return { title: t.t, tab: "tools", back: "#/tools", html: `
    <div class="s${t.s}">
      <div class="hero"><div class="n">Tool · Step ${st.id} ${st.name}</div><h2>${t.t}</h2><p>${t.r}</p></div>
      <div class="card"><ol class="steps-ol">${t.items.map(x => `<li><span>${x}</span></li>`).join("")}</ol></div>
      <div class="card"><p class="label">Tip</p><p style="margin:0">${t.note}</p></div>
      <a class="rowbtn" href="#/step/${st.id}"><span class="dot"></span>
        <span class="txt"><b>Go to Step ${st.id}: ${st.name}</b><small>${st.short}</small></span>${chev}</a>
    </div>` };
}

function meetScreen() {
  const parts = [
    ["The apostles' teaching","Open God's word together, and use <a href=\"#/tool/5\">Hear and Do</a>."],
    ["The fellowship","Share life: how you are really doing, joys and burdens (Galatians 6:2)."],
    ["The breaking of bread","Eat together, and remember Jesus at the Lord's Table (Luke 22:19)."],
    ["The prayers","Pray for one another, and for people who don't yet know Jesus (James 5:16; Colossians 4:3)."]];
  return { title: "Meet Together", tab: "meet", html: `
    <div class="hello"><h2>Gather like the early church</h2>
      <p>“And they devoted themselves to the apostles' teaching and the fellowship, to the breaking of bread and the prayers.” Acts 2:42</p></div>
    ${parts.map((p, i) => `<div class="card third"><div class="big">${i + 1}</div><div><b>${p[0]}</b><div>${p[1]}</div></div></div>`).join("")}
    <div class="card"><p class="verse">“And let us consider how to stir up one another to love and good works, not neglecting to meet together… but encouraging one another…”<span class="ref">Hebrews 10:24–25</span></p></div>

    <div class="hello" style="margin-top:24px"><h2>Multiply</h2>
      <p>“…entrust to faithful men, who will be able to teach others also.” 2 Timothy 2:2</p></div>
    <div class="card chain">
      <div data-n="1"><b>Paul</b><span class="muted">Who invested in you?</span></div>
      <div data-n="2"><b>Timothy</b><span class="muted">You: abide, obey, keep growing.</span></div>
      <div data-n="3"><b>Faithful people</b><span class="muted">Who is God calling you to invest in?</span></div>
      <div data-n="4"><b>Others also</b><span class="muted">Who will <em>they</em> teach?</span></div>
    </div>
    <a class="rowbtn s6" href="#/tool/6"><span class="dot"></span>
      <span class="txt"><b>Imitate</b><small>Learned · received · heard · seen (Philippians 4:9)</small></span>${chev}</a>

    <div class="card" style="margin-top:24px">
      <p class="label">Start a new week</p>
      <p class="muted" style="margin-top:0">Clear your “This week, I will…” checklist.</p>
      <button class="btn" id="reset">Reset checklist</button>
    </div>
    <p class="fine">Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. Some passages are shortened with an ellipsis (…). Read each one in its full context.</p>` };
}

/* ---------- Router ---------- */
function route() {
  const [, name, arg] = (location.hash || "#/steps").split("/");
  const scr = name === "step" ? stepScreen(+arg)
    : name === "bible" ? bibleScreen()
    : name === "tools" ? toolsScreen()
    : name === "tool" ? toolScreen(+arg)
    : name === "meet" ? meetScreen()
    : stepsScreen();
  view.innerHTML = scr.html;
  view.classList.remove("view-enter"); void view.offsetWidth; view.classList.add("view-enter");
  titleEl.textContent = scr.title;
  document.title = scr.title === "Discipleship Pathway" ? scr.title : scr.title + " · Discipleship Pathway";
  backBtn.hidden = !scr.back; backBtn.dataset.to = scr.back || "";
  document.querySelectorAll(".tabbar a").forEach(a => a.classList.toggle("on", a.dataset.tab === scr.tab));
  if (scr.after) scr.after();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);
backBtn.addEventListener("click", () => { location.hash = backBtn.dataset.to; });

/* ---------- Events ---------- */
view.addEventListener("change", e => {
  const k = e.target.dataset.k; if (!k) return;
  done[k] = e.target.checked; save();
  if (e.target.checked) {
    const sid = +k.split("-")[0], s = STEPS[sid - 1];
    toast(stepDone(s) === s.doIt.length ? `Step ${sid} complete!` : "Nice work!");
  }
});
view.addEventListener("input", e => {
  if (e.target.id === "q") { bible.q = e.target.value; renderList(); }
});
view.addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (chip) {
    if (chip.dataset.step !== undefined) bible.step = +chip.dataset.step;
    if (chip.dataset.era !== undefined) bible.era = +chip.dataset.era;
    chip.parentElement.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === chip));
    renderList(); return;
  }
  const cmd = e.target.closest(".cmd");
  if (cmd) {
    const i = cmd.dataset.i; bible.open[i] = !bible.open[i];
    cmd.classList.toggle("open", bible.open[i]); cmd.setAttribute("aria-expanded", bible.open[i]); return;
  }
  const rel = e.target.closest("[data-related]");
  if (rel) { bible.step = +rel.dataset.related; bible.era = -1; bible.q = ""; location.hash = "#/bible"; return; }
  if (e.target.id === "reset" && confirm("Clear all checked items?")) { done = {}; save(); toast("Checklist cleared"); }
});

route();

/* ---------- PWA ---------- */
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
let deferred;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferred = e; $("#install").hidden = false; });
$("#install").addEventListener("click", async () => {
  if (!deferred) return; deferred.prompt(); await deferred.userChoice; deferred = null; $("#install").hidden = true;
});
window.addEventListener("appinstalled", () => { $("#install").hidden = true; toast("Installed!"); });
})();
