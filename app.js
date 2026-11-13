/* Discipleship Pathway: what Scripture says about making disciples. Content lives in data.js. */
(() => {
const $ = s => document.querySelector(s);
const view = $("#view"), titleEl = $("#title"), backBtn = $("#back");
const chev = `<svg class="chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>`;
const search = { q: "", cmd: 0 };

const bookIdx = ref => { let best = -1, len = 0;
  BOOKS.forEach((b, i) => [b[0], b[0] === "Psalms" ? "Psalm" : ""].forEach(n => {
    if (n && ref.startsWith(n + " ") && n.length > len) { best = i; len = n.length; } }));
  return best; };
const P_BOOK = PASSAGES.map(p => bookIdx(p[0]));
const cmdOf = id => COMMANDS[id - 1];
const REF_IDX = new Map(PASSAGES.map((p, i) => [p[0], i]));
const PAT_IDS = PATTERNS.map(pt => pt[2].map(r => REF_IDX.get(r)));

/* A strip of all 66 books; books where the pattern appears are filled in. */
function strip(ids, big) {
  const hit = new Set(ids.map(i => P_BOOK[i]));
  const cell = (b, bi) => `<i class="${hit.has(bi) ? "on" : ""}" title="${b[0]}"></i>`;
  const ot = BOOKS.slice(0, 39).map((b, i) => cell(b, i)).join(""), nt = BOOKS.slice(39).map((b, i) => cell(b, i + 39)).join("");
  return `<div class="strip ${big ? "big" : ""}" aria-label="Appears in ${hit.size} of ${BOOKS.length} books">
    <div class="ot">${ot}</div><div class="nt">${nt}</div></div>
    ${big ? `<div class="strip-labels"><span>Genesis</span><span>Old Testament · New Testament</span><span>Revelation</span></div>` : ""}`;
}

/* One passage: heading, the full ESV text, reference. */
function passage(i, showCmd = true) {
  const p = PASSAGES[i], c = cmdOf(p[1]);
  return `<article class="pass s${p[1]}">
    <div class="pass-top"><h3>${p[2]}</h3>
      <span class="tags">${p[4] === 1 ? '<span class="tag example">Example</span>' : p[4] === 2 ? '<span class="tag example">Promise</span>' : ""}${showCmd ? `<a class="tag" href="#cmd-${c[0]}">${c[1]}</a>` : ""}</span></div>
    <p class="verse">${p[3]}</p>
    <span class="ref">${p[0]}</span>
  </article>`;
}

/* Passages grouped under their canon section headings. */
function grouped(ids, showCmd) {
  let html = "", sec = -1;
  ids.forEach(i => {
    const s = BOOKS[P_BOOK[i]][2];
    if (s !== sec) { sec = s; html += `<div class="era">${SECTIONS[s][0]} <span class="muted">· ${SECTIONS[s][1]}</span></div>`; }
    html += passage(i, showCmd);
  });
  return html;
}

/* ---------- Screens ---------- */
function homeScreen() {
  return { title: "Make Disciples", tab: "home", html: `
    <div class="charge">
      <p class="label">The Great Commission</p>
      <p class="verse big">“All authority in heaven and on earth has been given to me. Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you. And behold, I am with you always, to the end of the age.”</p>
      <span class="ref">Matthew 28:18–20</span>
    </div>
    <p class="label" style="margin-top:22px">What the word commands</p>
    ${COMMANDS.map(c => `
      <a class="cmdrow s${c[0]}" href="#cmd-${c[0]}">
        <span class="txt"><b>“${c[1]}”</b><small>${c[2]} · ${PASSAGES.filter(p => p[1] === c[0]).length} passages</small></span>${chev}</a>`).join("")}
    <a class="cmdrow" href="#patterns" style="--c:var(--accent)">
      <span class="txt"><b>Patterns through the whole Bible</b><small>${PATTERNS.length} threads from Genesis to Revelation</small></span>${chev}</a>
    <a class="cmdrow" href="#bible" style="--c:var(--accent)">
      <span class="txt"><b>Genesis to Revelation</b><small>All ${BOOKS.length} books · ${PASSAGES.length} passages</small></span>${chev}</a>
    <p class="fine">Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. Some passages are shortened with an ellipsis (…). Read each one in its full context.</p>` };
}

function cmdScreen(id) {
  const c = cmdOf(id); if (!c) return homeScreen();
  const ids = PASSAGES.map((p, i) => i).filter(i => PASSAGES[i][1] === id);
  return { title: `“${c[1]}”`, tab: "home", back: "#home", html: `
    <div class="s${id}">
      <div class="hero"><p class="verse">${c[3]}</p><span class="ref">${c[2]}</span></div>
      <p class="muted">${c[4]} Here is what Scripture says, from Genesis to Revelation.</p>
      ${grouped(ids, false)}
      <div class="pager">
        ${id > 1 ? `<a href="#cmd-${id - 1}">← ${cmdOf(id - 1)[1]}</a>` : ""}
        ${id < COMMANDS.length ? `<a class="next" href="#cmd-${id + 1}">${cmdOf(id + 1)[1]} →</a>` : ""}
      </div>
    </div>` };
}

function patternsScreen() {
  return { title: "Patterns", tab: "patterns", html: `
    <div class="hello"><h2>Patterns through the whole Bible</h2>
      <p>The same threads run from Genesis to Revelation. Each bar below is the whole Bible, one mark per book; the filled marks show where the pattern appears.</p></div>
    ${PATTERNS.map((pt, i) => { const ids = PAT_IDS[i];
      return `<a class="patrow" href="#pattern-${i}">
        <b>${pt[0]}</b><small>${pt[1]}</small>
        ${strip(ids)}
        <span class="patmeta">${PASSAGES[ids[0]][0]} → ${PASSAGES[ids[ids.length - 1]][0]} · ${ids.length} passages</span></a>`; }).join("")}` };
}

function patternScreen(n) {
  const pt = PATTERNS[n]; if (!pt) return patternsScreen();
  const ids = PAT_IDS[n];
  let html = "", sec = -1;
  ids.forEach(i => {
    const s = BOOKS[P_BOOK[i]][2];
    if (s !== sec) { sec = s; html += `<div class="era">${SECTIONS[s][0]}</div>`; }
    html += passage(i);
  });
  return { title: pt[0], tab: "patterns", back: "#patterns", html: `
    <div class="hello"><p class="label">Pattern ${n + 1} of ${PATTERNS.length}</p><h2>${pt[0]}</h2><p>${pt[1]}</p></div>
    ${strip(ids, true)}
    <div class="thread">${html}</div>
    <div class="pager">
      ${n > 0 ? `<a href="#pattern-${n - 1}">← ${PATTERNS[n - 1][0]}</a>` : ""}
      ${n < PATTERNS.length - 1 ? `<a class="next" style="--c:var(--accent)" href="#pattern-${n + 1}">${PATTERNS[n + 1][0]} →</a>` : ""}
    </div>` };
}

function bibleScreen() {
  return { title: "The Whole Bible", tab: "bible", html: `
    <p class="muted" style="margin-top:0">Every book of the Bible speaks to making disciples. Tap a book to read its passages.</p>
    ${SECTIONS.map((s, si) => `
      <div class="era">${s[0]} <span class="muted">· ${s[1]}</span></div>
      <p class="sect">${s[2]}</p>
      <div class="books">${BOOKS.map((b, bi) => b[2] !== si ? "" : `
        <a class="book" href="#book-${bi}"><b>${b[1]}</b><small>${P_BOOK.filter(x => x === bi).length}</small></a>`).join("")}</div>`).join("")}` };
}

function bookScreen(bi) {
  const b = BOOKS[bi]; if (!b) return bibleScreen();
  const ids = PASSAGES.map((p, i) => i).filter(i => P_BOOK[i] === bi);
  return { title: b[0], tab: "bible", back: "#bible", html: `
    <div class="hello"><p class="label">${SECTIONS[b[2]][0]} · book ${bi + 1} of ${BOOKS.length}</p><h2>${b[0]}</h2></div>
    ${ids.map(i => passage(i)).join("")}
    <div class="pager">
      ${bi > 0 ? `<a href="#book-${bi - 1}">← ${BOOKS[bi - 1][0]}</a>` : ""}
      ${bi < BOOKS.length - 1 ? `<a class="next" style="--c:var(--accent)" href="#book-${bi + 1}">${BOOKS[bi + 1][0]} →</a>` : ""}
    </div>` };
}

function searchScreen() {
  return { title: "Search", tab: "search", html: `
    <div class="search">
      <input id="q" type="search" placeholder="Search a word, book, or reference" value="${search.q.replace(/"/g, "&quot;")}" aria-label="Search the passages">
      <div class="chips">
        <button class="chip ${search.cmd ? "" : "on"}" data-cmd="0">All</button>
        ${COMMANDS.map(c => `<button class="chip s${c[0]} ${search.cmd === c[0] ? "on" : ""}" data-cmd="${c[0]}">${c[1]}</button>`).join("")}
      </div>
    </div>
    <div class="count" id="count"></div>
    <div id="list"></div>`, after: renderSearch };
}

function renderSearch() {
  const q = search.q.trim().toLowerCase();
  const ids = PASSAGES.map((p, i) => i).filter(i => { const p = PASSAGES[i];
    return (!search.cmd || p[1] === search.cmd) &&
      (!q || (p[0] + " " + p[2] + " " + p[3] + " " + BOOKS[P_BOOK[i]][0]).toLowerCase().includes(q)); });
  $("#count").textContent = `${ids.length} of ${PASSAGES.length} passages`;
  $("#list").innerHTML = grouped(ids, true) || `<p class="muted">No passages match. Try another word.</p>`;
}

/* ---------- Router ---------- */
function route() {
  const [name, arg] = (location.hash.slice(1) || "home").split("-");
  const scr = name === "cmd" ? cmdScreen(+arg)
    : name === "patterns" ? patternsScreen()
    : name === "pattern" ? patternScreen(+arg)
    : name === "bible" ? bibleScreen()
    : name === "book" ? bookScreen(+arg)
    : name === "search" ? searchScreen()
    : homeScreen();
  view.innerHTML = scr.html;
  view.classList.remove("view-enter"); void view.offsetWidth; view.classList.add("view-enter");
  titleEl.textContent = scr.title;
  document.title = scr.tab === "home" && !scr.back ? "Discipleship Pathway" : scr.title.replace(/[“”]/g, "") + " · Discipleship Pathway";
  backBtn.hidden = !scr.back; backBtn.dataset.to = scr.back || "";
  document.querySelectorAll(".tabbar a").forEach(a => a.classList.toggle("on", a.dataset.tab === scr.tab));
  if (scr.after) scr.after();
  window.scrollTo(0, 0);
}
window.addEventListener("hashchange", route);
backBtn.addEventListener("click", () => { location.hash = backBtn.dataset.to; });

view.addEventListener("input", e => {
  if (e.target.id === "q") { search.q = e.target.value; renderSearch(); }
});
view.addEventListener("click", e => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  search.cmd = +chip.dataset.cmd;
  chip.parentElement.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === chip));
  renderSearch();
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
window.addEventListener("appinstalled", () => { $("#install").hidden = true; });
})();
