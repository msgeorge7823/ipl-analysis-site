// Shared TypeScript domain types for the whole app. Anything that flows out
// of dataService — players, teams, matches, deliveries, scorecards, season
// records, ratings — has its shape defined here. Keep these aligned with the
// JSON shards under public/data/ and _backup/.

// Player profile. `id` is the CricSheet registry hash so it is stable across
// seasons / name changes; `name` is the display form, `shortName` is the
// scorecard form used to join to ball-by-ball data.
export interface Player {
  id: string              // CricSheet person_id (registry hash)
  name: string            // League-display name (the most-commonly-used form, e.g. "Rohit Sharma", "Dasun Shanaka", "Virat Kohli"). This is what users search for and what the UI shows.
  fullName?: string       // Legal long form (e.g. "Rohit Gurunath Sharma", "Madagamagamage Dasun Shanaka"). Optional.
  shortName: string       // Scorecard / ball-by-ball initial form (e.g. "RG Sharma", "MD Shanaka"). Joins to scorecards/BBB data.
  nicknames?: string[]    // Aliases / fan names (e.g. "Hitman", "King Kohli", "Captain Cool").
  country?: string
  battingStyle?: string
  bowlingStyle?: string
  role?: string           // "Batter" | "Bowler" | "All-rounder" | "WK-Batter"
  teams: string[]         // Teams played for
  seasons: number[]       // Seasons active
  status: "active" | "retired" | "unsold"
}

// Franchise. `aliases` lets us resolve historical names (e.g. Delhi Daredevils
// → Delhi Capitals) when reading older match files.
export interface Team {
  id: string
  name: string
  shortName: string       // e.g., "CSK", "MI"
  primaryColor: string
  secondaryColor: string
  homeVenue: string
  seasons: number[]
  isDefunct: boolean
  aliases: string[]       // Historical names (e.g., "Delhi Daredevils" for "Delhi Capitals")
}

// One IPL match. Doubles as both "scheduled fixture" (toss/innings absent)
// and "completed match" (toss/innings/winner populated). Playoff and abandon
// metadata is set only on the matches that need it.
export interface Match {
  id: string              // CricSheet match file ID
  season: string
  date: string
  venue: string
  city?: string
  teams: [string, string]
  // Toss fields are absent for fixtures (toss happens just before the match
  // begins). They become populated once the match starts.
  tossWinner?: string
  tossDecision?: "bat" | "field"
  winner?: string
  winMargin?: { runs?: number; wickets?: number }
  playerOfMatch?: string[]
  matchNumber?: number
  umpires?: string[]
  // Innings is also empty/absent for unplayed fixtures.
  innings?: InningsSummary[]
  /** Knockout stage label, present only on playoff/knockout matches.
   *  Modern (2011+): "Qualifier 1" | "Eliminator" | "Qualifier 2" | "Final"
   *  Classic (2008-2010): "Semi Final" | "3rd Place Play-Off" | "Final" */
  playoffStage?: string
  /** Set when a match was abandoned without a result (rain, etc). */
  abandoned?: boolean
  abandonReason?: string
  /** CricSheet outcome.result field. "no result" for washouts that started
   *  but didn't complete; "tie" for ties resolved by Super Over. */
  result?: string
  /** For tied matches, the team that won the Super Over (eliminator). The
   *  pipeline mirrors this into `winner` so points/UI logic stays simple. */
  eliminator?: string
}

// Compact innings line shown on match cards / lists (no per-ball detail).
export interface InningsSummary {
  team: string
  runs: number
  wickets: number
  overs: number
  extras: number
}

// One legal/illegal delivery. The atomic unit aggregated into scorecards,
// partnerships, phase analysis, and rating computations.
export interface Delivery {
  matchId: string
  innings: number         // 1 or 2
  over: number
  ball: number
  batter: string
  bowler: string
  nonStriker: string
  batterRuns: number
  extraRuns: number
  totalRuns: number
  extras?: {
    wides?: number
    noballs?: number
    byes?: number
    legbyes?: number
    penalty?: number
  }
  isWicket: boolean
  wicket?: {
    kind: string
    playerOut: string
    fielders?: string[]
  }
}

// One batter's line on a match scorecard.
export interface BattingEntry {
  matchId: string
  innings: number
  batter: string
  batterId: string
  runs: number
  balls: number
  fours: number
  sixes: number
  strikeRate: number
  dismissal?: string
  bowler?: string
  fielder?: string
  position: number
}

// One bowler's line on a match scorecard.
export interface BowlingEntry {
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

// A single batting partnership (runs added between two wicket events).
export interface Partnership {
  matchId: string
  innings: number
  wicket: number
  batter1: string
  batter2: string
  runs: number
  balls: number
}

// One IPL season's headline record (winner, awards, participating teams).
export interface Season {
  year: string
  winner?: string
  runnerUp?: string
  playerOfTournament?: string
  orangeCap?: string
  purpleCap?: string
  matchCount: number
  teams: string[]
}

// Venue record with pitch-character summary (avg first/second innings totals).
export interface Venue {
  name: string
  city: string
  matchCount: number
  avgFirstInningsScore: number
  avgSecondInningsScore: number
}

// Aggregated career numbers across batting, bowling, and fielding. Computed
// by playerStatsService from the BBB delivery feed.
export interface PlayerStats {
  playerId: string
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
  fifties: number
  hundreds: number
  ducks: number
  notOuts: number
  // Bowling
  wickets: number
  ballsBowled: number
  runsConceded: number
  economy: number
  bowlingAvg: number
  bowlingSR: number
  bestBowling: string   // e.g., "4/20"
  threeWickets: number
  fiveWickets: number
  maidens: number
  dots: number
  // Fielding
  catches: number
  stumpings: number
  runOuts: number
}

// ICC-style 0-1000 rating snapshot. Produced by ratingService / rating-worker.
export interface PlayerRating {
  playerId: string
  playerName: string
  battingRating: number    // 0-1000
  bowlingRating: number    // 0-1000
  overallRating: number    // 0-1000
  rank: number
  peakRating: number
  peakDate: string
  trend: "up" | "down" | "stable"
}

// Manifest emitted by the data pipeline. Lets the app integrity-check shards
// and surface generation timestamps in the UI.
export interface DataManifest {
  version: string
  generatedAt: string
  seasons: string[]
  matchCount: number
  playerCount: number
  files: Record<string, { hash: string; size: number }>
}
