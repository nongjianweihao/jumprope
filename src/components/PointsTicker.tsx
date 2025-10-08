import { useEffect, useState } from 'react';

interface Props {
  delta: number;
}

export function PointsTicker({ delta }: Props) {
  const [display, setDisplay] = useState(delta);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    setDisplay(delta);
    setPulse(true);
    const timer = window.setTimeout(() => setPulse(false), 600);
    return () => window.clearTimeout(timer);
  }, [delta]);

  const prefix = display >= 0 ? '+' : '';

  return (
    <span
      className={`inline-block text-3xl font-black transition duration-300 ease-out ${
        display >= 0 ? 'text-brand-secondary' : 'text-brand-danger'
      } ${pulse ? 'drop-shadow-[0_0_16px_rgba(148,163,255,0.75)] scale-110' : ''}`}
    >
      {`${prefix}${display}`}
    </span>
  );
}
