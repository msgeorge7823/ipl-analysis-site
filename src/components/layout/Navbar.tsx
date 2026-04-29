// Navbar — the sticky top bar. Renders the primary nav inline, an
// overflow "More" dropdown, a global Ctrl/Cmd+K search trigger, and a
// mobile hamburger drawer. Active route highlighting is route-prefix based.
import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Search, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NAV_ITEMS, NAV_ITEMS_PRIMARY, NAV_ITEMS_MORE } from '@/lib/constants'
import SearchModal from './SearchModal'

export default function Navbar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const moreRef = useRef<HTMLDivElement>(null)

  // Global Ctrl+K / Cmd+K shortcut to open search
  const handleGlobalShortcut = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      setSearchOpen(prev => !prev)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleGlobalShortcut)
    return () => window.removeEventListener('keydown', handleGlobalShortcut)
  }, [handleGlobalShortcut])

  // Close "More" dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Check if any "More" item is active
  const moreActive = NAV_ITEMS_MORE.some(item => location.pathname.startsWith(item.path))

  // Check if we're on the players page for wider container
  const isWide = location.pathname.startsWith('/players')

  return (
    <>
      <nav className="sticky top-0 z-50 bg-bg/80 backdrop-blur-xl border-b border-border" aria-label="Primary">
        <div
          className={cn(
            'mx-auto px-4 h-16 flex items-center justify-between',
            isWide ? 'max-w-[1440px]' : 'max-w-7xl'
          )}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" aria-label="IPL Analytics — go to home">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center font-bold text-white text-sm" aria-hidden="true">
              IPL
            </div>
            <span className="hidden sm:inline font-bold text-lg text-textPrimary">Analytics</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1 text-sm">
            {NAV_ITEMS_PRIMARY.map(item => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-textSecondary hover:bg-white/5 hover:text-textPrimary'
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {item.live && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                    )}
                    {item.label}
                  </span>
                </Link>
              )
            })}

            {/* More Dropdown */}
            <div className="relative" ref={moreRef}>
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                aria-haspopup="true"
                aria-expanded={moreOpen}
                className={cn(
                  'px-3 py-2 rounded-lg transition-colors flex items-center gap-1',
                  moreActive
                    ? 'bg-accent/10 text-accent font-medium'
                    : 'text-textSecondary hover:bg-white/5 hover:text-textPrimary'
                )}
              >
                More
                <ChevronDown size={14} className={cn('transition-transform', moreOpen && 'rotate-180')} aria-hidden="true" />
              </button>

              {moreOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-50">
                  {NAV_ITEMS_MORE.map(item => {
                    const isActive = location.pathname.startsWith(item.path)
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMoreOpen(false)}
                        className={cn(
                          'block px-4 py-2.5 text-sm transition-colors',
                          isActive
                            ? 'bg-accent/10 text-accent font-medium'
                            : 'text-textSecondary hover:bg-white/5 hover:text-textPrimary'
                        )}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 h-8 rounded-lg bg-card border border-border text-textSecondary hover:bg-cardHover transition-colors text-sm"
              aria-label="Search"
            >
              <Search size={14} />
              <span className="text-xs text-slate-500">Ctrl+K</span>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="sm:hidden w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-textSecondary hover:bg-cardHover transition-colors"
              aria-label="Search"
            >
              <Search size={16} />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-textSecondary"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
            >
              {mobileOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav — shows all items */}
        {mobileOpen && (
          <div id="mobile-nav" className="lg:hidden border-t border-border bg-bg px-4 py-3 space-y-0.5">
            {NAV_ITEMS.map(item => {
              const isActive =
                item.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 rounded-lg text-sm transition-colors',
                    isActive
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-textSecondary hover:bg-white/5'
                  )}
                >
                  <span className="flex items-center gap-1.5">
                    {item.live && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                    )}
                    {item.label}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </nav>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  )
}
