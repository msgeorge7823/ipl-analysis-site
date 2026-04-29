// Home page (/).
// The app's landing dashboard: hero, season-winner timeline, top players,
// trivia/facts feed, news preview, and quick-jump tiles into the rest of
// the app.
import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSeasons, usePlayerStats, usePlayersIndex, usePlayerPhotos, useIPLFacts, useIPLNews } from '@/hooks/useData'
import { TEAM_SHORT, TEAM_COLORS } from '@/lib/constants'
import TeamBadge from '@/components/ui/TeamBadge'
import Avatar from '@/components/ui/Avatar'

export default function Home() {
  const { data: seasons } = useSeasons()
  const { data: playerStats } = usePlayerStats()
  const { data: playersIndex } = usePlayersIndex()
  const { data: playerPhotos } = usePlayerPhotos()
  const { data: iplFacts } = useIPLFacts()
  const { data: iplNews } = useIPLNews()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)

  const sorted = useMemo(() => seasons?.sort((a: any, b: any) => b.year.localeCompare(a.year)) || [], [seasons])
  // Latest completed season (has a winner) for Champion/Highlights display
  const lastCompletedSeason = sorted.find((s: any) => s.winner && s.matchCount >= 50)
  // Current/ongoing season for the "Live" badge
  const currentSeason = sorted[0]
  // Use completed season for highlights, fallback to latest
  const latestSeason = lastCompletedSeason || currentSeason
  const totalMatches = seasons?.reduce((sum: number, s: any) => sum + s.matchCount, 0) || 0
  const totalPlayers = playersIndex?.length || 0
  const totalSeasons = seasons?.length || 0

  // Compute total sixes from player stats if available
  const totalSixes = playerStats?.reduce((sum: number, p: any) => sum + (p.sixes || 0), 0) || 0

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() || !playersIndex) return []
    const q = searchQuery.toLowerCase()
    return playersIndex
      .filter((p: any) =>
        p.name?.toLowerCase().includes(q) ||
        p.fullName?.toLowerCase().includes(q) ||
        p.shortName?.toLowerCase().includes(q) ||
        p.nicknames?.some((n: string) => n.toLowerCase().includes(q))
      )
      .slice(0, 5)
  }, [searchQuery, playersIndex])

  // Winner info for latest season
  const winnerColors = latestSeason?.winner ? TEAM_COLORS[latestSeason.winner] : null

  // Quick links
  const quickLinks = [
    { label: 'Top Batters', emoji: '🏏', path: '/records' },
    { label: 'Top Bowlers', emoji: '🎯', path: '/records' },
    { label: 'Latest Season', emoji: '📊', path: latestSeason ? `/seasons/${latestSeason.year}` : '/seasons' },
    { label: 'Records', emoji: '🏆', path: '/records' },
  ]

  const getInitials = (name: string) => {
    return name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-bg relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-3 md:px-4 py-12 md:py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            IPL {currentSeason?.year || '2026'} Season Live
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-black mb-4 tracking-tight">
            <span className="gradient-text">IPL Analytics</span>
          </h1>
          <p className="text-base md:text-xl text-textSecondary max-w-2xl mx-auto mb-10">
            The definitive analytics platform for the Indian Premier League. Every season. Every player. Every ball. Since 2008.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="flex items-center bg-card border border-border rounded-2xl px-5 py-4 glow">
              <svg width="20" height="20" fill="none" stroke="#64748b" strokeWidth="2" className="mr-3 flex-shrink-0">
                <circle cx="9" cy="9" r="6" />
                <path d="M14 14l4 4" />
              </svg>
              <input
                type="text"
                placeholder="Search players, teams, matches, venues..."
                className="bg-transparent flex-1 text-sm md:text-lg outline-none text-textPrimary placeholder-textSecondary/50"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true) }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              <div className="hidden sm:flex gap-2 ml-3">
                <span className="px-2 py-1 bg-white/5 rounded text-xs text-textSecondary border border-border">Ctrl+K</span>
              </div>
            </div>
            {/* Search Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-10">
                <div className="p-2">
                  {searchResults.map((p: any, i: number) => (
                    <div
                      key={p.id || i}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer ${i === 0 ? 'bg-accent/10' : 'hover:bg-white/5'}`}
                      onMouseDown={() => navigate(`/players/${p.id}`)}
                    >
                      <Avatar
                        id={p.id}
                        name={p.name}
                        kind="player"
                        sizePx={40}
                        initialsFontSizePx={13}
                        season={p.seasons?.[p.seasons.length - 1]}
                        photo={playerPhotos?.[`${p.id}_${p.seasons?.[p.seasons.length - 1]}`] || playerPhotos?.[p.id]}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-textPrimary">{p.name}</div>
                        <div className="text-xs text-textSecondary">
                          {p.role || 'Player'} {p.team ? `\u00B7 ${p.team}` : ''} {p.country ? `\u00B7 ${p.country}` : ''}
                        </div>
                      </div>
                      {p.role && (
                        <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">{p.role}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="px-4 py-2 bg-card border border-border rounded-full text-sm text-textSecondary hover:bg-cardHover cursor-pointer transition-colors"
              >
                {link.emoji} {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Counter Stats */}
      <section className="max-w-7xl mx-auto px-3 md:px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6 text-center glow card-shine">
            <div className="text-2xl md:text-4xl font-black counter gradient-text">{totalMatches.toLocaleString()}</div>
            <div className="text-xs md:text-sm text-textSecondary mt-1">Total Matches</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6 text-center glow card-shine">
            <div className="text-2xl md:text-4xl font-black counter gradient-text">{totalPlayers.toLocaleString()}</div>
            <div className="text-xs md:text-sm text-textSecondary mt-1">Total Players</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6 text-center glow card-shine">
            <div className="text-2xl md:text-4xl font-black counter gradient-text">{totalSixes.toLocaleString()}</div>
            <div className="text-xs md:text-sm text-textSecondary mt-1">Total Sixes</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6 text-center glow card-shine">
            <div className="text-2xl md:text-4xl font-black counter gradient-text">{totalSeasons}</div>
            <div className="text-xs md:text-sm text-textSecondary mt-1">Seasons</div>
          </div>
        </div>
      </section>

      {/* Latest Season Champion */}
      {latestSeason?.winner && (
        <section className="max-w-7xl mx-auto px-4 mt-16">
          <h2 className="text-2xl font-bold mb-6">IPL {latestSeason.year} Champion</h2>
          <Link
            to={`/seasons/${latestSeason.year}`}
            className="block bg-card rounded-2xl p-4 md:p-8 glow hover:bg-cardHover transition-colors"
            style={{
              background: winnerColors
                ? `linear-gradient(135deg, ${winnerColors.primary}15, ${winnerColors.secondary}15)`
                : undefined,
              borderWidth: '2px',
              borderStyle: 'solid',
              borderColor: winnerColors ? `${winnerColors.primary}70` : '#1e1e3a',
            }}
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div
                className="w-28 h-28 rounded-2xl flex items-center justify-center p-3 flex-shrink-0"
                style={{
                  backgroundColor: winnerColors?.primary || '#6366f1',
                }}
              >
                <TeamBadge
                  team={latestSeason.winner}
                  season={latestSeason.year}
                  className="w-full h-full bg-transparent"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <Link
                  to={`/teams/${latestSeason.winner.replace(/\s+/g, '-').toLowerCase()}`}
                  className="text-3xl font-black hover:opacity-80 transition"
                  style={{ color: winnerColors?.primary || '#fff' }}
                >
                  {latestSeason.winner}
                </Link>
                <p className="text-textSecondary mt-1">Champions &mdash; IPL {latestSeason.year}</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm">
                  <span className="px-3 py-1 bg-white/5 rounded-lg">🏆 {latestSeason.year} Title</span>
                  <span className="px-3 py-1 bg-white/5 rounded-lg">{latestSeason.matchCount} Matches</span>
                  <span className="px-3 py-1 bg-white/5 rounded-lg">{latestSeason.teams?.length} Teams</span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Featured Highlights */}
      {latestSeason && (
        <section className="max-w-7xl mx-auto px-4 mt-16">
          <h2 className="text-2xl font-bold mb-6">IPL {latestSeason.year} Highlights</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Orange Cap */}
            {latestSeason.orangeCap && (
              <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-bl-full" />
                <div className="text-orange-500 font-bold text-sm mb-3 flex items-center gap-2">
                  <img src="/icons/cricket-bat.svg" alt="" className="w-5 h-5" />
                  Orange Cap
                </div>
                <div className="w-12 h-12 bg-orange-900/30 rounded-full flex items-center justify-center text-xl mb-3">
                  {getInitials(latestSeason.orangeCap.player)}
                </div>
                <div className="font-bold text-lg text-white">{latestSeason.orangeCap.player}</div>
                <div className="mt-3 text-2xl font-black text-orange-400 counter">{latestSeason.orangeCap.runs} runs</div>
              </div>
            )}

            {/* Purple Cap */}
            {latestSeason.purpleCap && (
              <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-bl-full" />
                <div className="text-purple-500 font-bold text-sm mb-3 flex items-center gap-2">
                  <img src="/icons/cricket-ball.svg" alt="" className="w-5 h-5" />
                  Purple Cap
                </div>
                <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center text-xl mb-3">
                  {getInitials(latestSeason.purpleCap.player)}
                </div>
                <div className="font-bold text-lg text-white">{latestSeason.purpleCap.player}</div>
                <div className="mt-3 text-2xl font-black text-purple-400 counter">{latestSeason.purpleCap.wickets} wickets</div>
              </div>
            )}

            {/* Season Stats */}
            <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-bl-full" />
              <div className="text-blue-400 font-bold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center text-xs">{'⚡'}</span>
                Season Stats
              </div>
              <div className="font-bold text-lg text-white mt-8">{latestSeason.matchCount} Matches</div>
              <div className="text-textSecondary text-sm">{latestSeason.teams?.length} teams competing</div>
              <div className="mt-3 text-2xl font-black text-blue-400 counter">IPL {latestSeason.year}</div>
            </div>

            {/* Teams */}
            <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-500/10 rounded-bl-full" />
              <div className="text-red-400 font-bold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center text-xs">🔥</span>
                Champion
              </div>
              {latestSeason.winner && (
                <>
                  <div className="flex gap-2 items-center mb-3">
                    <TeamBadge team={latestSeason.winner} size={40} season={latestSeason.year} />
                  </div>
                  <Link to={`/teams/${latestSeason.winner.replace(/\s+/g, '-').toLowerCase()}`} className="font-bold text-white hover:text-accent transition">{latestSeason.winner}</Link>
                  <div className="mt-2 text-lg font-black text-red-400">🏆 Champions</div>
                  <div className="text-xs text-textSecondary">IPL {latestSeason.year}</div>
                </>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Season Grid */}
      <section className="max-w-7xl mx-auto px-4 mt-16 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All Seasons</h2>
          <Link to="/seasons" className="text-accent text-sm hover:underline">View All &rarr;</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {sorted.map((s: any) => {
            const teamColor = s.winner ? TEAM_COLORS[s.winner]?.primary : undefined
            return (
            <Link
              key={s.year}
              to={`/seasons/${s.year}`}
              className="rounded-xl p-4 hover:bg-cardHover cursor-pointer transition-all hover:-translate-y-1"
              style={{
                backgroundColor: '#131320',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: teamColor ? `${teamColor}50` : '#1e1e3a',
                borderLeftWidth: teamColor ? '3px' : '1px',
                borderLeftColor: teamColor || '#1e1e3a',
              }}
            >
              <div className="text-xl font-bold text-white">IPL {s.year}</div>
              <div className="text-sm text-textSecondary mt-1">
                {s.winner
                  ? <span style={{ color: TEAM_COLORS[s.winner]?.primary }}>{'🏆'} {TEAM_SHORT[s.winner] || s.winner}</span>
                  : s.isOngoing
                    ? <span className="text-green-400">{'🔴'} Season Live</span>
                    : `${s.matchCount} matches`
                }
              </div>
              {s.orangeCap && (
                <div className="mt-3 text-xs text-orange-400 truncate flex items-center gap-1">
                  <img src="/icons/cricket-bat.svg" alt="" className="w-3.5 h-3.5 inline" />
                  {s.orangeCap.shortName || s.orangeCap.player} — {s.orangeCap.runs}
                </div>
              )}
              {s.purpleCap && (
                <div className="mt-1 text-xs text-purple-400 truncate flex items-center gap-1">
                  <img src="/icons/cricket-ball.svg" alt="" className="w-3.5 h-3.5 inline" />
                  {s.purpleCap.shortName || s.purpleCap.player} — {s.purpleCap.wickets}
                </div>
              )}
            </Link>
            )
          })}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          Top Highlights — magazine-style hero layout.
          One large hero card (60%) + 3 sidebar cards (40%).
          Each card has a CTA headline, a color-accented gradient, and
          clicks through to the external article source.
          Only items flagged `featured: true` in ipl-news.json appear
          here — those should be ongoing-season stories.
          ══════════════════════════════════════════════════════════════ */}
      {iplNews && (iplNews as any[]).filter(n => n.featured).length > 0 && (() => {
        const featured = (iplNews as any[]).filter(n => n.featured)
        const hero = featured[0]
        const sidebar = featured.slice(1, 4)
        return (
          <section className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-end justify-between mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3">
                  <span className="inline-block w-1.5 h-7 rounded-full bg-gradient-to-b from-red-400 to-red-600" />
                  Top Highlights
                </h2>
                <p className="text-textSecondary text-sm mt-1">
                  The biggest storylines from IPL {currentSeason?.year || '2026'}
                </p>
              </div>
              <Link
                to="/news"
                className="text-sm text-accent font-semibold hover:underline flex items-center gap-1 group"
              >
                All news
                <svg className="transition-transform group-hover:translate-x-0.5" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
              {/* ── Hero card (large, 3/5 columns on desktop) ── */}
              {hero && (
                <a
                  href={hero.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group lg:col-span-3 relative block rounded-3xl overflow-hidden border border-border hover:border-accent/40 transition-all hover:shadow-2xl hover:shadow-accent/10"
                  style={{
                    background: `linear-gradient(135deg, ${hero.heroColor || '#6366f1'}38 0%, ${hero.heroColor || '#6366f1'}10 45%, rgba(19,19,32,0.95) 100%), radial-gradient(circle at 85% 15%, ${hero.heroColor || '#6366f1'}45 0%, transparent 50%)`,
                    minHeight: '360px',
                  }}
                >
                  {/* Decorative circle */}
                  <div
                    className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
                    style={{ backgroundColor: hero.heroColor || '#6366f1' }}
                  />
                  {/* Bottom gradient for text legibility */}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />

                  <div className="relative h-full flex flex-col justify-between p-7 md:p-10">
                    {/* Kicker */}
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-wider border backdrop-blur-sm"
                        style={{
                          color: hero.heroColor || '#fff',
                          backgroundColor: `${hero.heroColor || '#6366f1'}25`,
                          borderColor: `${hero.heroColor || '#6366f1'}60`,
                        }}
                      >
                        {hero.kicker || hero.category || 'IPL 2026'}
                      </span>
                      <span className="text-[11px] text-gray-400 font-semibold">
                        {new Date(hero.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                    </div>

                    {/* CTA headline */}
                    <div className="mt-auto pt-8">
                      <h3
                        className="text-2xl md:text-4xl font-black leading-[1.1] text-white mb-3 tracking-tight"
                        style={{
                          textShadow: '0 2px 18px rgba(0,0,0,0.4)',
                        }}
                      >
                        {hero.ctaHeadline || hero.headline}
                      </h3>
                      {hero.excerpt && (
                        <p className="text-sm md:text-base text-gray-200/90 leading-relaxed mb-5 max-w-2xl line-clamp-3">
                          {hero.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all group-hover:translate-x-1"
                          style={{
                            color: '#fff',
                            backgroundColor: `${hero.heroColor || '#6366f1'}d0`,
                            boxShadow: `0 8px 24px ${hero.heroColor || '#6366f1'}50`,
                          }}
                        >
                          Read the Full Story
                          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </span>
                        <span className="text-[11px] text-gray-400">
                          via <span className="font-bold text-gray-300">{hero.source}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </a>
              )}

              {/* ── Sidebar cards stack (2/5 columns on desktop) ── */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {sidebar.map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block rounded-2xl overflow-hidden border border-border hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/5 flex-1 min-h-[112px]"
                    style={{
                      background: `linear-gradient(105deg, ${item.heroColor || '#6366f1'}22 0%, ${item.heroColor || '#6366f1'}08 35%, rgba(19,19,32,0.95) 100%)`,
                    }}
                  >
                    {/* Left accent bar */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: item.heroColor || '#6366f1' }}
                    />

                    <div className="p-5 pl-6 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className="text-[9px] font-black uppercase tracking-wider"
                          style={{ color: item.heroColor || '#94a3b8' }}
                        >
                          {item.kicker || item.category || 'IPL 2026'}
                        </span>
                        <span className="text-[10px] text-textSecondary font-semibold">
                          {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <h3 className="text-sm md:text-base font-extrabold text-white leading-snug group-hover:text-accent transition line-clamp-2 mb-2">
                        {item.ctaHeadline || item.headline}
                      </h3>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-textSecondary">
                          <span className="font-bold text-gray-400">{item.source}</span>
                        </span>
                        <span
                          className="font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                          style={{ color: item.heroColor || '#a78bfa' }}
                        >
                          Read
                          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Secondary row of smaller highlights (4th and 5th featured if they exist) */}
            {featured.length > 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {featured.slice(4, 6).map(item => (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative block rounded-2xl overflow-hidden border border-border hover:border-accent/40 transition-all hover:shadow-lg hover:shadow-accent/5"
                    style={{
                      background: `linear-gradient(105deg, ${item.heroColor || '#6366f1'}1a 0%, rgba(19,19,32,0.95) 100%)`,
                    }}
                  >
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: item.heroColor || '#6366f1' }}
                    />
                    <div className="p-5 pl-6 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span
                            className="text-[9px] font-black uppercase tracking-wider"
                            style={{ color: item.heroColor || '#94a3b8' }}
                          >
                            {item.kicker || item.category}
                          </span>
                          <span className="text-[10px] text-textSecondary">•</span>
                          <span className="text-[10px] text-textSecondary font-semibold">
                            {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                        <h3 className="text-sm font-extrabold text-white leading-snug group-hover:text-accent transition line-clamp-2">
                          {item.ctaHeadline || item.headline}
                        </h3>
                      </div>
                      <span
                        className="font-bold flex items-center gap-1 shrink-0 group-hover:translate-x-0.5 transition-transform text-xs"
                        style={{ color: item.heroColor || '#a78bfa' }}
                      >
                        Read
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>
        )
      })()}

      {/* ══════════════════════════════════════════════════════════════
          Why the IPL began — origin story + evolution timeline.
          Static reference content; hand-curated in /data/ipl-facts.json.
          ══════════════════════════════════════════════════════════════ */}
      {iplFacts && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Origin story — 3/5 column */}
            <div className="lg:col-span-3">
              <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3 mb-4">
                <span className="inline-block w-1.5 h-7 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
                {iplFacts.origin?.title || 'Why the IPL began'}
              </h2>
              <div className="space-y-4">
                {(iplFacts.origin?.body || []).map((para: string, i: number) => (
                  <p key={i} className="text-sm md:text-base text-textSecondary leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>

            {/* Evolution timeline — 2/5 column */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-black flex items-center gap-3 mb-4">
                <span className="inline-block w-1.5 h-6 rounded-full bg-gradient-to-b from-indigo-400 to-indigo-600" />
                Key Milestones
              </h3>
              <div className="bg-card border border-border rounded-2xl p-5 max-h-[500px] overflow-y-auto">
                <ol className="relative border-l border-amber-400/30 ml-2 space-y-4">
                  {(iplFacts.evolution || []).map((m: any, i: number) => (
                    <li key={i} className="ml-4">
                      <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-amber-400/70 border-2 border-[#131320]" />
                      <div className="text-xs font-bold text-amber-400 mb-0.5">{m.year}</div>
                      <div className="text-xs text-textSecondary leading-relaxed">{m.event}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════
          Did You Know? — rotating grid of trivia from ipl-facts.json.
          ══════════════════════════════════════════════════════════════ */}
      {iplFacts?.didYouKnow && iplFacts.didYouKnow.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-black flex items-center gap-3">
              <span className="inline-block w-1.5 h-7 rounded-full bg-gradient-to-b from-purple-400 to-purple-600" />
              Did You Know?
            </h2>
            <p className="text-textSecondary text-sm mt-1">
              Fun facts and records from 18+ years of IPL cricket
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {iplFacts.didYouKnow.map((fact: any, i: number) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl p-5 hover:border-purple-500/30 transition-colors"
              >
                <div className="text-3xl mb-3">{fact.icon}</div>
                <p className="text-sm text-textSecondary leading-relaxed">
                  {fact.fact}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
