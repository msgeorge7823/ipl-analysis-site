# Seasons

**Source:** `public/data/seasons.json`
**Consumed by:** `Seasons.tsx`, `SeasonDetail.tsx`, Records page, Home page
**Records:** 19 seasons (2008–2026, 2026 ongoing)

## Schema

| Field | Type | Notes |
|---|---|---|
| `year` | string | "2008"–"2026" |
| `winner` | string | Champion team (absent if `isOngoing: true`) |
| `isOngoing` | boolean | `true` only for the live season |
| `matchCount` | number | Scheduled matches that season |
| `matchesWithData` | number | How many have ball-by-ball data available |
| `teams` | string[] | Competing teams (historical names as they appeared) |
| `orangeCap` | `{ player, shortName, runs }` | Most runs of the season |
| `purpleCap` | `{ player, shortName, wickets }` | Most wickets of the season |

## Season summary

| Year | Winner | Matches | Orange Cap | Runs | Purple Cap | Wkts |
|---|---|---:|---|---:|---|---:|
| 2008 | Rajasthan Royals | 59 | SE Marsh | 616 | Sohail Tanvir | 22 |
| 2009 | Deccan Chargers | 59 | ML Hayden | 572 | RP Singh | 23 |
| 2010 | Chennai Super Kings | 60 | SR Tendulkar | 618 | PP Ojha | 21 |
| 2011 | Chennai Super Kings | 74 | CH Gayle | 608 | SL Malinga | 28 |
| 2012 | Kolkata Knight Riders | 76 | CH Gayle | 733 | M Morkel | 25 |
| 2013 | Mumbai Indians | 76 | MEK Hussey | 733 | DJ Bravo | 32 |
| 2014 | Kolkata Knight Riders | 60 | RV Uthappa | 660 | MM Sharma | 23 |
| 2015 | Mumbai Indians | 60 | DA Warner | 562 | DJ Bravo | 26 |
| 2016 | Sunrisers Hyderabad | 60 | V Kohli | **973** | B Kumar | 23 |
| 2017 | Mumbai Indians | 60 | DA Warner | 641 | B Kumar | 26 |
| 2018 | Chennai Super Kings | 60 | KS Williamson | 735 | AJ Tye | 24 |
| 2019 | Mumbai Indians | 60 | DA Warner | 692 | Imran Tahir | 26 |
| 2020 | Mumbai Indians | 60 | KL Rahul | 676 | K Rabada | 32 |
| 2021 | Chennai Super Kings | 60 | RD Gaikwad | 635 | HV Patel | 32 |
| 2022 | Gujarat Titans | 74 | JC Buttler | 863 | YS Chahal | 27 |
| 2023 | Chennai Super Kings | 74 | Shubman Gill | 890 | Mohammed Shami | 28 |
| 2024 | Kolkata Knight Riders | 74 | V Kohli | 741 | HV Patel | 24 |
| 2025 | Royal Challengers Bengaluru | 74 | B Sai Sudharsan | 759 | M Prasidh Krishna | 25 |
| 2026 | *(ongoing)* | 74 | YBK Jaiswal | 170* | Ravi Bishnoi | 7* |

*2026 Orange/Purple Cap numbers are live partial totals through the matches played so far.*

## Team participation per season

| Year | Teams | Notes |
|---|---|---|
| 2008 | CSK, DCH, DD, KKR, MI, KXIP, RR, RCB | Inaugural season (8 teams) |
| 2009 | Same 8 | Hosted in **South Africa** (Indian elections) |
| 2010 | Same 8 | |
| 2011 | 8 + KTK + PW | 10 teams — Kochi and Pune added |
| 2012 | 9 (KTK dropped) | |
| 2013 | 9 (DCH → SRH) | |
| 2014 | 8 | PW contract terminated |
| 2015 | 8 | |
| 2016 | 8 (CSK/RR banned → GL + RPS) | |
| 2017 | 8 (GL + RPS continue) | |
| 2018 | 8 (GL + RPS out, CSK/RR return) | |
| 2019 | 8 (DD → DC) | |
| 2020 | 8 | Hosted in **UAE** (COVID) |
| 2021 | 8 (KXIP → PBKS) | India + UAE split |
| 2022 | 10 (GT + LSG added) | |
| 2023 | 10 | |
| 2024 | 10 (RCB → RCB rebrand Bengaluru) | |
| 2025 | 10 | |
| 2026 | 10 | Current season (ongoing) |

## Notes

- `matchesWithData` equals or is just below `matchCount` because a handful of rain-abandoned matches (e.g., 2008 RR vs KKR) have no complete scorecards in the source dataset.
- `isOngoing: true` controls the "LIVE" badge on the Home page and the Seasons list.
- Winner is omitted intentionally while ongoing — Ratings and Records pages fall back on historical rows only.
