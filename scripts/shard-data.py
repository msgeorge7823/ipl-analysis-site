#!/usr/bin/env python3
"""Shard monolithic JSON data files into per-entity files for easy auditing.

Reads the existing monolith files under public/data/ (kept intact as the
app still depends on them) and writes sharded copies under new subdirs.

Output layout (all under public/data/):
  teams/{team-id}.json              — one file per franchise
  coaches/{coach-id}.json           — one per coach + index.json
  venues/{venue-slug}.json          — one per venue + index.json
  seasons/{year}.json               — one per season + index.json
  players/{player-id}.json          — one per player + index.json (thin)
  squads/{year}/{team-id}.json      — one per (season, team)
  replacements/{year}.json          — one per season (plus meta)
  reference/*.json                  — static lookups (facts, news, photos)

The existing monoliths are NOT modified.
"""
from __future__ import annotations
import json
import re
import shutil
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path('/mnt/c/Users/samue/OneDrive/Desktop/IPL Analysis/public/data')
SRC = ROOT / '_backup'  # monolith archive — source of truth for sharding

# ─────────────────────────── helpers ────────────────────────────
def slugify(s: str) -> str:
    s = s.lower().strip()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = re.sub(r'-+', '-', s).strip('-')
    return s

def load(name: str):
    with (SRC / name).open() as f:
        return json.load(f)

def dump(obj, path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open('w') as f:
        json.dump(obj, f, indent=2, ensure_ascii=False)

def reset_dir(sub: str):
    """Clear a target subdir so re-running the script is idempotent."""
    p = ROOT / sub
    if p.exists():
        shutil.rmtree(p)
    p.mkdir(parents=True)

# ─────────────────────── build team-name lookup ───────────────────
def build_team_lookup(teams):
    """Map any name/alias → canonical team id."""
    lookup = {}
    for t in teams:
        tid = t['id']
        lookup[t['name']] = tid
        for a in t.get('aliases', []):
            lookup[a] = tid
    return lookup

# ────────────────────────── shard writers ─────────────────────────
def shard_teams(teams):
    reset_dir('teams')
    for t in teams:
        dump(t, ROOT / 'teams' / f"{t['id']}.json")
    idx = [{'id': t['id'], 'name': t['name'], 'shortName': t.get('shortName'),
            'seasons': t.get('seasons', []), 'isDefunct': t.get('isDefunct', False)}
           for t in teams]
    dump(idx, ROOT / 'teams' / 'index.json')
    print(f'  teams/          → {len(teams)} files + index')

def shard_coaches(coaches_doc):
    reset_dir('coaches')
    meta = {k: v for k, v in coaches_doc.items() if k.startswith('_')}
    coaches = coaches_doc['coaches']
    for c in coaches:
        dump(c, ROOT / 'coaches' / f"{c['id']}.json")
    idx = {**meta,
           'coaches': [{'id': c['id'], 'name': c['name'],
                        'nationality': c.get('nationality'),
                        'specialty': c.get('specialty', [])} for c in coaches]}
    dump(idx, ROOT / 'coaches' / 'index.json')
    print(f'  coaches/        → {len(coaches)} files + index')

def shard_venues(venues):
    reset_dir('venues')
    idx = []
    for v in venues:
        slug = slugify(v['name'])
        dump(v, ROOT / 'venues' / f'{slug}.json')
        idx.append({'slug': slug, 'name': v['name'], 'city': v.get('city'),
                    'matchCount': v.get('matchCount', 0)})
    dump(idx, ROOT / 'venues' / 'index.json')
    print(f'  venues/         → {len(venues)} files + index')

def shard_seasons(seasons):
    reset_dir('seasons')
    for s in seasons:
        dump(s, ROOT / 'seasons' / f"{s['year']}.json")
    idx = [{'year': s['year'], 'winner': s.get('winner'),
            'runnerUp': s.get('runnerUp'), 'isOngoing': s.get('isOngoing', False),
            'matchCount': s.get('matchCount', 0), 'teams': s.get('teams', [])}
           for s in seasons]
    dump(idx, ROOT / 'seasons' / 'index.json')
    print(f'  seasons/        → {len(seasons)} files + index')

def shard_players(players, player_teams):
    reset_dir('players')
    for p in players:
        pid = p['id']
        merged = {**p, 'teamHistory': player_teams.get(pid, [])}
        dump(merged, ROOT / 'players' / f'{pid}.json')
    idx = [{'id': p['id'], 'name': p['name'], 'shortName': p.get('shortName'),
            'role': p.get('role'), 'status': p.get('status'),
            'lastTeam': p.get('lastTeam'), 'seasons': p.get('seasons', [])}
           for p in players]
    dump(idx, ROOT / 'players' / 'index.json')
    print(f'  players/        → {len(players)} files + index')

def shard_squads_2026(squads_2026, team_lookup):
    """Shard the 2026 official squad file (with captain/coach/price/retained)."""
    out_dir = ROOT / 'squads' / '2026'
    if out_dir.exists():
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True)
    count = 0
    for team_name, body in squads_2026.items():
        tid = team_lookup.get(team_name)
        if not tid:
            print(f'  ⚠ 2026 squad: unmapped team name "{team_name}" — skipped', file=sys.stderr)
            continue
        doc = {'season': '2026', 'teamId': tid, 'teamName': team_name, **body}
        dump(doc, out_dir / f'{tid}.json')
        count += 1
    print(f'  squads/2026/    → {count} files (official roster)')

def shard_squads_historical(players, player_teams, team_lookup, skip_years=('2026',)):
    """Derive (season, team) rosters from player-teams.json for 2008-2025.

    Each derived roster lists every player who represented that team in that
    season. Fields per player: id, name, shortName, role, country.
    """
    players_by_id = {p['id']: p for p in players}
    # Build (season, team_id) → [player ids] map
    buckets: dict[tuple[str, str], list[str]] = defaultdict(list)
    unmapped = set()
    for pid, entries in player_teams.items():
        for e in entries:
            year = str(e.get('season') or '')
            team_name = e.get('team') or ''
            tid = team_lookup.get(team_name)
            if not tid:
                unmapped.add(team_name)
                continue
            if year in skip_years:
                continue
            buckets[(year, tid)].append(pid)

    total = 0
    for (year, tid), pids in sorted(buckets.items()):
        roster = []
        for pid in pids:
            p = players_by_id.get(pid, {})
            roster.append({
                'id': pid,
                'name': p.get('name'),
                'shortName': p.get('shortName'),
                'role': p.get('role'),
                'country': p.get('country'),
            })
        # de-dup by id
        seen = set(); unique = []
        for r in roster:
            if r['id'] in seen:
                continue
            seen.add(r['id']); unique.append(r)
        unique.sort(key=lambda r: (r.get('role') or '~', r.get('name') or ''))
        doc = {
            'season': year, 'teamId': tid,
            '_derivation': 'Derived from player-teams.json; rosters reflect players who appeared in at least one match.',
            'players': unique,
        }
        dump(doc, ROOT / 'squads' / year / f'{tid}.json')
        total += 1
    if unmapped:
        print(f'  ⚠ Unmapped team names in player-teams.json: {sorted(unmapped)}', file=sys.stderr)
    print(f'  squads/ (hist)  → {total} files (2008-2025 derived)')

def shard_replacements(rep_doc):
    reset_dir('replacements')
    meta = {k: v for k, v in rep_doc.items() if k.startswith('_')}
    count = 0
    for key, lst in rep_doc.items():
        if key.startswith('_'):
            continue
        dump({'season': key, 'players': lst}, ROOT / 'replacements' / f'{key}.json')
        count += 1
    dump(meta, ROOT / 'replacements' / 'index.json')
    print(f'  replacements/   → {count} files + index')

def copy_reference(files):
    ref = ROOT / 'reference'
    if ref.exists():
        shutil.rmtree(ref)
    ref.mkdir(parents=True)
    for src_name in files:
        src = SRC / src_name
        if not src.exists():
            print(f'  ⚠ reference: missing source {src_name}', file=sys.stderr)
            continue
        # Mirror file content verbatim (pretty-printed for readability)
        with src.open() as f:
            data = json.load(f)
        dump(data, ref / src_name)
    print(f'  reference/      → {len(files)} files')

# ────────────────────────────── main ──────────────────────────────
def main():
    print(f'Output base: {ROOT}')
    print('Loading monolith sources…')
    teams          = load('teams.json')
    coaches_doc    = load('coaches.json')
    venues         = load('venues.json')
    seasons        = load('seasons.json')
    squads_2026    = load('squads-2026.json')
    players        = load('players.json')
    player_teams   = load('player-teams.json')
    replacements   = load('replacement-players.json')
    team_lookup    = build_team_lookup(teams)

    print('\nSharding…')
    shard_teams(teams)
    shard_coaches(coaches_doc)
    shard_venues(venues)
    shard_seasons(seasons)
    shard_players(players, player_teams)
    shard_squads_2026(squads_2026, team_lookup)
    shard_squads_historical(players, player_teams, team_lookup)
    shard_replacements(replacements)
    copy_reference([
        'ipl-facts.json',
        'ipl-news.json',
        'ipl-sponsors.json',
        'squad-name-mapping.json',
        'player-photos.json',
        'coach-photos.json',
    ])
    print('\nDone.')

if __name__ == '__main__':
    main()
