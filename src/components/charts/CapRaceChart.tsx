// CapRaceChart — multi-line chart of cumulative runs (Orange Cap) or
// wickets (Purple Cap) over a season's match dates. Used on SeasonDetail to
// show how the lead changed hands week by week.
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export interface CapRaceEntry {
  player: string
  progression: number[]
}

interface CapRaceChartProps {
  entries: CapRaceEntry[]
  matchDates: string[]
  mode: 'batting' | 'bowling'
}

// 10 distinct colors for player lines
const LINE_COLORS = [
  '#f97316', // orange
  '#6366f1', // indigo
  '#22c55e', // green
  '#ef4444', // red
  '#eab308', // yellow
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#8b5cf6', // violet
  '#14b8a6', // teal
  '#f59e0b', // amber
]

const TOOLTIP_STYLE = {
  backgroundColor: '#131320',
  border: '1px solid #1e1e3a',
  borderRadius: 8,
  color: '#e2e8f0',
  fontSize: 13,
} as const

function formatDateTick(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// `entries` is the top-N candidate set, `matchDates` is the x-axis tick set,
// and `mode` controls whether values render as runs or wickets.
export default function CapRaceChart({ entries, matchDates, mode }: CapRaceChartProps) {
  // Transform data into recharts format: array of objects, one per match
  const chartData = matchDates.map((date, i) => {
    const point: Record<string, string | number> = { date }
    for (const entry of entries) {
      point[entry.player] = entry.progression[i] ?? 0
    }
    return point
  })

  // Determine tick interval so we don't crowd the x-axis
  const tickInterval = Math.max(1, Math.floor(matchDates.length / 10))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid stroke="#1e1e3a" strokeDasharray="3 3" />

        <XAxis
          dataKey="date"
          tickFormatter={formatDateTick}
          interval={tickInterval}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={{ stroke: '#1e1e3a' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={{ stroke: '#1e1e3a' }}
          tickLine={false}
          label={{
            value: mode === 'batting' ? 'Runs' : 'Wickets',
            angle: -90,
            position: 'insideLeft',
            style: { fill: '#94a3b8', fontSize: 12 },
          }}
        />

        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          itemStyle={{ color: '#e2e8f0' }}
          labelStyle={{ color: '#94a3b8' }}
          labelFormatter={(label: any) => formatDateTick(label)}
        />

        <Legend
          wrapperStyle={{ color: '#94a3b8', fontSize: 12, paddingTop: 8 }}
        />

        {entries.map((entry, i) => (
          <Line
            key={entry.player}
            type="monotone"
            dataKey={entry.player}
            stroke={LINE_COLORS[i % LINE_COLORS.length]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
