# Teams

**Source:** `public/data/teams.json`
**Consumed by:** `Teams.tsx`, `TeamDetail.tsx`, team badges across the app
**Records:** 15 franchises (2008–2026, active + defunct)

## Schema

| Field | Type | Notes |
|---|---|---|
| `id` | string | URL-safe slug (e.g. `royal-challengers-bengaluru`) |
| `name` | string | Current official name |
| `shortName` | string | 2–4 letter code (RCB, CSK…) |
| `primaryColor` | hex | Brand primary |
| `secondaryColor` | hex | Brand accent |
| `homeVenue` | string | Current or last home ground |
| `seasons` | string[] | Years the team participated |
| `isDefunct` | boolean | `true` if no longer in IPL |
| `aliases` | string[] | Previous names used in historical data |

## Active franchises (10)

| Short | Name | Primary | Secondary | Home Venue | Seasons | Aliases |
|---|---|---|---|---|---|---|
| RCB | Royal Challengers Bengaluru | `#EF3340` | `#D4AF37` | M Chinnaswamy Stadium | 2008–2026 | Royal Challengers Bangalore |
| KKR | Kolkata Knight Riders | `#7B5EA7` | `#D4A84B` | M Chinnaswamy Stadium | 2008–2026 | — |
| PBKS | Punjab Kings | `#ED1B24` | `#C0C0C0` | PCA IS Bindra Stadium | 2008–2026 | Kings XI Punjab |
| CSK | Chennai Super Kings | `#FFD130` | `#3B9AE8` | PCA IS Bindra Stadium | 2008–2015, 2018–2026 | — |
| DC | Delhi Capitals | `#4B8FE2` | `#EF4444` | Feroz Shah Kotla | 2008–2026 | Delhi Daredevils |
| RR | Rajasthan Royals | `#5B8FD4` | `#CBA92B` | Feroz Shah Kotla | 2008–2015, 2018–2026 | — |
| MI | Mumbai Indians | `#2B7FD4` | `#D4AF37` | Wankhede Stadium | 2008–2026 | — |
| SRH | Sunrisers Hyderabad | `#FF822A` | `#E54B17` | Rajiv Gandhi Intl Stadium | 2013–2026 | — |
| LSG | Lucknow Super Giants | `#D94070` | `#FFD700` | Wankhede Stadium | 2022–2026 | — |
| GT | Gujarat Titans | `#7DD3E8` | `#1C1C1C` | Wankhede Stadium | 2022–2026 | — |

## Defunct franchises (5)

| Short | Name | Primary | Secondary | Home Venue | Seasons |
|---|---|---|---|---|---|
| DCH | Deccan Chargers | `#5B8FBF` | `#C0C0C0` | Eden Gardens | 2008–2012 |
| KTK | Kochi Tuskers Kerala | `#9B59E8` | `#FFD700` | Nehru Stadium | 2011 |
| PW  | Pune Warriors | `#4BB8F0` | `#D0D0D0` | Dr DY Patil Sports Academy | 2011–2013 |
| RPS | Rising Pune Supergiant | `#9B59E8` | `#D1C4E9` | Wankhede Stadium | 2016–2017 |
| GL  | Gujarat Lions | `#F06830` | `#1A1A2E` | PCA IS Bindra Stadium | 2016–2017 |

## Notes

- CSK and RR missed 2016–2017 due to a two-year suspension (spot-fixing fallout); their slots were filled by RPS and GL.
- RCB aliased as "Royal Challengers Bangalore" in pre-2024 match data.
- DC aliased as "Delhi Daredevils" in pre-2019 match data.
- PBKS aliased as "Kings XI Punjab" in pre-2021 match data.
