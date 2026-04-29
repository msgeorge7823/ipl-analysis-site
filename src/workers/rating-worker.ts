/**
 * Rating Engine Web Worker
 *
 * ICC-calibrated player rating system for IPL.
 * Processes all seasons chronologically (2008 -> present),
 * computes Match Performance Scores, applies opposition strength,
 * seasonal decay, damping, and inactivity rules.
 *
 * Ratings are on a 0-1000 scale.
 */

// ── Types ──

interface BattingRecord {
  matchId: string
  innings: number
  batter: string
  batterId: string
  runs: number
  balls: number
  fours: number
  sixes: number
  strikeRate: number
  dismissal: string
  bowler?: string
  fielder?: string
  position: number
}

interface BowlingRecord {
  matchId: string
  innings: number
  bowler: string
  bowlerId: string
  overs: number
  maidens: number
  runs: number
  wickets: number
  economy: number
  dots: number
  fours: number
  sixes: number
  wides: number
  noballs: number
}

interface MatchRecord {
  id: string
  season: string
  date: string
  teams: string[]
  winner: string
  innings: { team: string; runs: number; wickets: number; overs: number }[]
}

interface PlayerState {
  playerId: string
  playerName: string
  battingScores: number[]
  bowlingScores: number[]
  battingRating: number
  bowlingRating: number
  peakBatting: number
  peakBowling: number
  peakOverall: number
  peakSeason: string
  matchesPlayed: number
  lastActiveSeason: string
  seasonsActive: Set<string>
}

interface RatingResult {
  playerId: string
  playerName: string
  battingRating: number
  bowlingRating: number
  overallRating: number
  peakRating: number
  peakSeason: string
  matchesPlayed: number
}

interface ProgressMessage {
  type: 'PROGRESS'
  season: string
  pct: number
}

interface CompleteMessage {
  type: 'COMPLETE'
  ratings: RatingResult[]
}

interface ErrorMessage {
  type: 'ERROR'
  error: string
}

// ── Constants ──

const BASE_RATING = 200
const MAX_RATING = 1000
const SEASONAL_DECAY = 0.05
const INACTIVITY_THRESHOLD = 2 // seasons absent before freezing
const INACTIVITY_DECAY_PER_SEASON = 0.08
const DAMPING_MATCHES = 10
const ROLLING_WINDOW = 30 // matches for rolling weighted average
const NEW_PLAYER_RATING = 200

// Batting MPS weights
const BAT_RUN_VALUE = 1.0
const BAT_FOUR_BONUS = 0.5
const BAT_SIX_BONUS = 1.0
const BAT_SR_BASELINE = 130
const BAT_50_BONUS = 15
const BAT_100_BONUS = 40
const BAT_DUCK_PENALTY = -10

// Bowling MPS weights
const BOWL_WICKET_VALUE = 25
const BOWL_ECONOMY_BASELINE = 8.0
const BOWL_MAIDEN_BONUS = 12
const BOWL_DOT_VALUE = 1.0
const BOWL_3W_BONUS = 10
const BOWL_5W_BONUS = 30

// ── Helpers ──

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val))
}

function computeBattingMPS(rec: BattingRecord): number {
  const runs = rec.runs
  const balls = rec.balls

  // Base: runs scored
  let mps = runs * BAT_RUN_VALUE

  // Boundary bonuses
  mps += rec.fours * BAT_FOUR_BONUS
  mps += rec.sixes * BAT_SIX_BONUS

  // Strike rate factor (only if faced at least 10 balls to avoid noise)
  if (balls >= 10) {
    const srFactor = (rec.strikeRate - BAT_SR_BASELINE) / BAT_SR_BASELINE
    mps += srFactor * runs * 0.3
  }

  // Milestone bonuses
  if (runs >= 100) mps += BAT_100_BONUS
  else if (runs >= 50) mps += BAT_50_BONUS

  // Duck penalty (dismissed for 0)
  if (runs === 0 && rec.dismissal !== 'not out' && rec.dismissal !== 'retired hurt') {
    mps += BAT_DUCK_PENALTY
  }

  // Not-out bonus: small boost for finishing innings
  if (rec.dismissal === 'not out' && runs >= 20) {
    mps += 5
  }

  return mps
}

function computeBowlingMPS(rec: BowlingRecord): number {
  const overs = rec.overs
  const ballsBowled = Math.floor(overs) * 6 + Math.round((overs % 1) * 10)

  if (ballsBowled === 0) return 0

  // Base: wickets
  let mps = rec.wickets * BOWL_WICKET_VALUE

  // Economy bonus/penalty (relative to baseline)
  const econDiff = BOWL_ECONOMY_BASELINE - rec.economy
  mps += econDiff * overs * 1.5

  // Maiden bonus
  mps += rec.maidens * BOWL_MAIDEN_BONUS

  // Dot ball value
  mps += rec.dots * BOWL_DOT_VALUE

  // Multi-wicket bonuses
  if (rec.wickets >= 5) mps += BOWL_5W_BONUS
  else if (rec.wickets >= 3) mps += BOWL_3W_BONUS

  return mps
}

/**
 * Compute a weighted moving average over recent match scores.
 * More recent matches get higher weight (exponential decay).
 */
function computeWeightedAverage(scores: number[]): number {
  if (scores.length === 0) return 0
  const window = scores.slice(-ROLLING_WINDOW)
  const n = window.length
  let totalWeight = 0
  let weightedSum = 0

  for (let i = 0; i < n; i++) {
    // Exponential weighting: most recent = highest weight
    const weight = Math.pow(1.05, i)
    weightedSum += window[i] * weight
    totalWeight += weight
  }
  return weightedSum / totalWeight
}

/**
 * Convert raw weighted average MPS into a 0-1000 rating.
 * Uses a sigmoid-like mapping calibrated so:
 *   - Average IPL performer ~400-500
 *   - Top performers ~750-900
 *   - All-time greats ~850-950
 */
function mpsToRating(avgMPS: number, matchCount: number): number {
  // Calibration: an average IPL batting MPS is ~25-35, top is ~60-80
  // Bowling average is ~20-30, top is ~50-70
  // We normalize so that these map to appropriate rating ranges

  // Sigmoid mapping: rating = MAX * (1 - e^(-k*mps)) with offset
  const k = 0.025
  const raw = MAX_RATING * (1 - Math.exp(-k * Math.max(avgMPS, 0)))

  // Apply damping for new players (reduce volatility for < DAMPING_MATCHES)
  const dampingFactor = matchCount >= DAMPING_MATCHES
    ? 1.0
    : 0.5 + 0.5 * (matchCount / DAMPING_MATCHES)

  const damped = BASE_RATING + (raw - BASE_RATING) * dampingFactor

  return clamp(Math.round(damped), 0, MAX_RATING)
}

// ── Main Processing ──

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  return res.json() as Promise<T>
}

async function processRatings(): Promise<void> {
  try {
    // Fetch seasons list
    const seasons: { year: string }[] = await fetchJSON('/data/_backup/seasons.json')
    const seasonYears = seasons.map(s => s.year).sort((a, b) => Number(a) - Number(b))

    const players = new Map<string, PlayerState>()
    // Track team average ratings for opposition strength
    const teamRatings = new Map<string, number>()

    const totalSeasons = seasonYears.length
    let processedSeasons = 0

    for (const year of seasonYears) {
      // Send progress
      const pct = Math.round((processedSeasons / totalSeasons) * 100)
      self.postMessage({ type: 'PROGRESS', season: year, pct } satisfies ProgressMessage)

      // Fetch season data
      let batting: BattingRecord[]
      let bowling: BowlingRecord[]
      let matches: MatchRecord[]

      try {
        ;[batting, bowling, matches] = await Promise.all([
          fetchJSON<BattingRecord[]>(`/data/scorecards/batting-${year}.json`),
          fetchJSON<BowlingRecord[]>(`/data/scorecards/bowling-${year}.json`),
          fetchJSON<MatchRecord[]>(`/data/matches/season-${year}.json`),
        ])
      } catch {
        // Skip seasons with missing data
        processedSeasons++
        continue
      }

      // Sort matches by date
      matches.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      // Build match lookup
      const matchMap = new Map<string, MatchRecord>()
      for (const m of matches) matchMap.set(m.id, m)

      // Group batting/bowling records by matchId
      const battingByMatch = new Map<string, BattingRecord[]>()
      for (const rec of batting) {
        const list = battingByMatch.get(rec.matchId) ?? []
        list.push(rec)
        battingByMatch.set(rec.matchId, list)
      }

      const bowlingByMatch = new Map<string, BowlingRecord[]>()
      for (const rec of bowling) {
        const list = bowlingByMatch.get(rec.matchId) ?? []
        list.push(rec)
        bowlingByMatch.set(rec.matchId, list)
      }

      // Apply seasonal decay before processing new season
      if (processedSeasons > 0) {
        for (const [, p] of players) {
          // Only decay if the player was active before
          if (p.matchesPlayed > 0) {
            p.battingRating = Math.round(p.battingRating * (1 - SEASONAL_DECAY))
            p.bowlingRating = Math.round(p.bowlingRating * (1 - SEASONAL_DECAY))
          }
        }
      }

      // Process each match chronologically
      for (const match of matches) {
        const matchBatting = battingByMatch.get(match.id) ?? []
        const matchBowling = bowlingByMatch.get(match.id) ?? []

        // Compute opposition strength factor based on opposing team's average rating
        const team1 = match.teams[0]
        const team2 = match.teams[1]
        const team1Avg = teamRatings.get(team1) ?? 400
        const team2Avg = teamRatings.get(team2) ?? 400

        // Process batting performances
        for (const batRec of matchBatting) {
          const pid = batRec.batterId
          if (!players.has(pid)) {
            players.set(pid, {
              playerId: pid,
              playerName: batRec.batter,
              battingScores: [],
              bowlingScores: [],
              battingRating: NEW_PLAYER_RATING,
              bowlingRating: 0,
              peakBatting: 0,
              peakBowling: 0,
              peakOverall: 0,
              peakSeason: year,
              matchesPlayed: 0,
              lastActiveSeason: year,
              seasonsActive: new Set(),
            })
          }

          const player = players.get(pid)!

          // Determine which team the batter is on (innings 1 = team1, innings 2 = team2)
          const opponentAvg = batRec.innings === 1 ? team2Avg : team1Avg

          // Opposition strength factor: playing against stronger teams boosts MPS
          const oppFactor = 0.8 + 0.4 * (opponentAvg / 800)

          const rawMPS = computeBattingMPS(batRec)
          const adjustedMPS = rawMPS * clamp(oppFactor, 0.7, 1.5)

          player.battingScores.push(adjustedMPS)
          player.lastActiveSeason = year
          player.seasonsActive.add(year)

          // Only count match once (use batting as primary indicator)
          // Track unique matches via a simple heuristic: count per match
          // We'll fix the match count after all records
        }

        // Process bowling performances
        for (const bowlRec of matchBowling) {
          const pid = bowlRec.bowlerId
          if (!players.has(pid)) {
            players.set(pid, {
              playerId: pid,
              playerName: bowlRec.bowler,
              battingScores: [],
              bowlingScores: [],
              battingRating: 0,
              bowlingRating: NEW_PLAYER_RATING,
              peakBatting: 0,
              peakBowling: 0,
              peakOverall: 0,
              peakSeason: year,
              matchesPlayed: 0,
              lastActiveSeason: year,
              seasonsActive: new Set(),
            })
          }

          const player = players.get(pid)!

          const opponentAvg = bowlRec.innings === 1 ? team1Avg : team2Avg
          const oppFactor = 0.8 + 0.4 * (opponentAvg / 800)

          const rawMPS = computeBowlingMPS(bowlRec)
          const adjustedMPS = rawMPS * clamp(oppFactor, 0.7, 1.5)

          player.bowlingScores.push(adjustedMPS)
          player.lastActiveSeason = year
          player.seasonsActive.add(year)
        }

        // Track unique matches per player for this match
        const seen = new Set<string>()
        for (const rec of matchBatting) {
          if (!seen.has(rec.batterId)) {
            seen.add(rec.batterId)
            const p = players.get(rec.batterId)
            if (p) p.matchesPlayed++
          }
        }
        for (const rec of matchBowling) {
          if (!seen.has(rec.bowlerId)) {
            seen.add(rec.bowlerId)
            const p = players.get(rec.bowlerId)
            if (p) p.matchesPlayed++
          }
        }
      }

      // Update ratings for all active players this season
      for (const [, player] of players) {
        if (!player.seasonsActive.has(year)) continue

        // Compute ratings from weighted moving average
        if (player.battingScores.length > 0) {
          const avgBat = computeWeightedAverage(player.battingScores)
          player.battingRating = mpsToRating(avgBat, player.battingScores.length)
        }
        if (player.bowlingScores.length > 0) {
          const avgBowl = computeWeightedAverage(player.bowlingScores)
          player.bowlingRating = mpsToRating(avgBowl, player.bowlingScores.length)
        }

        // Track peaks
        const overall = computeOverall(player.battingRating, player.bowlingRating)
        if (overall > player.peakOverall) {
          player.peakOverall = overall
          player.peakBatting = player.battingRating
          player.peakBowling = player.bowlingRating
          player.peakSeason = year
        }
      }

      // Update team average ratings for next season's opposition strength
      const teamPlayerRatings = new Map<string, number[]>()
      for (const match of matches) {
        const matchBatting = battingByMatch.get(match.id) ?? []
        for (const rec of matchBatting) {
          const p = players.get(rec.batterId)
          if (!p) continue
          // Determine team from innings
          const team = rec.innings === 1 ? match.teams[0] : match.teams[1]
          const list = teamPlayerRatings.get(team) ?? []
          list.push(p.battingRating)
          teamPlayerRatings.set(team, list)
        }
      }
      for (const [team, ratings] of teamPlayerRatings) {
        const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length
        teamRatings.set(team, Math.round(avg))
      }

      processedSeasons++
    }

    // Apply inactivity decay for players absent > 2 seasons
    const latestSeason = seasonYears[seasonYears.length - 1]
    const latestYear = Number(latestSeason)
    for (const [, player] of players) {
      const lastYear = Number(player.lastActiveSeason)
      const gap = latestYear - lastYear
      // Account for missing 2020 season
      const adjustedGap = (lastYear < 2020 && latestYear > 2020) ? gap - 1 : gap
      if (adjustedGap > INACTIVITY_THRESHOLD) {
        const decaySeasons = adjustedGap - INACTIVITY_THRESHOLD
        const decayFactor = Math.pow(1 - INACTIVITY_DECAY_PER_SEASON, decaySeasons)
        player.battingRating = Math.round(player.battingRating * decayFactor)
        player.bowlingRating = Math.round(player.bowlingRating * decayFactor)
      }
    }

    // Build final results
    const results: RatingResult[] = []
    for (const [, player] of players) {
      const overall = computeOverall(player.battingRating, player.bowlingRating)
      results.push({
        playerId: player.playerId,
        playerName: player.playerName,
        battingRating: player.battingRating,
        bowlingRating: player.bowlingRating,
        overallRating: overall,
        peakRating: player.peakOverall,
        peakSeason: player.peakSeason,
        matchesPlayed: player.matchesPlayed,
      })
    }

    // Sort by overall rating descending
    results.sort((a, b) => b.overallRating - a.overallRating)

    self.postMessage({ type: 'PROGRESS', season: 'Done', pct: 100 } satisfies ProgressMessage)
    self.postMessage({ type: 'COMPLETE', ratings: results } satisfies CompleteMessage)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    self.postMessage({ type: 'ERROR', error: message } satisfies ErrorMessage)
  }
}

function computeOverall(batting: number, bowling: number): number {
  // For all-rounders (both > 200), give a combined boost
  // Otherwise take the primary discipline
  if (batting > 200 && bowling > 200) {
    // Weighted combination with all-rounder bonus
    const combined = Math.round(batting * 0.5 + bowling * 0.5 + Math.min(batting, bowling) * 0.1)
    return clamp(combined, 0, MAX_RATING)
  }
  return Math.max(batting, bowling)
}

// ── Worker Message Handler ──

self.onmessage = (e: MessageEvent) => {
  const { type } = e.data
  if (type === 'COMPUTE') {
    processRatings()
  }
}
