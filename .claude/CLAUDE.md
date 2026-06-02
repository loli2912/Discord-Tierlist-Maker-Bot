# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Discord Tierlist Maker** — a single-page web app where you load members from a Discord server, then drag-and-drop their avatars into a customizable S/A/B/C/D/F tier table. Sessions can be exported as a PNG image or saved as a JSON data file and reloaded later.

---

## Running the Project

```bash
npm install       # first time only
node server.js    # starts on http://localhost:3000
```

No build step. No framework. Refresh the browser after editing `public/index.html`.

---

## Architecture

```
server.js          — Express server (port 3000)
public/
  index.html       — Entire frontend: HTML + CSS + JS in one file
```

**Why a backend at all?** Discord's API blocks direct browser requests (CORS). The Express server acts as a thin proxy — it receives the bot token + guild ID from the browser, calls Discord's API server-side, and returns sanitized member data. The token is never logged or stored.

### Data flow

1. User enters Bot Token + Guild ID → `POST /api/test-token` validates the token → `POST /api/members` fetches guild members
2. Server calls `GET /guilds/{id}/members?limit=1000` (paginated) with `Authorization: Bot {token}`
3. Returns `[{ id, username, displayName, avatarUrl }]` — bots filtered out, avatar URLs constructed from Discord CDN
4. Frontend renders draggable avatar tiles in the Unranked pool

### Frontend state (all in `public/index.html`)

| Variable | Purpose |
|---|---|
| `tiers` | Array of `{ id, label, color }` — defines row order and appearance |
| `allMembers` | Full member array, kept in memory for export |
| `sortables` | SortableJS instances, destroyed and recreated on every `renderTiers()` call |
| `nextId` | Auto-increment for tier row IDs |

Key functions:
- `renderTiers()` — rebuilds all tier rows and the controls column from `tiers` state; preserves tile positions by reading from DOM before clearing
- `initSortables()` — scans all `.tier-items` + `#pool` and attaches SortableJS with `group: 'tierlist'`
- `exportData()` — snapshots current state to `tierlist-data.json` (self-contained: includes member data so Discord isn't needed to reload)
- `loadFromFile(file)` — restores a saved session from a JSON file, bypassing the Discord fetch entirely

### Save formats

**PNG export** (`Save / Download`) — `html2canvas` captures `#tierlist` at 2× scale. The controls column (`#controls-col`) and Add Row button are hidden before capture and restored after.

**JSON export** (`Export Data`) — format:
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

## Discord Bot Requirements

- Bot must be added to the guild (Guild Install, not User Install)
- **Server Members Intent** must be enabled: Discord Developer Portal → App → Bot → Privileged Gateway Intents
- No special permissions needed beyond being a member of the server
- For guilds with >1000 members, the server paginates automatically using `after` cursor

---

## Key Dependencies

| Package | Role |
|---|---|
| `express` | HTTP server + static file serving |
| `node-fetch` v2 | Server-side Discord API calls (CommonJS compatible) |
| SortableJS (CDN) | Drag-and-drop between tier rows and pool |
| html2canvas (CDN) | PNG screenshot export |

---

## Things to Know

- **Tier rows are fully dynamic** — no hardcoded HTML. All rows are created by `renderTiers()` from the `tiers` array. Adding, deleting, and reordering rows all mutate `tiers` and call `renderTiers()`.
- **Label editing** — tier labels are `contenteditable` divs. Clicking a label also opens the color picker popup (`#color-picker`).
- **Light color detection** — `isLight(hex)` uses luminance formula to switch label text to dark when the background color is bright (e.g. yellow).
- **No database, no auth, no persistent state** — everything lives in the browser session or in exported files.
