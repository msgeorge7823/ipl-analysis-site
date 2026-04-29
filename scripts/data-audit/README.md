# Player Data Audit Pipeline

A re-runnable Python audit that catches the most common player-data bugs in
this repo. Built after a series of incidents where:

- Players actively playing in IPL 2026 were tagged `retired` (Sunil Narine, Ravichandran Ashwin, Karn Sharma).
- Catastrophic mis-mappings in `squad-name-mapping.json`: `"Raghu Sharma"` pointed at **Rohit Sharma's** player ID; `"Mangesh Yadav"` pointed at Umesh Yadav; `"Tripurana Vijay"` at Murali Vijay.
- Inconsistent name conventions across `players.json`, `squads-2026.json`, scorecards, and ball-by-ball data caused silent data joins to break.

The audit is **conservative by default** — it writes a report and never modifies files unless you pass `--apply-safe`, which only applies deterministic, unambiguous fixes (squad-2026 presence → `active`).

---

## Files

```
scripts/data-audit/
├── audit_player_data.py      # the audit script
├── known-aliases.json        # whitelist of legitimate squad-name -> player.name pairs
├── README.md                 # this file
└── reports/                  # generated reports (audit-YYYY-MM-DD.md)
```

The script reads:
- `public/data/players.json`           — canonical player roster
- `public/data/players-index.json`     — lighter index, must stay in sync
- `public/data/squads-2026.json`       — current-season squads (source of truth for "active")
- `public/data/scorecards/batting-2026.json` + `bowling-2026.json` — for the data-completeness check
- `scripts/data-pipeline/squad-name-mapping.json` — squad display name → player ID resolver

---

## Running the audit

From the repo root:

```bash
python scripts/data-audit/audit_player_data.py
```

This writes a markdown report to `scripts/data-audit/reports/audit-YYYY-MM-DD.md` and prints a one-line summary per check.

To apply the safe automatic fixes (squad-2026 presence → active):

```bash
python scripts/data-audit/audit_player_data.py --apply-safe
```

`--apply-safe` will **never** mark anyone as retired or inactive — that requires a web-verified retirement announcement and a manual edit.

---

## What each check does

| Check | What it catches | What to do |
|---|---|---|
| **Suspicious mappings** | `squad-name-mapping.json` entries where the squad display name and the resolved player.name disagree on first name or surname. Catches catastrophic mis-mappings (Raghu Sharma → Rohit Sharma). | Edit `squad-name-mapping.json` and either correct the ID or set it to `null` (and add the player as a new entry in `players.json` if needed). |
| **Missing from players.json** | Squad-2026 players whose name has no mapping at all. | Create a new entry in `players.json` (and `players-index.json`) for each. Add the squad-name → ID alias in `squad-name-mapping.json`. |
| **Squad-not-active** | Squad-2026 players whose mapping resolves to a player tagged `inactive`/`retired`. | Run with `--apply-safe` to flip these. |
| **Played 2025/26 but not active** | Players whose `seasons` array contains 2025 or 2026 but who aren't tagged active. | Run with `--apply-safe`. |
| **Stale active** | Players tagged `active` whose last season is before 2024. May indicate they should be re-classified as `inactive` or `retired`. | Manual review — verify each via web search before flipping. |
| **Index drift** | `players.json` and `players-index.json` disagree on a player's `status`. | Run `--apply-safe`, which re-syncs the index. |
| **Data-completeness gap** | Squad-2026 players with no batting/bowling scorecard appearance in 2026. Not necessarily a bug — could just mean they haven't been picked yet. | Spot-check; if you expect them to have played, the scorecard ETL may be lagging. |

---

## Status classification rules

These rules are enforced by the pipeline and reflect a permanent project standard (saved to memory):

- **`active`** — Currently on an IPL squad for the current season. Use `squads-2026.json` as the source of truth. Anyone in any 2026 squad MUST be `active`, regardless of whether their last scorecard appearance was 2024 or earlier.
- **`inactive`** — Did not get a contract this season (went unsold, not retained, not picked) but has **NOT** announced retirement. They may still be playing other T20 leagues (PSL, SA20, BBL, ILT20, MLC, BPL, CPL), county cricket, or domestic first-class cricket. Examples from the 2026 audit: David Warner (plays PSL), Kane Williamson (plays SA20), Mark Wood (recovering from surgery), Daryl Mitchell (world #1 ODI batter, just unsold).
- **`retired`** — Has formally announced retirement from professional/franchise cricket via an official statement covered by ESPNcricinfo, ICC, BCCI, or major sports outlets. Partial retirements (e.g. "retired from limited-overs cricket only" while still playing first-class) → keep as `inactive`, **not** retired.

**Crucial corollary:** going unsold in an auction is not the same as retirement. Auction outcomes are transient market events; retirement is a one-way career decision. Never auto-classify an unsold player as retired.

---

## Updating `known-aliases.json`

The audit's first-name heuristic flags as "suspicious" any mapping where the squad display name's first name doesn't match the player.name first token (e.g. `"Sai Kishore"` vs `"R Sai Kishore"`). This is the right default — it's how we caught Raghu Sharma → Rohit Sharma — but it produces false positives for players whose `players.json` name is in long-form initial style and the squad display name is the commonly-known short form.

When the audit flags a mapping that you've manually verified is correct, add it to `known-aliases.json`:

```json
{
  "Sai Kishore": "R Sai Kishore",
  "Dushmantha Chameera": "PVD Chameera"
}
```

The key is the **squad display name** (as it appears in `squads-2026.json`); the value is the **`players.json` name field** (full long form).

---

## Adding a new player to `players.json`

When the "Missing from players.json" list grows (new uncapped signings, overseas players who haven't played IPL before), add an entry like:

```json
{
  "id": "<8-hex-char unique id, generate via uuid>",
  "name": "<canonical full name>",
  "shortName": "<short form, e.g. 'V Suryavanshi'>",
  "nicknames": [],
  "role": "Batter | Bowler | All-rounder | WK-Batter",
  "teams": ["<franchise>"],
  "lastTeam": "<franchise>",
  "seasons": ["2026"],
  "firstMatch": "2026-MM-DD or null",
  "lastMatch": "2026-MM-DD or null",
  "matchCount": 0,
  "status": "active",
  "isReplacement": false
}
```

Then add the same entry to `players-index.json` (the `players-index.json` schema is a strict subset — see existing entries) and add an alias in `squad-name-mapping.json`:

```json
"Squad Display Name": "<the new id>"
```

Re-run the audit. The "Missing" count should drop by one.

---

## When to run the audit

- **Before every release.** This is the broadcast-grade-accuracy gate.
- **After ingesting new scorecard data** (post-match data refresh).
- **After every auction** (player movements between squads).
- **Whenever `players.json`, `players-index.json`, or `squads-2026.json` is hand-edited.**

The script is fast (<1 second) and idempotent — there's no reason not to run it on every commit that touches data files. Consider wiring it into a `package.json` script or a pre-commit hook.

---

## Known limitations

- The audit only checks the **player roster** subsystem — not match results, auction prices, sponsor data, venue info, ratings calculations, etc. Each of those would need its own audit pass; they are out of scope here.
- The "missing from players.json" list (currently 58 entries) requires manual data entry for each player. There's no automated way to generate stub entries because we need verified date-of-birth, role, full name, nationality, etc.
- The audit cannot tell whether a name is a typo or a different person. False negatives are possible when typos coincidentally produce real player names. The first-name + surname check is the strongest filter, and the `known-aliases.json` whitelist handles the legitimate alias edge cases.
