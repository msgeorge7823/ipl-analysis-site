// App-wide constants: team identity (colors, short codes, era-aware logos),
// franchise rebrand groupings, and the navbar route table. Pure data — no
// runtime logic beyond the small logo / franchise-group lookups.

// Per-team palette used by badges, charts, and team-tinted UI surfaces.
// Brightened from the official kit colors so they remain legible on the
// app's dark theme.
export const TEAM_COLORS: Record<string, { primary: string; secondary: string; bg: string }> = {
  'Chennai Super Kings': { primary: '#FFD130', secondary: '#3B9AE8', bg: 'rgba(255,209,48,0.1)' },
  'Mumbai Indians': { primary: '#2B7FD4', secondary: '#D4AF37', bg: 'rgba(43,127,212,0.1)' },
  'Royal Challengers Bengaluru': { primary: '#EF3340', secondary: '#D4AF37', bg: 'rgba(239,51,64,0.1)' },
  'Kolkata Knight Riders': { primary: '#7B5EA7', secondary: '#D4A84B', bg: 'rgba(123,94,167,0.1)' },
  'Delhi Capitals': { primary: '#4B8FE2', secondary: '#EF4444', bg: 'rgba(75,143,226,0.1)' },
  'Punjab Kings': { primary: '#ED1B24', secondary: '#C0C0C0', bg: 'rgba(237,27,36,0.1)' },
  'Rajasthan Royals': { primary: '#5B8FD4', secondary: '#CBA92B', bg: 'rgba(91,143,212,0.1)' },
  'Sunrisers Hyderabad': { primary: '#FF822A', secondary: '#E54B17', bg: 'rgba(255,130,42,0.1)' },
  'Gujarat Titans': { primary: '#7DD3E8', secondary: '#1C1C1C', bg: 'rgba(125,211,232,0.1)' },
  'Lucknow Super Giants': { primary: '#D94070', secondary: '#FFD700', bg: 'rgba(217,64,112,0.1)' },
  'Deccan Chargers': { primary: '#5B8FBF', secondary: '#C0C0C0', bg: 'rgba(91,143,191,0.1)' },
  'Kochi Tuskers Kerala': { primary: '#9B59E8', secondary: '#FFD700', bg: 'rgba(155,89,232,0.1)' },
  'Pune Warriors': { primary: '#4BB8F0', secondary: '#D0D0D0', bg: 'rgba(75,184,240,0.1)' },
  'Gujarat Lions': { primary: '#F06830', secondary: '#1A1A2E', bg: 'rgba(240,104,48,0.1)' },
  'Rising Pune Supergiant': { primary: '#9B59E8', secondary: '#D1C4E9', bg: 'rgba(155,89,232,0.1)' },
  // ── Historical franchise names (same teams, pre-rebrand) ──
  // Punjab: "Kings XI Punjab" until 2020, "Punjab Kings" from 2021.
  // Delhi:  "Delhi Daredevils" until 2018, "Delhi Capitals" from 2019.
  // RCB:    "Royal Challengers Bangalore" until 2023, "...Bengaluru" from 2024.
  // Colors track the franchise (not the brand) so visual identity stays
  // consistent on the historical seasons page.
  'Kings XI Punjab': { primary: '#ED1B24', secondary: '#C0C0C0', bg: 'rgba(237,27,36,0.1)' },
  'Delhi Daredevils': { primary: '#4B8FE2', secondary: '#EF4444', bg: 'rgba(75,143,226,0.1)' },
  'Royal Challengers Bangalore': { primary: '#EF3340', secondary: '#D4AF37', bg: 'rgba(239,51,64,0.1)' },
}

// Canonical short code for each team (CSK, MI, RCB, ...). Includes
// pre-rebrand names so historical match displays still resolve.
export const TEAM_SHORT: Record<string, string> = {
  'Chennai Super Kings': 'CSK',
  'Mumbai Indians': 'MI',
  'Royal Challengers Bengaluru': 'RCB',
  'Kolkata Knight Riders': 'KKR',
  'Delhi Capitals': 'DC',
  'Punjab Kings': 'PBKS',
  'Rajasthan Royals': 'RR',
  'Sunrisers Hyderabad': 'SRH',
  'Gujarat Titans': 'GT',
  'Lucknow Super Giants': 'LSG',
  'Deccan Chargers': 'DCH',
  'Kochi Tuskers Kerala': 'KTK',
  'Pune Warriors': 'PW',
  'Gujarat Lions': 'GL',
  'Rising Pune Supergiant': 'RPS',
  // ── Historical franchise short codes (pre-rebrand) ──
  'Kings XI Punjab': 'KXIP',
  'Delhi Daredevils': 'DD',
  'Royal Challengers Bangalore': 'RCB',
}

/**
 * Team logo image paths — era-aware.
 *
 * Many IPL franchises have refreshed their logo multiple times. Where the
 * mark changed mid-franchise we keep an entry per era (sourced from
 * 1000logos.net) so the badge always shows the design that was in use the
 * year a given match was played. Where a franchise has used a single mark
 * throughout its life we use a single file.
 *
 * The lookup is `getTeamLogo(team, season?)`:
 *   • If `season` is provided AND the team has multiple era logos, the
 *     correct era is selected from the `eras` array.
 *   • Otherwise the team's "default" (latest) logo is returned.
 *
 * Era cutovers:
 *   • Mumbai Indians: 2008-2009 ▸ 2010-2014 ▸ 2015-present
 *   • Kolkata Knight Riders: 2008-2011 ▸ 2012-present
 *   • Delhi Daredevils: 2008-2011 ▸ 2012-2013 ▸ 2014-2018
 *   • Delhi Capitals: 2019-present (single)
 *   • Kings XI Punjab: 2008-2011 ▸ 2012-2020
 *   • Punjab Kings: 2021-present (single)
 *   • Rajasthan Royals: 2008 ▸ 2009-2018 ▸ 2019-present
 *   • Royal Challengers Bangalore: 2008-2015 ▸ 2016-2019 ▸ 2020-2023
 *   • Royal Challengers Bengaluru: 2024-present (single)
 *
 * Stable-logo teams (single file): Chennai Super Kings, Sunrisers
 * Hyderabad (2013+), Gujarat Titans, Lucknow Super Giants, and all
 * defunct franchises.
 */

interface TeamLogoEntry {
  /** Path used when no season is supplied (caller-friendly default). */
  default: string
  /** Optional ordered list of era windows. First match wins. */
  eras?: Array<{ from: number; to: number; path: string }>
}

const TEAM_LOGO_TABLE: Record<string, TeamLogoEntry> = {
  // ── Single-logo franchises ──
  'Chennai Super Kings': { default: '/teams/csk.png' },
  'Sunrisers Hyderabad': { default: '/teams/srh.png' },
  'Gujarat Titans': { default: '/teams/gt.png' },
  'Lucknow Super Giants': { default: '/teams/lsg.png' },
  'Deccan Chargers': { default: '/teams/dch.png' },
  'Kochi Tuskers Kerala': { default: '/teams/ktk.svg' },
  'Pune Warriors': { default: '/teams/pw.png' },
  'Gujarat Lions': { default: '/teams/gl.png' },
  'Rising Pune Supergiant': { default: '/teams/rps.png' },

  // ── Multi-era franchises ──
  'Mumbai Indians': {
    default: '/teams/mi-2015.png',
    eras: [
      { from: 2008, to: 2009, path: '/teams/mi-2008.png' },
      { from: 2010, to: 2014, path: '/teams/mi-2010.png' },
      { from: 2015, to: 9999, path: '/teams/mi-2015.png' },
    ],
  },
  'Kolkata Knight Riders': {
    default: '/teams/kkr-2012.png',
    eras: [
      { from: 2008, to: 2011, path: '/teams/kkr-2008.png' },
      { from: 2012, to: 9999, path: '/teams/kkr-2012.png' },
    ],
  },
  'Rajasthan Royals': {
    default: '/teams/rr-2019.png',
    eras: [
      { from: 2008, to: 2008, path: '/teams/rr-2008.png' },
      { from: 2009, to: 2018, path: '/teams/rr-2009.png' },
      { from: 2019, to: 9999, path: '/teams/rr-2019.png' },
    ],
  },

  // ── Punjab franchise (Kings XI Punjab → Punjab Kings) ──
  'Kings XI Punjab': {
    default: '/teams/kxip-2012.png',
    eras: [
      { from: 2008, to: 2011, path: '/teams/kxip-2008.png' },
      { from: 2012, to: 2020, path: '/teams/kxip-2012.png' },
    ],
  },
  'Punjab Kings': { default: '/teams/pbks-2021.png' },

  // ── Delhi franchise (Delhi Daredevils → Delhi Capitals) ──
  'Delhi Daredevils': {
    default: '/teams/dd-2014.png',
    eras: [
      { from: 2008, to: 2011, path: '/teams/dd-2008.png' },
      { from: 2012, to: 2013, path: '/teams/dd-2012.png' },
      { from: 2014, to: 2018, path: '/teams/dd-2014.png' },
    ],
  },
  'Delhi Capitals': { default: '/teams/dc.png' },

  // ── Bengaluru franchise (RCB Bangalore → RCB Bengaluru) ──
  'Royal Challengers Bangalore': {
    default: '/teams/rcb-2020.png',
    eras: [
      { from: 2008, to: 2015, path: '/teams/rcb-2008.png' },
      { from: 2016, to: 2019, path: '/teams/rcb-2016.png' },
      { from: 2020, to: 2023, path: '/teams/rcb-2020.png' },
    ],
  },
  'Royal Challengers Bengaluru': { default: '/teams/rcb-bengaluru.png' },
}

/**
 * Resolve a team's logo path for a given season.
 *
 * @param team   Exact franchise name as it appears in the data
 *               (e.g. "Kings XI Punjab", not "Punjab Kings", for old data)
 * @param season Optional season year ("2015", "2024", etc). When supplied,
 *               and the team has multi-era logos, the correct era is used.
 *               When omitted, the team's canonical/latest logo is returned.
 * @returns The /teams/... path, or undefined if the team isn't recognised.
 */
export function getTeamLogo(team: string, season?: string): string | undefined {
  const entry = TEAM_LOGO_TABLE[team]
  if (!entry) return undefined
  if (entry.eras && season) {
    const yr = parseInt(season, 10)
    if (!isNaN(yr)) {
      const match = entry.eras.find((e) => yr >= e.from && yr <= e.to)
      if (match) return match.path
    }
  }
  return entry.default
}

/** Backwards-compat shim — flat name→path map for callers that don't have
 *  season context. Always returns the team's canonical/latest logo. */
export const TEAM_LOGOS: Record<string, string> = Object.fromEntries(
  Object.entries(TEAM_LOGO_TABLE).map(([k, v]) => [k, v.default])
)

/**
 * Franchise grouping — multiple historical names that refer to the same
 * underlying ownership/franchise. Used by `getFranchiseLogoEvolution` to
 * stitch a single team's full visual history together (e.g. the Delhi
 * page shows Daredevils logos AND the current Capitals mark).
 *
 * Earliest name first.
 */
const FRANCHISE_GROUPS: string[][] = [
  ['Kings XI Punjab', 'Punjab Kings'],
  ['Delhi Daredevils', 'Delhi Capitals'],
  ['Royal Challengers Bangalore', 'Royal Challengers Bengaluru'],
]

/** Look up the franchise group that contains `team`, or just `[team]`
 *  when the team has never been renamed. */
export function getFranchiseGroup(team: string): string[] {
  const found = FRANCHISE_GROUPS.find((g) => g.includes(team))
  return found ?? [team]
}

export interface LogoEvolutionEntry {
  /** Human-readable franchise name in use during this era. */
  name: string
  /** First season this logo was used (e.g. 2008). */
  from: number
  /** Last season this logo was used (e.g. 2011). May be 9999 for current. */
  to: number
  /** /teams/... image path. */
  path: string
}

/**
 * Return the full chronological logo evolution for a team — including
 * pre-rebrand variants. For example, calling with "Punjab Kings" or
 * "Kings XI Punjab" both return the same list:
 *   [KXIP 2008-11, KXIP 2012-20, Punjab Kings 2021+]
 *
 * For single-logo / single-name franchises this returns a one-element array.
 *
 * Implementation note: we walk the franchise group in declaration order
 * (which is chronological — old name first, modern name last) and tally
 * `lastTo` so a single-logo franchise inherits a proper "from" year from
 * the era that immediately precedes it. No re-sort, so the result always
 * comes out oldest → newest.
 */
export function getFranchiseLogoEvolution(team: string): LogoEvolutionEntry[] {
  const group = getFranchiseGroup(team)
  const out: LogoEvolutionEntry[] = []
  // 2007 = "season before IPL existed" — gives the first single-logo
  // entry a from year of 2008 if it's the first thing in the group.
  let lastTo = 2007
  for (const name of group) {
    const entry = TEAM_LOGO_TABLE[name]
    if (!entry) continue
    if (entry.eras && entry.eras.length > 0) {
      const sortedEras = [...entry.eras].sort((a, b) => a.from - b.from)
      for (const era of sortedEras) {
        out.push({ name, from: era.from, to: era.to, path: era.path })
        if (era.to > lastTo) lastTo = era.to
      }
    } else {
      // Single-logo franchise — its era starts the season after the
      // previous group entry ended (or 2008 if it's the first/only).
      out.push({ name, from: lastTo + 1, to: 9999, path: entry.default })
      lastTo = 9999
    }
  }
  return out
}

// Top-level nav: items shown inline in the navbar.
export const NAV_ITEMS_PRIMARY = [
  { label: 'Home', path: '/', live: false },
  { label: 'Live', path: '/live', live: true },
  { label: 'Seasons', path: '/seasons', live: false },
  { label: 'Teams', path: '/teams', live: false },
  { label: 'Players', path: '/players', live: false },
  { label: 'Matches', path: '/matches', live: false },
  { label: 'Analytics Lab', path: '/analytics', live: false },
  { label: 'Auctions', path: '/auctions', live: false },
] as const

// Overflow nav: items collapsed under the navbar's "More" menu.
export const NAV_ITEMS_MORE = [
  { label: 'News', path: '/news', live: false },
  { label: 'Schedule', path: '/schedule', live: false },
  { label: 'Ratings', path: '/ratings', live: false },
  { label: 'Records', path: '/records', live: false },
  { label: 'Venues', path: '/venues', live: false },
  { label: 'Coaches', path: '/coaches', live: false },
  { label: 'Education', path: '/education', live: false },
  { label: 'Sponsors', path: '/sponsors', live: false },
] as const

// Combined list — used by the mobile menu, which doesn't have an
// overflow "More" dropdown and shows everything in one drawer.
export const NAV_ITEMS = [...NAV_ITEMS_PRIMARY, ...NAV_ITEMS_MORE] as const
