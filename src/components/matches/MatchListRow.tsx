import { Link } from 'react-router-dom'
import TeamBadge from '@/components/ui/TeamBadge'
import { TEAM_SHORT, TEAM_COLORS } from '@/lib/constants'
import { formatMatchResult } from '@/lib/matchResult'
import { resolveHomeAway } from '@/lib/matchVenue'

/**
 * Canonical match-list row used by the Matches page and SeasonDetail page.
 *
 * Previously, each page rendered its own row/card. That duplication is what
 * allowed the team/innings column-alignment bug to exist on SeasonDetail
 * while Matches rendered correctly — same underlying data, two render
 * paths that drifted apart. This component is the ONE place match rows are
 * rendered. Both pages import and use it.
 *
 * Guarantees:
 *   - Team name on the left side is the team that BATTED FIRST (from
 *     innings[0].team), and its score is shown right beside it.
 *   - Team name on the right side is the team that BATTED SECOND, same.
 *   - Tied / super-over matches show "(Super Over)" instead of a
 *     misleading "won by N wkts" line from stale source data.
 *   - Abandoned matches get a grey pill.
 *   - A match with no winner shows "No Result".
 */

type MatchInnings = {
  team?: string
  runs?: number
  wickets?: number
  overs?: number
}

type MatchLike = {
  id: string | number
  date?: string
  matchNumber?: number
  venue?: string
  city?: string
  teams?: string[]
  innings?: MatchInnings[]
  winner?: string | null
  winMargin?: { runs?: number; wickets?: number } | null
  abandoned?: boolean
  abandonReason?: string | null
  note?: string | null
  result?: string | null
  playerOfMatch?: string[]
  playoffStage?: string | null
}

type Props = {
  match: MatchLike
  /** Era-accurate team badge rendering hint. */
  season?: string
  /** Hide the venue block when the parent page already shows venue elsewhere. */
  showVenue?: boolean
}

export default function MatchListRow({ match, season, showVenue = true }: Props) {
  // ─── Team display order ──────────────────────────────────────────────
  //
  // IPL fixtures use HOME-team-first ordering ("MI vs RCB" when played at
  // Wankhede). We try to determine that via `resolveHomeAway`, which
  // returns null for playoffs, overseas seasons, and neutral-venue
  // matches. In those cases we fall back to batting-order (innings[0]
  // first) to preserve the previous correct display.
  //
  // CRUCIALLY: once we decide the team display order, we look up each
  // team's innings BY NAME (not by array index), so the score shown
  // beside a team is always that team's actual score regardless of which
  // team batted first.

  const inn = match.innings || []
  const innByTeam = new Map<string, NonNullable<typeof inn[number]>>()
  for (const i of inn) {
    if (i.team) innByTeam.set(i.team, i)
  }

  const homeAway = resolveHomeAway(match)
  let team1: string
  let team2: string
  if (homeAway) {
    // Standard in-India regular-season match: home team goes first.
    team1 = homeAway.home
    team2 = homeAway.away
  } else {
    // Playoffs / overseas / neutral / unknown → batting-order display.
    team1 = inn[0]?.team || match.teams?.[0] || ''
    team2 = inn[1]?.team || match.teams?.[1] || ''
  }

  // Find the innings for each displayed team by NAME (not by array
  // index) — this is the key guarantee that scores always stay pinned
  // to the correct team label.
  const inn1 = innByTeam.get(team1)
  const inn2 = innByTeam.get(team2)

  const team1Short = TEAM_SHORT[team1] || team1
  const team2Short = TEAM_SHORT[team2] || team2
  const team1Color = TEAM_COLORS[team1]?.primary || '#6366f1'
  const team2Color = TEAM_COLORS[team2]?.primary || '#6366f1'

  const result = formatMatchResult(match, TEAM_SHORT)

  return (
    <Link
      to={`/matches/${match.id}`}
      className="flex flex-wrap md:flex-nowrap items-center gap-2 md:gap-4 p-3 md:p-4 bg-card border border-border rounded-xl hover:bg-cardHover transition-all cursor-pointer group"
    >
      {/* Match Number / playoff stage */}
      <div className="flex flex-col items-center w-12 md:w-16 flex-shrink-0">
        {match.playoffStage ? (
          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded uppercase tracking-wider">
            {match.playoffStage}
          </span>
        ) : (
          <>
            <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Match</span>
            <span className="text-lg md:text-xl font-extrabold text-white">{match.matchNumber || ''}</span>
          </>
        )}
      </div>
      <div className="w-px h-10 md:h-12 bg-border flex-shrink-0 hidden sm:block" />

      {/* Date */}
      <div className="flex flex-col items-center w-16 md:w-24 flex-shrink-0">
        <span className="text-xs md:text-sm font-semibold text-white">
          {match.date
            ? new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : '—'}
        </span>
        {match.date && <span className="text-[10px] md:text-[11px] text-textSecondary hidden md:block">{match.date}</span>}
      </div>
      <div className="w-px h-10 md:h-12 bg-border flex-shrink-0 hidden sm:block" />

      {/* Teams + Score — fixed-column sub-grid.
          Columns: [40 badge1] [4ch name1] [240 score] [4ch name2] [40 badge2]
          Monospace + padEnd/padStart keeps abbreviations in a fixed pixel
          slot regardless of name length (MI vs PBKS etc.). */}
      <div className="flex-shrink-0">
        <div
          className="grid items-center gap-x-2 md:gap-x-3"
          style={{ gridTemplateColumns: '40px 4ch 240px 4ch 40px' }}
        >
          <TeamBadge team={team1} size={40} season={season || match.teams?.[0]?.slice(0, 0)} />
          <span
            className="text-sm font-bold font-mono whitespace-pre tracking-tight"
            style={{ color: match.winner === team1 ? team1Color : '#94a3b8' }}
          >
            {team1Short.padEnd(4)}
          </span>
          <div className="flex items-center justify-center gap-2 whitespace-nowrap">
            {inn1 ? (
              <span className="text-sm font-semibold text-white tabular-nums">
                {inn1.runs}/{inn1.wickets}
                <span className="text-xs text-textSecondary ml-0.5">({inn1.overs})</span>
              </span>
            ) : (
              <span className="text-xs text-textSecondary">—</span>
            )}
            <span className="text-xs text-textSecondary font-bold">vs</span>
            {inn2 ? (
              <span className="text-sm font-semibold text-white tabular-nums">
                {inn2.runs}/{inn2.wickets}
                <span className="text-xs text-textSecondary ml-0.5">({inn2.overs})</span>
              </span>
            ) : (
              <span className="text-xs text-textSecondary">—</span>
            )}
          </div>
          <span
            className="text-sm font-bold font-mono whitespace-pre tracking-tight"
            style={{ color: match.winner === team2 ? team2Color : '#94a3b8' }}
          >
            {team2Short.padStart(4)}
          </span>
          <TeamBadge team={team2} size={40} season={season || match.teams?.[1]?.slice(0, 0)} />
        </div>
      </div>

      {/* Venue — fixed-width slot with left-aligned text. */}
      {showVenue && (
        <div className="hidden lg:flex items-center gap-2 flex-shrink-0 w-[260px] ml-6 justify-start">
          <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <div className="flex flex-col flex-1 min-w-0 items-start">
            <span className="text-sm font-medium text-gray-300 truncate w-full text-left" title={match.venue}>
              {match.venue}
            </span>
            {match.city && <span className="text-xs text-textSecondary text-left">{match.city}</span>}
          </div>
        </div>
      )}

      {/* Result — single source of truth via formatMatchResult().
          Three visually distinct states:
            • abandoned/noResult  → gray pill ("No Result" / "Match Abandoned")
            • fixture (upcoming)  → blue pill ("Scheduled")
            • win/tie/unknown     → accent text describing the result */}
      <div className="flex-shrink-0 ml-0 md:ml-2 w-full sm:w-auto mt-1 sm:mt-0">
        {result.kind === 'abandoned' || result.kind === 'noResult' ? (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-500/15 text-gray-400">
            {result.text}
          </span>
        ) : result.kind === 'fixture' ? (
          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-500/15 text-blue-400">
            {result.text}
          </span>
        ) : (
          <span className="text-xs text-accent truncate">{result.text}</span>
        )}
      </div>
    </Link>
  )
}
