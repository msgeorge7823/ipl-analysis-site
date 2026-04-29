# Auctions

**Consumed by:** `Auctions.tsx` (five tabs: Auction History · Scouting Hub · Top Targets · IPL Crossover · League Comparison)

The Auctions page blends **three data sources**:

| Tab | Source |
|---|---|
| Auction History | Embedded `auctionData` constant in `src/pages/Auctions.tsx` (lines ~106–183) |
| Scouting Hub | `public/data/scouting/all-players.json` + per-league files |
| Top Targets | `public/data/scouting/scout-targets.json` |
| IPL Crossover | `public/data/scouting/ipl-crossover.json` |
| League Comparison | Per-league files in `public/data/scouting/` |

## 1. Embedded auction history (2024–2026)

Only the most recent three auctions are populated; 2008–2023 are referenced via sponsors/seasons docs.

### IPL 2024 Mega Auction — Dubai, UAE (Dec 19–20, 2023)

- **Auctioneer:** Hugh Edmeades
- **Players sold:** 72
- **Total spend:** ₹551.7 Cr
- **Highest bid:** Mitchell Starc — ₹24.75 Cr (KKR)
- **Unsold:** 46

#### Marquee buys

| Player | Country | Role | Base | Sold | Team |
|---|---|---|---|---|---|
| Mitchell Starc | AUS | Fast Bowler | ₹2 Cr | **₹24.75 Cr** 🔥 | KKR |
| Pat Cummins | AUS | Fast Bowler | ₹2 Cr | **₹20.50 Cr** 🔥 | SRH |
| Daryl Mitchell | NZ | All-rounder | ₹2 Cr | ₹14 Cr | CSK |
| Harshal Patel | IND | Medium Fast | ₹2 Cr | ₹11.50 Cr | PBKS |
| Travis Head | AUS | Batter | ₹2 Cr | ₹6.80 Cr | SRH |
| Alzarri Joseph | WI | Fast Bowler | ₹2 Cr | ₹11.50 Cr | RCB |
| Wanindu Hasaranga | SL | Leg Spinner | ₹2 Cr | — | *Unsold* |

#### Team-wise spending

| Team | Spend |
|---|---|
| KKR | ₹80.4 Cr |
| SRH | ₹73.6 Cr |
| RCB | ₹68.8 Cr |
| CSK | ₹62.5 Cr |
| MI | ₹58.2 Cr |
| DC | ₹55.1 Cr |
| PBKS | ₹52.7 Cr |
| RR | ₹48.3 Cr |
| GT | ₹41.9 Cr |
| LSG | ₹38.2 Cr |

#### Highlights

- 🔥 Mitchell Starc became the most expensive IPL buy ever at ₹24.75 Cr — KKR won the bidding war.
- 💰 Pat Cummins fetched ₹20.50 Cr — 2nd most expensive, SRH investing in a captain + pace leader.
- 📊 72 players sold over 2 days for a total spend of ₹551.7 Crore.

### IPL 2025 Mega Auction — Jeddah, Saudi Arabia (Nov 24–25, 2024)

- **Auctioneer:** Mallika Sagar
- **Players sold:** 182
- **Total spend:** ₹639.15 Cr
- **Highest bid:** Rishabh Pant — ₹26.75 Cr (LSG) *[source lists 27 on the row and 26.75 in the header — page displays the higher]*
- **Unsold:** 122

#### Marquee buys

| Player | Country | Role | Base | Sold | Team |
|---|---|---|---|---|---|
| Rishabh Pant | IND | WK-Batter | ₹2 Cr | **₹27 Cr** 🔥 | LSG |
| Shreyas Iyer | IND | Batter | ₹2 Cr | **₹26.75 Cr** 🔥 | PBKS |
| Venkatesh Iyer | IND | All-rounder | ₹2 Cr | **₹23.75 Cr** 🔥 | KKR |
| Jos Buttler | ENG | WK-Batter | ₹2 Cr | ₹15.75 Cr | GT |
| KL Rahul | IND | WK-Batter | ₹2 Cr | ₹14 Cr | DC |
| Mohammed Shami | IND | Fast Bowler | ₹2 Cr | ₹10 Cr | SRH |
| Kagiso Rabada | SA | Fast Bowler | ₹2 Cr | ₹10.75 Cr | GT |
| Prithvi Shaw | IND | Batter | ₹0.75 Cr | — | *Unsold* |

#### Team-wise spending

| Team | Spend |
|---|---|
| PBKS | ₹110.5 Cr |
| LSG | ₹95.2 Cr |
| KKR | ₹78.4 Cr |
| RCB | ₹72.3 Cr |
| DC | ₹68.9 Cr |
| GT | ₹65.7 Cr |
| SRH | ₹58.1 Cr |
| MI | ₹55.8 Cr |
| CSK | ₹50.2 Cr |
| RR | ₹42.6 Cr |

#### Highlights

- 🔥 Rishabh Pant became the most expensive IPL buy ever at ₹27 Cr — LSG won a fierce bidding war.
- 💰 Shreyas Iyer fetched ₹26.75 Cr from Punjab Kings — PBKS investing in a proven IPL captain.
- 📊 182 players sold over 2 days for a total spend of ₹639.15 Cr.

### IPL 2026 Mini Auction — TBD *(details in the embedded data are placeholders)*

- **Location / Dates / Auctioneer:** TBD (expected late 2025)
- **Highlight card in UI:** "IPL 2026 auction details yet to be announced. The mini auction is expected to take place in late 2025. Franchise retention lists will be announced prior."

Real 2026 buys (from the sponsors + news docs and squad retentions):
- Cameron Green — ₹25.20 Cr (KKR) — most expensive overseas player (news 2025-12-16)
- Prashant Veer, Kartik Sharma — ₹14.20 Cr each (CSK, most expensive uncapped)
- Matheesha Pathirana — ₹18 Cr (KKR)

---

## 2. Scouting Hub — `public/data/scouting/all-players.json`

- **Records:** 2,704 players (all leagues combined)
- **Type:** list of `ScoutPlayer`

### Schema (`ScoutPlayer`)

| Group | Fields |
|---|---|
| Identity | `id`, `name`, `leagues[]`, `teams[]`, `matches`, `inIPL`, `archetype`, `positionLabel`, `recentSeasons[]` |
| Batting overall | `innings`, `runs`, `ballsFaced`, `battingAvg`, `strikeRate`, `highScore`, `fours`, `sixes`, `fifties`, `hundreds`, `boundaryPct`, `dotBallPct`, `ballsPerBoundary` |
| Batting by phase | `ppSR`/`ppRuns`, `midSR`/`midRuns`, `deathSR`/`deathRuns` |
| Bowling overall | `bowlInnings`, `wickets`, `bowlEcon`, `bowlAvg`, `bowlSR`, `bestBowling`, `bowlDotPct` |
| Bowling by phase | `ppBowlEcon`/`ppBowlWickets`, `midBowlEcon`/`midBowlWickets`, `deathBowlEcon`/`deathBowlWickets` |
| Fielding | `catches`, `stumpings`, `runOuts`, `fieldingValue` |
| Impact | `batImpact`, `bowlImpact`, `allRounderIndex` |
| Dismissals | `dismissals: Record<string, number>` |

### Supported archetypes (sorted + displayed in the UI filter)

`All`, `Power Hitter`, `Accumulator-Accelerator`, `Anchor`, `Finisher`, `Death Specialist`, `Spin Controller`, `Pace Enforcer`, `Genuine All-rounder`, `Batting All-rounder`, `Bowling All-rounder`, `Wicketkeeper-Batter`

### Per-league slices (`public/data/scouting/*.json`)

| File | League | Records |
|---|---|---:|
| `bbl.json` | Big Bash League (AUS) | 458 |
| `psl.json` | Pakistan Super League | — |
| `cpl.json` | Caribbean Premier League | — |
| `sa20.json` | SA20 (South Africa) | — |
| `hnd.json` | The Hundred (ENG) | — |
| `bpl.json` | Bangladesh Premier League | — |
| `lpl.json` | Lanka Premier League | — |
| `ilt20.json` | International League T20 (UAE) | — |
| `mlc.json` | Major League Cricket (USA) | — |
| `ntb.json` | T20 Blast (ENG Vitality) | — |
| `smat.json` | Syed Mushtaq Ali Trophy (IND) | — |
| `all-players.json` | Union of all leagues + IPL | 2,704 |

Each file is a plain array of the same `ScoutPlayer` shape as above.

## 3. Top Targets — `public/data/scouting/scout-targets.json`

- **Records:** 1,542 players
- **Shape:** same as `ScoutPlayer`
- **Purpose:** A pre-filtered superset used by the "Top Targets" tab, sliced in the UI into:
  - Top 20 Batsmen (by `batImpact`)
  - Top 20 Bowlers (by `bowlImpact`)
  - Top 20 All-rounders (by `allRounderIndex`)
  - Value Picks (best impact-per-recent-league-exposure)
  - Rising Stars (recent seasons only)

## 4. IPL Crossover — `public/data/scouting/ipl-crossover.json`

- **Records:** 587 players who appear in the IPL pool *and* at least one of the other leagues.
- **Shape:** same `ScoutPlayer` with `inIPL: true`.
- **Purpose:** The "IPL Crossover" tab surfaces the crossover set so teams can compare overseas franchise-league form against IPL returns for the same player.

## Notes

- The embedded history is intentionally narrow (last three auctions) because earlier auctions are better consumed via `seasons.md` and `sponsors.md` (retentions, mid-season replacements, etc.) rather than repeated here.
- `replacement-players.json` (see `players.md`) stores mid-season replacement signings — those are auction-adjacent but not part of the main auction dataset.
- Scouting data is authored at build time by `scripts/` — it's derived from the source ball-by-ball payloads in `bbb/` of each league.
