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
- **Patterns:** eight threads through the whole Bible, each named by a phrase of Scripture:
  - "Be imitators of me, as I am of Christ" (1 Corinthians 11:1)
  - "One generation shall commend your works to another" (Psalm 145:4)
  - "To study… and to do it and to teach" (Ezra 7:10)
  - "Here I am! Send me" (Isaiah 6:8)
  - "I will build my church" (Matthew 16:18): establishing churches
  - "In you all the families of the earth shall be blessed" (Genesis 12:3)
  - "Two are better than one" (Ecclesiastes 4:9)
  - "Not by might, nor by power, but by my Spirit" (Zechariah 4:6)

  Each shows a bar of all 66 books marking where it appears, then every passage in order.
- **Whole Bible · Old Testament · New Testament:** every pattern and command page has this switch. Links keep the choice, e.g. `#pattern-4-nt` opens "I will build my church" in the New Testament.
- **Bible:** all 66 books, grouped by section (Law, History, Wisdom & Poetry, Major Prophets, Minor Prophets, Gospels, Acts, Paul's Letters, General Letters, Revelation). Tap a book to read its passages.
- **Search:** any word, book, or reference, filtered by command.

Each passage is shown as Scripture alone: the ESV text and its reference, with no added headings or notes.

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
["Reference", commandId, "“ESV text”"]
```

Command ids: 1 Follow me, 2 Abide in my word, 3 Love one another, 4 You will be my witnesses, 5 Teaching them to observe, 6 Entrust to faithful men. To add a pattern, add a row to `PATTERNS` with a phrase of Scripture to name it, where that phrase is from, and the references it includes.

**After any change,** bump `CACHE` in `sw.js` (e.g. `dp-v8` → `dp-v9`) so installed apps download the update.

## Scripture copyright

Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.

Crossway allows up to 500 verses to be quoted without written permission, as long as the quotations don't make up a complete book of the Bible or 25% or more of the total text of the work. Most of this app's text is Scripture, so request permission from Crossway before distributing it widely. Keep the notice on the home screen.
