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
md += `${d.PATTERNS.length} patterns, each named by a phrase of Scripture and traced from Genesis to Revelation. Scripture quotations are from the ESV.\n\n`;
md += `> “You shall love the Lord your God with all your heart and with all your soul and with all your mind. This is the great and first commandment. And a second is like it: You shall love your neighbor as yourself. On these two commandments depend all the Law and the Prophets.” (Matthew 22:37–40)\n\n`;
md += `Patterns 1 and 2 are that focus. The rest flow from it.\n\n`;
md += `## Contents\n\n`;
d.PATTERNS.forEach((pt, n) => { md += `${n + 1}. [“${pt[0]}” (${pt[1]})](#${anchor(`${n + 1} ${pt[0]}`)})\n`; });
md += `\nThen: [Practices: With Jesus, and Afterward](#practices-with-jesus-and-afterward)\n`;

d.PATTERNS.forEach((pt, n) => {
  const refs = pt[2];
  const ot = refs.filter(r => bookOf(r) < 39), nt = refs.filter(r => bookOf(r) >= 39);
  md += `\n---\n\n## ${n + 1}. ${pt[0]}\n\n`;
  md += `*${pt[1]}* · Old Testament ${ot.length} · New Testament ${nt.length}\n\n`;
  [["Old Testament", ot], ["New Testament", nt]].forEach(([label, list]) => {
    if (!list.length) return;
    md += `### ${label}\n\n`;
    list.forEach(r => { md += `**${r}**\n> ${byRef.get(r)[2]}\n\n`; });
  });
});

md += `\n---\n\n# Practices: With Jesus, and Afterward\n\n`;
md += `${d.PRACTICES.length} practices. For each, what Jesus did with his disciples in the Gospels, then what his followers did afterward in Acts to Revelation.\n\n`;
d.PRACTICES.forEach((pr, n) => {
  md += `## ${n + 1}. ${pr[0]}\n\n*${pr[1]}*\n\n`;
  [["With Jesus (the Gospels)", pr[2]], ["Afterward (Acts to Revelation)", pr[3]]].forEach(([label, list]) => {
    md += `### ${label}\n\n`;
    list.forEach(r => { md += `**${r}**\n> ${byRef.get(r)[2]}\n\n`; });
  });
});
md += `\n---\n\nScripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. Some passages are shortened with an ellipsis (…). Read each one in its full context.\n`;
fs.writeFileSync(path.join(root, "PATTERNS.md"), md);
console.log(`Wrote PATTERNS.md: ${d.PATTERNS.length} patterns, ${d.PRACTICES.length} practices`);
