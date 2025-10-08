interface Props {
  rank: number;
}

export function RankBadge({ rank }: Props) {
  const colors = ['bg-zinc-400', 'bg-blue-500', 'bg-purple-600', 'bg-amber-500', 'bg-rose-500'];
  const c = colors[Math.min(colors.length - 1, Math.max(0, Math.floor((rank - 1) / 2)))];
  return (
    <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-white ${c}`}>
      <span className="text-xs tracking-wide">段位</span>
      <b className="text-sm font-semibold">{rank}</b>
    </div>
  );
}
