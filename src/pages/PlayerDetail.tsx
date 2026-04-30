// Player profile page (/players/:id).
// Career arc + analytics: bio header, season-by-season splits, phase
// radar, dismissal pie, partnership bars, venue stats, watchlist toggle,
// and contextual links into related pages (matches, season, team).
import { useParams, Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import {
  usePlayers,
  usePlayerStats,
  usePlayerTeams,
  useIsWatched,
  useToggleWatchlist,
  usePlayerPhaseStats,
  usePlayerDismissals,
  usePlayerSeasonBreakdown,
  usePlayerPartnerships,
  usePlayerBattingPositions,
} from '@/hooks/useData'
import { TEAM_COLORS, TEAM_SHORT } from '@/lib/constants'
import PhaseRadar from '@/components/charts/PhaseRadar'
import type { PhaseRadarDatum } from '@/components/charts/PhaseRadar'
import DismissalPie from '@/components/charts/DismissalPie'
import SeasonProgressionChart from '@/components/charts/SeasonProgressionChart'
import type { SeasonDatum } from '@/components/charts/SeasonProgressionChart'
import PartnershipBar from '@/components/charts/PartnershipBar'
import type { PartnershipDatum } from '@/components/charts/PartnershipBar'
import type { PhaseStats, PhaseBowlingStats, SeasonBreakdown, PositionStats, PartnershipEntry, DismissalBreakdown } from '@/services/playerStatsService'
import ErrorState from '@/components/ui/ErrorState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Breadcrumb from '@/components/ui/Breadcrumb'
import TeamBadge from '@/components/ui/TeamBadge'
import Avatar from '@/components/ui/Avatar'
import OverseasBadge from '@/components/ui/OverseasBadge'
import { useOfficialSquads, usePlayerPhotos } from '@/hooks/useData'
import { buildOverseasLookup, isOverseasPlayer } from '@/lib/nationality'

// Use official role from data, fallback to stat inference
function inferRole(s: any, officialRole?: string): string {
  if (officialRole) return officialRole
  if (!s) return 'Unknown'
  if (s.stumpings > 5) return 'WK-Batter'
  const isBowler = s.wickets > 20 && s.wickets > s.runs / 30
  const isBatter = s.runs > 200
  if (isBowler && isBatter) return 'All-rounder'
  if (isBowler) return 'Bowler'
  return 'Batter'
}

const TABS = ['Overview', 'Batting', 'Bowling', 'Fielding', 'Team History'] as const
type Tab = typeof TABS[number]

// ── Loading Spinner (uses reusable component) ──
function Spinner() {
  return <LoadingSpinner size="md" />
}

// ── Section Card ──
function SectionCard({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card border border-border rounded-2xl overflow-hidden ${className}`}>
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-bold">{title}</h3>
      </div>
      {children}
    </div>
  )
}

// ── Phase Label ──
const PHASE_LABELS: Record<string, string> = {
  powerplay: 'Powerplay (1-6)',
  middle: 'Middle (7-16)',
  death: 'Death (17-20)',
}

export default function PlayerDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: players } = usePlayers()
  const { data: allStats } = usePlayerStats()
  const { data: playerTeams } = usePlayerTeams()
  const { data: officialSquads } = useOfficialSquads()
  const { data: playerPhotos } = usePlayerPhotos()
  const overseasLookup = useMemo(() => buildOverseasLookup(officialSquads), [officialSquads])

  const [activeTab, setActiveTab] = useState<Tab>('Overview')

  const { data: isWatched } = useIsWatched(id)
  const toggleWatchlist = useToggleWatchlist()

  const player = useMemo(() => players?.find(p => p.id === id), [players, id])
  const stats = useMemo(() => allStats?.find(s => s.playerId === id), [allStats, id])
  const teamHistory = useMemo(() => playerTeams?.[id || ''] || [], [playerTeams, id])

  const seasons = useMemo(() => player?.seasons || [], [player])

  // Scorecards, ball-by-ball, and partnerships data all key off the short
  // name (e.g. "V Kohli"), not the full name. Always look up analytics by
  // shortName so players whose full name differs from their scorecard name
  // (Virat Kohli, MS Dhoni, etc.) get full deep-stats coverage.
  const lookupName = player?.shortName || player?.name

  // ── Deep analytics hooks ──
  const { data: phaseStatsBat, isLoading: loadingPhaseBat } = usePlayerPhaseStats(lookupName, seasons, 'batting')
  const { data: phaseStatsBowl, isLoading: loadingPhaseBowl } = usePlayerPhaseStats(lookupName, seasons, 'bowling')
  const { data: dismissals, isLoading: loadingDismissals } = usePlayerDismissals(lookupName, seasons)
  const { data: seasonBreakdown, isLoading: loadingSeason } = usePlayerSeasonBreakdown(lookupName, seasons)
  const { data: partnerships, isLoading: loadingPartner } = usePlayerPartnerships(lookupName, seasons)
  const { data: battingPositions, isLoading: loadingPositions } = usePlayerBattingPositions(lookupName, seasons)

  // ── Derived chart data ──
  const phaseRadarBatData: PhaseRadarDatum[] = useMemo(() => {
    if (!phaseStatsBat) return []
    return (phaseStatsBat as PhaseStats[]).map(p => ({
      phase: PHASE_LABELS[p.phase] || p.phase,
      value: p.strikeRate,
    }))
  }, [phaseStatsBat])

  const phaseRadarBowlData: PhaseRadarDatum[] = useMemo(() => {
    if (!phaseStatsBowl) return []
    return (phaseStatsBowl as PhaseBowlingStats[]).map(p => ({
      phase: PHASE_LABELS[p.phase] || p.phase,
      value: p.economy,
    }))
  }, [phaseStatsBowl])

  const seasonChartData: SeasonDatum[] = useMemo(() => {
    if (!seasonBreakdown) return []
    return (seasonBreakdown as SeasonBreakdown[]).map(s => ({
      season: s.season,
      runs: s.batting.runs,
      avg: s.batting.average,
      sr: s.batting.strikeRate,
    }))
  }, [seasonBreakdown])

  const partnershipChartData: PartnershipDatum[] = useMemo(() => {
    if (!partnerships) return []
    // Aggregate by partner
    const agg: Record<string, { runs: number; balls: number; matches: Set<string> }> = {}
    for (const p of partnerships as PartnershipEntry[]) {
      if (!agg[p.partner]) agg[p.partner] = { runs: 0, balls: 0, matches: new Set() }
      agg[p.partner].runs += p.runs
      agg[p.partner].balls += p.balls
      agg[p.partner].matches.add(p.matchId)
    }
    return Object.entries(agg)
      .map(([partner, d]) => ({ partner, runs: d.runs, balls: d.balls, matches: d.matches.size }))
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 5)
  }, [partnerships])

  // Players loaded but this player doesn't exist
  if (players && !player) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-16">
        <ErrorState message={`Player with ID "${id}" was not found.`} />
        <div className="text-center mt-2">
          <Link to="/players" className="text-accent hover:underline text-sm font-medium">
            Back to all players
          </Link>
        </div>
      </div>
    )
  }

  // Still loading
  if (!player) {
    return <LoadingSpinner size="lg" text="Loading player..." />
  }

  // Group team history by team
  const teamSeasons: Record<string, string[]> = {}
  for (const entry of teamHistory) {
    if (!teamSeasons[entry.team]) teamSeasons[entry.team] = []
    teamSeasons[entry.team].push(entry.season)
  }

  const role = inferRole(stats, player.role)
  const lastTeam = player.lastTeam || player.teams?.[player.teams.length - 1] || ''
  const teamColor = TEAM_COLORS[lastTeam]?.primary || '#6366f1'
  const firstYear = player.firstMatch ? new Date(player.firstMatch).getFullYear() : ''
  const lastYear = player.lastMatch ? new Date(player.lastMatch).getFullYear() : ''

  // Max runs for season bar visualization
  const maxSeasonRuns = seasonBreakdown
    ? Math.max(...(seasonBreakdown as SeasonBreakdown[]).map(s => s.batting.runs), 1)
    : 1
  const maxSeasonWickets = seasonBreakdown
    ? Math.max(...(seasonBreakdown as SeasonBreakdown[]).map(s => s.bowling.wickets), 1)
    : 1

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-4">
      {/* Breadcrumb */}
      <div className="pt-4 sm:pt-5 pb-2">
        <Breadcrumb items={[{ label: 'Players', path: '/players' }, { label: player.name }]} />
      </div>

      {/* Player Header */}
      <div className="py-4 sm:py-6">
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
            {/* Left: Avatar + Info */}
            <div className="flex items-center gap-3 sm:gap-4 md:gap-6 min-w-0 w-full">
              <div className="relative shrink-0">
                {(() => {
                  const latestSeason = player.seasons?.[player.seasons.length - 1]
                  const photoUrl = (latestSeason && playerPhotos?.[`${player.id}_${latestSeason}`]) || playerPhotos?.[player.id]
                  return (
                    <Avatar
                      id={player.id}
                      name={player.name}
                      kind="player"
                      sizePx={72}
                      color={teamColor}
                      initialsFontSizePx={28}
                      className="sm:!w-20 sm:!h-20 md:!w-24 md:!h-24"
                      season={latestSeason}
                      photo={photoUrl}
                    />
                  )
                })()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 md:gap-3 mb-1 flex-wrap">
                  <h1 className="text-xl sm:text-2xl md:text-4xl font-bold leading-tight break-words">{player.name}</h1>
                  {isOverseasPlayer(player.name, overseasLookup) === true && <OverseasBadge sizePx={16} />}
                  <button
                    onClick={() => toggleWatchlist.mutate({ playerId: id!, playerName: player.name, isWatched: !!isWatched })}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition group"
                    title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    {isWatched ? (
                      <svg className="w-6 h-6 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M5 2h14a1 1 0 011 1v19.143a.5.5 0 01-.766.424L12 18.03l-7.234 4.536A.5.5 0 014 22.143V3a1 1 0 011-1z" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-500 group-hover:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/20">
                    {role}
                  </span>
                  {lastTeam && (
                    <span
                      className="px-3 py-1 rounded-lg text-xs font-bold border"
                      style={{
                        backgroundColor: teamColor + '15',
                        color: teamColor,
                        borderColor: teamColor + '30',
                      }}
                    >
                      {TEAM_SHORT[lastTeam] || lastTeam}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${player.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20' : player.status === 'inactive' ? 'bg-amber-500/15 text-amber-400 border-amber-500/20' : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/20'} capitalize`}>
                    {player.status}
                  </span>
                </div>
                <p className="text-textSecondary text-sm mt-2.5">
                  IPL Debut: {firstYear} &middot; Last Match: {lastYear} &middot; {player.seasons?.length || 0} seasons
                </p>
              </div>
            </div>

            {/* Right: Key stat (hidden on small mobile) */}
            {stats && (
              <div className="hidden sm:flex items-center gap-5">
                <div className="relative flex flex-col items-center">
                  <div
                    className="w-28 h-32 flex items-center justify-center"
                    style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }}
                  >
                    <div
                      className="w-[104px] h-[120px] bg-card flex flex-col items-center justify-center"
                      style={{ clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)' }}
                    >
                      <span className="text-3xl font-black gradient-text leading-none">
                        {stats.runs > stats.wickets * 20 ? stats.runs.toLocaleString() : stats.wickets}
                      </span>
                      <span className="text-[10px] font-bold text-purple-500 mt-1 uppercase tracking-widest">
                        {stats.runs > stats.wickets * 20 ? 'Runs' : 'Wickets'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-xs text-textSecondary font-medium">Matches</span>
                    <span className="text-sm font-bold text-textPrimary">{stats.matches}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="mb-6 sm:mb-8 -mx-3 sm:mx-0">
        <div className="border-b border-border flex items-center gap-0 overflow-x-auto px-3 sm:px-0">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 sm:px-4 py-3 text-xs sm:text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'text-accent border-accent' : 'text-textSecondary hover:text-textPrimary border-transparent'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="pb-16 space-y-8">
        {/* ═══════════════════════ OVERVIEW TAB ═══════════════════════ */}
        {activeTab === 'Overview' && stats && (
          <>
            {/* Bio Section */}
            <section>
              <h2 className="text-xl font-bold mb-4">Player Bio</h2>
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">Name</p>
                    <p className="text-sm font-semibold">{player.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-sm font-semibold">{player.fullName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">Short Name</p>
                    <p className="text-sm font-semibold">{player.shortName || player.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">Also Known As</p>
                    {player.nicknames && player.nicknames.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 mt-0.5">
                        {player.nicknames.map((nick: string) => (
                          <span key={nick} className="px-2 py-0.5 bg-accent/10 border border-accent/20 text-accent text-xs font-medium rounded-full">
                            {nick}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-textSecondary">—</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">Playing Role</p>
                    <p className="text-sm font-semibold">{role}</p>
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">Last Active Team</p>
                    <p className="text-sm font-semibold" style={{ color: TEAM_COLORS[lastTeam]?.primary || '#e2e8f0' }}>
                      {lastTeam || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">IPL Debut</p>
                    <p className="text-sm font-semibold">{firstYear}</p>
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">Last Match</p>
                    <p className="text-sm font-semibold">{lastYear}</p>
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">Status</p>
                    <p className="text-sm font-semibold capitalize">{player.status}</p>
                  </div>
                  <div>
                    <p className="text-xs text-textSecondary uppercase tracking-wider mb-1">Seasons</p>
                    <p className="text-sm font-semibold">{player.seasons?.length || 0}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Stats Dashboard */}
            <section>
              <h2 className="text-xl font-bold mb-4">Core Stats</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                {[
                  { value: stats.matches, label: 'Matches' },
                  { value: stats.runs.toLocaleString(), label: 'Runs' },
                  { value: stats.battingAvg, label: 'Average' },
                  { value: stats.strikeRate, label: 'Strike Rate' },
                  { value: stats.wickets, label: 'Wickets' },
                  { value: stats.economy, label: 'Economy' },
                ].map(({ value, label }) => (
                  <div key={label} className="bg-card border border-border rounded-2xl p-3 md:p-5 text-center hover:border-accent/30 transition-colors">
                    <p className="text-2xl md:text-3xl font-black gradient-text">{value}</p>
                    <p className="text-xs text-textSecondary mt-1 font-medium uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Phase Radar + Season Progression + Partnerships */}
            <section className="grid md:grid-cols-2 gap-6">
              {/* Phase-wise Batting Radar */}
              <SectionCard title="Phase-wise Batting SR">
                {loadingPhaseBat ? <Spinner /> : phaseRadarBatData.length > 0 ? (
                  <div className="h-72 p-4">
                    <PhaseRadar data={phaseRadarBatData} />
                  </div>
                ) : (
                  <div className="py-8 text-center text-textSecondary text-sm">No phase data available</div>
                )}
              </SectionCard>

              {/* Season Progression */}
              <SectionCard title="Season Runs Progression">
                {loadingSeason ? <Spinner /> : seasonChartData.length > 0 ? (
                  <div className="h-72 p-4">
                    <SeasonProgressionChart data={seasonChartData} metric="runs" />
                  </div>
                ) : (
                  <div className="py-8 text-center text-textSecondary text-sm">No season data available</div>
                )}
              </SectionCard>
            </section>

            {/* Top Partnerships */}
            <section>
              <SectionCard title="Top 5 Partnerships (by total runs)">
                {loadingPartner ? <Spinner /> : partnershipChartData.length > 0 ? (
                  <div className="h-72 p-4">
                    <PartnershipBar data={partnershipChartData} />
                  </div>
                ) : (
                  <div className="py-8 text-center text-textSecondary text-sm">No partnership data available</div>
                )}
              </SectionCard>
            </section>

            {/* Quick Stats Grid */}
            <section className="grid md:grid-cols-2 gap-6">
              {/* Batting Highlights */}
              <SectionCard title="Batting Highlights">
                <div className="divide-y divide-border">
                  {[
                    ['Innings', stats.inningsBat],
                    ['Runs', stats.runs.toLocaleString()],
                    ['High Score', `${stats.highScore}${stats.highScoreNotOut ? '*' : ''}`],
                    ['Average', stats.battingAvg],
                    ['Strike Rate', stats.strikeRate],
                    ['50s / 100s', `${stats.fifties} / ${stats.hundreds}`],
                    ['Fours / Sixes', `${stats.fours} / ${stats.sixes}`],
                  ].map(([label, val]) => (
                    <div key={label as string} className="flex justify-between px-5 py-2.5">
                      <span className="text-sm text-textSecondary">{label}</span>
                      <span className="text-sm font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              {/* Bowling Highlights */}
              <SectionCard title="Bowling Highlights">
                <div className="divide-y divide-border">
                  {[
                    ['Innings', stats.inningsBowl],
                    ['Wickets', stats.wickets],
                    ['Economy', stats.economy],
                    ['Bowling Avg', stats.bowlingAvg || '-'],
                    ['Bowling SR', stats.bowlingSR || '-'],
                    ['Best Bowling', stats.bestBowling],
                    ['3W / 5W', `${stats.threeWickets} / ${stats.fiveWickets}`],
                  ].map(([label, val]) => (
                    <div key={label as string} className="flex justify-between px-5 py-2.5">
                      <span className="text-sm text-textSecondary">{label}</span>
                      <span className="text-sm font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </section>
          </>
        )}

        {/* ═══════════════════════ BATTING TAB ═══════════════════════ */}
        {activeTab === 'Batting' && stats && (
          <>
            {/* Core batting stats */}
            <section>
              <h2 className="text-xl font-bold mb-4">Batting Statistics</h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    ['Matches', stats.matches],
                    ['Innings', stats.inningsBat],
                    ['Runs', stats.runs.toLocaleString()],
                    ['Balls Faced', stats.ballsFaced.toLocaleString()],
                    ['Average', stats.battingAvg],
                    ['Strike Rate', stats.strikeRate],
                    ['High Score', `${stats.highScore}${stats.highScoreNotOut ? '*' : ''}`],
                    ['Fours', stats.fours],
                    ['Sixes', stats.sixes],
                    ['Fifties', stats.fifties],
                    ['Hundreds', stats.hundreds],
                    ['Ducks', stats.ducks],
                    ['Not Outs', stats.notOuts],
                  ].map(([label, val]) => (
                    <div key={label as string} className="flex justify-between px-6 py-3">
                      <span className="text-sm text-textSecondary">{label}</span>
                      <span className="text-sm font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Dismissal Pie + Batting Position Stats */}
            <section className="grid md:grid-cols-2 gap-6">
              {/* Dismissal Breakdown */}
              <SectionCard title="Dismissal Breakdown">
                {loadingDismissals ? <Spinner /> : dismissals && (dismissals as DismissalBreakdown[]).length > 0 ? (
                  <div className="h-80 p-4">
                    <DismissalPie
                      data={(dismissals as DismissalBreakdown[]).map(d => ({
                        type: d.kind,
                        count: d.count,
                      }))}
                    />
                  </div>
                ) : (
                  <div className="py-8 text-center text-textSecondary text-sm">No dismissal data</div>
                )}
              </SectionCard>

              {/* Batting Position Stats */}
              <SectionCard title="Batting Position Stats">
                {loadingPositions ? <Spinner /> : battingPositions && (battingPositions as PositionStats[]).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left text-xs text-textSecondary font-semibold uppercase tracking-wider">Position</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Inn</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Runs</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Avg</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">SR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(battingPositions as PositionStats[]).map(pos => (
                          <tr key={pos.group} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3 font-medium">
                              {pos.group}
                              <span className="text-textSecondary text-xs ml-1.5">#{pos.positions.join(',')}</span>
                            </td>
                            <td className="px-4 py-3 text-right text-textSecondary">{pos.innings}</td>
                            <td className="px-4 py-3 text-right font-semibold">{pos.runs}</td>
                            <td className="px-4 py-3 text-right text-textSecondary">{pos.average}</td>
                            <td className="px-4 py-3 text-right">
                              <span className={pos.strikeRate >= 140 ? 'text-emerald-400' : pos.strikeRate >= 120 ? 'text-amber-400' : 'text-textSecondary'}>
                                {pos.strikeRate}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-textSecondary text-sm">No position data</div>
                )}
              </SectionCard>
            </section>

            {/* Phase-wise Batting Table */}
            <section>
              <SectionCard title="Phase-wise Batting">
                {loadingPhaseBat ? <Spinner /> : phaseStatsBat && (phaseStatsBat as PhaseStats[]).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left text-xs text-textSecondary font-semibold uppercase tracking-wider">Phase</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Runs</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Balls</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">SR</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">4s</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">6s</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Dots</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(phaseStatsBat as PhaseStats[]).map(p => (
                          <tr key={p.phase} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3 font-medium">{PHASE_LABELS[p.phase] || p.phase}</td>
                            <td className="px-4 py-3 text-right font-semibold">{p.runs}</td>
                            <td className="px-4 py-3 text-right text-textSecondary">{p.balls}</td>
                            <td className="px-4 py-3 text-right">
                              <span className={p.strikeRate >= 150 ? 'text-emerald-400 font-semibold' : p.strikeRate >= 125 ? 'text-amber-400' : 'text-textSecondary'}>
                                {p.strikeRate}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-textSecondary">{p.fours}</td>
                            <td className="px-4 py-3 text-right text-textSecondary">{p.sixes}</td>
                            <td className="px-4 py-3 text-right text-textSecondary">{p.dots}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-textSecondary text-sm">No phase data</div>
                )}
              </SectionCard>
            </section>

            {/* Season-by-Season Batting Table */}
            <section>
              <SectionCard title="Season-by-Season Batting">
                {loadingSeason ? <Spinner /> : seasonBreakdown && (seasonBreakdown as SeasonBreakdown[]).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left text-xs text-textSecondary font-semibold uppercase tracking-wider">Season</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Inn</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Runs</th>
                          <th className="px-4 py-3 text-left text-xs text-textSecondary font-semibold uppercase tracking-wider w-32"></th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Avg</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">SR</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">HS</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">50/100</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(seasonBreakdown as SeasonBreakdown[]).map(s => (
                          <tr key={s.season} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3 font-medium">{s.season}</td>
                            <td className="px-4 py-3 text-right text-textSecondary">{s.batting.innings}</td>
                            <td className="px-4 py-3 text-right font-semibold">{s.batting.runs}</td>
                            <td className="px-4 py-3">
                              <div className="w-full bg-white/5 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-accent/70"
                                  style={{ width: `${(s.batting.runs / maxSeasonRuns) * 100}%` }}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-textSecondary">{s.batting.average}</td>
                            <td className="px-4 py-3 text-right">
                              <span className={s.batting.strikeRate >= 150 ? 'text-emerald-400' : s.batting.strikeRate >= 125 ? 'text-amber-400' : 'text-textSecondary'}>
                                {s.batting.strikeRate}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-textSecondary">{s.batting.highScore}</td>
                            <td className="px-4 py-3 text-right text-textSecondary">{s.batting.fifties}/{s.batting.hundreds}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-textSecondary text-sm">No season data</div>
                )}
              </SectionCard>
            </section>
          </>
        )}

        {/* ═══════════════════════ BOWLING TAB ═══════════════════════ */}
        {activeTab === 'Bowling' && stats && (
          <>
            {/* Core bowling stats */}
            <section>
              <h2 className="text-xl font-bold mb-4">Bowling Statistics</h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="divide-y divide-border">
                  {[
                    ['Innings', stats.inningsBowl],
                    ['Wickets', stats.wickets],
                    ['Runs Conceded', stats.runsConceded.toLocaleString()],
                    ['Economy', stats.economy],
                    ['Bowling Average', stats.bowlingAvg || '-'],
                    ['Bowling Strike Rate', stats.bowlingSR || '-'],
                    ['Best Bowling', stats.bestBowling],
                    ['3-Wicket Hauls', stats.threeWickets],
                    ['5-Wicket Hauls', stats.fiveWickets],
                    ['Maidens', stats.maidens],
                    ['Dot Balls', stats.dots],
                  ].map(([label, val]) => (
                    <div key={label as string} className="flex justify-between px-6 py-3">
                      <span className="text-sm text-textSecondary">{label}</span>
                      <span className="text-sm font-semibold">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Phase-wise Bowling Radar */}
            <section>
              <SectionCard title="Phase-wise Bowling Economy">
                {loadingPhaseBowl ? <Spinner /> : phaseRadarBowlData.length > 0 ? (
                  <div className="h-72 p-4">
                    <PhaseRadar data={phaseRadarBowlData} />
                  </div>
                ) : (
                  <div className="py-8 text-center text-textSecondary text-sm">No phase bowling data</div>
                )}
              </SectionCard>
            </section>

            {/* Phase-wise Bowling Table */}
            <section>
              <SectionCard title="Phase-wise Bowling Breakdown">
                {loadingPhaseBowl ? <Spinner /> : phaseStatsBowl && (phaseStatsBowl as PhaseBowlingStats[]).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left text-xs text-textSecondary font-semibold uppercase tracking-wider">Phase</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Balls</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Runs</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Wkts</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Econ</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Dots</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(phaseStatsBowl as PhaseBowlingStats[]).map(p => (
                          <tr key={p.phase} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3 font-medium">{PHASE_LABELS[p.phase] || p.phase}</td>
                            <td className="px-4 py-3 text-right text-textSecondary">{p.balls}</td>
                            <td className="px-4 py-3 text-right text-textSecondary">{p.runs}</td>
                            <td className="px-4 py-3 text-right font-semibold">{p.wickets}</td>
                            <td className="px-4 py-3 text-right">
                              <span className={p.economy <= 7 ? 'text-emerald-400 font-semibold' : p.economy <= 9 ? 'text-amber-400' : 'text-red-400'}>
                                {p.economy}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-textSecondary">{p.dots}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-textSecondary text-sm">No phase bowling data</div>
                )}
              </SectionCard>
            </section>

            {/* Season-by-Season Bowling Table */}
            <section>
              <SectionCard title="Season-by-Season Bowling">
                {loadingSeason ? <Spinner /> : seasonBreakdown && (seasonBreakdown as SeasonBreakdown[]).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="px-4 py-3 text-left text-xs text-textSecondary font-semibold uppercase tracking-wider">Season</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Inn</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Overs</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Runs</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Wkts</th>
                          <th className="px-4 py-3 text-left text-xs text-textSecondary font-semibold uppercase tracking-wider w-28"></th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Econ</th>
                          <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Best</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {(seasonBreakdown as SeasonBreakdown[]).filter(s => s.bowling.innings > 0).map(s => (
                          <tr key={s.season} className="hover:bg-white/[0.02]">
                            <td className="px-4 py-3 font-medium">{s.season}</td>
                            <td className="px-4 py-3 text-right text-textSecondary">{s.bowling.innings}</td>
                            <td className="px-4 py-3 text-right text-textSecondary">{s.bowling.overs}</td>
                            <td className="px-4 py-3 text-right text-textSecondary">{s.bowling.runs}</td>
                            <td className="px-4 py-3 text-right font-semibold">{s.bowling.wickets}</td>
                            <td className="px-4 py-3">
                              <div className="w-full bg-white/5 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-purple-500/70"
                                  style={{ width: `${(s.bowling.wickets / maxSeasonWickets) * 100}%` }}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className={s.bowling.economy <= 7 ? 'text-emerald-400' : s.bowling.economy <= 9 ? 'text-amber-400' : 'text-red-400'}>
                                {s.bowling.economy}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right text-textSecondary">{s.bowling.bestFigures}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-textSecondary text-sm">No season bowling data</div>
                )}
              </SectionCard>
            </section>
          </>
        )}

        {/* ═══════════════════════ FIELDING TAB ═══════════════════════ */}
        {activeTab === 'Fielding' && stats && (
          <section>
            <h2 className="text-xl font-bold mb-4">Fielding Statistics</h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="divide-y divide-border">
                {[
                  ['Catches', stats.catches],
                  ['Stumpings', stats.stumpings],
                  ['Run Outs', stats.runOuts],
                  ['Total Dismissals', stats.catches + stats.stumpings + stats.runOuts],
                ].map(([label, val]) => (
                  <div key={label as string} className="flex justify-between px-6 py-3">
                    <span className="text-sm text-textSecondary">{label}</span>
                    <span className="text-sm font-semibold">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════ TEAM HISTORY TAB ═══════════════════════ */}
        {activeTab === 'Team History' && (
          <>
            <section>
              <h2 className="text-xl font-bold mb-4">Team History</h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="divide-y divide-border">
                  {Object.entries(teamSeasons).length === 0 ? (
                    <div className="px-6 py-8 text-center text-textSecondary">No team history available</div>
                  ) : (
                    Object.entries(teamSeasons).map(([team, tSeasons]) => (
                      <div key={team} className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-3">
                          <TeamBadge
                            team={team}
                            size={40}
                            season={[...tSeasons].sort().pop()}
                          />
                          <div>
                            <span className="text-sm font-semibold">{team}</span>
                            <p className="text-xs text-textSecondary">{tSeasons.length} season{tSeasons.length > 1 ? 's' : ''}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 justify-end max-w-[300px]">
                          {tSeasons.sort().map(s => (
                            <span key={s} className="px-2 py-0.5 rounded-md bg-white/5 text-textSecondary text-xs font-medium">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>

            {/* Season-by-Season Performance at Each Team */}
            {seasonBreakdown && (seasonBreakdown as SeasonBreakdown[]).length > 0 && Object.entries(teamSeasons).length > 0 && (
              <section>
                <SectionCard title="Season Performance by Team">
                  {loadingSeason ? <Spinner /> : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="px-4 py-3 text-left text-xs text-textSecondary font-semibold uppercase tracking-wider">Season</th>
                            <th className="px-4 py-3 text-left text-xs text-textSecondary font-semibold uppercase tracking-wider">Team</th>
                            <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Runs</th>
                            <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Avg</th>
                            <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">SR</th>
                            <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Wkts</th>
                            <th className="px-4 py-3 text-right text-xs text-textSecondary font-semibold uppercase tracking-wider">Econ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {(seasonBreakdown as SeasonBreakdown[]).map(s => {
                            // Find which team the player was on in this season
                            const teamForSeason = Object.entries(teamSeasons).find(([, tSeasons]) =>
                              tSeasons.includes(s.season)
                            )
                            const teamName = teamForSeason ? teamForSeason[0] : '-'
                            const tColor = TEAM_COLORS[teamName]?.primary || '#666'
                            return (
                              <tr key={s.season} className="hover:bg-white/[0.02]">
                                <td className="px-4 py-3 font-medium">{s.season}</td>
                                <td className="px-4 py-3">
                                  <span
                                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border"
                                    style={{
                                      backgroundColor: tColor + '15',
                                      color: tColor,
                                      borderColor: tColor + '30',
                                    }}
                                  >
                                    {TEAM_SHORT[teamName] || teamName}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right font-semibold">{s.batting.runs}</td>
                                <td className="px-4 py-3 text-right text-textSecondary">{s.batting.average}</td>
                                <td className="px-4 py-3 text-right">
                                  <span className={s.batting.strikeRate >= 150 ? 'text-emerald-400' : s.batting.strikeRate >= 125 ? 'text-amber-400' : 'text-textSecondary'}>
                                    {s.batting.strikeRate}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-right font-semibold">{s.bowling.wickets}</td>
                                <td className="px-4 py-3 text-right">
                                  {s.bowling.innings > 0 ? (
                                    <span className={s.bowling.economy <= 7 ? 'text-emerald-400' : s.bowling.economy <= 9 ? 'text-amber-400' : 'text-red-400'}>
                                      {s.bowling.economy}
                                    </span>
                                  ) : (
                                    <span className="text-textSecondary">-</span>
                                  )}
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </SectionCard>
              </section>
            )}
          </>
        )}

        {!stats && activeTab !== 'Team History' && (
          <div className="bg-card border border-border rounded-2xl p-10 sm:p-12 text-center">
            {/* Differentiate "rookie waiting to debut" from "we just don't
                have stats data". Active players who've been signed but
                haven't played a match yet get a friendlier message — they're
                in the database on purpose, we're just waiting for them. */}
            {player.status === 'active' && !player.firstMatch ? (
              <>
                <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3M3 12a9 9 0 1018 0 9 9 0 00-18 0z" />
                  </svg>
                </div>
                <p className="text-textPrimary font-semibold mb-1">Yet to make IPL debut</p>
                <p className="text-textSecondary text-sm max-w-md mx-auto">
                  {player.name} has been signed but hasn't played a match in IPL
                  {player.seasons?.length ? ` ${player.seasons[player.seasons.length - 1]}` : ''} yet.
                  Stats will appear here once they take the field.
                </p>
              </>
            ) : (
              <p className="text-textSecondary">No statistics available for this player.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
