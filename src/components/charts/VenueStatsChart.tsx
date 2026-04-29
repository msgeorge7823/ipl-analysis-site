// VenueStatsChart — bar chart of a player's runs or average broken down
// by venue. Surfaces "best/worst grounds" patterns on the player profile.
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export interface VenueDatum {
  venue: string;
  runs: number;
  avg: number;
  matches: number;
}

interface VenueStatsChartProps {
  data: VenueDatum[];
}

const TOOLTIP_STYLE = {
  backgroundColor: '#131320',
  border: '1px solid #1e1e3a',
  borderRadius: 8,
  color: '#e2e8f0',
  fontSize: 13,
} as const;

export default function VenueStatsChart({ data }: VenueStatsChartProps) {
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
          dataKey="venue"
          tick={{ fill: '#94a3b8', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={160}
        />

        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          itemStyle={{ color: '#e2e8f0' }}
          labelStyle={{ color: '#94a3b8' }}
          formatter={(value, _name, item) => {
            const d = (item as unknown as { payload: VenueDatum }).payload;
            return [
              `${value} runs (avg ${d.avg.toFixed(1)}, ${d.matches} matches)`,
              'Venue',
            ];
          }}
        />

        <Bar
          dataKey="runs"
          fill="#8b5cf6"
          radius={[0, 6, 6, 0]}
          barSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
