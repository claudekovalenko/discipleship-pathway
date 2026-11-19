# Discipleship Pathway

What Scripture says about making disciples, from Genesis to Revelation, in the words of the ESV (with a few newer verses in the NIV, each marked), centered on the focus of the whole Bible:

> “You shall love the Lord your God with all your heart and with all your soul and with all your mind. This is the great and first commandment. And a second is like it: You shall love your neighbor as yourself. On these two commandments depend all the Law and the Prophets.” (Matthew 22:37–40)

An installable app (PWA) that works offline once it has been opened.

**Live site:** https://claudekovalenko.github.io/discipleship-pathway/ (published by GitHub Actions on every push)

## What's inside

- **Home:** Matthew 22:37–40 first, with its two loves traced through the whole Bible; then the mission that flows from it.
- **Commands:** Matthew 28:18–20, then six commands, each named in Scripture's own words:
  - "Follow me" (Matthew 4:19)
  - "Abide in my word" (John 8:31)
  - "Love one another" (John 13:34)
  - "You will be my witnesses" (Acts 1:8)
  - "Teaching them to observe" (Matthew 28:20)
  - "Entrust to faithful men" (2 Timothy 2:2)

  Each one opens every passage on that command, in canonical order.
- **Patterns:** twenty-two threads through the whole Bible, each named by a phrase of Scripture. The first two are the focus:
  - "You shall love the LORD your God with all your heart" (Deuteronomy 6:5)
  - "You shall love your neighbor as yourself" (Leviticus 19:18)

  The rest flow from them:
  - "Be imitators of me, as I am of Christ" (1 Corinthians 11:1)
  - "One generation shall commend your works to another" (Psalm 145:4)
  - "To study… and to do it and to teach" (Ezra 7:10)
  - "Here I am! Send me" (Isaiah 6:8)
  - "I will build my church" (Matthew 16:18): establishing churches
  - "In you all the families of the earth shall be blessed" (Genesis 12:3)
  - "Two are better than one" (Ecclesiastes 4:9)
  - "Not by might, nor by power, but by my Spirit" (Zechariah 4:6)
  - "Pray earnestly to the Lord of the harvest" (Matthew 9:38)
  - "Lay your hand on him" (Numbers 27:18)
  - "Come and hear… and I will tell what he has done for my soul" (Psalm 66:16)
  - "The word of God increased and multiplied" (Acts 12:24)
  - "Feed my sheep" (John 21:17)
  - "Share in suffering as a good soldier of Christ Jesus" (2 Timothy 2:3)
  - "As for me and my house, we will serve the LORD" (Joshua 24:15)
  - "After fasting and praying they laid their hands on them" (Acts 13:3)
  - "Devote yourself to the public reading of Scripture" (1 Timothy 4:13)
  - "I will write it on their hearts" (Jeremiah 31:33)
  - "Love the sojourner" (Deuteronomy 10:19)
  - "God chose what is weak in the world to shame the strong" (1 Corinthians 1:27)

  Each shows a bar of all 66 books marking where it appears, then every passage in order.
- **Whole Bible · Old Testament · New Testament:** every pattern and command page has this switch. Links keep the choice, e.g. `#pattern-6-nt` opens "I will build my church" in the New Testament.
- **Practices:** seventeen practices of discipleship, each named by a phrase of Scripture. For each one, what Jesus did with his disciples (the Gospels) is set beside what his followers did afterward (Acts to Revelation): being with him, teaching, prayer, fasting, choosing and appointing, sending out two by two, receiving and hospitality, going to the next towns, reporting back, baptizing, breaking bread, singing, serving, sharing possessions, correcting and restoring, strengthening, and suffering. There is also an all-practices page (`#practicesall`).
- **The mature disciple** (top of the Pathway tab, `#mature`): what every disciple grows toward, then 21 marks named in Scripture's own words. Five are Jesus' own definitions of a disciple ("you are truly my disciples," "cannot be my disciple"), and sixteen come from verses that use the words mature, perfect, complete, fully trained, fathers, or strong. Each mark has a plain name and icon (such as "Abides in the Word" or "Discerns good and evil") with the Scripture quote it comes from beneath it, shown as tiles first and the full verses below, followed by Scripture's signs of immaturity.
- **Pathway:** from new believer to mature disciple, in ten steps, each named by a phrase of Scripture. Every step shows *where Scripture places this step* (the verses that show the order, such as Acts 2:37–42, Colossians 2:6–7, Hebrews 5:12–14 and 1 Timothy 3:6, 10), *what the word says*, and *with Jesus* (how he did it with the Twelve). There is also a one-page version (`#stepsall`). Under "Going deeper":
  - *The range of maturity:* infants and milk, children, young men and fathers, solid food for the mature.
  - *How Jesus discipled the Twelve:* thirteen steps in the order of the Gospels, from "Come and you will see" to "stay in the city until you are clothed with power."
  - *Before and after:* the same disciples in the Gospels, then in Acts and their letters.
  - *Seasons of preparation:* Joseph, Moses, Joshua, David, Elisha, Jesus, Paul and Timothy, each in the order of his life.
  - *A mature disciple:* fully trained, complete, mature in Christ.
- **Spiritual health** (on the Pathway tab):
  - *Character arcs:* Peter, David, Moses, Elijah, Jonah, Paul, John Mark, and two warnings (Saul and Solomon), each traced through life in order, strong moments and falls alike. Every moment is titled by a phrase from its own verse.
  - *Examine yourselves:* the checks for spiritual health that Scripture itself gives.
- **All patterns compiled:** every pattern and every verse on one page in the app (`#compiled`, or `#compiled-nt` for the New Testament only; it prints cleanly from a browser), and as a document: [PATTERNS.md](PATTERNS.md).
- **Bible:** all 66 books, grouped by section (Law, History, Wisdom & Poetry, Major Prophets, Minor Prophets, Gospels, Acts, Paul's Letters, General Letters, Revelation). Tap a book to read its passages. A book shows 0 when none of its verses state one of the themes.
- **Search** (inside the Bible tab): any word, book, or reference, filtered by command.

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
| `PATTERNS.md` | Every pattern and practice, with every verse, compiled into one document |
| `scripts/compile-patterns.js` | Rebuilds `PATTERNS.md` from `data.js` |
| `.github/workflows/pages.yml` | Publishes the site to GitHub Pages on every push |

## Editing

All content is in `data.js`.

**The rule for every theme:** a verse is listed under a command, pattern, or practice only when its own words plainly state that theme, so a reader can see the link without any explanation. If a verse needs an argument to connect it, leave it out.

1. Add the verse to `PASSAGES` in canonical order: `["Reference", "“ESV text”"]`, or `["Reference", "“NIV text”", "NIV"]` for an NIV verse. The app works out the book from the reference.
2. Add its reference to the list it belongs to:
   - a command: the fifth item of its row in `COMMANDS`
   - a pattern: the third item of its row in `PATTERNS`
   - a practice: the "with Jesus" list (Gospels only) or the "afterward" list (Acts to Revelation only) in `PRACTICES`
   - the pathway: a step in `PATHWAY` (where Scripture places it, what the word says, with Jesus)
   - the mature disciple: a mark in `MATURE` (only verses that use Scripture's maturity words, or Jesus' definitions of a disciple)
   - a character arc: a moment in `ARCS`, titled by a phrase from its own verse, in the order of the life
   - growth: a list in `GROWTH` (seasons are in the order of each life, not book order)

A passage that is in no list is never shown, so remove it from `PASSAGES` too.

**After any change,** run `node scripts/compile-patterns.js` to rebuild `PATTERNS.md`, and bump `CACHE` in `sw.js` (e.g. `dp-v17` → `dp-v18`) so installed apps download the update.

## Scripture copyright

Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission. All rights reserved.

Passages marked NIV are taken from The Holy Bible, New International Version® NIV®. Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.™ Used by permission. All rights reserved worldwide.

Crossway and Biblica each allow up to 500 verses of their translation to be quoted without written permission, as long as the quotations don't make up a complete book of the Bible or 25% or more of the total text of the work. The app currently quotes about 466 ESV verses and 82 NIV verses. **Add new verses in the NIV**, since the ESV is near its limit. Most of this app's text is Scripture, so request permission from both publishers before distributing it widely. Keep both notices on the home screen.
