# Discipleship Pathway

A simple, printable guide to the commands of Scripture about making disciples, from Genesis to Revelation, quoted in the ESV.

Open `index.html` in any browser. It needs no build step and no installs, and works offline.

## What's inside

- **6 Simple Steps:** Follow → Abide → Love & Belong → Go & Tell → Teach to Obey → Multiply. Each step has key verses, the commands, one tool, and a "This week, I will…" checklist.
- **Every Command:** 55 passages across the Law, Prophets, Gospels, Acts, and Letters. Each one is tagged to a step, with a one-line way to obey it. You can search and filter them.
- **Simple Tools:** Gospel in 4 Words, Discovery Bible Study, Accountability Questions, My Story, Name List, Three-Thirds Meeting, Model-Assist-Watch-Leave, and the Multiplication Question.
- **Meeting Rhythm:** Look Back / Look Up / Look Forward.
- **Multiply:** the 2 Timothy 2:2 four-generation chain.

## Editing

All content lives in three arrays near the bottom of `index.html`: `STEPS`, `CMDS`, and `TOOLS`. To add a passage, add a row to `CMDS`:

```js
["Reference", eraIndex, stepNumber, "Short title", "“ESV text”", "Simple way to obey", isPattern]
```

`eraIndex`: 0 Law & History, 1 Wisdom & Prophets, 2 Gospels, 3 Acts, 4 Letters & Revelation.

## Scripture copyright

Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. Crossway allows up to 500 verses to be quoted without written permission, as long as the quotations don't make up a complete book of the Bible or 25% or more of the total text of the work. Keep the notice in the footer.
