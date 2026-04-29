# IPL Facts

**Source:** `public/data/ipl-facts.json`
**Consumed by:** `Home.tsx` (origin + evolution timeline + did-you-know rail) and `Education.tsx`
**Last updated (in file):** 2026-04-11
**Curation note:** Hand-curated. Verified against Wikipedia, ESPNcricinfo and official IPL sources.

## Schema

Top-level keys:

| Key | Type | Purpose |
|---|---|---|
| `origin` | `{ title, body[] }` | Multi-paragraph essay on *why* the IPL was created |
| `evolution` | `{ year, event }[]` | Year-stamped milestones (timeline UI) |
| `didYouKnow` | `{ icon, fact }[]` | Single-sentence trivia cards |

## Origin — "Why the IPL began"

> The Indian Premier League was launched by the Board of Control for Cricket in India (BCCI) in 2008 as a direct response to the rival Indian Cricket League (ICL) — a privately-run T20 competition founded in 2007 by Subhash Chandra's Essel Group. The ICL operated without BCCI sanction and threatened to pull top players away from official cricket, so the BCCI moved fast to create a league of its own.
>
> The brainchild of Lalit Modi, the IPL combined city-based franchise ownership, a global player auction, English Premier League-style branding, and a made-for-TV 3-hour format. The inaugural season opened on 18 April 2008 in Bangalore with Brendon McCullum's incredible 158* off 73 balls for Kolkata Knight Riders against the Royal Challengers — a performance that instantly signalled the scale of what was about to unfold.
>
> Within a few years the ICL collapsed, and the IPL became not just India's premier domestic T20 competition but the most commercially dominant cricket league in the world — reshaping the global cricketing calendar, player contracts, and broadcast economics in the process.

## Evolution timeline

| Year | Event |
|---|---|
| 2007 | BCCI announces the IPL in response to the rival Indian Cricket League. Lalit Modi appointed as founding commissioner. |
| 2008 | Inaugural auction (February) and first match (18 April, Bangalore). 8 franchises compete; Rajasthan Royals win the first title under captain-coach Shane Warne. |
| 2009 | Tournament relocated to South Africa due to Indian general elections. Deccan Chargers win from last place the previous year. |
| 2010 | IPL becomes the first sporting event broadcast live on YouTube. CSK win their first title. |
| 2011 | Expansion to 10 teams — Kochi Tuskers Kerala and Pune Warriors India added. CSK defend. Kochi disbanded at season's end. |
| 2013 | Spot-fixing scandal rocks the league; investigations against CSK and RR begin. Pune Warriors withdraw. MI win their first title. |
| 2014 | First leg played in UAE due to Indian general elections. KKR win their second title chasing 200 in the final. |
| 2015 | Lodha Committee suspends CSK and RR for two years following the spot-fixing verdict. |
| 2016 | Rising Pune Supergiant and Gujarat Lions replace CSK/RR as temporary teams. SRH win under Tom Moody. |
| 2018 | CSK and RR return. CSK win their third title. Star India's ₹16,347-crore five-year media rights deal takes effect. |
| 2020 | Entire season played in UAE due to COVID-19. MI become the first team to successfully defend the title. |
| 2022 | League expanded to 10 teams — GT and LSG added. GT win the title in their debut season. |
| 2023 | BCCI sells media rights for a record ₹48,390 crore ($6.2 billion) for 2023–2027. |
| 2024 | KKR win their third title under Chandrakant Pandit and mentor Gautam Gambhir — lowest loss count in a full IPL season. |
| 2025 | RCB win their first-ever IPL title after 18 years of near-misses, beating PBKS in the final. |

## Did You Know? (17 cards)

| # | Icon | Fact |
|---|---|---|
| 1 | 🏆 | CSK and MI are the most successful franchises with 5 IPL titles each, followed by KKR with 3. |
| 2 | 💰 | IPL's 2023–2027 media rights sold for ₹48,390 Cr (~$6.2B) — 2nd most valuable sports league per-match, behind only the NFL. |
| 3 | ⚡ | Brendon McCullum's 158\* for KKR in the very first IPL match (18 Apr 2008) remains one of the most iconic innings in the competition's history. |
| 4 | 🎯 | Chris Gayle holds the highest individual IPL score — 175\* off 66 balls for RCB vs PW in 2013, with 17 sixes. |
| 5 | 🔥 | Virat Kohli's 973 runs in 2016 (avg 81.08, 4 hundreds) is the most in a single IPL season — widely considered the greatest individual campaign. |
| 6 | 🧤 | MS Dhoni has played every IPL season since 2008 for CSK (except 2016–17 when CSK were suspended and he captained RPS) — longest one-franchise tenure. |
| 7 | 🌍 | Three IPL seasons have been played wholly or partly outside India: 2009 (SA), 2014 (UAE first leg), 2020/2021 (UAE, COVID). |
| 8 | 💎 | Stephen Fleming is the longest-serving head coach — CSK every season since 2009 (except 2016–17 when he coached RPS). |
| 9 | ⏱️ | IPL matches are designed for a strict 3.5-hour TV window — two 20-over innings plus a short break. |
| 10 | 🏟️ | M Chinnaswamy hosted the very first IPL match (18 Apr 2008, KKR vs RCB) and was the first international venue to become fully solar-powered. |
| 11 | 🎪 | Rajat Patidar's 112\* off 54 balls for RCB in the 2022 Eliminator is the highest individual score in an IPL playoff. |
| 12 | 💣 | Lasith Malinga is MI's all-time leading wicket-taker (170 wickets in 122 matches, 2009–2019) — now back at MI as bowling coach. |
| 13 | 🌟 | Shane Warne's RR in 2008 are the only team to win an IPL in their inaugural season at 100-1 pre-tournament odds. |
| 14 | 🎁 | GT joined in 2022 and became only the second team (after RR in 2008) to win the title in their debut season — under head coach Ashish Nehra. |
| 15 | 🧩 | Playoff format changed in 2011 to Q1/Eliminator/Q2/Final — top two teams get a second chance if they lose Q1. |
| 16 | 🛫 | The 2009 IPL was moved to South Africa in a three-week window — arguably the fastest major sports relocation in history. |
| 17 | 📈 | IPL brand value crossed $10.9 billion in 2024 (D&P Advisory), more than doubling in five years. |

## Notes

- Items are static; updates happen by hand when a new season completes or a new milestone is worth surfacing.
- The Home page renders the first ~6 didYouKnow cards; `/education` can surface all of them.
