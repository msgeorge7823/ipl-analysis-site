// Venue detail page (/venues/:name).
// Per-ground summary: pitch character, hosting history, win-rate splits
// by team / toss decision, embedded map, and weather snapshot.
import { useParams, Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useVenues, useSeasons, useMatches } from '@/hooks/useData'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { TEAM_SHORT } from '@/lib/constants'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import VenueMap from '@/components/venue/VenueMap'
import { MapPin } from 'lucide-react'

export default function VenueDetail() {
  const { name } = useParams<{ name: string }>()
  const decodedName = decodeURIComponent(name || '')
  const { data: venues } = useVenues()
  const { data: seasons } = useSeasons()
  const [showAllMatches, setShowAllMatches] = useState(false)

  const venue = venues?.find((v: any) => v.name === decodedName)
  const allYears = seasons?.map((s: any) => s.year).sort((a: string, b: string) => b.localeCompare(a)) || []

  // Load recent seasons to find matches at this venue
  const recentYears = allYears.slice(0, 5)
  const matchQueries = recentYears.map((year: string) => ({
    year,
    ...useMatches(year),
  }))

  const allVenueMatches = useMemo(() => {
    const matches: any[] = []
    for (const q of matchQueries) {
      if (q.data) {
        const venueMatches = q.data.filter((m: any) => m.venue === decodedName)
        matches.push(...venueMatches)
      }
    }
    return matches.sort((a: any, b: any) => b.date.localeCompare(a.date))
  }, [matchQueries, decodedName])

  const venueMatches = showAllMatches ? allVenueMatches : allVenueMatches.slice(0, 20)

  // Team performance at this venue
  const teamPerformance = useMemo(() => {
    const stats: Record<string, { matches: number; wins: number }> = {}
    for (const match of allVenueMatches) {
      const inn1 = match.innings?.[0]
      const inn2 = match.innings?.[1]
      const team1 = inn1?.team
      const team2 = inn2?.team
      if (!team1 || !team2) continue

      if (!stats[team1]) stats[team1] = { matches: 0, wins: 0 }
      if (!stats[team2]) stats[team2] = { matches: 0, wins: 0 }
      stats[team1].matches++
      stats[team2].matches++
      if (match.winner === team1) stats[team1].wins++
      if (match.winner === team2) stats[team2].wins++
    }
    return Object.entries(stats)
      .map(([team, s]) => ({
        team,
        short: TEAM_SHORT[team] || team,
        matches: s.matches,
        wins: s.wins,
        losses: s.matches - s.wins,
        winPct: s.matches > 0 ? Math.round((s.wins / s.matches) * 100) : 0,
      }))
      .sort((a, b) => b.winPct - a.winPct || b.matches - a.matches)
  }, [allVenueMatches])

  // Toss decision analysis
  const tossAnalysis = useMemo(() => {
    let batFirst = 0
    let fieldFirst = 0
    for (const match of allVenueMatches) {
      if (match.tossDecision === 'bat') batFirst++
      else if (match.tossDecision === 'field') fieldFirst++
    }
    const total = batFirst + fieldFirst
    return { batFirst, fieldFirst, total }
  }, [allVenueMatches])

  // Highest scores at venue
  const highestScores = useMemo(() => {
    const scores: { team: string; runs: number; wickets: number; overs: string; opponent: string; date: string; matchId: string }[] = []
    for (const match of allVenueMatches) {
      for (const inn of match.innings || []) {
        const opponent = (match.innings || []).find((i: any) => i.team !== inn.team)?.team || 'Unknown'
        scores.push({
          team: inn.team,
          runs: inn.runs,
          wickets: inn.wickets,
          overs: inn.overs,
          opponent,
          date: match.date,
          matchId: match.id,
        })
      }
    }
    return scores.sort((a, b) => b.runs - a.runs).slice(0, 5)
  }, [allVenueMatches])

  // If venues have loaded but this venue doesn't exist, show error
  if (venues && !venue) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <ErrorState
          message={`Venue "${decodedName}" was not found in the database.`}
        />
        <div className="text-center mt-2">
          <Link to="/venues" className="text-accent hover:underline text-sm font-medium">
            Back to all venues
          </Link>
        </div>
      </div>
    )
  }

  // Still loading venues
  if (!venue) {
    return <LoadingSpinner size="lg" text="Loading venue..." />
  }

  // Calculate derived stats
  const battingFriendliness = Math.round((venue.avgFirstInningsScore / 200) * 100)
  const winBatFirst = allVenueMatches.length > 0
    ? Math.round((allVenueMatches.filter((m: any) => m.winner === m.innings?.[0]?.team).length / allVenueMatches.length) * 100)
    : 50

  return (
    <div className="min-h-screen">
      {/* Hero Image Area */}
      <section className="relative h-56 sm:h-72 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.08] via-[#0a0a0f]/60 to-[#0a0a0f]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0f] via-transparent to-[#0a0a0f]" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(99,102,241,0.1) 40px, rgba(99,102,241,0.1) 41px)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0f] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 h-full flex items-end pb-5 sm:pb-10">
          <div>
            <Breadcrumb items={[{ label: 'Venues', path: '/venues' }, { label: venue.name }]} />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2 break-words">{venue.name}</h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-400 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              {venue.city}
            </p>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mb-8 sm:mb-12 -mt-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-2xl p-3 sm:p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Matches</p>
            <p className="text-2xl font-bold text-white">{venue.matchCount}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3 sm:p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Avg 1st Innings</p>
            <p className="text-2xl font-bold text-emerald-400">{venue.avgFirstInningsScore}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3 sm:p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Avg 2nd Innings</p>
            <p className="text-2xl font-bold text-blue-400">{venue.avgSecondInningsScore}</p>
          </div>
          <div className="bg-card border border-border rounded-2xl p-3 sm:p-5 text-center">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Win % Batting 1st</p>
            <p className="text-2xl font-bold text-amber-400">{winBatFirst}%</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Venue Statistics</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Avg 1st Innings</p>
                <p className="text-3xl font-extrabold text-white">{venue.avgFirstInningsScore}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Avg 2nd Innings</p>
                <p className="text-3xl font-extrabold text-white">{venue.avgSecondInningsScore}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Win % Batting First</p>
                <p className="text-3xl font-extrabold text-accent">{winBatFirst}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Total IPL Matches</p>
                <p className="text-3xl font-extrabold text-white">{venue.matchCount}</p>
              </div>
            </div>
          </div>

          {/* Pitch Friendliness Bars */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">Pitch Friendliness</h3>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white font-medium">Batting Friendliness</span>
                  <span className="text-sm text-emerald-400 font-bold">{battingFriendliness}%</span>
                </div>
                <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-1000" style={{ width: `${battingFriendliness}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white font-medium">Pace Friendliness</span>
                  <span className="text-sm text-blue-400 font-bold">
                    {Math.round(100 - (venue.avgFirstInningsScore - 140) * 1.2)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000" style={{ width: `${Math.min(Math.round(100 - (venue.avgFirstInningsScore - 140) * 1.2), 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white font-medium">Spin Friendliness</span>
                  <span className="text-sm text-amber-400 font-bold">
                    {Math.max(10, Math.round(100 - battingFriendliness * 0.8))}%
                  </span>
                </div>
                <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400 transition-all duration-1000" style={{ width: `${Math.max(10, Math.round(100 - battingFriendliness * 0.8))}%` }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white font-medium">Dew Factor</span>
                  <span className="text-sm text-cyan-400 font-bold">
                    {Math.round((venue.avgSecondInningsScore / venue.avgFirstInningsScore) * 80)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-border rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-1000" style={{ width: `${Math.round((venue.avgSecondInningsScore / venue.avgFirstInningsScore) * 80)}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toss Decision Analysis */}
      {tossAnalysis.total > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Toss Decision Analysis</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Total Toss Decisions</p>
              <p className="text-3xl font-extrabold text-white">{tossAnalysis.total}</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Chose to Bat First</p>
              <p className="text-3xl font-extrabold text-emerald-400">{tossAnalysis.batFirst}</p>
              <p className="text-sm text-gray-500 mt-1">
                {tossAnalysis.total > 0 ? Math.round((tossAnalysis.batFirst / tossAnalysis.total) * 100) : 0}% of tosses
              </p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 text-center">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/></svg>
              </div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Chose to Field First</p>
              <p className="text-3xl font-extrabold text-blue-400">{tossAnalysis.fieldFirst}</p>
              <p className="text-sm text-gray-500 mt-1">
                {tossAnalysis.total > 0 ? Math.round((tossAnalysis.fieldFirst / tossAnalysis.total) * 100) : 0}% of tosses
              </p>
            </div>
          </div>
          {/* Visual bar */}
          <div className="mt-4 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-4 mb-3">
              <span className="text-sm text-emerald-400 font-semibold">Bat First</span>
              <span className="flex-1" />
              <span className="text-sm text-blue-400 font-semibold">Field First</span>
            </div>
            <div className="w-full h-6 bg-border rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-700 flex items-center justify-center"
                style={{ width: `${tossAnalysis.total > 0 ? (tossAnalysis.batFirst / tossAnalysis.total) * 100 : 50}%` }}
              >
                {tossAnalysis.batFirst > 0 && (
                  <span className="text-xs font-bold text-white drop-shadow">{Math.round((tossAnalysis.batFirst / tossAnalysis.total) * 100)}%</span>
                )}
              </div>
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-700 flex items-center justify-center"
                style={{ width: `${tossAnalysis.total > 0 ? (tossAnalysis.fieldFirst / tossAnalysis.total) * 100 : 50}%` }}
              >
                {tossAnalysis.fieldFirst > 0 && (
                  <span className="text-xs font-bold text-white drop-shadow">{Math.round((tossAnalysis.fieldFirst / tossAnalysis.total) * 100)}%</span>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Team Performance at Venue */}
      {teamPerformance.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Team Performance at this Venue</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-gray-500 text-xs uppercase tracking-wider">
                    <th className="text-left py-4 px-6 font-semibold">Team</th>
                    <th className="text-center py-4 px-4 font-semibold">Matches</th>
                    <th className="text-center py-4 px-4 font-semibold">Wins</th>
                    <th className="text-center py-4 px-4 font-semibold">Losses</th>
                    <th className="text-center py-4 px-6 font-semibold">Win %</th>
                  </tr>
                </thead>
                <tbody>
                  {teamPerformance.map((t) => (
                    <tr key={t.team} className="border-b border-border hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                            <span className="text-[10px] font-black text-accent">{t.short}</span>
                          </div>
                          <span className="font-semibold text-white">{t.short}</span>
                        </div>
                      </td>
                      <td className="text-center py-3.5 px-4 text-gray-300 font-medium">{t.matches}</td>
                      <td className="text-center py-3.5 px-4 text-emerald-400 font-bold">{t.wins}</td>
                      <td className="text-center py-3.5 px-4 text-red-400 font-medium">{t.losses}</td>
                      <td className="text-center py-3.5 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-16 h-2 bg-border rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-400"
                              style={{ width: `${t.winPct}%` }}
                            />
                          </div>
                          <span className="text-white font-bold text-xs">{t.winPct}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Highest Scores at Venue */}
      {highestScores.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Highest Team Totals at this Venue</h2>
          <div className="space-y-3">
            {highestScores.map((s, i) => {
              const maxRuns = highestScores[0]?.runs || 1
              return (
                <Link
                  key={`${s.matchId}-${s.team}`}
                  to={`/matches/${s.matchId}`}
                  className="block bg-card border border-border rounded-2xl p-5 hover:border-accent/20 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-extrabold text-accent">#{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="min-w-0">
                          <span className="font-bold text-white">{TEAM_SHORT[s.team] || s.team}</span>
                          <span className="text-gray-500 mx-2">vs</span>
                          <span className="text-gray-400">{TEAM_SHORT[s.opponent] || s.opponent}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-lg sm:text-xl font-extrabold text-white">{s.runs}/{s.wickets}</span>
                          <span className="text-xs text-gray-500 ml-1">({s.overs})</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent to-emerald-400 transition-all duration-700"
                          style={{ width: `${(s.runs / maxRuns) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">{s.date}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* Recent Matches */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Matches at this Venue</h2>
          {allVenueMatches.length > 20 && (
            <button
              onClick={() => setShowAllMatches(!showAllMatches)}
              className="px-4 py-2 bg-card border border-border rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:border-accent/30 transition"
            >
              {showAllMatches ? `Show Recent 20` : `Show All (${allVenueMatches.length})`}
            </button>
          )}
        </div>
        <div className="space-y-4">
          {venueMatches.length === 0 && matchQueries.some((q: any) => q.isLoading) && (
            <LoadingSpinner text="Loading recent matches..." />
          )}
          {venueMatches.length === 0 && !matchQueries.some((q: any) => q.isLoading) && (
            <EmptyState
              title="No recent matches found"
              description="There are no recorded matches at this venue in recent seasons."
            />
          )}
          {venueMatches.map((match: any) => {
            const inn1 = match.innings?.[0]
            const inn2 = match.innings?.[1]
            const team1 = inn1?.team || ''
            const team2 = inn2?.team || ''
            const short1 = TEAM_SHORT[team1] || team1
            const short2 = TEAM_SHORT[team2] || team2

            return (
              <Link
                key={match.id}
                to={`/matches/${match.id}`}
                className="block bg-card border border-border rounded-2xl p-5 hover:border-accent/20 transition"
              >
                <div className="flex items-center justify-between flex-wrap gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-6 flex-1 min-w-0">
                    <div className="text-right min-w-[80px] sm:min-w-[120px]">
                      <p className="font-bold text-white text-sm sm:text-base">{short1}</p>
                      {inn1 && (
                        <p className="text-base sm:text-lg font-extrabold text-white">
                          {inn1.runs}/{inn1.wickets}{' '}
                          <span className="text-xs text-gray-500 font-normal">({inn1.overs})</span>
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-2 sm:px-3 py-1 bg-border/50 rounded-full shrink-0">vs</div>
                    <div className="min-w-[80px] sm:min-w-[120px]">
                      <p className="font-bold text-white text-sm sm:text-base">{short2}</p>
                      {inn2 && (
                        <p className="text-base sm:text-lg font-extrabold text-white">
                          {inn2.runs}/{inn2.wickets}{' '}
                          <span className="text-xs text-gray-500 font-normal">({inn2.overs})</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="w-full sm:w-auto text-left sm:text-right">
                    {match.winner && match.winMargin && (
                      <p className="text-sm text-emerald-400 font-semibold">
                        {TEAM_SHORT[match.winner] || match.winner} won by{' '}
                        {match.winMargin.runs ? `${match.winMargin.runs} runs` : `${match.winMargin.wickets} wickets`}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{match.date}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Location ── (same map embed used on the matches page) */}
      <section>
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-accent" />
          Location
        </h2>
        <VenueMap venue={venue.name} city={venue.city} height={320} />
      </section>
    </div>
  )
}
