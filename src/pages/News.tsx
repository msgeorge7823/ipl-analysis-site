// News page (/news).
// Curated IPL news feed pulled from the static `ipl-news.json` shard,
// filterable by category and search.
import { useMemo, useState } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { useIPLNews } from '@/hooks/useData'

type NewsItem = {
  id: string
  headline: string
  excerpt?: string
  source: string
  url: string
  date: string
  category: string
  featured?: boolean
}

const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  'Match Report': { bg: 'bg-emerald-500/15', text: 'text-emerald-400', border: 'border-emerald-500/30' },
  'Transfer': { bg: 'bg-sky-500/15', text: 'text-sky-400', border: 'border-sky-500/30' },
  'Auction': { bg: 'bg-amber-500/15', text: 'text-amber-400', border: 'border-amber-500/30' },
  'Highlights': { bg: 'bg-purple-500/15', text: 'text-purple-400', border: 'border-purple-500/30' },
  'Disciplinary': { bg: 'bg-red-500/15', text: 'text-red-400', border: 'border-red-500/30' },
  'Season Preview': { bg: 'bg-indigo-500/15', text: 'text-indigo-400', border: 'border-indigo-500/30' },
  'default': { bg: 'bg-zinc-500/15', text: 'text-zinc-400', border: 'border-zinc-500/30' },
}

function categoryStyle(cat: string) {
  return CATEGORY_STYLES[cat] || CATEGORY_STYLES.default
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function relativeDate(iso: string): string {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}

export default function News() {
  const { data: news, isLoading } = useIPLNews()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [search, setSearch] = useState('')

  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const n of (news || []) as NewsItem[]) set.add(n.category)
    return ['All', ...Array.from(set).sort()]
  }, [news])

  const filtered = useMemo(() => {
    let list = (news || []) as NewsItem[]
    if (selectedCategory !== 'All') {
      list = list.filter(n => n.category === selectedCategory)
    }
    if (search.trim().length >= 2) {
      const q = search.toLowerCase()
      list = list.filter(n =>
        n.headline.toLowerCase().includes(q) ||
        n.excerpt?.toLowerCase().includes(q) ||
        n.source.toLowerCase().includes(q)
      )
    }
    return [...list].sort((a, b) => b.date.localeCompare(a.date))
  }, [news, selectedCategory, search])

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: 'News' }]} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-black">
          IPL News <span className="text-textSecondary text-2xl font-normal">· Latest from the ongoing season</span>
        </h1>
        <p className="text-textSecondary mt-2 text-sm">
          Curated headlines, match reports, auctions and transfer moves from the IPL 2026 season and beyond.
        </p>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap gap-3 items-center mb-8">
        <div className="relative flex-1 min-w-[240px]">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search headlines, teams, players…"
            className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-textPrimary placeholder-textSecondary/60 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map(c => {
            const active = selectedCategory === c
            return (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${active ? 'bg-accent/20 text-accent border-accent/40' : 'bg-card text-textSecondary border-border hover:border-accent/30'}`}
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>

      {/* Article list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-textSecondary">
          No articles match the current filter.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(item => {
            const style = categoryStyle(item.category)
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-card border border-border rounded-2xl p-5 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-2 flex-wrap">
                  <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${style.bg} ${style.text} ${style.border}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-textSecondary">
                    {formatDate(item.date)}
                    <span className="text-textSecondary/60 ml-2">· {relativeDate(item.date)}</span>
                  </span>
                </div>
                <h2 className="text-lg md:text-xl font-bold leading-snug mb-2 group-hover:text-accent transition">
                  {item.headline}
                </h2>
                {item.excerpt && (
                  <p className="text-sm text-textSecondary leading-relaxed mb-3">
                    {item.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-textSecondary">
                    Source: <span className="font-semibold text-textPrimary">{item.source}</span>
                  </span>
                  <span className="text-accent font-semibold flex items-center gap-1">
                    Read more
                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
