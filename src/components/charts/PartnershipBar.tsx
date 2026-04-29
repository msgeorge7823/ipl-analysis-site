// PartnershipBar — horizontal bar chart of a player's largest batting
// partnerships. Used on the player profile to show favourite partners.
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface PartnershipDatum {
  partner: string;
  runs: number;
  balls: number;
  matches: number;
}

interface PartnershipBarProps {
  data: PartnershipDatum[];
}

const TOOLTIP_STYLE = {
  backgroundColor: '#131320',
  border: '1px solid #1e1e3a',
  borderRadius: 8,
  color: '#e2e8f0',
  fontSize: 13,
} as const;

export default function PartnershipBar({ data }: PartnershipBarProps) {
  const sorted = [...data].sort((a, b) => b.runs - a.runs);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={sorted}
        layout="vertical"
        margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
      >
        <CartesianGrid stroke="#1e1e3a" horizontal={false} />

        <XAxis
          type="number"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={{ stroke: '#1e1e3a' }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="partner"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={120}
        />

        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          itemStyle={{ color: '#e2e8f0' }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(value, _name, item) => {
            const d = (item as unknown as { payload: PartnershipDatum }).payload;
            return [
              `${value} runs (${d.balls}b, ${d.matches} matches)`,
              'Partnership',
            ];
          }}
        />

        <Bar
          dataKey="runs"
          fill="#6366f1"
          radius={[0, 6, 6, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
