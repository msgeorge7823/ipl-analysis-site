// Live Match page (/live).
// Broadcast-style "today" view: surfaces the in-progress / next-up match
// with venue weather, squads, recent form, head-to-head, and a streaming
// scorecard once a live data feed is wired in.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useSeasons, useMatches, useBatting, useBowling, useOfficialSquads } from '@/hooks/useData'
import { dataService } from '@/services/dataService'
import { TEAM_SHORT, TEAM_COLORS } from '@/lib/constants'
import Breadcrumb from '@/components/ui/Breadcrumb'
import TeamBadge from '@/components/ui/TeamBadge'
import PlayerLink from '@/components/ui/PlayerLink'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import VenueMap from '@/components/venue/VenueMap'
import VenueWeather from '@/components/venue/VenueWeather'
import { inferIstKickoffHour } from '@/lib/matchTime'

// ── Types ──

type TabId = 'info' | 'live' | 'scorecard' | 'squads' | 'mvp'

interface BallData {
  m: string
  i: number
  o: number
  b: number
  bat: string
  bwl: string
  br: number
  er: number
  tr: number
  ex?: Record<string, number> | string
  w?: { k: string; p: string; f?: string[] }[]
  sp?: number
}

function formatSpeed(sp?: number): { kph: string; mph: string } | null {
  if (typeof sp !== 'number' || !isFinite(sp) || sp <= 0) return null
  return {
    kph: `${sp.toFixed(1)} kph`,
    mph: `${(sp * 0.621371).toFixed(1)} mph`,
  }
}

// ── Helpers ──

function hasExtra(ball: BallData, type: string): boolean {
  if (!ball.ex) return false
  if (typeof ball.ex === 'string') return ball.ex === type
  return !!(ball.ex as any)[type] || !!(ball.ex as any)[type + 's']
}

function isWide(ball: BallData): boolean {
  return hasExtra(ball, 'wide') || hasExtra(ball, 'wides')
}

function isNoBall(ball: BallData): boolean {
  return hasExtra(ball, 'noball') || hasExtra(ball, 'noballs')
}

function isExtraDelivery(ball: BallData): boolean {
  if (!ball.ex) return false
  if (typeof ball.ex === 'object') return Object.keys(ball.ex).length > 0
  return !!ball.ex
}

function getBallCircleStyle(ball: BallData): string {
  if (ball.w && ball.w.length > 0) return 'bg-red-500 text-white'
  if (isWide(ball) || isNoBall(ball)) return 'bg-orange-500 text-white'
  const runs = ball.br ?? 0
  if (runs === 0 && !isExtraDelivery(ball)) return 'bg-gray-600/60 text-gray-300'
  if (runs >= 6) return 'bg-yellow-500 text-gray-900'
  if (runs === 4) return 'bg-green-500 text-white'
  if (runs === 2 || runs === 3) return 'bg-sky-500/80 text-white'
  return 'bg-white/10 text-white'
}

function getMiniCircleStyle(ball: BallData): string {
  if (ball.w && ball.w.length > 0) return 'bg-red-500 text-white'
  if (isWide(ball) || isNoBall(ball)) return 'bg-orange-500 text-white'
  const runs = ball.br ?? 0
  if (runs === 0 && !isExtraDelivery(ball)) return 'bg-gray-600/60 text-gray-300'
  if (runs >= 6) return 'bg-yellow-500 text-gray-900'
  if (runs === 4) return 'bg-green-500 text-white'
  if (runs === 2 || runs === 3) return 'bg-sky-500/80 text-white'
  return 'bg-white/10 text-white'
}

function getBallLabel(ball: BallData): string {
  if (ball.w && ball.w.length > 0) return 'W'
  if (isWide(ball)) return 'wd'
  if (isNoBall(ball)) return 'nb'
  if (isExtraDelivery(ball) && ball.br === 0) return String(ball.tr ?? 0)
  return String(ball.br ?? 0)
}

function getBallRowStyle(ball: BallData): string {
  if (ball.w && ball.w.length > 0)
    return 'bg-red-500/10 border border-red-500/30 border-l-4 border-l-red-500'
  if ((ball.br ?? 0) >= 6) return 'bg-yellow-500/5 border-l-2 border-l-yellow-500'
  if ((ball.br ?? 0) === 4) return 'bg-green-500/5 border-l-2 border-l-green-500'
  if (isExtraDelivery(ball)) return 'bg-orange-500/5 border-l-2 border-l-orange-500'
  return ''
}

function getBallDescription(ball: BallData): React.ReactNode {
  const bowler = ball.bwl
  const batter = ball.bat
  const runs = ball.br ?? 0

  if (ball.w && ball.w.length > 0) {
    const w = ball.w[0]
    const fielderList = w.f && w.f.length > 0 ? w.f : []
    return (
      <>
        <span className="font-semibold text-white"><PlayerLink name={bowler} className="hover:text-indigo-400 transition-colors" /> to <PlayerLink name={batter} className="hover:text-indigo-400 transition-colors" /></span>
        {' '}&mdash;{' '}
        <span className="text-red-500 font-bold">WICKET!</span>{' '}
        <PlayerLink name={w.p} className="hover:text-indigo-400 transition-colors" />{' '}
        {w.k}
        {fielderList.length > 0 && (
          <>
            {' ('}
            {fielderList.map((f, i) => (
              <span key={i}>
                {i > 0 && ', '}
                <PlayerLink name={f} className="hover:text-indigo-400 transition-colors" />
              </span>
            ))}
            {')'}
          </>
        )}{' '}
        b <PlayerLink name={bowler} className="hover:text-indigo-400 transition-colors" />
      </>
    )
  }

  if (runs >= 6) {
    return (
      <>
        <span className="font-semibold text-white"><PlayerLink name={bowler} className="hover:text-indigo-400 transition-colors" /> to <PlayerLink name={batter} className="hover:text-indigo-400 transition-colors" /></span>
        {' '}&mdash;{' '}
        <span className="text-yellow-500 font-bold">SIX!</span>
      </>
    )
  }

  if (runs === 4) {
    return (
      <>
        <span className="font-semibold text-white"><PlayerLink name={bowler} className="hover:text-indigo-400 transition-colors" /> to <PlayerLink name={batter} className="hover:text-indigo-400 transition-colors" /></span>
        {' '}&mdash;{' '}
        <span className="text-green-500 font-bold">FOUR!</span>
      </>
    )
  }

  if (isExtraDelivery(ball)) {
    const exLabel = isWide(ball) ? 'Wide' : isNoBall(ball) ? 'No ball' : 'Extra'
    return (
      <>
        <span className="font-semibold text-white"><PlayerLink name={bowler} className="hover:text-indigo-400 transition-colors" /> to <PlayerLink name={batter} className="hover:text-indigo-400 transition-colors" /></span>
        {' '}&mdash;{' '}
        <span className="text-orange-500 font-bold">{exLabel}!</span>
        {ball.tr > 0 && ` +${ball.tr} run${ball.tr > 1 ? 's' : ''}`}
      </>
    )
  }

  if (runs === 0) {
    return (
      <>
        <span className="font-semibold text-white"><PlayerLink name={bowler} className="hover:text-indigo-400 transition-colors" /> to <PlayerLink name={batter} className="hover:text-indigo-400 transition-colors" /></span>
        {' '}&mdash; Dot ball.
      </>
    )
  }

  return (
    <>
      <span className="font-semibold text-white"><PlayerLink name={bowler} className="hover:text-indigo-400 transition-colors" /> to <PlayerLink name={batter} className="hover:text-indigo-400 transition-colors" /></span>
      {' '}&mdash; {runs} run{runs > 1 ? 's' : ''}.
    </>
  )
}

function srColor(sr: number, balls: number): string {
  if (balls < 5) return 'text-gray-300'
  if (sr >= 150) return 'text-green-500'
  if (sr >= 120) return 'text-green-400'
  if (sr >= 100) return 'text-gray-300'
  return 'text-red-500'
}

function econColor(econ: number): string {
  if (econ <= 7) return 'text-green-500'
  if (econ <= 9) return 'text-gray-400'
  if (econ <= 10) return 'text-yellow-500'
  return 'text-red-500'
}

function formatOverBall(over: number, ball: number): string {
  return `${over}.${ball}`
}

// ── MVP Rating Helpers ──

function computeBatRating(runs: number, balls: number, fours: number, sixes: number): number {
  if (balls === 0) return 0
  const sr = (runs / balls) * 100
  const base = (runs / 20) + (sr > 150 ? 1.5 : sr > 130 ? 0.8 : 0) + (sixes * 0.3) + (fours * 0.15)
  return Math.min(10, Math.round(base * 10) / 10)
}

function computeBowlRating(wickets: number, runs: number, overs: number, maidens: number): number {
  if (overs === 0) return 0
  const economy = runs / overs
  const base = (wickets * 2.5) + (economy < 7 ? 2 : economy < 9 ? 1 : 0) + (maidens * 1.5)
  return Math.min(10, Math.round(base * 10) / 10)
}

function computeFieldRating(catches: number, runOuts: number, stumpings: number): number {
  const base = (catches * 2) + (runOuts * 3) + (stumpings * 2.5)
  return Math.min(10, Math.round(base * 10) / 10)
}

function computeOverallRating(bat: number, bowl: number, field: number, hasBat: boolean, hasBowl: boolean): number {
  if (hasBat && hasBowl) {
    return Math.round((bat * 0.4 + bowl * 0.35 + field * 0.25) * 10) / 10
  }
  if (hasBat) {
    return Math.round((bat * 0.65 + field * 0.35) * 10) / 10
  }
  if (hasBowl) {
    return Math.round((bowl * 0.65 + field * 0.35) * 10) / 10
  }
  return Math.round(field * 10) / 10
}

function ratingColor(rating: number): string {
  if (rating >= 9) return 'text-yellow-400'
  if (rating >= 7) return 'text-green-400'
  if (rating >= 5) return 'text-indigo-400'
  if (rating >= 3) return 'text-orange-400'
  return 'text-red-500'
}

function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

// ── Component ──

export default function LiveMatch() {
  const [activeTab, setActiveTab] = useState<TabId>('live')
  const [selectedInnings, setSelectedInnings] = useState<1 | 2>(2)
  const [expandedAccordion, setExpandedAccordion] = useState<Record<number, boolean>>({ 1: true, 2: false })
  const [showAllOvers, setShowAllOvers] = useState(false)

  const { data: seasons } = useSeasons()

  const latestYear = useMemo(() => {
    if (!seasons || seasons.length === 0) return ''
    return seasons.map((s: any) => s.year).sort((a: string, b: string) => b.localeCompare(a))[0]
  }, [seasons])

  const { data: matches, isLoading: matchesLoading } = useMatches(latestYear)
  const { data: batting } = useBatting(latestYear)
  const { data: bowling } = useBowling(latestYear)
  const { data: squads } = useOfficialSquads()

  const { data: bbb } = useQuery({
    queryKey: ['bbb', latestYear],
    queryFn: () => dataService.getBBB(latestYear),
    staleTime: 1000 * 60 * 60,
    enabled: !!latestYear,
  })

  // Most recent completed match
  const match = useMemo(() => {
    if (!matches || matches.length === 0) return null
    return [...matches].sort((a: any, b: any) => b.date.localeCompare(a.date))[0]
  }, [matches])

  const matchId = match?.id || ''

  // Ball-by-ball for this match
  const matchBalls = useMemo(() => {
    if (!bbb || !matchId) return [] as BallData[]
    return (bbb as BallData[]).filter((b) => b.m === matchId)
  }, [bbb, matchId])

  // Batting scorecard
  const matchBatting = useMemo(() => {
    if (!batting || !matchId) return []
    return (batting as any[]).filter((b: any) => b.matchId === matchId)
  }, [batting, matchId])

  // Bowling scorecard
  const matchBowling = useMemo(() => {
    if (!bowling || !matchId) return []
    return (bowling as any[]).filter((b: any) => b.matchId === matchId)
  }, [bowling, matchId])

  // Grouped BBB by innings and overs (most recent first)
  const groupedOvers = useMemo(() => {
    const result: Record<number, { overNum: number; balls: BallData[]; totalRuns: number }[]> = { 1: [], 2: [] }

    for (const inn of [1, 2] as const) {
      const innBalls = matchBalls.filter((b) => b.i === inn)
      const overMap: Record<number, BallData[]> = {}
      for (const ball of innBalls) {
        const ov = (ball.o ?? 0) + 1
        if (!overMap[ov]) overMap[ov] = []
        overMap[ov].push(ball)
      }
      const overNums = Object.keys(overMap).map(Number).sort((a, b) => b - a) // descending
      result[inn] = overNums.map((ov) => ({
        overNum: ov,
        balls: overMap[ov].sort((a, b) => (b.b ?? 0) - (a.b ?? 0)), // descending within over
        totalRuns: overMap[ov].reduce((sum, b) => sum + (b.tr ?? 0), 0),
      }))
    }
    return result
  }, [matchBalls])

  // Top scorers per innings
  const topScorer = useMemo(() => {
    const result: Record<number, any> = {}
    for (const inn of [1, 2]) {
      const innBat = matchBatting.filter((b: any) => b.innings === inn)
      if (innBat.length > 0) {
        result[inn] = innBat.reduce((a: any, b: any) => (b.runs > a.runs ? b : a), innBat[0])
      }
    }
    return result
  }, [matchBatting])

  // Best bowler per innings
  const bestBowler = useMemo(() => {
    const result: Record<number, any> = {}
    for (const inn of [1, 2]) {
      const innBowl = matchBowling.filter((b: any) => b.innings === inn)
      if (innBowl.length > 0) {
        result[inn] = innBowl.reduce((a: any, b: any) => {
          if (b.wickets > a.wickets) return b
          if (b.wickets === a.wickets && b.economy < a.economy) return b
          return a
        }, innBowl[0])
      }
    }
    return result
  }, [matchBowling])

  // Playing XI: players who appear in batting or bowling scorecards for this match
  const playingXI = useMemo(() => {
    const result: Record<string, string[]> = {}
    if (!match) return result
    for (const inn of [1, 2]) {
      const teamName = match.innings?.[inn - 1]?.team || ''
      if (!teamName) continue
      const batters = matchBatting.filter((b: any) => b.innings === inn).map((b: any) => b.batter)
      const bowlers = matchBowling.filter((b: any) => b.innings === inn).map((b: any) => b.bowler)
      // Batters belong to the batting team, bowlers to the bowling team
      if (!result[teamName]) result[teamName] = []
      result[teamName] = [...new Set([...result[teamName], ...batters])]
      // Bowlers are from the OTHER team (they bowl in this innings)
      const bowlTeam = match.innings?.[inn === 1 ? 1 : 0]?.team || ''
      if (bowlTeam) {
        if (!result[bowlTeam]) result[bowlTeam] = []
        result[bowlTeam] = [...new Set([...result[bowlTeam], ...bowlers])]
      }
    }
    return result
  }, [match, matchBatting, matchBowling])

  // Fielding stats extracted from wickets in BBB data
  const fieldingStats = useMemo(() => {
    const stats: Record<string, { catches: number; runOuts: number; stumpings: number }> = {}
    for (const ball of matchBalls) {
      if (ball.w) {
        for (const w of ball.w) {
          const fielders = w.f || []
          const kind = (w.k || '').toLowerCase()
          for (const f of fielders) {
            if (!stats[f]) stats[f] = { catches: 0, runOuts: 0, stumpings: 0 }
            if (kind.includes('caught')) stats[f].catches++
            else if (kind.includes('run out')) stats[f].runOuts++
            else if (kind.includes('stumped')) stats[f].stumpings++
            else stats[f].catches++ // default to catch
          }
        }
      }
    }
    return stats
  }, [matchBalls])

  // MVP ratings computation
  const mvpData = useMemo(() => {
    if (!match) return []
    const playerMap: Record<string, {
      name: string; team: string; teamColor: string;
      batRuns: number; batBalls: number; fours: number; sixes: number;
      bowlWickets: number; bowlRuns: number; bowlOvers: number; bowlMaidens: number;
      catches: number; runOuts: number; stumpings: number;
      hasBat: boolean; hasBowl: boolean;
    }> = {}

    const ensurePlayer = (name: string, team: string) => {
      if (!playerMap[name]) {
        playerMap[name] = {
          name, team, teamColor: TEAM_COLORS[team]?.primary || '#6366f1',
          batRuns: 0, batBalls: 0, fours: 0, sixes: 0,
          bowlWickets: 0, bowlRuns: 0, bowlOvers: 0, bowlMaidens: 0,
          catches: 0, runOuts: 0, stumpings: 0,
          hasBat: false, hasBowl: false,
        }
      }
    }

    // Process batting
    for (const b of matchBatting as any[]) {
      const teamName = match.innings?.[b.innings - 1]?.team || ''
      ensurePlayer(b.batter, teamName)
      const p = playerMap[b.batter]
      p.batRuns += b.runs || 0
      p.batBalls += b.balls || 0
      p.fours += b.fours || 0
      p.sixes += b.sixes || 0
      p.hasBat = true
    }

    // Process bowling
    for (const b of matchBowling as any[]) {
      const bowlTeamIdx = b.innings === 1 ? 1 : 0
      const teamName = match.innings?.[bowlTeamIdx]?.team || ''
      ensurePlayer(b.bowler, teamName)
      const p = playerMap[b.bowler]
      p.bowlWickets += b.wickets || 0
      p.bowlRuns += b.runs || 0
      p.bowlOvers += (typeof b.overs === 'number' ? b.overs : parseFloat(b.overs) || 0)
      p.bowlMaidens += b.maidens || 0
      p.hasBowl = true
    }

    // Process fielding
    for (const [name, fs] of Object.entries(fieldingStats)) {
      // Find which team this fielder belongs to
      let team = ''
      for (const [t, players] of Object.entries(playingXI)) {
        if (players.includes(name)) { team = t; break }
      }
      if (!team) continue
      ensurePlayer(name, team)
      playerMap[name].catches += fs.catches
      playerMap[name].runOuts += fs.runOuts
      playerMap[name].stumpings += fs.stumpings
    }

    return Object.values(playerMap).map(p => {
      const bat = computeBatRating(p.batRuns, p.batBalls, p.fours, p.sixes)
      const bowl = computeBowlRating(p.bowlWickets, p.bowlRuns, p.bowlOvers, p.bowlMaidens)
      const field = computeFieldRating(p.catches, p.runOuts, p.stumpings)
      const overall = computeOverallRating(bat, bowl, field, p.hasBat, p.hasBowl)
      return { ...p, batRating: bat, bowlRating: bowl, fieldRating: field, overallRating: overall }
    }).sort((a, b) => b.overallRating - a.overallRating)
  }, [match, matchBatting, matchBowling, fieldingStats, playingXI])

  // Loading state
  if (!seasons || matchesLoading) {
    return <LoadingSpinner size="lg" text="Loading live match data..." />
  }

  if (!match) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <Breadcrumb items={[{ label: 'Live Match' }]} />
        <div className="text-center py-20 text-gray-400">No match data available.</div>
      </main>
    )
  }

  const inn1 = match.innings?.[0]
  const inn2 = match.innings?.[1]
  const team1 = inn1?.team || match.team1 || ''
  const team2 = inn2?.team || match.team2 || ''
  const short1 = TEAM_SHORT[team1] || team1.slice(0, 3).toUpperCase()
  const short2 = TEAM_SHORT[team2] || team2.slice(0, 3).toUpperCase()

  const resultText = match.winner
    ? `${match.winner} won${match.winMargin?.runs ? ` by ${match.winMargin.runs} runs` : match.winMargin?.wickets ? ` by ${match.winMargin.wickets} wickets` : ''}`
    : match.result || 'No result'

  const score1 = inn1 ? `${inn1.runs}/${inn1.wickets}` : ''
  const overs1 = inn1 ? `(${inn1.overs} ov)` : ''
  const score2 = inn2 ? `${inn2.runs}/${inn2.wickets}` : ''
  const overs2 = inn2 ? `(${inn2.overs} ov)` : ''

  const matchDate = match.date
    ? new Date(match.date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  // Commentary overs to display
  const currentOvers = groupedOvers[selectedInnings] || []
  const displayOvers = showAllOvers ? currentOvers : currentOvers.slice(0, 5)

  const tabs: { id: TabId; label: string; icon?: 'star' }[] = [
    { id: 'info', label: 'Info' },
    { id: 'live', label: 'Live' },
    { id: 'scorecard', label: 'Scorecard' },
    { id: 'squads', label: 'Squads' },
    { id: 'mvp', label: 'Match MVP', icon: 'star' },
  ]

  return (
    <>
      {/* ══════ STICKY SCORE HEADER ══════ */}
      <header className="bg-[#131320] border-b border-[#1e1e3a] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-5">
          {/* Score Row */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12">
            {/* Team 1 Side */}
            <div className="flex items-center gap-3 sm:gap-4">
              <TeamBadge team={team1} className="w-12 h-12 sm:w-14 sm:h-14" season={match.season} />
              <div className="text-right sm:text-left">
                <div className="text-xs sm:text-sm text-gray-400 font-medium">{team1}</div>
                {inn1 && (
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    {score1}{' '}
                    <span className="text-sm sm:text-base font-normal text-gray-400">{overs1}</span>
                  </div>
                )}
              </div>
            </div>

            {/* VS + Status Badge */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <span className="text-gray-400 font-semibold text-sm">vs</span>
              <span className="inline-flex items-center gap-1 bg-green-500/20 border border-green-500/40 rounded-full px-2.5 py-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-green-500 text-xs font-bold tracking-wide">COMPLETED</span>
              </span>
            </div>

            {/* Team 2 Side */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="sm:order-2">
                <div className="text-xs sm:text-sm text-gray-400 font-medium">{team2}</div>
                {inn2 && (
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    {score2}{' '}
                    <span className="text-sm sm:text-base font-normal text-gray-400">{overs2}</span>
                  </div>
                )}
              </div>
              <TeamBadge
                team={team2}
                className="w-12 h-12 sm:w-14 sm:h-14 sm:order-3"
                season={match.season}
              />
            </div>
          </div>

          {/* Result Text */}
          <div className="text-center mt-3">
            <div className="text-sm sm:text-base font-semibold text-indigo-400">{resultText}</div>
          </div>

          {/* Match Info Line */}
          <div className="text-center mt-1.5">
            <div className="text-xs sm:text-sm text-gray-400">
              Match {match.matchNumber} &middot; IPL {match.season} &middot;{' '}
              {match.venue}
              {match.city ? `, ${match.city}` : ''}
            </div>
          </div>
        </div>

        {/* ══════ TAB BAR ══════ */}
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex gap-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-500 text-white'
                    : 'border-b-2 border-transparent text-gray-400 hover:text-gray-200 hover:border-[#1e1e3a]'
                }`}
              >
                {tab.icon === 'star' && (
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                )}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ══════ MAIN CONTENT ══════ */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: 'Live Match' }]} />

        {/* Coming Soon Banner */}
        <div className="relative mb-6 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20" />
          <div className="relative border border-indigo-500/30 rounded-xl px-5 py-3 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
              </span>
              <span className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Coming Soon</span>
            </div>
            <p className="text-sm text-gray-300 text-center sm:text-left">
              Live match updates coming soon &mdash; showing most recent completed match.
            </p>
          </div>
        </div>

        {/* ═══════════ COMING SOON CARD (shown for all tabs) ═══════════ */}
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-8 sm:p-12 text-center">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
              <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="inline-block px-3 py-1 mb-3 rounded-full bg-indigo-500/10 border border-indigo-500/30">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
              {activeTab === 'info' && 'Match Info'}
              {activeTab === 'live' && 'Live Feed'}
              {activeTab === 'scorecard' && 'Scorecard'}
              {activeTab === 'squads' && 'Squads'}
              {activeTab === 'mvp' && 'Match MVP'}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Coming Soon</h2>
          <p className="text-sm sm:text-base text-gray-400 max-w-lg mx-auto">
            This tab is under active development. Live match tracking, detailed scorecards, squads, and MVP analysis will be available here soon.
          </p>
        </div>

        {/* ═══════════ TAB: INFO ═══════════ */}
        {false && activeTab === 'info' && (
          <div className="space-y-6">
            {/* Match Info Card */}
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Match Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Match</span>
                    <p className="text-sm text-white font-medium">
                      Match {match.matchNumber}, Indian Premier League {match.season}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Date</span>
                    <p className="text-sm text-white font-medium">{matchDate}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Toss</span>
                    <p className="text-sm text-white font-medium">
                      {match.tossWinner} won the toss and chose to {match.tossDecision}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Result</span>
                    <p className="text-sm font-medium flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                      <span className="text-green-400 font-semibold">Completed</span>
                      <span className="text-gray-400">&mdash; {resultText}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Match Officials Card */}
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Match Officials
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Umpire 1 */}
                <div className="flex items-center gap-3 bg-[#0a0a0f]/50 rounded-lg p-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <span className="text-indigo-400 text-xs font-bold">U1</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Umpire 1</p>
                    <p className="text-sm text-white font-medium">{match.umpires?.[0] || 'TBA'}</p>
                  </div>
                </div>
                {/* Umpire 2 */}
                <div className="flex items-center gap-3 bg-[#0a0a0f]/50 rounded-lg p-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <span className="text-indigo-400 text-xs font-bold">U2</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Umpire 2</p>
                    <p className="text-sm text-white font-medium">{match.umpires?.[1] || 'TBA'}</p>
                  </div>
                </div>
                {/* 3rd Umpire */}
                <div className="flex items-center gap-3 bg-[#0a0a0f]/50 rounded-lg p-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <span className="text-indigo-400 text-xs font-bold">3U</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">3rd Umpire</p>
                    <p className="text-sm text-white font-medium">{match.umpires?.[2] || 'Not Available'}</p>
                  </div>
                </div>
                {/* Match Referee */}
                <div className="flex items-center gap-3 bg-[#0a0a0f]/50 rounded-lg p-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center">
                    <span className="text-indigo-400 text-xs font-bold">MR</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Match Referee</p>
                    <p className="text-sm text-white font-medium">{match.umpires?.[3] || 'Not Available'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Venue Card */}
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Venue
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Stadium</span>
                  <p className="text-sm text-white font-medium">
                    <Link
                      to={`/venues/${encodeURIComponent(match.venue)}`}
                      className="hover:text-indigo-400 transition"
                    >
                      {match.venue}
                    </Link>
                  </p>
                </div>
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Place</span>
                  <p className="text-sm text-white font-medium">{match.city || 'India'}</p>
                </div>
              </div>
              {/* Live weather (Open-Meteo, refreshes every 15 minutes) */}
              <div className="mt-4 pt-4 border-t border-[#1e1e3a]">
                <VenueWeather
                  date={match.date}
                  city={match.city}
                  kickoffHour={inferIstKickoffHour(
                    match,
                    (matches as any[]) || []
                  )}
                />
              </div>

              {/* Map + Get Directions */}
              <div className="mt-4 pt-4 border-t border-[#1e1e3a]">
                <VenueMap venue={match.venue} city={match.city} />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ TAB: LIVE ═══════════ */}
        {false && activeTab === 'live' && (
          <div className="space-y-5">
            {/* Live Scorecard Summary */}
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-5">
              {/* Batters Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Last Batters */}
                <div className="bg-[#0a0a0f]/60 rounded-lg p-3">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                    {selectedInnings === 1 ? '1st' : '2nd'} Innings &mdash; Top Batters
                  </div>
                  <div className="space-y-2">
                    {matchBatting
                      .filter((b: any) => b.innings === selectedInnings)
                      .sort((a: any, b: any) => b.runs - a.runs)
                      .slice(0, 3)
                      .map((b: any) => {
                        const teamName = match.innings?.[selectedInnings - 1]?.team || ''
                        const teamColor = TEAM_COLORS[teamName]?.primary || '#6366f1'
                        const sr = b.balls > 0 ? ((b.runs / b.balls) * 100) : 0
                        const initials = b.batter
                          .split(' ')
                          .map((w: string) => w[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                        return (
                          <div key={b.batter}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border"
                                  style={{
                                    background: `linear-gradient(135deg, ${teamColor}70, ${teamColor})`,
                                    borderColor: `${teamColor}40`,
                                  }}
                                >
                                  <span className="text-[9px] font-bold text-white">{initials}</span>
                                </div>
                                <span className="text-sm font-semibold text-white">
                                  {b.batter}
                                  {b.dismissal === 'not out' && (
                                    <span className="text-indigo-400">*</span>
                                  )}
                                </span>
                              </div>
                              <div className="text-sm font-bold text-white">
                                {b.runs}{' '}
                                <span className="text-xs font-normal text-gray-400">({b.balls})</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-gray-400 ml-9">
                              <span>{b.fours} x 4s</span>
                              <span>{b.sixes} x 6s</span>
                              <span>SR: {sr.toFixed(2)}</span>
                            </div>
                            {b !== matchBatting.filter((x: any) => x.innings === selectedInnings).sort((a: any, c: any) => c.runs - a.runs).slice(0, 3).at(-1) && (
                              <div className="h-px bg-[#1e1e3a] my-1" />
                            )}
                          </div>
                        )
                      })}
                  </div>
                </div>

                {/* Best Bowler */}
                <div className="bg-[#0a0a0f]/60 rounded-lg p-3 space-y-3">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                      {selectedInnings === 1 ? '1st' : '2nd'} Innings &mdash; Top Bowlers
                    </div>
                    <div className="space-y-2">
                      {matchBowling
                        .filter((b: any) => b.innings === selectedInnings)
                        .sort((a: any, b: any) => b.wickets - a.wickets || a.economy - b.economy)
                        .slice(0, 3)
                        .map((b: any) => {
                          // Bowling team is the opposite innings team
                          const bowlingTeamIdx = selectedInnings === 1 ? 1 : 0
                          const bowlTeamName = match.innings?.[bowlingTeamIdx]?.team || ''
                          const bowlTeamColor = TEAM_COLORS[bowlTeamName]?.primary || '#6366f1'
                          const initials = b.bowler
                            .split(' ')
                            .map((w: string) => w[0])
                            .join('')
                            .slice(0, 2)
                            .toUpperCase()
                          return (
                            <div key={b.bowler} className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border"
                                  style={{
                                    background: `linear-gradient(135deg, ${bowlTeamColor}70, ${bowlTeamColor})`,
                                    borderColor: `${bowlTeamColor}40`,
                                  }}
                                >
                                  <span className="text-[9px] font-bold text-white">{initials}</span>
                                </div>
                                <span className="text-sm font-semibold text-white">{b.bowler}</span>
                              </div>
                              <span className="text-sm text-gray-400 font-mono">
                                {b.overs}-{b.maidens}-{b.runs}-{b.wickets}
                              </span>
                            </div>
                          )
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ball-by-Ball Commentary Section */}
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl overflow-hidden">
              {/* Innings Toggle */}
              <div className="flex border-b border-[#1e1e3a]">
                <button
                  onClick={() => setSelectedInnings(1)}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition-all text-center ${
                    selectedInnings === 1
                      ? 'bg-indigo-500 text-white'
                      : 'bg-[#1e1e3a] text-gray-400 hover:bg-[#252545] hover:text-gray-200'
                  }`}
                >
                  1st Innings &mdash; {short1} {score1}
                </button>
                <button
                  onClick={() => setSelectedInnings(2)}
                  className={`flex-1 px-4 py-3 text-sm font-semibold transition-all text-center ${
                    selectedInnings === 2
                      ? 'bg-indigo-500 text-white'
                      : 'bg-[#1e1e3a] text-gray-400 hover:bg-[#252545] hover:text-gray-200'
                  }`}
                >
                  2nd Innings &mdash; {short2} {score2}
                </button>
              </div>

              {/* Commentary Feed */}
              <div className="p-4 sm:p-5 space-y-0">
                <h3 className="text-sm font-bold text-white mb-4">
                  Ball-by-Ball Commentary &mdash; {selectedInnings === 1 ? '1st' : '2nd'} Innings
                  {selectedInnings === 1 && inn1 && ` (${short1} ${score1})`}
                  {selectedInnings === 2 && inn2 && ` (${short2} ${score2})`}
                </h3>

                {displayOvers.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No ball-by-ball data available for this innings.
                  </div>
                )}

                {displayOvers.map((over, overIdx) => {
                  const ballsAsc = [...over.balls].sort((a, b) => (a.b ?? 0) - (b.b ?? 0))
                  // Find the bowler for this over
                  const overBowler = over.balls[0]?.bwl || 'Unknown'

                  return (
                    <div key={`over-${over.overNum}`}>
                      {/* Individual ball entries (descending: last ball first) */}
                      {over.balls.map((ball, ballIdx) => {
                        const overBall = formatOverBall(over.overNum, ball.b ?? 0)
                        // Compute running score
                        // We just show batter & bowler info
                        return (
                          <div
                            key={`${overBall}-${ballIdx}`}
                            className={`flex items-start gap-3 py-2.5 px-3 rounded-lg ${getBallRowStyle(ball)}`}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              <span className="font-mono text-xs text-gray-400 w-10 inline-block">
                                {over.overNum - 1}.{ball.b}
                              </span>
                            </div>
                            <div className="flex-shrink-0">
                              <span
                                className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${getBallCircleStyle(ball)}`}
                              >
                                {getBallLabel(ball)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{getBallDescription(ball)}</p>
                              {ball.w && ball.w.length > 0 && (
                                <p className="text-xs text-red-500/80 font-medium mt-1">
                                  {ball.w[0].f && ball.w[0].f.length > 0
                                    ? `c ${ball.w[0].f[0]} b ${ball.bwl}`
                                    : `${ball.w[0].k} b ${ball.bwl}`}
                                </p>
                              )}
                            </div>
                            {(() => {
                              const s = formatSpeed(ball.sp)
                              if (!s) return null
                              return (
                                <div className="flex-shrink-0 mt-0.5 text-right font-mono text-[10px] leading-tight tracking-tight text-amber-300/90 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                                  <div>{s.kph}</div>
                                  <div className="text-amber-300/70">{s.mph}</div>
                                </div>
                              )
                            })()}
                          </div>
                        )
                      })}

                      {/* End of Over Summary (show after all balls of each completed over) */}
                      {overIdx < displayOvers.length && (
                        <div className="my-4 bg-[#1a1a30] border border-[#1e1e3a] rounded-lg p-4 border-l-4 border-l-indigo-500">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                              End of Over {over.overNum}
                            </span>
                            <span className="text-sm font-bold text-white">
                              {over.totalRuns} runs
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-400">{overBowler}:</span>
                            <span className="text-gray-400">&middot;</span>
                            <span className="text-xs text-gray-400">This over:</span>
                            <div className="flex items-center gap-1">
                              {ballsAsc.map((b, idx) => (
                                <span
                                  key={idx}
                                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${getMiniCircleStyle(b)}`}
                                >
                                  {getBallLabel(b)}
                                </span>
                              ))}
                            </div>
                            <span className="text-xs font-semibold text-white">= {over.totalRuns} runs</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Load more */}
                {!showAllOvers && currentOvers.length > 5 && (
                  <div className="text-center py-4">
                    <button
                      onClick={() => setShowAllOvers(true)}
                      className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                    >
                      Load earlier overs...
                    </button>
                  </div>
                )}
                {showAllOvers && currentOvers.length > 5 && (
                  <div className="text-center py-4">
                    <button
                      onClick={() => setShowAllOvers(false)}
                      className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                    >
                      Show less
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ TAB: SCORECARD ═══════════ */}
        {false && activeTab === 'scorecard' && (
          <div className="space-y-4">
            {[1, 2].map((innNum) => {
              const innBat = matchBatting
                .filter((b: any) => b.innings === innNum)
                .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
              const innBowl = matchBowling.filter((b: any) => b.innings === innNum)
              if (innBat.length === 0 && innBowl.length === 0) return null

              const teamName = match.innings?.[innNum - 1]?.team || ''
              const teamShort = TEAM_SHORT[teamName] || teamName.slice(0, 3).toUpperCase()
              const innData = match.innings?.[innNum - 1]
              const isExpanded = expandedAccordion[innNum] ?? false


              return (
                <div key={innNum} className="bg-[#131320] border border-[#1e1e3a] rounded-xl overflow-hidden">
                  {/* Accordion Header */}
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#1a1a30] transition-colors cursor-pointer select-none"
                    onClick={() =>
                      setExpandedAccordion((prev) => ({ ...prev, [innNum]: !prev[innNum] }))
                    }
                  >
                    <div className="flex items-center gap-3">
                      <TeamBadge team={teamName} size={36} season={match.season} />
                      <span className="font-bold text-white text-sm sm:text-base">
                        {teamShort} &mdash;{' '}
                        {innData
                          ? `${innData.runs}/${innData.wickets}`
                          : ''}
                        {innData && (
                          <span className="text-gray-400 font-normal"> ({innData.overs} overs)</span>
                        )}
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="border-t border-[#1e1e3a] p-4 sm:p-5 space-y-6">
                      {/* BATTING TABLE */}
                      <div>
                        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">
                          Batting
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-[#1e1e3a]">
                                <th className="text-left py-2 pr-2 font-medium">Batter</th>
                                <th className="text-left py-2 pr-2 font-medium">Dismissal</th>
                                <th className="text-right py-2 px-2 font-medium">R</th>
                                <th className="text-right py-2 px-2 font-medium">B</th>
                                <th className="text-right py-2 px-2 font-medium">4s</th>
                                <th className="text-right py-2 px-2 font-medium">6s</th>
                                <th className="text-right py-2 pl-2 font-medium">SR</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1e1e3a]/50">
                              {innBat.map((b: any) => {
                                const sr = b.balls > 0 ? (b.runs / b.balls) * 100 : 0
                                const isNotOut = b.dismissal === 'not out'
                                const isTop = topScorer[innNum]?.batter === b.batter

                                return (
                                  <tr
                                    key={`${b.batter}-${b.position}`}
                                    className={`hover:bg-[#0a0a0f]/40 transition-colors ${
                                      isNotOut ? 'bg-indigo-500/5' : ''
                                    }`}
                                  >
                                    <td className="py-2.5 pr-2 font-semibold text-white whitespace-nowrap">
                                      <Link
                                        to={`/players/${b.batterId}`}
                                        className="hover:text-indigo-400 transition"
                                      >
                                        {b.batter}
                                      </Link>
                                      {isNotOut && <span className="text-indigo-400">*</span>}
                                      {isTop && (
                                        <svg
                                          className="w-4 h-4 text-amber-400 inline ml-1"
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                        >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                      )}
                                    </td>
                                    <td className="py-2.5 pr-2 text-xs max-w-[180px] truncate">
                                      {isNotOut ? (
                                        <span className="text-green-500 font-medium">not out</span>
                                      ) : (
                                        <span className="text-gray-400">
                                          {b.dismissal}
                                          {b.fielder ? ` (${b.fielder})` : ''}
                                          {b.bowler ? ` b ${b.bowler}` : ''}
                                        </span>
                                      )}
                                    </td>
                                    <td
                                      className={`py-2.5 px-2 text-right font-bold ${
                                        b.runs >= 50 ? 'text-amber-400' : 'text-white'
                                      }`}
                                    >
                                      {b.runs}
                                    </td>
                                    <td className="py-2.5 px-2 text-right text-gray-400">{b.balls}</td>
                                    <td className="py-2.5 px-2 text-right text-gray-400">{b.fours}</td>
                                    <td className="py-2.5 px-2 text-right text-gray-400">{b.sixes}</td>
                                    <td
                                      className={`py-2.5 pl-2 text-right font-medium ${srColor(sr, b.balls)}`}
                                    >
                                      {sr.toFixed(2)}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Extras */}
                        {innData && (
                          <div className="mt-3 flex items-center justify-between bg-[#0a0a0f]/50 rounded-lg px-4 py-2.5">
                            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                              Extras
                            </span>
                            <span className="text-sm text-white font-semibold">{innData.extras}</span>
                          </div>
                        )}

                        {/* Total */}
                        {innData && (
                          <div className="mt-2 flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-2.5">
                            <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                              Total
                            </span>
                            <span className="text-sm text-white font-bold">
                              {innData.runs}/{innData.wickets}{' '}
                              <span className="text-xs text-gray-400 font-normal">
                                ({innData.overs} overs)
                              </span>
                              {innData.overs && (
                                <>
                                  {' '}
                                  &middot; RR:{' '}
                                  {(
                                    innData.runs /
                                    (parseFloat(String(innData.overs).replace(/\.(\d)$/, (_, d: string) => '.' + (parseInt(d) / 6 * 10).toFixed(0))) || 1)
                                  ).toFixed(2)}
                                </>
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* BOWLING TABLE */}
                      {innBowl.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-3">
                            Bowling
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-[#1e1e3a]">
                                  <th className="text-left py-2 pr-2 font-medium">Bowler</th>
                                  <th className="text-right py-2 px-2 font-medium">O</th>
                                  <th className="text-right py-2 px-2 font-medium">M</th>
                                  <th className="text-right py-2 px-2 font-medium">R</th>
                                  <th className="text-right py-2 px-2 font-medium">W</th>
                                  <th className="text-right py-2 pl-2 font-medium">Econ</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#1e1e3a]/50">
                                {innBowl.map((b: any) => {
                                  const isBest = bestBowler[innNum]?.bowler === b.bowler
                                  return (
                                    <tr
                                      key={b.bowler}
                                      className="hover:bg-[#0a0a0f]/40 transition-colors"
                                    >
                                      <td className="py-2.5 pr-2 font-semibold text-white whitespace-nowrap">
                                        <Link
                                          to={`/players/${b.bowlerId}`}
                                          className="hover:text-indigo-400 transition"
                                        >
                                          {b.bowler}
                                        </Link>
                                        {isBest && (
                                          <svg
                                            className="w-4 h-4 text-purple-400 inline ml-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                          </svg>
                                        )}
                                      </td>
                                      <td className="py-2.5 px-2 text-right text-gray-400">
                                        {b.overs}
                                      </td>
                                      <td className="py-2.5 px-2 text-right text-gray-400">
                                        {b.maidens}
                                      </td>
                                      <td className="py-2.5 px-2 text-right text-gray-400">{b.runs}</td>
                                      <td
                                        className={`py-2.5 px-2 text-right font-bold ${
                                          b.wickets >= 3 ? 'text-purple-400' : 'text-white'
                                        }`}
                                      >
                                        {b.wickets}
                                      </td>
                                      <td
                                        className={`py-2.5 pl-2 text-right font-medium ${econColor(
                                          b.economy
                                        )}`}
                                      >
                                        {typeof b.economy === 'number'
                                          ? b.economy.toFixed(2)
                                          : b.economy}
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Player of the Match */}
            {match.playerOfMatch && match.playerOfMatch.length > 0 && (
              <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-6">
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Player of the Match
                </h3>
                {match.playerOfMatch.map((potm: string) => {
                  const potmBatting = matchBatting.find((b: any) => b.batter === potm)
                  const potmBowling = matchBowling.find((b: any) => b.bowler === potm)
                  return (
                    <div key={potm} className="flex flex-col sm:flex-row items-center gap-5">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/10 border-2 border-amber-500/40 flex items-center justify-center flex-shrink-0">
                        <svg className="w-8 h-8 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-amber-400 mb-1">{potm}</h4>
                        <div className="flex flex-wrap gap-4 text-sm">
                          {potmBatting && (
                            <span className="text-gray-300">
                              <span className="text-gray-500">Bat:</span>{' '}
                              {potmBatting.runs} ({potmBatting.balls}b) &middot; {potmBatting.fours}x4{' '}
                              {potmBatting.sixes}x6
                            </span>
                          )}
                          {potmBowling && (
                            <span className="text-gray-300">
                              <span className="text-gray-500">Bowl:</span>{' '}
                              {potmBowling.wickets}/{potmBowling.runs} ({potmBowling.overs} ov)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══════════ TAB: SQUADS ═══════════ */}
        {false && activeTab === 'squads' && (
          <div className="space-y-6">
            {/* Info banner */}
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl px-4 py-3 flex items-center gap-2 text-sm">
              <svg className="w-4 h-4 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span className="text-gray-400">Toss completed &mdash; showing <span className="text-indigo-400 font-semibold">Playing XI</span> and <span className="text-indigo-400 font-semibold">Did Not Play</span>.</span>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[team1, team2].map((teamName, teamIdx) => {
                const teamColor = TEAM_COLORS[teamName]?.primary || '#6366f1'
                const isHome = teamIdx === 0
                const xi = playingXI[teamName] || []
                const squadData = squads?.[teamName]
                const squadPlayers = squadData?.players || []
                const captain = squadData?.captain || ''

                // Find which squad players did not play (case-insensitive match)
                const xiNamesLower = new Set(xi.map((n: string) => n.toLowerCase()))
                const didNotPlay = squadPlayers.filter((p: any) => !xiNamesLower.has(p.name.toLowerCase()))

                return (
                  <div key={teamName} className="bg-[#131320] border border-[#1e1e3a] rounded-xl overflow-hidden">
                    {/* Team Header */}
                    <div
                      className="px-5 py-4 border-b border-[#1e1e3a] flex items-center gap-3"
                      style={{ background: `linear-gradient(135deg, ${teamColor}10, transparent)` }}
                    >
                      <TeamBadge team={teamName} size={36} season={match.season} />
                      <div>
                        <span className="font-bold text-white text-base">{teamName}</span>
                        {isHome ? (
                          <span className="text-[10px] ml-2 px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 font-bold">HOME</span>
                        ) : (
                          <span className="text-[10px] ml-2 px-2 py-0.5 bg-white/5 text-gray-400 rounded-full border border-[#1e1e3a] font-bold">AWAY</span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 space-y-6">
                      {/* Playing XI */}
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Playing XI</h3>
                          <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 font-semibold">{xi.length} PLAYERS</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {xi.map((playerName: string, idx: number) => {
                            const isCaptain = playerName === captain
                            const squadPlayer = squadPlayers.find((p: any) => p.name.toLowerCase() === playerName.toLowerCase())
                            const role = squadPlayer?.role || ''
                            const isOverseas = squadPlayer?.overseas ?? false
                            const isWK = role.toLowerCase().includes('wk')

                            return (
                              <div key={playerName} className="flex items-center gap-3 px-3 py-2.5 bg-[#0a0a0f]/50 rounded-lg border border-[#1e1e3a]">
                                <span
                                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                  style={{ backgroundColor: `${teamColor}20`, color: teamColor }}
                                >
                                  {idx + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-white truncate">
                                    {playerName}
                                    {isCaptain && <span className="text-[10px] ml-1" style={{ color: teamColor }}>(C)</span>}
                                    {isWK && <span className="text-[10px] ml-1 text-purple-400">(WK)</span>}
                                  </div>
                                  <div className="text-[10px] text-gray-400">
                                    {role}{isOverseas ? ' \u00b7 Overseas' : ''}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Did Not Play */}
                      {didNotPlay.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Did Not Play</h3>
                            <span className="text-[10px] px-2 py-0.5 bg-white/5 text-gray-400 rounded-full border border-[#1e1e3a] font-semibold">NOT IN XI</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {didNotPlay.map((p: any) => (
                              <div key={p.name} className="flex items-center gap-3 px-3 py-2.5 bg-[#0a0a0f]/30 rounded-lg border border-[#1e1e3a]/50 opacity-70">
                                <span className="w-7 h-7 bg-white/5 text-gray-500 rounded-full flex items-center justify-center text-xs font-bold">&mdash;</span>
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-400 truncate">{p.name}</div>
                                  <div className="text-[10px] text-gray-500">{p.role}{p.overseas ? ' \u00b7 Overseas' : ''}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ═══════════ TAB: MATCH MVP ═══════════ */}
        {false && activeTab === 'mvp' && (
          <div className="space-y-6">
            {/* MVP Header */}
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Match MVP Tracker
                </h2>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full font-semibold uppercase tracking-wider">Rating</span>
              </div>
              <p className="text-xs text-gray-400">Performance ratings across batting, bowling &amp; fielding computed from match data.</p>

              {/* Current MVP Leader */}
              {mvpData.length > 0 && (() => {
                const leader = mvpData[0]
                const leaderColor = leader.teamColor
                return (
                  <div
                    className="mt-4 border rounded-xl p-4 flex items-center gap-4"
                    style={{
                      background: `linear-gradient(to right, ${leaderColor}15, ${leaderColor}08, transparent)`,
                      borderColor: `${leaderColor}30`,
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${leaderColor}cc, ${leaderColor})`,
                        border: `2px solid ${leaderColor}90`,
                      }}
                    >
                      <span className="text-sm font-extrabold text-black">{getInitials(leader.name)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-white">{leader.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: `${leaderColor}30`, color: leaderColor }}>
                          {TEAM_SHORT[leader.team] || leader.team.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {leader.hasBat && `${leader.batRuns}(${leader.batBalls})`}
                        {leader.hasBat && leader.hasBowl && ' \u00b7 '}
                        {leader.hasBowl && `${leader.bowlWickets}/${leader.bowlRuns}`}
                        {(leader.catches > 0 || leader.runOuts > 0 || leader.stumpings > 0) && (
                          <> &middot; {[
                            leader.catches > 0 ? `${leader.catches} catch${leader.catches > 1 ? 'es' : ''}` : '',
                            leader.runOuts > 0 ? `${leader.runOuts} run out${leader.runOuts > 1 ? 's' : ''}` : '',
                            leader.stumpings > 0 ? `${leader.stumpings} stumping${leader.stumpings > 1 ? 's' : ''}` : '',
                          ].filter(Boolean).join(', ')}</>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-2xl font-extrabold ${ratingColor(leader.overallRating)}`}>{leader.overallRating.toFixed(1)}</div>
                      <div className="text-[10px] font-semibold uppercase" style={{ color: `${leaderColor}90` }}>MVP Leader</div>
                    </div>
                  </div>
                )
              })()}
            </div>

            {/* Rating Scale Legend */}
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Rating Scale</span>
                <div className="flex-1 h-px bg-[#1e1e3a]" />
              </div>
              <div className="flex flex-wrap gap-3 text-[11px] font-semibold">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-yellow-400" /><span className="text-yellow-400">9.0&ndash;10.0</span> Exceptional</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-green-400" /><span className="text-green-400">7.0&ndash;8.9</span> Excellent</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-indigo-400" /><span className="text-indigo-400">5.0&ndash;6.9</span> Good</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-orange-400" /><span className="text-orange-400">3.0&ndash;4.9</span> Average</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-red-500" /><span className="text-red-500">0.0&ndash;2.9</span> Poor</span>
              </div>
            </div>

            {/* Per-team MVP tables */}
            {[team1, team2].map((teamName) => {
              const teamColor = TEAM_COLORS[teamName]?.primary || '#6366f1'
              const teamPlayers = mvpData.filter(p => p.team === teamName).sort((a, b) => b.overallRating - a.overallRating)
              const innIdx = teamName === team1 ? 0 : 1
              const innData = match.innings?.[innIdx]

              return (
                <div key={teamName} className="bg-[#131320] border border-[#1e1e3a] rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#1e1e3a] flex items-center gap-3">
                    <TeamBadge team={teamName} size={32} season={match.season} />
                    <h3 className="text-base font-bold text-white">{teamName}</h3>
                    {innData && (
                      <span className="text-xs text-gray-400 ml-auto">{innData.runs}/{innData.wickets} ({innData.overs} ov)</span>
                    )}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#0a0a0f]/80">
                          <th className="text-left px-4 py-3 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">Player</th>
                          <th className="text-center px-3 py-3 text-[11px] text-gray-400 font-semibold uppercase tracking-wider hidden sm:table-cell">Performance</th>
                          <th className="text-center px-3 py-3 text-[11px] font-semibold uppercase tracking-wider w-14">
                            <span className="text-green-400">BAT</span>
                          </th>
                          <th className="text-center px-3 py-3 text-[11px] font-semibold uppercase tracking-wider w-14">
                            <span className="text-indigo-400">BOWL</span>
                          </th>
                          <th className="text-center px-3 py-3 text-[11px] font-semibold uppercase tracking-wider w-14">
                            <span className="text-orange-400">FIELD</span>
                          </th>
                          <th className="text-center px-3 py-3 text-[11px] font-semibold uppercase tracking-wider w-20">
                            <span className="text-yellow-400">OVERALL</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#1e1e3a]/50">
                        {teamPlayers.map((p, idx) => {
                          const isLeader = mvpData[0]?.name === p.name
                          const perfParts: string[] = []
                          if (p.hasBat) perfParts.push(`${p.batRuns}(${p.batBalls})`)
                          if (p.hasBowl) perfParts.push(`${p.bowlWickets}/${p.bowlRuns}`)
                          if (p.catches > 0) perfParts.push(`${p.catches}ct`)
                          if (p.runOuts > 0) perfParts.push(`${p.runOuts}ro`)
                          if (p.stumpings > 0) perfParts.push(`${p.stumpings}st`)

                          return (
                            <tr
                              key={p.name}
                              className={`hover:bg-white/[0.02] ${idx % 2 === 1 ? 'bg-white/[0.01]' : ''} ${isLeader ? 'border-l-2' : ''}`}
                              style={isLeader ? { borderLeftColor: teamColor, backgroundColor: `${teamColor}08` } : {}}
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border"
                                    style={{
                                      background: `linear-gradient(135deg, ${teamColor}70, ${teamColor})`,
                                      borderColor: `${teamColor}40`,
                                    }}
                                  >
                                    <span className="text-[9px] font-bold text-white">{getInitials(p.name)}</span>
                                  </div>
                                  <span className="font-semibold text-white text-sm">{p.name}</span>
                                  {isLeader && (
                                    <svg className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center text-xs text-gray-400 hidden sm:table-cell">{perfParts.join(' \u00b7 ')}</td>
                              <td className={`px-3 py-3 text-center font-bold ${p.hasBat ? ratingColor(p.batRating) : 'text-gray-600'}`}>
                                {p.hasBat ? p.batRating.toFixed(1) : '\u2014'}
                              </td>
                              <td className={`px-3 py-3 text-center font-bold ${p.hasBowl ? ratingColor(p.bowlRating) : 'text-gray-600'}`}>
                                {p.hasBowl ? p.bowlRating.toFixed(1) : '\u2014'}
                              </td>
                              <td className={`px-3 py-3 text-center font-medium ${(p.catches + p.runOuts + p.stumpings) > 0 ? ratingColor(p.fieldRating) : 'text-gray-600'}`}>
                                {(p.catches + p.runOuts + p.stumpings) > 0 ? p.fieldRating.toFixed(1) : '\u2014'}
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span className={`text-sm font-extrabold ${ratingColor(p.overallRating)}`}>{p.overallRating.toFixed(1)}</span>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            })}

            {/* Top 5 MVP Contenders */}
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-5">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                Top 5 MVP Contenders
              </h3>
              <div className="space-y-2.5">
                {mvpData.slice(0, 5).map((p, idx) => {
                  const teamColor = p.teamColor
                  const teamShort = TEAM_SHORT[p.team] || p.team.slice(0, 3).toUpperCase()
                  const isFirst = idx === 0

                  return (
                    <div
                      key={p.name}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 border ${
                        isFirst ? '' : 'bg-white/[0.02] border-[#1e1e3a]'
                      }`}
                      style={isFirst ? {
                        backgroundColor: `${teamColor}0a`,
                        borderColor: `${teamColor}30`,
                      } : {}}
                    >
                      <span className={`text-lg font-extrabold w-6 text-center ${isFirst ? 'text-yellow-400' : 'text-gray-500'}`}>{idx + 1}</span>
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border"
                        style={{
                          background: `linear-gradient(135deg, ${teamColor}70, ${teamColor})`,
                          borderColor: `${teamColor}40`,
                        }}
                      >
                        <span className="text-[10px] font-bold text-white">{getInitials(p.name)}</span>
                      </div>
                      <div className="flex-1">
                        <span className="text-sm font-bold text-white">{p.name}</span>
                        <span className="text-[10px] ml-1.5" style={{ color: teamColor }}>{teamShort}</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-lg font-extrabold ${ratingColor(p.overallRating)}`}>{p.overallRating.toFixed(1)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════ */}
        {/* COMPLETED MATCHES                              */}
        {/* ═══════════════════════════════════════════════ */}
        {matches && matches.length > 1 && (
          <section className="mt-10 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Completed Matches
              </h2>
              <Link to="/matches" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                View All &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...matches]
                .sort((a: any, b: any) => b.date.localeCompare(a.date))
                .filter((m: any) => m.id !== matchId)
                .slice(0, 4)
                .map((m: any) => {
                  const inn1 = m.innings?.[0]
                  const inn2 = m.innings?.[1]
                  const t1 = inn1?.team || ''
                  const t2 = inn2?.team || ''
                  const s1 = TEAM_SHORT[t1] || t1
                  const s2 = TEAM_SHORT[t2] || t2
                  const c1 = TEAM_COLORS[t1]?.primary || '#6366f1'
                  const c2 = TEAM_COLORS[t2]?.primary || '#6366f1'
                  const isWinner1 = m.winner === t1
                  const isWinner2 = m.winner === t2
                  const dateStr = new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  const resultText = m.winner
                    ? `${TEAM_SHORT[m.winner] || m.winner} won${m.winMargin?.runs ? ` by ${m.winMargin.runs} runs` : m.winMargin?.wickets ? ` by ${m.winMargin.wickets} wickets` : ''}`
                    : 'No result'

                  return (
                    <Link
                      key={m.id}
                      to={`/matches/${m.id}`}
                      className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-4 block hover:-translate-y-0.5 transition-all hover:shadow-lg hover:shadow-indigo-500/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-400">{dateStr}</span>
                        <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">Completed</span>
                      </div>
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold" style={{ color: isWinner1 ? c1 : '#94a3b8' }}>{s1}</span>
                          <span className={`text-sm font-bold ${isWinner1 ? 'text-green-400' : 'text-gray-400'}`}>
                            {inn1 ? `${inn1.runs}/${inn1.wickets}` : '-'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold" style={{ color: isWinner2 ? c2 : '#94a3b8' }}>{s2}</span>
                          <span className={`text-sm font-bold ${isWinner2 ? 'text-green-400' : 'text-gray-400'}`}>
                            {inn2 ? `${inn2.runs}/${inn2.wickets}` : '-'}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-indigo-400 font-medium">{resultText}</p>
                      <div className="mt-2 pt-2 border-t border-[#1e1e3a]">
                        <span className="text-xs text-gray-400 hover:text-indigo-400 transition-colors">View Full Scorecard &rarr;</span>
                      </div>
                    </Link>
                  )
                })}
            </div>
          </section>
        )}
      </main>
    </>
  )
}

/*
 * ═══════════════════════════════════════════════════════════════
 * PREVIOUS DESIGN (v1) — Preserved for reference
 * This was the initial simpler layout before matching the HTML
 * wireframe design. Can be restored if needed.
 *
 * Key differences from current design:
 * - Single page layout (no tabs)
 * - Basic score display without sticky header
 * - Simple ball-by-ball list without over grouping
 * - No innings toggle
 * - No commentary-style ball descriptions
 * - No accordion scorecards
 *
 * To restore: uncomment below, comment out the current export
 * ═══════════════════════════════════════════════════════════════
 */
