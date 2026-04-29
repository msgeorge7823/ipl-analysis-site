// Coach profile page (/coaches/:id).
// Bio, tenure timeline (per-team / per-season W/L records), trophies, and
// (when applicable) a link back to the coach's own playing career.
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import Breadcrumb from '@/components/ui/Breadcrumb'
import { useCoaches, useCoachPhotos } from '@/hooks/useData'
import { TEAM_COLORS } from '@/lib/constants'
import type { CoachRoleType } from '@/types/coach'
import Avatar from '@/components/ui/Avatar'

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
  'strength-conditioning': 'Strength & Conditioning Coach',
  'physio': 'Physio',
  'trainer': 'Trainer',
  'analyst': 'Analyst',
  'team-manager': 'Team Manager',
}

function formatDob(dob?: string) {
  if (!dob) return null
  const d = new Date(dob)
  if (isNaN(d.getTime())) return dob
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

function computeAge(dob?: string): number | null {
  if (!dob) return null
  const birth = new Date(dob)
  if (isNaN(birth.getTime())) return null
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export default function CoachDetail() {
  const { id } = useParams<{ id: string }>()
  const { data: coaches, isLoading } = useCoaches()
  const { data: coachPhotos } = useCoachPhotos()

  const coach = useMemo(() => coaches?.find((c: any) => c.id === id), [coaches, id])

  if (isLoading) {
    return <div className="max-w-[1440px] mx-auto px-4 py-16 text-center text-textSecondary">Loading...</div>
  }

  if (!coach) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-16 text-center">
        <p className="text-textSecondary mb-4">Coach not found.</p>
        <Link to="/coaches" className="text-accent hover:underline">&larr; Back to coaches</Link>
      </div>
    )
  }

  const age = computeAge(coach.dob)
  const mostRecent = coach.tenures[coach.tenures.length - 1]
  const themeColor = (mostRecent && TEAM_COLORS[mostRecent.team]?.primary) || '#6366f1'

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <Breadcrumb items={[{ label: 'Coaches', path: '/coaches' }, { label: coach.name }]} />

      {!coach.verified && (
        <div className="mb-6 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01M10.29 3.86l-8.18 14.14A2 2 0 003.83 21h16.34a2 2 0 001.72-3l-8.18-14.14a2 2 0 00-3.42 0z"/></svg>
          <div>
            <div className="font-semibold text-amber-300">Unverified entry</div>
            <div className="text-sm text-amber-300/80">This profile is pending your cross-check against the sources listed below.</div>
          </div>
        </div>
      )}

      {/* Header card */}
      <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          <Avatar
            id={coach.id}
            name={coach.name}
            kind="coach"
            sizePx={88}
            color={themeColor}
            initialsFontSizePx={36}
            className="sm:!w-[112px] sm:!h-[112px]"
            photo={coachPhotos?.[coach.id]}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold">{coach.name}</h1>
            {coach.fullName && coach.fullName !== coach.name && (
              <p className="text-textSecondary text-sm mt-0.5">{coach.fullName}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/15 text-indigo-400">
                {coach.nationality}
              </span>
              {coach.dob && (
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-500/15 text-zinc-400">
                  {formatDob(coach.dob)}{age !== null ? ` · ${age} yrs` : ''}
                </span>
              )}
              {coach.specialty?.map((s: string) => (
                <span key={s} className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/15 text-emerald-400 capitalize">
                  {s}
                </span>
              ))}
            </div>
            {coach.bio && <p className="text-sm text-textSecondary mt-4 leading-relaxed">{coach.bio}</p>}
            {coach.playingCareerPlayerId && (
              <Link
                to={`/players/${coach.playingCareerPlayerId}`}
                className="inline-flex items-center gap-1.5 mt-4 text-sm text-accent hover:underline font-medium"
              >
                View playing career &rarr;
              </Link>
            )}
            {coach.playingCareerSummary && !coach.playingCareerPlayerId && (
              <p className="text-xs text-textSecondary mt-3 italic">{coach.playingCareerSummary}</p>
            )}
          </div>
        </div>
      </div>

      {/* Career totals — top-line */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        {[
          { label: 'Titles', value: coach.careerTotals.titles },
          { label: 'Finals', value: coach.careerTotals.finalsReached },
          { label: 'Playoffs', value: coach.careerTotals.playoffAppearances },
          { label: 'Seasons', value: coach.careerTotals.seasonsCoached },
          { label: 'Franchises', value: coach.careerTotals.franchisesCoached },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="text-xl md:text-2xl font-bold gradient-text">{s.value}</div>
            <div className="text-[10px] md:text-xs text-textSecondary uppercase tracking-wider mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* League vs Playoff split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-xs uppercase tracking-wider text-textSecondary font-semibold mb-3">League Stage</div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div><div className="text-xl font-bold">{coach.careerTotals.league.matches}</div><div className="text-[10px] text-textSecondary uppercase">Mat</div></div>
            <div><div className="text-xl font-bold text-emerald-400">{coach.careerTotals.league.wins}</div><div className="text-[10px] text-textSecondary uppercase">Won</div></div>
            <div><div className="text-xl font-bold text-red-400">{coach.careerTotals.league.losses}</div><div className="text-[10px] text-textSecondary uppercase">Lost</div></div>
            <div><div className="text-xl font-bold gradient-text">{coach.careerTotals.league.winPct.toFixed(1)}%</div><div className="text-[10px] text-textSecondary uppercase">Win %</div></div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5">
          <div className="text-xs uppercase tracking-wider text-textSecondary font-semibold mb-3">Playoffs</div>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div><div className="text-xl font-bold">{coach.careerTotals.playoffs.matches}</div><div className="text-[10px] text-textSecondary uppercase">Mat</div></div>
            <div><div className="text-xl font-bold text-emerald-400">{coach.careerTotals.playoffs.wins}</div><div className="text-[10px] text-textSecondary uppercase">Won</div></div>
            <div><div className="text-xl font-bold text-red-400">{coach.careerTotals.playoffs.losses}</div><div className="text-[10px] text-textSecondary uppercase">Lost</div></div>
            <div><div className="text-xl font-bold gradient-text">{coach.careerTotals.playoffs.matches > 0 ? coach.careerTotals.playoffs.winPct.toFixed(1) + '%' : '—'}</div><div className="text-[10px] text-textSecondary uppercase">Win %</div></div>
          </div>
        </div>
      </div>

      {/* Tenures */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">IPL Tenures</h2>
        <div className="space-y-4">
          {coach.tenures.map((t: any, i: number) => {
            const color = TEAM_COLORS[t.team]?.primary || '#6366f1'
            return (
              <div key={i} className="border border-border rounded-xl p-4" style={{ borderLeftColor: color, borderLeftWidth: 4 }}>
                <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                  <div>
                    <Link to={`/teams/${t.team.toLowerCase().replace(/\s+/g, '-')}`} className="font-semibold hover:text-accent">
                      {t.team}
                    </Link>
                    <span className="ml-2 text-xs text-textSecondary">
                      {t.fromSeason}{t.toSeason !== t.fromSeason ? `–${t.toSeason}` : ''} · {ROLE_LABEL[t.role as CoachRoleType] || t.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!t.verified && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase">
                        Unverified
                      </span>
                    )}
                    {t.aggregate.titles > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-yellow-500/15 text-yellow-400 text-xs font-bold">
                        🏆 {t.aggregate.titles} Title{t.aggregate.titles > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div className="bg-bg/40 rounded-lg p-3">
                    <div className="text-[10px] uppercase tracking-wider text-textSecondary mb-2">League</div>
                    <div className="grid grid-cols-4 gap-1 text-center">
                      <div><div className="text-sm font-bold">{t.aggregate.league.matches}</div><div className="text-[9px] text-textSecondary">M</div></div>
                      <div><div className="text-sm font-bold text-emerald-400">{t.aggregate.league.wins}</div><div className="text-[9px] text-textSecondary">W</div></div>
                      <div><div className="text-sm font-bold text-red-400">{t.aggregate.league.losses}</div><div className="text-[9px] text-textSecondary">L</div></div>
                      <div><div className="text-sm font-bold">{t.aggregate.league.winPct.toFixed(0)}%</div><div className="text-[9px] text-textSecondary">W%</div></div>
                    </div>
                  </div>
                  <div className="bg-bg/40 rounded-lg p-3">
                    <div className="text-[10px] uppercase tracking-wider text-textSecondary mb-2">Playoffs</div>
                    <div className="grid grid-cols-4 gap-1 text-center">
                      <div><div className="text-sm font-bold">{t.aggregate.playoffs.matches}</div><div className="text-[9px] text-textSecondary">M</div></div>
                      <div><div className="text-sm font-bold text-emerald-400">{t.aggregate.playoffs.wins}</div><div className="text-[9px] text-textSecondary">W</div></div>
                      <div><div className="text-sm font-bold text-red-400">{t.aggregate.playoffs.losses}</div><div className="text-[9px] text-textSecondary">L</div></div>
                      <div><div className="text-sm font-bold">{t.aggregate.playoffs.matches > 0 ? t.aggregate.playoffs.winPct.toFixed(0) + '%' : '—'}</div><div className="text-[9px] text-textSecondary">W%</div></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-textSecondary mb-3">
                  <span>Finals reached: <span className="font-bold text-textPrimary">{t.aggregate.finalsReached}</span></span>
                  <span>·</span>
                  <span>Playoff appearances: <span className="font-bold text-textPrimary">{t.aggregate.playoffAppearances}</span></span>
                </div>

                {t.perSeason?.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-textSecondary border-b border-border">
                          <th rowSpan={2} className="text-left py-1.5 pr-3 align-bottom">Season</th>
                          <th colSpan={4} className="text-center py-1 border-l border-border/50">League</th>
                          <th colSpan={4} className="text-center py-1 border-l border-border/50">Playoffs</th>
                          <th rowSpan={2} className="text-left py-1.5 pl-3 align-bottom border-l border-border/50">Finish</th>
                        </tr>
                        <tr className="text-textSecondary border-b border-border">
                          <th className="text-right py-1 px-2 border-l border-border/50">M</th>
                          <th className="text-right py-1 px-2">W</th>
                          <th className="text-right py-1 px-2">L</th>
                          <th className="text-right py-1 px-2">W%</th>
                          <th className="text-right py-1 px-2 border-l border-border/50">M</th>
                          <th className="text-right py-1 px-2">W</th>
                          <th className="text-right py-1 px-2">L</th>
                          <th className="text-right py-1 px-2">W%</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {t.perSeason.map((ps: any) => (
                          <tr key={ps.season}>
                            <td className="py-1.5 pr-3 font-medium">
                              <Link to={`/seasons/${ps.season}`} className="hover:text-accent">{ps.season}</Link>
                            </td>
                            <td className="text-right py-1.5 px-2 border-l border-border/50">{ps.league.matches}</td>
                            <td className="text-right py-1.5 px-2 text-emerald-400">{ps.league.wins}</td>
                            <td className="text-right py-1.5 px-2 text-red-400">{ps.league.losses}</td>
                            <td className="text-right py-1.5 px-2">{ps.league.winPct.toFixed(0)}%</td>
                            <td className="text-right py-1.5 px-2 border-l border-border/50">{ps.playoffs.matches || '—'}</td>
                            <td className="text-right py-1.5 px-2 text-emerald-400">{ps.playoffs.matches > 0 ? ps.playoffs.wins : '—'}</td>
                            <td className="text-right py-1.5 px-2 text-red-400">{ps.playoffs.matches > 0 ? ps.playoffs.losses : '—'}</td>
                            <td className="text-right py-1.5 px-2">{ps.playoffs.matches > 0 ? ps.playoffs.winPct.toFixed(0) + '%' : '—'}</td>
                            <td className="py-1.5 pl-3 border-l border-border/50">
                              <span className={`${ps.finish === 'Champion' ? 'text-yellow-400' : ps.finish === 'Runner-up' ? 'text-orange-400' : 'text-textSecondary'}`}>
                                {ps.finish}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {t.notes && <p className="text-xs text-textSecondary mt-3 italic">{t.notes}</p>}
              </div>
            )
          })}
        </div>
      </div>

      {coach.otherCoachingRoles?.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Other Coaching Roles</h2>
          <div className="space-y-2">
            {coach.otherCoachingRoles.map((r: any, i: number) => (
              <div key={i} className="flex items-start justify-between gap-3 py-2 border-b border-border/50 last:border-0">
                <div>
                  <span className="font-medium">{r.team}</span>
                  <span className="text-textSecondary text-sm ml-2">· {r.role}</span>
                  {r.notes && <div className="text-xs text-textSecondary mt-0.5">{r.notes}</div>}
                </div>
                <span className="text-xs text-textSecondary shrink-0">{r.period}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sources */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-3">Sources</h2>
        {coach.sources?.length > 0 ? (
          <ul className="space-y-1 text-sm">
            {coach.sources.map((s: string, i: number) => (
              <li key={i}>
                <a href={s} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline break-all">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-textSecondary">No sources recorded yet.</p>
        )}
      </div>

      <div className="mt-6 text-sm">
        <Link to="/coaches" className="text-accent hover:underline">&larr; Back to all coaches</Link>
      </div>
    </div>
  )
}
