// Client-side IndexedDB layer (Dexie wrapper). Caches large derived data
// (ball-by-ball, computed ratings) and persists user-owned UI state
// (workspaces, watchlist) across reloads — keeping the network footprint
// small after the first visit.
import Dexie, { type Table } from 'dexie'

// Cached single delivery row keyed by match+innings+over+ball.
export interface CachedBBB {
  id: string           // `${matchId}-${innings}-${over}-${ball}`
  matchId: string
  season: string
  innings: number
  over: number
  ball: number
  batter: string
  bowler: string
  nonStriker: string
  batterRuns: number
  extraRuns: number
  totalRuns: number
  isWicket: boolean
  wicketKind?: string
  playerOut?: string
  extras?: string      // JSON stringified
}

// Cached rating row so the leaderboard can paint instantly while the worker
// recomputes in the background.
export interface CachedRating {
  playerId: string
  playerName: string
  battingRating: number
  bowlingRating: number
  overallRating: number
  rank: number
  peakRating: number
  updatedAt: string
}

// User-saved analytics workspace (a named bundle of player IDs + filter state).
export interface Workspace {
  id?: number
  name: string
  playerIds: string[]
  filters: string       // JSON stringified
  createdAt: string
  updatedAt: string
}

// "Star" a player to follow them — persisted locally with optional notes.
export interface WatchlistEntry {
  id?: number
  playerId: string
  playerName: string
  notes: string
  addedAt: string
}

// Tracks which data shard version we have cached so we know when to refetch.
export interface DataVersion {
  key: string
  version: string
  updatedAt: string
}

// Dexie schema. Indexes are picked to match our hot lookup paths (by match,
// by player, by rank). Bump the version() if any store schema changes.
class IPLDatabase extends Dexie {
  bbb!: Table<CachedBBB>
  ratings!: Table<CachedRating>
  workspaces!: Table<Workspace>
  watchlist!: Table<WatchlistEntry>
  dataVersions!: Table<DataVersion>

  constructor() {
    super('ipl-analysis')

    this.version(1).stores({
      bbb: 'id, matchId, season, batter, bowler',
      ratings: 'playerId, overallRating, rank',
      workspaces: '++id, name, updatedAt',
      watchlist: '++id, playerId, addedAt',
      dataVersions: 'key',
    })
  }
}

// Module-level singleton. Import `db` anywhere to use the cache.
export const db = new IPLDatabase()
