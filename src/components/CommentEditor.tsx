import { useState } from 'react';

interface Props {
  onSubmit: (comment: string, tags: string[]) => void;
}

const defaultTags = ['专注', '积极', '配合', '节奏', '技术'];

export function CommentEditor({ onSubmit }: Props) {
  const [comment, setComment] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (tag: string) => {
    setSelected((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-slate-600">课堂点评</h3>
      <div className="flex flex-wrap gap-2 text-xs">
        {defaultTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => toggle(tag)}
            className={`rounded-full border px-3 py-1 ${selected.includes(tag) ? 'border-brand-primary bg-brand-primary/10 text-brand-primary' : 'border-slate-200 text-slate-500 hover:border-brand-primary/40'}`}
          >
            #{tag}
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        className="h-24 w-full rounded-xl border border-slate-200 p-3 text-sm"
        placeholder="记录本节课表现亮点/建议"
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => onSubmit(comment, selected)}
          className="rounded-full bg-brand-primary px-4 py-2 text-sm font-semibold text-white"
        >
          保存点评
        </button>
      </div>
    </div>
  );
}
