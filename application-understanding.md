# IPL Analytics — Application Understanding

A complete walkthrough of how this codebase is built, where its data comes from, what every piece does, and what's left to ship. Written so you can pitch the app to anyone, learn the moving parts top-to-bottom, and pick it up months from now without re-deriving anything.

---

## 1. What this is, in one paragraph

A broadcast-grade IPL analytics web app covering **every season from 2008 to the live 2026 season**. It serves a single static React bundle plus a tree of pre-computed JSON files; everything renders client-side. It includes 24 routes (Home, Players, Teams, Matches, MatchDetail, Seasons, Venues, Coaches, Records, Ratings, Schedule, Analytics Lab, Auctions/Scouting, Live, News, Sponsors, Education, plus their detail pages). The data layer is built from CricSheet ball-by-ball JSON dumps for IPL + 11 other T20 leagues, then enriched with hand-curated metadata (coaches, sponsors, news, squads, photos). Featured systems include an ICC-style 0–1000 player rating engine running in a Web Worker, a SWOT analyzer for teams, a phase-by-phase analytics workspace shareable via URL, an Open-Meteo weather card on every match, and a global Ctrl/Cmd-K command palette. Target audience: IPL franchises, broadcast partners, and serious fans. Target launch: end of IPL 2026 season (May 31, 2026).

---

## 2. Tech stack — every dependency and the role it plays

### Build & language
- **Vite 8** — dev server, HMR, production bundler. Vite config (`vite.config.ts`) sets the `@/` import alias and explicitly excludes `public/data/`, `raw-data/`, `scripts/`, etc. from the file-watcher (those trees are huge and would thrash the watcher otherwise).
- **TypeScript 6** in strict mode (`noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`). Path alias `@/*` → `./src/*`.
- **ESLint 9** with `typescript-eslint`, `react-hooks`, `react-refresh` configs.
- **`@vitejs/plugin-react`** — React Fast Refresh.
- **Node 24+** typings via `@types/node`.

### React & routing
- **React 19** — uses the new JSX transform (`react-jsx`), `StrictMode`, lazy + Suspense for route-level code-splitting.
- **`react-router-dom` v7** — client-side routing. Layout uses `<Outlet/>`. All 24 pages are `lazy()`-imported in `src/App.tsx` so each becomes its own bundle chunk.

### Data & state
- **`@tanstack/react-query` v5** — primary remote/derived state. One central hooks file (`src/hooks/useData.ts`) exposes ~30 typed query hooks. Cache policy: 1-hour `staleTime` for static shards, 30 minutes for computed analytics, 0 for IndexedDB-backed user state. `retry: 1` so one bad fetch doesn't cascade.
- **`dexie` + `dexie-react-hooks`** — IndexedDB wrapper. `src/lib/db.ts` defines five tables: `bbb` (cached ball-by-ball), `ratings` (cached rating leaderboard), `workspaces` (saved analytics bundles), `watchlist` (starred players), `dataVersions` (cache-bust markers).
- **Custom `useLocalStorage`** hook for tiny UI prefs.

### UI & styling
- **TailwindCSS 4** + the `@tailwindcss/vite` plugin. Theme tokens are also declared inline in `index.html`'s `tailwind.config` block (`bg`, `card`, `border`, `accent`, `gold`, etc.) for the dark broadcast-style palette.
- **`clsx` + `tailwind-merge`** combined into the `cn()` helper (`src/lib/utils.ts`) — every component uses this to compose classes.
- **`framer-motion`** — declarative animation primitives (used sparingly).
- **`lucide-react`** — icon set.
- **`class-variance-authority`** — variant prop pattern (utility, light usage).
- **Inter font** loaded from Google Fonts via `<link>` tags in `index.html`.

### Visualisation
- **`recharts` 3** — every chart in the app is built on Recharts: `CapRaceChart` (line), `DismissalPie` (pie), `H2HComparisonChart` (grouped bar), `PartnershipBar` (horizontal bar), `PhaseRadar` (radar), `SeasonProgressionChart` (area), `VenueStatsChart` (bar). Tooltip styling and color palettes are kept consistent across files.

### Search
- **`fuse.js` 7** — fuzzy search engine. Used by:
  - `Navbar` → `SearchModal` (Ctrl/Cmd-K) for global search across players, teams, venues, seasons.
  - `Players` page for in-list filtering.
  - `Analytics` page for the player-picker.

### Web APIs (no API keys required)
- **Open-Meteo** — weather. Two endpoints used: `/v1/forecast` for matches in the last 14 days or future dates, and `/v1/archive` (ERA5 reanalysis) for historical matches. A geocoding endpoint resolves "venue + city" to lat/lon.
- **Google Maps embed** — venue map via the no-key `?output=embed` URL. Directions / "view on Maps" links are normal `maps.google.com` URLs.

### Browser features
- **Web Workers** — the rating engine (`src/workers/rating-worker.ts`) runs in a worker so the 1,200+ matches × 19 seasons × per-player aggregation doesn't lock up the main thread.
- **IndexedDB** — via Dexie, see above.
- **localStorage** — UI preferences only.

---

## 3. Repository tour

```
.
├── index.html                # Vite entry. Inline Tailwind config + Inter font.
├── package.json              # Deps + 4 scripts (dev/build/lint/preview).
├── vite.config.ts            # Build config + watcher exclusions.
├── tsconfig.{json,app,node}  # TS project references.
├── eslint.config.js          # Flat ESLint config.
│
├── public/                   # Served verbatim. Anything under /public/X is reachable at /X.
│   ├── favicon.svg
│   ├── icons/                # cricket-ball.svg, cricket-bat.svg
│   ├── teams/                # Era-aware team logos (e.g. mi-2008.png, kxip-2012.png).
│   ├── photos/               # player + coach headshots (id.jpg or id_{season}.jpg).
│   └── data/                 # ★ THE STATIC DATA LAYER — see §5.
│
├── src/                      # Application code — see §4.
│   ├── App.tsx               # Router + QueryClient + lazy routes.
│   ├── main.tsx              # ReactDOM root.
│   ├── pages/                # 24 route components.
│   ├── components/           # Charts, layout chrome, shared UI atoms.
│   ├── hooks/                # useData, useRatings, useLocalStorage.
│   ├── services/             # Data + analytics business logic.
│   ├── workers/              # rating-worker.ts.
│   ├── lib/                  # Constants, db, pure utilities.
│   └── types/                # Shared TS types.
│
├── scripts/                  # Data pipeline + auditing tools (Python + TS).
│   ├── data-pipeline/        # process-cricsheet.ts + supporting JSON registries.
│   ├── data-audit/           # audit_player_data.py + reports/.
│   ├── shard-data.py         # Splits monoliths into per-entity files.
│   └── update-2026-matches.py
│
├── raw-data/                 # ★ INPUTS to the pipeline — not served by the app.
│   ├── ipl_json/             # 1,200+ CricSheet JSON files (one per match).
│   ├── ipl_json.zip          # Compressed source from CricSheet.
│   └── leagues/              # BBL, PSL, CPL, SA20, etc. — for the scouting board.
│
├── data-docs/                # Human-readable docs of every JSON dataset.
│   ├── README.md             # Index of all data files + record counts + which page consumes each.
│   └── {teams,players,coaches,seasons,...}.md
│
└── root-files/               # Planning + design + business proposal docs (legacy, large).
    ├── ipl-business-proposal.md
    ├── ipl-implementation-structure.md
    ├── ipl-frontend-only-design.md
    ├── techstack.md / techstack-usgae.md
    └── app-navigation.md
```

---

## 4. Source code architecture (`src/`)

The app is a layered SPA. Reading top-down:

```
URL change
   ↓
react-router resolves route
   ↓
Lazy chunk loads (one chunk per page)
   ↓
Page component runs
   ↓
useData* hooks (React Query)
   ↓
services/* (dataService + analytics services)
   ↓
fetch(/data/...) or IndexedDB (dexie)
   ↓
Recharts / TeamBadge / PlayerLink etc. render derived data
```

### 4.1 Entry & shell
- **`src/main.tsx`** — mounts `<App/>` into `#root` inside `<StrictMode>`.
- **`src/App.tsx`** — wires up:
  - The shared `QueryClient` (30-min default `staleTime`, retry=1).
  - `<BrowserRouter>` + the route table for all 24 pages.
  - `<Suspense fallback={<PageLoader/>}>` so each lazy-loaded page chunk shows a spinner while it downloads.
  - Routes live inside `<Layout/>` which holds the navbar + footer + main outlet.

### 4.2 `src/lib/` — pure utilities, no React
- **`utils.ts`** — `cn(...inputs)` Tailwind class composer.
- **`db.ts`** — Dexie singleton. Defines `IPLDatabase` with five tables; exports `db`.
- **`constants.ts`** — Team palette (`TEAM_COLORS`), short codes (`TEAM_SHORT`), era-aware logos (`TEAM_LOGO_TABLE` + `getTeamLogo(team, season?)`), franchise rebrand groups (`getFranchiseGroup`, `getFranchiseLogoEvolution`), and the navbar route table (`NAV_ITEMS_PRIMARY`, `NAV_ITEMS_MORE`, `NAV_ITEMS`).
- **`matchResult.ts`** — Canonical "won by N runs / N wickets / Super Over" formatter. Handles the nasty edge cases: ties stored with stale margins, no-result vs. abandoned, future fixtures vs. completed matches. Returns `{ text, kind }`.
- **`matchTime.ts`** — Infers IST kickoff hour (15:30 vs 19:30) by looking at how many matches share that date (double-header detection). Used by the schedule UI and the weather service.
- **`matchVenue.ts`** — Decides which team is home vs away for league matches at home venues. Returns `null` for playoffs (neutral) and overseas seasons (2009 SA, 2014/2020/2021 UAE legs) so the caller falls back to innings-order display.
- **`nationality.ts`** — Maps player names to country (India, Australia, NZ, SA, WI, England, SL, Afghanistan, Pakistan, Other). Powers the overseas ✈ badge and capped-vs-uncapped detection. Built from a hand-curated set + the squads-2026 file's explicit `overseas` boolean.

### 4.3 `src/types/` — TypeScript domain
- **`index.ts`** — `Player`, `Team`, `Match`, `InningsSummary`, `Delivery`, `BattingEntry`, `BowlingEntry`, `Partnership`, `Season`, `Venue`, `PlayerStats`, `PlayerRating`, `DataManifest`. The `Match` type doubles as both fixture and completed match (toss/innings absent for fixtures).
- **`coach.ts`** — `Coach`, `CoachTenure`, `CoachSeasonResult`, `CoachCareerTotals`, `CoachRoleType` (15 staff roles), `CoachFinish` (Champion / Runner-up / Qualifier 1 / ... / Group Stage / Suspended).

### 4.4 `src/services/` — data + analytics business logic

Eight services. Each is a stateless module that returns Promises; React Query in the hooks layer caches the results.

- **`dataService.ts`** — The single fetch boundary. All other services and hooks go through this. It has four groups:
  1. `bulk` — reads from `public/data/_backup/*.json` (the monolith archive). Used for full-list views.
  2. `perSeason` — reads `public/data/{matches,bbb,scorecards,partnerships,cap-race}/season-{YYYY}.json`.
  3. `scouting` — reads `public/data/scouting/{league}.json`.
  4. `shards` — reads per-entity files like `public/data/teams/{id}.json`. Used for detail pages so they don't load the full monolith.

- **`playerStatsService.ts`** — The biggest derived-analytics module (~1,150 lines). All functions accept *display names* (because BBB data uses names as keys), not IDs. Provides:
  - `getPhaseWiseBatting/Bowling` — Powerplay (overs 0–5), Middle (6–15), Death (16–19) splits.
  - `getH2HBatterVsBowler` — head-to-head between two players.
  - `getPlayerVsTeam`, `getPlayerVsVenue` — opponent / venue splits.
  - `getDismissalBreakdown` — pie data: caught / bowled / lbw / stumped / run-out.
  - `getBattingPositionStats` — performance grouped by batting position.
  - `getPlayerPartnerships` — favourite partners.
  - `getSeasonBreakdown` — season-by-season totals.
  - `getMatchBattingScores`, `getMatchBowlingScores` — innings rows for one season.
  - `getTeamPlayerStats` — roster-level rollup.
  - In-memory cache by stable JSON-stringified cache key; legal-delivery / over-counting helpers handle the cricket-specific "wides don't count, no-balls count for bowler-faced but not batter-balls" rules.

- **`pointsTableService.ts`** — Computes IPL standings from match data. Implements the canonical rules: 2 pts win, 1 pt tie, 1 pt no-result, 0 loss; NRR tiebreaker = (runs scored / overs faced) − (runs conceded / overs bowled); only league-stage matches counted; abandoned = NR for both teams and excluded from NRR. Also exports `getPlayoffMatches` and `getPlayoffFormat` (modern 2011+ format vs. 2008–2010 classic semi-final format).

- **`teamAnalysisService.ts`** — Builds the SWOT report for a team-season. Walks the squad, aggregates per-player phase / dismissal / role stats, then converts that numeric profile into qualitative strengths/weaknesses/opportunities/threats callouts. Honours team aliases so historical names merge into the current franchise's record.

- **`ratingService.ts`** — Manages the rating-worker lifecycle. Module-level singleton worker, deduped in-flight `computePromise`, IndexedDB caching of results in the `db.ratings` table with a `dataVersions` cache-bust marker. Exposes `computeRatings`, `getRatings` (cache-or-compute), `getCachedRatings`, `getPlayerRating`, `hasCachedRatings`, `clearCache`, `terminateWorker`.

- **`weatherService.ts`** — Open-Meteo wrapper. Picks endpoint by match phase (`past` / `live` / `future`), passes `timezone=auto` so hourly arrays come back in venue-local clock, then converts the IST kickoff hour into venue-local for foreign matches. Returns `{ matchPhase, temperature, humidity, windSpeed, cloudCover, precipitationMm, weatherCode, ... }` plus helper classifiers `weatherCodeCategory`, `dewLikelihood`, `rainRisk`.

- **`workspaceService.ts`** — CRUD for analytics workspaces (Dexie). Plus URL share encoding: `generateShareUrl({playerIds, filters})` base64-encodes the state into a `?ws=` query param; `loadFromUrl` decodes it.

- **`watchlistService.ts`** — CRUD over the watchlist table (Dexie). Idempotent add, simple remove/get/check/update-notes.

### 4.5 `src/workers/rating-worker.ts` — the rating engine

Runs entirely off-main-thread. Receives `{type:'COMPUTE'}` from the service, posts back `PROGRESS` events per season then a final `COMPLETE`. Calibration:

- Output range: 0–1000 (ICC-style).
- Each match yields a **Match Performance Score (MPS)** for each player.
  - **Batting MPS** = `runs × 1.0 + fours × 0.5 + sixes × 1.0 + SR-relative bonus (above 130 baseline) + 50/100 milestone bonuses + duck penalty + not-out finisher bonus`.
  - **Bowling MPS** = `wickets × 25 + (8.0 − economy) × overs × 1.5 + maidens × 12 + dots × 1.0 + 3W/5W bonuses`.
- A 30-match exponentially-weighted rolling MPS is then sigmoid-mapped to 0–1000.
- **Lifecycle rules** (mirroring ICC):
  - Players start at base 200; new players get a **damping factor** until they have ~10 matches.
  - **Seasonal decay** of 5% applied between annual gaps (IPL is annual, not continuous like ICC tours).
  - Players absent for 2+ consecutive seasons get further inactivity decay (~8%/season).
  - Retired players are removed from active rankings — their peak rating + peak rank are preserved.
  - Active rankings require a player to have appeared in the most recent or previous season.
- Display takes inspiration from CricBuzz's filter UX (batting/bowling/all-rounder pivots, format tabs) but the visual identity is fully original — copyright-clean.

### 4.6 `src/hooks/`

- **`useData.ts`** — The React Query gateway. ~30 hooks covering players, teams, seasons, venues, matches, batting/bowling/partnerships per season, coaches, photos, facts/news, sponsors, official squads, replacements, cap race, scouting (4 hooks), workspaces (CRUD), watchlist (read/check/toggle), and 8+ player-stats analytics hooks. Conventions:
  - Static shards: `staleTime = 1 hour`.
  - Computed analytics: `staleTime = 30 minutes`.
  - IndexedDB-backed: `staleTime = 0` so mutations show immediately.
  - Mutations call `qc.invalidateQueries` on success to keep lists fresh.
- **`useRatings.ts`** — Wraps `ratingService` for the Ratings page. Manages `isComputing`, `progress`, `progressPct`, `error`. Tries cached IndexedDB rows first; if absent, kicks off a worker computation.
- **`useLocalStorage.ts`** — Tiny `useState` + localStorage mirror with safe-fail on quota or private mode.

### 4.7 `src/components/`

Six folders. Each component file has a one-line top-of-file docstring (or a JSDoc block where the behaviour is non-obvious).

- **`charts/`** — 7 Recharts wrappers. Consistent palette, `TOOLTIP_STYLE` constants, minimal props. `CapRaceChart`, `DismissalPie`, `H2HComparisonChart`, `PartnershipBar`, `PhaseRadar`, `SeasonProgressionChart`, `VenueStatsChart`.
- **`layout/`** — `Layout` (chrome wrapper), `Navbar` (sticky top bar + Cmd/Ctrl-K shortcut + "More" dropdown + mobile drawer), `SearchModal` (the Cmd/Ctrl-K palette).
- **`matches/MatchListRow.tsx`** — The single canonical match row. Used by both `Matches` and `SeasonDetail` pages — exists specifically to prevent the two pages from drifting apart (a previous bug had different render paths showing different data).
- **`playoffs/RoadToFinal.tsx`** — Bracket visualisation. Two formats: modern 3-column (Q1/Eliminator → Q2 → Final, 2011+) and classic 2-column (Semi-finals → Final, 2008–2010 with optional 3rd-place play-off in 2010).
- **`ui/`** — Atoms.
  - `Avatar` — drop-in headshot with 4-step resolution chain (season-tagged local file → generic local file → photo URL from JSON map → coloured-initials gradient).
  - `Breadcrumb`, `EmptyState`, `ErrorState`, `LoadingSpinner` — generic feedback widgets.
  - `OverseasBadge` — the ✈ pill.
  - `PlayerLink` — renders a name as a `Link` to `/players/:id`. Resolves scorecard/BBB names via the squad-name-mapping + players index. Falls back to plain `<span>` if unresolvable — never produces a broken link.
  - `TeamBadge` — era-aware logo. Picks the historical mark for the supplied season and falls back to a coloured short-code badge if the image 404s.
- **`venue/`** — `VenueMap` (Google embed + directions/search action buttons) and `VenueWeather` (calls `useMatchWeather`, renders an icon + temp/humidity/wind/cloud-cover card).

### 4.8 `src/pages/` — the 24 routes

Every page has a one-line file-level docstring at the top. High-level summary of each:

| Route | File | What it does |
|---|---|---|
| `/` | `Home.tsx` | Hero, season-winner timeline, top players, trivia, news preview, quick-jump tiles. |
| `/live` | `LiveMatch.tsx` | Today's / next match: weather, squads, recent form, H2H. |
| `/players` | `Players.tsx` | Searchable directory with filters (country, role, batting/bowling style, team, season, status). Fuzzy search via Fuse.js. |
| `/players/:id` | `PlayerDetail.tsx` | Career arc — bio, season splits, phase radar, dismissal pie, partnerships, venue stats, watchlist toggle. |
| `/coaches` | `Coaches.tsx` | Coach directory with role + franchise + status filters. |
| `/coaches/:id` | `CoachDetail.tsx` | Coach profile: tenures, W/L, trophies, link to playing career if applicable. |
| `/teams` | `Teams.tsx` | Franchise grid (active + defunct). |
| `/teams/:id` | `TeamDetail.tsx` | Hub: identity/history, current squad, coaching staff, all-time records, season-by-season W/L, H2H, **SWOT**, logo evolution, home venues. |
| `/seasons` | `Seasons.tsx` | Card grid of every IPL season. |
| `/seasons/:year` | `SeasonDetail.tsx` | Points table, schedule + results, **playoff bracket**, Orange/Purple Cap race, awards, per-team summaries. |
| `/matches` | `Matches.tsx` | Filterable list of every match across history + Playoffs tab. |
| `/matches/:id` | `MatchDetail.tsx` | Full scorecard, BBB commentary, partnerships, fall of wickets, weather, H2H, POM. |
| `/records` | `Records.tsx` | Most runs, most wickets, highest scores, fastest 100s, biggest wins, Orange/Purple Cap winners, etc. |
| `/ratings` | `Ratings.tsx` | The 0–1000 leaderboard, fed by the rating worker. |
| `/venues` | `Venues.tsx` | Searchable venue list with pitch summary. |
| `/venues/:name` | `VenueDetail.tsx` | Per-ground splits + map + weather. |
| `/schedule` and `/schedule/:year` | `Schedule.tsx` | Calendar-style fixture view with month picker. |
| `/analytics` | `Analytics.tsx` | **Analytics Lab** — workspace builder. Pick players + filters → drill into phase / H2H / dismissal / partnership / season charts. Workspaces are saveable to IndexedDB and shareable via URL. |
| `/auctions` | `Auctions.tsx` | Cross-league scouting board (BBL, PSL, CPL, SA20, ILT20, MLC, BPL, CPL, LPL, NTB, SMA, plus an Indian domestic split). Filters by role, league, IPL crossover. |
| `/scout/:id` | `ScoutDetail.tsx` | Per-prospect sheet. |
| `/education` | `Education.tsx` | Accordion of IPL rules, formats, terminology. |
| `/sponsors` | `Sponsors.tsx` | Title sponsor + partner history. |
| `/news` | `News.tsx` | Curated news feed. |

---

## 5. Data layer — where every byte comes from

### 5.1 Inputs (NOT served to the browser)

`raw-data/ipl_json/` and `raw-data/leagues/{bbl,psl,cpl,sa20,ilt,mlc,bpl,lpl,ntb,sma,hnd}_json/` hold the raw sources, all from **CricSheet** (open-source ball-by-ball cricket data, https://cricsheet.org). Each file is one match in CricSheet's JSON schema with `meta`, `info` (city, dates, gender, match_type, players, registry, season, teams, toss, venue), and `innings[].overs[].deliveries[]`.

The IPL set has ~1,200 match files spanning 2008 → 2026 today. Each non-IPL league supplies the scouting board.

### 5.2 The pipeline (`scripts/`)

The runtime app **never** reads `raw-data/`. The pipeline transforms it once into the static JSON tree under `public/data/`.

- **`scripts/data-pipeline/process-cricsheet.ts`** — Main TS pipeline (~1,500 lines). Walks `raw-data/ipl_json/`, normalises team names (Delhi Daredevils → Delhi Capitals, Kings XI Punjab → Punjab Kings, Royal Challengers Bangalore → Royal Challengers Bengaluru, etc.), normalises venue names (CricSheet's inconsistent spellings → canonical forms), classifies playoff stages (modern Q1/Eliminator/Q2/Final vs 2008–2010 semi-finals), extracts toss + outcome (including `eliminator` for Super Overs and `result: 'no result'` for washouts), then writes:
  - `public/data/_backup/{teams,players,seasons,player-stats,player-teams,...}.json` — monoliths
  - `public/data/matches/season-{YYYY}.json`
  - `public/data/scorecards/{batting,bowling}-{YYYY}.json`
  - `public/data/bbb/season-{YYYY}.json` (compact: keys are `m,i,o,b,bat,bwl,br,er,tr,ex,w` — single-letter to halve transfer size)
  - `public/data/partnerships/season-{YYYY}.json`
  - `public/data/cap-race/season-{YYYY}.json`

- **`scripts/data-pipeline/process-scouting.ts`** — Same idea for the non-IPL leagues. Outputs `public/data/scouting/{bbl,psl,cpl,sa20,ilt20,mlc,bpl,lpl,ntb,smat,hnd}.json` plus `all-players.json`, `scout-targets.json`, `ipl-crossover.json`.

- **`scripts/shard-data.py`** — Idempotent post-processor. Reads the monoliths and explodes them into per-entity shards: `public/data/{teams,coaches,venues,seasons,players}/{id}.json` plus thin `index.json` files. Also writes `public/data/squads/{year}/{team-id}.json` and `public/data/replacements/{year}.json`. The runtime still reads the monoliths; the shards exist for **GitHub auditability** — small per-entity files are easier to review and patch.

- **`scripts/update-2026-matches.py`** — Helper that pulls fresh CricSheet 2026 files into the existing layout without re-running the full pipeline.

- **`scripts/data-audit/audit_player_data.py`** — Finds inconsistencies (missing nationalities, wrong roles, unknown aliases, etc.). Writes reports to `scripts/data-audit/reports/`.

- **Hand-curated registries** sitting alongside the pipeline:
  - `player-roles-registry.json` — overrides where CricSheet doesn't know a role.
  - `player-status-registry.json` — active / retired / unsold per player.
  - `nationality-lookup.json` — explicit overrides.
  - `player-enrichment.json` — fullName, nicknames, biographical extras.
  - `ineligible-players.json`, `replacement-players.json`, `squad-name-mapping.json`, `ipl-squads-2026.json`.

### 5.3 Output served to the browser (`public/data/`)

| File | Records | Powers |
|---|--:|---|
| `_backup/teams.json` | 15 | Teams, TeamDetail, badges everywhere |
| `_backup/venues.json` | 39 | Venues, VenueDetail |
| `_backup/seasons.json` | 19 | Seasons, SeasonDetail, Home |
| `_backup/players.json` (+ `players-index.json`, `player-teams.json`, `replacement-players.json`) | 841 | Players, PlayerDetail, squad tabs, Analytics |
| `_backup/player-stats.json` | 786 | Analytics, Ratings, Records, PlayerDetail |
| `_backup/coaches.json` | 166 coaches / 236 tenures | Coaches, CoachDetail |
| `_backup/squads-2026.json` | 10 teams | TeamDetail current squad, Players |
| `_backup/ipl-sponsors.json` | 7 title sponsors + partners | Sponsors, Home |
| `_backup/ipl-news.json` | 14 items | News, Home featured hero |
| `_backup/ipl-facts.json` | 15 milestones + 17 facts | Home, Education |
| `_backup/player-photos.json`, `_backup/coach-photos.json` | URL maps | Wikipedia-sourced fallback for Avatar |
| `matches/season-{YYYY}.json` × 19 | 1,193 matches total (1,154 played, 39 fixtures upcoming in 2026) | Matches, MatchDetail, Schedule, LiveMatch, SeasonDetail |
| `bbb/season-{YYYY}.json` × 19 | ~270k deliveries | MatchDetail BBB tab, all phase analytics |
| `scorecards/{batting,bowling}-{YYYY}.json` × 19 | All scorecard rows | MatchDetail, PlayerDetail |
| `partnerships/season-{YYYY}.json` × 19 | Per-wicket partnerships | PlayerDetail, MatchDetail |
| `cap-race/season-{YYYY}.json` × 19 | Per-match Orange/Purple Cap leader progression | SeasonDetail CapRaceChart |
| `scouting/*.json` (12 files) | 2,704 scouting rows + IPL crossover | Auctions, ScoutDetail |
| `manifest.json` | Build manifest — file sizes + mtimes | (audit tool) |

`public/photos/` holds local headshots (`{id}.jpg` or `{id}_{season}.jpg`). `public/teams/` holds era-aware logos.

### 5.4 Data flow at runtime

```
public/data/*.json  ──fetch──▶  dataService  ──▶  React Query hook  ──▶  Page
                                     │
                                     └──▶  playerStatsService / pointsTableService /
                                            teamAnalysisService / ratingService / weatherService
```

User-owned state (workspaces, watchlist) lives in **IndexedDB** and bypasses the network entirely:

```
Page  ──▶  Dexie hook  ──▶  IndexedDB
```

The rating engine runs in a **Web Worker**:

```
Ratings page  ──▶  useRatings  ──▶  ratingService.computeRatings
                                          │
                                          ├──▶  Worker (off-main-thread)
                                          │       │
                                          │       └──▶  reads /data/* (fetch)
                                          │
                                          └──▶  IndexedDB cache
```

---

## 6. Cross-cutting concepts to know

These are the things you'd call out in a pitch / interview.

1. **Static-first SPA** — no backend, no API server. Everything is a static file on a CDN once you `vite build`. Any host that can serve files (Vercel, Netlify, GitHub Pages, S3+CloudFront) works.

2. **Two parallel data layouts** — `_backup/` monoliths for fast bulk loads at runtime; per-entity shards under `teams/`, `coaches/`, `venues/`, etc., for human auditing on GitHub. Both are kept in sync by `shard-data.py`.

3. **Era awareness baked into the data model** — every team rebrand, venue rename, and logo refresh is captured. A 2015 RCB row shows the 2015 RCB logo, not the 2024 mark. `getTeamLogo(team, season)`, `getFranchiseLogoEvolution`, `TEAM_ALIASES`, `VENUE_ALIASES` together make this work.

4. **Result canonicalisation** — `lib/matchResult.ts` is the single source of truth for "did this team win, lose, tie via Super Over, get a no-result, or is it still a fixture?" Many CricSheet edge cases (stale `winMargin` on bowl-out ties, missing toss for fixtures) are absorbed here so the rest of the app doesn't have to think about them.

5. **Home/away resolution** — `lib/matchVenue.ts`. Real franchise home cities, with overseas leg detection (2009 SA, 2014/2020/2021 UAE) so neutral-venue matches fall back to innings-order display.

6. **Phase model** — Powerplay (overs 0–5), Middle (6–15), Death (16–19). Used in radar charts, SWOT, ratings, and match analytics.

7. **Rating engine in a Web Worker** — see §4.5. This is the most computationally intensive piece of the app, hence the worker.

8. **Watchlist + Workspaces in IndexedDB** — local-first user state. Workspaces are also URL-shareable via base64-encoded `?ws=` param.

9. **Real weather data on every match** — via Open-Meteo. Past matches use the ERA5 archive endpoint; live and near-future use the forecast endpoint. Timezone handling preserves the IST kickoff hour and converts it to venue-local for foreign matches.

10. **Global fuzzy search** — Cmd/Ctrl-K opens a Fuse.js-powered command palette across players, teams, venues, seasons. Arrow-key + enter ergonomics.

11. **Lazy code-splitting per route** — every page is a separate bundle so the home page doesn't pay for the analytics workspace's chart library.

12. **Defensive accuracy work** — three layers:
   - Pipeline-level: name/venue/team alias maps applied at processing time.
   - Service-level: `pointsTableService` enforces the canonical IPL points rules; `matchResult` handles tied-margin edge cases.
   - Hand-curated registries: `player-status-registry.json` overrides incorrect inferred statuses, `nationality-lookup.json` overrides edge cases.

13. **Photo fallback chain** — every Avatar tries 4 sources in order: season-specific local jersey photo → generic local photo → URL from photo-mapping JSON (Wikipedia) → coloured initials. Never a broken image.

14. **Playoff bracket abstraction** — `RoadToFinal` renders both the modern (2011+) and classic (2008–2010) formats from the same component, used identically by Matches and SeasonDetail.

---

## 7. The pitch — short version

> "An end-to-end IPL analytics platform built for broadcast and management use. We turned 19 seasons of open ball-by-ball data into a fast, audit-friendly static site with twenty-four pages of analysis: every match, every player, every coach, every venue, plus a live tab, a SWOT analyzer, an ICC-calibrated 0–1000 rating engine, a phase-by-phase analytics workspace that anyone can save and share by URL, a cross-league scouting board for IPL auctions, and real Open-Meteo weather on every venue. It's a single React 19 + TypeScript bundle backed by static JSON — no API server, no database, no operational overhead — yet the data is curated and audited closely enough that a broadcaster could put it on screen."

---

## 8. Project status — what's done, what's pending

(Snapshot as of 2026-04-29.)

### Done
- All 24 pages built and functional.
- Match data through **2026 match #39** verified against Wikipedia and IPLT20.com (winner, toss, POM, innings totals, BBB, partnerships, scorecards).
- Future fixtures #40–70 preserved with synthetic IDs (`2026-fixture-NN`) so the Schedule page renders the full season.
- All 10 franchise squads for 2026 audited; 14 spelling normalisations applied; `squad-name-mapping.json` updated so stat lookups resolve.
- Captains corrected (DC: Axar Patel; RCB: Rajat Patidar) where source data was wrong.
- Head coaches populated for all 10 franchises in `squads-2026.json`.
- Mid-season replacements for 2026 (10 entries).
- Orange/Purple Cap leaders for 2026 match Wikipedia exactly (Abhishek Sharma 380; Bhuvneshwar Kumar 14).
- Points table matches Wiki/IPLT20 after pipeline + service patches: `process-cricsheet.ts` now extracts `outcome.eliminator` and mirrors it into `winner` for tied matches; `pointsTableService` treats `result === 'no result'` as played (1 pt each); `Match` type has `result?` and `eliminator?` fields.
- Coaches database: 166 coaches across 236 tenures, fully cited.
- Player avatar pipeline + Wikipedia photo URLs.
- Overseas badge + nationality classification.
- Ratings engine (worker + caching + IndexedDB) live.
- Analytics Lab + workspace persistence + URL share.
- Cross-league scouting (12 leagues + IPL crossover).
- Per-entity shards under `public/data/{teams,coaches,...}` for GitHub auditing.
- Type-check passes (`tsc --noEmit` exit 0).
- Code now has file-header docstrings across all of `src/` and per-export comments where the behaviour isn't obvious.

### Pending / next up
- **2026 in-flight data**: player-stats refresh, cap-race progression beyond match #30, toss data for the latest matches, additional in-season squad replacements as they're announced.
- **Live tab — true live feed**: the LiveMatch page is a high-fidelity static view today. Plugging a real live ball-by-ball stream (CricSheet doesn't ship live data) is unbuilt.
- **Photo coverage gap**: `public/photos/players/` and `public/photos/coaches/` are currently empty — Avatar is leaning on the Wikipedia URL map and the colored-initials fallback. Filling local jersey-accurate photos for star players is a recurring task.
- **Continued data freshness**: as the 2026 season plays out, run `update-2026-matches.py` after each match day; copy fresh derived files (player-stats, seasons, player-teams, venues) from `public/data/*.json` into `_backup/`; regenerate shards via `shard-data.py`.
- **Hardening + polish before May 31, 2026**: visual QA pass at broadcast resolutions, accessibility audit (focus states, aria labels), SEO meta tags, final performance pass on the largest pages (Analytics, MatchDetail, TeamDetail).

---

## 9. How to run / build / extend

### Run locally
```bash
npm install
npm run dev          # Vite dev server with HMR (default port 5173)
```

### Type-check + production bundle
```bash
npm run build        # tsc -b && vite build → dist/
npm run preview      # serve dist/ to verify the production build
```

### Lint
```bash
npm run lint
```

### Refresh data (when adding 2026 matches or changing the registries)
```bash
# 1. Pull new CricSheet match files into raw-data/ipl_json/
# 2. Run the pipeline:
npx tsx scripts/data-pipeline/process-cricsheet.ts
# 3. (Optional) refresh scouting:
npx tsx scripts/data-pipeline/process-scouting.ts
# 4. Re-shard for GitHub auditability:
python3 scripts/shard-data.py
# 5. Audit:
python3 scripts/data-audit/audit_player_data.py
```

### Add a new page
1. Create `src/pages/MyPage.tsx`.
2. Add a `lazy()` import + `<Route>` in `src/App.tsx`.
3. If it appears in the nav, add an entry to `NAV_ITEMS_PRIMARY` or `NAV_ITEMS_MORE` in `src/lib/constants.ts`.

### Add a new dataset
1. Drop the JSON under `public/data/_backup/`.
2. Add a loader in `src/services/dataService.ts` (`bulk` group).
3. Add a typed hook in `src/hooks/useData.ts`.
4. Document it in `data-docs/`.

### Use a player's stats anywhere
```tsx
const { data: stats } = usePlayerPhaseStats(playerName, ['2024','2025','2026'], 'batting')
```
The hook handles caching, loading, errors. Render with `<PhaseRadar data={stats}/>`.

### Link to a player from a name string
```tsx
<PlayerLink name="MS Dhoni" />
```
Resolves the canonical player.id automatically; degrades to plain text if unresolvable.

---

## 10. Memory aid — one-line reminders

- **App entry**: `src/main.tsx` → `src/App.tsx`. Routes are lazy-loaded.
- **All data fetches** go through `src/services/dataService.ts`.
- **All React Query hooks** live in `src/hooks/useData.ts`.
- **Static data tree** is `public/data/` — `_backup/` (monoliths, runtime) + per-entity shards (audit).
- **Inputs** to the data tree are `raw-data/ipl_json/` and `raw-data/leagues/*` from CricSheet.
- **Pipeline** is `scripts/data-pipeline/process-cricsheet.ts` + `process-scouting.ts` + `shard-data.py`.
- **Big computations** that would freeze the UI go in `src/workers/` and are wrapped by a service in `src/services/`.
- **User state** goes in IndexedDB via `src/lib/db.ts` (Dexie).
- **Visual identity** for teams (logo, color, short code) is in `src/lib/constants.ts` — era-aware.
- **Result formatting** edge cases live in `src/lib/matchResult.ts`.
- **Dark theme** is configured inline in `index.html` plus the `cn()` helper in `src/lib/utils.ts`.

That's the whole app, end-to-end.
