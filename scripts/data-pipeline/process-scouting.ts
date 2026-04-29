/**
 * Scouting Pipeline
 * Processes ball-by-ball data from 11 T20 leagues to generate
 * comprehensive player analytics for IPL auction scouting.
 *
 * Metrics computed per the cricket-analyst.md playbook:
 * - Batting Impact Score, Phase-wise splits (PP/Mid/Death)
 * - Bowling Impact Score, Phase-wise splits
 * - Fielding Value
 * - All-Rounder Index
 * - Player archetype clustering
 * - Dot ball %, Boundary %, Balls per boundary
 * - Situational: batting position, first 10 balls SR, after 20 balls SR
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const LEAGUES_DIR = path.resolve(__dirname, '../../raw-data/leagues')
const OUT_DIR = path.resolve(__dirname, '../../public/data/scouting')

const LEAGUE_META: Record<string, { name: string; code: string; quality: number; dir: string }> = {
  bbl: { name: 'Big Bash League', code: 'BBL', quality: 0.85, dir: 'bbl_json' },
  psl: { name: 'Pakistan Super League', code: 'PSL', quality: 0.80, dir: 'psl_json' },
  cpl: { name: 'Caribbean Premier League', code: 'CPL', quality: 0.75, dir: 'cpl_json' },
  sa20: { name: 'SA20', code: 'SA20', quality: 0.82, dir: 'sat_json' },
  hundred: { name: 'The Hundred', code: 'HND', quality: 0.83, dir: 'hnd_json' },
  bpl: { name: 'Bangladesh Premier League', code: 'BPL', quality: 0.65, dir: 'bpl_json' },
  lpl: { name: 'Lanka Premier League', code: 'LPL', quality: 0.60, dir: 'lpl_json' },
  ilt20: { name: 'International League T20', code: 'ILT20', quality: 0.72, dir: 'ilt_json' },
  mlc: { name: 'Major League Cricket', code: 'MLC', quality: 0.68, dir: 'mlc_json' },
  t20blast: { name: 'T20 Blast', code: 'NTB', quality: 0.78, dir: 'ntb_json' },
  smat: { name: 'Syed Mushtaq Ali Trophy', code: 'SMAT', quality: 0.70, dir: 'sma_json' },
}

// Load IPL players to exclude from scouting (they're already in the IPL system)
function loadIPLPlayerNames(): Set<string> {
  const iplPath = path.resolve(__dirname, '../../public/data/players.json')
  if (!fs.existsSync(iplPath)) return new Set()
  const players = JSON.parse(fs.readFileSync(iplPath, 'utf-8'))
  const names = new Set<string>()
  for (const p of players) {
    names.add(p.shortName || p.name)
    if (p.shortName) names.add(p.shortName)
  }
  return names
}

// Load ineligible player IDs (Pakistani & Bangladeshi nationals — IPL bans them
// from the league, so they must not appear in the auction scouting data).
// Source of truth: ineligible-players.json, derived from CricSheet home-league
// analysis (PSL/BPL >= 50% share) + curated borderline names.
function loadIneligibleIds(): Set<string> {
  const p = path.resolve(__dirname, 'ineligible-players.json')
  if (!fs.existsSync(p)) return new Set()
  const raw = JSON.parse(fs.readFileSync(p, 'utf-8'))
  return new Set<string>(raw.banned_player_ids || [])
}

// Load name → country lookup, extracted from src/lib/nationality.ts.
// Lowercased for case-insensitive lookup.
function loadNameCountryMap(): Map<string, string> {
  const p = path.resolve(__dirname, 'nationality-lookup.json')
  const map = new Map<string, string>()
  if (!fs.existsSync(p)) return map
  const raw = JSON.parse(fs.readFileSync(p, 'utf-8')) as Record<string, string[]>
  for (const [country, names] of Object.entries(raw)) {
    for (const n of names) map.set(n.trim().toLowerCase(), country)
  }
  return map
}

// Surname → [{country, firstname}] index for the smart matcher below.
function buildSurnameIndex(nameMap: Map<string, string>): Map<string, Array<{country: string; firstname: string}>> {
  const idx = new Map<string, Array<{country: string; firstname: string}>>()
  for (const [nm, country] of nameMap) {
    const parts = nm.split(/\s+/)
    if (parts.length < 2) continue
    const surname = parts[parts.length - 1]
    const firstname = parts[0]
    const bucket = idx.get(surname) || []
    bucket.push({ country, firstname })
    idx.set(surname, bucket)
  }
  return idx
}

/**
 * Country lookup with three layers:
 *   1. Exact match against nationality map.
 *   2. Substring: a 5+ char nationality key is contained in the scouting name.
 *   3. Smart: scouting names follow "[initials] [surname]" (e.g. "SR Watson",
 *      "C Munro"); nationality.ts often only has "[firstname] [surname]"
 *      (e.g. "shane watson"). Match on surname + first-initial agreement,
 *      rejecting cases where multiple countries share the same surname+initial.
 */
function lookupCountryByName(
  name: string,
  nameMap: Map<string, string>,
  surnameIdx: Map<string, Array<{country: string; firstname: string}>>,
): string | null {
  const key = (name || '').trim().toLowerCase()
  if (!key) return null
  const direct = nameMap.get(key)
  if (direct) return direct
  for (const [k, v] of nameMap) {
    if (k.length >= 5 && key.includes(k)) return v
  }
  const parts = key.split(/\s+/)
  if (parts.length < 2) return null
  const initials = parts[0]
  const surname = parts[parts.length - 1]
  const candidates = surnameIdx.get(surname)
  if (!candidates) return null
  const matches = candidates.filter(c => initials[0] === c.firstname[0])
  if (matches.length === 0) return null
  const countries = new Set(matches.map(m => m.country))
  return countries.size === 1 ? matches[0].country : null
}

// Fallback: default country for a league's local player pool. Foreign pros in
// any league are caught by the name-based lookup layer above.
const HOME_LEAGUE_COUNTRY: Record<string, string> = {
  BBL: 'Australia',
  CPL: 'West Indies',
  NTB: 'England',
  HND: 'England',
  SA20: 'South Africa',
  LPL: 'Sri Lanka',
  MLC: 'USA',
  SMAT: 'India',
  // ILT20 intentionally omitted — it's all overseas pros.
}

interface PlayerAccum {
  name: string
  id: string
  leagues: Set<string>
  leagueMatches: Record<string, number> // per-league match count (for country derivation)
  matches: number
  // Batting
  innings: number
  runs: number
  ballsFaced: number
  fours: number
  sixes: number
  dots: number
  notOuts: number
  highScore: number
  ducks: number
  fifties: number
  hundreds: number
  // Batting by phase
  ppRuns: number; ppBalls: number; ppFours: number; ppSixes: number; ppDots: number
  midRuns: number; midBalls: number; midFours: number; midSixes: number; midDots: number
  deathRuns: number; deathBalls: number; deathFours: number; deathSixes: number; deathDots: number
  // Bowling
  bowlInnings: number
  ballsBowled: number
  runsConceded: number
  wickets: number
  bowlDots: number
  bowlFours: number
  bowlSixes: number
  wides: number
  noballs: number
  maidens: number
  bestWickets: number
  bestRuns: number
  // Bowling by phase
  ppBowlBalls: number; ppBowlRuns: number; ppBowlWickets: number; ppBowlDots: number
  midBowlBalls: number; midBowlRuns: number; midBowlWickets: number; midBowlDots: number
  deathBowlBalls: number; deathBowlRuns: number; deathBowlWickets: number; deathBowlDots: number
  // Fielding
  catches: number
  stumpings: number
  runOuts: number
  // Context
  matchIds: Set<string>
  recentSeasons: Set<string>
  teams: Set<string>
  // Dismissal types
  dismissals: Record<string, number>
  // Position tracking
  positions: Record<number, { innings: number; runs: number; balls: number }>
  // Per-league accumulators (for scout-profile per-league breakdown)
  perLeague: Record<string, LeagueBag>
}

interface LeagueBag {
  matches: number
  innings: number
  runs: number
  ballsFaced: number
  fours: number
  sixes: number
  notOuts: number
  highScore: number
  fifties: number
  hundreds: number
  bowlInnings: number
  ballsBowled: number
  runsConceded: number
  wickets: number
  bowlDots: number
  maidens: number
  bestWickets: number
  bestRuns: number
  catches: number
  stumpings: number
  runOuts: number
}

function newLeagueBag(): LeagueBag {
  return {
    matches: 0, innings: 0, runs: 0, ballsFaced: 0, fours: 0, sixes: 0,
    notOuts: 0, highScore: 0, fifties: 0, hundreds: 0,
    bowlInnings: 0, ballsBowled: 0, runsConceded: 0, wickets: 0,
    bowlDots: 0, maidens: 0, bestWickets: 0, bestRuns: 999,
    catches: 0, stumpings: 0, runOuts: 0,
  }
}

function getLeagueBag(p: PlayerAccum, code: string): LeagueBag {
  if (!p.perLeague[code]) p.perLeague[code] = newLeagueBag()
  return p.perLeague[code]
}

function finalisePerLeague(raw: Record<string, LeagueBag>): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [code, b] of Object.entries(raw)) {
    if (b.matches <= 0) continue
    const dismissals = b.innings - b.notOuts
    const battingAvg = dismissals > 0 ? b.runs / dismissals : (b.runs > 0 ? b.runs : 0)
    const strikeRate = b.ballsFaced > 0 ? (b.runs / b.ballsFaced) * 100 : 0
    const overs = b.ballsBowled / 6
    const bowlEcon = overs > 0 ? b.runsConceded / overs : 0
    const bowlAvg = b.wickets > 0 ? b.runsConceded / b.wickets : 0
    const bowlSR = b.wickets > 0 ? b.ballsBowled / b.wickets : 0
    out[code] = {
      matches: b.matches, innings: b.innings,
      runs: b.runs, ballsFaced: b.ballsFaced,
      fours: b.fours, sixes: b.sixes,
      notOuts: b.notOuts, highScore: b.highScore,
      fifties: b.fifties, hundreds: b.hundreds,
      battingAvg: +battingAvg.toFixed(2),
      strikeRate: +strikeRate.toFixed(2),
      bowlInnings: b.bowlInnings, wickets: b.wickets,
      runsConceded: b.runsConceded, ballsBowled: b.ballsBowled,
      bowlEcon: +bowlEcon.toFixed(2),
      bowlAvg: +bowlAvg.toFixed(2),
      bowlSR: +bowlSR.toFixed(2),
      bestBowling: b.bestWickets > 0 ? `${b.bestWickets}/${b.bestRuns}` : '-',
      maidens: b.maidens, bowlDots: b.bowlDots,
      catches: b.catches, stumpings: b.stumpings, runOuts: b.runOuts,
    }
  }
  return out
}

function newPlayer(name: string, id: string): PlayerAccum {
  return {
    name, id,
    leagues: new Set(), leagueMatches: {}, matches: 0, perLeague: {},
    innings: 0, runs: 0, ballsFaced: 0, fours: 0, sixes: 0, dots: 0,
    notOuts: 0, highScore: 0, ducks: 0, fifties: 0, hundreds: 0,
    ppRuns: 0, ppBalls: 0, ppFours: 0, ppSixes: 0, ppDots: 0,
    midRuns: 0, midBalls: 0, midFours: 0, midSixes: 0, midDots: 0,
    deathRuns: 0, deathBalls: 0, deathFours: 0, deathSixes: 0, deathDots: 0,
    bowlInnings: 0, ballsBowled: 0, runsConceded: 0, wickets: 0,
    bowlDots: 0, bowlFours: 0, bowlSixes: 0, wides: 0, noballs: 0, maidens: 0,
    bestWickets: 0, bestRuns: 999,
    ppBowlBalls: 0, ppBowlRuns: 0, ppBowlWickets: 0, ppBowlDots: 0,
    midBowlBalls: 0, midBowlRuns: 0, midBowlWickets: 0, midBowlDots: 0,
    deathBowlBalls: 0, deathBowlRuns: 0, deathBowlWickets: 0, deathBowlDots: 0,
    catches: 0, stumpings: 0, runOuts: 0,
    matchIds: new Set(), recentSeasons: new Set(), teams: new Set(),
    dismissals: {},
    positions: {},
  }
}

function getPhase(over: number): 'pp' | 'mid' | 'death' {
  if (over <= 5) return 'pp'
  if (over <= 15) return 'mid'
  return 'death'
}

async function main() {
  console.log('🏏 Scouting Pipeline starting...')

  const iplNames = loadIPLPlayerNames()
  console.log(`📋 ${iplNames.size} IPL player names loaded for cross-reference`)

  const players: Record<string, PlayerAccum> = {}
  let totalMatches = 0

  for (const [leagueKey, meta] of Object.entries(LEAGUE_META)) {
    const leagueDir = path.join(LEAGUES_DIR, meta.dir)
    if (!fs.existsSync(leagueDir)) {
      console.log(`⚠️ Skipping ${meta.name}: directory not found`)
      continue
    }

    const files = fs.readdirSync(leagueDir).filter(f => f.endsWith('.json') && f !== 'README.txt')
    console.log(`\n── ${meta.name} (${meta.code}): ${files.length} matches ──`)
    totalMatches += files.length

    let skippedFemale = 0

    for (const file of files) {
      const raw = fs.readFileSync(path.join(leagueDir, file), 'utf-8')
      let match: any
      try { match = JSON.parse(raw) } catch { continue }

      // IPL is a men's league — skip any women's matches (e.g., Women's Hundred
      // files co-located in hnd_json). CricSheet tags this as info.gender.
      if (match.info?.gender && match.info.gender !== 'male') {
        skippedFemale++
        continue
      }

      const matchId = `${meta.code}_${file.replace('.json', '')}`
      const season = String(match.info?.season || '').split('/')[0] || ''
      const registry = match.info?.registry?.people || {}

      // Track all playing XI
      for (const [teamName, playerList] of Object.entries(match.info?.players || {})) {
        for (const name of playerList as string[]) {
          const id = registry[name] || name.replace(/\s/g, '_').toLowerCase()
          if (!players[id]) players[id] = newPlayer(name, id)
          const p = players[id]
          p.leagues.add(meta.code)
          p.teams.add(teamName)
          if (season) p.recentSeasons.add(season)
          if (!p.matchIds.has(matchId)) {
            p.matchIds.add(matchId)
            p.matches++
            p.leagueMatches[meta.code] = (p.leagueMatches[meta.code] || 0) + 1
            getLeagueBag(p, meta.code).matches++
          }
        }
      }

      // Process innings
      for (let innIdx = 0; innIdx < (match.innings || []).length; innIdx++) {
        const inn = match.innings[innIdx]
        const batInnings: Record<string, { runs: number; balls: number; out: boolean; position: number }> = {}
        const bowlInnings: Record<string, { balls: number; runs: number; wickets: number; dots: number; maidens: number }> = {}
        const batOrder: string[] = []

        for (const ov of inn.overs || []) {
          const phase = getPhase(ov.over)
          let overRuns = 0
          let overLegalBalls = 0

          for (const del of ov.deliveries) {
            const batterId = registry[del.batter] || del.batter.replace(/\s/g, '_').toLowerCase()
            const bowlerId = registry[del.bowler] || del.bowler.replace(/\s/g, '_').toLowerCase()

            if (!players[batterId]) players[batterId] = newPlayer(del.batter, batterId)
            if (!players[bowlerId]) players[bowlerId] = newPlayer(del.bowler, bowlerId)

            const batter = players[batterId]
            const bowler = players[bowlerId]

            // Track batting order
            if (!batOrder.includes(del.batter)) batOrder.push(del.batter)
            if (!batInnings[batterId]) {
              batInnings[batterId] = { runs: 0, balls: 0, out: false, position: batOrder.indexOf(del.batter) + 1 }
            }

            const isWide = !!del.extras?.wides
            const isNoball = !!del.extras?.noballs

            // Batting
            if (!isWide) {
              batter.ballsFaced++
              batInnings[batterId].balls++
              if (phase === 'pp') batter.ppBalls++
              else if (phase === 'mid') batter.midBalls++
              else batter.deathBalls++
            }

            batter.runs += del.runs.batter
            batInnings[batterId].runs += del.runs.batter

            if (del.runs.batter === 4) {
              batter.fours++
              getLeagueBag(batter, meta.code).fours++
              if (phase === 'pp') batter.ppFours++
              else if (phase === 'mid') batter.midFours++
              else batter.deathFours++
            }
            if (del.runs.batter === 6) {
              batter.sixes++
              getLeagueBag(batter, meta.code).sixes++
              if (phase === 'pp') batter.ppSixes++
              else if (phase === 'mid') batter.midSixes++
              else batter.deathSixes++
            }
            if (del.runs.total === 0 && !isWide && !isNoball) {
              batter.dots++
              if (phase === 'pp') batter.ppDots++
              else if (phase === 'mid') batter.midDots++
              else batter.deathDots++
            }

            batter.ppRuns += phase === 'pp' ? del.runs.batter : 0
            batter.midRuns += phase === 'mid' ? del.runs.batter : 0
            batter.deathRuns += phase === 'death' ? del.runs.batter : 0

            // Bowling
            if (!bowlInnings[bowlerId]) {
              bowlInnings[bowlerId] = { balls: 0, runs: 0, wickets: 0, dots: 0, maidens: 0 }
            }

            if (!isWide && !isNoball) {
              bowler.ballsBowled++
              bowlInnings[bowlerId].balls++
              overLegalBalls++
              if (phase === 'pp') bowler.ppBowlBalls++
              else if (phase === 'mid') bowler.midBowlBalls++
              else bowler.deathBowlBalls++
            }

            const byeRuns = (del.extras?.byes || 0) + (del.extras?.legbyes || 0)
            const bowlerRuns = del.runs.total - byeRuns
            bowler.runsConceded += bowlerRuns
            bowlInnings[bowlerId].runs += bowlerRuns
            overRuns += bowlerRuns

            if (phase === 'pp') bowler.ppBowlRuns += bowlerRuns
            else if (phase === 'mid') bowler.midBowlRuns += bowlerRuns
            else bowler.deathBowlRuns += bowlerRuns

            if (isWide) bowler.wides++
            if (isNoball) bowler.noballs++

            if (del.runs.total === 0 && !isWide && !isNoball) {
              bowler.bowlDots++
              bowlInnings[bowlerId].dots++
              if (phase === 'pp') bowler.ppBowlDots++
              else if (phase === 'mid') bowler.midBowlDots++
              else bowler.deathBowlDots++
            }

            if (del.runs.batter === 4) bowler.bowlFours++
            if (del.runs.batter === 6) bowler.bowlSixes++

            // Wickets
            if (del.wickets) {
              for (const w of del.wickets) {
                const outId = registry[w.player_out] || w.player_out.replace(/\s/g, '_').toLowerCase()
                if (batInnings[outId]) batInnings[outId].out = true

                // Track dismissal type
                if (players[outId]) {
                  players[outId].dismissals[w.kind] = (players[outId].dismissals[w.kind] || 0) + 1
                }

                if (w.kind !== 'run out' && w.kind !== 'retired hurt' && w.kind !== 'retired out') {
                  bowler.wickets++
                  bowlInnings[bowlerId].wickets++
                  if (phase === 'pp') bowler.ppBowlWickets++
                  else if (phase === 'mid') bowler.midBowlWickets++
                  else bowler.deathBowlWickets++
                }

                // Fielding
                if (w.fielders) {
                  for (const f of w.fielders) {
                    const fId = registry[f.name] || f.name?.replace(/\s/g, '_').toLowerCase()
                    if (fId && players[fId]) {
                      const flb = getLeagueBag(players[fId], meta.code)
                      if (w.kind === 'caught') { players[fId].catches++; flb.catches++ }
                      if (w.kind === 'stumped') { players[fId].stumpings++; flb.stumpings++ }
                      if (w.kind === 'run out') { players[fId].runOuts++; flb.runOuts++ }
                    }
                  }
                }
              }
            }
          }

          // Maiden check
          if (overRuns === 0 && overLegalBalls === 6) {
            const mainBowler = Object.entries(bowlInnings).sort((a, b) => b[1].balls - a[1].balls)[0]
            if (mainBowler) {
              const bId = mainBowler[0]
              if (players[bId]) players[bId].maidens++
              bowlInnings[bId].maidens++
            }
          }
        }

        // Aggregate per-innings batting
        for (const [id, bi] of Object.entries(batInnings)) {
          if (!players[id]) continue
          const p = players[id]
          if (bi.balls > 0 || bi.runs > 0) p.innings++
          if (!bi.out) p.notOuts++
          if (bi.runs === 0 && bi.out && bi.balls > 0) p.ducks++
          if (bi.runs >= 50 && bi.runs < 100) p.fifties++
          if (bi.runs >= 100) p.hundreds++
          if (bi.runs > p.highScore) p.highScore = bi.runs

          // Position stats
          const pos = bi.position
          if (!p.positions[pos]) p.positions[pos] = { innings: 0, runs: 0, balls: 0 }
          p.positions[pos].innings++
          p.positions[pos].runs += bi.runs
          p.positions[pos].balls += bi.balls

          // Per-league batting
          const lb = getLeagueBag(p, meta.code)
          if (bi.balls > 0 || bi.runs > 0) lb.innings++
          if (!bi.out) lb.notOuts++
          if (bi.runs >= 50 && bi.runs < 100) lb.fifties++
          if (bi.runs >= 100) lb.hundreds++
          if (bi.runs > lb.highScore) lb.highScore = bi.runs
          lb.runs += bi.runs
          lb.ballsFaced += bi.balls
        }

        // Aggregate per-innings bowling
        for (const [id, bi] of Object.entries(bowlInnings)) {
          if (!players[id]) continue
          const p = players[id]
          if (bi.balls > 0) p.bowlInnings++
          if (bi.wickets > p.bestWickets || (bi.wickets === p.bestWickets && bi.runs < p.bestRuns)) {
            p.bestWickets = bi.wickets
            p.bestRuns = bi.runs
          }

          // Per-league bowling
          const lb = getLeagueBag(p, meta.code)
          if (bi.balls > 0) lb.bowlInnings++
          lb.ballsBowled += bi.balls
          lb.runsConceded += bi.runs
          lb.wickets += bi.wickets
          lb.bowlDots += bi.dots
          lb.maidens += bi.maidens
          if (bi.wickets > lb.bestWickets || (bi.wickets === lb.bestWickets && bi.runs < lb.bestRuns)) {
            lb.bestWickets = bi.wickets
            lb.bestRuns = bi.runs
          }
        }
      }
    }

    if (skippedFemale > 0) {
      console.log(`   (skipped ${skippedFemale} women's matches from ${meta.code})`)
      totalMatches -= skippedFemale
    }
  }

  console.log(`\n📊 Total: ${totalMatches} matches, ${Object.keys(players).length} unique players`)

  // Compute derived metrics and output
  console.log('\n── Computing analytics metrics ──')

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

  const scoutingData: any[] = []
  const iplNameSet = iplNames
  const ineligibleIds = loadIneligibleIds()
  const nameCountryMap = loadNameCountryMap()
  const surnameIdx = buildSurnameIndex(nameCountryMap)
  let skippedIneligible = 0

  const deriveCountry = (p: PlayerAccum): string => {
    const named = lookupCountryByName(p.name, nameCountryMap, surnameIdx)
    if (named) return named
    let top = '', best = 0
    for (const [league, cnt] of Object.entries(p.leagueMatches)) {
      if (cnt > best) { best = cnt; top = league }
    }
    return HOME_LEAGUE_COUNTRY[top] || 'Other'
  }

  for (const [id, p] of Object.entries(players)) {
    if (p.matches < 5) continue // Min 5 matches for reliable stats
    if (ineligibleIds.has(id)) { skippedIneligible++; continue }

    const dismissals = p.innings - p.notOuts
    const batAvg = dismissals > 0 ? p.runs / dismissals : p.runs > 0 ? p.runs : 0
    const batSR = p.ballsFaced > 0 ? (p.runs / p.ballsFaced) * 100 : 0
    const bowlEcon = p.ballsBowled > 0 ? (p.runsConceded / p.ballsBowled) * 6 : 0
    const bowlAvg = p.wickets > 0 ? p.runsConceded / p.wickets : 0
    const bowlSR = p.wickets > 0 ? p.ballsBowled / p.wickets : 0

    // Boundary %
    const boundaryRuns = (p.fours * 4) + (p.sixes * 6)
    const boundaryPct = p.runs > 0 ? (boundaryRuns / p.runs) * 100 : 0

    // Dot ball % (batting)
    const dotBallPct = p.ballsFaced > 0 ? (p.dots / p.ballsFaced) * 100 : 0

    // Balls per boundary
    const ballsPerBoundary = (p.fours + p.sixes) > 0 ? p.ballsFaced / (p.fours + p.sixes) : 999

    // Phase SR
    const ppSR = p.ppBalls > 0 ? (p.ppRuns / p.ppBalls) * 100 : 0
    const midSR = p.midBalls > 0 ? (p.midRuns / p.midBalls) * 100 : 0
    const deathSR = p.deathBalls > 0 ? (p.deathRuns / p.deathBalls) * 100 : 0

    // Bowling phase economy
    const ppBowlEcon = p.ppBowlBalls > 0 ? (p.ppBowlRuns / p.ppBowlBalls) * 6 : 0
    const midBowlEcon = p.midBowlBalls > 0 ? (p.midBowlRuns / p.midBowlBalls) * 6 : 0
    const deathBowlEcon = p.deathBowlBalls > 0 ? (p.deathBowlRuns / p.deathBowlBalls) * 6 : 0

    // Bowling dot ball %
    const bowlDotPct = p.ballsBowled > 0 ? (p.bowlDots / p.ballsBowled) * 100 : 0

    // Batting Impact Score (section 3.5)
    const batImpact = (p.runs * 1.0) + ((p.fours + p.sixes) * 1.5) + (p.sixes * 2.5)
      - (p.dots * 0.5) + (p.deathRuns * 0.2) - (p.ducks * 5)

    // Bowling Impact Score (section 4.5)
    const bowlImpact = (p.wickets * 25) + (p.bowlDots * 2) + (p.maidens * 15)
      - (p.bowlFours * 3) - (p.bowlSixes * 5) - ((p.wides + p.noballs) * 4)
      + (p.deathBowlWickets * 0.5 * 25) + (p.ppBowlWickets * 0.3 * 25)

    // Fielding Value (section 5.3)
    const fieldingValue = (p.catches * 10) + (p.runOuts * 15) + (p.stumpings * 12)

    // All-Rounder Index (section 6.2)
    const ari = (bowlAvg > 0 && bowlSR > 0)
      ? (batAvg * batSR) / (bowlAvg * bowlSR) * 1000
      : 0

    // Player archetype
    let archetype = 'Unknown'
    if (p.innings >= 10 && p.bowlInnings >= 10 && ari > 50) {
      archetype = 'Genuine All-rounder'
    } else if (p.innings >= 10 && p.bowlInnings >= 5 && ari > 20) {
      archetype = batAvg > 25 ? 'Batting All-rounder' : 'Bowling All-rounder'
    } else if (p.innings >= 10) {
      if (batSR > 145 && boundaryPct > 60) archetype = 'Power Hitter'
      else if (batAvg > 30 && batSR < 135) archetype = 'Anchor'
      else if (batAvg > 25 && batSR > 130) archetype = 'Accumulator-Accelerator'
      else archetype = 'Batter'
    } else if (p.bowlInnings >= 10) {
      if (p.deathBowlBalls > p.ppBowlBalls && deathBowlEcon < 9) archetype = 'Death Specialist'
      else if (p.ppBowlWickets > p.midBowlWickets) archetype = 'Powerplay Specialist'
      else if (bowlDotPct > 45) archetype = 'Spin Controller'
      else archetype = 'Wicket-Taker'
    }

    // Is this player already in IPL?
    const inIPL = iplNameSet.has(p.name)

    // Position summary
    const mainPosition = Object.entries(p.positions)
      .sort((a, b) => b[1].innings - a[1].innings)[0]

    const positionLabel = mainPosition
      ? Number(mainPosition[0]) <= 3 ? 'Top Order'
        : Number(mainPosition[0]) <= 5 ? 'Middle Order'
        : Number(mainPosition[0]) <= 7 ? 'Lower Order' : 'Tail'
      : 'Unknown'

    scoutingData.push({
      id: p.id,
      name: p.name,
      country: deriveCountry(p),
      leagues: Array.from(p.leagues),
      teams: Array.from(p.teams).slice(0, 5),
      matches: p.matches,
      inIPL,
      archetype,
      positionLabel,
      // Batting
      innings: p.innings,
      runs: p.runs,
      ballsFaced: p.ballsFaced,
      battingAvg: +batAvg.toFixed(2),
      strikeRate: +batSR.toFixed(2),
      highScore: p.highScore,
      fours: p.fours,
      sixes: p.sixes,
      fifties: p.fifties,
      hundreds: p.hundreds,
      boundaryPct: +boundaryPct.toFixed(1),
      dotBallPct: +dotBallPct.toFixed(1),
      ballsPerBoundary: +Math.min(ballsPerBoundary, 99).toFixed(1),
      // Phase batting
      ppSR: +ppSR.toFixed(1), ppRuns: p.ppRuns,
      midSR: +midSR.toFixed(1), midRuns: p.midRuns,
      deathSR: +deathSR.toFixed(1), deathRuns: p.deathRuns,
      // Bowling
      bowlInnings: p.bowlInnings,
      wickets: p.wickets,
      bowlEcon: +bowlEcon.toFixed(2),
      bowlAvg: +bowlAvg.toFixed(2),
      bowlSR: +bowlSR.toFixed(1),
      bestBowling: p.bestWickets > 0 ? `${p.bestWickets}/${p.bestRuns}` : '-',
      bowlDotPct: +bowlDotPct.toFixed(1),
      // Phase bowling
      ppBowlEcon: +ppBowlEcon.toFixed(2), ppBowlWickets: p.ppBowlWickets,
      midBowlEcon: +midBowlEcon.toFixed(2), midBowlWickets: p.midBowlWickets,
      deathBowlEcon: +deathBowlEcon.toFixed(2), deathBowlWickets: p.deathBowlWickets,
      // Fielding
      catches: p.catches,
      stumpings: p.stumpings,
      runOuts: p.runOuts,
      // Impact scores
      batImpact: +batImpact.toFixed(0),
      bowlImpact: +bowlImpact.toFixed(0),
      fieldingValue: fieldingValue,
      allRounderIndex: +ari.toFixed(1),
      // Dismissals
      dismissals: p.dismissals,
      // Recent activity
      recentSeasons: Array.from(p.recentSeasons).sort().slice(-3),
      // Per-league breakdown (drives scout-profile per-league tabs)
      perLeague: finalisePerLeague(p.perLeague),
    })
  }

  // Sort by combined impact
  scoutingData.sort((a, b) => (b.batImpact + b.bowlImpact) - (a.batImpact + a.bowlImpact))

  // Write full scouting data
  fs.writeFileSync(path.join(OUT_DIR, 'all-players.json'), JSON.stringify(scoutingData))
  console.log(`✓ all-players.json: ${scoutingData.length} players (${(fs.statSync(path.join(OUT_DIR, 'all-players.json')).size / 1024 / 1024).toFixed(1)}MB)`)

  // Write per-league files
  for (const [, meta] of Object.entries(LEAGUE_META)) {
    const leaguePlayers = scoutingData.filter(p => p.leagues.includes(meta.code))
    fs.writeFileSync(path.join(OUT_DIR, `${meta.code.toLowerCase()}.json`), JSON.stringify(leaguePlayers))
    console.log(`✓ ${meta.code.toLowerCase()}.json: ${leaguePlayers.length} players`)
  }

  // Write non-IPL scouting targets (players NOT in IPL system)
  const scoutTargets = scoutingData.filter(p => !p.inIPL && p.matches >= 10)
  fs.writeFileSync(path.join(OUT_DIR, 'scout-targets.json'), JSON.stringify(scoutTargets))
  console.log(`✓ scout-targets.json: ${scoutTargets.length} non-IPL players (min 10 matches)`)

  // Write IPL crossover (players in both IPL and other leagues)
  const crossover = scoutingData.filter(p => p.inIPL)
  fs.writeFileSync(path.join(OUT_DIR, 'ipl-crossover.json'), JSON.stringify(crossover))
  console.log(`✓ ipl-crossover.json: ${crossover.length} IPL players with external league data`)

  // Summary
  console.log(`\n📊 Summary:`)
  console.log(`   Total matches processed: ${totalMatches}`)
  console.log(`   Total players: ${scoutingData.length}`)
  console.log(`   Scout targets (non-IPL): ${scoutTargets.length}`)
  console.log(`   IPL crossover: ${crossover.length}`)
  console.log(`   Skipped (PAK/BAN ineligible): ${skippedIneligible}`)
  console.log(`\n✅ Scouting pipeline complete!`)
}

main().catch(err => {
  console.error('❌ Pipeline failed:', err)
  process.exit(1)
})
