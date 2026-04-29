# IPL Analytics

A hobby project by an IPL enthusiast — a frontend playground for exploring how a modern, broadcast-grade analytics app for the Indian Premier League could feel. Built primarily as a UI/UX demonstration: every page is hand-designed for information density without clutter, with consistent dark-broadcast styling, era-accurate franchise identity, and interactive charts powered by real ball-by-ball data going back to the very first IPL season in 2008.

This is **not** an official IPL product, has no commercial intent, and is not affiliated with the BCCI, IPL, or any franchise. It exists because cricket statistics deserve a beautiful interface and I wanted to see how far a single developer could push one.

## What's inside

Twenty-four routes covering the full IPL surface area:

- **Home** — landing dashboard with season-winner timeline, top-player spotlights, trivia, and news.
- **Live** — broadcast-style "today" view with venue weather, squads, and head-to-head context.
- **Players** & **Player Detail** — searchable directory of every IPL player ever, plus deep career profiles with phase radars, dismissal pies, partnership bars, and venue splits.
- **Teams** & **Team Detail** — franchise hubs with current squad, coaching staff, all-time records, season-by-season form, head-to-head splits, SWOT analysis, and full logo evolution.
- **Seasons** & **Season Detail** — points table, schedule, playoff bracket, Orange/Purple Cap race, and award winners for each of the 19 seasons.
- **Matches** & **Match Detail** — full filterable match list, full scorecards, ball-by-ball commentary, fall-of-wickets, partnerships, weather, and player of the match.
- **Coaches** & **Coach Detail** — directory of 166+ head coaches and support staff with verified tenures, season-by-season W/L, and trophy counts.
- **Venues** & **Venue Detail** — pitch character, hosting history, win-rate splits, embedded map, and weather snapshot.
- **Records** — all-time leaderboards: most runs, most wickets, highest scores, fastest hundreds, biggest wins, every Cap winner.
- **Ratings** — an ICC-style 0–1000 player rating leaderboard computed in a Web Worker and cached locally.
- **Schedule** — calendar-style fixture view with month picker.
- **Analytics Lab** — interactive workspace where you pick players + filters and drill into phase, head-to-head, dismissal, partnership, and season charts. Workspaces are saveable in your browser and shareable via URL.
- **Auctions / Scouting** — cross-league scouting board pulling from BBL, PSL, CPL, SA20, ILT20, MLC, and several others, with IPL-crossover detection.
- **Education**, **News**, **Sponsors** — supporting reference content.

## Why I built it

I'm an IPL fan who wanted to:

1. Practice applying broadcast-quality design language to a real, data-rich domain instead of yet another to-do app.
2. Prove out an information-architecture approach that scales across 24 different page types without becoming inconsistent.
3. See if static, client-side computation could be fast enough to feel "live" — no backend, no API server, no operational overhead.

The data is real (CricSheet ball-by-ball going back to 2008, hand-curated coach and squad rosters, Open-Meteo weather), the calculations are real (the rating engine, SWOT analyzer, points table, partnerships, phase splits), and the design is original. CricBuzz and ESPNcricinfo informed certain UX patterns; nothing visual is copied.

## Design and UX choices worth pointing out

- **Dark broadcast palette** — single dark theme tuned for legibility on large screens. Team accents come from each franchise's primary kit colour, brightened for dark backgrounds.
- **Era-aware franchise identity** — every team logo, name, and colour respects the season being viewed. A 2015 RCB row shows the 2015 mark, not the modern Bengaluru one.
- **One canonical match-row component** — every list of matches across the app renders through the same component, so no two pages can drift apart on something subtle like home/away order.
- **Result canonicalization** — Super Overs, no-results, abandoned matches, and unplayed fixtures each get their own visual treatment and are never confused.
- **Avatar fallback chain** — every player headshot tries: season-specific local file → generic local file → external URL → coloured-initials gradient. No broken images, ever.
- **Cmd/Ctrl-K command palette** — global fuzzy search across players, teams, venues, and seasons.
- **Workspace sharing** — the Analytics Lab encodes your full state into a URL parameter so a collaborator opens an identical view.
- **Real venue weather** — past matches show ERA5 reanalysis at the kickoff hour; live and upcoming matches show forecast, refreshed every few minutes.

## Tech stack

- **React 19** + **TypeScript 6** (strict mode), bundled by **Vite 8**
- **TailwindCSS 4** with `clsx` + `tailwind-merge` for class composition
- **react-router 7** with route-level lazy loading (each page is its own bundle chunk)
- **@tanstack/react-query** for caching every static and computed query
- **Dexie / IndexedDB** for user-owned state (saved workspaces, watchlist, cached ratings)
- **Recharts** for every chart
- **Fuse.js** for fuzzy search
- **Web Workers** for the rating engine
- **Open-Meteo** (no API key) for weather; **Google Maps embed** (no API key) for venue maps

The whole app deploys as a static bundle. There is no backend.

## How the data layer works (one paragraph)

Raw CricSheet match files live in `raw-data/` (input only). Two pipeline scripts (`scripts/data-pipeline/process-cricsheet.ts` and `process-scouting.ts`) transform them into a tree of pre-computed JSON files under `public/data/`, which is what the browser actually fetches at runtime via `src/services/dataService.ts`. A Python sharder (`scripts/shard-data.py`) also splits the monoliths into per-entity files so individual records are easy to review on GitHub. Hand-curated metadata (coaches, sponsors, news, official squads, replacement signings, photos) lives alongside the derived data. The rating leaderboard, SWOT analysis, phase splits, and head-to-head views are computed client-side from the same JSON shards.

For a deeper walkthrough — folder by folder, hook by hook, including data flow diagrams and the project roadmap — see [`application-understanding.md`](./application-understanding.md).

## Running locally

```bash
npm install
npm run dev          # Vite dev server with HMR (default port 5173)
```

Other scripts:

```bash
npm run build        # tsc -b && vite build → dist/
npm run preview      # serve dist/ locally to verify the production build
npm run lint         # eslint
```

## Refreshing the data

```bash
# 1. Drop new CricSheet match files into raw-data/ipl_json/
# 2. Re-run the pipeline:
npx tsx scripts/data-pipeline/process-cricsheet.ts
# 3. (Optional) refresh scouting:
npx tsx scripts/data-pipeline/process-scouting.ts
# 4. Re-shard the monoliths so per-entity files stay aligned:
python3 scripts/shard-data.py
```

## Deployment

The site is published via Netlify with the configuration in [`netlify.toml`](./netlify.toml). Netlify clones the repo, runs `npm run build`, and serves only the resulting `dist/` directory — source files and the raw data tree stay in the repo for completeness but are never exposed at the deploy URL.

## Data attribution

- **CricSheet** ([cricsheet.org](https://cricsheet.org)) — open-source ball-by-ball cricket data for IPL (2008–present) and the eleven other T20 leagues used on the scouting board. This project would not exist without their work.
- **Open-Meteo** ([open-meteo.com](https://open-meteo.com)) — free weather API used for venue conditions on past, live, and upcoming matches.
- **Wikipedia** — biographical metadata, coach tenures, and player photos.
- **IPLT20.com** — squad and replacement-signing reconciliation.

Coaches, official squads, news, sponsors, and other curated metadata are hand-compiled and cited in the data files under `public/data/_backup/`. See [`data-docs/`](./data-docs/) for per-dataset documentation.

## Disclaimer

This is a personal project built for fun and to demonstrate frontend / data / UX work. No part of it is commercial, no advertising is shown, and no user data leaves the browser (workspaces and the watchlist are stored entirely in IndexedDB on the user's own machine). Logos and team colours are used nominatively to refer to the franchises whose data is being displayed.
