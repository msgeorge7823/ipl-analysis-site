# IPL Analysis Website - Requirements Understanding

## Project Overview

The goal is to build a **visually striking and attractive website** that serves as a comprehensive encyclopedia and analytics platform for the **Indian Premier League (IPL)**, covering every season from its inception (2008) to the present.

---

## Key Modules & Requirements

### 1. Player Profiles

- **Bio Data**: Full biographical information for every player (name, DOB, nationality, playing role, batting/bowling style, etc.).
- **Strengths & Weaknesses**: Detailed assessment of each player's game.
- **Overall Career Profile**: Aggregated IPL stats across all seasons and teams.
- **Team-wise Performance Breakdown**: Since players frequently switch franchises via auctions/trades, their stats must be split and viewable **per team** they have represented.
- **Comprehensive Analysis**: Every possible cricketing metric and analytical lens applicable to a player should be covered.
- **Dual Role Handling (Player + Coach)**: Some individuals have served as both a player and a coach in the IPL (e.g., a retired player who later becomes a coach). In such cases:
  - The **Player Profile** and **Coach Profile** must be kept **strictly separate** - they must never be mixed or merged.
  - Both profiles should exist **under the same person's page**, with a clear toggle/tab for the user to choose between viewing the **Player Profile** or the **Coach Profile**.
  - Player analysis metrics apply only to the player profile; coach analysis metrics apply only to the coach profile.

#### 1.1 Player Search & Discovery

- **Real-time Autocomplete Search**:
  - As the user types, matching player names appear as a live dropdown.
  - **Case-insensitive substring matching** — not just prefix, but "contains anywhere".
  - Example: typing `s` → all names starting with "S" (Shubman Gill, Suryakumar Yadav, etc.)
  - Example: typing `sha` → all names containing "sha" anywhere (Shardul Thakur, Ishan Kishan, Rashid Khan, etc.)
  - Debounced input (300ms) to avoid excessive API calls.
  - Built on ShadCN Command/Combobox component on frontend.
  - Backend uses PostgreSQL `ILIKE` with `pg_trgm` trigram index for fast substring matching.

- **Advanced Filter Panel** (all filters are combinable with AND logic):

  | Filter             | Options                                                                                       |
  | ------------------ | --------------------------------------------------------------------------------------------- |
  | **Country**        | India, Australia, England, South Africa, New Zealand, West Indies, Afghanistan, Sri Lanka, Bangladesh, Zimbabwe, Netherlands, etc. |
  | **Player Role**    | Batter, Bowler, All-rounder, Wicketkeeper-Batter                                              |
  | **Batting Style**  | Right-hand bat, Left-hand bat                                                                 |
  | **Bowling Arm**    | Right-arm, Left-arm                                                                           |
  | **Bowling Variety**| Fast, Medium, Off-spin, Leg-spin, Left-arm orthodox, Left-arm wrist spin (Chinaman)           |
  | **IPL Team**       | All 10 current franchises + defunct teams (filter by "ever played for" or "current team")     |
  | **Status**         | Active in IPL / Retired / Unsold in latest auction                                            |
  | **Nationality Type** | Domestic / Overseas                                                                         |

  - Filters stack — e.g., "Left-arm + Spin + Afghanistan" → Noor Ahmad; "Australia + Fast + Right-arm" → Pat Cummins, Mitchell Starc, Josh Hazlewood
  - Filter selections persist in the URL as query params for shareability
  - Clear all / reset filters button
  - Show active filter count badge

### 1.2 IPL Player Rating & Ranking System (ICC-Calibrated)

Every player receives an **IPL Rating** (0–1000 scale), calculated algorithmically using the same principles as the ICC Player Rankings system. Ratings are computed **historically from IPL Season 1 (2008)** through every match, building up a complete rating timeline for every player who has ever played in the IPL.

#### Rating Scale
| Range     | Label           | Description                                     |
| --------- | --------------- | ----------------------------------------------- |
| 900–1000  | All-Time Great  | Supreme achievement — elite, generational talent |
| 750–899   | World Class     | Consistently dominant performer                  |
| 600–749   | Excellent       | High-quality, impactful player                   |
| 450–599   | Good            | Solid, reliable contributor                      |
| 300–449   | Average         | Competent but inconsistent                       |
| 0–299     | Below Average   | Limited impact in IPL                            |

#### Rating Categories
- **Batting Rating** (0–1000): Based on runs scored, strike rate, consistency, opposition bowling strength, match result contribution, and match context (powerplay/death/chase pressure)
- **Bowling Rating** (0–1000): Based on wickets taken, economy rate, opposition batting strength, match result contribution, and phase effectiveness
- **All-Rounder Rating**: (Batting Rating × Bowling Rating) / 1000
- **Fielding Rating** (0–1000): Based on catches, run-outs, consistency, and impact dismissals

#### Historical Timeline (Starting from 2008)
- The rating engine processes **every match in chronological order** from IPL 2008 Match 1 onwards
- After each match, every participating player's rating is recalculated and stored
- This creates a complete historical rating timeline — you can see what Virat Kohli's rating was after any specific match in any season
- Season-end snapshots are stored: the rating and rank of every player at the end of each season they played

#### Player Lifecycle in the Rating System

##### New Player Entry
- A player enters the rating system the moment they play their first IPL match
- **New players start at 0 rating points**
- **Damping factor (qualification scale)** is applied to new players — they receive only a percentage of their computed rating until they have enough IPL experience:

  | IPL Batting Innings Played | % of Full Batting Rating Received |
  | -------------------------- | --------------------------------- |
  | 1–5 innings                | 40%                               |
  | 6–10 innings               | 55%                               |
  | 11–15 innings              | 70%                               |
  | 16–20 innings              | 80%                               |
  | 21–25 innings              | 90%                               |
  | 26+ innings                | 100% (fully qualified)            |

  | IPL Wickets Taken          | % of Full Bowling Rating Received |
  | -------------------------- | --------------------------------- |
  | 1–5 wickets                | 40%                               |
  | 6–10 wickets               | 55%                               |
  | 11–20 wickets              | 70%                               |
  | 21–30 wickets              | 80%                               |
  | 31–40 wickets              | 90%                               |
  | 41+ wickets                | 100% (fully qualified)            |

  This prevents a player from rocketing to #1 after one great match. They must sustain performance to earn full rating.

##### Active Players
- A player is considered **active** in the rankings if they have played in the **current or most recent completed IPL season**
- Active players appear in the live leaderboard with their current rating, rank, and rank movement (up/down/stable)

##### Inactive Players (Missed Seasons)
- If a player **misses one IPL season** (not picked in auction, injured, unavailable), their rating receives a **15% decay penalty** applied at the start of the next season
- If a player **misses two consecutive seasons**, an additional **25% decay** is applied (cumulative)
- They remain in the system but drop in rankings due to inactivity decay
- If they return, they resume from their decayed rating and rebuild from there

##### Retired Players
- When a player **confirms retirement from IPL** (or has not played for 3+ consecutive seasons), they are **removed from the active rankings**
- On their player profile page, instead of current rating/rank, display:
  - **Peak Rating**: The highest rating they ever achieved (batting, bowling, allrounder)
  - **Peak Rank**: The highest rank they ever held
  - **Peak Season**: The season in which they hit their peak
  - **Career Rating Timeline**: Full historical chart showing their rating journey from debut to retirement
  - **Final Rating**: Their rating at the time of their last IPL match
- Retired players do NOT appear in the active leaderboard
- They can be found via a "Hall of Fame" or "All-Time" filter on the ratings page

#### Calculation Principles (Mirroring ICC Methodology)

1. **Weighted moving average**: Each match performance generates a match rating. The player's overall rating is a weighted average of all match ratings, with recent matches weighted most heavily.

2. **Match Performance Score (0–1000 per match)**:
   - **Batting**: Base score from runs scored, weighted by: strike rate relative to match average SR, proportion of team total scored, balls faced context (death overs worth more), and boundary percentage
   - **Bowling**: Base score from wickets taken, weighted by: economy rate relative to match average economy, dot ball percentage, wickets in key phases (death overs worth more)
   - **Bonus**: If the player's team wins AND the player was top-scorer or leading wicket-taker, apply a **+10-15% bonus** to their match score

3. **Opposition strength factor**: Each match score is multiplied by an opposition strength coefficient:
   - Opposition team's average player rating / 500 (normalized so average opposition = 1.0x, strong opposition > 1.0x, weak opposition < 1.0x)
   - Against a team with average batting rating of 600 → bowling performance gets 1.2x multiplier
   - Against a team with average batting rating of 400 → bowling performance gets 0.8x multiplier

4. **Seasonal decay** (critical — IPL is annual, not continuous):
   - Current season matches: **100% weight**
   - Previous season (1 year ago): **50% weight**
   - Two seasons ago: **25% weight**
   - Three seasons ago: **12.5% weight**
   - Four+ seasons ago: **6.25% weight** (floor — very old performances contribute minimally but never fully disappear)

5. **No human intervention**: Entirely algorithmic — zero subjective assessment

6. **Updated after every match**: As new match data is added to the database, ratings are recalculated for all participating players

#### Ranking Display

##### Active Rankings (Leaderboard Page)
- Tabs: **Batting** | **Bowling** | **All-Rounder** | **Fielding**
- Filters:
  - **Team**: Filter by current IPL franchise
  - **Nationality**: India / Overseas / specific country
  - **Season**: View end-of-season rankings for any historical season (2008–present)
  - **Role**: Batter / Bowler / All-rounder / WK-Batter
- Each player row shows:
  - Rank (with movement arrow: ▲ green / ▼ red / ● stable)
  - Player photo thumbnail
  - Player name (clickable → player profile)
  - Current IPL team logo
  - **Rating** (0–1000, prominently displayed)
  - **Career Best Rating** (smaller, beside current)
  - Rating trend sparkline (mini chart showing recent movement)

##### Player Profile Rating Section
- **For active players**: Current rating badge (color-coded by tier), current rank, rank movement, career best, rating trend chart (full timeline from debut to present)
- **For retired players**: Peak rating badge, peak rank, peak season, final rating, career timeline chart (debut to last match), "Retired" label — NO current rank shown

##### Historical Season Rankings
- Select any season (2008–2026) → see the exact rankings as they stood at the end of that season
- This allows users to answer questions like "Who was the #1 rated batsman after IPL 2016?"

##### Design Note
- The display is **inspired by CricBuzz's ICC rankings UX patterns** (category tabs, clean player rows, filter controls) but must be implemented with **original design** matching our application's visual identity (ShadCN components, team-themed colors, dark/light mode). **Do not copy CricBuzz's design** — only use it as a reference for the information architecture and UX flow.

---

### 1.3 Analytics Workspace (Interactive Dashboard)

A dedicated, interactive analytics area where users can build custom analyses, compare unlimited players, and save their work.

#### Core Concept
- The workspace **starts empty** — a blank canvas/dashboard
- Users search and add players (no limit on number) to populate the workspace
- As players are added, all possible analytics and comparisons are dynamically generated
- Users can **save their workspace** configurations to return to later (via localStorage or user accounts)

#### Workspace Features
- **Player Selector**: Search and add any number of players to the workspace
- **Dynamic Comparison Tables**: Auto-generated stat comparison across all added players
  - Core stats (runs, average, SR, wickets, economy, etc.)
  - Phase-wise comparison (powerplay/middle/death performance side by side)
  - Situational comparison (bat first vs chase across all players)
  - Vs bowling/batting type comparison
- **Visualization Panel**:
  - Overlaid radar charts (all players on one chart)
  - Multi-line career progression graphs (rating/runs/wickets over seasons)
  - Grouped bar charts for category comparisons
  - Scatter plots (e.g., average vs strike rate with each player as a point)
- **Filter Controls**: Filter the entire workspace by season range, team, venue, match phase
- **Save & Load**: Save workspace configurations with a custom name; load saved workspaces later
- **Export**: Export comparison data as PNG image or CSV
- **Shareable Link**: Generate a link to share a workspace configuration (player IDs encoded in URL params)

---

### 2. Team Profiles

- **Sponsorship Details**: All sponsors associated with each team.
- **Management & Ownership**: Team owners and management hierarchy.
- **Coaching Staff (with profiles)**: Head coach, bowling coach, batting coach, fielding coach, and all support staff. Each coach should have their own profile page with relevant analysis.
- **Coach-specific Analysis**: Coaching records, tenures, strategies, and impact - distinct from player analysis since the criteria differ.
- **Note**: If a coach also has a player history in IPL, their coach profile here links to the same person's page but remains a separate view (see Player Profiles - Dual Role Handling above).

### 3. Season Schedule & Match Data

- **Full Season Schedule**: For every IPL season (2008 to present), display the complete match schedule showing:
  - Match number, date, day of week, and time
  - Team 1 vs Team 2 with team logos/colours
  - **Home Team Indicator**: A prominent "HOME" badge next to the team playing at their home ground. This is critical for officials to instantly identify whose home game it is.
  - Venue name and city (with a location pin icon)
  - Match status: Upcoming / Completed / Live
  - Double-header indicators for days with two matches
- **Season Selector**: Switch between any season (2008–present) to view that season's full schedule
- **Filters**: Filter by team (show only one team's matches), venue, or month
- **Venue Directory**: A grid showing all venues used in a season, which team's home ground each is, and neutral venues
- **Every Match Covered**: Full scorecard, date, venue, and detailed analysis for each and every IPL match ever played.
- **Day & Date Information**: When each game was played.
- **Match-level Analysis**: In-depth breakdown of each match (key moments, turning points, performances, etc.).

#### 3.1 Live Match Score & Ball-by-Ball Commentary

During the active IPL season, the platform must provide **real-time live match coverage**:

- **Live Score Display**: When a match is currently in progress, the platform displays the live score — current batting team's score, overs, wickets, run rate, and the scores of the batters at the crease and the current bowler's figures. This updates in real-time (within 15-30 seconds of each delivery) via WebSocket push — no manual page refresh needed.
- **Ball-by-Ball Commentary**: A live feed showing every delivery as it happens:
  - Over and ball number (e.g., "14.3")
  - Bowler name → Batter name
  - Outcome: runs scored (0, 1, 2, 3, 4, 6), extras (wide, no ball, bye, leg bye), or WICKET
  - Commentary text describing what happened (e.g., "Short ball outside off, Kohli pulls it over mid-wicket for SIX! 50 up for Kohli off 32 balls.")
  - Visual indicators: dot balls (grey), singles (white), boundaries (green for 4, gold for 6), wickets (red)
- **Live Match Card on Home Page**: When a match is live, a prominent "LIVE" card appears at the top of the Home Page showing both teams' scores, current partnership, required run rate (if chasing), and a "Watch Ball-by-Ball →" link to the full live view. Completed match cards also appear showing final scores — clicking them redirects to the full match detail page with scorecard and commentary.
- **Match Page Tabs**: Every match (live or completed) has three tabs:
  - **Info**: Match number, date, time (displayed in 24-hour format of the user's local timezone auto-detected by the browser), venue details (stadium, city/state, capacity), and match officials (Umpire 1, Umpire 2, 3rd Umpire, Match Referee)
  - **Live**: Ball-by-ball commentary from both innings (1st and 2nd) with colour-coded delivery badges — green for FOUR, gold for SIX, red for WICKET, orange for wide/no-ball, grey for dot. Over summary cards appear after each over showing per-over breakdown. Current batting scorecard summary at the top.
  - **Scorecard**: Full scorecard using an **accordion UI** — one accordion per team, only one open at a time (opening one auto-closes the other). Each accordion shows: (1) Batting table with extras (wides, no-balls, byes, leg byes) and total, (2) Bowling table, (3) Fall of wickets with batter dismissed, over, and score at fall, (4) Partnerships between each pair of batters.
- **Live Indicators Throughout the Platform**: On any page (Players List, Team Detail, Schedule), if a match is currently in progress, a small "🔴 LIVE" indicator appears next to the relevant teams/players showing they are currently playing.
- **Post-Match Automatic Updates**: The moment a match is completed:
  - Scorecards are finalised and verified
  - Player career stats (runs, wickets, averages, strike rates) are recalculated
  - Player ratings are updated for all participating players
  - Orange Cap and Purple Cap race standings are recalculated
  - Points table is updated
  - Leaderboard rankings are refreshed
  - All changes are visible on the platform within 5 minutes of match completion

#### 3.2 Data Authenticity & Accuracy

- **All data must be authentic, verified, and sourced from authoritative sources.** No fabricated, estimated, or placeholder data is acceptable on the platform at any time.
- **Primary sources**: CricSheet (peer-reviewed open data), official BCCI/IPL match data feeds, ESPNcricinfo
- **Cross-verification**: After each match, data is cross-verified against at least two sources before being marked as "verified" in the database
- **Dynamic freshness**: The platform reflects reality as it happens. If a match was played today, the results, stats, and updated rankings must be available on the platform within minutes — not hours or days.
- **Correction capability**: If a scoring error is identified post-match (e.g., a boundary revised to a 3 by the third umpire after the fact), the system supports retroactive corrections that cascade through all affected computed statistics (career stats, ratings, rankings, cap race).

### 4. Auction Details

- **Complete Auction History**: Every IPL auction from the very first to the latest.
- **Auction Metadata**: Location, date, and auctioneer for each auction.
- **Full Proceedings (A-Z)**: What happened in each auction - player lists, base prices, sold prices, unsold players, bidding wars, RTM usage, etc.
- **Auction Highlights**: Notable moments, record-breaking bids, surprises, and key narratives.

### 5. Grounds & Pitch Analysis

- **Venue Profiles**: Analysis of every ground where IPL matches have been played.
- **Pitch Behaviour**: What the pitch favoured at the time of the match (pace, spin, batting-friendly, etc.).
- **Match Results at Venue**: Historical outcomes and how ground conditions influenced results.

### 6. Season-wise Sponsorship & Business Analysis

- **IPL Sponsors (per season)**: Title sponsors, associate sponsors, and official partners.
- **Sponsor Achievements**: What they gained from the association.
- **Financial Insights**: Profits, losses, and business impact of sponsorship deals.

### 7. Records & Highlights Section

- **Orange Cap Race**: The Orange Cap is awarded to the highest run-scorer of an IPL season. The race begins fresh at the start of every season — all players start from zero. After each match, the cumulative run totals are updated and the leading run-scorer "wears" the Orange Cap until overtaken. The platform tracks this race match-by-match for every season from 2008 to present, displaying:
  - A **live leaderboard** showing the current standings (rank, player, team, cumulative runs, matches played, strike rate)
  - A **progression chart** plotting the top contenders' cumulative runs match-by-match across the season, visually showing lead changes
  - A **match slider** to view standings after any specific match in the season
  - A **cap holder timeline** showing which player held the cap after each match
  - The **final winner** highlighted with their complete stats
- **Purple Cap Race**: The Purple Cap is awarded to the highest wicket-taker of an IPL season. Identical race mechanics as the Orange Cap but tracking wickets instead of runs:
  - Same leaderboard, progression chart, match slider, and cap holder timeline — but for wickets
  - Supporting stat shown is economy rate instead of strike rate
- **Orange Cap Holders (All Seasons)**: Complete list of official Orange Cap winners from every IPL season (2008 to present)
- **Purple Cap Holders (All Seasons)**: Complete list of official Purple Cap winners from every IPL season (2008 to present)
- **Game-Changing Innings**: Most impactful individual performances in IPL history.
- **Most Thrilling Matches**: The greatest and closest encounters in IPL history.
- **Highest & Lowest Scores**: Both all-time records and season-specific records.

### 8. Cricket Statistics Education Section

- **How to Calculate Cricket Stats**: A dedicated educational section explaining the formulas and logic behind:
  - Batting average
  - Bowling average
  - Batting strike rate
  - Bowling strike rate / Economy rate
  - **DLS (Duckworth-Lewis-Stern) Method**: Full explanation of how rain-affected match scores are recalculated.
  - Any other relevant cricket statistics and metrics.

---

## Summary of Data Dimensions

| Dimension           | Scope                                                    |
| ------------------- | -------------------------------------------------------- |
| **Time**            | Every IPL season (2008 - present)                        |
| **Players**         | Every player + bio + stats (overall & per-team)          |
| **Ratings**         | ICC-calibrated 0–1000 ratings for batting, bowling, all-rounder, fielding |
| **Analytics Lab**   | Interactive workspace — unlimited player comparison, save/share/export |
| **Teams**           | Franchise details, staff, sponsors, management           |
| **Matches**         | Every match with full scorecard & analysis               |
| **Auctions**        | Every auction event with complete proceedings            |
| **Venues**          | Ground & pitch analysis with historical match outcomes   |
| **Sponsors**        | Season-wise sponsors with financial/business data        |
| **Records**         | Caps, milestones, highs, lows, thrillers                 |
| **Education**       | Statistical formulas and DLS method explanation          |

---

### 9. Responsive & Mobile-First Design

The entire application must follow a **mobile-first design methodology**. This is not an optional enhancement or a final polish step — it is the foundational approach from the very first wireframe and the very first line of CSS.

- **Mobile-first means**: Every layout, component, and interaction is designed for the smallest screen (mobile phone) first, then progressively enhanced for tablet and desktop. In code, base Tailwind classes target mobile; responsive prefixes (`md:`, `lg:`, `xl:`) add overrides for larger screens.
- **Breakpoints**:
  - Base / Mobile (< 640px): Single column, stacked cards, hamburger menu with drawer navigation, bottom-sticky action bars, touch-optimised tap targets (minimum 44x44px), full-width charts with simplified labels, tables transform into vertical card layouts
  - Tablet (≥ 768px): Two-column grids, collapsible filter drawer, side-by-side stat blocks, horizontal-scroll data tables with frozen first column
  - Desktop (≥ 1024px): Sidebar filters visible by default, three/four-column grids, full data tables, charts at optimal width
  - Large Desktop (≥ 1280px): Maximum content width centred, multi-panel layouts
- **Touch interactions**: All clickable elements must have a minimum tap target of 44x44px. Swipe gestures supported for tab switching and drawer dismissal. No hover-only interactions — anything triggered on hover must also be accessible via tap/click.
- **Typography**: Base font size 16px on mobile (prevents iOS zoom on input focus). Headings and stat numbers scale proportionally across breakpoints.
- **Images**: Responsive `srcset` with multiple resolutions. Mobile loads smaller thumbnails to reduce bandwidth. All images lazy-loaded.
- **Navigation**: Horizontal navbar on desktop, hamburger icon with slide-out drawer on mobile/tablet. Global search bar always accessible at every breakpoint.
- **Data tables on mobile**: Leaderboard, scorecard, and comparison tables switch to vertically stacked card layouts on mobile — each row becomes a card with label-value pairs. This prevents horizontal scrolling of dense tables on small screens.
- **Charts on mobile**: All charts render at 100% viewport width with simplified (abbreviated or hidden) axis labels and enlarged touch targets for tooltips.
- **Dialogs on mobile**: Modals render as full-screen bottom sheets on mobile, centred overlay dialogs on desktop.

---

## Key Takeaways

1. **Scale**: This is a large-scale data-intensive project spanning 17+ years of IPL history.
2. **Depth**: Not just surface-level stats - the requirement calls for deep analytical breakdowns at every level (player, team, match, venue, auction).
3. **Visual Appeal**: The website must be visually striking and attractive, not just functional.
4. **Mobile-First & Responsive**: The application is designed mobile-first from the ground up — every component, layout, and interaction is optimised for mobile screens first, then progressively enhanced for tablet and desktop. This is a foundational principle, not a late-stage addition.
5. **Dual Player View**: A unique requirement is splitting player profiles into overall performance vs. per-franchise performance.
6. **Player-Coach Separation**: Individuals who have been both a player and a coach must have both profiles kept strictly separate under the same page, with a user-facing toggle to switch between the two.
7. **Coach Analytics**: Coaches need their own dedicated analysis separate from players.
8. **Educational Component**: The site should also teach users how cricket statistics work.
9. **Business Layer**: Sponsor and financial data adds a business analytics dimension beyond just cricket stats.

---

# IPL Player Stats Fields - Complete Breakdown

This document lists every statistical field that will be available for a player on the website. Stats are divided into categories. All stats are available at **three levels**: Overall (career-wide), Team-wise (per franchise), and Season-wise (per year).

---

## 1. General Profile Fields

| Field                | Description                                      |
| -------------------- | ------------------------------------------------ |
| Full Name            | Player's full legal name                         |
| Date of Birth        | DOB                                              |
| Age                  | Current age (calculated)                         |
| Nationality          | Country of origin                                |
| Born In              | City/State of birth                              |
| Playing Role         | Batsman / Bowler / All-rounder / Wicketkeeper    |
| Batting Style        | Right-hand bat / Left-hand bat                   |
| Bowling Style        | Right-arm fast / Left-arm spin / etc.            |
| IPL Debut            | Date and match of first IPL appearance           |
| IPL Last Match       | Date and match of most recent appearance         |
| Teams Played For     | List of all IPL franchises represented           |
| Jersey Numbers       | Jersey number(s) worn (per team if changed)      |
| Auction History      | Summary of all auctions (base price, sold price) |
| Is Also Coach        | Whether the player has also served as a coach    |

---

## 2. Batting Stats

### Core Batting Numbers

| Stat                     | Description                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| Matches                  | Total matches played                                             |
| Innings                  | Total batting innings                                            |
| Not Outs                 | Number of times remained not out                                 |
| Runs Scored              | Total runs accumulated                                           |
| Balls Faced              | Total balls faced                                                |
| Highest Score            | Best individual score (with not out indicator)                   |
| Batting Average          | Runs / (Innings - Not Outs)                                     |
| Strike Rate              | (Runs / Balls Faced) x 100                                      |
| Centuries (100s)         | Number of 100+ scores                                            |
| Half-Centuries (50s)     | Number of 50-99 scores                                           |
| Thirties (30s)           | Number of 30-49 scores                                           |
| Ducks                    | Number of times dismissed for 0                                  |
| Golden Ducks             | Dismissed on the first ball faced                                |
| Fours                    | Total boundaries (4s) hit                                        |
| Sixes                    | Total maximums (6s) hit                                          |
| Boundary Percentage      | % of runs scored through 4s and 6s                               |
| Dot Ball Percentage      | % of balls faced that were dot balls                             |
| Singles Percentage       | % of balls that resulted in singles                              |
| Doubles/Triples          | Runs scored in 2s and 3s                                         |

### Phase-wise Batting (by overs)

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Powerplay Runs (Overs 1-6)    | Runs scored during powerplay                       |
| Powerplay Average             | Batting average in powerplay                       |
| Powerplay Strike Rate         | Strike rate in powerplay                           |
| Middle Overs Runs (Overs 7-15)| Runs scored in middle overs                        |
| Middle Overs Average          | Batting average in middle overs                    |
| Middle Overs Strike Rate      | Strike rate in middle overs                        |
| Death Overs Runs (Overs 16-20)| Runs scored in death overs                         |
| Death Overs Average           | Batting average in death overs                     |
| Death Overs Strike Rate       | Strike rate in death overs                         |

### Situational Batting

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Runs Batting First            | Runs scored when team batted first                 |
| Average Batting First         | Average when batting first                         |
| SR Batting First              | Strike rate when batting first                     |
| Runs Chasing                  | Runs scored when chasing a target                  |
| Average Chasing               | Average when chasing                               |
| SR Chasing                    | Strike rate when chasing                           |
| Runs in Wins                  | Total runs in matches the team won                 |
| Average in Wins               | Batting average in winning matches                 |
| Runs in Losses                | Total runs in matches the team lost                |
| Average in Losses             | Batting average in losing matches                  |

### Batting vs Bowling Type

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Runs vs Pace                  | Runs scored against pace bowlers                   |
| SR vs Pace                    | Strike rate against pace                           |
| Dismissals vs Pace            | Times dismissed by pace bowlers                    |
| Runs vs Spin                  | Runs scored against spin bowlers                   |
| SR vs Spin                    | Strike rate against spin                           |
| Dismissals vs Spin            | Times dismissed by spin bowlers                    |
| Runs vs Left-arm              | Runs against left-arm bowlers                      |
| Runs vs Right-arm             | Runs against right-arm bowlers                     |

### Dismissal Analysis

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Caught                        | Times dismissed caught (outfield + behind)         |
| Bowled                        | Times dismissed bowled                             |
| LBW                           | Times dismissed leg before wicket                  |
| Run Out                       | Times run out                                      |
| Stumped                       | Times stumped                                      |
| Hit Wicket                    | Times dismissed hit wicket                         |
| Caught & Bowled               | Times dismissed caught & bowled                    |
| Most Dismissed By (Bowler)    | Bowler who has dismissed this player the most      |

### Batting Position Stats

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Runs as Opener                | Runs scored when opening the innings               |
| Average as Opener             | Average when batting at positions 1-2              |
| Runs at No. 3                 | Runs when batting at one-down                      |
| Runs in Middle Order (4-5)    | Runs when batting at 4 or 5                        |
| Runs in Lower Order (6-7)    | Runs when batting at 6 or 7                        |
| Runs as Finisher (6-8)       | Runs in finishing positions                        |
| Most Frequent Batting Position| The position the player bats at most often         |

### Milestones & Streaks

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Longest Run Streak (30+ runs) | Consecutive innings of scoring 30+ runs            |
| Longest Run Streak (40+ runs) | Consecutive innings of scoring 40+ runs            |
| Longest Run Streak (50+ runs) | Consecutive innings of scoring 50+ runs            |
| Longest Run Streak (100+ runs)| Consecutive innings of scoring 100+ runs           |
| Most Consecutive 50s          | Back-to-back half-century streak                   |
| Fastest Fifty                 | Fewest balls to reach 50                           |
| Fastest Century               | Fewest balls to reach 100                          |
| Most Runs in a Single Season  | Best season tally                                  |
| Most Runs in a Single Match   | Highest individual match score                     |

---

## 3. Bowling Stats

### Core Bowling Numbers

| Stat                     | Description                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| Matches                  | Total matches bowled in                                          |
| Innings Bowled            | Total innings where the player bowled                            |
| Overs Bowled              | Total overs delivered                                            |
| Balls Bowled              | Total balls delivered                                            |
| Runs Conceded             | Total runs given away                                            |
| Wickets Taken             | Total wickets claimed                                            |
| Bowling Average           | Runs Conceded / Wickets Taken                                   |
| Economy Rate              | Runs Conceded / Overs Bowled                                    |
| Bowling Strike Rate       | Balls Bowled / Wickets Taken                                    |
| Best Bowling (Match)      | Best figures in a single innings (e.g., 4/20)                   |
| 4-Wicket Hauls            | Number of times taking 4+ wickets in an innings                 |
| 5-Wicket Hauls            | Number of times taking 5+ wickets in an innings                 |
| 3-Wicket Hauls            | Number of times taking 3+ wickets in an innings                 |
| Maidens                   | Total maiden overs bowled                                       |
| Dot Balls Bowled          | Total dot balls delivered                                       |
| Dot Ball Percentage       | % of deliveries that were dot balls                             |
| Wides                     | Total wides bowled                                              |
| No Balls                  | Total no balls bowled                                           |
| Extras Conceded           | Total extras (wides + no balls)                                 |
| Fours Conceded            | Boundaries hit off this bowler                                  |
| Sixes Conceded            | Maximums hit off this bowler                                    |
| Boundary Percentage       | % of balls that went for boundaries (4s + 6s)                   |

### Phase-wise Bowling (by overs)

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Powerplay Wickets (Overs 1-6) | Wickets taken in powerplay                         |
| Powerplay Economy             | Economy rate in powerplay                          |
| Powerplay SR                  | Bowling strike rate in powerplay                   |
| Middle Overs Wickets (7-15)   | Wickets in middle overs                            |
| Middle Overs Economy          | Economy in middle overs                            |
| Middle Overs SR               | Strike rate in middle overs                        |
| Death Overs Wickets (16-20)   | Wickets in death overs                             |
| Death Overs Economy           | Economy in death overs                             |
| Death Overs SR                | Strike rate in death overs                         |

### Situational Bowling

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Wickets Defending             | Wickets when team batted first (defending)         |
| Economy Defending             | Economy rate when defending a total                |
| Wickets Chasing Side          | Wickets when bowling first (team chasing)          |
| Economy Bowling First         | Economy rate when bowling first                    |
| Wickets in Wins               | Wickets in matches the team won                    |
| Wickets in Losses             | Wickets in matches the team lost                   |

### Bowling vs Batter Type

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Wickets vs Right-handers      | Wickets taken against right-hand batters           |
| Economy vs Right-handers      | Economy against right-hand batters                 |
| Wickets vs Left-handers       | Wickets taken against left-hand batters            |
| Economy vs Left-handers       | Economy against left-hand batters                  |

### Wicket Types (Dismissal Methods)

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Bowled                        | Wickets where batter was bowled                    |
| Caught (Outfield)             | Wickets via catches in the outfield                |
| Caught Behind                 | Wickets via catches by the keeper                  |
| Caught & Bowled               | Wickets where bowler took the catch                |
| LBW                           | Wickets via leg before wicket                      |
| Stumped                       | Wickets via stumping (off this bowler)             |
| Hit Wicket                    | Wickets via hit wicket                             |
| Most Dismissed Batter         | Batter this bowler has dismissed the most          |

### Milestones & Streaks

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Most Wickets in a Season      | Best season wicket tally                           |
| Most Wickets in a Match       | Best match figures                                 |
| Best Economy in a Match       | Lowest economy in a single match (min 2 overs)     |
| Consecutive Wicket-taking Matches | Longest streak of taking at least 1 wicket      |
| Most Dot Balls in a Match     | Highest dot ball count in a single match           |

---

## 4. Fielding Stats

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Matches                       | Total matches played                               |
| Catches Taken                 | Total catches held                                 |
| Catches in Outfield           | Catches taken in the outfield                      |
| Catches in Slip/Close         | Catches in slip cordon / close-in positions        |
| Dropped Catches               | Catches dropped (if data available)                |
| Run Outs (Direct Hit)         | Direct hit run outs effected                       |
| Run Outs (Assisted)           | Run outs where player was involved but not direct  |
| Total Run Outs                | All run outs involved in                           |
| Stumpings (WK only)           | Stumpings effected (wicketkeepers)                 |
| Catches as WK                 | Catches taken behind the stumps (wicketkeepers)    |
| Total Dismissals as WK        | Catches + Stumpings (wicketkeepers)                |
| Most Catches in a Match       | Best fielding performance in a single match        |
| Most Catches in a Season      | Best fielding performance in a season              |

---

## 5. All-Rounder Specific Stats

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| All-Rounder Rating            | Combined batting + bowling impact score            |
| Matches with 30+ Runs & 2+ Wickets | Impactful all-round performances              |
| Player of the Match Awards    | Total POTM awards received                         |
| Win Contribution Index        | % of team wins where this player was a key factor  |

---

## 6. Impact & Advanced Analytics

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Player of the Match Awards    | Total POTM awards                                  |
| MVP Rating (per season)       | Overall value rating combining all disciplines     |
| Match Win Contributions       | Number of matches where player was the difference  |
| Runs Scored in Won Matches %  | Proportion of team total contributed in wins        |
| Average Partnership           | Average runs added in partnerships                 |
| Highest Partnership           | Biggest partnership (with partner name)             |
| Catches Taken off Own Bowling | Self-caught dismissals (C&B)                       |
| Boundary Count per Innings    | Average number of 4s + 6s per innings              |
| Dot Ball Percentage (Batting) | How often the player fails to score off a ball     |
| Dot Ball Percentage (Bowling) | How often the player delivers a dot ball           |
| Death Over Specialist Rating  | Performance rating specifically in overs 16-20     |
| Powerplay Specialist Rating   | Performance rating specifically in overs 1-6       |
| Clutch Performance Index      | Performance in close/pressure matches               |
| Average in Playoffs           | Batting average in playoff/knockout matches        |
| SR in Playoffs                | Strike rate in playoff/knockout matches            |
| Wickets in Playoffs           | Wickets taken in playoff/knockout matches          |
| Economy in Playoffs           | Economy rate in playoff/knockout matches           |
| Performance in Finals         | Stats breakdown for IPL final matches              |

---

## 7. Head-to-Head Stats

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| vs Specific Bowler            | Runs, SR, dismissals against a particular bowler   |
| vs Specific Batter (bowling)  | Wickets, runs conceded against a particular batter |
| vs Specific Team (batting)    | Batting stats against each IPL franchise           |
| vs Specific Team (bowling)    | Bowling stats against each IPL franchise           |
| vs Specific Venue             | Performance at each ground                         |

---

## 8. Comparison-Ready Aggregates

These are pre-calculated ranks and percentiles for easy player-vs-player comparison.

| Stat                          | Description                                        |
| ----------------------------- | -------------------------------------------------- |
| Career Runs Rank              | Rank among all IPL players by total runs           |
| Career Wickets Rank           | Rank among all IPL players by total wickets        |
| Career Catches Rank           | Rank among all IPL players by total catches        |
| Highest Individual Score Rank | Where the player's best score stands all-time      |
| Best Bowling Figures Rank     | Where the player's best bowling stands all-time    |
| Season-wise Rank              | Player's rank in each season they played           |

---

## Summary Count

| Category                    | Number of Stat Fields |
| --------------------------- | --------------------- |
| General Profile             | 14                    |
| Batting (Core)              | 19                    |
| Batting (Phase-wise)        | 9                     |
| Batting (Situational)       | 10                    |
| Batting (vs Bowling Type)   | 8                     |
| Batting (Dismissal Analysis)| 8                     |
| Batting (Position-wise)     | 7                     |
| Batting (Milestones)        | 9                     |
| Bowling (Core)              | 22                    |
| Bowling (Phase-wise)        | 9                     |
| Bowling (Situational)       | 6                     |
| Bowling (vs Batter Type)    | 4                     |
| Bowling (Wicket Types)      | 8                     |
| Bowling (Milestones)        | 5                     |
| Fielding                    | 13                    |
| All-Rounder                 | 4                     |
| Impact & Advanced           | 18                    |
| Head-to-Head                | 5                     |
| Comparison Ranks            | 6                     |
| **Total**                   | **~184 stat fields**  |
