# IPL Analysis Website - Implementation Plan & Structure

---

## 1. Tech Stack

| Layer              | Technology                        | Reason                                                              |
| ------------------ | --------------------------------- | ------------------------------------------------------------------- |
| **Frontend**       | React.js (with Vite)              | Component-based architecture, fast dev experience, rich ecosystem   |
| **UI Library**     | ShadCN/UI + Radix UI              | Pre-built accessible components, fully customizable, Tailwind-based |
| **Styling**        | Tailwind CSS + Framer Motion      | Utility-first styling, smooth animations                            |
| **Charts/Graphs**  | Recharts / Chart.js               | Interactive, responsive data visualizations for stats & analytics   |
| **Routing**        | React Router v6                   | Client-side routing with nested layouts                             |
| **State Mgmt**     | Redux Toolkit + TanStack Query    | Global client state via RTK slices, server state via TanStack Query |
| **Backend**        | NestJS + Node.js + TypeScript     | Modular framework — DI, decorators, guards, pipes, interceptors     |
| **Database**       | PostgreSQL                        | Relational data with complex joins (players-teams-matches-seasons)  |
| **ORM**            | TypeORM                           | Decorator-based entities, repository pattern, query builder, migrations |
| **Authentication** | Optional (future scope)           | Not a core requirement now                                          |
| **Deployment**     | Netlify (frontend) + Firebase Cloud Functions (API) | Serverless backend, edge CDN frontend, auto-scaling   |

---

## 2. Project Folder Structure

```
ipl-analysis/
├── client/                          # Frontend (React + Vite)
│   ├── public/
│   │   ├── images/
│   │   │   ├── teams/               # Team logos
│   │   │   ├── players/             # Player photos
│   │   │   ├── venues/              # Ground images
│   │   │   └── sponsors/            # Sponsor logos
│   │   └── favicon.ico
│   ├── src/
│   │   ├── assets/                  # Static assets (icons, fonts)
│   │   ├── components/
│   │   │   ├── ui/                  # ShadCN/UI components (auto-generated via `npx shadcn-ui add`)
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── accordion.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── command.tsx       # Searchable command palette (global search)
│   │   │   │   ├── skeleton.tsx      # Loading skeletons
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── chart.tsx         # ShadCN chart wrapper (Recharts)
│   │   │   │   └── ...               # Other ShadCN components as needed
│   │   │   ├── common/              # Custom layout & composite components
│   │   │   │   ├── Navbar.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   ├── SearchBar.tsx     # Built on ShadCN Command component
│   │   │   │   ├── DataTable.tsx     # Built on ShadCN Table + TanStack Table
│   │   │   │   ├── StatCard.tsx      # Built on ShadCN Card
│   │   │   │   ├── ChartWrapper.tsx
│   │   │   │   ├── Breadcrumb.tsx
│   │   │   │   └── ThemeToggle.tsx   # Dark/Light mode toggle
│   │   │   ├── players/
│   │   │   │   ├── PlayerSearchAutocomplete.jsx  # Real-time search with dropdown suggestions (ShadCN Command)
│   │   │   │   ├── PlayerFilterPanel.jsx         # Sidebar/collapsible filter panel with all filter options
│   │   │   │   ├── PlayerActiveFilters.jsx       # Shows active filter badges with remove/clear-all actions
│   │   │   │   ├── PlayerCard.jsx
│   │   │   │   ├── PlayerBio.jsx
│   │   │   │   ├── PlayerCoachToggle.jsx  # Toggle between Player/Coach profile
│   │   │   │   ├── PlayerStrengths.jsx
│   │   │   │   ├── PlayerOverallStats.jsx # Core batting/bowling/fielding numbers
│   │   │   │   ├── PlayerTeamWise.jsx     # Stats split per franchise
│   │   │   │   ├── PlayerSeasonWise.jsx   # Stats split per season
│   │   │   │   ├── PlayerPhaseWise.jsx    # Powerplay / Middle / Death overs
│   │   │   │   ├── PlayerSituational.jsx  # Bat first vs chase, wins vs losses
│   │   │   │   ├── PlayerVsBowlingType.jsx # vs Pace / Spin / Left-arm / Right-arm
│   │   │   │   ├── PlayerDismissals.jsx   # Dismissal type breakdown (batting & bowling)
│   │   │   │   ├── PlayerPositionStats.jsx # Batting position analysis
│   │   │   │   ├── PlayerMilestones.jsx   # Fastest 50/100, streaks, records
│   │   │   │   ├── PlayerFielding.jsx     # Catches, run outs, stumpings (WK)
│   │   │   │   ├── PlayerAllRounder.jsx   # All-rounder rating, multi-discipline impact
│   │   │   │   ├── PlayerAdvanced.jsx     # MVP, clutch index, playoff/finals stats
│   │   │   │   ├── PlayerHeadToHead.jsx   # vs specific bowler/batter/team/venue
│   │   │   │   ├── PlayerComparison.jsx   # Side-by-side comparison with another player
│   │   │   │   ├── PlayerAuctionHistory.jsx # Auction timeline across seasons
│   │   │   │   └── PlayerRadarChart.jsx   # Visual radar of strengths across disciplines
│   │   │   ├── ratings/
│   │   │   │   ├── PlayerRatingBadge.jsx        # Displays rating (0-1000) with color-coded label on player profile
│   │   │   │   ├── RatingTrendChart.jsx         # Line chart showing rating movement over matches/seasons
│   │   │   │   ├── RankMovementIndicator.jsx    # Up/down/stable arrow with rank change
│   │   │   │   └── RatingLeaderboard.jsx        # Top-rated players table with filters
│   │   │   ├── workspace/
│   │   │   │   ├── WorkspaceCanvas.jsx          # Main empty-state canvas that populates as players are added
│   │   │   │   ├── WorkspacePlayerSelector.jsx  # Search & add unlimited players to workspace
│   │   │   │   ├── WorkspaceComparisonTable.jsx # Dynamic multi-player stat comparison table
│   │   │   │   ├── WorkspaceRadarOverlay.jsx    # Overlaid radar chart for all selected players
│   │   │   │   ├── WorkspaceCareerGraph.jsx     # Multi-line career progression (runs/rating over seasons)
│   │   │   │   ├── WorkspaceScatterPlot.jsx     # Scatter plot (e.g., avg vs SR with player dots)
│   │   │   │   ├── WorkspaceFilterBar.jsx       # Season range, team, venue, phase filters
│   │   │   │   ├── WorkspaceSaveLoad.jsx        # Save/load workspace configurations
│   │   │   │   ├── WorkspaceExport.jsx          # Export as PNG/CSV
│   │   │   │   └── WorkspaceShareLink.jsx       # Generate shareable URL
│   │   │   ├── coaches/
│   │   │   │   ├── CoachCard.jsx
│   │   │   │   ├── CoachProfile.jsx
│   │   │   │   └── CoachAnalysis.jsx
│   │   │   ├── teams/
│   │   │   │   ├── TeamCard.jsx
│   │   │   │   ├── TeamOverview.jsx
│   │   │   │   ├── TeamSponsors.jsx
│   │   │   │   ├── TeamManagement.jsx
│   │   │   │   └── TeamCoachingStaff.jsx
│   │   │   ├── matches/
│   │   │   │   ├── MatchCard.jsx
│   │   │   │   ├── Scorecard.jsx
│   │   │   │   ├── MatchAnalysis.jsx
│   │   │   │   ├── MatchTimeline.jsx
│   │   │   │   ├── BatterOverlay.jsx            # Hover/tap overlay for batters: wagon wheel, scoring areas, pitch map
│   │   │   │   ├── BowlerOverlay.jsx            # Hover/tap overlay for bowlers: bowling wagon wheel, pitch map, zones conceded
│   │   │   │   ├── WagonWheel.jsx               # Circular ground map with directional shot lines (blue=boundary, red=dot, grey=scoring, white=out)
│   │   │   │   ├── ScoringAreas.jsx             # Segmented ground zone map with heat-shaded run totals per zone
│   │   │   │   └── PitchMap.jsx                 # Top-down pitch length/line visualization with color-coded ball dots
│   │   │   ├── auctions/
│   │   │   │   ├── AuctionCard.jsx
│   │   │   │   ├── AuctionDetails.jsx
│   │   │   │   ├── AuctionPlayerList.jsx
│   │   │   │   ├── AuctionHighlights.jsx
│   │   │   │   ├── AuctionScoutingLink.jsx          # Bridge component linking auction player → scouting profile sheet
│   │   │   │   ├── AuctionTeamNeeds.jsx             # Pre-auction view: each team's SWOT gaps + budget
│   │   │   │   └── AuctionPlayerScoutingCard.jsx    # Auction player card with domestic stats preview + scouting score
│   │   │   ├── scouting/                            # Domestic League Scouting Hub
│   │   │   │   ├── ScoutingCountryGrid.jsx          # Country cards with flags & league count (grid-cols-2 → 4)
│   │   │   │   ├── ScoutingCountryDetail.jsx        # League list for a selected country
│   │   │   │   ├── ScoutingLeagueCard.jsx           # League card (logo, format badge, season count)
│   │   │   │   ├── ScoutingLeagueDetail.jsx         # League overview + season selector + top performers
│   │   │   │   ├── ScoutingPlayerCard.jsx           # Compact player card with key domestic stats
│   │   │   │   ├── ScoutingPlayerProfile.jsx        # Full domestic stats profile for a scouted player
│   │   │   │   ├── ScoutingCombinedProfile.jsx      # IPL + Domestic stats side-by-side comparison view
│   │   │   │   ├── ScoutingSearchPanel.jsx          # Advanced search with stat threshold filters
│   │   │   │   ├── ScoutingDiscoverPanel.jsx        # Profile-based discovery ("find death bowlers", "find finishers")
│   │   │   │   ├── ScoutingScoreBadge.jsx           # Scouting score (0-100) badge with color-coded label
│   │   │   │   ├── ScoutingScoreBreakdown.jsx       # Detailed breakdown of scouting score components
│   │   │   │   ├── ScoutingStatsTable.jsx           # Domestic stats table (batting/bowling/fielding tabs)
│   │   │   │   ├── ScoutingPhaseStats.jsx           # Phase-wise radar/bar charts (T20 leagues with ball-by-ball)
│   │   │   │   ├── ScoutingRecentForm.jsx           # Last 5/10 match sparkline chart
│   │   │   │   ├── ScoutingFormatComparison.jsx     # T20 vs ODI vs First-Class stats side-by-side
│   │   │   │   ├── ScoutingLeagueComparison.jsx     # Same player's stats across different leagues
│   │   │   │   ├── ScoutingWatchlist.jsx            # Watchlist management panel (list + CRUD)
│   │   │   │   ├── ScoutingWatchlistCard.jsx        # Individual watchlist entry card with notes/priority/tags
│   │   │   │   └── ScoutingFilterPanel.jsx          # Country/league/format/role/stat threshold filters
│   │   │   ├── team-analysis/                       # IPL Team Strengths & Weaknesses (SWOT) Analysis
│   │   │   │   ├── TeamSWOTDashboard.jsx            # 4-quadrant SWOT overview (Strengths/Weaknesses/Opportunities/Threats)
│   │   │   │   ├── TeamStrengthsPanel.jsx           # Detailed strengths with evidence stats and key performers
│   │   │   │   ├── TeamWeaknessesPanel.jsx          # Detailed weaknesses with gap indicators and severity
│   │   │   │   ├── TeamPhaseHeatmap.jsx             # 3×2 interactive heatmap (PP/Mid/Death × Bat/Bowl) color-coded 0-100
│   │   │   │   ├── TeamSquadDepthChart.jsx          # Visual squad composition (batters/bowlers/AR/WK × domestic/overseas)
│   │   │   │   ├── TeamOverseasAnalysis.jsx         # 4 overseas slot visualization with per-player stats
│   │   │   │   ├── TeamAgeProfile.jsx               # Age distribution histogram with succession risk flags
│   │   │   │   ├── TeamDependencyIndex.jsx          # Bar chart of player contribution %, red threshold at 30%
│   │   │   │   ├── TeamAuctionROI.jsx               # Color-coded ROI table (Green=Excellent → Red=Flop)
│   │   │   │   ├── TeamBudgetAnalysis.jsx           # Purse breakdown pie/bar chart (spent vs remaining)
│   │   │   │   ├── TeamRecruitmentPanel.jsx         # Priority positions + "Find in Scouting Hub" cross-links
│   │   │   │   ├── TeamComparisonGrid.jsx           # Multi-team SWOT side-by-side comparison
│   │   │   │   └── TeamLeagueOverview.jsx           # All 10 IPL teams at-a-glance dashboard
│   │   │   ├── venues/
│   │   │   │   ├── VenueCard.jsx
│   │   │   │   ├── VenueProfile.jsx
│   │   │   │   └── PitchAnalysis.jsx
│   │   │   ├── sponsors/
│   │   │   │   ├── SponsorCard.jsx
│   │   │   │   └── SponsorDetails.jsx
│   │   │   ├── records/
│   │   │   │   ├── RecordTable.jsx
│   │   │   │   ├── CapHolders.jsx
│   │   │   │   ├── CapRaceTracker.jsx         # Match-by-match Orange/Purple cap race leaderboard per season
│   │   │   │   ├── CapRaceChart.jsx           # Line chart showing top 5 players' cumulative runs/wickets across matches in a season
│   │   │   │   ├── ThrillerMatches.jsx
│   │   │   │   └── GameChangingInnings.jsx
│   │   │   └── education/
│   │   │       ├── FormulaCard.jsx
│   │   │       ├── DLSExplainer.jsx
│   │   │       └── StatCalculator.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── PlayersListPage.jsx
│   │   │   ├── PlayerDetailPage.jsx
│   │   │   ├── TeamsListPage.jsx
│   │   │   ├── TeamDetailPage.jsx
│   │   │   ├── CoachDetailPage.jsx
│   │   │   ├── SeasonsListPage.jsx
│   │   │   ├── SeasonDetailPage.jsx
│   │   │   ├── MatchDetailPage.jsx
│   │   │   ├── AuctionsListPage.jsx
│   │   │   ├── AuctionDetailPage.jsx
│   │   │   ├── ScoutingHubPage.jsx              # Scouting hub landing page (country grid + search + discover tabs)
│   │   │   ├── ScoutingCountryPage.jsx          # Country detail with all its domestic leagues
│   │   │   ├── ScoutingLeaguePage.jsx           # League detail + season selector + top performers
│   │   │   ├── ScoutingPlayerPage.jsx           # Full domestic player profile with scouting score
│   │   │   ├── ScoutingSearchPage.jsx           # Advanced cross-league player search & profile-based discovery
│   │   │   ├── ScoutingWatchlistPage.jsx        # Watchlist management with export
│   │   │   ├── TeamAnalysisPage.jsx             # Per-team SWOT analysis (also accessible as tab in TeamDetailPage)
│   │   │   ├── LeagueAnalysisOverviewPage.jsx   # All 10 IPL teams comparison dashboard
│   │   │   ├── VenuesListPage.jsx
│   │   │   ├── VenueDetailPage.jsx
│   │   │   ├── SponsorsPage.jsx
│   │   │   ├── RecordsPage.jsx
│   │   │   ├── RatingsPage.jsx              # IPL Player Ratings leaderboard (batting, bowling, allrounder, fielding tabs)
│   │   │   ├── AnalyticsWorkspacePage.jsx   # Interactive analytics workspace (starts empty, add players to compare)
│   │   │   ├── EducationPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── usePlayer.js
│   │   │   ├── usePlayerSearch.js   # Debounced autocomplete search (300ms, calls /api/players/search)
│   │   │   ├── usePlayerFilters.js  # Manages filter state, syncs with URL query params
│   │   │   ├── usePlayerStats.js    # Granular stat fetching (phase, situational, H2H)
│   │   │   ├── useTeam.js
│   │   │   ├── useMatch.js
│   │   │   ├── useAuction.js
│   │   │   ├── useVenue.js
│   │   │   ├── useComparison.js     # Multi-player comparison (unlimited players)
│   │   │   ├── usePlayerRating.js   # Fetch player rating, history, and rank
│   │   │   ├── useWorkspace.js      # Workspace state management (add/remove players, save/load, share)
│   │   │   ├── useScouting.js       # Country/league navigation data for scouting hub
│   │   │   ├── useScoutingSearch.js # Cross-league player search with debounce (300ms)
│   │   │   ├── useDomesticStats.js  # Fetch domestic stats for a player (league/format/season filters)
│   │   │   ├── useScoutingScore.js  # Fetch composite scouting score (0-100)
│   │   │   ├── useWatchlist.js      # CRUD watchlist operations
│   │   │   ├── useTeamAnalysis.js   # Fetch team SWOT analysis data
│   │   │   ├── useTeamPhaseProfile.js # Fetch phase heatmap data for a team
│   │   │   └── useTeamRecruitment.js  # Fetch recruitment recommendations
│   │   ├── services/                # API call functions
│   │   │   ├── playerService.js     # Includes searchPlayers(query) and getPlayers(filters) calls
│   │   │   ├── playerStatsService.js # All granular stat API calls
│   │   │   ├── teamService.js
│   │   │   ├── matchService.js
│   │   │   ├── auctionService.js
│   │   │   ├── venueService.js
│   │   │   ├── sponsorService.js
│   │   │   ├── ratingService.js     # Player rating, history, and leaderboard API calls
│   │   │   ├── workspaceService.js  # Save/load/share workspace API calls
│   │   │   ├── scoutingService.js   # All scouting hub API calls (countries, leagues, domestic stats, search, watchlist)
│   │   │   └── teamAnalysisService.js # All team SWOT analysis API calls
│   │   ├── store/                   # Redux Toolkit store
│   │   │   ├── store.js             # configureStore with combined reducers
│   │   │   ├── hooks.js             # Typed useAppSelector & useAppDispatch hooks
│   │   │   └── slices/
│   │   │       ├── themeSlice.js    # Dark/light mode toggle
│   │   │       ├── filterSlice.js   # Global player/match filter state (synced with URL params)
│   │   │       ├── workspaceSlice.js # Analytics workspace state (selected players, layout, saved configs)
│   │   │       ├── uiSlice.js       # Sidebar, modals, toast notifications, loading states
│   │   │       ├── scoutingSlice.js  # Scouting filters, selected country/league, watchlist cache
│   │   │       └── teamAnalysisSlice.js # Selected team, season, analysis view state
│   │   ├── utils/                   # Helper functions
│   │   │   ├── statCalculators.js   # Avg, SR, economy, DLS formulas
│   │   │   ├── statAggregators.js   # Group-by-team, group-by-season, group-by-phase
│   │   │   ├── formatters.js
│   │   │   └── constants.js
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.jsx
│   │   ├── router.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                          # Backend (NestJS + TypeORM + TypeScript)
│   ├── src/
│   │   ├── modules/                 # Feature modules (NestJS modular architecture)
│   │   │   ├── players/
│   │   │   │   ├── players.module.ts
│   │   │   │   ├── players.controller.ts
│   │   │   │   ├── players.service.ts
│   │   │   │   ├── player-stats.service.ts      # Core, phase-wise, situational, positional stats
│   │   │   │   ├── player-h2h.service.ts        # Head-to-head calculations
│   │   │   │   ├── player-rank.service.ts       # Career & season rankings
│   │   │   │   ├── player-advanced.service.ts   # MVP, clutch index, win contribution
│   │   │   │   ├── dto/                         # Data Transfer Objects
│   │   │   │   │   ├── player-query.dto.ts
│   │   │   │   │   └── player-response.dto.ts
│   │   │   │   └── entities/
│   │   │   │       └── player.entity.ts
│   │   │   ├── teams/
│   │   │   │   ├── teams.module.ts
│   │   │   │   ├── teams.controller.ts
│   │   │   │   ├── teams.service.ts
│   │   │   │   ├── dto/
│   │   │   │   └── entities/
│   │   │   │       ├── team.entity.ts
│   │   │   │       ├── team-season.entity.ts
│   │   │   │       ├── team-management.entity.ts
│   │   │   │       └── team-sponsor.entity.ts
│   │   │   ├── matches/
│   │   │   │   ├── matches.module.ts
│   │   │   │   ├── matches.controller.ts
│   │   │   │   ├── matches.service.ts
│   │   │   │   ├── dto/
│   │   │   │   └── entities/
│   │   │   │       ├── match.entity.ts
│   │   │   │       ├── batting-scorecard.entity.ts
│   │   │   │       ├── bowling-scorecard.entity.ts
│   │   │   │       ├── fielding-scorecard.entity.ts
│   │   │   │       ├── ball-by-ball.entity.ts
│   │   │   │       └── partnership.entity.ts
│   │   │   ├── coaches/
│   │   │   │   ├── coaches.module.ts
│   │   │   │   ├── coaches.controller.ts
│   │   │   │   ├── coaches.service.ts
│   │   │   │   ├── dto/
│   │   │   │   └── entities/
│   │   │   │       ├── coach.entity.ts
│   │   │   │       └── coach-tenure.entity.ts
│   │   │   ├── seasons/
│   │   │   │   ├── seasons.module.ts
│   │   │   │   ├── seasons.controller.ts
│   │   │   │   ├── seasons.service.ts
│   │   │   │   ├── dto/
│   │   │   │   └── entities/
│   │   │   │       └── season.entity.ts
│   │   │   ├── auctions/
│   │   │   │   ├── auctions.module.ts
│   │   │   │   ├── auctions.controller.ts
│   │   │   │   ├── auctions.service.ts
│   │   │   │   ├── dto/
│   │   │   │   └── entities/
│   │   │   │       ├── auction.entity.ts
│   │   │   │       └── auction-player.entity.ts
│   │   │   ├── scouting/                                    # Domestic League Scouting Hub module
│   │   │   │   ├── scouting.module.ts
│   │   │   │   ├── controllers/
│   │   │   │   │   ├── countries.controller.ts              # GET /api/scouting/countries
│   │   │   │   │   ├── leagues.controller.ts                # GET /api/scouting/leagues
│   │   │   │   │   ├── domestic-stats.controller.ts         # GET /api/scouting/players/:id/stats
│   │   │   │   │   ├── scouting-search.controller.ts        # GET /api/scouting/search, /api/scouting/discover
│   │   │   │   │   └── watchlist.controller.ts              # CRUD /api/scouting/watchlist
│   │   │   │   ├── services/
│   │   │   │   │   ├── countries.service.ts                 # Country CRUD and navigation data
│   │   │   │   │   ├── leagues.service.ts                   # League CRUD, seasons, top performers
│   │   │   │   │   ├── domestic-matches.service.ts          # Domestic match data queries
│   │   │   │   │   ├── domestic-stats.service.ts            # Aggregation queries for domestic player stats
│   │   │   │   │   ├── domestic-stats-aggregator.service.ts # Recomputes domestic_player_league_stats on ingestion
│   │   │   │   │   ├── domestic-phase-stats.service.ts      # Phase-wise stats from domestic_ball_by_ball (T20 only)
│   │   │   │   │   ├── player-linking.service.ts            # Fuzzy-matches domestic names → players.id (pg_trgm)
│   │   │   │   │   ├── scouting-search.service.ts           # Cross-league player search with stat filters
│   │   │   │   │   ├── scouting-score.service.ts            # Composite IPL-readiness scouting score (0-100)
│   │   │   │   │   ├── watchlist.service.ts                 # Watchlist CRUD + CSV export
│   │   │   │   │   └── domestic-data-ingestion.service.ts   # CricSheet CSV + scraper data import pipeline
│   │   │   │   ├── dto/
│   │   │   │   │   ├── country-response.dto.ts
│   │   │   │   │   ├── league-response.dto.ts
│   │   │   │   │   ├── domestic-player-stats.dto.ts
│   │   │   │   │   ├── domestic-stats-query.dto.ts
│   │   │   │   │   ├── scouting-search-query.dto.ts
│   │   │   │   │   ├── scouting-score.dto.ts
│   │   │   │   │   └── watchlist.dto.ts
│   │   │   │   └── entities/
│   │   │   │       ├── domestic-country.entity.ts
│   │   │   │       ├── domestic-league.entity.ts
│   │   │   │       ├── domestic-league-season.entity.ts
│   │   │   │       ├── domestic-match.entity.ts
│   │   │   │       ├── domestic-batting-performance.entity.ts
│   │   │   │       ├── domestic-bowling-performance.entity.ts
│   │   │   │       ├── domestic-fielding-performance.entity.ts
│   │   │   │       ├── domestic-ball-by-ball.entity.ts
│   │   │   │       ├── domestic-player-league-stats.entity.ts
│   │   │   │       ├── scouting-watchlist.entity.ts
│   │   │   │       └── scouting-player-tag.entity.ts
│   │   │   ├── team-analysis/                               # IPL Team SWOT Analysis module
│   │   │   │   ├── team-analysis.module.ts
│   │   │   │   ├── controllers/
│   │   │   │   │   └── team-analysis.controller.ts          # GET /api/teams/:id/analysis/*
│   │   │   │   ├── services/
│   │   │   │   │   ├── team-analysis.service.ts             # Orchestrator — assembles full SWOT from sub-services
│   │   │   │   │   ├── team-strength.service.ts             # Computes batting/bowling/fielding strengths with evidence
│   │   │   │   │   ├── team-weakness.service.ts             # Identifies gaps and weak areas
│   │   │   │   │   ├── team-phase-analysis.service.ts       # Phase-wise team strength from ball_by_ball (PP/Mid/Death × Bat/Bowl)
│   │   │   │   │   ├── team-squad-depth.service.ts          # Squad composition analysis (depth per role)
│   │   │   │   │   ├── team-overseas-analysis.service.ts    # Overseas slot utilization analysis
│   │   │   │   │   ├── team-dependency.service.ts           # Player dependency index (flags >30% contribution)
│   │   │   │   │   ├── team-age-profile.service.ts          # Age demographics & succession risk analysis
│   │   │   │   │   ├── team-auction-roi.service.ts          # Historical auction price vs performance ROI
│   │   │   │   │   ├── team-budget.service.ts               # Purse & retention cost analysis
│   │   │   │   │   └── team-recruitment.service.ts          # Cross-references gaps with scouting hub to suggest players
│   │   │   │   ├── dto/
│   │   │   │   │   ├── team-swot-response.dto.ts
│   │   │   │   │   ├── team-analysis-query.dto.ts
│   │   │   │   │   ├── team-recruitment.dto.ts
│   │   │   │   │   └── team-auction-roi.dto.ts
│   │   │   │   └── entities/
│   │   │   │       ├── team-swot-analysis.entity.ts
│   │   │   │       └── team-auction-roi.entity.ts
│   │   │   ├── venues/
│   │   │   │   ├── venues.module.ts
│   │   │   │   ├── venues.controller.ts
│   │   │   │   ├── venues.service.ts
│   │   │   │   ├── dto/
│   │   │   │   └── entities/
│   │   │   │       ├── venue.entity.ts
│   │   │   │       └── venue-match-condition.entity.ts
│   │   │   ├── sponsors/
│   │   │   │   ├── sponsors.module.ts
│   │   │   │   ├── sponsors.controller.ts
│   │   │   │   ├── sponsors.service.ts
│   │   │   │   ├── dto/
│   │   │   │   └── entities/
│   │   │   │       └── ipl-sponsor.entity.ts
│   │   │   ├── cap-race/
│   │   │   │   ├── cap-race.module.ts
│   │   │   │   ├── cap-race.controller.ts
│   │   │   │   ├── cap-race.service.ts            # Computes & retrieves cap race standings and progression
│   │   │   │   │   # - getStandings(seasonId, capType): Current/final cap race leaderboard
│   │   │   │   │   # - getProgression(seasonId, capType): Match-by-match progression for top N players (powers race chart)
│   │   │   │   │   # - getStandingsAfterMatch(seasonId, capType, matchNumber): Historical snapshot
│   │   │   │   │   # - rebuildCapRace(seasonId): Recompute all cap race data for a season from batting/bowling scorecards
│   │   │   │   │   # - updateAfterMatch(matchId): Incremental update after a new match
│   │   │   │   ├── cap-race-seed.service.ts       # Seeds cap race data by processing all historical seasons (2008-present)
│   │   │   │   ├── dto/
│   │   │   │   │   ├── cap-race-standings.dto.ts
│   │   │   │   │   └── cap-race-progression.dto.ts
│   │   │   │   └── entities/
│   │   │   │       └── cap-race.entity.ts
│   │   │   ├── records/
│   │   │   │   ├── records.module.ts
│   │   │   │   ├── records.controller.ts
│   │   │   │   ├── records.service.ts
│   │   │   │   ├── dto/
│   │   │   │   └── entities/
│   │   │   │       └── record.entity.ts
│   │   │   ├── live/
│   │   │   │   ├── live.module.ts
│   │   │   │   ├── live.gateway.ts                  # WebSocket gateway (Socket.IO) — handles client connections, room subscriptions per match, broadcasts live events
│   │   │   │   ├── live.controller.ts               # REST endpoints for live match state, ball-by-ball feed
│   │   │   │   ├── live.service.ts                  # Core live match logic — current state, active matches
│   │   │   │   ├── live-ingestion.service.ts        # Polls upstream data source (CricAPI/ESPNcricinfo) every 15-30 sec, validates, normalises, inserts new ball data
│   │   │   │   ├── live-commentary.service.ts       # Generates/maps ball-by-ball commentary text for each delivery
│   │   │   │   ├── live-events.service.ts           # EventEmitter2 — emits 'ball.new', 'wicket.fall', 'milestone', 'innings.end', 'match.end' events
│   │   │   │   └── dto/
│   │   │   │       ├── live-score.dto.ts
│   │   │   │       └── ball-event.dto.ts
│   │   │   ├── education/
│   │   │   │   ├── education.module.ts
│   │   │   │   ├── education.controller.ts
│   │   │   │   └── education.service.ts
│   │   │   ├── comparison/
│   │   │   │   ├── comparison.module.ts
│   │   │   │   ├── comparison.controller.ts
│   │   │   │   └── comparison.service.ts        # Multi-player comparison builder (unlimited players)
│   │   │   ├── ratings/
│   │   │   │   ├── ratings.module.ts
│   │   │   │   ├── ratings.controller.ts
│   │   │   │   ├── ratings.service.ts           # Orchestrates rating queries and leaderboard
│   │   │   │   ├── rating-engine.ts             # Core algorithm: processes matches chronologically from 2008
│   │   │   │   │   # - computeMatchPerformanceScore(): Batting/bowling score per match (0-1000)
│   │   │   │   │   # - applyOppositionStrengthFactor(): Multiplier based on opponent avg rating
│   │   │   │   │   # - applySeasonalDecay(): 100%/50%/25%/12.5%/6.25% weight by recency
│   │   │   │   │   # - applyDampingFactor(): New player qualification scale (40%→100%)
│   │   │   │   │   # - computeWeightedMovingAverage(): Combines all match scores into rating
│   │   │   │   │   # - processRetirementAndInactivity(): Mark retired, set final_rating
│   │   │   │   │   # - rebuildAllRatings(): Full historical rebuild from 2008 Match 1 onwards
│   │   │   │   │   # - updateAfterMatch(): Incremental update for a single new match
│   │   │   │   ├── rating-seed.service.ts       # Seeds ratings by processing all historical matches
│   │   │   │   ├── dto/
│   │   │   │   │   ├── rating-response.dto.ts
│   │   │   │   │   ├── rating-history-response.dto.ts
│   │   │   │   │   └── leaderboard-query.dto.ts
│   │   │   │   └── entities/
│   │   │   │       ├── player-rating.entity.ts
│   │   │   │       ├── player-rating-history.entity.ts
│   │   │   │       └── player-season-rating.entity.ts
│   │   │   └── workspaces/
│   │   │       ├── workspaces.module.ts
│   │   │       ├── workspaces.controller.ts
│   │   │       ├── workspaces.service.ts
│   │   │       ├── dto/
│   │   │       │   └── workspace.dto.ts
│   │   │       └── entities/
│   │   │           └── analytics-workspace.entity.ts
│   │   ├── common/                  # Shared utilities & cross-cutting concerns
│   │   │   ├── filters/
│   │   │   │   └── http-exception.filter.ts
│   │   │   ├── interceptors/
│   │   │   │   └── transform.interceptor.ts
│   │   │   ├── pipes/
│   │   │   │   └── parse-int.pipe.ts
│   │   │   └── utils/
│   │   │       ├── stat-calculators.ts          # Avg, SR, economy, boundary %, dot %
│   │   │       └── response.helper.ts
│   │   ├── config/
│   │   │   ├── database.config.ts               # TypeORM connection config
│   │   │   └── app.config.ts
│   │   ├── seeds/
│   │   │   ├── seed.ts                          # Main seed runner
│   │   │   ├── data/                            # Seed data loaders per entity
│   │   │   ├── domestic-seed.ts                 # Domestic league data seeder (countries, leagues, seasons)
│   │   │   ├── domestic-cricsheet-parser.ts     # Parses CricSheet CSV → domestic tables (ball-by-ball + scorecards)
│   │   │   ├── domestic-scorecard-parser.ts     # Parses scraped scorecard data → domestic performance tables
│   │   │   ├── domestic-player-linker.ts        # Batch-links domestic player names → players.id via fuzzy matching
│   │   │   └── domestic-stats-builder.ts        # Builds domestic_player_league_stats aggregates from raw data
│   │   ├── app.module.ts                        # Root module
│   │   └── main.ts                              # Bootstrap entry point
│   ├── migrations/                  # TypeORM auto-generated migrations
│   ├── nest-cli.json
│   ├── tsconfig.json
│   ├── tsconfig.build.json
│   ├── package.json
│   └── .env
│
├── data/                            # Raw data files for seeding
│   ├── players.json
│   ├── teams.json
│   ├── matches.json
│   ├── ball_by_ball.json            # Ball-by-ball data (powers phase/situational/H2H stats)
│   ├── partnerships.json
│   ├── auctions.json
│   ├── venues.json
│   ├── sponsors.json
│   ├── coaches.json
│   ├── records.json
│   └── domestic/                    # Domestic league scouting data
│       ├── countries.json           # 13+ countries with codes and flags
│       ├── leagues.json             # All domestic leagues with country mapping, format, relevance weights
│       ├── cricsheet/               # CricSheet ball-by-ball CSV files (leagues with full coverage)
│       │   ├── bbl/                 # Big Bash League (Australia)
│       │   ├── cpl/                 # Caribbean Premier League (West Indies)
│       │   ├── psl/                 # Pakistan Super League
│       │   ├── sa20/               # SA20 (South Africa)
│       │   ├── the_hundred/        # The Hundred (England)
│       │   ├── t20_blast/          # T20 Blast (England)
│       │   ├── smat/               # Syed Mushtaq Ali Trophy (India, partial)
│       │   ├── bpl/                # Bangladesh Premier League
│       │   ├── mlc/                # Major League Cricket (USA)
│       │   └── ilt20/              # ILT20 (UAE)
│       └── scraped/                 # Scraped scorecard-level data (leagues without ball-by-ball)
│           ├── ranji_trophy/        # First-Class (India)
│           ├── vijay_hazare/        # List-A (India)
│           ├── duleep_trophy/       # First-Class (India)
│           ├── county_championship/ # First-Class (England)
│           ├── royal_london/        # List-A (England)
│           ├── sheffield_shield/    # First-Class (Australia)
│           ├── super_smash/         # T20 (New Zealand)
│           ├── plunket_shield/      # First-Class (New Zealand)
│           ├── lpl/                 # Lanka Premier League (Sri Lanka)
│           ├── csa_t20/            # CSA T20 Challenge (South Africa)
│           ├── logan_cup/           # First-Class (Zimbabwe)
│           ├── shpageeza/          # T20 (Afghanistan)
│           └── quaid_e_azam/       # First-Class (Pakistan)
│
├── .gitignore
├── ipl-analysis-need.txt
├── ipl-need-understandings.md
└── ipl-implementation-structure.md
```

---

## 3. Database Schema (Core Tables)

### Players & Coaches

```
players
├── id (PK)
├── name                                     # INDEX: pg_trgm GIN index for fast ILIKE substring search
├── name_lower (generated, stored)           # Pre-lowercased name for fast case-insensitive matching
├── dob
├── nationality                              # INDEX: for country filter
├── nationality_type (Domestic / Overseas)   # INDEX: for domestic/overseas filter
├── photo_url
├── playing_role (Batter / Bowler / All-rounder / WK-Batter)  # INDEX: for role filter
├── batting_style (Right-hand bat / Left-hand bat)             # INDEX: for batting style filter
├── bowling_style (Right-arm fast / Left-arm spin / etc.)      # Full bowling style string
├── bowling_arm (Right / Left / null)        # INDEX: derived, for bowling arm filter
├── bowling_variety (Fast / Medium / Off-spin / Leg-spin / Left-arm orthodox / Left-arm wrist spin / null)  # INDEX: for bowling variety filter
├── status (Active / Retired / Unsold)       # INDEX: for status filter
├── bio
├── strengths
├── weaknesses
├── is_also_coach (Boolean)                  # Flag for dual-role individuals
└── timestamps

# Required PostgreSQL extension for search:
# CREATE EXTENSION IF NOT EXISTS pg_trgm;
# CREATE INDEX idx_players_name_trgm ON players USING GIN (name_lower gin_trgm_ops);

coaches
├── id (PK)
├── person_id (FK → players.id, nullable)   # Links to player if dual-role
├── name                                     # Standalone if never a player
├── role (Head Coach / Bowling Coach / Batting Coach / Fielding Coach / Support Staff)
├── bio
├── coaching_style
├── achievements
└── timestamps

coach_tenures
├── id (PK)
├── coach_id (FK → coaches.id)
├── team_id (FK → teams.id)
├── season_id (FK → seasons.id)
├── role
├── matches_coached
├── wins
├── losses
├── no_results
└── timestamps
```

### Teams

```
teams
├── id (PK)
├── name
├── short_name (e.g., CSK, MI, RCB)
├── logo_url
├── home_ground_id (FK → venues.id)
├── founded_year
├── owner
├── titles_won
└── timestamps

team_seasons
├── id (PK)
├── team_id (FK → teams.id)
├── season_id (FK → seasons.id)
├── captain_id (FK → players.id)
├── final_position
└── timestamps

team_management
├── id (PK)
├── team_id (FK → teams.id)
├── season_id (FK → seasons.id)
├── person_name
├── role (Owner / CEO / Director / Manager / etc.)
└── timestamps

team_sponsors
├── id (PK)
├── team_id (FK → teams.id)
├── season_id (FK → seasons.id)
├── sponsor_name
├── sponsor_type (Title / Principal / Associate / Kit / etc.)
├── logo_url
└── timestamps
```

### Seasons & Matches

```
seasons
├── id (PK)
├── year
├── name (e.g., "IPL 2023")
├── start_date
├── end_date
├── title_sponsor
├── winner_team_id (FK → teams.id)
├── runner_up_team_id (FK → teams.id)
├── orange_cap_player_id (FK → players.id)
├── purple_cap_player_id (FK → players.id)
├── player_of_tournament_id (FK → players.id)
└── timestamps

matches
├── id (PK)
├── season_id (FK → seasons.id)
├── match_number
├── date
├── day_of_week
├── venue_id (FK → venues.id)
├── team1_id (FK → teams.id)
├── team2_id (FK → teams.id)
├── toss_winner_id (FK → teams.id)
├── toss_decision (Bat / Field)
├── winner_id (FK → teams.id)
├── win_margin
├── win_type (Runs / Wickets / Super Over / DLS)
├── player_of_match_id (FK → players.id)
├── team1_score
├── team1_overs
├── team1_wickets
├── team2_score
├── team2_overs
├── team2_wickets
├── dls_applied (Boolean)
├── match_summary (text - key moments, turning points)
└── timestamps

batting_scorecards
├── id (PK)
├── match_id (FK → matches.id)
├── player_id (FK → players.id)
├── team_id (FK → teams.id)
├── batting_position
├── runs_scored
├── balls_faced
├── fours
├── sixes
├── dots_faced
├── singles
├── doubles
├── triples
├── strike_rate
├── is_not_out (Boolean)
├── dismissal_type (Caught / Bowled / LBW / Run Out / Stumped / Hit Wicket / C&B / null)
├── dismissed_by_id (FK → players.id, nullable)     # Bowler who took the wicket
├── fielder_id (FK → players.id, nullable)           # Fielder/Keeper involved
├── dismissed_by_bowling_type (Pace / Spin, nullable) # Was it pace or spin?
└── timestamps

bowling_scorecards
├── id (PK)
├── match_id (FK → matches.id)
├── player_id (FK → players.id)
├── team_id (FK → teams.id)
├── overs_bowled
├── maidens
├── runs_conceded
├── wickets_taken
├── economy_rate
├── dots
├── wides
├── no_balls
├── fours_conceded
├── sixes_conceded
└── timestamps

fielding_scorecards
├── id (PK)
├── match_id (FK → matches.id)
├── player_id (FK → players.id)
├── team_id (FK → teams.id)
├── catches_outfield
├── catches_slip_close
├── catches_as_wk
├── stumpings
├── run_outs_direct
├── run_outs_assisted
├── dropped_catches
└── timestamps

# ----- Ball-by-Ball Data (powers phase-wise, situational, vs-type, positional stats) -----

ball_by_ball
├── id (PK)
├── match_id (FK → matches.id)
├── innings_number (1 / 2)
├── over_number
├── ball_number
├── batting_team_id (FK → teams.id)
├── bowling_team_id (FK → teams.id)
├── batter_id (FK → players.id)
├── bowler_id (FK → players.id)
├── non_striker_id (FK → players.id)
├── batter_batting_position               # Position at which batter came in
├── runs_off_bat
├── extras
├── extra_type (Wide / No Ball / Bye / Leg Bye / null)
├── total_runs                            # runs_off_bat + extras
├── is_wicket (Boolean)
├── dismissal_type (nullable)
├── dismissed_player_id (FK → players.id, nullable)
├── fielder_id (FK → players.id, nullable)
├── is_four (Boolean)
├── is_six (Boolean)
├── is_dot (Boolean)
├── bowling_type (Pace / Spin)            # Derived from bowler's bowling_style
├── batter_hand (Right / Left)            # Derived from batter's batting_style
├── bowler_arm (Right / Left)             # Derived from bowler's bowling_style
├── phase (Powerplay / Middle / Death)    # Derived: 1-6 = PP, 7-15 = Mid, 16-20 = Death
├── match_situation (Batting First / Chasing)
├── -- WAGON WHEEL & PITCH MAP FIELDS (powers batter/bowler hover overlays) --
├── shot_direction (varchar, nullable)    # Scoring zone: "cover", "mid-wicket", "square leg", "third man", "fine leg", "long-on", "long-off", "point", "mid-on", "mid-off", "straight", "behind square leg", "behind point"
├── shot_distance (float, nullable)       # Approximate distance from crease in metres (0-100). Boundary = 65-80m+
├── pitch_length (varchar, nullable)      # Where the ball pitched: "full toss", "yorker", "full", "good", "short of good", "short", "bouncer"
├── pitch_line (varchar, nullable)        # Line of delivery: "wide outside off", "outside off", "off stump", "middle", "leg stump", "outside leg", "wide outside leg"
├── pitch_x (float, nullable)            # Normalised pitch position X coordinate (0.0-1.0, left to right from batter's perspective)
├── pitch_y (float, nullable)            # Normalised pitch position Y coordinate (0.0-1.0, batter's end to bowler's end)
├── shot_angle (float, nullable)         # Angle of shot in degrees (0-360, 0=straight down ground, 90=square on off-side, 180=behind, 270=square on leg-side)
└── timestamps

# ----- Partnerships -----

partnerships
├── id (PK)
├── match_id (FK → matches.id)
├── innings_number (1 / 2)
├── batter1_id (FK → players.id)
├── batter2_id (FK → players.id)
├── team_id (FK → teams.id)
├── wicket_number                         # Which wicket this partnership was for
├── total_runs
├── total_balls
├── batter1_runs
├── batter1_balls
├── batter2_runs
├── batter2_balls
├── is_unbroken (Boolean)
└── timestamps
```

### Player Ratings & Rankings (ICC-Calibrated, Historical from 2008)

```
player_ratings
├── id (PK)
├── player_id (FK → players.id)              # INDEX, UNIQUE per (player_id, category)
├── category (Batting / Bowling / Allrounder / Fielding)  # INDEX
├── current_rating (0–1000)                  # Latest computed rating (null if retired)
├── current_rank (nullable)                  # Current position in active ranking (null if retired)
├── previous_rank (nullable)                 # Rank before last update (for movement arrows)
├── peak_rating (0–1000)                     # Highest rating ever achieved
├── peak_rank                                # Highest rank ever held
├── peak_season_id (FK → seasons.id)         # Season in which peak was reached
├── peak_match_id (FK → matches.id)          # Match after which peak was reached
├── final_rating (nullable)                  # Rating at time of last IPL match (set on retirement/inactivity)
├── debut_season_id (FK → seasons.id)        # First IPL season
├── last_active_season_id (FK → seasons.id)  # Most recent season played
├── total_innings_batted                     # For damping factor calculation
├── total_wickets_taken                      # For damping factor calculation
├── damping_factor_batting (0.0–1.0)         # Current damping multiplier applied to batting rating
├── damping_factor_bowling (0.0–1.0)         # Current damping multiplier applied to bowling rating
├── is_active (Boolean)                      # True if played in current or previous season
├── is_retired (Boolean)                     # True if confirmed retired or 3+ seasons inactive
└── timestamps

player_rating_history
├── id (PK)
├── player_id (FK → players.id)              # INDEX
├── category (Batting / Bowling / Allrounder / Fielding)
├── match_id (FK → matches.id)               # Match that triggered this update
├── season_id (FK → seasons.id)              # INDEX
├── match_date                               # For chronological ordering
├── raw_match_score (0–1000)                 # Performance score for this match (before damping)
├── opposition_strength_multiplier (float)   # Opposition factor applied (e.g., 1.2x)
├── weighted_match_score (0–1000)            # After opposition factor
├── rating_before                            # Rating going into this match
├── rating_after (0–1000)                    # Rating after weighted average recalculation
├── rating_change (+/-)                      # Delta from previous rating
├── damping_factor_applied (0.0–1.0)         # Damping % applied at this point in career
├── rank_after                               # Rank after this update
└── timestamps

player_season_ratings
├── id (PK)
├── player_id (FK → players.id)              # INDEX
├── season_id (FK → seasons.id)              # INDEX, UNIQUE per (player_id, season_id, category)
├── category (Batting / Bowling / Allrounder / Fielding)
├── rating_at_season_start                   # Rating entering this season (after inter-season decay)
├── rating_at_season_end                     # Rating at end of season
├── peak_rating_in_season                    # Highest rating during this season
├── rank_at_season_end                       # Rank at end of this season
├── matches_played                           # Matches played in this season
├── decay_applied (float)                    # Inter-season decay that was applied before this season
└── timestamps

# Materialized view: active_player_ranking_leaderboard
# Refreshed after every match data insertion
# Contains: player_id, name, photo_url, current_team, category, current_rating,
#           current_rank, previous_rank, peak_rating, peak_season,
#           rank_movement (up/down/stable), rating_trend_sparkline_data (last 10 changes)
# WHERE is_active = true AND is_retired = false
```

### Saved Workspaces (Analytics Dashboard)

```
analytics_workspaces
├── id (PK, UUID)
├── name                                     # User-given workspace name
├── player_ids (JSON array)                  # List of player IDs in workspace
├── filters (JSON)                           # Applied filters (season range, team, venue, phase)
├── layout (JSON)                            # Which charts/visualizations are active
├── share_token (unique string, nullable)    # For shareable URL
├── created_at
└── updated_at

# Note: For MVP, workspaces are stored in localStorage on the client.
# The database table is for shareable links and future user-account support.
```

### Player-Team Mapping (for team-wise stats)

```
player_teams
├── id (PK)
├── player_id (FK → players.id)
├── team_id (FK → teams.id)
├── season_id (FK → seasons.id)
├── role_in_team (Captain / Vice-Captain / Player / Overseas / etc.)
├── jersey_number
└── timestamps
```

### Auctions

```
auctions
├── id (PK)
├── season_id (FK → seasons.id)
├── auction_type (Mega / Mini / Mid-season)
├── date
├── location
├── auctioneer_name
├── total_players_sold
├── total_spend
├── highlights (text)
└── timestamps

auction_players
├── id (PK)
├── auction_id (FK → auctions.id)
├── player_id (FK → players.id)
├── base_price
├── sold_price
├── buying_team_id (FK → teams.id, nullable)
├── status (Sold / Unsold / RTM)
├── is_rtm (Boolean)
├── bidding_war_teams (JSON array)
├── is_highlight (Boolean)
└── timestamps
```

### Domestic League Scouting Hub

> **Purpose:** Track player performance across all worldwide domestic leagues, classified country-wise, with exhaustive stats for IPL auction management decision-making. Domestic data lives in a separate table hierarchy (`domestic_*`) from IPL data to avoid polluting the IPL `ball_by_ball` table, maintain query performance, and allow independent data quality management. The link between domestic and IPL is through `players.id`.

```
# ----- League Infrastructure (Country → League → Season hierarchy) -----

domestic_countries
├── id (PK)
├── name                                         # "India", "Australia", "England", etc.
├── code (UNIQUE)                                # "IND", "AUS", "ENG", "NZ", "SL", "SA", "ZIM", "WI", "BAN", "PAK", "AFG", "USA", "UAE"
├── flag_url
├── sort_order                                   # Display ordering (India first for IPL context)
└── timestamps

domestic_leagues
├── id (PK)
├── country_id (FK → domestic_countries.id)      # INDEX
├── name                                         # "Big Bash League", "Syed Mushtaq Ali Trophy", "County Championship"
├── short_name                                   # "BBL", "SMAT", "CC"
├── format (T20 / ODI / First-Class / The Hundred)  # INDEX — crucial for T20 weighting
├── is_active (Boolean)                          # Is the league still running?
├── founded_year
├── governing_body                               # "Cricket Australia", "BCCI", "ECB"
├── description
├── logo_url
├── t20_relevance_weight (float, 0.0-1.0)        # T20 leagues get 1.0, ODI gets 0.6, FC gets 0.3 — used to weight stats for IPL auction relevance
├── prestige_tier (1 / 2 / 3)                    # 1 = top-tier (BBL, CPL, SA20, PSL), 2 = mid, 3 = lower
└── timestamps

domestic_league_seasons
├── id (PK)
├── league_id (FK → domestic_leagues.id)          # INDEX
├── year                                         # e.g., 2024 (or start year for "2024-25" seasons)
├── season_label                                 # "2024-25", "2024" — display string
├── start_date
├── end_date
├── total_matches
├── champion_team (varchar)                      # Not FK — domestic team names vary across leagues
└── timestamps

# ----- Domestic Match & Performance Data (scorecard-level — always populated) -----

domestic_matches
├── id (PK)
├── league_season_id (FK → domestic_league_seasons.id)  # INDEX
├── match_number
├── date
├── venue (varchar)                              # Not FK — domestic venues are a separate universe
├── team1 (varchar)                              # Domestic team names (e.g., "Sydney Sixers", "Mumbai")
├── team2 (varchar)
├── winner (varchar, nullable)
├── win_margin (varchar)                         # "5 wickets", "23 runs"
├── match_type (League / Knockout / Semi-Final / Final)
├── result_summary (text)
├── cricsheet_id (varchar, nullable, UNIQUE)     # For linking to CricSheet ball-by-ball if available
├── source_url (varchar)                         # Data provenance — every data point is traceable
└── timestamps

domestic_batting_performances
├── id (PK)
├── match_id (FK → domestic_matches.id)          # INDEX
├── player_id (FK → players.id, nullable)        # Links to IPL player if identified; INDEX. Nullable for unlinked players
├── domestic_player_name (varchar)               # Always stored — fallback identity for unlinked players
├── team (varchar)
├── batting_position (nullable)
├── runs_scored
├── balls_faced
├── fours
├── sixes
├── dots_faced (nullable)                        # Not always available from all sources
├── strike_rate (computed or stored)
├── is_not_out (Boolean)
├── dismissal_type (varchar, nullable)
├── dismissed_by (varchar, nullable)             # Bowler name
├── fielder (varchar, nullable)
├── innings_number (1 / 2)
├── match_situation (varchar, nullable)          # "Batting First" / "Chasing"
└── timestamps

domestic_bowling_performances
├── id (PK)
├── match_id (FK → domestic_matches.id)          # INDEX
├── player_id (FK → players.id, nullable)        # INDEX
├── domestic_player_name (varchar)
├── team (varchar)
├── overs_bowled (float)
├── maidens
├── runs_conceded
├── wickets_taken
├── economy_rate (computed or stored)
├── dots (nullable)
├── wides (nullable)
├── no_balls (nullable)
├── fours_conceded (nullable)
├── sixes_conceded (nullable)
└── timestamps

domestic_fielding_performances
├── id (PK)
├── match_id (FK → domestic_matches.id)          # INDEX
├── player_id (FK → players.id, nullable)        # INDEX
├── domestic_player_name (varchar)
├── team (varchar)
├── catches
├── run_outs
├── stumpings
└── timestamps

# ----- Domestic Ball-by-Ball (where CricSheet data available — BBL, CPL, PSL, SA20, The Hundred, T20 Blast) -----
# This enables phase-wise and advanced analytics for supported leagues

domestic_ball_by_ball
├── id (PK)
├── match_id (FK → domestic_matches.id)          # INDEX
├── innings_number (1 / 2)
├── over_number
├── ball_number
├── batting_team (varchar)
├── bowling_team (varchar)
├── batter_id (FK → players.id, nullable)
├── batter_name (varchar)                        # Always stored for reference
├── bowler_id (FK → players.id, nullable)
├── bowler_name (varchar)
├── runs_off_bat
├── extras
├── extra_type (varchar, nullable)
├── total_runs
├── is_wicket (Boolean)
├── dismissal_type (varchar, nullable)
├── dismissed_player_name (varchar, nullable)
├── is_four (Boolean)
├── is_six (Boolean)
├── is_dot (Boolean)
├── phase (Powerplay / Middle / Death, nullable) # Derived; null for non-T20 formats
└── timestamps

# ----- Pre-Aggregated Domestic Player Stats (refreshed on data ingestion) -----
# Avoids expensive runtime aggregation across millions of rows from multiple leagues

domestic_player_league_stats
├── id (PK)
├── player_id (FK → players.id)                  # INDEX
├── league_id (FK → domestic_leagues.id)          # INDEX
├── league_season_id (FK → domestic_league_seasons.id, nullable)  # null = career aggregate for that league
├── format (T20 / ODI / First-Class / The Hundred)
├── -- BATTING --
├── bat_matches
├── bat_innings
├── bat_runs
├── bat_balls_faced
├── bat_average (float)
├── bat_strike_rate (float)
├── bat_highest_score
├── bat_highest_score_not_out (Boolean)
├── bat_fifties
├── bat_hundreds
├── bat_ducks
├── bat_fours
├── bat_sixes
├── bat_boundary_pct (float, nullable)
├── bat_dot_pct (float, nullable)
├── bat_not_outs
├── -- BATTING PHASE-WISE (T20 only, nullable — requires domestic_ball_by_ball) --
├── bat_pp_runs (nullable)
├── bat_pp_balls (nullable)
├── bat_pp_sr (nullable)
├── bat_pp_dismissals (nullable)
├── bat_middle_runs (nullable)
├── bat_middle_balls (nullable)
├── bat_middle_sr (nullable)
├── bat_middle_dismissals (nullable)
├── bat_death_runs (nullable)
├── bat_death_balls (nullable)
├── bat_death_sr (nullable)
├── bat_death_dismissals (nullable)
├── -- BATTING SITUATIONAL --
├── bat_first_runs (nullable)
├── bat_first_innings (nullable)
├── bat_first_avg (nullable)
├── bat_first_sr (nullable)
├── bat_chase_runs (nullable)
├── bat_chase_innings (nullable)
├── bat_chase_avg (nullable)
├── bat_chase_sr (nullable)
├── -- BOWLING --
├── bowl_matches
├── bowl_innings
├── bowl_overs (float)
├── bowl_maidens
├── bowl_runs_conceded
├── bowl_wickets
├── bowl_average (float)
├── bowl_economy (float)
├── bowl_strike_rate (float)
├── bowl_best_figures (varchar)                  # e.g., "4/23"
├── bowl_four_wicket_hauls
├── bowl_five_wicket_hauls
├── bowl_dot_pct (float, nullable)
├── -- BOWLING PHASE-WISE (T20 only, nullable — requires domestic_ball_by_ball) --
├── bowl_pp_overs (nullable)
├── bowl_pp_runs (nullable)
├── bowl_pp_wickets (nullable)
├── bowl_pp_economy (nullable)
├── bowl_middle_overs (nullable)
├── bowl_middle_runs (nullable)
├── bowl_middle_wickets (nullable)
├── bowl_middle_economy (nullable)
├── bowl_death_overs (nullable)
├── bowl_death_runs (nullable)
├── bowl_death_wickets (nullable)
├── bowl_death_economy (nullable)
├── -- FIELDING --
├── field_catches
├── field_run_outs
├── field_stumpings
├── -- ADVANCED / DERIVED --
├── recent_form_last5 (JSON, nullable)           # [{matchId, runs, wickets, date}]
├── recent_form_last10 (JSON, nullable)
├── consistency_index (float, nullable)          # Std deviation of scores (lower = more consistent)
├── impact_rating (float, nullable)              # Composite score
├── finals_knockout_matches (nullable)
├── finals_knockout_runs (nullable)
├── finals_knockout_wickets (nullable)
├── last_refreshed_at (timestamp)
└── timestamps

# UNIQUE constraint: (player_id, league_id, league_season_id)
# When league_season_id IS NULL, it represents career aggregate for that league

# ----- Scouting Watchlist & Tags -----

scouting_watchlist
├── id (PK, UUID)
├── player_id (FK → players.id)
├── added_at (timestamp)
├── notes (text, nullable)                       # Scout/management notes
├── priority (High / Medium / Low)
├── target_role (varchar)                        # "Death Bowler", "Opening Bat", "Finisher", etc.
├── estimated_value_range (varchar, nullable)    # "2-5 Cr"
├── tags (JSON array)                            # ["finisher", "powerplay-specialist", "uncapped"]
└── timestamps

scouting_player_tags
├── id (PK)
├── player_id (FK → players.id)                  # INDEX
├── tag (varchar)                                # "T20 Specialist", "Death Bowling", "Uncapped Indian", etc.
└── timestamps
```

> **Design note (Nullable player_id):** Domestic performance tables use **nullable** `player_id` FK. Not every domestic player is in the IPL system. `domestic_player_name` is always stored as fallback identity. A `player-linking.service.ts` handles name-matching between domestic records and the `players` table using pg_trgm fuzzy matching with manual confirmation for ambiguous cases. If a player later enters the IPL ecosystem, a linking operation populates the FK.

> **Design note (Phase-wise data availability):** For leagues without CricSheet ball-by-ball data, phase-wise fields in `domestic_player_league_stats` remain NULL. The frontend handles this gracefully with "Phase data not available for this league" messaging.

### IPL Team SWOT Analysis

> **Purpose:** Data-driven analysis of each IPL franchise's strengths, weaknesses, squad depth, overseas utilization, player dependencies, auction ROI, and recruitment recommendations. All analysis is **computed dynamically** from existing IPL data (`ball_by_ball`, `player_teams`, `auction_players`, `player_ratings`). The `team_swot_analysis` table caches computed results.

```
team_swot_analysis
├── id (PK)
├── team_id (FK → teams.id)                      # INDEX
├── season_id (FK → seasons.id)                  # INDEX — analysis is season-specific
├── -- STRENGTHS (JSON arrays of structured objects) --
├── batting_strengths (JSON)                     # [{area, description, key_players[], evidence_stat}]
├── bowling_strengths (JSON)
├── fielding_strengths (JSON)
├── phase_strengths (JSON)                       # [{phase, discipline, rating 0-100, key_performers[]}]
├── -- WEAKNESSES / GAPS --
├── batting_weaknesses (JSON)                    # [{area, description, severity, gap_indicator}]
├── bowling_weaknesses (JSON)
├── fielding_weaknesses (JSON)
├── phase_weaknesses (JSON)                      # [{phase, discipline, rating 0-100, issue_description}]
├── -- STRUCTURAL ANALYSIS --
├── overseas_slot_analysis (JSON)                # {slots_used, overseas_players[], utilization_rating, recommendations}
├── age_profile (JSON)                           # {avg_age, young_count (<25), veteran_count (>33), succession_risks[{player, age, role, replacement_urgency}]}
├── squad_depth (JSON)                           # {batting_depth, bowling_depth, allrounder_depth, wk_options, bench_strength}
├── player_dependency (JSON)                     # [{player_id, name, dependency_score, runs_contribution_pct, wickets_contribution_pct}]
├── -- RECRUITMENT INTELLIGENCE --
├── priority_positions (JSON)                    # [{position, urgency (Critical/High/Medium/Low), description, reason}]
├── budget_analysis (JSON)                       # {purse_total, purse_remaining, retained_spend, retentions[], slots_total, slots_filled, overseas_slots_remaining}
├── recruitment_recommendations (JSON)           # [{role_needed, player_type, budget_range, reasoning, suggested_players_from_scouting[{player_id, name, scouting_score, key_stat}]}]
├── -- META --
├── overall_rating (float)                       # 0-100 composite team strength score
├── last_computed_at (timestamp)
└── timestamps

# Computed from: ball_by_ball, player_teams, auction_players, player_ratings, batting/bowling_scorecards

team_auction_roi
├── id (PK)
├── team_id (FK → teams.id)                      # INDEX
├── season_id (FK → seasons.id)                  # INDEX
├── player_id (FK → players.id)                  # INDEX
├── auction_price (decimal)
├── matches_played
├── batting_impact_score (float)                 # Derived from runs, avg, SR contribution
├── bowling_impact_score (float)                 # Derived from wickets, economy, dot ball contribution
├── overall_roi_score (float)                    # Performance / Price ratio (higher = better value)
├── roi_category (Excellent / Good / Average / Poor / Flop)
└── timestamps
```

> **Design note:** SWOT analysis is entirely **data-driven, not manually entered**. All team analysis is derived from existing IPL data via aggregation queries. The `team_swot_analysis` table caches the computed results with `last_computed_at` to avoid recomputation on every request. The cache is refreshed after each match or on demand. The recruitment recommendations **cross-reference the scouting module** — querying domestic league data to suggest players who fit the identified gaps, creating a feedback loop between both modules.

### Venues

```
venues
├── id (PK)
├── name
├── city
├── state
├── country
├── capacity
├── photo_url
├── pitch_type (Batting / Bowling / Balanced)
├── pace_friendly (Boolean)
├── spin_friendly (Boolean)
├── avg_first_innings_score
├── avg_second_innings_score
├── matches_hosted
└── timestamps

venue_match_conditions
├── id (PK)
├── venue_id (FK → venues.id)
├── match_id (FK → matches.id)
├── pitch_behaviour (text)
├── weather
├── dew_factor (Boolean)
├── toss_advantage (Bat First / Chase)
└── timestamps
```

### Sponsors (IPL-level)

```
ipl_sponsors
├── id (PK)
├── season_id (FK → seasons.id)
├── sponsor_name
├── sponsor_type (Title / Official Partner / Associate / Broadcast / etc.)
├── logo_url
├── deal_value
├── achievements (text)
├── profit_loss_info (text)
└── timestamps
```

### Orange Cap & Purple Cap Race

```
cap_race
├── id (PK)
├── season_id (FK → seasons.id)
├── match_id (FK → matches.id)             # after which match this snapshot was taken
├── match_number                            # sequential match number in the season (1, 2, 3...)
├── cap_type (Orange / Purple)              # Orange = runs, Purple = wickets
├── player_id (FK → players.id)
├── team_id (FK → teams.id)                # player's team that season
├── cumulative_value                        # running total (runs for Orange, wickets for Purple)
├── rank                                    # player's rank in the race after this match (1 = cap holder)
├── is_cap_holder (Boolean)                 # true if rank = 1 (currently wearing the cap)
├── matches_played                          # how many matches the player has played so far in the season
├── supporting_stat                         # secondary stat (strike rate for Orange, economy for Purple)
└── timestamps
```

> **Design note:** One row per player per match per cap type. After each match in a season, insert/update rows for all qualifying players with their updated cumulative totals and re-ranked positions. The `rank = 1` row for each cap type after the final match of the season corresponds to the season's official Orange/Purple Cap winner. This table powers the animated race chart and the match-by-match cap race leaderboard. A materialized view `cap_race_current_standings` can be used for fast retrieval of the latest standings.

### Records

```
records
├── id (PK)
├── category (Orange Cap / Purple Cap / Highest Score / Lowest Score / Thriller / Game-Changer)
├── season_id (FK → seasons.id, nullable)   # null = all-time record
├── player_id (FK → players.id, nullable)
├── match_id (FK → matches.id, nullable)
├── team_id (FK → teams.id, nullable)
├── title
├── description (text)
├── stat_value
└── timestamps
```

---

## 4. API Endpoints

### Players
```
GET    /api/players                                  # List all players (paginated, filterable)
       # Query params for filtering (all combinable with AND logic):
       #   ?search=sha                              → Case-insensitive substring match on player name (ILIKE '%sha%')
       #   ?country=India                           → Filter by nationality
       #   ?role=Batter|Bowler|All-rounder|WK       → Filter by playing role
       #   ?battingStyle=Right-hand|Left-hand       → Filter by batting hand
       #   ?bowlingArm=Right|Left                   → Filter by bowling arm
       #   ?bowlingVariety=Fast|Medium|Off-spin|Leg-spin|Left-arm orthodox|Left-arm wrist spin  → Filter by bowling type
       #   ?team=CSK                                → Filter by IPL team (short_name), "ever played for" or "current"
       #   ?teamFilter=current|all                  → Whether team filter means current roster or all-time
       #   ?status=active|retired|unsold            → Player IPL status
       #   ?nationalityType=domestic|overseas       → Domestic or overseas player
       #   ?page=1&limit=20                         → Pagination
       #   ?sortBy=name|runs|wickets|matches        → Sort field
       #   ?sortOrder=asc|desc                      → Sort direction

GET    /api/players/search                           # Lightweight autocomplete endpoint
       # Query params:
       #   ?q=sha                                   → Case-insensitive substring match (ILIKE '%sha%')
       #   ?limit=10                                → Max suggestions returned
       # Returns: [{id, name, photo_url, playing_role, nationality}]
       # Uses pg_trgm trigram index for fast fuzzy matching
       # Frontend debounces at 300ms before calling this

GET    /api/players/:id                              # Player full profile (bio, strengths, weaknesses)
GET    /api/players/:id/coach-profile                # Coach profile (if dual-role)
GET    /api/players/:id/matches                      # All matches played
GET    /api/players/:id/auctions                     # Auction history across seasons

# --- Core Stats (supports ?teamId=&seasonId= query filters for team-wise / season-wise) ---
GET    /api/players/:id/stats/batting                # Core batting: runs, avg, SR, 50s, 100s, ducks, boundaries
GET    /api/players/:id/stats/bowling                # Core bowling: wickets, economy, avg, SR, maidens, extras
GET    /api/players/:id/stats/fielding               # Fielding: catches, run outs, stumpings (WK)
GET    /api/players/:id/stats/allrounder             # All-rounder rating, multi-discipline impact

# --- Deep Batting Analysis ---
GET    /api/players/:id/stats/batting/phase-wise     # Powerplay / Middle / Death overs batting
GET    /api/players/:id/stats/batting/situational    # Bat first vs chase, in wins vs losses
GET    /api/players/:id/stats/batting/vs-bowling-type # vs Pace, Spin, Left-arm, Right-arm
GET    /api/players/:id/stats/batting/dismissals     # Dismissal breakdown (caught, bowled, LBW, etc.)
GET    /api/players/:id/stats/batting/by-position    # Stats by batting position (opener, 3, 4-5, 6-8)
GET    /api/players/:id/stats/batting/milestones     # Fastest 50/100, streaks, season bests

# --- Deep Bowling Analysis ---
GET    /api/players/:id/stats/bowling/phase-wise     # Powerplay / Middle / Death overs bowling
GET    /api/players/:id/stats/bowling/situational    # Defending vs bowling first, in wins vs losses
GET    /api/players/:id/stats/bowling/vs-batter-type # vs Right-handers, Left-handers
GET    /api/players/:id/stats/bowling/wicket-types   # Bowled, caught, LBW, stumped, C&B breakdown
GET    /api/players/:id/stats/bowling/milestones     # Best season, best match, streaks

# --- Advanced & Impact ---
GET    /api/players/:id/stats/advanced               # MVP, clutch index, win contributions, playoff/finals
GET    /api/players/:id/stats/partnerships           # Partnership history (highest, average, partners)

# --- Head-to-Head ---
GET    /api/players/:id/h2h/bowler/:bowlerId         # Batting stats vs a specific bowler
GET    /api/players/:id/h2h/batter/:batterId         # Bowling stats vs a specific batter
GET    /api/players/:id/h2h/team/:teamId             # Performance vs a specific team
GET    /api/players/:id/h2h/venue/:venueId           # Performance at a specific venue

# --- Ratings & Rankings (ICC-Calibrated, Historical from 2008) ---
GET    /api/players/:id/ratings                      # Full rating profile:
       # Active player returns: current_rating, current_rank, rank_movement, peak_rating, peak_rank, peak_season, damping_factors
       # Retired player returns: peak_rating, peak_rank, peak_season, final_rating, is_retired=true, career_span (debut to last match)
GET    /api/players/:id/ratings/history              # Complete match-by-match rating history (for career timeline chart)
       #   ?category=batting|bowling|allrounder|fielding
       #   ?seasonId=                                # Optional: filter to single season
GET    /api/players/:id/ratings/seasons              # Season-by-season rating snapshots (start/end/peak per season)
GET    /api/players/:id/rankings                     # Career & season-wise ranks

# --- Comparison (unlimited players) ---
GET    /api/players/compare?ids=id1,id2              # Side-by-side comparison of two players
GET    /api/players/compare?ids=id1,id2,id3,...idN   # Multi-player comparison (no limit)
       #   ?stats=batting|bowling|fielding|allrounder|all
       #   ?seasonFrom=2020&seasonTo=2026            # Optional season range filter
       #   ?teamId=                                  # Optional team filter
       #   ?venueId=                                 # Optional venue filter

# --- Leaderboard ---
GET    /api/ratings/leaderboard                      # Active player leaderboard (default: current)
       #   ?category=batting|bowling|allrounder|fielding
       #   ?limit=50&page=1
       #   ?team=CSK                                 # Filter by current team
       #   ?nationality=India|overseas               # Filter by nationality
       #   ?role=Batter|Bowler|All-rounder|WK-Batter # Filter by playing role
       #   ?season=2024                              # Historical: show rankings as of end of that season
       #   ?view=active|alltime|retired              # active = current players only (default)
       #                                             # alltime = all players ever, ranked by peak rating
       #                                             # retired = only retired players, ranked by peak rating
```

### Analytics Workspace
```
POST   /api/workspaces                               # Save a workspace (player_ids, filters, layout)
GET    /api/workspaces/:id                           # Load a saved workspace
PUT    /api/workspaces/:id                           # Update a saved workspace
DELETE /api/workspaces/:id                           # Delete a workspace
GET    /api/workspaces/share/:shareToken             # Load workspace via shareable link
POST   /api/workspaces/:id/share                     # Generate shareable link for a workspace
```

### Teams
```
GET    /api/teams                         # List all teams
GET    /api/teams/:id                     # Team overview
GET    /api/teams/:id/squad/:seasonId     # Squad for a season
GET    /api/teams/:id/management          # Management & ownership
GET    /api/teams/:id/coaches             # Coaching staff
GET    /api/teams/:id/sponsors            # Team sponsors
GET    /api/teams/:id/matches             # All matches
GET    /api/teams/:id/stats               # Aggregated team stats
```

### Matches
```
GET    /api/matches                       # List all matches (paginated, filterable by season/team/venue)
GET    /api/matches/:id                   # Full match detail with scorecard & analysis
GET    /api/matches/:id/scorecard         # Batting + Bowling + Fielding scorecard
GET    /api/matches/:id/batter/:batterId/overlay   # Batter wagon wheel, scoring areas, pitch map for a completed match
GET    /api/matches/:id/bowler/:bowlerId/overlay    # Bowler pitch map, zones conceded, wagon wheel for a completed match
```

### Seasons
```
GET    /api/seasons                       # List all seasons
GET    /api/seasons/:id                   # Season overview (winner, caps, sponsor, etc.)
GET    /api/seasons/:id/matches           # All matches in a season (full scorecards)
GET    /api/seasons/:id/schedule          # Season match schedule (date, time, teams, venue, home team indicator)
       #   ?team=CSK                      # Filter to show only one team's matches
       #   ?venue=wankhede               # Filter by venue
       #   ?month=4                       # Filter by month (3=Mar, 4=Apr, 5=May)
GET    /api/seasons/:id/points-table      # Points table
GET    /api/seasons/:id/venues            # All venues used in the season with home team mapping
```

### Auctions
```
GET    /api/auctions                      # List all auctions
GET    /api/auctions/:id                  # Auction full details
GET    /api/auctions/:id/players          # All players in auction (sold, unsold, RTM)
GET    /api/auctions/:id/highlights       # Auction highlights
```

### Domestic League Scouting Hub
```
# --- Country & League Navigation ---
GET    /api/scouting/countries                                   # All countries with league count, sorted by sort_order
GET    /api/scouting/countries/:countryId/leagues                 # All leagues for a country
GET    /api/scouting/leagues/:leagueId                            # League details + seasons list
GET    /api/scouting/leagues/:leagueId/seasons                    # All seasons for a league
GET    /api/scouting/leagues/:leagueId/seasons/:seasonId/matches  # Matches in a league season
GET    /api/scouting/leagues/:leagueId/seasons/:seasonId/stats    # Top performers in that season (batting/bowling leaders)

# --- Player Domestic Stats ---
GET    /api/scouting/players/:playerId/overview                   # Aggregated domestic career across ALL leagues
       # Returns: league-by-league summary with key stats, T20-weighted composite scouting score
GET    /api/scouting/players/:playerId/stats                      # Full domestic stats
       #   ?leagueId=                                             # Filter to specific league
       #   ?format=T20|ODI|FirstClass|All                         # Filter by format
       #   ?seasonId=                                             # Filter to specific league season
       # Returns: full batting/bowling/fielding stats matching domestic_player_league_stats schema
GET    /api/scouting/players/:playerId/stats/phase-wise           # Phase-wise (T20 only, requires domestic_ball_by_ball)
       #   ?leagueId=
GET    /api/scouting/players/:playerId/stats/recent-form          # Last 5/10 match performances
       #   ?leagueId=
       #   ?format=
GET    /api/scouting/players/:playerId/combined-profile           # IPL + Domestic stats side-by-side
       # Merges IPL stats (from existing player stats endpoints) with domestic stats for holistic view
GET    /api/scouting/players/:playerId/scouting-score             # Composite IPL-readiness score (0-100)
       # Computed from: T20 stats (40%), recent form (20%), ODI stats (15%), consistency (10%), FC stats (10%), big-match (5%)
       # Each sub-score weighted by league's t20_relevance_weight and prestige_tier

# --- Cross-League Search & Discovery ---
GET    /api/scouting/search                                       # Search across all domestic leagues
       #   ?q=                                                    # Player name search (pg_trgm fuzzy matching)
       #   ?country=                                              # Filter by country code
       #   ?format=T20|ODI|FirstClass                             # Filter by format
       #   ?role=Batter|Bowler|AllRounder|WK                      # Filter by playing role
       #   ?minRuns=&minWickets=&minAvg=&minSR=&maxEconomy=       # Stat threshold filters
       #   ?sortBy=runs|wickets|average|sr|economy|scoutingScore  # Sort field
       #   ?page=&limit=                                          # Pagination
GET    /api/scouting/discover                                     # Profile-based discovery (management-focused)
       #   ?profile=death-bowler|powerplay-bat|finisher|spinner|pace-allrounder|anchor|wk-bat
       #   ?budget=low|medium|high                                # Estimated auction price range
       #   ?nationality=                                          # uncapped-indian, overseas, etc.
       # Returns: players matching the profile with their scouting scores, ranked by fit

# --- Watchlist ---
GET    /api/scouting/watchlist                                    # All watchlisted players with notes/priority/tags
POST   /api/scouting/watchlist                                    # Add player to watchlist (body: player_id, notes, priority, target_role, tags)
PUT    /api/scouting/watchlist/:id                                # Update notes/priority/tags
DELETE /api/scouting/watchlist/:id                                # Remove from watchlist
GET    /api/scouting/watchlist/export                             # Export watchlist as CSV
```

### IPL Team SWOT Analysis
```
# --- Per-Team Analysis ---
GET    /api/teams/:teamId/analysis                                # Full SWOT analysis
       #   ?seasonId=                                             # Analysis for a specific season (default: latest)
GET    /api/teams/:teamId/analysis/strengths                      # Detailed strengths breakdown with evidence stats
GET    /api/teams/:teamId/analysis/weaknesses                     # Detailed weaknesses/gaps with severity indicators
GET    /api/teams/:teamId/analysis/phase-profile                  # Phase-wise team strength heatmap data
       # Returns: {powerplay_batting, powerplay_bowling, middle_batting, middle_bowling,
       #           death_batting, death_bowling} — each rated 0-100 against league average
GET    /api/teams/:teamId/analysis/squad-depth                    # Squad composition analysis (depth per role + domestic/overseas split)
GET    /api/teams/:teamId/analysis/overseas-slots                 # Overseas slot utilization (4 slots: who, stats, contribution)
GET    /api/teams/:teamId/analysis/dependencies                   # Player over-reliance analysis (flags >30% contribution)
GET    /api/teams/:teamId/analysis/age-profile                    # Age demographics, avg age, succession risks for players >35
GET    /api/teams/:teamId/analysis/auction-roi                    # Historical auction ROI per player
       #   ?seasonId=                                             # Specific season or all-time
GET    /api/teams/:teamId/analysis/budget                         # Purse analysis: total, remaining, retention costs, available slots
GET    /api/teams/:teamId/analysis/recruitment                    # Recommended recruitment targets based on gaps
       # Returns: [{role_needed, urgency, player_type_description, budget_range,
       #            suggested_players_from_scouting[{player_id, name, scouting_score, key_domestic_stat}]}]
       # Cross-references team weakness gaps with scouting hub player pool

# --- Cross-Team Comparison ---
GET    /api/teams/analysis/compare                                # Compare multiple teams side-by-side
       #   ?teamIds=id1,id2,id3                                   # Comma-separated team IDs
       #   ?seasonId=                                             # Season context
       # Returns: side-by-side SWOT for selected teams
GET    /api/teams/analysis/league-overview                        # All 10 IPL teams at a glance
       #   ?seasonId=                                             # Season context (default: latest)
       # Returns: [{team, overall_rating, top_strength, top_weakness, budget_remaining, priority_needs[]}]
```

### Venues
```
GET    /api/venues                        # List all venues
GET    /api/venues/:id                    # Venue profile with pitch analysis
GET    /api/venues/:id/matches            # Matches played at venue
GET    /api/venues/:id/stats              # Venue-level stats (avg scores, win %)
```

### Sponsors
```
GET    /api/sponsors                      # All IPL sponsors (season-wise)
GET    /api/sponsors/:id                  # Sponsor details + financials
```

### Cap Race (Orange Cap & Purple Cap)
```
GET    /api/cap-race/:seasonId/orange     # Orange Cap race standings for a season (latest snapshot)
GET    /api/cap-race/:seasonId/purple     # Purple Cap race standings for a season (latest snapshot)
GET    /api/cap-race/:seasonId/orange/progression  # Match-by-match Orange Cap race (top N players' cumulative runs across all matches — powers the race chart)
GET    /api/cap-race/:seasonId/purple/progression  # Match-by-match Purple Cap race (top N players' cumulative wickets across all matches — powers the race chart)
GET    /api/cap-race/:seasonId/orange/after-match/:matchNumber  # Orange Cap standings after a specific match
GET    /api/cap-race/:seasonId/purple/after-match/:matchNumber  # Purple Cap standings after a specific match
```

### Records
```
GET    /api/records                       # All records (filterable by category)
GET    /api/records/orange-cap            # Orange cap final winners (all seasons)
GET    /api/records/purple-cap            # Purple cap final winners (all seasons)
GET    /api/records/thrillers             # Most thrilling matches
GET    /api/records/game-changers         # Game-changing innings
GET    /api/records/highest-scores        # Highest scores (all-time + season-wise)
GET    /api/records/lowest-scores         # Lowest scores (all-time + season-wise)
```

### Live Match (WebSocket + REST)
```
# --- REST Endpoints ---
GET    /api/live                          # List all currently live matches (if any)
GET    /api/live/:matchId                 # Live match state: current score, batting/bowling, partnership, RRR, CRR
GET    /api/live/:matchId/ball-by-ball    # Ball-by-ball feed with commentary (paginated, latest first)
GET    /api/live/:matchId/scorecard       # Live scorecard (updates in real-time as innings progresses)
GET    /api/live/:matchId/batter/:batterId/overlay  # Batter overlay data for wagon wheel, scoring areas, pitch map
       # Returns: {wagonWheel: [{shot_angle, shot_distance, runs, is_boundary, is_dot, is_wicket}],
       #           scoringAreas: [{zone, runs, balls, percentage}],
       #           pitchMap: [{pitch_x, pitch_y, pitch_length, pitch_line, runs, is_boundary, is_dot, is_wicket}]}
       # Filtered to current innings only. Updates in real-time during live match
GET    /api/live/:matchId/bowler/:bowlerId/overlay  # Bowler overlay data for bowling wagon wheel, pitch map, zones conceded
       # Returns: {pitchMap: [{pitch_x, pitch_y, pitch_length, pitch_line, runs, is_boundary, is_dot, is_wicket}],
       #           zonesConceeded: [{zone, runs_conceded, balls, boundaries, dots}],
       #           wagonWheel: [{shot_angle, shot_distance, runs, is_boundary, is_dot, is_wicket}]}

# --- WebSocket Events (Socket.IO) ---
# Client subscribes to: 'match:{matchId}'
# Server emits:
#   'score:update'    → { team, runs, wickets, overs, runRate } — after every ball
#   'ball:new'        → { over, ball, bowler, batter, runs, extras, isWicket, isBoundary, commentary } — ball-by-ball with commentary text
#   'wicket:fall'     → { dismissedPlayer, dismissalType, bowler, fielder, score, overs } — wicket alert
#   'milestone'       → { player, milestone, details } — 50, 100, 5-wicket haul alerts
#   'innings:end'     → { team, totalScore, overs, wickets } — innings completion
#   'match:end'       → { winner, winType, winMargin, playerOfMatch } — match result
#   'match:status'    → { status: 'live' | 'innings_break' | 'completed' | 'delayed' } — match status changes
```

### Education
```
GET    /api/education/formulas            # All cricket stat formulas
GET    /api/education/dls                 # DLS method explanation
```

---

## 5. Page Layout & Navigation

### Primary Navigation (Navbar)

```
Home | Seasons | Schedule | Teams | Players | Matches | Ratings | Analytics Lab | Auctions | Scouting Hub | Venues | Records | Sponsors | Learn Cricket Stats
```

### Page Wireframe Descriptions

#### Home Page
- Hero banner with dynamic IPL imagery and current/latest season highlights
- Quick stats dashboard (total matches, total players, total sixes, etc.)
- Latest season winner showcase
- Quick links to all sections
- Search bar (global search across players, teams, matches)

#### Player Detail Page
- **Header**: Player photo, name, nationality flag, playing role badge, radar chart snapshot, **IPL Rating badge** (0–1000 with color-coded label + rank position + trend arrow)
- **Toggle Tabs** (if dual-role): `Player Profile` | `Coach Profile`
- **Player Profile View**:
  - **Filter Bar**: Dropdowns to filter all stats by Team / Season (applies globally across all sections below)
  - **Bio Section**: Full name, DOB, age, born in, nationality, playing role, batting/bowling style, IPL debut, last match, teams played for, jersey numbers
  - **Strengths & Weaknesses**: Visual cards highlighting key strengths and weaknesses
  - **Core Stats Dashboard**: StatCards showing matches, innings, runs, avg, SR, wickets, economy, catches — the headline numbers
  - **Batting Deep Dive** (tabbed sub-sections):
    - Core Batting Numbers (runs, avg, SR, 50s, 100s, ducks, boundaries, dot %)
    - Phase-wise (Powerplay / Middle / Death with runs, avg, SR per phase)
    - Situational (Bat first vs chase, in wins vs losses)
    - vs Bowling Type (vs Pace, Spin, Left-arm, Right-arm with runs, SR, dismissals)
    - Dismissal Analysis (pie chart: caught, bowled, LBW, run out, stumped, etc. + most dismissed by)
    - By Batting Position (stats as opener, No.3, middle order, finisher)
    - Milestones & Streaks (fastest 50/100, consecutive 50s, longest run streaks for 30+/40+/50+/100+ runs, best season/match)
  - **Bowling Deep Dive** (tabbed sub-sections):
    - Core Bowling Numbers (wickets, economy, avg, SR, best figures, dot %, extras)
    - Phase-wise (Powerplay / Middle / Death with wickets, economy, SR per phase)
    - Situational (Defending vs bowling first, in wins vs losses)
    - vs Batter Type (vs right-handers, left-handers with wickets, economy)
    - Wicket Types (pie chart: bowled, caught outfield, caught behind, C&B, LBW, stumped + most dismissed batter)
    - Milestones & Streaks (best season, best match, consecutive wicket-taking matches)
  - **Fielding Section**: Catches (outfield, slip, WK), run outs (direct, assisted), stumpings, dropped catches, best match/season
  - **All-Rounder Section** (if applicable): Rating, 30+runs & 2+wickets matches, POTM awards, win contribution
  - **Impact & Advanced Analytics**: MVP rating per season, clutch index, playoff/finals stats, partnership data, boundary count per innings, death/powerplay specialist ratings
  - **Head-to-Head Explorer**: Searchable — pick any bowler, batter, team, or venue and see full stats against them
  - **IPL Rating & Ranking Section**:
    - Current rating (Batting / Bowling / All-Rounder / Fielding) with color-coded 0–1000 scale
    - Peak career rating and when it was achieved
    - Current rank and rank movement (up/down/stable arrow)
    - Rating trend chart: line graph showing rating movement over matches and seasons
    - "How is this calculated?" expandable tooltip explaining the ICC-calibrated methodology
  - **Rankings**: Career rank (runs, wickets, catches) + season-wise rank display
  - **Player Comparison**: Select another player for side-by-side comparison across all stat categories (or open in Analytics Lab for multi-player comparison)
  - **Auction History Timeline**: Visual timeline showing each auction — base price, sold price, buying team
  - **Team-wise Performance Tabs**: One tab per franchise — shows all the above stats filtered for that team
  - **Season-by-Season Chart**: Line/bar charts showing runs, wickets, avg, SR progression across seasons
- **Coach Profile View** (if applicable):
  - Coaching bio & style
  - Tenures (which teams, which seasons)
  - Win/loss record per tenure
  - Achievements as coach
  - Strategy & impact analysis

#### Ratings Page (IPL Player Ratings Leaderboard)
- Hero banner: "IPL Player Ratings — Powered by ICC-Calibrated Algorithm"
- Category tabs: `Batting` | `Bowling` | `All-Rounder` | `Fielding`
- Leaderboard table: Rank, player photo, name, team, rating (0–1000), peak rating, trend arrow (up/down/stable)
- Filter dropdowns: Nationality, Team, Season
- Click any player → navigates to their profile with rating section open

#### Analytics Workspace (Analytics Lab)
- **Empty state**: Clean canvas with a prominent "Add Players" search bar and helper text: "Start by adding players to build your analysis"
- **Player selector**: Multi-select search bar — search and add unlimited players (chips/tags showing selected players with remove button)
- **Dynamic content area** (populates as players are added):
  - **Comparison Table**: Full stat comparison across all added players (scrollable horizontally if many players)
  - **Overlaid Radar Chart**: All players on one radar chart with color-coded legends
  - **Career Progression Graph**: Multi-line chart — ratings/runs/wickets over seasons for all players
  - **Scatter Plot**: Configurable axes (avg vs SR, economy vs wickets, etc.) with each player as a labeled dot
  - **Phase-wise Comparison**: Grouped bar charts for powerplay/middle/death across all players
  - **Head-to-Head Matrix**: If 2+ players have faced each other, show their direct matchup stats
- **Filter bar**: Season range slider, team filter, venue filter, match phase filter — applies to entire workspace
- **Save workspace**: Name and save current configuration to localStorage (future: user accounts)
- **Load workspace**: Dropdown of previously saved workspaces
- **Share**: Generate a shareable URL (player IDs + filters encoded in URL params)
- **Export**: Download comparison as PNG image or CSV data

#### Team Detail Page
- Team banner with logo and colours
- Tabs: `Overview` | `Squad` | `Analysis` | `Management` | `Coaches` | `Sponsors` | `Stats` | `Matches`
- Season selector dropdown to switch context
- **Analysis Tab** (NEW — IPL Team SWOT Analysis):
  - **SWOT Dashboard**: 4-quadrant layout — Strengths (green), Weaknesses (red), Opportunities (blue), Threats (orange) — with key data points and evidence stats in each quadrant
  - **Phase Heatmap**: 3×2 interactive grid (Powerplay/Middle/Death × Batting/Bowling). Each cell is color-coded by strength (0-100 scale: dark green=strong, red=weak). Click any cell for detailed stats. Compare against league average
  - **Squad Depth Chart**: Visual squad composition showing batters/bowlers/all-rounders/WK count, split by domestic vs overseas. Bench strength indicator
  - **Player Dependencies**: Bar chart showing each player's contribution percentage (runs %, wickets %). Red threshold line at 30%. Players above threshold flagged as dependency risks
  - **Overseas Slot Analysis**: 4-slot visualization showing current overseas players + their stats + utilization rating + recommendations
  - **Age Profile**: Age distribution histogram + average age + trend. Succession risk flags for key players aged >35 with replacement urgency
  - **Auction ROI Table**: Player | Auction Price | Matches | Impact Score | ROI Rating. Color-coded: Green=Excellent, Yellow=Average, Red=Flop. Season filter available
  - **Budget Analysis**: Purse pie chart (spent vs remaining), retention breakdown, available domestic/overseas slots
  - **Recruitment Recommendations**: Priority positions ranked by urgency (Critical/High/Medium/Low). Each recommendation shows: role needed, player type, budget range, reasoning. "Find in Scouting Hub" button pre-filters scouting search. Suggested players from domestic leagues (cross-module link with scouting scores)

#### Schedule Page (Season Match Schedule)
- **Page header**: "IPL [Year] Schedule" with season selector dropdown to switch between any season (2008–present)
- **Season archive row**: Horizontally scrollable row of season pills showing year, dates, and winner (e.g., "IPL 2025: Mar 22 – Jun 3 🏆 RCB")
- **Filter bar**: Team filter (show only one team's matches), Venue filter, Month chips (Mar | Apr | May), View toggle (List | Calendar)
- **Match schedule list**: Each match displayed as a horizontal card:
  - Match number, date, day of week, time (IST)
  - Team 1 abbreviation/logo vs Team 2 abbreviation/logo (colour-coded)
  - **🏠 HOME badge**: A prominent green-tinted pill badge displayed next to the team playing at their home ground. This is the key feature — officials instantly identify whose home game each match is
  - Venue name and city (with location pin icon)
  - Match status badge: "Upcoming" (blue), "Completed" (green), "Live" (red pulse)
  - Double-header indicator for days with two matches
- **Venue Directory section**: Grid of venue cards showing all venues used in the season. Each card: venue name, city, and which team's home ground it is (with team colour indicator), or "Neutral Venue" for non-home grounds

#### Match Detail / Live Match Page
The match page serves BOTH completed matches and live matches. It has a **score header** always visible at the top plus **four tabs**: `Info` | `Live` | `Scorecard` | `Squads`.

**Score Header (always visible):**
- Team 1 badge + score (final if completed, live if in progress)
- "vs" with 🔴 LIVE pulsing badge (if match is in progress) or result text (if completed)
- Team 2 badge + score (the currently batting team's score pulses/glows)
- Required runs / run rate (if 2nd innings chase is in progress)
- Match info line: Match number, tournament, venue

**Tab: Info**
- *Subheading "Info"*: Match number, date, time in **24-hour format of the user's local timezone** (auto-detected via browser), toss details, match status
- *Subheading "Match Officials"*: Umpire 1, Umpire 2, 3rd Umpire, Match Referee
- *Subheading "Venue"*: Stadium name, Place (city, state), Capacity (max attendance), pitch type, weather, dew conditions

**Tab: Live** (default active tab during a live match)
- **Top row**: Current batting team's live mini-scorecard — score, overs, batters at crease (name, runs, balls, 4s, 6s), current bowler (name, overs, runs, wickets), current partnership, last wicket
- **Batter Hover Overlay** (on batters at crease AND dismissed batters in the scorecard):
  When the user hovers (desktop) or taps (mobile) on any batter's name/row, a popover overlay appears showing three visual panels:
  1. **Wagon Wheel**: A circular ground map showing the direction and length of each scoring shot. Lines radiate from the batter's crease position to where the ball reached. Ball colours:
     - **Blue ball** = Boundary (4 or 6)
     - **Red ball** = Dot ball (0 runs)
     - **Grey ball** = Singles, doubles, triples (1, 2, 3 runs)
     - **White ball** = Dismissal ball (only shown for dismissed batters — the ball on which the batter got out)
  2. **Scoring Areas**: A segmented ground map (divided into zones: cover, mid-wicket, square leg, third man, fine leg, long-on, long-off, etc.) with run totals per zone. Zones are heat-shaded — darker colour = more runs scored in that area. Shows percentage of runs scored per zone
  3. **Ball Pitching Map**: A pitch-length visualisation (top-down view of the pitch from the batter's end) showing where each ball pitched. Balls are plotted by length (full, good, short) and line (outside off, on stumps, leg side). Same colour coding:
     - **Blue dot** = Boundary ball
     - **Red dot** = Dot ball
     - **Grey dot** = Scoring ball (1, 2, 3)
     - **White dot** = Dismissal ball (dismissed batters only)
  The overlay auto-updates in real-time during a live match as new balls are bowled. On mobile, the overlay opens as a bottom sheet (ShadCN Sheet) on tap, with swipeable tabs between the three panels. On desktop, it appears as a popover card (ShadCN Popover) anchored to the batter's name
- **Bowler Hover Overlay** (on current bowler AND all bowlers in the scorecard bowling table):
  When the user hovers/taps on a bowler's name/row, a similar popover overlay appears:
  1. **Bowling Wagon Wheel**: Shows where batters scored off this bowler — lines from pitch to boundary/fielding positions. Same colour coding (blue=boundary conceded, red=dot delivered, grey=runs conceded, white=wicket ball)
  2. **Pitch Map (Bowler's View)**: Top-down pitch showing where each delivery pitched. Colour coding: **Blue** = hit for boundary, **Red** = dot ball, **Grey** = runs scored, **White** = wicket delivery. Helps visualise the bowler's length and line consistency
  3. **Scoring Areas Conceded**: Segmented ground map showing where batters scored runs off this bowler, heat-shaded by runs conceded per zone
- **Bottom**: Ball-by-ball commentary feed from both innings, with an innings toggle ("1st Innings" | "2nd Innings"). Most recent ball at the top. Each ball entry shows:
  - Over.ball number, bowler → batter, outcome with **colour-coded badge**:
    - Dot (0): Grey 🔘
    - Single (1): White ⚪
    - Two (2): Light blue
    - Three (3): Blue
    - FOUR (4): **Bright GREEN** — highlighted prominently 🟢
    - SIX (6): **Bright GOLD** — highlighted prominently 🟡
    - WICKET (W): **Bright RED** — entire entry gets red-tinted background 🔴
    - WIDE (wd): **Orange** — entry gets orange tint
    - NO BALL (nb): **Orange** — entry gets orange tint
  - Commentary text describing the delivery
- **Over summary cards**: After each over, a distinct card (lighter background, accent left border) showing: over number, runs in over, individual ball outcomes as coloured dots, batter scores, bowler figures

**Tab: Scorecard**
- Uses **accordion UI** — TWO accordions (one per team). **Only one can be open at a time** — opening one automatically closes the other. Accordion header shows: Team name + total score (final if finished, live if batting). The currently batting team's header has a pulsing 🔴 indicator.
- **1st Innings accordion opens by default** (the team that batted first).
- **Inside each accordion (visible sections, no nested accordions):**
  1. **Batting table**: Batter | Dismissal | R | B | 4s | 6s | SR — all batters who have batted are listed. **Hover/tap on any batter row** triggers the same **Batter Hover Overlay** (wagon wheel, scoring areas, ball pitching map) described in the Live tab above. Dismissed batters show the **white dismissal ball** on their wagon wheel and pitch map. Below the batter rows: **"Yet to Bat" section** — a highlighted row showing the remaining Playing XI members who have not yet batted, with their batting order number, name, and role (BAT/BOWL/AR/WK). The next batter in line is highlighted with an amber "Next In" badge. Below that: **Extras row** showing total extras with breakdown (byes, leg byes, wides, no balls). Below extras: **Total row** with total score, overs, and run rate.
  2. **Bowling table**: Bowler | O | M | R | W | NB | WD | Econ — **Hover/tap on any bowler row** triggers the **Bowler Hover Overlay** (bowling wagon wheel, pitch map, scoring areas conceded) described in the Live tab above. Wicket deliveries shown as **white dots** on the pitch map
  3. **Fall of Wickets**: Table or compact display showing: Wicket number, score at fall, batter dismissed, over at which wicket fell
  4. **Partnerships**: Table showing: Wicket number, the two batters, runs scored in partnership, balls faced

**Tab: Squads**
- The content of this tab changes dynamically based on whether the **toss has happened or not**:
  - **Before toss** (match not yet started, toss pending): Show two sections per team:
    1. **Players**: Full squad roster — all players in the team's tournament squad, displayed as cards with name, role (Batter/Bowler/All-rounder/WK), batting/bowling style, nationality (domestic/overseas flag)
    2. **Coaching Staff**: Head Coach, Bowling Coach, Batting Coach, Fielding Coach, and any other support staff
  - **After toss** (Playing XI announced): Show four sections per team:
    1. **Playing XI**: The 11 selected players with their batting order number (1-11), name, role, batting/bowling style, nationality. Captain marked with (C), wicketkeeper with (WK). Overseas players flagged with 🌏
    2. **Substitutes**: Impact substitute player(s) with a blue "Impact Sub" badge — this is the player designated as the Impact Player replacement under IPL rules
    3. **Bench**: All remaining squad members NOT selected in the Playing XI or as substitute. Displayed in a muted/greyed-out style to visually distinguish them from the active XI
    4. **Coaching Staff**: Same as pre-toss — Head Coach, Bowling Coach, Batting Coach, Fielding Coach, support staff
- The two teams' squads are displayed **side by side in a two-column layout** (on desktop/tablet). The **home team is displayed first** (left column) and the **away team second** (right column). On mobile, they stack vertically — home team on top, away team below. No accordion needed — both are visible simultaneously since squad data is compact

**Completed Matches section (below the tabs):**
- A horizontal row of recently completed match cards. Each card shows: Team1 score vs Team2 score, result, date. Clicking any card **redirects to that match's full detail page** with scorecard and commentary.

#### Auction Detail Page
- Auction header (year, type, location, auctioneer)
- Summary stats (total sold, total spend, most expensive)
- Full player list table (sortable by price, team, status)
- Highlights section with narratives
- **Pre-Auction Intelligence View** (NEW): Before auction — shows each team's SWOT-derived needs + budget remaining + priority positions. Helps management understand what each franchise is likely targeting
- **Scouting Integration**: Each player in the auction list gets a "Scouting" icon button. Clicking opens a ShadCN Sheet/dialog showing their domestic league stats summary, scouting score (0-100), recent form, and key T20 metrics from worldwide leagues
- **Post-Auction Analysis** (NEW): After an auction — overlay SWOT analysis gaps with what was actually bought. Answers "Did CSK address their death bowling weakness?" with visual gap-fill indicators

#### Scouting Hub Page (Domestic League Scouting)
- **Landing view** with three tabs: `Browse by Country` | `Search` | `Discover` | `Watchlist`
- **Browse by Country tab** (default):
  - Country grid: 13+ country cards with flags, names, and league count. Layout: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`. Countries: India, England, Australia, New Zealand, Sri Lanka, South Africa, West Indies, Pakistan, Bangladesh, Afghanistan, Zimbabwe, USA, UAE
  - Click any country → navigates to country detail page with all its domestic leagues listed as cards (logo, format badge, season count, prestige tier indicator)
  - Click any league → navigates to league detail page with season selector, top batting/bowling performers table, and match results
  - Click any player → navigates to full scouting player profile
- **Search tab**:
  - Search bar (player name, debounced 300ms, cross-league fuzzy matching)
  - Advanced filters: Country, League, Format (T20/ODI/FC), Playing Role, Stat thresholds (min runs, min wickets, min average, min SR, max economy)
  - Results: Sortable DataTable with columns — Player, Country, Leagues, Format, Key Stats, Scouting Score
  - Click row → scouting player profile
- **Discover tab** (profile-based discovery for management):
  - Profile presets: "Death Bowler", "Powerplay Opener", "Finisher", "Leg Spinner", "Pace All-Rounder", "Anchor Bat", "WK-Batter"
  - Budget range selector (Low < 2Cr / Medium 2-8Cr / High > 8Cr)
  - Nationality filter (Uncapped Indian, Overseas, Any)
  - Results: Ranked list of matching players with scouting scores and key metric highlights
- **Watchlist tab**:
  - Watchlisted players with priority badges (High/Medium/Low), notes, target role, estimated value, tags
  - Sort by priority / scouting score / recently added
  - Bulk actions: remove, update priority
  - Export to CSV button

#### Scouting Country Page
- Country header with flag, name, and overview text
- League grid: all domestic leagues for that country as cards — each showing: league name, logo, format badge (T20/ODI/FC), founded year, governing body, prestige tier star rating, active/inactive status
- Layout: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Click any league card → league detail page

#### Scouting League Page
- League header: name, logo, format, governing body, country, founded year
- Season selector dropdown (all available seasons)
- **Top Performers section**: Two side-by-side tables — Top Batters (runs, avg, SR, 50s, 100s) and Top Bowlers (wickets, avg, economy, 4W/5W)
- **Season Stats**: Total matches, runs scored, wickets taken, highest score, best bowling, most catches
- **Match Results** (collapsible): All matches in the selected season with scores, winners, date, venue
- Each player name is clickable → navigates to scouting player profile

#### Scouting Player Page (Domestic Player Profile)
- **Header**: Player name, photo (if available), nationality flag, playing role, batting/bowling style, scouting score badge (0-100 with color: green >75, yellow 50-75, red <50)
- **IPL Link**: "View IPL Profile" button (if player exists in IPL system) or "Not in IPL system" indicator
- **Combined Profile Toggle**: Switch between "Domestic Only" and "IPL + Domestic Side-by-Side" views
- **Stats Tabs**: `Batting` | `Bowling` | `Fielding` | `Phase-wise` | `Format Comparison` | `League Comparison`
  - **Batting tab**: Full batting stats table mirroring domestic_player_league_stats batting fields. Filterable by league and season
  - **Bowling tab**: Full bowling stats table. Filterable by league and season
  - **Fielding tab**: Catches, run outs, stumpings
  - **Phase-wise tab** (T20 only, if ball-by-ball available): Radar/bar charts for Powerplay/Middle/Death performance — or "Phase data not available for this league" message if no ball-by-ball
  - **Format Comparison tab**: Side-by-side T20 vs ODI vs First-Class stats
  - **League Comparison tab**: Same player's stats across different leagues (e.g., BBL vs CPL vs PSL)
- **Recent Form**: Sparkline chart of last 5/10 match scores
- **Scouting Score Breakdown**: Expandable panel showing score component weights (T20 40%, Recent Form 20%, ODI 15%, Consistency 10%, FC 10%, Big-match 5%) with individual sub-scores
- **Watchlist Actions**: "Add to Watchlist" button with notes, priority, target role, estimated value fields

#### League Analysis Overview Page (All 10 Teams at a Glance)
- Dashboard showing all 10 IPL franchises in a comparison grid
- Each team card: team logo, name, overall rating (0-100), top strength, top weakness, budget remaining, priority needs
- Sort by: overall rating, budget remaining, weaknesses count
- Click any team → Team Detail Page Analysis tab
- **Cross-comparison table**: Select 2-3 teams to see side-by-side SWOT comparison
- Season selector to view analysis for any historical season

#### Venue Detail Page
- Venue image and info
- Pitch analysis (type, pace/spin friendliness)
- Stats (avg scores, toss decision trends, win % batting first vs chasing)
- List of matches hosted

#### Records Page
- Category tabs: Orange Cap | Purple Cap | Game Changers | Thrillers | Highest Scores | Lowest Scores
- Season filter dropdown
- Visual cards + data tables for each category

#### Orange Cap & Purple Cap Race Feature (within Records Page — Orange Cap / Purple Cap tabs)
- **Cap Race Leaderboard:** For the selected season, display the current (or final) standings showing rank, player name, team logo, cumulative runs (Orange) or wickets (Purple), matches played, and supporting stat (strike rate / economy). The player holding the cap is highlighted with a golden (Orange Cap) or purple (Purple Cap) badge.
- **Cap Race Progression Chart:** An animated multi-line chart (Recharts / Chart.js) showing the top 5 contenders' cumulative runs/wickets plotted match-by-match across the season. Each line represents a player, colour-coded by their franchise. The chart visually shows lead changes — where one player overtakes another for the cap. Users can hover over any point to see exact stats after that match.
- **Season Selector:** Dropdown to switch between any season (2008 to present). The race resets each season — the chart and leaderboard reflect only that season's data.
- **Match Slider/Scrubber:** An interactive slider below the chart that lets users scrub through the season match-by-match to see how the standings looked after any specific match (powers the "after-match" API endpoint).
- **Cap Holder Timeline:** A compact horizontal timeline showing which player held the cap after each match — visually displaying how many matches each contender wore the cap during the season.
- **Final Winner Highlight:** At the bottom of each season's tab, a prominent card highlighting the official Orange/Purple Cap winner with their photo, total runs/wickets, matches played, and the team they represented.

#### Education Page
- Accordion/card layout for each formula
- Interactive calculator (input values, get result)
- DLS method dedicated section with step-by-step explanation and examples

---

## 6. UI/UX Design Principles

1. **Mobile-First, Responsive Design**: The entire application is designed mobile-first — layouts, components, and interactions are designed for the smallest screen first, then progressively enhanced for larger screens. This is not an afterthought or a polish step; it is the foundational design methodology from day one.

   **Breakpoint strategy (Tailwind CSS):**
   | Breakpoint | Width | Layout Behaviour |
   |------------|-------|------------------|
   | **Base (Mobile)** | < 640px | Single column, stacked cards, hamburger menu with slide-out drawer (ShadCN Sheet), bottom-sticky action bars, touch-optimised tap targets (min 44x44px), swipeable tabs, charts at full viewport width, tables switch to vertical card-based layouts |
   | **sm** | ≥ 640px | Minor spacing adjustments, two-column grid for small cards |
   | **md (Tablet)** | ≥ 768px | Two-column grids, filter panel as collapsible slide-out drawer, side-by-side stat blocks, horizontal scroll on data tables with frozen first column, charts at half-width or full-width depending on context |
   | **lg (Desktop)** | ≥ 1024px | Sidebar filters visible by default, three/four-column grids, full data tables with all columns visible, charts at optimal width within content area |
   | **xl (Large Desktop)** | ≥ 1280px | Maximum content width (1280px) centred, increased whitespace, multi-panel layouts (e.g., player list + preview panel side by side) |
   | **2xl** | ≥ 1536px | Ultra-wide support, dashboard-style multi-column views for workspace |

   **Mobile-first implementation rules:**
   - All Tailwind classes are written mobile-first: the base class applies to mobile, responsive prefixes (`md:`, `lg:`) add overrides for larger screens. Example: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` — 1 column on mobile, 2 on tablet, 4 on desktop.
   - Navigation: Horizontal navbar on desktop (lg+), hamburger icon with ShadCN Sheet slide-out drawer on mobile/tablet.
   - Player Filter Panel: Full-screen filter drawer on mobile (triggered by a floating filter FAB button), collapsible sidebar on tablet, always-visible sidebar on desktop.
   - Data Tables: On mobile, critical tables (scorecards, leaderboards) transform into vertically stacked cards — each row becomes a card with label-value pairs. On tablet+, standard horizontal tables with sticky first column and horizontal scroll.
   - Charts: On mobile, all charts render at 100% viewport width with simplified axis labels (abbreviated, rotated, or hidden) and enlarged touch targets for tooltips. On desktop, charts render at their optimal width with full labels.
   - Tabs: On mobile, if tab count exceeds screen width, tabs become horizontally scrollable with a scroll indicator. On desktop, all tabs are visible.
   - Modals/Dialogs: On mobile, dialogs render as full-screen bottom sheets (ShadCN Sheet from bottom). On desktop, they render as centred overlay dialogs.
   - Touch interactions: All interactive elements have a minimum tap target of 44x44px (Apple HIG / WCAG 2.5.5). Swipe gestures are supported for tab switching on mobile.
   - Typography: Base font size 16px on mobile (prevents iOS zoom on input focus). Scale up slightly on larger breakpoints for readability.
   - Images: Responsive `srcset` with WebP format. Mobile loads smaller thumbnails (100x100), tablet loads medium (200x200), desktop loads full (400x400). All images lazy-loaded.

   **Page-specific mobile adaptations:**
   - **Home Page**: Hero section uses a single-column stack. Counter cards become a 2x2 grid. Season grid becomes a vertical scrollable list.
   - **Players List**: Grid switches from 4-column (desktop) → 2-column (tablet) → 1-column (mobile). Search bar is full-width. Filter FAB button fixed at bottom-right.
   - **Player Detail**: Tab bar becomes horizontally scrollable. Stat cards stack vertically. Radar chart uses full width. Phase-wise bar chart switches from side-by-side to stacked.
   - **Ratings Leaderboard**: Table becomes card-based on mobile — each player row renders as a card: rank + photo + name + rating + trend.
   - **Analytics Workspace**: On mobile, comparison table scrolls horizontally with frozen player name column. Charts stack vertically. The "Add Players" search is full-width at the top.
   - **Cap Race**: Progression chart uses full width. Match scrubber uses full width with enlarged thumb for touch. Leaderboard below switches to card layout on mobile.
   - **Match Detail**: Scorecard tables switch to card-based layouts. Timeline remains vertical (naturally mobile-friendly).
   - **Auction Detail**: Player table switches to card layout on mobile, sorted by sold price. Scouting sheet opens as full-screen bottom sheet on mobile. Pre-auction team needs stack vertically.
   - **Scouting Hub**: Country grid uses `grid-cols-2` on mobile (compact cards with flag + name). League cards stack single-column. Stats tables switch to card-based layout. Filter panel opens as bottom sheet (ShadCN Sheet). Scouting score badge remains visible as a fixed pill on player profile.
   - **Scouting Player Profile**: Stats tabs become horizontally scrollable. Phase-wise charts use full viewport width. Format/League comparison tables scroll horizontally with frozen first column. Watchlist form opens as bottom sheet.
   - **Team Analysis (SWOT)**: SWOT quadrants stack vertically (`grid-cols-1`). Phase heatmap renders full-width with enlarged tap targets (each cell min 60x60px). Squad depth chart stacks vertically. Dependency bar chart scrolls horizontally. Budget pie chart uses full width. Recruitment cards stack single-column.
   - **League Analysis Overview**: Team comparison grid uses `grid-cols-1 md:grid-cols-2`. Cross-comparison table scrolls horizontally with frozen team name column.

2. **Team-themed Colours**: When viewing a team page, dynamically apply that team's primary colours to the theme.
3. **Dark Mode Support**: Toggle between light and dark themes.
4. **Data Visualizations**: Use bar charts, pie charts, line graphs, radar charts for stats.
5. **Smooth Animations**: Page transitions, hover effects, loading states using Framer Motion.
6. **Global Search**: Instant search with suggestions across players, teams, matches.
7. **Filter & Sort**: Every list page should support filtering (by season, team, role) and sorting.
8. **Breadcrumbs**: For deep navigation (Home > Teams > CSK > Squad 2023).

---

## 7. Implementation Phases (Revised - 8 Sprints, April 1 → May 31, 2026)

### Sprint 1 - Skeleton + Data Pipeline (Apr 1-7)
- Project setup (Vite + React + Tailwind + ShadCN + NestJS + TypeORM + PostgreSQL)
- ALL database entity files and migrations
- CricSheet CSV parser: seed `matches`, `ball_by_ball`, `batting_scorecards`, `bowling_scorecards`, `seasons`, `player_teams`
- **Mobile-first layout shell**: Configure Tailwind with mobile-first breakpoints (base → sm → md → lg → xl → 2xl). Build responsive Navbar (hamburger + ShadCN Sheet drawer on mobile, horizontal nav on lg+), Footer, responsive Sidebar, routing, dark/light mode toggle. Every component from Sprint 1 onwards is built mobile-first — base styles target mobile, responsive prefixes add tablet/desktop overrides
- Configure TanStack Query + Redux Toolkit (store, typed hooks, initial slices for theme/filters/UI)

### Sprint 2 - Data Seeding + Home Page (Apr 8-14)
- Seed player biographical data, team data, venue data, season data
- Create materialized views for career batting/bowling rankings
- API endpoints: `GET /api/seasons`, `GET /api/teams`, `GET /api/players`, `GET /api/records/orange-cap`, `GET /api/records/purple-cap`, `GET /api/cap-race/:seasonId/orange`, `GET /api/cap-race/:seasonId/purple`
- Seed cap race data: compute match-by-match Orange/Purple Cap race standings for all historical seasons (2008-present) from batting/bowling scorecards
- **Home Page**: Hero section, animated counter cards, season grid, global search bar, featured records

### Sprint 3 - Player List + Core Profile (Apr 15-21)
- **Player Search & Filter System**:
  - `GET /api/players/search` autocomplete endpoint with pg_trgm trigram index
  - `GET /api/players` with full filter query params (country, role, batting style, bowling arm, bowling variety, team, status, nationality type)
  - Frontend: `PlayerSearchAutocomplete.jsx` (ShadCN Command, debounced 300ms, case-insensitive substring match)
  - Frontend: `PlayerFilterPanel.jsx` (collapsible sidebar with all filter dropdowns, combinable AND logic)
  - Frontend: `PlayerActiveFilters.jsx` (filter badges with remove/clear-all)
  - URL-persistent filter state via query params
- **Players List Page**: Searchable, filterable grid/table with ShadCN DataTable
- **Player Detail Page (Phase 1)**: Header, bio, core stats dashboard, match history, season-by-season charts
- API endpoints: `GET /api/players/:id`, stats/batting, stats/bowling, stats/fielding, matches

### Sprint 4 - Player Deep Analytics + Rating Engine (Apr 22-28)
- All phase-wise, situational, vs-bowling-type, dismissal, batting-position endpoints
- Player radar chart data endpoint
- **ICC-Calibrated Rating Engine**: Build `rating-engine.ts` — weighted moving average algorithm with decay factor, opposition strength weighting, match context bonus. Compute ratings for all players from ball-by-ball data. Store in `player_ratings` and `player_rating_history` tables
- Rating API endpoints: `GET /api/players/:id/ratings`, `GET /api/players/:id/ratings/history`, `GET /api/ratings/leaderboard`
- **Player Detail Page (Phase 2)**: Tabbed deep-dive sections — phase-wise, situational, vs type, dismissals, by position, radar chart, **IPL Rating badge + rating trend chart on profile header**

### Sprint 5 - Teams + Matches + H2H + Analytics Workspace (Apr 29–May 5)
- Team detail, squad, stats endpoints
- Match detail and scorecard endpoints
- Head-to-head and multi-player comparison endpoints (unlimited player IDs)
- Workspace API: save/load/share endpoints
- **Team Detail Page**: Banner with dynamic team colors, season selector, squad grid, stats
- **Match Detail Page**: Header, full scorecard tables, key stats
- **Head-to-Head Explorer** on player page
- **Ratings Page**: Leaderboard with category tabs (Batting/Bowling/All-Rounder/Fielding)
- **Analytics Workspace (Analytics Lab)**: Empty canvas → add players → dynamic comparison tables, overlaid radar charts, career progression graphs, scatter plots, phase-wise comparisons, save/load/share functionality

### Sprint 6 - Venues + Records + Seasons (May 6-12)
- Venue detail and analytics endpoints
- Records endpoints (all categories)
- Season detail and points table endpoints
- **Venue Detail Page**, **Records Page**, **Season Detail Page**

### Sprint 7 - Auctions + Scouting Hub + Team Analysis + Education + Live Match (May 13-22)
- Auction endpoints and data seeding
- **Domestic League Scouting Hub (Backend)**:
  - All scouting module entities and migrations (domestic_countries, domestic_leagues, domestic_league_seasons, domestic_matches, domestic_batting/bowling/fielding_performances, domestic_ball_by_ball, domestic_player_league_stats, scouting_watchlist, scouting_player_tags)
  - Seed countries and leagues data (13+ countries, 30+ leagues)
  - CricSheet domestic CSV parser (domestic-cricsheet-parser.ts) — ingest BBL, CPL, PSL, SA20, The Hundred, T20 Blast ball-by-ball data
  - Scorecard parser (domestic-scorecard-parser.ts) — ingest Ranji, SMAT, Vijay Hazare, County Championship, Sheffield Shield etc. scorecard data
  - Player linking service (pg_trgm fuzzy matching domestic names → players.id)
  - Stats aggregator service — build domestic_player_league_stats from raw performance data
  - Scouting score algorithm (0-100 composite IPL-readiness score)
  - All scouting API endpoints: countries, leagues, player stats, search, discover, watchlist
- **Domestic League Scouting Hub (Frontend)**:
  - ScoutingHubPage with country grid, search, discover, watchlist tabs
  - ScoutingCountryPage, ScoutingLeaguePage, ScoutingPlayerPage
  - ScoutingSearchPage with advanced filters and stat thresholds
  - ScoutingWatchlistPage with CRUD, priority management, CSV export
  - Redux scoutingSlice + TanStack Query hooks
- **IPL Team SWOT Analysis (Backend)**:
  - Team analysis entities and migrations (team_swot_analysis, team_auction_roi)
  - Phase-wise team analysis service (aggregates from existing IPL ball_by_ball)
  - Squad depth, overseas analysis, dependency index, age profile services
  - Auction ROI computation service
  - Budget analysis service
  - Recruitment recommendation service (cross-references team gaps with scouting hub)
  - All team analysis API endpoints
- **IPL Team SWOT Analysis (Frontend)**:
  - TeamSWOTDashboard, TeamPhaseHeatmap, TeamSquadDepthChart, TeamDependencyIndex
  - TeamOverseasAnalysis, TeamAgeProfile, TeamAuctionROI, TeamBudgetAnalysis
  - TeamRecruitmentPanel (with "Find in Scouting Hub" cross-links)
  - TeamLeagueOverview (all 10 teams comparison dashboard)
  - "Analysis" tab added to Team Detail Page
  - Redux teamAnalysisSlice + TanStack Query hooks
- **Auction Page Enhancements**: Pre-auction team needs view, scouting integration on player cards, post-auction gap analysis
- Education endpoints (static JSON content)
- **Live Match System**: WebSocket gateway (Socket.IO), live ingestion service (cron polling upstream API every 15-30 sec), live commentary service, live event emitter, Redis pub/sub for multi-instance sync, BullMQ job queue for post-match cascading updates (ratings, cap race, points table, leaderboard)
- **Live Match UI**: Live score card on Home Page, live ball-by-ball commentary feed on Match Detail Page, live scorecard, "🔴 LIVE" indicators across platform
- **Auction Detail Page**, **Education Page**, **Schedule Page**
- Data quality sprint: verify stats for top 30 players against ESPNcricinfo

### Sprint 8 - Polish + Deploy (May 20-31)
- Framer Motion page transitions and animations
- Team-themed dynamic CSS custom properties
- **Mobile-first responsive QA**: Test every page on real devices (iPhone SE, iPhone 15, iPad, iPad Pro, Android phones/tablets) and browser DevTools at every breakpoint (base, sm, md, lg, xl, 2xl). Verify touch targets (44x44px minimum), swipe gestures, drawer navigation, card-based table layouts on mobile, chart readability on small screens, filter FAB behaviour, and bottom-sheet dialogs
- Performance: code splitting, image lazy loading, TanStack Query cache tuning, DB index optimization
- Global full-text search (PostgreSQL tsvector)
- SEO: meta tags, Open Graph for rich link previews
- Deployment: Frontend → Netlify, Backend → Railway/Render, PostgreSQL → Supabase/Neon
- Manual QA pass, data accuracy verification
- Demo walkthrough script for IPL management presentation

---

## 8. Data Collection Strategy

### Historical Data (2008 – Previous Seasons)

| Source Type         | Examples                                                                 |
| ------------------- | ------------------------------------------------------------------------ |
| **Public APIs**     | CricAPI, ESPNcricinfo API, CricSheet (ball-by-ball open data)            |
| **Open Datasets**   | Kaggle IPL datasets, CricSheet CSV/JSON data                             |
| **Web Scraping**    | ESPNcricinfo, IPL official site (for sponsors, management, auction data) |
| **Manual Curation** | Coach profiles, sponsor financials, auction narratives, match analyses   |

Historical data is cleaned, normalized, and seeded into PostgreSQL via TypeORM seed scripts stored in the `data/` directory as JSON files.

### Domestic League Data (Worldwide Scouting)

| Source Type              | Coverage                                                                                  | Data Level      |
| ------------------------ | ----------------------------------------------------------------------------------------- | --------------- |
| **CricSheet (Primary)**  | BBL, CPL, PSL, SA20, The Hundred, T20 Blast, SMAT (partial), BPL, LPL (partial)          | Ball-by-ball    |
| **ESPNcricinfo Scraping** | Ranji Trophy, Vijay Hazare, Duleep Trophy, County Championship, Sheffield Shield, Plunket Shield, Ford Trophy, Super Smash, Logan Cup, CSA T20 Challenge, Quaid-e-Azam Trophy, Shpageeza Cricket League | Scorecard-level |
| **Kaggle Datasets**      | Pre-cleaned historical data for some leagues                                              | Bootstrapping   |
| **Official League Sites** | Squad lists, schedules, results                                                           | Player identification |

Domestic league data is ingested via two pipelines:
1. **CricSheet CSV Parser** (`domestic-cricsheet-parser.ts`): Parses CricSheet's standardised CSV format into `domestic_matches`, `domestic_batting/bowling/fielding_performances`, and `domestic_ball_by_ball` tables. One parser handles all CricSheet-covered leagues with a league config parameter.
2. **Scorecard Parser** (`domestic-scorecard-parser.ts`): Parses scraped scorecard data from ESPNcricinfo StatsGuru into `domestic_batting/bowling/fielding_performances`. No ball-by-ball data — phase-wise fields remain NULL.

**Player Linking**: The `domestic-player-linker.ts` service uses PostgreSQL `pg_trgm` fuzzy matching to link `domestic_player_name` records to `players.id` in the IPL player table. Ambiguous matches are flagged for manual review. This linking is essential for the combined IPL + domestic profile view.

**Data Quality**: All domestic data points include a `source_url` for provenance. Stats are cross-verified where multiple sources overlap (e.g., CricSheet + ESPNcricinfo for BBL). The `domestic_player_league_stats` table is refreshed via `domestic-stats-aggregator.service.ts` after each data ingestion cycle, and the `last_refreshed_at` field tracks staleness.

### Live Match Data (Current Season — Real-Time)

| Source Type              | Examples                                                              |
| ------------------------ | --------------------------------------------------------------------- |
| **Live Cricket API**     | CricAPI (ball-by-ball live feed), ESPNcricinfo live scorecard API     |
| **Official IPL Feed**    | BCCI/IPL official data partner feed (if licensed)                     |
| **Fallback Scraping**    | Real-time scraping of ESPNcricinfo live scorecard (if API unavailable)|

The `live-ingestion.service.ts` runs a **@nestjs/schedule cron job** that polls the upstream source every **15-30 seconds** during a live match. Each poll:
1. Fetches the latest ball(s) since the last poll
2. Validates and normalises the data (maps player names to IDs, validates over/ball numbers)
3. Inserts new rows into `ball_by_ball`, updates `batting_scorecards` and `bowling_scorecards`
4. Updates the `matches` table (current score, overs, wickets)
5. Emits events via `EventEmitter2` → WebSocket gateway broadcasts to all connected clients

### Data Authenticity & Accuracy Policy

**All data on the platform must be authentic, verified, and traceable to authoritative sources. Zero tolerance for fabricated, estimated, or placeholder data.**

| Principle                     | Implementation                                                    |
| ----------------------------- | ----------------------------------------------------------------- |
| **Source verification**        | Every data point is traceable to CricSheet, ESPNcricinfo, or official IPL records. Source metadata is stored with each record. |
| **Cross-verification**         | Post-match, data is cross-checked against at least 2 independent sources before being marked as "verified" in the database. |
| **Real-time freshness**        | During the IPL season, match data is available within 30 seconds of each delivery. Post-match stats, ratings, and rankings update within 5 minutes of match completion. |
| **Dynamic cascading updates**  | When a match completes, the following update automatically: player career stats, player ratings, cap race standings, points table, leaderboard rankings, team stats, season records. |
| **Retroactive corrections**    | If a scoring correction is issued (e.g., third umpire revises a boundary call, or a later review changes a dismissal), the system supports retroactive edits that cascade through all derived stats. |
| **No stale data**              | Historical data is periodically reconciled against CricSheet's latest releases. Any discrepancies trigger automated alerts and correction workflows. |
| **Audit trail**                | Every data insert and update is timestamped with the source and the user/system that made the change. This provides a complete audit trail for any data point. |

---

## 9. Key Technical Decisions

1. **Player-Coach identity**: A single `players` table holds all individuals. The `coaches` table has an optional `person_id` FK back to `players`. This ensures one person = one identity, with two separate profile views.
2. **Ball-by-ball as the foundation**: The `ball_by_ball` table is the single source of truth for all granular stats (~181 player stat fields). Phase-wise, situational, vs-type, positional, and head-to-head stats are all computed by aggregating this table with appropriate filters. This avoids storing 181 pre-computed columns per player.
3. **Three-level stat filtering**: Every player stat endpoint supports `?teamId=` and `?seasonId=` query params, enabling Overall / Team-wise / Season-wise views from the same API — matching the requirement for stats at three levels.
4. **Scorecards for match-level display, ball-by-ball for analytics**: `batting_scorecards` and `bowling_scorecards` store the per-match summary (what you see on a scorecard). `ball_by_ball` stores every delivery (what powers deep analytics). Both exist because scorecards are fast to query for match pages, while ball-by-ball is queried for player analysis.
5. **Derived fields on ball_by_ball**: Fields like `phase`, `bowling_type`, `batter_hand`, and `bowler_arm` are derived from other tables but stored directly on each ball record. This avoids expensive joins when aggregating millions of ball records.
6. **Partnerships table**: Stored separately (not derived on-the-fly) because partnership data requires tracking two batters simultaneously across consecutive balls — complex to compute in real-time.
7. **Head-to-head computed on demand**: H2H stats (player vs specific bowler/batter/team/venue) are computed by filtering `ball_by_ball` at query time rather than pre-computed, since the number of possible combinations is too large to pre-store.
8. **Rankings via database views/materialized views**: Career and season-wise rankings are maintained as PostgreSQL materialized views, refreshed periodically, to avoid re-computing ranks on every request.
9. **Season as a first-class entity**: Everything ties back to a season — this is the primary axis for filtering and navigation.
10. **JSON fields for flexibility**: Fields like `bidding_war_teams` in auctions use JSON arrays to avoid over-normalizing rarely queried data.
11. **Match analysis**: Stored as structured text in the `matches` table. Can be upgraded to a richer format later.
12. **NestJS modular architecture**: Each domain (players, teams, matches, etc.) is a self-contained NestJS module with its own controller, service(s), DTOs, and entities. This keeps the codebase organized and each module independently testable.
13. **TypeORM repository pattern**: Each entity gets an injected repository via `@InjectRepository()`. Complex stat queries use TypeORM's QueryBuilder for fine-grained SQL control (GROUP BY, window functions, subqueries) while simple CRUD uses repository methods.
14. **TypeORM entities as schema source of truth**: Database schema is defined via TypeORM decorator-based entities (`.entity.ts` files). Migrations are auto-generated from entity changes via `typeorm migration:generate`.
15. **Player search uses PostgreSQL pg_trgm extension**: The `pg_trgm` extension provides a GIN trigram index on the `name_lower` column, enabling fast `ILIKE '%substring%'` queries across ~700 players. The dedicated `/api/players/search` autocomplete endpoint returns lightweight results (id, name, photo, role, country) for the dropdown, while the main `/api/players` endpoint handles full filtered/paginated listing. Frontend debounces search input at 300ms.
16. **Player filters are combinable and URL-persistent**: All filter selections are synced to URL query parameters (e.g., `?country=India&role=Batter&bowlingArm=Left`), making filtered views shareable via URL. Filters use AND logic — selecting multiple filters narrows results. The backend builds a dynamic WHERE clause from received query params using TypeORM QueryBuilder.
17. **Derived filter fields on players table**: `bowling_arm`, `bowling_variety`, `nationality_type`, and `status` are derived/normalized fields stored directly on the `players` table for fast indexed filtering, avoiding complex joins or string parsing at query time.
18. **ICC-calibrated rating engine (historical from 2008)**: The rating engine processes all ~1,100+ IPL matches chronologically from Season 1 (2008) Match 1 onwards, computing ratings match-by-match. This creates a complete historical timeline. Key mechanics: (a) **Match performance score** (0–1000): batting uses runs/SR/proportion-of-team-total/phase-context; bowling uses wickets/economy/dot-ball%/phase-context. (b) **Opposition strength multiplier**: opponent avg rating / 500 (normalized to ~1.0x). (c) **Match-winning bonus**: +10-15% for top-scorer/leading wicket-taker in a win. (d) **Seasonal decay**: 100% current, 50% previous season, 25% two ago, 12.5% three ago, 6.25% floor. (e) **Damping factor for new players**: batting innings scale (40% at 1-5 innings → 100% at 26+), bowling wickets scale (40% at 1-5 wickets → 100% at 41+). (f) **Inactivity decay**: 15% penalty for missing one season, 25% additional for two consecutive missed seasons. (g) **Retirement**: 3+ seasons inactive OR confirmed retirement → removed from active rankings, only peak rating/rank/season displayed on profile. Three tables: `player_ratings` (current snapshot), `player_rating_history` (per-match), `player_season_ratings` (season-end snapshots for historical season rankings). Materialized view `active_player_ranking_leaderboard` refreshed after each match. All-rounder = (batting × bowling) / 1000.
19. **Analytics workspace persistence**: For MVP, workspace state (selected players, filters, layout) is managed via Redux Toolkit (`workspaceSlice`) and persisted to browser localStorage via `redux-persist` or manual sync. The `analytics_workspaces` table exists for shareable links (player IDs + filters encoded in a UUID-keyed row, accessed via `/api/workspaces/share/:token`). No user authentication required for MVP — workspaces are anonymous.
20. **Domestic league data is separate from IPL data**: Domestic data lives in its own table hierarchy (`domestic_*`), not mixed into the IPL `ball_by_ball` table. This avoids polluting IPL queries, maintains performance, and allows independent data quality management. The link is through `players.id` (nullable FK on domestic tables).
21. **Nullable player_id on domestic performance tables**: Not every domestic player is in the IPL system. The nullable FK with `domestic_player_name` as fallback ensures all domestic data can be stored immediately and linked to IPL players later via fuzzy matching (`player-linking.service.ts`).
22. **Pre-aggregated domestic stats**: Unlike IPL where stats are computed from `ball_by_ball` on demand, domestic stats are pre-aggregated in `domestic_player_league_stats` because: (a) domestic data is more static (not live-updated), (b) many leagues lack ball-by-ball data and only have scorecard-level records, (c) cross-league queries spanning millions of rows from multiple leagues would be expensive at request time. Aggregates are refreshed on data ingestion via `domestic-stats-aggregator.service.ts`.
23. **T20 relevance weighting for scouting score**: The `t20_relevance_weight` (0.0-1.0) and `prestige_tier` (1/2/3) on `domestic_leagues` enable the scouting score to meaningfully weight performance by league importance. A BBL T20 performance (weight 1.0, tier 1) carries more weight than a Shpageeza Cricket League T20 (weight 1.0, tier 3) or a Ranji Trophy First-Class performance (weight 0.3, tier 1) for IPL auction purposes.
24. **Phase-wise stats only where ball-by-ball exists**: For leagues without CricSheet ball-by-ball coverage, phase-wise fields in `domestic_player_league_stats` remain NULL. The frontend gracefully handles this with "Phase data not available for this league" messaging. This is a deliberate trade-off — better to have scorecard-level stats for all leagues than to exclude leagues without ball-by-ball data.
25. **SWOT analysis is computed, not manually entered**: All team analysis in `team_swot_analysis` is derived from existing IPL data (`ball_by_ball`, `player_teams`, `auction_players`, `player_ratings`) via aggregation queries. No manual input required. The table caches results with `last_computed_at` to avoid recomputation on every request. Cache is refreshed after each match or on demand.
26. **Team recruitment recommendations cross-reference scouting hub**: The `team-recruitment.service.ts` queries the scouting module's data to suggest domestic league players who fit the team's identified gaps. This creates a feedback loop: SWOT identifies "need a left-arm death bowler" → recruitment service finds matching players from BBL, CPL, SA20 etc. with scouting scores → suggests them with budget-appropriate price ranges.
27. **Country → League → Player drill-down**: The scouting hub uses a three-level navigation hierarchy (Country → League → Player) that mirrors the existing IPL pattern (Season → Team → Player), keeping the UX consistent and intuitive across both modules.
28. **Wagon wheel & pitch map data on ball_by_ball**: Seven new fields on the `ball_by_ball` table (`shot_direction`, `shot_distance`, `pitch_length`, `pitch_line`, `pitch_x`, `pitch_y`, `shot_angle`) power the batter/bowler hover overlays on the live match and scorecard pages. These fields are nullable because CricSheet and some upstream sources may not provide shot/pitch data for every delivery — where unavailable, the wagon wheel and pitch map simply show fewer data points. For live matches, the ingestion service populates these fields from the upstream API's enhanced ball data (where supported). The overlay data is queried from `ball_by_ball` filtered by `match_id + batter_id` (or `bowler_id`) and returned as structured arrays for frontend rendering via `WagonWheel.jsx`, `ScoringAreas.jsx`, and `PitchMap.jsx` components.
20. **Multi-player comparison has no limit**: The `/api/players/compare` endpoint accepts an unlimited array of player IDs. The backend constructs parallel queries for each player and returns a unified comparison object. Frontend handles horizontal scroll for large player sets. Performance is bounded by individual player stat queries (each is fast due to materialized views and indexes).
