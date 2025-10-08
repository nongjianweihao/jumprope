export interface PublicLibrary {
  speed_rank_thresholds: number[];
  rank_moves: Array<{
    id: string;
    rank: number;
    name: string;
    tags?: string[];
    description?: string;
    criteria?: string;
  }>;
  warrior_path?: Array<{ id: string; rank: number; title: string; moveIds: string[]; points: number }>;
}

const KEY = 'public_library';

const FALLBACK: PublicLibrary = {
  speed_rank_thresholds: [60, 70, 80, 100, 110, 120, 150, 160, 170],
  rank_moves: []
};

export function getLibrary(): PublicLibrary {
  if (typeof window === 'undefined') return FALLBACK;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return FALLBACK;
    const lib = JSON.parse(raw);
    return {
      ...FALLBACK,
      ...lib,
      speed_rank_thresholds: Array.isArray(lib?.speed_rank_thresholds)
        ? lib.speed_rank_thresholds
        : FALLBACK.speed_rank_thresholds,
      rank_moves: Array.isArray(lib?.rank_moves) ? lib.rank_moves : FALLBACK.rank_moves
    };
  } catch {
    return FALLBACK;
  }
}

export function saveLibrary(next: PublicLibrary) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(KEY, JSON.stringify(next));
}

export function getSpeedThresholds(): number[] {
  return getLibrary().speed_rank_thresholds ?? FALLBACK.speed_rank_thresholds;
}

export function getRankMoves() {
  return getLibrary().rank_moves ?? [];
}
