// Team detail page (/teams/:id).
// Franchise hub: identity / history, current squad, coaching staff, all-
// time records, season-by-season W/L, head-to-head vs other teams, SWOT
// analysis, logo evolution, and home venues.
import { useParams, Link } from 'react-router-dom'
import { useMemo, useState, useEffect, useCallback } from 'react'
import { useTeams, useSeasons, usePlayerStats, usePlayerTeams, useSwotAnalysis, useOfficialSquads, usePlayers, useCoaches, usePlayerPhotos, useCoachPhotos, useTeamPlayerStats, useReplacementPlayers } from '@/hooks/useData'
import { dataService } from '@/services/dataService'
import Breadcrumb from '@/components/ui/Breadcrumb'
import TeamBadge from '@/components/ui/TeamBadge'
import Avatar from '@/components/ui/Avatar'
import OverseasBadge from '@/components/ui/OverseasBadge'
import { buildOverseasLookup, isOverseasPlayer } from '@/lib/nationality'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { TEAM_COLORS, TEAM_SHORT, getFranchiseLogoEvolution } from '@/lib/constants'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from 'recharts'

const TABS = ['Overview', 'Squad', 'Stats', 'Season History', 'SWOT'] as const
type Tab = typeof TABS[number]

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

const LATEST_SEASON = '2026'

// Map official squad JSON roles to internal role names
const OFFICIAL_ROLE_MAP: Record<string, string> = {
  'Batter': 'Batter',
  'Bowler': 'Bowler',
  'All-Rounder': 'All-rounder',
  'All-rounder': 'All-rounder',
  'WK-Batter': 'WK-Batter',
  'WK': 'WK',
}

const ROLE_ORDER = ['Batter', 'All-rounder', 'WK-Batter', 'WK', 'Bowler', 'Unknown'] as const

const ROLE_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  Batter: { bg: 'bg-blue-500/15', text: 'text-blue-400', border: 'border-blue-500/30' },
  Bowler: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'All-rounder': { bg: 'bg-orange-500/15', text: 'text-orange-400', border: 'border-orange-500/30' },
  'WK-Batter': { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  WK: { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  Unknown: { bg: 'bg-zinc-500/15', text: 'text-zinc-400', border: 'border-zinc-500/30' },
}

export default function TeamDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: teams } = useTeams()
  const { data: seasons } = useSeasons()
  const { data: playerStats } = usePlayerStats()
  const { data: playerTeams } = usePlayerTeams()
  const { data: officialSquads } = useOfficialSquads()
  const { data: replacementPlayers } = useReplacementPlayers()
  const { data: allPlayers } = usePlayers()
  const { data: coaches } = useCoaches()
  const { data: playerPhotos } = usePlayerPhotos()
  const { data: coachPhotos } = useCoachPhotos()
  const [squadNameMapping, setSquadNameMapping] = useState<Record<string, string>>({})

  // Load squad name mapping
  useEffect(() => {
    dataService.getSquadNameMapping().then(setSquadNameMapping).catch(() => {})
  }, [])

  // Name → player ID lookup. Order matters: nicknames + shortName + name from
  // players.json provide the safety net; the curated squad-name-mapping wins
  // last so explicit overrides take precedence over collisions.
  const playerIdLookup = useMemo(() => {
    const lookup: Record<string, string> = {}
    if (allPlayers) {
      for (const p of allPlayers) {
        for (const n of (p.nicknames || []) as string[]) {
          if (n) lookup[n.toLowerCase()] = p.id
        }
        if (p.shortName) lookup[p.shortName.toLowerCase()] = p.id
        if (p.name) lookup[p.name.toLowerCase()] = p.id
      }
    }
    for (const [name, id] of Object.entries(squadNameMapping)) {
      lookup[name.toLowerCase()] = id
    }
    return lookup
  }, [allPlayers, squadNameMapping])

  // ID → canonical CricSheet shortname. Stats/scorecards/BBB are keyed by
  // shortName (e.g. "JC Buttler"), not the friendly squad name ("Jos Buttler").
  // Resolving squad → ID → shortName is what closes the loop on stats.
  const playerShortNameById = useMemo(() => {
    const map: Record<string, string> = {}
    if (allPlayers) {
      for (const p of allPlayers) {
        if (p.id) map[p.id] = (p.shortName || p.name || '').trim()
      }
    }
    return map
  }, [allPlayers])

  // Resolve any squad/friendly name to the CricSheet shortname used as the
  // key in teamStatsByName / teamSeasonStatsByName. Falls back to the
  // input itself if no mapping exists, so untouched names still try.
  const resolveStatsKey = useCallback(
    (anyName: string | undefined | null): string => {
      if (!anyName) return ''
      const id = playerIdLookup[anyName.toLowerCase().trim()]
      if (!id) return anyName.toLowerCase().trim()
      const sn = playerShortNameById[id]
      return (sn || anyName).toLowerCase().trim()
    },
    [playerIdLookup, playerShortNameById]
  )
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [swotSeason, setSwotSeason] = useState<string>('')
  const [squadSeason, setSquadSeason] = useLocalStorage<string>('ipl-team-squad-season', '')
  const [squadMode, setSquadMode] = useState<'season' | 'alltime'>('season')

  const team = useMemo(() => teams?.find(t => t.id === id), [teams, id])

  // Build player-to-seasons map for this team
  const teamPlayerMap = useMemo(() => {
    if (!playerTeams || !team) return {} as Record<string, string[]>
    const map: Record<string, string[]> = {}
    for (const [pid, entries] of Object.entries(playerTeams)) {
      for (const e of entries as any[]) {
        if (e.team === team.name || team.aliases?.includes(e.team)) {
          if (!map[pid]) map[pid] = []
          map[pid].push(e.season)
        }
      }
    }
    return map
  }, [playerTeams, team])

  // ── Team-scoped stats for the Stats tab ──
  // Stats are filtered to innings where the player represented THIS franchise.
  const teamNamesForStats = useMemo(() => {
    if (!team) return [] as string[]
    return [team.name, ...(team.aliases || [])]
  }, [team])

  const teamSeasonsForStats = useMemo(() => {
    return team?.seasons?.map(String) || []
  }, [team])

  // Always-on: Squad, Overview Key Players, and the Stats tab all need
  // these numbers. Without this, those rows leak career totals across
  // every team the player has ever appeared for.
  const { data: teamScopedStats = [] } = useTeamPlayerStats(
    teamNamesForStats,
    teamSeasonsForStats,
  )

  const teamStatsByName = useMemo(() => {
    const map: Record<string, typeof teamScopedStats[number]> = {}
    for (const row of teamScopedStats) {
      if (row.playerName) map[row.playerName.toLowerCase()] = row
    }
    return map
  }, [teamScopedStats])

  // Replace career numeric fields on a global player row with this team's
  // contribution only. Missing rows mean the player never played a recorded
  // ball for this franchise → all-zeros, which is the truthful display.
  //
  // Lookup MUST key by shortName (e.g. "RG Sharma"), not the full registry
  // name ("Rohit Gurunath Sharma"). The runtime aggregator (getTeamPlayerStats)
  // reads scorecards which are keyed by shortName, while playerStats stores
  // both — so we read shortName off the row to bridge the two.
  const withTeamScope = useCallback(
    <T extends { playerName?: string; shortName?: string }>(row: T): T & {
      matches: number; runs: number; wickets: number;
      battingAvg: number | string; strikeRate: number | string;
      economy: number | string; bowlingAvg: number | string;
      bestBowling: string; highScore: number; highScoreNotOut: boolean;
      fours: number; sixes: number;
      ballsBowled: number; bowlingStrikeRate: number;
    } => {
      const key = (row.shortName || row.playerName || '').toLowerCase()
      const t = key ? teamStatsByName[key] : undefined
      const balls = t?.ballsBowled ?? 0
      const wkts = t?.wickets ?? 0
      // Bowling strike rate = balls per wicket. Undefined when no wickets.
      const bsr = wkts > 0 ? Math.round((balls / wkts) * 100) / 100 : 0
      return {
        ...row,
        matches: t?.matches ?? 0,
        runs: t?.runs ?? 0,
        wickets: wkts,
        battingAvg: t?.battingAvg ?? 0,
        strikeRate: t?.strikeRate ?? 0,
        economy: t?.economy ?? 0,
        bowlingAvg: t?.bowlingAvg ?? 0,
        bestBowling: t?.bestBowling ?? '-',
        highScore: t?.highScore ?? 0,
        highScoreNotOut: t?.highScoreNotOut ?? false,
        fours: t?.fours ?? 0,
        sixes: t?.sixes ?? 0,
        ballsBowled: balls,
        bowlingStrikeRate: bsr,
      }
    },
    [teamStatsByName]
  )

  const teamStatsRunScorers = useMemo(() => {
    return [...teamScopedStats]
      .filter(r => r.innings > 0)
      .map(r => ({
        ...r,
        playerId: playerIdLookup[r.playerName.toLowerCase()] || null,
      }))
      .sort((a, b) => b.runs - a.runs)
  }, [teamScopedStats, playerIdLookup])

  const teamStatsWicketTakers = useMemo(() => {
    return [...teamScopedStats]
      .filter(r => r.wickets > 0 || r.ballsBowled > 0)
      .map(r => ({
        ...r,
        playerId: playerIdLookup[r.playerName.toLowerCase()] || null,
      }))
      .sort((a, b) => b.wickets - a.wickets)
  }, [teamScopedStats, playerIdLookup])

  // Titles won
  const titles = useMemo(() => {
    if (!seasons || !team) return []
    return seasons.filter(s =>
      s.winner === team.name || team.aliases?.some((a: string) => a === s.winner)
    )
  }, [seasons, team])

  // Season history for this team
  const seasonHistory = useMemo(() => {
    if (!seasons || !team) return []
    return seasons
      .filter(s => s.teams?.includes(team.name) || team.aliases?.some((a: string) => s.teams?.includes(a)))
      .sort((a, b) => Number(b.year) - Number(a.year))
  }, [seasons, team])

  // Key players: those who appeared in most recent season, sorted by their
  // runs FOR THIS TEAM (not career runs).
  const keyPlayers = useMemo(() => {
    if (!team) return []
    const latestSeason = team.seasons?.[team.seasons.length - 1]
    if (!latestSeason) return []
    const ids = Object.entries(teamPlayerMap)
      .filter(([, seasons]) => seasons.includes(latestSeason))
      .map(([pid]) => pid)
    return (playerStats || [])
      .filter(s => ids.includes(s.playerId))
      .map(withTeamScope)
      .sort((a, b) => b.runs - a.runs)
      .slice(0, 12)
  }, [team, teamPlayerMap, playerStats, withTeamScope])

  // Available seasons for this team
  const teamSeasons = useMemo(() => {
    if (!team?.seasons) return [] as string[]
    return [...team.seasons].map(String).sort((a, b) => Number(b) - Number(a))
  }, [team])

  // Effective squad season (default to latest)
  const effectiveSquadSeason = squadSeason || teamSeasons[0] || ''

  // Season-scoped stats for the Squad tab when a single season is selected.
  // In season mode the user wants each row to reflect that player's runs/
  // wickets for THIS team in THAT season — not their tenure-with-team total.
  const { data: teamSeasonScopedStats = [] } = useTeamPlayerStats(
    teamNamesForStats,
    effectiveSquadSeason ? [effectiveSquadSeason] : [],
    squadMode === 'season' && !!effectiveSquadSeason,
  )

  const teamSeasonStatsByName = useMemo(() => {
    const map: Record<string, typeof teamSeasonScopedStats[number]> = {}
    for (const row of teamSeasonScopedStats) {
      if (row.playerName) map[row.playerName.toLowerCase()] = row
    }
    return map
  }, [teamSeasonScopedStats])

  const withTeamSeasonScope = useCallback(
    <T extends { playerName?: string; shortName?: string }>(row: T): T & {
      matches: number; runs: number; wickets: number;
      battingAvg: number | string; strikeRate: number | string;
      economy: number | string; bowlingAvg: number | string;
      bestBowling: string; highScore: number; highScoreNotOut: boolean;
      fours: number; sixes: number;
      ballsBowled: number; bowlingStrikeRate: number;
    } => {
      const key = (row.shortName || row.playerName || '').toLowerCase()
      const t = key ? teamSeasonStatsByName[key] : undefined
      const balls = t?.ballsBowled ?? 0
      const wkts = t?.wickets ?? 0
      const bsr = wkts > 0 ? Math.round((balls / wkts) * 100) / 100 : 0
      return {
        ...row,
        matches: t?.matches ?? 0,
        runs: t?.runs ?? 0,
        wickets: wkts,
        battingAvg: t?.battingAvg ?? 0,
        strikeRate: t?.strikeRate ?? 0,
        economy: t?.economy ?? 0,
        bowlingAvg: t?.bowlingAvg ?? 0,
        bestBowling: t?.bestBowling ?? '-',
        highScore: t?.highScore ?? 0,
        highScoreNotOut: t?.highScoreNotOut ?? false,
        fours: t?.fours ?? 0,
        sixes: t?.sixes ?? 0,
        ballsBowled: balls,
        bowlingStrikeRate: bsr,
      }
    },
    [teamSeasonStatsByName]
  )

  // Squad: players filtered by selected season, grouped by role.
  // - alltime mode  → team-career stats (every season this player wore the colors)
  // - season mode   → team+season stats (only the chosen year)
  const squadPlayers = useMemo(() => {
    if (!playerStats || !team) return []
    if (squadMode === 'alltime') {
      const playerIds = new Set(Object.keys(teamPlayerMap))
      return playerStats
        .filter(s => playerIds.has(s.playerId))
        .map(withTeamScope)
        .sort((a, b) => b.runs - a.runs)
    }
    const seasonPlayerIds = Object.entries(teamPlayerMap)
      .filter(([, seasons]) => seasons.includes(effectiveSquadSeason))
      .map(([pid]) => pid)
    return playerStats
      .filter(s => seasonPlayerIds.includes(s.playerId))
      .map(withTeamSeasonScope)
      .sort((a, b) => b.runs - a.runs)
  }, [playerStats, team, teamPlayerMap, squadMode, effectiveSquadSeason, withTeamScope, withTeamSeasonScope])

  // Group squad by role
  const squadByRole = useMemo(() => {
    const groups: Record<string, any[]> = {}
    for (const role of ROLE_ORDER) groups[role] = []
    for (const p of squadPlayers) {
      const role = inferRole(p, p.role)
      if (!groups[role]) groups[role] = []
      groups[role].push(p)
    }
    return groups
  }, [squadPlayers])

  // Check if current squad season is latest (2026) — use official squad data
  const isOfficialSquadSeason = effectiveSquadSeason === LATEST_SEASON && squadMode === 'season'

  // Resolve official squad for this team (try name then aliases)
  const officialTeamSquad = useMemo(() => {
    if (!officialSquads || !team) return null
    const direct = officialSquads[team.name]
    if (direct) return direct
    // Try aliases
    for (const alias of team.aliases || []) {
      if (officialSquads[alias]) return officialSquads[alias]
    }
    return null
  }, [officialSquads, team])

  // Mid-season replacements for this franchise this season. We tag existing
  // squad rows so users can see who came in for whom, AND we append any
  // replacement that isn't on the official roster yet (sometimes the curated
  // squads file lags behind a BCCI announcement).
  const replacementsForTeam = useMemo(() => {
    if (!replacementPlayers || !team || effectiveSquadSeason !== LATEST_SEASON) return [] as any[]
    const seasonList = replacementPlayers[effectiveSquadSeason] || []
    if (!Array.isArray(seasonList)) return [] as any[]
    const aliases = new Set([team.name, ...(team.aliases || [])])
    return seasonList.filter((r: any) => aliases.has(r.team))
  }, [replacementPlayers, team, effectiveSquadSeason])

  // Build official squad grouped by role. Numeric stats reflect this player's
  // contribution TO THIS FRANCHISE only — team-scoped, not career totals.
  // `isNewSigning` marks a player with no prior recorded ball for this team,
  // which is the precise meaning of "new to the franchise".
  const officialSquadByRole = useMemo(() => {
    if (!officialTeamSquad) return {} as Record<string, any[]>
    const groups: Record<string, any[]> = {}
    for (const role of ROLE_ORDER) groups[role] = []

    // Index replacements by incoming-player name for quick tag-up.
    const replacementByName: Record<string, any> = {}
    for (const r of replacementsForTeam) {
      if (r?.player) replacementByName[r.player.toLowerCase()] = r
    }

    const seenNames = new Set<string>()
    for (const player of officialTeamSquad.players) {
      const normalizedRole = OFFICIAL_ROLE_MAP[player.role] || player.role || 'Unknown'
      const groupKey = groups[normalizedRole] ? normalizedRole : 'Unknown'
      const playerId = playerIdLookup[player.name.toLowerCase()] || null
      // Stats are keyed by CricSheet shortname (e.g. "Mohammed Shami") while
      // the squad lists the friendly form ("Mohammad Shami"). Round-trip via
      // the player ID to get the right key.
      const statsKey = resolveStatsKey(player.name)
      const teamRow = teamSeasonStatsByName[statsKey] || null
      const replacement = replacementByName[player.name.toLowerCase()] || null
      groups[groupKey].push({
        ...player,
        normalizedRole,
        stats: teamRow,
        playerId,
        isNewSigning: !teamRow,
        replacement,
      })
      seenNames.add(player.name.toLowerCase())
    }

    // Append any replacement that wasn't listed in the official squad. The
    // curated squad JSON sometimes trails a BCCI announcement by days; missing
    // them entirely is worse than parking them in "Unknown" until the squad
    // file catches up.
    for (const r of replacementsForTeam) {
      const name = r?.player
      if (!name || seenNames.has(name.toLowerCase())) continue
      const playerId = playerIdLookup[name.toLowerCase()] || null
      const statsKey = resolveStatsKey(name)
      const teamRow = teamSeasonStatsByName[statsKey] || null
      groups['Unknown'].push({
        name,
        role: 'Unknown',
        normalizedRole: 'Unknown',
        stats: teamRow,
        playerId,
        isNewSigning: !teamRow,
        replacement: r,
      })
    }
    return groups
  }, [officialTeamSquad, teamSeasonStatsByName, playerIdLookup, resolveStatsKey, replacementsForTeam])

  // Count total official squad players (incl. mid-season replacements that
  // were appended above; the curated officialTeamSquad.players list alone
  // would understate the active roster).
  const officialSquadCount = useMemo(() => {
    return Object.values(officialSquadByRole).reduce((sum, list) => sum + (list?.length || 0), 0)
  }, [officialSquadByRole])

  // Overseas lookup used to render the aeroplane badge next to foreign players
  const overseasLookup = useMemo(() => buildOverseasLookup(officialSquads), [officialSquads])

  // Support staff for the currently-selected squad season.
  // Filters coaches.json by team (with alias handling for rebrands) + season.
  const supportStaffForSeason = useMemo(() => {
    if (!coaches || !team || !effectiveSquadSeason || squadMode !== 'season') return [] as any[]
    const teamAliases: Record<string, string[]> = {
      'Delhi Capitals': ['Delhi Capitals', 'Delhi Daredevils'],
      'Punjab Kings': ['Punjab Kings', 'Kings XI Punjab'],
      'Royal Challengers Bengaluru': ['Royal Challengers Bengaluru', 'Royal Challengers Bangalore'],
    }
    const aliases = teamAliases[team.name] || [team.name]
    const roleOrder = [
      'head-coach', 'assistant-coach', 'director-of-cricket', 'mentor',
      'batting-coach', 'bowling-coach', 'fast-bowling-coach', 'spin-bowling-coach',
      'bowling-consultant', 'fielding-coach', 'strength-conditioning',
      'physio', 'trainer', 'analyst', 'team-manager',
    ]
    const results: { coach: any; tenure: any; role: string }[] = []
    for (const c of coaches) {
      for (const t of c.tenures) {
        if (aliases.includes(t.team) && Array.isArray(t.seasons) && t.seasons.includes(effectiveSquadSeason)) {
          results.push({ coach: c, tenure: t, role: t.role })
          break
        }
      }
    }
    results.sort((a, b) => {
      const ai = roleOrder.indexOf(a.role)
      const bi = roleOrder.indexOf(b.role)
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi) ||
        a.coach.name.localeCompare(b.coach.name)
    })
    return results
  }, [coaches, team, effectiveSquadSeason, squadMode])

  // Human-readable role labels for support staff rendering
  const ROLE_LABEL_MAP: Record<string, string> = {
    'head-coach': 'Head Coach',
    'assistant-coach': 'Assistant Coach',
    'director-of-cricket': 'Director of Cricket',
    'mentor': 'Mentor',
    'batting-coach': 'Batting Coach',
    'bowling-coach': 'Bowling Coach',
    'fast-bowling-coach': 'Fast Bowling Coach',
    'spin-bowling-coach': 'Spin Bowling Coach',
    'bowling-consultant': 'Bowling Consultant',
    'fielding-coach': 'Fielding Coach',
    'strength-conditioning': 'Strength & Conditioning',
    'physio': 'Physiotherapist',
    'trainer': 'Trainer / Team Doctor',
    'analyst': 'Analyst / Scout',
    'team-manager': 'Team Manager / CEO',
  }

  // Initialize swotSeason to latest
  const effectiveSwotSeason = swotSeason || teamSeasons[0] || ''

  // SWOT Analysis hook
  const { data: swotData, isLoading: swotLoading } = useSwotAnalysis(
    team?.name,
    effectiveSwotSeason,
    playerTeams,
    playerStats,
    team?.aliases || []
  )

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-textSecondary">
        Loading team...
      </div>
    )
  }

  const colors = TEAM_COLORS[team.name] || { primary: '#6366f1', secondary: '#333' }
  const short = TEAM_SHORT[team.name] || team.shortName
  // Logo evolution — full chronological history of the franchise's marks,
  // including pre-rebrand variants (e.g. KXIP → Punjab Kings).
  const evolution = getFranchiseLogoEvolution(team.name)

  return (
    <div>
      {/* Team Banner */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, transparent 60%, #0a0a0f 100%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 py-8 sm:py-12 md:py-16 flex flex-col gap-4">
          <Breadcrumb items={[{ label: 'Teams', path: '/teams' }, { label: team.name }]} />
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-5 md:gap-8">
          <TeamBadge
            team={team.name}
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28"
          />
          <div className="min-w-0">
            <h1
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold break-words"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {team.name}
            </h1>
            <p className="text-textSecondary mt-2 text-sm sm:text-base md:text-lg">
              Founded {team.seasons?.[0]} &middot; {team.seasons?.length || 0} seasons
              {team.isDefunct && <span className="text-red-400 ml-2">(Defunct)</span>}
            </p>
            <div className="flex gap-3 mt-4 flex-wrap">
              {titles.length > 0 && (
                <span
                  className="px-3 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    backgroundColor: colors.primary + '20',
                    color: colors.primary,
                    borderColor: colors.primary + '30',
                  }}
                >
                  {titles.length}x Champion{titles.length > 1 ? 's' : ''}
                </span>
              )}
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-card border border-border text-textSecondary">
                {team.homeVenue}
              </span>
              {officialTeamSquad?.captain && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-card border border-border text-textSecondary">
                  Captain: <span className="text-textPrimary font-semibold">{officialTeamSquad.captain}</span>
                </span>
              )}
              {officialTeamSquad?.coach && officialTeamSquad.coach !== 'N/A' && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-card border border-border text-textSecondary">
                  Coach: <span className="text-textPrimary font-semibold">{officialTeamSquad.coach}</span>
                </span>
              )}
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="border-b border-border sticky top-16 z-40 bg-bg/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex gap-0 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm whitespace-nowrap transition-colors ${activeTab === tab ? 'font-semibold border-b-2' : 'text-textSecondary hover:text-textPrimary'}`}
              style={activeTab === tab ? { borderBottomColor: colors.primary, color: colors.primary } : undefined}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 py-5 sm:py-6 space-y-6 sm:space-y-8">
        {activeTab === 'Overview' && (
          <>
            {/* Key Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Franchise Info */}
              <div
                className="md:col-span-2 rounded-2xl border border-border bg-card p-6"
                style={{ boxShadow: `0 0 20px ${colors.primary}10` }}
              >
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
                  Franchise Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8">
                  <div>
                    <div className="text-xs text-textSecondary uppercase tracking-wider mb-1">Founded</div>
                    <div className="font-semibold">{team.seasons?.[0]}</div>
                  </div>
                  <div>
                    <div className="text-xs text-textSecondary uppercase tracking-wider mb-1">Short Name</div>
                    <div className="font-semibold">{short}</div>
                  </div>
                  <div>
                    <div className="text-xs text-textSecondary uppercase tracking-wider mb-1">Home Ground</div>
                    <div className="font-semibold">{team.homeVenue}</div>
                  </div>
                  <div>
                    <div className="text-xs text-textSecondary uppercase tracking-wider mb-1">Seasons Played</div>
                    <div className="font-semibold">{team.seasons?.length || 0}</div>
                  </div>
                  <div>
                    <div className="text-xs text-textSecondary uppercase tracking-wider mb-1">Status</div>
                    <div className="font-semibold">{team.isDefunct ? 'Defunct' : 'Active'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-textSecondary uppercase tracking-wider mb-1">Total Players</div>
                    <div className="font-semibold">{Object.keys(teamPlayerMap).length}</div>
                  </div>
                </div>
              </div>

              {/* Titles Card */}
              <div
                className="rounded-2xl border border-border bg-card p-6 text-center flex flex-col justify-center"
                style={{ boxShadow: `0 0 20px ${colors.primary}10` }}
              >
                <div
                  className="text-6xl font-black mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {titles.length}
                </div>
                <div className="text-textSecondary text-sm font-medium mb-4">
                  IPL Title{titles.length !== 1 ? 's' : ''} Won
                </div>
                {titles.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2">
                    {titles.map(t => (
                      <span
                        key={t.year}
                        className="px-3 py-1 rounded-full text-xs font-bold border"
                        style={{
                          backgroundColor: colors.primary + '15',
                          color: colors.primary,
                          borderColor: colors.primary + '25',
                        }}
                      >
                        {t.year}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Logo Evolution — chronological history of the franchise's
                visual identity, including pre-rebrand variants. Hidden when
                a team has only ever used a single mark (no story to tell). */}
            {evolution.length > 1 && (
              <div>
                <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                  <div className="w-1 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
                  Logo Evolution
                </h2>
                <div className="rounded-2xl border border-border bg-card p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 md:gap-6">
                    {evolution.map((era, i) => (
                      <div
                        key={`${era.path}-${i}`}
                        className="flex flex-col items-center text-center group"
                      >
                        <div
                          className="w-24 h-24 md:w-28 md:h-28 rounded-xl bg-white/[0.04] border border-border flex items-center justify-center p-3 transition-transform group-hover:scale-105"
                          style={{ boxShadow: `0 0 24px ${colors.primary}10` }}
                        >
                          <img
                            src={era.path}
                            alt={`${era.name} logo (${era.from}${era.to >= 9999 ? '-present' : era.to !== era.from ? `-${era.to}` : ''})`}
                            loading="lazy"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="mt-3 text-sm font-bold text-white">
                          {era.from}
                          {era.to >= 9999
                            ? '-Present'
                            : era.to !== era.from
                            ? `-${era.to}`
                            : ''}
                        </div>
                        <div className="text-[11px] text-textSecondary mt-0.5">
                          {era.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Key Players */}
            <div>
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
                Key Players
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                {keyPlayers.slice(0, 6).map(p => {
                  const initials = p.playerName?.split(' ').map((w: string) => w[0]).join('').slice(0, 2) || '??'
                  return (
                    <Link
                      key={p.playerId}
                      to={`/players/${p.playerId}`}
                      className="rounded-xl border border-border bg-card p-4 text-center hover:bg-cardHover transition group"
                    >
                      <div
                        className="w-16 h-16 mx-auto rounded-full border-2 flex items-center justify-center mb-3"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary}15, ${colors.secondary}08)`,
                          borderColor: colors.primary + '30',
                        }}
                      >
                        <span className="text-2xl font-bold" style={{ color: colors.primary }}>
                          {initials}
                        </span>
                      </div>
                      <div className="font-semibold text-sm">{p.playerName}</div>
                      <div className="text-xs text-textSecondary mt-1">
                        {p.runs} runs &middot; {p.wickets} wkts
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {activeTab === 'Squad' && (
          <div className="space-y-5">
            {/* Controls: Season selector + toggle */}
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
                Squad ({isOfficialSquadSeason ? officialSquadCount : squadPlayers.length} players)
                {isOfficialSquadSeason && (
                  <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-accent/15 text-accent border border-accent/30">
                    Official
                  </span>
                )}
              </h2>
              <div className="flex items-center gap-3 ml-auto">
                {/* Mode toggle */}
                <div className="flex items-center bg-card border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setSquadMode('season')}
                    className={`px-4 py-2 text-sm font-medium transition ${
                      squadMode === 'season' ? 'text-white' : 'text-textSecondary hover:text-textPrimary'
                    }`}
                    style={squadMode === 'season' ? { backgroundColor: colors.primary + '30', color: colors.primary } : undefined}
                  >
                    Current Season
                  </button>
                  <button
                    onClick={() => setSquadMode('alltime')}
                    className={`px-4 py-2 text-sm font-medium transition ${
                      squadMode === 'alltime' ? 'text-white' : 'text-textSecondary hover:text-textPrimary'
                    }`}
                    style={squadMode === 'alltime' ? { backgroundColor: colors.primary + '30', color: colors.primary } : undefined}
                  >
                    All Time
                  </button>
                </div>
                {/* Season selector (only when in season mode) */}
                {squadMode === 'season' && (
                  <div className="relative">
                    <select
                      value={effectiveSquadSeason}
                      onChange={e => setSquadSeason(e.target.value)}
                      className="bg-card border border-border rounded-lg px-4 py-2 text-sm font-semibold text-textPrimary appearance-none pr-10 focus:outline-none focus:border-accent cursor-pointer"
                    >
                      {teamSeasons.map(s => (
                        <option key={s} value={s}>IPL {s}</option>
                      ))}
                    </select>
                    <svg className="w-4 h-4 text-textSecondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                  </div>
                )}
              </div>
            </div>

            {/* Captain & Coach banner for official squad */}
            {isOfficialSquadSeason && officialTeamSquad && (
              <div className="flex flex-wrap gap-4">
                {officialTeamSquad.captain && (
                  <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
                    <span className="text-amber-400 text-lg">&#9733;</span>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-textSecondary font-medium">Captain</div>
                      <div className="font-bold text-sm">{officialTeamSquad.captain}</div>
                    </div>
                  </div>
                )}
                {officialTeamSquad.coach && officialTeamSquad.coach !== 'N/A' && (() => {
                  const matched = coaches?.find((c: any) =>
                    c.name.toLowerCase() === officialTeamSquad.coach.toLowerCase() ||
                    c.fullName?.toLowerCase() === officialTeamSquad.coach.toLowerCase()
                  )
                  const inner = (
                    <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3 hover:border-accent/40 transition-colors">
                      <span className="text-blue-400 text-lg">&#128218;</span>
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-textSecondary font-medium">Head Coach</div>
                        <div className={`font-bold text-sm ${matched ? 'text-accent' : ''}`}>
                          {officialTeamSquad.coach}
                          {matched && <span className="ml-1">&rarr;</span>}
                        </div>
                      </div>
                    </div>
                  )
                  return matched ? <Link to={`/coaches/${matched.id}`}>{inner}</Link> : inner
                })()}
                <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
                  <span className="text-emerald-400 text-lg">&#127759;</span>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-textSecondary font-medium">Overseas</div>
                    <div className="font-bold text-sm">
                      {officialTeamSquad.players.filter((p: any) => p.overseas).length} players
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-3">
                  <span className="text-cyan-400 text-lg">&#128274;</span>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-textSecondary font-medium">Retained</div>
                    <div className="font-bold text-sm">
                      {officialTeamSquad.players.filter((p: any) => p.retained).length} players
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Official Squad (IPL 2026) ── */}
            {isOfficialSquadSeason && officialTeamSquad && (
              <>
                {ROLE_ORDER.filter(role => officialSquadByRole[role]?.length > 0).map(role => {
                  const roleStyle = ROLE_STYLE[role] || ROLE_STYLE.Unknown
                  const players = officialSquadByRole[role]
                  return (
                    <div key={role}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${roleStyle.bg} ${roleStyle.text} border ${roleStyle.border}`}>
                          {role}
                        </span>
                        <span className="text-xs text-textSecondary">({players.length})</span>
                      </div>
                      <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <colgroup>
                              <col className="w-14" />
                              <col />
                              <col className="w-16" />
                              <col className="w-20" />
                              <col className="w-16" />
                              <col className="w-16" />
                              <col className="w-16" />
                              <col className="w-14" />
                              <col className="w-14" />
                              <col className="w-16" />
                              <col className="w-20" />
                              <col className="w-16" />
                              <col className="w-20" />
                            </colgroup>
                            <thead>
                              <tr className="border-b border-border text-textSecondary">
                                <th className="text-left px-4 py-3 font-medium">#</th>
                                <th className="text-left px-2 py-3 font-medium">Player</th>
                                {/* <th className="text-left px-2 py-3 font-medium">Status</th> */}
                                {/* <th className="text-left px-2 py-3 font-medium">Price</th> */}
                                <th className="text-right px-2 py-3 font-medium">Mat</th>
                                <th className="text-right px-2 py-3 font-medium">Runs</th>
                                <th className="text-right px-2 py-3 font-medium" title="Highest score">HS</th>
                                <th className="text-right px-2 py-3 font-medium">Avg</th>
                                <th className="text-right px-2 py-3 font-medium">SR</th>
                                <th className="text-right px-2 py-3 font-medium" title="Fours">4s</th>
                                <th className="text-right px-2 py-3 font-medium" title="Sixes">6s</th>
                                <th className="text-right px-2 py-3 font-medium">Wkts</th>
                                <th className="text-right px-2 py-3 font-medium" title="Best bowling">BB</th>
                                <th className="text-right px-2 py-3 font-medium" title="Bowling economy (runs per over)">Econ</th>
                                <th className="text-right px-4 py-3 font-medium" title="Bowling strike rate (balls per wicket)">Bowl SR</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {players.map((p: any, i: number) => {
                                const isCaptain = officialTeamSquad.captain === p.name
                                return (
                                  <tr key={p.name} className={`hover:bg-white/5 ${isCaptain ? 'bg-amber-500/5' : ''}`}>
                                    <td className="px-4 py-2.5 text-textSecondary font-bold">{i + 1}</td>
                                    <td className="px-2 py-2.5">
                                      <div className="flex items-center gap-2.5">
                                        <Avatar
                                          id={p.playerId || ''}
                                          name={p.name}
                                          kind="player"
                                          sizePx={32}
                                          color={colors.primary}
                                          season={effectiveSquadSeason}
                                          photo={p.playerId ? (playerPhotos?.[`${p.playerId}_${effectiveSquadSeason}`] || playerPhotos?.[p.playerId]) : undefined}
                                        />
                                        {p.playerId ? (
                                          <Link
                                            to={`/players/${p.playerId}`}
                                            className="text-textPrimary hover:text-accent font-medium"
                                          >
                                            {p.name}
                                          </Link>
                                        ) : (
                                          <span className="text-textPrimary font-medium">{p.name}</span>
                                        )}
                                        {p.overseas && <OverseasBadge sizePx={11} />}
                                        {p.replacement && (
                                          <span
                                            title={`Replacement for ${p.replacement.replacing}${p.replacement.reason ? ` — ${p.replacement.reason}` : ''}${p.replacement.price ? ` (${p.replacement.price})` : ''}`}
                                            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                                          >
                                            R
                                          </span>
                                        )}
                                        {isCaptain && (
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">C</span>
                                        )}
                                      </div>
                                    </td>
                                    {/* <td className="px-2 py-2.5">
                                      <div className="flex items-center gap-1.5">
                                        {p.retained && (
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                                            Retained
                                          </span>
                                        )}
                                        {p.isNewSigning && (
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                            New Signing
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-2 py-2.5 text-textSecondary text-xs font-medium">
                                      {p.price !== 'N/A' ? p.price : '-'}
                                    </td> */}
                                    <td className="text-right px-2 py-2.5 text-textSecondary">
                                      {p.stats ? p.stats.matches : '-'}
                                    </td>
                                    <td className="text-right px-2 py-2.5 font-bold text-orange-400">
                                      {p.stats ? p.stats.runs : '-'}
                                    </td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">
                                      {p.stats && p.stats.highScore > 0
                                        ? `${p.stats.highScore}${p.stats.highScoreNotOut ? '*' : ''}`
                                        : '-'}
                                    </td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">
                                      {p.stats ? p.stats.battingAvg : '-'}
                                    </td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">
                                      {p.stats ? p.stats.strikeRate : '-'}
                                    </td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">
                                      {p.stats ? (p.stats.fours ?? 0) : '-'}
                                    </td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">
                                      {p.stats ? (p.stats.sixes ?? 0) : '-'}
                                    </td>
                                    <td className="text-right px-2 py-2.5 text-purple-400">
                                      {p.stats ? p.stats.wickets : '-'}
                                    </td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">
                                      {p.stats ? (p.stats.bestBowling || '-') : '-'}
                                    </td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">
                                      {p.stats && (p.stats.ballsBowled ?? 0) > 0 ? p.stats.economy : '-'}
                                    </td>
                                    <td className="text-right px-4 py-2.5 text-textSecondary">
                                      {p.stats && (p.stats.wickets ?? 0) > 0 && (p.stats.ballsBowled ?? 0) > 0
                                        ? (Math.round((p.stats.ballsBowled / p.stats.wickets) * 100) / 100)
                                        : '-'}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </>
            )}

            {/* ── Legacy CricSheet Squad (older seasons or all-time) ── */}
            {!isOfficialSquadSeason && (
              <>
                {ROLE_ORDER.filter(role => squadByRole[role]?.length > 0).map(role => {
                  const roleStyle = ROLE_STYLE[role]
                  const players = squadByRole[role]
                  return (
                    <div key={role}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold ${roleStyle.bg} ${roleStyle.text} border ${roleStyle.border}`}>
                          {role}
                        </span>
                        <span className="text-xs text-textSecondary">({players.length})</span>
                      </div>
                      <div className="bg-card border border-border rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <colgroup>
                              <col className="w-14" />
                              <col />
                              <col className="w-36" />
                              <col className="w-16" />
                              <col className="w-20" />
                              <col className="w-16" />
                              <col className="w-16" />
                              <col className="w-16" />
                              <col className="w-14" />
                              <col className="w-14" />
                              <col className="w-16" />
                              <col className="w-20" />
                              <col className="w-16" />
                              <col className="w-20" />
                            </colgroup>
                            <thead>
                              <tr className="border-b border-border text-textSecondary">
                                <th className="text-left px-4 py-3 font-medium">#</th>
                                <th className="text-left px-2 py-3 font-medium">Player</th>
                                <th className="text-left px-2 py-3 font-medium">Seasons</th>
                                <th className="text-right px-2 py-3 font-medium">Mat</th>
                                <th className="text-right px-2 py-3 font-medium">Runs</th>
                                <th className="text-right px-2 py-3 font-medium" title="Highest score">HS</th>
                                <th className="text-right px-2 py-3 font-medium">Avg</th>
                                <th className="text-right px-2 py-3 font-medium">SR</th>
                                <th className="text-right px-2 py-3 font-medium" title="Fours">4s</th>
                                <th className="text-right px-2 py-3 font-medium" title="Sixes">6s</th>
                                <th className="text-right px-2 py-3 font-medium">Wkts</th>
                                <th className="text-right px-2 py-3 font-medium" title="Best bowling">BB</th>
                                <th className="text-right px-2 py-3 font-medium" title="Bowling economy (runs per over)">Econ</th>
                                <th className="text-right px-4 py-3 font-medium" title="Bowling strike rate (balls per wicket)">Bowl SR</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {players.map((p: any, i: number) => {
                                const playerSeasons = teamPlayerMap[p.playerId] || []
                                const overseas = isOverseasPlayer(p.playerName, overseasLookup) === true
                                return (
                                  <tr key={p.playerId} className="hover:bg-white/5">
                                    <td className="px-4 py-2.5 text-textSecondary font-bold">{i + 1}</td>
                                    <td className="px-2 py-2.5">
                                      <Link
                                        to={`/players/${p.playerId}`}
                                        className="flex items-center gap-2.5 text-textPrimary hover:text-accent font-medium"
                                      >
                                        <Avatar id={p.playerId} name={p.playerName} kind="player" sizePx={32} color={colors.primary} season={effectiveSquadSeason} photo={playerPhotos?.[`${p.playerId}_${effectiveSquadSeason}`] || playerPhotos?.[p.playerId]} />
                                        <span>{p.playerName}</span>
                                        {overseas && <OverseasBadge sizePx={11} />}
                                      </Link>
                                    </td>
                                    <td className="px-2 py-2.5 text-textSecondary text-xs">
                                      {playerSeasons.length > 3
                                        ? `${playerSeasons[0]}-${playerSeasons[playerSeasons.length - 1]} (${playerSeasons.length})`
                                        : [...playerSeasons].sort().join(', ')}
                                    </td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">{p.matches}</td>
                                    <td className="text-right px-2 py-2.5 font-bold text-orange-400">{p.runs}</td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">
                                      {p.highScore > 0 ? `${p.highScore}${p.highScoreNotOut ? '*' : ''}` : '-'}
                                    </td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">{p.battingAvg}</td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">{p.strikeRate}</td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">{p.fours ?? 0}</td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">{p.sixes ?? 0}</td>
                                    <td className="text-right px-2 py-2.5 text-purple-400">{p.wickets}</td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">{p.bestBowling || '-'}</td>
                                    <td className="text-right px-2 py-2.5 text-textSecondary">
                                      {(p.ballsBowled ?? 0) > 0 ? p.economy : '-'}
                                    </td>
                                    <td className="text-right px-4 py-2.5 text-textSecondary">
                                      {(p.wickets ?? 0) > 0 && (p.ballsBowled ?? 0) > 0 ? p.bowlingStrikeRate : '-'}
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )
                })}

                {squadPlayers.length === 0 && (
                  <div className="text-center py-16 text-textSecondary">
                    <p>No players found for this season.</p>
                  </div>
                )}
              </>
            )}

            {/* ── Support Staff (for the currently-selected season) ── */}
            {squadMode === 'season' && supportStaffForSeason.length > 0 && (
              <div className="pt-6 mt-2 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
                  <h2 className="text-lg font-bold">Support Staff</h2>
                  <span className="text-xs text-textSecondary ml-1">
                    ({supportStaffForSeason.length} {supportStaffForSeason.length === 1 ? 'person' : 'people'}
                    {' · '}IPL {effectiveSquadSeason})
                  </span>
                </div>
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <colgroup>
                        <col className="w-14" />
                        <col />
                        <col className="w-40" />
                        <col className="w-32" />
                        <col className="w-28" />
                      </colgroup>
                      <thead>
                        <tr className="border-b border-border text-textSecondary">
                          <th className="text-left px-4 py-3 font-medium">#</th>
                          <th className="text-left px-2 py-3 font-medium">Name</th>
                          <th className="text-left px-2 py-3 font-medium">Role</th>
                          <th className="text-left px-2 py-3 font-medium">Nationality</th>
                          <th className="text-left px-4 py-3 font-medium">Tenure</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {supportStaffForSeason.map((s: any, i: number) => {
                          const tenureSpan = s.tenure.fromSeason === s.tenure.toSeason
                            ? s.tenure.fromSeason
                            : `${s.tenure.fromSeason}–${s.tenure.toSeason}`
                          const staffOverseas = s.coach.nationality && s.coach.nationality.toLowerCase() !== 'indian'
                          return (
                            <tr key={`${s.coach.id}-${s.role}`} className="hover:bg-white/5">
                              <td className="px-4 py-2.5 text-textSecondary font-bold">{i + 1}</td>
                              <td className="px-2 py-2.5">
                                <Link
                                  to={`/coaches/${s.coach.id}`}
                                  className="flex items-center gap-2.5 text-textPrimary hover:text-accent font-medium"
                                >
                                  <Avatar id={s.coach.id} name={s.coach.name} kind="coach" sizePx={32} color={colors.primary} photo={coachPhotos?.[s.coach.id]} />
                                  <span>{s.coach.name}</span>
                                  {staffOverseas && <OverseasBadge sizePx={11} title="Overseas (non-Indian) staff" />}
                                </Link>
                              </td>
                              <td className="px-2 py-2.5">
                                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-500/15 text-indigo-400">
                                  {ROLE_LABEL_MAP[s.role] || s.role}
                                </span>
                              </td>
                              <td className="px-2 py-2.5 text-textSecondary text-xs">
                                {s.coach.nationality || '—'}
                              </td>
                              <td className="px-4 py-2.5 text-textSecondary text-xs">
                                {tenureSpan}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Stats' && (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="bg-card border border-border rounded-2xl p-5 text-center hover:border-accent/30 transition-colors">
                <p className="text-3xl font-black gradient-text">{team.seasons?.length || 0}</p>
                <p className="text-xs text-textSecondary mt-1 font-medium uppercase tracking-wider">Seasons</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5 text-center hover:border-accent/30 transition-colors">
                <p className="text-3xl font-black" style={{ color: colors.primary }}>{titles.length}</p>
                <p className="text-xs text-textSecondary mt-1 font-medium uppercase tracking-wider">Titles</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5 text-center hover:border-accent/30 transition-colors">
                <p className="text-3xl font-black gradient-text">{Object.keys(teamPlayerMap).length}</p>
                <p className="text-xs text-textSecondary mt-1 font-medium uppercase tracking-wider">Players</p>
              </div>
              <div className="bg-card border border-border rounded-2xl p-5 text-center hover:border-accent/30 transition-colors">
                <p className="text-3xl font-black gradient-text">{team.seasons?.[0]}</p>
                <p className="text-xs text-textSecondary mt-1 font-medium uppercase tracking-wider">First Season</p>
              </div>
            </div>

            {/* Top Run Scorers */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
                Top Run Scorers
              </h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-textSecondary">
                        <th className="text-left px-4 py-3 font-medium">#</th>
                        <th className="text-left px-2 py-3 font-medium">Player</th>
                        <th className="text-right px-2 py-3 font-medium">Mat</th>
                        <th className="text-right px-2 py-3 font-medium">Runs</th>
                        <th className="text-right px-2 py-3 font-medium">Avg</th>
                        <th className="text-right px-2 py-3 font-medium">SR</th>
                        <th className="text-right px-4 py-3 font-medium">HS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {teamStatsRunScorers.slice(0, 10).map((p, i) => (
                        <tr key={p.playerId || p.playerName} className="hover:bg-white/5">
                          <td className="px-4 py-2.5 text-textSecondary font-bold">{i + 1}</td>
                          <td className="px-2 py-2.5">
                            {p.playerId ? (
                              <Link to={`/players/${p.playerId}`} className="text-textPrimary hover:text-accent font-medium">
                                {p.playerName}
                              </Link>
                            ) : (
                              <span className="text-textPrimary font-medium">{p.playerName}</span>
                            )}
                          </td>
                          <td className="text-right px-2 py-2.5 text-textSecondary">{p.matches}</td>
                          <td className="text-right px-2 py-2.5 font-bold text-orange-400">{p.runs}</td>
                          <td className="text-right px-2 py-2.5 text-textSecondary">{p.battingAvg || '-'}</td>
                          <td className="text-right px-2 py-2.5 text-textSecondary">{p.strikeRate || '-'}</td>
                          <td className="text-right px-4 py-2.5 text-textSecondary">
                            {p.highScore}{p.highScoreNotOut ? '*' : ''}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Top Wicket Takers */}
            <div>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
                Top Wicket Takers
              </h2>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border text-textSecondary">
                        <th className="text-left px-4 py-3 font-medium">#</th>
                        <th className="text-left px-2 py-3 font-medium">Player</th>
                        <th className="text-right px-2 py-3 font-medium">Mat</th>
                        <th className="text-right px-2 py-3 font-medium">Wkts</th>
                        <th className="text-right px-2 py-3 font-medium">Econ</th>
                        <th className="text-right px-2 py-3 font-medium">Avg</th>
                        <th className="text-right px-4 py-3 font-medium">Best</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {teamStatsWicketTakers.slice(0, 10).map((p, i) => (
                        <tr key={p.playerId || p.playerName} className="hover:bg-white/5">
                          <td className="px-4 py-2.5 text-textSecondary font-bold">{i + 1}</td>
                          <td className="px-2 py-2.5">
                            {p.playerId ? (
                              <Link to={`/players/${p.playerId}`} className="text-textPrimary hover:text-accent font-medium">
                                {p.playerName}
                              </Link>
                            ) : (
                              <span className="text-textPrimary font-medium">{p.playerName}</span>
                            )}
                          </td>
                          <td className="text-right px-2 py-2.5 text-textSecondary">{p.matches}</td>
                          <td className="text-right px-2 py-2.5 font-bold text-purple-400">{p.wickets}</td>
                          <td className="text-right px-2 py-2.5 text-textSecondary">{p.economy || '-'}</td>
                          <td className="text-right px-2 py-2.5 text-textSecondary">{p.bowlingAvg || '-'}</td>
                          <td className="text-right px-4 py-2.5 text-textSecondary">{p.bestBowling}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'Season History' && (
          <div>
            <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
              <div className="w-1 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
              Season History
            </h2>
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-textSecondary">
                      <th className="text-left px-4 py-3 font-medium">Season</th>
                      <th className="text-left px-2 py-3 font-medium">Winner</th>
                      <th className="text-right px-2 py-3 font-medium">Matches</th>
                      <th className="text-right px-2 py-3 font-medium">Orange Cap</th>
                      <th className="text-right px-4 py-3 font-medium">Purple Cap</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {seasonHistory.map(s => {
                      const isChampion = s.winner === team.name || team.aliases?.some((a: string) => a === s.winner)
                      return (
                        <tr key={s.year} className={`hover:bg-white/5 ${isChampion ? 'bg-amber-500/5' : ''}`}>
                          <td className="px-4 py-3">
                            <Link to={`/seasons/${s.year}`} className="font-semibold hover:text-accent">
                              IPL {s.year}
                            </Link>
                          </td>
                          <td className="px-2 py-3">
                            {isChampion ? (
                              <span className="inline-flex items-center gap-1.5 font-semibold" style={{ color: colors.primary }}>
                                <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                </svg>
                                Champions
                              </span>
                            ) : (
                              <span className="text-textSecondary">{s.winner || '-'}</span>
                            )}
                          </td>
                          <td className="text-right px-2 py-3 text-textSecondary">{s.matchCount}</td>
                          <td className="text-right px-2 py-3 text-orange-400 text-xs">
                            {s.orangeCap?.player} ({s.orangeCap?.runs})
                          </td>
                          <td className="text-right px-4 py-3 text-purple-400 text-xs">
                            {s.purpleCap?.player} ({s.purpleCap?.wickets})
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SWOT' && (
          <div className="space-y-6">
            {/* Season Selector */}
            <div className="flex flex-wrap items-center gap-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
                SWOT Analysis
              </h2>
              <select
                value={effectiveSwotSeason}
                onChange={e => setSwotSeason(e.target.value)}
                className="bg-card border border-border rounded-lg px-3 py-1.5 text-sm text-textPrimary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                {teamSeasons.map(s => (
                  <option key={s} value={s}>IPL {s}</option>
                ))}
              </select>
            </div>

            {swotLoading && (
              <div className="text-center py-16 text-textSecondary">
                <div className="inline-block w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
                <p>Analyzing team data...</p>
              </div>
            )}

            {swotData && !swotLoading && (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { label: 'Squad Size', value: swotData.squadSize },
                    { label: 'Total Runs', value: swotData.teamTotalRuns.toLocaleString() },
                    { label: 'Avg SR', value: swotData.teamAvgSR },
                    { label: 'Total Wickets', value: swotData.teamTotalWickets },
                    { label: 'Boundary %', value: `${swotData.boundaryPercentage}%` },
                  ].map(stat => (
                    <div
                      key={stat.label}
                      className="bg-card border border-border rounded-xl p-4 text-center"
                    >
                      <div className="text-xl font-black" style={{ color: colors.primary }}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-textSecondary mt-1 uppercase tracking-wider font-medium">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2x2 SWOT Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                    <h3 className="text-base font-bold text-emerald-400 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Strengths
                    </h3>
                    <ul className="space-y-3">
                      {swotData.strengths.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-textPrimary">{item.text}</div>
                            {item.detail && (
                              <div className="text-xs text-textSecondary mt-0.5">{item.detail}</div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-5">
                    <h3 className="text-base font-bold text-red-400 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Weaknesses
                    </h3>
                    <ul className="space-y-3">
                      {swotData.weaknesses.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-textPrimary">{item.text}</div>
                            {item.detail && (
                              <div className="text-xs text-textSecondary mt-0.5">{item.detail}</div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-5">
                    <h3 className="text-base font-bold text-blue-400 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Opportunities
                    </h3>
                    <ul className="space-y-3">
                      {swotData.opportunities.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-textPrimary">{item.text}</div>
                            {item.detail && (
                              <div className="text-xs text-textSecondary mt-0.5">{item.detail}</div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5">
                    <h3 className="text-base font-bold text-amber-400 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Threats
                    </h3>
                    <ul className="space-y-3">
                      {swotData.threats.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-textPrimary">{item.text}</div>
                            {item.detail && (
                              <div className="text-xs text-textSecondary mt-0.5">{item.detail}</div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Squad Composition Bar */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
                    Squad Composition
                  </h3>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-sm text-textSecondary">{swotData.squadComposition.total} players</span>
                  </div>
                  {/* Stacked bar */}
                  <div className="h-10 rounded-lg overflow-hidden flex" style={{ border: '1px solid #1e1e3a' }}>
                    {swotData.squadComposition.batters > 0 && (
                      <div
                        className="flex items-center justify-center text-xs font-bold transition-all"
                        style={{
                          width: `${(swotData.squadComposition.batters / swotData.squadComposition.total) * 100}%`,
                          backgroundColor: '#f97316',
                          color: '#000',
                        }}
                        title={`Batters: ${swotData.squadComposition.batters}`}
                      >
                        {swotData.squadComposition.batters}
                      </div>
                    )}
                    {swotData.squadComposition.bowlers > 0 && (
                      <div
                        className="flex items-center justify-center text-xs font-bold transition-all"
                        style={{
                          width: `${(swotData.squadComposition.bowlers / swotData.squadComposition.total) * 100}%`,
                          backgroundColor: '#a855f7',
                          color: '#fff',
                        }}
                        title={`Bowlers: ${swotData.squadComposition.bowlers}`}
                      >
                        {swotData.squadComposition.bowlers}
                      </div>
                    )}
                    {swotData.squadComposition.allrounders > 0 && (
                      <div
                        className="flex items-center justify-center text-xs font-bold transition-all"
                        style={{
                          width: `${(swotData.squadComposition.allrounders / swotData.squadComposition.total) * 100}%`,
                          backgroundColor: '#22c55e',
                          color: '#000',
                        }}
                        title={`All-rounders: ${swotData.squadComposition.allrounders}`}
                      >
                        {swotData.squadComposition.allrounders}
                      </div>
                    )}
                    {swotData.squadComposition.wicketkeepers > 0 && (
                      <div
                        className="flex items-center justify-center text-xs font-bold transition-all"
                        style={{
                          width: `${(swotData.squadComposition.wicketkeepers / swotData.squadComposition.total) * 100}%`,
                          backgroundColor: '#3b82f6',
                          color: '#fff',
                        }}
                        title={`Wicketkeepers: ${swotData.squadComposition.wicketkeepers}`}
                      >
                        {swotData.squadComposition.wicketkeepers}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#f97316' }} />
                      Batters ({swotData.squadComposition.batters})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#a855f7' }} />
                      Bowlers ({swotData.squadComposition.bowlers})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#22c55e' }} />
                      All-rounders ({swotData.squadComposition.allrounders})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#3b82f6' }} />
                      Wicketkeepers ({swotData.squadComposition.wicketkeepers})
                    </span>
                  </div>
                </div>

                {/* Player Dependency Chart - Top 5 Run Contributors */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
                      Top Run Contributors
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={swotData.topContributors.slice(0, 5).map(c => ({
                            name: c.playerName.split(' ').pop() || c.playerName,
                            runs: c.runs,
                            share: c.runShare,
                          }))}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="#1e1e3a" />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            stroke="#1e1e3a"
                            width={80}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#131320',
                              border: '1px solid #1e1e3a',
                              borderRadius: 8,
                              color: '#e2e8f0',
                              fontSize: 13,
                            }}
                            formatter={(value: any, name: any) => {
                              if (name === 'runs') return [`${value} runs`, 'Runs']
                              return [`${value}%`, 'Share']
                            }}
                          />
                          <Bar dataKey="runs" radius={[0, 6, 6, 0]}>
                            {swotData.topContributors.slice(0, 5).map((_, i) => (
                              <Cell key={i} fill={i === 0 ? '#f97316' : `rgba(249,115,22,${0.7 - i * 0.1})`} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Top Wicket Contributors */}
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
                      Top Wicket Contributors
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[...swotData.topContributors]
                            .sort((a, b) => b.wickets - a.wickets)
                            .slice(0, 5)
                            .map(c => ({
                              name: c.playerName.split(' ').pop() || c.playerName,
                              wickets: c.wickets,
                              share: c.wicketShare,
                            }))}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e1e3a" />
                          <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} stroke="#1e1e3a" />
                          <YAxis
                            dataKey="name"
                            type="category"
                            tick={{ fill: '#94a3b8', fontSize: 12 }}
                            stroke="#1e1e3a"
                            width={80}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#131320',
                              border: '1px solid #1e1e3a',
                              borderRadius: 8,
                              color: '#e2e8f0',
                              fontSize: 13,
                            }}
                            formatter={(value: any, name: any) => {
                              if (name === 'wickets') return [`${value} wkts`, 'Wickets']
                              return [`${value}%`, 'Share']
                            }}
                          />
                          <Bar dataKey="wickets" radius={[0, 6, 6, 0]}>
                            {[...swotData.topContributors]
                              .sort((a, b) => b.wickets - a.wickets)
                              .slice(0, 5)
                              .map((_, i) => (
                                <Cell key={i} fill={i === 0 ? '#a855f7' : `rgba(168,85,247,${0.7 - i * 0.1})`} />
                              ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Phase-wise Team Performance Radar */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full" style={{ backgroundColor: colors.primary }} />
                    Phase-wise Performance
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Batting Radar */}
                    <div>
                      <h4 className="text-sm font-semibold text-textSecondary mb-2 text-center">Batting SR by Phase</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart
                            cx="50%"
                            cy="50%"
                            outerRadius="75%"
                            data={swotData.phaseStats.map(p => ({
                              phase: p.phase,
                              value: p.battingSR,
                              label: `SR ${p.battingSR}`,
                            }))}
                          >
                            <PolarGrid stroke="#1e1e3a" />
                            <PolarAngleAxis
                              dataKey="phase"
                              tick={{ fill: '#94a3b8', fontSize: 13 }}
                            />
                            <PolarRadiusAxis
                              angle={90}
                              tick={{ fill: '#64748b', fontSize: 11 }}
                              stroke="#1e1e3a"
                            />
                            <Radar
                              name="Batting SR"
                              dataKey="value"
                              stroke="#f97316"
                              fill="#f97316"
                              fillOpacity={0.3}
                              strokeWidth={2}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#131320',
                                border: '1px solid #1e1e3a',
                                borderRadius: 8,
                                color: '#e2e8f0',
                                fontSize: 13,
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Bowling Radar */}
                    <div>
                      <h4 className="text-sm font-semibold text-textSecondary mb-2 text-center">Bowling Economy by Phase</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart
                            cx="50%"
                            cy="50%"
                            outerRadius="75%"
                            data={swotData.phaseStats.map(p => ({
                              phase: p.phase,
                              value: p.bowlingEcon,
                              label: `Econ ${p.bowlingEcon}`,
                            }))}
                          >
                            <PolarGrid stroke="#1e1e3a" />
                            <PolarAngleAxis
                              dataKey="phase"
                              tick={{ fill: '#94a3b8', fontSize: 13 }}
                            />
                            <PolarRadiusAxis
                              angle={90}
                              tick={{ fill: '#64748b', fontSize: 11 }}
                              stroke="#1e1e3a"
                            />
                            <Radar
                              name="Bowling Economy"
                              dataKey="value"
                              stroke="#a855f7"
                              fill="#a855f7"
                              fillOpacity={0.3}
                              strokeWidth={2}
                            />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#131320',
                                border: '1px solid #1e1e3a',
                                borderRadius: 8,
                                color: '#e2e8f0',
                                fontSize: 13,
                              }}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Phase Stats Table */}
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-textSecondary">
                          <th className="text-left px-3 py-2 font-medium">Phase</th>
                          <th className="text-right px-3 py-2 font-medium">Bat Runs</th>
                          <th className="text-right px-3 py-2 font-medium">Bat Balls</th>
                          <th className="text-right px-3 py-2 font-medium">Bat SR</th>
                          <th className="text-right px-3 py-2 font-medium">Bowl Runs</th>
                          <th className="text-right px-3 py-2 font-medium">Bowl Wkts</th>
                          <th className="text-right px-3 py-2 font-medium">Bowl Econ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {swotData.phaseStats.map(p => (
                          <tr key={p.phase} className="hover:bg-white/5">
                            <td className="px-3 py-2 font-medium">{p.phase}</td>
                            <td className="text-right px-3 py-2 text-orange-400">{p.battingRuns}</td>
                            <td className="text-right px-3 py-2 text-textSecondary">{p.battingBalls}</td>
                            <td className="text-right px-3 py-2 font-bold text-orange-400">{p.battingSR}</td>
                            <td className="text-right px-3 py-2 text-textSecondary">{p.bowlingRuns}</td>
                            <td className="text-right px-3 py-2 text-purple-400">{p.bowlingWickets}</td>
                            <td className="text-right px-3 py-2 font-bold text-purple-400">{p.bowlingEcon}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {!swotData && !swotLoading && effectiveSwotSeason && (
              <div className="text-center py-16 text-textSecondary">
                <p>No data available for this season.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}
