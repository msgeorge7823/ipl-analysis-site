/**
 * useRatings Hook
 *
 * Provides reactive access to the ICC-calibrated rating engine.
 * Triggers computation on first use if no cached data exists.
 * Returns ratings, computation status, progress, and errors.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { ratingService, type RatingResult } from '@/services/ratingService'

interface UseRatingsReturn {
  ratings: RatingResult[]
  isComputing: boolean
  progress: string
  progressPct: number
  error: string | null
  recompute: () => void
}

export function useRatings(): UseRatingsReturn {
  const [ratings, setRatings] = useState<RatingResult[]>([])
  const [isComputing, setIsComputing] = useState(false)
  const [progress, setProgress] = useState('')
  const [progressPct, setProgressPct] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  const compute = useCallback(async (force = false) => {
    setIsComputing(true)
    setError(null)
    setProgress('Initializing...')
    setProgressPct(0)

    try {
      const results = await ratingService.computeRatings({
        force,
        onProgress: (season, pct) => {
          if (mountedRef.current) {
            setProgress(`Processing season ${season}...`)
            setProgressPct(pct)
          }
        },
      })

      if (mountedRef.current) {
        setRatings(results)
        setProgress('')
        setProgressPct(100)
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Rating computation failed')
      }
    } finally {
      if (mountedRef.current) {
        setIsComputing(false)
      }
    }
  }, [])

  const recompute = useCallback(() => {
    compute(true)
  }, [compute])

  useEffect(() => {
    mountedRef.current = true

    // Try cached first, then compute if needed
    let cancelled = false

    async function init() {
      try {
        const cached = await ratingService.getCachedRatings()
        if (cancelled) return

        if (cached && cached.length > 0) {
          // Use cached data (convert CachedRating to RatingResult shape)
          setRatings(
            cached.map(c => ({
              playerId: c.playerId,
              playerName: c.playerName,
              battingRating: c.battingRating,
              bowlingRating: c.bowlingRating,
              overallRating: c.overallRating,
              peakRating: c.peakRating,
              peakSeason: '',
              matchesPlayed: 0,
            }))
          )
        } else {
          // No cache: trigger computation
          if (!cancelled) compute()
        }
      } catch {
        // On cache read failure, compute fresh
        if (!cancelled) compute()
      }
    }

    init()

    return () => {
      cancelled = true
      mountedRef.current = false
    }
  }, [compute])

  return { ratings, isComputing, progress, progressPct, error, recompute }
}
