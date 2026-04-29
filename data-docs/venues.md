# Venues

**Source:** `public/data/venues.json`
**Consumed by:** `Venues.tsx`, `VenueDetail.tsx`, match pages
**Records:** 37 venues (India + UAE + South Africa across the 2009 and 2020 offshore seasons)

## Schema

| Field | Type | Notes |
|---|---|---|
| `name` | string | Venue name as it appears in match data |
| `city` | string | City the venue is located in |
| `matchCount` | number | Total IPL matches hosted (all seasons) |
| `avgFirstInningsScore` | number | Average Innings 1 total |
| `avgSecondInningsScore` | number | Average Innings 2 total |

## Venues (sorted by matches hosted)

| # | Venue | City | Matches | Avg 1st | Avg 2nd |
|---|---|---|---:|---:|---:|
| 1 | Wankhede Stadium | Mumbai | 126 | 171 | 160 |
| 2 | Eden Gardens | Kolkata | 102 | 168 | 154 |
| 3 | M Chinnaswamy Stadium | Bengaluru | 101 | 174 | 157 |
| 4 | MA Chidambaram Stadium | Chennai | 92 | 164 | 151 |
| 5 | Rajiv Gandhi International Stadium | Hyderabad | 84 | 165 | 155 |
| 6 | Sawai Mansingh Stadium | Jaipur | 64 | 166 | 153 |
| 7 | Punjab Cricket Association IS Bindra Stadium | Mohali | 61 | 168 | 157 |
| 8 | Feroz Shah Kotla | Delhi | 60 | 162 | 148 |
| 9 | Narendra Modi Stadium | Ahmedabad | 46 | 181 | 165 |
| 10 | Dubai International Cricket Stadium | Dubai | 46 | 164 | 149 |
| 11 | Arun Jaitley Stadium | Delhi | 39 | 188 | 173 |
| 12 | Dr DY Patil Sports Academy | Mumbai | 37 | 160 | 148 |
| 13 | Sheikh Zayed Stadium | Abu Dhabi | 37 | 159 | 147 |
| 14 | Maharashtra Cricket Association Stadium | Pune | 35 | 168 | 149 |
| 15 | Sharjah Cricket Stadium | Sharjah | 28 | 159 | 148 |
| 16 | Brabourne Stadium | Mumbai | 27 | 179 | 166 |
| 17 | Ekana Cricket Stadium | Lucknow | 23 | 174 | 165 |
| 18 | Dr. YSR International Cricket Stadium | Visakhapatnam | 17 | 170 | 142 |
| 19 | Subrata Roy Sahara Stadium | Pune | 16 | 149 | 134 |
| 20 | Kingsmead | Durban | 15 | 152 | 138 |
| 21 | Himachal Pradesh Cricket Association Stadium | Dharamsala | 15 | 183 | 159 |
| 22 | SuperSport Park | Centurion | 12 | 155 | 150 |
| 23 | MYS International Cricket Stadium | Mullanpur | 12 | 168 | 161 |
| 24 | Saurashtra Cricket Association Stadium | Rajkot | 10 | 169 | 163 |
| 25 | Holkar Cricket Stadium | Indore | 9 | 160 | 159 |
| 26 | New Wanderers Stadium | Johannesburg | 8 | 144 | 143 |
| 27 | Newlands | Cape Town | 7 | 139 | 113 |
| 28 | St George's Park | Port Elizabeth | 7 | 159 | 131 |
| 29 | Barabati Stadium | Cuttack | 7 | 168 | 158 |
| 30 | JSCA International Stadium Complex | Ranchi | 7 | 149 | 145 |
| 31 | Barsapara Cricket Stadium | Guwahati | 7 | 164 | 151 |
| 32 | Shaheed Veer Narayan Singh International Stadium | Raipur | 6 | 146 | 144 |
| 33 | Nehru Stadium | Kochi | 5 | 147 | 126 |
| 34 | Green Park | Kanpur | 4 | 161 | 163 |
| 35 | Buffalo Park | East London | 3 | 147 | 119 |
| 36 | De Beers Diamond Oval | Kimberley | 3 | 158 | 141 |
| 37 | Vidarbha Cricket Association Stadium | Nagpur | 3 | 149 | 145 |
| 38 | OUTsurance Oval | Bloemfontein | 2 | 135 | 130 |

## Notes

- SA venues (Kingsmead, SuperSport Park, Newlands, etc.) hosted IPL 2009 during the Indian general elections.
- UAE venues (Dubai, Sharjah, Abu Dhabi) hosted the 2020 COVID season and part of 2021.
- Aggregates are computed at build time by `scripts/` from the ball-by-ball `bbb/` dataset.
