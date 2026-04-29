/**
 * Player Stats Service
 *
 * Provides deep per-player analytics computed from ball-by-ball,
 * scorecard, partnership, and match JSON files.
 *
 * All functions accept player names (not IDs) because the compressed
 * ball-by-ball data uses display names as keys.
 */

import { dataService } from '@/services/dataService'
import type {
  BattingEntry,
  BowlingEntry,
  Partnership,
  Match,
} from '@/types'

// ── Compressed BBB shape (as stored in JSON files) ──

interface RawBBB {
  m: string        // matchId
  i: number        // innings (1 | 2)
  o: number        // over (0-indexed)
  b: number        // ball within over
  bat: string      // batter name
  bwl: string      // bowler name
  br: number       // batter runs
  er: number       // extra runs
  tr: number       // total runs
  ex?: {           // extras breakdown
    wides?: number
    noballs?: number
    byes?: number
    legbyes?: number
    penalty?: number
  }
  w?: {            // wickets array
    k: string      // kind (caught, bowled, lbw, ...)
    p: string      // playerOut
    f?: string[]   // fielders
  }[]
}

// ── Phase boundaries ──

type Phase = 'powerplay' | 'middle' | 'death'

function getPhase(over: number): Phase {
  if (over <= 5) return 'powerplay'
  if (over <= 15) return 'middle'
  return 'death'
}

// ── Result types ──

export interface PhaseStats {
  phase: Phase
  runs: number
  balls: number
  fours: number
  sixes: number
  strikeRate: number
  dots: number
}

export interface PhaseBowlingStats {
  phase: Phase
  balls: number
  runs: number
  wickets: number
  economy: number
  dots: number
  fours: number
  sixes: number
}

export interface H2HBattingStats {
  batter: string
  bowler: string
  runs: number
  balls: number
  dismissals: number
  fours: number
  sixes: number
  dots: number
  strikeRate: number
}

export interface VsTeamStats {
  team: string
  batting: {
    innings: number
    runs: number
    balls: number
    fours: number
    sixes: number
    strikeRate: number
    dismissals: number
    highScore: number
  }
  bowling: {
    innings: number
    balls: number
    runs: number
    wickets: number
    economy: number
  }
}

export interface VsVenueStats {
  venue: string
  batting: {
    innings: number
    runs: number
    balls: number
    fours: number
    sixes: number
    strikeRate: number
    highScore: number
  }
  bowling: {
    innings: number
    balls: number
    runs: number
    wickets: number
    economy: number
  }
}

export interface DismissalBreakdown {
  kind: string
  count: number
  percentage: number
}

export interface PositionStats {
  group: string
  positions: number[]
  innings: number
  runs: number
  balls: number
  fours: number
  sixes: number
  strikeRate: number
  average: number
  dismissals: number
}

export interface PartnershipEntry {
  matchId: string
  innings: number
  wicket: number
  partner: string
  runs: number
  balls: number
  season: string
}

export interface SeasonBreakdown {
  season: string
  batting: {
    innings: number
    runs: number
    balls: number
    fours: number
    sixes: number
    strikeRate: number
    highScore: number
    fifties: number
    hundreds: number
    average: number
    notOuts: number
  }
  bowling: {
    innings: number
    overs: number
    runs: number
    wickets: number
    economy: number
    bestFigures: string
  }
}

export interface MatchBattingScore {
  matchId: string
  season: string
  date: string
  venue: string
  opponent: string
  innings: number
  runs: number
  balls: number
  fours: number
  sixes: number
  strikeRate: number
  dismissal?: string
  position: number
}

export interface MatchBowlingScore {
  matchId: string
  season: string
  date: string
  venue: string
  opponent: string
  innings: number
  overs: number
  maidens: number
  runs: number
  wickets: number
  economy: number
  dots: number
}

// ── In-memory cache ──

const cache = new Map<string, unknown>()

function cacheKey(...parts: (string | string[])[]): string {
  return JSON.stringify(parts)
}

function getCached<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined
}

function setCache<T>(key: string, value: T): T {
  cache.set(key, value)
  return value
}

// ── Data loading helpers ──

async function loadBBBForSeasons(seasons: string[]): Promise<{ season: string; data: RawBBB[] }[]> {
  return Promise.all(
    seasons.map(async (season) => ({
      season,
      data: await dataService.getBBB(season) as unknown as RawBBB[],
    }))
  )
}

async function loadMatchesForSeasons(seasons: string[]): Promise<Map<string, Match & { season: string }>> {
  const map = new Map<string, Match & { season: string }>()
  await Promise.all(
    seasons.map(async (season) => {
      const matches = await dataService.getMatches(season) as Match[]
      for (const m of matches) {
        map.set(m.id, { ...m, season })
      }
    })
  )
  return map
}

async function loadBattingForSeasons(seasons: string[]): Promise<{ season: string; data: BattingEntry[] }[]> {
  return Promise.all(
    seasons.map(async (season) => ({
      season,
      data: await dataService.getBatting(season) as BattingEntry[],
    }))
  )
}

async function loadBowlingForSeasons(seasons: string[]): Promise<{ season: string; data: BowlingEntry[] }[]> {
  return Promise.all(
    seasons.map(async (season) => ({
      season,
      data: await dataService.getBowling(season) as BowlingEntry[],
    }))
  )
}

async function loadPartnershipsForSeasons(seasons: string[]): Promise<{ season: string; data: Partnership[] }[]> {
  return Promise.all(
    seasons.map(async (season) => ({
      season,
      data: await dataService.getPartnerships(season) as Partnership[],
    }))
  )
}

// ── Helper: is this a legal delivery for ball counting? ──

function isLegalDelivery(ball: RawBBB): boolean {
  // Wides and no-balls are not counted as balls faced by the batter
  if (ball.ex?.wides) return false
  return true
}

function isLegalBowlingDelivery(ball: RawBBB): boolean {
  // Wides and no-balls don't count toward the 6-ball over count
  if (ball.ex?.wides || ball.ex?.noballs) return false
  return true
}

/**
 * Convert a total-balls count to the cricket overs convention:
 * "completed overs . remaining balls" where remaining ∈ 0..5.
 * e.g., 0 → 0, 6 → 1, 25 → 4.1, 54 → 9.
 *
 * Returned as a number so JSON/UI callers can render it directly; numeric
 * sort still orders correctly because the remaining-balls digit is 0..5.
 */
function ballsToOvers(balls: number): number {
  const full = Math.floor(balls / 6)
  const rem = balls % 6
  return rem === 0 ? full : full + rem / 10
}

/** Convert BowlingEntry.overs (cricket format) back to total balls. */
function oversToBalls(overs: number): number {
  const full = Math.floor(overs)
  const part = Math.round((overs - full) * 10)
  return full * 6 + part
}

// ── 1. Phase-wise Batting Stats ──

export async function getPhaseWiseBatting(
  playerName: string,
  seasons: string[]
): Promise<PhaseStats[]> {
  const key = cacheKey('phase-batting', playerName, seasons)
  const cached = getCached<PhaseStats[]>(key)
  if (cached) return cached

  const allBBB = await loadBBBForSeasons(seasons)

  const phases: Record<Phase, { runs: number; balls: number; fours: number; sixes: number; dots: number }> = {
    powerplay: { runs: 0, balls: 0, fours: 0, sixes: 0, dots: 0 },
    middle:    { runs: 0, balls: 0, fours: 0, sixes: 0, dots: 0 },
    death:     { runs: 0, balls: 0, fours: 0, sixes: 0, dots: 0 },
  }

  for (const { data } of allBBB) {
    for (const ball of data) {
      if (ball.bat !== playerName) continue
      const phase = getPhase(ball.o)
      phases[phase].runs += ball.br
      if (isLegalDelivery(ball)) {
        phases[phase].balls += 1
        if (ball.br === 0) phases[phase].dots += 1
      }
      if (ball.br === 4) phases[phase].fours += 1
      if (ball.br === 6) phases[phase].sixes += 1
    }
  }

  const result: PhaseStats[] = (['powerplay', 'middle', 'death'] as Phase[]).map((phase) => ({
    phase,
    ...phases[phase],
    strikeRate: phases[phase].balls > 0
      ? Math.round((phases[phase].runs / phases[phase].balls) * 10000) / 100
      : 0,
  }))

  return setCache(key, result)
}

// ── 2. Phase-wise Bowling Stats ──

export async function getPhaseWiseBowling(
  playerName: string,
  seasons: string[]
): Promise<PhaseBowlingStats[]> {
  const key = cacheKey('phase-bowling', playerName, seasons)
  const cached = getCached<PhaseBowlingStats[]>(key)
  if (cached) return cached

  const allBBB = await loadBBBForSeasons(seasons)

  const phases: Record<Phase, { balls: number; runs: number; wickets: number; dots: number; fours: number; sixes: number }> = {
    powerplay: { balls: 0, runs: 0, wickets: 0, dots: 0, fours: 0, sixes: 0 },
    middle:    { balls: 0, runs: 0, wickets: 0, dots: 0, fours: 0, sixes: 0 },
    death:     { balls: 0, runs: 0, wickets: 0, dots: 0, fours: 0, sixes: 0 },
  }

  for (const { data } of allBBB) {
    for (const ball of data) {
      if (ball.bwl !== playerName) continue
      const phase = getPhase(ball.o)
      // Total runs conceded = total runs minus byes and legbyes (those don't count against bowler)
      const byeRuns = (ball.ex?.byes ?? 0) + (ball.ex?.legbyes ?? 0)
      phases[phase].runs += ball.tr - byeRuns
      if (isLegalBowlingDelivery(ball)) {
        phases[phase].balls += 1
        if (ball.tr === 0) phases[phase].dots += 1
      }
      if (ball.br === 4) phases[phase].fours += 1
      if (ball.br === 6) phases[phase].sixes += 1
      if (ball.w) {
        for (const w of ball.w) {
          // Run outs are not credited to the bowler
          if (w.k !== 'run out') phases[phase].wickets += 1
        }
      }
    }
  }

  const result: PhaseBowlingStats[] = (['powerplay', 'middle', 'death'] as Phase[]).map((phase) => {
    const overs = phases[phase].balls / 6
    return {
      phase,
      ...phases[phase],
      economy: overs > 0
        ? Math.round((phases[phase].runs / overs) * 100) / 100
        : 0,
    }
  })

  return setCache(key, result)
}

// ── 3. H2H: Batter vs Bowler ──

export async function getH2HBatterVsBowler(
  batterName: string,
  bowlerName: string,
  seasons: string[]
): Promise<H2HBattingStats> {
  const key = cacheKey('h2h-bat-bowl', batterName, bowlerName, seasons)
  const cached = getCached<H2HBattingStats>(key)
  if (cached) return cached

  const allBBB = await loadBBBForSeasons(seasons)

  let runs = 0, balls = 0, dismissals = 0, fours = 0, sixes = 0, dots = 0

  for (const { data } of allBBB) {
    for (const ball of data) {
      if (ball.bat !== batterName || ball.bwl !== bowlerName) continue
      runs += ball.br
      if (isLegalDelivery(ball)) {
        balls += 1
        if (ball.br === 0) dots += 1
      }
      if (ball.br === 4) fours += 1
      if (ball.br === 6) sixes += 1
      if (ball.w) {
        for (const w of ball.w) {
          if (w.p === batterName) dismissals += 1
        }
      }
    }
  }

  const result: H2HBattingStats = {
    batter: batterName,
    bowler: bowlerName,
    runs,
    balls,
    dismissals,
    fours,
    sixes,
    dots,
    strikeRate: balls > 0 ? Math.round((runs / balls) * 10000) / 100 : 0,
  }

  return setCache(key, result)
}

// ── 4. H2H: Player vs Team ──

export async function getPlayerVsTeam(
  playerName: string,
  teamName: string,
  seasons: string[]
): Promise<VsTeamStats> {
  const key = cacheKey('vs-team', playerName, teamName, seasons)
  const cached = getCached<VsTeamStats>(key)
  if (cached) return cached

  const [matchMap, battingSeasons, bowlingSeasons] = await Promise.all([
    loadMatchesForSeasons(seasons),
    loadBattingForSeasons(seasons),
    loadBowlingForSeasons(seasons),
  ])

  // Find matchIds where the team played
  const teamMatchIds = new Set<string>()
  for (const [id, match] of matchMap) {
    if (match.teams.includes(teamName)) teamMatchIds.add(id)
  }

  // Batting stats
  const bat = { innings: 0, runs: 0, balls: 0, fours: 0, sixes: 0, dismissals: 0, highScore: 0 }
  for (const { data } of battingSeasons) {
    for (const entry of data) {
      if (entry.batter !== playerName) continue
      if (!teamMatchIds.has(entry.matchId)) continue
      // Make sure the player is NOT on the same team - they're batting AGAINST the team
      const match = matchMap.get(entry.matchId)
      if (!match) continue
      // Innings 1 = first batting team, innings 2 = second batting team
      // teams[0] bats first (usually), but we need to check innings teams
      // Since scorecard doesn't have team info, we check: if player is in innings 1 and team is teams[0], skip (same team)
      // Actually we need to figure out which team the player was on. Let's use match.innings
      const playerTeamIdx = entry.innings - 1
      const playerTeam = match.innings?.[playerTeamIdx]?.team
      if (playerTeam === teamName) continue // Player was ON this team, not against

      bat.innings += 1
      bat.runs += entry.runs
      bat.balls += entry.balls
      bat.fours += entry.fours
      bat.sixes += entry.sixes
      if (entry.dismissal) bat.dismissals += 1
      if (entry.runs > bat.highScore) bat.highScore = entry.runs
    }
  }

  // Bowling stats
  const bowl = { innings: 0, balls: 0, runs: 0, wickets: 0 }
  for (const { data } of bowlingSeasons) {
    for (const entry of data) {
      if (entry.bowler !== playerName) continue
      if (!teamMatchIds.has(entry.matchId)) continue
      const match = matchMap.get(entry.matchId)
      if (!match) continue
      const bowlerTeamIdx = entry.innings === 1 ? 1 : 0 // Bowler bowls in the OTHER team's innings
      const bowlerTeam = match.innings?.[bowlerTeamIdx]?.team
      if (bowlerTeam === teamName) continue // Bowler was ON this team

      bowl.innings += 1
      bowl.runs += entry.runs
      bowl.wickets += entry.wickets
      bowl.balls += oversToBalls(entry.overs)
    }
  }

  const bowlOvers = bowl.balls / 6
  const result: VsTeamStats = {
    team: teamName,
    batting: {
      ...bat,
      strikeRate: bat.balls > 0 ? Math.round((bat.runs / bat.balls) * 10000) / 100 : 0,
    },
    bowling: {
      ...bowl,
      economy: bowlOvers > 0 ? Math.round((bowl.runs / bowlOvers) * 100) / 100 : 0,
    },
  }

  return setCache(key, result)
}

// ── 4b. Per-team Player Stats (stats only when player represented this team) ──

export interface TeamPlayerStatRow {
  playerName: string
  matches: number
  innings: number
  // Batting
  runs: number
  ballsFaced: number
  fours: number
  sixes: number
  highScore: number
  highScoreNotOut: boolean
  battingAvg: number
  strikeRate: number
  notOuts: number
  // Bowling
  wickets: number
  ballsBowled: number
  runsConceded: number
  economy: number
  bowlingAvg: number
  bestBowling: string
}

/**
 * Aggregates player stats filtered to matches where the player represented
 * the given team (matched against its canonical name + historical aliases).
 *
 * Team association is derived from `match.innings[innings - 1].team` for
 * batting entries and `match.innings[innings === 1 ? 1 : 0].team` for
 * bowling entries (bowler bowls in the opposing team's innings).
 */
export async function getTeamPlayerStats(
  teamNames: string[],
  seasons: string[]
): Promise<TeamPlayerStatRow[]> {
  const key = cacheKey('team-player-stats', teamNames, seasons)
  const cached = getCached<TeamPlayerStatRow[]>(key)
  if (cached) return cached

  const [matchMap, battingSeasons, bowlingSeasons] = await Promise.all([
    loadMatchesForSeasons(seasons),
    loadBattingForSeasons(seasons),
    loadBowlingForSeasons(seasons),
  ])

  const nameSet = new Set(teamNames)

  type BatBag = {
    innings: number
    runs: number
    balls: number
    fours: number
    sixes: number
    dismissals: number
    notOuts: number
    highScore: number
    highScoreNotOut: boolean
    matchIds: Set<string>
  }
  type BowlBag = {
    innings: number
    balls: number
    runs: number
    wickets: number
    best: { wickets: number; runs: number } | null
    matchIds: Set<string>
  }

  const batMap = new Map<string, BatBag>()
  const bowlMap = new Map<string, BowlBag>()
  const playerMatchIds = new Map<string, Set<string>>()

  const addMatch = (player: string, matchId: string) => {
    let set = playerMatchIds.get(player)
    if (!set) {
      set = new Set<string>()
      playerMatchIds.set(player, set)
    }
    set.add(matchId)
  }

  // Batting: player's team is match.innings[entry.innings - 1].team
  for (const { data } of battingSeasons) {
    for (const entry of data) {
      const match = matchMap.get(entry.matchId)
      if (!match) continue
      const playerTeam = match.innings?.[entry.innings - 1]?.team
      if (!playerTeam || !nameSet.has(playerTeam)) continue

      let bag = batMap.get(entry.batter)
      if (!bag) {
        bag = {
          innings: 0, runs: 0, balls: 0, fours: 0, sixes: 0,
          dismissals: 0, notOuts: 0, highScore: 0, highScoreNotOut: false,
          matchIds: new Set<string>(),
        }
        batMap.set(entry.batter, bag)
      }
      bag.innings += 1
      bag.runs += entry.runs
      bag.balls += entry.balls
      bag.fours += entry.fours
      bag.sixes += entry.sixes
      const isOut = !!entry.dismissal && entry.dismissal !== 'not out' && entry.dismissal !== 'retired hurt'
      if (isOut) bag.dismissals += 1
      else bag.notOuts += 1
      if (entry.runs > bag.highScore) {
        bag.highScore = entry.runs
        bag.highScoreNotOut = !isOut
      } else if (entry.runs === bag.highScore && !isOut) {
        bag.highScoreNotOut = true
      }
      bag.matchIds.add(entry.matchId)
      addMatch(entry.batter, entry.matchId)
    }
  }

  // Bowling: bowler's team is the OTHER innings' team
  for (const { data } of bowlingSeasons) {
    for (const entry of data) {
      const match = matchMap.get(entry.matchId)
      if (!match) continue
      const bowlerTeamIdx = entry.innings === 1 ? 1 : 0
      const bowlerTeam = match.innings?.[bowlerTeamIdx]?.team
      if (!bowlerTeam || !nameSet.has(bowlerTeam)) continue

      let bag = bowlMap.get(entry.bowler)
      if (!bag) {
        bag = { innings: 0, balls: 0, runs: 0, wickets: 0, best: null, matchIds: new Set<string>() }
        bowlMap.set(entry.bowler, bag)
      }
      bag.innings += 1
      bag.runs += entry.runs
      bag.wickets += entry.wickets
      bag.balls += oversToBalls(entry.overs)
      if (!bag.best
        || entry.wickets > bag.best.wickets
        || (entry.wickets === bag.best.wickets && entry.runs < bag.best.runs)) {
        bag.best = { wickets: entry.wickets, runs: entry.runs }
      }
      bag.matchIds.add(entry.matchId)
      addMatch(entry.bowler, entry.matchId)
    }
  }

  // Merge into rows
  const names = new Set<string>([...batMap.keys(), ...bowlMap.keys()])
  const result: TeamPlayerStatRow[] = []
  for (const name of names) {
    const bat = batMap.get(name)
    const bowl = bowlMap.get(name)
    const matches = playerMatchIds.get(name)?.size ?? 0

    const runs = bat?.runs ?? 0
    const balls = bat?.balls ?? 0
    const dismissals = bat?.dismissals ?? 0
    const battingAvg = dismissals > 0 ? Math.round((runs / dismissals) * 100) / 100 : 0
    const strikeRate = balls > 0 ? Math.round((runs / balls) * 10000) / 100 : 0

    const wickets = bowl?.wickets ?? 0
    const ballsBowled = bowl?.balls ?? 0
    const runsConceded = bowl?.runs ?? 0
    const overs = ballsBowled / 6
    const economy = overs > 0 ? Math.round((runsConceded / overs) * 100) / 100 : 0
    const bowlingAvg = wickets > 0 ? Math.round((runsConceded / wickets) * 100) / 100 : 0
    const bestBowling = bowl?.best ? `${bowl.best.wickets}/${bowl.best.runs}` : '-'

    result.push({
      playerName: name,
      matches,
      innings: bat?.innings ?? 0,
      runs,
      ballsFaced: balls,
      fours: bat?.fours ?? 0,
      sixes: bat?.sixes ?? 0,
      highScore: bat?.highScore ?? 0,
      highScoreNotOut: bat?.highScoreNotOut ?? false,
      battingAvg,
      strikeRate,
      notOuts: bat?.notOuts ?? 0,
      wickets,
      ballsBowled,
      runsConceded,
      economy,
      bowlingAvg,
      bestBowling,
    })
  }

  return setCache(key, result)
}

// ── 5. H2H: Player vs Venue ──

export async function getPlayerVsVenue(
  playerName: string,
  venue: string,
  seasons: string[]
): Promise<VsVenueStats> {
  const key = cacheKey('vs-venue', playerName, venue, seasons)
  const cached = getCached<VsVenueStats>(key)
  if (cached) return cached

  const [matchMap, battingSeasons, bowlingSeasons] = await Promise.all([
    loadMatchesForSeasons(seasons),
    loadBattingForSeasons(seasons),
    loadBowlingForSeasons(seasons),
  ])

  // Find matchIds at this venue
  const venueMatchIds = new Set<string>()
  for (const [id, match] of matchMap) {
    if (match.venue === venue) venueMatchIds.add(id)
  }

  // Batting
  const bat = { innings: 0, runs: 0, balls: 0, fours: 0, sixes: 0, highScore: 0 }
  for (const { data } of battingSeasons) {
    for (const entry of data) {
      if (entry.batter !== playerName) continue
      if (!venueMatchIds.has(entry.matchId)) continue
      bat.innings += 1
      bat.runs += entry.runs
      bat.balls += entry.balls
      bat.fours += entry.fours
      bat.sixes += entry.sixes
      if (entry.runs > bat.highScore) bat.highScore = entry.runs
    }
  }

  // Bowling
  const bowl = { innings: 0, balls: 0, runs: 0, wickets: 0 }
  for (const { data } of bowlingSeasons) {
    for (const entry of data) {
      if (entry.bowler !== playerName) continue
      if (!venueMatchIds.has(entry.matchId)) continue
      bowl.innings += 1
      bowl.runs += entry.runs
      bowl.wickets += entry.wickets
      bowl.balls += oversToBalls(entry.overs)
    }
  }

  const bowlOvers = bowl.balls / 6
  const result: VsVenueStats = {
    venue,
    batting: {
      ...bat,
      strikeRate: bat.balls > 0 ? Math.round((bat.runs / bat.balls) * 10000) / 100 : 0,
    },
    bowling: {
      ...bowl,
      economy: bowlOvers > 0 ? Math.round((bowl.runs / bowlOvers) * 100) / 100 : 0,
    },
  }

  return setCache(key, result)
}

// ── 6. Dismissal Breakdown ──

export async function getDismissalBreakdown(
  playerName: string,
  seasons: string[]
): Promise<DismissalBreakdown[]> {
  const key = cacheKey('dismissals', playerName, seasons)
  const cached = getCached<DismissalBreakdown[]>(key)
  if (cached) return cached

  const battingSeasons = await loadBattingForSeasons(seasons)

  const counts: Record<string, number> = {}
  let total = 0

  for (const { data } of battingSeasons) {
    for (const entry of data) {
      if (entry.batter !== playerName) continue
      if (!entry.dismissal) continue
      const kind = entry.dismissal
      // "not out" and "retired hurt" are not dismissals — the batter
      // wasn't out. Excluding them keeps the breakdown total equal to
      // (innings − notOuts), matching the Core Stats card.
      if (kind === 'not out' || kind === 'retired hurt') continue
      counts[kind] = (counts[kind] ?? 0) + 1
      total += 1
    }
  }

  const result: DismissalBreakdown[] = Object.entries(counts)
    .map(([kind, count]) => ({
      kind,
      count,
      percentage: total > 0 ? Math.round((count / total) * 10000) / 100 : 0,
    }))
    .sort((a, b) => b.count - a.count)

  return setCache(key, result)
}

// ── 7. Batting Position Stats ──

function getPositionGroup(pos: number): { group: string; positions: number[] } {
  if (pos <= 3) return { group: 'Top Order', positions: [1, 2, 3] }
  if (pos <= 5) return { group: 'Middle Order', positions: [4, 5] }
  if (pos <= 7) return { group: 'Lower Order', positions: [6, 7] }
  return { group: 'Tail', positions: [8, 9, 10, 11] }
}

export async function getBattingPositionStats(
  playerName: string,
  seasons: string[]
): Promise<PositionStats[]> {
  const key = cacheKey('bat-position', playerName, seasons)
  const cached = getCached<PositionStats[]>(key)
  if (cached) return cached

  const battingSeasons = await loadBattingForSeasons(seasons)

  const groups: Record<string, { positions: number[]; innings: number; runs: number; balls: number; fours: number; sixes: number; dismissals: number }> = {}

  for (const { data } of battingSeasons) {
    for (const entry of data) {
      if (entry.batter !== playerName) continue
      const { group, positions } = getPositionGroup(entry.position)
      if (!groups[group]) {
        groups[group] = { positions, innings: 0, runs: 0, balls: 0, fours: 0, sixes: 0, dismissals: 0 }
      }
      groups[group].innings += 1
      groups[group].runs += entry.runs
      groups[group].balls += entry.balls
      groups[group].fours += entry.fours
      groups[group].sixes += entry.sixes
      if (entry.dismissal) groups[group].dismissals += 1
    }
  }

  const order = ['Top Order', 'Middle Order', 'Lower Order', 'Tail']
  const result: PositionStats[] = order
    .filter((g) => groups[g])
    .map((group) => {
      const g = groups[group]
      return {
        group,
        positions: g.positions,
        innings: g.innings,
        runs: g.runs,
        balls: g.balls,
        fours: g.fours,
        sixes: g.sixes,
        strikeRate: g.balls > 0 ? Math.round((g.runs / g.balls) * 10000) / 100 : 0,
        average: g.dismissals > 0 ? Math.round((g.runs / g.dismissals) * 100) / 100 : g.runs,
        dismissals: g.dismissals,
      }
    })

  return setCache(key, result)
}

// ── 8. Partnership Analysis ──

export async function getPlayerPartnerships(
  playerName: string,
  seasons: string[]
): Promise<PartnershipEntry[]> {
  const key = cacheKey('partnerships', playerName, seasons)
  const cached = getCached<PartnershipEntry[]>(key)
  if (cached) return cached

  const partnershipSeasons = await loadPartnershipsForSeasons(seasons)

  const result: PartnershipEntry[] = []

  for (const { season, data } of partnershipSeasons) {
    for (const p of data) {
      if (p.batter1 !== playerName && p.batter2 !== playerName) continue
      const partner = p.batter1 === playerName ? p.batter2 : p.batter1
      result.push({
        matchId: p.matchId,
        innings: p.innings,
        wicket: p.wicket,
        partner,
        runs: p.runs,
        balls: p.balls,
        season,
      })
    }
  }

  // Sort by runs descending
  result.sort((a, b) => b.runs - a.runs)

  return setCache(key, result)
}

// ── 9. Season-by-Season Breakdown ──

export async function getSeasonBreakdown(
  playerName: string,
  seasons: string[]
): Promise<SeasonBreakdown[]> {
  const key = cacheKey('season-breakdown', playerName, seasons)
  const cached = getCached<SeasonBreakdown[]>(key)
  if (cached) return cached

  const [battingSeasons, bowlingSeasons] = await Promise.all([
    loadBattingForSeasons(seasons),
    loadBowlingForSeasons(seasons),
  ])

  const map = new Map<string, SeasonBreakdown>()

  const getOrCreate = (season: string): SeasonBreakdown => {
    let entry = map.get(season)
    if (!entry) {
      entry = {
        season,
        batting: { innings: 0, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: 0, highScore: 0, fifties: 0, hundreds: 0, average: 0, notOuts: 0 },
        bowling: { innings: 0, overs: 0, runs: 0, wickets: 0, economy: 0, bestFigures: '0/0' },
      }
      map.set(season, entry)
    }
    return entry
  }

  // Batting
  for (const { season, data } of battingSeasons) {
    for (const entry of data) {
      if (entry.batter !== playerName) continue
      const s = getOrCreate(season)
      s.batting.innings += 1
      s.batting.runs += entry.runs
      s.batting.balls += entry.balls
      s.batting.fours += entry.fours
      s.batting.sixes += entry.sixes
      if (entry.runs > s.batting.highScore) s.batting.highScore = entry.runs
      if (entry.runs >= 100) s.batting.hundreds += 1
      else if (entry.runs >= 50) s.batting.fifties += 1
      if (!entry.dismissal) s.batting.notOuts += 1
    }
  }

  // Bowling
  for (const { season, data } of bowlingSeasons) {
    for (const entry of data) {
      if (entry.bowler !== playerName) continue
      const s = getOrCreate(season)
      s.bowling.innings += 1
      s.bowling.runs += entry.runs
      s.bowling.wickets += entry.wickets
      // Track overs as balls for precision
      s.bowling.overs += oversToBalls(entry.overs) // Store as total balls temporarily

      // Best figures
      const currentBest = s.bowling.bestFigures.split('/')
      const currentBestW = parseInt(currentBest[0], 10)
      const currentBestR = parseInt(currentBest[1], 10)
      if (
        entry.wickets > currentBestW ||
        (entry.wickets === currentBestW && entry.runs < currentBestR)
      ) {
        s.bowling.bestFigures = `${entry.wickets}/${entry.runs}`
      }
    }
  }

  // Finalize computed fields
  const result: SeasonBreakdown[] = []
  for (const season of seasons) {
    const entry = map.get(season)
    if (!entry) continue
    const b = entry.batting
    b.strikeRate = b.balls > 0 ? Math.round((b.runs / b.balls) * 10000) / 100 : 0
    const dismissals = b.innings - b.notOuts
    b.average = dismissals > 0 ? Math.round((b.runs / dismissals) * 100) / 100 : b.runs

    // Convert bowling balls back to cricket overs (X.Y where Y ∈ 0..5)
    const totalBowlBalls = entry.bowling.overs // was stored as balls
    const decimalOvers = totalBowlBalls / 6 // used for economy math only
    entry.bowling.overs = ballsToOvers(totalBowlBalls)
    entry.bowling.economy = decimalOvers > 0 ? Math.round((entry.bowling.runs / decimalOvers) * 100) / 100 : 0

    result.push(entry)
  }

  return setCache(key, result)
}

// ── 10. Match-by-Match Scores ──

export async function getMatchBattingScores(
  playerName: string,
  season: string
): Promise<MatchBattingScore[]> {
  const key = cacheKey('match-batting', playerName, season)
  const cached = getCached<MatchBattingScore[]>(key)
  if (cached) return cached

  const [batting, matches] = await Promise.all([
    dataService.getBatting(season) as Promise<BattingEntry[]>,
    dataService.getMatches(season) as Promise<Match[]>,
  ])

  const matchMap = new Map<string, Match>()
  for (const m of matches) matchMap.set(m.id, m)

  const result: MatchBattingScore[] = []

  for (const entry of batting) {
    if (entry.batter !== playerName) continue
    const match = matchMap.get(entry.matchId)
    if (!match) continue

    // Determine opponent: the other team
    const playerTeam = match.innings?.[entry.innings - 1]?.team
    const opponent = match.teams[0] === playerTeam ? match.teams[1] : match.teams[0]

    result.push({
      matchId: entry.matchId,
      season,
      date: match.date,
      venue: match.venue,
      opponent,
      innings: entry.innings,
      runs: entry.runs,
      balls: entry.balls,
      fours: entry.fours,
      sixes: entry.sixes,
      strikeRate: entry.strikeRate,
      dismissal: entry.dismissal,
      position: entry.position,
    })
  }

  // Sort by date
  result.sort((a, b) => a.date.localeCompare(b.date))

  return setCache(key, result)
}

export async function getMatchBowlingScores(
  playerName: string,
  season: string
): Promise<MatchBowlingScore[]> {
  const key = cacheKey('match-bowling', playerName, season)
  const cached = getCached<MatchBowlingScore[]>(key)
  if (cached) return cached

  const [bowling, matches] = await Promise.all([
    dataService.getBowling(season) as Promise<BowlingEntry[]>,
    dataService.getMatches(season) as Promise<Match[]>,
  ])

  const matchMap = new Map<string, Match>()
  for (const m of matches) matchMap.set(m.id, m)

  const result: MatchBowlingScore[] = []

  for (const entry of bowling) {
    if (entry.bowler !== playerName) continue
    const match = matchMap.get(entry.matchId)
    if (!match) continue

    // Bowler bowls in the opponent's innings
    const battingTeam = match.innings?.[entry.innings - 1]?.team
    const opponent = battingTeam // The team the bowler is bowling against

    result.push({
      matchId: entry.matchId,
      season,
      date: match.date,
      venue: match.venue,
      opponent: opponent ?? match.teams[0],
      innings: entry.innings,
      overs: entry.overs,
      maidens: entry.maidens,
      runs: entry.runs,
      wickets: entry.wickets,
      economy: entry.economy,
      dots: entry.dots,
    })
  }

  result.sort((a, b) => a.date.localeCompare(b.date))

  return setCache(key, result)
}

// ── Public API ──

export const playerStatsService = {
  getPhaseWiseBatting,
  getPhaseWiseBowling,
  getH2HBatterVsBowler,
  getPlayerVsTeam,
  getTeamPlayerStats,
  getPlayerVsVenue,
  getDismissalBreakdown,
  getBattingPositionStats,
  getPlayerPartnerships,
  getSeasonBreakdown,
  getMatchBattingScores,
  getMatchBowlingScores,
  /** Clear the in-memory cache (useful if data is reloaded) */
  clearCache: () => cache.clear(),
}
