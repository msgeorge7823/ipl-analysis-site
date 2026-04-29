// Coaches landing page (/coaches).
// Searchable directory of every IPL head coach + support staff member,
// with filters by role, franchise, and active/retired status.
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { useCoaches, useTeams, useCoachPhotos } from '@/hooks/useData'
import { TEAM_COLORS, TEAM_SHORT } from '@/lib/constants'
import type { Coach, CoachRoleType } from '@/types/coach'
import Avatar from '@/components/ui/Avatar'
import { ChevronDown } from 'lucide-react'

const ROLE_LABEL: Record<CoachRoleType, string> = {
  'head-coach': 'Head Coach',
  'assistant-coach': 'Assistant Coach',
  'batting-coach': 'Batting Coach',
  'bowling-coach': 'Bowling Coach',
  'fielding-coach': 'Fielding Coach',
  'fast-bowling-coach': 'Fast Bowling Coach',
  'spin-bowling-coach': 'Spin Bowling Coach',
  'mentor': 'Mentor',
  'director-of-cricket': 'Director of Cricket',
  'bowling-consultant': 'Bowling Consultant',
  'strength-conditioning': 'S&C Coach',
  'physio': 'Physio',
  'trainer': 'Trainer',
  'analyst': 'Analyst',
  'team-manager': 'Team Manager',
}

const ROLE_FILTER_CHOICES: CoachRoleType[] = [
  'head-coach',
  'assistant-coach',
  'batting-coach',
  'bowling-coach',
  'fielding-coach',
  'mentor',
  'director-of-cricket',
]

function currentTenure(coach: Coach) {
  return coach.tenures.find(t => t.seasons.includes('2026')) || coach.tenures[coach.tenures.length - 1]
}

function primaryRole(coach: Coach): CoachRoleType {
  const cur = currentTenure(coach)
  return cur?.role || 'head-coach'
}

export default function Coaches() {
  const { data: coaches, isLoading } = useCoaches()
  const { data: teams } = useTeams()
  const { data: coachPhotos } = useCoachPhotos()

  const [search, setSearch] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<Set<CoachRoleType>>(new Set())
  const [selectedTeams, setSelectedTeams] = useState<Set<string>>(new Set())
  const [selectedNations, setSelectedNations] = useState<Set<string>>(new Set())
  const [selectedSeasons, setSelectedSeasons] = useState<Set<string>>(new Set())

  // Accordion open/closed state per filter section. Defaults: Season + Team
  // open (most common), the rest collapsed to keep the rail tidy.
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    season: true,
    role: false,
    team: true,
    nation: false,
  })
  const toggleSection = (key: string) =>
    setOpenSections(s => ({ ...s, [key]: !s[key] }))
  const [showUnverified, setShowUnverified] = useState(true)

  // All franchises — active first, defunct (Deccan Chargers, Kochi Tuskers,
  // Pune Warriors, Gujarat Lions, Rising Pune Supergiant) listed after so the
  // user can still filter by who coached them while they existed.
  const displayTeams = useMemo(() => {
    const all = (teams || []).slice()
    all.sort((a, b) => {
      if (!!a.isDefunct === !!b.isDefunct) return a.name.localeCompare(b.name)
      return a.isDefunct ? 1 : -1
    })
    return all
  }, [teams])

  // Whether a given team played in any of the currently-selected seasons.
  // Used to disable defunct (and any other) teams that didn't exist in the
  // chosen window — selecting Deccan Chargers while filtering to 2024 would
  // never return results, so the button should grey out instead.
  const teamPlayedInSelectedSeasons = (t: { seasons?: string[] }) => {
    if (selectedSeasons.size === 0) return true
    const ts = t.seasons || []
    for (const s of ts) if (selectedSeasons.has(s)) return true
    return false
  }

  // All seasons that appear on any tenure. Sorted newest-first so the most
  // useful options are at the top of the picker.
  const allSeasons = useMemo(() => {
    const s = new Set<string>()
    for (const c of coaches || []) {
      for (const t of c.tenures || []) {
        for (const yr of t.seasons || []) s.add(yr)
      }
    }
    return Array.from(s).sort((a, b) => Number(b) - Number(a))
  }, [coaches])

  // Decompose compound nationality strings into the primary nationality
  // tokens a user actually wants to pick — e.g. "Trinidadian (West Indian)"
  // contributes both "Trinidadian" and "West Indian"; "Welsh / British"
  // contributes both "Welsh" and "British".
  const tokenizeNationality = (raw: string): string[] => {
    if (!raw) return []
    const tokens: string[] = []
    // Pull anything in parentheses out as its own token: "X (Y)" → ["X", "Y"]
    const parens = [...raw.matchAll(/\(([^)]+)\)/g)].map(m => m[1].trim())
    const sansParens = raw.replace(/\([^)]*\)/g, '').trim()
    // Split on " / " for compound primary nationalities
    for (const part of sansParens.split('/').map(s => s.trim()).filter(Boolean)) {
      // Strip any "India-born" style suffix; keep just the core nationality
      const core = part.replace(/\s+\([^)]*\)\s*$/, '').trim()
      if (core) tokens.push(core)
    }
    tokens.push(...parens)
    return tokens
  }

  const nationalities = useMemo(() => {
    const counts = new Map<string, number>()
    for (const c of coaches || []) {
      for (const t of tokenizeNationality(c.nationality)) {
        counts.set(t, (counts.get(t) || 0) + 1)
      }
    }
    // Sort by count desc so common nationalities come first; tie-break alphabetically.
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([n]) => n)
  }, [coaches])

  const filtered = useMemo(() => {
    let list: Coach[] = coaches || []
    if (search.length >= 2) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.fullName?.toLowerCase().includes(q) ||
        c.nationality.toLowerCase().includes(q) ||
        c.tenures.some(t => t.team.toLowerCase().includes(q))
      )
    }
    // Role / Team / Season must be evaluated on the SAME tenure, not as
    // independent any-tenure checks. Otherwise a coach who held different
    // roles or coached different teams in DIFFERENT years can leak through:
    // e.g. picking Team=KKR + Season=2024 would falsely include someone whose
    // KKR tenure ended in 2022 but who has a separate SRH tenure in 2024,
    // because each filter would find a different matching tenure.
    if (selectedRoles.size > 0 || selectedTeams.size > 0 || selectedSeasons.size > 0) {
      list = list.filter(c =>
        (c.tenures || []).some(t => {
          if (selectedRoles.size > 0 && !selectedRoles.has(t.role)) return false
          if (selectedTeams.size > 0 && !selectedTeams.has(t.team)) return false
          if (selectedSeasons.size > 0) {
            const seasons = t.seasons || []
            if (!seasons.some(yr => selectedSeasons.has(yr))) return false
          }
          return true
        })
      )
    }
    if (selectedNations.size > 0) {
      // Match if ANY of the coach's nationality tokens is in the selected
      // set — so picking "British" matches "Welsh / British", "West Indian"
      // matches "Trinidadian (West Indian)", and so on.
      list = list.filter(c => {
        const tokens = tokenizeNationality(c.nationality)
        return tokens.some(t => selectedNations.has(t))
      })
    }
    if (!showUnverified) {
      list = list.filter(c => c.verified)
    }
    return [...list].sort((a, b) => b.careerTotals.titles - a.careerTotals.titles || a.name.localeCompare(b.name))
  }, [coaches, search, selectedRoles, selectedTeams, selectedNations, selectedSeasons, showUnverified])

  const toggle = <T,>(set: Set<T>, setter: (s: Set<T>) => void, val: T) => {
    const n = new Set(set)
    n.has(val) ? n.delete(val) : n.add(val)
    setter(n)
  }

  if (isLoading) {
    return <div className="max-w-[1440px] mx-auto px-4 py-16 text-center text-textSecondary">Loading coaches...</div>
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'Coaches & Support Staff' }]} />

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Coaches &amp; Support Staff</h1>
        <p className="text-textSecondary mt-1 text-sm">
          {filtered.length} {filtered.length === 1 ? 'person' : 'people'} across all IPL franchises since 2008
        </p>
      </div>

      {(coaches?.length || 0) === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 text-center text-amber-300 mb-6">
          <p className="font-semibold mb-1">Coach database is being built.</p>
          <p className="text-sm text-amber-300/80">
            Phase 1 (head coaches, 2008-2026) is in progress. Entries will populate as research is verified. Check back shortly.
          </p>
        </div>
      )}

      <div className="flex gap-6">
        <aside className="w-72 shrink-0 hidden lg:block">
          {/* Filter rail. The inner div is the scroll container — capping
              max-height at viewport-minus-header and using `overscroll-contain`
              keeps the scroll wheel inside this card instead of bleeding into
              the page when the user reaches the top/bottom. */}
          <div className="bg-card border border-border rounded-2xl sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain">
            <div className="p-5 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-lg">Filters</h2>
                {(selectedRoles.size + selectedTeams.size + selectedNations.size + selectedSeasons.size) > 0 && (
                  <button
                    onClick={() => {
                      setSelectedRoles(new Set())
                      setSelectedTeams(new Set())
                      setSelectedNations(new Set())
                      setSelectedSeasons(new Set())
                    }}
                    className="text-xs text-accent hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* SEASON */}
              <div className="border-t border-border pt-3">
                <button
                  onClick={() => toggleSection('season')}
                  className="w-full flex items-center justify-between text-sm font-medium hover:text-accent transition-colors"
                >
                  <span>Season{selectedSeasons.size > 0 ? ` (${selectedSeasons.size})` : ''}</span>
                  <ChevronDown size={16} className={`transition-transform ${openSections.season ? 'rotate-180' : ''}`} />
                </button>
                {openSections.season && (
                  <div className="mt-3 flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                    {allSeasons.map(yr => {
                      const active = selectedSeasons.has(yr)
                      return (
                        <button
                          key={yr}
                          onClick={() => toggle(selectedSeasons, setSelectedSeasons, yr)}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-card text-textSecondary border-border hover:border-emerald-500/30'}`}
                        >
                          {yr}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* ROLE */}
              <div className="border-t border-border pt-3">
                <button
                  onClick={() => toggleSection('role')}
                  className="w-full flex items-center justify-between text-sm font-medium hover:text-accent transition-colors"
                >
                  <span>Role{selectedRoles.size > 0 ? ` (${selectedRoles.size})` : ''}</span>
                  <ChevronDown size={16} className={`transition-transform ${openSections.role ? 'rotate-180' : ''}`} />
                </button>
                {openSections.role && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {ROLE_FILTER_CHOICES.map(r => {
                      const active = selectedRoles.has(r)
                      return (
                        <button
                          key={r}
                          onClick={() => toggle(selectedRoles, setSelectedRoles, r)}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${active ? 'bg-accent/20 text-accent border-accent/40' : 'bg-card text-textSecondary border-border hover:border-accent/30'}`}
                        >
                          {ROLE_LABEL[r]}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* TEAM */}
              <div className="border-t border-border pt-3">
                <button
                  onClick={() => toggleSection('team')}
                  className="w-full flex items-center justify-between text-sm font-medium hover:text-accent transition-colors"
                >
                  <span>Team{selectedTeams.size > 0 ? ` (${selectedTeams.size})` : ''}</span>
                  <ChevronDown size={16} className={`transition-transform ${openSections.team ? 'rotate-180' : ''}`} />
                </button>
                {openSections.team && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {displayTeams.map(t => {
                      const active = selectedTeams.has(t.name)
                      const defunct = !!t.isDefunct
                      // When a season filter is active, teams that didn't play
                      // any of those seasons can't possibly match — render the
                      // button as disabled so the user doesn't pick a dead end.
                      const eligible = teamPlayedInSelectedSeasons(t)
                      return (
                        <button
                          key={t.id}
                          disabled={!eligible && !active}
                          onClick={() => toggle(selectedTeams, setSelectedTeams, t.name)}
                          title={
                            !eligible && !active
                              ? `${t.name} did not play in the selected season(s)`
                              : defunct
                                ? `${t.name} (defunct, ${t.seasons?.[0]}–${t.seasons?.[t.seasons.length - 1]})`
                                : t.name
                          }
                          className={`px-2.5 py-1 rounded-md text-xs font-bold border transition ${defunct ? 'border-dashed' : ''} ${(!eligible && !active) ? 'opacity-30 cursor-not-allowed' : defunct ? 'opacity-70' : ''}`}
                          style={{
                            backgroundColor: t.primaryColor + (active ? '30' : '15'),
                            color: active ? t.primaryColor : t.primaryColor + 'cc',
                            borderColor: active ? t.primaryColor + '60' : (defunct ? t.primaryColor + '40' : 'transparent'),
                          }}
                        >
                          {t.shortName}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* NATIONALITY */}
              {nationalities.length > 0 && (
                <div className="border-t border-border pt-3">
                  <button
                    onClick={() => toggleSection('nation')}
                    className="w-full flex items-center justify-between text-sm font-medium hover:text-accent transition-colors"
                  >
                    <span>Nationality{selectedNations.size > 0 ? ` (${selectedNations.size})` : ''}</span>
                    <ChevronDown size={16} className={`transition-transform ${openSections.nation ? 'rotate-180' : ''}`} />
                  </button>
                  {openSections.nation && (
                    <div className="mt-3 flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
                      {nationalities.map(n => {
                        const active = selectedNations.has(n)
                        return (
                          <button
                            key={n}
                            onClick={() => toggle(selectedNations, setSelectedNations, n)}
                            className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${active ? 'bg-blue-500/20 text-blue-400 border-blue-500/40' : 'bg-card text-textSecondary border-border hover:border-blue-500/30'}`}
                          >
                            {n}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              <div className="pt-3 border-t border-border">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showUnverified}
                    onChange={e => setShowUnverified(e.target.checked)}
                    className="accent-amber-500"
                  />
                  <span>Show unverified entries</span>
                </label>
                <p className="text-xs text-textSecondary mt-1">
                  Flagged with a yellow badge — pending your cross-check.
                </p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="relative mb-6">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search coaches by name, team, or nationality..."
              className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-textPrimary placeholder-textSecondary/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(coach => {
              const cur = currentTenure(coach)
              const role = primaryRole(coach)
              const teamColor = (cur && TEAM_COLORS[cur.team]?.primary) || '#6366f1'
              return (
                <Link
                  key={coach.id}
                  to={`/coaches/${coach.id}`}
                  className="bg-card border border-border rounded-2xl p-5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all group relative"
                >
                  {!coach.verified && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                      Unverified
                    </span>
                  )}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-3 group-hover:scale-105 transition-transform">
                      <Avatar
                        id={coach.id}
                        name={coach.name}
                        kind="coach"
                        sizePx={64}
                        color={teamColor}
                        initialsFontSizePx={20}
                        photo={coachPhotos?.[coach.id]}
                      />
                    </div>
                    <h3 className="font-semibold text-base">{coach.name}</h3>
                    <p className="text-textSecondary text-xs mt-0.5">{coach.nationality}</p>
                    <div className="flex items-center gap-2 mt-2.5 flex-wrap justify-center">
                      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-indigo-500/15 text-indigo-400">
                        {ROLE_LABEL[role]}
                      </span>
                      {cur && (
                        <span
                          className="px-2 py-0.5 rounded-md text-xs font-semibold"
                          style={{
                            backgroundColor: (TEAM_COLORS[cur.team]?.primary || '#666') + '15',
                            color: TEAM_COLORS[cur.team]?.primary || '#999',
                          }}
                        >
                          {TEAM_SHORT[cur.team] || cur.team}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border w-full grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold gradient-text">{coach.careerTotals.titles}</div>
                        <div className="text-[10px] text-textSecondary uppercase tracking-wider">Titles</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold gradient-text">{coach.careerTotals.seasonsCoached}</div>
                        <div className="text-[10px] text-textSecondary uppercase tracking-wider">Seasons</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold gradient-text">{coach.careerTotals.league.winPct.toFixed(0)}%</div>
                        <div className="text-[10px] text-textSecondary uppercase tracking-wider">League&nbsp;W%</div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {filtered.length === 0 && (coaches?.length || 0) > 0 && (
            <div className="text-center text-textSecondary py-16">No coaches match the current filters.</div>
          )}
        </main>
      </div>
    </div>
  )
}
