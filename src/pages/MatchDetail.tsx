// Match detail page (/matches/:id).
// Full match view: scorecard (batting + bowling for both innings),
// ball-by-ball commentary, partnerships, fall of wickets, venue + weather,
// head-to-head, and player-of-the-match.
import { useParams, Link } from 'react-router-dom'
import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  useSeasons,
  useMatches,
  useBatting,
  useBowling,
  usePartnerships,
} from '@/hooks/useData'
import { dataService } from '@/services/dataService'
import { TEAM_SHORT, TEAM_COLORS } from '@/lib/constants'
import ErrorState from '@/components/ui/ErrorState'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import Breadcrumb from '@/components/ui/Breadcrumb'
import TeamBadge from '@/components/ui/TeamBadge'
import PlayerLink from '@/components/ui/PlayerLink'
import VenueMap from '@/components/venue/VenueMap'
import VenueWeather from '@/components/venue/VenueWeather'
import { inferIstKickoffHour } from '@/lib/matchTime'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

// ═══════════════════════════════════════════════════════════════════════════
// Tab order is intentional: Info → Scorecard → Squads → Run Progression → MVP
// (Run Progression sits BEFORE MVP per the design spec.)
// ═══════════════════════════════════════════════════════════════════════════
type TabId = 'info' | 'scorecard' | 'squads' | 'progression' | 'mvp'

// ── MVP Rating helpers (mirror LiveMatch.tsx) ────────────────────────────

function computeBatRating(runs: number, balls: number, fours: number, sixes: number): number {
  if (balls === 0) return 0
  const sr = (runs / balls) * 100
  const base =
    runs / 20 +
    (sr > 150 ? 1.5 : sr > 130 ? 0.8 : 0) +
    sixes * 0.3 +
    fours * 0.15
  return Math.min(10, Math.round(base * 10) / 10)
}

function computeBowlRating(
  wickets: number,
  runs: number,
  overs: number,
  maidens: number
): number {
  if (overs === 0) return 0
  const economy = runs / overs
  const base =
    wickets * 2.5 + (economy < 7 ? 2 : economy < 9 ? 1 : 0) + maidens * 1.5
  return Math.min(10, Math.round(base * 10) / 10)
}

function computeFieldRating(
  catches: number,
  runOuts: number,
  stumpings: number
): number {
  const base = catches * 2 + runOuts * 3 + stumpings * 2.5
  return Math.min(10, Math.round(base * 10) / 10)
}

function computeOverallRating(
  bat: number,
  bowl: number,
  field: number,
  hasBat: boolean,
  hasBowl: boolean
): number {
  if (hasBat && hasBowl)
    return Math.round((bat * 0.4 + bowl * 0.35 + field * 0.25) * 10) / 10
  if (hasBat) return Math.round((bat * 0.65 + field * 0.35) * 10) / 10
  if (hasBowl) return Math.round((bowl * 0.65 + field * 0.35) * 10) / 10
  return Math.round(field * 10) / 10
}

function ratingColor(rating: number): string {
  if (rating >= 9) return 'text-yellow-400'
  if (rating >= 7) return 'text-green-400'
  if (rating >= 5) return 'text-indigo-400'
  if (rating >= 3) return 'text-orange-400'
  return 'text-red-500'
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// ── Ball-by-ball helpers (mirrored from LiveMatch.tsx) ──────────────────
//
// These are kept inline (rather than imported from a shared module) so
// MatchDetail stays self-contained. They produce the same look and feel as
// the Live tab on the LiveMatch page.

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
  return getBallCircleStyle(ball)
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
        <span className="font-semibold text-white">
          <PlayerLink name={bowler} className="hover:text-indigo-400 transition-colors" /> to{' '}
          <PlayerLink name={batter} className="hover:text-indigo-400 transition-colors" />
        </span>
        {' \u2014 '}
        <span className="text-red-500 font-bold">OUT!</span>{' '}
        <span className="text-gray-400">
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
        </span>
      </>
    )
  }

  if (runs >= 6) {
    return (
      <>
        <span className="font-semibold text-white">
          <PlayerLink name={bowler} className="hover:text-indigo-400 transition-colors" /> to{' '}
          <PlayerLink name={batter} className="hover:text-indigo-400 transition-colors" />
        </span>
        {' \u2014 '}
        <span className="text-yellow-500 font-bold">SIX!</span>
      </>
    )
  }

  if (runs === 4) {
    return (
      <>
        <span className="font-semibold text-white">
          <PlayerLink name={bowler} className="hover:text-indigo-400 transition-colors" /> to{' '}
          <PlayerLink name={batter} className="hover:text-indigo-400 transition-colors" />
        </span>
        {' \u2014 '}
        <span className="text-green-500 font-bold">FOUR!</span>
      </>
    )
  }

  if (isExtraDelivery(ball)) {
    const exLabel = isWide(ball) ? 'Wide' : isNoBall(ball) ? 'No ball' : 'Extra'
    return (
      <>
        <span className="font-semibold text-white">
          <PlayerLink name={bowler} className="hover:text-indigo-400 transition-colors" /> to{' '}
          <PlayerLink name={batter} className="hover:text-indigo-400 transition-colors" />
        </span>
        {' \u2014 '}
        <span className="text-orange-500 font-bold">{exLabel}!</span>
        {ball.tr > 0 && ` +${ball.tr} run${ball.tr > 1 ? 's' : ''}`}
      </>
    )
  }

  if (runs === 0) {
    return (
      <>
        <span className="font-semibold text-white">
          <PlayerLink name={bowler} className="hover:text-indigo-400 transition-colors" /> to{' '}
          <PlayerLink name={batter} className="hover:text-indigo-400 transition-colors" />
        </span>
        {' \u2014 Dot ball.'}
      </>
    )
  }

  return (
    <>
      <span className="font-semibold text-white">
        {bowler} to {batter}
      </span>
      {' \u2014 '}
      {runs} run{runs > 1 ? 's' : ''}.
    </>
  )
}

/** A small badge for an extras category (b / lb / wd / nb / p). The label is
 *  the conventional cricket abbreviation. Greys out when the value is 0 so
 *  zeroes are visible (consistent comparison across innings) but don't shout. */
function ExtraPill({
  label,
  value,
  title,
}: {
  label: string
  value: number
  title: string
}) {
  const isZero = value === 0
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md border tabular-nums ${
        isZero
          ? 'bg-white/[0.02] border-[#1e1e3a] text-gray-600'
          : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
      }`}
    >
      <span className="font-semibold uppercase">{label}</span>
      <span className={isZero ? 'text-gray-500' : 'text-white font-bold'}>
        {value}
      </span>
    </span>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════════════════

export default function MatchDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: seasons } = useSeasons()
  const [activeTab, setActiveTab] = useState<TabId>('scorecard')
  const [expandedAccordion, setExpandedAccordion] = useState<Record<number, boolean>>({
    1: true,
    2: true,
  })
  const [timedOut, setTimedOut] = useState(false)
  // Score Progression > ball-by-ball innings selector + load-more state.
  // 'super' = Super Over view (renders both inn 3 and inn 4 stacked).
  const [selectedInnings, setSelectedInnings] = useState<1 | 2 | 'super'>(1)
  const [showAllOvers, setShowAllOvers] = useState(false)

  // Reset accordion state and tab when navigating to a different match
  useEffect(() => {
    setActiveTab('scorecard')
    setExpandedAccordion({ 1: true, 2: true })
    setSelectedInnings(1)
    setShowAllOvers(false)
    setTimedOut(false)
  }, [id])

  // Timeout: if loading takes >10 seconds, show error
  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), 10000)
    return () => clearTimeout(timer)
  }, [id])

  // Multi-season scan: we don't know which season this match belongs to from
  // the URL, so we have to look across all of them.
  const allSeasonYears = useMemo(
    () =>
      seasons
        ?.map((s: any) => s.year)
        .sort((a: string, b: string) => b.localeCompare(a)) || [],
    [seasons]
  )

  const seasonQueries = allSeasonYears.map((year: string) => ({
    year,
    matches: useMatches(year),
    batting: useBatting(year),
    bowling: useBowling(year),
  }))

  const allSeasonsLoaded =
    seasonQueries.length > 0 && seasonQueries.every((sq) => !sq.matches.isLoading)

  const matchData = useMemo(() => {
    for (const sq of seasonQueries) {
      const match = sq.matches.data?.find((m: any) => m.id === id)
      if (match) {
        return {
          match,
          batting: sq.batting.data?.filter((b: any) => b.matchId === id) || [],
          bowling: sq.bowling.data?.filter((b: any) => b.matchId === id) || [],
          season: sq.year,
          // Full season match list — needed by inferIstKickoffHour to detect
          // double-headers (3:30 PM IST vs 7:30 PM IST slot).
          allSeasonMatches: sq.matches.data || [],
        }
      }
    }
    return null
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seasonQueries, id])

  const matchSeason = matchData?.season || ''

  // Partnerships and BBB for this match's season
  const { data: allPartnerships } = usePartnerships(matchSeason)
  const { data: allBBB } = useQuery({
    queryKey: ['bbb', matchSeason],
    queryFn: () => dataService.getBBB(matchSeason),
    staleTime: 1000 * 60 * 60,
    enabled: !!matchSeason,
  })

  const matchPartnerships = useMemo(() => {
    if (!allPartnerships || !id) return []
    return (allPartnerships as any[]).filter((p: any) => p.matchId === id)
  }, [allPartnerships, id])

  const matchBalls = useMemo(() => {
    if (!allBBB || !id) return [] as any[]
    return (allBBB as any[]).filter((b: any) => b.m === id)
  }, [allBBB, id])

  // Cumulative over-by-over runs for the run progression chart.
  // Skips super-over balls (i===3, i===4) so they don't inflate the main
  // innings totals — those are shown elsewhere.
  const overByOverData = useMemo(() => {
    if (matchBalls.length === 0) return []
    const inn1: Record<number, number> = {}
    const inn2: Record<number, number> = {}
    for (const ball of matchBalls) {
      const overNum = (ball.o ?? 0) + 1
      let target: Record<number, number> | null = null
      if (ball.i === 1) target = inn1
      else if (ball.i === 2) target = inn2
      else continue
      target[overNum] = (target[overNum] || 0) + (ball.tr ?? 0)
    }
    const data: { over: number; inn1: number; inn2: number }[] = []
    let cum1 = 0
    let cum2 = 0
    for (let ov = 1; ov <= 20; ov++) {
      cum1 += inn1[ov] || 0
      cum2 += inn2[ov] || 0
      if (cum1 > 0 || cum2 > 0) data.push({ over: ov, inn1: cum1, inn2: cum2 })
    }
    return data
  }, [matchBalls])

  // Fall of wickets per innings extracted from BBB
  const fallOfWickets = useMemo(() => {
    const extract = (innNum: number) => {
      const innBalls = matchBalls.filter((b: any) => b.i === innNum)
      let totalRuns = 0
      const wickets: {
        over: string
        score: number
        playerOut: string
        howOut: string
        bowler: string
      }[] = []
      for (const ball of innBalls) {
        totalRuns += ball.tr ?? 0
        if (ball.w && ball.w.length > 0) {
          for (const w of ball.w) {
            wickets.push({
              over: `${(ball.o ?? 0) + 1}.${ball.b ?? 0}`,
              score: totalRuns,
              playerOut: w.p || 'Unknown',
              howOut: w.k || 'unknown',
              bowler: ball.bwl || '',
            })
          }
        }
      }
      return wickets
    }
    return { 1: extract(1), 2: extract(2) }
  }, [matchBalls])

  // BBB grouped per innings → array of overs (descending by overNum), each
  // over containing { overNum, balls (in delivery order), totalRuns }.
  // This is the same shape LiveMatch.tsx uses for its commentary feed.
  const groupedOvers = useMemo(() => {
    // 1, 2 = regulation innings; 3, 4 = super-over innings (only present on ties).
    const result: Record<number, { overNum: number; balls: BallData[]; totalRuns: number }[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
    }
    for (const inn of [1, 2, 3, 4] as const) {
      const innBalls = matchBalls.filter((b: any) => b.i === inn) as BallData[]
      const overMap: Record<number, BallData[]> = {}
      for (const ball of innBalls) {
        const ov = (ball.o ?? 0) + 1 // 0-indexed → 1-indexed
        if (!overMap[ov]) overMap[ov] = []
        overMap[ov].push(ball)
      }
      const overNums = Object.keys(overMap)
        .map(Number)
        .sort((a, b) => b - a) // descending — latest over first
      for (const ov of overNums) {
        const balls = overMap[ov]
        // Within an over, sort balls ascending so the commentary reads
        // ball 1 → 6 from top to bottom inside each over card.
        balls.sort((a, b) => (a.b ?? 0) - (b.b ?? 0))
        const totalRuns = balls.reduce((s, b) => s + (b.tr ?? 0), 0)
        result[inn].push({ overNum: ov, balls, totalRuns })
      }
    }
    return result
  }, [matchBalls])

  // Per-innings extras breakdown computed from BBB.
  // Each ball.ex is a dict like { wides: 1, noballs: 1, legbyes: 2, byes: 4, penalty: 0 }
  // Values are the RUNS in that category, not delivery counts. Cross-checked
  // against match.innings[i].extras and totals match exactly.
  const extrasBreakdown = useMemo(() => {
    const empty = () => ({ wides: 0, noballs: 0, legbyes: 0, byes: 0, penalty: 0 })
    const result: Record<number, ReturnType<typeof empty>> = { 1: empty(), 2: empty() }
    for (const ball of matchBalls) {
      const innNum = ball.i as 1 | 2
      if (!result[innNum]) continue
      const ex = ball.ex
      if (!ex) continue
      if (typeof ex === 'object') {
        for (const [k, v] of Object.entries(ex)) {
          // Normalize singular keys to plural form used by the dict
          const key =
            k === 'wide' ? 'wides' :
            k === 'noball' ? 'noballs' :
            k === 'legbye' ? 'legbyes' :
            k === 'bye' ? 'byes' :
            k
          if (key in result[innNum]) {
            ;(result[innNum] as any)[key] += Number(v) || 0
          }
        }
      }
    }
    return result
  }, [matchBalls])

  // Fielding stats inferred from BBB wicket records
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
            else stats[f].catches++
          }
        }
      }
    }
    return stats
  }, [matchBalls])

  // Loading guards
  useEffect(() => {
    if (matchData) setTimedOut(false)
  }, [matchData])

  if (!matchData) {
    if (allSeasonsLoaded) {
      return (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <ErrorState message={`Match with ID "${id}" was not found in any season.`} />
          <div className="text-center mt-2">
            <Link to="/matches" className="text-accent hover:underline text-sm font-medium">
              Back to all matches
            </Link>
          </div>
        </div>
      )
    }
    if (timedOut) {
      return (
        <div className="max-w-7xl mx-auto px-6 py-16">
          <ErrorState
            message="Loading is taking longer than expected. The match may not exist or data could not be fetched."
            onRetry={() => window.location.reload()}
          />
          <div className="text-center mt-2">
            <Link to="/matches" className="text-accent hover:underline text-sm font-medium">
              Back to all matches
            </Link>
          </div>
        </div>
      )
    }
    return <LoadingSpinner size="lg" text="Loading match data..." />
  }

  const { match, batting, bowling, allSeasonMatches } = matchData
  // Inferred kickoff hour (15 IST or 19 IST) — used by VenueWeather to
  // pick the right hour-of-day for the Open-Meteo lookup.
  const kickoffHourIst = inferIstKickoffHour(match, allSeasonMatches as any[])
  const inn1 = match.innings?.[0]
  const inn2 = match.innings?.[1]
  const team1 = inn1?.team || match.teams?.[0] || ''
  const team2 = inn2?.team || match.teams?.[1] || ''
  const short1 = TEAM_SHORT[team1] || team1.slice(0, 3).toUpperCase()
  const short2 = TEAM_SHORT[team2] || team2.slice(0, 3).toUpperCase()
  const color1 = TEAM_COLORS[team1]?.primary || '#6366f1'
  const color2 = TEAM_COLORS[team2]?.primary || '#6366f1'

  const score1 = inn1 ? `${inn1.runs}/${inn1.wickets}` : ''
  const overs1 = inn1 ? `(${inn1.overs} ov)` : ''
  const score2 = inn2 ? `${inn2.runs}/${inn2.wickets}` : ''
  const overs2 = inn2 ? `(${inn2.overs} ov)` : ''

  // Three buckets — abandoned (never started) / no-result (started, didn't
  // finish) / future fixture (not yet played) — must read distinctly so the
  // header doesn't show "No result" for an upcoming game.
  const resultText = match.abandoned
    ? 'Match Abandoned'
    : match.winner
      ? `${match.winner} won${
          match.winMargin?.runs
            ? ` by ${match.winMargin.runs} runs`
            : match.winMargin?.wickets
              ? ` by ${match.winMargin.wickets} wickets`
              : ''
        }`
      : match.result === 'no result'
        ? 'No result'
        : 'Scheduled'

  const matchDate = match.date
    ? new Date(match.date).toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  // ── Top scorer / best bowler per innings (highlighted in scorecard) ──
  const topScorer: Record<number, any> = {}
  for (const inn of [1, 2]) {
    const innBat = batting.filter((b: any) => b.innings === inn)
    if (innBat.length > 0) {
      topScorer[inn] = innBat.reduce(
        (a: any, b: any) => (b.runs > a.runs ? b : a),
        innBat[0]
      )
    }
  }
  const bestBowler: Record<number, any> = {}
  for (const inn of [1, 2]) {
    const innBowl = bowling.filter((b: any) => b.innings === inn)
    if (innBowl.length > 0) {
      bestBowler[inn] = innBowl.reduce(
        (a: any, b: any) => {
          if (b.wickets > a.wickets) return b
          if (b.wickets === a.wickets && b.economy < a.economy) return b
          return a
        },
        innBowl[0]
      )
    }
  }

  // ── Playing XI inferred from scorecards (per team) ──
  const playingXI: Record<string, string[]> = {}
  for (const inn of [1, 2]) {
    const teamName = match.innings?.[inn - 1]?.team || ''
    if (!teamName) continue
    const batters = batting.filter((b: any) => b.innings === inn).map((b: any) => b.batter)
    if (!playingXI[teamName]) playingXI[teamName] = []
    playingXI[teamName] = Array.from(new Set([...playingXI[teamName], ...batters]))

    // Bowlers in this innings come from the OTHER team
    const otherTeam = match.innings?.[inn === 1 ? 1 : 0]?.team || ''
    if (otherTeam) {
      const bowlers = bowling.filter((b: any) => b.innings === inn).map((b: any) => b.bowler)
      if (!playingXI[otherTeam]) playingXI[otherTeam] = []
      playingXI[otherTeam] = Array.from(new Set([...playingXI[otherTeam], ...bowlers]))
    }
  }

  // ── MVP table ──
  const mvpData = (() => {
    const playerMap: Record<
      string,
      {
        name: string
        team: string
        teamColor: string
        batRuns: number
        batBalls: number
        fours: number
        sixes: number
        bowlWickets: number
        bowlRuns: number
        bowlOvers: number
        bowlMaidens: number
        catches: number
        runOuts: number
        stumpings: number
        hasBat: boolean
        hasBowl: boolean
      }
    > = {}

    const ensure = (name: string, team: string) => {
      if (!playerMap[name]) {
        playerMap[name] = {
          name,
          team,
          teamColor: TEAM_COLORS[team]?.primary || '#6366f1',
          batRuns: 0,
          batBalls: 0,
          fours: 0,
          sixes: 0,
          bowlWickets: 0,
          bowlRuns: 0,
          bowlOvers: 0,
          bowlMaidens: 0,
          catches: 0,
          runOuts: 0,
          stumpings: 0,
          hasBat: false,
          hasBowl: false,
        }
      }
    }

    for (const b of batting as any[]) {
      const teamName = match.innings?.[b.innings - 1]?.team || ''
      ensure(b.batter, teamName)
      const p = playerMap[b.batter]
      p.batRuns += b.runs || 0
      p.batBalls += b.balls || 0
      p.fours += b.fours || 0
      p.sixes += b.sixes || 0
      p.hasBat = true
    }

    for (const b of bowling as any[]) {
      const bowlTeamIdx = b.innings === 1 ? 1 : 0
      const teamName = match.innings?.[bowlTeamIdx]?.team || ''
      ensure(b.bowler, teamName)
      const p = playerMap[b.bowler]
      p.bowlWickets += b.wickets || 0
      p.bowlRuns += b.runs || 0
      p.bowlOvers += typeof b.overs === 'number' ? b.overs : parseFloat(b.overs) || 0
      p.bowlMaidens += b.maidens || 0
      p.hasBowl = true
    }

    for (const [name, fs] of Object.entries(fieldingStats)) {
      let team = ''
      for (const [t, players] of Object.entries(playingXI)) {
        if (players.includes(name)) {
          team = t
          break
        }
      }
      if (!team) continue
      ensure(name, team)
      playerMap[name].catches += fs.catches
      playerMap[name].runOuts += fs.runOuts
      playerMap[name].stumpings += fs.stumpings
    }

    return Object.values(playerMap)
      .map((p) => {
        const bat = computeBatRating(p.batRuns, p.batBalls, p.fours, p.sixes)
        const bowl = computeBowlRating(p.bowlWickets, p.bowlRuns, p.bowlOvers, p.bowlMaidens)
        const field = computeFieldRating(p.catches, p.runOuts, p.stumpings)
        const overall = computeOverallRating(bat, bowl, field, p.hasBat, p.hasBowl)
        return {
          ...p,
          batRating: bat,
          bowlRating: bowl,
          fieldRating: field,
          overallRating: overall,
        }
      })
      .sort((a, b) => b.overallRating - a.overallRating)
  })()

  const tabs: { id: TabId; label: string; icon?: 'star' }[] = [
    { id: 'info', label: 'Info' },
    { id: 'scorecard', label: 'Scorecard' },
    { id: 'squads', label: 'Squads' },
    { id: 'progression', label: 'Score Progression' },
    { id: 'mvp', label: 'Match MVP', icon: 'star' },
  ]

  return (
    <>
      {/* ══════ STICKY SCORE HEADER ══════ */}
      <header className="bg-[#131320] border-b border-[#1e1e3a] sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-3 sm:py-5">
          {/* Score Row */}
          <div className="flex items-center justify-center gap-2 sm:gap-8 md:gap-12">
            {/* Team 1 */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <TeamBadge team={team1} className="w-10 h-10 sm:w-14 sm:h-14 shrink-0" season={match.season} />
              <div className="text-right sm:text-left min-w-0">
                <Link
                  to={`/teams/${team1.replace(/\s+/g, '-').toLowerCase()}`}
                  className="text-xs sm:text-sm text-gray-400 font-medium hover:text-accent transition truncate block max-w-[110px] sm:max-w-none"
                >
                  <span className="hidden sm:inline">{team1}</span>
                  <span className="sm:hidden">{short1}</span>
                </Link>
                {inn1 && (
                  <div className="text-base sm:text-2xl md:text-3xl font-bold text-white">
                    {score1}{' '}
                    <span className="text-xs sm:text-base font-normal text-gray-400">
                      {overs1}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* VS + status badge */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <span className="text-gray-400 font-semibold text-sm">vs</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 border ${
                  match.abandoned
                    ? 'bg-gray-500/20 border-gray-500/40'
                    : 'bg-green-500/20 border-green-500/40'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    match.abandoned ? 'bg-gray-400' : 'bg-green-500'
                  }`}
                />
                <span
                  className={`text-xs font-bold tracking-wide ${
                    match.abandoned ? 'text-gray-300' : 'text-green-500'
                  }`}
                >
                  {match.abandoned ? 'ABANDONED' : 'COMPLETED'}
                </span>
              </span>
            </div>

            {/* Team 2 */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="sm:order-2 min-w-0">
                <Link
                  to={`/teams/${team2.replace(/\s+/g, '-').toLowerCase()}`}
                  className="text-xs sm:text-sm text-gray-400 font-medium hover:text-accent transition truncate block max-w-[110px] sm:max-w-none"
                >
                  <span className="hidden sm:inline">{team2}</span>
                  <span className="sm:hidden">{short2}</span>
                </Link>
                {inn2 && (
                  <div className="text-base sm:text-2xl md:text-3xl font-bold text-white">
                    {score2}{' '}
                    <span className="text-xs sm:text-base font-normal text-gray-400">
                      {overs2}
                    </span>
                  </div>
                )}
              </div>
              <TeamBadge
                team={team2}
                className="w-10 h-10 sm:w-14 sm:h-14 sm:order-3 shrink-0"
                season={match.season}
              />
            </div>
          </div>

          {/* Result text */}
          <div className="text-center mt-3">
            <div className="text-sm sm:text-base font-semibold text-indigo-400">
              {resultText}
            </div>
          </div>

          {/* Match info line */}
          <div className="text-center mt-1.5">
            <div className="text-xs sm:text-sm text-gray-400">
              {match.playoffStage ? (
                <span className="text-amber-400 font-semibold">{match.playoffStage}</span>
              ) : (
                `Match ${match.matchNumber}`
              )}
              {' \u00b7 '}IPL {match.season}
              {' \u00b7 '}
              <Link
                to={`/venues/${encodeURIComponent(match.venue)}`}
                className="hover:text-indigo-400 transition"
              >
                {match.venue}
              </Link>
              {match.city ? `, ${match.city}` : ''}
            </div>
          </div>
        </div>

        {/* TAB BAR */}
        <div className="max-w-6xl mx-auto px-3 sm:px-4 overflow-x-auto">
          <nav className="flex gap-0 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-indigo-500 text-white'
                    : 'border-b-2 border-transparent text-gray-400 hover:text-gray-200 hover:border-[#1e1e3a]'
                }`}
              >
                {tab.icon === 'star' && (
                  <svg
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                )}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* ══════ MAIN CONTENT ══════ */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-6">
        <Breadcrumb
          items={[
            { label: 'Matches', path: '/matches' },
            { label: `${short1} vs ${short2}` },
          ]}
        />

        {/* ─── INFO TAB ─── */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* Match Info */}
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Match Info
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">Match</span>
                    <p className="text-sm text-white font-medium">
                      {match.playoffStage
                        ? `${match.playoffStage} \u2014 IPL ${match.season}`
                        : `Match ${match.matchNumber}, IPL ${match.season}`}
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
                      <span
                        className={`w-2 h-2 rounded-full inline-block ${
                          match.abandoned ? 'bg-gray-400' : 'bg-green-500'
                        }`}
                      />
                      <span
                        className={`font-semibold ${
                          match.abandoned ? 'text-gray-300' : 'text-green-400'
                        }`}
                      >
                        {match.abandoned ? 'Abandoned' : 'Completed'}
                      </span>
                      <span className="text-gray-400">&mdash; {resultText}</span>
                    </p>
                    {match.abandoned && match.abandonReason && (
                      <p className="text-xs text-gray-500 mt-1">{match.abandonReason}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Match Officials */}
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Match Officials
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { code: 'U1', label: 'Umpire 1', name: match.umpires?.[0] },
                  { code: 'U2', label: 'Umpire 2', name: match.umpires?.[1] },
                  { code: '3U', label: '3rd Umpire', name: match.umpires?.[2] },
                  { code: 'MR', label: 'Match Referee', name: match.umpires?.[3] },
                ].map((o) => (
                  <div
                    key={o.code}
                    className="flex items-center gap-3 bg-[#0a0a0f]/50 rounded-lg p-3"
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-500/10 flex items-center justify-center">
                      <span className="text-indigo-400 text-xs font-bold">{o.code}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">{o.label}</p>
                      <p className="text-sm text-white font-medium">
                        {o.name || 'Not Available'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue */}
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
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

              {/* Live / historical weather (replaces the old static chips) */}
              <div className="mt-4 pt-4 border-t border-[#1e1e3a]">
                <VenueWeather
                  date={match.date}
                  city={match.city}
                  kickoffHour={kickoffHourIst}
                />
              </div>

              {/* Map + Get Directions */}
              <div className="mt-4 pt-4 border-t border-[#1e1e3a]">
                <VenueMap venue={match.venue} city={match.city} />
              </div>
            </div>
          </div>
        )}

        {/* ─── SCORECARD TAB ─── */}
        {activeTab === 'scorecard' && (
          <div className="space-y-4">
            {[1, 2].map((innNum) => {
              const innBat = batting
                .filter((b: any) => b.innings === innNum)
                .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
              const innBowl = bowling.filter((b: any) => b.innings === innNum)
              const innPartners = matchPartnerships
                .filter((p: any) => p.innings === innNum)
                .sort((a: any, b: any) => a.wicket - b.wicket)
              const innFow = fallOfWickets[innNum as 1 | 2] || []
              const teamName = match.innings?.[innNum - 1]?.team || ''
              const teamShort = TEAM_SHORT[teamName] || teamName.slice(0, 3).toUpperCase()
              const teamColor = TEAM_COLORS[teamName]?.primary || '#6366f1'
              const innData = match.innings?.[innNum - 1]
              const isExpanded = expandedAccordion[innNum] ?? true

              if (innBat.length === 0 && innBowl.length === 0) return null

              return (
                <div
                  key={innNum}
                  className="bg-[#131320] border border-[#1e1e3a] rounded-xl overflow-hidden"
                >
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
                        {teamShort}
                        {innData && (
                          <>
                            {' \u2014 '}
                            {innData.runs}/{innData.wickets}
                            <span className="text-gray-400 font-normal">
                              {' '}
                              ({innData.overs} overs)
                            </span>
                          </>
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="border-t border-[#1e1e3a] p-4 sm:p-5 space-y-6">
                      {/* ── BATTING ── */}
                      {innBat.length > 0 && (
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
                                      <td className="py-2.5 pr-2 text-xs max-w-[200px] truncate">
                                        {isNotOut ? (
                                          <span className="text-green-500 font-medium">
                                            not out
                                          </span>
                                        ) : (
                                          <span className="text-gray-400">
                                            {b.dismissal}
                                            {b.fielder && (
                                              <>
                                                {' ('}
                                                <PlayerLink name={b.fielder} className="hover:text-indigo-400 transition-colors" />
                                                {')'}
                                              </>
                                            )}
                                            {b.bowler && (
                                              <>
                                                {' b '}
                                                <PlayerLink name={b.bowler} className="hover:text-indigo-400 transition-colors" />
                                              </>
                                            )}
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
                                      <td className="py-2.5 px-2 text-right text-gray-400">
                                        {b.balls}
                                      </td>
                                      <td className="py-2.5 px-2 text-right text-gray-400">
                                        {b.fours}
                                      </td>
                                      <td className="py-2.5 px-2 text-right text-gray-400">
                                        {b.sixes}
                                      </td>
                                      <td
                                        className={`py-2.5 pl-2 text-right font-medium ${srColor(
                                          sr,
                                          b.balls
                                        )}`}
                                      >
                                        {sr.toFixed(2)}
                                      </td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* Extras (itemized) + Total */}
                          {innData && (() => {
                            const ex = extrasBreakdown[innNum] || {
                              wides: 0,
                              noballs: 0,
                              legbyes: 0,
                              byes: 0,
                              penalty: 0,
                            }
                            // Show the four standard categories in the canonical
                            // scorecard order: b · lb · wd · nb (· p if non-zero).
                            // Each badge is rendered even when zero so the breakdown
                            // is always at-a-glance comparable across innings.
                            return (
                              <>
                                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 bg-[#0a0a0f]/50 rounded-lg px-4 py-2.5">
                                  <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                                    Extras
                                  </span>
                                  <div className="flex flex-wrap items-center gap-2 text-xs">
                                    <ExtraPill label="b" value={ex.byes} title="byes" />
                                    <ExtraPill label="lb" value={ex.legbyes} title="leg byes" />
                                    <ExtraPill label="wd" value={ex.wides} title="wides" />
                                    <ExtraPill label="nb" value={ex.noballs} title="no balls" />
                                    {ex.penalty > 0 && (
                                      <ExtraPill label="p" value={ex.penalty} title="penalty" />
                                    )}
                                    <span className="text-white font-bold ml-1">
                                      = {innData.extras}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-2 flex items-center justify-between bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-2.5">
                                  <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                                    Total
                                  </span>
                                  <span className="text-sm text-white font-bold">
                                    {innData.runs}/{innData.wickets}{' '}
                                    <span className="text-xs text-gray-400 font-normal">
                                      ({innData.overs} overs)
                                    </span>
                                  </span>
                                </div>
                              </>
                            )
                          })()}
                        </div>
                      )}

                      {/* ── BOWLING ── */}
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
                                  <th className="text-right py-2 px-2 font-medium">Dots</th>
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
                                      <td className="py-2.5 px-2 text-right text-gray-400">
                                        {b.runs}
                                      </td>
                                      <td
                                        className={`py-2.5 px-2 text-right font-bold ${
                                          b.wickets >= 3 ? 'text-purple-400' : 'text-white'
                                        }`}
                                      >
                                        {b.wickets}
                                      </td>
                                      <td className="py-2.5 px-2 text-right text-gray-400">
                                        {b.dots}
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

                      {/* ── FALL OF WICKETS ── */}
                      {innFow.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3">
                            Fall of Wickets
                          </h3>
                          {/* Visual timeline */}
                          {innData && (
                            <div className="mb-4 px-1 overflow-x-auto">
                              <div className="relative h-10 bg-[#1e1e3a]/50 rounded-full overflow-visible min-w-[300px]">
                                {innFow.map((w, idx) => {
                                  const pct = Math.min((w.score / (innData.runs || 1)) * 100, 100)
                                  return (
                                    <div
                                      key={idx}
                                      className="absolute top-1/2 -translate-y-1/2 group"
                                      style={{ left: `${pct}%` }}
                                    >
                                      <div
                                        className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[9px] font-bold text-white cursor-pointer -ml-2.5"
                                        style={{
                                          backgroundColor: teamColor,
                                          borderColor: `${teamColor}80`,
                                        }}
                                      >
                                        {idx + 1}
                                      </div>
                                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                                        <div className="bg-[#131320] border border-[#1e1e3a] rounded-lg px-3 py-2 text-xs whitespace-nowrap shadow-xl">
                                          <div className="text-white font-semibold">
                                            <PlayerLink name={w.playerOut} className="hover:text-indigo-400 transition-colors" />
                                          </div>
                                          <div className="text-gray-400">
                                            {w.howOut}
                                            {w.bowler && (
                                              <>
                                                {' b '}
                                                <PlayerLink name={w.bowler} className="hover:text-indigo-400 transition-colors" />
                                              </>
                                            )}
                                          </div>
                                          <div className="text-gray-500">
                                            {w.score}/{idx + 1} ({w.over} ov)
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-[#1e1e3a]">
                                  <th className="text-left py-2 pr-2 font-medium w-10">#</th>
                                  <th className="text-left py-2 px-2 font-medium">Over</th>
                                  <th className="text-left py-2 px-2 font-medium">Score</th>
                                  <th className="text-left py-2 px-2 font-medium">Batter Out</th>
                                  <th className="text-left py-2 pl-2 font-medium">How Out</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#1e1e3a]/50">
                                {innFow.map((w, idx) => (
                                  <tr
                                    key={idx}
                                    className="hover:bg-[#0a0a0f]/40 transition-colors"
                                  >
                                    <td className="py-2.5 pr-2 text-gray-400 font-medium">
                                      {idx + 1}
                                    </td>
                                    <td className="py-2.5 px-2 text-gray-300">{w.over}</td>
                                    <td className="py-2.5 px-2 text-white font-semibold">
                                      {w.score}/{idx + 1}
                                    </td>
                                    <td className="py-2.5 px-2 text-white">
                                      <PlayerLink name={w.playerOut} className="hover:text-indigo-400 transition-colors" />
                                    </td>
                                    <td className="py-2.5 pl-2 text-gray-400">
                                      {w.howOut}
                                      {w.bowler && (
                                        <>
                                          {' b '}
                                          <PlayerLink name={w.bowler} className="hover:text-indigo-400 transition-colors" />
                                        </>
                                      )}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}

                      {/* ── PARTNERSHIPS ── */}
                      {innPartners.length > 0 && (
                        <div>
                          <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">
                            Partnerships
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-xs text-gray-400 uppercase tracking-wider border-b border-[#1e1e3a]">
                                  <th className="text-left py-2 pr-2 font-medium w-12">Wkt</th>
                                  <th className="text-left py-2 px-2 font-medium">Batter 1</th>
                                  <th className="text-left py-2 px-2 font-medium">Batter 2</th>
                                  <th className="text-right py-2 px-2 font-medium">Runs</th>
                                  <th className="text-right py-2 pl-2 font-medium">Balls</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#1e1e3a]/50">
                                {innPartners.map((p: any) => {
                                  const isHi = p.runs >= 50
                                  // Per-batter contributions live inline on the
                                  // partnership record (regenerated from raw
                                  // cricsheet using non_striker tracking).
                                  const renderContrib = (runs?: number, balls?: number) =>
                                    runs != null && balls != null ? (
                                      <span className="text-[11px] text-gray-400 tabular-nums whitespace-nowrap ml-1">
                                        {runs}
                                        <span className="text-gray-600"> ({balls}b)</span>
                                      </span>
                                    ) : null
                                  return (
                                    <tr
                                      key={`${innNum}-${p.wicket}`}
                                      className={`hover:bg-[#0a0a0f]/40 transition-colors ${
                                        isHi ? 'bg-amber-500/[0.06]' : ''
                                      }`}
                                    >
                                      <td className="py-2.5 pr-2 text-gray-400 font-medium align-top">
                                        {p.wicket}
                                      </td>
                                      <td className="py-2.5 px-2 align-top">
                                        <div className="flex items-baseline gap-1 flex-wrap">
                                          <span className="text-white font-medium">
                                            {p.batter1}
                                          </span>
                                          {renderContrib(p.batter1Runs, p.batter1Balls)}
                                        </div>
                                      </td>
                                      <td className="py-2.5 px-2 align-top">
                                        <div className="flex items-baseline gap-1 flex-wrap">
                                          <span className="text-white font-medium">
                                            {p.batter2}
                                          </span>
                                          {renderContrib(p.batter2Runs, p.batter2Balls)}
                                        </div>
                                      </td>
                                      <td
                                        className={`py-2.5 px-2 text-right font-bold align-top ${
                                          isHi ? 'text-amber-400' : 'text-white'
                                        }`}
                                      >
                                        {p.runs}
                                        {isHi && (
                                          <span className="ml-1.5 text-[10px] text-amber-400/70 font-medium uppercase">
                                            50+
                                          </span>
                                        )}
                                      </td>
                                      <td className="py-2.5 pl-2 text-right text-gray-400 align-top">
                                        {p.balls}
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

            {/* Player of the Match badge */}
            {match.playerOfMatch && match.playerOfMatch.length > 0 && (
              <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-6">
                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-amber-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Player of the Match
                </h3>
                {match.playerOfMatch.map((potm: string) => {
                  const potmBat = batting.find((b: any) => b.batter === potm)
                  const potmBowl = bowling.find((b: any) => b.bowler === potm)
                  return (
                    <div
                      key={potm}
                      className="flex flex-col sm:flex-row items-center gap-5"
                    >
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/30 to-amber-600/10 border-2 border-amber-500/40 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-extrabold text-amber-300">
                          {getInitials(potm)}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-amber-400 mb-1">{potm}</h4>
                        <div className="flex flex-wrap gap-4 text-sm">
                          {potmBat && (
                            <span className="text-gray-300">
                              <span className="text-gray-500">Bat:</span>{' '}
                              {potmBat.runs} ({potmBat.balls}b) &middot; {potmBat.fours}x4{' '}
                              {potmBat.sixes}x6
                            </span>
                          )}
                          {potmBowl && (
                            <span className="text-gray-300">
                              <span className="text-gray-500">Bowl:</span>{' '}
                              {potmBowl.wickets}/{potmBowl.runs} ({potmBowl.overs} ov)
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

        {/* ─── SQUADS TAB ─── */}
        {activeTab === 'squads' && (
          <div className="space-y-6">
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl px-4 py-3 flex items-center gap-2 text-sm">
              <svg
                className="w-4 h-4 text-indigo-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-gray-400">
                Showing the{' '}
                <span className="text-indigo-400 font-semibold">Playing XI</span> for each side,
                derived from the match scorecards.
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[team1, team2].map((teamName, teamIdx) => {
                const teamColor = TEAM_COLORS[teamName]?.primary || '#6366f1'
                const xi = playingXI[teamName] || []
                const isFirstInn = teamIdx === 0
                return (
                  <div
                    key={teamName}
                    className="bg-[#131320] border border-[#1e1e3a] rounded-xl overflow-hidden"
                  >
                    <div
                      className="px-5 py-4 border-b border-[#1e1e3a] flex items-center gap-3"
                      style={{ background: `linear-gradient(135deg, ${teamColor}10, transparent)` }}
                    >
                      <TeamBadge team={teamName} size={36} season={match.season} />
                      <div>
                        <Link
                          to={`/teams/${teamName.replace(/\s+/g, '-').toLowerCase()}`}
                          className="font-bold text-white text-base hover:text-indigo-400 transition"
                        >
                          {teamName}
                        </Link>
                        <span
                          className={`text-[10px] ml-2 px-2 py-0.5 rounded-full border font-bold ${
                            isFirstInn
                              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                              : 'bg-white/5 text-gray-400 border-[#1e1e3a]'
                          }`}
                        >
                          {isFirstInn ? 'BATTED 1ST' : 'BATTED 2ND'}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                          Playing XI
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full border border-green-500/20 font-semibold">
                          {xi.length} PLAYERS
                        </span>
                      </div>
                      {xi.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">
                          Playing XI not available for this match.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {xi.map((playerName: string, idx: number) => (
                            <div
                              key={playerName}
                              className="flex items-center gap-3 px-3 py-2.5 bg-[#0a0a0f]/50 rounded-lg border border-[#1e1e3a]"
                            >
                              <span
                                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                                style={{
                                  backgroundColor: `${teamColor}20`,
                                  color: teamColor,
                                }}
                              >
                                {idx + 1}
                              </span>
                              <span className="text-sm font-medium text-white truncate">
                                {playerName}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ─── RUN PROGRESSION TAB ─── */}
        {activeTab === 'progression' && (
          <div className="space-y-4">
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-5 sm:p-6">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                Score Progression
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Cumulative score over by over for each innings.
              </p>

              {overByOverData.length === 0 ? (
                <div className="text-center py-12 text-sm text-gray-500">
                  Ball-by-ball data not available for this match.
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color1 }}
                      />
                      <span className="text-xs text-gray-400 font-medium">{short1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color2 }}
                      />
                      <span className="text-xs text-gray-400 font-medium">{short2}</span>
                    </div>
                  </div>
                  <div className="h-72 sm:h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={overByOverData}
                        margin={{ top: 8, right: 16, bottom: 4, left: 0 }}
                      >
                        <CartesianGrid stroke="#1e1e3a" strokeDasharray="3 3" />
                        <XAxis
                          dataKey="over"
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                          axisLine={{ stroke: '#1e1e3a' }}
                          tickLine={false}
                          label={{
                            value: 'Over',
                            position: 'insideBottomRight',
                            offset: -4,
                            fill: '#64748b',
                            fontSize: 11,
                          }}
                        />
                        <YAxis
                          tick={{ fill: '#94a3b8', fontSize: 12 }}
                          axisLine={{ stroke: '#1e1e3a' }}
                          tickLine={false}
                          label={{
                            value: 'Runs',
                            angle: -90,
                            position: 'insideLeft',
                            fill: '#64748b',
                            fontSize: 11,
                          }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#131320',
                            border: '1px solid #1e1e3a',
                            borderRadius: 8,
                            color: '#e2e8f0',
                            fontSize: 13,
                          }}
                          labelFormatter={(label) => `Over ${label}`}
                        />
                        <Area
                          type="monotone"
                          dataKey="inn1"
                          name={short1}
                          stroke={color1}
                          fill={color1}
                          fillOpacity={0.15}
                          strokeWidth={2}
                        />
                        <Area
                          type="monotone"
                          dataKey="inn2"
                          name={short2}
                          stroke={color2}
                          fill={color2}
                          fillOpacity={0.15}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </div>

            {/* ── Ball-by-Ball Commentary ── */}
            {(() => {
              const hasAnyBBB =
                groupedOvers[1].length > 0 || groupedOvers[2].length > 0
              if (!hasAnyBBB) return null

              const hasSuperOver =
                groupedOvers[3].length > 0 || groupedOvers[4].length > 0

              // Render a single innings's full commentary feed. Used once for
              // regulation views and twice (stacked) when Super Over is active.
              const renderFeed = (innNum: number, titleLabel: string) => {
                const innOvers = groupedOvers[innNum] || []
                const shouldCap = innNum <= 2
                const displayOvers =
                  shouldCap && !showAllOvers ? innOvers.slice(0, 5) : innOvers
                const innTeam = match.innings?.[innNum - 1]?.team || ''
                const innRuns = match.innings?.[innNum - 1]?.runs
                const innWkts = match.innings?.[innNum - 1]?.wickets
                const selectedScore =
                  typeof innRuns === 'number' ? `${innRuns}/${innWkts ?? 0}` : ''

                return (
                  <div key={`feed-inn-${innNum}`} className="p-4 sm:p-5 space-y-0">
                    <h3 className="text-sm font-bold text-white mb-4">
                      Ball-by-Ball Commentary &mdash; {titleLabel}
                      {innTeam && ` (${innTeam}${selectedScore ? ` ${selectedScore}` : ''})`}
                    </h3>

                    {innOvers.length === 0 && (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        No ball-by-ball data available for this innings.
                      </div>
                    )}

                    {displayOvers.map((over, overIdx) => {
                      const overBowler = over.balls[0]?.bwl || 'Unknown'
                      const ballsAsc = [...over.balls].sort(
                        (a, b) => (a.b ?? 0) - (b.b ?? 0)
                      )
                      return (
                        <div key={`over-${innNum}-${over.overNum}`}>
                          {over.balls.map((ball, ballIdx) => (
                            <div
                              key={`${over.overNum}-${ballIdx}`}
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
                          ))}

                          {overIdx < displayOvers.length && (
                            <div className="my-4 bg-[#1a1a30] border border-[#1e1e3a] rounded-lg p-4 border-l-4 border-l-indigo-500">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                                  End of Over {over.overNum}
                                </span>
                                <span className="text-sm font-bold text-white">
                                  {over.totalRuns} run{over.totalRuns === 1 ? '' : 's'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
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
                                <span className="text-xs font-semibold text-white">
                                  = {over.totalRuns} runs
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      )
                    })}

                    {shouldCap && !showAllOvers && innOvers.length > 5 && (
                      <div className="text-center py-4">
                        <button
                          onClick={() => setShowAllOvers(true)}
                          className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                        >
                          Load earlier overs &middot; ({innOvers.length - 5} more)
                        </button>
                      </div>
                    )}
                    {shouldCap && showAllOvers && innOvers.length > 5 && (
                      <div className="text-center py-4">
                        <button
                          onClick={() => setShowAllOvers(false)}
                          className="text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors"
                        >
                          Show fewer overs
                        </button>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl overflow-hidden">
                  {/* Innings Toggle — two full-width buttons covering the entire row */}
                  <div className="flex border-b border-[#1e1e3a]">
                    <button
                      onClick={() => {
                        setSelectedInnings(1)
                        setShowAllOvers(false)
                      }}
                      className={`flex-1 px-4 py-3 text-sm font-semibold transition-all text-center ${
                        selectedInnings === 1
                          ? 'bg-indigo-500 text-white'
                          : 'bg-[#1e1e3a] text-gray-400 hover:bg-[#252545] hover:text-gray-200'
                      }`}
                    >
                      1st Innings &mdash; {team1} {score1 && `\u2014 ${score1}`}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedInnings(2)
                        setShowAllOvers(false)
                      }}
                      className={`flex-1 px-4 py-3 text-sm font-semibold transition-all text-center ${
                        selectedInnings === 2
                          ? 'bg-indigo-500 text-white'
                          : 'bg-[#1e1e3a] text-gray-400 hover:bg-[#252545] hover:text-gray-200'
                      }`}
                    >
                      2nd Innings &mdash; {team2} {score2 && `\u2014 ${score2}`}
                    </button>
                    {hasSuperOver && (
                      <button
                        onClick={() => {
                          setSelectedInnings('super')
                          setShowAllOvers(false)
                        }}
                        className={`flex-1 px-4 py-3 text-sm font-semibold transition-all text-center ${
                          selectedInnings === 'super'
                            ? 'bg-amber-500 text-white'
                            : 'bg-[#1e1e3a] text-amber-400/80 hover:bg-[#252545] hover:text-amber-300'
                        }`}
                      >
                        Super Over
                      </button>
                    )}
                  </div>

                  {/* Commentary Feed(s) — inn 3+4 stacked when Super Over is active */}
                  {selectedInnings === 'super' ? (
                    <>
                      {renderFeed(3, 'Super Over — 1st Innings')}
                      <div className="border-t border-[#1e1e3a]" />
                      {renderFeed(4, 'Super Over — 2nd Innings')}
                    </>
                  ) : (
                    renderFeed(
                      selectedInnings,
                      selectedInnings === 1 ? '1st Innings' : '2nd Innings',
                    )
                  )}
                </div>
              )
            })()}
          </div>
        )}

        {/* ─── MVP TAB ─── */}
        {activeTab === 'mvp' && (
          <div className="space-y-6">
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-5 sm:p-6">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Match MVP Tracker
                </h2>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-1 rounded-full font-semibold uppercase tracking-wider">
                  Rating
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Performance ratings across batting, bowling &amp; fielding computed from match
                data.
              </p>

              {mvpData.length > 0 &&
                (() => {
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
                        <span className="text-sm font-extrabold text-black">
                          {getInitials(leader.name)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <PlayerLink name={leader.name} className="text-base font-bold text-white hover:text-indigo-400 transition-colors" />
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            style={{
                              backgroundColor: `${leaderColor}30`,
                              color: leaderColor,
                            }}
                          >
                            {TEAM_SHORT[leader.team] || leader.team.slice(0, 3).toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          {leader.hasBat && `${leader.batRuns}(${leader.batBalls})`}
                          {leader.hasBat && leader.hasBowl && ' \u00b7 '}
                          {leader.hasBowl && `${leader.bowlWickets}/${leader.bowlRuns}`}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div
                          className={`text-2xl font-extrabold ${ratingColor(
                            leader.overallRating
                          )}`}
                        >
                          {leader.overallRating.toFixed(1)}
                        </div>
                        <div
                          className="text-[10px] font-semibold uppercase"
                          style={{ color: `${leaderColor}90` }}
                        >
                          MVP Leader
                        </div>
                      </div>
                    </div>
                  )
                })()}
            </div>

            {/* Per-team MVP tables */}
            {[team1, team2].map((teamName) => {
              const teamColor = TEAM_COLORS[teamName]?.primary || '#6366f1'
              const teamPlayers = mvpData
                .filter((p) => p.team === teamName)
                .sort((a, b) => b.overallRating - a.overallRating)
              const innIdx = teamName === team1 ? 0 : 1
              const innData = match.innings?.[innIdx]

              return (
                <div
                  key={teamName}
                  className="bg-[#131320] border border-[#1e1e3a] rounded-xl overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-[#1e1e3a] flex items-center gap-3">
                    <TeamBadge team={teamName} size={32} season={match.season} />
                    <h3 className="text-base font-bold text-white">{teamName}</h3>
                    {innData && (
                      <span className="text-xs text-gray-400 ml-auto">
                        {innData.runs}/{innData.wickets} ({innData.overs} ov)
                      </span>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-[#0a0a0f]/80">
                          <th className="text-left px-4 py-3 text-[11px] text-gray-400 font-semibold uppercase tracking-wider">
                            Player
                          </th>
                          <th className="text-center px-3 py-3 text-[11px] text-gray-400 font-semibold uppercase tracking-wider hidden sm:table-cell">
                            Performance
                          </th>
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
                              className={`hover:bg-white/[0.02] ${
                                idx % 2 === 1 ? 'bg-white/[0.01]' : ''
                              } ${isLeader ? 'border-l-2' : ''}`}
                              style={
                                isLeader
                                  ? {
                                      borderLeftColor: teamColor,
                                      backgroundColor: `${teamColor}08`,
                                    }
                                  : {}
                              }
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
                                    <span className="text-[9px] font-bold text-white">
                                      {getInitials(p.name)}
                                    </span>
                                  </div>
                                  <PlayerLink name={p.name} className="font-semibold text-white text-sm hover:text-indigo-400 transition-colors" />
                                  {isLeader && (
                                    <svg
                                      className="w-3.5 h-3.5 text-yellow-400"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 py-3 text-center text-xs text-gray-400 hidden sm:table-cell">
                                {perfParts.join(' \u00b7 ')}
                              </td>
                              <td
                                className={`px-3 py-3 text-center font-bold ${
                                  p.hasBat ? ratingColor(p.batRating) : 'text-gray-600'
                                }`}
                              >
                                {p.hasBat ? p.batRating.toFixed(1) : '\u2014'}
                              </td>
                              <td
                                className={`px-3 py-3 text-center font-bold ${
                                  p.hasBowl ? ratingColor(p.bowlRating) : 'text-gray-600'
                                }`}
                              >
                                {p.hasBowl ? p.bowlRating.toFixed(1) : '\u2014'}
                              </td>
                              <td
                                className={`px-3 py-3 text-center font-medium ${
                                  p.catches + p.runOuts + p.stumpings > 0
                                    ? ratingColor(p.fieldRating)
                                    : 'text-gray-600'
                                }`}
                              >
                                {p.catches + p.runOuts + p.stumpings > 0
                                  ? p.fieldRating.toFixed(1)
                                  : '\u2014'}
                              </td>
                              <td className="px-3 py-3 text-center">
                                <span
                                  className={`text-sm font-extrabold ${ratingColor(
                                    p.overallRating
                                  )}`}
                                >
                                  {p.overallRating.toFixed(1)}
                                </span>
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
          </div>
        )}
      </main>
    </>
  )
}
