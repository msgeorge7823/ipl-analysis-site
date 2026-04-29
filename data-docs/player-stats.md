# Player Stats

**Sources:**
- `public/data/player-stats.json` — aggregated stats (786 players who have batted or bowled at least once)
- `public/data/players.json` — used to left-join the 50 zero-stat players who are registered but haven't taken the field yet

**Consumed by:** `Analytics.tsx`, `Ratings.tsx`, `Records.tsx`, `PlayerDetail.tsx`
**Records shown below:** 836 — every one of the 836 players in `players.json`, regardless of whether they have played

## Schema

| Field | Type | Notes |
|---|---|---|
| `playerId` | string | Joins to `players.json:id` |
| `playerName` | string | Full display name |
| `shortName` | string | Scorecard-style short name |
| `nicknames` | string[] | Alternative names |
| `role` | enum | `Batter` / `Bowler` / `All-rounder` / `WK-Batter` |
| `matches` | number | Total matches played |
| `inningsBat` | number | Innings batted |
| `inningsBowl` | number | Innings bowled |
| `runs` | number | Career runs |
| `ballsFaced` | number | Career balls faced |
| `fours` | number | — |
| `sixes` | number | — |
| `highScore` | number | Best individual score |
| `highScoreNotOut` | boolean | `true` if the HS innings ended not-out |
| `battingAvg` | number | Runs ÷ (innings – notOuts) |
| `strikeRate` | number | Runs ÷ ballsFaced × 100 |
| `fifties` | number | Scores 50–99 |
| `hundreds` | number | Scores ≥100 |
| `ducks` | number | Scores of 0 |
| `notOuts` | number | — |
| `wickets` | number | Career wickets |
| `ballsBowled` | number | — |
| `runsConceded` | number | — |
| `economy` | number | Runs per over bowled |
| `bowlingAvg` | number | Runs ÷ wickets |
| `bowlingSR` | number | Balls ÷ wickets |
| `bestBowling` | string | `"W/R"` e.g. `"6/12"` |
| `threeWickets` | number | 3-wicket hauls |
| `fiveWickets` | number | 5-wicket hauls |
| `maidens` | number | — |
| `dots` | number | Dot balls bowled |
| `catches` | number | Fielding catches |
| `stumpings` | number | — |
| `runOuts` | number | — |

## Derived rating

`ratingService.ts` computes a 0–1000 ICC-style rating live from this data — the score is **not** stored in the JSON. Lifecycle rules (retired vs active, historical from 2008) are applied in `src/services/ratingService.ts`.

---

Three complete tables follow — **every one of the 836 players** with their full batting, bowling, and fielding stats. Players are sorted alphabetically by `shortName` so the same player sits at the same row number across all three tables. Players with no innings yet (2026 registered-but-unplayed debutants) show as zero rows — `player-stats.json` has 786 rows, and the 50 zero-filled rows are marked with a † in the `M` column.

## Batting — all 836 players

| # | Player | Role | M | Inns | NO | Runs | BF | 4s | 6s | HS | Avg | SR | 50 | 100 | Ducks |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---|---:|---:|---:|---:|---:|
| 1 | A Ankolekar | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 2 | A Ashish Reddy | Bowler | 31 | 23 | 8 | 280 | 193 | 16 | 15 | 36* | 18.67 | 145.08 | 0 | 0 | 0 |
| 3 | A Badoni | All-rounder | 58 | 48 | 10 | 975 | 707 | 74 | 38 | 74 | 25.66 | 137.91 | 6 | 0 | 3 |
| 4 | A Chandila | Bowler | 12 | 2 | 2 | 4 | 7 | 0 | 0 | 4* | 4 | 57.14 | 0 | 0 | 0 |
| 5 | A Chopra | Batter | 7 | 6 | 0 | 53 | 71 | 7 | 0 | 24 | 8.83 | 74.65 | 0 | 0 | 0 |
| 6 | A Choudhary | Batter | 5 | 3 | 2 | 25 | 20 | 1 | 1 | 15* | 25 | 125 | 0 | 0 | 0 |
| 7 | A Dananjaya | Batter | 1 | 1 | 1 | 4 | 5 | 0 | 0 | 4* | 4 | 80 | 0 | 0 | 0 |
| 8 | A Flintoff | Batter | 3 | 3 | 1 | 62 | 53 | 5 | 2 | 24 | 31 | 116.98 | 0 | 0 | 0 |
| 9 | A Kamboj | Bowler | 14 | 8 | 6 | 42 | 36 | 4 | 1 | 19* | 21 | 116.67 | 0 | 0 | 1 |
| 10 | A Kumar | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 11 | A Kumble | Bowler | 42 | 15 | 12 | 35 | 47 | 3 | 0 | 8 | 11.67 | 74.47 | 0 | 0 | 0 |
| 12 | A Mandal | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 13 | A Manohar | Batter | 27 | 20 | 1 | 292 | 235 | 23 | 14 | 43 | 15.37 | 124.26 | 0 | 0 | 2 |
| 14 | A Mhatre | Batter | 10 | 10 | 0 | 314 | 174 | 37 | 16 | 94 | 31.4 | 180.46 | 2 | 0 | 2 |
| 15 | A Mishra | Bowler | 162 | 55 | 25 | 381 | 419 | 31 | 5 | 31 | 12.7 | 90.93 | 0 | 0 | 8 |
| 16 | A Mithun | All-rounder | 16 | 6 | 1 | 34 | 26 | 4 | 1 | 11 | 6.8 | 130.77 | 0 | 0 | 1 |
| 17 | A Mukund | Batter | 3 | 2 | 0 | 19 | 22 | 1 | 0 | 19 | 9.5 | 86.36 | 0 | 0 | 1 |
| 18 | A Nabi | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 19 | A Nehra | Bowler | 88 | 17 | 10 | 41 | 62 | 3 | 1 | 22* | 5.86 | 66.13 | 0 | 0 | 5 |
| 20 | A Nel | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 21 | A Nortje | Bowler | 49 | 14 | 7 | 49 | 50 | 6 | 0 | 23* | 7 | 98 | 0 | 0 | 3 |
| 22 | A Perala | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 23 | A Raghuvanshi | Batter | 25 | 21 | 3 | 573 | 385 | 58 | 20 | 54 | 31.83 | 148.83 | 4 | 0 | 0 |
| 24 | A Raghuwanshi | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 25 | A Singh | Bowler | 23 | 5 | 1 | 2 | 10 | 0 | 0 | 1* | 0.5 | 20 | 0 | 0 | 3 |
| 26 | A Symonds | All-rounder | 39 | 36 | 9 | 974 | 750 | 74 | 41 | 117* | 36.07 | 129.87 | 5 | 1 | 0 |
| 27 | A Tomar | Batter | 1 | 1 | 0 | 4 | 8 | 1 | 0 | 4 | 4 | 50 | 0 | 0 | 0 |
| 28 | A Uniyal | Batter | 2 | 2 | 1 | 4 | 7 | 0 | 0 | 4* | 4 | 57.14 | 0 | 0 | 1 |
| 29 | A Zampa | Bowler | 22 | 5 | 0 | 15 | 24 | 1 | 0 | 7 | 3 | 62.5 | 0 | 0 | 1 |
| 30 | AA Bilakhia | Batter | 7 | 7 | 2 | 69 | 85 | 5 | 0 | 22 | 13.8 | 81.18 | 0 | 0 | 0 |
| 31 | AA Chavan | All-rounder | 13 | 3 | 1 | 12 | 11 | 2 | 0 | 7* | 6 | 109.09 | 0 | 0 | 0 |
| 32 | AA Jhunjhunwala | Batter | 21 | 15 | 2 | 217 | 210 | 19 | 5 | 53* | 16.69 | 103.33 | 1 | 0 | 1 |
| 33 | AA Kazi | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 34 | AA Kulkarni | Batter | 2 | 2 | 0 | 9 | 8 | 2 | 0 | 9 | 4.5 | 112.5 | 0 | 0 | 1 |
| 35 | AA Noffke | Batter | 1 | 1 | 0 | 9 | 10 | 1 | 0 | 9 | 9 | 90 | 0 | 0 | 0 |
| 36 | AB Agarkar | Bowler | 42 | 18 | 9 | 179 | 154 | 13 | 5 | 39 | 19.89 | 116.23 | 0 | 0 | 0 |
| 37 | AB Barath | Batter | 3 | 3 | 1 | 42 | 42 | 5 | 1 | 33 | 21 | 100 | 0 | 0 | 0 |
| 38 | AB de Villiers | Batter | 183 | 172 | 42 | 5181 | 3411 | 414 | 253 | 133* | 39.85 | 151.89 | 40 | 3 | 10 |
| 39 | AB Dinda | Bowler | 78 | 16 | 6 | 26 | 48 | 2 | 0 | 7 | 2.6 | 54.17 | 0 | 0 | 6 |
| 40 | AB McDonald | Bowler | 10 | 9 | 4 | 123 | 100 | 9 | 4 | 33* | 24.6 | 123 | 0 | 0 | 1 |
| 41 | Abdul Basith | Batter | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1* | 1 | 100 | 0 | 0 | 0 |
| 42 | Abdul Samad | All-rounder | 65 | 54 | 13 | 795 | 527 | 50 | 51 | 45 | 19.39 | 150.85 | 0 | 0 | 3 |
| 43 | Abdur Razzak | Batter | 1 | 1 | 1 | 0 | 2 | 0 | 0 | 0* | 0 | 0 | 0 | 0 | 0 |
| 44 | Abhinandan Singh | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 45 | Abhishek Sharma | All-rounder | 80 | 77 | 7 | 1871 | 1145 | 178 | 106 | 141 | 26.73 | 163.41 | 9 | 1 | 4 |
| 46 | Abishek Porel | WK-Batter | 32 | 29 | 3 | 661 | 441 | 65 | 27 | 65 | 25.42 | 149.89 | 3 | 0 | 2 |
| 47 | AC Blizzard | Batter | 7 | 7 | 0 | 120 | 90 | 21 | 2 | 51 | 17.14 | 133.33 | 1 | 0 | 1 |
| 48 | AC Gilchrist | WK-Batter | 80 | 80 | 4 | 2069 | 1495 | 239 | 92 | 109* | 27.22 | 138.39 | 11 | 2 | 7 |
| 49 | AC Thomas | Bowler | 15 | 4 | 2 | 20 | 19 | 1 | 1 | 12 | 10 | 105.26 | 0 | 0 | 0 |
| 50 | AC Voges | Batter | 9 | 7 | 3 | 181 | 143 | 15 | 3 | 45* | 45.25 | 126.57 | 0 | 0 | 0 |
| 51 | AD Hales | Batter | 6 | 6 | 0 | 148 | 118 | 13 | 6 | 45 | 24.67 | 125.42 | 0 | 0 | 0 |
| 52 | AD Mascarenhas | Bowler | 13 | 11 | 2 | 79 | 78 | 5 | 1 | 27 | 8.78 | 101.28 | 0 | 0 | 2 |
| 53 | AD Mathews | All-rounder | 49 | 41 | 11 | 724 | 575 | 44 | 29 | 65* | 24.13 | 125.91 | 1 | 0 | 2 |
| 54 | AD Nath | Batter | 14 | 10 | 0 | 90 | 98 | 7 | 2 | 24 | 9 | 91.84 | 0 | 0 | 1 |
| 55 | AD Russell | All-rounder | 139 | 115 | 20 | 2655 | 1525 | 187 | 223 | 88* | 27.95 | 174.1 | 12 | 0 | 6 |
| 56 | AF Milne | Bowler | 10 | 6 | 2 | 23 | 29 | 0 | 1 | 15 | 5.75 | 79.31 | 0 | 0 | 1 |
| 57 | AG Murtaza | All-rounder | 12 | 3 | 2 | 10 | 14 | 1 | 0 | 5 | 10 | 71.43 | 0 | 0 | 0 |
| 58 | AG Paunikar | Batter | 5 | 5 | 0 | 49 | 58 | 9 | 0 | 20 | 9.8 | 84.48 | 0 | 0 | 1 |
| 59 | AJ Finch | Batter | 92 | 91 | 7 | 2092 | 1635 | 214 | 78 | 88* | 24.9 | 127.95 | 15 | 0 | 8 |
| 60 | AJ Hosein | Batter | 1 | 1 | 1 | 16 | 10 | 1 | 1 | 16* | 16 | 160 | 0 | 0 | 0 |
| 61 | AJ Turner | Batter | 6 | 6 | 1 | 24 | 28 | 0 | 2 | 16 | 4.8 | 85.71 | 0 | 0 | 3 |
| 62 | AJ Tye | Bowler | 30 | 13 | 4 | 91 | 76 | 6 | 5 | 25 | 10.11 | 119.74 | 0 | 0 | 2 |
| 63 | AK Markram | Batter | 59 | 57 | 9 | 1496 | 1101 | 118 | 60 | 68* | 31.17 | 135.88 | 10 | 0 | 2 |
| 64 | Akash Deep | All-rounder | 14 | 5 | 2 | 25 | 14 | 2 | 2 | 17 | 8.33 | 178.57 | 0 | 0 | 2 |
| 65 | Akash Madhwal | Bowler | 17 | 2 | 2 | 8 | 14 | 0 | 0 | 4* | 8 | 57.14 | 0 | 0 | 0 |
| 66 | Akash Singh | Bowler | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 67 | AL Menaria | Batter | 29 | 23 | 2 | 401 | 356 | 24 | 18 | 40 | 19.1 | 112.64 | 0 | 0 | 1 |
| 68 | AM Ghazanfar | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 69 | AM Nayar | All-rounder | 60 | 50 | 12 | 672 | 577 | 55 | 20 | 45* | 17.68 | 116.46 | 0 | 0 | 3 |
| 70 | AM Rahane | Batter | 201 | 186 | 19 | 5115 | 4081 | 519 | 128 | 105* | 30.63 | 125.34 | 34 | 2 | 13 |
| 71 | AM Salvi | Bowler | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 72 | Aman Hakim Khan | Batter | 12 | 10 | 1 | 115 | 104 | 8 | 6 | 51 | 12.78 | 110.58 | 1 | 0 | 1 |
| 73 | AN Ahmed | Bowler | 17 | 6 | 5 | 36 | 26 | 4 | 1 | 18* | 36 | 138.46 | 0 | 0 | 0 |
| 74 | AN Ghosh | Batter | 2 | 2 | 0 | 7 | 8 | 1 | 0 | 7 | 3.5 | 87.5 | 0 | 0 | 1 |
| 75 | Anand Rajan | Bowler | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 76 | Aniket Verma | Batter | 17 | 15 | 4 | 282 | 169 | 15 | 24 | 74 | 25.64 | 166.86 | 1 | 0 | 0 |
| 77 | Anirudh Singh | Batter | 5 | 4 | 0 | 63 | 66 | 6 | 1 | 40 | 15.75 | 95.45 | 0 | 0 | 1 |
| 78 | Ankit Sharma | Bowler | 22 | 10 | 3 | 87 | 67 | 7 | 4 | 30 | 12.43 | 129.85 | 0 | 0 | 1 |
| 79 | Ankit Soni | Batter | 7 | 3 | 1 | 7 | 9 | 0 | 1 | 7* | 3.5 | 77.78 | 0 | 0 | 2 |
| 80 | Anmolpreet Singh | Batter | 9 | 9 | 0 | 139 | 115 | 19 | 3 | 36 | 15.44 | 120.87 | 0 | 0 | 1 |
| 81 | Anuj Rawat | WK-Batter | 24 | 21 | 5 | 318 | 267 | 26 | 14 | 66 | 19.88 | 119.1 | 1 | 0 | 4 |
| 82 | Anureet Singh | Bowler | 23 | 8 | 4 | 36 | 47 | 2 | 1 | 15 | 9 | 76.6 | 0 | 0 | 2 |
| 83 | AP Dole | Batter | 3 | 2 | 0 | 34 | 22 | 3 | 1 | 30 | 17 | 154.55 | 0 | 0 | 0 |
| 84 | AP Majumdar | Batter | 4 | 4 | 0 | 87 | 76 | 7 | 2 | 31 | 21.75 | 114.47 | 0 | 0 | 0 |
| 85 | AP Tare | WK-Batter | 35 | 27 | 3 | 339 | 273 | 40 | 11 | 59 | 14.13 | 124.18 | 1 | 0 | 5 |
| 86 | AR Bawne | Batter | 1 | 1 | 1 | 12 | 12 | 1 | 0 | 12* | 12 | 100 | 0 | 0 | 0 |
| 87 | AR Patel | All-rounder | 166 | 125 | 36 | 1918 | 1434 | 130 | 94 | 66 | 21.55 | 133.75 | 3 | 0 | 8 |
| 88 | Arjun Tendulkar | Bowler | 5 | 1 | 0 | 13 | 9 | 0 | 1 | 13 | 13 | 144.44 | 0 | 0 | 0 |
| 89 | Arshad Khan | Bowler | 19 | 11 | 5 | 124 | 88 | 6 | 9 | 58* | 20.67 | 140.91 | 1 | 0 | 1 |
| 90 | Arshdeep Singh | Bowler | 86 | 13 | 7 | 31 | 46 | 4 | 0 | 10* | 5.17 | 67.39 | 0 | 0 | 3 |
| 91 | AS Joseph | Bowler | 22 | 5 | 4 | 27 | 32 | 3 | 0 | 15* | 27 | 84.38 | 0 | 0 | 1 |
| 92 | AS Rajpoot | Bowler | 29 | 7 | 2 | 26 | 41 | 2 | 1 | 8 | 5.2 | 63.41 | 0 | 0 | 0 |
| 93 | AS Raut | Batter | 22 | 16 | 7 | 194 | 167 | 13 | 7 | 36* | 21.56 | 116.17 | 0 | 0 | 1 |
| 94 | AS Roy | All-rounder | 14 | 8 | 3 | 26 | 27 | 3 | 0 | 13* | 5.2 | 96.3 | 0 | 0 | 4 |
| 95 | AS Yadav | Batter | 8 | 6 | 1 | 49 | 39 | 5 | 2 | 16 | 9.8 | 125.64 | 0 | 0 | 1 |
| 96 | Ashok Sharma | Bowler | 3 | 1 | 1 | 0 | 1 | 0 | 0 | 0* | 0 | 0 | 0 | 0 | 0 |
| 97 | Ashutosh Sharma | All-rounder | 24 | 18 | 4 | 393 | 240 | 24 | 28 | 66* | 28.07 | 163.75 | 2 | 0 | 0 |
| 98 | Ashwani Kumar | Bowler | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 99 | AT Carey | Batter | 3 | 3 | 1 | 32 | 29 | 0 | 1 | 14* | 16 | 110.34 | 0 | 0 | 0 |
| 100 | AT Rayudu | Batter | 204 | 185 | 32 | 4348 | 3409 | 359 | 173 | 100* | 28.42 | 127.54 | 22 | 1 | 13 |
| 101 | Atharva Taide | Batter | 10 | 10 | 0 | 260 | 177 | 30 | 8 | 66 | 26 | 146.89 | 2 | 0 | 1 |
| 102 | AU Rashid | Bowler | 3 | 2 | 0 | 22 | 16 | 2 | 1 | 18 | 11 | 137.5 | 0 | 0 | 0 |
| 103 | AUK Pathan | Batter | 8 | 7 | 2 | 39 | 23 | 5 | 2 | 14 | 7.8 | 169.57 | 0 | 0 | 2 |
| 104 | Avesh Khan | Bowler | 76 | 12 | 10 | 62 | 37 | 6 | 4 | 19* | 31 | 167.57 | 0 | 0 | 1 |
| 105 | Azhar Mahmood | Bowler | 23 | 21 | 2 | 388 | 303 | 39 | 13 | 80 | 20.42 | 128.05 | 2 | 0 | 2 |
| 106 | Azmatullah Omarzai | All-rounder | 17 | 9 | 1 | 99 | 74 | 8 | 5 | 21* | 12.38 | 133.78 | 0 | 0 | 0 |
| 107 | B Akhil | All-rounder | 15 | 11 | 5 | 76 | 55 | 5 | 5 | 27* | 12.67 | 138.18 | 0 | 0 | 2 |
| 108 | B Carse | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 109 | B Chipli | Batter | 23 | 21 | 6 | 280 | 251 | 28 | 7 | 61* | 18.67 | 111.55 | 1 | 0 | 0 |
| 110 | B Dwarshuis | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 111 | B Geeves | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 112 | B Indrajith | Batter | 3 | 3 | 0 | 21 | 30 | 2 | 0 | 15 | 7 | 70 | 0 | 0 | 1 |
| 113 | B Kumar | Bowler | 192 | 71 | 33 | 320 | 351 | 31 | 3 | 27 | 8.42 | 91.17 | 0 | 0 | 6 |
| 114 | B Laughlin | All-rounder | 9 | 4 | 2 | 5 | 13 | 0 | 0 | 4* | 2.5 | 38.46 | 0 | 0 | 2 |
| 115 | B Lee | Bowler | 38 | 19 | 9 | 124 | 97 | 8 | 8 | 25 | 12.4 | 127.84 | 0 | 0 | 1 |
| 116 | B Muzarabani | Bowler | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 117 | B Sai Sudharsan | Batter | 43 | 43 | 4 | 1891 | 1291 | 196 | 56 | 108* | 48.49 | 146.48 | 13 | 2 | 0 |
| 118 | B Stanlake | All-rounder | 6 | 1 | 1 | 5 | 2 | 1 | 0 | 5* | 5 | 250 | 0 | 0 | 0 |
| 119 | B Sumanth | Batter | 5 | 4 | 3 | 35 | 37 | 3 | 0 | 16 | 35 | 94.59 | 0 | 0 | 0 |
| 120 | BA Bhatt | Bowler | 17 | 2 | 1 | 6 | 7 | 0 | 1 | 6* | 6 | 85.71 | 0 | 0 | 1 |
| 121 | BA Stokes | All-rounder | 45 | 43 | 5 | 935 | 698 | 81 | 32 | 107* | 24.61 | 133.95 | 2 | 2 | 3 |
| 122 | Basil Thampi | Bowler | 25 | 7 | 6 | 32 | 35 | 1 | 1 | 13* | 32 | 91.43 | 0 | 0 | 0 |
| 123 | BAW Mendis | All-rounder | 10 | 3 | 1 | 3 | 6 | 0 | 0 | 2 | 1.5 | 50 | 0 | 0 | 1 |
| 124 | BB McCullum | Batter | 109 | 111 | 7 | 2882 | 2190 | 293 | 130 | 158* | 27.71 | 131.6 | 13 | 2 | 6 |
| 125 | BB Samantray | Batter | 9 | 8 | 3 | 125 | 113 | 13 | 2 | 55 | 25 | 110.62 | 1 | 0 | 1 |
| 126 | BB Sran | Bowler | 24 | 7 | 6 | 10 | 14 | 0 | 0 | 3* | 10 | 71.43 | 0 | 0 | 0 |
| 127 | BCJ Cutting | All-rounder | 21 | 17 | 6 | 238 | 141 | 15 | 19 | 39* | 21.64 | 168.79 | 0 | 0 | 1 |
| 128 | BE Hendricks | All-rounder | 7 | 2 | 1 | 1 | 3 | 0 | 0 | 1* | 1 | 33.33 | 0 | 0 | 1 |
| 129 | Bipul Sharma | Bowler | 33 | 17 | 9 | 187 | 123 | 11 | 9 | 35* | 23.38 | 152.03 | 0 | 0 | 0 |
| 130 | BJ Haddin | Batter | 1 | 1 | 0 | 18 | 11 | 2 | 1 | 18 | 18 | 163.64 | 0 | 0 | 0 |
| 131 | BJ Hodge | All-rounder | 66 | 63 | 21 | 1400 | 1118 | 122 | 43 | 73 | 33.33 | 125.22 | 6 | 0 | 3 |
| 132 | BJ Rohrer | Batter | 8 | 9 | 2 | 193 | 141 | 21 | 5 | 64* | 27.57 | 136.88 | 1 | 0 | 1 |
| 133 | BKG Mendis | Batter | 1 | 1 | 0 | 20 | 10 | 1 | 2 | 20 | 20 | 200 | 0 | 0 | 0 |
| 134 | BMAJ Mendis | Batter | 3 | 3 | 0 | 23 | 27 | 0 | 0 | 12 | 7.67 | 85.19 | 0 | 0 | 1 |
| 135 | BR Dunk | Batter | 3 | 3 | 0 | 40 | 35 | 7 | 0 | 20 | 13.33 | 114.29 | 0 | 0 | 0 |
| 136 | BR Sharath | Batter | 1 | 1 | 0 | 2 | 5 | 0 | 0 | 2 | 2 | 40 | 0 | 0 | 0 |
| 137 | Brijesh Sharma | Bowler | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 138 | BW Hilfenhaus | Bowler | 17 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 139 | C Bosch | All-rounder | 4 | 3 | 1 | 58 | 36 | 5 | 3 | 27 | 29 | 161.11 | 0 | 0 | 0 |
| 140 | C Connolly | All-rounder | 3 | 2 | 1 | 108 | 66 | 11 | 5 | 72* | 108 | 163.64 | 1 | 0 | 0 |
| 141 | C de Grandhomme | All-rounder | 25 | 21 | 5 | 303 | 225 | 18 | 18 | 40 | 18.94 | 134.67 | 0 | 0 | 3 |
| 142 | C Ganapathy | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 143 | C Green | All-rounder | 32 | 31 | 11 | 731 | 474 | 64 | 33 | 100* | 36.55 | 154.22 | 2 | 1 | 0 |
| 144 | C Madan | Batter | 1 | 1 | 0 | 15 | 19 | 3 | 0 | 15 | 15 | 78.95 | 0 | 0 | 0 |
| 145 | C Munro | Batter | 13 | 11 | 0 | 177 | 141 | 19 | 8 | 40 | 16.09 | 125.53 | 0 | 0 | 1 |
| 146 | C Nanda | Batter | 3 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 147 | C Sakariya | Bowler | 20 | 7 | 1 | 20 | 31 | 3 | 0 | 7 | 3.33 | 64.52 | 0 | 0 | 1 |
| 148 | CA Ingram | Batter | 15 | 15 | 3 | 205 | 180 | 22 | 5 | 47 | 17.08 | 113.89 | 0 | 0 | 0 |
| 149 | CA Lynn | Batter | 42 | 42 | 3 | 1329 | 945 | 132 | 66 | 93* | 34.08 | 140.63 | 10 | 0 | 3 |
| 150 | CA Pujara | Batter | 30 | 22 | 3 | 390 | 391 | 50 | 4 | 51 | 20.53 | 99.74 | 1 | 0 | 1 |
| 151 | CH Gayle | Batter | 141 | 145 | 19 | 4997 | 3346 | 408 | 359 | 175* | 39.66 | 149.34 | 31 | 6 | 8 |
| 152 | CH Morris | All-rounder | 81 | 49 | 21 | 618 | 398 | 41 | 35 | 82* | 22.07 | 155.28 | 2 | 0 | 9 |
| 153 | CJ Anderson | All-rounder | 30 | 29 | 7 | 538 | 423 | 40 | 31 | 95* | 24.45 | 127.19 | 3 | 0 | 2 |
| 154 | CJ Dala | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 155 | CJ Ferguson | Batter | 9 | 8 | 2 | 98 | 117 | 9 | 0 | 23 | 16.33 | 83.76 | 0 | 0 | 0 |
| 156 | CJ Green | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 157 | CJ Jordan | Bowler | 34 | 12 | 2 | 81 | 77 | 3 | 3 | 30 | 8.1 | 105.19 | 0 | 0 | 1 |
| 158 | CJ McKay | Batter | 2 | 1 | 0 | 8 | 15 | 0 | 0 | 8 | 8 | 53.33 | 0 | 0 | 0 |
| 159 | CK Kapugedera | Batter | 5 | 3 | 0 | 16 | 23 | 0 | 0 | 8 | 5.33 | 69.57 | 0 | 0 | 1 |
| 160 | CK Langeveldt | Bowler | 7 | 2 | 0 | 8 | 9 | 0 | 1 | 8 | 4 | 88.89 | 0 | 0 | 1 |
| 161 | CL White | Batter | 47 | 46 | 10 | 971 | 760 | 76 | 38 | 78 | 26.97 | 127.76 | 6 | 0 | 4 |
| 162 | CM Gautam | WK-Batter | 13 | 13 | 3 | 169 | 150 | 17 | 6 | 33 | 16.9 | 112.67 | 0 | 0 | 0 |
| 163 | CR Brathwaite | All-rounder | 16 | 14 | 1 | 181 | 111 | 10 | 16 | 43* | 13.92 | 163.06 | 0 | 0 | 0 |
| 164 | CR Woakes | All-rounder | 21 | 12 | 6 | 78 | 77 | 7 | 2 | 18 | 13 | 101.3 | 0 | 0 | 0 |
| 165 | CRD Fernando | Bowler | 10 | 2 | 2 | 4 | 3 | 0 | 0 | 2* | 4 | 133.33 | 0 | 0 | 0 |
| 166 | CV Varun | Bowler | 85 | 12 | 7 | 26 | 48 | 2 | 0 | 10* | 5.2 | 54.17 | 0 | 0 | 2 |
| 167 | D Brevis | Batter | 16 | 16 | 0 | 455 | 297 | 30 | 33 | 57 | 28.44 | 153.2 | 2 | 0 | 2 |
| 168 | D du Preez | Batter | 2 | 1 | 0 | 10 | 13 | 0 | 0 | 10 | 10 | 76.92 | 0 | 0 | 0 |
| 169 | D Ferreira | Batter | 5 | 4 | 0 | 10 | 17 | 0 | 0 | 7 | 2.5 | 58.82 | 0 | 0 | 0 |
| 170 | D Jansen | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 171 | D Kalyankrishna | Batter | 3 | 1 | 0 | 3 | 8 | 0 | 0 | 3 | 3 | 37.5 | 0 | 0 | 0 |
| 172 | D Kamra | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 173 | D Malewar | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 174 | D Padikkal | Batter | 76 | 76 | 3 | 1917 | 1485 | 204 | 62 | 101* | 26.26 | 129.09 | 13 | 1 | 6 |
| 175 | D Pretorius | All-rounder | 7 | 5 | 1 | 44 | 28 | 3 | 3 | 22 | 11 | 157.14 | 0 | 0 | 1 |
| 176 | D Salunkhe | Batter | 6 | 3 | 1 | 33 | 24 | 5 | 0 | 26* | 16.5 | 137.5 | 0 | 0 | 0 |
| 177 | D Singh | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 178 | D Wiese | Bowler | 18 | 11 | 6 | 148 | 101 | 12 | 7 | 47* | 29.6 | 146.53 | 0 | 0 | 0 |
| 179 | DA Miller | Batter | 144 | 136 | 50 | 3139 | 2259 | 227 | 141 | 101* | 36.5 | 138.96 | 13 | 1 | 4 |
| 180 | DA Payne | All-rounder | 2 | 1 | 1 | 6 | 5 | 0 | 0 | 6* | 6 | 120 | 0 | 0 | 0 |
| 181 | DA Warner | Batter | 184 | 187 | 23 | 6567 | 4702 | 663 | 236 | 126 | 40.04 | 139.66 | 62 | 4 | 13 |
| 182 | DAJ Bracewell | Batter | 1 | 1 | 1 | 12 | 9 | 1 | 0 | 12* | 12 | 133.33 | 0 | 0 | 0 |
| 183 | DB Das | Batter | 31 | 22 | 8 | 304 | 261 | 23 | 16 | 35* | 21.71 | 116.48 | 0 | 0 | 1 |
| 184 | DB Ravi Teja | Batter | 32 | 25 | 6 | 375 | 317 | 35 | 9 | 60 | 19.74 | 118.3 | 1 | 0 | 1 |
| 185 | DE Bollinger | Bowler | 27 | 4 | 3 | 21 | 23 | 1 | 1 | 16* | 21 | 91.3 | 0 | 0 | 0 |
| 186 | DG Nalkande | All-rounder | 6 | 2 | 0 | 12 | 12 | 0 | 1 | 12 | 6 | 100 | 0 | 0 | 1 |
| 187 | DH Yagnik | WK-Batter | 25 | 17 | 7 | 170 | 137 | 23 | 2 | 34 | 17 | 124.09 | 0 | 0 | 1 |
| 188 | Dhruv Jurel | WK-Batter | 44 | 38 | 11 | 775 | 496 | 60 | 43 | 75 | 28.7 | 156.25 | 5 | 0 | 3 |
| 189 | DJ Bravo | All-rounder | 160 | 110 | 41 | 1560 | 1204 | 120 | 66 | 70* | 22.61 | 129.57 | 5 | 0 | 5 |
| 190 | DJ Harris | Batter | 4 | 4 | 0 | 111 | 101 | 11 | 5 | 47 | 27.75 | 109.9 | 0 | 0 | 0 |
| 191 | DJ Hooda | All-rounder | 125 | 102 | 17 | 1497 | 1173 | 98 | 62 | 64 | 17.61 | 127.62 | 8 | 0 | 5 |
| 192 | DJ Hussey | All-rounder | 64 | 61 | 12 | 1322 | 1075 | 90 | 60 | 71 | 26.98 | 122.98 | 5 | 0 | 4 |
| 193 | DJ Jacobs | Batter | 7 | 7 | 0 | 92 | 98 | 10 | 4 | 32 | 13.14 | 93.88 | 0 | 0 | 1 |
| 194 | DJ Malan | Batter | 1 | 1 | 0 | 26 | 26 | 1 | 1 | 26 | 26 | 100 | 0 | 0 | 0 |
| 195 | DJ Mitchell | All-rounder | 15 | 15 | 2 | 351 | 267 | 28 | 10 | 63 | 27 | 131.46 | 2 | 0 | 0 |
| 196 | DJ Muthuswami | Bowler | 6 | 1 | 0 | 1 | 3 | 0 | 0 | 1 | 1 | 33.33 | 0 | 0 | 0 |
| 197 | DJ Thornely | Batter | 6 | 4 | 1 | 39 | 53 | 2 | 2 | 30 | 13 | 73.58 | 0 | 0 | 1 |
| 198 | DJ Willey | All-rounder | 11 | 5 | 3 | 53 | 62 | 7 | 0 | 20* | 26.5 | 85.48 | 0 | 0 | 1 |
| 199 | DJG Sammy | Bowler | 22 | 20 | 5 | 295 | 241 | 15 | 18 | 60 | 19.67 | 122.41 | 1 | 0 | 2 |
| 200 | DJM Short | Batter | 7 | 7 | 0 | 115 | 99 | 11 | 5 | 44 | 16.43 | 116.16 | 0 | 0 | 0 |
| 201 | DL Chahar | Bowler | 97 | 17 | 9 | 123 | 89 | 6 | 8 | 39 | 15.38 | 138.2 | 0 | 0 | 4 |
| 202 | DL Vettori | Bowler | 34 | 16 | 8 | 121 | 113 | 11 | 2 | 29 | 15.13 | 107.08 | 0 | 0 | 1 |
| 203 | DM Bravo | Batter | 1 | 1 | 1 | 6 | 5 | 1 | 0 | 6* | 6 | 120 | 0 | 0 | 0 |
| 204 | DNT Zoysa | Batter | 3 | 2 | 1 | 11 | 9 | 1 | 0 | 10* | 11 | 122.22 | 0 | 0 | 0 |
| 205 | DP Conway | Batter | 29 | 28 | 3 | 1080 | 773 | 117 | 34 | 92* | 43.2 | 139.72 | 11 | 0 | 3 |
| 206 | DP Nannes | Bowler | 29 | 2 | 1 | 4 | 13 | 0 | 0 | 3 | 4 | 30.77 | 0 | 0 | 0 |
| 207 | DP Vijaykumar | Bowler | 9 | 1 | 1 | 1 | 1 | 0 | 0 | 1* | 1 | 100 | 0 | 0 | 0 |
| 208 | DPMD Jayawardene | Batter | 80 | 79 | 15 | 1808 | 1464 | 200 | 40 | 110* | 28.25 | 123.5 | 10 | 1 | 2 |
| 209 | DR Martyn | Batter | 1 | 1 | 0 | 19 | 24 | 1 | 0 | 19 | 19 | 79.17 | 0 | 0 | 0 |
| 210 | DR Sams | Bowler | 16 | 13 | 4 | 44 | 44 | 1 | 3 | 15 | 4.89 | 100 | 0 | 0 | 3 |
| 211 | DR Shorey | Batter | 2 | 2 | 0 | 13 | 17 | 0 | 1 | 8 | 6.5 | 76.47 | 0 | 0 | 0 |
| 212 | DR Smith | All-rounder | 91 | 88 | 4 | 2385 | 1764 | 245 | 117 | 87* | 28.39 | 135.2 | 17 | 0 | 8 |
| 213 | DS Kulkarni | Bowler | 92 | 20 | 11 | 104 | 108 | 7 | 2 | 28* | 11.56 | 96.3 | 0 | 0 | 0 |
| 214 | DS Lehmann | Batter | 2 | 2 | 0 | 18 | 18 | 3 | 0 | 17 | 9 | 100 | 0 | 0 | 0 |
| 215 | DS Rathi | Bowler | 14 | 1 | 0 | 1 | 3 | 0 | 0 | 1 | 1 | 33.33 | 0 | 0 | 0 |
| 216 | DT Christian | All-rounder | 49 | 41 | 10 | 460 | 398 | 23 | 19 | 39 | 14.84 | 115.58 | 0 | 0 | 2 |
| 217 | DT Patil | Batter | 2 | 2 | 0 | 13 | 13 | 1 | 0 | 9 | 6.5 | 100 | 0 | 0 | 0 |
| 218 | DW Steyn | Bowler | 95 | 33 | 11 | 167 | 160 | 14 | 3 | 19* | 7.59 | 104.38 | 0 | 0 | 5 |
| 219 | E Lewis | Batter | 27 | 26 | 2 | 654 | 477 | 62 | 36 | 65 | 27.25 | 137.11 | 4 | 0 | 2 |
| 220 | E Malinga | Bowler | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 221 | EJG Morgan | Batter | 83 | 75 | 14 | 1406 | 1148 | 112 | 64 | 68* | 23.05 | 122.47 | 5 | 0 | 5 |
| 222 | ER Dwivedi | Batter | 4 | 2 | 0 | 24 | 14 | 2 | 2 | 19 | 12 | 171.43 | 0 | 0 | 0 |
| 223 | F Behardien | Batter | 3 | 3 | 1 | 14 | 13 | 2 | 0 | 9* | 7 | 107.69 | 0 | 0 | 1 |
| 224 | F du Plessis | Batter | 154 | 147 | 11 | 4773 | 3515 | 440 | 174 | 96 | 35.1 | 135.79 | 39 | 0 | 7 |
| 225 | FA Allen | Batter | 5 | 3 | 1 | 14 | 19 | 1 | 0 | 8 | 7 | 73.68 | 0 | 0 | 0 |
| 226 | Fazalhaq Farooqi | All-rounder | 12 | 3 | 3 | 5 | 15 | 0 | 0 | 2* | 5 | 33.33 | 0 | 0 | 0 |
| 227 | FH Allen | Batter | 3 | 3 | 0 | 71 | 31 | 11 | 4 | 37 | 23.67 | 229.03 | 0 | 0 | 0 |
| 228 | FH Edwards | Bowler | 6 | 2 | 1 | 4 | 5 | 0 | 0 | 3* | 4 | 80 | 0 | 0 | 0 |
| 229 | FY Fazal | Batter | 12 | 11 | 1 | 183 | 173 | 22 | 1 | 45 | 18.3 | 105.78 | 0 | 0 | 1 |
| 230 | G Coetzee | Bowler | 14 | 7 | 1 | 31 | 33 | 2 | 2 | 12 | 5.17 | 93.94 | 0 | 0 | 1 |
| 231 | G Gambhir | Batter | 154 | 151 | 16 | 4217 | 3404 | 492 | 59 | 93 | 31.24 | 123.88 | 36 | 0 | 11 |
| 232 | G Singh | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 233 | Gagandeep Singh | Batter | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 234 | GB Hogg | Bowler | 21 | 4 | 1 | 22 | 22 | 1 | 0 | 13 | 7.33 | 100 | 0 | 0 | 0 |
| 235 | GC Smith | Batter | 29 | 29 | 3 | 739 | 668 | 94 | 9 | 91 | 28.42 | 110.63 | 4 | 0 | 3 |
| 236 | GC Viljoen | All-rounder | 6 | 3 | 1 | 3 | 7 | 0 | 0 | 2* | 1.5 | 42.86 | 0 | 0 | 1 |
| 237 | GD McGrath | Bowler | 14 | 2 | 1 | 4 | 5 | 1 | 0 | 4* | 4 | 80 | 0 | 0 | 1 |
| 238 | GD Phillips | Batter | 11 | 11 | 2 | 107 | 85 | 5 | 8 | 25 | 11.89 | 125.88 | 0 | 0 | 1 |
| 239 | GH Vihari | Batter | 24 | 23 | 3 | 284 | 321 | 23 | 1 | 46 | 14.2 | 88.47 | 0 | 0 | 0 |
| 240 | GHS Garton | Batter | 5 | 2 | 1 | 2 | 4 | 0 | 0 | 2* | 2 | 50 | 0 | 0 | 1 |
| 241 | GJ Bailey | Batter | 40 | 36 | 9 | 663 | 544 | 59 | 19 | 61* | 24.56 | 121.88 | 2 | 0 | 1 |
| 242 | GJ Maxwell | All-rounder | 141 | 135 | 17 | 2820 | 1818 | 238 | 161 | 95 | 23.9 | 155.12 | 18 | 0 | 19 |
| 243 | GR Napier | Batter | 1 | 1 | 0 | 15 | 16 | 1 | 0 | 15 | 15 | 93.75 | 0 | 0 | 0 |
| 244 | GS Sandhu | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 245 | Gulbadin Naib | Batter | 2 | 1 | 0 | 19 | 15 | 1 | 1 | 19 | 19 | 126.67 | 0 | 0 | 0 |
| 246 | Gurkeerat Singh | Batter | 41 | 32 | 8 | 511 | 422 | 55 | 11 | 65 | 21.29 | 121.09 | 2 | 0 | 4 |
| 247 | Gurnoor Brar | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 248 | H Das | Batter | 1 | 1 | 0 | 2 | 5 | 0 | 0 | 2 | 2 | 40 | 0 | 0 | 0 |
| 249 | H Klaasen | WK-Batter | 52 | 48 | 8 | 1625 | 970 | 109 | 93 | 105* | 40.63 | 167.53 | 9 | 2 | 1 |
| 250 | H Pannu | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 251 | H Sharma | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 252 | Harbhajan Singh | Bowler | 163 | 88 | 34 | 833 | 604 | 79 | 42 | 64 | 15.43 | 137.91 | 1 | 0 | 12 |
| 253 | Harmeet Singh | Bowler | 27 | 4 | 1 | 18 | 12 | 3 | 0 | 14 | 6 | 150 | 0 | 0 | 1 |
| 254 | Harmeet Singh | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 255 | Harpreet Brar | All-rounder | 49 | 26 | 14 | 244 | 203 | 19 | 10 | 29 | 20.33 | 120.2 | 0 | 0 | 1 |
| 256 | Harpreet Singh | Batter | 9 | 8 | 1 | 123 | 119 | 10 | 3 | 41 | 17.57 | 103.36 | 0 | 0 | 0 |
| 257 | Harsh Dubey | All-rounder | 6 | 3 | 1 | 12 | 7 | 2 | 0 | 9* | 6 | 171.43 | 0 | 0 | 1 |
| 258 | Harshit Rana | Bowler | 33 | 10 | 4 | 59 | 56 | 5 | 3 | 34 | 9.83 | 105.36 | 0 | 0 | 1 |
| 259 | HC Brook | Batter | 11 | 11 | 2 | 190 | 154 | 23 | 4 | 100* | 21.11 | 123.38 | 0 | 1 | 3 |
| 260 | HE van der Dussen | Batter | 3 | 3 | 1 | 22 | 24 | 2 | 0 | 12* | 11 | 91.67 | 0 | 0 | 0 |
| 261 | HF Gurney | All-rounder | 8 | 1 | 1 | 1 | 5 | 0 | 0 | 1* | 1 | 20 | 0 | 0 | 0 |
| 262 | HH Gibbs | Batter | 36 | 36 | 4 | 886 | 807 | 83 | 31 | 69* | 27.69 | 109.79 | 6 | 0 | 4 |
| 263 | HH Pandya | All-rounder | 154 | 145 | 46 | 2785 | 1893 | 212 | 150 | 91 | 28.13 | 147.12 | 10 | 0 | 6 |
| 264 | Himmat Singh | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 265 | HM Amla | Batter | 16 | 16 | 3 | 577 | 407 | 60 | 21 | 104* | 44.38 | 141.77 | 3 | 2 | 2 |
| 266 | HR Shokeen | Batter | 13 | 5 | 2 | 66 | 65 | 9 | 0 | 25 | 22 | 101.54 | 0 | 0 | 0 |
| 267 | HV Patel | All-rounder | 120 | 43 | 13 | 274 | 233 | 17 | 15 | 36* | 9.13 | 117.6 | 0 | 0 | 9 |
| 268 | I Malhotra | Batter | 1 | 1 | 1 | 7 | 4 | 1 | 0 | 7* | 7 | 175 | 0 | 0 | 0 |
| 269 | I Sharma | Bowler | 117 | 21 | 15 | 57 | 69 | 4 | 2 | 10* | 9.5 | 82.61 | 0 | 0 | 1 |
| 270 | I Udana | All-rounder | 10 | 4 | 1 | 15 | 11 | 1 | 1 | 10* | 5 | 136.36 | 0 | 0 | 1 |
| 271 | IC Pandey | Bowler | 25 | 1 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 272 | IC Porel | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 273 | IK Pathan | All-rounder | 103 | 83 | 30 | 1150 | 950 | 88 | 38 | 60 | 21.7 | 121.05 | 1 | 0 | 3 |
| 274 | Imran Tahir | Bowler | 59 | 8 | 4 | 33 | 37 | 5 | 0 | 13* | 8.25 | 89.19 | 0 | 0 | 0 |
| 275 | Iqbal Abdulla | Bowler | 49 | 13 | 11 | 88 | 84 | 9 | 1 | 33* | 44 | 104.76 | 0 | 0 | 1 |
| 276 | IR Jaggi | Batter | 7 | 7 | 2 | 76 | 97 | 6 | 0 | 28 | 15.2 | 78.35 | 0 | 0 | 0 |
| 277 | IS Sodhi | All-rounder | 8 | 2 | 0 | 7 | 17 | 0 | 0 | 6 | 3.5 | 41.18 | 0 | 0 | 0 |
| 278 | Ishan Kishan | WK-Batter | 122 | 115 | 9 | 3093 | 2229 | 299 | 139 | 106* | 29.18 | 138.76 | 18 | 1 | 9 |
| 279 | J Arunkumar | Batter | 3 | 3 | 0 | 23 | 23 | 5 | 0 | 22 | 7.67 | 100 | 0 | 0 | 1 |
| 280 | J Botha | Bowler | 34 | 28 | 8 | 409 | 359 | 39 | 5 | 67* | 20.45 | 113.93 | 1 | 0 | 0 |
| 281 | J Cox | WK-Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 282 | J Fraser-McGurk | Batter | 15 | 15 | 0 | 385 | 193 | 39 | 30 | 84 | 25.67 | 199.48 | 4 | 0 | 3 |
| 283 | J Little | Bowler | 11 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 284 | J Overton | All-rounder | 5 | 4 | 2 | 95 | 59 | 7 | 5 | 43 | 47.5 | 161.02 | 0 | 0 | 0 |
| 285 | J Suchith | Bowler | 22 | 9 | 5 | 70 | 61 | 6 | 3 | 34* | 17.5 | 114.75 | 0 | 0 | 1 |
| 286 | J Syed Mohammad | All-rounder | 11 | 5 | 3 | 29 | 26 | 4 | 0 | 13* | 14.5 | 111.54 | 0 | 0 | 0 |
| 287 | J Theron | Bowler | 10 | 4 | 2 | 10 | 12 | 1 | 0 | 7* | 5 | 83.33 | 0 | 0 | 1 |
| 288 | J Yadav | All-rounder | 20 | 4 | 0 | 40 | 36 | 2 | 1 | 23 | 10 | 111.11 | 0 | 0 | 0 |
| 289 | JA Duffy | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 290 | JA Morkel | All-rounder | 90 | 68 | 28 | 975 | 687 | 61 | 55 | 73* | 24.38 | 141.92 | 3 | 0 | 3 |
| 291 | JA Richardson | Batter | 4 | 3 | 0 | 17 | 26 | 2 | 0 | 15 | 5.67 | 65.38 | 0 | 0 | 1 |
| 292 | Jalaj S Saxena | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 293 | Jaskaran Singh | All-rounder | 8 | 4 | 3 | 8 | 11 | 0 | 0 | 4* | 8 | 72.73 | 0 | 0 | 0 |
| 294 | JC Archer | Bowler | 55 | 31 | 12 | 263 | 180 | 14 | 18 | 30 | 13.84 | 146.11 | 0 | 0 | 5 |
| 295 | JC Buttler | WK-Batter | 124 | 123 | 16 | 4237 | 2834 | 419 | 192 | 124 | 39.6 | 149.51 | 25 | 7 | 8 |
| 296 | JD Ryder | All-rounder | 29 | 29 | 1 | 604 | 458 | 69 | 19 | 86 | 21.57 | 131.88 | 4 | 0 | 4 |
| 297 | JD Unadkat | Bowler | 115 | 28 | 12 | 201 | 169 | 16 | 7 | 26 | 12.56 | 118.93 | 0 | 0 | 2 |
| 298 | JDP Oram | All-rounder | 18 | 11 | 3 | 106 | 108 | 6 | 5 | 41* | 13.25 | 98.15 | 0 | 0 | 1 |
| 299 | JDS Neesham | All-rounder | 14 | 10 | 1 | 92 | 93 | 6 | 2 | 22 | 10.22 | 98.92 | 0 | 0 | 2 |
| 300 | JE Root | Batter | 3 | 1 | 0 | 10 | 15 | 1 | 0 | 10 | 10 | 66.67 | 0 | 0 | 0 |
| 301 | JE Taylor | All-rounder | 5 | 2 | 1 | 3 | 3 | 0 | 0 | 2 | 3 | 100 | 0 | 0 | 0 |
| 302 | JEC Franklin | All-rounder | 20 | 16 | 5 | 327 | 301 | 25 | 9 | 79 | 29.73 | 108.64 | 1 | 0 | 0 |
| 303 | JG Bethell | Batter | 2 | 2 | 0 | 67 | 39 | 9 | 3 | 55 | 33.5 | 171.79 | 1 | 0 | 0 |
| 304 | JH Kallis | All-rounder | 98 | 95 | 11 | 2427 | 2222 | 255 | 44 | 89* | 28.89 | 109.23 | 17 | 0 | 8 |
| 305 | JJ Bumrah | Bowler | 148 | 28 | 22 | 73 | 81 | 6 | 1 | 16* | 12.17 | 90.12 | 0 | 0 | 4 |
| 306 | JJ Roy | Batter | 21 | 21 | 2 | 614 | 443 | 75 | 21 | 91* | 32.32 | 138.6 | 4 | 0 | 0 |
| 307 | JJ van der Wath | Batter | 3 | 3 | 1 | 18 | 16 | 1 | 1 | 14* | 9 | 112.5 | 0 | 0 | 1 |
| 308 | JL Denly | Batter | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 309 | JL Pattinson | Bowler | 10 | 2 | 1 | 15 | 13 | 2 | 0 | 11 | 15 | 115.38 | 0 | 0 | 0 |
| 310 | JM Bairstow | WK-Batter | 52 | 52 | 4 | 1674 | 1146 | 173 | 74 | 114 | 34.88 | 146.07 | 9 | 2 | 3 |
| 311 | JM Kemp | Batter | 5 | 2 | 0 | 26 | 24 | 1 | 1 | 22 | 13 | 108.33 | 0 | 0 | 0 |
| 312 | JM Sharma | WK-Batter | 57 | 48 | 8 | 991 | 632 | 77 | 62 | 85* | 24.77 | 156.8 | 1 | 0 | 3 |
| 313 | JO Holder | All-rounder | 46 | 27 | 6 | 259 | 211 | 13 | 18 | 47* | 12.33 | 122.75 | 0 | 0 | 2 |
| 314 | Joginder Sharma | Bowler | 16 | 5 | 1 | 36 | 30 | 1 | 2 | 16* | 9 | 120 | 0 | 0 | 2 |
| 315 | JP Behrendorff | Bowler | 17 | 2 | 2 | 6 | 9 | 0 | 0 | 3* | 6 | 66.67 | 0 | 0 | 0 |
| 316 | JP Duminy | All-rounder | 83 | 75 | 24 | 2029 | 1636 | 126 | 79 | 78* | 39.78 | 124.02 | 14 | 0 | 1 |
| 317 | JP Faulkner | All-rounder | 60 | 46 | 20 | 527 | 390 | 36 | 23 | 46 | 20.27 | 135.13 | 0 | 0 | 1 |
| 318 | JP Inglis | Batter | 12 | 11 | 2 | 278 | 171 | 26 | 16 | 73 | 30.89 | 162.57 | 1 | 0 | 0 |
| 319 | JPR Scantlebury-Searles | Batter | 4 | 2 | 1 | 8 | 6 | 0 | 1 | 6* | 8 | 133.33 | 0 | 0 | 0 |
| 320 | JR Hazlewood | Bowler | 39 | 7 | 7 | 19 | 29 | 1 | 0 | 7* | 19 | 65.52 | 0 | 0 | 0 |
| 321 | JR Hopes | Bowler | 21 | 19 | 3 | 417 | 306 | 49 | 11 | 71 | 26.06 | 136.27 | 4 | 0 | 1 |
| 322 | JR Philippe | Batter | 5 | 5 | 1 | 78 | 77 | 9 | 1 | 33 | 19.5 | 101.3 | 0 | 0 | 1 |
| 323 | JW Hastings | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 324 | K Chouhan | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 325 | K Fuletra | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 326 | K Goel | Batter | 22 | 16 | 2 | 218 | 231 | 17 | 9 | 38 | 15.57 | 94.37 | 0 | 0 | 1 |
| 327 | K Gowtham | Bowler | 36 | 27 | 9 | 247 | 148 | 15 | 17 | 33* | 13.72 | 166.89 | 0 | 0 | 2 |
| 328 | K Kartikeya | Bowler | 16 | 4 | 0 | 12 | 17 | 1 | 0 | 6 | 3 | 70.59 | 0 | 0 | 0 |
| 329 | K Khejroliya | Bowler | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 330 | K Mendis | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 331 | K Rabada | Bowler | 87 | 31 | 14 | 238 | 217 | 17 | 11 | 44 | 14 | 109.68 | 0 | 0 | 3 |
| 332 | K Santokie | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 333 | K Upadhyay | Batter | 3 | 2 | 2 | 12 | 9 | 0 | 1 | 11* | 12 | 133.33 | 0 | 0 | 0 |
| 334 | K Yadav | Bowler | 3 | 1 | 1 | 0 | 4 | 0 | 0 | 0* | 0 | 0 | 0 | 0 | 0 |
| 335 | KA Jamieson | Bowler | 13 | 9 | 5 | 65 | 60 | 5 | 3 | 16* | 16.25 | 108.33 | 0 | 0 | 0 |
| 336 | KA Maharaj | Batter | 2 | 1 | 0 | 1 | 2 | 0 | 0 | 1 | 1 | 50 | 0 | 0 | 0 |
| 337 | KA Pollard | All-rounder | 189 | 172 | 51 | 3437 | 2329 | 221 | 224 | 87* | 28.4 | 147.57 | 16 | 0 | 5 |
| 338 | KAJ Roach | Batter | 2 | 1 | 0 | 10 | 9 | 1 | 0 | 10 | 10 | 111.11 | 0 | 0 | 0 |
| 339 | Kamran Akmal | WK-Batter | 6 | 6 | 1 | 128 | 78 | 13 | 8 | 53* | 25.6 | 164.1 | 1 | 0 | 0 |
| 340 | Kamran Khan | All-rounder | 9 | 1 | 0 | 3 | 5 | 0 | 0 | 3 | 3 | 60 | 0 | 0 | 0 |
| 341 | Karanveer Singh | Bowler | 9 | 4 | 3 | 12 | 17 | 1 | 0 | 5* | 12 | 70.59 | 0 | 0 | 0 |
| 342 | Karim Janat | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 343 | Kartik Sharma | Batter | 3 | 3 | 0 | 25 | 21 | 0 | 2 | 18 | 8.33 | 119.05 | 0 | 0 | 0 |
| 344 | Kartik Tyagi | Bowler | 23 | 7 | 2 | 18 | 21 | 2 | 0 | 7 | 3.6 | 85.71 | 0 | 0 | 1 |
| 345 | KB Arun Karthik | Batter | 17 | 8 | 3 | 51 | 51 | 4 | 1 | 19* | 10.2 | 100 | 0 | 0 | 1 |
| 346 | KC Cariappa | All-rounder | 11 | 5 | 2 | 24 | 21 | 0 | 2 | 12* | 8 | 114.29 | 0 | 0 | 0 |
| 347 | KC Sangakkara | WK-Batter | 71 | 68 | 3 | 1687 | 1392 | 195 | 27 | 94 | 25.95 | 121.19 | 10 | 0 | 4 |
| 348 | KD Karthik | WK-Batter | 257 | 235 | 51 | 4843 | 3580 | 466 | 161 | 97* | 26.32 | 135.28 | 22 | 0 | 18 |
| 349 | KH Devdhar | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 350 | KH Pandya | All-rounder | 144 | 114 | 33 | 1756 | 1326 | 153 | 65 | 86 | 21.68 | 132.43 | 2 | 0 | 7 |
| 351 | KJ Abbott | Batter | 5 | 3 | 2 | 13 | 8 | 0 | 1 | 12* | 13 | 162.5 | 0 | 0 | 1 |
| 352 | KK Ahmed | Bowler | 74 | 6 | 1 | 2 | 9 | 0 | 0 | 1* | 0.4 | 22.22 | 0 | 0 | 4 |
| 353 | KK Cooper | Bowler | 25 | 12 | 3 | 116 | 68 | 9 | 8 | 32 | 12.89 | 170.59 | 0 | 0 | 1 |
| 354 | KK Nair | Batter | 84 | 76 | 5 | 1694 | 1286 | 185 | 49 | 89 | 23.86 | 131.73 | 11 | 0 | 5 |
| 355 | KL Nagarkoti | Batter | 12 | 7 | 3 | 22 | 33 | 1 | 0 | 8* | 5.5 | 66.67 | 0 | 0 | 2 |
| 356 | KL Rahul | WK-Batter | 149 | 141 | 24 | 5328 | 3904 | 464 | 212 | 132* | 45.54 | 136.48 | 41 | 5 | 4 |
| 357 | KM Asif | All-rounder | 7 | 1 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 358 | KM Jadhav | WK-Batter | 95 | 81 | 27 | 1208 | 981 | 102 | 40 | 69 | 22.37 | 123.14 | 4 | 0 | 6 |
| 359 | KMA Paul | All-rounder | 8 | 5 | 1 | 18 | 24 | 1 | 1 | 7 | 4.5 | 75 | 0 | 0 | 1 |
| 360 | KMDN Kulasekara | Batter | 5 | 1 | 1 | 5 | 3 | 1 | 0 | 5* | 5 | 166.67 | 0 | 0 | 0 |
| 361 | KP Appanna | All-rounder | 13 | 3 | 2 | 2 | 4 | 0 | 0 | 1* | 2 | 50 | 0 | 0 | 0 |
| 362 | KP Pietersen | All-rounder | 36 | 36 | 8 | 1001 | 743 | 91 | 40 | 103* | 35.75 | 134.72 | 4 | 1 | 4 |
| 363 | KR Mayers | Batter | 13 | 13 | 0 | 379 | 263 | 38 | 22 | 73 | 29.15 | 144.11 | 4 | 0 | 2 |
| 364 | KR Sen | Bowler | 12 | 1 | 1 | 0 | 3 | 0 | 0 | 0* | 0 | 0 | 0 | 0 | 0 |
| 365 | KS Bharat | WK-Batter | 10 | 8 | 1 | 199 | 163 | 12 | 8 | 78* | 28.43 | 122.09 | 1 | 0 | 1 |
| 366 | KS Rathore | Batter | 1 | 1 | 0 | 0 | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 367 | KS Sharma | Batter | 3 | 3 | 0 | 16 | 25 | 1 | 0 | 9 | 5.33 | 64 | 0 | 0 | 0 |
| 368 | KS Williamson | Batter | 79 | 77 | 18 | 2132 | 1697 | 187 | 64 | 89 | 36.14 | 125.63 | 18 | 0 | 1 |
| 369 | KT Maphaka | Batter | 4 | 1 | 1 | 8 | 2 | 2 | 0 | 8* | 8 | 400 | 0 | 0 | 0 |
| 370 | Kuldeep Yadav | Bowler | 102 | 38 | 23 | 202 | 233 | 18 | 3 | 35* | 13.47 | 86.7 | 0 | 0 | 4 |
| 371 | Kumar Kushagra | WK-Batter | 5 | 4 | 0 | 21 | 21 | 3 | 0 | 18 | 5.25 | 100 | 0 | 0 | 1 |
| 372 | KV Sharma | Bowler | 90 | 40 | 14 | 352 | 295 | 20 | 17 | 39* | 13.54 | 119.32 | 0 | 0 | 1 |
| 373 | KW Richardson | Bowler | 15 | 4 | 1 | 36 | 39 | 2 | 1 | 26 | 12 | 92.31 | 0 | 0 | 0 |
| 374 | L Ablish | Batter | 3 | 1 | 1 | 0 | 2 | 0 | 0 | 0* | 0 | 0 | 0 | 0 | 0 |
| 375 | L Balaji | Bowler | 73 | 13 | 6 | 36 | 49 | 2 | 1 | 15 | 5.14 | 73.47 | 0 | 0 | 4 |
| 376 | L Ngidi | Bowler | 19 | 1 | 1 | 0 | 2 | 0 | 0 | 0* | 0 | 0 | 0 | 0 | 0 |
| 377 | L Pretorius | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 378 | L Ronchi | Batter | 5 | 5 | 0 | 34 | 34 | 6 | 1 | 13 | 6.8 | 100 | 0 | 0 | 1 |
| 379 | L Wood | Bowler | 2 | 1 | 1 | 9 | 3 | 0 | 1 | 9* | 9 | 300 | 0 | 0 | 0 |
| 380 | LA Carseldine | Batter | 5 | 5 | 1 | 81 | 68 | 11 | 0 | 39 | 20.25 | 119.12 | 0 | 0 | 0 |
| 381 | LA Pomersbach | Batter | 17 | 16 | 5 | 302 | 246 | 25 | 13 | 79* | 27.45 | 122.76 | 1 | 0 | 0 |
| 382 | Lalit Yadav | All-rounder | 27 | 21 | 5 | 305 | 290 | 27 | 7 | 48* | 19.06 | 105.17 | 0 | 0 | 1 |
| 383 | LB Williams | Batter | 2 | 1 | 1 | 1 | 2 | 0 | 0 | 1* | 1 | 50 | 0 | 0 | 0 |
| 384 | LE Plunkett | Bowler | 7 | 2 | 1 | 1 | 3 | 0 | 0 | 1* | 1 | 33.33 | 0 | 0 | 1 |
| 385 | LH Ferguson | Bowler | 49 | 8 | 5 | 72 | 47 | 7 | 2 | 24* | 24 | 153.19 | 0 | 0 | 1 |
| 386 | LI Meriwala | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 387 | Liton Das | Batter | 1 | 1 | 0 | 4 | 4 | 1 | 0 | 4 | 4 | 100 | 0 | 0 | 0 |
| 388 | LJ Wright | Batter | 7 | 5 | 0 | 106 | 60 | 16 | 3 | 44 | 21.2 | 176.67 | 0 | 0 | 0 |
| 389 | LMP Simmons | Batter | 29 | 29 | 2 | 1079 | 852 | 109 | 44 | 100* | 39.96 | 126.64 | 11 | 1 | 2 |
| 390 | LPC Silva | Batter | 3 | 3 | 1 | 40 | 26 | 5 | 1 | 23* | 20 | 153.85 | 0 | 0 | 1 |
| 391 | LR Shukla | Bowler | 47 | 33 | 6 | 405 | 350 | 33 | 16 | 48* | 15 | 115.71 | 0 | 0 | 3 |
| 392 | LRPL Taylor | Batter | 55 | 54 | 14 | 1017 | 822 | 66 | 46 | 81* | 25.43 | 123.72 | 3 | 0 | 3 |
| 393 | LS Livingstone | All-rounder | 50 | 48 | 7 | 1065 | 682 | 70 | 76 | 94 | 25.98 | 156.16 | 7 | 0 | 3 |
| 394 | M Ashwin | Bowler | 44 | 12 | 3 | 35 | 50 | 2 | 1 | 9 | 3.89 | 70 | 0 | 0 | 2 |
| 395 | M de Lange | Batter | 5 | 1 | 0 | 1 | 2 | 0 | 0 | 1 | 1 | 50 | 0 | 0 | 0 |
| 396 | M Izhar | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 397 | M Jansen | All-rounder | 39 | 21 | 9 | 150 | 139 | 8 | 7 | 34* | 12.5 | 107.91 | 0 | 0 | 3 |
| 398 | M Kaif | Batter | 29 | 22 | 4 | 259 | 250 | 22 | 6 | 34* | 14.39 | 103.6 | 0 | 0 | 0 |
| 399 | M Kartik | Bowler | 56 | 14 | 7 | 113 | 108 | 7 | 1 | 21 | 16.14 | 104.63 | 0 | 0 | 1 |
| 400 | M Klinger | Batter | 4 | 4 | 0 | 73 | 77 | 9 | 0 | 29 | 18.25 | 94.81 | 0 | 0 | 0 |
| 401 | M Manhas | Batter | 55 | 38 | 15 | 514 | 470 | 43 | 10 | 42* | 22.35 | 109.36 | 0 | 0 | 6 |
| 402 | M Markande | Bowler | 39 | 10 | 7 | 48 | 42 | 5 | 1 | 18* | 16 | 114.29 | 0 | 0 | 0 |
| 403 | M Morkel | Bowler | 70 | 20 | 10 | 126 | 90 | 11 | 5 | 23* | 12.6 | 140 | 0 | 0 | 4 |
| 404 | M Muralitharan | Bowler | 66 | 9 | 3 | 20 | 30 | 1 | 0 | 6 | 3.33 | 66.67 | 0 | 0 | 2 |
| 405 | M Ntini | Bowler | 9 | 2 | 1 | 11 | 18 | 2 | 0 | 11 | 11 | 61.11 | 0 | 0 | 0 |
| 406 | M Pathirana | Bowler | 32 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 407 | M Prasidh Krishna | Bowler | 69 | 7 | 4 | 9 | 24 | 0 | 0 | 4* | 3 | 37.5 | 0 | 0 | 2 |
| 408 | M Rawat | Batter | 18 | 11 | 6 | 55 | 69 | 4 | 1 | 23* | 11 | 79.71 | 0 | 0 | 1 |
| 409 | M Rawat | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 410 | M Shahrukh Khan | All-rounder | 58 | 50 | 14 | 747 | 501 | 47 | 51 | 58 | 20.75 | 149.1 | 2 | 0 | 3 |
| 411 | M Siddharth | Bowler | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 412 | M Theekshana | Bowler | 38 | 6 | 3 | 17 | 34 | 0 | 1 | 7* | 5.67 | 50 | 0 | 0 | 1 |
| 413 | M Tiwari | Batter | 2 | 1 | 0 | 3 | 4 | 0 | 0 | 3 | 3 | 75 | 0 | 0 | 0 |
| 414 | M Vijay | Batter | 106 | 105 | 5 | 2619 | 2149 | 247 | 91 | 127 | 26.19 | 121.87 | 13 | 2 | 4 |
| 415 | M Vohra | Batter | 56 | 51 | 2 | 1083 | 829 | 104 | 43 | 95 | 22.1 | 130.64 | 3 | 0 | 3 |
| 416 | M Yadav | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 417 | MA Agarwal | Batter | 130 | 126 | 6 | 2764 | 2066 | 275 | 100 | 106 | 23.03 | 133.79 | 13 | 1 | 7 |
| 418 | MA Khote | Batter | 4 | 3 | 1 | 24 | 22 | 2 | 1 | 9 | 12 | 109.09 | 0 | 0 | 0 |
| 419 | MA Starc | Bowler | 52 | 21 | 10 | 111 | 119 | 11 | 0 | 29 | 10.09 | 93.28 | 0 | 0 | 3 |
| 420 | MA Wood | Bowler | 5 | 3 | 1 | 12 | 8 | 1 | 1 | 10* | 6 | 150 | 0 | 0 | 0 |
| 421 | Mandeep Singh | Batter | 111 | 97 | 16 | 1706 | 1388 | 176 | 38 | 77* | 21.06 | 122.91 | 6 | 0 | 14 |
| 422 | Mashrafe Mortaza | Batter | 1 | 1 | 1 | 2 | 2 | 0 | 0 | 2* | 2 | 100 | 0 | 0 | 0 |
| 423 | Mayank Dagar | Bowler | 8 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 424 | MB Parmar | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 425 | MC Henriques | All-rounder | 62 | 54 | 18 | 1000 | 788 | 87 | 28 | 74* | 27.78 | 126.9 | 5 | 0 | 2 |
| 426 | MC Juneja | Batter | 7 | 7 | 0 | 125 | 128 | 11 | 1 | 49 | 17.86 | 97.66 | 0 | 0 | 0 |
| 427 | MD Choudhary | Batter | 2 | 2 | 1 | 16 | 16 | 2 | 0 | 14 | 16 | 100 | 0 | 0 | 0 |
| 428 | MD Mishra | Batter | 18 | 17 | 1 | 237 | 208 | 24 | 8 | 41 | 14.81 | 113.94 | 0 | 0 | 1 |
| 429 | MD Shanaka | All-rounder | 3 | 3 | 1 | 26 | 26 | 2 | 1 | 17 | 13 | 100 | 0 | 0 | 1 |
| 430 | MDKJ Perera | Batter | 2 | 2 | 0 | 14 | 13 | 3 | 0 | 14 | 7 | 107.69 | 0 | 0 | 1 |
| 431 | MEK Hussey | Batter | 59 | 58 | 7 | 1977 | 1612 | 198 | 52 | 116* | 38.76 | 122.64 | 15 | 1 | 1 |
| 432 | MF Maharoof | Bowler | 20 | 14 | 4 | 177 | 123 | 12 | 9 | 39 | 17.7 | 143.9 | 0 | 0 | 2 |
| 433 | MG Bracewell | All-rounder | 5 | 4 | 2 | 58 | 47 | 6 | 1 | 26 | 29 | 123.4 | 0 | 0 | 0 |
| 434 | MG Johnson | Bowler | 54 | 28 | 15 | 167 | 164 | 10 | 7 | 16* | 12.85 | 101.83 | 0 | 0 | 2 |
| 435 | MG Neser | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 436 | Misbah-ul-Haq | Batter | 8 | 8 | 1 | 117 | 81 | 10 | 6 | 47* | 16.71 | 144.44 | 0 | 0 | 2 |
| 437 | MJ Clarke | Batter | 6 | 6 | 0 | 98 | 94 | 12 | 0 | 41 | 16.33 | 104.26 | 0 | 0 | 0 |
| 438 | MJ Guptill | Batter | 13 | 14 | 2 | 271 | 197 | 24 | 15 | 50* | 22.58 | 137.56 | 1 | 0 | 1 |
| 439 | MJ Henry | Bowler | 9 | 2 | 0 | 7 | 10 | 1 | 0 | 5 | 3.5 | 70 | 0 | 0 | 0 |
| 440 | MJ Lumb | Batter | 12 | 12 | 0 | 278 | 194 | 45 | 6 | 83 | 23.17 | 143.3 | 1 | 0 | 3 |
| 441 | MJ McClenaghan | Bowler | 56 | 19 | 8 | 85 | 70 | 5 | 7 | 20 | 7.73 | 121.43 | 0 | 0 | 5 |
| 442 | MJ Owen | Batter | 1 | 1 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 443 | MJ Santner | All-rounder | 32 | 20 | 12 | 128 | 117 | 8 | 6 | 22 | 16 | 109.4 | 0 | 0 | 1 |
| 444 | MJ Suthar | Batter | 1 | 1 | 0 | 1 | 2 | 0 | 0 | 1 | 1 | 50 | 0 | 0 | 0 |
| 445 | MK Lomror | Batter | 40 | 35 | 6 | 527 | 373 | 33 | 30 | 54* | 18.17 | 141.29 | 1 | 0 | 3 |
| 446 | MK Pandey | Batter | 174 | 162 | 28 | 3951 | 3248 | 340 | 116 | 114* | 29.49 | 121.64 | 22 | 1 | 13 |
| 447 | MK Tiwary | Batter | 98 | 83 | 24 | 1695 | 1449 | 156 | 40 | 75* | 28.73 | 116.98 | 7 | 0 | 8 |
| 448 | ML Hayden | Batter | 32 | 33 | 2 | 1107 | 806 | 121 | 44 | 93 | 35.71 | 137.34 | 8 | 0 | 2 |
| 449 | MM Ali | All-rounder | 73 | 59 | 6 | 1167 | 835 | 95 | 67 | 93 | 22.02 | 139.76 | 6 | 0 | 6 |
| 450 | MM Patel | Bowler | 63 | 12 | 6 | 39 | 41 | 5 | 0 | 23* | 6.5 | 95.12 | 0 | 0 | 5 |
| 451 | MM Sharma | Bowler | 120 | 30 | 13 | 125 | 136 | 9 | 4 | 21* | 7.35 | 91.91 | 0 | 0 | 4 |
| 452 | MN Samuels | All-rounder | 15 | 14 | 1 | 161 | 172 | 9 | 7 | 46 | 12.38 | 93.6 | 0 | 0 | 1 |
| 453 | MN van Wyk | Batter | 5 | 5 | 2 | 167 | 132 | 19 | 1 | 74 | 55.67 | 126.52 | 1 | 0 | 1 |
| 454 | Mohammad Ashraful | Batter | 1 | 1 | 0 | 2 | 10 | 0 | 0 | 2 | 2 | 20 | 0 | 0 | 0 |
| 455 | Mohammad Asif | All-rounder | 8 | 2 | 0 | 3 | 6 | 0 | 0 | 3 | 1.5 | 50 | 0 | 0 | 1 |
| 456 | Mohammad Hafeez | Batter | 8 | 8 | 1 | 64 | 83 | 7 | 2 | 16 | 9.14 | 77.11 | 0 | 0 | 0 |
| 457 | Mohammad Nabi | All-rounder | 24 | 20 | 3 | 221 | 152 | 18 | 12 | 31 | 13 | 145.39 | 0 | 0 | 1 |
| 458 | Mohammed Shami | Bowler | 121 | 28 | 13 | 85 | 91 | 7 | 2 | 21 | 5.67 | 93.41 | 0 | 0 | 4 |
| 459 | Mohammed Siraj | Bowler | 111 | 21 | 12 | 112 | 123 | 10 | 4 | 14* | 12.44 | 91.06 | 0 | 0 | 1 |
| 460 | Mohit Rathee | Batter | 1 | 1 | 1 | 1 | 2 | 0 | 0 | 1* | 1 | 50 | 0 | 0 | 0 |
| 461 | Mohsin Khan | Bowler | 25 | 6 | 2 | 25 | 25 | 2 | 1 | 13* | 6.25 | 100 | 0 | 0 | 2 |
| 462 | Monu Kumar | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 463 | MP Breetzke | Batter | 1 | 1 | 0 | 14 | 12 | 1 | 1 | 14 | 14 | 116.67 | 0 | 0 | 0 |
| 464 | MP Stoinis | All-rounder | 113 | 101 | 28 | 2035 | 1405 | 160 | 106 | 124* | 27.88 | 144.84 | 9 | 1 | 10 |
| 465 | MP Yadav | Bowler | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 466 | MR Marsh | All-rounder | 57 | 51 | 2 | 1341 | 944 | 108 | 78 | 117 | 27.37 | 142.06 | 9 | 1 | 7 |
| 467 | MS Bhandage | Batter | 1 | 1 | 0 | 1 | 4 | 0 | 0 | 1 | 1 | 25 | 0 | 0 | 0 |
| 468 | MS Bisla | WK-Batter | 39 | 39 | 1 | 798 | 702 | 93 | 23 | 92 | 21 | 113.68 | 4 | 0 | 3 |
| 469 | MS Dhoni | WK-Batter | 277 | 241 | 99 | 5439 | 3957 | 375 | 264 | 84* | 38.3 | 137.45 | 24 | 0 | 6 |
| 470 | MS Gony | Bowler | 44 | 15 | 6 | 99 | 71 | 6 | 8 | 42 | 11 | 139.44 | 0 | 0 | 2 |
| 471 | MS Wade | WK-Batter | 15 | 14 | 0 | 183 | 177 | 23 | 2 | 35 | 13.07 | 103.39 | 0 | 0 | 0 |
| 472 | Mujeeb Ur Rahman | Bowler | 20 | 6 | 3 | 12 | 15 | 2 | 0 | 10* | 4 | 80 | 0 | 0 | 2 |
| 473 | Mukesh Choudhary | Bowler | 16 | 2 | 1 | 6 | 6 | 1 | 0 | 4 | 6 | 100 | 0 | 0 | 0 |
| 474 | Mukesh Kumar | Bowler | 35 | 5 | 4 | 10 | 18 | 0 | 0 | 6* | 10 | 55.56 | 0 | 0 | 0 |
| 475 | Musheer Khan | All-rounder | 1 | 1 | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 476 | Mustafizur Rahman | Bowler | 60 | 7 | 5 | 13 | 24 | 0 | 1 | 8* | 6.5 | 54.17 | 0 | 0 | 1 |
| 477 | MV Boucher | WK-Batter | 31 | 23 | 9 | 394 | 309 | 32 | 13 | 50* | 28.14 | 127.51 | 1 | 0 | 0 |
| 478 | MW Short | All-rounder | 7 | 7 | 0 | 119 | 99 | 15 | 4 | 36 | 17 | 120.2 | 0 | 0 | 0 |
| 479 | N Burger | Bowler | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 480 | N Jagadeesan | Batter | 13 | 10 | 1 | 162 | 147 | 21 | 2 | 39* | 18 | 110.2 | 0 | 0 | 2 |
| 481 | N Pooran | WK-Batter | 92 | 90 | 20 | 2302 | 1371 | 159 | 167 | 87* | 32.89 | 167.91 | 14 | 0 | 10 |
| 482 | N Rana | All-rounder | 121 | 115 | 9 | 2873 | 2112 | 264 | 142 | 87 | 27.1 | 136.03 | 20 | 0 | 8 |
| 483 | N Saini | Bowler | 10 | 10 | 0 | 140 | 141 | 16 | 0 | 50 | 14 | 99.29 | 1 | 0 | 0 |
| 484 | N Sindhu | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 485 | N Thushara | Bowler | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 486 | N Tiwari | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 487 | N Wadhera | Batter | 40 | 33 | 4 | 732 | 518 | 60 | 40 | 70 | 25.24 | 141.31 | 4 | 0 | 1 |
| 488 | Naman Dhir | All-rounder | 26 | 22 | 6 | 450 | 253 | 43 | 25 | 62* | 28.13 | 177.87 | 1 | 0 | 3 |
| 489 | Navdeep Saini | Bowler | 33 | 7 | 3 | 33 | 37 | 3 | 0 | 12* | 8.25 | 89.19 | 0 | 0 | 0 |
| 490 | Naveen-ul-Haq | Bowler | 18 | 4 | 3 | 18 | 25 | 2 | 0 | 13 | 18 | 72 | 0 | 0 | 0 |
| 491 | NB Singh | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 492 | ND Doshi | Batter | 4 | 1 | 0 | 0 | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 493 | Nithish Kumar Reddy | All-rounder | 31 | 25 | 5 | 581 | 428 | 38 | 31 | 76* | 29.05 | 135.75 | 3 | 0 | 1 |
| 494 | NJ Maddinson | Batter | 3 | 3 | 0 | 20 | 21 | 4 | 0 | 12 | 6.67 | 95.24 | 0 | 0 | 0 |
| 495 | NJ Rimmington | Batter | 1 | 1 | 1 | 1 | 1 | 0 | 0 | 1* | 1 | 100 | 0 | 0 | 0 |
| 496 | NK Patel | Batter | 9 | 6 | 2 | 121 | 119 | 14 | 1 | 57 | 30.25 | 101.68 | 1 | 0 | 0 |
| 497 | NL McCullum | Batter | 2 | 2 | 1 | 26 | 22 | 0 | 1 | 15 | 26 | 118.18 | 0 | 0 | 0 |
| 498 | NLTC Perera | All-rounder | 37 | 31 | 9 | 424 | 309 | 23 | 26 | 40 | 19.27 | 137.22 | 0 | 0 | 1 |
| 499 | NM Coulter-Nile | Bowler | 39 | 16 | 5 | 82 | 72 | 7 | 4 | 24* | 7.45 | 113.89 | 0 | 0 | 0 |
| 500 | Noor Ahmad | Bowler | 40 | 13 | 3 | 29 | 52 | 2 | 1 | 8 | 2.9 | 55.77 | 0 | 0 | 2 |
| 501 | NS Naik | Batter | 4 | 4 | 0 | 31 | 50 | 2 | 0 | 22 | 7.75 | 62 | 0 | 0 | 0 |
| 502 | NT Ellis | Bowler | 17 | 5 | 1 | 19 | 25 | 0 | 1 | 12 | 4.75 | 76 | 0 | 0 | 2 |
| 503 | NV Ojha | WK-Batter | 113 | 94 | 19 | 1554 | 1313 | 121 | 79 | 94* | 20.72 | 118.35 | 6 | 0 | 8 |
| 504 | O Tarmale | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 505 | O Thomas | Batter | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 506 | OA Shah | Batter | 23 | 22 | 7 | 506 | 389 | 34 | 23 | 76 | 33.73 | 130.08 | 4 | 0 | 0 |
| 507 | OC McCoy | Bowler | 8 | 1 | 0 | 8 | 5 | 0 | 1 | 8 | 8 | 160 | 0 | 0 | 0 |
| 508 | OF Smith | All-rounder | 6 | 6 | 3 | 51 | 44 | 1 | 5 | 25* | 17 | 115.91 | 0 | 0 | 1 |
| 509 | P Amarnath | Bowler | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 510 | P Avinash | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 511 | P Awana | Bowler | 33 | 5 | 3 | 5 | 14 | 0 | 0 | 4* | 2.5 | 35.71 | 0 | 0 | 2 |
| 512 | P Chopra | Batter | 2 | 1 | 0 | 8 | 6 | 2 | 0 | 8 | 8 | 133.33 | 0 | 0 | 0 |
| 513 | P Dharmani | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 514 | P Dogra | Batter | 13 | 12 | 1 | 127 | 138 | 4 | 5 | 41 | 11.55 | 92.03 | 0 | 0 | 1 |
| 515 | P Dubey | Batter | 5 | 2 | 1 | 23 | 33 | 2 | 0 | 16 | 23 | 69.7 | 0 | 0 | 0 |
| 516 | P Hinge | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 517 | P Kumar | Bowler | 119 | 57 | 19 | 340 | 314 | 22 | 17 | 34 | 8.95 | 108.28 | 0 | 0 | 9 |
| 518 | P Negi | All-rounder | 50 | 35 | 9 | 365 | 289 | 27 | 16 | 36 | 14.04 | 126.3 | 0 | 0 | 3 |
| 519 | P Nissanka | Batter | 3 | 3 | 0 | 86 | 59 | 12 | 2 | 44 | 28.67 | 145.76 | 0 | 0 | 0 |
| 520 | P Parameswaran | All-rounder | 8 | 2 | 2 | 1 | 2 | 0 | 0 | 1* | 1 | 50 | 0 | 0 | 0 |
| 521 | P Prasanth | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 522 | P Ray Barman | Batter | 1 | 1 | 0 | 19 | 24 | 2 | 0 | 19 | 19 | 79.17 | 0 | 0 | 0 |
| 523 | P Sahu | Batter | 5 | 2 | 1 | 19 | 13 | 1 | 1 | 18* | 19 | 146.15 | 0 | 0 | 0 |
| 524 | P Simran Singh | Batter | 55 | 54 | 1 | 1435 | 945 | 148 | 76 | 103 | 27.08 | 151.85 | 8 | 1 | 4 |
| 525 | P Suyal | Batter | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 526 | PA Patel | WK-Batter | 139 | 136 | 10 | 2848 | 2358 | 365 | 49 | 81 | 22.6 | 120.78 | 13 | 0 | 13 |
| 527 | PA Reddy | Batter | 12 | 10 | 0 | 164 | 160 | 15 | 2 | 42 | 16.4 | 102.5 | 0 | 0 | 0 |
| 528 | Pankaj Singh | Bowler | 17 | 5 | 3 | 7 | 12 | 0 | 0 | 4* | 3.5 | 58.33 | 0 | 0 | 1 |
| 529 | Parvez Rasool | Batter | 11 | 4 | 2 | 17 | 20 | 1 | 0 | 10 | 8.5 | 85 | 0 | 0 | 0 |
| 530 | PBB Rajapaksa | Batter | 13 | 13 | 0 | 277 | 191 | 22 | 15 | 50 | 21.31 | 145.03 | 1 | 0 | 1 |
| 531 | PC Valthaty | All-rounder | 23 | 23 | 1 | 505 | 418 | 61 | 20 | 120* | 22.95 | 120.81 | 2 | 1 | 1 |
| 532 | PD Collingwood | Batter | 8 | 7 | 2 | 203 | 156 | 9 | 13 | 75* | 40.6 | 130.13 | 3 | 0 | 0 |
| 533 | PD Salt | WK-Batter | 36 | 36 | 3 | 1110 | 638 | 127 | 58 | 89* | 33.64 | 173.98 | 10 | 0 | 3 |
| 534 | PH Solanki | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 535 | PHKD Mendis | All-rounder | 5 | 5 | 1 | 92 | 69 | 7 | 2 | 32* | 23 | 133.33 | 0 | 0 | 1 |
| 536 | PJ Cummins | Bowler | 72 | 48 | 18 | 612 | 402 | 39 | 41 | 66* | 20.4 | 152.24 | 3 | 0 | 4 |
| 537 | PJ Sangwan | Bowler | 42 | 14 | 6 | 26 | 44 | 1 | 0 | 6* | 3.25 | 59.09 | 0 | 0 | 4 |
| 538 | PK Garg | Batter | 23 | 19 | 1 | 273 | 241 | 16 | 9 | 51* | 15.17 | 113.28 | 1 | 0 | 2 |
| 539 | PM Sarvesh Kumar | Batter | 2 | 1 | 1 | 1 | 2 | 0 | 0 | 1* | 1 | 50 | 0 | 0 | 0 |
| 540 | PN Mankad | Batter | 6 | 5 | 2 | 97 | 73 | 13 | 2 | 64* | 32.33 | 132.88 | 1 | 0 | 1 |
| 541 | PP Chawla | Bowler | 192 | 86 | 32 | 624 | 563 | 56 | 20 | 24* | 11.56 | 110.83 | 0 | 0 | 14 |
| 542 | PP Ojha | Bowler | 92 | 19 | 8 | 16 | 45 | 0 | 0 | 3 | 1.45 | 35.56 | 0 | 0 | 5 |
| 543 | PP Shaw | Batter | 79 | 79 | 0 | 1892 | 1283 | 238 | 61 | 99 | 23.95 | 147.47 | 14 | 0 | 7 |
| 544 | PR Shah | WK-Batter | 16 | 9 | 1 | 92 | 91 | 9 | 2 | 29 | 11.5 | 101.1 | 0 | 0 | 1 |
| 545 | PR Veer | Batter | 2 | 2 | 1 | 49 | 36 | 7 | 1 | 43 | 49 | 136.11 | 0 | 0 | 0 |
| 546 | Prince Yadav | Bowler | 8 | 2 | 2 | 5 | 10 | 0 | 0 | 4* | 5 | 50 | 0 | 0 | 0 |
| 547 | Priyansh Arya | All-rounder | 20 | 20 | 0 | 591 | 318 | 63 | 36 | 103 | 29.55 | 185.85 | 3 | 1 | 1 |
| 548 | PSP Handscomb | Batter | 2 | 1 | 0 | 6 | 12 | 0 | 0 | 6 | 6 | 50 | 0 | 0 | 0 |
| 549 | PV Tambe | Bowler | 33 | 6 | 4 | 18 | 39 | 1 | 0 | 7* | 9 | 46.15 | 0 | 0 | 0 |
| 550 | PVD Chameera | Bowler | 20 | 10 | 6 | 53 | 42 | 3 | 3 | 17 | 13.25 | 126.19 | 0 | 0 | 2 |
| 551 | PVSN Raju | Batter | 2 | 1 | 1 | 1 | 1 | 0 | 0 | 1* | 1 | 100 | 0 | 0 | 0 |
| 552 | PWA Mulder | Batter | 1 | 1 | 0 | 9 | 11 | 1 | 0 | 9 | 9 | 81.82 | 0 | 0 | 0 |
| 553 | PWH de Silva | Bowler | 37 | 19 | 4 | 81 | 88 | 7 | 1 | 18 | 5.4 | 92.05 | 0 | 0 | 5 |
| 554 | Q de Kock | WK-Batter | 115 | 116 | 7 | 3312 | 2472 | 325 | 134 | 140* | 30.39 | 133.98 | 24 | 2 | 4 |
| 555 | R Ashwin | Bowler | 219 | 93 | 30 | 833 | 705 | 64 | 29 | 50 | 13.22 | 118.16 | 1 | 0 | 11 |
| 556 | R Bhatia | Bowler | 95 | 47 | 17 | 342 | 284 | 24 | 13 | 26* | 11.4 | 120.42 | 0 | 0 | 3 |
| 557 | R Bishnoi | Bowler | 3 | 3 | 0 | 19 | 17 | 1 | 2 | 18 | 6.33 | 111.76 | 0 | 0 | 1 |
| 558 | R Dar | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 559 | R Dhawan | Bowler | 39 | 22 | 11 | 210 | 187 | 18 | 7 | 25* | 19.09 | 112.3 | 0 | 0 | 1 |
| 560 | R Dravid | Batter | 89 | 82 | 5 | 2174 | 1882 | 269 | 28 | 75* | 28.23 | 115.52 | 11 | 0 | 3 |
| 561 | R Ghosh | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 562 | R Goyal | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 563 | R McLaren | Bowler | 18 | 13 | 5 | 159 | 171 | 14 | 1 | 51* | 19.88 | 92.98 | 1 | 0 | 1 |
| 564 | R Minz | WK-Batter | 2 | 2 | 0 | 6 | 15 | 0 | 0 | 3 | 3 | 40 | 0 | 0 | 0 |
| 565 | R Ninan | Batter | 2 | 1 | 0 | 3 | 6 | 0 | 0 | 3 | 3 | 50 | 0 | 0 | 0 |
| 566 | R Parag | All-rounder | 86 | 76 | 13 | 1612 | 1131 | 114 | 91 | 95 | 25.59 | 142.53 | 7 | 0 | 3 |
| 567 | R Powell | Batter | 29 | 23 | 3 | 365 | 249 | 22 | 28 | 67* | 18.25 | 146.59 | 1 | 0 | 2 |
| 568 | R Rampaul | Bowler | 12 | 7 | 2 | 51 | 50 | 3 | 2 | 23* | 10.2 | 102 | 0 | 0 | 3 |
| 569 | R Ravindra | All-rounder | 18 | 18 | 1 | 413 | 287 | 40 | 16 | 65* | 24.29 | 143.9 | 2 | 0 | 2 |
| 570 | R Sai Kishore | All-rounder | 25 | 4 | 0 | 18 | 16 | 0 | 2 | 13 | 4.5 | 112.5 | 0 | 0 | 0 |
| 571 | R Sanjay Yadav | Batter | 1 | 1 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 572 | R Sathish | Batter | 34 | 24 | 7 | 270 | 231 | 22 | 6 | 27* | 15.88 | 116.88 | 0 | 0 | 2 |
| 573 | R Sharma | Bowler | 44 | 19 | 6 | 66 | 75 | 5 | 3 | 14* | 5.08 | 88 | 0 | 0 | 7 |
| 574 | R Sharma | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 575 | R Shepherd | All-rounder | 20 | 12 | 5 | 185 | 87 | 12 | 17 | 53* | 26.43 | 212.64 | 1 | 0 | 2 |
| 576 | R Shukla | Bowler | 7 | 4 | 3 | 19 | 23 | 2 | 0 | 14 | 19 | 82.61 | 0 | 0 | 0 |
| 577 | R Singh | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 578 | R Tewatia | All-rounder | 111 | 79 | 31 | 1136 | 828 | 92 | 55 | 53 | 23.67 | 137.2 | 1 | 0 | 2 |
| 579 | R Vinay Kumar | Bowler | 104 | 42 | 15 | 310 | 274 | 21 | 9 | 26* | 11.48 | 113.14 | 0 | 0 | 3 |
| 580 | RA Bawa | All-rounder | 5 | 3 | 1 | 19 | 18 | 1 | 0 | 11 | 9.5 | 105.56 | 0 | 0 | 1 |
| 581 | RA Jadeja | All-rounder | 256 | 195 | 78 | 3267 | 2509 | 241 | 117 | 77* | 27.92 | 130.21 | 5 | 0 | 9 |
| 582 | RA Shaikh | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 583 | RA Tripathi | Batter | 100 | 98 | 10 | 2291 | 1662 | 229 | 85 | 93 | 26.03 | 137.85 | 12 | 0 | 4 |
| 584 | Rahmanullah Gurbaz | Batter | 18 | 18 | 1 | 363 | 269 | 34 | 22 | 81 | 21.35 | 134.94 | 2 | 0 | 2 |
| 585 | Ramandeep Singh | All-rounder | 33 | 22 | 10 | 231 | 150 | 10 | 17 | 35 | 19.25 | 154 | 0 | 0 | 1 |
| 586 | Rashid Khan | Bowler | 139 | 68 | 25 | 609 | 382 | 44 | 41 | 79* | 14.16 | 159.42 | 1 | 0 | 16 |
| 587 | Rasikh Salam | All-rounder | 13 | 6 | 1 | 40 | 40 | 5 | 0 | 10 | 8 | 100 | 0 | 0 | 0 |
| 588 | Ravi Bishnoi | Bowler | 80 | 16 | 6 | 45 | 66 | 2 | 2 | 13 | 4.5 | 68.18 | 0 | 0 | 2 |
| 589 | RD Chahar | Bowler | 80 | 22 | 7 | 129 | 124 | 13 | 5 | 25* | 8.6 | 104.03 | 0 | 0 | 7 |
| 590 | RD Gaikwad | Batter | 74 | 73 | 8 | 2543 | 1856 | 234 | 96 | 108* | 39.12 | 137.02 | 20 | 2 | 7 |
| 591 | RD Rickelton | WK-Batter | 17 | 17 | 1 | 486 | 315 | 53 | 26 | 81 | 30.38 | 154.29 | 4 | 0 | 0 |
| 592 | RE Levi | Batter | 6 | 6 | 0 | 83 | 73 | 10 | 4 | 50 | 13.83 | 113.7 | 1 | 0 | 2 |
| 593 | RE van der Merwe | Bowler | 21 | 15 | 4 | 159 | 141 | 11 | 8 | 35 | 14.45 | 112.77 | 0 | 0 | 0 |
| 594 | RG More | Batter | 2 | 1 | 1 | 2 | 2 | 0 | 0 | 2* | 2 | 100 | 0 | 0 | 0 |
| 595 | RG Sharma | Batter | 275 | 270 | 31 | 7166 | 5407 | 651 | 310 | 109* | 29.98 | 132.53 | 48 | 2 | 17 |
| 596 | RJ Gleeson | Batter | 3 | 1 | 1 | 2 | 2 | 0 | 0 | 2* | 2 | 100 | 0 | 0 | 0 |
| 597 | RJ Harris | Bowler | 37 | 21 | 9 | 117 | 112 | 6 | 3 | 17 | 9.75 | 104.46 | 0 | 0 | 2 |
| 598 | RJ Peterson | Batter | 5 | 5 | 2 | 32 | 30 | 3 | 1 | 16* | 10.67 | 106.67 | 0 | 0 | 1 |
| 599 | RJ Quiney | Batter | 7 | 7 | 0 | 103 | 102 | 12 | 3 | 51 | 14.71 | 100.98 | 1 | 0 | 0 |
| 600 | RJW Topley | Bowler | 6 | 1 | 1 | 3 | 6 | 0 | 0 | 3* | 3 | 50 | 0 | 0 | 0 |
| 601 | RK Bhui | Batter | 4 | 4 | 0 | 10 | 26 | 0 | 0 | 7 | 2.5 | 38.46 | 0 | 0 | 2 |
| 602 | RK Singh | Batter | 61 | 53 | 16 | 1167 | 803 | 95 | 57 | 67* | 31.54 | 145.33 | 4 | 0 | 0 |
| 603 | RM Patidar | Batter | 44 | 40 | 3 | 1190 | 751 | 79 | 77 | 112* | 32.16 | 158.46 | 9 | 1 | 1 |
| 604 | RN ten Doeschate | Batter | 29 | 21 | 7 | 326 | 235 | 26 | 15 | 70* | 23.29 | 138.72 | 1 | 0 | 3 |
| 605 | RP Meredith | Bowler | 18 | 2 | 2 | 0 | 3 | 0 | 0 | 0* | 0 | 0 | 0 | 0 | 0 |
| 606 | RP Singh | Bowler | 82 | 28 | 14 | 52 | 76 | 2 | 1 | 10 | 3.71 | 68.42 | 0 | 0 | 4 |
| 607 | RR Bhatkal | Batter | 1 | 1 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 608 | RR Bose | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 609 | RR Pant | WK-Batter | 127 | 128 | 23 | 3641 | 2476 | 331 | 170 | 128* | 34.68 | 147.05 | 20 | 2 | 6 |
| 610 | RR Powar | Bowler | 27 | 9 | 6 | 67 | 64 | 6 | 1 | 28* | 22.33 | 104.69 | 0 | 0 | 1 |
| 611 | RR Raje | All-rounder | 10 | 5 | 4 | 20 | 18 | 1 | 1 | 11* | 20 | 111.11 | 0 | 0 | 0 |
| 612 | RR Rossouw | Batter | 22 | 22 | 2 | 473 | 308 | 45 | 25 | 82* | 23.65 | 153.57 | 2 | 0 | 4 |
| 613 | RR Sarwan | Batter | 4 | 4 | 0 | 73 | 75 | 6 | 1 | 31 | 18.25 | 97.33 | 0 | 0 | 0 |
| 614 | RS Bopara | All-rounder | 24 | 22 | 4 | 531 | 453 | 39 | 16 | 84 | 29.5 | 117.22 | 3 | 0 | 2 |
| 615 | RS Gavaskar | Batter | 2 | 1 | 0 | 2 | 8 | 0 | 0 | 2 | 2 | 25 | 0 | 0 | 0 |
| 616 | RS Hangargekar | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 617 | RS Sodhi | Batter | 3 | 1 | 1 | 4 | 2 | 1 | 0 | 4* | 4 | 200 | 0 | 0 | 0 |
| 618 | RT Ponting | Batter | 10 | 9 | 0 | 91 | 128 | 5 | 2 | 28 | 10.11 | 71.09 | 0 | 0 | 3 |
| 619 | RV Gomez | Batter | 13 | 9 | 4 | 50 | 51 | 5 | 1 | 26* | 10 | 98.04 | 0 | 0 | 3 |
| 620 | RV Patel | Batter | 9 | 7 | 2 | 80 | 73 | 6 | 2 | 23 | 16 | 109.59 | 0 | 0 | 0 |
| 621 | RV Pawar | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 622 | RV Uthappa | Batter | 205 | 198 | 18 | 4954 | 3801 | 481 | 182 | 88 | 27.52 | 130.33 | 27 | 0 | 8 |
| 623 | RW Price | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 624 | S Ahamad | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 625 | S Anirudha | Batter | 20 | 12 | 4 | 136 | 113 | 9 | 7 | 64 | 17 | 120.35 | 1 | 0 | 2 |
| 626 | S Aravind | Bowler | 38 | 10 | 7 | 59 | 57 | 7 | 0 | 14* | 19.67 | 103.51 | 0 | 0 | 1 |
| 627 | S Arora | Batter | 2 | 2 | 0 | 9 | 7 | 0 | 1 | 9 | 4.5 | 128.57 | 0 | 0 | 1 |
| 628 | S Badree | Bowler | 12 | 5 | 0 | 13 | 23 | 0 | 0 | 8 | 2.6 | 56.52 | 0 | 0 | 2 |
| 629 | S Badrinath | Batter | 94 | 65 | 18 | 1441 | 1212 | 154 | 28 | 71* | 30.66 | 118.89 | 11 | 0 | 6 |
| 630 | S Chanderpaul | Batter | 3 | 3 | 0 | 25 | 31 | 4 | 0 | 16 | 8.33 | 80.65 | 0 | 0 | 0 |
| 631 | S Deswal | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 632 | S Dhawan | Batter | 222 | 222 | 29 | 6769 | 5326 | 768 | 153 | 106* | 35.07 | 127.09 | 51 | 2 | 12 |
| 633 | S Dube | All-rounder | 82 | 78 | 15 | 1928 | 1338 | 115 | 125 | 95* | 30.6 | 144.1 | 10 | 0 | 3 |
| 634 | S Dubey | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 635 | S Gopal | Bowler | 52 | 22 | 8 | 180 | 169 | 19 | 2 | 24 | 12.86 | 106.51 | 0 | 0 | 4 |
| 636 | S Hussain | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 637 | S Joseph | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 638 | S Kaul | Bowler | 55 | 9 | 5 | 20 | 36 | 1 | 0 | 7* | 5 | 55.56 | 0 | 0 | 2 |
| 639 | S Kaushik | All-rounder | 10 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 640 | S Khan | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 641 | S Ladda | Bowler | 9 | 2 | 1 | 0 | 9 | 0 | 0 | 0* | 0 | 0 | 0 | 0 | 1 |
| 642 | S Lamichhane | Bowler | 9 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 643 | S Midhun | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 644 | S Mishra | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 645 | S Nadeem | Bowler | 72 | 20 | 6 | 39 | 87 | 2 | 0 | 6* | 2.79 | 44.83 | 0 | 0 | 6 |
| 646 | S Narwal | Bowler | 7 | 4 | 1 | 37 | 27 | 6 | 0 | 23 | 12.33 | 137.04 | 0 | 0 | 1 |
| 647 | S Parakh | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 648 | S Rana | Batter | 11 | 8 | 4 | 91 | 81 | 9 | 1 | 19* | 22.75 | 112.35 | 0 | 0 | 0 |
| 649 | S Randiv | All-rounder | 8 | 1 | 0 | 2 | 4 | 0 | 0 | 2 | 2 | 50 | 0 | 0 | 0 |
| 650 | S Ranjan | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 651 | S Ravichandran | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 652 | S Sandeep Warrier | Bowler | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 653 | S Sohal | Batter | 22 | 20 | 0 | 368 | 292 | 34 | 18 | 62 | 18.4 | 126.03 | 2 | 0 | 3 |
| 654 | S Sreesanth | Bowler | 44 | 12 | 8 | 34 | 55 | 6 | 0 | 15* | 8.5 | 61.82 | 0 | 0 | 3 |
| 655 | S Sriram | Batter | 2 | 2 | 0 | 31 | 36 | 3 | 0 | 27 | 15.5 | 86.11 | 0 | 0 | 0 |
| 656 | S Tyagi | All-rounder | 14 | 1 | 1 | 3 | 4 | 0 | 0 | 3* | 3 | 75 | 0 | 0 | 0 |
| 657 | S Vidyut | Batter | 9 | 8 | 0 | 145 | 109 | 21 | 3 | 54 | 18.13 | 133.03 | 1 | 0 | 1 |
| 658 | SA Abbott | Batter | 3 | 3 | 0 | 22 | 18 | 1 | 2 | 14 | 7.33 | 122.22 | 0 | 0 | 0 |
| 659 | SA Asnodkar | Batter | 20 | 19 | 0 | 423 | 339 | 56 | 10 | 60 | 22.26 | 124.78 | 2 | 0 | 2 |
| 660 | SA Yadav | Batter | 169 | 155 | 28 | 4384 | 2948 | 460 | 171 | 103* | 34.52 | 148.71 | 30 | 2 | 11 |
| 661 | Sachin Baby | Batter | 20 | 11 | 2 | 144 | 118 | 11 | 5 | 33 | 16 | 122.03 | 0 | 0 | 1 |
| 662 | Salman Butt | Batter | 7 | 7 | 0 | 193 | 161 | 30 | 2 | 73 | 27.57 | 119.88 | 1 | 0 | 0 |
| 663 | Sameer Rizvi | All-rounder | 17 | 12 | 3 | 332 | 221 | 27 | 20 | 90 | 36.89 | 150.23 | 3 | 0 | 2 |
| 664 | Sandeep Sharma | Bowler | 139 | 26 | 20 | 60 | 75 | 4 | 0 | 9 | 10 | 80 | 0 | 0 | 4 |
| 665 | Sanvir Singh | Batter | 6 | 5 | 3 | 25 | 21 | 2 | 1 | 8* | 12.5 | 119.05 | 0 | 0 | 1 |
| 666 | Saurav Chauhan | Batter | 3 | 3 | 0 | 18 | 15 | 1 | 1 | 9 | 6 | 120 | 0 | 0 | 1 |
| 667 | SB Bangar | Batter | 12 | 7 | 1 | 49 | 58 | 1 | 3 | 17* | 8.17 | 84.48 | 0 | 0 | 0 |
| 668 | SB Dubey | Batter | 13 | 11 | 5 | 139 | 85 | 9 | 10 | 34* | 23.17 | 163.53 | 0 | 0 | 1 |
| 669 | SB Jakati | Bowler | 59 | 5 | 4 | 28 | 29 | 3 | 0 | 13 | 28 | 96.55 | 0 | 0 | 0 |
| 670 | SB Joshi | Batter | 4 | 2 | 0 | 6 | 14 | 0 | 0 | 3 | 3 | 42.86 | 0 | 0 | 0 |
| 671 | SB Styris | All-rounder | 12 | 10 | 3 | 131 | 133 | 10 | 3 | 36* | 18.71 | 98.5 | 0 | 0 | 0 |
| 672 | SB Wagh | Bowler | 8 | 2 | 0 | 2 | 3 | 0 | 0 | 2 | 1 | 66.67 | 0 | 0 | 1 |
| 673 | SC Ganguly | Batter | 59 | 56 | 3 | 1349 | 1263 | 137 | 42 | 91 | 25.45 | 106.81 | 7 | 0 | 4 |
| 674 | SC Kuggeleijn | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 675 | SD Chitnis | Batter | 11 | 8 | 1 | 99 | 89 | 10 | 2 | 38 | 14.14 | 111.24 | 0 | 0 | 0 |
| 676 | SD Hope | WK-Batter | 9 | 9 | 1 | 183 | 122 | 12 | 12 | 41 | 22.88 | 150 | 0 | 0 | 0 |
| 677 | SD Lad | Batter | 1 | 1 | 0 | 15 | 13 | 1 | 1 | 15 | 15 | 115.38 | 0 | 0 | 0 |
| 678 | SE Bond | All-rounder | 8 | 1 | 0 | 1 | 2 | 0 | 0 | 1 | 1 | 50 | 0 | 0 | 0 |
| 679 | SE Marsh | Batter | 71 | 70 | 7 | 2489 | 1871 | 269 | 78 | 115 | 39.51 | 133.03 | 20 | 1 | 1 |
| 680 | SE Rutherford | Batter | 26 | 22 | 4 | 427 | 304 | 28 | 28 | 46 | 23.72 | 140.46 | 0 | 0 | 1 |
| 681 | Sediqullah Atal | Batter | 1 | 1 | 0 | 22 | 16 | 0 | 2 | 22 | 22 | 137.5 | 0 | 0 | 0 |
| 682 | SH Johnson | Batter | 9 | 5 | 5 | 8 | 11 | 1 | 0 | 5* | 8 | 72.73 | 0 | 0 | 0 |
| 683 | Shahbaz Ahmed | All-rounder | 59 | 39 | 10 | 560 | 464 | 30 | 25 | 59* | 19.31 | 120.69 | 1 | 0 | 1 |
| 684 | Shahid Afridi | All-rounder | 10 | 9 | 1 | 81 | 46 | 7 | 6 | 33 | 10.13 | 176.09 | 0 | 0 | 1 |
| 685 | Shakib Al Hasan | All-rounder | 71 | 53 | 12 | 795 | 639 | 73 | 21 | 66* | 19.39 | 124.41 | 2 | 0 | 4 |
| 686 | Shashank Singh | Batter | 45 | 35 | 15 | 791 | 501 | 58 | 43 | 68* | 39.55 | 157.88 | 5 | 0 | 2 |
| 687 | Shivam Mavi | Bowler | 32 | 11 | 2 | 51 | 56 | 4 | 2 | 20 | 5.67 | 91.07 | 0 | 0 | 3 |
| 688 | Shivam Sharma | Batter | 5 | 2 | 1 | 5 | 3 | 1 | 0 | 4 | 5 | 166.67 | 0 | 0 | 0 |
| 689 | Shivam Singh | Batter | 1 | 1 | 1 | 2 | 3 | 0 | 0 | 2* | 2 | 66.67 | 0 | 0 | 0 |
| 690 | Shivang Kumar | All-rounder | 2 | 2 | 0 | 9 | 6 | 2 | 0 | 5 | 4.5 | 150 | 0 | 0 | 0 |
| 691 | Shoaib Ahmed | Bowler | 8 | 3 | 1 | 1 | 6 | 0 | 0 | 1* | 0.5 | 16.67 | 0 | 0 | 2 |
| 692 | Shoaib Akhtar | Batter | 3 | 1 | 0 | 2 | 7 | 0 | 0 | 2 | 2 | 28.57 | 0 | 0 | 0 |
| 693 | Shoaib Malik | Batter | 7 | 5 | 1 | 52 | 47 | 5 | 0 | 24 | 13 | 110.64 | 0 | 0 | 0 |
| 694 | Shubman Gill | Batter | 120 | 116 | 16 | 3975 | 2859 | 382 | 124 | 129 | 39.75 | 139.03 | 27 | 4 | 4 |
| 695 | Sikandar Raza | Batter | 9 | 9 | 2 | 182 | 136 | 12 | 8 | 57 | 26 | 133.82 | 1 | 0 | 0 |
| 696 | Simarjeet Singh | Bowler | 14 | 6 | 3 | 10 | 15 | 0 | 0 | 3* | 3.33 | 66.67 | 0 | 0 | 2 |
| 697 | SJ Srivastava | Bowler | 14 | 4 | 3 | 5 | 5 | 0 | 0 | 3* | 5 | 100 | 0 | 0 | 1 |
| 698 | SK Raina | Batter | 204 | 201 | 30 | 5536 | 4046 | 506 | 204 | 100* | 32.37 | 136.83 | 39 | 1 | 8 |
| 699 | SK Rasheed | Batter | 5 | 5 | 0 | 71 | 63 | 9 | 2 | 27 | 14.2 | 112.7 | 0 | 0 | 1 |
| 700 | SK Trivedi | Bowler | 76 | 14 | 7 | 42 | 59 | 3 | 1 | 9 | 6 | 71.19 | 0 | 0 | 1 |
| 701 | SK Warne | Bowler | 55 | 27 | 9 | 198 | 214 | 14 | 6 | 34* | 11 | 92.52 | 0 | 0 | 5 |
| 702 | SL Malinga | Bowler | 122 | 20 | 6 | 88 | 99 | 6 | 5 | 17 | 6.29 | 88.89 | 0 | 0 | 4 |
| 703 | SM Boland | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 704 | SM Curran | All-rounder | 64 | 53 | 13 | 997 | 731 | 85 | 41 | 88 | 24.93 | 136.39 | 6 | 0 | 4 |
| 705 | SM Harwood | Batter | 3 | 2 | 2 | 9 | 14 | 0 | 0 | 6* | 9 | 64.29 | 0 | 0 | 0 |
| 706 | SM Katich | Batter | 11 | 11 | 1 | 241 | 186 | 26 | 8 | 75 | 24.1 | 129.57 | 2 | 0 | 1 |
| 707 | SM Pollock | All-rounder | 13 | 8 | 0 | 147 | 111 | 12 | 8 | 33 | 18.38 | 132.43 | 0 | 0 | 2 |
| 708 | SMSM Senanayake | All-rounder | 8 | 4 | 3 | 10 | 17 | 0 | 0 | 7* | 10 | 58.82 | 0 | 0 | 0 |
| 709 | SN Khan | Batter | 53 | 39 | 10 | 684 | 497 | 79 | 18 | 67 | 23.59 | 137.63 | 2 | 0 | 3 |
| 710 | SN Thakur | All-rounder | 108 | 41 | 13 | 333 | 240 | 31 | 13 | 68 | 11.89 | 138.75 | 1 | 0 | 7 |
| 711 | SO Hetmyer | Batter | 89 | 81 | 29 | 1512 | 995 | 95 | 95 | 75 | 29.08 | 151.96 | 5 | 0 | 3 |
| 712 | Sohail Tanvir | Bowler | 11 | 5 | 2 | 36 | 29 | 3 | 1 | 13 | 12 | 124.14 | 0 | 0 | 0 |
| 713 | SP Fleming | Batter | 10 | 10 | 1 | 196 | 165 | 27 | 3 | 45 | 21.78 | 118.79 | 0 | 0 | 1 |
| 714 | SP Goswami | WK-Batter | 31 | 21 | 1 | 293 | 295 | 32 | 3 | 52 | 14.65 | 99.32 | 1 | 0 | 4 |
| 715 | SP Jackson | Batter | 9 | 8 | 2 | 61 | 57 | 5 | 1 | 16 | 10.17 | 107.02 | 0 | 0 | 1 |
| 716 | SP Narine | All-rounder | 190 | 119 | 19 | 1792 | 1073 | 189 | 118 | 109 | 17.92 | 167.01 | 7 | 1 | 15 |
| 717 | SPD Smith | Batter | 103 | 95 | 23 | 2495 | 1945 | 226 | 60 | 101 | 34.65 | 128.28 | 11 | 1 | 1 |
| 718 | SR Tendulkar | Batter | 78 | 78 | 9 | 2334 | 1948 | 296 | 29 | 100* | 33.83 | 119.82 | 13 | 1 | 4 |
| 719 | SR Watson | All-rounder | 145 | 143 | 17 | 3880 | 2813 | 377 | 190 | 117* | 30.79 | 137.93 | 21 | 4 | 8 |
| 720 | SS Agarwal | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 721 | SS Cottrell | Bowler | 6 | 1 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 722 | SS Iyer | Batter | 136 | 134 | 22 | 3803 | 2840 | 319 | 157 | 97* | 33.96 | 133.91 | 28 | 0 | 7 |
| 723 | SS Mundhe | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 724 | SS Prabhudessai | Batter | 11 | 10 | 0 | 126 | 106 | 11 | 4 | 34 | 12.6 | 118.87 | 0 | 0 | 1 |
| 725 | SS Sarkar | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 726 | SS Shaikh | Batter | 2 | 1 | 0 | 6 | 7 | 1 | 0 | 6 | 6 | 85.71 | 0 | 0 | 0 |
| 727 | SS Tiwary | Batter | 92 | 73 | 21 | 1494 | 1244 | 111 | 50 | 61 | 28.73 | 120.1 | 8 | 0 | 1 |
| 728 | SSB Magala | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 729 | ST Jayasuriya | All-rounder | 30 | 30 | 2 | 768 | 532 | 84 | 39 | 114* | 27.43 | 144.36 | 4 | 1 | 2 |
| 730 | STR Binny | All-rounder | 95 | 66 | 20 | 880 | 683 | 66 | 35 | 48* | 19.13 | 128.84 | 0 | 0 | 7 |
| 731 | Sumit Kumar | Batter | 4 | 3 | 1 | 18 | 24 | 2 | 1 | 9* | 9 | 75 | 0 | 0 | 0 |
| 732 | Sunny Gupta | Batter | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 733 | Sunny Singh | Batter | 6 | 5 | 1 | 43 | 31 | 6 | 1 | 20 | 10.75 | 138.71 | 0 | 0 | 0 |
| 734 | Suryansh Shedge | All-rounder | 5 | 3 | 0 | 7 | 11 | 0 | 0 | 4 | 2.33 | 63.64 | 0 | 0 | 0 |
| 735 | Suyash Sharma | Bowler | 29 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 736 | SV Samson | WK-Batter | 179 | 174 | 19 | 4726 | 3402 | 381 | 220 | 119 | 30.49 | 138.92 | 26 | 3 | 10 |
| 737 | SW Billings | Batter | 30 | 27 | 1 | 503 | 388 | 40 | 20 | 56 | 19.35 | 129.64 | 3 | 0 | 3 |
| 738 | SW Tait | Bowler | 21 | 5 | 2 | 23 | 26 | 1 | 1 | 11 | 7.67 | 88.46 | 0 | 0 | 1 |
| 739 | Swapnil Singh | All-rounder | 14 | 9 | 4 | 51 | 45 | 3 | 3 | 15* | 10.2 | 113.33 | 0 | 0 | 2 |
| 740 | SZ Mulani | Batter | 2 | 1 | 1 | 1 | 1 | 0 | 0 | 1* | 1 | 100 | 0 | 0 | 0 |
| 741 | T Banton | WK-Batter | 2 | 2 | 0 | 18 | 20 | 1 | 1 | 10 | 9 | 90 | 0 | 0 | 0 |
| 742 | T Henderson | Batter | 2 | 2 | 0 | 11 | 16 | 0 | 1 | 11 | 5.5 | 68.75 | 0 | 0 | 1 |
| 743 | T Kohler-Cadmore | Batter | 3 | 3 | 0 | 48 | 54 | 7 | 1 | 20 | 16 | 88.89 | 0 | 0 | 0 |
| 744 | T Kohli | Batter | 4 | 3 | 0 | 11 | 19 | 0 | 1 | 7 | 3.67 | 57.89 | 0 | 0 | 0 |
| 745 | T Mishra | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 746 | T Natarajan | Bowler | 67 | 2 | 2 | 3 | 5 | 0 | 0 | 3* | 3 | 60 | 0 | 0 | 0 |
| 747 | T Shamsi | Batter | 5 | 1 | 1 | 2 | 4 | 0 | 0 | 2* | 2 | 50 | 0 | 0 | 0 |
| 748 | T Singh | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 749 | T Stubbs | Batter | 36 | 34 | 16 | 760 | 475 | 54 | 39 | 71* | 42.22 | 160 | 3 | 0 | 2 |
| 750 | T Taibu | Batter | 3 | 3 | 0 | 31 | 26 | 3 | 0 | 15 | 10.33 | 119.23 | 0 | 0 | 0 |
| 751 | T Thushara | All-rounder | 6 | 4 | 2 | 12 | 18 | 0 | 0 | 8 | 6 | 66.67 | 0 | 0 | 0 |
| 752 | T Vijay | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 753 | TA Boult | Bowler | 121 | 24 | 15 | 86 | 83 | 5 | 3 | 17* | 9.56 | 103.61 | 0 | 0 | 3 |
| 754 | Tanush Kotian | Batter | 1 | 1 | 0 | 24 | 31 | 3 | 0 | 24 | 24 | 77.42 | 0 | 0 | 0 |
| 755 | TD Paine | Batter | 2 | 2 | 0 | 10 | 26 | 0 | 0 | 8 | 5 | 38.46 | 0 | 0 | 0 |
| 756 | Tejas Baroka | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 757 | TG Southee | Bowler | 54 | 19 | 6 | 120 | 107 | 8 | 4 | 36* | 9.23 | 112.15 | 0 | 0 | 3 |
| 758 | TH David | Batter | 52 | 46 | 20 | 932 | 523 | 58 | 69 | 70* | 35.85 | 178.2 | 2 | 0 | 3 |
| 759 | Tilak Varma | Batter | 57 | 54 | 11 | 1533 | 1064 | 119 | 74 | 84* | 35.65 | 144.08 | 8 | 0 | 2 |
| 760 | TK Curran | Bowler | 13 | 10 | 5 | 127 | 107 | 10 | 3 | 54* | 25.4 | 118.69 | 1 | 0 | 0 |
| 761 | TL Seifert | WK-Batter | 3 | 3 | 0 | 26 | 23 | 4 | 0 | 21 | 8.67 | 113.04 | 0 | 0 | 0 |
| 762 | TL Suman | Batter | 43 | 39 | 7 | 676 | 575 | 55 | 26 | 78* | 21.13 | 117.57 | 2 | 0 | 3 |
| 763 | TM Dilshan | All-rounder | 51 | 50 | 7 | 1153 | 1007 | 140 | 24 | 76* | 26.81 | 114.5 | 9 | 0 | 6 |
| 764 | TM Head | Batter | 41 | 40 | 4 | 1210 | 712 | 135 | 58 | 102 | 33.61 | 169.94 | 8 | 1 | 5 |
| 765 | TM Srivastava | Batter | 7 | 3 | 2 | 8 | 11 | 0 | 0 | 7 | 8 | 72.73 | 0 | 0 | 0 |
| 766 | TP Sudhindra | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 767 | TR Birt | Batter | 5 | 5 | 0 | 75 | 58 | 9 | 2 | 27 | 15 | 129.31 | 0 | 0 | 0 |
| 768 | TS Mills | Bowler | 10 | 5 | 1 | 8 | 14 | 0 | 1 | 6 | 2 | 57.14 | 0 | 0 | 2 |
| 769 | TU Deshpande | Bowler | 48 | 8 | 6 | 28 | 22 | 2 | 1 | 20* | 14 | 127.27 | 0 | 0 | 0 |
| 770 | U Kaul | Batter | 5 | 1 | 1 | 0 | 1 | 0 | 0 | 0* | 0 | 0 | 0 | 0 | 0 |
| 771 | UA Birla | Batter | 2 | 1 | 0 | 7 | 14 | 1 | 0 | 7 | 7 | 50 | 0 | 0 | 0 |
| 772 | UBT Chand | Batter | 21 | 20 | 0 | 300 | 300 | 32 | 9 | 58 | 15 | 100 | 1 | 0 | 4 |
| 773 | Umar Gul | Bowler | 6 | 4 | 1 | 39 | 19 | 1 | 5 | 24 | 13 | 205.26 | 0 | 0 | 0 |
| 774 | Umran Malik | Bowler | 26 | 5 | 4 | 23 | 16 | 1 | 2 | 19* | 23 | 143.75 | 0 | 0 | 1 |
| 775 | Urvil Patel | Batter | 3 | 3 | 0 | 68 | 32 | 5 | 6 | 37 | 22.67 | 212.5 | 0 | 0 | 1 |
| 776 | UT Khawaja | Batter | 6 | 6 | 0 | 127 | 100 | 14 | 3 | 30 | 21.17 | 127 | 0 | 0 | 0 |
| 777 | UT Yadav | Bowler | 148 | 48 | 27 | 208 | 201 | 16 | 9 | 24* | 9.9 | 103.48 | 0 | 0 | 8 |
| 778 | V Chakaravarthy | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 779 | V Kaverappa | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 780 | V Kohli | Batter | 268 | 263 | 43 | 8768 | 6579 | 781 | 298 | 113* | 39.85 | 133.27 | 64 | 8 | 10 |
| 781 | V Malhotra | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 782 | V Nigam | All-rounder | 17 | 9 | 1 | 154 | 86 | 18 | 8 | 39 | 19.25 | 179.07 | 0 | 0 | 1 |
| 783 | V Nishad | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 784 | V Ostwal | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 785 | V Pratap Singh | All-rounder | 9 | 1 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| 786 | V Puthur | Batter | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 787 | V Sehwag | Batter | 104 | 104 | 5 | 2728 | 1755 | 334 | 106 | 122 | 27.56 | 155.44 | 16 | 2 | 7 |
| 788 | V Shankar | All-rounder | 78 | 63 | 16 | 1233 | 950 | 88 | 48 | 69* | 26.23 | 129.79 | 7 | 0 | 2 |
| 789 | V Suryavanshi | Batter | 10 | 10 | 0 | 374 | 171 | 28 | 35 | 101 | 37.4 | 218.71 | 2 | 1 | 1 |
| 790 | V Vijaykumar | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 791 | V Viyaskanth | Batter | 3 | 1 | 1 | 7 | 5 | 0 | 0 | 7* | 7 | 140 | 0 | 0 | 0 |
| 792 | VG Arora | Bowler | 35 | 10 | 6 | 10 | 26 | 0 | 0 | 2* | 2.5 | 38.46 | 0 | 0 | 3 |
| 793 | VH Zol | Batter | 3 | 2 | 0 | 29 | 26 | 3 | 1 | 16 | 14.5 | 111.54 | 0 | 0 | 0 |
| 794 | Vijaykumar Vyshak | Bowler | 19 | 4 | 2 | 14 | 12 | 0 | 1 | 13* | 7 | 116.67 | 0 | 0 | 2 |
| 795 | Virat Singh | Batter | 3 | 2 | 0 | 15 | 26 | 1 | 0 | 11 | 7.5 | 57.69 | 0 | 0 | 0 |
| 796 | Vishnu Vinod | Batter | 6 | 6 | 0 | 56 | 57 | 3 | 3 | 30 | 9.33 | 98.25 | 0 | 0 | 0 |
| 797 | Vivrant Sharma | Batter | 3 | 1 | 0 | 69 | 47 | 9 | 2 | 69 | 69 | 146.81 | 1 | 0 | 0 |
| 798 | VR Aaron | Bowler | 52 | 12 | 7 | 50 | 72 | 2 | 2 | 17* | 10 | 69.44 | 0 | 0 | 1 |
| 799 | VR Iyer | Batter | 61 | 56 | 7 | 1468 | 1069 | 136 | 65 | 104 | 29.96 | 137.32 | 12 | 1 | 2 |
| 800 | VRV Singh | Bowler | 19 | 2 | 0 | 4 | 3 | 1 | 0 | 4 | 2 | 133.33 | 0 | 0 | 1 |
| 801 | VS Malik | All-rounder | 13 | 2 | 1 | 7 | 7 | 1 | 0 | 6 | 7 | 100 | 0 | 0 | 0 |
| 802 | VS Yeligati | Batter | 2 | 1 | 0 | 2 | 2 | 0 | 0 | 2 | 2 | 100 | 0 | 0 | 0 |
| 803 | VVS Laxman | Batter | 20 | 20 | 1 | 282 | 267 | 33 | 5 | 52 | 14.84 | 105.62 | 1 | 0 | 4 |
| 804 | VY Mahesh | Bowler | 17 | 5 | 3 | 15 | 27 | 0 | 0 | 6* | 7.5 | 55.56 | 0 | 0 | 0 |
| 805 | W Hasaranga | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 806 | W Jaffer | Batter | 8 | 8 | 0 | 130 | 121 | 14 | 3 | 50 | 16.25 | 107.44 | 1 | 0 | 1 |
| 807 | W O'Rourke | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 808 | WA Mota | Batter | 12 | 8 | 2 | 56 | 75 | 2 | 0 | 25 | 9.33 | 74.67 | 0 | 0 | 0 |
| 809 | Washington Sundar | All-rounder | 69 | 46 | 10 | 588 | 455 | 51 | 18 | 55 | 16.33 | 129.23 | 1 | 0 | 3 |
| 810 | WD Parnell | Bowler | 33 | 13 | 3 | 65 | 80 | 4 | 1 | 16 | 6.5 | 81.25 | 0 | 0 | 0 |
| 811 | WG Jacks | All-rounder | 21 | 19 | 2 | 463 | 303 | 38 | 29 | 100* | 27.24 | 152.81 | 2 | 1 | 0 |
| 812 | WP Saha | WK-Batter | 169 | 143 | 22 | 2934 | 2300 | 296 | 87 | 115* | 24.25 | 127.57 | 13 | 1 | 7 |
| 813 | WPUJC Vaas | Bowler | 13 | 11 | 3 | 81 | 73 | 2 | 3 | 20 | 10.13 | 110.96 | 0 | 0 | 3 |
| 814 | X Thalaivan Sargunam | Batter | 1 | 1 | 0 | 10 | 17 | 0 | 0 | 10 | 10 | 58.82 | 0 | 0 | 0 |
| 815 | XC Bartlett | Bowler | 7 | 2 | 1 | 22 | 20 | 1 | 1 | 11* | 22 | 110 | 0 | 0 | 0 |
| 816 | Y Charak | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 817 | Y Gnaneswara Rao | Batter | 2 | 1 | 0 | 19 | 17 | 3 | 0 | 19 | 19 | 111.76 | 0 | 0 | 0 |
| 818 | Y Nagar | Batter | 26 | 20 | 6 | 285 | 259 | 20 | 9 | 44* | 20.36 | 110.04 | 0 | 0 | 2 |
| 819 | Y Prithvi Raj | Batter | 2 | 1 | 1 | 0 | 1 | 0 | 0 | 0* | 0 | 0 | 0 | 0 | 0 |
| 820 | Y Punja | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 821 | Y Venugopal Rao | All-rounder | 65 | 52 | 8 | 985 | 836 | 77 | 37 | 71* | 22.39 | 117.82 | 3 | 0 | 2 |
| 822 | YA Abdulla | Bowler | 11 | 1 | 1 | 0 | 1 | 0 | 0 | 0* | 0 | 0 | 0 | 0 | 0 |
| 823 | Yash Dayal | Bowler | 43 | 4 | 1 | 4 | 9 | 0 | 0 | 3 | 1.33 | 44.44 | 0 | 0 | 2 |
| 824 | Yash Thakur | Bowler | 21 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 825 | Yashpal Singh | Batter | 8 | 4 | 0 | 47 | 66 | 5 | 0 | 20 | 11.75 | 71.21 | 0 | 0 | 0 |
| 826 | YBK Jaiswal | Batter | 69 | 69 | 5 | 2336 | 1521 | 278 | 100 | 124 | 36.5 | 153.58 | 17 | 2 | 4 |
| 827 | YK Pathan | All-rounder | 174 | 154 | 44 | 3222 | 2245 | 263 | 161 | 100 | 29.29 | 143.52 | 13 | 1 | 9 |
| 828 | Younis Khan | Batter | 1 | 1 | 0 | 3 | 7 | 0 | 0 | 3 | 3 | 42.86 | 0 | 0 | 0 |
| 829 | YS Chahal | Bowler | 178 | 16 | 10 | 37 | 86 | 0 | 0 | 8* | 6.17 | 43.02 | 0 | 0 | 1 |
| 830 | Yudhvir Singh | All-rounder | 9 | 4 | 0 | 22 | 16 | 1 | 2 | 14 | 5.5 | 137.5 | 0 | 0 | 1 |
| 831 | Yuvraj Singh | All-rounder | 132 | 127 | 16 | 2754 | 2122 | 218 | 149 | 83 | 24.81 | 129.78 | 13 | 0 | 4 |
| 832 | YV Dhull | Batter | 4 | 3 | 0 | 16 | 23 | 1 | 0 | 13 | 5.33 | 69.57 | 0 | 0 | 0 |
| 833 | YV Takawale | WK-Batter | 16 | 10 | 2 | 192 | 178 | 26 | 3 | 45 | 24 | 107.87 | 0 | 0 | 2 |
| 834 | Z Foulkes | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| 835 | Z Khan | Bowler | 99 | 27 | 13 | 117 | 141 | 11 | 2 | 23* | 8.36 | 82.98 | 0 | 0 | 5 |
| 836 | Zeeshan Ansari | Bowler | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## Bowling — all 836 players

| # | Player | Role | M | Inns | Balls | Runs | Wkts | Avg | Econ | SR | Best | 3W | 5W | Maidens | Dots |
|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---:|---:|---:|---:|
| 1 | A Ankolekar | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 2 | A Ashish Reddy | Bowler | 31 | 20 | 262 | 396 | 18 | 22 | 9.07 | 14.6 | 3/25 | 1 | 0 | 43 | 79 |
| 3 | A Badoni | All-rounder | 58 | 7 | 35 | 49 | 4 | 12.25 | 8.4 | 8.8 | 2/4 | 0 | 0 | 6 | 8 |
| 4 | A Chandila | Bowler | 12 | 12 | 234 | 242 | 11 | 22 | 6.21 | 21.3 | 4/13 | 1 | 0 | 39 | 103 |
| 5 | A Chopra | Batter | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 6 | A Choudhary | Batter | 5 | 5 | 101 | 144 | 5 | 28.8 | 8.55 | 20.2 | 2/17 | 0 | 0 | 16 | 42 |
| 7 | A Dananjaya | Batter | 1 | 1 | 24 | 47 | 0 | 0 | 11.75 | 0 | - | 0 | 0 | 4 | 6 |
| 8 | A Flintoff | Batter | 3 | 3 | 66 | 105 | 2 | 52.5 | 9.55 | 33 | 1/11 | 0 | 0 | 11 | 20 |
| 9 | A Kamboj | Bowler | 14 | 14 | 253 | 408 | 15 | 27.2 | 9.68 | 16.9 | 3/13 | 1 | 0 | 41 | 97 |
| 10 | A Kumar | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 11 | A Kumble | Bowler | 42 | 42 | 965 | 1058 | 45 | 23.51 | 6.58 | 21.4 | 5/5 | 5 | 1 | 159 | 374 |
| 12 | A Mandal | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 13 | A Manohar | Batter | 27 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 14 | A Mhatre | Batter | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 15 | A Mishra | Bowler | 162 | 162 | 3371 | 4145 | 174 | 23.82 | 7.38 | 19.4 | 5/17 | 17 | 1 | 558 | 1185 |
| 16 | A Mithun | All-rounder | 16 | 16 | 288 | 472 | 7 | 67.43 | 9.83 | 41.1 | 2/37 | 0 | 0 | 48 | 90 |
| 17 | A Mukund | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 18 | A Nabi | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 19 | A Nehra | Bowler | 88 | 88 | 1908 | 2495 | 106 | 23.54 | 7.85 | 18 | 4/10 | 14 | 0 | 316 | 798 |
| 20 | A Nel | Batter | 1 | 1 | 18 | 31 | 1 | 31 | 10.33 | 18 | 1/31 | 0 | 0 | 3 | 7 |
| 21 | A Nortje | Bowler | 49 | 49 | 1120 | 1696 | 61 | 27.8 | 9.09 | 18.4 | 3/33 | 4 | 0 | 185 | 422 |
| 22 | A Perala | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 23 | A Raghuvanshi | Batter | 25 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 24 | A Raghuwanshi | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 25 | A Singh | Bowler | 23 | 23 | 473 | 620 | 28 | 22.14 | 7.86 | 16.9 | 4/19 | 3 | 0 | 77 | 189 |
| 26 | A Symonds | All-rounder | 39 | 30 | 527 | 674 | 20 | 33.7 | 7.67 | 26.4 | 3/21 | 1 | 0 | 87 | 190 |
| 27 | A Tomar | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 28 | A Uniyal | Batter | 2 | 2 | 36 | 66 | 2 | 33 | 11 | 18 | 2/41 | 0 | 0 | 6 | 8 |
| 29 | A Zampa | Bowler | 22 | 22 | 467 | 652 | 31 | 21.03 | 8.38 | 15.1 | 6/19 | 3 | 1 | 77 | 139 |
| 30 | AA Bilakhia | Batter | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 31 | AA Chavan | All-rounder | 13 | 13 | 248 | 326 | 8 | 40.75 | 7.89 | 31 | 2/23 | 0 | 0 | 41 | 100 |
| 32 | AA Jhunjhunwala | Batter | 21 | 10 | 85 | 129 | 1 | 129 | 9.11 | 85 | 1/13 | 0 | 0 | 14 | 27 |
| 33 | AA Kazi | Batter | 1 | 1 | 12 | 21 | 0 | 0 | 10.5 | 0 | - | 0 | 0 | 2 | 2 |
| 34 | AA Kulkarni | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 35 | AA Noffke | Batter | 1 | 1 | 24 | 40 | 1 | 40 | 10 | 24 | 1/40 | 0 | 0 | 4 | 6 |
| 36 | AB Agarkar | Bowler | 42 | 42 | 782 | 1151 | 29 | 39.69 | 8.83 | 27 | 3/25 | 1 | 0 | 130 | 254 |
| 37 | AB Barath | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 38 | AB de Villiers | Batter | 183 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 39 | AB Dinda | Bowler | 78 | 75 | 1516 | 2073 | 69 | 30.04 | 8.2 | 22 | 4/18 | 5 | 0 | 251 | 627 |
| 40 | AB McDonald | Bowler | 10 | 10 | 186 | 261 | 11 | 23.73 | 8.42 | 16.9 | 2/25 | 0 | 0 | 31 | 50 |
| 41 | Abdul Basith | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 42 | Abdul Samad | All-rounder | 65 | 7 | 57 | 125 | 2 | 62.5 | 13.16 | 28.5 | 1/9 | 0 | 0 | 9 | 12 |
| 43 | Abdur Razzak | Batter | 1 | 1 | 12 | 29 | 0 | 0 | 14.5 | 0 | - | 0 | 0 | 2 | 5 |
| 44 | Abhinandan Singh | Batter | 2 | 2 | 40 | 68 | 3 | 22.67 | 10.2 | 13.3 | 2/30 | 0 | 0 | 6 | 13 |
| 45 | Abhishek Sharma | All-rounder | 80 | 33 | 342 | 516 | 11 | 46.91 | 9.05 | 31.1 | 2/4 | 0 | 0 | 57 | 92 |
| 46 | Abishek Porel | WK-Batter | 32 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 47 | AC Blizzard | Batter | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 48 | AC Gilchrist | WK-Batter | 80 | 1 | 1 | 0 | 1 | 0 | 0 | 1 | 1/0 | 0 | 0 | 0 | 1 |
| 49 | AC Thomas | Bowler | 15 | 15 | 315 | 406 | 14 | 29 | 7.73 | 22.5 | 3/22 | 1 | 0 | 52 | 126 |
| 50 | AC Voges | Batter | 9 | 7 | 54 | 76 | 0 | 0 | 8.44 | 0 | - | 0 | 0 | 9 | 15 |
| 51 | AD Hales | Batter | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 52 | AD Mascarenhas | Bowler | 13 | 13 | 308 | 356 | 19 | 18.74 | 6.94 | 16.2 | 5/25 | 2 | 1 | 52 | 124 |
| 53 | AD Mathews | All-rounder | 49 | 44 | 791 | 1079 | 27 | 39.96 | 8.18 | 29.3 | 4/19 | 2 | 0 | 131 | 224 |
| 54 | AD Nath | Batter | 14 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 55 | AD Russell | All-rounder | 139 | 121 | 1806 | 2863 | 123 | 23.28 | 9.51 | 14.7 | 5/15 | 13 | 1 | 294 | 612 |
| 56 | AF Milne | Bowler | 10 | 10 | 207 | 327 | 7 | 46.71 | 9.48 | 29.6 | 2/21 | 0 | 0 | 34 | 69 |
| 57 | AG Murtaza | All-rounder | 12 | 12 | 264 | 313 | 9 | 34.78 | 7.11 | 29.3 | 3/15 | 1 | 0 | 44 | 101 |
| 58 | AG Paunikar | Batter | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 59 | AJ Finch | Batter | 92 | 5 | 43 | 67 | 1 | 67 | 9.35 | 43 | 1/11 | 0 | 0 | 7 | 13 |
| 60 | AJ Hosein | Batter | 1 | 1 | 24 | 40 | 1 | 40 | 10 | 24 | 1/40 | 0 | 0 | 4 | 5 |
| 61 | AJ Turner | Batter | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 62 | AJ Tye | Bowler | 30 | 30 | 684 | 979 | 42 | 23.31 | 8.59 | 16.3 | 5/17 | 5 | 1 | 114 | 208 |
| 63 | AK Markram | Batter | 59 | 20 | 193 | 287 | 6 | 47.83 | 8.92 | 32.2 | 2/30 | 0 | 0 | 33 | 49 |
| 64 | Akash Deep | All-rounder | 14 | 14 | 278 | 548 | 10 | 54.8 | 11.83 | 27.8 | 3/45 | 1 | 0 | 45 | 89 |
| 65 | Akash Madhwal | Bowler | 17 | 17 | 352 | 590 | 23 | 25.65 | 10.06 | 15.3 | 5/5 | 5 | 1 | 58 | 105 |
| 66 | Akash Singh | Bowler | 10 | 10 | 205 | 326 | 9 | 36.22 | 9.54 | 22.8 | 2/30 | 0 | 0 | 34 | 73 |
| 67 | AL Menaria | Batter | 29 | 12 | 110 | 144 | 3 | 48 | 7.85 | 36.7 | 2/20 | 0 | 0 | 18 | 40 |
| 68 | AM Ghazanfar | Batter | 2 | 2 | 36 | 72 | 2 | 36 | 12 | 18 | 2/21 | 0 | 0 | 6 | 9 |
| 69 | AM Nayar | All-rounder | 60 | 19 | 229 | 322 | 9 | 35.78 | 8.44 | 25.4 | 3/13 | 1 | 0 | 38 | 69 |
| 70 | AM Rahane | Batter | 201 | 1 | 6 | 5 | 1 | 5 | 5 | 6 | 1/5 | 0 | 0 | 1 | 2 |
| 71 | AM Salvi | Bowler | 7 | 7 | 150 | 200 | 7 | 28.57 | 8 | 21.4 | 2/19 | 0 | 0 | 25 | 57 |
| 72 | Aman Hakim Khan | Batter | 12 | 1 | 6 | 13 | 0 | 0 | 13 | 0 | - | 0 | 0 | 1 | 1 |
| 73 | AN Ahmed | Bowler | 17 | 17 | 344 | 498 | 12 | 41.5 | 8.69 | 28.7 | 2/13 | 0 | 0 | 57 | 120 |
| 74 | AN Ghosh | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 75 | Anand Rajan | Bowler | 8 | 8 | 149 | 201 | 8 | 25.13 | 8.09 | 18.6 | 3/27 | 1 | 0 | 24 | 57 |
| 76 | Aniket Verma | Batter | 17 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 77 | Anirudh Singh | Batter | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 78 | Ankit Sharma | Bowler | 22 | 21 | 367 | 450 | 12 | 37.5 | 7.36 | 30.6 | 2/20 | 0 | 0 | 61 | 137 |
| 79 | Ankit Soni | Batter | 7 | 6 | 109 | 144 | 2 | 72 | 7.93 | 54.5 | 1/16 | 0 | 0 | 18 | 37 |
| 80 | Anmolpreet Singh | Batter | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 81 | Anuj Rawat | WK-Batter | 24 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 82 | Anureet Singh | Bowler | 23 | 22 | 412 | 623 | 18 | 34.61 | 9.07 | 22.9 | 3/23 | 1 | 0 | 67 | 139 |
| 83 | AP Dole | Batter | 3 | 3 | 66 | 112 | 5 | 22.4 | 10.18 | 13.2 | 2/36 | 0 | 0 | 11 | 20 |
| 84 | AP Majumdar | Batter | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 85 | AP Tare | WK-Batter | 35 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 86 | AR Bawne | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 87 | AR Patel | All-rounder | 166 | 164 | 3381 | 4148 | 130 | 31.91 | 7.36 | 26 | 4/21 | 4 | 0 | 561 | 1105 |
| 88 | Arjun Tendulkar | Bowler | 5 | 5 | 73 | 114 | 3 | 38 | 9.37 | 24.3 | 1/9 | 0 | 0 | 11 | 30 |
| 89 | Arshad Khan | Bowler | 19 | 19 | 272 | 521 | 12 | 43.42 | 11.49 | 22.7 | 3/39 | 1 | 0 | 44 | 94 |
| 90 | Arshdeep Singh | Bowler | 86 | 84 | 1774 | 2669 | 97 | 27.52 | 9.03 | 18.3 | 5/32 | 11 | 1 | 291 | 625 |
| 91 | AS Joseph | Bowler | 22 | 22 | 434 | 691 | 21 | 32.9 | 9.55 | 20.7 | 6/12 | 1 | 1 | 71 | 162 |
| 92 | AS Rajpoot | Bowler | 29 | 29 | 529 | 814 | 24 | 33.92 | 9.23 | 22 | 5/14 | 2 | 1 | 88 | 192 |
| 93 | AS Raut | Batter | 22 | 5 | 30 | 44 | 0 | 0 | 8.8 | 0 | - | 0 | 0 | 5 | 6 |
| 94 | AS Roy | All-rounder | 14 | 12 | 179 | 249 | 7 | 35.57 | 8.35 | 25.6 | 2/19 | 0 | 0 | 29 | 61 |
| 95 | AS Yadav | Batter | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 96 | Ashok Sharma | Bowler | 3 | 3 | 60 | 113 | 2 | 56.5 | 11.3 | 30 | 1/31 | 0 | 0 | 10 | 20 |
| 97 | Ashutosh Sharma | All-rounder | 24 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 98 | Ashwani Kumar | Bowler | 7 | 7 | 123 | 232 | 11 | 21.09 | 11.32 | 11.2 | 4/24 | 1 | 0 | 21 | 35 |
| 99 | AT Carey | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 100 | AT Rayudu | Batter | 204 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 101 | Atharva Taide | Batter | 10 | 1 | 1 | 4 | 0 | 0 | 24 | 0 | - | 0 | 0 | 0 | 0 |
| 102 | AU Rashid | Bowler | 3 | 3 | 60 | 91 | 2 | 45.5 | 9.1 | 30 | 2/23 | 0 | 0 | 10 | 20 |
| 103 | AUK Pathan | Batter | 8 | 3 | 39 | 63 | 0 | 0 | 9.69 | 0 | - | 0 | 0 | 6 | 9 |
| 104 | Avesh Khan | Bowler | 76 | 76 | 1643 | 2497 | 90 | 27.74 | 9.12 | 18.3 | 4/24 | 11 | 0 | 272 | 575 |
| 105 | Azhar Mahmood | Bowler | 23 | 23 | 537 | 700 | 29 | 24.14 | 7.82 | 18.5 | 3/20 | 4 | 0 | 87 | 199 |
| 106 | Azmatullah Omarzai | All-rounder | 17 | 15 | 288 | 465 | 12 | 38.75 | 9.69 | 24 | 2/27 | 0 | 0 | 48 | 95 |
| 107 | B Akhil | All-rounder | 15 | 13 | 188 | 242 | 6 | 40.33 | 7.72 | 31.3 | 2/17 | 0 | 0 | 31 | 60 |
| 108 | B Carse | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 109 | B Chipli | Batter | 23 | 1 | 6 | 20 | 0 | 0 | 20 | 0 | - | 0 | 0 | 1 | 1 |
| 110 | B Dwarshuis | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 111 | B Geeves | Batter | 2 | 2 | 48 | 91 | 1 | 91 | 11.38 | 48 | 1/50 | 0 | 0 | 8 | 15 |
| 112 | B Indrajith | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 113 | B Kumar | Bowler | 192 | 192 | 4270 | 5484 | 202 | 27.15 | 7.71 | 21.1 | 5/19 | 17 | 2 | 707 | 1765 |
| 114 | B Laughlin | All-rounder | 9 | 9 | 168 | 282 | 10 | 28.2 | 10.07 | 16.8 | 2/15 | 0 | 0 | 26 | 42 |
| 115 | B Lee | Bowler | 38 | 38 | 875 | 1095 | 25 | 43.8 | 7.51 | 35 | 3/15 | 1 | 0 | 145 | 374 |
| 116 | B Muzarabani | Bowler | 2 | 2 | 42 | 75 | 4 | 18.75 | 10.71 | 10.5 | 4/41 | 1 | 0 | 7 | 12 |
| 117 | B Sai Sudharsan | Batter | 43 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 118 | B Stanlake | All-rounder | 6 | 6 | 144 | 200 | 7 | 28.57 | 8.33 | 20.6 | 2/21 | 0 | 0 | 24 | 64 |
| 119 | B Sumanth | Batter | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 120 | BA Bhatt | Bowler | 17 | 15 | 296 | 397 | 12 | 33.08 | 8.05 | 24.7 | 4/22 | 1 | 0 | 48 | 93 |
| 121 | BA Stokes | All-rounder | 45 | 38 | 689 | 992 | 28 | 35.43 | 8.64 | 24.6 | 3/15 | 3 | 0 | 114 | 228 |
| 122 | Basil Thampi | Bowler | 25 | 25 | 521 | 846 | 22 | 38.45 | 9.74 | 23.7 | 3/29 | 2 | 0 | 85 | 152 |
| 123 | BAW Mendis | All-rounder | 10 | 11 | 244 | 303 | 8 | 37.88 | 7.45 | 30.5 | 2/19 | 0 | 0 | 40 | 76 |
| 124 | BB McCullum | Batter | 109 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 125 | BB Samantray | Batter | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 126 | BB Sran | Bowler | 24 | 24 | 483 | 757 | 18 | 42.06 | 9.4 | 26.8 | 3/28 | 1 | 0 | 80 | 168 |
| 127 | BCJ Cutting | All-rounder | 21 | 17 | 281 | 429 | 10 | 42.9 | 9.16 | 28.1 | 2/20 | 0 | 0 | 47 | 77 |
| 128 | BE Hendricks | All-rounder | 7 | 7 | 150 | 235 | 9 | 26.11 | 9.4 | 16.7 | 3/36 | 1 | 0 | 25 | 52 |
| 129 | Bipul Sharma | Bowler | 33 | 28 | 426 | 572 | 17 | 33.65 | 8.06 | 25.1 | 2/13 | 0 | 0 | 71 | 131 |
| 130 | BJ Haddin | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 131 | BJ Hodge | All-rounder | 66 | 20 | 234 | 303 | 17 | 17.82 | 7.77 | 13.8 | 4/13 | 2 | 0 | 39 | 75 |
| 132 | BJ Rohrer | Batter | 8 | 1 | 6 | 12 | 0 | 0 | 12 | 0 | - | 0 | 0 | 1 | 1 |
| 133 | BKG Mendis | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 134 | BMAJ Mendis | Batter | 3 | 2 | 30 | 36 | 1 | 36 | 7.2 | 30 | 1/16 | 0 | 0 | 5 | 11 |
| 135 | BR Dunk | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 136 | BR Sharath | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 137 | Brijesh Sharma | Bowler | 1 | 1 | 18 | 17 | 1 | 17 | 5.67 | 18 | 1/17 | 0 | 0 | 3 | 10 |
| 138 | BW Hilfenhaus | Bowler | 17 | 17 | 372 | 479 | 22 | 21.77 | 7.73 | 16.9 | 3/27 | 1 | 0 | 62 | 173 |
| 139 | C Bosch | All-rounder | 4 | 3 | 61 | 94 | 2 | 47 | 9.25 | 30.5 | 1/26 | 0 | 0 | 10 | 29 |
| 140 | C Connolly | All-rounder | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 141 | C de Grandhomme | All-rounder | 25 | 19 | 216 | 319 | 6 | 53.17 | 8.86 | 36 | 3/4 | 1 | 0 | 35 | 58 |
| 142 | C Ganapathy | Batter | 1 | 1 | 6 | 13 | 0 | 0 | 13 | 0 | - | 0 | 0 | 1 | 1 |
| 143 | C Green | All-rounder | 32 | 29 | 439 | 664 | 16 | 41.5 | 9.08 | 27.4 | 2/12 | 0 | 0 | 73 | 149 |
| 144 | C Madan | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 145 | C Munro | Batter | 13 | 2 | 12 | 15 | 0 | 0 | 7.5 | 0 | - | 0 | 0 | 2 | 5 |
| 146 | C Nanda | Batter | 3 | 3 | 48 | 57 | 2 | 28.5 | 7.13 | 24 | 1/4 | 0 | 0 | 8 | 13 |
| 147 | C Sakariya | Bowler | 20 | 20 | 444 | 638 | 20 | 31.9 | 8.62 | 22.2 | 3/31 | 2 | 0 | 74 | 146 |
| 148 | CA Ingram | Batter | 15 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 149 | CA Lynn | Batter | 42 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 150 | CA Pujara | Batter | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 151 | CH Gayle | Batter | 141 | 38 | 554 | 729 | 18 | 40.5 | 7.9 | 30.8 | 3/21 | 1 | 0 | 90 | 180 |
| 152 | CH Morris | All-rounder | 81 | 82 | 1726 | 2309 | 96 | 24.05 | 8.03 | 18 | 4/23 | 12 | 0 | 287 | 668 |
| 153 | CJ Anderson | All-rounder | 30 | 22 | 297 | 518 | 11 | 47.09 | 10.46 | 27 | 2/18 | 0 | 0 | 49 | 79 |
| 154 | CJ Dala | Batter | 1 | 1 | 18 | 34 | 0 | 0 | 11.33 | 0 | - | 0 | 0 | 3 | 7 |
| 155 | CJ Ferguson | Batter | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 156 | CJ Green | Batter | 1 | 1 | 17 | 24 | 0 | 0 | 8.47 | 0 | - | 0 | 0 | 2 | 6 |
| 157 | CJ Jordan | Bowler | 34 | 35 | 674 | 1081 | 30 | 36.03 | 9.62 | 22.5 | 4/11 | 3 | 0 | 111 | 206 |
| 158 | CJ McKay | Batter | 2 | 2 | 42 | 60 | 1 | 60 | 8.57 | 42 | 1/36 | 0 | 0 | 7 | 14 |
| 159 | CK Kapugedera | Batter | 5 | 3 | 17 | 49 | 0 | 0 | 17.29 | 0 | - | 0 | 0 | 2 | 0 |
| 160 | CK Langeveldt | Bowler | 7 | 7 | 156 | 187 | 13 | 14.38 | 7.19 | 12 | 3/15 | 1 | 0 | 26 | 69 |
| 161 | CL White | Batter | 47 | 6 | 42 | 86 | 1 | 86 | 12.29 | 42 | 1/14 | 0 | 0 | 7 | 8 |
| 162 | CM Gautam | WK-Batter | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 163 | CR Brathwaite | All-rounder | 16 | 16 | 254 | 379 | 13 | 29.15 | 8.95 | 19.5 | 3/47 | 1 | 0 | 41 | 74 |
| 164 | CR Woakes | All-rounder | 21 | 21 | 440 | 658 | 30 | 21.93 | 8.97 | 14.7 | 3/6 | 3 | 0 | 73 | 161 |
| 165 | CRD Fernando | Bowler | 10 | 10 | 234 | 298 | 17 | 17.53 | 7.64 | 13.8 | 4/18 | 1 | 0 | 39 | 99 |
| 166 | CV Varun | Bowler | 85 | 85 | 1924 | 2464 | 100 | 24.64 | 7.68 | 19.2 | 5/20 | 9 | 1 | 320 | 702 |
| 167 | D Brevis | Batter | 16 | 1 | 3 | 8 | 1 | 8 | 16 | 3 | 1/8 | 0 | 0 | 0 | 1 |
| 168 | D du Preez | Batter | 2 | 2 | 42 | 56 | 4 | 14 | 8 | 10.5 | 3/32 | 1 | 0 | 7 | 18 |
| 169 | D Ferreira | Batter | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 170 | D Jansen | Batter | 1 | 1 | 24 | 53 | 1 | 53 | 13.25 | 24 | 1/53 | 0 | 0 | 4 | 6 |
| 171 | D Kalyankrishna | Batter | 3 | 3 | 48 | 87 | 2 | 43.5 | 10.88 | 24 | 1/30 | 0 | 0 | 8 | 10 |
| 172 | D Kamra | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 173 | D Malewar | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 174 | D Padikkal | Batter | 76 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 175 | D Pretorius | All-rounder | 7 | 7 | 150 | 238 | 6 | 39.67 | 9.52 | 25 | 2/30 | 0 | 0 | 25 | 42 |
| 176 | D Salunkhe | Batter | 6 | 5 | 47 | 78 | 1 | 78 | 9.96 | 47 | 1/21 | 0 | 0 | 7 | 13 |
| 177 | D Singh | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 178 | D Wiese | Bowler | 18 | 15 | 296 | 440 | 16 | 27.5 | 8.92 | 18.5 | 4/33 | 1 | 0 | 49 | 82 |
| 179 | DA Miller | Batter | 144 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 180 | DA Payne | All-rounder | 2 | 2 | 30 | 70 | 2 | 35 | 14 | 15 | 2/35 | 0 | 0 | 5 | 5 |
| 181 | DA Warner | Batter | 184 | 1 | 1 | 2 | 0 | 0 | 12 | 0 | - | 0 | 0 | 1 | 0 |
| 182 | DAJ Bracewell | Batter | 1 | 1 | 24 | 32 | 3 | 10.67 | 8 | 8 | 3/32 | 1 | 0 | 4 | 10 |
| 183 | DB Das | Batter | 31 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 184 | DB Ravi Teja | Batter | 32 | 2 | 18 | 28 | 1 | 28 | 9.33 | 18 | 1/19 | 0 | 0 | 3 | 4 |
| 185 | DE Bollinger | Bowler | 27 | 27 | 576 | 693 | 37 | 18.73 | 7.22 | 15.6 | 4/13 | 4 | 0 | 95 | 254 |
| 186 | DG Nalkande | All-rounder | 6 | 6 | 84 | 148 | 6 | 24.67 | 10.57 | 14 | 2/21 | 0 | 0 | 13 | 22 |
| 187 | DH Yagnik | WK-Batter | 25 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 188 | Dhruv Jurel | WK-Batter | 44 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 189 | DJ Bravo | All-rounder | 160 | 158 | 3120 | 4360 | 183 | 23.83 | 8.38 | 17 | 4/22 | 16 | 0 | 512 | 998 |
| 190 | DJ Harris | Batter | 4 | 2 | 18 | 26 | 0 | 0 | 8.67 | 0 | - | 0 | 0 | 3 | 4 |
| 191 | DJ Hooda | All-rounder | 125 | 34 | 379 | 546 | 10 | 54.6 | 8.64 | 37.9 | 2/16 | 0 | 0 | 63 | 102 |
| 192 | DJ Hussey | All-rounder | 64 | 26 | 317 | 474 | 8 | 59.25 | 8.97 | 39.6 | 2/2 | 0 | 0 | 52 | 86 |
| 193 | DJ Jacobs | Batter | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 194 | DJ Malan | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 195 | DJ Mitchell | All-rounder | 15 | 4 | 48 | 97 | 1 | 97 | 12.13 | 48 | 1/18 | 0 | 0 | 8 | 5 |
| 196 | DJ Muthuswami | Bowler | 6 | 6 | 84 | 101 | 4 | 25.25 | 7.21 | 21 | 2/18 | 0 | 0 | 14 | 44 |
| 197 | DJ Thornely | Batter | 6 | 4 | 42 | 40 | 3 | 13.33 | 5.71 | 14 | 2/7 | 0 | 0 | 7 | 19 |
| 198 | DJ Willey | All-rounder | 11 | 11 | 216 | 272 | 6 | 45.33 | 7.56 | 36 | 2/16 | 0 | 0 | 36 | 79 |
| 199 | DJG Sammy | Bowler | 22 | 19 | 236 | 350 | 11 | 31.82 | 8.9 | 21.5 | 4/22 | 1 | 0 | 39 | 72 |
| 200 | DJM Short | Batter | 7 | 2 | 18 | 19 | 1 | 19 | 6.33 | 18 | 1/10 | 0 | 0 | 3 | 7 |
| 201 | DL Chahar | Bowler | 97 | 97 | 1939 | 2639 | 89 | 29.65 | 8.17 | 21.8 | 4/13 | 7 | 0 | 322 | 825 |
| 202 | DL Vettori | Bowler | 34 | 34 | 777 | 879 | 28 | 31.39 | 6.79 | 27.8 | 3/15 | 2 | 0 | 128 | 270 |
| 203 | DM Bravo | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 204 | DNT Zoysa | Batter | 3 | 3 | 66 | 99 | 2 | 49.5 | 9 | 33 | 1/30 | 0 | 0 | 11 | 24 |
| 205 | DP Conway | Batter | 29 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 206 | DP Nannes | Bowler | 29 | 29 | 646 | 785 | 28 | 28.04 | 7.29 | 23.1 | 3/27 | 2 | 0 | 105 | 285 |
| 207 | DP Vijaykumar | Bowler | 9 | 9 | 152 | 199 | 4 | 49.75 | 7.86 | 38 | 1/17 | 0 | 0 | 25 | 63 |
| 208 | DPMD Jayawardene | Batter | 80 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 209 | DR Martyn | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 210 | DR Sams | Bowler | 16 | 16 | 360 | 523 | 14 | 37.36 | 8.72 | 25.7 | 4/30 | 2 | 0 | 60 | 142 |
| 211 | DR Shorey | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 212 | DR Smith | All-rounder | 91 | 46 | 539 | 810 | 26 | 31.15 | 9.02 | 20.7 | 4/8 | 2 | 0 | 89 | 168 |
| 213 | DS Kulkarni | Bowler | 92 | 92 | 1787 | 2474 | 86 | 28.77 | 8.31 | 20.8 | 4/14 | 7 | 0 | 294 | 742 |
| 214 | DS Lehmann | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 215 | DS Rathi | Bowler | 14 | 14 | 336 | 475 | 15 | 31.67 | 8.48 | 22.4 | 2/30 | 0 | 0 | 56 | 100 |
| 216 | DT Christian | All-rounder | 49 | 49 | 883 | 1192 | 38 | 31.37 | 8.1 | 23.2 | 2/10 | 0 | 0 | 145 | 296 |
| 217 | DT Patil | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 218 | DW Steyn | Bowler | 95 | 96 | 2182 | 2523 | 97 | 26.01 | 6.94 | 22.5 | 3/8 | 8 | 0 | 361 | 1019 |
| 219 | E Lewis | Batter | 27 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 220 | E Malinga | Bowler | 10 | 10 | 208 | 317 | 16 | 19.81 | 9.14 | 13 | 3/31 | 1 | 0 | 34 | 70 |
| 221 | EJG Morgan | Batter | 83 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 222 | ER Dwivedi | Batter | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 223 | F Behardien | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 224 | F du Plessis | Batter | 154 | 1 | 6 | 16 | 0 | 0 | 16 | 0 | - | 0 | 0 | 1 | 0 |
| 225 | FA Allen | Batter | 5 | 4 | 90 | 136 | 2 | 68 | 9.07 | 45 | 1/22 | 0 | 0 | 15 | 26 |
| 226 | Fazalhaq Farooqi | All-rounder | 12 | 12 | 254 | 437 | 6 | 72.83 | 10.32 | 42.3 | 2/32 | 0 | 0 | 42 | 80 |
| 227 | FH Allen | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 228 | FH Edwards | Bowler | 6 | 6 | 140 | 154 | 5 | 30.8 | 6.6 | 28 | 2/27 | 0 | 0 | 22 | 70 |
| 229 | FY Fazal | Batter | 12 | 2 | 12 | 20 | 0 | 0 | 10 | 0 | - | 0 | 0 | 2 | 1 |
| 230 | G Coetzee | Bowler | 14 | 14 | 273 | 472 | 15 | 31.47 | 10.37 | 18.2 | 4/34 | 2 | 0 | 45 | 90 |
| 231 | G Gambhir | Batter | 154 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 232 | G Singh | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 233 | Gagandeep Singh | Batter | 4 | 4 | 84 | 141 | 3 | 47 | 10.07 | 28 | 1/33 | 0 | 0 | 14 | 25 |
| 234 | GB Hogg | Bowler | 21 | 21 | 458 | 570 | 23 | 24.78 | 7.47 | 19.9 | 4/29 | 2 | 0 | 76 | 159 |
| 235 | GC Smith | Batter | 29 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 236 | GC Viljoen | All-rounder | 6 | 6 | 138 | 222 | 7 | 31.71 | 9.65 | 19.7 | 2/39 | 0 | 0 | 23 | 43 |
| 237 | GD McGrath | Bowler | 14 | 14 | 324 | 357 | 12 | 29.75 | 6.61 | 27 | 4/29 | 1 | 0 | 54 | 153 |
| 238 | GD Phillips | Batter | 11 | 4 | 30 | 40 | 2 | 20 | 8 | 15 | 1/10 | 0 | 0 | 5 | 10 |
| 239 | GH Vihari | Batter | 24 | 6 | 42 | 47 | 1 | 47 | 6.71 | 42 | 1/5 | 0 | 0 | 7 | 17 |
| 240 | GHS Garton | Batter | 5 | 5 | 90 | 135 | 3 | 45 | 9 | 30 | 1/27 | 0 | 0 | 15 | 31 |
| 241 | GJ Bailey | Batter | 40 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 242 | GJ Maxwell | All-rounder | 141 | 85 | 1022 | 1413 | 41 | 34.46 | 8.3 | 24.9 | 2/15 | 0 | 0 | 170 | 328 |
| 243 | GR Napier | Batter | 1 | 1 | 24 | 27 | 1 | 27 | 6.75 | 24 | 1/27 | 0 | 0 | 4 | 8 |
| 244 | GS Sandhu | Batter | 3 | 2 | 48 | 82 | 1 | 82 | 10.25 | 48 | 1/33 | 0 | 0 | 8 | 9 |
| 245 | Gulbadin Naib | Batter | 2 | 1 | 6 | 12 | 0 | 0 | 12 | 0 | - | 0 | 0 | 1 | 1 |
| 246 | Gurkeerat Singh | Batter | 41 | 6 | 78 | 97 | 5 | 19.4 | 7.46 | 15.6 | 2/15 | 0 | 0 | 13 | 26 |
| 247 | Gurnoor Brar | Batter | 1 | 1 | 18 | 42 | 0 | 0 | 14 | 0 | - | 0 | 0 | 3 | 7 |
| 248 | H Das | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 249 | H Klaasen | WK-Batter | 52 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 250 | H Pannu | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 251 | H Sharma | Batter | 2 | 2 | 30 | 57 | 0 | 0 | 11.4 | 0 | - | 0 | 0 | 5 | 2 |
| 252 | Harbhajan Singh | Bowler | 163 | 160 | 3416 | 4030 | 150 | 26.87 | 7.08 | 22.8 | 5/18 | 11 | 1 | 569 | 1263 |
| 253 | Harmeet Singh | Bowler | 27 | 27 | 525 | 697 | 26 | 26.81 | 7.97 | 20.2 | 3/24 | 2 | 0 | 87 | 189 |
| 254 | Harmeet Singh | Batter | 1 | 1 | 24 | 34 | 1 | 34 | 8.5 | 24 | 1/34 | 0 | 0 | 4 | 12 |
| 255 | Harpreet Brar | All-rounder | 49 | 46 | 811 | 1085 | 35 | 31 | 8.03 | 23.2 | 4/30 | 4 | 0 | 135 | 269 |
| 256 | Harpreet Singh | Batter | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 257 | Harsh Dubey | All-rounder | 6 | 6 | 114 | 168 | 9 | 18.67 | 8.84 | 12.7 | 3/34 | 1 | 0 | 19 | 36 |
| 258 | Harshit Rana | Bowler | 33 | 32 | 649 | 1029 | 40 | 25.73 | 9.51 | 16.2 | 3/24 | 3 | 0 | 108 | 247 |
| 259 | HC Brook | Batter | 11 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 260 | HE van der Dussen | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 261 | HF Gurney | All-rounder | 8 | 8 | 162 | 238 | 7 | 34 | 8.81 | 23.1 | 2/25 | 0 | 0 | 27 | 50 |
| 262 | HH Gibbs | Batter | 36 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 263 | HH Pandya | All-rounder | 154 | 109 | 1658 | 2548 | 79 | 32.25 | 9.22 | 21 | 5/36 | 6 | 1 | 274 | 554 |
| 264 | Himmat Singh | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 265 | HM Amla | Batter | 16 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 266 | HR Shokeen | Batter | 13 | 13 | 204 | 314 | 5 | 62.8 | 9.24 | 40.8 | 2/34 | 0 | 0 | 34 | 78 |
| 267 | HV Patel | All-rounder | 120 | 118 | 2458 | 3634 | 151 | 24.07 | 8.87 | 16.3 | 5/27 | 17 | 1 | 404 | 800 |
| 268 | I Malhotra | Batter | 1 | 1 | 6 | 23 | 0 | 0 | 23 | 0 | - | 0 | 0 | 1 | 0 |
| 269 | I Sharma | Bowler | 117 | 117 | 2419 | 3377 | 96 | 35.18 | 8.38 | 25.2 | 5/12 | 4 | 1 | 401 | 999 |
| 270 | I Udana | All-rounder | 10 | 10 | 174 | 282 | 8 | 35.25 | 9.72 | 21.8 | 2/41 | 0 | 0 | 29 | 45 |
| 271 | IC Pandey | Bowler | 25 | 24 | 462 | 591 | 18 | 32.83 | 7.68 | 25.7 | 2/23 | 0 | 0 | 77 | 212 |
| 272 | IC Porel | Batter | 1 | 1 | 24 | 39 | 1 | 39 | 9.75 | 24 | 1/39 | 0 | 0 | 4 | 7 |
| 273 | IK Pathan | All-rounder | 103 | 101 | 2043 | 2649 | 80 | 33.11 | 7.78 | 25.5 | 3/24 | 4 | 0 | 334 | 835 |
| 274 | Imran Tahir | Bowler | 59 | 59 | 1316 | 1703 | 82 | 20.77 | 7.76 | 16 | 4/12 | 12 | 0 | 217 | 437 |
| 275 | Iqbal Abdulla | Bowler | 49 | 48 | 920 | 1109 | 40 | 27.73 | 7.23 | 23 | 3/24 | 4 | 0 | 152 | 331 |
| 276 | IR Jaggi | Batter | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 277 | IS Sodhi | All-rounder | 8 | 8 | 181 | 202 | 9 | 22.44 | 6.7 | 20.1 | 3/26 | 1 | 0 | 30 | 64 |
| 278 | Ishan Kishan | WK-Batter | 122 | 1 | 1 | 4 | 0 | 0 | 24 | 0 | - | 0 | 0 | 0 | 0 |
| 279 | J Arunkumar | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 280 | J Botha | Bowler | 34 | 34 | 694 | 800 | 25 | 32 | 6.92 | 27.8 | 3/6 | 1 | 0 | 115 | 254 |
| 281 | J Cox | WK-Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 282 | J Fraser-McGurk | Batter | 15 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 283 | J Little | Bowler | 11 | 11 | 228 | 339 | 11 | 30.82 | 8.92 | 20.7 | 4/45 | 1 | 0 | 38 | 82 |
| 284 | J Overton | All-rounder | 5 | 5 | 60 | 139 | 1 | 139 | 13.9 | 60 | 1/42 | 0 | 0 | 10 | 14 |
| 285 | J Suchith | Bowler | 22 | 21 | 420 | 602 | 19 | 31.68 | 8.6 | 22.1 | 2/12 | 0 | 0 | 70 | 140 |
| 286 | J Syed Mohammad | All-rounder | 11 | 11 | 192 | 283 | 8 | 35.38 | 8.84 | 24 | 2/15 | 0 | 0 | 32 | 47 |
| 287 | J Theron | Bowler | 10 | 11 | 221 | 302 | 11 | 27.45 | 8.2 | 20.1 | 2/9 | 0 | 0 | 36 | 68 |
| 288 | J Yadav | All-rounder | 20 | 20 | 390 | 445 | 8 | 55.63 | 6.85 | 48.8 | 1/8 | 0 | 0 | 65 | 153 |
| 289 | JA Duffy | Batter | 2 | 2 | 48 | 80 | 5 | 16 | 10 | 9.6 | 3/22 | 1 | 0 | 8 | 19 |
| 290 | JA Morkel | All-rounder | 90 | 87 | 1723 | 2359 | 85 | 27.75 | 8.21 | 20.3 | 4/32 | 5 | 0 | 286 | 646 |
| 291 | JA Richardson | Batter | 4 | 4 | 90 | 157 | 3 | 52.33 | 10.47 | 30 | 2/41 | 0 | 0 | 15 | 30 |
| 292 | Jalaj S Saxena | Batter | 1 | 1 | 18 | 27 | 0 | 0 | 9 | 0 | - | 0 | 0 | 3 | 5 |
| 293 | Jaskaran Singh | All-rounder | 8 | 7 | 102 | 171 | 6 | 28.5 | 10.06 | 17 | 2/18 | 0 | 0 | 17 | 39 |
| 294 | JC Archer | Bowler | 55 | 55 | 1278 | 1676 | 62 | 27.03 | 7.87 | 20.6 | 3/15 | 7 | 0 | 211 | 551 |
| 295 | JC Buttler | WK-Batter | 124 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 296 | JD Ryder | All-rounder | 29 | 16 | 236 | 303 | 8 | 37.88 | 7.7 | 29.5 | 2/14 | 0 | 0 | 39 | 79 |
| 297 | JD Unadkat | Bowler | 115 | 114 | 2333 | 3464 | 114 | 30.39 | 8.91 | 20.5 | 5/25 | 11 | 2 | 384 | 753 |
| 298 | JDP Oram | All-rounder | 18 | 14 | 237 | 349 | 9 | 38.78 | 8.84 | 26.3 | 3/32 | 1 | 0 | 38 | 79 |
| 299 | JDS Neesham | All-rounder | 14 | 13 | 216 | 334 | 8 | 41.75 | 9.28 | 27 | 3/12 | 1 | 0 | 36 | 63 |
| 300 | JE Root | Batter | 3 | 1 | 12 | 14 | 0 | 0 | 7 | 0 | - | 0 | 0 | 2 | 1 |
| 301 | JE Taylor | All-rounder | 5 | 5 | 117 | 157 | 6 | 26.17 | 8.05 | 19.5 | 3/30 | 1 | 0 | 19 | 48 |
| 302 | JEC Franklin | All-rounder | 20 | 15 | 151 | 220 | 9 | 24.44 | 8.74 | 16.8 | 2/18 | 0 | 0 | 25 | 39 |
| 303 | JG Bethell | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 304 | JH Kallis | All-rounder | 98 | 89 | 1742 | 2293 | 65 | 35.28 | 7.9 | 26.8 | 3/13 | 2 | 0 | 290 | 601 |
| 305 | JJ Bumrah | Bowler | 148 | 152 | 3425 | 4147 | 186 | 22.3 | 7.26 | 18.4 | 5/10 | 25 | 2 | 567 | 1375 |
| 306 | JJ Roy | Batter | 21 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 307 | JJ van der Wath | Batter | 3 | 3 | 72 | 129 | 3 | 43 | 10.75 | 24 | 2/49 | 0 | 0 | 12 | 29 |
| 308 | JL Denly | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 309 | JL Pattinson | Bowler | 10 | 10 | 213 | 320 | 11 | 29.09 | 9.01 | 19.4 | 2/19 | 0 | 0 | 35 | 77 |
| 310 | JM Bairstow | WK-Batter | 52 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 311 | JM Kemp | Batter | 5 | 5 | 44 | 54 | 3 | 18 | 7.36 | 14.7 | 3/12 | 1 | 0 | 8 | 15 |
| 312 | JM Sharma | WK-Batter | 57 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 313 | JO Holder | All-rounder | 46 | 46 | 995 | 1461 | 53 | 27.57 | 8.81 | 18.8 | 4/52 | 8 | 0 | 164 | 321 |
| 314 | Joginder Sharma | Bowler | 16 | 15 | 256 | 419 | 12 | 34.92 | 9.82 | 21.3 | 2/27 | 0 | 0 | 42 | 71 |
| 315 | JP Behrendorff | Bowler | 17 | 17 | 366 | 552 | 19 | 29.05 | 9.05 | 19.3 | 3/23 | 2 | 0 | 61 | 139 |
| 316 | JP Duminy | All-rounder | 83 | 48 | 678 | 834 | 23 | 36.26 | 7.38 | 29.5 | 4/17 | 1 | 0 | 112 | 234 |
| 317 | JP Faulkner | All-rounder | 60 | 62 | 1238 | 1799 | 61 | 29.49 | 8.72 | 20.3 | 5/16 | 6 | 2 | 201 | 399 |
| 318 | JP Inglis | Batter | 12 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 319 | JPR Scantlebury-Searles | Batter | 4 | 3 | 42 | 89 | 2 | 44.5 | 12.71 | 21 | 1/24 | 0 | 0 | 7 | 7 |
| 320 | JR Hazlewood | Bowler | 39 | 39 | 867 | 1196 | 57 | 20.98 | 8.28 | 15.2 | 4/25 | 8 | 0 | 143 | 376 |
| 321 | JR Hopes | Bowler | 21 | 20 | 360 | 548 | 14 | 39.14 | 9.13 | 25.7 | 2/2 | 0 | 0 | 60 | 105 |
| 322 | JR Philippe | Batter | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 323 | JW Hastings | Batter | 3 | 3 | 58 | 66 | 3 | 22 | 6.83 | 19.3 | 2/6 | 0 | 0 | 9 | 31 |
| 324 | K Chouhan | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 325 | K Fuletra | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 326 | K Goel | Batter | 22 | 6 | 66 | 93 | 0 | 0 | 8.45 | 0 | - | 0 | 0 | 11 | 19 |
| 327 | K Gowtham | Bowler | 36 | 35 | 588 | 808 | 21 | 38.48 | 8.24 | 28 | 2/12 | 0 | 0 | 98 | 206 |
| 328 | K Kartikeya | Bowler | 16 | 16 | 282 | 407 | 12 | 33.92 | 8.66 | 23.5 | 2/22 | 0 | 0 | 47 | 85 |
| 329 | K Khejroliya | Bowler | 8 | 8 | 139 | 246 | 6 | 41 | 10.62 | 23.2 | 2/33 | 0 | 0 | 22 | 36 |
| 330 | K Mendis | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 331 | K Rabada | Bowler | 87 | 89 | 1977 | 2849 | 125 | 22.79 | 8.65 | 15.8 | 4/21 | 11 | 0 | 326 | 766 |
| 332 | K Santokie | Batter | 2 | 2 | 48 | 90 | 3 | 30 | 11.25 | 16 | 2/50 | 0 | 0 | 8 | 15 |
| 333 | K Upadhyay | Batter | 3 | 3 | 54 | 81 | 0 | 0 | 9 | 0 | - | 0 | 0 | 9 | 20 |
| 334 | K Yadav | Bowler | 3 | 3 | 54 | 84 | 2 | 42 | 9.33 | 27 | 1/18 | 0 | 0 | 9 | 13 |
| 335 | KA Jamieson | Bowler | 13 | 13 | 258 | 416 | 14 | 29.71 | 9.67 | 18.4 | 3/41 | 2 | 0 | 43 | 103 |
| 336 | KA Maharaj | Batter | 2 | 2 | 36 | 39 | 2 | 19.5 | 6.5 | 18 | 2/23 | 0 | 0 | 6 | 11 |
| 337 | KA Pollard | All-rounder | 189 | 107 | 1488 | 2180 | 69 | 31.59 | 8.79 | 21.6 | 4/44 | 3 | 0 | 245 | 405 |
| 338 | KAJ Roach | Batter | 2 | 2 | 48 | 80 | 0 | 0 | 10 | 0 | - | 0 | 0 | 8 | 20 |
| 339 | Kamran Akmal | WK-Batter | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 340 | Kamran Khan | All-rounder | 9 | 10 | 166 | 239 | 10 | 23.9 | 8.64 | 16.6 | 3/18 | 1 | 0 | 27 | 63 |
| 341 | Karanveer Singh | Bowler | 9 | 9 | 204 | 321 | 12 | 26.75 | 9.44 | 17 | 4/54 | 2 | 0 | 34 | 64 |
| 342 | Karim Janat | Batter | 1 | 1 | 6 | 30 | 0 | 0 | 30 | 0 | - | 0 | 0 | 1 | 0 |
| 343 | Kartik Sharma | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 344 | Kartik Tyagi | Bowler | 23 | 22 | 470 | 804 | 17 | 47.29 | 10.26 | 27.6 | 2/29 | 0 | 0 | 77 | 162 |
| 345 | KB Arun Karthik | Batter | 17 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 346 | KC Cariappa | All-rounder | 11 | 11 | 216 | 348 | 8 | 43.5 | 9.67 | 27 | 2/16 | 0 | 0 | 36 | 61 |
| 347 | KC Sangakkara | WK-Batter | 71 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 348 | KD Karthik | WK-Batter | 257 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 349 | KH Devdhar | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 350 | KH Pandya | All-rounder | 144 | 134 | 2428 | 3047 | 95 | 32.07 | 7.53 | 25.6 | 4/45 | 9 | 0 | 404 | 767 |
| 351 | KJ Abbott | Batter | 5 | 5 | 96 | 177 | 2 | 88.5 | 11.06 | 48 | 1/38 | 0 | 0 | 16 | 28 |
| 352 | KK Ahmed | Bowler | 74 | 74 | 1616 | 2410 | 90 | 26.78 | 8.95 | 18 | 3/21 | 10 | 0 | 267 | 669 |
| 353 | KK Cooper | Bowler | 25 | 25 | 576 | 757 | 33 | 22.94 | 7.89 | 17.5 | 4/26 | 5 | 0 | 96 | 184 |
| 354 | KK Nair | Batter | 84 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 355 | KL Nagarkoti | Batter | 12 | 11 | 180 | 285 | 5 | 57 | 9.5 | 36 | 2/13 | 0 | 0 | 30 | 50 |
| 356 | KL Rahul | WK-Batter | 149 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 357 | KM Asif | All-rounder | 7 | 7 | 133 | 231 | 7 | 33 | 10.42 | 19 | 2/42 | 0 | 0 | 22 | 46 |
| 358 | KM Jadhav | WK-Batter | 95 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 359 | KMA Paul | All-rounder | 8 | 8 | 163 | 237 | 9 | 26.33 | 8.72 | 18.1 | 3/17 | 2 | 0 | 27 | 52 |
| 360 | KMDN Kulasekara | Batter | 5 | 5 | 102 | 120 | 5 | 24 | 7.06 | 20.4 | 2/10 | 0 | 0 | 17 | 45 |
| 361 | KP Appanna | All-rounder | 13 | 13 | 216 | 286 | 9 | 31.78 | 7.94 | 24 | 4/19 | 1 | 0 | 36 | 68 |
| 362 | KP Pietersen | All-rounder | 36 | 13 | 174 | 215 | 7 | 30.71 | 7.41 | 24.9 | 2/31 | 0 | 0 | 29 | 54 |
| 363 | KR Mayers | Batter | 13 | 6 | 42 | 59 | 0 | 0 | 8.43 | 0 | - | 0 | 0 | 7 | 14 |
| 364 | KR Sen | Bowler | 12 | 12 | 241 | 387 | 14 | 27.64 | 9.63 | 17.2 | 4/20 | 2 | 0 | 39 | 83 |
| 365 | KS Bharat | WK-Batter | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 366 | KS Rathore | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 367 | KS Sharma | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 368 | KS Williamson | Batter | 79 | 2 | 18 | 31 | 0 | 0 | 10.33 | 0 | - | 0 | 0 | 3 | 2 |
| 369 | KT Maphaka | Batter | 4 | 4 | 66 | 143 | 2 | 71.5 | 13 | 33 | 1/23 | 0 | 0 | 11 | 22 |
| 370 | Kuldeep Yadav | Bowler | 102 | 99 | 2130 | 2882 | 105 | 27.45 | 8.12 | 20.3 | 4/14 | 9 | 0 | 355 | 642 |
| 371 | Kumar Kushagra | WK-Batter | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 372 | KV Sharma | Bowler | 90 | 87 | 1585 | 2215 | 83 | 26.69 | 8.38 | 19.1 | 4/16 | 6 | 0 | 259 | 507 |
| 373 | KW Richardson | Bowler | 15 | 15 | 335 | 472 | 19 | 24.84 | 8.45 | 17.6 | 3/13 | 1 | 0 | 55 | 129 |
| 374 | L Ablish | Batter | 3 | 3 | 42 | 75 | 3 | 25 | 10.71 | 14 | 2/17 | 0 | 0 | 7 | 10 |
| 375 | L Balaji | Bowler | 73 | 73 | 1512 | 2028 | 76 | 26.68 | 8.05 | 19.9 | 5/24 | 7 | 1 | 248 | 537 |
| 376 | L Ngidi | Bowler | 19 | 19 | 442 | 614 | 34 | 18.06 | 8.33 | 13 | 4/10 | 6 | 0 | 73 | 172 |
| 377 | L Pretorius | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 378 | L Ronchi | Batter | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 379 | L Wood | Bowler | 2 | 2 | 36 | 93 | 1 | 93 | 15.5 | 36 | 1/68 | 0 | 0 | 6 | 8 |
| 380 | LA Carseldine | Batter | 5 | 1 | 6 | 6 | 1 | 6 | 6 | 6 | 1/6 | 0 | 0 | 1 | 4 |
| 381 | LA Pomersbach | Batter | 17 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 382 | Lalit Yadav | All-rounder | 27 | 19 | 288 | 425 | 10 | 42.5 | 8.85 | 28.8 | 2/11 | 0 | 0 | 48 | 82 |
| 383 | LB Williams | Batter | 2 | 2 | 36 | 72 | 1 | 72 | 12 | 36 | 1/38 | 0 | 0 | 6 | 12 |
| 384 | LE Plunkett | Bowler | 7 | 7 | 150 | 225 | 4 | 56.25 | 9 | 37.5 | 3/17 | 1 | 0 | 25 | 39 |
| 385 | LH Ferguson | Bowler | 49 | 50 | 1026 | 1532 | 53 | 28.91 | 8.96 | 19.4 | 4/28 | 4 | 0 | 168 | 376 |
| 386 | LI Meriwala | Batter | 1 | 1 | 18 | 32 | 1 | 32 | 10.67 | 18 | 1/32 | 0 | 0 | 3 | 6 |
| 387 | Liton Das | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 388 | LJ Wright | Batter | 7 | 6 | 71 | 124 | 2 | 62 | 10.48 | 35.5 | 1/12 | 0 | 0 | 11 | 14 |
| 389 | LMP Simmons | Batter | 29 | 1 | 18 | 34 | 1 | 34 | 11.33 | 18 | 1/34 | 0 | 0 | 3 | 2 |
| 390 | LPC Silva | Batter | 3 | 1 | 6 | 21 | 0 | 0 | 21 | 0 | - | 0 | 0 | 1 | 0 |
| 391 | LR Shukla | Bowler | 47 | 27 | 314 | 447 | 15 | 29.8 | 8.54 | 20.9 | 3/6 | 2 | 0 | 51 | 109 |
| 392 | LRPL Taylor | Batter | 55 | 2 | 12 | 24 | 0 | 0 | 12 | 0 | - | 0 | 0 | 2 | 0 |
| 393 | LS Livingstone | All-rounder | 50 | 27 | 312 | 469 | 13 | 36.08 | 9.02 | 24 | 3/27 | 1 | 0 | 52 | 81 |
| 394 | M Ashwin | Bowler | 44 | 44 | 870 | 1162 | 35 | 33.2 | 8.01 | 24.9 | 3/21 | 2 | 0 | 144 | 283 |
| 395 | M de Lange | Batter | 5 | 5 | 108 | 169 | 5 | 33.8 | 9.39 | 21.6 | 3/34 | 1 | 0 | 18 | 39 |
| 396 | M Izhar | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 397 | M Jansen | All-rounder | 39 | 37 | 781 | 1212 | 38 | 31.89 | 9.31 | 20.6 | 3/17 | 2 | 0 | 130 | 300 |
| 398 | M Kaif | Batter | 29 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 399 | M Kartik | Bowler | 56 | 55 | 1149 | 1388 | 31 | 44.77 | 7.25 | 37.1 | 3/17 | 1 | 0 | 190 | 382 |
| 400 | M Klinger | Batter | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 401 | M Manhas | Batter | 55 | 3 | 42 | 42 | 0 | 0 | 6 | 0 | - | 0 | 0 | 7 | 15 |
| 402 | M Markande | Bowler | 39 | 39 | 738 | 1105 | 37 | 29.86 | 8.98 | 19.9 | 4/15 | 3 | 0 | 123 | 214 |
| 403 | M Morkel | Bowler | 70 | 70 | 1629 | 2089 | 77 | 27.13 | 7.69 | 21.2 | 4/20 | 6 | 0 | 271 | 708 |
| 404 | M Muralitharan | Bowler | 66 | 67 | 1528 | 1706 | 64 | 26.66 | 6.7 | 23.9 | 3/11 | 5 | 0 | 253 | 600 |
| 405 | M Ntini | Bowler | 9 | 9 | 210 | 242 | 7 | 34.57 | 6.91 | 30 | 4/21 | 1 | 0 | 35 | 99 |
| 406 | M Pathirana | Bowler | 32 | 32 | 702 | 1016 | 47 | 21.62 | 8.68 | 14.9 | 4/28 | 5 | 0 | 115 | 236 |
| 407 | M Prasidh Krishna | Bowler | 69 | 70 | 1577 | 2325 | 81 | 28.7 | 8.85 | 19.5 | 4/30 | 8 | 0 | 261 | 637 |
| 408 | M Rawat | Batter | 18 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 409 | M Rawat | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 410 | M Shahrukh Khan | All-rounder | 58 | 3 | 18 | 28 | 1 | 28 | 9.33 | 18 | 1/13 | 0 | 0 | 3 | 4 |
| 411 | M Siddharth | Bowler | 6 | 6 | 120 | 167 | 4 | 41.75 | 8.35 | 30 | 2/39 | 0 | 0 | 20 | 43 |
| 412 | M Theekshana | Bowler | 38 | 38 | 876 | 1207 | 36 | 33.53 | 8.27 | 24.3 | 4/33 | 2 | 0 | 146 | 260 |
| 413 | M Tiwari | Batter | 2 | 1 | 6 | 14 | 0 | 0 | 14 | 0 | - | 0 | 0 | 1 | 0 |
| 414 | M Vijay | Batter | 106 | 4 | 36 | 49 | 0 | 0 | 8.17 | 0 | - | 0 | 0 | 6 | 8 |
| 415 | M Vohra | Batter | 56 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 416 | M Yadav | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 417 | MA Agarwal | Batter | 130 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 418 | MA Khote | Batter | 4 | 2 | 30 | 51 | 2 | 25.5 | 10.2 | 15 | 2/29 | 0 | 0 | 5 | 5 |
| 419 | MA Starc | Bowler | 52 | 51 | 1064 | 1537 | 65 | 23.65 | 8.67 | 16.4 | 5/35 | 10 | 1 | 174 | 418 |
| 420 | MA Wood | Bowler | 5 | 5 | 120 | 179 | 11 | 16.27 | 8.95 | 10.9 | 5/14 | 2 | 1 | 20 | 47 |
| 421 | Mandeep Singh | Batter | 111 | 2 | 12 | 26 | 0 | 0 | 13 | 0 | - | 0 | 0 | 2 | 1 |
| 422 | Mashrafe Mortaza | Batter | 1 | 1 | 24 | 58 | 0 | 0 | 14.5 | 0 | - | 0 | 0 | 4 | 6 |
| 423 | Mayank Dagar | Bowler | 8 | 8 | 137 | 203 | 2 | 101.5 | 8.89 | 68.5 | 1/23 | 0 | 0 | 22 | 43 |
| 424 | MB Parmar | Batter | 1 | 1 | 18 | 33 | 0 | 0 | 11 | 0 | - | 0 | 0 | 3 | 4 |
| 425 | MC Henriques | All-rounder | 62 | 60 | 950 | 1289 | 42 | 30.69 | 8.14 | 22.6 | 3/12 | 2 | 0 | 158 | 306 |
| 426 | MC Juneja | Batter | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 427 | MD Choudhary | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 428 | MD Mishra | Batter | 18 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 429 | MD Shanaka | All-rounder | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 430 | MDKJ Perera | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 431 | MEK Hussey | Batter | 59 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 432 | MF Maharoof | Bowler | 20 | 20 | 420 | 520 | 27 | 19.26 | 7.43 | 15.6 | 3/34 | 1 | 0 | 70 | 165 |
| 433 | MG Bracewell | All-rounder | 5 | 5 | 66 | 95 | 6 | 15.83 | 8.64 | 11 | 2/13 | 0 | 0 | 11 | 26 |
| 434 | MG Johnson | Bowler | 54 | 55 | 1235 | 1708 | 62 | 27.55 | 8.3 | 19.9 | 3/26 | 3 | 0 | 204 | 535 |
| 435 | MG Neser | Batter | 1 | 1 | 24 | 62 | 0 | 0 | 15.5 | 0 | - | 0 | 0 | 4 | 5 |
| 436 | Misbah-ul-Haq | Batter | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 437 | MJ Clarke | Batter | 6 | 5 | 66 | 67 | 2 | 33.5 | 6.09 | 33 | 1/12 | 0 | 0 | 11 | 22 |
| 438 | MJ Guptill | Batter | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 439 | MJ Henry | Bowler | 9 | 9 | 162 | 311 | 4 | 77.75 | 11.52 | 40.5 | 2/54 | 0 | 0 | 27 | 40 |
| 440 | MJ Lumb | Batter | 12 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 441 | MJ McClenaghan | Bowler | 56 | 56 | 1274 | 1803 | 71 | 25.39 | 8.49 | 17.9 | 4/21 | 8 | 0 | 211 | 507 |
| 442 | MJ Owen | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 443 | MJ Santner | All-rounder | 32 | 32 | 621 | 757 | 26 | 29.12 | 7.31 | 23.9 | 3/11 | 1 | 0 | 103 | 217 |
| 444 | MJ Suthar | Batter | 1 | 1 | 12 | 26 | 0 | 0 | 13 | 0 | - | 0 | 0 | 2 | 4 |
| 445 | MK Lomror | Batter | 40 | 11 | 90 | 127 | 1 | 127 | 8.47 | 90 | 1/22 | 0 | 0 | 15 | 22 |
| 446 | MK Pandey | Batter | 174 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 447 | MK Tiwary | Batter | 98 | 6 | 42 | 83 | 1 | 83 | 11.86 | 42 | 1/11 | 0 | 0 | 7 | 9 |
| 448 | ML Hayden | Batter | 32 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 449 | MM Ali | All-rounder | 73 | 57 | 854 | 1029 | 41 | 25.1 | 7.23 | 20.8 | 4/26 | 3 | 0 | 141 | 295 |
| 450 | MM Patel | Bowler | 63 | 63 | 1355 | 1698 | 74 | 22.95 | 7.52 | 18.3 | 5/21 | 7 | 1 | 224 | 590 |
| 451 | MM Sharma | Bowler | 120 | 119 | 2403 | 3513 | 134 | 26.22 | 8.77 | 17.9 | 5/10 | 16 | 1 | 395 | 813 |
| 452 | MN Samuels | All-rounder | 15 | 11 | 214 | 284 | 9 | 31.56 | 7.96 | 23.8 | 3/39 | 1 | 0 | 35 | 79 |
| 453 | MN van Wyk | Batter | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 454 | Mohammad Ashraful | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 455 | Mohammad Asif | All-rounder | 8 | 8 | 192 | 296 | 8 | 37 | 9.25 | 24 | 2/19 | 0 | 0 | 32 | 64 |
| 456 | Mohammad Hafeez | Batter | 8 | 4 | 60 | 68 | 2 | 34 | 6.8 | 30 | 1/8 | 0 | 0 | 10 | 22 |
| 457 | Mohammad Nabi | All-rounder | 24 | 23 | 417 | 517 | 15 | 34.47 | 7.44 | 27.8 | 4/11 | 1 | 0 | 68 | 146 |
| 458 | Mohammed Shami | Bowler | 121 | 123 | 2662 | 3794 | 136 | 27.9 | 8.55 | 19.6 | 4/11 | 13 | 0 | 442 | 1069 |
| 459 | Mohammed Siraj | Bowler | 111 | 111 | 2360 | 3464 | 111 | 31.21 | 8.81 | 21.3 | 4/17 | 9 | 0 | 392 | 971 |
| 460 | Mohit Rathee | Batter | 1 | 1 | 12 | 29 | 0 | 0 | 14.5 | 0 | - | 0 | 0 | 2 | 3 |
| 461 | Mohsin Khan | Bowler | 25 | 24 | 510 | 708 | 28 | 25.29 | 8.33 | 18.2 | 4/16 | 3 | 0 | 85 | 221 |
| 462 | Monu Kumar | Batter | 1 | 1 | 12 | 20 | 0 | 0 | 10 | 0 | - | 0 | 0 | 2 | 4 |
| 463 | MP Breetzke | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 464 | MP Stoinis | All-rounder | 113 | 72 | 894 | 1466 | 44 | 33.32 | 9.84 | 20.3 | 4/15 | 4 | 0 | 147 | 240 |
| 465 | MP Yadav | Bowler | 6 | 6 | 121 | 185 | 9 | 20.56 | 9.17 | 13.4 | 3/14 | 2 | 0 | 20 | 57 |
| 466 | MR Marsh | All-rounder | 57 | 34 | 560 | 795 | 37 | 21.49 | 8.52 | 15.1 | 4/25 | 3 | 0 | 92 | 181 |
| 467 | MS Bhandage | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 468 | MS Bisla | WK-Batter | 39 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 469 | MS Dhoni | WK-Batter | 277 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 470 | MS Gony | Bowler | 44 | 44 | 888 | 1287 | 37 | 34.78 | 8.7 | 24 | 3/31 | 2 | 0 | 148 | 348 |
| 471 | MS Wade | WK-Batter | 15 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 472 | Mujeeb Ur Rahman | Bowler | 20 | 20 | 446 | 620 | 20 | 31 | 8.34 | 22.3 | 3/27 | 1 | 0 | 74 | 151 |
| 473 | Mukesh Choudhary | Bowler | 16 | 16 | 315 | 522 | 17 | 30.71 | 9.94 | 18.5 | 4/46 | 3 | 0 | 52 | 131 |
| 474 | Mukesh Kumar | Bowler | 35 | 35 | 696 | 1200 | 40 | 30 | 10.34 | 17.4 | 4/33 | 4 | 0 | 115 | 237 |
| 475 | Musheer Khan | All-rounder | 1 | 1 | 12 | 27 | 1 | 27 | 13.5 | 12 | 1/27 | 0 | 0 | 2 | 1 |
| 476 | Mustafizur Rahman | Bowler | 60 | 60 | 1364 | 1849 | 65 | 28.45 | 8.13 | 21 | 4/29 | 7 | 0 | 222 | 487 |
| 477 | MV Boucher | WK-Batter | 31 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 478 | MW Short | All-rounder | 7 | 4 | 25 | 26 | 0 | 0 | 6.24 | 0 | - | 0 | 0 | 4 | 11 |
| 479 | N Burger | Bowler | 8 | 8 | 156 | 221 | 12 | 18.42 | 8.5 | 13 | 2/21 | 0 | 0 | 26 | 68 |
| 480 | N Jagadeesan | Batter | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 481 | N Pooran | WK-Batter | 92 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 482 | N Rana | All-rounder | 121 | 26 | 192 | 270 | 10 | 27 | 8.44 | 19.2 | 2/11 | 0 | 0 | 32 | 58 |
| 483 | N Saini | Bowler | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 484 | N Sindhu | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 485 | N Thushara | Bowler | 8 | 8 | 180 | 283 | 9 | 31.44 | 9.43 | 20 | 3/28 | 2 | 0 | 30 | 58 |
| 486 | N Tiwari | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 487 | N Wadhera | Batter | 40 | 2 | 17 | 22 | 0 | 0 | 7.76 | 0 | - | 0 | 0 | 2 | 3 |
| 488 | Naman Dhir | All-rounder | 26 | 5 | 52 | 76 | 0 | 0 | 8.77 | 0 | - | 0 | 0 | 9 | 11 |
| 489 | Navdeep Saini | Bowler | 33 | 33 | 664 | 980 | 24 | 40.83 | 8.86 | 27.7 | 3/40 | 1 | 0 | 110 | 274 |
| 490 | Naveen-ul-Haq | Bowler | 18 | 17 | 387 | 591 | 25 | 23.64 | 9.16 | 15.5 | 4/38 | 4 | 0 | 64 | 133 |
| 491 | NB Singh | Batter | 2 | 2 | 24 | 15 | 1 | 15 | 3.75 | 24 | 1/7 | 0 | 0 | 4 | 13 |
| 492 | ND Doshi | Batter | 4 | 4 | 56 | 79 | 2 | 39.5 | 8.46 | 28 | 1/15 | 0 | 0 | 9 | 24 |
| 493 | Nithish Kumar Reddy | All-rounder | 31 | 15 | 169 | 304 | 7 | 43.43 | 10.79 | 24.1 | 2/17 | 0 | 0 | 28 | 47 |
| 494 | NJ Maddinson | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 495 | NJ Rimmington | Batter | 1 | 1 | 18 | 19 | 0 | 0 | 6.33 | 0 | - | 0 | 0 | 3 | 9 |
| 496 | NK Patel | Batter | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 497 | NL McCullum | Batter | 2 | 2 | 30 | 34 | 0 | 0 | 6.8 | 0 | - | 0 | 0 | 5 | 10 |
| 498 | NLTC Perera | All-rounder | 37 | 36 | 698 | 1016 | 31 | 32.77 | 8.73 | 22.5 | 3/20 | 3 | 0 | 114 | 227 |
| 499 | NM Coulter-Nile | Bowler | 39 | 38 | 857 | 1100 | 48 | 22.92 | 7.7 | 17.9 | 4/14 | 7 | 0 | 142 | 368 |
| 500 | Noor Ahmad | Bowler | 40 | 40 | 852 | 1178 | 48 | 24.54 | 8.3 | 17.8 | 4/18 | 5 | 0 | 140 | 286 |
| 501 | NS Naik | Batter | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 502 | NT Ellis | Bowler | 17 | 17 | 378 | 546 | 19 | 28.74 | 8.67 | 19.9 | 4/30 | 2 | 0 | 63 | 117 |
| 503 | NV Ojha | WK-Batter | 113 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 504 | O Tarmale | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 505 | O Thomas | Batter | 4 | 4 | 60 | 79 | 5 | 15.8 | 7.9 | 12 | 2/6 | 0 | 0 | 10 | 17 |
| 506 | OA Shah | Batter | 23 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 507 | OC McCoy | Bowler | 8 | 8 | 161 | 250 | 11 | 22.73 | 9.32 | 14.6 | 3/23 | 1 | 0 | 26 | 49 |
| 508 | OF Smith | All-rounder | 6 | 6 | 90 | 178 | 6 | 29.67 | 11.87 | 15 | 4/30 | 1 | 0 | 15 | 35 |
| 509 | P Amarnath | Bowler | 6 | 6 | 132 | 236 | 7 | 33.71 | 10.73 | 18.9 | 2/29 | 0 | 0 | 22 | 29 |
| 510 | P Avinash | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 511 | P Awana | Bowler | 33 | 33 | 747 | 1029 | 39 | 26.38 | 8.27 | 19.2 | 4/34 | 4 | 0 | 124 | 293 |
| 512 | P Chopra | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 513 | P Dharmani | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 514 | P Dogra | Batter | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 515 | P Dubey | Batter | 5 | 5 | 78 | 111 | 2 | 55.5 | 8.54 | 39 | 1/19 | 0 | 0 | 13 | 23 |
| 516 | P Hinge | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 517 | P Kumar | Bowler | 119 | 119 | 2524 | 3251 | 90 | 36.12 | 7.73 | 28 | 3/18 | 3 | 0 | 417 | 1075 |
| 518 | P Negi | All-rounder | 50 | 42 | 716 | 939 | 34 | 27.62 | 7.87 | 21.1 | 4/18 | 2 | 0 | 119 | 237 |
| 519 | P Nissanka | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 520 | P Parameswaran | All-rounder | 8 | 8 | 154 | 224 | 9 | 24.89 | 8.73 | 17.1 | 3/30 | 1 | 0 | 25 | 64 |
| 521 | P Prasanth | Batter | 1 | 1 | 6 | 18 | 0 | 0 | 18 | 0 | - | 0 | 0 | 1 | 3 |
| 522 | P Ray Barman | Batter | 1 | 1 | 24 | 56 | 0 | 0 | 14 | 0 | - | 0 | 0 | 4 | 2 |
| 523 | P Sahu | Batter | 5 | 5 | 105 | 146 | 3 | 48.67 | 8.34 | 35 | 2/18 | 0 | 0 | 17 | 24 |
| 524 | P Simran Singh | Batter | 55 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 525 | P Suyal | Batter | 5 | 5 | 96 | 151 | 2 | 75.5 | 9.44 | 48 | 1/21 | 0 | 0 | 16 | 36 |
| 526 | PA Patel | WK-Batter | 139 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 527 | PA Reddy | Batter | 12 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 528 | Pankaj Singh | Bowler | 17 | 17 | 300 | 468 | 11 | 42.55 | 9.36 | 27.3 | 2/18 | 0 | 0 | 50 | 111 |
| 529 | Parvez Rasool | Batter | 11 | 11 | 198 | 271 | 4 | 67.75 | 8.21 | 49.5 | 1/20 | 0 | 0 | 33 | 60 |
| 530 | PBB Rajapaksa | Batter | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 531 | PC Valthaty | All-rounder | 23 | 10 | 151 | 205 | 7 | 29.29 | 8.15 | 21.6 | 4/29 | 1 | 0 | 25 | 44 |
| 532 | PD Collingwood | Batter | 8 | 6 | 89 | 101 | 5 | 20.2 | 6.81 | 17.8 | 2/19 | 0 | 0 | 15 | 24 |
| 533 | PD Salt | WK-Batter | 36 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 534 | PH Solanki | Batter | 2 | 2 | 36 | 38 | 2 | 19 | 6.33 | 18 | 2/20 | 0 | 0 | 6 | 11 |
| 535 | PHKD Mendis | All-rounder | 5 | 4 | 42 | 60 | 2 | 30 | 8.57 | 21 | 1/4 | 0 | 0 | 7 | 11 |
| 536 | PJ Cummins | Bowler | 72 | 72 | 1617 | 2373 | 79 | 30.04 | 8.81 | 20.5 | 4/34 | 8 | 0 | 267 | 578 |
| 537 | PJ Sangwan | Bowler | 42 | 42 | 856 | 1240 | 38 | 32.63 | 8.69 | 22.5 | 3/18 | 3 | 0 | 142 | 319 |
| 538 | PK Garg | Batter | 23 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 539 | PM Sarvesh Kumar | Batter | 2 | 2 | 30 | 42 | 1 | 42 | 8.4 | 30 | 1/18 | 0 | 0 | 5 | 11 |
| 540 | PN Mankad | Batter | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 541 | PP Chawla | Bowler | 192 | 191 | 3850 | 5108 | 192 | 26.6 | 7.96 | 20.1 | 4/17 | 15 | 0 | 637 | 1325 |
| 542 | PP Ojha | Bowler | 92 | 90 | 1899 | 2337 | 89 | 26.26 | 7.38 | 21.3 | 3/11 | 5 | 0 | 314 | 667 |
| 543 | PP Shaw | Batter | 79 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 544 | PR Shah | WK-Batter | 16 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 545 | PR Veer | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 546 | Prince Yadav | Bowler | 8 | 8 | 179 | 279 | 7 | 39.86 | 9.35 | 25.6 | 2/20 | 0 | 0 | 29 | 61 |
| 547 | Priyansh Arya | All-rounder | 20 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 548 | PSP Handscomb | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 549 | PV Tambe | Bowler | 33 | 33 | 660 | 853 | 28 | 30.46 | 7.75 | 23.6 | 4/20 | 2 | 0 | 110 | 204 |
| 550 | PVD Chameera | Bowler | 20 | 19 | 384 | 630 | 13 | 48.46 | 9.84 | 29.5 | 2/17 | 0 | 0 | 64 | 146 |
| 551 | PVSN Raju | Batter | 2 | 2 | 24 | 53 | 1 | 53 | 13.25 | 24 | 1/40 | 0 | 0 | 4 | 3 |
| 552 | PWA Mulder | Batter | 1 | 1 | 6 | 16 | 0 | 0 | 16 | 0 | - | 0 | 0 | 1 | 1 |
| 553 | PWH de Silva | Bowler | 37 | 37 | 798 | 1119 | 46 | 24.33 | 8.41 | 17.3 | 5/18 | 3 | 1 | 133 | 264 |
| 554 | Q de Kock | WK-Batter | 115 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 555 | R Ashwin | Bowler | 219 | 217 | 4710 | 5652 | 187 | 30.22 | 7.2 | 25.2 | 4/34 | 9 | 0 | 782 | 1606 |
| 556 | R Bhatia | Bowler | 95 | 91 | 1636 | 2020 | 71 | 28.45 | 7.41 | 23 | 4/15 | 4 | 0 | 271 | 436 |
| 557 | R Bishnoi | Bowler | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 558 | R Dar | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 559 | R Dhawan | Bowler | 39 | 36 | 662 | 891 | 25 | 35.64 | 8.08 | 26.5 | 2/14 | 0 | 0 | 110 | 205 |
| 560 | R Dravid | Batter | 89 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 561 | R Ghosh | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 562 | R Goyal | Batter | 1 | 1 | 24 | 33 | 0 | 0 | 8.25 | 0 | - | 0 | 0 | 4 | 6 |
| 563 | R McLaren | Bowler | 18 | 18 | 354 | 542 | 12 | 45.17 | 9.19 | 29.5 | 2/28 | 0 | 0 | 59 | 116 |
| 564 | R Minz | WK-Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 565 | R Ninan | Batter | 2 | 2 | 36 | 65 | 3 | 21.67 | 10.83 | 12 | 2/31 | 0 | 0 | 6 | 8 |
| 566 | R Parag | All-rounder | 86 | 31 | 301 | 488 | 8 | 61 | 9.73 | 37.6 | 1/7 | 0 | 0 | 50 | 68 |
| 567 | R Powell | Batter | 29 | 2 | 18 | 35 | 1 | 35 | 11.67 | 18 | 1/18 | 0 | 0 | 3 | 4 |
| 568 | R Rampaul | Bowler | 12 | 13 | 268 | 309 | 16 | 19.31 | 6.92 | 16.8 | 3/31 | 1 | 0 | 44 | 130 |
| 569 | R Ravindra | All-rounder | 18 | 2 | 12 | 7 | 0 | 0 | 3.5 | 0 | - | 0 | 0 | 2 | 5 |
| 570 | R Sai Kishore | All-rounder | 25 | 25 | 441 | 651 | 32 | 20.34 | 8.86 | 13.8 | 4/33 | 2 | 0 | 73 | 130 |
| 571 | R Sanjay Yadav | Batter | 1 | 1 | 12 | 23 | 0 | 0 | 11.5 | 0 | - | 0 | 0 | 2 | 6 |
| 572 | R Sathish | Batter | 34 | 14 | 139 | 232 | 3 | 77.33 | 10.01 | 46.3 | 1/11 | 0 | 0 | 23 | 30 |
| 573 | R Sharma | Bowler | 44 | 44 | 928 | 1086 | 40 | 27.15 | 7.02 | 23.2 | 3/13 | 1 | 0 | 154 | 334 |
| 574 | R Sharma | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 575 | R Shepherd | All-rounder | 20 | 17 | 240 | 481 | 13 | 37 | 12.03 | 18.5 | 3/54 | 1 | 0 | 40 | 68 |
| 576 | R Shukla | Bowler | 7 | 7 | 120 | 208 | 5 | 41.6 | 10.4 | 24 | 2/28 | 0 | 0 | 20 | 38 |
| 577 | R Singh | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 578 | R Tewatia | All-rounder | 111 | 52 | 843 | 1111 | 32 | 34.72 | 7.91 | 26.3 | 3/18 | 4 | 0 | 141 | 264 |
| 579 | R Vinay Kumar | Bowler | 104 | 105 | 2127 | 2986 | 105 | 28.44 | 8.42 | 20.3 | 4/40 | 10 | 0 | 349 | 763 |
| 580 | RA Bawa | All-rounder | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 581 | RA Jadeja | All-rounder | 256 | 227 | 4086 | 5231 | 172 | 30.41 | 7.68 | 23.8 | 5/16 | 17 | 1 | 675 | 1303 |
| 582 | RA Shaikh | Batter | 1 | 1 | 6 | 11 | 0 | 0 | 11 | 0 | - | 0 | 0 | 1 | 1 |
| 583 | RA Tripathi | Batter | 100 | 1 | 6 | 12 | 0 | 0 | 12 | 0 | - | 0 | 0 | 1 | 0 |
| 584 | Rahmanullah Gurbaz | Batter | 18 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 585 | Ramandeep Singh | All-rounder | 33 | 4 | 40 | 63 | 6 | 10.5 | 9.45 | 6.7 | 3/20 | 1 | 0 | 6 | 12 |
| 586 | Rashid Khan | Bowler | 139 | 142 | 3274 | 3866 | 163 | 23.72 | 7.08 | 20.1 | 4/24 | 17 | 0 | 543 | 1172 |
| 587 | Rasikh Salam | All-rounder | 13 | 13 | 231 | 409 | 10 | 40.9 | 10.62 | 23.1 | 3/34 | 2 | 0 | 38 | 69 |
| 588 | Ravi Bishnoi | Bowler | 80 | 79 | 1687 | 2319 | 79 | 29.35 | 8.25 | 21.4 | 4/41 | 5 | 0 | 280 | 578 |
| 589 | RD Chahar | Bowler | 80 | 79 | 1694 | 2196 | 75 | 29.28 | 7.78 | 22.6 | 4/27 | 6 | 0 | 280 | 580 |
| 590 | RD Gaikwad | Batter | 74 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 591 | RD Rickelton | WK-Batter | 17 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 592 | RE Levi | Batter | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 593 | RE van der Merwe | Bowler | 21 | 21 | 443 | 498 | 21 | 23.71 | 6.74 | 21.1 | 3/20 | 1 | 0 | 73 | 148 |
| 594 | RG More | Batter | 2 | 2 | 35 | 59 | 1 | 59 | 10.11 | 35 | 1/31 | 0 | 0 | 5 | 4 |
| 595 | RG Sharma | Batter | 275 | 32 | 339 | 453 | 15 | 30.2 | 8.02 | 22.6 | 4/6 | 2 | 0 | 57 | 88 |
| 596 | RJ Gleeson | Batter | 3 | 3 | 68 | 110 | 2 | 55 | 9.71 | 34 | 1/30 | 0 | 0 | 10 | 24 |
| 597 | RJ Harris | Bowler | 37 | 37 | 832 | 1047 | 45 | 23.27 | 7.55 | 18.5 | 4/34 | 6 | 0 | 138 | 364 |
| 598 | RJ Peterson | Batter | 5 | 4 | 48 | 70 | 3 | 23.33 | 8.75 | 16 | 3/37 | 1 | 0 | 8 | 21 |
| 599 | RJ Quiney | Batter | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 600 | RJW Topley | Bowler | 6 | 6 | 120 | 222 | 5 | 44.4 | 11.1 | 24 | 2/27 | 0 | 0 | 20 | 44 |
| 601 | RK Bhui | Batter | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 602 | RK Singh | Batter | 61 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 603 | RM Patidar | Batter | 44 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 604 | RN ten Doeschate | Batter | 29 | 10 | 78 | 94 | 2 | 47 | 7.23 | 39 | 1/7 | 0 | 0 | 13 | 22 |
| 605 | RP Meredith | Bowler | 18 | 18 | 388 | 612 | 19 | 32.21 | 9.46 | 20.4 | 2/24 | 0 | 0 | 62 | 147 |
| 606 | RP Singh | Bowler | 82 | 82 | 1775 | 2338 | 90 | 25.98 | 7.9 | 19.7 | 4/22 | 11 | 0 | 292 | 744 |
| 607 | RR Bhatkal | Batter | 1 | 1 | 12 | 35 | 0 | 0 | 17.5 | 0 | - | 0 | 0 | 2 | 0 |
| 608 | RR Bose | Batter | 1 | 1 | 12 | 24 | 0 | 0 | 12 | 0 | - | 0 | 0 | 2 | 5 |
| 609 | RR Pant | WK-Batter | 127 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 610 | RR Powar | Bowler | 27 | 26 | 426 | 527 | 13 | 40.54 | 7.42 | 32.8 | 2/11 | 0 | 0 | 71 | 166 |
| 611 | RR Raje | All-rounder | 10 | 10 | 139 | 209 | 6 | 34.83 | 9.02 | 23.2 | 2/16 | 0 | 0 | 22 | 39 |
| 612 | RR Rossouw | Batter | 22 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 613 | RR Sarwan | Batter | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 614 | RS Bopara | All-rounder | 24 | 14 | 206 | 292 | 11 | 26.55 | 8.5 | 18.7 | 3/31 | 1 | 0 | 34 | 61 |
| 615 | RS Gavaskar | Batter | 2 | 1 | 6 | 8 | 0 | 0 | 8 | 0 | - | 0 | 0 | 1 | 2 |
| 616 | RS Hangargekar | Batter | 2 | 2 | 36 | 60 | 3 | 20 | 10 | 12 | 3/36 | 1 | 0 | 6 | 14 |
| 617 | RS Sodhi | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 618 | RT Ponting | Batter | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 619 | RV Gomez | Batter | 13 | 9 | 96 | 129 | 5 | 25.8 | 8.06 | 19.2 | 2/14 | 0 | 0 | 16 | 37 |
| 620 | RV Patel | Batter | 9 | 1 | 18 | 22 | 0 | 0 | 7.33 | 0 | - | 0 | 0 | 3 | 5 |
| 621 | RV Pawar | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 622 | RV Uthappa | Batter | 205 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 623 | RW Price | Batter | 1 | 1 | 18 | 33 | 0 | 0 | 11 | 0 | - | 0 | 0 | 3 | 1 |
| 624 | S Ahamad | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 625 | S Anirudha | Batter | 20 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 626 | S Aravind | Bowler | 38 | 38 | 760 | 1039 | 45 | 23.09 | 8.2 | 16.9 | 4/14 | 3 | 0 | 126 | 290 |
| 627 | S Arora | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 628 | S Badree | Bowler | 12 | 12 | 258 | 319 | 11 | 29 | 7.42 | 23.5 | 4/9 | 1 | 0 | 43 | 109 |
| 629 | S Badrinath | Batter | 94 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 630 | S Chanderpaul | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 631 | S Deswal | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 632 | S Dhawan | Batter | 222 | 6 | 48 | 66 | 4 | 16.5 | 8.25 | 12 | 1/7 | 0 | 0 | 8 | 17 |
| 633 | S Dube | All-rounder | 82 | 16 | 136 | 243 | 6 | 40.5 | 10.72 | 22.7 | 2/15 | 0 | 0 | 22 | 26 |
| 634 | S Dubey | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 635 | S Gopal | Bowler | 52 | 51 | 991 | 1349 | 52 | 25.94 | 8.17 | 19.1 | 4/16 | 5 | 0 | 165 | 317 |
| 636 | S Hussain | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 637 | S Joseph | Batter | 1 | 1 | 24 | 47 | 0 | 0 | 11.75 | 0 | - | 0 | 0 | 4 | 9 |
| 638 | S Kaul | Bowler | 55 | 55 | 1209 | 1739 | 58 | 29.98 | 8.63 | 20.8 | 4/29 | 4 | 0 | 198 | 387 |
| 639 | S Kaushik | All-rounder | 10 | 10 | 204 | 297 | 6 | 49.5 | 8.74 | 34 | 3/20 | 1 | 0 | 34 | 68 |
| 640 | S Khan | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 641 | S Ladda | Bowler | 9 | 9 | 138 | 224 | 5 | 44.8 | 9.74 | 27.6 | 2/44 | 0 | 0 | 23 | 48 |
| 642 | S Lamichhane | Bowler | 9 | 9 | 210 | 292 | 13 | 22.46 | 8.34 | 16.2 | 3/36 | 2 | 0 | 35 | 75 |
| 643 | S Midhun | Batter | 1 | 1 | 12 | 27 | 0 | 0 | 13.5 | 0 | - | 0 | 0 | 2 | 3 |
| 644 | S Mishra | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 645 | S Nadeem | Bowler | 72 | 70 | 1415 | 1784 | 48 | 37.17 | 7.56 | 29.5 | 3/16 | 1 | 0 | 234 | 453 |
| 646 | S Narwal | Bowler | 7 | 6 | 106 | 202 | 5 | 40.4 | 11.43 | 21.2 | 3/36 | 1 | 0 | 17 | 37 |
| 647 | S Parakh | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 648 | S Rana | Batter | 11 | 3 | 16 | 18 | 0 | 0 | 6.75 | 0 | - | 0 | 0 | 2 | 5 |
| 649 | S Randiv | All-rounder | 8 | 8 | 174 | 223 | 6 | 37.17 | 7.69 | 29 | 2/24 | 0 | 0 | 29 | 60 |
| 650 | S Ranjan | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 651 | S Ravichandran | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 652 | S Sandeep Warrier | Bowler | 10 | 10 | 168 | 253 | 8 | 31.63 | 9.04 | 21 | 3/15 | 1 | 0 | 28 | 72 |
| 653 | S Sohal | Batter | 22 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 654 | S Sreesanth | Bowler | 44 | 44 | 880 | 1194 | 40 | 29.85 | 8.14 | 22 | 3/29 | 1 | 0 | 145 | 399 |
| 655 | S Sriram | Batter | 2 | 2 | 18 | 49 | 0 | 0 | 16.33 | 0 | - | 0 | 0 | 3 | 2 |
| 656 | S Tyagi | All-rounder | 14 | 14 | 209 | 295 | 6 | 49.17 | 8.47 | 34.8 | 2/18 | 0 | 0 | 34 | 93 |
| 657 | S Vidyut | Batter | 9 | 1 | 12 | 22 | 1 | 22 | 11 | 12 | 1/22 | 0 | 0 | 2 | 5 |
| 658 | SA Abbott | Batter | 3 | 3 | 54 | 104 | 1 | 104 | 11.56 | 54 | 1/47 | 0 | 0 | 9 | 13 |
| 659 | SA Asnodkar | Batter | 20 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 660 | SA Yadav | Batter | 169 | 1 | 6 | 8 | 0 | 0 | 8 | 0 | - | 0 | 0 | 1 | 2 |
| 661 | Sachin Baby | Batter | 20 | 2 | 10 | 8 | 2 | 4 | 4.8 | 5 | 2/4 | 0 | 0 | 1 | 5 |
| 662 | Salman Butt | Batter | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 663 | Sameer Rizvi | All-rounder | 17 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 664 | Sandeep Sharma | Bowler | 139 | 140 | 3097 | 4165 | 149 | 27.95 | 8.07 | 20.8 | 5/18 | 12 | 1 | 512 | 1189 |
| 665 | Sanvir Singh | Batter | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 666 | Saurav Chauhan | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 667 | SB Bangar | Batter | 12 | 9 | 150 | 219 | 4 | 54.75 | 8.76 | 37.5 | 2/34 | 0 | 0 | 25 | 55 |
| 668 | SB Dubey | Batter | 13 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 669 | SB Jakati | Bowler | 59 | 57 | 1085 | 1451 | 47 | 30.87 | 8.02 | 23.1 | 4/22 | 2 | 0 | 180 | 337 |
| 670 | SB Joshi | Batter | 4 | 4 | 55 | 82 | 1 | 82 | 8.95 | 55 | 1/27 | 0 | 0 | 9 | 18 |
| 671 | SB Styris | All-rounder | 12 | 11 | 216 | 276 | 8 | 34.5 | 7.67 | 27 | 3/32 | 1 | 0 | 36 | 83 |
| 672 | SB Wagh | Bowler | 8 | 8 | 102 | 137 | 5 | 27.4 | 8.06 | 20.4 | 3/16 | 1 | 0 | 17 | 45 |
| 673 | SC Ganguly | Batter | 59 | 20 | 276 | 363 | 10 | 36.3 | 7.89 | 27.6 | 2/21 | 0 | 0 | 46 | 75 |
| 674 | SC Kuggeleijn | Batter | 2 | 2 | 48 | 71 | 2 | 35.5 | 8.88 | 24 | 2/37 | 0 | 0 | 8 | 17 |
| 675 | SD Chitnis | Batter | 11 | 2 | 36 | 60 | 2 | 30 | 10 | 18 | 2/40 | 0 | 0 | 6 | 9 |
| 676 | SD Hope | WK-Batter | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 677 | SD Lad | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 678 | SE Bond | All-rounder | 8 | 8 | 186 | 224 | 9 | 24.89 | 7.23 | 20.7 | 2/24 | 0 | 0 | 31 | 75 |
| 679 | SE Marsh | Batter | 71 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 680 | SE Rutherford | Batter | 26 | 6 | 41 | 59 | 1 | 59 | 8.63 | 41 | 1/6 | 0 | 0 | 7 | 7 |
| 681 | Sediqullah Atal | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 682 | SH Johnson | Batter | 9 | 9 | 164 | 284 | 5 | 56.8 | 10.39 | 32.8 | 2/25 | 0 | 0 | 27 | 59 |
| 683 | Shahbaz Ahmed | All-rounder | 59 | 46 | 594 | 955 | 22 | 43.41 | 9.65 | 27 | 3/7 | 2 | 0 | 98 | 152 |
| 684 | Shahid Afridi | All-rounder | 10 | 10 | 180 | 225 | 9 | 25 | 7.5 | 20 | 3/28 | 1 | 0 | 30 | 57 |
| 685 | Shakib Al Hasan | All-rounder | 71 | 70 | 1484 | 1839 | 63 | 29.19 | 7.44 | 23.6 | 3/17 | 2 | 0 | 246 | 504 |
| 686 | Shashank Singh | Batter | 45 | 4 | 30 | 52 | 1 | 52 | 10.4 | 30 | 1/5 | 0 | 0 | 5 | 5 |
| 687 | Shivam Mavi | Bowler | 32 | 32 | 649 | 942 | 30 | 31.4 | 8.71 | 21.6 | 4/21 | 1 | 0 | 108 | 254 |
| 688 | Shivam Sharma | Batter | 5 | 5 | 114 | 165 | 4 | 41.25 | 8.68 | 28.5 | 2/26 | 0 | 0 | 19 | 37 |
| 689 | Shivam Singh | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 690 | Shivang Kumar | All-rounder | 2 | 2 | 48 | 71 | 1 | 71 | 8.88 | 48 | 1/30 | 0 | 0 | 8 | 12 |
| 691 | Shoaib Ahmed | Bowler | 8 | 7 | 102 | 152 | 5 | 30.4 | 8.94 | 20.4 | 2/20 | 0 | 0 | 17 | 33 |
| 692 | Shoaib Akhtar | Batter | 3 | 3 | 42 | 54 | 5 | 10.8 | 7.71 | 8.4 | 4/11 | 1 | 0 | 7 | 23 |
| 693 | Shoaib Malik | Batter | 7 | 5 | 51 | 85 | 2 | 42.5 | 10 | 25.5 | 1/6 | 0 | 0 | 8 | 15 |
| 694 | Shubman Gill | Batter | 120 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 695 | Sikandar Raza | Batter | 9 | 7 | 84 | 141 | 3 | 47 | 10.07 | 28 | 1/19 | 0 | 0 | 14 | 21 |
| 696 | Simarjeet Singh | Bowler | 14 | 14 | 240 | 400 | 11 | 36.36 | 10 | 21.8 | 3/26 | 1 | 0 | 40 | 102 |
| 697 | SJ Srivastava | Bowler | 14 | 14 | 282 | 441 | 14 | 31.5 | 9.38 | 20.1 | 2/20 | 0 | 0 | 47 | 103 |
| 698 | SK Raina | Batter | 204 | 69 | 908 | 1118 | 25 | 44.72 | 7.39 | 36.3 | 2/0 | 0 | 0 | 150 | 280 |
| 699 | SK Rasheed | Batter | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 700 | SK Trivedi | Bowler | 76 | 75 | 1506 | 1904 | 65 | 29.29 | 7.59 | 23.2 | 4/25 | 5 | 0 | 248 | 492 |
| 701 | SK Warne | Bowler | 55 | 54 | 1194 | 1447 | 57 | 25.39 | 7.27 | 20.9 | 4/21 | 5 | 0 | 199 | 426 |
| 702 | SL Malinga | Bowler | 122 | 122 | 2827 | 3371 | 170 | 19.83 | 7.15 | 16.6 | 5/13 | 19 | 1 | 464 | 1144 |
| 703 | SM Boland | Batter | 2 | 2 | 42 | 54 | 2 | 27 | 7.71 | 21 | 2/31 | 0 | 0 | 7 | 14 |
| 704 | SM Curran | All-rounder | 64 | 63 | 1253 | 2033 | 59 | 34.46 | 9.74 | 21.2 | 4/11 | 7 | 0 | 207 | 394 |
| 705 | SM Harwood | Batter | 3 | 3 | 60 | 73 | 3 | 24.33 | 7.3 | 20 | 2/25 | 0 | 0 | 10 | 33 |
| 706 | SM Katich | Batter | 11 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 707 | SM Pollock | All-rounder | 13 | 13 | 276 | 301 | 11 | 27.36 | 6.54 | 25.1 | 3/12 | 1 | 0 | 46 | 130 |
| 708 | SMSM Senanayake | All-rounder | 8 | 8 | 192 | 209 | 9 | 23.22 | 6.53 | 21.3 | 2/26 | 0 | 0 | 32 | 73 |
| 709 | SN Khan | Batter | 53 | 1 | 2 | 6 | 0 | 0 | 18 | 0 | - | 0 | 0 | 0 | 0 |
| 710 | SN Thakur | All-rounder | 108 | 105 | 2124 | 3360 | 111 | 30.27 | 9.49 | 19.1 | 4/34 | 9 | 0 | 351 | 711 |
| 711 | SO Hetmyer | Batter | 89 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 712 | Sohail Tanvir | Bowler | 11 | 11 | 247 | 266 | 22 | 12.09 | 6.46 | 11.2 | 6/14 | 5 | 1 | 41 | 121 |
| 713 | SP Fleming | Batter | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 714 | SP Goswami | WK-Batter | 31 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 715 | SP Jackson | Batter | 9 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 716 | SP Narine | All-rounder | 190 | 190 | 4393 | 5002 | 193 | 25.92 | 6.83 | 22.8 | 5/19 | 17 | 1 | 731 | 1665 |
| 717 | SPD Smith | Batter | 103 | 1 | 2 | 5 | 0 | 0 | 15 | 0 | - | 0 | 0 | 0 | 0 |
| 718 | SR Tendulkar | Batter | 78 | 4 | 36 | 58 | 0 | 0 | 9.67 | 0 | - | 0 | 0 | 6 | 4 |
| 719 | SR Watson | All-rounder | 145 | 105 | 2029 | 2682 | 92 | 29.15 | 7.93 | 22.1 | 4/29 | 8 | 0 | 335 | 803 |
| 720 | SS Agarwal | Batter | 1 | 1 | 24 | 42 | 1 | 42 | 10.5 | 24 | 1/42 | 0 | 0 | 4 | 7 |
| 721 | SS Cottrell | Bowler | 6 | 6 | 120 | 176 | 6 | 29.33 | 8.8 | 20 | 2/17 | 0 | 0 | 20 | 58 |
| 722 | SS Iyer | Batter | 136 | 1 | 6 | 7 | 0 | 0 | 7 | 0 | - | 0 | 0 | 1 | 4 |
| 723 | SS Mundhe | Batter | 1 | 1 | 6 | 6 | 1 | 6 | 6 | 6 | 1/6 | 0 | 0 | 1 | 4 |
| 724 | SS Prabhudessai | Batter | 11 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 725 | SS Sarkar | Batter | 2 | 2 | 25 | 34 | 1 | 34 | 8.16 | 25 | 1/15 | 0 | 0 | 4 | 4 |
| 726 | SS Shaikh | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 727 | SS Tiwary | Batter | 92 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 728 | SSB Magala | Batter | 2 | 2 | 36 | 51 | 1 | 51 | 8.5 | 36 | 1/37 | 0 | 0 | 6 | 5 |
| 729 | ST Jayasuriya | All-rounder | 30 | 21 | 294 | 390 | 13 | 30 | 7.96 | 22.6 | 3/14 | 1 | 0 | 49 | 83 |
| 730 | STR Binny | All-rounder | 95 | 63 | 594 | 758 | 22 | 34.45 | 7.66 | 27 | 2/14 | 0 | 0 | 99 | 199 |
| 731 | Sumit Kumar | Batter | 4 | 2 | 20 | 38 | 0 | 0 | 11.4 | 0 | - | 0 | 0 | 3 | 4 |
| 732 | Sunny Gupta | Batter | 1 | 1 | 18 | 47 | 0 | 0 | 15.67 | 0 | - | 0 | 0 | 3 | 0 |
| 733 | Sunny Singh | Batter | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 734 | Suryansh Shedge | All-rounder | 5 | 1 | 18 | 40 | 0 | 0 | 13.33 | 0 | - | 0 | 0 | 3 | 1 |
| 735 | Suyash Sharma | Bowler | 29 | 29 | 600 | 863 | 20 | 43.15 | 8.63 | 30 | 3/17 | 2 | 0 | 100 | 193 |
| 736 | SV Samson | WK-Batter | 179 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 737 | SW Billings | Batter | 30 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 738 | SW Tait | Bowler | 21 | 21 | 473 | 640 | 23 | 27.83 | 8.12 | 20.6 | 3/13 | 4 | 0 | 77 | 200 |
| 739 | Swapnil Singh | All-rounder | 14 | 14 | 162 | 241 | 7 | 34.43 | 8.93 | 23.1 | 2/28 | 0 | 0 | 27 | 39 |
| 740 | SZ Mulani | Batter | 2 | 2 | 30 | 57 | 0 | 0 | 11.4 | 0 | - | 0 | 0 | 5 | 7 |
| 741 | T Banton | WK-Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 742 | T Henderson | Batter | 2 | 2 | 36 | 40 | 1 | 40 | 6.67 | 36 | 1/30 | 0 | 0 | 6 | 14 |
| 743 | T Kohler-Cadmore | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 744 | T Kohli | Batter | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 745 | T Mishra | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 746 | T Natarajan | Bowler | 67 | 66 | 1428 | 2109 | 72 | 29.29 | 8.86 | 19.8 | 4/19 | 5 | 0 | 236 | 439 |
| 747 | T Shamsi | Batter | 5 | 5 | 120 | 181 | 3 | 60.33 | 9.05 | 40 | 1/21 | 0 | 0 | 20 | 28 |
| 748 | T Singh | Batter | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 749 | T Stubbs | Batter | 36 | 5 | 36 | 69 | 4 | 17.25 | 11.5 | 9 | 2/11 | 0 | 0 | 6 | 12 |
| 750 | T Taibu | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 751 | T Thushara | All-rounder | 6 | 6 | 135 | 161 | 8 | 20.13 | 7.16 | 16.9 | 2/16 | 0 | 0 | 22 | 57 |
| 752 | T Vijay | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 753 | TA Boult | Bowler | 121 | 122 | 2717 | 3822 | 143 | 26.73 | 8.44 | 19 | 4/18 | 12 | 0 | 447 | 1117 |
| 754 | Tanush Kotian | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 755 | TD Paine | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 756 | Tejas Baroka | Batter | 1 | 1 | 21 | 33 | 0 | 0 | 9.43 | 0 | - | 0 | 0 | 3 | 6 |
| 757 | TG Southee | Bowler | 54 | 54 | 1206 | 1742 | 47 | 37.06 | 8.67 | 25.7 | 3/20 | 4 | 0 | 201 | 447 |
| 758 | TH David | Batter | 52 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 759 | Tilak Varma | Batter | 57 | 4 | 22 | 28 | 0 | 0 | 7.64 | 0 | - | 0 | 0 | 3 | 8 |
| 760 | TK Curran | Bowler | 13 | 13 | 238 | 430 | 13 | 33.08 | 10.84 | 18.3 | 3/29 | 1 | 0 | 38 | 57 |
| 761 | TL Seifert | WK-Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 762 | TL Suman | Batter | 43 | 11 | 150 | 197 | 6 | 32.83 | 7.88 | 25 | 2/14 | 0 | 0 | 25 | 43 |
| 763 | TM Dilshan | All-rounder | 51 | 25 | 271 | 366 | 5 | 73.2 | 8.1 | 54.2 | 1/3 | 0 | 0 | 45 | 79 |
| 764 | TM Head | Batter | 41 | 6 | 58 | 113 | 2 | 56.5 | 11.69 | 29 | 2/30 | 0 | 0 | 9 | 9 |
| 765 | TM Srivastava | Batter | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 766 | TP Sudhindra | Batter | 3 | 3 | 70 | 136 | 1 | 136 | 11.66 | 70 | 1/46 | 0 | 0 | 11 | 18 |
| 767 | TR Birt | Batter | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 768 | TS Mills | Bowler | 10 | 10 | 209 | 343 | 11 | 31.18 | 9.85 | 19 | 3/35 | 1 | 0 | 34 | 69 |
| 769 | TU Deshpande | Bowler | 48 | 48 | 995 | 1636 | 53 | 30.87 | 9.87 | 18.8 | 4/27 | 5 | 0 | 165 | 350 |
| 770 | U Kaul | Batter | 5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 771 | UA Birla | Batter | 2 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 772 | UBT Chand | Batter | 21 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 773 | Umar Gul | Bowler | 6 | 6 | 135 | 184 | 12 | 15.33 | 8.18 | 11.3 | 4/23 | 2 | 0 | 22 | 51 |
| 774 | Umran Malik | Bowler | 26 | 26 | 493 | 772 | 29 | 26.62 | 9.4 | 17 | 5/25 | 4 | 1 | 82 | 205 |
| 775 | Urvil Patel | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 776 | UT Khawaja | Batter | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 777 | UT Yadav | Bowler | 148 | 148 | 3056 | 4332 | 144 | 30.08 | 8.51 | 21.2 | 4/23 | 16 | 0 | 507 | 1186 |
| 778 | V Chakaravarthy | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 779 | V Kaverappa | Batter | 1 | 1 | 24 | 36 | 2 | 18 | 9 | 12 | 2/36 | 0 | 0 | 4 | 11 |
| 780 | V Kohli | Batter | 268 | 26 | 251 | 368 | 4 | 92 | 8.8 | 62.8 | 2/25 | 0 | 0 | 42 | 52 |
| 781 | V Malhotra | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 782 | V Nigam | All-rounder | 17 | 16 | 264 | 411 | 12 | 34.25 | 9.34 | 22 | 2/18 | 0 | 0 | 44 | 81 |
| 783 | V Nishad | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 784 | V Ostwal | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 785 | V Pratap Singh | All-rounder | 9 | 9 | 204 | 296 | 10 | 29.6 | 8.71 | 20.4 | 2/31 | 0 | 0 | 34 | 71 |
| 786 | V Puthur | Batter | 5 | 5 | 72 | 109 | 6 | 18.17 | 9.08 | 12 | 3/32 | 1 | 0 | 12 | 24 |
| 787 | V Sehwag | Batter | 104 | 15 | 136 | 235 | 6 | 39.17 | 10.37 | 22.7 | 2/18 | 0 | 0 | 22 | 44 |
| 788 | V Shankar | All-rounder | 78 | 22 | 238 | 344 | 9 | 38.22 | 8.67 | 26.4 | 2/19 | 0 | 0 | 40 | 80 |
| 789 | V Suryavanshi | Batter | 10 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 790 | V Vijaykumar | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 791 | V Viyaskanth | Batter | 3 | 3 | 60 | 86 | 1 | 86 | 8.6 | 60 | 1/37 | 0 | 0 | 10 | 16 |
| 792 | VG Arora | Bowler | 35 | 34 | 686 | 1115 | 39 | 28.59 | 9.75 | 17.6 | 3/27 | 3 | 0 | 113 | 253 |
| 793 | VH Zol | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 794 | Vijaykumar Vyshak | Bowler | 19 | 18 | 381 | 648 | 22 | 29.45 | 10.2 | 17.3 | 3/20 | 2 | 0 | 63 | 109 |
| 795 | Virat Singh | Batter | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 796 | Vishnu Vinod | Batter | 6 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 797 | Vivrant Sharma | Batter | 3 | 2 | 18 | 37 | 0 | 0 | 12.33 | 0 | - | 0 | 0 | 3 | 5 |
| 798 | VR Aaron | Bowler | 52 | 50 | 994 | 1481 | 44 | 33.66 | 8.94 | 22.6 | 3/16 | 1 | 0 | 162 | 387 |
| 799 | VR Iyer | Batter | 61 | 9 | 81 | 143 | 3 | 47.67 | 10.59 | 27 | 2/29 | 0 | 0 | 13 | 15 |
| 800 | VRV Singh | Bowler | 19 | 18 | 360 | 542 | 12 | 45.17 | 9.03 | 30 | 3/29 | 1 | 0 | 60 | 114 |
| 801 | VS Malik | All-rounder | 13 | 13 | 205 | 261 | 6 | 43.5 | 7.64 | 34.2 | 2/14 | 0 | 0 | 34 | 84 |
| 802 | VS Yeligati | Batter | 2 | 2 | 30 | 59 | 0 | 0 | 11.8 | 0 | - | 0 | 0 | 5 | 6 |
| 803 | VVS Laxman | Batter | 20 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 804 | VY Mahesh | Bowler | 17 | 17 | 339 | 499 | 21 | 23.76 | 8.83 | 16.1 | 4/36 | 2 | 0 | 56 | 120 |
| 805 | W Hasaranga | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 806 | W Jaffer | Batter | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 807 | W O'Rourke | Batter | 3 | 3 | 62 | 132 | 6 | 22 | 12.77 | 10.3 | 3/27 | 1 | 0 | 10 | 15 |
| 808 | WA Mota | Batter | 12 | 7 | 72 | 97 | 4 | 24.25 | 8.08 | 18 | 1/6 | 0 | 0 | 12 | 24 |
| 809 | Washington Sundar | All-rounder | 69 | 65 | 1144 | 1474 | 40 | 36.85 | 7.73 | 28.6 | 3/16 | 3 | 0 | 189 | 378 |
| 810 | WD Parnell | Bowler | 33 | 33 | 723 | 937 | 36 | 26.03 | 7.78 | 20.1 | 3/10 | 5 | 0 | 118 | 296 |
| 811 | WG Jacks | All-rounder | 21 | 13 | 138 | 220 | 8 | 27.5 | 9.57 | 17.3 | 2/14 | 0 | 0 | 23 | 42 |
| 812 | WP Saha | WK-Batter | 169 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 813 | WPUJC Vaas | Bowler | 13 | 13 | 282 | 355 | 18 | 19.72 | 7.55 | 15.7 | 3/21 | 1 | 0 | 47 | 128 |
| 814 | X Thalaivan Sargunam | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 815 | XC Bartlett | Bowler | 7 | 7 | 118 | 189 | 5 | 37.8 | 9.61 | 23.6 | 2/9 | 0 | 0 | 19 | 52 |
| 816 | Y Charak | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 817 | Y Gnaneswara Rao | Batter | 2 | 1 | 6 | 7 | 0 | 0 | 7 | 0 | - | 0 | 0 | 1 | 3 |
| 818 | Y Nagar | Batter | 26 | 8 | 66 | 125 | 4 | 31.25 | 11.36 | 16.5 | 2/20 | 0 | 0 | 11 | 16 |
| 819 | Y Prithvi Raj | Batter | 2 | 2 | 30 | 57 | 1 | 57 | 11.4 | 30 | 1/29 | 0 | 0 | 5 | 8 |
| 820 | Y Punja | Bowler | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 821 | Y Venugopal Rao | All-rounder | 65 | 20 | 216 | 337 | 6 | 56.17 | 9.36 | 36 | 2/23 | 0 | 0 | 36 | 59 |
| 822 | YA Abdulla | Bowler | 11 | 11 | 209 | 307 | 15 | 20.47 | 8.81 | 13.9 | 4/31 | 3 | 0 | 34 | 88 |
| 823 | Yash Dayal | Bowler | 43 | 43 | 871 | 1390 | 41 | 33.9 | 9.58 | 21.2 | 3/20 | 2 | 0 | 144 | 307 |
| 824 | Yash Thakur | Bowler | 21 | 21 | 443 | 770 | 25 | 30.8 | 10.43 | 17.7 | 5/30 | 3 | 1 | 71 | 138 |
| 825 | Yashpal Singh | Batter | 8 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 826 | YBK Jaiswal | Batter | 69 | 1 | 1 | 6 | 0 | 0 | 36 | 0 | - | 0 | 0 | 0 | 0 |
| 827 | YK Pathan | All-rounder | 174 | 82 | 1147 | 1415 | 42 | 33.69 | 7.4 | 27.3 | 3/20 | 3 | 0 | 190 | 393 |
| 828 | Younis Khan | Batter | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 829 | YS Chahal | Bowler | 178 | 174 | 3833 | 5081 | 224 | 22.68 | 7.95 | 17.1 | 5/40 | 22 | 1 | 636 | 1278 |
| 830 | Yudhvir Singh | All-rounder | 9 | 9 | 138 | 253 | 8 | 31.63 | 11 | 17.3 | 3/47 | 1 | 0 | 23 | 54 |
| 831 | Yuvraj Singh | All-rounder | 132 | 73 | 869 | 1077 | 36 | 29.92 | 7.44 | 24.1 | 4/29 | 4 | 0 | 145 | 258 |
| 832 | YV Dhull | Batter | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 833 | YV Takawale | WK-Batter | 16 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | - | 0 | 0 | 0 | 0 |
| 834 | Z Foulkes | All-rounder | 0† | 0 | 0 | 0 | 0 | 0 | 0 | 0 | — | 0 | 0 | 0 | 0 |
| 835 | Z Khan | Bowler | 99 | 99 | 2200 | 2782 | 102 | 27.27 | 7.59 | 21.6 | 4/17 | 9 | 0 | 364 | 873 |
| 836 | Zeeshan Ansari | Bowler | 10 | 10 | 203 | 333 | 6 | 55.5 | 9.84 | 33.8 | 3/42 | 1 | 0 | 33 | 47 |

## Fielding — all 836 players

| # | Player | Role | M | Catches | Stumpings | Run-outs |
|---:|---|---|---:|---:|---:|---:|
| 1 | A Ankolekar | All-rounder | 0† | 0 | 0 | 0 |
| 2 | A Ashish Reddy | Bowler | 31 | 8 | 0 | 2 |
| 3 | A Badoni | All-rounder | 58 | 17 | 0 | 1 |
| 4 | A Chandila | Bowler | 12 | 2 | 0 | 0 |
| 5 | A Chopra | Batter | 7 | 2 | 0 | 1 |
| 6 | A Choudhary | Batter | 5 | 0 | 0 | 0 |
| 7 | A Dananjaya | Batter | 1 | 0 | 0 | 0 |
| 8 | A Flintoff | Batter | 3 | 3 | 0 | 0 |
| 9 | A Kamboj | Bowler | 14 | 4 | 0 | 0 |
| 10 | A Kumar | Bowler | 0† | 0 | 0 | 0 |
| 11 | A Kumble | Bowler | 42 | 9 | 0 | 0 |
| 12 | A Mandal | All-rounder | 0† | 0 | 0 | 0 |
| 13 | A Manohar | Batter | 27 | 17 | 0 | 2 |
| 14 | A Mhatre | Batter | 10 | 4 | 0 | 0 |
| 15 | A Mishra | Bowler | 162 | 19 | 0 | 10 |
| 16 | A Mithun | All-rounder | 16 | 7 | 0 | 1 |
| 17 | A Mukund | Batter | 3 | 3 | 0 | 1 |
| 18 | A Nabi | Bowler | 0† | 0 | 0 | 0 |
| 19 | A Nehra | Bowler | 88 | 17 | 0 | 2 |
| 20 | A Nel | Batter | 1 | 0 | 0 | 0 |
| 21 | A Nortje | Bowler | 49 | 10 | 0 | 1 |
| 22 | A Perala | Batter | 0† | 0 | 0 | 0 |
| 23 | A Raghuvanshi | Batter | 25 | 6 | 0 | 0 |
| 24 | A Raghuwanshi | Batter | 0† | 0 | 0 | 0 |
| 25 | A Singh | Bowler | 23 | 1 | 0 | 0 |
| 26 | A Symonds | All-rounder | 39 | 20 | 0 | 1 |
| 27 | A Tomar | Batter | 1 | 0 | 0 | 0 |
| 28 | A Uniyal | Batter | 2 | 0 | 0 | 0 |
| 29 | A Zampa | Bowler | 22 | 1 | 0 | 0 |
| 30 | AA Bilakhia | Batter | 7 | 1 | 0 | 0 |
| 31 | AA Chavan | All-rounder | 13 | 3 | 0 | 0 |
| 32 | AA Jhunjhunwala | Batter | 21 | 10 | 0 | 4 |
| 33 | AA Kazi | Batter | 1 | 0 | 0 | 0 |
| 34 | AA Kulkarni | Batter | 2 | 0 | 0 | 0 |
| 35 | AA Noffke | Batter | 1 | 0 | 0 | 0 |
| 36 | AB Agarkar | Bowler | 42 | 4 | 0 | 3 |
| 37 | AB Barath | Batter | 3 | 0 | 0 | 0 |
| 38 | AB de Villiers | Batter | 183 | 120 | 8 | 20 |
| 39 | AB Dinda | Bowler | 78 | 7 | 0 | 5 |
| 40 | AB McDonald | Bowler | 10 | 0 | 0 | 0 |
| 41 | Abdul Basith | Batter | 1 | 0 | 0 | 0 |
| 42 | Abdul Samad | All-rounder | 65 | 32 | 0 | 0 |
| 43 | Abdur Razzak | Batter | 1 | 0 | 0 | 0 |
| 44 | Abhinandan Singh | Batter | 2 | 2 | 0 | 0 |
| 45 | Abhishek Sharma | All-rounder | 80 | 25 | 0 | 1 |
| 46 | Abishek Porel | WK-Batter | 32 | 9 | 0 | 3 |
| 47 | AC Blizzard | Batter | 7 | 4 | 0 | 0 |
| 48 | AC Gilchrist | WK-Batter | 80 | 51 | 16 | 20 |
| 49 | AC Thomas | Bowler | 15 | 3 | 0 | 1 |
| 50 | AC Voges | Batter | 9 | 1 | 0 | 3 |
| 51 | AD Hales | Batter | 6 | 2 | 0 | 0 |
| 52 | AD Mascarenhas | Bowler | 13 | 2 | 0 | 0 |
| 53 | AD Mathews | All-rounder | 49 | 19 | 0 | 3 |
| 54 | AD Nath | Batter | 14 | 2 | 0 | 0 |
| 55 | AD Russell | All-rounder | 139 | 36 | 0 | 4 |
| 56 | AF Milne | Bowler | 10 | 7 | 0 | 0 |
| 57 | AG Murtaza | All-rounder | 12 | 3 | 0 | 1 |
| 58 | AG Paunikar | Batter | 5 | 1 | 0 | 1 |
| 59 | AJ Finch | Batter | 92 | 29 | 0 | 3 |
| 60 | AJ Hosein | Batter | 1 | 0 | 0 | 0 |
| 61 | AJ Turner | Batter | 6 | 0 | 0 | 0 |
| 62 | AJ Tye | Bowler | 30 | 7 | 0 | 0 |
| 63 | AK Markram | Batter | 59 | 32 | 0 | 0 |
| 64 | Akash Deep | All-rounder | 14 | 2 | 0 | 0 |
| 65 | Akash Madhwal | Bowler | 17 | 1 | 0 | 1 |
| 66 | Akash Singh | Bowler | 10 | 1 | 0 | 0 |
| 67 | AL Menaria | Batter | 29 | 4 | 0 | 0 |
| 68 | AM Ghazanfar | Batter | 2 | 0 | 0 | 0 |
| 69 | AM Nayar | All-rounder | 60 | 13 | 0 | 2 |
| 70 | AM Rahane | Batter | 201 | 78 | 0 | 9 |
| 71 | AM Salvi | Bowler | 7 | 2 | 0 | 0 |
| 72 | Aman Hakim Khan | Batter | 12 | 9 | 0 | 0 |
| 73 | AN Ahmed | Bowler | 17 | 2 | 0 | 3 |
| 74 | AN Ghosh | Batter | 2 | 1 | 0 | 0 |
| 75 | Anand Rajan | Bowler | 8 | 3 | 0 | 2 |
| 76 | Aniket Verma | Batter | 17 | 7 | 0 | 1 |
| 77 | Anirudh Singh | Batter | 5 | 3 | 0 | 0 |
| 78 | Ankit Sharma | Bowler | 22 | 4 | 0 | 0 |
| 79 | Ankit Soni | Batter | 7 | 1 | 0 | 0 |
| 80 | Anmolpreet Singh | Batter | 9 | 2 | 0 | 0 |
| 81 | Anuj Rawat | WK-Batter | 24 | 18 | 0 | 2 |
| 82 | Anureet Singh | Bowler | 23 | 5 | 0 | 1 |
| 83 | AP Dole | Batter | 3 | 2 | 0 | 0 |
| 84 | AP Majumdar | Batter | 4 | 0 | 0 | 0 |
| 85 | AP Tare | WK-Batter | 35 | 3 | 6 | 0 |
| 86 | AR Bawne | Batter | 1 | 0 | 0 | 0 |
| 87 | AR Patel | All-rounder | 166 | 74 | 0 | 5 |
| 88 | Arjun Tendulkar | Bowler | 5 | 0 | 0 | 0 |
| 89 | Arshad Khan | Bowler | 19 | 6 | 0 | 0 |
| 90 | Arshdeep Singh | Bowler | 86 | 14 | 0 | 4 |
| 91 | AS Joseph | Bowler | 22 | 3 | 0 | 2 |
| 92 | AS Rajpoot | Bowler | 29 | 3 | 0 | 1 |
| 93 | AS Raut | Batter | 22 | 10 | 0 | 1 |
| 94 | AS Roy | All-rounder | 14 | 10 | 0 | 2 |
| 95 | AS Yadav | Batter | 8 | 1 | 0 | 1 |
| 96 | Ashok Sharma | Bowler | 3 | 2 | 0 | 0 |
| 97 | Ashutosh Sharma | All-rounder | 24 | 4 | 0 | 0 |
| 98 | Ashwani Kumar | Bowler | 7 | 2 | 0 | 0 |
| 99 | AT Carey | Batter | 3 | 2 | 0 | 0 |
| 100 | AT Rayudu | Batter | 204 | 64 | 2 | 14 |
| 101 | Atharva Taide | Batter | 10 | 5 | 0 | 0 |
| 102 | AU Rashid | Bowler | 3 | 0 | 0 | 0 |
| 103 | AUK Pathan | Batter | 8 | 2 | 0 | 1 |
| 104 | Avesh Khan | Bowler | 76 | 11 | 0 | 2 |
| 105 | Azhar Mahmood | Bowler | 23 | 7 | 0 | 1 |
| 106 | Azmatullah Omarzai | All-rounder | 17 | 0 | 0 | 0 |
| 107 | B Akhil | All-rounder | 15 | 3 | 0 | 1 |
| 108 | B Carse | All-rounder | 0† | 0 | 0 | 0 |
| 109 | B Chipli | Batter | 23 | 4 | 0 | 0 |
| 110 | B Dwarshuis | All-rounder | 0† | 0 | 0 | 0 |
| 111 | B Geeves | Batter | 2 | 3 | 0 | 0 |
| 112 | B Indrajith | Batter | 3 | 1 | 0 | 1 |
| 113 | B Kumar | Bowler | 192 | 32 | 0 | 8 |
| 114 | B Laughlin | All-rounder | 9 | 1 | 0 | 0 |
| 115 | B Lee | Bowler | 38 | 8 | 0 | 6 |
| 116 | B Muzarabani | Bowler | 2 | 0 | 0 | 0 |
| 117 | B Sai Sudharsan | Batter | 43 | 11 | 0 | 2 |
| 118 | B Stanlake | All-rounder | 6 | 1 | 0 | 0 |
| 119 | B Sumanth | Batter | 5 | 4 | 0 | 0 |
| 120 | BA Bhatt | Bowler | 17 | 0 | 0 | 0 |
| 121 | BA Stokes | All-rounder | 45 | 23 | 0 | 2 |
| 122 | Basil Thampi | Bowler | 25 | 4 | 0 | 1 |
| 123 | BAW Mendis | All-rounder | 10 | 1 | 0 | 0 |
| 124 | BB McCullum | Batter | 109 | 38 | 6 | 14 |
| 125 | BB Samantray | Batter | 9 | 3 | 0 | 1 |
| 126 | BB Sran | Bowler | 24 | 4 | 0 | 2 |
| 127 | BCJ Cutting | All-rounder | 21 | 10 | 0 | 2 |
| 128 | BE Hendricks | All-rounder | 7 | 3 | 0 | 0 |
| 129 | Bipul Sharma | Bowler | 33 | 7 | 0 | 3 |
| 130 | BJ Haddin | Batter | 1 | 0 | 0 | 0 |
| 131 | BJ Hodge | All-rounder | 66 | 22 | 0 | 5 |
| 132 | BJ Rohrer | Batter | 8 | 3 | 0 | 2 |
| 133 | BKG Mendis | Batter | 1 | 1 | 0 | 0 |
| 134 | BMAJ Mendis | Batter | 3 | 2 | 0 | 1 |
| 135 | BR Dunk | Batter | 3 | 4 | 0 | 0 |
| 136 | BR Sharath | Batter | 1 | 1 | 0 | 0 |
| 137 | Brijesh Sharma | Bowler | 1 | 0 | 0 | 0 |
| 138 | BW Hilfenhaus | Bowler | 17 | 1 | 0 | 1 |
| 139 | C Bosch | All-rounder | 4 | 2 | 0 | 0 |
| 140 | C Connolly | All-rounder | 3 | 1 | 0 | 0 |
| 141 | C de Grandhomme | All-rounder | 25 | 6 | 0 | 1 |
| 142 | C Ganapathy | Batter | 1 | 0 | 0 | 0 |
| 143 | C Green | All-rounder | 32 | 11 | 0 | 3 |
| 144 | C Madan | Batter | 1 | 0 | 0 | 1 |
| 145 | C Munro | Batter | 13 | 4 | 0 | 0 |
| 146 | C Nanda | Batter | 3 | 0 | 0 | 0 |
| 147 | C Sakariya | Bowler | 20 | 6 | 0 | 0 |
| 148 | CA Ingram | Batter | 15 | 1 | 0 | 0 |
| 149 | CA Lynn | Batter | 42 | 12 | 0 | 0 |
| 150 | CA Pujara | Batter | 30 | 6 | 0 | 0 |
| 151 | CH Gayle | Batter | 141 | 30 | 0 | 0 |
| 152 | CH Morris | All-rounder | 81 | 36 | 0 | 4 |
| 153 | CJ Anderson | All-rounder | 30 | 11 | 0 | 0 |
| 154 | CJ Dala | Batter | 1 | 0 | 0 | 0 |
| 155 | CJ Ferguson | Batter | 9 | 2 | 0 | 0 |
| 156 | CJ Green | Batter | 1 | 1 | 0 | 0 |
| 157 | CJ Jordan | Bowler | 34 | 14 | 0 | 2 |
| 158 | CJ McKay | Batter | 2 | 0 | 0 | 0 |
| 159 | CK Kapugedera | Batter | 5 | 4 | 0 | 0 |
| 160 | CK Langeveldt | Bowler | 7 | 0 | 0 | 0 |
| 161 | CL White | Batter | 47 | 22 | 0 | 4 |
| 162 | CM Gautam | WK-Batter | 13 | 3 | 4 | 2 |
| 163 | CR Brathwaite | All-rounder | 16 | 6 | 0 | 1 |
| 164 | CR Woakes | All-rounder | 21 | 6 | 0 | 0 |
| 165 | CRD Fernando | Bowler | 10 | 2 | 0 | 1 |
| 166 | CV Varun | Bowler | 85 | 15 | 0 | 3 |
| 167 | D Brevis | Batter | 16 | 10 | 0 | 0 |
| 168 | D du Preez | Batter | 2 | 0 | 0 | 0 |
| 169 | D Ferreira | Batter | 5 | 3 | 0 | 0 |
| 170 | D Jansen | Batter | 1 | 2 | 0 | 0 |
| 171 | D Kalyankrishna | Batter | 3 | 1 | 0 | 0 |
| 172 | D Kamra | All-rounder | 0† | 0 | 0 | 0 |
| 173 | D Malewar | Batter | 0† | 0 | 0 | 0 |
| 174 | D Padikkal | Batter | 76 | 34 | 0 | 2 |
| 175 | D Pretorius | All-rounder | 7 | 3 | 0 | 1 |
| 176 | D Salunkhe | Batter | 6 | 2 | 0 | 0 |
| 177 | D Singh | Bowler | 0† | 0 | 0 | 0 |
| 178 | D Wiese | Bowler | 18 | 8 | 0 | 0 |
| 179 | DA Miller | Batter | 144 | 86 | 0 | 8 |
| 180 | DA Payne | All-rounder | 2 | 0 | 0 | 0 |
| 181 | DA Warner | Batter | 184 | 88 | 0 | 9 |
| 182 | DAJ Bracewell | Batter | 1 | 1 | 0 | 1 |
| 183 | DB Das | Batter | 31 | 7 | 0 | 2 |
| 184 | DB Ravi Teja | Batter | 32 | 11 | 0 | 2 |
| 185 | DE Bollinger | Bowler | 27 | 6 | 0 | 1 |
| 186 | DG Nalkande | All-rounder | 6 | 2 | 0 | 0 |
| 187 | DH Yagnik | WK-Batter | 25 | 12 | 5 | 6 |
| 188 | Dhruv Jurel | WK-Batter | 44 | 24 | 0 | 3 |
| 189 | DJ Bravo | All-rounder | 160 | 69 | 0 | 14 |
| 190 | DJ Harris | Batter | 4 | 5 | 0 | 0 |
| 191 | DJ Hooda | All-rounder | 125 | 59 | 0 | 4 |
| 192 | DJ Hussey | All-rounder | 64 | 25 | 0 | 5 |
| 193 | DJ Jacobs | Batter | 7 | 3 | 2 | 2 |
| 194 | DJ Malan | Batter | 1 | 1 | 0 | 0 |
| 195 | DJ Mitchell | All-rounder | 15 | 11 | 0 | 0 |
| 196 | DJ Muthuswami | Bowler | 6 | 0 | 0 | 0 |
| 197 | DJ Thornely | Batter | 6 | 2 | 0 | 0 |
| 198 | DJ Willey | All-rounder | 11 | 4 | 0 | 0 |
| 199 | DJG Sammy | Bowler | 22 | 9 | 0 | 4 |
| 200 | DJM Short | Batter | 7 | 2 | 0 | 0 |
| 201 | DL Chahar | Bowler | 97 | 13 | 0 | 1 |
| 202 | DL Vettori | Bowler | 34 | 11 | 0 | 4 |
| 203 | DM Bravo | Batter | 1 | 0 | 0 | 0 |
| 204 | DNT Zoysa | Batter | 3 | 0 | 0 | 0 |
| 205 | DP Conway | Batter | 29 | 10 | 0 | 1 |
| 206 | DP Nannes | Bowler | 29 | 8 | 0 | 2 |
| 207 | DP Vijaykumar | Bowler | 9 | 0 | 0 | 0 |
| 208 | DPMD Jayawardene | Batter | 80 | 33 | 0 | 8 |
| 209 | DR Martyn | Batter | 1 | 0 | 0 | 0 |
| 210 | DR Sams | Bowler | 16 | 11 | 0 | 0 |
| 211 | DR Shorey | Batter | 2 | 6 | 0 | 0 |
| 212 | DR Smith | All-rounder | 91 | 41 | 0 | 3 |
| 213 | DS Kulkarni | Bowler | 92 | 18 | 0 | 2 |
| 214 | DS Lehmann | Batter | 2 | 0 | 0 | 0 |
| 215 | DS Rathi | Bowler | 14 | 3 | 0 | 0 |
| 216 | DT Christian | All-rounder | 49 | 28 | 0 | 4 |
| 217 | DT Patil | Batter | 2 | 2 | 0 | 0 |
| 218 | DW Steyn | Bowler | 95 | 22 | 0 | 4 |
| 219 | E Lewis | Batter | 27 | 9 | 0 | 0 |
| 220 | E Malinga | Bowler | 10 | 2 | 0 | 3 |
| 221 | EJG Morgan | Batter | 83 | 36 | 0 | 6 |
| 222 | ER Dwivedi | Batter | 4 | 2 | 0 | 0 |
| 223 | F Behardien | Batter | 3 | 1 | 0 | 0 |
| 224 | F du Plessis | Batter | 154 | 86 | 0 | 5 |
| 225 | FA Allen | Batter | 5 | 2 | 0 | 0 |
| 226 | Fazalhaq Farooqi | All-rounder | 12 | 1 | 0 | 0 |
| 227 | FH Allen | Batter | 3 | 0 | 0 | 0 |
| 228 | FH Edwards | Bowler | 6 | 0 | 0 | 0 |
| 229 | FY Fazal | Batter | 12 | 7 | 0 | 2 |
| 230 | G Coetzee | Bowler | 14 | 3 | 0 | 0 |
| 231 | G Gambhir | Batter | 154 | 28 | 0 | 8 |
| 232 | G Singh | Bowler | 0† | 0 | 0 | 0 |
| 233 | Gagandeep Singh | Batter | 4 | 0 | 0 | 0 |
| 234 | GB Hogg | Bowler | 21 | 4 | 0 | 1 |
| 235 | GC Smith | Batter | 29 | 7 | 0 | 0 |
| 236 | GC Viljoen | All-rounder | 6 | 0 | 0 | 0 |
| 237 | GD McGrath | Bowler | 14 | 2 | 0 | 0 |
| 238 | GD Phillips | Batter | 11 | 6 | 0 | 0 |
| 239 | GH Vihari | Batter | 24 | 6 | 0 | 2 |
| 240 | GHS Garton | Batter | 5 | 1 | 0 | 0 |
| 241 | GJ Bailey | Batter | 40 | 12 | 0 | 6 |
| 242 | GJ Maxwell | All-rounder | 141 | 52 | 0 | 7 |
| 243 | GR Napier | Batter | 1 | 0 | 0 | 0 |
| 244 | GS Sandhu | Batter | 3 | 0 | 0 | 0 |
| 245 | Gulbadin Naib | Batter | 2 | 1 | 0 | 0 |
| 246 | Gurkeerat Singh | Batter | 41 | 20 | 1 | 1 |
| 247 | Gurnoor Brar | Batter | 1 | 0 | 0 | 0 |
| 248 | H Das | Batter | 1 | 0 | 0 | 0 |
| 249 | H Klaasen | WK-Batter | 52 | 24 | 7 | 8 |
| 250 | H Pannu | Batter | 0† | 0 | 0 | 0 |
| 251 | H Sharma | Batter | 2 | 0 | 0 | 0 |
| 252 | Harbhajan Singh | Bowler | 163 | 38 | 0 | 10 |
| 253 | Harmeet Singh | Bowler | 27 | 3 | 0 | 3 |
| 254 | Harmeet Singh | Batter | 1 | 0 | 0 | 0 |
| 255 | Harpreet Brar | All-rounder | 49 | 14 | 0 | 0 |
| 256 | Harpreet Singh | Batter | 9 | 3 | 0 | 0 |
| 257 | Harsh Dubey | All-rounder | 6 | 1 | 0 | 0 |
| 258 | Harshit Rana | Bowler | 33 | 11 | 0 | 0 |
| 259 | HC Brook | Batter | 11 | 3 | 0 | 0 |
| 260 | HE van der Dussen | Batter | 3 | 0 | 0 | 1 |
| 261 | HF Gurney | All-rounder | 8 | 0 | 0 | 0 |
| 262 | HH Gibbs | Batter | 36 | 22 | 0 | 5 |
| 263 | HH Pandya | All-rounder | 154 | 67 | 0 | 7 |
| 264 | Himmat Singh | Batter | 3 | 1 | 0 | 0 |
| 265 | HM Amla | Batter | 16 | 0 | 0 | 0 |
| 266 | HR Shokeen | Batter | 13 | 5 | 0 | 1 |
| 267 | HV Patel | All-rounder | 120 | 26 | 0 | 9 |
| 268 | I Malhotra | Batter | 1 | 0 | 0 | 0 |
| 269 | I Sharma | Bowler | 117 | 20 | 0 | 3 |
| 270 | I Udana | All-rounder | 10 | 3 | 0 | 0 |
| 271 | IC Pandey | Bowler | 25 | 6 | 0 | 0 |
| 272 | IC Porel | Batter | 1 | 0 | 0 | 0 |
| 273 | IK Pathan | All-rounder | 103 | 28 | 0 | 8 |
| 274 | Imran Tahir | Bowler | 59 | 8 | 0 | 0 |
| 275 | Iqbal Abdulla | Bowler | 49 | 12 | 0 | 5 |
| 276 | IR Jaggi | Batter | 7 | 2 | 0 | 0 |
| 277 | IS Sodhi | All-rounder | 8 | 0 | 0 | 0 |
| 278 | Ishan Kishan | WK-Batter | 122 | 61 | 6 | 13 |
| 279 | J Arunkumar | Batter | 3 | 0 | 0 | 0 |
| 280 | J Botha | Bowler | 34 | 16 | 0 | 3 |
| 281 | J Cox | WK-Batter | 0† | 0 | 0 | 0 |
| 282 | J Fraser-McGurk | Batter | 15 | 8 | 0 | 2 |
| 283 | J Little | Bowler | 11 | 5 | 0 | 0 |
| 284 | J Overton | All-rounder | 5 | 0 | 0 | 0 |
| 285 | J Suchith | Bowler | 22 | 17 | 0 | 3 |
| 286 | J Syed Mohammad | All-rounder | 11 | 1 | 0 | 2 |
| 287 | J Theron | Bowler | 10 | 1 | 0 | 3 |
| 288 | J Yadav | All-rounder | 20 | 7 | 0 | 0 |
| 289 | JA Duffy | Batter | 2 | 0 | 0 | 0 |
| 290 | JA Morkel | All-rounder | 90 | 17 | 0 | 6 |
| 291 | JA Richardson | Batter | 4 | 1 | 0 | 0 |
| 292 | Jalaj S Saxena | Batter | 1 | 0 | 0 | 0 |
| 293 | Jaskaran Singh | All-rounder | 8 | 0 | 0 | 0 |
| 294 | JC Archer | Bowler | 55 | 11 | 0 | 1 |
| 295 | JC Buttler | WK-Batter | 124 | 66 | 3 | 6 |
| 296 | JD Ryder | All-rounder | 29 | 10 | 0 | 0 |
| 297 | JD Unadkat | Bowler | 115 | 22 | 0 | 7 |
| 298 | JDP Oram | All-rounder | 18 | 7 | 0 | 2 |
| 299 | JDS Neesham | All-rounder | 14 | 2 | 0 | 0 |
| 300 | JE Root | Batter | 3 | 2 | 0 | 0 |
| 301 | JE Taylor | All-rounder | 5 | 0 | 0 | 0 |
| 302 | JEC Franklin | All-rounder | 20 | 6 | 0 | 0 |
| 303 | JG Bethell | Batter | 2 | 2 | 0 | 0 |
| 304 | JH Kallis | All-rounder | 98 | 30 | 0 | 6 |
| 305 | JJ Bumrah | Bowler | 148 | 14 | 0 | 4 |
| 306 | JJ Roy | Batter | 21 | 10 | 0 | 0 |
| 307 | JJ van der Wath | Batter | 3 | 0 | 0 | 0 |
| 308 | JL Denly | Batter | 1 | 0 | 0 | 0 |
| 309 | JL Pattinson | Bowler | 10 | 2 | 0 | 0 |
| 310 | JM Bairstow | WK-Batter | 52 | 29 | 4 | 3 |
| 311 | JM Kemp | Batter | 5 | 1 | 0 | 0 |
| 312 | JM Sharma | WK-Batter | 57 | 46 | 6 | 9 |
| 313 | JO Holder | All-rounder | 46 | 14 | 0 | 3 |
| 314 | Joginder Sharma | Bowler | 16 | 5 | 0 | 2 |
| 315 | JP Behrendorff | Bowler | 17 | 2 | 0 | 0 |
| 316 | JP Duminy | All-rounder | 83 | 30 | 0 | 3 |
| 317 | JP Faulkner | All-rounder | 60 | 16 | 0 | 8 |
| 318 | JP Inglis | Batter | 12 | 9 | 1 | 0 |
| 319 | JPR Scantlebury-Searles | Batter | 4 | 4 | 0 | 0 |
| 320 | JR Hazlewood | Bowler | 39 | 2 | 0 | 0 |
| 321 | JR Hopes | Bowler | 21 | 5 | 0 | 0 |
| 322 | JR Philippe | Batter | 5 | 0 | 0 | 0 |
| 323 | JW Hastings | Batter | 3 | 0 | 0 | 0 |
| 324 | K Chouhan | All-rounder | 0† | 0 | 0 | 0 |
| 325 | K Fuletra | All-rounder | 0† | 0 | 0 | 0 |
| 326 | K Goel | Batter | 22 | 9 | 0 | 1 |
| 327 | K Gowtham | Bowler | 36 | 21 | 0 | 0 |
| 328 | K Kartikeya | Bowler | 16 | 1 | 0 | 0 |
| 329 | K Khejroliya | Bowler | 8 | 1 | 0 | 0 |
| 330 | K Mendis | All-rounder | 0† | 0 | 0 | 0 |
| 331 | K Rabada | Bowler | 87 | 26 | 0 | 3 |
| 332 | K Santokie | Batter | 2 | 1 | 0 | 0 |
| 333 | K Upadhyay | Batter | 3 | 1 | 0 | 0 |
| 334 | K Yadav | Bowler | 3 | 0 | 0 | 0 |
| 335 | KA Jamieson | Bowler | 13 | 2 | 0 | 0 |
| 336 | KA Maharaj | Batter | 2 | 1 | 0 | 0 |
| 337 | KA Pollard | All-rounder | 189 | 97 | 0 | 13 |
| 338 | KAJ Roach | Batter | 2 | 1 | 0 | 0 |
| 339 | Kamran Akmal | WK-Batter | 6 | 5 | 4 | 2 |
| 340 | Kamran Khan | All-rounder | 9 | 4 | 0 | 2 |
| 341 | Karanveer Singh | Bowler | 9 | 2 | 0 | 0 |
| 342 | Karim Janat | Batter | 1 | 0 | 0 | 0 |
| 343 | Kartik Sharma | Batter | 3 | 0 | 0 | 0 |
| 344 | Kartik Tyagi | Bowler | 23 | 3 | 0 | 0 |
| 345 | KB Arun Karthik | Batter | 17 | 12 | 2 | 4 |
| 346 | KC Cariappa | All-rounder | 11 | 2 | 0 | 0 |
| 347 | KC Sangakkara | WK-Batter | 71 | 45 | 9 | 11 |
| 348 | KD Karthik | WK-Batter | 257 | 145 | 37 | 46 |
| 349 | KH Devdhar | Batter | 1 | 0 | 1 | 0 |
| 350 | KH Pandya | All-rounder | 144 | 47 | 0 | 2 |
| 351 | KJ Abbott | Batter | 5 | 0 | 0 | 0 |
| 352 | KK Ahmed | Bowler | 74 | 5 | 0 | 2 |
| 353 | KK Cooper | Bowler | 25 | 11 | 0 | 4 |
| 354 | KK Nair | Batter | 84 | 28 | 0 | 9 |
| 355 | KL Nagarkoti | Batter | 12 | 9 | 0 | 0 |
| 356 | KL Rahul | WK-Batter | 149 | 82 | 7 | 10 |
| 357 | KM Asif | All-rounder | 7 | 1 | 0 | 0 |
| 358 | KM Jadhav | WK-Batter | 95 | 31 | 7 | 7 |
| 359 | KMA Paul | All-rounder | 8 | 6 | 0 | 0 |
| 360 | KMDN Kulasekara | Batter | 5 | 3 | 0 | 1 |
| 361 | KP Appanna | All-rounder | 13 | 3 | 0 | 3 |
| 362 | KP Pietersen | All-rounder | 36 | 12 | 0 | 2 |
| 363 | KR Mayers | Batter | 13 | 2 | 0 | 0 |
| 364 | KR Sen | Bowler | 12 | 3 | 0 | 0 |
| 365 | KS Bharat | WK-Batter | 10 | 5 | 1 | 0 |
| 366 | KS Rathore | Batter | 1 | 0 | 0 | 0 |
| 367 | KS Sharma | Batter | 3 | 0 | 0 | 0 |
| 368 | KS Williamson | Batter | 79 | 40 | 0 | 1 |
| 369 | KT Maphaka | Batter | 4 | 2 | 0 | 0 |
| 370 | Kuldeep Yadav | Bowler | 102 | 14 | 0 | 3 |
| 371 | Kumar Kushagra | WK-Batter | 5 | 2 | 0 | 0 |
| 372 | KV Sharma | Bowler | 90 | 18 | 0 | 2 |
| 373 | KW Richardson | Bowler | 15 | 5 | 0 | 1 |
| 374 | L Ablish | Batter | 3 | 0 | 0 | 0 |
| 375 | L Balaji | Bowler | 73 | 9 | 0 | 4 |
| 376 | L Ngidi | Bowler | 19 | 1 | 0 | 0 |
| 377 | L Pretorius | Batter | 0† | 0 | 0 | 0 |
| 378 | L Ronchi | Batter | 5 | 4 | 0 | 2 |
| 379 | L Wood | Bowler | 2 | 0 | 0 | 0 |
| 380 | LA Carseldine | Batter | 5 | 4 | 0 | 0 |
| 381 | LA Pomersbach | Batter | 17 | 8 | 0 | 0 |
| 382 | Lalit Yadav | All-rounder | 27 | 18 | 0 | 2 |
| 383 | LB Williams | Batter | 2 | 1 | 0 | 0 |
| 384 | LE Plunkett | Bowler | 7 | 2 | 0 | 0 |
| 385 | LH Ferguson | Bowler | 49 | 9 | 0 | 4 |
| 386 | LI Meriwala | Batter | 1 | 0 | 0 | 0 |
| 387 | Liton Das | Batter | 1 | 0 | 0 | 0 |
| 388 | LJ Wright | Batter | 7 | 2 | 0 | 2 |
| 389 | LMP Simmons | Batter | 29 | 10 | 0 | 1 |
| 390 | LPC Silva | Batter | 3 | 3 | 0 | 1 |
| 391 | LR Shukla | Bowler | 47 | 15 | 0 | 6 |
| 392 | LRPL Taylor | Batter | 55 | 18 | 0 | 1 |
| 393 | LS Livingstone | All-rounder | 50 | 22 | 0 | 0 |
| 394 | M Ashwin | Bowler | 44 | 7 | 0 | 0 |
| 395 | M de Lange | Batter | 5 | 0 | 0 | 0 |
| 396 | M Izhar | Bowler | 0† | 0 | 0 | 0 |
| 397 | M Jansen | All-rounder | 39 | 20 | 0 | 0 |
| 398 | M Kaif | Batter | 29 | 16 | 0 | 1 |
| 399 | M Kartik | Bowler | 56 | 18 | 0 | 3 |
| 400 | M Klinger | Batter | 4 | 0 | 0 | 0 |
| 401 | M Manhas | Batter | 55 | 20 | 0 | 2 |
| 402 | M Markande | Bowler | 39 | 8 | 0 | 0 |
| 403 | M Morkel | Bowler | 70 | 11 | 0 | 4 |
| 404 | M Muralitharan | Bowler | 66 | 14 | 0 | 3 |
| 405 | M Ntini | Bowler | 9 | 1 | 0 | 2 |
| 406 | M Pathirana | Bowler | 32 | 9 | 0 | 0 |
| 407 | M Prasidh Krishna | Bowler | 69 | 14 | 0 | 1 |
| 408 | M Rawat | Batter | 18 | 16 | 2 | 9 |
| 409 | M Rawat | All-rounder | 0† | 0 | 0 | 0 |
| 410 | M Shahrukh Khan | All-rounder | 58 | 25 | 0 | 1 |
| 411 | M Siddharth | Bowler | 6 | 2 | 0 | 0 |
| 412 | M Theekshana | Bowler | 38 | 4 | 0 | 2 |
| 413 | M Tiwari | Batter | 2 | 2 | 0 | 0 |
| 414 | M Vijay | Batter | 106 | 48 | 0 | 1 |
| 415 | M Vohra | Batter | 56 | 13 | 0 | 1 |
| 416 | M Yadav | All-rounder | 0† | 0 | 0 | 0 |
| 417 | MA Agarwal | Batter | 130 | 59 | 0 | 2 |
| 418 | MA Khote | Batter | 4 | 0 | 0 | 0 |
| 419 | MA Starc | Bowler | 52 | 28 | 0 | 3 |
| 420 | MA Wood | Bowler | 5 | 3 | 0 | 0 |
| 421 | Mandeep Singh | Batter | 111 | 38 | 0 | 2 |
| 422 | Mashrafe Mortaza | Batter | 1 | 0 | 0 | 1 |
| 423 | Mayank Dagar | Bowler | 8 | 3 | 0 | 0 |
| 424 | MB Parmar | Batter | 1 | 0 | 0 | 0 |
| 425 | MC Henriques | All-rounder | 62 | 29 | 0 | 1 |
| 426 | MC Juneja | Batter | 7 | 0 | 0 | 0 |
| 427 | MD Choudhary | Batter | 2 | 0 | 0 | 0 |
| 428 | MD Mishra | Batter | 18 | 1 | 0 | 0 |
| 429 | MD Shanaka | All-rounder | 3 | 2 | 0 | 0 |
| 430 | MDKJ Perera | Batter | 2 | 0 | 0 | 0 |
| 431 | MEK Hussey | Batter | 59 | 26 | 0 | 1 |
| 432 | MF Maharoof | Bowler | 20 | 4 | 0 | 2 |
| 433 | MG Bracewell | All-rounder | 5 | 1 | 0 | 0 |
| 434 | MG Johnson | Bowler | 54 | 15 | 0 | 4 |
| 435 | MG Neser | Batter | 1 | 0 | 0 | 0 |
| 436 | Misbah-ul-Haq | Batter | 8 | 1 | 0 | 0 |
| 437 | MJ Clarke | Batter | 6 | 1 | 0 | 0 |
| 438 | MJ Guptill | Batter | 13 | 7 | 0 | 0 |
| 439 | MJ Henry | Bowler | 9 | 1 | 0 | 0 |
| 440 | MJ Lumb | Batter | 12 | 5 | 0 | 0 |
| 441 | MJ McClenaghan | Bowler | 56 | 1 | 0 | 1 |
| 442 | MJ Owen | Batter | 1 | 2 | 0 | 0 |
| 443 | MJ Santner | All-rounder | 32 | 13 | 0 | 3 |
| 444 | MJ Suthar | Batter | 1 | 0 | 0 | 0 |
| 445 | MK Lomror | Batter | 40 | 12 | 0 | 0 |
| 446 | MK Pandey | Batter | 174 | 86 | 0 | 13 |
| 447 | MK Tiwary | Batter | 98 | 47 | 0 | 3 |
| 448 | ML Hayden | Batter | 32 | 11 | 0 | 3 |
| 449 | MM Ali | All-rounder | 73 | 22 | 0 | 2 |
| 450 | MM Patel | Bowler | 63 | 12 | 0 | 2 |
| 451 | MM Sharma | Bowler | 120 | 25 | 0 | 6 |
| 452 | MN Samuels | All-rounder | 15 | 2 | 0 | 0 |
| 453 | MN van Wyk | Batter | 5 | 7 | 0 | 0 |
| 454 | Mohammad Ashraful | Batter | 1 | 2 | 0 | 0 |
| 455 | Mohammad Asif | All-rounder | 8 | 0 | 0 | 0 |
| 456 | Mohammad Hafeez | Batter | 8 | 1 | 0 | 1 |
| 457 | Mohammad Nabi | All-rounder | 24 | 18 | 0 | 2 |
| 458 | Mohammed Shami | Bowler | 121 | 19 | 0 | 10 |
| 459 | Mohammed Siraj | Bowler | 111 | 34 | 0 | 2 |
| 460 | Mohit Rathee | Batter | 1 | 0 | 0 | 0 |
| 461 | Mohsin Khan | Bowler | 25 | 3 | 0 | 0 |
| 462 | Monu Kumar | Batter | 1 | 0 | 0 | 0 |
| 463 | MP Breetzke | Batter | 1 | 0 | 0 | 0 |
| 464 | MP Stoinis | All-rounder | 113 | 25 | 0 | 3 |
| 465 | MP Yadav | Bowler | 6 | 3 | 0 | 0 |
| 466 | MR Marsh | All-rounder | 57 | 11 | 0 | 1 |
| 467 | MS Bhandage | Batter | 1 | 2 | 0 | 0 |
| 468 | MS Bisla | WK-Batter | 39 | 20 | 7 | 10 |
| 469 | MS Dhoni | WK-Batter | 277 | 158 | 47 | 53 |
| 470 | MS Gony | Bowler | 44 | 4 | 0 | 2 |
| 471 | MS Wade | WK-Batter | 15 | 8 | 1 | 1 |
| 472 | Mujeeb Ur Rahman | Bowler | 20 | 2 | 0 | 0 |
| 473 | Mukesh Choudhary | Bowler | 16 | 3 | 0 | 0 |
| 474 | Mukesh Kumar | Bowler | 35 | 7 | 0 | 4 |
| 475 | Musheer Khan | All-rounder | 1 | 0 | 0 | 0 |
| 476 | Mustafizur Rahman | Bowler | 60 | 5 | 0 | 0 |
| 477 | MV Boucher | WK-Batter | 31 | 14 | 3 | 7 |
| 478 | MW Short | All-rounder | 7 | 5 | 0 | 0 |
| 479 | N Burger | Bowler | 8 | 2 | 0 | 0 |
| 480 | N Jagadeesan | Batter | 13 | 1 | 0 | 0 |
| 481 | N Pooran | WK-Batter | 92 | 40 | 4 | 5 |
| 482 | N Rana | All-rounder | 121 | 29 | 0 | 1 |
| 483 | N Saini | Bowler | 10 | 11 | 2 | 2 |
| 484 | N Sindhu | All-rounder | 0† | 0 | 0 | 0 |
| 485 | N Thushara | Bowler | 8 | 1 | 0 | 1 |
| 486 | N Tiwari | Bowler | 0† | 0 | 0 | 0 |
| 487 | N Wadhera | Batter | 40 | 14 | 0 | 1 |
| 488 | Naman Dhir | All-rounder | 26 | 15 | 0 | 1 |
| 489 | Navdeep Saini | Bowler | 33 | 8 | 0 | 0 |
| 490 | Naveen-ul-Haq | Bowler | 18 | 6 | 0 | 1 |
| 491 | NB Singh | Batter | 2 | 0 | 0 | 0 |
| 492 | ND Doshi | Batter | 4 | 0 | 0 | 0 |
| 493 | Nithish Kumar Reddy | All-rounder | 31 | 13 | 0 | 2 |
| 494 | NJ Maddinson | Batter | 3 | 1 | 0 | 0 |
| 495 | NJ Rimmington | Batter | 1 | 0 | 0 | 0 |
| 496 | NK Patel | Batter | 9 | 6 | 0 | 0 |
| 497 | NL McCullum | Batter | 2 | 1 | 0 | 1 |
| 498 | NLTC Perera | All-rounder | 37 | 13 | 0 | 6 |
| 499 | NM Coulter-Nile | Bowler | 39 | 10 | 0 | 2 |
| 500 | Noor Ahmad | Bowler | 40 | 10 | 0 | 1 |
| 501 | NS Naik | Batter | 4 | 3 | 0 | 1 |
| 502 | NT Ellis | Bowler | 17 | 2 | 0 | 0 |
| 503 | NV Ojha | WK-Batter | 113 | 65 | 10 | 25 |
| 504 | O Tarmale | Bowler | 0† | 0 | 0 | 0 |
| 505 | O Thomas | Batter | 4 | 1 | 0 | 0 |
| 506 | OA Shah | Batter | 23 | 7 | 0 | 1 |
| 507 | OC McCoy | Bowler | 8 | 1 | 0 | 0 |
| 508 | OF Smith | All-rounder | 6 | 2 | 0 | 1 |
| 509 | P Amarnath | Bowler | 6 | 2 | 0 | 0 |
| 510 | P Avinash | Batter | 0† | 0 | 0 | 0 |
| 511 | P Awana | Bowler | 33 | 4 | 0 | 1 |
| 512 | P Chopra | Batter | 2 | 1 | 0 | 0 |
| 513 | P Dharmani | Batter | 1 | 0 | 0 | 0 |
| 514 | P Dogra | Batter | 13 | 5 | 0 | 1 |
| 515 | P Dubey | Batter | 5 | 2 | 0 | 0 |
| 516 | P Hinge | Bowler | 0† | 0 | 0 | 0 |
| 517 | P Kumar | Bowler | 119 | 13 | 0 | 7 |
| 518 | P Negi | All-rounder | 50 | 16 | 0 | 5 |
| 519 | P Nissanka | Batter | 3 | 0 | 0 | 0 |
| 520 | P Parameswaran | All-rounder | 8 | 0 | 0 | 0 |
| 521 | P Prasanth | Batter | 1 | 0 | 0 | 0 |
| 522 | P Ray Barman | Batter | 1 | 0 | 0 | 0 |
| 523 | P Sahu | Batter | 5 | 0 | 0 | 0 |
| 524 | P Simran Singh | Batter | 55 | 9 | 1 | 0 |
| 525 | P Suyal | Batter | 5 | 1 | 0 | 0 |
| 526 | PA Patel | WK-Batter | 139 | 69 | 16 | 26 |
| 527 | PA Reddy | Batter | 12 | 2 | 0 | 1 |
| 528 | Pankaj Singh | Bowler | 17 | 2 | 0 | 0 |
| 529 | Parvez Rasool | Batter | 11 | 3 | 0 | 0 |
| 530 | PBB Rajapaksa | Batter | 13 | 4 | 0 | 0 |
| 531 | PC Valthaty | All-rounder | 23 | 3 | 0 | 0 |
| 532 | PD Collingwood | Batter | 8 | 3 | 0 | 0 |
| 533 | PD Salt | WK-Batter | 36 | 30 | 0 | 6 |
| 534 | PH Solanki | Batter | 2 | 0 | 0 | 0 |
| 535 | PHKD Mendis | All-rounder | 5 | 1 | 0 | 0 |
| 536 | PJ Cummins | Bowler | 72 | 20 | 0 | 2 |
| 537 | PJ Sangwan | Bowler | 42 | 8 | 0 | 3 |
| 538 | PK Garg | Batter | 23 | 11 | 0 | 0 |
| 539 | PM Sarvesh Kumar | Batter | 2 | 0 | 0 | 0 |
| 540 | PN Mankad | Batter | 6 | 6 | 0 | 0 |
| 541 | PP Chawla | Bowler | 192 | 37 | 0 | 10 |
| 542 | PP Ojha | Bowler | 92 | 14 | 0 | 3 |
| 543 | PP Shaw | Batter | 79 | 18 | 0 | 0 |
| 544 | PR Shah | WK-Batter | 16 | 10 | 3 | 3 |
| 545 | PR Veer | Batter | 2 | 0 | 0 | 0 |
| 546 | Prince Yadav | Bowler | 8 | 3 | 0 | 2 |
| 547 | Priyansh Arya | All-rounder | 20 | 8 | 0 | 0 |
| 548 | PSP Handscomb | Batter | 2 | 0 | 0 | 0 |
| 549 | PV Tambe | Bowler | 33 | 1 | 0 | 0 |
| 550 | PVD Chameera | Bowler | 20 | 3 | 0 | 1 |
| 551 | PVSN Raju | Batter | 2 | 1 | 0 | 0 |
| 552 | PWA Mulder | Batter | 1 | 1 | 0 | 0 |
| 553 | PWH de Silva | Bowler | 37 | 3 | 0 | 3 |
| 554 | Q de Kock | WK-Batter | 115 | 73 | 16 | 12 |
| 555 | R Ashwin | Bowler | 219 | 44 | 0 | 9 |
| 556 | R Bhatia | Bowler | 95 | 23 | 0 | 8 |
| 557 | R Bishnoi | Bowler | 3 | 1 | 0 | 0 |
| 558 | R Dar | Bowler | 0† | 0 | 0 | 0 |
| 559 | R Dhawan | Bowler | 39 | 13 | 0 | 3 |
| 560 | R Dravid | Batter | 89 | 18 | 0 | 8 |
| 561 | R Ghosh | All-rounder | 0† | 0 | 0 | 0 |
| 562 | R Goyal | Batter | 1 | 1 | 0 | 0 |
| 563 | R McLaren | Bowler | 18 | 5 | 0 | 1 |
| 564 | R Minz | WK-Batter | 2 | 0 | 0 | 0 |
| 565 | R Ninan | Batter | 2 | 1 | 0 | 0 |
| 566 | R Parag | All-rounder | 86 | 45 | 0 | 3 |
| 567 | R Powell | Batter | 29 | 20 | 0 | 0 |
| 568 | R Rampaul | Bowler | 12 | 4 | 0 | 0 |
| 569 | R Ravindra | All-rounder | 18 | 10 | 0 | 1 |
| 570 | R Sai Kishore | All-rounder | 25 | 8 | 0 | 0 |
| 571 | R Sanjay Yadav | Batter | 1 | 0 | 0 | 0 |
| 572 | R Sathish | Batter | 34 | 8 | 0 | 7 |
| 573 | R Sharma | Bowler | 44 | 10 | 0 | 1 |
| 574 | R Sharma | Bowler | 0† | 0 | 0 | 0 |
| 575 | R Shepherd | All-rounder | 20 | 4 | 0 | 1 |
| 576 | R Shukla | Bowler | 7 | 3 | 0 | 3 |
| 577 | R Singh | Batter | 0† | 0 | 0 | 0 |
| 578 | R Tewatia | All-rounder | 111 | 46 | 0 | 2 |
| 579 | R Vinay Kumar | Bowler | 104 | 32 | 0 | 13 |
| 580 | RA Bawa | All-rounder | 5 | 3 | 0 | 1 |
| 581 | RA Jadeja | All-rounder | 256 | 104 | 0 | 25 |
| 582 | RA Shaikh | Batter | 1 | 0 | 0 | 0 |
| 583 | RA Tripathi | Batter | 100 | 34 | 0 | 1 |
| 584 | Rahmanullah Gurbaz | Batter | 18 | 17 | 0 | 1 |
| 585 | Ramandeep Singh | All-rounder | 33 | 17 | 0 | 2 |
| 586 | Rashid Khan | Bowler | 139 | 48 | 0 | 6 |
| 587 | Rasikh Salam | All-rounder | 13 | 3 | 0 | 0 |
| 588 | Ravi Bishnoi | Bowler | 80 | 25 | 0 | 4 |
| 589 | RD Chahar | Bowler | 80 | 21 | 0 | 0 |
| 590 | RD Gaikwad | Batter | 74 | 39 | 0 | 1 |
| 591 | RD Rickelton | WK-Batter | 17 | 12 | 5 | 4 |
| 592 | RE Levi | Batter | 6 | 2 | 0 | 0 |
| 593 | RE van der Merwe | Bowler | 21 | 6 | 0 | 2 |
| 594 | RG More | Batter | 2 | 1 | 0 | 0 |
| 595 | RG Sharma | Batter | 275 | 101 | 0 | 11 |
| 596 | RJ Gleeson | Batter | 3 | 0 | 0 | 0 |
| 597 | RJ Harris | Bowler | 37 | 18 | 0 | 0 |
| 598 | RJ Peterson | Batter | 5 | 1 | 0 | 0 |
| 599 | RJ Quiney | Batter | 7 | 2 | 0 | 0 |
| 600 | RJW Topley | Bowler | 6 | 2 | 0 | 0 |
| 601 | RK Bhui | Batter | 4 | 0 | 0 | 0 |
| 602 | RK Singh | Batter | 61 | 44 | 0 | 2 |
| 603 | RM Patidar | Batter | 44 | 12 | 0 | 0 |
| 604 | RN ten Doeschate | Batter | 29 | 7 | 0 | 3 |
| 605 | RP Meredith | Bowler | 18 | 2 | 0 | 0 |
| 606 | RP Singh | Bowler | 82 | 27 | 0 | 8 |
| 607 | RR Bhatkal | Batter | 1 | 1 | 0 | 0 |
| 608 | RR Bose | Batter | 1 | 0 | 0 | 0 |
| 609 | RR Pant | WK-Batter | 127 | 83 | 24 | 7 |
| 610 | RR Powar | Bowler | 27 | 5 | 0 | 0 |
| 611 | RR Raje | All-rounder | 10 | 3 | 0 | 1 |
| 612 | RR Rossouw | Batter | 22 | 10 | 0 | 0 |
| 613 | RR Sarwan | Batter | 4 | 1 | 0 | 0 |
| 614 | RS Bopara | All-rounder | 24 | 4 | 0 | 0 |
| 615 | RS Gavaskar | Batter | 2 | 0 | 0 | 0 |
| 616 | RS Hangargekar | Batter | 2 | 0 | 0 | 0 |
| 617 | RS Sodhi | Batter | 3 | 2 | 0 | 0 |
| 618 | RT Ponting | Batter | 10 | 4 | 0 | 0 |
| 619 | RV Gomez | Batter | 13 | 3 | 0 | 1 |
| 620 | RV Patel | Batter | 9 | 3 | 0 | 0 |
| 621 | RV Pawar | Batter | 1 | 0 | 0 | 0 |
| 622 | RV Uthappa | Batter | 205 | 92 | 32 | 45 |
| 623 | RW Price | Batter | 1 | 0 | 0 | 0 |
| 624 | S Ahamad | All-rounder | 0† | 0 | 0 | 0 |
| 625 | S Anirudha | Batter | 20 | 11 | 0 | 2 |
| 626 | S Aravind | Bowler | 38 | 5 | 0 | 1 |
| 627 | S Arora | Batter | 2 | 0 | 0 | 0 |
| 628 | S Badree | Bowler | 12 | 2 | 0 | 0 |
| 629 | S Badrinath | Batter | 94 | 16 | 0 | 5 |
| 630 | S Chanderpaul | Batter | 3 | 0 | 0 | 0 |
| 631 | S Deswal | All-rounder | 0† | 0 | 0 | 0 |
| 632 | S Dhawan | Batter | 222 | 100 | 0 | 2 |
| 633 | S Dube | All-rounder | 82 | 24 | 0 | 0 |
| 634 | S Dubey | Bowler | 0† | 0 | 0 | 0 |
| 635 | S Gopal | Bowler | 52 | 5 | 0 | 0 |
| 636 | S Hussain | Bowler | 0† | 0 | 0 | 0 |
| 637 | S Joseph | Batter | 1 | 0 | 0 | 0 |
| 638 | S Kaul | Bowler | 55 | 8 | 0 | 0 |
| 639 | S Kaushik | All-rounder | 10 | 0 | 0 | 0 |
| 640 | S Khan | All-rounder | 0† | 0 | 0 | 0 |
| 641 | S Ladda | Bowler | 9 | 1 | 0 | 2 |
| 642 | S Lamichhane | Bowler | 9 | 1 | 0 | 0 |
| 643 | S Midhun | Batter | 1 | 1 | 0 | 0 |
| 644 | S Mishra | Bowler | 0† | 0 | 0 | 0 |
| 645 | S Nadeem | Bowler | 72 | 11 | 0 | 4 |
| 646 | S Narwal | Bowler | 7 | 1 | 0 | 1 |
| 647 | S Parakh | Batter | 0† | 0 | 0 | 0 |
| 648 | S Rana | Batter | 11 | 3 | 0 | 0 |
| 649 | S Randiv | All-rounder | 8 | 2 | 0 | 1 |
| 650 | S Ranjan | All-rounder | 0† | 0 | 0 | 0 |
| 651 | S Ravichandran | Batter | 0† | 0 | 0 | 0 |
| 652 | S Sandeep Warrier | Bowler | 10 | 1 | 0 | 0 |
| 653 | S Sohal | Batter | 22 | 2 | 0 | 0 |
| 654 | S Sreesanth | Bowler | 44 | 3 | 0 | 0 |
| 655 | S Sriram | Batter | 2 | 0 | 0 | 0 |
| 656 | S Tyagi | All-rounder | 14 | 3 | 0 | 0 |
| 657 | S Vidyut | Batter | 9 | 1 | 0 | 0 |
| 658 | SA Abbott | Batter | 3 | 0 | 0 | 0 |
| 659 | SA Asnodkar | Batter | 20 | 6 | 0 | 1 |
| 660 | SA Yadav | Batter | 169 | 74 | 0 | 2 |
| 661 | Sachin Baby | Batter | 20 | 5 | 0 | 3 |
| 662 | Salman Butt | Batter | 7 | 2 | 0 | 0 |
| 663 | Sameer Rizvi | All-rounder | 17 | 6 | 0 | 0 |
| 664 | Sandeep Sharma | Bowler | 139 | 19 | 0 | 5 |
| 665 | Sanvir Singh | Batter | 6 | 3 | 0 | 0 |
| 666 | Saurav Chauhan | Batter | 3 | 0 | 0 | 0 |
| 667 | SB Bangar | Batter | 12 | 2 | 0 | 2 |
| 668 | SB Dubey | Batter | 13 | 1 | 0 | 1 |
| 669 | SB Jakati | Bowler | 59 | 19 | 0 | 4 |
| 670 | SB Joshi | Batter | 4 | 0 | 0 | 0 |
| 671 | SB Styris | All-rounder | 12 | 2 | 0 | 2 |
| 672 | SB Wagh | Bowler | 8 | 1 | 0 | 1 |
| 673 | SC Ganguly | Batter | 59 | 22 | 0 | 1 |
| 674 | SC Kuggeleijn | Batter | 2 | 0 | 0 | 0 |
| 675 | SD Chitnis | Batter | 11 | 2 | 0 | 0 |
| 676 | SD Hope | WK-Batter | 9 | 6 | 0 | 1 |
| 677 | SD Lad | Batter | 1 | 0 | 0 | 0 |
| 678 | SE Bond | All-rounder | 8 | 0 | 0 | 0 |
| 679 | SE Marsh | Batter | 71 | 26 | 0 | 3 |
| 680 | SE Rutherford | Batter | 26 | 7 | 0 | 0 |
| 681 | Sediqullah Atal | Batter | 1 | 0 | 0 | 0 |
| 682 | SH Johnson | Batter | 9 | 2 | 0 | 0 |
| 683 | Shahbaz Ahmed | All-rounder | 59 | 20 | 0 | 2 |
| 684 | Shahid Afridi | All-rounder | 10 | 4 | 0 | 0 |
| 685 | Shakib Al Hasan | All-rounder | 71 | 13 | 0 | 7 |
| 686 | Shashank Singh | Batter | 45 | 17 | 0 | 1 |
| 687 | Shivam Mavi | Bowler | 32 | 17 | 0 | 1 |
| 688 | Shivam Sharma | Batter | 5 | 1 | 0 | 0 |
| 689 | Shivam Singh | Batter | 1 | 2 | 0 | 0 |
| 690 | Shivang Kumar | All-rounder | 2 | 0 | 0 | 1 |
| 691 | Shoaib Ahmed | Bowler | 8 | 4 | 0 | 0 |
| 692 | Shoaib Akhtar | Batter | 3 | 0 | 0 | 0 |
| 693 | Shoaib Malik | Batter | 7 | 6 | 0 | 1 |
| 694 | Shubman Gill | Batter | 120 | 48 | 0 | 0 |
| 695 | Sikandar Raza | Batter | 9 | 5 | 0 | 0 |
| 696 | Simarjeet Singh | Bowler | 14 | 3 | 0 | 1 |
| 697 | SJ Srivastava | Bowler | 14 | 2 | 0 | 0 |
| 698 | SK Raina | Batter | 204 | 106 | 0 | 13 |
| 699 | SK Rasheed | Batter | 5 | 2 | 0 | 0 |
| 700 | SK Trivedi | Bowler | 76 | 12 | 0 | 4 |
| 701 | SK Warne | Bowler | 55 | 11 | 0 | 3 |
| 702 | SL Malinga | Bowler | 122 | 15 | 0 | 6 |
| 703 | SM Boland | Batter | 2 | 0 | 0 | 0 |
| 704 | SM Curran | All-rounder | 64 | 24 | 0 | 1 |
| 705 | SM Harwood | Batter | 3 | 2 | 0 | 0 |
| 706 | SM Katich | Batter | 11 | 2 | 0 | 2 |
| 707 | SM Pollock | All-rounder | 13 | 2 | 0 | 1 |
| 708 | SMSM Senanayake | All-rounder | 8 | 2 | 0 | 0 |
| 709 | SN Khan | Batter | 53 | 11 | 0 | 3 |
| 710 | SN Thakur | All-rounder | 108 | 33 | 0 | 3 |
| 711 | SO Hetmyer | Batter | 89 | 47 | 0 | 5 |
| 712 | Sohail Tanvir | Bowler | 11 | 4 | 0 | 3 |
| 713 | SP Fleming | Batter | 10 | 2 | 0 | 0 |
| 714 | SP Goswami | WK-Batter | 31 | 18 | 7 | 8 |
| 715 | SP Jackson | Batter | 9 | 7 | 2 | 2 |
| 716 | SP Narine | All-rounder | 190 | 27 | 0 | 6 |
| 717 | SPD Smith | Batter | 103 | 54 | 0 | 10 |
| 718 | SR Tendulkar | Batter | 78 | 23 | 0 | 3 |
| 719 | SR Watson | All-rounder | 145 | 38 | 0 | 9 |
| 720 | SS Agarwal | Batter | 1 | 0 | 0 | 0 |
| 721 | SS Cottrell | Bowler | 6 | 0 | 0 | 0 |
| 722 | SS Iyer | Batter | 136 | 57 | 0 | 9 |
| 723 | SS Mundhe | Batter | 1 | 0 | 0 | 0 |
| 724 | SS Prabhudessai | Batter | 11 | 10 | 0 | 3 |
| 725 | SS Sarkar | Batter | 2 | 0 | 0 | 0 |
| 726 | SS Shaikh | Batter | 2 | 2 | 0 | 0 |
| 727 | SS Tiwary | Batter | 92 | 25 | 0 | 5 |
| 728 | SSB Magala | Batter | 2 | 1 | 0 | 0 |
| 729 | ST Jayasuriya | All-rounder | 30 | 4 | 0 | 5 |
| 730 | STR Binny | All-rounder | 95 | 19 | 0 | 5 |
| 731 | Sumit Kumar | Batter | 4 | 1 | 0 | 2 |
| 732 | Sunny Gupta | Batter | 1 | 0 | 0 | 0 |
| 733 | Sunny Singh | Batter | 6 | 1 | 0 | 0 |
| 734 | Suryansh Shedge | All-rounder | 5 | 1 | 0 | 0 |
| 735 | Suyash Sharma | Bowler | 29 | 2 | 0 | 1 |
| 736 | SV Samson | WK-Batter | 179 | 86 | 17 | 27 |
| 737 | SW Billings | Batter | 30 | 19 | 1 | 1 |
| 738 | SW Tait | Bowler | 21 | 5 | 0 | 1 |
| 739 | Swapnil Singh | All-rounder | 14 | 2 | 0 | 1 |
| 740 | SZ Mulani | Batter | 2 | 0 | 0 | 0 |
| 741 | T Banton | WK-Batter | 2 | 0 | 0 | 0 |
| 742 | T Henderson | Batter | 2 | 0 | 0 | 0 |
| 743 | T Kohler-Cadmore | Batter | 3 | 1 | 0 | 0 |
| 744 | T Kohli | Batter | 4 | 5 | 0 | 0 |
| 745 | T Mishra | Batter | 1 | 1 | 0 | 0 |
| 746 | T Natarajan | Bowler | 67 | 8 | 0 | 4 |
| 747 | T Shamsi | Batter | 5 | 0 | 0 | 0 |
| 748 | T Singh | Batter | 0† | 0 | 0 | 0 |
| 749 | T Stubbs | Batter | 36 | 20 | 1 | 1 |
| 750 | T Taibu | Batter | 3 | 1 | 0 | 0 |
| 751 | T Thushara | All-rounder | 6 | 3 | 0 | 1 |
| 752 | T Vijay | All-rounder | 0† | 0 | 0 | 0 |
| 753 | TA Boult | Bowler | 121 | 32 | 0 | 3 |
| 754 | Tanush Kotian | Batter | 1 | 0 | 0 | 1 |
| 755 | TD Paine | Batter | 2 | 0 | 0 | 0 |
| 756 | Tejas Baroka | Batter | 1 | 0 | 0 | 0 |
| 757 | TG Southee | Bowler | 54 | 21 | 0 | 2 |
| 758 | TH David | Batter | 52 | 29 | 0 | 4 |
| 759 | Tilak Varma | Batter | 57 | 37 | 0 | 4 |
| 760 | TK Curran | Bowler | 13 | 2 | 0 | 0 |
| 761 | TL Seifert | WK-Batter | 3 | 1 | 0 | 0 |
| 762 | TL Suman | Batter | 43 | 10 | 0 | 5 |
| 763 | TM Dilshan | All-rounder | 51 | 21 | 0 | 3 |
| 764 | TM Head | Batter | 41 | 6 | 0 | 0 |
| 765 | TM Srivastava | Batter | 7 | 2 | 0 | 2 |
| 766 | TP Sudhindra | Batter | 3 | 0 | 0 | 0 |
| 767 | TR Birt | Batter | 5 | 0 | 0 | 0 |
| 768 | TS Mills | Bowler | 10 | 1 | 0 | 0 |
| 769 | TU Deshpande | Bowler | 48 | 9 | 0 | 0 |
| 770 | U Kaul | Batter | 5 | 2 | 0 | 3 |
| 771 | UA Birla | Batter | 2 | 1 | 0 | 0 |
| 772 | UBT Chand | Batter | 21 | 9 | 0 | 0 |
| 773 | Umar Gul | Bowler | 6 | 0 | 0 | 1 |
| 774 | Umran Malik | Bowler | 26 | 4 | 0 | 2 |
| 775 | Urvil Patel | Batter | 3 | 2 | 0 | 0 |
| 776 | UT Khawaja | Batter | 6 | 1 | 0 | 0 |
| 777 | UT Yadav | Bowler | 148 | 36 | 0 | 4 |
| 778 | V Chakaravarthy | Bowler | 0† | 0 | 0 | 0 |
| 779 | V Kaverappa | Batter | 1 | 0 | 0 | 0 |
| 780 | V Kohli | Batter | 268 | 119 | 0 | 20 |
| 781 | V Malhotra | All-rounder | 0† | 0 | 0 | 0 |
| 782 | V Nigam | All-rounder | 17 | 3 | 0 | 2 |
| 783 | V Nishad | Bowler | 0† | 0 | 0 | 0 |
| 784 | V Ostwal | All-rounder | 0† | 0 | 0 | 0 |
| 785 | V Pratap Singh | All-rounder | 9 | 0 | 0 | 0 |
| 786 | V Puthur | Batter | 5 | 1 | 0 | 0 |
| 787 | V Sehwag | Batter | 104 | 34 | 0 | 8 |
| 788 | V Shankar | All-rounder | 78 | 35 | 0 | 4 |
| 789 | V Suryavanshi | Batter | 10 | 0 | 0 | 0 |
| 790 | V Vijaykumar | Bowler | 0† | 0 | 0 | 0 |
| 791 | V Viyaskanth | Batter | 3 | 2 | 0 | 0 |
| 792 | VG Arora | Bowler | 35 | 9 | 0 | 2 |
| 793 | VH Zol | Batter | 3 | 0 | 0 | 0 |
| 794 | Vijaykumar Vyshak | Bowler | 19 | 5 | 0 | 1 |
| 795 | Virat Singh | Batter | 3 | 2 | 0 | 0 |
| 796 | Vishnu Vinod | Batter | 6 | 1 | 2 | 0 |
| 797 | Vivrant Sharma | Batter | 3 | 0 | 0 | 0 |
| 798 | VR Aaron | Bowler | 52 | 3 | 0 | 2 |
| 799 | VR Iyer | Batter | 61 | 22 | 0 | 3 |
| 800 | VRV Singh | Bowler | 19 | 3 | 0 | 0 |
| 801 | VS Malik | All-rounder | 13 | 2 | 0 | 0 |
| 802 | VS Yeligati | Batter | 2 | 0 | 0 | 0 |
| 803 | VVS Laxman | Batter | 20 | 4 | 0 | 1 |
| 804 | VY Mahesh | Bowler | 17 | 6 | 0 | 0 |
| 805 | W Hasaranga | All-rounder | 0† | 0 | 0 | 0 |
| 806 | W Jaffer | Batter | 8 | 4 | 0 | 1 |
| 807 | W O'Rourke | Batter | 3 | 1 | 0 | 0 |
| 808 | WA Mota | Batter | 12 | 5 | 0 | 1 |
| 809 | Washington Sundar | All-rounder | 69 | 15 | 0 | 1 |
| 810 | WD Parnell | Bowler | 33 | 10 | 0 | 1 |
| 811 | WG Jacks | All-rounder | 21 | 9 | 0 | 1 |
| 812 | WP Saha | WK-Batter | 169 | 93 | 26 | 20 |
| 813 | WPUJC Vaas | Bowler | 13 | 0 | 0 | 1 |
| 814 | X Thalaivan Sargunam | Batter | 1 | 0 | 0 | 0 |
| 815 | XC Bartlett | Bowler | 7 | 6 | 0 | 0 |
| 816 | Y Charak | All-rounder | 0† | 0 | 0 | 0 |
| 817 | Y Gnaneswara Rao | Batter | 2 | 2 | 0 | 0 |
| 818 | Y Nagar | Batter | 26 | 7 | 0 | 4 |
| 819 | Y Prithvi Raj | Batter | 2 | 0 | 0 | 0 |
| 820 | Y Punja | Bowler | 0† | 0 | 0 | 0 |
| 821 | Y Venugopal Rao | All-rounder | 65 | 13 | 0 | 3 |
| 822 | YA Abdulla | Bowler | 11 | 0 | 0 | 0 |
| 823 | Yash Dayal | Bowler | 43 | 8 | 0 | 2 |
| 824 | Yash Thakur | Bowler | 21 | 2 | 0 | 1 |
| 825 | Yashpal Singh | Batter | 8 | 3 | 0 | 0 |
| 826 | YBK Jaiswal | Batter | 69 | 30 | 0 | 2 |
| 827 | YK Pathan | All-rounder | 174 | 41 | 0 | 10 |
| 828 | Younis Khan | Batter | 1 | 1 | 0 | 0 |
| 829 | YS Chahal | Bowler | 178 | 29 | 0 | 5 |
| 830 | Yudhvir Singh | All-rounder | 9 | 0 | 0 | 0 |
| 831 | Yuvraj Singh | All-rounder | 132 | 29 | 0 | 10 |
| 832 | YV Dhull | Batter | 4 | 2 | 0 | 1 |
| 833 | YV Takawale | WK-Batter | 16 | 13 | 4 | 5 |
| 834 | Z Foulkes | All-rounder | 0† | 0 | 0 | 0 |
| 835 | Z Khan | Bowler | 99 | 20 | 0 | 6 |
| 836 | Zeeshan Ansari | Bowler | 10 | 3 | 0 | 1 |

## Zero-stat players (50) — marked † above

These are listed in `players.json` but have no entry in `player-stats.json` because they have not yet batted or bowled a ball in IPL. Typically they are 2026 squad additions awaiting their first game.

| Player | Role |
|---|---|
| A Ankolekar | All-rounder |
| A Kumar | Bowler |
| A Mandal | All-rounder |
| A Nabi | Bowler |
| A Perala | Batter |
| A Raghuwanshi | Batter |
| B Carse | All-rounder |
| B Dwarshuis | All-rounder |
| D Kamra | All-rounder |
| D Malewar | Batter |
| D Singh | Bowler |
| G Singh | Bowler |
| H Pannu | Batter |
| J Cox | WK-Batter |
| K Chouhan | All-rounder |
| K Fuletra | All-rounder |
| K Mendis | All-rounder |
| L Pretorius | Batter |
| M Izhar | Bowler |
| M Rawat | All-rounder |
| M Yadav | All-rounder |
| N Sindhu | All-rounder |
| N Tiwari | Bowler |
| O Tarmale | Bowler |
| P Avinash | Batter |
| P Hinge | Bowler |
| R Dar | Bowler |
| R Ghosh | All-rounder |
| R Sharma | Bowler |
| R Singh | Batter |
| S Ahamad | All-rounder |
| S Deswal | All-rounder |
| S Dubey | Bowler |
| S Hussain | Bowler |
| S Khan | All-rounder |
| S Mishra | Bowler |
| S Parakh | Batter |
| S Ranjan | All-rounder |
| S Ravichandran | Batter |
| T Singh | Batter |
| T Vijay | All-rounder |
| V Chakaravarthy | Bowler |
| V Malhotra | All-rounder |
| V Nishad | Bowler |
| V Ostwal | All-rounder |
| V Vijaykumar | Bowler |
| W Hasaranga | All-rounder |
| Y Charak | All-rounder |
| Y Punja | Bowler |
| Z Foulkes | All-rounder |

## Notes

- Aggregated at build time from the ball-by-ball `bbb/season-YYYY.json` set by scripts in `scripts/`. Anyone who hasn't appeared on a scoresheet is absent from `player-stats.json` itself — the zero rows above are backfilled from `players.json` so you see all 836.
- `battingAvg` of `0` indicates a player who has only ever been not-out (division-by-zero guard) or has never batted.
- `bestBowling` is a string for readability, not a struct — parse with `split('/')` if you need wickets/runs as numbers. It's blank/em-dash for non-bowlers.
- Zero-filled bowling columns for pure batters (and vice versa) are intentional — every player carries the same 34-field shape so the UI can render either discipline's card without null checks.
