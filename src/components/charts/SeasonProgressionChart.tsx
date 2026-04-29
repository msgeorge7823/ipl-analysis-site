// SeasonProgressionChart — area chart of one player metric (runs, avg, or
// SR) season-over-season. Lets the user see career arcs and form swings.
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface SeasonDatum {
  season: string;
  runs: number;
  avg: number;
  sr: number;
}

type Metric = 'runs' | 'avg' | 'sr';

interface SeasonProgressionChartProps {
  data: SeasonDatum[];
  metric: Metric;
}

const METRIC_LABELS: Record<Metric, string> = {
  runs: 'Runs',
  avg: 'Average',
  sr: 'Strike Rate',
};

const TOOLTIP_STYLE = {
  backgroundColor: '#131320',
  border: '1px solid #1e1e3a',
  borderRadius: 8,
  color: '#e2e8f0',
  fontSize: 13,
} as const;

const GRADIENT_ID = 'seasonGradient';

export default function SeasonProgressionChart({
  data,
  metric,
}: SeasonProgressionChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={GRADIENT_ID} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="#1e1e3a" strokeDasharray="3 3" />

        <XAxis
          dataKey="season"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={{ stroke: '#1e1e3a' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={{ stroke: '#1e1e3a' }}
          tickLine={false}
          label={{
            value: METRIC_LABELS[metric],
            angle: -90,
            position: 'insideLeft',
            style: { fill: '#94a3b8', fontSize: 12 },
          }}
        />

        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          itemStyle={{ color: '#e2e8f0' }}
          labelStyle={{ color: '#94a3b8' }}
        />

        <Area
          type="monotone"
          dataKey={metric}
          stroke="#6366f1"
          strokeWidth={2}
          fill={`url(#${GRADIENT_ID})`}
          dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#818cf8', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
