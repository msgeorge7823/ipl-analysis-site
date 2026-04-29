/**
 * Home/away decision for IPL match display order.
 *
 * IPL fixture convention: the HOME team is listed first ("MI vs RCB" when
 * the match is at Wankhede in Mumbai). Only applies to regular-season
 * league matches played in India at the home team's actual home venue.
 *
 * Deliberately excluded (caller falls back to innings-order display):
 *   1. Playoffs — Qualifier 1 / Qualifier 2 / Eliminator / Final are at
 *      neutral venues by design.
 *   2. Overseas seasons / legs — 2009 SA, 2014 UAE leg, 2020 UAE, part of
 *      2021 in UAE.
 *   3. Neutral-venue league matches — CSK's 2015 season (ban year they
 *      played at neutral sites), RR's 2015 ban year, COVID-era bubbles,
 *      franchise-requested relocations.
 *
 * If home/away can be unambiguously determined we return both; otherwise
 * we return `null` and the caller falls back to batting-order display
 * (innings[0].team first).
 */

type MatchLike = {
  teams?: string[]
  city?: string | null
  venue?: string | null
  playoffStage?: string | null
}

/**
 * Map of each IPL franchise (across all name variants) to the set of
 * cities they have ever treated as an official home ground. We use cities
 * (not venue names) because the source data's `city` field is more
 * normalised than `venue` across seasons.
 */
const HOME_CITIES: Record<string, readonly string[]> = {
  'Chennai Super Kings': ['Chennai'],
  'Mumbai Indians': ['Mumbai'],
  'Royal Challengers Bangalore': ['Bengaluru', 'Bangalore'],
  'Royal Challengers Bengaluru': ['Bengaluru', 'Bangalore'],
  'Kolkata Knight Riders': ['Kolkata'],
  'Delhi Daredevils': ['Delhi'],
  'Delhi Capitals': ['Delhi'],
  // Punjab franchise: Mohali (original PCA Stadium 2008-2023) → Mullanpur
  // (new PCA Stadium from 2024). Dharamsala has long been the secondary
  // "home away from home" venue for PBKS in higher-altitude months.
  'Kings XI Punjab': ['Mohali', 'Chandigarh', 'Dharamsala'],
  'Punjab Kings': ['Mohali', 'Chandigarh', 'Dharamsala', 'Mullanpur'],
  'Sunrisers Hyderabad': ['Hyderabad'],
  'Gujarat Titans': ['Ahmedabad'],
  'Lucknow Super Giants': ['Lucknow'],
  // Rajasthan Royals — Jaipur primary, Guwahati secondary from 2024.
  'Rajasthan Royals': ['Jaipur', 'Guwahati'],
  // Defunct franchises (Phase-4 teams). Included so historical matches
  // also get home/away order when rendered.
  'Deccan Chargers': ['Hyderabad', 'Visakhapatnam'],
  'Kochi Tuskers Kerala': ['Kochi'],
  'Pune Warriors India': ['Pune'],
  'Pune Warriors': ['Pune'],
  'Rising Pune Supergiant': ['Pune'],
  'Rising Pune Supergiants': ['Pune'],
  'Gujarat Lions': ['Rajkot', 'Kanpur'],
}

/**
 * Known overseas IPL host cities. When the match city is in this set we
 * treat the match as played outside India and fall back to innings-order.
 * Kept explicit rather than "anything-not-in-india" so accidental spelling
 * variants of Indian cities don't get silently misclassified.
 */
const OVERSEAS_CITIES: ReadonlySet<string> = new Set([
  // 2009 season (whole tournament in South Africa)
  'Johannesburg', 'Cape Town', 'Durban', 'Port Elizabeth', 'Centurion',
  'East London', 'Kimberley', 'Bloemfontein', 'Pretoria',
  // 2014 (first leg) + 2020 (full) + 2021 (second leg) — UAE
  'Dubai', 'Abu Dhabi', 'Sharjah',
])

export interface HomeAwayResolution {
  home: string
  away: string
}

/**
 * Decide which team is home and which is away for a given match.
 * Returns `null` for playoffs, overseas matches, and ambiguous/neutral
 * venues — callers should fall back to innings-order display in those
 * cases so the existing first-innings-first behaviour stays correct.
 */
export function resolveHomeAway(match: MatchLike): HomeAwayResolution | null {
  // 1. Playoffs are neutral-venue by design — do not apply home/away.
  if (match.playoffStage) return null

  const city = (match.city || '').trim()
  if (!city) return null

  // 2. Overseas seasons / legs — fall back.
  if (OVERSEAS_CITIES.has(city)) return null

  const teams = match.teams || []
  if (teams.length < 2) return null
  const [t1, t2] = [teams[0], teams[1]]

  const t1Home = (HOME_CITIES[t1] || []).includes(city)
  const t2Home = (HOME_CITIES[t2] || []).includes(city)

  // 3. Exactly one team's home city → clear home.
  if (t1Home && !t2Home) return { home: t1, away: t2 }
  if (t2Home && !t1Home) return { home: t2, away: t1 }

  // 4. Neither team is at home (neutral venue, e.g., CSK suspension era,
  // COVID bubble relocation, franchise-requested move) — fall back to
  // innings-order so the caller's existing behaviour kicks in.
  if (!t1Home && !t2Home) return null

  // 5. Both teams claim the venue (extremely rare — only happens if the
  // HOME_CITIES map has overlap, which we try to avoid). Fall back.
  return null
}
