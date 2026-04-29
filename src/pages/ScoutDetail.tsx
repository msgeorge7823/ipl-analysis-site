// Scout detail page (/scout/:id).
// Per-prospect scouting sheet from the cross-league dataset: leagues
// played, recent form, role profile, and any IPL crossover history.
import { useParams, Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useScoutAll } from '@/hooks/useData'
import Breadcrumb from '@/components/ui/Breadcrumb'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

type LeagueBag = {
  matches: number; innings: number
  runs: number; ballsFaced: number; fours: number; sixes: number
  notOuts: number; highScore: number; fifties: number; hundreds: number
  battingAvg: number; strikeRate: number
  bowlInnings: number; wickets: number
  runsConceded: number; ballsBowled: number
  bowlEcon: number; bowlAvg: number; bowlSR: number
  bestBowling: string; maidens: number; bowlDots: number
  catches: number; stumpings: number; runOuts: number
}

type ScoutPlayer = {
  id: string; name: string; leagues: string[]; teams: string[]
  country?: string
  matches: number; inIPL: boolean; archetype: string; positionLabel: string
  innings: number; runs: number; ballsFaced: number
  battingAvg: number; strikeRate: number; highScore: number
  fours: number; sixes: number; fifties: number; hundreds: number
  boundaryPct: number; dotBallPct: number; ballsPerBoundary: number
  ppSR: number; ppRuns: number; midSR: number; midRuns: number; deathSR: number; deathRuns: number
  bowlInnings: number; wickets: number; bowlEcon: number; bowlAvg: number; bowlSR: number
  bestBowling: string; bowlDotPct: number
  ppBowlEcon: number; ppBowlWickets: number; midBowlEcon: number; midBowlWickets: number
  deathBowlEcon: number; deathBowlWickets: number
  catches: number; stumpings: number; runOuts: number
  batImpact: number; bowlImpact: number; fieldingValue: number; allRounderIndex: number
  dismissals: Record<string, number>; recentSeasons: string[]
  perLeague?: Record<string, LeagueBag>
}

const LEAGUE_LABEL: Record<string, string> = {
  BBL: 'Big Bash League', PSL: 'Pakistan Super League', CPL: 'Caribbean Premier League',
  SA20: 'SA20', HND: 'The Hundred', BPL: 'Bangladesh Premier League',
  LPL: 'Lanka Premier League', ILT20: 'International League T20',
  MLC: 'Major League Cricket', NTB: 'T20 Blast', SMAT: 'Syed Mushtaq Ali Trophy',
}

const COUNTRY_FLAG: Record<string, string> = {
  India: '🇮🇳', Australia: '🇦🇺', England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'South Africa': '🇿🇦',
  'New Zealand': '🇳🇿', 'West Indies': '🌴', 'Sri Lanka': '🇱🇰',
  Afghanistan: '🇦🇫', USA: '🇺🇸', Other: '🌐', Pakistan: '🇵🇰', Bangladesh: '🇧🇩',
}

function getInitials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function StatTile({ label, value, accent }: { label: string; value: string | number; accent?: string }) {
  return (
    <div className="bg-[#0a0a0f] border border-[#1e1e3a] rounded-xl p-3 text-center">
      <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">{label}</p>
      <p className={`text-lg font-black mt-0.5 ${accent ?? 'text-white'}`}>{value}</p>
    </div>
  )
}

type Mode = 'Overview' | 'Per-League' | 'Phase Split' | 'Dismissals'
const MODES: Mode[] = ['Overview', 'Per-League', 'Phase Split', 'Dismissals']

export default function ScoutDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: all, isLoading } = useScoutAll()
  const [mode, setMode] = useState<Mode>('Overview')

  const p = useMemo(() => (all as ScoutPlayer[] | undefined)?.find(x => x.id === id), [all, id])

  if (isLoading) return <div className="max-w-7xl mx-auto px-4 py-10"><LoadingSpinner /></div>
  if (!p) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-400">
        <p>Player not found in scouting data.</p>
        <Link to="/auctions" className="text-[#6366f1] hover:underline mt-4 inline-block">← Back to Auction War Room</Link>
      </div>
    )
  }

  const perLeague = p.perLeague || {}
  const perLeagueEntries = Object.entries(perLeague).sort((a, b) => b[1].matches - a[1].matches)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Breadcrumb items={[
        { label: 'Auction War Room', path: '/auctions' },
        { label: 'Scouting Hub', path: '/auctions' },
        { label: p.name },
      ]} />

      {/* ── Header ── */}
      <div className="bg-gradient-to-br from-[#131320] to-[#0a0a0f] border border-[#1e1e3a] rounded-3xl p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6366f1]/20 to-[#6366f1]/5 border border-[#6366f1]/20 flex items-center justify-center text-2xl font-black text-[#6366f1]">
            {getInitials(p.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl md:text-3xl font-black text-white">{p.name}</h1>
              {p.country && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#6366f1]/10 text-[#6366f1] border border-[#6366f1]/20">
                  {COUNTRY_FLAG[p.country] || ''} {p.country}
                </span>
              )}
              {p.inIPL && (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">IN IPL</span>
              )}
            </div>
            <p className="text-sm text-gray-400">
              <span className="font-semibold text-gray-300">{p.archetype}</span>
              <span className="text-gray-600"> &middot; </span>
              <span>{p.positionLabel}</span>
              <span className="text-gray-600"> &middot; </span>
              <span>{p.matches} matches</span>
              <span className="text-gray-600"> &middot; </span>
              <span>{p.leagues.length} leagues</span>
            </p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {p.leagues.map(l => (
                <span key={l} className="text-[11px] px-2 py-0.5 rounded bg-[#1e1e3a] text-gray-400 font-medium">
                  {l}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {p.teams.slice(0, 6).map(t => (
                <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-[#0a0a0f] text-gray-500 border border-[#1e1e3a]">
                  {t}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-3 md:gap-4">
            <div className="text-center px-4">
              <p className="text-[10px] text-gray-500 uppercase">Bat Impact</p>
              <p className="text-2xl font-black text-orange-400">{p.batImpact.toLocaleString()}</p>
            </div>
            <div className="text-center px-4 border-l border-[#1e1e3a]">
              <p className="text-[10px] text-gray-500 uppercase">Bowl Impact</p>
              <p className="text-2xl font-black text-purple-400">{p.bowlImpact.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mode Tabs ── */}
      <div className="flex gap-1 border-b border-[#1e1e3a] mb-6 overflow-x-auto">
        {MODES.map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 text-sm font-semibold whitespace-nowrap transition ${
              mode === m ? 'text-[#6366f1] border-b-2 border-[#6366f1]' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* ── Overview ── */}
      {mode === 'Overview' && (
        <div className="space-y-6">
          {/* Batting */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Batting — All Leagues Combined</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              <StatTile label="Innings" value={p.innings} />
              <StatTile label="Runs" value={p.runs.toLocaleString()} accent="text-orange-400" />
              <StatTile label="Avg" value={p.battingAvg || '-'} />
              <StatTile label="SR" value={p.strikeRate || '-'} />
              <StatTile label="HS" value={p.highScore} />
              <StatTile label="50 / 100" value={`${p.fifties} / ${p.hundreds}`} />
              <StatTile label="4s" value={p.fours} />
              <StatTile label="6s" value={p.sixes} />
              <StatTile label="Boundary %" value={`${p.boundaryPct || 0}%`} />
              <StatTile label="Dot %" value={`${p.dotBallPct || 0}%`} />
              <StatTile label="Balls / Bdy" value={p.ballsPerBoundary || '-'} />
            </div>
          </div>

          {/* Bowling */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Bowling — All Leagues Combined</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              <StatTile label="Innings" value={p.bowlInnings} />
              <StatTile label="Wickets" value={p.wickets} accent="text-purple-400" />
              <StatTile label="Avg" value={p.bowlAvg || '-'} />
              <StatTile label="Econ" value={p.bowlEcon || '-'} />
              <StatTile label="SR" value={p.bowlSR || '-'} />
              <StatTile label="Best" value={p.bestBowling} />
              <StatTile label="Dot %" value={`${p.bowlDotPct || 0}%`} />
            </div>
          </div>

          {/* Fielding */}
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Fielding — All Leagues Combined</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              <StatTile label="Catches" value={p.catches} />
              <StatTile label="Stumpings" value={p.stumpings} />
              <StatTile label="Run-outs" value={p.runOuts} />
              <StatTile label="Fielding Value" value={p.fieldingValue} />
            </div>
          </div>

          {p.recentSeasons.length > 0 && (
            <div className="text-xs text-gray-500">
              Recent seasons: {p.recentSeasons.join(', ')}
            </div>
          )}
        </div>
      )}

      {/* ── Per-League ── */}
      {mode === 'Per-League' && (
        <div>
          {perLeagueEntries.length === 0 ? (
            <p className="text-sm text-gray-500">No per-league breakdown available.</p>
          ) : (
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-xs text-gray-500 uppercase">
                  <tr className="border-b border-[#1e1e3a]">
                    <th className="text-left px-4 py-3 font-semibold">League</th>
                    <th className="text-right px-2 py-3 font-semibold">Mat</th>
                    <th className="text-right px-2 py-3 font-semibold">Inn</th>
                    <th className="text-right px-2 py-3 font-semibold">Runs</th>
                    <th className="text-right px-2 py-3 font-semibold">Avg</th>
                    <th className="text-right px-2 py-3 font-semibold">SR</th>
                    <th className="text-right px-2 py-3 font-semibold">HS</th>
                    <th className="text-right px-2 py-3 font-semibold">50/100</th>
                    <th className="text-right px-2 py-3 font-semibold">Wkts</th>
                    <th className="text-right px-2 py-3 font-semibold">Econ</th>
                    <th className="text-right px-2 py-3 font-semibold">Bowl Avg</th>
                    <th className="text-right px-4 py-3 font-semibold">Best</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e1e3a]">
                  {perLeagueEntries.map(([code, b]) => (
                    <tr key={code} className="hover:bg-white/[0.02]">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-white">{code}</div>
                        <div className="text-[10px] text-gray-500">{LEAGUE_LABEL[code] || code}</div>
                      </td>
                      <td className="text-right px-2 py-3 text-gray-300">{b.matches}</td>
                      <td className="text-right px-2 py-3 text-gray-400">{b.innings}</td>
                      <td className="text-right px-2 py-3 font-bold text-orange-400">{b.runs}</td>
                      <td className="text-right px-2 py-3 text-gray-300">{b.battingAvg || '-'}</td>
                      <td className="text-right px-2 py-3 text-gray-300">{b.strikeRate || '-'}</td>
                      <td className="text-right px-2 py-3 text-gray-400">{b.highScore}</td>
                      <td className="text-right px-2 py-3 text-gray-400">{b.fifties}/{b.hundreds}</td>
                      <td className="text-right px-2 py-3 font-bold text-purple-400">{b.wickets}</td>
                      <td className="text-right px-2 py-3 text-gray-300">{b.bowlEcon || '-'}</td>
                      <td className="text-right px-2 py-3 text-gray-300">{b.bowlAvg || '-'}</td>
                      <td className="text-right px-4 py-3 text-gray-400">{b.bestBowling}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Phase Split ── */}
      {mode === 'Phase Split' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Batting by Phase</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-4">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Powerplay (1–6)</p>
                <p className="text-2xl font-black text-white mt-1">{p.ppRuns} <span className="text-sm text-gray-500">runs</span></p>
                <p className="text-sm text-orange-400 mt-1">SR {p.ppSR || '-'}</p>
              </div>
              <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-4">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Middle (7–16)</p>
                <p className="text-2xl font-black text-white mt-1">{p.midRuns} <span className="text-sm text-gray-500">runs</span></p>
                <p className="text-sm text-orange-400 mt-1">SR {p.midSR || '-'}</p>
              </div>
              <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-4">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Death (17–20)</p>
                <p className="text-2xl font-black text-white mt-1">{p.deathRuns} <span className="text-sm text-gray-500">runs</span></p>
                <p className="text-sm text-orange-400 mt-1">SR {p.deathSR || '-'}</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Bowling by Phase</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-4">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Powerplay (1–6)</p>
                <p className="text-2xl font-black text-white mt-1">{p.ppBowlWickets} <span className="text-sm text-gray-500">wkts</span></p>
                <p className="text-sm text-purple-400 mt-1">Econ {p.ppBowlEcon || '-'}</p>
              </div>
              <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-4">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Middle (7–16)</p>
                <p className="text-2xl font-black text-white mt-1">{p.midBowlWickets} <span className="text-sm text-gray-500">wkts</span></p>
                <p className="text-sm text-purple-400 mt-1">Econ {p.midBowlEcon || '-'}</p>
              </div>
              <div className="bg-[#131320] border border-[#1e1e3a] rounded-xl p-4">
                <p className="text-[10px] text-gray-500 uppercase font-semibold">Death (17–20)</p>
                <p className="text-2xl font-black text-white mt-1">{p.deathBowlWickets} <span className="text-sm text-gray-500">wkts</span></p>
                <p className="text-sm text-purple-400 mt-1">Econ {p.deathBowlEcon || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Dismissals ── */}
      {mode === 'Dismissals' && (
        <div>
          {Object.keys(p.dismissals || {}).length === 0 ? (
            <p className="text-sm text-gray-500">No dismissal data.</p>
          ) : (
            <div className="bg-[#131320] border border-[#1e1e3a] rounded-2xl p-6">
              <ul className="space-y-2">
                {Object.entries(p.dismissals).sort((a, b) => b[1] - a[1]).map(([kind, n]) => {
                  const total = Object.values(p.dismissals).reduce((s, v) => s + v, 0)
                  const pct = total > 0 ? (n / total) * 100 : 0
                  return (
                    <li key={kind} className="flex items-center gap-3">
                      <span className="w-32 text-sm text-gray-400 capitalize">{kind}</span>
                      <div className="flex-1 h-2 bg-[#0a0a0f] rounded-full overflow-hidden">
                        <div className="h-full bg-[#6366f1]/60" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-16 text-right text-sm font-semibold text-white">{n}</span>
                      <span className="w-14 text-right text-xs text-gray-500">{pct.toFixed(1)}%</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
