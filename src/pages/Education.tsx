// Education page (/education).
// Reference content for newcomers: IPL rules, format, terminology,
// scoring conventions. Renders a series of accordion sections.
import React, { useState } from 'react'
import Breadcrumb from '@/components/ui/Breadcrumb'

interface AccordionItem {
  id: string
  title: string
  iconBg: string
  iconColor: string
  icon: React.ReactNode
  formula: string
  description: string
  example?: {
    initials: string
    name: string
    colorClass: string
    detail: string
    formulaCalc: string
    result: string
  }
}

const accordionItems: AccordionItem[] = [
  {
    id: 'batting-average',
    title: 'Batting Average',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    formula: 'Batting Average = Runs Scored \u00F7 (Innings \u2212 Not Outs)',
    description: 'Batting average is one of the most fundamental statistics in cricket. It measures the average number of runs a batter scores per completed innings. A higher batting average indicates a more consistent and reliable batter. The "Not Outs" are subtracted from total innings because in those innings the batter did not have the opportunity to be dismissed, so including them would unfairly lower the average.',
    example: {
      initials: 'VK',
      name: 'Virat Kohli',
      colorClass: 'from-red-500/20 to-red-600/10 border-red-500/20 text-red-400',
      detail: '8,004 runs in 232 innings with 17 not outs',
      formulaCalc: '8004 \u00F7 (232 \u2212 17) = ',
      result: '37.25',
    },
  },
  {
    id: 'strike-rate',
    title: 'Strike Rate',
    iconBg: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
    formula: 'Strike Rate = (Runs Scored \u00F7 Balls Faced) \u00D7 100',
    description: 'Strike rate measures how quickly a batter scores runs. In T20 cricket like the IPL, a high strike rate is crucial as teams need to score as many runs as possible within the limited 20 overs. A strike rate of 150 means the batter scores 150 runs per 100 balls faced on average.',
    example: {
      initials: 'AB',
      name: 'AB de Villiers',
      colorClass: 'from-green-500/20 to-green-600/10 border-green-500/20 text-green-400',
      detail: '3,403 runs off 2,218 balls',
      formulaCalc: '(3403 \u00F7 2218) \u00D7 100 = ',
      result: '151.69',
    },
  },
  {
    id: 'bowling-average',
    title: 'Bowling Average',
    iconBg: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
    formula: 'Bowling Average = Runs Conceded \u00F7 Wickets Taken',
    description: 'Bowling average indicates how many runs a bowler concedes per wicket taken. A lower bowling average is better, as it means the bowler takes wickets at a lower cost. In T20 cricket, a bowling average under 25 is generally considered excellent.',
    example: {
      initials: 'JB',
      name: 'Jasprit Bumrah',
      colorClass: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
      detail: '3,200 runs conceded for 165 wickets',
      formulaCalc: '3200 \u00F7 165 = ',
      result: '19.39',
    },
  },
  {
    id: 'economy-rate',
    title: 'Economy Rate',
    iconBg: 'bg-orange-500/10',
    iconColor: 'text-orange-400',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    formula: 'Economy Rate = Runs Conceded \u00F7 Overs Bowled',
    description: 'Economy rate measures how many runs a bowler concedes per over. In IPL cricket, where batsmen are extremely aggressive, an economy rate under 8 is considered very good. This stat is particularly important in T20 cricket as it shows how well a bowler restricts scoring.',
  },
  {
    id: 'bowling-strike-rate',
    title: 'Bowling Strike Rate',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    formula: 'Bowling SR = Balls Bowled \u00F7 Wickets Taken',
    description: 'Bowling strike rate tells you how frequently a bowler takes wickets, measured in balls per wicket. A lower bowling strike rate is better. In T20s, a bowling strike rate under 18 is considered excellent as it means the bowler takes a wicket roughly every 3 overs.',
  },
  {
    id: 'net-run-rate',
    title: 'Net Run Rate (NRR)',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-400',
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>,
    formula: 'NRR = (Runs scored / Overs faced) \u2212 (Runs conceded / Overs bowled)',
    description: 'Net Run Rate is used to separate teams that finish on the same number of points in the league stage. It is the difference between the rate at which a team scores and the rate at which it concedes runs. A positive NRR means the team is scoring faster than they are being scored against. NRR is crucial in IPL as it often decides playoff qualification.',
  },
]

function DLSCalculator() {
  const [oversRemaining, setOversRemaining] = useState(15)
  const [wicketsLost, setWicketsLost] = useState(3)
  const [targetScore, setTargetScore] = useState(185)
  const [result, setResult] = useState<number | null>(null)

  const calculate = () => {
    // Simplified DLS approximation for educational purposes
    const resourcePercentage = (oversRemaining / 20) * ((10 - wicketsLost) / 10)
    const revised = Math.round(targetScore * resourcePercentage) + 1
    setResult(revised)
  }

  return (
    <section className="max-w-4xl mx-auto px-4 mb-20">
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-6 md:p-8 border-b border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Duckworth-Lewis-Stern Calculator</h2>
              <p className="text-sm text-gray-400 mt-0.5">Calculate revised targets for rain-affected matches</p>
            </div>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-3 gap-5 mb-6">
            <div>
              <label className="block text-sm text-gray-400 font-medium mb-2">Overs Remaining</label>
              <input
                type="number"
                value={oversRemaining}
                onChange={e => setOversRemaining(Number(e.target.value))}
                className="w-full bg-[#0f0f1a] border border-border rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-accent transition placeholder-gray-600"
                placeholder="0"
                min={0}
                max={20}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 font-medium mb-2">Wickets Lost</label>
              <input
                type="number"
                value={wicketsLost}
                onChange={e => setWicketsLost(Number(e.target.value))}
                className="w-full bg-[#0f0f1a] border border-border rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-accent transition placeholder-gray-600"
                placeholder="0"
                min={0}
                max={10}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 font-medium mb-2">Target Score</label>
              <input
                type="number"
                value={targetScore}
                onChange={e => setTargetScore(Number(e.target.value))}
                className="w-full bg-[#0f0f1a] border border-border rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-accent transition placeholder-gray-600"
                placeholder="0"
              />
            </div>
          </div>
          <button
            onClick={calculate}
            className="w-full md:w-auto px-8 py-3 bg-accent hover:bg-[#4f46e5] text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-accent/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            Calculate
          </button>

          {result !== null && (
            <div className="mt-6 bg-[#0f0f1a] border border-accent/20 rounded-xl p-6 glow">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">DLS Result</p>
              </div>
              <div className="flex items-baseline gap-3">
                <p className="text-4xl font-extrabold text-white">{result}</p>
                <p className="text-lg text-gray-400">Revised Target</p>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Based on {oversRemaining} overs remaining with {wicketsLost} wickets lost, chasing {targetScore}. The batting team needs {result} runs from the remaining overs to win.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function Education() {
  const [openId, setOpenId] = useState<string | null>('batting-average')

  const toggle = (id: string) => {
    setOpenId(prev => prev === id ? null : id)
  }

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-emerald-900/5" />
        <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 pt-8 sm:pt-12 md:pt-16 pb-6 sm:pb-10">
          <Breadcrumb items={[{ label: 'Education' }]} />
          <div className="max-w-2xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-2 sm:mb-3">Learn Cricket Statistics</h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-400">Understand the numbers behind the game</p>
          </div>
        </div>
      </section>

      {/* Accordion Sections */}
      <section className="max-w-4xl mx-auto px-3 sm:px-4 mb-10 sm:mb-16">
        <div className="space-y-3">
          {accordionItems.map(item => {
            const isOpen = openId === item.id
            return (
              <div
                key={item.id}
                className={`bg-card border rounded-2xl overflow-hidden transition-colors ${isOpen ? 'border-accent/20 glow' : 'border-border hover:border-border/80'}`}
              >
                <button
                  onClick={() => toggle(item.id)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`shrink-0 w-9 h-9 rounded-lg ${item.iconBg} flex items-center justify-center ${item.iconColor}`}>
                      {item.icon}
                    </div>
                    <span className="text-base sm:text-lg font-bold text-white truncate">{item.title}</span>
                  </div>
                  <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? 'text-accent rotate-180' : 'text-gray-500'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6">
                    <div className="mb-5 rounded-xl p-4 px-5 font-mono font-semibold text-accentLight text-base sm:text-lg tracking-wide overflow-x-auto" style={{
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.02) 100%)',
                      border: '1px solid rgba(99,102,241,0.15)',
                    }}>
                      <span className="whitespace-nowrap">{item.formula}</span>
                    </div>
                    <p className="text-gray-400 leading-relaxed mb-5">{item.description}</p>
                    {item.example && (
                      <div className="bg-[#0f0f1a] border border-border rounded-xl p-5">
                        <p className="text-xs text-accent uppercase tracking-wider font-semibold mb-3">Example</p>
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.example.colorClass} border flex items-center justify-center flex-shrink-0`}>
                            <span className="text-xs font-bold">{item.example.initials}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-white">{item.example.name}</p>
                            <p className="text-sm text-gray-400 mt-1">{item.example.detail}</p>
                            <div className="mt-3 rounded-xl p-4 px-5 font-mono font-semibold text-accentLight text-sm sm:text-base tracking-wide overflow-x-auto" style={{
                              background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(99,102,241,0.02) 100%)',
                              border: '1px solid rgba(99,102,241,0.15)',
                            }}>
                              <span className="whitespace-nowrap">{item.example.formulaCalc}<span className="text-white">{item.example.result}</span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* DLS Calculator */}
      <DLSCalculator />
    </div>
  )
}
