// Builds PATTERNS.md: every pattern and practice with every verse, from data.js.
// Run from the repository root:  node scripts/compile-patterns.js
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const d = {};
new Function("d", fs.readFileSync(path.join(root, "data.js"), "utf8").replace(/const (\w+) =/g, "d.$1 ="))(d);

const byRef = new Map(d.PASSAGES.map(p => [p[0], p]));
const bookOf = ref => {
  let best = -1, len = 0;
  d.BOOKS.forEach((b, i) => [b[0], b[0] === "Psalms" ? "Psalm" : ""].forEach(n => {
    if (n && ref.startsWith(n + " ") && n.length > len) { best = i; len = n.length; }
  }));
  return best;
};
const anchor = s => s.toLowerCase().replace(/[^a-z0-9 ]/g, "").trim().replace(/ +/g, "-");

let md = `# Patterns Through the Whole Bible\n\n`;
md += `${d.PATTERNS.length} patterns, each named by a phrase of Scripture and traced from Genesis to Revelation. Scripture quotations are from the ESV unless marked NIV or KJV.\n\n`;
md += `> “You shall love the Lord your God with all your heart and with all your soul and with all your mind. This is the great and first commandment. And a second is like it: You shall love your neighbor as yourself. On these two commandments depend all the Law and the Prophets.” (Matthew 22:37–40)\n\n`;
md += `Patterns 1 and 2 are that focus. The rest flow from it.\n\n`;
md += `## Contents\n\n`;
d.PATTERNS.forEach((pt, n) => { md += `${n + 1}. [“${pt[0]}” (${pt[1]})](#${anchor(`${n + 1} ${pt[0]}`)})\n`; });
md += `\nThen: [The Mature Disciple](#the-mature-disciple) · [Practices: With Jesus, and Afterward](#practices-with-jesus-and-afterward) · [From New Believer to Mature Disciple](#from-new-believer-to-mature-disciple) · [Character Arcs](#character-arcs) · [Growth Toward Maturity](#growth-toward-maturity)\n`;

d.PATTERNS.forEach((pt, n) => {
  const refs = pt[2];
  const ot = refs.filter(r => bookOf(r) < 39), nt = refs.filter(r => bookOf(r) >= 39);
  md += `\n---\n\n## ${n + 1}. ${pt[0]}\n\n`;
  md += `*${pt[1]}* · Old Testament ${ot.length} · New Testament ${nt.length}\n\n`;
  [["Old Testament", ot], ["New Testament", nt]].forEach(([label, list]) => {
    if (!list.length) return;
    md += `### ${label}\n\n`;
    list.forEach(r => { md += `**${r}${byRef.get(r)[2] ? " (" + byRef.get(r)[2] + ")" : ""}**\n> ${byRef.get(r)[1]}${byRef.get(r)[2] ? ` (${byRef.get(r)[2]})` : ""}\n\n`; });
  });
});

md += `\n---\n\n# Practices: With Jesus, and Afterward\n\n`;
md += `${d.PRACTICES.length} practices. For each, what Jesus did with his disciples in the Gospels, then what his followers did afterward in Acts to Revelation.\n\n`;
d.PRACTICES.forEach((pr, n) => {
  md += `## ${n + 1}. ${pr[0]}\n\n*${pr[1]}*\n\n`;
  [["With Jesus (the Gospels)", pr[2]], ["Afterward (Acts to Revelation)", pr[3]]].forEach(([label, list]) => {
    md += `### ${label}\n\n`;
    list.forEach(r => { md += `**${r}${byRef.get(r)[2] ? " (" + byRef.get(r)[2] + ")" : ""}**\n> ${byRef.get(r)[1]}${byRef.get(r)[2] ? ` (${byRef.get(r)[2]})` : ""}\n\n`; });
  });
});
{
  const M = d.MATURE, vm = list => list.map(r => `**${r}${byRef.get(r)[2] ? " (" + byRef.get(r)[2] + ")" : ""}**\n> ${byRef.get(r)[1]}\n\n`).join("");
  const all = [...M.disciple, ...M.marks];
  md += `\n---\n\n# The Mature Disciple\n\nNamed in Scripture's own words: Jesus' definitions of a disciple, and the verses that use the words mature, perfect, complete, fully trained, fathers, and strong.\n\n`;
  md += `## At a glance\n\n**Jesus' marks of a disciple**\n\n${M.disciple.map(([q, rf, , lab], n) => `${n + 1}. **${lab}**: “${q}” (${rf})`).join("\n")}\n\n`;
  md += `**Marks of maturity**\n\n${M.marks.map(([q, rf, , lab], n) => `${n + 1 + M.disciple.length}. **${lab}**: “${q}” (${rf})`).join("\n")}\n\n`;
  md += `## What every disciple grows toward\n\n${vm(M.toward)}`;
  md += `## The marks, with every verse\n\n`;
  all.forEach(([q, rf, refs, lab], n) => { md += `### ${n + 1}. ${lab}\n\n“${q}” (${rf})\n\n${vm(refs)}`; });
  md += `## Signs of immaturity\n\n${vm(M.immature)}`;
}
{
  const tag = r => byRef.get(r)[2] ? " (" + byRef.get(r)[2] + ")" : "";
  const vq = list => list.map(r => `**${r}${tag(r)}**\n> ${byRef.get(r)[1]}\n\n`).join("");
  md += `\n---\n\n# Qualifying Characteristics\n\nScripture gives these as qualifications for overseers (1 Timothy 3; Titus 1), deacons (1 Timothy 3), older believers (Titus 2), the Lord's servant (2 Timothy 2), and those chosen to serve (Acts 6). Each has a plain name, with Scripture's own wording beside it.\n\n`;
  d.QUALIFY.groups.forEach(([g, , items]) => { md += `## ${g}\n\n${items.map(([nm, q, cite]) => `- **${nm}**: “${q}” (${cite})`).join("\n")}\n\n`; });
  md += `## The passages\n\n${vq(d.QUALIFY.passages)}`;
  md += `\n---\n\n# The Disciple Maker\n\nResponsibility before God, as a father in the faith, and as a father at home.\n\n`;
  d.RESP.forEach(([name, sub, groups]) => {
    md += `## ${name}\n\n${sub}.\n\n`;
    groups.forEach(([q, rf, refs], i) => { md += `### ${i + 1}. “${q}” (${rf})\n\n${vq(refs)}`; });
  });
}
md += `\n---\n\n# From New Believer to Mature Disciple\n\nEach step shows where Scripture places it, what the word says, and how Jesus did it with the Twelve.\n\n`;
d.PATHWAY.forEach(([ph, rf, order, word, jesus], n) => {
  md += `## Step ${n + 1}. “${ph}” (${rf})\n\n`;
  md += `### Where Scripture places this step\n\n${order.map(r => `**${r}${byRef.get(r)[2] ? " (" + byRef.get(r)[2] + ")" : ""}**\n> ${byRef.get(r)[1]}\n\n`).join("")}`;
  md += `### What the word says\n\n${word.map(r => `**${r}${byRef.get(r)[2] ? " (" + byRef.get(r)[2] + ")" : ""}**\n> ${byRef.get(r)[1]}\n\n`).join("")}`;
  md += `### With Jesus\n\n${jesus.map(r => `**${r}${byRef.get(r)[2] ? " (" + byRef.get(r)[2] + ")" : ""}**\n> ${byRef.get(r)[1]}\n\n`).join("")}`;
});
const vv = list => list.map(r => `**${r}${byRef.get(r)[2] ? " (" + byRef.get(r)[2] + ")" : ""}**\n> ${byRef.get(r)[1]}\n\n`).join("");
md += `\n---\n\n# Character Arcs\n\nEach life in the order it happened. Each moment is titled by a phrase from its own verse.\n\n`;
d.ARCS.forEach(([who, moments]) => {
  md += `## ${who}\n\n`;
  moments.forEach(([q, refs], i) => { md += `### ${i + 1}. “${q}”\n\n${vv(refs)}`; });
});
md += `## Examine yourselves\n\n${vv(d.HEALTH)}`;
const G = d.GROWTH;
const verses = list => list.map(r => `**${r}**\n> ${byRef.get(r)[1]}${byRef.get(r)[2] ? ` (${byRef.get(r)[2]})` : ""}\n\n`).join("");
md += `\n---\n\n# Growth Toward Maturity\n\n`;
md += `## The range of maturity\n\n${verses(G.range)}`;
md += `## How Jesus discipled the Twelve\n\nIn the order they appear in the Gospels.\n\n`;
G.jesus.forEach(([ph, rf, list], n) => { md += `### ${n + 1}. “${ph}” (${rf})\n\n${verses(list)}`; });
md += `## Before and after\n\nThe same disciples in the Gospels, then in Acts and their letters.\n\n`;
G.pairs.forEach(([who, before, after]) => { md += `### ${who}\n\n**Before (the Gospels)**\n\n${verses(before)}**After (Acts and the letters)**\n\n${verses(after)}`; });
md += `## Seasons of preparation\n\nEach life in the order it happened.\n\n`;
G.seasons.forEach(([who, list]) => { md += `### ${who}\n\n${verses(list)}`; });
md += `## A mature disciple\n\n${verses(G.mature)}`;
md += `\n---\n\nScripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. Passages marked (KJV) are from the King James Version, in the public domain. Passages marked (NIV) are taken from The Holy Bible, New International Version® NIV®. Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™ Used by permission. All rights reserved worldwide. Some passages are shortened with an ellipsis (…). Read each one in its full context.\n`;
fs.writeFileSync(path.join(root, "PATTERNS.md"), md);
console.log(`Wrote PATTERNS.md: ${d.PATTERNS.length} patterns, ${d.PRACTICES.length} practices, growth`);
