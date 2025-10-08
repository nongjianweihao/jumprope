import type { WarriorPathNode } from '../types/models';

export interface Badge {
  id: string;
  name: string;
  desc?: string;
  icon?: string;
  points?: number;
}

export interface PointRule {
  id: string;
  type: 'attendance' | 'pr' | 'freestyle_pass' | 'coach_bonus' | 'quest_complete';
  label: string;
  value: number;
}

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
  warrior_path?: WarriorPathNode[];
  badges?: Badge[];
  point_rules?: PointRule[];
}

const KEY = 'public_library';

const FALLBACK: PublicLibrary = {
  speed_rank_thresholds: [60, 70, 80, 100, 110, 120, 150, 160, 170],
  rank_moves: [],
  warrior_path: [
    { id: 'path-1', rank: 1, title: '新手训练营', moveIds: [], points: 50 },
    { id: 'path-2', rank: 3, title: '勇士训练场', moveIds: [], points: 100 },
    { id: 'path-3', rank: 6, title: '精英竞技场', moveIds: [], points: 160 },
    { id: 'path-4', rank: 8, title: '至尊决战场', moveIds: [], points: 220 }
  ],
  badges: [
    { id: 'badge-bronze', name: '青铜勇士', points: 30, icon: '🥉', desc: '累计 30 GP' },
    { id: 'badge-silver', name: '白银斗士', points: 80, icon: '🥈', desc: '累计 80 GP' },
    { id: 'badge-gold', name: '黄金战神', points: 150, icon: '🥇', desc: '累计 150 GP' }
  ],
  point_rules: [
    { id: 'rule-att', type: 'attendance', label: '出勤', value: 1 },
    { id: 'rule-pr', type: 'pr', label: '速度 PR', value: 5 },
    { id: 'rule-fs', type: 'freestyle_pass', label: '花样通关', value: 3 },
    { id: 'rule-coach', type: 'coach_bonus', label: '教练奖励', value: 2 },
    { id: 'rule-quest', type: 'quest_complete', label: '勇士任务', value: 8 }
  ]
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
      rank_moves: Array.isArray(lib?.rank_moves) ? lib.rank_moves : FALLBACK.rank_moves,
      warrior_path: Array.isArray(lib?.warrior_path) ? lib.warrior_path : FALLBACK.warrior_path,
      badges: Array.isArray(lib?.badges) ? lib.badges : FALLBACK.badges,
      point_rules: Array.isArray(lib?.point_rules) ? lib.point_rules : FALLBACK.point_rules
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

export function getWarriorPath(): WarriorPathNode[] {
  return getLibrary().warrior_path ?? FALLBACK.warrior_path ?? [];
}

export function getBadges(): Badge[] {
  return getLibrary().badges ?? FALLBACK.badges ?? [];
}

export function getPointRules(): PointRule[] {
  return getLibrary().point_rules ?? FALLBACK.point_rules ?? [];
}
