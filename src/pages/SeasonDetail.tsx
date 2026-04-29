// Season detail page (/seasons/:year).
// One-season hub: points table, schedule + results (via shared
// MatchListRow), playoff bracket (RoadToFinal), Orange / Purple Cap race,
// award winners, and per-team summaries.
import { Fragment, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import TeamBadge from '@/components/ui/TeamBadge'
import PlayerLink from '@/components/ui/PlayerLink'
import { useMatches, useSeasons, useCapRace, useReplacementPlayers } from '@/hooks/useData'
import { TEAM_SHORT, TEAM_COLORS } from '@/lib/constants'
import { isMatchTied } from '@/lib/matchResult'
import MatchListRow from '@/components/matches/MatchListRow'
import CapRaceChart from '@/components/charts/CapRaceChart'
import { computePointsTable } from '@/services/pointsTableService'
import RoadToFinal from '@/components/playoffs/RoadToFinal'

export default function SeasonDetail() {
  const { year } = useParams<{ year: string }>()
  const { data: matches, isLoading } = useMatches(year || '')
  const { data: seasons } = useSeasons()
  const { data: capRaceData } = useCapRace(year || '')
  const { data: replacementData } = useReplacementPlayers()
  const [showAllMatches, setShowAllMatches] = useState(false)
  const [capRaceMode, setCapRaceMode] = useState<'batting' | 'bowling'>('batting')
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set())

  const toggleTeam = (team: string) =>
    setExpandedTeams((prev) => {
      const next = new Set(prev)
      if (next.has(team)) next.delete(team)
      else next.add(team)
      return next
    })

  const season = seasons?.find((s: any) => s.year === year)
  const sorted = useMemo(() =>
    matches?.sort((a: any, b: any) => a.date.localeCompare(b.date) || (a.matchNumber || 0) - (b.matchNumber || 0)) || [],
    [matches]
  )

  // Per-venue host team, derived from league-stage frequencies in this season.
  // In a normal IPL each franchise plays ~7 home matches at their home ground
  // while any visitor plays only 1 — so the team with the most appearances at
  // a venue is its host, by a wide margin. Seasons played abroad (2009 SA,
  // 2020 UAE) or in a neutral bubble (2022 Maharashtra, parts of 2014/2021)
  // have no such margin — every visiting team shows up a similar number of
  // times — and we leave those venues unmapped so home/away labels are
  // suppressed downstream. Playoffs are excluded so a neutral final venue
  // doesn't poison the league-stage signal.
  const venueHostByVenue = useMemo(() => {
    const venueCounts = new Map<string, Map<string, number>>()
    for (const m of sorted as any[]) {
      if (m.playoffStage) continue
      const v = m.venue
      if (!v) continue
      if (!venueCounts.has(v)) venueCounts.set(v, new Map())
      const c = venueCounts.get(v)!
      for (const t of m.teams || []) c.set(t, (c.get(t) || 0) + 1)
    }
    const hosts = new Map<string, string>()
    for (const [venue, teamCounts] of venueCounts) {
      let firstTeam = ''
      let firstCount = 0
      let secondCount = 0
      for (const [team, n] of teamCounts) {
        if (n > firstCount) {
          secondCount = firstCount
          firstCount = n
          firstTeam = team
        } else if (n > secondCount) {
          secondCount = n
        }
      }
      // Home status requires a clear IPL-style margin: the host should have
      // played at least 4 matches at the venue AND at least 2 more than any
      // other visitor. Neutral-venue distributions (every team playing 1–3
      // times, spread evenly) fail this and the venue is left unmapped.
      if (firstCount >= 4 && firstCount >= secondCount + 2) {
        hosts.set(venue, firstTeam)
      }
    }
    return hosts
  }, [sorted])

  // Build points table from match data via the SHARED service so this page
  // and the Matches page never disagree on standings logic. Skipping
  // unplayed fixtures, the proper NRR calculation, the playoff exclusion
  // and the bowled-out 20-overs rule all live in pointsTableService.
  const pointsTable = useMemo(
    () => computePointsTable((sorted || []) as any),
    [sorted]
  )

  const seasonNumber = year ? parseInt(year) - 2008 + 1 : 0

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-textSecondary">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4">Loading season...</p>
      </div>
    )
  }

  const firstDate = sorted[0]?.date || ''
  const lastDate = sorted[sorted.length - 1]?.date || ''
  const formatDateShort = (d: string) => {
    if (!d) return ''
    const dt = new Date(d)
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const displayedMatches = showAllMatches ? sorted : sorted.slice(0, 20)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-900/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-3 md:px-4 pt-10 md:pt-16 pb-8 md:pb-12">
          <Breadcrumb items={[{ label: 'Seasons', path: '/seasons' }, { label: 'IPL ' + year }]} />
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-3">IPL {year}</h1>
          {season && (
            <>
              <p className="text-base md:text-xl text-accent font-medium mb-1">Tata IPL {year}</p>
              <p className="text-textSecondary text-sm md:text-lg">
                {firstDate && lastDate
                  ? `${formatDateShort(firstDate)} \u2013 ${formatDateShort(lastDate)}, ${year}`
                  : `${season.matchCount} matches`}
                {' \u00B7 '}
                {seasonNumber > 0 ? `${seasonNumber}${seasonNumber === 1 ? 'st' : seasonNumber === 2 ? 'nd' : seasonNumber === 3 ? 'rd' : 'th'} Season` : ''}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Champions / Season Overview cards
          (positive margin-top so they sit cleanly below the hero — earlier
          this used a negative margin which collided with the hero region) */}
      {season && (
        <section className="max-w-7xl mx-auto px-3 md:px-4 mt-6 md:mt-10 mb-10 md:mb-14">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {season.winner && (
              <div className="bg-card border border-border rounded-2xl p-4 md:p-8 glow flex items-center gap-4 md:gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl" />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/20 flex items-center justify-center p-2 flex-shrink-0">
                  <TeamBadge team={season.winner} season={year} className="w-full h-full bg-transparent" />
                </div>
                <div>
                  <p className="text-sm text-yellow-400 font-semibold uppercase tracking-wider mb-1">Champions</p>
                  <h3 className="text-2xl font-bold text-white">
                    <Link to={`/teams/${season.winner.replace(/\s+/g, '-').toLowerCase()}`} className="hover:text-yellow-300 transition">
                      {season.winner}
                    </Link>
                  </h3>
                  <p className="text-textSecondary text-sm mt-1">IPL {year} Title</p>
                </div>
              </div>
            )}
            {season.runnerUp && (
              <div className="bg-card border border-border rounded-2xl p-4 md:p-8 flex items-center gap-4 md:gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-400/5 rounded-full blur-2xl" />
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-400/20 to-gray-500/10 border border-gray-400/20 flex items-center justify-center p-2 flex-shrink-0">
                  <TeamBadge team={season.runnerUp} season={year} className="w-full h-full bg-transparent" />
                </div>
                <div>
                  <p className="text-sm text-gray-300 font-semibold uppercase tracking-wider mb-1">Runner-Up</p>
                  <h3 className="text-2xl font-bold text-white">
                    <Link to={`/teams/${season.runnerUp.replace(/\s+/g, '-').toLowerCase()}`} className="hover:text-gray-200 transition">
                      {season.runnerUp}
                    </Link>
                  </h3>
                  <p className="text-textSecondary text-sm mt-1">IPL {year} Finalist</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Award Cards */}
      {season && (
        <section className="max-w-7xl mx-auto px-3 md:px-4 mb-10 md:mb-16">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Season Awards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {season.orangeCap && (
              <div className="bg-card border border-border rounded-2xl p-6 hover:border-orange-500/30 transition group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <img src="/icons/cricket-bat.svg" alt="" className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">Orange Cap</p>
                    <p className="text-xs text-textSecondary">Most Runs</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1"><PlayerLink name={season.orangeCap.player} className="hover:text-amber-400 transition-colors" /></h3>
                <p className="text-3xl font-extrabold text-orange-400">
                  {season.orangeCap.runs} <span className="text-base font-medium text-textSecondary">runs</span>
                </p>
              </div>
            )}
            {season.purpleCap && (
              <div className="bg-card border border-border rounded-2xl p-6 hover:border-purple-500/30 transition group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <img src="/icons/cricket-ball.svg" alt="" className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-purple-400 font-semibold uppercase tracking-wider">Purple Cap</p>
                    <p className="text-xs text-textSecondary">Most Wickets</p>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-1"><PlayerLink name={season.purpleCap.player} className="hover:text-purple-400 transition-colors" /></h3>
                <p className="text-3xl font-extrabold text-purple-400">
                  {season.purpleCap.wickets} <span className="text-base font-medium text-textSecondary">wickets</span>
                </p>
              </div>
            )}
            <div className="bg-card border border-border rounded-2xl p-6 hover:border-accent/30 transition group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <span className="text-accent text-lg">{'\u2B50'}</span>
                </div>
                <div>
                  <p className="text-xs text-accent font-semibold uppercase tracking-wider">Season Summary</p>
                  <p className="text-xs text-textSecondary">Key Statistics</p>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{season.matchCount} Matches</h3>
              <p className="text-sm text-textSecondary mt-2">{season.teams?.length} teams competed in IPL {year}</p>
            </div>
          </div>
        </section>
      )}

      {/* Points Table */}
      {pointsTable.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 md:px-4 mb-10 md:mb-16">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Points Table</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-textSecondary text-xs uppercase tracking-wider">
                    <th className="text-left py-4 px-6 font-semibold">#</th>
                    <th className="text-left py-4 px-4 font-semibold">Team</th>
                    <th className="text-center py-4 px-4 font-semibold">M</th>
                    <th className="text-center py-4 px-4 font-semibold">W</th>
                    <th className="text-center py-4 px-4 font-semibold">L</th>
                    <th className="text-center py-4 px-4 font-semibold">T</th>
                    <th className="text-center py-4 px-4 font-semibold">NR</th>
                    <th className="text-center py-4 px-4 font-semibold">Pts</th>
                    <th className="text-center py-4 px-6 font-semibold">NRR</th>
                  </tr>
                </thead>
                <tbody>
                  {pointsTable.map((entry, idx) => {
                    const isTop4 = idx < 4
                    const isExpanded = expandedTeams.has(entry.team)
                    const teamColor = TEAM_COLORS[entry.team]?.primary || '#6366f1'
                    return (
                      <Fragment key={entry.team}>
                        <tr
                          onClick={() => toggleTeam(entry.team)}
                          aria-expanded={isExpanded}
                          className={`border-b border-border cursor-pointer transition ${
                            isExpanded
                              ? 'bg-accent/[0.08]'
                              : isTop4
                              ? 'bg-accent/[0.06] hover:bg-accent/[0.1]'
                              : 'hover:bg-white/[0.03]'
                          }`}
                          style={isTop4 ? { borderLeft: '3px solid #6366f1' } : undefined}
                        >
                          <td className="py-4 px-6 text-textSecondary font-medium">
                            <div className="flex items-center gap-2">
                              <ChevronDown
                                size={14}
                                className={`text-textSecondary/60 transition-transform ${
                                  isExpanded ? 'rotate-180 text-accent' : ''
                                }`}
                              />
                              {idx + 1}
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold">
                            <div className="flex items-center gap-3">
                              <TeamBadge team={entry.team} size={32} season={year} />
                              <Link
                                to={`/teams/${entry.team.replace(/\s+/g, '-').toLowerCase()}`}
                                onClick={(e) => e.stopPropagation()}
                                className="hover:text-accent transition truncate"
                                style={{ color: isTop4 ? '#fff' : '#cbd5e1' }}
                              >
                                {entry.team}
                              </Link>
                            </div>
                          </td>
                          <td className="text-center py-4 px-4 text-gray-300">{entry.played}</td>
                          <td className="text-center py-4 px-4 text-green-400 font-semibold">{entry.won}</td>
                          <td className="text-center py-4 px-4 text-red-400">{entry.lost}</td>
                          <td className="text-center py-4 px-4 text-textSecondary">{entry.tied}</td>
                          <td className="text-center py-4 px-4 text-textSecondary">{entry.noResult}</td>
                          <td className={`text-center py-4 px-4 font-bold text-base ${isTop4 ? 'text-white' : 'text-gray-300'}`}>
                            {entry.points}
                          </td>
                          <td className={`text-center py-4 px-6 font-mono ${entry.nrr >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {entry.nrr >= 0 ? '+' : ''}{entry.nrr.toFixed(3)}
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="bg-[#0a0a0f]/60">
                            <td colSpan={9} className="p-0 border-b border-border">
                              <TeamSeasonSchedule
                                team={entry.team}
                                matches={sorted}
                                venueHostByVenue={venueHostByVenue}
                                color={teamColor}
                              />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 md:px-6 py-3 border-t border-border flex flex-wrap items-center gap-2 md:gap-4 text-xs text-textSecondary">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent" />
                Qualified for Playoffs
              </span>
              <span className="break-words">M = Matches &middot; W = Won &middot; L = Lost &middot; NR = No Result &middot; Pts = Points &middot; NRR = Net Run Rate</span>
            </div>
          </div>
        </section>
      )}

      {/* Cap Race */}
      {capRaceData && (
        <section className="max-w-7xl mx-auto px-3 md:px-4 mb-10 md:mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white">Cap Race</h2>
            <div className="flex rounded-xl overflow-hidden border border-border">
              <button
                onClick={() => setCapRaceMode('batting')}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold transition-colors ${
                  capRaceMode === 'batting'
                    ? 'bg-orange-500/20 text-orange-400 border-r border-border'
                    : 'bg-card text-textSecondary hover:text-white border-r border-border'
                }`}
              >
                Orange Cap Race
              </button>
              <button
                onClick={() => setCapRaceMode('bowling')}
                className={`px-3 md:px-4 py-2 text-xs md:text-sm font-semibold transition-colors ${
                  capRaceMode === 'bowling'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'bg-card text-textSecondary hover:text-white'
                }`}
              >
                Purple Cap Race
              </button>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-3 md:p-6">
            <div className="h-[280px] md:h-[400px]">
              <CapRaceChart
                entries={capRaceMode === 'batting' ? capRaceData.batting : capRaceData.bowling}
                matchDates={capRaceData.matchDates}
                mode={capRaceMode}
              />
            </div>

            {/* Final standings table */}
            <div className="mt-6 border-t border-border pt-4">
              <h3 className="text-sm font-semibold text-textSecondary uppercase tracking-wider mb-3">
                {capRaceMode === 'batting' ? 'Orange Cap Standings' : 'Purple Cap Standings'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {(capRaceMode === 'batting' ? capRaceData.batting : capRaceData.bowling).map(
                  (entry: { player: string; progression: number[] }, idx: number) => {
                    const finalValue = entry.progression[entry.progression.length - 1] || 0
                    return (
                      <div
                        key={entry.player}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          idx === 0
                            ? capRaceMode === 'batting'
                              ? 'bg-orange-500/10 border border-orange-500/20'
                              : 'bg-purple-500/10 border border-purple-500/20'
                            : 'bg-white/[0.02]'
                        }`}
                      >
                        <span className="text-xs font-bold text-textSecondary w-5">#{idx + 1}</span>
                        <div className="min-w-0 flex-1">
                          <PlayerLink name={entry.player} className="text-sm font-medium text-white truncate block hover:text-indigo-400 transition-colors" />
                          <p className={`text-xs font-bold ${
                            capRaceMode === 'batting' ? 'text-orange-400' : 'text-purple-400'
                          }`}>
                            {finalValue} {capRaceMode === 'batting' ? 'runs' : 'wkts'}
                          </p>
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Replacement Players */}
      {replacementData && year && replacementData[year] && replacementData[year].length > 0 && (
        <section className="max-w-7xl mx-auto px-3 md:px-4 mb-10 md:mb-16">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="w-1 h-6 bg-amber-500 rounded-full" />
            <h2 className="text-xl md:text-2xl font-bold text-white">Replacement Players</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
              {replacementData[year].length} replacements
            </span>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="border-b border-border text-textSecondary text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-semibold">Replacement Player</th>
                  <th className="text-left px-5 py-3 font-semibold">Team</th>
                  <th className="text-left px-5 py-3 font-semibold">Replacing</th>
                  <th className="text-left px-5 py-3 font-semibold">Reason</th>
                  {replacementData[year].some((r: any) => r.price) && (
                    <th className="text-right px-5 py-3 font-semibold">Price</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {replacementData[year].map((r: any, i: number) => {
                  const teamColor = TEAM_COLORS[r.team]?.primary || '#6366f1'
                  return (
                    <tr key={i} className="border-b border-border/50 hover:bg-white/[0.02] transition">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 text-xs">★</span>
                          <span className="font-semibold text-white">{r.player}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="px-2 py-0.5 rounded-md text-xs font-bold"
                          style={{ backgroundColor: teamColor + '20', color: teamColor }}
                        >
                          {TEAM_SHORT[r.team] || r.team}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-textSecondary">{r.replacing}</td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs border border-red-500/20">
                          {r.reason}
                        </span>
                      </td>
                      {replacementData[year].some((rr: any) => rr.price) && (
                        <td className="px-5 py-3.5 text-right text-emerald-400 font-semibold text-xs">
                          {r.price ? `₹${r.price}` : '—'}
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            </div>
          </div>
        </section>
      )}

      {/* Match List */}
      <section className="max-w-7xl mx-auto px-3 md:px-4 mb-20">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-white">Matches</h2>
          <span className="text-sm text-textSecondary">
            {showAllMatches ? sorted.length : Math.min(20, sorted.length)} of {sorted.length} matches
          </span>
        </div>
        <div className="space-y-2">
          {displayedMatches.map((match: any) => (
            <MatchListRow key={match.id} match={match} season={year} />
          ))}
        </div>

        {/* Show More button */}
        {sorted.length > 20 && !showAllMatches && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAllMatches(true)}
              className="px-6 py-3 bg-card border border-border rounded-xl text-accent font-semibold hover:bg-cardHover transition-colors"
            >
              Show all {sorted.length} matches
            </button>
          </div>
        )}
      </section>

      {/* ── Road to the Final ── */}
      <section className="max-w-7xl mx-auto px-3 md:px-4 mb-12 md:mb-16">
        <RoadToFinal matches={(sorted || []) as any} season={year || ''} />
      </section>
    </div>
  )
}

function TeamSeasonSchedule({
  team,
  matches,
  venueHostByVenue,
  color,
}: {
  team: string
  matches: any[]
  venueHostByVenue: Map<string, string>
  color: string
}) {
  // Only league-stage fixtures: playoff matches belong to the knockout bracket,
  // not the team's round-robin schedule, and they're shown separately under
  // "Road to the Final".
  const teamMatches = useMemo(
    () =>
      matches
        .filter((m) => !m.playoffStage && (m.teams || []).includes(team))
        .slice()
        .sort((a, b) => {
          const ma = a.matchNumber ?? Number.MAX_SAFE_INTEGER
          const mb = b.matchNumber ?? Number.MAX_SAFE_INTEGER
          if (ma !== mb) return ma - mb
          return (a.date || '').localeCompare(b.date || '')
        }),
    [matches, team]
  )

  if (teamMatches.length === 0) {
    return (
      <div className="px-6 py-4 text-xs text-textSecondary italic">
        No league matches recorded for {team} this season.
      </div>
    )
  }

  return (
    <div className="px-4 sm:px-6 py-4 border-l-2" style={{ borderLeftColor: color }}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-textSecondary mb-3">
        {team} — League Matches ({teamMatches.length})
      </div>
      <div className="space-y-1.5">
        {teamMatches.map((m) => (
          <ScheduleLine
            key={m.id}
            match={m}
            team={team}
            venueHost={venueHostByVenue.get(m.venue)}
          />
        ))}
      </div>
    </div>
  )
}

function ScheduleLine({
  match,
  team,
  venueHost,
}: {
  match: any
  team: string
  /** The franchise that hosts this venue in this season, or undefined if the
   *  venue is neutral (no clear host — e.g. 2009 SA, 2020 UAE, 2022 bubble).
   *  When undefined, we suppress the Home/Away pill entirely. */
  venueHost: string | undefined
}) {
  const homeStatus: 'home' | 'away' | null =
    venueHost === undefined ? null : venueHost === team ? 'home' : 'away'
  const opponent = (match.teams || []).find((t: string) => t !== team) || 'Opponent'
  const oppShort = TEAM_SHORT[opponent] || opponent
  const oppColor = TEAM_COLORS[opponent]?.primary || '#6366f1'
  // No-result and abandoned matches are both "played but no winner". Future
  // fixtures have neither — those should render as Upcoming.
  const isAbandoned = match.abandoned === true || match.result === 'no result'
  const isPlayed = !!match.winner || isAbandoned
  const isWin = !!match.winner && match.winner === team

  let resultText: string
  let resultTone: 'win' | 'loss' | 'neutral' | 'upcoming'
  if (!isPlayed) {
    resultText = 'Upcoming'
    resultTone = 'upcoming'
  } else if (isAbandoned) {
    resultText = 'No Result'
    resultTone = 'neutral'
  } else if (isMatchTied(match)) {
    resultText = isWin ? 'Won (Super Over)' : 'Lost (Super Over)'
    resultTone = isWin ? 'win' : 'loss'
  } else {
    const prefix = isWin ? 'Won' : 'Lost'
    const m = match.winMargin
    if (m?.runs && m.runs > 0) resultText = `${prefix} by ${m.runs} runs`
    else if (m?.wickets && m.wickets > 0) resultText = `${prefix} by ${m.wickets} wkts`
    else resultText = prefix
    resultTone = isWin ? 'win' : 'loss'
  }

  const resultClass =
    resultTone === 'win'
      ? 'text-green-400'
      : resultTone === 'loss'
      ? 'text-red-400'
      : resultTone === 'upcoming'
      ? 'text-accent'
      : 'text-textSecondary'

  return (
    <Link
      to={`/matches/${match.id}`}
      onClick={(e) => e.stopPropagation()}
      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#131320]/60 border border-border/60 hover:border-accent/40 hover:bg-[#131320] transition-colors"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span className="text-sm text-textSecondary">vs</span>
        <TeamBadge team={opponent} size={24} season={match.season} />
        <span className="text-sm font-semibold truncate" style={{ color: oppColor }}>
          {oppShort}
        </span>
      </div>
      {homeStatus && (
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
            homeStatus === 'home'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              : 'bg-slate-500/15 text-slate-300 border border-slate-500/20'
          }`}
        >
          {homeStatus === 'home' ? 'Home' : 'Away'}
        </span>
      )}
      <span className={`text-xs sm:text-sm font-semibold ${resultClass}`}>{resultText}</span>
    </Link>
  )
}
