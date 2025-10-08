import { useEffect, useState } from 'react';

export interface Quest {
  id: string;
  title: string;
  desc: string;
  done: boolean;
}

interface Props {
  initial: Quest[];
  onChange?: (quests: Quest[]) => void;
}

export function QuestTracker({ initial, onChange }: Props) {
  const [quests, setQuests] = useState<Quest[]>(initial);

  useEffect(() => {
    setQuests(initial);
  }, [initial]);

  const toggle = (id: string) => {
    const next = quests.map((quest) => (quest.id === id ? { ...quest, done: !quest.done } : quest));
    setQuests(next);
    onChange?.(next);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-slate-600">勇士任务</h3>
      <ul className="mt-3 space-y-2 text-sm">
        {quests.map((quest) => (
          <li key={quest.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={quest.done}
              onChange={() => toggle(quest.id)}
              className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
            />
            <span className={quest.done ? 'text-slate-400 line-through' : ''}>
              {quest.title}
              <span className="ml-2 text-xs text-slate-400">{quest.desc}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
