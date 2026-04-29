# Data Docs — IPL Analysis

Human-readable documentation for every dataset powering the IPL Analysis app. One file per data source, each with:

- the **source path** under `public/data/` (or an embedded location),
- the **schema** (fields, types, notes),
- the **actual data** rendered as markdown tables or structured lists,
- **which content pages** consume it.

## Index

| File | Source | Records | Powers |
|---|---|---:|---|
| [teams.md](teams.md) | `public/data/teams.json` | 15 | Teams, TeamDetail, team badges |
| [venues.md](venues.md) | `public/data/venues.json` | 38 | Venues, VenueDetail |
| [seasons.md](seasons.md) | `public/data/seasons.json` | 19 | Seasons, SeasonDetail, Home |
| [matches.md](matches.md) | `public/data/matches/season-YYYY.json` (19 files) | 1,193 | Matches, MatchDetail, Schedule, LiveMatch, SeasonDetail |
| [players.md](players.md) | `public/data/players.json` (+ index, player-teams, replacement-players) | 836 | Players, PlayerDetail, squad tabs, Analytics |
| [player-stats.md](player-stats.md) | `public/data/player-stats.json` | 786 | Analytics, Ratings, Records, PlayerDetail |
| [coaches.md](coaches.md) | `public/data/coaches.json` | 166 coaches / 236 tenures | Coaches, CoachDetail |
| [squads.md](squads.md) | `public/data/squads-2026.json` | 10 teams | Teams, TeamDetail (current squad) |
| [auctions.md](auctions.md) | embedded `auctionData` + `public/data/scouting/*.json` | 2,704 scouting / 3 auctions | Auctions (all 5 tabs) |
| [sponsors.md](sponsors.md) | `public/data/ipl-sponsors.json` | 7 title sponsors + partners | Sponsors, Home |
| [news.md](news.md) | `public/data/ipl-news.json` | 14 items | News, Home (featured hero) |
| [ipl-facts.md](ipl-facts.md) | `public/data/ipl-facts.json` | 15 milestones + 17 facts | Home, Education |

## Datasets not individually documented

These are large derived datasets — schemas noted where they're consumed, content is generated at build time:

| Path | Purpose | Referenced in |
|---|---|---|
| `public/data/bbb/season-YYYY.json` | Compact ball-by-ball (m/i/o/b/bat/bwl/br/er/tr). ~3k balls per season. | `matches.md` |
| `public/data/cap-race/season-YYYY.json` | Per-match Orange/Purple Cap progression (`{batting[], bowling[], matchDates[]}`). | `seasons.md` |
| `public/data/partnerships/season-YYYY.json` | Partnership records per wicket per match. | — |
| `public/data/scouting/bbl.json`, `psl.json`, … | Per-league scouting slices. | `auctions.md` |
| `public/data/player-photos.json` | Wikipedia photo URL mapping. | `players.md` |
| `public/data/coach-photos.json` | Coach photo URL mapping. | `coaches.md` |
| `public/data/manifest.json` | Build manifest — file sizes & modified times. | — |
| `public/data/squad-name-mapping.json` | Display name → player id mapping for squad resolution. | `squads.md` |

## Regenerating these docs

They're hand-authored against snapshots of each JSON file as of **2026-04-14**. Re-running the aggregation scripts in `scripts/` may change record counts; when it does, the relevant doc needs a manual pass to keep the tables in sync with the data.
