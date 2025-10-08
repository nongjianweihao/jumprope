import { nanoid } from './id';
export function recommendTemplateByWeakness(weakness, templates) {
    const candidate = templates.find((template) => template.blocks.some((block) => block.notes?.includes(weakness) || block.title.includes(weakness)));
    if (!candidate)
        return undefined;
    return {
        id: nanoid(),
        studentId: 'temp',
        createdAt: new Date().toISOString(),
        reason: `针对 ${weakness} 的提升建议`,
        templateId: candidate.id,
        applied: false
    };
}
