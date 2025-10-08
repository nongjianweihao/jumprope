import { Radar, RadarChart as ReRadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import type { FitnessQuality } from '../types/models';

interface Props {
  data: Record<FitnessQuality, number>;
  baselineP50?: Record<FitnessQuality, number>;
}

export function RadarChart({ data, baselineP50 }: Props) {
  const chartData = Object.entries(data).map(([key, value]) => ({
    quality: key,
    score: value,
    baseline: baselineP50?.[key as FitnessQuality] ?? 0
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ReRadarChart data={chartData} outerRadius="80%">
        <PolarGrid />
        <PolarAngleAxis dataKey="quality" tick={{ fontSize: 12 }} />
        <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
        <Radar name="当前" dataKey="score" stroke="#4A6CF7" fill="#4A6CF7" fillOpacity={0.4} />
        <Radar name="同龄 P50" dataKey="baseline" stroke="#94A3B8" fill="#94A3B8" fillOpacity={0.2} />
        <Tooltip />
      </ReRadarChart>
    </ResponsiveContainer>
  );
}
