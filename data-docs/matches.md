# Matches

**Source:** `public/data/matches/season-YYYY.json` (one file per season, 2008–2026)
**Consumed by:** `Matches.tsx`, `MatchDetail.tsx`, `Schedule.tsx`, `SeasonDetail.tsx`, `LiveMatch.tsx`, plus aggregate services (`dataService`, `playerStatsService`, `teamAnalysisService`)
**Total matches across all seasons:** 1,193 entries (19 files)

## File layout

```
matches/
├── season-2008.json    (59 matches)
├── season-2009.json    (59 matches)
├── season-2010.json    (60 matches)
├── season-2011.json    (74 matches)
├── season-2012.json    (76 matches)
├── season-2013.json    (76 matches)
├── season-2014.json    (60 matches)
├── season-2015.json    (60 matches)
├── season-2016.json    (60 matches)
├── season-2017.json    (60 matches)
├── season-2018.json    (60 matches)
├── season-2019.json    (60 matches)
├── season-2020.json    (60 matches)
├── season-2021.json    (60 matches)
├── season-2022.json    (74 matches)
├── season-2023.json    (74 matches)
├── season-2024.json    (74 matches)
├── season-2025.json    (74 matches)
└── season-2026.json    (70 entries: 14 played + 56 upcoming fixtures)
```

Each file is an array of match objects. Ball-by-ball data (optional, heavier) lives in a parallel `bbb/season-YYYY.json` set — not this file.

## Schema

| Field | Type | Always present? | Notes |
|---|---|---|---|
| `id` | string | yes | Cricsheet match id or `2026-fixture-NNN` for placeholder fixtures |
| `season` | string | yes | `"2008"`–`"2026"` |
| `date` | string | yes | `YYYY-MM-DD` |
| `venue` | string | yes | Matches `venues.json` names |
| `city` | string | yes | — |
| `teams` | `[string, string]` | yes | Historical names as they appeared that season (e.g., "Royal Challengers Bangalore" pre-2024) |
| `tossWinner` | string | played matches | — |
| `tossDecision` | `"bat" \| "field"` | played matches | — |
| `winner` | string | played matches | Absent on future fixtures and true no-results |
| `winMargin` | `{runs?, wickets?}` | played matches | One of the two is set |
| `playerOfMatch` | string[] | most played matches | Cricsheet short names |
| `matchNumber` | number | yes | Fixture number within the season |
| `umpires` | string[] | most matches | Two on-field |
| `playoffStage` | string | playoffs only | `"Qualifier 1"`, `"Qualifier 2"`, `"Eliminator"`, `"Semi Final"`, `"3rd Place Play-Off"`, `"Final"` |
| `innings` | `Innings[]` | most matches | Summary only (no ball-by-ball) |
| `result` | string | special cases | e.g. `"no result"` |
| `abandoned` | boolean | rain-off | — |
| `abandonReason` | string | when abandoned | Free-text |
| `abandonType` | `"no_play" \| "partial_play"` | when abandoned | — |

Each `Innings` object:

```
{ team, runs, wickets, overs, extras }
```

## Sample — IPL 2026 Match 1 (played)

```json
{
  "id": "1527674",
  "season": "2026",
  "date": "2026-03-28",
  "venue": "M Chinnaswamy Stadium",
  "city": "Bengaluru",
  "teams": ["Sunrisers Hyderabad", "Royal Challengers Bengaluru"],
  "tossWinner": "Royal Challengers Bengaluru",
  "tossDecision": "field",
  "winner": "Royal Challengers Bengaluru",
  "winMargin": { "wickets": 6 },
  "playerOfMatch": ["JA Duffy"],
  "matchNumber": 1,
  "umpires": ["J Madanagopal", "UV Gandhe"],
  "innings": [
    { "team": "Sunrisers Hyderabad", "runs": 201, "wickets": 9, "overs": 20,   "extras":  6 },
    { "team": "Royal Challengers Bengaluru", "runs": 203, "wickets": 4, "overs": 15.4, "extras": 18 }
  ]
}
```

## Sample — IPL 2026 future fixture (no result yet)

```json
{
  "id": "2026-fixture-070",
  "season": "2026",
  "date": "2026-05-26",
  "venue": "Arun Jaitley Stadium",
  "city": "Delhi",
  "teams": ["Delhi Capitals", "Kolkata Knight Riders"],
  "matchNumber": 70
}
```

## Sample — Rain-abandoned match (IPL 2026 Match 12)

```json
{
  "id": "1527685",
  "season": "2026",
  "date": "2026-04-06",
  "teams": ["Kolkata Knight Riders", "Punjab Kings"],
  "tossWinner": "Kolkata Knight Riders",
  "tossDecision": "bat",
  "result": "no result",
  "innings": [
    { "team": "Kolkata Knight Riders", "runs": 25, "wickets": 2, "overs": 3.4, "extras": 0 }
  ],
  "abandoned": true,
  "abandonReason": "Match abandoned due to rain. KKR were 25/2 in 3.4 overs when rain stopped play",
  "abandonType": "partial_play"
}
```

## Finals — every IPL title match on record

| Year | Venue | Match | Winner | Margin | POM |
|---|---|---|---|---|---|
| 2008 | Dr DY Patil Sports Academy | CSK vs Rajasthan Royals | **Rajasthan Royals** | by 3 wkts | YK Pathan |
| 2009 | New Wanderers Stadium (Johannesburg) | RCB vs Deccan Chargers | **Deccan Chargers** | by 6 runs | A Kumble |
| 2010 | Dr DY Patil Sports Academy | CSK vs MI | **Chennai Super Kings** | by 22 runs | SK Raina |
| 2011 | MA Chidambaram Stadium | CSK vs RCB | **Chennai Super Kings** | by 58 runs | M Vijay |
| 2012 | MA Chidambaram Stadium | KKR vs CSK | **Kolkata Knight Riders** | by 5 wkts | MS Bisla |
| 2013 | Eden Gardens | CSK vs MI | **Mumbai Indians** | by 23 runs | KA Pollard |
| 2014 | M Chinnaswamy Stadium | KKR vs KXIP | **Kolkata Knight Riders** | by 3 wkts | MK Pandey |
| 2015 | Eden Gardens | MI vs CSK | **Mumbai Indians** | by 41 runs | RG Sharma |
| 2016 | M Chinnaswamy Stadium | RCB vs SRH | **Sunrisers Hyderabad** | by 8 runs | BCJ Cutting |
| 2017 | Rajiv Gandhi International Stadium | MI vs RPS | **Mumbai Indians** | by 1 run | KH Pandya |
| 2018 | Wankhede Stadium | SRH vs CSK | **Chennai Super Kings** | by 8 wkts | SR Watson |
| 2019 | Rajiv Gandhi International Stadium | MI vs CSK | **Mumbai Indians** | by 1 run | JJ Bumrah |
| 2020 | Dubai International Cricket Stadium | DC vs MI | **Mumbai Indians** | by 5 wkts | TA Boult |
| 2021 | Dubai International Cricket Stadium | CSK vs KKR | **Chennai Super Kings** | by 27 runs | F du Plessis |
| 2022 | Narendra Modi Stadium | RR vs GT | **Gujarat Titans** | by 7 wkts | HH Pandya |
| 2023 | Narendra Modi Stadium | GT vs CSK | **Chennai Super Kings** | by 5 wkts | DP Conway |
| 2024 | MA Chidambaram Stadium | SRH vs KKR | **Kolkata Knight Riders** | by 8 wkts | MA Starc |
| 2025 | Narendra Modi Stadium | RCB vs PBKS | **Royal Challengers Bengaluru** | by 6 runs | KH Pandya |
| 2026 | *— season in progress —* | | | | |

## Playoff format evolution

- **2008–2010:** 4-team playoffs — two semi-finals + final (3rd-place play-off added in 2010 only).
- **2011–present:** Q1 / Eliminator / Q2 / Final — top two get a second chance if they lose Q1.

## Notes

- `teams`, `winner`, and `tossWinner` use **historical** franchise names. Example: RCB appears as `Royal Challengers Bangalore` in 2008–2023 files and `Royal Challengers Bengaluru` from 2024 onward. The frontend resolves these through `teams.json` `aliases[]`.
- `2026-fixture-NNN` IDs are placeholder fixtures — once a match is played, the entry is replaced with the real Cricsheet match id and populated fields.
- Rain-off and COVID-disrupted matches carry `abandoned: true` with an `abandonType` of `no_play` (no overs bowled) or `partial_play` (bowled but rain-off before DLS cut-off).
- Heavier ball-by-ball payloads live in `bbb/season-YYYY.json` and are loaded on demand by the worker/services — see `manifest.json` for file sizes.
