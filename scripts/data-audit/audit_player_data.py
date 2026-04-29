#!/usr/bin/env python3
"""
Player Data Quality Audit
=========================

A re-runnable audit that catches the kinds of bugs we've been hitting:

  1. Stale `status` fields — players in the current 2026 squads but tagged
     as `inactive`/`retired`, or vice versa.
  2. Catastrophic mis-mappings in squad-name-mapping.json — squad display
     names pointing at the wrong player ID (e.g. "Raghu Sharma" -> Rohit
     Sharma's ID).
  3. Squad-2026 players that have no entry in players.json at all.
  4. Inconsistent name conventions (full vs initial-form vs reversed).
  5. Squad signings that don't yet appear in scorecards/BBB (data-completeness
     gap, not necessarily a bug — useful for follow-up).

It is intentionally conservative: it does NOT auto-flip statuses or rewrite
files. It writes a markdown report under `data-audit/reports/` and prints a
short summary. Apply fixes manually after reviewing the report.

Run from the repo root:
    python scripts/data-audit/audit_player_data.py

Or with options:
    python scripts/data-audit/audit_player_data.py --apply-safe

The `--apply-safe` flag will only apply changes that are deterministic and
unambiguous (e.g. squad-2026 presence -> active). It will NEVER auto-mark
anyone as retired (that requires a web-verified announcement).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path

# Resolve paths relative to this script so it works from any cwd.
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent  # repo root
DATA_DIR = REPO_ROOT / "public" / "data"
PIPELINE_DIR = REPO_ROOT / "scripts" / "data-pipeline"
REPORT_DIR = SCRIPT_DIR / "reports"

PLAYERS_PATH = DATA_DIR / "players.json"
PLAYERS_INDEX_PATH = DATA_DIR / "players-index.json"
SQUADS_PATH = DATA_DIR / "squads-2026.json"
MAPPING_PATH = PIPELINE_DIR / "squad-name-mapping.json"
KNOWN_ALIASES_PATH = SCRIPT_DIR / "known-aliases.json"


# ── Name utilities ───────────────────────────────────────────────────────────


def norm(s: str) -> str:
    return re.sub(r"[^a-z]", "", s.lower())


def split_name(s: str) -> tuple[str, list[str], str]:
    parts = s.split()
    if not parts:
        return ("", [], "")
    return (parts[0], parts[1:-1], parts[-1])


def is_initials(token: str) -> bool:
    """A token is 'initials' if it's 1-4 ALL-CAPS letters (e.g. M, RG, PVD)."""
    return bool(re.fullmatch(r"[A-Z]{1,4}", token))


def first_compatible(squad_first: str, player_first_token: str) -> bool:
    """Is the squad's first name plausibly the same as the player's first token?"""
    sf = squad_first.lower()
    pf = player_first_token
    if not pf:
        return False
    if is_initials(pf):
        return pf[0].lower() == sf[0]
    if sf == pf.lower():
        return True
    if len(sf) == 1 and sf == pf[0].lower():
        return True
    # Allow trivial spelling drift (1 character) for typos like Nitish/Nithish
    if len(sf) >= 4 and len(pf) >= 4 and levenshtein(sf, pf.lower()) <= 1:
        return True
    return False


def levenshtein(a: str, b: str) -> int:
    if a == b:
        return 0
    if not a:
        return len(b)
    if not b:
        return len(a)
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        curr = [i] + [0] * len(b)
        for j, cb in enumerate(b, 1):
            cost = 0 if ca == cb else 1
            curr[j] = min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
        prev = curr
    return prev[-1]


# ── Loaders ──────────────────────────────────────────────────────────────────


def load_json(path: Path):
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def write_json(path: Path, data) -> None:
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        f.write("\n")


# ── Audit checks ─────────────────────────────────────────────────────────────


def audit_status_vs_squad(players, squads, mapping):
    """Players in 2026 squads who aren't tagged active.

    Uses squad-name-mapping.json as the canonical resolver. Names that don't
    have a mapping are returned separately as 'missing'.
    """
    by_id = {p["id"]: p for p in players}

    squad_names: set[str] = set()
    for team_name, info in squads.items():
        for sp in info.get("players", []):
            squad_names.add(sp["name"])

    not_active = []  # (squad_name, player)
    missing = []  # squad_name with no mapping
    for sn in sorted(squad_names):
        pid = mapping.get(sn)
        if pid is None:
            missing.append(sn)
            continue
        p = by_id.get(pid)
        if p is None:
            missing.append(sn)
            continue
        if p.get("status") != "active":
            not_active.append((sn, p))
    return not_active, missing


def audit_mapping_correctness(players, mapping, known_aliases):
    """Find squad->player mappings where the player ID likely points at the WRONG person.

    `known_aliases` is a dict of {squad_name: player.name} pairs that are
    pre-approved (the audit's first-name heuristic flags them as suspicious
    but they're actually correct because of long full-name conventions like
    'Madagamagamage Dasun Shanaka' -> 'MD Shanaka').
    """
    by_id = {p["id"]: p for p in players}
    suspicious = []

    for squad_name, pid in mapping.items():
        if pid is None:
            continue
        p = by_id.get(pid)
        if not p:
            suspicious.append((squad_name, pid, None, None, "orphan_id"))
            continue
        # Whitelist override
        if known_aliases.get(squad_name) == p["name"]:
            continue

        sf, _, sl = split_name(squad_name)
        pf_full, _, pl_full = split_name(p["name"])
        pf_short, _, pl_short = split_name(p["shortName"])

        # Surname must match against either name or shortName
        surname_ok = sl.lower() in (pl_full.lower(), pl_short.lower())
        if not surname_ok:
            sn_norm = norm(squad_name)
            aliases = [norm(p["name"]), norm(p["shortName"])] + [
                norm(x) for x in p.get("nicknames", [])
            ]
            if any(sn_norm == a or (a and (sn_norm in a or a in sn_norm)) for a in aliases):
                continue
            suspicious.append((squad_name, pid, p["name"], p["shortName"], "surname_mismatch"))
            continue

        # First-name check.
        # If player.name has a full first token, compare against THAT only.
        # If player.name first token is initials, fall back to shortName initials.
        if not is_initials(pf_full):
            ok = first_compatible(sf, pf_full)
        else:
            ok = first_compatible(sf, pf_full) or first_compatible(sf, pf_short)

        if not ok:
            # Final fallback: nickname starts-with the squad first name
            sn_first = norm(sf)
            if any(norm(c).startswith(sn_first) for c in p.get("nicknames", []) if c):
                continue
            suspicious.append(
                (squad_name, pid, p["name"], p["shortName"], "firstname_mismatch")
            )

    return suspicious


def audit_status_consistency(players):
    """status field should never contradict the seasons array.

    A player whose seasons include 2025 or 2026 should be 'active'.
    A player whose status is 'active' but who hasn't played in 2024+ is suspect.
    """
    recent = {"2025", "2026"}
    should_be_active = []  # players appearing in recent seasons but not active
    stale_active = []  # active players whose last season is < 2024
    for p in players:
        seasons = set(p.get("seasons", []))
        if recent & seasons and p.get("status") != "active":
            should_be_active.append(p)
        if p.get("status") == "active" and seasons:
            last = max(seasons, key=lambda s: int(s) if s.isdigit() else 0)
            if last not in recent and last != "2024":
                stale_active.append((p, last))
    return should_be_active, stale_active


def audit_index_sync(players, players_index):
    """players-index.json must agree with players.json on status."""
    by_id_full = {p["id"]: p["status"] for p in players}
    drift = []
    for p in players_index:
        full = by_id_full.get(p["id"])
        if full and p.get("status") != full:
            drift.append((p["id"], p.get("name"), p.get("status"), full))
    return drift


def audit_squad_match_data_gap(players, squads, mapping, scorecard_dir):
    """2026 squad players with no batting/bowling appearance in 2026 scorecards yet.

    Not a bug per se — just a flag for follow-up (either uncapped this season,
    or our scorecard ETL hasn't ingested their match yet).
    """
    bat_path = scorecard_dir / "batting-2026.json"
    bowl_path = scorecard_dir / "bowling-2026.json"
    if not bat_path.exists() or not bowl_path.exists():
        return None  # 2026 not started or data missing

    bat = load_json(bat_path)
    bowl = load_json(bowl_path)
    appeared = set()
    for r in bat:
        appeared.add(r.get("batter"))
    for r in bowl:
        appeared.add(r.get("bowler"))

    by_id = {p["id"]: p for p in players}
    not_yet_played = []
    for team_name, info in squads.items():
        for sp in info.get("players", []):
            pid = mapping.get(sp["name"])
            if not pid:
                continue
            p = by_id.get(pid)
            if not p:
                continue
            if p["shortName"] not in appeared and p["name"] not in appeared:
                not_yet_played.append((sp["name"], p["shortName"], team_name))
    return not_yet_played


# ── Reporting ────────────────────────────────────────────────────────────────


def render_report(
    not_active,
    missing,
    suspicious_mappings,
    should_be_active,
    stale_active,
    index_drift,
    data_gap,
) -> str:
    today = date.today().isoformat()
    lines = [
        f"# Player Data Audit Report",
        f"_Generated: {today}_",
        "",
        "## Summary",
        f"- Squad-2026 players not tagged `active`: **{len(not_active)}**",
        f"- Squad-2026 players missing from `players.json`: **{len(missing)}**",
        f"- Suspicious squad->player mappings: **{len(suspicious_mappings)}**",
        f"- Players in 2025/2026 seasons but not `active`: **{len(should_be_active)}**",
        f"- `active` players with old last-season (<2024): **{len(stale_active)}**",
        f"- `players.json` vs `players-index.json` drift: **{len(index_drift)}**",
        f"- Squad players with no 2026 scorecard appearance yet: "
        f"**{len(data_gap) if data_gap is not None else 'n/a'}**",
        "",
    ]

    def section(title: str, items: list, formatter):
        lines.append(f"## {title}")
        if not items:
            lines.append("_None._")
        else:
            for it in items:
                lines.append(f"- {formatter(it)}")
        lines.append("")

    section(
        "Suspicious mappings (different real people — fix immediately)",
        suspicious_mappings,
        lambda x: f"`{x[0]}` -> `{x[2] or 'NO_PLAYER'}` ({x[3] or x[1]}) [{x[4]}]",
    )
    section(
        "Squad-2026 players missing from players.json (need new entries)",
        missing,
        lambda x: f"`{x}`",
    )
    section(
        "Squad-2026 players currently tagged inactive/retired (should be active)",
        not_active,
        lambda x: f"`{x[0]}` -> {x[1]['name']} ({x[1]['shortName']}, currently `{x[1]['status']}`)",
    )
    section(
        "Players who played 2025/2026 but aren't tagged active",
        should_be_active,
        lambda p: f"{p['name']} ({p['shortName']}) — status `{p['status']}`, last season {max(p.get('seasons', ['?']))}",
    )
    section(
        "Active players with last appearance before 2024 (verify each)",
        stale_active,
        lambda x: f"{x[0]['name']} ({x[0]['shortName']}) — last season {x[1]}",
    )
    section(
        "players.json vs players-index.json drift",
        index_drift,
        lambda x: f"{x[1]} ({x[0]}): index says `{x[2]}`, full says `{x[3]}`",
    )
    if data_gap is not None:
        section(
            "Squad-2026 players with no 2026 scorecard appearance yet (data-completeness gap)",
            data_gap[:50],
            lambda x: f"`{x[0]}` ({x[1]}) - {x[2]}",
        )
        if len(data_gap) > 50:
            lines.append(f"_...and {len(data_gap) - 50} more, truncated._")
            lines.append("")

    return "\n".join(lines)


# ── Main ────────────────────────────────────────────────────────────────────


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--apply-safe",
        action="store_true",
        help="Apply ONLY deterministic squad-presence -> active flips. Never auto-retires.",
    )
    parser.add_argument(
        "--report-name",
        default=None,
        help="Override the report filename (default: audit-YYYY-MM-DD.md)",
    )
    args = parser.parse_args()

    REPORT_DIR.mkdir(parents=True, exist_ok=True)

    players = load_json(PLAYERS_PATH)
    players_index = load_json(PLAYERS_INDEX_PATH)
    squads = load_json(SQUADS_PATH)
    mapping = load_json(MAPPING_PATH)
    known_aliases = load_json(KNOWN_ALIASES_PATH) if KNOWN_ALIASES_PATH.exists() else {}
    # Strip metadata keys
    known_aliases = {k: v for k, v in known_aliases.items() if not k.startswith("_")}

    not_active, missing = audit_status_vs_squad(players, squads, mapping)
    suspicious = audit_mapping_correctness(players, mapping, known_aliases)
    should_be_active, stale_active = audit_status_consistency(players)
    drift = audit_index_sync(players, players_index)
    data_gap = audit_squad_match_data_gap(players, squads, mapping, DATA_DIR / "scorecards")

    report = render_report(
        not_active, missing, suspicious, should_be_active, stale_active, drift, data_gap
    )
    fname = args.report_name or f"audit-{date.today().isoformat()}.md"
    out_path = REPORT_DIR / fname
    out_path.write_text(report, encoding="utf-8")

    print(f"Report written: {out_path}")
    print()
    # Brief summary
    print(f"Suspicious mappings:           {len(suspicious)}")
    print(f"Missing from players.json:     {len(missing)}")
    print(f"Squad-not-active:              {len(not_active)}")
    print(f"Played 2025/26 but not active: {len(should_be_active)}")
    print(f"Index drift:                   {len(drift)}")

    if args.apply_safe:
        applied = apply_safe_fixes(players, players_index, not_active, should_be_active)
        print()
        print(f"Applied {applied} safe status flips (squad/season -> active).")


def apply_safe_fixes(players, players_index, not_active, should_be_active):
    """Conservative auto-fix: only flip to 'active' when squad-2026 presence
    OR seasons array directly proves the player is currently playing. Never
    flips to retired."""
    targets: set[str] = set()
    for _, p in not_active:
        targets.add(p["id"])
    for p in should_be_active:
        targets.add(p["id"])

    count = 0
    for p in players:
        if p["id"] in targets and p.get("status") != "active":
            p["status"] = "active"
            count += 1
    if count == 0:
        return 0

    write_json(PLAYERS_PATH, players)

    # Sync index
    by_id = {p["id"]: p["status"] for p in players}
    for p in players_index:
        if p["id"] in by_id and p.get("status") != by_id[p["id"]]:
            p["status"] = by_id[p["id"]]
    write_json(PLAYERS_INDEX_PATH, players_index)
    return count


if __name__ == "__main__":
    main()
