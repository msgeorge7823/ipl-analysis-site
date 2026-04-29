// PhaseRadar — radar/spider chart of a player's phase profile (Powerplay,
// Middle, Death). Optionally overlays a league-average ring so the user
// can see where the player is above or below par.
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export interface PhaseRadarDatum {
  phase: string;
  value: number;
  average?: number;
}

interface PhaseRadarProps {
  data: PhaseRadarDatum[];
}

const TOOLTIP_STYLE = {
  backgroundColor: '#131320',
  border: '1px solid #1e1e3a',
  borderRadius: 8,
  color: '#e2e8f0',
  fontSize: 13,
} as const;

export default function PhaseRadar({ data }: PhaseRadarProps) {
  const hasAverage = data.some((d) => d.average != null);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="#1e1e3a" />
        <PolarAngleAxis
          dataKey="phase"
          tick={{ fill: '#94a3b8', fontSize: 13 }}
        />
        <PolarRadiusAxis
          angle={90}
          tick={{ fill: '#64748b', fontSize: 11 }}
          stroke="#1e1e3a"
        />

        {hasAverage && (
          <Radar
            name="League Average"
            dataKey="average"
            stroke="#94a3b8"
            fill="transparent"
            strokeDasharray="4 4"
            strokeWidth={1.5}
          />
        )}

        <Radar
          name="Player"
          dataKey="value"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.3}
          strokeWidth={2}
        />

        <Tooltip
          contentStyle={TOOLTIP_STYLE}
          itemStyle={{ color: '#e2e8f0' }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
