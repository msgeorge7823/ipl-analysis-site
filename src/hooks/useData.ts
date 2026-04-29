// Centralized React Query hooks. Every page reads data through this file —
// it bundles the raw shard fetchers (dataService), the derived analytics
// (playerStatsService, teamAnalysisService), and the user-state stores
// (workspaceService, watchlistService) under one consistent caching policy.
//
// Conventions:
//   - Static shards use a 1-hour staleTime (data only changes on redeploy).
//   - Derived/analytics queries use a 30-minute staleTime since they're
//     expensive to recompute.
//   - Local IndexedDB queries (workspaces/watchlist) use staleTime=0 so
//     mutations show up immediately.
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { dataService } from '@/services/dataService'
import { workspaceService } from '@/services/workspaceService'
import { watchlistService } from '@/services/watchlistService'
import { playerStatsService } from '@/services/playerStatsService'
import { getSwotAnalysis } from '@/services/teamAnalysisService'
import type { SwotAnalysis } from '@/services/teamAnalysisService'
import { getMatchWeather, getMatchPhase } from '@/services/weatherService'

// Stale time: data changes only on redeploy, so cache aggressively
const STALE = 1000 * 60 * 60 // 1 hour

// All player profiles (id, name, country, role, status, ...).
export function usePlayers() {
  return useQuery({ queryKey: ['players'], queryFn: dataService.getPlayers, staleTime: STALE })
}

// Fuzzy scorecard/BBB name → IPL player.id mapping.
// Pre-computed by the squad pipeline; used for the player-name-anywhere link pattern.
export function useSquadNameMapping() {
  return useQuery({
    queryKey: ['squad-name-mapping'],
    queryFn: dataService.getSquadNameMapping,
    staleTime: STALE,
  })
}

// Lightweight name/id index — used by search and PlayerLink.
export function usePlayersIndex() {
  return useQuery({ queryKey: ['players-index'], queryFn: dataService.getPlayersIndex, staleTime: STALE })
}

// All franchises (active + defunct).
export function useTeams() {
  return useQuery({ queryKey: ['teams'], queryFn: dataService.getTeams, staleTime: STALE })
}

// Season records (winners, finalists, awards, match counts).
export function useSeasons() {
  return useQuery({ queryKey: ['seasons'], queryFn: dataService.getSeasons, staleTime: STALE })
}

// Venue list with pitch-character summaries.
export function useVenues() {
  return useQuery({ queryKey: ['venues'], queryFn: dataService.getVenues, staleTime: STALE })
}

// Aggregated career stats (batting/bowling/fielding) for every player.
export function usePlayerStats() {
  return useQuery({ queryKey: ['player-stats'], queryFn: dataService.getPlayerStats, staleTime: STALE })
}

// Per-player season-by-season team affiliations.
export function usePlayerTeams() {
  return useQuery({ queryKey: ['player-teams'], queryFn: dataService.getPlayerTeams, staleTime: STALE })
}

// Coaches database (head coaches + support staff).
export function useCoaches() {
  return useQuery({ queryKey: ['coaches'], queryFn: dataService.getCoaches, staleTime: STALE })
}

// Player headshot URL map (Wikipedia-sourced).
export function usePlayerPhotos() {
  return useQuery({ queryKey: ['player-photos'], queryFn: dataService.getPlayerPhotos, staleTime: STALE })
}

// Coach headshot URL map.
export function useCoachPhotos() {
  return useQuery({ queryKey: ['coach-photos'], queryFn: dataService.getCoachPhotos, staleTime: STALE })
}

// IPL trivia / facts feed used on the Home and Education pages.
export function useIPLFacts() {
  return useQuery({ queryKey: ['ipl-facts'], queryFn: dataService.getIPLFacts, staleTime: STALE })
}

// Curated IPL news items rendered on the News page.
export function useIPLNews() {
  return useQuery({ queryKey: ['ipl-news'], queryFn: dataService.getIPLNews, staleTime: STALE })
}

// All matches in one season (skipped while season is empty).
export function useMatches(season: string) {
  return useQuery({
    queryKey: ['matches', season],
    queryFn: () => dataService.getMatches(season),
    staleTime: STALE,
    enabled: !!season,
  })
}

// Per-innings batting scorecards for one season.
export function useBatting(season: string) {
  return useQuery({
    queryKey: ['batting', season],
    queryFn: () => dataService.getBatting(season),
    staleTime: STALE,
    enabled: !!season,
  })
}

// Per-innings bowling scorecards for one season.
export function useBowling(season: string) {
  return useQuery({
    queryKey: ['bowling', season],
    queryFn: () => dataService.getBowling(season),
    staleTime: STALE,
    enabled: !!season,
  })
}

// All batting partnerships for one season.
export function usePartnerships(season: string) {
  return useQuery({
    queryKey: ['partnerships', season],
    queryFn: () => dataService.getPartnerships(season),
    staleTime: STALE,
    enabled: !!season,
  })
}

// Mid-season replacement signings (e.g. injury cover).
export function useReplacementPlayers() {
  return useQuery({
    queryKey: ['replacement-players'],
    queryFn: dataService.getReplacementPlayers,
    staleTime: STALE,
  })
}

/**
 * Fetches venue weather (Open-Meteo) and chooses a cache/refresh policy
 * based on the match's semantic phase:
 *
 *   past   → that day's recorded weather; cached forever
 *            (the past doesn't change)
 *   live   → current observation, refetched every 5 minutes
 *            (the user wants the freshest possible reading)
 *   future → forecast for the kickoff hour, refetched every 15 minutes
 *            (forecast models update slowly)
 */
export function useMatchWeather(
  date: string | undefined,
  city: string | undefined,
  kickoffHourIst: number | undefined
) {
  const phase = date ? getMatchPhase(date) : 'past'
  const refreshMs =
    phase === 'past'
      ? false
      : phase === 'live'
        ? 5 * 60 * 1000
        : 15 * 60 * 1000

  return useQuery({
    queryKey: ['match-weather', date, city, kickoffHourIst, phase],
    queryFn: () =>
      getMatchWeather(date as string, city as string, kickoffHourIst as number),
    enabled: !!date && !!city && kickoffHourIst != null,
    staleTime: phase === 'past' ? Infinity : refreshMs || 15 * 60 * 1000,
    refetchInterval: refreshMs,
    refetchOnWindowFocus: phase !== 'past',
    retry: 1,
  })
}

// Current-season official squads (full rosters per team).
export function useOfficialSquads() {
  return useQuery({
    queryKey: ['official-squads'],
    queryFn: dataService.getOfficialSquads,
    staleTime: STALE,
  })
}

// Orange/Purple Cap race progression for a season (running leaders by match).
export function useCapRace(season: string) {
  return useQuery({
    queryKey: ['cap-race', season],
    queryFn: () => dataService.getCapRace(season),
    staleTime: STALE,
    enabled: !!season,
  })
}

// Workspaces — user-saved player + filter bundles persisted in IndexedDB.
// staleTime: 0 because mutations should reflect immediately in the UI.

// List all workspaces this user has saved.
export function useWorkspaces() {
  return useQuery({
    queryKey: ['workspaces'],
    queryFn: () => workspaceService.listWorkspaces(),
    staleTime: 0, // always fresh from IndexedDB
  })
}

// Load one workspace by id (skipped while id is undefined).
export function useWorkspace(id: number | undefined) {
  return useQuery({
    queryKey: ['workspace', id],
    queryFn: () => workspaceService.loadWorkspace(id!),
    enabled: id !== undefined,
    staleTime: 0,
  })
}

// Mutation: create-or-update a workspace; invalidates the list on success.
export function useSaveWorkspace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: workspaceService.saveWorkspace,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workspaces'] }),
  })
}

// Mutation: remove a workspace by id; invalidates the list on success.
export function useDeleteWorkspace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: workspaceService.deleteWorkspace,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['workspaces'] }),
  })
}

// Watchlist — "starred" players the user wants to follow.

// All entries the user has starred.
export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: () => watchlistService.getWatchlist(),
    staleTime: 0,
  })
}

// Is this single player in the watchlist? Drives the star-toggle button.
export function useIsWatched(playerId: string | undefined) {
  return useQuery({
    queryKey: ['watchlist', 'check', playerId],
    queryFn: () => watchlistService.isInWatchlist(playerId!),
    enabled: !!playerId,
    staleTime: 0,
  })
}

// Mutation: add or remove a watchlist entry based on current state.
export function useToggleWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ playerId, playerName, isWatched }: { playerId: string; playerName: string; isWatched: boolean }) => {
      if (isWatched) {
        await watchlistService.removeFromWatchlist(playerId)
      } else {
        await watchlistService.addToWatchlist(playerId, playerName)
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['watchlist'] })
    },
  })
}

// Player stats hooks — derived analytics computed on demand by
// playerStatsService. Cached for 30 min because the work is heavy.

const STATS_STALE = 1000 * 60 * 30 // 30 minutes — computed data is expensive

// Powerplay / middle / death-overs splits for a player (batting or bowling).
export function usePlayerPhaseStats(playerName: string | undefined, seasons: string[], type: 'batting' | 'bowling' = 'batting') {
  return useQuery({
    queryKey: ['player-phase-stats', playerName, seasons, type],
    queryFn: async (): Promise<any> =>
      type === 'batting'
        ? playerStatsService.getPhaseWiseBatting(playerName!, seasons)
        : playerStatsService.getPhaseWiseBowling(playerName!, seasons),
    staleTime: STATS_STALE,
    enabled: !!playerName && seasons.length > 0,
  })
}

// Player head-to-head: vs a specific bowler, team, or venue.
export function usePlayerH2H(
  playerName: string | undefined,
  opponentName: string | undefined,
  type: 'bowler' | 'team' | 'venue',
  seasons: string[] = []
) {
  return useQuery({
    queryKey: ['player-h2h', playerName, opponentName, type, seasons],
    queryFn: async (): Promise<any> => {
      if (!playerName || !opponentName) throw new Error('Missing player or opponent')
      switch (type) {
        case 'bowler':
          return playerStatsService.getH2HBatterVsBowler(playerName, opponentName, seasons)
        case 'team':
          return playerStatsService.getPlayerVsTeam(playerName, opponentName, seasons)
        case 'venue':
          return playerStatsService.getPlayerVsVenue(playerName, opponentName, seasons)
      }
    },
    staleTime: STATS_STALE,
    enabled: !!playerName && !!opponentName && seasons.length > 0,
  })
}

// Dismissal-type breakdown for a batter (caught, bowled, lbw, ...).
export function usePlayerDismissals(playerName: string | undefined, seasons: string[]) {
  return useQuery({
    queryKey: ['player-dismissals', playerName, seasons],
    queryFn: () => playerStatsService.getDismissalBreakdown(playerName!, seasons),
    staleTime: STATS_STALE,
    enabled: !!playerName && seasons.length > 0,
  })
}

// Per-season totals for a player (one row per season they played).
export function usePlayerSeasonBreakdown(playerName: string | undefined, seasons: string[] = []) {
  return useQuery({
    queryKey: ['player-season-breakdown', playerName, seasons],
    queryFn: () => playerStatsService.getSeasonBreakdown(playerName!, seasons),
    staleTime: STATS_STALE,
    enabled: !!playerName && seasons.length > 0,
  })
}

// Match-by-match scores for a player in a given season (innings table).
export function usePlayerMatchScores(playerName: string | undefined, season: string, type: 'batting' | 'bowling' = 'batting') {
  return useQuery({
    queryKey: ['player-match-scores', playerName, season, type],
    queryFn: async () => {
      if (type === 'batting') {
        return playerStatsService.getMatchBattingScores(playerName!, season)
      }
      return playerStatsService.getMatchBowlingScores(playerName!, season) as any
    },
    staleTime: STATS_STALE,
    enabled: !!playerName && !!season,
  })
}

// All partnerships involving a given player.
export function usePlayerPartnerships(playerName: string | undefined, seasons: string[]) {
  return useQuery({
    queryKey: ['player-partnerships', playerName, seasons],
    queryFn: () => playerStatsService.getPlayerPartnerships(playerName!, seasons),
    staleTime: STATS_STALE,
    enabled: !!playerName && seasons.length > 0,
  })
}

// Stats grouped by batting position (opener, #3, #4, ... finisher).
export function usePlayerBattingPositions(playerName: string | undefined, seasons: string[]) {
  return useQuery({
    queryKey: ['player-bat-positions', playerName, seasons],
    queryFn: () => playerStatsService.getBattingPositionStats(playerName!, seasons),
    staleTime: STATS_STALE,
    enabled: !!playerName && seasons.length > 0,
  })
}

// Roster-level stats for one or more teams across one or more seasons.
export function useTeamPlayerStats(teamNames: string[], seasons: string[], enabled = true) {
  return useQuery({
    queryKey: ['team-player-stats', teamNames, seasons],
    queryFn: () => playerStatsService.getTeamPlayerStats(teamNames, seasons),
    staleTime: STATS_STALE,
    enabled: enabled && teamNames.length > 0 && seasons.length > 0,
  })
}

// Scouting hooks — domestic / overseas T20-league signals used by /scout.

// Curated shortlist of scout-worthy players.
export function useScoutTargets() {
  return useQuery({ queryKey: ['scout-targets'], queryFn: dataService.getScoutTargets, staleTime: STALE })
}

// Full scout dataset across leagues.
export function useScoutAll() {
  return useQuery({ queryKey: ['scout-all'], queryFn: dataService.getScoutAll, staleTime: STALE })
}

// Single-league shard (e.g., BBL, PSL, CPL).
export function useScoutLeague(code: string) {
  return useQuery({
    queryKey: ['scout-league', code],
    queryFn: () => dataService.getScoutLeague(code),
    staleTime: STALE,
    enabled: !!code,
  })
}

// Crossover players who appear both in IPL and another league's data.
export function useIPLCrossover() {
  return useQuery({ queryKey: ['ipl-crossover'], queryFn: dataService.getIPLCrossover, staleTime: STALE })
}

// SWOT analysis: returns strengths/weaknesses/opportunities/threats for a
// team in a season, derived from squad composition + per-player stats.
export function useSwotAnalysis(
  teamName: string | undefined,
  season: string | undefined,
  playerTeams: Record<string, any[]> | undefined,
  playerStats: any[] | undefined,
  teamAliases: string[] = []
) {
  return useQuery<SwotAnalysis>({
    queryKey: ['swot-analysis', teamName, season],
    queryFn: () =>
      getSwotAnalysis(teamName!, season!, playerTeams!, playerStats!, teamAliases),
    staleTime: STATS_STALE,
    enabled: !!teamName && !!season && !!playerTeams && !!playerStats,
  })
}
