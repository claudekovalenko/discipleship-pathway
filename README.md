# Discipleship Pathway

What Scripture says about making disciples, from Genesis to Revelation, in the words of the ESV.

An installable app (PWA) that works offline once it has been opened.

**Live site:** https://claudekovalenko.github.io/discipleship-pathway/ (published by GitHub Actions on every push)

## What's inside

- **Commands:** Matthew 28:18–20, then six commands, each named in Scripture's own words:
  - "Follow me" (Matthew 4:19)
  - "Abide in my word" (John 8:31)
  - "Love one another" (John 13:34)
  - "You will be my witnesses" (Acts 1:8)
  - "Teaching them to observe" (Matthew 28:20)
  - "Entrust to faithful men" (2 Timothy 2:2)

  Each one opens every passage on that command, in canonical order.
- **Patterns:** seven threads traced through the whole Bible: One life poured into another, Generation to generation, Hear it · do it · teach it, Called then sent, Blessed to bless every nation, Life together, and By the Spirit not by might. Each shows a bar of all 66 books marking where it appears, then every passage in order.
- **Bible:** all 66 books, grouped by section (Law, History, Wisdom & Poetry, Major Prophets, Minor Prophets, Gospels, Acts, Paul's Letters, General Letters, Revelation). Tap a book to read its passages.
- **Search:** any word, book, or reference, filtered by command.

The verse text is always shown in full. Passages that show an example rather than giving a direct command are marked **Example**, and promises are marked **Promise**.

## Install it on a phone

1. Open the live site on your phone.
   - **iPhone (Safari):** Share → *Add to Home Screen*.
   - **Android (Chrome):** tap **Install** in the app bar, or use the menu → *Install app*.
2. It opens full-screen like a normal app and works without internet.

To try it on your computer, run `python3 -m http.server` in this folder and open http://localhost:8000.

## Files

| File | Purpose |
|---|---|
| `index.html` | App shell: top bar and tab bar |
| `app.css` | Styles, including light and dark mode |
| `app.js` | Screens and navigation |
| `data.js` | **All the content:** commands, sections, books, passages |
| `manifest.webmanifest`, `sw.js`, `icons/` | What makes it installable and offline |
| `.github/workflows/pages.yml` | Publishes the site to GitHub Pages on every push |

## Editing

All content is in `data.js`. To add a passage, add a row to `PASSAGES` in canonical order. The app works out the book from the reference:

```js
["Reference", commandId, "Heading", "“ESV text”", kind]
```

Command ids: 1 Follow me, 2 Abide in my word, 3 Love one another, 4 You will be my witnesses, 5 Teaching them to observe, 6 Entrust to faithful men. `kind`: 0 a direct command, 1 an example, 2 a promise. To add a pattern, add a row to `PATTERNS` with its name, a one-line summary, and the references it includes.

**After any change,** bump `CACHE` in `sw.js` (e.g. `dp-v6` → `dp-v7`) so installed apps download the update.

## Scripture copyright

Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.

Crossway allows up to 500 verses to be quoted without written permission, as long as the quotations don't make up a complete book of the Bible or 25% or more of the total text of the work. Most of this app's text is Scripture, so request permission from Crossway before distributing it widely. Keep the notice on the home screen.
