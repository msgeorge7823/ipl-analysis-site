// Seasons landing page (/seasons).
// Card grid of every IPL season with winner, runner-up, and headline
// awards. Each card links to /seasons/:year.
import { Link } from 'react-router-dom'
import { useSeasons } from '@/hooks/useData'
import Breadcrumb from '@/components/ui/Breadcrumb'
import TeamBadge from '@/components/ui/TeamBadge'
import { TEAM_SHORT, TEAM_COLORS } from '@/lib/constants'

export default function Seasons() {
  const { data: seasons, isLoading } = useSeasons()

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-textSecondary">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4">Loading seasons...</p>
      </div>
    )
  }

  const sorted = seasons?.sort((a: any, b: any) => b.year.localeCompare(a.year)) || []

  return (
    <div className="max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-8">
      <Breadcrumb items={[{ label: 'Seasons' }]} />
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-2">All Seasons</h1>
        <p className="text-sm md:text-lg text-textSecondary">
          {sorted.length} seasons of IPL cricket, from 2008 to {sorted[0]?.year || 'present'}
        </p>
      </div>

      {/* Season Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sorted.map((season: any) => {
          const winnerColor = season.winner ? TEAM_COLORS[season.winner] : null
          const winnerShort = season.winner ? (TEAM_SHORT[season.winner] || season.winner) : ''
          const runnerUpShort = season.runnerUp ? (TEAM_SHORT[season.runnerUp] || season.runnerUp) : ''

          return (
            <Link
              key={season.year}
              to={`/seasons/${season.year}`}
              className="bg-card border border-border rounded-2xl p-4 md:p-6 hover:bg-cardHover transition-all group relative overflow-hidden"
              style={{
                background: winnerColor
                  ? `linear-gradient(135deg, ${winnerColor.primary}08, ${winnerColor.primary}15)`
                  : undefined,
              }}
            >
              {/* Winner gradient stripe */}
              {winnerColor && (
                <div
                  className="absolute top-0 left-0 w-1 h-full rounded-l-2xl"
                  style={{ backgroundColor: winnerColor.primary }}
                />
              )}

              <div className="flex items-start sm:items-center justify-between mb-4 gap-3">
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-accent transition-colors">
                    IPL {season.year}
                  </h3>
                  <p className="text-xs sm:text-sm text-textSecondary truncate">
                    {season.runnerUp ? (
                      <>
                        Runner-up: <span className="text-white font-medium">{runnerUpShort}</span>
                      </>
                    ) : (
                      <>&mdash;</>
                    )}
                    {season.teams ? ` \u00B7 ${season.teams.length} teams` : ''}
                  </p>
                </div>
                {season.winner && (
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline text-lg">{'\uD83C\uDFC6'}</span>
                    <TeamBadge team={season.winner} season={season.year} className="w-9 h-9 sm:w-10 sm:h-10" />
                    <div className="text-right">
                      <span
                        className="font-bold text-base sm:text-lg"
                        style={{ color: winnerColor?.primary || '#FFD700' }}
                      >
                        {winnerShort}
                      </span>
                      <div className="text-[10px] sm:text-xs text-textSecondary truncate max-w-[140px]">{season.winner}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Orange/Purple Cap info */}
              <div className="grid grid-cols-2 gap-3">
                {season.orangeCap && (
                  <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl px-3 py-2.5">
                    <div className="text-xs text-orange-400 font-semibold flex items-center gap-1.5 mb-1">
                      <img src="/icons/cricket-bat.svg" alt="" className="w-4 h-4" />
                      Orange Cap
                    </div>
                    <div className="text-sm text-white font-medium truncate">{season.orangeCap.player}</div>
                    <div className="text-xs text-textSecondary mt-0.5">{season.orangeCap.runs} runs</div>
                  </div>
                )}
                {season.purpleCap && (
                  <div className="bg-purple-500/5 border border-purple-500/10 rounded-xl px-3 py-2.5">
                    <div className="text-xs text-purple-400 font-semibold flex items-center gap-1.5 mb-1">
                      <img src="/icons/cricket-ball.svg" alt="" className="w-4 h-4" />
                      Purple Cap
                    </div>
                    <div className="text-sm text-white font-medium truncate">{season.purpleCap.player}</div>
                    <div className="text-xs text-textSecondary mt-0.5">{season.purpleCap.wickets} wickets</div>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
