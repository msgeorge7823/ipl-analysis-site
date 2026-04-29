/**
 * Points Table Service
 * --------------------
 *
 * Computes IPL points-table standings from per-season match data.
 *
 * Standings rules (modern IPL, 2008-present):
 *   - Win:        2 points
 *   - Tie:        1 point  (resolved by Super Over normally, but old data may
 *                          still record a tie if no Super Over was played)
 *   - No Result:  1 point
 *   - Loss:       0 points
 *
 * Tie-breaker:    Net Run Rate (NRR), descending.
 *                 NRR = (total runs scored / total overs faced)
 *                     - (total runs conceded / total overs bowled)
 *
 * Important: only LEAGUE-STAGE matches are counted. Playoff matches
 * (Qualifier 1, Eliminator, Qualifier 2, Final, Semi Final, 3rd Place
 * Play-Off) are excluded from the standings — they don't affect points.
 *
 * Abandoned matches: count as a No Result for both teams. Excluded from NRR.
 */

import type { Match } from '@/types'

export interface PointsTableRow {
  team: string
  played: number
  won: number
  lost: number
  tied: number
  noResult: number
  points: number
  nrr: number
  // Raw aggregates kept so the UI can show "for/against" if it wants
  runsFor: number
  oversFor: number
  runsAgainst: number
  oversAgainst: number
}

const PLAYOFF_STAGES = new Set([
  'Qualifier 1',
  'Eliminator',
  'Qualifier 2',
  'Final',
  'Semi Final',
  '3rd Place Play-Off',
])

/**
 * Convert a cricket-style overs value (e.g. 18.4 = 18 overs + 4 balls)
 * into a fractional overs value (18 + 4/6 = 18.6667).
 * Cricket overs are NOT decimal — 0.6 means 6 balls, not 0.6 of an over.
 */
function oversToFractional(overs: number): number {
  if (overs == null || isNaN(overs)) return 0
  const whole = Math.floor(overs)
  const balls = Math.round((overs - whole) * 10) // 0.4 -> 4 balls
  return whole + balls / 6
}

function emptyRow(team: string): PointsTableRow {
  return {
    team,
    played: 0,
    won: 0,
    lost: 0,
    tied: 0,
    noResult: 0,
    points: 0,
    nrr: 0,
    runsFor: 0,
    oversFor: 0,
    runsAgainst: 0,
    oversAgainst: 0,
  }
}

/**
 * Compute the league-stage points table for a season's match list.
 * Returns rows sorted by points desc, NRR desc.
 */
export function computePointsTable(matches: Match[]): PointsTableRow[] {
  const rows = new Map<string, PointsTableRow>()

  const ensureRow = (team: string): PointsTableRow => {
    let r = rows.get(team)
    if (!r) {
      r = emptyRow(team)
      rows.set(team, r)
    }
    return r
  }

  for (const m of matches) {
    // Skip playoff matches — only league-stage counts
    if (m.playoffStage && PLAYOFF_STAGES.has(m.playoffStage)) continue

    // Skip unplayed fixtures entirely. A "fixture" in our data is a
    // scheduled match with no winner, no `abandoned` flag, and no `result`
    // tag from CricSheet — i.e. it hasn't started yet. Those don't belong
    // in the standings at all. The points table reflects what's been
    // PLAYED, not what's scheduled.
    //
    // CricSheet sets `result: 'no result'` for matches that started but
    // were abandoned (rain, etc.) — those count as played, both teams +1.
    const isNoResult = m.result === 'no result' || m.abandoned === true
    const isPlayed = !!m.winner || isNoResult
    if (!isPlayed) continue

    const teams = m.teams || []
    if (teams.length !== 2) continue
    const [t1, t2] = teams
    const r1 = ensureRow(t1)
    const r2 = ensureRow(t2)

    r1.played += 1
    r2.played += 1

    // No result (washed out, called off, or only one innings completed) →
    // both teams get 1 pt and the match is excluded from NRR.
    if (isNoResult) {
      r1.noResult += 1
      r2.noResult += 1
      r1.points += 1
      r2.points += 1
      continue
    }

    // Determine winner / loser
    if (m.winner === t1) {
      r1.won += 1
      r2.lost += 1
      r1.points += 2
    } else if (m.winner === t2) {
      r2.won += 1
      r1.lost += 1
      r2.points += 2
    } else {
      // Tie with no winner recorded
      r1.tied += 1
      r2.tied += 1
      r1.points += 1
      r2.points += 1
    }

    // NRR aggregates from innings
    const innings = m.innings || []
    // Each innings has { team, runs, overs }. The team that batted scored runs;
    // the OTHER team conceded those runs over the same number of overs.
    for (const inn of innings) {
      const battingTeam = inn.team
      const bowlingTeam = battingTeam === t1 ? t2 : t1
      const battingRow = ensureRow(battingTeam)
      const bowlingRow = ensureRow(bowlingTeam)
      const ovs = oversToFractional(inn.overs ?? 0)
      // If a team is bowled out, NRR uses the FULL allotted overs (20),
      // not the actual overs faced. This is the official ICC rule.
      const allOut = inn.wickets === 10
      const nrrOvers = allOut ? 20 : ovs
      battingRow.runsFor += inn.runs ?? 0
      battingRow.oversFor += nrrOvers
      bowlingRow.runsAgainst += inn.runs ?? 0
      bowlingRow.oversAgainst += nrrOvers
    }
  }

  // Compute NRR for each row
  for (const r of rows.values()) {
    const rrFor = r.oversFor > 0 ? r.runsFor / r.oversFor : 0
    const rrAgainst = r.oversAgainst > 0 ? r.runsAgainst / r.oversAgainst : 0
    r.nrr = +(rrFor - rrAgainst).toFixed(3)
  }

  // Sort: points desc, then NRR desc, then team name for stable ordering
  return Array.from(rows.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    if (b.nrr !== a.nrr) return b.nrr - a.nrr
    return a.team.localeCompare(b.team)
  })
}

/** Which playoff format a given season uses.
 *
 * - 'modern' (2011+): Qualifier 1 + Eliminator + Qualifier 2 + Final.
 *   Top-2 play Q1 (winner straight to Final, loser drops to Q2). 3rd and 4th
 *   play the Eliminator (loser out, winner advances to Q2). Q1 loser meets
 *   Eliminator winner in Q2 (winner goes to Final).
 *
 * - 'classic' (2008-2010): Two Semi Finals and a Final. 2010 also had a
 *   3rd Place Play-Off between the losing semifinalists.
 */
export type PlayoffFormat = 'classic' | 'modern'

export function getPlayoffFormat(year: string): PlayoffFormat {
  const n = parseInt(year, 10)
  return !isNaN(n) && n >= 2011 ? 'modern' : 'classic'
}

const MODERN_ORDER = ['Qualifier 1', 'Eliminator', 'Qualifier 2', 'Final']
const CLASSIC_ORDER = ['Semi Final', '3rd Place Play-Off', 'Final']
const ALL_PLAYOFF_STAGES_ORDERED = [...MODERN_ORDER, ...CLASSIC_ORDER]

/** All playoff matches for a season, sorted in their natural display order.
 *  Date is used as a secondary sort to keep two semifinals in the right order.
 */
export function getPlayoffMatches(matches: Match[]): Match[] {
  const stageRank = (s?: string) =>
    s ? ALL_PLAYOFF_STAGES_ORDERED.indexOf(s) : -1
  return matches
    .filter(m => m.playoffStage && PLAYOFF_STAGES.has(m.playoffStage))
    .sort((a, b) => {
      const ra = stageRank(a.playoffStage)
      const rb = stageRank(b.playoffStage)
      if (ra !== rb) return ra - rb
      return (a.date || '').localeCompare(b.date || '')
    })
}
