# Discord Tierlist Maker

A single-page web app for ranking Discord server members by dragging their avatars into customizable tier rows (S/A/B/C/D/F). Export the result as a PNG or save/reload sessions as JSON.

## Live App

**[https://discord-tierlist-maker-bot.onrender.com/](https://discord-tierlist-maker-bot.onrender.com/)**

> **Note:** The app is hosted on Render's free tier. If it hasn't been used recently, the first load may take up to **30 seconds** to wake up. Just wait a moment and refresh if needed.

---

## Features

- Load members directly from any Discord server using just a Guild ID
- Drag-and-drop avatars between tier rows and the unranked pool (powered by SortableJS)
- Add, delete, reorder, rename, and recolor tier rows on the fly
- Export the tierlist as a PNG image (2× resolution via html2canvas)
- Export and reimport sessions as JSON — no need to re-fetch Discord data

---

## How to Use

### Step 1 — Add the Bot to Your Server

Click the link below to invite the bot to your Discord server:

**[Invite Bot to Server](https://discord.com/oauth2/authorize?client_id=1511248300689588234&permissions=66560&integration_type=0&scope=bot)**

1. Click the link above
2. Select the server you want to use from the dropdown
3. Click **Authorize**
4. Complete the CAPTCHA if prompted

> The bot only needs to be a member of the server — it does not need admin or any special permissions.

---

### Step 2 — Get Your Server's Guild ID

1. Open Discord and go to **User Settings → Advanced**
2. Turn on **Developer Mode**
3. Right-click your server name in the left sidebar
4. Click **Copy Server ID** — this is your Guild ID

---

### Step 3 — Use the App

1. Open [https://discord-tierlist-maker-bot.onrender.com/](https://discord-tierlist-maker-bot.onrender.com/)
2. Paste your **Guild ID** into the field
3. Click **Load Members** — all server members appear in the Unranked pool
4. **Drag avatars** into tier rows to rank them
5. Click a **tier label** to rename it or change its color
6. Use **+ Add Row** to create new tiers; click **✕** on a row to remove it
7. Click **Save / Download** to export a PNG image of your tierlist
8. Click **Export Data** to save a `.json` file — reload it anytime without re-fetching

---

## Save File Format (JSON)

```json
{
  "version": 1,
  "savedAt": "ISO timestamp",
  "members": { "userId": { "id", "username", "displayName", "avatarUrl" } },
  "tiers": [{ "label": "S", "color": "#ff4444", "memberIds": ["123"] }],
  "pool": ["456", "789"]
}
```

---

## Dependencies

| Package | Role |
|---|---|
| express | HTTP server + static file serving |
| node-fetch v2 | Server-side Discord API calls |
| SortableJS (CDN) | Drag-and-drop |
| html2canvas (CDN) | PNG export |

---

## License

MIT
