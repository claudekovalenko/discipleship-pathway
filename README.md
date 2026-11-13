# Discipleship Pathway

A simple, printable guide to the commands of Scripture about making disciples, from Genesis to Revelation, quoted in the ESV.

An installable app (PWA) with a simple tab-based interface: **Steps · Bible · Tools · Meet**. It works offline once it has been opened.

## Install it on a phone

1. Host the folder on any HTTPS site. The easiest option is GitHub Pages: go to *Settings → Pages → Deploy from branch*, and choose the branch and `/ (root)`.
2. Open the link on your phone.
   - **iPhone (Safari):** Share → *Add to Home Screen*.
   - **Android (Chrome):** tap **Install** in the app bar, or use the menu → *Install app*.
3. It opens full-screen like a normal app and works without internet.

To try it on your computer, run `python3 -m http.server` in this folder and open http://localhost:8000. Offline mode and installing need `http://localhost` or HTTPS. Opening the file directly still works, but without offline support.

## What's inside

- **6 Simple Steps:** Follow → Abide → Love & Belong → Go & Tell → Teach to Obey → Multiply. Each step has key verses, the commands, one tool, and a "This week, I will…" checklist.
- **Every Command:** 55 passages across the Law, Prophets, Gospels, Acts, and Letters. Each one is tagged to a step, with a one-line way to obey it. You can search and filter them.
- **Simple Tools:** practices taken straight from Scripture: The Gospel (1 Cor 15:3–4), Study · Do · Teach (Ezra 7:10), the “One Another” commands, Tell What the Lord Has Done (Mark 5:19), Pray for Open Doors (Col 4:3), Hear and Do (Matt 7:24), Imitate (Phil 4:9), and Entrust (2 Tim 2:2).
- **Meet Together:** the four devotions of Acts 2:42.
- **Multiply:** the 2 Timothy 2:2 four-generation chain.

## Files

| File | Purpose |
|---|---|
| `index.html` | App shell: top bar and tab bar |
| `app.css` | Styles, including light and dark mode |
| `app.js` | Screens, navigation, checklist, install button |
| `data.js` | **All the content** (steps, passages, tools) |
| `manifest.webmanifest`, `sw.js`, `icons/` | What makes it installable and offline |

## Editing

All content lives in three arrays in `data.js`: `STEPS`, `CMDS`, and `TOOLS`. To add a passage, add a row to `CMDS`:

```js
["Reference", eraIndex, stepNumber, "Short title", "“ESV text”", "Simple way to obey", isPattern]
```

`eraIndex`: 0 Law & History, 1 Wisdom & Prophets, 2 Gospels, 3 Acts, 4 Letters & Revelation.

**After any change,** bump `CACHE` in `sw.js` (e.g. `dp-v1` → `dp-v2`) so installed apps download the update.

## Scripture copyright

Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved. Crossway allows up to 500 verses to be quoted without written permission, as long as the quotations don't make up a complete book of the Bible or 25% or more of the total text of the work. Keep the notice in the footer.
