import { useState, useEffect } from 'react';

interface Slide {
  id: string;
  title: string;
  description: string;
}

interface Props {
  slides: Slide[];
  interval?: number;
}

export function WallboardCarousel({ slides, interval = 8000 }: Props) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [slides.length, interval]);

  if (!slides.length) {
    return <div className="flex h-full items-center justify-center text-xl text-white/60">暂无壁板内容</div>;
  }

  const slide = slides[index];
  return (
    <div className="flex h-full flex-col items-start justify-center gap-4 p-8 text-white">
      <div className="text-sm uppercase tracking-[0.4em] text-white/60">Wallboard</div>
      <h2 className="text-4xl font-black tracking-wide">{slide.title}</h2>
      <p className="max-w-2xl text-2xl text-white/90">{slide.description}</p>
    </div>
  );
}
