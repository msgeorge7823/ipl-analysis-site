/**
 * Shared match-time helpers
 * --------------------------
 * The IPL has two standard kickoff slots since the modern era:
 *   • Single match per day → 19:30 IST (evening)
 *   • Double-header day    → 15:30 IST (afternoon, lower matchNumber)
 *                           + 19:30 IST (evening, higher matchNumber)
 *
 * The Matches page uses this to render match times and the weather
 * service uses it to pick which hour to query. Keeping the inference in
 * one place avoids drift between the two callers.
 */

export interface MatchLike {
  id: string
  date: string
  matchNumber?: number
}

/**
 * Returns the IST kickoff hour (15 or 19) for a match. The list passed in
 * should be the *full* season's matches (or at least every match on the
 * same date as `match`) — we look at how many matches share `match.date`
 * to detect double-headers.
 */
export function inferIstKickoffHour(
  match: MatchLike,
  allSeasonMatches: MatchLike[]
): 15 | 19 {
  const sameDate = allSeasonMatches.filter((m) => m.date === match.date)
  if (sameDate.length <= 1) return 19
  const sorted = [...sameDate].sort(
    (a, b) => (a.matchNumber ?? 0) - (b.matchNumber ?? 0)
  )
  const idx = sorted.findIndex((m) => m.id === match.id)
  return idx === 0 ? 15 : 19
}

/** A friendly label for the kickoff hour ("Day Match" vs "Evening Match"). */
export function kickoffSlotLabel(hour: number): 'Day Match' | 'Evening Match' {
  return hour < 18 ? 'Day Match' : 'Evening Match'
}
