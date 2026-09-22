# Deeb & Farah — Wedding Invitation

Static wedding invitation site.

- **Couple:** Deeb & Farah
- **Date:** Wednesday, 4 November 2026
- **Time:** 6:00 PM (Egypt local time — EET, UTC+02:00 in November)
- **Location:** https://maps.app.goo.gl/eGWmUu1BxhVgAKc9A?g_st=ic

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page markup, all content and social-share metadata |
| `style.css` | All styling, animations and responsive layout |
| `script.js` | Cover/open transition, music player, countdown, RSVP form |
| `assets/cover.svg` | Cover & countdown background (D & F monogram) |
| `assets/deeb-farah-couple.jpg` | Photo in the "Our forever begins" panel |
| `assets/deeb-farah-artwork.jpg` | Deeb & Farah wedding artwork (full size) |
| `assets/wedding-preview.jpg` | 1200×630 social sharing preview (WhatsApp / Facebook / X) |
| `assets/wedding-song.mp3` | Background music |

## Countdown

Set in `script.js`:

```js
const weddingDate = new Date("2026-11-04T18:00:00+02:00");
```

Egypt's summer time ends in October, so 4 November 2026 falls under EET
(UTC+02:00) — not UTC+03:00.

## RSVP — setup required

**The RSVP form currently sends nothing anywhere.** In `script.js`:

```js
const googleScriptUrl = "";
```

While this is empty the form is fully usable — it validates, shows the
confirmation message and resets — but no submission is transmitted.

To start collecting RSVPs, Deeb & Farah need **their own** Google Sheet and
Google Apps Script web app:

1. Create a new Google Sheet (e.g. "Deeb & Farah RSVPs") with header row:
   `Timestamp | Name | Message`.
2. In that sheet: **Extensions → Apps Script**, and paste:

   ```js
   function doPost(e) {
     const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
     const data = JSON.parse(e.postData.contents);
     sheet.appendRow([new Date(), data.name, data.message]);
     return ContentService.createTextOutput("OK");
   }
   ```

3. **Deploy → New deployment → Web app**, with
   *Execute as:* **Me**, *Who has access:* **Anyone**.
4. Copy the generated `.../exec` URL and paste it into `googleScriptUrl`
   in `script.js`.

Never point this at another couple's script URL or sheet.

## Social preview

Open Graph and Twitter Card tags in `index.html` point at
`https://kareemsobh.github.io/deep-Farah/assets/wedding-preview.jpg`.
If the site is published at a different URL, update `og:url`, `og:image`,
`og:image:secure_url` and `twitter:image` to match — social platforms
require absolute URLs.
