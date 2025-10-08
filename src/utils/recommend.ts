import type { Recommendation, TrainingTemplate } from '../types/models';
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
