import type {
  Recommendation,
  TrainingTemplate,
  FitnessQuality,
  TrainingPlan,
  Drill,
  GameItem
} from '../types/models';
import { nanoid } from './id';

export function recommendTemplateByWeakness(
  weakness: string,
  templates: TrainingTemplate[]
): Recommendation | undefined {
  const candidate = templates.find((template) =>
    template.blocks.some((block) => block.notes?.includes(weakness) || block.title.includes(weakness))
  );
  if (!candidate) return undefined;
  return {
    id: nanoid(),
    studentId: 'temp',
    createdAt: new Date().toISOString(),
    reason: `针对 ${weakness} 的提升建议`,
    templateId: candidate.id,
    applied: false
  };
}

export function findWeakestQuality(
  radar: Record<FitnessQuality, number>
): FitnessQuality | undefined {
  const entries = Object.entries(radar) as [FitnessQuality, number][];
  if (!entries.length) return undefined;
  return entries.sort((a, b) => a[1] - b[1])[0][0];
}

export function suggestPlansByQuality(
  plans: TrainingPlan[],
  drills: Drill[],
  games: GameItem[],
  quality: FitnessQuality
): TrainingPlan[] {
  if (!quality) return plans.slice(0, 3);
  const drillMap = new Map(drills.map((item) => [item.id, item] as const));
  const gameMap = new Map(games.map((item) => [item.id, item] as const));

  const scored = plans.map((plan) => {
    let score = 0;
    plan.schedule.forEach((week) => {
      week.blocks.forEach((block) => {
        block.drillIds?.forEach((id) => {
          const drill = drillMap.get(id);
          if (drill?.qualities.includes(quality)) score += 2;
        });
        block.gameIds?.forEach((id) => {
          const game = gameMap.get(id);
          if (game?.qualities.includes(quality)) score += 1;
        });
      });
    });
    return { plan, score };
  });

  return scored
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.plan);
}
