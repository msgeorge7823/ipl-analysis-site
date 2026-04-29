# News

**Source:** `public/data/ipl-news.json`
**Consumed by:** `Home.tsx` (featured hero carousel) and `News.tsx` (full feed)
**Last updated (in file):** 2026-04-11
**Items:** 14

## Schema

| Field | Required | Notes |
|---|---|---|
| `id` | yes | Stable slug `news-YYYY-MM-DD-slug` |
| `headline` | yes | Long-form headline |
| `url` | yes | Source link |
| `source` | yes | Publisher name |
| `date` | yes | `YYYY-MM-DD` |
| `category` | yes | Feature / Match Report / Transfer / Auction / Milestone / Highlights / Disciplinary / Season Preview |
| `excerpt` | no | Short summary |
| `ctaHeadline` | no | Shorter click-driving headline (Home hero only) |
| `kicker` | no | Tag line such as "IPL 2026 · BREAKING" |
| `heroColor` | no | Hex, drives the hero gradient |
| `featured` | no | Only set `true` for in-season headline stories — these render on Home |

Items must remain **reverse-chronological** (newest first).

## Featured items (render on Home)

| Date | Kicker | Headline | Source |
|---|---|---|---|
| 2026-04-11 | IPL 2026 · FEATURE | Virat Kohli breaks Rohit Sharma's most-runs-against-a-single-team IPL record | DNA India |
| 2026-04-11 | IPL 2026 · RISING STAR | Vaibhav Sooryavanshi: 252 runs in 7 matches at SR 200+ | Prokerala |
| 2026-04-10 | IPL 2026 · MATCH REPORT | Rajasthan Royals pull off last-over thriller against defending champions RCB | myKhel |
| 2026-04-10 | IPL 2026 · BREAKING | LSG sign George Linde as replacement for injured Wanindu Hasaranga | IPL Official |
| 2026-04-08 | IPL 2026 · MILESTONE | Rohit Sharma's fastest IPL fifty — 23 balls vs KKR | Yahoo Sports |
| 2026-04-05 | IPL 2026 · MATCH REPORT | Mohammed Shami's 2/9 on LSG debut vs SRH | ESPNcricinfo |

## Full feed (all items)

| Date | Category | Headline | Source | Featured |
|---|---|---|---|---|
| 2026-04-11 | Feature | Kohli breaks Rohit's most-runs-vs-single-team record | DNA India | ✅ |
| 2026-04-11 | Feature | Vaibhav Sooryavanshi breakout story | Prokerala | ✅ |
| 2026-04-10 | Match Report | RR stun RCB in Guwahati thriller | myKhel | ✅ |
| 2026-04-10 | Transfer | LSG sign George Linde | IPL Official | ✅ |
| 2026-04-09 | Highlights | KKR vs LSG Match 15 highlights (Eden) | IPL Official | — |
| 2026-04-08 | Milestone | Rohit's 23-ball 50 vs KKR | Yahoo Sports | ✅ |
| 2026-04-08 | Disciplinary | Conduct breaches reported in DC vs GT (Match 14) | IPL Official | — |
| 2026-04-05 | Match Report | Shami 2/9 on LSG debut vs SRH | ESPNcricinfo | ✅ |
| 2026-04-03 | Match Report | CSK vs PBKS blockbuster recap | ESPNcricinfo | — |
| 2026-03-28 | Season Preview | IPL 2026 begins: 10 teams, 74 matches, 13 venues | Wikipedia | — |
| 2025-12-16 | Auction | Cameron Green most expensive overseas at ₹25.20 Cr | ESPN | — |
| 2025-12-10 | Transfer | Jadeja moves to RR after 12 seasons at CSK | ESPNcricinfo | — |
| 2025-12-10 | Transfer | Samson moves from RR → CSK at ₹18 Cr | ESPNcricinfo | — |
| 2025-12-10 | Transfer | Shami traded from SRH → LSG | ESPNcricinfo | — |

## Editorial rules (from `_instructions`)

- Required fields: `id, headline, url, source, date, category`.
- Set `featured: true` **only** for in-season headline stories — these get the magazine-style hero carousel on Home.
- Keep reverse-chronological order — newest at the top of `items[]`.
- `ctaHeadline`, `kicker`, `heroColor` only exist on featured stories.
