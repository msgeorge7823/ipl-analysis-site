// Sponsors page (/sponsors).
// History of IPL title sponsors and tournament partners by year, with
// brand color treatment per era.
import { useState, useEffect } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'

// Color map for title sponsors
const sponsorColorMap: Record<string, { gradient: string; bg: string; border: string; text: string; ring: string }> = {
  DLF: { gradient: 'from-blue-600 to-blue-700', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', ring: 'ring-blue-500/30' },
  Pepsi: { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', ring: 'ring-blue-500/30' },
  Vivo: { gradient: 'from-red-500 to-red-600', bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', ring: 'ring-red-500/30' },
  Dream11: { gradient: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', text: 'text-indigo-400', ring: 'ring-indigo-500/30' },
  Tata: { gradient: 'from-indigo-600 to-violet-600', bg: 'bg-indigo-600/10', border: 'border-indigo-600/20', text: 'text-indigo-400', ring: 'ring-indigo-500/30' },
}

function getSponsorColors(name: string) {
  return sponsorColorMap[name] ?? { gradient: 'from-gray-500 to-gray-600', bg: 'bg-gray-500/10', border: 'border-gray-500/20', text: 'text-gray-400', ring: 'ring-gray-500/30' }
}

const didYouKnowFacts = [
  {
    icon: '\uD83D\uDCB0',
    title: 'IPL Brand Value',
    fact: 'The IPL brand was valued at approximately $16.4 billion (2025), making it one of the most valuable sports leagues globally.',
  },
  {
    icon: '\uD83D\uDCFA',
    title: 'Record-Breaking Viewership',
    fact: 'IPL 2024 garnered over 620 million viewers on digital platforms alone, with JioCinema streaming matches for free to Indian audiences.',
  },
  {
    icon: '\uD83C\uDFA5',
    title: 'Media Rights Deal',
    fact: 'The 2023\u20132027 media rights were sold for \u20B948,390 crore (~$6.2 billion), with digital rights surpassing TV rights for the first time.',
  },
  {
    icon: '\uD83C\uDFDF\uFE0F',
    title: 'Franchise Valuations',
    fact: 'Mumbai Indians and Chennai Super Kings each have franchise valuations exceeding $1.3 billion, with all 10 teams valued above $700 million.',
  },
  {
    icon: '\uD83C\uDF0D',
    title: 'Global Reach',
    fact: 'IPL matches are broadcast in over 120 countries, making it the most-watched cricket league and one of the most-watched sports leagues worldwide.',
  },
  {
    icon: '\uD83C\uDFAC',
    title: 'Ad Revenue',
    fact: 'A single 10-second ad slot during an IPL match costs between \u20B915\u201320 lakh, with the final commanding premium rates of \u20B925+ lakh.',
  },
]

export default function Sponsors() {
  const [sponsorData, setSponsorData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/_backup/ipl-sponsors.json')
      .then(res => res.json())
      .then(data => {
        setSponsorData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!sponsorData) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-12 sm:py-20 text-center">
        <p className="text-gray-400">Failed to load sponsor data.</p>
      </div>
    )
  }

  const titleSponsors: any[] = sponsorData.titleSponsors ?? []
  const seasonSummary: Record<string, any> = sponsorData.seasonWiseSponsorSummary ?? {}
  const partners2026 = sponsorData.officialPartners?.['2026']
  const broadcastHistory: any[] = sponsorData.broadcastHistory ?? []
  const mediaRights = sponsorData.mediaRightsDeal?.['2023-2027']
  const seasonYears = Object.keys(seasonSummary).sort()

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-emerald-900/5" />
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-8">
          <Breadcrumb items={[{ label: 'Sponsors' }]} />
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2 sm:mb-3">IPL Sponsors & Partnerships</h1>
          <p className="text-gray-400 text-sm sm:text-base md:text-lg">Commercial partners powering the world's biggest T20 league</p>
        </div>
      </section>

      {/* ==================== 1. Title Sponsor Timeline ==================== */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mb-10 sm:mb-16">
        <h2 className="text-2xl font-bold text-white mb-2">Title Sponsor Timeline</h2>
        <p className="text-gray-500 text-sm mb-8">The evolution of IPL's title sponsorship from 2008 to present</p>

        <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
          {/* Timeline connector */}
          <div className="relative">
            <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-border" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4 md:gap-3">
              {titleSponsors.map((ts: any, idx: number) => {
                const colors = getSponsorColors(ts.name)
                const isCurrent = ts.years.includes('present')
                return (
                  <div key={idx} className="relative flex flex-col items-center text-center group">
                    {/* Dot on timeline */}
                    <div className={`hidden md:flex w-3 h-3 rounded-full bg-gradient-to-r ${colors.gradient} ring-4 ring-[#0a0a0f] z-10 mb-4 ${isCurrent ? 'animate-pulse' : ''}`} />

                    {/* Card */}
                    <div className={`w-full ${colors.bg} border ${colors.border} rounded-xl p-4 transition hover:scale-[1.02] ${isCurrent ? `ring-1 ${colors.ring} shadow-lg shadow-indigo-500/10` : ''}`}>
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors.gradient} mx-auto flex items-center justify-center mb-3`}>
                        <span className="text-xs font-black text-white">{ts.name.substring(0, 4).toUpperCase()}</span>
                      </div>
                      <h3 className={`font-bold ${colors.text} text-base`}>{ts.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{ts.years}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{ts.industry}</p>
                      <p className="text-[10px] text-gray-600 mt-1">{ts.deal}</p>
                      {ts.note && (
                        <p className="text-[10px] text-amber-500/80 mt-1.5 italic leading-tight">{ts.note}</p>
                      )}
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-semibold rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                          Current
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. Season-by-Season Table ==================== */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mb-10 sm:mb-16">
        <h2 className="text-2xl font-bold text-white mb-2">Season-by-Season Sponsors</h2>
        <p className="text-gray-500 text-sm mb-8">Complete title sponsor and broadcast history from 2008 to 2026</p>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-[#0f0f1a]">
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold">Year</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold">Title Sponsor</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold hidden sm:table-cell">Tournament Name</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold hidden md:table-cell">Broadcast</th>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 uppercase tracking-wider font-semibold hidden lg:table-cell">Notes</th>
                </tr>
              </thead>
              <tbody>
                {seasonYears.map(year => {
                  const s = seasonSummary[year]
                  const colors = getSponsorColors(s.title)
                  const isCurrent = year === '2026'
                  return (
                    <tr
                      key={year}
                      className={`border-b border-border/50 transition hover:bg-white/[0.02] ${isCurrent ? 'bg-indigo-500/[0.05]' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${isCurrent ? 'text-indigo-400' : 'text-white'}`}>
                          {year}
                          {isCurrent && <span className="ml-2 text-[10px] text-indigo-400 font-normal">(current)</span>}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-semibold ${colors.text}`}>{s.title}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 hidden sm:table-cell">{s.name}</td>
                      <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{s.broadcast}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden lg:table-cell">{s.note ?? '\u2014'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ==================== 3. Current Season Partners (2026) ==================== */}
      {partners2026 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4 mb-10 sm:mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">2026 Season Partners</h2>
          <p className="text-gray-500 text-sm mb-8">Official commercial partners for the current IPL season</p>

          {/* Title Sponsor */}
          <div className="mb-8">
            <p className="text-xs text-indigo-400 uppercase tracking-wider font-semibold mb-3">Title Sponsor</p>
            <div className="bg-card border border-indigo-600/30 rounded-2xl p-10 text-center relative overflow-hidden shadow-lg shadow-indigo-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 via-transparent to-violet-600/5" />
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600/20 to-violet-600/10 border border-indigo-500/30 mx-auto flex items-center justify-center mb-4">
                  <span className="text-3xl font-black text-indigo-400 tracking-wider">TATA</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{partners2026.title} Group</h3>
                <p className="text-gray-400 text-sm mt-2">Title Sponsor &middot; "Tata IPL 2026"</p>
                <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Active Partner
                </div>
              </div>
            </div>
          </div>

          {/* Associate Partners */}
          {partners2026.associatePartners?.length > 0 && (
            <div className="mb-8">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Associate Partners</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {partners2026.associatePartners.map((p: string) => (
                  <div key={p} className="bg-card border border-border rounded-2xl p-6 text-center hover:border-accent/20 transition">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500/15 to-violet-600/5 border border-violet-500/20 mx-auto flex items-center justify-center mb-3">
                      <span className="text-sm font-bold text-violet-400">{p.substring(0, 3).toUpperCase()}</span>
                    </div>
                    <h3 className="font-bold text-white">{p}</h3>
                    <p className="text-xs text-gray-500 mt-1">Associate Partner</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Partners */}
          {partners2026.officialPartners?.length > 0 && (
            <div className="mb-8">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Official Partners</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {partners2026.officialPartners.map((p: string) => (
                  <div key={p} className="bg-card border border-border rounded-2xl p-5 text-center hover:border-accent/20 transition">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500/15 to-emerald-600/5 border border-emerald-500/20 mx-auto flex items-center justify-center mb-3">
                      <span className="text-xs font-bold text-emerald-400">{p.substring(0, 4).toUpperCase()}</span>
                    </div>
                    <h3 className="font-semibold text-white text-sm">{p}</h3>
                    <p className="text-[10px] text-gray-500 mt-1">Official Partner</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Role Partners */}
          <div className="mb-8">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Special Role Partners</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {partners2026.strategicTimeout && (
                <div className="bg-card border border-red-500/20 rounded-2xl p-5 hover:border-red-500/30 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/15 to-red-600/5 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-red-400">CEAT</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{partners2026.strategicTimeout}</h3>
                      <p className="text-xs text-gray-500">Strategic Timeout Partner</p>
                    </div>
                  </div>
                </div>
              )}
              {partners2026.umpirePartner && (
                <div className="bg-card border border-amber-500/20 rounded-2xl p-5 hover:border-amber-500/30 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500/15 to-amber-600/5 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-amber-400">WC</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{partners2026.umpirePartner}</h3>
                      <p className="text-xs text-gray-500">Umpire Partner</p>
                    </div>
                  </div>
                </div>
              )}
              {partners2026.aiPartner && (
                <div className="bg-card border border-cyan-500/20 rounded-2xl p-5 hover:border-cyan-500/30 transition">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/15 to-cyan-600/5 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-cyan-400">AI</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">{partners2026.aiPartner}</h3>
                      <p className="text-xs text-gray-500">AI Partner</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Broadcast Partners */}
          <div className="mb-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">Broadcast Partners</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden hover:border-yellow-500/30 transition">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-500/5 to-transparent rounded-bl-full" />
                <div className="relative flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500/15 to-yellow-600/5 border border-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-black text-yellow-400 leading-tight text-center">STAR<br/>SPORTS</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{partners2026.broadcast.tv}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Television Broadcast Partner</p>
                    <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                      Television
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-pink-500/20 rounded-2xl p-6 relative overflow-hidden hover:border-pink-500/30 transition">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-500/5 to-transparent rounded-bl-full" />
                <div className="relative flex items-center gap-5">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500/15 to-pink-600/5 border border-pink-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-black text-pink-400">JIO</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{partners2026.broadcast.digital}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Digital Streaming Partner</p>
                    <span className="inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20">
                      Digital
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Season note */}
          {partners2026.note && (
            <div className="mt-4 bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-400"><span className="font-semibold">Note:</span> {partners2026.note}</p>
            </div>
          )}
        </section>
      )}

      {/* ==================== 4. Broadcast History ==================== */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 mb-10 sm:mb-16">
        <h2 className="text-2xl font-bold text-white mb-2">Broadcast History</h2>
        <p className="text-gray-500 text-sm mb-8">TV and digital broadcast partners across IPL eras</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeline */}
          <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="space-y-6">
              {broadcastHistory.map((era: any, idx: number) => {
                const isCurrent = era.years.includes('present')
                return (
                  <div key={idx} className="relative flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isCurrent ? 'bg-indigo-500 animate-pulse' : 'bg-gray-600'}`} />
                      {idx < broadcastHistory.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                    </div>
                    {/* Content */}
                    <div className={`pb-4 -mt-0.5 ${isCurrent ? 'text-white' : ''}`}>
                      <p className={`font-semibold text-sm ${isCurrent ? 'text-indigo-400' : 'text-gray-300'}`}>{era.years}</p>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-yellow-500" />
                          <span className="text-xs text-gray-400">TV:</span>
                          <span className="text-xs text-gray-200 font-medium">{era.tv}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-pink-500" />
                          <span className="text-xs text-gray-400">Digital:</span>
                          <span className="text-xs text-gray-200 font-medium">{era.digital}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Media Rights Deal Card */}
          {mediaRights && (
            <div className="bg-card border border-accent/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent" />
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Media Rights Deal</h3>
                <p className="text-xs text-gray-500 mb-4">2023-2027 Cycle</p>
                <div className="space-y-3">
                  <div className="bg-[#0f0f1a] rounded-xl p-4 border border-border">
                    <p className="text-xs text-gray-500">Total Value</p>
                    <p className="text-xl font-bold text-accent mt-0.5">{mediaRights.total}</p>
                  </div>
                  <div className="bg-[#0f0f1a] rounded-xl p-3 border border-border">
                    <p className="text-xs text-gray-500">TV Rights ({mediaRights.tvRights.holder})</p>
                    <p className="text-sm font-semibold text-yellow-400 mt-0.5">{mediaRights.tvRights.amount}</p>
                  </div>
                  <div className="bg-[#0f0f1a] rounded-xl p-3 border border-border">
                    <p className="text-xs text-gray-500">Digital Rights ({mediaRights.digitalRights.holder})</p>
                    <p className="text-sm font-semibold text-pink-400 mt-0.5">{mediaRights.digitalRights.amount}</p>
                  </div>
                  <p className="text-[10px] text-amber-500/80 italic mt-2">{mediaRights.note}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ==================== 5. Did You Know? ==================== */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
        <h2 className="text-2xl font-bold text-white mb-2">Did You Know?</h2>
        <p className="text-gray-500 text-sm mb-8">Fascinating commercial facts about the IPL</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {didYouKnowFacts.map((item, i) => (
            <div
              key={i}
              className="bg-card border border-border rounded-2xl p-6 hover:border-accent/20 transition group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent/[0.03] to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <span className="text-lg">{item.icon}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{item.fact}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
