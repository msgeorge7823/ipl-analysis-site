// Venues landing page (/venues).
// Searchable list of every IPL ground with high-level pitch summary
// (avg first/second innings totals, match count). Cards link to
// /venues/:name.
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useVenues } from '@/hooks/useData'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { MapPin, Search } from 'lucide-react'

type SortOption = 'most_matches' | 'avg_1st' | 'avg_2nd' | 'alphabetical'

export default function Venues() {
  const { data: venues, isLoading } = useVenues()
  const [searchQuery, setSearchQuery] = useState('')
  const [cityFilter, setCityFilter] = useState('all')
  const [sortBy, setSortBy] = useState<SortOption>('most_matches')

  const allVenues = venues || []

  // Extract unique cities
  const cities = useMemo(() => {
    const citySet = new Set<string>()
    allVenues.forEach((v: any) => {
      if (v.city) citySet.add(v.city)
    })
    return Array.from(citySet).sort()
  }, [allVenues])

  // Filter and sort
  const filtered = useMemo(() => {
    let result = [...allVenues]

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      result = result.filter((v: any) => v.name.toLowerCase().includes(q))
    }

    // City filter
    if (cityFilter !== 'all') {
      result = result.filter((v: any) => v.city === cityFilter)
    }

    // Sort
    switch (sortBy) {
      case 'most_matches':
        result.sort((a: any, b: any) => b.matchCount - a.matchCount)
        break
      case 'avg_1st':
        result.sort((a: any, b: any) => b.avgFirstInningsScore - a.avgFirstInningsScore)
        break
      case 'avg_2nd':
        result.sort((a: any, b: any) => b.avgSecondInningsScore - a.avgSecondInningsScore)
        break
      case 'alphabetical':
        result.sort((a: any, b: any) => a.name.localeCompare(b.name))
        break
    }

    return result
  }, [allVenues, searchQuery, cityFilter, sortBy])

  const allSorted = [...allVenues].sort((a: any, b: any) => b.matchCount - a.matchCount)
  const allCities = new Set(allVenues.map((v: any) => v.city))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const selectClass = "bg-[#131320] border border-[#1e1e3a] rounded-lg px-3 py-2.5 text-sm font-semibold text-white appearance-none pr-8 focus:outline-none focus:border-accent cursor-pointer"

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: 'Venues' }]} />
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Venues</h1>
        <p className="text-[#94a3b8] text-sm mt-1">
          {allVenues.length} venues across {allCities.size} cities
        </p>
      </div>

      {/* Stat Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <p className="text-xs text-[#94a3b8] uppercase tracking-wider font-semibold mb-1">Total Venues</p>
          <p className="text-2xl font-bold text-white">{allVenues.length}</p>
        </div>
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 21h18M3 10h18M3 7l9-4 9 4"/></svg>
          </div>
          <p className="text-xs text-[#94a3b8] uppercase tracking-wider font-semibold mb-1">Cities</p>
          <p className="text-2xl font-bold text-emerald-400">{allCities.size}</p>
        </div>
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          </div>
          <p className="text-xs text-[#94a3b8] uppercase tracking-wider font-semibold mb-1">Most Matches</p>
          <p className="text-2xl font-bold text-amber-400">{allSorted[0]?.matchCount || 0}</p>
        </div>
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-5 text-center">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto mb-3">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <p className="text-xs text-[#94a3b8] uppercase tracking-wider font-semibold mb-1">Highest Avg Score</p>
          <p className="text-2xl font-bold text-blue-400">
            {allVenues.length > 0 ? Math.max(...allVenues.map((v: any) => v.avgFirstInningsScore)) : 0}
          </p>
        </div>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {/* Search Input */}
        <div className="relative w-full sm:w-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search venues..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="bg-[#131320] border border-[#1e1e3a] rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-[#94a3b8] focus:outline-none focus:border-accent w-full sm:w-56"
          />
        </div>

        {/* City Filter */}
        <div className="relative w-[calc(50%-6px)] sm:w-auto">
          <select
            value={cityFilter}
            onChange={e => setCityFilter(e.target.value)}
            className={`${selectClass} w-full sm:w-auto`}
          >
            <option value="all">All Cities</option>
            {cities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <svg className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
        </div>

        {/* Sort Dropdown */}
        <div className="relative w-[calc(50%-6px)] sm:w-auto">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortOption)}
            className={`${selectClass} w-full sm:w-auto`}
          >
            <option value="most_matches">Most Matches</option>
            <option value="avg_1st">Avg 1st Innings Score</option>
            <option value="avg_2nd">Avg 2nd Innings Score</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
          <svg className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
        </div>

        {/* Count */}
        <div className="w-full sm:w-auto sm:ml-auto text-sm text-[#94a3b8] font-medium">
          Showing {filtered.length} of {allVenues.length} venues
        </div>
      </div>

      {/* Venue Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 text-[#94a3b8]">
            No venues found for the selected filters.
          </div>
        )}
        {filtered.map((venue: any) => {
          const slug = encodeURIComponent(venue.name)
          return (
            <Link
              key={venue.name}
              to={`/venues/${slug}`}
              className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-5 hover:border-accent/20 transition group"
            >
              {/* Venue Name & City */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-white text-sm group-hover:text-accent transition">{venue.name}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <MapPin size={12} className="text-accent" />
                    {venue.city}
                  </p>
                </div>
                <div className="bg-accent/10 text-accent text-xs font-bold px-2.5 py-1 rounded-full">
                  {venue.matchCount} matches
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-bg rounded-xl p-3 text-center">
                  <div className="text-lg font-extrabold text-white">{venue.matchCount}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mt-0.5">Matches</div>
                </div>
                <div className="bg-bg rounded-xl p-3 text-center">
                  <div className="text-lg font-extrabold text-orange-400">{venue.avgFirstInningsScore}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mt-0.5">Avg 1st Inn</div>
                </div>
                <div className="bg-bg rounded-xl p-3 text-center">
                  <div className="text-lg font-extrabold text-emerald-400">{venue.avgSecondInningsScore}</div>
                  <div className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mt-0.5">Avg 2nd Inn</div>
                </div>
              </div>

              {/* Batting friendliness bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-gray-500 font-medium">Batting Friendliness</span>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    {Math.round((venue.avgFirstInningsScore / 200) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-[#1e1e3a] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min((venue.avgFirstInningsScore / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
