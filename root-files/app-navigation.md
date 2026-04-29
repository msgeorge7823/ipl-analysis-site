# IPL Analytics - Application Navigation Guide

> A complete route-by-route guide to navigating the IPL Analytics platform.

---

## Table of Contents

1. [Global Navigation](#global-navigation)
2. [Global Search](#global-search)
3. [Pages & Routes](#pages--routes)
   - [Home](#home-)
   - [Live Match](#live-match-live)
   - [Seasons](#seasons-seasons)
   - [Season Detail](#season-detail-seasonsyear)
   - [Teams](#teams-teams)
   - [Team Detail](#team-detail-teamsid)
   - [Players](#players-players)
   - [Player Detail](#player-detail-playersid)
   - [Coaches](#coaches-coaches)
   - [Coach Detail](#coach-detail-coachesid)
   - [Matches](#matches-matches)
   - [Match Detail](#match-detail-matchesid)
   - [Analytics Lab](#analytics-lab-analytics)
   - [Auctions](#auctions-auctions)
   - [Ratings](#ratings-ratings)
   - [Records](#records-records)
   - [Venues](#venues-venues)
   - [Venue Detail](#venue-detail-venuesname)
   - [Schedule](#schedule-schedule)
   - [News](#news-news)
   - [Education](#education-education)
   - [Sponsors](#sponsors-sponsors)
4. [Keyboard Shortcuts](#keyboard-shortcuts)
5. [Quick Route Reference](#quick-route-reference)

---

## Global Navigation

### Desktop (large screens)

The top navigation bar displays the **IPL Analytics** logo on the left (click to return Home) and primary links:

| Navbar Item | Route | Notes |
|---|---|---|
| Home | `/` | |
| Live | `/live` | Red pulsing badge when a match is in progress |
| Seasons | `/seasons` | |
| Teams | `/teams` | |
| Players | `/players` | |
| Matches | `/matches` | |
| Analytics Lab | `/analytics` | |
| Auctions | `/auctions` | |

A **"More" dropdown** (chevron icon) reveals additional pages:

| Dropdown Item | Route |
|---|---|
| News | `/news` |
| Schedule | `/schedule` |
| Ratings | `/ratings` |
| Records | `/records` |
| Venues | `/venues` |
| Coaches | `/coaches` |
| Education | `/education` |
| Sponsors | `/sponsors` |

### Mobile

- A **hamburger menu** replaces the navbar links, showing all 16 items in a single slide-out list.
- A **search icon** appears in the top-right corner.

### Breadcrumbs

All list and detail pages show breadcrumb trails for easy back-navigation. Example: `Players > Virat Kohli` or `Seasons > 2024 > Match #42`.

---

## Global Search

**Activate:** Click the search button in the navbar or press **Ctrl+K** (Windows/Linux) / **Cmd+K** (Mac).

A modal overlay opens with a search input. Type at least **2 characters** to see results (max 10 shown). The search is powered by **Fuse.js fuzzy matching** and covers:

| Entity | Searchable Fields | Navigates To |
|---|---|---|
| Players | Name, short name, nicknames, team affiliations | `/players/:id` |
| Teams | Name, short name | `/teams/:id` |
| Venues | Name, city | `/venues/:name` |
| Seasons | Year, winner | `/seasons/:year` |

Results are color-coded by type: **indigo** (Player), **emerald** (Team), **amber** (Venue), **rose** (Season).

**Keyboard navigation within results:** Arrow Up/Down to move, Enter to select, Esc to close.

---

## Pages & Routes

---

### Home (`/`)

The landing page and entry point to the application.

**What you see:**
- IPL highlights banner featuring the latest completed season's champion (winner colors, badge, and key stats)
- Quick stats: total matches, total players, total seasons, total sixes across IPL history
- A local player search bar with dropdown autocomplete (shows top 5 matches with 40px avatar photos)
- Carousel/grid of IPL facts and news snippets

**Where to go from here:** Click any navbar link, use the search bar to jump directly to a player, or use Ctrl+K for global search.

---

### Live Match (`/live`)

Real-time match coverage during an active IPL game.

**Tabs:**

| Tab | What it shows |
|---|---|
| **Info** | Toss result, playing XIs, team colors |
| **Live** | Ball-by-ball commentary, current run rate, phase stats (powerplay / middle / death), live score |
| **Scorecard** | Inning-by-inning breakdown, partnerships, fall of wickets |
| **Squads** | Playing XI display for both teams |
| **MVP Ratings** | Computed batting and bowling performance scores updated in real time |

**Tip:** The navbar shows a red pulsing indicator next to "Live" when a match is in progress.

---

### Seasons (`/seasons`)

A reverse-chronological grid of all **19 IPL seasons (2008-2026)**.

**What you see:**
- Season cards with season number, year, match count, champion and runner-up names
- Winner-themed gradient backgrounds matching the champion franchise colors

**Where to go from here:** Click any season card to open the Season Detail page.

---

### Season Detail (`/seasons/:year`)

A complete breakdown of a single IPL season.

**Tabs:**

| Tab | What it shows |
|---|---|
| **Overview** | Season stats, key dates, highlights, Orange Cap and Purple Cap race visualization (leader progression over the season) |
| **Matches** | Full fixture list with results, scores, and match links |
| **Points Table** | League standings with wins, losses, NRR, and qualification status |
| **Playoffs** | Knockout bracket tree (Qualifier 1, Eliminator, Qualifier 2, Final) |

**Also shows:** Replacement player tracking (mid-season substitutions).

---

### Teams (`/teams`)

A visual grid of all IPL franchises.

**What you see:**
- **Active franchises (10):** CSK, MI, RCB, KKR, DC, PBKS, RR, SRH, GT, LSG - with franchise colors, logos, championship count badges
- **Defunct franchises (5):** Deccan Chargers, Kochi Tuskers Kerala, Pune Warriors India, Rising Pune Supergiant, Gujarat Lions
- Key stats per team: current squad size, seasons participated

**Where to go from here:** Click any team card to open the Team Detail page.

---

### Team Detail (`/teams/:id`)

A deep dive into a single franchise.

**Tabs:**

| Tab | What it shows |
|---|---|
| **Overview** | Franchise history, total wins, matches played, iconic moments, logo evolution timeline |
| **Squad** | Current official 2026 roster (with overseas badges) + historical all-time player roster + support staff table (coaches linked to their profiles) |
| **Stats** | Aggregated player statistics, multi-season performance radar chart |
| **Season History** | Year-by-year results, playoff appearances, title wins |
| **SWOT** | Strategic strengths, weaknesses, opportunities, threats analysis |

**Cross-links:** Head coach names in the Squad tab link to `/coaches/:id`. Player names link to `/players/:id`.

---

### Players (`/players`)

The master player directory with advanced filtering.

**Search:** Full-text fuzzy search (Fuse.js) - type any part of a player's name for instant results.

**Filters (combinable with AND logic):**

| Filter | Options |
|---|---|
| Role | Batter, Bowler, All-rounder, Wicketkeeper |
| Team | Any current or past franchise |
| Nationality | Indian / Overseas (with aeroplane badge for overseas) |
| Status | Active, Inactive, Retired, Turned Coach |

**Views:** Grid view (64px avatar cards) and table view (32px row avatars). Paginated at 20 players per page.

**Where to go from here:** Click any player to open their full profile.

---

### Player Detail (`/players/:id`)

The most feature-rich page in the app - a comprehensive player profile.

**Header:** Large avatar photo (96-112px), player name, current team, watchlist toggle button.

**Tabs:**

| Tab | What it shows |
|---|---|
| **Overview** | Career summary, personal info, IPL rating (0-1000 scale with tier: World Class / Elite / Established / Rising), key stats |
| **Batting** | Phase-wise radar chart (Powerplay / Middle / Death performance), dismissal breakdown pie chart, season progression line chart, partnership bar chart, batting position heat map |
| **Bowling** | Economy, average, strike rate breakdowns with similar chart visualizations |
| **Fielding** | Catches, run-outs, stumpings stats |
| **Team History** | All squad appearances across different franchises over the years |

**Cross-links:** Team names link to `/teams/:id`. If the player became a coach, a link to their coach profile appears.

---

### Coaches (`/coaches`)

Directory of **166 unique coaches** across **236 tenures** spanning all 15 IPL franchises (2008-2026).

**Filters by role:**
Head Coach, Assistant Coach, Batting Coach, Bowling Coach, Fielding Coach, Director of Cricket, Mentor, Analyst, Bowling Consultant, Strength & Conditioning, Physio, Trainer, Team Manager

**What you see:** Coach cards with photo (64px), name, current team affiliation, primary role, and tenure years.

**Where to go from here:** Click any coach card to open the Coach Detail page.

---

### Coach Detail (`/coaches/:id`)

A coach's complete IPL career profile.

**What you see:**
- Personal info: age, date of birth, nationality
- **Career timeline:** All coaching tenures with team assignments, years, and roles - displayed chronologically
- **Per-tenure stats:** Win/loss record split by league stage vs playoffs
- **Career totals:** Aggregate stats across all tenures
- **Playing career link:** If the coach was a former IPL player, a direct link to their Player Detail page

**Verification badges:** Verified (green) or Unverified (yellow) status on each tenure entry.

---

### Matches (`/matches`)

A multi-view match browser for exploring IPL fixtures and results.

**Tabs:**

| Tab | What it shows |
|---|---|
| **Fixtures** | Upcoming scheduled matches |
| **Results** | Completed match results with scores |
| **Points Table** | Current standings with NRR, updated per round |
| **Playoffs** | Knockout bracket visualization |

**Group-by options:** Teams, Venues, or Seasons - reorganizes the match list for focused analysis.

**Where to go from here:** Click any match to open the Match Detail page.

---

### Match Detail (`/matches/:id`)

A full scorecard and analysis for a single IPL match.

**Tabs:**

| Tab | What it shows |
|---|---|
| **Info** | Venue, toss decision, match result, weather conditions, venue map |
| **Scorecard** | Inning-by-inning batting/bowling cards, partnerships, fall of wickets, extras |
| **Squads** | Playing XI for both teams |
| **Progression** | Run progression area chart tracking run rate over each over |
| **MVP** | Computed batting and bowling performance ratings for every player in the match |

---

### Analytics Lab (`/analytics`)

An advanced interactive workspace for player comparison and analysis.

**How it works:**
1. Start with a **blank canvas** - the workspace begins empty
2. **Search and add players** using the built-in Fuse-powered search (add up to 6 players)
3. Compare players side-by-side across multiple dimensions:
   - Phase-wise performance radars (Powerplay / Middle / Death)
   - Dismissal pattern breakdowns
   - Season-by-season progression charts
4. **Save workspaces** to localStorage - name your workspace and return to it later
5. **Load or delete** previously saved workspaces

**Ideal for:** Pre-match analysis, broadcast preparation, talent scouting comparisons.

---

### Auctions (`/auctions`)

A comprehensive auction intelligence portal.

**Tabs:**

| Tab | What it shows |
|---|---|
| **Auction History** | Past years' auction results - team spending breakdowns, highest bids, unsold player counts |
| **Scouting Hub** | Searchable player database with performance metrics, impact scores, league participation, phase-wise stats |
| **Top Targets** | Highlighted players projected as high-value for the next auction |
| **IPL Crossover** | Cross-league statistical comparisons |
| **League Comparisons** | How IPL stacks up against other T20 leagues |

---

### Ratings (`/ratings`)

A dynamic ICC-calibrated player rating engine.

**Rating categories:** Batting, Bowling, All-rounder (batting x bowling / 1000)

**View modes:**

| Mode | What it shows |
|---|---|
| **Active** | Players who appeared in the most recent or previous season |
| **Retired** | Players who have retired - shows peak rating and peak rank |
| **All-Time** | Complete historical rankings from 2008 to present |

**Features:**
- Rating scale: 0-1000 points
- Tier-based color coding: World Class / Elite / Established / Rising
- Name search filter
- Recompute button with progress bar (recalculates ratings from match-by-match data using Web Worker)

**Algorithm:** Weighted moving average - recent performances weighted more heavily, with season decay (100% current, 50% previous, etc.), opposition strength, match result, and match context factored in.

---

### Records (`/records`)

The IPL record book.

**Sections:**

| Section | What it shows |
|---|---|
| **Batting Records** | Sortable table - most runs, highest scores, best averages, most centuries/fifties, most sixes/fours |
| **Bowling Records** | Most wickets, best bowling figures, best economy, best average |
| **Fielding Records** | Most catches, most run-outs, most stumpings |
| **Cap Race** | Season-selectable visualization showing Orange Cap (batting) and Purple Cap (bowling) leader progression over a season |
| **Season Highlights** | Highest and lowest team totals, biggest wins, closest finishes |

---

### Venues (`/venues`)

A searchable directory of all IPL grounds.

**Search:** By venue name or city.

**Sort options:**
- Most matches played
- Average 1st innings score
- Average 2nd innings score

**What you see:** Venue cards with match count, average scores, and city.

**Where to go from here:** Click any venue card to open the Venue Detail page.

---

### Venue Detail (`/venues/:name`)

A ground-level profile for a single IPL venue.

**What you see:**
- Venue metadata: name, city, capacity (where available)
- **Recent matches:** Last 20 matches played at this venue (expandable to view all)
- **Team performance:** Win/loss records for each team at this venue
- **Historical trends:** How the venue plays over time (batting-friendly vs bowling-friendly patterns)

**Useful for:** Understanding pitch behavior, home advantage analysis, match prediction context.

---

### Schedule (`/schedule`)

A calendar-style fixture view.

**Controls:**
- **Season selector:** Pick a year (defaults to the latest season)
- **Team filter:** Show only matches involving a specific franchise
- **Venue filter:** Show only matches at a specific ground

**Layout:** Matches grouped by month, showing date, time, teams, venue, and result status (upcoming / completed with scores).

---

### News (`/news`)

IPL news feed with categorized articles.

**Category filters:**
- Match Report
- Transfer
- Auction
- Highlights
- Disciplinary
- Season Preview

**Features:** Date-based sorting, relative timestamps ("2 hours ago"), category badges, and external source links for reading full articles.

---

### Education (`/education`)

An educational resource explaining cricket statistics and formulas.

**Topics covered (accordion format):**
- Batting Average (formula + worked example with a famous player)
- Strike Rate
- Economy Rate
- Bowling Average
- Boundaries per Innings
- And more...

Each item includes: formula, plain-English description, worked example, and color-coded explanation.

---

### Sponsors (`/sponsors`)

IPL title sponsorship history and brand facts.

**Sponsor timeline:**
| Period | Sponsor |
|---|---|
| 2008-2012 | DLF |
| 2013-2015 | Pepsi |
| 2016-2019 | Vivo |
| 2020-2023 | Dream11 |
| 2024-present | Tata |

**Also shows:** "Did You Know" facts about IPL valuations, viewership records, media rights deals, franchise valuations, and global reach.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| **Ctrl+K** / **Cmd+K** | Open global search modal |
| **Arrow Up/Down** | Navigate search results |
| **Enter** | Select highlighted search result |
| **Esc** | Close search modal |

---

## Quick Route Reference

| Route | Page |
|---|---|
| `/` | Home |
| `/live` | Live Match |
| `/seasons` | All Seasons |
| `/seasons/:year` | Season Detail |
| `/teams` | All Teams |
| `/teams/:id` | Team Detail |
| `/players` | All Players |
| `/players/:id` | Player Detail |
| `/coaches` | All Coaches |
| `/coaches/:id` | Coach Detail |
| `/matches` | All Matches |
| `/matches/:id` | Match Detail |
| `/analytics` | Analytics Lab |
| `/auctions` | Auctions |
| `/ratings` | Player Ratings |
| `/records` | Records |
| `/venues` | All Venues |
| `/venues/:name` | Venue Detail |
| `/schedule` | Schedule |
| `/news` | News |
| `/education` | Education |
| `/sponsors` | Sponsors |
