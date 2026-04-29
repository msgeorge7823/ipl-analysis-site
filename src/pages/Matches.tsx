// Matches page (/matches).
// Filterable list of every IPL match across history, plus a Playoffs tab
// that renders the bracket via the shared RoadToFinal component. Filters:
// season, team, venue, result, and stage.
import { Fragment, useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { MapPin, Users, ChevronDown } from 'lucide-react'
import Breadcrumb from '@/components/ui/Breadcrumb'
import TeamBadge from '@/components/ui/TeamBadge'
import { useSeasons, useMatches, useTeams, useVenues } from '@/hooks/useData'
import { TEAM_SHORT, TEAM_COLORS } from '@/lib/constants'
import { formatMatchResult } from '@/lib/matchResult'
import MatchListRow from '@/components/matches/MatchListRow'
import {
  computePointsTable,
} from '@/services/pointsTableService'
import RoadToFinal from '@/components/playoffs/RoadToFinal'
import type { Match } from '@/types'

// ─────────────────────────────────────────────────────────────────────────────
// Top-level tabs and sub-selectors
// ─────────────────────────────────────────────────────────────────────────────

type Tab = 'fixtures' | 'results' | 'points' | 'playoffs'
type GroupBy = 'teams' | 'venues' | 'seasons'

const TABS: { key: Tab; label: string }[] = [
  { key: 'fixtures', label: 'Fixtures' },
  { key: 'results', label: 'Results' },
  { key: 'points', label: 'Points Table' },
  { key: 'playoffs', label: 'Playoffs' },
]

const GROUP_OPTS: { key: GroupBy; label: string }[] = [
  { key: 'teams', label: 'Teams' },
  { key: 'venues', label: 'Venues' },
  { key: 'seasons', label: 'Seasons' },
]

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function Matches() {
  const [params, setParams] = useSearchParams()
  const { data: seasonsData } = useSeasons()
  const { data: teamsData } = useTeams()
  const { data: venuesData } = useVenues()

  const sortedSeasons = useMemo(
    () =>
      (seasonsData || [])
        .slice()
        .sort((a: any, b: any) => b.year.localeCompare(a.year)),
    [seasonsData]
  )
  const latestYear = sortedSeasons[0]?.year || '2026'

  // Tab state from URL params
  const tab = (params.get('tab') as Tab) || 'results'
  const by = (params.get('by') as GroupBy) || 'seasons'
  const value = params.get('value') || ''
  const season = params.get('season') || latestYear

  // Default the season param when none is set
  useEffect(() => {
    if (!params.get('season') && latestYear) {
      const next = new URLSearchParams(params)
      next.set('season', latestYear)
      setParams(next, { replace: true })
    }
  }, [latestYear, params, setParams])

  const updateParams = (patch: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (v == null || v === '') next.delete(k)
      else next.set(k, v)
    }
    setParams(next)
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <Breadcrumb items={[{ label: 'Matches' }]} />

      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Matches</h1>
        <p className="text-[#94a3b8] text-sm mt-1">
          Fixtures, results, standings, and playoffs across all IPL seasons
        </p>
      </div>

      {/* Top-level tabs */}
      <div className="border-b border-[#1e1e3a] mb-6 overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {TABS.map(t => {
            const isActive = tab === t.key
            return (
              <button
                key={t.key}
                onClick={() => updateParams({ tab: t.key })}
                className={`px-5 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-accent text-white'
                    : 'border-transparent text-[#94a3b8] hover:text-white'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab body */}
      {tab === 'fixtures' && (
        <FixturesOrResults
          mode="fixtures"
          by={by}
          value={value}
          season={season}
          sortedSeasons={sortedSeasons}
          teams={teamsData || []}
          venues={venuesData || []}
          onChange={updateParams}
        />
      )}
      {tab === 'results' && (
        <FixturesOrResults
          mode="results"
          by={by}
          value={value}
          season={season}
          sortedSeasons={sortedSeasons}
          teams={teamsData || []}
          venues={venuesData || []}
          onChange={updateParams}
        />
      )}
      {tab === 'points' && (
        <PointsTableTab
          season={season}
          sortedSeasons={sortedSeasons}
          onChange={updateParams}
        />
      )}
      {tab === 'playoffs' && (
        <PlayoffsTab
          season={season}
          sortedSeasons={sortedSeasons}
          onChange={updateParams}
        />
      )}
    </main>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Fixtures / Results tabs (share the same shape — only the filter differs)
// ─────────────────────────────────────────────────────────────────────────────

interface FixturesOrResultsProps {
  mode: 'fixtures' | 'results'
  by: GroupBy
  value: string
  season: string
  sortedSeasons: any[]
  teams: any[]
  venues: any[]
  onChange: (patch: Record<string, string | undefined>) => void
}

function FixturesOrResults({
  mode,
  by,
  value,
  season,
  sortedSeasons,
  teams,
  venues,
  onChange,
}: FixturesOrResultsProps) {
  // For Teams/Venues mode we still need a season to scope the lookup
  // (we keep the season param around so switching between sub-tabs is sticky)
  return (
    <div>
      {/* Sub-selector */}
      <div className="flex items-center gap-2 mb-5">
        {GROUP_OPTS.map(g => {
          const isActive = by === g.key
          return (
            <button
              key={g.key}
              onClick={() => onChange({ by: g.key, value: undefined })}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-colors ${
                isActive
                  ? 'bg-accent border-accent text-white'
                  : 'bg-[#131320] border-[#1e1e3a] text-[#94a3b8] hover:text-white hover:border-accent/40'
              }`}
            >
              {g.label}
            </button>
          )
        })}
      </div>

      {/* Sub-content */}
      {by === 'seasons' && (
        <SeasonGroupedView
          mode={mode}
          season={season}
          sortedSeasons={sortedSeasons}
          onSeasonChange={(s) => onChange({ season: s })}
        />
      )}
      {by === 'teams' && (
        <TeamOrVenueIndexView
          mode={mode}
          kind="teams"
          season={season}
          sortedSeasons={sortedSeasons}
          items={teams.filter((t: any) => !t.isDefunct).map((t: any) => ({ key: t.name, label: t.name, sub: t.shortName }))}
          selectedKey={value}
          onSelect={(v) => onChange({ value: v })}
          onSeasonChange={(s) => onChange({ season: s })}
        />
      )}
      {by === 'venues' && (
        <TeamOrVenueIndexView
          mode={mode}
          kind="venues"
          season={season}
          sortedSeasons={sortedSeasons}
          items={venues.map((v: any) => ({ key: v.name, label: v.name, sub: v.city }))}
          selectedKey={value}
          onSelect={(v) => onChange({ value: v })}
          onSeasonChange={(s) => onChange({ season: s })}
        />
      )}
    </div>
  )
}

// Season-grouped view: pick a season, see its matches
function SeasonGroupedView({
  mode,
  season,
  sortedSeasons,
  onSeasonChange,
}: {
  mode: 'fixtures' | 'results'
  season: string
  sortedSeasons: any[]
  onSeasonChange: (s: string) => void
}) {
  return (
    <div>
      <SeasonToolbar
        season={season}
        sortedSeasons={sortedSeasons}
        onChange={onSeasonChange}
      />
      <SeasonMatchList season={season} mode={mode} />
    </div>
  )
}

// Index view for Teams or Venues: shows a clickable list when nothing is
// selected, and the matching matches when something is.
function TeamOrVenueIndexView({
  mode,
  kind,
  season,
  sortedSeasons,
  items,
  selectedKey,
  onSelect,
  onSeasonChange,
}: {
  mode: 'fixtures' | 'results'
  kind: 'teams' | 'venues'
  season: string
  sortedSeasons: any[]
  items: { key: string; label: string; sub?: string }[]
  selectedKey: string
  onSelect: (key: string) => void
  onSeasonChange: (s: string) => void
}) {
  if (!selectedKey) {
    return (
      <div>
        <p className="text-xs text-[#64748b] uppercase tracking-wider mb-3">
          Select a {kind === 'teams' ? 'team' : 'venue'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {items.map(it => (
            <button
              key={it.key}
              onClick={() => onSelect(it.key)}
              className="text-left bg-[#131320] border border-[#1e1e3a] rounded-xl px-4 py-3 hover:border-accent/40 transition group"
            >
              <div className="text-sm font-bold text-white group-hover:text-accent transition-colors flex items-center gap-2">
                {kind === 'teams' ? <Users size={14} /> : <MapPin size={14} />}
                {it.label}
              </div>
              {it.sub && (
                <div className="text-[11px] text-[#64748b] mt-0.5 truncate">{it.sub}</div>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <SeasonToolbar
        season={season}
        sortedSeasons={sortedSeasons}
        onChange={onSeasonChange}
        leading={
          <>
            <button
              onClick={() => onSelect('')}
              className="text-xs text-[#94a3b8] hover:text-white font-medium"
            >
              ← All {kind}
            </button>
            <span className="text-sm font-bold text-white truncate max-w-[280px]">
              {selectedKey}
            </span>
          </>
        }
      />
      <SeasonMatchList
        season={season}
        mode={mode}
        filterFn={(m) =>
          kind === 'teams'
            ? (m.teams || []).includes(selectedKey)
            : m.venue === selectedKey
        }
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Season picker + toolbar wrapper
// ─────────────────────────────────────────────────────────────────────────────

function SeasonPicker({
  season,
  sortedSeasons,
  onChange,
  label = 'Season',
}: {
  season: string
  sortedSeasons: any[]
  onChange: (s: string) => void
  label?: string
}) {
  return (
    <div className="relative inline-flex items-center">
      <select
        value={season}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#0f0f1a] border border-[#1e1e3a] rounded-lg pl-3 pr-9 py-2 text-sm font-semibold text-white appearance-none focus:outline-none focus:border-accent hover:border-accent/40 transition-colors cursor-pointer"
        aria-label={label}
      >
        {sortedSeasons.map((s: any) => (
          <option key={s.year} value={s.year}>
            IPL {s.year}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="text-[#94a3b8] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
      />
    </div>
  )
}

/** Standardized toolbar containing the season picker. Provides consistent
 *  spacing and visual treatment so the picker never butts up against the
 *  content below it. The optional `leading` slot is used by Team/Venue
 *  drill-downs to show the breadcrumb-style "← All teams · Mumbai Indians".
 */
function SeasonToolbar({
  season,
  sortedSeasons,
  onChange,
  leading,
}: {
  season: string
  sortedSeasons: any[]
  onChange: (s: string) => void
  leading?: React.ReactNode
}) {
  return (
    <div className="bg-[#131320]/60 border border-[#1e1e3a] rounded-2xl px-4 sm:px-5 py-3 mb-8 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3 min-w-0">
        {leading}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[11px] text-[#64748b] uppercase tracking-wider font-bold">
          Season
        </span>
        <SeasonPicker
          season={season}
          sortedSeasons={sortedSeasons}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Match list (driven by season + an optional filter + a played/unplayed mode)
// ─────────────────────────────────────────────────────────────────────────────

/** A match qualifies as a "result" when it has a winner, was abandoned, or
 * was played-without-result (CricSheet `result: 'no result'`). Future fixtures
 * have none of these and stay in the unplayed bucket. */
function isResult(m: Match): boolean {
  return !!m.winner || !!m.abandoned || m.result === 'no result'
}

function SeasonMatchList({
  season,
  mode,
  filterFn,
}: {
  season: string
  mode: 'fixtures' | 'results'
  filterFn?: (m: Match) => boolean
}) {
  const { data: matches, isLoading } = useMatches(season)

  const filtered = useMemo(() => {
    let list: Match[] = (matches || []) as any
    // Fixtures = the FULL schedule (every match in the season, played or not).
    // Results = only matches whose result has been announced.
    if (mode === 'results') {
      list = list.filter(isResult)
    }
    if (filterFn) list = list.filter(filterFn)
    // Fixtures: chronological by match number / date (the schedule order).
    // Results: most recent first.
    list = list.slice().sort((a, b) => {
      if (mode === 'fixtures') {
        const ma = a.matchNumber ?? Number.MAX_SAFE_INTEGER
        const mb = b.matchNumber ?? Number.MAX_SAFE_INTEGER
        if (ma !== mb) return ma - mb
        return (a.date || '').localeCompare(b.date || '')
      }
      return (b.date || '').localeCompare(a.date || '')
    })
    return list
  }, [matches, mode, filterFn])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-[#94a3b8] text-sm">
          {mode === 'fixtures'
            ? `No matches scheduled for IPL ${season}.`
            : `No completed matches for IPL ${season} match the current filter.`}
        </div>
      </div>
    )
  }

  // Fixtures view: schedule-only, no results. Group by date.
  if (mode === 'fixtures') {
    return <FixtureSchedule matches={filtered} />
  }

  // Unified rendering: SeasonDetail and Matches pages share the same
  // MatchListRow component — single source of truth for team/score
  // column alignment AND result formatting. Prevents drift between
  // two previously-separate render paths.
  return (
    <div className="space-y-2">
      {filtered.map((m) => (
        <MatchListRow key={m.id} match={m} season={season} />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Fixture schedule view (no results — pure schedule)
// ─────────────────────────────────────────────────────────────────────────────

function formatDateHeader(iso: string): { weekday: string; dayMonth: string; year: string } {
  // ISO YYYY-MM-DD. Parse as local-noon to avoid timezone roll-back.
  const [y, m, d] = iso.split('-').map((n) => parseInt(n, 10))
  if (!y || !m || !d) return { weekday: '', dayMonth: iso, year: '' }
  const dt = new Date(y, m - 1, d, 12)
  return {
    weekday: dt.toLocaleDateString('en-IN', { weekday: 'long' }),
    dayMonth: dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    year: String(y),
  }
}

// ── Time helpers ──────────────────────────────────────────────────────────
//
// Cricsheet does not carry start-of-play times, so the kickoff is inferred
// from the well-established IPL convention:
//   • single match on a date  → 7:30 PM IST  (evening slot)
//   • double-header (two)     → 3:30 PM IST (earlier matchNumber)
//                              + 7:30 PM IST (later matchNumber)
// IST is UTC+5:30 with no DST, which makes the math straightforward.
// The hour-only inference lives in @/lib/matchTime so it can be shared
// with the weather service.

import { inferIstKickoffHour } from '@/lib/matchTime'

function inferIstKickoff(
  match: Match,
  matchesOnSameDate: Match[]
): { h: number; mi: number } {
  return { h: inferIstKickoffHour(match, matchesOnSameDate), mi: 30 }
}

const VIEWER_TZ =
  typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : 'Asia/Kolkata'
const VIEWER_IS_IST = VIEWER_TZ === 'Asia/Kolkata' || VIEWER_TZ === 'Asia/Calcutta'

/** Venue → timezone map for IPL matches played outside India.
 *  All other venues are assumed to be Asia/Kolkata (IST). */
const VENUE_TIMEZONES: Record<string, { tz: string; abbr: string }> = {
  // ── IPL 2009 — South Africa (SAST, UTC+2) ──
  'Buffalo Park': { tz: 'Africa/Johannesburg', abbr: 'SAST' },
  'De Beers Diamond Oval': { tz: 'Africa/Johannesburg', abbr: 'SAST' },
  Kingsmead: { tz: 'Africa/Johannesburg', abbr: 'SAST' },
  'New Wanderers Stadium': { tz: 'Africa/Johannesburg', abbr: 'SAST' },
  Newlands: { tz: 'Africa/Johannesburg', abbr: 'SAST' },
  'OUTsurance Oval': { tz: 'Africa/Johannesburg', abbr: 'SAST' },
  "St George's Park": { tz: 'Africa/Johannesburg', abbr: 'SAST' },
  'SuperSport Park': { tz: 'Africa/Johannesburg', abbr: 'SAST' },
  // ── IPL 2014 (first leg), 2020, 2021 (second leg) — UAE (GST, UTC+4) ──
  'Dubai International Cricket Stadium': { tz: 'Asia/Dubai', abbr: 'GST' },
  'Sharjah Cricket Stadium': { tz: 'Asia/Dubai', abbr: 'GST' },
  'Sheikh Zayed Stadium': { tz: 'Asia/Dubai', abbr: 'GST' },
}

function getVenueTimezone(venue: string): { tz: string; abbr: string } {
  return VENUE_TIMEZONES[venue] || { tz: 'Asia/Kolkata', abbr: 'IST' }
}

interface KickoffDisplay {
  ist: string
  /** Present only when the venue is outside India. */
  venueLocal?: { time: string; abbr: string }
  /** Present only when the viewer is not in IST and not in the venue's tz. */
  viewerLocal?: { time: string; abbr: string }
}

function formatKickoff(
  date: string,
  hours: number,
  minutes: number,
  venue: string
): KickoffDisplay {
  const [y, m, d] = date.split('-').map((n) => parseInt(n, 10))
  if (!y || !m || !d) return { ist: '' }
  // Build the absolute UTC instant for hh:mm IST. IST is UTC+5:30 (no DST).
  const utcMs = Date.UTC(y, m - 1, d, hours - 5, minutes - 30)
  const instant = new Date(utcMs)

  const fmtIn = (tz: string) =>
    instant
      .toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: tz,
      })
      .toUpperCase()

  const ist = fmtIn('Asia/Kolkata')
  const result: KickoffDisplay = { ist }

  // Venue-local time, only when the venue is abroad.
  const vtz = getVenueTimezone(venue)
  if (vtz.tz !== 'Asia/Kolkata') {
    result.venueLocal = { time: fmtIn(vtz.tz), abbr: vtz.abbr }
  }

  // Viewer-local time, only when:
  //   • the viewer is not already in IST, AND
  //   • the viewer's local time is not the same as the venue-local time
  //     (avoids duplicate "5:30 PM GST" / "5:30 PM GST" lines).
  if (!VIEWER_IS_IST) {
    const viewerTime = instant
      .toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      })
      .toUpperCase()
    const viewerAbbr =
      new Intl.DateTimeFormat(undefined, { timeZoneName: 'short' })
        .formatToParts(instant)
        .find((p) => p.type === 'timeZoneName')?.value || VIEWER_TZ
    const dupesVenue =
      result.venueLocal && result.venueLocal.time === viewerTime
    if (!dupesVenue) {
      result.viewerLocal = { time: viewerTime, abbr: viewerAbbr }
    }
  }

  return result
}

// ── Schedule grouping ─────────────────────────────────────────────────────

function FixtureSchedule({ matches }: { matches: Match[] }) {
  // Group consecutive matches by date
  const groups = useMemo(() => {
    const out: { date: string; matches: Match[] }[] = []
    for (const m of matches) {
      const last = out[out.length - 1]
      if (last && last.date === m.date) last.matches.push(m)
      else out.push({ date: m.date, matches: [m] })
    }
    return out
  }, [matches])

  return (
    <div className="space-y-8">
      {groups.map(({ date, matches: dayMatches }) => {
        const { weekday, dayMonth, year } = formatDateHeader(date)
        return (
          <section key={date}>
            {/* Date header */}
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-extrabold text-white tabular-nums">
                  {dayMonth}
                </span>
                <span className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                  {year}
                </span>
              </div>
              <div className="h-px flex-1 bg-gradient-to-r from-[#1e1e3a] to-transparent" />
              <span className="text-[11px] font-bold text-accent uppercase tracking-wider">
                {weekday}
              </span>
            </div>

            <div className="space-y-2">
              {dayMatches.map((m) => (
                <FixtureCard key={m.id} match={m} matchesOnSameDate={dayMatches} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

function FixtureCard({
  match,
  matchesOnSameDate,
}: {
  match: Match
  matchesOnSameDate: Match[]
}) {
  const team1 = match.teams?.[0]
  const team2 = match.teams?.[1]
  const short1 = TEAM_SHORT[team1] || team1
  const short2 = TEAM_SHORT[team2] || team2
  const color1 = TEAM_COLORS[team1]?.primary || '#6366f1'
  const color2 = TEAM_COLORS[team2]?.primary || '#6366f1'
  const stage = match.playoffStage
  const { h, mi } = inferIstKickoff(match, matchesOnSameDate)
  const kickoff = formatKickoff(match.date, h, mi, match.venue)

  return (
    <Link
      to={`/matches/${match.id}`}
      className="group block bg-[#0f0f1a] border border-[#1e1e3a] rounded-2xl overflow-hidden hover:border-accent/40 transition-all"
    >
      {/* Use CSS Grid for the outer row so each rail has a fixed column,
          and the centre teams block uses its own 1fr·auto·1fr sub-grid to
          guarantee the "vs" pill is mathematically centred regardless of
          team-name length differences. */}
      <div className="grid grid-cols-[auto_1fr] md:grid-cols-[auto_1fr_auto] items-stretch">
        {/* ── Left rail: match # + kickoff ── */}
        <div
          className="flex flex-col items-center justify-center px-3 sm:px-4 py-4 border-r border-[#1e1e3a] min-w-[88px]"
          style={{
            background: stage
              ? 'linear-gradient(180deg, rgba(251,191,36,0.10) 0%, transparent 100%)'
              : 'linear-gradient(180deg, rgba(99,102,241,0.10) 0%, transparent 100%)',
          }}
        >
          {stage ? (
            <>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider leading-tight text-center">
                {stage}
              </span>
            </>
          ) : (
            <>
              <span className="text-[10px] font-semibold text-[#64748b] uppercase tracking-wider leading-tight">
                Match
              </span>
              <span className="text-xl font-extrabold text-white tabular-nums leading-tight mt-0.5">
                {match.matchNumber || '—'}
              </span>
            </>
          )}
          <div className="w-8 h-px bg-[#1e1e3a] my-2" />
          {/* IST is always shown — it's the official broadcast slot */}
          <span className="text-[11px] font-bold text-white tabular-nums leading-tight whitespace-nowrap">
            {kickoff.ist}
          </span>
          <span className="text-[9px] text-[#64748b] uppercase tracking-wider leading-tight">
            IST
          </span>
          {/* Venue-local time, only for matches played outside India */}
          {kickoff.venueLocal && (
            <>
              <span className="text-[10px] font-semibold text-amber-300 tabular-nums leading-tight mt-1 whitespace-nowrap">
                {kickoff.venueLocal.time}
              </span>
              <span
                className="text-[9px] text-amber-400/70 uppercase tracking-wider leading-tight"
                title="Local time at the venue"
              >
                {kickoff.venueLocal.abbr} · LOCAL
              </span>
            </>
          )}
          {/* Viewer's own time, only when viewer is outside both IST and the venue tz */}
          {kickoff.viewerLocal && (
            <>
              <span className="text-[10px] font-semibold text-[#94a3b8] tabular-nums leading-tight mt-1 whitespace-nowrap">
                {kickoff.viewerLocal.time}
              </span>
              <span
                className="text-[9px] text-[#64748b] uppercase tracking-wider leading-tight"
                title="Your local time"
              >
                {kickoff.viewerLocal.abbr}
              </span>
            </>
          )}
        </div>

        {/* ── Centre: teams (1fr · auto · 1fr grid for perfect centring) ── */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5 px-4 sm:px-6 py-4 min-w-0">
          {/* Team 1: right-aligned, name → logo */}
          <div className="flex items-center gap-2 sm:gap-3 justify-end min-w-0">
            <div className="text-right min-w-0">
              <div
                className="text-sm font-bold truncate"
                style={{ color: color1 }}
              >
                {short1}
              </div>
              <div className="text-[10px] text-[#64748b] truncate hidden lg:block">
                {team1}
              </div>
            </div>
            <TeamBadge team={team1} size={40} season={match.season} />
          </div>

          {/* "vs" pill — anchored to the auto column so it sits dead-centre */}
          <div className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#1e1e3a]/50 border border-[#1e1e3a]">
            vs
          </div>

          {/* Team 2: left-aligned, logo → name */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <TeamBadge team={team2} size={40} season={match.season} />
            <div className="min-w-0">
              <div
                className="text-sm font-bold truncate"
                style={{ color: color2 }}
              >
                {short2}
              </div>
              <div className="text-[10px] text-[#64748b] truncate hidden lg:block">
                {team2}
              </div>
            </div>
          </div>
        </div>

        {/* ── Right rail: venue (md+ only) ──
            Width allows the longest official IPL venue names to wrap to
            two lines without truncation (longest is 55 chars, "Maharaja
            Yadavindra Singh International Cricket Stadium"). The min-h
            keeps every card the same height regardless of whether the
            venue fits on 1 or 2 lines, so the row of cards reads cleanly. */}
        <div className="hidden md:flex flex-col justify-center px-5 py-4 border-l border-[#1e1e3a] w-[300px] shrink-0 min-h-[88px]">
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-1">
            <MapPin size={11} />
            Venue
          </div>
          <div
            className="text-xs font-bold text-white leading-snug line-clamp-2 break-words"
            title={match.venue}
          >
            {match.venue}
          </div>
          {match.city && (
            <div className="text-[11px] text-[#64748b] truncate mt-0.5">
              {match.city}
            </div>
          )}
        </div>
      </div>

      {/* Mobile-only venue line (right rail is hidden under md).
          On mobile we have width to spare horizontally, so we wrap the
          name normally instead of truncating it. */}
      <div className="md:hidden flex items-start gap-1.5 text-[11px] text-[#64748b] px-4 pb-3 pt-2 border-t border-[#1e1e3a]/40">
        <MapPin size={11} className="shrink-0 mt-0.5" />
        <span className="leading-snug">
          {match.venue}
          {match.city ? ` · ${match.city}` : ''}
        </span>
      </div>
    </Link>
  )
}

// MatchCard was previously defined here. Removed in favour of the shared
// <MatchListRow> component (`src/components/matches/MatchListRow.tsx`) which
// is now used by BOTH this page and SeasonDetail.tsx — single source of truth
// for match-row rendering.

// ─────────────────────────────────────────────────────────────────────────────
// Points Table tab
// ─────────────────────────────────────────────────────────────────────────────

function PointsTableTab({
  season,
  sortedSeasons,
  onChange,
}: {
  season: string
  sortedSeasons: any[]
  onChange: (patch: Record<string, string | undefined>) => void
}) {
  const { data: matches, isLoading } = useMatches(season)
  const rows = useMemo(
    () => computePointsTable((matches || []) as any),
    [matches]
  )
  // Each table row can be expanded to show that team's full schedule
  // (results for played matches, fixture details for upcoming ones).
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set())
  // Reset expansions when the season changes — it's confusing to keep
  // a team expanded across seasons when its row may not even exist.
  useEffect(() => {
    setExpandedTeams(new Set())
  }, [season])

  const toggleTeam = (team: string) => {
    setExpandedTeams((prev) => {
      const next = new Set(prev)
      if (next.has(team)) next.delete(team)
      else next.add(team)
      return next
    })
  }

  return (
    <div>
      <SeasonToolbar
        season={season}
        sortedSeasons={sortedSeasons}
        onChange={(s) => onChange({ season: s })}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : rows.length === 0 ? (
        <div className="text-center py-16 text-[#94a3b8] text-sm">
          No standings available for IPL {season}.
        </div>
      ) : (
        <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl overflow-x-auto">
          <table className="w-full min-w-[680px]">
            <thead>
              <tr className="border-b border-[#1e1e3a] text-[11px] uppercase tracking-wider text-[#64748b]">
                <th className="text-left px-4 py-3 w-12">#</th>
                <th className="text-left px-4 py-3">Team</th>
                <th className="text-right px-3 py-3">P</th>
                <th className="text-right px-3 py-3">W</th>
                <th className="text-right px-3 py-3">L</th>
                <th className="text-right px-3 py-3">T</th>
                <th className="text-right px-3 py-3">NR</th>
                <th className="text-right px-3 py-3">NRR</th>
                <th className="text-right px-4 py-3">Pts</th>
                <th className="px-3 py-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const color = TEAM_COLORS[r.team]?.primary || '#6366f1'
                const isExpanded = expandedTeams.has(r.team)
                const teamSlug = r.team.replace(/\s+/g, '-').toLowerCase()
                return (
                  <Fragment key={r.team}>
                    <tr
                      onClick={() => toggleTeam(r.team)}
                      className={`border-b border-[#1e1e3a]/60 cursor-pointer transition-colors ${
                        isExpanded
                          ? 'bg-accent/[0.06]'
                          : 'hover:bg-accent/[0.04]'
                      }`}
                      aria-expanded={isExpanded}
                    >
                      <td className="px-4 py-3 text-sm font-bold text-white">{i + 1}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <TeamBadge team={r.team} size={32} season={season} />
                          {/* Team name is the only "click target" inside the
                              row that should NOT toggle expansion. We stop
                              propagation here so the click reaches the Link
                              navigation but doesn't bubble up to <tr>. */}
                          <Link
                            to={`/teams/${teamSlug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm font-semibold text-white hover:text-accent transition-colors truncate"
                          >
                            {r.team}
                          </Link>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right text-sm text-[#cbd5e1]">{r.played}</td>
                      <td className="px-3 py-3 text-right text-sm text-green-400 font-semibold">{r.won}</td>
                      <td className="px-3 py-3 text-right text-sm text-red-400 font-semibold">{r.lost}</td>
                      <td className="px-3 py-3 text-right text-sm text-[#cbd5e1]">{r.tied}</td>
                      <td className="px-3 py-3 text-right text-sm text-[#cbd5e1]">{r.noResult}</td>
                      <td className="px-3 py-3 text-right text-sm text-[#cbd5e1] tabular-nums">
                        {r.nrr > 0 ? '+' : ''}
                        {r.nrr.toFixed(3)}
                      </td>
                      <td className="px-4 py-3 text-right text-base font-extrabold text-white tabular-nums">
                        {r.points}
                      </td>
                      <td className="px-3 py-3">
                        <ChevronDown
                          size={16}
                          className={`text-[#64748b] transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-accent' : ''
                          }`}
                        />
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className="bg-[#0a0a0f]/50">
                        <td colSpan={10} className="px-0 py-0 border-b border-[#1e1e3a]/60">
                          <TeamSeasonSchedule
                            team={r.team}
                            allMatches={(matches || []) as Match[]}
                            color={color}
                          />
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-team season schedule (rendered inside an expanded points-table row)
// ─────────────────────────────────────────────────────────────────────────────

function TeamSeasonSchedule({
  team,
  allMatches,
  color,
}: {
  team: string
  allMatches: Match[]
  color: string
}) {
  // Every match this team plays in the season, sorted by match number
  // (which is the natural schedule order).
  const teamMatches = useMemo(
    () =>
      allMatches
        .filter((m) => (m.teams || []).includes(team))
        .slice()
        .sort((a, b) => {
          const ma = a.matchNumber ?? Number.MAX_SAFE_INTEGER
          const mb = b.matchNumber ?? Number.MAX_SAFE_INTEGER
          if (ma !== mb) return ma - mb
          return (a.date || '').localeCompare(b.date || '')
        }),
    [allMatches, team]
  )

  if (teamMatches.length === 0) {
    return (
      <div className="px-6 py-4 text-xs text-gray-500 italic">
        No matches scheduled for {team} in this season.
      </div>
    )
  }

  return (
    <div
      className="px-4 sm:px-6 py-4 border-l-2"
      style={{ borderLeftColor: color }}
    >
      <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748b] mb-3">
        {team} — Season Schedule ({teamMatches.length} matches)
      </div>
      <div className="space-y-1.5">
        {teamMatches.map((m) => (
          <TeamScheduleRow key={m.id} match={m} myTeam={team} />
        ))}
      </div>
    </div>
  )
}

function TeamScheduleRow({ match, myTeam }: { match: Match; myTeam: string }) {
  const opponent =
    (match.teams || []).find((t) => t !== myTeam) || 'Opponent'
  const myShort = TEAM_SHORT[myTeam] || myTeam.slice(0, 3).toUpperCase()
  const oppShort = TEAM_SHORT[opponent] || opponent.slice(0, 3).toUpperCase()
  const myColor = TEAM_COLORS[myTeam]?.primary || '#6366f1'
  const oppColor = TEAM_COLORS[opponent]?.primary || '#6366f1'
  const isNoResult = match.result === 'no result' || match.abandoned === true
  const isPlayed = !!match.winner || isNoResult
  const isWin = isPlayed && match.winner === myTeam
  const isLoss = isPlayed && match.winner && match.winner !== myTeam
  const isAbandoned = isNoResult

  // "Won by 23 runs", "Lost by 5 wkts", etc. Uses formatMatchResult() so
  // super-over / tied matches get "(Super Over)" instead of missing data.
  let resultText: string | null = null
  if (isAbandoned) {
    resultText = 'No Result'
  } else if (isWin || isLoss) {
    const r = formatMatchResult(match as any, TEAM_SHORT)
    if (r.kind === 'tie') {
      resultText = isWin ? 'Won (Super Over)' : 'Lost (Super Over)'
    } else {
      const prefix = isWin ? 'Won' : 'Lost'
      const m = match.winMargin
      if (m?.runs && m.runs > 0) resultText = `${prefix} by ${m.runs} runs`
      else if (m?.wickets && m.wickets > 0) resultText = `${prefix} by ${m.wickets} wkts`
      else resultText = prefix
    }
  }

  const myInn = match.innings?.find((inn) => inn.team === myTeam)
  const oppInn = match.innings?.find((inn) => inn.team === opponent)

  // Both played and unplayed rows share the SAME grid column template so
  // their column boundaries (badge / date / centre / right) line up
  // perfectly across the entire dropdown. The CELL CONTENT differs by
  // phase, and that intentional variation is itself the visual cue that
  // tells the user "this match hasn't been played yet" vs "this one has".
  return (
    <Link
      to={`/matches/${match.id}`}
      onClick={(e) => e.stopPropagation()}
      className={`grid grid-cols-[56px_104px_1fr_180px] items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
        isPlayed
          ? 'bg-[#131320]/60 border-[#1e1e3a] hover:border-accent/40 hover:bg-[#131320]'
          : 'bg-accent/[0.04] border-accent/15 hover:border-accent/40 hover:bg-accent/[0.08]'
      }`}
    >
      {/* Match number / playoff badge */}
      <span className="text-[10px] font-bold text-[#64748b] bg-[#0a0a0f]/60 px-2 py-0.5 rounded uppercase tracking-wider text-center tabular-nums">
        {match.playoffStage ? 'PO' : `M${match.matchNumber || '?'}`}
      </span>

      {/* Date */}
      <span className="text-xs text-gray-400 tabular-nums">{match.date}</span>

      {/* Centre column.
          Sub-grid with 5 fixed-width slots so the matchup elements
          (team1, score1, vs, score2, team2) line up in TRUE vertical
          columns across every row, no matter how short or long the
          team abbreviations are. Played and unplayed rows share the
          same sub-grid template so an unplayed row's "vs" sits at the
          identical X position as a played row's "vs" — empty score
          slots preserve the layout. */}
      {isPlayed ? (
        <div className="grid grid-cols-[56px_60px_40px_60px_56px] items-center justify-center mx-auto gap-2">
          <span
            className="text-sm font-extrabold tabular-nums text-right"
            style={{ color: myColor }}
          >
            {myShort}
          </span>
          <span className="text-[11px] font-mono text-white tabular-nums text-center whitespace-nowrap">
            {myInn ? `${myInn.runs}/${myInn.wickets}` : ''}
          </span>
          <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#1e1e3a]/40 text-center justify-self-center">
            vs
          </span>
          <span className="text-[11px] font-mono text-white tabular-nums text-center whitespace-nowrap">
            {oppInn ? `${oppInn.runs}/${oppInn.wickets}` : ''}
          </span>
          <span
            className="text-sm font-extrabold tabular-nums text-left"
            style={{ color: oppColor }}
          >
            {oppShort}
          </span>
        </div>
      ) : (
        // Unplayed: two-line stack — same fixed-slot sub-grid on the
        // top line so vertical alignment matches played rows; venue
        // beneath. The two-line shape + accent tint distinguish
        // upcoming matches from finished ones.
        <div className="flex flex-col items-center justify-center gap-1 mx-auto min-w-0">
          <div className="grid grid-cols-[56px_60px_40px_60px_56px] items-center gap-2">
            <span
              className="text-sm font-extrabold tabular-nums text-right"
              style={{ color: myColor }}
            >
              {myShort}
            </span>
            {/* empty score slot keeps the column alignment */}
            <span aria-hidden />
            <span className="text-[10px] font-bold text-[#64748b] uppercase tracking-widest px-1.5 py-0.5 rounded bg-[#1e1e3a]/40 text-center justify-self-center">
              vs
            </span>
            <span aria-hidden />
            <span
              className="text-sm font-extrabold tabular-nums text-left"
              style={{ color: oppColor }}
            >
              {oppShort}
            </span>
          </div>
          <span
            className="text-[10px] text-gray-500 truncate max-w-full text-center"
            title={`${match.venue}${match.city ? ', ' + match.city : ''}`}
          >
            {match.venue}
            {match.city ? ` · ${match.city}` : ''}
          </span>
        </div>
      )}

      {/* Right column — single fixed-width pill, no sub-line.
          Played rows show the result; unplayed rows show "Scheduled".
          Identical alignment across the column for every row. */}
      <div className="flex items-center justify-end min-w-0">
        {isPlayed ? (
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border whitespace-nowrap ${
              isWin
                ? 'text-green-400 bg-green-400/10 border-green-400/30'
                : isAbandoned
                  ? 'text-gray-400 bg-gray-400/10 border-gray-400/30'
                  : 'text-red-400 bg-red-400/10 border-red-400/30'
            }`}
          >
            {resultText}
          </span>
        ) : (
          <span className="text-[11px] font-bold text-accent bg-accent/10 border border-accent/30 px-2.5 py-1 rounded-full whitespace-nowrap">
            Scheduled
          </span>
        )}
      </div>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Playoffs tab
// ─────────────────────────────────────────────────────────────────────────────

function PlayoffsTab({
  season,
  sortedSeasons,
  onChange,
}: {
  season: string
  sortedSeasons: any[]
  onChange: (patch: Record<string, string | undefined>) => void
}) {
  const { data: matches, isLoading } = useMatches(season)

  return (
    <div>
      <SeasonToolbar
        season={season}
        sortedSeasons={sortedSeasons}
        onChange={(s) => onChange({ season: s })}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        // Single shared bracket component used by both this tab and
        // SeasonDetail. Ensures the playoff representation never drifts.
        <RoadToFinal matches={(matches || []) as any} season={season} />
      )}
    </div>
  )
}
