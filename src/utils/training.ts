import type { TrainingPlan, TrainingTemplate, TemplateBlock } from '../types/models';
import { nanoid } from './id';

type StagePeriodMap = Record<TrainingPlan['stage'], 'PREP' | 'SPEC' | 'COMP'>;

const STAGE_TO_PERIOD: StagePeriodMap = {
  BASIC: 'PREP',
  IMPROVE: 'SPEC',
  ELITE: 'SPEC',
  COMPETE: 'COMP'
};

const TITLE_TO_PERIOD = [
  { keywords: ['热身', '放松', '恢复'], period: 'PREP' as const },
  { keywords: ['挑战', '竞赛', '考核', '冲刺'], period: 'COMP' as const }
];

function mapTitleToPeriod(title: string): 'PREP' | 'SPEC' | 'COMP' {
  const lower = title.toLowerCase();
  for (const rule of TITLE_TO_PERIOD) {
    if (rule.keywords.some((keyword) => lower.includes(keyword))) {
      return rule.period;
    }
  }
  return 'SPEC';
}

export function templateFromPlan(plan: TrainingPlan): TrainingTemplate {
  const referenceWeek = plan.schedule.find((week) => week.weekIndex === 1) ?? plan.schedule[0];
  const blocks: TemplateBlock[] = [];
  if (referenceWeek) {
    referenceWeek.blocks.forEach((block) => {
      blocks.push({
        id: nanoid(),
        title: block.title,
        period: mapTitleToPeriod(block.title),
        durationMin: block.durationMin ?? 10,
        drillIds: block.drillIds,
        gameIds: block.gameIds,
        notes: block.notes
      });
    });
  }

  const durationMinTotal = blocks.reduce((sum, block) => sum + (block.durationMin ?? 0), 0);

  return {
    id: nanoid(),
    name: `${plan.name} · 示例课`,
    period: STAGE_TO_PERIOD[plan.stage],
    weeks: plan.weeks,
    durationMinTotal,
    blocks,
    createdAt: new Date().toISOString()
  };
}
