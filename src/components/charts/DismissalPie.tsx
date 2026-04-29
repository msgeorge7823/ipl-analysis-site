// DismissalPie — pie chart of how a batter has been dismissed (caught,
// bowled, lbw, stumped, run-out, ...). Rendered on the player profile.
import type { PieLabelRenderProps } from 'recharts';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export interface DismissalDatum {
  type: string;
  count: number;
}

interface DismissalPieProps {
  data: DismissalDatum[];
}

const DISMISSAL_COLORS: Record<string, string> = {
  caught: '#ef4444',
  bowled: '#6366f1',
  lbw: '#f59e0b',
  stumped: '#8b5cf6',
  run_out: '#10b981',
};

const FALLBACK_COLORS = ['#f472b6', '#38bdf8', '#facc15', '#a78bfa', '#34d399'];

function getColor(type: string, idx: number): string {
  const key = type.toLowerCase().replace(/\s+/g, '_');
  return DISMISSAL_COLORS[key] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
}

const TOOLTIP_STYLE = {
  backgroundColor: '#131320',
  border: '1px solid #1e1e3a',
  borderRadius: 8,
  color: '#e2e8f0',
  fontSize: 13,
} as const;

export default function DismissalPie({ data }: DismissalPieProps) {
  const total = data.reduce((s, d) => s + d.count, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="type"
          cx="50%"
          cy="50%"
          innerRadius="50%"
          outerRadius="80%"
          paddingAngle={2}
          strokeWidth={0}
          label={(props: PieLabelRenderProps) => {
            const name = String(props.name ?? '');
            const pct = Number(props.percent ?? 0);
            return `${name} ${(pct * 100).toFixed(0)}%`;
          }}
        >
          {data.map((entry, idx) => (
            <Cell key={entry.type} fill={getColor(entry.type, idx)} />
          ))}
        </Pie>

        {/* Center label */}
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fill: '#e2e8f0', fontSize: 28, fontWeight: 700 }}
        >
          {total}
        </text>
        <text
          x="50%"
          y="58%"
          textAnchor="middle"
          dominantBaseline="central"
          style={{ fill: '#94a3b8', fontSize: 12 }}
        >
          Dismissals
        </text>

        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          itemStyle={{ color: '#e2e8f0' }}
        />
        <Legend
          wrapperStyle={{ color: '#94a3b8', fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
