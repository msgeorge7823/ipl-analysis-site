/**
 * Data Service — static JSON loaders for all IPL datasets.
 *
 * Two parallel layouts under /public/data/:
 *
 *   1. `_backup/*.json` — monolith archive (single file per dataset).
 *      Existing list loaders (getTeams, getCoaches, getPlayers, …) read from
 *      here. Fast for bulk list queries; the only copy of datasets that are
 *      too small to shard (photos, facts, news, sponsors, name-mapping).
 *
 *   2. `{section}/{id}.json` — per-entity shards.
 *      One file per team, coach, venue, player, etc., each fully self-contained
 *      and GitHub-browseable for auditing. The shard loaders (getTeamById,
 *      getCoachById, …) read from here when a single entity is needed.
 *
 * Both layouts are kept in sync by `scripts/shard-data.py`.
 */

const BASE = '/data'

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/${path}`)
  if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`)
  return res.json()
}

// ────────────────────────────── monolith (bulk) ──────────────────────────────
// Kept for list views that need every record at once. Served from _backup/.

const BACKUP = '_backup'

const bulk = {
  getPlayers:           () => fetchJSON<any[]>(`${BACKUP}/players.json`),
  getPlayersIndex:      () => fetchJSON<any[]>(`${BACKUP}/players-index.json`),
  getTeams:             () => fetchJSON<any[]>(`${BACKUP}/teams.json`),
  getSeasons:           () => fetchJSON<any[]>(`${BACKUP}/seasons.json`),
  getVenues:            () => fetchJSON<any[]>(`${BACKUP}/venues.json`),
  getPlayerStats:       () => fetchJSON<any[]>(`${BACKUP}/player-stats.json`),
  getPlayerTeams:       () => fetchJSON<Record<string, any[]>>(`${BACKUP}/player-teams.json`),
  getReplacementPlayers:() => fetchJSON<Record<string, any[]>>(`${BACKUP}/replacement-players.json`),
  getCoaches:           () => fetchJSON<{ coaches: any[] }>(`${BACKUP}/coaches.json`).then(f => f.coaches),
  getPlayerPhotos:      () => fetchJSON<{ photos: Record<string, string> }>(`${BACKUP}/player-photos.json`).then(f => f.photos),
  getCoachPhotos:       () => fetchJSON<{ photos: Record<string, string> }>(`${BACKUP}/coach-photos.json`).then(f => f.photos),
  getIPLFacts:          () => fetchJSON<any>(`${BACKUP}/ipl-facts.json`),
  getIPLNews:           () => fetchJSON<{ items: any[] }>(`${BACKUP}/ipl-news.json`).then(f => f.items),
  getIPLSponsors:       () => fetchJSON<any>(`${BACKUP}/ipl-sponsors.json`),
  getOfficialSquads:    () => fetchJSON<Record<string, any>>(`${BACKUP}/squads-2026.json`),
  getSquadNameMapping:  () => fetchJSON<Record<string, string>>(`${BACKUP}/squad-name-mapping.json`),
  getManifest:          () => fetchJSON<any>(`${BACKUP}/manifest.json`),
}

// ───────────────────────────── per-season sharded ─────────────────────────────
// Already split into one file per year; no change from before.

const perSeason = {
  getMatches:       (season: string) => fetchJSON<any[]>(`matches/season-${season}.json`),
  getBatting:       (season: string) => fetchJSON<any[]>(`scorecards/batting-${season}.json`),
  getBowling:       (season: string) => fetchJSON<any[]>(`scorecards/bowling-${season}.json`),
  getBBB:           (season: string) => fetchJSON<any[]>(`bbb/season-${season}.json`),
  getPartnerships:  (season: string) => fetchJSON<any[]>(`partnerships/season-${season}.json`),
  getCapRace:       (season: string) => fetchJSON<any>(`cap-race/season-${season}.json`),
}

// ──────────────────────────────── scouting ────────────────────────────────

const scouting = {
  getScoutTargets:   () => fetchJSON<any[]>('scouting/scout-targets.json'),
  getScoutAll:       () => fetchJSON<any[]>('scouting/all-players.json'),
  getScoutLeague:    (code: string) => fetchJSON<any[]>(`scouting/${code}.json`),
  getIPLCrossover:   () => fetchJSON<any[]>('scouting/ipl-crossover.json'),
}

// ─────────────────────────── sharded detail loaders ───────────────────────────
// One file per entity under /data/{section}/{id}.json. Use these when a page
// only needs one record — avoids loading the full monolith.

const shards = {
  // Team
  getTeamById:             (id: string) => fetchJSON<any>(`teams/${id}.json`),
  getTeamsIndex:           () => fetchJSON<any[]>('teams/index.json'),

  // Coach
  getCoachById:            (id: string) => fetchJSON<any>(`coaches/${id}.json`),
  getCoachesIndex:         () => fetchJSON<{ coaches: any[] }>('coaches/index.json'),

  // Venue (slug = kebab-case of name, matches files under venues/)
  getVenueBySlug:          (slug: string) => fetchJSON<any>(`venues/${slug}.json`),
  getVenuesIndex:          () => fetchJSON<any[]>('venues/index.json'),

  // Season
  getSeasonByYear:         (year: string) => fetchJSON<any>(`seasons/${year}.json`),
  getSeasonsIndex:         () => fetchJSON<any[]>('seasons/index.json'),

  // Player
  getPlayerById:           (id: string) => fetchJSON<any>(`players/${id}.json`),
  getPlayersShardIndex:    () => fetchJSON<any[]>('players/index.json'),

  // Squad (one roster per team-season)
  getSquadForTeamSeason:   (year: string, teamId: string) =>
                             fetchJSON<any>(`squads/${year}/${teamId}.json`),

  // Replacements
  getReplacementsForSeason:(year: string) =>
                             fetchJSON<{ season: string; players: any[] }>(`replacements/${year}.json`),

  // Reference (mirrored from monoliths for GitHub browsing; monolith remains source)
  getReferenceFacts:       () => fetchJSON<any>('reference/ipl-facts.json'),
  getReferenceNews:        () => fetchJSON<any>('reference/ipl-news.json'),
  getReferenceSponsors:    () => fetchJSON<any>('reference/ipl-sponsors.json'),
}

// ───────────────────────────────── export ─────────────────────────────────

export const dataService = {
  ...bulk,
  ...perSeason,
  ...scouting,
  ...shards,
}
