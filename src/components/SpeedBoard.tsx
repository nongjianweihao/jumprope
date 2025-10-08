interface Item {
  id: string;
  name: string;
  reps: number;
  isPr?: boolean;
}

interface Props {
  windowLabel: string;
  items: Item[];
}

export function SpeedBoard({ windowLabel, items }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur">
      <div className="text-sm uppercase tracking-[0.5em] text-white/60">{windowLabel}</div>
      <h3 className="mt-2 text-2xl font-black">速度榜</h3>
      <ul className="mt-4 space-y-3 text-lg">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <span className="font-semibold">{item.name}</span>
            <span className="flex items-center gap-2">
              <span className="tabular-nums text-2xl font-black">{item.reps}</span>
              {item.isPr ? <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-amber-900">PR</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
