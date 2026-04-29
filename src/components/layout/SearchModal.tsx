// SearchModal — the global Ctrl/Cmd+K command palette. Fuzzy-searches
// players, teams, venues, and seasons via Fuse.js, with arrow-key /
// enter navigation and keyboard-first ergonomics.
import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import Fuse from 'fuse.js'
import { usePlayersIndex, useTeams, useVenues, useSeasons } from '@/hooks/useData'
import { cn } from '@/lib/utils'
import TeamBadge from '@/components/ui/TeamBadge'

interface Props {
  onClose: () => void
}

interface SearchItem {
  type: 'player' | 'team' | 'venue' | 'season'
  id: string
  name: string
  sub: string
  shortName?: string
  nicknames?: string[]
}

const TYPE_COLORS: Record<string, string> = {
  player: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/20',
  team: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  venue: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  season: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
}

const TYPE_LABELS: Record<string, string> = {
  player: 'Player',
  team: 'Team',
  venue: 'Venue',
  season: 'Season',
}

export default function SearchModal({ onClose }: Props) {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { data: players } = usePlayersIndex()
  const { data: teams } = useTeams()
  const { data: venues } = useVenues()
  const { data: seasons } = useSeasons()

  // Focus input + Escape to close
  useEffect(() => {
    inputRef.current?.focus()
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Build searchable items
  const searchItems: SearchItem[] = []
  if (players) {
    for (const p of players) {
      searchItems.push({
        type: 'player',
        id: p.id,
        name: p.name,
        sub: p.teams?.join(', ') || '',
        shortName: p.shortName || '',
        nicknames: p.nicknames || [],
      })
    }
  }
  if (teams) {
    for (const t of teams) {
      searchItems.push({ type: 'team', id: t.id, name: t.name, sub: t.shortName || '' })
    }
  }
  if (venues) {
    for (const v of venues) {
      searchItems.push({ type: 'venue', id: v.name, name: v.name, sub: v.city || '' })
    }
  }
  if (seasons) {
    for (const s of seasons) {
      searchItems.push({
        type: 'season',
        id: s.year,
        name: `IPL ${s.year}`,
        sub: s.winner ? `Winner: ${s.winner}` : `${s.matchCount} matches`,
      })
    }
  }

  const fuse = searchItems.length > 0
    ? new Fuse(searchItems, {
        keys: ['name', 'shortName', 'nicknames', 'sub'],
        threshold: 0.3,
      })
    : null

  const results = query.length >= 2 && fuse ? fuse.search(query, { limit: 10 }) : []

  const handleSelect = useCallback((item: SearchItem) => {
    switch (item.type) {
      case 'player':
        navigate(`/players/${item.id}`)
        break
      case 'team':
        navigate(`/teams/${item.id}`)
        break
      case 'venue':
        navigate(`/venues/${encodeURIComponent(item.id)}`)
        break
      case 'season':
        navigate(`/seasons/${item.id}`)
        break
    }
    onClose()
  }, [navigate, onClose])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (results.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex].item)
      }
    }
  }, [results, selectedIndex, handleSelect])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return
    const selected = listRef.current.querySelector('[data-selected="true"]')
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search size={18} className="text-slate-400 mr-3" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search players, teams, venues, seasons..."
            className="flex-1 bg-transparent text-white text-lg outline-none placeholder-slate-500"
          />
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Results list */}
        {results.length > 0 && (
          <div ref={listRef} className="max-h-80 overflow-y-auto p-2">
            {results.map((r, i) => (
              <button
                key={`${r.item.type}-${r.item.id}`}
                data-selected={i === selectedIndex}
                onClick={() => handleSelect(r.item)}
                onMouseEnter={() => setSelectedIndex(i)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
                  i === selectedIndex ? 'bg-accent/10' : 'hover:bg-white/5'
                )}
              >
                {r.item.type === 'team' ? (
                  <TeamBadge team={r.item.name} className="w-10 h-10" shape="full" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-sm font-medium text-indigo-400">
                    {r.item.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{r.item.name}</div>
                  <div className="text-xs text-slate-400 truncate">{r.item.sub}</div>
                </div>
                <span className={cn(
                  'shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase border',
                  TYPE_COLORS[r.item.type]
                )}>
                  {TYPE_LABELS[r.item.type]}
                </span>
              </button>
            ))}
          </div>
        )}

        {query.length >= 2 && results.length === 0 && (
          <div className="p-6 text-center text-slate-400 text-sm">No results found for &ldquo;{query}&rdquo;</div>
        )}

        {query.length < 2 && (
          <div className="p-6 text-center text-slate-500 text-sm">Type at least 2 characters to search</div>
        )}

        {/* Footer with result count and shortcut hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border text-xs text-slate-500">
          <span>
            {query.length >= 2
              ? `${results.length} result${results.length !== 1 ? 's' : ''}`
              : 'Search across all entities'}
          </span>
          <div className="flex items-center gap-3">
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-border text-[10px]">&uarr;&darr;</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-border text-[10px]">&crarr;</kbd> select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-border text-[10px]">esc</kbd> close</span>
          </div>
        </div>
      </div>
    </div>
  )
}
