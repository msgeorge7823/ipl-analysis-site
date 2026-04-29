// Schedule page (/schedule, /schedule/:year).
// Calendar-style view of fixtures + results for a season, with month
// pickers and a "today" jump anchor.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMatches, useSeasons } from '@/hooks/useData'
import Breadcrumb from '@/components/ui/Breadcrumb'
import TeamBadge from '@/components/ui/TeamBadge'
import { TEAM_SHORT, TEAM_COLORS } from '@/lib/constants'

export default function Schedule() {
  const { data: seasons } = useSeasons()
  const sorted = useMemo(() => seasons?.sort((a: any, b: any) => b.year.localeCompare(a.year)) || [], [seasons])
  const latestYear = sorted[0]?.year || '2026'

  const [selectedYear, setSelectedYear] = useState(latestYear)
  const [teamFilter, setTeamFilter] = useState('All Teams')
  const [venueFilter, setVenueFilter] = useState('All Venues')
  const [monthFilter, setMonthFilter] = useState<string | null>(null)

  const { data: matches, isLoading } = useMatches(selectedYear)

  const matchesSorted = useMemo(() =>
    matches?.sort((a: any, b: any) => a.date.localeCompare(b.date) || (a.matchNumber || 0) - (b.matchNumber || 0)) || [],
    [matches]
  )

  // Get unique venues/teams for filters
  const allTeams = useMemo(() => {
    const teams = new Set<string>()
    matchesSorted.forEach((m: any) => m.teams?.forEach((t: string) => teams.add(t)))
    return Array.from(teams).sort()
  }, [matchesSorted])

  const allVenues = useMemo(() => {
    const venues = new Set<string>()
    matchesSorted.forEach((m: any) => { if (m.venue) venues.add(m.venue) })
    return Array.from(venues).sort()
  }, [matchesSorted])

  // Available months
  const availableMonths = useMemo(() => {
    const months = new Set<string>()
    matchesSorted.forEach((m: any) => {
      if (m.date) {
        const dt = new Date(m.date)
        months.add(dt.toLocaleDateString('en-US', { month: 'short' }))
      }
    })
    return Array.from(months)
  }, [matchesSorted])

  // Filter matches
  const filteredMatches = useMemo(() => {
    return matchesSorted.filter((m: any) => {
      if (teamFilter !== 'All Teams') {
        const shortNames = m.teams?.map((t: string) => TEAM_SHORT[t] || t) || []
        if (!shortNames.includes(teamFilter) && !m.teams?.includes(teamFilter)) return false
      }
      if (venueFilter !== 'All Venues' && m.venue !== venueFilter) return false
      if (monthFilter) {
        const dt = new Date(m.date)
        const month = dt.toLocaleDateString('en-US', { month: 'short' })
        if (month !== monthFilter) return false
      }
      return true
    })
  }, [matchesSorted, teamFilter, venueFilter, monthFilter])

  // Group matches by date
  const groupedByDate = useMemo(() => {
    const groups: { date: string; matches: any[] }[] = []
    let currentDate = ''
    for (const match of filteredMatches) {
      if (match.date !== currentDate) {
        currentDate = match.date
        groups.push({ date: currentDate, matches: [] })
      }
      groups[groups.length - 1].matches.push(match)
    }
    return groups
  }, [filteredMatches])

  const today = new Date().toISOString().split('T')[0]

  const formatDateFull = (dateStr: string) => {
    const dt = new Date(dateStr)
    return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  const firstDate = matchesSorted[0]?.date || ''
  const lastDate = matchesSorted[matchesSorted.length - 1]?.date || ''
  const formatDateRange = (d: string) => {
    if (!d) return ''
    const dt = new Date(d)
    return dt.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <Breadcrumb items={[{ label: 'Schedule' }]} />
      {/* Page Header */}
      <section className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-medium text-accent">
                <Link to="/seasons" className="hover:underline">Seasons</Link> &rsaquo; IPL {selectedYear}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">IPL {selectedYear} Schedule</h1>
            <p className="text-textSecondary text-lg">
              {matchesSorted.length} Matches &middot; {allTeams.length} Teams &middot; {allVenues.length} Venues
              {firstDate && lastDate && ` \u00B7 ${formatDateRange(firstDate)} \u2013 ${formatDateRange(lastDate)}, ${selectedYear}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                className="appearance-none bg-card border border-border rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold text-white focus:outline-none focus:border-accent cursor-pointer"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {sorted.map((s: any) => (
                  <option key={s.year} value={s.year}>IPL {s.year}</option>
                ))}
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Season Archive Scroll */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-textSecondary uppercase tracking-wider mb-3">All Seasons Schedule Archive</h3>
          <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {sorted.map((s: any) => (
              <button
                key={s.year}
                onClick={() => setSelectedYear(s.year)}
                className={`flex-shrink-0 rounded-xl px-4 py-2.5 cursor-pointer transition ${
                  selectedYear === s.year
                    ? 'bg-accent/20 border border-accent'
                    : 'bg-card border border-border hover:border-accent/50'
                }`}
              >
                <div className={`text-sm font-bold whitespace-nowrap ${selectedYear === s.year ? 'text-accent' : 'text-white'}`}>
                  IPL {s.year}
                  {s.winner && selectedYear !== s.year && <span className="text-yellow-400 ml-1">{'\uD83C\uDFC6'}</span>}
                </div>
                <div className="text-xs text-textSecondary whitespace-nowrap">
                  {s.matchCount} matches
                  {s.winner && ` \u00B7 ${TEAM_SHORT[s.winner] || s.winner} won`}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 p-4 bg-card border border-border rounded-2xl">
          {/* Team Filter */}
          <div className="relative w-full sm:w-auto">
            <select
              className="appearance-none bg-bg border border-border rounded-lg px-4 py-2 pr-9 text-sm text-white focus:outline-none focus:border-accent cursor-pointer w-full sm:w-auto"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
            >
              <option>All Teams</option>
              {allTeams.map((t) => (
                <option key={t} value={TEAM_SHORT[t] || t}>{TEAM_SHORT[t] || t}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Venue Filter */}
          <div className="relative w-full sm:w-auto">
            <select
              className="appearance-none bg-bg border border-border rounded-lg px-4 py-2 pr-9 text-sm text-white focus:outline-none focus:border-accent cursor-pointer w-full sm:w-auto"
              value={venueFilter}
              onChange={(e) => setVenueFilter(e.target.value)}
            >
              <option>All Venues</option>
              {allVenues.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
            <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-textSecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className="w-px h-8 bg-border hidden sm:block" />

          {/* Month Chips */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs text-textSecondary mr-1 font-medium">Month:</span>
            <button
              onClick={() => setMonthFilter(null)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                !monthFilter ? 'bg-accent/20 text-accent border border-accent/40' : 'text-textSecondary border border-border hover:border-accent/40 hover:text-white'
              }`}
            >
              All
            </button>
            {availableMonths.map((month) => (
              <button
                key={month}
                onClick={() => setMonthFilter(month)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                  monthFilter === month ? 'bg-accent/20 text-accent border border-accent/40' : 'text-textSecondary border border-border hover:border-accent/40 hover:text-white'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loading */}
      {isLoading && (
        <div className="text-center py-16">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-textSecondary">Loading schedule...</p>
        </div>
      )}

      {/* Schedule List */}
      {!isLoading && (
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Match Schedule</h2>
            <span className="text-sm text-textSecondary">
              Showing {filteredMatches.length} of {matchesSorted.length} matches
            </span>
          </div>

          <div className="space-y-2">
            {groupedByDate.map((group) => {
              const isDoubleHeader = group.matches.length > 1
              const isToday = group.date === today

              return (
                <div key={group.date}>
                  {/* Date Header */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-6 pb-2">
                    <div className="text-xs sm:text-sm font-bold text-white bg-card border border-border px-3 sm:px-4 py-1.5 rounded-lg">
                      {formatDateFull(group.date)}
                    </div>
                    <div className="flex-1 h-px bg-border hidden sm:block" />
                    {isToday && (
                      <span className="text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full">Today</span>
                    )}
                    {isDoubleHeader && (
                      <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-500/20">
                        {'\u2694\uFE0F'} DOUBLE HEADER
                      </span>
                    )}
                    {group.date === firstDate && (
                      <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">Opening Day</span>
                    )}
                  </div>

                  {/* Match Cards */}
                  {group.matches.map((match: any) => {
                    const team1 = match.teams?.[0] || ''
                    const team2 = match.teams?.[1] || ''
                    const team1Short = TEAM_SHORT[team1] || team1
                    const team2Short = TEAM_SHORT[team2] || team2
                    const team1Color = TEAM_COLORS[team1]?.primary || '#6366f1'
                    const team2Color = TEAM_COLORS[team2]?.primary || '#6366f1'
                    const inn1 = match.innings?.[0]
                    const inn2 = match.innings?.[1]
                    // A match is "completed" when it has a decisive winner.
                    // No-result/abandoned matches are settled but have no
                    // winner — they need their own visual bucket so the UI
                    // doesn't lump them in with future fixtures.
                    const isCompleted = !!match.winner
                    const isNoResult = !match.winner && (match.result === 'no result' || match.abandoned === true)
                    const isMatchToday = match.date === today && !isCompleted && !isNoResult

                    return (
                      <Link
                        key={match.id}
                        to={`/matches/${match.id}`}
                        className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 bg-card border rounded-xl cursor-pointer transition-all hover:bg-cardHover hover:translate-x-1 ${
                          isMatchToday ? 'border-accent/30 shadow-[0_0_0_1px_rgba(99,102,241,0.3),0_0_20px_rgba(99,102,241,0.08)]' : 'border-border'
                        } ${isDoubleHeader && !isMatchToday ? 'bg-gradient-to-r from-amber-400/[0.03] to-transparent' : ''}`}
                      >
                        {/* Top row on mobile: Match # + Date + Status */}
                        <div className="flex items-center gap-3 sm:contents">
                          {/* Match Number */}
                          <div className="flex flex-col items-center w-16 flex-shrink-0">
                            <span className="text-[10px] font-bold text-textSecondary uppercase tracking-wider">Match</span>
                            <span className="text-xl font-extrabold text-white">{match.matchNumber || ''}</span>
                          </div>
                          <div className="w-px h-12 bg-border flex-shrink-0 hidden sm:block" />

                          {/* Time/Date */}
                          <div className="flex flex-col items-center w-24 flex-shrink-0">
                            <span className="text-sm font-semibold text-white">
                              {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                            <span className="text-[11px] text-textSecondary">
                              {isCompleted ? 'Completed' : isNoResult ? (match.abandoned ? 'Abandoned' : 'No Result') : 'Upcoming'}
                            </span>
                          </div>
                          <div className="w-px h-12 bg-border flex-shrink-0 hidden sm:block" />

                          {/* Status on mobile - shown inline */}
                          <div className="flex-shrink-0 ml-auto sm:hidden">
                            {isCompleted ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20">
                                {TEAM_SHORT[match.winner] || match.winner} won
                              </span>
                            ) : isNoResult ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/15 text-gray-400 border border-gray-500/20">
                                {match.abandoned ? 'Abandoned' : 'No Result'}
                              </span>
                            ) : isMatchToday ? (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
                                {'\u25CF'} Live
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                                Upcoming
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Teams */}
                        <div className="flex items-center gap-3 flex-1 min-w-0 flex-wrap">
                          <div className="flex items-center gap-2">
                            <TeamBadge team={team1} size={40} season={match.season} />
                            <span
                              className="text-sm font-bold"
                              style={{ color: match.winner === team1 ? team1Color : (isCompleted ? '#94a3b8' : '#fff') }}
                            >
                              {team1Short}
                            </span>
                          </div>

                          {isCompleted && inn1 && inn2 ? (
                            <div className="flex items-center gap-2 mx-2">
                              <span className="text-sm font-semibold text-white">
                                {inn1.runs}/{inn1.wickets}
                              </span>
                              <span className="text-xs text-textSecondary font-bold">vs</span>
                              <span className="text-sm font-semibold text-white">
                                {inn2.runs}/{inn2.wickets}
                              </span>
                            </div>
                          ) : (
                            <span className="text-lg font-black text-textSecondary mx-2">VS</span>
                          )}

                          <div className="flex items-center gap-2">
                            <TeamBadge team={team2} size={40} season={match.season} />
                            <span
                              className="text-sm font-bold"
                              style={{ color: match.winner === team2 ? team2Color : (isCompleted ? '#94a3b8' : '#fff') }}
                            >
                              {team2Short}
                            </span>
                          </div>
                        </div>

                        {/* Venue */}
                        <div className="hidden lg:flex items-center gap-2 text-right flex-shrink-0 max-w-[280px]">
                          <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-300">{match.venue}</span>
                            {match.city && <span className="text-xs text-textSecondary">{match.city}</span>}
                          </div>
                        </div>

                        {/* Status - desktop only */}
                        <div className="hidden sm:block flex-shrink-0 ml-4">
                          {isCompleted ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/15 text-green-400 border border-green-500/20">
                              {TEAM_SHORT[match.winner] || match.winner} won
                            </span>
                          ) : isNoResult ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/15 text-gray-400 border border-gray-500/20">
                              {match.abandoned ? 'Abandoned' : 'No Result'}
                            </span>
                          ) : isMatchToday ? (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 animate-pulse">
                              {'\u25CF'} Live
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/20">
                              Upcoming
                            </span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )
            })}

            {filteredMatches.length === 0 && !isLoading && (
              <div className="text-center py-16 text-textSecondary">
                <p className="text-lg">No matches found for the current filters.</p>
                <button
                  onClick={() => { setTeamFilter('All Teams'); setVenueFilter('All Venues'); setMonthFilter(null) }}
                  className="mt-4 text-accent hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      )}
    </main>
  )
}
