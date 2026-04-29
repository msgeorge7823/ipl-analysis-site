/**
 * Team Analysis Service — SWOT Analysis
 *
 * Computes team-level SWOT from player-stats, player-teams,
 * and per-season scorecard data.
 */

import { dataService } from '@/services/dataService'
import type { BattingEntry, BowlingEntry } from '@/types'

// ── Result Types ──

export interface PlayerContribution {
  playerId: string
  playerName: string
  runs: number
  wickets: number
  matches: number
  battingAvg: number
  strikeRate: number
  economy: number
  runShare: number   // percentage of team total
  wicketShare: number
}

export interface SquadComposition {
  batters: number
  bowlers: number
  allrounders: number
  wicketkeepers: number
  total: number
}

export interface PhaseTeamStats {
  phase: string
  battingRuns: number
  battingBalls: number
  battingSR: number
  bowlingRuns: number
  bowlingBalls: number
  bowlingEcon: number
  bowlingWickets: number
}

export interface SwotItem {
  text: string
  detail?: string
}

export interface SwotAnalysis {
  teamName: string
  season: string
  squadSize: number
  strengths: SwotItem[]
  weaknesses: SwotItem[]
  opportunities: SwotItem[]
  threats: SwotItem[]
  squadComposition: SquadComposition
  topContributors: PlayerContribution[]
  phaseStats: PhaseTeamStats[]
  teamTotalRuns: number
  teamTotalWickets: number
  teamAvgSR: number
  teamAvgEconomy: number
  boundaryPercentage: number
}

// ── Phase helper ──

type Phase = 'Powerplay' | 'Middle' | 'Death'

function getPhaseLabel(over: number): Phase {
  if (over <= 5) return 'Powerplay'
  if (over <= 15) return 'Middle'
  return 'Death'
}

// ── Main function ──

// Build a SWOT (strengths/weaknesses/opportunities/threats) report for one
// team in one season. Walks the team's roster, aggregates per-player /
// phase / dismissal stats, then turns the numeric profile into qualitative
// callouts. teamAliases lets historical names (e.g. "Delhi Daredevils") be
// merged with the current franchise's record.
export async function getSwotAnalysis(
  teamName: string,
  season: string,
  playerTeams: Record<string, { team: string; season: string }[]>,
  playerStatsAll: any[],
  teamAliases: string[] = []
): Promise<SwotAnalysis> {
  // 1. Identify squad — players who played for this team in this season
  const squadPlayerIds = new Set<string>()
  for (const [pid, entries] of Object.entries(playerTeams)) {
    for (const e of entries) {
      if (
        (e.team === teamName || teamAliases.includes(e.team)) &&
        e.season === season
      ) {
        squadPlayerIds.add(pid)
      }
    }
  }

  // Build a stats lookup from player-stats.json
  const statsMap = new Map<string, any>()
  for (const s of playerStatsAll) {
    if (squadPlayerIds.has(s.playerId)) {
      statsMap.set(s.playerId, s)
    }
  }

  // 2. Load per-season batting & bowling scorecards for match-level data
  let seasonBatting: BattingEntry[] = []
  let seasonBowling: BowlingEntry[] = []
  try {
    seasonBatting = await dataService.getBatting(season) as BattingEntry[]
  } catch { /* season data may not exist */ }
  try {
    seasonBowling = await dataService.getBowling(season) as BowlingEntry[]
  } catch { /* season data may not exist */ }

  // Load matches to determine which team batted/bowled
  let seasonMatches: any[] = []
  try {
    seasonMatches = await dataService.getMatches(season)
  } catch { /* ignore */ }

  const matchMap = new Map<string, any>()
  for (const m of seasonMatches) matchMap.set(m.id, m)

  // Player ID to name map from playerStats
  const idToName = new Map<string, string>()
  for (const s of playerStatsAll) {
    idToName.set(s.playerId, s.playerName)
  }

  // Build batterId -> playerId lookup from batting entries
  const batterIdToPid = new Map<string, string>()
  for (const b of seasonBatting) {
    if (b.batterId && squadPlayerIds.has(b.batterId)) {
      batterIdToPid.set(b.batterId, b.batterId)
    }
  }
  // Build bowlerId -> playerId lookup
  const bowlerIdToPid = new Map<string, string>()
  for (const b of seasonBowling) {
    if ((b as any).bowlerId && squadPlayerIds.has((b as any).bowlerId)) {
      bowlerIdToPid.set((b as any).bowlerId, (b as any).bowlerId)
    }
  }

  // Determine which matchIds this team played in (from batting/bowling entries)
  // Use matches data to figure out which team batted in which innings
  const teamMatchIds = new Set<string>()
  for (const m of seasonMatches) {
    const teams = m.teams as string[]
    if (
      teams.includes(teamName) ||
      teams.some((t: string) => teamAliases.includes(t))
    ) {
      teamMatchIds.add(m.id)
    }
  }

  // Helper: is this a batting entry for our team?
  function isTeamBatting(entry: BattingEntry): boolean {
    if (!teamMatchIds.has(entry.matchId)) return false
    const match = matchMap.get(entry.matchId)
    if (!match || !match.innings) return false
    const inningsData = match.innings[entry.innings - 1]
    if (!inningsData) return false
    return (
      inningsData.team === teamName ||
      teamAliases.includes(inningsData.team)
    )
  }

  // Helper: is this a bowling entry for our team (our team was bowling)?
  function isTeamBowling(entry: BowlingEntry): boolean {
    if (!teamMatchIds.has(entry.matchId)) return false
    const match = matchMap.get(entry.matchId)
    if (!match || !match.innings) return false
    // If innings 1, bowling team is the team that bats in innings 2 (or vice versa)
    const battingTeam = match.innings[entry.innings - 1]?.team
    // Our team is bowling if the batting team is NOT our team
    return (
      battingTeam !== teamName &&
      !teamAliases.includes(battingTeam || '')
    )
  }

  // 3. Aggregate team batting from season scorecards
  const playerSeasonBatting = new Map<string, {
    runs: number; balls: number; fours: number; sixes: number;
    innings: number; dismissals: number; highScore: number
  }>()

  let teamBatRuns = 0, teamBatBalls = 0, teamBatFours = 0, teamBatSixes = 0

  for (const entry of seasonBatting) {
    if (!isTeamBatting(entry)) continue
    teamBatRuns += entry.runs
    teamBatBalls += entry.balls
    teamBatFours += entry.fours
    teamBatSixes += entry.sixes

    const key = entry.batterId || entry.batter
    const existing = playerSeasonBatting.get(key) || {
      runs: 0, balls: 0, fours: 0, sixes: 0, innings: 0, dismissals: 0, highScore: 0
    }
    existing.runs += entry.runs
    existing.balls += entry.balls
    existing.fours += entry.fours
    existing.sixes += entry.sixes
    existing.innings += 1
    if (entry.dismissal && entry.dismissal !== 'not out') existing.dismissals += 1
    if (entry.runs > existing.highScore) existing.highScore = entry.runs
    playerSeasonBatting.set(key, existing)
  }

  // 4. Aggregate team bowling from season scorecards
  const playerSeasonBowling = new Map<string, {
    overs: number; runs: number; wickets: number; innings: number; dots: number
  }>()

  let teamBowlRuns = 0, teamBowlBalls = 0, teamBowlWickets = 0

  for (const entry of seasonBowling) {
    if (!isTeamBowling(entry)) continue
    const fullOvers = Math.floor(entry.overs)
    const partBalls = Math.round((entry.overs - fullOvers) * 10)
    const balls = fullOvers * 6 + partBalls
    teamBowlRuns += entry.runs
    teamBowlBalls += balls
    teamBowlWickets += entry.wickets

    const key = (entry as any).bowlerId || entry.bowler
    const existing = playerSeasonBowling.get(key) || {
      overs: 0, runs: 0, wickets: 0, innings: 0, dots: 0
    }
    existing.overs += entry.overs
    existing.runs += entry.runs
    existing.wickets += entry.wickets
    existing.innings += 1
    existing.dots += entry.dots || 0
    playerSeasonBowling.set(key, existing)
  }

  // 5. Phase-wise team performance from BBB data (try to load)
  const phases: Record<Phase, {
    batRuns: number; batBalls: number;
    bowlRuns: number; bowlBalls: number; bowlWickets: number
  }> = {
    Powerplay: { batRuns: 0, batBalls: 0, bowlRuns: 0, bowlBalls: 0, bowlWickets: 0 },
    Middle: { batRuns: 0, batBalls: 0, bowlRuns: 0, bowlBalls: 0, bowlWickets: 0 },
    Death: { batRuns: 0, batBalls: 0, bowlRuns: 0, bowlBalls: 0, bowlWickets: 0 },
  }

  try {
    const bbb = await dataService.getBBB(season) as any[]
    for (const ball of bbb) {
      if (!teamMatchIds.has(ball.m)) continue
      const match = matchMap.get(ball.m)
      if (!match) continue

      const phase = getPhaseLabel(ball.o)
      const inningsTeam = match.innings?.[ball.i - 1]?.team
      const isOurBatting =
        inningsTeam === teamName || teamAliases.includes(inningsTeam || '')

      if (isOurBatting) {
        phases[phase].batRuns += ball.tr
        // Count legal deliveries
        if (!ball.ex?.wides && !ball.ex?.noballs) {
          phases[phase].batBalls += 1
        }
      } else {
        // We are bowling
        const byeRuns = (ball.ex?.byes ?? 0) + (ball.ex?.legbyes ?? 0)
        phases[phase].bowlRuns += ball.tr - byeRuns
        if (!ball.ex?.wides && !ball.ex?.noballs) {
          phases[phase].bowlBalls += 1
        }
        if (ball.w) {
          for (const w of ball.w) {
            if (w.k !== 'run out') phases[phase].bowlWickets += 1
          }
        }
      }
    }
  } catch {
    // BBB data may not be available; use scorecard-only aggregates
  }

  const phaseStats: PhaseTeamStats[] = (['Powerplay', 'Middle', 'Death'] as Phase[]).map(phase => {
    const p = phases[phase]
    return {
      phase,
      battingRuns: p.batRuns,
      battingBalls: p.batBalls,
      battingSR: p.batBalls > 0 ? Math.round((p.batRuns / p.batBalls) * 10000) / 100 : 0,
      bowlingRuns: p.bowlRuns,
      bowlingBalls: p.bowlBalls,
      bowlingEcon: p.bowlBalls > 0 ? Math.round((p.bowlRuns / (p.bowlBalls / 6)) * 100) / 100 : 0,
      bowlingWickets: p.bowlWickets,
    }
  })

  // 6. Build top contributors
  const contributors: PlayerContribution[] = []
  for (const pid of squadPlayerIds) {
    const stats = statsMap.get(pid)
    if (!stats) continue
    // Try to get season-specific data
    const batSeason = playerSeasonBatting.get(pid)
    const bowlSeason = playerSeasonBowling.get(pid)
    const runs = batSeason?.runs ?? 0
    const wickets = bowlSeason?.wickets ?? 0
    const balls = batSeason?.balls ?? 0
    const bowlRuns = bowlSeason?.runs ?? 0
    const bowlOvers = bowlSeason?.overs ?? 0
    const innings = batSeason?.innings ?? 0
    const dismissals = batSeason?.dismissals ?? 0

    if (runs === 0 && wickets === 0) continue

    contributors.push({
      playerId: pid,
      playerName: stats.playerName,
      runs,
      wickets,
      matches: innings, // approximate from batting innings
      battingAvg: dismissals > 0 ? Math.round((runs / dismissals) * 100) / 100 : runs,
      strikeRate: balls > 0 ? Math.round((runs / balls) * 10000) / 100 : 0,
      economy: bowlOvers > 0 ? Math.round((bowlRuns / bowlOvers) * 100) / 100 : 0,
      runShare: teamBatRuns > 0 ? Math.round((runs / teamBatRuns) * 10000) / 100 : 0,
      wicketShare: teamBowlWickets > 0 ? Math.round((wickets / teamBowlWickets) * 10000) / 100 : 0,
    })
  }

  contributors.sort((a, b) => b.runs - a.runs)

  // 7. Squad composition — infer roles from stats
  const composition: SquadComposition = {
    batters: 0,
    bowlers: 0,
    allrounders: 0,
    wicketkeepers: 0,
    total: squadPlayerIds.size,
  }

  for (const pid of squadPlayerIds) {
    const stats = statsMap.get(pid)
    if (!stats) {
      composition.batters += 1 // default
      continue
    }
    const hasBatting = stats.runs > 50 || stats.inningsBat > 5
    const hasBowling = stats.wickets > 5 || stats.inningsBowl > 5
    const isKeeper = stats.stumpings > 0

    if (isKeeper) {
      composition.wicketkeepers += 1
    } else if (hasBatting && hasBowling) {
      composition.allrounders += 1
    } else if (hasBowling) {
      composition.bowlers += 1
    } else {
      composition.batters += 1
    }
  }

  // 8. Compute aggregate metrics
  const teamAvgSR = teamBatBalls > 0 ? Math.round((teamBatRuns / teamBatBalls) * 10000) / 100 : 0
  const teamBowlOvers = teamBowlBalls / 6
  const teamAvgEconomy = teamBowlOvers > 0 ? Math.round((teamBowlRuns / teamBowlOvers) * 100) / 100 : 0
  const totalBoundaryRuns = (teamBatFours * 4) + (teamBatSixes * 6)
  const boundaryPercentage = teamBatRuns > 0 ? Math.round((totalBoundaryRuns / teamBatRuns) * 10000) / 100 : 0

  // 9. Generate SWOT
  const strengths: SwotItem[] = []
  const weaknesses: SwotItem[] = []
  const opportunities: SwotItem[] = []
  const threats: SwotItem[] = []

  // --- Strengths ---
  if (teamAvgSR > 140) {
    strengths.push({ text: `Strong batting strike rate (${teamAvgSR})`, detail: 'Team scores aggressively across phases' })
  }
  if (teamAvgSR > 130 && teamAvgSR <= 140) {
    strengths.push({ text: `Solid batting strike rate (${teamAvgSR})`, detail: 'Above-average scoring pace' })
  }
  if (boundaryPercentage > 55) {
    strengths.push({ text: `High boundary percentage (${boundaryPercentage}%)`, detail: 'Team finds the fence frequently' })
  }
  if (teamAvgEconomy > 0 && teamAvgEconomy < 7.5) {
    strengths.push({ text: `Tight bowling economy (${teamAvgEconomy})`, detail: 'Restricts opposition runs effectively' })
  }

  // Phase-wise strengths
  const ppBat = phaseStats.find(p => p.phase === 'Powerplay')
  const midBat = phaseStats.find(p => p.phase === 'Middle')
  const deathBat = phaseStats.find(p => p.phase === 'Death')
  if (ppBat && ppBat.battingSR > 140) {
    strengths.push({ text: `Explosive powerplay batting (SR ${ppBat.battingSR})`, detail: 'Fast starts set the tone' })
  }
  if (midBat && midBat.battingSR > 135) {
    strengths.push({ text: `Strong middle-overs batting (SR ${midBat.battingSR})`, detail: 'Maintains momentum through the middle' })
  }
  if (deathBat && deathBat.battingSR > 155) {
    strengths.push({ text: `Lethal death-overs batting (SR ${deathBat.battingSR})`, detail: 'Big finishers at the end' })
  }

  // Bowling phase strengths
  const ppBowl = phaseStats.find(p => p.phase === 'Powerplay')
  const deathBowl = phaseStats.find(p => p.phase === 'Death')
  if (ppBowl && ppBowl.bowlingEcon > 0 && ppBowl.bowlingEcon < 7) {
    strengths.push({ text: `Dominant powerplay bowling (Econ ${ppBowl.bowlingEcon})`, detail: 'Early wickets and containment' })
  }
  if (deathBowl && deathBowl.bowlingEcon > 0 && deathBowl.bowlingEcon < 9) {
    strengths.push({ text: `Reliable death bowling (Econ ${deathBowl.bowlingEcon})`, detail: 'Defends totals under pressure' })
  }

  // Regular wicket-takers
  const regularWicketTakers = contributors.filter(c => c.wickets >= 5)
  if (regularWicketTakers.length >= 5) {
    strengths.push({
      text: `Deep bowling attack (${regularWicketTakers.length} regular wicket-takers)`,
      detail: regularWicketTakers.slice(0, 5).map(c => `${c.playerName}: ${c.wickets} wkts`).join(', ')
    })
  }

  // Squad depth
  if (composition.allrounders >= 3) {
    strengths.push({ text: `Strong all-round depth (${composition.allrounders} all-rounders)`, detail: 'Flexibility in team composition' })
  }

  // --- Weaknesses ---
  if (teamAvgSR > 0 && teamAvgSR < 125) {
    weaknesses.push({ text: `Low batting strike rate (${teamAvgSR})`, detail: 'Scoring pace below par' })
  }
  if (teamAvgEconomy > 9.5) {
    weaknesses.push({ text: `High bowling economy (${teamAvgEconomy})`, detail: 'Concedes runs too freely' })
  }
  if (boundaryPercentage > 0 && boundaryPercentage < 40) {
    weaknesses.push({ text: `Low boundary percentage (${boundaryPercentage}%)`, detail: 'Relies too much on singles and doubles' })
  }

  // Player dependency
  const topBatter = contributors[0]
  if (topBatter && topBatter.runShare > 30) {
    weaknesses.push({
      text: `Over-reliance on ${topBatter.playerName} (${topBatter.runShare}% of runs)`,
      detail: `${topBatter.runs} of ${teamBatRuns} team runs`
    })
  }
  const topBowler = [...contributors].sort((a, b) => b.wickets - a.wickets)[0]
  if (topBowler && topBowler.wicketShare > 25) {
    weaknesses.push({
      text: `Bowling dependent on ${topBowler.playerName} (${topBowler.wicketShare}% of wickets)`,
      detail: `${topBowler.wickets} of ${teamBowlWickets} team wickets`
    })
  }

  // Death bowling weakness
  if (deathBowl && deathBowl.bowlingEcon > 10) {
    weaknesses.push({
      text: `Death bowling economy above 10 (${deathBowl.bowlingEcon})`,
      detail: 'Leaks runs in the death overs'
    })
  }

  // Powerplay batting weakness
  if (ppBat && ppBat.battingSR > 0 && ppBat.battingSR < 115) {
    weaknesses.push({
      text: `Sluggish powerplay batting (SR ${ppBat.battingSR})`,
      detail: 'Slow starts put pressure on middle order'
    })
  }

  if (regularWicketTakers.length <= 2 && teamBowlWickets > 0) {
    weaknesses.push({
      text: `Thin bowling attack (only ${regularWicketTakers.length} regular wicket-takers)`,
      detail: 'Lack of bowling depth'
    })
  }

  // --- Opportunities ---
  // Young talent with high average or SR
  const risingStars = contributors.filter(c => {
    return (c.runs > 0 && c.battingAvg > 35 && c.strikeRate > 135 && c.runShare < 20) ||
           (c.wickets >= 3 && c.economy > 0 && c.economy < 7.5 && c.wicketShare < 20)
  })
  for (const star of risingStars.slice(0, 3)) {
    if (star.battingAvg > 35 && star.strikeRate > 135) {
      opportunities.push({
        text: `${star.playerName} showing strong form (Avg ${star.battingAvg}, SR ${star.strikeRate})`,
        detail: 'Emerging batting talent to build around'
      })
    } else if (star.economy > 0 && star.economy < 7.5) {
      opportunities.push({
        text: `${star.playerName} bowling efficiently (Econ ${star.economy})`,
        detail: 'Economical bowler with room to grow'
      })
    }
  }

  // Phase improvement opportunity
  if (midBat && midBat.battingSR > 0 && midBat.battingSR < 125) {
    opportunities.push({
      text: 'Room to improve middle-overs batting',
      detail: `Current SR ${midBat.battingSR} — a clear area for growth`
    })
  }

  // All-rounder depth opportunity
  if (composition.allrounders < 2) {
    opportunities.push({
      text: 'Adding all-rounders would strengthen squad balance',
      detail: `Currently only ${composition.allrounders} all-rounder(s)`
    })
  }

  if (opportunities.length === 0) {
    opportunities.push({
      text: 'Well-balanced squad with solid fundamentals',
      detail: 'Consistency in all departments can lead to deeper playoff runs'
    })
  }

  // --- Threats ---
  // Key player dependency is also a threat
  if (topBatter && topBatter.runShare > 25) {
    threats.push({
      text: `Batting fragile if ${topBatter.playerName} fails`,
      detail: `${topBatter.runShare}% run dependency — one bad match can collapse the innings`
    })
  }

  // High economy death bowling is a threat in close games
  if (deathBowl && deathBowl.bowlingEcon > 9.5) {
    threats.push({
      text: 'Close games vulnerable due to death bowling',
      detail: `Death economy of ${deathBowl.bowlingEcon} means opponents can chase totals`
    })
  }

  // Small squad
  if (squadPlayerIds.size < 15) {
    threats.push({
      text: `Small squad size (${squadPlayerIds.size} players used)`,
      detail: 'Injuries could deplete playing options'
    })
  }

  // Bowling thin
  if (composition.bowlers < 4) {
    threats.push({
      text: `Limited specialist bowlers (${composition.bowlers})`,
      detail: 'Injury to a key bowler leaves few alternatives'
    })
  }

  if (threats.length === 0) {
    threats.push({
      text: 'Strong opposition teams in the tournament',
      detail: 'Competitive league means no easy matches'
    })
  }

  // Ensure at least one item in each quadrant
  if (strengths.length === 0) {
    strengths.push({ text: 'Competitive squad with tournament experience', detail: 'Experience matters in high-pressure IPL' })
  }
  if (weaknesses.length === 0) {
    weaknesses.push({ text: 'No major weaknesses identified', detail: 'Well-rounded performance across departments' })
  }

  return {
    teamName,
    season,
    squadSize: squadPlayerIds.size,
    strengths,
    weaknesses,
    opportunities,
    threats,
    squadComposition: composition,
    topContributors: contributors.slice(0, 10),
    phaseStats,
    teamTotalRuns: teamBatRuns,
    teamTotalWickets: teamBowlWickets,
    teamAvgSR,
    teamAvgEconomy,
    boundaryPercentage,
  }
}
