interface Item {
  id: string;
  name: string;
  points: number;
}

interface Props {
  items: Item[];
}

export function Leaderboard({ items }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-white backdrop-blur">
      <h3 className="text-2xl font-black tracking-wide">积分榜</h3>
      <ol className="mt-4 space-y-3">
        {items.map((item, idx) => (
          <li key={item.id} className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-3 font-semibold">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm">#{idx + 1}</span>
              {item.name}
            </span>
            <span className="tabular-nums text-2xl font-black text-brand-secondary">{item.points}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
