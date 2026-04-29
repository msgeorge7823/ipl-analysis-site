# IPL Analysis — Player & Coach Photos

This folder holds profile photos for players and coaches. The app (`src/components/ui/Avatar.tsx`)
renders these automatically wherever it shows a person's avatar (grids, tables, detail pages, squad lists).

## Folder structure

```
public/photos/
├── players/              ← player photos
│   ├── {playerId}.jpg           (generic — used for all seasons)
│   └── {playerId}_{season}.jpg  (season-specific — preferred when shown for that season)
└── coaches/              ← coach / support staff photos
    ├── {coachId}.jpg            (generic)
    └── {coachId}_{season}.jpg   (season-specific)
```

## Priority order (Avatar's resolution chain)

When rendering a player/coach avatar, the Avatar component tries these sources in order and
uses the first one that loads:

1. **`/photos/{players|coaches}/{id}_{season}.jpg`** — season-specific file (IPL-jersey-accurate)
2. **`/photos/{players|coaches}/{id}.jpg`** — generic fallback file
3. **Explicit URL** from `public/data/player-photos.json` or `public/data/coach-photos.json`
   (keyed by `{id}` or `{id}_{season}`)
4. **Colored-initials gradient** — final fallback if nothing loads

## Why season-specific files matter

IPL team jerseys change design most seasons — CSK yellow in 2008 is not the same as 2024 yellow,
and franchise rebrandings (Delhi Daredevils → Delhi Capitals, Kings XI Punjab → Punjab Kings, RCB
Bangalore → Bengaluru) mean even the team colors/logos on the shirt differ. For broadcast-grade
accuracy, each player's photo should match the jersey worn in the season being viewed.

Example — MS Dhoni (playerId `4a8a2e3b`):

```
players/4a8a2e3b_2011.jpg   ← photo of Dhoni in CSK's 2011 yellow jersey
players/4a8a2e3b_2018.jpg   ← photo from 2018 (return from suspension)
players/4a8a2e3b_2023.jpg   ← photo from 2023 title run
players/4a8a2e3b.jpg        ← generic fallback (any CSK year)
```

When the Squad tab for CSK 2011 is shown, Avatar tries `4a8a2e3b_2011.jpg` first. If it's missing,
it falls back to `4a8a2e3b.jpg`. If that's missing, it uses the initials.

## Where to source photos

- **Current 2026 squad:** official team websites (mumbaiindians.com, chennaisuperkings.com, etc.)
  and the official IPL site (iplt20.com) — look for squad pages with player headshots.
- **Historical seasons:** Wikipedia/Wikimedia Commons occasionally has IPL-jersey photos, but
  most are in national-team colours. Getty Images has comprehensive season-tagged coverage
  but is paywalled.
- **Franchise historical archives:** IPL franchises occasionally publish "throwback" galleries
  on their social media / official websites.

## How to look up a player ID

Player IDs are in `public/data/players.json`. Search for the player's name and copy the `id` field.

Example:
```json
{
  "id": "4a8a2e3b",
  "name": "MS Dhoni",
  ...
}
```

## URL-only photos (no local file needed)

If you don't want to host images locally, add a URL directly to `public/data/player-photos.json`
or `public/data/coach-photos.json`:

```json
{
  "photos": {
    "4a8a2e3b": "https://example.com/dhoni.jpg",
    "4a8a2e3b_2011": "https://example.com/dhoni-2011.jpg",
    "4a8a2e3b_2023": "https://example.com/dhoni-2023.jpg"
  }
}
```

## Image guidelines for best visual quality

- **Square aspect ratio** — avatars are rendered as circles, so portraits work best
- **Minimum 128 × 128 px**, 256 × 256 ideal, 512 × 512 for the detail-page header
- **File format: JPG** — the Avatar component only probes `.jpg` on the filesystem.
  If you need PNG/WebP, use the URL map in `player-photos.json` instead.
- **Focused on the face/shoulders** — the circle crop is tight so wide-angle action
  shots don't work well
- **Jersey visible** — the whole point of season-tagged photos is the jersey
