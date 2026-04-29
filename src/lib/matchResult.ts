/**
 * Canonical result-text formatter for IPL matches.
 *
 * Handles the nasty edge cases that were previously silently dropped or
 * rendered incorrectly:
 *   1. Super-over / tied matches where `winMargin` is null but there IS a
 *      winner — we must show "Super Over" not nothing.
 *   2. Tied matches where the source data has a stale `winMargin` (e.g.,
 *      CricSheet sometimes stores wickets or runs that describe the bowl-out
 *      rather than the match proper) — detect the tie via innings runs and
 *      override the misleading margin.
 *   3. Abandoned / no-result matches.
 *   4. Ordinary "won by X runs" / "won by Y wickets" matches.
 *
 * Returns a `{ text, kind }` object so the caller can style based on
 * intent ('win' | 'tie' | 'abandoned' | 'noResult' | 'unknown').
 */

/**
 * Result classification, used for both display and filtering:
 * - `'win'`     — normal completed match with a winner.
 * - `'tie'`     — runs level, decided by Super Over (winner is the SO winner).
 * - `'abandoned'` — match could not start at all (washed out before toss).
 * - `'noResult'`  — match started but didn't conclude (rain mid-innings, etc).
 * - `'fixture'`   — scheduled but not yet played. **Distinct** from noResult.
 * - `'unknown'`   — older data without enough info to classify.
 *
 * `'fixture'` is critical for keeping future matches out of the played set:
 * a no-result match counts as played (1 pt each); a future fixture does not.
 */
export type MatchResultKind = 'win' | 'tie' | 'abandoned' | 'noResult' | 'fixture' | 'unknown'

export interface MatchResultDisplay {
  text: string
  kind: MatchResultKind
}

interface MatchLike {
  winner?: string | null
  winMargin?: { runs?: number; wickets?: number } | null
  abandoned?: boolean
  note?: string | null
  result?: string | null
  innings?: Array<{ team?: string; runs?: number; wickets?: number; overs?: number }>
}

/**
 * Decide whether a completed match was tied in the regular innings (i.e.
 * both first and second innings ended with the same run total). Only true
 * when both sides batted out a full-length innings and ended level — the
 * classic super-over trigger.
 */
export function isMatchTied(match: MatchLike): boolean {
  const inn1 = match.innings?.[0]
  const inn2 = match.innings?.[1]
  if (!inn1 || !inn2) return false
  if (typeof inn1.runs !== 'number' || typeof inn2.runs !== 'number') return false
  // Runs equal AND both innings actually played — this is a tie.
  return inn1.runs === inn2.runs
}

/** Short team display: respect the caller's short-name map. */
function shortName(team: string, shortMap?: Record<string, string>): string {
  if (!team) return ''
  return shortMap?.[team] ?? team
}

/**
 * Compute the display text for a match's result.
 * Pass your `TEAM_SHORT` map for short-name rendering.
 */
export function formatMatchResult(
  match: MatchLike,
  shortMap?: Record<string, string>,
): MatchResultDisplay {
  // Explicit abandoned flag (hand-set when known) — match never started.
  if (match.abandoned) {
    return { text: 'Match Abandoned', kind: 'abandoned' }
  }

  const winner = match.winner
  if (!winner) {
    // CricSheet sets `result: 'no result'` for matches that *did* start but
    // couldn't finish. That's distinct from a future fixture, which has no
    // result tag at all. Treat the two differently — one is played (1 pt
    // each), the other is upcoming.
    if (match.result === 'no result') {
      return { text: 'No Result', kind: 'noResult' }
    }
    return { text: 'Scheduled', kind: 'fixture' }
  }

  const winnerShort = shortName(winner, shortMap)

  // Tied match → override any misleading winMargin with "Super Over".
  // The CricSheet source data for several historical ties (2009 RR vs KKR,
  // 2010 KXIP vs CSK, 2015 KXIP vs RR) carries nonsensical winMargin values
  // that describe bowl-outs / earlier ODI-era tiebreakers — we must not
  // propagate those verbatim.
  if (isMatchTied(match)) {
    return { text: `${winnerShort} won (Super Over)`, kind: 'tie' }
  }

  // Canonical cases — prefer runs when present, else wickets.
  // Use explicit numeric checks so 0-run wins (hypothetical) don't slip through.
  const margin = match.winMargin
  if (margin) {
    if (typeof margin.runs === 'number' && margin.runs > 0) {
      return { text: `${winnerShort} won by ${margin.runs} runs`, kind: 'win' }
    }
    if (typeof margin.wickets === 'number' && margin.wickets > 0) {
      return { text: `${winnerShort} won by ${margin.wickets} wkts`, kind: 'win' }
    }
  }

  // Winner exists but no usable margin — rare but happens for older data
  // where margin was simply not scraped. Fall back to a plain "won" line,
  // or surface the `note` / `result` field if it contains a readable hint.
  const note = match.note || match.result
  if (note && typeof note === 'string') {
    return { text: `${winnerShort} won — ${note}`, kind: 'win' }
  }
  return { text: `${winnerShort} won`, kind: 'win' }
}
