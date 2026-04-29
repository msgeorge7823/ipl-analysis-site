// Analytics Lab page (/analytics).
// Interactive workspace: pick a player set + filters, then drill down via
// phase / H2H / dismissal / partnership / season charts. Workspace state
// is shareable via the `ws` URL param and saveable to IndexedDB.
import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import Fuse from 'fuse.js'
import { COUNTRY_LIST, getPlayerCountry, isCappedPlayer } from '@/lib/nationality'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { usePlayers, usePlayerStats, useTeams, useVenues, useSeasons, useWorkspaces, useSaveWorkspace, useDeleteWorkspace, usePlayerPhaseStats, usePlayerDismissals, usePlayerSeasonBreakdown } from '@/hooks/useData'
import { playerStatsService } from '@/services/playerStatsService'
import type { H2HBattingStats, PhaseStats, DismissalBreakdown, SeasonBreakdown } from '@/services/playerStatsService'
import { workspaceService } from '@/services/workspaceService'
import { TEAM_SHORT } from '@/lib/constants'
import { useQuery, useQueries } from '@tanstack/react-query'
import EmptyState from '@/components/ui/EmptyState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import PhaseRadar from '@/components/charts/PhaseRadar'
import type { PhaseRadarDatum } from '@/components/charts/PhaseRadar'
import DismissalPie from '@/components/charts/DismissalPie'

const PLAYER_COLORS = [
  { bg: 'bg-red-500/15', text: 'text-red-300', border: 'border-red-500/25', avatar: 'bg-red-600/40', dot: 'bg-red-500', stroke: '#ef4444', fill: 'rgba(239,68,68,0.15)' },
  { bg: 'bg-blue-500/15', text: 'text-blue-300', border: 'border-blue-500/25', avatar: 'bg-blue-600/40', dot: 'bg-blue-500', stroke: '#3b82f6', fill: 'rgba(59,130,246,0.12)' },
  { bg: 'bg-teal-500/15', text: 'text-teal-300', border: 'border-teal-500/25', avatar: 'bg-teal-600/40', dot: 'bg-teal-400', stroke: '#2dd4bf', fill: 'rgba(45,212,191,0.12)' },
  { bg: 'bg-gray-500/15', text: 'text-gray-300', border: 'border-gray-500/25', avatar: 'bg-gray-600/40', dot: 'bg-gray-400', stroke: '#94a3b8', fill: 'rgba(148,163,184,0.10)' },
  { bg: 'bg-amber-500/15', text: 'text-amber-300', border: 'border-amber-500/25', avatar: 'bg-amber-600/40', dot: 'bg-amber-400', stroke: '#fbbf24', fill: 'rgba(251,191,36,0.12)' },
  { bg: 'bg-purple-500/15', text: 'text-purple-300', border: 'border-purple-500/25', avatar: 'bg-purple-600/40', dot: 'bg-purple-400', stroke: '#a78bfa', fill: 'rgba(167,139,250,0.12)' },
]

function getInitials(name: string) {
  const parts = name.split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.substring(0, 2).toUpperCase()
}

function getShortName(name: string) {
  const parts = name.split(' ')
  if (parts.length >= 2) return `${parts[0][0]}. ${parts[parts.length - 1]}`
  return name
}

// ── Sub-components for hook-based data loading ──

interface PlayerForAnalytics {
  id: string
  name: string
  /** Scorecard/BBB short-form name, e.g. "RG Sharma" for Rohit Sharma.
   *  BBB files store balls under this name, so any service call that scans
   *  ball-by-ball data MUST use shortName — passing `name` silently returns
   *  zero balls for anyone whose shortName differs from their display name. */
  shortName?: string
  seasons: number[]
  role?: string
  country?: string
  teams?: string[]
  status?: string
}

/** Pick the name to use for BBB-backed lookups. */
function bbbName(p: { shortName?: string; name: string }): string {
  return p.shortName || p.name
}

function PhaseRadarCard({ player, colorIdx }: { player: PlayerForAnalytics; colorIdx: number }) {
  const seasons = useMemo(() => player.seasons.map(String), [player.seasons])
  const { data, isLoading } = usePlayerPhaseStats(bbbName(player), seasons, 'batting')
  const color = PLAYER_COLORS[colorIdx % PLAYER_COLORS.length]

  const radarData: PhaseRadarDatum[] = useMemo(() => {
    if (!data) return []
    return (data as PhaseStats[]).map(ps => ({
      phase: ps.phase.charAt(0).toUpperCase() + ps.phase.slice(1),
      value: ps.strikeRate,
    }))
  }, [data])

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full`} style={{ background: color.stroke }} />
        <span className="text-sm font-semibold text-white">{getShortName(player.name)}</span>
        <span className="text-[10px] text-gray-500 ml-auto">SR by Phase</span>
      </div>
      <div className="flex-1 min-h-[220px] p-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full"><LoadingSpinner size="sm" /></div>
        ) : radarData.length > 0 ? (
          <PhaseRadar data={radarData} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600 text-sm">No phase data</div>
        )}
      </div>
      {data && (data as PhaseStats[]).length > 0 && (
        <div className="px-4 pb-3 grid grid-cols-3 gap-2 text-center">
          {(data as PhaseStats[]).map(ps => (
            <div key={ps.phase} className="bg-bg rounded-lg py-1.5 px-1">
              <p className="text-[10px] text-gray-500 uppercase">{ps.phase}</p>
              <p className="text-xs font-bold text-white">{ps.runs}<span className="text-gray-500 font-normal">/{ps.balls}b</span></p>
              <p className="text-[10px] font-medium" style={{ color: color.stroke }}>SR {ps.strikeRate}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DismissalCard({ player, colorIdx }: { player: PlayerForAnalytics; colorIdx: number }) {
  const seasons = useMemo(() => player.seasons.map(String), [player.seasons])
  const { data, isLoading } = usePlayerDismissals(bbbName(player), seasons)
  const color = PLAYER_COLORS[colorIdx % PLAYER_COLORS.length]

  const pieData = useMemo(() => {
    if (!data) return []
    return (data as DismissalBreakdown[]).map(d => ({ type: d.kind, count: d.count }))
  }, [data])

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full`} style={{ background: color.stroke }} />
        <span className="text-sm font-semibold text-white">{getShortName(player.name)}</span>
      </div>
      <div className="flex-1 min-h-[250px] p-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-full"><LoadingSpinner size="sm" /></div>
        ) : pieData.length > 0 ? (
          <DismissalPie data={pieData} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600 text-sm">No dismissal data</div>
        )}
      </div>
    </div>
  )
}


function H2HSection({ playerA, playerB }: { playerA: PlayerForAnalytics; playerB: PlayerForAnalytics }) {
  const allSeasons = useMemo(() => {
    const set = new Set([...playerA.seasons, ...playerB.seasons])
    return Array.from(set).sort().map(String)
  }, [playerA.seasons, playerB.seasons])

  // Try both directions: A bats vs B bowls, B bats vs A bowls.
  // Use BBB short names for the lookup — display names won't match the data.
  const aBBB = bbbName(playerA)
  const bBBB = bbbName(playerB)
  const { data: abData, isLoading: abLoading } = useQuery({
    queryKey: ['h2h-direct', aBBB, bBBB, allSeasons],
    queryFn: () => playerStatsService.getH2HBatterVsBowler(aBBB, bBBB, allSeasons),
    staleTime: 1000 * 60 * 30,
    enabled: allSeasons.length > 0,
  })

  const { data: baData, isLoading: baLoading } = useQuery({
    queryKey: ['h2h-direct', bBBB, aBBB, allSeasons],
    queryFn: () => playerStatsService.getH2HBatterVsBowler(bBBB, aBBB, allSeasons),
    staleTime: 1000 * 60 * 30,
    enabled: allSeasons.length > 0,
  })

  const isLoading = abLoading || baLoading
  const abStats = abData as H2HBattingStats | undefined
  const baStats = baData as H2HBattingStats | undefined

  const hasAB = abStats && abStats.balls > 0
  const hasBA = baStats && baStats.balls > 0

  if (isLoading) {
    return <div className="flex items-center justify-center py-12"><LoadingSpinner size="sm" text="Loading H2H data..." /></div>
  }

  if (!hasAB && !hasBA) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 text-sm">No head-to-head ball-by-ball data found between these players.</p>
        <p className="text-gray-600 text-xs mt-1">H2H stats require batter vs bowler matchups in the dataset.</p>
      </div>
    )
  }

  function H2HCard({ stats, label }: { stats: H2HBattingStats; label: string }) {
    return (
      <div className="bg-bg border border-border rounded-xl p-5">
        <h4 className="text-sm font-semibold text-gray-400 mb-4">{label}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.runs}</p>
            <p className="text-[11px] text-gray-500">Runs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{stats.balls}</p>
            <p className="text-[11px] text-gray-500">Balls</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accentLight">{stats.strikeRate}</p>
            <p className="text-[11px] text-gray-500">Strike Rate</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{stats.dismissals}</p>
            <p className="text-[11px] text-gray-500">Dismissals</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border">
          <span className="text-xs text-gray-500">4s: <span className="text-white font-semibold">{stats.fours}</span></span>
          <span className="text-xs text-gray-500">6s: <span className="text-white font-semibold">{stats.sixes}</span></span>
          <span className="text-xs text-gray-500">Dots: <span className="text-white font-semibold">{stats.dots}</span></span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {hasAB && <H2HCard stats={abStats!} label={`${getShortName(playerA.name)} (bat) vs ${getShortName(playerB.name)} (bowl)`} />}
      {hasBA && <H2HCard stats={baStats!} label={`${getShortName(playerB.name)} (bat) vs ${getShortName(playerA.name)} (bowl)`} />}
    </div>
  )
}

function SeasonComparisonTable({ players }: { players: PlayerForAnalytics[] }) {
  // Collect all season strings across all players
  const allSeasons = useMemo(() => {
    const set = new Set<number>()
    for (const p of players) {
      for (const s of p.seasons) set.add(s)
    }
    return Array.from(set).sort().map(String)
  }, [players])

  // We need to call hooks for each player. Max 6 players supported.
  // Call hooks unconditionally (React rules) but enable only when player exists.
  // Use BBB short names — getSeasonBreakdown scans ball-by-ball data.
  const p0 = players[0], p1 = players[1], p2 = players[2], p3 = players[3], p4 = players[4], p5 = players[5]
  const q0 = usePlayerSeasonBreakdown(p0 ? bbbName(p0) : undefined, allSeasons)
  const q1 = usePlayerSeasonBreakdown(p1 ? bbbName(p1) : undefined, allSeasons)
  const q2 = usePlayerSeasonBreakdown(p2 ? bbbName(p2) : undefined, allSeasons)
  const q3 = usePlayerSeasonBreakdown(p3 ? bbbName(p3) : undefined, allSeasons)
  const q4 = usePlayerSeasonBreakdown(p4 ? bbbName(p4) : undefined, allSeasons)
  const q5 = usePlayerSeasonBreakdown(p5 ? bbbName(p5) : undefined, allSeasons)

  const queries = [q0, q1, q2, q3, q4, q5].slice(0, players.length)
  const isLoading = queries.some(q => q.isLoading)

  // Build season rows
  const seasonRows = useMemo(() => {
    if (isLoading) return []
    const rows: { season: string; data: (SeasonBreakdown | null)[] }[] = []
    for (const season of allSeasons) {
      const playerData = queries.map(q => {
        const arr = q.data as SeasonBreakdown[] | undefined
        return arr?.find(s => s.season === season) ?? null
      })
      // Only include seasons where at least one player has data
      if (playerData.some(d => d !== null)) {
        rows.push({ season, data: playerData })
      }
    }
    return rows
  }, [isLoading, allSeasons, ...queries.map(q => q.data)])

  function getBestInRow(values: (number | null)[], lowerBetter = false): number {
    const valid = values.map((v, i) => ({ v, i })).filter(x => x.v != null && x.v > 0)
    if (valid.length === 0) return -1
    const best = lowerBetter
      ? valid.reduce((a, b) => (a.v! < b.v! ? a : b))
      : valid.reduce((a, b) => (a.v! > b.v! ? a : b))
    return best.i
  }

  return (
    <div className="mb-6">
      <div className="bg-card border border-border rounded-xl overflow-hidden glow">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          <h2 className="text-base font-semibold text-white">Season-by-Season Comparison</h2>
          <span className="text-xs text-gray-500 ml-2">Batting: Runs &amp; SR per season</span>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12"><LoadingSpinner size="sm" text="Loading season data..." /></div>
        ) : seasonRows.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm">No season data available</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0e0e1a]">
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 border-b border-border sticky left-0 bg-[#0e0e1a] z-10">Season</th>
                  {players.map((p, i) => {
                    const color = PLAYER_COLORS[i % PLAYER_COLORS.length]
                    return (
                      <th key={p.id} colSpan={2} className="text-center px-3 py-3 border-b border-border border-l border-border">
                        <span className="flex items-center justify-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ background: color.stroke }} />
                          <span className="text-xs font-semibold text-white">{getShortName(p.name)}</span>
                        </span>
                      </th>
                    )
                  })}
                </tr>
                <tr className="bg-[#0c0c18]">
                  <th className="border-b border-border sticky left-0 bg-[#0c0c18] z-10" />
                  {players.map((_, i) => (
                    <React.Fragment key={i}>
                      <th className="text-center text-[10px] font-medium text-gray-500 uppercase px-3 py-1.5 border-b border-border border-l border-border">Runs</th>
                      <th className="text-center text-[10px] font-medium text-gray-500 uppercase px-3 py-1.5 border-b border-border">SR</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {seasonRows.map((row, ri) => {
                  const runValues = row.data.map(d => d?.batting.runs ?? null)
                  const srValues = row.data.map(d => d?.batting.strikeRate ?? null)
                  const bestRunIdx = getBestInRow(runValues)
                  const bestSrIdx = getBestInRow(srValues)
                  return (
                    <tr key={row.season} className={`border-b border-border/50 hover:bg-white/[0.02] ${ri % 2 === 1 ? 'bg-white/[0.01]' : ''}`}>
                      <td className="px-4 py-3 text-sm font-semibold text-gray-300 sticky left-0 bg-card z-10">{row.season}</td>
                      {row.data.map((d, pi) => (
                        <React.Fragment key={pi}>
                          <td className={`px-3 py-3 text-center text-sm border-l border-border/50 ${pi === bestRunIdx ? 'font-bold text-accentLight' : 'text-white'}`}>
                            {d?.batting.runs != null ? d.batting.runs.toLocaleString() : '--'}
                          </td>
                          <td className={`px-3 py-3 text-center text-sm ${pi === bestSrIdx ? 'font-bold text-accentLight' : 'text-white'}`}>
                            {d?.batting.strikeRate != null && d.batting.strikeRate > 0 ? d.batting.strikeRate.toFixed(1) : '--'}
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Advanced T20 metrics section ──
//
// Applies concepts from the cricket-analyst playbook:
//   • Boundary %  = boundary runs / total runs
//   • Dot Ball %  = dot balls / balls faced (pulled from phase data)
//   • Balls/Boundary
//   • Non-Boundary (Rotation) SR = strike rate excluding 4s & 6s
//   • Impact Score — weighted composite (0–100) from SR, Avg, Boundary%, (100-Dot%)
//   • Archetype — Anchor / Accelerator / Power Hitter / Finisher / Floater
//   • Avg-vs-SR scatter with quadrant labels ("archetype map")

interface AdvancedMetric {
  boundaryPct: number
  dotPct: number
  ballsPerBoundary: number
  rotationSR: number
  impact: number
  archetype: string
  avg: number
  sr: number
}

function classifyArchetype(opts: { sr: number; avg: number; boundaryPct: number; deathSR: number }): string {
  const { sr, avg, boundaryPct, deathSR } = opts
  if (deathSR >= 160 && sr >= 135) return 'Finisher'
  if (sr >= 150 || boundaryPct >= 60) return 'Power Hitter'
  if (avg >= 30 && sr < 130) return 'Anchor'
  if (sr >= 135 && boundaryPct >= 50) return 'Accelerator'
  return 'Floater'
}

const ARCHETYPE_COLOR: Record<string, string> = {
  'Power Hitter': '#ef4444',
  'Accelerator': '#fbbf24',
  'Finisher': '#a78bfa',
  'Anchor': '#2dd4bf',
  'Floater': '#94a3b8',
}

function AdvancedMetricsSection({ players, selectedStats }: { players: PlayerForAnalytics[]; selectedStats: any[] }) {
  const phaseQueries = useQueries({
    queries: players.map((p) => {
      const seasons = p.seasons.map(String)
      const lookup = bbbName(p)
      return {
        queryKey: ['player-phase-stats', lookup, seasons, 'batting'],
        queryFn: () => playerStatsService.getPhaseWiseBatting(lookup, seasons),
        enabled: !!lookup && seasons.length > 0,
        staleTime: 1000 * 60 * 30,
      }
    }),
  })

  const isLoading = phaseQueries.some((q) => q.isLoading)

  const metrics: (AdvancedMetric | null)[] = useMemo(() => {
    return players.map((_p, i) => {
      const s = selectedStats[i] as any
      if (!s) return null
      const phaseData = (phaseQueries[i]?.data as PhaseStats[] | undefined) ?? []

      const runs = s.runs ?? 0
      const balls = s.ballsFaced ?? 0
      const fours = s.fours ?? 0
      const sixes = s.sixes ?? 0
      const avg = s.battingAvg ?? 0
      const sr = s.strikeRate ?? 0

      const boundaryRuns = fours * 4 + sixes * 6
      const boundaryPct = runs > 0 ? (boundaryRuns / runs) * 100 : 0
      const boundaries = fours + sixes
      const ballsPerBoundary = boundaries > 0 ? balls / boundaries : 0
      const nonBoundaryRuns = Math.max(0, runs - boundaryRuns)
      const nonBoundaryBalls = Math.max(0, balls - boundaries)
      const rotationSR = nonBoundaryBalls > 0 ? (nonBoundaryRuns / nonBoundaryBalls) * 100 : 0

      const totalBalls = phaseData.reduce((a, p) => a + p.balls, 0)
      const totalDots = phaseData.reduce((a, p) => a + p.dots, 0)
      const dotPct = totalBalls > 0 ? (totalDots / totalBalls) * 100 : 0

      const deathSR = phaseData.find((p) => p.phase === 'death')?.strikeRate ?? 0

      // Weighted composite, roughly normalised to 0–100.
      // SR (35) + Avg (20) + Boundary% (25) + (100-Dot%) (20).
      const srNorm = Math.min(sr / 180, 1) * 35
      const avgNorm = Math.min(avg / 50, 1) * 20
      const boundaryNorm = Math.min(boundaryPct / 70, 1) * 25
      const dotNorm = Math.max(0, Math.min(1, (100 - dotPct) / 60)) * 20
      const impact = Math.round(srNorm + avgNorm + boundaryNorm + dotNorm)

      const archetype = classifyArchetype({ sr, avg, boundaryPct, deathSR })

      return { boundaryPct, dotPct, ballsPerBoundary, rotationSR, impact, archetype, avg, sr }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players, selectedStats, phaseQueries.map((q) => q.data).join('|')])

  // Scatter plot geometry — wider range so outliers don't pin to the edge
  const W = 520, H = 280
  const padL = 48, padR = 28, padT = 24, padB = 38
  const xMin = 80, xMax = 200 // SR
  const yMin = 5,  yMax = 60  // Avg
  const sx = (v: number) => padL + ((Math.max(xMin, Math.min(xMax, v)) - xMin) / (xMax - xMin)) * (W - padL - padR)
  const sy = (v: number) => H - padB - ((Math.max(yMin, Math.min(yMax, v)) - yMin) / (yMax - yMin)) * (H - padT - padB)
  const midX = sx(140)
  const midY = sy(30)

  function bestIdx(vals: (number | null)[], lowerBetter = false): number {
    const valid = vals.map((v, i) => ({ v, i })).filter((x) => x.v != null)
    if (valid.length === 0) return -1
    return (lowerBetter
      ? valid.reduce((a, b) => (a.v! < b.v! ? a : b))
      : valid.reduce((a, b) => (a.v! > b.v! ? a : b))
    ).i
  }

  const metricRows: { label: string; key: keyof AdvancedMetric; format: (v: number) => string; lowerBetter?: boolean; hint: string }[] = [
    { label: 'Boundary %',       key: 'boundaryPct',      format: (v) => `${v.toFixed(1)}%`, hint: 'Share of runs from 4s & 6s' },
    { label: 'Dot Ball %',       key: 'dotPct',           format: (v) => `${v.toFixed(1)}%`, lowerBetter: true, hint: 'Balls faced with 0 runs (batting pressure)' },
    { label: 'Balls / Boundary', key: 'ballsPerBoundary', format: (v) => v > 0 ? v.toFixed(1) : '—', lowerBetter: true, hint: 'Lower = more frequent boundaries' },
    { label: 'Rotation SR',      key: 'rotationSR',       format: (v) => v > 0 ? v.toFixed(1) : '—', hint: 'Strike rate excluding 4s & 6s — strike rotation quality' },
    { label: 'Impact Score',     key: 'impact',           format: (v) => v.toFixed(0), hint: 'Composite 0–100: weighted SR, Avg, Boundary%, (100-Dot%)' },
  ]

  return (
    <div className="mb-6 bg-card border border-border rounded-xl overflow-hidden glow">
      <div className="px-5 py-4 border-b border-border flex items-center gap-2 flex-wrap">
        <svg className="w-5 h-5 text-fuchsia-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        <h2 className="text-base font-semibold text-white">Advanced T20 Metrics</h2>
        <span className="text-xs text-gray-500 ml-2">Boundary %, Dot %, Impact Score &amp; batter archetypes</span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12"><LoadingSpinner size="sm" text="Computing advanced metrics..." /></div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#0e0e1a]">
                  <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-4 w-52 border-b border-border">Metric</th>
                  {players.map((p, i) => {
                    const color = PLAYER_COLORS[i % PLAYER_COLORS.length]
                    return (
                      <th key={p.id} className="text-center px-5 py-4 border-b border-border border-l border-border">
                        <span className="flex items-center justify-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ background: color.stroke }} />
                          <span className="text-xs font-semibold text-white">{getShortName(p.name)}</span>
                        </span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {metricRows.map((row, ri) => {
                  const vals = metrics.map((m) => (m ? (m[row.key] as number) : null))
                  const best = bestIdx(vals, row.lowerBetter)
                  return (
                    <tr key={row.key} className={`border-b border-border/50 hover:bg-white/[0.02] ${ri % 2 === 1 ? 'bg-white/[0.01]' : ''}`}>
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-400" title={row.hint}>
                        {row.label}
                        <span className="block text-[10px] text-gray-600 font-normal mt-0.5">{row.hint}</span>
                      </td>
                      {metrics.map((m, mi) => (
                        <td key={mi} className={`px-5 py-3.5 text-center text-sm border-l border-border/50 ${mi === best ? 'font-bold text-accentLight' : 'font-semibold text-white'}`}>
                          {m ? row.format(m[row.key] as number) : '—'}
                        </td>
                      ))}
                    </tr>
                  )
                })}
                <tr className="border-b border-border/50 bg-white/[0.01]">
                  <td className="px-5 py-3.5 text-sm font-medium text-gray-400">
                    Archetype
                    <span className="block text-[10px] text-gray-600 font-normal mt-0.5">Anchor / Accelerator / Power Hitter / Finisher / Floater</span>
                  </td>
                  {metrics.map((m, mi) => (
                    <td key={mi} className="px-5 py-3.5 text-center border-l border-border/50">
                      {m ? (
                        <span
                          className="inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                          style={{ color: ARCHETYPE_COLOR[m.archetype], borderColor: `${ARCHETYPE_COLOR[m.archetype]}55`, background: `${ARCHETYPE_COLOR[m.archetype]}18` }}
                        >
                          {m.archetype}
                        </span>
                      ) : '—'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Archetype scatter plot — Avg (Y) vs SR (X) */}
          <div className="p-5 border-t border-border">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <h3 className="text-sm font-semibold text-white">Archetype Map — Batting Average vs Strike Rate</h3>
              <div className="flex items-center gap-3 text-[11px]">
                {['Anchor', 'Accelerator', 'Power Hitter', 'Finisher', 'Floater'].map((a) => (
                  <span key={a} className="flex items-center gap-1 text-gray-400">
                    <span className="w-2 h-2 rounded-full" style={{ background: ARCHETYPE_COLOR[a] }} />
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-[640px] mx-auto block" preserveAspectRatio="xMidYMid meet">
                {/* Quadrant backgrounds — neutral "zones", not archetypes */}
                <rect x={padL} y={padT} width={midX - padL} height={midY - padT} fill="#2dd4bf" opacity={0.04} />
                <rect x={midX} y={padT} width={W - padR - midX} height={midY - padT} fill="#ffffff" opacity={0.05} />
                <rect x={padL} y={midY} width={midX - padL} height={H - padB - midY} fill="#94a3b8" opacity={0.04} />
                <rect x={midX} y={midY} width={W - padR - midX} height={H - padB - midY} fill="#fbbf24" opacity={0.05} />

                {/* Gridlines */}
                {[15, 30, 45].map((v) => (
                  <g key={`gy-${v}`}>
                    <line x1={padL} y1={sy(v)} x2={W - padR} y2={sy(v)} stroke="#1e1e3a" strokeWidth={0.5} opacity={0.5} />
                    <text x={padL - 6} y={sy(v) + 3} textAnchor="end" fill="#4b5563" fontSize={10}>{v}</text>
                  </g>
                ))}
                {[100, 120, 140, 160, 180].map((v) => (
                  <g key={`gx-${v}`}>
                    <line x1={sx(v)} y1={padT} x2={sx(v)} y2={H - padB} stroke="#1e1e3a" strokeWidth={0.5} opacity={0.5} />
                    <text x={sx(v)} y={H - padB + 14} textAnchor="middle" fill="#4b5563" fontSize={10}>{v}</text>
                  </g>
                ))}

                {/* Quadrant split lines (SR=140, Avg=30) — highlighted */}
                <line x1={midX} y1={padT} x2={midX} y2={H - padB} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />
                <line x1={padL} y1={midY} x2={W - padR} y2={midY} stroke="#475569" strokeWidth={1} strokeDasharray="3 3" opacity={0.6} />

                {/* Axes */}
                <line x1={padL} y1={H - padB} x2={W - padR} y2={H - padB} stroke="#334155" strokeWidth={1} />
                <line x1={padL} y1={padT} x2={padL} y2={H - padB} stroke="#334155" strokeWidth={1} />

                {/* Axis titles */}
                <text x={(padL + W - padR) / 2} y={H - 6} textAnchor="middle" fill="#64748b" fontSize={11} fontWeight={500}>Strike Rate →</text>
                <text transform={`translate(14, ${(padT + H - padB) / 2}) rotate(-90)`} textAnchor="middle" fill="#64748b" fontSize={11} fontWeight={500}>Batting Average →</text>

                {/* Zone labels — descriptive, not tied 1:1 to archetype names */}
                <text x={padL + 8} y={padT + 14} fill="#94a3b8" fontSize={9} fontWeight={600} opacity={0.85}>HIGH AVG · LOW TEMPO</text>
                <text x={W - padR - 8} y={padT + 14} textAnchor="end" fill="#e2e8f0" fontSize={9} fontWeight={700} opacity={0.9}>ELITE ZONE</text>
                <text x={padL + 8} y={H - padB - 8} fill="#94a3b8" fontSize={9} fontWeight={600} opacity={0.85}>LOW VOLUME</text>
                <text x={W - padR - 8} y={H - padB - 8} textAnchor="end" fill="#94a3b8" fontSize={9} fontWeight={600} opacity={0.85}>HIGH TEMPO · LOW AVG</text>

                {/* Player dots — colored by archetype (matches legend & table pill) */}
                {players.map((p, i) => {
                  const m = metrics[i]
                  const s = selectedStats[i] as any
                  // Skip players with no meaningful sample — a 5-ball debutant
                  // shouldn't anchor to the corner of the plot.
                  const balls = s?.ballsFaced ?? 0
                  if (!m || balls < 30 || (m.sr === 0 && m.avg === 0)) return null
                  const color = ARCHETYPE_COLOR[m.archetype] ?? '#94a3b8'
                  const cx = sx(m.sr)
                  const cy = sy(m.avg)
                  return (
                    <g key={p.id}>
                      <circle cx={cx} cy={cy} r={10} fill={color} opacity={0.22} />
                      <circle cx={cx} cy={cy} r={5.5} fill={color} stroke="#0a0a0f" strokeWidth={1.5} />
                      <text x={cx} y={cy - 11} textAnchor="middle" fill="#f1f5f9" fontSize={10} fontWeight={600} style={{ paintOrder: 'stroke', stroke: '#0a0a0f', strokeWidth: 2 }}>
                        {getShortName(p.name)}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
            <p className="text-[11px] text-gray-600 text-center mt-2 italic">
              Dashed lines split at SR = 140 and Avg = 30. Dot color = archetype (from the table above). Players with fewer than 30 balls faced are hidden.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default function Analytics() {
  const { data: players, isLoading: loadingPlayers } = usePlayers()
  const { data: playerStats, isLoading: loadingStats } = usePlayerStats()
  const { data: workspaces } = useWorkspaces()
  const saveWorkspaceMutation = useSaveWorkspace()
  const deleteWorkspaceMutation = useDeleteWorkspace()

  const { data: teams } = useTeams()
  const { data: venues } = useVenues()
  const { data: seasons } = useSeasons()

  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [workspaceName, setWorkspaceName] = useState('')
  const [shareToast, setShareToast] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const wsMenuRef = useRef<HTMLDivElement>(null)

  // Filter state
  const [seasonRange, setSeasonRange] = useState('all')
  const [teamFilter, setTeamFilter] = useState('all')
  const [venueFilter, setVenueFilter] = useState('all')
  const [phaseFilter, setPhaseFilter] = useState('all')
  const [countryFilter, setCountryFilter] = useState('all')
  const [cappedFilter, setCappedFilter] = useState('all') // 'all' | 'capped' | 'uncapped'

  // Derive season ranges
  const seasonYears = useMemo(() =>
    seasons?.map((s: any) => s.year).sort() || [],
    [seasons]
  )
  const activeTeams = useMemo(() =>
    (teams || []).filter((t: any) => !t.isDefunct).sort((a: any, b: any) => a.name.localeCompare(b.name)),
    [teams]
  )
  const defunctTeams = useMemo(() =>
    (teams || []).filter((t: any) => t.isDefunct).sort((a: any, b: any) => a.name.localeCompare(b.name)),
    [teams]
  )
  const venueList = useMemo(() =>
    (venues || []).sort((a: any, b: any) => b.matchCount - a.matchCount).slice(0, 30),
    [venues]
  )

  // Load workspace from URL on mount
  useEffect(() => {
    const loaded = workspaceService.loadFromUrl(searchParams)
    if (loaded) {
      setSelectedPlayerIds(loaded.playerIds)
      // Clear the ws param after loading so it doesn't persist on subsequent interactions
      const newParams = new URLSearchParams(searchParams)
      newParams.delete('ws')
      setSearchParams(newParams, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
      if (wsMenuRef.current && !wsMenuRef.current.contains(e.target as Node)) {
        setShowWorkspaceMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSaveWorkspace = useCallback(() => {
    if (!workspaceName.trim()) return
    saveWorkspaceMutation.mutate({
      name: workspaceName.trim(),
      playerIds: selectedPlayerIds,
      filters: { seasonRange, teamFilter, venueFilter, phaseFilter, countryFilter, cappedFilter },
    })
    setWorkspaceName('')
    setShowSaveDialog(false)
  }, [workspaceName, selectedPlayerIds, saveWorkspaceMutation])

  const handleLoadWorkspace = useCallback(async (id: number) => {
    const ws = await workspaceService.loadWorkspace(id)
    if (ws) {
      setSelectedPlayerIds(ws.playerIds)
      // Restore filters if saved
      if (ws.filters) {
        const f = typeof ws.filters === 'string' ? JSON.parse(ws.filters) : ws.filters
        if (f.seasonRange) setSeasonRange(f.seasonRange)
        if (f.teamFilter) setTeamFilter(f.teamFilter)
        if (f.venueFilter) setVenueFilter(f.venueFilter)
        if (f.phaseFilter) setPhaseFilter(f.phaseFilter)
        if (f.countryFilter) setCountryFilter(f.countryFilter)
        if (f.cappedFilter) setCappedFilter(f.cappedFilter)
      }
    }
    setShowWorkspaceMenu(false)
  }, [])

  const handleShare = useCallback(() => {
    const url = workspaceService.generateShareUrl({
      name: 'Shared Workspace',
      playerIds: selectedPlayerIds,
      filters: { seasonRange, teamFilter, venueFilter, phaseFilter, countryFilter, cappedFilter },
    })
    navigator.clipboard.writeText(url).then(() => {
      setShareToast(true)
      setTimeout(() => setShareToast(false), 2000)
    })
  }, [selectedPlayerIds])

  // Fuse instance for fuzzy fallback — same shape as the Players page so
  // searches behave identically across the app.
  const fuse = useMemo(() => {
    if (!players) return null
    return new Fuse(players, {
      keys: ['name', 'fullName', 'shortName', 'nicknames', 'teams'],
      threshold: 0.3,
    })
  }, [players])

  // Match Players page: substring across name / fullName / shortName /
  // nicknames, fall back to fuzzy when nothing matches. Min 2 chars.
  // Country / capped filters narrow the dropdown so e.g. "Indian capped
  // batters named Ra…" is one query.
  const filteredPlayers = useMemo(() => {
    if (!players || searchTerm.trim().length < 2) return []
    const lower = searchTerm.toLowerCase()
    let list: any[] = players.filter((p: any) =>
      p.name?.toLowerCase().includes(lower) ||
      p.fullName?.toLowerCase().includes(lower) ||
      p.shortName?.toLowerCase().includes(lower) ||
      p.nicknames?.some((n: string) => n.toLowerCase().includes(lower))
    )
    if (list.length === 0 && fuse) {
      list = fuse.search(searchTerm).map(r => r.item)
    }
    if (countryFilter !== 'all') {
      list = list.filter((p: any) => {
        const c = getPlayerCountry(p.name) ?? getPlayerCountry(p.shortName)
        if (countryFilter === 'India') return c === 'India' || c === null // null = unknown, treated as Indian-default
        return c === countryFilter
      })
    }
    if (cappedFilter !== 'all') {
      list = list.filter((p: any) => {
        const capped = isCappedPlayer(p.name) ?? isCappedPlayer(p.shortName)
        return cappedFilter === 'capped' ? capped === true : capped === false
      })
    }
    return list.filter((p: any) => !selectedPlayerIds.includes(p.id)).slice(0, 8)
  }, [players, searchTerm, selectedPlayerIds, fuse, countryFilter, cappedFilter])

  const selectedPlayers = useMemo(() => {
    if (!players) return []
    return selectedPlayerIds.map(id => players.find(p => p.id === id)).filter(Boolean) as typeof players
  }, [players, selectedPlayerIds])

  // Career-total stats for each selected player — index-aligned with
  // `selectedPlayers` (null when the flat stats file has no row, e.g. for
  // 2026 debutants who haven't played yet or players whose aggregates
  // haven't been rebuilt). DO NOT .filter(Boolean) here — that would shift
  // every subsequent column in the comparison table onto the wrong player.
  const selectedCareerStats = useMemo(() => {
    if (!playerStats) return selectedPlayerIds.map(() => null)
    return selectedPlayerIds.map((id) => playerStats.find((s: any) => s.playerId === id) ?? null)
  }, [playerStats, selectedPlayerIds])

  // Season-specific breakdowns for each selected player. Fired in parallel
  // via useQueries whenever `seasonRange` is a concrete year. TanStack Query
  // caches these individually so switching between seasons is cheap.
  const seasonBreakdownQueries = useQueries({
    queries: selectedPlayers.map((p: any) => {
      const lookup = bbbName(p)
      return {
        queryKey: ['player-season-breakdown', lookup, [seasonRange]],
        queryFn: () => playerStatsService.getSeasonBreakdown(lookup, [seasonRange]),
        enabled: !!lookup && seasonRange !== 'all',
        staleTime: 1000 * 60 * 60,
      }
    }),
  })

  // Fallback: when a player has no entry in the flat stats file, aggregate
  // from BBB via getSeasonBreakdown(all seasons) and sum into a career-shape
  // object. Only enabled for players actually missing from the flat file,
  // so this costs nothing for the common case.
  const fallbackCareerQueries = useQueries({
    queries: selectedPlayers.map((p: any, idx: number) => {
      const hasFlat = !!selectedCareerStats[idx]
      const seasons = ((p?.seasons ?? []) as (string | number)[]).map(String)
      const lookup = bbbName(p)
      return {
        queryKey: ['player-career-fallback', lookup, seasons],
        queryFn: () => playerStatsService.getSeasonBreakdown(lookup, seasons),
        enabled: !!lookup && !hasFlat && seasons.length > 0,
        staleTime: 1000 * 60 * 60,
      }
    }),
  })

  function aggregateBreakdownToCareer(player: any, rows: SeasonBreakdown[] | undefined) {
    const base = {
      playerId: player.id, playerName: player.name,
      matches: 0, runs: 0, ballsFaced: 0, fours: 0, sixes: 0, highScore: 0,
      battingAvg: 0, strikeRate: 0, fifties: 0, hundreds: 0,
      wickets: 0, economy: 0, bowlingAvg: 0, bowlingSR: 0,
      threeWickets: 0, fiveWickets: 0, catches: 0, stumpings: 0, runOuts: 0,
    }
    if (!rows || rows.length === 0) return base
    let matches = 0, runs = 0, balls = 0, fours = 0, sixes = 0, highScore = 0
    let fifties = 0, hundreds = 0, notOuts = 0, battingInnings = 0
    let ballsBowled = 0, runsConceded = 0, wickets = 0
    for (const r of rows) {
      matches += Math.max(r.batting.innings || 0, r.bowling.innings || 0)
      runs += r.batting.runs
      balls += r.batting.balls
      fours += r.batting.fours
      sixes += r.batting.sixes
      if (r.batting.highScore > highScore) highScore = r.batting.highScore
      fifties += r.batting.fifties
      hundreds += r.batting.hundreds
      notOuts += r.batting.notOuts || 0
      battingInnings += r.batting.innings || 0
      ballsBowled += Math.round((r.bowling.overs || 0) * 6)
      runsConceded += r.bowling.runs
      wickets += r.bowling.wickets
    }
    const dismissals = Math.max(0, battingInnings - notOuts)
    const overs = ballsBowled / 6
    return {
      ...base,
      matches, runs, ballsFaced: balls, fours, sixes, highScore, fifties, hundreds, wickets,
      battingAvg: dismissals > 0 ? +(runs / dismissals).toFixed(2) : 0,
      strikeRate: balls > 0 ? +((runs / balls) * 100).toFixed(1) : 0,
      economy: overs > 0 ? +(runsConceded / overs).toFixed(2) : 0,
    }
  }

  // If the season filter is a specific year, compute a career-shape stat
  // object per selected player filtered to just that season. Fields match
  // the `statRows` keys (matches, runs, battingAvg, strikeRate, wickets,
  // economy, fifties, hundreds, fours, sixes) so the comparison table and
  // radar chart keep rendering exactly as before — just with the filtered
  // numbers.
  const selectedStats = useMemo(() => {
    // No season filter → career totals, with BBB-derived fallback for
    // players missing from the flat stats file. Index-aligned with
    // `selectedPlayers` — NEVER filter nulls here.
    if (seasonRange === 'all') {
      return selectedPlayers.map((player: any, idx: number) => {
        const flat = selectedCareerStats[idx]
        if (flat) return flat
        const rows = fallbackCareerQueries[idx]?.data as SeasonBreakdown[] | undefined
        return aggregateBreakdownToCareer(player, rows)
      })
    }

    return selectedPlayers.map((player: any, idx: number) => {
      const q = seasonBreakdownQueries[idx]
      const rows: SeasonBreakdown[] = (q?.data as any) || []
      const row = rows.find(r => r.season === seasonRange)
      if (!row) {
        // No data for this season → return an "empty" stat object so the
        // table still renders the player with dashes instead of collapsing.
        return {
          playerId: player.id,
          playerName: player.name,
          matches: 0, runs: 0, ballsFaced: 0, fours: 0, sixes: 0, highScore: 0,
          battingAvg: 0, strikeRate: 0, fifties: 0, hundreds: 0,
          wickets: 0, ballsBowled: 0, runsConceded: 0, economy: 0,
          bowlingAvg: 0, bowlingSR: 0, threeWickets: 0, fiveWickets: 0,
          catches: 0, stumpings: 0, runOuts: 0,
        }
      }
      // Shape-map SeasonBreakdown → career-like flat stats object.
      return {
        playerId: player.id,
        playerName: player.name,
        // Matches in a season = innings faced or bowled, whichever is higher
        // (a player might bat only, or bowl only — use the max of the two).
        matches: Math.max(row.batting.innings || 0, row.bowling.innings || 0),
        runs: row.batting.runs,
        ballsFaced: row.batting.balls,
        fours: row.batting.fours,
        sixes: row.batting.sixes,
        highScore: row.batting.highScore,
        battingAvg: row.batting.average,
        strikeRate: row.batting.strikeRate,
        fifties: row.batting.fifties,
        hundreds: row.batting.hundreds,
        wickets: row.bowling.wickets,
        economy: row.bowling.economy,
        bowlingAvg: 0,
        bowlingSR: 0,
        threeWickets: 0,
        fiveWickets: 0,
        catches: 0,
        stumpings: 0,
        runOuts: 0,
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasonRange, selectedCareerStats, selectedPlayers, seasonBreakdownQueries.map(q => q.data).join('|'), fallbackCareerQueries.map(q => q.data).join('|')])

  const addPlayer = (id: string) => {
    if (selectedPlayerIds.length < 6 && !selectedPlayerIds.includes(id)) {
      setSelectedPlayerIds([...selectedPlayerIds, id])
    }
    setSearchTerm('')
    setShowDropdown(false)
  }

  const removePlayer = (id: string) => {
    setSelectedPlayerIds(selectedPlayerIds.filter(pid => pid !== id))
  }

  const isLoading = loadingPlayers || loadingStats

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading analytics..." />
  }

  // Stat rows for comparison table
  const statRows = [
    { label: 'Matches', key: 'matches', format: (v: number) => v?.toString() ?? '--' },
    { label: 'Runs', key: 'runs', format: (v: number) => v != null ? v.toLocaleString() : '--' },
    { label: 'Average', key: 'battingAvg', format: (v: number) => v != null ? v.toFixed(2) : '--' },
    { label: 'Strike Rate', key: 'strikeRate', format: (v: number) => v != null ? v.toFixed(1) : '--' },
    { label: 'Wickets', key: 'wickets', format: (v: number) => v != null ? v.toString() : '--' },
    { label: 'Economy', key: 'economy', format: (v: number) => v != null && v > 0 ? v.toFixed(2) : '\u2014' },
    { label: '50s', key: 'fifties', format: (v: number) => v != null ? v.toString() : '--' },
    { label: '100s', key: 'hundreds', format: (v: number) => v != null ? v.toString() : '--' },
    { label: '4s', key: 'fours', format: (v: number) => v != null ? v.toLocaleString() : '--' },
    { label: '6s', key: 'sixes', format: (v: number) => v != null ? v.toLocaleString() : '--' },
  ]

  // Find best value per row for highlighting
  function getBestIndex(key: string) {
    const vals = selectedStats.map((s: any) => s?.[key] ?? null)
    const isLowerBetter = key === 'economy'
    const validVals = vals.filter((v: number | null) => v != null && v > 0)
    if (validVals.length === 0) return -1
    const best = isLowerBetter ? Math.min(...validVals) : Math.max(...validVals)
    return vals.indexOf(best)
  }

  return (
    <div>
      {/* Page Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-transparent" />
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-10">
          <Breadcrumb items={[{ label: 'Analytics Lab' }]} />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-7 sm:h-8 rounded-full bg-accent" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Analytics Lab</h1>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm ml-4 sm:ml-5">Build custom analyses, compare unlimited players</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mt-5 sm:mt-6">

        {/* Search Bar + Player Chips */}
        <div className="bg-card border border-border rounded-xl p-4 sm:p-5 mb-5">
          <div className="relative mb-4" ref={searchRef}>
            <svg className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Add players to your workspace..."
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setShowDropdown(true) }}
              onFocus={() => setShowDropdown(true)}
              className="w-full bg-bg border border-border rounded-lg pl-12 pr-4 py-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-accent"
            />
            {showDropdown && filteredPlayers.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-2xl shadow-black/40 z-50 max-h-64 overflow-y-auto">
                {filteredPlayers.map(p => (
                  <button
                    key={p.id}
                    onClick={() => addPlayer(p.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-bold text-accentLight">
                      {getInitials(p.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{p.name}</p>
                      <p className="text-[11px] text-gray-500">{p.country} &middot; {p.role}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selected player chips */}
          <div className="flex flex-wrap gap-2">
            {selectedPlayers.map((p, i) => {
              const color = PLAYER_COLORS[i % PLAYER_COLORS.length]
              return (
                <span key={p.id} className={`inline-flex items-center gap-2 ${color.bg} ${color.text} border ${color.border} rounded-lg px-3 py-1.5 text-sm font-medium`}>
                  <span className={`w-6 h-6 rounded-full ${color.avatar} flex items-center justify-center text-[10px] font-bold`}>
                    {getInitials(p.name)}
                  </span>
                  {p.name}
                  <button onClick={() => removePlayer(p.id)} className="ml-1 text-lg leading-none opacity-70 hover:opacity-100">&times;</button>
                </span>
              )
            })}
            {selectedPlayers.length === 0 && (
              <p className="text-sm text-gray-600">Search and add players above to start comparing (max 6)</p>
            )}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Season Range</label>
            <select
              value={seasonRange}
              onChange={e => setSeasonRange(e.target.value)}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent w-full sm:w-auto sm:min-w-[150px] appearance-none cursor-pointer"
            >
              <option value="all">All Seasons ({seasonYears[0] || '2008'} – {seasonYears[seasonYears.length - 1] || '2026'})</option>
              <option value="last3">Last 3 Seasons</option>
              <option value="last5">Last 5 Seasons</option>
              <option value="2020+">2020 – Present</option>
              <option value="2015+">2015 – Present</option>
              {seasonYears.map((y: string) => (
                <option key={y} value={y}>{y} Only</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Team</label>
            <select
              value={teamFilter}
              onChange={e => setTeamFilter(e.target.value)}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent w-full sm:w-auto sm:min-w-[120px] appearance-none cursor-pointer"
            >
              <option value="all">All Teams</option>
              <optgroup label="Active Franchises">
                {activeTeams.map((t: any) => (
                  <option key={t.id} value={t.name}>{TEAM_SHORT[t.name] || t.shortName} – {t.name}</option>
                ))}
              </optgroup>
              {defunctTeams.length > 0 && (
                <optgroup label="Defunct / Withdrawn">
                  {defunctTeams.map((t: any) => (
                    <option key={t.id} value={t.name}>{TEAM_SHORT[t.name] || t.shortName} – {t.name}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Venue</label>
            <select
              value={venueFilter}
              onChange={e => setVenueFilter(e.target.value)}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent w-full sm:w-auto sm:min-w-[120px] appearance-none cursor-pointer"
            >
              <option value="all">All Venues</option>
              {venueList.map((v: any) => (
                <option key={v.name} value={v.name}>{v.name} ({v.matchCount})</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Phase</label>
            <select
              value={phaseFilter}
              onChange={e => setPhaseFilter(e.target.value)}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent w-full sm:w-auto sm:min-w-[130px] appearance-none cursor-pointer"
            >
              <option value="all">All Phases</option>
              <option value="powerplay">Powerplay (1-6)</option>
              <option value="middle">Middle (7-15)</option>
              <option value="death">Death (16-20)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Country</label>
            <select
              value={countryFilter}
              onChange={e => setCountryFilter(e.target.value)}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent w-full sm:w-auto sm:min-w-[140px] appearance-none cursor-pointer"
            >
              <option value="all">All Countries</option>
              {COUNTRY_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Cap Status</label>
            <select
              value={cappedFilter}
              onChange={e => setCappedFilter(e.target.value)}
              className="bg-bg border border-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-accent w-full sm:w-auto sm:min-w-[130px] appearance-none cursor-pointer"
            >
              <option value="all">All Players</option>
              <option value="capped">Capped Only</option>
              <option value="uncapped">Uncapped Only</option>
            </select>
          </div>
          {(seasonRange !== 'all' || teamFilter !== 'all' || venueFilter !== 'all' || phaseFilter !== 'all' || countryFilter !== 'all' || cappedFilter !== 'all') && (
            <button
              onClick={() => { setSeasonRange('all'); setTeamFilter('all'); setVenueFilter('all'); setPhaseFilter('all'); setCountryFilter('all'); setCappedFilter('all') }}
              className="text-xs text-red-400 hover:text-red-300 font-medium ml-auto"
            >
              Clear Filters
            </button>
          )}
          {(seasonRange !== 'all' || teamFilter !== 'all' || venueFilter !== 'all' || phaseFilter !== 'all' || countryFilter !== 'all' || cappedFilter !== 'all') && (
            <div className="w-full flex flex-wrap gap-2 mt-2 pt-2 border-t border-border">
              {seasonRange !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium">
                  Season: {seasonRange} <button onClick={() => setSeasonRange('all')} className="ml-0.5 hover:text-white">&times;</button>
                </span>
              )}
              {teamFilter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium">
                  Team: {TEAM_SHORT[teamFilter] || teamFilter} <button onClick={() => setTeamFilter('all')} className="ml-0.5 hover:text-white">&times;</button>
                </span>
              )}
              {venueFilter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  Venue: {venueFilter.split(',')[0]} <button onClick={() => setVenueFilter('all')} className="ml-0.5 hover:text-white">&times;</button>
                </span>
              )}
              {phaseFilter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium">
                  Phase: {phaseFilter} <button onClick={() => setPhaseFilter('all')} className="ml-0.5 hover:text-white">&times;</button>
                </span>
              )}
              {countryFilter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium">
                  Country: {countryFilter} <button onClick={() => setCountryFilter('all')} className="ml-0.5 hover:text-white">&times;</button>
                </span>
              )}
              {cappedFilter !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-medium">
                  {cappedFilter === 'capped' ? 'Capped' : 'Uncapped'} <button onClick={() => setCappedFilter('all')} className="ml-0.5 hover:text-white">&times;</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Empty State when no players selected */}
        {selectedPlayers.length === 0 && (
          <div className="mb-6">
            <EmptyState
              title="Select players to start comparing"
              description="Use the search bar above to add up to 6 players. Compare their stats, view skill radars, and analyze career progressions side by side."
              icon={
                <svg className="w-8 h-8 text-accent/60" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              }
            />
          </div>
        )}

        {/* Comparison Table */}
        {selectedPlayers.length > 0 && (
          <div className="bg-card border border-border rounded-xl overflow-hidden glow mb-6">
            <div className="px-5 py-4 border-b border-border flex items-center gap-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <h2 className="text-base font-semibold text-white">Player Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#0e0e1a]">
                    <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-4 w-40 border-b border-border">Stat</th>
                    {selectedPlayers.map((p, i) => {
                      const color = PLAYER_COLORS[i % PLAYER_COLORS.length]
                      return (
                        <th key={p.id} className="text-center px-5 py-4 border-b border-border border-l border-border">
                          <div className="flex flex-col items-center gap-1.5">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${color.avatar} flex items-center justify-center text-xs font-bold text-white`} style={{ background: `linear-gradient(135deg, ${color.stroke}80, ${color.stroke}40)` }}>
                              {getInitials(p.name)}
                            </div>
                            <span className="text-sm font-semibold text-white">{getShortName(p.name)}</span>
                            <span className="text-[10px] font-medium" style={{ color: color.stroke }}>{p.role}</span>
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {statRows.map((row, ri) => {
                    const bestIdx = getBestIndex(row.key)
                    return (
                      <tr key={row.key} className={`border-b border-border/50 hover:bg-white/[0.02] ${ri % 2 === 1 ? 'bg-white/[0.01]' : ''}`}>
                        <td className="px-5 py-3.5 text-sm font-medium text-gray-400">{row.label}</td>
                        {selectedStats.map((s: any, si: number) => (
                          <td key={si} className={`px-5 py-3.5 text-center text-sm border-l border-border/50 ${si === bestIdx ? 'font-bold text-accentLight' : 'font-semibold text-white'}`}>
                            {row.format(s?.[row.key])}
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Advanced T20 Metrics (cricket-analyst playbook) */}
        {selectedPlayers.length > 0 && (
          <AdvancedMetricsSection
            players={selectedPlayers as unknown as PlayerForAnalytics[]}
            selectedStats={selectedStats}
          />
        )}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Radar Chart Placeholder */}
          <div className="bg-card border border-border rounded-xl overflow-hidden glow">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /></svg>
                <h2 className="text-base font-semibold text-white">Skill Radar</h2>
              </div>
              {selectedPlayers.length > 0 && (
                <div className="flex items-center gap-3 text-xs">
                  {selectedPlayers.slice(0, 4).map((p, i) => (
                    <span key={p.id} className="flex items-center gap-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${PLAYER_COLORS[i % PLAYER_COLORS.length].dot}`} />
                      {p.name.split(' ').pop()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 flex items-center justify-center min-h-[320px]">
              {selectedPlayers.length === 0 ? (
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /></svg>
                  <p className="text-gray-500 text-sm">Add players to see their skill radar comparison</p>
                </div>
              ) : (
                <svg className="w-[280px] h-[264px] md:w-[340px] md:h-[320px]" viewBox="0 0 340 320">
                  <g transform="translate(170, 155)">
                    {/* Pentagon grid layers */}
                    <polygon points="0,-120 114.13,-37.08 70.53,97.08 -70.53,97.08 -114.13,-37.08" fill="none" stroke="#1e1e3a" strokeWidth={1} opacity={0.4} />
                    <polygon points="0,-90 85.6,-27.81 52.9,72.81 -52.9,72.81 -85.6,-27.81" fill="none" stroke="#1e1e3a" strokeWidth={1} opacity={0.3} />
                    <polygon points="0,-60 57.07,-18.54 35.27,48.54 -35.27,48.54 -57.07,-18.54" fill="none" stroke="#1e1e3a" strokeWidth={1} opacity={0.2} />
                    <polygon points="0,-30 28.53,-9.27 17.63,24.27 -17.63,24.27 -28.53,-9.27" fill="none" stroke="#1e1e3a" strokeWidth={1} opacity={0.15} />
                    {/* Axis lines */}
                    <line x1="0" y1="0" x2="0" y2="-120" stroke="#1e1e3a" strokeWidth={1} opacity={0.3} />
                    <line x1="0" y1="0" x2="114.13" y2="-37.08" stroke="#1e1e3a" strokeWidth={1} opacity={0.3} />
                    <line x1="0" y1="0" x2="70.53" y2="97.08" stroke="#1e1e3a" strokeWidth={1} opacity={0.3} />
                    <line x1="0" y1="0" x2="-70.53" y2="97.08" stroke="#1e1e3a" strokeWidth={1} opacity={0.3} />
                    <line x1="0" y1="0" x2="-114.13" y2="-37.08" stroke="#1e1e3a" strokeWidth={1} opacity={0.3} />
                    {/* Player polygons based on stats */}
                    {selectedPlayers.slice(0, 4).map((p, i) => {
                      const s = selectedStats[i] as any
                      if (!s) return null
                      const maxRuns = 8000, maxSR = 180, maxAvg = 60, maxWkt = 200, maxEcon = 12
                      const power = Math.min((s.sixes ?? 0) / 250, 1)
                      const consistency = Math.min((s.battingAvg ?? 0) / maxAvg, 1)
                      const sr = Math.min((s.strikeRate ?? 0) / maxSR, 1)
                      const volume = Math.min((s.runs ?? 0) / maxRuns, 1)
                      const bowling = s.wickets > 10 ? Math.min((s.wickets ?? 0) / maxWkt, 1) : Math.min((s.economy ?? 0) > 0 ? (1 - (s.economy / maxEcon)) : 0, 1)
                      const scale = 120
                      const angles = [
                        { x: 0, y: -1 },
                        { x: 0.9511, y: -0.309 },
                        { x: 0.5878, y: 0.809 },
                        { x: -0.5878, y: 0.809 },
                        { x: -0.9511, y: -0.309 },
                      ]
                      const values = [power, consistency, sr, volume, bowling]
                      const points = angles.map((a, j) => `${a.x * values[j] * scale},${a.y * values[j] * scale}`).join(' ')
                      const color = PLAYER_COLORS[i % PLAYER_COLORS.length]
                      return (
                        <g key={p.id}>
                          <polygon points={points} fill={color.fill} stroke={color.stroke} strokeWidth={2} />
                          {angles.map((a, j) => (
                            <circle key={j} cx={a.x * values[j] * scale} cy={a.y * values[j] * scale} r={3} fill={color.stroke} />
                          ))}
                        </g>
                      )
                    })}
                    {/* Labels */}
                    <text x="0" y="-134" textAnchor="middle" fill="#64748b" fontSize={11} fontWeight={500}>Power</text>
                    <text x="130" y="-37" textAnchor="start" fill="#64748b" fontSize={11} fontWeight={500}>Consistency</text>
                    <text x="82" y="115" textAnchor="middle" fill="#64748b" fontSize={11} fontWeight={500}>Strike Rate</text>
                    <text x="-82" y="115" textAnchor="middle" fill="#64748b" fontSize={11} fontWeight={500}>Volume</text>
                    <text x="-130" y="-37" textAnchor="end" fill="#64748b" fontSize={11} fontWeight={500}>Bowling</text>
                  </g>
                </svg>
              )}
            </div>
          </div>

          {/* Career Progression Chart Placeholder */}
          <div className="bg-card border border-border rounded-xl overflow-hidden glow">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                <h2 className="text-base font-semibold text-white">Career Progression</h2>
              </div>
              {selectedPlayers.length > 0 && (
                <div className="flex items-center gap-3 text-xs">
                  {selectedPlayers.slice(0, 4).map((p, i) => (
                    <span key={p.id} className="flex items-center gap-1">
                      <span className={`w-2.5 h-2.5 rounded-full ${PLAYER_COLORS[i % PLAYER_COLORS.length].dot}`} />
                      {p.name.split(' ').pop()}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 flex items-center justify-center min-h-[280px]">
              {selectedPlayers.length === 0 ? (
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  <p className="text-gray-500 text-sm">Add players to see career progression chart</p>
                </div>
              ) : (
                <svg width="100%" height="280" viewBox="0 0 500 280" preserveAspectRatio="xMidYMid meet">
                  {/* Y-axis grid */}
                  {[30, 80, 130, 180, 230].map(y => (
                    <line key={y} x1="50" y1={y} x2="480" y2={y} stroke="#1e1e3a" strokeWidth={0.5} opacity={0.3} />
                  ))}
                  {/* Y-axis labels */}
                  {['1000', '800', '600', '400', '200'].map((label, i) => (
                    <text key={label} x="42" y={34 + i * 50} textAnchor="end" fill="#4b5563" fontSize={10}>
                      {label}
                    </text>
                  ))}
                  {/* X-axis labels */}
                  {['2020', '2021', '2022', '2023', '2024', '2025'].map((year, i) => (
                    <text key={year} x={50 + i * 86} y="256" textAnchor="middle" fill="#64748b" fontSize={11}>
                      {year}
                    </text>
                  ))}
                  {/* Placeholder lines per player */}
                  {selectedPlayers.slice(0, 4).map((p, idx) => {
                    const s = selectedStats[idx] as any
                    if (!s) return null
                    const color = PLAYER_COLORS[idx % PLAYER_COLORS.length]
                    // Generate a rough rating estimate from stats
                    const baseRating = Math.min(900, Math.max(200,
                      (s.battingAvg ?? 0) * 8 + (s.strikeRate ?? 0) * 2 + (s.wickets ?? 0) * 3 + (s.runs ?? 0) / 20
                    ))
                    const yBase = 230 - ((baseRating - 200) / 800) * 200
                    // Slight variation across years
                    const points = [0, 1, 2, 3, 4, 5].map(i => {
                      const jitter = ((idx * 37 + i * 13) % 30) - 15
                      const y = Math.max(30, Math.min(230, yBase + jitter - i * 3))
                      return `${50 + i * 86},${y}`
                    }).join(' ')
                    const lastPoint = points.split(' ').pop()!.split(',')
                    return (
                      <g key={p.id}>
                        <polyline points={points} fill="none" stroke={color.stroke} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                        {points.split(' ').map((pt, pi) => {
                          const [cx, cy] = pt.split(',')
                          return <circle key={pi} cx={cx} cy={cy} r={pi === 5 ? 4 : 3.5} fill={color.stroke} stroke={pi === 5 ? '#0a0a0f' : undefined} strokeWidth={pi === 5 ? 2 : undefined} />
                        })}
                        <text x="490" y={Number(lastPoint[1]) + 4} fill={color.stroke} fontSize={10} fontWeight={600}>{Math.round(baseRating)}</text>
                      </g>
                    )
                  })}
                </svg>
              )}
            </div>
          </div>
        </div>

        {/* Phase-wise Comparison Section */}
        {selectedPlayers.length >= 2 && (
          <div className="mb-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden glow">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                <h2 className="text-base font-semibold text-white">Phase-wise Comparison</h2>
                <span className="text-xs text-gray-500 ml-2">Strike Rate by Phase (Powerplay / Middle / Death)</span>
              </div>
              <div className="p-5">
                <div className={`grid gap-4 ${selectedPlayers.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : selectedPlayers.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
                  {selectedPlayers.slice(0, 4).map((p, i) => (
                    <PhaseRadarCard key={p.id} player={p as unknown as PlayerForAnalytics} colorIdx={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dismissal Comparison Section */}
        {selectedPlayers.length >= 2 && (
          <div className="mb-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden glow">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                <h2 className="text-base font-semibold text-white">Dismissal Comparison</h2>
                <span className="text-xs text-gray-500 ml-2">How each player gets out</span>
              </div>
              <div className="p-5">
                <div className={`grid gap-4 ${selectedPlayers.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' : selectedPlayers.length === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
                  {selectedPlayers.slice(0, 4).map((p, i) => (
                    <DismissalCard key={p.id} player={p as unknown as PlayerForAnalytics} colorIdx={i} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Season-by-Season Comparison Table */}
        {selectedPlayers.length >= 2 && (
          <SeasonComparisonTable players={selectedPlayers as unknown as PlayerForAnalytics[]} />
        )}

        {/* H2H Head-to-Head Section */}
        {selectedPlayers.length === 2 && (
          <div className="mb-6">
            <div className="bg-card border border-border rounded-xl overflow-hidden glow">
              <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                <h2 className="text-base font-semibold text-white">
                  {getShortName(selectedPlayers[0].name)} vs {getShortName(selectedPlayers[1].name)}
                </h2>
                <span className="text-xs text-gray-500 ml-2">Head-to-Head (Batter vs Bowler)</span>
              </div>
              <div className="p-5">
                <H2HSection
                  playerA={selectedPlayers[0] as unknown as PlayerForAnalytics}
                  playerB={selectedPlayers[1] as unknown as PlayerForAnalytics}
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-3 mb-6 relative">
          {/* Save Workspace */}
          <div className="relative">
            <button
              onClick={() => setShowSaveDialog(!showSaveDialog)}
              disabled={selectedPlayerIds.length === 0}
              className="flex items-center gap-2 bg-accent hover:bg-[#4f46e5] disabled:opacity-40 disabled:cursor-not-allowed text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-lg shadow-accent/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
              Save Workspace
            </button>
            {showSaveDialog && (
              <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-xl shadow-2xl shadow-black/40 z-50 p-4 w-72">
                <label className="text-xs font-medium text-gray-400 mb-1.5 block">Workspace Name</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={e => setWorkspaceName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSaveWorkspace()}
                  placeholder="My comparison..."
                  className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-accent mb-3"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveWorkspace}
                    disabled={!workspaceName.trim()}
                    className="flex-1 bg-accent hover:bg-[#4f46e5] disabled:opacity-40 text-white px-3 py-2 rounded-lg text-sm font-semibold transition"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowSaveDialog(false)}
                    className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Load Workspace */}
          <div className="relative" ref={wsMenuRef}>
            <button
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className="flex items-center gap-2 bg-bg border border-border hover:border-accent/50 text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
              Load Workspace
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showWorkspaceMenu && (
              <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded-xl shadow-2xl shadow-black/40 z-50 w-72 max-h-64 overflow-y-auto">
                {(!workspaces || workspaces.length === 0) ? (
                  <div className="px-4 py-6 text-center text-sm text-gray-500">No saved workspaces</div>
                ) : (
                  workspaces.map(ws => (
                    <div key={ws.id} className="flex items-center justify-between px-4 py-2.5 hover:bg-white/[0.04] transition group">
                      <button
                        onClick={() => handleLoadWorkspace(ws.id!)}
                        className="flex-1 text-left"
                      >
                        <p className="text-sm font-medium text-white">{ws.name}</p>
                        <p className="text-[11px] text-gray-500">{ws.playerIds.length} players &middot; {new Date(ws.updatedAt).toLocaleDateString()}</p>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteWorkspaceMutation.mutate(ws.id!) }}
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition p-1"
                        title="Delete workspace"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Share Link */}
          <button
            onClick={handleShare}
            disabled={selectedPlayerIds.length === 0}
            className="flex items-center gap-2 bg-bg border border-border hover:border-accent/50 disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium transition relative"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
            {shareToast ? 'Copied!' : 'Share Link'}
          </button>

          <button className="flex items-center gap-2 bg-bg border border-border hover:border-green-500/40 text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium transition">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Export File
          </button>
          <button className="flex items-center gap-2 bg-bg border border-border hover:border-purple-500/40 text-gray-300 px-5 py-2.5 rounded-lg text-sm font-medium transition">
            <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            Export Image
          </button>
        </div>

        <div className="mb-10" />
      </div>
    </div>
  )
}
