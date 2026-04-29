// Records page (/records).
// All-time leaderboards: most runs, most wickets, highest individual
// scores, biggest wins, fastest hundreds, Orange/Purple Cap winners, etc.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePlayerStats, useSeasons, useCapRace, useMatches } from '@/hooks/useData'
import Breadcrumb from '@/components/ui/Breadcrumb'
import PlayerLink from '@/components/ui/PlayerLink'
import { Search, ChevronDown, Trophy, TrendingUp } from 'lucide-react'
import CapRaceChart from '@/components/charts/CapRaceChart'

type Tab = 'batting' | 'bowling' | 'fielding'
type CapMode = 'batting' | 'bowling'

export default function Records() {
  const { data: stats, isLoading } = usePlayerStats()
  const { data: seasons } = useSeasons()
  const [tab, setTab] = useState<Tab>('batting')
  const [searchQuery, setSearchQuery] = useState('')
  const sortedSeasons = useMemo(
    () => [...(seasons || [])].sort((a: any, b: any) => b.year.localeCompare(a.year)),
    [seasons],
  )

  // Cap race state
  const latestSeason = sortedSeasons[0]?.year || ''
  const [capSeason, setCapSeason] = useState('')
  const selectedCapSeason = capSeason || latestSeason
  const [capMode, setCapMode] = useState<CapMode>('batting')
  const { data: capRaceData, isLoading: capLoading } = useCapRace(selectedCapSeason)
  const { data: matchesForSeason } = useMatches(selectedCapSeason)

  // Derive season highlights from matches + seasons data
  const seasonHighlights = useMemo(() => {
    if (!sortedSeasons.length) return []
    return sortedSeasons.map((s: any) => ({
      year: s.year,
      orangeCapPlayer: s.orangeCap?.player || '-',
      orangeCapRuns: s.orangeCap?.runs ?? '-',
      purpleCapPlayer: s.purpleCap?.player || '-',
      purpleCapWickets: s.purpleCap?.wickets ?? '-',
    }))
  }, [sortedSeasons])

  // Derive highest/lowest team total for selected cap-race season
  const teamTotalExtremes = useMemo(() => {
    if (!matchesForSeason?.length) return null
    let highest = { runs: 0, wickets: 0, overs: 0, team: '', opponent: '', date: '' }
    let lowest = { runs: 9999, wickets: 0, overs: 0, team: '', opponent: '', date: '' }
    for (const m of matchesForSeason) {
      if (!m.innings) continue
      for (const inn of m.innings) {
        const opponent = m.teams?.find((t: string) => t !== inn.team) || ''
        if (inn.runs > highest.runs) {
          highest = { runs: inn.runs, wickets: inn.wickets, overs: inn.overs, team: inn.team, opponent, date: m.date }
        }
        if (inn.runs < lowest.runs) {
          lowest = { runs: inn.runs, wickets: inn.wickets, overs: inn.overs, team: inn.team, opponent, date: m.date }
        }
      }
    }
    return highest.runs > 0 ? { highest, lowest } : null
  }, [matchesForSeason])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const all = stats || []
  const query = searchQuery.trim().toLowerCase()

  const filterBySearch = (data: any[]) => {
    if (!query) return data
    return data.filter(p => p.playerName.toLowerCase().includes(query))
  }

  const battingRecords = [
    { title: 'Most Runs', data: filterBySearch([...all].sort((a, b) => b.runs - a.runs).slice(0, 25)), col: 'runs', label: 'Runs', extra: 'strikeRate', extraLabel: 'SR' },
    { title: 'Highest Average (min 30 inn)', data: filterBySearch([...all].filter(p => p.inningsBat >= 30).sort((a, b) => b.battingAvg - a.battingAvg).slice(0, 25)), col: 'battingAvg', label: 'Avg', extra: 'runs', extraLabel: 'Runs' },
    { title: 'Highest Strike Rate (min 500 balls)', data: filterBySearch([...all].filter(p => p.ballsFaced >= 500).sort((a, b) => b.strikeRate - a.strikeRate).slice(0, 25)), col: 'strikeRate', label: 'SR', extra: 'runs', extraLabel: 'Runs' },
    { title: 'Most Sixes', data: filterBySearch([...all].sort((a, b) => b.sixes - a.sixes).slice(0, 25)), col: 'sixes', label: '6s', extra: 'runs', extraLabel: 'Runs' },
    { title: 'Most Fours', data: filterBySearch([...all].sort((a, b) => b.fours - a.fours).slice(0, 25)), col: 'fours', label: '4s', extra: 'runs', extraLabel: 'Runs' },
    { title: 'Most Hundreds', data: filterBySearch([...all].filter(p => p.hundreds > 0).sort((a, b) => b.hundreds - a.hundreds).slice(0, 25)), col: 'hundreds', label: '100s', extra: 'runs', extraLabel: 'Runs' },
    { title: 'Most Fifties', data: filterBySearch([...all].sort((a, b) => b.fifties - a.fifties).slice(0, 25)), col: 'fifties', label: '50s', extra: 'runs', extraLabel: 'Runs' },
  ]

  const bowlingRecords = [
    { title: 'Most Wickets', data: filterBySearch([...all].sort((a, b) => b.wickets - a.wickets).slice(0, 25)), col: 'wickets', label: 'Wkts', extra: 'economy', extraLabel: 'Econ' },
    { title: 'Best Economy (min 300 balls)', data: filterBySearch([...all].filter(p => p.ballsBowled >= 300).sort((a, b) => a.economy - b.economy).slice(0, 25)), col: 'economy', label: 'Econ', extra: 'wickets', extraLabel: 'Wkts' },
    { title: 'Best Bowling Average (min 20 wkts)', data: filterBySearch([...all].filter(p => p.wickets >= 20).sort((a, b) => a.bowlingAvg - b.bowlingAvg).slice(0, 25)), col: 'bowlingAvg', label: 'Avg', extra: 'wickets', extraLabel: 'Wkts' },
    { title: 'Most 3-Wicket Hauls', data: filterBySearch([...all].filter(p => p.threeWickets > 0).sort((a, b) => b.threeWickets - a.threeWickets).slice(0, 25)), col: 'threeWickets', label: '3W', extra: 'wickets', extraLabel: 'Wkts' },
    { title: 'Most Dot Balls', data: filterBySearch([...all].sort((a, b) => b.dots - a.dots).slice(0, 25)), col: 'dots', label: 'Dots', extra: 'wickets', extraLabel: 'Wkts' },
    { title: 'Most Maidens', data: filterBySearch([...all].filter(p => p.maidens > 0).sort((a, b) => b.maidens - a.maidens).slice(0, 25)), col: 'maidens', label: 'Maidens', extra: 'wickets', extraLabel: 'Wkts' },
  ]

  const fieldingRecords = [
    { title: 'Most Catches', data: filterBySearch([...all].sort((a, b) => b.catches - a.catches).slice(0, 25)), col: 'catches', label: 'Catches', extra: 'matches', extraLabel: 'Mat' },
    { title: 'Most Stumpings', data: filterBySearch([...all].filter(p => p.stumpings > 0).sort((a, b) => b.stumpings - a.stumpings).slice(0, 25)), col: 'stumpings', label: 'Stumpings', extra: 'matches', extraLabel: 'Mat' },
    { title: 'Most Run Outs', data: filterBySearch([...all].filter(p => p.runOuts > 0).sort((a, b) => b.runOuts - a.runOuts).slice(0, 25)), col: 'runOuts', label: 'Run Outs', extra: 'matches', extraLabel: 'Mat' },
  ]

  const records = tab === 'batting' ? battingRecords : tab === 'bowling' ? bowlingRecords : fieldingRecords
  const accentColor = tab === 'batting' ? '#f97316' : tab === 'bowling' ? '#a855f7' : '#22c55e'

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: 'Records' }]} />
      {/* Page Title */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Records & Milestones</h1>
          <p className="text-[#94a3b8] text-sm mt-1">All-time IPL records, cap races, and historic performances</p>
        </div>
      </div>

      {/* ─── Cap Race Visualization ─── */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp size={20} className="text-accent" />
          <h2 className="text-xl font-bold text-white">Cap Race</h2>
        </div>

        {/* Controls: season selector + mode toggle */}
        <div className="flex flex-wrap items-center gap-4 mb-5">
          {/* Season Selector */}
          <div className="relative">
            <select
              value={selectedCapSeason}
              onChange={e => setCapSeason(e.target.value)}
              className="appearance-none bg-[#131320] border border-[#1e1e3a] rounded-lg pl-4 pr-10 py-2.5 text-sm text-white font-semibold focus:outline-none focus:border-accent cursor-pointer"
            >
              {sortedSeasons.map((s: any) => (
                <option key={s.year} value={s.year}>
                  IPL {s.year}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
          </div>

          {/* Mode Toggle */}
          <div className="flex rounded-xl overflow-hidden border border-[#1e1e3a]">
            <button
              onClick={() => setCapMode('batting')}
              className={`px-5 py-2.5 text-sm font-semibold transition-colors ${
                capMode === 'batting'
                  ? 'bg-orange-500/20 text-orange-400'
                  : 'bg-[#131320] text-[#94a3b8] hover:text-white'
              }`}
            >
              Orange Cap Race
            </button>
            <button
              onClick={() => setCapMode('bowling')}
              className={`px-5 py-2.5 text-sm font-semibold transition-colors border-l border-[#1e1e3a] ${
                capMode === 'bowling'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'bg-[#131320] text-[#94a3b8] hover:text-white'
              }`}
            >
              Purple Cap Race
            </button>
          </div>
        </div>

        {/* Chart */}
        {capLoading ? (
          <div className="bg-[#131320] rounded-xl border border-[#1e1e3a] h-[400px] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        ) : capRaceData ? (
          <div className="bg-[#131320] rounded-xl border border-[#1e1e3a] p-6">
            <div className="h-[400px]">
              <CapRaceChart
                entries={capMode === 'batting' ? capRaceData.batting : capRaceData.bowling}
                matchDates={capRaceData.matchDates}
                mode={capMode}
              />
            </div>

            {/* Final standings */}
            <div className="mt-6 border-t border-[#1e1e3a] pt-4">
              <h3 className="text-sm font-semibold text-[#94a3b8] uppercase tracking-wider mb-3">
                {capMode === 'batting' ? 'Orange Cap Standings' : 'Purple Cap Standings'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {(capMode === 'batting' ? capRaceData.batting : capRaceData.bowling).map(
                  (entry: { player: string; progression: number[] }, idx: number) => {
                    const finalValue = entry.progression[entry.progression.length - 1] || 0
                    return (
                      <div
                        key={entry.player}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          idx === 0
                            ? capMode === 'batting'
                              ? 'bg-orange-500/10 border border-orange-500/20'
                              : 'bg-purple-500/10 border border-purple-500/20'
                            : 'bg-white/[0.02]'
                        }`}
                      >
                        <span className="text-xs font-bold text-[#94a3b8] w-5">#{idx + 1}</span>
                        <div className="min-w-0 flex-1">
                          <PlayerLink name={entry.player} className="text-sm font-medium text-white truncate block hover:text-indigo-400 transition-colors" />
                          <p className={`text-xs font-bold ${
                            capMode === 'batting' ? 'text-orange-400' : 'text-purple-400'
                          }`}>
                            {finalValue} {capMode === 'batting' ? 'runs' : 'wkts'}
                          </p>
                        </div>
                      </div>
                    )
                  }
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#131320] rounded-xl border border-[#1e1e3a] p-8 text-center text-[#94a3b8] text-sm">
            No cap race data available for IPL {selectedCapSeason}.
          </div>
        )}
      </section>

      {/* ─── Season Records ─── */}
      <section className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <Trophy size={20} className="text-amber-400" />
          <h2 className="text-xl font-bold text-white">Season Records</h2>
        </div>

        {/* Team totals for selected season */}
        {teamTotalExtremes && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-[#131320] rounded-xl border border-[#1e1e3a] p-5">
              <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
                Highest Team Total &mdash; IPL {selectedCapSeason}
              </p>
              <p className="text-2xl font-extrabold text-green-400">
                {teamTotalExtremes.highest.runs}/{teamTotalExtremes.highest.wickets}
                <span className="text-sm text-[#94a3b8] font-medium ml-2">
                  ({teamTotalExtremes.highest.overs} ov)
                </span>
              </p>
              <p className="text-sm text-white mt-1">
                {teamTotalExtremes.highest.team}
                <span className="text-[#94a3b8]"> vs </span>
                {teamTotalExtremes.highest.opponent}
              </p>
              <p className="text-xs text-[#94a3b8] mt-0.5">{teamTotalExtremes.highest.date}</p>
            </div>
            <div className="bg-[#131320] rounded-xl border border-[#1e1e3a] p-5">
              <p className="text-xs font-semibold text-[#94a3b8] uppercase tracking-wider mb-2">
                Lowest Team Total &mdash; IPL {selectedCapSeason}
              </p>
              <p className="text-2xl font-extrabold text-red-400">
                {teamTotalExtremes.lowest.runs}/{teamTotalExtremes.lowest.wickets}
                <span className="text-sm text-[#94a3b8] font-medium ml-2">
                  ({teamTotalExtremes.lowest.overs} ov)
                </span>
              </p>
              <p className="text-sm text-white mt-1">
                {teamTotalExtremes.lowest.team}
                <span className="text-[#94a3b8]"> vs </span>
                {teamTotalExtremes.lowest.opponent}
              </p>
              <p className="text-xs text-[#94a3b8] mt-0.5">{teamTotalExtremes.lowest.date}</p>
            </div>
          </div>
        )}

        {/* Per-season highlights table */}
        {seasonHighlights.length > 0 && (
          <div className="bg-[#131320] rounded-xl border border-[#1e1e3a] overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[500px]">
              <thead>
                <tr className="border-b border-[#1e1e3a] text-[#94a3b8] text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-semibold">Season</th>
                  <th className="text-left px-5 py-3 font-semibold">
                    <span className="text-orange-400">Orange Cap</span>
                  </th>
                  <th className="text-right px-5 py-3 font-semibold">Runs</th>
                  <th className="text-left px-5 py-3 font-semibold">
                    <span className="text-purple-400">Purple Cap</span>
                  </th>
                  <th className="text-right px-5 py-3 font-semibold">Wkts</th>
                </tr>
              </thead>
              <tbody>
                {seasonHighlights.map((h, i) => (
                  <tr
                    key={h.year}
                    className={`border-t border-[#1e1e3a]/50 hover:bg-white/[0.02] transition ${
                      i === 0 ? 'bg-gradient-to-r from-amber-500/[0.08] via-transparent to-transparent' : ''
                    }`}
                  >
                    <td className="px-5 py-3 font-semibold text-gray-400">
                      <Link to={`/seasons/${h.year}`} className="hover:text-accent transition">
                        IPL {h.year}
                      </Link>
                    </td>
                    <td className="px-5 py-3 font-bold text-white">{h.orangeCapPlayer}</td>
                    <td className="px-5 py-3 text-right font-semibold text-orange-400">{h.orangeCapRuns}</td>
                    <td className="px-5 py-3 font-bold text-white">{h.purpleCapPlayer}</td>
                    <td className="px-5 py-3 text-right font-semibold text-purple-400">{h.purpleCapWickets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Category Tabs + Search */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex gap-2 bg-[#131320]/50 p-1.5 rounded-xl border border-[#1e1e3a] w-full sm:w-fit overflow-x-auto">
          {([
            { key: 'batting' as Tab, label: 'Batting' },
            { key: 'bowling' as Tab, label: 'Bowling' },
            { key: 'fielding' as Tab, label: 'Fielding' },
          ]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition whitespace-nowrap flex-1 sm:flex-none ${
                tab === t.key
                  ? 'bg-accent text-white'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Player Search */}
        <div className="relative w-full sm:w-auto sm:ml-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search player names..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-[#131320] border border-[#1e1e3a] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-accent w-full sm:w-64"
          />
        </div>
      </div>

      {/* Season Orange/Purple Cap Info */}
      {tab === 'batting' && sortedSeasons.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-orange-500 rounded-full" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Orange Cap Winners</h2>
          </div>
          <div className="bg-[#131320] rounded-xl border border-[#1e1e3a] overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="border-b border-[#1e1e3a] text-[#94a3b8] text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-3 font-semibold">Season</th>
                  <th className="text-left px-6 py-3 font-semibold">Player</th>
                  <th className="text-right px-6 py-3 font-semibold">Runs</th>
                </tr>
              </thead>
              <tbody>
                {sortedSeasons.filter((s: any) => s.orangeCap).slice(0, 10).map((s: any, i: number) => (
                  <tr
                    key={s.year}
                    className={`border-t border-[#1e1e3a]/50 hover:bg-white/[0.02] transition ${i === 0 ? 'bg-gradient-to-r from-orange-500/15 via-orange-500/5 to-transparent border-l-[3px] border-l-orange-500' : ''}`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-400">
                      <Link to={`/seasons/${s.year}`} className="hover:text-accent transition">IPL {s.year}</Link>
                    </td>
                    <td className="px-6 py-4 font-bold text-white"><PlayerLink name={s.orangeCap.player} className="hover:text-amber-400 transition-colors" /></td>
                    <td className={`px-6 py-4 text-right font-bold text-base ${i === 0 ? 'text-orange-400' : 'text-white'}`}>
                      {s.orangeCap.runs}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'bowling' && sortedSeasons.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-purple-500 rounded-full" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wide">Purple Cap Winners</h2>
          </div>
          <div className="bg-[#131320] rounded-xl border border-[#1e1e3a] overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[400px]">
              <thead>
                <tr className="border-b border-[#1e1e3a] text-[#94a3b8] text-xs uppercase tracking-wider">
                  <th className="text-left px-6 py-3 font-semibold">Season</th>
                  <th className="text-left px-6 py-3 font-semibold">Player</th>
                  <th className="text-right px-6 py-3 font-semibold">Wickets</th>
                </tr>
              </thead>
              <tbody>
                {sortedSeasons.filter((s: any) => s.purpleCap).slice(0, 10).map((s: any, i: number) => (
                  <tr
                    key={s.year}
                    className={`border-t border-[#1e1e3a]/50 hover:bg-white/[0.02] transition ${i === 0 ? 'bg-gradient-to-r from-purple-500/15 via-purple-500/5 to-transparent border-l-[3px] border-l-purple-500' : ''}`}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-400">
                      <Link to={`/seasons/${s.year}`} className="hover:text-accent transition">IPL {s.year}</Link>
                    </td>
                    <td className="px-6 py-4 font-bold text-white"><PlayerLink name={s.purpleCap.player} className="hover:text-purple-400 transition-colors" /></td>
                    <td className={`px-6 py-4 text-right font-bold text-base ${i === 0 ? 'text-purple-400' : 'text-white'}`}>
                      {s.purpleCap.wickets}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* All-Time Records */}
      <div className="space-y-10">
        {records.map(record => (
          <section key={record.title}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
              <h2 className="text-lg font-bold text-white uppercase tracking-wide">{record.title}</h2>
            </div>
            {record.data.length === 0 ? (
              <div className="bg-[#131320] rounded-xl border border-[#1e1e3a] p-8 text-center text-[#94a3b8] text-sm">
                {query ? `No players matching "${searchQuery}" in this category.` : 'No data available.'}
              </div>
            ) : (
              <div className="bg-[#131320] rounded-xl border border-[#1e1e3a] overflow-hidden overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[#1e1e3a] text-[#94a3b8] text-xs uppercase tracking-wider">
                      <th className="text-left px-4 sm:px-6 py-3 font-semibold w-16">Rank</th>
                      <th className="text-left px-4 sm:px-6 py-3 font-semibold">Player</th>
                      <th className="text-right px-4 sm:px-6 py-3 font-semibold">Matches</th>
                      <th className="text-right px-4 sm:px-6 py-3 font-semibold">{record.extraLabel}</th>
                      <th className="text-right px-4 sm:px-6 py-3 font-semibold">{record.label}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.data.slice(0, 10).map((p, i) => {
                      const isGold = i === 0
                      const isSilver = i === 1
                      const isBronze = i === 2
                      const rankColor = isGold ? 'text-amber-400' : isSilver ? 'text-gray-300' : isBronze ? 'text-orange-400' : 'text-gray-500'
                      const rowClass = isGold
                        ? 'bg-gradient-to-r from-amber-500/[0.12] via-amber-500/[0.04] to-transparent border-l-[3px] border-l-amber-500'
                        : 'border-t border-[#1e1e3a]/50 hover:bg-white/[0.02] transition'

                      return (
                        <tr key={p.playerId} className={rowClass}>
                          <td className={`px-6 py-4 font-bold ${rankColor}`}>
                            {i + 1}
                            {isGold && <span className="ml-1.5 text-sm">&#129351;</span>}
                            {isSilver && <span className="ml-1.5 text-sm">&#129352;</span>}
                            {isBronze && <span className="ml-1.5 text-sm">&#129353;</span>}
                          </td>
                          <td className="px-6 py-4 font-bold text-white">
                            <Link to={`/players/${p.playerId}`} className="hover:text-accent transition">
                              {p.playerName}
                            </Link>
                          </td>
                          <td className="px-6 py-4 text-right text-gray-400">{p.matches}</td>
                          <td className="px-6 py-4 text-right text-gray-400">{(p as any)[record.extra]}</td>
                          <td className={`px-6 py-4 text-right font-bold text-base ${isGold ? 'text-amber-400' : 'text-white'}`}>
                            {(p as any)[record.col]}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  )
}
