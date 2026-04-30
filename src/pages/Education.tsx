// Education page (/education).
// Reference content for newcomers: IPL rules, format, terminology,
// scoring conventions. Renders a series of accordion sections. The
// worked-example numbers in each section are computed live from the
// app's own player-stats.json so they're always current and authentic.
import React, { useMemo, useState } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { usePlayerStats } from '@/hooks/useData'

interface AccordionExample {
  initials: string
  name: string
  colorClass: string
  detail: string
  formulaCalc: string
  result: string
}

interface AccordionItem {
  id: string
  title: string
  iconBg: string
  iconColor: string
  icon: React.ReactNode
  formula: string
  description: string
  example?: AccordionExample
}

// Initials helper for the example cards (e.g. "Virat Kohli" \u2192 "VK").
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
}

// Format a number with thousands separators ("8,661").
const fmt = (n: number) => Math.round(n).toLocaleString('en-IN')

// Pick the all-time IPL batting-average leader with at least `minInnings`
// completed innings. Volume threshold guards against flash-in-the-pan
// careers (e.g. a batter dismissed once for a hundred). Returns null until
// player-stats data has loaded.
function pickBattingAverageExample(stats: any[] | undefined): AccordionExample | undefined {
  if (!stats) return undefined
  const candidates = stats.filter(s => (s.inningsBat - s.notOuts) >= 80 && s.battingAvg > 0)
  if (candidates.length === 0) return undefined
  const top = [...candidates].sort((a, b) => b.battingAvg - a.battingAvg)[0]
  const completed = top.inningsBat - top.notOuts
  return {
    initials: getInitials(top.playerName),
    name: top.playerName,
    colorClass: 'from-red-500/20 to-red-600/10 border-red-500/20 text-red-400',
    detail: `${fmt(top.runs)} runs across ${top.inningsBat} innings (${top.notOuts} not out)`,
    formulaCalc: `${fmt(top.runs)} \u00F7 (${top.inningsBat} \u2212 ${top.notOuts}) \u2248 `,
    result: (top.runs / completed).toFixed(2),
  }
}

// Highest career strike rate among batters with substantial volume
// (\u22651000 balls faced). Stops 30-ball "tail-end cameo" SRs from winning.
function pickStrikeRateExample(stats: any[] | undefined): AccordionExample | undefined {
  if (!stats) return undefined
  const candidates = stats.filter(s => s.ballsFaced >= 1000 && s.strikeRate > 0)
  if (candidates.length === 0) return undefined
  const top = [...candidates].sort((a, b) => b.strikeRate - a.strikeRate)[0]
  return {
    initials: getInitials(top.playerName),
    name: top.playerName,
    colorClass: 'from-green-500/20 to-green-600/10 border-green-500/20 text-green-400',
    detail: `${fmt(top.runs)} runs off ${fmt(top.ballsFaced)} balls`,
    formulaCalc: `(${fmt(top.runs)} \u00F7 ${fmt(top.ballsFaced)}) \u00D7 100 \u2248 `,
    result: ((top.runs / top.ballsFaced) * 100).toFixed(2),
  }
}

// Best (lowest) bowling average among bowlers with \u226575 IPL wickets.
function pickBowlingAverageExample(stats: any[] | undefined): AccordionExample | undefined {
  if (!stats) return undefined
  const candidates = stats.filter(s => s.wickets >= 75 && s.bowlingAvg > 0)
  if (candidates.length === 0) return undefined
  const top = [...candidates].sort((a, b) => a.bowlingAvg - b.bowlingAvg)[0]
  return {
    initials: getInitials(top.playerName),
    name: top.playerName,
    colorClass: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
    detail: `${fmt(top.runsConceded)} runs conceded for ${top.wickets} wickets`,
    formulaCalc: `${fmt(top.runsConceded)} \u00F7 ${top.wickets} \u2248 `,
    result: (top.runsConceded / top.wickets).toFixed(2),
  }
}

// Build the full accordion list. Examples come from real player-stats.json;
// the structural metadata (formula text, prose, icons) is static.
function buildAccordionItems(stats: any[] | undefined): AccordionItem[] {
  return [
  {
    id: 'batting-average',
    title: 'Batting Average',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    formula: 'Batting Average = Runs Scored \u00F7 (Innings \u2212 Not Outs)',
    description: 'Batting average is one of the most fundamental statistics in cricket. It measures the average number of runs a batter scores per completed innings. A higher batting average indicates a more consistent and reliable batter. The "Not Outs" are subtracted from total innings because in those innings the batter did not have the opportunity to be dismissed, so including them would unfairly lower the average.',
    example: pickBattingAverageExample(stats),
  },
  {
    id: 'strike-rate',
    title: 'Strike Rate',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    formula: 'Strike Rate = (Runs Scored \u00F7 Balls Faced) \u00D7 100',
    description: 'Strike rate measures how quickly a batter scores runs. In T20 cricket like the IPL, a high strike rate is crucial as teams need to score as many runs as possible within the limited 20 overs. A strike rate of 150 means the batter scores 150 runs per 100 balls faced on average.',
    example: pickStrikeRateExample(stats),
  },
  {
    id: 'bowling-average',
    title: 'Bowling Average',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    formula: 'Bowling Average = Runs Conceded \u00F7 Wickets Taken',
    description: 'Bowling average indicates how many runs a bowler concedes per wicket taken. A lower bowling average is better, as it means the bowler takes wickets at a lower cost. In T20 cricket, a bowling average under 25 is generally considered excellent.',
    example: pickBowlingAverageExample(stats),
  },
  {
    id: 'economy-rate',
    title: 'Economy Rate',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-400',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    formula: 'Economy Rate = Runs Conceded \u00F7 Overs Bowled',
    description: 'Economy rate measures how many runs a bowler concedes per over. In IPL cricket, where batsmen are extremely aggressive, an economy rate under 8 is considered very good. This stat is particularly important in T20 cricket as it shows how well a bowler restricts scoring.',
  },
  {
    id: 'bowling-strike-rate',
    title: 'Bowling Strike Rate',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    formula: 'Bowling SR = Balls Bowled \u00F7 Wickets Taken',
    description: 'Bowling strike rate tells you how frequently a bowler takes wickets, measured in balls per wicket. A lower bowling strike rate is better. In T20s, a bowling strike rate under 18 is considered excellent as it means the bowler takes a wicket roughly every 3 overs.',
  },
  {
    id: 'net-run-rate',
    title: 'Net Run Rate (NRR)',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
    formula: 'NRR = (Runs scored / Overs faced) \u2212 (Runs conceded / Overs bowled)',
    description: 'Net Run Rate is used to separate teams that finish on the same number of points in the league stage. It is the difference between the rate at which a team scores and the rate at which it concedes runs. A positive NRR means the team is scoring faster than they are being scored against. NRR is crucial in IPL as it often decides playoff qualification.',
  },
  ]
}

// ── DLS Standard Edition resource percentages (20-over format) ──
// TABLE[oversRemaining][wicketsLost] → percentage of innings resources
// remaining at that state. 100% at (20 overs, 0 wickets); 0% at any
// state with no overs remaining. Values approximate the published ICC
// DLS Standard Edition table for T20 cricket.
const DLS_RESOURCE_TABLE: number[][] = [
  /* 0 overs  */ [  0.0,   0.0,   0.0,   0.0,   0.0,   0.0,   0.0,   0.0,   0.0,   0.0],
  /* 1 over   */ [  4.9,   4.9,   4.9,   4.9,   4.9,   4.8,   4.7,   4.6,   4.3,   3.4],
  /* 2 overs  */ [  9.7,   9.7,   9.7,   9.6,   9.6,   9.5,   9.3,   8.9,   8.0,   5.9],
  /* 3 overs  */ [ 14.3,  14.3,  14.3,  14.2,  14.1,  13.9,  13.5,  12.7,  11.2,   7.8],
  /* 4 overs  */ [ 18.7,  18.7,  18.7,  18.6,  18.4,  18.0,  17.2,  16.0,  13.7,   9.0],
  /* 5 overs  */ [ 22.0,  22.0,  21.9,  21.7,  21.4,  20.7,  19.6,  17.9,  15.0,   9.7],
  /* 6 overs  */ [ 27.0,  26.9,  26.8,  26.5,  26.0,  25.0,  23.4,  21.0,  17.0,  10.6],
  /* 7 overs  */ [ 34.4,  34.2,  33.9,  33.5,  32.7,  31.0,  28.6,  25.0,  19.3,  11.3],
  /* 8 overs  */ [ 41.4,  41.1,  40.6,  39.9,  38.6,  35.9,  32.4,  27.4,  20.2,  11.3],
  /* 9 overs  */ [ 48.1,  47.5,  46.7,  45.6,  43.6,  40.0,  35.3,  28.9,  20.8,  11.4],
  /* 10 overs */ [ 54.5,  53.5,  52.4,  50.7,  48.0,  43.2,  37.4,  29.9,  21.3,  11.4],
  /* 11 overs */ [ 60.5,  59.1,  57.4,  55.1,  51.4,  45.4,  38.8,  30.7,  21.6,  11.4],
  /* 12 overs */ [ 66.2,  64.3,  61.9,  58.9,  54.0,  47.3,  40.0,  31.4,  21.9,  11.4],
  /* 13 overs */ [ 71.5,  69.1,  66.0,  62.3,  56.4,  48.9,  41.0,  31.9,  22.1,  11.4],
  /* 14 overs */ [ 76.5,  73.5,  69.7,  65.0,  58.4,  50.4,  41.9,  32.4,  22.3,  11.4],
  /* 15 overs */ [ 81.1,  77.6,  73.1,  67.4,  60.2,  51.8,  42.7,  32.8,  22.4,  11.5],
  /* 16 overs */ [ 85.5,  81.3,  76.1,  69.6,  61.8,  53.0,  43.4,  33.2,  22.6,  11.5],
  /* 17 overs */ [ 89.6,  84.7,  78.7,  71.5,  63.2,  54.0,  44.1,  33.5,  22.7,  11.5],
  /* 18 overs */ [ 93.4,  87.7,  81.0,  73.2,  64.4,  54.9,  44.7,  33.8,  22.8,  11.5],
  /* 19 overs */ [ 96.8,  90.4,  83.0,  74.7,  65.5,  55.7,  45.2,  34.1,  22.9,  11.5],
  /* 20 overs */ [100.0,  92.7,  84.7,  76.0,  66.5,  56.4,  45.6,  34.3,  23.0,  11.5],
]

// Linear interpolation across the overs axis so fractional overs (e.g.
// 14.5 = 14 overs 3 balls) return a sensible value. 10 wickets lost is
// effectively all-out → 0% resources.
function getDLSResourcePercentage(oversRemaining: number, wicketsLost: number): number {
  if (wicketsLost >= 10) return 0
  const w = Math.max(0, Math.min(9, Math.floor(wicketsLost)))
  const o = Math.max(0, Math.min(20, oversRemaining))
  const lo = Math.floor(o)
  const hi = Math.ceil(o)
  if (lo === hi) return DLS_RESOURCE_TABLE[lo][w]
  const t = o - lo
  return DLS_RESOURCE_TABLE[lo][w] * (1 - t) + DLS_RESOURCE_TABLE[hi][w] * t
}

function DLSCalculator() {
  // Inputs are stored as strings (not numbers) so clearing the field
  // leaves it empty instead of snapping to "0" — that was the annoying
  // behaviour of the previous version.
  const [team1ScoreStr, setTeam1ScoreStr] = useState('185')
  const [oversRemainingStr, setOversRemainingStr] = useState('15')
  const [wicketsLostStr, setWicketsLostStr] = useState('3')
  const [result, setResult] = useState<{ target: number; resourcePct: number; team1: number; overs: number; wickets: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const calculate = () => {
    setError(null)

    const team1 = parseInt(team1ScoreStr, 10)
    const overs = parseFloat(oversRemainingStr)
    const wickets = parseInt(wicketsLostStr, 10)

    if (isNaN(team1) || team1 < 0) {
      setResult(null)
      setError('Enter Team 1’s innings total (a non-negative whole number).')
      return
    }
    if (isNaN(overs) || overs < 0 || overs > 20) {
      setResult(null)
      setError('Overs available for Team 2 must be between 0 and 20.')
      return
    }
    if (isNaN(wickets) || wickets < 0 || wickets > 9) {
      setResult(null)
      setError('Wickets lost must be between 0 and 9.')
      return
    }

    // Standard scenario: Team 1 batted full 20 overs (100% resources).
    // Team 2's resources available = R(oversRemaining, wicketsLost).
    // Revised target = ceil(Team1 × R2 / R1) + 1, with R1 = 100.
    const resourcePct = getDLSResourcePercentage(overs, wickets)
    const target = Math.ceil((team1 * resourcePct) / 100) + 1
    setResult({ target, resourcePct, team1, overs, wickets })
  }

  const reset = () => {
    setTeam1ScoreStr('')
    setOversRemainingStr('')
    setWicketsLostStr('')
    setResult(null)
    setError(null)
  }

  return (
    <section className="max-w-4xl mx-auto px-3 sm:px-4 mb-12 sm:mb-20">
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6 md:p-8 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Duckworth-Lewis-Stern Calculator</h2>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Revised T20 target when Team 2's innings is reduced</p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6 md:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-5">
            <div>
              <label htmlFor="dls-team1" className="block text-xs sm:text-sm text-gray-400 font-medium mb-2">
                Team 1 Score
                <span className="block text-[11px] text-gray-500 font-normal">(innings 1 total, full 20 overs)</span>
              </label>
              <input
                id="dls-team1"
                type="number"
                inputMode="numeric"
                value={team1ScoreStr}
                onChange={e => setTeam1ScoreStr(e.target.value)}
                className="w-full bg-[#0f0f1a] border border-border rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-accent transition placeholder-gray-600"
                placeholder="e.g. 185"
                min={0}
              />
            </div>
            <div>
              <label htmlFor="dls-overs" className="block text-xs sm:text-sm text-gray-400 font-medium mb-2">
                Overs Remaining
                <span className="block text-[11px] text-gray-500 font-normal">(for Team 2 after rain)</span>
              </label>
              <input
                id="dls-overs"
                type="number"
                inputMode="decimal"
                step="0.1"
                value={oversRemainingStr}
                onChange={e => setOversRemainingStr(e.target.value)}
                className="w-full bg-[#0f0f1a] border border-border rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-accent transition placeholder-gray-600"
                placeholder="e.g. 15"
                min={0}
                max={20}
              />
            </div>
            <div>
              <label htmlFor="dls-wickets" className="block text-xs sm:text-sm text-gray-400 font-medium mb-2">
                Wickets Lost
                <span className="block text-[11px] text-gray-500 font-normal">(by Team 2 so far)</span>
              </label>
              <input
                id="dls-wickets"
                type="number"
                inputMode="numeric"
                value={wicketsLostStr}
                onChange={e => setWicketsLostStr(e.target.value)}
                className="w-full bg-[#0f0f1a] border border-border rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-accent transition placeholder-gray-600"
                placeholder="0–9"
                min={0}
                max={9}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={calculate}
              className="w-full sm:w-auto px-8 py-3 bg-accent hover:bg-[#4f46e5] text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              Calculate
            </button>
            <button
              onClick={reset}
              className="w-full sm:w-auto px-6 py-3 bg-transparent hover:bg-white/[0.04] border border-border text-gray-400 hover:text-white font-medium rounded-xl transition"
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="mt-5 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-300" role="alert">
              {error}
            </div>
          )}

          {result !== null && (
            <div className="mt-6 bg-[#0f0f1a] border border-accent/20 rounded-xl p-5 sm:p-6 glow">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">DLS Result</p>
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <p className="text-3xl sm:text-4xl font-extrabold text-white">{result.target}</p>
                <p className="text-base sm:text-lg text-gray-400">Revised Target</p>
              </div>
              <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                Team 2 has <span className="text-accentLight font-semibold">{result.resourcePct.toFixed(1)}%</span> of the innings resources available
                ({result.overs} {result.overs === 1 ? 'over' : 'overs'} remaining, {result.wickets} {result.wickets === 1 ? 'wicket' : 'wickets'} lost).
                To win, they need to score <span className="text-white font-semibold">{result.target}</span> runs &mdash; computed as
                <span className="font-mono text-accentLight"> ceil({result.team1} × {result.resourcePct.toFixed(1)}% / 100%) + 1</span>.
              </p>
              <p className="text-xs text-gray-500 mt-3 italic">
                Note: this is the simplified Standard Edition for educational purposes. Official ICC DLS calculations also account for
                Team 1's resource usage if their innings was also interrupted.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function Education() {
  const [openId, setOpenId] = useState<string | null>('batting-average')
  const { data: playerStats } = usePlayerStats()

  // Recompute the leader-based examples whenever player-stats changes.
  // Memoised so we don't re-pick on every keystroke.
  const accordionItems = useMemo(() => buildAccordionItems(playerStats), [playerStats])

  const toggle = (id: string) => {
    setOpenId(prev => prev === id ? null : id)
  }

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-emerald-900/5" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-10">
          <Breadcrumb items={[{ label: 'Education' }]} />
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2 sm:mb-3">Learn Cricket Statistics</h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-400">Understand the numbers behind the game</p>
          </div>
        </div>
      </section>

      {/* Accordion Sections */}
      <section className="max-w-4xl mx-auto px-3 sm:px-4 mb-10 sm:mb-16">
        <div className="space-y-3">
          {accordionItems.map(item => {
            const isOpen = openId === item.id
            return (
              <div
                key={item.id}
                className={`bg-card border rounded-2xl overflow-hidden transition-colors ${isOpen ? 'border-accent/20 glow' : 'border-border hover:border-border/80'}`}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`shrink-0 w-9 h-9 rounded-lg ${item.iconBg} flex items-center justify-center ${item.iconColor}`}>
                      {item.icon}
                    </div>
                    <span className="text-base sm:text-lg font-bold text-white truncate">{item.title}</span>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? 'text-accent rotate-180' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="mb-5 rounded-xl p-4 px-5 font-mono font-semibold text-accentLight text-base sm:text-lg tracking-wide overflow-x-auto" style={{
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.02) 100%)',
                      border: '1px solid rgba(99,102,241,0.15)',
                    }}>
                      <span className="whitespace-nowrap">{item.formula}</span>
                    </div>
                    <p className="text-gray-400 leading-relaxed mb-5">{item.description}</p>
                    {item.example && (
                      <div className="bg-[#0f0f1a] border border-border rounded-xl p-5">
                        <p className="text-xs text-accent uppercase tracking-wider font-semibold mb-3">Example</p>
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.example.colorClass} border flex items-center justify-center flex-shrink-0`}>
                            <span className="text-xs font-bold">{item.example.initials}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-white">{item.example.name}</p>
                            <p className="text-sm text-gray-400 mt-1">{item.example.detail}</p>
                            <div className="mt-3 rounded-xl p-4 px-5 font-mono font-semibold text-accentLight text-sm sm:text-base tracking-wide overflow-x-auto" style={{
                              background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.02) 100%)',
                              border: '1px solid rgba(99,102,241,0.15)',
                            }}>
                              <span className="whitespace-nowrap">{item.example.formulaCalc}<span className="text-white">{item.example.result}</span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* DLS Calculator */}
      <DLSCalculator />
    </div>
  )
}
