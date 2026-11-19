/* Discipleship Pathway: what Scripture says about making disciples. Content lives in data.js. */
(() => {
const $ = s => document.querySelector(s);
const view = $("#view"), titleEl = $("#title"), backBtn = $("#back");
const chev = `<svg class="chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>`;
const search = { q: "", cmd: 0 };
let scope = "all";   // "all" | "ot" | "nt", set from the link (#pattern-4-nt)
const NT_START = 39; // Matthew is book 40
const SCOPES = [["all", "Whole Bible"], ["ot", "Old Testament"], ["nt", "New Testament"]];

const bookIdx = ref => { let best = -1, len = 0;
  BOOKS.forEach((b, i) => [b[0], b[0] === "Psalms" ? "Psalm" : ""].forEach(n => {
    if (n && ref.startsWith(n + " ") && n.length > len) { best = i; len = n.length; } }));
  return best; };
const P_BOOK = PASSAGES.map(p => bookIdx(p[0]));
const cmdOf = id => COMMANDS[id - 1];
const REF_IDX = new Map(PASSAGES.map((p, i) => [p[0], i]));
const PAT_IDS = PATTERNS.map(pt => pt[2].map(r => REF_IDX.get(r)));
const CMD_IDS = COMMANDS.map(c => c[4].map(r => REF_IDX.get(r)));
const ids = refs => refs.map(r => REF_IDX.get(r));
const PR_IDS = PRACTICES.map(pr => [pr[2].map(r => REF_IDX.get(r)), pr[3].map(r => REF_IDX.get(r))]);

const isNT = i => P_BOOK[i] >= NT_START;
const inScope = (i, sc = scope) => sc === "all" || (sc === "nt") === isNT(i);

/* Whole Bible / Old Testament / New Testament switch for a page. */
function scopeBar(base, ids) {
  return `<nav class="seg" aria-label="Show passages from">${SCOPES.map(([k, label]) =>
    `<a href="#${base}${k === "all" ? "" : "-" + k}" class="${scope === k ? "on" : ""}" ${scope === k ? 'aria-current="true"' : ""}>
      ${label}<small>${ids.filter(i => inScope(i, k)).length}</small></a>`).join("")}</nav>`;
}
const sfx = () => scope === "all" ? "" : "-" + scope;

/* A strip of all 66 books; books where the pattern appears are filled in. */
function strip(ids, big) {
  const hit = new Set(ids.map(i => P_BOOK[i]));
  const cell = (b, bi) => `<i class="${hit.has(bi) ? "on" : ""}" title="${b[0]}"></i>`;
  const ot = BOOKS.slice(0, 39).map((b, i) => cell(b, i)).join(""), nt = BOOKS.slice(39).map((b, i) => cell(b, i + 39)).join("");
  return `<div class="strip ${big ? "big scope-" + scope : ""}" aria-label="Appears in ${hit.size} of ${BOOKS.length} books">
    <div class="ot">${ot}</div><div class="nt">${nt}</div></div>
    ${big ? `<div class="strip-labels"><span>Genesis</span><span>Old Testament · New Testament</span><span>Revelation</span></div>` : ""}`;
}

/* One passage: the ESV text and its reference, nothing else. */
function passage(i) {
  const p = PASSAGES[i];
  return `<article class="pass"><p class="verse">${p[1]}</p><span class="ref">${p[0]}${p[2] ? ` <abbr class="tr" title="New International Version">${p[2]}</abbr>` : ""}</span></article>`;
}

/* Passages grouped under their canon section headings. */
function grouped(ids) {
  let html = "", sec = -1;
  ids.forEach(i => {
    const s = BOOKS[P_BOOK[i]][2];
    if (s !== sec) { sec = s; html += `<div class="era">${SECTIONS[s][0]} <span class="muted">· ${SECTIONS[s][1]}</span></div>`; }
    html += passage(i);
  });
  return html;
}

/* ---------- Screens ---------- */
function homeScreen() {
  const focus = PASSAGES[REF_IDX.get("Matthew 22:37–40")];
  const loveRow = n => { const pt = PATTERNS[n], ids = PAT_IDS[n];
    return `<a class="patrow love" href="#pattern-${n}">
      <b>“${pt[0]}”</b><small>${pt[1]}</small>
      ${strip(ids)}
      <span class="patmeta">Old Testament ${ids.filter(i => !isNT(i)).length} · New Testament ${ids.filter(isNT).length}</span></a>`; };
  return { title: "Love God · Love People", tab: "home", html: `
    <div class="charge">
      <p class="label">The focus of the whole Bible</p>
      <p class="verse big">${focus[2]}</p>
      <span class="ref">${focus[0]}</span>
    </div>
    <div class="two">${loveRow(0)}${loveRow(1)}</div>

    <p class="label" style="margin-top:26px">The mission that flows from it</p>
    <div class="card">
      <p class="verse">“All authority in heaven and on earth has been given to me. Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you. And behold, I am with you always, to the end of the age.”</p>
      <span class="ref">Matthew 28:18–20</span>
    </div>
    ${COMMANDS.map(c => `
      <a class="cmdrow s${c[0]}" href="#cmd-${c[0]}">
        <span class="txt"><b>“${c[1]}”</b><small>${c[2]} · ${c[4].length} passages</small></span>${chev}</a>`).join("")}

    <p class="label" style="margin-top:26px">How Jesus made disciples, and what his followers did afterward</p>
    <a class="cmdrow" href="#practices" style="--c:var(--accent)">
      <span class="txt"><b>${PRACTICES.length} practices</b><small>With Jesus in the Gospels · Afterward in Acts to Revelation</small></span>${chev}</a>

    <p class="label" style="margin-top:26px">The pathway</p>
    <a class="cmdrow" href="#mature" style="--c:var(--accent)">
      <span class="txt"><b>The mature disciple</b><small>What we grow toward, in Scripture's own words</small></span>${chev}</a>
    <a class="cmdrow" href="#growth" style="--c:var(--accent)">
      <span class="txt"><b>From new believer to mature disciple</b><small>${PATHWAY.length} steps, each tested against the word</small></span>${chev}</a>

    <p class="label" style="margin-top:26px">Patterns through the whole Bible</p>
    <a class="cmdrow" href="#patterns" style="--c:var(--accent)">
      <span class="txt"><b>${PATTERNS.length} patterns</b><small>Each named by a phrase of Scripture</small></span>${chev}</a>
    <a class="cmdrow" href="#compiled" style="--c:var(--accent)">
      <span class="txt"><b>All patterns compiled</b><small>Every pattern and every verse on one page</small></span>${chev}</a>
    <a class="cmdrow" href="#bible" style="--c:var(--accent)">
      <span class="txt"><b>Genesis to Revelation</b><small>All ${BOOKS.length} books · ${PASSAGES.length} passages</small></span>${chev}</a>
    <p class="fine">Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. Passages marked NIV are taken from The Holy Bible, New International Version® NIV®. Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™ Used by permission. All rights reserved worldwide. Some passages are shortened with an ellipsis (…). Read each one in its full context.</p>` };
}

function cmdScreen(id) {
  const c = cmdOf(id); if (!c) return homeScreen();
  const all = CMD_IDS[id - 1], ids = all.filter(i => inScope(i));
  return { title: `“${c[1]}”`, tab: "home", back: "#home", html: `
    <div class="s${id}">
      <div class="hero"><p class="verse">${c[3]}</p><span class="ref">${c[2]}</span></div>
      ${scopeBar("cmd-" + id, all)}
      ${grouped(ids) || `<p class="muted">No passages in this part of the Bible.</p>`}
      <div class="pager">
        ${id > 1 ? `<a href="#cmd-${id - 1}${sfx()}">← ${cmdOf(id - 1)[1]}</a>` : ""}
        ${id < COMMANDS.length ? `<a class="next" href="#cmd-${id + 1}${sfx()}">${cmdOf(id + 1)[1]} →</a>` : ""}
      </div>
    </div>` };
}

function patternsScreen() {
  return { title: "Patterns", tab: "patterns", html: `
    <a class="cmdrow" href="#compiled" style="--c:var(--accent)">
      <span class="txt"><b>All patterns compiled</b><small>All ${PATTERNS.length} patterns and every verse on one page</small></span>${chev}</a>
    <p class="muted">Each bar is the whole Bible, Genesis to Revelation, one mark per book.</p>
    ${PATTERNS.map((pt, i) => { const ids = PAT_IDS[i];
      const head = i === 0 ? `<p class="label">The focus: Matthew 22:37–40</p>` : i === 2 ? `<p class="label" style="margin-top:22px">Flowing from it</p>` : "";
      return head + `<a class="patrow ${i < 2 ? "love" : ""}" href="#pattern-${i}">
        <b>“${pt[0]}”</b><small>${pt[1]}</small>
        ${strip(ids)}
        <span class="patmeta">Old Testament ${ids.filter(i => !isNT(i)).length} · New Testament ${ids.filter(isNT).length}</span></a>`; }).join("")}` };
}

function patternScreen(n) {
  const pt = PATTERNS[n]; if (!pt) return patternsScreen();
  const all = PAT_IDS[n], ids = all.filter(i => inScope(i));
  let html = "", sec = -1;
  ids.forEach(i => {
    const s = BOOKS[P_BOOK[i]][2];
    if (s !== sec) { sec = s; html += `<div class="era">${SECTIONS[s][0]}</div>`; }
    html += passage(i);
  });
  return { title: `“${pt[0]}”`, tab: "patterns", back: "#patterns", html: `
    <div class="hello"><h2 class="phrase">“${pt[0]}”</h2><span class="ref">${pt[1]}</span></div>
    ${strip(all, true)}
    ${scopeBar("pattern-" + n, all)}
    <div class="thread">${html || `<p class="muted">No passages in this part of the Bible.</p>`}</div>
    <div class="pager">
      ${n > 0 ? `<a href="#pattern-${n - 1}${sfx()}">← Previous</a>` : ""}
      ${n < PATTERNS.length - 1 ? `<a class="next" style="--c:var(--accent)" href="#pattern-${n + 1}${sfx()}">Next →</a>` : ""}
    </div>` };
}

/* Every pattern and every verse on one page. */
function compiledScreen() {
  const sections = PATTERNS.map((pt, n) => {
    const all = PAT_IDS[n], ids = all.filter(i => inScope(i));
    let html = "", sec = -1;
    ids.forEach(i => {
      const s = BOOKS[P_BOOK[i]][2];
      if (s !== sec) { sec = s; html += `<div class="era">${SECTIONS[s][0]}</div>`; }
      html += passage(i);
    });
    return `<section class="compiled" id="pt${n}">
      <h2 class="phrase"><span class="num">${n + 1}</span>“${pt[0]}”</h2><span class="ref">${pt[1]} · ${ids.length} passages</span>
      ${strip(all)}
      <div class="thread">${html || `<p class="muted">No passages in this part of the Bible.</p>`}</div>
    </section>`;
  }).join("");
  const total = new Set(PAT_IDS.flat().filter(i => inScope(i))).size;
  return { title: "All Patterns", tab: "patterns", back: "#patterns", html: `
    <div class="hello"><h2>All patterns compiled</h2>
      <p>${PATTERNS.length} patterns · ${total} passages</p></div>
    ${scopeBar("compiled", PAT_IDS.flat().filter((v, i, a) => a.indexOf(v) === i))}
    <ol class="toc">${PATTERNS.map((pt, n) => `<li><button type="button" data-jump="pt${n}">“${pt[0]}”</button></li>`).join("")}</ol>
    ${sections}` };
}

/* Practices: what Jesus did with his disciples, then what his followers did afterward. */
function practiceBody(n) {
  const [jesus, after] = PR_IDS[n];
  return `<div class="pair">
    <div><p class="side"><b>With Jesus</b> · the Gospels · ${jesus.length}</p>${jesus.map(passage).join("")}</div>
    <div><p class="side"><b>Afterward</b> · Acts to Revelation · ${after.length}</p>${after.map(passage).join("")}</div>
  </div>`;
}

function practicesScreen() {
  return { title: "Practices", tab: "practices", html: `
    <p class="muted" style="margin-top:0">What Jesus did with his disciples, and what his followers did afterward.</p>
    <a class="cmdrow" href="#practicesall" style="--c:var(--accent)">
      <span class="txt"><b>All practices compiled</b><small>All ${PRACTICES.length} practices and every verse on one page</small></span>${chev}</a>
    ${PRACTICES.map((pr, n) => `
      <a class="cmdrow" href="#practice-${n}" style="--c:var(--accent)">
        <span class="txt"><b>“${pr[0]}”</b><small>${pr[1]} · With Jesus ${pr[2].length} · Afterward ${pr[3].length}</small></span>${chev}</a>`).join("")}` };
}

function practiceScreen(n) {
  const pr = PRACTICES[n]; if (!pr) return practicesScreen();
  return { title: `“${pr[0]}”`, tab: "practices", back: "#practices", html: `
    <div class="hello"><h2 class="phrase">“${pr[0]}”</h2><span class="ref">${pr[1]}</span></div>
    ${practiceBody(n)}
    <div class="pager">
      ${n > 0 ? `<a href="#practice-${n - 1}">← Previous</a>` : ""}
      ${n < PRACTICES.length - 1 ? `<a class="next" style="--c:var(--accent)" href="#practice-${n + 1}">Next →</a>` : ""}
    </div>` };
}

function practicesAllScreen() {
  return { title: "All Practices", tab: "practices", back: "#practices", html: `
    <div class="hello"><h2>All practices compiled</h2><p>${PRACTICES.length} practices</p></div>
    <ol class="toc">${PRACTICES.map((pr, n) => `<li><button type="button" data-jump="pr${n}">“${pr[0]}”</button></li>`).join("")}</ol>
    ${PRACTICES.map((pr, n) => `<section class="compiled" id="pr${n}">
      <h2 class="phrase"><span class="num">${n + 1}</span>“${pr[0]}”</h2><span class="ref">${pr[1]}</span>
      ${practiceBody(n)}</section>`).join("")}` };
}

/* ---------- Growth toward maturity ---------- */
const GROWTH_PARTS = [
  ["range", "The range of maturity", "Infants, children, young men, fathers, the mature", GROWTH.range.length],
  ["jesus", "How Jesus discipled the Twelve", `${GROWTH.jesus.length} steps, in the order of the Gospels`, GROWTH.jesus.length],
  ["pairs", "Before and after", "The same disciples in the Gospels, then in Acts and their letters", GROWTH.pairs.length],
  ["seasons", "Seasons of preparation", GROWTH.seasons.map(s => s[0]).join(" · "), GROWTH.seasons.length]];

function growthScreen() {
  return { title: "Pathway", tab: "growth", html: `
    <div class="hello"><h2>From new believer to mature disciple</h2>
      <p>Each step shows where Scripture places it, what the word says, and how Jesus did it with the Twelve.</p></div>
    <a class="cmdrow lead" href="#mature" style="--c:var(--accent)">
      <span class="txt"><b>The mature disciple</b><small>${MATURE.disciple.length + MATURE.marks.length} marks: abides in the Word, loves others, discerns good and evil, teaches others…</small></span>${chev}</a>
    <a class="cmdrow" href="#stepsall" style="--c:var(--accent)">
      <span class="txt"><b>The whole pathway on one page</b><small>All ${PATHWAY.length} steps with every verse</small></span>${chev}</a>
    <ol class="steps path">${PATHWAY.map((s, n) => `<li><a href="#step-${n}">
      <b class="phrase">“${s[0]}”</b><span class="ref">${s[1]}</span></a></li>`).join("")}</ol>

    <p class="label" style="margin-top:26px">Spiritual health</p>
    <a class="cmdrow" href="#arcs" style="--c:var(--accent)">
      <span class="txt"><b>Character arcs</b><small>${ARCS.map(x => x[0].split(",")[0]).join(" · ")}</small></span>${chev}</a>
    <a class="cmdrow" href="#health" style="--c:var(--accent)">
      <span class="txt"><b>Examine yourselves</b><small>The checks for spiritual health that Scripture gives</small></span>${chev}</a>

    <p class="label" style="margin-top:26px">Going deeper</p>
    ${GROWTH_PARTS.map(([k, t, s]) => `<a class="cmdrow" href="#grow-${k}" style="--c:var(--accent)">
      <span class="txt"><b>${t}</b><small>${s}</small></span>${chev}</a>`).join("")}` };
}

/* One pathway step: where Scripture places it, what the word says, with Jesus. */
function stepBody(n) {
  const [, , order, word, jesus] = PATHWAY[n];
  return `<p class="side"><b>Where Scripture places this step</b></p>${ids(order).map(passage).join("")}
    <p class="side"><b>What the word says</b></p>${ids(word).map(passage).join("")}
    <p class="side"><b>With Jesus</b> · the Gospels</p>${ids(jesus).map(passage).join("")}`;
}

function stepScreen(n) {
  const s = PATHWAY[n]; if (!s) return growthScreen();
  return { title: `Step ${n + 1} of ${PATHWAY.length}`, tab: "growth", back: "#growth", html: `
    <div class="hello"><p class="label">Step ${n + 1} of ${PATHWAY.length}</p><h2 class="phrase">“${s[0]}”</h2><span class="ref">${s[1]}</span></div>
    ${stepBody(n)}
    <div class="pager">
      ${n > 0 ? `<a href="#step-${n - 1}">← Step ${n}</a>` : ""}
      ${n < PATHWAY.length - 1 ? `<a class="next" style="--c:var(--accent)" href="#step-${n + 1}">Step ${n + 2} →</a>` : ""}
    </div>` };
}

/* Character arcs: a life as Scripture records it, in order. */
function arcsScreen() {
  return { title: "Character Arcs", tab: "growth", back: "#growth", html: `
    <div class="hello"><h2>Character arcs</h2><p>Each life in the order it happened. Each moment is titled by a phrase from its own verse.</p></div>
    ${ARCS.map(([who, moments], n) => `<a class="cmdrow" href="#arc-${n}" style="--c:var(--accent)">
      <span class="txt"><b>${who}</b><small>“${moments[0][0]}” → “${moments[moments.length - 1][0]}” · ${moments.length} moments</small></span>${chev}</a>`).join("")}` };
}

function arcScreen(n) {
  const arc = ARCS[n]; if (!arc) return arcsScreen();
  return { title: arc[0], tab: "growth", back: "#arcs", html: `
    <div class="hello"><p class="label">Character arc</p><h2>${arc[0]}</h2><p>In the order of his life.</p></div>
    <ol class="steps">${arc[1].map(([q, refs]) => `<li><h3 class="phrase">“${q}”</h3>${ids(refs).map(passage).join("")}</li>`).join("")}</ol>
    <div class="pager">
      ${n > 0 ? `<a href="#arc-${n - 1}">← ${ARCS[n - 1][0].split(",")[0]}</a>` : ""}
      ${n < ARCS.length - 1 ? `<a class="next" style="--c:var(--accent)" href="#arc-${n + 1}">${ARCS[n + 1][0].split(",")[0]} →</a>` : ""}
    </div>` };
}

function healthScreen() {
  return { title: "Examine Yourselves", tab: "growth", back: "#growth", html: `
    <div class="hello"><h2>Examine yourselves</h2></div>
    ${grouped(ids(HEALTH))}` };
}

/* The mature disciple: each mark has a plain name, an icon, and the Scripture quote it comes from. */
const ICONS = {
  book: '<path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2zM4 20a2 2 0 0 1 2-2h13v3H6a2 2 0 0 1-2-1"/>',
  heart: '<path d="M12 20s-7-4.4-7-9.6A4 4 0 0 1 12 8a4 4 0 0 1 7 2.4C19 15.6 12 20 12 20z"/>',
  fruit: '<path d="M12 8c-3-2-8-1-8 4 0 5 4 9 6 9 1 0 1.4-.5 2-.5s1 .5 2 .5c2 0 6-4 6-9 0-5-5-6-8-4zM12 8c0-2 1-4 3-5"/>',
  cross: '<path d="M12 3v18M7 8h10"/>',
  give: '<path d="M3 15l4-1 5 2.5 5-1.5 4 1M3 15v5h4M12 3v7M9 7l3 3 3-3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  scales: '<path d="M12 4v16M7 20h10M5 7h14M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/>',
  anchor: '<circle cx="12" cy="5" r="2"/><path d="M12 7v14M5 13a7 7 0 0 0 14 0M9 10h6"/>',
  speechheart: '<path d="M4 4h16v12H10l-6 4z"/><path d="M12 13s-3-1.7-3-3.6a1.5 1.5 0 0 1 3-.8 1.5 1.5 0 0 1 3 .8c0 1.9-3 3.6-3 3.6z"/>',
  speechline: '<path d="M4 4h16v12H10l-6 4zM8 10h8"/>',
  mountain: '<path d="M2 20l7-12 4 6 3-4 6 10z"/>',
  hands: '<path d="M2 12l4-4 4 2 2-1 2 1 4-2 4 4-8 7z"/><path d="M10 10l4 4"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
  flag: '<path d="M5 21V4M5 4h12l-2.5 4L17 12H5"/>',
  board: '<path d="M3 4h18v12H3zM8 20l4-4 4 4M7 9h6"/>',
  support: '<path d="M2 16h4l5 2h5l6-4M6 16v-3a6 6 0 0 1 12 0"/><circle cx="12" cy="7" r="2.5"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  steps: '<path d="M8 3c2 0 2.5 6 0 6S6 3 8 3zM16 11c2 0 2.5 6 0 6s-2-6 0-6zM7 11h2M15 19h2"/>',
  tool: '<path d="M14.5 6.5a4 4 0 0 0-5 5L3 18l3 3 6.5-6.5a4 4 0 0 0 5-5l-2.5 2.5-3-3z"/>',
  tree: '<path d="M12 21V9M12 13l-4-3M12 11l4-3M7 9a5 5 0 1 1 10 0 5 5 0 0 1-10 0z"/>',
  sprout: '<path d="M12 21v-9M12 12c0-4 3-7 7-7 0 4-3 7-7 7zM12 15c0-3-2.5-5.5-6-5.5 0 3.5 2.5 5.5 6 5.5z"/>'};
const bubble = (icon, n) => `<span class="bubble h${n % 6}" aria-hidden="true"><svg viewBox="0 0 24 24">${ICONS[icon] || ""}</svg></span>`;

function matureScreen() {
  const D = MATURE.disciple.length;
  const tile = ([q, rf, , label, icon], n) => `<button type="button" class="tile2" data-jump="mk${n}">
      ${bubble(icon, n)}<b>${label}</b><small>${rf}</small></button>`;
  const mark = ([q, rf, refs, label, icon], n) => `<section class="compiled mark" id="mk${n}">
      <div class="markhead">${bubble(icon, n)}<div><span class="num">${n + 1}</span><h3>${label}</h3></div></div>
      <p class="quote">“${q}”</p><span class="ref">${rf}</span>
      ${ids(refs).map(passage).join("")}</section>`;
  return { title: "The Mature Disciple", tab: "growth", back: "#growth", html: `
    <div class="hello"><h2>The mature disciple</h2>
      <p>Each mark has a plain name, and under it the words of Scripture it comes from. Tap a mark to read its verses.</p></div>

    <p class="label">Jesus' marks of a disciple</p>
    <div class="tiles2">${MATURE.disciple.map((m, n) => tile(m, n)).join("")}</div>
    <p class="label" style="margin-top:18px">Marks of maturity</p>
    <div class="tiles2">${MATURE.marks.map((m, n) => tile(m, n + D)).join("")}</div>

    <p class="label" style="margin-top:26px">What every disciple grows toward</p>
    ${ids(MATURE.toward).map(passage).join("")}

    <p class="label" style="margin-top:22px">Jesus' marks of a disciple</p>
    ${MATURE.disciple.map((m, n) => mark(m, n)).join("")}

    <p class="label" style="margin-top:22px">Marks of maturity</p>
    ${MATURE.marks.map((m, n) => mark(m, n + D)).join("")}

    <p class="label" style="margin-top:22px">Signs of immaturity</p>
    ${ids(MATURE.immature).map(passage).join("")}` };
}

function stepsAllScreen() {
  return { title: "The Whole Pathway", tab: "growth", back: "#growth", html: `
    <div class="hello"><h2>From new believer to mature disciple</h2><p>${PATHWAY.length} steps</p></div>
    ${PATHWAY.map((s, n) => `<section class="compiled" id="st${n}">
      <h2 class="phrase"><span class="num">${n + 1}</span>“${s[0]}”</h2><span class="ref">${s[1]}</span>
      ${stepBody(n)}</section>`).join("")}` };
}

function growScreen(k) {
  if (k === "mature") return matureScreen();
  const part = GROWTH_PARTS.find(p => p[0] === k); if (!part) return growthScreen();
  const head = `<div class="hello"><h2>${part[1]}</h2></div>`;
  let body = "";
  if (k === "range" || k === "mature") body = grouped(ids(GROWTH[k]));
  if (k === "jesus") body = `<p class="muted">In the order they appear in the Gospels, from the first call to the sending.</p>
    <ol class="steps">${GROWTH.jesus.map(([ph, rf, list]) => `<li><h3 class="phrase">“${ph}”</h3><span class="ref">${rf}</span>
      ${ids(list).map(passage).join("")}</li>`).join("")}</ol>`;
  if (k === "pairs") body = GROWTH.pairs.map(([who, before, after]) => `<section class="compiled">
      <h2 class="phrase">${who}</h2>
      <div class="pair">
        <div><p class="side"><b>Before</b> · the Gospels</p>${ids(before).map(passage).join("")}</div>
        <div><p class="side"><b>After</b> · Acts and the letters</p>${ids(after).map(passage).join("")}</div>
      </div></section>`).join("");
  if (k === "seasons") body = `<p class="muted">Each life in the order it happened, not book order.</p>
    ${GROWTH.seasons.map(([who, list], n) => `<a class="cmdrow" href="#season-${n}" style="--c:var(--accent)">
      <span class="txt"><b>${who}</b><small>${list[0]} → ${list[list.length - 1]} · ${list.length} passages</small></span>${chev}</a>`).join("")}`;
  return { title: part[1], tab: "growth", back: "#growth", html: head + body };
}

function seasonScreen(n) {
  const s = GROWTH.seasons[n]; if (!s) return growScreen("seasons");
  return { title: s[0], tab: "growth", back: "#grow-seasons", html: `
    <div class="hello"><p class="label">Seasons of preparation</p><h2>${s[0]}</h2><p>In the order of his life.</p></div>
    <div class="thread">${ids(s[1]).map(passage).join("")}</div>
    <div class="pager">
      ${n > 0 ? `<a href="#season-${n - 1}">← ${GROWTH.seasons[n - 1][0]}</a>` : ""}
      ${n < GROWTH.seasons.length - 1 ? `<a class="next" style="--c:var(--accent)" href="#season-${n + 1}">${GROWTH.seasons[n + 1][0]} →</a>` : ""}
    </div>` };
}

function bibleScreen() {
  return { title: "The Whole Bible", tab: "bible", html: `
    <a class="cmdrow" href="#search" style="--c:var(--accent)">
      <span class="txt"><b>Search</b><small>Any word, book, or reference</small></span>${chev}</a>
    <p class="muted">Tap a book to read its passages. A book shows 0 when none of its verses state one of the themes here.</p>
    ${SECTIONS.map((s, si) => `
      <div class="era">${s[0]} <span class="muted">· ${s[1]}</span></div>
      <div class="books">${BOOKS.map((b, bi) => b[2] !== si ? "" : `
        ${P_BOOK.includes(bi) ? `<a class="book" href="#book-${bi}"><b>${b[1]}</b><small>${P_BOOK.filter(x => x === bi).length}</small></a>`
          : `<span class="book empty" title="${b[0]}: no passage under these themes"><b>${b[1]}</b><small>0</small></span>`}`).join("")}</div>`).join("")}` };
}

function bookScreen(bi) {
  const b = BOOKS[bi]; if (!b) return bibleScreen();
  const ids = PASSAGES.map((p, i) => i).filter(i => P_BOOK[i] === bi);
  return { title: b[0], tab: "bible", back: "#bible", html: `
    <div class="hello"><p class="label">${SECTIONS[b[2]][0]} · book ${bi + 1} of ${BOOKS.length}</p><h2>${b[0]}</h2></div>
    ${ids.map(passage).join("")}
    <div class="pager">
      ${bi > 0 ? `<a href="#book-${bi - 1}">← ${BOOKS[bi - 1][0]}</a>` : ""}
      ${bi < BOOKS.length - 1 ? `<a class="next" style="--c:var(--accent)" href="#book-${bi + 1}">${BOOKS[bi + 1][0]} →</a>` : ""}
    </div>` };
}

function searchScreen() {
  return { title: "Search", tab: "bible", back: "#bible", html: `
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
    return (!search.cmd || CMD_IDS[search.cmd - 1].includes(i)) &&
      (!q || (p[0] + " " + p[1] + " " + BOOKS[P_BOOK[i]][0]).toLowerCase().includes(q)); });
  $("#count").textContent = `${ids.length} of ${PASSAGES.length} passages`;
  $("#list").innerHTML = grouped(ids) || `<p class="muted">No passages match. Try another word.</p>`;
}

/* ---------- Router ---------- */
function route() {
  const [name, arg, sc] = (location.hash.slice(1) || "home").split("-");
  const want = name === "compiled" ? arg : sc;
  scope = want === "ot" || want === "nt" ? want : "all";
  const scr = name === "cmd" ? cmdScreen(+arg)
    : name === "compiled" ? compiledScreen()
    : name === "practices" ? practicesScreen()
    : name === "practice" ? practiceScreen(+arg)
    : name === "practicesall" ? practicesAllScreen()
    : name === "patterns" ? patternsScreen()
    : name === "pattern" ? patternScreen(+arg)
    : name === "growth" ? growthScreen()
    : name === "step" ? stepScreen(+arg)
    : name === "mature" ? matureScreen()
    : name === "arcs" ? arcsScreen()
    : name === "arc" ? arcScreen(+arg)
    : name === "health" ? healthScreen()
    : name === "stepsall" ? stepsAllScreen()
    : name === "grow" ? growScreen(arg)
    : name === "season" ? seasonScreen(+arg)
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
  const page = name + "-" + arg;
  if (route.last !== page) window.scrollTo(0, 0);
  route.last = page;
}
window.addEventListener("hashchange", route);
backBtn.addEventListener("click", () => { location.hash = backBtn.dataset.to; });

view.addEventListener("keydown", e => {
  const j = e.target.closest && e.target.closest("[data-jump]");
  if (j && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); j.click(); }
});
view.addEventListener("input", e => {
  if (e.target.id === "q") { search.q = e.target.value; renderSearch(); }
});
view.addEventListener("click", e => {
  const jump = e.target.closest("[data-jump]");
  if (jump) { document.getElementById(jump.dataset.jump)?.scrollIntoView({ behavior: "smooth" }); return; }
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
