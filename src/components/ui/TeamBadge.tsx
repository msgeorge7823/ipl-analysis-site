import { useState } from 'react'
import { getTeamLogo, TEAM_SHORT, TEAM_COLORS } from '@/lib/constants'

/**
 * TeamBadge
 * ---------
 * Renders an IPL franchise's official logo as a square badge. The lookup
 * is on the EXACT team name string, so the historical names ("Kings XI
 * Punjab", "Delhi Daredevils", "Royal Challengers Bangalore") resolve to
 * their pre-rebrand logos and the modern names resolve to the modern
 * marks. That keeps season-specific badges historically accurate.
 *
 * Behaviour:
 *   • If the team has a logo in TEAM_LOGOS → render an <img>
 *   • If the image fails to load (404, network) → fall back to the text
 *     short-code badge styled with the team's colour. This means we never
 *     show a broken image, even if a logo file is missing.
 *   • If the team isn't in TEAM_LOGOS at all → text fallback immediately.
 *
 * The badge is a perfect square (`size`px × `size`px) with rounded corners
 * and no padding, so it slots into existing fixed-width grid columns.
 */
interface TeamBadgeProps {
  team: string
  /**
   * Pixel size of the square badge. Used for inline width/height + font
   * sizing of the text fallback. Pass `undefined` (or omit) when you want
   * the size to come from `className` instead — useful for responsive
   * Tailwind classes like "w-12 h-12 sm:w-14 sm:h-14".
   */
  size?: number
  /** Optional className for additional styling on the wrapper. */
  className?: string
  /**
   * Border radius. 'lg' (default) gives a square badge with rounded
   * corners — best for logo marks. 'full' gives a circle.
   */
  shape?: 'lg' | 'full'
  /**
   * Season year ("2015", "2024", …). When provided, the badge picks the
   * exact logo design that the franchise was using that year. Most IPL
   * teams have refreshed their mark a few times — passing season ensures
   * a 2015 row shows the 2015-era badge, not the modern one.
   */
  season?: string
}

export default function TeamBadge({
  team,
  size,
  className = '',
  shape = 'lg',
  season,
}: TeamBadgeProps) {
  const logo = getTeamLogo(team, season)
  const short = TEAM_SHORT[team] || team.slice(0, 3).toUpperCase()
  const color = TEAM_COLORS[team]?.primary || '#6366f1'
  const [errored, setErrored] = useState(false)

  // When size is given, fix dimensions inline. Otherwise let className
  // (e.g. "w-10 h-10 sm:w-14 sm:h-14") drive the size.
  const dim = size != null ? { width: size, height: size } : undefined
  const radiusClass = shape === 'full' ? 'rounded-full' : 'rounded-lg'

  if (logo && !errored) {
    return (
      <div
        className={`${radiusClass} overflow-hidden flex items-center justify-center bg-white/[0.04] shrink-0 ${className}`}
        style={dim}
        title={team}
      >
        <img
          src={logo}
          alt={short}
          loading="lazy"
          decoding="async"
          onError={() => setErrored(true)}
          // Logos vary in aspect ratio and padding, so contain-fit them
          // inside the badge so the whole mark is always visible.
          className="w-full h-full object-contain"
        />
      </div>
    )
  }

  // Text fallback — same look as the legacy text badges so the layout
  // doesn't shift when a logo is missing. Font scales with size when
  // size is set; otherwise relies on a sensible default.
  const textStyle: React.CSSProperties = {
    ...dim,
    borderColor: color,
    color,
  }
  if (size != null) textStyle.fontSize = Math.round(size * 0.28)

  return (
    <div
      className={`${radiusClass} flex items-center justify-center font-extrabold border-2 shrink-0 ${
        size == null ? 'text-[10px] sm:text-xs' : ''
      } ${className}`}
      style={textStyle}
      title={team}
    >
      {short}
    </div>
  )
}
