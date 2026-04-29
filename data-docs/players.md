# Players

**Sources:**
- `public/data/players.json` — full player profiles (836 records)
- `public/data/players-index.json` — lean index used for search/filter (same 836 records)
- `public/data/player-teams.json` — player → [{team, season}] mapping keyed by player id (786 keys)
- `public/data/replacement-players.json` — mid-season replacements, keyed by season

**Consumed by:** `Players.tsx`, `PlayerDetail.tsx`, Team squad tabs, Analytics/Ratings workspace
**Records:** 836 distinct IPL players (2008–2026)

## Schema — `players.json`

| Field | Type | Notes |
|---|---|---|
| `id` | string | Cricsheet player id (numeric or short hex) |
| `name` | string | Display name (full) |
| `shortName` | string | Scorecard-style short name (e.g., `V Kohli`) |
| `nicknames` | string[] | Alternative names used in source data |
| `role` | enum | `Batter` / `Bowler` / `All-rounder` / `WK-Batter` |
| `teams` | string[] | All franchises the player has appeared for (historical names) |
| `lastTeam` | string | Most recent franchise |
| `seasons` | string[] | Every season the player appeared in |
| `firstMatch` | string | Date of IPL debut (`YYYY-MM-DD`) |
| `lastMatch` | string | Date of most recent appearance |
| `matchCount` | number | Total IPL matches played |
| `status` | enum | `active` / `inactive` / `retired` |
| `isReplacement` | boolean | `true` if they entered via mid-season replacement |

**Status rules (from feedback):**
- `active` — on a current-season squad or played within the last completed season.
- `inactive` — previously active but not on any current squad; not officially retired.
- `retired` — officially announced retirement (unsold ≠ retired).

## Aggregate counts

**Total players:** 836

**By role:**

| Role | Count |
|---|---:|
| Batter | 396 |
| Bowler | 234 |
| All-rounder | 166 |
| WK-Batter | 40 |

**By status:**

| Status | Count |
|---|---:|
| retired | 458 |
| active | 303 |
| inactive | 75 |

**Replacement players flagged:** 17

**Players by last franchise:**

| Last Franchise | Players |
|---|---:|
| Mumbai Indians | 96 |
| Rajasthan Royals | 93 |
| Kolkata Knight Riders | 88 |
| Chennai Super Kings | 73 |
| Royal Challengers Bangalore | 61 |
| Sunrisers Hyderabad | 61 |
| Delhi Capitals | 53 |
| Kings XI Punjab | 45 |
| Punjab Kings | 44 |
| Lucknow Super Giants | 39 |
| Delhi Daredevils | 36 |
| Gujarat Titans | 35 |
| Royal Challengers Bengaluru | 35 |
| Deccan Chargers | 25 |
| Pune Warriors | 22 |
| Gujarat Lions | 15 |
| Rising Pune Supergiant | 10 |
| Kochi Tuskers Kerala | 5 |

---

## Complete listing — all 836 players

Each player is listed with every field from `players.json`, split into three tables by status (active / inactive / retired). Sort is `matchCount` descending within each table, then `shortName` ascending.

### Active players (303)

| ID | Name | Short Name | Nicknames | Role | Last Team | All Teams | Seasons | First Match | Last Match | M | Repl |
|---|---|---|---|---|---|---|---|---|---|---:|:-:|
| `4a8a2e3b` | MS Dhoni | MS Dhoni | Mahi, MSD, Captain Cool, Thala | WK-Batter | Chennai Super Kings | Chennai Super Kings, Rising Pune Supergiant | 2008–2025 (18) | 2008-04-19 | 2025-05-25 | 277 |  |
| `740742ef` | Rohit Sharma | RG Sharma | Hitman, Ro, Rohit Sharma | Batter | Mumbai Indians | Deccan Chargers, Mumbai Indians | 2008–2026 (19) | 2008-04-20 | 2026-04-07 | 275 |  |
| `ba607b88` | Virat Kohli | V Kohli | King Kohli, Cheeku, Run Machine | Batter | Royal Challengers Bengaluru | Royal Challengers Bangalore, Royal Challengers Bengaluru | 2008–2026 (19) | 2008-04-18 | 2026-04-05 | 268 |  |
| `fe93fd9d` | Ravindra Jadeja | RA Jadeja | Jaddu, Sir Jadeja, Ravindra Jadeja | All-rounder | Rajasthan Royals | Rajasthan Royals, Kochi Tuskers Kerala, Chennai Super Kings, Gujarat Lions | 2008–2026 (18) | 2008-04-19 | 2026-04-07 | 256 |  |
| `495d42a5` | Ravichandran Ashwin | R Ashwin | Ash, Ashwin | Bowler | Chennai Super Kings | Chennai Super Kings, Rising Pune Supergiant, Kings XI Punjab, Delhi Capitals, Rajasthan Royals | 2009–2025 (16) | 2009-04-18 | 2025-05-20 | 219 |  |
| `29e95537` | Ajinkya Rahane | AM Rahane | Jinx, Ajinkya Rahane | Batter | Kolkata Knight Riders | Mumbai Indians, Rajasthan Royals, Rising Pune Supergiant, Delhi Capitals, Kolkata Knight Riders, Chennai Super Kings | 2008–2026 (18) | 2008-04-27 | 2026-04-06 | 201 |  |
| `2e81a32d` | Bhuvneshwar Kumar | B Kumar | Bhuvi, Bhuvneshwar | Bowler | Royal Challengers Bengaluru | Pune Warriors, Sunrisers Hyderabad, Royal Challengers Bengaluru | 2011–2026 (16) | 2011-05-08 | 2026-04-05 | 192 |  |
| `9d430b40` | Sunil Narine | SP Narine | Sunil Narine, Mystery Man | All-rounder | Kolkata Knight Riders | Kolkata Knight Riders | 2012–2026 (15) | 2012-04-08 | 2026-04-02 | 190 |  |
| `a4cc73aa` | Sanju Samson | SV Samson | Sanju Samson, Sanju | WK-Batter | Chennai Super Kings | Rajasthan Royals, Delhi Daredevils, Chennai Super Kings | 2013–2026 (14) | 2013-04-14 | 2026-04-05 | 179 |  |
| `57ee1fde` | Yuzvendra Chahal | YS Chahal | Yuzi, Chahal | Bowler | Punjab Kings | Mumbai Indians, Royal Challengers Bangalore, Rajasthan Royals, Punjab Kings | 2013–2026 (14) | 2013-04-24 | 2026-04-06 | 178 |  |
| `93b4fc78` | Manish Pandey | MK Pandey | Manish Pandey | Batter | Kolkata Knight Riders | Mumbai Indians, Royal Challengers Bangalore, Pune Warriors, Kolkata Knight Riders, Sunrisers Hyderabad, Lucknow Super Giants, Delhi Capitals | 2008–2025 (18) | 2008-04-29 | 2025-05-25 | 174 |  |
| `271f83cd` | Suryakumar Yadav | SA Yadav | SKY, Surya, Suryakumar Yadav | Batter | Mumbai Indians | Mumbai Indians, Kolkata Knight Riders | 2012–2026 (14) | 2012-04-06 | 2026-04-07 | 169 |  |
| `2e171977` | Axar Patel | AR Patel | Axar Patel, Bapu | All-rounder | Delhi Capitals | Kings XI Punjab, Delhi Capitals | 2014–2026 (13) | 2014-04-18 | 2026-04-08 | 166 |  |
| `3355b542` | Faf du Plessis | F du Plessis | Faf, Faf du Plessis | Batter | Delhi Capitals | Chennai Super Kings, Rising Pune Supergiant, Royal Challengers Bangalore, Royal Challengers Bengaluru, Delhi Capitals | 2012–2025 (13) | 2012-04-04 | 2025-05-24 | 154 |  |
| `dbe50b21` | Hardik Pandya | HH Pandya | Hardik Pandya, HP | All-rounder | Mumbai Indians | Mumbai Indians, Gujarat Titans | 2015–2026 (12) | 2015-04-19 | 2026-04-07 | 154 |  |
| `b17e2f24` | KL Rahul | KL Rahul | KL, Rahul | WK-Batter | Delhi Capitals | Royal Challengers Bangalore, Sunrisers Hyderabad, Kings XI Punjab, Punjab Kings, Lucknow Super Giants, Delhi Capitals | 2013–2026 (13) | 2013-04-11 | 2026-04-08 | 149 |  |
| `462411b3` | Jasprit Bumrah | JJ Bumrah | Boom Boom Bumrah, Jassi, Jasprit Bumrah | Bowler | Mumbai Indians | Mumbai Indians | 2013–2026 (13) | 2013-04-04 | 2026-04-07 | 148 |  |
| `d67d5f00` | David Miller | DA Miller | Killer Miller, David Miller | Batter | Delhi Capitals | Kings XI Punjab, Rajasthan Royals, Gujarat Titans, Lucknow Super Giants, Delhi Capitals | 2012–2026 (15) | 2012-04-20 | 2026-04-08 | 144 |  |
| `5b8c830e` | Krunal Pandya | KH Pandya | Krunal Pandya | All-rounder | Royal Challengers Bengaluru | Mumbai Indians, Lucknow Super Giants, Royal Challengers Bengaluru | 2016–2026 (11) | 2016-04-16 | 2026-04-05 | 144 |  |
| `b681e71e` | Glenn Maxwell | GJ Maxwell | Maxi, Big Show, Glenn Maxwell | All-rounder | Punjab Kings | Delhi Daredevils, Mumbai Indians, Kings XI Punjab, Royal Challengers Bangalore, Royal Challengers Bengaluru, Punjab Kings | 2012–2025 (13) | 2012-04-05 | 2025-04-26 | 141 |  |
| `bbd41817` | Andre Russell | AD Russell | Dre Russ, Muscle Russell, Andre Russell | All-rounder | Kolkata Knight Riders | Delhi Daredevils, Kolkata Knight Riders | 2012–2025 (13) | 2012-05-10 | 2025-05-25 | 139 |  |
| `5f547c8b` | Rashid Khan | Rashid Khan | Afghan Spin Wizard, Rashid | Bowler | Gujarat Titans | Sunrisers Hyderabad, Gujarat Titans | 2017–2026 (10) | 2017-04-05 | 2026-04-08 | 139 |  |
| `ce820073` | Sandeep Sharma | Sandeep Sharma | Sandy | Bowler | Rajasthan Royals | Kings XI Punjab, Sunrisers Hyderabad, Punjab Kings, Rajasthan Royals | 2013–2026 (14) | 2013-05-11 | 2026-04-07 | 139 | ✅ |
| `85ec8e33` | Shreyas Iyer | SS Iyer | Shreyas Iyer | Batter | Punjab Kings | Delhi Daredevils, Delhi Capitals, Kolkata Knight Riders, Punjab Kings | 2015–2026 (11) | 2015-04-09 | 2026-04-06 | 136 |  |
| `00ea847a` | Mayank Agarwal | MA Agarwal | Mayank Agarwal | Batter | Royal Challengers Bengaluru | Royal Challengers Bangalore, Delhi Daredevils, Rising Pune Supergiant, Kings XI Punjab, Punjab Kings, Sunrisers Hyderabad, Royal Challengers Bengaluru | 2011–2025 (15) | 2011-04-09 | 2025-06-03 | 130 |  |
| `919a3be2` | Rishabh Pant | RR Pant | Rishabh Pant, Pant | WK-Batter | Lucknow Super Giants | Delhi Daredevils, Delhi Capitals, Lucknow Super Giants | 2016–2026 (10) | 2016-04-27 | 2026-04-05 | 127 |  |
| `73ad96ed` | Deepak Hooda | DJ Hooda | Deepak Hooda | All-rounder | Chennai Super Kings | Rajasthan Royals, Sunrisers Hyderabad, Kings XI Punjab, Punjab Kings, Lucknow Super Giants, Chennai Super Kings | 2015–2025 (11) | 2015-04-10 | 2025-05-25 | 125 |  |
| `99b75528` | Jos Buttler | JC Buttler | Jos Buttler, Jos | WK-Batter | Gujarat Titans | Mumbai Indians, Rajasthan Royals, Gujarat Titans | 2016–2026 (11) | 2016-04-09 | 2026-04-08 | 124 |  |
| `752f7486` | Ishan Kishan | Ishan Kishan | Ishan | WK-Batter | Sunrisers Hyderabad | Gujarat Lions, Mumbai Indians, Sunrisers Hyderabad | 2016–2026 (11) | 2016-04-11 | 2026-04-05 | 122 |  |
| `8cf9814c` | Mohammad Shami | Mohammed Shami | Shami | Bowler | Lucknow Super Giants | Kolkata Knight Riders, Delhi Daredevils, Kings XI Punjab, Punjab Kings, Gujarat Titans, Sunrisers Hyderabad, Lucknow Super Giants | 2013–2026 (12) | 2013-04-08 | 2026-04-05 | 121 |  |
| `fb2d1dda` | Nitish Rana | N Rana | Nitish | All-rounder | Delhi Capitals | Mumbai Indians, Kolkata Knight Riders, Rajasthan Royals, Delhi Capitals | 2016–2026 (11) | 2016-05-11 | 2026-04-08 | 121 |  |
| `a818c1be` | Trent Boult | TA Boult | Trent Boult, Boulto | Bowler | Mumbai Indians | Sunrisers Hyderabad, Kolkata Knight Riders, Delhi Daredevils, Delhi Capitals, Mumbai Indians, Rajasthan Royals | 2015–2026 (12) | 2015-04-11 | 2026-04-07 | 121 |  |
| `f986ca1a` | Harshal Patel | HV Patel | Harshal Patel, Purple Patel | All-rounder | Sunrisers Hyderabad | Royal Challengers Bangalore, Delhi Daredevils, Delhi Capitals, Punjab Kings, Sunrisers Hyderabad | 2012–2026 (14) | 2012-04-07 | 2026-04-05 | 120 |  |
| `759ac88f` | Mohit Sharma | MM Sharma | Mohit Sharma | Bowler | Delhi Capitals | Chennai Super Kings, Kings XI Punjab, Delhi Capitals, Gujarat Titans | 2013–2025 (11) | 2013-04-13 | 2025-05-24 | 120 |  |
| `b4b99816` | Shubman Gill | Shubman Gill | Gill, Prince of Fazilka | Batter | Gujarat Titans | Kolkata Knight Riders, Gujarat Titans | 2018–2026 (9) | 2018-04-14 | 2026-04-08 | 120 |  |
| `5bb1a1c4` | Ishant Sharma | I Sharma | Ishant, Lambu | Bowler | Gujarat Titans | Kolkata Knight Riders, Deccan Chargers, Sunrisers Hyderabad, Rising Pune Supergiant, Kings XI Punjab, Delhi Capitals, Gujarat Titans | 2008–2025 (15) | 2008-04-18 | 2025-05-02 | 117 |  |
| `1e66c162` | Jaydev Unadkat | JD Unadkat | JD, Unadkat | Bowler | Sunrisers Hyderabad | Kolkata Knight Riders, Royal Challengers Bangalore, Delhi Daredevils, Rising Pune Supergiant, Rajasthan Royals, Mumbai Indians, Lucknow Super Giants, Sunrisers Hyderabad | 2010–2026 (17) | 2010-04-04 | 2026-04-05 | 115 |  |
| `372455c4` | Quinton de Kock | Q de Kock | QDK, Quinton | WK-Batter | Kolkata Knight Riders | Sunrisers Hyderabad, Delhi Daredevils, Royal Challengers Bangalore, Mumbai Indians, Lucknow Super Giants, Kolkata Knight Riders | 2013–2025 (12) | 2013-04-17 | 2025-05-25 | 115 |  |
| `d9273ee7` | Marcus Stoinis | MP Stoinis | Marcus Stoinis, Stoin | All-rounder | Punjab Kings | Kings XI Punjab, Royal Challengers Bangalore, Delhi Capitals, Lucknow Super Giants, Punjab Kings | 2016–2026 (11) | 2016-04-11 | 2026-04-06 | 113 |  |
| `2f49c897` | Mohammed Siraj | Mohammed Siraj | Siraj, Miya | Bowler | Gujarat Titans | Sunrisers Hyderabad, Royal Challengers Bangalore, Royal Challengers Bengaluru, Gujarat Titans | 2017–2026 (10) | 2017-04-19 | 2026-04-08 | 111 |  |
| `39a2dfa8` | Rahul Tewatia | R Tewatia | Tewatia | All-rounder | Gujarat Titans | Rajasthan Royals, Kings XI Punjab, Delhi Daredevils, Delhi Capitals, Gujarat Titans | 2014–2026 (12) | 2014-05-05 | 2026-04-08 | 111 |  |
| `1abb78f8` | Shardul Thakur | SN Thakur | Shardul Thakur, Lord Thakur, Lord | All-rounder | Mumbai Indians | Kings XI Punjab, Rising Pune Supergiant, Chennai Super Kings, Delhi Capitals, Kolkata Knight Riders, Lucknow Super Giants, Mumbai Indians | 2015–2026 (11) | 2015-05-01 | 2026-04-07 | 108 |  |
| `8d2c70ad` | Kuldeep Yadav | Kuldeep Yadav | Kuldeep | Bowler | Delhi Capitals | Kolkata Knight Riders, Delhi Capitals | 2016–2026 (10) | 2016-04-13 | 2026-04-08 | 102 |  |
| `77255a9e` | Rahul Tripathi | RA Tripathi | Rahul Tripathi | Batter | Chennai Super Kings | Rising Pune Supergiant, Rajasthan Royals, Kolkata Knight Riders, Sunrisers Hyderabad, Chennai Super Kings | 2017–2025 (9) | 2017-04-11 | 2025-04-14 | 100 |  |
| `23eeb873` | Deepak Chahar | DL Chahar | Deepak Chahar | Bowler | Mumbai Indians | Rising Pune Supergiant, Chennai Super Kings, Mumbai Indians | 2016–2026 (10) | 2016-05-17 | 2026-04-07 | 97 |  |
| `3241e3fd` | Nicholas Pooran | N Pooran | Pooran | WK-Batter | Lucknow Super Giants | Kings XI Punjab, Punjab Kings, Sunrisers Hyderabad, Lucknow Super Giants | 2019–2026 (8) | 2019-03-25 | 2026-04-05 | 92 |  |
| `119678fd` | Karn Sharma | KV Sharma | Karn Sharma | Bowler | Mumbai Indians | Royal Challengers Bangalore, Sunrisers Hyderabad, Mumbai Indians, Chennai Super Kings, Royal Challengers Bengaluru | 2009–2025 (12) | 2009-04-22 | 2025-05-21 | 90 |  |
| `48a1d7b7` | Shimron Hetmyer | SO Hetmyer | Hetmyer, Shimron | Batter | Rajasthan Royals | Royal Challengers Bangalore, Delhi Capitals, Rajasthan Royals | 2019–2026 (8) | 2019-03-23 | 2026-04-07 | 89 |  |
| `e62dd25d` | Kagiso Rabada | K Rabada | KG, Rabada | Bowler | Gujarat Titans | Delhi Daredevils, Delhi Capitals, Punjab Kings, Gujarat Titans | 2017–2026 (9) | 2017-04-22 | 2026-04-08 | 87 |  |
| `244048f6` | Arshdeep Singh | Arshdeep Singh | Arsh | Bowler | Punjab Kings | Kings XI Punjab, Punjab Kings | 2019–2026 (8) | 2019-04-16 | 2026-04-06 | 86 |  |
| `04a418e8` | Riyan Parag | R Parag | Riyan | All-rounder | Rajasthan Royals | Rajasthan Royals | 2019–2026 (8) | 2019-04-11 | 2026-04-07 | 86 |  |
| `5b7ab5a9` | Chakravarthy Varun | CV Varun | Varun Chakravarthy, Mystery Spinner | Bowler | Kolkata Knight Riders | Kings XI Punjab, Kolkata Knight Riders | 2019–2026 (8) | 2019-03-27 | 2026-04-02 | 85 |  |
| `944533a5` | Karun Nair | KK Nair | Karun Nair | Batter | Delhi Capitals | Royal Challengers Bangalore, Rajasthan Royals, Delhi Daredevils, Kings XI Punjab, Delhi Capitals | 2013–2025 (10) | 2013-04-04 | 2025-05-24 | 84 |  |
| `a4e37e47` | Shivam Dube | S Dube | — | All-rounder | Chennai Super Kings | Royal Challengers Bangalore, Rajasthan Royals, Chennai Super Kings | 2019–2026 (8) | 2019-03-23 | 2026-04-05 | 82 |  |
| `f29185a1` | Abhishek Sharma | Abhishek Sharma | Abhi | All-rounder | Sunrisers Hyderabad | Delhi Daredevils, Sunrisers Hyderabad | 2018–2026 (9) | 2018-05-12 | 2026-04-05 | 80 |  |
| `df064e1a` | Ravi Bishnoi | Ravi Bishnoi | Bishnoi | Bowler | Rajasthan Royals | Kings XI Punjab, Punjab Kings, Lucknow Super Giants, Rajasthan Royals | 2020–2026 (7) | 2020-09-20 | 2026-04-07 | 80 |  |
| `2ed569a0` | Rahul Chahar | RD Chahar | — | Bowler | Chennai Super Kings | Rising Pune Supergiant, Mumbai Indians, Punjab Kings, Sunrisers Hyderabad, Chennai Super Kings | 2017–2026 (9) | 2017-04-08 | 2026-04-03 | 80 |  |
| `8b3e9c7c` | Prithvi Shaw | PP Shaw | — | Batter | Delhi Capitals | Delhi Daredevils, Delhi Capitals | 2018–2024 (7) | 2018-04-23 | 2024-04-29 | 79 |  |
| `0994d0ae` | Vijay Shankar | V Shankar | — | All-rounder | Chennai Super Kings | Chennai Super Kings, Sunrisers Hyderabad, Delhi Daredevils, Gujarat Titans | 2014–2025 (10) | 2014-05-13 | 2025-04-20 | 78 |  |
| `eef2536f` | Avesh Khan | Avesh Khan | Avesh | Bowler | Lucknow Super Giants | Royal Challengers Bangalore, Delhi Daredevils, Delhi Capitals, Lucknow Super Giants, Rajasthan Royals | 2017–2026 (10) | 2017-05-14 | 2026-04-05 | 76 |  |
| `2c25d4f5` | Devdutt Padikkal | D Padikkal | — | Batter | Royal Challengers Bengaluru | Royal Challengers Bangalore, Rajasthan Royals, Lucknow Super Giants, Royal Challengers Bengaluru | 2020–2026 (7) | 2020-09-21 | 2026-04-05 | 76 |  |
| `a2f46292` | Khaleel Ahmed | KK Ahmed | — | Bowler | Chennai Super Kings | Sunrisers Hyderabad, Delhi Capitals, Chennai Super Kings | 2018–2026 (9) | 2018-05-25 | 2026-04-05 | 74 |  |
| `45a43fe2` | Ruturaj Gaikwad | RD Gaikwad | Ruturaj Gaikwad, Rutu | Batter | Chennai Super Kings | Chennai Super Kings | 2020–2026 (7) | 2020-09-22 | 2026-04-05 | 74 |  |
| `bb351c23` | Moeen Ali | MM Ali | — | All-rounder | Kolkata Knight Riders | Royal Challengers Bangalore, Chennai Super Kings, Kolkata Knight Riders | 2018–2025 (8) | 2018-05-07 | 2025-05-07 | 73 |  |
| `ded9240e` | Pat Cummins | PJ Cummins | — | Bowler | Sunrisers Hyderabad | Kolkata Knight Riders, Delhi Daredevils, Sunrisers Hyderabad | 2014–2025 (8) | 2014-05-20 | 2025-05-25 | 72 |  |
| `85e0cf10` | Prasidh Krishna | M Prasidh Krishna | Prasidh | Bowler | Gujarat Titans | Kolkata Knight Riders, Rajasthan Royals, Gujarat Titans | 2018–2026 (7) | 2018-05-06 | 2026-04-08 | 69 |  |
| `f19ccfad` | Washington Sundar | Washington Sundar | Washi | All-rounder | Gujarat Titans | Rising Pune Supergiant, Royal Challengers Bangalore, Sunrisers Hyderabad, Gujarat Titans | 2017–2026 (10) | 2017-04-22 | 2026-04-08 | 69 | ✅ |
| `6c19c6e5` | Yashasvi Jaiswal | YBK Jaiswal | Jaiswal, Yashasvi | Batter | Rajasthan Royals | Rajasthan Royals | 2020–2026 (7) | 2020-09-22 | 2026-04-07 | 69 |  |
| `ce794613` | T. Natarajan | T Natarajan | Nattu, Yorker Natarajan | Bowler | Delhi Capitals | Kings XI Punjab, Sunrisers Hyderabad, Delhi Capitals | 2017–2026 (8) | 2017-04-08 | 2026-04-08 | 67 |  |
| `8e514b4c` | Abdul Samad | Abdul Samad | — | All-rounder | Lucknow Super Giants | Sunrisers Hyderabad, Lucknow Super Giants | 2020–2026 (7) | 2020-09-29 | 2026-04-05 | 65 |  |
| `e94915e6` | Sam Curran | SM Curran | — | All-rounder | Chennai Super Kings | Kings XI Punjab, Chennai Super Kings, Punjab Kings | 2019–2025 (6) | 2019-03-25 | 2025-05-03 | 64 |  |
| `0a509d6b` | Rinku Singh | RK Singh | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2018–2026 (8) | 2018-04-08 | 2026-04-06 | 61 |  |
| `a24be938` | Venkatesh Iyer | VR Iyer | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2021–2025 (5) | 2021-09-20 | 2025-05-04 | 61 |  |
| `0a8fce53` | Mustafizur Rahman | Mustafizur Rahman | — | Bowler | Delhi Capitals | Sunrisers Hyderabad, Mumbai Indians, Rajasthan Royals, Delhi Capitals, Chennai Super Kings | 2016–2025 (8) | 2016-04-12 | 2025-05-24 | 60 | ✅ |
| `6a26221c` | Aiden Markram | AK Markram | — | Batter | Lucknow Super Giants | Punjab Kings, Sunrisers Hyderabad, Lucknow Super Giants | 2021–2026 (6) | 2021-09-21 | 2026-04-05 | 59 |  |
| `f9e6e7ef` | Shahbaz Ahmed | Shahbaz Ahmed | — | All-rounder | Lucknow Super Giants | Royal Challengers Bangalore, Sunrisers Hyderabad, Lucknow Super Giants | 2020–2026 (7) | 2020-10-17 | 2026-04-01 | 59 |  |
| `872b03f7` | Ayush Badoni | A Badoni | — | All-rounder | Lucknow Super Giants | Lucknow Super Giants | 2022–2026 (5) | 2022-03-28 | 2026-04-05 | 58 |  |
| `7dcb9bc9` | Mohd. Arshad Khan | M Shahrukh Khan | — | All-rounder | Gujarat Titans | Punjab Kings, Gujarat Titans | 2021–2026 (6) | 2021-04-12 | 2026-04-08 | 58 |  |
| `800d2d97` | Jitesh Sharma | JM Sharma | — | WK-Batter | Royal Challengers Bengaluru | Punjab Kings, Royal Challengers Bengaluru | 2022–2026 (5) | 2022-04-03 | 2026-04-05 | 57 |  |
| `3d8feaf8` | Mitchell Marsh | MR Marsh | — | All-rounder | Lucknow Super Giants | Deccan Chargers, Pune Warriors, Rising Pune Supergiant, Sunrisers Hyderabad, Delhi Capitals, Lucknow Super Giants | 2010–2026 (10) | 2010-04-08 | 2026-04-05 | 57 |  |
| `b0482a1d` | Tilak Varma | Tilak Varma | Tilak | Batter | Mumbai Indians | Mumbai Indians | 2022–2026 (5) | 2022-03-27 | 2026-04-07 | 57 |  |
| `5574750c` | Jofra Archer | JC Archer | — | Bowler | Rajasthan Royals | Rajasthan Royals, Mumbai Indians | 2018–2026 (6) | 2018-04-22 | 2026-04-07 | 55 |  |
| `9418198b` | Prabhsimran Singh | P Simran Singh | — | Batter | Punjab Kings | Kings XI Punjab, Punjab Kings | 2019–2026 (8) | 2019-04-29 | 2026-04-06 | 55 |  |
| `f088b960` | Sarfaraz Khan | SN Khan | — | Batter | Chennai Super Kings | Royal Challengers Bangalore, Kings XI Punjab, Punjab Kings, Delhi Capitals, Chennai Super Kings | 2015–2026 (9) | 2015-04-22 | 2026-04-05 | 53 |  |
| `235c2bb6` | Heinrich Klaasen | H Klaasen | — | WK-Batter | Sunrisers Hyderabad | Rajasthan Royals, Royal Challengers Bangalore, Sunrisers Hyderabad | 2018–2026 (6) | 2018-04-20 | 2026-04-05 | 52 |  |
| `abb83e27` | Jonny Bairstow | JM Bairstow | — | WK-Batter | Mumbai Indians | Sunrisers Hyderabad, Punjab Kings, Mumbai Indians | 2019–2025 (6) | 2019-03-24 | 2025-06-01 | 52 |  |
| `3fb19989` | Mitchell Starc | MA Starc | — | Bowler | Delhi Capitals | Royal Challengers Bangalore, Kolkata Knight Riders, Delhi Capitals | 2014–2025 (4) | 2014-04-17 | 2025-05-08 | 52 |  |
| `7a8bd078` | Shreyas Gopal | S Gopal | — | Bowler | Mumbai Indians | Mumbai Indians, Rajasthan Royals, Sunrisers Hyderabad | 2014–2024 (9) | 2014-05-19 | 2024-04-18 | 52 |  |
| `f1f99156` | Tim David | TH David | — | Batter | Royal Challengers Bengaluru | Royal Challengers Bangalore, Mumbai Indians, Royal Challengers Bengaluru | 2021–2026 (6) | 2021-09-24 | 2026-04-05 | 52 |  |
| `50c6bc2b` | Liam Livingstone | LS Livingstone | — | All-rounder | Sunrisers Hyderabad | Rajasthan Royals, Punjab Kings, Royal Challengers Bengaluru, Sunrisers Hyderabad | 2019–2026 (7) | 2019-04-13 | 2026-04-05 | 50 |  |
| `acdc62f5` | Anrich Nortje | A Nortje | — | Bowler | Lucknow Super Giants | Delhi Capitals, Kolkata Knight Riders, Lucknow Super Giants | 2020–2026 (7) | 2020-09-20 | 2026-04-01 | 49 |  |
| `c05edf8e` | Harprett Brar | Harpreet Brar | — | All-rounder | Punjab Kings | Kings XI Punjab, Punjab Kings | 2019–2025 (7) | 2019-04-20 | 2025-05-29 | 49 |  |
| `2f9d0389` | Lockie Ferguson | LH Ferguson | — | Bowler | Punjab Kings | Rising Pune Supergiant, Kolkata Knight Riders, Gujarat Titans, Royal Challengers Bengaluru, Punjab Kings | 2017–2025 (8) | 2017-04-14 | 2025-04-12 | 49 |  |
| `46a9bea1` | Tushar Deshpande | TU Deshpande | — | Bowler | Rajasthan Royals | Delhi Capitals, Chennai Super Kings, Rajasthan Royals | 2020–2026 (6) | 2020-10-14 | 2026-04-07 | 48 |  |
| `0f721006` | Jason Holder | JO Holder | — | All-rounder | Rajasthan Royals | Chennai Super Kings, Sunrisers Hyderabad, Kolkata Knight Riders, Lucknow Super Giants, Rajasthan Royals | 2013–2023 (7) | 2013-04-22 | 2023-04-30 | 46 |  |
| `26989d80` | Shashank Singh | Shashank Singh | — | Batter | Punjab Kings | Sunrisers Hyderabad, Punjab Kings | 2022–2026 (4) | 2022-04-09 | 2026-04-06 | 45 |  |
| `bcf325d2` | Dhruv Jurel | Dhruv Jurel | Jurel | WK-Batter | Rajasthan Royals | Rajasthan Royals | 2023–2026 (4) | 2023-04-05 | 2026-04-07 | 44 |  |
| `c740ea83` | Rajat Patidar | RM Patidar | — | Batter | Royal Challengers Bengaluru | Royal Challengers Bangalore, Royal Challengers Bengaluru | 2021–2026 (5) | 2021-04-09 | 2026-04-05 | 44 |  |
| `d5130a30` | Sai Sudharsan | B Sai Sudharsan | Sudharsan | Batter | Gujarat Titans | Gujarat Titans | 2022–2026 (5) | 2022-04-08 | 2026-04-08 | 43 |  |
| `7210d461` | Yash Dayal | Yash Dayal | — | Bowler | Royal Challengers Bengaluru | Gujarat Titans, Royal Challengers Bengaluru | 2022–2025 (4) | 2022-04-14 | 2025-06-03 | 43 |  |
| `12b610c2` | Travis Head | TM Head | Travis Head, Trav | Batter | Sunrisers Hyderabad | Royal Challengers Bangalore, Sunrisers Hyderabad | 2016–2026 (5) | 2016-04-20 | 2026-04-05 | 41 |  |
| `da934ee8` | Mahipal Lomror | MK Lomror | — | Batter | Royal Challengers Bengaluru | Rajasthan Royals, Royal Challengers Bangalore, Royal Challengers Bengaluru | 2018–2024 (7) | 2018-04-29 | 2024-05-22 | 40 |  |
| `d1a60072` | Nehal Wadhera | N Wadhera | — | Batter | Punjab Kings | Mumbai Indians, Punjab Kings | 2023–2026 (4) | 2023-04-02 | 2026-04-06 | 40 |  |
| `efc04be7` | Noor Ahmad | Noor Ahmad | — | Bowler | Chennai Super Kings | Gujarat Titans, Chennai Super Kings | 2023–2026 (4) | 2023-04-16 | 2026-04-05 | 40 |  |
| `03806cf8` | Josh Hazlewood | JR Hazlewood | — | Bowler | Royal Challengers Bengaluru | Chennai Super Kings, Royal Challengers Bangalore, Royal Challengers Bengaluru | 2020–2025 (5) | 2020-09-25 | 2025-06-03 | 39 |  |
| `81c36ee9` | Marco Jansen | M Jansen | — | All-rounder | Punjab Kings | Mumbai Indians, Sunrisers Hyderabad, Punjab Kings | 2021–2026 (6) | 2021-04-09 | 2026-04-06 | 39 |  |
| `a9fd84fb` | Mayank Markande | M Markande | — | Bowler | Mumbai Indians | Mumbai Indians, Rajasthan Royals, Sunrisers Hyderabad | 2018–2026 (7) | 2018-04-07 | 2026-04-04 | 39 |  |
| `f24c6701` | Maheesh Theekshana | M Theekshana | — | Bowler | Rajasthan Royals | Chennai Super Kings, Rajasthan Royals | 2022–2025 (4) | 2022-04-09 | 2025-05-04 | 38 |  |
| `a97c8ec2` | PWH de Silva | PWH de Silva | — | Bowler | Rajasthan Royals | Royal Challengers Bangalore, Rajasthan Royals | 2021–2025 (4) | 2021-09-20 | 2025-05-20 | 37 |  |
| `3d284ca3` | Phil Salt | PD Salt | — | WK-Batter | Royal Challengers Bengaluru | Delhi Capitals, Kolkata Knight Riders, Royal Challengers Bengaluru | 2023–2026 (4) | 2023-04-20 | 2026-04-05 | 36 |  |
| `85b3fab2` | Tristan Stubbs | T Stubbs | — | Batter | Delhi Capitals | Mumbai Indians, Delhi Capitals | 2022–2026 (5) | 2022-05-12 | 2026-04-08 | 36 |  |
| `2cffab74` | Mukesh Kumar | Mukesh Kumar | — | Bowler | Delhi Capitals | Delhi Capitals | 2023–2026 (4) | 2023-04-01 | 2026-04-08 | 35 |  |
| `7c3b3b78` | Vaibhav Arora | VG Arora | — | Bowler | Kolkata Knight Riders | Punjab Kings, Kolkata Knight Riders | 2022–2026 (5) | 2022-04-03 | 2026-04-06 | 35 |  |
| `77b1aa15` | Harshit Rana | Harshit Rana | — | Bowler | Kolkata Knight Riders | Kolkata Knight Riders | 2022–2025 (4) | 2022-04-28 | 2025-05-25 | 33 |  |
| `21d4e29b` | Navdeep Saini | Navdeep Saini | — | Bowler | Kolkata Knight Riders | Royal Challengers Bangalore, Rajasthan Royals, Kolkata Knight Riders | 2019–2026 (6) | 2019-03-23 | 2026-04-06 | 33 | ✅ |
| `be24ead0` | Ramandeep Singh | Ramandeep Singh | — | All-rounder | Kolkata Knight Riders | Mumbai Indians, Kolkata Knight Riders | 2022–2026 (4) | 2022-04-09 | 2026-04-06 | 33 |  |
| `ad3b6e95` | Abishek Porel | Abishek Porel | — | WK-Batter | Delhi Capitals | Delhi Capitals | 2023–2025 (3) | 2023-04-04 | 2025-05-21 | 32 |  |
| `eaa76d3c` | Cameron Green | C Green | — | All-rounder | Kolkata Knight Riders | Mumbai Indians, Royal Challengers Bengaluru, Kolkata Knight Riders | 2023–2026 (3) | 2023-04-02 | 2026-04-06 | 32 |  |
| `64839cb3` | Matheesha Pathirana | M Pathirana | — | Bowler | Chennai Super Kings | Chennai Super Kings | 2022–2025 (4) | 2022-05-15 | 2025-05-25 | 32 |  |
| `e4a0deae` | Mitchell Santner | MJ Santner | — | All-rounder | Mumbai Indians | Chennai Super Kings, Mumbai Indians | 2019–2026 (7) | 2019-03-31 | 2026-04-04 | 32 |  |
| `c38d3503` | Shivam Mavi | Shivam Mavi | — | Bowler | Kolkata Knight Riders | Kolkata Knight Riders | 2018–2022 (4) | 2018-04-14 | 2022-05-07 | 32 |  |
| `aad0c365` | Nitish Kumar Reddy | Nithish Kumar Reddy | NKR, Nithish | All-rounder | Sunrisers Hyderabad | Sunrisers Hyderabad | 2023–2026 (4) | 2023-05-18 | 2026-04-05 | 31 |  |
| `df5a6881` | Devon Conway | DP Conway | — | Batter | Chennai Super Kings | Chennai Super Kings | 2022–2025 (3) | 2022-03-26 | 2025-05-25 | 29 |  |
| `650d5e49` | Rovman Powell | R Powell | — | Batter | Kolkata Knight Riders | Delhi Capitals, Rajasthan Royals, Kolkata Knight Riders | 2022–2026 (5) | 2022-03-27 | 2026-04-06 | 29 |  |
| `9440ef41` | Suyash Sharma | Suyash Sharma | — | Bowler | Royal Challengers Bengaluru | Kolkata Knight Riders, Royal Challengers Bengaluru | 2023–2026 (4) | 2023-04-06 | 2026-04-05 | 29 |  |
| `0890552f` | Abhinav Manohar | A Manohar | — | Batter | Sunrisers Hyderabad | Gujarat Titans, Sunrisers Hyderabad | 2022–2025 (4) | 2022-03-28 | 2025-05-25 | 27 |  |
| `fffa744b` | Naman Dhir | Naman Dhir | — | All-rounder | Mumbai Indians | Mumbai Indians | 2024–2026 (3) | 2024-03-24 | 2026-04-07 | 26 |  |
| `d014d5ac` | Sherfane Rutherford | SE Rutherford | — | Batter | Mumbai Indians | Delhi Capitals, Royal Challengers Bangalore, Gujarat Titans, Mumbai Indians | 2019–2026 (4) | 2019-04-20 | 2026-04-07 | 26 |  |
| `81c08fa3` | Umran Malik | Umran Malik | Umran, Jammu Express | Bowler | Sunrisers Hyderabad | Sunrisers Hyderabad | 2021–2024 (4) | 2021-10-03 | 2024-03-27 | 26 |  |
| `d7017798` | Angkrish Raghuvanshi | A Raghuvanshi | Angkrish | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2024–2026 (3) | 2024-03-29 | 2026-04-06 | 25 |  |
| `c33d8116` | Mohsin Khan | Mohsin Khan | — | Bowler | Lucknow Super Giants | Lucknow Super Giants | 2022–2026 (4) | 2022-03-28 | 2026-04-01 | 25 |  |
| `c7a995d3` | Sai Kishore | R Sai Kishore | — | All-rounder | Gujarat Titans | Gujarat Titans | 2022–2025 (3) | 2022-05-10 | 2025-05-30 | 25 |  |
| `c8f5f961` | Anuj Rawat | Anuj Rawat | — | WK-Batter | Royal Challengers Bengaluru | Rajasthan Royals, Royal Challengers Bangalore, Royal Challengers Bengaluru | 2021–2024 (4) | 2021-05-02 | 2024-04-15 | 24 |  |
| `84d9c311` | Ashutosh Sharma | Ashutosh Sharma | — | All-rounder | Delhi Capitals | Punjab Kings, Delhi Capitals | 2024–2025 (2) | 2024-04-04 | 2025-05-24 | 24 |  |
| `5d2eea49` | Kartik Tyagi | Kartik Tyagi | — | Bowler | Kolkata Knight Riders | Rajasthan Royals, Sunrisers Hyderabad, Gujarat Titans, Kolkata Knight Riders | 2020–2026 (6) | 2020-10-06 | 2026-04-06 | 23 |  |
| `14f96089` | Adam Zampa | A Zampa | — | Bowler | Sunrisers Hyderabad | Rising Pune Supergiant, Royal Challengers Bangalore, Rajasthan Royals, Sunrisers Hyderabad | 2016–2025 (5) | 2016-05-07 | 2025-03-27 | 22 |  |
| `9caf69a1` | Will Jacks | WG Jacks | — | All-rounder | Mumbai Indians | Royal Challengers Bengaluru, Mumbai Indians | 2024–2025 (2) | 2024-04-11 | 2025-05-26 | 21 |  |
| `4b31f3a3` | Yash Thakur | Yash Thakur | — | Bowler | Punjab Kings | Lucknow Super Giants, Punjab Kings | 2023–2025 (3) | 2023-04-03 | 2025-04-12 | 21 |  |
| `2cdce1be` | Chetan Sakariya | C Sakariya | — | Bowler | Kolkata Knight Riders | Rajasthan Royals, Delhi Capitals, Kolkata Knight Riders | 2021–2025 (4) | 2021-04-12 | 2025-04-26 | 20 |  |
| `81049310` | Jayant Yadav | J Yadav | — | All-rounder | Gujarat Titans | Delhi Daredevils, Mumbai Indians, Gujarat Titans | 2015–2023 (7) | 2015-05-09 | 2023-04-22 | 20 |  |
| `7d92277a` | Mujeeb Rahman | Mujeeb Ur Rahman | — | Bowler | Mumbai Indians | Kings XI Punjab, Sunrisers Hyderabad, Mumbai Indians | 2018–2025 (5) | 2018-04-08 | 2025-03-29 | 20 |  |
| `b5797845` | Priyansh Arya | Priyansh Arya | — | All-rounder | Punjab Kings | Punjab Kings | 2025–2026 (2) | 2025-03-25 | 2026-04-03 | 20 |  |
| `327b58d3` | Dushmantha Chameera | PVD Chameera | — | Bowler | Delhi Capitals | Lucknow Super Giants, Kolkata Knight Riders, Delhi Capitals | 2022–2025 (3) | 2022-03-28 | 2025-05-21 | 20 |  |
| `c5aef772` | Romario Shepherd | R Shepherd | — | All-rounder | Royal Challengers Bengaluru | Sunrisers Hyderabad, Lucknow Super Giants, Mumbai Indians, Royal Challengers Bengaluru | 2022–2026 (5) | 2022-03-29 | 2026-04-05 | 20 |  |
| `dc9dd038` | Sachin Baby | Sachin Baby | — | Batter | Sunrisers Hyderabad | Rajasthan Royals, Royal Challengers Bangalore, Sunrisers Hyderabad | 2013–2025 (5) | 2013-04-27 | 2025-05-05 | 20 |  |
| `12314277` | Arshad Khan | Arshad Khan | — | Bowler | Gujarat Titans | Mumbai Indians, Lucknow Super Giants, Gujarat Titans | 2023–2025 (3) | 2023-04-02 | 2025-05-25 | 19 |  |
| `f834dcfc` | Lungisani Ngidi | L Ngidi | — | Bowler | Delhi Capitals | Chennai Super Kings, Royal Challengers Bengaluru, Delhi Capitals | 2018–2026 (5) | 2018-04-30 | 2026-04-08 | 19 |  |
| `54e52590` | Vijaykumar Vyshak | Vijaykumar Vyshak | — | Bowler | Punjab Kings | Royal Challengers Bangalore, Royal Challengers Bengaluru, Punjab Kings | 2023–2026 (4) | 2023-04-15 | 2026-04-06 | 19 | ✅ |
| `ba5e1069` | Rachin Ravindra | R Ravindra | — | All-rounder | Chennai Super Kings | Chennai Super Kings | 2024–2025 (2) | 2024-03-22 | 2025-04-20 | 18 |  |
| `0bacade8` | Rahmanullah Gurbaz | Rahmanullah Gurbaz | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2023–2025 (3) | 2023-04-01 | 2025-05-07 | 18 | ✅ |
| `4bd09374` | Akash Madhwal | Akash Madhwal | — | Bowler | Rajasthan Royals | Mumbai Indians, Rajasthan Royals | 2023–2025 (3) | 2023-05-03 | 2025-05-20 | 17 |  |
| `a3b0600d` | Aniket Verma | Aniket Verma | — | Batter | Sunrisers Hyderabad | Sunrisers Hyderabad | 2025–2026 (2) | 2025-03-23 | 2026-04-05 | 17 |  |
| `8f6dd463` | Azmatullah Omarzai | Azmatullah Omarzai | — | All-rounder | Punjab Kings | Gujarat Titans, Punjab Kings | 2024–2025 (2) | 2024-03-24 | 2025-06-03 | 17 |  |
| `9eb1455b` | Nathan Ellis | NT Ellis | — | Bowler | Chennai Super Kings | Punjab Kings, Chennai Super Kings | 2021–2025 (5) | 2021-09-25 | 2025-03-23 | 17 |  |
| `e66732f8` | Ryan Rickelton | RD Rickelton | — | WK-Batter | Mumbai Indians | Mumbai Indians | 2025–2026 (2) | 2025-03-23 | 2026-04-07 | 17 |  |
| `f89d3b11` | Sameer Rizvi | Sameer Rizvi | — | All-rounder | Delhi Capitals | Chennai Super Kings, Delhi Capitals | 2024–2026 (3) | 2024-03-22 | 2026-04-08 | 17 |  |
| `5ffc0565` | Vipraj Nigam | V Nigam | — | All-rounder | Delhi Capitals | Delhi Capitals | 2025–2026 (2) | 2025-03-24 | 2026-04-08 | 17 |  |
| `844e79d1` | Dewald Brevis | D Brevis | — | Batter | Chennai Super Kings | Mumbai Indians, Chennai Super Kings | 2022–2025 (3) | 2022-04-06 | 2025-05-25 | 16 |  |
| `f6d8a7ab` | Kumar Kartikeya | K Kartikeya | — | Bowler | Rajasthan Royals | Mumbai Indians, Rajasthan Royals | 2022–2025 (3) | 2022-04-30 | 2025-05-01 | 16 |  |
| `765a4731` | Mukesh Choudhary | Mukesh Choudhary | Mukesh | Bowler | Chennai Super Kings | Chennai Super Kings | 2022–2025 (3) | 2022-03-31 | 2025-04-08 | 16 |  |
| `9b6e1b3f` | Jake Fraser-McGurk | J Fraser-McGurk | — | Batter | Delhi Capitals | Delhi Capitals | 2024–2025 (2) | 2024-04-12 | 2025-04-16 | 15 |  |
| `fcc21ace` | Anshul Kamboj | A Kamboj | — | Bowler | Chennai Super Kings | Mumbai Indians, Chennai Super Kings | 2024–2026 (3) | 2024-05-06 | 2026-04-05 | 14 |  |
| `0a67aec0` | Akash Deep | Akash Deep | — | All-rounder | Lucknow Super Giants | Royal Challengers Bangalore, Royal Challengers Bengaluru, Lucknow Super Giants | 2022–2025 (4) | 2022-03-27 | 2025-05-22 | 14 | ✅ |
| `e4cdf230` | Anukul Roy | AS Roy | — | All-rounder | Kolkata Knight Riders | Mumbai Indians, Kolkata Knight Riders | 2019–2026 (6) | 2019-04-26 | 2026-04-06 | 14 |  |
| `13fc5c6d` | Digvesh Rathi | DS Rathi | — | Bowler | Lucknow Super Giants | Lucknow Super Giants | 2025–2026 (2) | 2025-03-24 | 2026-04-05 | 14 |  |
| `3204c99f` | Gerald Coetzee | G Coetzee | — | Bowler | Gujarat Titans | Mumbai Indians, Gujarat Titans | 2024–2025 (2) | 2024-03-24 | 2025-05-30 | 14 |  |
| `30df8c66` | Simarjeet Singh | Simarjeet Singh | — | Bowler | Sunrisers Hyderabad | Chennai Super Kings, Sunrisers Hyderabad | 2022–2025 (3) | 2022-05-01 | 2025-04-06 | 14 | ✅ |
| `983f2f61` | Swapnil Singh | Swapnil Singh | — | All-rounder | Royal Challengers Bengaluru | Kings XI Punjab, Lucknow Super Giants, Royal Challengers Bengaluru | 2016–2024 (4) | 2016-05-04 | 2024-05-22 | 14 |  |
| `68c56d09` | Kyle Jamieson | KA Jamieson | — | Bowler | Punjab Kings | Royal Challengers Bangalore, Punjab Kings | 2021–2025 (2) | 2021-04-09 | 2025-06-03 | 13 |  |
| `b8527c3d` | Rasikh Salam | Rasikh Salam | — | All-rounder | Royal Challengers Bengaluru | Mumbai Indians, Kolkata Knight Riders, Delhi Capitals, Royal Challengers Bengaluru | 2019–2025 (4) | 2019-03-24 | 2025-04-02 | 13 |  |
| `6b2ff18f` | Shubham Dubey | SB Dubey | — | Batter | Rajasthan Royals | Rajasthan Royals | 2024–2025 (2) | 2024-04-01 | 2025-05-18 | 13 |  |
| `378daa89` | Aman Khan | Aman Hakim Khan | — | Batter | Delhi Capitals | Kolkata Knight Riders, Delhi Capitals | 2022–2023 (2) | 2022-04-15 | 2023-05-20 | 12 |  |
| `e9c7f0d0` | Fazalhaq Farooqi | Fazalhaq Farooqi | — | All-rounder | Rajasthan Royals | Sunrisers Hyderabad, Rajasthan Royals | 2022–2025 (3) | 2022-05-08 | 2025-05-18 | 12 |  |
| `989889ff` | Josh Inglis | JP Inglis | — | Batter | Punjab Kings | Punjab Kings | 2025 | 2025-04-15 | 2025-06-03 | 12 |  |
| `2e78f685` | Kuldeep Sen | KR Sen | — | Bowler | Rajasthan Royals | Rajasthan Royals | 2022–2024 (3) | 2022-04-10 | 2024-04-16 | 12 |  |
| `9a46c4e5` | Glenn Phillips | GD Phillips | — | Batter | Gujarat Titans | Rajasthan Royals, Sunrisers Hyderabad, Gujarat Titans | 2021–2026 (3) | 2021-10-02 | 2026-04-08 | 11 |  |
| `b2b4f545` | Ayush Mhatre | A Mhatre | — | Batter | Chennai Super Kings | Chennai Super Kings | 2025–2026 (2) | 2025-04-20 | 2026-04-05 | 10 |  |
| `350bb1b1` | Adam Milne | AF Milne | — | Bowler | Chennai Super Kings | Royal Challengers Bangalore, Mumbai Indians, Chennai Super Kings | 2016–2022 (4) | 2016-04-12 | 2022-03-26 | 10 |  |
| `b483905d` | Akash Singh | Akash Singh | — | Bowler | Lucknow Super Giants | Rajasthan Royals, Chennai Super Kings, Lucknow Super Giants | 2021–2025 (3) | 2021-10-02 | 2025-05-27 | 10 | ✅ |
| `1ac746c8` | Atharva Taide | Atharva Taide | — | Batter | Sunrisers Hyderabad | Punjab Kings, Sunrisers Hyderabad | 2023–2025 (3) | 2023-04-15 | 2025-05-19 | 10 |  |
| `5750bcb4` | Eshan Malinga | E Malinga | — | Bowler | Sunrisers Hyderabad | Sunrisers Hyderabad | 2025–2026 (2) | 2025-04-12 | 2026-04-05 | 10 |  |
| `470f446b` | Vaibhav Suryavanshi | V Suryavanshi | — | Batter | Rajasthan Royals | Rajasthan Royals | 2025–2026 (2) | 2025-04-19 | 2026-04-07 | 10 |  |
| `36619795` | Zeeshan Ansari | Zeeshan Ansari | — | Bowler | Sunrisers Hyderabad | Sunrisers Hyderabad | 2025 | 2025-03-30 | 2025-05-19 | 10 |  |
| `e84ac20c` | Matt Henry | MJ Henry | — | Bowler | Chennai Super Kings | Kings XI Punjab, Lucknow Super Giants, Chennai Super Kings | 2017–2026 (3) | 2017-05-09 | 2026-04-05 | 9 |  |
| `83c3e8e3` | Spencer Johnson | SH Johnson | — | Batter | Kolkata Knight Riders | Gujarat Titans, Kolkata Knight Riders | 2024–2025 (2) | 2024-03-24 | 2025-04-08 | 9 |  |
| `4885bbe6` | Yudhvir Singh | Yudhvir Singh | — | All-rounder | Rajasthan Royals | Lucknow Super Giants, Rajasthan Royals | 2023–2025 (3) | 2023-04-15 | 2025-05-20 | 9 |  |
| `fa2f1dde` | Kulwant Khejroliya | K Khejroliya | — | Bowler | Gujarat Titans | Royal Challengers Bangalore, Kolkata Knight Riders, Gujarat Titans | 2018–2025 (4) | 2018-04-08 | 2025-04-09 | 8 |  |
| `465aa633` | Nandre Burger | N Burger | — | Bowler | Rajasthan Royals | Rajasthan Royals | 2024–2026 (2) | 2024-03-24 | 2026-04-07 | 8 |  |
| `ee1b6c27` | Nuwan Thushara | N Thushara | — | Bowler | Royal Challengers Bengaluru | Mumbai Indians, Royal Challengers Bengaluru | 2024–2025 (2) | 2024-04-22 | 2025-05-27 | 8 |  |
| `80b2fb19` | Prince Yadav | Prince Yadav | — | Bowler | Lucknow Super Giants | Lucknow Super Giants | 2025–2026 (2) | 2025-03-24 | 2026-04-05 | 8 |  |
| `d45c29b1` | Ashwani Kumar | Ashwani Kumar | — | Bowler | Mumbai Indians | Mumbai Indians | 2025 | 2025-03-31 | 2025-06-01 | 7 |  |
| `a90e53ec` | Matthew Short | MW Short | — | All-rounder | Chennai Super Kings | Punjab Kings, Chennai Super Kings | 2023–2026 (2) | 2023-04-09 | 2026-03-30 | 7 |  |
| `3b53243a` | Xavier Bartlett | XC Bartlett | — | Bowler | Punjab Kings | Punjab Kings | 2025–2026 (2) | 2025-04-15 | 2026-04-06 | 7 |  |
| `25228673` | Harsh Dubey | Harsh Dubey | — | All-rounder | Sunrisers Hyderabad | Sunrisers Hyderabad | 2025–2026 (2) | 2025-05-19 | 2026-04-05 | 6 |  |
| `cf0ccafa` | M. Siddharth | M Siddharth | — | Bowler | Lucknow Super Giants | Lucknow Super Giants | 2024–2026 (3) | 2024-03-30 | 2026-04-05 | 6 |  |
| `b1ad996b` | Mayank Yadav | MP Yadav | — | Bowler | Lucknow Super Giants | Lucknow Super Giants | 2024–2025 (2) | 2024-03-30 | 2025-05-04 | 6 |  |
| `8db7f47f` | Reece Topley | RJW Topley | — | Bowler | Mumbai Indians | Royal Challengers Bangalore, Royal Challengers Bengaluru, Mumbai Indians | 2023–2025 (3) | 2023-04-02 | 2025-06-01 | 6 |  |
| `0494fa6e` | Vishnu Vinod | Vishnu Vinod | — | Batter | Mumbai Indians | Royal Challengers Bangalore, Mumbai Indians | 2017–2023 (2) | 2017-04-08 | 2023-05-26 | 6 | ✅ |
| `44aac2f0` | Arjun Tendulkar | Arjun Tendulkar | — | Bowler | Mumbai Indians | Mumbai Indians | 2023–2024 (2) | 2023-04-16 | 2024-05-17 | 5 |  |
| `f0af99a7` | Donovan Ferreira | D Ferreira | — | Batter | Rajasthan Royals | Rajasthan Royals, Delhi Capitals | 2024–2026 (3) | 2024-05-07 | 2026-04-07 | 5 |  |
| `59559bc2` | Jamie Overton | J Overton | — | All-rounder | Chennai Super Kings | Chennai Super Kings | 2025–2026 (2) | 2025-03-30 | 2026-04-05 | 5 |  |
| `57ca01b3` | Kumar Kushagra | Kumar Kushagra | — | WK-Batter | Gujarat Titans | Delhi Capitals, Gujarat Titans | 2024–2026 (2) | 2024-04-07 | 2026-04-04 | 5 |  |
| `ed5a5510` | Pravin Dubey | P Dubey | — | Batter | Punjab Kings | Delhi Capitals, Punjab Kings | 2020–2025 (3) | 2020-10-31 | 2025-05-24 | 5 |  |
| `08548b13` | PHKD Mendis | PHKD Mendis | — | All-rounder | Sunrisers Hyderabad | Sunrisers Hyderabad | 2025 | 2025-04-03 | 2025-05-19 | 5 |  |
| `ba6b2f91` | Raj Angad Bawa | RA Bawa | — | All-rounder | Mumbai Indians | Punjab Kings, Mumbai Indians | 2022–2025 (2) | 2022-03-27 | 2025-06-01 | 5 |  |
| `cbf58a86` | Sheikh Rasheed | SK Rasheed | — | Batter | Chennai Super Kings | Chennai Super Kings | 2025 | 2025-04-14 | 2025-05-03 | 5 |  |
| `970ddd24` | Suryansh Shedge | Suryansh Shedge | — | All-rounder | Punjab Kings | Punjab Kings | 2025 | 2025-03-25 | 2025-04-30 | 5 | ✅ |
| `1e030637` | Vignesh Puthur | V Puthur | — | Batter | Mumbai Indians | Mumbai Indians | 2025 | 2025-03-23 | 2025-04-23 | 5 |  |
| `172dff15` | Corbin Bosch | C Bosch | — | All-rounder | Mumbai Indians | Mumbai Indians | 2025–2026 (2) | 2025-04-27 | 2026-04-04 | 4 |  |
| `107c26fb` | Kwena Maphaka | KT Maphaka | — | Batter | Rajasthan Royals | Mumbai Indians, Rajasthan Royals | 2024–2025 (2) | 2024-03-27 | 2025-05-20 | 4 |  |
| `50c09020` | Ashok Sharma | Ashok Sharma | — | Bowler | Gujarat Titans | Gujarat Titans | 2026 | 2026-03-31 | 2026-04-08 | 3 |  |
| `249d60c9` | Adil Rashid | AU Rashid | — | Bowler | Sunrisers Hyderabad | Punjab Kings, Sunrisers Hyderabad | 2021–2023 (2) | 2021-09-21 | 2023-04-07 | 3 |  |
| `fe366f34` | Cooper Connolly | C Connolly | — | All-rounder | Punjab Kings | Punjab Kings | 2026 | 2026-03-31 | 2026-04-06 | 3 |  |
| `bf74b130` | Finn Allen | FH Allen | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2026 | 2026-03-29 | 2026-04-06 | 3 |  |
| `ebcfef83` | Himmat Singh | Himmat Singh | — | Batter | Lucknow Super Giants | Lucknow Super Giants | 2025 | 2025-04-12 | 2025-05-27 | 3 |  |
| `7b679de5` | Kartik Sharma | Kartik Sharma | — | Batter | Chennai Super Kings | Chennai Super Kings | 2026 | 2026-03-30 | 2026-04-05 | 3 |  |
| `3ff033bb` | Dasun Shanaka | MD Shanaka | — | All-rounder | Gujarat Titans | Gujarat Titans | 2023 | 2023-05-15 | 2023-05-23 | 3 |  |
| `8ee36b18` | Pathum Nissanka | P Nissanka | — | Batter | Delhi Capitals | Delhi Capitals | 2026 | 2026-04-01 | 2026-04-08 | 3 |  |
| `402f8494` | Richard Gleeson | RJ Gleeson | — | Batter | Mumbai Indians | Chennai Super Kings, Mumbai Indians | 2024–2025 (2) | 2024-05-01 | 2025-05-30 | 3 |  |
| `4663bd23` | Tim Seifert | TL Seifert | — | WK-Batter | Delhi Capitals | Kolkata Knight Riders, Delhi Capitals | 2021–2022 (2) | 2021-10-01 | 2022-04-02 | 3 |  |
| `cf59b3f0` | Urvil Patel | Urvil Patel | — | Batter | Chennai Super Kings | Chennai Super Kings | 2025 | 2025-05-07 | 2025-05-25 | 3 |  |
| `cb9b8664` | W O'Rourke | W O'Rourke | — | Batter | Lucknow Super Giants | Lucknow Super Giants | 2025 | 2025-05-19 | 2025-05-27 | 3 |  |
| `2d140b79` | Arshin Kulkarni | AA Kulkarni | — | Batter | Lucknow Super Giants | Lucknow Super Giants | 2024 | 2024-04-30 | 2024-05-05 | 2 |  |
| `82c10dac` | Abinandan Singh | Abhinandan Singh | — | Batter | Royal Challengers Bengaluru | Royal Challengers Bengaluru | 2026 | 2026-03-28 | 2026-04-05 | 2 |  |
| `9ca68676` | Allah Ghazanfar | AM Ghazanfar | — | Batter | Mumbai Indians | Mumbai Indians | 2026 | 2026-03-29 | 2026-04-07 | 2 |  |
| `449f4e3c` | Blessing Muzarabani | B Muzarabani | — | Bowler | Kolkata Knight Riders | Kolkata Knight Riders | 2026 | 2026-03-29 | 2026-04-02 | 2 |  |
| `6c79c098` | David Payne | DA Payne | — | All-rounder | Sunrisers Hyderabad | Sunrisers Hyderabad | 2026 | 2026-03-28 | 2026-04-02 | 2 |  |
| `dadbdb68` | Jacob Duffy | JA Duffy | — | Batter | Royal Challengers Bengaluru | Royal Challengers Bengaluru | 2026 | 2026-03-28 | 2026-04-05 | 2 |  |
| `3c55c703` | Jacob Bethell | JG Bethell | — | Batter | Royal Challengers Bengaluru | Royal Challengers Bengaluru | 2025 | 2025-04-27 | 2025-05-03 | 2 |  |
| `65b6943c` | Luke Wood | L Wood | — | Bowler | Mumbai Indians | Mumbai Indians | 2024 | 2024-03-24 | 2024-04-27 | 2 |  |
| `fb5f69e4` | Madhav Tiwari | M Tiwari | — | Batter | Delhi Capitals | Delhi Capitals | 2025 | 2025-05-08 | 2025-05-21 | 2 |  |
| `1c84109e` | Mukul Choudhary | MD Choudhary | — | Batter | Lucknow Super Giants | Lucknow Super Giants | 2026 | 2026-04-01 | 2026-04-05 | 2 |  |
| `c695b423` | Prashant Solanki | PH Solanki | — | Batter | Chennai Super Kings | Chennai Super Kings | 2022 | 2022-05-15 | 2022-05-20 | 2 |  |
| `e148e6bd` | Prashant Veer | PR Veer | — | Batter | Chennai Super Kings | Chennai Super Kings | 2026 | 2026-04-03 | 2026-04-05 | 2 |  |
| `c27b5a0e` | PVSN Raju | PVSN Raju | — | Batter | Mumbai Indians | Mumbai Indians | 2025 | 2025-03-23 | 2025-03-29 | 2 |  |
| `bafd0398` | Robin Minz | R Minz | — | WK-Batter | Mumbai Indians | Mumbai Indians | 2025 | 2025-03-23 | 2025-03-29 | 2 |  |
| `d7423da1` | Salil Arora | S Arora | — | Batter | Sunrisers Hyderabad | Sunrisers Hyderabad | 2026 | 2026-03-28 | 2026-04-02 | 2 |  |
| `7b44eb3e` | Shivang Kumar | Shivang Kumar | — | All-rounder | Sunrisers Hyderabad | Sunrisers Hyderabad | 2026 | 2026-04-02 | 2026-04-05 | 2 |  |
| `25f7b7d6` | Tom Banton | T Banton | — | WK-Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2020 | 2020-10-12 | 2020-10-21 | 2 |  |
| `4d7f517e` | Akeal Hosein | AJ Hosein | — | Batter | Sunrisers Hyderabad | Sunrisers Hyderabad | 2023 | 2023-04-29 | 2023-04-29 | 1 |  |
| `5d1e7582` | Kusal Mendis | BKG Mendis | — | Batter | Gujarat Titans | Gujarat Titans | 2025 | 2025-05-30 | 2025-05-30 | 1 |  |
| `133bbd61` | Brijesh Sharma | Brijesh Sharma | — | Bowler | Rajasthan Royals | Rajasthan Royals | 2026 | 2026-03-30 | 2026-03-30 | 1 |  |
| `19b9f399` | Cameron Green | CJ Green | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2020 | 2020-10-16 | 2020-10-16 | 1 |  |
| `99258814` | Gurnoor Singh Brar | Gurnoor Brar | — | Batter | Punjab Kings | Punjab Kings | 2023 | 2023-04-28 | 2023-04-28 | 1 | ✅ |
| `62175638` | Karim Janat | Karim Janat | — | Batter | Gujarat Titans | Gujarat Titans | 2025 | 2025-04-28 | 2025-04-28 | 1 |  |
| `e3851766` | KS Rathore | KS Rathore | — | Batter | Rajasthan Royals | Rajasthan Royals | 2025 | 2025-05-04 | 2025-05-04 | 1 |  |
| `f2c936d7` | Mitch Owen | MJ Owen | — | Batter | Punjab Kings | Punjab Kings | 2025 | 2025-05-18 | 2025-05-18 | 1 |  |
| `025c4400` | Manav Suthar | MJ Suthar | — | Batter | Gujarat Titans | Gujarat Titans | 2024 | 2024-05-04 | 2024-05-04 | 1 |  |
| `35f173a0` | Matthew Breetzke | MP Breetzke | — | Batter | Lucknow Super Giants | Lucknow Super Giants | 2025 | 2025-05-27 | 2025-05-27 | 1 |  |
| `e96801ea` | Manoj Bhandage | MS Bhandage | — | Batter | Royal Challengers Bengaluru | Royal Challengers Bengaluru | 2025 | 2025-04-18 | 2025-04-18 | 1 |  |
| `d621b427` | Musheer Khan | Musheer Khan | — | All-rounder | Punjab Kings | Punjab Kings | 2025 | 2025-05-29 | 2025-05-29 | 1 |  |
| `c96f6ac5` | Wiaan Mulder | PWA Mulder | — | Batter | Sunrisers Hyderabad | Sunrisers Hyderabad | 2025 | 2025-03-30 | 2025-03-30 | 1 |  |
| `3c28853f` | Sediqullah Atal | Sediqullah Atal | — | Batter | Delhi Capitals | Delhi Capitals | 2025 | 2025-05-24 | 2025-05-24 | 1 | ✅ |
| `7dfe38f1` | Atharva Ankolekar | A Ankolekar | — | All-rounder | Mumbai Indians | Mumbai Indians | 2026 | None | None | 0 |  |
| `e6ef8352` | Amit Kumar | A Kumar | — | Bowler | Sunrisers Hyderabad | Sunrisers Hyderabad | 2026 | None | None | 0 |  |
| `63b8b718` | Ajay Mandal | A Mandal | — | All-rounder | Delhi Capitals | Delhi Capitals | 2026 | None | None | 0 |  |
| `38bab168` | Auqib Nabi | A Nabi | — | Bowler | Delhi Capitals | Delhi Capitals | 2026 | None | None | 0 |  |
| `1f767817` | Aman Rao Perala | A Perala | — | Batter | Rajasthan Royals | Rajasthan Royals | 2026 | None | None | 0 |  |
| `b942fc3f` | Akshat Raghuwanshi | A Raghuwanshi | — | Batter | Lucknow Super Giants | Lucknow Super Giants | 2026 | None | None | 0 |  |
| `8d8c2b3f` | Brydon Carse | B Carse | — | All-rounder | Sunrisers Hyderabad | Sunrisers Hyderabad | 2026 | None | None | 0 |  |
| `71e3501e` | Ben Dwarshuis | B Dwarshuis | — | All-rounder | Punjab Kings | Punjab Kings | 2026 | None | None | 0 |  |
| `0bb36925` | Daksh Kamra | D Kamra | — | All-rounder | Kolkata Knight Riders | Kolkata Knight Riders | 2026 | None | None | 0 |  |
| `5bedb87a` | Danish Malewar | D Malewar | — | Batter | Mumbai Indians | Mumbai Indians | 2026 | None | None | 0 |  |
| `3a8f4019` | Digvesh Singh | D Singh | — | Bowler | Lucknow Super Giants | Lucknow Super Giants | 2026 | None | None | 0 |  |
| `eba59a0e` | Gurjapneet Singh | G Singh | — | Bowler | Chennai Super Kings | Chennai Super Kings | 2026 | None | None | 0 |  |
| `91c07fb6` | Harnoor Pannu | H Pannu | — | Batter | Punjab Kings | Punjab Kings | 2026 | None | None | 0 |  |
| `6f567af0` | Jordan Cox | J Cox | — | WK-Batter | Royal Challengers Bengaluru | Royal Challengers Bengaluru | 2026 | None | None | 0 |  |
| `623f9221` | Kanishk Chouhan | K Chouhan | — | All-rounder | Royal Challengers Bengaluru | Royal Challengers Bengaluru | 2026 | None | None | 0 |  |
| `ebcaf937` | Krains Fuletra | K Fuletra | — | All-rounder | Sunrisers Hyderabad | Sunrisers Hyderabad | 2026 | None | None | 0 |  |
| `ecd2aebf` | Kamindu Mendis | K Mendis | — | All-rounder | Sunrisers Hyderabad | Sunrisers Hyderabad | 2026 | None | None | 0 |  |
| `4b1badec` | Lhuan-Dre Pretorius | L Pretorius | — | Batter | Rajasthan Royals | Rajasthan Royals | 2026 | None | None | 0 |  |
| `067680c2` | Mohammad Izhar | M Izhar | — | Bowler | Mumbai Indians | Mumbai Indians | 2026 | None | None | 0 |  |
| `d0f3a5a0` | Mahesh Rawat | M Rawat | — | All-rounder | Mumbai Indians | Mumbai Indians | 2026 | None | None | 0 |  |
| `36e6562a` | Mangesh Yadav | M Yadav | — | All-rounder | Royal Challengers Bengaluru | Royal Challengers Bengaluru | 2026 | None | None | 0 |  |
| `86665815` | Nishant Sindhu | N Sindhu | — | All-rounder | Gujarat Titans | Gujarat Titans | 2026 | None | None | 0 |  |
| `3889df4b` | Naman Tiwari | N Tiwari | — | Bowler | Lucknow Super Giants | Lucknow Super Giants | 2026 | None | None | 0 |  |
| `f9853f38` | Onkar Tarmale | O Tarmale | — | Bowler | Sunrisers Hyderabad | Sunrisers Hyderabad | 2026 | None | None | 0 |  |
| `7949f0b8` | Pyla Avinash | P Avinash | — | Batter | Punjab Kings | Punjab Kings | 2026 | None | None | 0 |  |
| `d9a98aa7` | Praful Hinge | P Hinge | — | Bowler | Sunrisers Hyderabad | Sunrisers Hyderabad | 2026 | None | None | 0 |  |
| `7afc48d3` | Rasikh Dar | R Dar | — | Bowler | Royal Challengers Bengaluru | Royal Challengers Bengaluru | 2026 | None | None | 0 |  |
| `458c01e0` | Ramakrishna Ghosh | R Ghosh | — | All-rounder | Chennai Super Kings | Chennai Super Kings | 2026 | None | None | 0 |  |
| `f889cee8` | Raghu Sharma | R Sharma | — | Bowler | Mumbai Indians | Mumbai Indians | 2026 | None | None | 0 |  |
| `5434fdfa` | Ravi Singh | R Singh | — | Batter | Rajasthan Royals | Rajasthan Royals | 2026 | None | None | 0 |  |
| `ba59a81f` | Shahbaz Ahamad | S Ahamad | — | All-rounder | Lucknow Super Giants | Lucknow Super Giants | 2026 | None | None | 0 |  |
| `1d90af1b` | Satvik Deswal | S Deswal | — | All-rounder | Royal Challengers Bengaluru | Royal Challengers Bengaluru | 2026 | None | None | 0 |  |
| `788ecdc0` | Saurabh Dubey | S Dubey | — | Bowler | Kolkata Knight Riders | Kolkata Knight Riders | 2026 | None | None | 0 |  |
| `0b3902e4` | Sakib Hussain | S Hussain | — | Bowler | Sunrisers Hyderabad | Sunrisers Hyderabad | 2026 | None | None | 0 |  |
| `816816ea` | Shahrukh Khan | S Khan | — | All-rounder | Gujarat Titans | Gujarat Titans | 2026 | None | None | 0 |  |
| `89177066` | Sushant Mishra | S Mishra | — | Bowler | Rajasthan Royals | Rajasthan Royals | 2026 | None | None | 0 |  |
| `85dd2508` | Sahil Parakh | S Parakh | — | Batter | Delhi Capitals | Delhi Capitals | 2026 | None | None | 0 |  |
| `823979da` | Sarthak Ranjan | S Ranjan | — | All-rounder | Kolkata Knight Riders | Kolkata Knight Riders | 2026 | None | None | 0 |  |
| `3bd1ae05` | Smaran Ravichandran | S Ravichandran | — | Batter | Sunrisers Hyderabad | Sunrisers Hyderabad | 2026 | None | None | 0 |  |
| `23aab12a` | Tejasvi Singh | T Singh | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2026 | None | None | 0 |  |
| `26f86502` | Tripurana Vijay | T Vijay | — | All-rounder | Delhi Capitals | Delhi Capitals | 2026 | None | None | 0 |  |
| `1f3794c9` | Varun Chakaravarthy | V Chakaravarthy | — | Bowler | Kolkata Knight Riders | Kolkata Knight Riders | 2026 | None | None | 0 |  |
| `c781f669` | Vihaan Malhotra | V Malhotra | — | All-rounder | Royal Challengers Bengaluru | Royal Challengers Bengaluru | 2026 | None | None | 0 |  |
| `f2c56766` | Vishal Nishad | V Nishad | — | Bowler | Punjab Kings | Punjab Kings | 2026 | None | None | 0 |  |
| `49e47624` | Vicky Ostwal | V Ostwal | — | All-rounder | Royal Challengers Bengaluru | Royal Challengers Bengaluru | 2026 | None | None | 0 |  |
| `c7978e07` | Vyshak Vijaykumar | V Vijaykumar | — | Bowler | Punjab Kings | Punjab Kings | 2026 | None | None | 0 |  |
| `2a34b4c7` | Wanindu Hasaranga | W Hasaranga | — | All-rounder | Lucknow Super Giants | Lucknow Super Giants | 2026 | None | None | 0 |  |
| `ad90a455` | Yudhvir Singh Charak | Y Charak | — | All-rounder | Rajasthan Royals | Rajasthan Royals | 2026 | None | None | 0 |  |
| `6556c501` | Yash Raj Punja | Y Punja | — | Bowler | Rajasthan Royals | Rajasthan Royals | 2026 | None | None | 0 |  |
| `f020f230` | Zak Foulkes | Z Foulkes | — | All-rounder | Chennai Super Kings | Chennai Super Kings | 2026 | None | None | 0 |  |

### Inactive players (75)

| ID | Name | Short Name | Nicknames | Role | Last Team | All Teams | Seasons | First Match | Last Match | M | Repl |
|---|---|---|---|---|---|---|---|---|---|---:|:-:|
| `dcce6f09` | David Warner | DA Warner | Bull, David Warner | Batter | Delhi Capitals | Delhi Daredevils, Sunrisers Hyderabad, Delhi Capitals | 2009–2024 (15) | 2009-05-02 | 2024-05-12 | 184 |  |
| `cc1e8c68` | Umesh Yadav | UT Yadav | Umesh Yadav | Bowler | Gujarat Titans | Delhi Daredevils, Kolkata Knight Riders, Royal Challengers Bangalore, Gujarat Titans | 2010–2024 (14) | 2010-03-19 | 2024-05-10 | 148 |  |
| `c3a96caf` | Mandeep Singh | Mandeep Singh | Mandeep | Batter | Kolkata Knight Riders | Kolkata Knight Riders, Kings XI Punjab, Royal Challengers Bangalore, Punjab Kings, Delhi Capitals | 2010–2023 (14) | 2010-03-22 | 2023-04-20 | 111 |  |
| `d027ba9f` | Kane Williamson | KS Williamson | Kane Williamson, Steady Kane | Batter | Gujarat Titans | Sunrisers Hyderabad, Gujarat Titans | 2015–2024 (10) | 2015-04-11 | 2024-04-07 | 79 |  |
| `c03e2850` | Manan Vohra | M Vohra | — | Batter | Lucknow Super Giants | Kings XI Punjab, Royal Challengers Bangalore, Rajasthan Royals, Lucknow Super Giants | 2013–2023 (9) | 2013-04-07 | 2023-05-03 | 56 |  |
| `13c35c9e` | Tim Southee | TG Southee | — | Bowler | Kolkata Knight Riders | Chennai Super Kings, Rajasthan Royals, Mumbai Indians, Royal Challengers Bangalore, Kolkata Knight Riders | 2011–2023 (10) | 2011-04-08 | 2023-04-06 | 54 |  |
| `e087956b` | Ben Stokes | BA Stokes | — | All-rounder | Chennai Super Kings | Rising Pune Supergiant, Rajasthan Royals, Chennai Super Kings | 2017–2023 (6) | 2017-04-06 | 2023-04-03 | 45 |  |
| `e2db2409` | Murugan Ashwin | M Ashwin | — | Bowler | Rajasthan Royals | Rising Pune Supergiant, Royal Challengers Bangalore, Kings XI Punjab, Punjab Kings, Mumbai Indians, Rajasthan Royals | 2016–2023 (7) | 2016-04-09 | 2023-05-07 | 44 |  |
| `26a85969` | Rishi Dhawan | R Dhawan | — | Bowler | Punjab Kings | Mumbai Indians, Kings XI Punjab, Punjab Kings | 2013–2024 (7) | 2013-04-09 | 2024-05-19 | 39 |  |
| `ffe699c0` | Chris Jordan | CJ Jordan | — | Bowler | Mumbai Indians | Royal Challengers Bangalore, Sunrisers Hyderabad, Kings XI Punjab, Punjab Kings, Chennai Super Kings, Mumbai Indians | 2016–2023 (7) | 2016-05-07 | 2023-05-26 | 34 |  |
| `3a60e0b5` | Wayne Parnell | WD Parnell | — | Bowler | Royal Challengers Bangalore | Pune Warriors, Delhi Daredevils, Royal Challengers Bangalore | 2011–2023 (5) | 2011-04-10 | 2023-05-21 | 33 |  |
| `ad427b5c` | Lalit Yadav | Lalit Yadav | — | All-rounder | Delhi Capitals | Delhi Capitals | 2021–2024 (4) | 2021-04-15 | 2024-04-20 | 27 |  |
| `62af8546` | Mohammad Nabi | Mohammad Nabi | — | All-rounder | Mumbai Indians | Sunrisers Hyderabad, Mumbai Indians | 2017–2024 (6) | 2017-04-17 | 2024-04-30 | 24 |  |
| `bb965e9a` | Priyam Garg | PK Garg | — | Batter | Delhi Capitals | Sunrisers Hyderabad, Delhi Capitals | 2020–2023 (4) | 2020-09-21 | 2023-05-02 | 23 |  |
| `b0946605` | Alzarri Joseph | AS Joseph | — | Bowler | Royal Challengers Bengaluru | Mumbai Indians, Gujarat Titans, Royal Challengers Bengaluru | 2019–2024 (4) | 2019-04-06 | 2024-03-29 | 22 |  |
| `cad00a4d` | Rilee Rossouw | RR Rossouw | — | Batter | Punjab Kings | Royal Challengers Bangalore, Delhi Capitals, Punjab Kings | 2014–2024 (4) | 2014-05-04 | 2024-05-19 | 22 |  |
| `d1c36f5c` | Jason Roy | JJ Roy | — | Batter | Kolkata Knight Riders | Gujarat Lions, Delhi Daredevils, Sunrisers Hyderabad, Kolkata Knight Riders | 2017–2023 (4) | 2017-04-07 | 2023-05-20 | 21 |  |
| `aa8d28ae` | David Wiese | D Wiese | — | Bowler | Kolkata Knight Riders | Royal Challengers Bangalore, Kolkata Knight Riders | 2015–2023 (3) | 2015-04-19 | 2023-04-29 | 18 |  |
| `c0c411cb` | Naveen-ul-Haq | Naveen-ul-Haq | — | Bowler | Lucknow Super Giants | Lucknow Super Giants | 2023–2024 (2) | 2023-04-19 | 2024-05-17 | 18 |  |
| `64775749` | Riley Meredith | RP Meredith | — | Bowler | Mumbai Indians | Punjab Kings, Mumbai Indians | 2021–2023 (3) | 2021-04-12 | 2023-04-30 | 18 |  |
| `4933f499` | Jason Behrendorff | JP Behrendorff | — | Bowler | Mumbai Indians | Mumbai Indians | 2019–2023 (2) | 2019-04-03 | 2023-05-26 | 17 |  |
| `eade4650` | Daryl Mitchell | DJ Mitchell | — | All-rounder | Chennai Super Kings | Rajasthan Royals, Chennai Super Kings | 2022–2024 (2) | 2022-04-26 | 2024-05-18 | 15 |  |
| `afa7e784` | Matthew Wade | MS Wade | — | WK-Batter | Gujarat Titans | Delhi Daredevils, Gujarat Titans | 2011–2024 (3) | 2011-04-17 | 2024-05-10 | 15 |  |
| `0c9652b0` | Hrithik Shokeen | HR Shokeen | — | Batter | Mumbai Indians | Mumbai Indians | 2022–2023 (2) | 2022-04-21 | 2023-05-24 | 13 |  |
| `73c18486` | Kyle Mayers | KR Mayers | — | Batter | Lucknow Super Giants | Lucknow Super Giants | 2023 | 2023-04-01 | 2023-05-24 | 13 |  |
| `bd54eef5` | Narayan Jagadeesan | N Jagadeesan | — | Batter | Kolkata Knight Riders | Chennai Super Kings, Kolkata Knight Riders | 2020–2023 (3) | 2020-10-10 | 2023-04-29 | 13 |  |
| `6c882e9a` | Bhanuka Rajapaksa | PBB Rajapaksa | — | Batter | Punjab Kings | Punjab Kings | 2022–2023 (2) | 2022-03-27 | 2023-05-08 | 13 |  |
| `7f048519` | David Willey | DJ Willey | — | All-rounder | Royal Challengers Bangalore | Chennai Super Kings, Royal Challengers Bangalore | 2018–2023 (3) | 2018-05-05 | 2023-04-26 | 11 |  |
| `4ae1755b` | Harry Brook | HC Brook | — | Batter | Sunrisers Hyderabad | Sunrisers Hyderabad | 2023 | 2023-04-02 | 2023-05-21 | 11 |  |
| `9061a703` | Josh Little | J Little | — | Bowler | Gujarat Titans | Gujarat Titans | 2023–2024 (2) | 2023-03-31 | 2024-05-04 | 11 |  |
| `9385de2e` | Suyash Prabhudessai | SS Prabhudessai | — | Batter | Royal Challengers Bengaluru | Royal Challengers Bangalore, Royal Challengers Bengaluru | 2022–2024 (3) | 2022-04-12 | 2024-04-21 | 11 |  |
| `cdc6bdba` | Sandeep Warrier | S Sandeep Warrier | — | Bowler | Gujarat Titans | Kolkata Knight Riders, Gujarat Titans | 2019–2024 (4) | 2019-04-28 | 2024-05-10 | 10 |  |
| `1399b39c` | Anmolpreet Singh | Anmolpreet Singh | — | Batter | Sunrisers Hyderabad | Mumbai Indians, Sunrisers Hyderabad | 2021–2024 (4) | 2021-09-19 | 2024-05-02 | 9 |  |
| `28c78fb3` | Harpreet Singh | Harpreet Singh | — | Batter | Punjab Kings | Kolkata Knight Riders, Pune Warriors, Punjab Kings | 2010–2024 (5) | 2010-03-22 | 2024-04-21 | 9 |  |
| `60500956` | RV Patel | RV Patel | — | Batter | Delhi Capitals | Delhi Capitals | 2021–2023 (3) | 2021-10-04 | 2023-05-10 | 9 |  |
| `1fc6ef83` | Shai Hope | SD Hope | — | WK-Batter | Delhi Capitals | Delhi Capitals | 2024 | 2024-03-23 | 2024-05-14 | 9 |  |
| `26d041c4` | Sikandar Raza | Sikandar Raza | — | Batter | Punjab Kings | Punjab Kings | 2023–2024 (2) | 2023-04-01 | 2024-04-09 | 9 |  |
| `a457cfb5` | Mayank Dagar | Mayank Dagar | — | Bowler | Royal Challengers Bengaluru | Sunrisers Hyderabad, Royal Challengers Bengaluru | 2023–2024 (2) | 2023-04-21 | 2024-04-06 | 8 |  |
| `529eb9e0` | Obed McCoy | OC McCoy | — | Bowler | Rajasthan Royals | Rajasthan Royals | 2022–2023 (2) | 2022-04-18 | 2023-05-07 | 8 |  |
| `11614d87` | Dwaine Pretorius | D Pretorius | — | All-rounder | Chennai Super Kings | Chennai Super Kings | 2022–2023 (2) | 2022-03-31 | 2023-04-08 | 7 |  |
| `798cc28e` | KM Asif | KM Asif | — | All-rounder | Rajasthan Royals | Chennai Super Kings, Rajasthan Royals | 2018–2023 (3) | 2018-04-30 | 2023-05-14 | 7 |  |
| `ff1e12a0` | Ashton Turner | AJ Turner | — | Batter | Lucknow Super Giants | Rajasthan Royals, Lucknow Super Giants | 2019–2024 (2) | 2019-04-16 | 2024-05-05 | 6 |  |
| `cd8d2859` | Darshan Nalkande | DG Nalkande | — | All-rounder | Gujarat Titans | Gujarat Titans | 2022–2024 (3) | 2022-04-08 | 2024-04-07 | 6 |  |
| `663b5e34` | Prerak Mankad | PN Mankad | — | Batter | Lucknow Super Giants | Punjab Kings, Lucknow Super Giants | 2022–2023 (2) | 2022-05-22 | 2023-05-24 | 6 |  |
| `b0f2baf4` | Sanvir Singh | Sanvir Singh | — | Batter | Sunrisers Hyderabad | Sunrisers Hyderabad | 2023–2024 (2) | 2023-05-15 | 2024-05-21 | 6 |  |
| `8d92a2c3` | Mark Wood | MA Wood | — | Bowler | Lucknow Super Giants | Chennai Super Kings, Lucknow Super Giants | 2018–2023 (2) | 2018-04-07 | 2023-04-15 | 5 |  |
| `e38bce7a` | Michael Bracewell | MG Bracewell | — | All-rounder | Royal Challengers Bangalore | Royal Challengers Bangalore | 2023 | 2023-04-02 | 2023-05-21 | 5 |  |
| `1ee08e9a` | Jhye Richardson | JA Richardson | — | Batter | Delhi Capitals | Punjab Kings, Delhi Capitals | 2021–2024 (2) | 2021-04-12 | 2024-04-07 | 4 |  |
| `b63e358a` | Ricky Bhui | RK Bhui | — | Batter | Delhi Capitals | Sunrisers Hyderabad, Delhi Capitals | 2018–2024 (3) | 2018-04-22 | 2024-03-28 | 4 |  |
| `8998a68f` | Sumit Kumar | Sumit Kumar | — | Batter | Delhi Capitals | Delhi Capitals | 2024 | 2024-03-23 | 2024-04-17 | 4 |  |
| `dd7e9b3b` | Yash Dhull | YV Dhull | — | Batter | Delhi Capitals | Delhi Capitals | 2023 | 2023-04-11 | 2023-05-20 | 4 |  |
| `a343262c` | Joe Root | JE Root | — | Batter | Rajasthan Royals | Rajasthan Royals | 2023 | 2023-05-07 | 2023-05-14 | 3 |  |
| `030f3089` | Kuldeep Yadav | K Yadav | — | Bowler | Rajasthan Royals | Rajasthan Royals | 2021–2023 (2) | 2021-10-05 | 2023-05-07 | 3 |  |
| `39ed0d2f` | KS Sharma | KS Sharma | — | Batter | Lucknow Super Giants | Lucknow Super Giants | 2022–2023 (2) | 2022-05-10 | 2023-05-20 | 3 |  |
| `9e7225b0` | Saurav Chauhan | Saurav Chauhan | — | Batter | Royal Challengers Bengaluru | Royal Challengers Bengaluru | 2024 | 2024-04-06 | 2024-04-15 | 3 |  |
| `f836b33d` | Tom Kohler-Cadmore | T Kohler-Cadmore | — | Batter | Rajasthan Royals | Rajasthan Royals | 2024 | 2024-05-15 | 2024-05-24 | 3 |  |
| `03a83c50` | Vijayakanth Viyaskanth | V Viyaskanth | — | Batter | Sunrisers Hyderabad | Sunrisers Hyderabad | 2024 | 2024-05-08 | 2024-05-21 | 3 |  |
| `1b7b0fa7` | Vivrant Sharma | Vivrant Sharma | — | Batter | Sunrisers Hyderabad | Sunrisers Hyderabad | 2023 | 2023-05-07 | 2023-05-21 | 3 |  |
| `9f77963a` | Gulbadin Naib | Gulbadin Naib | — | Batter | Delhi Capitals | Delhi Capitals | 2024 | 2024-05-07 | 2024-05-14 | 2 |  |
| `52294a79` | H Sharma | H Sharma | — | Batter | Royal Challengers Bengaluru | Royal Challengers Bangalore, Royal Challengers Bengaluru | 2023–2024 (2) | 2023-05-21 | 2024-04-06 | 2 |  |
| `0b60eb09` | Keshav Maharaj | KA Maharaj | — | Batter | Rajasthan Royals | Rajasthan Royals | 2024 | 2024-04-10 | 2024-04-13 | 2 |  |
| `a1d95bd8` | LB Williams | LB Williams | — | Batter | Delhi Capitals | Delhi Capitals | 2024 | 2024-04-27 | 2024-04-29 | 2 |  |
| `c3c92b42` | Rajvardhan Hangargekar | RS Hangargekar | — | Batter | Chennai Super Kings | Chennai Super Kings | 2023 | 2023-03-31 | 2023-04-03 | 2 |  |
| `8361e524` | Sisanda Magala | SSB Magala | — | Batter | Chennai Super Kings | Chennai Super Kings | 2023 | 2023-04-08 | 2023-04-12 | 2 |  |
| `9d704f6f` | Shams Mulani | SZ Mulani | — | Batter | Mumbai Indians | Mumbai Indians | 2024 | 2024-03-24 | 2024-03-27 | 2 |  |
| `cc777ffa` | Abdul Basith | Abdul Basith | — | Batter | Rajasthan Royals | Rajasthan Royals | 2023 | 2023-04-23 | 2023-04-23 | 1 |  |
| `c2dd89ea` | BR Sharath | BR Sharath | — | Batter | Gujarat Titans | Gujarat Titans | 2024 | 2024-04-07 | 2024-04-07 | 1 | ✅ |
| `8dc152d1` | D Jansen | D Jansen | — | Batter | Mumbai Indians | Mumbai Indians | 2023 | 2023-04-16 | 2023-04-16 | 1 |  |
| `0404d43c` | Liton Das | Liton Das | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2023 | 2023-04-20 | 2023-04-20 | 1 |  |
| `9a5f2863` | Mohit Rathee | Mohit Rathee | — | Batter | Punjab Kings | Punjab Kings | 2023 | 2023-04-09 | 2023-04-09 | 1 |  |
| `266849c1` | R Goyal | R Goyal | — | Batter | Mumbai Indians | Mumbai Indians | 2023 | 2023-05-06 | 2023-05-06 | 1 |  |
| `97290faf` | Shamar Joseph | S Joseph | — | Batter | Lucknow Super Giants | Lucknow Super Giants | 2024 | 2024-04-14 | 2024-04-14 | 1 |  |
| `e1d9ae9c` | Shivam Singh | Shivam Singh | — | Batter | Punjab Kings | Punjab Kings | 2024 | 2024-05-19 | 2024-05-19 | 1 |  |
| `5724e517` | Tanush Kotian | Tanush Kotian | — | Batter | Rajasthan Royals | Rajasthan Royals | 2024 | 2024-04-13 | 2024-04-13 | 1 | ✅ |
| `d4d929b0` | Vidwath Kaverappa | V Kaverappa | — | Batter | Punjab Kings | Punjab Kings | 2024 | 2024-05-09 | 2024-05-09 | 1 |  |

### Retired players (458)

| ID | Name | Short Name | Nicknames | Role | Last Team | All Teams | Seasons | First Match | Last Match | M | Repl |
|---|---|---|---|---|---|---|---|---|---|---:|:-:|
| `c03f1114` | Dinesh Karthik | KD Karthik | DK, Dinesh Karthik | WK-Batter | Royal Challengers Bengaluru | Delhi Daredevils, Kings XI Punjab, Mumbai Indians, Royal Challengers Bangalore, Gujarat Lions, Kolkata Knight Riders, Royal Challengers Bengaluru | 2008–2024 (17) | 2008-04-19 | 2024-05-22 | 257 |  |
| `0a476045` | Shikhar Dhawan | S Dhawan | Gabbar, Shikhi | Batter | Punjab Kings | Delhi Daredevils, Mumbai Indians, Deccan Chargers, Sunrisers Hyderabad, Delhi Capitals, Punjab Kings | 2008–2024 (17) | 2008-04-19 | 2024-04-09 | 222 |  |
| `1c17e270` | Robin Uthappa | RV Uthappa | Robbie, Robin Uthappa | Batter | Chennai Super Kings | Mumbai Indians, Royal Challengers Bangalore, Pune Warriors, Kolkata Knight Riders, Rajasthan Royals, Chennai Super Kings | 2008–2022 (15) | 2008-04-20 | 2022-05-12 | 205 |  |
| `70d205c9` | Ambati Rayudu | AT Rayudu | Rayudu | Batter | Chennai Super Kings | Mumbai Indians, Chennai Super Kings | 2010–2023 (14) | 2010-03-13 | 2023-05-29 | 204 |  |
| `1dc12ab9` | Suresh Raina | SK Raina | Mr. IPL, Chinna Thala | Batter | Chennai Super Kings | Chennai Super Kings, Gujarat Lions | 2008–2021 (13) | 2008-04-19 | 2021-10-02 | 204 |  |
| `98ae73b1` | Piyush Chawla | PP Chawla | Piyush Chawla | Bowler | Mumbai Indians | Kings XI Punjab, Kolkata Knight Riders, Chennai Super Kings, Mumbai Indians | 2008–2024 (16) | 2008-04-19 | 2024-05-17 | 192 |  |
| `a757b0d8` | Kieron Pollard | KA Pollard | Polly, Kieron Pollard | All-rounder | Mumbai Indians | Mumbai Indians | 2010–2022 (13) | 2010-03-17 | 2022-05-09 | 189 |  |
| `c4487b84` | AB de Villiers | AB de Villiers | Mr. 360, ABD | Batter | Royal Challengers Bangalore | Delhi Daredevils, Royal Challengers Bangalore | 2008–2021 (14) | 2008-05-02 | 2021-10-11 | 183 |  |
| `3c6ffae8` | Yusuf Pathan | YK Pathan | Yusuf Pathan | All-rounder | Sunrisers Hyderabad | Rajasthan Royals, Kolkata Knight Riders, Sunrisers Hyderabad | 2008–2019 (12) | 2008-04-19 | 2019-05-04 | 174 |  |
| `fe11caa6` | Wriddhiman Saha | WP Saha | Wriddhiman Saha, Wriddhi | WK-Batter | Gujarat Titans | Kolkata Knight Riders, Chennai Super Kings, Kings XI Punjab, Sunrisers Hyderabad, Gujarat Titans | 2008–2024 (17) | 2008-04-18 | 2024-05-04 | 169 |  |
| `8b5b6769` | Harbhajan Plaha | Harbhajan Singh | Bhajji, The Turbanator | Bowler | Kolkata Knight Riders | Mumbai Indians, Chennai Super Kings, Kolkata Knight Riders | 2008–2021 (13) | 2008-04-20 | 2021-04-18 | 163 |  |
| `6b19d823` | Amit Mishra | A Mishra | Mishi | Bowler | Lucknow Super Giants | Delhi Daredevils, Deccan Chargers, Sunrisers Hyderabad, Delhi Capitals, Lucknow Super Giants | 2008–2024 (16) | 2008-05-11 | 2024-04-27 | 162 |  |
| `87e562a9` | Dwayne Bravo | DJ Bravo | DJ Bravo, Champion | All-rounder | Chennai Super Kings | Mumbai Indians, Chennai Super Kings, Gujarat Lions | 2008–2022 (14) | 2008-04-23 | 2022-05-12 | 160 |  |
| `bb345e0b` | Gautam Gambhir | G Gambhir | Gauti, GG | Batter | Delhi Daredevils | Delhi Daredevils, Kolkata Knight Riders | 2008–2018 (11) | 2008-04-19 | 2018-04-23 | 154 |  |
| `4329fbb5` | Shane Watson | SR Watson | Watto, Shane Watson | All-rounder | Chennai Super Kings | Rajasthan Royals, Royal Challengers Bangalore, Chennai Super Kings | 2008–2020 (12) | 2008-04-19 | 2020-10-29 | 145 |  |
| `db584dad` | Christopher Gayle | CH Gayle | Universe Boss, World Boss, Chris Gayle | Batter | Punjab Kings | Kolkata Knight Riders, Royal Challengers Bangalore, Kings XI Punjab, Punjab Kings | 2009–2021 (13) | 2009-04-19 | 2021-09-28 | 141 |  |
| `b5da6c24` | Parthiv Patel | PA Patel | Parthiv Patel | WK-Batter | Royal Challengers Bangalore | Chennai Super Kings, Kochi Tuskers Kerala, Deccan Chargers, Sunrisers Hyderabad, Royal Challengers Bangalore, Mumbai Indians | 2008–2019 (12) | 2008-04-19 | 2019-05-04 | 139 |  |
| `1c914163` | Yuvraj Singh | Yuvraj Singh | Yuvi, Prince of Indian Cricket | All-rounder | Mumbai Indians | Kings XI Punjab, Pune Warriors, Royal Challengers Bangalore, Delhi Daredevils, Sunrisers Hyderabad, Mumbai Indians | 2008–2019 (11) | 2008-04-19 | 2019-04-03 | 132 |  |
| `a12e1d51` | Separamadu Malinga | SL Malinga | Slinga Malinga, Lasith Malinga, Yorker King | Bowler | Mumbai Indians | Mumbai Indians | 2009–2019 (9) | 2009-04-18 | 2019-05-12 | 122 |  |
| `e938e1bc` | Praveen Kumar | P Kumar | Praveen | Bowler | Gujarat Lions | Royal Challengers Bangalore, Kings XI Punjab, Mumbai Indians, Sunrisers Hyderabad, Gujarat Lions | 2008–2017 (10) | 2008-04-18 | 2017-05-13 | 119 |  |
| `890946a0` | Naman Ojha | NV Ojha | Naman Ojha | WK-Batter | Delhi Daredevils | Rajasthan Royals, Delhi Daredevils, Sunrisers Hyderabad | 2009–2018 (10) | 2009-05-02 | 2018-05-05 | 113 |  |
| `b8a55852` | Brendon McCullum | BB McCullum | Baz, Brendon McCullum | Batter | Royal Challengers Bangalore | Kolkata Knight Riders, Kochi Tuskers Kerala, Chennai Super Kings, Gujarat Lions, Royal Challengers Bangalore | 2008–2018 (11) | 2008-04-18 | 2018-05-05 | 109 |  |
| `4b57e452` | Murali Vijay | M Vijay | — | Batter | Chennai Super Kings | Chennai Super Kings, Delhi Daredevils, Kings XI Punjab | 2009–2020 (11) | 2009-05-02 | 2020-09-25 | 106 |  |
| `41eb4a4f` | Raghavendra Kumar | R Vinay Kumar | Vinay Kumar | Bowler | Kolkata Knight Riders | Royal Challengers Bangalore, Kochi Tuskers Kerala, Kolkata Knight Riders, Mumbai Indians | 2008–2018 (11) | 2008-04-20 | 2018-04-10 | 104 |  |
| `8ba8195d` | Virender Sehwag | V Sehwag | Viru, Nawab of Najafgarh | Batter | Kings XI Punjab | Delhi Daredevils, Kings XI Punjab | 2008–2015 (8) | 2008-04-19 | 2015-05-03 | 104 |  |
| `5fa06777` | Irfan Pathan | IK Pathan | Irfan Pathan | All-rounder | Gujarat Lions | Kings XI Punjab, Delhi Daredevils, Sunrisers Hyderabad, Rising Pune Supergiant, Gujarat Lions | 2008–2017 (9) | 2008-04-19 | 2017-04-29 | 103 |  |
| `30a45b23` | Steven Smith | SPD Smith | Steve Smith, Smudge | Batter | Delhi Capitals | Pune Warriors, Rajasthan Royals, Rising Pune Supergiant, Delhi Capitals | 2012–2021 (9) | 2012-04-06 | 2021-10-02 | 103 |  |
| `91a4a398` | Zaheer Khan | Z Khan | Zak, Zaheer | Bowler | Delhi Daredevils | Royal Challengers Bangalore, Mumbai Indians, Delhi Daredevils | 2008–2017 (10) | 2008-04-18 | 2017-05-14 | 99 |  |
| `86dc8f2e` | Jacques Kallis | JH Kallis | Jacques Kallis, King Kallis | All-rounder | Kolkata Knight Riders | Royal Challengers Bangalore, Kolkata Knight Riders | 2008–2014 (7) | 2008-04-18 | 2014-05-11 | 98 |  |
| `26e5cabf` | Manoj Tiwary | MK Tiwary | Manoj Tiwary | Batter | Kings XI Punjab | Delhi Daredevils, Kolkata Knight Riders, Rising Pune Supergiant, Kings XI Punjab | 2008–2018 (10) | 2008-04-19 | 2018-05-20 | 98 |  |
| `8fd1a8f5` | Dale Steyn | DW Steyn | Dale Steyn, Steyn Gun | Bowler | Royal Challengers Bangalore | Royal Challengers Bangalore, Deccan Chargers, Sunrisers Hyderabad, Gujarat Lions | 2008–2020 (11) | 2008-04-28 | 2020-10-28 | 95 |  |
| `99d63244` | Kedar Jadhav | KM Jadhav | Kedar Jadhav | WK-Batter | Royal Challengers Bangalore | Delhi Daredevils, Kochi Tuskers Kerala, Royal Challengers Bangalore, Chennai Super Kings, Sunrisers Hyderabad | 2010–2023 (12) | 2010-03-25 | 2023-05-09 | 95 |  |
| `33a364a6` | Rajat Bhatia | R Bhatia | Rajat | Bowler | Rising Pune Supergiant | Delhi Daredevils, Kolkata Knight Riders, Rajasthan Royals, Rising Pune Supergiant | 2008–2017 (10) | 2008-04-19 | 2017-04-11 | 95 |  |
| `bd17b45f` | Stuart Binny | STR Binny | Stuart Binny | All-rounder | Rajasthan Royals | Mumbai Indians, Rajasthan Royals, Royal Challengers Bangalore | 2010–2019 (10) | 2010-04-19 | 2019-05-04 | 95 |  |
| `3576e47e` | Subramaniam Badrinath | S Badrinath | Badri | Batter | Chennai Super Kings | Chennai Super Kings | 2008–2013 (6) | 2008-04-19 | 2013-05-26 | 94 |  |
| `b8d490fd` | Aaron Finch | AJ Finch | Aaron Finch, Finchy | Batter | Kolkata Knight Riders | Rajasthan Royals, Delhi Daredevils, Pune Warriors, Sunrisers Hyderabad, Mumbai Indians, Gujarat Lions, Kings XI Punjab, Royal Challengers Bangalore, Kolkata Knight Riders | 2010–2022 (11) | 2010-04-17 | 2022-05-07 | 92 |  |
| `d2a989fc` | Dhawal Kulkarni | DS Kulkarni | Dhawal Kulkarni | Bowler | Mumbai Indians | Mumbai Indians, Rajasthan Royals, Gujarat Lions | 2008–2021 (14) | 2008-04-20 | 2021-05-01 | 92 |  |
| `6c6591ab` | Pragyan Ojha | PP Ojha | Pragyan Ojha | Bowler | Mumbai Indians | Deccan Chargers, Mumbai Indians | 2008–2015 (8) | 2008-04-20 | 2015-04-08 | 92 |  |
| `709b0bac` | Saurabh Tiwary | SS Tiwary | Saurabh Tiwary | Batter | Mumbai Indians | Mumbai Indians, Royal Challengers Bangalore, Delhi Daredevils, Rising Pune Supergiant | 2008–2021 (11) | 2008-04-25 | 2021-10-05 | 92 |  |
| `35205dfc` | Dwayne Smith | DR Smith | Dwayne Smith | All-rounder | Gujarat Lions | Mumbai Indians, Deccan Chargers, Chennai Super Kings, Gujarat Lions | 2008–2017 (9) | 2008-05-21 | 2017-05-13 | 91 |  |
| `c3d35165` | Johannes Morkel | JA Morkel | Albie Morkel | All-rounder | Rising Pune Supergiant | Chennai Super Kings, Royal Challengers Bangalore, Delhi Daredevils, Rising Pune Supergiant | 2008–2016 (9) | 2008-04-28 | 2016-04-29 | 90 |  |
| `0184dc35` | Rahul Dravid | R Dravid | The Wall, Mr. Dependable, Jammy | Batter | Rajasthan Royals | Royal Challengers Bangalore, Rajasthan Royals | 2008–2013 (6) | 2008-04-18 | 2013-05-24 | 89 |  |
| `96fd40ae` | Ashish Nehra | A Nehra | Ashu, Nehra Ji | Bowler | Sunrisers Hyderabad | Mumbai Indians, Delhi Daredevils, Pune Warriors, Chennai Super Kings, Sunrisers Hyderabad | 2008–2017 (9) | 2008-04-20 | 2017-05-06 | 88 |  |
| `d2a6c0e6` | Eoin Morgan | EJG Morgan | — | Batter | Kolkata Knight Riders | Royal Challengers Bangalore, Kolkata Knight Riders, Sunrisers Hyderabad, Kings XI Punjab | 2010–2021 (8) | 2010-03-14 | 2021-10-15 | 83 |  |
| `2e8994e7` | JP Duminy | JP Duminy | JP | All-rounder | Mumbai Indians | Mumbai Indians, Deccan Chargers, Delhi Daredevils | 2009–2018 (8) | 2009-04-18 | 2018-05-13 | 83 |  |
| `c3d1402f` | RP Singh | RP Singh | RP | Bowler | Rising Pune Supergiant | Deccan Chargers, Kochi Tuskers Kerala, Mumbai Indians, Royal Challengers Bangalore, Rising Pune Supergiant | 2008–2016 (7) | 2008-04-20 | 2016-05-10 | 82 |  |
| `fb66ce1f` | Chris Morris | CH Morris | — | All-rounder | Rajasthan Royals | Chennai Super Kings, Rajasthan Royals, Delhi Daredevils, Delhi Capitals, Royal Challengers Bangalore | 2013–2021 (8) | 2013-04-10 | 2021-10-07 | 81 |  |
| `2b6e6dec` | Adam Gilchrist | AC Gilchrist | — | WK-Batter | Kings XI Punjab | Deccan Chargers, Kings XI Punjab | 2008–2013 (6) | 2008-04-20 | 2013-05-18 | 80 |  |
| `d18f9182` | DPMD Jayawardene | DPMD Jayawardene | — | Batter | Delhi Daredevils | Kings XI Punjab, Kochi Tuskers Kerala, Delhi Daredevils | 2008–2013 (6) | 2008-04-21 | 2013-05-19 | 80 |  |
| `66b30f71` | Ashok Dinda | AB Dinda | — | Bowler | Rising Pune Supergiant | Kolkata Knight Riders, Delhi Daredevils, Pune Warriors, Royal Challengers Bangalore, Rising Pune Supergiant | 2008–2017 (10) | 2008-04-18 | 2017-04-11 | 78 |  |
| `d2c2b2d5` | Sachin Tendulkar | SR Tendulkar | Master Blaster, God of Cricket, Sachin | Batter | Mumbai Indians | Mumbai Indians | 2008–2013 (6) | 2008-05-14 | 2013-05-13 | 78 |  |
| `3d7e087f` | Siddharth Trivedi | SK Trivedi | — | Bowler | Rajasthan Royals | Rajasthan Royals | 2008–2013 (6) | 2008-04-19 | 2013-05-24 | 76 |  |
| `b2b50355` | Lakshmipathy Balaji | L Balaji | — | Bowler | Kings XI Punjab | Chennai Super Kings, Kolkata Knight Riders, Kings XI Punjab | 2008–2014 (7) | 2008-05-08 | 2014-06-01 | 73 |  |
| `9d80c5e1` | Shahbaz Nadeem | S Nadeem | — | Bowler | Sunrisers Hyderabad | Delhi Daredevils, Sunrisers Hyderabad | 2011–2021 (11) | 2011-04-12 | 2021-04-14 | 72 |  |
| `6b71e6cf` | Kumar Sangakkara | KC Sangakkara | — | WK-Batter | Sunrisers Hyderabad | Kings XI Punjab, Deccan Chargers, Sunrisers Hyderabad | 2008–2013 (6) | 2008-04-19 | 2013-05-08 | 71 |  |
| `508a1ea7` | Shaun Marsh | SE Marsh | Shaun Marsh, SOS | Batter | Kings XI Punjab | Kings XI Punjab | 2008–2017 (9) | 2008-05-01 | 2017-05-14 | 71 |  |
| `7dc35884` | Shakib Hasan | Shakib Al Hasan | — | All-rounder | Kolkata Knight Riders | Kolkata Knight Riders, Sunrisers Hyderabad | 2011–2021 (9) | 2011-04-15 | 2021-10-15 | 71 |  |
| `5bb5a915` | Morne Morkel | M Morkel | Morne | Bowler | Kolkata Knight Riders | Rajasthan Royals, Delhi Daredevils, Kolkata Knight Riders | 2009–2016 (8) | 2009-05-07 | 2016-05-25 | 70 |  |
| `b57f8a9a` | Brad Hodge | BJ Hodge | — | All-rounder | Rajasthan Royals | Kolkata Knight Riders, Kochi Tuskers Kerala, Rajasthan Royals | 2008–2014 (7) | 2008-05-01 | 2014-05-25 | 66 |  |
| `4ba44e19` | Muttiah Muralitharan | M Muralitharan | — | Bowler | Royal Challengers Bangalore | Chennai Super Kings, Kochi Tuskers Kerala, Royal Challengers Bangalore | 2008–2014 (7) | 2008-04-19 | 2014-05-22 | 66 |  |
| `fe763256` | Venugopal Rao | Y Venugopal Rao | — | All-rounder | Sunrisers Hyderabad | Deccan Chargers, Delhi Daredevils, Sunrisers Hyderabad | 2008–2014 (7) | 2008-04-20 | 2014-05-24 | 65 |  |
| `fd835ab3` | David Hussey | DJ Hussey | — | All-rounder | Chennai Super Kings | Kolkata Knight Riders, Kings XI Punjab, Chennai Super Kings | 2008–2014 (7) | 2008-04-18 | 2014-05-30 | 64 |  |
| `f0f628c7` | Munaf Patel | MM Patel | — | Bowler | Gujarat Lions | Rajasthan Royals, Mumbai Indians, Gujarat Lions | 2008–2017 (7) | 2008-04-19 | 2017-05-13 | 63 |  |
| `32198ae0` | Moises Henriques | MC Henriques | Moises Henriques | All-rounder | Punjab Kings | Kolkata Knight Riders, Delhi Daredevils, Royal Challengers Bangalore, Sunrisers Hyderabad, Punjab Kings | 2009–2021 (8) | 2009-04-19 | 2021-10-07 | 62 |  |
| `a45a5e8d` | Abhishek Nayar | AM Nayar | — | All-rounder | Rajasthan Royals | Mumbai Indians, Kings XI Punjab, Pune Warriors, Rajasthan Royals | 2008–2014 (7) | 2008-04-20 | 2014-05-25 | 60 |  |
| `808f425a` | James Faulkner | JP Faulkner | — | All-rounder | Gujarat Lions | Pune Warriors, Kings XI Punjab, Rajasthan Royals, Gujarat Lions | 2011–2017 (7) | 2011-05-21 | 2017-05-13 | 60 |  |
| `acee4cc4` | Mohammad Tahir | Imran Tahir | Imran Tahir | Bowler | Chennai Super Kings | Delhi Daredevils, Rising Pune Supergiant, Chennai Super Kings | 2014–2021 (8) | 2014-05-10 | 2021-04-25 | 59 | ✅ |
| `48fd7349` | Michael Hussey | MEK Hussey | Mr. Cricket, Mike Hussey | Batter | Chennai Super Kings | Chennai Super Kings, Mumbai Indians | 2008–2015 (7) | 2008-04-19 | 2015-05-24 | 59 |  |
| `c8179c68` | Shadab Jakati | SB Jakati | — | Bowler | Gujarat Lions | Chennai Super Kings, Royal Challengers Bangalore, Gujarat Lions | 2009–2017 (7) | 2009-04-30 | 2017-04-14 | 59 |  |
| `725529bc` | Sourav Ganguly | SC Ganguly | — | Batter | Pune Warriors | Kolkata Knight Riders, Pune Warriors | 2008–2012 (5) | 2008-04-18 | 2012-05-19 | 59 |  |
| `abfeb126` | Murali Kartik | M Kartik | — | Bowler | Kings XI Punjab | Kolkata Knight Riders, Pune Warriors, Royal Challengers Bangalore, Kings XI Punjab | 2008–2014 (7) | 2008-04-18 | 2014-05-07 | 56 |  |
| `51a3c5ef` | Mitchell McClenaghan | MJ McClenaghan | — | Bowler | Mumbai Indians | Mumbai Indians | 2015–2019 (5) | 2015-04-19 | 2019-05-12 | 56 |  |
| `b61a3e1a` | LRPL Taylor | LRPL Taylor | — | Batter | Delhi Daredevils | Royal Challengers Bangalore, Rajasthan Royals, Delhi Daredevils, Pune Warriors | 2008–2014 (7) | 2008-04-20 | 2014-05-15 | 55 |  |
| `c42aaf71` | Mithun Manhas | M Manhas | — | Batter | Chennai Super Kings | Delhi Daredevils, Pune Warriors, Chennai Super Kings | 2008–2014 (7) | 2008-04-19 | 2014-05-24 | 55 |  |
| `dcf81436` | Siddarth Kaul | S Kaul | — | Bowler | Royal Challengers Bangalore | Delhi Daredevils, Sunrisers Hyderabad, Royal Challengers Bangalore | 2013–2022 (8) | 2013-04-12 | 2022-05-19 | 55 |  |
| `bb18be76` | Shane Warne | SK Warne | — | Bowler | Rajasthan Royals | Rajasthan Royals | 2008–2011 (4) | 2008-04-19 | 2011-05-20 | 55 |  |
| `f5180fe6` | Mitchell Johnson | MG Johnson | — | Bowler | Kolkata Knight Riders | Mumbai Indians, Kings XI Punjab, Kolkata Knight Riders | 2013–2018 (6) | 2013-04-04 | 2018-05-06 | 54 |  |
| `0a3d54b9` | Varun Aaron | VR Aaron | — | Bowler | Gujarat Titans | Delhi Daredevils, Royal Challengers Bangalore, Kings XI Punjab, Rajasthan Royals, Gujarat Titans | 2011–2022 (9) | 2011-04-23 | 2022-04-02 | 52 |  |
| `5bdcdb72` | Tillakaratne Dilshan | TM Dilshan | — | All-rounder | Royal Challengers Bangalore | Delhi Daredevils, Royal Challengers Bangalore | 2008–2013 (6) | 2008-05-11 | 2013-04-27 | 51 |  |
| `f62772e5` | Pawan Negi | P Negi | — | All-rounder | Royal Challengers Bangalore | Delhi Daredevils, Chennai Super Kings, Royal Challengers Bangalore | 2012–2019 (8) | 2012-04-21 | 2019-04-30 | 50 |  |
| `896d78ad` | Angelo Mathews | AD Mathews | — | All-rounder | Delhi Daredevils | Kolkata Knight Riders, Pune Warriors, Delhi Daredevils | 2009–2017 (6) | 2009-05-12 | 2017-05-02 | 49 |  |
| `2a2e6343` | Dan Christian | DT Christian | — | All-rounder | Royal Challengers Bangalore | Deccan Chargers, Royal Challengers Bangalore, Rising Pune Supergiant, Delhi Daredevils | 2011–2021 (6) | 2011-04-09 | 2021-10-11 | 49 |  |
| `85aae393` | Iqbal Abdulla | Iqbal Abdulla | — | Bowler | Royal Challengers Bangalore | Kolkata Knight Riders, Rajasthan Royals, Royal Challengers Bangalore | 2008–2017 (9) | 2008-05-13 | 2017-04-10 | 49 |  |
| `d0513f63` | Cameron White | CL White | — | Batter | Sunrisers Hyderabad | Royal Challengers Bangalore, Deccan Chargers, Sunrisers Hyderabad | 2008–2013 (5) | 2008-04-18 | 2013-05-22 | 47 |  |
| `b1451597` | Laxmi Ratan Shukla | LR Shukla | — | Bowler | Delhi Daredevils | Kolkata Knight Riders, Delhi Daredevils | 2008–2014 (7) | 2008-04-18 | 2014-05-10 | 47 |  |
| `ae78bc32` | Manpreet Gony | MS Gony | — | Bowler | Gujarat Lions | Chennai Super Kings, Deccan Chargers, Kings XI Punjab, Gujarat Lions | 2008–2017 (7) | 2008-04-19 | 2017-04-07 | 44 |  |
| `5d9a1a73` | R Sharma | R Sharma | — | Bowler | Delhi Daredevils | Deccan Chargers, Pune Warriors, Delhi Daredevils | 2010–2014 (5) | 2010-03-21 | 2014-05-03 | 44 |  |
| `6b8eb6e5` | Sreesanth | S Sreesanth | — | Bowler | Rajasthan Royals | Kings XI Punjab, Kochi Tuskers Kerala, Rajasthan Royals | 2008–2013 (5) | 2008-04-19 | 2013-05-09 | 44 |  |
| `aaa1b522` | T Suman | TL Suman | — | Batter | Pune Warriors | Deccan Chargers, Mumbai Indians, Pune Warriors | 2009–2013 (5) | 2009-04-30 | 2013-05-02 | 43 |  |
| `0c2730df` | Anil Kumble | A Kumble | — | Bowler | Royal Challengers Bangalore | Royal Challengers Bangalore | 2008–2010 (3) | 2008-04-26 | 2010-04-24 | 42 |  |
| `fa463154` | Ajit Agarkar | AB Agarkar | — | Bowler | Delhi Daredevils | Kolkata Knight Riders, Delhi Daredevils | 2008–2013 (6) | 2008-04-18 | 2013-05-07 | 42 |  |
| `45eda7c8` | Chris Lynn | CA Lynn | — | Batter | Mumbai Indians | Deccan Chargers, Kolkata Knight Riders, Mumbai Indians | 2012–2021 (7) | 2012-05-18 | 2021-04-09 | 42 |  |
| `9fc0ef64` | Pradeep Sangwan | PJ Sangwan | — | Bowler | Gujarat Titans | Delhi Daredevils, Kolkata Knight Riders, Gujarat Lions, Mumbai Indians, Gujarat Titans | 2008–2022 (9) | 2008-05-02 | 2022-05-06 | 42 |  |
| `6eb146d2` | Gurkeerat Singh | Gurkeerat Singh | — | Batter | Royal Challengers Bangalore | Kings XI Punjab, Royal Challengers Bangalore | 2012–2020 (7) | 2012-05-05 | 2020-10-31 | 41 |  |
| `5056011d` | George Bailey | GJ Bailey | — | Batter | Rising Pune Supergiant | Chennai Super Kings, Kings XI Punjab, Rising Pune Supergiant | 2009–2016 (5) | 2009-05-07 | 2016-05-21 | 40 |  |
| `bd77eb62` | Andrew Symonds | A Symonds | — | All-rounder | Mumbai Indians | Deccan Chargers, Mumbai Indians | 2008–2011 (4) | 2008-04-20 | 2011-05-20 | 39 |  |
| `5afd4539` | Manvinder Bisla | MS Bisla | — | WK-Batter | Royal Challengers Bangalore | Kings XI Punjab, Kolkata Knight Riders, Royal Challengers Bangalore | 2010–2015 (6) | 2010-03-13 | 2015-04-22 | 39 |  |
| `56ab442f` | Nathan Coulter-Nile | NM Coulter-Nile | — | Bowler | Rajasthan Royals | Mumbai Indians, Delhi Daredevils, Kolkata Knight Riders, Rajasthan Royals | 2013–2022 (8) | 2013-05-18 | 2022-03-29 | 39 |  |
| `dd09ff8e` | Brett Lee | B Lee | — | Bowler | Kolkata Knight Riders | Kings XI Punjab, Kolkata Knight Riders | 2008–2013 (6) | 2008-04-19 | 2013-05-01 | 38 |  |
| `957532de` | Sreenath Aravind | S Aravind | Aravind | Bowler | Royal Challengers Bangalore | Royal Challengers Bangalore | 2011–2017 (5) | 2011-04-14 | 2017-05-07 | 38 |  |
| `0f12f9df` | NLTC Perera | NLTC Perera | — | All-rounder | Rising Pune Supergiant | Chennai Super Kings, Kochi Tuskers Kerala, Mumbai Indians, Sunrisers Hyderabad, Kings XI Punjab, Rising Pune Supergiant | 2010–2016 (6) | 2010-03-25 | 2016-05-21 | 37 |  |
| `12eddf28` | Ryan Harris | RJ Harris | — | Bowler | Kings XI Punjab | Deccan Chargers, Kings XI Punjab | 2009–2013 (5) | 2009-05-04 | 2013-04-14 | 37 |  |
| `e1d1b294` | Herschelle Gibbs | HH Gibbs | — | Batter | Mumbai Indians | Deccan Chargers, Mumbai Indians | 2008–2012 (4) | 2008-05-01 | 2012-05-16 | 36 |  |
| `90de905a` | Krishnappa Gowtham | K Gowtham | — | Bowler | Lucknow Super Giants | Rajasthan Royals, Kings XI Punjab, Lucknow Super Giants | 2018–2024 (6) | 2018-04-09 | 2024-05-08 | 36 |  |
| `39f01cdb` | Kevin Pietersen | KP Pietersen | — | All-rounder | Rising Pune Supergiant | Royal Challengers Bangalore, Delhi Daredevils, Rising Pune Supergiant | 2009–2016 (5) | 2009-04-18 | 2016-04-22 | 36 |  |
| `855a210c` | Aditya Tare | AP Tare | — | WK-Batter | Delhi Daredevils | Mumbai Indians, Sunrisers Hyderabad, Delhi Daredevils | 2010–2017 (6) | 2010-03-13 | 2017-04-22 | 35 |  |
| `d7c6af50` | Daniel Vettori | DL Vettori | — | Bowler | Royal Challengers Bangalore | Delhi Daredevils, Royal Challengers Bangalore | 2008–2012 (5) | 2008-04-19 | 2012-05-02 | 34 |  |
| `7c503806` | Johan Botha | J Botha | — | Bowler | Kolkata Knight Riders | Rajasthan Royals, Delhi Daredevils, Kolkata Knight Riders | 2009–2015 (5) | 2009-05-14 | 2015-05-09 | 34 |  |
| `626c5379` | R Sathish | R Sathish | — | Batter | Kolkata Knight Riders | Mumbai Indians, Kings XI Punjab, Kolkata Knight Riders | 2010–2016 (4) | 2010-03-13 | 2016-05-25 | 34 |  |
| `c18496e1` | Bipul Sharma | Bipul Sharma | Bipul | Bowler | Sunrisers Hyderabad | Kings XI Punjab, Sunrisers Hyderabad | 2010–2017 (7) | 2010-03-16 | 2017-05-17 | 33 |  |
| `1a0c3177` | Parvinder Awana | P Awana | — | Bowler | Kings XI Punjab | Kings XI Punjab | 2012–2014 (3) | 2012-04-12 | 2014-06-01 | 33 |  |
| `6aed7e79` | Pravin Tambe | PV Tambe | — | Bowler | Gujarat Lions | Rajasthan Royals, Gujarat Lions | 2013–2016 (4) | 2013-05-07 | 2016-05-14 | 33 |  |
| `b720a5d6` | DB Ravi Teja | DB Ravi Teja | — | Batter | Sunrisers Hyderabad | Deccan Chargers, Sunrisers Hyderabad | 2008–2013 (5) | 2008-05-09 | 2013-04-14 | 32 |  |
| `d8699ab7` | Matthew Hayden | ML Hayden | Haydos, Matthew Hayden | Batter | Chennai Super Kings | Chennai Super Kings | 2008–2010 (3) | 2008-04-19 | 2010-04-25 | 32 |  |
| `1c2a64cd` | Ashish Reddy | A Ashish Reddy | — | Bowler | Sunrisers Hyderabad | Deccan Chargers, Sunrisers Hyderabad | 2012–2016 (4) | 2012-04-26 | 2016-04-30 | 31 |  |
| `7050a1e7` | Debabrata Das | DB Das | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2008–2013 (3) | 2008-04-29 | 2013-05-15 | 31 |  |
| `f3cb53a1` | Mark Boucher | MV Boucher | — | WK-Batter | Kolkata Knight Riders | Royal Challengers Bangalore, Kolkata Knight Riders | 2008–2011 (4) | 2008-04-18 | 2011-05-14 | 31 |  |
| `541f85c9` | Saurabh Goswami | SP Goswami | — | WK-Batter | Sunrisers Hyderabad | Royal Challengers Bangalore, Kolkata Knight Riders, Rajasthan Royals, Sunrisers Hyderabad | 2008–2020 (7) | 2008-05-19 | 2020-11-08 | 31 |  |
| `7c7d63a2` | Andrew Tye | AJ Tye | Andrew Tye | Bowler | Lucknow Super Giants | Gujarat Lions, Kings XI Punjab, Rajasthan Royals, Lucknow Super Giants | 2017–2022 (5) | 2017-04-14 | 2022-04-07 | 30 |  |
| `d4f9dbd4` | Cheteshwar Pujara | CA Pujara | — | Batter | Kings XI Punjab | Kolkata Knight Riders, Royal Challengers Bangalore, Kings XI Punjab | 2010–2014 (5) | 2010-03-12 | 2014-05-03 | 30 |  |
| `8abdf100` | Corey Anderson | CJ Anderson | — | All-rounder | Royal Challengers Bangalore | Mumbai Indians, Delhi Daredevils, Royal Challengers Bangalore | 2014–2018 (4) | 2014-04-16 | 2018-04-25 | 30 |  |
| `f233bbb4` | Sanath Jayasuriya | ST Jayasuriya | — | All-rounder | Mumbai Indians | Mumbai Indians | 2008–2010 (3) | 2008-04-20 | 2010-04-11 | 30 |  |
| `c16d4035` | Sam Billings | SW Billings | — | Batter | Kolkata Knight Riders | Delhi Daredevils, Chennai Super Kings, Kolkata Knight Riders | 2016–2022 (5) | 2016-04-30 | 2022-05-18 | 30 |  |
| `8291f939` | Ashok Menaria | AL Menaria | — | Batter | Rajasthan Royals | Rajasthan Royals | 2011–2013 (3) | 2011-04-09 | 2013-04-06 | 29 |  |
| `db31895a` | Ankit Rajpoot | AS Rajpoot | — | Bowler | Rajasthan Royals | Chennai Super Kings, Kolkata Knight Riders, Kings XI Punjab, Rajasthan Royals | 2013–2020 (6) | 2013-04-06 | 2020-10-25 | 29 |  |
| `c404f58a` | Dirk Nannes | DP Nannes | — | Bowler | Chennai Super Kings | Delhi Daredevils, Royal Challengers Bangalore, Chennai Super Kings | 2009–2013 (4) | 2009-04-19 | 2013-04-28 | 29 |  |
| `72861603` | Graeme Smith | GC Smith | — | Batter | Pune Warriors | Rajasthan Royals, Pune Warriors | 2008–2011 (4) | 2008-04-24 | 2011-05-04 | 29 |  |
| `91ffa6c6` | Jesse Ryder | JD Ryder | — | All-rounder | Pune Warriors | Royal Challengers Bangalore, Pune Warriors | 2009–2012 (3) | 2009-04-18 | 2012-05-19 | 29 |  |
| `89f64c19` | Lendl Simmons | LMP Simmons | — | Batter | Mumbai Indians | Mumbai Indians | 2014–2017 (4) | 2014-05-10 | 2017-05-21 | 29 |  |
| `d84378a4` | Mohammad Kaif | M Kaif | — | Batter | Royal Challengers Bangalore | Rajasthan Royals, Kings XI Punjab, Royal Challengers Bangalore | 2008–2012 (4) | 2008-04-19 | 2012-04-15 | 29 |  |
| `4ec07775` | RN ten Doeschate | RN ten Doeschate | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2011–2015 (5) | 2011-04-11 | 2015-05-04 | 29 |  |
| `45c2196c` | Doug Bollinger | DE Bollinger | — | Bowler | Chennai Super Kings | Chennai Super Kings | 2010–2012 (3) | 2010-04-03 | 2012-04-21 | 27 |  |
| `0ebfb1ad` | Evin Lewis | E Lewis | — | Batter | Lucknow Super Giants | Mumbai Indians, Rajasthan Royals, Lucknow Super Giants | 2018–2022 (4) | 2018-04-07 | 2022-05-25 | 27 |  |
| `2a72fd4f` | Harmeet Singh | Harmeet Singh | — | Bowler | Kings XI Punjab | Deccan Chargers, Kings XI Punjab | 2009–2013 (5) | 2009-04-19 | 2013-05-11 | 27 |  |
| `5d096f3d` | Ramesh Powar | RR Powar | — | Bowler | Kings XI Punjab | Kings XI Punjab, Kochi Tuskers Kerala | 2008–2012 (5) | 2008-05-17 | 2012-05-08 | 27 |  |
| `662c47a6` | Y Nagar | Y Nagar | — | Batter | Delhi Daredevils | Delhi Daredevils | 2009–2012 (4) | 2009-05-19 | 2012-05-12 | 26 |  |
| `871e9faf` | Basil Thampi | Basil Thampi | — | Bowler | Mumbai Indians | Gujarat Lions, Sunrisers Hyderabad, Mumbai Indians | 2017–2022 (5) | 2017-04-09 | 2022-04-13 | 25 |  |
| `94d7f855` | C de Grandhomme | C de Grandhomme | — | All-rounder | Royal Challengers Bangalore | Kolkata Knight Riders, Royal Challengers Bangalore | 2017–2019 (3) | 2017-04-13 | 2019-05-04 | 25 |  |
| `063b3673` | Dishant Yagnik | DH Yagnik | — | WK-Batter | Rajasthan Royals | Rajasthan Royals | 2011–2014 (4) | 2011-04-21 | 2014-05-13 | 25 |  |
| `e0407c01` | Ishwar Pandey | IC Pandey | — | Bowler | Chennai Super Kings | Pune Warriors, Chennai Super Kings | 2013–2015 (3) | 2013-04-23 | 2015-05-16 | 25 |  |
| `557153ca` | Kevon Cooper | KK Cooper | — | Bowler | Rajasthan Royals | Rajasthan Royals | 2012–2014 (3) | 2012-04-06 | 2014-05-25 | 25 |  |
| `d8b2f218` | Barinder Sran | BB Sran | — | Bowler | Mumbai Indians | Rajasthan Royals, Sunrisers Hyderabad, Kings XI Punjab, Mumbai Indians | 2015–2019 (5) | 2015-05-16 | 2019-05-02 | 24 |  |
| `94253925` | Hanuma Vihari | GH Vihari | — | Batter | Delhi Capitals | Sunrisers Hyderabad, Delhi Capitals | 2013–2019 (3) | 2013-04-05 | 2019-04-01 | 24 |  |
| `7ca5e05d` | Ravi Bopara | RS Bopara | — | All-rounder | Sunrisers Hyderabad | Kings XI Punjab, Sunrisers Hyderabad | 2009–2015 (3) | 2009-04-19 | 2015-05-09 | 24 |  |
| `5b040b81` | A Singh | A Singh | — | Bowler | Rajasthan Royals | Rajasthan Royals | 2009–2012 (3) | 2009-05-05 | 2012-05-01 | 23 |  |
| `69be866a` | Anureet Singh | Anureet Singh | — | Bowler | Rajasthan Royals | Kolkata Knight Riders, Kings XI Punjab, Rajasthan Royals | 2009–2018 (5) | 2009-04-23 | 2018-05-15 | 23 |  |
| `9a158001` | Azhar Mahmood | Azhar Mahmood | — | Bowler | Kolkata Knight Riders | Kings XI Punjab, Kolkata Knight Riders | 2012–2015 (3) | 2012-04-20 | 2015-05-16 | 23 |  |
| `5451a2c1` | B Chipli | B Chipli | — | Batter | Delhi Daredevils | Royal Challengers Bangalore, Deccan Chargers, Delhi Daredevils | 2008–2013 (4) | 2008-04-28 | 2013-05-19 | 23 |  |
| `7bf96684` | Owais Shah | OA Shah | — | Batter | Rajasthan Royals | Kolkata Knight Riders, Kochi Tuskers Kerala, Rajasthan Royals | 2010–2013 (4) | 2010-03-12 | 2013-05-03 | 23 |  |
| `25eeb281` | Paul Valthaty | PC Valthaty | — | All-rounder | Kings XI Punjab | Rajasthan Royals, Kings XI Punjab | 2009–2013 (4) | 2009-04-23 | 2013-04-19 | 23 |  |
| `24d94623` | Ankit Sharma | Ankit Sharma | — | Bowler | Rajasthan Royals | Deccan Chargers, Sunrisers Hyderabad, Rajasthan Royals, Rising Pune Supergiant | 2012–2018 (7) | 2012-04-07 | 2018-05-11 | 22 |  |
| `c69a7b5c` | AS Raut | AS Raut | — | Batter | Rajasthan Royals | Rajasthan Royals | 2009–2011 (3) | 2009-04-23 | 2011-05-11 | 22 |  |
| `c03c6200` | Darren Sammy | DJG Sammy | — | Bowler | Royal Challengers Bangalore | Sunrisers Hyderabad, Royal Challengers Bangalore | 2013–2015 (3) | 2013-04-25 | 2015-04-13 | 22 |  |
| `4125d931` | Jagadeesha Suchith | J Suchith | — | Bowler | Sunrisers Hyderabad | Mumbai Indians, Delhi Capitals, Sunrisers Hyderabad | 2015–2022 (5) | 2015-04-12 | 2022-05-22 | 22 |  |
| `a1f1829d` | Karan Goel | K Goel | — | Batter | Kings XI Punjab | Kings XI Punjab | 2008–2010 (3) | 2008-04-19 | 2010-04-18 | 22 |  |
| `3fca55af` | Sunny Sohal | S Sohal | — | Batter | Deccan Chargers | Kings XI Punjab, Deccan Chargers | 2008–2011 (4) | 2008-04-21 | 2011-05-16 | 22 |  |
| `2815fe50` | AA Jhunjhunwala | AA Jhunjhunwala | — | Batter | Deccan Chargers | Rajasthan Royals, Pune Warriors, Deccan Chargers | 2010–2012 (3) | 2010-03-13 | 2012-05-13 | 21 |  |
| `2e11c706` | Benjamin Cutting | BCJ Cutting | Ben Cutting | All-rounder | Mumbai Indians | Rajasthan Royals, Sunrisers Hyderabad, Mumbai Indians | 2014–2019 (5) | 2014-05-15 | 2019-04-20 | 21 |  |
| `4c5d73db` | Chris Woakes | CR Woakes | — | All-rounder | Delhi Capitals | Kolkata Knight Riders, Royal Challengers Bangalore, Delhi Capitals | 2017–2021 (3) | 2017-04-07 | 2021-04-18 | 21 |  |
| `f708a0bc` | Brad Hogg | GB Hogg | — | Bowler | Kolkata Knight Riders | Rajasthan Royals, Kolkata Knight Riders | 2012–2016 (4) | 2012-04-11 | 2016-05-08 | 21 |  |
| `2498e163` | James Hopes | JR Hopes | — | Bowler | Delhi Daredevils | Kings XI Punjab, Delhi Daredevils | 2008–2011 (2) | 2008-04-19 | 2011-05-21 | 21 |  |
| `05c2ca46` | RE van der Merwe | RE van der Merwe | — | Bowler | Delhi Daredevils | Royal Challengers Bangalore, Delhi Daredevils | 2009–2013 (5) | 2009-04-29 | 2013-05-14 | 21 |  |
| `addfb70e` | Shaun Tait | SW Tait | — | Bowler | Rajasthan Royals | Rajasthan Royals | 2010–2013 (4) | 2010-03-13 | 2013-05-07 | 21 |  |
| `0c94f480` | Unmukt Chand | UBT Chand | — | Batter | Mumbai Indians | Delhi Daredevils, Rajasthan Royals, Mumbai Indians | 2011–2016 (6) | 2011-04-10 | 2016-05-13 | 21 |  |
| `cf73ad76` | James Franklin | JEC Franklin | — | All-rounder | Mumbai Indians | Mumbai Indians | 2011–2012 (2) | 2011-04-10 | 2012-05-23 | 20 |  |
| `ab89348d` | Farveez Maharoof | MF Maharoof | — | Bowler | Delhi Daredevils | Delhi Daredevils | 2008–2010 (3) | 2008-04-19 | 2010-04-11 | 20 |  |
| `95a2ea61` | Subramaniam Anirudha | S Anirudha | — | Batter | Sunrisers Hyderabad | Chennai Super Kings, Sunrisers Hyderabad | 2008–2014 (6) | 2008-05-06 | 2014-05-24 | 20 |  |
| `ae091d39` | Swapnil Asnodkar | SA Asnodkar | — | Batter | Rajasthan Royals | Rajasthan Royals | 2008–2011 (4) | 2008-05-01 | 2011-04-21 | 20 |  |
| `de8cce37` | VVS Laxman | VVS Laxman | — | Batter | Kochi Tuskers Kerala | Deccan Chargers, Kochi Tuskers Kerala | 2008–2011 (4) | 2008-04-20 | 2011-04-24 | 20 |  |
| `034b4b7d` | VRV Singh | VRV Singh | — | Bowler | Kings XI Punjab | Kings XI Punjab | 2008–2010 (3) | 2008-04-25 | 2010-04-18 | 19 |  |
| `3eac9d95` | Jacob Oram | JDP Oram | — | All-rounder | Mumbai Indians | Chennai Super Kings, Rajasthan Royals, Mumbai Indians | 2008–2013 (4) | 2008-04-19 | 2013-04-04 | 18 |  |
| `de8d3876` | Mahesh Rawat | M Rawat | — | Batter | Pune Warriors | Rajasthan Royals, Pune Warriors | 2008–2013 (3) | 2008-04-19 | 2013-05-09 | 18 |  |
| `6afb26d6` | MD Mishra | MD Mishra | — | Batter | Pune Warriors | Deccan Chargers, Pune Warriors | 2010–2012 (3) | 2010-03-21 | 2012-05-11 | 18 |  |
| `c654af19` | Ryan McLaren | R McLaren | — | Bowler | Kolkata Knight Riders | Mumbai Indians, Kings XI Punjab, Kolkata Knight Riders | 2010–2013 (3) | 2010-03-13 | 2013-05-07 | 18 |  |
| `2af1b6d2` | Abu Nechim Ahmed | AN Ahmed | — | Bowler | Royal Challengers Bangalore | Mumbai Indians, Royal Challengers Bangalore | 2010–2015 (6) | 2010-04-06 | 2015-04-19 | 17 |  |
| `dc4686e6` | BA Bhatt | BA Bhatt | — | Bowler | Kings XI Punjab | Kings XI Punjab | 2011–2013 (3) | 2011-04-10 | 2013-04-26 | 17 |  |
| `f3171936` | Ben Hilfenhaus | BW Hilfenhaus | — | Bowler | Chennai Super Kings | Chennai Super Kings | 2012–2014 (2) | 2012-05-04 | 2014-05-20 | 17 |  |
| `7daedf2f` | KB Arun Karthik | KB Arun Karthik | — | Batter | Royal Challengers Bangalore | Chennai Super Kings, Royal Challengers Bangalore | 2010–2013 (4) | 2010-03-28 | 2013-05-14 | 17 |  |
| `b63ab531` | Luke Pomersbach | LA Pomersbach | — | Batter | Kings XI Punjab | Kings XI Punjab, Royal Challengers Bangalore | 2008–2013 (4) | 2008-05-12 | 2013-05-11 | 17 |  |
| `e32d22f6` | Pankaj Singh | Pankaj Singh | — | Bowler | Rajasthan Royals | Rajasthan Royals, Royal Challengers Bangalore | 2008–2012 (5) | 2008-04-21 | 2012-05-10 | 17 |  |
| `93a17209` | VY Mahesh | VY Mahesh | — | Bowler | Chennai Super Kings | Delhi Daredevils, Chennai Super Kings | 2008–2012 (4) | 2008-04-22 | 2012-05-17 | 17 |  |
| `66cf56a5` | Abhimanyu Mithun | A Mithun | — | All-rounder | Royal Challengers Bangalore | Royal Challengers Bangalore | 2009–2013 (5) | 2009-05-10 | 2013-05-12 | 16 |  |
| `e342e5fb` | Carlos Brathwaite | CR Brathwaite | — | All-rounder | Kolkata Knight Riders | Delhi Daredevils, Sunrisers Hyderabad, Kolkata Knight Riders | 2016–2019 (4) | 2016-04-10 | 2019-04-25 | 16 |  |
| `caf69bf7` | Daniel Sams | DR Sams | — | Bowler | Mumbai Indians | Delhi Capitals, Royal Challengers Bangalore, Mumbai Indians | 2020–2022 (3) | 2020-10-20 | 2022-05-21 | 16 |  |
| `e798611a` | Hashim Amla | HM Amla | — | Batter | Kings XI Punjab | Kings XI Punjab | 2016–2017 (2) | 2016-05-07 | 2017-05-07 | 16 |  |
| `9f961c14` | Joginder Sharma | Joginder Sharma | — | Bowler | Chennai Super Kings | Chennai Super Kings | 2008–2011 (4) | 2008-04-19 | 2011-04-22 | 16 |  |
| `0aadc906` | PR Shah | PR Shah | — | WK-Batter | Rajasthan Royals | Mumbai Indians, Rajasthan Royals | 2008–2011 (3) | 2008-04-20 | 2011-05-20 | 16 |  |
| `4e04666c` | YV Takawale | YV Takawale | — | WK-Batter | Royal Challengers Bangalore | Mumbai Indians, Royal Challengers Bangalore | 2008–2014 (3) | 2008-05-04 | 2014-05-24 | 16 |  |
| `b552a935` | Alfonso Thomas | AC Thomas | — | Bowler | Pune Warriors | Pune Warriors | 2011–2012 (2) | 2011-04-10 | 2012-05-11 | 15 |  |
| `af7dadf7` | Bharath Akhil | B Akhil | — | All-rounder | Kochi Tuskers Kerala | Royal Challengers Bangalore, Kochi Tuskers Kerala | 2008–2011 (4) | 2008-04-18 | 2011-04-30 | 15 |  |
| `c995d726` | Colin Ingram | CA Ingram | — | Batter | Delhi Capitals | Delhi Daredevils, Delhi Capitals | 2011–2019 (2) | 2011-05-07 | 2019-05-04 | 15 |  |
| `dfc4d8b5` | Kane Richardson | KW Richardson | — | Bowler | Royal Challengers Bangalore | Pune Warriors, Rajasthan Royals, Royal Challengers Bangalore | 2013–2021 (4) | 2013-04-28 | 2021-04-22 | 15 |  |
| `f846de6a` | Marlon Samuels | MN Samuels | — | All-rounder | Delhi Daredevils | Pune Warriors, Delhi Daredevils | 2012–2017 (3) | 2012-04-06 | 2017-05-14 | 15 |  |
| `f10e94c4` | Akshdeep Nath | AD Nath | — | Batter | Royal Challengers Bangalore | Gujarat Lions, Kings XI Punjab, Royal Challengers Bangalore | 2016–2019 (4) | 2016-04-14 | 2019-04-24 | 14 |  |
| `ee7d0c82` | Glenn McGrath | GD McGrath | — | Bowler | Delhi Daredevils | Delhi Daredevils | 2008 | 2008-04-19 | 2008-05-30 | 14 |  |
| `9219eff0` | Jimmy Neesham | JDS Neesham | — | All-rounder | Rajasthan Royals | Delhi Daredevils, Kings XI Punjab, Mumbai Indians, Rajasthan Royals | 2014–2022 (4) | 2014-04-17 | 2022-05-15 | 14 |  |
| `c24a2c5d` | Sudeep Tyagi | S Tyagi | — | All-rounder | Chennai Super Kings | Chennai Super Kings | 2009–2010 (2) | 2009-04-30 | 2010-04-18 | 14 |  |
| `2049f3a0` | SJ Srivastava | SJ Srivastava | — | Bowler | Kings XI Punjab | Kings XI Punjab | 2010–2011 (2) | 2010-03-19 | 2011-05-17 | 14 |  |
| `29d72eb2` | Ankeet Chavan | AA Chavan | — | All-rounder | Rajasthan Royals | Rajasthan Royals | 2011–2013 (3) | 2011-05-15 | 2013-05-15 | 13 |  |
| `3edb58fc` | Dimitri Mascarenhas | AD Mascarenhas | — | Bowler | Kings XI Punjab | Rajasthan Royals, Kings XI Punjab | 2008–2013 (5) | 2008-05-11 | 2013-04-19 | 13 |  |
| `af2c687b` | Colin Munro | C Munro | — | Batter | Delhi Capitals | Kolkata Knight Riders, Delhi Daredevils, Delhi Capitals | 2016–2019 (3) | 2016-04-10 | 2019-05-10 | 13 |  |
| `30a2649b` | CM Gautam | CM Gautam | — | WK-Batter | Delhi Daredevils | Delhi Daredevils, Mumbai Indians | 2013–2015 (3) | 2013-05-07 | 2015-04-09 | 13 |  |
| `d92e42f5` | KP Appanna | KP Appanna | — | All-rounder | Royal Challengers Bangalore | Royal Challengers Bangalore | 2009–2012 (3) | 2009-04-26 | 2012-05-14 | 13 |  |
| `2be41edb` | Martin Guptill | MJ Guptill | — | Batter | Sunrisers Hyderabad | Mumbai Indians, Kings XI Punjab, Sunrisers Hyderabad | 2016–2019 (3) | 2016-04-18 | 2019-05-08 | 13 |  |
| `2728e7e9` | Paras Dogra | P Dogra | — | Batter | Kolkata Knight Riders | Rajasthan Royals, Kings XI Punjab, Kolkata Knight Riders | 2010–2013 (3) | 2010-03-13 | 2013-05-19 | 13 |  |
| `b2570b38` | Raiphi Gomez | RV Gomez | — | Batter | Pune Warriors | Kochi Tuskers Kerala, Pune Warriors | 2011–2013 (2) | 2011-04-09 | 2013-05-19 | 13 |  |
| `88fccd6c` | Shaun Pollock | SM Pollock | — | All-rounder | Mumbai Indians | Mumbai Indians | 2008 | 2008-04-20 | 2008-05-28 | 13 |  |
| `e86754b2` | Tom Curran | TK Curran | — | Bowler | Delhi Capitals | Kolkata Knight Riders, Rajasthan Royals, Delhi Capitals | 2018–2021 (3) | 2018-04-10 | 2021-10-10 | 13 |  |
| `5f26df4f` | Vikramjeet Malik | VS Malik | — | All-rounder | Rajasthan Royals | Kings XI Punjab, Rajasthan Royals | 2009–2014 (5) | 2009-04-19 | 2014-05-23 | 13 |  |
| `bcce309e` | WPUJC Vaas | WPUJC Vaas | — | Bowler | Deccan Chargers | Deccan Chargers | 2008–2010 (3) | 2008-04-20 | 2010-04-18 | 13 |  |
| `99b202b3` | Ajit Chandila | A Chandila | — | Bowler | Rajasthan Royals | Rajasthan Royals | 2012–2013 (2) | 2012-04-23 | 2013-05-09 | 12 |  |
| `ef5da05c` | AG Murtaza | AG Murtaza | — | All-rounder | Pune Warriors | Mumbai Indians, Pune Warriors | 2010–2013 (4) | 2010-03-13 | 2013-05-19 | 12 |  |
| `c15e2193` | Faiz Fazal | FY Fazal | — | Batter | Rajasthan Royals | Rajasthan Royals | 2010–2011 (2) | 2010-03-20 | 2011-05-15 | 12 |  |
| `b4f5c2d9` | Kamlesh Nagarkoti | KL Nagarkoti | — | Batter | Delhi Capitals | Kolkata Knight Riders, Delhi Capitals | 2020–2022 (3) | 2020-09-26 | 2022-03-27 | 12 |  |
| `11df3dc8` | Michael Lumb | MJ Lumb | — | Batter | Deccan Chargers | Rajasthan Royals, Deccan Chargers | 2010–2011 (2) | 2010-03-18 | 2011-05-14 | 12 |  |
| `2461eef2` | PA Reddy | PA Reddy | — | Batter | Sunrisers Hyderabad | Deccan Chargers, Sunrisers Hyderabad | 2012–2013 (2) | 2012-05-06 | 2013-05-01 | 12 |  |
| `d68e7f48` | Ravi Rampaul | R Rampaul | — | Bowler | Royal Challengers Bangalore | Royal Challengers Bangalore | 2013–2014 (2) | 2013-04-13 | 2014-05-24 | 12 |  |
| `76388dc8` | Samuel Badree | S Badree | — | Bowler | Royal Challengers Bangalore | Rajasthan Royals, Chennai Super Kings, Royal Challengers Bangalore | 2013–2017 (3) | 2013-04-06 | 2017-05-07 | 12 |  |
| `0604ef16` | Sanjay Bangar | SB Bangar | — | Batter | Kolkata Knight Riders | Deccan Chargers, Kolkata Knight Riders | 2008–2009 (2) | 2008-04-20 | 2009-04-23 | 12 |  |
| `57efa3be` | Scott Styris | SB Styris | — | All-rounder | Chennai Super Kings | Deccan Chargers, Chennai Super Kings | 2008–2011 (3) | 2008-04-20 | 2011-04-13 | 12 |  |
| `3dba85c2` | WA Mota | WA Mota | — | Batter | Kings XI Punjab | Kings XI Punjab | 2008–2009 (2) | 2008-04-19 | 2009-05-20 | 12 |  |
| `c64c2443` | J Syed Mohammad | J Syed Mohammad | — | All-rounder | Royal Challengers Bangalore | Royal Challengers Bangalore | 2011–2013 (3) | 2011-04-22 | 2013-05-10 | 11 |  |
| `edb3d4f8` | KC Cariappa | KC Cariappa | — | All-rounder | Kolkata Knight Riders | Kolkata Knight Riders, Kings XI Punjab | 2015–2019 (4) | 2015-04-11 | 2019-04-21 | 11 |  |
| `9170ff49` | Parvez Rasool | Parvez Rasool | — | Batter | Royal Challengers Bangalore | Pune Warriors, Sunrisers Hyderabad, Royal Challengers Bangalore | 2013–2016 (4) | 2013-05-09 | 2016-05-07 | 11 |  |
| `90edaaa9` | S Rana | S Rana | — | Batter | Royal Challengers Bangalore | Pune Warriors, Royal Challengers Bangalore | 2011–2014 (2) | 2011-05-19 | 2014-05-24 | 11 |  |
| `facb9086` | SD Chitnis | SD Chitnis | — | Batter | Kings XI Punjab | Mumbai Indians, Rajasthan Royals, Kings XI Punjab | 2008–2012 (4) | 2008-04-27 | 2012-05-19 | 11 |  |
| `fdedb37c` | Simon Katich | SM Katich | — | Batter | Kings XI Punjab | Kings XI Punjab | 2008–2009 (2) | 2008-04-19 | 2009-05-20 | 11 |  |
| `64d43928` | Sohail Tanvir | Sohail Tanvir | Tanvir | Bowler | Rajasthan Royals | Rajasthan Royals | 2008 | 2008-04-26 | 2008-06-01 | 11 |  |
| `4353bba5` | Yusuf Abdulla | YA Abdulla | — | Bowler | Kings XI Punjab | Kings XI Punjab | 2009–2010 (2) | 2009-04-19 | 2010-03-16 | 11 |  |
| `16043342` | Andrew McDonald | AB McDonald | — | Bowler | Royal Challengers Bangalore | Delhi Daredevils, Royal Challengers Bangalore | 2009–2013 (5) | 2009-05-19 | 2013-04-16 | 10 |  |
| `ea0cdc12` | Ajantha Mendis | BAW Mendis | — | All-rounder | Pune Warriors | Kolkata Knight Riders, Pune Warriors | 2008–2013 (4) | 2008-05-25 | 2013-05-11 | 10 |  |
| `342d8ade` | Dilhara Fernando | CRD Fernando | — | Bowler | Mumbai Indians | Mumbai Indians | 2008–2010 (2) | 2008-04-29 | 2010-04-25 | 10 |  |
| `ac5ae4af` | Isuru Udana | I Udana | — | All-rounder | Royal Challengers Bangalore | Royal Challengers Bangalore | 2020 | 2020-09-28 | 2020-11-02 | 10 |  |
| `dec8e038` | Juan Theron | J Theron | — | Bowler | Rajasthan Royals | Kings XI Punjab, Deccan Chargers, Rajasthan Royals | 2010–2015 (3) | 2010-03-21 | 2015-05-01 | 10 |  |
| `f752db61` | James Pattinson | JL Pattinson | — | Bowler | Mumbai Indians | Mumbai Indians | 2020 | 2020-09-19 | 2020-11-03 | 10 |  |
| `44a89551` | KS Bharat | KS Bharat | — | WK-Batter | Delhi Capitals | Royal Challengers Bangalore, Delhi Capitals | 2021–2022 (2) | 2021-09-20 | 2022-05-11 | 10 |  |
| `addbde6c` | Navdeep Saini | N Saini | — | Bowler | Kings XI Punjab | Kings XI Punjab | 2012 | 2012-04-20 | 2012-05-17 | 10 |  |
| `5f4e9e8f` | RR Raje | RR Raje | — | All-rounder | Mumbai Indians | Mumbai Indians | 2008–2009 (2) | 2008-05-04 | 2009-05-12 | 10 |  |
| `7d415ea5` | Ricky Ponting | RT Ponting | — | Batter | Mumbai Indians | Kolkata Knight Riders, Mumbai Indians | 2008–2013 (2) | 2008-04-18 | 2013-04-21 | 10 |  |
| `1da489ff` | S Kaushik | S Kaushik | — | All-rounder | Gujarat Lions | Gujarat Lions | 2016–2017 (2) | 2016-04-29 | 2017-04-18 | 10 |  |
| `0dc00542` | Shahid Afridi | Shahid Afridi | — | All-rounder | Deccan Chargers | Deccan Chargers | 2008 | 2008-04-22 | 2008-05-27 | 10 |  |
| `eea6b7f1` | Stephen Fleming | SP Fleming | — | Batter | Chennai Super Kings | Chennai Super Kings | 2008 | 2008-05-02 | 2008-05-27 | 10 |  |
| `245c97cb` | Tymal Mills | TS Mills | Tymal Mills | Bowler | Mumbai Indians | Royal Challengers Bangalore, Mumbai Indians | 2017–2022 (2) | 2017-04-05 | 2022-04-16 | 10 |  |
| `864c199e` | Adam Voges | AC Voges | — | Batter | Rajasthan Royals | Rajasthan Royals | 2010 | 2010-03-20 | 2010-04-17 | 9 |  |
| `b2a79f17` | Ben Laughlin | B Laughlin | — | All-rounder | Rajasthan Royals | Chennai Super Kings, Rajasthan Royals | 2013–2018 (2) | 2013-04-06 | 2018-05-23 | 9 |  |
| `53f27a35` | Biplab Samantray | BB Samantray | — | Batter | Sunrisers Hyderabad | Deccan Chargers, Sunrisers Hyderabad | 2012–2013 (2) | 2012-05-01 | 2013-05-22 | 9 |  |
| `9b4935c8` | Callum Ferguson | CJ Ferguson | — | Batter | Pune Warriors | Pune Warriors | 2011–2012 (2) | 2011-05-08 | 2012-05-19 | 9 |  |
| `acd4f5dc` | DP Vijaykumar | DP Vijaykumar | — | Bowler | Deccan Chargers | Deccan Chargers | 2008 | 2008-05-03 | 2008-05-27 | 9 |  |
| `6ef60d3a` | Kamran Khan | Kamran Khan | — | All-rounder | Pune Warriors | Rajasthan Royals, Pune Warriors | 2009–2011 (3) | 2009-04-18 | 2011-04-29 | 9 |  |
| `1647bd37` | Karanveer Singh | Karanveer Singh | — | Bowler | Kings XI Punjab | Kings XI Punjab | 2014–2015 (2) | 2014-05-23 | 2015-05-06 | 9 |  |
| `20a941bb` | Makhaya Ntini | M Ntini | — | Bowler | Chennai Super Kings | Chennai Super Kings | 2008 | 2008-05-02 | 2008-06-01 | 9 |  |
| `a2870fb7` | NK Patel | NK Patel | — | Batter | Rajasthan Royals | Rajasthan Royals | 2008–2009 (2) | 2008-05-09 | 2009-05-20 | 9 |  |
| `fb693839` | S Ladda | S Ladda | — | Bowler | Gujarat Lions | Delhi Daredevils, Kolkata Knight Riders, Gujarat Lions | 2010–2016 (4) | 2010-03-15 | 2016-04-11 | 9 |  |
| `b410bd3d` | Sandeep Lamichhane | S Lamichhane | — | Bowler | Delhi Capitals | Delhi Daredevils, Delhi Capitals | 2018–2019 (2) | 2018-05-12 | 2019-04-28 | 9 |  |
| `756389bd` | S Vidyut | S Vidyut | — | Batter | Chennai Super Kings | Chennai Super Kings | 2008 | 2008-05-02 | 2008-06-01 | 9 |  |
| `acc1aeda` | Sheldon Jackson | SP Jackson | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2017–2022 (2) | 2017-04-28 | 2022-05-09 | 9 |  |
| `d718440b` | V Pratap Singh | V Pratap Singh | — | All-rounder | Deccan Chargers | Deccan Chargers | 2012 | 2012-04-19 | 2012-05-20 | 9 |  |
| `d2340a43` | Anand Rajan | Anand Rajan | — | Bowler | Sunrisers Hyderabad | Deccan Chargers, Sunrisers Hyderabad | 2011–2013 (3) | 2011-05-14 | 2013-05-19 | 8 |  |
| `b9be6507` | AS Yadav | AS Yadav | — | Batter | Deccan Chargers | Deccan Chargers | 2008 | 2008-04-20 | 2008-05-27 | 8 |  |
| `3ae3f034` | AUK Pathan | AUK Pathan | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2011–2012 (2) | 2011-04-09 | 2012-05-06 | 8 |  |
| `27af6414` | Ben Rohrer | BJ Rohrer | — | Batter | Delhi Daredevils | Delhi Daredevils | 2013 | 2013-04-16 | 2013-05-19 | 8 |  |
| `e412cb64` | Harry Gurney | HF Gurney | — | All-rounder | Kolkata Knight Riders | Kolkata Knight Riders | 2019 | 2019-04-07 | 2019-05-05 | 8 |  |
| `641ac5ff` | Ish Sodhi | IS Sodhi | — | All-rounder | Rajasthan Royals | Rajasthan Royals | 2018–2019 (2) | 2018-04-29 | 2019-05-04 | 8 |  |
| `d7b3a420` | Jaskaran Singh | Jaskaran Singh | — | All-rounder | Deccan Chargers | Deccan Chargers | 2009–2010 (2) | 2009-05-17 | 2010-04-03 | 8 |  |
| `75224f22` | Keemo Paul | KMA Paul | — | All-rounder | Delhi Capitals | Delhi Capitals | 2019 | 2019-03-24 | 2019-05-10 | 8 |  |
| `7eae4418` | Misbah-ul-Haq | Misbah-ul-Haq | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2008 | 2008-05-03 | 2008-05-28 | 8 |  |
| `e03b66ec` | Mohammad Asif | Mohammad Asif | — | All-rounder | Delhi Daredevils | Delhi Daredevils | 2008 | 2008-04-22 | 2008-05-30 | 8 |  |
| `9ab63e7b` | Mohammad Hafeez | Mohammad Hafeez | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2008 | 2008-04-18 | 2008-05-20 | 8 |  |
| `0c432afb` | Prasanth Parameswaran | P Parameswaran | — | All-rounder | Royal Challengers Bangalore | Kochi Tuskers Kerala, Royal Challengers Bangalore | 2011–2012 (2) | 2011-05-02 | 2012-05-20 | 8 |  |
| `a386e91b` | Paul Collingwood | PD Collingwood | — | Batter | Delhi Daredevils | Delhi Daredevils | 2010 | 2010-03-29 | 2010-04-18 | 8 |  |
| `f5f18a18` | Suraj Randiv | S Randiv | — | All-rounder | Chennai Super Kings | Chennai Super Kings | 2011 | 2011-04-08 | 2011-05-07 | 8 |  |
| `dddca1d6` | SB Wagh | SB Wagh | — | Bowler | Pune Warriors | Rajasthan Royals, Pune Warriors | 2010–2011 (2) | 2010-04-03 | 2011-05-10 | 8 |  |
| `4f629497` | Shane Bond | SE Bond | — | All-rounder | Kolkata Knight Riders | Kolkata Knight Riders | 2010 | 2010-03-16 | 2010-04-19 | 8 |  |
| `8a668774` | Shoaib Ahmed | Shoaib Ahmed | — | Bowler | Deccan Chargers | Deccan Chargers | 2009 | 2009-04-27 | 2009-05-13 | 8 |  |
| `4c4fa80b` | SMSM Senanayake | SMSM Senanayake | — | All-rounder | Kolkata Knight Riders | Kolkata Knight Riders | 2013 | 2013-04-14 | 2013-05-15 | 8 |  |
| `619aa81f` | Wasim Jaffer | W Jaffer | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2008–2009 (2) | 2008-04-18 | 2009-05-07 | 8 |  |
| `297b26da` | Yashpal Singh | Yashpal Singh | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2009 | 2009-04-21 | 2009-05-20 | 8 |  |
| `e249fdaa` | Aakash Chopra | A Chopra | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2008–2009 (2) | 2008-05-08 | 2009-04-21 | 7 |  |
| `bff458c6` | AA Bilakhia | AA Bilakhia | — | Batter | Deccan Chargers | Deccan Chargers | 2009–2010 (2) | 2009-04-27 | 2010-04-05 | 7 |  |
| `1efb8a28` | Aiden Blizzard | AC Blizzard | — | Batter | Mumbai Indians | Mumbai Indians | 2011–2012 (2) | 2011-05-04 | 2012-04-27 | 7 |  |
| `260fd380` | Avishkar Salvi | AM Salvi | — | Bowler | Delhi Daredevils | Delhi Daredevils | 2009–2011 (2) | 2009-04-19 | 2011-05-15 | 7 |  |
| `f18ba07f` | Ankit Soni | Ankit Soni | — | Batter | Gujarat Lions | Gujarat Lions | 2017 | 2017-04-27 | 2017-05-13 | 7 | ✅ |
| `b56dc5f7` | Beuran Hendricks | BE Hendricks | — | All-rounder | Kings XI Punjab | Kings XI Punjab | 2014–2015 (2) | 2014-05-19 | 2015-05-16 | 7 |  |
| `d1c94b25` | Charl Langeveldt | CK Langeveldt | — | Bowler | Royal Challengers Bangalore | Kolkata Knight Riders, Royal Challengers Bangalore | 2009–2011 (3) | 2009-05-20 | 2011-05-17 | 7 |  |
| `a84468fe` | DJ Jacobs | DJ Jacobs | — | Batter | Mumbai Indians | Mumbai Indians | 2011–2012 (2) | 2011-04-10 | 2012-04-16 | 7 |  |
| `1a156c88` | D'Arcy Short | DJM Short | — | Batter | Rajasthan Royals | Rajasthan Royals | 2018 | 2018-04-09 | 2018-05-13 | 7 |  |
| `dded65e7` | Ishank Jaggi | IR Jaggi | — | Batter | Kolkata Knight Riders | Deccan Chargers, Kolkata Knight Riders | 2011–2017 (3) | 2011-04-09 | 2017-05-19 | 7 |  |
| `9a963804` | Liam Plunkett | LE Plunkett | — | Bowler | Delhi Daredevils | Delhi Daredevils | 2018 | 2018-04-23 | 2018-05-20 | 7 |  |
| `cca50cd6` | Luke Wright | LJ Wright | — | Batter | Pune Warriors | Pune Warriors | 2012–2013 (2) | 2012-04-24 | 2013-05-19 | 7 |  |
| `605b7efa` | Manprit Juneja | MC Juneja | — | Batter | Delhi Daredevils | Delhi Daredevils | 2013 | 2013-04-03 | 2013-04-23 | 7 |  |
| `de4b0555` | Rahul Shukla | R Shukla | — | Bowler | Delhi Daredevils | Mumbai Indians, Rajasthan Royals, Delhi Daredevils | 2012–2014 (3) | 2012-04-27 | 2014-05-15 | 7 |  |
| `23ac69e6` | Rob Quiney | RJ Quiney | — | Batter | Rajasthan Royals | Rajasthan Royals | 2009 | 2009-04-23 | 2009-05-20 | 7 |  |
| `287686fd` | S Narwal | S Narwal | — | Bowler | Kolkata Knight Riders | Rajasthan Royals, Kolkata Knight Riders | 2010–2013 (2) | 2010-03-18 | 2013-05-03 | 7 |  |
| `4d6d6280` | Salman Butt | Salman Butt | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2008 | 2008-05-01 | 2008-05-25 | 7 |  |
| `64c34cd0` | Shoaib Malik | Shoaib Malik | — | Batter | Delhi Daredevils | Delhi Daredevils | 2008 | 2008-04-22 | 2008-05-17 | 7 |  |
| `a76d10ba` | TM Srivastava | TM Srivastava | — | Batter | Kings XI Punjab | Kings XI Punjab | 2008–2009 (2) | 2008-04-27 | 2009-05-03 | 7 |  |
| `92aeac25` | Alex Hales | AD Hales | — | Batter | Sunrisers Hyderabad | Sunrisers Hyderabad | 2018 | 2018-04-29 | 2018-05-17 | 6 |  |
| `6834d1f2` | Billy Stanlake | B Stanlake | — | All-rounder | Sunrisers Hyderabad | Royal Challengers Bangalore, Sunrisers Hyderabad | 2017–2018 (2) | 2017-04-08 | 2018-04-22 | 6 |  |
| `0264c10e` | D Salunkhe | D Salunkhe | — | Batter | Rajasthan Royals | Rajasthan Royals | 2008 | 2008-04-19 | 2008-05-28 | 6 |  |
| `2c76b512` | DJ Muthuswami | DJ Muthuswami | — | Bowler | Delhi Daredevils | Delhi Daredevils | 2015 | 2015-04-09 | 2015-04-26 | 6 |  |
| `7d3937ed` | Dominic Thornely | DJ Thornely | — | Batter | Mumbai Indians | Mumbai Indians | 2008 | 2008-04-20 | 2008-05-18 | 6 |  |
| `a7c226e1` | Fidel Edwards | FH Edwards | — | Bowler | Deccan Chargers | Deccan Chargers | 2009 | 2009-04-19 | 2009-05-02 | 6 |  |
| `a316d663` | Hardus Viljoen | GC Viljoen | — | All-rounder | Kings XI Punjab | Kings XI Punjab | 2019 | 2019-03-27 | 2019-04-24 | 6 |  |
| `ff077124` | Kamran Akmal | Kamran Akmal | — | WK-Batter | Rajasthan Royals | Rajasthan Royals | 2008 | 2008-04-21 | 2008-06-01 | 6 |  |
| `f842c2cf` | Michael Clarke | MJ Clarke | — | Batter | Pune Warriors | Pune Warriors | 2012 | 2012-05-01 | 2012-05-19 | 6 |  |
| `23cca426` | Odean Smith | OF Smith | — | All-rounder | Punjab Kings | Punjab Kings | 2022 | 2022-03-27 | 2022-04-17 | 6 |  |
| `6ad3a659` | Palani Amarnath | P Amarnath | — | Bowler | Chennai Super Kings | Chennai Super Kings | 2008 | 2008-04-19 | 2008-05-10 | 6 |  |
| `18c78b11` | Richard Levi | RE Levi | — | Batter | Mumbai Indians | Mumbai Indians | 2012 | 2012-04-04 | 2012-04-29 | 6 |  |
| `a1d053dd` | Sheldon Cottrell | SS Cottrell | — | Bowler | Kings XI Punjab | Kings XI Punjab | 2020 | 2020-09-20 | 2020-10-08 | 6 |  |
| `30e37810` | Sunny Singh | Sunny Singh | — | Batter | Kings XI Punjab | Kings XI Punjab | 2011 | 2011-04-10 | 2011-05-06 | 6 |  |
| `b2ae53f5` | Thilan Thushara | T Thushara | — | All-rounder | Chennai Super Kings | Chennai Super Kings | 2009–2010 (2) | 2009-04-18 | 2010-04-10 | 6 |  |
| `16dfcc19` | Umar Gul | Umar Gul | — | Bowler | Kolkata Knight Riders | Kolkata Knight Riders | 2008 | 2008-05-01 | 2008-05-25 | 6 |  |
| `331ea488` | Usman Khawaja | UT Khawaja | — | Batter | Rising Pune Supergiant | Rising Pune Supergiant | 2016 | 2016-05-05 | 2016-05-21 | 6 |  |
| `18e6906e` | Aniket Choudhary | A Choudhary | Aniket | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2017 | 2017-04-05 | 2017-05-07 | 5 |  |
| `3a02626a` | AG Paunikar | AG Paunikar | — | Batter | Rajasthan Royals | Rajasthan Royals | 2010–2011 (2) | 2010-04-14 | 2011-04-17 | 5 |  |
| `7bb62642` | Anirudh Singh | Anirudh Singh | — | Batter | Deccan Chargers | Deccan Chargers | 2010 | 2010-03-12 | 2010-04-24 | 5 |  |
| `f4f0fafd` | B Sumanth | B Sumanth | — | Batter | Deccan Chargers | Deccan Chargers | 2010 | 2010-04-10 | 2010-04-22 | 5 |  |
| `cfad138c` | Chamara Kapugedera | CK Kapugedera | — | Batter | Chennai Super Kings | Chennai Super Kings | 2008 | 2008-05-08 | 2008-06-01 | 5 |  |
| `b52ffbbd` | Fabian Allen | FA Allen | — | Batter | Mumbai Indians | Punjab Kings, Mumbai Indians | 2021–2022 (2) | 2021-04-21 | 2022-04-16 | 5 |  |
| `be869ccf` | George Garton | GHS Garton | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2021 | 2021-09-29 | 2021-10-11 | 5 |  |
| `4180d897` | Jerome Taylor | JE Taylor | — | All-rounder | Pune Warriors | Pune Warriors | 2011 | 2011-04-25 | 2011-05-04 | 5 |  |
| `6581d753` | Justin Kemp | JM Kemp | — | Batter | Chennai Super Kings | Chennai Super Kings | 2010 | 2010-03-14 | 2010-04-18 | 5 |  |
| `39086549` | Josh Philippe | JR Philippe | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2020 | 2020-09-21 | 2020-11-02 | 5 |  |
| `a9da7784` | Kyle Abbott | KJ Abbott | — | Batter | Kings XI Punjab | Kings XI Punjab | 2016 | 2016-04-17 | 2016-05-21 | 5 |  |
| `469ea22b` | KMDN Kulasekara | KMDN Kulasekara | — | Batter | Chennai Super Kings | Chennai Super Kings | 2011–2012 (2) | 2011-04-27 | 2012-04-28 | 5 |  |
| `0fa5042b` | Luke Ronchi | L Ronchi | — | Batter | Mumbai Indians | Mumbai Indians | 2008–2009 (2) | 2008-04-20 | 2009-05-08 | 5 |  |
| `d872f52a` | Lee Carseldine | LA Carseldine | — | Batter | Rajasthan Royals | Rajasthan Royals | 2009 | 2009-05-02 | 2009-05-11 | 5 |  |
| `d4eef961` | M de Lange | M de Lange | — | Batter | Mumbai Indians | Kolkata Knight Riders, Mumbai Indians | 2012–2015 (3) | 2012-04-05 | 2015-05-08 | 5 |  |
| `710dd98c` | MN van Wyk | MN van Wyk | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2009 | 2009-04-29 | 2009-05-10 | 5 |  |
| `9a0146b3` | Pradeep Sahu | P Sahu | — | Batter | Kings XI Punjab | Kings XI Punjab | 2016 | 2016-04-11 | 2016-04-25 | 5 |  |
| `cedc1d9a` | Pawan Suyal | P Suyal | — | Batter | Mumbai Indians | Mumbai Indians | 2013–2015 (3) | 2013-05-05 | 2015-04-17 | 5 |  |
| `26ff4c29` | Robin Peterson | RJ Peterson | — | Batter | Mumbai Indians | Mumbai Indians | 2012 | 2012-04-25 | 2012-05-06 | 5 |  |
| `6f49cc6e` | Shivam Sharma | Shivam Sharma | — | Batter | Kings XI Punjab | Kings XI Punjab | 2014–2015 (2) | 2014-05-09 | 2015-04-21 | 5 |  |
| `a03bba42` | Tabraiz Shamsi | T Shamsi | — | Batter | Rajasthan Royals | Royal Challengers Bangalore, Rajasthan Royals | 2016–2021 (2) | 2016-04-22 | 2021-09-25 | 5 |  |
| `d2d4bb0a` | Travis Birt | TR Birt | — | Batter | Delhi Daredevils | Delhi Daredevils | 2011 | 2011-04-28 | 2011-05-15 | 5 |  |
| `622cc511` | U Kaul | U Kaul | — | Batter | Kings XI Punjab | Kings XI Punjab | 2008 | 2008-05-05 | 2008-05-21 | 5 |  |
| `f4cb4f53` | AP Majumdar | AP Majumdar | — | Batter | Pune Warriors | Pune Warriors | 2012 | 2012-05-08 | 2012-05-19 | 4 |  |
| `39f82db3` | DJ Harris | DJ Harris | — | Batter | Deccan Chargers | Deccan Chargers | 2012 | 2012-04-07 | 2012-05-10 | 4 |  |
| `b274dbbd` | Eklavya Dwivedi | ER Dwivedi | — | Batter | Gujarat Lions | Gujarat Lions | 2016 | 2016-05-19 | 2016-05-27 | 4 |  |
| `890de8cb` | Gagandeep Singh | Gagandeep Singh | — | Batter | Kings XI Punjab | Kings XI Punjab | 2008 | 2008-05-01 | 2008-05-23 | 4 |  |
| `99ed60f8` | JPR Scantlebury-Searles | JPR Scantlebury-Searles | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2018 | 2018-05-12 | 2018-05-23 | 4 |  |
| `b970a03f` | Michael Klinger | M Klinger | — | Batter | Kochi Tuskers Kerala | Kochi Tuskers Kerala | 2011 | 2011-04-30 | 2011-05-08 | 4 |  |
| `0d232ffd` | MA Khote | MA Khote | — | Batter | Mumbai Indians | Mumbai Indians | 2008 | 2008-04-20 | 2008-04-27 | 4 |  |
| `6ec424a9` | Nayan Doshi | ND Doshi | — | Batter | Rajasthan Royals | Royal Challengers Bangalore, Rajasthan Royals | 2010–2011 (2) | 2010-04-24 | 2011-05-15 | 4 |  |
| `aedc3b7c` | NS Naik | NS Naik | — | Batter | Kolkata Knight Riders | Kings XI Punjab, Kolkata Knight Riders | 2016–2020 (3) | 2016-04-23 | 2020-09-23 | 4 |  |
| `c6097d68` | Oshane Thomas | O Thomas | — | Batter | Rajasthan Royals | Rajasthan Royals | 2019 | 2019-04-25 | 2019-05-04 | 4 |  |
| `36d33dd0` | Ramnaresh Sarwan | RR Sarwan | — | Batter | Kings XI Punjab | Kings XI Punjab | 2008 | 2008-04-25 | 2008-05-10 | 4 |  |
| `670709ec` | Sunil Joshi | SB Joshi | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2008 | 2008-04-18 | 2008-04-30 | 4 |  |
| `40caa465` | Taruwar Kohli | T Kohli | — | Batter | Kings XI Punjab | Rajasthan Royals, Kings XI Punjab | 2008–2009 (2) | 2008-04-19 | 2009-04-21 | 4 |  |
| `ddc0828d` | Andrew Flintoff | A Flintoff | — | Batter | Chennai Super Kings | Chennai Super Kings | 2009 | 2009-04-18 | 2009-04-23 | 3 |  |
| `6165bca6` | Abhinav Mukund | A Mukund | — | Batter | Royal Challengers Bangalore | Chennai Super Kings, Royal Challengers Bangalore | 2008–2013 (2) | 2008-05-24 | 2013-04-29 | 3 |  |
| `d3a3e82d` | Adrian Barath | AB Barath | — | Batter | Kings XI Punjab | Kings XI Punjab | 2010 | 2010-03-19 | 2010-04-11 | 3 |  |
| `dbc50253` | AP Dole | AP Dole | — | Batter | Rajasthan Royals | Rajasthan Royals | 2010 | 2010-04-05 | 2010-04-11 | 3 |  |
| `69d03465` | Alex Carey | AT Carey | — | Batter | Delhi Capitals | Delhi Capitals | 2020 | 2020-10-11 | 2020-10-17 | 3 |  |
| `ff1e68fa` | Baba Indrajith | B Indrajith | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2022 | 2022-04-28 | 2022-05-07 | 3 |  |
| `9868bc75` | BMAJ Mendis | BMAJ Mendis | — | Batter | Delhi Daredevils | Delhi Daredevils | 2013 | 2013-04-09 | 2013-05-04 | 3 |  |
| `272d796e` | Ben Dunk | BR Dunk | — | Batter | Mumbai Indians | Mumbai Indians | 2014 | 2014-04-30 | 2014-05-06 | 3 |  |
| `f24ca2ba` | C Nanda | C Nanda | — | Batter | Mumbai Indians | Mumbai Indians | 2009 | 2009-05-10 | 2009-05-16 | 3 |  |
| `94bc776b` | D Kalyankrishna | D Kalyankrishna | — | Batter | Deccan Chargers | Deccan Chargers | 2008 | 2008-04-24 | 2008-05-01 | 3 |  |
| `e0351c86` | Nuwan Zoysa | DNT Zoysa | — | Batter | Deccan Chargers | Deccan Chargers | 2008 | 2008-04-27 | 2008-05-18 | 3 |  |
| `dce2019b` | Farhaan Behardien | F Behardien | — | Batter | Kings XI Punjab | Kings XI Punjab | 2016 | 2016-05-09 | 2016-05-21 | 3 |  |
| `1558d83b` | Gurinder Sandhu | GS Sandhu | — | Batter | Delhi Daredevils | Delhi Daredevils | 2015 | 2015-05-03 | 2015-05-17 | 3 |  |
| `9948e262` | HE van der Dussen | HE van der Dussen | — | Batter | Rajasthan Royals | Rajasthan Royals | 2022 | 2022-04-10 | 2022-05-11 | 3 |  |
| `f663ef00` | Jeswanth Arunkumar | J Arunkumar | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2008 | 2008-05-08 | 2008-05-17 | 3 |  |
| `6821ac10` | JJ van der Wath | JJ van der Wath | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2011 | 2011-04-14 | 2011-05-17 | 3 |  |
| `012829ff` | John Hastings | JW Hastings | — | Batter | Kolkata Knight Riders | Chennai Super Kings, Kolkata Knight Riders | 2014–2016 (2) | 2014-05-22 | 2016-04-13 | 3 |  |
| `27e71d47` | K Upadhyay | K Upadhyay | — | Batter | Pune Warriors | Pune Warriors | 2012–2013 (2) | 2012-05-11 | 2013-05-09 | 3 |  |
| `8b9704ae` | L Ablish | L Ablish | — | Batter | Kings XI Punjab | Kings XI Punjab | 2010–2011 (2) | 2010-04-09 | 2011-05-06 | 3 |  |
| `1be70c88` | Chamara Silva | LPC Silva | — | Batter | Deccan Chargers | Deccan Chargers | 2008 | 2008-05-18 | 2008-05-25 | 3 |  |
| `44afbf2d` | Nic Maddinson | NJ Maddinson | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2014–2015 (2) | 2014-04-17 | 2015-05-04 | 3 |  |
| `4d5a1617` | R Bishnoi | R Bishnoi | — | Bowler | Royal Challengers Bangalore | Royal Challengers Bangalore | 2009 | 2009-04-20 | 2009-05-01 | 3 |  |
| `a3ecf01f` | RS Sodhi | RS Sodhi | — | Batter | Kings XI Punjab | Kings XI Punjab | 2010 | 2010-04-09 | 2010-04-16 | 3 |  |
| `881a9bdd` | Shivnarine Chanderpaul | S Chanderpaul | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2008 | 2008-04-20 | 2008-05-08 | 3 |  |
| `1a2676c5` | Sean Abbott | SA Abbott | — | Batter | Sunrisers Hyderabad | Royal Challengers Bangalore, Sunrisers Hyderabad | 2015–2022 (2) | 2015-04-11 | 2022-05-05 | 3 |  |
| `10a91f35` | Shoaib Akhtar | Shoaib Akhtar | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2008 | 2008-05-13 | 2008-05-18 | 3 |  |
| `63bff7f9` | Shane Harwood | SM Harwood | — | Batter | Rajasthan Royals | Rajasthan Royals | 2009 | 2009-05-02 | 2009-05-09 | 3 |  |
| `75de770f` | Tatenda Taibu | T Taibu | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2008 | 2008-05-08 | 2008-05-13 | 3 |  |
| `2f3817ce` | TP Sudhindra | TP Sudhindra | — | Batter | Deccan Chargers | Deccan Chargers | 2012 | 2012-04-07 | 2012-05-13 | 3 |  |
| `6dbcf855` | Vijay Zol | VH Zol | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2014 | 2014-05-11 | 2014-05-24 | 3 |  |
| `26d76ad9` | Virat Singh | Virat Singh | — | Batter | Sunrisers Hyderabad | Sunrisers Hyderabad | 2021 | 2021-04-17 | 2021-04-25 | 3 |  |
| `fdcb08c2` | A Uniyal | A Uniyal | — | Batter | Rajasthan Royals | Rajasthan Royals | 2010 | 2010-03-13 | 2010-03-15 | 2 |  |
| `7023d182` | AN Ghosh | AN Ghosh | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2009 | 2009-04-27 | 2009-05-12 | 2 |  |
| `50758325` | Brett Geeves | B Geeves | — | Batter | Delhi Daredevils | Delhi Daredevils | 2008 | 2008-04-19 | 2008-05-24 | 2 |  |
| `94eac556` | Clint McKay | CJ McKay | — | Batter | Mumbai Indians | Mumbai Indians | 2012 | 2012-04-16 | 2012-04-25 | 2 |  |
| `d7a57f75` | D du Preez | D du Preez | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2009 | 2009-05-03 | 2009-05-07 | 2 |  |
| `faa7365d` | Dhruv Shorey | DR Shorey | — | Batter | Chennai Super Kings | Chennai Super Kings | 2018–2019 (2) | 2018-05-05 | 2019-04-26 | 2 |  |
| `53fe6ee4` | Darren Lehmann | DS Lehmann | — | Batter | Rajasthan Royals | Rajasthan Royals | 2008 | 2008-04-19 | 2008-04-21 | 2 |  |
| `f48cf4da` | DT Patil | DT Patil | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2008 | 2008-05-05 | 2008-05-17 | 2 |  |
| `531f0278` | Krishmar Santokie | K Santokie | — | Batter | Mumbai Indians | Mumbai Indians | 2014 | 2014-05-19 | 2014-05-21 | 2 |  |
| `78eb4223` | Kemar Roach | KAJ Roach | — | Batter | Deccan Chargers | Deccan Chargers | 2010 | 2010-03-28 | 2010-04-01 | 2 |  |
| `f21043a5` | MDKJ Perera | MDKJ Perera | — | Batter | Rajasthan Royals | Rajasthan Royals | 2013 | 2013-04-06 | 2013-04-11 | 2 |  |
| `b822e99c` | Nathu Singh | NB Singh | — | Batter | Gujarat Lions | Gujarat Lions | 2017 | 2017-04-23 | 2017-04-27 | 2 |  |
| `5673a3fc` | Nathan McCullum | NL McCullum | — | Batter | Pune Warriors | Pune Warriors | 2011 | 2011-04-25 | 2011-05-01 | 2 |  |
| `8ac93ca2` | Prashant Chopra | P Chopra | — | Batter | Rajasthan Royals | Rajasthan Royals | 2018–2019 (2) | 2018-05-11 | 2019-04-07 | 2 |  |
| `4b4d1957` | PM Sarvesh Kumar | PM Sarvesh Kumar | — | Batter | Deccan Chargers | Deccan Chargers | 2008 | 2008-05-15 | 2008-05-27 | 2 |  |
| `ada15e88` | Peter Handscomb | PSP Handscomb | — | Batter | Rising Pune Supergiant | Rising Pune Supergiant | 2016 | 2016-04-29 | 2016-05-01 | 2 |  |
| `ce4cc4d5` | R Ninan | R Ninan | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2011 | 2011-04-14 | 2011-04-16 | 2 |  |
| `b2b23612` | RG More | RG More | — | Batter | Chennai Super Kings | Chennai Super Kings | 2015 | 2015-04-30 | 2015-05-02 | 2 |  |
| `9ff100a6` | Rohan Gavaskar | RS Gavaskar | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2010 | 2010-03-14 | 2010-03-16 | 2 |  |
| `64a4c383` | Sridharan Sriram | S Sriram | — | Batter | Delhi Daredevils | Royal Challengers Bangalore, Delhi Daredevils | 2010–2011 (2) | 2010-04-10 | 2011-05-15 | 2 |  |
| `fef92afc` | Scott Kuggeleijn | SC Kuggeleijn | — | Batter | Chennai Super Kings | Chennai Super Kings | 2019 | 2019-04-06 | 2019-04-09 | 2 |  |
| `d167edd3` | Scott Boland | SM Boland | — | Batter | Rising Pune Supergiant | Rising Pune Supergiant | 2016 | 2016-05-01 | 2016-05-05 | 2 |  |
| `caa89a48` | SS Sarkar | SS Sarkar | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2009 | 2009-05-10 | 2009-05-20 | 2 |  |
| `5f5d3ad4` | SS Shaikh | SS Shaikh | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2009 | 2009-05-16 | 2009-05-20 | 2 |  |
| `0a4ebc61` | Tyron Henderson | T Henderson | — | Batter | Rajasthan Royals | Rajasthan Royals | 2009 | 2009-04-18 | 2009-05-20 | 2 |  |
| `5748e866` | Tim Paine | TD Paine | — | Batter | Pune Warriors | Pune Warriors | 2011 | 2011-04-20 | 2011-04-29 | 2 |  |
| `91b9300b` | UA Birla | UA Birla | — | Batter | Pune Warriors | Pune Warriors | 2013 | 2013-05-05 | 2013-05-09 | 2 |  |
| `38f2c66c` | VS Yeligati | VS Yeligati | — | Batter | Mumbai Indians | Mumbai Indians | 2008 | 2008-04-23 | 2008-05-21 | 2 |  |
| `bae11797` | Y Gnaneswara Rao | Y Gnaneswara Rao | — | Batter | Kochi Tuskers Kerala | Kochi Tuskers Kerala | 2011 | 2011-05-15 | 2011-05-18 | 2 |  |
| `cfa4bd2b` | Y Prithvi Raj | Y Prithvi Raj | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2019 | 2019-04-21 | 2019-04-25 | 2 |  |
| `5b16a806` | Akila Dananjaya | A Dananjaya | — | Batter | Mumbai Indians | Mumbai Indians | 2018 | 2018-04-14 | 2018-04-14 | 1 |  |
| `2503e881` | Andre Nel | A Nel | — | Batter | Mumbai Indians | Mumbai Indians | 2008 | 2008-05-24 | 2008-05-24 | 1 |  |
| `aa5d8c9e` | A Tomar | A Tomar | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2022 | 2022-05-18 | 2022-05-18 | 1 |  |
| `16605a1b` | AA Kazi | AA Kazi | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2011 | 2011-05-11 | 2011-05-11 | 1 |  |
| `b69e69ed` | Ashley Noffke | AA Noffke | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2008 | 2008-04-18 | 2008-04-18 | 1 |  |
| `888e32bf` | Abdur Razzak | Abdur Razzak | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2008 | 2008-05-17 | 2008-05-17 | 1 |  |
| `afe3355a` | Ankit Bawne | AR Bawne | — | Batter | Delhi Daredevils | Delhi Daredevils | 2017 | 2017-04-28 | 2017-04-28 | 1 |  |
| `b0c772ee` | Brad Haddin | BJ Haddin | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2011 | 2011-04-22 | 2011-04-22 | 1 |  |
| `798934ea` | C Ganapathy | C Ganapathy | — | Batter | Chennai Super Kings | Chennai Super Kings | 2010 | 2010-03-31 | 2010-03-31 | 1 |  |
| `2eeb4370` | C Madan | C Madan | — | Batter | Mumbai Indians | Mumbai Indians | 2010 | 2010-04-13 | 2010-04-13 | 1 |  |
| `1cb14aa4` | Junior Dala | CJ Dala | — | Batter | Delhi Daredevils | Delhi Daredevils | 2018 | 2018-05-12 | 2018-05-12 | 1 |  |
| `2e9fdf9b` | Doug Bracewell | DAJ Bracewell | — | Batter | Delhi Daredevils | Delhi Daredevils | 2012 | 2012-04-07 | 2012-04-07 | 1 |  |
| `ad9c32a2` | Dawid Malan | DJ Malan | — | Batter | Punjab Kings | Punjab Kings | 2021 | 2021-05-02 | 2021-05-02 | 1 |  |
| `14b14cd8` | Darren Bravo | DM Bravo | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2017 | 2017-04-26 | 2017-04-26 | 1 |  |
| `69762509` | Damien Martyn | DR Martyn | — | Batter | Rajasthan Royals | Rajasthan Royals | 2010 | 2010-03-18 | 2010-03-18 | 1 |  |
| `611926bc` | Graham Napier | GR Napier | — | Batter | Mumbai Indians | Mumbai Indians | 2009 | 2009-05-01 | 2009-05-01 | 1 |  |
| `0ed0cdbf` | H Das | H Das | — | Batter | Deccan Chargers | Deccan Chargers | 2008 | 2008-05-18 | 2008-05-18 | 1 |  |
| `0bf15e52` | Harmeet Singh | Harmeet Singh | — | Batter | Rajasthan Royals | Rajasthan Royals | 2013 | 2013-04-11 | 2013-04-11 | 1 |  |
| `943fd425` | I Malhotra | I Malhotra | — | Batter | Deccan Chargers | Deccan Chargers | 2011 | 2011-05-05 | 2011-05-05 | 1 |  |
| `fdf7491e` | Ishan Porel | IC Porel | — | Batter | Punjab Kings | Punjab Kings | 2021 | 2021-09-21 | 2021-09-21 | 1 |  |
| `249abedf` | Jalaj S Saxena | Jalaj S Saxena | — | Batter | Punjab Kings | Punjab Kings | 2021 | 2021-04-18 | 2021-04-18 | 1 |  |
| `bdadf7da` | Joe Denly | JL Denly | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2019 | 2019-04-12 | 2019-04-12 | 1 |  |
| `62e07f92` | KH Devdhar | KH Devdhar | — | Batter | Deccan Chargers | Deccan Chargers | 2011 | 2011-05-21 | 2011-05-21 | 1 |  |
| `d3611425` | Lukman Meriwala | LI Meriwala | — | Batter | Delhi Capitals | Delhi Capitals | 2021 | 2021-04-18 | 2021-04-18 | 1 |  |
| `e186f49c` | Mashrafe Mortaza | Mashrafe Mortaza | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2009 | 2009-05-16 | 2009-05-16 | 1 |  |
| `86ae8ef2` | MB Parmar | MB Parmar | — | Batter | Kolkata Knight Riders | Kolkata Knight Riders | 2010 | 2010-04-01 | 2010-04-01 | 1 |  |
| `0164b064` | Michael Neser | MG Neser | — | Batter | Kings XI Punjab | Kings XI Punjab | 2013 | 2013-05-06 | 2013-05-06 | 1 |  |
| `2bb09eb2` | Mohammad Ashraful | Mohammad Ashraful | — | Batter | Mumbai Indians | Mumbai Indians | 2009 | 2009-05-21 | 2009-05-21 | 1 |  |
| `fb24e76c` | Monu Kumar | Monu Kumar | — | Batter | Chennai Super Kings | Chennai Super Kings | 2020 | 2020-10-25 | 2020-10-25 | 1 |  |
| `6042bf26` | Nathan Rimmington | NJ Rimmington | — | Batter | Kings XI Punjab | Kings XI Punjab | 2011 | 2011-04-10 | 2011-04-10 | 1 |  |
| `eaa90ab4` | Pankaj Dharmani | P Dharmani | — | Batter | Kings XI Punjab | Kings XI Punjab | 2008 | 2008-04-19 | 2008-04-19 | 1 |  |
| `ddb00822` | P Prasanth | P Prasanth | — | Batter | Kochi Tuskers Kerala | Kochi Tuskers Kerala | 2011 | 2011-05-15 | 2011-05-15 | 1 |  |
| `441c72ae` | Prayas Ray Barman | P Ray Barman | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2019 | 2019-03-31 | 2019-03-31 | 1 |  |
| `33ffc3dd` | R Sanjay Yadav | R Sanjay Yadav | — | Batter | Mumbai Indians | Mumbai Indians | 2022 | 2022-05-17 | 2022-05-17 | 1 |  |
| `7c390b03` | RA Shaikh | RA Shaikh | — | Batter | Mumbai Indians | Mumbai Indians | 2009 | 2009-05-21 | 2009-05-21 | 1 |  |
| `7d3720ba` | RR Bhatkal | RR Bhatkal | — | Batter | Royal Challengers Bangalore | Royal Challengers Bangalore | 2012 | 2012-04-12 | 2012-04-12 | 1 |  |
| `21ac077a` | RR Bose | RR Bose | — | Batter | Kings XI Punjab | Kings XI Punjab | 2009 | 2009-04-24 | 2009-04-24 | 1 |  |
| `c9d33ef5` | RV Pawar | RV Pawar | — | Batter | Mumbai Indians | Mumbai Indians | 2008 | 2008-05-16 | 2008-05-16 | 1 |  |
| `67af6f81` | Ray Price | RW Price | — | Batter | Mumbai Indians | Mumbai Indians | 2011 | 2011-05-22 | 2011-05-22 | 1 |  |
| `ade90de7` | S Midhun | S Midhun | — | Batter | Rajasthan Royals | Rajasthan Royals | 2019 | 2019-04-07 | 2019-04-07 | 1 |  |
| `9601c534` | Siddhesh Lad | SD Lad | — | Batter | Mumbai Indians | Mumbai Indians | 2019 | 2019-04-10 | 2019-04-10 | 1 |  |
| `b51f72a5` | SS Agarwal | SS Agarwal | — | Batter | Gujarat Lions | Gujarat Lions | 2017 | 2017-04-23 | 2017-04-23 | 1 |  |
| `0af3426f` | SS Mundhe | SS Mundhe | — | Batter | Pune Warriors | Pune Warriors | 2011 | 2011-05-21 | 2011-05-21 | 1 |  |
| `ee3dfa89` | Sunny Gupta | Sunny Gupta | — | Batter | Delhi Daredevils | Delhi Daredevils | 2012 | 2012-05-25 | 2012-05-25 | 1 |  |
| `c9cac448` | Tanmay Mishra | T Mishra | — | Batter | Deccan Chargers | Deccan Chargers | 2012 | 2012-04-17 | 2012-04-17 | 1 |  |
| `c28e9f12` | Tejas Baroka | Tejas Baroka | — | Batter | Gujarat Lions | Gujarat Lions | 2017 | 2017-04-09 | 2017-04-09 | 1 |  |
| `1763bc6c` | X Thalaivan Sargunam | X Thalaivan Sargunam | — | Batter | Sunrisers Hyderabad | Sunrisers Hyderabad | 2013 | 2013-04-25 | 2013-04-25 | 1 |  |
| `33cb3411` | Younis Khan | Younis Khan | — | Batter | Rajasthan Royals | Rajasthan Royals | 2008 | 2008-05-28 | 2008-05-28 | 1 |  |

## Replacement players — per-season details

Source: `replacement-players.json`. Mid-season signings that joined after the auction to cover injuries or unavailability. Entries are keyed by season.

### 2017

| player | team | replacing | reason |
|---|---|---|---|
| Colin de Grandhomme | Kolkata Knight Riders | Andre Russell | Doping code violation ban |
| Imran Tahir | Rising Pune Supergiant | Mitchell Marsh | Shoulder injury |
| Ben Hilfenhaus | Delhi Daredevils | JP Duminy | Personal reasons |
| Marlon Samuels | Delhi Daredevils | Quinton de Kock | Finger injury |
| Vishnu Vinod | Royal Challengers Bangalore | KL Rahul | Shoulder injury |
| Washington Sundar | Rising Pune Supergiant | R Ashwin | Sports hernia |
| Ishant Sharma | Kings XI Punjab | Murali Vijay | Wrist and shoulder injury |
| Harpreet Singh Bhatia | Royal Challengers Bangalore | Sarfaraz Khan | Leg injury |
| Irfan Pathan | Gujarat Lions | Dwayne Bravo | Hamstring injury |
| Ankit Soni | Gujarat Lions | Shivil Kaushik | Injury |
| Brendon McCullum | Gujarat Lions | Andrew Tye | Dislocated shoulder |
| Nathu Singh | Gujarat Lions | Brendon McCullum | Hamstring strain |
| Marcus Stoinis | Kings XI Punjab | Jason Roy | International duty |

### 2018

| player | team | replacing | reason |
|---|---|---|---|
| Mitchell McClenaghan | Mumbai Indians | Jason Behrendorff | Back problem |
| Corey Anderson | Royal Challengers Bangalore | Nathan Coulter-Nile | Injury |
| Alex Hales | Sunrisers Hyderabad | David Warner | Ball tampering ban |
| Heinrich Klaasen | Rajasthan Royals | Steve Smith | Ball tampering ban |
| Tom Curran | Kolkata Knight Riders | Mitchell Starc | Tibial bone stress |
| Liam Plunkett | Delhi Daredevils | Kagiso Rabada | Lower-back stress reaction |
| Adam Milne | Mumbai Indians | Pat Cummins | Back injury |
| Ish Sodhi | Rajasthan Royals | Zahir Khan Pakteen | Injury |
| Prasidh Krishna | Kolkata Knight Riders | Kamlesh Nagarkoti | Foot injury |
| Chris Morris | Delhi Daredevils | Billy Stanlake | Fractured finger |
| Junior Dala | Delhi Daredevils | Chris Morris | Back injury |
| David Willey | Chennai Super Kings | Mark Wood | Returned to England |

### 2020

| player | team | replacing | reason |
|---|---|---|---|
| Daniel Sams | Delhi Capitals | Jason Roy | Injury |
| Anrich Nortje | Delhi Capitals | Chris Woakes | Personal reasons |
| James Pattinson | Mumbai Indians | Lasith Malinga | Personal reasons (family) |
| Adam Zampa | Royal Challengers Bangalore | Kane Richardson | Personal reasons (family) |

### 2021

| player | team | replacing | reason |
|---|---|---|---|
| Wanindu Hasaranga | Royal Challengers Bangalore | Adam Zampa | Withdrawal |
| Dushmantha Chameera | Royal Challengers Bangalore | Daniel Sams | Withdrawal |
| Tim David | Royal Challengers Bangalore | Finn Allen | Withdrawal |
| George Garton | Royal Challengers Bangalore | Kane Richardson | Withdrawal |
| Akash Deep | Royal Challengers Bangalore | Washington Sundar | Injury |
| Tim Southee | Kolkata Knight Riders | Pat Cummins | Withdrawal |
| Nathan Ellis | Punjab Kings | Riley Meredith | Withdrawal |
| Adil Rashid | Punjab Kings | Jhye Richardson | Withdrawal |
| Aiden Markram | Punjab Kings | Dawid Malan | Withdrawal |
| Glenn Phillips | Rajasthan Royals | Jofra Archer | Injury |
| Tabraiz Shamsi | Rajasthan Royals | Andrew Tye | Withdrawal |
| Evin Lewis | Rajasthan Royals | Jos Buttler | Withdrawal |
| Ben Dwarshuis | Delhi Capitals | Chris Woakes | Withdrawal |
| Kulwant Khejroliya | Delhi Capitals | Siddharth Manimaran | Injury |
| Sherfane Rutherford | Sunrisers Hyderabad | Jonny Bairstow | Withdrawal |
| Simarjeet Singh | Mumbai Indians | Arjun Tendulkar | Injury |
| Dominic Drakes | Chennai Super Kings | Sam Curran | Injury |

### 2022

| player | team | replacing | reason |
|---|---|---|---|
| Rahmanullah Gurbaz | Gujarat Titans | Jason Roy | Bubble fatigue withdrawal |
| Aaron Finch | Kolkata Knight Riders | Alex Hales | Bubble fatigue withdrawal |
| Andrew Tye | Lucknow Super Giants | Mark Wood | Elbow injury |
| Rajat Patidar | Royal Challengers Bangalore | Luvnith Sisodia | Injury |
| Matheesha Pathirana | Chennai Super Kings | Adam Milne | Hamstring injury |

### 2023

| player | team | replacing | reason |
|---|---|---|---|
| Sandeep Warrier | Mumbai Indians | Jasprit Bumrah | Back injury |
| Riley Meredith | Mumbai Indians | Jhye Richardson | Hamstring surgery |
| Wayne Parnell | Royal Challengers Bangalore | Reece Topley | Shoulder dislocation |
| Michael Bracewell | Royal Challengers Bangalore | Will Jacks | Muscle injury |
| Vijaykumar Vyshak | Royal Challengers Bangalore | Rajat Patidar | Heel injury |
| Matthew Short | Punjab Kings | Jonny Bairstow | Golf accident injury |
| Gurnoor Brar | Punjab Kings | Raj Bawa | Shoulder injury |
| Akash Singh | Chennai Super Kings | Mukesh Choudhary | Back stress fracture |
| Sisanda Magala | Chennai Super Kings | Kyle Jamieson | Back stress fracture |
| Sandeep Sharma | Rajasthan Royals | Prasidh Krishna | Lumbar stress fracture |
| Dasun Shanaka | Gujarat Titans | Kane Williamson | Knee injury |
| Abhishek Porel | Delhi Capitals | Rishabh Pant | Car accident recovery |
| Suryansh Shedge | Kolkata Knight Riders | Jaydev Unadkat | Shoulder injury |
| Kedar Jadhav | Chennai Super Kings | David Willey | Toe injury |
| Priyam Garg | Sunrisers Hyderabad | Kamlesh Nagarkoti | Lower back stress fracture |

### 2024

| player | team | replacing | reason |
|---|---|---|---|
| Sandeep Warrier | Gujarat Titans | Mohammed Shami | Ankle injury |
| BR Sharath | Gujarat Titans | Robin Minz | Bike accident injury |
| Tanush Kotian | Rajasthan Royals | Adam Zampa | Personal reasons |
| Keshav Maharaj | Rajasthan Royals | Prasidh Krishna | Quadriceps injury |
| Phil Salt | Kolkata Knight Riders | Jason Roy | Personal reasons |
| Allah Ghazanfar | Kolkata Knight Riders | Mujeeb Ur Rahman | Injury |
| Shamar Joseph | Lucknow Super Giants | Mark Wood | ECB workload management |
| Matt Henry | Lucknow Super Giants | David Willey | Personal reasons |
| Luke Wood | Mumbai Indians | Jason Behrendorff | Leg injury |
| Kwena Maphaka | Mumbai Indians | Dilshan Madushanka | Hamstring tear |
| Harvik Desai | Mumbai Indians | Vishnu Vinod | Forearm injury |
| Jake Fraser-McGurk | Delhi Capitals | Lungi Ngidi | Lower back injury |
| Dushmantha Chameera | Sunrisers Hyderabad | Gus Atkinson | ECB workload management |

### 2025

| player | team | replacing | reason |
|---|---|---|---|
| Chetan Sakariya | Kolkata Knight Riders | Umran Malik | Injury |
| Corbin Bosch | Mumbai Indians | Lizaad Williams | Knee injury |
| Wiaan Mulder | Sunrisers Hyderabad | Brydon Carse | Injury |
| Dasun Shanaka | Gujarat Titans | Glenn Phillips | Injury |
| Kyle Jamieson | Punjab Kings | Lockie Ferguson | Injury |
| Will O'Rourke | Lucknow Super Giants | Mayank Yadav | Injury |
| Kusal Mendis | Gujarat Titans | Temporary playoff replacement | Playoffs reinforcement |
| Mustafizur Rahman | Delhi Capitals | Jake Fraser-McGurk | Withdrawal |
| Sediqullah Atal | Delhi Capitals | Pre-suspension signing | Squad reinforcement |
| Mayank Agarwal | Royal Challengers Bengaluru | Pre-suspension signing | Squad reinforcement |
| Lhuan-dre Pretorius | Rajasthan Royals | Pre-suspension signing | Squad reinforcement |
| Nandre Burger | Rajasthan Royals | Pre-suspension signing | Squad reinforcement |

### 2026

| player | team | replacing | reason | price |
|---|---|---|---|---|
| Spencer Johnson | Chennai Super Kings | Nathan Ellis | Hamstring injury | 1.5 crore |
| Saurabh Kumar | Kolkata Knight Riders | Akash Deep | Lumbar stress injury | 30 lakh |
| Navdeep Saini | Kolkata Knight Riders | Harshit Rana | Injury | — |
| Blessing Muzarabani | Kolkata Knight Riders | Mustafizur Rahman | BCCI directive | — |
| Dasun Shanaka | Rajasthan Royals | Sam Curran | Groin injury | 2 crore |
| David Payne | Sunrisers Hyderabad | Jack Edwards | Injury | 1.5 crore |
| Kulwant Khejroliya | Gujarat Titans | Prithviraj Yarra | Injury | 30 lakh |

## Notes

- **Historical team names** (e.g., `Royal Challengers Bangalore`, `Delhi Daredevils`, `Kings XI Punjab`) are kept as-is in the source data for fidelity. The UI resolves them through `teams.json` aliases when rendering team badges.
- **`matchCount = 0`** rows in the active bucket are 2026-only debutants whose first game hasn't been played yet.
- The **Seasons** column uses a compact `first–last (count)` format when a player spans more than one season — the full explicit list is in `players.json:seasons[]`.
- Photo mapping lives in `player-photos.json` (Wikipedia URLs).
- Per-player stats (runs, wickets, averages, etc.) live in a **separate file** — see [`player-stats.md`](player-stats.md). The two files join on `players.json:id == player-stats.json:playerId`.
