// Ratings page (/ratings).
// ICC-style 0-1000 player rating leaderboard. Computation runs in a Web
// Worker (rating-worker.ts) and results are cached in IndexedDB; this
// page wires up the recompute / progress UI.
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useRatings } from '@/hooks/useRatings'
import { usePlayers } from '@/hooks/useData'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import type { RatingResult } from '@/services/ratingService'

type Tab = 'batting' | 'bowling' | 'allrounder'
type ViewMode = 'active' | 'retired' | 'alltime'

function getTierClass(rating: number) {
  if (rating >= 850) return 'text-purple-400' // World Class
  if (rating >= 750) return 'text-accent' // Elite
  if (rating >= 600) return 'text-sky-400' // Established
  return 'text-teal-400' // Rising
}

function getTierBg(rating: number) {
  if (rating >= 850) return 'bg-purple-400/10'
  if (rating >= 750) return 'bg-accent/10'
  if (rating >= 600) return 'bg-sky-400/10'
  return 'bg-teal-400/10'
}

function getInitials(name: string) {
  const parts = name.split(' ')
  if (parts.length >= 2) return parts[0][0] + parts[parts.length - 1][0]
  return name.substring(0, 2).toUpperCase()
}

function getRatingForTab(p: RatingResult, tab: Tab): number {
  if (tab === 'batting') return p.battingRating
  if (tab === 'bowling') return p.bowlingRating
  // All-rounder: combined score
  return p.overallRating
}

export default function Ratings() {
  const { ratings, isComputing, progress, progressPct, error, recompute } = useRatings()
  const { data: players } = usePlayers()
  const [tab, setTab] = useLocalStorage<Tab>('ipl-ratings-tab', 'batting')
  const [viewMode, setViewMode] = useState<ViewMode>('active')
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const perPage = 10

  // Build playerId -> status map from the canonical players.json roster.
  // Status values in the data: 'active' | 'retired' | 'inactive'.
  // For the View filter we treat 'inactive' as retired (anyone not currently
  // playing) so no player falls outside both buckets.
  const statusById = useMemo(() => {
    const map = new Map<string, string>()
    if (players) for (const p of players) map.set(p.id, p.status)
    return map
  }, [players])

  const filtered = useMemo(() => {
    if (!ratings.length) return []

    let list = ratings

    // Filter by tab
    if (tab === 'batting') {
      list = list.filter(p => p.battingRating > 100)
    } else if (tab === 'bowling') {
      list = list.filter(p => p.bowlingRating > 100)
    } else {
      // All-rounder: both disciplines must be meaningful
      list = list.filter(p => p.battingRating > 200 && p.bowlingRating > 200)
    }

    // View mode: filter by career status from the roster
    if (viewMode === 'active') {
      list = list.filter(p => statusById.get(p.playerId) === 'active')
    } else if (viewMode === 'retired') {
      list = list.filter(p => {
        const s = statusById.get(p.playerId)
        return s === 'retired' || s === 'inactive'
      })
    }
    // 'alltime' = no status filter

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(p => p.playerName.toLowerCase().includes(q))
    }

    // Sort by relevant rating
    list = [...list].sort((a, b) => getRatingForTab(b, tab) - getRatingForTab(a, tab))

    return list
  }, [ratings, tab, viewMode, search, statusById])

  const totalPages = Math.ceil(filtered.length / perPage)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)
  const globalRank = (i: number) => (page - 1) * perPage + i + 1

  // Computing state with progress bar
  if (isComputing) {
    return (
      <>
        <section>
          <div className="border-b border-border" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 50%, transparent 100%)' }}>
            <div className="max-w-7xl mx-auto px-6 py-14">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-8 rounded-full bg-accent" />
                <h1 className="text-4xl font-extrabold text-white tracking-tight">IPL Player Ratings</h1>
              </div>
              <p className="text-gray-400 text-base ml-5">
                Powered by ICC-Calibrated Algorithm
              </p>
            </div>
          </div>
        </section>
        <div className="max-w-2xl mx-auto px-6 mt-20">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-lg font-semibold text-white mb-2">Computing Ratings</h2>
            <p className="text-gray-400 text-sm mb-6">{progress || 'Initializing...'}</p>
            <div className="w-full bg-bg rounded-full h-3 overflow-hidden border border-border">
              <div
                className="h-full bg-gradient-to-r from-accent to-purple-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Processing {Math.round((progressPct / 100) * 18)} of 18 seasons
            </p>
          </div>
        </div>
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <>
        <section>
          <div className="border-b border-border" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 50%, transparent 100%)' }}>
            <div className="max-w-7xl mx-auto px-6 py-14">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-8 rounded-full bg-accent" />
                <h1 className="text-4xl font-extrabold text-white tracking-tight">IPL Player Ratings</h1>
              </div>
            </div>
          </div>
        </section>
        <div className="max-w-2xl mx-auto px-6 mt-20">
          <div className="bg-card border border-red-500/30 rounded-xl p-8 text-center">
            <p className="text-red-400 mb-4">Rating computation failed: {error}</p>
            <button
              onClick={recompute}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition"
            >
              Retry Computation
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Hero Banner */}
      <section>
        <div className="border-b border-border" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.06) 50%, transparent 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
            <Breadcrumb items={[{ label: 'Ratings' }]} />
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1.5 h-8 rounded-full bg-accent" />
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">IPL Player Ratings</h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-base ml-5 flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Powered by ICC-Calibrated Algorithm &middot; Historical from 2008
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-4 sm:mt-6 ml-5">
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="w-3 h-3 rounded-full bg-purple-400" />
                <span className="text-gray-500">World Class</span>
                <span className="text-gray-600">(850+)</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="w-3 h-3 rounded-full bg-accent" />
                <span className="text-gray-500">Elite</span>
                <span className="text-gray-600">(750-849)</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="w-3 h-3 rounded-full bg-sky-400" />
                <span className="text-gray-500">Established</span>
                <span className="text-gray-600">(600-749)</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm">
                <span className="w-3 h-3 rounded-full bg-teal-400" />
                <span className="text-gray-500">Rising</span>
                <span className="text-gray-600">(&lt;600)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center sm:justify-start gap-0 border-b border-border mt-0 overflow-x-auto">
          {([
            { key: 'batting' as Tab, label: 'Batting' },
            { key: 'bowling' as Tab, label: 'Bowling' },
            { key: 'allrounder' as Tab, label: 'All-Rounder' },
          ]).map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); setPage(1) }}
              className={`px-6 py-4 text-sm font-semibold transition border-b-2 ${
                tab === t.key
                  ? 'border-accent text-white'
                  : 'border-transparent text-gray-500 hover:text-gray-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-4">
          <div className="w-full sm:flex-1 sm:min-w-[200px]">
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search player..."
              className="w-full bg-bg border border-border rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent/50 transition"
            />
          </div>
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">View</label>
            <div className="flex items-center bg-bg border border-border rounded-lg overflow-hidden">
              {(['active', 'retired', 'alltime'] as ViewMode[]).map(vm => (
                <button
                  key={vm}
                  onClick={() => { setViewMode(vm); setPage(1) }}
                  className={`px-4 py-2 text-sm font-medium capitalize flex-1 sm:flex-none ${
                    viewMode === vm ? 'bg-accent text-white' : 'text-gray-400 hover:text-gray-200 transition'
                  }`}
                >
                  {vm === 'alltime' ? 'All-Time' : vm}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={recompute}
            className="px-3 py-2 border border-border rounded-lg text-xs text-gray-400 hover:text-white hover:border-accent/50 transition w-full sm:w-auto"
            title="Recompute ratings from scratch"
          >
            Recompute
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6 mb-8">
        <div className="bg-card border border-border rounded-xl overflow-hidden overflow-x-auto" style={{ boxShadow: '0 0 40px rgba(99, 102, 241, 0.08)' }}>
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="bg-[#0e0e1a] border-b border-border">
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-4 w-16">Rank</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-4">Player</th>
                <th className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-4 w-20">Matches</th>
                <th className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-4 w-28">Rating</th>
                <th className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-4 w-28">Peak</th>
                <th className="text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-4 w-28">
                  {tab === 'allrounder' ? 'Bat / Bowl' : tab === 'batting' ? 'Bat Rating' : 'Bowl Rating'}
                </th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">
                    No players found
                  </td>
                </tr>
              ) : (
                paginated.map((p, i) => {
                  const rank = globalRank(i)
                  const rating = getRatingForTab(p, tab)
                  const isGold = rank === 1
                  const isSilver = rank === 2
                  const isBronze = rank === 3
                  const borderClass = isGold ? 'border-l-[3px] border-l-amber-400' : isSilver ? 'border-l-[3px] border-l-gray-400' : isBronze ? 'border-l-[3px] border-l-orange-400' : ''
                  const rankColor = isGold ? 'text-amber-400' : isSilver ? 'text-gray-300' : isBronze ? 'text-orange-400' : 'text-gray-400'
                  const initials = getInitials(p.playerName)

                  return (
                    <tr key={p.playerId} className={`border-b border-border/50 hover:bg-accent/[0.06] cursor-pointer transition ${borderClass}`}>
                      <td className="px-5 py-4">
                        <span className={`text-lg font-bold ${rankColor}`}>{rank}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-[#4f46e5] flex items-center justify-center text-sm font-bold text-white shrink-0">
                            {initials}
                          </div>
                          <div>
                            <Link to={`/players/${p.playerId}`} className="font-semibold text-white text-[15px] hover:text-accent transition">
                              {p.playerName}
                            </Link>
                            {p.peakSeason && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                Peak: {p.peakSeason}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right text-gray-400">{p.matchesPlayed}</td>
                      <td className="px-4 py-4 text-right">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-lg font-bold ${getTierClass(rating)} ${getTierBg(rating)}`}>
                          {rating}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-gray-300 font-semibold">{p.peakRating}</span>
                      </td>
                      <td className="px-4 py-4 text-right text-gray-300 font-semibold">
                        {tab === 'allrounder'
                          ? `${p.battingRating} / ${p.bowlingRating}`
                          : tab === 'batting'
                            ? p.battingRating
                            : p.bowlingRating
                        }
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-wrap items-center justify-between gap-3 mt-5 mb-10">
            <p className="text-xs sm:text-sm text-gray-500">
              Showing <span className="text-gray-300 font-medium">{(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)}</span> of <span className="text-gray-300 font-medium">{filtered.length}</span> players
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-9 h-9 rounded-lg border border-border text-gray-500 flex items-center justify-center hover:bg-card transition text-sm disabled:opacity-30"
              >
                &lt;
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = idx + 1
                } else if (page <= 3) {
                  pageNum = idx + 1
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + idx
                } else {
                  pageNum = page - 2 + idx
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold ${
                      page === pageNum
                        ? 'bg-accent text-white'
                        : 'border border-border text-gray-400 hover:bg-card transition'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
              {totalPages > 5 && page < totalPages - 2 && (
                <>
                  <span className="text-gray-600 px-2">...</span>
                  <button
                    onClick={() => setPage(totalPages)}
                    className="w-9 h-9 rounded-lg border border-border text-gray-400 flex items-center justify-center hover:bg-card transition text-sm"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-9 h-9 rounded-lg border border-border text-gray-500 flex items-center justify-center hover:bg-card transition text-sm disabled:opacity-30"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
