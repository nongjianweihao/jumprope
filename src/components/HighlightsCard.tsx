interface Props {
  highlights: string[];
}

export function HighlightsCard({ highlights }: Props) {
  if (!highlights.length) {
    return (
      <div className="rounded-2xl border border-dashed border-brand-primary/40 bg-white p-4 text-sm text-slate-500">
        本节课尚未生成高光，完成速度/花样录入后自动生成。
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-brand-primary/30 bg-white p-4 shadow-[0_0_30px_rgba(74,108,247,0.15)]">
      <h3 className="text-sm font-semibold text-brand-primary">本节高光</h3>
      <ul className="mt-2 space-y-2 text-sm">
        {highlights.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-brand-primary" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
