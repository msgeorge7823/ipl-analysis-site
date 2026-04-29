// H2HComparisonChart — side-by-side metric comparison between two players.
// Each metric (avg, SR, runs, etc.) becomes a grouped bar pair so the user
// can see the gap at a glance.
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface PlayerStats {
  name: string;
  stats: Record<string, number>;
}

interface H2HComparisonChartProps {
  player1: PlayerStats;
  player2: PlayerStats;
  metrics: string[];
}

const P1_COLOR = '#6366f1';
const P2_COLOR = '#f59e0b';

const TOOLTIP_STYLE = {
  backgroundColor: '#131320',
  border: '1px solid #1e1e3a',
  borderRadius: 8,
  color: '#e2e8f0',
  fontSize: 13,
} as const;

interface RowDatum {
  metric: string;
  p1: number;
  p2: number;
}

export default function H2HComparisonChart({
  player1,
  player2,
  metrics,
}: H2HComparisonChartProps) {
  // Transform data: player1 values are negative (extend left), player2 positive (extend right)
  const chartData: RowDatum[] = metrics.map((m) => ({
    metric: m,
    p1: -(player1.stats[m] ?? 0),
    p2: player2.stats[m] ?? 0,
  }));

  // Compute symmetric domain
  const maxVal = Math.max(
    ...metrics.map((m) =>
      Math.max(player1.stats[m] ?? 0, player2.stats[m] ?? 0),
    ),
  );
  const domainBound = Math.ceil(maxVal * 1.15);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 8, right: 24, bottom: 8, left: 24 }}
        barGap={0}
      >
        <CartesianGrid stroke="#1e1e3a" horizontal={false} />

        <XAxis
          type="number"
          domain={[-domainBound, domainBound]}
          tick={{ fill: '#94a3b8', fontSize: 11 }}
          axisLine={{ stroke: '#1e1e3a' }}
          tickLine={false}
          tickFormatter={(v: number) => String(Math.abs(v))}
        />
        <YAxis
          type="category"
          dataKey="metric"
          tick={{ fill: '#94a3b8', fontSize: 13 }}
          axisLine={false}
          tickLine={false}
          width={100}
        />

        <ReferenceLine x={0} stroke="#94a3b8" strokeWidth={1} />

        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          itemStyle={{ color: '#e2e8f0' }}
          formatter={(value, name) => {
            const absVal = Math.abs(Number(value));
            const label = name === 'p1' ? player1.name : player2.name;
            return [absVal, label];
          }}
          labelStyle={{ color: '#94a3b8' }}
        />

        <Bar dataKey="p1" name="p1" barSize={18} radius={[4, 0, 0, 4]}>
          {chartData.map((_, i) => (
            <Cell key={`p1-${i}`} fill={P1_COLOR} />
          ))}
        </Bar>
        <Bar dataKey="p2" name="p2" barSize={18} radius={[0, 4, 4, 0]}>
          {chartData.map((_, i) => (
            <Cell key={`p2-${i}`} fill={P2_COLOR} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
