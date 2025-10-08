interface Props {
  value: number;
  max?: number;
}

export function EnergyBar({ value, max = 100 }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className="h-3 w-full rounded-full bg-slate-200/50">
      <div
        className="h-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-[width] duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
