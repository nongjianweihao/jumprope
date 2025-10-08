interface Props {
  delta: number;
}

export function PointsTicker({ delta }: Props) {
  const prefix = delta >= 0 ? '+' : '';
  return <span className="text-lg font-black text-brand-secondary animate-bounce">{`${prefix}${delta}`}</span>;
}
