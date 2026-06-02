# Discord Tierlist Maker

A single-page web app for ranking Discord server members by dragging their avatars into customizable tier rows (S/A/B/C/D/F). Export the result as a PNG or save/reload sessions as JSON.

## Features

- Load members directly from any Discord server using a Bot Token + Guild ID
- Drag-and-drop avatars between tier rows and the unranked pool (powered by SortableJS)
- Add, delete, reorder, rename, and recolor tier rows on the fly
- Export the tierlist as a PNG image (2× resolution via html2canvas)
- Export and reimport sessions as JSON — no need to re-fetch Discord data

## Setup

**Prerequisites:** Node.js (v16+)

```bash
git clone https://github.com/YOUR_USERNAME/discord-tierlist.git
cd discord-tierlist
npm install
node server.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create an application.
2. Under **Bot**, create a bot and copy the **Bot Token**.
3. Enable **Server Members Intent** under Bot → Privileged Gateway Intents.
4. Invite the bot to your server using OAuth2 → URL Generator (scope: `bot`, no special permissions needed).
5. Copy your server's **Guild ID** (right-click server → Copy Server ID with Developer Mode on).

## Usage

1. Enter your **Bot Token** and **Guild ID** in the app, then click **Load Members**.
2. Members appear in the **Unranked** pool at the bottom.
3. Drag avatars into tier rows to rank them.
4. Click a tier label to rename it or change its color.
5. Use **+ Add Row** to insert new tiers; use the ✕ button on any row to remove it.
6. Click **Save / Download** to export a PNG, or **Export Data** to save a JSON file you can reload later.

## Project Structure

```
server.js        — Express server (port 3000), Discord API proxy
public/
  index.html     — Entire frontend: HTML + CSS + JavaScript in one file
package.json
```

The backend exists solely to proxy Discord API requests and avoid CORS issues. The bot token is never logged or stored server-side.

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

## Dependencies

| Package | Role |
|---|---|
| express | HTTP server + static file serving |
| node-fetch v2 | Server-side Discord API calls |
| SortableJS (CDN) | Drag-and-drop |
| html2canvas (CDN) | PNG export |

## License

MIT
