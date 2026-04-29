// Teams landing page (/teams).
// Franchise grid (active teams first, defunct franchises below) with
// quick stats and team-tinted cards. Each card links to /teams/:id.
import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { useTeams, useSeasons } from '@/hooks/useData'
import Breadcrumb from '@/components/ui/Breadcrumb'
import TeamBadge from '@/components/ui/TeamBadge'
import { TEAM_COLORS } from '@/lib/constants'

// Defunct team metadata for display
const DEFUNCT_META: Record<string, { status: string; statusColor: string; note: string }> = {
  'Deccan Chargers': { status: 'TERMINATED', statusColor: 'red', note: 'Replaced by Sunrisers Hyderabad' },
  'Kochi Tuskers Kerala': { status: 'TERMINATED', statusColor: 'red', note: 'Shortest-lived franchise' },
  'Pune Warriors': { status: 'WITHDREW', statusColor: 'amber', note: 'Withdrew after BCCI fee dispute' },
  'Gujarat Lions': { status: 'TEMPORARY', statusColor: 'blue', note: 'Replacement for suspended RR' },
  'Rising Pune Supergiant': { status: 'TEMPORARY', statusColor: 'blue', note: 'Replacement for suspended CSK' },
}

export default function Teams() {
  const { data: teams, isLoading } = useTeams()
  const { data: seasons } = useSeasons()

  const active = useMemo(() => (teams || []).filter(t => !t.isDefunct), [teams])
  const defunct = useMemo(() => (teams || []).filter(t => t.isDefunct), [teams])

  // Count titles per team
  const titleMap = useMemo(() => {
    if (!seasons || !teams) return {} as Record<string, string[]>
    const map: Record<string, string[]> = {}
    for (const team of teams) {
      const wins = seasons.filter(s =>
        s.winner === team.name || team.aliases?.some((a: string) => a === s.winner)
      )
      if (wins.length > 0) {
        map[team.name] = wins.map(w => w.year)
      }
    }
    return map
  }, [seasons, teams])

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-textSecondary">
        Loading teams...
      </div>
    )
  }

  const activeCount = active.length
  const defunctCount = defunct.length
  const totalSeasons = seasons?.length || 0
  const uniqueChampions = new Set(seasons?.map(s => s.winner).filter(Boolean)).size

  return (
    <div>
      {/* Page Header */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-72 h-72 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 text-center">
          <Breadcrumb items={[{ label: 'Teams' }]} />
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 gradient-text">IPL Franchises</h1>
          <p className="text-textSecondary text-lg max-w-xl mx-auto">
            {activeCount} teams competing in the world's premier T20 league
          </p>
        </div>
      </section>

      {/* Active Teams Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {active.map(team => {
            const titles = titleMap[team.name] || []
            const colors = TEAM_COLORS[team.name] || { primary: '#666', secondary: '#999' }

            return (
              <Link
                key={team.id}
                to={`/teams/${team.id}`}
                className="group block rounded-2xl border border-border overflow-hidden hover:-translate-y-1.5 transition-all duration-300"
                style={{
                  background: `linear-gradient(145deg, #131320 0%, ${colors.primary}12 100%)`,
                }}
              >
                <div
                  className="h-2 w-full"
                  style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}
                />
                <div className="p-5">
                  <div className="mb-2 group-hover:scale-105 transition-transform origin-left">
                    <TeamBadge team={team.name} size={64} />
                  </div>
                  <h3 className="font-semibold text-sm text-textPrimary mb-3">{team.name}</h3>
                  <div className="space-y-2 text-xs text-textSecondary">
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"/>
                        <circle cx="12" cy="11" r="3"/>
                      </svg>
                      {team.homeVenue}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M12 15l-3-3h6l-3 3z"/><circle cx="12" cy="12" r="10"/>
                      </svg>
                      {titles.length > 0 ? (
                        <span style={{ color: colors.primary }} className="font-semibold">
                          {titles.length} {titles.length === 1 ? 'Title' : 'Titles'}
                        </span>
                      ) : (
                        <span className="text-textSecondary">0 Titles</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                      {team.seasons?.length || 0} seasons
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="rounded-2xl border border-border bg-card p-6 grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
          <div>
            <div className="text-3xl font-extrabold gradient-text">{activeCount}</div>
            <div className="text-textSecondary text-sm mt-1">Active Franchises</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold gradient-text">{defunctCount}</div>
            <div className="text-textSecondary text-sm mt-1">Defunct Franchises</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold gradient-text">{totalSeasons}</div>
            <div className="text-textSecondary text-sm mt-1">Seasons Played</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold gradient-text">{uniqueChampions}</div>
            <div className="text-textSecondary text-sm mt-1">Different Champions</div>
          </div>
          <div>
            <div className="text-3xl font-extrabold gradient-text">{activeCount + defunctCount}</div>
            <div className="text-textSecondary text-sm mt-1">Total Franchises (All Time)</div>
          </div>
        </div>
      </section>

      {/* Defunct / Former Franchises */}
      {defunct.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mt-16 pb-16">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">Former & Defunct Franchises</h2>
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20">
              DEFUNCT
            </span>
          </div>
          <p className="text-textSecondary text-sm mb-8">
            Teams that played in the IPL but are no longer active.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {defunct.map(team => {
              const titles = titleMap[team.name] || []
              const colors = TEAM_COLORS[team.name] || { primary: '#666', secondary: '#999' }
              const meta = DEFUNCT_META[team.name]
              const statusColors: Record<string, string> = { red: 'bg-red-500/20 text-red-400 border-red-500/30', amber: 'bg-amber-500/20 text-amber-400 border-amber-500/30', blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30' }
              const noteColors: Record<string, string> = { red: 'text-red-400/70', amber: 'text-amber-400/70', blue: 'text-blue-400/70' }

              return (
                <Link
                  key={team.id}
                  to={`/teams/${team.id}`}
                  className="block rounded-2xl border border-border bg-card overflow-hidden cursor-pointer hover:-translate-y-1.5 transition-all duration-300 relative group"
                >
                  {meta && (
                    <div className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded-full border ${statusColors[meta.statusColor] || ''}`}>
                      {meta.status}
                    </div>
                  )}
                  <div
                    className="h-2"
                    style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` }}
                  />
                  <div className="p-5">
                    <div className="mb-3">
                      <TeamBadge team={team.name} size={56} />
                    </div>
                    <h3 className="font-semibold text-sm text-textPrimary mb-1">{team.name}</h3>
                    <div className="text-xs text-textSecondary mb-2">
                      {team.seasons?.[0]}&ndash;{team.seasons?.[team.seasons.length - 1]}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {titles.length > 0 ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300">
                          {titles.length} Title{titles.length > 1 ? 's' : ''} ({titles.join(', ')})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-zinc-500/10 text-zinc-400">0 Titles</span>
                      )}
                    </div>
                    {meta && (
                      <div className={`text-[10px] mt-2 ${noteColors[meta.statusColor] || 'text-textSecondary'}`}>
                        {meta.note}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
