# IPL Analytics Platform — Technical Conversation Blueprint

## How This Document Works

This document captures the **complete technical dialogue** between three parties involved in building the IPL Analytics Platform:

- **Customer (C)** — The project owner who brings the requirements
- **Designers (D)** — The UI/UX Designer (D-UX) and the Graphic Designer (D-GFX) who shape the visual and interaction experience
- **Developers (DEV)** — The Lead Developer (DEV-LEAD), Frontend Developer (DEV-FE), Backend Developer (DEV-BE), and Database Engineer (DEV-DB) who architect and build the system

The conversation unfolds across **seven acts**, from initial requirement gathering to final team alignment.

---

---

# ACT 1: CUSTOMER MEETS THE DESIGN TEAM

## Scene: Initial Requirements Gathering

---

**C:** I want to build a platform — not just a website, a full-blown analytics platform — for the Indian Premier League. Think of it as the definitive IPL encyclopedia combined with a professional-grade analytics engine. This is meant for IPL management officials, broadcast production teams, franchise analysts, and sports journalists. It needs to cover every season from 2008 to today, every player who has ever played, every match, every ball bowled, every auction, every venue, every team, every coach. I want search, I want filters, I want ratings like the ICC does, I want an analytics workspace where someone can compare unlimited players side by side, I want the Orange Cap and Purple Cap race visualized match by match, I want it to look broadcast-grade — the kind of thing you would see on JioCinema or Star Sports during a live telecast. The audience is officials, not casual fans. It has to be precise, it has to be beautiful, and it has to be fast.

**D-UX:** That is a significant scope. Before we begin designing, I need to understand the hierarchy of information. When a user — say, a franchise analyst — lands on this platform, what is the first thing they are trying to accomplish?

**C:** Two things, depending on who they are. A broadcast analyst wants to quickly pull up a player's stats mid-match — they have maybe 15 seconds before the commentator needs the number on screen. A franchise analyst during auction season wants to compare five or six players across 20 different stat categories and see who gives the best value for the price. So the platform needs to serve both: instant lookup AND deep, customizable analysis.

**D-UX:** That tells me we need two distinct user flows. The first is a **rapid retrieval flow** — global search, autocomplete, instant player cards with headline stats front and centre. The second is a **deep analysis flow** — a workspace where users build custom comparisons at their own pace. These two flows should never interfere with each other. The search should be accessible from every single page, and the workspace should be its own dedicated environment.

**D-GFX:** From a visual identity standpoint, you mentioned broadcast-grade. That means we are not designing a consumer sports website. We are designing something closer to a Bloomberg Terminal for cricket — information-dense, but not cluttered. Clean typography, disciplined colour usage, high contrast for readability under studio lighting, and every visualisation needs to be screenshot-ready because these will end up on television.

**C:** Exactly. And every team in the IPL has its own identity — Chennai Super Kings are yellow, Mumbai Indians are blue, Royal Challengers Bengaluru are red. When you are looking at a team's page, I want the page to feel like that team. The colours should adapt.

**D-GFX:** Dynamic theming per team. That is achievable. We will define a colour palette for each of the 10 current franchises and any defunct teams, then apply those as CSS custom properties when a team context is active. The base design system remains consistent — the accent colours shift.

**D-UX:** Let me walk through the core modules I am hearing from you, and you tell me if I have missed anything:

1. **Home Page** — Dashboard with season highlights, quick stats, global search
2. **Players** — Search, filters, detailed profiles with 184+ stat fields, phase-wise analysis, head-to-head matchups, auction history, ICC-calibrated ratings
3. **Player Ratings** — A dedicated leaderboard page with historical ratings from 2008
4. **Analytics Workspace** — Blank canvas, add unlimited players, dynamic comparisons, save/share/export
5. **Teams** — Franchise profiles with management, coaching staff, sponsors, squads per season
6. **Matches** — Every match with full scorecards, ball-by-ball data, match analysis
7. **Seasons** — Season-by-season overview, points tables, winners
8. **Auctions** — Every auction's complete proceedings, player sale data, highlights
9. **Venues** — Ground profiles, pitch analysis, historical outcomes
10. **Records** — Orange Cap race, Purple Cap race, game-changers, thrillers, highest/lowest scores
11. **Sponsors** — IPL-level and team-level sponsor data with financials
12. **Education** — How to calculate cricket statistics, DLS method explainer with interactive calculator

**C:** You have got it all. One critical detail — for players who later became coaches (like Ricky Ponting playing and then coaching Delhi Capitals), I want BOTH profiles on the same page with a toggle. Player stats and coach stats must NEVER mix. And the Orange Cap and Purple Cap are not just about the final winner — I want the entire race tracked match by match through the season. Who was leading after match 5? When did the lead change? That is the story I want to tell.

**D-UX:** Understood. The dual-role toggle is a UI pattern we can handle with a segmented control at the top of the profile. And the cap race — that is a narrative visualization. We will design it as an animated progression chart with a timeline scrubber. Users should be able to "replay" the season and watch the race unfold.

**C:** That is exactly what I want.

---

---

# ACT 2: DESIGN TEAM INTERNAL DISCUSSION

## Scene: UI/UX and Graphic Designers Collaborate on the Design System

---

### 2.1 — Establishing the Design Philosophy

**D-UX:** Now that we have the full picture from the customer, let us establish our design philosophy before we touch a single wireframe. This platform serves three types of users: broadcast analysts who need speed, franchise analysts who need depth, and officials who need clarity. The design must balance information density with navigability. I am proposing we follow a principle I call **"Progressive Disclosure with Zero Dead Ends."**

**D-GFX:** Explain that.

**D-UX:** Every page starts with the most critical information visible immediately — no scrolling, no clicking required. A player's page shows their photo, name, team, role, rating badge, and headline stats (matches, runs, average, strike rate, wickets, economy, catches) right in the header. That is the 15-second broadcast lookup satisfied. But for the franchise analyst who needs more, every section expands. Tabs reveal phase-wise breakdowns, situational splits, head-to-head matchups. The information is there, but it does not overwhelm on first glance. And "zero dead ends" means every data point is interactive — clicking a team name takes you to that team, clicking a bowler in a head-to-head table takes you to that bowler's profile. The platform should feel like hyperlinked knowledge.

**D-GFX:** I agree. From the visual side, I am proposing we build on three pillars:

1. **Typographic hierarchy** — We need at least five clearly distinct heading levels. Numbers (stats) should use a tabular-lining font so that columns of figures align perfectly. We will use a system font stack for body text (fast loading, native feel) and a display font for headings that conveys authority — something geometric and modern.

2. **Colour as information** — Colour should never be purely decorative. Every colour communicates: green means improvement or above average, red means decline or below average, gold means Orange Cap, purple means Purple Cap, the team's primary colour means team context. We define a semantic colour palette first, then map team palettes on top.

3. **Data visualisation as first-class design** — Charts are not afterthoughts. Every chart gets the same design attention as every page layout. Consistent axis styling, consistent tooltip design, consistent legend placement. The radar chart, the line chart, the bar chart, the scatter plot — they all feel like they belong to the same family.

**D-UX:** Perfect. Let me now walk through each module and define the interaction design. You tell me where visual decisions need to be made.

---

### 2.2 — Navigation Architecture

**D-UX:** The primary navigation will be a horizontal top navbar with the following items:

```
Home | Seasons | Teams | Players | Matches | Ratings | Analytics Lab | Auctions | Venues | Records | Sponsors | Learn Cricket Stats
```

This gives us 12 top-level destinations. That is on the upper limit for a horizontal nav, so we will group "Learn Cricket Stats" and "Sponsors" into a "More" dropdown on smaller screens. On mobile, this becomes a slide-out drawer menu.

The navbar will also contain:
- A **global search bar** (always visible, centre-aligned on desktop)
- A **dark/light mode toggle** (top right)
- The platform logo (top left, clickable to Home)

**D-GFX:** For the logo, the customer wants broadcast-grade. I will design a wordmark-style logo — clean, geometric, no gimmicks. The word "IPL Analytics" with a subtle data-line motif integrated into the letterforms. Two versions: horizontal for the navbar, stacked for mobile.

**D-UX:** Every page will also have **breadcrumbs** below the navbar for deep navigation context:

```
Home > Teams > Chennai Super Kings > Squad 2024
Home > Players > Virat Kohli > Head-to-Head > Jasprit Bumrah
```

This is critical for a data-dense platform. Users will go deep into nested views and need a way back.

---

### 2.3 — Home Page Design

**D-UX:** The Home Page is the gateway. It needs to do four things:

1. **Orient the user** — Show what this platform is and what it offers
2. **Highlight the latest** — Current or most recent season's key moments
3. **Enable instant search** — The global search bar should be prominent, hero-level
4. **Showcase depth** — Animated counter cards showing total matches (1000+), total players (500+), total sixes, total balls bowled — these numbers communicate scale

Layout:
- **Hero section**: Full-width, dynamic imagery from the latest IPL season. A large search bar overlaid: "Search players, teams, matches, venues…" with real-time autocomplete dropdown. Below the search bar, quick filter chips: "Top Batters", "Top Bowlers", "Latest Season", "Records".
- **Quick stats row**: Four animated counter cards — Total Matches, Total Players, Total Sixes, Total Seasons. These count up on scroll with a smooth animation.
- **Season grid**: Cards for each IPL season (2008-present), most recent first. Each card shows the season year, winner team logo, runner-up team logo, Orange Cap and Purple Cap holder names. Clicking a card navigates to the Season Detail page.
- **Featured records**: A highlight reel section — Orange Cap holder card, Purple Cap holder card, game-changer of the season, most thrilling match. Visually prominent, with player photos and key stats.
- **Footer**: Navigation links, data source attributions, disclaimer.

**D-GFX:** For the hero section, I want to avoid stock cricket photos. Instead, I will create a generative background — a subtle data visualization pattern (like a pitch map or wagon wheel) rendered as an abstract background graphic. This reinforces the analytics identity. The counter cards will use a bold mono-spaced font for the numbers and a subtle gradient border that pulses on animation completion.

---

### 2.4 — Player Module Design

**D-UX:** This is the most complex module and the heart of the platform. Let me break it down into sub-flows.

#### Player List Page

**D-UX:** The Player List Page has two zones:

**Zone 1 — Search & Filters (Left sidebar or top bar):**
- A search input with real-time autocomplete. As the user types, a dropdown appears showing matching players with their photo, name, role, and team logo. This is not a full page search — it is a quick navigation tool. The user can click a suggestion to go directly to that player's profile.
- Below the search input, a collapsible filter panel with these filter groups:
  - **Country/Nationality**: Multi-select dropdown with flags (India, Australia, England, South Africa, New Zealand, West Indies, Afghanistan, Sri Lanka, Bangladesh, etc.)
  - **Player Role**: Batter, Bowler, All-rounder, Wicketkeeper-Batter — radio buttons or chips
  - **Batting Style**: Right-hand bat, Left-hand bat — toggle or chips
  - **Bowling Arm**: Right-arm, Left-arm — toggle or chips
  - **Bowling Variety**: Fast, Medium, Off-spin, Leg-spin, Left-arm orthodox, Left-arm wrist spin — multi-select
  - **IPL Team**: All franchise logos as selectable chips, with a toggle for "Current team" vs "Ever played for"
  - **Status**: Active, Retired, Unsold — chips
  - **Nationality Type**: Domestic, Overseas — toggle
- All filters combine with AND logic. When filters are active, a badge count appears on the filter icon, and active filter tags appear above the results grid with an "X" to remove each one and a "Clear All" button.

**Zone 2 — Results Grid:**
- A responsive grid of player cards, or a switchable table view (grid icon / table icon toggle)
- Each player card shows: photo, name, nationality flag, primary role badge, current team logo, and one headline stat (runs for batters, wickets for bowlers, a combined badge for all-rounders)
- Sorting: by name (A-Z), by runs (high-low), by wickets (high-low), by matches (high-low)
- Pagination at the bottom, or infinite scroll
- **The filter selections persist in the URL as query parameters.** This means if a user filters for "Left-arm, Spin, Afghanistan" and copies the URL, anyone opening that URL will see the exact same filtered view. This is critical for shareability.

**D-GFX:** For the player cards, I want a clean, card-based design with a subtle elevation shadow. The player photo should be circular, centred at the top. Below it, the name in medium-weight text, the role as a small coloured badge (blue for Batter, green for Bowler, orange for All-rounder, purple for Wicketkeeper), and the team logo small in the corner. When hovered, the card elevates slightly and the primary stat number scales up — a micro-interaction that rewards exploration.

For the table view, we use the ShadCN Data Table component. It must support column sorting (click the header to sort), column resizing, and a zebra-stripe pattern for readability. Numbers must be right-aligned in their columns.

---

#### Player Detail Page

**D-UX:** This is the crown jewel of the platform. A single player's page needs to present up to 184 statistical fields without overwhelming the user. Here is how we structure it:

**Header Section (always visible, no scrolling needed):**
- Left: Player photo (large, high-quality), nationality flag overlay
- Centre: Player name (large heading), playing role badge, batting/bowling style labels, IPL debut date, last match date, list of team logos they have played for
- Right: **IPL Rating Badge** — a prominent circular or shield-shaped badge showing their current rating (0-1000) with a colour-coded background:
  - 900-1000: Gold badge, "All-Time Great"
  - 750-899: Purple badge, "World Class"
  - 600-749: Blue badge, "Excellent"
  - 450-599: Green badge, "Good"
  - 300-449: Yellow badge, "Average"
  - 0-299: Grey badge, "Below Average"
- Below the rating: Current rank with a movement arrow (▲ green, ▼ red, ● grey for stable), and a mini sparkline showing the last 10 matches' rating trend
- For retired players: The badge shows "Peak Rating" instead of current, with "Retired" label and the peak season noted

**D-GFX:** The rating badge needs to be iconic. I will design it as a hexagonal shield — think of it like a FIFA card rating but for cricket. The hexagon is a strong geometric shape that stands out. The background colour fills the hexagon based on the tier. Inside: the number in a bold display font at the centre, the tier label below it in smaller text. For the rank movement indicator, I will use a custom arrow icon — an upward-pointing chevron for improvement (filled green), downward for decline (filled red), and a horizontal line for stable (grey). The sparkline will be a tiny line chart rendered inline, no axes, just the trend line — if upward, it is green; if downward, red.

**D-UX:** Below the header, we have a **dual-role toggle** (only visible if the player is also a coach):

```
[Player Profile] | [Coach Profile]
```

This is a segmented control — two buttons, one active. Clicking "Coach Profile" replaces ALL content below with coach-specific information. The header remains the same (same person, after all).

**Under the Player Profile view:**

**Global Filter Bar:**
- Two dropdowns: "Filter by Team" and "Filter by Season"
- When a user selects a team (e.g., "Royal Challengers Bengaluru"), ALL stats on the entire page recalculate to show only RCB performance
- When a user selects a season (e.g., "2023"), ALL stats show only that season
- When both are selected, stats show that specific team + season combination
- A "Reset to Overall" button clears both filters
- This filter bar is **sticky** — it stays visible as the user scrolls down

**Content Sections (tabbed navigation within the page):**

I am organizing the deep stats into a tab system to avoid a 50-screen-long scroll:

**Tab 1: Overview**
- Bio section: Full name, DOB, age, nationality, born in, playing role, batting/bowling style, IPL debut, last match, teams played for, jersey numbers
- Strengths & Weaknesses: Visual cards, strengths in green-tinted cards, weaknesses in amber-tinted cards
- Core Stats Dashboard: Six StatCards in a grid — Matches, Runs, Average, Strike Rate, Wickets, Economy. Each card shows the number prominently with a small trend indicator vs previous season
- Radar Chart: A pentagon/hexagon radar showing the player's relative strength across 5-6 dimensions (Power Hitting, Consistency, Death Bowling, Powerplay Performance, Fielding, Clutch Performance). This gives an instant visual profile

**Tab 2: Batting Deep Dive**
- Sub-tabs within this tab:
  - **Core Numbers**: Innings, not outs, runs, balls faced, highest score, average, strike rate, 100s, 50s, 30s, ducks, golden ducks, 4s, 6s, boundary %, dot ball %, singles %
  - **Phase-wise**: Three-column layout — Powerplay (Overs 1-6), Middle (Overs 7-15), Death (Overs 16-20). Each column shows runs, average, strike rate for that phase. Also rendered as a grouped bar chart for visual comparison
  - **Situational**: Batting first vs Chasing — side-by-side stat blocks. In Wins vs In Losses — another side-by-side. These help analysts understand pressure performance
  - **vs Bowling Type**: Stats against pace, spin, left-arm, right-arm. Rendered as both a table and a horizontal bar chart
  - **Dismissal Analysis**: A doughnut/pie chart showing the percentage breakdown of how this player gets out — caught, bowled, LBW, run out, stumped, hit wicket, caught & bowled. Below the chart, a callout: "Most dismissed by: [Bowler Name] ([count] times)" — clickable to the bowler's profile
  - **By Batting Position**: Stats when batting as opener, at #3, in the middle order (4-5), in the lower order (6-7), as a finisher (6-8). A table with each position as a row
  - **Milestones & Streaks**: Fastest fifty (balls), fastest century (balls), longest run streak of 30+/40+/50+/100+ scores, most consecutive 50s, best season tally, best match score

**Tab 3: Bowling Deep Dive**
- Same sub-tab structure as batting:
  - **Core Numbers**: Overs, balls, runs conceded, wickets, average, economy, strike rate, best bowling, 3W/4W/5W hauls, maidens, dot balls, dot %, wides, no balls, extras, 4s/6s conceded, boundary %
  - **Phase-wise**: Powerplay/Middle/Death wickets, economy, strike rate — three-column layout + grouped bar chart
  - **Situational**: Defending (team batted first) vs Bowling First (team chasing). In Wins vs Losses
  - **vs Batter Type**: Wickets and economy against right-handers vs left-handers
  - **Wicket Types**: Doughnut chart — bowled, caught outfield, caught behind, caught & bowled, LBW, stumped, hit wicket. Callout: "Most dismissed batter: [Name] ([count] times)"
  - **Milestones**: Best season, best match, best economy in a match, consecutive wicket-taking matches, most dot balls in a match

**Tab 4: Fielding**
- Table: Catches total, outfield catches, slip/close catches, dropped catches, direct hit run outs, assisted run outs, total run outs, stumpings (WK), catches as WK, total dismissals as WK, best match, best season

**Tab 5: All-Rounder** (visible only if the player qualifies)
- All-rounder rating, matches with 30+ runs & 2+ wickets, Player of the Match awards, win contribution index

**Tab 6: Impact & Advanced**
- MVP rating per season (table + line chart over seasons), clutch performance index, playoff/finals stats breakdown, death-over specialist rating, powerplay specialist rating, average partnership, highest partnership, boundary count per innings

**Tab 7: Head-to-Head Explorer**
- An interactive search: "Select a bowler, batter, team, or venue to see head-to-head stats"
- Four sub-sections:
  - vs Specific Bowler: Search and select a bowler → shows runs scored, balls faced, strike rate, dismissals, boundaries against that specific bowler
  - vs Specific Batter (for bowlers): Search and select a batter → shows wickets, runs conceded, economy, dot balls against that batter
  - vs Specific Team: Select a team → full batting/bowling stats against that franchise
  - vs Specific Venue: Select a venue → full stats at that ground

**Tab 8: Ratings & Rankings**
- For active players:
  - Current Batting / Bowling / All-Rounder / Fielding ratings (four badges in a row)
  - Career timeline chart: A line graph from debut to today, showing rating movement match by match. Hover over any point to see the exact rating and which match it was after
  - Season-end snapshots: A table showing the player's rating and rank at the end of each season they played
  - "How is this calculated?" — An expandable section explaining the methodology
- For retired players:
  - Peak Batting / Bowling / All-Rounder ratings with "Peak" label
  - Peak rank and the season it was achieved
  - Final rating (at last IPL match)
  - Career timeline chart from debut to last match
  - "Retired" badge — no current rank shown

**Tab 9: Auction History**
- A visual timeline: Each node represents an auction. The node shows the year, base price, sold price, buying team logo, and whether RTM was used. Connected by a timeline line. If the player went unsold, the node is greyed out with "Unsold" label

**Tab 10: Team-wise Performance**
- Tabs for each franchise the player has represented. Clicking a team tab filters all stats to that team (equivalent to using the global team filter, but more discoverable)

**D-GFX:** For the tab system, I recommend using ShadCN's Tabs component — clean underline-style tabs, not boxed tabs. The active tab gets a bold underline in the platform's accent colour. For sub-tabs (within Batting/Bowling), we use a secondary tab bar in a lighter style — pill-shaped tabs. This creates a clear visual hierarchy: primary tabs are underlined, secondary tabs are pills.

For the radar chart on the Overview tab, I will design a custom colour scheme: the radar area fill uses a semi-transparent version of the player's current team's primary colour. The radar axes are labelled in a circular pattern around the chart. This makes the chart feel personalized to the player's franchise.

For the dismissal doughnut chart, each segment gets a distinct colour from our semantic palette — caught is the most common so it gets the most prominent colour. The centre of the doughnut shows the total dismissals count.

**D-UX:** One more critical detail on the Player Detail page — the **Coach Profile View** (when the dual-role toggle is active):
- Coaching bio & philosophy
- Tenures: A timeline showing which teams and which seasons, with role (Head Coach, Batting Coach, etc.)
- Per-tenure stats: Matches coached, wins, losses, no results, win percentage
- Achievements as coach
- Strategy & impact analysis (text content)

This view completely replaces the player tabs. It is a separate universe of information.

---

### 2.5 — Ratings Page Design

**D-UX:** The Ratings Page is the IPL equivalent of the ICC Rankings page. It is a **leaderboard**.

Layout:
- **Hero banner**: "IPL Player Ratings — Powered by ICC-Calibrated Algorithm" — establishes credibility
- **Category tabs**: `Batting` | `Bowling` | `All-Rounder` | `Fielding` — switching tabs loads the leaderboard for that discipline
- **Filter bar**: Dropdowns for Nationality (India / Overseas / specific country), Team (franchise filter), Season (view historical end-of-season rankings), Role, and View (Active / All-Time / Retired)
- **Leaderboard table**: Columns — Rank, Movement (arrow), Player Photo, Player Name, Current Team Logo, Rating (0-1000), Career Best Rating, Trend Sparkline. Rows are clickable → navigates to player profile

**D-GFX:** The leaderboard table needs to feel authoritative. I will use a dark-header table style — the header row in a dark background with light text. The rank column uses a bold, large number. The top 3 rows get a subtle gold/silver/bronze tint on the left border. The rating number in each row uses the colour coding from the tier system (gold for 900+, purple for 750+, etc.). The trend sparkline is a tiny 50px-wide line chart, no axes, just the trend — same green/red colouring as discussed.

---

### 2.6 — Analytics Workspace Design

**D-UX:** This is the most innovative feature of the platform. It is a blank canvas that the user populates with their own analysis.

**Empty State:**
- A clean, mostly white/dark canvas with a large search bar in the centre: "Add players to start your analysis"
- Helper text: "Search and add any number of players to build custom comparisons, charts, and exports"
- Subtle icon illustrations of charts and tables in the background, very light, almost watermark-like

**After Adding Players:**
As players are added (shown as removable chips/tags below the search bar), the following sections dynamically appear:

1. **Comparison Table**: A horizontal table with player names as column headers and stat categories as rows. Stats include: Matches, Innings, Runs, Average, Strike Rate, 50s, 100s, Wickets, Economy, Bowling Average, Catches. If more than 4-5 players, the table scrolls horizontally with the stat labels column frozen

2. **Overlaid Radar Chart**: All players on one radar chart. Each player gets a distinct colour (matched to their current team if possible, otherwise from a sequential palette). Semi-transparent fills so overlapping areas are visible. Legend below showing player name + colour

3. **Career Progression Graph**: Multi-line chart — X-axis is seasons (or matches), Y-axis is runs/wickets/rating (toggleable). Each player is a line. Shows career arcs side by side

4. **Scatter Plot**: Configurable — user picks X-axis metric and Y-axis metric from dropdowns (e.g., Batting Average vs Strike Rate). Each player is a labelled dot. Quadrant lines can be toggled to show above/below average zones

5. **Phase-wise Comparison**: Grouped bar chart — three groups (Powerplay, Middle, Death), within each group one bar per player. Colour-coded by player

6. **Head-to-Head Matrix**: If any two players in the workspace have faced each other (batter vs bowler), show their direct matchup stats in a matrix table

**Filter Bar (applies globally to workspace):**
- Season range slider (e.g., 2020–2026)
- Team filter
- Venue filter
- Match phase filter (Powerplay / Middle / Death / All)

**Actions:**
- **Save**: Name the workspace and save to browser localStorage
- **Load**: Dropdown showing previously saved workspaces
- **Share**: Generate a URL with player IDs and filter state encoded as query parameters
- **Export**: Download all visualisations as a PNG image, or the comparison data as a CSV file

**D-GFX:** The workspace needs to feel like a professional tool — think Figma or Notion. Clean, minimal chrome. The sections should be in cards with subtle borders, and the user should be able to potentially reorder or collapse sections (though that is a stretch goal). The empty state illustration should be custom — I will draw a stylised cricket analytics illustration with abstract chart shapes and cricket silhouettes, rendered in the platform's muted accent palette.

---

### 2.7 — Orange Cap & Purple Cap Race Design

**D-UX:** This lives within the Records Page under the "Orange Cap" and "Purple Cap" tabs. It has five visual components:

1. **Cap Race Leaderboard**: A table for the selected season showing: Rank, Player Name, Team Logo, Cumulative Runs (Orange) or Wickets (Purple), Matches Played, Supporting Stat (Strike Rate for Orange, Economy for Purple). The rank-1 player has a highlighted row with a golden (Orange Cap) or purple (Purple Cap) glow/badge on their row.

2. **Cap Race Progression Chart**: This is the hero visual. A multi-line chart where the X-axis is "Match Number in Season" (1, 2, 3, ... up to 74) and the Y-axis is cumulative runs/wickets. Each line represents one of the top 5 contenders, colour-coded by their franchise. As the lines cross each other, that represents a lead change — visually showing when one player overtook another for the cap. Hovering on any point shows a tooltip: "After Match 23: [Player Name] — 342 runs (SR 145.2)".

3. **Match Slider/Scrubber**: A horizontal range slider below the chart. The user drags it to any match number, and the leaderboard above updates to show the standings as they were after that specific match. This is the "time travel" feature.

4. **Cap Holder Timeline**: A horizontal bar/strip below the scrubber. It is divided into segments, each segment representing one match. The segment's colour corresponds to the player who held the cap after that match. This creates a visual ribbon showing lead changes — if one player dominated, their colour fills most of the bar; if it was contested, you see many colour changes.

5. **Final Winner Card**: At the bottom, a prominent card with the season's official cap winner — their photo, total runs/wickets, matches played, team, and the gold/purple cap icon.

**D-GFX:** The progression chart needs to feel alive. I want the lines to have a subtle animated draw-in effect when the season is first selected — like the race is being replayed. The franchise colours on the lines should be vibrant but not clashing. I will ensure the top 5 franchise colours used in any given season chart have enough contrast to be distinguishable. The cap holder timeline ribbon will use those same colours with a thin white gap between segments for clarity. The final winner card gets a premium treatment — a subtle gold gradient border for Orange Cap, a purple gradient for Purple Cap.

---

### 2.8 — Team, Match, Season, Auction, Venue, Sponsor, and Education Page Designs

**D-UX:** Let me cover the remaining pages more concisely:

**Team Detail Page:**
- Banner: Full-width, team colour gradient with logo centred
- Tabs: Overview | Squad | Management | Coaches | Sponsors | Stats | Matches
- Season selector dropdown affects all tabs
- Squad tab shows player cards in a grid (similar to Player List but scoped to the team)
- Management tab shows a hierarchy — Owner at top, CEO, Directors, Managers in a tree/org-chart layout
- Coaches tab shows coaching staff cards with role labels, each clickable to the coach's profile

**Match Detail Page:**
- Header: Two team logos flanking the score (Team A score — Team B score), result text, date, venue
- Full Scorecard: Three expandable sections — Batting Scorecard, Bowling Scorecard, Fielding Scorecard. Each uses ShadCN Data Table
- Match Timeline: A vertical timeline of key moments — wickets, milestones (50s, 100s), strategic timeouts, rain breaks. Each node shows the over number and what happened
- Analysis Section: Text-based, covering turning points and standout performances
- Venue & Pitch Conditions: Cards showing pitch type, weather, dew factor, toss advantage

**Season Detail Page:**
- Hero: Season year, title sponsor logo, winner/runner-up team logos
- Points Table: A clean, sortable table with team logos, matches, wins, losses, NRR, points
- Orange/Purple Cap winner spotlight
- Player of Tournament
- List of matches (clickable to Match Detail)

**Auction Detail Page:**
- Header: Year, auction type (Mega/Mini/Mid-season), location, auctioneer
- Summary stats: Total players sold, total spend, most expensive player
- Player table: Sortable by sold price, base price, team, status (Sold/Unsold/RTM). Players with bidding wars get a flame icon
- Highlights section: Narrative text blocks describing notable moments

**Venue Detail Page:**
- Hero image of the ground
- Info cards: Capacity, city, pitch type, pace/spin friendliness ratings (as horizontal bar indicators)
- Stats: Average first-innings score, average second-innings score, win % batting first vs chasing, toss decision trends
- Match list: All matches played at this venue

**Sponsors Page:**
- IPL-level sponsors grouped by season
- Team-level sponsors grouped by franchise
- Financial insights where available (profits, losses, deal values)
- Sponsor logos displayed prominently

**Education Page:**
- Accordion layout: Each formula gets its own expandable section
- Inside each: The formula, a plain-English explanation, an example calculation with IPL data
- Interactive calculator: Input fields where users enter values (runs, balls faced, etc.) and the calculated result appears live
- DLS Method: A dedicated sub-section with step-by-step explanation and a DLS calculator

**D-GFX:** Across all these pages, I will maintain the design system consistency — same card styles, same table styles, same colour usage, same typography hierarchy. The team pages will use dynamic team colours as accents. Auction pages will use a financial/auction aesthetic — slightly more corporate, with a gavel icon motif. The Education page will use a softer, more instructional tone — wider line spacing, more whitespace, friendly illustrations of cricket scenarios.

---

### 2.9 — Mobile-First Responsive Design & Dark Mode

**D-UX:** This platform follows a **mobile-first design methodology**. That is not a buzzword — it means every wireframe I draw starts with a 375px-wide mobile screen. I design the mobile layout first, then expand outward to tablet and desktop. The reason is fundamental: it is far easier to add elements and spread out on a larger screen than it is to cram a desktop layout into a phone. Starting mobile-first forces us to prioritise — what is the single most important piece of information on this screen? That goes front and centre. Everything else is progressive enhancement.

**D-GFX:** And from a visual standpoint, mobile-first means our design tokens — font sizes, spacing, card sizes, tap targets — are defined for mobile as the baseline. We then scale them up at each breakpoint. A heading that is 20px on mobile might become 24px on tablet and 28px on desktop. The proportions are designed mobile-first.

**D-UX:** Here is the complete breakpoint strategy with six tiers:

| Breakpoint | Tailwind Prefix | Width | Layout Behaviour |
|------------|----------------|-------|------------------|
| **Base (Mobile)** | *(none — default)* | < 640px | Single-column layout. Navigation: hamburger icon with ShadCN Sheet slide-out drawer from the left. Search bar: full-width at the top of the page. Cards: stacked vertically, full-width. Data tables: transformed into vertical card layouts — each table row becomes a card with label-value pairs (no horizontal scrolling of dense tables). Charts: full viewport width, simplified axis labels (abbreviated or hidden), enlarged touch areas for tooltips. Tabs: horizontally scrollable if they overflow, with a scroll indicator. Modals/dialogs: render as full-screen bottom sheets (ShadCN Sheet from bottom). Filter panel: full-screen overlay triggered by a floating action button (FAB) fixed at bottom-right. Touch targets: minimum 44x44px on ALL interactive elements. Font: base 16px (prevents iOS auto-zoom on input focus). Action bars: sticky at bottom of viewport for key actions (Save, Export, Share). |
| **sm** | `sm:` | ≥ 640px | Minor adjustments — two-column grid for small cards (season cards, sponsor cards). Slightly increased spacing. |
| **md (Tablet)** | `md:` | ≥ 768px | Two-column grids for player/team/match cards. Filter panel: collapsible slide-out drawer (ShadCN Sheet) triggered by a filter icon button, not the FAB. Data tables: horizontal layout restored with frozen first column and horizontal scroll. Side-by-side stat blocks (e.g., "Batting First" vs "Chasing" shown in two columns). Charts: can render at half-width in two-column layouts. Navigation: still hamburger drawer (not enough room for full nav). |
| **lg (Desktop)** | `lg:` | ≥ 1024px | Full horizontal navbar visible (no hamburger). Filter sidebar visible by default alongside the results grid. Three/four-column grids for player and team cards. Data tables: all columns visible, no horizontal scroll for standard tables. Charts at optimal width within content area. Player Detail page: tabs fully visible (no horizontal scroll). |
| **xl (Large Desktop)** | `xl:` | ≥ 1280px | Maximum content width (1280px) centred with balanced margins. Multi-panel layouts — e.g., Player List page shows the list on the left and a preview panel on the right when a player is hovered/selected. Increased whitespace for breathing room. |
| **2xl (Ultra-wide)** | `2xl:` | ≥ 1536px | Dashboard-style multi-column views for the Analytics Workspace. Comparison table and charts can render side-by-side. Maximum use of screen real estate. |

**D-UX:** Now let me walk through the mobile adaptations for every major page:

**Home Page (Mobile):**
- Hero section: Single-column stack. Search bar full-width. Background image cropped tighter for portrait orientation.
- Counter cards: 2x2 grid (instead of 4-column row).
- Season grid: Vertical scrollable list of season cards (instead of multi-column grid).
- Featured records: Horizontally swipeable carousel of record cards (Orange Cap, Purple Cap, etc.) — swipe to see next card.

**Player List Page (Mobile):**
- Search bar at the top, full-width.
- Filter FAB (floating action button) fixed at bottom-right corner with a badge showing active filter count. Tapping opens a full-screen filter drawer from the bottom.
- Results: Single-column card list. Each card shows player photo, name, role badge, team logo, one headline stat.
- No table view on mobile — card view only. Table view toggle only appears at md+ breakpoints.

**Player Detail Page (Mobile):**
- Header: Player photo centred above their name (stacked layout instead of side-by-side). Rating badge below the name. Team logos as small icons in a row.
- Tab bar: Horizontally scrollable. The active tab is centred. A subtle gradient fade on the edges indicates more tabs are available.
- Stat cards: Single-column stack (instead of 2x3 grid).
- Phase-wise bar charts: Stacked vertical layout (Powerplay, then Middle, then Death as separate sections) instead of grouped side-by-side bars.
- Dismissal doughnut chart: Full-width with legend below (not beside) the chart.
- Radar chart: Full viewport width with labels repositioned for mobile readability.
- Head-to-Head explorer: Search field full-width. Results in card format.
- Auction timeline: Vertical timeline (naturally mobile-friendly — already works well).

**Ratings Leaderboard (Mobile):**
- Each player row becomes a card: large rank number on the left, player photo + name in the centre, rating badge on the right, trend sparkline below.
- Filter dropdowns stack vertically at the top (instead of horizontal row).
- Category tabs (Batting/Bowling/All-Rounder/Fielding) are horizontally scrollable.

**Analytics Workspace (Mobile):**
- "Add Players" search bar full-width at the top.
- Selected players shown as a horizontally scrollable row of avatar chips.
- Comparison table: Scrolls horizontally with frozen player-name column. Each stat row is tappable to expand for details.
- Charts stack vertically: Radar chart → Career graph → Scatter plot → Phase-wise comparison (each at full width).
- Save/Load/Share/Export actions in a bottom action bar.

**Cap Race (Mobile):**
- Season selector dropdown full-width at the top.
- Leaderboard: Card-based layout — each player is a card showing rank, name, team logo, cumulative runs/wickets.
- Progression chart: Full viewport width. Lines are thicker for touch visibility. Tooltip triggered by tap-and-hold on any point.
- Match scrubber: Full-width slider with enlarged thumb (24px minimum) for touch accuracy.
- Cap holder timeline ribbon: Full-width, segments are taller (for touch readability).

**Match Detail (Mobile):**
- Header: Team logos stacked vertically with scores between them (instead of side-by-side).
- Scorecard tables: Each batter/bowler becomes a card — name on top, stats below as label-value pairs. No horizontal table scroll needed.
- Match timeline: Vertical timeline (already mobile-friendly).

**D-GFX:** One critical visual consideration for mobile: we need to ensure all our colour-coded elements (rating badges, team colours, chart lines) maintain sufficient contrast on smaller screens, especially in bright outdoor lighting conditions (an analyst checking stats at a stadium). I will test all colour combinations against WCAG 2.1 Level AA (4.5:1 contrast ratio for normal text, 3:1 for large text) at every breakpoint.

**D-UX:** And touch interactions — this is critical:
- **No hover-only interactions.** Anything that triggers on hover (tooltips, preview cards, dropdown menus) must ALSO be accessible via tap/click on touch devices.
- **Swipe gestures**: Tab switching supports horizontal swipe on mobile. Sheet drawers support swipe-to-dismiss.
- **Long-press**: Chart data points show their tooltip on long-press (since there is no hover on touch).
- **Pull-to-refresh**: List pages (Players, Matches, Teams) support pull-to-refresh to manually refetch data.
- **Scroll snap**: Horizontally scrollable sections (season cards, workspace player chips) use CSS scroll-snap for satisfying, predictable scrolling.

**D-GFX:** For dark mode, I will design the entire colour system with both light and dark variants using CSS custom properties. Dark mode is not just "invert the colours." I will define:
- Dark backgrounds: Not pure black (#000) — use a dark grey (#0a0a0a or #121212) for depth
- Card surfaces: A slightly lighter dark grey (#1e1e1e)
- Text: Off-white (#e0e0e0), not pure white (#fff) to reduce eye strain
- Accent colours remain the same across modes (team colours, rating colours)
- Chart backgrounds adapt to the mode
- The toggle between modes should animate smoothly — a 200ms transition on background and text colours

---

### 2.10 — Design Handoff Summary

**D-UX:** To summarise what we are delivering to the development team:

1. **Design System**: Colour palette (semantic + team palettes + dark/light modes), typography scale, spacing scale, border radius tokens, shadow tokens
2. **Component Library Spec**: How each ShadCN component is customised (buttons, cards, tabs, tables, badges, tooltips, dropdowns, dialogs, accordions, sheets, inputs, command palette)
3. **Page Wireframes**: Detailed wireframes for all 20+ pages with annotation
4. **Interaction Specs**: Hover states, loading states, empty states, error states, animation specifications for every interactive element
5. **Chart Design Specs**: Colour rules, axis styling, tooltip design, legend placement, responsive behaviour for every chart type (radar, line, bar, pie/doughnut, scatter, sparkline)
6. **Responsive Breakpoints**: Layout adaptations at each breakpoint for every page
7. **Iconography**: Lucide React icon selections for every UI need
8. **Accessibility Requirements**: Colour contrast ratios (minimum 4.5:1 for text), keyboard navigation paths, screen reader labels, focus indicators

**D-GFX:** And from me:

1. **Logo files**: SVG, PNG at multiple resolutions, horizontal and stacked variants, light and dark versions
2. **Custom illustrations**: Empty state illustrations for the workspace, education page illustrations, error page illustration (custom 404)
3. **Team colour definitions**: Primary, secondary, and accent colour for all 10 current franchises + historical teams
4. **Rating badge design**: The hexagonal shield in all six tier colours, exported as SVG components
5. **Cap race visual assets**: Orange Cap and Purple Cap icons, golden and purple gradient definitions
6. **Favicon and Open Graph images**: For social media link previews

---

---

# ACT 3: DESIGN TEAM PRESENTS TO CUSTOMER

## Scene: Designers walk the customer through their vision

---

**D-UX:** We have completed our design exploration and want to walk you through our approach. The core principle we are building on is **"Progressive Disclosure with Zero Dead Ends."** Every page starts with the most critical information immediately visible — a broadcast analyst can get the number they need in under 15 seconds without scrolling. But for deep analysis, every element expands to reveal layers of detail. And every data point is hyperlinked — clicking anything navigates deeper into the platform.

**C:** Show me what you mean.

**D-UX:** Take a Player Detail page — let us say Virat Kohli. The moment you land on his page, the header shows his photo, name, team logos, role, and — critically — his IPL Rating badge. Right now he is at, say, 892, which renders as a purple hexagonal badge labelled "World Class", ranked #2 with a green upward arrow, and a sparkline showing his recent rating trend. A broadcast analyst sees "Kohli, World Class, 892, trending up" in under 3 seconds.

Now, a franchise analyst preparing for the auction wants more. They scroll down and see tabs: Overview, Batting, Bowling, Fielding, All-Rounder, Impact, H2H, Ratings, Auction History, Team-wise. They click "Batting" and then "Phase-wise" — and now they see his Powerplay average vs his Death-overs strike rate, side by side with grouped bar charts. They can toggle the global filter to show only his performance for RCB or only in the 2023 season.

Then they open the H2H Explorer, search for "Jasprit Bumrah," and instantly see: Kohli has faced Bumrah 45 times, scored 52 runs at a strike rate of 115, been dismissed 4 times. That is the kind of insight that drives auction strategy.

And none of this required the analyst to leave Kohli's page. Everything is one or two clicks away.

**C:** That is exactly the depth I wanted. What about the cap race?

**D-GFX:** Let me show you. On the Records page, you select the "Orange Cap" tab and choose season 2023. You see a leaderboard — Faf du Plessis is currently in the lead with 730 runs, Shubman Gill is second with 698 runs. Faf's row has a golden glow and an Orange Cap icon. Below the leaderboard, there is a progression chart — five coloured lines (one for each of the top 5 contenders) climbing across the season. You can see that Gill was actually leading after match 40, but du Plessis overtook him after match 55. The lines crossing is the visual story of the race.

Below the chart, there is a slider. You drag it to match 30, and the leaderboard above updates to show the standings as they were after match 30 of that season. And below the slider, there is a coloured ribbon — the "Cap Holder Timeline" — showing which player held the cap after each match. If Gill held it for 20 matches and du Plessis held it for the last 30, you see Gill's team colour dominating the first portion and du Plessis's colour dominating the latter half.

**C:** Can I see this for every season since 2008?

**D-UX:** Yes. The season dropdown lets you switch between any season. The race resets each season — the chart and leaderboard reflect only that season's data. For completed seasons, the "Final Winner" card at the bottom highlights the official cap holder with their complete stats.

**C:** This is outstanding. I am happy with the direction. Let us bring in the development team.

---

---

# ACT 4: DESIGN TEAM MEETS DEVELOPMENT TEAM

## Scene: Designers present the finalised design to the developers for the first time

---

**D-UX:** We have completed the design for the IPL Analytics Platform. It is a 20+ page application with two primary user flows: rapid retrieval (global search, instant player cards) and deep analysis (analytics workspace, tabbed player profiles, cap race visualisations). We have chosen ShadCN/UI as our component library — it is built on Radix UI primitives for accessibility and Tailwind CSS for styling. Every component is copied into the project source, not installed as a dependency, so you have full control to customise. Here are the design specs, component library definitions, page wireframes, interaction specs, chart designs, and responsive breakpoints.

**DEV-LEAD:** Thank you. We have reviewed the requirements, the design specs, and the data scope. Let me tell you what we are thinking on the technical side, and then we will go module by module.

**DEV-LEAD:** We are proposing a **three-tier architecture**: a React single-page application on the frontend, a NestJS REST API on the backend, and PostgreSQL as the database. Let me explain why each layer was chosen and how it maps to your design.

---

---

# ACT 5: DEVELOPMENT TEAM INTERNAL DISCUSSION

## Scene: The development team discusses architecture and tech stack choices in detail

---

### 5.1 — Frontend Architecture

**DEV-FE:** Let me explain every technology we are using on the frontend, why we chose it, and exactly how it maps to the components the design team has specified.

---

#### React 18 with Vite 5

**DEV-FE:** We are using **React 18** as our core UI library. React uses a component-based architecture — every piece of UI on the platform (a player card, a stat table, a rating badge, a chart) is a self-contained component with its own logic and rendering. React's virtual DOM diffing algorithm means that when data changes (a user applies a filter, a leaderboard re-sorts), only the affected components re-render — the rest of the page stays untouched. This is critical for performance when displaying 184 stat fields on a player page.

React 18 specifically gives us **Concurrent Rendering** — the ability to prioritise urgent updates (like typing in the search bar) over less urgent ones (like re-rendering a large data table). When a user types "sha" in the search autocomplete, React will prioritise showing the dropdown results immediately, even if a large table on the page is still updating in the background.

We are using **Vite 5** as our build tool instead of the older Create React App (CRA) or Webpack. Here is why:

- **Instant Hot Module Replacement (HMR)**: During development, when a developer changes a component file and saves, Vite reflects the change in the browser in under 50 milliseconds. CRA with Webpack could take 2-5 seconds. Over thousands of edits across an 8-sprint project, this saves hours of developer wait time.
- **ES Module based**: Vite serves files as native ES modules during development. It does not bundle the entire application on every change — it only processes the file that changed. For a project with 100+ component files, this is dramatically faster.
- **Optimised production build**: Vite uses Rollup under the hood for production builds. It tree-shakes unused code, splits code into chunks by route (so the Auction page code does not load when the user is on the Home page), and minifies everything.
- **Configuration simplicity**: Vite requires minimal configuration. The `vite.config.js` file is typically 20 lines. Webpack configurations for a project this complex can grow to 200+ lines.

The entry point of the application is `main.jsx`, which renders the root `<App />` component. `App.jsx` wraps the application in providers (Redux store, TanStack Query client, Router) and defines the route structure.

---

#### React Router v6

**DEV-FE:** For client-side routing, we use **React Router v6**. This is what enables the user to navigate between pages (Home, Players, Player Detail, Teams, etc.) without the browser performing a full page reload. The URL changes, but only the content area re-renders — the navbar and footer persist.

Here is our route structure:

```
/                           → HomePage
/seasons                    → SeasonsListPage
/seasons/:seasonId          → SeasonDetailPage
/teams                      → TeamsListPage
/teams/:teamId              → TeamDetailPage
/players                    → PlayersListPage
/players/:playerId          → PlayerDetailPage
/matches                    → MatchesListPage (with query params for filters)
/matches/:matchId           → MatchDetailPage
/ratings                    → RatingsPage (leaderboard)
/analytics                  → AnalyticsWorkspacePage
/auctions                   → AuctionsListPage
/auctions/:auctionId        → AuctionDetailPage
/venues                     → VenuesListPage
/venues/:venueId            → VenueDetailPage
/records                    → RecordsPage (with tab state in query params)
/sponsors                   → SponsorsPage
/education                  → EducationPage
*                           → NotFoundPage (404)
```

We use **nested layouts** — there is a root layout component that renders the Navbar and Footer, and all page routes are nested inside it. This means the Navbar and Footer render once and never re-mount during navigation.

We use **lazy loading** via `React.lazy()` and `<Suspense>`:

```jsx
const PlayerDetailPage = React.lazy(() => import('./pages/PlayerDetailPage'));
```

This means the code for PlayerDetailPage is in a separate JavaScript chunk. It is only downloaded from the server when the user actually navigates to a player's page. For a platform with 20+ pages, this reduces the initial bundle size significantly — the user downloads only the code for the current page plus shared dependencies.

For route parameters (`:playerId`, `:seasonId`, etc.), React Router provides the `useParams()` hook. When a user navigates to `/players/42`, the PlayerDetailPage component reads `playerId = 42` from the URL and uses it to fetch that player's data from the API.

For filter state persistence in URLs, we use **search params** via `useSearchParams()`. When a user on the Players List page selects filters (country=India, role=Batter), the URL becomes `/players?country=India&role=Batter`. This means:
- The filter state survives page refreshes
- The filtered view can be shared via URL — copying and sending the link to a colleague shows them the exact same filtered view
- Browser back/forward navigation works correctly with filter states

---

#### Redux Toolkit 2.x (Client State Management)

**DEV-FE:** We need to distinguish between two types of state in this application:

1. **Client state** — UI preferences, theme selection (dark/light), filter selections, workspace configuration, modal open/close states. This state exists only in the browser and does not come from the server.
2. **Server state** — Player data, match scorecards, team rosters, rating leaderboards. This state comes from our API and needs to be cached, refetched, and synchronised.

For client state, we use **Redux Toolkit (RTK) 2.x**. Here is why:

Redux Toolkit simplifies Redux to a point where it is both powerful and concise. We define **slices** — self-contained units of state with their reducer logic:

**themeSlice** — Manages dark/light mode:
```
State: { mode: 'dark' | 'light' }
Actions: toggleTheme(), setTheme(mode)
```
When the user clicks the theme toggle, `toggleTheme()` is dispatched. Every component that reads `state.theme.mode` re-renders with the new value. The CSS custom properties on the `<html>` element switch, and the entire UI transitions to the new theme.

**filterSlice** — Manages player list filter selections:
```
State: { country: null, role: null, battingStyle: null, bowlingArm: null, bowlingVariety: null, team: null, teamFilter: 'current' | 'all', status: null, nationalityType: null }
Actions: setFilter(key, value), clearFilter(key), clearAllFilters()
```
When a user selects a filter, `setFilter('country', 'India')` is dispatched. The filter state updates, the URL search params sync, and TanStack Query refetches the player list with the new filter parameters.

**workspaceSlice** — Manages the Analytics Workspace state:
```
State: { selectedPlayerIds: [], filters: { seasonFrom, seasonTo, teamId, venueId, phase }, savedWorkspaces: [] }
Actions: addPlayer(id), removePlayer(id), setWorkspaceFilter(key, value), saveWorkspace(name), loadWorkspace(id)
```
This slice uses `redux-persist` to automatically save workspace state to `localStorage`. When the user closes the browser and returns, their workspace is exactly as they left it.

**uiSlice** — Manages transient UI state:
```
State: { isSearchOpen: false, activeModal: null, toasts: [] }
Actions: openSearch(), closeSearch(), showModal(name), hideModal(), addToast(message), removeToast(id)
```

Redux DevTools integration is enabled — during development, every action dispatched, every state change, and every component render can be inspected in the browser's Redux DevTools extension. This is invaluable for debugging.

---

#### TanStack Query v5 (Server State Management)

**DEV-FE:** For server state — all the data that comes from our NestJS API — we use **TanStack Query v5** (formerly React Query). This is one of the most critical technology choices in the application, and it directly impacts performance and user experience.

Here is what TanStack Query does and why we need it:

**Problem without TanStack Query:** Every time the user navigates to a player's page, we would need to make an API call to fetch that player's data. If the user navigates away and comes back, we would fetch the same data again. If the user is on the Players List and has already scrolled through 50 players' basic data, none of that is cached — visiting a player detail page and coming back would re-fetch the entire list.

**Solution with TanStack Query:**

1. **Automatic caching**: When we fetch player #42's data, TanStack Query caches it under a unique key (e.g., `['player', 42]`). If the user navigates away and comes back within a configurable time window, the cached data is returned instantly — no API call.

2. **Stale-while-revalidate**: When cached data is older than a configured "stale time" (say, 5 minutes), TanStack Query still shows the cached data immediately but silently refetches in the background. If the data has changed, the UI updates seamlessly. The user never sees a loading spinner for data they have already loaded.

3. **Automatic refetching**: TanStack Query can automatically refetch data when the browser tab regains focus, when the network reconnects, or at a set interval. For a live IPL match scenario, we could set the match scorecard to refetch every 30 seconds.

4. **Pagination support**: For the Players List page which may show 500+ players, TanStack Query supports cursor-based and offset-based pagination out of the box. It caches each page independently.

5. **Dependent queries**: On the Player Detail page, we first fetch the player's basic profile, then separately fetch their batting stats, bowling stats, fielding stats, ratings, etc. TanStack Query manages these as separate queries that can load in parallel, each with independent loading states. The UI shows data progressively — the bio appears first, stats populate as they arrive, charts render when their data is ready.

Here is how a typical query looks in a component:

```jsx
// In PlayerDetailPage.jsx
const { data: player, isLoading, error } = useQuery({
  queryKey: ['player', playerId],
  queryFn: () => playerService.getPlayer(playerId),
  staleTime: 5 * 60 * 1000, // 5 minutes
});

const { data: battingStats } = useQuery({
  queryKey: ['player', playerId, 'batting', { teamId, seasonId }],
  queryFn: () => playerStatsService.getBattingStats(playerId, { teamId, seasonId }),
  enabled: !!player, // Only fetch after player data is loaded
});
```

Notice the `queryKey` includes the filter parameters (`teamId`, `seasonId`). This means:
- Kohli's overall batting stats are cached under `['player', 42, 'batting', {}]`
- Kohli's RCB-specific batting stats are cached under `['player', 42, 'batting', { teamId: 3 }]`
- Kohli's 2023 batting stats are cached under `['player', 42, 'batting', { seasonId: 16 }]`
- Each combination is a separate cache entry. If the user toggles between "Overall" and "RCB" and back to "Overall," the data switches instantly from cache — no API calls, no loading spinners.

---

#### ShadCN/UI + Radix UI + Tailwind CSS

**DEV-FE:** For the component library, we are using **ShadCN/UI**. This is not a traditional npm package — it is a collection of component source files that are copied into our project. The command `npx shadcn-ui add button` creates a `button.tsx` file in our `components/ui/` directory. This file is now ours — we can modify it freely.

The reason this matters for our project:

1. **Full customisation**: The design team has specified precise colour tokens, border radii, shadows, and hover states. With a locked dependency (like Material UI or Ant Design), we would fight the library's opinions. With ShadCN, we own the source code and style everything exactly as the design team specified.

2. **Accessibility built-in**: Under the hood, ShadCN components use **Radix UI** primitives. Radix handles the hard parts of accessibility — keyboard navigation (Tab, Arrow keys, Enter, Escape), focus management (trapping focus inside a modal), ARIA attributes (screen reader labels, roles, live regions), and collision-aware positioning (dropdown menus that flip direction if they would overflow the screen). We get all of this for free.

3. **Tailwind CSS integration**: Every ShadCN component is styled with Tailwind CSS utility classes. This means the design team's design tokens (colours, spacing, typography) are defined in `tailwind.config.js` and automatically available in every component.

Here are the specific ShadCN components we will use and how they map to the design:

| ShadCN Component | Where It Is Used |
|---|---|
| **Button** | Every clickable action — filter apply, save workspace, export CSV, navigation |
| **Card** | Player cards, stat cards, season cards, sponsor cards, match cards |
| **Tabs** | Primary tabs on Player Detail (Overview, Batting, Bowling, etc.), Ratings category tabs, Records category tabs, Team Detail tabs |
| **Table** (Data Table) | Leaderboard table, player list table view, scorecard tables, comparison tables, auction player tables |
| **Select** | Filter dropdowns (country, role, team, season), sort controls |
| **Dialog** | Confirmation dialogs, workspace save dialog, share link dialog |
| **Dropdown Menu** | User actions menu, sort options, "More" navigation items |
| **Accordion** | Education page formula sections, "How is this calculated?" on ratings |
| **Badge** | Player role badges, rating tier labels, active filter tags, status indicators |
| **Tooltip** | Hover explanations on stat abbreviations, chart data point details |
| **Sheet** | Mobile navigation drawer, filter panel drawer on tablet/mobile |
| **Input** | Search bars, calculator inputs, workspace name input |
| **Command** | Global search autocomplete (the cmd+K style search palette) |
| **Skeleton** | Loading placeholders — shown while data is being fetched, matching the shape of the content that will appear |
| **Separator** | Visual dividers between content sections |
| **Slider** | Season range slider in workspace, match scrubber on cap race |
| **Chart** | ShadCN's chart wrapper around Recharts — consistent styling for all charts |

**Utility libraries used alongside ShadCN:**

- **tailwind-merge**: When combining Tailwind classes dynamically (e.g., a button that changes colour based on state), class conflicts can arise (both `bg-blue-500` and `bg-red-500` present). `tailwind-merge` intelligently resolves these conflicts, keeping only the last applicable class.

- **clsx**: A tiny utility for conditionally joining class names. Instead of writing string concatenation (`className={'btn ' + (isActive ? 'btn-active' : '')}`) we write `className={clsx('btn', { 'btn-active': isActive })}`. Cleaner, less error-prone.

- **class-variance-authority (cva)**: Used by ShadCN to define component variants. The Button component, for example, has variants: `default`, `destructive`, `outline`, `ghost`, `link`, and sizes: `default`, `sm`, `lg`, `icon`. CVA maps these variant names to Tailwind class combinations. When we use `<Button variant="destructive" size="sm">`, CVA resolves this to the exact Tailwind classes for a small red button.

---

#### Tailwind CSS 3.x (Mobile-First Styling System)

**DEV-FE:** Every pixel of styling in this application is handled by **Tailwind CSS**, and it is built **mobile-first from the ground up**. Tailwind is inherently a mobile-first framework — every utility class you write applies to mobile by default. Responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`, `2xl:`) add overrides for progressively larger screens. This is not optional — it is how Tailwind works, and it perfectly aligns with our design methodology.

Here is a concrete example of how mobile-first works in our component code:

```jsx
{/* Player cards grid — mobile-first */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
  {/*
    Base (mobile): 1 column
    sm (≥640px): 2 columns
    md/tablet (≥768px): 2 columns
    lg/desktop (≥1024px): 3 columns
    xl (≥1280px): 4 columns
  */}
</div>

{/* Stat cards — stack on mobile, side-by-side on tablet+ */}
<div className="flex flex-col gap-3 md:flex-row md:gap-6">
  <StatCard label="Runs" value={8004} />
  <StatCard label="Average" value={37.25} />
</div>

{/* Filter panel — hidden on mobile (FAB opens drawer), visible sidebar on desktop */}
<aside className="hidden lg:block lg:w-64">
  <FilterPanel />
</aside>
{/* Mobile filter FAB — only visible below lg breakpoint */}
<button className="fixed bottom-6 right-6 z-50 lg:hidden rounded-full bg-primary p-4 shadow-lg">
  <FilterIcon />
</button>
```

Notice: there are no `max-width` media queries. We never write "hide this on mobile." Instead, we write "show this starting from lg." That is the mobile-first mindset — mobile is the default; everything else is an enhancement.

For this project, `tailwind.config.js` is where the design team's design tokens live:

**Colour system:**
```js
colors: {
  // Semantic colours
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  card: 'hsl(var(--card))',
  'card-foreground': 'hsl(var(--card-foreground))',
  primary: 'hsl(var(--primary))',
  'primary-foreground': 'hsl(var(--primary-foreground))',
  muted: 'hsl(var(--muted))',
  accent: 'hsl(var(--accent))',
  destructive: 'hsl(var(--destructive))',

  // Rating tier colours
  'rating-great': '#FFD700',    // Gold
  'rating-world': '#8B5CF6',    // Purple
  'rating-excellent': '#3B82F6', // Blue
  'rating-good': '#22C55E',     // Green
  'rating-average': '#EAB308',  // Yellow
  'rating-below': '#6B7280',    // Grey

  // Team colours (used for dynamic theming)
  'csk': { primary: '#FFCB05', secondary: '#0081E9' },
  'mi': { primary: '#004BA0', secondary: '#D1AB3E' },
  'rcb': { primary: '#EC1C24', secondary: '#2B2A29' },
  'dc': { primary: '#004C93', secondary: '#EF1B23' },
  'kkr': { primary: '#3A225D', secondary: '#B3A123' },
  'pbks': { primary: '#ED1B24', secondary: '#A7A9AC' },
  'rr': { primary: '#EA1A85', secondary: '#254AA5' },
  'srh': { primary: '#FF822A', secondary: '#000000' },
  'gt': { primary: '#1C1C1C', secondary: '#B3C4CB' },
  'lsg': { primary: '#A72056', secondary: '#FFCC00' },
}
```

The `hsl(var(--background))` pattern is how dark/light mode works. In `global.css`, we define:

```css
:root {
  --background: 0 0% 100%;      /* White in light mode */
  --foreground: 222.2 84% 4.9%; /* Near-black text */
}

.dark {
  --background: 222.2 84% 4.9%;  /* Near-black in dark mode */
  --foreground: 210 40% 98%;     /* Off-white text */
}
```

When Redux's `themeSlice` toggles the theme, a `dark` class is added to or removed from the `<html>` element. Tailwind's `darkMode: 'class'` configuration detects this, and every `hsl(var(--background))` reference resolves to the new value. The entire UI transitions in one frame.

**Dynamic team theming** works similarly. When the user is on the CSK team page, we set CSS custom properties on the page wrapper:

```css
--team-primary: 51 100% 50%;   /* CSK Yellow */
--team-secondary: 207 100% 45%; /* CSK Blue */
```

Components that use `bg-[hsl(var(--team-primary))]` automatically adopt the team's colour.

---

#### Framer Motion 11.x (Animations)

**DEV-FE:** The design team specified broadcast-quality animations. **Framer Motion** is how we implement them. It is a React animation library that works declaratively — you describe what the animation should look like, not the individual keyframes.

Specific animations we will implement:

1. **Page transitions**: When navigating between pages, the outgoing page fades out and slides left, the incoming page fades in and slides from the right. This is implemented with Framer Motion's `<AnimatePresence>` component wrapping the router outlet:

```jsx
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    transition={{ duration: 0.2 }}
  >
    <Outlet />
  </motion.div>
</AnimatePresence>
```

2. **Counter animations on Home Page**: The stat counters (Total Matches: 1,127) count up from 0 to their final value over 1.5 seconds when they scroll into view. We use Framer Motion's `useInView` hook to detect when the counter enters the viewport, then animate from 0 to the target number.

3. **Card hover effects**: Player cards, team cards, and match cards elevate on hover. The shadow deepens and the card translates up by 4px. This is a 150ms transition.

4. **Chart draw-in animations**: The cap race progression chart lines draw in from left to right over 1 second, as if the season is being replayed. Recharts itself does not support this natively, but we can wrap chart containers in Framer Motion and animate opacity + clip-path.

5. **Tab content transitions**: When switching between tabs on the Player Detail page, the outgoing tab content fades and slides out, the incoming content fades and slides in. This prevents a jarring "jump" when tabbing between dense stat views.

6. **Loading skeleton pulse**: ShadCN's Skeleton component uses a CSS pulse animation by default. We enhance it with Framer Motion's `animate` for a smoother shimmer effect.

7. **Rating badge entrance**: When the player's page loads, the rating badge scales in from 0 to 1 with a spring physics animation — it "pops" into view. This draws the eye to the most important number.

---

#### Recharts 2.x + Chart.js 4.x (Data Visualization)

**DEV-FE:** We use two charting libraries — each for different strengths:

**Recharts 2.x** is our primary charting library. It is React-native (components, not imperative API) and integrates with ShadCN's Chart component:

- **Line charts**: Career progression graphs (rating over time, runs over seasons), cap race progression charts, trend sparklines
- **Bar charts**: Phase-wise comparison (grouped bars for Powerplay/Middle/Death), auction price comparisons, season-by-season run tallies
- **Radar charts**: Player strength profiles (Power Hitting, Consistency, Death Bowling, etc.), workspace multi-player overlaid radars
- **Area charts**: Cumulative run/wicket charts for cap races
- **Scatter plots**: Workspace Average vs Strike Rate plots with player dots

Recharts gives us built-in **tooltips** (hover any data point for details), **legends** (colour-coded player/metric labels), **responsive containers** (charts that resize with their parent), and **customisable axes** (formatted labels, grid lines, domain control).

**Chart.js 4.x + react-chartjs-2** is our secondary charting library, used specifically for:

- **Doughnut charts**: Dismissal type breakdowns (the pie-like chart showing % caught, bowled, LBW, etc.)
- **Gauge-style charts**: Where we need a semi-circular meter (e.g., a player's specialist rating from 0-100)

Chart.js excels at these specific chart types and gives us more fine-grained control over doughnut segment styling.

Every chart across the platform follows the design team's specifications:
- Consistent tooltip design (dark background, white text, rounded corners)
- Consistent axis styling (light grey grid lines, no axis lines, formatted tick labels)
- Consistent colour palette (team colours for player-specific charts, semantic colours for stat categories)
- Responsive behaviour (charts resize with their container, hide axis labels on mobile if space is tight)

---

#### TanStack Table v8 (Data Tables)

**DEV-FE:** ShadCN's Data Table component is built on **TanStack Table v8**, a headless table engine. "Headless" means it handles the logic (sorting, filtering, pagination, column resizing) but not the rendering — we control every pixel of the table's appearance via Tailwind classes.

We have approximately 15 tables in the application:

1. Players List table (sortable, filterable, paginated)
2. Ratings leaderboard table (sortable by rank/rating)
3. Batting scorecard table (match detail)
4. Bowling scorecard table (match detail)
5. Fielding scorecard table (match detail)
6. Comparison table (workspace — dynamic columns)
7. Auction players table (sortable by price/status)
8. Points table (season detail)
9. Cap race standings table
10. Team-wise stats table
11. Season-by-season stats table
12. Head-to-Head stats table
13. Venue match history table
14. Partnership history table
15. Records tables (Orange Cap, Purple Cap, etc.)

TanStack Table provides:
- **Sorting**: Click a column header to sort ascending/descending. We use server-side sorting for large datasets (player list) and client-side sorting for smaller ones (scorecard).
- **Column visibility**: Users can show/hide columns in the comparison table to focus on metrics they care about.
- **Pagination**: Configurable rows per page, with page number display and navigation.
- **Column resizing**: For wide tables like the comparison table, users can drag column borders to resize.
- **Sticky columns**: The first column (player name/rank) stays fixed while the table scrolls horizontally.

---

### 5.2 — Backend Architecture

**DEV-BE:** Now let me walk through every component of the backend architecture.

---

#### NestJS 10.x with TypeScript

**DEV-BE:** We are using **NestJS 10** — a progressive Node.js framework built with TypeScript. Let me explain why NestJS was chosen over alternatives like Express.js alone, Fastify, or Hapi:

1. **Modular architecture**: NestJS organises code into **modules**. Each domain (Players, Teams, Matches, Ratings, etc.) is a self-contained module with its own controller (HTTP route handlers), service (business logic), DTOs (data transfer objects for validation), and entities (database table definitions). This means the Players module can be developed, tested, and modified independently of the Matches module. With 12+ domain modules in this project, this isolation is essential for maintainability.

2. **Dependency Injection (DI)**: NestJS has a built-in DI container. When the `PlayersController` needs to call `PlayersService`, it does not create an instance manually — NestJS injects it automatically. When `PlayersService` needs the database repository, NestJS injects that too. This makes testing trivial — in tests, we can inject mock services instead of real ones.

3. **Decorators**: NestJS uses TypeScript decorators extensively. A controller looks like this:

```typescript
@Controller('api/players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  async findAll(@Query() query: PlayerFilterDto) {
    return this.playersService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }

  @Get(':id/stats/batting')
  async getBattingStats(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: StatFilterDto,
  ) {
    return this.playersService.getBattingStats(id, query);
  }
}
```

The `@Controller`, `@Get`, `@Query`, `@Param` decorators declaratively define routes. The `ParseIntPipe` automatically validates that `:id` is a number — if someone sends `/api/players/abc`, NestJS returns a 400 Bad Request automatically.

4. **Guards, Pipes, Interceptors, Filters**: NestJS provides a layered middleware system:
   - **Pipes** validate and transform incoming data. Our `PlayerFilterDto` uses `class-validator` decorators to ensure query parameters are valid values.
   - **Interceptors** transform outgoing data. Our `TransformInterceptor` wraps every response in a standard envelope: `{ data: ..., meta: { timestamp, statusCode } }`.
   - **Filters** catch exceptions and return standardised error responses. Our `HttpExceptionFilter` ensures all errors follow the same JSON structure: `{ statusCode, message, error, timestamp }`.

5. **TypeScript end-to-end**: Both frontend and backend use TypeScript, ensuring type safety across the entire codebase. A `Player` type definition can be shared or mirrored between frontend and backend, preventing mismatches.

---

#### Backend Module Structure

**DEV-BE:** Let me enumerate every module in the backend and its responsibility:

**players.module** — The largest module:
- `players.controller.ts` — 30+ route handlers for player profiles, stats, ratings, comparisons
- `players.service.ts` — Core player queries (find all, find one, search)
- `player-stats.service.ts` — Phase-wise, situational, positional, milestone stats. Uses TypeORM QueryBuilder to aggregate `ball_by_ball` data with GROUP BY, FILTER, and window functions
- `player-h2h.service.ts` — Head-to-head queries against specific bowlers, batters, teams, venues
- `player-rank.service.ts` — Career and season-wise rank computations
- `player-advanced.service.ts` — MVP, clutch index, win contribution calculations
- Entities: `player.entity.ts`
- DTOs: `player-filter.dto.ts`, `stat-filter.dto.ts`

**teams.module** — Team profiles, squads, management:
- Entities: `team.entity.ts`, `team-season.entity.ts`, `team-management.entity.ts`, `team-sponsor.entity.ts`

**matches.module** — Match data, scorecards:
- Entities: `match.entity.ts`, `batting-scorecard.entity.ts`, `bowling-scorecard.entity.ts`, `fielding-scorecard.entity.ts`, `ball-by-ball.entity.ts`, `partnership.entity.ts`

**coaches.module** — Coach profiles, tenures:
- Entities: `coach.entity.ts`, `coach-tenure.entity.ts`

**seasons.module** — Season overviews, points tables:
- Entity: `season.entity.ts`

**auctions.module** — Auction proceedings, player sale data:
- Entities: `auction.entity.ts`, `auction-player.entity.ts`

**venues.module** — Ground profiles, pitch analysis:
- Entities: `venue.entity.ts`, `venue-match-condition.entity.ts`

**sponsors.module** — IPL and team sponsor data:
- Entity: `ipl-sponsor.entity.ts`

**records.module** — Records (Orange/Purple Cap holders, thrillers, game-changers, highest/lowest scores):
- Entity: `record.entity.ts`

**cap-race.module** — Orange and Purple Cap race standings, progression, historical snapshots:
- `cap-race.service.ts` — Methods: `getStandings(seasonId, capType)`, `getProgression(seasonId, capType)`, `getStandingsAfterMatch(seasonId, capType, matchNumber)`, `rebuildCapRace(seasonId)`, `updateAfterMatch(matchId)`
- `cap-race-seed.service.ts` — Seeds cap race data from batting/bowling scorecards for all historical seasons
- Entity: `cap-race.entity.ts`
- DTOs: `cap-race-standings.dto.ts`, `cap-race-progression.dto.ts`

**ratings.module** — The ICC-calibrated rating engine:
- `ratings.service.ts` — Orchestrates rating queries and leaderboard retrieval
- `rating-engine.ts` — The core algorithm. Contains: `computeMatchPerformanceScore()`, `applyOppositionStrengthFactor()`, `applySeasonalDecay()`, `applyDampingFactor()`, `computeWeightedMovingAverage()`, `processRetirementAndInactivity()`, `rebuildAllRatings()`, `updateAfterMatch()`
- `rating-seed.service.ts` — Seeds ratings by processing all historical matches from 2008
- Entities: `player-rating.entity.ts`, `player-rating-history.entity.ts`, `player-season-rating.entity.ts`

**workspaces.module** — Save/load/share analytics workspaces:
- Entity: `analytics-workspace.entity.ts`

**comparison.module** — Multi-player comparison builder (unlimited players):
- `comparison.service.ts` — Accepts an array of player IDs, runs parallel stat queries, returns unified comparison object

**education.module** — Static content for formulas and DLS:
- Returns JSON content (no database entity needed — static educational content)

---

#### DTO Validation with class-validator

**DEV-BE:** Every incoming request is validated using **class-validator** decorators on DTO (Data Transfer Object) classes. This is our first line of defence against bad data:

```typescript
export class PlayerFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['India', 'Australia', 'England', 'South Africa', ...])
  country?: string;

  @IsOptional()
  @IsIn(['Batter', 'Bowler', 'All-rounder', 'WK-Batter'])
  role?: string;

  @IsOptional()
  @IsIn(['Right-hand bat', 'Left-hand bat'])
  battingStyle?: string;

  @IsOptional()
  @IsIn(['Right', 'Left'])
  bowlingArm?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
```

If someone sends `?page=-5` or `?role=InvalidRole`, NestJS returns a `400 Bad Request` with a detailed validation error message before the query ever hits the database. **class-transformer** handles the conversion of query string values (which are always strings) into the correct types (number, boolean, etc.).

---

#### API Security

**DEV-BE:** Security is implemented at multiple layers:

1. **Helmet** — Sets HTTP security headers on every response:
   - `X-Content-Type-Options: nosniff` — prevents MIME type sniffing
   - `X-Frame-Options: DENY` — prevents clickjacking via iframes
   - `Content-Security-Policy` — restricts resource loading to trusted sources
   - `Strict-Transport-Security` — enforces HTTPS

2. **@nestjs/throttler** — Rate limiting to prevent abuse. We configure:
   - Global limit: 100 requests per minute per IP
   - Search endpoint (`/api/players/search`): 30 requests per minute (debounced at 300ms on frontend, but extra protection on backend)
   - Heavy analytics endpoints: 20 requests per minute

3. **compression** — Gzip compresses all responses. A player profile JSON response might be 15KB uncompressed; gzip reduces it to 3KB, reducing transfer time by 80%.

4. **Input validation** — Via class-validator DTOs, as described above. No user input reaches the database without validation.

5. **SQL injection prevention** — TypeORM uses parameterised queries by default. We never concatenate user input into SQL strings. Even with the QueryBuilder, parameters are bound safely:
   ```typescript
   .where('LOWER(player.name) LIKE :search', { search: `%${searchTerm.toLowerCase()}%` })
   ```
   The `:search` parameter is escaped by TypeORM/PostgreSQL driver — SQL injection is not possible.

6. **CORS configuration** — The API only accepts requests from the frontend's domain (Netlify URL), not from arbitrary origins.

---

#### Auto-generated API Documentation

**DEV-BE:** We use **@nestjs/swagger** to auto-generate OpenAPI/Swagger documentation. Every controller, every endpoint, every DTO is documented. Visiting `/api/docs` in a browser shows an interactive API explorer where anyone (including the design team, the customer, or a future integration partner) can:
- Browse all 60+ endpoints organised by module
- See request parameters, response schemas, and example values
- Send test requests directly from the browser

This is generated automatically from our TypeScript decorators — no manual documentation writing needed.

---

### 5.3 — Database Architecture

**DEV-DB:** Let me walk through the database design in detail.

---

#### Why PostgreSQL 16

**DEV-DB:** We evaluated PostgreSQL, MySQL, MongoDB, and SQLite. PostgreSQL was chosen because this application's data is fundamentally relational — a player plays for a team in a season, appears in matches at venues, is sold in auctions. Every piece of data connects to other pieces through foreign keys. But beyond basic relational features, PostgreSQL gives us capabilities that are essential for cricket analytics:

1. **Window functions** — `RANK()`, `DENSE_RANK()`, `ROW_NUMBER()` for computing player rankings across the entire dataset. When we need to show "Rank #3 among all batters by strike rate in death overs for the 2023 season," that is a window function over a filtered aggregate — PostgreSQL handles this in a single query.

2. **Materialized views** — Pre-computed query results that are stored physically. Our `active_player_ranking_leaderboard` view pre-computes rankings for all active players across all four rating categories. Querying this view is as fast as reading a table — no re-computation needed. We refresh it after each match is added to the database.

3. **JSONB columns** — For semi-structured data that does not warrant its own table. The `bidding_war_teams` field in the `auction_players` table stores an array of team IDs as a JSON array. Querying into JSONB is still fast and indexed.

4. **pg_trgm extension** — Provides trigram-based text similarity matching. This powers our substring search. A GIN index on trigrams allows `ILIKE '%sha%'` queries to complete in under 10 milliseconds across 700+ player names, instead of the 200+ milliseconds a full table scan would require.

5. **Full-text search** — `tsvector` and `tsquery` for the global search across players, teams, matches, and venues. This supports stemming, ranking, and boolean search operators.

6. **Aggregation with FILTER clause** — PostgreSQL's `FILTER` clause lets us compute multiple conditional aggregates in a single query:
   ```sql
   SELECT
     player_id,
     COUNT(*) FILTER (WHERE phase = 'Powerplay') AS powerplay_balls,
     SUM(runs) FILTER (WHERE phase = 'Powerplay') AS powerplay_runs,
     COUNT(*) FILTER (WHERE phase = 'Death') AS death_balls,
     SUM(runs) FILTER (WHERE phase = 'Death') AS death_runs
   FROM ball_by_ball
   WHERE batter_id = 42
   GROUP BY player_id;
   ```
   This single query produces phase-wise batting stats. Without the `FILTER` clause, we would need separate queries or complex CASE expressions.

---

#### TypeORM 0.3.x (ORM)

**DEV-DB:** We use **TypeORM** as our Object-Relational Mapper. Each database table is represented by an **entity class** decorated with TypeORM decorators:

```typescript
@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index() // For pg_trgm GIN index
  name: string;

  @Column({ name: 'name_lower', generatedType: 'STORED', asExpression: 'LOWER(name)' })
  nameLower: string;

  @Column()
  nationality: string;

  @Column({ name: 'playing_role' })
  playingRole: string;

  @Column({ name: 'batting_style', nullable: true })
  battingStyle: string;

  @Column({ name: 'bowling_arm', nullable: true })
  bowlingArm: string;

  @Column({ name: 'bowling_variety', nullable: true })
  bowlingVariety: string;

  @Column({ default: 'Active' })
  status: string;

  @Column({ name: 'is_also_coach', default: false })
  isAlsoCoach: boolean;

  @OneToMany(() => BattingScorecard, (bs) => bs.player)
  battingScorecards: BattingScorecard[];

  @OneToMany(() => PlayerRating, (pr) => pr.player)
  ratings: PlayerRating[];
}
```

The entity defines the table structure, column types, indexes, relationships, and generated columns. TypeORM migrations are auto-generated from entity changes: when we add a new column to an entity, running `typeorm migration:generate` creates a migration file with the exact SQL ALTER TABLE statement. This keeps the database schema in sync with the code.

For complex analytical queries, we use TypeORM's **QueryBuilder**:

```typescript
async getPhasewiseBattingStats(playerId: number, filters: StatFilterDto) {
  const qb = this.ballByBallRepo.createQueryBuilder('b')
    .select('b.phase', 'phase')
    .addSelect('COUNT(*)', 'balls')
    .addSelect('SUM(b.runs)', 'runs')
    .addSelect('SUM(CASE WHEN b.is_wicket THEN 1 ELSE 0 END)', 'dismissals')
    .where('b.batter_id = :playerId', { playerId })
    .groupBy('b.phase');

  if (filters.teamId) {
    qb.andWhere('b.batter_team_id = :teamId', { teamId: filters.teamId });
  }
  if (filters.seasonId) {
    qb.andWhere('b.season_id = :seasonId', { seasonId: filters.seasonId });
  }

  const results = await qb.getRawMany();
  // Post-process: calculate averages, strike rates from raw sums
  return this.calculatePhaseStats(results);
}
```

This gives us full SQL power (GROUP BY, window functions, subqueries) while keeping parameters safe from injection and keeping the code type-safe.

---

#### Core Database Tables

**DEV-DB:** Let me explain each table and its role:

**players** — The central entity. Every individual who has ever played in the IPL gets one row. The table has indexed columns for every filter: `nationality`, `playing_role`, `batting_style`, `bowling_arm`, `bowling_variety`, `status`, `nationality_type`. The `name_lower` column is a stored generated column for case-insensitive search, with a pg_trgm GIN index for fast substring matching.

**coaches** — Coaching staff. Has an optional foreign key `person_id` to `players` for dual-role individuals. If `person_id` is set, this coach IS also a player — the frontend shows the toggle. If null, this is a standalone coach.

**coach_tenures** — Maps coaches to teams across seasons. One coach may have coached CSK in 2020, 2021, 2022 (three rows). Each row records wins, losses, and matches coached in that tenure.

**teams** — 10 current franchises plus any defunct/renamed teams. Stores logo URL, home ground FK, founding year, owner, titles won.

**team_seasons** — Per-team, per-season record. Stores captain, final league position. FK to teams and seasons.

**team_management** — Ownership and management hierarchy per team per season.

**team_sponsors** — Sponsors per team per season (title, principal, associate, kit sponsors).

**seasons** — One row per IPL season (2008-present). Stores winner, runner-up, Orange Cap holder, Purple Cap holder, Player of Tournament (all as FKs to other tables).

**matches** — Every IPL match. Stores date, venue, both teams, toss details, scores, winner, win type, DLS applied flag, Player of Match, and a text match summary.

**batting_scorecards** — One row per batter per match. Stores runs, balls, 4s, 6s, strike rate, dismissal type, dismissed by bowler, caught by fielder. This is what renders on the scorecard page — fast to query, denormalised for display.

**bowling_scorecards** — One row per bowler per match. Stores overs, runs conceded, wickets, economy, maidens, extras.

**fielding_scorecards** — One row per fielder per match. Stores catches, run outs, stumpings.

**ball_by_ball** — The foundation of all analytics. One row per delivery bowled in every IPL match. With ~150 balls per match and ~1,100+ matches, this table has approximately 165,000+ rows. Each row stores:
- Match ID, innings, over, ball number
- Batter ID, bowler ID, non-striker ID
- Runs scored (batter), extras (type and value)
- Is boundary (4 or 6), is dot ball
- Is wicket, wicket type, player dismissed, fielder involved
- **Derived fields** (stored directly on each row for query performance):
  - `phase`: 'Powerplay' (overs 1-6), 'Middle' (7-15), 'Death' (16-20)
  - `bowling_type`: 'Pace' or 'Spin' (derived from bowler's bowling style)
  - `batter_hand`: 'Right' or 'Left'
  - `bowler_arm`: 'Right' or 'Left'
  - `batter_team_id`, `bowler_team_id`: Denormalised for team-wise filtering

This table is the single source of truth for all deep analytics. Phase-wise stats? `GROUP BY phase`. Situational stats? `GROUP BY match.batting_first`. Vs bowling type? `GROUP BY bowling_type`. Head-to-head? `WHERE batter_id = X AND bowler_id = Y`. Every analytical query is an aggregation over ball_by_ball with appropriate filters.

**partnerships** — Pre-computed partnership data per match per innings. Tracking partnerships requires knowing which two batters are at the crease simultaneously across consecutive balls — too complex to derive on the fly.

**player_teams** — Maps players to teams per season, with jersey number and role (Captain, Player, Overseas, etc.).

**auctions** — Auction events. Stores date, location, type, auctioneer, total spend.

**auction_players** — Per-player auction records. Base price, sold price, buying team, RTM status, bidding war teams (JSONB array).

**venues** — Ground profiles. Capacity, city, pitch type, pace/spin friendliness.

**venue_match_conditions** — Per-match conditions at each venue. Weather, dew factor, pitch behaviour, toss advantage.

**ipl_sponsors** — IPL-level sponsors per season (title, official partner, broadcast).

**records** — Records across categories (Orange Cap, Purple Cap, Highest Score, etc.).

**cap_race** — Match-by-match Orange/Purple Cap race data. One row per player per match per cap type. Stores cumulative value (runs or wickets), rank, is_cap_holder flag, matches played, supporting stat. This powers the progression chart and the scrubber. A materialized view `cap_race_current_standings` provides fast retrieval of the latest standings.

**player_ratings** — Current rating snapshot per player. Stores batting, bowling, allrounder, fielding ratings, current rank, peak rating, peak rank, is_retired flag.

**player_rating_history** — Match-by-match rating evolution. One row per player per match. This powers the career timeline chart on player profiles.

**player_season_ratings** — Season-end rating snapshots. One row per player per season. Powers the historical season rankings feature on the Ratings page.

**analytics_workspaces** — Stored workspace configurations for shareable links. Contains player IDs, filter state, and layout preferences as JSON.

---

#### The Rating Engine Algorithm

**DEV-DB:** The rating engine is the most algorithmically complex component. Let me walk through exactly how it works:

**Step 1 — Match Performance Score (0-1000):**

For batting:
```
base = (runs_scored / match_average_runs) * 500
sr_factor = (player_SR / match_average_SR)
team_share = (runs_scored / team_total) * 200
phase_bonus = death_over_runs * 1.3 + powerplay_runs * 1.1 + middle_runs * 1.0
boundary_factor = (boundary_runs / total_runs) * 100

batting_match_score = clamp(base * sr_factor + team_share + phase_bonus + boundary_factor, 0, 1000)
```

For bowling:
```
base = (wickets_taken * 150) * (1 - economy/15)
dot_factor = (dot_balls / total_balls) * 200
phase_bonus = death_wickets * 1.5 + powerplay_wickets * 1.2
economy_bonus = max(0, (match_avg_economy - player_economy) * 50)

bowling_match_score = clamp(base + dot_factor + phase_bonus + economy_bonus, 0, 1000)
```

**Step 2 — Opposition Strength Factor:**
```
opposition_avg_rating = average rating of opposition team's players
strength_factor = opposition_avg_rating / 500
// If opposition average is 500 → 1.0x (neutral)
// If opposition average is 700 → 1.4x (strong — performance worth more)
// If opposition average is 300 → 0.6x (weak — performance worth less)

adjusted_score = match_score * strength_factor
```

**Step 3 — Match-Winning Bonus:**
```
if (player_team_won AND (is_top_scorer OR is_leading_wicket_taker)):
    adjusted_score *= 1.12  // 12% bonus
```

**Step 4 — Seasonal Decay:**
```
For each match in a player's history:
  if (match is in current season): weight = 1.0
  if (match is 1 season ago): weight = 0.5
  if (match is 2 seasons ago): weight = 0.25
  if (match is 3 seasons ago): weight = 0.125
  if (match is 4+ seasons ago): weight = 0.0625
```

**Step 5 — Weighted Moving Average:**
```
rating = Σ(adjusted_score_i * weight_i) / Σ(weight_i)
```

**Step 6 — Damping Factor (New Players):**
```
if (batting_innings < 26):
    damping = lookup_table[innings_bracket]  // 40% at 1-5, 55% at 6-10, ..., 100% at 26+
    batting_rating *= damping
```

**Step 7 — Inactivity Decay:**
```
if (missed_1_season): rating *= 0.85  // 15% penalty
if (missed_2_consecutive): rating *= 0.75  // additional 25% penalty
```

**Step 8 — Retirement:**
```
if (missed_3+_seasons OR confirmed_retirement):
    move to retired list
    freeze rating at last computed value
    store peak_rating, peak_rank, peak_season
```

The engine processes every match chronologically from 2008 Match 1. For initial seeding, `rating-seed.service.ts` iterates through all ~1,100 matches, computing and storing ratings for every participating player after each match. This is a one-time computation that takes approximately 2-3 minutes. After seeding, `updateAfterMatch()` handles incremental updates for new matches.

---

### 5.4 — Data Flow: How Everything Connects

**DEV-LEAD:** Let me summarize how data flows from the database to the user's screen, using the Player Detail page as an example:

```
1. User navigates to /players/42 (Virat Kohli)

2. React Router reads playerId=42 from URL params

3. PlayerDetailPage component mounts, triggers TanStack Query hooks:
   - useQuery(['player', 42]) → GET /api/players/42
   - useQuery(['player', 42, 'batting']) → GET /api/players/42/stats/batting
   - useQuery(['player', 42, 'ratings']) → GET /api/players/42/ratings

4. Each GET request hits the NestJS controller:
   - PlayersController.findOne(42) → PlayersService.findOne(42)
   - PlayersService uses TypeORM repository: playerRepo.findOne({ where: { id: 42 }, relations: ['ratings'] })
   - For stats: PlayerStatsService.getBattingStats(42, filters)
     → TypeORM QueryBuilder on ball_by_ball table
     → GROUP BY phase, FILTER aggregates
     → Returns { powerplay: { runs, avg, sr }, middle: {...}, death: {...} }

5. NestJS TransformInterceptor wraps response: { data: {...}, meta: { timestamp } }

6. Response passes through compression middleware → gzipped

7. TanStack Query receives response:
   - Caches under queryKey ['player', 42]
   - If staleTime not exceeded on revisit, returns cached data instantly

8. React components re-render with data:
   - PlayerBio.jsx renders name, DOB, nationality
   - PlayerOverallStats.jsx renders StatCards (runs, avg, sr)
   - PlayerRatingBadge.jsx renders the hexagonal rating badge
   - RatingTrendChart.jsx renders the Recharts line chart
   - All with Framer Motion entrance animations

9. User clicks "Phase-wise" sub-tab:
   - useQuery(['player', 42, 'batting', 'phase-wise', { teamId: null, seasonId: null }])
   - If not cached → GET /api/players/42/stats/batting/phase-wise
   - If cached → instant render from cache

10. User selects "RCB" in team filter:
    - Redux dispatch: setFilter('teamId', 3)
    - All TanStack Query hooks re-execute with new teamId
    - queryKey becomes ['player', 42, 'batting', 'phase-wise', { teamId: 3 }]
    - New API call: GET /api/players/42/stats/batting/phase-wise?teamId=3
    - Backend: WHERE batter_team_id = 3 added to ball_by_ball query
    - UI updates with RCB-specific stats
    - Original overall stats remain cached under the previous queryKey
```

This entire flow — from URL navigation to rendered, animated UI — takes under 500 milliseconds for the first load and under 50 milliseconds for cached data.

---

### 5.5 — Deployment Architecture

**DEV-LEAD:** Let me explain how the application gets from our development machines to the user's browser:

**Frontend → Netlify:**
- Code is pushed to GitHub
- GitHub Actions CI pipeline runs: lint (ESLint), format check (Prettier), type check (TypeScript), unit tests (Vitest), build (Vite)
- If all checks pass, Netlify's GitHub integration triggers a deployment
- Vite builds the React application into static files (HTML, JS chunks, CSS, images)
- Netlify distributes these files across its global edge CDN — 60+ servers worldwide
- When a user in Mumbai requests the app, they get served from the nearest edge node (likely Mumbai or Singapore), not from a single origin server
- Netlify handles HTTPS, caching headers, and asset compression automatically
- Every pull request gets a unique deploy preview URL — the design team can review changes before they merge

**Backend → Firebase Cloud Functions:**
- The NestJS application is wrapped as a Firebase Cloud Function (2nd gen)
- On deployment, Firebase provisions the function on Google Cloud's infrastructure
- The function auto-scales: if 1 user is making requests, 1 instance runs. If 100 users simultaneously hit the API, Firebase spins up 100 instances. We pay per invocation, not for idle servers
- Cold start time (first request after idle): ~2-3 seconds. Subsequent requests: <100ms. We mitigate cold starts by setting a minimum instance count of 1

**Database → Cloud SQL / Supabase / Neon:**
- PostgreSQL 16 runs on a managed cloud service
- The provider handles backups, patching, replication, and monitoring
- TypeORM connects via `DATABASE_URL` environment variable set in Firebase config
- Connection pooling ensures the database is not overwhelmed by concurrent requests

**CI/CD Pipeline (GitHub Actions):**
```
On Push to main:
  1. Checkout code
  2. Install dependencies (npm ci)
  3. Run ESLint (frontend + backend)
  4. Run Prettier check
  5. Run TypeScript type checking
  6. Run frontend tests (Vitest)
  7. Run backend tests (Jest + Supertest)
  8. Build frontend (vite build)
  9. Build backend (nest build)
  10. Deploy frontend to Netlify
  11. Deploy backend to Firebase
  12. Run database migrations (typeorm migration:run)
```

---

### 5.6 — Performance Optimization Strategies

**DEV-LEAD:** Given the data density of this platform, performance is non-negotiable:

1. **Code splitting** — Each page is a separate JS chunk, loaded only when visited. The initial load downloads ~150KB of JS (shared React runtime + router + navbar). Individual pages add 20-50KB each, loaded on demand.

2. **Image optimization** — Player photos, team logos, and venue images are served in WebP format with responsive `srcset` attributes. A player card on the list page loads a 100x100 thumbnail; the detail page loads a 400x400 high-quality image. Lazy loading ensures images below the fold do not load until the user scrolls near them.

3. **TanStack Query caching** — As described, previously fetched data is served from cache instantly. Stale time is configured per query type: player profiles (5 minutes), leaderboards (2 minutes), match data (10 minutes — historical data rarely changes).

4. **Database indexing** — Every column used in a WHERE clause or JOIN is indexed. The pg_trgm GIN index on player names. B-tree indexes on all foreign keys. Composite indexes where queries use multiple columns simultaneously (e.g., `batter_id` + `season_id` on `ball_by_ball`).

5. **Materialized views** — Rankings and leaderboards are pre-computed and stored. Refreshed after new data is added. Querying a materialized view is as fast as reading a table with a few hundred rows.

6. **Gzip compression** — Every API response is gzipped. Typical compression ratio: 70-80% reduction in transfer size.

7. **CDN for static assets** — Netlify's edge CDN serves frontend files from the server nearest to the user.

8. **Bundle analysis** — `vite-plugin-visualizer` generates a visual map of the JS bundle, showing which libraries take the most space. If a library contributes disproportionately, we evaluate alternatives or lazy-load it.

---

---

# ACT 6: DEVELOPMENT TEAM EXPLAINS TO DESIGNERS

## Scene: Developers walk designers through how their designs will be implemented

---

**DEV-FE:** I want to walk you through how each of your design specifications maps to our implementation, so you know exactly what to expect in the build.

**Your rating badge design** — the hexagonal shield — will be a React component called `PlayerRatingBadge.jsx`. It accepts a `rating` prop (number 0-1000) and a `category` prop (batting/bowling/allrounder/fielding). Internally, it determines the tier (900+ → 'All-Time Great', etc.), selects the appropriate colour from Tailwind's rating colour tokens, and renders the hexagon as an inline SVG with the number and label inside. The Framer Motion spring animation on mount will make it "pop in" with a scale-from-zero effect.

**Your cap race progression chart** — the multi-line animated chart — will be a Recharts `<LineChart>` wrapped in our ShadCN Chart component. The X-axis will show match numbers, Y-axis cumulative runs/wickets. Each line gets its colour from the player's team colour (CSK yellow, MI blue, etc.). The draw-in animation will be achieved by rendering the chart inside a Framer Motion container that animates `clipPath` from `inset(0 100% 0 0)` to `inset(0 0% 0 0)` — this reveals the chart from left to right over 1.5 seconds. The match scrubber below will be a ShadCN Slider component whose `onChange` updates a state variable that filters the leaderboard table above.

**Your dark mode design** — the CSS custom property system you defined — maps exactly to Tailwind's `darkMode: 'class'` strategy. When `themeSlice` dispatches `toggleTheme()`, we add or remove the `dark` class on `<html>`. Every `hsl(var(--background))` reference in your colour system resolves to the light or dark variant. The 200ms transition you specified is implemented via `transition: background-color 200ms, color 200ms` on the `body` element.

**Your responsive breakpoints** — Tailwind handles these natively. Classes like `md:grid-cols-2 lg:grid-cols-4` make a grid that is 1-column on mobile, 2-column on tablet, 4-column on desktop. The filter panel that collapses to a drawer on mobile will use ShadCN's Sheet component (a slide-out drawer) triggered by a filter icon button that is only visible below 768px.

**D-UX:** What about the search autocomplete? How does the 300ms debounce work?

**DEV-FE:** The `PlayerSearchAutocomplete.jsx` component uses a custom `useDebounce` hook. When the user types, each keystroke updates a local state variable. The debounce hook delays updating the "debounced" value by 300ms — if the user types another character within 300ms, the timer resets. Only when 300ms pass without a new keystroke does the debounced value update. This update triggers a TanStack Query fetch to `GET /api/players/search?q=<debounced_value>`. The backend receives the query, runs an `ILIKE '%value%'` against the pg_trgm-indexed `name_lower` column, and returns the top 10 matches (id, name, photo, role, nationality) in under 10ms. The frontend renders these as dropdown suggestions using ShadCN's Command component.

**D-GFX:** Will the team colour theming really work dynamically? Like, when I navigate from CSK's page to MI's page, the accent colour changes mid-transition?

**DEV-FE:** Yes. Each team entity in the database stores its `primary_colour` and `secondary_colour` as hex codes. When the Team Detail page mounts, it reads the team's colours and sets CSS custom properties on the page wrapper element: `--team-primary` and `--team-secondary`. Every component on that page that uses these variables (the banner gradient, the tab underline, the stat card borders) immediately adopts the team's identity. During navigation, Framer Motion's page transition fades out the old page (with old team colours) and fades in the new page (with new team colours). There is no jarring colour switch — it is seamless.

---

---

# ACT 7: FULL TEAM ALIGNMENT

## Scene: Customer, Designers, and Developers confirm the plan together

---

**DEV-LEAD:** Let me summarise what we are building, so everyone is aligned:

**For the Customer:**
- A broadcast-grade IPL analytics platform covering all 19 seasons (2008-present)
- 20+ pages, 60+ API endpoints, 26+ database tables, 184+ player stat fields
- ICC-calibrated player rating system with historical data from 2008
- Unlimited multi-player comparison workspace with save/share/export
- Orange Cap and Purple Cap race with match-by-match progression, scrubber, and timeline
- Global search with sub-100ms autocomplete
- Complete auction, venue, sponsor, team management, and coaching staff data
- Cricket education hub with DLS calculator

**For the Design Team:**
- ShadCN/UI component library — every component customised to your design tokens
- Tailwind CSS with your colour system, typography scale, spacing scale
- Dark/light mode via CSS custom properties — 200ms transition
- Dynamic team colour theming via CSS custom properties
- Framer Motion for all specified animations — page transitions, counter animations, chart draw-ins, card hovers, badge pop-ins
- Recharts and Chart.js for all data visualisations, styled per your chart design specs
- **Mobile-first responsive design** at six breakpoints (base/mobile → sm → md/tablet → lg/desktop → xl → 2xl/ultra-wide), with touch-optimised interactions, card-based mobile table layouts, adaptive navigation (hamburger drawer on mobile, full navbar on desktop), and all interactive elements meeting 44x44px minimum tap targets
- Lucide React icons throughout

**For the Development Team:**
- React 18 + Vite 5 frontend with React Router v6, Redux Toolkit, TanStack Query v5
- NestJS 10 + TypeScript backend with TypeORM, class-validator, Swagger docs
- PostgreSQL 16 with pg_trgm search, materialized views, window functions
- 12+ NestJS modules, each with controllers, services, DTOs, entities
- Rating engine processing 1,100+ matches chronologically
- Cap race engine computing standings for all seasons from scorecards
- Netlify (frontend CDN) + Firebase Cloud Functions (serverless API) + Cloud SQL (managed PostgreSQL)
- GitHub Actions CI/CD pipeline
- 8-sprint delivery: April 1 – May 31, 2026

**C:** This is exactly what I envisioned. Let us build it.

**D-UX:** The designs are ready for implementation. We will be available throughout for feedback loops and design QA on each sprint delivery.

**D-GFX:** All visual assets — logo, illustrations, team colour definitions, rating badge SVGs, cap icons — will be delivered in Sprint 1 alongside the design system tokens.

**DEV-LEAD:** Sprint 1 kicks off immediately. By end of week 1, the skeleton is up — database entities, data pipeline, frontend shell with routing and theming. By week 4, the player module with ratings is live on staging. By week 8, we ship production.

---

---

# APPENDIX A: COMPLETE COMPONENT-TO-TECHNOLOGY MAPPING

| Component | Technology Used | Why |
|---|---|---|
| Global Search Autocomplete | ShadCN Command + TanStack Query + pg_trgm | Accessible command palette, cached results, sub-10ms DB query |
| Player Filter Panel | ShadCN Select + Redux Toolkit + URL Search Params | Controlled dropdowns, global state sync, shareable URLs |
| Player List Grid | ShadCN Card + TanStack Query (pagination) | Responsive cards, automatic page caching |
| Player List Table | ShadCN Data Table + TanStack Table v8 | Sortable, filterable, resizable columns |
| Player Rating Badge | Custom SVG + Tailwind + Framer Motion | Hexagonal design, colour-coded tiers, pop-in animation |
| Rating Trend Sparkline | Recharts LineChart (mini, no axes) | Inline trend visualization |
| Radar Chart | Recharts RadarChart | Multi-dimension strength profile |
| Phase-wise Bar Chart | Recharts BarChart (grouped) | Powerplay/Middle/Death comparison |
| Dismissal Doughnut | Chart.js DoughnutChart | Caught/bowled/LBW/etc. breakdown |
| Career Progression Line | Recharts LineChart (multi-line) | Rating/runs/wickets over seasons |
| Scatter Plot | Recharts ScatterChart | Avg vs SR with player dots |
| Cap Race Progression | Recharts LineChart + Framer Motion clip | Animated multi-line race chart |
| Cap Race Scrubber | ShadCN Slider | Match-by-match time travel |
| Cap Holder Timeline | Custom SVG + Tailwind | Colour-coded ribbon |
| Comparison Table | ShadCN Data Table (dynamic columns) | Unlimited players, horizontal scroll |
| Scorecard Tables | ShadCN Data Table | Batting/bowling/fielding per match |
| Leaderboard Table | ShadCN Data Table + TanStack Query | Sortable, filterable, paginated |
| Match Timeline | Custom component + Framer Motion | Vertical timeline with animated nodes |
| Counter Animation | Framer Motion useInView + animate | Count-up from 0 on scroll |
| Page Transitions | Framer Motion AnimatePresence | Fade + slide on route change |
| Dark/Light Toggle | ShadCN Button + Redux themeSlice + Tailwind darkMode | One-click theme switch |
| Team Dynamic Colours | CSS Custom Properties + Tailwind | Per-team accent colours |
| Workspace Canvas | Custom layout + Redux workspaceSlice | Dynamic content area |
| Save/Load Workspace | Redux Persist + localStorage | Persistent state across sessions |
| Share Workspace | URL encoding + Workspace API | Shareable links with UUID tokens |
| Export PNG | html-to-image library | Screenshot chart/table as PNG |
| Export CSV | Custom CSV generator | Stat data as downloadable file |
| Education Formulas | ShadCN Accordion | Expandable sections |
| DLS Calculator | ShadCN Input + custom logic | Interactive formula evaluation |
| Mobile Navigation | ShadCN Sheet (drawer) | Slide-out menu on mobile |
| Breadcrumbs | Custom component + React Router | Navigation context |
| Loading States | ShadCN Skeleton | Shape-matched loading placeholders |
| Error States | Custom error boundary + ShadCN Card | Graceful error display |
| Toast Notifications | ShadCN Toast + Redux uiSlice | Non-blocking feedback messages |

---

# APPENDIX B: COMPLETE API ENDPOINT REGISTRY

| Module | Endpoint | Method | Purpose |
|---|---|---|---|
| Players | `/api/players` | GET | List all players (paginated, filterable by 10+ params) |
| Players | `/api/players/search` | GET | Autocomplete search (pg_trgm, returns top 10) |
| Players | `/api/players/:id` | GET | Full player profile |
| Players | `/api/players/:id/coach-profile` | GET | Coach profile (if dual-role) |
| Players | `/api/players/:id/matches` | GET | All matches played |
| Players | `/api/players/:id/auctions` | GET | Auction history timeline |
| Players | `/api/players/:id/stats/batting` | GET | Core batting stats |
| Players | `/api/players/:id/stats/bowling` | GET | Core bowling stats |
| Players | `/api/players/:id/stats/fielding` | GET | Fielding stats |
| Players | `/api/players/:id/stats/allrounder` | GET | All-rounder rating |
| Players | `/api/players/:id/stats/batting/phase-wise` | GET | Powerplay/Middle/Death batting |
| Players | `/api/players/:id/stats/batting/situational` | GET | Bat first vs chase, wins vs losses |
| Players | `/api/players/:id/stats/batting/vs-bowling-type` | GET | vs Pace/Spin/Left/Right |
| Players | `/api/players/:id/stats/batting/dismissals` | GET | Dismissal type breakdown |
| Players | `/api/players/:id/stats/batting/by-position` | GET | Stats by batting position |
| Players | `/api/players/:id/stats/batting/milestones` | GET | Fastest 50/100, streaks, records |
| Players | `/api/players/:id/stats/bowling/phase-wise` | GET | Powerplay/Middle/Death bowling |
| Players | `/api/players/:id/stats/bowling/situational` | GET | Defending vs bowling first |
| Players | `/api/players/:id/stats/bowling/vs-batter-type` | GET | vs Right/Left handers |
| Players | `/api/players/:id/stats/bowling/wicket-types` | GET | Bowled/caught/LBW/etc. |
| Players | `/api/players/:id/stats/bowling/milestones` | GET | Best season/match, streaks |
| Players | `/api/players/:id/stats/advanced` | GET | MVP, clutch, win contribution |
| Players | `/api/players/:id/stats/partnerships` | GET | Partnership history |
| Players | `/api/players/:id/h2h/bowler/:bowlerId` | GET | Batting stats vs specific bowler |
| Players | `/api/players/:id/h2h/batter/:batterId` | GET | Bowling stats vs specific batter |
| Players | `/api/players/:id/h2h/team/:teamId` | GET | Performance vs specific team |
| Players | `/api/players/:id/h2h/venue/:venueId` | GET | Performance at specific venue |
| Players | `/api/players/:id/ratings` | GET | Full rating profile |
| Players | `/api/players/:id/ratings/history` | GET | Match-by-match rating history |
| Players | `/api/players/:id/ratings/seasons` | GET | Season-end rating snapshots |
| Players | `/api/players/:id/rankings` | GET | Career & season-wise ranks |
| Comparison | `/api/players/compare?ids=...` | GET | Multi-player comparison (unlimited) |
| Ratings | `/api/ratings/leaderboard` | GET | Active player leaderboard (filterable) |
| Teams | `/api/teams` | GET | List all teams |
| Teams | `/api/teams/:id` | GET | Team overview |
| Teams | `/api/teams/:id/squad/:seasonId` | GET | Squad for a season |
| Teams | `/api/teams/:id/management` | GET | Management & ownership |
| Teams | `/api/teams/:id/coaches` | GET | Coaching staff |
| Teams | `/api/teams/:id/sponsors` | GET | Team sponsors |
| Teams | `/api/teams/:id/matches` | GET | All matches |
| Teams | `/api/teams/:id/stats` | GET | Aggregated team stats |
| Matches | `/api/matches` | GET | List all matches (filterable) |
| Matches | `/api/matches/:id` | GET | Full match detail |
| Matches | `/api/matches/:id/scorecard` | GET | Batting + Bowling + Fielding |
| Seasons | `/api/seasons` | GET | List all seasons |
| Seasons | `/api/seasons/:id` | GET | Season overview |
| Seasons | `/api/seasons/:id/matches` | GET | Matches in season |
| Seasons | `/api/seasons/:id/points-table` | GET | Points table |
| Auctions | `/api/auctions` | GET | List all auctions |
| Auctions | `/api/auctions/:id` | GET | Auction full details |
| Auctions | `/api/auctions/:id/players` | GET | Players in auction |
| Auctions | `/api/auctions/:id/highlights` | GET | Auction highlights |
| Venues | `/api/venues` | GET | List all venues |
| Venues | `/api/venues/:id` | GET | Venue profile |
| Venues | `/api/venues/:id/matches` | GET | Matches at venue |
| Venues | `/api/venues/:id/stats` | GET | Venue-level stats |
| Sponsors | `/api/sponsors` | GET | All IPL sponsors |
| Sponsors | `/api/sponsors/:id` | GET | Sponsor details |
| Cap Race | `/api/cap-race/:seasonId/orange` | GET | Orange Cap standings |
| Cap Race | `/api/cap-race/:seasonId/purple` | GET | Purple Cap standings |
| Cap Race | `/api/cap-race/:seasonId/orange/progression` | GET | Match-by-match Orange Cap race |
| Cap Race | `/api/cap-race/:seasonId/purple/progression` | GET | Match-by-match Purple Cap race |
| Cap Race | `/api/cap-race/:seasonId/orange/after-match/:n` | GET | Orange standings after match N |
| Cap Race | `/api/cap-race/:seasonId/purple/after-match/:n` | GET | Purple standings after match N |
| Records | `/api/records` | GET | All records (filterable) |
| Records | `/api/records/orange-cap` | GET | Orange Cap final winners |
| Records | `/api/records/purple-cap` | GET | Purple Cap final winners |
| Records | `/api/records/thrillers` | GET | Most thrilling matches |
| Records | `/api/records/game-changers` | GET | Game-changing innings |
| Records | `/api/records/highest-scores` | GET | Highest team scores |
| Records | `/api/records/lowest-scores` | GET | Lowest team scores |
| Workspace | `/api/workspaces` | POST | Save workspace |
| Workspace | `/api/workspaces/:id` | GET | Load workspace |
| Workspace | `/api/workspaces/:id` | PUT | Update workspace |
| Workspace | `/api/workspaces/:id` | DELETE | Delete workspace |
| Workspace | `/api/workspaces/share/:token` | GET | Load via share link |
| Workspace | `/api/workspaces/:id/share` | POST | Generate share link |
| Education | `/api/education/formulas` | GET | All cricket stat formulas |
| Education | `/api/education/dls` | GET | DLS method explanation |

---

# APPENDIX C: DATABASE TABLE REGISTRY

| # | Table | Rows (Estimated) | Primary Purpose |
|---|---|---|---|
| 1 | players | 700+ | Every IPL player's identity and bio |
| 2 | coaches | 50+ | Coaching staff profiles |
| 3 | coach_tenures | 200+ | Coach-team-season assignments |
| 4 | teams | 15+ | All franchises (current + defunct) |
| 5 | team_seasons | 150+ | Per-team per-season records |
| 6 | team_management | 200+ | Ownership and management hierarchy |
| 7 | team_sponsors | 300+ | Sponsors per team per season |
| 8 | seasons | 19 | One row per IPL season |
| 9 | matches | 1,100+ | Every IPL match |
| 10 | batting_scorecards | 25,000+ | Per-batter per-match stats |
| 11 | bowling_scorecards | 12,000+ | Per-bowler per-match stats |
| 12 | fielding_scorecards | 25,000+ | Per-fielder per-match stats |
| 13 | ball_by_ball | 165,000+ | Every delivery bowled — foundation of all analytics |
| 14 | partnerships | 15,000+ | Two-batter partnership records |
| 15 | player_teams | 5,000+ | Player-team mapping per season |
| 16 | auctions | 20+ | Auction events |
| 17 | auction_players | 5,000+ | Per-player auction records |
| 18 | venues | 30+ | Ground profiles |
| 19 | venue_match_conditions | 1,100+ | Per-match pitch/weather conditions |
| 20 | ipl_sponsors | 100+ | IPL-level sponsors per season |
| 21 | records | 500+ | Records across all categories |
| 22 | cap_race | 50,000+ | Match-by-match cap race standings |
| 23 | player_ratings | 700+ | Current rating snapshots |
| 24 | player_rating_history | 50,000+ | Match-by-match rating evolution |
| 25 | player_season_ratings | 5,000+ | Season-end rating snapshots |
| 26 | analytics_workspaces | Variable | Saved workspace configurations |

---

*This document serves as the complete technical communication blueprint for the IPL Analytics Platform. It captures the full dialogue between customer requirements, design decisions, and development implementation — from initial vision to final architecture.*
