# IPL Analysis Platform -- Frontend-Only Architecture Document

## Executive Summary

This document defines the complete architecture for a **frontend-only** IPL Analysis Platform. The application has **no independent match data source** — all data originates from external providers:

- **Historical/statistical data**: CricSheet open-source CSV data, Kaggle datasets, and manually curated JSON.
- **Live match data**: Free third-party cricket APIs (CricketData.org, CricAPI) polled at runtime.

Since we consume rather than produce data, a custom backend (NestJS, TypeORM, PostgreSQL) adds no meaningful value — it would merely proxy the same external sources. Instead, the architecture invests in two areas: (1) a **build-time data pipeline** that transforms raw external data into optimized, pre-aggregated static JSON files, and (2) a **rich client-side computation layer** (Web Workers) that derives ratings, analytics, and insights entirely in the browser. The result is a zero-infrastructure, CDN-deployed React SPA with broadcast-grade analytics capabilities.

---

## A. Data Layer Architecture

### A.1 Data Source Taxonomy

Every piece of data in the application falls into one of four categories:

| Category                    | Description                                                                                                                           | Examples                                                                                                           |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Static JSON**             | Pre-processed at build time from CricSheet CSVs, Kaggle datasets, and curated JSON. Deployed as static assets alongside the frontend. | Players, matches, ball-by-ball, scorecards, partnerships, seasons, teams, venues, auctions, coaches, domestic data |
| **External API**            | Fetched at runtime from free cricket data APIs.                                                                                       | Live match scores, current match list, player search supplementation                                               |
| **Computed Client-Side**    | Derived in the browser from static data via Web Workers or in-memory processing.                                                      | Player ratings, SWOT analysis, scouting scores, cap race, aggregated stats, H2H                                    |
| **Client-Side Persistence** | Stored in the browser via IndexedDB or localStorage.                                                                                  | Workspaces, watchlists, user preferences, cached computations                                                      |

### A.2 Database Table to Data Source Mapping

| Database Table                   | New Data Source                               | Storage Format                                                     | Notes                                               |
| ---------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------- |
| `players`                        | Static JSON                                   | `/data/players.json` (~50KB)                                       | ~700 players with bio, role, styles, status         |
| `coaches`                        | Static JSON                                   | `/data/coaches.json` (~10KB)                                       | Linked to players via `person_id`                   |
| `coach_tenures`                  | Static JSON                                   | `/data/coach-tenures.json` (~15KB)                                 | Coaching records per team per season                |
| `teams`                          | Static JSON                                   | `/data/teams.json` (~5KB)                                          | 10 current + defunct franchises                     |
| `team_seasons`                   | Static JSON                                   | `/data/team-seasons.json` (~10KB)                                  | Captain, final position per season                  |
| `team_management`                | Static JSON                                   | `/data/team-management.json` (~20KB)                               | Owner, CEO, directors per team per season           |
| `team_sponsors`                  | Static JSON                                   | `/data/team-sponsors.json` (~15KB)                                 | Sponsor data per team per season                    |
| `seasons`                        | Static JSON                                   | `/data/seasons.json` (~5KB)                                        | 2008-present, winners, cap holders                  |
| `matches`                        | Static JSON, split by season                  | `/data/matches/season-{year}.json` (~30KB each, ~550KB total)      | ~1200 matches                                       |
| `batting_scorecards`             | Static JSON, split by season                  | `/data/scorecards/batting-{year}.json` (~80KB each, ~1.4MB total)  | Per-match batting records                           |
| `bowling_scorecards`             | Static JSON, split by season                  | `/data/scorecards/bowling-{year}.json` (~50KB each, ~900KB total)  | Per-match bowling records                           |
| `fielding_scorecards`            | Static JSON, split by season                  | `/data/scorecards/fielding-{year}.json` (~30KB each, ~540KB total) | Per-match fielding records                          |
| `ball_by_ball`                   | Static JSON, split by season                  | `/data/bbb/season-{year}.json` (~2-4MB each, ~50-60MB total)       | ~260,000+ delivery records                          |
| `partnerships`                   | Static JSON, split by season                  | `/data/partnerships/season-{year}.json` (~20KB each, ~360KB total) | Partnership records                                 |
| `player_ratings`                 | **Computed** + cached in IndexedDB            | N/A                                                                | Computed from ball-by-ball at first load            |
| `player_rating_history`          | **Computed** + cached in IndexedDB            | N/A                                                                | Full match-by-match timeline                        |
| `player_season_ratings`          | **Computed** + cached in IndexedDB            | N/A                                                                | Season-end snapshots                                |
| `analytics_workspaces`           | IndexedDB (Dexie.js)                          | `workspaces` table                                                 | User-created, local persistence                     |
| `player_teams`                   | Static JSON                                   | `/data/player-teams.json` (~40KB)                                  | Player-franchise-season mapping                     |
| `auctions`                       | Static JSON                                   | `/data/auctions.json` (~5KB)                                       | Auction metadata                                    |
| `auction_players`                | Static JSON, split by year                    | `/data/auctions/auction-{year}.json` (~30KB each)                  | All players per auction                             |
| `venues`                         | Static JSON                                   | `/data/venues.json` (~8KB)                                         | Venue profiles with pitch analysis                  |
| `venue_match_conditions`         | Static JSON                                   | `/data/venue-conditions.json` (~30KB)                              | Per-match conditions at venues                      |
| `ipl_sponsors`                   | Static JSON                                   | `/data/ipl-sponsors.json` (~10KB)                                  | Season-wise IPL-level sponsors                      |
| `cap_race`                       | **Pre-computed** at build time                | `/data/cap-race/season-{year}.json` (~20KB each)                   | Match-by-match cap race standings                   |
| `records`                        | Static JSON                                   | `/data/records.json` (~15KB)                                       | Orange/purple cap winners, thrillers, game changers |
| `domestic_countries`             | Static JSON                                   | `/data/scouting/countries.json` (~2KB)                             | 13 countries                                        |
| `domestic_leagues`               | Static JSON                                   | `/data/scouting/leagues.json` (~5KB)                               | 30+ leagues                                         |
| `domestic_league_seasons`        | Static JSON                                   | `/data/scouting/league-seasons.json` (~10KB)                       | All seasons per league                              |
| `domestic_matches`               | Static JSON, split by league                  | `/data/scouting/matches/{league-code}.json`                        | Domestic match records                              |
| `domestic_batting_performances`  | Static JSON, split by league                  | `/data/scouting/batting/{league-code}.json`                        | Scorecard-level batting                             |
| `domestic_bowling_performances`  | Static JSON, split by league                  | `/data/scouting/bowling/{league-code}.json`                        | Scorecard-level bowling                             |
| `domestic_fielding_performances` | Static JSON, split by league                  | `/data/scouting/fielding/{league-code}.json`                       | Scorecard-level fielding                            |
| `domestic_ball_by_ball`          | Static JSON, split by league                  | `/data/scouting/bbb/{league-code}.json` (~2-5MB each)              | Only for CricSheet-covered leagues                  |
| `domestic_player_league_stats`   | **Pre-computed** at build time                | `/data/scouting/player-stats/{league-code}.json`                   | Pre-aggregated domestic stats                       |
| `scouting_watchlist`             | IndexedDB (Dexie.js)                          | `watchlist` table                                                  | User-created, local persistence                     |
| `scouting_player_tags`           | IndexedDB (Dexie.js)                          | `player_tags` table                                                | User-created tags                                   |
| `team_swot_analysis`             | **Computed** client-side, cached in IndexedDB | N/A                                                                | Computed from ball-by-ball + player data            |
| `team_auction_roi`               | **Pre-computed** at build time                | `/data/auction-roi/season-{year}.json`                             | Auction price vs performance                        |

### A.3 Static File Structure

```
public/
  data/
    # ---- Core Reference Data (~200KB total, loaded eagerly) ----
    players.json                      # All players with bio fields
    players-index.json                # Lightweight: id, name, photo_url, role, nationality (for search/autocomplete)
    teams.json                        # All franchises
    seasons.json                      # Season metadata
    coaches.json                      # Coach profiles
    coach-tenures.json                # Coaching records
    venues.json                       # Venue profiles
    venue-conditions.json             # Per-match venue conditions
    player-teams.json                 # Player-franchise-season mapping
    ipl-sponsors.json                 # IPL-level sponsors
    records.json                      # All-time records

    # ---- Match Data (~2MB total, loaded per-season lazily) ----
    matches/
      season-2008.json                # ~60 matches per season
      season-2009.json
      ...
      season-2026.json

    # ---- Scorecards (~3MB total, loaded per-season lazily) ----
    scorecards/
      batting-2008.json
      bowling-2008.json
      fielding-2008.json
      ...
      batting-2026.json
      bowling-2026.json
      fielding-2026.json

    # ---- Ball-by-Ball (~50-60MB total, loaded per-season on demand) ----
    bbb/
      season-2008.json                # ~2-3MB each
      season-2009.json
      ...
      season-2026.json

    # ---- Partnerships (~400KB total, loaded per-season) ----
    partnerships/
      season-2008.json
      ...
      season-2026.json

    # ---- Pre-Computed Data (built at build time) ----
    cap-race/
      season-2008.json                # Match-by-match cap race standings
      ...
      season-2026.json

    ratings/
      precomputed-ratings.json        # Final computed ratings for all players (~200KB)
      rating-history.json             # Match-by-match rating history (~2MB, compressed)
      season-ratings.json             # Season-end snapshots (~100KB)

    auction-roi/
      season-2008.json
      ...
      season-2026.json

    # ---- Auction Data (~300KB total) ----
    auctions/
      auctions-meta.json              # Auction metadata (date, location, auctioneer)
      auction-2008.json               # Players, prices, status per auction
      ...
      auction-2026.json

    # ---- Domestic Scouting Data (~30-80MB total, loaded on demand per league) ----
    scouting/
      countries.json
      leagues.json
      league-seasons.json
      player-stats/                   # Pre-aggregated stats per league
        bbl.json                      # ~200KB each
        cpl.json
        psl.json
        sa20.json
        the-hundred.json
        t20-blast.json
        bpl.json
        mlc.json
        ilt20.json
        smat.json
        ranji-trophy.json
        vijay-hazare.json
        county-championship.json
        sheffield-shield.json
        ...
      matches/                        # Domestic match records per league
        bbl.json
        ...
      batting/                        # Scorecard-level batting per league
        bbl.json
        ...
      bowling/
        bbl.json
        ...
      fielding/
        bbl.json
        ...
      bbb/                            # Ball-by-ball (only CricSheet leagues)
        bbl.json                      # ~2-5MB each
        cpl.json
        psl.json
        sa20.json
        the-hundred.json
        t20-blast.json

    # ---- Education (static content) ----
    education/
      formulas.json
      dls.json

    # ---- Team Management & Sponsors ----
    team-management.json
    team-sponsors.json
```

**Total static data size estimate:**
- Core reference data: ~200KB (loaded eagerly)
- Match/scorecard data: ~5MB total (loaded per-season)
- Ball-by-ball IPL data: ~50-60MB total (loaded per-season on demand, ~3MB per season)
- Pre-computed data (ratings, cap race, ROI): ~3MB
- Domestic scouting data: ~30-80MB total (loaded per-league on demand)
- **Grand total: ~90-150MB of static JSON** (but never loaded all at once; typical user session loads 5-15MB)

### A.4 External API Integration

#### Primary API: CricketData.org (formerly CricAPI)

- **URL**: `https://api.cricapi.com/v1/`
- **Free tier**: 100 requests/day (free plan), up to 100,000 requests/hour on paid plans
- **Authentication**: API key in query parameter
- **Used for**: Live match data ONLY (historical data comes from static files)

**Endpoints used:**

| Endpoint                       | Purpose                            | Polling Frequency                     |
| -------------------------------- | ------------------------------------ | --------------------------------------- |
| `GET /currentMatches`          | List currently live matches        | Every 60 seconds on Home page         |
| `GET /match_scorecard?id={id}` | Live scorecard for an active match | Every 30 seconds on Match Detail page |
| `GET /match_info?id={id}`      | Match metadata (toss, officials)   | Once per match view                   |
| `GET /match_bbb?id={id}`       | Ball-by-ball live feed             | Every 15-30 seconds during live match |

#### Fallback API: Cricket Data (RapidAPI)

- **URL**: Via RapidAPI proxy
- **Free tier**: 100 requests/day
- **Used for**: Fallback if CricketData.org is down

#### Rate Limit Strategy

```
Daily budget (free tier): 100 requests/day

Allocation:
- Home page live check: 1 req/min x 60 min active = 60 reqs
- Match detail polling: 2 req/min x 20 min per match = 40 reqs
- Total: ~100 reqs for one active match session

Mitigation:
- Poll only when user is actively viewing live match page
- Use Page Visibility API to pause polling when tab is hidden
- Cache live responses for 15 seconds in TanStack Query
- Show "last updated X seconds ago" indicator
- If rate limit exceeded, degrade gracefully to 60-second polling
```

**For production with heavy usage**: Upgrade to CricketData.org paid plan ($10-50/month) or use Sportmonks Cricket API ($29/month, 2,500 requests/day). The architecture supports swapping APIs via the service abstraction layer.

### A.5 IndexedDB Schema (Dexie.js)

```typescript
// db.ts
import Dexie, { Table } from 'dexie';

interface BallByBallRecord {
  id: string;            // "{matchId}_{innings}_{over}_{ball}"
  matchId: number;
  seasonYear: number;
  innings: number;
  over: number;
  ball: number;
  battingTeamId: number;
  bowlingTeamId: number;
  batterId: number;
  bowlerId: number;
  nonStrikerId: number;
  batterPosition: number;
  runsOffBat: number;
  extras: number;
  extraType: string | null;
  totalRuns: number;
  isWicket: boolean;
  dismissalType: string | null;
  dismissedPlayerId: number | null;
  fielderId: number | null;
  isFour: boolean;
  isSix: boolean;
  isDot: boolean;
  bowlingType: string;
  batterHand: string;
  bowlerArm: string;
  phase: string;
  matchSituation: string;
  shotDirection: string | null;
  shotDistance: number | null;
  pitchLength: string | null;
  pitchLine: string | null;
  pitchX: number | null;
  pitchY: number | null;
  shotAngle: number | null;
}

interface Workspace {
  id: string;
  name: string;
  playerIds: number[];
  filters: Record<string, any>;
  layout: Record<string, any>;
  shareToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface WatchlistEntry {
  id: string;
  playerId: number;
  addedAt: Date;
  notes: string;
  priority: 'High' | 'Medium' | 'Low';
  targetRole: string;
  estimatedValueRange: string;
  tags: string[];
}

interface CachedRating {
  playerId: number;
  category: string;
  currentRating: number;
  currentRank: number | null;
  peakRating: number;
  peakRank: number;
  peakSeasonYear: number;
  finalRating: number | null;
  isActive: boolean;
  isRetired: boolean;
  dampingFactorBatting: number;
  dampingFactorBowling: number;
}

interface CachedRatingHistory {
  id: string;            // "{playerId}_{matchId}_{category}"
  playerId: number;
  category: string;
  matchId: number;
  seasonYear: number;
  ratingBefore: number;
  ratingAfter: number;
  ratingChange: number;
  rawMatchScore: number;
  oppositionMultiplier: number;
  dampingApplied: number;
}

class IPLDatabase extends Dexie {
  ballByBall!: Table<BallByBallRecord>;
  workspaces!: Table<Workspace>;
  watchlist!: Table<WatchlistEntry>;
  cachedRatings!: Table<CachedRating>;
  cachedRatingHistory!: Table<CachedRatingHistory>;
  cachedSwot!: Table<any>;
  dataVersions!: Table<{ key: string; version: string; loadedAt: Date }>;

  constructor() {
    super('IPLAnalysis');
    this.version(1).stores({
      ballByBall: 'id, matchId, seasonYear, batterId, bowlerId, battingTeamId, bowlingTeamId, phase',
      workspaces: 'id, name, createdAt',
      watchlist: 'id, playerId, priority, addedAt',
      cachedRatings: '[playerId+category], currentRating, currentRank, isActive',
      cachedRatingHistory: 'id, playerId, category, matchId, seasonYear',
      cachedSwot: 'id, teamId, seasonYear',
      dataVersions: 'key',
    });
  }
}

export const db = new IPLDatabase();
```

### A.6 Data Loading Strategy

The application uses a **tiered loading strategy** to avoid loading all 90-150MB of data at once:

**Tier 0 -- Immediate (loaded in app shell, <200KB):**
- `players-index.json` (id, name, photo, role, nationality -- for search/autocomplete)
- `teams.json`
- `seasons.json`
- Cached in TanStack Query with `staleTime: Infinity`

**Tier 1 -- Page Load (loaded when a page is visited, per-entity):**
- `players.json` (full player data, loaded on Players List page)
- `matches/season-{year}.json` (loaded on Season Detail, Match pages)
- `scorecards/batting-{year}.json` + `bowling-{year}.json` (loaded on Match Detail)
- Cached in TanStack Query with `staleTime: 24 hours` (static data rarely changes)

**Tier 2 -- On Demand (loaded when specific feature is accessed):**
- `bbb/season-{year}.json` (loaded when player deep stats, H2H, or overlays are requested)
- Stored in IndexedDB after first load for instant subsequent access
- Progressive: load one season at a time, starting with current/requested season

**Tier 3 -- Deferred Computation (triggered by user action or background):**
- Rating engine computation (runs in Web Worker after ball-by-ball data is loaded)
- SWOT analysis computation (runs in Web Worker)
- Results cached in IndexedDB with version stamps

**Tier 4 -- Lazy Scouting (loaded only in Scouting Hub):**
- Domestic league data loaded per-league when user navigates to that league
- `scouting/player-stats/{league}.json` loaded per-league
- Domestic ball-by-ball loaded only for phase-wise analysis of specific leagues

**Data Freshness:**
- Static data has a version hash in `data-manifest.json` (generated at build time)
- On app load, compare manifest hash with cached version in IndexedDB's `dataVersions` table
- If hash mismatch, re-fetch the changed files and update IndexedDB cache
- During IPL season, rebuild and redeploy static data after each match (via CI/CD)

---

## B. Computation Layer

### B.1 Rating Engine (Web Worker)

The ICC-calibrated rating engine is the most computationally intensive feature. It must process ~1,200 matches chronologically, each with ~20-22 player performances.

**Architecture:**

```
Main Thread                          Web Worker (rating-worker.ts)
    |                                        |
    |-- postMessage({ type: 'INIT',         |
    |    ballByBall: [...],                  |
    |    scorecards: [...],                  |
    |    matches: [...],                     |
    |    players: [...] })                   |
    |                                        |
    |                               Process matches chronologically
    |                               For each match:
    |                                 1. computeMatchPerformanceScore()
    |                                 2. applyOppositionStrengthFactor()
    |                                 3. applySeasonalDecay()
    |                                 4. computeWeightedMovingAverage()
    |                                 5. applyDampingFactor()
    |                                        |
    |<-- postMessage({ type: 'PROGRESS',     |
    |    season: 2012, pct: 25 })            |
    |                                        |
    |                               After all matches:
    |                                 6. processRetirementAndInactivity()
    |                                 7. computeRanks()
    |                                        |
    |<-- postMessage({ type: 'COMPLETE',     |
    |    ratings: [...],                     |
    |    history: [...],                     |
    |    seasonRatings: [...] })             |
    |                                        |
    |-- Store in IndexedDB                   |
```

**Performance considerations:**
- Processing ~1,200 matches with ~25,000 player-match entries: estimated 3-8 seconds on modern hardware
- Progress callbacks every season (18 steps) for UI progress bar
- Results cached in IndexedDB -- recomputation only needed when new match data is added
- The worker receives data via `Transferable` objects (ArrayBuffer) for zero-copy transfer when possible
- For incremental updates (new match added during live season), the worker accepts an `UPDATE_AFTER_MATCH` message that only recomputes affected players

**Pre-computation alternative (recommended for production):**
To avoid the 3-8 second cold-start, pre-compute ratings at build time:
- A Node.js script (`scripts/compute-ratings.js`) runs the identical algorithm during the Vite build
- Outputs `ratings/precomputed-ratings.json`, `ratings/rating-history.json`, `ratings/season-ratings.json`
- Browser loads these pre-computed files directly -- no Web Worker needed for historical data
- Web Worker only runs for live/incremental updates during the current IPL season

### B.2 Stats Aggregation (In-Memory Processing)

Without PostgreSQL's `GROUP BY`, `FILTER`, and window functions, stats aggregation happens client-side. The approach differs by data volume:

**Small datasets (scorecards, ~25,000 records total):**
- Load into memory as JavaScript arrays
- Aggregate using `Array.reduce()`, `Array.filter()`, `Map` grouping
- Fast enough on main thread (<50ms for most queries)

**Large datasets (ball-by-ball, ~260,000+ records):**
- Loaded per-season into IndexedDB
- Queries use Dexie.js compound indexes where possible
- For cross-season aggregation (e.g., career phase-wise stats), use a Web Worker:

```typescript
// stats-worker.ts
self.onmessage = async (e) => {
  const { type, playerId, filters } = e.data;

  switch (type) {
    case 'PLAYER_PHASE_STATS': {
      // Load from IndexedDB inside worker
      const balls = await db.ballByBall
        .where('batterId').equals(playerId)
        .toArray();

      const phaseStats = balls.reduce((acc, ball) => {
        const phase = ball.phase; // 'Powerplay' | 'Middle' | 'Death'
        if (!acc[phase]) acc[phase] = { runs: 0, balls: 0, dots: 0, fours: 0, sixes: 0, dismissals: 0 };
        acc[phase].runs += ball.runsOffBat;
        acc[phase].balls += 1;
        acc[phase].dots += ball.isDot ? 1 : 0;
        acc[phase].fours += ball.isFour ? 1 : 0;
        acc[phase].sixes += ball.isSix ? 1 : 0;
        acc[phase].dismissals += (ball.isWicket && ball.dismissedPlayerId === playerId) ? 1 : 0;
        return acc;
      }, {} as Record<string, any>);

      self.postMessage({ type: 'PLAYER_PHASE_STATS_RESULT', data: phaseStats });
      break;
    }
    // ... other stat aggregation cases
  }
};
```

**Optimization strategies for ball-by-ball processing:**
1. **Per-player pre-aggregation at build time**: For each player, pre-compute their aggregated stats across all seasons and store in a `player-aggregated-stats/{playerId}.json` file. This eliminates runtime aggregation for the most common queries (player profile stats).
2. **Lazy per-season loading**: Only load ball-by-ball data for seasons the user requests. If they view Kohli's career stats, load all seasons he played in, but not seasons he did not.
3. **IndexedDB compound indexes**: Use `[batterId+seasonYear]` and `[bowlerId+seasonYear]` indexes for fast player-filtered queries.
4. **Result memoization**: Cache aggregation results in a `Map` keyed by `{playerId}_{statType}_{filters}`. Invalidate only when new data loads.

### B.3 SWOT Analysis Computation

SWOT is computed client-side from ball-by-ball and scorecard data:

```
Input: ball_by_ball for target season + player_teams + auction_players + player ratings
Output: Full SWOT analysis JSON (strengths, weaknesses, phase profile, squad depth, dependencies, age profile, overseas analysis, auction ROI, budget, recruitment)

Steps (in Web Worker):
1. Load team roster for season (player_teams)
2. For each player: aggregate batting/bowling stats from scorecards
3. Phase-wise team analysis: aggregate ball-by-ball by team+phase → compute PP/Mid/Death batting/bowling ratings (0-100 vs league average)
4. Player dependency: sum each player's runs/wickets ÷ team total → flag >30%
5. Squad depth: categorize roster by role (Bat/Bowl/AR/WK) × nationality
6. Overseas analysis: identify 4 overseas selections, compute per-player contribution
7. Age profile: compute from player DOB, flag succession risks for age >35
8. Auction ROI: compare sold_price to batting_impact + bowling_impact → categorize
9. Budget: sum retained + sold prices, compute remaining purse
10. Recruitment: identify gaps (weak phases, missing roles) → cross-reference with domestic scouting player stats for suggestions
```

Computation time: ~1-3 seconds per team. Results cached in IndexedDB.

### B.4 Scouting Score Computation

Scouting scores are pre-computed at build time for all domestic players and stored in the player-stats JSON files. The formula:

```
scouting_score = (
  T20_score * 0.40 +
  recent_form_score * 0.20 +
  ODI_score * 0.15 +
  consistency_score * 0.10 +
  FC_score * 0.10 +
  big_match_score * 0.05
) * league_prestige_modifier

Where:
- T20_score = normalize(batting_avg * SR_factor + bowling_economy_inverse * wickets_factor) * t20_relevance_weight
- recent_form_score = weighted average of last 5/10 match performances
- consistency_score = 100 - (std_deviation_of_scores / mean_score * 100)
- league_prestige_modifier = 1.0 for tier 1, 0.85 for tier 2, 0.7 for tier 3
```

Pre-computation at build time means the browser never needs to run this -- it reads the final score from the JSON.

---

## C. API Service Layer Replacement

### C.1 Service Function Architecture

Every backend endpoint is replaced by a client-side service function that reads from static JSON, IndexedDB, or external API:

```
src/services/
  playerService.ts          # Player CRUD and search
  playerStatsService.ts     # All granular stat computations
  teamService.ts            # Team data
  matchService.ts           # Match data and scorecards
  seasonService.ts          # Season data
  auctionService.ts         # Auction data
  venueService.ts           # Venue data
  sponsorService.ts         # Sponsor data
  ratingService.ts          # Rating queries (from IndexedDB cache or pre-computed JSON)
  workspaceService.ts       # Workspace CRUD (IndexedDB via Dexie)
  scoutingService.ts        # Scouting hub data
  teamAnalysisService.ts    # SWOT analysis (computed or cached)
  capRaceService.ts         # Cap race data (pre-computed JSON)
  recordsService.ts         # Records data
  liveMatchService.ts       # External API calls for live data
  educationService.ts       # Static education content
  comparisonService.ts      # Multi-player comparison
  searchService.ts          # Global search across all entities
```

### C.2 Endpoint-to-Service Mapping (Complete)

**Players (27 endpoints -> service functions):**

| Original Endpoint                                    | Service Function                                         | Data Source                                                                                             |
| ------------------------------------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `GET /api/players`                                   | `playerService.getPlayers(filters)`                      | Static JSON `players.json`, filtered in-memory                                                          |
| `GET /api/players/search?q=`                         | `playerService.searchPlayers(query)`                     | Static JSON `players-index.json`, substring match via `String.includes()` or Fuse.js for fuzzy matching |
| `GET /api/players/:id`                               | `playerService.getPlayer(id)`                            | Static JSON lookup by id                                                                                |
| `GET /api/players/:id/coach-profile`                 | `playerService.getCoachProfile(id)`                      | `coaches.json` + `coach-tenures.json`                                                                   |
| `GET /api/players/:id/matches`                       | `matchService.getPlayerMatches(playerId)`                | Filter scorecards by playerId                                                                           |
| `GET /api/players/:id/auctions`                      | `auctionService.getPlayerAuctions(playerId)`             | Filter auction files by playerId                                                                        |
| `GET /api/players/:id/stats/batting`                 | `playerStatsService.getBattingStats(id, filters)`        | Aggregate from batting scorecards                                                                       |
| `GET /api/players/:id/stats/bowling`                 | `playerStatsService.getBowlingStats(id, filters)`        | Aggregate from bowling scorecards                                                                       |
| `GET /api/players/:id/stats/fielding`                | `playerStatsService.getFieldingStats(id, filters)`       | Aggregate from fielding scorecards                                                                      |
| `GET /api/players/:id/stats/allrounder`              | `playerStatsService.getAllRounderStats(id, filters)`     | Combine batting + bowling                                                                               |
| `GET /api/players/:id/stats/batting/phase-wise`      | `playerStatsService.getBattingPhaseStats(id, filters)`   | Aggregate from ball-by-ball (Web Worker)                                                                |
| `GET /api/players/:id/stats/batting/situational`     | `playerStatsService.getBattingSituational(id, filters)`  | Aggregate from ball-by-ball                                                                             |
| `GET /api/players/:id/stats/batting/vs-bowling-type` | `playerStatsService.getBattingVsType(id, filters)`       | Aggregate from ball-by-ball                                                                             |
| `GET /api/players/:id/stats/batting/dismissals`      | `playerStatsService.getDismissalAnalysis(id, filters)`   | Aggregate from batting scorecards                                                                       |
| `GET /api/players/:id/stats/batting/by-position`     | `playerStatsService.getPositionStats(id, filters)`       | Aggregate from ball-by-ball                                                                             |
| `GET /api/players/:id/stats/batting/milestones`      | `playerStatsService.getBattingMilestones(id, filters)`   | Compute from batting scorecards                                                                         |
| `GET /api/players/:id/stats/bowling/phase-wise`      | `playerStatsService.getBowlingPhaseStats(id, filters)`   | Aggregate from ball-by-ball                                                                             |
| `GET /api/players/:id/stats/bowling/situational`     | `playerStatsService.getBowlingSituational(id, filters)`  | Aggregate from ball-by-ball                                                                             |
| `GET /api/players/:id/stats/bowling/vs-batter-type`  | `playerStatsService.getBowlingVsBatterType(id, filters)` | Aggregate from ball-by-ball                                                                             |
| `GET /api/players/:id/stats/bowling/wicket-types`    | `playerStatsService.getWicketTypes(id, filters)`         | Aggregate from batting scorecards (dismissal_type where dismissed_by == bowlerId)                       |
| `GET /api/players/:id/stats/bowling/milestones`      | `playerStatsService.getBowlingMilestones(id, filters)`   | Compute from bowling scorecards                                                                         |
| `GET /api/players/:id/stats/advanced`                | `playerStatsService.getAdvancedStats(id)`                | Combine scorecard + ball-by-ball aggregation                                                            |
| `GET /api/players/:id/stats/partnerships`            | `playerStatsService.getPartnerships(id)`                 | Filter partnerships JSON                                                                                |
| `GET /api/players/:id/h2h/bowler/:bowlerId`          | `playerStatsService.getH2HVsBowler(batterId, bowlerId)`  | Filter ball-by-ball: batterId + bowlerId                                                                |
| `GET /api/players/:id/h2h/batter/:batterId`          | `playerStatsService.getH2HVsBatter(bowlerId, batterId)`  | Filter ball-by-ball: bowlerId + batterId                                                                |
| `GET /api/players/:id/h2h/team/:teamId`              | `playerStatsService.getH2HVsTeam(playerId, teamId)`      | Filter ball-by-ball/scorecards by bowling/batting team                                                  |
| `GET /api/players/:id/h2h/venue/:venueId`            | `playerStatsService.getH2HVsVenue(playerId, venueId)`    | Filter matches by venueId, then filter scorecards                                                       |

**Ratings (5 endpoints):**

| Original Endpoint                      | Service Function                               | Data Source                                  |
| ---------------------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| `GET /api/players/:id/ratings`         | `ratingService.getPlayerRating(id)`            | Pre-computed JSON or IndexedDB               |
| `GET /api/players/:id/ratings/history` | `ratingService.getRatingHistory(id, category)` | Pre-computed JSON or IndexedDB               |
| `GET /api/players/:id/ratings/seasons` | `ratingService.getSeasonRatings(id)`           | Pre-computed JSON or IndexedDB               |
| `GET /api/players/:id/rankings`        | `ratingService.getPlayerRankings(id)`          | Derived from pre-computed ratings            |
| `GET /api/ratings/leaderboard`         | `ratingService.getLeaderboard(filters)`        | Filter + sort pre-computed ratings in memory |

**Workspace (6 endpoints -> IndexedDB operations):**

| Original Endpoint                  | Service Function                        | Data Source                                       |
| ------------------------------------ | ----------------------------------------- | --------------------------------------------------- |
| `POST /api/workspaces`             | `workspaceService.save(workspace)`      | IndexedDB `workspaces` table                      |
| `GET /api/workspaces/:id`          | `workspaceService.load(id)`             | IndexedDB                                         |
| `PUT /api/workspaces/:id`          | `workspaceService.update(id, data)`     | IndexedDB                                         |
| `DELETE /api/workspaces/:id`       | `workspaceService.delete(id)`           | IndexedDB                                         |
| `GET /api/workspaces/share/:token` | `workspaceService.loadFromUrl(params)`  | Decode player IDs + filters from URL query params |
| `POST /api/workspaces/:id/share`   | `workspaceService.generateShareUrl(id)` | Encode player IDs + filters into URL query params |

**Teams (8 + 13 analysis endpoints):**

All team endpoints map to static JSON lookup with filtering. Team analysis endpoints map to `teamAnalysisService` which computes from ball-by-ball (cached in IndexedDB after first computation).

**Live Match (10 endpoints -> External API):**

| Original Endpoint                           | Service Function                                       | Data Source                                       |
| --------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------- |
| `GET /api/live`                             | `liveMatchService.getCurrentMatches()`                 | CricketData.org `/currentMatches`                 |
| `GET /api/live/:matchId`                    | `liveMatchService.getMatchState(matchId)`              | CricketData.org `/match_scorecard`                |
| `GET /api/live/:matchId/ball-by-ball`       | `liveMatchService.getBallByBall(matchId)`              | CricketData.org `/match_bbb`                      |
| `GET /api/live/:matchId/scorecard`          | `liveMatchService.getLiveScorecard(matchId)`           | CricketData.org `/match_scorecard`                |
| `GET /api/live/:matchId/batter/:id/overlay` | `liveMatchService.getBatterOverlay(matchId, batterId)` | Aggregate from cached live ball-by-ball in memory |
| `GET /api/live/:matchId/bowler/:id/overlay` | `liveMatchService.getBowlerOverlay(matchId, bowlerId)` | Aggregate from cached live ball-by-ball in memory |
| WebSocket `score:update`                    | Replaced by polling                                    | 30-second poll interval                           |
| WebSocket `ball:new`                        | Replaced by polling                                    | 15-30 second poll interval                        |
| WebSocket `wicket:fall`                     | Derived client-side                                    | Compare consecutive poll responses                |
| WebSocket `match:end`                       | Derived client-side                                    | Detect status change in poll response             |

All remaining endpoints (Matches, Seasons, Auctions, Venues, Sponsors, Cap Race, Records, Education, Scouting, Comparison) follow the same pattern: static JSON files loaded via `fetch()`, filtered/aggregated in memory.

### C.3 TanStack Query Caching Strategy

```typescript
// queryClient.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours for static data
      gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days garbage collection
      refetchOnWindowFocus: false,      // Static data never changes mid-session
      retry: 2,
    },
  },
});
```

**Cache tier configuration:**

| Data Type                                       | staleTime              | gcTime    | refetchOnWindowFocus |
| ------------------------------------------------- | ------------------------ | ----------- | ---------------------- |
| Static reference data (players, teams, seasons) | `Infinity`             | 7 days    | `false`              |
| Match/scorecard data                            | 24 hours               | 7 days    | `false`              |
| Pre-computed ratings                            | `Infinity`             | 7 days    | `false`              |
| Live match data                                 | 15 seconds             | 5 minutes | `true`               |
| Computed stats (phase-wise, H2H)                | `Infinity` per session | Session   | `false`              |
| External API responses                          | 30 seconds             | 5 minutes | `true`               |

**Query key patterns:**

```typescript
// Static data
['players']
['player', playerId]
['matches', seasonYear]
['scorecards', 'batting', seasonYear]

// Computed stats (include all filters in key for proper caching)
['player-stats', playerId, 'batting', 'phase-wise', { teamId, seasonYear }]
['player-stats', playerId, 'h2h', 'bowler', bowlerId]

// Live data
['live-matches']
['live-match', matchId]
['live-bbb', matchId]

// Scouting
['scouting', 'leagues', countryId]
['scouting', 'player-stats', leagueCode]
```

### C.4 Data Transformation Pipeline

```
Static JSON File (fetch)
    ↓
TanStack Query (cache layer)
    ↓
Service Function (filter, aggregate, transform)
    ↓
Custom Hook (usePlayerStats, useMatch, etc.)
    ↓
React Component (renders)
```

For heavy computations:

```
Static JSON File (fetch) → IndexedDB (persistent cache)
    ↓
Web Worker (aggregate ball-by-ball, compute ratings)
    ↓
Result → IndexedDB (persistent cache) + postMessage to main thread
    ↓
Service Function → Custom Hook → Component
```

---

## D. State Management

### D.1 State Distribution

| State Category                                        | Where It Lives                     | Why                                                                        |
| ------------------------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------- |
| **Theme (dark/light)**                                | Redux `themeSlice` + localStorage  | Global UI state, needs to be instantly reactive                            |
| **Filter state (player filters, season, team)**       | Redux `filterSlice` + URL params   | Global filters applied across components, synced to URL for shareability   |
| **UI state (sidebar, modals, toasts)**                | Redux `uiSlice`                    | Transient UI state, no persistence needed                                  |
| **Workspace state (selected players, layout)**        | Redux `workspaceSlice` + IndexedDB | Complex state with save/load capability                                    |
| **Scouting filters**                                  | Redux `scoutingSlice`              | Global scouting filter context                                             |
| **Team analysis view**                                | Redux `teamAnalysisSlice`          | Selected team, season, view mode                                           |
| **Static data (players, teams, matches, scorecards)** | TanStack Query cache               | Server-state pattern; automatic caching, deduplication, background refresh |
| **Ball-by-ball data**                                 | IndexedDB (Dexie.js)               | Too large for in-memory; persistent across sessions                        |
| **Computed ratings**                                  | IndexedDB + TanStack Query         | Persistent computation results; query cache for current-session access     |
| **Computed stats (phase-wise, H2H)**                  | TanStack Query cache               | Session-scoped memoization of computation results                          |
| **Live match data**                                   | TanStack Query (short staleTime)   | Frequently refreshed, ephemeral                                            |
| **Workspaces**                                        | IndexedDB (Dexie.js)               | User-created, persists across sessions, potentially large                  |
| **Watchlist**                                         | IndexedDB (Dexie.js)               | User-created, persists across sessions                                     |
| **User preferences**                                  | localStorage                       | Simple key-value preferences (sort order, default view, etc.)              |

### D.2 Handling the Ball-by-Ball Dataset

The ~260,000+ ball-by-ball records (~50-60MB JSON) cannot live entirely in memory. Strategy:

1. **Load per-season**: When a user views Player Detail with deep stats, load only the seasons that player participated in.
2. **Store in IndexedDB**: After fetching a season's ball-by-ball JSON, write it into the `ballByBall` Dexie table. Subsequent accesses read from IndexedDB (instant, no network).
3. **Query via Dexie indexes**: Use compound indexes (`[batterId+seasonYear]`, `[bowlerId+seasonYear]`) for fast player-specific queries.
4. **Aggregate in Web Worker**: For cross-season aggregation, post a message to the stats worker which queries IndexedDB internally and returns aggregated results.
5. **Progressive loading with UI feedback**: Show a loading indicator ("Loading detailed stats...") while ball-by-ball data loads. Display scorecard-based stats immediately (from the lighter scorecards files), then enhance with ball-by-ball granularity when available.
6. **Memory cap**: Never hold more than 3 seasons' ball-by-ball data in JavaScript memory simultaneously. Use IndexedDB as the primary store and query into it.

---

## E. Build Pipeline

> **The build pipeline is the backbone of this architecture.** Since we have no independent data source, the pipeline is where raw external data (CricSheet CSVs, Kaggle datasets, curated JSON) gets transformed into the optimized, pre-aggregated static JSON that powers the entire application. Every stat, rating, and analytical insight the app displays is either pre-computed here or derived client-side from what this pipeline produces. Treat the pipeline as the "backend replacement" — it runs at build time instead of request time, but does the same work.

### E.1 Pre-Processing Scripts

The `scripts/` directory contains Node.js scripts that run at build time:

```
scripts/
  data-pipeline/
    01-parse-cricsheet-ipl.ts          # Parse CricSheet IPL CSV → JSON
    02-parse-cricsheet-domestic.ts     # Parse CricSheet domestic league CSVs → JSON
    03-parse-scraped-scorecards.ts     # Parse scraped scorecard data → JSON
    04-link-domestic-players.ts        # Fuzzy-match domestic names to IPL player IDs
    05-build-player-index.ts           # Generate lightweight players-index.json
    06-aggregate-domestic-stats.ts     # Pre-aggregate domestic_player_league_stats
    07-compute-cap-race.ts             # Build match-by-match cap race standings
    08-compute-ratings.ts              # Run full rating engine (Node.js)
    09-compute-auction-roi.ts          # Compute auction ROI per player per season
    10-compute-scouting-scores.ts      # Compute scouting scores for all domestic players
    11-split-by-season.ts              # Split monolithic data into per-season files
    12-generate-manifest.ts            # Generate data-manifest.json with file hashes
    13-validate-data.ts                # Cross-verify top 30 players against known stats
  utils/
    csv-parser.ts                      # CricSheet CSV parsing utilities
    fuzzy-matcher.ts                   # Name fuzzy matching (Levenshtein / trigram)
    stat-calculators.ts                # Shared stat formulas (batting avg, SR, economy)
```

**Build integration (vite.config.ts):**

```typescript
// Custom Vite plugin that runs the data pipeline before build
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ipl-data-pipeline',
      buildStart: async () => {
        if (process.env.SKIP_DATA_PIPELINE !== 'true') {
          await runDataPipeline(); // Executes scripts 01-13 in sequence
        }
      }
    }
  ]
});
```

### E.2 Data Splitting Strategy

**By Season (primary split axis):**
- Matches: one file per season (~30KB each)
- Scorecards: three files per season (batting/bowling/fielding)
- Ball-by-ball: one file per season (~2-4MB each)
- Partnerships: one file per season
- Cap race: one file per season

**By League (for scouting):**
- Domestic stats, matches, performances: one set of files per league

**By Player (for heavy stats -- optional optimization):**
- Pre-aggregated player career stats: one file per player or grouped alphabetically
- This avoids loading entire season ball-by-ball files just to show one player's stats

### E.3 CDN and Caching Strategy

**Netlify/Vercel deployment:**
- Static JSON files in `/public/data/` are served from edge CDN
- Files are content-hashed (e.g., `season-2024.abc123.json`) for cache busting
- `Cache-Control: public, max-age=31536000, immutable` for hashed files
- `data-manifest.json` has `Cache-Control: no-cache` (always fresh)
- Gzip/Brotli compression enabled (JSON compresses ~70-80%, so 50MB raw becomes ~10-15MB transferred)

**Build-time optimization:**
- JSON files are minified (no pretty-printing)
- Optional: Convert large JSON arrays to MessagePack or CBOR format for ~30% smaller transfer
- Split files by common access patterns (most users view current season, not 2008)

### E.4 CI/CD for Data Updates

Since all historical data originates from CricSheet (which publishes match data hours after completion), the CI/CD pipeline automates the pull-transform-deploy cycle:

**During IPL season (after each match):**
1. **Scheduled GitHub Action** runs daily at 06:00 IST (or manually triggered after a match)
2. Downloads the latest CricSheet CSV bundle (incremental diff where possible)
3. Runs pipeline scripts 01-13 — only regenerates files affected by new matches (current season match data, scorecards, ball-by-ball, cap race, ratings for affected players)
4. Runs `13-validate-data.ts` to cross-verify output against known stats (catches CricSheet errors or pipeline bugs)
5. Commits updated JSON to repo (auto-generated commit message with match IDs included)
6. Netlify/Vercel auto-deploys from commit
7. `data-manifest.json` hash changes → client-side cache invalidation on next user visit

**Off-season:**
- Weekly scheduled run to pick up CricSheet corrections, player status changes, and auction data
- Manual trigger for major events (auction, retention announcements, pre-season roster updates)

**Manual data curation triggers:**
- Auction results (not in CricSheet — manually curated `auctions/*.json`)
- Player bio updates (trades, retirements, status changes → `players.json`)
- New season setup (team rosters, new players, coaching changes)

**Key constraint:** There is no way to make post-match stats appear faster than CricSheet publishes. The live API covers the gap during matches, but finalized historical data depends entirely on CricSheet's publication timeline (typically 2-12 hours post-match).

---

## F. Live Match Integration

> **Context:** We have no independent live data feed. All live match data is consumed from free/paid third-party APIs. This means live match features are entirely dependent on the uptime, rate limits, and data quality of these external providers. The architecture is designed to degrade gracefully when the API is unavailable or rate-limited.

### F.1 API Selection

**Primary: CricketData.org (CricAPI)**
- Free tier: 100 requests/day
- Endpoints: `/currentMatches`, `/match_scorecard`, `/match_bbb`, `/match_info`
- Response format: JSON
- Latency: typically 15-30 seconds behind real-time
- **Limitation**: 100 requests/day is tight during a match day — budget allocation: ~10 for match list polls, ~60 for scorecard polls (one match, 30s interval × 30 min active viewing), ~30 for ball-by-ball

**Fallback: CricAPI (cricapi.com)**
- Free tier: 100 requests/day
- Similar endpoint coverage
- Use when primary API is down or rate-limited

**Optional upgrade: Sportmonks Cricket API** (paid, $29/month)
- 2,500 requests/day — eliminates rate limit concerns entirely
- More reliable, faster updates, better data structure
- Recommended if the app sees regular match-day usage

### F.2 Polling Strategy

```typescript
// useLiveMatch.ts
function useLiveMatch(matchId: string | null) {
  const isPageVisible = usePageVisibility(); // Page Visibility API

  // Poll for current matches (home page)
  const { data: liveMatches } = useQuery({
    queryKey: ['live-matches'],
    queryFn: () => liveMatchService.getCurrentMatches(),
    refetchInterval: isPageVisible ? 60_000 : false, // 60s when visible, pause when hidden
    enabled: true,
  });

  // Poll for match detail (match page)
  const { data: matchState } = useQuery({
    queryKey: ['live-match', matchId],
    queryFn: () => liveMatchService.getMatchState(matchId!),
    refetchInterval: isPageVisible ? 30_000 : false, // 30s when visible
    enabled: !!matchId,
  });

  // Poll for ball-by-ball (live tab)
  const { data: ballByBall } = useQuery({
    queryKey: ['live-bbb', matchId],
    queryFn: () => liveMatchService.getBallByBall(matchId!),
    refetchInterval: isPageVisible ? 15_000 : false, // 15s when visible
    enabled: !!matchId,
  });

  return { liveMatches, matchState, ballByBall };
}
```

### F.3 WebSocket Replacement

The original architecture uses WebSockets (Socket.IO) for real-time push. In the frontend-only architecture, this is replaced entirely by polling:

| Original WebSocket Event | Replacement                                                                             |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| `score:update`           | Poll `/match_scorecard` every 30s, diff with previous response                          |
| `ball:new`               | Poll `/match_bbb` every 15s, compare last ball with cached state, render new deliveries |
| `wicket:fall`            | Detect `isWicket: true` in new ball data from poll diff                                 |
| `milestone`              | Detect score thresholds (50, 100, 5W) by comparing cumulative stats between polls       |
| `innings:end`            | Detect innings status change in poll response                                           |
| `match:end`              | Detect match status change to `completed` in poll response                              |
| `match:status`           | Compare `status` field between consecutive poll responses                               |

**Client-side event derivation:**

```typescript
// liveMatchService.ts
function deriveEvents(prevState: MatchState | null, newState: MatchState): LiveEvent[] {
  const events: LiveEvent[] = [];

  if (!prevState) return events;

  // New ball detection
  const prevBalls = prevState.ballByBall?.length ?? 0;
  const newBalls = newState.ballByBall?.length ?? 0;
  if (newBalls > prevBalls) {
    const newDeliveries = newState.ballByBall!.slice(prevBalls);
    newDeliveries.forEach(ball => {
      events.push({ type: 'ball:new', data: ball });
      if (ball.isWicket) events.push({ type: 'wicket:fall', data: ball });
      if (ball.isFour || ball.isSix) events.push({ type: 'boundary', data: ball });
    });
  }

  // Milestone detection
  // ... compare cumulative scores

  // Match end detection
  if (prevState.status === 'live' && newState.status === 'completed') {
    events.push({ type: 'match:end', data: newState });
  }

  return events;
}
```

### F.4 Post-Match Update Flow

There are two distinct phases after a match, because the live API and the historical data source (CricSheet) are different systems with different timelines:

**Phase 1: Match completes (immediate — from live API)**
1. Polling detects `status: 'completed'` in the API response
2. Final scorecard and match result are displayed from the live API data
3. The app shows a "Stats finalizing..." indicator on detailed analytics (ratings impact, career stat updates) that depend on CricSheet data
4. Live API data is cached in IndexedDB as a temporary bridge until CricSheet data arrives

**Phase 2: CricSheet publishes data (2-12 hours later — via CI/CD)**
1. Scheduled GitHub Action (or manual trigger) detects new CricSheet CSV data
2. Pipeline runs: regenerates current season JSON, recomputes cap race, incrementally updates ratings for affected players
3. Redeploy to CDN
4. On next user visit, `data-manifest.json` hash mismatch triggers cache refresh
5. Temporary live API cache in IndexedDB is replaced by authoritative CricSheet-derived data

**During the live match** (before CricSheet data is available):
- Live ball-by-ball data from the API is cached in-memory for the session
- Wagon wheel / pitch map overlays work from live API data if the API provides shot/pitch fields
- If the API does not provide shot/pitch fields, overlays show "Detailed ball data available after match" message
- Live data is **not** mixed into historical stats — it's displayed separately to avoid data integrity issues

---

## G. Limitations and Trade-offs

### G.1 Feature Degradation

> **Note:** This project has no independent match data source. All live and historical data originates from free third-party APIs (CricBuzz, ESPNCricinfo) and CricSheet open data. The table below compares what a hypothetical backend *with its own data pipeline* could offer versus our frontend-only reality, and assesses the actual impact given this constraint.

| Feature                         | What a Backend Would Need                            | Frontend-Only Behavior                                                         | Actual Impact (No Own Data Source)                                                                                     |
| --------------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Live match latency**          | WebSocket push fed by own ingestion pipeline         | Poll third-party API at 15-60 second intervals                                 | **Marginal.** A backend without its own data would also poll the same third-party APIs; WebSocket would just relay the polled result to the client — no real latency gain |
| **Live match reliability**      | Validated pipeline with failover across sources      | Dependent on single free API's uptime and rate limits                           | **Moderate.** A backend could rotate across multiple API keys and cache responses to absorb rate limits; frontend must rely on a single source per request |
| **Post-match stat updates**     | Background job to pull and merge new CricSheet data  | Requires rebuild and redeploy after CricSheet publishes data (typically hours)  | **Moderate.** Backend could automate the pull, but both architectures wait on CricSheet's publication delay — the gap is automation, not speed of data availability |
| **Global search**               | PostgreSQL full-text search with pg_trgm             | Client-side Fuse.js fuzzy search over ~700 player names                        | **Low.** Dataset is small enough that client-side fuzzy search is responsive; no full-text across match commentary, but that data isn't in our dataset anyway |
| **Data corrections**            | Retroactive cascade through materialized views       | Requires rebuild and redeploy of static data                                   | **Low.** CricSheet corrections are rare and batched; a periodic rebuild is acceptable for the correction frequency we actually encounter |
| **Shareable workspaces**        | UUID-keyed persistent database storage               | URL-encoded player IDs + filters                                               | **Low-Moderate.** URLs can get long with many players; no persistent cloud storage, but URL sharing covers the primary use case |
| **Watchlist**                   | Persisted in database (survives device change)       | IndexedDB (browser-local only)                                                 | **Moderate.** Lost if browser data cleared; no cross-device sync. Acceptable for a single-user analytics tool |
| **Concurrent users**            | Server handles load, but adds infra cost             | CDN serves static files                                                        | **Positive.** Frontend-only is actually *better* here — CDN scales reads infinitely at near-zero marginal cost |
| **Ball-by-ball overlay data**   | Could enrich with shot/pitch coordinates from APIs   | CricSheet may not provide shot_direction, pitch_x, pitch_y                     | **No difference.** The missing fields (shot direction, pitch coordinates) are not available from any free source — a backend cannot conjure data that doesn't exist |
| **Rating engine cold start**    | Pre-computed in DB, instant queries                  | Pre-computed at build time OR 3-8 second Web Worker computation on first visit | **Negligible.** Pre-computing at build time eliminates this gap entirely |
| **Scouting search performance** | PostgreSQL indexed queries across millions of rows   | Client-side filtering of pre-aggregated JSON (~200KB per league)               | **Negligible.** Pre-aggregated data keeps the client-side dataset small; filtering ~700 players is instantaneous |

### G.2 Performance Considerations

**Memory pressure:**
- Ball-by-ball data for a single season: ~3MB in memory
- 3 seasons simultaneously: ~9MB
- All 18 seasons: ~54MB (should never happen; load on demand)
- Browser tab memory limit: typically 1-4GB; well within bounds
- Mitigation: Load and process one season at a time; persist to IndexedDB; release from memory after processing

**Initial load time:**
- Core reference data: ~200KB (gzipped: ~50KB) -- loads in <1 second
- First match detail with scorecards: ~150KB additional -- loads in <1 second
- First deep stats request (triggers ball-by-ball load): ~3MB (gzipped: ~600KB) -- loads in 2-5 seconds on 3G
- Mitigation: Show scorecard-level stats immediately; lazy-load ball-by-ball stats with loading indicators

**Computation latency:**
- Phase-wise stats for one player (one season): <50ms
- Phase-wise stats for one player (all seasons): ~200-500ms (Web Worker)
- H2H aggregation (two players, all matches): ~100-300ms
- Full rating engine rebuild: ~3-8 seconds (Web Worker, one-time)
- SWOT analysis for one team: ~1-3 seconds (Web Worker)

**Bundle size:**
- React + Vite + Tailwind + ShadCN: ~300KB gzipped
- Dexie.js: ~30KB gzipped
- Fuse.js: ~15KB gzipped
- Recharts: ~150KB gzipped
- Framer Motion: ~50KB gzipped
- Total JS bundle: ~550-600KB gzipped
- Code-split per page with React.lazy() and Suspense

### G.3 Data Freshness Challenges

Since we depend entirely on external data sources, freshness is governed by *their* publication timelines, not ours:

| Scenario               | External Dependency                                                      | Our Response                                                                                                    | Typical Lag         |
| ------------------------ | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------- |
| **During a live match**  | Free API uptime and rate limits                                          | Poll at 15-60s intervals; degrade to "Score unavailable" banner if API is down; resume on recovery              | 15-60 seconds       |
| **Match just completed** | CricSheet publishes CSV hours after match                                | Live API covers immediate display; CI/CD pipeline ingests CricSheet data once available; redeploy               | 2-12 hours          |
| **Auction happening**    | No structured external source for auction results                        | Manually curate `auctions/*.json` from live broadcasts/official announcements; trigger pipeline + deploy        | Manual, same day    |
| **Player bio update**    | No external feed for trades, retirements, status changes                 | Manual update to `players.json`; redeploy                                                                       | Manual, as needed   |
| **New season starts**    | Rosters, new players, coaching changes announced across multiple sources | Pre-season data curation sprint — compile from official team announcements; deploy before first match           | 1-2 days of curation |
| **Data correction**      | CricSheet publishes corrections in subsequent CSV releases               | Rebuild affected season files via pipeline; redeploy; IndexedDB version stamp triggers client cache invalidation | Next pipeline run   |
| **API provider down**    | Free APIs have no SLA — can go offline without notice                    | Fallback to secondary API; show cached last-known state; display "Live data temporarily unavailable" banner     | Until API recovers  |

### G.4 Security Considerations

- **API key exposure**: CricketData.org API key is exposed in client-side code. Mitigation: Use a free-tier key with low rate limits; rotate regularly; or use a lightweight Netlify/Vercel edge function as a proxy (not a custom backend — a 5-line serverless function). Since we don't own the data, the worst case of key abuse is someone exhausting our daily quota, not data theft.
- **No user authentication**: Workspaces and watchlists are local. No user accounts, no personal data collected. This is a deliberate simplification.
- **Data integrity**: All historical data is read-only from CDN; users cannot modify source data. Live data from external APIs is treated as untrusted — validated and normalized before display.
- **External API dependency**: We have zero control over API response format changes. The `liveMatchService` normalizer layer must be robust enough to handle unexpected response shapes without crashing the app.

---

## Summary: Architecture Diagram

```
                        EXTERNAL DATA SOURCES (we own none of these)
                        ─────────────────────────────────────────────
                        │                                           │
            ┌───────────▼───────────┐               ┌──────────────▼──────────────┐
            │                       │               │                             │
            │  CricSheet (CSV)      │               │  CricketData.org / CricAPI  │
            │  Kaggle Datasets      │               │  (free-tier live APIs)      │
            │  Curated JSON         │               │                             │
            │                       │               │  No SLA · Rate-limited      │
            │  ► Historical data    │               │  ► Live match data only     │
            │  ► Published hours    │               │  ► 15-60s behind real-time  │
            │    after match        │               │                             │
            └───────────┬───────────┘               └──────────────┬──────────────┘
                        │                                          │
            BUILD TIME (CI/CD)                          RUNTIME (browser)
                        │                                          │
                        ▼                                          │
╔══════════════════════════════════════╗                            │
║                                      ║                            │
║  Node.js Data Pipeline (13 scripts)  ║                            │
║                                      ║                            │
║  CricSheet CSV → Parse → Aggregate   ║                            │
║  → Compute ratings → Split by season ║                            │
║  → Validate → Generate manifest      ║                            │
║                                      ║                            │
╚══════════════════╤═══════════════════╝                            │
                   │                                               │
                   ▼                                               │
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                         NETLIFY / VERCEL CDN                                 ║
║                                                                              ║
║ React SPA (Vite bundle) · Static JSON (/data/*) · Images (/images/*)         ║
║                                                                              ║
╚══════════════════════════════════════╤═══════════════════════════════════════╝
                                       │
                                       ▼
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║                           BROWSER (CLIENT)                                   ║
║                                                                              ║
║  ┌────────────────────────────────────────────────────────────────────────┐  ║
║  │                                                                        │  ║
║  │                        React 18 + Vite                                 │  ║
║  │      Tailwind CSS · ShadCN/UI · Recharts · React Router v6             │  ║
║  │                                                                        │  ║
║  └──────────────────┬────────────────────────────┬────────────────────────┘  ║
║                     │                            │                           ║
║        ┌───────────▼───────────┐    ┌───────────▼───────────┐                ║
║        │                       │    │                       │                ║
║        │ Redux Toolkit         │    │ TanStack Query        │                ║
║        │ (UI state)            │    │ (data cache)          │                ║
║        │                       │    │                       │                ║
║        └───────────────────────┘    └───────────┬───────────┘                ║
║                                                 │                            ║
║  ┌─────────────────────────────────────────────▼──────────────────────────┐  ║
║  │                                                                        │  ║
║  │                       SERVICE FUNCTIONS                                │  ║
║  │ playerService · matchService · ratingService · liveService             │  ║
║  │ scoutingService · teamAnalysisService · workspaceService               │  ║
║  │                                                                        │  ║
║  └────────┬─────────────────────┬─────────────────────┬───────────────────┘  ║
║           │                     │                     │                      ║
║   ┌────────▼───────────┐ ┌────────▼───────────┐ ┌────────▼───────────┐       ║
║   │                    │ │                    │ │                    │       ║
║   │ Static JSON        │ │ External Cricket   │◄──── (live API)     │       ║
║   │ fetch()            │ │ API (live only)    │ │                    │       ║
║   │                    │ │                    │ │ Web Workers        │       ║
║   │ /data/*.json       │ │ CricketData.org    │ │ · Rating Engine    │       ║
║   │ from CDN           │ │ (polled 15-60s)    │ │ · Stats Aggregator │       ║
║   │                    │ │                    │ │ · SWOT Analyzer    │       ║
║   └────────────────────┘ └────────────────────┘ └────────┬───────────┘       ║
║                                                          │                   ║
║  ┌──────────────────────────────────────────────────────▼─────────────────┐  ║
║  │                                                                        │  ║
║  │                     IndexedDB (Dexie.js)                               │  ║
║  │                                                                        │  ║
║  │ · ball_by_ball cache (per-season, ~3MB each)                           │  ║
║  │ · computed ratings cache (ratings, history, season snapshots)          │  ║
║  │ · computed SWOT cache (per-team, per-season)                           │  ║
║  │ · workspaces (user-created analytics workspaces)                       │  ║
║  │ · watchlist (scouting watchlist entries)                               │  ║
║  │ · data version stamps (cache invalidation)                             │  ║
║  │ · live match cache (temporary bridge until CricSheet data arrives)     │  ║
║  │                                                                        │  ║
║  └────────────────────────────────────────────────────────────────────────┘  ║
║                                                                              ║
║  ┌────────────────────────────────────────────────────────────────────────┐  ║
║  │                                                                        │  ║
║  │                        localStorage                                    │  ║
║  │                                                                        │  ║
║  │ · theme preference (dark/light)                                        │  ║
║  │ · filter defaults                                                      │  ║
║  │ · sort preferences                                                     │  ║
║  │                                                                        │  ║
║  └────────────────────────────────────────────────────────────────────────┘  ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

---

### Implementation Priority Order

Since we depend on external data sources, the build order follows the data flow — pipeline first, then services that consume the pipeline output, then live features:

**Phase 1: Build-Time Pipeline (the "backend replacement")**
1. `/scripts/data-pipeline/01-parse-cricsheet-ipl.ts` — The foundational script that converts CricSheet CSV data into the entire static JSON file hierarchy. Everything downstream depends on this parser producing correctly structured output.
2. `/scripts/data-pipeline/08-compute-ratings.ts` — The rating engine running at build time (Node.js). Pre-computes all player ratings so the client doesn't need to on first load.
3. `/scripts/data-pipeline/13-validate-data.ts` — Cross-verifies output against known stats. Critical because we can't control CricSheet data quality — this is our only safety net.

**Phase 2: Client Data Layer**
4. `/src/lib/db.ts` — Dexie.js IndexedDB schema: tables for ball-by-ball cache, computed ratings, workspaces, watchlist, live match cache, and data version tracking.
5. `/src/services/playerStatsService.ts` — The most complex service file, aggregating scorecards and ball-by-ball data client-side with Web Worker delegation for heavy computations.
6. `/src/workers/rating-worker.ts` — Web Worker for incremental rating recomputation (only needed if user loads data newer than the build-time pre-computation).

**Phase 3: Live Match Integration (external API dependent)**
7. `/src/services/liveMatchService.ts` — External API integration for CricketData.org/CricAPI. Handles polling, response normalization, rate limit budgeting, event derivation (replacing WebSocket push), and graceful degradation when the API is unavailable.

**Phase 4: CI/CD Automation**
8. `.github/workflows/data-update.yml` — Scheduled GitHub Action for automated CricSheet pulls, pipeline execution, and redeployment. This closes the loop between external data publication and app freshness.

Sources:
- [CricSheet Downloads](https://cricsheet.org/downloads/)
- [CricSheet JSON Format](https://cricsheet.org/format/json/)
- [CricketData.org API](https://cricketdata.org/)
- [CricketData.org Documentation](https://cricketdata.org/how-to-use-cricket-data-api.aspx)
- [CricAPI](https://www.cricapi.com/)
- [Dexie.js](https://dexie.org)
- [Dexie.js GitHub - Large Dataset Issue](https://github.com/dexie/Dexie.js/issues/1150)
- [Kaggle IPL Ball-by-Ball Dataset](https://www.kaggle.com/datasets/jamiewelsh2/ball-by-ball-ipl)
- [Sportmonks Cricket API](https://www.sportmonks.com/cricket-api/)
- [Web Workers for Large Datasets - Smashing Magazine](https://www.smashingmagazine.com/2023/04/potential-web-workers-multithreading-web/)