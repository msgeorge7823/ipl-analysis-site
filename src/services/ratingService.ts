/**
 * Rating Service
 *
 * Manages the Web Worker lifecycle for computing ICC-calibrated ratings.
 * Caches results in IndexedDB via the db.ratings table.
 * Provides methods to compute, retrieve, and query rating data.
 */

import { db, type CachedRating } from '@/lib/db'

export interface RatingResult {
  playerId: string
  playerName: string
  battingRating: number
  bowlingRating: number
  overallRating: number
  peakRating: number
  peakSeason: string
  matchesPlayed: number
}

interface ProgressCallback {
  (season: string, pct: number): void
}

interface ComputeOptions {
  onProgress?: ProgressCallback
  force?: boolean
}

// Module-singleton worker. Reused across calls so we don't pay startup cost
// every time the user navigates to /ratings. computePromise serves as a
// dedupe latch — concurrent callers join the same in-flight computation.
let workerInstance: Worker | null = null
let computePromise: Promise<RatingResult[]> | null = null

// Lazy-create the rating worker on first use.
function getWorker(): Worker {
  if (!workerInstance) {
    workerInstance = new Worker(
      new URL('../workers/rating-worker.ts', import.meta.url),
      { type: 'module' }
    )
  }
  return workerInstance
}

// Hard-kill the worker. Used on `force` recomputes and as an explicit
// teardown hook for callers (e.g. the rating page on unmount).
function terminateWorker(): void {
  if (workerInstance) {
    workerInstance.terminate()
    workerInstance = null
  }
}

/**
 * Compute ratings using the Web Worker.
 * Returns a promise that resolves with the full rating results.
 * If a computation is already in progress, returns the existing promise.
 */
function computeRatings(options: ComputeOptions = {}): Promise<RatingResult[]> {
  const { onProgress, force } = options

  // If already computing, return the in-flight promise
  if (computePromise && !force) return computePromise

  computePromise = new Promise<RatingResult[]>((resolve, reject) => {
    // Terminate any existing worker to start fresh if forced
    if (force) terminateWorker()

    const worker = getWorker()

    worker.onmessage = async (e: MessageEvent) => {
      const msg = e.data

      if (msg.type === 'PROGRESS') {
        onProgress?.(msg.season, msg.pct)
      }

      if (msg.type === 'COMPLETE') {
        const ratings: RatingResult[] = msg.ratings
        // Cache in IndexedDB
        try {
          await cacheRatings(ratings)
        } catch {
          // Non-fatal: caching failure shouldn't block results
        }
        computePromise = null
        resolve(ratings)
      }

      if (msg.type === 'ERROR') {
        computePromise = null
        reject(new Error(msg.error))
      }
    }

    worker.onerror = (err) => {
      computePromise = null
      reject(new Error(err.message || 'Worker error'))
    }

    worker.postMessage({ type: 'COMPUTE' })
  })

  return computePromise
}

/**
 * Cache rating results into IndexedDB.
 */
async function cacheRatings(ratings: RatingResult[]): Promise<void> {
  const now = new Date().toISOString()

  const entries: CachedRating[] = ratings.map((r, i) => ({
    playerId: r.playerId,
    playerName: r.playerName,
    battingRating: r.battingRating,
    bowlingRating: r.bowlingRating,
    overallRating: r.overallRating,
    rank: i + 1,
    peakRating: r.peakRating,
    updatedAt: now,
  }))

  // Clear existing and bulk-add
  await db.ratings.clear()
  await db.ratings.bulkAdd(entries)

  // Store version marker
  await db.dataVersions.put({
    key: 'ratings',
    version: now,
    updatedAt: now,
  })
}

/**
 * Get cached ratings from IndexedDB.
 * Returns null if no cached data exists.
 */
async function getCachedRatings(): Promise<CachedRating[] | null> {
  try {
    const version = await db.dataVersions.get('ratings')
    if (!version) return null

    const ratings = await db.ratings.orderBy('rank').toArray()
    return ratings.length > 0 ? ratings : null
  } catch {
    return null
  }
}

/**
 * Get ratings, using cache if available.
 * If no cache exists, triggers computation.
 */
async function getRatings(options: ComputeOptions = {}): Promise<RatingResult[]> {
  if (!options.force) {
    const cached = await getCachedRatings()
    if (cached) {
      return cached.map(c => ({
        playerId: c.playerId,
        playerName: c.playerName,
        battingRating: c.battingRating,
        bowlingRating: c.bowlingRating,
        overallRating: c.overallRating,
        peakRating: c.peakRating,
        peakSeason: '',
        matchesPlayed: 0,
      }))
    }
  }

  return computeRatings(options)
}

/**
 * Get rating for a specific player from cache.
 */
async function getPlayerRating(playerId: string): Promise<CachedRating | null> {
  try {
    const rating = await db.ratings.get(playerId)
    return rating ?? null
  } catch {
    return null
  }
}

/**
 * Check if ratings are cached.
 */
async function hasCachedRatings(): Promise<boolean> {
  try {
    const version = await db.dataVersions.get('ratings')
    return !!version
  } catch {
    return false
  }
}

/**
 * Clear cached ratings (force recomputation on next call).
 */
async function clearCache(): Promise<void> {
  await db.ratings.clear()
  await db.dataVersions.delete('ratings')
}

export const ratingService = {
  computeRatings,
  getRatings,
  getCachedRatings,
  getPlayerRating,
  hasCachedRatings,
  clearCache,
  terminateWorker,
}
