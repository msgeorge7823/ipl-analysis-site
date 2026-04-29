import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { usePlayers, useSquadNameMapping } from '@/hooks/useData'

/**
 * Resolves a scorecard/BBB player name (e.g., "SR Watson", "MS Dhoni") to the
 * canonical IPL player.id. Pulls two sources of truth and builds a case-
 * insensitive lookup:
 *   1. Pre-computed fuzzy match: public/data/_backup/squad-name-mapping.json
 *   2. Direct name/shortName matches from the players index.
 *
 * Returns (name) => id | null.
 */
export function usePlayerIdResolver(): (name: string | undefined | null) => string | null {
  const { data: players } = usePlayers()
  const { data: squadMapping } = useSquadNameMapping()

  const lookup = useMemo(() => {
    const map: Record<string, string> = {}
    if (squadMapping) {
      for (const [nm, id] of Object.entries(squadMapping)) {
        map[nm.toLowerCase()] = id
      }
    }
    if (players) {
      for (const p of players) {
        if (p.name) map[p.name.toLowerCase()] = p.id
        if (p.shortName) map[p.shortName.toLowerCase()] = p.id
      }
    }
    return map
  }, [players, squadMapping])

  return (name) => {
    if (!name) return null
    return lookup[name.trim().toLowerCase()] ?? null
  }
}

interface PlayerLinkProps {
  name: string | undefined | null
  /** Optional known player.id — skips the lookup. */
  id?: string | null
  /** Extra classes applied to the Link/span wrapper. */
  className?: string
  /** Children override — by default we render the name. */
  children?: React.ReactNode
  /** Stop click from bubbling (for nested click handlers). */
  stopPropagation?: boolean
}

/**
 * Renders a player name as a Link to /players/:id. If the id isn't known and
 * can't be resolved, degrades to a plain span — never a broken link.
 */
export default function PlayerLink({
  name,
  id,
  className,
  children,
  stopPropagation,
}: PlayerLinkProps) {
  const resolve = usePlayerIdResolver()
  const resolvedId = id ?? resolve(name ?? '')
  const label = children ?? name ?? ''

  if (!resolvedId) {
    return <span className={className}>{label}</span>
  }

  return (
    <Link
      to={`/players/${resolvedId}`}
      className={className}
      onClick={stopPropagation ? (e) => e.stopPropagation() : undefined}
    >
      {label}
    </Link>
  )
}
