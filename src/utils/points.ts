import type { Student, PointEventType } from '../types/models';
import { getLibrary } from '../store/publicLibrary';
import type { Badge, PointRule } from '../store/publicLibrary';

const DEFAULT_POINT_MAP: Record<PointEventType, number> = {
  attendance: 1,
  pr: 5,
  freestyle_pass: 3,
  coach_bonus: 2,
  quest_complete: 8
};

function resolvePointRules(): PointRule[] {
  return getLibrary().point_rules ?? [];
}

export function getPointValue(type: PointEventType): number {
  const rules = resolvePointRules();
  const match = rules.find((rule) => rule.type === type);
  if (match?.value != null) {
    return match.value;
  }
  return DEFAULT_POINT_MAP[type] ?? 0;
}

export function addPoints(current: number, type: PointEventType): number {
  return current + getPointValue(type);
}

export function getBadgeByPoints(points: number): Badge | undefined {
  const badges = (getLibrary().badges ?? []).filter((badge) => typeof badge.points === 'number');
  if (!badges.length) return undefined;
  const sorted = [...badges].sort((a, b) => (a.points ?? 0) - (b.points ?? 0));
  let achieved: Badge | undefined;
  for (const badge of sorted) {
    if (points >= (badge.points ?? 0)) {
      achieved = badge;
    }
  }
  return achieved;
}

export function computeBadgeTransition(student: Student, type: PointEventType) {
  const before = student.pointsTotal ?? 0;
  const after = addPoints(before, type);
  const previousBadge = getBadgeByPoints(before);
  const nextBadge = getBadgeByPoints(after);
  const unlocked = nextBadge && nextBadge.id !== previousBadge?.id ? nextBadge : undefined;
  return { before, after, delta: after - before, unlocked };
}
