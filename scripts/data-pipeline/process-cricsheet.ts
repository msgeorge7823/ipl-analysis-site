/**
 * IPL Data Pipeline
 * Transforms CricSheet JSON match files into the static JSON hierarchy
 * consumed by the frontend application.
 *
 * Input:  raw-data/ipl_json/*.json (1,175+ CricSheet match files)
 * Output: public/data/*.json (structured, split by season)
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ── Configuration ──

const RAW_DIR = path.resolve(__dirname, '../../raw-data/ipl_json')
const OUT_DIR = path.resolve(__dirname, '../../public/data')

// Team name normalization (handle renames/aliases)
const TEAM_ALIASES: Record<string, string> = {
  'Delhi Daredevils': 'Delhi Capitals',
  'Kings XI Punjab': 'Punjab Kings',
  'Rising Pune Supergiants': 'Rising Pune Supergiant',
  'Royal Challengers Bangalore': 'Royal Challengers Bengaluru',
}

const TEAM_SHORT_NAMES: Record<string, string> = {
  'Chennai Super Kings': 'CSK',
  'Mumbai Indians': 'MI',
  'Royal Challengers Bengaluru': 'RCB',
  'Kolkata Knight Riders': 'KKR',
  'Delhi Capitals': 'DC',
  'Punjab Kings': 'PBKS',
  'Rajasthan Royals': 'RR',
  'Sunrisers Hyderabad': 'SRH',
  'Gujarat Titans': 'GT',
  'Lucknow Super Giants': 'LSG',
  'Deccan Chargers': 'DCH',
  'Kochi Tuskers Kerala': 'KTK',
  'Pune Warriors': 'PW',
  'Gujarat Lions': 'GL',
  'Rising Pune Supergiant': 'RPS',
}

// Brightened team colors for dark background visibility
const TEAM_COLORS: Record<string, { primary: string; secondary: string }> = {
  'Chennai Super Kings': { primary: '#FFD130', secondary: '#3B9AE8' },
  'Mumbai Indians': { primary: '#2B7FD4', secondary: '#D4AF37' },
  'Royal Challengers Bengaluru': { primary: '#EF3340', secondary: '#D4AF37' },
  'Kolkata Knight Riders': { primary: '#7B5EA7', secondary: '#D4A84B' },
  'Delhi Capitals': { primary: '#4B8FE2', secondary: '#EF4444' },
  'Punjab Kings': { primary: '#ED1B24', secondary: '#C0C0C0' },
  'Rajasthan Royals': { primary: '#5B8FD4', secondary: '#CBA92B' },
  'Sunrisers Hyderabad': { primary: '#FF822A', secondary: '#E54B17' },
  'Gujarat Titans': { primary: '#7DD3E8', secondary: '#1C1C1C' },
  'Lucknow Super Giants': { primary: '#D94070', secondary: '#FFD700' },
  'Deccan Chargers': { primary: '#5B8FBF', secondary: '#C0C0C0' },
  'Kochi Tuskers Kerala': { primary: '#9B59E8', secondary: '#FFD700' },
  'Pune Warriors': { primary: '#4BB8F0', secondary: '#D0D0D0' },
  'Gujarat Lions': { primary: '#F06830', secondary: '#1A1A2E' },
  'Rising Pune Supergiant': { primary: '#9B59E8', secondary: '#D1C4E9' },
}

const DEFUNCT_TEAMS = ['Deccan Chargers', 'Kochi Tuskers Kerala', 'Pune Warriors', 'Gujarat Lions', 'Rising Pune Supergiant']

// ── Types for CricSheet JSON ──

interface CricSheetMatch {
  meta: { data_version: string; created: string; revision: number }
  info: {
    balls_per_over: number
    city?: string
    dates: string[]
    event?: { match_number?: number; name?: string }
    gender: string
    match_type: string
    officials?: { umpires?: string[]; match_referees?: string[]; tv_umpires?: string[] }
    outcome?: { winner?: string; by?: { runs?: number; wickets?: number }; result?: string; eliminator?: string; method?: string }
    overs: number
    player_of_match?: string[]
    players: Record<string, string[]>
    registry?: { people: Record<string, string> }
    season: string | number
    teams: string[]
    toss: { decision: string; winner: string }
    venue?: string
  }
  innings: Array<{
    team: string
    overs: Array<{
      over: number
      deliveries: Array<{
        batter: string
        bowler: string
        non_striker: string
        runs: { batter: number; extras: number; total: number }
        extras?: Record<string, number>
        wickets?: Array<{
          kind: string
          player_out: string
          fielders?: Array<{ name: string }>
        }>
      }>
    }>
  }>
}

// Venue name normalization (CricSheet uses inconsistent venue names)
const VENUE_ALIASES: Record<string, string> = {
  'Wankhede Stadium, Mumbai': 'Wankhede Stadium',
  'Eden Gardens, Kolkata': 'Eden Gardens',
  'M Chinnaswamy Stadium, Bengaluru': 'M Chinnaswamy Stadium',
  'M.Chinnaswamy Stadium': 'M Chinnaswamy Stadium',
  'MA Chidambaram Stadium, Chepauk': 'MA Chidambaram Stadium',
  'MA Chidambaram Stadium, Chepauk, Chennai': 'MA Chidambaram Stadium',
  'MA Chidambaram Stadium': 'MA Chidambaram Stadium',
  'Rajiv Gandhi International Stadium, Uppal': 'Rajiv Gandhi International Stadium',
  'Rajiv Gandhi International Stadium, Uppal, Hyderabad': 'Rajiv Gandhi International Stadium',
  'Arun Jaitley Stadium, Delhi': 'Arun Jaitley Stadium',
  'Brabourne Stadium, Mumbai': 'Brabourne Stadium',
  'Dr DY Patil Sports Academy, Mumbai': 'Dr DY Patil Sports Academy',
  'Dr. YSR International Cricket Stadium, Visakhapatnam': 'Dr. YSR International Cricket Stadium',
  'Himachal Pradesh Cricket Association Stadium, Dharamsala': 'Himachal Pradesh Cricket Association Stadium',
  'Sawai Mansingh Stadium, Jaipur': 'Sawai Mansingh Stadium',
  'Maharashtra Cricket Association Stadium, Pune': 'Maharashtra Cricket Association Stadium',
  'Punjab Cricket Association IS Bindra Stadium, Mohali': 'Punjab Cricket Association IS Bindra Stadium',
  'Punjab Cricket Association IS Bindra Stadium, Mohali, Chandigarh': 'Punjab Cricket Association IS Bindra Stadium',
  'Punjab Cricket Association Stadium, Mohali': 'Punjab Cricket Association IS Bindra Stadium',
  'Sardar Patel Stadium, Motera': 'Narendra Modi Stadium',
  'Barsapara Cricket Stadium, Guwahati': 'Barsapara Cricket Stadium',
  'Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow': 'Ekana Cricket Stadium',
  // Cricsheet uses the long official name; we display a shorter one.
  'Maharaja Yadavindra Singh International Cricket Stadium, Mullanpur': 'MYS International Cricket Stadium',
  'Maharaja Yadavindra Singh International Cricket Stadium, New Chandigarh': 'MYS International Cricket Stadium',
  'Maharaja Yadavindra Singh International Cricket Stadium': 'MYS International Cricket Stadium',
  'Vidarbha Cricket Association Stadium, Jamtha': 'Vidarbha Cricket Association Stadium',
  'Zayed Cricket Stadium, Abu Dhabi': 'Sheikh Zayed Stadium',
  'Narendra Modi Stadium, Ahmedabad': 'Narendra Modi Stadium',
  'Shaheed Veer Narayan Singh International Stadium': 'Shaheed Veer Narayan Singh International Stadium',
  'M Chinnaswamy Stadium, Bengaluru': 'M Chinnaswamy Stadium',
}

// City normalization
const VENUE_CITIES: Record<string, string> = {
  'Wankhede Stadium': 'Mumbai',
  'Eden Gardens': 'Kolkata',
  'M Chinnaswamy Stadium': 'Bengaluru',
  'MA Chidambaram Stadium': 'Chennai',
  'Rajiv Gandhi International Stadium': 'Hyderabad',
  'Arun Jaitley Stadium': 'Delhi',
  'Feroz Shah Kotla': 'Delhi',
  'Brabourne Stadium': 'Mumbai',
  'Dr DY Patil Sports Academy': 'Mumbai',
  'Dr. YSR International Cricket Stadium': 'Visakhapatnam',
  'Himachal Pradesh Cricket Association Stadium': 'Dharamsala',
  'Sawai Mansingh Stadium': 'Jaipur',
  'Maharashtra Cricket Association Stadium': 'Pune',
  'Subrata Roy Sahara Stadium': 'Pune',
  'Punjab Cricket Association IS Bindra Stadium': 'Mohali',
  'Narendra Modi Stadium': 'Ahmedabad',
  'Ekana Cricket Stadium': 'Lucknow',
  'MYS International Cricket Stadium': 'Mullanpur',
  'Holkar Cricket Stadium': 'Indore',
  'JSCA International Stadium Complex': 'Ranchi',
  'Barsapara Cricket Stadium': 'Guwahati',
  'Green Park': 'Kanpur',
  'Barabati Stadium': 'Cuttack',
  'Nehru Stadium': 'Kochi',
  'Saurashtra Cricket Association Stadium': 'Rajkot',
  'Dubai International Cricket Stadium': 'Dubai',
  'Sharjah Cricket Stadium': 'Sharjah',
  'Sheikh Zayed Stadium': 'Abu Dhabi',
  'Vidarbha Cricket Association Stadium': 'Nagpur',
  'Shaheed Veer Narayan Singh International Stadium': 'Raipur',
  'Kingsmead': 'Durban',
  'New Wanderers Stadium': 'Johannesburg',
  'Newlands': 'Cape Town',
  'SuperSport Park': 'Centurion',
  "St George's Park": 'Port Elizabeth',
  'Buffalo Park': 'East London',
  'De Beers Diamond Oval': 'Kimberley',
  'OUTsurance Oval': 'Bloemfontein',
}

// ── Helpers ──

function normalizeTeam(name: string): string {
  return TEAM_ALIASES[name] || name
}

function normalizeVenue(name: string): string {
  return VENUE_ALIASES[name] || name
}

function getVenueCity(venue: string, fallbackCity: string): string {
  return VENUE_CITIES[venue] || fallbackCity || ''
}

function normalizeSeason(s: string | number, matchDate?: string): string {
  const str = String(s)
  if (str.includes('/')) {
    // For split-year seasons, use the calendar year from the match date if available
    // This correctly handles "2020/21" → "2020" (IPL 2020 played in UAE)
    // while "2007/08" → "2008" and "2009/10" → "2010" remain correct
    if (matchDate) {
      return matchDate.substring(0, 4)
    }
    // Fallback: use second part (works for 2007/08→2008, 2009/10→2010)
    const parts = str.split('/')
    const century = parts[0].substring(0, 2)
    return century + parts[1]
  }
  return str
}

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

// ── Player Enrichment ──

const ENRICHMENT_PATH = path.resolve(__dirname, 'player-enrichment.json')
let PLAYER_ENRICHMENT: Record<string, { fullName: string; nicknames: string[] }> = {}
if (fs.existsSync(ENRICHMENT_PATH)) {
  PLAYER_ENRICHMENT = JSON.parse(fs.readFileSync(ENRICHMENT_PATH, 'utf-8'))
}

// ── Player Status Registry (official retirements & confirmed active) ──

const STATUS_REGISTRY_PATH = path.resolve(__dirname, 'player-status-registry.json')
let STATUS_REGISTRY: { retired: Record<string, any>; active: Record<string, any> } = { retired: {}, active: {} }
if (fs.existsSync(STATUS_REGISTRY_PATH)) {
  const raw = JSON.parse(fs.readFileSync(STATUS_REGISTRY_PATH, 'utf-8'))
  STATUS_REGISTRY = { retired: raw.retired || {}, active: raw.active || {} }
  // Remove internal _note/_description keys
  delete STATUS_REGISTRY.retired._note
  delete STATUS_REGISTRY.active._note
}

// ── Player Roles Registry (official roles from team sheets) ──

const ROLES_REGISTRY_PATH = path.resolve(__dirname, 'player-roles-registry.json')
let PLAYER_ROLES: Record<string, string> = {}
if (fs.existsSync(ROLES_REGISTRY_PATH)) {
  const raw = JSON.parse(fs.readFileSync(ROLES_REGISTRY_PATH, 'utf-8'))
  PLAYER_ROLES = raw.roles || {}
}

function getPlayerRole(shortName: string, fullName: string): string | undefined {
  return PLAYER_ROLES[shortName] || PLAYER_ROLES[fullName] || undefined
}

// ── Replacement Players Registry ──

const REPLACEMENT_PATH = path.resolve(__dirname, 'replacement-players.json')
let REPLACEMENT_REGISTRY: Record<string, Array<{ player: string; team: string; replacing: string; reason: string; price?: string }>> = {}
if (fs.existsSync(REPLACEMENT_PATH)) {
  const raw = JSON.parse(fs.readFileSync(REPLACEMENT_PATH, 'utf-8'))
  for (const [year, entries] of Object.entries(raw)) {
    if (Array.isArray(entries)) REPLACEMENT_REGISTRY[year] = entries as any
  }
}

// Build a lookup: playerName → { season, team, replacing, reason }[]
const REPLACEMENT_LOOKUP: Record<string, Array<{ season: string; team: string; replacing: string; reason: string }>> = {}
for (const [year, entries] of Object.entries(REPLACEMENT_REGISTRY)) {
  for (const entry of entries) {
    if (!REPLACEMENT_LOOKUP[entry.player]) REPLACEMENT_LOOKUP[entry.player] = []
    REPLACEMENT_LOOKUP[entry.player].push({ season: year, team: entry.team, replacing: entry.replacing, reason: entry.reason })
  }
}

// ── Official IPL Squad Registry ──

const SQUADS_2026_PATH = path.resolve(__dirname, 'ipl-squads-2026.json')
let OFFICIAL_SQUADS: Record<string, { captain: string; coach: string; players: any[] }> = {}
if (fs.existsSync(SQUADS_2026_PATH)) {
  const raw = JSON.parse(fs.readFileSync(SQUADS_2026_PATH, 'utf-8'))
  OFFICIAL_SQUADS = raw.teams || {}
}

function determinePlayerStatus(shortName: string, lastSeason: string): string {
  // 1. Check if officially retired
  if (STATUS_REGISTRY.retired[shortName]) return 'retired'
  // 2. Check if confirmed active
  if (STATUS_REGISTRY.active[shortName]) return 'active'
  // 3. Fallback: use season-based heuristic
  const lastYear = parseInt(lastSeason)
  if (lastYear >= 2025) return 'active'
  if (lastYear >= 2023) return 'inactive'  // not picked recently, but no retirement announcement
  return 'retired'  // 3+ seasons absent with no confirmed return
}

function enrichPlayer(shortName: string): { fullName: string; shortName: string; nicknames: string[] } {
  const enrichment = PLAYER_ENRICHMENT[shortName]
  if (enrichment) {
    return { fullName: enrichment.fullName, shortName, nicknames: enrichment.nicknames || [] }
  }
  // For players not in enrichment, use the CricSheet name as both
  return { fullName: shortName, shortName, nicknames: [] }
}

// ── Main Pipeline ──

async function main() {
  console.log('🏏 IPL Data Pipeline starting...')
  console.log(`📂 Reading from: ${RAW_DIR}`)
  console.log(`📁 Writing to: ${OUT_DIR}`)
  console.log(`📋 Player enrichment: ${Object.keys(PLAYER_ENRICHMENT).length} entries`)

  // Read all match files
  const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.json'))
  console.log(`📊 Found ${files.length} match files`)

  const allMatches: CricSheetMatch[] = []
  for (const file of files) {
    const raw = fs.readFileSync(path.join(RAW_DIR, file), 'utf-8')
    const match = JSON.parse(raw) as CricSheetMatch
    ;(match as any)._fileId = file.replace('.json', '')
    allMatches.push(match)
  }

  // Sort by date
  allMatches.sort((a, b) => (a.info.dates[0] || '').localeCompare(b.info.dates[0] || ''))

  console.log('\n── Step 1: Extract players ──')
  const players = extractPlayers(allMatches)
  console.log(`   ${Object.keys(players).length} unique players`)

  console.log('\n── Step 2: Build teams ──')
  const teams = extractTeams(allMatches)
  console.log(`   ${teams.length} teams`)

  console.log('\n── Step 3: Build matches (by season) ──')
  const matchesBySeason = buildMatches(allMatches)
  console.log(`   ${Object.keys(matchesBySeason).length} seasons`)

  console.log('\n── Step 4: Build scorecards (by season) ──')
  const { batting, bowling } = buildScorecards(allMatches)
  console.log(`   Batting entries: ${Object.values(batting).flat().length}`)
  console.log(`   Bowling entries: ${Object.values(bowling).flat().length}`)

  console.log('\n── Step 5: Build ball-by-ball (by season) ──')
  const bbb = buildBallByBall(allMatches)
  const totalBalls = Object.values(bbb).reduce((sum, arr) => sum + arr.length, 0)
  console.log(`   ${totalBalls} deliveries`)

  console.log('\n── Step 6: Build partnerships (by season) ──')
  const partnerships = buildPartnerships(allMatches)

  console.log('\n── Step 7: Build seasons ──')
  const seasons = buildSeasons(allMatches, matchesBySeason)

  console.log('\n── Step 8: Build venues ──')
  const venues = buildVenues(allMatches)
  console.log(`   ${venues.length} venues`)

  console.log('\n── Step 9: Compute player career stats ──')
  const playerStats = computePlayerStats(allMatches, players)

  console.log('\n── Step 10: Build player-teams mapping ──')
  const playerTeams = buildPlayerTeams(allMatches)

  console.log('\n── Step 11: Build cap race data ──')
  const capRace = buildCapRace(allMatches)
  console.log(`   ${Object.keys(capRace).length} seasons`)

  console.log('\n── Step 12: Write output files ──')
  writeOutput({
    players,
    teams,
    matchesBySeason,
    batting,
    bowling,
    bbb,
    partnerships,
    seasons,
    venues,
    playerStats,
    playerTeams,
    capRace,
  })

  console.log('\n── Step 13: Generate manifest ──')
  generateManifest()

  console.log('\n✅ Pipeline complete!')
}

// ── Step 1: Extract Players ──

function extractPlayers(matches: CricSheetMatch[]): Record<string, any> {
  const playerMap: Record<string, {
    id: string
    name: string
    teams: Set<string>
    teamSeasons: Map<string, Set<string>>  // team → set of seasons
    seasons: Set<string>
    firstMatch: string
    lastMatch: string
    lastTeam: string
    matchCount: number
  }> = {}

  for (const match of matches) {
    const season = normalizeSeason(match.info.season, match.info.dates[0])
    const registry = match.info.registry?.people || {}

    for (const [teamName, playerList] of Object.entries(match.info.players)) {
      const team = normalizeTeam(teamName)
      for (const name of playerList) {
        const id = registry[name] || name.replace(/\s/g, '_').toLowerCase()

        if (!playerMap[id]) {
          playerMap[id] = {
            id,
            name,
            teams: new Set(),
            teamSeasons: new Map(),
            seasons: new Set(),
            firstMatch: match.info.dates[0],
            lastMatch: match.info.dates[0],
            lastTeam: team,
            matchCount: 0,
          }
        }

        playerMap[id].teams.add(team)
        playerMap[id].seasons.add(season)
        playerMap[id].lastMatch = match.info.dates[0]
        playerMap[id].lastTeam = team  // always updates since matches are sorted chronologically
        playerMap[id].matchCount++
        // Track seasons per team
        if (!playerMap[id].teamSeasons.has(team)) {
          playerMap[id].teamSeasons.set(team, new Set())
        }
        playerMap[id].teamSeasons.get(team)!.add(season)
        // Update name if we have a newer version
        playerMap[id].name = name
      }
    }
  }

  // Convert sets to arrays and determine status
  const result: Record<string, any> = {}
  for (const [id, p] of Object.entries(playerMap)) {
    const seasonsArr = Array.from(p.seasons).sort()
    const lastSeason = seasonsArr[seasonsArr.length - 1]
    const enriched = enrichPlayer(p.name)

    // Sort teams by number of seasons played (descending)
    const teamsSorted = Array.from(p.teams).sort((a, b) => {
      const seasonsA = p.teamSeasons.get(a)?.size || 0
      const seasonsB = p.teamSeasons.get(b)?.size || 0
      return seasonsB - seasonsA
    })

    // Check if player was ever a replacement
    const replacementHistory = REPLACEMENT_LOOKUP[p.name] || []

    // Get official role from registry, fallback undefined
    const officialRole = getPlayerRole(p.name, enriched.fullName)

    result[id] = {
      id: p.id,
      name: enriched.fullName,
      shortName: enriched.shortName,
      nicknames: enriched.nicknames,
      role: officialRole || undefined,
      teams: teamsSorted,
      lastTeam: p.lastTeam,
      seasons: seasonsArr,
      firstMatch: p.firstMatch,
      lastMatch: p.lastMatch,
      matchCount: p.matchCount,
      status: determinePlayerStatus(p.name, lastSeason),
      isReplacement: replacementHistory.length > 0,
      replacementHistory: replacementHistory.length > 0 ? replacementHistory : undefined,
    }
  }
  return result
}

// ── Step 2: Extract Teams ──

function extractTeams(matches: CricSheetMatch[]) {
  const teamSeasons: Record<string, Set<string>> = {}
  const teamVenues: Record<string, Set<string>> = {}

  for (const match of matches) {
    const season = normalizeSeason(match.info.season, match.info.dates[0])
    for (const t of match.info.teams) {
      const team = normalizeTeam(t)
      if (!teamSeasons[team]) teamSeasons[team] = new Set()
      if (!teamVenues[team]) teamVenues[team] = new Set()
      teamSeasons[team].add(season)
      if (match.info.venue) teamVenues[team].add(normalizeVenue(match.info.venue))
    }
  }

  return Object.entries(teamSeasons).map(([name, seasons]) => ({
    id: name.replace(/\s/g, '-').toLowerCase(),
    name,
    shortName: TEAM_SHORT_NAMES[name] || name.substring(0, 3).toUpperCase(),
    primaryColor: TEAM_COLORS[name]?.primary || '#333333',
    secondaryColor: TEAM_COLORS[name]?.secondary || '#CCCCCC',
    homeVenue: Array.from(teamVenues[name] || [])[0] || '',
    seasons: Array.from(seasons).sort(),
    isDefunct: DEFUNCT_TEAMS.includes(name),
    aliases: Object.entries(TEAM_ALIASES).filter(([_, v]) => v === name).map(([k]) => k),
  }))
}

// ── Step 3: Build Matches ──

function buildMatches(matches: CricSheetMatch[]): Record<string, any[]> {
  const bySeason: Record<string, any[]> = {}

  for (const match of matches) {
    const season = normalizeSeason(match.info.season, match.info.dates[0])
    const fileId = (match as any)._fileId

    // Compute innings summaries
    const inningsSummaries = (match.innings || []).map(inn => {
      let runs = 0, wickets = 0, extras = 0, balls = 0
      for (const ov of inn.overs || []) {
        for (const del of ov.deliveries) {
          runs += del.runs.total
          extras += del.runs.extras
          if (del.wickets) wickets += del.wickets.length
          // Don't count wides/noballs as legal deliveries for over count
          if (!del.extras?.wides && !del.extras?.noballs) balls++
        }
      }
      const overs = Math.floor(balls / 6) + (balls % 6) / 10
      return {
        team: normalizeTeam(inn.team),
        runs,
        wickets,
        overs: parseFloat(overs.toFixed(1)),
        extras,
      }
    })

    const matchData = {
      id: fileId,
      season,
      date: match.info.dates[0],
      venue: normalizeVenue(match.info.venue || 'Unknown'),
      city: getVenueCity(normalizeVenue(match.info.venue || 'Unknown'), match.info.city || ''),
      teams: match.info.teams.map(normalizeTeam),
      tossWinner: normalizeTeam(match.info.toss.winner),
      tossDecision: match.info.toss.decision,
      // Tied matches resolved by Super Over: CricSheet records the SO winner
      // under outcome.eliminator. We surface the SO winner as `winner` so
      // points-table logic and UI don't need special-case branches, while
      // preserving result='tie' + eliminator for callers that care.
      winner: match.info.outcome?.winner
        ? normalizeTeam(match.info.outcome.winner)
        : (match.info.outcome?.eliminator ? normalizeTeam(match.info.outcome.eliminator) : undefined),
      result: match.info.outcome?.result,
      eliminator: match.info.outcome?.eliminator ? normalizeTeam(match.info.outcome.eliminator) : undefined,
      winMargin: match.info.outcome?.by,
      playerOfMatch: match.info.player_of_match,
      matchNumber: match.info.event?.match_number,
      umpires: match.info.officials?.umpires,
      innings: inningsSummaries,
    }

    if (!bySeason[season]) bySeason[season] = []
    bySeason[season].push(matchData)
  }

  return bySeason
}

// ── Step 4: Build Scorecards ──

function buildScorecards(matches: CricSheetMatch[]) {
  const batting: Record<string, any[]> = {}
  const bowling: Record<string, any[]> = {}

  for (const match of matches) {
    const season = normalizeSeason(match.info.season, match.info.dates[0])
    const fileId = (match as any)._fileId
    const registry = match.info.registry?.people || {}

    if (!batting[season]) batting[season] = []
    if (!bowling[season]) bowling[season] = []

    for (let innIdx = 0; innIdx < (match.innings || []).length; innIdx++) {
      const inn = match.innings[innIdx]
      const innNum = innIdx + 1

      // Aggregate batting stats per batter
      const batterStats: Record<string, {
        runs: number; balls: number; fours: number; sixes: number
        dismissal?: string; bowler?: string; fielder?: string
        position: number
      }> = {}
      const batOrder: string[] = []

      // Aggregate bowling stats per bowler
      const bowlerStats: Record<string, {
        balls: number; runs: number; wickets: number; maidens: number
        dots: number; fours: number; sixes: number; wides: number; noballs: number
      }> = {}

      for (const ov of inn.overs || []) {
        let overRuns = 0
        let overLegalBalls = 0

        for (const del of ov.deliveries) {
          const batter = del.batter
          const bowler = del.bowler

          // Track batting order
          if (!batOrder.includes(batter)) batOrder.push(batter)

          // Initialize batter
          if (!batterStats[batter]) {
            batterStats[batter] = { runs: 0, balls: 0, fours: 0, sixes: 0, position: batOrder.indexOf(batter) + 1 }
          }

          // Initialize bowler
          if (!bowlerStats[bowler]) {
            bowlerStats[bowler] = { balls: 0, runs: 0, wickets: 0, maidens: 0, dots: 0, fours: 0, sixes: 0, wides: 0, noballs: 0 }
          }

          // Count legal ball for batter (not wides)
          if (!del.extras?.wides) {
            batterStats[batter].balls++
          }

          // Batter runs
          batterStats[batter].runs += del.runs.batter
          if (del.runs.batter === 4) batterStats[batter].fours++
          if (del.runs.batter === 6) batterStats[batter].sixes++

          // Bowler stats
          const isWide = !!del.extras?.wides
          const isNoball = !!del.extras?.noballs

          if (!isWide && !isNoball) {
            bowlerStats[bowler].balls++
            overLegalBalls++
          }

          // Runs charged to bowler (everything except byes and legbyes)
          const byeRuns = (del.extras?.byes || 0) + (del.extras?.legbyes || 0)
          const bowlerRuns = del.runs.total - byeRuns
          bowlerStats[bowler].runs += bowlerRuns
          overRuns += bowlerRuns

          if (isWide) bowlerStats[bowler].wides += del.extras!.wides!
          if (isNoball) bowlerStats[bowler].noballs += del.extras!.noballs!

          if (del.runs.total === 0 && !isWide && !isNoball) bowlerStats[bowler].dots++
          if (del.runs.batter === 4) bowlerStats[bowler].fours++
          if (del.runs.batter === 6) bowlerStats[bowler].sixes++

          // Wickets
          if (del.wickets) {
            for (const w of del.wickets) {
              // Credit bowler for bowling wickets (not run outs)
              if (w.kind !== 'run out' && w.kind !== 'retired hurt' && w.kind !== 'retired out' && w.kind !== 'obstructing the field') {
                bowlerStats[bowler].wickets++
              }
              // Mark dismissal on batter
              if (batterStats[w.player_out]) {
                batterStats[w.player_out].dismissal = w.kind
                batterStats[w.player_out].bowler = bowler
                batterStats[w.player_out].fielder = w.fielders?.[0]?.name
              } else {
                // Player out might not have faced a ball (run out non-striker)
                if (!batOrder.includes(w.player_out)) batOrder.push(w.player_out)
                batterStats[w.player_out] = {
                  runs: 0, balls: 0, fours: 0, sixes: 0,
                  position: batOrder.indexOf(w.player_out) + 1,
                  dismissal: w.kind, bowler, fielder: w.fielders?.[0]?.name,
                }
              }
            }
          }
        }

        // Check maiden over
        if (overRuns === 0 && overLegalBalls === 6) {
          // Credit maiden to the bowler who bowled the most balls this over
          const overBowlers: Record<string, number> = {}
          for (const del of ov.deliveries) {
            if (!del.extras?.wides && !del.extras?.noballs) {
              overBowlers[del.bowler] = (overBowlers[del.bowler] || 0) + 1
            }
          }
          const mainBowler = Object.entries(overBowlers).sort((a, b) => b[1] - a[1])[0]?.[0]
          if (mainBowler && bowlerStats[mainBowler]) {
            bowlerStats[mainBowler].maidens++
          }
        }
      }

      // Build batting scorecard entries
      for (const [name, stats] of Object.entries(batterStats)) {
        batting[season].push({
          matchId: fileId,
          innings: innNum,
          batter: name,
          batterId: registry[name] || name.replace(/\s/g, '_').toLowerCase(),
          runs: stats.runs,
          balls: stats.balls,
          fours: stats.fours,
          sixes: stats.sixes,
          strikeRate: stats.balls > 0 ? parseFloat(((stats.runs / stats.balls) * 100).toFixed(2)) : 0,
          dismissal: stats.dismissal || 'not out',
          bowler: stats.bowler,
          fielder: stats.fielder,
          position: stats.position,
        })
      }

      // Build bowling scorecard entries
      for (const [name, stats] of Object.entries(bowlerStats)) {
        const overs = Math.floor(stats.balls / 6) + (stats.balls % 6) / 10
        bowling[season].push({
          matchId: fileId,
          innings: innNum,
          bowler: name,
          bowlerId: registry[name] || name.replace(/\s/g, '_').toLowerCase(),
          overs: parseFloat(overs.toFixed(1)),
          maidens: stats.maidens,
          runs: stats.runs,
          wickets: stats.wickets,
          economy: stats.balls > 0 ? parseFloat(((stats.runs / stats.balls) * 6).toFixed(2)) : 0,
          dots: stats.dots,
          fours: stats.fours,
          sixes: stats.sixes,
          wides: stats.wides,
          noballs: stats.noballs,
        })
      }
    }
  }

  return { batting, bowling }
}

// ── Step 5: Build Ball-by-Ball ──

function buildBallByBall(matches: CricSheetMatch[]): Record<string, any[]> {
  const bySeason: Record<string, any[]> = {}

  for (const match of matches) {
    const season = normalizeSeason(match.info.season, match.info.dates[0])
    const fileId = (match as any)._fileId

    if (!bySeason[season]) bySeason[season] = []

    for (let innIdx = 0; innIdx < (match.innings || []).length; innIdx++) {
      const inn = match.innings[innIdx]
      for (const ov of inn.overs || []) {
        let ballNum = 0
        for (const del of ov.deliveries) {
          ballNum++
          bySeason[season].push({
            m: fileId,
            i: innIdx + 1,
            o: ov.over,
            b: ballNum,
            bat: del.batter,
            bwl: del.bowler,
            br: del.runs.batter,
            er: del.runs.extras,
            tr: del.runs.total,
            ex: del.extras || undefined,
            w: del.wickets ? del.wickets.map(w => ({
              k: w.kind,
              p: w.player_out,
              f: w.fielders?.map(f => f.name),
            })) : undefined,
          })
        }
      }
    }
  }

  return bySeason
}

// ── Step 6: Build Partnerships ──

function buildPartnerships(matches: CricSheetMatch[]): Record<string, any[]> {
  const bySeason: Record<string, any[]> = {}

  for (const match of matches) {
    const season = normalizeSeason(match.info.season, match.info.dates[0])
    const fileId = (match as any)._fileId

    if (!bySeason[season]) bySeason[season] = []

    for (let innIdx = 0; innIdx < (match.innings || []).length; innIdx++) {
      const inn = match.innings[innIdx]
      let wicketNum = 0
      let partnerRuns = 0
      let partnerBalls = 0
      let batter1 = ''
      let batter2 = ''

      for (const ov of inn.overs || []) {
        for (const del of ov.deliveries) {
          if (!batter1) batter1 = del.batter
          if (!batter2 && del.batter !== batter1) batter2 = del.batter
          if (!batter2 && del.non_striker !== batter1) batter2 = del.non_striker

          partnerRuns += del.runs.total
          if (!del.extras?.wides) partnerBalls++

          if (del.wickets) {
            wicketNum++
            bySeason[season].push({
              matchId: fileId,
              innings: innIdx + 1,
              wicket: wicketNum,
              batter1,
              batter2: batter2 || del.non_striker,
              runs: partnerRuns,
              balls: partnerBalls,
            })

            // Reset for next partnership
            partnerRuns = 0
            partnerBalls = 0
            const outPlayer = del.wickets[0].player_out
            if (outPlayer === batter1) batter1 = ''
            else batter2 = ''
          }
        }
      }

      // Final partnership (unbroken)
      if (partnerRuns > 0 || partnerBalls > 0) {
        bySeason[season].push({
          matchId: fileId,
          innings: innIdx + 1,
          wicket: wicketNum + 1,
          batter1: batter1 || 'unknown',
          batter2: batter2 || 'unknown',
          runs: partnerRuns,
          balls: partnerBalls,
        })
      }
    }
  }

  return bySeason
}

// ── Step 7: Build Seasons ──

function buildSeasons(matches: CricSheetMatch[], matchesBySeason: Record<string, any[]>) {
  const seasons: any[] = []

  for (const [season, matchList] of Object.entries(matchesBySeason)) {
    // Find final match (likely the final)
    const sortedMatches = [...matchList].sort((a, b) => a.date.localeCompare(b.date))
    const finalMatch = sortedMatches[sortedMatches.length - 1]
    const finalLoser = finalMatch?.winner
      ? finalMatch.teams.find((t: string) => t !== finalMatch.winner)
      : undefined
    const teams = new Set<string>()
    matchList.forEach(m => m.teams.forEach((t: string) => teams.add(t)))

    // Find orange/purple cap from raw data
    const batterRuns: Record<string, number> = {}
    const bowlerWickets: Record<string, number> = {}
    for (const match of matches) {
      if (normalizeSeason(match.info.season, match.info.dates[0]) !== season) continue
      for (const inn of match.innings || []) {
        for (const ov of inn.overs || []) {
          for (const del of ov.deliveries) {
            batterRuns[del.batter] = (batterRuns[del.batter] || 0) + del.runs.batter
            if (del.wickets) {
              for (const w of del.wickets) {
                if (w.kind !== 'run out' && w.kind !== 'retired hurt' && w.kind !== 'retired out') {
                  bowlerWickets[del.bowler] = (bowlerWickets[del.bowler] || 0) + 1
                }
              }
            }
          }
        }
      }
    }

    const orangeCap = Object.entries(batterRuns).sort((a, b) => b[1] - a[1])[0]
    const purpleCap = Object.entries(bowlerWickets).sort((a, b) => b[1] - a[1])[0]

    // Official total match counts per IPL season (league + playoffs)
    const OFFICIAL_MATCH_COUNTS: Record<string, number> = {
      '2008': 59, '2009': 57, '2010': 60, '2011': 74, '2012': 76, '2013': 76,
      '2014': 60, '2015': 60, '2016': 60, '2017': 60, '2018': 60, '2019': 60,
      '2020': 60, '2021': 60, '2022': 74, '2023': 74, '2024': 74, '2025': 74,
    }
    const officialCount = OFFICIAL_MATCH_COUNTS[season]
    const isCompleted = officialCount ? matchList.length >= officialCount - 3 : matchList.length >= 50

    seasons.push({
      year: season,
      winner: isCompleted ? finalMatch?.winner : undefined,
      runnerUp: isCompleted ? finalLoser : undefined,
      isOngoing: !isCompleted && parseInt(season) >= 2026,
      matchCount: officialCount || matchList.length,
      matchesWithData: matchList.length,
      teams: Array.from(teams).sort(),
      orangeCap: orangeCap ? { player: enrichPlayer(orangeCap[0]).fullName, shortName: orangeCap[0], runs: orangeCap[1] } : undefined,
      purpleCap: purpleCap ? { player: enrichPlayer(purpleCap[0]).fullName, shortName: purpleCap[0], wickets: purpleCap[1] } : undefined,
    })
  }

  return seasons.sort((a, b) => a.year.localeCompare(b.year))
}

// ── Step 8: Build Venues ──

function buildVenues(matches: CricSheetMatch[]) {
  const venueMap: Record<string, {
    name: string; city: string; matchCount: number
    firstInningsScores: number[]; secondInningsScores: number[]
  }> = {}

  for (const match of matches) {
    const venue = normalizeVenue(match.info.venue || 'Unknown')
    const city = getVenueCity(venue, match.info.city || '')
    if (!venueMap[venue]) {
      venueMap[venue] = {
        name: venue,
        city,
        matchCount: 0,
        firstInningsScores: [],
        secondInningsScores: [],
      }
    }
    venueMap[venue].matchCount++

    // Calculate innings scores
    for (let i = 0; i < (match.innings || []).length; i++) {
      let runs = 0
      for (const ov of match.innings[i].overs || []) {
        for (const del of ov.deliveries) {
          runs += del.runs.total
        }
      }
      if (i === 0) venueMap[venue].firstInningsScores.push(runs)
      if (i === 1) venueMap[venue].secondInningsScores.push(runs)
    }
  }

  return Object.values(venueMap).map(v => ({
    name: v.name,
    city: v.city,
    matchCount: v.matchCount,
    avgFirstInningsScore: v.firstInningsScores.length > 0
      ? Math.round(v.firstInningsScores.reduce((a, b) => a + b, 0) / v.firstInningsScores.length)
      : 0,
    avgSecondInningsScore: v.secondInningsScores.length > 0
      ? Math.round(v.secondInningsScores.reduce((a, b) => a + b, 0) / v.secondInningsScores.length)
      : 0,
  })).sort((a, b) => b.matchCount - a.matchCount)
}

// ── Step 9: Compute Player Career Stats ──

function computePlayerStats(matches: CricSheetMatch[], players: Record<string, any>) {
  const stats: Record<string, any> = {}
  const registry_all: Record<string, string> = {} // name → id

  // Build a name-to-id lookup
  for (const match of matches) {
    const reg = match.info.registry?.people || {}
    for (const [name, id] of Object.entries(reg)) {
      registry_all[name] = id
    }
  }

  // Initialize all players
  for (const [id, p] of Object.entries(players)) {
    stats[id] = {
      playerId: id,
      playerName: p.name,
      matches: 0,
      innings: { bat: 0, bowl: 0 },
      runs: 0, ballsFaced: 0, fours: 0, sixes: 0,
      highScore: 0, highScoreNotOut: false,
      fifties: 0, hundreds: 0, ducks: 0, notOuts: 0,
      wickets: 0, ballsBowled: 0, runsConceded: 0,
      bestBowlingWickets: 0, bestBowlingRuns: 999,
      threeWickets: 0, fiveWickets: 0,
      maidens: 0, dotsBowled: 0,
      catches: 0, stumpings: 0, runOuts: 0,
      _matchIds: new Set<string>(),
    }
  }

  for (const match of matches) {
    const fileId = (match as any)._fileId
    const reg = match.info.registry?.people || {}

    // Mark all playing XI as having played this match
    for (const plist of Object.values(match.info.players)) {
      for (const name of plist) {
        const id = reg[name] || registry_all[name]
        if (id && stats[id] && !stats[id]._matchIds.has(fileId)) {
          stats[id]._matchIds.add(fileId)
          stats[id].matches++
        }
      }
    }

    for (let innIdx = 0; innIdx < (match.innings || []).length; innIdx++) {
      const inn = match.innings[innIdx]

      // Per-innings batting
      const batterInnings: Record<string, { runs: number; balls: number; fours: number; sixes: number; out: boolean }> = {}
      // Per-innings bowling
      const bowlerInnings: Record<string, { balls: number; runs: number; wickets: number; maidens: number; dots: number }> = {}

      for (const ov of inn.overs || []) {
        let overRuns = 0
        let overLegalBalls = 0
        let overBowler = ''

        for (const del of ov.deliveries) {
          const batterId = reg[del.batter] || registry_all[del.batter]
          const bowlerId = reg[del.bowler] || registry_all[del.bowler]
          overBowler = bowlerId || ''

          // Batting
          if (batterId) {
            if (!batterInnings[batterId]) {
              batterInnings[batterId] = { runs: 0, balls: 0, fours: 0, sixes: 0, out: false }
            }
            if (!del.extras?.wides) batterInnings[batterId].balls++
            batterInnings[batterId].runs += del.runs.batter
            if (del.runs.batter === 4) batterInnings[batterId].fours++
            if (del.runs.batter === 6) batterInnings[batterId].sixes++
          }

          // Bowling
          if (bowlerId) {
            if (!bowlerInnings[bowlerId]) {
              bowlerInnings[bowlerId] = { balls: 0, runs: 0, wickets: 0, maidens: 0, dots: 0 }
            }
            const isWide = !!del.extras?.wides
            const isNoball = !!del.extras?.noballs
            if (!isWide && !isNoball) {
              bowlerInnings[bowlerId].balls++
              overLegalBalls++
            }
            const byeRuns = (del.extras?.byes || 0) + (del.extras?.legbyes || 0)
            bowlerInnings[bowlerId].runs += del.runs.total - byeRuns
            if (del.runs.total === 0 && !isWide && !isNoball) bowlerInnings[bowlerId].dots++
          }

          // Wickets
          if (del.wickets) {
            for (const w of del.wickets) {
              const outId = reg[w.player_out] || registry_all[w.player_out]
              if (outId && batterInnings[outId]) {
                batterInnings[outId].out = true
              }
              // Bowling wickets
              if (bowlerId && w.kind !== 'run out' && w.kind !== 'retired hurt' && w.kind !== 'retired out') {
                if (bowlerInnings[bowlerId]) bowlerInnings[bowlerId].wickets++
              }
              // Fielding
              if (w.fielders) {
                for (const f of w.fielders) {
                  const fielderId = reg[f.name] || registry_all[f.name]
                  if (fielderId && stats[fielderId]) {
                    if (w.kind === 'caught') stats[fielderId].catches++
                    if (w.kind === 'stumped') stats[fielderId].stumpings++
                    if (w.kind === 'run out') stats[fielderId].runOuts++
                  }
                }
              }
            }
          }
        }

        // Maiden check
        if (overRuns === 0 && overLegalBalls === 6 && overBowler && bowlerInnings[overBowler]) {
          bowlerInnings[overBowler].maidens++
        }
      }

      // Aggregate batting innings
      for (const [id, bi] of Object.entries(batterInnings)) {
        if (!stats[id]) continue
        if (bi.balls > 0 || bi.runs > 0) stats[id].innings.bat++
        stats[id].runs += bi.runs
        stats[id].ballsFaced += bi.balls
        stats[id].fours += bi.fours
        stats[id].sixes += bi.sixes
        if (!bi.out) stats[id].notOuts++
        if (bi.runs === 0 && bi.out && bi.balls > 0) stats[id].ducks++
        if (bi.runs >= 50 && bi.runs < 100) stats[id].fifties++
        if (bi.runs >= 100) stats[id].hundreds++
        if (bi.runs > stats[id].highScore || (bi.runs === stats[id].highScore && !bi.out)) {
          stats[id].highScore = bi.runs
          stats[id].highScoreNotOut = !bi.out
        }
      }

      // Aggregate bowling innings
      for (const [id, bi] of Object.entries(bowlerInnings)) {
        if (!stats[id]) continue
        if (bi.balls > 0) stats[id].innings.bowl++
        stats[id].ballsBowled += bi.balls
        stats[id].runsConceded += bi.runs
        stats[id].wickets += bi.wickets
        stats[id].maidens += bi.maidens
        stats[id].dotsBowled += bi.dots
        if (bi.wickets >= 3) stats[id].threeWickets++
        if (bi.wickets >= 5) stats[id].fiveWickets++
        if (bi.wickets > stats[id].bestBowlingWickets ||
            (bi.wickets === stats[id].bestBowlingWickets && bi.runs < stats[id].bestBowlingRuns)) {
          stats[id].bestBowlingWickets = bi.wickets
          stats[id].bestBowlingRuns = bi.runs
        }
      }
    }
  }

  // Compute derived stats and clean up
  const result: Record<string, any> = {}
  for (const [id, s] of Object.entries(stats)) {
    if (s.matches === 0) continue // Skip players with no match data

    const dismissals = s.innings.bat - s.notOuts
    // s.playerName is already the enriched full name (from extractPlayers)
    // Look up the original CricSheet short name from the players data
    const playerData = players[id]
    const cricsheetName = playerData?.shortName || s.playerName
    const enriched = enrichPlayer(cricsheetName)
    const officialRole = getPlayerRole(cricsheetName, s.playerName)

    // Smart fallback role inference when no official role exists
    let inferredRole = officialRole
    if (!inferredRole) {
      const batInn = s.innings.bat
      const bowlInn = s.innings.bowl
      const stumpings = s.stumpings || 0
      const runs = s.runs
      const wickets = s.wickets

      if (stumpings > 2) {
        inferredRole = 'WK-Batter'
      } else if (bowlInn > batInn * 0.8 && wickets > 10) {
        inferredRole = runs > 500 ? 'All-rounder' : 'Bowler'
      } else if (batInn > 0 && bowlInn > batInn * 0.3 && wickets > 5) {
        inferredRole = 'All-rounder'
      } else if (bowlInn > 0 && wickets > batInn && bowlInn > 5) {
        inferredRole = 'Bowler'
      } else {
        inferredRole = 'Batter'
      }
    }

    result[id] = {
      playerId: id,
      playerName: s.playerName, // Already the full name
      shortName: cricsheetName,
      nicknames: enriched.nicknames,
      role: inferredRole,
      matches: s.matches,
      inningsBat: s.innings.bat,
      inningsBowl: s.innings.bowl,
      runs: s.runs,
      ballsFaced: s.ballsFaced,
      fours: s.fours,
      sixes: s.sixes,
      highScore: s.highScore,
      highScoreNotOut: s.highScoreNotOut,
      battingAvg: dismissals > 0 ? parseFloat((s.runs / dismissals).toFixed(2)) : s.runs > 0 ? s.runs : 0,
      strikeRate: s.ballsFaced > 0 ? parseFloat(((s.runs / s.ballsFaced) * 100).toFixed(2)) : 0,
      fifties: s.fifties,
      hundreds: s.hundreds,
      ducks: s.ducks,
      notOuts: s.notOuts,
      wickets: s.wickets,
      ballsBowled: s.ballsBowled,
      runsConceded: s.runsConceded,
      economy: s.ballsBowled > 0 ? parseFloat(((s.runsConceded / s.ballsBowled) * 6).toFixed(2)) : 0,
      bowlingAvg: s.wickets > 0 ? parseFloat((s.runsConceded / s.wickets).toFixed(2)) : 0,
      bowlingSR: s.wickets > 0 ? parseFloat((s.ballsBowled / s.wickets).toFixed(1)) : 0,
      bestBowling: s.bestBowlingWickets > 0 ? `${s.bestBowlingWickets}/${s.bestBowlingRuns}` : '-',
      threeWickets: s.threeWickets,
      fiveWickets: s.fiveWickets,
      maidens: s.maidens,
      dots: s.dotsBowled,
      catches: s.catches,
      stumpings: s.stumpings,
      runOuts: s.runOuts,
    }
  }
  return result
}

// ── Step 10: Build Player-Teams Mapping ──

function buildPlayerTeams(matches: CricSheetMatch[]) {
  const mapping: Record<string, Array<{ team: string; season: string }>> = {}

  for (const match of matches) {
    const season = normalizeSeason(match.info.season, match.info.dates[0])
    const reg = match.info.registry?.people || {}

    for (const [teamName, playerList] of Object.entries(match.info.players)) {
      const team = normalizeTeam(teamName)
      for (const name of playerList) {
        const id = reg[name] || name.replace(/\s/g, '_').toLowerCase()
        if (!mapping[id]) mapping[id] = []
        const existing = mapping[id].find(e => e.team === team && e.season === season)
        if (!existing) {
          mapping[id].push({ team, season })
        }
      }
    }
  }

  return mapping
}

// ── Step 11: Build Cap Race ──

function buildCapRace(matches: CricSheetMatch[]): Record<string, any> {
  // Group matches by season, sorted by date
  const bySeason: Record<string, CricSheetMatch[]> = {}
  for (const match of matches) {
    const season = normalizeSeason(match.info.season, match.info.dates[0])
    if (!bySeason[season]) bySeason[season] = []
    bySeason[season].push(match)
  }

  const result: Record<string, any> = {}

  for (const [season, seasonMatches] of Object.entries(bySeason)) {
    // Sort matches by date, then by match number
    const sorted = [...seasonMatches].sort((a, b) => {
      const dateCmp = (a.info.dates[0] || '').localeCompare(b.info.dates[0] || '')
      if (dateCmp !== 0) return dateCmp
      return (a.info.event?.match_number || 0) - (b.info.event?.match_number || 0)
    })

    // Collect unique match dates (one entry per match)
    const matchDates: string[] = []
    // Track cumulative runs per batter and wickets per bowler
    const batterCumulative: Record<string, number[]> = {}
    const bowlerCumulative: Record<string, number[]> = {}

    for (const match of sorted) {
      const date = match.info.dates[0] || ''
      matchDates.push(date)

      // Calculate runs per batter and wickets per bowler for this match
      const matchBatterRuns: Record<string, number> = {}
      const matchBowlerWickets: Record<string, number> = {}

      for (const inn of match.innings || []) {
        for (const ov of inn.overs || []) {
          for (const del of ov.deliveries) {
            matchBatterRuns[del.batter] = (matchBatterRuns[del.batter] || 0) + del.runs.batter
            if (del.wickets) {
              for (const w of del.wickets) {
                if (w.kind !== 'run out' && w.kind !== 'retired hurt' && w.kind !== 'retired out') {
                  matchBowlerWickets[del.bowler] = (matchBowlerWickets[del.bowler] || 0) + 1
                }
              }
            }
          }
        }
      }

      // Update cumulative batting totals
      const allBatters = new Set([...Object.keys(batterCumulative), ...Object.keys(matchBatterRuns)])
      for (const batter of allBatters) {
        if (!batterCumulative[batter]) {
          // Backfill with zeros for previous matches
          batterCumulative[batter] = new Array(matchDates.length - 1).fill(0)
        }
        const prev = batterCumulative[batter].length > 0
          ? batterCumulative[batter][batterCumulative[batter].length - 1]
          : 0
        batterCumulative[batter].push(prev + (matchBatterRuns[batter] || 0))
      }

      // Update cumulative bowling totals
      const allBowlers = new Set([...Object.keys(bowlerCumulative), ...Object.keys(matchBowlerWickets)])
      for (const bowler of allBowlers) {
        if (!bowlerCumulative[bowler]) {
          bowlerCumulative[bowler] = new Array(matchDates.length - 1).fill(0)
        }
        const prev = bowlerCumulative[bowler].length > 0
          ? bowlerCumulative[bowler][bowlerCumulative[bowler].length - 1]
          : 0
        bowlerCumulative[bowler].push(prev + (matchBowlerWickets[bowler] || 0))
      }
    }

    // Get top 10 batters by final total
    const topBatters = Object.entries(batterCumulative)
      .map(([player, progression]) => ({
        player,
        progression,
        total: progression[progression.length - 1] || 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)

    // Get top 10 bowlers by final total
    const topBowlers = Object.entries(bowlerCumulative)
      .map(([player, progression]) => ({
        player,
        progression,
        total: progression[progression.length - 1] || 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10)

    result[season] = {
      batting: topBatters.map(b => ({ player: b.player, progression: b.progression })),
      bowling: topBowlers.map(b => ({ player: b.player, progression: b.progression })),
      matchDates,
    }
  }

  return result
}

// ── Step 12: Write Output ──

function writeOutput(data: {
  players: Record<string, any>
  teams: any[]
  matchesBySeason: Record<string, any[]>
  batting: Record<string, any[]>
  bowling: Record<string, any[]>
  bbb: Record<string, any[]>
  partnerships: Record<string, any[]>
  seasons: any[]
  venues: any[]
  playerStats: Record<string, any>
  playerTeams: Record<string, any>
  capRace: Record<string, any>
}) {
  // Ensure directories
  ensureDir(OUT_DIR)
  ensureDir(path.join(OUT_DIR, 'matches'))
  ensureDir(path.join(OUT_DIR, 'scorecards'))
  ensureDir(path.join(OUT_DIR, 'bbb'))
  ensureDir(path.join(OUT_DIR, 'partnerships'))
  ensureDir(path.join(OUT_DIR, 'cap-race'))

  // Merge roles from playerStats into players (playerStats has better inference with actual stats)
  const statsRoles: Record<string, string> = {}
  for (const s of Object.values(data.playerStats) as any[]) {
    if (s.role) statsRoles[s.playerId] = s.role
  }
  for (const p of Object.values(data.players) as any[]) {
    if (!p.role && statsRoles[p.id]) {
      p.role = statsRoles[p.id]
    }
  }

  // Players
  const playersArray = Object.values(data.players)
  fs.writeFileSync(path.join(OUT_DIR, 'players.json'), JSON.stringify(playersArray))
  console.log(`   ✓ players.json (${playersArray.length} players, ${fileSize(path.join(OUT_DIR, 'players.json'))})`)

  // Players index (lightweight for search)
  const playersIndex = playersArray.map(p => ({
    id: p.id, name: p.name, shortName: p.shortName, nicknames: p.nicknames, role: p.role, teams: p.teams, lastTeam: p.lastTeam, status: p.status,
  }))
  fs.writeFileSync(path.join(OUT_DIR, 'players-index.json'), JSON.stringify(playersIndex))
  console.log(`   ✓ players-index.json (${fileSize(path.join(OUT_DIR, 'players-index.json'))})`)

  // Teams
  fs.writeFileSync(path.join(OUT_DIR, 'teams.json'), JSON.stringify(data.teams))
  console.log(`   ✓ teams.json (${data.teams.length} teams)`)

  // Matches by season
  for (const [season, matches] of Object.entries(data.matchesBySeason)) {
    const fpath = path.join(OUT_DIR, 'matches', `season-${season}.json`)
    fs.writeFileSync(fpath, JSON.stringify(matches))
    console.log(`   ✓ matches/season-${season}.json (${matches.length} matches, ${fileSize(fpath)})`)
  }

  // Scorecards by season
  for (const [season, entries] of Object.entries(data.batting)) {
    const fpath = path.join(OUT_DIR, 'scorecards', `batting-${season}.json`)
    fs.writeFileSync(fpath, JSON.stringify(entries))
    console.log(`   ✓ scorecards/batting-${season}.json (${entries.length} entries, ${fileSize(fpath)})`)
  }
  for (const [season, entries] of Object.entries(data.bowling)) {
    const fpath = path.join(OUT_DIR, 'scorecards', `bowling-${season}.json`)
    fs.writeFileSync(fpath, JSON.stringify(entries))
    console.log(`   ✓ scorecards/bowling-${season}.json (${entries.length} entries, ${fileSize(fpath)})`)
  }

  // Ball-by-ball by season (compressed keys)
  for (const [season, entries] of Object.entries(data.bbb)) {
    const fpath = path.join(OUT_DIR, 'bbb', `season-${season}.json`)
    fs.writeFileSync(fpath, JSON.stringify(entries))
    console.log(`   ✓ bbb/season-${season}.json (${entries.length} deliveries, ${fileSize(fpath)})`)
  }

  // Partnerships by season
  for (const [season, entries] of Object.entries(data.partnerships)) {
    const fpath = path.join(OUT_DIR, 'partnerships', `season-${season}.json`)
    fs.writeFileSync(fpath, JSON.stringify(entries))
    console.log(`   ✓ partnerships/season-${season}.json (${entries.length} entries)`)
  }

  // Cap race by season
  for (const [season, capRaceData] of Object.entries(data.capRace)) {
    const fpath = path.join(OUT_DIR, 'cap-race', `season-${season}.json`)
    fs.writeFileSync(fpath, JSON.stringify(capRaceData))
    console.log(`   ✓ cap-race/season-${season}.json (${fileSize(fpath)})`)
  }

  // Seasons
  fs.writeFileSync(path.join(OUT_DIR, 'seasons.json'), JSON.stringify(data.seasons))
  console.log(`   ✓ seasons.json (${data.seasons.length} seasons)`)

  // Venues
  fs.writeFileSync(path.join(OUT_DIR, 'venues.json'), JSON.stringify(data.venues))
  console.log(`   ✓ venues.json (${data.venues.length} venues)`)

  // Player career stats
  const statsArray = Object.values(data.playerStats)
  fs.writeFileSync(path.join(OUT_DIR, 'player-stats.json'), JSON.stringify(statsArray))
  console.log(`   ✓ player-stats.json (${statsArray.length} players, ${fileSize(path.join(OUT_DIR, 'player-stats.json'))})`)

  // Player-teams mapping
  fs.writeFileSync(path.join(OUT_DIR, 'player-teams.json'), JSON.stringify(data.playerTeams))
  console.log(`   ✓ player-teams.json`)

  // Official IPL 2026 squads
  if (Object.keys(OFFICIAL_SQUADS).length > 0) {
    fs.writeFileSync(path.join(OUT_DIR, 'squads-2026.json'), JSON.stringify(OFFICIAL_SQUADS))
    const totalPlayers = Object.values(OFFICIAL_SQUADS).reduce((sum, t) => sum + t.players.length, 0)
    console.log(`   ✓ squads-2026.json (${Object.keys(OFFICIAL_SQUADS).length} teams, ${totalPlayers} players)`)
  }
}

function fileSize(fpath: string): string {
  const bytes = fs.statSync(fpath).size
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

// ── Step 12: Generate Manifest ──

function generateManifest() {
  const manifest: any = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    files: {},
  }

  function walkDir(dir: string, prefix: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      if (entry.isDirectory()) {
        walkDir(path.join(dir, entry.name), `${prefix}${entry.name}/`)
      } else if (entry.name.endsWith('.json')) {
        const fpath = path.join(dir, entry.name)
        const stat = fs.statSync(fpath)
        manifest.files[`${prefix}${entry.name}`] = {
          size: stat.size,
          modified: stat.mtime.toISOString(),
        }
      }
    }
  }

  walkDir(OUT_DIR, '')
  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2))
  console.log(`   ✓ manifest.json`)
}

// ── Run ──
main().catch(err => {
  console.error('❌ Pipeline failed:', err)
  process.exit(1)
})
