interface Props {
  highlights: string[];
}

export function HighlightsMarquee({ highlights }: Props) {
  if (!highlights.length) {
    return <div className="text-white/60">等待高光产生...</div>;
  }
  return (
    <div className="flex gap-6 overflow-hidden text-2xl font-semibold text-white">
      <div className="animate-[scroll_20s_linear_infinite] flex gap-6">
        {highlights.map((item, idx) => (
          <span key={`${item}-${idx}`} className="whitespace-nowrap">
            ✨ {item}
          </span>
        ))}
      </div>
      <style>{
        '@keyframes scroll {0% {transform: translateX(0);} 100% {transform: translateX(-50%);}}'
      }</style>
    </div>
  );
}
