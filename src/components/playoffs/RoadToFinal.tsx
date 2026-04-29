import { Trophy, ArrowRight, X, Calendar, Clock, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { TEAM_SHORT, TEAM_COLORS } from '@/lib/constants'
import TeamBadge from '@/components/ui/TeamBadge'
import {
  getPlayoffMatches,
  getPlayoffFormat,
  computePointsTable,
} from '@/services/pointsTableService'
import { inferIstKickoffHour } from '@/lib/matchTime'
import type { Match } from '@/types'

/**
 * RoadToFinal
 * -----------
 * Bracket-style visualisation of a season's playoffs. Used by both
 * SeasonDetail and the Matches page's Playoffs tab so the representation
 * stays identical wherever playoffs appear.
 *
 * Two formats are supported:
 *
 *   modern (2011+):  3 columns
 *     Col 1: Qualifier 1 (top) + Eliminator (bottom)
 *     Col 2: Qualifier 2 (centred vertically)
 *     Col 3: Final + champion treatment
 *
 *   classic (2008-2010):  2 columns
 *     Col 1: Semi Final 1 + Semi Final 2 (+ 3rd Place Play-Off in 2010)
 *     Col 2: Final + champion treatment
 *
 * Each StageCard names both teams, shows their score (when played),
 * highlights the winner in their team colour, dims the loser, and shows
 * a progression banner ("→ Final" / "→ Q2") so the eye can trace the path
 * from the league stage all the way to the trophy.
 */
interface RoadToFinalProps {
  matches: Match[]
  season: string
  /** Optional title override (defaults to "Road to the Final"). */
  title?: string
}

export default function RoadToFinal({
  matches,
  season,
  title = 'Road to the Final',
}: RoadToFinalProps) {
  const playoffs = getPlayoffMatches(matches || [])
  const format = getPlayoffFormat(season)

  // For in-progress seasons (or any season where the playoffs haven't been
  // played yet) we still render the FULL bracket structure with TBD
  // placeholders so the user can see the format and what's coming up.
  // The bracket cards show "TBD vs TBD" and the progression banners
  // collapse to just the format flow.
  const bracketMatches = playoffs.length > 0 ? playoffs : buildTbdBracket(format)
  const isPlaceholder = playoffs.length === 0

  return (
    <div>
      <Header
        season={season}
        format={format}
        title={title}
        isPlaceholder={isPlaceholder}
      />
      {format === 'modern' ? (
        <ModernBracket
          matches={bracketMatches}
          allMatches={matches || []}
          season={season}
        />
      ) : (
        <ClassicBracket
          matches={bracketMatches}
          allMatches={matches || []}
          season={season}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// TBD bracket builder
// ─────────────────────────────────────────────────────────────────────────────

const TBD = 'TBD'

/** Construct synthetic placeholder match records so the bracket can render
 *  even before any playoff has been played. The placeholders carry the
 *  stage label so the existing bracket logic groups them correctly. */
function buildTbdBracket(format: 'modern' | 'classic'): Match[] {
  const stub = (id: string, stage: string): Match => ({
    id,
    season: '',
    date: '',
    venue: '',
    teams: [TBD, TBD],
    playoffStage: stage,
  } as unknown as Match)
  if (format === 'modern') {
    return [
      stub('tbd-q1', 'Qualifier 1'),
      stub('tbd-elim', 'Eliminator'),
      stub('tbd-q2', 'Qualifier 2'),
      stub('tbd-final', 'Final'),
    ]
  }
  return [
    stub('tbd-sf1', 'Semi Final'),
    stub('tbd-sf2', 'Semi Final'),
    stub('tbd-final', 'Final'),
  ]
}

// ─────────────────────────────────────────────────────────────────────────────
// Match meta row (date / time / venue / city)
// ─────────────────────────────────────────────────────────────────────────────

/** Format an ISO date "YYYY-MM-DD" as "Tue, 21 May 2024". Falls back to the
 *  raw string if it can't be parsed (so old data never goes blank). */
function formatMatchDate(iso?: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Format a kickoff hour (15 or 19) as "3:30 PM IST" / "7:30 PM IST". */
function formatKickoff(hour: 15 | 19): string {
  return hour === 15 ? '3:30 PM IST' : '7:30 PM IST'
}

function MatchMeta({
  match,
  allMatches,
}: {
  match: Match
  allMatches: Match[]
}) {
  const dateLabel = formatMatchDate(match.date)
  // Kickoff is inferred from the full season's match list (double-headers
  // get a 3:30 PM slot for the lower matchNumber, otherwise 7:30 PM).
  const kickoff = match.date
    ? formatKickoff(inferIstKickoffHour(match, allMatches))
    : ''
  const venue = match.venue
  const city = match.city

  if (!dateLabel && !venue && !city) return null

  return (
    <div className="mb-3 grid grid-cols-1 gap-1.5 rounded-lg border border-[#1e1e3a]/70 bg-black/20 px-3 py-2">
      {dateLabel && (
        <div className="flex items-center gap-2 text-[11px] text-gray-300">
          <Calendar size={12} className="text-amber-400/80 shrink-0" />
          <span className="tabular-nums">{dateLabel}</span>
          {kickoff && (
            <>
              <span className="text-gray-600">•</span>
              <Clock size={12} className="text-amber-400/80 shrink-0" />
              <span className="tabular-nums">{kickoff}</span>
            </>
          )}
        </div>
      )}
      {(venue || city) && (
        <div className="flex items-start gap-2 text-[11px] text-gray-300">
          <MapPin size={12} className="text-amber-400/80 shrink-0 mt-0.5" />
          <span className="leading-snug">
            {venue}
            {venue && city && <span className="text-gray-500">, </span>}
            {city && <span className="text-gray-400">{city}</span>}
          </span>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Header
// ─────────────────────────────────────────────────────────────────────────────

function Header({
  season,
  format,
  title,
  isPlaceholder,
}: {
  season: string
  format: 'modern' | 'classic'
  title: string
  isPlaceholder: boolean
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <div className="w-1.5 h-7 rounded-full bg-gradient-to-b from-amber-400 to-amber-600" />
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
          {title}
        </h2>
        {isPlaceholder && (
          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded-full px-2.5 py-0.5 uppercase tracking-wider">
            Awaiting league stage
          </span>
        )}
      </div>
      <p className="text-xs md:text-sm text-gray-400 ml-4">
        {format === 'modern' ? (
          <>
            IPL {season} playoff format: top 4 teams compete across four
            knockout matches. <span className="text-amber-400">Qualifier 1</span>{' '}
            (1st vs 2nd) — winner straight to the Final, loser drops to{' '}
            <span className="text-amber-400">Qualifier 2</span>.{' '}
            <span className="text-amber-400">Eliminator</span> (3rd vs 4th) —
            loser is knocked out, winner advances to Q2.{' '}
            <span className="text-amber-400">Q2</span> winner meets the Q1
            winner in the <span className="text-amber-400">Final</span>.
          </>
        ) : (
          <>
            IPL {season} playoff format: top 4 teams played a traditional
            knockout bracket — two{' '}
            <span className="text-amber-400">Semi Finals</span> feeding
            straight into the <span className="text-amber-400">Final</span>.
            {season === '2008' || season === '2009' ? (
              <>
                {' '}The semifinals paired{' '}
                <span className="text-amber-400">1st vs 4th</span> and{' '}
                <span className="text-amber-400">2nd vs 3rd</span> — standard
                knockout seeding.
              </>
            ) : season === '2010' ? (
              <>
                {' '}IPL 2010 used a quirky seeding:{' '}
                <span className="text-amber-400">1st vs 2nd</span> and{' '}
                <span className="text-amber-400">3rd vs 4th</span> in the
                semis, followed by a dedicated{' '}
                <span className="text-amber-400">3rd Place Play-Off</span>{' '}
                between the losing semifinalists — the only IPL season ever
                to feature a consolation round.
              </>
            ) : null}
          </>
        )}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Modern bracket (Q1 + Elim → Q2 → Final)
// ─────────────────────────────────────────────────────────────────────────────

function ModernBracket({
  matches,
  allMatches,
  season,
}: {
  matches: Match[]
  allMatches: Match[]
  season: string
}) {
  const q1 = matches.find((m) => m.playoffStage === 'Qualifier 1')
  const elim = matches.find((m) => m.playoffStage === 'Eliminator')
  const q2 = matches.find((m) => m.playoffStage === 'Qualifier 2')
  const final = matches.find((m) => m.playoffStage === 'Final')

  const q1Loser = q1?.winner ? q1.teams.find((t) => t !== q1.winner) : undefined
  const elimWinner = elim?.winner

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-10 lg:min-h-[540px]">
        {/* ── Column 1: Q1 + Elim stacked ── */}
        <div className="flex flex-col gap-4 lg:gap-6 lg:justify-between">
          <StageCard
            stage="Qualifier 1"
            subtitle="1st vs 2nd"
            match={q1}
            allMatches={allMatches}
            advancesTo="Final"
            loserNote="Loser → Qualifier 2"
          />
          <StageCard
            stage="Eliminator"
            subtitle="3rd vs 4th"
            match={elim}
            allMatches={allMatches}
            advancesTo="Qualifier 2"
            loserNote="Loser eliminated"
            loserEliminated
          />
        </div>

        {/* ── Column 2: Q2 (centered vertically) ── */}
        <div className="flex items-center">
          <div className="w-full">
            <StageCard
              stage="Qualifier 2"
              subtitle={
                q1Loser && elimWinner
                  ? `${TEAM_SHORT[q1Loser] || q1Loser} (Q1) vs ${TEAM_SHORT[elimWinner] || elimWinner} (Elim)`
                  : 'Q1 loser vs Eliminator winner'
              }
              match={q2}
              allMatches={allMatches}
              advancesTo="Final"
              loserNote="Loser eliminated"
              loserEliminated
            />
          </div>
        </div>

        {/* ── Column 3: Final + Champion ── */}
        <div className="flex items-center">
          <div className="w-full">
            <FinalCard match={final} allMatches={allMatches} season={season} />
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Classic bracket (2008-2010 — SF1 + SF2 → Final, plus 2010's 3rd Place Play-Off)
// ─────────────────────────────────────────────────────────────────────────────
//
// Design:
//
//   Two columns. Left column holds the two semifinal cards stacked. Right
//   column holds the Final + champion treatment, vertically centred so it
//   aligns between the two semis. No connector lines — the layout alone
//   conveys the flow. 2010's consolation 3rd-place playoff lives in a
//   clearly-subordinate block beneath the main bracket.
//
// Semi-final seed labels are computed from the league-stage points table
// so "1st v 4th" (2008/2009) and "1st v 2nd" (2010) both render correctly
// without hardcoding the seeding rule.

function getTeamSeed(teamName: string, pointsTable: { team: string }[]): number | null {
  const idx = pointsTable.findIndex((r) => r.team === teamName)
  return idx >= 0 ? idx + 1 : null
}

function seedMatchupLabel(
  match: Match | undefined,
  pointsTable: { team: string }[],
): string {
  if (!match || !match.teams || match.teams.length !== 2) return ''
  const [a, b] = match.teams
  if (a === TBD || b === TBD) return 'Seeded semifinal'
  const sa = getTeamSeed(a, pointsTable)
  const sb = getTeamSeed(b, pointsTable)
  if (sa == null || sb == null) return 'Seeded semifinal'
  const lo = Math.min(sa, sb)
  const hi = Math.max(sa, sb)
  const ord = (n: number) => (n === 1 ? '1st' : n === 2 ? '2nd' : n === 3 ? '3rd' : `${n}th`)
  return `${ord(lo)} seed vs ${ord(hi)} seed`
}

function ClassicBracket({
  matches,
  allMatches,
  season,
}: {
  matches: Match[]
  allMatches: Match[]
  season: string
}) {
  const semis = matches.filter((m) => m.playoffStage === 'Semi Final')
  const thirdPlace = matches.find(
    (m) => m.playoffStage === '3rd Place Play-Off'
  )
  const final = matches.find((m) => m.playoffStage === 'Final')

  // Points table to derive seed labels ("1st vs 4th"). We pass only the
  // non-playoff matches to computePointsTable (the service already
  // filters, but this keeps the intent explicit).
  const pointsTable = computePointsTable(allMatches || [])

  const sf1Subtitle = seedMatchupLabel(semis[0], pointsTable)
  const sf2Subtitle = seedMatchupLabel(semis[1], pointsTable)

  return (
    <div>
      {/* ── Main bracket: 2 columns on desktop, stacked on mobile ───────
          Left column holds the two semifinal cards stacked with generous
          vertical spacing. Right column holds the Final + champion,
          vertically centred. No connector lines — clean layout only. */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-10 lg:min-h-[520px] items-stretch">
        {/* ── Semis (left) ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 lg:gap-8 lg:justify-around">
          <StageCard
            stage="Semi Final 1"
            subtitle={sf1Subtitle || 'First semifinal'}
            match={semis[0]}
            allMatches={allMatches}
            advancesTo="Final"
            loserNote="Loser → Out"
            loserEliminated
          />
          <StageCard
            stage="Semi Final 2"
            subtitle={sf2Subtitle || 'Second semifinal'}
            match={semis[1]}
            allMatches={allMatches}
            advancesTo="Final"
            loserNote="Loser → Out"
            loserEliminated
          />
        </div>

        {/* ── Final (right) ────────────────────────────────────────── */}
        <div className="flex items-center">
          <div className="w-full">
            <FinalCard match={final} allMatches={allMatches} season={season} />
          </div>
        </div>
      </div>

      {/* ── 3rd Place Play-Off (2010 only) ─────────────────────────────
          Rendered as a clearly-subordinate "consolation round" block
          below the main bracket, visually separated by its own heading
          and softer styling so the user understands it's outside the
          title path. */}
      {thirdPlace && (
        <div className="mt-8 pt-6 border-t border-dashed border-[#1e1e3a]">
          <div className="mb-3 flex items-center gap-2">
            <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-slate-400 to-slate-600" />
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
              Consolation Round
            </h3>
            <span className="text-[10px] text-gray-500 italic">
              (IPL 2010 featured a unique 3rd-place playoff between the losing semifinalists — not part of the title path)
            </span>
          </div>
          <div className="max-w-2xl">
            <StageCard
              stage="3rd Place Play-Off"
              subtitle="Losing semifinalists"
              match={thirdPlace}
              allMatches={allMatches}
              advancesTo="3rd place"
              loserNote="Loser → 4th place"
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Stage card (used for Q1, Elim, Q2, Semi Final, 3rd Place)
// ─────────────────────────────────────────────────────────────────────────────

function StageCard({
  stage,
  subtitle,
  match,
  allMatches,
  advancesTo,
  loserNote,
  loserEliminated = false,
}: {
  stage: string
  subtitle: string
  match?: Match
  allMatches: Match[]
  advancesTo: string
  loserNote: string
  loserEliminated?: boolean
}) {
  if (!match) {
    return (
      <div className="bg-[#131320] border border-dashed border-[#1e1e3a] rounded-2xl p-5 text-center">
        <span className="text-[10px] font-bold text-amber-400/60 uppercase tracking-wider">
          {stage}
        </span>
        <p className="text-xs text-gray-600 mt-2">Not yet played</p>
      </div>
    )
  }

  const winner = match.winner
  const teams = match.teams || []
  // A row is a "placeholder" (no real teams yet) when both teams are TBD.
  // For these we still want to render the stage layout + progression flow,
  // but with a generic "Winner →" label instead of naming a team.
  const isPlaceholder = teams.every((t) => t === TBD)

  return (
    <div className="relative bg-[#131320] border border-[#1e1e3a] rounded-2xl overflow-hidden">
      {/* Subtle accent stripe down the left */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400/40 to-transparent" />

      <div className="p-4 sm:p-5">
        {/* Stage header */}
        <div className="mb-3">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {stage}
          </h3>
          <p className="text-[10px] text-gray-500 mt-0.5">{subtitle}</p>
        </div>

        {/* Match meta — date, time, venue, city */}
        {!isPlaceholder && (
          <MatchMeta match={match} allMatches={allMatches} />
        )}

        {/* Two teams */}
        <div className="space-y-1.5">
          {teams.map((team, idx) => {
            const isWinner = winner === team
            const inn = match.innings?.find((i) => i.team === team)
            return (
              <TeamRow
                key={`${team}-${idx}`}
                team={team}
                season={match.season}
                isWinner={isWinner}
                hasResult={!!winner}
                isAbandoned={!!match.abandoned}
                runs={inn?.runs}
                wickets={inn?.wickets}
                overs={inn?.overs}
              />
            )
          })}
        </div>

        {/* Progression banner — works for both completed matches and TBD
            placeholders. For placeholders we show "Winner →" without
            naming a team (since none has been determined yet). */}
        {(winner || isPlaceholder) && (
          <div className="mt-3 pt-3 border-t border-[#1e1e3a]/60 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold">
              <span
                className="inline-block w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: winner
                    ? TEAM_COLORS[winner]?.primary || '#4ade80'
                    : '#475569',
                }}
              />
              {winner ? (
                <span
                  style={{ color: TEAM_COLORS[winner]?.primary || '#4ade80' }}
                >
                  {TEAM_SHORT[winner] || winner}
                </span>
              ) : (
                <span className="text-gray-500 italic">Winner</span>
              )}
              <ArrowRight size={12} className="text-gray-500" />
              <span className="text-amber-400">{advancesTo}</span>
            </div>
            <span className="text-[10px] text-gray-600 flex items-center gap-1">
              {loserEliminated && <X size={10} className="text-red-500/60" />}
              {loserNote}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Final card with champion treatment
// ─────────────────────────────────────────────────────────────────────────────

function FinalCard({
  match,
  allMatches,
  season,
}: {
  match?: Match
  allMatches: Match[]
  season: string
}) {
  if (!match) {
    return (
      <div className="relative bg-gradient-to-br from-amber-500/[0.08] to-transparent border-2 border-dashed border-amber-500/30 rounded-2xl p-6 text-center">
        <Trophy className="w-10 h-10 text-amber-400/40 mx-auto mb-3" />
        <h3 className="text-base font-bold text-amber-400/60 uppercase tracking-wider">
          Final
        </h3>
        <p className="text-xs text-gray-600 mt-2">Not yet played</p>
      </div>
    )
  }

  const champion = match.winner
  const champColor = champion ? TEAM_COLORS[champion]?.primary : '#facc15'
  const isPlaceholder = (match.teams || []).every((t) => t === TBD)

  return (
    <div
      className="relative rounded-2xl overflow-hidden border-2"
      style={{
        background: `linear-gradient(135deg, ${champColor}18 0%, transparent 60%), linear-gradient(180deg, rgba(251,191,36,0.10) 0%, transparent 100%)`,
        borderColor: champion ? `${champColor}50` : 'rgba(251,191,36,0.4)',
        boxShadow: champion ? `0 0 40px ${champColor}25` : '0 0 30px rgba(251,191,36,0.12)',
      }}
    >
      <div className="p-5 sm:p-6">
        {/* Trophy header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: champion ? `${champColor}25` : 'rgba(251,191,36,0.15)',
              border: `1.5px solid ${champion ? champColor + '60' : 'rgba(251,191,36,0.4)'}`,
            }}
          >
            <Trophy
              className="w-5 h-5"
              style={{ color: champion ? champColor : '#facc15' }}
            />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-amber-400 uppercase tracking-wider">
              The Final
            </h3>
            <p className="text-[10px] text-gray-500 mt-0.5">The title decider</p>
          </div>
        </div>

        {/* Match meta — date, time, venue, city */}
        {!isPlaceholder && (
          <MatchMeta match={match} allMatches={allMatches} />
        )}

        {/* Two teams */}
        <div className="space-y-1.5">
          {match.teams.map((team) => {
            const isWinner = champion === team
            const inn = match.innings?.find((i) => i.team === team)
            return (
              <TeamRow
                key={team}
                team={team}
                season={match.season}
                isWinner={isWinner}
                hasResult={!!champion}
                isAbandoned={!!match.abandoned}
                runs={inn?.runs}
                wickets={inn?.wickets}
                overs={inn?.overs}
                large
              />
            )
          })}
        </div>

        {/* Champion banner */}
        {champion && (
          <div
            className="mt-5 pt-4 border-t flex items-center justify-center gap-3"
            style={{ borderColor: `${champColor}30` }}
          >
            <Trophy
              className="w-5 h-5"
              style={{ color: champColor }}
            />
            <div className="text-center">
              <div
                className="text-base font-extrabold tracking-tight"
                style={{ color: champColor }}
              >
                {champion}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-amber-400/80 font-bold mt-0.5">
                IPL {season} Champions
              </div>
            </div>
            <Trophy
              className="w-5 h-5"
              style={{ color: champColor }}
            />
          </div>
        )}

        {/* Placeholder banner for in-progress seasons */}
        {!champion && isPlaceholder && (
          <div className="mt-5 pt-4 border-t border-amber-400/20 flex items-center justify-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400/60" />
            <span className="text-[11px] uppercase tracking-widest text-amber-400/70 font-bold italic">
              Champion to be crowned
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Team row used inside both StageCard and FinalCard
// ─────────────────────────────────────────────────────────────────────────────

function TeamRow({
  team,
  season,
  isWinner,
  hasResult,
  isAbandoned,
  runs,
  wickets,
  overs,
  large = false,
}: {
  team: string
  season?: string
  isWinner: boolean
  hasResult: boolean
  isAbandoned: boolean
  runs?: number
  wickets?: number
  overs?: number
  large?: boolean
}) {
  // Special-case the TBD placeholder used by in-progress seasons.
  const isTbd = team === TBD
  const color = isTbd ? '#475569' : TEAM_COLORS[team]?.primary || '#6366f1'
  const short = isTbd ? 'TBD' : TEAM_SHORT[team] || team.slice(0, 3).toUpperCase()
  const dimmed = hasResult && !isWinner && !isAbandoned

  const badgeSize = large ? 36 : 28
  const nameInner = (
    <>
      {isTbd ? (
        <div
          className={`rounded-lg flex items-center justify-center font-extrabold shrink-0 ${
            large ? 'w-9 h-9 text-[11px]' : 'w-7 h-7 text-[9px]'
          }`}
          style={{
            backgroundColor: `${color}12`,
            border: `2px dashed ${color}50`,
            color: `${color}80`,
          }}
        >
          {short}
        </div>
      ) : (
        <TeamBadge team={team} size={badgeSize} season={season} />
      )}
      {isTbd ? (
        <span
          className={`text-sm font-semibold italic text-gray-500 truncate ${large ? 'text-base' : ''}`}
        >
          To be determined
        </span>
      ) : (
        <Link
          to={`/teams/${team.replace(/\s+/g, '-').toLowerCase()}`}
          onClick={(e) => e.stopPropagation()}
          className={`text-sm font-semibold truncate hover:text-accent transition-colors ${
            dimmed ? 'text-gray-500' : 'text-white'
          } ${large ? 'text-base' : ''}`}
        >
          {team}
        </Link>
      )}
    </>
  )

  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
        isWinner ? 'bg-white/[0.04]' : 'bg-transparent'
      } ${isTbd ? 'opacity-80' : ''}`}
      style={
        isWinner
          ? { boxShadow: `inset 3px 0 0 ${color}` }
          : undefined
      }
    >
      {nameInner}
      {runs != null && wickets != null && (
        <span
          className={`ml-auto font-mono tabular-nums whitespace-nowrap ${
            dimmed ? 'text-gray-600' : 'text-white'
          } ${large ? 'text-sm font-bold' : 'text-xs'}`}
        >
          {runs}/{wickets}
          {overs != null && (
            <span className="text-[10px] text-gray-500 ml-1">({overs})</span>
          )}
        </span>
      )}
    </div>
  )
}
