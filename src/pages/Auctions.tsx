// Auctions / Scouting page (/auctions).
// Cross-league scouting board: filter and rank uncapped/overseas talent
// from BBL, PSL, CPL, etc., flag IPL crossovers, and pivot into per-player
// scout sheets (/scout/:id).
import { useState, useMemo, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { useScoutAll, useScoutTargets, useScoutLeague, useIPLCrossover } from '@/hooks/useData'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

type AuctionPlayer = {
  name: string; country: string; role: string; initials: string
  basePrice: string; soldPrice: string; soldPriceNum: number
  team: string; teamColor: string; status: 'sold' | 'unsold'; fire: boolean
}

type AuctionYear = {
  year: string; label: string; location: string; dates: string; auctioneer: string
  totalSold: number; totalSpend: string; totalSpendNum: number
  highestBid: string; highestBidPlayer: string; highestBidTeam: string; unsoldCount: number
  players: AuctionPlayer[]
  teamSpending: { team: string; color: string; amount: number; label: string }[]
  highlights: { icon: string; title: string; desc: string }[]
}

type ScoutPlayer = {
  id: string; name: string; leagues: string[]; teams: string[]
  country?: string
  matches: number; inIPL: boolean; archetype: string; positionLabel: string
  innings: number; runs: number; ballsFaced: number; battingAvg: number; strikeRate: number
  highScore: number; fours: number; sixes: number; fifties: number; hundreds: number
  boundaryPct: number; dotBallPct: number; ballsPerBoundary: number
  ppSR: number; ppRuns: number; midSR: number; midRuns: number; deathSR: number; deathRuns: number
  bowlInnings: number; wickets: number; bowlEcon: number; bowlAvg: number; bowlSR: number
  bestBowling: string; bowlDotPct: number
  ppBowlEcon: number; ppBowlWickets: number; midBowlEcon: number; midBowlWickets: number
  deathBowlEcon: number; deathBowlWickets: number
  catches: number; stumpings: number; runOuts: number
  batImpact: number; bowlImpact: number; fieldingValue: number; allRounderIndex: number
  dismissals: Record<string, number>; recentSeasons: string[]
}

type MainTab = 'history' | 'scouting' | 'targets' | 'crossover' | 'leagues'

// ════════════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ════════════════════════════════════════════════════════════════════════════════

const MAIN_TABS: { key: MainTab; label: string; icon: string }[] = [
  { key: 'history', label: 'Auction History', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
  { key: 'scouting', label: 'Scouting Hub', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
  { key: 'targets', label: 'Top Targets', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { key: 'crossover', label: 'IPL Crossover', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { key: 'leagues', label: 'League Comparison', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
]

const LEAGUE_OPTIONS: { code: string; label: string }[] = [
  { code: 'all', label: 'All Leagues' },
  { code: 'bbl', label: 'BBL' },
  { code: 'psl', label: 'PSL' },
  { code: 'cpl', label: 'CPL' },
  { code: 'sa20', label: 'SA20' },
  { code: 'hnd', label: 'The Hundred' },
  { code: 'bpl', label: 'BPL' },
  { code: 'lpl', label: 'LPL' },
  { code: 'ilt20', label: 'ILT20' },
  { code: 'mlc', label: 'MLC' },
  { code: 'ntb', label: 'T20 Blast' },
  { code: 'smat', label: 'SMAT' },
]

const LEAGUE_CODE_TO_LABEL: Record<string, string> = {
  BBL: 'BBL', PSL: 'PSL', CPL: 'CPL', SA20: 'SA20', HND: 'The Hundred',
  BPL: 'BPL', LPL: 'LPL', ILT20: 'ILT20', MLC: 'MLC', NTB: 'T20 Blast', SMAT: 'SMAT',
}

const ARCHETYPES = [
  'All', 'Power Hitter', 'Accumulator-Accelerator', 'Anchor', 'Finisher',
  'Death Specialist', 'Spin Controller', 'Pace Enforcer', 'Genuine All-rounder',
  'Batting All-rounder', 'Bowling All-rounder', 'Wicketkeeper-Batter',
]

const COUNTRY_OPTIONS = [
  'All', 'India', 'Australia', 'England', 'South Africa', 'New Zealand',
  'West Indies', 'Sri Lanka', 'Afghanistan', 'USA', 'Other',
]

const SORT_OPTIONS = [
  { key: 'batImpact', label: 'Bat Impact' },
  { key: 'bowlImpact', label: 'Bowl Impact' },
  { key: 'allRounderIndex', label: 'All-rounder Index' },
  { key: 'strikeRate', label: 'Strike Rate' },
  { key: 'battingAvg', label: 'Batting Avg' },
  { key: 'wickets', label: 'Wickets' },
  { key: 'bowlEcon', label: 'Economy' },
  { key: 'matches', label: 'Matches' },
  { key: 'runs', label: 'Runs' },
]

const ITEMS_PER_PAGE = 20

const TARGET_VIEWS = [
  { key: 'batsmen', label: 'Top 20 Batsmen' },
  { key: 'bowlers', label: 'Top 20 Bowlers' },
  { key: 'allrounders', label: 'Top 20 All-rounders' },
  { key: 'value', label: 'Value Picks' },
  { key: 'rising', label: 'Rising Stars' },
]

// ════════════════════════════════════════════════════════════════════════════════
// AUCTION HISTORY DATA (preserved from original)
// ════════════════════════════════════════════════════════════════════════════════

const auctionData: AuctionYear[] = [
  {
    year: '2024', label: 'IPL 2024 Mega Auction', location: 'Dubai, UAE',
    dates: 'Dec 19\u201320, 2023', auctioneer: 'Hugh Edmeades',
    totalSold: 72, totalSpend: '\u20B9551.7 Cr', totalSpendNum: 551.7,
    highestBid: '\u20B924.75 Cr', highestBidPlayer: 'Mitchell Starc', highestBidTeam: 'KKR', unsoldCount: 46,
    players: [
      { name: 'Mitchell Starc', country: 'AUS', role: 'Fast Bowler', initials: 'MS', basePrice: '2 Cr', soldPrice: '24.75 Cr', soldPriceNum: 24.75, team: 'KKR', teamColor: 'purple', status: 'sold', fire: true },
      { name: 'Pat Cummins', country: 'AUS', role: 'Fast Bowler', initials: 'PC', basePrice: '2 Cr', soldPrice: '20.50 Cr', soldPriceNum: 20.50, team: 'SRH', teamColor: 'orange', status: 'sold', fire: true },
      { name: 'Daryl Mitchell', country: 'NZ', role: 'All-rounder', initials: 'DM', basePrice: '2 Cr', soldPrice: '14 Cr', soldPriceNum: 14, team: 'CSK', teamColor: 'yellow', status: 'sold', fire: false },
      { name: 'Harshal Patel', country: 'IND', role: 'Medium Fast', initials: 'HP', basePrice: '2 Cr', soldPrice: '11.50 Cr', soldPriceNum: 11.50, team: 'PBKS', teamColor: 'red', status: 'sold', fire: false },
      { name: 'Travis Head', country: 'AUS', role: 'Batter', initials: 'TH', basePrice: '2 Cr', soldPrice: '6.80 Cr', soldPriceNum: 6.80, team: 'SRH', teamColor: 'orange', status: 'sold', fire: false },
      { name: 'Alzarri Joseph', country: 'WI', role: 'Fast Bowler', initials: 'AJ', basePrice: '2 Cr', soldPrice: '11.50 Cr', soldPriceNum: 11.50, team: 'RCB', teamColor: 'red', status: 'sold', fire: false },
      { name: 'Wanindu Hasaranga', country: 'SL', role: 'Leg Spinner', initials: 'WH', basePrice: '2 Cr', soldPrice: '', soldPriceNum: 0, team: '', teamColor: 'gray', status: 'unsold', fire: false },
    ],
    teamSpending: [
      { team: 'KKR', color: 'bg-purple-500', amount: 80.4, label: '\u20B980.4 Cr' },
      { team: 'SRH', color: 'bg-orange-500', amount: 73.6, label: '\u20B973.6 Cr' },
      { team: 'RCB', color: 'bg-red-500', amount: 68.8, label: '\u20B968.8 Cr' },
      { team: 'CSK', color: 'bg-yellow-500', amount: 62.5, label: '\u20B962.5 Cr' },
      { team: 'MI', color: 'bg-blue-500', amount: 58.2, label: '\u20B958.2 Cr' },
      { team: 'DC', color: 'bg-blue-400', amount: 55.1, label: '\u20B955.1 Cr' },
      { team: 'PBKS', color: 'bg-red-400', amount: 52.7, label: '\u20B952.7 Cr' },
      { team: 'RR', color: 'bg-pink-500', amount: 48.3, label: '\u20B948.3 Cr' },
      { team: 'GT', color: 'bg-cyan-500', amount: 41.9, label: '\u20B941.9 Cr' },
      { team: 'LSG', color: 'bg-teal-500', amount: 38.2, label: '\u20B938.2 Cr' },
    ],
    highlights: [
      { icon: '\uD83D\uDD25', title: 'Mitchell Starc became the most expensive IPL buy ever at \u20B924.75 Cr', desc: 'Kolkata Knight Riders won an intense bidding war to secure the Australian fast bowler, breaking the previous record.' },
      { icon: '\uD83D\uDCB0', title: 'Pat Cummins fetched \u20B920.50 Cr, becoming 2nd most expensive buy', desc: 'SRH invested heavily in the Australian captain to lead their pace attack for IPL 2024.' },
      { icon: '\uD83D\uDCCA', title: '72 players sold across 2 days with a total spend of \u20B9551.7 Crore', desc: 'Teams strategically filled their squads with a mix of experienced internationals and promising domestic talent.' },
    ],
  },
  {
    year: '2025', label: 'IPL 2025 Mega Auction', location: 'Jeddah, Saudi Arabia',
    dates: 'Nov 24\u201325, 2024', auctioneer: 'Mallika Sagar',
    totalSold: 182, totalSpend: '\u20B9639.15 Cr', totalSpendNum: 639.15,
    highestBid: '\u20B926.75 Cr', highestBidPlayer: 'Rishabh Pant', highestBidTeam: 'LSG', unsoldCount: 122,
    players: [
      { name: 'Rishabh Pant', country: 'IND', role: 'WK-Batter', initials: 'RP', basePrice: '2 Cr', soldPrice: '27 Cr', soldPriceNum: 27, team: 'LSG', teamColor: 'teal', status: 'sold', fire: true },
      { name: 'Shreyas Iyer', country: 'IND', role: 'Batter', initials: 'SI', basePrice: '2 Cr', soldPrice: '26.75 Cr', soldPriceNum: 26.75, team: 'PBKS', teamColor: 'red', status: 'sold', fire: true },
      { name: 'Venkatesh Iyer', country: 'IND', role: 'All-rounder', initials: 'VI', basePrice: '2 Cr', soldPrice: '23.75 Cr', soldPriceNum: 23.75, team: 'KKR', teamColor: 'purple', status: 'sold', fire: true },
      { name: 'Jos Buttler', country: 'ENG', role: 'WK-Batter', initials: 'JB', basePrice: '2 Cr', soldPrice: '15.75 Cr', soldPriceNum: 15.75, team: 'GT', teamColor: 'cyan', status: 'sold', fire: false },
      { name: 'KL Rahul', country: 'IND', role: 'WK-Batter', initials: 'KL', basePrice: '2 Cr', soldPrice: '14 Cr', soldPriceNum: 14, team: 'DC', teamColor: 'blue', status: 'sold', fire: false },
      { name: 'Mohammed Shami', country: 'IND', role: 'Fast Bowler', initials: 'MS', basePrice: '2 Cr', soldPrice: '10 Cr', soldPriceNum: 10, team: 'SRH', teamColor: 'orange', status: 'sold', fire: false },
      { name: 'Kagiso Rabada', country: 'SA', role: 'Fast Bowler', initials: 'KR', basePrice: '2 Cr', soldPrice: '10.75 Cr', soldPriceNum: 10.75, team: 'GT', teamColor: 'cyan', status: 'sold', fire: false },
      { name: 'Prithvi Shaw', country: 'IND', role: 'Batter', initials: 'PS', basePrice: '0.75 Cr', soldPrice: '', soldPriceNum: 0, team: '', teamColor: 'gray', status: 'unsold', fire: false },
    ],
    teamSpending: [
      { team: 'PBKS', color: 'bg-red-400', amount: 110.5, label: '\u20B9110.5 Cr' },
      { team: 'LSG', color: 'bg-teal-500', amount: 95.2, label: '\u20B995.2 Cr' },
      { team: 'KKR', color: 'bg-purple-500', amount: 78.4, label: '\u20B978.4 Cr' },
      { team: 'RCB', color: 'bg-red-500', amount: 72.3, label: '\u20B972.3 Cr' },
      { team: 'DC', color: 'bg-blue-400', amount: 68.9, label: '\u20B968.9 Cr' },
      { team: 'GT', color: 'bg-cyan-500', amount: 65.7, label: '\u20B965.7 Cr' },
      { team: 'SRH', color: 'bg-orange-500', amount: 58.1, label: '\u20B958.1 Cr' },
      { team: 'MI', color: 'bg-blue-500', amount: 55.8, label: '\u20B955.8 Cr' },
      { team: 'CSK', color: 'bg-yellow-500', amount: 50.2, label: '\u20B950.2 Cr' },
      { team: 'RR', color: 'bg-pink-500', amount: 42.6, label: '\u20B942.6 Cr' },
    ],
    highlights: [
      { icon: '\uD83D\uDD25', title: 'Rishabh Pant became the most expensive IPL buy ever at \u20B927 Cr', desc: 'Lucknow Super Giants secured the explosive wicketkeeper-batter in a fierce bidding war.' },
      { icon: '\uD83D\uDCB0', title: 'Shreyas Iyer fetched \u20B926.75 Cr from Punjab Kings', desc: 'PBKS invested heavily to secure a proven IPL captain to lead their rebuilt squad.' },
      { icon: '\uD83D\uDCCA', title: '182 players sold over 2 days totaling \u20B9639.15 Crore', desc: 'The mega auction saw 10 franchises aggressively rebuild their squads for the new cycle.' },
    ],
  },
  {
    year: '2026', label: 'IPL 2026 Auction', location: 'TBD',
    dates: 'Expected Late 2025', auctioneer: 'TBD',
    totalSold: 0, totalSpend: 'TBD', totalSpendNum: 0,
    highestBid: 'TBD', highestBidPlayer: 'TBD', highestBidTeam: 'TBD', unsoldCount: 0,
    players: [], teamSpending: [],
    highlights: [
      { icon: '\uD83D\uDCC5', title: 'IPL 2026 auction details yet to be announced', desc: 'The mini auction for IPL 2026 is expected to take place in late 2025. Franchise retention lists will be announced prior.' },
    ],
  },
]

const teamColorClasses: Record<string, string> = {
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
  gray: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
}

const avatarColorClasses: Record<string, string> = {
  purple: 'from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400',
  orange: 'from-orange-500/20 to-orange-600/10 border-orange-500/20 text-orange-400',
  yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/20 text-yellow-400',
  red: 'from-red-500/20 to-red-600/10 border-red-500/20 text-red-400',
  gray: 'from-gray-500/20 to-gray-600/10 border-gray-500/20 text-gray-500',
  blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
  cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 text-cyan-400',
  teal: 'from-teal-500/20 to-teal-600/10 border-teal-500/20 text-teal-400',
}

// ════════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ════════════════════════════════════════════════════════════════════════════════

function impactColor(val: number, max: number): string {
  const pct = val / max
  if (pct > 0.75) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
  if (pct > 0.5) return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
  if (pct > 0.25) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
  return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
}

function archetypeBadgeColor(archetype: string): string {
  const a = archetype.toLowerCase()
  if (a.includes('power')) return 'bg-red-500/15 text-red-400 border-red-500/25'
  if (a.includes('spinner') || a.includes('spin')) return 'bg-purple-500/15 text-purple-400 border-purple-500/25'
  if (a.includes('pace') || a.includes('death') || a.includes('fast')) return 'bg-orange-500/15 text-orange-400 border-orange-500/25'
  if (a.includes('all-rounder') || a.includes('allrounder')) return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25'
  if (a.includes('anchor') || a.includes('accumulator')) return 'bg-blue-500/15 text-blue-400 border-blue-500/25'
  if (a.includes('finisher')) return 'bg-amber-500/15 text-amber-400 border-amber-500/25'
  if (a.includes('wicketkeeper')) return 'bg-teal-500/15 text-teal-400 border-teal-500/25'
  return 'bg-gray-500/15 text-gray-400 border-gray-500/25'
}

function formatNum(n: number, decimals = 1): string {
  if (n == null || isNaN(n)) return '-'
  return n.toFixed(decimals)
}

function getInitials(name: string): string {
  const parts = name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return (parts[0]?.substring(0, 2) || '??').toUpperCase()
}

// ════════════════════════════════════════════════════════════════════════════════
// MINI COMPONENTS
// ════════════════════════════════════════════════════════════════════════════════

function PhaseBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-10 text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-[#1e1e3a] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 text-right text-gray-400 font-mono">{formatNum(value, 1)}</span>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#6366f1]/30 border-t-[#6366f1] rounded-full animate-spin" />
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20">
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// SCOUT PLAYER CARD
// ════════════════════════════════════════════════════════════════════════════════

function ScoutCard({ p, maxBatImpact, maxBowlImpact, showBowling }: {
  p: ScoutPlayer; maxBatImpact: number; maxBowlImpact: number; showBowling?: boolean
}) {
  const isBowler = showBowling || p.archetype.toLowerCase().includes('bowl') || p.archetype.toLowerCase().includes('pace') || p.archetype.toLowerCase().includes('spin')
  const impactVal = isBowler ? p.bowlImpact : p.batImpact
  const impactMax = isBowler ? maxBowlImpact : maxBatImpact
  return (
    <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-5 hover:border-[#6366f1]/30 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1]/20 to-[#6366f1]/5 border border-[#6366f1]/20 flex items-center justify-center text-xs font-bold text-[#6366f1]">
            {getInitials(p.name)}
          </div>
          <div>
            <Link to={`/scout/${p.id}`} className="text-white font-semibold text-sm leading-tight group-hover:text-[#6366f1] transition block">
              <h3>{p.name}</h3>
            </Link>
            <p className="text-[11px] text-gray-500">{p.positionLabel} &middot; {p.matches} matches</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {p.inIPL && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">IN IPL</span>
          )}
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${impactColor(impactVal, impactMax)}`}>
            {formatNum(impactVal, 0)}
          </span>
        </div>
      </div>

      {/* Archetype + Leagues */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${archetypeBadgeColor(p.archetype)}`}>
          {p.archetype}
        </span>
        {p.leagues.slice(0, 4).map(l => (
          <span key={l} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e1e3a] text-gray-500 font-medium">
            {LEAGUE_CODE_TO_LABEL[l] || l}
          </span>
        ))}
        {p.leagues.length > 4 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e1e3a] text-gray-500">+{p.leagues.length - 4}</span>
        )}
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {!isBowler ? (
          <>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase">Runs</p>
              <p className="text-sm font-bold text-white">{p.runs.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase">SR</p>
              <p className="text-sm font-bold text-white">{formatNum(p.strikeRate)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase">Avg</p>
              <p className="text-sm font-bold text-white">{formatNum(p.battingAvg)}</p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase">Wkts</p>
              <p className="text-sm font-bold text-white">{p.wickets}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase">Econ</p>
              <p className="text-sm font-bold text-white">{formatNum(p.bowlEcon)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-500 uppercase">Dot%</p>
              <p className="text-sm font-bold text-white">{formatNum(p.bowlDotPct)}</p>
            </div>
          </>
        )}
      </div>

      {/* Phase Splits */}
      <div className="space-y-1">
        {!isBowler ? (
          <>
            <PhaseBar label="PP" value={p.ppSR} max={200} color="bg-blue-500" />
            <PhaseBar label="Mid" value={p.midSR} max={200} color="bg-[#6366f1]" />
            <PhaseBar label="Death" value={p.deathSR} max={250} color="bg-emerald-500" />
          </>
        ) : (
          <>
            <PhaseBar label="PP" value={p.ppBowlEcon} max={12} color="bg-blue-500" />
            <PhaseBar label="Mid" value={p.midBowlEcon} max={12} color="bg-[#6366f1]" />
            <PhaseBar label="Death" value={p.deathBowlEcon} max={14} color="bg-emerald-500" />
          </>
        )}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB 1: AUCTION HISTORY
// ════════════════════════════════════════════════════════════════════════════════

function AuctionHistoryTab() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [sortDir, setSortDir] = useState<'desc' | 'asc'>('desc')
  const [searchQuery, setSearchQuery] = useState('')

  const auction = auctionData.find(a => a.year === selectedYear)!

  const filteredPlayers = useMemo(() => {
    let players = [...auction.players]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      players = players.filter(p => p.name.toLowerCase().includes(q))
    }
    players.sort((a, b) => {
      const diff = a.soldPriceNum - b.soldPriceNum
      return sortDir === 'desc' ? -diff : diff
    })
    return players
  }, [auction.players, searchQuery, sortDir])

  const maxSpend = auction.teamSpending.length > 0 ? Math.max(...auction.teamSpending.map(t => t.amount)) : 1

  return (
    <div>
      {/* Year Selector */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {auctionData.map(a => (
          <button key={a.year} onClick={() => { setSelectedYear(a.year); setSearchQuery('') }}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition border ${
              selectedYear === a.year
                ? 'bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/30'
                : 'bg-[#131320] text-gray-400 border-[#1e1e3a] hover:border-[#6366f1]/20 hover:text-white'
            }`}
          >IPL {a.year}</button>
        ))}
      </div>

      {/* Auction Info Banner */}
      <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-6 mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">{auction.label}</h2>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400 text-sm">
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {auction.location}
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            {auction.dates}
          </span>
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Auctioneer: {auction.auctioneer}
          </span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-6 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Total Players Sold</p>
          <p className="text-4xl font-extrabold text-white">{auction.totalSold || '\u2014'}</p>
        </div>
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-6 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Total Spend</p>
          <p className="text-4xl font-extrabold text-emerald-400">{auction.totalSpend}</p>
        </div>
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-6 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Highest Bid</p>
          <p className="text-2xl font-extrabold text-white">{auction.highestBidPlayer}</p>
          <p className="text-lg font-bold text-[#6366f1] mt-1">{auction.highestBid} <span className="text-sm text-gray-500 font-medium">&middot; {auction.highestBidTeam}</span></p>
        </div>
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-6 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Unsold Players</p>
          <p className="text-4xl font-extrabold text-red-400">{auction.unsoldCount || '\u2014'}</p>
        </div>
      </div>

      {/* Team Spending */}
      {auction.teamSpending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Team-wise Spending</h2>
          <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-6">
            <div className="space-y-3">
              {auction.teamSpending.map(t => (
                <div key={t.team} className="flex items-center gap-4">
                  <span className="w-10 sm:w-12 text-xs sm:text-sm font-bold text-gray-300 text-right shrink-0">{t.team}</span>
                  <div className="flex-1 h-7 bg-[#1e1e3a]/50 rounded-lg overflow-hidden">
                    <div className={`h-full ${t.color} rounded-lg transition-all duration-700 flex items-center`}
                      style={{ width: `${(t.amount / maxSpend) * 100}%` }}>
                      <span className="text-xs font-bold text-white ml-3 drop-shadow whitespace-nowrap">{t.label}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Player Table */}
      {auction.players.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
            <h2 className="text-xl font-bold text-white">Auction Results</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Search players..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-[#131320] border border-[#1e1e3a] rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]/30 w-56" />
              </div>
              <button onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}
                className="px-4 py-2 bg-[#131320] border border-[#1e1e3a] rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:border-[#6366f1]/30 transition flex items-center gap-2">
                Price
                <svg className={`w-4 h-4 transition ${sortDir === 'asc' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
          </div>
          <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1e1e3a] text-gray-500 text-xs uppercase tracking-wider">
                    <th className="text-left py-4 px-6 font-semibold">Player</th>
                    <th className="text-center py-4 px-4 font-semibold">Base Price</th>
                    <th className="text-center py-4 px-4 font-semibold cursor-pointer hover:text-[#6366f1] transition"
                      onClick={() => setSortDir(d => d === 'desc' ? 'asc' : 'desc')}>
                      Sold Price {sortDir === 'desc' ? '\u25BC' : '\u25B2'}
                    </th>
                    <th className="text-center py-4 px-4 font-semibold">Team</th>
                    <th className="text-center py-4 px-6 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map(p => (
                    <tr key={p.name}
                      className={`border-b border-[#1e1e3a] hover:bg-white/[0.02] transition ${p.fire ? 'bg-red-500/[0.04]' : ''} ${p.status === 'unsold' ? 'opacity-50' : ''}`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${avatarColorClasses[p.teamColor] || avatarColorClasses.gray} border flex items-center justify-center text-xs font-bold`}>
                            {p.initials}
                          </div>
                          <div>
                            <p className={`font-semibold ${p.status === 'unsold' ? 'text-gray-500' : 'text-white'}`}>{p.name}</p>
                            <p className={`text-xs ${p.status === 'unsold' ? 'text-gray-600' : 'text-gray-500'}`}>{p.country} &middot; {p.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`text-center py-4 px-4 ${p.status === 'unsold' ? 'text-gray-600' : 'text-gray-400'}`}>{'\u20B9'}{p.basePrice}</td>
                      <td className={`text-center py-4 px-4 ${p.status === 'unsold' ? 'text-gray-600' : 'text-white font-bold text-base'}`}>
                        {p.soldPrice ? `\u20B9${p.soldPrice}` : '\u2014'}
                      </td>
                      <td className="text-center py-4 px-4">
                        {p.team ? (
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${teamColorClasses[p.teamColor] || teamColorClasses.gray}`}>
                            {p.team}
                          </span>
                        ) : <span className="text-gray-600">{'\u2014'}</span>}
                      </td>
                      <td className="text-center py-4 px-6">
                        {p.status === 'sold' ? (
                          <span>
                            <span className="text-emerald-400 font-semibold">Sold</span>
                            {p.fire && <span className="ml-1">{'\uD83D\uDD25'}</span>}
                          </span>
                        ) : <span className="text-red-400/60 font-semibold">Unsold</span>}
                      </td>
                    </tr>
                  ))}
                  {filteredPlayers.length === 0 && (
                    <tr><td colSpan={5} className="py-10 text-center text-gray-500">No players match your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Highlights */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Auction Highlights</h2>
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-8">
          <div className="space-y-4">
            {auction.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-[#6366f1]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#6366f1] text-sm">{h.icon}</span>
                </div>
                <div>
                  <p className="text-white font-medium">{h.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{h.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB 2: SCOUTING HUB
// ════════════════════════════════════════════════════════════════════════════════

function ScoutingHubTab() {
  const [league, setLeague] = useState('all')
  const [archetype, setArchetype] = useState('All')
  const [country, setCountry] = useState('All')
  const [sortBy, setSortBy] = useState('batImpact')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  // SMAT is India-only, so the country filter is meaningless there.
  // Force it back to "All" whenever SMAT becomes the active league to avoid
  // stale-filter bugs (e.g., leaving "England" selected from a prior view).
  useEffect(() => {
    if (league === 'smat' && country !== 'All') setCountry('All')
  }, [league, country])

  // Fetch data based on league selection
  const allQuery = useScoutAll()
  const leagueQuery = useScoutLeague(league === 'all' ? '' : league)

  const sourceData: ScoutPlayer[] = league === 'all'
    ? (allQuery.data as ScoutPlayer[] || [])
    : (leagueQuery.data as ScoutPlayer[] || [])
  const isLoading = league === 'all' ? allQuery.isLoading : leagueQuery.isLoading

  const filtered = useMemo(() => {
    let data = [...sourceData]
    if (archetype !== 'All') {
      data = data.filter(p => p.archetype === archetype)
    }
    if (country !== 'All') {
      data = data.filter(p => (p.country || 'Other') === country)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(p => p.name.toLowerCase().includes(q))
    }
    // Sort
    const key = sortBy as keyof ScoutPlayer
    const isEcon = sortBy === 'bowlEcon'
    data.sort((a, b) => {
      const av = (a[key] as number) || 0
      const bv = (b[key] as number) || 0
      return isEcon ? av - bv : bv - av
    })
    return data
  }, [sourceData, archetype, country, search, sortBy])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
  const maxBat = useMemo(() => Math.max(1, ...sourceData.map(p => p.batImpact || 0)), [sourceData])
  const maxBowl = useMemo(() => Math.max(1, ...sourceData.map(p => p.bowlImpact || 0)), [sourceData])

  // Reset page on filter change
  const handleFilterChange = useCallback((setter: (v: any) => void, val: any) => {
    setter(val)
    setPage(1)
  }, [])

  return (
    <div>
      {/* Filters Row */}
      <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          {/* League */}
          <select value={league} onChange={e => handleFilterChange(setLeague, e.target.value)}
            className="bg-[#0a0a0f] border border-[#1e1e3a] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6366f1]/40 w-full sm:w-auto">
            {LEAGUE_OPTIONS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>

          {/* Archetype */}
          <select value={archetype} onChange={e => handleFilterChange(setArchetype, e.target.value)}
            className="bg-[#0a0a0f] border border-[#1e1e3a] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6366f1]/40 w-full sm:w-auto">
            {ARCHETYPES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          {/* Country — hidden for SMAT since it's an India-only league */}
          {league !== 'smat' && (
            <select value={country} onChange={e => handleFilterChange(setCountry, e.target.value)}
              className="bg-[#0a0a0f] border border-[#1e1e3a] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6366f1]/40 w-full sm:w-auto">
              {COUNTRY_OPTIONS.map(c => <option key={c} value={c}>{c === 'All' ? 'All Countries' : c}</option>)}
            </select>
          )}

          {/* Sort */}
          <select value={sortBy} onChange={e => handleFilterChange(setSortBy, e.target.value)}
            className="bg-[#0a0a0f] border border-[#1e1e3a] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#6366f1]/40 w-full sm:w-auto">
            {SORT_OPTIONS.map(s => <option key={s.key} value={s.key}>Sort: {s.label}</option>)}
          </select>

          {/* Search */}
          <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
            <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search player name..." value={search}
              onChange={e => handleFilterChange(setSearch, e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#1e1e3a] rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]/40" />
          </div>

          {/* Count */}
          <span className="text-sm text-gray-500 font-medium ml-auto">{filtered.length} players</span>
        </div>
      </div>

      {isLoading ? <LoadingSpinner /> : paged.length === 0 ? <EmptyState message="No players match your filters." /> : (
        <>
          {/* Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            {paged.map(p => (
              <ScoutCard key={p.id} p={p} maxBatImpact={maxBat} maxBowlImpact={maxBowl}
                showBowling={sortBy === 'bowlImpact' || sortBy === 'wickets' || sortBy === 'bowlEcon'} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-[#131320] border border-[#1e1e3a] text-gray-400 hover:text-white hover:border-[#6366f1]/30 disabled:opacity-30 disabled:cursor-not-allowed transition">
                Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 7) { pageNum = i + 1 }
                else if (page <= 4) { pageNum = i + 1 }
                else if (page >= totalPages - 3) { pageNum = totalPages - 6 + i }
                else { pageNum = page - 3 + i }
                return (
                  <button key={pageNum} onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                      page === pageNum
                        ? 'bg-[#6366f1]/20 text-[#6366f1] border border-[#6366f1]/30'
                        : 'bg-[#131320] border border-[#1e1e3a] text-gray-400 hover:text-white hover:border-[#6366f1]/30'
                    }`}>
                    {pageNum}
                  </button>
                )
              })}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-[#131320] border border-[#1e1e3a] text-gray-400 hover:text-white hover:border-[#6366f1]/30 disabled:opacity-30 disabled:cursor-not-allowed transition">
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB 3: TOP TARGETS
// ════════════════════════════════════════════════════════════════════════════════

function TopTargetsTab() {
  const [view, setView] = useState('batsmen')
  const { data: targets, isLoading } = useScoutTargets()

  const computed = useMemo(() => {
    if (!targets) return { batsmen: [], bowlers: [], allrounders: [], value: [], rising: [] }
    const t = targets as ScoutPlayer[]

    const batsmen = [...t]
      .filter(p => p.innings >= 10)
      .sort((a, b) => b.batImpact - a.batImpact)
      .slice(0, 20)

    const bowlers = [...t]
      .filter(p => p.bowlInnings >= 10)
      .sort((a, b) => b.bowlImpact - a.bowlImpact)
      .slice(0, 20)

    const allrounders = [...t]
      .filter(p => p.innings >= 10 && p.bowlInnings >= 10)
      .sort((a, b) => b.allRounderIndex - a.allRounderIndex)
      .slice(0, 20)

    const value = [...t]
      .filter(p => !p.inIPL && (p.batImpact > 1000 || p.bowlImpact > 1000))
      .sort((a, b) => (b.batImpact + b.bowlImpact) - (a.batImpact + a.bowlImpact))
      .slice(0, 20)

    const rising = [...t]
      .filter(p => p.matches > 0 && p.matches < 30)
      .sort((a, b) => {
        const aImpactPM = (a.batImpact + a.bowlImpact) / (a.matches || 1)
        const bImpactPM = (b.batImpact + b.bowlImpact) / (b.matches || 1)
        return bImpactPM - aImpactPM
      })
      .slice(0, 20)

    return { batsmen, bowlers, allrounders, value, rising }
  }, [targets])

  const currentList = computed[view as keyof typeof computed] || []
  const maxBat = useMemo(() => Math.max(1, ...currentList.map(p => p.batImpact || 0)), [currentList])
  const maxBowl = useMemo(() => Math.max(1, ...currentList.map(p => p.bowlImpact || 0)), [currentList])

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {/* View Selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TARGET_VIEWS.map(v => (
          <button key={v.key} onClick={() => setView(v.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition border ${
              view === v.key
                ? 'bg-[#6366f1]/10 text-[#6366f1] border-[#6366f1]/30'
                : 'bg-[#131320] text-gray-400 border-[#1e1e3a] hover:border-[#6366f1]/20 hover:text-white'
            }`}>
            {v.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {currentList.length === 0 ? <EmptyState message="No players found for this category." /> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentList.map((p, idx) => (
            <div key={p.id} className="relative">
              {/* Rank Badge */}
              <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-[#6366f1] flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-[#6366f1]/20">
                {idx + 1}
              </div>
              <ScoutCard p={p} maxBatImpact={maxBat} maxBowlImpact={maxBowl}
                showBowling={view === 'bowlers'} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB 4: IPL CROSSOVER
// ════════════════════════════════════════════════════════════════════════════════

function IPLCrossoverTab() {
  const { data: crossover, isLoading } = useIPLCrossover()
  const [search, setSearch] = useState('')
  const [league, setLeague] = useState('all')
  const [country, setCountry] = useState('All')
  const [sortKey, setSortKey] = useState<'name' | 'strikeRate' | 'battingAvg' | 'bowlEcon' | 'wickets'>('strikeRate')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  // SMAT is India-only, so country filter is meaningless there — snap to 'All'.
  useEffect(() => {
    if (league === 'smat' && country !== 'All') setCountry('All')
  }, [league, country])

  const filtered = useMemo(() => {
    if (!crossover) return []
    let data = crossover as ScoutPlayer[]
    if (league !== 'all') {
      const code = league.toUpperCase()
      data = data.filter(p => p.leagues.some(l => l.toUpperCase() === code))
    }
    if (country !== 'All') {
      data = data.filter(p => (p.country || 'Other') === country)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(p => p.name.toLowerCase().includes(q))
    }
    data = [...data].sort((a, b) => {
      let av: any, bv: any
      if (sortKey === 'name') { av = a.name; bv = b.name; return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av) }
      av = (a[sortKey] as number) || 0; bv = (b[sortKey] as number) || 0
      return sortDir === 'desc' ? bv - av : av - bv
    })
    return data
  }, [crossover, league, country, search, sortKey, sortDir])

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const sortIcon = (key: typeof sortKey) => sortKey === key ? (sortDir === 'desc' ? ' \u25BC' : ' \u25B2') : ''

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      {/* Summary */}
      <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-bold text-white">IPL Crossover Players</h3>
            <p className="text-sm text-gray-500 mt-1">Players who compete in both IPL and other franchise leagues worldwide. External league stats shown below.</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-500 font-medium">{filtered.length} players</span>

            {/* External League */}
            <select value={league} onChange={e => setLeague(e.target.value)}
              className="bg-[#0a0a0f] border border-[#1e1e3a] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6366f1]/40">
              {LEAGUE_OPTIONS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>

            {/* Country — hidden for SMAT (India-only) */}
            {league !== 'smat' && (
              <select value={country} onChange={e => setCountry(e.target.value)}
                className="bg-[#0a0a0f] border border-[#1e1e3a] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#6366f1]/40">
                {COUNTRY_OPTIONS.map(c => <option key={c} value={c}>{c === 'All' ? 'All Countries' : c}</option>)}
              </select>
            )}

            <div className="relative">
              <svg className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
                className="bg-[#0a0a0f] border border-[#1e1e3a] rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#6366f1]/40 w-56" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e3a] text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left py-4 px-5 font-semibold cursor-pointer hover:text-[#6366f1]" onClick={() => handleSort('name')}>Player{sortIcon('name')}</th>
                <th className="text-center py-4 px-3 font-semibold">Archetype</th>
                <th className="text-center py-4 px-3 font-semibold">External Leagues</th>
                <th className="text-center py-4 px-3 font-semibold">Matches</th>
                <th className="text-center py-4 px-3 font-semibold cursor-pointer hover:text-[#6366f1]" onClick={() => handleSort('strikeRate')}>SR{sortIcon('strikeRate')}</th>
                <th className="text-center py-4 px-3 font-semibold cursor-pointer hover:text-[#6366f1]" onClick={() => handleSort('battingAvg')}>Avg{sortIcon('battingAvg')}</th>
                <th className="text-center py-4 px-3 font-semibold cursor-pointer hover:text-[#6366f1]" onClick={() => handleSort('wickets')}>Wkts{sortIcon('wickets')}</th>
                <th className="text-center py-4 px-3 font-semibold cursor-pointer hover:text-[#6366f1]" onClick={() => handleSort('bowlEcon')}>Econ{sortIcon('bowlEcon')}</th>
                <th className="text-center py-4 px-3 font-semibold">Boundary%</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 50).map(p => (
                <tr key={p.id} className="border-b border-[#1e1e3a] hover:bg-white/[0.02] transition">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6366f1]/20 to-[#6366f1]/5 border border-[#6366f1]/20 flex items-center justify-center text-[10px] font-bold text-[#6366f1]">
                        {getInitials(p.name)}
                      </div>
                      <div>
                        <p className="font-semibold text-white text-sm">{p.name}</p>
                        <p className="text-[11px] text-gray-500">{p.positionLabel}</p>
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-3 px-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${archetypeBadgeColor(p.archetype)}`}>
                      {p.archetype}
                    </span>
                  </td>
                  <td className="text-center py-3 px-3">
                    <div className="flex flex-wrap justify-center gap-1">
                      {p.leagues.slice(0, 5).map(l => (
                        <span key={l} className="text-[10px] px-1.5 py-0.5 rounded bg-[#1e1e3a] text-gray-400 font-medium">{LEAGUE_CODE_TO_LABEL[l] || l}</span>
                      ))}
                      {p.leagues.length > 5 && <span className="text-[10px] text-gray-500">+{p.leagues.length - 5}</span>}
                    </div>
                  </td>
                  <td className="text-center py-3 px-3 text-gray-300 font-medium">{p.matches}</td>
                  <td className="text-center py-3 px-3">
                    <span className={`font-bold ${p.strikeRate >= 140 ? 'text-emerald-400' : p.strikeRate >= 120 ? 'text-white' : 'text-gray-400'}`}>
                      {formatNum(p.strikeRate)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-3">
                    <span className={`font-bold ${p.battingAvg >= 35 ? 'text-emerald-400' : p.battingAvg >= 25 ? 'text-white' : 'text-gray-400'}`}>
                      {formatNum(p.battingAvg)}
                    </span>
                  </td>
                  <td className="text-center py-3 px-3 text-gray-300 font-medium">{p.wickets}</td>
                  <td className="text-center py-3 px-3">
                    {p.bowlInnings > 0 ? (
                      <span className={`font-bold ${p.bowlEcon <= 7 ? 'text-emerald-400' : p.bowlEcon <= 8.5 ? 'text-white' : 'text-red-400'}`}>
                        {formatNum(p.bowlEcon)}
                      </span>
                    ) : <span className="text-gray-600">-</span>}
                  </td>
                  <td className="text-center py-3 px-3 text-gray-300">{formatNum(p.boundaryPct)}%</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="py-10 text-center text-gray-500">No crossover players found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {filtered.length > 50 && (
          <div className="text-center py-3 text-sm text-gray-500 border-t border-[#1e1e3a]">
            Showing top 50 of {filtered.length} players. Use search to narrow results.
          </div>
        )}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// TAB 5: LEAGUE COMPARISON
// ════════════════════════════════════════════════════════════════════════════════

function LeagueComparisonTab() {
  const { data: allPlayers, isLoading } = useScoutAll()

  const leagueStats = useMemo(() => {
    if (!allPlayers) return []
    const players = allPlayers as ScoutPlayer[]
    const leagueCodes = ['BBL', 'PSL', 'CPL', 'SA20', 'HND', 'BPL', 'LPL', 'ILT20', 'MLC', 'NTB', 'SMAT']

    return leagueCodes.map(code => {
      const lp = players.filter(p => p.leagues.includes(code))
      if (lp.length === 0) return null

      const batters = lp.filter(p => p.innings >= 5)
      const bowlers = lp.filter(p => p.bowlInnings >= 5)

      const avgSR = batters.length > 0
        ? batters.reduce((s, p) => s + p.strikeRate, 0) / batters.length : 0
      const avgBatAvg = batters.length > 0
        ? batters.reduce((s, p) => s + p.battingAvg, 0) / batters.length : 0
      const avgBoundaryPct = batters.length > 0
        ? batters.reduce((s, p) => s + p.boundaryPct, 0) / batters.length : 0
      const avgEcon = bowlers.length > 0
        ? bowlers.reduce((s, p) => s + p.bowlEcon, 0) / bowlers.length : 0
      const avgDotPct = bowlers.length > 0
        ? bowlers.reduce((s, p) => s + p.bowlDotPct, 0) / bowlers.length : 0

      // Quality score: weighted combo
      const quality = (avgSR / 150) * 25 + (avgBatAvg / 35) * 25 + (1 - (avgEcon / 10)) * 25 + (avgDotPct / 50) * 25

      return {
        code, label: LEAGUE_CODE_TO_LABEL[code] || code,
        players: lp.length, batters: batters.length, bowlers: bowlers.length,
        avgSR, avgBatAvg, avgBoundaryPct, avgEcon, avgDotPct, quality
      }
    }).filter(Boolean) as {
      code: string; label: string; players: number; batters: number; bowlers: number
      avgSR: number; avgBatAvg: number; avgBoundaryPct: number; avgEcon: number; avgDotPct: number; quality: number
    }[]
  }, [allPlayers])

  if (isLoading) return <LoadingSpinner />

  const maxSR = Math.max(1, ...leagueStats.map(l => l.avgSR))
  const maxEcon = Math.max(1, ...leagueStats.map(l => l.avgEcon))
  const maxBP = Math.max(1, ...leagueStats.map(l => l.avgBoundaryPct))
  const maxQ = Math.max(1, ...leagueStats.map(l => l.quality))

  const leagueColors: Record<string, string> = {
    BBL: 'bg-green-500', PSL: 'bg-emerald-500', CPL: 'bg-amber-500', SA20: 'bg-pink-500',
    HND: 'bg-purple-500', BPL: 'bg-lime-500', LPL: 'bg-blue-500', ILT20: 'bg-cyan-500',
    MLC: 'bg-orange-500', NTB: 'bg-red-500', SMAT: 'bg-teal-500',
  }

  return (
    <div>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-5 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Leagues Tracked</p>
          <p className="text-3xl font-extrabold text-white">{leagueStats.length}</p>
        </div>
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-5 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Highest Avg SR</p>
          {leagueStats.length > 0 && (() => {
            const best = [...leagueStats].sort((a, b) => b.avgSR - a.avgSR)[0]
            return <p className="text-2xl font-extrabold text-emerald-400">{best.label} <span className="text-lg text-gray-400">({formatNum(best.avgSR)})</span></p>
          })()}
        </div>
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-5 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Best Economy</p>
          {leagueStats.length > 0 && (() => {
            const best = [...leagueStats].sort((a, b) => a.avgEcon - b.avgEcon)[0]
            return <p className="text-2xl font-extrabold text-blue-400">{best.label} <span className="text-lg text-gray-400">({formatNum(best.avgEcon)})</span></p>
          })()}
        </div>
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-5 text-center">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Highest Quality</p>
          {leagueStats.length > 0 && (() => {
            const best = [...leagueStats].sort((a, b) => b.quality - a.quality)[0]
            return <p className="text-2xl font-extrabold text-[#6366f1]">{best.label} <span className="text-lg text-gray-400">({formatNum(best.quality)})</span></p>
          })()}
        </div>
      </div>

      {/* Bar Chart: Avg Strike Rate */}
      <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Average Strike Rate by League</h3>
        <div className="space-y-3">
          {[...leagueStats].sort((a, b) => b.avgSR - a.avgSR).map(l => (
            <div key={l.code} className="flex items-center gap-3">
              <span className="w-14 sm:w-20 text-xs sm:text-sm font-bold text-gray-300 text-right shrink-0">{l.label}</span>
              <div className="flex-1 h-6 bg-[#1e1e3a]/50 rounded-lg overflow-hidden">
                <div className={`h-full ${leagueColors[l.code] || 'bg-gray-500'} rounded-lg transition-all duration-500 flex items-center`}
                  style={{ width: `${(l.avgSR / maxSR) * 100}%` }}>
                  <span className="text-[11px] font-bold text-white ml-2 drop-shadow whitespace-nowrap">{formatNum(l.avgSR)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart: Avg Economy */}
      <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Average Economy Rate by League</h3>
        <div className="space-y-3">
          {[...leagueStats].sort((a, b) => a.avgEcon - b.avgEcon).map(l => (
            <div key={l.code} className="flex items-center gap-3">
              <span className="w-14 sm:w-20 text-xs sm:text-sm font-bold text-gray-300 text-right shrink-0">{l.label}</span>
              <div className="flex-1 h-6 bg-[#1e1e3a]/50 rounded-lg overflow-hidden">
                <div className={`h-full ${leagueColors[l.code] || 'bg-gray-500'} rounded-lg transition-all duration-500 flex items-center`}
                  style={{ width: `${(l.avgEcon / maxEcon) * 100}%` }}>
                  <span className="text-[11px] font-bold text-white ml-2 drop-shadow whitespace-nowrap">{formatNum(l.avgEcon)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bar Chart: Boundary % */}
      <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-white mb-4">Average Boundary % by League</h3>
        <div className="space-y-3">
          {[...leagueStats].sort((a, b) => b.avgBoundaryPct - a.avgBoundaryPct).map(l => (
            <div key={l.code} className="flex items-center gap-3">
              <span className="w-14 sm:w-20 text-xs sm:text-sm font-bold text-gray-300 text-right shrink-0">{l.label}</span>
              <div className="flex-1 h-6 bg-[#1e1e3a]/50 rounded-lg overflow-hidden">
                <div className={`h-full ${leagueColors[l.code] || 'bg-gray-500'} rounded-lg transition-all duration-500 flex items-center`}
                  style={{ width: `${(l.avgBoundaryPct / maxBP) * 100}%` }}>
                  <span className="text-[11px] font-bold text-white ml-2 drop-shadow whitespace-nowrap">{formatNum(l.avgBoundaryPct)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Rating Table */}
      <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">League Quality Rating</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1e1e3a] text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left py-3 px-4 font-semibold">Rank</th>
                <th className="text-left py-3 px-4 font-semibold">League</th>
                <th className="text-center py-3 px-4 font-semibold">Players</th>
                <th className="text-center py-3 px-4 font-semibold">Avg SR</th>
                <th className="text-center py-3 px-4 font-semibold">Avg Economy</th>
                <th className="text-center py-3 px-4 font-semibold">Avg Boundary%</th>
                <th className="text-center py-3 px-4 font-semibold">Quality</th>
              </tr>
            </thead>
            <tbody>
              {[...leagueStats].sort((a, b) => b.quality - a.quality).map((l, i) => (
                <tr key={l.code} className="border-b border-[#1e1e3a] hover:bg-white/[0.02] transition">
                  <td className="py-3 px-4">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                      i === 1 ? 'bg-gray-400/20 text-gray-300' :
                      i === 2 ? 'bg-amber-700/20 text-amber-500' : 'bg-[#1e1e3a] text-gray-500'
                    }`}>{i + 1}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${leagueColors[l.code] || 'bg-gray-500'}`} />
                      <span className="font-semibold text-white">{l.label}</span>
                    </div>
                  </td>
                  <td className="text-center py-3 px-4 text-gray-300">{l.players}</td>
                  <td className="text-center py-3 px-4 text-gray-300">{formatNum(l.avgSR)}</td>
                  <td className="text-center py-3 px-4 text-gray-300">{formatNum(l.avgEcon)}</td>
                  <td className="text-center py-3 px-4 text-gray-300">{formatNum(l.avgBoundaryPct)}%</td>
                  <td className="text-center py-3 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-[#1e1e3a] rounded-full overflow-hidden">
                        <div className="h-full bg-[#6366f1] rounded-full" style={{ width: `${(l.quality / maxQ) * 100}%` }} />
                      </div>
                      <span className="font-bold text-[#6366f1] text-xs">{formatNum(l.quality)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════════════

export default function Auctions() {
  const [activeTab, setActiveTab] = useState<MainTab>('history')

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      {/* ── Header ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366f1]/10 via-transparent to-emerald-900/10" />
        <div className="absolute top-0 right-0 w-[400px] h-[300px] bg-[#6366f1]/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-6">
          <Breadcrumb items={[{ label: 'Auction War Room' }]} />
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
            Auction War Room
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Complete scouting analytics across global T20 leagues. Auction history, player databases, top targets, and league intelligence.
          </p>
        </div>
      </section>

      {/* ── Tab Navigation ── */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <div className="flex gap-1 bg-[#131320] border border-[#1e1e3a] rounded-2xl p-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {MAIN_TABS.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-[#6366f1]/15 text-[#6366f1] shadow-lg shadow-[#6366f1]/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
              }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
              </svg>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {activeTab === 'history' && <AuctionHistoryTab />}
        {activeTab === 'scouting' && <ScoutingHubTab />}
        {activeTab === 'targets' && <TopTargetsTab />}
        {activeTab === 'crossover' && <IPLCrossoverTab />}
        {activeTab === 'leagues' && <LeagueComparisonTab />}
      </div>
    </div>
  )
}
