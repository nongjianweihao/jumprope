import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface SeriesPoint {
  date: string;
  score: number;
}

interface Props {
  series: SeriesPoint[];
  title?: string;
  unit?: string;
}

export function ProgressChart({ series, title, unit }: Props) {
  return (
    <div className="space-y-2">
      {title ? <h3 className="text-sm font-semibold text-slate-600">{title}</h3> : null}
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={series}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} width={32} unit={unit} />
          <Tooltip />
          <Area type="monotone" dataKey="score" stroke="#4A6CF7" fill="#4A6CF7" fillOpacity={0.2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
