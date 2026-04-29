// Players landing page (/players).
// Searchable, filterable directory of every IPL player. Filters: country,
// role, batting / bowling style, team, season, status. Search is fuzzy
// (Fuse.js) and case-insensitive substring across name + nicknames.
import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Fuse from 'fuse.js'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { usePlayers, usePlayerStats, useTeams, useSeasons, useOfficialSquads, usePlayerPhotos, useCoaches } from '@/hooks/useData'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { TEAM_COLORS, TEAM_SHORT } from '@/lib/constants'
import Avatar from '@/components/ui/Avatar'
import OverseasBadge from '@/components/ui/OverseasBadge'
import { buildOverseasLookup, isOverseasPlayer, getPlayerCountry, isCappedPlayer, COUNTRY_LIST } from '@/lib/nationality'

const PLAYERS_PER_PAGE = 20

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

const ROLE_STYLE: Record<string, { bg: string; text: string }> = {
  Batter: { bg: 'bg-blue-500/15', text: 'text-blue-400' },
  Bowler: { bg: 'bg-emerald-500/15', text: 'text-emerald-400' },
  'All-rounder': { bg: 'bg-orange-500/15', text: 'text-orange-400' },
  'WK-Batter': { bg: 'bg-purple-500/15', text: 'text-purple-400' },
  WK: { bg: 'bg-purple-500/15', text: 'text-purple-400' },
  Unknown: { bg: 'bg-zinc-500/15', text: 'text-zinc-400' },
}

const STATUS_CHOICES = ['active', 'inactive', 'retired'] as const

export default function Players() {
  const { data: players, isLoading } = usePlayers()
  const { data: stats } = usePlayerStats()
  const { data: teams } = useTeams()
  const { data: seasons } = useSeasons()
  const { data: officialSquads } = useOfficialSquads()
  const { data: playerPhotos } = usePlayerPhotos()
  const { data: coaches } = useCoaches()

  // Set of player IDs who went on to become IPL coaches — derived from
  // coaches.json entries whose `playingCareerPlayerId` links back to a
  // player profile. Used by the "Turned Coach" career-arc filter.
  const playerCoachIds = useMemo(() => {
    const set = new Set<string>()
    for (const c of (coaches || []) as any[]) {
      if (c.playingCareerPlayerId) set.add(c.playingCareerPlayerId)
    }
    return set
  }, [coaches])

  // Map player ID → the coach profile they became (so the UI can link
  // straight from the player card to /coaches/:id when the filter is on).
  const playerToCoach = useMemo(() => {
    const map = new Map<string, any>()
    for (const c of (coaches || []) as any[]) {
      if (c.playingCareerPlayerId) map.set(c.playingCareerPlayerId, c)
    }
    return map
  }, [coaches])

  // Name → overseas lookup derived from the current-season official squads.
  const overseasLookup = useMemo(() => buildOverseasLookup(officialSquads), [officialSquads])

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [viewMode, setViewMode] = useLocalStorage<'grid' | 'table'>('ipl-players-view', 'grid')

  // Filters
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set())
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set())
  const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set())
  const [selectedDebutSeasons, setSelectedDebutSeasons] = useState<Set<string>>(new Set())
  const [selectedCountries, setSelectedCountries] = useState<Set<string>>(new Set())
  const [selectedCapStatus, setSelectedCapStatus] = useState<Set<string>>(new Set()) // 'capped' / 'uncapped'
  // "Career Arc" — creative filter for players who went on to coach in the IPL.
  const [turnedCoachOnly, setTurnedCoachOnly] = useState<boolean>(false)

  // Mobile filter drawer
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Collapsible filter sections
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    careerArc: true,
    team: true,
    role: true,
    status: true,
    debut: false,
    country: true,
    cap: true,
  })

  const toggleSection = useCallback((key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
  }, [])

  const statsMap = useMemo(() => {
    if (!stats) return {} as Record<string, any>
    const map: Record<string, any> = {}
    for (const s of stats) map[s.playerId] = s
    return map
  }, [stats])

  const fuse = useMemo(() => {
    if (!players) return null
    return new Fuse(players, { keys: ['name', 'fullName', 'shortName', 'nicknames', 'teams'], threshold: 0.3 })
  }, [players])

  const activeTeams = useMemo(() => {
    return (teams || []).filter(t => !t.isDefunct)
  }, [teams])

  // Defunct-franchise pills shown in their own "Defunct Teams" block
  // below the active teams. Sorted chronologically by first year the
  // franchise existed so they read as a historical timeline.
  const defunctTeams = useMemo(() => {
    const defunctOrder: Record<string, number> = {
      'Deccan Chargers': 2008,
      'Kochi Tuskers Kerala': 2011,
      'Pune Warriors': 2011,
      'Gujarat Lions': 2016,
      'Rising Pune Supergiant': 2016,
    }
    const list = (teams || []).filter(t => t.isDefunct)
    return list.slice().sort((a, b) => {
      const ao = defunctOrder[a.name] ?? 9999
      const bo = defunctOrder[b.name] ?? 9999
      return ao - bo
    })
  }, [teams])

  // Short era label for each defunct team (shown as subtitle on the pill).
  const DEFUNCT_ERA: Record<string, string> = {
    'Deccan Chargers': '2008–2012',
    'Kochi Tuskers Kerala': '2011',
    'Pune Warriors': '2011–2013',
    'Gujarat Lions': '2016–2017',
    'Rising Pune Supergiant': '2016–2017',
  }

  // Sorted list of all IPL season years (descending — newest first)
  const seasonYears = useMemo(() => {
    return (seasons || [])
      .map((s: any) => s.year)
      .sort((a: string, b: string) => b.localeCompare(a))
  }, [seasons])

  // Debut season per player = earliest year in their seasons array
  const debutSeasonMap = useMemo(() => {
    const map: Record<string, string> = {}
    for (const p of players || []) {
      const ys = p.seasons || []
      if (ys.length > 0) map[p.id] = [...ys].sort()[0]
    }
    return map
  }, [players])

  const filtered = useMemo(() => {
    let list = players || []

    // Search (case-insensitive substring across name, fullName, shortName, nicknames, or fuzzy)
    if (search.length >= 2) {
      const lower = search.toLowerCase()
      const substringMatches = list.filter(p =>
        p.name?.toLowerCase().includes(lower) ||
        p.fullName?.toLowerCase().includes(lower) ||
        p.shortName?.toLowerCase().includes(lower) ||
        p.nicknames?.some((n: string) => n.toLowerCase().includes(lower))
      )
      if (substringMatches.length > 0) {
        list = substringMatches
      } else if (fuse) {
        list = fuse.search(search).map(r => r.item)
      }
    }

    // Filter by team
    if (selectedTeams.size > 0) {
      list = list.filter(p =>
        p.teams?.some((t: string) => selectedTeams.has(t))
      )
    }

    // Filter by role
    if (selectedRoles.size > 0) {
      list = list.filter(p => {
        const role = inferRole(statsMap[p.id], p.role)
        return selectedRoles.has(role)
      })
    }

    // Filter by status
    if (selectedStatuses.size > 0) {
      list = list.filter(p => selectedStatuses.has(p.status))
    }

    // Filter by debut season (player's earliest IPL season)
    if (selectedDebutSeasons.size > 0) {
      list = list.filter(p => selectedDebutSeasons.has(debutSeasonMap[p.id]))
    }

    // Country filter (multi-select). Treats "India" as the default for any
    // unknown name so the long tail of domestic-only players still appears.
    if (selectedCountries.size > 0) {
      list = list.filter(p => {
        const c = getPlayerCountry(p.name) ?? getPlayerCountry(p.shortName)
        if (c) return selectedCountries.has(c)
        return selectedCountries.has('India')
      })
    }

    // Capped / Uncapped filter (multi-select).
    if (selectedCapStatus.size > 0) {
      list = list.filter(p => {
        const capped = isCappedPlayer(p.name) ?? isCappedPlayer(p.shortName)
        if (selectedCapStatus.has('capped') && capped === true) return true
        if (selectedCapStatus.has('uncapped') && capped !== true) return true
        return false
      })
    }

    // Career-arc filter — "turned coach" only.
    if (turnedCoachOnly) {
      list = list.filter(p => playerCoachIds.has(p.id))
    }

    // Sort by runs descending by default
    list = [...list].sort((a, b) => {
      const sa = statsMap[a.id], sb = statsMap[b.id]
      if (!sa && !sb) return 0
      if (!sa) return 1
      if (!sb) return -1
      return sb.runs - sa.runs
    })

    return list
  }, [players, search, selectedTeams, selectedRoles, selectedStatuses, selectedDebutSeasons, selectedCountries, selectedCapStatus, debutSeasonMap, turnedCoachOnly, playerCoachIds, fuse, statsMap])

  // Reset page when filters change
  const totalPages = Math.ceil(filtered.length / PLAYERS_PER_PAGE)
  const currentPage = Math.min(page, totalPages || 1)
  const paginated = filtered.slice((currentPage - 1) * PLAYERS_PER_PAGE, currentPage * PLAYERS_PER_PAGE)

  // Active filter count
  const activeFilterCount = selectedTeams.size + selectedRoles.size + selectedStatuses.size + selectedDebutSeasons.size + selectedCountries.size + selectedCapStatus.size + (turnedCoachOnly ? 1 : 0)

  // Toggle helpers
  const toggleTeam = (name: string) => {
    setSelectedTeams(prev => {
      const n = new Set(prev)
      n.has(name) ? n.delete(name) : n.add(name)
      return n
    })
    setPage(1)
  }
  const toggleRole = (role: string) => {
    setSelectedRoles(prev => {
      const n = new Set(prev)
      n.has(role) ? n.delete(role) : n.add(role)
      return n
    })
    setPage(1)
  }
  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => {
      const n = new Set(prev)
      n.has(status) ? n.delete(status) : n.add(status)
      return n
    })
    setPage(1)
  }
  const toggleDebutSeason = (year: string) => {
    setSelectedDebutSeasons(prev => {
      const n = new Set(prev)
      n.has(year) ? n.delete(year) : n.add(year)
      return n
    })
    setPage(1)
  }
  const toggleCountry = (country: string) => {
    setSelectedCountries(prev => {
      const n = new Set(prev)
      n.has(country) ? n.delete(country) : n.add(country)
      return n
    })
    setPage(1)
  }
  const toggleCapStatus = (status: string) => {
    setSelectedCapStatus(prev => {
      const n = new Set(prev)
      n.has(status) ? n.delete(status) : n.add(status)
      return n
    })
    setPage(1)
  }
  const clearAll = () => {
    setSelectedTeams(new Set())
    setSelectedRoles(new Set())
    setSelectedStatuses(new Set())
    setSelectedDebutSeasons(new Set())
    setSelectedCountries(new Set())
    setSelectedCapStatus(new Set())
    setTurnedCoachOnly(false)
    setSearch('')
    setPage(1)
  }

  // Determine team color for avatar gradient
  const getTeamColor = (p: any) => {
    const lastTeam = p.lastTeam || p.teams?.[p.teams.length - 1]
    return TEAM_COLORS[lastTeam]?.primary || '#6366f1'
  }

  // Stat display for card
  const getStatDisplay = (s: any, role: string) => {
    if (!s) return { value: '-', label: 'No stats' }
    if (role === 'Bowler') return { value: s.wickets.toLocaleString(), label: 'Wickets' }
    if (role === 'All-rounder') return { value: s.runs.toLocaleString(), label: `Runs \u00b7 ${s.wickets} Wkts` }
    if (role === 'WK') return { value: s.runs.toLocaleString(), label: `Runs \u00b7 ${s.catches} Ct` }
    return { value: s.runs.toLocaleString(), label: 'Runs' }
  }

  if (isLoading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-16 text-center text-textSecondary">
        Loading players...
      </div>
    )
  }

  // Pagination range
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('ellipsis')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <Breadcrumb items={[{ label: 'Players' }]} />
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">All Players</h1>
          <p className="text-textSecondary mt-1 text-sm">{filtered.length} players</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setMobileFiltersOpen(v => !v)}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center bg-card border border-border text-textSecondary hover:bg-cardHover relative"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 4h18M3 12h12M3 20h6"/></svg>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[10px] font-bold text-white flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${viewMode === 'grid' ? 'bg-accent/10 border border-accent/30 text-accent' : 'bg-card border border-border text-textSecondary hover:bg-cardHover'}`}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${viewMode === 'table' ? 'bg-accent/10 border border-accent/30 text-accent' : 'bg-card border border-border text-textSecondary hover:bg-cardHover'}`}
          >
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><rect x="1" y="2" width="14" height="2" rx="0.5"/><rect x="1" y="7" width="14" height="2" rx="0.5"/><rect x="1" y="12" width="14" height="2" rx="0.5"/></svg>
          </button>
        </div>
      </div>

      {/* Active Filters Tags */}
      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-xs text-textSecondary font-medium uppercase tracking-wider">Active Filters:</span>
          {Array.from(selectedTeams).map(t => (
            <span key={t} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
              {TEAM_SHORT[t] || t}
              <button onClick={() => toggleTeam(t)} className="ml-0.5 hover:text-white">&times;</button>
            </span>
          ))}
          {Array.from(selectedRoles).map(r => (
            <span key={r} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              {r}
              <button onClick={() => toggleRole(r)} className="ml-0.5 hover:text-white">&times;</button>
            </span>
          ))}
          {Array.from(selectedStatuses).map(s => (
            <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium capitalize">
              {s}
              <button onClick={() => toggleStatus(s)} className="ml-0.5 hover:text-white">&times;</button>
            </span>
          ))}
          {Array.from(selectedDebutSeasons).sort().map(y => (
            <span key={y} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium">
              Debut {y}
              <button onClick={() => toggleDebutSeason(y)} className="ml-0.5 hover:text-white">&times;</button>
            </span>
          ))}
          {Array.from(selectedCountries).map(c => (
            <span key={c} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium">
              {c}
              <button onClick={() => toggleCountry(c)} className="ml-0.5 hover:text-white">&times;</button>
            </span>
          ))}
          {Array.from(selectedCapStatus).map(s => (
            <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-sm font-medium capitalize">
              {s}
              <button onClick={() => toggleCapStatus(s)} className="ml-0.5 hover:text-white">&times;</button>
            </span>
          ))}
          {turnedCoachOnly && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-medium">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
              Turned Coach
              <button onClick={() => setTurnedCoachOnly(false)} className="ml-0.5 hover:text-white">&times;</button>
            </span>
          )}
          <button onClick={clearAll} className="text-sm text-red-400 hover:text-red-300 ml-2 font-medium">Clear All</button>
        </div>
      )}

      {/* Mobile Filter Drawer */}
      {mobileFiltersOpen && (
        <div className="lg:hidden mb-6">
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-textSecondary hover:text-textPrimary p-1">
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Career Arc (mobile) */}
            <div className="mb-5">
              <button
                onClick={() => { setTurnedCoachOnly(v => !v); setPage(1) }}
                className={`w-full text-left rounded-xl border p-3 transition-all ${
                  turnedCoachOnly
                    ? 'bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-transparent border-purple-400/50'
                    : 'bg-gradient-to-br from-purple-500/8 via-transparent to-transparent border-border'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${turnedCoachOnly ? 'bg-purple-500/30' : 'bg-purple-500/10'}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={turnedCoachOnly ? 'text-purple-300' : 'text-purple-400/70'}>
                      <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold leading-tight ${turnedCoachOnly ? 'text-purple-200' : 'text-white'}`}>
                      Turned Coach
                    </div>
                    <div className="text-[11px] text-textSecondary mt-0.5">
                      Players who went on to coach. <span className="text-purple-400 font-semibold">{playerCoachIds.size}</span> players
                    </div>
                  </div>
                  <div className={`shrink-0 w-8 h-4 rounded-full relative ${turnedCoachOnly ? 'bg-purple-500' : 'bg-border'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${turnedCoachOnly ? 'left-[18px]' : 'left-0.5'}`} />
                  </div>
                </div>
              </button>
            </div>

            {/* Player Role */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('role')}
                className="flex items-center justify-between w-full cursor-pointer py-2 border-b border-border mb-3"
              >
                <span className="font-medium text-sm">Player Role</span>
                <svg className={`w-4 h-4 text-textSecondary transition-transform ${openSections.role ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openSections.role && (
                <div className="flex flex-wrap gap-2">
                  {['Batter', 'Bowler', 'All-rounder', 'WK'].map(role => {
                    const active = selectedRoles.has(role)
                    const style = ROLE_STYLE[role]
                    return (
                      <button
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${active ? `${style.bg} ${style.text} border-current/30` : 'bg-card text-textSecondary border-border hover:border-accent/30'}`}
                      >
                        {role}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* IPL Team */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('team')}
                className="flex items-center justify-between w-full cursor-pointer py-2 border-b border-border mb-3"
              >
                <span className="font-medium text-sm">IPL Team</span>
                <svg className={`w-4 h-4 text-textSecondary transition-transform ${openSections.team ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openSections.team && (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {activeTeams.map(t => {
                      const active = selectedTeams.has(t.name)
                      return (
                        <button
                          key={t.id}
                          onClick={() => toggleTeam(t.name)}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-colors ${active ? 'border-current/40' : 'border-border/40 hover:border-current/30'}`}
                          style={{
                            backgroundColor: t.primaryColor + (active ? '30' : '15'),
                            color: active ? t.primaryColor : t.primaryColor + 'cc',
                            borderColor: active ? t.primaryColor + '60' : undefined,
                          }}
                        >
                          {t.shortName}
                        </button>
                      )
                    })}
                  </div>
                  {defunctTeams.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-dashed border-border/60">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[10px] font-bold text-slate-400/90 uppercase tracking-wider">
                          Defunct Teams
                        </span>
                        <span className="text-[9px] text-textSecondary/70 italic ml-0.5">
                          (historical)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {defunctTeams.map(t => {
                          const active = selectedTeams.has(t.name)
                          const era = DEFUNCT_ERA[t.name] || ''
                          return (
                            <button
                              key={t.id}
                              onClick={() => toggleTeam(t.name)}
                              className={`group px-2.5 py-1 rounded-md border text-[10px] font-bold leading-tight text-left transition-all ${active ? 'border-current/50' : 'border-dashed border-border/50'}`}
                              style={{
                                backgroundColor: t.primaryColor + (active ? '22' : '0c'),
                                color: active ? t.primaryColor : t.primaryColor + 'a0',
                              }}
                              title={t.name}
                            >
                              <span className="flex items-center gap-1">
                                {t.shortName}
                                <span className="text-[8px] opacity-70">†</span>
                              </span>
                              {era && (
                                <span className="block text-[8px] font-normal opacity-60 mt-0.5">
                                  {era}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <button
                onClick={() => toggleSection('status')}
                className="flex items-center justify-between w-full cursor-pointer py-2 border-b border-border mb-3"
              >
                <span className="font-medium text-sm">Status</span>
                <svg className={`w-4 h-4 text-textSecondary transition-transform ${openSections.status ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openSections.status && (
                <div className="flex flex-wrap gap-2">
                  {STATUS_CHOICES.map(status => {
                    const active = selectedStatuses.has(status)
                    const colors = status === 'active'
                      ? { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' }
                      : status === 'retired'
                        ? { bg: 'bg-zinc-500/15', text: 'text-zinc-400', border: 'border-zinc-500/30' }
                        : { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' }
                    return (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-colors ${active ? `${colors.bg} ${colors.text} ${colors.border}` : 'bg-card text-textSecondary border-border'}`}
                      >
                        {status}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Debut Season */}
            <div className="mt-4">
              <button
                onClick={() => toggleSection('debut')}
                className="flex items-center justify-between w-full cursor-pointer py-2 border-b border-border mb-3"
              >
                <span className="font-medium text-sm">Debut Season</span>
                <svg className={`w-4 h-4 text-textSecondary transition-transform ${openSections.debut ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openSections.debut && (
                <div className="flex flex-wrap gap-2">
                  {seasonYears.map(y => {
                    const active = selectedDebutSeasons.has(y)
                    return (
                      <button
                        key={y}
                        onClick={() => toggleDebutSeason(y)}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-colors ${active ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-card text-textSecondary border-border hover:border-amber-500/30'}`}
                      >
                        {y}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Country */}
            <div className="mt-4">
              <button
                onClick={() => toggleSection('country')}
                className="flex items-center justify-between w-full cursor-pointer py-2 border-b border-border mb-3"
              >
                <span className="font-medium text-sm">Country</span>
                <svg className={`w-4 h-4 text-textSecondary transition-transform ${openSections.country ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openSections.country && (
                <div className="flex flex-wrap gap-2">
                  {COUNTRY_LIST.map(c => {
                    const active = selectedCountries.has(c)
                    return (
                      <button
                        key={c}
                        onClick={() => toggleCountry(c)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors ${active ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-card text-textSecondary border-border hover:border-cyan-500/30'}`}
                      >
                        {c}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Cap Status */}
            <div className="mt-4">
              <button
                onClick={() => toggleSection('cap')}
                className="flex items-center justify-between w-full cursor-pointer py-2 border-b border-border mb-3"
              >
                <span className="font-medium text-sm">Cap Status</span>
                <svg className={`w-4 h-4 text-textSecondary transition-transform ${openSections.cap ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openSections.cap && (
                <div className="flex flex-wrap gap-2">
                  {(['capped','uncapped'] as const).map(s => {
                    const active = selectedCapStatus.has(s)
                    return (
                      <button
                        key={s}
                        onClick={() => toggleCapStatus(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-colors ${active ? 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30' : 'bg-card text-textSecondary border-border hover:border-fuchsia-500/30'}`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {activeFilterCount > 0 && (
              <button onClick={clearAll} className="mt-4 text-sm text-red-400 hover:text-red-300 font-medium">Clear All Filters</button>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-4 lg:gap-6">
        {/* LEFT SIDEBAR: Filter Panel (desktop only) */}
        <aside className="w-72 shrink-0 hidden lg:block">
          <div className="bg-card border border-border rounded-2xl p-5 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-lg">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                  {activeFilterCount} active
                </span>
              )}
            </div>

            {/* ── Career Arc (creative filter) ──────────────────────
                A gradient-accented toggle card for "players who also
                became IPL coaches". When off, shows a subtle call-to-
                action with the count. When on, the card glows with a
                graduation-cap vibe and the full list narrows to 58
                player-coaches across the league's history. */}
            <div className="mb-5">
              <button
                onClick={() => toggleSection('careerArc')}
                className="flex items-center justify-between w-full cursor-pointer py-2 border-b border-border mb-3"
              >
                <span className="font-medium text-sm flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-purple-400">
                    <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                  </svg>
                  Career Arc
                </span>
                <svg className={`w-4 h-4 text-textSecondary transition-transform ${openSections.careerArc ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openSections.careerArc && (
                <button
                  onClick={() => { setTurnedCoachOnly(v => !v); setPage(1) }}
                  className={`w-full text-left rounded-xl border p-3 transition-all ${
                    turnedCoachOnly
                      ? 'bg-gradient-to-br from-purple-500/25 via-indigo-500/15 to-transparent border-purple-400/50 shadow-lg shadow-purple-500/10'
                      : 'bg-gradient-to-br from-purple-500/8 via-transparent to-transparent border-border hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {/* Icon toggle circle */}
                    <div
                      className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                        turnedCoachOnly
                          ? 'bg-purple-500/30 shadow-inner'
                          : 'bg-purple-500/10'
                      }`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={turnedCoachOnly ? 'text-purple-300' : 'text-purple-400/70'}>
                        <path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-bold leading-tight ${turnedCoachOnly ? 'text-purple-200' : 'text-white'}`}>
                        Turned Coach
                      </div>
                      <div className="text-[11px] text-textSecondary mt-0.5 leading-snug">
                        Players who went on to coach in the IPL.{' '}
                        <span className="text-purple-400 font-semibold">{playerCoachIds.size}</span>{' '}
                        players
                      </div>
                    </div>
                    {/* Toggle pill */}
                    <div
                      className={`shrink-0 w-8 h-4 rounded-full transition-all relative ${
                        turnedCoachOnly ? 'bg-purple-500' : 'bg-border'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${
                          turnedCoachOnly ? 'left-[18px]' : 'left-0.5'
                        }`}
                      />
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* Player Role */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('role')}
                className="flex items-center justify-between w-full cursor-pointer py-2 border-b border-border mb-3"
              >
                <span className="font-medium text-sm">Player Role</span>
                <svg className={`w-4 h-4 text-textSecondary transition-transform ${openSections.role ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openSections.role && (
                <div className="flex flex-wrap gap-2">
                  {['Batter', 'Bowler', 'All-rounder', 'WK'].map(role => {
                    const active = selectedRoles.has(role)
                    const style = ROLE_STYLE[role]
                    return (
                      <button
                        key={role}
                        onClick={() => toggleRole(role)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${active ? `${style.bg} ${style.text} border-current/30` : 'bg-card text-textSecondary border-border hover:border-accent/30'}`}
                      >
                        {role}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* IPL Team */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('team')}
                className="flex items-center justify-between w-full cursor-pointer py-2 border-b border-border mb-3"
              >
                <span className="font-medium text-sm">IPL Team</span>
                <svg className={`w-4 h-4 text-textSecondary transition-transform ${openSections.team ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openSections.team && (
                <div>
                  {/* Active franchises */}
                  <div className="flex flex-wrap gap-2">
                    {activeTeams.map(t => {
                      const active = selectedTeams.has(t.name)
                      return (
                        <button
                          key={t.id}
                          onClick={() => toggleTeam(t.name)}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-colors ${active ? 'border-current/40' : 'border-border/40 hover:border-current/30'}`}
                          style={{
                            backgroundColor: t.primaryColor + (active ? '30' : '15'),
                            color: active ? t.primaryColor : t.primaryColor + 'cc',
                            borderColor: active ? t.primaryColor + '60' : undefined,
                          }}
                        >
                          {t.shortName}
                        </button>
                      )
                    })}
                  </div>

                  {/* ── Defunct Teams sub-block ───────────────────
                      Historical franchises that no longer compete in
                      the IPL. Visually separated from the active
                      teams with a subtitle and a faded archival
                      aesthetic — pills show team short name on top
                      and era years below. A small obelisk † marks
                      each pill as historical. */}
                  {defunctTeams.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-dashed border-border/60">
                      <div className="flex items-center gap-1.5 mb-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400/70">
                          <path d="M12 7.5a.75.75 0 01.75.75v2h2a.75.75 0 010 1.5h-2V20a.75.75 0 01-1.5 0v-8.25h-2a.75.75 0 010-1.5h2v-2A.75.75 0 0112 7.5z" />
                          <path d="M11.25 2.75a.75.75 0 011.5 0V7h-1.5V2.75z" />
                        </svg>
                        <span className="text-[10px] font-bold text-slate-400/90 uppercase tracking-wider">
                          Defunct Teams
                        </span>
                        <span className="text-[9px] text-textSecondary/70 italic ml-0.5">
                          (historical)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {defunctTeams.map(t => {
                          const active = selectedTeams.has(t.name)
                          const era = DEFUNCT_ERA[t.name] || ''
                          return (
                            <button
                              key={t.id}
                              onClick={() => toggleTeam(t.name)}
                              className={`group relative px-2.5 py-1 rounded-md border text-[10px] font-bold leading-tight text-left transition-all ${active ? 'border-current/50' : 'border-dashed border-border/50 hover:border-current/30'}`}
                              style={{
                                backgroundColor: t.primaryColor + (active ? '22' : '0c'),
                                color: active ? t.primaryColor : t.primaryColor + 'a0',
                              }}
                              title={t.name}
                            >
                              <span className="flex items-center gap-1">
                                {t.shortName}
                                <span className="text-[8px] opacity-70">†</span>
                              </span>
                              {era && (
                                <span className="block text-[8px] font-normal opacity-60 mt-0.5">
                                  {era}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Status */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('status')}
                className="flex items-center justify-between w-full cursor-pointer py-2 border-b border-border mb-3"
              >
                <span className="font-medium text-sm">Status</span>
                <svg className={`w-4 h-4 text-textSecondary transition-transform ${openSections.status ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openSections.status && (
                <div className="flex flex-wrap gap-2">
                  {STATUS_CHOICES.map(status => {
                    const active = selectedStatuses.has(status)
                    const colors = status === 'active'
                      ? { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' }
                      : status === 'retired'
                        ? { bg: 'bg-zinc-500/15', text: 'text-zinc-400', border: 'border-zinc-500/30' }
                        : { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' }
                    return (
                      <button
                        key={status}
                        onClick={() => toggleStatus(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-colors ${active ? `${colors.bg} ${colors.text} ${colors.border}` : 'bg-card text-textSecondary border-border'}`}
                      >
                        {status}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Debut Season */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('debut')}
                className="flex items-center justify-between w-full cursor-pointer py-2 border-b border-border mb-3"
              >
                <span className="font-medium text-sm">Debut Season</span>
                <svg className={`w-4 h-4 text-textSecondary transition-transform ${openSections.debut ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openSections.debut && (
                <div className="flex flex-wrap gap-1.5">
                  {seasonYears.map(y => {
                    const active = selectedDebutSeasons.has(y)
                    return (
                      <button
                        key={y}
                        onClick={() => toggleDebutSeason(y)}
                        className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-colors ${active ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' : 'bg-card text-textSecondary border-border hover:border-amber-500/30'}`}
                      >
                        {y}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Country */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection('country')}
                className="flex items-center justify-between w-full cursor-pointer py-2 border-b border-border mb-3"
              >
                <span className="font-medium text-sm">Country</span>
                <svg className={`w-4 h-4 text-textSecondary transition-transform ${openSections.country ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openSections.country && (
                <div className="flex flex-wrap gap-1.5">
                  {COUNTRY_LIST.map(c => {
                    const active = selectedCountries.has(c)
                    return (
                      <button
                        key={c}
                        onClick={() => toggleCountry(c)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors ${active ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' : 'bg-card text-textSecondary border-border hover:border-cyan-500/30'}`}
                      >
                        {c}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Cap Status */}
            <div>
              <button
                onClick={() => toggleSection('cap')}
                className="flex items-center justify-between w-full cursor-pointer py-2 border-b border-border mb-3"
              >
                <span className="font-medium text-sm">Cap Status</span>
                <svg className={`w-4 h-4 text-textSecondary transition-transform ${openSections.cap ? '' : '-rotate-90'}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
              </button>
              {openSections.cap && (
                <div className="flex flex-wrap gap-2">
                  {(['capped','uncapped'] as const).map(s => {
                    const active = selectedCapStatus.has(s)
                    return (
                      <button
                        key={s}
                        onClick={() => toggleCapStatus(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border capitalize transition-colors ${active ? 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30' : 'bg-card text-textSecondary border-border hover:border-fuchsia-500/30'}`}
                      >
                        {s}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT */}
        <main className="flex-1 min-w-0">
          {/* Search Bar */}
          <div className="relative mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search players..."
              className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-textPrimary placeholder-textSecondary/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
            />
          </div>

          {/* Player Cards Grid */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {paginated.map(player => {
                const s = statsMap[player.id]
                const role = inferRole(s, player.role)
                const roleStyle = ROLE_STYLE[role] || ROLE_STYLE['Unknown']
                const teamColor = getTeamColor(player)
                const lastTeam = player.lastTeam || player.teams?.[player.teams.length - 1]
                const { value, label } = getStatDisplay(s, role)
                const coachProfile = playerToCoach.get(player.id)

                return (
                  <Link
                    key={player.id}
                    to={`/players/${player.id}`}
                    className="bg-card border border-border rounded-2xl p-5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all duration-200 cursor-pointer group relative"
                  >
                    {/* "Turned Coach" ribbon — shown when this player has a
                        coach profile. Clicks-through to the coach page. */}
                    {coachProfile && (
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          window.location.href = `/coaches/${coachProfile.id}`
                        }}
                        className="absolute top-3 right-3 z-10 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-400/40 text-purple-300 text-[9px] font-bold uppercase tracking-wider hover:bg-purple-500/30 transition-colors"
                        title="Also an IPL coach — view coach profile"
                      >
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L1 9l11 6 9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/></svg>
                        Coach
                      </button>
                    )}
                    <div className="flex flex-col items-center text-center">
                      <div className="relative mb-3 group-hover:scale-105 transition-transform">
                        <Avatar
                          id={player.id}
                          name={player.name}
                          kind="player"
                          sizePx={64}
                          color={teamColor}
                          initialsFontSizePx={20}
                          season={player.seasons?.[player.seasons.length - 1]}
                          photo={playerPhotos?.[`${player.id}_${player.seasons?.[player.seasons.length - 1]}`] || playerPhotos?.[player.id]}
                        />
                        {isOverseasPlayer(player.name, overseasLookup) === true && (
                          <span className="absolute -top-1 -right-1">
                            <OverseasBadge sizePx={12} />
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-base">{player.name}</h3>
                      <p className="text-textSecondary text-xs mt-0.5">
                        {player.seasons?.length || 0} seasons
                      </p>
                      <div className="flex items-center gap-2 mt-2.5">
                        <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${roleStyle.bg} ${roleStyle.text}`}>
                          {role}
                        </span>
                        {lastTeam && (
                          <span
                            className="px-2 py-0.5 rounded-md text-xs font-semibold"
                            style={{
                              backgroundColor: (TEAM_COLORS[lastTeam]?.primary || '#666') + '15',
                              color: TEAM_COLORS[lastTeam]?.primary || '#999',
                            }}
                          >
                            {TEAM_SHORT[lastTeam] || lastTeam}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 pt-3 border-t border-border w-full">
                        <span className="text-2xl font-bold gradient-text">{value}</span>
                        <p className="text-textSecondary text-xs mt-0.5">{label}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-textSecondary">
                      <th className="text-left px-4 py-3 font-medium">#</th>
                      <th className="text-left px-2 py-3 font-medium">Player</th>
                      <th className="text-left px-2 py-3 font-medium">Team</th>
                      <th className="text-left px-2 py-3 font-medium">Role</th>
                      <th className="text-right px-2 py-3 font-medium">Mat</th>
                      <th className="text-right px-2 py-3 font-medium">Runs</th>
                      <th className="text-right px-2 py-3 font-medium">Avg</th>
                      <th className="text-right px-2 py-3 font-medium">SR</th>
                      <th className="text-right px-4 py-3 font-medium">Wkts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {paginated.map((player, i) => {
                      const s = statsMap[player.id]
                      const role = inferRole(s, player.role)
                      const lastTeam = player.lastTeam || player.teams?.[player.teams.length - 1]
                      const teamColor = getTeamColor(player)
                      const overseas = isOverseasPlayer(player.name, overseasLookup) === true
                      return (
                        <tr key={player.id} className="hover:bg-white/5">
                          <td className="px-4 py-2.5 text-textSecondary font-bold">
                            {(currentPage - 1) * PLAYERS_PER_PAGE + i + 1}
                          </td>
                          <td className="px-2 py-2.5">
                            <Link to={`/players/${player.id}`} className="flex items-center gap-2.5 text-textPrimary hover:text-accent font-medium">
                              <Avatar id={player.id} name={player.name} kind="player" sizePx={32} color={teamColor} season={player.seasons?.[player.seasons.length - 1]} photo={playerPhotos?.[`${player.id}_${player.seasons?.[player.seasons.length - 1]}`] || playerPhotos?.[player.id]} />
                              <span>{player.name}</span>
                              {overseas && <OverseasBadge sizePx={11} />}
                            </Link>
                          </td>
                          <td className="px-2 py-2.5 text-textSecondary">
                            {lastTeam ? TEAM_SHORT[lastTeam] || lastTeam : '-'}
                          </td>
                          <td className="px-2 py-2.5">
                            <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${ROLE_STYLE[role].bg} ${ROLE_STYLE[role].text}`}>
                              {role}
                            </span>
                          </td>
                          <td className="text-right px-2 py-2.5 text-textSecondary">{s?.matches || 0}</td>
                          <td className="text-right px-2 py-2.5 font-bold text-orange-400">{s?.runs || 0}</td>
                          <td className="text-right px-2 py-2.5 text-textSecondary">{s?.battingAvg || 0}</td>
                          <td className="text-right px-2 py-2.5 text-textSecondary">{s?.strikeRate || 0}</td>
                          <td className="text-right px-4 py-2.5 text-purple-400">{s?.wickets || 0}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border gap-2">
              <p className="text-xs sm:text-sm text-textSecondary hidden sm:block">
                Showing {(currentPage - 1) * PLAYERS_PER_PAGE + 1} &ndash; {Math.min(currentPage * PLAYERS_PER_PAGE, filtered.length)} of {filtered.length}
              </p>
              <p className="text-xs text-textSecondary sm:hidden">
                {currentPage} / {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-textSecondary ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cardHover'}`}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>
                </button>
                {/* Page numbers hidden on mobile, shown on sm+ */}
                <div className="hidden sm:flex items-center gap-1">
                  {getPageNumbers().map((p, i) =>
                    p === 'ellipsis' ? (
                      <span key={`e${i}`} className="px-2 text-textSecondary text-sm">&hellip;</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => setPage(p as number)}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold ${currentPage === p ? 'bg-accent text-white' : 'bg-card border border-border text-textSecondary hover:bg-cardHover'}`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className={`w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-textSecondary ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-cardHover'}`}
                >
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
              <p className="text-sm text-textSecondary hidden md:block">Page {currentPage} of {totalPages}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
