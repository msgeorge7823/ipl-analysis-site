// Domain types for the coaches database (head coaches, assistants, mentors,
// support staff). Powers the /coaches page and the per-coach drill-downs.

// Closed set of staff roles we recognize across the 15 franchises.
export type CoachRoleType =
  | 'head-coach'
  | 'assistant-coach'
  | 'batting-coach'
  | 'bowling-coach'
  | 'fielding-coach'
  | 'fast-bowling-coach'
  | 'spin-bowling-coach'
  | 'mentor'
  | 'director-of-cricket'
  | 'bowling-consultant'
  | 'strength-conditioning'
  | 'physio'
  | 'trainer'
  | 'analyst'
  | 'team-manager'

// Where a tenure ended that season — used to compute titles / finals reached.
export type CoachFinish =
  | 'Champion'
  | 'Runner-up'
  | 'Qualifier 1'
  | 'Qualifier 2'
  | 'Eliminator'
  | 'Playoffs'
  | 'Group Stage'
  | 'Withdrew'
  | 'Suspended'
  | 'Unknown'

// Per-season league + playoff record for one coach at one team.
export interface CoachSeasonResult {
  season: string
  league: {
    matches: number
    wins: number
    losses: number
    noResults: number
    winPct: number
  }
  playoffs: {
    matches: number
    wins: number
    losses: number
    noResults: number
    winPct: number
  }
  finish: CoachFinish
  notes?: string
}

// Tenure-level totals (sum across all seasons of one tenure).
export interface CoachTenureAggregate {
  league: { matches: number; wins: number; losses: number; noResults: number; winPct: number }
  playoffs: { matches: number; wins: number; losses: number; noResults: number; winPct: number }
  titles: number
  finalsReached: number
  playoffAppearances: number
}

// One contiguous stint with one franchise in one role.
export interface CoachTenure {
  team: string
  role: CoachRoleType
  fromSeason: string
  toSeason: string
  seasons: string[]
  perSeason: CoachSeasonResult[]
  aggregate: CoachTenureAggregate
  verified: boolean
  sources: string[]
  notes?: string
}

// All-tenure career totals shown on the coach profile header.
export interface CoachCareerTotals {
  seasonsCoached: number
  franchisesCoached: number
  league: { matches: number; wins: number; losses: number; noResults: number; winPct: number }
  playoffs: { matches: number; wins: number; losses: number; noResults: number; winPct: number }
  titles: number
  finalsReached: number
  playoffAppearances: number
}

// A coach record with biography, all tenures, and career totals.
export interface Coach {
  id: string
  name: string
  fullName?: string
  dob?: string
  nationality: string
  photo?: string
  specialty?: string[]
  playingCareerPlayerId?: string
  playingCareerSummary?: string
  tenures: CoachTenure[]
  careerTotals: CoachCareerTotals
  otherCoachingRoles?: { team: string; role: string; period: string; notes?: string }[]
  bio?: string
  sources: string[]
  verified: boolean
}

// Wrapper shape for the coaches.json shard (metadata + coach array).
export interface CoachesFile {
  _description: string
  _updated: string
  _phase: string
  coaches: Coach[]
}
