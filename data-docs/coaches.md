# Coaches

**Source:** `public/data/coaches.json`
**Consumed by:** `Coaches.tsx`, `CoachDetail.tsx`, Team pages' coach strip
**Total coaches:** 166 (head coaches + support staff across every franchise, 2008–2026)
**Total tenures:** 236 across 17 franchises (including defunct)
**Phase status (from file):** All phases complete — head coaches, support staff, defunct franchises, and Phase 3 (physios / trainers / analysts / team managers / CEOs / doctors).

## Schema

Top-level object:

```
{
  _description: string,
  _phase: string,
  _updated: string,
  coaches: Coach[]
}
```

Each `Coach` record:

| Field | Type | Notes |
|---|---|---|
| `id` | string | Slug (e.g. `kepler-wessels`) |
| `name` | string | Display name |
| `fullName` | string | Full legal name |
| `dob` | string | `YYYY-MM-DD` |
| `nationality` | string | e.g. Indian, Australian, New Zealander |
| `specialty` | string[] | `batting`, `bowling`, `fielding`, `strategy`, etc. |
| `playingCareerSummary` | string | One-para summary of playing career |
| `bio` | string | Multi-line biography |
| `tenures` | `Tenure[]` | One entry per stint at a franchise in a role |
| `careerTotals` | object | Aggregated across all tenures |
| `otherCoachingRoles` | string[] | Non-IPL coaching roles |
| `sources` | string[] | Citations |
| `verified` | boolean | `false` = flagged for user review |

Each `Tenure` record:

| Field | Type | Notes |
|---|---|---|
| `team` | string | Franchise name as used in match data |
| `role` | enum | `head-coach`, `assistant-coach`, `bowling-coach`, `batting-coach`, `fielding-coach`, `mentor`, `director-of-cricket`, `fast-bowling-coach`, `spin-bowling-coach`, `bowling-consultant`, `strength-conditioning`, `trainer`, `physio`, `analyst`, `team-manager` |
| `fromSeason` / `toSeason` | string | Year range |
| `seasons` | string[] | Explicit list (handles gap years) |
| `perSeason[]` | object[] | League/playoffs M-W-L-NR + `winPct` + `finish` + `notes` per year |
| `aggregate` | object | Totals across the tenure — `league`, `playoffs`, `titles`, `finalsReached`, `playoffAppearances` |
| `verified` | boolean | Per-tenure citation status |
| `sources` | string[] | Tenure-specific sources |

## Coaching staff breakdown by role (tenures)

| Role | Tenures |
|---|---:|
| head-coach | 65 |
| bowling-coach | 26 |
| team-manager | 26 |
| assistant-coach | 24 |
| fielding-coach | 22 |
| batting-coach | 18 |
| mentor | 11 |
| strength-conditioning | 10 |
| physio | 9 |
| fast-bowling-coach | 7 |
| director-of-cricket | 6 |
| spin-bowling-coach | 6 |
| trainer | 3 |
| analyst | 2 |
| bowling-consultant | 1 |

## Nationality mix (all 166 coaches)

| Nationality | Count |
|---|---:|
| Indian | 73 |
| Australian | 38 |
| South African | 18 |
| New Zealander | 12 |
| English | 7 |
| Sri Lankan | 5 |
| Trinidadian (West Indian) | 4 |
| Zimbabwean | 1 |
| Sri Lankan / Australian | 1 |
| Dutch | 1 |
| *(others balance)* | — |

## Tenures per franchise

| Franchise | Tenures |
|---|---:|
| Kolkata Knight Riders | 28 |
| Royal Challengers Bengaluru | 26 |
| Mumbai Indians | 25 |
| Kings XI Punjab | 22 |
| Sunrisers Hyderabad | 22 |
| Delhi Capitals | 21 |
| Rajasthan Royals | 20 |
| Chennai Super Kings | 18 |
| Punjab Kings | 15 |
| Lucknow Super Giants | 13 |
| Gujarat Titans | 12 |
| Delhi Daredevils | 5 |
| Rising Pune Supergiant | 3 |
| Deccan Chargers | 2 |
| Pune Warriors India | 2 |
| Gujarat Lions | 1 |
| Kochi Tuskers Kerala | 1 |

---

## Head coaches — complete history by franchise

*Columns: Years · Nationality · League M/W (Win %) · Titles · Finals*

### Chennai Super Kings

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2008 | Kepler Wessels | South African | 14 | 8 | 57.1% | 0 | 1 |
| 2009–2026 | **Stephen Fleming** | New Zealander | 214 | 120 | 56.1% | **5** | **9** |

### Mumbai Indians

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2008 | Lalchand Rajput | Indian | 14 | 7 | 50.0% | 0 | 0 |
| 2009 | Shaun Pollock | South African | 14 | 5 | 35.7% | 0 | 0 |
| 2010–2012 | Robin Singh | Indian | 44 | 29 | 65.9% | 0 | 1 |
| 2013–2014 | John Wright | New Zealander | 30 | 18 | 60.0% | 1 | 1 |
| 2015–2016 | Ricky Ponting | Australian | 28 | 15 | 53.6% | 1 | 1 |
| 2017–2022 | **Mahela Jayawardene** | Sri Lankan | 84 | 45 | 53.6% | **3** | **3** |
| 2023–2024 | Mark Boucher | South African | 28 | 12 | 42.9% | 0 | 0 |
| 2025–2026 | Mahela Jayawardene (return) | Sri Lankan | 14 | 8 | 57.1% | 0 | 0 |

### Kolkata Knight Riders

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2008–2009 | John Buchanan | Australian | 28 | 9 | 32.1% | 0 | 0 |
| 2010–2011 | Dav Whatmore | Sri Lankan / Australian | 28 | 15 | 53.6% | 0 | 0 |
| 2012–2015 | **Trevor Bayliss** | Australian | 60 | 33 | 55.0% | **2** | 2 |
| 2016–2019 | Jacques Kallis | South African | 56 | 30 | 53.6% | 0 | 0 |
| 2020–2022 | Brendon McCullum | New Zealander | 42 | 20 | 47.6% | 0 | 1 |
| 2023–2025 | Chandrakant Pandit | Indian | 42 | 20 | 47.6% | 1 | 1 |
| 2026 | Abhishek Nayar | Indian | — | — | — | 0 | 0 |

### Royal Challengers Bengaluru

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2008 | Venkatesh Prasad | Indian | 14 | 4 | 28.6% | 0 | 0 |
| 2009–2013 | Ray Jennings | South African | 74 | 41 | 55.4% | 0 | 2 |
| 2014–2018 | Daniel Vettori | New Zealander | 70 | 29 | 41.4% | 0 | 1 |
| 2019 | Gary Kirsten | South African | 14 | 5 | 35.7% | 0 | 0 |
| 2020–2021 | Simon Katich | Australian | 28 | 16 | 57.1% | 0 | 0 |
| 2022–2023 | Sanjay Bangar | Indian | 28 | 15 | 53.6% | 0 | 0 |
| 2024–2026 | **Andy Flower** | Zimbabwean | 28 | 16 | 57.1% | **1** (2025) | 1 |

### Delhi Capitals (2019–present) & Delhi Daredevils (2008–2018)

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2008–2011 | Greg Shipperd | Australian | 56 | 28 | 50.0% | 0 | 0 |
| 2012–2013 | Eric Simons | South African | 32 | 14 | 43.8% | 0 | 0 |
| 2014–2015 | Gary Kirsten | South African | 28 | 6 | 21.4% | 0 | 0 |
| 2016–2017 | Paddy Upton | South African | 28 | 13 | 46.4% | 0 | 0 |
| 2018 | Ricky Ponting | Australian | 14 | 5 | 35.7% | 0 | 0 |
| 2019–2024 | Ricky Ponting (cont.) | Australian | 84 | 46 | 54.8% | 0 | 1 |
| 2025–2026 | Hemang Badani | Indian | 14 | 7 | 50.0% | 0 | 0 |

### Kings XI Punjab (2008–2020) & Punjab Kings (2021–present)

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2008–2010 | Tom Moody | Australian | 42 | 21 | 50.0% | 0 | 0 |
| 2011 | Michael Bevan | Australian | 14 | 7 | 50.0% | 0 | 0 |
| 2012 | Adam Gilchrist | Australian | 16 | 8 | 50.0% | 0 | 0 |
| 2013 | Darren Lehmann | Australian | 16 | 8 | 50.0% | 0 | 0 |
| 2014–2016 | Sanjay Bangar | Indian | 42 | 18 | 42.9% | 0 | 1 |
| 2017 | Virender Sehwag | Indian | 14 | 7 | 50.0% | 0 | 0 |
| 2018 | Brad Hodge | Australian | 14 | 6 | 42.9% | 0 | 0 |
| 2019 | Mike Hesson | New Zealander | 14 | 6 | 42.9% | 0 | 0 |
| 2020 | Anil Kumble | Indian | 14 | 6 | 42.9% | 0 | 0 |
| 2021–2022 | Anil Kumble (cont.) | Indian | 28 | 13 | 46.4% | 0 | 0 |
| 2023–2024 | Trevor Bayliss | Australian | 28 | 11 | 39.3% | 0 | 0 |
| 2025–2026 | Ricky Ponting | Australian | 14 | 9 | 64.3% | 0 | 1 |

### Rajasthan Royals

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2008–2012 | **Shane Warne** (captain-coach) | Australian | 72 | 36 | 50.0% | **1** (2008) | 1 |
| 2013–2015 | Paddy Upton | South African | 44 | 24 | 54.5% | 0 | 0 |
| 2018–2019 | Paddy Upton (return) | South African | 28 | 12 | 42.9% | 0 | 0 |
| 2020 | Andrew McDonald | Australian | 14 | 6 | 42.9% | 0 | 0 |
| 2021–2024 | Kumar Sangakkara | Sri Lankan | 56 | 29 | 51.8% | 0 | 1 |
| 2025 | Rahul Dravid | Indian | 14 | 4 | 28.6% | 0 | 0 |
| 2026 | Kumar Sangakkara (return) | Sri Lankan | — | — | — | 0 | 0 |

### Sunrisers Hyderabad

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2013–2019 | **Tom Moody** | Australian | 100 | 54 | 54.0% | **1** (2016) | 2 |
| 2020–2021 | Trevor Bayliss | Australian | 28 | 10 | 35.7% | 0 | 0 |
| 2022 | Tom Moody (return) | Australian | 14 | 6 | 42.9% | 0 | 0 |
| 2023 | Brian Lara | Trinidadian (WI) | 14 | 4 | 28.6% | 0 | 0 |
| 2024–2026 | Daniel Vettori | New Zealander | 28 | 14 | 50.0% | 0 | 1 |

### Deccan Chargers (defunct 2008–2012)

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2008 | Robin Singh | Indian | 14 | 2 | 14.3% | 0 | 0 |
| 2009–2012 | **Darren Lehmann** | Australian | 58 | 25 | 43.1% | **1** (2009) | 1 |

### Lucknow Super Giants

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2022–2023 | Andy Flower | Zimbabwean | 28 | 17 | 60.7% | 0 | 0 |
| 2024–2026 | Justin Langer | Australian | 28 | 13 | 46.4% | 0 | 0 |

### Gujarat Titans

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2022–2026 | **Ashish Nehra** | Indian | 56 | 34 | 60.7% | **1** (2022) | 2 |

### Gujarat Lions (defunct 2016–2017)

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2016–2017 | Brad Hodge | Australian | 28 | 13 | 46.4% | 0 | 0 |

### Rising Pune Supergiant (defunct 2016–2017)

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2016–2017 | Stephen Fleming (on-loan from CSK ban) | New Zealander | 28 | 14 | 50.0% | 0 | 1 |

### Pune Warriors India (defunct 2011–2013)

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2011 | Geoff Marsh | Australian | 14 | 4 | 28.6% | 0 | 0 |
| 2012–2013 | Allan Donald | South African | 32 | 8 | 25.0% | 0 | 0 |

### Kochi Tuskers Kerala (defunct 2011)

| Years | Coach | Nationality | M | W | Win % | Titles | Finals |
|---|---|---|---:|---:|---:|---:|---:|
| 2011 | Geoff Lawson | Australian | 14 | 6 | 42.9% | 0 | 0 |

## Notes

- **65 distinct head-coach tenures** across 17 franchises. Support-staff tenures (assistants, bowling, fielding, physios, analysts, team managers, CEOs) account for the remaining 171 tenures — too many to list per-franchise here; read them via `coaches.json` directly.
- `verified: true` on a coach/tenure means the tenure has been cited from at least one of Wikipedia, ESPNcricinfo, Sportskeeda, or official press releases.
- Memory note: an earlier snapshot recorded "121 coaches across 15 franchises" — the file has since grown to 166 coaches across 17 franchises (Phase 3 backfilled physios/trainers/analysts/CEOs/doctors and added the two 2011-only Kochi + PWI staffs).
