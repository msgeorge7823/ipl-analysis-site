#!/usr/bin/env python3
"""Update season-2026.json with match results #16-30 (Apr 10-20, 2026).

Sources: ESPNcricinfo scorecards / official match reports (verified Apr 20 2026).
Only winner, winMargin, playerOfMatch, and innings totals are populated.
Toss data left untouched (not verified individually).
"""
import json
from pathlib import Path

PATH = Path('/mnt/c/Users/samue/OneDrive/Desktop/IPL Analysis/public/data/matches/season-2026.json')

# Updates keyed by matchNumber
UPDATES = {
    16: {  # Apr 10, Barsapara: RR beat RCB by 6 wickets
        'winner': 'Rajasthan Royals',
        'winMargin': {'wickets': 6},
        'pom': 'V Sooryavanshi',
        'innings': [
            {'team': 'Royal Challengers Bengaluru', 'runs': 201, 'wickets': 8, 'overs': 20.0, 'extras': 0},
            {'team': 'Rajasthan Royals',            'runs': 202, 'wickets': 4, 'overs': 18.0, 'extras': 0},
        ],
    },
    17: {  # Apr 11, New Chandigarh: PBKS beat SRH by 6 wickets
        'winner': 'Punjab Kings',
        'winMargin': {'wickets': 6},
        'pom': 'SS Iyer',
        'innings': [
            {'team': 'Sunrisers Hyderabad', 'runs': 219, 'wickets': 6, 'overs': 20.0, 'extras': 0},
            {'team': 'Punjab Kings',        'runs': 223, 'wickets': 4, 'overs': 18.5, 'extras': 0},
        ],
    },
    18: {  # Apr 11, Chennai: CSK beat DC by 23 runs
        'winner': 'Chennai Super Kings',
        'winMargin': {'runs': 23},
        'pom': 'Sanju Samson',
        'innings': [
            {'team': 'Chennai Super Kings', 'runs': 212, 'wickets': 2,  'overs': 20.0, 'extras': 0},
            {'team': 'Delhi Capitals',      'runs': 189, 'wickets': 10, 'overs': 20.0, 'extras': 0},
        ],
    },
    19: {  # Apr 12, Lucknow: GT beat LSG by 7 wickets
        'winner': 'Gujarat Titans',
        'winMargin': {'wickets': 7},
        'pom': 'Prasidh Krishna',
        'innings': [
            {'team': 'Lucknow Super Giants', 'runs': 164, 'wickets': 8, 'overs': 20.0, 'extras': 0},
            {'team': 'Gujarat Titans',       'runs': 165, 'wickets': 3, 'overs': 18.4, 'extras': 0},
        ],
    },
    20: {  # Apr 12, Mumbai: RCB beat MI by 18 runs
        'winner': 'Royal Challengers Bengaluru',
        'winMargin': {'runs': 18},
        'pom': 'PD Salt',
        'innings': [
            {'team': 'Royal Challengers Bengaluru', 'runs': 240, 'wickets': 4, 'overs': 20.0, 'extras': 0},
            {'team': 'Mumbai Indians',              'runs': 222, 'wickets': 5, 'overs': 20.0, 'extras': 0},
        ],
    },
    21: {  # Apr 13, Hyderabad: SRH beat RR by 57 runs
        'winner': 'Sunrisers Hyderabad',
        'winMargin': {'runs': 57},
        'pom': 'Praful Hinge',
        'innings': [
            {'team': 'Sunrisers Hyderabad', 'runs': 216, 'wickets': 6,  'overs': 20.0, 'extras': 0},
            {'team': 'Rajasthan Royals',    'runs': 159, 'wickets': 10, 'overs': 19.0, 'extras': 0},
        ],
    },
    22: {  # Apr 14, Chennai: CSK beat KKR by 32 runs
        'winner': 'Chennai Super Kings',
        'winMargin': {'runs': 32},
        'pom': 'Noor Ahmad',
        'innings': [
            {'team': 'Chennai Super Kings',  'runs': 192, 'wickets': 5, 'overs': 20.0, 'extras': 0},
            {'team': 'Kolkata Knight Riders','runs': 160, 'wickets': 7, 'overs': 20.0, 'extras': 0},
        ],
    },
    23: {  # Apr 15, Bengaluru: RCB beat LSG by 5 wickets
        'winner': 'Royal Challengers Bengaluru',
        'winMargin': {'wickets': 5},
        'pom': 'JR Hazlewood',
        'innings': [
            {'team': 'Lucknow Super Giants',        'runs': 146, 'wickets': 10, 'overs': 19.2, 'extras': 0},
            {'team': 'Royal Challengers Bengaluru', 'runs': 149, 'wickets': 5,  'overs': 15.1, 'extras': 0},
        ],
    },
    24: {  # Apr 16, Mumbai: PBKS beat MI by 7 wickets
        'winner': 'Punjab Kings',
        'winMargin': {'wickets': 7},
        'pom': 'Arshdeep Singh',
        'innings': [
            {'team': 'Mumbai Indians', 'runs': 195, 'wickets': 6, 'overs': 20.0, 'extras': 0},
            {'team': 'Punjab Kings',   'runs': 198, 'wickets': 3, 'overs': 16.3, 'extras': 0},
        ],
    },
    25: {  # Apr 17, Ahmedabad: GT beat KKR by 5 wickets
        'winner': 'Gujarat Titans',
        'winMargin': {'wickets': 5},
        'pom': 'Shubman Gill',
        'innings': [
            {'team': 'Kolkata Knight Riders', 'runs': 180, 'wickets': 10, 'overs': 20.0, 'extras': 0},
            {'team': 'Gujarat Titans',        'runs': 181, 'wickets': 5,  'overs': 19.4, 'extras': 0},
        ],
    },
    26: {  # Apr 18, Bengaluru: DC beat RCB by 6 wickets
        'winner': 'Delhi Capitals',
        'winMargin': {'wickets': 6},
        'pom': 'T Stubbs',
        'innings': [
            {'team': 'Royal Challengers Bengaluru', 'runs': 175, 'wickets': 8, 'overs': 20.0, 'extras': 0},
            {'team': 'Delhi Capitals',              'runs': 179, 'wickets': 4, 'overs': 19.5, 'extras': 0},
        ],
    },
    27: {  # Apr 18, Hyderabad: SRH beat CSK by 10 runs
        'winner': 'Sunrisers Hyderabad',
        'winMargin': {'runs': 10},
        'pom': 'Eshan Malinga',
        'innings': [
            {'team': 'Sunrisers Hyderabad', 'runs': 194, 'wickets': 9, 'overs': 20.0, 'extras': 0},
            {'team': 'Chennai Super Kings', 'runs': 184, 'wickets': 8, 'overs': 20.0, 'extras': 0},
        ],
    },
    28: {  # Apr 19, Kolkata: KKR beat RR by 4 wickets
        'winner': 'Kolkata Knight Riders',
        'winMargin': {'wickets': 4},
        'pom': 'Rinku Singh',
        'innings': [
            {'team': 'Rajasthan Royals',      'runs': 155, 'wickets': 9, 'overs': 20.0, 'extras': 0},
            {'team': 'Kolkata Knight Riders', 'runs': 156, 'wickets': 6, 'overs': 19.4, 'extras': 0},
        ],
    },
    29: {  # Apr 19, New Chandigarh: PBKS beat LSG by 54 runs
        'winner': 'Punjab Kings',
        'winMargin': {'runs': 54},
        'pom': 'Priyansh Arya',
        'innings': [
            {'team': 'Punjab Kings',         'runs': 254, 'wickets': 7, 'overs': 20.0, 'extras': 0},
            {'team': 'Lucknow Super Giants', 'runs': 200, 'wickets': 5, 'overs': 20.0, 'extras': 0},
        ],
    },
    30: {  # Apr 20, Ahmedabad: MI beat GT by 99 runs
        'winner': 'Mumbai Indians',
        'winMargin': {'runs': 99},
        'pom': 'Tilak Varma',
        'innings': [
            {'team': 'Mumbai Indians', 'runs': 199, 'wickets': 5,  'overs': 20.0, 'extras': 0},
            {'team': 'Gujarat Titans', 'runs': 100, 'wickets': 10, 'overs': 17.4, 'extras': 0},
        ],
    },
}

def main():
    data = json.loads(PATH.read_text())
    updated = []
    for m in data:
        mn = m.get('matchNumber')
        u = UPDATES.get(mn)
        if not u:
            continue
        m['winner'] = u['winner']
        m['winMargin'] = u['winMargin']
        m['playerOfMatch'] = [u['pom']]
        m['innings'] = u['innings']
        if 'result' in m:
            del m['result']
        if 'abandoned' in m:
            del m['abandoned']
        if 'abandonReason' in m:
            del m['abandonReason']
        if 'abandonType' in m:
            del m['abandonType']
        updated.append(mn)
    PATH.write_text(json.dumps(data, indent=2))
    print(f'Updated {len(updated)} matches: {updated}')

if __name__ == '__main__':
    main()
