import { useEffect, useState } from 'react';

interface Props {
  name: string;
  desc?: string;
  icon?: string;
}

export function BadgeShowcase({ name, desc, icon }: Props) {
  const [scale, setScale] = useState(0.9);
  const [angle, setAngle] = useState(0);

  useEffect(() => {
    setScale(1);
    const sequence = [0, 8, -8, 0];
    let index = 0;
    const timer = window.setInterval(() => {
      index = (index + 1) % sequence.length;
      setAngle(sequence[index]);
    }, 1500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div
      className="flex items-center gap-3 rounded-3xl bg-gradient-to-r from-yellow-100 via-amber-100 to-orange-100 p-4 shadow-inner transition-all duration-500"
      style={{ transform: `scale(${scale})`, opacity: scale }}
    >
      <span
        className="text-4xl drop-shadow-[0_0_12px_rgba(250,204,21,0.5)] transition-transform duration-500"
        style={{ transform: `rotate(${angle}deg)` }}
      >
        {icon ?? '🏅'}
      </span>
      <div>
        <div className="text-base font-bold text-amber-700">{name}</div>
        {desc ? <div className="text-xs text-amber-600">{desc}</div> : null}
      </div>
    </div>
  );
}
